import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { A11yModule } from '@angular/cdk/a11y';
import { Observable, forkJoin } from 'rxjs';
import { CorreccionPagosService } from '../services/correccion-pagos.service';
import { PagoBancoPorResolver } from '../models/bcp-archivo.model';
import { CuotaValidaTipificar, PagoPendienteConciliacion } from '../models/correccion-pagos.model';
import { MOTIVOS_REVISION, aFechaIso, diasEntre, fechaCorta, montoSoles } from '../models/categoria-pago';

/** Un pago registrado por el asesor. Puede estar aplicado a varias cuotas (misma transacción). */
interface PagoAsesor {
  clave: string;
  /** Pago cuota con el que se corrige o elimina el pago completo. */
  pagoCuotaId: number;
  fecha: string;
  total: number;
  cuotas: PagoPendienteConciliacion[];
  eliminable: boolean;
}

interface PagosPorFecha {
  fecha: string;
  pagos: PagoAsesor[];
}

type Control = 'crear' | 'ampliar' | 'promesa' | 'voluntario';

const DIAS_AMPLIACION = 3;

/**
 * Diálogo para resolver un pago bancario pendiente.
 * Reúne los controles de corrección disponibles y permite corregir cada pago del asesor por separado.
 */
@Component({
  selector: 'app-pago-pendiente-controles-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, A11yModule],
  template: `
    @if (pago; as banco) {
      <div class="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/50 p-4" (click)="cerrar()">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="ppc-titulo"
          aria-describedby="ppc-resumen"
          cdkTrapFocus
          [cdkTrapFocusAutoCapture]="true"
          class="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
          (click)="$event.stopPropagation()"
          (keydown.escape)="cerrar()"
        >
          <header class="flex items-start justify-between gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-700">
            <div>
              <h2 id="ppc-titulo" cdkFocusInitial tabindex="-1" class="text-base font-bold text-slate-900 focus:outline-none dark:text-white">
                Resolver pago bancario
              </h2>
              <p class="text-xs text-slate-600 dark:text-slate-400">Cliente {{ banco.documento }}</p>
            </div>
            <button
              type="button"
              (click)="cerrar()"
              [disabled]="guardando()"
              aria-label="Cerrar"
              class="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </header>

          <div class="flex-1 space-y-5 overflow-y-auto px-5 py-4">
            <!-- Pago del banco -->
            <section id="ppc-resumen" class="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-900 dark:bg-blue-950/30">
              <h3 class="text-xs font-bold uppercase tracking-wide text-blue-900 dark:text-blue-200">Pago del banco</h3>
              <dl class="mt-2 grid grid-cols-3 gap-3 text-sm">
                <div>
                  <dt class="text-xs text-slate-600 dark:text-slate-400">Fecha</dt>
                  <dd class="font-semibold text-slate-900 dark:text-white">{{ fecha(banco.fechaBanco) }}</dd>
                </div>
                <div>
                  <dt class="text-xs text-slate-600 dark:text-slate-400">Monto</dt>
                  <dd class="font-semibold text-slate-900 dark:text-white">{{ monto(banco.montoBanco) }}</dd>
                </div>
                <div>
                  <dt class="text-xs text-slate-600 dark:text-slate-400">Nro. operación</dt>
                  <dd class="font-semibold text-slate-900 dark:text-white">{{ banco.numeroOperacion || '-' }}</dd>
                </div>
              </dl>
              <p class="mt-2 text-sm text-slate-800 dark:text-slate-200">{{ problema() }}</p>
            </section>

            <div aria-live="polite">
              @if (mensajeExito(); as texto) {
                <p role="status" class="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200">{{ texto }}</p>
              }
            </div>
            @if (errorAccion(); as texto) {
              <p role="alert" class="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-800 dark:border-red-800 dark:bg-red-950/30 dark:text-red-200">{{ texto }}</p>
            }

            @if (cargando()) {
              <p role="status" class="py-6 text-center text-sm text-slate-600 dark:text-slate-400">Cargando pagos y cuotas del cliente...</p>
            } @else if (errorCarga(); as texto) {
              <div role="alert" class="rounded-lg border border-red-200 bg-red-50 px-3 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950/30 dark:text-red-200">
                <p>{{ texto }}</p>
                <button type="button" (click)="cargar()" class="mt-2 rounded-lg border border-red-300 px-3 py-1.5 text-xs font-semibold hover:bg-red-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:border-red-700 dark:hover:bg-red-900/40">Reintentar</button>
              </div>
            } @else {
              <!-- Pagos del asesor, por fecha -->
              <section aria-labelledby="ppc-pagos-titulo">
                <h3 id="ppc-pagos-titulo" class="text-sm font-bold text-slate-900 dark:text-white">Pagos registrados por el asesor</h3>
                <p class="text-xs text-slate-600 dark:text-slate-400">Pagos sin conciliar del cliente. Cada uno se corrige por separado.</p>

                @if (pagosPorFecha().length === 0) {
                  <p class="mt-2 rounded-lg border border-dashed border-slate-300 px-3 py-4 text-center text-sm text-slate-600 dark:border-slate-600 dark:text-slate-400">
                    El cliente no tiene pagos registrados sin conciliar.
                  </p>
                }

                @for (grupo of pagosPorFecha(); track grupo.fecha) {
                  <div class="mt-3">
                    <h4 class="text-xs font-bold uppercase tracking-wide text-slate-700 dark:text-slate-300">
                      {{ fecha(grupo.fecha) }}
                      <span class="font-normal normal-case text-slate-600 dark:text-slate-400">· {{ etiquetaDesfase(grupo.fecha) }}</span>
                    </h4>
                    <ul class="mt-1 space-y-2">
                      @for (item of grupo.pagos; track item.clave) {
                        <li class="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
                          <div class="flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <p class="text-sm font-semibold text-slate-900 dark:text-white">{{ monto(item.total) }}</p>
                              <p class="text-xs text-slate-600 dark:text-slate-400">{{ describirCuotas(item) }}</p>
                            </div>
                            <div class="flex items-center gap-2">
                              <button
                                type="button"
                                (click)="abrirModificar(item)"
                                [disabled]="guardando()"
                                [attr.aria-expanded]="editando() === item.clave"
                                [attr.aria-controls]="'ppc-editar-' + item.clave"
                                [attr.aria-label]="'Modificar pago de ' + monto(item.total) + ' del ' + fecha(item.fecha)"
                                class="rounded-lg border border-blue-300 px-3 py-1.5 text-xs font-bold text-blue-800 hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 dark:border-blue-700 dark:text-blue-200 dark:hover:bg-blue-950/40"
                              >
                                Modificar
                              </button>
                              @if (item.eliminable) {
                                <button
                                  type="button"
                                  (click)="abrirEliminar(item)"
                                  [disabled]="guardando()"
                                  [attr.aria-expanded]="eliminando() === item.clave"
                                  [attr.aria-controls]="'ppc-eliminar-' + item.clave"
                                  [attr.aria-label]="'Eliminar pago de ' + monto(item.total) + ' del ' + fecha(item.fecha)"
                                  class="rounded-lg border border-red-300 px-3 py-1.5 text-xs font-bold text-red-800 hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:opacity-50 dark:border-red-800 dark:text-red-200 dark:hover:bg-red-950/40"
                                >
                                  Eliminar
                                </button>
                              }
                            </div>
                          </div>

                          @if (editando() === item.clave) {
                            <form [id]="'ppc-editar-' + item.clave" class="mt-3 border-t border-slate-200 pt-3 dark:border-slate-700" (ngSubmit)="guardarModificar(item)">
                              @if (item.cuotas.length > 1) {
                                <p class="mb-2 text-xs text-slate-600 dark:text-slate-400">Este pago cubre {{ item.cuotas.length }} cuotas. El monto es el total y se vuelve a repartir entre ellas.</p>
                              }
                              <div class="grid grid-cols-2 gap-3">
                                <div>
                                  <label [attr.for]="'ppc-fecha-' + item.clave" [class]="labelClass">Fecha de pago</label>
                                  <input [id]="'ppc-fecha-' + item.clave" type="date" name="fecha" required [(ngModel)]="formFecha" [class]="inputClass" />
                                </div>
                                <div>
                                  <label [attr.for]="'ppc-monto-' + item.clave" [class]="labelClass">Monto (S/)</label>
                                  <input [id]="'ppc-monto-' + item.clave" type="number" name="monto" required min="0.01" step="0.01" inputmode="decimal" [(ngModel)]="formMonto" [class]="inputClass" />
                                </div>
                              </div>
                              <div class="mt-3 flex flex-wrap items-center justify-between gap-2">
                                <button type="button" (click)="usarDatosDelBanco()" [class]="btnSecundario">Usar fecha y monto del banco</button>
                                <div class="flex gap-2">
                                  <button type="button" (click)="cancelarEdicion()" [disabled]="guardando()" [class]="btnSecundario">Cancelar</button>
                                  <button type="submit" [disabled]="!formValido() || guardando()" [class]="btnPrimario">{{ guardando() ? 'Guardando...' : 'Guardar cambios' }}</button>
                                </div>
                              </div>
                            </form>
                          }

                          @if (eliminando() === item.clave) {
                            <div [id]="'ppc-eliminar-' + item.clave" class="mt-3 border-t border-slate-200 pt-3 dark:border-slate-700">
                              <p class="text-sm text-slate-800 dark:text-slate-200">Se eliminará el pago completo y todas sus aplicaciones a cuotas. Esta acción no se puede deshacer.</p>
                              <div class="mt-2 flex justify-end gap-2">
                                <button type="button" (click)="cancelarEdicion()" [disabled]="guardando()" [class]="btnSecundario">Cancelar</button>
                                <button type="button" (click)="confirmarEliminar(item)" [disabled]="guardando()" [class]="btnPeligro">{{ guardando() ? 'Eliminando...' : 'Eliminar pago' }}</button>
                              </div>
                            </div>
                          }
                        </li>
                      }
                    </ul>
                  </div>
                }
              </section>

              <!-- Otros controles -->
              <section aria-labelledby="ppc-controles-titulo">
                <h3 id="ppc-controles-titulo" class="text-sm font-bold text-slate-900 dark:text-white">Otras acciones</h3>
                <p class="text-xs text-slate-600 dark:text-slate-400">Los formularios vienen con la fecha y el monto del banco.</p>

                <div class="mt-2 space-y-2">
                  <!-- Crear pago en una cuota -->
                  <div class="rounded-lg border border-slate-200 dark:border-slate-700">
                    <h4>
                      <button type="button" (click)="alternarControl('crear')" [disabled]="cuotas().length === 0 || guardando()" [attr.aria-expanded]="control() === 'crear'" aria-controls="ppc-control-crear" [class]="btnAcordeon">
                        <span>
                          <span class="block text-sm font-semibold">Crear pago en una cuota</span>
                          <span class="block text-xs font-normal text-slate-600 dark:text-slate-400">
                            {{ cuotas().length === 0 ? 'No disponible: el cliente no tiene cuotas pendientes en su última promesa.' : 'El asesor no registró la cancelación de este pago.' }}
                          </span>
                        </span>
                        <span aria-hidden="true">{{ control() === 'crear' ? '−' : '+' }}</span>
                      </button>
                    </h4>
                    @if (control() === 'crear') {
                      <form id="ppc-control-crear" class="border-t border-slate-200 p-3 dark:border-slate-700" (ngSubmit)="guardarCrear()">
                        <label for="ppc-crear-cuota" [class]="labelClass">Cuota</label>
                        <select id="ppc-crear-cuota" name="cuota" required [(ngModel)]="formCuotaId" [class]="inputClass">
                          @for (cuota of cuotas(); track cuota.cuotaId) {
                            <option [ngValue]="cuota.cuotaId">{{ describirCuota(cuota) }}</option>
                          }
                        </select>
                        <div class="mt-3 grid grid-cols-2 gap-3">
                          <div>
                            <label for="ppc-crear-fecha" [class]="labelClass">Fecha de pago</label>
                            <input id="ppc-crear-fecha" type="date" name="fecha" required [(ngModel)]="formFecha" [class]="inputClass" />
                          </div>
                          <div>
                            <label for="ppc-crear-monto" [class]="labelClass">Monto (S/)</label>
                            <input id="ppc-crear-monto" type="number" name="monto" required min="0.01" step="0.01" inputmode="decimal" [(ngModel)]="formMonto" [class]="inputClass" />
                          </div>
                        </div>
                        <div class="mt-3 flex justify-end">
                          <button type="submit" [disabled]="!formValido() || !formCuotaId || guardando()" [class]="btnPrimario">{{ guardando() ? 'Creando...' : 'Crear pago' }}</button>
                        </div>
                      </form>
                    }
                  </div>

                  <!-- Ampliar vencimiento -->
                  <div class="rounded-lg border border-slate-200 dark:border-slate-700">
                    <h4>
                      <button type="button" (click)="alternarControl('ampliar')" [disabled]="cuotasAmpliables().length === 0 || guardando()" [attr.aria-expanded]="control() === 'ampliar'" aria-controls="ppc-control-ampliar" [class]="btnAcordeon">
                        <span>
                          <span class="block text-sm font-semibold">Ampliar vencimiento de una cuota</span>
                          <span class="block text-xs font-normal text-slate-600 dark:text-slate-400">
                            {{ cuotasAmpliables().length === 0 ? 'No disponible: no hay cuotas vencidas a 3 días o menos de la fecha del banco.' : 'La cuota venció y el pago llegó hasta 3 días después. Mueve el vencimiento y crea el pago.' }}
                          </span>
                        </span>
                        <span aria-hidden="true">{{ control() === 'ampliar' ? '−' : '+' }}</span>
                      </button>
                    </h4>
                    @if (control() === 'ampliar') {
                      <form id="ppc-control-ampliar" class="border-t border-slate-200 p-3 dark:border-slate-700" (ngSubmit)="guardarAmpliar()">
                        <label for="ppc-ampliar-cuota" [class]="labelClass">Cuota vencida</label>
                        <select id="ppc-ampliar-cuota" name="cuota" required [(ngModel)]="formCuotaId" [class]="inputClass">
                          @for (cuota of cuotasAmpliables(); track cuota.cuotaId) {
                            <option [ngValue]="cuota.cuotaId">{{ describirCuota(cuota) }}</option>
                          }
                        </select>
                        <div class="mt-3 grid grid-cols-2 gap-3">
                          <div>
                            <label for="ppc-ampliar-fecha" [class]="labelClass">Nueva fecha de vencimiento</label>
                            <input id="ppc-ampliar-fecha" type="date" name="fecha" required [(ngModel)]="formFecha" [class]="inputClass" />
                          </div>
                          <div>
                            <label for="ppc-ampliar-monto" [class]="labelClass">Monto del banco (S/)</label>
                            <input id="ppc-ampliar-monto" type="number" name="monto" required min="0.01" step="0.01" inputmode="decimal" [(ngModel)]="formMonto" [class]="inputClass" />
                          </div>
                        </div>
                        <label class="mt-3 flex items-center gap-2 text-sm text-slate-800 dark:text-slate-200">
                          <input type="checkbox" name="asesor" [(ngModel)]="formPagoDelAsesor" class="h-4 w-4 rounded border-slate-400 text-blue-600 focus:ring-2 focus:ring-blue-500" />
                          El pago corresponde al asesor original
                        </label>
                        <div class="mt-3 flex justify-end">
                          <button type="submit" [disabled]="!formValido() || !formCuotaId || guardando()" [class]="btnPrimario">{{ guardando() ? 'Guardando...' : 'Ampliar y crear pago' }}</button>
                        </div>
                      </form>
                    }
                  </div>

                  <!-- Promesa del sistema -->
                  <div class="rounded-lg border border-slate-200 dark:border-slate-700">
                    <h4>
                      <button type="button" (click)="alternarControl('promesa')" [disabled]="cuotasPromesaSistema().length === 0 || guardando()" [attr.aria-expanded]="control() === 'promesa'" aria-controls="ppc-control-promesa" [class]="btnAcordeon">
                        <span>
                          <span class="block text-sm font-semibold">Crear promesa del sistema</span>
                          <span class="block text-xs font-normal text-slate-600 dark:text-slate-400">
                            {{ cuotasPromesaSistema().length === 0 ? 'No disponible: no hay cuotas vencidas hace más de 3 días en el mismo mes del pago.' : 'La promesa de una sola cuota venció hace más de 3 días. El pago se asigna al sistema, no al asesor.' }}
                          </span>
                        </span>
                        <span aria-hidden="true">{{ control() === 'promesa' ? '−' : '+' }}</span>
                      </button>
                    </h4>
                    @if (control() === 'promesa') {
                      <form id="ppc-control-promesa" class="border-t border-slate-200 p-3 dark:border-slate-700" (ngSubmit)="guardarPromesaSistema()">
                        <label for="ppc-promesa-cuota" [class]="labelClass">Cuota vencida</label>
                        <select id="ppc-promesa-cuota" name="cuota" required [(ngModel)]="formCuotaId" [class]="inputClass">
                          @for (cuota of cuotasPromesaSistema(); track cuota.cuotaId) {
                            <option [ngValue]="cuota.cuotaId">{{ describirCuota(cuota) }}</option>
                          }
                        </select>
                        <div class="mt-3 grid grid-cols-2 gap-3">
                          <div>
                            <label for="ppc-promesa-fecha" [class]="labelClass">Fecha de pago</label>
                            <input id="ppc-promesa-fecha" type="date" name="fecha" required [(ngModel)]="formFecha" [class]="inputClass" />
                          </div>
                          <div>
                            <label for="ppc-promesa-monto" [class]="labelClass">Monto (S/)</label>
                            <input id="ppc-promesa-monto" type="number" name="monto" required min="0.01" step="0.01" inputmode="decimal" [(ngModel)]="formMonto" [class]="inputClass" />
                          </div>
                        </div>
                        <div class="mt-3 flex justify-end">
                          <button type="submit" [disabled]="!formValido() || !formCuotaId || guardando()" [class]="btnPrimario">{{ guardando() ? 'Creando...' : 'Crear promesa del sistema' }}</button>
                        </div>
                      </form>
                    }
                  </div>

                  <!-- Pago voluntario -->
                  <div class="rounded-lg border border-red-200 dark:border-red-900">
                    <h4>
                      <button type="button" (click)="alternarControl('voluntario')" [disabled]="guardando()" [attr.aria-expanded]="control() === 'voluntario'" aria-controls="ppc-control-voluntario" [class]="btnAcordeon">
                        <span>
                          <span class="block text-sm font-semibold text-red-800 dark:text-red-200">Registrar como pago voluntario</span>
                          <span class="block text-xs font-normal text-slate-600 dark:text-slate-400">Acción crítica: el pago no se asigna a ningún asesor y no se puede revertir.</span>
                        </span>
                        <span aria-hidden="true">{{ control() === 'voluntario' ? '−' : '+' }}</span>
                      </button>
                    </h4>
                    @if (control() === 'voluntario') {
                      <form id="ppc-control-voluntario" class="border-t border-red-200 p-3 dark:border-red-900" (ngSubmit)="guardarVoluntario()">
                        <div class="grid grid-cols-2 gap-3">
                          <div>
                            <label for="ppc-voluntario-fecha" [class]="labelClass">Fecha de pago</label>
                            <input id="ppc-voluntario-fecha" type="date" name="fecha" required [(ngModel)]="formFecha" [class]="inputClass" />
                          </div>
                          <div>
                            <label for="ppc-voluntario-monto" [class]="labelClass">Monto (S/)</label>
                            <input id="ppc-voluntario-monto" type="number" name="monto" required min="0.01" step="0.01" inputmode="decimal" [(ngModel)]="formMonto" [class]="inputClass" />
                          </div>
                        </div>
                        <label class="mt-3 flex items-start gap-2 text-sm text-slate-800 dark:text-slate-200">
                          <input type="checkbox" name="confirmar" [(ngModel)]="formConfirmaVoluntario" class="mt-0.5 h-4 w-4 rounded border-slate-400 text-red-600 focus:ring-2 focus:ring-red-500" />
                          Confirmo que este pago no corresponde a ninguna promesa del cliente.
                        </label>
                        <div class="mt-3 flex justify-end">
                          <button type="submit" [disabled]="!formValido() || !formConfirmaVoluntario || guardando()" [class]="btnPeligro">{{ guardando() ? 'Registrando...' : 'Registrar pago voluntario' }}</button>
                        </div>
                      </form>
                    }
                  </div>
                </div>
              </section>
            }
          </div>

          <footer class="flex items-center justify-between gap-3 border-t border-slate-200 px-5 py-3 dark:border-slate-700">
            <p class="text-xs text-slate-600 dark:text-slate-400">
              {{ huboCambios ? 'Al cerrar se vuelven a evaluar los pagos del cliente.' : 'Sin cambios todavía.' }}
            </p>
            <button type="button" (click)="cerrar()" [disabled]="guardando()" [class]="btnSecundario">Cerrar</button>
          </footer>
        </div>
      </div>
    }
  `
})
export class PagoPendienteControlesDialogWidget implements OnChanges {
  /** Pago a resolver. El diálogo está abierto mientras tenga valor. */
  @Input() pago: PagoBancoPorResolver | null = null;
  @Input() tenantId = 0;
  @Input() carteraId = 0;
  @Input() subcarteraId = 0;
  @Output() cerrado = new EventEmitter<{ documento: string; huboCambios: boolean }>();

  readonly labelClass = 'mb-1 block text-xs font-semibold text-slate-800 dark:text-slate-200';
  readonly inputClass = 'w-full rounded-lg border border-slate-400 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:border-slate-500 dark:bg-slate-800 dark:text-white';
  readonly btnPrimario = 'rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-400 dark:focus-visible:ring-offset-slate-900';
  readonly btnPeligro = 'rounded-lg bg-red-700 px-3 py-2 text-xs font-bold text-white hover:bg-red-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-400 dark:focus-visible:ring-offset-slate-900';
  readonly btnSecundario = 'rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800';
  readonly btnAcordeon = 'flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-slate-900 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-60 dark:text-white dark:hover:bg-slate-800';

  cargando = signal(false);
  errorCarga = signal<string | null>(null);
  guardando = signal(false);
  errorAccion = signal<string | null>(null);
  mensajeExito = signal<string | null>(null);

  pagosPorFecha = signal<PagosPorFecha[]>([]);
  cuotas = signal<CuotaValidaTipificar[]>([]);
  cuotasAmpliables = signal<CuotaValidaTipificar[]>([]);
  cuotasPromesaSistema = signal<CuotaValidaTipificar[]>([]);

  editando = signal<string | null>(null);
  eliminando = signal<string | null>(null);
  control = signal<Control | null>(null);

  formFecha = '';
  formMonto: number | null = null;
  formCuotaId: number | null = null;
  formPagoDelAsesor = true;
  formConfirmaVoluntario = false;
  huboCambios = false;

  constructor(private correccionService: CorreccionPagosService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pago'] && this.pago) {
      this.huboCambios = false;
      this.mensajeExito.set(null);
      this.errorAccion.set(null);
      this.cerrarFormularios();
      this.cargar();
    }
  }

  cargar(): void {
    if (!this.pago) return;
    const request = { documento: this.pago.documento, ...this.contexto() };

    this.cargando.set(true);
    this.errorCarga.set(null);
    forkJoin({
      pagos: this.correccionService.buscarPendientesConciliacion(request),
      cuotas: this.correccionService.buscarCuotasValidasTipificar(request)
    }).subscribe({
      next: ({ pagos, cuotas }) => {
        this.pagosPorFecha.set(this.agruparPorFecha(pagos || []));
        this.asignarCuotas(cuotas || []);
        this.cargando.set(false);
      },
      error: () => {
        this.errorCarga.set('No se pudieron cargar los pagos y cuotas del cliente.');
        this.cargando.set(false);
      }
    });
  }

  cerrar(): void {
    if (!this.pago || this.guardando()) return;
    this.cerrado.emit({ documento: this.pago.documento, huboCambios: this.huboCambios });
  }

  // ----- Pagos del asesor -----

  abrirModificar(item: PagoAsesor): void {
    if (this.editando() === item.clave) {
      this.cancelarEdicion();
      return;
    }
    this.cerrarFormularios();
    this.formFecha = item.fecha;
    this.formMonto = item.total;
    this.editando.set(item.clave);
  }

  abrirEliminar(item: PagoAsesor): void {
    if (this.eliminando() === item.clave) {
      this.cancelarEdicion();
      return;
    }
    this.cerrarFormularios();
    this.eliminando.set(item.clave);
  }

  cancelarEdicion(): void {
    this.cerrarFormularios();
  }

  usarDatosDelBanco(): void {
    if (!this.pago) return;
    this.formFecha = aFechaIso(this.pago.fechaBanco);
    this.formMonto = Number(this.pago.montoBanco);
  }

  guardarModificar(item: PagoAsesor): void {
    if (!this.formValido()) return;
    this.ejecutar(
      this.correccionService.corregirPago(item.pagoCuotaId, this.contexto(), {
        fechaPago: this.formFecha,
        montoPago: Number(this.formMonto)
      }),
      'Pago modificado.',
      'No se pudo modificar el pago.'
    );
  }

  confirmarEliminar(item: PagoAsesor): void {
    this.ejecutar(
      this.correccionService.eliminarPago(item.pagoCuotaId, this.contexto()),
      'Pago eliminado.',
      'No se pudo eliminar el pago.'
    );
  }

  // ----- Otros controles -----

  alternarControl(control: Control): void {
    const abrir = this.control() !== control;
    this.cerrarFormularios();
    if (!abrir || !this.pago) return;

    this.formFecha = aFechaIso(this.pago.fechaBanco);
    this.formMonto = Number(this.pago.montoBanco);
    const disponibles = control === 'ampliar'
      ? this.cuotasAmpliables()
      : control === 'promesa'
        ? this.cuotasPromesaSistema()
        : this.cuotas();
    this.formCuotaId = disponibles.length > 0 ? disponibles[0].cuotaId : null;
    this.control.set(control);
  }

  guardarCrear(): void {
    if (!this.pago || !this.formValido() || !this.formCuotaId) return;
    this.ejecutar(
      this.correccionService.crearCancelacion(this.formCuotaId, this.contexto(), {
        documento: this.pago.documento,
        fechaPago: this.formFecha,
        montoPago: Number(this.formMonto)
      }),
      'Pago creado en la cuota.',
      'No se pudo crear el pago.'
    );
  }

  guardarAmpliar(): void {
    if (!this.pago || !this.formValido() || !this.formCuotaId) return;
    this.ejecutar(
      this.correccionService.ampliarVencimiento(this.formCuotaId, this.contexto(), {
        documento: this.pago.documento,
        fechaPago: this.formFecha,
        montoPago: Number(this.formMonto),
        pagoCorrespondeAsesor: this.formPagoDelAsesor
      }),
      'Vencimiento ampliado y pago creado.',
      'No se pudo ampliar el vencimiento.'
    );
  }

  guardarPromesaSistema(): void {
    if (!this.pago || !this.formValido() || !this.formCuotaId) return;
    this.ejecutar(
      this.correccionService.crearPromesaSistemaPagoBanco(this.formCuotaId, this.contexto(), {
        documento: this.pago.documento,
        fechaPago: this.formFecha,
        montoPago: Number(this.formMonto)
      }),
      'Promesa del sistema creada.',
      'No se pudo crear la promesa del sistema.'
    );
  }

  guardarVoluntario(): void {
    if (!this.pago || !this.formValido() || !this.formConfirmaVoluntario) return;
    this.ejecutar(
      this.correccionService.crearPagoVoluntarioSistema(this.contexto(), {
        documento: this.pago.documento,
        fechaPago: this.formFecha,
        montoPago: Number(this.formMonto)
      }),
      'Pago voluntario registrado.',
      'No se pudo registrar el pago voluntario.'
    );
  }

  // ----- Presentación -----

  formValido(): boolean {
    return !!this.formFecha && this.formMonto !== null && Number(this.formMonto) > 0;
  }

  problema(): string {
    const motivo = this.pago?.motivo;
    const texto = motivo ? MOTIVOS_REVISION[motivo] : undefined;
    return texto ? `${texto.problema} ${texto.accion}` : 'Este pago no calza con ningún pago registrado por el asesor.';
  }

  etiquetaDesfase(fechaPago: string): string {
    if (!this.pago) return '';
    const dias = diasEntre(fechaPago, aFechaIso(this.pago.fechaBanco));
    if (dias === 0) return 'misma fecha que el banco';
    const cantidad = Math.abs(dias);
    return `${cantidad} día${cantidad === 1 ? '' : 's'} ${dias > 0 ? 'antes' : 'después'} del banco`;
  }

  describirCuotas(item: PagoAsesor): string {
    return item.cuotas
      .map(c => `Cuota ${c.numeroCuota} (vence ${this.fecha(c.fechaPromesa)}, ${String(c.estadoCuota || '').toLowerCase()})`)
      .join(' · ');
  }

  describirCuota(cuota: CuotaValidaTipificar): string {
    return `Cuota ${cuota.numeroCuota} · vence ${this.fecha(cuota.fechaPromesa)} · ${this.monto(cuota.montoPromesa)} · ${String(cuota.estadoCuota).toLowerCase()}`;
  }

  fecha(value: unknown): string {
    return fechaCorta(value);
  }

  monto(value: number | null | undefined): string {
    return montoSoles(value);
  }

  // ----- Internos -----

  private ejecutar(accion: Observable<unknown>, mensajeOk: string, mensajeError: string): void {
    this.guardando.set(true);
    this.errorAccion.set(null);
    this.mensajeExito.set(null);
    accion.subscribe({
      next: () => {
        this.guardando.set(false);
        this.huboCambios = true;
        this.mensajeExito.set(mensajeOk);
        this.cerrarFormularios();
        this.cargar();
      },
      error: err => {
        this.guardando.set(false);
        this.errorAccion.set(this.mensajeDeError(err, mensajeError));
      }
    });
  }

  private mensajeDeError(error: any, porDefecto: string): string {
    const codigos: Record<string, string> = {
      PAGO_CUOTA_NO_ENCONTRADO: 'El pago ya no existe o fue eliminado.',
      PAGO_CUOTA_FUERA_DE_CONTEXTO: 'El pago no pertenece a la cartera o subcartera seleccionada.',
      PAGO_CUOTA_SIN_GESTION_ASOCIADA: 'El pago no tiene una promesa asociada y no puede eliminarse.',
      ELIMINACION_SOLO_PERMITIDA_PARA_PROMESA_PAGADA: 'Solo se pueden eliminar pagos de promesas que están pagadas.',
      PAGO_VERIFICADO_POR_BANCO_NO_ELIMINABLE: 'No se puede eliminar porque el pago ya fue validado por banco.',
      TRANSACCION_CON_PAGOS_FUERA_DE_GESTION: 'La transacción tiene aplicaciones inconsistentes y no puede eliminarse.'
    };
    const detalle = error?.error?.message || error?.error?.mensaje || error?.error?.error;
    if (typeof detalle === 'string' && detalle.trim()) {
      return codigos[detalle] || detalle;
    }
    return porDefecto;
  }

  private cerrarFormularios(): void {
    this.editando.set(null);
    this.eliminando.set(null);
    this.control.set(null);
    this.formFecha = '';
    this.formMonto = null;
    this.formCuotaId = null;
    this.formPagoDelAsesor = true;
    this.formConfirmaVoluntario = false;
  }

  /**
   * Las filas de una misma transacción son un solo pago del asesor repartido en varias cuotas:
   * se corrigen juntas, porque el backend redistribuye el monto total de la transacción.
   */
  private agruparPorFecha(filas: PagoPendienteConciliacion[]): PagosPorFecha[] {
    const porPago = new Map<string, PagoAsesor>();
    for (const fila of filas) {
      const clave = fila.transaccionId ? `t${fila.transaccionId}` : `p${fila.pagoCuotaId}`;
      let item = porPago.get(clave);
      if (!item) {
        item = {
          clave,
          pagoCuotaId: fila.pagoCuotaId,
          fecha: aFechaIso(fila.fechaPago),
          total: 0,
          cuotas: [],
          eliminable: fila.estadoPagoGestion === 'PAGADA'
        };
        porPago.set(clave, item);
      }
      item.total = Math.round((item.total + Number(fila.montoPago)) * 100) / 100;
      item.cuotas.push(fila);
    }

    const porFecha = new Map<string, PagoAsesor[]>();
    for (const item of porPago.values()) {
      item.cuotas.sort((a, b) => a.numeroCuota - b.numeroCuota);
      // La corrección parte de la primera cuota del pago.
      item.pagoCuotaId = item.cuotas[0].pagoCuotaId;
      porFecha.set(item.fecha, [...(porFecha.get(item.fecha) || []), item]);
    }

    return Array.from(porFecha.entries())
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([fecha, pagos]) => ({ fecha, pagos }));
  }

  private asignarCuotas(cuotas: CuotaValidaTipificar[]): void {
    const fechaBanco = this.pago ? aFechaIso(this.pago.fechaBanco) : '';
    const vencidas = cuotas.filter(c => c.estadoCuota === 'VENCIDA' && !!fechaBanco);

    this.cuotas.set(cuotas);
    this.cuotasAmpliables.set(vencidas.filter(c =>
      Math.abs(diasEntre(aFechaIso(c.fechaPromesa), fechaBanco)) <= DIAS_AMPLIACION));
    this.cuotasPromesaSistema.set(vencidas.filter(c => {
      const fechaPromesa = aFechaIso(c.fechaPromesa);
      return diasEntre(fechaPromesa, fechaBanco) > DIAS_AMPLIACION
        && fechaPromesa.slice(0, 7) === fechaBanco.slice(0, 7);
    }));
  }

  private contexto(): { tenantId: number; carteraId: number; subcarteraId: number } {
    return { tenantId: this.tenantId, carteraId: this.carteraId, subcarteraId: this.subcarteraId };
  }
}
