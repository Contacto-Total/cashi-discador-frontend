import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject, signal } from '@angular/core';
import { A11yModule } from '@angular/cdk/a11y';
import {
  ContextoAjuste,
  DestinoDesconciliacion,
  FichaPagoBanco,
  ResultadoAjuste,
  VistaPreviaAjuste
} from '../models/ajuste-conciliacion.model';
import { TONO_PILL, fechaCorta, infoCategoria, montoSoles } from '../models/categoria-pago';
import { AjusteConciliacionService } from '../services/ajuste-conciliacion.service';

type Paso = 'ficha' | 'desconciliar' | 'eliminar-voluntario' | 'hecho';

const DESTINOS: { valor: DestinoDesconciliacion; titulo: string; detalle: string }[] = [
  {
    valor: 'PENDIENTE_RETENIDO',
    titulo: 'Dejarlo pendiente, retenido',
    detalle: 'Vuelve a pendientes y no se enlaza solo: se vuelve a evaluar cuando se corrija el cliente.'
  },
  {
    valor: 'NO_CORRESPONDE',
    titulo: 'No corresponde',
    detalle: 'El pago no es de la gestión de la empresa. Deja de contar en el cuadre; se puede volver a pendientes.'
  },
  {
    valor: 'DUPLICADO',
    titulo: 'Duplicado',
    detalle: 'El banco envió el mismo pago dos veces. Queda como No corresponde, con el motivo marcado como duplicado.'
  }
];

/**
 * Ajustes finos de un pago (solo administradores).
 * - Con pagoBancoId: ficha del pago bancario y, desde ella, desconciliar.
 * - Con pagoVoluntarioId: eliminar un pago voluntario del sistema que quedó sin pago del banco.
 * Cada acción muestra primero lo que va a cambiar (vista previa) y pide motivo y confirmación.
 */
@Component({
  selector: 'app-ajuste-pago-banco-dialog',
  standalone: true,
  imports: [A11yModule],
  template: `
    @if (abierto()) {
      <div class="fixed inset-0 z-[1200] flex items-center justify-center bg-slate-900/50 p-4" (click)="cerrar()">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="ajuste-pago-titulo"
          cdkTrapFocus
          [cdkTrapFocusAutoCapture]="true"
          (click)="$event.stopPropagation()"
          (keydown.escape)="cerrar()"
          class="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl bg-white shadow-xl dark:bg-slate-800"
        >
          <div class="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 dark:border-slate-700">
            <div>
              <p class="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Ajuste fino · solo administradores</p>
              <h3 id="ajuste-pago-titulo" class="mt-0.5 text-base font-semibold text-slate-900 dark:text-white">{{ titulo() }}</h3>
            </div>
            <button type="button" (click)="cerrar()" class="rounded-lg px-2 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-slate-300 dark:hover:bg-slate-700">Cerrar</button>
          </div>

          <div class="overflow-y-auto px-5 py-4 text-sm text-slate-700 dark:text-slate-200">
            @if (cargando()) {
              <p role="status" class="py-6 text-center text-slate-500 dark:text-slate-400">Cargando...</p>
            } @else if (error(); as texto) {
              <p role="alert" class="rounded-lg border border-red-200 bg-red-50 p-3 font-medium text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300">{{ texto }}</p>
            }

            @if (paso() === 'hecho' && resultado(); as r) {
              <div role="status" class="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200">
                <p class="font-semibold">{{ r.mensaje }}</p>
                @if (r.pagoCumplido !== null && r.pagoCumplido !== undefined) {
                  <p class="mt-1">Carta de no adeudo: {{ r.pagoCumplido ? 'disponible' : 'no disponible' }}.</p>
                }
                @if (r.avisoPagoCumplido) {
                  <p class="mt-1 text-amber-800 dark:text-amber-200">{{ r.avisoPagoCumplido }}</p>
                }
              </div>
            }

            <!-- Ficha del pago bancario -->
            @if ((paso() === 'ficha' || paso() === 'hecho') && ficha(); as f) {
              <section [class.mt-4]="paso() === 'hecho'" aria-label="Pago del banco">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="font-mono text-base font-bold text-slate-900 dark:text-white">{{ f.documento }}</span>
                  <span class="rounded-full px-2 py-0.5 text-xs font-semibold" [class]="pillCategoria(f.categoria)">{{ etiquetaCategoria(f.categoria) }}</span>
                  @if (f.revisionManual) {
                    <span class="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-900 dark:bg-amber-900/40 dark:text-amber-200">Retenido</span>
                  }
                </div>
                <dl class="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3">
                  <div><dt class="text-xs text-slate-500 dark:text-slate-400">Fecha banco</dt><dd class="font-semibold">{{ fecha(f.fechaBanco) }}</dd></div>
                  <div><dt class="text-xs text-slate-500 dark:text-slate-400">Monto</dt><dd class="font-semibold">{{ monto(f.montoBanco) }}</dd></div>
                  <div><dt class="text-xs text-slate-500 dark:text-slate-400">Pago bancario</dt><dd class="font-mono">{{ f.id }}</dd></div>
                  <div><dt class="text-xs text-slate-500 dark:text-slate-400">Cuenta en</dt><dd>{{ periodo(f.periodoBanco) }} <span class="text-xs text-slate-500 dark:text-slate-400">({{ origenPeriodo(f.periodoOrigen) }})</span></dd></div>
                  <div><dt class="text-xs text-slate-500 dark:text-slate-400">Banco / operación</dt><dd>{{ f.banco || '-' }} · {{ f.numeroOperacion || '-' }}</dd></div>
                  <div><dt class="text-xs text-slate-500 dark:text-slate-400">Procesado</dt><dd>{{ f.procesado ? 'Sí' : 'No' }}</dd></div>
                  <div class="col-span-2 sm:col-span-3">
                    <dt class="text-xs text-slate-500 dark:text-slate-400">Carga</dt>
                    <dd>
                      @if (f.archivoCargaId) {
                        #{{ f.archivoCargaId }} · {{ f.nombreArchivo || 'sin nombre' }} · {{ fechaHora(f.fechaCarga) }}{{ f.usuarioCarga ? ' · ' + f.usuarioCarga : '' }}
                      } @else {
                        Registro manual
                      }
                    </dd>
                  </div>
                  @if (f.grupoId) {
                    <div class="col-span-2 sm:col-span-3"><dt class="text-xs text-slate-500 dark:text-slate-400">Pago parcial</dt><dd>Grupo {{ f.grupoId }}</dd></div>
                  }
                </dl>
              </section>

              <section class="mt-5" aria-labelledby="ajuste-conciliaciones">
                <h4 id="ajuste-conciliaciones" class="text-sm font-semibold text-slate-900 dark:text-white">Conciliaciones</h4>
                @if (f.conciliaciones.length === 0) {
                  <p class="mt-1 text-slate-500 dark:text-slate-400">Sin conciliaciones.</p>
                } @else {
                  <ul class="mt-2 space-y-2">
                    @for (c of f.conciliaciones; track c.id) {
                      <li class="rounded-lg border border-slate-200 p-2.5 dark:border-slate-700">
                        <p class="flex flex-wrap items-center gap-2">
                          <span class="rounded-full px-2 py-0.5 text-xs font-semibold" [class]="c.estado === 'ACTIVA' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200' : 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-100'">{{ c.estado === 'ACTIVA' ? 'Activa' : 'Revertida' }}</span>
                          <span>#{{ c.id }} · {{ monto(c.montoAplicado) }} · pago cuota {{ c.pagoCuotaId ?? '-' }}</span>
                        </p>
                        <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">Aprobada {{ fechaHora(c.fechaAprobacion) }}{{ c.aprobadoPor ? ' por ' + c.aprobadoPor : '' }}</p>
                        @if (c.fechaReversion) {
                          <p class="mt-0.5 text-xs text-slate-600 dark:text-slate-300">Revertida {{ fechaHora(c.fechaReversion) }}{{ c.revertidoPor ? ' por ' + c.revertidoPor : '' }}: {{ c.motivoReversion }}</p>
                        }
                      </li>
                    }
                  </ul>
                }
              </section>

              <section class="mt-5" aria-labelledby="ajuste-pagos-asesor">
                <h4 id="ajuste-pagos-asesor" class="text-sm font-semibold text-slate-900 dark:text-white">Pagos del asesor enlazados</h4>
                @if (f.pagosAsesor.length === 0) {
                  <p class="mt-1 text-slate-500 dark:text-slate-400">Ninguno.</p>
                } @else {
                  <ul class="mt-2 space-y-2">
                    @for (p of f.pagosAsesor; track p.pagoCuotaId) {
                      <li class="rounded-lg border border-slate-200 p-2.5 dark:border-slate-700">
                        <p class="flex flex-wrap items-center gap-2">
                          <span class="font-semibold">{{ fecha(p.fechaPago) }} · {{ monto(p.montoPago) }}</span>
                          @if (p.pagoVoluntarioSistema) {
                            <span class="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-semibold text-slate-800 dark:bg-slate-700 dark:text-slate-100">Pago voluntario del sistema</span>
                          }
                          <span class="text-xs" [class]="p.verificadoBanco ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-500 dark:text-slate-400'">{{ p.verificadoBanco ? 'Verificado' : 'No verificado' }}</span>
                        </p>
                        <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          Gestión {{ p.gestionId }} · cuota {{ p.numeroCuota ?? '-' }} · pago cuota {{ p.pagoCuotaId }} · {{ p.agente || 'sin agente' }} · {{ p.rutaGestion || '' }}
                        </p>
                      </li>
                    }
                  </ul>
                }
              </section>

              @if (f.historico.length > 0) {
                <details class="mt-5">
                  <summary class="cursor-pointer text-sm font-semibold text-slate-900 dark:text-white">Histórico de correcciones ({{ f.historico.length }})</summary>
                  <ul class="mt-2 space-y-2">
                    @for (h of f.historico; track h.id) {
                      <li class="rounded-lg bg-slate-50 p-2.5 text-xs dark:bg-slate-900/60">
                        <p class="font-semibold text-slate-800 dark:text-slate-100">{{ h.tipoCambio }} · {{ fechaHora(h.fecha) }}{{ h.usuario ? ' · ' + h.usuario : '' }}</p>
                        @if (h.observacion) {
                          <p class="mt-0.5 text-slate-700 dark:text-slate-200">{{ h.observacion }}</p>
                        }
                        @if (h.detalleNuevo) {
                          <p class="mt-0.5 text-slate-500 dark:text-slate-400">{{ h.detalleNuevo }}</p>
                        }
                      </li>
                    }
                  </ul>
                </details>
              }

              @if (paso() === 'ficha') {
                <div class="mt-5 rounded-lg border border-slate-200 p-3 dark:border-slate-700">
                  @if (f.puedeDesconciliar) {
                    <p class="text-slate-600 dark:text-slate-300">Deshace la conciliación de este pago. Antes de aplicar se muestra todo lo que va a cambiar.</p>
                    <button type="button" (click)="irADesconciliar()" class="mt-2 rounded-lg border border-red-600 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:border-red-400 dark:text-red-300 dark:hover:bg-red-950/30">Desconciliar...</button>
                  } @else {
                    <p class="text-slate-600 dark:text-slate-300"><span class="font-semibold">No se puede desconciliar:</span> {{ f.motivoNoDesconciliar }}</p>
                  }
                </div>
              }
            }

            <!-- Vista previa de la acción -->
            @if ((paso() === 'desconciliar' || paso() === 'eliminar-voluntario') && vista(); as v) {
              <section aria-labelledby="ajuste-cambios">
                <h4 id="ajuste-cambios" class="text-sm font-semibold text-slate-900 dark:text-white">Qué va a cambiar</h4>
                @if (v.bcpPagoDetalleId) {
                  <p class="mt-1">Pago del banco {{ v.bcpPagoDetalleId }} de {{ v.documento }}: {{ fecha(v.fechaBanco) }} · {{ monto(v.montoBanco) }} · {{ etiquetaCategoria(v.categoriaActual) }}.</p>
                } @else {
                  <p class="mt-1">Cliente {{ v.documento }}.</p>
                }
                <ul class="mt-2 list-disc space-y-1 pl-5">
                  @if (v.conciliacionesARevertir.length > 0) {
                    <li>{{ v.conciliacionesARevertir.length }} {{ v.conciliacionesARevertir.length === 1 ? 'conciliación pasa' : 'conciliaciones pasan' }} a Revertida (se conservan con tu motivo).</li>
                  }
                  @for (p of v.pagosADesverificar; track p.pagoCuotaId) {
                    <li>El pago del asesor del {{ fecha(p.fechaPago) }} por {{ monto(p.montoPago) }} ({{ p.agente || 'sin agente' }}, gestión {{ p.gestionId }}) queda sin verificar. El registro del asesor no se borra.</li>
                  }
                  @for (p of v.pagosVoluntariosAEliminar; track p.pagoCuotaId) {
                    <li class="text-red-800 dark:text-red-300">Se elimina el pago voluntario del sistema del {{ fecha(p.fechaPago) }} por {{ monto(p.montoPago) }}: gestión {{ p.gestionId }}, cuota {{ p.cuotaId }}, pago cuota {{ p.pagoCuotaId }}{{ p.gestionCancelacionId ? ' y la gestión CANCELACION ' + p.gestionCancelacionId : '' }}.</li>
                  }
                  @if (v.bcpPagoDetalleId && v.periodoNuevo !== v.periodoActual) {
                    <li>El pago pasa a contar en {{ periodo(v.periodoNuevo) }} (estaba en {{ periodo(v.periodoActual) }}).</li>
                  }
                </ul>

                @if (v.avisos.length > 0) {
                  <div class="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-900 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
                    @for (aviso of v.avisos; track aviso) {
                      <p>{{ aviso }}</p>
                    }
                  </div>
                }

                @if (v.bloqueos.length > 0) {
                  <div role="alert" class="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-red-800 dark:border-red-800 dark:bg-red-950/30 dark:text-red-200">
                    <p class="font-semibold">No se puede aplicar:</p>
                    @for (bloqueo of v.bloqueos; track bloqueo) {
                      <p class="mt-0.5">{{ bloqueo }}</p>
                    }
                  </div>
                } @else {
                  <form class="mt-4 space-y-4" (submit)="confirmar($event)">
                    @if (paso() === 'desconciliar') {
                      <fieldset>
                        <legend class="text-sm font-semibold text-slate-900 dark:text-white">Qué pasa con el pago del banco</legend>
                        <div class="mt-2 space-y-2">
                          @for (d of destinos; track d.valor) {
                            <label class="flex cursor-pointer items-start gap-2 rounded-lg border p-2.5" [class]="destino() === d.valor ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-950/30' : 'border-slate-200 dark:border-slate-700'">
                              <input type="radio" name="ajuste-destino" [value]="d.valor" [checked]="destino() === d.valor" (change)="destino.set(d.valor)" class="mt-0.5 h-4 w-4 text-blue-600 focus:ring-blue-500" />
                              <span>
                                <span class="block font-semibold text-slate-900 dark:text-white">{{ d.titulo }}</span>
                                <span class="block text-xs text-slate-600 dark:text-slate-400">{{ d.detalle }}</span>
                              </span>
                            </label>
                          }
                        </div>
                      </fieldset>
                    }

                    <div>
                      <label for="ajuste-motivo" class="block text-sm font-semibold text-slate-900 dark:text-white">
                        Motivo <span class="font-normal text-slate-600 dark:text-slate-400">(obligatorio, mínimo 10 caracteres; queda en el histórico)</span>
                      </label>
                      <textarea
                        id="ajuste-motivo"
                        rows="3"
                        maxlength="500"
                        required
                        [value]="motivo()"
                        (input)="motivo.set($any($event.target).value)"
                        placeholder="Ej.: correo del banco del 23/10, el pago es de la otra subcartera"
                        class="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                      ></textarea>
                    </div>

                    <label class="flex items-start gap-2 text-sm text-slate-800 dark:text-slate-200">
                      <input type="checkbox" [checked]="confirmado()" (change)="confirmado.set($any($event.target).checked)" class="mt-0.5 h-4 w-4 rounded border-slate-400 text-red-600 focus:ring-red-500" />
                      <span>Revisé lo que va a cambiar. Esta acción no se deshace con un botón.</span>
                    </label>

                    <div class="flex justify-end gap-2">
                      <button type="button" (click)="volver()" class="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700">
                        {{ paso() === 'desconciliar' ? 'Volver a la ficha' : 'Cancelar' }}
                      </button>
                      <button type="submit" [disabled]="!puedeConfirmar()" class="rounded-lg bg-red-700 px-3 py-2 text-sm font-semibold text-white hover:bg-red-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-400 dark:focus-visible:ring-offset-slate-800">
                        {{ guardando() ? 'Aplicando...' : (paso() === 'desconciliar' ? 'Desconciliar' : 'Eliminar pago voluntario') }}
                      </button>
                    </div>
                  </form>
                }
              </section>
            }
          </div>
        </div>
      </div>
    }
  `
})
export class AjustePagoBancoDialogWidget implements OnChanges {
  private ajusteService = inject(AjusteConciliacionService);

  @Input() pagoBancoId: number | null = null;
  @Input() pagoVoluntarioId: number | null = null;
  @Input() contexto: ContextoAjuste | null = null;
  @Output() cerrado = new EventEmitter<{ huboCambios: boolean; documento: string | null }>();

  readonly destinos = DESTINOS;
  readonly abierto = signal(false);
  readonly paso = signal<Paso>('ficha');
  readonly cargando = signal(false);
  readonly guardando = signal(false);
  readonly error = signal<string | null>(null);
  readonly ficha = signal<FichaPagoBanco | null>(null);
  readonly vista = signal<VistaPreviaAjuste | null>(null);
  readonly resultado = signal<ResultadoAjuste | null>(null);
  readonly destino = signal<DestinoDesconciliacion | null>(null);
  readonly motivo = signal('');
  readonly confirmado = signal(false);
  private huboCambios = false;
  private documento: string | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['pagoBancoId'] && !changes['pagoVoluntarioId']) return;
    this.reiniciar();
    if (!this.contexto) return;
    if (this.pagoBancoId) {
      this.abierto.set(true);
      this.cargarFicha();
    } else if (this.pagoVoluntarioId) {
      this.abierto.set(true);
      this.paso.set('eliminar-voluntario');
      this.cargarVista();
    } else {
      this.abierto.set(false);
    }
  }

  titulo(): string {
    switch (this.paso()) {
      case 'desconciliar': return 'Desconciliar pago del banco';
      case 'eliminar-voluntario': return 'Eliminar pago voluntario sin banco';
      case 'hecho': return 'Ajuste aplicado';
      default: return 'Ficha del pago bancario';
    }
  }

  irADesconciliar(): void {
    this.paso.set('desconciliar');
    this.cargarVista();
  }

  volver(): void {
    if (this.paso() === 'desconciliar') {
      this.paso.set('ficha');
      this.vista.set(null);
      this.error.set(null);
    } else {
      this.cerrar();
    }
  }

  puedeConfirmar(): boolean {
    const motivoValido = this.motivo().trim().length >= 10;
    const destinoValido = this.paso() !== 'desconciliar' || this.destino() !== null;
    return motivoValido && destinoValido && this.confirmado() && !this.guardando() && !!this.vista()?.ejecutable;
  }

  confirmar(evento: Event): void {
    evento.preventDefault();
    if (!this.puedeConfirmar() || !this.contexto) return;

    this.guardando.set(true);
    this.error.set(null);
    const motivo = this.motivo().trim();
    const peticion = this.paso() === 'desconciliar'
      ? this.ajusteService.desconciliar(this.pagoBancoId!, this.contexto, { destino: this.destino()!, motivo })
      : this.ajusteService.eliminarVoluntario(this.pagoVoluntarioId!, this.contexto, motivo);

    peticion.subscribe({
      next: resultado => {
        this.guardando.set(false);
        this.huboCambios = true;
        this.documento = resultado.documento ?? this.vista()?.documento ?? this.documento;
        this.resultado.set(resultado);
        this.vista.set(null);
        this.paso.set('hecho');
        // La ficha se vuelve a leer para mostrar las conciliaciones revertidas.
        if (this.pagoBancoId) this.cargarFicha(false);
      },
      error: err => {
        this.guardando.set(false);
        this.error.set(this.mensajeError(err, 'No se pudo aplicar el ajuste'));
        // Lo que bloqueó pudo cambiar (otro usuario): se recalcula la vista previa.
        this.cargarVista();
      }
    });
  }

  cerrar(): void {
    if (this.guardando()) return;
    this.abierto.set(false);
    this.cerrado.emit({ huboCambios: this.huboCambios, documento: this.documento });
  }

  private cargarFicha(conIndicador = true): void {
    if (!this.contexto || !this.pagoBancoId) return;
    if (conIndicador) this.cargando.set(true);
    this.ajusteService.obtenerFicha(this.pagoBancoId, this.contexto).subscribe({
      next: ficha => {
        this.cargando.set(false);
        this.ficha.set(ficha);
        this.documento = ficha.documento;
      },
      error: err => {
        this.cargando.set(false);
        this.error.set(this.mensajeError(err, 'No se pudo cargar la ficha del pago'));
      }
    });
  }

  private cargarVista(): void {
    if (!this.contexto) return;
    const peticion = this.paso() === 'desconciliar' && this.pagoBancoId
      ? this.ajusteService.vistaPreviaDesconciliar(this.pagoBancoId, this.contexto)
      : this.pagoVoluntarioId
        ? this.ajusteService.vistaPreviaEliminarVoluntario(this.pagoVoluntarioId, this.contexto)
        : null;
    if (!peticion) return;

    this.cargando.set(true);
    peticion.subscribe({
      next: vista => {
        this.cargando.set(false);
        this.vista.set(vista);
        this.documento = vista.documento ?? this.documento;
      },
      error: err => {
        this.cargando.set(false);
        this.error.set(this.mensajeError(err, 'No se pudo calcular la vista previa'));
      }
    });
  }

  private reiniciar(): void {
    this.paso.set('ficha');
    this.cargando.set(false);
    this.guardando.set(false);
    this.error.set(null);
    this.ficha.set(null);
    this.vista.set(null);
    this.resultado.set(null);
    this.destino.set(null);
    this.motivo.set('');
    this.confirmado.set(false);
    this.huboCambios = false;
    this.documento = null;
  }

  private mensajeError(err: any, porDefecto: string): string {
    if (err?.status === 403) return 'Solo un administrador puede hacer ajustes finos.';
    return err?.error?.mensaje || err?.error?.message || porDefecto;
  }

  etiquetaCategoria(categoria: string | null | undefined): string {
    return infoCategoria(categoria).label;
  }

  pillCategoria(categoria: string | null | undefined): string {
    return TONO_PILL[infoCategoria(categoria).tono];
  }

  fecha(valor: string | null | undefined): string {
    return fechaCorta(valor);
  }

  monto(valor: number | null | undefined): string {
    return montoSoles(valor);
  }

  fechaHora(valor: string | null | undefined): string {
    if (!valor) return '-';
    const match = String(valor).match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
    return match ? `${match[3]}/${match[2]}/${match[1]} ${match[4]}:${match[5]}` : fechaCorta(valor);
  }

  periodo(valor: string | null | undefined): string {
    return valor && valor.length === 6 ? `${valor.slice(4, 6)}/${valor.slice(0, 4)}` : '-';
  }

  origenPeriodo(origen: string | null | undefined): string {
    switch (origen) {
      case 'CONCILIACION': return 'movido al conciliar';
      case 'CONSOLIDADO': return 'por el consolidado';
      case 'MANUAL': return 'cambio manual';
      default: return 'por su fecha';
    }
  }
}
