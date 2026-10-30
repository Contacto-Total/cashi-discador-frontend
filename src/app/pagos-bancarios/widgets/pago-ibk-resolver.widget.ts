import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { Observable, forkJoin } from 'rxjs';
import { BotonDirective } from '../../shared/ui/boton.directive';
import { FormatService } from '@/shared/services/format.service';
import { BcpPagosService } from '../services/bcp-pagos.service';
import { CorreccionPagosService } from '../services/correccion-pagos.service';
import { CuotaValidaTipificar } from '../models/correccion-pagos.model';
import { MOTIVOS_CORTOS, MOTIVOS_REVISION, aFechaIso, fechaCorta } from '../models/categoria-pago';
import { PagoDelAsesor, agruparPagosDelAsesor, cuotasAmpliables, cuotasPromesaSistema } from '../models/resolver-pago';

/** Pago bancario que se resuelve; sin `id` todavía no se guardó (viene de la revisión de la carga). */
export interface PagoIbkPorResolver {
  id: number | null;
  documento: string;
  cuenta: string | null;
  producto: string | null;
  moneda: string | null;
  fechaBanco: string;
  montoBanco: number;
  motivo: string | null;
}

export interface ContextoIbk {
  tenantId: number;
  carteraId: number;
  subcarteraId: number;
}

type Opcion = 'corregir' | 'crear' | 'ampliar' | 'promesa' | 'voluntario' | 'nocorr';

const OPCIONES: { id: Opcion; titulo: string; ayuda: string; accion: string }[] = [
  { id: 'corregir', titulo: 'Corregir pago', ayuda: 'Fecha y monto como los trae el banco', accion: 'Corregir y conciliar' },
  { id: 'crear', titulo: 'Crear pago', ayuda: 'El asesor no registró la cancelación', accion: 'Crear pago' },
  { id: 'ampliar', titulo: 'Ampliar vencimiento', ayuda: 'Venció y el pago llegó hasta 3 días después', accion: 'Ampliar y crear pago' },
  { id: 'promesa', titulo: 'Promesa del sistema', ayuda: 'Venció hace más de 3 días; el pago va al sistema', accion: 'Crear promesa del sistema' },
  { id: 'voluntario', titulo: 'Pago voluntario', ayuda: 'No corresponde a ninguna promesa', accion: 'Registrar como voluntario' },
  { id: 'nocorr', titulo: 'No corresponde', ayuda: 'Se conserva y deja de estar pendiente', accion: 'Marcar que no corresponde' }
];

/**
 * Resolver un pago bajo su fila: datos del banco y del asesor con el motivo, las acciones que aplican a ese pago
 * y los campos con sus botones. Solo ofrece lo que se puede hacer; el resto queda en Corrección de pagos.
 */
@Component({
  selector: 'app-pago-ibk-resolver',
  standalone: true,
  imports: [FormsModule, NgClass, BotonDirective],
  host: { class: '@container/pnl block' },
  template: `
    <div class="flex flex-col gap-3.5 pt-2">
      <div class="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.5fr)] gap-x-6 gap-y-3 border-b border-border pb-3.5 @max-[46rem]/pnl:grid-cols-2">
        <div class="min-w-0">
          <span class="block text-[.75rem] text-muted-foreground">Pago del banco</span>
          <span class="block text-[.9375rem] font-bold">{{ monto(pago.montoBanco) }}</span>
          <span class="block text-[.75rem] text-muted-foreground">{{ fecha(pago.fechaBanco) }}, CJ {{ pago.cuenta }}, {{ pago.producto }}</span>
        </div>
        <div class="min-w-0">
          <span class="block text-[.75rem] text-muted-foreground">Pago del asesor</span>
          @if (pagos().length > 1) {
            <span class="block text-[.9375rem] font-bold">{{ pagos().length }} pagos</span>
            <span class="block text-[.75rem] text-muted-foreground">{{ fechasDeLosPagos() }}</span>
          } @else if (pagos()[0]; as p) {
            <span class="block text-[.9375rem] font-bold">{{ monto(p.total) }}</span>
            <span class="block text-[.75rem] text-muted-foreground">{{ fecha(p.fecha) }}{{ p.asesor ? ', ' + p.asesor : '' }}</span>
          } @else {
            <span class="block text-[.9375rem] font-bold">—</span>
            <span class="block text-[.75rem] text-muted-foreground">Sin pago registrado</span>
          }
        </div>
        <div class="min-w-0 @max-[46rem]/pnl:col-span-full">
          <span class="block text-[.75rem] text-muted-foreground">Motivo</span>
          <span class="block text-[.9375rem] font-bold">{{ motivoCorto() }}</span>
          <span class="block text-[.75rem] text-muted-foreground">{{ motivoAccion() }}</span>
        </div>
      </div>

      @if (cargando()) {
        <p class="m-0 text-[.875rem] text-muted-foreground">Cargando…</p>
      } @else if (errorCarga(); as e) {
        <p role="alert" class="m-0 text-[.875rem] font-medium text-(--ro)">{{ e }}</p>
      } @else {
        <div class="flex flex-wrap gap-2" role="radiogroup" aria-label="Acción">
          @for (o of opciones(); track o.id) {
            <button type="button" role="radio" [attr.aria-checked]="opcion() === o.id" [title]="o.ayuda" (click)="elegir(o.id)"
                    class="font-cashi inline-flex cursor-pointer items-center gap-2 rounded-[.625rem] border! bg-card px-3 py-[.4375rem] text-left text-foreground hover:bg-muted"
                    [ngClass]="opcion() === o.id ? 'border-ring! shadow-[0_0_0_1px_var(--ring)]' : 'border-border!'">
              <span class="size-4 flex-none rounded-full" [ngClass]="opcion() === o.id ? 'border-[5px] border-ring' : 'border-[1.5px] border-(--campo-ln)'"></span>
              <span class="text-[.875rem] font-semibold">{{ o.titulo }}</span>
            </button>
          }
        </div>

        <div class="flex min-w-0 flex-wrap items-end gap-x-4 gap-y-3 border-t border-border pt-3.5">
          <div class="flex min-w-0 flex-auto flex-wrap items-end gap-3">
            @switch (opcion()) {
              @case ('corregir') {
                @if (pagos().length > 1) {
                  <div [class]="CUOTA">
                    <label for="ibk-pago" [class]="ETIQUETA">Pago</label>
                    <select id="ibk-pago" [class]="CAMPO" [ngModel]="pagoElegido()" (ngModelChange)="elegirPago($event)">
                      @for (p of pagos(); track p.clave) {
                        <option [value]="p.clave">{{ monto(p.total) }}, {{ fecha(p.fecha) }}{{ p.asesor ? ', ' + p.asesor : '' }}</option>
                      }
                    </select>
                  </div>
                }
                <div [class]="DATO">
                  <label for="ibk-fecha" [class]="ETIQUETA">Fecha de pago</label>
                  <input id="ibk-fecha" type="date" [class]="CAMPO" [(ngModel)]="fechaPago">
                </div>
                <div [class]="DATO">
                  <label for="ibk-monto" [class]="ETIQUETA">Monto</label>
                  <input id="ibk-monto" type="number" step="0.01" min="0" [class]="CAMPO" [(ngModel)]="montoPago">
                </div>
                <button type="button" appBoton="secundario" appBotonAlto="chico" class="mb-1 flex-none" (click)="usarBanco()">Usar fecha y monto del banco</button>
              }
              @case ('nocorr') {
                <div class="flex min-w-0 flex-[1_1_100%] flex-col gap-[.3125rem]">
                  <label for="ibk-motivo" [class]="ETIQUETA">Motivo</label>
                  <textarea id="ibk-motivo" rows="1" [class]="CAMPO + ' min-h-11 resize-y'" [(ngModel)]="motivoNoCorresponde"></textarea>
                </div>
              }
              @default {
                @if (cuotasDeLaOpcion().length) {
                  <div [class]="CUOTA">
                    <label for="ibk-cuota" [class]="ETIQUETA">{{ opcion() === 'crear' ? 'Cuota' : 'Cuota vencida' }}</label>
                    <select id="ibk-cuota" [class]="CAMPO" [(ngModel)]="cuotaId">
                      @for (c of cuotasDeLaOpcion(); track c.cuotaId) {
                        <option [ngValue]="c.cuotaId">Cuota {{ c.numeroCuota }}, vence {{ fecha(c.fechaPromesa) }}, {{ monto(c.montoPromesa) }}</option>
                      }
                    </select>
                  </div>
                }
                <div [class]="DATO">
                  <label for="ibk-fecha" [class]="ETIQUETA">{{ opcion() === 'ampliar' ? 'Nueva fecha de vencimiento' : 'Fecha de pago' }}</label>
                  <input id="ibk-fecha" type="date" [class]="CAMPO" [(ngModel)]="fechaPago">
                </div>
                <div [class]="DATO">
                  <label for="ibk-monto" [class]="ETIQUETA">{{ opcion() === 'ampliar' ? 'Monto del banco' : 'Monto' }}</label>
                  <input id="ibk-monto" type="number" step="0.01" min="0" [class]="CAMPO" [(ngModel)]="montoPago">
                </div>
              }
            }
          </div>

          <div class="ml-auto flex flex-wrap items-center justify-end gap-2" [ngClass]="conCasilla() ? 'flex-[1_1_100%]' : ''">
            @if (opcion() === 'ampliar') {
              <label class="mr-auto flex items-center gap-2 text-[.875rem]">
                <input type="checkbox" class="size-4 accent-ring" [(ngModel)]="delAsesor">El pago corresponde al asesor original
              </label>
            }
            @if (opcion() === 'voluntario') {
              <label class="mr-auto flex items-center gap-2 text-[.875rem]">
                <input type="checkbox" class="size-4 accent-ring" [(ngModel)]="confirmaVoluntario">Sin promesa asociada
              </label>
            }
            <button type="button" appBoton="secundario" class="flex-none px-4!" [disabled]="guardando()" (click)="cerrado.emit(false)">Cancelar</button>
            <button type="button" appBoton class="flex-none px-4!" [disabled]="guardando()" (click)="aplicar()">{{ accion() }}</button>
          </div>
          @if (error(); as e) {
            <p role="alert" class="m-0 flex-[1_1_100%] text-[.75rem] font-medium text-(--ro)">{{ e }}</p>
          }
        </div>
      }
    </div>
  `
})
export class PagoIbkResolverWidget implements OnChanges {
  @Input({ required: true }) pago!: PagoIbkPorResolver;
  @Input({ required: true }) contexto!: ContextoIbk;
  /** true si se aplicó una acción. */
  @Output() cerrado = new EventEmitter<boolean>();
  /** Terminó de cargar: el panel ya tiene su alto. */
  @Output() listo = new EventEmitter<void>();

  readonly ETIQUETA = 'm-0! text-[.75rem]! leading-[1.5]! font-medium! text-foreground/80!';
  /** El tema antiguo fija con !important el aspecto de los campos: de ahí los `!`. */
  readonly CAMPO = 'font-cashi m-0! h-10! w-full min-w-0 rounded-[.625rem]! border! border-(--campo-ln)! bg-(--campo)! px-2.5! py-2! text-[.875rem]! leading-[1.5]! text-foreground! outline-none '
    + 'focus:border-ring! focus:shadow-[0_0_0_3px_rgb(16_185_129/.3)]';
  readonly DATO = 'flex min-w-0 flex-[0_1_9.5rem] flex-col gap-[.3125rem]';
  readonly CUOTA = 'flex min-w-0 flex-[0_1_19rem] flex-col gap-[.3125rem]';

  private readonly fmt = inject(FormatService);
  private readonly correccion = inject(CorreccionPagosService);
  private readonly bcp = inject(BcpPagosService);

  cargando = signal(true);
  errorCarga = signal<string | null>(null);
  guardando = signal(false);
  error = signal<string | null>(null);

  pagos = signal<PagoDelAsesor[]>([]);
  private cuotas = signal<CuotaValidaTipificar[]>([]);
  opcion = signal<Opcion>('voluntario');
  pagoElegido = signal('');

  fechaPago = '';
  montoPago: number | null = null;
  cuotaId: number | null = null;
  delAsesor = true;
  confirmaVoluntario = false;
  motivoNoCorresponde = '';

  private readonly ampliables = computed(() => cuotasAmpliables(this.cuotas(), aFechaIso(this.pago.fechaBanco)));
  private readonly deSistema = computed(() => cuotasPromesaSistema(this.cuotas(), aFechaIso(this.pago.fechaBanco)));

  opciones = computed(() => {
    const aplica: Record<Opcion, boolean> = {
      corregir: this.pagos().length > 0,
      crear: this.cuotas().length > 0,
      ampliar: this.ampliables().length > 0,
      promesa: this.deSistema().length > 0,
      voluntario: true,
      nocorr: this.pago.id !== null
    };
    return OPCIONES.filter(o => aplica[o.id]);
  });

  cuotasDeLaOpcion = computed(() => {
    const opcion = this.opcion();
    if (opcion === 'ampliar') return this.ampliables();
    if (opcion === 'promesa') return this.deSistema();
    return opcion === 'crear' ? this.cuotas() : [];
  });

  accion = computed(() => OPCIONES.find(o => o.id === this.opcion())?.accion ?? '');
  conCasilla = computed(() => this.opcion() === 'ampliar' || this.opcion() === 'voluntario');
  motivoCorto = computed(() => (this.pago.motivo && MOTIVOS_CORTOS[this.pago.motivo]) || 'Revisión manual');
  motivoAccion = computed(() => (this.pago.motivo && MOTIVOS_REVISION[this.pago.motivo]?.accion) || 'Revisar el pago contra los datos del cliente.');
  fechasDeLosPagos = computed(() => this.pagos().map(p => this.fecha(p.fecha).slice(0, 5)).join(' y '));

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pago']) this.cargar();
  }

  elegir(opcion: Opcion): void {
    this.opcion.set(opcion);
    this.error.set(null);
    this.prellenar();
  }

  elegirPago(clave: string): void {
    this.pagoElegido.set(clave);
    this.prellenar();
  }

  usarBanco(): void {
    this.fechaPago = aFechaIso(this.pago.fechaBanco);
    this.montoPago = Number(this.pago.montoBanco);
  }

  aplicar(): void {
    const opcion = this.opcion();
    if (opcion === 'nocorr') {
      const motivo = this.motivoNoCorresponde.trim();
      if (!motivo) return this.error.set('Escribe el motivo.');
      return this.ejecutar(this.bcp.marcarNoCorresponde(this.pago.id!, motivo, this.contexto), 'No se pudo marcar el pago.');
    }
    if (!this.fechaPago || !this.montoPago || this.montoPago <= 0) return this.error.set('Indica la fecha y el monto.');
    const datos = { documento: this.pago.documento, fechaPago: this.fechaPago, montoPago: Number(this.montoPago) };

    if (opcion === 'corregir') {
      const pago = this.pagos().find(p => p.clave === this.pagoElegido());
      if (!pago) return;
      return this.ejecutar(this.correccion.corregirPago(pago.pagoCuotaId, this.contexto, { fechaPago: datos.fechaPago, montoPago: datos.montoPago }), 'No se pudo corregir el pago.');
    }
    if (opcion === 'voluntario') {
      if (!this.confirmaVoluntario) return this.error.set('Confirma que no tiene promesa asociada.');
      return this.ejecutar(this.correccion.crearPagoVoluntarioSistema(this.contexto, datos), 'No se pudo registrar el pago voluntario.');
    }
    if (!this.cuotaId) return this.error.set('Elige la cuota.');
    if (opcion === 'crear') return this.ejecutar(this.correccion.crearCancelacion(this.cuotaId, this.contexto, datos), 'No se pudo crear el pago.');
    if (opcion === 'ampliar') {
      return this.ejecutar(this.correccion.ampliarVencimiento(this.cuotaId, this.contexto, { ...datos, pagoCorrespondeAsesor: this.delAsesor }), 'No se pudo ampliar el vencimiento.');
    }
    this.ejecutar(this.correccion.crearPromesaSistemaPagoBanco(this.cuotaId, this.contexto, datos), 'No se pudo crear la promesa del sistema.');
  }

  fecha(valor: unknown): string {
    return fechaCorta(valor);
  }

  monto(valor: number | null | undefined): string {
    const simbolo = this.pago.moneda === 'USD' ? 'US$' : 'S/';
    return `${simbolo} ${this.fmt.number(Number(valor ?? 0), { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  private cargar(): void {
    const pedido = { documento: this.pago.documento, ...this.contexto };
    this.cargando.set(true);
    this.errorCarga.set(null);
    forkJoin({
      pagos: this.correccion.buscarPendientesConciliacion(pedido),
      cuotas: this.correccion.buscarCuotasValidasTipificar(pedido)
    }).subscribe({
      next: ({ pagos, cuotas }) => {
        const delAsesor = agruparPagosDelAsesor(pagos || []);
        this.pagos.set(delAsesor);
        this.cuotas.set(cuotas || []);
        this.pagoElegido.set(delAsesor[0]?.clave ?? '');
        this.cargando.set(false);
        this.elegir(this.opciones()[0].id);
        this.listo.emit();
      },
      error: () => {
        this.errorCarga.set('No se pudieron cargar los pagos y cuotas del cliente.');
        this.cargando.set(false);
      }
    });
  }

  /** Corregir parte del pago del asesor; lo demás viene con la fecha y el monto del banco. */
  private prellenar(): void {
    this.cuotaId = this.cuotasDeLaOpcion()[0]?.cuotaId ?? null;
    const pago = this.pagos().find(p => p.clave === this.pagoElegido());
    if (this.opcion() === 'corregir' && pago) {
      this.fechaPago = pago.fecha;
      this.montoPago = pago.total;
      return;
    }
    this.usarBanco();
  }

  private ejecutar(accion: Observable<unknown>, mensajeError: string): void {
    this.guardando.set(true);
    this.error.set(null);
    accion.subscribe({
      next: () => {
        this.guardando.set(false);
        this.cerrado.emit(true);
      },
      error: err => {
        this.guardando.set(false);
        this.error.set(err?.error?.message || err?.error?.mensaje || err?.error?.error || mensajeError);
      }
    });
  }
}
