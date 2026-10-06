import { Component, computed, inject, signal } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { CargaHistoricaCartasNoAdeudoResponse } from '../../../models/carta-no-adeudo.model';
import { CartaNoAdeudoService } from '../../../services/carta-no-adeudo.service';

@Component({
  selector: 'app-carta-no-adeudo-carga-historica-page',
  standalone: true,
  imports: [LucideAngularModule],
  template: `
    <div class="min-h-screen bg-slate-50 p-4 dark:bg-slate-900">
      <div class="mx-auto max-w-4xl">
        <h1 class="text-base font-semibold text-slate-800 dark:text-white">Carga de cartas enviadas antes del módulo</h1>
        <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Guarda las cartas de no adeudo que se enviaron antes del módulo. Las que hacen match por DNI pasan al
          Historial como enviadas y salen de la lista de Validación de correo. No se envía ningún correo.
        </p>

        <section class="mt-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <p class="text-xs text-slate-600 dark:text-slate-300">
            Excel (.xlsx o .xls), primera hoja, con cabecera PERIODO, DNI, TITULAR, CUENTA. Se guardan todas las filas,
            con o sin match; la fecha de envío es el fin de mes del periodo y todas entran al reporte de ese mes.
          </p>
          <div class="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              #archivoInput
              type="file"
              accept=".xlsx,.xls"
              (change)="seleccionarArchivo(archivoInput.files)"
              class="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-700 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200" />
            <button
              type="button"
              [disabled]="!archivo() || cargando()"
              (click)="cargar()"
              class="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40">
              @if (cargando()) {
                <span class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                Procesando...
              } @else {
                <lucide-angular name="file-spreadsheet" [size]="16"></lucide-angular>
                Cargar
              }
            </button>
          </div>
          @if (error()) {
            <p class="mt-2 text-xs text-red-600 dark:text-red-400">{{ error() }}</p>
          }
        </section>

        @if (resultado(); as data) {
          <section class="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div class="flex flex-wrap items-center gap-2 border-b border-slate-200 px-4 py-3 text-xs dark:border-slate-700">
              <span class="rounded-full bg-slate-100 px-2 py-0.5 font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-200">{{ data.total }} filas</span>
              <span class="rounded-full bg-emerald-100 px-2 py-0.5 font-medium text-emerald-700">{{ data.conMatch }} con match</span>
              <span class="rounded-full bg-blue-100 px-2 py-0.5 font-medium text-blue-700">{{ data.sinMatch }} guardadas sin match</span>
              <span class="rounded-full bg-amber-100 px-2 py-0.5 font-medium text-amber-700">{{ data.omitidas }} omitidas</span>
              @if (data.omitidas > 0) {
                <label class="ml-auto inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                  <input #soloOmitidasInput type="checkbox" [checked]="soloOmitidas()" (change)="soloOmitidas.set(soloOmitidasInput.checked)" />
                  Ver solo omitidas
                </label>
              }
            </div>
            <div class="max-h-[32rem] overflow-auto">
              <table class="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-700">
                <thead class="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-900/40">
                  <tr>
                    <th class="px-4 py-3 text-left font-semibold">Fila</th>
                    <th class="px-4 py-3 text-left font-semibold">Documento</th>
                    <th class="px-4 py-3 text-left font-semibold">Periodo</th>
                    <th class="px-4 py-3 text-left font-semibold">Fecha de envío</th>
                    <th class="px-4 py-3 text-left font-semibold">Resultado</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
                  @for (fila of filasVisibles(); track fila.fila) {
                    <tr>
                      <td class="px-4 py-2 text-slate-500">{{ fila.fila }}</td>
                      <td class="px-4 py-2 text-slate-700 dark:text-slate-200">{{ fila.documento }}</td>
                      <td class="px-4 py-2 text-slate-600 dark:text-slate-300">{{ fila.periodo }}</td>
                      <td class="px-4 py-2 text-slate-600 dark:text-slate-300">{{ fila.fechaEnvio ?? '—' }}</td>
                      <td class="px-4 py-2">
                        <span
                          class="rounded-full px-2 py-0.5 text-xs font-medium"
                          [class.bg-emerald-100]="fila.estado === 'CON_MATCH'"
                          [class.text-emerald-700]="fila.estado === 'CON_MATCH'"
                          [class.bg-blue-100]="fila.estado === 'SIN_MATCH'"
                          [class.text-blue-700]="fila.estado === 'SIN_MATCH'"
                          [class.bg-amber-100]="fila.estado === 'OMITIDA'"
                          [class.text-amber-700]="fila.estado === 'OMITIDA'">
                          {{ fila.mensaje }}
                        </span>
                      </td>
                    </tr>
                  } @empty {
                    <tr><td colspan="5" class="px-4 py-8 text-center text-sm text-slate-500">Sin filas para mostrar.</td></tr>
                  }
                </tbody>
              </table>
            </div>
          </section>
        }
      </div>
    </div>
  `
})
export class CartaNoAdeudoCargaHistoricaPageComponent {
  private readonly cartaNoAdeudoService = inject(CartaNoAdeudoService);

  readonly archivo = signal<File | null>(null);
  readonly cargando = signal(false);
  readonly error = signal<string | null>(null);
  readonly resultado = signal<CargaHistoricaCartasNoAdeudoResponse | null>(null);
  readonly soloOmitidas = signal(false);

  readonly filasVisibles = computed(() => {
    const filas = this.resultado()?.resultados ?? [];
    return this.soloOmitidas() ? filas.filter(fila => fila.estado === 'OMITIDA') : filas;
  });

  seleccionarArchivo(archivos: FileList | null): void {
    this.archivo.set(archivos?.item(0) ?? null);
    this.error.set(null);
  }

  cargar(): void {
    const archivo = this.archivo();
    if (!archivo || this.cargando()) return;

    this.cargando.set(true);
    this.error.set(null);
    this.resultado.set(null);
    this.soloOmitidas.set(false);
    this.cartaNoAdeudoService.cargarEnviadasHistoricas(archivo).subscribe({
      next: response => {
        this.resultado.set(response);
        this.cargando.set(false);
      },
      error: error => {
        console.error('No se pudo procesar la carga histórica de cartas de no adeudo', error);
        this.error.set(error?.error?.message || error?.message || 'No se pudo procesar el archivo.');
        this.cargando.set(false);
      }
    });
  }
}
