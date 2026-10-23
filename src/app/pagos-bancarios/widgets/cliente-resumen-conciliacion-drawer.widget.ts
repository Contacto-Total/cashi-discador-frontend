import { Component, EventEmitter, HostListener, Input, OnChanges, OnDestroy, Output, SimpleChanges, inject } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { FormatService } from '@/shared/services/format.service';
import { MenuLateralService } from '@/shared/services/menu-lateral.service';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { A11yModule } from '@angular/cdk/a11y';
import { AdjuntoResumenConciliacion, CuotaResumenConciliacion, PagoResumenConciliacion, PromesaResumenConciliacion, ResumenConciliacionCliente } from '../models/bcp-archivo.model';
import { BcpPagosService } from '../services/bcp-pagos.service';
import { AuthService } from '../../core/services/auth.service';
import { AjustePagoBancoDialogWidget } from './ajuste-pago-banco-dialog.widget';

/**
 * URL de Corrección de pagos con el cliente (y opcionalmente la ficha de un pago bancario) ya cargados.
 * Los ajustes se hacen solo allí: las demás pantallas la abren en otra pestaña para no perder lo que tienen.
 */
export function urlCorreccionPagos(
  router: Router,
  location: Location,
  contexto: { tenantId: number; carteraId: number; subcarteraId: number },
  documento: string | null,
  pb?: number | null
): string {
  const queryParams: Record<string, string | number> = { ...contexto };
  if (documento) queryParams['documento'] = documento;
  if (pb) queryParams['pb'] = pb;
  return location.prepareExternalUrl(router.serializeUrl(router.createUrlTree(['/correccion-pagos'], { queryParams })));
}

@Component({
  selector: 'app-cliente-resumen-conciliacion-drawer',
  standalone: true,
  imports: [CommonModule, A11yModule, AjustePagoBancoDialogWidget],
  template: `
    @if (open) {
      <div
        [ngClass]="mode === 'drawer' ? 'fixed inset-0 z-[1100] flex justify-end bg-transparent' : 'mt-4'"
        (click)="onBackdropClick()"
      >
        <aside
          [ngClass]="mode === 'drawer'
            ? 'h-screen w-[520px] max-w-[94vw] overflow-y-auto border-l border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900'
            : 'w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900'"
          (click)="$event.stopPropagation()"
        >
          <div class="sticky top-0 z-10 border-b border-slate-200 bg-white px-3 py-2.5 dark:border-slate-700 dark:bg-slate-900">
            <div class="flex items-start justify-between gap-4">
              <div>
                <p class="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Resumen cliente</p>
                <h2 class="mt-0.5 text-base font-bold text-slate-900 dark:text-white">{{ resumen?.nombreCliente || 'Cliente sin nombre' }}</h2>
                <p class="text-xs text-slate-600 dark:text-slate-300">
                  Documento: <span class="font-mono font-semibold">{{ documento || resumen?.documento }}</span>
                  @if (resumen?.subcarteraId) {
                    <span class="ml-2 text-xs text-slate-400 dark:text-slate-500">SubcarteraId {{ resumen?.subcarteraId }}</span>
                  }
                </p>
              </div>
              @if (!permiteCorregir && contextoRecalculo() && documentoActual()) {
                <a [href]="enlaceCorreccion()" target="_blank" rel="noopener" class="rounded-lg border border-emerald-600 px-2 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:border-emerald-400 dark:text-emerald-300 dark:hover:bg-emerald-950/30">
                  Corregir pagos <span class="sr-only">(se abre en otra pestaña)</span><span aria-hidden="true">↗</span>
                </a>
              }
              @if (mode === 'drawer') {
                <button type="button" (click)="close.emit()" class="rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">Cerrar</button>
              }
            </div>
          </div>

          <div class="p-3">
            @if (loading) {
              <div class="rounded-xl border border-slate-200 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">Cargando resumen...</div>
            } @else if (error) {
              <div class="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700 dark:border-red-800 dark:bg-red-950/20 dark:text-red-300">{{ error }}</div>
            } @else if (resumen) {
              <div class="mb-3 grid grid-cols-3 gap-2">
                <div class="group relative rounded-lg border border-slate-200 p-2 dark:border-slate-700">
                  <p class="line-clamp-3 pr-5 text-[10px] leading-tight text-slate-500 dark:text-slate-400">Carta de no adeudo disponible</p>
                  <p class="mt-0.5 text-sm font-bold" [class]="resumen.pagoCumplido ? 'text-emerald-600 dark:text-emerald-300' : 'text-amber-600 dark:text-amber-300'">{{ resumen.pagoCumplido ? 'Sí' : 'No' }}</p>
                  <!-- Acción discreta: solo aparece al pasar el mouse o al llegar con el teclado. -->
                  @if (puedeRecalcular()) {
                    <button
                      type="button"
                      (click)="recalcularPagoCumplido()"
                      [disabled]="recalculando || enEspera"
                      [title]="enEspera ? 'Espera unos segundos para volver a recalcular' : 'Recalcular con los pagos verificados por el banco'"
                      aria-label="Recalcular carta de no adeudo"
                      class="absolute right-1 top-1 rounded p-0.5 text-slate-400 opacity-0 transition-opacity hover:bg-slate-100 hover:text-slate-700 focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 group-hover:opacity-100 disabled:cursor-not-allowed disabled:hover:bg-transparent dark:hover:bg-slate-800 dark:hover:text-slate-200"
                    >
                      <svg class="h-3.5 w-3.5" [class.animate-spin]="recalculando" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M21 12a9 9 0 1 1-2.64-6.36"/>
                        <path d="M21 3v6h-6"/>
                      </svg>
                    </button>
                  }
                  <p class="text-[10px] leading-tight text-slate-500 dark:text-slate-400" role="status" aria-live="polite">{{ mensajeRecalculo }}</p>
                </div>
                <div class="rounded-lg border border-slate-200 p-2 dark:border-slate-700">
                  <p class="text-[10px] text-slate-500 dark:text-slate-400">Promesas</p>
                  <p class="mt-0.5 text-sm font-bold text-slate-900 dark:text-white">{{ resumen.promesas.length }}</p>
                </div>
                <div class="rounded-lg border border-slate-200 p-2 dark:border-slate-700">
                  <p class="text-[10px] text-slate-500 dark:text-slate-400">Intentos cancelación</p>
                  <p class="mt-0.5 text-sm font-bold text-slate-900 dark:text-white">{{ getIntentosCancelacion().length }}</p>
                </div>
              </div>

              <div class="mb-3 grid grid-cols-2 rounded-lg border border-slate-200 bg-slate-100 p-1 text-xs font-semibold dark:border-slate-700 dark:bg-slate-800">
                <button type="button" class="rounded-md px-2 py-1.5 transition-colors" [class]="activeView === 'promesas' ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'" (click)="activeView = 'promesas'">
                  Promesas
                </button>
                <button type="button" class="rounded-md px-2 py-1.5 transition-colors" [class]="activeView === 'cancelaciones' ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'" (click)="activeView = 'cancelaciones'">
                  Cancelaciones
                </button>
              </div>

              @if (activeView === 'cancelaciones') {
                <div class="space-y-2">
                  @for (intento of getIntentosCancelacion(); track intento.idGestion) {
                    <div class="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50">
                      <div class="flex items-start justify-between gap-3">
                        <div class="min-w-0">
                          <p class="text-xs font-bold text-slate-900 dark:text-white">Gestión {{ intento.idGestion }}</p>
                          <p class="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">{{ formatDateTime(intento.fechaGestion) }}</p>
                        </div>
                        <span class="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold" [class]="getMetodoClass(intento.metodoContacto)">
                          {{ formatMetodoContacto(intento.metodoContacto) }}
                        </span>
                      </div>
                    </div>
                  } @empty {
                    <div class="rounded-xl border border-slate-200 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">No hay intentos de cancelación para este cliente.</div>
                  }
                </div>
              } @else {
              <div class="space-y-2">
                @for (promesa of resumen.promesas; track promesa.idGestion) {
                  <details class="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50">
                    <summary class="cursor-pointer list-none px-2.5 py-2 marker:hidden">
                      <div class="inline-flex w-full items-center justify-between gap-2 align-middle">
                        <div class="min-w-0">
                          <p class="flex items-center gap-1.5 text-xs font-semibold text-slate-900 dark:text-white">
                            <span class="text-[10px] text-slate-400">▸</span>
                            <span>Gestión {{ promesa.idGestion }} · {{ promesa.estadoPago }}</span>
                          </p>
                          <p class="truncate text-[10px] text-slate-500 dark:text-slate-400">{{ formatDateTime(promesa.fechaGestion) }} · {{ promesa.nombreAgente || 'Sin agente' }}</p>
                        </div>
                        <div class="shrink-0 text-right text-[11px] font-semibold text-slate-700 dark:text-slate-200">S/ {{ formatMoney(promesa.montoPagadoReal) }} / {{ formatMoney(promesa.montoPromesa) }}</div>
                      </div>
                    </summary>

                    <div class="border-t border-slate-200 p-2 dark:border-slate-700">
                      @if (hasValue(promesa.rutaTipificacion)) {
                        <p class="mb-1.5 truncate text-[10px] text-slate-500 dark:text-slate-400">{{ promesa.rutaTipificacion }}</p>
                      }
                      @if ((permiteCorregir ? permiteAjustes() : !!contextoRecalculo()) && pagoVoluntarioSinBanco(promesa); as pago) {
                        <div class="mb-1.5 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-amber-300 bg-amber-50 px-2 py-1.5 text-[10px] text-amber-900 dark:border-amber-700 dark:bg-amber-950/30 dark:text-amber-200">
                          <span>Pago voluntario del sistema sin pago del banco enlazado.</span>
                          <button type="button" (click)="abrirEliminarVoluntario(pago.pagoCuotaId)" [attr.aria-label]="permiteCorregir ? 'Eliminar pago voluntario sin banco' : 'Corregir en Corrección de pagos (otra pestaña)'" class="rounded-md border border-red-600 bg-white px-2 py-0.5 font-bold text-red-700 hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:border-red-400 dark:bg-slate-900 dark:text-red-300 dark:hover:bg-red-950/30">{{ permiteCorregir ? 'Eliminar...' : 'Corregir ↗' }}</button>
                        </div>
                      }

                      <div class="overflow-x-auto rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                        <table class="w-full table-fixed text-[10px] leading-tight">
                          <thead class="bg-slate-100 text-left text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                            <tr>
                              <th class="w-[14%] px-1.5 py-1.5 font-semibold">Cuota</th>
                              <th class="w-[20%] px-1.5 py-1.5 font-semibold">Promesa</th>
                              <th class="w-[25%] px-1.5 py-1.5 font-semibold">Pg Regist Agente</th>
                              <th class="w-[25%] px-1.5 py-1.5 font-semibold">BANCO</th>
                              <th class="w-[16%] px-1.5 py-1.5 font-semibold">Voucher</th>
                            </tr>
                          </thead>
                          <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                            @for (cuota of promesa.cuotas; track cuota.cuotaId) {
                              <!-- La fila abre la cuota con el mouse; el botón del número hace lo mismo con teclado -->
                              <tr class="align-top hover:bg-slate-50 dark:hover:bg-slate-800/50" [class.cursor-pointer]="cuotaAbrible(cuota)" (click)="abrirCuota(promesa, cuota)">
                                <td class="px-1.5 py-1.5">
                                  <p class="flex flex-wrap items-center gap-1">
                                    @if (cuotaAbrible(cuota)) {
                                      <button type="button" (click)="$event.stopPropagation(); abrirCuota(promesa, cuota)" [attr.aria-label]="'Abrir cuota ' + cuota.numeroCuota + ' de la gestión ' + promesa.idGestion" class="cursor-pointer whitespace-nowrap rounded font-semibold text-blue-700 underline underline-offset-2 hover:text-blue-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-blue-300 dark:hover:text-blue-200">Cuota {{ cuota.numeroCuota }}</button>
                                    } @else {
                                      <span class="whitespace-nowrap font-semibold text-slate-900 dark:text-white">Cuota {{ cuota.numeroCuota }}</span>
                                    }
                                    <span class="inline-flex rounded-full px-1.5 py-0.5 text-[9px] font-bold" [class]="getEstadoClass(cuota.estado)">{{ cuota.estado }}</span>
                                  </p>
                                </td>
                                <td class="px-1.5 py-1.5 text-slate-700 dark:text-slate-300">
                                  <p>{{ formatDate(cuota.fechaPromesa) }}</p>
                                  <p class="font-semibold">S/ {{ formatMoney(cuota.montoPromesa) }}</p>
                                </td>
                                <td class="px-1.5 py-1.5 text-slate-700 dark:text-slate-300">
                                  @if (hasValue(getPbpAgentFecha(cuota)) || cuota.pagos.length > 1) {
                                    <p class="flex items-center gap-1">
                                      <span class="whitespace-nowrap">{{ formatDate(getPbpAgentFecha(cuota)) }}</span>
                                      @if (cuota.pagos.length > 1) {
                                        <span class="shrink-0 rounded-full bg-indigo-100 px-1.5 py-0.5 text-[9px] font-bold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300" [attr.title]="cuota.pagos.length + ' pagos registrados en esta cuota'">
                                          <span aria-hidden="true">{{ cuota.pagos.length }}</span>
                                          <span class="sr-only">{{ cuota.pagos.length }} pagos registrados</span>
                                        </span>
                                      }
                                    </p>
                                  }
                                  @if (getPbpAgentMonto(cuota) !== null && getPbpAgentMonto(cuota) !== undefined) {
                                    <p class="font-bold text-slate-900 dark:text-white">S/ {{ formatMoney(getPbpAgentMonto(cuota)) }}</p>
                                  }
                                </td>
                                <td class="px-1.5 py-1.5">
                                  @if (cuota.pagos.length > 0) {
                                    <div>
                                      <span class="flex gap-1 overflow-hidden whitespace-nowrap">
                                        <span class="shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold" [class]="hasPagoVerificado(cuota) ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'">
                                          {{ hasPagoVerificado(cuota) ? 'Verificado' : 'No verificado' }}
                                        </span>
                                        @for (id of getPagoBancarioIds(cuota); track id) {
                                          @if (permiteCorregir ? permiteAjustes() : !!contextoRecalculo()) {
                                            <button type="button" (click)="$event.stopPropagation(); abrirFichaPago(id)" [attr.aria-label]="permiteCorregir ? 'Abrir ficha del pago bancario ' + id : 'Abrir el pago bancario ' + id + ' en Corrección de pagos (otra pestaña)'" [title]="permiteCorregir ? 'Ficha del pago bancario (ajustes finos)' : 'Abrir en Corrección de pagos'" class="rounded-full bg-blue-100 px-1.5 py-0.5 text-[9px] font-bold text-blue-700 underline underline-offset-2 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:bg-blue-900/40 dark:text-blue-300 dark:hover:bg-blue-900/70">Pb {{ id }}</button>
                                          } @else {
                                            <span class="rounded-full bg-blue-100 px-1.5 py-0.5 text-[9px] font-bold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">Pb {{ id }}</span>
                                          }
                                        }
                                        @for (operacion of getOperaciones(cuota); track operacion) {
                                          <span class="rounded-full bg-slate-200 px-1.5 py-0.5 text-[9px] font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-300">Op. {{ operacion }}</span>
                                        }
                                      </span>
                                      <!-- Solo el primer pago; el resto se ve en el detalle -->
                                      <span class="mt-0.5 flex min-w-0 items-center gap-1.5 text-[9px] text-slate-600 dark:text-slate-400">
                                        @if (cuota.pagos[0].verificadoBanco && cuota.pagos[0].fechaBanco) {
                                          <span class="truncate" title="Fecha que reportó el banco">Banco {{ formatDate(cuota.pagos[0].fechaBanco) }}{{ hasValue(cuota.pagos[0].banco) ? ' · ' + cuota.pagos[0].banco : '' }} · S/ {{ formatMoney(cuota.pagos[0].montoBanco ?? cuota.pagos[0].montoPago) }}</span>
                                          @if (periodoDistinto(cuota.pagos[0])) {
                                            <span class="shrink-0 rounded-full bg-amber-100 px-1.5 py-0.5 font-bold text-amber-800 dark:bg-amber-900/40 dark:text-amber-300" title="El banco cuenta este pago en otro mes">Cuenta en {{ formatPeriodo(cuota.pagos[0].periodoBanco) }}</span>
                                          }
                                        } @else {
                                          <span class="truncate">{{ formatDate(cuota.pagos[0].fechaPago) }}{{ hasValue(cuota.pagos[0].banco) ? ' · ' + cuota.pagos[0].banco : '' }} · S/ {{ formatMoney(cuota.pagos[0].montoPago) }}</span>
                                        }
                                        @if (cuota.pagos.length > 1) {
                                          <span class="shrink-0 whitespace-nowrap font-bold text-slate-700 dark:text-slate-300">+{{ cuota.pagos.length - 1 }} más</span>
                                        }
                                      </span>
                                    </div>
                                  }
                                </td>
                                <td class="px-1.5 py-1.5">
                                  @if ((cuota.adjuntos || []).length > 0) {
                                    <button type="button" (click)="$event.stopPropagation(); abrirVisorVoucher(promesa, cuota)" [attr.aria-label]="'Ver voucher de la cuota ' + cuota.numeroCuota" class="inline-flex items-center gap-1 rounded-md border border-blue-600 bg-blue-50 px-1.5 py-1 text-[9px] font-bold text-blue-700 hover:bg-blue-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 dark:border-blue-400 dark:bg-blue-950/40 dark:text-blue-300 dark:hover:bg-blue-900/50">
                                      Ver
                                      <span class="rounded-full bg-blue-600 px-1 text-[8px] leading-3 text-white dark:bg-blue-400 dark:text-slate-900">{{ cuota.adjuntos!.length }}</span>
                                    </button>
                                    @if (getPagosConVoucher(cuota) < cuota.pagos.length) {
                                      <p class="mt-0.5 truncate text-[9px] font-semibold leading-tight text-amber-600 dark:text-amber-400" [attr.title]="getPagosConVoucher(cuota) + ' de ' + cuota.pagos.length + ' pagos con voucher'">
                                        <span aria-hidden="true">{{ getPagosConVoucher(cuota) }}/{{ cuota.pagos.length }} con voucher</span>
                                        <span class="sr-only">{{ getPagosConVoucher(cuota) }} de {{ cuota.pagos.length }} pagos con voucher</span>
                                      </p>
                                    }
                                  } @else {
                                    <span class="text-slate-400 dark:text-slate-500">—</span>
                                  }
                                </td>
                              </tr>
                            } @empty {
                              <tr>
                                <td colspan="5" class="px-3 py-6 text-center text-slate-500 dark:text-slate-400">Sin cuotas registradas.</td>
                              </tr>
                            }
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </details>
                } @empty {
                  <div class="rounded-xl border border-slate-200 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">No hay promesas para este cliente.</div>
                }
              </div>
              }
            }
          </div>
        </aside>
      </div>


      @if (detallePromesa && detalleCuota) {
        <div class="fixed inset-0 z-[1110] flex items-center justify-center bg-slate-900/50 p-4" (click)="cerrarDetallePagos()">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="detalle-pagos-titulo"
            cdkTrapFocus
            [cdkTrapFocusAutoCapture]="true"
            class="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
            (click)="$event.stopPropagation()"
          >
            <header class="flex items-start justify-between gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-700">
              <div class="min-w-0">
                <h3 id="detalle-pagos-titulo" cdkFocusInitial tabindex="-1" class="text-base font-bold text-slate-900 focus:outline-none dark:text-white">
                  Pagos de la cuota {{ detalleCuota.numeroCuota }}
                </h3>
                <p class="mt-0.5 truncate text-xs text-slate-600 dark:text-slate-400">
                  Gestión {{ detallePromesa.idGestion }} · {{ detallePromesa.nombreAgente || 'Sin agente' }} · Cliente {{ documento || resumen?.documento }}
                </p>
              </div>
              <button type="button" (click)="cerrarDetallePagos()" aria-label="Cerrar" class="shrink-0 rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-slate-300 dark:hover:bg-slate-800">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </header>

            <div class="flex-1 space-y-4 overflow-y-auto px-5 py-4">
              <dl class="grid grid-cols-2 gap-3 rounded-lg bg-slate-50 p-3 text-sm sm:grid-cols-4 dark:bg-slate-800/60">
                <div>
                  <dt class="text-xs text-slate-600 dark:text-slate-400">Vence</dt>
                  <dd class="font-semibold text-slate-900 dark:text-white">{{ formatDate(detalleCuota.fechaPromesa) || '—' }}</dd>
                </div>
                <div>
                  <dt class="text-xs text-slate-600 dark:text-slate-400">Monto promesa</dt>
                  <dd class="font-semibold text-slate-900 dark:text-white">S/ {{ formatMoney(detalleCuota.montoPromesa) }}</dd>
                </div>
                <div>
                  <dt class="text-xs text-slate-600 dark:text-slate-400">Total de pagos</dt>
                  <dd class="font-semibold text-slate-900 dark:text-white">S/ {{ formatMoney(getTotalPagos(detalleCuota)) }}</dd>
                </div>
                <div>
                  <dt class="text-xs text-slate-600 dark:text-slate-400">Estado</dt>
                  <dd><span class="inline-flex rounded-full px-2 py-0.5 text-xs font-bold" [class]="getEstadoClass(detalleCuota.estado)">{{ detalleCuota.estado }}</span></dd>
                </div>
              </dl>

              <div class="relative overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                <table class="min-w-full text-xs">
                  <caption class="sr-only">Pagos registrados en la cuota {{ detalleCuota.numeroCuota }}</caption>
                  <thead class="bg-slate-100 text-left text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    <tr>
                      <th scope="col" class="px-3 py-2 font-bold">Fecha de pago</th>
                      <th scope="col" class="px-3 py-2 text-right font-bold">Monto</th>
                      <th scope="col" class="px-3 py-2 font-bold">Banco</th>
                      <th scope="col" class="px-3 py-2 font-bold">Nro. operación</th>
                      <th scope="col" class="px-3 py-2 font-bold">Conciliación</th>
                      <th scope="col" class="px-3 py-2 font-bold">Voucher</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
                    @for (pago of detalleCuota.pagos; track pago.pagoCuotaId) {
                      <tr class="align-top">
                        <td class="whitespace-nowrap px-3 py-2 text-slate-800 dark:text-slate-200">{{ formatDate(pago.fechaPago) }}</td>
                        <td class="whitespace-nowrap px-3 py-2 text-right font-semibold text-slate-900 dark:text-white">S/ {{ formatMoney(pago.montoPago) }}</td>
                        <td class="px-3 py-2 text-slate-800 dark:text-slate-200">{{ pago.banco || '—' }}</td>
                        <td class="px-3 py-2 font-mono text-slate-800 dark:text-slate-200">{{ pago.numeroOperacion || '—' }}</td>
                        <td class="px-3 py-2">
                          @if (pago.verificadoBanco) {
                            <span class="inline-flex rounded-full bg-emerald-100 px-2 py-0.5 font-bold text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">Verificado</span>
                            @if (pago.fechaBanco) {
                              <p class="mt-0.5 text-[11px] font-semibold text-slate-800 dark:text-slate-200">
                                Banco: {{ formatDate(pago.fechaBanco) }} · S/ {{ formatMoney(pago.montoBanco ?? pago.montoPago) }}
                                @if (periodoDistinto(pago)) {
                                  <span class="ml-1 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">Cuenta en {{ formatPeriodo(pago.periodoBanco) }}</span>
                                }
                              </p>
                            }
                            <p class="mt-0.5 text-[11px] text-slate-600 dark:text-slate-400">
                              Conciliado {{ formatDateTime(pago.fechaVerificacion) }}
                              @if (pago.pagoBancarioId) {
                                · Pago bancario {{ pago.pagoBancarioId }}
                              }
                            </p>
                          } @else {
                            <span class="inline-flex rounded-full bg-slate-200 px-2 py-0.5 font-bold text-slate-700 dark:bg-slate-700 dark:text-slate-200">No verificado</span>
                          }
                        </td>
                        <td class="px-3 py-2 text-slate-800 dark:text-slate-200">
                          @if ((detalleCuota.adjuntos || []).length === 0) {
                            —
                          } @else {
                            {{ pago.tieneVoucher ? 'Con voucher' : 'Sin voucher' }}
                          }
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>

            <footer class="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 px-5 py-3 dark:border-slate-700">
              @if ((detalleCuota.adjuntos || []).length > 0) {
                <button type="button" (click)="abrirVisorVoucher(detallePromesa, detalleCuota)" class="rounded-lg border border-blue-600 bg-blue-50 px-3 py-2 text-xs font-bold text-blue-800 hover:bg-blue-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-blue-400 dark:bg-blue-950/40 dark:text-blue-200 dark:hover:bg-blue-900/50">
                  Ver {{ detalleCuota.adjuntos!.length === 1 ? 'voucher' : detalleCuota.adjuntos!.length + ' vouchers' }}
                </button>
              } @else {
                <p class="text-xs text-slate-600 dark:text-slate-400">La cuota no tiene vouchers adjuntos.</p>
              }
              <button type="button" (click)="cerrarDetallePagos()" class="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800">Cerrar</button>
            </footer>
          </div>
        </div>
      }

      @if (visorVoucherPromesa && visorVoucherCuota) {
        <div class="fixed inset-0 z-[1200] flex items-center justify-center bg-slate-900/60 p-4" (click)="cerrarVisorVoucher()">
          <div role="dialog" aria-modal="true" aria-labelledby="visor-voucher-titulo" class="grid max-h-[92vh] w-full max-w-4xl grid-cols-1 overflow-auto rounded-xl border border-slate-200 bg-white shadow-2xl md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] dark:border-slate-700 dark:bg-slate-900" (click)="$event.stopPropagation()">
            <div class="flex min-h-[320px] items-center justify-center bg-slate-100 p-5 dark:bg-slate-800/60">
              @if (visorVoucherCargando) {
                <p class="text-sm text-slate-500 dark:text-slate-400">Cargando voucher...</p>
              } @else if (visorVoucherError) {
                <p class="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700 dark:border-red-800 dark:bg-red-950/20 dark:text-red-300">{{ visorVoucherError }}</p>
              } @else if (visorVoucherUrl && esImagen(getVoucherActual()?.tipoArchivo)) {
                <img [src]="visorVoucherUrl" [alt]="'Voucher de la cuota ' + visorVoucherCuota.numeroCuota" class="max-h-[80vh] max-w-full rounded-md object-contain shadow-lg" />
              } @else if (visorVoucherUrl) {
                <a [href]="visorVoucherUrl" target="_blank" rel="noopener" class="rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white hover:bg-blue-700">Abrir archivo</a>
              }
            </div>

            <div class="flex flex-col gap-4 p-5">
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <h3 id="visor-voucher-titulo" class="text-base font-bold text-slate-900 dark:text-white">
                    Voucher · Cuota {{ visorVoucherCuota.numeroCuota }}
                  </h3>
                  <p class="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
                    Gestión {{ visorVoucherPromesa.idGestion }} · Cliente {{ documento || resumen?.documento }}
                  </p>
                </div>
                <button type="button" (click)="cerrarVisorVoucher()" class="shrink-0 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">Cerrar</button>
              </div>

              <dl class="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-2 text-sm">
                <dt class="text-slate-500 dark:text-slate-400">Subido por</dt>
                <dd class="font-semibold text-slate-900 dark:text-white">{{ visorVoucherPromesa.nombreAgente || 'Sin agente' }}</dd>
                <dt class="text-slate-500 dark:text-slate-400">Fecha</dt>
                <dd class="font-mono font-semibold tabular-nums text-slate-900 dark:text-white">{{ formatDateTime(getVoucherActual()?.fechaCreacion) || '—' }}</dd>
                <dt class="text-slate-500 dark:text-slate-400">Archivo</dt>
                <dd class="break-all font-mono font-semibold text-slate-900 dark:text-white">{{ getVoucherActual()?.nombreArchivo }}{{ getVoucherActual()?.tamanoBytes ? ' · ' + formatTamano(getVoucherActual()?.tamanoBytes) : '' }}</dd>
                <dt class="text-slate-500 dark:text-slate-400">Monto registrado</dt>
                <dd class="font-mono font-semibold tabular-nums text-slate-900 dark:text-white">
                  @if (getPbpAgentMonto(visorVoucherCuota) !== null && getPbpAgentMonto(visorVoucherCuota) !== undefined) {
                    S/ {{ formatMoney(getPbpAgentMonto(visorVoucherCuota)) }}
                  } @else {
                    —
                  }
                </dd>
                <dt class="text-slate-500 dark:text-slate-400">Banco</dt>
                <dd class="font-semibold" [class]="hasPagoVerificado(visorVoucherCuota) ? 'text-emerald-600 dark:text-emerald-300' : 'text-slate-900 dark:text-white'">{{ visorVoucherCuota.pagos.length === 0 ? '—' : (hasPagoVerificado(visorVoucherCuota) ? 'Verificado' : 'No verificado') }}</dd>
              </dl>

              @if (visorVoucherUrl) {
                <div class="flex flex-wrap gap-2">
                  <a [href]="visorVoucherUrl" target="_blank" rel="noopener" class="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-700">Abrir en tamaño completo</a>
                  <a [href]="visorVoucherUrl" [attr.download]="getVoucherActual()?.nombreArchivo || 'voucher'" class="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">Descargar</a>
                </div>
              }

              <div class="mt-auto flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span class="tabular-nums">{{ visorVoucherIndice + 1 }} de {{ (visorVoucherCuota.adjuntos || []).length }}</span>
                @if ((visorVoucherCuota.adjuntos || []).length > 1) {
                  <div class="flex items-center gap-1">
                    <button type="button" (click)="moverVoucher(-1)" [disabled]="visorVoucherIndice === 0" aria-label="Voucher anterior" class="rounded-lg border border-slate-300 px-2.5 py-1 font-semibold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800">←</button>
                    <button type="button" (click)="moverVoucher(1)" [disabled]="visorVoucherIndice >= visorVoucherCuota.adjuntos!.length - 1" aria-label="Voucher siguiente" class="rounded-lg border border-slate-300 px-2.5 py-1 font-semibold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800">→</button>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      }
    }

    <app-ajuste-pago-banco-dialog
      [pagoBancoId]="fichaPagoId"
      [pagoVoluntarioId]="voluntarioPagoCuotaId"
      [contexto]="contextoRecalculo()"
      (cerrado)="onAjusteCerrado($event)"
    ></app-ajuste-pago-banco-dialog>
  `
})
export class ClienteResumenConciliacionDrawerWidget implements OnChanges, OnDestroy {
  private fmt = inject(FormatService);
  private bcpPagosService = inject(BcpPagosService);
  private sanitizer = inject(DomSanitizer);
  private menuLateral = inject(MenuLateralService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private location = inject(Location);
  private menuPlegado = false;
  activeView: 'promesas' | 'cancelaciones' = 'promesas';
  @Input() open = false;
  @Input() loading = false;
  @Input() error: string | null = null;
  @Input() documento: string | null = null;
  @Input() resumen: ResumenConciliacionCliente | null = null;
  @Input() mode: 'drawer' | 'inline' = 'drawer';
  @Input() tenantId: number | null = null;
  @Input() carteraId: number | null = null;
  @Input() subcarteraId: number | null = null;
  @Output() close = new EventEmitter<void>();
  /**
   * Con true, abrir una cuota avisa a la pantalla (corregirCuota) para que muestre sus pagos y controles.
   * Con false, el panel muestra su propio detalle de pagos, de solo lectura.
   */
  @Input() permiteCorregir = false;
  @Output() corregirCuota = new EventEmitter<{ promesa: PromesaResumenConciliacion; cuota: CuotaResumenConciliacion }>();
  /** Un ajuste fino cambió los datos del cliente: la pantalla debe volver a cargar el resumen. */
  @Output() ajustado = new EventEmitter<string>();

  /** Ajustes finos (ficha del pago bancario, desconciliar, eliminar pago voluntario): solo administradores. */
  fichaPagoId: number | null = null;
  voluntarioPagoCuotaId: number | null = null;

  detallePromesa: PromesaResumenConciliacion | null = null;
  detalleCuota: CuotaResumenConciliacion | null = null;

  visorVoucherPromesa: PromesaResumenConciliacion | null = null;
  visorVoucherCuota: CuotaResumenConciliacion | null = null;
  visorVoucherIndice = 0;
  visorVoucherUrl: SafeUrl | null = null;
  visorVoucherCargando = false;
  visorVoucherError: string | null = null;
  private visorVoucherObjectUrl: string | null = null;
  private visorVoucherSub: Subscription | null = null;

  /** Recálculo de la carta de no adeudo (PAGO_CUMPLIDO). */
  recalculando = false;
  /** Tras recalcular hay una espera corta, para que no se repita en ráfaga. */
  enEspera = false;
  mensajeRecalculo = '';
  private esperaRecalculo: ReturnType<typeof setTimeout> | null = null;
  private static readonly ESPERA_RECALCULO_MS = 30000;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open'] || changes['mode']) {
      this.sincronizarMenu(this.open && this.mode === 'drawer');
    }
    if ((changes['open'] && !this.open) || changes['resumen']) {
      this.cerrarVisorVoucher();
      this.cerrarDetallePagos();
      this.mensajeRecalculo = '';
    }
  }

  puedeRecalcular(): boolean {
    return !!this.documentoActual() && !!this.contextoRecalculo();
  }

  recalcularPagoCumplido(): void {
    const documento = this.documentoActual();
    const contexto = this.contextoRecalculo();
    if (!documento || !contexto || this.recalculando || this.enEspera) return;

    this.recalculando = true;
    this.mensajeRecalculo = '';
    this.bcpPagosService.recalcularPagoCumplido(documento, contexto).subscribe({
      next: respuesta => {
        this.recalculando = false;
        if (this.resumen) {
          this.resumen = { ...this.resumen, pagoCumplido: respuesta.pagoCumplido };
        }
        this.mensajeRecalculo = respuesta.cambio ? 'Actualizado' : 'Sin cambios';
        this.iniciarEspera();
      },
      error: err => {
        this.recalculando = false;
        this.mensajeRecalculo = err?.error?.mensaje || 'No se pudo recalcular';
        this.iniciarEspera();
      }
    });
  }

  documentoActual(): string | null {
    return this.documento || this.resumen?.documento || null;
  }

  permiteAjustes(): boolean {
    return this.authService.hasAnyRole('ADMIN') && !!this.contextoRecalculo();
  }

  /** Gestión PAGO VOLUNTARIO del sistema cuyo pago no tiene pago del banco: queda suelta y bloquea el próximo enlace. */
  pagoVoluntarioSinBanco(promesa: PromesaResumenConciliacion): PagoResumenConciliacion | null {
    const ruta = String(promesa.rutaTipificacion || '').toUpperCase();
    if (!ruta.includes('PAGO VOLUNTARIO')) return null;
    const pagos = (promesa.cuotas || []).flatMap(cuota => cuota.pagos || []);
    if (pagos.length !== 1) return null;
    const pago = pagos[0];
    return !pago.verificadoBanco && !pago.pagoBancarioId ? pago : null;
  }

  abrirFichaPago(pagoId: number): void {
    if (!this.permiteCorregir) {
      window.open(this.enlaceCorreccion(pagoId), '_blank', 'noopener');
      return;
    }
    this.voluntarioPagoCuotaId = null;
    this.fichaPagoId = pagoId;
  }

  abrirEliminarVoluntario(pagoCuotaId: number): void {
    if (!this.permiteCorregir) {
      window.open(this.enlaceCorreccion(), '_blank', 'noopener');
      return;
    }
    this.fichaPagoId = null;
    this.voluntarioPagoCuotaId = pagoCuotaId;
  }

  /** Corrección de pagos con este cliente cargado; con pb, abre además la ficha de ese pago. */
  enlaceCorreccion(pb?: number): string {
    const contexto = this.contextoRecalculo();
    if (!contexto) return '';
    return urlCorreccionPagos(this.router, this.location, contexto, this.documentoActual(), pb);
  }

  onAjusteCerrado(evento: { huboCambios: boolean; documento: string | null }): void {
    this.fichaPagoId = null;
    this.voluntarioPagoCuotaId = null;
    const documento = evento.documento || this.documentoActual();
    if (evento.huboCambios && documento) {
      this.ajustado.emit(documento);
    }
  }

  contextoRecalculo(): { tenantId: number; carteraId: number; subcarteraId: number } | null {
    const tenantId = Number(this.tenantId ?? this.resumen?.tenantId);
    const carteraId = Number(this.carteraId ?? this.resumen?.carteraId);
    const subcarteraId = Number(this.subcarteraId ?? this.resumen?.subcarteraId);
    return tenantId > 0 && carteraId > 0 && subcarteraId > 0 ? { tenantId, carteraId, subcarteraId } : null;
  }

  private iniciarEspera(): void {
    this.enEspera = true;
    if (this.esperaRecalculo) clearTimeout(this.esperaRecalculo);
    this.esperaRecalculo = setTimeout(() => {
      this.enEspera = false;
      this.esperaRecalculo = null;
    }, ClienteResumenConciliacionDrawerWidget.ESPERA_RECALCULO_MS);
  }

  ngOnDestroy(): void {
    if (this.esperaRecalculo) clearTimeout(this.esperaRecalculo);
    this.liberarVoucherActual();
    this.sincronizarMenu(false);
  }

  /** Como panel lateral, pliega el menú principal mientras está abierto. */
  private sincronizarMenu(plegar: boolean): void {
    if (plegar === this.menuPlegado) return;
    this.menuPlegado = plegar;
    if (plegar) {
      this.menuLateral.panelAbierto();
    } else {
      this.menuLateral.panelCerrado();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    // El diálogo de ajuste maneja su propio Escape.
    if (this.fichaPagoId || this.voluntarioPagoCuotaId) return;
    // El visor se abre encima del detalle: se cierra primero.
    if (this.visorVoucherCuota) {
      this.cerrarVisorVoucher();
    } else if (this.detalleCuota) {
      this.cerrarDetallePagos();
    }
  }

  /** Sin corrección, una cuota sin pagos no tiene nada que mostrar. */
  cuotaAbrible(cuota: CuotaResumenConciliacion): boolean {
    return this.permiteCorregir || (cuota.pagos || []).length > 0;
  }

  abrirCuota(promesa: PromesaResumenConciliacion, cuota: CuotaResumenConciliacion): void {
    if (this.permiteCorregir) {
      this.corregirCuota.emit({ promesa, cuota });
    } else {
      this.abrirDetallePagos(promesa, cuota);
    }
  }

  abrirDetallePagos(promesa: PromesaResumenConciliacion, cuota: CuotaResumenConciliacion): void {
    if (!(cuota.pagos || []).length) return;
    this.detallePromesa = promesa;
    this.detalleCuota = cuota;
  }

  cerrarDetallePagos(): void {
    this.detallePromesa = null;
    this.detalleCuota = null;
  }

  getTotalPagos(cuota: CuotaResumenConciliacion): number {
    return (cuota.pagos || []).reduce((total, pago) => total + Number(pago.montoPago || 0), 0);
  }

  @HostListener('document:keydown.arrowleft')
  onArrowLeft(): void {
    if (this.visorVoucherCuota) this.moverVoucher(-1);
  }

  @HostListener('document:keydown.arrowright')
  onArrowRight(): void {
    if (this.visorVoucherCuota) this.moverVoucher(1);
  }

  abrirVisorVoucher(promesa: PromesaResumenConciliacion, cuota: CuotaResumenConciliacion): void {
    if (!(cuota.adjuntos || []).length) return;
    this.visorVoucherPromesa = promesa;
    this.visorVoucherCuota = cuota;
    this.cargarVoucher(0);
  }

  cerrarVisorVoucher(): void {
    this.liberarVoucherActual();
    this.visorVoucherPromesa = null;
    this.visorVoucherCuota = null;
    this.visorVoucherIndice = 0;
    this.visorVoucherError = null;
  }

  moverVoucher(delta: number): void {
    const total = this.visorVoucherCuota?.adjuntos?.length || 0;
    const siguiente = this.visorVoucherIndice + delta;
    if (siguiente < 0 || siguiente >= total) return;
    this.cargarVoucher(siguiente);
  }

  getPagosConVoucher(cuota: CuotaResumenConciliacion): number {
    return (cuota.pagos || []).filter(pago => pago.tieneVoucher).length;
  }

  getVoucherActual(): AdjuntoResumenConciliacion | null {
    return this.visorVoucherCuota?.adjuntos?.[this.visorVoucherIndice] || null;
  }

  esImagen(tipoArchivo: string | null | undefined): boolean {
    return String(tipoArchivo || '').toLowerCase().startsWith('image/');
  }

  formatTamano(bytes: number | null | undefined): string {
    if (!bytes) return '';
    if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  private cargarVoucher(indice: number): void {
    const adjunto = this.visorVoucherCuota?.adjuntos?.[indice];
    if (!adjunto) return;

    this.liberarVoucherActual();
    this.visorVoucherIndice = indice;
    this.visorVoucherError = null;

    if (!this.hasRequiredContext()) {
      this.visorVoucherError = 'Selecciona proveedor, cartera y subcartera para ver el voucher.';
      return;
    }

    this.visorVoucherCargando = true;
    this.visorVoucherSub = this.bcpPagosService.obtenerArchivoComprobante(adjunto.uuid, {
      tenantId: Number(this.tenantId),
      carteraId: Number(this.carteraId),
      subcarteraId: Number(this.subcarteraId)
    }).subscribe({
      next: (blob) => {
        this.visorVoucherObjectUrl = URL.createObjectURL(blob);
        this.visorVoucherUrl = this.sanitizer.bypassSecurityTrustUrl(this.visorVoucherObjectUrl);
        this.visorVoucherCargando = false;
      },
      error: (error) => {
        this.visorVoucherError = error?.status === 404
          ? 'El voucher no está disponible: fue eliminado, no pertenece a esta subcartera o el archivo ya no está en el servidor.'
          : 'No se pudo cargar el voucher. Intenta de nuevo.';
        this.visorVoucherCargando = false;
      }
    });
  }

  private liberarVoucherActual(): void {
    this.visorVoucherSub?.unsubscribe();
    this.visorVoucherSub = null;
    if (this.visorVoucherObjectUrl) {
      URL.revokeObjectURL(this.visorVoucherObjectUrl);
    }
    this.visorVoucherObjectUrl = null;
    this.visorVoucherUrl = null;
    this.visorVoucherCargando = false;
  }

  onBackdropClick(): void {
    if (this.mode === 'drawer') {
      this.close.emit();
    }
  }

  formatMoney(value: number | null | undefined): string {
    if (value === null || value === undefined) return '0.00';
    return Number(value).toFixed(2);
  }

  /** Pago verificado cuyo mes en el banco no es el de su fecha (pago de fin de mes que llegó con fecha del mes siguiente). */
  periodoDistinto(pago: PagoResumenConciliacion | null | undefined): boolean {
    if (!pago?.periodoBanco || !pago.fechaBanco) return false;
    return pago.periodoBanco !== String(pago.fechaBanco).slice(0, 7).replace('-', '');
  }

  formatPeriodo(periodo: string | null | undefined): string {
    if (!periodo || periodo.length !== 6) return '';
    return `${periodo.slice(4, 6)}/${periodo.slice(0, 4)}`;
  }

  formatDate(value: string | null | undefined): string {
    if (!this.hasValue(value)) return '';
    const text = String(value);
    const match = text.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) return `${match[3]}-${match[2]}-${match[1]}`;

    const date = new Date(text);
    if (Number.isNaN(date.getTime())) return String(value);

    return this.fmt.date(date).replace(/\//g, '-');
  }

  formatDateTime(value: string | null | undefined): string {
    if (!this.hasValue(value)) return '';
    const text = String(value);
    const match = text.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
    if (match) return `${match[3]}-${match[2]}-${match[1]} ${match[4]}:${match[5]}`;

    const date = new Date(text);
    if (Number.isNaN(date.getTime())) return String(value);

    return this.fmt.dateTime(date).replace(/\//g, '-');
  }

  hasValue(value: unknown): boolean {
    return value !== null && value !== undefined && String(value).trim() !== '' && String(value).trim() !== '-';
  }
  /** Sin pago real en la cuota, se muestra el pago del asesor que aún no verifica el banco. */
  getPbpAgentFecha(cuota: CuotaResumenConciliacion): string | null {
    if (this.hasValue(cuota.fechaPagoReal)) return cuota.fechaPagoReal;
    return this.getPagoNoVerificado(cuota)?.fechaPago || null;
  }

  getPbpAgentMonto(cuota: CuotaResumenConciliacion): number | null {
    const montoReal = cuota.montoPagadoReal;
    if (montoReal !== null && montoReal !== undefined && Number(montoReal) > 0) return montoReal;
    return this.getPagoNoVerificado(cuota)?.montoPago ?? montoReal ?? null;
  }

  private getPagoNoVerificado(cuota: CuotaResumenConciliacion): PagoResumenConciliacion | null {
    return (cuota.pagos || []).find(pago => pago.verificadoBanco === false) || null;
  }

  hasPagoVerificado(cuota: any): boolean {
    return (cuota?.pagos || []).some((pago: any) => pago.verificadoBanco === true);
  }

  getPagoBancarioIds(cuota: any): number[] {
    return Array.from(new Set<number>((cuota?.pagos || [])
      .map((pago: any) => pago.pagoBancarioId)
      .filter((id: number | null | undefined): id is number => id !== null && id !== undefined)));
  }

  getOperaciones(cuota: any): string[] {
    return Array.from(new Set<string>((cuota?.pagos || [])
      .map((pago: any) => pago.numeroOperacion)
      .filter((operacion: string | null | undefined): operacion is string => this.hasValue(operacion))));
  }

  getEstadoClass(estado: string | null | undefined): string {
    if (estado === 'PAGADA') return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300';
    if (estado === 'PARCIAL') return 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300';
    if (estado === 'VENCIDA') return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300';
    return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300';
  }

  getIntentosCancelacion(): NonNullable<ResumenConciliacionCliente['intentosCancelacion']> {
    return this.resumen?.intentosCancelacion || [];
  }

  formatMetodoContacto(value: string | null | undefined): string {
    const labels: Record<string, string> = {
      GESTION_AUTOMATICA: 'Automática',
      GESTION_MANUAL: 'Manual',
      GESTION_PROGRESIVO: 'Progresivo',
      GESTION_PREDICTIVO: 'Predictivo'
    };
    return value ? labels[value] || value : 'Sin método';
  }

  getMetodoClass(value: string | null | undefined): string {
    if (value === 'GESTION_AUTOMATICA') return 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300';
    if (value === 'GESTION_MANUAL') return 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300';
    if (value === 'GESTION_PROGRESIVO') return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300';
    if (value === 'GESTION_PREDICTIVO') return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300';
    return 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300';
  }

  private hasRequiredContext(): boolean {
    return Number(this.tenantId) > 0 && Number(this.carteraId) > 0 && Number(this.subcarteraId) > 0;
  }

}
