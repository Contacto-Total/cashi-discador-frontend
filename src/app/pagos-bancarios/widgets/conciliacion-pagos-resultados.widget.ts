import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GrupoPosibleMatchConciliacion, PosibleMatchConciliacionDTO } from '../models/conciliacion-pagos.model';

@Component({
  selector: 'app-conciliacion-pagos-resultados',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
      <div class="px-4 py-3 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/70 dark:bg-slate-800/70 flex items-center justify-between gap-3">
        <div>
          <h2 class="text-sm font-bold text-slate-800 dark:text-white">Posibles matches</h2>
          <p class="text-xs text-slate-500 dark:text-slate-400">{{ grupos.length }} grupo(s) de conciliación</p>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full text-xs">
          <thead class="bg-slate-100 dark:bg-slate-900/70 text-slate-600 dark:text-slate-300 uppercase tracking-wide">
            <tr>
              <th class="px-2 py-2 text-left font-bold w-8">#</th>
              <th class="px-2 py-2 text-left font-bold">Tipo</th>
              <th class="px-2 py-2 text-left font-bold">Documento</th>
              <th class="px-2 py-2 text-left font-bold">Fecha Banco</th>
              <th class="px-2 py-2 text-left font-bold">Fecha Agente</th>
              <th class="px-2 py-2 text-right font-bold">Monto Banco</th>
              <th class="px-2 py-2 text-right font-bold">Monto Agente</th>
              <th class="px-2 py-2 text-left font-bold">Oper. Banco</th>
              <th class="px-2 py-2 text-left font-bold">Oper. Agente</th>
              <th class="px-2 py-2 text-right font-bold">Diff días</th>
              <th class="px-2 py-2 text-right font-bold">Diff monto</th>
              <th class="px-2 py-2 text-left font-bold">Grupo</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-700/60">
            @for (grupo of grupos; track grupo.grupoConciliacionId; let idx = $index) {
              <tr [class]="getGroupRowClass(idx)">
                <td class="px-2 py-2 font-bold text-slate-700 dark:text-slate-200">{{ idx + 1 }}</td>
                <td class="px-2 py-2">
                  <div class="font-semibold text-slate-800 dark:text-slate-100 whitespace-nowrap">{{ grupo.tipoMatchDescripcion || grupo.tipoMatch }}</div>
                  <div class="text-[10px] text-slate-500 dark:text-slate-400">P{{ grupo.prioridadMatch }}</div>
                </td>
                <td class="px-2 py-2 font-medium text-slate-700 dark:text-slate-200 whitespace-nowrap">{{ getDocumento(grupo) || '-' }}</td>
                <td class="px-2 py-2 text-slate-600 dark:text-slate-300 whitespace-nowrap">{{ grupo.banco?.fecha || '-' }}</td>
                <td class="px-2 py-2 text-slate-600 dark:text-slate-300 whitespace-nowrap">{{ grupo.agente?.fecha || '-' }}</td>
                <td class="px-2 py-2 text-right font-semibold text-slate-800 dark:text-slate-100 whitespace-nowrap">{{ formatMoney(grupo.banco?.monto) }}</td>
                <td class="px-2 py-2 text-right font-semibold text-slate-800 dark:text-slate-100 whitespace-nowrap">{{ formatMoney(grupo.agente?.monto) }}</td>
                <td class="px-2 py-2 text-slate-600 dark:text-slate-300 whitespace-nowrap">{{ grupo.banco?.numeroOperacion || '-' }}</td>
                <td class="px-2 py-2 text-slate-600 dark:text-slate-300 whitespace-nowrap">{{ grupo.agente?.numeroOperacion || '-' }}</td>
                <td class="px-2 py-2 text-right font-medium" [class]="getDiffClass(grupo.diffDias)">{{ grupo.diffDias ?? '-' }}</td>
                <td class="px-2 py-2 text-right font-medium" [class]="getDiffClass(grupo.diffMonto)">{{ formatDiffMoney(grupo.diffMonto) }}</td>
                <td class="px-2 py-2 text-[10px] text-slate-500 dark:text-slate-400 max-w-40 truncate" [title]="grupo.grupoConciliacionId">{{ grupo.grupoConciliacionId }}</td>
              </tr>
            } @empty {
              <tr>
                <td colspan="12" class="px-4 py-10 text-center text-sm text-slate-500 dark:text-slate-400">No se encontraron posibles matches.</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class ConciliacionPagosResultadosWidget {
  @Input() data: PosibleMatchConciliacionDTO[] = [];

  get grupos(): GrupoPosibleMatchConciliacion[] {
    const map = new Map<string, GrupoPosibleMatchConciliacion>();

    for (const row of this.data || []) {
      const key = row.grupoConciliacionId || `sin-grupo-${row.bcpId || row.pcId || map.size}`;
      const current = map.get(key) || {
        grupoConciliacionId: key,
        tipoMatch: row.tipoMatch,
        tipoMatchDescripcion: row.tipoMatchDescripcion,
        prioridadMatch: row.prioridadMatch,
        diffDias: row.diffDias,
        diffMonto: row.diffMonto,
        banco: null,
        agente: null
      };

      if (row.origenFila === 'BANCO') {
        current.banco = row;
      } else if (row.origenFila === 'AGENTE') {
        current.agente = row;
      }

      map.set(key, current);
    }

    return Array.from(map.values()).sort((a, b) => a.prioridadMatch - b.prioridadMatch);
  }

  getGroupRowClass(index: number): string {
    const colors = [
      'bg-emerald-50/70 dark:bg-emerald-950/20 hover:bg-emerald-100/80 dark:hover:bg-emerald-950/35',
      'bg-sky-50/70 dark:bg-sky-950/20 hover:bg-sky-100/80 dark:hover:bg-sky-950/35',
      'bg-violet-50/70 dark:bg-violet-950/20 hover:bg-violet-100/80 dark:hover:bg-violet-950/35',
      'bg-amber-50/70 dark:bg-amber-950/20 hover:bg-amber-100/80 dark:hover:bg-amber-950/35',
      'bg-rose-50/70 dark:bg-rose-950/20 hover:bg-rose-100/80 dark:hover:bg-rose-950/35'
    ];
    return colors[index % colors.length];
  }

  getDocumento(grupo: GrupoPosibleMatchConciliacion): string | null {
    return grupo.banco?.documentoCliente || grupo.agente?.documentoCliente || null;
  }

  formatMoney(value: number | null | undefined): string {
    if (value === null || value === undefined) return '-';
    return `S/ ${Number(value).toFixed(2)}`;
  }

  formatDiffMoney(value: number | null | undefined): string {
    if (value === null || value === undefined) return '-';
    return Number(value).toFixed(2);
  }

  getDiffClass(value: number | null | undefined): string {
    if (value === null || value === undefined) return 'text-slate-500 dark:text-slate-400';
    return Math.abs(Number(value)) === 0
      ? 'text-emerald-700 dark:text-emerald-300'
      : 'text-amber-700 dark:text-amber-300';
  }
}
