import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Portfolio, SubPortfolio } from '../../../../../maintenance/models/portfolio.model';
import { Tenant } from '../../../../../maintenance/models/tenant.model';
import { PortfolioService } from '../../../../../maintenance/services/portfolio.service';
import { TenantService } from '../../../../../maintenance/services/tenant.service';
import { NoDebtLetterValidationErrorResponse } from '../../models/no-debt-letter-validated.model';
import { NoDebtLetterValidatedService } from '../../services/no-debt-letter-validated.service';

@Component({
  selector: 'app-no-debt-letter-validated-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-slate-50 p-4 dark:bg-slate-900">
      <div class="mb-4">
        <h1 class="text-xl font-bold text-slate-800 dark:text-white">Carta de no adeudo</h1>
        <p class="text-sm text-slate-600 dark:text-slate-400">
          Genera la carta validando pagos registrados por sistema y verificación bancaria.
        </p>
      </div>

      <section class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div class="mb-3 flex items-center gap-2">
          <div class="rounded-lg bg-blue-100 p-1.5 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <div>
            <h2 class="text-sm font-semibold text-slate-800 dark:text-white">Datos de validación</h2>
            <p class="text-xs text-slate-500 dark:text-slate-400">Completa el contexto del cliente antes de generar la carta.</p>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-3 md:grid-cols-5">
          <div>
            <label class="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-300">Documento</label>
            <input
              type="text"
              [(ngModel)]="documento"
              name="documento"
              maxlength="15"
              class="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              placeholder="Ej: 12345678"
            />
          </div>

          <div>
            <label class="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-300">Proveedor</label>
            <select
              [(ngModel)]="selectedTenantId"
              (ngModelChange)="onTenantChange($event)"
              name="tenant"
              class="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
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
              class="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:disabled:bg-slate-800"
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
              class="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:disabled:bg-slate-800"
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
              (click)="generarCarta()"
              [disabled]="!canGenerate() || isLoading()"
              class="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              @if (isLoading()) {
                <svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Generando...
              } @else {
                Generar PDF
              }
            </button>
          </div>
        </div>

        @if (successMessage()) {
          <div class="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300">
            {{ successMessage() }}
          </div>
        }

        @if (errorMessage()) {
          <div class="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
            {{ errorMessage() }}
          </div>
        }
      </section>

      @if (validationError()) {
        <section class="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-100">
          <h3 class="mb-2 font-semibold">Detalle de validación</h3>
          <p>{{ validationError()?.mensaje || validationError()?.message || 'El cliente no cumple las condiciones para generar la carta.' }}</p>

          @if ((validationError()?.cuotas?.length || 0) > 0) {
            <div class="mt-3 overflow-x-auto">
              <table class="min-w-full text-xs">
                <thead>
                  <tr class="border-b border-amber-200 text-left dark:border-amber-800">
                    <th class="py-1 pr-3">Cuota</th>
                    <th class="py-1 pr-3">Fecha promesa</th>
                    <th class="py-1 pr-3">Monto</th>
                    <th class="py-1 pr-3">Estado</th>
                    <th class="py-1 pr-3">Motivo</th>
                  </tr>
                </thead>
                <tbody>
                  @for (cuota of validationError()?.cuotas; track cuota.cuotaId) {
                    <tr class="border-b border-amber-100 dark:border-amber-900/60">
                      <td class="py-1 pr-3">{{ cuota.numeroCuota }}</td>
                      <td class="py-1 pr-3">{{ cuota.fechaPromesa }}</td>
                      <td class="py-1 pr-3">{{ cuota.montoPromesa | number:'1.2-2' }}</td>
                      <td class="py-1 pr-3">{{ cuota.estado }}</td>
                      <td class="py-1 pr-3">{{ cuota.motivo }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }

          @if ((validationError()?.pagos?.length || 0) > 0) {
            <div class="mt-3 overflow-x-auto">
              <table class="min-w-full text-xs">
                <thead>
                  <tr class="border-b border-amber-200 text-left dark:border-amber-800">
                    <th class="py-1 pr-3">Cuota</th>
                    <th class="py-1 pr-3">Fecha pago</th>
                    <th class="py-1 pr-3">Monto</th>
                    <th class="py-1 pr-3">Banco</th>
                    <th class="py-1 pr-3">Operacion</th>
                    <th class="py-1 pr-3">Motivo</th>
                  </tr>
                </thead>
                <tbody>
                  @for (pago of validationError()?.pagos; track pago.pagoCuotaId) {
                    <tr class="border-b border-amber-100 dark:border-amber-900/60">
                      <td class="py-1 pr-3">{{ pago.numeroCuota }}</td>
                      <td class="py-1 pr-3">{{ pago.fechaPago }}</td>
                      <td class="py-1 pr-3">{{ pago.montoPago | number:'1.2-2' }}</td>
                      <td class="py-1 pr-3">{{ pago.banco || '-' }}</td>
                      <td class="py-1 pr-3">{{ pago.numeroOperacion || '-' }}</td>
                      <td class="py-1 pr-3">{{ pago.motivo }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
        </section>
      }
    </div>
  `
})
export class NoDebtLetterValidatedPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly tenantService = inject(TenantService);
  private readonly portfolioService = inject(PortfolioService);
  private readonly noDebtLetterService = inject(NoDebtLetterValidatedService);

  tenants = signal<Tenant[]>([]);
  portfolios = signal<Portfolio[]>([]);
  subPortfolios = signal<SubPortfolio[]>([]);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  validationError = signal<NoDebtLetterValidationErrorResponse | null>(null);

  documento = '';
  selectedTenantId = 0;
  selectedPortfolioId = 0;
  selectedSubPortfolioId = 0;

  ngOnInit(): void {
    this.loadQueryParams();
    this.cargarTenants();

    if (this.selectedTenantId > 0) {
      this.loadPortfolios(this.selectedTenantId);
    }

    if (this.selectedPortfolioId > 0) {
      this.loadSubPortfolios(this.selectedPortfolioId);
    }
  }

  private loadQueryParams(): void {
    const params = this.route.snapshot.queryParamMap;
    this.documento = params.get('documento') || '';
    this.selectedTenantId = Number(params.get('tenantId')) || 0;
    this.selectedPortfolioId = Number(params.get('carteraId')) || 0;
    this.selectedSubPortfolioId = Number(params.get('subcarteraId')) || 0;
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
    this.clearMessages();

    if (this.selectedTenantId > 0) {
      this.loadPortfolios(this.selectedTenantId);
    }
  }

  onPortfolioChange(portfolioId: number): void {
    this.selectedPortfolioId = Number(portfolioId) || 0;
    this.selectedSubPortfolioId = 0;
    this.subPortfolios.set([]);
    this.clearMessages();

    if (this.selectedPortfolioId > 0) {
      this.loadSubPortfolios(this.selectedPortfolioId);
    }
  }

  private loadPortfolios(tenantId: number): void {
    this.portfolioService.getPortfoliosByTenant(tenantId).subscribe({
      next: (portfolios) => this.portfolios.set(portfolios),
      error: (error) => {
        console.error('Error cargando carteras:', error);
        this.errorMessage.set('No se pudieron cargar las carteras.');
      }
    });
  }

  private loadSubPortfolios(portfolioId: number): void {
    this.portfolioService.getSubPortfoliosByPortfolio(portfolioId).subscribe({
      next: (subPortfolios) => this.subPortfolios.set(subPortfolios),
      error: (error) => {
        console.error('Error cargando subcarteras:', error);
        this.errorMessage.set('No se pudieron cargar las subcarteras.');
      }
    });
  }

  onSubPortfolioChange(subPortfolioId: number): void {
    this.selectedSubPortfolioId = Number(subPortfolioId) || 0;
    this.clearMessages();
  }

  canGenerate(): boolean {
    return this.documento.trim().length > 0
      && this.selectedTenantId > 0
      && this.selectedPortfolioId > 0
      && this.selectedSubPortfolioId > 0;
  }

  generarCarta(): void {
    if (!this.canGenerate()) return;

    const documento = this.documento.trim();
    this.isLoading.set(true);
    this.clearMessages();

    this.noDebtLetterService.generateValidated({
      documento,
      tenantId: this.selectedTenantId,
      carteraId: this.selectedPortfolioId,
      subcarteraId: this.selectedSubPortfolioId
    }).subscribe({
      next: (response) => {
        const filename = this.getFilenameFromResponse(response.headers.get('content-disposition')) || `carta_no_adeudo_${documento}.pdf`;
        this.downloadFile(response.body as Blob, filename);
        this.successMessage.set('Carta de no adeudo generada correctamente.');
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error generando carta de no adeudo:', error);
        this.validationError.set(error.body || null);
        this.errorMessage.set(this.getValidationMessage(error.status, error.body));
        this.isLoading.set(false);
      }
    });
  }

  private getValidationMessage(status: number, body?: NoDebtLetterValidationErrorResponse): string {
    if (status === 409) {
      if (body?.motivo === 'CUOTAS_SIN_PAGO_REGISTRADO_SISTEMA') {
        return 'Existen cuotas sin pago registrado por el sistema.';
      }

      if (body?.motivo === 'PAGOS_PENDIENTES_VERIFICACION_BANCO') {
        return 'Existen pagos pendientes de verificación bancaria.';
      }

      return body?.mensaje || 'El cliente no cumple las condiciones para generar la carta.';
    }

    if (status === 404 && body?.code === 'PROMESA_PAGADA_NO_ENCONTRADA') {
      return body.message || 'No existe una promesa pagada elegible para generar la carta.';
    }

    return body?.mensaje || body?.message || 'No se pudo generar la carta de no adeudo.';
  }

  private getFilenameFromResponse(contentDisposition: string | null): string | null {
    if (!contentDisposition) return null;

    const filenameMatch = /filename\*?=(?:UTF-8'')?"?([^";]+)"?/i.exec(contentDisposition);
    return filenameMatch?.[1] ? decodeURIComponent(filenameMatch[1]) : null;
  }

  private downloadFile(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  private clearMessages(): void {
    this.errorMessage.set(null);
    this.successMessage.set(null);
    this.validationError.set(null);
  }
}
