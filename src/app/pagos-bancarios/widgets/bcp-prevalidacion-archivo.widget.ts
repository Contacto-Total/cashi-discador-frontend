import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormatService } from '@/shared/services/format.service';
import { CommonModule } from '@angular/common';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';
import { BcpPagoDuplicado, PrevalidacionArchivoBcp } from '../models/bcp-archivo.model';
import {
  CategoriaPagoInfo,
  MOTIVOS_REVISION,
  TONO_BORDE,
  TONO_FILA,
  TONO_PILL,
  fechaCorta,
  infoCategoria,
  montoSoles
} from '../models/categoria-pago';

interface ResumenCategoria {
  categoria: string;
  info: CategoriaPagoInfo;
  total: number;
}

@Component({
  selector: 'app-bcp-prevalidacion-archivo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- relative: contiene el caption sr-only; sin esto se sale del scroll de .main-content y estira la página -->
    <section class="relative bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden mb-6" aria-labelledby="prevalidacion-titulo">
      <div class="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 id="prevalidacion-titulo" class="text-lg font-semibold text-slate-800 dark:text-white">Resultado de la carga</h2>
          <p class="text-xs text-slate-600 dark:text-slate-400">Cada pago del banco comparado con los pagos registrados por el asesor</p>
        </div>
        <div class="text-right">
          <span class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold" [class]="completed ? pill('ok') : pill('neutro')">
            {{ completed ? 'Guardado' : 'Vista previa' }}
          </span>
          <p class="mt-1 text-[11px] text-slate-600 dark:text-slate-400">{{ data.length }} pago(s)</p>
        </div>
      </div>

      @if (data.length > 0) {
        <div class="flex flex-wrap items-center gap-2 border-b border-slate-200 px-4 py-3 dark:border-slate-700" role="group" aria-label="Filtrar por categoría">
          <button
            type="button"
            (click)="filtro = null"
            [attr.aria-pressed]="filtro === null"
            class="rounded-full border px-3 py-1 text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-800"
            [class]="filtro === null ? 'border-blue-600 bg-blue-600 !text-white' : 'border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700'"
          >
            Todas ({{ data.length }})
          </button>
          @for (item of resumen(); track item.categoria) {
            <button
              type="button"
              (click)="filtro = item.categoria"
              [attr.aria-pressed]="filtro === item.categoria"
              class="rounded-full border px-3 py-1 text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-800"
              [class]="filtro === item.categoria ? 'border-slate-800 ' + pill(item.info.tono) : 'border-transparent ' + pill(item.info.tono) + ' opacity-80 hover:opacity-100'"
            >
              {{ item.info.label }} ({{ item.total }})
            </button>
          }
        </div>
      }

      <div class="overflow-x-auto">
        <table class="min-w-full border-separate border-spacing-y-2 text-xs">
          <caption class="sr-only">Pagos del archivo con su categoría de conciliación</caption>
          <thead class="bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-200 uppercase tracking-wide">
            <tr>
              <th scope="col" class="px-2 py-2 text-left font-bold w-20">Origen</th>
              <th scope="col" class="px-2 py-2 text-left font-bold">Documento</th>
              <th scope="col" class="px-2 py-2 text-left font-bold">Fecha</th>
              <th scope="col" class="px-2 py-2 text-right font-bold">Monto</th>
              <th scope="col" class="px-2 py-2 text-left font-bold">Nro. operación</th>
              <th scope="col" class="px-2 py-2 text-left font-bold">Categoría</th>
              <th scope="col" class="px-2 py-2 text-left font-bold">Detalle</th>
              <th scope="col" class="px-2 py-2 text-left font-bold">Acción</th>
            </tr>
          </thead>

          @for (row of filasVisibles(); track trackRow(row, $index)) {
            <tbody [class]="filaClass(row)">
              <tr class="border-t-2" [class]="bordeClass(row)">
                <th scope="row" class="px-2 py-2 text-left font-bold text-blue-700 dark:text-blue-300 rounded-tl-lg">BANCO</th>
                <td class="px-2 py-2 font-semibold whitespace-nowrap">
                  <button
                    type="button"
                    (click)="documentoClick.emit(row)"
                    [disabled]="!value(row, 'documentoBanco', 'documento_banco')"
                    [attr.aria-label]="'Ver resumen del cliente ' + (value(row, 'documentoBanco', 'documento_banco') || '')"
                    class="rounded text-left text-blue-700 underline underline-offset-2 hover:text-blue-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-blue-300 dark:hover:text-blue-200"
                  >
                    {{ value(row, 'documentoBanco', 'documento_banco') || '-' }}
                  </button>
                </td>
                <td class="px-2 py-2 text-slate-700 dark:text-slate-300 whitespace-nowrap">{{ fecha(value(row, 'fechaBanco', 'fecha_banco')) }}</td>
                <td class="px-2 py-2 text-right font-semibold text-slate-900 dark:text-white whitespace-nowrap">{{ formatMoney(value(row, 'montoBanco', 'monto_banco')) }}</td>
                <td class="px-2 py-2 text-slate-700 dark:text-slate-300 whitespace-nowrap">{{ value(row, 'numeroOperacion', 'numero_operacion') || '-' }}</td>
                <td class="px-2 py-2 whitespace-nowrap" rowspan="2">
                  <span class="inline-flex rounded-full px-2 py-1 text-[11px] font-bold leading-tight" [class]="pill(info(row).tono)">
                    {{ info(row).label }}
                  </span>
                </td>
                <td class="px-2 py-2 max-w-56 text-slate-700 dark:text-slate-300 leading-snug" rowspan="2">{{ detalle(row) }}</td>
                <td class="px-2 py-2 max-w-56 text-slate-700 dark:text-slate-300 leading-snug" rowspan="2">
                  @if (requiereRevision(row)) {
                    <p class="mb-2">{{ accion(row) }}</p>
                    <button
                      type="button"
                      (click)="resolver.emit(row)"
                      [attr.aria-label]="'Resolver pago de ' + (value(row, 'documentoBanco', 'documento_banco') || '') + ' por ' + formatMoney(value(row, 'montoBanco', 'monto_banco'))"
                      class="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-800"
                    >
                      Resolver
                    </button>
                  } @else {
                    {{ accion(row) }}
                  }
                </td>
              </tr>

              <tr>
                <th scope="row" class="px-2 pb-2 pt-1 text-left font-bold text-purple-700 dark:text-purple-300 rounded-bl-lg">ASESOR</th>
                <td class="px-2 pb-2 pt-1 font-semibold text-slate-800 dark:text-slate-100 whitespace-nowrap">{{ value(row, 'documentoAgente', 'documento_agente') || '-' }}</td>
                <td class="px-2 pb-2 pt-1 text-slate-700 dark:text-slate-300 whitespace-nowrap">{{ fecha(value(row, 'fechaPago', 'fecha_pago')) }}</td>
                <td class="px-2 pb-2 pt-1 text-right font-semibold text-slate-900 dark:text-white whitespace-nowrap">{{ formatMoney(value(row, 'montoPago', 'monto_pago')) }}</td>
                <td class="px-2 pb-2 pt-1 text-slate-700 dark:text-slate-300 whitespace-nowrap">{{ value(row, 'operacionAgente', 'operacion_agente') || '-' }}</td>
              </tr>
            </tbody>
          } @empty {
            <tbody>
              <tr>
                <td colspan="8" class="px-4 py-10 text-center text-sm text-slate-600 dark:text-slate-400">
                  {{ data.length === 0 ? 'No hay pagos para mostrar.' : 'No hay pagos en esta categoría.' }}
                </td>
              </tr>
            </tbody>
          }
        </table>
      </div>

      <div class="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 flex flex-wrap items-center justify-between gap-3">
        <p class="text-xs text-slate-600 dark:text-slate-400">
          Se guardan todos los pagos. Los que requieren revisión quedan como pendientes y se pueden resolver después.
        </p>
        <div class="flex items-center gap-2">
          @if (tienePendientes()) {
            <button type="button" (click)="descargarReportePendientes()" class="px-4 py-2 rounded-lg text-sm font-semibold transition-colors bg-amber-700 text-white hover:bg-amber-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-800">
              Descargar pendientes
            </button>
          }
          @if (showGuardar) {
            <button type="button" (click)="guardar.emit(filasParaGuardar())" [disabled]="!puedeGuardar() || isSaving" class="px-5 py-2 rounded-lg text-sm font-semibold transition-colors bg-emerald-700 text-white hover:bg-emerald-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:bg-slate-300 disabled:text-slate-600 disabled:cursor-not-allowed dark:focus-visible:ring-offset-slate-800 dark:disabled:bg-slate-700 dark:disabled:text-slate-400">
              {{ isSaving ? 'Guardando...' : (completed ? 'Guardado' : 'Guardar todo') }}
            </button>
          }
        </div>
      </div>
    </section>
  `
})
export class BcpPrevalidacionArchivoWidget {
  private fmt = inject(FormatService);
  @Input() data: PrevalidacionArchivoBcp[] = [];
  @Input() approvalEnabled = false;
  @Input() isSaving = false;
  @Input() pagosDuplicados: BcpPagoDuplicado[] = [];
  @Input() showGuardar = true;
  @Input() completed = false;
  @Output() guardar = new EventEmitter<PrevalidacionArchivoBcp[]>();
  @Output() documentoClick = new EventEmitter<PrevalidacionArchivoBcp>();
  @Output() resolver = new EventEmitter<PrevalidacionArchivoBcp>();

  filtro: string | null = null;

  value(row: any, camelKey: string, snakeKey?: string): any {
    return row?.[camelKey] ?? (snakeKey ? row?.[snakeKey] : undefined);
  }

  trackRow(row: PrevalidacionArchivoBcp, index: number): string {
    return `${this.value(row, 'numeroOperacion', 'numero_operacion') || 'sin-op'}-${this.value(row, 'documentoBanco', 'documento_banco') || 'sin-doc'}-${index}`;
  }

  /** Categoría de la fila; las respuestas sin categoría usan el estado de prevalidación. */
  categoria(row: PrevalidacionArchivoBcp): string {
    return this.value(row, 'categoria') || this.value(row, 'estadoPrevalidacion', 'estado_prevalidacion') || '';
  }

  info(row: PrevalidacionArchivoBcp): CategoriaPagoInfo {
    return infoCategoria(this.categoria(row));
  }

  requiereRevision(row: PrevalidacionArchivoBcp): boolean {
    return this.info(row).tono === 'revision';
  }

  resumen(): ResumenCategoria[] {
    const totales = new Map<string, number>();
    for (const row of this.data) {
      const categoria = this.categoria(row);
      totales.set(categoria, (totales.get(categoria) || 0) + 1);
    }
    return Array.from(totales.entries()).map(([categoria, total]) => ({
      categoria,
      info: infoCategoria(categoria),
      total
    }));
  }

  filasVisibles(): PrevalidacionArchivoBcp[] {
    // Si el filtro quedó en una categoría que ya no existe tras recargar, se muestran todas.
    if (this.filtro === null || !this.data.some(row => this.categoria(row) === this.filtro)) {
      return this.data;
    }
    return this.data.filter(row => this.categoria(row) === this.filtro);
  }

  detalle(row: PrevalidacionArchivoBcp): string {
    const categoria = this.categoria(row);
    if (categoria === 'PARCIAL_EN_ESPERA') {
      const faltante = this.value(row, 'montoFaltante', 'monto_faltante');
      const esperado = this.value(row, 'montoEsperado', 'monto_esperado');
      return `Falta ${this.formatMoney(faltante)} de ${this.formatMoney(esperado)}.`;
    }
    if (this.requiereRevision(row)) {
      return this.motivo(row)?.problema || 'No se encontró contra qué conciliar este pago.';
    }
    return this.info(row).label;
  }

  accion(row: PrevalidacionArchivoBcp): string {
    if (this.requiereRevision(row)) {
      return this.motivo(row)?.accion || 'Revisión manual requerida.';
    }
    return this.info(row).resultado;
  }

  private motivo(row: PrevalidacionArchivoBcp): { problema: string; accion: string } | undefined {
    const motivo = this.value(row, 'motivo') || this.value(row, 'estadoPrevalidacion', 'estado_prevalidacion');
    return MOTIVOS_REVISION[motivo];
  }

  puedeGuardar(): boolean {
    return !this.completed && this.approvalEnabled && this.filasParaGuardar().length > 0;
  }

  filasParaGuardar(): PrevalidacionArchivoBcp[] {
    return this.data.filter(row => !this.isDuplicado(row));
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

  tienePendientes(): boolean {
    return this.data.some(row => this.requiereRevision(row));
  }

  async descargarReportePendientes(): Promise<void> {
    const pendientes = this.data.filter(row => this.requiereRevision(row));
    if (pendientes.length === 0) return;

    const fechaCarga = new Date();
    const workbook = new Workbook();
    workbook.creator = 'Sistema de Cobranza';
    workbook.created = fechaCarga;

    const ws = workbook.addWorksheet('Pendientes', {
      properties: { tabColor: { argb: 'EF4444' } }
    });

    ws.columns = [
      { width: 6 },
      { width: 16 },
      { width: 22 },
      { width: 44 },
      { width: 58 },
      { width: 14 },
      { width: 14 },
      { width: 18 },
      { width: 16 },
      { width: 16 },
      { width: 20 }
    ];

    ws.mergeCells('A1:K1');
    const title = ws.getCell('A1');
    title.value = 'PAGOS BANCARIOS PENDIENTES DE RESOLVER';
    title.font = { bold: true, size: 16, color: { argb: 'FFFFFF' } };
    title.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1E293B' } };
    title.alignment = { horizontal: 'center', vertical: 'middle' };
    ws.getRow(1).height = 28;

    ws.getCell('A3').value = 'Fecha y hora:';
    ws.getCell('B3').value = this.fmt.dateTime(fechaCarga, true);
    ws.getCell('D3').value = 'Total pendientes:';
    ws.getCell('E3').value = pendientes.length;
    ['A3', 'D3'].forEach(cell => {
      ws.getCell(cell).font = { bold: true, color: { argb: '334155' } };
    });

    const headerRowNumber = 5;
    const headers = ['#', 'Documento', 'Categoría', 'Problema', 'Acción recomendada', 'Fecha banco', 'Monto banco', 'Nro. operación', 'Fecha asesor', 'Monto asesor', 'Motivo técnico'];
    const headerRow = ws.getRow(headerRowNumber);
    headers.forEach((header, index) => {
      const cell = headerRow.getCell(index + 1);
      cell.value = header;
      cell.font = { bold: true, color: { argb: 'FFFFFF' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '475569' } };
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      cell.border = this.excelBorder();
    });
    headerRow.height = 24;

    pendientes.forEach((item, index) => {
      const montoAsesor = this.value(item, 'montoPago', 'monto_pago');
      const values = [
        index + 1,
        this.value(item, 'documentoBanco', 'documento_banco') || '',
        this.info(item).label,
        this.detalle(item),
        this.accion(item),
        this.fecha(this.value(item, 'fechaBanco', 'fecha_banco')),
        Number(this.value(item, 'montoBanco', 'monto_banco') || 0),
        this.value(item, 'numeroOperacion', 'numero_operacion') || '',
        this.fecha(this.value(item, 'fechaPago', 'fecha_pago')),
        montoAsesor !== null && montoAsesor !== undefined ? Number(montoAsesor) : '',
        this.value(item, 'motivo') || ''
      ];

      const dataRow = ws.getRow(headerRowNumber + 1 + index);
      values.forEach((value, colIndex) => {
        const cell = dataRow.getCell(colIndex + 1);
        cell.value = value;
        cell.border = this.excelBorder();
        cell.alignment = { vertical: 'top', wrapText: true };
        if (colIndex === 6 || colIndex === 9) cell.numFmt = '"S/." #,##0.00';
      });
      dataRow.height = 34;
    });

    ws.autoFilter = {
      from: { row: headerRowNumber, column: 1 },
      to: { row: headerRowNumber, column: headers.length }
    };
    ws.views = [{ state: 'frozen', ySplit: headerRowNumber }];

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `pagos-pendientes-${new Date().toISOString().slice(0, 10)}.xlsx`);
  }

  private excelBorder(): any {
    return {
      top: { style: 'thin', color: { argb: 'CBD5E1' } },
      bottom: { style: 'thin', color: { argb: 'CBD5E1' } },
      left: { style: 'thin', color: { argb: 'CBD5E1' } },
      right: { style: 'thin', color: { argb: 'CBD5E1' } }
    };
  }

  filaClass(row: PrevalidacionArchivoBcp): string {
    return TONO_FILA[this.info(row).tono];
  }

  bordeClass(row: PrevalidacionArchivoBcp): string {
    return TONO_BORDE[this.info(row).tono];
  }

  pill(tono: CategoriaPagoInfo['tono']): string {
    return TONO_PILL[tono];
  }

  fecha(value: unknown): string {
    return fechaCorta(value);
  }

  formatMoney(value: number | string | null | undefined): string {
    return montoSoles(value);
  }
}
