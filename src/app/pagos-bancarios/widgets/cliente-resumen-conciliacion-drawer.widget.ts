import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumenConciliacionCliente } from '../models/bcp-archivo.model';

@Component({
  selector: 'app-cliente-resumen-conciliacion-drawer',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (open) {
      <div class="fixed inset-y-0 right-0 z-50 flex w-full justify-end bg-black/20 pr-3 pt-3 sm:w-auto" (click)="close.emit()">
        <aside class="h-[calc(100vh-1.5rem)] w-[92vw] max-w-md overflow-y-auto rounded-l-2xl bg-white shadow-2xl dark:bg-slate-900" (click)="$event.stopPropagation()">
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

                          <div class="mt-2 overflow-x-auto">
                            <table class="min-w-full text-xs">
                              <thead class="text-left text-slate-500 dark:text-slate-400">
                                <tr>
                                  <th class="py-1 pr-2">Fecha</th>
                                  <th class="py-1 pr-2 text-right">Monto</th>
                                  <th class="py-1 pr-3">Banco</th>
                                  <th class="py-1 pr-2">V.</th>
                                  <th class="py-1 pr-2">PB</th>
                                </tr>
                              </thead>
                              <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                                @for (pago of cuota.pagos; track pago.pagoCuotaId) {
                                  <tr>
                                    <td class="py-2 pr-2 text-slate-700 dark:text-slate-300">{{ pago.fechaPago }}</td>
                                    <td class="py-2 pr-2 text-right font-semibold text-slate-900 dark:text-white">S/ {{ formatMoney(pago.montoPago) }}</td>
                                    <td class="py-2 pr-3 text-slate-700 dark:text-slate-300">{{ pago.banco }}</td>
                                    <td class="py-2 pr-2" [class]="pago.verificadoBanco ? 'text-emerald-600 dark:text-emerald-300' : 'text-slate-500 dark:text-slate-400'">{{ pago.verificadoBanco ? 'Sí' : 'No' }}</td>
                                    <td class="py-2 pr-2 text-slate-700 dark:text-slate-300">{{ pago.pagoBancarioId || '-' }}</td>
                                  </tr>
                                } @empty {
                                  <tr>
                                    <td colspan="5" class="py-3 text-center text-slate-500 dark:text-slate-400">Sin pagos registrados para esta cuota.</td>
                                  </tr>
                                }
                              </tbody>
                            </table>
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
