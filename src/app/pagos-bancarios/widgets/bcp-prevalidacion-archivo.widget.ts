import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';
import { BcpPagoDuplicado, PrevalidacionArchivoBcp } from '../models/bcp-archivo.model';

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
          <span class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold" [class]="approvalEnabled ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'">
            {{ approvalEnabled ? 'Listo para aprobar' : 'Requiere revisión' }}
          </span>
          <p class="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{{ data.length }} registro(s)</p>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full border-separate border-spacing-y-2 text-xs">
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
            </tr>
          </thead>

          @for (row of data; track trackRow(row, $index)) {
            <tbody [class]="getGroupClass(row)">
              <tr class="border-t-2" [class]="getGroupBorderClass(row)">
                <td class="px-2 py-2 font-bold text-blue-700 dark:text-blue-300 rounded-tl-lg">BANCO</td>
                <td class="px-2 py-2 font-semibold whitespace-nowrap">
                  <button type="button" (click)="documentoClick.emit(row)" class="text-left text-blue-700 underline-offset-2 hover:underline dark:text-blue-300" [disabled]="!value(row, 'documentoBanco', 'documento_banco')">
                    {{ value(row, 'documentoBanco', 'documento_banco') || '-' }}
                  </button>
                </td>
                <td class="px-2 py-2 text-slate-700 dark:text-slate-300 whitespace-nowrap">{{ value(row, 'fechaBanco', 'fecha_banco') || '-' }}</td>
                <td class="px-2 py-2 text-right font-semibold text-slate-900 dark:text-white whitespace-nowrap">{{ formatMoney(value(row, 'montoBanco', 'monto_banco')) }}</td>
                <td class="px-2 py-2 text-slate-700 dark:text-slate-300 whitespace-nowrap">{{ value(row, 'numeroOperacion', 'numero_operacion') || '-' }}</td>
                <td class="px-2 py-2 whitespace-nowrap" rowspan="2">
                  <span class="inline-flex rounded-full px-2 py-1 text-[10px] font-bold leading-tight" [class]="getEstadoClass(value(row, 'estadoPrevalidacion', 'estado_prevalidacion'))">
                    {{ getEstadoLabel(value(row, 'estadoPrevalidacion', 'estado_prevalidacion')) }}
                  </span>
                </td>
                <td class="px-2 py-2 max-w-44 text-slate-700 dark:text-slate-300 leading-snug" rowspan="2">{{ getRecomendacion(row).problema }}</td>
                <td class="px-2 py-2 max-w-56 text-slate-700 dark:text-slate-300 leading-snug" rowspan="2">{{ getRecomendacion(row).accion }}</td>
              </tr>

              <tr>
                <td class="px-2 pb-2 pt-1 font-bold text-purple-700 dark:text-purple-300 rounded-bl-lg">AGENTE</td>
                <td class="px-2 pb-2 pt-1 font-semibold text-slate-800 dark:text-slate-100 whitespace-nowrap">{{ value(row, 'documentoAgente', 'documento_agente') || '-' }}</td>
                <td class="px-2 pb-2 pt-1 text-slate-700 dark:text-slate-300 whitespace-nowrap">{{ value(row, 'fechaPago', 'fecha_pago') || '-' }}</td>
                <td class="px-2 pb-2 pt-1 text-right font-semibold text-slate-900 dark:text-white whitespace-nowrap">{{ formatMoney(value(row, 'montoPago', 'monto_pago')) }}</td>
                <td class="px-2 pb-2 pt-1 text-slate-700 dark:text-slate-300 whitespace-nowrap">{{ value(row, 'operacionAgente', 'operacion_agente') || '-' }}</td>
              </tr>
            </tbody>
          } @empty {
            <tbody>
              <tr>
                <td colspan="8" class="px-4 py-10 text-center text-sm text-slate-500 dark:text-slate-400">No hay prevalidación disponible.</td>
              </tr>
            </tbody>
          }
        </table>
      </div>

      <div class="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 flex items-center justify-between gap-3">
        <p class="text-xs text-slate-500 dark:text-slate-400">El guardado se habilita solo cuando todos los registros están listos para aprobar.</p>
        <div class="flex items-center gap-2">
          @if (tieneFallos()) {
            <button type="button" (click)="descargarReporteFallos()" class="px-4 py-2 rounded-lg text-sm font-semibold transition-colors bg-amber-600 text-white hover:bg-amber-700">
              Descargar reporte de fallos
            </button>
          }
          @if (showGuardar) {
            <button type="button" (click)="guardar.emit(getFilasAprobadas())" [disabled]="!puedeGuardar() || isSaving" class="px-5 py-2 rounded-lg text-sm font-semibold transition-colors bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed dark:disabled:bg-slate-700 dark:disabled:text-slate-400">
              {{ isSaving ? 'Guardando...' : 'Guardar' }}
            </button>
          }
        </div>
      </div>
    </div>
  `
})
export class BcpPrevalidacionArchivoWidget {
  @Input() data: PrevalidacionArchivoBcp[] = [];
  @Input() todosAprobables = false;
  @Input() approvalEnabled = false;
  @Input() isSaving = false;
  @Input() pagosDuplicados: BcpPagoDuplicado[] = [];
  @Input() showGuardar = true;
  @Output() guardar = new EventEmitter<PrevalidacionArchivoBcp[]>();
  @Output() documentoClick = new EventEmitter<PrevalidacionArchivoBcp>();

  private readonly recomendacionesPorEstado: Record<string, { problema: string; accion: string }> = {
    LISTO_PARA_APROBAR: {
      problema: 'Pago conciliable',
      accion: 'Puede aprobarse la carga.'
    },
    REQUIERE_REVISION_MONTO: {
      problema: 'Monto distinto al banco.',
      accion: 'Revisar y corregir el monto tipificado o verificar si corresponde a un pago parcial.'
    },
    PAGO_REGISTRADO_FECHA_DISTINTA_BANCO: {
      problema: 'Fecha distinta al banco.',
      accion: 'Corregir la fecha del pago tipificado para que coincida con la fecha bancaria y volver a cargar el archivo.'
    },
    PAGO_REGISTRADO_FECHA_MONTO_DISTINTOS_BANCO: {
      problema: 'Fecha y monto distintos al banco.',
      accion: 'Revisar y corregir fecha/monto del pago tipificado antes de volver a cargar.'
    },
    DOCUMENTO_NO_EXISTE_EN_CLIENTES: {
      problema: 'Documento no existe.',
      accion: 'Validar DNI/documento o revisar si pertenece a otra base no cargada.'
    },
    CLIENTE_NO_PERTENECE_A_CONTEXTO: {
      problema: 'Cliente pertenece a otra subcartera.',
      accion: 'Validar la subcartera correcta para esta carga.'
    },
    NO_TIENE_PROMESA: {
      problema: 'Sin promesa activa.',
      accion: 'Crear una promesa de pago antes de conciliar.'
    },
    PROMESA_SIN_CUOTAS_PENDIENTES: {
      problema: 'Promesa sin cuotas pendientes.',
      accion: 'Verificar si la promesa ya fue completada o si corresponde crear una nueva promesa.'
    },
    FALTA_TIPIFICACION_CANCELACION: {
      problema: 'Falta cancelación.',
      accion: 'Registrar tipificación de cancelación o generar automáticamente el pago asociado.'
    },
    FECHA_FUERA_DE_RANGO_DE_PROMESA: {
      problema: 'Fecha fuera de promesa.',
      accion: 'Revisar fecha de promesa/cuota o corregir la fecha del pago tipificado.'
    },
    PAGO_YA_CONCILIADO_PREVIAMENTE: {
      problema: 'Este pago ya fue conciliado previamente.',
      accion: 'No se aprueba ni se envía a conciliación.'
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
    return this.value(row, 'estadoPrevalidacion', 'estado_prevalidacion') === 'LISTO_PARA_APROBAR' && this.hasAgente(row) && !this.isDuplicado(row);
  }

  puedeGuardar(): boolean {
    const todasListas = this.data.length > 0 && this.data.every(row => this.isListo(row));
    return this.approvalEnabled
      && todasListas;
  }

  getFilasAprobadas(): PrevalidacionArchivoBcp[] {
    return this.data.filter(row => this.isListo(row));
  }

  getFilasAprobables(): PrevalidacionArchivoBcp[] {
    return this.data.filter(row => this.isListo(row));
  }

  isDuplicado(row: PrevalidacionArchivoBcp): boolean {
    const documento = String(this.value(row, 'documentoBanco', 'documento_banco') || '');
    const fecha = String(this.value(row, 'fechaBanco', 'fecha_banco') || '');
    const monto = Number(this.value(row, 'montoBanco', 'monto_banco'));
    const operacion = String(this.value(row, 'numeroOperacion', 'numero_operacion') || '');

    return this.pagosDuplicados.some(dup => {
      const dupOperacion = String(dup.numeroOperacion || '');
      return String(dup.documento || '') === documento
        && String(dup.fechaBanco || '') === fecha
        && Math.abs(Number(dup.montoBanco) - monto) < 0.01
        && (!dupOperacion || !operacion || dupOperacion === operacion);
    });
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

  async descargarReporteFallos(): Promise<void> {
    const fallos = this.data.filter(row => this.value(row, 'estadoPrevalidacion', 'estado_prevalidacion') !== 'LISTO_PARA_APROBAR');
    if (fallos.length === 0) return;

    const fechaCarga = new Date();
    const workbook = new Workbook();
    workbook.creator = 'Sistema de Cobranza';
    workbook.created = fechaCarga;

    const ws = workbook.addWorksheet('Incidencias', {
      properties: { tabColor: { argb: 'EF4444' } }
    });

    ws.columns = [
      { width: 6 },
      { width: 16 },
      { width: 18 },
      { width: 28 },
      { width: 58 },
      { width: 14 },
      { width: 14 },
      { width: 14 },
      { width: 20 },
      { width: 16 },
      { width: 14 },
      { width: 20 }
    ];

    ws.mergeCells('A1:L1');
    const title = ws.getCell('A1');
    title.value = 'INCIDENCIAS DE PREVALIDACIÓN BCP';
    title.font = { bold: true, size: 16, color: { argb: 'FFFFFF' } };
    title.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1E293B' } };
    title.alignment = { horizontal: 'center', vertical: 'middle' };
    ws.getRow(1).height = 28;

    ws.getCell('A3').value = 'Fecha y hora:';
    ws.getCell('B3').value = fechaCarga.toLocaleString('es-PE');
    ws.getCell('D3').value = 'Total incidencias:';
    ws.getCell('E3').value = fallos.length;
    ws.getCell('A4').value = 'Indicacion:';
    ws.getCell('B4').value = 'Corregir primero Documento, Problema y Acción recomendada. Luego volver a cargar el archivo.';
    ws.mergeCells('B4:L4');

    ['A3', 'D3', 'A4'].forEach(cell => {
      ws.getCell(cell).font = { bold: true, color: { argb: '334155' } };
    });

    let row = 6;
    const headerRowNumber = row;
    const headers = ['#', 'Documento', 'Estado', 'Problema', 'Acción recomendada', 'Fecha banco', 'Monto banco', 'Nro. operación', 'Fecha sistema', 'Monto sistema', 'Operación sistema', 'Estado técnico'];
    const headerRow = ws.getRow(headerRowNumber);
    headers.forEach((header, index) => {
      const cell = headerRow.getCell(index + 1);
      cell.value = header;
      cell.font = { bold: true, color: { argb: 'FFFFFF' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '475569' } };
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      cell.border = this.excelBorder();
    });
    ws.getRow(headerRowNumber).height = 24;
    row++;

    fallos.forEach((item, index) => {
      const estado = this.value(item, 'estadoPrevalidacion', 'estado_prevalidacion') || '';
      const recomendacion = this.getRecomendacion(item);
      const dataRow = ws.getRow(row);
      const values = [
        index + 1,
        this.value(item, 'documentoBanco', 'documento_banco') || '',
        this.getEstadoLabel(estado),
        recomendacion.problema,
        recomendacion.accion,
        this.value(item, 'fechaBanco', 'fecha_banco') || '',
        Number(this.value(item, 'montoBanco', 'monto_banco') || 0),
        this.value(item, 'numeroOperacion', 'numero_operacion') || '',
        this.value(item, 'fechaPago', 'fecha_pago') || '',
        this.value(item, 'montoPago', 'monto_pago') !== null && this.value(item, 'montoPago', 'monto_pago') !== undefined ? Number(this.value(item, 'montoPago', 'monto_pago')) : '',
        this.value(item, 'operacionAgente', 'operacion_agente') || '',
        estado
      ];

      values.forEach((value, colIndex) => {
        const cell = dataRow.getCell(colIndex + 1);
        cell.value = value;
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: this.getExcelFillColor(estado) } };
        cell.border = this.excelBorder();
        cell.alignment = { vertical: 'top', wrapText: true };
        if (colIndex === 6 || colIndex === 9) cell.numFmt = '"S/." #,##0.00';
      });
      dataRow.height = 34;
      row++;
    });

    ws.autoFilter = {
      from: { row: headerRowNumber, column: 1 },
      to: { row: headerRowNumber, column: headers.length }
    };
    ws.views = [{ state: 'frozen', ySplit: headerRowNumber }];

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `reporte-incidencias-bcp-${new Date().toISOString().slice(0, 10)}.xlsx`);
  }

  private getExcelFillColor(estado: string): string {
    if (estado === 'REQUIERE_REVISION_MONTO' || estado === 'PAGO_REGISTRADO_FECHA_DISTINTA_BANCO' || estado === 'PAGO_REGISTRADO_FECHA_MONTO_DISTINTOS_BANCO') return 'FEF3C7';
    if (estado === 'CLIENTE_NO_PERTENECE_A_CONTEXTO') return 'E2E8F0';
    return 'FEE2E2';
  }

  private excelBorder(): any {
    return {
      top: { style: 'thin', color: { argb: 'CBD5E1' } },
      bottom: { style: 'thin', color: { argb: 'CBD5E1' } },
      left: { style: 'thin', color: { argb: 'CBD5E1' } },
      right: { style: 'thin', color: { argb: 'CBD5E1' } }
    };
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
    if (estado === 'REQUIERE_REVISION_MONTO' || estado === 'PAGO_REGISTRADO_FECHA_DISTINTA_BANCO' || estado === 'PAGO_REGISTRADO_FECHA_MONTO_DISTINTOS_BANCO') return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300';
    return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300';
  }

  getEstadoLabel(estado: string | null | undefined): string {
    if (estado === 'LISTO_PARA_APROBAR') return 'LISTO';
    if (estado === 'REQUIERE_REVISION_MONTO' || estado === 'PAGO_REGISTRADO_FECHA_DISTINTA_BANCO' || estado === 'PAGO_REGISTRADO_FECHA_MONTO_DISTINTOS_BANCO') return 'REVISIÓN';
    if (!estado) return '-';
    return 'ACCIÓN';
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
