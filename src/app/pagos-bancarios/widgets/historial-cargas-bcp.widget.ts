import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tenant } from '../../maintenance/models/tenant.model';
import { Portfolio, SubPortfolio } from '../../maintenance/models/portfolio.model';
import { TenantService } from '../../maintenance/services/tenant.service';
import { PortfolioService } from '../../maintenance/services/portfolio.service';
import { BcpPagosService } from '../services/bcp-pagos.service';
import { ArchivoCargaDetalleItem, ArchivoCargaHistorialItem } from '../models/bcp-archivo.model';

@Component({
  selector: 'app-historial-cargas-bcp',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-4">
      <section class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div class="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 class="text-lg font-bold text-slate-900 dark:text-white">Historial de carga de pagos</h2>
            <p class="text-xs text-slate-500 dark:text-slate-400">Seleccione contexto y consulte los archivos aprobados.</p>
          </div>
          <button type="button" (click)="buscar()" [disabled]="!hasContext() || isLoading()" class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed dark:disabled:bg-slate-700 dark:disabled:text-slate-400">
            {{ isLoading() ? 'Buscando...' : 'Buscar' }}
          </button>
        </div>

        <div class="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div>
            <label class="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">Proveedor</label>
            <select [(ngModel)]="selectedTenantId" (ngModelChange)="onTenantChange($event)" class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white">
              <option [ngValue]="0">Seleccione proveedor...</option>
              @for (tenant of tenants(); track tenant.id) {
                <option [ngValue]="tenant.id">{{ tenant.tenantCode }} - {{ tenant.tenantName }}</option>
              }
            </select>
          </div>

          <div>
            <label class="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">Cartera</label>
            <select [(ngModel)]="selectedPortfolioId" (ngModelChange)="onPortfolioChange($event)" [disabled]="selectedTenantId === 0" class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:text-slate-400 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:disabled:bg-slate-800">
              <option [ngValue]="0">Seleccione cartera...</option>
              @for (portfolio of portfolios(); track portfolio.id) {
                <option [ngValue]="portfolio.id">{{ portfolio.portfolioCode }} - {{ portfolio.portfolioName }}</option>
              }
            </select>
          </div>

          <div>
            <label class="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">Subcartera</label>
            <select [(ngModel)]="selectedSubPortfolioId" (ngModelChange)="onSubPortfolioChange($event)" [disabled]="selectedPortfolioId === 0" class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:text-slate-400 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:disabled:bg-slate-800">
              <option [ngValue]="0">Seleccione subcartera...</option>
              @for (subPortfolio of subPortfolios(); track subPortfolio.id) {
                <option [ngValue]="subPortfolio.id">{{ subPortfolio.subPortfolioCode }} - {{ subPortfolio.subPortfolioName }}</option>
              }
            </select>
          </div>
        </div>

        @if (errorMessage()) {
          <div class="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700 dark:border-red-800 dark:bg-red-950/20 dark:text-red-300">{{ errorMessage() }}</div>
        }
      </section>

      <section class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div class="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-700">
          <div>
            <h3 class="font-bold text-slate-900 dark:text-white">Archivos cargados</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400">{{ totalElements() }} registro(s)</p>
          </div>
          <span class="text-xs text-slate-500 dark:text-slate-400">Página {{ currentPage() + 1 }} de {{ totalPages() || 1 }}</span>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead class="bg-slate-100 text-xs uppercase tracking-wide text-slate-600 dark:bg-slate-700/60 dark:text-slate-300">
              <tr>
                <th class="px-4 py-3 text-left font-bold">Archivo</th>
                <th class="px-4 py-3 text-left font-bold">Subido por</th>
                <th class="px-4 py-3 text-right font-bold">Pagos</th>
                <th class="px-4 py-3 text-left font-bold">Fecha carga</th>
                <th class="px-4 py-3 text-right font-bold">Acción</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-700/60">
              @for (archivo of archivos(); track archivo.archivoCargaId) {
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/40">
                  <td class="px-4 py-3 font-semibold text-slate-900 dark:text-white">{{ archivo.nombreArchivo }}</td>
                  <td class="px-4 py-3 text-slate-700 dark:text-slate-300">{{ archivo.subidoPorNombre || '-' }}</td>
                  <td class="px-4 py-3 text-right font-semibold text-slate-900 dark:text-white">{{ archivo.cantidadPagos }}</td>
                  <td class="px-4 py-3 text-slate-700 dark:text-slate-300">{{ formatDateTime(archivo.fechaCarga) }}</td>
                  <td class="px-4 py-3 text-right">
                    <button type="button" (click)="verDetalle(archivo)" class="rounded-lg border border-blue-200 px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-950/30">Ver detalle</button>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="5" class="px-4 py-10 text-center text-sm text-slate-500 dark:text-slate-400">No hay cargas para el contexto seleccionado.</td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <div class="flex items-center justify-between border-t border-slate-200 px-4 py-3 dark:border-slate-700">
          <button type="button" (click)="cambiarPagina(currentPage() - 1)" [disabled]="isLoading() || currentPage() <= 0" class="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700">Anterior</button>
          <button type="button" (click)="cambiarPagina(currentPage() + 1)" [disabled]="isLoading() || currentPage() >= totalPages() - 1" class="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700">Siguiente</button>
        </div>
      </section>

      @if (detalleOpen()) {
        <div class="fixed inset-0 z-50 flex justify-end bg-transparent" (click)="cerrarDetalle()">
          <aside class="h-screen w-[760px] max-w-[96vw] overflow-y-auto border-l border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900" (click)="$event.stopPropagation()">
            <div class="sticky top-0 z-10 border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <p class="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Detalle de carga</p>
                  <h3 class="mt-0.5 text-lg font-bold text-slate-900 dark:text-white">{{ selectedArchivo()?.nombreArchivo }}</h3>
                  <p class="text-xs text-slate-500 dark:text-slate-400">{{ detalle().length }} conciliación(es)</p>
                </div>
                <button type="button" (click)="cerrarDetalle()" class="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">Cerrar</button>
              </div>
            </div>

            <div class="p-4">
              @if (isLoadingDetalle()) {
                <div class="rounded-xl border border-slate-200 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">Cargando detalle...</div>
              } @else if (detalleError()) {
                <div class="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700 dark:border-red-800 dark:bg-red-950/20 dark:text-red-300">{{ detalleError() }}</div>
              } @else {
                <div class="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
                  <table class="min-w-[980px] text-xs">
                    <thead class="bg-slate-100 text-left uppercase tracking-wide text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      <tr>
                        <th class="px-3 py-2">Fila</th>
                        <th class="px-3 py-2">Documento</th>
                        <th class="px-3 py-2">Cliente</th>
                        <th class="px-3 py-2">Pago banco</th>
                        <th class="px-3 py-2">Operación</th>
                        <th class="px-3 py-2">Aplicación</th>
                        <th class="px-3 py-2">Agente</th>
                        <th class="px-3 py-2">Relación</th>
                        <th class="px-3 py-2">Aprobación</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                      @for (row of detalle(); track row.conciliacionId) {
                        <tr class="align-top hover:bg-slate-50 dark:hover:bg-slate-800/50">
                          <td class="px-3 py-2 font-semibold text-slate-900 dark:text-white">{{ row.numeroFila }}</td>
                          <td class="px-3 py-2 font-mono text-slate-700 dark:text-slate-300">{{ row.documento }}</td>
                          <td class="px-3 py-2 text-slate-700 dark:text-slate-300">{{ row.nombreCliente }}</td>
                          <td class="px-3 py-2 text-slate-700 dark:text-slate-300">
                            <span class="whitespace-nowrap">{{ formatDate(row.fechaBanco) }} · {{ row.banco }}</span>
                            <span class="ml-1 font-bold text-slate-900 dark:text-white">S/ {{ formatMoney(row.montoBanco) }}</span>
                            @if (row.medioAtencion) {
                              <span class="ml-1 text-slate-500">{{ row.medioAtencion }}</span>
                            }
                          </td>
                          <td class="px-3 py-2 font-mono text-slate-700 dark:text-slate-300">{{ row.numeroOperacion || '-' }}</td>
                          <td class="px-3 py-2 text-slate-700 dark:text-slate-300">
                            <span class="font-bold text-slate-900 dark:text-white">S/ {{ formatMoney(row.montoAplicado) }}</span>
                            <span class="ml-1">→ Cuota {{ row.numeroCuota }} · {{ row.estadoCuota }}</span>
                            <span class="ml-1 whitespace-nowrap text-slate-500">{{ formatDate(row.fechaPromesa) }}</span>
                          </td>
                          <td class="px-3 py-2 text-slate-700 dark:text-slate-300">{{ row.nombreAgente }}</td>
                          <td class="px-3 py-2 text-slate-700 dark:text-slate-300">{{ formatTipoRelacion(row.tipoRelacion) }}</td>
                          <td class="px-3 py-2 whitespace-nowrap text-slate-700 dark:text-slate-300">{{ formatDateTime(row.fechaAprobacion) }}</td>
                        </tr>
                      } @empty {
                        <tr>
                          <td colspan="9" class="px-3 py-8 text-center text-sm text-slate-500 dark:text-slate-400">Sin conciliaciones para este archivo.</td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              }
            </div>
          </aside>
        </div>
      }
    </div>
  `
})
export class HistorialCargasBcpWidget implements OnInit {
  tenants = signal<Tenant[]>([]);
  portfolios = signal<Portfolio[]>([]);
  subPortfolios = signal<SubPortfolio[]>([]);

  selectedTenantId = 0;
  selectedPortfolioId = 0;
  selectedSubPortfolioId = 0;

  archivos = signal<ArchivoCargaHistorialItem[]>([]);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  totalElements = signal(0);
  totalPages = signal(0);
  currentPage = signal(0);
  pageSize = 20;

  detalleOpen = signal(false);
  selectedArchivo = signal<ArchivoCargaHistorialItem | null>(null);
  detalle = signal<ArchivoCargaDetalleItem[]>([]);
  isLoadingDetalle = signal(false);
  detalleError = signal<string | null>(null);

  constructor(
    private tenantService: TenantService,
    private portfolioService: PortfolioService,
    private bcpService: BcpPagosService
  ) {}

  ngOnInit(): void {
    this.tenantService.getAllTenants().subscribe({
      next: (tenants) => this.tenants.set(tenants),
      error: () => this.errorMessage.set('No se pudieron cargar los proveedores.')
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
        error: () => this.errorMessage.set('No se pudieron cargar las carteras.')
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
        error: () => this.errorMessage.set('No se pudieron cargar las subcarteras.')
      });
    }
  }

  onSubPortfolioChange(subPortfolioId: number): void {
    this.selectedSubPortfolioId = Number(subPortfolioId) || 0;
    this.clearResults();
  }

  hasContext(): boolean {
    return this.selectedTenantId > 0 && this.selectedPortfolioId > 0 && this.selectedSubPortfolioId > 0;
  }

  buscar(page = 0): void {
    if (!this.hasContext()) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.currentPage.set(page);

    this.bcpService.listarHistorialArchivosCarga({
      tenantId: this.selectedTenantId,
      carteraId: this.selectedPortfolioId,
      subcarteraId: this.selectedSubPortfolioId,
      page,
      size: this.pageSize
    }).subscribe({
      next: (response) => {
        this.archivos.set(response.content || []);
        this.totalElements.set(response.totalElements || 0);
        this.totalPages.set(response.totalPages || 0);
        this.currentPage.set(response.number || 0);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('No se pudo cargar el historial de archivos.');
        this.isLoading.set(false);
      }
    });
  }

  cambiarPagina(page: number): void {
    if (page < 0 || page >= this.totalPages()) return;
    this.buscar(page);
  }

  verDetalle(archivo: ArchivoCargaHistorialItem): void {
    if (!this.hasContext()) return;

    this.selectedArchivo.set(archivo);
    this.detalleOpen.set(true);
    this.isLoadingDetalle.set(true);
    this.detalleError.set(null);
    this.detalle.set([]);

    this.bcpService.obtenerDetalleArchivoCarga(archivo.archivoCargaId, {
      tenantId: this.selectedTenantId,
      carteraId: this.selectedPortfolioId,
      subcarteraId: this.selectedSubPortfolioId
    }).subscribe({
      next: (detalle) => {
        this.detalle.set(detalle || []);
        this.isLoadingDetalle.set(false);
      },
      error: () => {
        this.detalleError.set('No se pudo cargar el detalle del archivo.');
        this.isLoadingDetalle.set(false);
      }
    });
  }

  cerrarDetalle(): void {
    this.detalleOpen.set(false);
  }

  private clearResults(): void {
    this.archivos.set([]);
    this.totalElements.set(0);
    this.totalPages.set(0);
    this.currentPage.set(0);
    this.errorMessage.set(null);
    this.cerrarDetalle();
  }

  formatMoney(value: number | null | undefined): string {
    if (value === null || value === undefined) return '0.00';
    return Number(value).toFixed(2);
  }

  formatDateTime(value: string | null | undefined): string {
    if (!value) return '-';
    const text = String(value);
    const match = text.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
    if (match) return `${match[3]}-${match[2]}-${match[1]} ${match[4]}:${match[5]}`;
    return text;
  }

  formatDate(value: string | null | undefined): string {
    if (!value) return '-';
    const text = String(value);
    const match = text.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) return `${match[3]}-${match[2]}-${match[1]}`;
    return text;
  }

  formatTipoRelacion(value: string | null | undefined): string {
    if (value === 'BCP_A_CUOTA') return 'Pago a cuota';
    if (value === 'BCP_A_TRANSACCION') return 'Pago a transacción';
    return value || '-';
  }
}
