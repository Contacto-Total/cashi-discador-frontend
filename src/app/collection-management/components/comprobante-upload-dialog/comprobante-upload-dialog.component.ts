import { Component, Inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ComprobanteService } from '../../services/comprobante.service';
import { ComprobanteUploadResponse, ValidationResult } from '../../models/comprobante.model';

export interface ComprobanteUploadDialogData {
  idCuota: number;
  montoEsperado: number;
  documentoEsperado: string;
  nombreCliente: string;
  idAgente: number;
}

export interface ComprobanteUploadDialogResult {
  uploaded: boolean;
  response?: ComprobanteUploadResponse;
  validacionesOk: boolean;
}

@Component({
  selector: 'app-comprobante-upload-dialog',
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
    <!-- Header mejorado -->
    <div class="dialog-header bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-700 dark:to-primary-800 text-white px-6 py-4 -mx-6 -mt-6 mb-6 rounded-t-lg">
      <div class="flex items-center gap-3">
        <div class="p-2 bg-white/20 rounded-lg">
          <mat-icon class="text-2xl">receipt_long</mat-icon>
        </div>
        <div>
          <h2 class="text-xl font-semibold m-0">Subir Comprobante de Pago</h2>
          <p class="text-sm text-white/80 m-0">Valida automáticamente con IA</p>
        </div>
      </div>
    </div>

    <mat-dialog-content class="!min-w-[500px] !max-w-[600px]">
      <!-- Info de la cuota - Card mejorada -->
      <div class="mb-5 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
        <div class="grid grid-cols-3 gap-4">
          <div>
            <p class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Cliente</p>
            <p class="font-semibold text-slate-800 dark:text-slate-200">{{ data.nombreCliente }}</p>
          </div>
          <div>
            <p class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Documento</p>
            <p class="font-semibold text-slate-800 dark:text-slate-200">{{ data.documentoEsperado }}</p>
          </div>
          <div>
            <p class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Monto esperado</p>
            <p class="font-bold text-lg text-primary-600 dark:text-primary-400">S/ {{ data.montoEsperado | number:'1.2-2' }}</p>
          </div>
        </div>
      </div>

      <!-- Área de drag & drop mejorada -->
      @if (!selectedFile()) {
        <div
          class="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-10 text-center cursor-pointer
                 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-950/20
                 transition-all duration-200 group"
          (click)="fileInput.click()"
          (dragover)="onDragOver($event)"
          (drop)="onDrop($event)"
        >
          <div class="w-16 h-16 mx-auto mb-4 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 transition-colors">
            <mat-icon class="!text-4xl text-slate-400 group-hover:text-primary-500 transition-colors">cloud_upload</mat-icon>
          </div>
          <p class="text-slate-600 dark:text-slate-300 font-medium mb-1">
            Arrastra una imagen aquí
          </p>
          <p class="text-slate-500 dark:text-slate-400 text-sm">
            o <span class="text-primary-600 dark:text-primary-400 font-semibold hover:underline">haz clic para seleccionar</span>
          </p>
          <p class="text-xs text-slate-400 dark:text-slate-500 mt-3">
            JPG, PNG, WebP • Máximo 5MB
          </p>
        </div>
        <input
          #fileInput
          type="file"
          accept="image/jpeg,image/png,image/webp"
          class="hidden"
          (change)="onFileSelected($event)"
        />
      }

      <!-- Preview de imagen seleccionada mejorado -->
      @if (selectedFile() && !isUploading() && !uploadResponse()) {
        <div class="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <img
            [src]="previewUrl()"
            alt="Preview"
            class="w-full max-h-72 object-contain p-2"
          />
          <button
            mat-icon-button
            class="!absolute top-2 right-2 !bg-red-500 !text-white hover:!bg-red-600 shadow-lg"
            (click)="removeFile()"
          >
            <mat-icon>close</mat-icon>
          </button>
          <div class="px-4 py-3 bg-slate-100 dark:bg-slate-700/50 border-t border-slate-200 dark:border-slate-600">
            <p class="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2">
              <mat-icon class="text-base">insert_drive_file</mat-icon>
              {{ selectedFile()?.name }}
              <span class="text-slate-400">•</span>
              <span class="text-slate-500">{{ formatFileSize(selectedFile()?.size || 0) }}</span>
            </p>
          </div>
        </div>
      }

      <!-- Spinner mientras analiza - MEJORADO -->
      @if (isUploading()) {
        <div class="py-12 text-center">
          <div class="relative inline-block">
            <!-- Spinner exterior -->
            <div class="w-20 h-20 border-4 border-primary-200 dark:border-primary-900 rounded-full animate-pulse"></div>
            <!-- Spinner interior -->
            <mat-spinner diameter="64" class="!absolute top-2 left-2" strokeWidth="4"></mat-spinner>
            <!-- Icono central -->
            <div class="absolute inset-0 flex items-center justify-center">
              <mat-icon class="text-primary-500 animate-pulse">document_scanner</mat-icon>
            </div>
          </div>
          <p class="text-slate-700 dark:text-slate-200 font-medium mt-6">Analizando comprobante con IA...</p>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-2">Extrayendo monto, fecha y datos del pago</p>
          <div class="flex justify-center gap-1 mt-4">
            <span class="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style="animation-delay: 0ms"></span>
            <span class="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style="animation-delay: 150ms"></span>
            <span class="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style="animation-delay: 300ms"></span>
          </div>
        </div>
      }

      <!-- Resultado del OCR mejorado -->
      @if (uploadResponse()) {
        <div class="space-y-4">
          <!-- Mensaje general con icono grande -->
          <div class="p-4 rounded-xl flex items-center gap-4" [class]="getResultBgClass()">
            <div class="p-3 rounded-full" [class]="getResultIconBgClass()">
              <mat-icon class="!text-2xl">{{ getResultIcon() }}</mat-icon>
            </div>
            <div>
              <p class="font-semibold text-lg">{{ getResultTitle() }}</p>
              <p class="text-sm opacity-80">{{ uploadResponse()?.mensaje }}</p>
            </div>
          </div>

          <!-- Detalles de validación mejorados -->
          @if (uploadResponse()?.ocrResult?.success) {
            <div class="grid grid-cols-2 gap-4">
              <!-- Monto -->
              <div class="p-4 rounded-xl border-2 transition-all" [class]="getValidationCardClass(uploadResponse()?.validacionMonto)">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Monto extraído</span>
                  @if (uploadResponse()?.validacionMonto) {
                    <mat-icon class="!text-lg" [class]="uploadResponse()?.validacionMonto?.coincide ? 'text-green-500' : 'text-amber-500'">
                      {{ uploadResponse()?.validacionMonto?.coincide ? 'check_circle' : 'warning' }}
                    </mat-icon>
                  }
                </div>
                <p class="text-2xl font-bold text-slate-800 dark:text-slate-100">
                  S/ {{ uploadResponse()?.ocrResult?.monto | number:'1.2-2' }}
                </p>
                @if (uploadResponse()?.validacionMonto) {
                  <p class="text-xs mt-2" [class]="uploadResponse()?.validacionMonto?.coincide ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'">
                    {{ uploadResponse()?.validacionMonto?.coincide ? '✓ Coincide con el monto esperado' : uploadResponse()?.validacionMonto?.mensaje }}
                  </p>
                }
              </div>

              <!-- Documento -->
              <div class="p-4 rounded-xl border-2 transition-all" [class]="getValidationCardClass(uploadResponse()?.validacionDocumento)">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Documento extraído</span>
                  @if (uploadResponse()?.validacionDocumento) {
                    <mat-icon class="!text-lg" [class]="uploadResponse()?.validacionDocumento?.coincide ? 'text-green-500' : 'text-amber-500'">
                      {{ uploadResponse()?.validacionDocumento?.coincide ? 'check_circle' : 'warning' }}
                    </mat-icon>
                  }
                </div>
                <p class="text-2xl font-bold text-slate-800 dark:text-slate-100">
                  {{ uploadResponse()?.ocrResult?.documento || 'No detectado' }}
                </p>
                @if (uploadResponse()?.validacionDocumento) {
                  <p class="text-xs mt-2" [class]="uploadResponse()?.validacionDocumento?.coincide ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'">
                    {{ uploadResponse()?.validacionDocumento?.coincide ? '✓ Coincide' : uploadResponse()?.validacionDocumento?.mensaje }}
                  </p>
                }
              </div>
            </div>

            <!-- Info adicional del OCR mejorada -->
            @if (uploadResponse()?.ocrResult?.banco || uploadResponse()?.ocrResult?.numeroOperacion || uploadResponse()?.ocrResult?.fecha) {
              <div class="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                <p class="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-3">Datos adicionales detectados</p>
                <div class="grid grid-cols-3 gap-4">
                  @if (uploadResponse()?.ocrResult?.banco) {
                    <div>
                      <p class="text-xs text-slate-500 dark:text-slate-400">Banco</p>
                      <p class="font-semibold text-slate-800 dark:text-slate-200">{{ uploadResponse()?.ocrResult?.banco }}</p>
                    </div>
                  }
                  @if (uploadResponse()?.ocrResult?.numeroOperacion) {
                    <div>
                      <p class="text-xs text-slate-500 dark:text-slate-400">N° Operación</p>
                      <p class="font-semibold text-slate-800 dark:text-slate-200">{{ uploadResponse()?.ocrResult?.numeroOperacion }}</p>
                    </div>
                  }
                  @if (uploadResponse()?.ocrResult?.fecha) {
                    <div>
                      <p class="text-xs text-slate-500 dark:text-slate-400">Fecha</p>
                      <p class="font-semibold text-slate-800 dark:text-slate-200">{{ uploadResponse()?.ocrResult?.fecha }}</p>
                    </div>
                  }
                </div>
              </div>
            }
          } @else if (uploadResponse()?.ocrResult && !uploadResponse()?.ocrResult?.success) {
            <div class="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800 flex items-start gap-3">
              <mat-icon class="text-amber-500 mt-0.5">info</mat-icon>
              <div>
                <p class="font-medium text-amber-800 dark:text-amber-200">Comprobante guardado (sin validación OCR)</p>
                <p class="text-sm text-amber-700 dark:text-amber-300 mt-1">
                  No se pudo analizar el comprobante automáticamente.<br>
                  El comprobante se guardó pero no fue validado.
                </p>
              </div>
            </div>
          }

          <!-- Advertencia si no coincide -->
          @if (showWarning()) {
            <div class="p-4 bg-amber-50 dark:bg-amber-950/30 border-2 border-amber-300 dark:border-amber-700 rounded-xl flex items-start gap-3">
              <div class="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-lg">
                <mat-icon class="text-amber-600 dark:text-amber-400">warning</mat-icon>
              </div>
              <div>
                <p class="text-amber-800 dark:text-amber-200 font-semibold">Hay diferencias en la validación</p>
                <p class="text-amber-700 dark:text-amber-300 text-sm mt-1">
                  Puedes continuar, pero verifica visualmente que el comprobante sea correcto.
                </p>
              </div>
            </div>
          }
        </div>
      }

      <!-- Error mejorado -->
      @if (errorMessage()) {
        <div class="p-4 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-200 dark:border-red-800 flex items-start gap-3">
          <mat-icon class="text-red-500">error</mat-icon>
          <div>
            <p class="font-medium text-red-800 dark:text-red-200">Error</p>
            <p class="text-sm text-red-700 dark:text-red-300">{{ errorMessage() }}</p>
          </div>
        </div>
      }
    </mat-dialog-content>

    <mat-dialog-actions align="end" class="!px-6 !py-4 border-t border-slate-200 dark:border-slate-700 gap-3">
      <button mat-button class="!text-slate-600 dark:!text-slate-400" (click)="cancel()">
        Cancelar
      </button>

      @if (!uploadResponse()) {
        <button
          mat-raised-button
          color="primary"
          [disabled]="!selectedFile() || isUploading()"
          (click)="upload()"
          class="!px-6"
        >
          @if (isUploading()) {
            <mat-spinner diameter="18" class="mr-2"></mat-spinner>
          } @else {
            <mat-icon class="mr-1">upload</mat-icon>
          }
          Subir y Validar
        </button>
      } @else {
        <button
          mat-raised-button
          [color]="showWarning() ? 'warn' : 'primary'"
          (click)="confirm()"
          class="!px-6"
        >
          <mat-icon class="mr-1">{{ showWarning() ? 'check' : 'done_all' }}</mat-icon>
          {{ showWarning() ? 'Continuar de todos modos' : 'Confirmar' }}
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
export class ComprobanteUploadDialogComponent {
  // Signals
  selectedFile = signal<File | null>(null);
  previewUrl = signal<string>('');
  isUploading = signal(false);
  uploadResponse = signal<ComprobanteUploadResponse | null>(null);
  errorMessage = signal<string>('');

  // Computed
  showWarning = computed(() => {
    const response = this.uploadResponse();
    if (!response) return false;
    return (
      (response.validacionMonto && !response.validacionMonto.coincide) ||
      (response.validacionDocumento && !response.validacionDocumento.coincide)
    );
  });

  constructor(
    public dialogRef: MatDialogRef<ComprobanteUploadDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ComprobanteUploadDialogData,
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
    // Validar tipo
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      this.errorMessage.set('Tipo de archivo no permitido. Solo JPG, PNG o WebP.');
      return;
    }

    // Validar tamaño (5MB)
    if (file.size > 5 * 1024 * 1024) {
      this.errorMessage.set('El archivo es muy grande. Máximo 5MB.');
      return;
    }

    this.errorMessage.set('');
    this.selectedFile.set(file);

    // Crear preview
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

    this.isUploading.set(true);
    this.errorMessage.set('');

    this.comprobanteService.uploadComprobante(file, {
      idCuota: this.data.idCuota,
      montoEsperado: this.data.montoEsperado,
      documentoEsperado: this.data.documentoEsperado,
      idAgente: this.data.idAgente
    }).subscribe({
      next: (response) => {
        this.isUploading.set(false);
        this.uploadResponse.set(response);
        if (!response.success) {
          this.errorMessage.set(response.error || 'Error al procesar el comprobante');
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
    const result: ComprobanteUploadDialogResult = {
      uploaded: true,
      response: response || undefined,
      validacionesOk: !this.showWarning()
    };
    this.dialogRef.close(result);
  }

  cancel(): void {
    this.dialogRef.close({ uploaded: false, validacionesOk: false });
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
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
    if (this.showWarning()) return 'Comprobante con advertencias';
    return 'Comprobante validado';
  }

  getValidationClass(validation?: ValidationResult): string {
    if (!validation) return 'border-slate-200 dark:border-slate-700';
    return validation.coincide
      ? 'border-green-300 bg-green-50 dark:bg-green-950/20'
      : 'border-amber-300 bg-amber-50 dark:bg-amber-950/20';
  }

  getValidationCardClass(validation?: ValidationResult): string {
    if (!validation) return 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50';
    return validation.coincide
      ? 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-950/20'
      : 'border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/20';
  }
}
