import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { CampaignAdminService, Campaign, ImportStats } from '../../../core/services/campaign-admin.service';
import { AuthService } from '../../../core/services/auth.service';
import { UserRole } from '../../../core/models/user.model';
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
    private authService: AuthService,
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
        this.campaigns = this.filterByUserSubPortfolio(campaigns);
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
   * Toggle unificado: activa+disca o pausa según estado actual
   */
  toggleCampaign(campaign: Campaign): void {
    if (!campaign.id) return;

    this.error = null;

    this.campaignService.toggleCampaign(campaign.id).subscribe({
      next: (updated) => {
        campaign.status = updated.status;
        campaign.estaDiscando = updated.estaDiscando;
        const action = updated.estaDiscando ? 'iniciada' : 'pausada';
        this.successMessage = `Campaña "${campaign.name}" ${action}`;
        this.refreshCampaignsSilently();

        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      },
      error: (err) => {
        console.error('Error toggling campaign:', err);
        this.error = err.error?.message || err.error?.error || 'Error al cambiar estado de la campaña';
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
   * Verifica si se puede hacer toggle (siempre visible, campañas DELETED no llegan al frontend)
   */
  canToggle(campaign: Campaign): boolean {
    return true;
  }

  /**
   * Retorna la clase CSS del botón toggle según estado
   */
  getToggleButtonClass(campaign: Campaign): string {
    if (campaign.estaDiscando) return 'btn-action-small btn-pause';
    return 'btn-action-small btn-activate';
  }

  /**
   * Retorna el tooltip del botón toggle según estado
   */
  getToggleButtonTitle(campaign: Campaign): string {
    if (campaign.estaDiscando) return 'Pausar campaña';
    if (campaign.status === 'DRAFT') return 'Iniciar campaña';
    if (campaign.status === 'PAUSED') return 'Reanudar campaña';
    if (campaign.status === 'COMPLETED') return 'Reactivar campaña';
    return 'Iniciar discado';
  }

  /**
   * Retorna el ícono del botón toggle según estado
   */
  getToggleButtonIcon(campaign: Campaign): string {
    if (campaign.estaDiscando) return 'pause';
    return 'play';
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
        this.campaigns = this.filterByUserSubPortfolio(campaigns);
      },
      error: (err) => {
        console.error('Error refreshing campaigns:', err);
      }
    });
  }

  private filterByUserSubPortfolio(campaigns: Campaign[]): Campaign[] {
    const user = this.authService.getCurrentUser();
    if (user?.role === UserRole.SUPERVISOR && user.subPortfolioId) {
      return campaigns.filter(c => c.subPortfolioId === user.subPortfolioId);
    }
    return campaigns;
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
