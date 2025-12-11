import { Component, Inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ComprobanteService } from '../../services/comprobante.service';
import { ComprobanteUploadResponse, ValidationResult } from '../../models/comprobante.model';

export interface VoucherPaymentDialogData {
  // Datos del cliente
  nombreCliente: string;
  documentoCliente: string;
  idCliente: number;
  idAgente: number;

  // Cuotas de la promesa activa
  cuotas: CuotaPromesa[];

  // ID del grupo de promesa
  grupoPromesaUuid: string;
}

export interface CuotaPromesa {
  id: number;
  numeroCuota: number;
  monto: number;
  dueDate: string;
  status: string;
}

export interface VoucherPaymentDialogResult {
  confirmed: boolean;
  // Datos para auto-seleccionar en el formulario
  autoSelect?: {
    categoriaId: string;      // ID de "Contacto Directo"
    detalleId: string;        // ID de "Cancelación"
    cuotaSeleccionada: CuotaPromesa;
    observaciones: string;
  };
  // Respuesta del OCR
  ocrResponse?: ComprobanteUploadResponse;
}

@Component({
  selector: 'app-voucher-payment-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule
  ],
  template: `
    <!-- Header -->
    <div class="dialog-header bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-700 dark:to-emerald-700 text-white px-5 py-3 -mx-6 -mt-6 mb-4 rounded-t-2xl">
      <div class="flex items-center gap-3">
        <div class="p-2 bg-white/20 rounded-lg">
          <mat-icon class="!text-2xl">payments</mat-icon>
        </div>
        <div>
          <h2 class="text-lg font-bold m-0">Registrar Pago con Voucher</h2>
          <p class="text-xs text-white/80 m-0">Sube el comprobante para validar y registrar el pago</p>
        </div>
      </div>
    </div>

    <mat-dialog-content class="!overflow-x-hidden !overflow-y-auto !w-full">
      <!-- Info del cliente y cuota más próxima -->
      <div class="mb-4 p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div class="grid grid-cols-3 gap-3">
          <div class="min-w-0">
            <p class="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wide font-semibold mb-0.5">Cliente</p>
            <p class="font-semibold text-sm text-slate-800 dark:text-slate-100 truncate">{{ data.nombreCliente }}</p>
          </div>
          <div>
            <p class="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wide font-semibold mb-0.5">Documento</p>
            <p class="font-semibold text-sm text-slate-800 dark:text-slate-100">{{ data.documentoCliente }}</p>
          </div>
          <div>
            <p class="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wide font-semibold mb-0.5">Cuota próxima</p>
            <p class="font-bold text-lg text-green-600 dark:text-green-400">S/ {{ cuotaMasProxima()?.monto | number:'1.2-2' }}</p>
            <p class="text-[10px] text-slate-500 dark:text-slate-400">Vence: {{ formatDate(cuotaMasProxima()?.dueDate) }}</p>
          </div>
        </div>
      </div>

      <!-- Resumen de cuotas pendientes -->
      @if (cuotasPendientes().length > 1) {
        <div class="mb-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
          <p class="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">Cuotas pendientes:</p>
          <div class="flex flex-wrap gap-2">
            @for (cuota of cuotasPendientes(); track cuota.numeroCuota) {
              <div class="text-xs px-2 py-1 rounded-lg"
                   [class]="cuota.numeroCuota === cuotaMasProxima()?.numeroCuota
                     ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-semibold'
                     : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'">
                C{{ cuota.numeroCuota }}: S/ {{ cuota.monto | number:'1.2-2' }}
              </div>
            }
          </div>
        </div>
      }

      <!-- Área de drag & drop -->
      @if (!selectedFile()) {
        <div
          class="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-6 text-center cursor-pointer
                 hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-950/20
                 transition-all duration-300 group bg-white dark:bg-slate-800/30"
          (click)="fileInput.click()"
          (dragover)="onDragOver($event)"
          (drop)="onDrop($event)"
        >
          <div class="w-14 h-14 mx-auto mb-3 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center group-hover:bg-green-100 dark:group-hover:bg-green-900/30 transition-colors">
            <mat-icon class="!text-4xl text-slate-400 dark:text-slate-500 group-hover:text-green-500 transition-colors">cloud_upload</mat-icon>
          </div>
          <p class="text-slate-700 dark:text-slate-200 font-semibold mb-1">Arrastra el voucher aquí</p>
          <p class="text-slate-500 dark:text-slate-400 text-sm">
            o <span class="text-green-600 dark:text-green-400 font-semibold hover:underline">haz clic para seleccionar</span>
          </p>
          <p class="text-xs text-slate-400 dark:text-slate-500 mt-2">JPG, PNG, WebP - Máximo 5MB</p>
        </div>
        <input #fileInput type="file" accept="image/jpeg,image/png,image/webp" class="hidden" (change)="onFileSelected($event)" />
      }

      <!-- Preview antes de subir -->
      @if (selectedFile() && !isUploading() && !uploadResponse()) {
        <div class="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-sm">
          <img [src]="previewUrl()" alt="Preview" class="w-full max-h-48 object-contain p-2" />
          <button mat-icon-button class="!absolute top-2 right-2 !bg-red-500 !text-white hover:!bg-red-600 shadow-lg !rounded-lg !w-8 !h-8" (click)="removeFile()">
            <mat-icon class="!text-lg">close</mat-icon>
          </button>
          <div class="px-3 py-2 bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
            <p class="text-xs text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <mat-icon class="!text-sm text-slate-500 dark:text-slate-400">insert_drive_file</mat-icon>
              <span class="truncate">{{ selectedFile()?.name }}</span>
              <span class="text-slate-400 dark:text-slate-500 flex-shrink-0">-</span>
              <span class="text-slate-500 dark:text-slate-400 flex-shrink-0">{{ formatFileSize(selectedFile()?.size || 0) }}</span>
            </p>
          </div>
        </div>
      }

      <!-- Spinner -->
      @if (isUploading()) {
        <div class="py-8 text-center bg-slate-50 dark:bg-slate-800/30 rounded-xl">
          <div class="relative inline-block">
            <div class="w-16 h-16 border-4 border-green-200 dark:border-green-900/50 rounded-full animate-pulse"></div>
            <mat-spinner diameter="56" class="!absolute top-1 left-1" strokeWidth="3"></mat-spinner>
            <div class="absolute inset-0 flex items-center justify-center">
              <mat-icon class="text-green-500 dark:text-green-400 animate-pulse !text-xl">document_scanner</mat-icon>
            </div>
          </div>
          <p class="text-slate-800 dark:text-slate-100 font-semibold mt-4">Analizando voucher...</p>
          <div class="flex justify-center gap-1 mt-3">
            <span class="w-2 h-2 bg-green-500 rounded-full animate-bounce" style="animation-delay: 0ms"></span>
            <span class="w-2 h-2 bg-green-500 rounded-full animate-bounce" style="animation-delay: 150ms"></span>
            <span class="w-2 h-2 bg-green-500 rounded-full animate-bounce" style="animation-delay: 300ms"></span>
          </div>
        </div>
      }

      <!-- Resultado del análisis -->
      @if (uploadResponse()) {
        <div class="flex gap-4">
          <!-- Columna izquierda: Resultados -->
          <div class="flex-1 min-w-0 space-y-3">
            <!-- Mensaje general -->
            <div class="p-3 rounded-xl flex items-center gap-3" [class]="getResultBgClass()">
              <div class="p-2 rounded-lg flex-shrink-0" [class]="getResultIconBgClass()">
                <mat-icon class="!text-xl">{{ getResultIcon() }}</mat-icon>
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-bold text-sm">{{ getResultTitle() }}</p>
                <p class="text-xs opacity-80 truncate">{{ uploadResponse()?.mensaje }}</p>
              </div>
            </div>

            <!-- Grid de validaciones -->
            @if (uploadResponse()?.ocrResult?.success) {
              <div class="grid grid-cols-3 gap-2">
                <!-- Monto -->
                <div class="p-3 rounded-xl border-2 transition-all" [class]="getValidationCardClass(uploadResponse()?.validacionMonto)">
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Monto</span>
                    @if (uploadResponse()?.validacionMonto) {
                      <mat-icon class="!text-base" [class]="uploadResponse()?.validacionMonto?.coincide ? 'text-green-500' : 'text-amber-500'">
                        {{ uploadResponse()?.validacionMonto?.coincide ? 'check_circle' : 'warning' }}
                      </mat-icon>
                    }
                  </div>
                  <p class="text-lg font-bold text-slate-800 dark:text-slate-100">S/ {{ uploadResponse()?.ocrResult?.monto | number:'1.2-2' }}</p>
                  @if (uploadResponse()?.validacionMonto) {
                    <p class="text-[10px] mt-1 font-medium flex items-center gap-0.5" [class]="uploadResponse()?.validacionMonto?.coincide ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'">
                      <mat-icon class="!text-xs">{{ uploadResponse()?.validacionMonto?.coincide ? 'check' : 'priority_high' }}</mat-icon>
                      {{ uploadResponse()?.validacionMonto?.coincide ? 'OK' : 'No coincide' }}
                    </p>
                  }
                </div>

                <!-- Documento -->
                <div class="p-3 rounded-xl border-2 transition-all" [class]="getValidationCardClass(uploadResponse()?.validacionDocumento)">
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Documento</span>
                    @if (uploadResponse()?.validacionDocumento) {
                      <mat-icon class="!text-base" [class]="uploadResponse()?.validacionDocumento?.coincide ? 'text-green-500' : 'text-amber-500'">
                        {{ uploadResponse()?.validacionDocumento?.coincide ? 'check_circle' : 'warning' }}
                      </mat-icon>
                    }
                  </div>
                  <p class="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{{ uploadResponse()?.ocrResult?.documento || '-' }}</p>
                  @if (uploadResponse()?.validacionDocumento) {
                    <p class="text-[10px] mt-1 font-medium flex items-center gap-0.5" [class]="uploadResponse()?.validacionDocumento?.coincide ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'">
                      <mat-icon class="!text-xs">{{ uploadResponse()?.validacionDocumento?.coincide ? 'check' : 'priority_high' }}</mat-icon>
                      {{ uploadResponse()?.validacionDocumento?.coincide ? 'OK' : 'No coincide' }}
                    </p>
                  }
                </div>

                <!-- Nombre -->
                <div class="p-3 rounded-xl border-2 transition-all" [class]="getValidationCardClass(uploadResponse()?.validacionNombre)">
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Nombre</span>
                    @if (uploadResponse()?.validacionNombre) {
                      <mat-icon class="!text-base" [class]="uploadResponse()?.validacionNombre?.coincide ? 'text-green-500' : 'text-amber-500'">
                        {{ uploadResponse()?.validacionNombre?.coincide ? 'check_circle' : 'warning' }}
                      </mat-icon>
                    }
                  </div>
                  <p class="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{{ uploadResponse()?.ocrResult?.nombre || '-' }}</p>
                  @if (uploadResponse()?.validacionNombre) {
                    <p class="text-[10px] mt-1 font-medium flex items-center gap-0.5" [class]="uploadResponse()?.validacionNombre?.coincide ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'">
                      <mat-icon class="!text-xs">{{ uploadResponse()?.validacionNombre?.coincide ? 'check' : 'priority_high' }}</mat-icon>
                      {{ uploadResponse()?.validacionNombre?.coincide ? 'OK' : 'No coincide' }}
                    </p>
                  }
                </div>
              </div>

              <!-- Info adicional del voucher -->
              @if (uploadResponse()?.ocrResult?.banco || uploadResponse()?.ocrResult?.numeroOperacion || uploadResponse()?.ocrResult?.fecha) {
                <div class="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div class="flex items-center gap-4 text-sm">
                    @if (uploadResponse()?.ocrResult?.banco) {
                      <div class="flex items-center gap-1.5">
                        <mat-icon class="!text-base text-slate-400">account_balance</mat-icon>
                        <span class="font-semibold text-slate-800 dark:text-slate-100">{{ uploadResponse()?.ocrResult?.banco }}</span>
                      </div>
                    }
                    @if (uploadResponse()?.ocrResult?.numeroOperacion) {
                      <div class="flex items-center gap-1.5">
                        <mat-icon class="!text-base text-slate-400">tag</mat-icon>
                        <span class="font-semibold text-slate-800 dark:text-slate-100">{{ uploadResponse()?.ocrResult?.numeroOperacion }}</span>
                      </div>
                    }
                    @if (uploadResponse()?.ocrResult?.fecha) {
                      <div class="flex items-center gap-1.5">
                        <mat-icon class="!text-base text-slate-400">event</mat-icon>
                        <span class="font-semibold text-slate-800 dark:text-slate-100">{{ uploadResponse()?.ocrResult?.fecha }}</span>
                      </div>
                    }
                  </div>
                </div>
              }

              <!-- Cuota que se seleccionará -->
              @if (cuotaCoincidente()) {
                <div class="p-3 bg-green-50 dark:bg-green-950/30 rounded-xl border-2 border-green-400 dark:border-green-600">
                  <div class="flex items-center gap-2">
                    <mat-icon class="text-green-600 dark:text-green-400">check_circle</mat-icon>
                    <div>
                      <p class="text-sm font-bold text-green-800 dark:text-green-200">Se registrará pago de Cuota {{ cuotaCoincidente()?.numeroCuota }}</p>
                      <p class="text-xs text-green-700 dark:text-green-300">Monto: S/ {{ cuotaCoincidente()?.monto | number:'1.2-2' }} - Vence: {{ formatDate(cuotaCoincidente()?.dueDate) }}</p>
                    </div>
                  </div>
                </div>
              } @else if (uploadResponse()?.ocrResult?.monto) {
                <div class="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border-2 border-amber-400 dark:border-amber-600">
                  <div class="flex items-center gap-2">
                    <mat-icon class="text-amber-600 dark:text-amber-400">warning</mat-icon>
                    <div>
                      <p class="text-sm font-bold text-amber-800 dark:text-amber-200">El monto no coincide con ninguna cuota pendiente</p>
                      <p class="text-xs text-amber-700 dark:text-amber-300">Se seleccionará la cuota más próxima: C{{ cuotaMasProxima()?.numeroCuota }} (S/ {{ cuotaMasProxima()?.monto | number:'1.2-2' }})</p>
                    </div>
                  </div>
                </div>
              }
            } @else if (uploadResponse()?.ocrResult && !uploadResponse()?.ocrResult?.success) {
              <div class="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800 flex items-center gap-3">
                <mat-icon class="text-amber-500">info</mat-icon>
                <p class="text-sm text-amber-800 dark:text-amber-200">No se pudo analizar el voucher. Puedes continuar manualmente.</p>
              </div>
            }

            <!-- Advertencia si hay diferencias -->
            @if (showWarning()) {
              <div class="p-3 bg-amber-50 dark:bg-amber-950/30 border-2 border-amber-300 dark:border-amber-700 rounded-xl flex items-center gap-3">
                <mat-icon class="text-amber-600 dark:text-amber-400">warning</mat-icon>
                <div>
                  <p class="text-amber-800 dark:text-amber-200 font-semibold text-sm">Hay diferencias en la validación</p>
                  <p class="text-amber-700 dark:text-amber-300 text-xs">Puedes continuar, pero verifica los datos.</p>
                </div>
              </div>
            }

            <!-- Preview de lo que se auto-seleccionará -->
            @if (allValidationsOk()) {
              <div class="p-3 bg-green-50 dark:bg-green-950/20 rounded-xl border border-green-200 dark:border-green-800">
                <p class="text-xs font-semibold text-green-700 dark:text-green-300 mb-2 flex items-center gap-1">
                  <mat-icon class="!text-sm">auto_awesome</mat-icon>
                  Se auto-completará:
                </p>
                <div class="flex flex-wrap gap-2 text-xs">
                  <span class="px-2 py-1 bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200 rounded">Contacto Directo</span>
                  <span class="px-2 py-1 bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200 rounded">Cancelación</span>
                  <span class="px-2 py-1 bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200 rounded">Cuota {{ (cuotaCoincidente() || cuotaMasProxima())?.numeroCuota }}</span>
                </div>
              </div>
            }
          </div>

          <!-- Columna derecha: Imagen con zoom -->
          <div class="w-96 flex-shrink-0">
            <div class="sticky top-0 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 overflow-hidden">
              <div class="p-2 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <span class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Voucher</span>
                <div class="flex items-center gap-1">
                  <button mat-icon-button class="!w-7 !h-7" (click)="zoomOut()" [disabled]="zoomLevel() <= 0.5">
                    <mat-icon class="!text-base text-slate-500 dark:text-slate-400">remove</mat-icon>
                  </button>
                  <span class="text-xs text-slate-500 dark:text-slate-400 w-10 text-center">{{ (zoomLevel() * 100) | number:'1.0-0' }}%</span>
                  <button mat-icon-button class="!w-7 !h-7" (click)="zoomIn()" [disabled]="zoomLevel() >= 3">
                    <mat-icon class="!text-base text-slate-500 dark:text-slate-400">add</mat-icon>
                  </button>
                  <button mat-icon-button class="!w-7 !h-7" (click)="resetZoom()">
                    <mat-icon class="!text-base text-slate-500 dark:text-slate-400">fit_screen</mat-icon>
                  </button>
                </div>
              </div>
              <div class="overflow-auto max-h-80 bg-white dark:bg-slate-900"
                   (wheel)="onWheel($event)"
                   style="cursor: grab;">
                <img [src]="previewUrl()"
                     alt="Voucher"
                     class="transition-transform duration-150"
                     [style.transform]="'scale(' + zoomLevel() + ')'"
                     [style.transform-origin]="'top left'" />
              </div>
            </div>
          </div>
        </div>
      }

      <!-- Error -->
      @if (errorMessage()) {
        <div class="p-3 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-200 dark:border-red-800 flex items-center gap-3">
          <mat-icon class="text-red-500">error</mat-icon>
          <p class="text-sm text-red-700 dark:text-red-300">{{ errorMessage() }}</p>
        </div>
      }
    </mat-dialog-content>

    <mat-dialog-actions align="end" class="!px-5 !py-3 border-t border-slate-200 dark:border-slate-700 gap-2 bg-slate-50 dark:bg-slate-800/50 -mx-6 -mb-6 rounded-b-2xl">
      <button mat-button class="!text-slate-600 dark:!text-slate-300 !rounded-lg !px-4 hover:!bg-slate-200 dark:hover:!bg-slate-700" (click)="cancel()">
        Cancelar
      </button>

      @if (!uploadResponse()) {
        <button mat-raised-button color="primary" [disabled]="!selectedFile() || isUploading()" (click)="upload()"
          class="!px-5 !rounded-lg !bg-green-600 hover:!bg-green-700 !shadow-md">
          @if (isUploading()) {
            <mat-spinner diameter="16" class="mr-2"></mat-spinner>
          } @else {
            <mat-icon class="mr-1 !text-lg">upload</mat-icon>
          }
          Analizar Voucher
        </button>
      } @else {
        <button mat-raised-button [color]="showWarning() ? 'warn' : 'primary'" (click)="confirm()"
          class="!px-5 !rounded-lg !shadow-md" [class]="showWarning() ? '!bg-amber-500 hover:!bg-amber-600' : '!bg-green-600 hover:!bg-green-700'">
          <mat-icon class="mr-1 !text-lg">{{ showWarning() ? 'check' : 'done_all' }}</mat-icon>
          {{ showWarning() ? 'Continuar con Pago' : 'Confirmar Pago' }}
        </button>
      }
    </mat-dialog-actions>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class VoucherPaymentDialogComponent {
  // Signals
  selectedFile = signal<File | null>(null);
  previewUrl = signal<string>('');
  isUploading = signal(false);
  uploadResponse = signal<ComprobanteUploadResponse | null>(null);
  errorMessage = signal<string>('');
  zoomLevel = signal<number>(1);

  // Computed: Cuotas pendientes ordenadas por fecha
  cuotasPendientes = computed(() => {
    return this.data.cuotas
      .filter(c => c.status !== 'PAGADA' && c.status !== 'PAGADO' && c.status !== 'CUMPLIDO' && c.status !== 'CANCELADA')
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  });

  // Computed: Cuota más próxima a vencer
  cuotaMasProxima = computed(() => {
    const pendientes = this.cuotasPendientes();
    return pendientes.length > 0 ? pendientes[0] : null;
  });

  // Computed: Cuota que coincide con el monto del voucher
  cuotaCoincidente = computed(() => {
    const response = this.uploadResponse();
    if (!response?.ocrResult?.monto) return null;

    const montoVoucher = response.ocrResult.monto;
    const pendientes = this.cuotasPendientes();

    // Buscar cuota con monto exacto (tolerancia de 0.01)
    const coincidente = pendientes.find(c => Math.abs(c.monto - montoVoucher) < 0.01);

    // Si hay coincidencia exacta, devolver esa
    if (coincidente) return coincidente;

    // Si no hay coincidencia, verificar si la cuota más próxima tiene el mismo monto
    const masProxima = this.cuotaMasProxima();
    if (masProxima && Math.abs(masProxima.monto - montoVoucher) < 0.01) {
      return masProxima;
    }

    return null;
  });

  // Computed: Mostrar advertencia
  showWarning = computed(() => {
    const response = this.uploadResponse();
    if (!response) return false;
    return (
      (response.validacionMonto && !response.validacionMonto.coincide) ||
      (response.validacionDocumento && !response.validacionDocumento.coincide) ||
      (response.validacionNombre && !response.validacionNombre.coincide)
    );
  });

  // Computed: Todas las validaciones OK
  allValidationsOk = computed(() => {
    const response = this.uploadResponse();
    if (!response?.ocrResult?.success) return false;
    return (
      response.validacionMonto?.coincide &&
      response.validacionDocumento?.coincide &&
      response.validacionNombre?.coincide
    );
  });

  constructor(
    public dialogRef: MatDialogRef<VoucherPaymentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: VoucherPaymentDialogData,
    private comprobanteService: ComprobanteService
  ) {}

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  private handleFile(file: File): void {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      this.errorMessage.set('Tipo de archivo no permitido. Solo JPG, PNG o WebP.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.errorMessage.set('El archivo es muy grande. Máximo 5MB.');
      return;
    }

    this.errorMessage.set('');
    this.selectedFile.set(file);

    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl.set(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  removeFile(): void {
    this.selectedFile.set(null);
    this.previewUrl.set('');
    this.uploadResponse.set(null);
    this.errorMessage.set('');
  }

  upload(): void {
    const file = this.selectedFile();
    if (!file) return;

    const cuota = this.cuotaMasProxima();
    if (!cuota) {
      this.errorMessage.set('No hay cuotas pendientes');
      return;
    }

    this.isUploading.set(true);
    this.errorMessage.set('');

    this.comprobanteService.uploadComprobante(file, {
      idCuota: cuota.id,
      montoEsperado: cuota.monto,
      documentoEsperado: this.data.documentoCliente,
      nombreEsperado: this.data.nombreCliente,
      idAgente: this.data.idAgente
    }).subscribe({
      next: (response) => {
        this.isUploading.set(false);
        this.uploadResponse.set(response);
        if (!response.success) {
          this.errorMessage.set(response.error || 'Error al procesar el voucher');
        }
      },
      error: (err) => {
        this.isUploading.set(false);
        this.errorMessage.set(err.error?.error || 'Error de conexión');
      }
    });
  }

  confirm(): void {
    const response = this.uploadResponse();
    const cuotaSeleccionada = this.cuotaCoincidente() || this.cuotaMasProxima();

    if (!cuotaSeleccionada) {
      this.errorMessage.set('No hay cuota para seleccionar');
      return;
    }

    // Construir observaciones automáticas
    const ocrData = response?.ocrResult;
    let observaciones = 'Pago validado por OCR';
    if (ocrData?.banco) observaciones += ` - ${ocrData.banco}`;
    if (ocrData?.numeroOperacion) observaciones += ` - Op. #${ocrData.numeroOperacion}`;
    if (ocrData?.fecha) observaciones += ` - Fecha: ${ocrData.fecha}`;
    if (ocrData?.monto) observaciones += ` - Monto: S/ ${ocrData.monto.toFixed(2)}`;

    const result: VoucherPaymentDialogResult = {
      confirmed: true,
      autoSelect: {
        categoriaId: 'CD',      // Contacto Directo
        detalleId: 'CA',        // Cancelación
        cuotaSeleccionada: cuotaSeleccionada,
        observaciones: observaciones
      },
      ocrResponse: response || undefined
    };

    this.dialogRef.close(result);
  }

  cancel(): void {
    this.dialogRef.close({ confirmed: false });
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  formatDate(dateValue?: string): string {
    if (!dateValue) return '-';
    try {
      // Usar parseo local para evitar bug de timezone
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
        const [year, month, day] = dateValue.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        return date.toLocaleDateString('es-PE', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
      }
      return new Date(dateValue).toLocaleDateString('es-PE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return dateValue;
    }
  }

  getResultBgClass(): string {
    const response = this.uploadResponse();
    if (!response?.success) return 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300';
    if (this.showWarning()) return 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300';
    return 'bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300';
  }

  getResultIconBgClass(): string {
    const response = this.uploadResponse();
    if (!response?.success) return 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400';
    if (this.showWarning()) return 'bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400';
    return 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400';
  }

  getResultIcon(): string {
    const response = this.uploadResponse();
    if (!response?.success) return 'error';
    if (this.showWarning()) return 'warning';
    return 'check_circle';
  }

  getResultTitle(): string {
    const response = this.uploadResponse();
    if (!response?.success) return 'Error al procesar';
    if (this.showWarning()) return 'Voucher con advertencias';
    return 'Voucher validado correctamente';
  }

  getValidationCardClass(validation?: ValidationResult): string {
    if (!validation) return 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50';
    return validation.coincide
      ? 'border-green-400 dark:border-green-600 bg-green-50 dark:bg-green-950/30'
      : 'border-amber-400 dark:border-amber-600 bg-amber-50 dark:bg-amber-950/30';
  }

  // Zoom methods
  zoomIn(): void {
    if (this.zoomLevel() < 3) {
      this.zoomLevel.update(z => Math.min(3, z + 0.25));
    }
  }

  zoomOut(): void {
    if (this.zoomLevel() > 0.5) {
      this.zoomLevel.update(z => Math.max(0.5, z - 0.25));
    }
  }

  resetZoom(): void {
    this.zoomLevel.set(1);
  }

  onWheel(event: WheelEvent): void {
    event.preventDefault();
    if (event.deltaY < 0) {
      this.zoomIn();
    } else {
      this.zoomOut();
    }
  }
}
