import { Component, Input } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ReportePagosBancarios } from '../models/reporte-pagos-bancarios.model';

@Component({
  selector: 'app-reporte-pagos-bancarios-resultados',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  template: `
    <section class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div class="grid grid-cols-1 gap-4 border-b border-slate-200 p-4 sm:grid-cols-2 lg:grid-cols-4 dark:border-slate-700">
        <div><p class="text-xs font-medium uppercase text-slate-500">Período</p><p class="mt-1 font-semibold text-slate-800 dark:text-white">{{ reporte.periodo }}</p></div>
        <div><p class="text-xs font-medium uppercase text-slate-500">Banco</p><p class="mt-1 font-semibold text-slate-800 dark:text-white">{{ reporte.banco }}</p></div>
        <div><p class="text-xs font-medium uppercase text-slate-500">Total registros</p><p class="mt-1 font-semibold text-slate-800 dark:text-white">{{ reporte.totalRegistros }}</p></div>
        <div><p class="text-xs font-medium uppercase text-slate-500">Monto total</p><p class="mt-1 font-semibold text-emerald-600 dark:text-emerald-400">{{ reporte.montoTotal | currency:'PEN':'symbol-narrow':'1.2-2' }}</p></div>
      </div>
      @if (reporte.pagos.length === 0) {
        <div class="p-8 text-center text-sm text-slate-600 dark:text-slate-400">No se encontraron pagos para los filtros seleccionados.</div>
      } @else {
        <div class="overflow-x-auto"><table class="min-w-full divide-y divide-slate-200 dark:divide-slate-700"><thead class="bg-slate-50 dark:bg-slate-700/50"><tr><th class="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Fecha banco</th><th class="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Documento</th><th class="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Nro. operación</th><th class="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Medio atención</th><th class="px-4 py-3 text-right text-xs font-medium uppercase text-slate-500">Monto banco</th><th class="px-4 py-3 text-center text-xs font-medium uppercase text-slate-500">Estado</th></tr></thead><tbody class="divide-y divide-slate-200 dark:divide-slate-700">
          @for (pago of reporte.pagos; track pago.id) {
            <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/30"><td class="whitespace-nowrap px-4 py-3 text-sm text-slate-700 dark:text-slate-300">{{ pago.fechaBanco || '-' }}</td><td class="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">{{ pago.documento || '-' }}</td><td class="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">{{ pago.numeroOperacion || '-' }}</td><td class="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">{{ pago.medioAtencion || '-' }}</td><td class="whitespace-nowrap px-4 py-3 text-right text-sm font-medium text-emerald-600 dark:text-emerald-400">{{ (pago.montoBanco || 0) | currency:'PEN':'symbol-narrow':'1.2-2' }}</td><td class="px-4 py-3 text-center"><span class="rounded-full px-2 py-1 text-xs font-medium" [class]="pago.procesado ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'">{{ pago.procesado ? 'Conciliado' : 'Pendiente' }}</span></td></tr>
          }
        </tbody></table></div>
      }
    </section>
  `
})
export class ReportePagosBancariosResultadosWidget {
  @Input({ required: true }) reporte!: ReportePagosBancarios;
}
