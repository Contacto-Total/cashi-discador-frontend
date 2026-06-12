import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumenConciliacionCliente } from '../models/bcp-archivo.model';

@Component({
  selector: 'app-cliente-resumen-conciliacion-drawer',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (open) {
      <div class="fixed inset-y-0 right-0 z-50 flex justify-end pointer-events-none">
        <aside class="pointer-events-auto h-screen w-[440px] max-w-[92vw] overflow-y-auto border-l border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
          <div class="sticky top-0 z-10 border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
            <div class="flex items-start justify-between gap-4">
              <div>
                <p class="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Resumen cliente</p>
                <h2 class="mt-1 text-lg font-bold text-slate-900 dark:text-white">{{ resumen?.nombreCliente || 'Cliente sin nombre' }}</h2>
                <p class="text-sm text-slate-600 dark:text-slate-300">Documento: <span class="font-mono font-semibold">{{ documento || resumen?.documento }}</span></p>
              </div>
              <button type="button" (click)="close.emit()" class="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">Cerrar</button>
            </div>
          </div>

          <div class="p-4">
            @if (loading) {
              <div class="rounded-xl border border-slate-200 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">Cargando resumen...</div>
            } @else if (error) {
              <div class="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700 dark:border-red-800 dark:bg-red-950/20 dark:text-red-300">{{ error }}</div>
            } @else if (resumen) {
              <div class="mb-4 grid grid-cols-3 gap-2">
                <div class="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
                  <p class="text-xs text-slate-500 dark:text-slate-400">Pago cumplido</p>
                  <p class="mt-1 font-bold" [class]="resumen.pagoCumplido ? 'text-emerald-600 dark:text-emerald-300' : 'text-amber-600 dark:text-amber-300'">{{ resumen.pagoCumplido ? 'Sí' : 'No' }}</p>
                </div>
                <div class="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
                  <p class="text-xs text-slate-500 dark:text-slate-400">Promesas</p>
                  <p class="mt-1 font-bold text-slate-900 dark:text-white">{{ resumen.promesas.length }}</p>
                </div>
                <div class="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
                  <p class="text-xs text-slate-500 dark:text-slate-400">SubcarteraId</p>
                  <p class="mt-1 font-bold text-slate-900 dark:text-white">{{ resumen.subcarteraId }}</p>
                </div>
              </div>

              <div class="space-y-3">
                @for (promesa of resumen.promesas; track promesa.idGestion) {
                  <details class="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50">
                    <summary class="cursor-pointer px-3 py-2">
                      <div class="inline-flex w-full items-center justify-between gap-3 align-middle">
                        <div>
                          <p class="text-sm font-semibold text-slate-900 dark:text-white">Gestión {{ promesa.idGestion }} · {{ promesa.estadoPago }}</p>
                          <p class="text-xs text-slate-500 dark:text-slate-400">{{ promesa.fechaGestion }} · {{ promesa.nombreAgente || 'Sin agente' }}</p>
                        </div>
                        <div class="text-right text-xs font-semibold text-slate-700 dark:text-slate-200">S/ {{ formatMoney(promesa.montoPagadoReal) }} / {{ formatMoney(promesa.montoPromesa) }}</div>
                      </div>
                    </summary>

                    <div class="space-y-2 border-t border-slate-200 p-3 dark:border-slate-700">
                      <p class="text-xs text-slate-500 dark:text-slate-400">{{ promesa.rutaTipificacion || 'Sin ruta de tipificación' }}</p>
                      @for (cuota of promesa.cuotas; track cuota.cuotaId) {
                        <div class="rounded-lg border border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-900">
                          <div class="flex flex-wrap items-center justify-between gap-2">
                            <p class="text-sm font-semibold text-slate-800 dark:text-slate-100">Cuota {{ cuota.numeroCuota }} · {{ cuota.estado }}</p>
                            <p class="text-xs text-slate-600 dark:text-slate-300">{{ cuota.fechaPromesa }} · S/ {{ formatMoney(cuota.montoPromesa) }}</p>
                          </div>
                          <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">Pago real: {{ cuota.fechaPagoReal || '-' }} · S/ {{ formatMoney(cuota.montoPagadoReal) }}</p>

                          <div class="mt-2 space-y-2">
                            @for (pago of cuota.pagos; track pago.pagoCuotaId) {
                              <div class="rounded-lg border border-slate-200 bg-slate-50 p-2 dark:border-slate-700 dark:bg-slate-800/60">
                                <div class="flex items-center justify-between gap-3">
                                  <div>
                                    <p class="text-xs font-semibold text-slate-900 dark:text-white">{{ pago.fechaPago }} · {{ pago.banco }}</p>
                                    <p class="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">Operación: {{ pago.numeroOperacion || '-' }}</p>
                                  </div>
                                  <p class="text-sm font-bold text-slate-900 dark:text-white">S/ {{ formatMoney(pago.montoPago) }}</p>
                                </div>
                                <div class="mt-2 flex flex-wrap gap-2 text-[11px]">
                                  <span class="rounded-full px-2 py-0.5 font-semibold" [class]="pago.verificadoBanco ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'">
                                    {{ pago.verificadoBanco ? 'Verificado banco' : 'No verificado' }}
                                  </span>
                                  <span class="rounded-full bg-blue-100 px-2 py-0.5 font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                                    Pago bancario: {{ pago.pagoBancarioId || '-' }}
                                  </span>
                                  @if (pago.fechaVerificacion) {
                                    <span class="rounded-full bg-slate-200 px-2 py-0.5 font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-300">{{ pago.fechaVerificacion }}</span>
                                  }
                                </div>
                              </div>
                            } @empty {
                              <div class="rounded-lg border border-dashed border-slate-300 p-3 text-center text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">Sin pagos registrados para esta cuota.</div>
                            }
                          </div>
                        </div>
                      }
                    </div>
                  </details>
                } @empty {
                  <div class="rounded-xl border border-slate-200 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">No hay promesas para este cliente.</div>
                }
              </div>
            }
          </div>
        </aside>
      </div>
    }
  `
})
export class ClienteResumenConciliacionDrawerWidget {
  @Input() open = false;
  @Input() loading = false;
  @Input() error: string | null = null;
  @Input() documento: string | null = null;
  @Input() resumen: ResumenConciliacionCliente | null = null;
  @Output() close = new EventEmitter<void>();

  formatMoney(value: number | null | undefined): string {
    if (value === null || value === undefined) return '0.00';
    return Number(value).toFixed(2);
  }
}
