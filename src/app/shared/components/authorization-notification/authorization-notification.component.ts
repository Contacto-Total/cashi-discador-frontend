import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { AutorizacionService, SolicitudAutorizacion, ResponderSolicitudRequest } from '../../../core/services/autorizacion.service';
import { AuthorizationApprovalModalComponent } from '../authorization-approval-modal/authorization-approval-modal.component';
import { AuthService } from '../../../core/services/auth.service';
import { Subscription } from 'rxjs';

/**
 * Componente de notificación global para solicitudes de autorización
 * Debe incluirse en el app.component.html para que esté disponible globalmente
 */
@Component({
  selector: 'app-authorization-notification',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    AuthorizationApprovalModalComponent
  ],
  template: `
    <!-- Notificación flotante cuando llega una nueva solicitud -->
    @if (mostrarNotificacion() && solicitudActiva()) {
      <div class="authorization-notification">
        <div class="notification-card">
          <div class="notification-header">
            <div class="header-left">
              <span class="alert-icon">⚠️</span>
              <span class="header-title">Nueva Solicitud de Autorización</span>
            </div>
            <button class="close-btn" (click)="cerrarNotificacion()">&times;</button>
          </div>

          <div class="notification-body">
            <p class="request-info">
              <strong>{{ solicitudActiva()?.nombreAgente }}</strong> solicita autorización para:
            </p>
            <div class="amounts-row">
              <div class="amount-item">
                <span class="label">Monto:</span>
                <span class="value highlight">S/ {{ solicitudActiva()?.montoTotal?.toFixed(2) }}</span>
              </div>
              <div class="amount-item">
                <span class="label">Cuotas:</span>
                <span class="value">{{ solicitudActiva()?.numeroCuotas }}</span>
              </div>
            </div>
            <p class="client-info">
              Cliente: {{ solicitudActiva()?.nombreCliente }}
            </p>
          </div>

          <div class="notification-footer">
            <button class="btn btn-reject" (click)="rechazarRapido()">
              ❌ Rechazar
            </button>
            <button class="btn btn-primary" (click)="verDetalles()">
              👁️ Ver Detalles
            </button>
          </div>
        </div>
      </div>
    }

    <!-- Indicador de solicitudes pendientes (badge en esquina) -->
    @if (cantidadPendientes() > 0 && !mostrarNotificacion()) {
      <div
        class="pending-badge"
        (click)="verSiguientePendiente()"
        title="Tienes solicitudes de autorización pendientes">
        <span class="bell-icon">🔔</span>
        <span class="badge-count">{{ cantidadPendientes() }}</span>
      </div>
    }

    <!-- Modal de aprobación -->
    <app-authorization-approval-modal
      [(visible)]="mostrarModal"
      [solicitud]="solicitudParaModal()"
      (aprobada)="onAprobada($event)"
      (rechazada)="onRechazada($event)">
    </app-authorization-approval-modal>
  `,
  styles: [`
    .authorization-notification {
      position: fixed;
      top: 80px;
      right: 20px;
      z-index: 9999;
      animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    .notification-card {
      width: 380px;
      background: white;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      border-left: 4px solid #f59e0b;
      border-radius: 8px;
      overflow: hidden;
    }

    .notification-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 1rem;
      background: #fffbeb;
      border-bottom: 1px solid #fef3c7;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .alert-icon {
      font-size: 1.25rem;
    }

    .header-title {
      font-weight: 600;
      color: #92400e;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 1.5rem;
      color: #92400e;
      cursor: pointer;
      padding: 0;
      line-height: 1;
      opacity: 0.7;
      transition: opacity 0.2s;
    }

    .close-btn:hover {
      opacity: 1;
    }

    .notification-body {
      padding: 1rem;
    }

    .request-info {
      margin: 0 0 0.75rem 0;
      color: #374151;
    }

    .amounts-row {
      display: flex;
      gap: 1.5rem;
      margin-bottom: 0.5rem;
    }

    .amount-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .amount-item .label {
      font-size: 0.875rem;
      color: #6b7280;
    }

    .amount-item .value {
      font-weight: 700;
    }

    .amount-item .value.highlight {
      color: #0369a1;
    }

    .client-info {
      margin: 0;
      font-size: 0.875rem;
      color: #6b7280;
    }

    .notification-footer {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      background: #f9fafb;
      border-top: 1px solid #e5e7eb;
    }

    .btn {
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-reject {
      background: white;
      border: 1px solid #ef4444;
      color: #ef4444;
    }

    .btn-reject:hover {
      background: #fef2f2;
    }

    .btn-primary {
      background: #3b82f6;
      border: none;
      color: white;
    }

    .btn-primary:hover {
      background: #2563eb;
    }

    .pending-badge {
      position: fixed;
      bottom: 80px;
      right: 20px;
      width: 56px;
      height: 56px;
      background: linear-gradient(135deg, #f59e0b, #d97706);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      z-index: 9998;
      transition: transform 0.2s, box-shadow 0.2s;
      animation: pulse-badge 2s infinite;
    }

    @keyframes pulse-badge {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }

    .pending-badge:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
      animation: none;
    }

    .bell-icon {
      font-size: 1.5rem;
    }

    .badge-count {
      position: absolute;
      top: -5px;
      right: -5px;
      background: #ef4444;
      color: white;
      font-size: 0.75rem;
      font-weight: bold;
      min-width: 22px;
      height: 22px;
      border-radius: 11px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 5px;
      border: 2px solid white;
    }
  `]
})
export class AuthorizationNotificationComponent implements OnInit, OnDestroy {
  mostrarNotificacion = signal<boolean>(false);
  solicitudActiva = signal<SolicitudAutorizacion | null>(null);
  solicitudParaModal = signal<SolicitudAutorizacion | null>(null);
  mostrarModal = false;

  private subscriptions: Subscription[] = [];
  private audioNotificacion?: HTMLAudioElement;

  // Obtener solicitudes pendientes del servicio
  cantidadPendientes = computed(() => {
    return this.autorizacionService.solicitudesPendientes().length;
  });

  constructor(
    private autorizacionService: AutorizacionService,
    private authService: AuthService
  ) {
    // Cargar sonido de notificación
    try {
      this.audioNotificacion = new Audio('assets/sounds/notification.mp3');
    } catch (e) {
      console.log('[AUTH-NOTIF] No se pudo cargar audio');
    }
  }

  ngOnInit(): void {
    this.verificarRolYSuscribir();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private verificarRolYSuscribir(): void {
    const usuario = this.authService.getCurrentUser();

    // Solo supervisores y admins reciben notificaciones
    if (!usuario || (usuario.role !== 'ADMIN' && usuario.role !== 'SUPERVISOR')) {
      console.log('[AUTH-NOTIF] Usuario no es supervisor/admin, no se suscriben notificaciones');
      return;
    }

    console.log('[AUTH-NOTIF] Suscribiendo a notificaciones de autorización para:', usuario.username);

    // Cargar solicitudes pendientes al iniciar
    this.autorizacionService.obtenerSolicitudesPendientes(usuario.id).subscribe();

    // Suscribirse a nuevas solicitudes
    const sub = this.autorizacionService.nuevaSolicitud$.subscribe(solicitud => {
      console.log('[AUTH-NOTIF] Nueva solicitud recibida:', solicitud);
      this.mostrarNuevaSolicitud(solicitud);
    });

    this.subscriptions.push(sub);
  }

  private mostrarNuevaSolicitud(solicitud: SolicitudAutorizacion): void {
    this.solicitudActiva.set(solicitud);
    this.mostrarNotificacion.set(true);

    // Reproducir sonido
    this.reproducirSonido();

    // Auto-cerrar después de 30 segundos si no se interactúa
    setTimeout(() => {
      if (this.solicitudActiva()?.uuid === solicitud.uuid && this.mostrarNotificacion()) {
        this.cerrarNotificacion();
      }
    }, 30000);
  }

  private reproducirSonido(): void {
    try {
      if (this.audioNotificacion) {
        this.audioNotificacion.currentTime = 0;
        this.audioNotificacion.play().catch(() => {
          console.log('[AUTH-NOTIF] No se pudo reproducir sonido (requiere interacción del usuario)');
        });
      }
    } catch (e) {
      console.log('[AUTH-NOTIF] Error reproduciendo sonido:', e);
    }
  }

  cerrarNotificacion(): void {
    this.mostrarNotificacion.set(false);
    this.solicitudActiva.set(null);
  }

  verDetalles(): void {
    const solicitud = this.solicitudActiva();
    if (solicitud) {
      this.solicitudParaModal.set(solicitud);
      this.mostrarModal = true;
      this.cerrarNotificacion();
    }
  }

  rechazarRapido(): void {
    const solicitud = this.solicitudActiva();
    if (!solicitud?.uuid) return;

    const usuario = this.authService.getCurrentUser();
    if (!usuario) return;

    const request: ResponderSolicitudRequest = {
      uuidSolicitud: solicitud.uuid,
      idSupervisor: usuario.id,
      aprobada: false,
      comentarios: 'Rechazada rápidamente'
    };

    this.autorizacionService.responderSolicitud(request).subscribe({
      next: () => {
        console.log('[AUTH-NOTIF] Solicitud rechazada rápidamente');
        this.cerrarNotificacion();
      },
      error: (err) => {
        console.error('[AUTH-NOTIF] Error al rechazar:', err);
      }
    });
  }

  verSiguientePendiente(): void {
    const pendientes = this.autorizacionService.solicitudesPendientes();
    if (pendientes.length > 0) {
      this.solicitudParaModal.set(pendientes[0]);
      this.mostrarModal = true;
    }
  }

  onAprobada(event: {solicitud: SolicitudAutorizacion, comentarios: string}): void {
    const usuario = this.authService.getCurrentUser();
    if (!usuario || !event.solicitud.uuid) return;

    const request: ResponderSolicitudRequest = {
      uuidSolicitud: event.solicitud.uuid,
      idSupervisor: usuario.id,
      aprobada: true,
      comentarios: event.comentarios
    };

    this.autorizacionService.responderSolicitud(request).subscribe({
      next: () => {
        console.log('[AUTH-NOTIF] Solicitud aprobada');
        this.mostrarModal = false;
        this.solicitudParaModal.set(null);
      },
      error: (err) => {
        console.error('[AUTH-NOTIF] Error al aprobar:', err);
      }
    });
  }

  onRechazada(event: {solicitud: SolicitudAutorizacion, comentarios: string}): void {
    const usuario = this.authService.getCurrentUser();
    if (!usuario || !event.solicitud.uuid) return;

    const request: ResponderSolicitudRequest = {
      uuidSolicitud: event.solicitud.uuid,
      idSupervisor: usuario.id,
      aprobada: false,
      comentarios: event.comentarios
    };

    this.autorizacionService.responderSolicitud(request).subscribe({
      next: () => {
        console.log('[AUTH-NOTIF] Solicitud rechazada');
        this.mostrarModal = false;
        this.solicitudParaModal.set(null);
      },
      error: (err) => {
        console.error('[AUTH-NOTIF] Error al rechazar:', err);
      }
    });
  }
}
