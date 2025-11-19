import { Component, OnInit, OnDestroy, AfterViewInit, ViewEncapsulation, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { LucideAngularModule } from 'lucide-angular';
import { AuthService } from './core/services/auth.service';
import { ThemeService } from './shared/services/theme.service';
import { WebsocketService } from './core/services/websocket.service';
import { SipService, CallState } from './core/services/sip.service';
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
    LucideAngularModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  title = 'Call Center';
  private warningSubscription?: Subscription;
  private timeoutSubscription?: Subscription;
  private callStatusSubscription?: Subscription; // ✅ CRITICAL FIX: Guardar subscription para evitar duplicados
  private dialogRef: any;
  private hasNavigatedToTypification = false; // Prevenir múltiples navegaciones
  private callActivatedTimestamp: number | null = null; // Timestamp de cuando la llamada se activó
  private navigationTimeout: any = null; // Timeout para navegación retrasada

  // Sidebar state
  isSidebarCollapsed = false;

  // Navbar dropdown state
  isMonitoreoDropdownOpen = false;
  isCargaDatosDropdownOpen = false;
  isMantenimientoDropdownOpen = false;
  isCampanasDropdownOpen = false;
  isReportesDropdownOpen = false;
  isBlacklistDropdownOpen = false;
  isCartasDropdownOpen = false;

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

  ngAfterViewInit(): void {
    // Detectar texto que se desborda y necesita scroll animation
    setTimeout(() => {
      this.checkTextOverflow();
    }, 100);
  }

  ngOnDestroy(): void {
    this.warningSubscription?.unsubscribe();
    this.timeoutSubscription?.unsubscribe();
    this.callStatusSubscription?.unsubscribe(); // ✅ Limpiar subscription de call status
    this.inactivityService.detener();

    // Limpiar timeout de navegación si existe
    if (this.navigationTimeout) {
      clearTimeout(this.navigationTimeout);
      this.navigationTimeout = null;
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    // Re-detectar overflow cuando cambia el tamaño de la ventana
    this.checkTextOverflow();
  }

  private checkTextOverflow(): void {
    // Seleccionar todos los elementos de texto en el sidebar (nav, submenu y footer)
    const textElements = document.querySelectorAll('.item-text');

    textElements.forEach((el) => {
      const element = el as HTMLElement;

      // Solo detectar overflow en elementos visibles (no ocultos por *ngIf o display:none)
      if (element.offsetParent === null) {
        return; // Skip invisible elements
      }

      // Verificar si el contenido desborda el contenedor
      const isOverflowing = element.scrollWidth > element.clientWidth;

      // Si el ancho del contenido (scrollWidth) es mayor que el ancho visible (clientWidth),
      // significa que el texto está truncado
      if (isOverflowing) {
        element.classList.add('text-overflowing');
      } else {
        element.classList.remove('text-overflowing');
      }
    });
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

      // ✅ CRITICAL FIX: Cancelar subscription anterior antes de crear una nueva
      // Esto evita múltiples subscriptions que causan comportamiento duplicado
      if (this.callStatusSubscription) {
        console.log('🧹 Limpiando subscription anterior de call status');
        this.callStatusSubscription.unsubscribe();
      }

      // Suscribirse a cambios de estado para navegar a tipificación
      this.callStatusSubscription = this.sipService.onCallStatus.subscribe((state) => {
        console.log(`📡 [App] Estado de llamada: ${state}`);

        if (state === CallState.ACTIVE && !this.hasNavigatedToTypification) {
          // ✅ CRITICAL FIX: Cancelar timeout anterior si existe
          // Evita múltiples timeouts cuando ACTIVE se emite múltiples veces (por ACK, etc)
          if (this.navigationTimeout) {
            console.log('⚠️ [App] Cancelando timeout de navegación anterior');
            clearTimeout(this.navigationTimeout);
          }

          // Marcar timestamp cuando la llamada se activa
          this.callActivatedTimestamp = Date.now();
          console.log('📞 [App] Llamada ACTIVA, esperando 2s para confirmar conexión estable...');

          // DELAY DE 2 SEGUNDOS: Esperar a que el audio WebRTC se establezca completamente
          // Y verificar que la llamada sigue activa (no se cortó inmediatamente)
          this.navigationTimeout = setTimeout(() => {
            // Verificar que la llamada sigue activa y lleva al menos 2 segundos
            const callDuration = this.callActivatedTimestamp
              ? Date.now() - this.callActivatedTimestamp
              : 0;

            // Obtener el estado actual de la llamada del servicio
            const currentState = this.sipService.getCallState();

            if (callDuration >= 2000 && currentState === CallState.ACTIVE && !this.hasNavigatedToTypification) {
              console.log(`📞 [App] Llamada estable (${callDuration}ms), navegando a tipificación...`);
              this.hasNavigatedToTypification = true;
              this.router.navigate(['/collection-management']);
            } else {
              console.log(`⚠️ [App] Llamada terminó antes de establecerse (${callDuration}ms, estado: ${currentState}), NO navegando`);
            }
          }, 2000);
        }

        // Cuando la llamada termina, cancelar navegación y resetear flags
        if (state === CallState.ENDED || state === CallState.IDLE) {
          // Cancelar navegación pendiente si la llamada termina antes del delay
          if (this.navigationTimeout && !this.hasNavigatedToTypification) {
            clearTimeout(this.navigationTimeout);
            this.navigationTimeout = null;
            console.log('🚫 [App] Navegación cancelada - llamada terminó sin establecerse');
          }

          // Reset flags
          this.hasNavigatedToTypification = false;
          this.callActivatedTimestamp = null;
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

  // Sidebar methods
  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
    // Re-detectar overflow después de colapsar/expandir sidebar
    setTimeout(() => {
      this.checkTextOverflow();
    }, 350); // Esperar a que termine la transición CSS (0.3s)
  }

  // Navbar methods
  toggleMonitoreoDropdown(): void {
    // Auto-expand sidebar if collapsed
    if (this.isSidebarCollapsed) {
      this.isSidebarCollapsed = false;
    }

    this.isMonitoreoDropdownOpen = !this.isMonitoreoDropdownOpen;
    this.isCargaDatosDropdownOpen = false;
    this.isMantenimientoDropdownOpen = false;
    this.isCampanasDropdownOpen = false;
    this.isReportesDropdownOpen = false;
    this.isBlacklistDropdownOpen = false;
    this.isCartasDropdownOpen = false;
    // Re-detectar overflow después de abrir dropdown
    setTimeout(() => {
      this.checkTextOverflow();
    }, 50);
  }

  toggleCargaDatosDropdown(): void {
    // Auto-expand sidebar if collapsed
    if (this.isSidebarCollapsed) {
      this.isSidebarCollapsed = false;
    }

    this.isCargaDatosDropdownOpen = !this.isCargaDatosDropdownOpen;
    this.isMonitoreoDropdownOpen = false;
    this.isMantenimientoDropdownOpen = false;
    this.isCampanasDropdownOpen = false;
    this.isReportesDropdownOpen = false;
    this.isBlacklistDropdownOpen = false;
    this.isCartasDropdownOpen = false;
    // Re-detectar overflow después de abrir dropdown
    setTimeout(() => {
      this.checkTextOverflow();
    }, 50);
  }

  toggleMantenimientoDropdown(): void {
    // Auto-expand sidebar if collapsed
    if (this.isSidebarCollapsed) {
      this.isSidebarCollapsed = false;
    }

    this.isMantenimientoDropdownOpen = !this.isMantenimientoDropdownOpen;
    this.isMonitoreoDropdownOpen = false;
    this.isCargaDatosDropdownOpen = false;
    this.isCampanasDropdownOpen = false;
    this.isReportesDropdownOpen = false;
    this.isBlacklistDropdownOpen = false;
    this.isCartasDropdownOpen = false;
    // Re-detectar overflow después de abrir dropdown
    setTimeout(() => {
      this.checkTextOverflow();
    }, 50);
  }

  toggleCampanasDropdown(): void {
    // Auto-expand sidebar if collapsed
    if (this.isSidebarCollapsed) {
      this.isSidebarCollapsed = false;
    }

    this.isCampanasDropdownOpen = !this.isCampanasDropdownOpen;
    this.isMonitoreoDropdownOpen = false;
    this.isCargaDatosDropdownOpen = false;
    this.isMantenimientoDropdownOpen = false;
    this.isReportesDropdownOpen = false;
    this.isBlacklistDropdownOpen = false;
    this.isCartasDropdownOpen = false;
    setTimeout(() => this.checkTextOverflow(), 50);
  }

  toggleReportesDropdown(): void {
    // Auto-expand sidebar if collapsed
    if (this.isSidebarCollapsed) {
      this.isSidebarCollapsed = false;
    }

    this.isReportesDropdownOpen = !this.isReportesDropdownOpen;
    this.isMonitoreoDropdownOpen = false;
    this.isCargaDatosDropdownOpen = false;
    this.isMantenimientoDropdownOpen = false;
    this.isCampanasDropdownOpen = false;
    this.isBlacklistDropdownOpen = false;
    this.isCartasDropdownOpen = false;
    setTimeout(() => this.checkTextOverflow(), 50);
  }

  toggleBlacklistDropdown(): void {
    // Auto-expand sidebar if collapsed
    if (this.isSidebarCollapsed) {
      this.isSidebarCollapsed = false;
    }

    this.isBlacklistDropdownOpen = !this.isBlacklistDropdownOpen;
    this.isMonitoreoDropdownOpen = false;
    this.isCargaDatosDropdownOpen = false;
    this.isMantenimientoDropdownOpen = false;
    this.isCampanasDropdownOpen = false;
    this.isReportesDropdownOpen = false;
    this.isCartasDropdownOpen = false;
    setTimeout(() => this.checkTextOverflow(), 50);
  }

  toggleCartasDropdown(): void {
    // Auto-expand sidebar if collapsed
    if (this.isSidebarCollapsed) {
      this.isSidebarCollapsed = false;
    }

    this.isCartasDropdownOpen = !this.isCartasDropdownOpen;
    this.isMonitoreoDropdownOpen = false;
    this.isCargaDatosDropdownOpen = false;
    this.isMantenimientoDropdownOpen = false;
    this.isCampanasDropdownOpen = false;
    this.isReportesDropdownOpen = false;
    this.isBlacklistDropdownOpen = false;
    setTimeout(() => this.checkTextOverflow(), 50);
  }

  closeDropdowns(): void {
    this.isMonitoreoDropdownOpen = false;
    this.isCargaDatosDropdownOpen = false;
    this.isMantenimientoDropdownOpen = false;
    this.isCampanasDropdownOpen = false;
    this.isReportesDropdownOpen = false;
    this.isBlacklistDropdownOpen = false;
    this.isCartasDropdownOpen = false;
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

  isCampanasActive(): boolean {
    return this.router.url.includes('/admin/campaigns');
  }

  isReportesActive(): boolean {
    return this.router.url.includes('/reports');
  }

  isBlacklistActive(): boolean {
    return this.router.url.includes('/blacklist');
  }

  isCartasActive(): boolean {
    return this.router.url.includes('/agreements') ||
           this.router.url.includes('/admin/cartas-cesion');
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  isDarkMode(): boolean {
    return this.themeService.isDarkMode();
  }

  isAdminOrSupervisor(): boolean {
    const currentUser = this.authService.getCurrentUser();
    return currentUser?.role === 'ADMIN' || currentUser?.role === 'SUPERVISOR';
  }

  isAgent(): boolean {
    const currentUser = this.authService.getCurrentUser();
    return currentUser?.role === 'AGENT';
  }
}
