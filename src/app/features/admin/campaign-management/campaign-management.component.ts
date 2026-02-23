import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { CampaignAdminService, Campaign, ImportStats } from '../../../core/services/campaign-admin.service';
import { TenantService } from '../../../maintenance/services/tenant.service';
import { PortfolioService } from '../../../maintenance/services/portfolio.service';
import { Tenant } from '../../../maintenance/models/tenant.model';
import { Portfolio, SubPortfolio } from '../../../maintenance/models/portfolio.model';

@Component({
  selector: 'app-campaign-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, LucideAngularModule],
  templateUrl: './campaign-management.component.html',
  styleUrls: ['./campaign-management.component.css'],
  encapsulation: ViewEncapsulation.None
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
    intensidad: 50,
    tenantId: undefined,
    portfolioId: undefined,
    subPortfolioId: undefined
  };

  // Pagination
  pageSize: number = 10;
  currentPage: number = 1;

  // Datos para selectores en cascada
  tenants: Tenant[] = [];
  portfolios: Portfolio[] = [];
  subPortfolios: SubPortfolio[] = [];
  selectedTenantId: number = 0;
  selectedPortfolioId: number = 0;
  selectedSubPortfolioId: number = 0;

  constructor(
    private campaignService: CampaignAdminService,
    private tenantService: TenantService,
    private portfolioService: PortfolioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCampaigns();
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
    // Cleanup if needed
  }

  /**
   * Carga todas las campañas
   */
  loadCampaigns(goToLastPage: boolean = false): void {
    this.loading = true;
    this.error = null;

    this.campaignService.getAllCampaigns().subscribe({
      next: (campaigns) => {
        this.campaigns = campaigns;
        if (goToLastPage) {
          this.currentPage = this.totalPages || 1;
        } else if (this.currentPage > this.totalPages) {
          this.currentPage = this.totalPages || 1;
        }
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
   * Carga estadísticas de importación para una campaña específica
   */
  loadImportStats(campaignId: number): void {
    this.campaignService.getImportStats(campaignId).subscribe({
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
      retryInterval: 60,
      intensidad: 50
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
        this.loadCampaigns(true);
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

    this.error = null;

    this.campaignService.activarCampaign(campaign.id).subscribe({
      next: () => {
        campaign.status = 'ACTIVE';
        this.successMessage = `Campaña "${campaign.name}" activada`;
        this.refreshCampaignsSilently();

        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      },
      error: (err) => {
        console.error('Error activating campaign:', err);
        this.error = err.error?.error || 'Error al activar la campaña';
      }
    });
  }

  /**
   * Pausa una campaña
   */
  pausarCampaign(campaign: Campaign): void {
    if (!campaign.id) return;

    this.error = null;

    this.campaignService.pausarCampaign(campaign.id).subscribe({
      next: () => {
        campaign.status = 'PAUSED';
        campaign.estaDiscando = false;
        this.successMessage = `Campaña "${campaign.name}" pausada`;
        this.refreshCampaignsSilently();

        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      },
      error: (err) => {
        console.error('Error pausing campaign:', err);
        this.error = 'Error al pausar la campaña';
      }
    });
  }

  /**
   * Abre modal de importación
   */
  openImportModal(campaign: Campaign): void {
    this.selectedCampaign = campaign;
    this.showImportModal = true;

    // Cargar stats de esta campaña específica
    if (campaign.id) {
      this.loadImportStats(campaign.id);
    }
  }

  /**
   * Cierra modal de importación
   */
  closeImportModal(): void {
    this.showImportModal = false;
    this.selectedCampaign = null;
  }

  /**
   * Importa contactos a la campaña (ya sin límite, importa todos)
   */
  importarContactos(): void {
    if (!this.selectedCampaign?.id) return;

    this.loading = true;
    this.error = null;

    this.campaignService.importarContactos(this.selectedCampaign.id).subscribe({
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

    this.error = null;

    this.campaignService.deleteCampaign(campaign.id).subscribe({
      next: () => {
        this.campaigns = this.campaigns.filter(c => c.id !== campaign.id);
        this.successMessage = `Campaña "${campaign.name}" eliminada`;

        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      },
      error: (err) => {
        console.error('Error deleting campaign:', err);
        this.error = err.error?.error || 'Error al eliminar la campaña';
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
  // PER-CAMPAIGN DIALING METHODS
  // ========================================

  /**
   * Alterna el estado de discado de una campaña
   */
  toggleDialing(campaign: Campaign): void {
    if (campaign.estaDiscando) {
      this.stopDialing(campaign);
    } else {
      this.startDialing(campaign);
    }
  }

  /**
   * Inicia el discado automático para una campaña específica
   */
  startDialing(campaign: Campaign): void {
    if (!campaign.id) return;

    this.error = null;

    this.campaignService.startDialing(campaign.id).subscribe({
      next: () => {
        campaign.estaDiscando = true;
        this.successMessage = `Discado iniciado para "${campaign.name}"`;
        this.refreshCampaignsSilently();

        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      },
      error: (err) => {
        console.error('Error starting dialing:', err);
        this.error = err.error?.message || 'Error al iniciar el discado';
      }
    });
  }

  /**
   * Detiene el discado automático para una campaña específica
   */
  stopDialing(campaign: Campaign): void {
    if (!campaign.id) return;

    this.error = null;

    this.campaignService.stopDialing(campaign.id).subscribe({
      next: () => {
        campaign.estaDiscando = false;
        this.successMessage = `Discado detenido para "${campaign.name}"`;
        this.refreshCampaignsSilently();

        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      },
      error: (err) => {
        console.error('Error stopping dialing:', err);
        this.error = 'Error al detener el discado';
      }
    });
  }

  /**
   * Verifica si puede iniciar el discado
   */
  canStartDialing(campaign: Campaign): boolean {
    return campaign.status === 'ACTIVE' && !campaign.estaDiscando;
  }

  /**
   * Verifica si puede detener el discado
   */
  canStopDialing(campaign: Campaign): boolean {
    return campaign.estaDiscando === true;
  }

  /**
   * Navega al detalle de una campaña
   */
  /**
   * Recarga campañas en background sin mostrar spinner ni re-renderizar la lista
   */
  private refreshCampaignsSilently(): void {
    this.campaignService.getAllCampaigns().subscribe({
      next: (campaigns) => {
        this.campaigns = campaigns;
      },
      error: (err) => {
        console.error('Error refreshing campaigns:', err);
      }
    });
  }

  viewCampaignDetail(campaign: Campaign): void {
    if (campaign.id) {
      this.router.navigate(['/admin/campaigns', campaign.id]);
    }
  }

  /**
   * Navega a la pantalla de monitoreo por campaña
   */
  trackByCampaignId(index: number, campaign: Campaign): number {
    return campaign.id || index;
  }

  navigateToMonitoring(): void {
    this.router.navigate(['/admin/campaign-monitoring']);
  }

  // Pagination
  get totalPages(): number {
    return Math.ceil(this.campaigns.length / this.pageSize);
  }

  get paginatedCampaigns(): Campaign[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.campaigns.slice(start, start + this.pageSize);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
}
