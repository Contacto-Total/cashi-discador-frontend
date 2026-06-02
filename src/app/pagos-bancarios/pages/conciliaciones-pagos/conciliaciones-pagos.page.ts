import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConciliacionPagosService } from '../../services/conciliacion-pagos.service';
import { PosibleMatchConciliacionDTO, PosiblesMatchConciliacionParams } from '../../models/conciliacion-pagos.model';
import { ConciliacionPagosFiltrosWidget } from '../../widgets/conciliacion-pagos-filtros.widget';
import { ConciliacionPagosResultadosWidget } from '../../widgets/conciliacion-pagos-resultados.widget';

@Component({
  selector: 'app-conciliaciones-pagos',
  standalone: true,
  imports: [CommonModule, ConciliacionPagosFiltrosWidget, ConciliacionPagosResultadosWidget],
  template: `
    <section class="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-6">
      <div class="mx-auto max-w-7xl space-y-6">
        <div>
          <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Conciliación de Pagos</h1>
          <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Busca posibles matches entre pagos bancarios y pagos registrados por agente.</p>
        </div>

        @if (mensaje(); as msg) {
          <div class="rounded-xl border px-4 py-3 text-sm" [class]="msg.tipo === 'error' ? 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300' : 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300'">
            {{ msg.texto }}
          </div>
        }

        @if (!showResultados()) {
          <app-conciliacion-pagos-filtros (filtrosSubmit)="buscarPosiblesMatch($event)"></app-conciliacion-pagos-filtros>
        } @else {
          <app-conciliacion-pagos-resultados [data]="resultados()"></app-conciliacion-pagos-resultados>
        }

        @if (isLoading()) {
          <div class="fixed inset-0 bg-slate-950/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div class="rounded-2xl bg-white dark:bg-slate-800 px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-200 shadow-xl">
              Consultando posibles matches...
            </div>
          </div>
        }
      </div>
    </section>
  `
})
export class ConciliacionesPagosPage {
  isLoading = signal(false);
  showResultados = signal(false);
  resultados = signal<PosibleMatchConciliacionDTO[]>([]);
  mensaje = signal<{ tipo: 'success' | 'error'; texto: string } | null>(null);

  constructor(private conciliacionPagosService: ConciliacionPagosService) {}

  buscarPosiblesMatch(params: PosiblesMatchConciliacionParams): void {
    this.isLoading.set(true);
    this.mensaje.set(null);

    this.conciliacionPagosService.obtenerPosiblesMatch(params).subscribe({
      next: (response) => {
        console.log('[CONCILIACION-PAGOS] Posibles match:', response);
        this.resultados.set(response);
        this.showResultados.set(true);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('[CONCILIACION-PAGOS] Error consultando posibles match:', error);
        this.mensaje.set({ tipo: 'error', texto: 'No se pudieron consultar los posibles matches.' });
        this.isLoading.set(false);
      }
    });
  }
}
