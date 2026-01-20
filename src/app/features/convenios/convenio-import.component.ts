import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { ConvenioImportService, ConvenioImportResult, ConvenioImportado } from './convenio-import.service';
import { TenantService } from '../../maintenance/services/tenant.service';
import { PortfolioService } from '../../maintenance/services/portfolio.service';
import { Tenant } from '../../maintenance/models/tenant.model';
import { Portfolio, SubPortfolio } from '../../maintenance/models/portfolio.model';
import { NotificationService } from '../../shared/services/notification.service';
import { NotificationsComponent } from '../../shared/components/notifications/notifications.component';

@Component({
  selector: 'app-convenio-import',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, NotificationsComponent],
  template: `
    <app-notifications></app-notifications>

    <!-- Loading Overlay -->
    @if (isLoading()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        <div class="relative bg-slate-800 rounded-2xl p-8 shadow-2xl border border-slate-700 max-w-md w-full mx-4">
          <div class="flex flex-col items-center gap-6">
            <div class="relative">
              <div class="w-16 h-16 border-4 border-slate-600 rounded-full"></div>
              <div class="absolute top-0 left-0 w-16 h-16 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <div class="text-center">
              <h3 class="text-xl font-bold text-white mb-2">Importando Convenios</h3>
              <p class="text-gray-400 text-sm">Por favor espere...</p>
            </div>
          </div>
        </div>
      </div>
    }

    <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div class="max-w-5xl mx-auto">
        <!-- Header -->
        <div class="mb-6">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <lucide-angular name="file-spreadsheet" [size]="24" class="text-white"></lucide-angular>
            </div>
            <div>
              <h1 class="text-2xl font-bold text-white">Importar Convenios</h1>
              <p class="text-sm text-gray-400">Carga de convenios de pago desde archivo Excel</p>
            </div>
          </div>
        </div>

        <!-- Selectores en Cascada -->
        <div class="bg-slate-900/80 backdrop-blur rounded-xl p-5 shadow-lg border border-slate-800 mb-6">
          <h3 class="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
            <lucide-angular name="sliders" [size]="16"></lucide-angular>
            Configuración de Importación
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Proveedor -->
            <div>
              <label class="block text-xs font-semibold text-gray-400 mb-1.5">
                Proveedor
              </label>
              <select [(ngModel)]="selectedTenantId"
                      (ngModelChange)="onTenantChange($event)"
                      class="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all">
                <option [value]="0">Seleccione un proveedor...</option>
                @for (tenant of tenants(); track tenant.id) {
                  <option [value]="tenant.id">{{ tenant.tenantCode }} - {{ tenant.tenantName }}</option>
                }
              </select>
            </div>

            <!-- Cartera -->
            <div>
              <label class="block text-xs font-semibold text-gray-400 mb-1.5">
                Cartera
              </label>
              <select [(ngModel)]="selectedPortfolioId"
                      (ngModelChange)="onPortfolioChange($event)"
                      [disabled]="selectedTenantId === 0"
                      class="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                <option [value]="0">Seleccione una cartera...</option>
                @for (portfolio of portfolios(); track portfolio.id) {
                  <option [value]="portfolio.id">{{ portfolio.portfolioCode }} - {{ portfolio.portfolioName }}</option>
                }
              </select>
            </div>

            <!-- Subcartera -->
            <div>
              <label class="block text-xs font-semibold text-gray-400 mb-1.5">
                Subcartera
              </label>
              <select [(ngModel)]="selectedSubPortfolioId"
                      [disabled]="selectedPortfolioId === 0"
                      class="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                <option [value]="0">Seleccione una subcartera...</option>
                @for (sp of subPortfolios(); track sp.id) {
                  <option [value]="sp.id">{{ sp.subPortfolioCode }} - {{ sp.subPortfolioName }}</option>
                }
              </select>
            </div>
          </div>
        </div>

        @if (selectedSubPortfolioId > 0) {
          <!-- Área de Carga -->
          <div class="bg-slate-900/80 backdrop-blur rounded-xl shadow-lg border border-slate-800 overflow-hidden mb-6">
            <div class="p-5 border-b border-slate-800">
              <h2 class="text-lg font-bold text-white flex items-center gap-2">
                <lucide-angular name="upload" [size]="20" class="text-violet-400"></lucide-angular>
                Cargar Archivo Excel
              </h2>
              <p class="text-sm text-gray-400 mt-1">
                El archivo debe contener una hoja "CONVENIOS" con las columnas requeridas
              </p>
            </div>

            <div class="p-5">
              @if (!selectedFile()) {
                <label class="border-2 border-dashed border-slate-700 rounded-xl p-10 text-center cursor-pointer hover:border-violet-500 hover:bg-slate-800/50 transition-all block">
                  <div class="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <lucide-angular name="upload-cloud" [size]="32" class="text-violet-400"></lucide-angular>
                  </div>
                  <h3 class="text-white font-semibold mb-2">Haz clic o arrastra el archivo Excel</h3>
                  <p class="text-gray-500 text-sm">Archivo .xlsx con hoja "CONVENIOS"</p>
                  <input type="file"
                         accept=".xlsx,.xls"
                         (change)="onFileSelected($event)"
                         class="hidden">
                </label>
              } @else {
                <div class="bg-slate-800 rounded-xl p-4 border border-violet-500/50">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <div class="w-12 h-12 bg-violet-600/20 rounded-lg flex items-center justify-center">
                        <lucide-angular name="file-spreadsheet" [size]="24" class="text-violet-400"></lucide-angular>
                      </div>
                      <div>
                        <p class="font-medium text-white">{{ selectedFile()?.name }}</p>
                        <p class="text-xs text-gray-400">{{ formatFileSize(selectedFile()?.size || 0) }}</p>
                      </div>
                    </div>
                    <div class="flex items-center gap-2">
                      <button (click)="clearFile()"
                              class="p-2 text-gray-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-all cursor-pointer">
                        <lucide-angular name="x" [size]="20"></lucide-angular>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Botón de Procesar -->
                <div class="mt-6 flex justify-end">
                  <button (click)="importarConvenios()"
                          class="px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-lg hover:from-violet-600 hover:to-purple-700 transition-all font-semibold cursor-pointer flex items-center gap-2 shadow-lg shadow-violet-500/20">
                    <lucide-angular name="upload" [size]="18"></lucide-angular>
                    Importar Convenios
                  </button>
                </div>
              }
            </div>
          </div>

          <!-- Columnas Requeridas -->
          <div class="bg-slate-900/80 backdrop-blur rounded-xl p-5 shadow-lg border border-slate-800 mb-6">
            <h3 class="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
              <lucide-angular name="info" [size]="16" class="text-blue-400"></lucide-angular>
              Columnas Requeridas en el Excel
            </h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div class="bg-slate-800 rounded-lg p-3">
                <p class="text-violet-400 font-mono font-semibold">IDENTITY_CODE</p>
                <p class="text-gray-500">Código de identificación</p>
              </div>
              <div class="bg-slate-800 rounded-lg p-3">
                <p class="text-violet-400 font-mono font-semibold">PERIODO_CONVENIO</p>
                <p class="text-gray-500">Mes inicio (YYYYMM)</p>
              </div>
              <div class="bg-slate-800 rounded-lg p-3">
                <p class="text-violet-400 font-mono font-semibold">CUOTA_INICIAL_CONVENIO</p>
                <p class="text-gray-500">Monto cuota inicial</p>
              </div>
              <div class="bg-slate-800 rounded-lg p-3">
                <p class="text-violet-400 font-mono font-semibold">MONTO_CUOTA</p>
                <p class="text-gray-500">Monto cuotas regulares</p>
              </div>
              <div class="bg-slate-800 rounded-lg p-3">
                <p class="text-violet-400 font-mono font-semibold">NUMERO_CUOTAS</p>
                <p class="text-gray-500">Cantidad de cuotas</p>
              </div>
              <div class="bg-slate-800 rounded-lg p-3">
                <p class="text-violet-400 font-mono font-semibold">MONTO_CONVENIO</p>
                <p class="text-gray-500">Monto total</p>
              </div>
              <div class="bg-slate-800 rounded-lg p-3">
                <p class="text-violet-400 font-mono font-semibold">PAGO_TOTALES</p>
                <p class="text-gray-500">Monto ya pagado</p>
              </div>
              <div class="bg-slate-800 rounded-lg p-3">
                <p class="text-violet-400 font-mono font-semibold">FECHA_PAGO</p>
                <p class="text-gray-500">Día del mes</p>
              </div>
            </div>
          </div>
        }

        <!-- Resultado de la Importación -->
        @if (importResult()) {
          <div class="bg-slate-900/80 backdrop-blur rounded-xl shadow-lg border overflow-hidden"
               [class.border-emerald-500/50]="importResult()?.exitoso"
               [class.border-red-500/50]="!importResult()?.exitoso">

            <!-- Header del resultado -->
            <div class="p-5 border-b border-slate-800">
              <div class="flex items-center gap-3">
                @if (importResult()?.exitoso) {
                  <div class="w-12 h-12 bg-emerald-600/20 rounded-lg flex items-center justify-center">
                    <lucide-angular name="check-circle" [size]="28" class="text-emerald-400"></lucide-angular>
                  </div>
                  <div>
                    <h3 class="text-lg font-bold text-emerald-400">Importación Exitosa</h3>
                    <p class="text-gray-400 text-sm">{{ importResult()?.mensaje }}</p>
                  </div>
                } @else {
                  <div class="w-12 h-12 bg-red-600/20 rounded-lg flex items-center justify-center">
                    <lucide-angular name="alert-triangle" [size]="28" class="text-red-400"></lucide-angular>
                  </div>
                  <div>
                    <h3 class="text-lg font-bold text-red-400">Error en Importación</h3>
                    <p class="text-gray-400 text-sm">{{ importResult()?.mensaje }}</p>
                  </div>
                }
              </div>
            </div>

            <!-- Estadísticas -->
            <div class="p-5">
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div class="bg-slate-800 rounded-lg p-4 text-center">
                  <p class="text-3xl font-bold text-white">{{ importResult()?.totalRegistros || 0 }}</p>
                  <p class="text-xs text-gray-400 mt-1">Total Registros</p>
                </div>
                <div class="bg-slate-800 rounded-lg p-4 text-center">
                  <p class="text-3xl font-bold text-emerald-400">{{ importResult()?.conveniosNuevos || 0 }}</p>
                  <p class="text-xs text-gray-400 mt-1">Nuevos Creados</p>
                </div>
                <div class="bg-slate-800 rounded-lg p-4 text-center">
                  <p class="text-3xl font-bold text-amber-400">{{ importResult()?.conveniosExistentes || 0 }}</p>
                  <p class="text-xs text-gray-400 mt-1">Ya Existentes</p>
                </div>
                <div class="bg-slate-800 rounded-lg p-4 text-center">
                  <p class="text-3xl font-bold" [class.text-red-400]="importResult()?.errores" [class.text-gray-400]="!importResult()?.errores">
                    {{ importResult()?.errores || 0 }}
                  </p>
                  <p class="text-xs text-gray-400 mt-1">Errores</p>
                </div>
              </div>

              <!-- Lista de convenios importados -->
              @if ((importResult()?.conveniosImportados?.length ?? 0) > 0) {
                <div class="mb-6">
                  <h4 class="text-sm font-semibold text-gray-300 mb-3">Convenios Importados</h4>
                  <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                      <thead>
                        <tr class="text-left text-gray-400 text-xs uppercase border-b border-slate-700">
                          <th class="p-3">Documento</th>
                          <th class="p-3">Monto Total</th>
                          <th class="p-3">Cuotas</th>
                          <th class="p-3">Pagado</th>
                          <th class="p-3">Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        @for (convenio of importResult()?.conveniosImportados; track convenio.documento) {
                          <tr class="border-b border-slate-800 hover:bg-slate-800/50">
                            <td class="p-3">
                              <span class="font-mono text-white">{{ convenio.documento }}</span>
                            </td>
                            <td class="p-3 text-white">
                              S/ {{ convenio.montoConvenio | number:'1.2-2' }}
                            </td>
                            <td class="p-3">
                              <span class="text-emerald-400">{{ convenio.cuotasPagadas }}</span>
                              <span class="text-gray-500">/</span>
                              <span class="text-white">{{ convenio.numeroCuotas }}</span>
                            </td>
                            <td class="p-3 text-cyan-400">
                              S/ {{ convenio.montoPagado | number:'1.2-2' }}
                            </td>
                            <td class="p-3">
                              @if (convenio.cuotasPendientes === 0) {
                                <span class="px-2 py-1 bg-emerald-900/50 text-emerald-400 rounded-full text-xs">Pagado</span>
                              } @else {
                                <span class="px-2 py-1 bg-amber-900/50 text-amber-400 rounded-full text-xs">
                                  {{ convenio.cuotasPendientes }} pendiente(s)
                                </span>
                              }
                            </td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>
                </div>
              }

              <!-- Errores -->
              @if ((importResult()?.detalleErrores?.length ?? 0) > 0) {
                <div class="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                  <h4 class="text-sm font-semibold text-red-400 mb-2 flex items-center gap-2">
                    <lucide-angular name="alert-circle" [size]="16"></lucide-angular>
                    Detalle de Errores
                  </h4>
                  <div class="max-h-40 overflow-y-auto space-y-1">
                    @for (error of importResult()?.detalleErrores; track $index) {
                      <p class="text-xs text-gray-300 font-mono bg-slate-800/50 px-3 py-2 rounded">
                        {{ error }}
                      </p>
                    }
                  </div>
                </div>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ConvenioImportComponent implements OnInit {
  private notificationService = inject(NotificationService);

  // Signals
  tenants = signal<Tenant[]>([]);
  portfolios = signal<Portfolio[]>([]);
  subPortfolios = signal<SubPortfolio[]>([]);

  selectedTenantId = 0;
  selectedPortfolioId = 0;
  selectedSubPortfolioId = 0;

  selectedFile = signal<File | null>(null);
  isLoading = signal(false);
  importResult = signal<ConvenioImportResult | null>(null);

  constructor(
    private tenantService: TenantService,
    private portfolioService: PortfolioService,
    private convenioService: ConvenioImportService
  ) {}

  ngOnInit(): void {
    this.loadTenants();
  }

  loadTenants(): void {
    this.tenantService.getAllTenants().subscribe({
      next: (tenants) => this.tenants.set(tenants),
      error: (err) => console.error('Error loading tenants:', err)
    });
  }

  onTenantChange(tenantId: number): void {
    this.selectedTenantId = tenantId;
    this.selectedPortfolioId = 0;
    this.selectedSubPortfolioId = 0;
    this.portfolios.set([]);
    this.subPortfolios.set([]);
    this.clearState();

    if (tenantId > 0) {
      this.portfolioService.getPortfoliosByTenant(tenantId).subscribe({
        next: (portfolios) => this.portfolios.set(portfolios),
        error: (err) => console.error('Error loading portfolios:', err)
      });
    }
  }

  onPortfolioChange(portfolioId: number): void {
    this.selectedPortfolioId = portfolioId;
    this.selectedSubPortfolioId = 0;
    this.subPortfolios.set([]);
    this.clearState();

    if (portfolioId > 0) {
      this.portfolioService.getSubPortfoliosByPortfolio(portfolioId).subscribe({
        next: (subPortfolios) => this.subPortfolios.set(subPortfolios),
        error: (err) => console.error('Error loading subportfolios:', err)
      });
    }
  }

  clearState(): void {
    this.selectedFile.set(null);
    this.importResult.set(null);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Validar extensión
      if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
        this.notificationService.error('Archivo inválido', 'El archivo debe ser un Excel (.xlsx o .xls)');
        return;
      }

      this.selectedFile.set(file);
      this.importResult.set(null);
    }
  }

  clearFile(): void {
    this.selectedFile.set(null);
    this.importResult.set(null);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  importarConvenios(): void {
    const file = this.selectedFile();
    if (!file) {
      this.notificationService.warning('Sin archivo', 'Seleccione un archivo Excel para importar');
      return;
    }

    if (this.selectedSubPortfolioId === 0) {
      this.notificationService.warning('Sin subcartera', 'Seleccione una subcartera');
      return;
    }

    this.isLoading.set(true);

    this.convenioService.importarConvenios(
      file,
      this.selectedTenantId,
      this.selectedPortfolioId,
      this.selectedSubPortfolioId
    ).subscribe({
      next: (result) => {
        this.importResult.set(result);
        this.isLoading.set(false);

        if (result.exitoso) {
          this.notificationService.success(
            'Importación exitosa',
            `${result.conveniosNuevos} convenios creados`
          );
          this.selectedFile.set(null);
        } else {
          this.notificationService.error('Error en importación', result.mensaje);
        }
      },
      error: (err) => {
        console.error('Error importing convenios:', err);
        this.isLoading.set(false);
        this.notificationService.error(
          'Error de importación',
          err.error?.mensaje || err.message || 'Error al procesar el archivo'
        );
      }
    });
  }
}
