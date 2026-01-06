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

    // Cargar metas
    this.metaService.getAll().subscribe({
      next: (metas) => {
        this.metas = metas;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading metas:', err);
        this.loading = false;
      }
    });

    // Cargar tenants
    this.tenantService.getAllTenants().subscribe({
      next: (tenants) => {
        this.tenants = tenants;
      }
    });

    // Cargar todos los portfolios
    this.portfolioService.getAllPortfolios().subscribe({
      next: (portfolios) => {
        this.portfolios = portfolios;
      }
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
    if (meta.idSubcartera) {
      return `${meta.tenantName} > ${meta.carteraName} > ${meta.subcarteraName}`;
    }
    if (meta.idCartera) {
      return `${meta.tenantName} > ${meta.carteraName}`;
    }
    if (meta.idTenant) {
      return meta.tenantName || 'Tenant';
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
