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
    <h2 mat-dialog-title class="flex items-center gap-2">
      <mat-icon>receipt_long</mat-icon>
      Subir Comprobante de Pago
    </h2>

    <mat-dialog-content class="min-w-[400px]">
      <!-- Info de la cuota -->
      <div class="mb-4 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
        <p class="text-sm"><strong>Cliente:</strong> {{ data.nombreCliente }}</p>
        <p class="text-sm"><strong>Documento:</strong> {{ data.documentoEsperado }}</p>
        <p class="text-sm"><strong>Monto esperado:</strong> S/ {{ data.montoEsperado | number:'1.2-2' }}</p>
      </div>

      <!-- Área de drag & drop -->
      @if (!selectedFile()) {
        <div
          class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors"
          (click)="fileInput.click()"
          (dragover)="onDragOver($event)"
          (drop)="onDrop($event)"
        >
          <mat-icon class="text-5xl text-gray-400 mb-2">cloud_upload</mat-icon>
          <p class="text-gray-600 dark:text-gray-400">
            Arrastra una imagen aquí o <span class="text-blue-600 font-medium">haz clic para seleccionar</span>
          </p>
          <p class="text-xs text-gray-500 mt-2">
            Formatos permitidos: JPG, PNG, WebP (max 5MB)
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

      <!-- Preview de imagen seleccionada -->
      @if (selectedFile() && !isUploading() && !uploadResponse()) {
        <div class="relative">
          <img
            [src]="previewUrl()"
            alt="Preview"
            class="w-full max-h-64 object-contain rounded-lg border"
          />
          <button
            mat-icon-button
            class="absolute top-2 right-2 bg-red-500 text-white hover:bg-red-600"
            (click)="removeFile()"
          >
            <mat-icon>close</mat-icon>
          </button>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center">
            {{ selectedFile()?.name }} ({{ formatFileSize(selectedFile()?.size || 0) }})
          </p>
        </div>
      }

      <!-- Progress bar mientras sube -->
      @if (isUploading()) {
        <div class="py-8 text-center">
          <mat-spinner diameter="48" class="mx-auto mb-4"></mat-spinner>
          <p class="text-gray-600 dark:text-gray-400">Subiendo y analizando comprobante...</p>
          <p class="text-xs text-gray-500 mt-1">Esto puede tardar unos segundos</p>
        </div>
      }

      <!-- Resultado del OCR -->
      @if (uploadResponse()) {
        <div class="space-y-3">
          <!-- Mensaje general -->
          <div
            class="p-3 rounded-lg"
            [class]="getResultBgClass()"
          >
            <p class="font-medium">{{ uploadResponse()?.mensaje }}</p>
          </div>

          <!-- Detalles de validación -->
          @if (uploadResponse()?.ocrResult?.success) {
            <div class="grid grid-cols-2 gap-3 text-sm">
              <!-- Monto -->
              <div class="p-2 rounded border" [class]="getValidationClass(uploadResponse()?.validacionMonto)">
                <p class="text-gray-500 text-xs">Monto extraído</p>
                <p class="font-bold">S/ {{ uploadResponse()?.ocrResult?.monto | number:'1.2-2' }}</p>
                @if (uploadResponse()?.validacionMonto) {
                  <p class="text-xs mt-1">
                    {{ uploadResponse()?.validacionMonto?.coincide ? '✅ Coincide' : '⚠️ ' + uploadResponse()?.validacionMonto?.mensaje }}
                  </p>
                }
              </div>

              <!-- Documento -->
              <div class="p-2 rounded border" [class]="getValidationClass(uploadResponse()?.validacionDocumento)">
                <p class="text-gray-500 text-xs">Documento extraído</p>
                <p class="font-bold">{{ uploadResponse()?.ocrResult?.documento || 'No detectado' }}</p>
                @if (uploadResponse()?.validacionDocumento) {
                  <p class="text-xs mt-1">
                    {{ uploadResponse()?.validacionDocumento?.coincide ? '✅ Coincide' : '⚠️ ' + uploadResponse()?.validacionDocumento?.mensaje }}
                  </p>
                }
              </div>
            </div>

            <!-- Info adicional del OCR -->
            @if (uploadResponse()?.ocrResult?.banco || uploadResponse()?.ocrResult?.numeroOperacion) {
              <div class="p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm">
                @if (uploadResponse()?.ocrResult?.banco) {
                  <p><strong>Banco:</strong> {{ uploadResponse()?.ocrResult?.banco }}</p>
                }
                @if (uploadResponse()?.ocrResult?.numeroOperacion) {
                  <p><strong>N° Operación:</strong> {{ uploadResponse()?.ocrResult?.numeroOperacion }}</p>
                }
                @if (uploadResponse()?.ocrResult?.fecha) {
                  <p><strong>Fecha:</strong> {{ uploadResponse()?.ocrResult?.fecha }}</p>
                }
              </div>
            }
          } @else if (uploadResponse()?.ocrResult && !uploadResponse()?.ocrResult?.success) {
            <div class="p-3 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg text-yellow-800 dark:text-yellow-200">
              <p class="text-sm">
                <mat-icon class="text-base align-middle">warning</mat-icon>
                No se pudo analizar el comprobante automáticamente.
              </p>
              <p class="text-xs mt-1">El comprobante se guardó pero no fue validado.</p>
            </div>
          }

          <!-- Advertencia si no coincide -->
          @if (showWarning()) {
            <div class="p-3 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-lg">
              <p class="text-orange-800 dark:text-orange-200 text-sm font-medium">
                <mat-icon class="text-base align-middle">warning</mat-icon>
                Hay diferencias en la validación
              </p>
              <p class="text-orange-700 dark:text-orange-300 text-xs mt-1">
                Puedes continuar, pero verifica que el comprobante sea correcto.
              </p>
            </div>
          }
        </div>
      }

      <!-- Error -->
      @if (errorMessage()) {
        <div class="p-3 bg-red-50 dark:bg-red-950/30 rounded-lg text-red-700 dark:text-red-300">
          <mat-icon class="text-base align-middle">error</mat-icon>
          {{ errorMessage() }}
        </div>
      }
    </mat-dialog-content>

    <mat-dialog-actions align="end" class="gap-2">
      <button mat-button (click)="cancel()">
        Cancelar
      </button>

      @if (!uploadResponse()) {
        <button
          mat-raised-button
          color="primary"
          [disabled]="!selectedFile() || isUploading()"
          (click)="upload()"
        >
          @if (isUploading()) {
            <mat-spinner diameter="20" class="mr-2"></mat-spinner>
          }
          Subir y Validar
        </button>
      } @else {
        <button
          mat-raised-button
          color="primary"
          (click)="confirm()"
        >
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
    if (this.showWarning()) return 'bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300';
    return 'bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300';
  }

  getValidationClass(validation?: ValidationResult): string {
    if (!validation) return 'border-gray-200 dark:border-gray-700';
    return validation.coincide
      ? 'border-green-300 bg-green-50 dark:bg-green-950/20'
      : 'border-orange-300 bg-orange-50 dark:bg-orange-950/20';
  }
}
