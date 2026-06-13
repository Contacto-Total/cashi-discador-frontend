import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BcpPagoDuplicado, EstadoCargaArchivoBcp } from '../models/bcp-archivo.model';

@Component({
  selector: 'app-bcp-pagos-duplicados',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mb-6 overflow-hidden rounded-xl border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20">
      <div class="border-b border-red-200 px-4 py-3 dark:border-red-800">
        <h2 class="text-lg font-semibold text-red-800 dark:text-red-300">Archivo con pagos duplicados</h2>
        <p class="mt-1 text-sm text-red-700 dark:text-red-400">
          {{ getMensajeEstado() }} Revise los pagos omitidos antes de continuar.
        </p>
      </div>

      <div class="overflow-x-auto bg-white dark:bg-slate-800">
        <table class="min-w-full text-xs">
          <thead class="bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200 uppercase tracking-wide">
            <tr>
              <th class="px-3 py-2 text-left font-bold">Documento</th>
              <th class="px-3 py-2 text-left font-bold">Fecha banco</th>
              <th class="px-3 py-2 text-right font-bold">Monto banco</th>
              <th class="px-3 py-2 text-left font-bold">Banco</th>
              <th class="px-3 py-2 text-left font-bold">Nro. operación</th>
              <th class="px-3 py-2 text-left font-bold">Motivo</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-red-100 dark:divide-red-900/40">
            @for (pago of pagos; track trackDuplicado(pago, $index)) {
              <tr class="hover:bg-red-50 dark:hover:bg-red-950/20">
                <td class="px-3 py-2 font-semibold text-slate-800 dark:text-slate-100 whitespace-nowrap">{{ pago.documento || '-' }}</td>
                <td class="px-3 py-2 text-slate-700 dark:text-slate-300 whitespace-nowrap">{{ pago.fechaBanco || '-' }}</td>
                <td class="px-3 py-2 text-right font-semibold text-slate-900 dark:text-white whitespace-nowrap">{{ formatMoney(pago.montoBanco) }}</td>
                <td class="px-3 py-2 text-slate-700 dark:text-slate-300 whitespace-nowrap">{{ pago.banco || '-' }}</td>
                <td class="px-3 py-2 text-slate-700 dark:text-slate-300 whitespace-nowrap">{{ pago.numeroOperacion || '-' }}</td>
                <td class="px-3 py-2">
                  <span class="inline-flex rounded-full bg-red-100 px-2 py-1 text-[10px] font-bold text-red-700 dark:bg-red-900/50 dark:text-red-200">
                    {{ getMotivoLabel(pago.motivo) }}
                  </span>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="6" class="px-3 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
                  No se recibieron detalles de pagos duplicados.
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class BcpPagosDuplicadosWidget {
  @Input() pagos: BcpPagoDuplicado[] = [];
  @Input() estadoCarga: EstadoCargaArchivoBcp | string | null | undefined = null;

  trackDuplicado(pago: BcpPagoDuplicado, index: number): string {
    return `${pago.documento || 'sin-doc'}-${pago.numeroOperacion || pago.fechaBanco || 'sin-op'}-${index}`;
  }

  getMensajeEstado(): string {
    if (this.estadoCarga === 'TODOS_PAGOS_YA_REGISTRADOS') {
      return 'Todos los pagos del archivo ya se encuentran registrados.';
    }
    if (this.estadoCarga === 'PREVALIDADO_CON_DUPLICADOS_CONTEXTO') {
      return 'Existen pagos ya registrados en el contexto seleccionado.';
    }
    return 'Se encontraron pagos ya registrados en el archivo.';
  }

  getMotivoLabel(motivo: string | null | undefined): string {
    if (motivo === 'NUMERO_OPERACION_EXISTENTE') return 'Nro. operación existente';
    if (motivo === 'DOCUMENTO_FECHA_MONTO_EXISTENTE') return 'Documento/fecha/monto existente';
    return motivo || '-';
  }

  formatMoney(value: number | null | undefined): string {
    if (value === null || value === undefined) return '-';
    return `S/ ${Number(value).toFixed(2)}`;
  }
}
