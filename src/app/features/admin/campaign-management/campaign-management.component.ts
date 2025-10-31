import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CampaignAdminService, Campaign, ImportStats } from '../../../core/services/campaign-admin.service';
import { AutoDialerService, AutoDialerEstadisticas, AgenteMonitoreo } from '../../../core/services/autodialer.service';

@Component({
  selector: 'app-campaign-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './campaign-management.component.html',
  styleUrls: ['./campaign-management.component.css']
})
export class CampaignManagementComponent implements OnInit, OnDestroy {
  campaigns: Campaign[] = [];
  loading: boolean = false;
  error: string | null = null;
  successMessage: string | null = null;

  showCreateModal: boolean = false;
  showImportModal: boolean = false;
  selectedCampaign: Campaign | null = null;
  importStats: ImportStats | null = null;

  newCampaign: Campaign = {
    name: '',
    description: '',
    status: 'DRAFT',
    dialMode: 'PROGRESSIVE',
    maxAttempts: 3,
    retryInterval: 60
  };

  importLimit: number = 100;

  // Auto-Dialer state
  isAutoDialerActive: boolean = false;
  autoDialerLoading: boolean = false;
  autoDialerStats: AutoDialerEstadisticas | null = null;
  private autoDialerSubscription?: Subscription;

  // Agentes state
  agentesMonitoreo: AgenteMonitoreo[] = [];
  private agentesSubscription?: Subscription;

  constructor(
    private campaignService: CampaignAdminService,
    private autoDialerService: AutoDialerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCampaigns();
    this.loadImportStats();
    this.loadAutoDialerState();
    this.startAutoDialerPolling();
    this.startAgentesPolling();
  }

  ngOnDestroy(): void {
    if (this.autoDialerSubscription) {
      this.autoDialerSubscription.unsubscribe();
    }
    if (this.agentesSubscription) {
      this.agentesSubscription.unsubscribe();
    }
  }

  /**
   * Carga todas las campañas
   */
  loadCampaigns(): void {
    this.loading = true;
    this.error = null;

    this.campaignService.getAllCampaigns().subscribe({
      next: (campaigns) => {
        this.campaigns = campaigns;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading campaigns:', err);
        this.error = 'Error al cargar las campañas';
        this.loading = false;
      }
    });
  }

  /**
   * Carga estadísticas de importación
   */
  loadImportStats(): void {
    this.campaignService.getImportStats().subscribe({
      next: (stats) => {
        this.importStats = stats;
      },
      error: (err) => {
        console.error('Error loading import stats:', err);
      }
    });
  }

  /**
   * Abre el modal para crear campaña
   */
  openCreateModal(): void {
    this.newCampaign = {
      name: '',
      description: '',
      status: 'DRAFT',
      dialMode: 'PROGRESSIVE',
      maxAttempts: 3,
      retryInterval: 60
    };
    this.showCreateModal = true;
  }

  /**
   * Cierra el modal de crear
   */
  closeCreateModal(): void {
    this.showCreateModal = false;
  }

  /**
   * Crea una nueva campaña
   */
  createCampaign(): void {
    if (!this.newCampaign.name) {
      this.error = 'El nombre de la campaña es requerido';
      return;
    }

    this.loading = true;
    this.error = null;

    this.campaignService.createCampaign(this.newCampaign).subscribe({
      next: (response) => {
        this.successMessage = 'Campaña creada exitosamente';
        this.showCreateModal = false;
        this.loadCampaigns();
        this.loading = false;

        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      },
      error: (err) => {
        console.error('Error creating campaign:', err);
        this.error = 'Error al crear la campaña';
        this.loading = false;
      }
    });
  }

  /**
   * Activa una campaña
   */
  activarCampaign(campaign: Campaign): void {
    if (!campaign.id) return;

    this.loading = true;
    this.error = null;

    this.campaignService.activarCampaign(campaign.id).subscribe({
      next: () => {
        this.successMessage = `Campaña "${campaign.name}" activada`;
        this.loadCampaigns();
        this.loading = false;

        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      },
      error: (err) => {
        console.error('Error activating campaign:', err);
        this.error = err.error?.error || 'Error al activar la campaña';
        this.loading = false;
      }
    });
  }

  /**
   * Pausa una campaña
   */
  pausarCampaign(campaign: Campaign): void {
    if (!campaign.id) return;

    this.loading = true;
    this.error = null;

    this.campaignService.pausarCampaign(campaign.id).subscribe({
      next: () => {
        this.successMessage = `Campaña "${campaign.name}" pausada`;
        this.loadCampaigns();
        this.loading = false;

        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      },
      error: (err) => {
        console.error('Error pausing campaign:', err);
        this.error = 'Error al pausar la campaña';
        this.loading = false;
      }
    });
  }

  /**
   * Abre modal de importación
   */
  openImportModal(campaign: Campaign): void {
    this.selectedCampaign = campaign;
    this.importLimit = 100;
    this.showImportModal = true;
  }

  /**
   * Cierra modal de importación
   */
  closeImportModal(): void {
    this.showImportModal = false;
    this.selectedCampaign = null;
  }

  /**
   * Importa contactos a la campaña
   */
  importarContactos(): void {
    if (!this.selectedCampaign?.id) return;

    this.loading = true;
    this.error = null;

    this.campaignService.importarContactos(this.selectedCampaign.id, this.importLimit).subscribe({
      next: (response) => {
        this.successMessage = `${response.contactosImportados} contactos importados`;
        this.showImportModal = false;
        this.loadCampaigns();
        this.loading = false;

        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      },
      error: (err) => {
        console.error('Error importing contacts:', err);
        this.error = 'Error al importar contactos';
        this.loading = false;
      }
    });
  }

  /**
   * Elimina una campaña
   */
  deleteCampaign(campaign: Campaign): void {
    if (!campaign.id) return;

    if (!confirm(`¿Estás seguro de eliminar la campaña "${campaign.name}"?`)) {
      return;
    }

    this.loading = true;
    this.error = null;

    this.campaignService.deleteCampaign(campaign.id).subscribe({
      next: () => {
        this.successMessage = `Campaña "${campaign.name}" eliminada`;
        this.loadCampaigns();
        this.loading = false;

        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      },
      error: (err) => {
        console.error('Error deleting campaign:', err);
        this.error = err.error?.error || 'Error al eliminar la campaña';
        this.loading = false;
      }
    });
  }

  /**
   * Obtiene el color del estado
   */
  getStatusColor(status: string): string {
    return this.campaignService.getStatusColor(status);
  }

  /**
   * Obtiene el texto del estado
   */
  getStatusText(status: string): string {
    return this.campaignService.getStatusText(status);
  }

  /**
   * Verifica si puede activar la campaña
   */
  canActivate(campaign: Campaign): boolean {
    return campaign.status === 'DRAFT' || campaign.status === 'PAUSED';
  }

  /**
   * Verifica si puede pausar la campaña
   */
  canPause(campaign: Campaign): boolean {
    return campaign.status === 'ACTIVE';
  }

  // ========================================
  // AUTO-DIALER METHODS
  // ========================================

  /**
   * Carga el estado actual del auto-dialer
   */
  loadAutoDialerState(): void {
    this.autoDialerService.getEstado().subscribe({
      next: (response) => {
        this.isAutoDialerActive = response.activo;
      },
      error: (err) => {
        console.error('Error loading auto-dialer state:', err);
      }
    });
  }

  /**
   * Inicia polling del estado del auto-dialer cada 5 segundos
   */
  startAutoDialerPolling(): void {
    this.autoDialerSubscription = this.autoDialerService.startStatsPolling().subscribe({
      next: (stats) => {
        this.isAutoDialerActive = stats.activo;
        this.autoDialerStats = stats;
      },
      error: (err) => {
        console.error('Error polling auto-dialer stats:', err);
      }
    });
  }

  /**
   * Toggle auto-dialer (activar/desactivar)
   */
  toggleAutoDialer(): void {
    this.autoDialerLoading = true;

    this.autoDialerService.toggle('admin').subscribe({
      next: (response) => {
        this.autoDialerLoading = false;
        this.isAutoDialerActive = response.activo;
        console.log('Auto-Dialer toggled:', response.mensaje);
      },
      error: (err) => {
        console.error('Error toggling auto-dialer:', err);
        this.autoDialerLoading = false;
      }
    });
  }

  /**
   * Obtiene el texto del botón del auto-dialer
   */
  getAutoDialerButtonText(): string {
    if (this.autoDialerLoading) return 'Procesando...';
    return this.isAutoDialerActive ? 'PAUSAR DISCADO' : 'INICIAR DISCADO';
  }

  /**
   * Obtiene el ícono del botón del auto-dialer
   */
  getAutoDialerButtonIcon(): string {
    return this.isAutoDialerActive ? '⏸️' : '▶️';
  }

  /**
   * Obtiene el color del botón del auto-dialer
   */
  getAutoDialerButtonClass(): string {
    return this.isAutoDialerActive ? 'btn-pause' : 'btn-activate';
  }

  // ========================================
  // AGENTES MONITOREO METHODS
  // ========================================

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
   * Navega al detalle de una campaña
   */
  viewCampaignDetail(campaign: Campaign): void {
    if (campaign.id) {
      this.router.navigate(['/admin/campaigns', campaign.id]);
    }
  }

  /**
   * Navega a la pantalla de registro de extensiones
   */
  navigateToExtensions(): void {
    this.router.navigate(['/admin/extensions']);
  }
}
