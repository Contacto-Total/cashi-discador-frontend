import { Component, EventEmitter, Input, OnInit, Output, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TenantService } from '../../maintenance/services/tenant.service';
import { PortfolioService } from '../../maintenance/services/portfolio.service';
import { Tenant } from '../../maintenance/models/tenant.model';
import { Portfolio, SubPortfolio } from '../../maintenance/models/portfolio.model';
import { FiltrosReportePagosBancarios } from '../models/reporte-pagos-bancarios.model';
import { ComprasCarteraService, leerOpcionCompra, opcionesSubcartera } from '../../core/services/compras-cartera.service';

@Component({
  selector: 'app-reporte-pagos-bancarios-filtros',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div class="grid grid-cols-1 gap-4 md:grid-cols-5 md:items-end">
        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Período <span class="text-red-500">*</span></label>
          <input type="month" [(ngModel)]="periodo" name="periodo" required class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white" />
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Proveedor <span class="text-red-500">*</span></label>
          <select [(ngModel)]="tenantId" (ngModelChange)="onTenantChange($event)" name="tenant" required class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white">
            <option [ngValue]="0">Seleccionar</option>
            @for (tenant of tenants(); track tenant.id) {
              <option [ngValue]="tenant.id">{{ tenant.tenantCode }} - {{ tenant.tenantName }}</option>
            }
          </select>
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Cartera <span class="text-red-500">*</span></label>
          <select [(ngModel)]="carteraId" (ngModelChange)="onPortfolioChange($event)" [disabled]="tenantId === 0" name="cartera" required class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:disabled:bg-slate-800">
            <option [ngValue]="0">Seleccionar</option>
            @for (portfolio of portfolios(); track portfolio.id) {
              <option [ngValue]="portfolio.id">{{ portfolio.portfolioCode }} - {{ portfolio.portfolioName }}</option>
            }
          </select>
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Subcartera <span class="text-red-500">*</span></label>
          <select [(ngModel)]="seleccionSubcartera" (ngModelChange)="onSubcarteraChange($event)" name="subcartera" required [disabled]="carteraId === 0" class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:disabled:bg-slate-800">
            <option value="">Seleccionar</option>
            @for (op of opcionesSubcartera(); track op.valor) {
              <option [value]="op.valor">{{ op.etiqueta }}</option>
            }
          </select>
        </div>
        <button type="button" (click)="consultar()" [disabled]="!puedeConsultar() || loading" class="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400">
          @if (loading) {
            <svg class="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
            Consultando...
          } @else { Consultar }
        </button>
      </div>
    </section>
  `
})
export class ReportePagosBancariosFiltrosWidget implements OnInit {
  private readonly tenantService = inject(TenantService);
  private readonly portfolioService = inject(PortfolioService);
  private readonly comprasCartera = inject(ComprasCarteraService);

  @Input() loading = false;
  /** REQ-083: muestra una opción por compra (solo el reporte de pagos bancarios; el consolidado no). */
  @Input() conCompras = false;
  @Output() consulta = new EventEmitter<FiltrosReportePagosBancarios>();

  tenants = signal<Tenant[]>([]);
  portfolios = signal<Portfolio[]>([]);
  subPortfolios = signal<SubPortfolio[]>([]);
  /** REQ-083: cada subcartera y sus compras («TPR - TRAMO PROPIO · PRIMERA»). Valor '21' o '21:PRIMERA'. */
  opcionesSubcartera = computed(() => opcionesSubcartera(
    this.subPortfolios().map(s => ({ id: s.id, nombreSubcartera: `${s.subPortfolioCode} - ${s.subPortfolioName}` })),
    this.conComprasSenal() ? this.comprasCartera.compras() : {}));
  private readonly conComprasSenal = signal(false);
  seleccionSubcartera = '';
  compra: string | null = null;
  periodo = this.periodoActual();
  tenantId = 0;
  carteraId = 0;
  subcarteraId = 0;

  ngOnInit(): void {
    this.conComprasSenal.set(this.conCompras);
    if (this.conCompras) this.comprasCartera.cargar();
    this.tenantService.getAllTenants().subscribe({
      next: (tenants) => this.tenants.set(tenants)
    });
  }

  onTenantChange(tenantId: number): void {
    this.tenantId = Number(tenantId) || 0;
    this.carteraId = 0;
    this.limpiarSubcartera();
    this.portfolios.set([]);
    this.subPortfolios.set([]);

    if (this.tenantId > 0) {
      this.portfolioService.getPortfoliosByTenant(this.tenantId).subscribe({
        next: (portfolios) => this.portfolios.set(portfolios)
      });
    }
  }

  onPortfolioChange(carteraId: number): void {
    this.carteraId = Number(carteraId) || 0;
    this.limpiarSubcartera();
    this.subPortfolios.set([]);

    if (this.carteraId > 0) {
      this.portfolioService.getSubPortfoliosByPortfolio(this.carteraId).subscribe({
        next: (subPortfolios) => this.subPortfolios.set(subPortfolios)
      });
    }
  }

  onSubcarteraChange(seleccion: string): void {
    const { idSubcartera, compra } = leerOpcionCompra(seleccion);
    this.subcarteraId = idSubcartera ?? 0;
    this.compra = compra;
  }

  private limpiarSubcartera(): void {
    this.seleccionSubcartera = '';
    this.subcarteraId = 0;
    this.compra = null;
  }

  consultar(): void {
    if (!this.puedeConsultar()) return;
    this.consulta.emit({
      periodo: this.periodo, tenantId: this.tenantId, carteraId: this.carteraId,
      subcarteraId: this.subcarteraId, compra: this.compra
    });
  }

  puedeConsultar(): boolean {
    return !!this.periodo && this.tenantId > 0 && this.carteraId > 0 && this.subcarteraId > 0;
  }

  private periodoActual(): string {
    const fecha = new Date();
    return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
  }
}
