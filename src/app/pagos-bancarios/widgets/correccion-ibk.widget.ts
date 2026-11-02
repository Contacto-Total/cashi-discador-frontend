import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, computed, inject, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BotonDirective } from '../../shared/ui/boton.directive';
import { TituloTarjetaComponent } from '../../shared/ui/titulo-tarjeta.component';
import { FormatService } from '@/shared/services/format.service';
import { ToastService } from '../../shared/services/toast.service';
import {
  ContextoAjuste,
  DestinoDesconciliacion,
  ETIQUETAS_TIPO_CAMBIO,
  HistoricoCorreccion,
  PagoBancoCliente,
  VistaPreviaAjuste
} from '../models/ajuste-conciliacion.model';
import { CuotaResumenConciliacion, PromesaResumenConciliacion, ResumenConciliacionCliente } from '../models/bcp-archivo.model';
import { aFechaIso, fechaCorta, infoCategoria } from '../models/categoria-pago';
import { CuotaValidaTipificar } from '../models/correccion-pagos.model';
import { DIAS_AMPLIACION } from '../models/resolver-pago';
import { AjusteConciliacionService } from '../services/ajuste-conciliacion.service';
import { BcpPagosService } from '../services/bcp-pagos.service';
import { ConsolidadoBancoService } from '../services/consolidado-banco.service';
import { CorreccionPagosService } from '../services/correccion-pagos.service';
import { CAMPO_IBK, CRECE_IBK, DATO_IBK, ETIQUETA_IBK, OPCION_IBK, PILL_IBK } from './ibk-estilos';
import { VoucherAbierto } from './voucher-lado.widget';

type Pestana = 'banco' | 'promesas' | 'cancelaciones' | 'historico';
type OpcionBanco = 'resolver' | 'noCorresponde' | 'restaurar' | 'desconciliar' | 'voluntario' | 'mes';
type OpcionCuota = 'modificar' | 'eliminar' | 'regularizar' | 'crear' | 'ampliar' | 'promesa' | 'eliminarVoluntario';

/** Una cuota de la tabla de promesas, con lo que se puede hacer sobre ella. */
interface FilaCuota {
  clave: string;
  promesa: PromesaResumenConciliacion;
  cuota: CuotaResumenConciliacion;
  sinVerificar: CuotaResumenConciliacion['pagos'][number] | null;
  verificado: CuotaResumenConciliacion['pagos'][number] | null;
  voluntarioSinBanco: boolean;
}

const DESTINOS: { valor: DestinoDesconciliacion; titulo: string; detalle: string }[] = [
  { valor: 'PENDIENTE_RETENIDO', titulo: 'Dejarlo pendiente, retenido', detalle: 'Vuelve a pendientes y no se enlaza solo: se vuelve a evaluar cuando se corrija el cliente.' },
  { valor: 'NO_CORRESPONDE', titulo: 'No corresponde', detalle: 'El pago no es de la gestión de la empresa. Deja de contar en el cuadre; se puede volver a pendientes.' },
  { valor: 'DUPLICADO', titulo: 'Duplicado', detalle: 'El banco envió el mismo pago dos veces. Queda como No corresponde, con el motivo marcado como duplicado.' }
];

const TITULOS_CUOTA: Record<OpcionCuota, string> = {
  modificar: 'Modificar pago', eliminar: 'Eliminar pago', regularizar: 'Regularizar fecha',
  crear: 'Crear pago', ampliar: 'Ampliar vencimiento', promesa: 'Promesa del sistema', eliminarVoluntario: 'Eliminar pago voluntario'
};

function sumarDias(fechaIso: string, dias: number): string {
  const [anio, mes, dia] = fechaIso.split('-').map(Number);
  return new Date(Date.UTC(anio, mes - 1, dia + dias)).toISOString().slice(0, 10);
}

function finDeMes(fechaIso: string): string {
  const [anio, mes] = fechaIso.split('-').map(Number);
  return new Date(Date.UTC(anio, mes, 0)).toISOString().slice(0, 10);
}

/**
 * Corrección de pagos de un cliente dentro de la vista de Interbank: pagos del banco, promesas, cancelaciones e histórico.
 * Las acciones se abren bajo su fila y usan los mismos servicios que la pantalla general. No navega a otra ruta.
 */
@Component({
  selector: 'app-correccion-ibk',
  standalone: true,
  imports: [NgClass, FormsModule, LucideAngularModule, BotonDirective, TituloTarjetaComponent],
  host: { class: 'flex min-h-0 flex-1 flex-col' },
  template: `
    <div class="mb-4 flex flex-none flex-wrap items-center gap-3">
      <button type="button" appBoton="secundario" appBotonAlto="chico" (click)="volver.emit()">
        <lucide-angular name="arrow-left" [size]="14"></lucide-angular>Pagos bancarios
      </button>
      @if (!angosto) {
        <app-titulo-tarjeta titulo="Corrección de pagos"></app-titulo-tarjeta>
      }
      @if (documento()) {
        <div class="ml-auto flex gap-[.1875rem] rounded-lg bg-muted p-[.1875rem]" role="group" aria-label="Datos del cliente">
          @for (t of PESTANAS; track t.id) {
            <button type="button" class="font-cashi cursor-pointer rounded-md border-0 px-3 py-[.4375rem] text-[.875rem] font-medium transition-colors duration-150 max-[81rem]:px-2"
                    [ngClass]="pestana() === t.id ? 'bg-(--seg-activo) text-foreground shadow-[0_1px_2px_rgb(0_0_0/.08)]' : 'bg-transparent text-foreground/60'"
                    [attr.aria-pressed]="pestana() === t.id" (click)="elegirPestana(t.id)">{{ t.titulo }}</button>
          }
        </div>
      }
    </div>

    <div class="mb-[.75rem] flex flex-none flex-wrap items-center gap-3 rounded-xl border border-border px-4 py-3">
      @if (documento()) {
        <div class="min-w-40 flex-1">
          <span class="block font-semibold">{{ resumen()?.nombreCliente || documento() }}</span>
          <span class="block text-[.75rem] text-muted-foreground">DNI {{ documento() }}</span>
          @if (avisos().length) {
            <div class="mt-1.5 flex flex-wrap gap-1.5">
              @for (a of avisos(); track a.texto) {
                <button type="button" class="font-cashi inline-flex cursor-pointer items-center rounded-full border! border-(--am-ln)! bg-(--am-bg) px-2.5 py-0.5 text-[.75rem] font-semibold text-(--am)" (click)="elegirPestana(a.pestana)">{{ a.texto }}</button>
              }
            </div>
          }
        </div>
      }
      <label class="relative ml-auto block min-w-44 flex-[0_1_17rem]">
        <lucide-angular name="search" [size]="16" class="pointer-events-none absolute top-1/2 left-2.5 flex size-4 -translate-y-1/2 text-muted-foreground [&>svg]:static! [&>svg]:transform-none! [&>svg]:translate-none!"></lucide-angular>
        <input id="ibk-buscar-cliente" [class]="CAMPO + ' pl-[2.125rem]!'" aria-label="DNI o número de pago" placeholder="DNI o número de pago" [(ngModel)]="textoBusqueda" (keydown.enter)="buscar()">
      </label>
      <button type="button" appBoton="secundario" class="h-[2.375rem] flex-none px-4!" [disabled]="buscando()" (click)="buscar()">Buscar</button>
      @if (errorBusqueda(); as e) {
        <p role="alert" class="m-0 flex-[1_1_100%] text-[.75rem] font-medium text-(--ro)">{{ e }}</p>
      }
    </div>

    <div class="-mx-8 min-h-0 flex-1 overflow-y-auto px-8">
      @if (!documento()) {
        <div class="mt-[.75rem] rounded-xl border border-dashed border-(--campo-ln) px-4 py-8 text-center text-muted-foreground">Busca un cliente por DNI o número de pago</div>
      } @else if (cargando()) {
        <p class="m-0 px-2 py-4 text-muted-foreground">Cargando…</p>
      } @else if (errorCarga(); as e) {
        <p role="alert" class="m-0 mt-[.75rem] rounded-[.625rem] border border-(--ro-ln) bg-(--ro-bg) px-3 py-2.5 font-medium text-(--ro)">{{ e }}</p>
      } @else {
        @switch (pestana()) {
          @case ('banco') {
            <div [class]="rejillaBanco() + ' border-b border-border px-2 py-2.5 text-[.75rem] font-medium text-muted-foreground'">
              <span>Fecha banco</span><span>Monto</span><span>Estado</span><span>Enlazado a</span>
              @if (!angosto) { <span>Carga</span> }
              <span></span>
            </div>
            @for (p of pagos(); track p.id) {
              <div [class]="rejillaBanco() + ' px-2 py-[.5625rem]'" [ngClass]="abierta() === 'b' + p.id ? '' : 'border-b border-border'">
                <span>{{ fecha(p.fechaBanco) }}</span>
                <span class="font-semibold">{{ monto(p.montoBanco) }}</span>
                <div class="flex min-w-0 flex-col items-start">
                  <span [class]="PILL + ' ' + pillDe(p)">{{ estadoDe(p) }}</span>
                </div>
                <span class="min-w-0 truncate">{{ enlazadoA(p) }}</span>
                @if (!angosto) {
                  <div class="min-w-0">
                    <span class="block truncate">{{ p.nombreArchivo || '—' }}</span>
                    <span class="block text-[.75rem] text-muted-foreground">{{ fecha(p.fechaCarga) }}</span>
                  </div>
                }
                <div class="text-right">
                  <button type="button" appBoton="secundario" appBotonAlto="chico" [attr.aria-expanded]="abierta() === 'b' + p.id" (click)="alternar('b' + p.id)">Acciones</button>
                </div>
              </div>
              @if (abierta() === 'b' + p.id) {
                <div class="flex flex-col gap-3.5 border-b border-border px-2 pt-2 pb-5">
                  <div [class]="rejillaBanco() + ' items-start! border-b border-border pb-3.5'">
                    <div class="min-w-0" [style.grid-column]="columnasBanco()[0]">
                      <span class="block text-[.75rem] text-muted-foreground">Historial</span>
                      <span class="block font-bold">{{ p.revisionManual ? 'Revisión manual' : 'Sin cambios manuales' }}</span>
                    </div>
                    <div class="min-w-0" [style.grid-column]="columnasBanco()[1]">
                      <span class="block text-[.75rem] text-muted-foreground">Asesor</span>
                      <span class="block font-bold">{{ p.enlaces[0]?.agente || 'Sin pago del asesor' }}</span>
                    </div>
                    <div class="min-w-0" [style.grid-column]="columnasBanco()[2]">
                      <span class="block text-[.75rem] text-muted-foreground">Cuenta en</span>
                      <span class="block font-bold">{{ periodo(p.periodoBanco) }}</span>
                    </div>
                  </div>

                  <div class="flex items-start justify-between gap-3">
                    <div class="flex min-w-0 flex-1 flex-wrap gap-2" role="radiogroup" aria-label="Acción">
                      @for (o of opcionesBanco(p); track o.id) {
                        <button type="button" role="radio" [class]="OPCION" [attr.aria-checked]="opcion() === o.id" [ngClass]="opcion() === o.id ? 'border-ring! shadow-[0_0_0_1px_var(--ring)]' : 'border-border!'" (click)="elegirBanco(o.id, p)">
                          <span class="size-4 flex-none rounded-full" [ngClass]="opcion() === o.id ? 'border-[5px] border-ring' : 'border-[1.5px] border-(--campo-ln)'"></span>
                          <span class="text-[.875rem] font-semibold">{{ o.titulo }}</span>
                        </button>
                      }
                    </div>
                    @if (esAdmin) {
                      <div class="flex min-h-[2.375rem] flex-none items-center">
                        <button type="button" appBoton="secundario" appBotonAlto="chico" (click)="ficha.emit(p.id)">Ver ficha</button>
                      </div>
                    }
                  </div>

                  @if (opcion()) {
                    <div class="flex min-w-0 flex-wrap items-end gap-3 border-t border-border pt-3.5">
                      @if (previa(); as v) {
                        <div class="flex-[1_1_100%] rounded-lg bg-muted px-3 py-2.5 text-[.8125rem] leading-[1.45]">
                          <span class="mb-[.1875rem] block font-semibold">Qué va a cambiar</span>
                          <ul class="m-0 pl-4">
                            @for (t of cambiosDe(v); track t) { <li>{{ t }}</li> }
                          </ul>
                          @for (b of v.bloqueos; track b) { <span class="mt-[.25rem] block font-medium text-(--ro)">{{ b }}</span> }
                          @for (a of v.avisos; track a) { <span class="mt-[.25rem] block text-muted-foreground">{{ a }}</span> }
                          @if (destinoElegido(); as d) { <span class="mt-[.25rem] block text-[.75rem] text-muted-foreground">{{ d }}</span> }
                        </div>
                      }
                      @if (opcion() === 'resolver') {
                        <p class="m-0 min-w-0 flex-auto text-[.8125rem] text-muted-foreground">Corrige el pago del asesor en Promesas y pagos: al guardar se vuelve a comparar con el banco.</p>
                        <div class="flex gap-2">
                          <button type="button" appBoton class="h-[2.375rem] flex-none px-4!" (click)="elegirPestana('promesas')">Ir a Promesas y pagos</button>
                          <button type="button" appBoton="secundario" class="h-[2.375rem] flex-none px-4!" (click)="cancelarOpcion()">Cancelar</button>
                        </div>
                      } @else if (opcion() === 'desconciliar' && !p.acciones.desconciliar) {
                        <p role="alert" class="m-0 min-w-0 flex-auto text-[.8125rem] font-medium text-(--ro)">No se puede desconciliar: {{ p.acciones.motivoNoDesconciliar }}</p>
                        <button type="button" appBoton="secundario" class="h-[2.375rem] flex-none px-4!" (click)="cancelarOpcion()">Cancelar</button>
                      } @else {
                        <div class="flex min-w-0 flex-auto items-end gap-3">
                          @if (opcion() === 'desconciliar') {
                            <div class="flex min-w-36 flex-[0_1_19rem] flex-col gap-[.3125rem]">
                              <label for="ibk-destino" [class]="ETIQUETA">Qué pasa con el pago del banco</label>
                              <select id="ibk-destino" [class]="CAMPO" [(ngModel)]="destino">
                                <option value="">Selecciona</option>
                                @for (d of DESTINOS; track d.valor) { <option [value]="d.valor">{{ d.titulo }}</option> }
                              </select>
                            </div>
                          }
                          @if (opcion() === 'mes') {
                            <div [class]="DATO">
                              <label for="ibk-periodo" [class]="ETIQUETA">Mes en que cuenta</label>
                              <select id="ibk-periodo" [class]="CAMPO" [(ngModel)]="periodoElegido">
                                @for (m of periodosDe(p); track m) { <option [value]="m">{{ periodo(m) }}</option> }
                              </select>
                            </div>
                          }
                          @if (opcion() !== 'restaurar') {
                            <div [class]="CRECE">
                              <label for="ibk-motivo-corr" [class]="ETIQUETA">Motivo</label>
                              <input id="ibk-motivo-corr" [class]="CAMPO" [(ngModel)]="motivo">
                            </div>
                          }
                        </div>
                        @if (opcion() === 'desconciliar' || opcion() === 'voluntario') {
                          <label class="flex flex-[1_1_100%] items-center gap-2 text-[.875rem]">
                            <input type="checkbox" class="size-4 accent-ring" [(ngModel)]="revisado">Revisé lo que va a cambiar. Esta acción no se deshace con un botón.
                          </label>
                        }
                        <div class="flex flex-wrap items-center gap-2">
                          <button type="button" appBoton class="h-[2.375rem] flex-none px-4!" [disabled]="guardando() || previa()?.ejecutable === false" (click)="aplicarBanco(p)">{{ tituloBanco() }}</button>
                          <button type="button" appBoton="secundario" class="h-[2.375rem] flex-none px-4!" [disabled]="guardando()" (click)="cancelarOpcion()">Cancelar</button>
                        </div>
                      }
                      @if (error(); as e) {
                        <p role="alert" class="m-0 flex-[1_1_100%] text-[.75rem] font-medium text-(--ro)">{{ e }}</p>
                      }
                    </div>
                  }
                </div>
              }
            } @empty {
              <div class="mt-[.75rem] rounded-xl border border-dashed border-(--campo-ln) px-4 py-8 text-center text-muted-foreground">Sin pagos del banco para este cliente</div>
            }
          }

          @case ('promesas') {
            <div class="mb-[.5rem] flex justify-end">
              <button type="button" appBoton="secundario" appBotonAlto="chico" [attr.aria-expanded]="abierta() === 'voluntario'" (click)="alternar('voluntario')">Registrar pago voluntario</button>
            </div>
            @if (abierta() === 'voluntario') {
              <div class="mb-[.75rem] flex min-w-0 flex-wrap items-end gap-3 rounded-xl border border-border px-3 py-3">
                <div class="flex-[1_1_100%] rounded-lg bg-muted px-3 py-2.5 text-[.8125rem]">Acción crítica: el pago no se asigna a ningún asesor y no se puede revertir.</div>
                <div class="flex min-w-0 items-end gap-3">
                  <div [class]="DATO + ' min-w-[8.75rem]'">
                    <label for="ibk-vol-fecha" [class]="ETIQUETA">Fecha de pago</label>
                    <input id="ibk-vol-fecha" type="date" [class]="CAMPO" [(ngModel)]="fechaForm">
                  </div>
                  <div [class]="DATO + ' min-w-24'">
                    <label for="ibk-vol-monto" [class]="ETIQUETA">Monto</label>
                    <input id="ibk-vol-monto" type="number" step="0.01" min="0" [class]="CAMPO" [(ngModel)]="montoForm">
                  </div>
                </div>
                <label class="flex flex-[1_1_100%] items-center gap-2 text-[.875rem]">
                  <input type="checkbox" class="size-4 accent-ring" [(ngModel)]="revisado">Confirmo que este pago no corresponde a ninguna promesa del cliente.
                </label>
                <div class="flex gap-2">
                  <button type="button" appBoton class="h-[2.375rem] flex-none px-4!" [disabled]="guardando()" (click)="registrarVoluntario()">Registrar como voluntario</button>
                  <button type="button" appBoton="secundario" class="h-[2.375rem] flex-none px-4!" [disabled]="guardando()" (click)="cerrar()">Cancelar</button>
                </div>
                @if (error(); as e) {
                  <p role="alert" class="m-0 flex-[1_1_100%] text-[.75rem] font-medium text-(--ro)">{{ e }}</p>
                }
              </div>
            }
            <div [class]="rejillaCuotas() + ' border-b border-border px-2 py-2.5 text-[.75rem] font-medium text-muted-foreground'">
              <span>Cuota</span>
              @if (!angosto) { <span>Vence</span> }
              <span>Monto</span><span>Pagado</span><span>Estado</span>
              @if (!angosto) { <span>Pago del asesor</span> }
              <span>Voucher</span><span></span>
            </div>
            @for (f of cuotas(); track f.clave) {
              <div [class]="rejillaCuotas() + ' px-2 py-[.5625rem]'" [ngClass]="abierta() === f.clave ? '' : 'border-b border-border'">
                <span class="font-semibold">{{ f.voluntarioSinBanco ? 'Pago voluntario' : 'Cuota ' + f.cuota.numeroCuota }}</span>
                @if (!angosto) { <span>{{ fecha(f.cuota.fechaPromesa) }}</span> }
                <span>{{ monto(f.cuota.montoPromesa) }}</span>
                <span>{{ monto(f.cuota.montoPagadoReal) }}</span>
                <div class="flex min-w-0 flex-col items-start">
                  <span [class]="PILL + ' ' + (f.voluntarioSinBanco ? 'border-border bg-transparent text-muted-foreground' : pillCuota(f.cuota.estado))">{{ f.voluntarioSinBanco ? 'Sin banco' : estadoCuota(f.cuota.estado) }}</span>
                  @if (!f.voluntarioSinBanco && (f.verificado || f.sinVerificar)) {
                    <span class="mt-[.25rem] text-[.75rem] leading-[1.3] text-muted-foreground">{{ f.sinVerificar ? 'Sin verificar por el banco' : 'Verificado por el banco' }}</span>
                  }
                </div>
                @if (!angosto) {
                  <span class="min-w-0 truncate">{{ asesorDe(f) }}</span>
                }
                <div>
                  @if (f.cuota.adjuntos?.length) {
                    <button type="button" appBoton="secundario" appBotonAlto="chico" [attr.aria-expanded]="voucherDe === f.cuota.cuotaId" [ngClass]="voucherDe === f.cuota.cuotaId ? 'shadow-[inset_0_0_0_1px_var(--ring)]!' : ''" (click)="abrirVoucher(f)">{{ f.cuota.adjuntos!.length > 1 ? 'Ver ' + f.cuota.adjuntos!.length : 'Ver' }}</button>
                  } @else {
                    <span class="text-[.75rem] whitespace-nowrap text-muted-foreground">Sin voucher</span>
                  }
                </div>
                <div class="text-right">
                  @if (f.voluntarioSinBanco) {
                    @if (esAdmin) { <button type="button" appBoton="secundario" appBotonAlto="chico" [attr.aria-expanded]="abierta() === f.clave" (click)="alternar(f.clave, 'eliminarVoluntario', f)">Eliminar</button> }
                  } @else if (f.sinVerificar || !f.verificado) {
                    <button type="button" appBoton="secundario" appBotonAlto="chico" [attr.aria-expanded]="abierta() === f.clave" (click)="alternar(f.clave, null, f)">Corregir</button>
                  } @else {
                    <button type="button" appBoton="secundario" appBotonAlto="chico" [attr.aria-expanded]="abierta() === f.clave" (click)="alternar(f.clave)">Ver pagos</button>
                  }
                </div>
              </div>
              @if (abierta() === f.clave) {
                <div class="flex flex-col gap-3 border-b border-border px-2 pt-1 pb-5">
                  @if (f.cuota.pagos.length) {
                    <div class="overflow-x-auto rounded-lg border border-border">
                      <div class="grid grid-cols-[minmax(0,1fr)_minmax(0,.8fr)_minmax(0,.9fr)_minmax(0,1fr)_minmax(0,1fr)] gap-x-3 border-b border-border px-3 py-1.5 text-[.75rem] font-medium text-muted-foreground">
                        <span>Fecha de pago</span><span>Monto</span><span>Fecha banco</span><span>Nro. operación</span><span>Conciliación</span>
                      </div>
                      @for (p of f.cuota.pagos; track p.pagoCuotaId) {
                        <div class="grid grid-cols-[minmax(0,1fr)_minmax(0,.8fr)_minmax(0,.9fr)_minmax(0,1fr)_minmax(0,1fr)] gap-x-3 px-3 py-1.5 text-[.8125rem]">
                          <span>{{ fecha(p.fechaPago) }}</span><span>{{ monto(p.montoPago) }}</span><span>{{ fecha(p.fechaBanco) }}</span>
                          <span class="truncate">{{ p.numeroOperacion || '—' }}</span>
                          <span>{{ p.verificadoBanco ? 'Verificado' : 'No verificado' }}{{ otroMes(p) ? ', cuenta en otro mes' : '' }}</span>
                        </div>
                      }
                    </div>
                  }
                  @if (f.verificado && !f.sinVerificar && esAdmin) {
                    <div><button type="button" appBoton="secundario" appBotonAlto="chico" (click)="irADesconciliar(f.verificado.pagoBancarioId)">Desconciliar</button></div>
                  }
                  @if (opcionesCuota(f).length > 1) {
                    <div class="flex min-w-0 flex-wrap gap-2" role="radiogroup" aria-label="Acción">
                      @for (o of opcionesCuota(f); track o) {
                        <button type="button" role="radio" [class]="OPCION" [attr.aria-checked]="opcionCuota() === o" [ngClass]="opcionCuota() === o ? 'border-ring! shadow-[0_0_0_1px_var(--ring)]' : 'border-border!'" (click)="elegirCuota(o, f)">
                          <span class="size-4 flex-none rounded-full" [ngClass]="opcionCuota() === o ? 'border-[5px] border-ring' : 'border-[1.5px] border-(--campo-ln)'"></span>
                          <span class="text-[.875rem] font-semibold">{{ tituloCuota(o) }}</span>
                        </button>
                      }
                    </div>
                  }
                  @if (opcionCuota(); as o) {
                    <div class="flex min-w-0 flex-wrap items-end gap-3 border-t border-border pt-3.5">
                      @if (previa(); as v) {
                        <div class="flex-[1_1_100%] rounded-lg bg-muted px-3 py-2.5 text-[.8125rem] leading-[1.45]">
                          <span class="mb-[.1875rem] block font-semibold">Qué va a cambiar</span>
                          <ul class="m-0 pl-4">
                            @for (t of cambiosDe(v); track t) { <li>{{ t }}</li> }
                          </ul>
                          @for (b of v.bloqueos; track b) { <span class="mt-[.25rem] block font-medium text-(--ro)">{{ b }}</span> }
                        </div>
                      }
                      @if (o === 'eliminar') {
                        <div class="flex-[1_1_100%] rounded-lg bg-muted px-3 py-2.5 text-[.8125rem]">Se eliminará el pago completo y todas sus aplicaciones a cuotas. Esta acción no se puede deshacer.</div>
                      }
                      <div class="flex min-w-0 items-end gap-3" [ngClass]="o === 'eliminar' ? '' : 'flex-auto'">
                        @if (o === 'eliminarVoluntario') {
                          <div [class]="CRECE">
                            <label for="ibk-motivo-cuota" [class]="ETIQUETA">Motivo</label>
                            <input id="ibk-motivo-cuota" [class]="CAMPO" [(ngModel)]="motivo">
                          </div>
                        } @else if (o !== 'eliminar') {
                          <div [class]="DATO + ' min-w-[8.75rem]'">
                            <label for="ibk-cuota-fecha" [class]="ETIQUETA">{{ etiquetaFecha(o) }}</label>
                            <input id="ibk-cuota-fecha" type="date" [class]="CAMPO" [attr.min]="rangoDe(o, f)?.min" [attr.max]="rangoDe(o, f)?.max" [(ngModel)]="fechaForm">
                          </div>
                          @if (o === 'regularizar') {
                            <div [class]="CRECE">
                              <label for="ibk-cuota-obs" [class]="ETIQUETA">Observaciones</label>
                              <input id="ibk-cuota-obs" [class]="CAMPO" [(ngModel)]="observaciones">
                            </div>
                          } @else {
                            <div [class]="DATO + ' min-w-24'">
                              <label for="ibk-cuota-monto" [class]="ETIQUETA">Monto</label>
                              <input id="ibk-cuota-monto" type="number" step="0.01" min="0" [class]="CAMPO" [(ngModel)]="montoForm">
                            </div>
                          }
                        }
                      </div>
                      @if (o === 'ampliar') {
                        <label class="flex flex-[1_1_100%] items-center gap-2 text-[.875rem]">
                          <input type="checkbox" class="size-4 accent-ring" [(ngModel)]="delAsesor">El pago corresponde al asesor original
                        </label>
                      }
                      @if (o === 'eliminarVoluntario') {
                        <label class="flex flex-[1_1_100%] items-center gap-2 text-[.875rem]">
                          <input type="checkbox" class="size-4 accent-ring" [(ngModel)]="revisado">Revisé lo que va a cambiar. Esta acción no se deshace con un botón.
                        </label>
                      }
                      <div class="flex flex-wrap items-center gap-2">
                        <button type="button" appBoton class="h-[2.375rem] flex-none px-4!" [disabled]="guardando() || previa()?.ejecutable === false" (click)="aplicarCuota(o, f)">{{ tituloCuota(o) }}</button>
                        <button type="button" appBoton="secundario" class="h-[2.375rem] flex-none px-4!" [disabled]="guardando()" (click)="cerrar()">Cancelar</button>
                      </div>
                      @if (error(); as e) {
                        <p role="alert" class="m-0 flex-[1_1_100%] text-[.75rem] font-medium text-(--ro)">{{ e }}</p>
                      }
                    </div>
                  }
                </div>
              }
            } @empty {
              <div class="mt-[.75rem] rounded-xl border border-dashed border-(--campo-ln) px-4 py-8 text-center text-muted-foreground">Sin promesas para este cliente</div>
            }
          }

          @case ('cancelaciones') {
            <div class="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] gap-x-3 border-b border-border px-2 py-2.5 text-[.75rem] font-medium text-muted-foreground">
              <span>Gestión</span><span>Fecha</span><span>Contacto</span>
            </div>
            @for (i of resumen()?.intentosCancelacion || []; track i.idGestion) {
              <div class="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] gap-x-3 border-b border-border px-2 py-[.5625rem]">
                <span class="font-semibold">{{ i.idGestion }}</span>
                <span>{{ fechaHora(i.fechaGestion) }}</span>
                <span>{{ contacto(i.metodoContacto) }}</span>
              </div>
            } @empty {
              <div class="mt-[.75rem] rounded-xl border border-dashed border-(--campo-ln) px-4 py-8 text-center text-muted-foreground">Sin intentos de cancelación</div>
            }
          }

          @case ('historico') {
            <div class="grid grid-cols-[minmax(0,.8fr)_minmax(0,.9fr)_minmax(0,1.1fr)_minmax(0,1.8fr)] gap-x-3 border-b border-border px-2 py-2.5 text-[.75rem] font-medium text-muted-foreground">
              <span>Fecha</span><span>Usuario</span><span>Cambio</span><span>Motivo y detalle</span>
            </div>
            @for (h of historico(); track h.id) {
              <div class="grid grid-cols-[minmax(0,.8fr)_minmax(0,.9fr)_minmax(0,1.1fr)_minmax(0,1.8fr)] items-start gap-x-3 border-b border-border px-2 py-[.5625rem]">
                <span>{{ fechaHora(h.fechaCambio) }}</span>
                <span class="min-w-0 truncate">{{ h.supervisorNombre || '—' }}</span>
                <span class="font-semibold">{{ tipoCambio(h.tipoCambio) }}</span>
                <div class="min-w-0 text-[.8125rem]">
                  <span class="block">{{ h.observacion || '—' }}</span>
                  @if (h.detalleAnterior) { <span class="block text-[.75rem] text-muted-foreground wrap-anywhere">Antes: {{ h.detalleAnterior }}</span> }
                  @if (h.detalleNuevo) { <span class="block text-[.75rem] text-muted-foreground wrap-anywhere">Después: {{ h.detalleNuevo }}</span> }
                </div>
              </div>
            } @empty {
              <div class="mt-[.75rem] rounded-xl border border-dashed border-(--campo-ln) px-4 py-8 text-center text-muted-foreground">Sin cambios</div>
            }
            @if (!historicoCompleto()) {
              <div class="py-3 text-center"><button type="button" appBoton="secundario" appBotonAlto="chico" (click)="masHistorico()">Ver más</button></div>
            }
          }
        }
      }
    </div>
  `
})
export class CorreccionIbkWidget implements OnChanges {
  @Input({ required: true }) contexto!: ContextoAjuste;
  @Input() documentoInicial: string | null = null;
  @Input() esAdmin = false;
  @Input() puedeCambiarMes = false;
  /** Con la columna derecha abierta se quitan las columnas que no entran. */
  @Input() angosto = false;
  /** Cuota cuyo voucher está abierto en la columna derecha. */
  @Input() voucherDe: number | null = null;
  @Output() volver = new EventEmitter<void>();
  @Output() cambio = new EventEmitter<void>();
  @Output() ficha = new EventEmitter<number>();
  @Output() voucher = new EventEmitter<{ cuotaId: number; datos: VoucherAbierto }>();
  @Output() clienteElegido = new EventEmitter<string | null>();

  readonly ETIQUETA = ETIQUETA_IBK;
  readonly CAMPO = CAMPO_IBK;
  readonly DATO = DATO_IBK;
  readonly CRECE = CRECE_IBK;
  readonly OPCION = OPCION_IBK;
  readonly PILL = PILL_IBK;
  readonly DESTINOS = DESTINOS;
  readonly PESTANAS: { id: Pestana; titulo: string }[] = [
    { id: 'banco', titulo: 'Pagos del banco' },
    { id: 'promesas', titulo: 'Promesas y pagos' },
    { id: 'cancelaciones', titulo: 'Cancelaciones' },
    { id: 'historico', titulo: 'Histórico' }
  ];

  private readonly ajuste = inject(AjusteConciliacionService);
  private readonly bcp = inject(BcpPagosService);
  private readonly correccion = inject(CorreccionPagosService);
  private readonly consolidado = inject(ConsolidadoBancoService);
  private readonly toast = inject(ToastService);
  private readonly fmt = inject(FormatService);

  documento = signal<string | null>(null);
  pestana = signal<Pestana>('banco');
  cargando = signal(false);
  buscando = signal(false);
  guardando = signal(false);
  errorCarga = signal<string | null>(null);
  errorBusqueda = signal<string | null>(null);
  error = signal<string | null>(null);
  pagos = signal<PagoBancoCliente[]>([]);
  resumen = signal<ResumenConciliacionCliente | null>(null);
  historico = signal<HistoricoCorreccion[]>([]);
  historicoCompleto = signal(true);
  private validas = signal<CuotaValidaTipificar[]>([]);
  private paginaHistorico = 0;

  abierta = signal<string | null>(null);
  opcion = signal<OpcionBanco | null>(null);
  opcionCuota = signal<OpcionCuota | null>(null);
  previa = signal<VistaPreviaAjuste | null>(null);

  textoBusqueda = '';
  motivo = '';
  destino: DestinoDesconciliacion | '' = '';
  periodoElegido = '';
  revisado = false;
  fechaForm = '';
  montoForm: number | null = null;
  observaciones = '';
  delAsesor = true;

  rejillaBanco = computed(() => this.angostoSig()
    ? 'grid grid-cols-[minmax(0,.9fr)_minmax(0,.8fr)_minmax(0,1.4fr)_minmax(0,.8fr)_5.5rem] items-center gap-x-3'
    : 'grid grid-cols-[minmax(0,.8fr)_minmax(0,.7fr)_minmax(0,1.3fr)_minmax(0,.8fr)_minmax(0,1.4fr)_5.5rem] items-center gap-x-3');
  columnasBanco = computed<[string, string, string]>(() => this.angostoSig() ? ['1 / 3', '3', '4 / -1'] : ['3', '4', '5 / -1']);
  rejillaCuotas = computed(() => this.angostoSig()
    ? 'grid grid-cols-[6rem_minmax(0,.8fr)_minmax(0,.8fr)_minmax(0,1.4fr)_5.5rem_6rem] items-center gap-x-3'
    : 'grid grid-cols-[6.5rem_minmax(0,.8fr)_minmax(0,.8fr)_minmax(0,.8fr)_minmax(0,1.3fr)_minmax(0,1.1fr)_5.5rem_6rem] items-center gap-x-3');
  private angostoSig = signal(false);

  cuotas = computed<FilaCuota[]>(() => (this.resumen()?.promesas || []).flatMap(promesa => (promesa.cuotas || []).map(cuota => {
    const pagos = cuota.pagos || [];
    const voluntario = String(promesa.rutaTipificacion || '').toUpperCase().includes('PAGO VOLUNTARIO');
    return {
      clave: `c${cuota.cuotaId}`, promesa, cuota,
      sinVerificar: pagos.find(p => !p.verificadoBanco) ?? null,
      verificado: pagos.find(p => p.verificadoBanco) ?? null,
      voluntarioSinBanco: voluntario && pagos.length === 1 && !pagos[0].verificadoBanco && !pagos[0].pagoBancarioId
    };
  })));

  avisos = computed<{ texto: string; pestana: Pestana }[]>(() => {
    const avisos: { texto: string; pestana: Pestana }[] = [];
    const pendientes = this.pagos().filter(p => p.categoria === 'REQUIERE_REVISION').length;
    if (pendientes) avisos.push({ texto: `${pendientes} ${pendientes === 1 ? 'pago del banco pendiente' : 'pagos del banco pendientes'}`, pestana: 'banco' });
    const parciales = this.pagos().filter(p => p.categoria === 'PARCIAL_EN_ESPERA').length;
    if (parciales) avisos.push({ texto: `${parciales} ${parciales === 1 ? 'pago parcial en espera' : 'pagos parciales en espera'}`, pestana: 'banco' });
    const voluntarios = this.cuotas().filter(f => f.voluntarioSinBanco).length;
    if (voluntarios) avisos.push({ texto: `${voluntarios} ${voluntarios === 1 ? 'pago voluntario sin banco' : 'pagos voluntarios sin banco'}`, pestana: 'promesas' });
    return avisos;
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['angosto']) this.angostoSig.set(this.angosto);
    if (changes['documentoInicial'] && this.documentoInicial) {
      this.textoBusqueda = this.documentoInicial;
      this.abrirCliente(this.documentoInicial);
    }
  }

  /** Acepta un DNI o el número de un pago bancario (Pb 4442). */
  buscar(): void {
    const texto = this.textoBusqueda.trim();
    if (!texto) return;
    this.errorBusqueda.set(null);
    const pb = /^pb\s*(\d+)$/i.exec(texto);
    if (!pb) return this.abrirCliente(texto);
    this.buscando.set(true);
    this.ajuste.documentoDePago(Number(pb[1]), this.contexto).subscribe({
      next: r => {
        this.buscando.set(false);
        this.abrirCliente(r.documento);
      },
      error: () => {
        this.buscando.set(false);
        this.errorBusqueda.set('No se encontró ese pago en esta subcartera.');
      }
    });
  }

  elegirPestana(pestana: Pestana): void {
    this.pestana.set(pestana);
    this.cerrar();
  }

  /** Abre o cierra el panel de una fila. Sin opción elegida solo se ve el detalle. */
  alternar(clave: string, opcion: OpcionCuota | null = null, fila?: FilaCuota): void {
    if (this.abierta() === clave) return this.cerrar();
    this.cerrar();
    this.abierta.set(clave);
    if (clave === 'voluntario') {
      this.fechaForm = new Date().toISOString().slice(0, 10);
      return;
    }
    if (fila) {
      const inicial = opcion ?? this.opcionesCuota(fila)[0] ?? null;
      if (inicial) this.elegirCuota(inicial, fila);
    }
  }

  cerrar(): void {
    this.abierta.set(null);
    this.cancelarOpcion();
    this.opcionCuota.set(null);
  }

  cancelarOpcion(): void {
    this.opcion.set(null);
    this.previa.set(null);
    this.error.set(null);
    this.motivo = '';
    this.destino = '';
    this.revisado = false;
    this.observaciones = '';
  }

  opcionesBanco(p: PagoBancoCliente): { id: OpcionBanco; titulo: string }[] {
    const a = p.acciones;
    const conciliado = p.procesado || p.enlaces.length > 0;
    const lista: { id: OpcionBanco; titulo: string; aplica: boolean }[] = [
      { id: 'resolver', titulo: 'Resolver', aplica: a.resolver },
      { id: 'noCorresponde', titulo: 'No corresponde', aplica: a.noCorresponde },
      { id: 'restaurar', titulo: 'Volver a pendientes', aplica: a.restaurar },
      { id: 'desconciliar', titulo: 'Desconciliar', aplica: this.esAdmin && (a.desconciliar || (conciliado && !!a.motivoNoDesconciliar)) },
      { id: 'voluntario', titulo: 'Registrar como voluntario', aplica: this.esAdmin && a.pagoVoluntario },
      { id: 'mes', titulo: 'Cambiar mes en que cuenta', aplica: this.puedeCambiarMes && a.cambiarPeriodo }
    ];
    return lista.filter(o => o.aplica);
  }

  tituloBanco(): string {
    return this.opcionesBanco(this.pagos().find(p => `b${p.id}` === this.abierta())!).find(o => o.id === this.opcion())?.titulo ?? '';
  }

  elegirBanco(opcion: OpcionBanco, pago: PagoBancoCliente): void {
    this.cancelarOpcion();
    this.opcion.set(opcion);
    if (opcion === 'mes') this.periodoElegido = this.periodosDe(pago).find(m => m !== pago.periodoBanco) ?? '';
    if (opcion === 'desconciliar' && pago.acciones.desconciliar) this.cargarPrevia(this.ajuste.vistaPreviaDesconciliar(pago.id, this.contexto));
    if (opcion === 'voluntario') this.cargarPrevia(this.ajuste.vistaPreviaPagoVoluntario(pago.id, this.contexto));
  }

  destinoElegido(): string {
    return DESTINOS.find(d => d.valor === this.destino)?.detalle ?? '';
  }

  aplicarBanco(pago: PagoBancoCliente): void {
    const motivo = this.motivo.trim();
    switch (this.opcion()) {
      case 'restaurar':
        return this.ejecutar(this.bcp.restaurarPendiente(pago.id, this.contexto), 'El pago volvió a pendientes.');
      case 'noCorresponde':
        if (!motivo) return this.error.set('Escribe el motivo.');
        return this.ejecutar(this.bcp.marcarNoCorresponde(pago.id, motivo, this.contexto), 'Pago marcado como no corresponde.');
      case 'desconciliar':
        if (!this.destino) return this.error.set('Elige qué pasa con el pago del banco.');
        if (!motivo) return this.error.set('Escribe el motivo.');
        if (!this.revisado) return this.error.set('Confirma que revisaste lo que va a cambiar.');
        return this.ejecutar(this.ajuste.desconciliar(pago.id, this.contexto, { destino: this.destino, motivo }), 'Pago desconciliado.');
      case 'voluntario':
        if (!motivo) return this.error.set('Escribe el motivo.');
        if (!this.revisado) return this.error.set('Confirma que revisaste lo que va a cambiar.');
        return this.ejecutar(this.ajuste.registrarPagoVoluntario(pago.id, this.contexto, motivo), 'Pago registrado como voluntario.');
      case 'mes':
        if (!motivo) return this.error.set('Escribe el motivo.');
        if (!this.periodoElegido) return this.error.set('Elige el mes.');
        return this.ejecutar(this.consolidado.cambiarPeriodoPago(pago.id, { ...this.contexto, periodo: this.periodoElegido }, { periodo: this.periodoElegido, motivo }), 'Mes del pago cambiado.');
    }
  }

  periodosDe(pago: PagoBancoCliente): string[] {
    const iso = aFechaIso(pago.fechaBanco);
    if (!iso) return [];
    const [anio, mes] = iso.split('-').map(Number);
    return [`${anio}${String(mes).padStart(2, '0')}`, mes === 1 ? `${anio - 1}12` : `${anio}${String(mes - 1).padStart(2, '0')}`];
  }

  irADesconciliar(pagoId: number | null): void {
    const pago = this.pagos().find(p => p.id === pagoId);
    this.pestana.set('banco');
    this.cerrar();
    if (!pago) return;
    this.abierta.set(`b${pago.id}`);
    this.elegirBanco('desconciliar', pago);
  }

  opcionesCuota(f: FilaCuota): OpcionCuota[] {
    if (f.voluntarioSinBanco) return this.esAdmin ? ['eliminarVoluntario'] : [];
    if (f.sinVerificar) {
      const regularizable = String(f.promesa.estadoPago).toUpperCase() === 'PAGADA' && f.promesa.cuotas.length === 1 && String(f.cuota.estado).toUpperCase() === 'PAGADA';
      return ['modificar', 'eliminar', ...(regularizable ? ['regularizar' as const] : [])];
    }
    if (f.verificado) return [];
    const valida = this.validas().find(c => c.cuotaId === f.cuota.cuotaId);
    if (!valida) return [];
    const vencida = valida.estadoCuota === 'VENCIDA' && valida.ultimaPromesa;
    const vence = aFechaIso(valida.fechaPromesa);
    const promesa = vencida && f.promesa.cuotas.length === 1 && sumarDias(vence, DIAS_AMPLIACION + 1) <= finDeMes(vence);
    return ['crear', ...(vencida ? ['ampliar' as const] : []), ...(promesa ? ['promesa' as const] : [])];
  }

  elegirCuota(opcion: OpcionCuota, f: FilaCuota): void {
    this.cancelarOpcion();
    this.opcionCuota.set(opcion);
    const pago = f.sinVerificar;
    this.fechaForm = pago ? aFechaIso(pago.fechaPago) : this.rangoDe(opcion, f)?.min ?? aFechaIso(f.cuota.fechaPromesa);
    this.montoForm = Number(pago?.montoPago ?? f.cuota.montoPromesa);
    if (opcion === 'eliminarVoluntario' && pago) this.cargarPrevia(this.ajuste.vistaPreviaEliminarVoluntario(pago.pagoCuotaId, this.contexto));
  }

  tituloCuota(opcion: OpcionCuota): string {
    return TITULOS_CUOTA[opcion];
  }

  etiquetaFecha(opcion: OpcionCuota): string {
    if (opcion === 'ampliar') return 'Nueva fecha de vencimiento';
    return opcion === 'regularizar' ? 'Fecha en que el banco registró el pago' : 'Fecha de pago';
  }

  /** Fechas válidas según la acción: hasta 3 días tras el vencimiento, o después y dentro del mes. */
  rangoDe(opcion: OpcionCuota, f: FilaCuota): { min: string; max: string } | null {
    const vence = aFechaIso(f.cuota.fechaPromesa);
    if (!vence) return null;
    if (opcion === 'ampliar' || opcion === 'regularizar') return { min: vence, max: sumarDias(vence, DIAS_AMPLIACION) };
    return opcion === 'promesa' ? { min: sumarDias(vence, DIAS_AMPLIACION + 1), max: finDeMes(vence) } : null;
  }

  aplicarCuota(opcion: OpcionCuota, f: FilaCuota): void {
    const documento = this.documento()!;
    const pago = f.sinVerificar;
    if (opcion === 'eliminar' && pago) return this.ejecutar(this.correccion.eliminarPago(pago.pagoCuotaId, this.contexto), 'Pago eliminado.');
    if (opcion === 'eliminarVoluntario' && pago) {
      const motivo = this.motivo.trim();
      if (!motivo) return this.error.set('Escribe el motivo.');
      if (!this.revisado) return this.error.set('Confirma que revisaste lo que va a cambiar.');
      return this.ejecutar(this.ajuste.eliminarVoluntario(pago.pagoCuotaId, this.contexto, motivo), 'Pago voluntario eliminado.');
    }
    const rango = this.rangoDe(opcion, f);
    if (!this.fechaForm || (rango && (this.fechaForm < rango.min || this.fechaForm > rango.max))) return this.error.set('La fecha no está en el rango permitido.');
    if (opcion === 'regularizar' && pago) {
      return this.ejecutar(this.correccion.regularizarPagoPagado(f.cuota.cuotaId, this.contexto, {
        documento, fechaPagoBanco: this.fechaForm, pagoCuotaId: pago.pagoCuotaId, observaciones: this.observaciones.trim() || undefined
      }), 'Fecha del pago regularizada.');
    }
    if (!this.montoForm || this.montoForm <= 0) return this.error.set('Indica el monto.');
    const datos = { documento, fechaPago: this.fechaForm, montoPago: Number(this.montoForm) };
    if (opcion === 'modificar' && pago) return this.ejecutar(this.correccion.corregirPago(pago.pagoCuotaId, this.contexto, { fechaPago: datos.fechaPago, montoPago: datos.montoPago }), 'Pago modificado.');
    if (opcion === 'crear') return this.ejecutar(this.correccion.crearCancelacion(f.cuota.cuotaId, this.contexto, datos), 'Pago creado en la cuota.');
    if (opcion === 'ampliar') return this.ejecutar(this.correccion.ampliarVencimiento(f.cuota.cuotaId, this.contexto, { ...datos, pagoCorrespondeAsesor: this.delAsesor }), 'Vencimiento ampliado y pago creado.');
    if (opcion === 'promesa') this.ejecutar(this.correccion.crearPromesaSistemaPagoBanco(f.cuota.cuotaId, this.contexto, datos), 'Promesa del sistema creada.');
  }

  registrarVoluntario(): void {
    if (!this.fechaForm || !this.montoForm || this.montoForm <= 0) return this.error.set('Indica la fecha y el monto.');
    if (!this.revisado) return this.error.set('Confirma que el pago no corresponde a ninguna promesa.');
    this.ejecutar(this.correccion.crearPagoVoluntarioSistema(this.contexto, { documento: this.documento()!, fechaPago: this.fechaForm, montoPago: Number(this.montoForm) }), 'Pago voluntario registrado.');
  }

  abrirVoucher(f: FilaCuota): void {
    this.voucher.emit({
      cuotaId: f.cuota.cuotaId,
      datos: {
        adjuntos: f.cuota.adjuntos || [], cuota: f.cuota.numeroCuota, subidoPor: f.promesa.nombreAgente || null,
        monto: this.monto(f.cuota.montoPagadoReal), verificado: !!f.verificado
      }
    });
  }

  masHistorico(): void {
    this.paginaHistorico++;
    this.cargarHistorico();
  }

  cambiosDe(v: VistaPreviaAjuste): string[] {
    const cambios: string[] = [];
    const n = v.conciliacionesARevertir.length;
    if (n) cambios.push(`${n} ${n === 1 ? 'conciliación pasa' : 'conciliaciones pasan'} a Revertida.`);
    for (const p of v.pagosADesverificar) cambios.push(`El pago del asesor del ${this.fecha(p.fechaPago)} por ${this.monto(p.montoPago)} (${p.agente || 'sin agente'}) queda sin verificar.`);
    for (const p of v.pagosVoluntariosAEliminar) cambios.push(`Se elimina el pago voluntario del sistema del ${this.fecha(p.fechaPago)} por ${this.monto(p.montoPago)}.`);
    if (this.opcion() === 'voluntario') {
      cambios.push('Se crea una gestión Pago voluntario del sistema con su cuota y su pago, con la fecha y el monto del banco.');
      cambios.push('El pago del banco queda conciliado con ese pago voluntario.');
    }
    if (v.periodoNuevo && v.periodoNuevo !== v.periodoActual) cambios.push(`El pago pasa a contar en ${this.periodo(v.periodoNuevo)} (estaba en ${this.periodo(v.periodoActual)}).`);
    return cambios;
  }

  estadoDe(p: PagoBancoCliente): string {
    return infoCategoria(this.categoriaDe(p)).label;
  }

  pillDe(p: PagoBancoCliente): string {
    const tono = infoCategoria(this.categoriaDe(p)).tono;
    if (tono === 'ok') return 'border-(--ok-ln) bg-(--ok-bg) text-(--ok)';
    if (tono === 'espera') return 'border-(--am-ln) bg-(--am-bg) text-(--am)';
    if (tono === 'revision') return 'border-(--ro-ln) bg-(--ro-bg) text-(--ro)';
    return 'border-border bg-transparent text-muted-foreground';
  }

  estadoCuota(estado: string): string {
    const texto = String(estado || '').toLowerCase();
    return texto ? texto[0].toUpperCase() + texto.slice(1) : '—';
  }

  pillCuota(estado: string): string {
    return String(estado).toUpperCase() === 'PAGADA' ? 'border-(--ok-ln) bg-(--ok-bg) text-(--ok)' : 'border-(--am-ln) bg-(--am-bg) text-(--am)';
  }

  enlazadoA(p: PagoBancoCliente): string {
    const cuota = p.enlaces[0]?.numeroCuota;
    return cuota ? `Cuota ${cuota}` : '—';
  }

  asesorDe(f: FilaCuota): string {
    const pago = f.sinVerificar ?? f.verificado;
    return pago ? `${this.fecha(pago.fechaPago).slice(0, 5)}, ${f.promesa.nombreAgente || 'sin agente'}` : '—';
  }

  otroMes(p: CuotaResumenConciliacion['pagos'][number]): boolean {
    const iso = aFechaIso(p.fechaBanco);
    return !!p.periodoBanco && !!iso && p.periodoBanco !== iso.slice(0, 7).replace('-', '');
  }

  contacto(valor: string | null): string {
    const textos: Record<string, string> = { GESTION_AUTOMATICA: 'Automática', GESTION_MANUAL: 'Manual', GESTION_PROGRESIVO: 'Progresivo' };
    return (valor && textos[valor]) || valor || '—';
  }

  tipoCambio(valor: string | null): string {
    return (valor && ETIQUETAS_TIPO_CAMBIO[valor]) || valor || '—';
  }

  fecha(valor: unknown): string {
    return valor ? fechaCorta(valor) : '—';
  }

  fechaHora(valor: string | null | undefined): string {
    return valor ? `${fechaCorta(valor)} ${String(valor).slice(11, 16)}`.trim() : '—';
  }

  monto(valor: number | null | undefined): string {
    return `S/ ${this.fmt.number(Number(valor ?? 0), { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  periodo(valor: string | null | undefined): string {
    return valor && valor.length === 6 ? `${valor.slice(4, 6)}/${valor.slice(0, 4)}` : '—';
  }

  /** Conciliaciones antiguas guardadas sin categoría: si el pago está conciliado se muestra como tal. */
  private categoriaDe(p: PagoBancoCliente): string | null {
    return p.categoria || (p.procesado || p.enlaces.length ? 'CONCILIADO' : null);
  }

  private abrirCliente(documento: string): void {
    this.documento.set(documento);
    this.textoBusqueda = documento;
    this.pestana.set('banco');
    this.cerrar();
    this.cargar();
  }

  private cargar(): void {
    const documento = this.documento();
    if (!documento) return;
    this.cargando.set(true);
    this.errorCarga.set(null);
    forkJoin({
      pagos: this.ajuste.listarPagosBancoCliente(documento, this.contexto),
      resumen: this.bcp.obtenerResumenConciliacionCliente(documento, this.contexto),
      validas: this.correccion.buscarCuotasValidasTipificar({ documento, ...this.contexto }).pipe(catchError(() => of([] as CuotaValidaTipificar[])))
    }).subscribe({
      next: ({ pagos, resumen, validas }) => {
        this.pagos.set(pagos);
        this.resumen.set(resumen);
        this.clienteElegido.emit(resumen?.nombreCliente || documento);
        this.validas.set(validas || []);
        this.cargando.set(false);
      },
      error: err => {
        this.errorCarga.set(err?.error?.mensaje || err?.error?.message || 'No se pudo cargar el cliente.');
        this.cargando.set(false);
      }
    });
    this.paginaHistorico = 0;
    this.historico.set([]);
    this.cargarHistorico();
  }

  private cargarHistorico(): void {
    const documento = this.documento();
    if (!documento) return;
    this.ajuste.historicoCorrecciones(documento, this.contexto, this.paginaHistorico).subscribe({
      next: pagina => {
        this.historico.update(filas => [...filas, ...(pagina.content || [])]);
        this.historicoCompleto.set(pagina.last);
      },
      error: () => this.historicoCompleto.set(true)
    });
  }

  private cargarPrevia(pedido: Observable<VistaPreviaAjuste>): void {
    pedido.subscribe({
      next: previa => this.previa.set(previa),
      error: err => this.error.set(err?.error?.mensaje || err?.error?.message || 'No se pudo revisar lo que va a cambiar.')
    });
  }

  /** Tras un cambio, un pago pendiente del cliente puede calzar: se reevalúa y luego se recarga. */
  private ejecutar(accion: Observable<{ exitoso?: boolean; mensaje?: string } | unknown>, aviso: string): void {
    const documento = this.documento();
    if (!documento) return;
    this.guardando.set(true);
    this.error.set(null);
    accion.subscribe({
      next: respuesta => {
        const r = respuesta as { exitoso?: boolean; mensaje?: string } | null;
        if (r?.exitoso === false) {
          this.guardando.set(false);
          this.error.set(r.mensaje || 'No se pudo guardar.');
          return;
        }
        const seguir = () => {
          this.guardando.set(false);
          this.cerrar();
          this.toast.show(aviso, 'success');
          this.cargar();
          this.cambio.emit();
        };
        this.bcp.reevaluarPendientesCliente(documento, this.contexto).subscribe({ next: seguir, error: seguir });
      },
      error: err => {
        this.guardando.set(false);
        this.error.set(err?.error?.mensaje || err?.error?.message || 'No se pudo guardar.');
      }
    });
  }
}
