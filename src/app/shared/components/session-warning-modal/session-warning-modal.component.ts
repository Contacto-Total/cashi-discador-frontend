import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
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
    MatIconModule,
    MatProgressBarModule
  ],
  template: `
    <div class="session-warning-dialog">
      <div class="warning-header">
        <mat-icon class="warning-icon">warning</mat-icon>
        <h2 mat-dialog-title>Sesión por expirar</h2>
      </div>

      <mat-dialog-content>
        <p class="warning-message">
          Tu sesión está a punto de expirar por inactividad.
        </p>
        <p class="countdown">
          Tiempo restante: <strong>{{ tiempoRestante }}</strong> segundos
        </p>
        <mat-progress-bar
          mode="determinate"
          [value]="progreso"
          color="warn">
        </mat-progress-bar>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-raised-button color="primary" (click)="continuarSesion()">
          <mat-icon>refresh</mat-icon>
          Continuar sesión
        </button>
        <button mat-button (click)="cerrarSesion()">
          Cerrar sesión ahora
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .session-warning-dialog {
      min-width: 400px;
      padding: 20px;
    }

    .warning-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }

    .warning-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #ff9800;
    }

    h2 {
      margin: 0;
      color: #333;
    }

    .warning-message {
      font-size: 16px;
      margin-bottom: 12px;
      color: #555;
    }

    .countdown {
      font-size: 18px;
      margin: 16px 0;
      text-align: center;
    }

    .countdown strong {
      color: #f44336;
      font-size: 24px;
    }

    mat-progress-bar {
      margin: 16px 0;
    }

    mat-dialog-actions {
      padding-top: 16px;
      gap: 8px;
    }

    button mat-icon {
      margin-right: 8px;
    }
  `]
})
export class SessionWarningModalComponent implements OnInit, OnDestroy {
  tiempoRestante: number = 0;
  progreso: number = 100;
  private timerSubscription?: Subscription;
  private tiempoTotal: number;

  constructor(
    public dialogRef: MatDialogRef<SessionWarningModalComponent>,
    private inactivityService: InactivityService,
    private sessionConfig: SessionConfigService
  ) {
    this.tiempoTotal = this.sessionConfig.getTimeoutWarning();
  }

  ngOnInit(): void {
    // Actualizar contador cada segundo
    this.timerSubscription = interval(1000).subscribe(() => {
      this.tiempoRestante = this.inactivityService.getTiempoRestante();

      // Calcular progreso
      const tiempoTranscurrido = this.tiempoTotal - this.tiempoRestante;
      this.progreso = Math.max(0, ((this.tiempoTotal - tiempoTranscurrido) / this.tiempoTotal) * 100);

      // Si el tiempo se agotó, cerrar el modal
      if (this.tiempoRestante <= 0) {
        this.dialogRef.close('timeout');
      }
    });
  }

  ngOnDestroy(): void {
    this.timerSubscription?.unsubscribe();
  }

  continuarSesion(): void {
    this.inactivityService.resetearContador();
    this.dialogRef.close('continue');
  }

  cerrarSesion(): void {
    this.dialogRef.close('logout');
  }
}
