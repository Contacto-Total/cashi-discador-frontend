import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TenantService } from '../../../maintenance/services/tenant.service';
import { PortfolioService } from '../../../maintenance/services/portfolio.service';
import { Tenant } from '../../../maintenance/models/tenant.model';
import { Portfolio, SubPortfolio } from '../../../maintenance/models/portfolio.model';
import { ContextoAjuste } from '../../models/ajuste-conciliacion.model';
import { AjusteConciliacionService } from '../../services/ajuste-conciliacion.service';
import { AuthService } from '../../../core/services/auth.service';
import { CorreccionClienteWidget } from '../../widgets/correccion-cliente.widget';

@Component({
  selector: 'app-correccion-pagos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, CorreccionClienteWidget],
  template: `
    <!-- relative: contiene los elementos sr-only de la página para que no estiren el scroll -->
    <div class="relative min-h-screen bg-slate-50 p-4 dark:bg-slate-900">
      <div class="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 class="text-xl font-bold text-slate-800 dark:text-white">Corrección de pagos</h1>
          <p class="text-sm text-slate-600 dark:text-slate-400">
            Todos los ajustes de un cliente en un solo lugar: sus pagos del banco, sus promesas y pagos del asesor, y el histórico de correcciones.
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
            <p class="text-xs text-slate-500 dark:text-slate-400">Completa el contexto y el DNI del cliente, o el número de pago bancario (Pb).</p>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-3 md:grid-cols-5">
          <div>
            <label for="correccion-documento" class="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-300">DNI o Pb</label>
            <input
              id="correccion-documento"
              type="text"
              [(ngModel)]="documento"
              name="documento"
              maxlength="20"
              (keydown.enter)="buscarPagos()"
              class="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              placeholder="Ej: 12345678 o Pb 4442"
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
              [disabled]="!canBuscar() || buscando()"
              class="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              @if (buscando()) {
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

      <app-correccion-cliente
        [documento]="documentoCliente()"
        [contexto]="contextoCliente()"
        [pbAbrir]="pbAbrir()"
        [recarga]="recarga()"
      ></app-correccion-cliente>
    </div>
  `
})
export class CorreccionPagosPage implements OnInit {
  private readonly tenantService = inject(TenantService);
  private readonly portfolioService = inject(PortfolioService);
  private readonly ajusteService = inject(AjusteConciliacionService);
  private readonly route = inject(ActivatedRoute);
  private readonly esAdmin = inject(AuthService).hasAnyRole('ADMIN');

  tenants = signal<Tenant[]>([]);
  portfolios = signal<Portfolio[]>([]);
  subPortfolios = signal<SubPortfolio[]>([]);
  errorMessage = signal<string | null>(null);
  buscando = signal(false);

  /** Cliente y contexto con los que se buscó: los selectores pueden cambiar sin volver a buscar. */
  documentoCliente = signal<string | null>(null);
  contextoCliente = signal<ContextoAjuste | null>(null);
  /** Pago bancario a abrir en su ficha al cargar (búsqueda por Pb o enlace desde otra pantalla). */
  pbAbrir = signal<number | null>(null);
  /** Se suma al volver a buscar el mismo cliente. */
  recarga = signal(0);

  documento = '';
  selectedTenantId = 0;
  selectedPortfolioId = 0;
  selectedSubPortfolioId = 0;

  ngOnInit(): void {
    this.cargarTenants();
    this.aplicarParametros();
  }

  /**
   * Se puede abrir con ?tenantId=&carteraId=&subcarteraId=&documento=&pb= para llegar al cliente
   * (y a la ficha del pago) sin volver a elegir el contexto.
   */
  private aplicarParametros(): void {
    const q = this.route.snapshot.queryParamMap;
    const tenantId = Number(q.get('tenantId')) || 0;
    const carteraId = Number(q.get('carteraId')) || 0;
    const subcarteraId = Number(q.get('subcarteraId')) || 0;
    const documento = (q.get('documento') || '').trim();
    const pb = Number(q.get('pb')) || 0;
    if (!tenantId || !carteraId || !subcarteraId || (!documento && !pb)) return;

    this.selectedTenantId = tenantId;
    this.portfolioService.getPortfoliosByTenant(tenantId).subscribe({
      next: portfolios => {
        this.portfolios.set(portfolios);
        this.selectedPortfolioId = carteraId;
        this.portfolioService.getSubPortfoliosByPortfolio(carteraId).subscribe({
          next: subPortfolios => {
            this.subPortfolios.set(subPortfolios);
            this.selectedSubPortfolioId = subcarteraId;
            this.documento = documento || `Pb ${pb}`;
            if (pb && documento) this.pbAbrir.set(pb);
            this.buscarPagos();
          },
          error: () => this.errorMessage.set('No se pudieron cargar las subcarteras.')
        });
      },
      error: () => this.errorMessage.set('No se pudieron cargar las carteras.')
    });
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

  noDebtLetterQueryParams(): Record<string, string | number> {
    const params: Record<string, string | number> = {};
    const documento = this.documentoCliente() || this.documento.trim();

    if (documento) params['documento'] = documento;
    if (this.selectedTenantId > 0) params['tenantId'] = this.selectedTenantId;
    if (this.selectedPortfolioId > 0) params['carteraId'] = this.selectedPortfolioId;
    if (this.selectedSubPortfolioId > 0) params['subcarteraId'] = this.selectedSubPortfolioId;

    return params;
  }

  buscarPagos(): void {
    if (!this.canBuscar()) return;
    this.errorMessage.set(null);
    const contexto: ContextoAjuste = {
      tenantId: this.selectedTenantId,
      carteraId: this.selectedPortfolioId,
      subcarteraId: this.selectedSubPortfolioId
    };

    // "Pb 4442" o "pb4442": se busca el cliente del pago bancario y se abre su ficha.
    const pb = /^pb\s*(\d+)$/i.exec(this.documento.trim());
    if (!pb) {
      this.mostrarCliente(this.documento.trim(), contexto);
      return;
    }
    const pagoId = Number(pb[1]);
    this.buscando.set(true);
    this.ajusteService.documentoDePago(pagoId, contexto).subscribe({
      next: ({ documento }) => {
        this.buscando.set(false);
        // El buscador queda con el DNI del cliente encontrado.
        this.documento = documento;
        this.pbAbrir.set(this.esAdmin ? pagoId : null);
        this.mostrarCliente(documento, contexto);
      },
      error: err => {
        this.buscando.set(false);
        this.errorMessage.set(err?.error?.mensaje || `No se encontró el pago bancario ${pagoId} en esta subcartera.`);
      }
    });
  }

  private mostrarCliente(documento: string, contexto: ContextoAjuste): void {
    const mismo = this.documentoCliente() === documento
      && this.contextoCliente()?.subcarteraId === contexto.subcarteraId;
    this.documentoCliente.set(documento);
    this.contextoCliente.set(contexto);
    if (mismo) this.recarga.update(valor => valor + 1);
  }

  private clearResults(): void {
    this.errorMessage.set(null);
    this.documentoCliente.set(null);
    this.contextoCliente.set(null);
    this.pbAbrir.set(null);
  }
}
