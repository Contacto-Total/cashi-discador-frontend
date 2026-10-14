import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { A11yModule } from '@angular/cdk/a11y';
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
  imports: [CommonModule, A11yModule],
  template: `
    <!-- relative: contiene el caption sr-only; sin esto se sale del scroll de .main-content y estira la página -->
    <section class="relative bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden mb-6" [attr.aria-labelledby]="idPrefix + '-titulo'">
      <div class="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 [id]="idPrefix + '-titulo'" class="text-lg font-semibold text-slate-800 dark:text-white">Pagos pendientes de conciliar</h2>
          <p class="text-xs text-slate-600 dark:text-slate-400">Pagos ya guardados de esta subcartera que esperan una corrección o el resto del monto</p>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <button
            type="button"
            (click)="alternarNoCorresponden()"
            [attr.aria-pressed]="verNoCorresponden()"
            [disabled]="cargando() || reevaluando()"
            class="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700 dark:focus-visible:ring-offset-slate-800"
          >
            {{ verNoCorresponden() ? 'Ver pendientes' : 'Ver no corresponden' }}
          </button>
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
            [disabled]="cargando() || reevaluando() || verNoCorresponden() || pagos().length === 0"
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

      @if (verNoCorresponden()) {
        @if (cargando()) {
          <p class="px-4 py-8 text-center text-sm text-slate-600 dark:text-slate-400">Cargando pagos que no corresponden...</p>
        } @else if (noCorresponden().length === 0) {
          <p class="px-4 py-8 text-center text-sm text-slate-600 dark:text-slate-400">No hay pagos marcados como no corresponde en esta subcartera.</p>
        } @else {
          <p class="border-b border-slate-200 px-4 py-2 text-xs text-slate-600 dark:border-slate-700 dark:text-slate-400">
            Pagos guardados que un supervisor sacó de pendientes porque no corresponden a la gestión de la empresa. El motivo queda en el histórico de correcciones.
          </p>
          <div class="overflow-x-auto">
            <table class="min-w-full text-sm">
              <caption class="sr-only">Pagos bancarios marcados como no corresponde</caption>
              <thead class="bg-slate-100 text-xs uppercase tracking-wide text-slate-700 dark:bg-slate-700/60 dark:text-slate-200">
                <tr>
                  <th scope="col" class="px-3 py-2 text-left font-bold">Documento</th>
                  <th scope="col" class="px-3 py-2 text-left font-bold">Fecha banco</th>
                  <th scope="col" class="px-3 py-2 text-right font-bold">Monto banco</th>
                  <th scope="col" class="px-3 py-2 text-left font-bold">Operación</th>
                  <th scope="col" class="px-3 py-2 text-left font-bold">Acción</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
                @for (pago of noCorresponden(); track pago.id) {
                  <tr>
                    <th scope="row" class="px-3 py-2 text-left font-semibold whitespace-nowrap text-slate-900 dark:text-white">{{ pago.documento }}</th>
                    <td class="px-3 py-2 text-slate-700 dark:text-slate-300 whitespace-nowrap">{{ fecha(pago.fechaBanco) }}</td>
                    <td class="px-3 py-2 text-right font-semibold text-slate-900 dark:text-white whitespace-nowrap">{{ monto(pago.montoBanco) }}</td>
                    <td class="px-3 py-2 text-slate-700 dark:text-slate-300 whitespace-nowrap">{{ pago.numeroOperacion || '-' }}</td>
                    <td class="px-3 py-2 whitespace-nowrap">
                      <button
                        type="button"
                        (click)="restaurar(pago)"
                        [disabled]="guardando()"
                        [attr.aria-label]="'Volver a pendientes el pago de ' + pago.documento + ' por ' + monto(pago.montoBanco)"
                        class="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700 dark:focus-visible:ring-offset-slate-800"
                      >
                        Volver a pendientes
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      } @else if (cargando()) {
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
                      <div class="flex items-center gap-2">
                        <button
                          type="button"
                          (click)="resolver.emit(pago)"
                          [attr.aria-label]="'Resolver pago de ' + pago.documento + ' por ' + monto(pago.montoBanco)"
                          class="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-800"
                        >
                          Resolver
                        </button>
                        <button
                          type="button"
                          (click)="abrirNoCorresponde(pago, $event)"
                          [attr.aria-label]="'Marcar que no corresponde el pago de ' + pago.documento + ' por ' + monto(pago.montoBanco)"
                          class="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700 dark:focus-visible:ring-offset-slate-800"
                        >
                          No corresponde
                        </button>
                      </div>
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

    @if (pagoNoCorresponde(); as pago) {
      <div class="fixed inset-0 z-[1200] flex items-center justify-center bg-slate-900/50 p-4" (click)="cerrarNoCorresponde()">
        <div
          role="dialog"
          aria-modal="true"
          [attr.aria-labelledby]="idPrefix + '-nc-titulo'"
          [attr.aria-describedby]="idPrefix + '-nc-desc'"
          cdkTrapFocus
          [cdkTrapFocusAutoCapture]="true"
          (click)="$event.stopPropagation()"
          (keydown.escape)="cerrarNoCorresponde()"
          class="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-xl dark:bg-slate-800"
        >
          <div class="border-b border-slate-200 px-5 py-4 dark:border-slate-700">
            <h3 [id]="idPrefix + '-nc-titulo'" class="text-base font-semibold text-slate-900 dark:text-white">Marcar que no corresponde</h3>
            <p [id]="idPrefix + '-nc-desc'" class="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Pago de {{ pago.documento }} del {{ fecha(pago.fechaBanco) }} por {{ monto(pago.montoBanco) }}.
              Se conserva, deja de estar pendiente y se puede volver a pendientes después.
            </p>
          </div>
          <form class="px-5 py-4" (submit)="confirmarNoCorresponde($event)">
            <label [for]="idPrefix + '-nc-motivo'" class="block text-sm font-semibold text-slate-800 dark:text-slate-200">
              Motivo <span class="font-normal text-slate-600 dark:text-slate-400">(obligatorio)</span>
            </label>
            <textarea
              [id]="idPrefix + '-nc-motivo'"
              rows="3"
              maxlength="500"
              required
              [value]="motivoNoCorresponde()"
              (input)="motivoNoCorresponde.set($any($event.target).value)"
              [attr.aria-invalid]="errorNoCorresponde() ? true : null"
              [attr.aria-describedby]="errorNoCorresponde() ? idPrefix + '-nc-error' : null"
              placeholder="Ej.: en agosto el cliente estaba con otra empresa"
              class="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
            ></textarea>
            @if (errorNoCorresponde(); as texto) {
              <p [id]="idPrefix + '-nc-error'" role="alert" class="mt-1 text-sm text-red-700 dark:text-red-300">{{ texto }}</p>
            }
            <div class="mt-4 flex justify-end gap-2">
              <button
                type="button"
                (click)="cerrarNoCorresponde()"
                class="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700 dark:focus-visible:ring-offset-slate-800"
              >
                Cancelar
              </button>
              <button
                type="submit"
                [disabled]="guardando()"
                class="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-400 dark:focus-visible:ring-offset-slate-800"
              >
                {{ guardando() ? 'Guardando...' : 'Marcar' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    }
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

  /** Muestra los pagos marcados como «no corresponde» en lugar de los pendientes. */
  verNoCorresponden = signal(false);
  noCorresponden = signal<PagoBancoPendiente[]>([]);
  pagoNoCorresponde = signal<PagoBancoPendiente | null>(null);
  motivoNoCorresponde = signal('');
  errorNoCorresponde = signal<string | null>(null);
  guardando = signal(false);
  /** Botón que abrió el diálogo: recibe el foco al cerrarlo. */
  private origenDialogo: HTMLElement | null = null;

  constructor(private bcpService: BcpPagosService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tenantId'] || changes['carteraId'] || changes['subcarteraId']) {
      this.mensaje.set(null);
      this.verNoCorresponden.set(false);
    }
    this.cargar();
  }

  cargar(): void {
    if (this.verNoCorresponden()) {
      this.cargarNoCorresponden();
      return;
    }
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

  alternarNoCorresponden(): void {
    this.verNoCorresponden.update(valor => !valor);
    this.mensaje.set(null);
    this.cargar();
  }

  private cargarNoCorresponden(): void {
    if (!this.tieneContexto()) {
      this.noCorresponden.set([]);
      return;
    }
    this.cargando.set(true);
    this.error.set(null);
    this.bcpService.listarNoCorresponden(this.contexto()).subscribe({
      next: pagos => {
        this.noCorresponden.set(pagos || []);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los pagos que no corresponden.');
        this.cargando.set(false);
      }
    });
  }

  abrirNoCorresponde(pago: PagoBancoPendiente, evento: Event): void {
    this.origenDialogo = evento.currentTarget as HTMLElement | null;
    this.motivoNoCorresponde.set('');
    this.errorNoCorresponde.set(null);
    this.pagoNoCorresponde.set(pago);
  }

  cerrarNoCorresponde(): void {
    if (this.guardando()) return;
    this.pagoNoCorresponde.set(null);
    this.origenDialogo?.focus();
    this.origenDialogo = null;
  }

  confirmarNoCorresponde(evento: Event): void {
    evento.preventDefault();
    const pago = this.pagoNoCorresponde();
    const motivo = this.motivoNoCorresponde().trim();
    if (!pago) return;
    if (!motivo) {
      this.errorNoCorresponde.set('Escribe el motivo.');
      return;
    }
    this.guardando.set(true);
    this.errorNoCorresponde.set(null);
    this.bcpService.marcarNoCorresponde(pago.id, motivo, this.contexto()).subscribe({
      next: () => {
        this.guardando.set(false);
        this.pagoNoCorresponde.set(null);
        // La fila desaparece de la lista: el foco no puede volver a su botón.
        this.origenDialogo = null;
        this.mensaje.set(`El pago de ${pago.documento} por ${this.monto(pago.montoBanco)} ya no está pendiente.`);
        this.cargar();
      },
      error: err => {
        this.guardando.set(false);
        this.errorNoCorresponde.set(err?.error?.mensaje || 'No se pudo marcar el pago.');
      }
    });
  }

  restaurar(pago: PagoBancoPendiente): void {
    this.guardando.set(true);
    this.error.set(null);
    this.bcpService.restaurarPendiente(pago.id, this.contexto()).subscribe({
      next: () => {
        this.guardando.set(false);
        this.mensaje.set(`El pago de ${pago.documento} por ${this.monto(pago.montoBanco)} volvió a pendientes.`);
        this.cargar();
      },
      error: err => {
        this.guardando.set(false);
        this.error.set(err?.error?.mensaje || 'No se pudo devolver el pago a pendientes.');
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
