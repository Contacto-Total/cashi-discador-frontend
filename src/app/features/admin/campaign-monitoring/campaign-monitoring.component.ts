import { Component, OnInit, OnDestroy, ViewEncapsulation, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LucideAngularModule } from 'lucide-angular';
import { CampaignAdminService, Campaign } from '../../../core/services/campaign-admin.service';
import { AutoDialerService, AutoDialerEstadisticas, AgenteMonitoreo, LlamadaTiempoReal } from '../../../core/services/autodialer.service';
import { StatusAlarmClockComponent } from '../../../shared/components/status-alarm-clock/status-alarm-clock.component';

// Interfaz para alertas de agentes
interface AgentAlert {
  agente: AgenteMonitoreo;
  timestamp: Date;
}

@Component({
  selector: 'app-campaign-monitoring',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, StatusAlarmClockComponent],
  templateUrl: './campaign-monitoring.component.html',
  styleUrls: ['./campaign-monitoring.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CampaignMonitoringComponent implements OnInit, OnDestroy {
  // Campaigns
  campaigns: Campaign[] = [];
  selectedCampaignId: number | null = null;
  loadingCampaigns: boolean = false;

  // Auto-Dialer Stats
  autoDialerStats: AutoDialerEstadisticas | null = null;
  private autoDialerSubscription?: Subscription;

  // Agentes
  agentesMonitoreo: AgenteMonitoreo[] = [];
  private agentesSubscription?: Subscription;

  // Llamadas en tiempo real
  llamadasEnTiempoReal: LlamadaTiempoReal[] = [];
  private llamadasSubscription?: Subscription;

  // Sistema de alertas
  alertaActiva: AgentAlert | null = null;
  alertasDismissed: Set<string> = new Set(); // IDs de alertas ya cerradas (agente-estado)
  private alarmAudio: HTMLAudioElement | null = null;

  constructor(
    private campaignService: CampaignAdminService,
    private autoDialerService: AutoDialerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initAlarmAudio();
    this.loadCampaigns();
    this.startAutoDialerPolling();
    this.startAgentesPolling();
    this.startLlamadasPolling();
  }

  ngOnDestroy(): void {
    if (this.autoDialerSubscription) {
      this.autoDialerSubscription.unsubscribe();
    }
    if (this.agentesSubscription) {
      this.agentesSubscription.unsubscribe();
    }
    if (this.llamadasSubscription) {
      this.llamadasSubscription.unsubscribe();
    }
    this.stopAlarm();
  }

  /**
   * Inicializa el audio de alarma
   */
  private initAlarmAudio(): void {
    // Crear elemento de audio con un sonido de alarma simple
    this.alarmAudio = new Audio();
    // Usamos un data URI para un beep simple (no necesita archivo externo)
    this.alarmAudio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdH2LkZuam5aTiXxsWk1EU2h9j5yhpqSfloV0X0g4OExfc4iaqrCxraSWg2xTPC00RFtxh5mqtLi1raCPeV9GMTAvRFpwh5iqtLi1raCQeWBHMTAwRVtxh5iqtLi1raCPeV9GMTEvRFpxiJmqtLm1raCQeV9HMjAvRVtxh5mqtLi0rJ+PeF5FMS8vRFpwh5mqtLm1raCQeWBGMTAvRVtxh5mqtLi1raCPeV9HMTAwRVtxh5mqtLi1raCPeWBHMTAwRVxxiJmqtLi1raCQeWBGMTAwRVtxh5mqtLi0rJ+PeF5FMS8vRFpwh5mqtLm1raCQeWBGMTAvRVtxh5mqtLi1raCPeV9HMTAwRVtxh5mqtLi1raCPeWBHMTAwRVxxiJmqtLi1raCQeWBGMTAwRVtxh5mqtLi0rJ+PeF5FMS8vRFpwh5mqtLm1';
    this.alarmAudio.loop = true;
  }

  /**
   * Carga todas las campañas para el selector
   */
  loadCampaigns(): void {
    this.loadingCampaigns = true;
    this.campaignService.getAllCampaigns().subscribe({
      next: (campaigns) => {
        this.campaigns = campaigns;
        this.loadingCampaigns = false;

        // Auto-select first active campaign
        if (campaigns.length > 0 && !this.selectedCampaignId) {
          const activeCampaign = campaigns.find(c => c.status === 'ACTIVE');
          this.selectedCampaignId = activeCampaign?.id || campaigns[0].id || null;
        }
      },
      error: (err) => {
        console.error('Error loading campaigns:', err);
        this.loadingCampaigns = false;
      }
    });
  }

  /**
   * Handler cuando se selecciona una campaña diferente
   */
  onCampaignChange(): void {
    console.log('Selected campaign changed to:', this.selectedCampaignId);

    // Restart stats polling with new campaign filter
    if (this.autoDialerSubscription) {
      this.autoDialerSubscription.unsubscribe();
    }
    this.startAutoDialerPolling();

    // Restart llamadas polling with new campaign filter
    if (this.llamadasSubscription) {
      this.llamadasSubscription.unsubscribe();
    }
    this.startLlamadasPolling();
  }

  /**
   * Inicia polling del estado del auto-dialer cada 5 segundos
   * Filtra por campaña si hay una seleccionada
   */
  startAutoDialerPolling(): void {
    const campaignId = this.selectedCampaignId || undefined;
    this.autoDialerSubscription = this.autoDialerService.startStatsPolling(campaignId).subscribe({
      next: (stats) => {
        this.autoDialerStats = stats;
      },
      error: (err) => {
        console.error('Error polling auto-dialer stats:', err);
      }
    });
  }

  /**
   * Inicia polling de agentes cada 3 segundos
   */
  startAgentesPolling(): void {
    this.agentesSubscription = this.autoDialerService.startAgentesPolling().subscribe({
      next: (agentes) => {
        this.agentesMonitoreo = agentes;
        // Verificar alertas de tiempo excedido
        this.checkAgentAlerts(agentes);
      },
      error: (err) => {
        console.error('Error polling agentes:', err);
      }
    });
  }

  /**
   * Verifica si hay agentes que exceden el tiempo y muestra alerta
   */
  private checkAgentAlerts(agentes: AgenteMonitoreo[]): void {
    // Si ya hay una alerta activa, no mostrar otra
    if (this.alertaActiva) return;

    for (const agente of agentes) {
      if (agente.excedeTiempoMaximo && agente.mensajeAlerta) {
        const alertKey = `${agente.idUsuario}-${agente.estadoActual}`;

        // Si esta alerta ya fue cerrada, no mostrarla de nuevo
        if (this.alertasDismissed.has(alertKey)) continue;

        // Mostrar alerta
        this.showAlert(agente);
        break;
      }
    }
  }

  /**
   * Muestra la alerta para un agente
   */
  showAlert(agente: AgenteMonitoreo): void {
    this.alertaActiva = {
      agente,
      timestamp: new Date()
    };

    // Reproducir sonido si está habilitado
    if (agente.sonidoAlerta) {
      this.playAlarm();
    }
  }

  /**
   * Cierra la alerta actual
   */
  dismissAlert(): void {
    if (this.alertaActiva) {
      const alertKey = `${this.alertaActiva.agente.idUsuario}-${this.alertaActiva.agente.estadoActual}`;
      this.alertasDismissed.add(alertKey);
      this.alertaActiva = null;
      this.stopAlarm();
    }
  }

  /**
   * Cierra alerta si se hace click fuera del modal
   */
  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('alert-overlay')) {
      this.dismissAlert();
    }
  }

  /**
   * Reproduce el sonido de alarma
   */
  private playAlarm(): void {
    if (this.alarmAudio) {
      this.alarmAudio.currentTime = 0;
      this.alarmAudio.play().catch(err => {
        console.warn('No se pudo reproducir la alarma:', err);
      });
    }
  }

  /**
   * Detiene el sonido de alarma
   */
  private stopAlarm(): void {
    if (this.alarmAudio) {
      this.alarmAudio.pause();
      this.alarmAudio.currentTime = 0;
    }
  }

  /**
   * Limpia las alertas cerradas cuando un agente cambia de estado
   */
  clearDismissedForAgent(idUsuario: number): void {
    const keysToRemove: string[] = [];
    this.alertasDismissed.forEach(key => {
      if (key.startsWith(`${idUsuario}-`)) {
        keysToRemove.push(key);
      }
    });
    keysToRemove.forEach(key => this.alertasDismissed.delete(key));
  }

  /**
   * Inicia polling de llamadas en tiempo real
   * Filtra por campaña si hay una seleccionada
   */
  startLlamadasPolling(): void {
    const campaignId = this.selectedCampaignId || undefined;
    this.llamadasSubscription = this.autoDialerService.startLlamadasPolling(campaignId).subscribe({
      next: (llamadas) => {
        this.llamadasEnTiempoReal = llamadas;
      },
      error: (err) => {
        console.error('Error polling llamadas en tiempo real:', err);
      }
    });
  }

  /**
   * Obtiene la hora actual en formato HH:MM:SS
   */
  getCurrentTime(): string {
    const now = new Date();
    return now.toLocaleTimeString('es-PE', { hour12: false });
  }

  /**
   * Obtiene el color según el estado del agente
   */
  getEstadoColor(estado: string): string {
    switch (estado) {
      case 'DISPONIBLE': return '#10B981'; // Verde
      case 'EN_LLAMADA': return '#3B82F6'; // Azul
      case 'DESCONECTADO': return '#EF4444'; // Rojo
      case 'PAUSADO': return '#F59E0B'; // Amarillo
      case 'EN_REUNION': return '#8B5CF6'; // Púrpura
      case 'REFRIGERIO': return '#F59E0B'; // Amarillo
      case 'SSHH': return '#F59E0B'; // Amarillo
      case 'TIPIFICANDO': return '#06B6D4'; // Cyan
      default: return '#6B7280'; // Gris
    }
  }

  /**
   * Obtiene el ícono según el estado del agente
   */
  getEstadoIcon(estado: string): string {
    switch (estado) {
      case 'DISPONIBLE': return 'circle';
      case 'EN_LLAMADA': return 'phone-call';
      case 'DESCONECTADO': return 'circle';
      case 'PAUSADO': return 'pause';
      case 'EN_REUNION': return 'users';
      case 'REFRIGERIO': return 'coffee';
      case 'SSHH': return 'user';
      case 'TIPIFICANDO': return 'edit';
      default: return 'circle';
    }
  }

  /**
   * Obtiene texto legible del estado
   */
  getEstadoTexto(estado: string): string {
    switch (estado) {
      case 'DISPONIBLE': return 'Libre';
      case 'EN_LLAMADA': return 'En Llamada';
      case 'DESCONECTADO': return 'Desconectado';
      case 'PAUSADO': return 'Pausado';
      case 'EN_REUNION': return 'En Reunión';
      case 'REFRIGERIO': return 'Refrigerio';
      case 'SSHH': return 'SSHH';
      case 'TIPIFICANDO': return 'Tipificando';
      default: return estado;
    }
  }

  /**
   * Formatea segundos a formato MM:SS o HH:MM:SS
   */
  formatTiempo(segundos: number): string {
    if (!segundos || segundos < 0) return '-';

    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const segs = segundos % 60;

    if (horas > 0) {
      return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
    } else {
      return `${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
    }
  }

  /**
   * Navega de vuelta a campañas
   */
  goBack(): void {
    this.router.navigate(['/admin/campaigns']);
  }

  /**
   * Navega a la pantalla de registro de extensiones
   */
  navigateToExtensions(): void {
    this.router.navigate(['/admin/extensions']);
  }
}
