import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { AuthService } from './auth.service';
import { AgentStatusService } from './agent-status.service';
import { AgentState } from '../models/agent-status.model';

/**
 * Saca al asesor de la cola cuando se va a una pantalla que no tiene regla de estado.
 *
 * Hoy un asesor puede quedarse en DISPONIBLE mirando el Ranking o un reporte y recibir
 * una llamada igual. Al navegar a una pantalla sin regla pasa a EN_LINEA: sigue conectado
 * y el reporte lo cuenta, pero el discador no lo toma, porque todas sus consultas filtran
 * por estado_actual = 'DISPONIBLE'.
 *
 * SOLO actua si el estado actual es DISPONIBLE. Nunca pisa:
 *   - un estado del sistema (EN_LLAMADA, TIPIFICANDO, SEGUIMIENTO)
 *   - una pausa que el asesor eligio (BREAK, COMIDA, SSHH, AUSENTE, SOPORTE, reuniones)
 * Si esta en break y navega, sigue en break.
 *
 * Tampoco hace falta mirar el rol: un supervisor que no esta en DISPONIBLE no se ve
 * afectado, y uno que si lo esta tambien deberia salir de la cola al irse de la pantalla.
 */
@Injectable({ providedIn: 'root' })
export class AgentPresenceService {

  /**
   * Pantallas que manejan su propio estado y por lo tanto quedan exentas.
   * Se comparan contra el inicio de la URL, asi que '/whatsapp' cubre tambien
   * '/whatsapp/dashboard' y '/whatsapp/history'.
   *
   * OJO: si agregas una pantalla que setea estado, sumala a esta lista o el listener
   * se lo va a pisar apenas el asesor entre.
   */
  private static readonly RUTAS_CON_ESTADO_PROPIO = [
    '/agent-dashboard',
    '/collection-management',
    '/manual-management',
    '/seguimiento',
    '/whatsapp',
    '/wsp2'
  ];

  private sub?: Subscription;

  constructor(
    private router: Router,
    private auth: AuthService,
    private agentStatus: AgentStatusService
  ) {}

  iniciar(): void {
    if (this.sub) { return; }
    this.sub = this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(e => this.alNavegar(e.urlAfterRedirects || e.url));
  }

  detener(): void {
    this.sub?.unsubscribe();
    this.sub = undefined;
  }

  private alNavegar(url: string): void {
    if (this.tieneEstadoPropio(url)) { return; }

    const idUsuario = this.auth.getCurrentUserId();
    if (!idUsuario) { return; }

    // Estado cacheado. Lo mantienen al dia el WebSocket y el polling de 30s del
    // AgentStatusService, asi que esto no agrega ninguna llamada HTTP por navegacion.
    const actual = this.agentStatus.getCurrentStatus();
    if (actual?.estadoActual !== AgentState.DISPONIBLE) { return; }

    this.agentStatus.changeStatus(idUsuario, {
      estado: AgentState.EN_LINEA,
      notas: 'Salio de la cola al abrir una pantalla sin regla de estado'
    }).subscribe({
      error: err => console.error('[AgentPresence] No se pudo pasar a EN_LINEA', err)
    });
  }

  private tieneEstadoPropio(url: string): boolean {
    const limpia = (url || '').split('?')[0];
    return AgentPresenceService.RUTAS_CON_ESTADO_PROPIO.some(
      ruta => limpia === ruta || limpia.startsWith(ruta + '/')
    );
  }
}
