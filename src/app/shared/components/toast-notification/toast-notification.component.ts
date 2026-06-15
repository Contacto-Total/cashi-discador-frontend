import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { Subscription } from 'rxjs';
import { ToastService, Toast } from '../../services/toast.service';

@Component({
  selector: 'app-toast-notification',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './toast-notification.component.html',
  styleUrls: ['./toast-notification.component.scss']
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
        this.startTimer(existing);
        return;
      }

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
}
