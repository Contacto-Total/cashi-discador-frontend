import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { MetaProductividadService } from '../../services/meta-productividad.service';
import { TenantService } from '../../services/tenant.service';
import { PortfolioService } from '../../services/portfolio.service';
import { MetaProductividad } from '../../models/meta-productividad.model';
import { Tenant } from '../../models/tenant.model';
import { Portfolio, SubPortfolio } from '../../models/portfolio.model';

@Component({
  selector: 'app-meta-productividad',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './meta-productividad.component.html',
  styleUrls: ['./meta-productividad.component.css']
})
export class MetaProductividadComponent implements OnInit {
  metas: MetaProductividad[] = [];
  tenants: Tenant[] = [];
  portfolios: Portfolio[] = [];
  subPortfolios: SubPortfolio[] = [];

  loading = false;
  saving = false;
  showModal = false;
  editMode = false;

  currentMeta: MetaProductividad = this.getEmptyMeta();

  // Para filtrar portfolios/subportfolios en el modal
  filteredPortfolios: Portfolio[] = [];
  filteredSubPortfolios: SubPortfolio[] = [];

  constructor(
    private metaService: MetaProductividadService,
    private tenantService: TenantService,
    private portfolioService: PortfolioService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;

    // Cargar tenants primero
    this.tenantService.getAllTenants().subscribe({
      next: (tenants) => {
        this.tenants = tenants;
        // Cargar portfolios de cada tenant
        this.loadPortfoliosForTenants();
      }
    });

    // Cargar metas
    this.metaService.getAll().subscribe({
      next: (metas) => {
        this.metas = metas;
        this.loading = false;
        // Cargar subportfolios para las metas que las tienen
        this.loadSubPortfoliosForMetas();
      },
      error: (err) => {
        console.error('Error loading metas:', err);
        this.loading = false;
      }
    });
  }

  private loadPortfoliosForTenants(): void {
    this.portfolios = [];
    this.tenants.forEach(tenant => {
      this.portfolioService.getPortfoliosByTenant(tenant.id).subscribe({
        next: (portfolios: Portfolio[]) => {
          portfolios.forEach(p => {
            if (!this.portfolios.find(existing => existing.id === p.id)) {
              this.portfolios.push(p);
            }
          });
        }
      });
    });
  }

  private loadSubPortfoliosForMetas(): void {
    // Obtener IDs únicos de carteras que tienen metas con subcartera
    const carteraIds = [...new Set(
      this.metas
        .filter(m => m.idCartera && m.idSubcartera)
        .map(m => m.idCartera!)
    )];

    carteraIds.forEach(carteraId => {
      this.portfolioService.getActiveSubPortfoliosByPortfolio(carteraId).subscribe({
        next: (subs) => {
          // Agregar a la lista sin duplicados
          subs.forEach(sub => {
            if (!this.subPortfolios.find(s => s.id === sub.id)) {
              this.subPortfolios.push(sub);
            }
          });
        }
      });
    });
  }

  getEmptyMeta(): MetaProductividad {
    return {
      idTenant: null,
      idCartera: null,
      idSubcartera: null,
      metaGestionesDiarias: null,
      metaGestionesSemanales: null,
      metaGestionesMensuales: null,
      metaPromesasDiarias: null,
      metaPromesasSemanales: null,
      metaPromesasMensuales: null,
      metaMontoDiario: null,
      metaMontoSemanal: null,
      metaMontoMensual: null,
      activo: true
    };
  }

  openNewModal(): void {
    this.currentMeta = this.getEmptyMeta();
    this.editMode = false;
    this.filteredPortfolios = [];
    this.filteredSubPortfolios = [];
    this.showModal = true;
  }

  openEditModal(meta: MetaProductividad): void {
    this.currentMeta = { ...meta };
    this.editMode = true;

    // Cargar portfolios del tenant si existe
    if (meta.idTenant) {
      this.filteredPortfolios = this.portfolios.filter(p => p.tenantId === meta.idTenant);
    } else {
      this.filteredPortfolios = [];
    }

    // Cargar subportfolios del portfolio si existe
    if (meta.idCartera) {
      this.loadSubPortfolios(meta.idCartera);
    } else {
      this.filteredSubPortfolios = [];
    }

    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.currentMeta = this.getEmptyMeta();
  }

  onTenantChange(): void {
    this.currentMeta.idCartera = null;
    this.currentMeta.idSubcartera = null;
    this.filteredSubPortfolios = [];

    if (this.currentMeta.idTenant) {
      this.filteredPortfolios = this.portfolios.filter(p => p.tenantId === this.currentMeta.idTenant);
    } else {
      this.filteredPortfolios = [];
    }
  }

  onCarteraChange(): void {
    this.currentMeta.idSubcartera = null;
    this.filteredSubPortfolios = [];

    if (this.currentMeta.idCartera) {
      this.loadSubPortfolios(this.currentMeta.idCartera);
    }
  }

  private loadSubPortfolios(carteraId: number): void {
    this.portfolioService.getActiveSubPortfoliosByPortfolio(carteraId).subscribe({
      next: (subs) => {
        this.filteredSubPortfolios = subs;
      }
    });
  }

  saveMeta(): void {
    this.saving = true;

    const operation = this.editMode
      ? this.metaService.update(this.currentMeta.id!, this.currentMeta)
      : this.metaService.create(this.currentMeta);

    operation.subscribe({
      next: () => {
        this.saving = false;
        this.closeModal();
        this.loadData();
      },
      error: (err) => {
        console.error('Error saving meta:', err);
        this.saving = false;
        alert(err.error || 'Error al guardar la meta');
      }
    });
  }

  deleteMeta(meta: MetaProductividad): void {
    if (!confirm('¿Está seguro de eliminar esta configuración de metas?')) {
      return;
    }

    this.metaService.delete(meta.id!).subscribe({
      next: () => {
        this.loadData();
      },
      error: (err) => {
        console.error('Error deleting meta:', err);
        alert('Error al eliminar la meta');
      }
    });
  }

  getScopeLabel(meta: MetaProductividad): string {
    const tenantName = meta.idTenant
      ? this.tenants.find(t => t.id === meta.idTenant)?.tenantName || `Tenant ${meta.idTenant}`
      : null;
    const carteraName = meta.idCartera
      ? this.portfolios.find(p => p.id === meta.idCartera)?.portfolioName || `Cartera ${meta.idCartera}`
      : null;
    const subcarteraName = meta.idSubcartera
      ? this.subPortfolios.find(s => s.id === meta.idSubcartera)?.subPortfolioName || `Subcartera ${meta.idSubcartera}`
      : null;

    if (meta.idSubcartera && tenantName && carteraName && subcarteraName) {
      return `${tenantName} > ${carteraName} > ${subcarteraName}`;
    }
    if (meta.idCartera && tenantName && carteraName) {
      return `${tenantName} > ${carteraName}`;
    }
    if (meta.idTenant && tenantName) {
      return tenantName;
    }
    return 'Global (Todos)';
  }

  formatNumber(value: number | null | undefined): string {
    if (value === null || value === undefined) return '-';
    return value.toLocaleString('es-PE');
  }

  formatMoney(value: number | null | undefined): string {
    if (value === null || value === undefined) return '-';
    return 'S/ ' + value.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
}
