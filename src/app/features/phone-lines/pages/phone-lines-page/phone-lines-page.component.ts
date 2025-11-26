import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { PhoneLineService, BatchProcessResponse, WhatsAppConnectionStatus } from '../../services/phone-line.service';
import { PhoneLineResponse } from '../../models/phone-line.response';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-phone-lines-page',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './phone-lines-page.component.html',
  styleUrl: './phone-lines-page.component.css'
})
export class PhoneLinesPageComponent implements OnInit, OnDestroy {
  // Single query
  documentNumber: string = '';
  isLoading: boolean = false;
  response: PhoneLineResponse | null = null;
  error: string | null = null;

  // Batch processing
  batchStatus: BatchProcessResponse | null = null;
  isBatchRunning: boolean = false;
  batchError: string | null = null;
  batchSkippedWhatsApp: boolean = false;
  showBatchStartedPopup: boolean = false;

  // WhatsApp
  whatsAppStatus: WhatsAppConnectionStatus | null = null;
  whatsAppQR: string | null = null;
  isConnectingWhatsApp: boolean = false;
  whatsAppError: string | null = null;
  showWhatsAppModal: boolean = false;

  // Polling subscriptions
  private batchPolling$: Subscription | null = null;
  private whatsAppPolling$: Subscription | null = null;

  constructor(private phoneLineService: PhoneLineService) {}

  ngOnInit(): void {
    this.checkInitialStatus();
  }

  ngOnDestroy(): void {
    this.stopBatchPolling();
    this.stopWhatsAppPolling();
  }

  checkInitialStatus(): void {
    // Check if batch is running
    this.phoneLineService.isBatchRunning().subscribe({
      next: (running) => {
        this.isBatchRunning = running;
      }
    });

    // Check WhatsApp status
    this.refreshWhatsAppStatus();
  }

  // ========================================
  // Batch Process Flow
  // ========================================
  startBatchProcess(): void {
    // First check WhatsApp status, then show modal
    this.refreshWhatsAppStatus();
    this.showWhatsAppModal = true;
  }

  closeWhatsAppModal(): void {
    this.showWhatsAppModal = false;
    this.whatsAppError = null;
  }

  confirmStartBatch(): void {
    // Start batch WITH WhatsApp verification
    this.showWhatsAppModal = false;
    this.startBatch(false);
  }

  skipWhatsAppAndStartBatch(): void {
    // Start batch WITHOUT WhatsApp verification
    this.showWhatsAppModal = false;
    this.startBatch(true);
  }

  // ========================================
  // Single Document Query
  // ========================================
  search(): void {
    if (!this.documentNumber || this.documentNumber.length < 8) {
      this.error = 'Ingrese un documento valido (minimo 8 digitos)';
      return;
    }

    this.isLoading = true;
    this.error = null;
    this.response = null;

    this.phoneLineService.queryPhoneLines({ documentNumber: this.documentNumber }).subscribe({
      next: (response) => {
        this.response = response;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Error al consultar las lineas telefonicas';
        this.isLoading = false;
      }
    });
  }

  forceRefresh(): void {
    if (!this.documentNumber || this.documentNumber.length < 8) {
      this.error = 'Ingrese un documento valido (minimo 8 digitos)';
      return;
    }

    this.isLoading = true;
    this.error = null;
    this.response = null;

    this.phoneLineService.queryPhoneLinesForceRefresh({ documentNumber: this.documentNumber }).subscribe({
      next: (response) => {
        this.response = response;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Error al consultar las lineas telefonicas';
        this.isLoading = false;
      }
    });
  }

  clearResults(): void {
    this.documentNumber = '';
    this.response = null;
    this.error = null;
  }

  // ========================================
  // Batch Processing
  // ========================================
  startBatch(skipWhatsApp: boolean = false): void {
    if (this.isBatchRunning) return; // Evitar doble llamada

    this.batchError = null;
    this.batchSkippedWhatsApp = skipWhatsApp;
    this.isBatchRunning = true; // Bloquear inmediatamente

    this.phoneLineService.startBatch(skipWhatsApp).subscribe({
      next: (response) => {
        this.batchStatus = response;
        this.isBatchRunning = response.status === 'RUNNING' || response.status === 'STARTED';
        if (this.isBatchRunning) {
          this.showBatchStartedPopup = true; // Mostrar popup de confirmación
          this.startBatchPolling(response.batchId);
        }
      },
      error: (err) => {
        this.batchError = err?.error?.message || 'Error al iniciar el proceso batch';
        this.isBatchRunning = false;
      }
    });
  }

  closeBatchStartedPopup(): void {
    this.showBatchStartedPopup = false;
  }

  stopBatch(): void {
    if (!this.batchStatus?.batchId) return;

    this.phoneLineService.stopBatch(this.batchStatus.batchId).subscribe({
      next: (response) => {
        this.batchStatus = response;
        this.isBatchRunning = false;
        this.stopBatchPolling();
      },
      error: (err) => {
        this.batchError = err?.error?.message || 'Error al detener el proceso batch';
      }
    });
  }

  resetBatches(): void {
    this.phoneLineService.resetStuckBatches().subscribe({
      next: () => {
        this.batchStatus = null;
        this.isBatchRunning = false;
        this.stopBatchPolling();
      },
      error: (err) => {
        this.batchError = 'Error al resetear batches';
      }
    });
  }

  private startBatchPolling(batchId: string): void {
    this.stopBatchPolling();
    this.batchPolling$ = interval(3000).subscribe(() => {
      this.phoneLineService.getBatchStatus(batchId).subscribe({
        next: (response) => {
          this.batchStatus = response;
          if (response.status !== 'RUNNING') {
            this.isBatchRunning = false;
            this.stopBatchPolling();
          }
        }
      });
    });
  }

  private stopBatchPolling(): void {
    if (this.batchPolling$) {
      this.batchPolling$.unsubscribe();
      this.batchPolling$ = null;
    }
  }

  getBatchProgressPercent(): number {
    if (!this.batchStatus || this.batchStatus.totalRecords === 0) return 0;
    return Math.round((this.batchStatus.processedRecords / this.batchStatus.totalRecords) * 100);
  }

  // ========================================
  // WhatsApp
  // ========================================
  refreshWhatsAppStatus(): void {
    this.phoneLineService.getWhatsAppStatus().subscribe({
      next: (status) => {
        this.whatsAppStatus = status;
        if (status.status === 'qr_ready') {
          this.phoneLineService.getWhatsAppQR().subscribe({
            next: (qr) => {
              this.whatsAppQR = qr.qrCode;
            }
          });
        } else {
          this.whatsAppQR = null;
        }
      },
      error: () => {
        this.whatsAppStatus = null;
      }
    });
  }

  connectWhatsApp(): void {
    this.isConnectingWhatsApp = true;
    this.whatsAppError = null;

    this.phoneLineService.connectWhatsApp().subscribe({
      next: (response) => {
        this.isConnectingWhatsApp = false;
        if (response.status === 'connected') {
          this.whatsAppQR = null;
          this.refreshWhatsAppStatus();
        } else if (response.qrCode) {
          this.whatsAppQR = response.qrCode;
          this.startWhatsAppPolling();
        }
      },
      error: (err) => {
        this.isConnectingWhatsApp = false;
        this.whatsAppError = err?.error?.message || 'Error al conectar WhatsApp';
      }
    });
  }

  private startWhatsAppPolling(): void {
    this.stopWhatsAppPolling();
    this.whatsAppPolling$ = interval(3000).subscribe(() => {
      this.refreshWhatsAppStatus();
      if (this.whatsAppStatus?.status === 'connected') {
        this.stopWhatsAppPolling();
      }
    });
  }

  private stopWhatsAppPolling(): void {
    if (this.whatsAppPolling$) {
      this.whatsAppPolling$.unsubscribe();
      this.whatsAppPolling$ = null;
    }
  }

  isWhatsAppConnected(): boolean {
    return this.whatsAppStatus?.status === 'connected';
  }

  // ========================================
  // Utility
  // ========================================
  getCarrierColor(carrier: string): string {
    const lowerCarrier = carrier?.toLowerCase() || '';
    if (lowerCarrier.includes('claro')) return 'bg-red-100 text-red-700 border-red-300';
    if (lowerCarrier.includes('movistar')) return 'bg-blue-100 text-blue-700 border-blue-300';
    if (lowerCarrier.includes('entel')) return 'bg-orange-100 text-orange-700 border-orange-300';
    if (lowerCarrier.includes('bitel')) return 'bg-green-100 text-green-700 border-green-300';
    return 'bg-gray-100 text-gray-700 border-gray-300';
  }

  getModalityIcon(modality: string): string {
    const lowerModality = modality?.toLowerCase() || '';
    if (lowerModality.includes('prepago')) return 'credit-card';
    if (lowerModality.includes('postpago')) return 'file-text';
    if (lowerModality.includes('control')) return 'sliders';
    return 'smartphone';
  }
}
