import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TenantService } from '../../../maintenance/services/tenant.service';
import { PortfolioService } from '../../../maintenance/services/portfolio.service';
import { Tenant } from '../../../maintenance/models/tenant.model';
import { Portfolio, SubPortfolio } from '../../../maintenance/models/portfolio.model';
import { BcpPagosService } from '../../services/bcp-pagos.service';
import { ResumenConciliacionCliente } from '../../models/bcp-archivo.model';
import { ClienteResumenConciliacionDrawerWidget } from '../../widgets/cliente-resumen-conciliacion-drawer.widget';

@Component({
  selector: 'app-correccion-pagos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ClienteResumenConciliacionDrawerWidget],
  template: `
    <div class="min-h-screen bg-slate-50 p-4 dark:bg-slate-900">
      <div class="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 class="text-xl font-bold text-slate-800 dark:text-white">Corrección de pagos</h1>
          <p class="text-sm text-slate-600 dark:text-slate-400">
            Busca un cliente por DNI y contexto para revisar y corregir pagos desde su resumen.
          </p>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <a
            routerLink="/cartas/no-adeudo"
            [queryParams]="noDebtLetterQueryParams()"
            class="inline-flex items-center justify-center gap-2 rounded-lg border border-blue-300 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-200 dark:hover:bg-blue-900/40"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            Nueva versión
          </a>
          <a
            routerLink="/pagos-bancarios"
            class="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            Volver
          </a>
        </div>
      </div>

      <section class="mb-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div class="mb-3 flex items-center gap-2">
          <div class="rounded-lg bg-emerald-100 p-1.5 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
          <div>
            <h2 class="text-sm font-semibold text-slate-800 dark:text-white">Buscar cliente</h2>
            <p class="text-xs text-slate-500 dark:text-slate-400">Completa el contexto y el DNI del cliente.</p>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-3 md:grid-cols-5">
          <div>
            <label class="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-300">DNI</label>
            <input
              type="text"
              [(ngModel)]="documento"
              name="documento"
              maxlength="15"
              class="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              placeholder="Ej: 12345678"
            />
          </div>

          <div>
            <label class="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-300">Proveedor</label>
            <select
              [(ngModel)]="selectedTenantId"
              (ngModelChange)="onTenantChange($event)"
              name="tenant"
              class="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            >
              <option [ngValue]="0">Seleccionar</option>
              @for (tenant of tenants(); track tenant.id) {
                <option [ngValue]="tenant.id">{{ tenant.tenantCode }} - {{ tenant.tenantName }}</option>
              }
            </select>
          </div>

          <div>
            <label class="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-300">Cartera</label>
            <select
              [(ngModel)]="selectedPortfolioId"
              (ngModelChange)="onPortfolioChange($event)"
              [disabled]="selectedTenantId === 0"
              name="portfolio"
              class="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:disabled:bg-slate-800"
            >
              <option [ngValue]="0">Seleccionar</option>
              @for (portfolio of portfolios(); track portfolio.id) {
                <option [ngValue]="portfolio.id">{{ portfolio.portfolioCode }} - {{ portfolio.portfolioName }}</option>
              }
            </select>
          </div>

          <div>
            <label class="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-300">Subcartera</label>
            <select
              [(ngModel)]="selectedSubPortfolioId"
              (ngModelChange)="onSubPortfolioChange($event)"
              [disabled]="selectedPortfolioId === 0"
              name="subPortfolio"
              class="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:disabled:bg-slate-800"
            >
              <option [ngValue]="0">Seleccionar</option>
              @for (subPortfolio of subPortfolios(); track subPortfolio.id) {
                <option [ngValue]="subPortfolio.id">{{ subPortfolio.subPortfolioCode }} - {{ subPortfolio.subPortfolioName }}</option>
              }
            </select>
          </div>

          <div class="flex items-end">
            <button
              type="button"
              (click)="buscarPagos()"
              [disabled]="!canBuscar() || isLoadingResumenCliente()"
              class="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              @if (isLoadingResumenCliente()) {
                <svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Buscando...
              } @else {
                Buscar
              }
            </button>
          </div>
        </div>

        @if (errorMessage()) {
          <div class="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
            {{ errorMessage() }}
          </div>
        }
      </section>

      <app-cliente-resumen-conciliacion-drawer
        [open]="resumenVisible()"
        mode="inline"
        [loading]="isLoadingResumenCliente()"
        [error]="resumenClienteError()"
        [documento]="resumenClienteDocumento()"
        [resumen]="resumenCliente()"
        [tenantId]="selectedTenantId"
        [carteraId]="selectedPortfolioId"
        [subcarteraId]="selectedSubPortfolioId"
        (close)="cerrarResumenCliente()"
        (refreshRequested)="abrirResumenCliente()"
      ></app-cliente-resumen-conciliacion-drawer>
    </div>
  `
})
export class CorreccionPagosPage implements OnInit {
  private readonly tenantService = inject(TenantService);
  private readonly portfolioService = inject(PortfolioService);
  private readonly bcpPagosService = inject(BcpPagosService);

  tenants = signal<Tenant[]>([]);
  portfolios = signal<Portfolio[]>([]);
  subPortfolios = signal<SubPortfolio[]>([]);
  errorMessage = signal<string | null>(null);
  resumenDrawerOpen = signal(false);
  isLoadingResumenCliente = signal(false);
  resumenClienteError = signal<string | null>(null);
  resumenClienteDocumento = signal<string | null>(null);
  resumenCliente = signal<ResumenConciliacionCliente | null>(null);

  documento = '';
  selectedTenantId = 0;
  selectedPortfolioId = 0;
  selectedSubPortfolioId = 0;

  ngOnInit(): void {
    this.cargarTenants();
  }

  cargarTenants(): void {
    this.tenantService.getAllTenants().subscribe({
      next: (tenants) => this.tenants.set(tenants),
      error: (error) => {
        console.error('Error cargando proveedores:', error);
        this.errorMessage.set('No se pudieron cargar los proveedores.');
      }
    });
  }

  onTenantChange(tenantId: number): void {
    this.selectedTenantId = Number(tenantId) || 0;
    this.selectedPortfolioId = 0;
    this.selectedSubPortfolioId = 0;
    this.portfolios.set([]);
    this.subPortfolios.set([]);
    this.clearResults();

    if (this.selectedTenantId > 0) {
      this.portfolioService.getPortfoliosByTenant(this.selectedTenantId).subscribe({
        next: (portfolios) => this.portfolios.set(portfolios),
        error: (error) => {
          console.error('Error cargando carteras:', error);
          this.errorMessage.set('No se pudieron cargar las carteras.');
        }
      });
    }
  }

  onPortfolioChange(portfolioId: number): void {
    this.selectedPortfolioId = Number(portfolioId) || 0;
    this.selectedSubPortfolioId = 0;
    this.subPortfolios.set([]);
    this.clearResults();

    if (this.selectedPortfolioId > 0) {
      this.portfolioService.getSubPortfoliosByPortfolio(this.selectedPortfolioId).subscribe({
        next: (subPortfolios) => this.subPortfolios.set(subPortfolios),
        error: (error) => {
          console.error('Error cargando subcarteras:', error);
          this.errorMessage.set('No se pudieron cargar las subcarteras.');
        }
      });
    }
  }

  onSubPortfolioChange(subPortfolioId: number): void {
    this.selectedSubPortfolioId = Number(subPortfolioId) || 0;
    this.clearResults();
  }

  canBuscar(): boolean {
    return this.documento.trim().length > 0
      && this.selectedTenantId > 0
      && this.selectedPortfolioId > 0
      && this.selectedSubPortfolioId > 0;
  }

  canVerResumen(): boolean {
    return this.canBuscar();
  }

  noDebtLetterQueryParams(): Record<string, string | number> {
    const params: Record<string, string | number> = {};
    const documento = this.documento.trim();

    if (documento) params['documento'] = documento;
    if (this.selectedTenantId > 0) params['tenantId'] = this.selectedTenantId;
    if (this.selectedPortfolioId > 0) params['carteraId'] = this.selectedPortfolioId;
    if (this.selectedSubPortfolioId > 0) params['subcarteraId'] = this.selectedSubPortfolioId;

    return params;
  }

  resumenVisible(): boolean {
    return this.resumenDrawerOpen() || this.isLoadingResumenCliente() || !!this.resumenClienteError() || !!this.resumenCliente();
  }

  buscarPagos(): void {
    this.abrirResumenCliente();
  }

  abrirResumenCliente(): void {
    if (!this.canVerResumen()) return;

    const documento = this.documento.trim();
    if (!documento) return;

    this.resumenDrawerOpen.set(true);
    this.isLoadingResumenCliente.set(true);
    this.resumenClienteError.set(null);
    this.resumenClienteDocumento.set(documento);
    this.resumenCliente.set(null);

    this.bcpPagosService.obtenerResumenConciliacionCliente(documento, {
      tenantId: this.selectedTenantId,
      carteraId: this.selectedPortfolioId,
      subcarteraId: this.selectedSubPortfolioId
    }).subscribe({
      next: (resumen) => {
        this.resumenCliente.set(resumen);
        this.isLoadingResumenCliente.set(false);
      },
      error: (error) => {
        console.error('Error cargando resumen de cliente:', error);
        this.resumenClienteError.set(error.error?.mensaje || error.error?.message || error.message || 'No se pudo cargar el resumen del cliente.');
        this.isLoadingResumenCliente.set(false);
      }
    });
  }

  cerrarResumenCliente(): void {
    this.resumenDrawerOpen.set(false);
  }

  private clearResults(): void {
    this.errorMessage.set(null);
    this.resumenCliente.set(null);
    this.resumenClienteError.set(null);
  }
}
