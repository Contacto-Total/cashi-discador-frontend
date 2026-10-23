import { Component, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges, inject, signal } from '@angular/core';
import { A11yModule } from '@angular/cdk/a11y';
import { Observable } from 'rxjs';
import { AccionesPagoBanco, ContextoAjuste, PagoBancoCliente } from '../models/ajuste-conciliacion.model';
import { PagoBancoPorResolver } from '../models/bcp-archivo.model';
import { TONO_PILL, aFechaIso, fechaCorta, infoCategoria, montoSoles } from '../models/categoria-pago';
import { AjusteConciliacionService } from '../services/ajuste-conciliacion.service';
import { BcpPagosService } from '../services/bcp-pagos.service';
import { ConsolidadoBancoService } from '../services/consolidado-banco.service';
import { AjustePagoBancoDialogWidget } from './ajuste-pago-banco-dialog.widget';

type Accion = 'ficha' | 'desconciliar' | 'resolver' | 'noCorresponde' | 'restaurar' | 'cambiarPeriodo';

interface OpcionMenu {
  accion: Accion;
  label: string;
  disponible: boolean;
  /** Por qué no se puede, si no está disponible. */
  ayuda: string | null;
  peligro?: boolean;
}

/**
 * Pagos del banco de un cliente en Corrección de pagos, en cualquier estado, con un solo menú de acciones por pago.
 * Cada opción aparece según el estado del pago; las de administrador solo se muestran a administradores.
 * Resolver lo abre la pantalla (usa el diálogo de corrección del asesor); el resto se hace aquí.
 */
@Component({
  selector: 'app-pagos-banco-cliente',
  standalone: true,
  imports: [A11yModule, AjustePagoBancoDialogWidget],
  template: `
    <section aria-labelledby="pbc-titulo">
      <h2 id="pbc-titulo" class="sr-only">Pagos del banco del cliente</h2>

      @if (cargando()) {
        <p role="status" class="p-6 text-center text-sm text-slate-600 dark:text-slate-400">Cargando pagos del banco...</p>
      } @else if (error(); as texto) {
        <p role="alert" class="m-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/20 dark:text-red-300">{{ texto }}</p>
      } @else if (pagos().length === 0) {
        <p class="p-6 text-center text-sm text-slate-600 dark:text-slate-400">El cliente no tiene pagos del banco en esta subcartera.</p>
      } @else {
        @if (mensaje(); as texto) {
          <p role="status" aria-live="polite" class="m-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200">{{ texto }}</p>
        }
        <div class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <caption class="sr-only">Pagos del banco, su estado, a qué están enlazados y sus acciones</caption>
            <thead class="bg-slate-100 text-left text-xs uppercase tracking-wide text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              <tr>
                <th scope="col" class="px-3 py-2">Fecha banco</th>
                <th scope="col" class="px-3 py-2 text-right">Monto</th>
                <th scope="col" class="px-3 py-2">Estado</th>
                <th scope="col" class="px-3 py-2">Enlazado a</th>
                <th scope="col" class="px-3 py-2">Carga</th>
                <th scope="col" class="px-3 py-2 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              @for (pago of pagos(); track pago.id) {
                <tr class="align-top">
                  <td class="whitespace-nowrap px-3 py-2">
                    <span class="font-semibold text-slate-900 dark:text-white">{{ fecha(pago.fechaBanco) }}</span>
                    <span class="block text-xs text-slate-500 dark:text-slate-400">Pb {{ pago.id }}{{ pago.numeroOperacion ? ' · Op. ' + pago.numeroOperacion : '' }}</span>
                    @if (periodoDistinto(pago)) {
                      <span class="mt-0.5 inline-block rounded-full bg-amber-100 px-1.5 py-0.5 text-[11px] font-semibold text-amber-900 dark:bg-amber-900/40 dark:text-amber-200">Cuenta en {{ periodo(pago.periodoBanco) }}</span>
                    }
                  </td>
                  <td class="whitespace-nowrap px-3 py-2 text-right font-bold tabular-nums text-slate-900 dark:text-white">{{ monto(pago.montoBanco) }}</td>
                  <td class="px-3 py-2">
                    <span class="inline-flex whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-semibold" [class]="pill(pago.categoria)">{{ etiqueta(pago.categoria) }}</span>
                    @if (pago.revisionManual) {
                      <span class="ml-1 inline-flex rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-900 dark:bg-amber-900/40 dark:text-amber-200">Retenido</span>
                    }
                    @if (pago.grupoId) {
                      <span class="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">Pago parcial · grupo {{ pago.grupoId }}</span>
                    }
                  </td>
                  <td class="px-3 py-2 text-slate-700 dark:text-slate-300">
                    @for (enlace of pago.enlaces; track enlace.pagoCuotaId) {
                      <span class="block">
                        @if (enlace.pagoVoluntarioSistema) {
                          Pago voluntario · gestión {{ enlace.gestionId }}
                        } @else {
                          Cuota {{ enlace.numeroCuota ?? '-' }} · gestión {{ enlace.gestionId }}
                        }
                        <span class="text-xs text-slate-500 dark:text-slate-400">· {{ enlace.agente || 'sin agente' }}</span>
                      </span>
                    } @empty {
                      <span class="text-slate-400 dark:text-slate-500">—</span>
                    }
                  </td>
                  <td class="px-3 py-2 text-xs text-slate-600 dark:text-slate-400">
                    @if (pago.archivoCargaId) {
                      #{{ pago.archivoCargaId }} · {{ fecha(pago.fechaCarga) }}
                    } @else {
                      Manual
                    }
                  </td>
                  <td class="relative px-3 py-2 text-right">
                    <button
                      type="button"
                      (click)="alternarMenu(pago.id, $event)"
                      [attr.aria-expanded]="menuAbierto() === pago.id"
                      [attr.aria-controls]="'pbc-menu-' + pago.id"
                      [attr.aria-label]="'Acciones del pago del ' + fecha(pago.fechaBanco) + ' por ' + monto(pago.montoBanco)"
                      class="rounded-lg border border-slate-300 px-2.5 py-1 text-xs font-semibold text-slate-800 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
                    >
                      Acciones <span aria-hidden="true">▾</span>
                    </button>
                    @if (menuAbierto() === pago.id) {
                      <div
                        [id]="'pbc-menu-' + pago.id"
                        (click)="$event.stopPropagation()"
                        class="absolute right-3 z-20 mt-1 w-72 rounded-lg border border-slate-200 bg-white p-1 text-left shadow-lg dark:border-slate-700 dark:bg-slate-800"
                      >
                        <ul>
                          @for (opcion of opciones(pago); track opcion.accion) {
                            <li>
                              <button
                                type="button"
                                [disabled]="!opcion.disponible"
                                (click)="ejecutar(opcion.accion, pago)"
                                class="w-full rounded-md px-2.5 py-2 text-left text-sm hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:hover:bg-transparent dark:hover:bg-slate-700"
                                [class]="!opcion.disponible ? 'text-slate-400 dark:text-slate-500' : opcion.peligro ? 'text-red-700 dark:text-red-300' : 'text-slate-800 dark:text-slate-100'"
                              >
                                <span class="block font-semibold">{{ opcion.label }}</span>
                                @if (opcion.ayuda) {
                                  <span class="block text-xs font-normal text-slate-500 dark:text-slate-400">{{ opcion.ayuda }}</span>
                                }
                              </button>
                            </li>
                          }
                        </ul>
                      </div>
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </section>

    <!-- No corresponde / cambiar periodo / volver a pendientes: piden confirmación aquí mismo -->
    @if (dialogo(); as d) {
      <div class="fixed inset-0 z-[1200] flex items-center justify-center bg-slate-900/50 p-4" (click)="cerrarDialogo()">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="pbc-dialogo-titulo"
          cdkTrapFocus
          [cdkTrapFocusAutoCapture]="true"
          (click)="$event.stopPropagation()"
          (keydown.escape)="cerrarDialogo()"
          class="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-xl dark:bg-slate-800"
        >
          <div class="border-b border-slate-200 px-5 py-4 dark:border-slate-700">
            <h3 id="pbc-dialogo-titulo" class="text-base font-semibold text-slate-900 dark:text-white">{{ tituloDialogo(d.accion) }}</h3>
            <p class="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Pago del {{ fecha(d.pago.fechaBanco) }} por {{ monto(d.pago.montoBanco) }} (Pb {{ d.pago.id }}).
              {{ descripcionDialogo(d.accion) }}
            </p>
          </div>
          <form class="space-y-4 px-5 py-4" (submit)="confirmarDialogo($event)">
            @if (d.accion === 'cambiarPeriodo') {
              <fieldset>
                <legend class="text-sm font-semibold text-slate-900 dark:text-white">Mes en que cuenta</legend>
                <div class="mt-2 space-y-1.5">
                  @for (opcion of periodosPosibles(d.pago); track opcion) {
                    <label class="flex items-center gap-2 text-sm text-slate-800 dark:text-slate-200">
                      <input type="radio" name="pbc-periodo" [value]="opcion" [checked]="periodoElegido() === opcion" (change)="periodoElegido.set(opcion)" class="h-4 w-4 text-blue-600 focus:ring-blue-500" />
                      {{ periodo(opcion) }}{{ opcion === d.pago.periodoBanco ? ' (actual)' : '' }}
                    </label>
                  }
                </div>
              </fieldset>
            }
            @if (d.accion !== 'restaurar') {
              <div>
                <label for="pbc-motivo" class="block text-sm font-semibold text-slate-900 dark:text-white">
                  Motivo <span class="font-normal text-slate-600 dark:text-slate-400">(obligatorio)</span>
                </label>
                <textarea
                  id="pbc-motivo"
                  rows="3"
                  maxlength="500"
                  required
                  [value]="motivo()"
                  (input)="motivo.set($any($event.target).value)"
                  class="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                ></textarea>
              </div>
            }
            @if (errorDialogo(); as texto) {
              <p role="alert" class="text-sm text-red-700 dark:text-red-300">{{ texto }}</p>
            }
            <div class="flex justify-end gap-2">
              <button type="button" (click)="cerrarDialogo()" class="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700">Cancelar</button>
              <button type="submit" [disabled]="!puedeConfirmarDialogo()" class="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-400 dark:focus-visible:ring-offset-slate-800">
                {{ guardando() ? 'Guardando...' : 'Confirmar' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    }

    <app-ajuste-pago-banco-dialog
      [pagoBancoId]="ajustePagoId()"
      [accionInicial]="ajusteAccion()"
      [contexto]="contexto"
      (cerrado)="onAjusteCerrado($event)"
    ></app-ajuste-pago-banco-dialog>
  `
})
export class PagosBancoClienteWidget implements OnChanges {
  private ajusteService = inject(AjusteConciliacionService);
  private bcpPagosService = inject(BcpPagosService);
  private consolidadoService = inject(ConsolidadoBancoService);

  @Input() documento: string | null = null;
  @Input() contexto: ContextoAjuste | null = null;
  /** Se suma desde la pantalla para volver a cargar la lista. */
  @Input() refresco = 0;
  @Input() esAdmin = false;
  /** Abrir la ficha de este pago apenas cargue (búsqueda por Pb). */
  @Input() abrirFichaDe: number | null = null;
  @Output() resolver = new EventEmitter<PagoBancoPorResolver>();
  /** Algo cambió en el cliente (la pantalla recarga el resumen del asesor). */
  @Output() cambio = new EventEmitter<string>();
  /** Lista cargada, para los avisos de la pantalla. */
  @Output() cargados = new EventEmitter<PagoBancoCliente[]>();

  readonly pagos = signal<PagoBancoCliente[]>([]);
  readonly cargando = signal(false);
  readonly error = signal<string | null>(null);
  readonly mensaje = signal<string | null>(null);
  readonly menuAbierto = signal<number | null>(null);

  readonly ajustePagoId = signal<number | null>(null);
  readonly ajusteAccion = signal<'ficha' | 'desconciliar'>('ficha');

  readonly dialogo = signal<{ accion: Accion; pago: PagoBancoCliente } | null>(null);
  readonly motivo = signal('');
  readonly periodoElegido = signal<string | null>(null);
  readonly guardando = signal(false);
  readonly errorDialogo = signal<string | null>(null);
  private origenDialogo: HTMLElement | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['documento'] || changes['refresco'] || changes['contexto']?.firstChange) {
      this.cargar();
    }
  }

  @HostListener('document:click')
  cerrarMenu(): void {
    this.menuAbierto.set(null);
  }

  @HostListener('document:keydown.escape')
  cerrarMenuConEscape(): void {
    if (this.menuAbierto() !== null) this.menuAbierto.set(null);
  }

  alternarMenu(pagoId: number, evento: Event): void {
    evento.stopPropagation();
    this.menuAbierto.set(this.menuAbierto() === pagoId ? null : pagoId);
  }

  opciones(pago: PagoBancoCliente): OpcionMenu[] {
    const a: AccionesPagoBanco = pago.acciones;
    const opciones: OpcionMenu[] = [];
    if (this.esAdmin) {
      opciones.push({ accion: 'ficha', label: 'Ver ficha', disponible: true, ayuda: 'Carga, conciliaciones, pagos enlazados e histórico.' });
      opciones.push({
        accion: 'desconciliar',
        label: 'Desconciliar...',
        disponible: a.desconciliar,
        ayuda: a.desconciliar ? 'Muestra lo que va a cambiar antes de aplicar.' : a.motivoNoDesconciliar,
        peligro: true
      });
    }
    opciones.push({
      accion: 'resolver',
      label: 'Resolver...',
      disponible: a.resolver,
      ayuda: a.resolver ? 'Corregir o registrar el pago del asesor para que calce.' : 'Solo para pagos que requieren revisión.'
    });
    opciones.push({
      accion: 'noCorresponde',
      label: 'No corresponde...',
      disponible: a.noCorresponde,
      ayuda: a.noCorresponde ? null : (a.desconciliar && this.esAdmin ? 'Está conciliado: usa Desconciliar y elige No corresponde.' : 'Solo para pagos que requieren revisión.')
    });
    if (a.restaurar) {
      opciones.push({ accion: 'restaurar', label: 'Volver a pendientes', disponible: true, ayuda: 'Deja de ser No corresponde y vuelve a revisión.' });
    }
    opciones.push({
      accion: 'cambiarPeriodo',
      label: 'Cambiar mes en que cuenta...',
      disponible: a.cambiarPeriodo,
      ayuda: a.cambiarPeriodo ? 'Al mes de su fecha o al anterior.' : 'No cuenta como recibido.'
    });
    return opciones;
  }

  ejecutar(accion: Accion, pago: PagoBancoCliente): void {
    this.menuAbierto.set(null);
    this.mensaje.set(null);
    switch (accion) {
      case 'ficha':
      case 'desconciliar':
        this.ajusteAccion.set(accion);
        this.ajustePagoId.set(pago.id);
        break;
      case 'resolver':
        this.resolver.emit({
          documento: this.documento || '',
          fechaBanco: aFechaIso(pago.fechaBanco),
          montoBanco: Number(pago.montoBanco ?? 0),
          numeroOperacion: pago.numeroOperacion,
          categoria: pago.categoria,
          motivo: null
        });
        break;
      default:
        this.abrirDialogo(accion, pago);
    }
  }

  onAjusteCerrado(evento: { huboCambios: boolean; documento: string | null }): void {
    this.ajustePagoId.set(null);
    if (evento.huboCambios) this.notificarCambio('Ajuste aplicado.');
  }

  // --- Diálogos simples ---

  private abrirDialogo(accion: Accion, pago: PagoBancoCliente): void {
    this.origenDialogo = document.activeElement as HTMLElement | null;
    this.motivo.set('');
    this.errorDialogo.set(null);
    this.periodoElegido.set(accion === 'cambiarPeriodo' ? this.periodosPosibles(pago).find(p => p !== pago.periodoBanco) ?? null : null);
    this.dialogo.set({ accion, pago });
  }

  cerrarDialogo(): void {
    if (this.guardando()) return;
    this.dialogo.set(null);
    this.origenDialogo?.focus();
    this.origenDialogo = null;
  }

  tituloDialogo(accion: Accion): string {
    switch (accion) {
      case 'noCorresponde': return 'Marcar que no corresponde';
      case 'restaurar': return 'Volver a pendientes';
      case 'cambiarPeriodo': return 'Cambiar el mes en que cuenta';
      default: return '';
    }
  }

  descripcionDialogo(accion: Accion): string {
    switch (accion) {
      case 'noCorresponde': return 'Se conserva, deja de estar pendiente y deja de contar en el cuadre.';
      case 'restaurar': return 'Vuelve a pendientes para resolverlo o reevaluarlo.';
      case 'cambiarPeriodo': return 'La fecha del banco no cambia; cambia el mes del cuadre y las comisiones.';
      default: return '';
    }
  }

  periodosPosibles(pago: PagoBancoCliente): string[] {
    const iso = aFechaIso(pago.fechaBanco);
    if (!iso) return [];
    const [anio, mes] = iso.split('-').map(Number);
    const propio = `${anio}${String(mes).padStart(2, '0')}`;
    const anterior = mes === 1 ? `${anio - 1}12` : `${anio}${String(mes - 1).padStart(2, '0')}`;
    return [propio, anterior];
  }

  puedeConfirmarDialogo(): boolean {
    const d = this.dialogo();
    if (!d || this.guardando()) return false;
    if (d.accion === 'restaurar') return true;
    if (!this.motivo().trim()) return false;
    return d.accion !== 'cambiarPeriodo' || (!!this.periodoElegido() && this.periodoElegido() !== d.pago.periodoBanco);
  }

  confirmarDialogo(evento: Event): void {
    evento.preventDefault();
    const d = this.dialogo();
    if (!d || !this.contexto || !this.puedeConfirmarDialogo()) return;

    this.guardando.set(true);
    this.errorDialogo.set(null);
    const motivo = this.motivo().trim();
    const peticion: Observable<{ exitoso?: boolean; mensaje?: string }> = d.accion === 'noCorresponde'
      ? this.bcpPagosService.marcarNoCorresponde(d.pago.id, motivo, this.contexto)
      : d.accion === 'restaurar'
        ? this.bcpPagosService.restaurarPendiente(d.pago.id, this.contexto)
        : this.consolidadoService.cambiarPeriodoPago(
          d.pago.id,
          { ...this.contexto, periodo: this.periodoElegido()! },
          { periodo: this.periodoElegido()!, motivo }
        );

    peticion.subscribe({
      next: respuesta => {
        this.guardando.set(false);
        if (respuesta?.exitoso === false) {
          this.errorDialogo.set(respuesta.mensaje || 'No se pudo guardar');
          return;
        }
        this.dialogo.set(null);
        this.origenDialogo = null;
        this.notificarCambio(respuesta?.mensaje || 'Cambio guardado.');
      },
      error: err => {
        this.guardando.set(false);
        this.errorDialogo.set(err?.error?.mensaje || err?.error?.message || 'No se pudo guardar');
      }
    });
  }

  private notificarCambio(texto: string): void {
    this.cargar(texto);
    if (this.documento) this.cambio.emit(this.documento);
  }

  private cargar(mensajeTrasCargar: string | null = null): void {
    const documento = this.documento?.trim();
    if (!documento || !this.contexto) {
      this.pagos.set([]);
      return;
    }
    this.cargando.set(true);
    this.error.set(null);
    this.ajusteService.listarPagosBancoCliente(documento, this.contexto).subscribe({
      next: pagos => {
        this.cargando.set(false);
        this.pagos.set(pagos);
        this.mensaje.set(mensajeTrasCargar);
        this.cargados.emit(pagos);
        const ficha = this.abrirFichaDe;
        if (ficha && this.esAdmin && pagos.some(p => p.id === ficha)) {
          this.abrirFichaDe = null;
          this.ajusteAccion.set('ficha');
          this.ajustePagoId.set(ficha);
        }
      },
      error: err => {
        this.cargando.set(false);
        this.error.set(err?.error?.mensaje || err?.error?.message || 'No se pudieron cargar los pagos del banco.');
      }
    });
  }

  periodoDistinto(pago: PagoBancoCliente): boolean {
    const iso = aFechaIso(pago.fechaBanco);
    return !!pago.periodoBanco && !!iso && pago.periodoBanco !== iso.slice(0, 7).replace('-', '');
  }

  etiqueta(categoria: string | null): string {
    return infoCategoria(categoria).label;
  }

  pill(categoria: string | null): string {
    return TONO_PILL[infoCategoria(categoria).tono];
  }

  fecha(valor: string | null | undefined): string {
    return fechaCorta(valor);
  }

  monto(valor: number | null | undefined): string {
    return montoSoles(valor);
  }

  periodo(valor: string | null | undefined): string {
    return valor && valor.length === 6 ? `${valor.slice(4, 6)}/${valor.slice(0, 4)}` : '-';
  }
}
