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
        <aside class="pointer-events-auto h-screen w-[620px] max-w-[94vw] overflow-y-auto border-l border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
          <div class="sticky top-0 z-10 border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
            <div class="flex items-start justify-between gap-4">
              <div>
                <p class="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Resumen cliente</p>
                <h2 class="mt-1 text-lg font-bold text-slate-900 dark:text-white">{{ resumen?.nombreCliente || 'Cliente sin nombre' }}</h2>
                <p class="text-sm text-slate-600 dark:text-slate-300">
                  Documento: <span class="font-mono font-semibold">{{ documento || resumen?.documento }}</span>
                  @if (resumen?.subcarteraId) {
                    <span class="ml-2 text-xs text-slate-400 dark:text-slate-500">SubcarteraId {{ resumen?.subcarteraId }}</span>
                  }
                </p>
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
              <div class="mb-4 grid grid-cols-2 gap-2">
                <div class="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
                  <p class="text-xs text-slate-500 dark:text-slate-400">Pago cumplido</p>
                  <p class="mt-1 font-bold" [class]="resumen.pagoCumplido ? 'text-emerald-600 dark:text-emerald-300' : 'text-amber-600 dark:text-amber-300'">{{ resumen.pagoCumplido ? 'Sí' : 'No' }}</p>
                </div>
                <div class="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
                  <p class="text-xs text-slate-500 dark:text-slate-400">Promesas</p>
                  <p class="mt-1 font-bold text-slate-900 dark:text-white">{{ resumen.promesas.length }}</p>
                </div>
              </div>

              <div class="space-y-3">
                @for (promesa of resumen.promesas; track promesa.idGestion) {
                  <details class="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50">
                    <summary class="cursor-pointer px-3 py-2">
                      <div class="inline-flex w-full items-center justify-between gap-3 align-middle">
                        <div>
                          <p class="text-sm font-semibold text-slate-900 dark:text-white">Gestión {{ promesa.idGestion }} · {{ promesa.estadoPago }}</p>
                          <p class="text-xs text-slate-500 dark:text-slate-400">{{ formatDateTime(promesa.fechaGestion) }} · {{ promesa.nombreAgente || 'Sin agente' }}</p>
                        </div>
                        <div class="text-right text-xs font-semibold text-slate-700 dark:text-slate-200">S/ {{ formatMoney(promesa.montoPagadoReal) }} / {{ formatMoney(promesa.montoPromesa) }}</div>
                      </div>
                    </summary>

                    <div class="border-t border-slate-200 p-3 dark:border-slate-700">
                      @if (hasValue(promesa.rutaTipificacion)) {
                        <p class="mb-2 text-xs text-slate-500 dark:text-slate-400">{{ promesa.rutaTipificacion }}</p>
                      }

                      <div class="overflow-x-auto rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                        <table class="min-w-[720px] w-full text-xs">
                          <thead class="bg-slate-100 text-left text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                            <tr>
                              <th class="px-3 py-2 font-semibold">Cuota</th>
                              <th class="px-3 py-2 font-semibold">Programación</th>
                              <th class="px-3 py-2 font-semibold">Ejecución</th>
                              <th class="px-3 py-2 font-semibold">Validación</th>
                            </tr>
                          </thead>
                          <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                            @for (cuota of promesa.cuotas; track cuota.cuotaId) {
                              <tr class="align-top hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                <td class="px-3 py-2">
                                  <p class="font-semibold text-slate-900 dark:text-white">Cuota {{ cuota.numeroCuota }}</p>
                                  <span class="mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold" [class]="getEstadoClass(cuota.estado)">{{ cuota.estado }}</span>
                                </td>
                                <td class="px-3 py-2 text-slate-700 dark:text-slate-300">
                                  <p>{{ formatDate(cuota.fechaPromesa) }}</p>
                                  <p class="font-semibold">S/ {{ formatMoney(cuota.montoPromesa) }}</p>
                                </td>
                                <td class="px-3 py-2 text-slate-700 dark:text-slate-300">
                                  @if (hasValue(cuota.fechaPagoReal)) {
                                    <p>{{ formatDate(cuota.fechaPagoReal) }}</p>
                                  }
                                  @if (cuota.montoPagadoReal !== null && cuota.montoPagadoReal !== undefined) {
                                    <p class="font-bold text-slate-900 dark:text-white">S/ {{ formatMoney(cuota.montoPagadoReal) }}</p>
                                  }
                                </td>
                                <td class="px-3 py-2">
                                  <div class="flex flex-wrap gap-1.5">
                                    @if (hasPagoVerificado(cuota)) {
                                      <span class="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">Verificado</span>
                                    }
                                    @for (id of getPagoBancarioIds(cuota); track id) {
                                      <span class="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">PB {{ id }}</span>
                                    }
                                    @for (operacion of getOperaciones(cuota); track operacion) {
                                      <span class="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-300">Op. {{ operacion }}</span>
                                    }
                                  </div>
                                  @if (cuota.pagos.length > 0) {
                                    <div class="mt-1 space-y-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                                      @for (pago of cuota.pagos; track pago.pagoCuotaId) {
                                        <p>{{ formatDate(pago.fechaPago) }} · {{ pago.banco }} · S/ {{ formatMoney(pago.montoPago) }}</p>
                                      }
                                    </div>
                                  }
                                </td>
                              </tr>
                            } @empty {
                              <tr>
                                <td colspan="4" class="px-3 py-6 text-center text-slate-500 dark:text-slate-400">Sin cuotas registradas.</td>
                              </tr>
                            }
                          </tbody>
                        </table>
                      </div>
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

  formatDate(value: string | null | undefined): string {
    if (!this.hasValue(value)) return '';
    const text = String(value);
    const match = text.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) return `${match[3]}-${match[2]}-${match[1]}`;

    const date = new Date(text);
    if (Number.isNaN(date.getTime())) return String(value);

    return new Intl.DateTimeFormat('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date).replace(/\//g, '-');
  }

  formatDateTime(value: string | null | undefined): string {
    if (!this.hasValue(value)) return '';
    const text = String(value);
    const match = text.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
    if (match) return `${match[3]}-${match[2]}-${match[1]} ${match[4]}:${match[5]}`;

    const date = new Date(text);
    if (Number.isNaN(date.getTime())) return String(value);

    return new Intl.DateTimeFormat('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(date).replace(/\//g, '-');
  }

  hasValue(value: unknown): boolean {
    return value !== null && value !== undefined && String(value).trim() !== '' && String(value).trim() !== '-';
  }

  hasPagoVerificado(cuota: any): boolean {
    return (cuota?.pagos || []).some((pago: any) => pago.verificadoBanco === true);
  }

  getPagoBancarioIds(cuota: any): number[] {
    return Array.from(new Set<number>((cuota?.pagos || [])
      .map((pago: any) => pago.pagoBancarioId)
      .filter((id: number | null | undefined): id is number => id !== null && id !== undefined)));
  }

  getOperaciones(cuota: any): string[] {
    return Array.from(new Set<string>((cuota?.pagos || [])
      .map((pago: any) => pago.numeroOperacion)
      .filter((operacion: string | null | undefined): operacion is string => this.hasValue(operacion))));
  }

  getEstadoClass(estado: string | null | undefined): string {
    if (estado === 'PAGADA') return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300';
    if (estado === 'PARCIAL') return 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300';
    if (estado === 'VENCIDA') return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300';
    return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300';
  }
}
