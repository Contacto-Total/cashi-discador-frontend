import { Injectable, NgZone } from '@angular/core';
import { Subject, fromEvent, merge, timer, interval } from 'rxjs';
import { debounceTime, tap, switchMap } from 'rxjs/operators';
import { SessionConfigService } from './session-config.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class InactivityService {
  private inactivityTimer$ = new Subject<void>();
  private warningTimer$ = new Subject<void>();
  private lastActivityTime: number = Date.now();
  private checkInterval: any;
  private warningEmitted: boolean = false; // Flag para emitir warning solo una vez

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
    private authService: AuthService
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
  }

  getTiempoRestante(): number {
    const tiempoInactivo = Math.floor((Date.now() - this.lastActivityTime) / 1000);
    const timeoutInactividad = this.sessionConfig.getTimeoutInactividad();
    return Math.max(0, timeoutInactividad - tiempoInactivo);
  }
}
