import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { trigger, transition, animate, keyframes, style } from '@angular/animations';
import { Subscription } from 'rxjs';
import { ToastService, Toast } from '../../services/toast.service';

/**
 * Avisos emergentes de la aplicación. El fondo, el borde y el texto van en el color del aviso, y el
 * signo va dentro de un anillo que se consume mientras el aviso sigue en pantalla. Con el cursor
 * encima la cuenta se detiene; al salir, sigue donde quedó.
 */
@Component({
  selector: 'app-toast-notification',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './toast-notification.component.html',
  animations: [
    // Pulso de brillo del borde. Se re-dispara cada vez que glowCount aumenta
    // (:increment), es decir, en cada reintento de navegación mientras la toast
    // sigue visible. No se dispara en la aparición inicial (eso lo hace slideIn).
    trigger('glowPulse', [
      transition(':increment', [
        animate('650ms ease-out', keyframes([
          style({ boxShadow: '0 4px 12px rgba(15, 23, 42, 0.12)', offset: 0 }),
          style({ boxShadow: '0 0 0 3px {{ glow }}, 0 0 18px 2px {{ glow }}', offset: 0.35 }),
          style({ boxShadow: '0 0 0 3px {{ glow }}, 0 0 18px 2px {{ glow }}', offset: 0.6 }),
          style({ boxShadow: '0 4px 12px rgba(15, 23, 42, 0.12)', offset: 1 })
        ]))
      ], { params: { glow: 'rgba(245, 158, 11, 0.85)' } })
    ])
  ]
})
export class ToastNotificationComponent implements OnInit, OnDestroy {
  toasts: Toast[] = [];
  /** Colores de cada tipo: texto (--t), fondo, borde y el tono vivo del anillo (--t-pt). */
  readonly COLOR: Record<Toast['type'], string> = {
    success: '[--t:var(--ok)] [--t-bg:var(--ok-bg)] [--t-ln:var(--ok-ln)] [--t-pt:var(--ok-pt)]',
    error: '[--t:var(--ro)] [--t-bg:var(--ro-bg)] [--t-ln:var(--ro-ln)] [--t-pt:var(--ro-pt)]',
    warning: '[--t:var(--am)] [--t-bg:var(--am-bg)] [--t-ln:var(--am-ln)] [--t-pt:var(--am-pt)]',
    info: '[--t:var(--info)] [--t-bg:var(--info-bg)] [--t-ln:var(--info-ln)] [--t-pt:var(--info)]'
  };
  /** Signo de cada tipo, en trazos de 24 × 24. Va suelto: el anillo ya hace de círculo. */
  readonly SIGNO: Record<Toast['type'], string[]> = {
    success: ['M19 7 10 16l-5-5'],
    error: ['M17 7 7 17', 'm7 7 10 10'],
    warning: ['M12 6v7', 'M12 17.5h.01'],
    info: ['M12 18v-7', 'M12 6.5h.01']
  };
  private subscription!: Subscription;
  private timers = new Map<string, ReturnType<typeof setTimeout>>();
  /** Lo que le queda a cada aviso y desde cuándo corre esa cuenta. */
  private cuentas = new Map<string, { resta: number; desde: number }>();

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.subscription = this.toastService.toasts$.subscribe(toast => {
      // Deduplicar: si ya hay una toast visible con el mismo mensaje y tipo,
      // no apilamos otra; solo reiniciamos su temporizador. Así, aunque el
      // usuario machaque un botón (p. ej. uno bloqueado del sidebar), verá una
      // sola toast que se mantiene mientras sigue clickeando y desaparece al
      // dejar de hacerlo.
      const existing = this.toasts.find(
        t => t.message === toast.message && t.type === toast.type
      );
      if (existing) {
        // Reintento de navegación: re-disparar el brillo del borde y refrescar
        // el temporizador, sin apilar otra toast.
        existing.glowCount = (existing.glowCount || 0) + 1;
        this.startTimer(existing);
        return;
      }

      toast.glowCount = 0;
      this.toasts.push(toast);
      this.startTimer(toast);
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.timers.forEach(handle => clearTimeout(handle));
    this.timers.clear();
    this.cuentas.clear();
  }

  /**
   * (Re)inicia el auto-cierre de una toast, limpiando cualquier timer previo. Si el cursor está
   * encima, la cuenta queda entera y arranca al salir.
   */
  private startTimer(toast: Toast): void {
    this.detener(toast.id);
    const resta = toast.duration || 3000;
    this.cuentas.set(toast.id, { resta, desde: Date.now() });
    if (!toast.pausado) {
      this.timers.set(toast.id, setTimeout(() => this.remove(toast.id), resta));
    }
  }

  /** El cursor entra al aviso: la cuenta se detiene y se guarda lo que faltaba. */
  pausar(toast: Toast): void {
    const cuenta = this.cuentas.get(toast.id);
    if (!cuenta || toast.pausado) {
      return;
    }
    this.detener(toast.id);
    cuenta.resta = Math.max(cuenta.resta - (Date.now() - cuenta.desde), 0);
    toast.pausado = true;
  }

  /** El cursor sale: la cuenta sigue donde quedó. */
  seguir(toast: Toast): void {
    const cuenta = this.cuentas.get(toast.id);
    if (!cuenta || !toast.pausado) {
      return;
    }
    toast.pausado = false;
    cuenta.desde = Date.now();
    this.timers.set(toast.id, setTimeout(() => this.remove(toast.id), cuenta.resta));
  }

  remove(id: string): void {
    this.detener(id);
    this.cuentas.delete(id);
    this.toasts = this.toasts.filter(t => t.id !== id);
  }

  private detener(id: string): void {
    const handle = this.timers.get(id);
    if (handle) {
      clearTimeout(handle);
      this.timers.delete(id);
    }
  }

  /** Color del brillo del borde según el tipo de toast (coincide con el border-color). */
  glowColor(type: string): string {
    switch (type) {
      case 'success': return 'rgba(16, 185, 129, 0.85)';
      case 'error': return 'rgba(239, 68, 68, 0.9)';
      case 'warning': return 'rgba(245, 158, 11, 0.9)';
      case 'info': return 'rgba(59, 130, 246, 0.9)';
      default: return 'rgba(59, 130, 246, 0.9)';
    }
  }
}
