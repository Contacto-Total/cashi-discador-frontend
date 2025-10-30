import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from './core/services/auth.service';
import { WebsocketService } from './core/services/websocket.service';
import { SipService } from './core/services/sip.service';
import { InactivityService } from './core/services/inactivity.service';
import { SessionConfigService } from './core/services/session-config.service';
import { SessionWarningModalComponent } from './shared/components/session-warning-modal/session-warning-modal.component';
import { IncomingCallModalComponent } from './shared/components/incoming-call-modal/incoming-call-modal.component';
import { ActiveCallModalComponent } from './shared/components/active-call-modal/active-call-modal.component';
import { environment } from '../environments/environment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Call Center';
  private warningSubscription?: Subscription;
  private timeoutSubscription?: Subscription;
  private incomingCallSubscription?: Subscription;
  private dialogRef: any;
  private incomingCallDialogRef: any;
  private activeCallDialogRef: any;

  constructor(
    public authService: AuthService,
    private websocketService: WebsocketService,
    private sipService: SipService,
    private inactivityService: InactivityService,
    private sessionConfig: SessionConfigService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Cargar configuraciones de sesión
    this.sessionConfig.cargarConfiguracion().subscribe();

    // Suscribirse a cambios en el usuario autenticado
    this.authService.currentUser$.subscribe(user => {
      if (user && this.authService.isAuthenticated()) {
        // Usuario autenticado - iniciar servicios
        this.websocketService.connect();
        this.iniciarMonitoreoInactividad();

        // Conectar a FreeSWITCH automáticamente
        this.conectarFreeSWITCH(user);
      } else {
        // Usuario no autenticado - detener servicios
        this.inactivityService.detener();
        this.websocketService.disconnect();
        this.sipService.unregister();
      }
    });
  }

  ngOnDestroy(): void {
    this.warningSubscription?.unsubscribe();
    this.timeoutSubscription?.unsubscribe();
    this.incomingCallSubscription?.unsubscribe();
    this.inactivityService.detener();
  }

  private iniciarMonitoreoInactividad(): void {
    // Iniciar servicio de inactividad
    this.inactivityService.iniciar();

    // Suscribirse a advertencia de inactividad
    this.warningSubscription = this.inactivityService.onWarning$.subscribe(() => {
      this.mostrarAdvertenciaInactividad();
    });

    // Suscribirse a timeout de inactividad
    this.timeoutSubscription = this.inactivityService.onTimeout$.subscribe(() => {
      this.cerrarSesionPorInactividad();
    });
  }

  private mostrarAdvertenciaInactividad(): void {
    // No mostrar modal si ya está abierto
    if (this.dialogRef) {
      return;
    }

    this.dialogRef = this.dialog.open(SessionWarningModalComponent, {
      width: '450px',
      disableClose: true,
      hasBackdrop: true
    });

    this.dialogRef.afterClosed().subscribe((result: string) => {
      this.dialogRef = null;

      if (result === 'logout') {
        this.logout();
      } else if (result === 'timeout') {
        this.cerrarSesionPorInactividad();
      }
      // Si result === 'continue', el usuario clickeó continuar y el contador ya se reseteó
    });
  }

  private cerrarSesionPorInactividad(): void {
    // Cerrar modal si está abierto
    if (this.dialogRef) {
      this.dialogRef.close();
      this.dialogRef = null;
    }

    // Cerrar sesión
    this.logout();

    // Mostrar mensaje (opcional)
    alert('Tu sesión ha expirado por inactividad');
  }

  /**
   * Conectar automáticamente a FreeSWITCH al iniciar sesión
   * Igual que en test-softphone.component.ts
   */
  private async conectarFreeSWITCH(user: any): Promise<void> {
    if (!user.sipExtension) {
      console.warn('⚠️ Usuario sin extensión SIP');
      return;
    }

    try {
      console.log('🔌 Conectando automáticamente a FreeSWITCH...');

      await this.sipService.register(
        user.sipExtension,
        '1234',
        environment.freeswitchWsUrl,
        environment.freeswitchDomain
      );

      console.log('✅ Conectado a FreeSWITCH exitosamente');

      // HABILITAR AUTO-ANSWER para el auto-dialer
      // Esto hace que TODAS las llamadas entrantes se contesten automáticamente
      this.sipService.enableAutoAnswer();
      console.log('🤖 Auto-answer HABILITADO para auto-dialer');

      // Suscribirse a llamadas entrantes (solo para llamadas normales, no auto-answer)
      this.incomingCallSubscription = this.sipService.onIncomingCall.subscribe((data) => {
        this.mostrarLlamadaEntrante(data.from);
      });

      // Suscribirse a cambios de estado para detectar llamadas auto-contestadas
      this.sipService.onCallStatus.subscribe((state) => {
        console.log(`📡 [App] Estado de llamada: ${state}, activeDialog=${!!this.activeCallDialogRef}, incomingDialog=${!!this.incomingCallDialogRef}`);

        if (state === 'ACTIVE' && !this.activeCallDialogRef && !this.incomingCallDialogRef) {
          // Llamada activa sin popups abiertos = auto-contestada
          console.log('🤖 [App] Llamada auto-contestada detectada, abriendo popup de control');
          // Obtener el número desde la sesión actual (no tenemos onIncomingCall event)
          this.mostrarLlamadaActiva('Auto-dialer');
        } else if (state === 'ACTIVE') {
          console.log('✅ [App] Llamada ACTIVE pero popup ya está abierto, no hacer nada');
        }
      });

      console.log('📞 Escuchando llamadas entrantes...');
    } catch (error) {
      console.error('❌ Error al conectar a FreeSWITCH:', error);
    }
  }

  /**
   * Mostrar popup de llamada entrante
   */
  private mostrarLlamadaEntrante(from: string): void {
    // No mostrar modal si ya está abierto
    if (this.incomingCallDialogRef) {
      return;
    }

    this.incomingCallDialogRef = this.dialog.open(IncomingCallModalComponent, {
      width: '400px',
      disableClose: true,
      hasBackdrop: true,
      data: { from }
    });

    this.incomingCallDialogRef.afterClosed().subscribe((result: string) => {
      this.incomingCallDialogRef = null;

      if (result === 'answer') {
        // Contestar la llamada
        this.sipService.answer();
        console.log('✅ Llamada contestada');

        // Abrir popup de llamada activa
        this.mostrarLlamadaActiva(from);
      } else if (result === 'reject') {
        // Rechazar la llamada
        this.sipService.hangup();
        console.log('❌ Llamada rechazada');
      }
    });
  }

  /**
   * Mostrar popup de llamada activa con controles
   */
  private mostrarLlamadaActiva(from: string): void {
    // No mostrar modal si ya está abierto
    if (this.activeCallDialogRef) {
      console.log('⚠️ [App] Popup de llamada activa ya está abierto, no abrir otro');
      return;
    }

    console.log('📞 [App] Abriendo popup de llamada activa para:', from);

    this.activeCallDialogRef = this.dialog.open(ActiveCallModalComponent, {
      width: '400px',
      disableClose: true,
      hasBackdrop: false, // Permitir interactuar con la página de fondo
      data: { from }
    });

    this.activeCallDialogRef.afterClosed().subscribe(() => {
      console.log('📞 [App] Popup de llamada activa CERRADO');
      this.activeCallDialogRef = null;
    });
  }

  logout(): void {
    this.inactivityService.detener();
    this.websocketService.disconnect();
    this.sipService.unregister();
    this.authService.logout();
  }

  isLoginPage(): boolean {
    return this.router.url === '/login';
  }
}
