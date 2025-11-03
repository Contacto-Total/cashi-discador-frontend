import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CampaignAdminService, Campaign } from '../../../core/services/campaign-admin.service';
import { AutoDialerService, AutoDialerEstadisticas, AgenteMonitoreo, LlamadaTiempoReal } from '../../../core/services/autodialer.service';

@Component({
  selector: 'app-campaign-monitoring',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './campaign-monitoring.component.html',
  styleUrls: ['./campaign-monitoring.component.css']
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

  constructor(
    private campaignService: CampaignAdminService,
    private autoDialerService: AutoDialerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCampaigns();
    this.startAutoDialerPolling();
    this.startAgentesPolling();
    // TODO: Implement real-time calls polling when backend is ready
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
      },
      error: (err) => {
        console.error('Error polling agentes:', err);
      }
    });
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
      case 'DISPONIBLE': return '🟢';
      case 'EN_LLAMADA': return '📞';
      case 'DESCONECTADO': return '🔴';
      case 'PAUSADO': return '⏸️';
      case 'EN_REUNION': return '👥';
      case 'REFRIGERIO': return '☕';
      case 'SSHH': return '🚻';
      case 'TIPIFICANDO': return '📝';
      default: return '⚫';
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
