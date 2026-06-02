import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TenantService } from '../../maintenance/services/tenant.service';
import { PortfolioService } from '../../maintenance/services/portfolio.service';
import { Tenant } from '../../maintenance/models/tenant.model';
import { Portfolio, SubPortfolio } from '../../maintenance/models/portfolio.model';
import { PosiblesMatchConciliacionParams } from '../models/conciliacion-pagos.model';

@Component({
  selector: 'app-conciliacion-pagos-filtros',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
      <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50">
        <h2 class="text-lg font-semibold text-slate-800 dark:text-white">Filtros de conciliación</h2>
      </div>

      <div class="p-6 space-y-5">
        @if (mensaje(); as msg) {
          <div class="rounded-xl border px-4 py-3 text-sm" [class]="msg.tipo === 'error' ? 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300' : 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300'">
            {{ msg.texto }}
          </div>
        }

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300">Proveedor <span class="text-red-500">*</span></label>
            <select [(ngModel)]="selectedTenantId" (ngModelChange)="onTenantChange($event)" class="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
              <option [ngValue]="0">Seleccione un proveedor...</option>
              @for (tenant of tenants(); track tenant.id) {
                <option [ngValue]="tenant.id">{{ tenant.tenantCode }} - {{ tenant.tenantName }}</option>
              }
            </select>
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300">Cartera <span class="text-red-500">*</span></label>
            <select [(ngModel)]="selectedPortfolioId" (ngModelChange)="onPortfolioChange($event)" [disabled]="selectedTenantId === 0" class="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400">
              <option [ngValue]="0">Seleccione una cartera...</option>
              @for (portfolio of portfolios(); track portfolio.id) {
                <option [ngValue]="portfolio.id">{{ portfolio.portfolioCode }} - {{ portfolio.portfolioName }}</option>
              }
            </select>
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300">Subcartera <span class="text-red-500">*</span></label>
            <select [(ngModel)]="selectedSubPortfolioId" [disabled]="selectedPortfolioId === 0" class="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400">
              <option [ngValue]="0">Seleccione una subcartera...</option>
              @for (subPortfolio of subPortfolios(); track subPortfolio.id) {
                <option [ngValue]="subPortfolio.id">{{ subPortfolio.subPortfolioCode }} - {{ subPortfolio.subPortfolioName }}</option>
              }
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300">Fecha inicio <span class="text-red-500">*</span></label>
            <input type="date" [(ngModel)]="fechaInicio" [max]="fechaMaxima" class="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300">Fecha fin</label>
            <input type="date" [(ngModel)]="fechaFin" [min]="fechaInicio" [max]="fechaMaxima" class="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300">Tolerancia monto</label>
            <input type="number" step="0.01" min="0" [(ngModel)]="toleranciaMonto" class="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300">Tolerancia días</label>
            <input type="number" min="0" [(ngModel)]="toleranciaDias" class="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
          </div>
        </div>

        <div class="flex flex-wrap gap-2">
          @for (acceso of accesosRapidos; track acceso.label) {
            <button type="button" (click)="acceso.action()" class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors" [class]="isAccesoActivo(acceso.label) ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'">
              {{ acceso.label }}
            </button>
          }
        </div>

        <div class="flex justify-end">
          <button type="button" (click)="buscar()" [disabled]="!puedeBuscar()" class="px-5 py-3 rounded-xl bg-emerald-600 text-white text-sm font-semibold shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 disabled:bg-slate-300 disabled:shadow-none disabled:cursor-not-allowed dark:disabled:bg-slate-700">
            Buscar posibles matches
          </button>
        </div>
      </div>
    </div>
  `
})
export class ConciliacionPagosFiltrosWidget {
  @Output() filtrosSubmit = new EventEmitter<PosiblesMatchConciliacionParams>();

  fechaInicio = '';
  fechaFin = '';
  fechaMaxima = this.formatDate(new Date());
  toleranciaMonto = 0.5;
  toleranciaDias = 1;
  accesoSeleccionado = signal<string | null>('Hoy');
  mensaje = signal<{ tipo: 'success' | 'error'; texto: string } | null>(null);
  tenants = signal<Tenant[]>([]);
  portfolios = signal<Portfolio[]>([]);
  subPortfolios = signal<SubPortfolio[]>([]);
  selectedTenantId = 0;
  selectedPortfolioId = 0;
  selectedSubPortfolioId = 0;

  accesosRapidos = [
    { label: 'Hoy', action: () => this.setHoy() },
    { label: 'Ayer', action: () => this.setAyer() },
    { label: 'Últimos 7 días', action: () => this.setUltimos7Dias() },
    { label: 'Últimos 30 días', action: () => this.setUltimos30Dias() },
    { label: 'Mes actual', action: () => this.setMesActual() }
  ];

  constructor(
    private tenantService: TenantService,
    private portfolioService: PortfolioService
  ) {
    this.setHoy();
    this.cargarTenants();
  }

  onTenantChange(tenantId: number): void {
    this.selectedTenantId = Number(tenantId) || 0;
    this.selectedPortfolioId = 0;
    this.selectedSubPortfolioId = 0;
    this.portfolios.set([]);
    this.subPortfolios.set([]);

    if (this.selectedTenantId > 0) {
      this.portfolioService.getPortfoliosByTenant(this.selectedTenantId).subscribe({
        next: (portfolios) => this.portfolios.set(portfolios),
        error: () => this.showError('No se pudieron cargar las carteras del proveedor seleccionado.')
      });
    }
  }

  onPortfolioChange(portfolioId: number): void {
    this.selectedPortfolioId = Number(portfolioId) || 0;
    this.selectedSubPortfolioId = 0;
    this.subPortfolios.set([]);

    if (this.selectedPortfolioId > 0) {
      this.portfolioService.getSubPortfoliosByPortfolio(this.selectedPortfolioId).subscribe({
        next: (subPortfolios) => this.subPortfolios.set(subPortfolios),
        error: () => this.showError('No se pudieron cargar las subcarteras de la cartera seleccionada.')
      });
    }
  }

  puedeBuscar(): boolean {
    return !!this.fechaInicio
      && this.selectedTenantId > 0
      && this.selectedPortfolioId > 0
      && this.selectedSubPortfolioId > 0;
  }

  buscar(): void {
    if (!this.puedeBuscar()) return;

    this.filtrosSubmit.emit({
      fechaInicio: this.fechaInicio,
      fechaFin: this.fechaFin || undefined,
      tenantId: this.selectedTenantId,
      carteraId: this.selectedPortfolioId,
      subcarteraId: this.selectedSubPortfolioId,
      toleranciaMonto: Number(this.toleranciaMonto),
      toleranciaDias: Number(this.toleranciaDias)
    });
  }

  isAccesoActivo(label: string): boolean {
    return this.accesoSeleccionado() === label;
  }

  setHoy(): void {
    this.fechaInicio = this.formatDate(new Date());
    this.fechaFin = '';
    this.accesoSeleccionado.set('Hoy');
  }

  setAyer(): void {
    const ayer = new Date();
    ayer.setDate(ayer.getDate() - 1);
    this.fechaInicio = this.formatDate(ayer);
    this.fechaFin = '';
    this.accesoSeleccionado.set('Ayer');
  }

  setUltimos7Dias(): void {
    const hoy = new Date();
    const hace7Dias = new Date();
    hace7Dias.setDate(hoy.getDate() - 6);
    this.fechaInicio = this.formatDate(hace7Dias);
    this.fechaFin = this.formatDate(hoy);
    this.accesoSeleccionado.set('Últimos 7 días');
  }

  setUltimos30Dias(): void {
    const hoy = new Date();
    const hace30Dias = new Date();
    hace30Dias.setDate(hoy.getDate() - 29);
    this.fechaInicio = this.formatDate(hace30Dias);
    this.fechaFin = this.formatDate(hoy);
    this.accesoSeleccionado.set('Últimos 30 días');
  }

  setMesActual(): void {
    const hoy = new Date();
    const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    this.fechaInicio = this.formatDate(primerDiaMes);
    this.fechaFin = this.formatDate(hoy);
    this.accesoSeleccionado.set('Mes actual');
  }

  private cargarTenants(): void {
    this.tenantService.getAllTenants().subscribe({
      next: (tenants) => this.tenants.set(tenants),
      error: () => this.showError('No se pudieron cargar los proveedores. Recargue la página e intente nuevamente.')
    });
  }

  private showError(texto: string): void {
    this.mensaje.set({ tipo: 'error', texto });
    setTimeout(() => this.mensaje.set(null), 5000);
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
