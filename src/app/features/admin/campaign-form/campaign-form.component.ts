import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CampaignAdminService, Campaign } from '../../../core/services/campaign-admin.service';
import { TenantService } from '../../../maintenance/services/tenant.service';
import { PortfolioService } from '../../../maintenance/services/portfolio.service';
import { Tenant } from '../../../maintenance/models/tenant.model';
import { Portfolio, SubPortfolio } from '../../../maintenance/models/portfolio.model';

@Component({
  selector: 'app-campaign-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './campaign-form.component.html',
  styleUrls: ['./campaign-form.component.css']
})
export class CampaignFormComponent implements OnInit {
  campaign: Campaign = {
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

  isEditMode: boolean = false;
  loading: boolean = false;
  error: string | null = null;
  campaignId: number | null = null;

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
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadTenants();

    // Verificar si estamos en modo edición
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.campaignId = +params['id'];
        this.loadCampaign(this.campaignId);
      }
    });
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

  loadCampaign(id: number): void {
    this.loading = true;
    this.campaignService.getCampaignById(id).subscribe({
      next: (campaign) => {
        this.campaign = campaign;

        // Cargar los selectores en cascada con los valores existentes
        if (campaign.tenantId && campaign.portfolioId && campaign.subPortfolioId) {
          this.selectedTenantId = campaign.tenantId;
          this.selectedPortfolioId = campaign.portfolioId;
          this.selectedSubPortfolioId = campaign.subPortfolioId;

          // Cargar portfolios y subportfolios en paralelo
          forkJoin({
            portfolios: this.portfolioService.getPortfoliosByTenant(campaign.tenantId),
            subPortfolios: this.portfolioService.getSubPortfoliosByPortfolio(campaign.portfolioId)
          }).subscribe({
            next: (result) => {
              this.portfolios = result.portfolios.filter(p => p.isActive);
              this.subPortfolios = result.subPortfolios.filter(sp => sp.isActive);
              this.loading = false;
            },
            error: (err) => {
              console.error('Error loading portfolios/subportfolios:', err);
              this.loading = false;
            }
          });
        } else {
          this.loading = false;
        }
      },
      error: (err) => {
        console.error('Error loading campaign:', err);
        this.error = 'Error al cargar la campaña';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (!this.campaign.name) {
      this.error = 'El nombre de la campaña es requerido';
      return;
    }

    if (!this.selectedSubPortfolioId || this.selectedSubPortfolioId === 0) {
      this.error = 'Debe seleccionar una subcartera';
      return;
    }

    // Asignar los IDs seleccionados
    this.campaign.tenantId = this.selectedTenantId;
    this.campaign.portfolioId = this.selectedPortfolioId;
    this.campaign.subPortfolioId = this.selectedSubPortfolioId;

    this.loading = true;
    this.error = null;

    if (this.isEditMode && this.campaignId) {
      // Actualizar campaña existente
      this.campaignService.updateCampaign(this.campaignId, this.campaign).subscribe({
        next: () => {
          this.router.navigate(['/admin/campaigns']);
        },
        error: (err) => {
          console.error('Error updating campaign:', err);
          this.error = 'Error al actualizar la campaña';
          this.loading = false;
        }
      });
    } else {
      // Crear nueva campaña
      this.campaignService.createCampaign(this.campaign).subscribe({
        next: () => {
          this.router.navigate(['/admin/campaigns']);
        },
        error: (err) => {
          console.error('Error creating campaign:', err);
          this.error = 'Error al crear la campaña';
          this.loading = false;
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/admin/campaigns']);
  }
}
