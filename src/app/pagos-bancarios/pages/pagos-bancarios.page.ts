import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BcpPagosService } from '../services/bcp-pagos.service';
import { BcpArchivoResultado, BcpPagoManualRequest, BcpPagoManualResponse } from '../models/bcp-archivo.model';

@Component({
  selector: 'app-pagos-bancarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-slate-800 dark:text-white">
          Pagos Bancarios
        </h1>
        <p class="text-slate-600 dark:text-slate-400">
          Registra pagos del BCP de forma manual o masiva
        </p>
      </div>

      <!-- Tabs -->
      <div class="mb-6">
        <div class="border-b border-slate-200 dark:border-slate-700">
          <nav class="-mb-px flex space-x-8">
            <button
              (click)="activeTab.set('masiva')"
              [class]="activeTab() === 'masiva'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 hover:border-slate-300'"
              class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              Carga Masiva
            </button>
            <button
              (click)="activeTab.set('manual')"
              [class]="activeTab() === 'manual'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 hover:border-slate-300'"
              class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
              Ingreso Manual
            </button>
          </nav>
        </div>
      </div>

      <!-- Tab: Carga Masiva -->
      @if (activeTab() === 'masiva') {
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-6">
          <h2 class="text-lg font-semibold text-slate-800 dark:text-white mb-4">
            Cargar Archivo BCP (formato CREP)
          </h2>

          <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div class="flex-1">
              <label
                for="file-upload"
                class="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer
                       border-slate-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500
                       bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <div class="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg class="w-8 h-8 mb-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                  </svg>
                  @if (selectedFile()) {
                    <p class="text-sm text-blue-600 dark:text-blue-400 font-medium">{{ selectedFile()?.name }}</p>
                    <p class="text-xs text-slate-500">{{ formatFileSize(selectedFile()?.size || 0) }}</p>
                  } @else {
                    <p class="mb-2 text-sm text-slate-500 dark:text-slate-400">
                      <span class="font-semibold">Click para seleccionar</span> o arrastra el archivo
                    </p>
                    <p class="text-xs text-slate-500 dark:text-slate-400">Solo archivos TXT</p>
                  }
                </div>
                <input id="file-upload" type="file" class="hidden" accept=".txt" (change)="onFileSelected($event)" />
              </label>
            </div>

            <button
              (click)="procesarArchivo()"
              [disabled]="!selectedFile() || isLoading()"
              class="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              @if (isLoading()) {
                <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Procesando...
              } @else {
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                </svg>
                Procesar Archivo
              }
            </button>
          </div>

          @if (errorMessage()) {
            <div class="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p class="text-red-700 dark:text-red-400">{{ errorMessage() }}</p>
            </div>
          }
        </div>

        <!-- Resultados de carga masiva -->
        @if (resultado()) {
          @if (resultado()?.exitoso && resultado()?.archivoId) {
            <div class="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-3">
              <svg class="w-6 h-6 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <div>
                <p class="font-medium text-green-800 dark:text-green-300">Archivo guardado correctamente</p>
                <p class="text-sm text-green-700 dark:text-green-400">
                  ID: <span class="font-mono font-bold">{{ resultado()?.archivoId }}</span> - {{ resultado()?.registrosProcesados }} registros
                  @if (resultado()?.duplicadosOmitidos && resultado()!.duplicadosOmitidos > 0) {
                    <span class="text-amber-600 dark:text-amber-400">({{ resultado()?.duplicadosOmitidos }} duplicados)</span>
                  }
                </p>
              </div>
            </div>
          }

          @if (!resultado()?.exitoso && resultado()?.duplicadosOmitidos && resultado()!.duplicadosOmitidos > 0) {
            <div class="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg flex items-center gap-3">
              <svg class="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
              <div>
                <p class="font-medium text-amber-800 dark:text-amber-300">Archivo ya procesado</p>
                <p class="text-sm text-amber-700 dark:text-amber-400">{{ resultado()?.duplicadosOmitidos }} registros ya existen</p>
              </div>
            </div>
          }

          <!-- Tabla de detalles -->
          @if (resultado()?.detalles && resultado()!.detalles.length > 0) {
            <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div class="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <h2 class="text-lg font-semibold text-slate-800 dark:text-white">Detalle de Pagos</h2>
                <span class="text-sm text-slate-500">{{ resultado()?.detalles?.length }} registros</span>
              </div>
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                  <thead class="bg-slate-50 dark:bg-slate-700/50">
                    <tr>
                      <th class="px-3 py-3 text-left text-xs font-medium text-slate-500 uppercase">Documento</th>
                      <th class="px-3 py-3 text-left text-xs font-medium text-slate-500 uppercase">Fecha</th>
                      <th class="px-3 py-3 text-right text-xs font-medium text-slate-500 uppercase">Monto</th>
                      <th class="px-3 py-3 text-left text-xs font-medium text-slate-500 uppercase">Nro. Op.</th>
                      <th class="px-3 py-3 text-left text-xs font-medium text-slate-500 uppercase">Sucursal</th>
                      <th class="px-3 py-3 text-left text-xs font-medium text-slate-500 uppercase">Terminal</th>
                      <th class="px-3 py-3 text-left text-xs font-medium text-slate-500 uppercase">Agencia</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
                    @for (d of resultado()?.detalles; track d.numeroFila) {
                      <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                        <td class="px-3 py-2 text-sm font-medium text-slate-800 dark:text-white">{{ d.documento || d.codigoDepositante }}</td>
                        <td class="px-3 py-2 text-sm text-slate-600">{{ d.fechaPago }}</td>
                        <td class="px-3 py-2 text-sm font-medium text-green-600 text-right">S/ {{ formatMonto(d.montoPagado) }}</td>
                        <td class="px-3 py-2 text-sm text-slate-600">{{ d.numeroOperacion }}</td>
                        <td class="px-3 py-2 text-sm text-slate-600">{{ d.sucursal }}</td>
                        <td class="px-3 py-2 text-sm text-slate-600">{{ d.terminal }}</td>
                        <td class="px-3 py-2 text-sm text-slate-600">{{ d.agencia }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
          }
        }
      }

      <!-- Tab: Ingreso Manual -->
      @if (activeTab() === 'manual') {
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <h2 class="text-lg font-semibold text-slate-800 dark:text-white mb-4">
            Registrar Pago Manual
          </h2>

          <form (ngSubmit)="registrarPagoManual()" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <!-- Documento -->
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Documento (DNI) <span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  [(ngModel)]="pagoManual.documento"
                  name="documento"
                  required
                  maxlength="8"
                  placeholder="12345678"
                  class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <!-- Fecha de Pago -->
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Fecha de Pago <span class="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  [(ngModel)]="pagoManual.fechaPago"
                  name="fechaPago"
                  required
                  class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <!-- Monto -->
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Monto (S/) <span class="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  [(ngModel)]="pagoManual.monto"
                  name="monto"
                  required
                  min="0.01"
                  step="0.01"
                  placeholder="100.00"
                  class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <!-- Número de Operación -->
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Nro. Operación <span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  [(ngModel)]="pagoManual.numeroOperacion"
                  name="numeroOperacion"
                  required
                  placeholder="123456"
                  class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <!-- Banco -->
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Banco <span class="text-red-500">*</span>
                </label>
                <select
                  [(ngModel)]="pagoManual.banco"
                  name="banco"
                  required
                  class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="BCP">BCP - Banco de Crédito</option>
                  <option value="INTERBANK">Interbank</option>
                  <option value="BBVA">BBVA Continental</option>
                  <option value="SCOTIABANK">Scotiabank</option>
                  <option value="BANBIF">BanBif</option>
                  <option value="BANCO DE LA NACION">Banco de la Nación</option>
                  <option value="OTRO">Otro</option>
                </select>
              </div>

              <!-- Medio de Atención -->
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Medio de Atención
                </label>
                <select
                  [(ngModel)]="pagoManual.medioAtencion"
                  name="medioAtencion"
                  class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Seleccionar...</option>
                  <option value="VENTANILLA">Ventanilla</option>
                  <option value="AGENTE BCP">Agente BCP</option>
                  <option value="APP">App BCP</option>
                  <option value="BANCA POR INTERNET">Banca por Internet</option>
                  <option value="OTRO">Otro</option>
                </select>
              </div>

              <!-- Observaciones -->
              <div class="md:col-span-2 lg:col-span-3">
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Observaciones
                </label>
                <textarea
                  [(ngModel)]="pagoManual.observaciones"
                  name="observaciones"
                  rows="2"
                  placeholder="Notas adicionales..."
                  class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                ></textarea>
              </div>
            </div>

            <!-- Botón Guardar -->
            <div class="flex justify-end pt-4">
              <button
                type="submit"
                [disabled]="isLoadingManual() || !pagoManual.documento || !pagoManual.fechaPago || !pagoManual.monto || !pagoManual.numeroOperacion"
                class="px-6 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                @if (isLoadingManual()) {
                  <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Guardando...
                } @else {
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  Registrar Pago
                }
              </button>
            </div>
          </form>

          <!-- Resultado del registro manual -->
          @if (resultadoManual()) {
            <div class="mt-4 p-4 rounded-lg flex items-center gap-3"
                 [class]="resultadoManual()?.exitoso
                   ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                   : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'">
              @if (resultadoManual()?.exitoso) {
                <svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <div>
                  <p class="font-medium text-green-800 dark:text-green-300">{{ resultadoManual()?.mensaje }}</p>
                  <p class="text-sm text-green-700 dark:text-green-400">
                    ID: <span class="font-mono font-bold">{{ resultadoManual()?.pagoId }}</span> -
                    Doc: {{ resultadoManual()?.documento }} -
                    S/ {{ formatMonto(resultadoManual()?.monto) }}
                  </p>
                </div>
              } @else {
                <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <p class="font-medium text-red-800 dark:text-red-300">{{ resultadoManual()?.mensaje }}</p>
              }
            </div>
          }
        </div>
      }
    </div>
  `
})
export class PagosBancariosPage {
  // Tab activa
  activeTab = signal<'masiva' | 'manual'>('masiva');

  // Carga Masiva
  selectedFile = signal<File | null>(null);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  resultado = signal<BcpArchivoResultado | null>(null);

  // Ingreso Manual
  pagoManual: BcpPagoManualRequest = {
    documento: '',
    fechaPago: '',
    monto: 0,
    numeroOperacion: '',
    medioAtencion: '',
    observaciones: '',
    banco: 'BCP'
  };
  isLoadingManual = signal(false);
  resultadoManual = signal<BcpPagoManualResponse | null>(null);

  constructor(private bcpService: BcpPagosService) {}

  // === Carga Masiva ===
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (!file.name.toLowerCase().endsWith('.txt')) {
        this.errorMessage.set('Por favor seleccione un archivo TXT');
        this.selectedFile.set(null);
        return;
      }
      this.selectedFile.set(file);
      this.errorMessage.set(null);
      this.resultado.set(null);
    }
  }

  procesarArchivo(): void {
    const file = this.selectedFile();
    if (!file) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.bcpService.cargarArchivo(file).subscribe({
      next: (resultado) => {
        this.resultado.set(resultado);
        if (!resultado.exitoso) {
          this.errorMessage.set(resultado.mensaje);
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set('Error: ' + (error.error?.message || error.message));
        this.isLoading.set(false);
      }
    });
  }

  // === Ingreso Manual ===
  registrarPagoManual(): void {
    if (!this.pagoManual.documento || !this.pagoManual.fechaPago || !this.pagoManual.monto || !this.pagoManual.numeroOperacion) {
      return;
    }

    this.isLoadingManual.set(true);
    this.resultadoManual.set(null);

    // Convertir fecha de yyyy-mm-dd a dd/mm/yyyy
    const fechaParts = this.pagoManual.fechaPago.split('-');
    const fechaFormateada = `${fechaParts[2]}/${fechaParts[1]}/${fechaParts[0]}`;

    const request: BcpPagoManualRequest = {
      ...this.pagoManual,
      fechaPago: fechaFormateada
    };

    this.bcpService.registrarPagoManual(request).subscribe({
      next: (resultado) => {
        this.resultadoManual.set(resultado);
        if (resultado.exitoso) {
          // Limpiar formulario
          this.pagoManual = {
            documento: '',
            fechaPago: '',
            monto: 0,
            numeroOperacion: '',
            medioAtencion: '',
            observaciones: '',
            banco: 'BCP'
          };
        }
        this.isLoadingManual.set(false);
      },
      error: (error) => {
        this.resultadoManual.set({
          exitoso: false,
          mensaje: error.error?.mensaje || error.message || 'Error al registrar pago'
        });
        this.isLoadingManual.set(false);
      }
    });
  }

  // === Utilidades ===
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  formatMonto(monto: number | undefined): string {
    if (monto === undefined || monto === null) return '0.00';
    return monto.toLocaleString('es-PE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
}
