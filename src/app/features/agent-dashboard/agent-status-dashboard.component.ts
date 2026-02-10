import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationStart } from '@angular/router';
import { Subscription, filter, interval } from 'rxjs';
import { LucideAngularModule } from 'lucide-angular';
import { AgentStatusService } from '../../core/services/agent-status.service';
import { AuthService } from '../../core/services/auth.service';
import { CampaignService } from '../../core/services/campaign.service';
import { SipService } from '../../core/services/sip.service';
import {
  AgentStatus,
  AgentState,
  AGENT_STATE_LABELS,
  MANUAL_STATES
} from '../../core/models/agent-status.model';

@Component({
  selector: 'app-agent-status-dashboard',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './agent-status-dashboard.component.html',
  styleUrls: ['./agent-status-dashboard.component.css']
})
export class AgentStatusDashboardComponent implements OnInit, OnDestroy {
  currentStatus: AgentStatus | null = null;
  agentName: string = '';
  loading: boolean = false;
  error: string | null = null;

  // Campaign status indicator
  isDiscando: boolean = false;
  campaignName: string | null = null;

  private statusSubscription?: Subscription;
  private routerSubscription?: Subscription;
  private campaignStatusSubscription?: Subscription;
  private userId: number | null = null;
  private subPortfolioId: number | null = null;
  private previousState: AgentState | null = null;
  private audioContext: AudioContext | null = null;
  private isPageRefreshing = false;
  private boundBeforeUnload = () => { this.isPageRefreshing = true; };

  // Estados disponibles
  AgentState = AgentState;
  stateLabels = AGENT_STATE_LABELS;
  manualStates = MANUAL_STATES;

  constructor(
    private agentStatusService: AgentStatusService,
    private authService: AuthService,
    private campaignService: CampaignService,
    private router: Router,
    private sipService: SipService
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
    this.loadAgentStatus(user.id);

    // Polling cada 30 segundos
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

    // Detectar refresh de página para NO marcar como DESCONECTADO
    window.addEventListener('beforeunload', this.boundBeforeUnload);

    // Escuchar navegación para desconectar al salir de esta pantalla
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationStart)
    ).subscribe((event: any) => {
      // Si es un refresh del navegador, no desconectar
      if (this.isPageRefreshing) return;

      const targetUrl = event.url;
      // Si NO va a collection-management (tipificación), desconectar
      // Permitir también /login para logout normal
      if (!targetUrl.startsWith('/collection-management') && !targetUrl.startsWith('/login')) {
        this.setDesconectado();
      }
    });
  }

  ngOnDestroy(): void {
    window.removeEventListener('beforeunload', this.boundBeforeUnload);
    if (this.statusSubscription) {
      this.statusSubscription.unsubscribe();
    }
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    if (this.campaignStatusSubscription) {
      this.campaignStatusSubscription.unsubscribe();
    }
  }

  /**
   * Marca al agente como DESCONECTADO cuando sale de esta pantalla
   * (excepto si va a tipificación)
   */
  private setDesconectado(): void {
    if (!this.userId) return;

    // Solo desconectar si está en un estado que permite recibir llamadas
    const currentState = this.currentStatus?.estadoActual;
    if (currentState === AgentState.DISPONIBLE ||
        currentState === AgentState.EN_REUNION ||
        currentState === AgentState.REFRIGERIO ||
        currentState === AgentState.SSHH) {
      console.log('[AgentDashboard] Saliendo de pantalla de agente - marcando como DESCONECTADO');
      this.agentStatusService.changeStatus(this.userId, {
        estado: AgentState.DESCONECTADO,
        notas: 'Salió de la pantalla de agente'
      }).subscribe({
        error: (err) => console.error('Error al desconectar agente:', err)
      });
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
          sessionId: response.sessionId
        };
        this.loading = false;

        // Si está DESCONECTADO, cambiar a DISPONIBLE automáticamente
        if (response.estadoActual === 'DESCONECTADO') {
          console.log('[AgentDashboard] Agente DESCONECTADO - activando como DISPONIBLE');
          this.agentStatusService.changeStatus(this.userId!, {
            estado: AgentState.DISPONIBLE,
            notas: 'Entró a la pantalla de agente'
          }).subscribe();
        }

        // SYNC: Si ya está DISPONIBLE al cargar, asegurar que llamadas estén desbloqueadas
        if (response.estadoActual === 'DISPONIBLE') {
          console.log('[AgentDashboard] ✅ Carga inicial con estado DISPONIBLE - desbloqueando llamadas');
          this.sipService.blockIncomingCallsMode(false);
        }
      },
      error: (err) => {
        console.error('Error loading agent status:', err);
        this.error = 'Error al cargar el estado del agente';
        this.loading = false;

        // Si no existe estado (agente nuevo o desconectado), crear como DISPONIBLE
        if (err.status === 404 && this.userId) {
          console.log('[AgentDashboard] Sin estado previo - creando como DISPONIBLE');
          this.agentStatusService.changeStatus(this.userId, {
            estado: AgentState.DISPONIBLE,
            notas: 'Entró a la pantalla de agente (nuevo)'
          }).subscribe();
        }
      }
    });

    // Suscribirse a cambios del estado
    this.agentStatusService.currentStatus$.subscribe(status => {
      if (status) {
        // Detectar cambio a EN_LLAMADA para reproducir beep
        if (status.estadoActual === AgentState.EN_LLAMADA &&
            this.previousState !== AgentState.EN_LLAMADA) {
          console.log('[AgentDashboard] 📞 Llamada entrante - reproduciendo alerta');
          this.playCallAlert();
        }

        // SYNC: Si el estado del backend es DISPONIBLE, desbloquear llamadas entrantes
        // Esto soluciona la desincronización cuando blockIncomingCalls quedó en true
        if (status.estadoActual === AgentState.DISPONIBLE) {
          console.log('[AgentDashboard] ✅ Estado DISPONIBLE - desbloqueando llamadas entrantes');
          this.sipService.blockIncomingCallsMode(false);
        }

        this.previousState = status.estadoActual;
        this.currentStatus = status;
      }
    });
  }

  /**
   * Reproduce un beep de alerta cuando entra una llamada
   * Usa Web Audio API para generar el sonido
   */
  private playCallAlert(): void {
    try {
      // Crear AudioContext si no existe
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const ctx = this.audioContext;

      // Reproducir 2 beeps
      this.playBeep(ctx, 0);      // Primer beep inmediato
      this.playBeep(ctx, 0.2);    // Segundo beep a los 200ms
    } catch (error) {
      console.error('Error reproduciendo alerta de llamada:', error);
    }
  }

  /**
   * Genera y reproduce un beep individual
   */
  private playBeep(ctx: AudioContext, delay: number): void {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = 800;  // Frecuencia en Hz
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime + delay);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + 0.15);

    oscillator.start(ctx.currentTime + delay);
    oscillator.stop(ctx.currentTime + delay + 0.15);
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
        // Navegar al softphone
        this.router.navigate(['/dialer']);
      },
      error: (err) => {
        console.error('Error entering manual mode:', err);
        this.error = 'Error al entrar en modo manual';
        this.loading = false;
      }
    });
  }

  getStateColor(state: AgentState): string {
    const colors: Record<AgentState, string> = {
      [AgentState.DISPONIBLE]: '#4caf50',
      [AgentState.EN_REUNION]: '#ff9800',
      [AgentState.REFRIGERIO]: '#2196f3',
      [AgentState.SSHH]: '#9c27b0',
      [AgentState.EN_LLAMADA]: '#f44336',
      [AgentState.TIPIFICANDO]: '#ff5722',
      [AgentState.EN_MANUAL]: '#607d8b',
      [AgentState.DESCONECTADO]: '#9e9e9e'
    };
    return colors[state] || '#757575';
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

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
