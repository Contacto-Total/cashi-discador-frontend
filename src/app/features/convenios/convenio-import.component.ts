import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import {
  ConvenioImportService,
  ConvenioImportResult,
  ConvenioValidationResult,
  ConvenioValidado,
  ConvenioNoEncontrado,
  ConvenioExistente
} from './convenio-import.service';
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
              <h3 class="text-xl font-bold text-white mb-2">{{ loadingMessage() }}</h3>
              <p class="text-gray-400 text-sm">Por favor espere...</p>
            </div>
          </div>
        </div>
      </div>
    }

    <!-- Modal de Confirmación -->
    @if (showConfirmModal()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" (click)="closeModal()"></div>
        <div class="relative bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 max-w-3xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
          <!-- Header del Modal -->
          <div class="p-5 border-b border-slate-700">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-amber-600/20 rounded-lg flex items-center justify-center">
                <lucide-angular name="alert-triangle" [size]="28" class="text-amber-400"></lucide-angular>
              </div>
              <div>
                <h3 class="text-lg font-bold text-white">Clientes No Encontrados</h3>
                <p class="text-gray-400 text-sm">
                  Los siguientes clientes no existen en el sistema
                </p>
              </div>
            </div>
          </div>

          <!-- Contenido del Modal -->
          <div class="p-5 overflow-y-auto flex-1">
            <!-- Resumen -->
            <div class="grid grid-cols-3 gap-4 mb-5">
              <div class="bg-slate-900 rounded-lg p-3 text-center">
                <p class="text-2xl font-bold text-emerald-400">{{ validationResult()?.conveniosValidos?.length || 0 }}</p>
                <p class="text-xs text-gray-400">Válidos para importar</p>
              </div>
              <div class="bg-slate-900 rounded-lg p-3 text-center">
                <p class="text-2xl font-bold text-amber-400">{{ validationResult()?.conveniosNoEncontrados?.length || 0 }}</p>
                <p class="text-xs text-gray-400">Sin cliente en sistema</p>
              </div>
              <div class="bg-slate-900 rounded-lg p-3 text-center">
                <p class="text-2xl font-bold text-blue-400">{{ validationResult()?.conveniosYaExistentes?.length || 0 }}</p>
                <p class="text-xs text-gray-400">Ya tienen convenio</p>
              </div>
            </div>

            <!-- Lista de NO Encontrados -->
            @if ((validationResult()?.conveniosNoEncontrados?.length ?? 0) > 0) {
              <div class="bg-amber-900/20 border border-amber-500/30 rounded-lg p-4 mb-4">
                <h4 class="text-sm font-semibold text-amber-400 mb-3 flex items-center gap-2">
                  <lucide-angular name="user-x" [size]="16"></lucide-angular>
                  Clientes sin registro en el sistema ({{ validationResult()?.conveniosNoEncontrados?.length }})
                </h4>
                <div class="max-h-40 overflow-y-auto">
                  <table class="w-full text-sm">
                    <thead>
                      <tr class="text-left text-gray-400 text-xs uppercase">
                        <th class="p-2">Fila</th>
                        <th class="p-2">Documento</th>
                        <th class="p-2">Identity Code</th>
                        <th class="p-2">Monto</th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (item of validationResult()?.conveniosNoEncontrados; track item.documento) {
                        <tr class="border-t border-slate-700/50">
                          <td class="p-2 text-gray-400">#{{ item.fila }}</td>
                          <td class="p-2 font-mono text-white">{{ item.documento }}</td>
                          <td class="p-2 font-mono text-gray-400 text-xs">{{ item.identityCode }}</td>
                          <td class="p-2 text-amber-400">S/ {{ item.montoConvenio | number:'1.2-2' }}</td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            }

            <!-- Lista de YA EXISTENTES -->
            @if ((validationResult()?.conveniosYaExistentes?.length ?? 0) > 0) {
              <div class="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-4">
                <h4 class="text-sm font-semibold text-blue-400 mb-3 flex items-center gap-2">
                  <lucide-angular name="file-check" [size]="16"></lucide-angular>
                  Clientes que ya tienen convenio activo ({{ validationResult()?.conveniosYaExistentes?.length }})
                </h4>
                <div class="max-h-32 overflow-y-auto">
                  <table class="w-full text-sm">
                    <thead>
                      <tr class="text-left text-gray-400 text-xs uppercase">
                        <th class="p-2">Fila</th>
                        <th class="p-2">Documento</th>
                        <th class="p-2">Cliente</th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (item of validationResult()?.conveniosYaExistentes; track item.documento) {
                        <tr class="border-t border-slate-700/50">
                          <td class="p-2 text-gray-400">#{{ item.fila }}</td>
                          <td class="p-2 font-mono text-white">{{ item.documento }}</td>
                          <td class="p-2 text-gray-300">{{ item.nombreCliente }}</td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            }

            <!-- Lista de VÁLIDOS (colapsable) -->
            @if ((validationResult()?.conveniosValidos?.length ?? 0) > 0) {
              <div class="bg-emerald-900/20 border border-emerald-500/30 rounded-lg p-4">
                <button (click)="toggleValidosList()"
                        class="w-full flex items-center justify-between cursor-pointer">
                  <h4 class="text-sm font-semibold text-emerald-400 flex items-center gap-2">
                    <lucide-angular name="check-circle" [size]="16"></lucide-angular>
                    Convenios válidos para importar ({{ validationResult()?.conveniosValidos?.length }})
                  </h4>
                  <lucide-angular [name]="showValidosList() ? 'chevron-up' : 'chevron-down'"
                                  [size]="18" class="text-emerald-400"></lucide-angular>
                </button>
                @if (showValidosList()) {
                  <div class="max-h-40 overflow-y-auto mt-3">
                    <table class="w-full text-sm">
                      <thead>
                        <tr class="text-left text-gray-400 text-xs uppercase">
                          <th class="p-2">Documento</th>
                          <th class="p-2">Cliente</th>
                          <th class="p-2">Subcartera</th>
                          <th class="p-2">Monto</th>
                        </tr>
                      </thead>
                      <tbody>
                        @for (item of validationResult()?.conveniosValidos; track item.documento) {
                          <tr class="border-t border-slate-700/50">
                            <td class="p-2 font-mono text-white">{{ item.documento }}</td>
                            <td class="p-2 text-gray-300">{{ item.nombreCliente }}</td>
                            <td class="p-2 text-gray-400 text-xs">{{ item.nombreSubcartera }}</td>
                            <td class="p-2 text-emerald-400">S/ {{ item.montoConvenio | number:'1.2-2' }}</td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>
                }
              </div>
            }
          </div>

          <!-- Footer del Modal -->
          <div class="p-5 border-t border-slate-700 bg-slate-900/50 flex justify-end gap-3">
            <button (click)="closeModal()"
                    class="px-5 py-2.5 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-all font-medium cursor-pointer flex items-center gap-2">
              <lucide-angular name="x" [size]="18"></lucide-angular>
              Cancelar
            </button>
            @if ((validationResult()?.conveniosValidos?.length ?? 0) > 0) {
              <button (click)="confirmarImportacion()"
                      class="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-lg hover:from-emerald-600 hover:to-green-700 transition-all font-semibold cursor-pointer flex items-center gap-2 shadow-lg shadow-emerald-500/20">
                <lucide-angular name="check" [size]="18"></lucide-angular>
                Confirmar y Omitir No Encontrados
              </button>
            }
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

        <!-- Info Card -->
        <div class="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4 mb-6">
          <div class="flex items-start gap-3">
            <lucide-angular name="info" [size]="20" class="text-blue-400 mt-0.5"></lucide-angular>
            <div class="text-sm text-gray-300">
              <p class="font-medium text-blue-400 mb-1">Importación Automática</p>
              <p>El sistema detectará automáticamente la cartera y subcartera de cada cliente basándose en su documento.
                 Solo se importarán convenios para clientes que existan en el sistema.</p>
            </div>
          </div>
        </div>

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

              <!-- Botón de Validar -->
              <div class="mt-6 flex justify-end">
                <button (click)="validarConvenios()"
                        class="px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-lg hover:from-violet-600 hover:to-purple-700 transition-all font-semibold cursor-pointer flex items-center gap-2 shadow-lg shadow-violet-500/20">
                  <lucide-angular name="search" [size]="18"></lucide-angular>
                  Validar y Procesar
                </button>
              </div>
            }
          </div>
        </div>

        <!-- Columnas Requeridas -->
        <div class="bg-slate-900/80 backdrop-blur rounded-xl p-5 shadow-lg border border-slate-800 mb-6">
          <h3 class="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
            <lucide-angular name="list" [size]="16" class="text-violet-400"></lucide-angular>
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
                  <p class="text-3xl font-bold text-amber-400">{{ importResult()?.conveniosOmitidos || 0 }}</p>
                  <p class="text-xs text-gray-400 mt-1">Omitidos</p>
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
                          <th class="p-3">Cliente</th>
                          <th class="p-3">Subcartera</th>
                          <th class="p-3">Monto Total</th>
                          <th class="p-3">Cuotas</th>
                          <th class="p-3">Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        @for (convenio of importResult()?.conveniosImportados; track convenio.documento) {
                          <tr class="border-b border-slate-800 hover:bg-slate-800/50">
                            <td class="p-3">
                              <span class="font-mono text-white">{{ convenio.documento }}</span>
                            </td>
                            <td class="p-3 text-gray-300">{{ convenio.nombreCliente }}</td>
                            <td class="p-3 text-gray-400 text-xs">{{ convenio.nombreSubcartera }}</td>
                            <td class="p-3 text-white">
                              S/ {{ convenio.montoConvenio | number:'1.2-2' }}
                            </td>
                            <td class="p-3">
                              <span class="text-emerald-400">{{ convenio.cuotasPagadas }}</span>
                              <span class="text-gray-500">/</span>
                              <span class="text-white">{{ convenio.numeroCuotas }}</span>
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
export class ConvenioImportComponent {
  private notificationService = inject(NotificationService);

  // Signals
  selectedFile = signal<File | null>(null);
  isLoading = signal(false);
  loadingMessage = signal('Procesando...');
  validationResult = signal<ConvenioValidationResult | null>(null);
  importResult = signal<ConvenioImportResult | null>(null);
  showConfirmModal = signal(false);
  showValidosList = signal(false);

  constructor(private convenioService: ConvenioImportService) {}

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
      this.validationResult.set(null);
    }
  }

  clearFile(): void {
    this.selectedFile.set(null);
    this.importResult.set(null);
    this.validationResult.set(null);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  validarConvenios(): void {
    const file = this.selectedFile();
    if (!file) {
      this.notificationService.warning('Sin archivo', 'Seleccione un archivo Excel para validar');
      return;
    }

    this.isLoading.set(true);
    this.loadingMessage.set('Validando archivo...');

    this.convenioService.validarConvenios(file).subscribe({
      next: (result) => {
        this.isLoading.set(false);
        this.validationResult.set(result);

        if (!result.exitoso) {
          this.notificationService.error('Error de validación', result.mensaje);
          return;
        }

        // Verificar si hay elementos no encontrados o ya existentes
        const noEncontrados = result.conveniosNoEncontrados?.length || 0;
        const yaExistentes = result.conveniosYaExistentes?.length || 0;
        const validos = result.conveniosValidos?.length || 0;

        if (noEncontrados === 0 && yaExistentes === 0) {
          // Todo está bien, importar directamente
          if (validos > 0) {
            this.ejecutarImportacion();
          } else {
            this.notificationService.warning('Sin convenios', 'No hay convenios válidos para importar');
          }
        } else {
          // Hay elementos con problemas, mostrar modal
          this.showConfirmModal.set(true);
        }
      },
      error: (err) => {
        console.error('Error validating convenios:', err);
        this.isLoading.set(false);
        this.notificationService.error(
          'Error de validación',
          err.error?.mensaje || err.message || 'Error al procesar el archivo'
        );
      }
    });
  }

  toggleValidosList(): void {
    this.showValidosList.set(!this.showValidosList());
  }

  closeModal(): void {
    this.showConfirmModal.set(false);
  }

  confirmarImportacion(): void {
    this.showConfirmModal.set(false);
    this.ejecutarImportacion();
  }

  private ejecutarImportacion(): void {
    const file = this.selectedFile();
    const validacion = this.validationResult();

    if (!file || !validacion) {
      this.notificationService.error('Error', 'Datos de validación no disponibles');
      return;
    }

    // Obtener lista de documentos válidos
    const documentos = validacion.conveniosValidos?.map(c => c.documento) || [];

    if (documentos.length === 0) {
      this.notificationService.warning('Sin convenios', 'No hay convenios válidos para importar');
      return;
    }

    this.isLoading.set(true);
    this.loadingMessage.set('Importando convenios...');

    this.convenioService.importarConvenios(file, documentos).subscribe({
      next: (result) => {
        this.importResult.set(result);
        this.isLoading.set(false);

        if (result.exitoso) {
          this.notificationService.success(
            'Importación exitosa',
            `${result.conveniosNuevos} convenios creados`
          );
          this.selectedFile.set(null);
          this.validationResult.set(null);
        } else {
          this.notificationService.error('Error en importación', result.mensaje);
        }
      },
      error: (err) => {
        console.error('Error importing convenios:', err);
        this.isLoading.set(false);
        this.notificationService.error(
          'Error de importación',
          err.error?.mensaje || err.message || 'Error al importar los convenios'
        );
      }
    });
  }
}
