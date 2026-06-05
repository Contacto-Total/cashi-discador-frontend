import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as XLSX from 'xlsx';
import { PrevalidacionArchivoBcp } from '../models/bcp-archivo.model';

@Component({
  selector: 'app-bcp-prevalidacion-archivo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden mb-6">
      <div class="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3">
        <div>
          <h2 class="text-lg font-semibold text-slate-800 dark:text-white">Prevalidación de pagos BCP</h2>
          <p class="text-xs text-slate-500 dark:text-slate-400">Comparación entre archivo cargado y pagos registrados por agente</p>
        </div>
        <div class="text-right">
          <span class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold" [class]="todosAprobables ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'">
            {{ todosAprobables ? 'Todos aprobables' : 'Requiere revisión' }}
          </span>
          <p class="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{{ data.length }} registro(s)</p>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full text-xs">
          <thead class="bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 uppercase tracking-wide">
            <tr>
              <th class="px-2 py-2 text-left font-bold w-20">Origen</th>
              <th class="px-2 py-2 text-left font-bold">Documento</th>
              <th class="px-2 py-2 text-left font-bold">Fecha</th>
              <th class="px-2 py-2 text-right font-bold">Monto</th>
              <th class="px-2 py-2 text-left font-bold">Nro. operación</th>
              <th class="px-2 py-2 text-left font-bold">Estado</th>
              <th class="px-2 py-2 text-left font-bold">Problema</th>
              <th class="px-2 py-2 text-left font-bold">Acción</th>
              <th class="px-2 py-2 text-center font-bold">Aprobar</th>
            </tr>
          </thead>

          @for (row of data; track trackRow(row, $index); let idx = $index) {
            <tbody [class]="getGroupClass(row)">
              <tr class="border-t" [class]="getGroupBorderClass(row)">
                <td class="px-2 py-2 font-bold text-blue-700 dark:text-blue-300">BANCO</td>
                <td class="px-2 py-2 font-semibold text-slate-800 dark:text-slate-100 whitespace-nowrap">{{ value(row, 'documentoBanco', 'documento_banco') || '-' }}</td>
                <td class="px-2 py-2 text-slate-700 dark:text-slate-300 whitespace-nowrap">{{ value(row, 'fechaBanco', 'fecha_banco') || '-' }}</td>
                <td class="px-2 py-2 text-right font-semibold text-slate-900 dark:text-white whitespace-nowrap">{{ formatMoney(value(row, 'montoBanco', 'monto_banco')) }}</td>
                <td class="px-2 py-2 text-slate-700 dark:text-slate-300 whitespace-nowrap">{{ value(row, 'numeroOperacion', 'numero_operacion') || '-' }}</td>
                <td class="px-2 py-2 whitespace-nowrap" [attr.rowspan]="hasAgente(row) ? 2 : 1">
                  <span class="inline-flex max-w-40 whitespace-normal break-words rounded-full px-2 py-1 text-[10px] font-bold leading-tight" [class]="getEstadoClass(value(row, 'estadoPrevalidacion', 'estado_prevalidacion'))">
                    {{ formatEstado(value(row, 'estadoPrevalidacion', 'estado_prevalidacion')) }}
                  </span>
                </td>
                <td class="px-2 py-2 max-w-56 text-slate-700 dark:text-slate-300 leading-snug" [attr.rowspan]="hasAgente(row) ? 2 : 1">{{ getRecomendacion(row).problema }}</td>
                <td class="px-2 py-2 max-w-64 text-slate-700 dark:text-slate-300 leading-snug" [attr.rowspan]="hasAgente(row) ? 2 : 1">{{ getRecomendacion(row).accion }}</td>
                <td class="px-2 py-2 text-center" [attr.rowspan]="hasAgente(row) ? 2 : 1">
                  <button type="button" (click)="toggleAprobado(idx)" [disabled]="!isListo(row)" class="relative inline-flex h-5 w-9 items-center rounded-full transition-colors disabled:opacity-40 disabled:cursor-not-allowed" [class]="isAprobado(idx) ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-600'">
                    <span class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform" [class]="isAprobado(idx) ? 'translate-x-4' : 'translate-x-1'"></span>
                  </button>
                </td>
              </tr>

              @if (hasAgente(row)) {
                <tr>
                  <td class="px-2 py-2 font-bold text-purple-700 dark:text-purple-300">AGENTE</td>
                  <td class="px-2 py-2 font-semibold text-slate-800 dark:text-slate-100 whitespace-nowrap">{{ value(row, 'documentoAgente', 'documento_agente') || '-' }}</td>
                  <td class="px-2 py-2 text-slate-700 dark:text-slate-300 whitespace-nowrap">{{ value(row, 'fechaPago', 'fecha_pago') || '-' }}</td>
                  <td class="px-2 py-2 text-right font-semibold text-slate-900 dark:text-white whitespace-nowrap">{{ formatMoney(value(row, 'montoPago', 'monto_pago')) }}</td>
                  <td class="px-2 py-2 text-slate-700 dark:text-slate-300 whitespace-nowrap">{{ value(row, 'operacionAgente', 'operacion_agente') || '-' }}</td>
                </tr>
              }
            </tbody>
          } @empty {
            <tbody>
              <tr>
                <td colspan="9" class="px-4 py-10 text-center text-sm text-slate-500 dark:text-slate-400">No hay prevalidación disponible.</td>
              </tr>
            </tbody>
          }
        </table>
      </div>

      <div class="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 flex items-center justify-between gap-3">
        <p class="text-xs text-slate-500 dark:text-slate-400">El guardado se habilita solo cuando todos los registros están listos y aprobados.</p>
        <div class="flex items-center gap-2">
          @if (tieneFallos()) {
            <button type="button" (click)="descargarReporteFallos()" class="px-4 py-2 rounded-lg text-sm font-semibold transition-colors bg-amber-600 text-white hover:bg-amber-700">
              Descargar reporte de fallos
            </button>
          }
          <button type="button" [disabled]="!puedeGuardar()" class="px-5 py-2 rounded-lg text-sm font-semibold transition-colors bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed dark:disabled:bg-slate-700 dark:disabled:text-slate-400">
            Guardar
          </button>
        </div>
      </div>
    </div>
  `
})
export class BcpPrevalidacionArchivoWidget {
  @Input() data: PrevalidacionArchivoBcp[] = [];
  @Input() todosAprobables = false;

  private aprobados = signal<Record<number, boolean>>({});

  private readonly recomendacionesPorEstado: Record<string, { problema: string; accion: string }> = {
    LISTO_PARA_APROBAR: {
      problema: 'Pago conciliable',
      accion: 'Puede aprobarse la carga.'
    },
    REQUIERE_REVISION_MONTO: {
      problema: 'El documento y la fecha coinciden, pero el monto registrado no coincide con el banco.',
      accion: 'Revisar y corregir el monto tipificado o verificar si corresponde a un pago parcial.'
    },
    PAGO_REGISTRADO_FECHA_FUERA_TOLERANCIA: {
      problema: 'Existe un pago registrado con monto compatible, pero la fecha difiere de la fecha bancaria.',
      accion: 'Corregir la fecha de pago tipificada o revisar si corresponde ampliar tolerancia.'
    },
    DOCUMENTO_NO_EXISTE_EN_CLIENTES: {
      problema: 'El documento del pago bancario no existe en la base de clientes.',
      accion: 'Validar DNI/documento o revisar si pertenece a otra base no cargada.'
    },
    NO_TIENE_PROMESA: {
      problema: 'El cliente no tiene promesa activa registrada.',
      accion: 'Crear una promesa de pago antes de conciliar.'
    },
    PROMESA_SIN_CUOTAS_PENDIENTES: {
      problema: 'El cliente tiene promesa, pero no tiene cuotas pendientes, parciales o vencidas.',
      accion: 'Verificar si la promesa ya fue completada o si corresponde crear una nueva promesa.'
    },
    FALTA_TIPIFICACION_CANCELACION: {
      problema: 'El pago cae dentro del rango de una cuota, pero no existe registro de pago/tipificación de cancelación.',
      accion: 'Registrar tipificación de cancelación o generar automáticamente el pago asociado.'
    },
    CLIENTE_MULTIPLES_CARTERAS_NO_COINCIDE_MONTO_FECHA: {
      problema: 'El cliente existe en varias carteras, pero no se encontró pago compatible por monto/fecha.',
      accion: 'Revisar manualmente la cartera correcta y validar monto/fecha tipificados.'
    },
    FECHA_FUERA_DE_RANGO_DE_PROMESA: {
      problema: 'El cliente tiene promesa, pero la fecha bancaria no cae dentro del rango de sus cuotas.',
      accion: 'Revisar fecha de promesa/cuota o corregir la fecha del pago tipificado.'
    },
    SIN_CANDIDATO: {
      problema: 'No se encontró candidato de conciliación.',
      accion: 'Revisión manual requerida.'
    }
  };

  value(row: any, camelKey: string, snakeKey?: string): any {
    return row?.[camelKey] ?? (snakeKey ? row?.[snakeKey] : undefined);
  }

  trackRow(row: PrevalidacionArchivoBcp, index: number): string {
    return `${this.value(row, 'numeroOperacion', 'numero_operacion') || 'sin-op'}-${this.value(row, 'documentoBanco', 'documento_banco') || 'sin-doc'}-${index}`;
  }

  hasAgente(row: PrevalidacionArchivoBcp): boolean {
    return !!(
      this.value(row, 'documentoAgente', 'documento_agente') ||
      this.value(row, 'fechaPago', 'fecha_pago') ||
      this.value(row, 'montoPago', 'monto_pago') ||
      this.value(row, 'operacionAgente', 'operacion_agente')
    );
  }

  isListo(row: PrevalidacionArchivoBcp): boolean {
    return this.value(row, 'estadoPrevalidacion', 'estado_prevalidacion') === 'LISTO_PARA_APROBAR' && this.hasAgente(row);
  }

  isAprobado(index: number): boolean {
    const state = this.aprobados();
    return state[index] ?? this.isListo(this.data[index]);
  }

  toggleAprobado(index: number): void {
    if (!this.isListo(this.data[index])) return;
    const current = this.aprobados();
    this.aprobados.set({ ...current, [index]: !this.isAprobado(index) });
  }

  puedeGuardar(): boolean {
    return this.todosAprobables && this.data.length > 0 && this.data.every((row, index) => this.isListo(row) && this.isAprobado(index));
  }

  tieneFallos(): boolean {
    return this.data.some(row => this.value(row, 'estadoPrevalidacion', 'estado_prevalidacion') !== 'LISTO_PARA_APROBAR');
  }

  getRecomendacion(row: PrevalidacionArchivoBcp): { problema: string; accion: string } {
    const estado = this.value(row, 'estadoPrevalidacion', 'estado_prevalidacion');
    return this.recomendacionesPorEstado[estado] || {
      problema: 'Estado de prevalidación no reconocido.',
      accion: 'Revisión manual requerida.'
    };
  }

  descargarReporteFallos(): void {
    const fallos = this.data.filter(row => this.value(row, 'estadoPrevalidacion', 'estado_prevalidacion') !== 'LISTO_PARA_APROBAR');
    const rows = fallos.map(row => {
      const recomendacion = this.getRecomendacion(row);
      return {
        Estado: this.value(row, 'estadoPrevalidacion', 'estado_prevalidacion') || '',
        'Problema detectado': recomendacion.problema,
        'Acción recomendada': recomendacion.accion,
        'Documento banco': this.value(row, 'documentoBanco', 'documento_banco') || '',
        'Fecha banco': this.value(row, 'fechaBanco', 'fecha_banco') || '',
        'Monto banco': this.value(row, 'montoBanco', 'monto_banco') ?? '',
        'Nro operación banco': this.value(row, 'numeroOperacion', 'numero_operacion') || '',
        'Fecha sistema': this.value(row, 'fechaPago', 'fecha_pago') || '',
        'Monto sistema': this.value(row, 'montoPago', 'monto_pago') ?? '',
        'Operación sistema': this.value(row, 'operacionAgente', 'operacion_agente') || '',
        'Diferencia días': this.value(row, 'diffDias', 'diff_dias') ?? '',
        'Diferencia monto': this.value(row, 'diffMonto', 'diff_monto') ?? '',
        Tenant: this.value(row, 'tenantId', 'tenant_id') ?? '',
        Cartera: this.value(row, 'carteraId', 'cartera_id') ?? '',
        Subcartera: this.value(row, 'subcarteraId', 'subcartera_id') ?? '',
        pcIds: this.value(row, 'pcIds', 'pc_ids') || '',
        cuotaIds: this.value(row, 'cuotaIds', 'cuota_ids') || '',
        idGestion: this.value(row, 'idGestion', 'id_gestion') ?? ''
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    worksheet['!cols'] = [
      { wch: 36 }, { wch: 60 }, { wch: 60 }, { wch: 18 }, { wch: 14 }, { wch: 14 },
      { wch: 22 }, { wch: 14 }, { wch: 14 }, { wch: 22 }, { wch: 16 }, { wch: 18 },
      { wch: 10 }, { wch: 10 }, { wch: 12 }, { wch: 18 }, { wch: 18 }, { wch: 14 }
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Fallos');
    XLSX.writeFile(workbook, `reporte-fallos-bcp-${new Date().toISOString().slice(0, 10)}.xlsx`);
  }

  getGroupClass(row: PrevalidacionArchivoBcp): string {
    if (this.isListo(row)) return 'bg-emerald-50/50 dark:bg-emerald-950/10';
    const estado = this.value(row, 'estadoPrevalidacion', 'estado_prevalidacion');
    if (estado === 'REQUIERE_REVISION_MONTO') return 'bg-amber-50/60 dark:bg-amber-950/15';
    return 'bg-red-50/50 dark:bg-red-950/10';
  }

  getGroupBorderClass(row: PrevalidacionArchivoBcp): string {
    if (this.isListo(row)) return 'border-emerald-300 dark:border-emerald-700';
    const estado = this.value(row, 'estadoPrevalidacion', 'estado_prevalidacion');
    if (estado === 'REQUIERE_REVISION_MONTO') return 'border-amber-300 dark:border-amber-700';
    return 'border-red-300 dark:border-red-800';
  }

  getEstadoClass(estado: string | null | undefined): string {
    if (estado === 'LISTO_PARA_APROBAR') return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300';
    if (estado === 'REQUIERE_REVISION_MONTO') return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300';
    return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300';
  }

  formatEstado(estado: string | null | undefined): string {
    if (!estado) return '-';
    return estado.replace(/_/g, ' ');
  }

  getDiffClass(value: number | string | null | undefined): string {
    if (value === null || value === undefined || value === '') return 'text-slate-500 dark:text-slate-400';
    return Math.abs(Number(value)) === 0 ? 'text-emerald-700 dark:text-emerald-300' : 'text-amber-700 dark:text-amber-300';
  }

  formatMoney(value: number | string | null | undefined): string {
    if (value === null || value === undefined || value === '') return '-';
    return `S/ ${Number(value).toFixed(2)}`;
  }

  formatDiff(value: number | string | null | undefined): string {
    if (value === null || value === undefined || value === '') return '-';
    return Number(value).toFixed(2);
  }
}
