import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { firstValueFrom } from 'rxjs';
import * as XLSX from 'xlsx';
import { PortfolioService } from '../../../maintenance/services/portfolio.service';
import { TenantService } from '../../../maintenance/services/tenant.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { NotificationsComponent } from '../../../shared/components/notifications/notifications.component';
import { SubPortfolio, Portfolio } from '../../../maintenance/models/portfolio.model';
import { Tenant } from '../../../maintenance/models/tenant.model';
import {
  PhoneLoadService,
  PhoneRow,
  PhoneBulkImportResult
} from '../../services/phone-load.service';

@Component({
  selector: 'app-phone-load',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, NotificationsComponent],
  template: `
    <app-notifications></app-notifications>

    @if (isLoading()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm"></div>
        <div class="relative bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-2xl border border-gray-200 dark:border-slate-700 max-w-md w-full mx-4">
          <div class="flex flex-col items-center gap-6">
            <div class="relative">
              <div class="w-16 h-16 border-4 border-gray-200 dark:border-slate-600 rounded-full"></div>
              <div class="absolute top-0 left-0 w-16 h-16 border-4 border-purple-500 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <div class="text-center">
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Procesando carga...</h3>
              <p class="text-gray-500 dark:text-gray-400 text-sm">Por favor espere mientras se insertan los teléfonos</p>
            </div>
            <div class="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
              <div class="bg-gradient-to-r from-purple-500 to-pink-400 h-full rounded-full animate-pulse" style="width: 100%"></div>
            </div>
          </div>
        </div>
      </div>
    }

    <div class="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-950 dark:to-slate-900 p-4 md:p-6">
      <div class="max-w-5xl mx-auto">

        <!-- Header -->
        <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur rounded-xl p-4 shadow-lg border border-gray-200 dark:border-slate-800 mb-6">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-md">
              <lucide-angular name="phone-incoming" [size]="20" class="text-white"></lucide-angular>
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900 dark:text-white">Carga de Teléfonos</h1>
              <p class="text-sm text-gray-500 dark:text-gray-400">Importación masiva de teléfonos a metodos_contacto</p>
            </div>
          </div>
        </div>

        <!-- Selectores en Cascada -->
        <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur rounded-xl p-4 shadow-lg border border-gray-200 dark:border-slate-800 mb-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Proveedor -->
            <div>
              <label class="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">
                <lucide-angular name="building-2" [size]="14" class="inline mr-1"></lucide-angular>
                Proveedor
              </label>
              <select [(ngModel)]="selectedTenantId"
                      (ngModelChange)="onTenantChange($event)"
                      class="w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all">
                <option [value]="0">Seleccione un proveedor...</option>
                @for (tenant of tenants(); track tenant.id) {
                  <option [value]="tenant.id">{{ tenant.tenantCode }} - {{ tenant.tenantName }}</option>
                }
              </select>
            </div>

            <!-- Cartera -->
            <div>
              <label class="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">
                <lucide-angular name="folder" [size]="14" class="inline mr-1"></lucide-angular>
                Cartera
              </label>
              <select [(ngModel)]="selectedPortfolioId"
                      (ngModelChange)="onPortfolioChange($event)"
                      [disabled]="selectedTenantId === 0"
                      class="w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                <option [value]="0">Seleccione una cartera...</option>
                @for (portfolio of portfolios(); track portfolio.id) {
                  <option [value]="portfolio.id">{{ portfolio.portfolioCode }} - {{ portfolio.portfolioName }}</option>
                }
              </select>
            </div>

            <!-- Subcartera -->
            <div>
              <label class="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">
                <lucide-angular name="folder-tree" [size]="14" class="inline mr-1"></lucide-angular>
                Subcartera
              </label>
              <select [(ngModel)]="selectedSubPortfolioId"
                      (ngModelChange)="onSubPortfolioChange($event)"
                      [disabled]="selectedPortfolioId === 0"
                      class="w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                <option [value]="0">Seleccione una subcartera...</option>
                @for (sp of subPortfolios(); track sp.id) {
                  <option [value]="sp.id">{{ sp.subPortfolioCode }} - {{ sp.subPortfolioName }}</option>
                }
              </select>
            </div>
          </div>
        </div>

        @if (selectedSubPortfolioId > 0) {
          <!-- Panel de carga de archivo -->
          <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur rounded-xl p-4 shadow-lg border border-gray-200 dark:border-slate-800 mb-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-sm font-semibold text-gray-600 dark:text-gray-300">
                <lucide-angular name="upload" [size]="14" class="inline mr-1"></lucide-angular>
                Archivo de teléfonos
              </h3>
              <button (click)="downloadExample()"
                      class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-purple-600 dark:text-purple-400 border border-purple-300 dark:border-purple-600 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
                <lucide-angular name="download" [size]="13"></lucide-angular>
                Descargar ejemplo
              </button>
            </div>

            <!-- Info de formato -->
            <div class="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg text-xs text-blue-700 dark:text-blue-300">
              <lucide-angular name="info" [size]="13" class="inline mr-1"></lucide-angular>
              El archivo debe contener las columnas <strong>DOCUMENTO</strong> y <strong>TELEFONO</strong> (formato: solo dígitos, entre 7 y 15 caracteres).
              Opcionalmente: <strong>FECHA_ACTIVACION</strong> (formato YYYY-MM-DD o DD/MM/YYYY) y <strong>OPERADOR</strong>.
              Para teléfonos con cero inicial, formatee la columna TELEFONO como <strong>texto</strong> en Excel (de lo contrario el cero se pierde).
              Se aceptan archivos <strong>.xlsx</strong>, <strong>.xls</strong> y <strong>.csv</strong>.
            </div>

            <!-- Zona de carga -->
            <div class="flex flex-col sm:flex-row gap-3 items-start">
              <label class="flex-1 flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all
                            border-gray-300 dark:border-slate-600 hover:border-purple-400 dark:hover:border-purple-500 hover:bg-purple-50/50 dark:hover:bg-purple-900/10"
                     [class.border-purple-400]="parsedRows().length > 0"
                     [class.bg-purple-50]="parsedRows().length > 0"
                     [class.dark:bg-purple-900/10]="parsedRows().length > 0"
                     [class.border-red-400]="parseError()">
                <input #fileInput
                       type="file"
                       class="hidden"
                       accept=".csv,.xlsx,.xls"
                       (change)="onFileSelected($event)">

                @if (parsedRows().length > 0 && !parseError()) {
                  <lucide-angular name="file-check-2" [size]="28" class="text-purple-500"></lucide-angular>
                  <span class="text-sm font-semibold text-purple-700 dark:text-purple-300">{{ selectedFileName() }}</span>
                  <span class="text-xs text-purple-500 dark:text-purple-400">{{ parsedRows().length }} fila(s) detectada(s)</span>
                  <span class="text-xs text-gray-400 dark:text-gray-500">Haz clic para cambiar el archivo</span>
                } @else if (parseError()) {
                  <lucide-angular name="file-x-2" [size]="28" class="text-red-500"></lucide-angular>
                  <span class="text-sm font-semibold text-red-600 dark:text-red-400">Error en el archivo</span>
                  <span class="text-xs text-gray-400 dark:text-gray-500">Haz clic para seleccionar otro</span>
                } @else {
                  <lucide-angular name="upload-cloud" [size]="28" class="text-gray-400 dark:text-gray-500"></lucide-angular>
                  <span class="text-sm font-medium text-gray-600 dark:text-gray-300">Haz clic para seleccionar el archivo</span>
                  <span class="text-xs text-gray-400 dark:text-gray-500">.xlsx, .xls, .csv</span>
                }
              </label>
            </div>

            <!-- Error fatal de parseo -->
            @if (parseError()) {
              <div class="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg">
                <div class="flex items-start gap-2">
                  <lucide-angular name="circle-alert" [size]="16" class="text-red-500 mt-0.5 flex-shrink-0"></lucide-angular>
                  <div>
                    <p class="text-sm font-semibold text-red-700 dark:text-red-300">Error en el archivo</p>
                    <p class="text-xs text-red-600 dark:text-red-400 mt-0.5">{{ parseError() }}</p>
                  </div>
                </div>
              </div>
            }
          </div>

          <!-- Botón Procesar -->
          <div class="flex justify-end mb-6">
            <button (click)="onSubmit()"
                    [disabled]="!canSubmit()"
                    class="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold rounded-xl shadow-md
                           hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-purple-600 disabled:hover:to-pink-600">
              @if (isLoading()) {
                <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Procesando...
              } @else {
                <lucide-angular name="play" [size]="16"></lucide-angular>
                Procesar {{ parsedRows().length > 0 ? '(' + parsedRows().length + ' filas)' : '' }}
              }
            </button>
          </div>
        }

        <!-- Resultados -->
        @if (result()) {
          <div class="space-y-4">
            <!-- Tarjetas resumen -->
            <div class="grid grid-cols-2 md:grid-cols-5 gap-3">
              <div class="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-slate-700 shadow-sm">
                <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Total filas</p>
                <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ result()!.totalRows }}</p>
              </div>
              <div class="bg-white dark:bg-slate-800 rounded-xl p-4 border border-emerald-200 dark:border-emerald-700 shadow-sm">
                <p class="text-xs text-emerald-600 dark:text-emerald-400 mb-1">Insertados</p>
                <p class="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{{ result()!.insertedCount }}</p>
              </div>
              <div class="bg-white dark:bg-slate-800 rounded-xl p-4 border border-blue-200 dark:border-blue-700 shadow-sm">
                <p class="text-xs text-blue-600 dark:text-blue-400 mb-1">Actualizados</p>
                <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ result()!.updatedCount }}</p>
              </div>
              <div class="bg-white dark:bg-slate-800 rounded-xl p-4 border border-amber-200 dark:border-amber-700 shadow-sm">
                <p class="text-xs text-amber-600 dark:text-amber-400 mb-1">Omitidos (duplicados)</p>
                <p class="text-2xl font-bold text-amber-600 dark:text-amber-400">{{ result()!.skippedCount }}</p>
              </div>
              <div class="bg-white dark:bg-slate-800 rounded-xl p-4 border border-red-200 dark:border-red-700 shadow-sm">
                <p class="text-xs text-red-600 dark:text-red-400 mb-1">Errores</p>
                <p class="text-2xl font-bold text-red-600 dark:text-red-400">{{ result()!.errorCount }}</p>
              </div>
            </div>

            <!-- Banner: archivo con errores, nada insertado -->
            @if (result()!.errorCount > 0) {
              <div class="flex items-start gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                <lucide-angular name="circle-alert" [size]="18" class="text-red-500 shrink-0 mt-0.5"></lucide-angular>
                <div>
                  <p class="text-sm font-semibold text-red-700 dark:text-red-300">No se insertó ningún teléfono</p>
                  <p class="text-xs text-red-600 dark:text-red-400 mt-0.5">
                    El archivo contiene {{ result()!.errorCount }} error(es). Corrija los datos indicados y vuelva a subir el archivo.
                  </p>
                </div>
              </div>
            }

            <!-- Tabla de errores -->
            @if (result()!.rowErrors.length > 0) {
              <div class="bg-white dark:bg-slate-800 rounded-xl border border-red-200 dark:border-red-800 shadow-sm overflow-hidden">
                <button (click)="showErrors.set(!showErrors())"
                        class="w-full flex items-center justify-between p-4 text-left hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                  <div class="flex items-center gap-2">
                    <lucide-angular name="circle-x" [size]="16" class="text-red-500"></lucide-angular>
                    <span class="text-sm font-semibold text-red-700 dark:text-red-300">
                      Filas con errores ({{ result()!.rowErrors.length }})
                    </span>
                  </div>
                  <lucide-angular [name]="showErrors() ? 'chevron-up' : 'chevron-down'" [size]="16" class="text-gray-400"></lucide-angular>
                </button>
                @if (showErrors()) {
                  <div class="overflow-x-auto">
                    <table class="w-full text-xs">
                      <thead class="bg-red-50 dark:bg-red-900/20">
                        <tr>
                          <th class="px-3 py-2 text-left font-semibold text-red-700 dark:text-red-300">Fila</th>
                          <th class="px-3 py-2 text-left font-semibold text-red-700 dark:text-red-300">Documento</th>
                          <th class="px-3 py-2 text-left font-semibold text-red-700 dark:text-red-300">Teléfono</th>
                          <th class="px-3 py-2 text-left font-semibold text-red-700 dark:text-red-300">Motivo</th>
                        </tr>
                      </thead>
                      <tbody>
                        @for (err of pagedErrors(); track err.rowNumber) {
                          <tr class="border-t border-red-100 dark:border-red-900/30 hover:bg-red-50/50 dark:hover:bg-red-900/10">
                            <td class="px-3 py-2 text-gray-700 dark:text-gray-300 font-mono">{{ err.rowNumber }}</td>
                            <td class="px-3 py-2 text-gray-700 dark:text-gray-300 font-mono">{{ err.documento || '—' }}</td>
                            <td class="px-3 py-2 text-gray-700 dark:text-gray-300 font-mono">{{ err.telefono || '—' }}</td>
                            <td class="px-3 py-2 text-red-600 dark:text-red-400">{{ err.reason }}</td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>

                  <!-- Paginación -->
                  @if (errorTotalPages() > 1) {
                    <div class="flex items-center justify-between gap-2 px-4 py-3 border-t border-red-100 dark:border-red-900/30 text-xs">
                      <span class="text-gray-500 dark:text-gray-400">
                        Mostrando {{ errorRangeStart() }}–{{ errorRangeEnd() }} de {{ result()!.rowErrors.length }}
                      </span>
                      <div class="flex items-center gap-1">
                        <button (click)="errorPage.set(0)" [disabled]="errorPage() === 0"
                                class="px-2 py-1 rounded border border-gray-300 dark:border-slate-600 text-gray-600 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-slate-700">
                          «
                        </button>
                        <button (click)="errorPage.set(errorPage() - 1)" [disabled]="errorPage() === 0"
                                class="px-2 py-1 rounded border border-gray-300 dark:border-slate-600 text-gray-600 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-slate-700">
                          ‹
                        </button>
                        <span class="px-2 text-gray-600 dark:text-gray-300">{{ errorPage() + 1 }} / {{ errorTotalPages() }}</span>
                        <button (click)="errorPage.set(errorPage() + 1)" [disabled]="errorPage() >= errorTotalPages() - 1"
                                class="px-2 py-1 rounded border border-gray-300 dark:border-slate-600 text-gray-600 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-slate-700">
                          ›
                        </button>
                        <button (click)="errorPage.set(errorTotalPages() - 1)" [disabled]="errorPage() >= errorTotalPages() - 1"
                                class="px-2 py-1 rounded border border-gray-300 dark:border-slate-600 text-gray-600 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-slate-700">
                          »
                        </button>
                      </div>
                    </div>
                  }
                }
              </div>
            }

            <!-- Nota: el detalle por fila de actualizados/omitidos no se lista
                 (el upsert masivo en BD solo devuelve conteos). -->

          </div>
        }

      </div>
    </div>
  `,
  styles: []
})
export class PhoneLoadComponent implements OnInit {
  private notificationService = inject(NotificationService);

  tenants = signal<Tenant[]>([]);
  portfolios = signal<Portfolio[]>([]);
  subPortfolios = signal<SubPortfolio[]>([]);

  selectedTenantId = 0;
  selectedPortfolioId = 0;
  selectedSubPortfolioId = 0;

  parsedRows = signal<PhoneRow[]>([]);
  parseError = signal<string | null>(null);
  selectedFileName = signal<string>('');
  isLoading = signal(false);
  result = signal<PhoneBulkImportResult | null>(null);

  showErrors = signal(true);

  // Paginación de la tabla de errores
  errorPage = signal(0);
  readonly errorPageSize = 50;
  errorTotalPages = computed(() =>
    Math.ceil((this.result()?.rowErrors.length ?? 0) / this.errorPageSize)
  );
  pagedErrors = computed(() => {
    const errs = this.result()?.rowErrors ?? [];
    const start = this.errorPage() * this.errorPageSize;
    return errs.slice(start, start + this.errorPageSize);
  });
  errorRangeStart = computed(() =>
    (this.result()?.rowErrors.length ?? 0) === 0 ? 0 : this.errorPage() * this.errorPageSize + 1
  );
  errorRangeEnd = computed(() =>
    Math.min((this.errorPage() + 1) * this.errorPageSize, this.result()?.rowErrors.length ?? 0)
  );

  canSubmit = computed(() =>
    this.selectedSubPortfolioId > 0 &&
    this.parsedRows().length > 0 &&
    !this.parseError() &&
    !this.isLoading()
  );

  constructor(
    private tenantService: TenantService,
    private portfolioService: PortfolioService,
    private phoneLoadService: PhoneLoadService
  ) {}

  ngOnInit() {
    this.loadTenants();
  }

  loadTenants() {
    this.tenantService.getAllTenants().subscribe({
      next: (tenants) => this.tenants.set(tenants),
      error: () => this.notificationService.error('Error al cargar proveedores')
    });
  }

  onTenantChange(tenantId: number) {
    this.selectedTenantId = tenantId;
    this.selectedPortfolioId = 0;
    this.selectedSubPortfolioId = 0;
    this.portfolios.set([]);
    this.subPortfolios.set([]);
    this.resetFileState();

    if (tenantId > 0) {
      this.portfolioService.getPortfoliosByTenant(tenantId).subscribe({
        next: (portfolios) => this.portfolios.set(portfolios),
        error: () => this.notificationService.error('Error al cargar carteras')
      });
    }
  }

  onPortfolioChange(portfolioId: number) {
    this.selectedPortfolioId = portfolioId;
    this.selectedSubPortfolioId = 0;
    this.subPortfolios.set([]);
    this.resetFileState();

    if (portfolioId > 0) {
      this.portfolioService.getSubPortfoliosByPortfolio(portfolioId).subscribe({
        next: (subPortfolios) => this.subPortfolios.set(subPortfolios),
        error: () => this.notificationService.error('Error al cargar subcarteras')
      });
    }
  }

  onSubPortfolioChange(subPortfolioId: number) {
    this.selectedSubPortfolioId = subPortfolioId;
    this.resetFileState();
  }

  resetFileState() {
    this.parsedRows.set([]);
    this.parseError.set(null);
    this.selectedFileName.set('');
    this.result.set(null);
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.parsedRows.set([]);
    this.parseError.set(null);
    this.result.set(null);
    this.selectedFileName.set(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target!.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array', cellDates: true });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rawRows: Record<string, unknown>[] = XLSX.utils.sheet_to_json(sheet, { defval: '' });

        if (rawRows.length === 0) {
          this.parseError.set('No hay datos para procesar. El archivo está vacío o solo tiene la fila de encabezado.');
          return;
        }

        const keys = Object.keys(rawRows[0]);
        const normalize = (k: string) => k.trim().toUpperCase();
        const docKey = keys.find(k => normalize(k) === 'DOCUMENTO');
        const telKey = keys.find(k => normalize(k) === 'TELEFONO');
        const fechaKey = keys.find(k => normalize(k) === 'FECHA_ACTIVACION');
        const operadorKey = keys.find(k => normalize(k) === 'OPERADOR');

        if (!docKey || !telKey) {
          const missing = [];
          if (!docKey) missing.push('DOCUMENTO');
          if (!telKey) missing.push('TELEFONO');
          this.parseError.set(
            `Columnas requeridas no encontradas: ${missing.join(', ')}. ` +
            `Columnas detectadas en el archivo: ${keys.join(', ')}`
          );
          return;
        }

        const rows: PhoneRow[] = rawRows
          .map((row, index) => ({
            rowNumber: index + 2,
            documento: String(row[docKey] ?? '').trim(),
            telefono: String(row[telKey] ?? '').trim(),
            fechaActivacion: fechaKey ? this.normalizarFecha(row[fechaKey]) : '',
            operador: operadorKey ? String(row[operadorKey] ?? '').trim() : ''
          }))
          .filter(r => r.documento !== '' || r.telefono !== '');

        if (rows.length === 0) {
          this.parseError.set('No hay datos para procesar. Todas las filas están vacías.');
          return;
        }

        this.parsedRows.set(rows);
        this.notificationService.success(`Archivo cargado: ${rows.length} fila(s) detectada(s)`);
      } catch {
        this.parseError.set('Error al leer el archivo. Verifique que sea un archivo Excel o CSV válido.');
      }
    };

    reader.readAsArrayBuffer(file);
    (event.target as HTMLInputElement).value = '';
  }

  async onSubmit() {
    if (!this.canSubmit()) return;
    this.isLoading.set(true);
    this.result.set(null);
    this.showErrors.set(true);
    this.errorPage.set(0);

    try {
      const result = await firstValueFrom(
        this.phoneLoadService.importPhones({
          idInquilino: this.selectedTenantId,
          idCartera: this.selectedPortfolioId,
          idSubcartera: this.selectedSubPortfolioId,
          rows: this.parsedRows()
        })
      );
      this.result.set(result);

      if (result.errorCount > 0) {
        this.notificationService.error(
          `El archivo tiene ${result.errorCount} error(es). Corrija los datos y vuelva a subir el archivo.`
        );
      } else if (result.updatedCount === 0 && result.skippedCount === 0) {
        this.notificationService.success(`${result.insertedCount} teléfono(s) insertado(s) correctamente`);
      } else {
        const parts: string[] = [];
        if (result.insertedCount > 0) parts.push(`${result.insertedCount} insertado(s)`);
        if (result.updatedCount > 0) parts.push(`${result.updatedCount} actualizado(s)`);
        if (result.skippedCount > 0) parts.push(`${result.skippedCount} omitido(s)`);
        this.notificationService.warning(`Proceso completado: ${parts.join(', ')}`);
      }
    } catch {
      this.notificationService.error('Error al procesar la carga de teléfonos. Intente nuevamente.');
    } finally {
      this.isLoading.set(false);
    }
  }

  downloadExample() {
    const ws = XLSX.utils.aoa_to_sheet([
      ['DOCUMENTO', 'TELEFONO', 'FECHA_ACTIVACION', 'OPERADOR'],
      ['12345678', '987654321', '2026-01-15', 'Claro'],
      ['87654321', '912345678', '2026-03-20', 'Movistar']
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Telefonos');
    XLSX.writeFile(wb, 'ejemplo_carga_telefonos.xlsx');
  }

  private normalizarFecha(val: unknown): string {
    if (val === null || val === undefined || val === '') return '';
    if (val instanceof Date) {
      // Usar componentes locales: toISOString() convierte a UTC y en zonas
      // negativas (Perú UTC-5) retrocede la fecha un día.
      const y = val.getFullYear();
      const m = String(val.getMonth() + 1).padStart(2, '0');
      const d = String(val.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    }
    if (typeof val === 'number') {
      // Excel serial date (días desde 1899-12-30); cálculo en UTC consistente
      const date = new Date(Date.UTC(1899, 11, 30) + val * 86400000);
      const y = date.getUTCFullYear();
      const m = String(date.getUTCMonth() + 1).padStart(2, '0');
      const d = String(date.getUTCDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    }
    return String(val).trim();
  }
}
