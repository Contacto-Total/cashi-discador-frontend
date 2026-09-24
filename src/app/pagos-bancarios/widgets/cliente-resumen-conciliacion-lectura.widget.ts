import { Component, EventEmitter, HostListener, Input, OnDestroy, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { FormatService } from '@/shared/services/format.service';
import {
  AdjuntoResumenConciliacion,
  CuotaResumenConciliacion,
  PromesaResumenConciliacion,
  ResumenConciliacionCliente
} from '../models/bcp-archivo.model';
import { BcpPagosService } from '../services/bcp-pagos.service';

/**
 * Replica de solo lectura de ClienteResumenConciliacionDrawerWidget.
 * Muestra promesas, cuotas, pagos, conciliaciones de banco y vouchers,
 * sin ningun control de modificacion (crear/eliminar/ampliar/corregir/
 * regularizar/pago voluntario).
 */
@Component({
  selector: 'app-cliente-resumen-conciliacion-lectura',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (open) {
      <div
        [class]="mode === 'drawer' ? 'fixed inset-0 z-50 flex justify-end bg-transparent' : 'mt-4'"
        (click)="onBackdropClick()">
        <aside
          [class]="mode === 'drawer'
            ? 'h-screen w-[520px] max-w-[94vw] overflow-y-auto border-l border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900'
            : 'w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900'"
          (click)="$event.stopPropagation()">
          <ng-container *ngTemplateOutlet="contenido"></ng-container>
        </aside>
      </div>
    }

    @if (visorVoucherPromesa && visorVoucherCuota) {
      <div class="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 p-4" (click)="cerrarVisorVoucher()">
        <div role="dialog" aria-modal="true" aria-labelledby="visor-voucher-titulo-lectura" class="grid max-h-[92vh] w-full max-w-4xl grid-cols-1 overflow-auto rounded-xl border border-slate-200 bg-white shadow-2xl md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] dark:border-slate-700 dark:bg-slate-900" (click)="$event.stopPropagation()">
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
                <h3 id="visor-voucher-titulo-lectura" class="text-base font-bold text-slate-900 dark:text-white">
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
                @if (visorVoucherCuota.montoPagadoReal !== null && visorVoucherCuota.montoPagadoReal !== undefined) {
                  S/ {{ formatMoney(visorVoucherCuota.montoPagadoReal) }}
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

    <ng-template #contenido>
      <div class="sticky top-0 z-10 border-b border-slate-200 bg-white px-3 py-2.5 dark:border-slate-700 dark:bg-slate-900">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Resumen cliente</p>
            <h2 class="mt-0.5 text-base font-bold text-slate-900 dark:text-white">{{ resumen?.nombreCliente || 'Cliente sin nombre' }}</h2>
            <p class="text-xs text-slate-600 dark:text-slate-300">
              Documento: <span class="font-mono font-semibold">{{ documento || resumen?.documento }}</span>
            </p>
          </div>
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
            <div class="rounded-lg border border-slate-200 p-2 dark:border-slate-700">
              <p class="line-clamp-3 text-[10px] leading-tight text-slate-500 dark:text-slate-400">Carta de no adeudo disponible</p>
              <p class="mt-0.5 text-sm font-bold" [class]="resumen.pagoCumplido ? 'text-emerald-600 dark:text-emerald-300' : 'text-amber-600 dark:text-amber-300'">{{ resumen.pagoCumplido ? 'Sí' : 'No' }}</p>
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
                            <tr class="align-top hover:bg-slate-50 dark:hover:bg-slate-800/50">
                              <td class="px-1.5 py-1.5">
                                <p class="font-semibold text-slate-900 dark:text-white">Cuota {{ cuota.numeroCuota }}</p>
                                <span class="mt-0.5 inline-flex rounded-full px-1.5 py-0.5 text-[9px] font-bold" [class]="getEstadoClass(cuota.estado)">{{ cuota.estado }}</span>
                              </td>
                              <td class="px-1.5 py-1.5 text-slate-700 dark:text-slate-300">
                                <p>{{ formatDate(cuota.fechaPromesa) }}</p>
                                <p class="font-semibold">S/ {{ formatMoney(cuota.montoPromesa) }}</p>
                              </td>
                              <td class="px-1.5 py-1.5 text-slate-700 dark:text-slate-300">
                                @if (hasValue(cuota.fechaPagoReal)) {
                                  <p>{{ formatDate(cuota.fechaPagoReal) }}</p>
                                }
                                @if (cuota.montoPagadoReal !== null && cuota.montoPagadoReal !== undefined) {
                                  <p class="font-bold text-slate-900 dark:text-white">S/ {{ formatMoney(cuota.montoPagadoReal) }}</p>
                                }
                              </td>
                              <td class="px-1.5 py-1.5">
                                <div class="flex flex-wrap gap-1">
                                  @if (cuota.pagos.length > 0) {
                                    <span class="rounded-full px-1.5 py-0.5 text-[9px] font-bold" [class]="hasPagoVerificado(cuota) ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'">
                                      {{ hasPagoVerificado(cuota) ? 'Verificado' : 'No verificado' }}
                                    </span>
                                  }
                                  @for (id of getPagoBancarioIds(cuota); track id) {
                                    <span class="rounded-full bg-blue-100 px-1.5 py-0.5 text-[9px] font-bold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">Pb {{ id }}</span>
                                  }
                                  @for (operacion of getOperaciones(cuota); track operacion) {
                                    <span class="rounded-full bg-slate-200 px-1.5 py-0.5 text-[9px] font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-300">Op. {{ operacion }}</span>
                                  }
                                </div>
                                @if (cuota.pagos.length > 0) {
                                  <div class="mt-0.5 space-y-0.5 text-[9px] text-slate-500 dark:text-slate-400">
                                    @for (pago of cuota.pagos; track pago.pagoCuotaId) {
                                      <div class="flex items-center justify-between gap-1">
                                        <p class="flex min-w-0 items-center gap-1">
                                          @if ((cuota.adjuntos || []).length > 0) {
                                            @if (pago.tieneVoucher) {
                                              <svg class="h-2.5 w-2.5 shrink-0 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" role="img" aria-label="Con voucher"><title>Con voucher</title><path d="M21.4 11.6 12.2 20.8a6 6 0 0 1-8.5-8.5l9.2-9.2a4 4 0 0 1 5.7 5.7l-9.2 9.2a2 2 0 0 1-2.8-2.8l8.5-8.5"/></svg>
                                            } @else {
                                              <span class="shrink-0 font-bold text-amber-600 dark:text-amber-400" title="Sin voucher" aria-label="Sin voucher">✕</span>
                                            }
                                          }
                                          <span class="truncate">{{ formatDate(pago.fechaPago) }} · {{ pago.banco }} · S/ {{ formatMoney(pago.montoPago) }}</span>
                                        </p>
                                      </div>
                                    }
                                  </div>
                                }
                              </td>
                              <td class="px-1.5 py-1.5">
                                @if ((cuota.adjuntos || []).length > 0) {
                                  <button type="button" (click)="abrirVisorVoucher(promesa, cuota)" [attr.aria-label]="'Ver voucher de la cuota ' + cuota.numeroCuota" class="inline-flex items-center gap-1 rounded-md border border-blue-600 bg-blue-50 px-1.5 py-1 text-[9px] font-bold text-blue-700 hover:bg-blue-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 dark:border-blue-400 dark:bg-blue-950/40 dark:text-blue-300 dark:hover:bg-blue-900/50">
                                    Ver
                                    <span class="rounded-full bg-blue-600 px-1 text-[8px] leading-3 text-white dark:bg-blue-400 dark:text-slate-900">{{ cuota.adjuntos!.length }}</span>
                                  </button>
                                  @if (getPagosConVoucher(cuota) < cuota.pagos.length) {
                                    <p class="mt-1 text-[9px] font-semibold leading-tight text-amber-600 dark:text-amber-400">{{ getPagosConVoucher(cuota) }} de {{ cuota.pagos.length }} pagos con voucher</p>
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
    </ng-template>
  `
})
export class ClienteResumenConciliacionLecturaWidget implements OnDestroy {
  private readonly fmt = inject(FormatService);
  private readonly bcpPagosService = inject(BcpPagosService);
  private readonly sanitizer = inject(DomSanitizer);

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

  visorVoucherPromesa: PromesaResumenConciliacion | null = null;
  visorVoucherCuota: CuotaResumenConciliacion | null = null;
  visorVoucherIndice = 0;
  visorVoucherUrl: SafeUrl | null = null;
  visorVoucherCargando = false;
  visorVoucherError: string | null = null;
  private visorVoucherObjectUrl: string | null = null;
  private visorVoucherSub: Subscription | null = null;

  ngOnDestroy(): void {
    this.liberarVoucherActual();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.visorVoucherCuota) {
      this.cerrarVisorVoucher();
    }
  }

  @HostListener('document:keydown.arrowleft')
  onArrowLeft(): void {
    if (this.visorVoucherCuota) this.moverVoucher(-1);
  }

  @HostListener('document:keydown.arrowright')
  onArrowRight(): void {
    if (this.visorVoucherCuota) this.moverVoucher(1);
  }

  onBackdropClick(): void {
    if (this.mode === 'drawer') {
      this.close.emit();
    }
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

  getVoucherActual(): AdjuntoResumenConciliacion | null {
    return this.visorVoucherCuota?.adjuntos?.[this.visorVoucherIndice] || null;
  }

  getPagosConVoucher(cuota: CuotaResumenConciliacion): number {
    return (cuota.pagos || []).filter(pago => pago.tieneVoucher).length;
  }

  esImagen(tipoArchivo: string | null | undefined): boolean {
    return String(tipoArchivo || '').toLowerCase().startsWith('image/');
  }

  formatTamano(bytes: number | null | undefined): string {
    if (!bytes) return '';
    if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
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

  formatMoney(value: number | null | undefined): string {
    if (value === null || value === undefined) return '0.00';
    return Number(value).toFixed(2);
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

  private hasRequiredContext(): boolean {
    return Number(this.tenantId) > 0 && Number(this.carteraId) > 0 && Number(this.subcarteraId) > 0;
  }
}
