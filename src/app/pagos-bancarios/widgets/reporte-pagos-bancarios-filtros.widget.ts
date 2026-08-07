import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reporte-pagos-bancarios-filtros',
  standalone: true,
  imports: [FormsModule],
  template: `
    <section class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div class="grid grid-cols-1 gap-4 md:grid-cols-3 md:items-end">
        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Período <span class="text-red-500">*</span></label>
          <input type="month" [(ngModel)]="periodo" name="periodo" required class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white" />
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Banco <span class="text-red-500">*</span></label>
          <select [(ngModel)]="banco" name="banco" required class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white">
            <option value="BCP">BCP</option>
            <option value="FINANCIERA_OH">Financiera OH</option>
          </select>
        </div>
        <button type="button" (click)="consultar()" [disabled]="!periodo || !banco || loading" class="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400">
          @if (loading) {
            <svg class="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
            Consultando...
          } @else { Consultar }
        </button>
      </div>
    </section>
  `
})
export class ReportePagosBancariosFiltrosWidget {
  @Input() loading = false;
  @Output() consulta = new EventEmitter<{ periodo: string; banco: string }>();

  periodo = this.periodoActual();
  banco = 'BCP';

  consultar(): void {
    if (!this.periodo || !this.banco) return;
    this.consulta.emit({ periodo: this.periodo, banco: this.banco });
  }

  private periodoActual(): string {
    const fecha = new Date();
    return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
  }
}
