import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TenantService } from '../../../maintenance/services/tenant.service';
import { PortfolioService } from '../../../maintenance/services/portfolio.service';
import { Tenant } from '../../../maintenance/models/tenant.model';
import { Portfolio, SubPortfolio } from '../../../maintenance/models/portfolio.model';
import { BcpPagosService } from '../../services/bcp-pagos.service';
import { CuotaResumenConciliacion, PagoBancoPorResolver, PromesaResumenConciliacion, ResumenConciliacionCliente } from '../../models/bcp-archivo.model';
import { ContextoAjuste, PagoBancoCliente } from '../../models/ajuste-conciliacion.model';
import { AjusteConciliacionService } from '../../services/ajuste-conciliacion.service';
import { AuthService } from '../../../core/services/auth.service';
import { PagosBancoClienteWidget } from '../../widgets/pagos-banco-cliente.widget';
import { HistoricoCorreccionesClienteWidget } from '../../widgets/historico-correcciones-cliente.widget';
import { ClienteResumenConciliacionDrawerWidget } from '../../widgets/cliente-resumen-conciliacion-drawer.widget';
import { CorreccionClienteContexto, PagoPendienteControlesDialogWidget } from '../../widgets/pago-pendiente-controles-dialog.widget';

@Component({
  selector: 'app-correccion-pagos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ClienteResumenConciliacionDrawerWidget, PagoPendienteControlesDialogWidget, PagosBancoClienteWidget, HistoricoCorreccionesClienteWidget],
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

      @if (resumenCliente(); as cliente) {
        <div class="mb-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <p class="text-sm text-slate-800 dark:text-slate-100">
            <span class="font-mono font-bold">{{ cliente.documento }}</span>
            · {{ cliente.nombreCliente || 'Cliente sin nombre' }}
            · Carta de no adeudo: <span class="font-semibold">{{ cliente.pagoCumplido ? 'disponible' : 'no disponible' }}</span>
          </p>
          @if (avisos().length > 0) {
            <ul class="mt-2 flex flex-wrap gap-2" aria-label="Pendientes del cliente">
              @for (aviso of avisos(); track aviso.texto) {
                <li>
                  <button type="button" (click)="pestana.set(aviso.pestana)" class="rounded-full border border-amber-300 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-900 hover:bg-amber-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 dark:border-amber-700 dark:bg-amber-950/30 dark:text-amber-200 dark:hover:bg-amber-900/40">
                    <span aria-hidden="true">⚠</span> {{ aviso.texto }}
                  </button>
                </li>
              }
            </ul>
          }
        </div>
      }

      @if (documentoBusqueda()) {
        <div role="tablist" aria-label="Datos del cliente" class="mb-3 flex flex-wrap gap-1 border-b border-slate-200 dark:border-slate-700">
          @for (tab of pestanas; track tab.id) {
            <button
              type="button"
              role="tab"
              [id]="'correccion-tab-' + tab.id"
              [attr.aria-selected]="pestana() === tab.id"
              [attr.aria-controls]="'correccion-panel-' + tab.id"
              (click)="pestana.set(tab.id)"
              class="-mb-px rounded-t-lg border-b-2 px-3 py-2 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              [class]="pestana() === tab.id ? 'border-emerald-600 text-emerald-800 dark:border-emerald-400 dark:text-emerald-300' : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'"
            >
              {{ tab.label }}{{ tab.id === 'banco' && pagosBanco().length > 0 ? ' (' + pagosBanco().length + ')' : '' }}
            </button>
          }
        </div>
      }

      @if (documentoBusqueda()) {
        <div
          id="correccion-panel-banco"
          role="tabpanel"
          aria-labelledby="correccion-tab-banco"
          [class.hidden]="pestana() !== 'banco'"
          class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
        >
          <app-pagos-banco-cliente
            [documento]="documentoBusqueda()"
            [contexto]="contextoAjuste()"
            [refresco]="refresco()"
            [esAdmin]="esAdmin"
            [abrirFichaDe]="pbAbrir()"
            (resolver)="abrirResolver($event)"
            (cambio)="cargarResumen($event, false)"
            (cargados)="pagosBanco.set($event)"
          ></app-pagos-banco-cliente>
        </div>

        @if (pestana() === 'historico') {
          <div id="correccion-panel-historico" role="tabpanel" aria-labelledby="correccion-tab-historico" class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <app-historico-correcciones-cliente
              [documento]="documentoBusqueda()"
              [contexto]="contextoAjuste()"
              [refresco]="refresco()"
            ></app-historico-correcciones-cliente>
          </div>
        }
      }

      <div id="correccion-panel-asesor" [attr.role]="documentoBusqueda() ? 'tabpanel' : null" [attr.aria-labelledby]="documentoBusqueda() ? 'correccion-tab-asesor' : null" [class.hidden]="!!documentoBusqueda() && pestana() !== 'asesor'">
      @if (resumenCliente()) {
        <div class="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <p class="text-xs text-slate-600 dark:text-slate-300">
            Para un pago que no corresponde a ninguna cuota, como un pago voluntario, usa las acciones del cliente.
          </p>
          <button
            type="button"
            (click)="abrirCorreccionCliente()"
            class="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700 dark:focus-visible:ring-offset-slate-800"
          >
            Acciones del cliente
          </button>
        </div>
      }

      <app-cliente-resumen-conciliacion-drawer
        #panelResumen
        [open]="resumenVisible()"
        mode="inline"
        [permiteCorregir]="true"
        [loading]="isLoadingResumenCliente()"
        [error]="resumenClienteError()"
        [documento]="resumenClienteDocumento()"
        [resumen]="resumenCliente()"
        [tenantId]="selectedTenantId"
        [carteraId]="selectedPortfolioId"
        [subcarteraId]="selectedSubPortfolioId"
        (close)="cerrarResumenCliente()"
        (corregirCuota)="abrirCorreccionCuota($event)"
        (ajustado)="abrirResumenCliente($event)"
      ></app-cliente-resumen-conciliacion-drawer>
      </div>

      <app-pago-pendiente-controles-dialog
        [cliente]="correccion()"
        [tenantId]="selectedTenantId"
        [carteraId]="selectedPortfolioId"
        [subcarteraId]="selectedSubPortfolioId"
        [cerrarConEscape]="!panelResumen.visorVoucherCuota"
        (verVouchers)="panelResumen.abrirVisorVoucher($event.promesa, $event.cuota)"
        (cerrado)="onCorreccionCerrada($event)"
      ></app-pago-pendiente-controles-dialog>

      <!-- Resolver un pago del banco pendiente desde la pestaña Pagos del banco -->
      <app-pago-pendiente-controles-dialog
        [pago]="pagoResolver()"
        [tenantId]="selectedTenantId"
        [carteraId]="selectedPortfolioId"
        [subcarteraId]="selectedSubPortfolioId"
        (cerrado)="onResolverCerrado($event)"
      ></app-pago-pendiente-controles-dialog>
    </div>
  `
})
export class CorreccionPagosPage implements OnInit {
  private readonly tenantService = inject(TenantService);
  private readonly portfolioService = inject(PortfolioService);
  private readonly bcpPagosService = inject(BcpPagosService);
  private readonly ajusteService = inject(AjusteConciliacionService);
  private readonly route = inject(ActivatedRoute);

  /** Ajustes finos (ficha, desconciliar): solo administradores. */
  readonly esAdmin = inject(AuthService).hasAnyRole('ADMIN');

  readonly pestanas: { id: 'banco' | 'asesor' | 'historico'; label: string }[] = [
    { id: 'banco', label: 'Pagos del banco' },
    { id: 'asesor', label: 'Promesas y pagos del asesor' },
    { id: 'historico', label: 'Histórico' }
  ];
  pestana = signal<'banco' | 'asesor' | 'historico'>('banco');
  /** Documento del cliente cargado (no el texto del buscador, que puede ser un Pb). */
  documentoBusqueda = signal<string | null>(null);
  /** Se suma para que las pestañas vuelvan a cargar. */
  refresco = signal(0);
  pagosBanco = signal<PagoBancoCliente[]>([]);
  /** Pago bancario a abrir en su ficha al cargar (búsqueda por Pb o enlace desde otra pantalla). */
  pbAbrir = signal<number | null>(null);
  /** Pago del banco pendiente que se está resolviendo. */
  pagoResolver = signal<PagoBancoPorResolver | null>(null);

  /** Lo que conviene revisar del cliente, arriba de las pestañas. */
  readonly avisos = computed<{ texto: string; pestana: 'banco' | 'asesor' }[]>(() => {
    const avisos: { texto: string; pestana: 'banco' | 'asesor' }[] = [];
    const pagos = this.pagosBanco();
    const pendientes = pagos.filter(p => p.categoria === 'REQUIERE_REVISION').length;
    if (pendientes > 0) {
      avisos.push({ texto: `${pendientes} ${pendientes === 1 ? 'pago del banco pendiente' : 'pagos del banco pendientes'}`, pestana: 'banco' });
    }
    const parciales = pagos.filter(p => p.categoria === 'PARCIAL_EN_ESPERA').length;
    if (parciales > 0) {
      avisos.push({ texto: `${parciales} ${parciales === 1 ? 'pago parcial en espera' : 'pagos parciales en espera'}`, pestana: 'banco' });
    }
    const voluntariosSinBanco = (this.resumenCliente()?.promesas || []).filter(promesa => {
      if (!String(promesa.rutaTipificacion || '').toUpperCase().includes('PAGO VOLUNTARIO')) return false;
      const pagosCuota = (promesa.cuotas || []).flatMap(cuota => cuota.pagos || []);
      return pagosCuota.length === 1 && !pagosCuota[0].verificadoBanco && !pagosCuota[0].pagoBancarioId;
    }).length;
    if (voluntariosSinBanco > 0) {
      avisos.push({ texto: `${voluntariosSinBanco} ${voluntariosSinBanco === 1 ? 'pago voluntario sin banco' : 'pagos voluntarios sin banco'}`, pestana: 'asesor' });
    }
    return avisos;
  });

  tenants = signal<Tenant[]>([]);
  portfolios = signal<Portfolio[]>([]);
  subPortfolios = signal<SubPortfolio[]>([]);
  errorMessage = signal<string | null>(null);
  resumenDrawerOpen = signal(false);
  isLoadingResumenCliente = signal(false);
  resumenClienteError = signal<string | null>(null);
  resumenClienteDocumento = signal<string | null>(null);
  resumenCliente = signal<ResumenConciliacionCliente | null>(null);
  /** Cuota o cliente en corrección. El diálogo está abierto mientras tenga valor. */
  correccion = signal<CorreccionClienteContexto | null>(null);

  documento = '';
  selectedTenantId = 0;
  selectedPortfolioId = 0;
  selectedSubPortfolioId = 0;

  ngOnInit(): void {
    this.cargarTenants();
    this.aplicarParametros();
  }

  /**
   * Otras pantallas abren esta con ?tenantId=&carteraId=&subcarteraId=&documento=&pb= para llegar al cliente
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
            if (pb) this.pbAbrir.set(pb);
            this.buscarPagos();
          },
          error: () => this.errorMessage.set('No se pudieron cargar las subcarteras.')
        });
      },
      error: () => this.errorMessage.set('No se pudieron cargar las carteras.')
    });
  }

  contextoAjuste(): ContextoAjuste {
    return { tenantId: this.selectedTenantId, carteraId: this.selectedPortfolioId, subcarteraId: this.selectedSubPortfolioId };
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
    if (!this.canBuscar()) return;
    // "Pb 4442" o "pb4442": se busca el cliente del pago bancario y se abre su ficha.
    const pb = /^pb\s*(\d+)$/i.exec(this.documento.trim());
    if (!pb) {
      this.abrirResumenCliente();
      return;
    }
    const pagoId = Number(pb[1]);
    this.errorMessage.set(null);
    this.ajusteService.documentoDePago(pagoId, this.contextoAjuste()).subscribe({
      next: ({ documento }) => {
        // El buscador queda con el DNI del cliente encontrado.
        this.documento = documento;
        this.pbAbrir.set(this.esAdmin ? pagoId : null);
        this.pestana.set('banco');
        this.abrirResumenCliente(documento);
      },
      error: err => this.errorMessage.set(err?.error?.mensaje || `No se encontró el pago bancario ${pagoId} en esta subcartera.`)
    });
  }

  abrirResolver(pago: PagoBancoPorResolver): void {
    this.pagoResolver.set(pago);
  }

  onResolverCerrado(evento: { documento: string; huboCambios: boolean }): void {
    this.pagoResolver.set(null);
    this.onCorreccionCerrada(evento);
  }

  abrirResumenCliente(documentoResumen?: string): void {
    if (!this.canVerResumen()) return;

    const documento = (documentoResumen || this.documento).trim();
    if (!documento) return;
    this.cargarResumen(documento, true);
  }

  /** Carga el resumen del asesor; con refrescarPestanas también vuelve a leer los pagos del banco y el histórico. */
  cargarResumen(documento: string, refrescarPestanas: boolean): void {
    if (this.documentoBusqueda() !== documento) {
      this.pagosBanco.set([]);
    }
    this.documentoBusqueda.set(documento);
    if (refrescarPestanas) this.refresco.update(valor => valor + 1);

    // Al recargar el mismo cliente se conserva lo que se ve mientras llega el resumen nuevo.
    if (this.resumenClienteDocumento() !== documento) {
      this.resumenCliente.set(null);
    }
    this.resumenDrawerOpen.set(true);
    this.isLoadingResumenCliente.set(true);
    this.resumenClienteError.set(null);
    this.resumenClienteDocumento.set(documento);

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

  abrirCorreccionCuota(evento: { promesa: PromesaResumenConciliacion; cuota: CuotaResumenConciliacion }): void {
    const documento = this.documentoDelResumen();
    if (!documento) return;
    this.correccion.set({ documento, promesa: evento.promesa, cuota: evento.cuota });
  }

  abrirCorreccionCliente(): void {
    const documento = this.documentoDelResumen();
    if (!documento) return;
    this.correccion.set({ documento });
  }

  onCorreccionCerrada(evento: { documento: string; huboCambios: boolean }): void {
    this.correccion.set(null);
    if (!evento.huboCambios) return;

    // La corrección puede hacer que un pago bancario pendiente ya calce: se reevalúa antes de refrescar.
    const refrescar = () => this.abrirResumenCliente(evento.documento);
    this.bcpPagosService.reevaluarPendientesCliente(evento.documento, {
      tenantId: this.selectedTenantId,
      carteraId: this.selectedPortfolioId,
      subcarteraId: this.selectedSubPortfolioId
    }).subscribe({ next: refrescar, error: refrescar });
  }

  private documentoDelResumen(): string {
    return String(this.resumenCliente()?.documento || this.resumenClienteDocumento() || '').trim();
  }

  private clearResults(): void {
    this.errorMessage.set(null);
    this.resumenCliente.set(null);
    this.resumenClienteError.set(null);
    this.documentoBusqueda.set(null);
    this.pagosBanco.set([]);
  }
}
