import { Component, OnInit, OnDestroy, signal, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { interval, Subscription } from 'rxjs';
import { InactivityService } from '../../../core/services/inactivity.service';
import { SessionConfigService } from '../../../core/services/session-config.service';

@Component({
  selector: 'app-session-warning-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="session-warning-dialog" [class.dark-mode]="isDarkMode()">
      <div class="session-warning-header">
        <div class="session-warning-badge">
          <mat-icon>schedule</mat-icon>
        </div>
        <h2 class="session-warning-title">Sesión por expirar</h2>
        <p class="session-warning-subtitle">Tu sesión está a punto de expirar por inactividad</p>
      </div>

      <div class="session-warning-body">
        <div class="session-countdown-container">
          <div class="session-countdown-circle" [class.critical]="tiempoRestante <= 10">
            <span class="session-countdown-number">{{ tiempoRestante }}</span>
            <span class="session-countdown-label">segundos</span>
          </div>
        </div>

        <div class="session-progress-container">
          <div class="session-progress-bar">
            <div
              class="session-progress-fill"
              [class.critical]="tiempoRestante <= 10"
              [style.width.%]="progreso">
            </div>
          </div>
          <span class="session-progress-text">Tiempo restante</span>
        </div>
      </div>

      <div class="session-warning-actions">
        <button mat-button class="session-btn-secondary" (click)="cerrarSesion()">
          <mat-icon>logout</mat-icon>
          <span>Cerrar sesión</span>
        </button>
        <button mat-flat-button class="session-btn-primary" (click)="continuarSesion()">
          <mat-icon>refresh</mat-icon>
          <span>Continuar sesión</span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    /* Estilos del panel del diálogo */
    .session-warning-panel {
      background: transparent !important;
    }
    .session-warning-panel .mat-mdc-dialog-container {
      background: transparent !important;
      box-shadow: none !important;
    }
    .session-warning-panel .mat-mdc-dialog-surface {
      background: transparent !important;
      box-shadow: none !important;
      overflow: visible !important;
    }

    .session-warning-dialog {
      padding: 28px;
      min-width: 380px;
      max-width: 420px;
      background: #ffffff !important;
      border-radius: 16px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    }
    .session-warning-dialog.dark-mode {
      background: #1e293b !important;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
    }

    .session-warning-header {
      text-align: center;
      margin-bottom: 24px;
      background: transparent !important;
      border: none !important;
      padding: 0 !important;
    }

    .session-warning-badge {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
      box-shadow: 0 8px 24px rgba(245, 158, 11, 0.35);
      animation: pulse-warning 2s ease-in-out infinite;
    }
    @keyframes pulse-warning {
      0%, 100% { transform: scale(1); box-shadow: 0 8px 24px rgba(245, 158, 11, 0.35); }
      50% { transform: scale(1.05); box-shadow: 0 12px 32px rgba(245, 158, 11, 0.45); }
    }
    .session-warning-badge mat-icon {
      color: white !important;
      font-size: 36px;
      width: 36px;
      height: 36px;
    }

    .session-warning-title {
      margin: 0 0 8px 0 !important;
      font-size: 1.4rem !important;
      font-weight: 600 !important;
      color: #1e293b !important;
    }
    .dark-mode .session-warning-title {
      color: #f1f5f9 !important;
    }

    .session-warning-subtitle {
      margin: 0 !important;
      font-size: 0.9rem !important;
      color: #64748b !important;
    }
    .dark-mode .session-warning-subtitle {
      color: #94a3b8 !important;
    }

    .session-warning-body {
      margin-bottom: 24px;
    }

    .session-countdown-container {
      display: flex;
      justify-content: center;
      margin-bottom: 20px;
    }

    .session-countdown-circle {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      border: 4px solid #f59e0b;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }
    .dark-mode .session-countdown-circle {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      border-color: #fbbf24;
    }
    .session-countdown-circle.critical {
      border-color: #ef4444;
      animation: pulse-critical 0.5s ease-in-out infinite;
    }
    @keyframes pulse-critical {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.03); }
    }

    .session-countdown-number {
      font-size: 2.2rem;
      font-weight: 700;
      color: #f59e0b;
      line-height: 1;
    }
    .dark-mode .session-countdown-number {
      color: #fbbf24;
    }
    .session-countdown-circle.critical .session-countdown-number {
      color: #ef4444 !important;
    }

    .session-countdown-label {
      font-size: 0.7rem;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-top: 2px;
    }
    .dark-mode .session-countdown-label {
      color: #94a3b8;
    }

    .session-progress-container {
      text-align: center;
    }

    .session-progress-bar {
      height: 6px;
      background: #e2e8f0;
      border-radius: 3px;
      overflow: hidden;
      margin-bottom: 8px;
    }
    .dark-mode .session-progress-bar {
      background: #334155;
    }

    .session-progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%);
      border-radius: 3px;
      transition: width 0.1s linear;
    }
    .session-progress-fill.critical {
      background: linear-gradient(90deg, #ef4444 0%, #f87171 100%);
    }

    .session-progress-text {
      font-size: 0.75rem;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .session-warning-actions {
      display: flex;
      gap: 12px;
      justify-content: stretch;
    }

    .session-btn-secondary {
      flex: 1;
      display: inline-flex !important;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 14px 20px !important;
      border-radius: 10px !important;
      font-size: 14px !important;
      font-weight: 500 !important;
      color: #64748b !important;
      background: #f1f5f9 !important;
      border: 1px solid #e2e8f0 !important;
      transition: all 0.2s;
      line-height: 1.2 !important;
      min-height: 48px;
    }
    .dark-mode .session-btn-secondary {
      color: #94a3b8 !important;
      background: #0f172a !important;
      border-color: #334155 !important;
    }
    .session-btn-secondary:hover {
      background: #e2e8f0 !important;
      border-color: #cbd5e1 !important;
    }
    .dark-mode .session-btn-secondary:hover {
      background: #334155 !important;
      border-color: #475569 !important;
    }
    .session-btn-secondary mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .session-btn-primary {
      flex: 1.2;
      display: inline-flex !important;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 14px 24px !important;
      border-radius: 10px !important;
      font-size: 14px !important;
      font-weight: 600 !important;
      background: linear-gradient(135deg, #059669 0%, #10b981 100%) !important;
      color: white !important;
      box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);
      transition: all 0.2s;
      white-space: nowrap;
      line-height: 1.2 !important;
      min-height: 48px;
    }
    .session-btn-primary:hover {
      box-shadow: 0 6px 16px rgba(5, 150, 105, 0.4);
      transform: translateY(-1px);
    }
    .session-btn-primary mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }
  `]
})
export class SessionWarningModalComponent implements OnInit, OnDestroy {
  tiempoRestante: number = 0;
  progreso: number = 100;
  isDarkMode = signal<boolean>(false);
  private timerSubscription?: Subscription;
  private progressSubscription?: Subscription;
  private tiempoTotal: number;
  private darkModeObserver?: MutationObserver;
  private startTime: number = 0;

  constructor(
    public dialogRef: MatDialogRef<SessionWarningModalComponent>,
    private inactivityService: InactivityService,
    private sessionConfig: SessionConfigService
  ) {
    this.tiempoTotal = this.sessionConfig.getTimeoutInactividad();
  }

  ngOnInit(): void {
    // Detectar modo oscuro
    this.isDarkMode.set(document.documentElement.classList.contains('dark'));

    this.darkModeObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          this.isDarkMode.set(document.documentElement.classList.contains('dark'));
        }
      });
    });
    this.darkModeObserver.observe(document.documentElement, { attributes: true });

    // Obtener tiempo inicial y guardar timestamp
    this.tiempoRestante = this.inactivityService.getTiempoRestante();
    this.startTime = Date.now();
    const tiempoInicialMs = this.tiempoRestante * 1000;
    this.progreso = 100; // Siempre empieza a tope

    // Actualizar contador de segundos cada segundo
    this.timerSubscription = interval(1000).subscribe(() => {
      this.tiempoRestante = this.inactivityService.getTiempoRestante();

      // Si el tiempo se agotó, cerrar el modal
      if (this.tiempoRestante <= 0) {
        this.dialogRef.close('timeout');
      }
    });

    // Actualizar barra de progreso cada 50ms para animación fluida
    this.progressSubscription = interval(50).subscribe(() => {
      const elapsedMs = Date.now() - this.startTime;
      const remainingMs = Math.max(0, tiempoInicialMs - elapsedMs);
      // La barra va de 100% a 0% basándose en el tiempo inicial cuando se abrió el modal
      this.progreso = Math.max(0, (remainingMs / tiempoInicialMs) * 100);
    });
  }

  ngOnDestroy(): void {
    this.timerSubscription?.unsubscribe();
    this.progressSubscription?.unsubscribe();
    this.darkModeObserver?.disconnect();
  }

  continuarSesion(): void {
    this.inactivityService.resetearContador();
    this.dialogRef.close('continue');
  }

  cerrarSesion(): void {
    this.dialogRef.close('logout');
  }
}
