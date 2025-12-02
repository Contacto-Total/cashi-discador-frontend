import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { Subscription, interval } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
import { AuthService } from '../../../core/services/auth.service';
import { AgentStatusService } from '../../../core/services/agent-status.service';
import { StatusAlarmClockComponent } from '../status-alarm-clock/status-alarm-clock.component';

/**
 * Componente overlay flotante que muestra el reloj de alarma para agentes
 * Aparece en todas las pantallas y usa Text-to-Speech para alertas de voz
 */
@Component({
  selector: 'app-agent-time-alert-overlay',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, StatusAlarmClockComponent],
  template: `
    <!-- Overlay flotante - solo visible para agentes autenticados -->
    <div class="agent-time-overlay" *ngIf="isVisible">
      <!-- Indicador de reloj -->
      <div class="alarm-indicator"
           [class.warning]="colorIndicador === 'amarillo'"
           [class.critical]="colorIndicador === 'rojo'"
           (click)="toggleExpanded()">
        <app-status-alarm-clock
          [color]="colorIndicador"
          [excedido]="excedeTiempoMaximo"
          [size]="28">
        </app-status-alarm-clock>

        <!-- Tiempo en estado (solo cuando está expandido) -->
        <div class="time-info" *ngIf="isExpanded">
          <div class="estado-actual">{{ estadoTexto }}</div>
          <div class="tiempo">{{ formatTiempo(segundosEnEstado) }}</div>
        </div>
      </div>

      <!-- Botón de sonido -->
      <button class="sound-toggle"
              [class.active]="soundEnabled"
              (click)="toggleSound($event)"
              [title]="soundEnabled ? 'Desactivar voz' : 'Activar voz de alertas'">
        <lucide-angular [name]="soundEnabled ? 'volume-2' : 'volume-x'" [size]="16"></lucide-angular>
      </button>
    </div>
  `,
  styles: [`
    .agent-time-overlay {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 8px;
    }

    .alarm-indicator {
      display: flex;
      align-items: center;
      gap: 12px;
      background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
      border: 2px solid #334155;
      border-radius: 50px;
      padding: 8px 12px;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
    }

    .alarm-indicator:hover {
      transform: scale(1.05);
      border-color: #475569;
    }

    .alarm-indicator.warning {
      border-color: #f59e0b;
      box-shadow: 0 4px 20px rgba(245, 158, 11, 0.3);
    }

    .alarm-indicator.critical {
      border-color: #ef4444;
      box-shadow: 0 4px 20px rgba(239, 68, 68, 0.4);
      animation: pulse-border 1.5s ease-in-out infinite;
    }

    @keyframes pulse-border {
      0%, 100% {
        box-shadow: 0 4px 20px rgba(239, 68, 68, 0.4);
      }
      50% {
        box-shadow: 0 4px 30px rgba(239, 68, 68, 0.7);
      }
    }

    .time-info {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }

    .estado-actual {
      font-size: 10px;
      color: #94a3b8;
      text-transform: uppercase;
      font-weight: 600;
    }

    .tiempo {
      font-size: 16px;
      font-weight: bold;
      color: white;
      font-family: 'Courier New', monospace;
    }

    .sound-toggle {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 1px solid #475569;
      background: #1e293b;
      color: #94a3b8;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .sound-toggle:hover {
      background: #334155;
      color: white;
    }

    .sound-toggle.active {
      background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
      border-color: #22c55e;
      color: white;
    }
  `]
})
export class AgentTimeAlertOverlayComponent implements OnInit, OnDestroy {
  isVisible = false;
  isExpanded = true;
  colorIndicador: 'verde' | 'amarillo' | 'rojo' = 'verde';
  excedeTiempoMaximo = false;
  segundosEnEstado = 0;
  estadoActual = '';
  estadoTexto = '';
  soundEnabled = false;

  private statusSubscription?: Subscription;
  private lastAlertState = ''; // Para evitar repetir la misma alerta
  private userId: number | null = null;
  private userName = '';

  constructor(
    private authService: AuthService,
    private agentStatusService: AgentStatusService
  ) {}

  ngOnInit(): void {
    // Verificar si es agente
    const user = this.authService.getCurrentUser();
    if (user?.role === 'AGENT' && user.id) {
      this.isVisible = true;
      this.userId = user.id;
      this.userName = user.firstName || user.username || 'Agente';
      this.startStatusPolling();
    }

    // Suscribirse a cambios de usuario
    this.authService.currentUser$.subscribe(user => {
      if (user?.role === 'AGENT' && user.id) {
        this.isVisible = true;
        this.userId = user.id;
        this.userName = user.firstName || user.username || 'Agente';
        if (!this.statusSubscription) {
          this.startStatusPolling();
        }
      } else {
        this.isVisible = false;
        this.stopStatusPolling();
      }
    });
  }

  ngOnDestroy(): void {
    this.stopStatusPolling();
  }

  private startStatusPolling(): void {
    if (!this.userId) return;

    // Polling cada 5 segundos
    this.statusSubscription = interval(5000).pipe(
      startWith(0),
      switchMap(() => this.agentStatusService.getAgentStatus(this.userId!))
    ).subscribe({
      next: (response) => {
        const prevColor = this.colorIndicador;
        const prevExcedido = this.excedeTiempoMaximo;

        this.colorIndicador = response.colorIndicador || 'verde';
        this.excedeTiempoMaximo = response.excedeTiempoMaximo || false;
        this.segundosEnEstado = response.segundosEnEstado || 0;
        this.estadoActual = response.estadoActual;
        this.estadoTexto = this.getEstadoTexto(response.estadoActual);

        // Verificar si debe hablar
        if (this.soundEnabled && this.excedeTiempoMaximo) {
          const alertKey = `${this.estadoActual}-excedido`;
          if (this.lastAlertState !== alertKey) {
            this.lastAlertState = alertKey;
            this.speakAlert();
          }
        }

        // Resetear alerta si cambió de estado
        if (this.estadoActual !== this.lastAlertState.split('-')[0]) {
          this.lastAlertState = '';
        }
      },
      error: (err) => console.error('Error polling agent status:', err)
    });
  }

  private stopStatusPolling(): void {
    if (this.statusSubscription) {
      this.statusSubscription.unsubscribe();
      this.statusSubscription = undefined;
    }
  }

  toggleExpanded(): void {
    this.isExpanded = !this.isExpanded;
  }

  toggleSound(event: Event): void {
    event.stopPropagation();
    this.soundEnabled = !this.soundEnabled;

    if (this.soundEnabled) {
      // Hacer un test de voz para confirmar
      this.speak('Alertas de voz activadas');
    }
  }

  /**
   * Usa Text-to-Speech para hablar la alerta
   */
  private speakAlert(): void {
    const estadoHablado = this.getEstadoHablado(this.estadoActual);
    const mensaje = `Atención ${this.userName}. Llevas demasiado tiempo en estado ${estadoHablado}. Por favor, continúa con tu siguiente gestión.`;
    this.speak(mensaje);
  }

  /**
   * Función genérica de Text-to-Speech
   */
  private speak(text: string): void {
    if (!('speechSynthesis' in window)) {
      console.warn('Text-to-Speech no soportado en este navegador');
      return;
    }

    // Cancelar cualquier habla anterior
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 0.9;  // Velocidad (más lento = más claro)
    utterance.pitch = 0.8; // Tono (más bajo = más serio/robótico)
    utterance.volume = 1.0;

    // Intentar usar una voz en español
    const voices = speechSynthesis.getVoices();
    const spanishVoice = voices.find(v => v.lang.startsWith('es'));
    if (spanishVoice) {
      utterance.voice = spanishVoice;
    }

    speechSynthesis.speak(utterance);
  }

  private getEstadoTexto(estado: string): string {
    const estados: Record<string, string> = {
      'DISPONIBLE': 'Disponible',
      'EN_LLAMADA': 'En Llamada',
      'TIPIFICANDO': 'Tipificando',
      'EN_REUNION': 'En Reunión',
      'REFRIGERIO': 'Refrigerio',
      'SSHH': 'SSHH',
      'EN_MANUAL': 'Modo Manual',
      'PAUSADO': 'Pausado'
    };
    return estados[estado] || estado;
  }

  private getEstadoHablado(estado: string): string {
    const estados: Record<string, string> = {
      'DISPONIBLE': 'disponible',
      'EN_LLAMADA': 'en llamada',
      'TIPIFICANDO': 'tipificando',
      'EN_REUNION': 'en reunión',
      'REFRIGERIO': 'refrigerio',
      'SSHH': 'baño',
      'EN_MANUAL': 'modo manual',
      'PAUSADO': 'pausado'
    };
    return estados[estado] || estado;
  }

  formatTiempo(segundos: number): string {
    if (!segundos || segundos < 0) return '00:00';

    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const segs = segundos % 60;

    if (horas > 0) {
      return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
    } else {
      return `${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
    }
  }
}
