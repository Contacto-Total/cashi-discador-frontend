import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { distinctUntilChanged, filter } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { AgentStatusService } from './agent-status.service';
import { WebsocketService } from './websocket.service';
import { AgentState } from '../models/agent-status.model';

/**
 * Cierra la sesión del asesor cuando el backend lo dejó DESCONECTADO.
 *
 * El backend lo marca DESCONECTADO si se queda 15 s sin WebSocket (cerró la pestaña,
 * se le cortó la red, suspendió el equipo), pero el navegador no se enteraba: el token
 * seguía en el localStorage y el asesor seguía trabajando —o volvía a entrar sin
 * login— con un estado que dice que está fuera.
 *
 * Revisa el estado en tres momentos:
 *   - al llegar el aviso de cambio de estado por el WebSocket
 *   - cada vez que el WebSocket (re)conecta: el aviso de DESCONECTADO salió mientras
 *     estaba caído y se perdió
 *   - al arrancar la app, que cubre la sesión recuperada al reabrir el navegador
 *
 * No cierra al asesor recién logueado: queda DESCONECTADO hasta que la pantalla de
 * agente lo pasa a EN_LINEA, y si entra por otra pantalla puede seguir así un rato.
 * Por eso solo cierra si esta pestaña ya lo vio conectado, o si la sesión no se abrió
 * en esta pestaña (se recuperó del localStorage).
 *
 * Solo para AGENT/ASESOR: admin y supervisor no tienen estado de agente que mirar.
 */
@Injectable({ providedIn: 'root' })
export class SesionDesconexionService {

  /** Esta pestaña ya vio al asesor en un estado distinto de DESCONECTADO. */
  private static readonly VISTO_CONECTADO_KEY = 'cashi_visto_conectado';
  private static readonly ROLES_AGENTE = ['AGENT', 'ASESOR'];

  private subs: Subscription[] = [];
  private cerrar = new Subject<void>();
  /** Emite cuando hay que cerrar la sesión. Lo atiende AppComponent, que sabe cerrar todo. */
  public cerrar$: Observable<void> = this.cerrar.asObservable();

  constructor(
    private auth: AuthService,
    private agentStatus: AgentStatusService,
    private websocket: WebsocketService
  ) {}

  iniciar(): void {
    if (this.subs.length) { return; }

    const user = this.auth.getCurrentUser();
    if (!user || !SesionDesconexionService.ROLES_AGENTE.includes(user.role)) { return; }
    const idUsuario = user.id;

    // El estado cacheado lo actualizan el aviso del WebSocket y cualquier consulta HTTP
    // (polling de la pantalla de agente, overlay, la revisión de abajo).
    this.subs.push(this.agentStatus.currentStatus$.subscribe(status => {
      if (status && status.idUsuario === idUsuario) { this.evaluar(status.estadoActual); }
    }));

    // Mantiene vivo el aviso en tiempo real aunque no esté abierta la pantalla de agente.
    this.subs.push(this.agentStatus.subscribeToStatusUpdates(idUsuario).subscribe());

    // Cada conexión del WebSocket, la primera y las reconexiones, revisa el estado.
    // La primera cubre también el arranque con una sesión recuperada.
    this.subs.push(this.websocket.connectionStatus$.pipe(
      distinctUntilChanged(),
      filter(conectado => conectado)
    ).subscribe(() => this.revisar(idUsuario)));
  }

  detener(): void {
    this.subs.forEach(s => s.unsubscribe());
    this.subs = [];
    sessionStorage.removeItem(SesionDesconexionService.VISTO_CONECTADO_KEY);
    // currentStatus$ repite el último valor al suscribirse. Si quedara el de esta sesión,
    // el próximo login en la pestaña lo tomaría como "visto conectado" y lo cerraría
    // apenas viera el DESCONECTADO normal de recién entrado.
    this.agentStatus.clearCurrentStatus();
  }

  private revisar(idUsuario: number): void {
    // Un 404 (sin estado todavía) o un error de red no dicen nada: no se cierra.
    this.agentStatus.getAgentStatus(idUsuario).subscribe({ error: () => {} });
  }

  private evaluar(estado: AgentState): void {
    if (estado !== AgentState.DESCONECTADO) {
      sessionStorage.setItem(SesionDesconexionService.VISTO_CONECTADO_KEY, '1');
      return;
    }
    const vistoConectado = sessionStorage.getItem(SesionDesconexionService.VISTO_CONECTADO_KEY) === '1';
    if (vistoConectado || !this.auth.esLoginDeEstaPestana()) {
      console.log('[SesionDesconexion] Agente DESCONECTADO en backend - cerrando sesión');
      this.detener();
      this.cerrar.next();
    }
  }
}
