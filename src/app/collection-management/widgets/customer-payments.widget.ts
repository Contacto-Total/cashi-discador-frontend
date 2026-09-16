import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { CustomerCancellationReconciliation, CustomerPaymentsContext, CustomerPaymentsPage } from '../models/customer-payments.model';
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
        <div class="py-6 text-center text-xs text-slate-500 dark:text-slate-400">Las cancelaciones estarán disponibles al cargar los datos del cliente.</div>
      } @else {
        <div class="flex items-center justify-between gap-2">
          <span class="text-xs font-semibold text-slate-600 dark:text-slate-300">{{ page.totalElements }} cancelaciones</span>
          @if (page.totalPages > 1) {
            <span class="text-[10px] text-slate-500 dark:text-slate-400">Página {{ page.page + 1 }} de {{ page.totalPages }}</span>
          }
        </div>

        <div class="divide-y divide-slate-200 dark:divide-slate-700">
          @for (cancelacion of page.content; track cancelacion.id) {
            <div class="py-2">
              <div class="grid grid-cols-4 gap-x-2">
                <div><p class="text-[9px] font-medium uppercase text-slate-400">Fecha</p><p class="mt-0.5 text-[11px] font-semibold text-slate-800 dark:text-white">{{ formatDate(cancelacion.fechaCancelacion) }}</p></div>
                <div><p class="text-[9px] font-medium uppercase text-slate-400">Cancelación</p><p class="mt-0.5 text-[11px] font-semibold text-slate-800 dark:text-white">{{ formatMoney(cancelacion.montoCancelacion) }}</p></div>
                <div><p class="text-[9px] font-medium uppercase text-slate-400">Banco</p><p class="mt-0.5 truncate text-[11px] text-slate-700 dark:text-slate-300" [title]="cancelacion.banco ?? ''">{{ cancelacion.banco ?? '—' }}</p></div>
                <div><p class="text-[9px] font-medium uppercase text-slate-400">Estado</p><span class="mt-0.5 inline-flex rounded-full px-1.5 py-0.5 text-[9px] font-bold" [class]="statusClass(cancelacion.estadoConciliacion)">{{ statusLabel(cancelacion.estadoConciliacion) }}</span></div>
              </div>
              <div class="mt-2 grid grid-cols-2 gap-x-2">
                <div><p class="text-[9px] font-medium uppercase text-slate-400">Monto banco</p><p class="mt-0.5 text-[11px] text-slate-700 dark:text-slate-300">{{ formatMoney(cancelacion.montoBanco) }}</p></div>
                <div><p class="text-[9px] font-medium uppercase text-slate-400">Fecha banco</p><p class="mt-0.5 text-[11px] text-slate-700 dark:text-slate-300">{{ formatDate(cancelacion.fechaBanco) }}</p></div>
              </div>
            </div>
          } @empty {
            <div class="py-5 text-center text-xs text-slate-500 dark:text-slate-400">No hay cancelaciones para este cliente.</div>
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
    this.loadCancelaciones(0);
  }

  ngOnDestroy(): void {
    this.requestSubscription?.unsubscribe();
  }

  canLoad(): boolean {
    return !!this.documento && !!this.tenantId && !!this.carteraId && !!this.subcarteraId;
  }

  changePage(page: number): void {
    if (page >= 0 && page < this.page.totalPages) this.loadCancelaciones(page);
  }

  formatDate(value: string | null): string {
    return value ? new Date(value).toLocaleDateString() : '—';
  }

  formatMoney(value: number | null): string {
    return value == null ? '—' : `S/ ${value.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  statusLabel(status: CustomerCancellationReconciliation['estadoConciliacion']): string {
    return status === 'CONCILIADO' ? 'Conciliado'
      : status === 'PENDIENTE_CONCILIACION' ? 'Pendiente'
      : status === 'ELIMINADO' ? 'Eliminado'
      : 'Inconsistente';
  }

  statusClass(status: CustomerCancellationReconciliation['estadoConciliacion']): string {
    return status === 'CONCILIADO' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
      : status === 'PENDIENTE_CONCILIACION' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
      : status === 'ELIMINADO' ? 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
      : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300';
  }

  private loadCancelaciones(pageNumber: number): void {
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
    this.requestSubscription = this.customerPaymentsService.getCancelaciones(
      this.documento!, context, pageNumber, this.pageSize
    ).subscribe({
      next: response => {
        if (requestVersion !== this.requestVersion) return;
        this.page = response;
        this.loading = false;
      },
      error: () => {
        if (requestVersion !== this.requestVersion) return;
        this.error = 'No se pudieron cargar las cancelaciones del cliente.';
        this.loading = false;
      }
    });
  }

  private emptyPage(): CustomerPaymentsPage {
    return { content: [], page: 0, size: this.pageSize, totalElements: 0, totalPages: 0, first: true, last: true };
  }
}
