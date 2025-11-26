import { Component, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { WhatsAppService, ConnectionStatus, QRResponse, BatchResult } from '../../services/whatsapp.service';
import { interval, Subscription } from 'rxjs';
import { switchMap, takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-whatsapp-verification',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './whatsapp-verification.component.html'
})
export class WhatsAppVerificationComponent implements OnDestroy {
  private whatsAppService = inject(WhatsAppService);
  private statusSubscription?: Subscription;

  status: ConnectionStatus | null = null;
  qrCode: string | null = null;
  batchResult: BatchResult | null = null;
  isLoading = false;
  isVerifying = false;
  error: string | null = null;
  step: 'idle' | 'scanning' | 'connected' | 'verifying' | 'completed' = 'idle';

  ngOnDestroy() {
    this.stopPolling();
  }

  startVerification() {
    this.isLoading = true;
    this.error = null;
    this.step = 'scanning';

    this.whatsAppService.connect().subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.qrCode) {
          this.qrCode = response.qrCode;
          this.startPolling();
        } else if (response.status === 'connected') {
          this.step = 'connected';
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.error = 'Error al conectar con WhatsApp. Verifica que el servicio esté corriendo.';
        this.step = 'idle';
      }
    });
  }

  private startPolling() {
    this.statusSubscription = interval(2000)
      .pipe(
        switchMap(() => this.whatsAppService.getStatus()),
        takeWhile((status) => status.status !== 'connected', true)
      )
      .subscribe({
        next: (status) => {
          this.status = status;
          if (status.status === 'connected') {
            this.step = 'connected';
            this.qrCode = null;
            this.stopPolling();
          }
        },
        error: (err) => {
          console.error('Error polling status:', err);
        }
      });
  }

  private stopPolling() {
    if (this.statusSubscription) {
      this.statusSubscription.unsubscribe();
      this.statusSubscription = undefined;
    }
  }

  startBatchVerification() {
    this.isVerifying = true;
    this.step = 'verifying';
    this.error = null;

    // Polling para progreso
    this.statusSubscription = interval(1000)
      .pipe(switchMap(() => this.whatsAppService.getStatus()))
      .subscribe({
        next: (status) => {
          this.status = status;
        }
      });

    this.whatsAppService.verifyPendingPhones().subscribe({
      next: (result) => {
        this.stopPolling();
        this.isVerifying = false;
        this.batchResult = result;
        this.step = 'completed';
      },
      error: (err) => {
        this.stopPolling();
        this.isVerifying = false;
        this.error = 'Error durante la verificación: ' + err.message;
      }
    });
  }

  reset() {
    this.step = 'idle';
    this.qrCode = null;
    this.batchResult = null;
    this.status = null;
    this.error = null;
  }

  cancelVerification() {
    this.stopPolling();
    this.whatsAppService.logout().subscribe({
      next: () => {
        this.reset();
      },
      error: () => {
        this.reset();
      }
    });
  }
}
