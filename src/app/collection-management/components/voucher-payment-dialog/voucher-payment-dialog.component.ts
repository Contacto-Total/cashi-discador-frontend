import { Component, Inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ComprobanteService } from '../../services/comprobante.service';
import { ComprobanteUploadResponse, ValidationResult } from '../../models/comprobante.model';

export interface VoucherPaymentDialogData {
  nombreCliente: string;
  documentoCliente: string;
  idCliente: number;
  idAgente: number;
  cuotas: CuotaPromesa[];
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
  autoSelect?: {
    categoriaId: string;
    detalleId: string;
    cuotaSeleccionada: CuotaPromesa;
    observaciones: string;
  };
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
    MatProgressSpinnerModule
  ],
  template: `
    <!-- Header -->
    <div class="bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-700 dark:to-emerald-700 text-white px-4 py-3 -mx-6 -mt-6 mb-3 rounded-t-2xl">
      <div class="flex items-center gap-2">
        <mat-icon class="!text-xl">payments</mat-icon>
        <div>
          <h2 class="text-base font-bold m-0">Registrar Pago con Voucher</h2>
          <p class="text-[10px] text-white/80 m-0">Validación automática con IA</p>
        </div>
      </div>
    </div>

    <mat-dialog-content class="!overflow-x-hidden !overflow-y-auto !w-full !p-0">
      <!-- Layout de dos columnas -->
      <div class="flex gap-3">
        <!-- Columna izquierda: Datos y validaciones -->
        <div class="flex-1 min-w-0 space-y-2">
          <!-- Info del cliente -->
          <div class="p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
            <div class="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span class="text-slate-500 dark:text-slate-400">Cliente:</span>
                <span class="font-semibold text-slate-800 dark:text-slate-100 ml-1 truncate">{{ data.nombreCliente }}</span>
              </div>
              <div>
                <span class="text-slate-500 dark:text-slate-400">Doc:</span>
                <span class="font-semibold text-slate-800 dark:text-slate-100 ml-1">{{ data.documentoCliente }}</span>
              </div>
            </div>
          </div>

          <!-- Cuotas pendientes -->
          <div class="p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <p class="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">Cuotas pendientes</p>
            <div class="flex flex-wrap gap-1">
              @for (cuota of cuotasPendientes(); track cuota.numeroCuota) {
                <div class="text-[11px] px-2 py-0.5 rounded"
                     [class]="cuota.numeroCuota === cuotaMasProxima()?.numeroCuota
                       ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 font-bold'
                       : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'">
                  C{{ cuota.numeroCuota }}: S/{{ cuota.monto | number:'1.2-2' }}
                </div>
              }
            </div>
            <p class="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
              Próxima: <span class="font-semibold text-green-600 dark:text-green-400">C{{ cuotaMasProxima()?.numeroCuota }} - S/{{ cuotaMasProxima()?.monto | number:'1.2-2' }}</span>
              ({{ formatDate(cuotaMasProxima()?.dueDate) }})
            </p>
          </div>

          <!-- Resultados de validación (solo si hay respuesta) -->
          @if (uploadResponse()) {
            <!-- Estado general -->
            <div class="p-2 rounded-lg flex items-center gap-2" [class]="getResultBgClass()">
              <mat-icon class="!text-lg">{{ getResultIcon() }}</mat-icon>
              <div class="flex-1 min-w-0">
                <p class="font-semibold text-xs">{{ getResultTitle() }}</p>
              </div>
            </div>

            <!-- Validaciones en fila -->
            @if (uploadResponse()?.ocrResult?.success) {
              <div class="grid grid-cols-3 gap-1">
                <!-- Monto -->
                <div class="p-2 rounded-lg border text-center" [class]="getValidationCardClass(uploadResponse()?.validacionMonto)">
                  <p class="text-[9px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Monto</p>
                  <p class="text-sm font-bold text-slate-800 dark:text-slate-100">S/{{ uploadResponse()?.ocrResult?.monto | number:'1.2-2' }}</p>
                  <mat-icon class="!text-sm" [class]="uploadResponse()?.validacionMonto?.coincide ? 'text-green-500' : 'text-amber-500'">
                    {{ uploadResponse()?.validacionMonto?.coincide ? 'check_circle' : 'warning' }}
                  </mat-icon>
                </div>
                <!-- Documento -->
                <div class="p-2 rounded-lg border text-center" [class]="getValidationCardClass(uploadResponse()?.validacionDocumento)">
                  <p class="text-[9px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Documento</p>
                  <p class="text-[11px] font-bold text-slate-800 dark:text-slate-100 truncate">{{ uploadResponse()?.ocrResult?.documento || '-' }}</p>
                  <mat-icon class="!text-sm" [class]="uploadResponse()?.validacionDocumento?.coincide ? 'text-green-500' : 'text-amber-500'">
                    {{ uploadResponse()?.validacionDocumento?.coincide ? 'check_circle' : 'warning' }}
                  </mat-icon>
                </div>
                <!-- Nombre -->
                <div class="p-2 rounded-lg border text-center" [class]="getValidationCardClass(uploadResponse()?.validacionNombre)">
                  <p class="text-[9px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Nombre</p>
                  <p class="text-[11px] font-bold text-slate-800 dark:text-slate-100 truncate">{{ uploadResponse()?.ocrResult?.nombre || '-' }}</p>
                  <mat-icon class="!text-sm" [class]="uploadResponse()?.validacionNombre?.coincide ? 'text-green-500' : 'text-amber-500'">
                    {{ uploadResponse()?.validacionNombre?.coincide ? 'check_circle' : 'warning' }}
                  </mat-icon>
                </div>
              </div>

              <!-- Info adicional -->
              @if (uploadResponse()?.ocrResult?.banco || uploadResponse()?.ocrResult?.numeroOperacion) {
                <div class="p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-[11px] flex flex-wrap gap-3">
                  @if (uploadResponse()?.ocrResult?.banco) {
                    <span><mat-icon class="!text-xs align-middle text-slate-400">account_balance</mat-icon> {{ uploadResponse()?.ocrResult?.banco }}</span>
                  }
                  @if (uploadResponse()?.ocrResult?.numeroOperacion) {
                    <span><mat-icon class="!text-xs align-middle text-slate-400">tag</mat-icon> {{ uploadResponse()?.ocrResult?.numeroOperacion }}</span>
                  }
                  @if (uploadResponse()?.ocrResult?.fecha) {
                    <span><mat-icon class="!text-xs align-middle text-slate-400">event</mat-icon> {{ uploadResponse()?.ocrResult?.fecha }}</span>
                  }
                </div>
              }

              <!-- Cuota seleccionada -->
              <div class="p-2 rounded-lg border-2" [class]="cuotaCoincidente() ? 'bg-green-50 dark:bg-green-950/30 border-green-400' : 'bg-amber-50 dark:bg-amber-950/30 border-amber-400'">
                <div class="flex items-center gap-1 text-xs">
                  <mat-icon class="!text-sm" [class]="cuotaCoincidente() ? 'text-green-600' : 'text-amber-600'">
                    {{ cuotaCoincidente() ? 'check_circle' : 'info' }}
                  </mat-icon>
                  <span class="font-semibold" [class]="cuotaCoincidente() ? 'text-green-800 dark:text-green-200' : 'text-amber-800 dark:text-amber-200'">
                    Se registrará: Cuota {{ (cuotaCoincidente() || cuotaMasProxima())?.numeroCuota }}
                    (S/{{ (cuotaCoincidente() || cuotaMasProxima())?.monto | number:'1.2-2' }})
                  </span>
                </div>
              </div>

              <!-- Auto-completar info -->
              <div class="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                <p class="text-[10px] text-blue-700 dark:text-blue-300 font-semibold flex items-center gap-1">
                  <mat-icon class="!text-xs">auto_awesome</mat-icon>
                  Al confirmar se seleccionará: Contacto Directo → Cancelación
                </p>
              </div>
            }
          }

          <!-- Error -->
          @if (errorMessage()) {
            <div class="p-2 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800 flex items-center gap-2">
              <mat-icon class="text-red-500 !text-sm">error</mat-icon>
              <p class="text-xs text-red-700 dark:text-red-300">{{ errorMessage() }}</p>
            </div>
          }
        </div>

        <!-- Columna derecha: Imagen -->
        <div class="w-80 flex-shrink-0">
          <div class="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 overflow-hidden h-full flex flex-col">
            <div class="p-1.5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-white dark:bg-slate-800">
              <span class="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase">Voucher</span>
              @if (previewUrl()) {
                <div class="flex items-center gap-0.5">
                  <button mat-icon-button class="!w-6 !h-6" (click)="zoomOut()" [disabled]="zoomLevel() <= 0.5">
                    <mat-icon class="!text-sm text-slate-500">remove</mat-icon>
                  </button>
                  <span class="text-[10px] text-slate-500 w-8 text-center">{{ (zoomLevel() * 100) | number:'1.0-0' }}%</span>
                  <button mat-icon-button class="!w-6 !h-6" (click)="zoomIn()" [disabled]="zoomLevel() >= 3">
                    <mat-icon class="!text-sm text-slate-500">add</mat-icon>
                  </button>
                  <button mat-icon-button class="!w-6 !h-6 !ml-1" (click)="removeFile()">
                    <mat-icon class="!text-sm text-red-500">delete</mat-icon>
                  </button>
                </div>
              }
            </div>

            <!-- Área de imagen / upload -->
            <div class="flex-1 min-h-[280px] flex items-center justify-center bg-white dark:bg-slate-900 relative">
              @if (!previewUrl()) {
                <!-- Drag & drop area -->
                <div
                  class="absolute inset-2 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-green-500 hover:bg-green-50/50 dark:hover:bg-green-950/20 transition-all"
                  (click)="fileInput.click()"
                  (dragover)="onDragOver($event)"
                  (drop)="onDrop($event)"
                >
                  <mat-icon class="!text-4xl text-slate-400 dark:text-slate-500 mb-2">cloud_upload</mat-icon>
                  <p class="text-xs text-slate-600 dark:text-slate-300 font-semibold">Arrastra aquí</p>
                  <p class="text-[10px] text-slate-500 dark:text-slate-400">o haz clic</p>
                  <p class="text-[9px] text-slate-400 mt-2">JPG, PNG, WebP - Max 5MB</p>
                </div>
                <input #fileInput type="file" accept="image/jpeg,image/png,image/webp" class="hidden" (change)="onFileSelected($event)" />
              } @else {
                <!-- Preview con zoom -->
                <div class="overflow-auto w-full h-full" (wheel)="onWheel($event)" style="cursor: grab;">
                  <img [src]="previewUrl()"
                       alt="Voucher"
                       class="transition-transform duration-150"
                       [style.transform]="'scale(' + zoomLevel() + ')'"
                       [style.transform-origin]="'top left'" />
                </div>

                <!-- Spinner overlay -->
                @if (isUploading()) {
                  <div class="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div class="text-center">
                      <mat-spinner diameter="40" class="mx-auto"></mat-spinner>
                      <p class="text-white text-xs mt-2 font-semibold">Analizando...</p>
                    </div>
                  </div>
                }
              }
            </div>
          </div>
        </div>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="end" class="!px-4 !py-2 border-t border-slate-200 dark:border-slate-700 gap-2 bg-slate-50 dark:bg-slate-800/50 -mx-6 -mb-6 rounded-b-2xl">
      <button mat-button class="!text-slate-600 dark:!text-slate-300 !rounded-lg !px-3 !text-xs" (click)="cancel()">
        Cancelar
      </button>

      @if (!uploadResponse()) {
        <button mat-raised-button [disabled]="!selectedFile() || isUploading()" (click)="upload()"
          class="!px-4 !rounded-lg !bg-green-600 hover:!bg-green-700 !text-white !text-xs">
          <mat-icon class="!text-sm mr-1">search</mat-icon>
          Analizar
        </button>
      } @else {
        <button mat-raised-button (click)="confirm()"
          class="!px-4 !rounded-lg !text-xs !text-white"
          [class]="showWarning() ? '!bg-amber-500 hover:!bg-amber-600' : '!bg-green-600 hover:!bg-green-700'">
          <mat-icon class="!text-sm mr-1">done_all</mat-icon>
          Confirmar Pago
        </button>
      }
    </mat-dialog-actions>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class VoucherPaymentDialogComponent {
  selectedFile = signal<File | null>(null);
  previewUrl = signal<string>('');
  isUploading = signal(false);
  uploadResponse = signal<ComprobanteUploadResponse | null>(null);
  errorMessage = signal<string>('');
  zoomLevel = signal<number>(1);

  cuotasPendientes = computed(() => {
    return this.data.cuotas
      .filter(c => c.status !== 'PAGADA' && c.status !== 'PAGADO' && c.status !== 'CUMPLIDO' && c.status !== 'CANCELADA')
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  });

  cuotaMasProxima = computed(() => {
    const pendientes = this.cuotasPendientes();
    return pendientes.length > 0 ? pendientes[0] : null;
  });

  cuotaCoincidente = computed(() => {
    const response = this.uploadResponse();
    if (!response?.ocrResult?.monto) return null;
    const montoVoucher = response.ocrResult.monto;
    const pendientes = this.cuotasPendientes();
    return pendientes.find(c => Math.abs(c.monto - montoVoucher) < 0.01) || null;
  });

  showWarning = computed(() => {
    const response = this.uploadResponse();
    if (!response) return false;
    return (
      (response.validacionMonto && !response.validacionMonto.coincide) ||
      (response.validacionDocumento && !response.validacionDocumento.coincide) ||
      (response.validacionNombre && !response.validacionNombre.coincide)
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
    if (files && files.length > 0) this.handleFile(files[0]);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) this.handleFile(input.files[0]);
  }

  private handleFile(file: File): void {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      this.errorMessage.set('Solo JPG, PNG o WebP.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      this.errorMessage.set('Máximo 5MB.');
      return;
    }
    this.errorMessage.set('');
    this.selectedFile.set(file);
    this.uploadResponse.set(null);

    const reader = new FileReader();
    reader.onload = () => this.previewUrl.set(reader.result as string);
    reader.readAsDataURL(file);
  }

  removeFile(): void {
    this.selectedFile.set(null);
    this.previewUrl.set('');
    this.uploadResponse.set(null);
    this.errorMessage.set('');
    this.zoomLevel.set(1);
  }

  upload(): void {
    const file = this.selectedFile();
    const cuota = this.cuotaMasProxima();
    if (!file || !cuota) return;

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
        if (!response.success) this.errorMessage.set(response.error || 'Error al procesar');
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
    if (!cuotaSeleccionada) return;

    const ocrData = response?.ocrResult;
    let observaciones = 'Pago validado por OCR';
    if (ocrData?.banco) observaciones += ` - ${ocrData.banco}`;
    if (ocrData?.numeroOperacion) observaciones += ` - Op. #${ocrData.numeroOperacion}`;
    if (ocrData?.fecha) observaciones += ` - Fecha: ${ocrData.fecha}`;
    if (ocrData?.monto) observaciones += ` - Monto: S/ ${ocrData.monto.toFixed(2)}`;

    this.dialogRef.close({
      confirmed: true,
      autoSelect: {
        categoriaId: 'CD',
        detalleId: 'CA',
        cuotaSeleccionada,
        observaciones
      },
      ocrResponse: response || undefined
    } as VoucherPaymentDialogResult);
  }

  cancel(): void {
    this.dialogRef.close({ confirmed: false });
  }

  formatDate(dateValue?: string): string {
    if (!dateValue) return '-';
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
      const [y, m, d] = dateValue.split('-').map(Number);
      return new Date(y, m - 1, d).toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }
    return dateValue;
  }

  getResultBgClass(): string {
    const r = this.uploadResponse();
    if (!r?.success) return 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300';
    if (this.showWarning()) return 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300';
    return 'bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300';
  }

  getResultIcon(): string {
    const r = this.uploadResponse();
    if (!r?.success) return 'error';
    if (this.showWarning()) return 'warning';
    return 'check_circle';
  }

  getResultTitle(): string {
    const r = this.uploadResponse();
    if (!r?.success) return 'Error al procesar';
    if (this.showWarning()) return 'Voucher con advertencias';
    return 'Voucher validado';
  }

  getValidationCardClass(v?: ValidationResult): string {
    if (!v) return 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50';
    return v.coincide
      ? 'border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-950/30'
      : 'border-amber-300 dark:border-amber-600 bg-amber-50 dark:bg-amber-950/30';
  }

  zoomIn(): void { if (this.zoomLevel() < 3) this.zoomLevel.update(z => z + 0.25); }
  zoomOut(): void { if (this.zoomLevel() > 0.5) this.zoomLevel.update(z => z - 0.25); }

  onWheel(event: WheelEvent): void {
    event.preventDefault();
    event.deltaY < 0 ? this.zoomIn() : this.zoomOut();
  }
}
