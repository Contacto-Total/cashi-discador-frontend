import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BcpPagosService } from '../services/bcp-pagos.service';
import { BcpArchivoResultado, BcpArchivoCabecera, BcpArchivoDetalle } from '../models/bcp-archivo.model';

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
          Carga y visualiza archivos de pagos del BCP (formato CREP)
        </p>
      </div>

      <!-- Upload Section -->
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-6">
        <h2 class="text-lg font-semibold text-slate-800 dark:text-white mb-4">
          Cargar Archivo BCP
        </h2>

        <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <!-- File Input -->
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
                  <p class="text-sm text-blue-600 dark:text-blue-400 font-medium">
                    {{ selectedFile()?.name }}
                  </p>
                  <p class="text-xs text-slate-500">
                    {{ formatFileSize(selectedFile()?.size || 0) }}
                  </p>
                } @else {
                  <p class="mb-2 text-sm text-slate-500 dark:text-slate-400">
                    <span class="font-semibold">Click para seleccionar</span> o arrastra el archivo
                  </p>
                  <p class="text-xs text-slate-500 dark:text-slate-400">
                    Solo archivos TXT (formato CREP del BCP)
                  </p>
                }
              </div>
              <input
                id="file-upload"
                type="file"
                class="hidden"
                accept=".txt"
                (change)="onFileSelected($event)"
              />
            </label>
          </div>

          <!-- Process Button -->
          <button
            (click)="procesarArchivo()"
            [disabled]="!selectedFile() || isLoading()"
            class="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium
                   hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed
                   transition-colors flex items-center gap-2"
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

        <!-- Error Message -->
        @if (errorMessage()) {
          <div class="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p class="text-red-700 dark:text-red-400">{{ errorMessage() }}</p>
          </div>
        }
      </div>

      <!-- Results Section -->
      @if (resultado()) {
        <!-- Success Message -->
        @if (resultado()?.exitoso && resultado()?.archivoId) {
          <div class="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-3">
            <svg class="w-6 h-6 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <div>
              <p class="font-medium text-green-800 dark:text-green-300">Archivo guardado correctamente</p>
              <p class="text-sm text-green-700 dark:text-green-400">
                ID de carga: <span class="font-mono font-bold">{{ resultado()?.archivoId }}</span> -
                {{ resultado()?.registrosProcesados }} registros insertados
                @if (resultado()?.duplicadosOmitidos && resultado()!.duplicadosOmitidos > 0) {
                  <span class="text-amber-600 dark:text-amber-400">
                    ({{ resultado()?.duplicadosOmitidos }} duplicados omitidos)
                  </span>
                }
              </p>
            </div>
          </div>
        }

        <!-- Warning: All duplicates -->
        @if (!resultado()?.exitoso && resultado()?.duplicadosOmitidos && resultado()!.duplicadosOmitidos > 0 && resultado()?.registrosProcesados === 0) {
          <div class="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg flex items-center gap-3">
            <svg class="w-6 h-6 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            <div>
              <p class="font-medium text-amber-800 dark:text-amber-300">Archivo ya procesado</p>
              <p class="text-sm text-amber-700 dark:text-amber-400">
                Todos los {{ resultado()?.duplicadosOmitidos }} registros ya existen en la base de datos
              </p>
            </div>
          </div>
        }

        <!-- Cabecera -->
        @if (resultado()?.cabecera) {
          <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-6">
            <h2 class="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              Datos de Cabecera
            </h2>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
                <p class="text-xs text-slate-500 dark:text-slate-400 mb-1">Código Afiliado</p>
                <p class="font-medium text-slate-800 dark:text-white">{{ resultado()?.cabecera?.codigoAfiliado }}</p>
              </div>
              <div class="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
                <p class="text-xs text-slate-500 dark:text-slate-400 mb-1">Fecha Proceso</p>
                <p class="font-medium text-slate-800 dark:text-white">{{ resultado()?.cabecera?.fechaProceso }}</p>
              </div>
              <div class="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
                <p class="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Registros</p>
                <p class="font-medium text-slate-800 dark:text-white">{{ resultado()?.cabecera?.totalRegistros }}</p>
              </div>
              <div class="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg">
                <p class="text-xs text-blue-600 dark:text-blue-400 mb-1">Monto Total</p>
                <p class="font-bold text-blue-700 dark:text-blue-300 text-lg">
                  S/ {{ formatMonto(resultado()?.cabecera?.montoTotal) }}
                </p>
              </div>
              <div class="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
                <p class="text-xs text-slate-500 dark:text-slate-400 mb-1">Código Interno BCP</p>
                <p class="font-medium text-slate-800 dark:text-white">{{ resultado()?.cabecera?.codigoInternoBcp || '-' }}</p>
              </div>
              <div class="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
                <p class="text-xs text-slate-500 dark:text-slate-400 mb-1">Código Teletransfer</p>
                <p class="font-medium text-slate-800 dark:text-white">{{ resultado()?.cabecera?.codigoTeletransfer || '-' }}</p>
              </div>
              <div class="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
                <p class="text-xs text-slate-500 dark:text-slate-400 mb-1">Hora de Corte</p>
                <p class="font-medium text-slate-800 dark:text-white">{{ resultado()?.cabecera?.horaCorte || '-' }}</p>
              </div>
              <div class="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
                <p class="text-xs text-slate-500 dark:text-slate-400 mb-1">Código Servicio</p>
                <p class="font-medium text-slate-800 dark:text-white">{{ resultado()?.cabecera?.codigoServicio || '-' }}</p>
              </div>
            </div>
          </div>
        }

        <!-- Tabla de Detalles -->
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div class="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <h2 class="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
              <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
              Detalle de Pagos
            </h2>
            <span class="text-sm text-slate-500 dark:text-slate-400">
              {{ resultado()?.detalles?.length || 0 }} registros
            </span>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
              <thead class="bg-slate-50 dark:bg-slate-700/50">
                <tr>
                  <th class="px-3 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">#</th>
                  <th class="px-3 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Documento</th>
                  <th class="px-3 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nombre/Adicional</th>
                  <th class="px-3 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Fecha Pago</th>
                  <th class="px-3 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Monto</th>
                  <th class="px-3 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Sucursal</th>
                  <th class="px-3 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Agencia</th>
                  <th class="px-3 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nro. Operación</th>
                  <th class="px-3 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Medio</th>
                  <th class="px-3 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Hora</th>
                  <th class="px-3 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Extorno</th>
                  <th class="px-3 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Referencia</th>
                  <th class="px-3 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Op. Canal</th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                @for (detalle of resultado()?.detalles; track detalle.numeroFila) {
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td class="px-3 py-2 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                      {{ detalle.numeroFila }}
                    </td>
                    <td class="px-3 py-2 whitespace-nowrap text-sm font-medium text-slate-800 dark:text-white" [title]="'Original: ' + detalle.codigoDepositante">
                      {{ detalle.documento || detalle.codigoDepositante }}
                    </td>
                    <td class="px-3 py-2 text-sm text-slate-600 dark:text-slate-300 max-w-[200px] truncate" [title]="detalle.datoAdicionalDepositante">
                      {{ detalle.datoAdicionalDepositante }}
                    </td>
                    <td class="px-3 py-2 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                      {{ detalle.fechaPago }}
                    </td>
                    <td class="px-3 py-2 whitespace-nowrap text-sm font-medium text-green-600 dark:text-green-400 text-right">
                      S/ {{ formatMonto(detalle.montoPagado) }}
                    </td>
                    <td class="px-3 py-2 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                      {{ detalle.sucursal }}
                    </td>
                    <td class="px-3 py-2 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                      {{ detalle.agencia }}
                    </td>
                    <td class="px-3 py-2 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                      {{ detalle.numeroOperacion }}
                    </td>
                    <td class="px-3 py-2 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                      {{ detalle.medioAtencion }}
                    </td>
                    <td class="px-3 py-2 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                      {{ detalle.horaAtencion }}
                    </td>
                    <td class="px-3 py-2 whitespace-nowrap text-sm">
                      @if (detalle.flagExtorno === 'S' || detalle.flagExtorno === '1') {
                        <span class="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded">
                          Sí
                        </span>
                      } @else {
                        <span class="text-slate-400">-</span>
                      }
                    </td>
                    <td class="px-3 py-2 text-sm text-slate-600 dark:text-slate-300 max-w-[150px] truncate" [title]="detalle.referencia">
                      {{ detalle.referencia || '-' }}
                    </td>
                    <td class="px-3 py-2 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                      {{ detalle.numeroOperacionCanal || '-' }}
                    </td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="13" class="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                      No hay registros de pago
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>

        <!-- Errores (si los hay) -->
        @if (resultado()?.errores && resultado()!.errores.length > 0) {
          <div class="mt-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
            <h3 class="text-amber-800 dark:text-amber-400 font-medium mb-2 flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
              Advertencias ({{ resultado()!.errores.length }})
            </h3>
            <ul class="list-disc list-inside text-sm text-amber-700 dark:text-amber-300 space-y-1">
              @for (error of resultado()?.errores; track error) {
                <li>{{ error }}</li>
              }
            </ul>
          </div>
        }
      }
    </div>
  `
})
export class PagosBancariosPage {
  selectedFile = signal<File | null>(null);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  resultado = signal<BcpArchivoResultado | null>(null);

  constructor(private bcpService: BcpPagosService) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Validar extensión
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
        console.log('[BCP] Resultado:', resultado);
        this.resultado.set(resultado);

        if (!resultado.exitoso) {
          this.errorMessage.set(resultado.mensaje);
        }

        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('[BCP] Error:', error);
        this.errorMessage.set('Error al procesar el archivo: ' + (error.error?.message || error.message));
        this.isLoading.set(false);
      }
    });
  }

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
