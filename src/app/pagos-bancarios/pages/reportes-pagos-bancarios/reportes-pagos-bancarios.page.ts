import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReportePagosBancarios } from '../../models/reporte-pagos-bancarios.model';
import { ReportePagosBancariosService } from '../../services/reporte-pagos-bancarios.service';
import { ReportePagosBancariosFiltrosWidget } from '../../widgets/reporte-pagos-bancarios-filtros.widget';
import { ReportePagosBancariosResultadosWidget } from '../../widgets/reporte-pagos-bancarios-resultados.widget';

@Component({
  selector: 'app-reportes-pagos-bancarios',
  standalone: true,
  imports: [RouterLink, ReportePagosBancariosFiltrosWidget, ReportePagosBancariosResultadosWidget],
  template: `
    <main class="min-h-screen bg-slate-50 p-4 dark:bg-slate-900 md:p-6"><div class="mx-auto max-w-7xl space-y-6">
      <header class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><h1 class="text-2xl font-bold text-slate-800 dark:text-white">Reportes de pagos bancarios</h1><p class="mt-1 text-sm text-slate-600 dark:text-slate-400">Consulta los pagos bancarios registrados por período.</p></div><a routerLink="/pagos-bancarios" class="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">Volver a pagos bancarios</a></header>
      <app-reporte-pagos-bancarios-filtros [loading]="loading()" (consulta)="consultar($event)"></app-reporte-pagos-bancarios-filtros>
      @if (error(); as mensaje) { <div class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">{{ mensaje }}</div> }
      @if (reporte(); as datos) { <app-reporte-pagos-bancarios-resultados [reporte]="datos"></app-reporte-pagos-bancarios-resultados> } @else if (!loading() && !error()) { <div class="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400">Selecciona el período y consulta el reporte.</div> }
    </div></main>
  `
})
export class ReportesPagosBancariosPage {
  loading = signal(false);
  error = signal<string | null>(null);
  reporte = signal<ReportePagosBancarios | null>(null);

  constructor(private readonly reportePagosBancariosService: ReportePagosBancariosService) {}

  consultar({ periodo, banco }: { periodo: string; banco: string }): void {
    this.loading.set(true);
    this.error.set(null);
    this.reporte.set(null);
    this.reportePagosBancariosService.obtenerReporte(periodo, banco).subscribe({
      next: (reporte) => { this.reporte.set(reporte); this.loading.set(false); },
      error: (error) => { this.error.set(error.error?.mensaje || error.error?.message || 'No se pudo consultar el reporte de pagos bancarios.'); this.loading.set(false); }
    });
  }
}
