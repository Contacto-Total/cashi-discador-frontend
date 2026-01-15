import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

/**
 * Componente de reloj de alarma que indica el estado de tiempo del agente
 * - Verde: Todo bien, tiempo dentro del umbral normal
 * - Amarillo: Precaución, acercándose al límite
 * - Rojo: Crítico, tiempo excedido (con animación de pulso)
 */
@Component({
  selector: 'app-status-alarm-clock',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="alarm-clock-container"
         [class.verde]="color === 'verde'"
         [class.amarillo]="color === 'amarillo'"
         [class.rojo]="color === 'rojo'"
         [class.pulse]="color === 'rojo'"
         [class.shake]="excedido"
         [title]="tooltipText">
      <lucide-angular
        name="alarm-clock"
        [size]="size"
        class="alarm-icon">
      </lucide-angular>
      <span *ngIf="excedido" class="exclamation">!</span>
    </div>
  `,
  styles: [`
    .alarm-clock-container {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      position: relative;
      padding: 6px;
      border-radius: 50%;
      transition: all 0.3s ease;
      cursor: default;
    }

    /* Estado Verde - Todo bien */
    .alarm-clock-container.verde {
      background: linear-gradient(135deg, #10B981 0%, #059669 100%);
      box-shadow: 0 2px 8px rgba(16, 185, 129, 0.4);
    }
    .alarm-clock-container.verde .alarm-icon {
      color: white;
    }

    /* Estado Amarillo - Precaución */
    .alarm-clock-container.amarillo {
      background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
      box-shadow: 0 2px 8px rgba(245, 158, 11, 0.4);
    }
    .alarm-clock-container.amarillo .alarm-icon {
      color: white;
    }

    /* Estado Rojo - Crítico */
    .alarm-clock-container.rojo {
      background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
      box-shadow: 0 2px 12px rgba(239, 68, 68, 0.5);
    }
    .alarm-clock-container.rojo .alarm-icon {
      color: white;
    }

    /* Animación de pulso para estado rojo */
    .alarm-clock-container.pulse {
      animation: pulse 1.5s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
        box-shadow: 0 2px 12px rgba(239, 68, 68, 0.5);
      }
      50% {
        transform: scale(1.1);
        box-shadow: 0 4px 20px rgba(239, 68, 68, 0.7);
      }
    }

    /* Animación de sacudida cuando excede el tiempo */
    .alarm-clock-container.shake {
      animation: shake 0.5s ease-in-out infinite, pulse 1.5s ease-in-out infinite;
    }

    @keyframes shake {
      0%, 100% { transform: rotate(0deg); }
      25% { transform: rotate(-5deg); }
      75% { transform: rotate(5deg); }
    }

    /* Signo de exclamación para estado excedido */
    .exclamation {
      position: absolute;
      top: -4px;
      right: -4px;
      background: #fff;
      color: #EF4444;
      font-size: 0.625rem;
      font-weight: bold;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 1px 3px rgba(0,0,0,0.2);
      animation: bounce 1s ease infinite;
    }

    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-2px); }
    }

    .alarm-icon {
      display: block;
    }
  `]
})
export class StatusAlarmClockComponent implements OnChanges {
  /**
   * Color del indicador: 'verde', 'amarillo' o 'rojo'
   */
  @Input() color: 'verde' | 'amarillo' | 'rojo' = 'verde';

  /**
   * Si el tiempo ha excedido el máximo (activa animación extra)
   */
  @Input() excedido: boolean = false;

  /**
   * Tamaño del icono en píxeles
   */
  @Input() size: number = 18;

  /**
   * Texto del tooltip
   */
  @Input() tooltip: string = '';

  tooltipText: string = '';

  ngOnChanges(changes: SimpleChanges): void {
    this.updateTooltip();
  }

  private updateTooltip(): void {
    if (this.tooltip) {
      this.tooltipText = this.tooltip;
    } else {
      switch (this.color) {
        case 'verde':
          this.tooltipText = 'Tiempo normal';
          break;
        case 'amarillo':
          this.tooltipText = 'Acercándose al límite';
          break;
        case 'rojo':
          this.tooltipText = this.excedido ? 'Tiempo excedido' : 'Tiempo crítico';
          break;
      }
    }
  }
}
