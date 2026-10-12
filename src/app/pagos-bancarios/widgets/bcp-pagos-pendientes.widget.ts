import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BcpPagosService } from '../services/bcp-pagos.service';
import { PagoBancoPendiente } from '../models/bcp-archivo.model';
import {
  CategoriaPagoInfo,
  MOTIVOS_REVISION,
  TONO_PILL,
  fechaCorta,
  infoCategoria,
  montoSoles
} from '../models/categoria-pago';

/**
 * Pagos bancarios guardados que siguen pendientes de conciliar en la subcartera.
 */
@Component({
  selector: 'app-bcp-pagos-pendientes',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden mb-6" [attr.aria-labelledby]="idPrefix + '-titulo'">
      <div class="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 [id]="idPrefix + '-titulo'" class="text-lg font-semibold text-slate-800 dark:text-white">Pagos pendientes de conciliar</h2>
          <p class="text-xs text-slate-600 dark:text-slate-400">Pagos ya guardados de esta subcartera que esperan una corrección o el resto del monto</p>
        </div>
        <div class="flex items-center gap-2">
          <button
            type="button"
            (click)="cargar()"
            [disabled]="cargando() || reevaluando()"
            class="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700 dark:focus-visible:ring-offset-slate-800"
          >
            Actualizar
          </button>
          <button
            type="button"
            (click)="reevaluar()"
            [disabled]="cargando() || reevaluando() || pagos().length === 0"
            class="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-400 dark:focus-visible:ring-offset-slate-800"
          >
            {{ reevaluando() ? 'Reevaluando...' : 'Reevaluar pendientes' }}
          </button>
        </div>
      </div>

      <div role="status" aria-live="polite">
        @if (mensaje(); as texto) {
          <p class="border-b border-slate-200 bg-blue-50 px-4 py-2 text-sm text-blue-900 dark:border-slate-700 dark:bg-blue-950/30 dark:text-blue-200">{{ texto }}</p>
        }
      </div>
      @if (error(); as texto) {
        <p role="alert" class="border-b border-red-200 bg-red-50 px-4 py-2 text-sm text-red-800 dark:border-red-800 dark:bg-red-950/30 dark:text-red-200">{{ texto }}</p>
      }

      @if (cargando()) {
        <p class="px-4 py-8 text-center text-sm text-slate-600 dark:text-slate-400">Cargando pagos pendientes...</p>
      } @else if (pagos().length === 0) {
        <p class="px-4 py-8 text-center text-sm text-slate-600 dark:text-slate-400">No hay pagos pendientes en esta subcartera.</p>
      } @else {
        <div class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <caption class="sr-only">Pagos bancarios pendientes de conciliar</caption>
            <thead class="bg-slate-100 text-xs uppercase tracking-wide text-slate-700 dark:bg-slate-700/60 dark:text-slate-200">
              <tr>
                <th scope="col" class="px-3 py-2 text-left font-bold">Documento</th>
                <th scope="col" class="px-3 py-2 text-left font-bold">Fecha banco</th>
                <th scope="col" class="px-3 py-2 text-right font-bold">Monto banco</th>
                <th scope="col" class="px-3 py-2 text-left font-bold">Categoría</th>
                <th scope="col" class="px-3 py-2 text-left font-bold">Detalle</th>
                <th scope="col" class="px-3 py-2 text-left font-bold">Pago del asesor</th>
                <th scope="col" class="px-3 py-2 text-left font-bold">Acción</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
              @for (pago of pagos(); track pago.id) {
                <tr class="align-top">
                  <th scope="row" class="px-3 py-2 text-left font-semibold whitespace-nowrap">
                    <button
                      type="button"
                      (click)="documentoClick.emit(pago)"
                      [attr.aria-label]="'Ver resumen del cliente ' + pago.documento"
                      class="rounded text-blue-700 underline underline-offset-2 hover:text-blue-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-blue-300 dark:hover:text-blue-200"
                    >
                      {{ pago.documento }}
                    </button>
                  </th>
                  <td class="px-3 py-2 text-slate-700 dark:text-slate-300 whitespace-nowrap">{{ fecha(pago.fechaBanco) }}</td>
                  <td class="px-3 py-2 text-right font-semibold text-slate-900 dark:text-white whitespace-nowrap">{{ monto(pago.montoBanco) }}</td>
                  <td class="px-3 py-2 whitespace-nowrap">
                    <span class="inline-flex rounded-full px-2 py-1 text-[11px] font-bold leading-tight" [class]="pill(info(pago).tono)">{{ info(pago).label }}</span>
                  </td>
                  <td class="px-3 py-2 max-w-72 text-slate-700 dark:text-slate-300 leading-snug">{{ detalle(pago) }}</td>
                  <td class="px-3 py-2 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                    @if (pago.montoPagoAsesor !== null) {
                      {{ fecha(pago.fechaPagoAsesor) }} · {{ monto(pago.montoPagoAsesor) }}
                    } @else if (pago.montoEsperado !== null) {
                      Registrado {{ monto(pago.montoEsperado) }}
                    } @else {
                      Sin pago registrado
                    }
                  </td>
                  <td class="px-3 py-2 whitespace-nowrap">
                    @if (pago.categoria === 'REQUIERE_REVISION') {
                      <button
                        type="button"
                        (click)="resolver.emit(pago)"
                        [attr.aria-label]="'Resolver pago de ' + pago.documento + ' por ' + monto(pago.montoBanco)"
                        class="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-800"
                      >
                        Resolver
                      </button>
                    } @else {
                      <span class="text-xs text-slate-600 dark:text-slate-400">En espera del banco</span>
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </section>
  `
})
export class BcpPagosPendientesWidget implements OnChanges {
  @Input({ required: true }) tenantId = 0;
  @Input({ required: true }) carteraId = 0;
  @Input({ required: true }) subcarteraId = 0;
  /** Cambiar este valor vuelve a cargar la lista. */
  @Input() refresco = 0;
  @Input() idPrefix = 'pendientes';
  @Output() resolver = new EventEmitter<PagoBancoPendiente>();
  @Output() documentoClick = new EventEmitter<PagoBancoPendiente>();

  pagos = signal<PagoBancoPendiente[]>([]);
  cargando = signal(false);
  reevaluando = signal(false);
  mensaje = signal<string | null>(null);
  error = signal<string | null>(null);

  constructor(private bcpService: BcpPagosService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tenantId'] || changes['carteraId'] || changes['subcarteraId']) {
      this.mensaje.set(null);
    }
    this.cargar();
  }

  cargar(): void {
    if (!this.tieneContexto()) {
      this.pagos.set([]);
      return;
    }
    this.cargando.set(true);
    this.error.set(null);
    this.bcpService.listarPagosPendientes(this.contexto()).subscribe({
      next: pagos => {
        this.pagos.set(pagos || []);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los pagos pendientes.');
        this.cargando.set(false);
      }
    });
  }

  reevaluar(): void {
    if (!this.tieneContexto()) return;
    this.reevaluando.set(true);
    this.error.set(null);
    this.mensaje.set(null);
    this.bcpService.reevaluarPendientes(this.contexto()).subscribe({
      next: respuesta => {
        this.reevaluando.set(false);
        const resueltos = (respuesta.pagosEvaluados ?? 0) - (respuesta.pagosPendientes ?? 0);
        this.mensaje.set(`Reevaluación terminada: ${resueltos} pago(s) resuelto(s), ${respuesta.pagosPendientes ?? 0} siguen pendientes.`);
        this.cargar();
      },
      error: err => {
        this.reevaluando.set(false);
        this.error.set(err?.error?.mensaje || 'No se pudieron reevaluar los pagos pendientes.');
      }
    });
  }

  info(pago: PagoBancoPendiente): CategoriaPagoInfo {
    return infoCategoria(pago.categoria);
  }

  detalle(pago: PagoBancoPendiente): string {
    if (pago.categoria === 'PARCIAL_EN_ESPERA') {
      const espera = pago.fechaLimiteGrupo ? ` Se espera hasta el ${this.fecha(pago.fechaLimiteGrupo)}.` : '';
      return `Falta ${this.monto(pago.montoFaltante)} de ${this.monto(pago.montoEsperado)}.${espera}`;
    }
    // La corrección ya se hizo y el pago calzaría si se reevalúa.
    if (pago.categoriaSugerida && pago.categoriaSugerida !== 'REQUIERE_REVISION') {
      return `Ya puede conciliarse como "${infoCategoria(pago.categoriaSugerida).label}". Usa Reevaluar pendientes.`;
    }
    return (pago.motivo && MOTIVOS_REVISION[pago.motivo]?.problema) || 'No se encontró contra qué conciliar este pago.';
  }

  pill(tono: CategoriaPagoInfo['tono']): string {
    return TONO_PILL[tono];
  }

  fecha(value: unknown): string {
    return fechaCorta(value);
  }

  monto(value: number | null | undefined): string {
    return montoSoles(value);
  }

  private tieneContexto(): boolean {
    return Number(this.tenantId) > 0 && Number(this.carteraId) > 0 && Number(this.subcarteraId) > 0;
  }

  private contexto(): { tenantId: number; carteraId: number; subcarteraId: number } {
    return { tenantId: this.tenantId, carteraId: this.carteraId, subcarteraId: this.subcarteraId };
  }
}
