import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';
import { ReportePagosBancarios } from '../models/reporte-pagos-bancarios.model';

@Component({
  selector: 'app-reporte-pagos-bancarios-resultados',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  template: `
    <section class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div class="flex flex-col gap-4 border-b border-slate-200 p-4 dark:border-slate-700 sm:flex-row sm:items-start sm:justify-between">
        <div class="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div><p class="text-xs font-medium uppercase text-slate-500">Período</p><p class="mt-1 font-semibold text-slate-800 dark:text-white">{{ reporte.periodo }}</p></div>
        <div><p class="text-xs font-medium uppercase text-slate-500">Banco</p><p class="mt-1 font-semibold text-slate-800 dark:text-white">{{ reporte.banco }}</p></div>
        <div><p class="text-xs font-medium uppercase text-slate-500">Total registros</p><p class="mt-1 font-semibold text-slate-800 dark:text-white">{{ reporte.totalRegistros }}</p></div>
        <div><p class="text-xs font-medium uppercase text-slate-500">Monto total</p><p class="mt-1 font-semibold text-emerald-600 dark:text-emerald-400">{{ reporte.montoTotal | currency:'PEN':'symbol-narrow':'1.2-2' }}</p></div>
        </div>
        <button type="button" (click)="descargarExcel()" [disabled]="descargando || reporte.pagos.length === 0" class="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-400">
          @if (descargando) { Generando... } @else { Descargar Excel }
        </button>
      </div>
      @if (reporte.pagos.length === 0) {
        <div class="p-8 text-center text-sm text-slate-600 dark:text-slate-400">No se encontraron pagos para los filtros seleccionados.</div>
      } @else {
        <div class="overflow-x-auto"><table class="min-w-full divide-y divide-slate-200 dark:divide-slate-700"><thead class="bg-slate-50 dark:bg-slate-700/50"><tr><th class="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Fecha banco</th><th class="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Documento</th><th class="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Nro. operación</th><th class="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Medio atención</th><th class="px-4 py-3 text-right text-xs font-medium uppercase text-slate-500">Monto banco</th><th class="px-4 py-3 text-center text-xs font-medium uppercase text-slate-500">Estado</th></tr></thead><tbody class="divide-y divide-slate-200 dark:divide-slate-700">
          @for (pago of reporte.pagos; track pago.id) {
            <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/30"><td class="whitespace-nowrap px-4 py-3 text-sm text-slate-700 dark:text-slate-300">{{ pago.fechaBanco || '-' }}</td><td class="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">{{ pago.documento || '-' }}</td><td class="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">{{ pago.numeroOperacion || '-' }}</td><td class="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">{{ pago.medioAtencion || '-' }}</td><td class="whitespace-nowrap px-4 py-3 text-right text-sm font-medium text-emerald-600 dark:text-emerald-400">{{ (pago.montoBanco || 0) | currency:'PEN':'symbol-narrow':'1.2-2' }}</td><td class="px-4 py-3 text-center"><span class="rounded-full px-2 py-1 text-xs font-medium" [class]="pago.procesado ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'">{{ pago.procesado ? 'Conciliado' : 'Pendiente' }}</span></td></tr>
          }
       </tbody></table></div>
        @if (reporte.totalPaginas > 1) {
          <div class="flex items-center justify-between border-t border-slate-200 px-4 py-3 text-sm dark:border-slate-700">
            <span class="text-slate-600 dark:text-slate-400">Página {{ reporte.pagina + 1 }} de {{ reporte.totalPaginas }}</span>
            <div class="flex gap-2">
              <button type="button" (click)="cambiarPagina(reporte.pagina - 1)" [disabled]="reporte.pagina === 0" class="rounded-lg border border-slate-300 px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700">Anterior</button>
              <button type="button" (click)="cambiarPagina(reporte.pagina + 1)" [disabled]="reporte.pagina + 1 >= reporte.totalPaginas" class="rounded-lg border border-slate-300 px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700">Siguiente</button>
            </div>
          </div>
        }
      }
    </section>
  `
})
export class ReportePagosBancariosResultadosWidget {
  @Input({ required: true }) reporte!: ReportePagosBancarios;
  @Output() paginaCambiada = new EventEmitter<number>();

  descargando = false;

  cambiarPagina(pagina: number): void {
    if (pagina >= 0 && pagina < this.reporte.totalPaginas) {
      this.paginaCambiada.emit(pagina);
    }
  }

  async descargarExcel(): Promise<void> {
    if (this.descargando || this.reporte.pagos.length === 0) return;

    this.descargando = true;
    try {
      const workbook = new Workbook();
      workbook.creator = 'Sistema de Cobranza';
      workbook.created = new Date();

      const worksheet = workbook.addWorksheet('Pagos bancarios');
      worksheet.columns = [
        { header: 'Fecha banco', key: 'fechaBanco', width: 16 },
        { header: 'Hora atención', key: 'horaAtencion', width: 16 },
        { header: 'Documento', key: 'documento', width: 18 },
        { header: 'Código depositante', key: 'codigoDepositante', width: 22 },
        { header: 'Nro. operación', key: 'numeroOperacion', width: 22 },
        { header: 'Nro. operación canal', key: 'numeroOperacionCanal', width: 26 },
        { header: 'Medio atención', key: 'medioAtencion', width: 22 },
        { header: 'Banco', key: 'banco', width: 14 },
        { header: 'Sucursal', key: 'sucursal', width: 20 },
        { header: 'Agencia', key: 'agencia', width: 20 },
        { header: 'Referencia', key: 'referencia', width: 28 },
        { header: 'Monto banco', key: 'montoBanco', width: 16 },
        { header: 'Estado', key: 'estado', width: 16 }
      ];

      worksheet.mergeCells('A1:M1');
      const titulo = worksheet.getCell('A1');
      titulo.value = `REPORTE DE PAGOS BANCARIOS - ${this.reporte.banco}`;
      titulo.font = { bold: true, size: 14, color: { argb: 'FFFFFF' } };
      titulo.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1E293B' } };
      titulo.alignment = { horizontal: 'center' };

      worksheet.getCell('A3').value = 'Período:';
      worksheet.getCell('B3').value = this.reporte.periodo;
      worksheet.getCell('D3').value = 'Total registros:';
      worksheet.getCell('E3').value = this.reporte.totalRegistros;
      worksheet.getCell('G3').value = 'Monto total:';
      worksheet.getCell('H3').value = this.reporte.montoTotal;
      worksheet.getCell('H3').numFmt = '"S/." #,##0.00';

      const headerRow = worksheet.getRow(5);
      headerRow.values = [
        'Fecha banco', 'Hora atención', 'Documento', 'Código depositante', 'Nro. operación',
        'Nro. operación canal', 'Medio atención', 'Banco', 'Sucursal', 'Agencia', 'Referencia',
        'Monto banco', 'Estado'
      ];
      headerRow.eachCell(cell => {
        cell.font = { bold: true, color: { argb: 'FFFFFF' } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '475569' } };
        cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      });

      this.reporte.pagos.forEach(pago => {
        const row = worksheet.addRow({
          fechaBanco: pago.fechaBanco || '', horaAtencion: pago.horaAtencion || '', documento: pago.documento || '',
          codigoDepositante: pago.codigoDepositante || '', numeroOperacion: pago.numeroOperacion || '',
          numeroOperacionCanal: pago.numeroOperacionCanal || '', medioAtencion: pago.medioAtencion || '', banco: pago.banco || '',
          sucursal: pago.sucursal || '', agencia: pago.agencia || '', referencia: pago.referencia || '',
          montoBanco: pago.montoBanco || 0, estado: pago.procesado ? 'Conciliado' : 'Pendiente'
        });
        row.getCell('montoBanco').numFmt = '"S/." #,##0.00';
      });

      worksheet.autoFilter = { from: 'A5', to: 'M5' };
      worksheet.views = [{ state: 'frozen', ySplit: 5 }];
      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(new Blob([buffer]), `reporte-pagos-bancarios-${this.reporte.banco.toLowerCase()}-${this.reporte.periodo}.xlsx`);
    } finally {
      this.descargando = false;
    }
  }
}
