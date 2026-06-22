import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TenantService } from '../../../maintenance/services/tenant.service';
import { PortfolioService } from '../../../maintenance/services/portfolio.service';
import { Tenant } from '../../../maintenance/models/tenant.model';
import { Portfolio, SubPortfolio } from '../../../maintenance/models/portfolio.model';
import { CorreccionPagosService } from '../../services/correccion-pagos.service';
import { CorregirPagoResponse, PagoPendienteConciliacion } from '../../models/correccion-pagos.model';
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
            Busca pagos pendientes de conciliación por DNI y corrige la fecha o monto del pago cuota.
          </p>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <button
            type="button"
            (click)="abrirResumenCliente()"
            [disabled]="!canVerResumen() || isLoadingResumenCliente()"
            class="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            @if (isLoadingResumenCliente()) {
              <svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            } @else {
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z"/>
              </svg>
            }
            Ver resumen
          </button>

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
            <h2 class="text-sm font-semibold text-slate-800 dark:text-white">Buscar pagos</h2>
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
              [disabled]="!canBuscar() || isLoading()"
              class="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              @if (isLoading()) {
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

      <div class="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_380px]">
        <section class="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div class="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-700">
            <div>
              <h2 class="text-sm font-semibold text-slate-800 dark:text-white">Pagos a conciliar</h2>
              <p class="text-xs text-slate-500 dark:text-slate-400">{{ pagos().length }} registro(s) encontrados</p>
            </div>
          </div>

          @if (pagos().length === 0 && !isLoading()) {
            <div class="p-8 text-center text-sm text-slate-500 dark:text-slate-400">
              Busca por DNI para visualizar pagos cuota pendientes de conciliación.
            </div>
          } @else {
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-slate-200 text-xs dark:divide-slate-700">
                <thead class="bg-slate-50 dark:bg-slate-700/50">
                  <tr>
                    <th class="px-3 py-2 text-left font-semibold text-slate-600 dark:text-slate-300">Pago</th>
                    <th class="px-3 py-2 text-left font-semibold text-slate-600 dark:text-slate-300">Cliente</th>
                    <th class="px-3 py-2 text-left font-semibold text-slate-600 dark:text-slate-300">Cuota</th>
                    <th class="px-3 py-2 text-left font-semibold text-slate-600 dark:text-slate-300">Gestión</th>
                    <th class="px-3 py-2 text-right font-semibold text-slate-600 dark:text-slate-300">Acción</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
                  @for (pago of pagos(); track pago.pagoCuotaId) {
                    <tr
                      class="transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/40"
                      [ngClass]="{ 'bg-emerald-50 dark:bg-emerald-900/20': selectedPago()?.pagoCuotaId === pago.pagoCuotaId }"
                    >
                      <td class="px-3 py-2 align-top">
                        <div class="font-semibold text-slate-800 dark:text-white">#{{ pago.pagoCuotaId }}</div>
                        <div class="text-slate-600 dark:text-slate-300">{{ formatDate(pago.fechaPago) }} · S/ {{ formatMonto(pago.montoPago) }}</div>
                        <div class="text-xs text-slate-500 dark:text-slate-400">{{ pago.banco || 'Sin banco' }} · {{ pago.numeroOperacion || 'Sin operación' }}</div>
                      </td>
                      <td class="px-3 py-2 align-top">
                        <div class="font-medium text-slate-800 dark:text-white">{{ pago.nombreCliente || 'Sin nombre' }}</div>
                        <div class="text-xs text-slate-500 dark:text-slate-400">DNI {{ pago.documento }} · Tx {{ pago.transaccionId }}</div>
                      </td>
                      <td class="px-3 py-2 align-top">
                        <div class="text-slate-700 dark:text-slate-200">Cuota {{ pago.numeroCuota }} · {{ pago.estadoCuota }}</div>
                        <div class="text-xs text-slate-500 dark:text-slate-400">{{ formatDate(pago.fechaPromesa) }} · S/ {{ formatMonto(pago.montoPromesa) }}</div>
                      </td>
                      <td class="px-3 py-2 align-top">
                        <div class="text-slate-700 dark:text-slate-200">{{ pago.estadoPagoGestion }}</div>
                        <div class="text-xs text-slate-500 dark:text-slate-400">{{ pago.nombreAgente || 'Sin agente' }} · {{ formatDate(pago.fechaGestion) }}</div>
                        <div class="mt-1 max-w-xs truncate text-xs text-slate-500 dark:text-slate-400" [title]="pago.rutaTipificacion">{{ pago.rutaTipificacion }}</div>
                      </td>
                      <td class="px-3 py-2 text-right align-top">
                        <button
                          type="button"
                          (click)="seleccionarPago(pago)"
                          class="rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors"
                          [ngClass]="selectedPago()?.pagoCuotaId === pago.pagoCuotaId
                            ? 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700'"
                        >
                          {{ selectedPago()?.pagoCuotaId === pago.pagoCuotaId ? 'Seleccionado' : 'Seleccionar' }}
                        </button>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
        </section>

        <aside class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h2 class="mb-1 text-sm font-semibold text-slate-800 dark:text-white">Modificar pago cuota</h2>
          <p class="mb-4 text-xs text-slate-500 dark:text-slate-400">Selecciona un pago de la lista para editar sus datos.</p>

          @if (!selectedPago()) {
            <div class="rounded-lg border border-dashed border-slate-300 p-5 text-center text-xs text-slate-500 dark:border-slate-600 dark:text-slate-400">
              Ningún pago seleccionado.
            </div>
          } @else {
            <div class="mb-4 rounded-lg bg-slate-50 p-3 text-xs dark:bg-slate-700/50">
              <div class="mb-2 font-semibold text-slate-800 dark:text-white">Pago #{{ selectedPago()!.pagoCuotaId }}</div>
              <div class="grid grid-cols-2 gap-2 text-slate-600 dark:text-slate-300">
                <div>
                  <span class="block text-xs text-slate-500 dark:text-slate-400">Fecha actual</span>
                  {{ formatDate(selectedPago()!.fechaPago) }}
                </div>
                <div>
                  <span class="block text-xs text-slate-500 dark:text-slate-400">Monto actual</span>
                  S/ {{ formatMonto(selectedPago()!.montoPago) }}
                </div>
              </div>
            </div>

            <div class="space-y-3">
              <div>
                <label class="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-300">Nueva fecha de pago</label>
                <input
                  type="date"
                  [(ngModel)]="correctionFechaPago"
                  name="correctionFechaPago"
                  class="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                />
              </div>
              <div>
                <label class="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-300">Nuevo monto</label>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  [(ngModel)]="correctionMontoPago"
                  name="correctionMontoPago"
                  class="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                />
              </div>

              @if (successMessage()) {
                <div class="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300">
                  {{ successMessage() }}
                </div>
              }

              <button
                type="button"
                (click)="corregirPago()"
                [disabled]="!canCorregir() || isSaving()"
                class="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                @if (isSaving()) {
                  <svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Guardando...
                } @else {
                  Guardar corrección
                }
              </button>
            </div>
          }
        </aside>
      </div>

      <app-cliente-resumen-conciliacion-drawer
        [open]="resumenDrawerOpen()"
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
  private readonly correccionPagosService = inject(CorreccionPagosService);
  private readonly bcpPagosService = inject(BcpPagosService);

  tenants = signal<Tenant[]>([]);
  portfolios = signal<Portfolio[]>([]);
  subPortfolios = signal<SubPortfolio[]>([]);
  pagos = signal<PagoPendienteConciliacion[]>([]);
  selectedPago = signal<PagoPendienteConciliacion | null>(null);
  isLoading = signal(false);
  isSaving = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  resumenDrawerOpen = signal(false);
  isLoadingResumenCliente = signal(false);
  resumenClienteError = signal<string | null>(null);
  resumenClienteDocumento = signal<string | null>(null);
  resumenCliente = signal<ResumenConciliacionCliente | null>(null);

  documento = '';
  selectedTenantId = 0;
  selectedPortfolioId = 0;
  selectedSubPortfolioId = 0;
  correctionFechaPago = '';
  correctionMontoPago: number | null = null;

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

  buscarPagos(): void {
    if (!this.canBuscar()) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);
    this.selectedPago.set(null);

    this.correccionPagosService.buscarPendientesConciliacion({
      documento: this.documento.trim(),
      tenantId: this.selectedTenantId,
      carteraId: this.selectedPortfolioId,
      subcarteraId: this.selectedSubPortfolioId
    }).subscribe({
      next: (pagos) => {
        this.pagos.set(pagos);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error buscando pagos pendientes:', error);
        this.errorMessage.set(error.error?.mensaje || error.error?.message || 'No se pudieron obtener los pagos pendientes.');
        this.pagos.set([]);
        this.isLoading.set(false);
      }
    });
  }

  seleccionarPago(pago: PagoPendienteConciliacion): void {
    this.selectedPago.set(pago);
    this.correctionFechaPago = this.toDateInputValue(pago.fechaPago);
    this.correctionMontoPago = pago.montoPago;
    this.errorMessage.set(null);
    this.successMessage.set(null);
  }

  canCorregir(): boolean {
    return !!this.selectedPago()
      && !!this.correctionFechaPago
      && Number(this.correctionMontoPago) > 0
      && this.selectedTenantId > 0
      && this.selectedPortfolioId > 0
      && this.selectedSubPortfolioId > 0;
  }

  corregirPago(): void {
    const pago = this.selectedPago();
    if (!pago || !this.canCorregir()) return;

    this.isSaving.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    this.correccionPagosService.corregirPago(
      pago.pagoCuotaId,
      {
        tenantId: this.selectedTenantId,
        carteraId: this.selectedPortfolioId,
        subcarteraId: this.selectedSubPortfolioId
      },
      {
        fechaPago: this.correctionFechaPago,
        montoPago: Number(this.correctionMontoPago)
      }
    ).subscribe({
      next: (response) => {
        this.applyCorrectionResponse(response);
        this.successMessage.set('Pago corregido correctamente.');
        this.isSaving.set(false);
      },
      error: (error) => {
        console.error('Error corrigiendo pago:', error);
        this.errorMessage.set(error.error?.mensaje || error.error?.message || 'No se pudo corregir el pago.');
        this.isSaving.set(false);
      }
    });
  }

  abrirResumenCliente(): void {
    if (!this.canVerResumen()) return;

    const documento = this.selectedPago()?.documento || this.documento.trim();
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

  formatMonto(value: number | null | undefined): string {
    return Number(value || 0).toLocaleString('es-PE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  formatDate(value: string | null | undefined): string {
    if (!value) return '-';
    const normalized = this.toDateInputValue(value);
    if (!normalized) return value;
    const [year, month, day] = normalized.split('-');
    return `${day}/${month}/${year}`;
  }

  private clearResults(): void {
    this.pagos.set([]);
    this.selectedPago.set(null);
    this.errorMessage.set(null);
    this.successMessage.set(null);
  }

  private toDateInputValue(value: string | null | undefined): string {
    if (!value) return '';
    return value.slice(0, 10);
  }

  private applyCorrectionResponse(response: CorregirPagoResponse): void {
    const updated = this.pagos().map(pago => {
      if (pago.pagoCuotaId !== response.pagoCuotaId) return pago;

      return {
        ...pago,
        fechaPago: response.fechaPagoNueva,
        montoPago: response.montoPagoNuevo,
        estadoCuota: response.estadoCuota,
        estadoPagoGestion: response.estadoPagoGestion
      };
    });

    this.pagos.set(updated);
    const selected = updated.find(pago => pago.pagoCuotaId === response.pagoCuotaId) || null;
    this.selectedPago.set(selected);
  }
}
