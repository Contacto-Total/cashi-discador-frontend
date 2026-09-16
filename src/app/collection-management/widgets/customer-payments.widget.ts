import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { CustomerCancellationAttempt, CustomerPaymentsContext } from '../models/customer-payments.model';
import { CustomerPaymentsService } from '../services/customer-payments.service';

@Component({
  selector: 'app-customer-payments-widget',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-2">
      @if (loading) {
        <div class="py-6 text-center text-xs text-slate-500 dark:text-slate-400">Cargando cancelaciones...</div>
      } @else if (error) {
        <div class="rounded-md border border-red-200 bg-red-50 p-2 text-xs text-red-700 dark:border-red-800 dark:bg-red-950/20 dark:text-red-300">{{ error }}</div>
      } @else if (!canLoad()) {
        <div class="py-6 text-center text-xs text-slate-500 dark:text-slate-400">Los pagos estarán disponibles al cargar los datos del cliente.</div>
      } @else {
        <div class="flex items-center justify-between gap-2">
          <span class="text-xs font-semibold text-slate-600 dark:text-slate-300">Cancelaciones</span>
          <span class="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">{{ cancellationAttempts.length }}</span>
        </div>

        @for (attempt of cancellationAttempts; track attempt.idGestion) {
          <div class="rounded-md border border-slate-200 bg-slate-50 p-2 dark:border-slate-700 dark:bg-slate-800/50">
            <div class="flex items-start justify-between gap-2">
              <div>
                <p class="text-xs font-bold text-slate-800 dark:text-white">Gestión {{ attempt.idGestion }}</p>
                <p class="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">{{ formatDateTime(attempt.fechaGestion) }}</p>
              </div>
              <span class="shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold" [class]="methodClass(attempt.metodoContacto)">
                {{ methodLabel(attempt.metodoContacto) }}
              </span>
            </div>
          </div>
        } @empty {
          <div class="rounded-md border border-slate-200 p-4 text-center text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">No hay cancelaciones para este cliente.</div>
        }
      }
    </div>
  `
})
export class CustomerPaymentsWidget implements OnChanges, OnDestroy {
  @Input() documento: string | null = null;
  @Input() tenantId: number | undefined;
  @Input() carteraId: number | undefined;
  @Input() subcarteraId: number | undefined;

  loading = false;
  error: string | null = null;
  cancellationAttempts: CustomerCancellationAttempt[] = [];

  private requestSubscription?: Subscription;
  private requestVersion = 0;

  constructor(private customerPaymentsService: CustomerPaymentsService) {}

  ngOnChanges(_changes: SimpleChanges): void {
    this.loadPayments();
  }

  ngOnDestroy(): void {
    this.requestSubscription?.unsubscribe();
  }

  canLoad(): boolean {
    return !!this.documento && !!this.tenantId && !!this.carteraId && !!this.subcarteraId;
  }

  private loadPayments(): void {
    this.requestSubscription?.unsubscribe();
    this.cancellationAttempts = [];
    this.error = null;

    if (!this.canLoad()) {
      this.loading = false;
      return;
    }

    const requestVersion = ++this.requestVersion;
    const context: CustomerPaymentsContext = {
      tenantId: this.tenantId!,
      carteraId: this.carteraId!,
      subcarteraId: this.subcarteraId!
    };

    this.loading = true;
    this.requestSubscription = this.customerPaymentsService.getSummary(this.documento!, context).subscribe({
      next: summary => {
        if (requestVersion !== this.requestVersion) return;
        this.cancellationAttempts = summary.intentosCancelacion ?? [];
        this.loading = false;
      },
      error: () => {
        if (requestVersion !== this.requestVersion) return;
        this.error = 'No se pudieron cargar las cancelaciones del cliente.';
        this.loading = false;
      }
    });
  }

  formatDateTime(value: string): string {
    return new Date(value).toLocaleString();
  }

  methodLabel(method: CustomerCancellationAttempt['metodoContacto']): string {
    return method?.replace('GESTION_', '') ?? 'SIN MÉTODO';
  }

  methodClass(method: CustomerCancellationAttempt['metodoContacto']): string {
    if (method === 'GESTION_PREDICTIVO') return 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300';
    if (method === 'GESTION_MANUAL') return 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300';
    if (method === 'GESTION_PROGRESIVO') return 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300';
    return 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300';
  }
}
