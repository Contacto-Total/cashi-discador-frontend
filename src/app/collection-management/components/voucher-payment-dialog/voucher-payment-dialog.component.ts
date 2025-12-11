import { Component, Inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
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
  montoPagadoReal?: number;
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
    <div class="voucher-dialog" [class.dark-mode]="isDarkMode()">
      <!-- Header elegante -->
      <div class="dialog-header">
        <div class="header-content">
          <div class="header-icon">
            <mat-icon>receipt_long</mat-icon>
          </div>
          <div class="header-text">
            <h2>Registrar Pago</h2>
            <span class="header-subtitle">
              <mat-icon class="inline-icon">smart_toy</mat-icon>
              Validación automática con IA
            </span>
          </div>
        </div>
        <button mat-icon-button class="close-btn" (click)="cancel()">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <mat-dialog-content class="dialog-body">
        <div class="two-column-layout">
          <!-- Columna izquierda: Información y validaciones -->
          <div class="left-column">
            <!-- Card de información del cliente -->
            <div class="info-card client-card">
              <div class="card-header">
                <mat-icon>person</mat-icon>
                <span>Información del Cliente</span>
              </div>
              <div class="card-body">
                <div class="info-row">
                  <div class="info-item">
                    <span class="info-label">Cliente</span>
                    <span class="info-value">{{ data.nombreCliente }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Documento</span>
                    <span class="info-value highlight">{{ data.documentoCliente }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Card de cuotas pendientes -->
            <div class="info-card installments-card">
              <div class="card-header">
                <mat-icon>payments</mat-icon>
                <span>Cuotas Pendientes</span>
              </div>
              <div class="card-body">
                <div class="installments-grid">
                  @for (cuota of cuotasPendientes(); track cuota.numeroCuota) {
                    <div class="installment-chip" [class.active]="cuota.numeroCuota === cuotaMasProxima()?.numeroCuota">
                      <span class="chip-number">C{{ cuota.numeroCuota }}</span>
                      @if (cuota.montoPagadoReal && cuota.montoPagadoReal > 0) {
                        <span class="chip-amount-original">S/{{ cuota.monto | number:'1.2-2' }}</span>
                        <span class="chip-amount">S/{{ getSaldoPendiente(cuota) | number:'1.2-2' }}</span>
                      } @else {
                        <span class="chip-amount">S/{{ cuota.monto | number:'1.2-2' }}</span>
                      }
                    </div>
                  }
                </div>
                <div class="next-installment">
                  <mat-icon>arrow_forward</mat-icon>
                  <span>Próxima cuota:</span>
                  @if (cuotaMasProxima()?.montoPagadoReal && cuotaMasProxima()!.montoPagadoReal! > 0) {
                    <strong>C{{ cuotaMasProxima()?.numeroCuota }} - S/{{ getSaldoPendiente(cuotaMasProxima()!) | number:'1.2-2' }}</strong>
                    <span class="partial-badge">Parcial</span>
                  } @else {
                    <strong>C{{ cuotaMasProxima()?.numeroCuota }} - S/{{ cuotaMasProxima()?.monto | number:'1.2-2' }}</strong>
                  }
                  <span class="date-badge">{{ formatDate(cuotaMasProxima()?.dueDate) }}</span>
                </div>
              </div>
            </div>

            <!-- Resultados de validación OCR -->
            @if (uploadResponse()) {
              <!-- Estado general -->
              <div class="result-banner" [class]="getResultClass()">
                <div class="result-icon">
                  <mat-icon>{{ getResultIcon() }}</mat-icon>
                </div>
                <div class="result-text">
                  <span class="result-title">{{ getResultTitle() }}</span>
                  <span class="result-subtitle">{{ getResultSubtitle() }}</span>
                </div>
              </div>

              @if (uploadResponse()?.ocrResult?.success) {
                <!-- Grid de validaciones -->
                <div class="validations-grid">
                  <!-- Monto -->
                  <div class="validation-card" [class]="getValidationClass(uploadResponse()?.validacionMonto)">
                    <div class="validation-icon">
                      <mat-icon>{{ uploadResponse()?.validacionMonto?.coincide ? 'check_circle' : 'warning' }}</mat-icon>
                    </div>
                    <div class="validation-content">
                      <span class="validation-label">Monto</span>
                      <span class="validation-value">S/{{ uploadResponse()?.ocrResult?.monto | number:'1.2-2' }}</span>
                    </div>
                  </div>

                  <!-- Documento -->
                  <div class="validation-card" [class]="getValidationClass(uploadResponse()?.validacionDocumento)">
                    <div class="validation-icon">
                      <mat-icon>{{ uploadResponse()?.validacionDocumento?.coincide ? 'check_circle' : 'warning' }}</mat-icon>
                    </div>
                    <div class="validation-content">
                      <span class="validation-label">Documento</span>
                      <span class="validation-value">{{ uploadResponse()?.ocrResult?.documento || '-' }}</span>
                    </div>
                  </div>

                  <!-- Nombre -->
                  <div class="validation-card" [class]="getValidationClass(uploadResponse()?.validacionNombre)">
                    <div class="validation-icon">
                      <mat-icon>{{ uploadResponse()?.validacionNombre?.coincide ? 'check_circle' : 'warning' }}</mat-icon>
                    </div>
                    <div class="validation-content">
                      <span class="validation-label">Nombre</span>
                      <span class="validation-value truncate">{{ uploadResponse()?.ocrResult?.nombre || '-' }}</span>
                    </div>
                  </div>
                </div>

                <!-- Detalles del banco -->
                @if (uploadResponse()?.ocrResult?.banco || uploadResponse()?.ocrResult?.numeroOperacion) {
                  <div class="bank-details">
                    @if (uploadResponse()?.ocrResult?.banco) {
                      <div class="detail-item">
                        <mat-icon>account_balance</mat-icon>
                        <span>{{ uploadResponse()?.ocrResult?.banco }}</span>
                      </div>
                    }
                    @if (uploadResponse()?.ocrResult?.numeroOperacion) {
                      <div class="detail-item">
                        <mat-icon>tag</mat-icon>
                        <span>Op. {{ uploadResponse()?.ocrResult?.numeroOperacion }}</span>
                      </div>
                    }
                    @if (uploadResponse()?.ocrResult?.fecha) {
                      <div class="detail-item">
                        <mat-icon>event</mat-icon>
                        <span>{{ uploadResponse()?.ocrResult?.fecha }}</span>
                      </div>
                    }
                  </div>
                }

                <!-- Cuota a registrar -->
                <div class="selected-installment" [class]="cuotaCoincidente() ? 'success' : 'warning'">
                  <mat-icon>{{ cuotaCoincidente() ? 'check_circle' : 'info' }}</mat-icon>
                  <span>Se registrará:</span>
                  <strong>Cuota {{ (cuotaCoincidente() || cuotaMasProxima())?.numeroCuota }}</strong>
                  <span class="amount">(S/{{ (cuotaCoincidente() || cuotaMasProxima())?.monto | number:'1.2-2' }})</span>
                </div>

                <!-- Auto-selección info -->
                <div class="auto-select-info">
                  <mat-icon>auto_awesome</mat-icon>
                  <span>Al confirmar se seleccionará automáticamente: <strong>Contacto Directo → Cancelación</strong></span>
                </div>
              }
            }

            <!-- Error message -->
            @if (errorMessage()) {
              <div class="error-message">
                <mat-icon>error_outline</mat-icon>
                <span>{{ errorMessage() }}</span>
              </div>
            }
          </div>

          <!-- Columna derecha: Visor de imagen -->
          <div class="right-column">
            <div class="image-viewer">
              <div class="viewer-header">
                <span class="viewer-title">
                  <mat-icon>image</mat-icon>
                  Voucher de Pago
                </span>
                @if (previewUrl()) {
                  <div class="zoom-controls">
                    <button mat-icon-button (click)="zoomOut()" [disabled]="zoomLevel() <= 0.5" class="zoom-btn">
                      <mat-icon>remove</mat-icon>
                    </button>
                    <span class="zoom-level">{{ (zoomLevel() * 100) | number:'1.0-0' }}%</span>
                    <button mat-icon-button (click)="zoomIn()" [disabled]="zoomLevel() >= 3" class="zoom-btn">
                      <mat-icon>add</mat-icon>
                    </button>
                    <div class="zoom-divider"></div>
                    <button mat-icon-button (click)="removeFile()" class="delete-btn">
                      <mat-icon>delete_outline</mat-icon>
                    </button>
                  </div>
                }
              </div>

              <div class="viewer-body">
                @if (!previewUrl()) {
                  <!-- Área de drag & drop -->
                  <div class="upload-area" (click)="fileInput.click()" (dragover)="onDragOver($event)" (drop)="onDrop($event)">
                    <div class="upload-content">
                      <div class="upload-icon">
                        <mat-icon>cloud_upload</mat-icon>
                      </div>
                      <p class="upload-title">Arrastra tu voucher aquí</p>
                      <p class="upload-subtitle">o haz clic para seleccionar</p>
                      <div class="upload-formats">
                        <span class="format-badge">JPG</span>
                        <span class="format-badge">PNG</span>
                        <span class="format-badge">WebP</span>
                        <span class="size-info">Max 5MB</span>
                      </div>
                    </div>
                  </div>
                  <input #fileInput type="file" accept="image/jpeg,image/png,image/webp" class="hidden" (change)="onFileSelected($event)" />
                } @else {
                  <!-- Preview con zoom -->
                  <div class="image-container" (wheel)="onWheel($event)">
                    <img [src]="previewUrl()" alt="Voucher" [style.transform]="'scale(' + zoomLevel() + ')'" />
                  </div>

                  <!-- Spinner overlay -->
                  @if (isUploading()) {
                    <div class="loading-overlay">
                      <div class="loading-content">
                        <mat-spinner diameter="48"></mat-spinner>
                        <p>Analizando voucher...</p>
                        <span>Procesando con IA</span>
                      </div>
                    </div>
                  }
                }
              </div>
            </div>
          </div>
        </div>
      </mat-dialog-content>

      <mat-dialog-actions class="dialog-actions">
        <button mat-button class="btn-cancel" (click)="cancel()">
          <mat-icon>close</mat-icon>
          Cancelar
        </button>

        <div class="action-buttons">
          @if (!uploadResponse()) {
            <button mat-flat-button class="btn-analyze" [disabled]="!selectedFile() || isUploading()" (click)="upload()">
              <mat-icon>psychology</mat-icon>
              Analizar con IA
            </button>
          } @else {
            <button mat-flat-button class="btn-confirm" [class]="showWarning() ? 'warning' : 'success'" (click)="confirm()">
              <mat-icon>done_all</mat-icon>
              Confirmar Pago
            </button>
          }
        </div>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .voucher-dialog {
      display: flex;
      flex-direction: column;
      max-height: 85vh;
      min-width: 900px;
      background: #ffffff;
      overflow: hidden;
    }
    .voucher-dialog.dark-mode { background: #0f172a; }

    /* Header */
    .dialog-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 18px 24px;
      background: linear-gradient(135deg, #059669 0%, #10b981 100%);
      color: white;
    }

    .header-content { display: flex; align-items: center; gap: 16px; }

    .header-icon {
      width: 48px; height: 48px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
    }
    .header-icon mat-icon { font-size: 26px; width: 26px; height: 26px; }

    .header-text h2 { margin: 0; font-size: 20px; font-weight: 600; }
    .header-subtitle { font-size: 13px; opacity: 0.9; display: flex; align-items: center; gap: 6px; }
    .inline-icon { font-size: 14px !important; width: 14px !important; height: 14px !important; }

    .close-btn { color: white !important; opacity: 0.8; transition: opacity 0.2s; }
    .close-btn:hover { opacity: 1; }

    /* Body */
    .dialog-body {
      flex: 1;
      padding: 24px !important;
      overflow-y: auto !important;
      overflow-x: hidden !important;
      background: #f8fafc;
      max-height: calc(85vh - 160px);
    }
    .dark-mode .dialog-body { background: #0f172a; }

    .two-column-layout { display: grid; grid-template-columns: 1fr 380px; gap: 24px; }

    /* Left column */
    .left-column { display: flex; flex-direction: column; gap: 16px; min-width: 0; }

    /* Info cards */
    .info-card {
      background: white;
      border-radius: 14px;
      border: 1px solid #e2e8f0;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    }
    .dark-mode .info-card { background: #1e293b; border-color: #334155; }

    .card-header {
      display: flex; align-items: center; gap: 10px;
      padding: 12px 16px;
      background: #f1f5f9;
      border-bottom: 1px solid #e2e8f0;
      font-size: 13px; font-weight: 600; color: #475569;
    }
    .dark-mode .card-header { background: #334155; border-color: #475569; color: #cbd5e1; }
    .card-header mat-icon { font-size: 18px; width: 18px; height: 18px; color: #64748b; }
    .dark-mode .card-header mat-icon { color: #94a3b8; }

    .card-body { padding: 16px; }

    .info-row { display: grid; grid-template-columns: 1.5fr 1fr; gap: 20px; }
    .info-item { display: flex; flex-direction: column; gap: 6px; }
    .info-label { font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 500; }
    .dark-mode .info-label { color: #94a3b8; }
    .info-value { font-size: 14px; font-weight: 600; color: #1e293b; word-break: break-word; }
    .dark-mode .info-value { color: #f1f5f9; }
    .info-value.highlight { color: #059669; font-family: 'SF Mono', Monaco, monospace; font-size: 15px; }

    /* Installments */
    .installments-grid { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 14px; }

    .installment-chip {
      display: flex; align-items: center; gap: 8px;
      padding: 8px 14px;
      background: #f1f5f9;
      border-radius: 10px;
      border: 1.5px solid #e2e8f0;
      transition: all 0.2s;
    }
    .dark-mode .installment-chip { background: #334155; border-color: #475569; }
    .installment-chip.active { background: #dcfce7; border-color: #22c55e; }
    .dark-mode .installment-chip.active { background: rgba(34, 197, 94, 0.2); border-color: #22c55e; }

    .chip-number { font-size: 12px; font-weight: 700; color: #64748b; }
    .installment-chip.active .chip-number { color: #16a34a; }
    .dark-mode .installment-chip.active .chip-number { color: #4ade80; }

    .chip-amount { font-size: 13px; font-weight: 600; color: #1e293b; }
    .dark-mode .chip-amount { color: #e2e8f0; }
    .installment-chip.active .chip-amount { color: #15803d; }
    .dark-mode .installment-chip.active .chip-amount { color: #86efac; }

    .chip-amount-original { font-size: 11px; color: #94a3b8; text-decoration: line-through; margin-right: 4px; }
    .dark-mode .chip-amount-original { color: #64748b; }
    .installment-chip.active .chip-amount-original { color: #86efac; opacity: 0.6; }

    .partial-badge {
      font-size: 10px; font-weight: 600;
      padding: 2px 6px;
      background: #f59e0b;
      color: white;
      border-radius: 4px;
      margin-left: 4px;
    }

    .next-installment {
      display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
      padding: 12px 14px;
      background: #f0fdf4;
      border-radius: 10px;
      font-size: 13px; color: #166534;
    }
    .dark-mode .next-installment { background: rgba(34, 197, 94, 0.15); color: #86efac; }
    .next-installment mat-icon { font-size: 18px; width: 18px; height: 18px; color: #22c55e; }
    .next-installment strong { font-weight: 700; }

    .date-badge {
      margin-left: auto;
      padding: 5px 10px;
      background: white;
      border-radius: 8px;
      font-size: 12px; font-weight: 600;
      color: #059669;
      border: 1px solid #bbf7d0;
    }
    .dark-mode .date-badge { background: #1e293b; border-color: #22c55e; color: #4ade80; }

    /* Result banner */
    .result-banner {
      display: flex; align-items: center; gap: 14px;
      padding: 14px 16px;
      border-radius: 12px;
      border: 1.5px solid;
    }
    .result-banner.success { background: #dcfce7; border-color: #86efac; }
    .dark-mode .result-banner.success { background: rgba(34, 197, 94, 0.15); border-color: #22c55e; }
    .result-banner.warning { background: #fef3c7; border-color: #fcd34d; }
    .dark-mode .result-banner.warning { background: rgba(245, 158, 11, 0.15); border-color: #f59e0b; }
    .result-banner.error { background: #fee2e2; border-color: #fca5a5; }
    .dark-mode .result-banner.error { background: rgba(239, 68, 68, 0.15); border-color: #ef4444; }

    .result-icon {
      width: 40px; height: 40px;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .result-banner.success .result-icon { background: #22c55e; color: white; }
    .result-banner.warning .result-icon { background: #f59e0b; color: white; }
    .result-banner.error .result-icon { background: #ef4444; color: white; }

    .result-text { display: flex; flex-direction: column; gap: 3px; }
    .result-title { font-size: 14px; font-weight: 700; color: #1e293b; }
    .dark-mode .result-title { color: #f1f5f9; }
    .result-subtitle { font-size: 12px; color: #64748b; }
    .dark-mode .result-subtitle { color: #94a3b8; }

    /* Validations grid */
    .validations-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }

    .validation-card {
      display: flex; align-items: center; gap: 12px;
      padding: 12px 14px;
      border-radius: 12px;
      border: 1.5px solid;
      background: white;
    }
    .dark-mode .validation-card { background: #1e293b; }
    .validation-card.success { border-color: #86efac; background: #f0fdf4; }
    .dark-mode .validation-card.success { border-color: #22c55e; background: rgba(34, 197, 94, 0.1); }
    .validation-card.warning { border-color: #fcd34d; background: #fffbeb; }
    .dark-mode .validation-card.warning { border-color: #f59e0b; background: rgba(245, 158, 11, 0.1); }
    .validation-card.neutral { border-color: #e2e8f0; }
    .dark-mode .validation-card.neutral { border-color: #475569; }

    .validation-icon mat-icon { font-size: 22px; width: 22px; height: 22px; }
    .validation-card.success .validation-icon mat-icon { color: #22c55e; }
    .validation-card.warning .validation-icon mat-icon { color: #f59e0b; }

    .validation-content { display: flex; flex-direction: column; gap: 3px; min-width: 0; flex: 1; }
    .validation-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #94a3b8; font-weight: 500; }
    .validation-value { font-size: 13px; font-weight: 600; color: #1e293b; overflow: hidden; text-overflow: ellipsis; }
    .dark-mode .validation-value { color: #f1f5f9; }
    .truncate { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

    /* Bank details */
    .bank-details {
      display: flex; flex-wrap: wrap; gap: 16px;
      padding: 12px 16px;
      background: #f8fafc;
      border-radius: 10px;
      border: 1px solid #e2e8f0;
    }
    .dark-mode .bank-details { background: #1e293b; border-color: #334155; }
    .detail-item { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #475569; }
    .dark-mode .detail-item { color: #94a3b8; }
    .detail-item mat-icon { font-size: 16px; width: 16px; height: 16px; color: #94a3b8; }

    /* Selected installment */
    .selected-installment {
      display: flex; align-items: center; gap: 10px;
      padding: 14px 16px;
      border-radius: 12px;
      font-size: 14px;
      border: 2px solid;
    }
    .selected-installment.success { background: #dcfce7; border-color: #22c55e; color: #166534; }
    .dark-mode .selected-installment.success { background: rgba(34, 197, 94, 0.15); color: #86efac; }
    .selected-installment.warning { background: #fef3c7; border-color: #f59e0b; color: #92400e; }
    .dark-mode .selected-installment.warning { background: rgba(245, 158, 11, 0.15); color: #fcd34d; }
    .selected-installment mat-icon { font-size: 20px; width: 20px; height: 20px; }
    .selected-installment .amount { opacity: 0.8; }

    /* Auto select info */
    .auto-select-info {
      display: flex; align-items: center; gap: 10px;
      padding: 12px 16px;
      background: #eff6ff;
      border-radius: 10px;
      border: 1px solid #bfdbfe;
      font-size: 12px; color: #1d4ed8;
    }
    .dark-mode .auto-select-info { background: rgba(59, 130, 246, 0.1); border-color: #3b82f6; color: #93c5fd; }
    .auto-select-info mat-icon { font-size: 18px; width: 18px; height: 18px; color: #3b82f6; }

    /* Error message */
    .error-message {
      display: flex; align-items: center; gap: 12px;
      padding: 14px 16px;
      background: #fef2f2;
      border-radius: 10px;
      border: 1px solid #fecaca;
      font-size: 13px; color: #dc2626;
    }
    .dark-mode .error-message { background: rgba(239, 68, 68, 0.1); border-color: #ef4444; color: #fca5a5; }

    /* Right column - Image viewer */
    .right-column { display: flex; }

    .image-viewer {
      flex: 1;
      display: flex; flex-direction: column;
      background: white;
      border-radius: 14px;
      border: 1px solid #e2e8f0;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    }
    .dark-mode .image-viewer { background: #1e293b; border-color: #334155; }

    .viewer-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 12px 16px;
      background: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
    }
    .dark-mode .viewer-header { background: #0f172a; border-color: #334155; }

    .viewer-title { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; color: #475569; }
    .dark-mode .viewer-title { color: #94a3b8; }
    .viewer-title mat-icon { font-size: 18px; width: 18px; height: 18px; }

    .zoom-controls { display: flex; align-items: center; gap: 6px; }
    .zoom-btn {
      width: 30px !important; height: 30px !important;
      background: white !important;
      border: 1px solid #e2e8f0 !important;
      border-radius: 8px !important;
    }
    .dark-mode .zoom-btn { background: #334155 !important; border-color: #475569 !important; }
    .zoom-btn mat-icon { font-size: 18px !important; width: 18px !important; height: 18px !important; color: #64748b; }
    .dark-mode .zoom-btn mat-icon { color: #94a3b8; }

    .zoom-level { font-size: 12px; font-weight: 600; color: #64748b; min-width: 40px; text-align: center; }
    .dark-mode .zoom-level { color: #94a3b8; }

    .zoom-divider { width: 1px; height: 24px; background: #e2e8f0; margin: 0 6px; }
    .dark-mode .zoom-divider { background: #475569; }

    .delete-btn {
      width: 30px !important; height: 30px !important;
      background: #fef2f2 !important;
      border: 1px solid #fecaca !important;
      border-radius: 8px !important;
    }
    .dark-mode .delete-btn { background: rgba(239, 68, 68, 0.15) !important; border-color: #ef4444 !important; }
    .delete-btn mat-icon { font-size: 18px !important; width: 18px !important; height: 18px !important; color: #ef4444; }

    .viewer-body { flex: 1; min-height: 380px; position: relative; background: #f1f5f9; }
    .dark-mode .viewer-body { background: #0f172a; }

    /* Upload area */
    .upload-area {
      position: absolute; inset: 16px;
      border: 2px dashed #cbd5e1;
      border-radius: 14px;
      cursor: pointer;
      transition: all 0.2s;
      display: flex; align-items: center; justify-content: center;
      background: white;
    }
    .dark-mode .upload-area { border-color: #475569; background: #1e293b; }
    .upload-area:hover { border-color: #22c55e; background: #f0fdf4; }
    .dark-mode .upload-area:hover { border-color: #22c55e; background: rgba(34, 197, 94, 0.1); }

    .upload-content { text-align: center; padding: 24px; }

    .upload-icon {
      width: 72px; height: 72px;
      margin: 0 auto 20px;
      background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
      border-radius: 18px;
      display: flex; align-items: center; justify-content: center;
    }
    .dark-mode .upload-icon { background: linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(34, 197, 94, 0.3) 100%); }
    .upload-icon mat-icon { font-size: 36px; width: 36px; height: 36px; color: #22c55e; }

    .upload-title { font-size: 16px; font-weight: 600; color: #1e293b; margin: 0 0 6px; }
    .dark-mode .upload-title { color: #f1f5f9; }
    .upload-subtitle { font-size: 13px; color: #64748b; margin: 0 0 20px; }
    .dark-mode .upload-subtitle { color: #94a3b8; }

    .upload-formats { display: flex; align-items: center; justify-content: center; gap: 8px; }
    .format-badge { padding: 5px 10px; background: #f1f5f9; border-radius: 6px; font-size: 11px; font-weight: 600; color: #64748b; }
    .dark-mode .format-badge { background: #334155; color: #94a3b8; }
    .size-info { font-size: 11px; color: #94a3b8; }

    /* Image container */
    .image-container { position: absolute; inset: 0; overflow: auto; cursor: grab; display: flex; }
    .image-container:active { cursor: grabbing; }
    .image-container img { max-width: none; transition: transform 0.15s ease; transform-origin: top left; }

    /* Loading overlay */
    .loading-overlay {
      position: absolute; inset: 0;
      background: rgba(0, 0, 0, 0.75);
      display: flex; align-items: center; justify-content: center;
      backdrop-filter: blur(6px);
    }
    .loading-content { text-align: center; color: white; }
    .loading-content mat-spinner { margin: 0 auto 16px; }
    .loading-content p { font-size: 16px; font-weight: 600; margin: 0 0 6px; }
    .loading-content span { font-size: 13px; opacity: 0.8; }

    /* Dialog actions */
    .dialog-actions {
      display: flex !important;
      align-items: center;
      justify-content: space-between;
      padding: 18px 24px !important;
      background: #f8fafc;
      border-top: 1px solid #e2e8f0;
    }
    .dark-mode .dialog-actions { background: #1e293b; border-color: #334155; }

    .btn-cancel {
      display: flex; align-items: center; gap: 8px;
      padding: 10px 20px !important;
      border-radius: 10px !important;
      font-size: 14px !important; font-weight: 500 !important;
      color: #64748b !important;
      border: 1px solid #e2e8f0 !important;
      background: white !important;
      transition: all 0.2s;
    }
    .dark-mode .btn-cancel { color: #94a3b8 !important; border-color: #475569 !important; background: #0f172a !important; }
    .btn-cancel:hover { background: #f1f5f9 !important; border-color: #cbd5e1 !important; }
    .dark-mode .btn-cancel:hover { background: #334155 !important; }
    .btn-cancel mat-icon { font-size: 18px; width: 18px; height: 18px; }

    .action-buttons { display: flex; gap: 12px; }

    .btn-analyze, .btn-confirm {
      display: flex !important; align-items: center; gap: 10px;
      padding: 12px 24px !important;
      border-radius: 12px !important;
      font-size: 14px !important; font-weight: 600 !important;
      transition: all 0.2s;
    }

    .btn-analyze {
      background: linear-gradient(135deg, #059669 0%, #10b981 100%) !important;
      color: white !important;
      box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);
    }
    .btn-analyze:hover:not(:disabled) { box-shadow: 0 6px 16px rgba(5, 150, 105, 0.4); transform: translateY(-2px); }
    .btn-analyze:disabled { background: #cbd5e1 !important; box-shadow: none; }
    .dark-mode .btn-analyze:disabled { background: #475569 !important; }

    .btn-confirm.success {
      background: linear-gradient(135deg, #059669 0%, #10b981 100%) !important;
      color: white !important;
      box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);
    }
    .btn-confirm.warning {
      background: linear-gradient(135deg, #d97706 0%, #f59e0b 100%) !important;
      color: white !important;
      box-shadow: 0 4px 12px rgba(217, 119, 6, 0.3);
    }
    .btn-confirm:hover { transform: translateY(-2px); }

    .btn-analyze mat-icon, .btn-confirm mat-icon { font-size: 20px; width: 20px; height: 20px; }

    .hidden { display: none; }
  `]
})
export class VoucherPaymentDialogComponent implements OnInit, OnDestroy {
  selectedFile = signal<File | null>(null);
  previewUrl = signal<string>('');
  isUploading = signal(false);
  uploadResponse = signal<ComprobanteUploadResponse | null>(null);
  errorMessage = signal<string>('');
  zoomLevel = signal<number>(1);
  isDarkMode = signal<boolean>(false);
  private darkModeObserver?: MutationObserver;

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

    // Advertencia si alguna validación no coincide
    const validacionFalla = (
      (response.validacionMonto && !response.validacionMonto.coincide) ||
      (response.validacionDocumento && !response.validacionDocumento.coincide) ||
      (response.validacionNombre && !response.validacionNombre.coincide)
    );

    // Advertencia si no se detectaron datos importantes del OCR
    const ocrResult = response.ocrResult;
    const sinDatosOcr = !ocrResult?.monto && !ocrResult?.documento && !ocrResult?.nombre;

    return validacionFalla || sinDatosOcr;
  });

  // Computed para detectar si no se encontraron datos
  noDataDetected = computed(() => {
    const response = this.uploadResponse();
    if (!response?.ocrResult) return true;
    const ocr = response.ocrResult;
    return !ocr.monto && !ocr.documento && !ocr.nombre;
  });

  constructor(
    public dialogRef: MatDialogRef<VoucherPaymentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: VoucherPaymentDialogData,
    private comprobanteService: ComprobanteService
  ) {}

  ngOnInit(): void {
    // Check initial dark mode
    this.isDarkMode.set(document.documentElement.classList.contains('dark'));

    // Set up observer for dark mode changes
    this.darkModeObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          this.isDarkMode.set(document.documentElement.classList.contains('dark'));
        }
      });
    });

    this.darkModeObserver.observe(document.documentElement, { attributes: true });
  }

  ngOnDestroy(): void {
    this.darkModeObserver?.disconnect();
  }

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

  getResultClass(): string {
    const r = this.uploadResponse();
    if (!r?.success) return 'error';
    if (this.showWarning()) return 'warning';
    return 'success';
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
    if (this.noDataDetected()) return 'No se detectaron datos';
    if (this.showWarning()) return 'Voucher con advertencias';
    return 'Voucher validado correctamente';
  }

  getResultSubtitle(): string {
    const r = this.uploadResponse();
    if (!r?.success) return 'No se pudo analizar el voucher';
    if (this.noDataDetected()) return 'La imagen no parece ser un comprobante de pago válido';
    if (this.showWarning()) return 'Algunos datos no coinciden exactamente';
    return 'Todos los datos coinciden con el cliente';
  }

  getValidationClass(v?: ValidationResult): string {
    if (!v) return 'neutral';
    return v.coincide ? 'success' : 'warning';
  }

  /**
   * Calcula el saldo pendiente de una cuota
   * saldoPendiente = monto - montoPagadoReal
   */
  getSaldoPendiente(cuota: CuotaPromesa): number {
    const pagado = cuota.montoPagadoReal || 0;
    return Math.max(0, cuota.monto - pagado);
  }

  zoomIn(): void { if (this.zoomLevel() < 3) this.zoomLevel.update(z => z + 0.25); }
  zoomOut(): void { if (this.zoomLevel() > 0.5) this.zoomLevel.update(z => z - 0.25); }

  onWheel(event: WheelEvent): void {
    event.preventDefault();
    event.deltaY < 0 ? this.zoomIn() : this.zoomOut();
  }
}
