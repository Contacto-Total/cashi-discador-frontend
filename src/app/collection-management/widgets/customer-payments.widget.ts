import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { CustomerPaymentsContext, CustomerPaymentsPage } from '../models/customer-payments.model';
import { CustomerPaymentsService } from '../services/customer-payments.service';

@Component({
  selector: 'app-customer-payments-widget',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-2">
      @if (loading) {
        <div class="py-6 text-center text-xs text-slate-500 dark:text-slate-400">Cargando pagos...</div>
      } @else if (error) {
        <div class="rounded-md border border-red-200 bg-red-50 p-2 text-xs text-red-700 dark:border-red-800 dark:bg-red-950/20 dark:text-red-300">{{ error }}</div>
      } @else if (!canLoad()) {
        <div class="py-6 text-center text-xs text-slate-500 dark:text-slate-400">Los pagos estarán disponibles al cargar los datos del cliente.</div>
      } @else {
        @if (page.totalPages > 1) {
          <p class="text-right text-[10px] text-slate-500 dark:text-slate-400">Página {{ page.page + 1 }} de {{ page.totalPages }}</p>
        }

        <div class="divide-y divide-slate-200 dark:divide-slate-700">
          @for (pago of page.content; track pago.id) {
            <div class="py-2">
              <div class="grid grid-cols-2 gap-x-2">
                <div><p class="text-[9px] font-medium uppercase text-slate-400">Fecha de pago</p><p class="mt-0.5 text-[11px] font-semibold text-slate-800 dark:text-white">{{ formatDate(pago.fechaPago) }}</p></div>
                <div><p class="text-[9px] font-medium uppercase text-slate-400">Monto de pago bancario</p><p class="mt-0.5 text-[11px] font-semibold text-slate-800 dark:text-white">{{ formatMoney(pago.montoPago) }}</p></div>
              </div>
            </div>
          } @empty {
            <div class="py-5 text-center text-xs text-slate-500 dark:text-slate-400">No hay pagos para este cliente.</div>
          }
        </div>

        @if (page.totalPages > 1) {
          <div class="flex justify-end gap-1">
            <button type="button" (click)="changePage(page.page - 1)" [disabled]="page.first" class="rounded px-2 py-1 text-[10px] font-semibold text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-slate-300 dark:hover:bg-slate-800">Anterior</button>
            <button type="button" (click)="changePage(page.page + 1)" [disabled]="page.last" class="rounded px-2 py-1 text-[10px] font-semibold text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-slate-300 dark:hover:bg-slate-800">Siguiente</button>
          </div>
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
  page: CustomerPaymentsPage = this.emptyPage();

  private readonly pageSize = 10;
  private requestSubscription?: Subscription;
  private requestVersion = 0;

  constructor(private customerPaymentsService: CustomerPaymentsService) {}

  ngOnChanges(_changes: SimpleChanges): void {
    this.loadPagos(0);
  }

  ngOnDestroy(): void {
    this.requestSubscription?.unsubscribe();
  }

  canLoad(): boolean {
    return !!this.documento && !!this.tenantId && !!this.carteraId && !!this.subcarteraId;
  }

  changePage(page: number): void {
    if (page >= 0 && page < this.page.totalPages) this.loadPagos(page);
  }

  formatDate(value: string | null): string {
    return value ? new Date(`${value}T00:00:00`).toLocaleDateString() : '—';
  }

  formatMoney(value: number | null): string {
    return value == null ? '—' : `S/ ${value.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  private loadPagos(pageNumber: number): void {
    this.requestSubscription?.unsubscribe();
    this.error = null;

    if (!this.canLoad()) {
      this.loading = false;
      this.page = this.emptyPage();
      return;
    }

    const requestVersion = ++this.requestVersion;
    const context: CustomerPaymentsContext = {
      tenantId: this.tenantId!,
      carteraId: this.carteraId!,
      subcarteraId: this.subcarteraId!
    };

    this.loading = true;
    this.requestSubscription = this.customerPaymentsService.getPagos(
      this.documento!, context, pageNumber, this.pageSize
    ).subscribe({
      next: response => {
        if (requestVersion !== this.requestVersion) return;
        this.page = response;
        this.loading = false;
      },
      error: () => {
        if (requestVersion !== this.requestVersion) return;
        this.error = 'No se pudieron cargar los pagos del cliente.';
        this.loading = false;
      }
    });
  }

  private emptyPage(): CustomerPaymentsPage {
    return { content: [], page: 0, size: this.pageSize, totalElements: 0, totalPages: 0, first: true, last: true };
  }
}
