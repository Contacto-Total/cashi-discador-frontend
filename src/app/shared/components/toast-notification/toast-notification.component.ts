import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { trigger, transition, animate, keyframes, style } from '@angular/animations';
import { Subscription } from 'rxjs';
import { ToastService, Toast } from '../../services/toast.service';

@Component({
  selector: 'app-toast-notification',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './toast-notification.component.html',
  styleUrls: ['./toast-notification.component.scss'],
  animations: [
    // Pulso de brillo del borde. Se re-dispara cada vez que glowCount aumenta
    // (:increment), es decir, en cada reintento de navegación mientras la toast
    // sigue visible. No se dispara en la aparición inicial (eso lo hace slideIn).
    trigger('glowPulse', [
      transition(':increment', [
        animate('650ms ease-out', keyframes([
          style({ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)', offset: 0 }),
          style({ boxShadow: '0 0 0 3px {{ glow }}, 0 0 18px 2px {{ glow }}', offset: 0.35 }),
          style({ boxShadow: '0 0 0 3px {{ glow }}, 0 0 18px 2px {{ glow }}', offset: 0.6 }),
          style({ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)', offset: 1 })
        ]))
      ], { params: { glow: 'rgba(245, 158, 11, 0.85)' } })
    ])
  ]
})
export class ToastNotificationComponent implements OnInit, OnDestroy {
  toasts: Toast[] = [];
  private subscription!: Subscription;
  private timers = new Map<string, ReturnType<typeof setTimeout>>();

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
  }

  /** (Re)inicia el auto-cierre de una toast, limpiando cualquier timer previo. */
  private startTimer(toast: Toast): void {
    const previous = this.timers.get(toast.id);
    if (previous) {
      clearTimeout(previous);
    }
    const handle = setTimeout(() => this.remove(toast.id), toast.duration || 3000);
    this.timers.set(toast.id, handle);
  }

  remove(id: string): void {
    const handle = this.timers.get(id);
    if (handle) {
      clearTimeout(handle);
      this.timers.delete(id);
    }
    this.toasts = this.toasts.filter(t => t.id !== id);
  }

  getIcon(type: string): string {
    switch (type) {
      case 'success': return 'check-circle';
      case 'error': return 'x-circle';
      case 'warning': return 'alert-triangle';
      case 'info': return 'info';
      default: return 'info';
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
