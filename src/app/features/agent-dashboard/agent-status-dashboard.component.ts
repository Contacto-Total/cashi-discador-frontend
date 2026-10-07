import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { LucideAngularModule } from 'lucide-angular';
import { AgentStatusService } from '../../core/services/agent-status.service';
import { AuthService } from '../../core/services/auth.service';
import { CampaignService } from '../../core/services/campaign.service';
import { SipService } from '../../core/services/sip.service';
import { RecordatoriosService } from '../../core/services/recordatorios.service';
import {
  AgentStatus,
  AgentState,
  AGENT_STATE_LABELS,
  MANUAL_STATES
} from '../../core/models/agent-status.model';
import { environment } from '../../../environments/environment';
import { ThemeService } from '../../shared/services/theme.service';
import { UmbralesEstadoService } from '../../maintenance/services/umbrales-estado.service';
import { PageHeaderComponent } from '../../shared/ui/page-header.component';
import { TarjetaLuzDirective } from '../../shared/ui/tarjeta-luz.directive';
import { TituloTarjetaComponent } from '../../shared/ui/titulo-tarjeta.component';
import { AnilloTiempoComponent } from '../../shared/ui/anillo-tiempo.component';
import { EscalaTiempoComponent } from '../../shared/ui/escala-tiempo.component';
import { BotonEstadoComponent } from '../../shared/ui/boton-estado.component';
import { BotonDirective } from '../../shared/ui/boton.directive';
import { ModoReloj } from '../../shared/ui/reloj-estado';
import { ESTADOS_OPERATIVOS, ESTADOS_PANEL, EstadoPanel, NIVELES, Nivel, UmbralTiempo as Umbral, nivelDeTiempo } from './estados-panel';

@Component({
  selector: 'app-agent-status-dashboard',
  standalone: true,
  imports: [
    CommonModule, LucideAngularModule, PageHeaderComponent, TarjetaLuzDirective, TituloTarjetaComponent,
    AnilloTiempoComponent, EscalaTiempoComponent, BotonEstadoComponent, BotonDirective
  ],
  templateUrl: './agent-status-dashboard.component.html',
  host: { class: 'cashi-pantalla flex flex-1 flex-col' }
})
export class AgentStatusDashboardComponent implements OnInit, OnDestroy {
  currentStatus: AgentStatus | null = null;
  agentName: string = '';
  anexo: string = '';
  loading: boolean = false;
  error: string | null = null;

  // Campaign status indicator
  isDiscando: boolean = false;
  campaignName: string | null = null;

  // Seguimiento/Recordatorios
  recordatoriosPendientes: number = 0;
  recordatoriosHabilitado: boolean = false;

  private statusSubscription?: Subscription;
  private currentStatusSubscription?: Subscription;
  private wsStatusSubscription?: Subscription;
  private campaignStatusSubscription?: Subscription;
  private recordatoriosSubscription?: Subscription;
  // Reloj del estado. `segundos` es el tiempo real; `vista*` es lo que dibujan el arco del anillo
  // y la marca de la escala, que al cambiar de estado se apagan antes de saltar al inicio.
  segundos = 0;
  vistaSegundos = 0;
  vistaTrazo = 'var(--muted-foreground)';
  modoReloj: ModoReloj = 'quieta';
  private baseSegundos = 0;
  private baseEn = Date.now();
  private estadoPintado: AgentState | null = null;
  private tic?: ReturnType<typeof setInterval>;
  private relevo?: ReturnType<typeof setTimeout>;
  private umbrales = new Map<string, Umbral>();

  private userId: number | null = null;
  private subPortfolioId: number | null = null;
  private previousState: AgentState | null = null;
  private boundBeforeUnload = () => {
    // Notificar al backend que la página se está cerrando (beacon disconnect)
    // El backend espera 5s y verifica si el usuario reconectó (refresh = reconecta, cierre = no)
    // La recarga tras un mantenimiento no avisa: el asesor conserva su estado (p. ej. Comida).
    if (sessionStorage.getItem('cashi_recarga_mantenimiento')) {
      return;
    }
    if (this.userId) {
      const token = localStorage.getItem('callcenter_token');
      if (token) {
        fetch(`${environment.apiUrl}/agent-status/${this.userId}/beacon-disconnect`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ userId: this.userId }),
          keepalive: true  // Asegura que el request se complete incluso después de cerrar la página
        }).catch(() => {}); // Ignorar errores silenciosamente
      }
    }
  };

  // Estados disponibles
  AgentState = AgentState;
  stateLabels = AGENT_STATE_LABELS;
  manualStates = MANUAL_STATES;
  readonly operativos = MANUAL_STATES.filter(e => ESTADOS_OPERATIVOS.has(e));
  readonly pausas = MANUAL_STATES.filter(e => !ESTADOS_OPERATIVOS.has(e));

  constructor(
    private agentStatusService: AgentStatusService,
    private authService: AuthService,
    private campaignService: CampaignService,
    private recordatoriosService: RecordatoriosService,
    private router: Router,
    private sipService: SipService,
    private umbralesService: UmbralesEstadoService,
    private tema: ThemeService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    this.userId = user.id;
    this.subPortfolioId = user.subPortfolioId || null;
    this.agentName = user.firstName + ' ' + user.lastName || user.username;
    this.anexo = user.sipExtension || '';

    // Tramos del semáforo por estado. Si no llegan, el panel funciona igual: sin escala.
    this.umbralesService.getActivos().subscribe({
      next: lista => {
        lista.forEach(u => this.umbrales.set(u.estado, {
          verde: u.umbralVerdeSegundos, ambar: u.umbralAmarilloSegundos, tope: u.tiempoMaximoSegundos
        }));
        this.pintarReloj();
      },
      error: () => {}
    });
    this.tic = setInterval(() => this.pintarReloj(), 1000);

    // No aceptar SIP hasta conocer el estado durable del agente.
    this.sipService.blockIncomingCallsMode(true);

    this.loadAgentStatus(user.id);

    // WebSocket: cambios de estado en tiempo real (instantáneo)
    this.wsStatusSubscription = this.agentStatusService
      .subscribeToStatusUpdates(user.id)
      .subscribe();

    // Polling cada 30 segundos (fallback + sync umbrales/colores)
    this.statusSubscription = this.agentStatusService
      .startStatusPolling(user.id)
      .subscribe();

    // Polling para estado de campaña cada 15 segundos
    if (this.subPortfolioId) {
      this.checkCampaignStatus();
      this.campaignStatusSubscription = interval(15000).subscribe(() => {
        this.checkCampaignStatus();
      });
    }

    // Verificar recordatorios pendientes
    this.checkRecordatoriosDisponibles();
    this.recordatoriosSubscription = interval(60000).subscribe(() => {
      this.checkRecordatoriosDisponibles();
    });

    // Cierre de ventana: beacon para que el backend marque DESCONECTADO si no reconecta.
    window.addEventListener('beforeunload', this.boundBeforeUnload);

    // Salir de esta pantalla NO cambia el estado: BREAK, Comida, Reunion, etc. se mantienen.
    // La unica excepcion es DISPONIBLE -> EN_LINEA, y la resuelve AgentPresenceService.
  }

  ngOnDestroy(): void {
    window.removeEventListener('beforeunload', this.boundBeforeUnload);
    clearInterval(this.tic);
    clearTimeout(this.relevo);
    if (this.statusSubscription) {
      this.statusSubscription.unsubscribe();
    }
    if (this.currentStatusSubscription) {
      this.currentStatusSubscription.unsubscribe();
    }
    if (this.wsStatusSubscription) {
      this.wsStatusSubscription.unsubscribe();
    }
    if (this.recordatoriosSubscription) {
      this.recordatoriosSubscription.unsubscribe();
    }
    if (this.campaignStatusSubscription) {
      this.campaignStatusSubscription.unsubscribe();
    }
  }

  private hasRecoverablePredictiveContext(userId: number): boolean {
    try {
      const rawContext = sessionStorage.getItem('predictive_call_data');
      const context = rawContext ? JSON.parse(rawContext) : null;
      return !!context?.callUuid && context.agentId === userId;
    } catch {
      return false;
    }
  }

  loadAgentStatus(userId: number): void {
    this.loading = true;
    this.error = null;

    this.agentStatusService.getAgentStatus(userId).subscribe({
      next: (response) => {
        this.currentStatus = {
          idUsuario: response.idUsuario,
          estadoActual: response.estadoActual as AgentState,
          estadoAnterior: response.estadoAnterior as AgentState | undefined,
          timestampCambio: response.timestampCambio,
          tiempoEnEstadoMinutos: response.tiempoEnEstadoMinutos,
          notas: response.notas,
          sessionId: response.sessionId,
          segundosEnEstado: response.segundosEnEstado,
          tiempoMaximoSegundos: response.tiempoMaximoSegundos
        };
        this.loading = false;
        this.fijarReloj(this.currentStatus);

        const releaseKey = `tipification-release-pending-${userId}`;
        if (response.estadoActual !== AgentState.TIPIFICANDO) {
          sessionStorage.removeItem(releaseKey);
        } else if (sessionStorage.getItem(releaseKey) && !this.hasRecoverablePredictiveContext(userId)) {
          this.agentStatusService.finalizarTipificacion(userId).subscribe({
            next: () => sessionStorage.removeItem(releaseKey),
            error: (err: any) => console.error('[AgentDashboard] Error liberando tipificación pendiente:', err)
          });
        }

        // Si está DESCONECTADO, lo activamos EN LÍNEA, no en DISPONIBLE: queda conectado
        // pero fuera de la cola, y entra a la cola cuando él elige Disponible.
        if (response.estadoActual === 'DESCONECTADO') {
          console.log('[AgentDashboard] Agente DESCONECTADO - activando como EN_LINEA');
          this.agentStatusService.changeStatus(this.userId!, {
            estado: AgentState.EN_LINEA,
            notas: 'Entró a la pantalla de agente'
          }).subscribe();
        }

        this.sipService.blockIncomingCallsMode(response.estadoActual !== AgentState.DISPONIBLE);
      },
      error: (err) => {
        console.error('Error loading agent status:', err);
        this.error = 'Error al cargar el estado del agente';
        this.loading = false;

        // Si no existe estado (agente nuevo o desconectado), crear EN LÍNEA
        if (err.status === 404 && this.userId) {
          console.log('[AgentDashboard] Sin estado previo - creando como EN_LINEA');
          this.agentStatusService.changeStatus(this.userId, {
            estado: AgentState.EN_LINEA,
            notas: 'Entró a la pantalla de agente (nuevo)'
          }).subscribe();
        }
      }
    });

    // Suscribirse a cambios del estado
    this.currentStatusSubscription = this.agentStatusService.currentStatus$.subscribe(status => {
      if (status) {
        this.sipService.blockIncomingCallsMode(status.estadoActual !== AgentState.DISPONIBLE);

        this.previousState = status.estadoActual;
        this.currentStatus = status;
        this.fijarReloj(status);
      }
    });
  }



  /**
   * Verifica el estado de discado de campañas para la subcartera del agente
   */
  private checkCampaignStatus(): void {
    if (!this.subPortfolioId) return;

    this.campaignService.getDiscandoStatus(this.subPortfolioId).subscribe({
      next: (response) => {
        this.isDiscando = response.discando;
        this.campaignName = response.nombreCampana || null;
      },
      error: (err) => {
        console.error('[AgentDashboard] Error checking campaign status:', err);
        // En caso de error, no cambiar el estado actual
      }
    });
  }

  private checkRecordatoriosDisponibles(): void {
    if (!this.userId) return;

    this.recordatoriosService.getMisRecordatoriosSiEnHorario(this.userId, this.subPortfolioId || undefined).subscribe({
      next: ({ recordatorios, horarioInfo }) => {
        const pendientes = recordatorios.filter(r => !r.yaLlamoHoy);
        this.recordatoriosPendientes = pendientes.length;
        this.recordatoriosHabilitado = (!horarioInfo || horarioInfo.permitido) && pendientes.length > 0;
      },
      error: () => {
        this.recordatoriosPendientes = 0;
        this.recordatoriosHabilitado = false;
      }
    });
  }

  enterSeguimiento(): void {
    this.router.navigate(['/seguimiento']);
  }

  changeStatus(newState: AgentState): void {
    if (!this.currentStatus || this.loading) return;

    this.loading = true;
    this.error = null;

    this.agentStatusService.changeStatus(this.currentStatus.idUsuario, {
      estado: newState,
      notas: `Cambio manual a ${this.stateLabels[newState]}`
    }).subscribe({
      next: () => {
        this.loading = false;
      },
      error: (err) => {
        console.error('Error changing status:', err);
        this.error = 'Error al cambiar el estado';
        this.loading = false;
      }
    });
  }

  enterManualMode(): void {
    if (!this.currentStatus || this.loading) return;

    this.loading = true;
    this.error = null;

    this.agentStatusService.enterManualMode(this.currentStatus.idUsuario).subscribe({
      next: () => {
        this.loading = false;
        // NAVEGAR A GESTION MANUAL
        this.router.navigate(['/manual-management']);
      },
      error: (err) => {
        console.error('Error entering manual mode:', err);
        this.error = 'Error al entrar en modo manual';
        this.loading = false;
      }
    });
  }

  isCurrentState(state: AgentState): boolean {
    return this.currentStatus?.estadoActual === state;
  }

  canChangeToState(state: AgentState): boolean {
    // No puede cambiar si está en llamada o tipificando
    if (this.currentStatus?.estadoActual === AgentState.EN_LLAMADA ||
        this.currentStatus?.estadoActual === AgentState.TIPIFICANDO) {
      return false;
    }
    // Solo puede cambiar a estados manuales
    return this.manualStates.includes(state);
  }

  // ----------------------------------------------------------------- Presentación

  /** Cómo se muestra el estado actual. */
  get estado(): EstadoPanel | null {
    return this.currentStatus ? ESTADOS_PANEL[this.currentStatus.estadoActual] ?? null : null;
  }

  ficha(e: AgentState): EstadoPanel {
    return ESTADOS_PANEL[e];
  }

  /** Color del estado para bordes, foco y baldosas. */
  tono(e: EstadoPanel | null): string {
    return !e ? 'var(--muted-foreground)' : this.tema.isDarkMode() && e.oscuro ? e.oscuro : e.tono;
  }

  /** El mismo color en su versión legible, para el titular y los iconos. */
  tinta(e: EstadoPanel | null): string {
    return !e ? 'var(--muted-foreground)' : this.tema.isDarkMode() ? e.oscuro ?? e.tono : e.tinta ?? e.tono;
  }

  /** Hay promesas por llamar: «Llamada manual» y «Seguimiento» pasan a tarjetas aparte. */
  get conSeguimiento(): boolean {
    return this.recordatoriosPendientes > 0;
  }

  /** Lo controla el sistema: no se cambia a mano. */
  get enEstadoDeSistema(): boolean {
    const e = this.currentStatus?.estadoActual;
    return e === AgentState.EN_LLAMADA || e === AgentState.TIPIFICANDO;
  }

  get umbral(): Umbral | null {
    const e = this.currentStatus?.estadoActual;
    const u = e ? this.umbrales.get(e) : undefined;
    return u && u.tope > 0 ? u : null;
  }

  /** Tope del anillo: el del umbral, o el que manda el backend con el estado. */
  get tope(): number | null {
    return this.umbral?.tope ?? this.currentStatus?.tiempoMaximoSegundos ?? null;
  }

  get nivel(): Nivel | null {
    const u = this.umbral;
    return u ? nivelDeTiempo(this.segundos, u) : null;
  }

  get semaforo() {
    return this.nivel ? NIVELES[this.nivel] : null;
  }

  get estadoPrevio(): string {
    const e = this.currentStatus?.estadoAnterior;
    return e ? ESTADOS_PANEL[e]?.nombre ?? this.stateLabels[e] : '—';
  }

  // ----------------------------------------------------------------- Reloj

  /** Toma el tiempo que manda el backend como base y sigue contando en local. */
  private fijarReloj(status: AgentStatus): void {
    const desdeCambio = (Date.now() - Date.parse(status.timestampCambio)) / 1000;
    this.baseSegundos = status.segundosEnEstado ?? (Number.isFinite(desdeCambio) ? Math.max(0, desdeCambio) : 0);
    this.baseEn = Date.now();
    this.pintarReloj();
  }

  /**
   * El arco y la marca solo se deslizan de un segundo al siguiente. Si el tiempo salta (se volvió a
   * la pantalla, llegó una corrección) se colocan de golpe; al cambiar de estado se apagan en su
   * sitio y aparecen en el nuevo, en vez de retroceder por la barra.
   */
  private pintarReloj(): void {
    const estado = this.currentStatus?.estadoActual ?? null;
    const antes = this.segundos;
    this.segundos = Math.max(0, Math.floor(this.baseSegundos + (Date.now() - this.baseEn) / 1000));
    const trazo = this.semaforo?.trazo ?? 'var(--muted-foreground)';

    if (estado !== this.estadoPintado && this.estadoPintado !== null) {
      this.estadoPintado = estado;
      this.modoReloj = 'fuera';
      clearTimeout(this.relevo);
      this.relevo = setTimeout(() => {
        this.relevo = undefined;
        this.vistaSegundos = this.segundos;
        this.vistaTrazo = this.semaforo?.trazo ?? 'var(--muted-foreground)';
        this.modoReloj = 'oculta';
        requestAnimationFrame(() => requestAnimationFrame(() => { this.modoReloj = 'suave'; }));
      }, 150);
      return;
    }
    this.estadoPintado = estado;
    if (this.relevo || this.modoReloj === 'oculta') {
      return;
    }
    this.modoReloj = this.segundos - antes === 1 ? 'suave' : 'quieta';
    this.vistaSegundos = this.segundos;
    this.vistaTrazo = trazo;
  }
}
