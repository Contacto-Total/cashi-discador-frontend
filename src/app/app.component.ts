import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatDialog } from '@angular/material/dialog';
import { LucideAngularModule } from 'lucide-angular';
import { AuthService } from './core/services/auth.service';
import { ThemeService } from './shared/services/theme.service';
import { WebsocketService } from './core/services/websocket.service';
import { SipService } from './core/services/sip.service';
import { InactivityService } from './core/services/inactivity.service';
import { SessionConfigService } from './core/services/session-config.service';
import { SessionWarningModalComponent } from './shared/components/session-warning-modal/session-warning-modal.component';
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
    MatListModule,
    LucideAngularModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Call Center';
  private warningSubscription?: Subscription;
  private timeoutSubscription?: Subscription;
  private dialogRef: any;
  private hasNavigatedToTypification = false; // Prevenir múltiples navegaciones

  // Navbar dropdown state
  isMonitoreoDropdownOpen = false;
  isCargaDatosDropdownOpen = false;
  isMantenimientoDropdownOpen = false;

  constructor(
    public authService: AuthService,
    public themeService: ThemeService,
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

      // Suscribirse a cambios de estado para navegar a tipificación
      this.sipService.onCallStatus.subscribe((state) => {
        console.log(`📡 [App] Estado de llamada: ${state}`);

        if (state === 'ACTIVE' && !this.hasNavigatedToTypification) {
          // Llamada activa = navegar directo a tipificación
          console.log('📞 [App] Llamada conectada, esperando 2s para establecer audio...');
          this.hasNavigatedToTypification = true; // Marcar para prevenir navegaciones múltiples

          // DELAY DE 2 SEGUNDOS: Esperar a que el audio WebRTC se establezca completamente
          // antes de navegar. Esto evita interrumpir la negociación ICE y los media streams.
          setTimeout(() => {
            console.log('📞 [App] Navegando a tipificación...');
            this.router.navigate(['/collection-management']);
          }, 2000);
        }

        // Reset flag cuando la llamada termina
        if (state === 'ENDED' || state === 'IDLE') {
          this.hasNavigatedToTypification = false;
        }
      });

      console.log('📞 Escuchando llamadas entrantes...');
    } catch (error) {
      console.error('❌ Error al conectar a FreeSWITCH:', error);
    }
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

  // Navbar methods
  toggleMonitoreoDropdown(): void {
    this.isMonitoreoDropdownOpen = !this.isMonitoreoDropdownOpen;
    this.isCargaDatosDropdownOpen = false;
    this.isMantenimientoDropdownOpen = false;
  }

  toggleCargaDatosDropdown(): void {
    this.isCargaDatosDropdownOpen = !this.isCargaDatosDropdownOpen;
    this.isMonitoreoDropdownOpen = false;
    this.isMantenimientoDropdownOpen = false;
  }

  toggleMantenimientoDropdown(): void {
    this.isMantenimientoDropdownOpen = !this.isMantenimientoDropdownOpen;
    this.isMonitoreoDropdownOpen = false;
    this.isCargaDatosDropdownOpen = false;
  }

  closeDropdowns(): void {
    this.isMonitoreoDropdownOpen = false;
    this.isCargaDatosDropdownOpen = false;
    this.isMantenimientoDropdownOpen = false;
  }

  isMonitoreoActive(): boolean {
    return this.router.url.includes('/admin/monitoring') ||
           this.router.url.includes('/admin/campaign-monitoring');
  }

  isCargaDatosActive(): boolean {
    return this.router.url.includes('/admin/data-load');
  }

  isMantenimientoActive(): boolean {
    return this.router.url.includes('/admin/maintenance');
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  isDarkMode(): boolean {
    return this.themeService.isDarkMode();
  }
}
