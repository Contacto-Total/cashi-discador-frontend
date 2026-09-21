import { Injectable, NgZone } from '@angular/core';
import { Subject, fromEvent, merge, timer, interval } from 'rxjs';
import { debounceTime, tap, switchMap } from 'rxjs/operators';
import { SessionConfigService } from './session-config.service';
import { AuthService } from './auth.service';
import { AsistenciaService } from '../../features/asistencia/asistencia.service';

@Injectable({
  providedIn: 'root'
})
export class InactivityService {
  private inactivityTimer$ = new Subject<void>();
  private warningTimer$ = new Subject<void>();
  private lastActivityTime: number = Date.now();
  private checkInterval: any;
  private warningEmitted: boolean = false; // Flag para emitir warning solo una vez
  /** Cuándo se avisó por última vez de que hay actividad. */
  private ultimoAviso = 0;

  // Eventos que resetean el contador de inactividad
  private activityEvents$ = merge(
    fromEvent(document, 'mousedown'),
    fromEvent(document, 'keypress'),
    fromEvent(document, 'scroll'),
    fromEvent(document, 'touchstart'),
    fromEvent(document, 'click')
  );

  // Observables públicos para que los componentes se suscriban
  public onWarning$ = this.warningTimer$.asObservable();
  public onTimeout$ = this.inactivityTimer$.asObservable();

  constructor(
    private ngZone: NgZone,
    private sessionConfig: SessionConfigService,
    private authService: AuthService,
    private asistencia: AsistenciaService
  ) {}

  iniciar(): void {
    // Solo iniciar si el usuario está autenticado
    if (!this.authService.isAuthenticated()) {
      return;
    }

    this.lastActivityTime = Date.now();
    this.warningEmitted = false; // Resetear flag al iniciar

    // Escuchar eventos de actividad del usuario
    this.activityEvents$
      .pipe(debounceTime(1000)) // Evitar múltiples eventos en poco tiempo
      .subscribe(() => {
        this.lastActivityTime = Date.now();
      });

    // Verificar inactividad cada segundo
    this.ngZone.runOutsideAngular(() => {
      this.checkInterval = setInterval(() => {
        this.verificarInactividad();
      }, 1000);
    });
  }

  detener(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  private verificarInactividad(): void {
    const tiempoInactivo = Math.floor((Date.now() - this.lastActivityTime) / 1000);
    const timeoutInactividad = this.sessionConfig.getTimeoutInactividad();
    const timeoutWarning = this.sessionConfig.getTimeoutWarning();

    // Calcular cuándo debe aparecer la advertencia
    const tiempoParaAdvertencia = timeoutInactividad - timeoutWarning;

    if (tiempoInactivo >= timeoutInactividad) {
      // Tiempo agotado - cerrar sesión
      this.ngZone.run(() => {
        this.inactivityTimer$.next();
        this.detener();
      });
    } else if (tiempoInactivo >= tiempoParaAdvertencia && !this.warningEmitted) {
      // Mostrar advertencia (solo una vez)
      this.warningEmitted = true;
      this.ngZone.run(() => {
        this.warningTimer$.next();
      });
    }
  }

  resetearContador(): void {
    this.lastActivityTime = Date.now();
    this.warningEmitted = false; // Resetear flag al continuar sesión
    this.avisarAsistencia();
  }

  /**
   * Avisa al backend de que la persona sigue trabajando.
   *
   * De esta señal sale la hora de SALIDA del día: se registra con la última
   * actividad que apuntó el servidor, no con la que mande el navegador al
   * cerrar —una pestaña que se cierra de golpe no manda nada—.
   *
   * Como mucho una vez por minuto: cada tecla y cada clic pasan por aquí, y
   * mandarlo todo sería un aviso por pulsación. Y nunca desde el sondeo de
   * fondo: si contara el sondeo, una pestaña olvidada marcaría presencia hasta
   * que se apague la máquina.
   */
  private avisarAsistencia(): void {
    const ahora = Date.now();
    if (ahora - this.ultimoAviso < 60_000 || !this.authService.getToken()) {
      return;
    }
    this.ultimoAviso = ahora;
    // Fuera de la zona de Angular: es un ping de fondo y no tiene por qué
    // disparar un ciclo de detección de cambios en toda la aplicación.
    this.ngZone.runOutsideAngular(() => {
      this.asistencia.avisarActividad().subscribe({
        error: () => { /* si se pierde un aviso, el siguiente minuto lo arregla */ }
      });
    });
  }

  getTiempoRestante(): number {
    const tiempoInactivo = Math.floor((Date.now() - this.lastActivityTime) / 1000);
    const timeoutInactividad = this.sessionConfig.getTimeoutInactividad();
    return Math.max(0, timeoutInactividad - tiempoInactivo);
  }
}
