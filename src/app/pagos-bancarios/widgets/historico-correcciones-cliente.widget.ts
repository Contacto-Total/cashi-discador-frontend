import { Component, Input, OnChanges, SimpleChanges, inject, signal } from '@angular/core';
import { ContextoAjuste, ETIQUETAS_TIPO_CAMBIO, HistoricoCorreccion } from '../models/ajuste-conciliacion.model';
import { AjusteConciliacionService } from '../services/ajuste-conciliacion.service';


/** Histórico de correcciones del cliente en la subcartera, del más reciente al más antiguo. */
@Component({
  selector: 'app-historico-correcciones-cliente',
  standalone: true,
  template: `
    <section aria-labelledby="hcc-titulo">
      <h2 id="hcc-titulo" class="sr-only">Histórico de correcciones del cliente</h2>
      @if (error(); as texto) {
        <p role="alert" class="m-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/20 dark:text-red-300">{{ texto }}</p>
      }
      @if (filas().length === 0 && !cargando() && !error()) {
        <p class="p-6 text-center text-sm text-slate-600 dark:text-slate-400">Sin correcciones registradas para este cliente.</p>
      }
      @if (filas().length > 0) {
        <ol class="divide-y divide-slate-100 dark:divide-slate-800">
          @for (h of filas(); track h.id) {
            <li class="px-4 py-3 text-sm">
              <p class="flex flex-wrap items-baseline gap-x-2">
                <span class="font-semibold text-slate-900 dark:text-white">{{ tipo(h.tipoCambio) }}</span>
                <span class="text-xs text-slate-500 dark:text-slate-400">{{ fechaHora(h.fechaCambio) }} · {{ h.supervisorNombre || 'Sistema' }}</span>
              </p>
              @if (h.observacion) {
                <p class="mt-0.5 text-slate-700 dark:text-slate-200">{{ h.observacion }}</p>
              }
              <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                {{ referencias(h) }}
              </p>
              @if (h.detalleAnterior || h.detalleNuevo) {
                <details class="mt-1">
                  <summary class="cursor-pointer text-xs font-semibold text-blue-700 dark:text-blue-300">Ver detalle</summary>
                  @if (h.detalleAnterior) {
                    <p class="mt-1 text-xs text-slate-600 dark:text-slate-300"><span class="font-semibold">Antes:</span> {{ h.detalleAnterior }}</p>
                  }
                  @if (h.detalleNuevo) {
                    <p class="mt-1 text-xs text-slate-600 dark:text-slate-300"><span class="font-semibold">Después:</span> {{ h.detalleNuevo }}</p>
                  }
                </details>
              }
            </li>
          }
        </ol>
      }
      @if (cargando()) {
        <p role="status" class="p-4 text-center text-sm text-slate-600 dark:text-slate-400">Cargando histórico...</p>
      } @else if (!ultima() && filas().length > 0) {
        <div class="p-3 text-center">
          <button type="button" (click)="cargarMas()" class="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700">Ver más</button>
        </div>
      }
    </section>
  `
})
export class HistoricoCorreccionesClienteWidget implements OnChanges {
  private ajusteService = inject(AjusteConciliacionService);

  @Input() documento: string | null = null;
  @Input() contexto: ContextoAjuste | null = null;
  @Input() refresco = 0;

  readonly filas = signal<HistoricoCorreccion[]>([]);
  readonly cargando = signal(false);
  readonly error = signal<string | null>(null);
  readonly ultima = signal(true);
  private pagina = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['documento'] || changes['refresco'] || changes['contexto']?.firstChange) {
      this.pagina = 0;
      this.filas.set([]);
      this.cargar();
    }
  }

  cargarMas(): void {
    this.pagina++;
    this.cargar();
  }

  private cargar(): void {
    const documento = this.documento?.trim();
    if (!documento || !this.contexto) return;
    this.cargando.set(true);
    this.error.set(null);
    this.ajusteService.historicoCorrecciones(documento, this.contexto, this.pagina).subscribe({
      next: pagina => {
        this.cargando.set(false);
        this.filas.set([...this.filas(), ...(pagina.content || [])]);
        this.ultima.set(pagina.last);
      },
      error: err => {
        this.cargando.set(false);
        this.error.set(err?.error?.mensaje || err?.error?.message || 'No se pudo cargar el histórico.');
      }
    });
  }

  tipo(tipo: string | null): string {
    return (tipo && ETIQUETAS_TIPO_CAMBIO[tipo]) || tipo || 'Corrección';
  }

  referencias(h: HistoricoCorreccion): string {
    const partes: string[] = [];
    if (h.bcpPagoDetalleId) partes.push(`Pb ${h.bcpPagoDetalleId}`);
    if (h.gestionPromesaId) partes.push(`gestión ${h.gestionPromesaId}`);
    if (h.cuotaId) partes.push(`cuota ${h.cuotaId}`);
    if (h.pagoCuotaId) partes.push(`pago cuota ${h.pagoCuotaId}`);
    return partes.join(' · ');
  }

  fechaHora(valor: string | null): string {
    if (!valor) return '-';
    const match = String(valor).match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
    return match ? `${match[3]}/${match[2]}/${match[1]} ${match[4]}:${match[5]}` : String(valor);
  }
}
