import { Component, OnInit, OnDestroy, AfterViewInit, ViewEncapsulation, HostListener } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterOutlet, RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { LucideAngularModule } from 'lucide-angular';
import { AuthService } from './core/services/auth.service';
import { ThemeService } from './shared/services/theme.service';
import { WebsocketService } from './core/services/websocket.service';
import { SipService, CallState } from './core/services/sip.service';
import { InactivityService } from './core/services/inactivity.service';
import { SessionConfigService } from './core/services/session-config.service';
import { AgentStatusService } from './core/services/agent-status.service';
import { NotificacionesSistemaService, NotificacionSistema } from './core/services/notificaciones-sistema.service';
import { MenuPermissionService, MenuItem } from './core/services/menu-permission.service';
import { SessionWarningModalComponent } from './shared/components/session-warning-modal/session-warning-modal.component';
import { AuthorizationNotificationComponent } from './shared/components/authorization-notification/authorization-notification.component';
import { AgentTimeAlertOverlayComponent } from './shared/components/agent-time-alert-overlay/agent-time-alert-overlay.component';
import { SupervisionPanelComponent } from './shared/components/supervision-panel/supervision-panel.component';
import { PeripheralStatusBannerComponent } from './shared/components/peripheral-status-banner/peripheral-status-banner.component';
import { PeripheralHealthService } from './core/services/peripheral-health.service';
import { RecordatoriosModalComponent } from './shared/components/recordatorios-modal/recordatorios-modal.component';
import { RecordatoriosService } from './core/services/recordatorios.service';
import { SupervisionService } from './core/services/supervision.service';
import { ToastNotificationComponent } from './shared/components/toast-notification/toast-notification.component';
import { environment } from '../environments/environment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    RouterOutlet,
    RouterModule,
    LucideAngularModule,
    AuthorizationNotificationComponent,
    AgentTimeAlertOverlayComponent,
    SupervisionPanelComponent,
    PeripheralStatusBannerComponent,
    ToastNotificationComponent
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
  private predictiveCallSubscription?: Subscription;
  private dialogRef: any;
  private hasNavigatedToTypification = false; // Prevenir múltiples navegaciones
  private sessionClosing = false; // Prevenir múltiples cierres de sesión
  private callActivatedTimestamp: number | null = null; // Timestamp de cuando la llamada se activó
  private navigationTimeout: any = null; // Timeout para navegación retrasada

  // Sidebar state
  isSidebarCollapsed = false;
  isMobileSidebarOpen = false;

  // Navbar dropdown state
  isMonitoreoDropdownOpen = false;
  isCargaDatosDropdownOpen = false;
  isMantenimientoDropdownOpen = false;
  isCampanasDropdownOpen = false;
  isReportesDropdownOpen = false;
  isBlacklistDropdownOpen = false;
  isCartasDropdownOpen = false;

  // Notificaciones
  isNotificacionesDropdownOpen = false;
  notificaciones: NotificacionSistema[] = [];
  notificacionesCount = 0;

  // Dynamic menu from backend
  menuItems: MenuItem[] = [];
  // Track which dropdowns are open by their codigo
  openDropdowns: Set<string> = new Set();

  constructor(
    public authService: AuthService,
    public themeService: ThemeService,
    private websocketService: WebsocketService,
    private sipService: SipService,
    private inactivityService: InactivityService,
    private sessionConfig: SessionConfigService,
    private agentStatusService: AgentStatusService,
    private recordatoriosService: RecordatoriosService,
    private notificacionesService: NotificacionesSistemaService,
    private menuPermissionService: MenuPermissionService,
    private supervisionService: SupervisionService,
    private peripheralHealthService: PeripheralHealthService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  // Notificaciones methods
  toggleNotificacionesDropdown(): void {
    this.isNotificacionesDropdownOpen = !this.isNotificacionesDropdownOpen;

    if (this.isNotificacionesDropdownOpen) {
      this.loadNotificaciones();
    }
  }

  loadNotificaciones(): void {
    this.notificacionesService.getAll().subscribe({
      next: (data) => this.notificaciones = data,
      error: (err) => console.error('Error cargando notificaciones:', err)
    });
  }

  refreshNotificacionesCount(): void {
    this.notificacionesService.getCount().subscribe({
      next: (response) => this.notificacionesCount = response.count,
      error: (err) => console.error('Error obteniendo count:', err)
    });
  }

  marcarNotificacionLeida(notif: NotificacionSistema): void {
    if (!notif.leida) {
      this.notificacionesService.marcarComoLeida(notif.id).subscribe({
        next: () => {
          notif.leida = true;
          this.notificacionesCount = Math.max(0, this.notificacionesCount - 1);
        }
      });
    }
  }

  marcarTodasLeidas(): void {
    this.notificacionesService.marcarTodasComoLeidas().subscribe({
      next: () => {
        this.notificaciones.forEach(n => n.leida = true);
        this.notificacionesCount = 0;
      }
    });
  }

  getNotificacionIcon(tipo: string): string {
    switch (tipo) {
      case 'ARCHIVADO_MENSUAL': return 'archive';
      case 'ERROR': return 'alert-circle';
      default: return 'bell';
    }
  }

  getNotificacionColor(tipo: string): string {
    switch (tipo) {
      case 'ARCHIVADO_MENSUAL': return 'text-green-400';
      case 'ERROR': return 'text-red-400';
      default: return 'text-blue-400';
    }
  }

  ngOnInit(): void {
    // Auto-colapsar sidebar en pantalla de tipificación
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // Colapsar sidebar en collection-management para más espacio
      if (event.urlAfterRedirects.startsWith('/collection-management')) {
        this.isSidebarCollapsed = true;
      }
    });

    // Verificar ruta inicial
    if (this.router.url.startsWith('/collection-management')) {
      this.isSidebarCollapsed = true;
    }

    // Cargar configuraciones de sesión
    this.sessionConfig.cargarConfiguracion().subscribe();

    // Suscribirse a cambios en el menú dinámico
    this.menuPermissionService.menuItems$.subscribe(items => {
      this.menuItems = items;
    });

    // Suscribirse a cambios en el usuario autenticado
    this.authService.currentUser$.subscribe(user => {
      if (user && this.authService.isAuthenticated()) {
        // Usuario autenticado - iniciar servicios
        this.websocketService.connect();
        this.subscribeForceLogout();
        this.iniciarMonitoreoInactividad();

        // Cargar menú dinámico según el rol del usuario
        this.menuPermissionService.loadVisibleMenu().subscribe({
          next: (items) => console.log('📋 Menú dinámico cargado:', items.length, 'items'),
          error: (err) => console.error('❌ Error cargando menú:', err)
        });

        // Conectar a FreeSWITCH automáticamente
        this.conectarFreeSWITCH(user);

        // Iniciar monitoreo de periféricos para agentes
        const agentRoles = ['AGENT', 'ASESOR'];
        if (agentRoles.includes(user.role)) {
          this.peripheralHealthService.start();
        }

        // Cargar contador de notificaciones (solo para admin)
        if (user.role === 'ADMIN') {
          this.refreshNotificacionesCount();
        }

        // Forzar modo claro para usuarios no-ADMIN
        if (user.role !== 'ADMIN') {
          this.themeService.setTheme('light');
        }
      } else {
        // Usuario no autenticado - detener servicios
        this.inactivityService.detener();
        this.websocketService.disconnect();
        this.sipService.unregister();
        this.peripheralHealthService.stop();
        // Limpiar menú al cerrar sesión
        this.menuPermissionService.clearMenu();
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
    this.callStatusSubscription?.unsubscribe();
    this.predictiveCallSubscription?.unsubscribe();
    this.forceLogoutSubscription?.unsubscribe();
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

  private forceLogoutSubscription?: Subscription;

  /**
   * Se suscribe al evento FORCE_LOGOUT del WebSocket.
   * Cuando el mismo usuario inicia sesión en otro dispositivo/navegador,
   * el backend envía este evento para cerrar la sesión anterior.
   */
  private subscribeForceLogout(): void {
    this.forceLogoutSubscription?.unsubscribe();
    this.forceLogoutSubscription = this.websocketService.subscribe('/user/queue/messages')
      .subscribe((message: any) => {
        if (message?.type === 'FORCE_LOGOUT') {
          console.log('[AUTH] FORCE_LOGOUT recibido:', message.payload?.reason);
          this.websocketService.disconnect();
          this.sipService.unregister();
          alert(message.payload?.reason || 'Se inició sesión en otro dispositivo');
          this.authService.logout();
        }
      });
  }

  private iniciarMonitoreoInactividad(): void {
    // Resetear flag de cierre de sesión
    this.sessionClosing = false;

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
      width: 'auto',
      disableClose: true,
      hasBackdrop: true,
      panelClass: 'session-warning-panel'
    });

    this.dialogRef.afterClosed().subscribe((result: string) => {
      this.dialogRef = null;

      if (result === 'logout') {
        this.logout();
      }
      // NO llamar cerrarSesionPorInactividad si result === 'timeout'
      // porque onTimeout$ ya lo llamó (evita duplicado)
      // Si result === 'continue', el usuario clickeó continuar y el contador ya se reseteó
    });
  }

  private cerrarSesionPorInactividad(): void {
    // Evitar múltiples llamadas - NO resetear este flag
    if (this.sessionClosing) {
      return;
    }
    this.sessionClosing = true;

    // Cerrar modal si está abierto
    if (this.dialogRef) {
      this.dialogRef.close();
      this.dialogRef = null;
    }

    // Mostrar alerta PRIMERO (bloqueante)
    alert('Tu sesión ha expirado por inactividad');

    // Cerrar sesión DESPUÉS de que el usuario acepte
    this.logout();

    // Resetear flag solo después de que la navegación complete
    setTimeout(() => {
      this.sessionClosing = false;
    }, 1000);
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
        user.sipPassword || '1234',
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

        // Ignorar ACTIVE durante rellamada (no navegar ni cambiar estado)
        if (state === CallState.ACTIVE && this.sipService.isRellamadaActive()) {
          console.log('📞 [App] Ignorando ACTIVE de rellamada');
          return;
        }

        if (state === CallState.ACTIVE && !this.hasNavigatedToTypification) {
          // ✅ CRITICAL FIX: Cancelar timeout anterior si existe
          // Evita múltiples timeouts cuando ACTIVE se emite múltiples veces (por ACK, etc)
          if (this.navigationTimeout) {
            console.log('⚠️ [App] Cancelando timeout de navegación anterior');
            clearTimeout(this.navigationTimeout);
          }

          // Marcar timestamp cuando la llamada se activa
          this.callActivatedTimestamp = Date.now();
          console.log('📞 [App] Llamada ACTIVA, esperando 1s para confirmar conexión estable...');

          // DELAY DE 1 SEGUNDO: Esperar a que el audio WebRTC se establezca completamente
          // Y verificar que la llamada sigue activa (no se cortó inmediatamente)
          this.navigationTimeout = setTimeout(() => {
            // Verificar que la llamada sigue activa y lleva al menos 1 segundo
            const callDuration = this.callActivatedTimestamp
              ? Date.now() - this.callActivatedTimestamp
              : 0;

            // Obtener el estado actual de la llamada del servicio
            const currentState = this.sipService.getCallState();

            if (callDuration >= 1000 && currentState === CallState.ACTIVE && !this.hasNavigatedToTypification) {
              // ✅ CHECK 1: Si estamos en modo supervisión, NO navegar a collection-management
              // La supervisión usa SIP calls pero no deben redirigir al supervisor
              if (this.supervisionService.isSupervisionActive()) {
                console.log('🔇 [App] Supervisión activa - NO navegando a tipificación');
                return;
              }

              // ✅ CHECK 2: Solo agentes deben ser redirigidos a collection-management
              // Admin y supervisores no deben ser redirigidos automáticamente
              // Aceptamos tanto 'AGENT' como 'ASESOR' como roles de agente
              const currentUser = this.authService.getCurrentUser();
              const agentRoles = ['AGENT', 'ASESOR'];
              if (currentUser && !agentRoles.includes(currentUser.role)) {
                console.log(`🔇 [App] Usuario no es AGENT/ASESOR (${currentUser.role}) - NO navegando a tipificación`);
                return;
              }

              console.log(`📞 [App] Llamada estable (${callDuration}ms), navegando a tipificación...`);
              this.hasNavigatedToTypification = true;
              // ✅ FIX: Limpiar timeout después de navegación exitosa
              // Esto evita que IDLE dispare restauración incorrecta del estado
              this.navigationTimeout = null;
              this.router.navigate(['/collection-management']);
            } else {
              console.log(`⚠️ [App] Llamada terminó antes de establecerse (${callDuration}ms, estado: ${currentState}), NO navegando`);
            }
          }, 1000);
        }

        // Ignorar eventos de fin de llamada durante rellamada (manejada por collection-management)
        if ((state === CallState.ENDED || state === CallState.IDLE) && this.sipService.isRellamadaActive()) {
          console.log('📞 [App] Ignorando evento de fin de rellamada');
          return;
        }

        // Cuando la llamada termina, cancelar navegación y resetear flags
        if (state === CallState.ENDED || state === CallState.IDLE) {
          // Cancelar navegación pendiente si la llamada termina antes del delay
          if (this.navigationTimeout && !this.hasNavigatedToTypification) {
            clearTimeout(this.navigationTimeout);
            this.navigationTimeout = null;
            console.log('🚫 [App] Navegación cancelada - llamada terminó sin establecerse');

            // ✅ FIX: Restaurar estado del agente a DISPONIBLE si la llamada falló
            // Esto evita que el agente se quede "pegado" en TIPIFICANDO
            const currentUser = this.authService.getCurrentUser();
            const agentRoles = ['AGENT', 'ASESOR'];
            if (currentUser && agentRoles.includes(currentUser.role)) {
              console.log('🔄 [App] Restaurando estado del agente a DISPONIBLE...');
              this.agentStatusService.finalizarTipificacion(currentUser.id).subscribe({
                next: () => console.log('✅ [App] Estado del agente restaurado a DISPONIBLE'),
                error: (err) => console.error('❌ [App] Error restaurando estado:', err)
              });
            }
          }

          // Reset flags
          this.hasNavigatedToTypification = false;
          this.callActivatedTimestamp = null;
        }
      });

      // Escuchar PREDICTIVE_CALL_CONNECTED del backend via WebSocket
      // El backend envía datos del cliente (phoneNumber, contactId, etc.) al asignar la llamada.
      // Se guardan en sessionStorage porque el mensaje llega ANTES de que collection-management cargue.
      this.predictiveCallSubscription = this.websocketService.subscribe('/user/queue/messages').subscribe((message: any) => {
        if (message.type === 'PREDICTIVE_CALL_CONNECTED' && message.payload) {
          console.log('📞 [App] PREDICTIVE_CALL_CONNECTED recibido:', message.payload);
          sessionStorage.setItem('predictive_call_data', JSON.stringify(message.payload));
        }
      });

      console.log('📞 Escuchando llamadas entrantes...');

      // Verificar recordatorios pendientes después de conectar
      this.verificarRecordatoriosPendientes(user);
    } catch (error) {
      console.error('❌ Error al conectar a FreeSWITCH:', error);
    }
  }

  /**
   * Verifica si el agente tiene recordatorios pendientes.
   * Ya NO abre modal automático - el botón en agent-dashboard reemplaza esa funcionalidad.
   */
  private verificarRecordatoriosPendientes(user: any): void {
    // No-op: la funcionalidad de recordatorios se maneja ahora desde
    // el botón "Seguimiento" en el agent-dashboard y la pantalla /seguimiento.
  }

  /**
   * Inicia una llamada de recordatorio de promesa de pago
   */
  private iniciarLlamadaRecordatorio(recordatorio: any, idAgente: number): void {
    const telefono = recordatorio.telefono;

    if (!telefono) {
      console.error('❌ No hay teléfono para el recordatorio');
      return;
    }

    console.log(`📞 Llamando a ${recordatorio.nombreCliente} (${telefono}) para recordatorio de cuota ${recordatorio.numeroCuota}`);

    // Guardar datos del recordatorio para usarlos después de la tipificación
    sessionStorage.setItem('recordatorioEnCurso', JSON.stringify({
      idCuota: recordatorio.idCuota,
      idAgente: idAgente,
      idCliente: recordatorio.idCliente,
      nombreCliente: recordatorio.nombreCliente,
      telefono: telefono,
      monto: recordatorio.monto,
      numeroCuota: recordatorio.numeroCuota,
      totalCuotas: recordatorio.totalCuotas
    }));

    // Iniciar la llamada directamente - el estado EN_LLAMADA se establecerá
    // automáticamente cuando FreeSWITCH detecte CHANNEL_ANSWER
    console.log('📞 Iniciando llamada de recordatorio...');
    this.sipService.call(telefono);
  }


  logout(): void {
    console.log('[LOGOUT] Iniciando proceso de cierre de sesión...');

    // Obtener el usuario actual antes de limpiar todo
    const currentUser = this.authService.getCurrentUser();

    // Función para completar el logout (limpiar tokens y navegar a login)
    const finalizarLogout = () => {
      // Detener servicios de forma segura (con try-catch para evitar bloqueos)
      try {
        this.inactivityService.detener();
        console.log('[LOGOUT] Servicio de inactividad detenido');
      } catch (e) {
        console.error('[LOGOUT] Error deteniendo inactividad:', e);
      }

      try {
        this.websocketService.disconnect();
        console.log('[LOGOUT] WebSocket desconectado');
      } catch (e) {
        console.error('[LOGOUT] Error desconectando WebSocket:', e);
      }

      try {
        this.sipService.unregister();
        console.log('[LOGOUT] SIP desregistrado');
      } catch (e) {
        console.error('[LOGOUT] Error desregistrando SIP:', e);
      }

      // Limpiar sessionStorage (recordatorios en curso, etc.)
      try {
        sessionStorage.removeItem('recordatorioEnCurso');
        console.log('[LOGOUT] SessionStorage limpiado');
      } catch (e) {
        // Ignorar
      }

      // Siempre ejecutar el logout del auth service (limpia tokens y navega a login)
      console.log('[LOGOUT] Ejecutando authService.logout()...');
      this.authService.logout();

      // Forzar navegación a login como respaldo (por si el router.navigate del authService falla)
      setTimeout(() => {
        if (this.router.url !== '/login') {
          console.log('[LOGOUT] Forzando navegación a /login...');
          this.router.navigate(['/login'], { replaceUrl: true });
        }
      }, 100);
    };

    // Notificar al backend que el agente se desconecta ANTES de borrar el token
    if (currentUser?.id) {
      // Detener el dialer de recordatorios si estaba activo
      try {
        this.recordatoriosService.detenerDialer(currentUser.id).subscribe({
          next: () => console.log('[LOGOUT] Dialer de recordatorios detenido'),
          error: () => {} // Ignorar errores si no había dialer activo
        });
      } catch (e) {
        // Ignorar
      }

      try {
        this.agentStatusService.disconnectAgent(currentUser.id).subscribe({
          next: () => {
            console.log('[LOGOUT] Estado de agente eliminado en backend');
            finalizarLogout();
          },
          error: (e) => {
            console.error('[LOGOUT] Error eliminando estado de agente:', e);
            finalizarLogout();
          }
        });
      } catch (e) {
        console.error('[LOGOUT] Error llamando disconnectAgent:', e);
        finalizarLogout();
      }
    } else {
      finalizarLogout();
    }
  }

  isLoginPage(): boolean {
    return this.router.url === '/login';
  }

  isCollectionManagementPage(): boolean {
    return this.router.url.startsWith('/collection-management');
  }

  // Sidebar methods
  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
    // Re-detectar overflow después de colapsar/expandir sidebar
    setTimeout(() => {
      this.checkTextOverflow();
    }, 350); // Esperar a que termine la transición CSS (0.3s)
  }

  toggleMobileSidebar(): void {
    this.isMobileSidebarOpen = !this.isMobileSidebarOpen;
  }

  closeMobileSidebar(): void {
    this.isMobileSidebarOpen = false;
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
           this.router.url.includes('/cartas/no-adeudo') ||
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
    const agentRoles = ['AGENT', 'ASESOR'];
    return currentUser?.role ? agentRoles.includes(currentUser.role) : false;
  }

  // ============== Dynamic Menu Methods ==============

  /**
   * Toggle a specific dropdown menu by its codigo
   */
  toggleDynamicDropdown(codigo: string): void {
    // Auto-expand sidebar if collapsed
    if (this.isSidebarCollapsed) {
      this.isSidebarCollapsed = false;
    }

    if (this.openDropdowns.has(codigo)) {
      this.openDropdowns.delete(codigo);
    } else {
      // Close all other dropdowns first (optional: remove this to allow multiple open)
      this.openDropdowns.clear();
      this.openDropdowns.add(codigo);
    }

    // Re-detectar overflow después de abrir dropdown
    setTimeout(() => this.checkTextOverflow(), 50);
  }

  /**
   * Check if a dropdown is open
   */
  isDropdownOpen(codigo: string): boolean {
    return this.openDropdowns.has(codigo);
  }

  /**
   * Check if a menu item's route is currently active
   */
  isMenuItemActive(item: MenuItem): boolean {
    if (item.ruta) {
      return this.router.url.startsWith(item.ruta);
    }
    // For dropdown, check if any child is active
    if (item.children && item.children.length > 0) {
      return item.children.some(child => child.ruta && this.router.url.startsWith(child.ruta));
    }
    return false;
  }

  /**
   * Close all dynamic dropdowns
   */
  closeAllDynamicDropdowns(): void {
    this.openDropdowns.clear();
  }
}
