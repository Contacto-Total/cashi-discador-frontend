import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrevalidacionArchivoBcp } from '../models/bcp-archivo.model';

@Component({
  selector: 'app-bcp-no-procesados',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mb-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div class="border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/70">
        <h2 class="text-lg font-semibold text-slate-800 dark:text-white">{{ title }}</h2>
        <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">{{ description }}</p>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full text-xs">
          <thead class="bg-slate-100 text-slate-600 uppercase tracking-wide dark:bg-slate-700/60 dark:text-slate-300">
            <tr>
              <th class="px-3 py-2 text-left font-bold">Documento</th>
              <th class="px-3 py-2 text-left font-bold">Fecha banco</th>
              <th class="px-3 py-2 text-right font-bold">Monto banco</th>
              <th class="px-3 py-2 text-left font-bold">Nro. operación</th>
              <th class="px-3 py-2 text-left font-bold">Estado</th>
              <th class="px-3 py-2 text-left font-bold">Cartera/Subcartera</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-700/60">
            @for (row of paginaActual(); track trackRow(row, $index)) {
              <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/40">
                <td class="px-3 py-2 font-semibold text-slate-800 dark:text-slate-100 whitespace-nowrap">{{ value(row, 'documentoBanco', 'documento_banco') || '-' }}</td>
                <td class="px-3 py-2 text-slate-700 dark:text-slate-300 whitespace-nowrap">{{ value(row, 'fechaBanco', 'fecha_banco') || '-' }}</td>
                <td class="px-3 py-2 text-right font-semibold text-slate-900 dark:text-white whitespace-nowrap">{{ formatMoney(value(row, 'montoBanco', 'monto_banco')) }}</td>
                <td class="px-3 py-2 text-slate-700 dark:text-slate-300 whitespace-nowrap">{{ value(row, 'numeroOperacion', 'numero_operacion') || '-' }}</td>
                <td class="px-3 py-2 text-slate-700 dark:text-slate-300 whitespace-nowrap">{{ value(row, 'estadoPrevalidacion', 'estado_prevalidacion') || '-' }}</td>
                <td class="px-3 py-2 text-slate-600 dark:text-slate-400 whitespace-nowrap">{{ value(row, 'carteraId', 'cartera_id') || '-' }}/{{ value(row, 'subcarteraId', 'subcartera_id') || '-' }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <nav
        class="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-4 py-3 dark:border-slate-700"
        [attr.aria-label]="'Paginación de ' + title"
      >
        <p class="text-xs text-slate-600 dark:text-slate-300" aria-live="polite">
          Mostrando {{ desde() }}–{{ hasta() }} de {{ total() }} · Página {{ pagina() }} de {{ totalPaginas() }}
        </p>
        @if (totalPaginas() > 1) {
          <div class="flex items-center gap-2">
            <button
              type="button"
              class="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
              [disabled]="pagina() <= 1"
              (click)="irAPagina(pagina() - 1)"
            >
              Anterior
            </button>
            <button
              type="button"
              class="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
              [disabled]="pagina() >= totalPaginas()"
              (click)="irAPagina(pagina() + 1)"
            >
              Siguiente
            </button>
          </div>
        }
      </nav>
    </div>
  `
})
export class BcpNoProcesadosWidget {
  private static readonly TAMANO_PAGINA = 10;

  @Input() data: PrevalidacionArchivoBcp[] = [];
  private paginaSolicitada = 1;

  total(): number {
    return this.data?.length ?? 0;
  }

  totalPaginas(): number {
    return Math.max(1, Math.ceil(this.total() / BcpNoProcesadosWidget.TAMANO_PAGINA));
  }

  /** Se acota al rango vigente: si llega un archivo con menos filas, no queda en una página vacía. */
  pagina(): number {
    return Math.min(Math.max(1, this.paginaSolicitada), this.totalPaginas());
  }

  desde(): number {
    return this.total() === 0 ? 0 : (this.pagina() - 1) * BcpNoProcesadosWidget.TAMANO_PAGINA + 1;
  }

  hasta(): number {
    return Math.min(this.pagina() * BcpNoProcesadosWidget.TAMANO_PAGINA, this.total());
  }

  paginaActual(): PrevalidacionArchivoBcp[] {
    const inicio = (this.pagina() - 1) * BcpNoProcesadosWidget.TAMANO_PAGINA;
    return (this.data ?? []).slice(inicio, inicio + BcpNoProcesadosWidget.TAMANO_PAGINA);
  }

  irAPagina(pagina: number): void {
    this.paginaSolicitada = Math.min(Math.max(1, pagina), this.totalPaginas());
  }

  @Input() title = 'Pagos pertenecientes a otra subcartera';
  @Input() description = 'Estos registros se muestran como referencia. No se aprueban ni se envían a conciliación.';

  value(row: any, camelKey: string, snakeKey?: string): any {
    return row?.[camelKey] ?? (snakeKey ? row?.[snakeKey] : undefined);
  }

  trackRow(row: PrevalidacionArchivoBcp, index: number): string {
    return `${this.value(row, 'numeroOperacion', 'numero_operacion') || 'sin-op'}-${this.value(row, 'documentoBanco', 'documento_banco') || 'sin-doc'}-${index}`;
  }

  formatMoney(value: number | string | null | undefined): string {
    if (value === null || value === undefined || value === '') return '-';
    return `S/ ${Number(value).toFixed(2)}`;
  }
}
