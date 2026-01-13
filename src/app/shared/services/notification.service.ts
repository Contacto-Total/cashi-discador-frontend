import { Injectable, signal } from '@angular/core';

export interface Notification {
  id: number;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  label: string;
  callback: () => void;
  primary?: boolean;
}

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  details?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationId = 0;

  notifications = signal<Notification[]>([]);

  // Para el diálogo de confirmación
  confirmDialog = signal<{
    visible: boolean;
    options: ConfirmOptions;
    resolve: ((value: boolean) => void) | null;
  }>({
    visible: false,
    options: { title: '', message: '' },
    resolve: null
  });

  /**
   * Muestra una notificación de éxito
   */
  success(title: string, message: string = '', duration: number = 4000) {
    this.show({ type: 'success', title, message, duration });
  }

  /**
   * Muestra una notificación de error
   */
  error(title: string, message: string = '', duration: number = 6000) {
    this.show({ type: 'error', title, message, duration });
  }

  /**
   * Muestra una notificación de advertencia
   */
  warning(title: string, message: string = '', duration: number = 5000) {
    this.show({ type: 'warning', title, message, duration });
  }

  /**
   * Muestra una notificación informativa
   */
  info(title: string, message: string = '', duration: number = 4000) {
    this.show({ type: 'info', title, message, duration });
  }

  /**
   * Muestra una notificación personalizada
   */
  show(notification: Omit<Notification, 'id'>) {
    const id = ++this.notificationId;
    const newNotification: Notification = {
      ...notification,
      id,
      duration: notification.duration ?? 4000
    };

    this.notifications.update(list => [...list, newNotification]);

    // Auto-dismiss después de la duración
    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => this.dismiss(id), newNotification.duration);
    }
  }

  /**
   * Cierra una notificación específica
   */
  dismiss(id: number) {
    this.notifications.update(list => list.filter(n => n.id !== id));
  }

  /**
   * Cierra todas las notificaciones
   */
  dismissAll() {
    this.notifications.set([]);
  }

  /**
   * Muestra un diálogo de confirmación y retorna una promesa
   */
  confirm(options: ConfirmOptions): Promise<boolean> {
    return new Promise((resolve) => {
      this.confirmDialog.set({
        visible: true,
        options: {
          confirmText: 'Confirmar',
          cancelText: 'Cancelar',
          type: 'info',
          ...options
        },
        resolve
      });
    });
  }

  /**
   * Resuelve el diálogo de confirmación
   */
  resolveConfirm(result: boolean) {
    const dialog = this.confirmDialog();
    if (dialog.resolve) {
      dialog.resolve(result);
    }
    this.confirmDialog.set({
      visible: false,
      options: { title: '', message: '' },
      resolve: null
    });
  }
}
