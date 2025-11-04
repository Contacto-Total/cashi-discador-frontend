import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CampaignAdminService, Campaign, ImportStats } from '../../../core/services/campaign-admin.service';
import { AutoDialerService } from '../../../core/services/autodialer.service';
import { TenantService } from '../../../maintenance/services/tenant.service';
import { PortfolioService } from '../../../maintenance/services/portfolio.service';
import { Tenant } from '../../../maintenance/models/tenant.model';
import { Portfolio, SubPortfolio } from '../../../maintenance/models/portfolio.model';

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
    retryInterval: 60,
    tenantId: undefined,
    portfolioId: undefined,
    subPortfolioId: undefined
  };

  // Datos para selectores en cascada
  tenants: Tenant[] = [];
  portfolios: Portfolio[] = [];
  subPortfolios: SubPortfolio[] = [];
  selectedTenantId: number = 0;
  selectedPortfolioId: number = 0;
  selectedSubPortfolioId: number = 0;

  importLimit: number = 100;

  // Auto-Dialer state
  isAutoDialerActive: boolean = false;
  autoDialerLoading: boolean = false;
  private autoDialerSubscription?: Subscription;

  constructor(
    private campaignService: CampaignAdminService,
    private autoDialerService: AutoDialerService,
    private tenantService: TenantService,
    private portfolioService: PortfolioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCampaigns();
    this.loadImportStats();
    this.loadAutoDialerState();
    this.loadTenants();
  }

  loadTenants(): void {
    this.tenantService.getAllTenants().subscribe({
      next: (tenants) => {
        this.tenants = tenants.filter(t => t.isActive);
      },
      error: (err) => console.error('Error loading tenants:', err)
    });
  }

  onTenantChange(): void {
    this.selectedPortfolioId = 0;
    this.selectedSubPortfolioId = 0;
    this.portfolios = [];
    this.subPortfolios = [];

    if (this.selectedTenantId > 0) {
      this.portfolioService.getPortfoliosByTenant(this.selectedTenantId).subscribe({
        next: (portfolios) => {
          this.portfolios = portfolios.filter(p => p.isActive);
        },
        error: (err) => console.error('Error loading portfolios:', err)
      });
    }
  }

  onPortfolioChange(): void {
    this.selectedSubPortfolioId = 0;
    this.subPortfolios = [];

    if (this.selectedPortfolioId > 0) {
      this.portfolioService.getSubPortfoliosByPortfolio(this.selectedPortfolioId).subscribe({
        next: (subPortfolios) => {
          this.subPortfolios = subPortfolios.filter(sp => sp.isActive);
        },
        error: (err) => console.error('Error loading sub-portfolios:', err)
      });
    }
  }

  ngOnDestroy(): void {
    if (this.autoDialerSubscription) {
      this.autoDialerSubscription.unsubscribe();
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

    if (!this.selectedSubPortfolioId || this.selectedSubPortfolioId === 0) {
      this.error = 'Debe seleccionar una subcartera';
      return;
    }

    // Asignar los IDs seleccionados
    this.newCampaign.tenantId = this.selectedTenantId;
    this.newCampaign.portfolioId = this.selectedPortfolioId;
    this.newCampaign.subPortfolioId = this.selectedSubPortfolioId;

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

  /**
   * Navega al detalle de una campaña
   */
  viewCampaignDetail(campaign: Campaign): void {
    if (campaign.id) {
      this.router.navigate(['/admin/campaigns', campaign.id]);
    }
  }

  /**
   * Navega a la pantalla de monitoreo por campaña
   */
  navigateToMonitoring(): void {
    this.router.navigate(['/admin/campaign-monitoring']);
  }
}
