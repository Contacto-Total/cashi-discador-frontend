import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { A11yModule } from '@angular/cdk/a11y';
import { ConsolidadoBancoService } from '../services/consolidado-banco.service';
import {
  ConsolidadoContexto,
  ConsolidadoFila,
  ORDEN_RESULTADOS,
  RESULTADOS_CUADRE,
  ResultadoCuadre
} from '../models/consolidado-banco.model';
import { TONO_PILL, montoSoles } from '../models/categoria-pago';
import { coincideDocumento, cortarPagina } from '../models/paginacion';
import { BuscadorDocumentoWidget } from './buscador-documento.widget';
import { TablaPaginacionWidget } from './tabla-paginacion.widget';

type FiltroResultado = ResultadoCuadre | 'CON_DIFERENCIA' | 'TODOS';

/**
 * Cuadre por cliente del consolidado mensual del banco, con la regularización de faltantes.
 */
@Component({
  selector: 'app-consolidado-cuadre',
  standalone: true,
  imports: [CommonModule, A11yModule, BuscadorDocumentoWidget, TablaPaginacionWidget],
  template: `
    <!-- relative: contiene el caption sr-only; sin esto se sale del scroll de .main-content y estira la página -->
    <section class="relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800" aria-labelledby="cuadre-titulo">
      <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-4 py-2 dark:border-slate-700">
        <div>
          <h3 id="cuadre-titulo" class="text-sm font-semibold text-slate-800 dark:text-white">Cuadre por cliente</h3>
          <p class="text-xs text-slate-600 dark:text-slate-400">Banco: el consolidado. Recibido: archivos diarios más lo regularizado.</p>
        </div>
        <app-buscador-documento inputId="cuadre-buscar" [valor]="busqueda()" (valorChange)="buscar($event)"></app-buscador-documento>
      </div>

      <div class="flex flex-wrap gap-1.5 border-b border-slate-200 px-4 py-2 dark:border-slate-700" role="group" aria-label="Filtrar por resultado">
        @for (opcion of opcionesFiltro(); track opcion.valor) {
          <button
            type="button"
            (click)="filtrar(opcion.valor)"
            [attr.aria-pressed]="filtro() === opcion.valor"
            [class]="filtro() === opcion.valor
              ? 'rounded-full border border-blue-600 bg-blue-600 px-2.5 py-0.5 text-xs font-bold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-800'
              : 'rounded-full border border-slate-300 px-2.5 py-0.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700 dark:focus-visible:ring-offset-slate-800'"
          >
            {{ opcion.label }} ({{ opcion.total }})
          </button>
        }
      </div>

      @if (filtro() !== 'CON_DIFERENCIA' && filtro() !== 'TODOS') {
        <p class="border-b border-slate-200 px-4 py-1.5 text-xs text-slate-600 dark:border-slate-700 dark:text-slate-400">{{ infoResultado($any(filtro())).descripcion }}</p>
      }

      @if (filtradas().length === 0) {
        <p class="px-4 py-6 text-center text-sm text-slate-600 dark:text-slate-400">No hay clientes con ese filtro.</p>
      } @else {
        <div class="overflow-x-auto">
          <table class="min-w-full text-sm tabular-nums">
            <caption class="sr-only">Cuadre por cliente entre el consolidado del banco y los pagos del sistema</caption>
            <thead class="bg-slate-100 text-[11px] uppercase tracking-wide text-slate-700 dark:bg-slate-700/60 dark:text-slate-200">
              <tr>
                <th scope="col" class="px-3 py-1.5 text-left font-bold">Documento</th>
                <th scope="col" class="px-3 py-1.5 text-right font-bold">Banco</th>
                <th scope="col" class="px-3 py-1.5 text-right font-bold">Recibido</th>
                <th scope="col" class="px-3 py-1.5 text-right font-bold">Diferencia</th>
                <th scope="col" class="px-3 py-1.5 text-right font-bold">Conciliado</th>
                <th scope="col" class="px-3 py-1.5 text-left font-bold">Resultado</th>
                <th scope="col" class="px-3 py-1.5 text-right font-bold"><span class="sr-only">Acción</span></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
              @for (fila of filasPagina(); track fila.documento) {
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                  <th scope="row" class="whitespace-nowrap px-3 py-1 text-left font-semibold">
                    <button
                      type="button"
                      (click)="documentoClick.emit(fila.documento)"
                      [attr.aria-label]="'Ver resumen del cliente ' + fila.documento"
                      class="rounded text-blue-700 underline underline-offset-2 hover:text-blue-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-blue-300 dark:hover:text-blue-200"
                    >
                      {{ fila.documento }}
                    </button>
                  </th>
                  <td class="whitespace-nowrap px-3 py-1 text-right font-semibold text-slate-900 dark:text-white">{{ monto(fila.montoConsolidado) }}</td>
                  <td class="whitespace-nowrap px-3 py-1 text-right text-slate-800 dark:text-slate-200">
                    {{ monto(fila.montoRecibido) }}
                    <span class="text-[11px] text-slate-600 dark:text-slate-400">· {{ detalleRecibido(fila) }}</span>
                  </td>
                  <td class="whitespace-nowrap px-3 py-1 text-right font-bold" [class]="claseDiferencia(fila)">{{ diferenciaConSigno(fila) }}</td>
                  <td class="whitespace-nowrap px-3 py-1 text-right text-slate-800 dark:text-slate-200">
                    {{ monto(fila.montoConciliado) }}
                    @if (fila.montoSinConciliar > 0) {
                      <span class="block text-[11px] leading-tight text-amber-800 dark:text-amber-300">Sin conciliar {{ monto(fila.montoSinConciliar) }}</span>
                    }
                  </td>
                  <td class="px-3 py-1">
                    <div class="flex flex-wrap items-center gap-1">
                      <span class="inline-flex whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-bold leading-tight" [class]="pill(fila.resultado)">{{ infoResultado(fila.resultado).label }}</span>
                      @for (alerta of alertas(fila); track alerta) {
                        <span class="whitespace-nowrap rounded border border-red-200 px-1.5 text-[11px] leading-tight text-red-800 dark:border-red-800 dark:text-red-300">{{ alerta }}</span>
                      }
                    </div>
                  </td>
                  <td class="whitespace-nowrap px-3 py-1 text-right">
                    @if (fila.resultado === 'FALTA_EN_SISTEMA') {
                      <button
                        type="button"
                        (click)="abrirRegularizar(fila, $event)"
                        [attr.aria-label]="'Regularizar ' + monto(fila.montoRegularizable) + ' de ' + fila.documento"
                        class="rounded-md bg-blue-600 px-2 py-0.5 text-xs font-bold text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-800"
                      >
                        Regularizar
                      </button>
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <app-tabla-paginacion
          [total]="filtradas().length"
          [pagina]="pagina()"
          etiqueta="clientes del consolidado"
          (paginaChange)="pagina.set($event)"
        ></app-tabla-paginacion>
      }
    </section>

    @if (filaRegularizar(); as fila) {
      <div class="fixed inset-0 z-[1200] flex items-center justify-center bg-slate-900/50 p-4" (click)="cerrarRegularizar()">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="regularizar-titulo"
          aria-describedby="regularizar-desc"
          cdkTrapFocus
          [cdkTrapFocusAutoCapture]="true"
          (click)="$event.stopPropagation()"
          (keydown.escape)="cerrarRegularizar()"
          class="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-xl dark:bg-slate-800"
        >
          <div class="border-b border-slate-200 px-5 py-4 dark:border-slate-700">
            <h3 id="regularizar-titulo" class="text-base font-semibold text-slate-900 dark:text-white">Regularizar pago de {{ fila.documento }}</h3>
            <p id="regularizar-desc" class="mt-1 text-sm text-slate-600 dark:text-slate-400">
              El banco reporta {{ monto(fila.montoConsolidado) }} y en el sistema se recibió {{ monto(fila.montoRecibido) }}.
              Se registra un pago bancario por el faltante y se evalúa como cualquier pago de archivo diario:
              si no calza con un pago del cliente, queda en pagos pendientes para resolverlo.
            </p>
          </div>
          <form class="space-y-3 px-5 py-4" (submit)="confirmarRegularizar($event)">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label for="regularizar-monto" class="block text-sm font-semibold text-slate-800 dark:text-slate-200">Monto</label>
                <input
                  id="regularizar-monto"
                  type="number"
                  step="0.01"
                  min="0.01"
                  [max]="fila.montoRegularizable"
                  required
                  [value]="montoRegularizar()"
                  (input)="montoRegularizar.set($any($event.target).value)"
                  class="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label for="regularizar-fecha" class="block text-sm font-semibold text-slate-800 dark:text-slate-200">Fecha de pago</label>
                <input
                  id="regularizar-fecha"
                  type="date"
                  [min]="limitesFecha().min"
                  [max]="limitesFecha().max"
                  required
                  [value]="fechaRegularizar()"
                  (input)="fechaRegularizar.set($any($event.target).value)"
                  class="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                />
              </div>
            </div>
            <p class="text-xs text-slate-600 dark:text-slate-400">Si conoces la fecha real del pago, úsala: así un archivo diario que llegue después con el mismo pago se detecta como duplicado.</p>
            <div>
              <label for="regularizar-observacion" class="block text-sm font-semibold text-slate-800 dark:text-slate-200">
                Observación <span class="font-normal text-slate-600 dark:text-slate-400">(obligatoria)</span>
              </label>
              <textarea
                id="regularizar-observacion"
                rows="3"
                maxlength="200"
                required
                [value]="observacionRegularizar()"
                (input)="observacionRegularizar.set($any($event.target).value)"
                [attr.aria-invalid]="errorRegularizar() ? true : null"
                [attr.aria-describedby]="errorRegularizar() ? 'regularizar-error' : null"
                placeholder="Ej.: pago del 30/09 que no llegó en el archivo diario; el cliente salió de la cartera"
                class="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
              ></textarea>
            </div>
            @if (errorRegularizar(); as texto) {
              <p id="regularizar-error" role="alert" class="text-sm text-red-700 dark:text-red-300">{{ texto }}</p>
            }
            <div class="flex justify-end gap-2 pt-1">
              <button
                type="button"
                (click)="cerrarRegularizar()"
                class="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700 dark:focus-visible:ring-offset-slate-800"
              >
                Cancelar
              </button>
              <button
                type="submit"
                [disabled]="guardando()"
                class="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-400 dark:focus-visible:ring-offset-slate-800"
              >
                {{ guardando() ? 'Registrando...' : 'Regularizar' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    }
  `
})
export class ConsolidadoCuadreWidget implements OnChanges {
  @Input({ required: true }) filas: ConsolidadoFila[] = [];
  @Input({ required: true }) contexto!: ConsolidadoContexto;
  @Output() documentoClick = new EventEmitter<string>();
  /** Se emite con el mensaje del backend después de regularizar un cliente. */
  @Output() regularizado = new EventEmitter<string>();

  private readonly filasSig = signal<ConsolidadoFila[]>([]);
  private readonly periodoSig = signal('');
  filtro = signal<FiltroResultado>('CON_DIFERENCIA');
  busqueda = signal('');
  pagina = signal(1);

  filaRegularizar = signal<ConsolidadoFila | null>(null);
  montoRegularizar = signal('');
  fechaRegularizar = signal('');
  observacionRegularizar = signal('');
  errorRegularizar = signal<string | null>(null);
  guardando = signal(false);
  /** Botón que abrió el diálogo: recibe el foco al cerrarlo. */
  private origenDialogo: HTMLElement | null = null;

  readonly opcionesFiltro = computed(() => {
    const filas = this.filasSig();
    const contar = (r: ResultadoCuadre) => filas.filter(f => f.resultado === r).length;
    return [
      { valor: 'CON_DIFERENCIA' as FiltroResultado, label: 'Con diferencias', total: filas.filter(f => f.resultado !== 'CUADRA').length },
      ...ORDEN_RESULTADOS.map(r => ({ valor: r as FiltroResultado, label: RESULTADOS_CUADRE[r].label, total: contar(r) })),
      { valor: 'TODOS' as FiltroResultado, label: 'Todos', total: filas.length }
    ];
  });

  readonly filtradas = computed(() => {
    const filtro = this.filtro();
    const texto = this.busqueda();
    return this.filasSig().filter(f =>
      (filtro === 'TODOS' || (filtro === 'CON_DIFERENCIA' ? f.resultado !== 'CUADRA' : f.resultado === filtro))
      && coincideDocumento(f.documento, texto));
  });

  readonly filasPagina = computed(() => cortarPagina(this.filtradas(), this.pagina()));

  /** La fecha regularizada debe caer en el periodo y no ser futura. */
  readonly limitesFecha = computed(() => {
    const [anio, mes] = this.periodoSig().split('-').map(Number);
    const ultimoDia = new Date(anio, mes, 0).getDate();
    const min = `${anio}-${String(mes).padStart(2, '0')}-01`;
    const finPeriodo = `${anio}-${String(mes).padStart(2, '0')}-${String(ultimoDia).padStart(2, '0')}`;
    const hoy = this.hoyIso();
    return { min, max: finPeriodo < hoy ? finPeriodo : hoy };
  });

  constructor(private consolidadoService: ConsolidadoBancoService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filas']) {
      this.filasSig.set(this.filas || []);
    }
    if (changes['contexto']) {
      this.periodoSig.set(this.contexto?.periodo || '');
    }
    if (changes['contexto'] && !changes['contexto'].firstChange) {
      this.filtro.set('CON_DIFERENCIA');
      this.busqueda.set('');
      this.pagina.set(1);
    }
  }

  filtrar(valor: FiltroResultado): void {
    this.filtro.set(valor);
    this.pagina.set(1);
  }

  buscar(texto: string): void {
    this.busqueda.set(texto);
    this.pagina.set(1);
  }

  abrirRegularizar(fila: ConsolidadoFila, evento: Event): void {
    this.origenDialogo = evento.currentTarget as HTMLElement | null;
    this.montoRegularizar.set(Number(fila.montoRegularizable).toFixed(2));
    this.fechaRegularizar.set(this.limitesFecha().max);
    this.observacionRegularizar.set('');
    this.errorRegularizar.set(null);
    this.filaRegularizar.set(fila);
  }

  cerrarRegularizar(): void {
    if (this.guardando()) return;
    this.filaRegularizar.set(null);
    this.origenDialogo?.focus();
    this.origenDialogo = null;
  }

  confirmarRegularizar(evento: Event): void {
    evento.preventDefault();
    const fila = this.filaRegularizar();
    if (!fila) return;

    const monto = Number(this.montoRegularizar());
    const fecha = this.fechaRegularizar();
    const observacion = this.observacionRegularizar().trim();
    const limites = this.limitesFecha();

    if (!monto || monto <= 0) {
      this.errorRegularizar.set('Ingresa un monto mayor a 0.');
      return;
    }
    if (monto > Number(fila.montoRegularizable) + 0.5) {
      this.errorRegularizar.set(`El monto no puede superar el faltante (${this.monto(fila.montoRegularizable)}).`);
      return;
    }
    if (!fecha || fecha < limites.min || fecha > limites.max) {
      this.errorRegularizar.set('La fecha debe estar dentro del periodo y no puede ser futura.');
      return;
    }
    if (!observacion) {
      this.errorRegularizar.set('Escribe la observación: queda en el histórico de correcciones.');
      return;
    }

    this.guardando.set(true);
    this.errorRegularizar.set(null);
    this.consolidadoService.regularizar(fila.documento, this.contexto, { monto, fechaPago: fecha, observacion }).subscribe({
      next: respuesta => {
        this.guardando.set(false);
        if (!respuesta.exitoso) {
          this.errorRegularizar.set(respuesta.mensaje);
          return;
        }
        this.cerrarRegularizar();
        this.regularizado.emit(`${fila.documento}: ${respuesta.mensaje}`);
      },
      error: err => {
        this.guardando.set(false);
        this.errorRegularizar.set(err?.error?.mensaje || 'No se pudo regularizar el pago.');
      }
    });
  }

  infoResultado(resultado: ResultadoCuadre) {
    return RESULTADOS_CUADRE[resultado];
  }

  pill(resultado: ResultadoCuadre): string {
    return TONO_PILL[RESULTADOS_CUADRE[resultado].tono];
  }

  monto(valor: number | string | null | undefined): string {
    return montoSoles(valor);
  }

  diferenciaConSigno(fila: ConsolidadoFila): string {
    const valor = Number(fila.diferencia);
    if (Math.abs(valor) < 0.005) return montoSoles(0);
    return `${valor > 0 ? '+' : '-'} ${montoSoles(Math.abs(valor))}`;
  }

  /** Cantidad de pagos recibidos y, si hay, lo regularizado: va en una sola línea junto al monto. */
  detalleRecibido(fila: ConsolidadoFila): string {
    const pagos = `${fila.pagosRecibidos} pago${fila.pagosRecibidos === 1 ? '' : 's'}`;
    return fila.montoRegularizado > 0 ? `${pagos}, reg. ${montoSoles(fila.montoRegularizado)}` : pagos;
  }

  /** Avisos del cliente que se muestran junto al resultado. */
  alertas(fila: ConsolidadoFila): string[] {
    const alertas: string[] = [];
    if (fila.posiblesDuplicados > 0) alertas.push(`${fila.posiblesDuplicados} posible(s) duplicado(s)`);
    if (fila.pagosAplicadosDeMas > 0) alertas.push(`${fila.pagosAplicadosDeMas} aplicado(s) de más`);
    if (fila.resultado === 'SOBRA_EN_SISTEMA' && fila.pagosFinDeMes > 0) alertas.push(`${fila.pagosFinDeMes} de fin de mes`);
    return alertas;
  }

  claseDiferencia(fila: ConsolidadoFila): string {
    if (fila.resultado === 'FALTA_EN_SISTEMA' || fila.resultado === 'SOBRA_EN_SISTEMA') {
      return 'text-red-800 dark:text-red-300';
    }
    return 'text-slate-800 dark:text-slate-200';
  }

  private hoyIso(): string {
    const hoy = new Date();
    return `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;
  }
}
