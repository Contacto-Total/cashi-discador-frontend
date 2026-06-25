import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { FormatService } from '@/shared/services/format.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CuotaResumenConciliacion, ResumenConciliacionCliente } from '../models/bcp-archivo.model';
import { CorreccionPagosService } from '../services/correccion-pagos.service';
import { CuotaValidaTipificar } from '../models/correccion-pagos.model';

@Component({
  selector: 'app-cliente-resumen-conciliacion-drawer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (open) {
      <div class="fixed inset-0 z-50 flex justify-end bg-transparent" (click)="close.emit()">
        <aside class="h-screen w-[520px] max-w-[94vw] overflow-y-auto border-l border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900" (click)="$event.stopPropagation()">
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
              <button type="button" (click)="close.emit()" class="rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">Cerrar</button>
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
                  <p class="text-[10px] text-slate-500 dark:text-slate-400">Tiene carta</p>
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
                              <th class="w-[15%] px-1.5 py-1.5 font-semibold">Cuota</th>
                              <th class="w-[23%] px-1.5 py-1.5 font-semibold">Promesa</th>
                              <th class="w-[34%] px-1.5 py-1.5 font-semibold">PBP Agent</th>
                              <th class="w-[28%] px-1.5 py-1.5 font-semibold">BANCO</th>
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
                                  @if (canAmpliarVencimiento(promesa, cuota)) {
                                    <button type="button" (click)="abrirAmpliarVencimiento(promesa, cuota)" class="mt-1 rounded-md bg-red-600 px-2 py-1 text-[9px] font-bold text-white hover:bg-red-700">
                                      Ampliar
                                    </button>
                                  }
                                </td>
                                <td class="px-1.5 py-1.5 text-slate-700 dark:text-slate-300">
                                  @if (hasValue(cuota.fechaPagoReal)) {
                                    <p>{{ formatDate(cuota.fechaPagoReal) }}</p>
                                  }
                                  @if (cuota.montoPagadoReal !== null && cuota.montoPagadoReal !== undefined) {
                                    <p class="font-bold text-slate-900 dark:text-white">S/ {{ formatMoney(cuota.montoPagadoReal) }}</p>
                                  }
                                  @if (canCrearPago(cuota)) {
                                    <button type="button" (click)="abrirCrearPago(cuota)" class="mt-1 rounded-md bg-emerald-600 px-2 py-1 text-[9px] font-bold text-white hover:bg-emerald-700">
                                      Crear Pago
                                    </button>
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
                                        <p class="truncate">{{ formatDate(pago.fechaPago) }} · {{ pago.banco }} · S/ {{ formatMoney(pago.montoPago) }}</p>
                                      }
                                    </div>
                                  }
                                </td>
                              </tr>
                            } @empty {
                              <tr>
                                <td colspan="4" class="px-3 py-6 text-center text-slate-500 dark:text-slate-400">Sin cuotas registradas.</td>
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

      @if (crearPagoModalOpen) {
        <div class="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 p-4" (click)="cerrarCrearPago()">
          <div class="w-full max-w-sm rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900" (click)="$event.stopPropagation()">
            <div class="border-b border-slate-200 px-4 py-3 dark:border-slate-700">
              <h3 class="text-sm font-bold text-slate-900 dark:text-white">Crear pago</h3>
              <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Cuota {{ cuotaCrearPago?.numeroCuota }} · S/ {{ formatMoney(cuotaCrearPago?.montoPromesa) }}</p>
            </div>

            <div class="space-y-3 px-4 py-4">
              <div>
                <label class="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">Fecha de pago</label>
                <input type="date" [(ngModel)]="crearPagoFecha" class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white" />
              </div>
              <div>
                <label class="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">Monto</label>
                <input type="number" min="0.01" step="0.01" [(ngModel)]="crearPagoMonto" class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white" />
              </div>

              @if (crearPagoError) {
                <div class="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700 dark:border-red-800 dark:bg-red-950/20 dark:text-red-300">{{ crearPagoError }}</div>
              }
            </div>

            <div class="flex justify-end gap-2 border-t border-slate-200 px-4 py-3 dark:border-slate-700">
              <button type="button" (click)="cerrarCrearPago()" class="rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">Cancelar</button>
              <button type="button" (click)="crearPago()" [disabled]="!canGuardarCrearPago() || creandoPago" class="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-400">
                {{ creandoPago ? 'Creando...' : 'Crear Pago' }}
              </button>
            </div>
          </div>
        </div>
      }

      @if (ampliarModalOpen) {
        <div class="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 p-4" (click)="cerrarAmpliarVencimiento()">
          <div class="w-full max-w-md rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900" (click)="$event.stopPropagation()">
            <div class="border-b border-slate-200 px-4 py-3 dark:border-slate-700">
              <h3 class="text-sm font-bold text-slate-900 dark:text-white">Ampliar vencimiento</h3>
              <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Cuota {{ cuotaAmpliar?.numeroCuota }} · Vence {{ formatDate(cuotaAmpliar?.fechaPromesa) }} · máximo {{ formatDate(getAmpliarFechaMax()) }}
              </p>
            </div>

            <div class="space-y-3 px-4 py-4">
              <div class="grid grid-cols-2 rounded-lg border border-slate-200 bg-slate-100 p-1 text-xs font-semibold dark:border-slate-700 dark:bg-slate-800">
                <button type="button" (click)="ampliarModo = 'corta'" class="rounded-md px-2 py-1.5 transition-colors" [class]="ampliarModo === 'corta' ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'">
                  Hasta 3 días
                </button>
                <button type="button" (click)="setAmpliarModoMayor()" [disabled]="!ampliarMayorHabilitada" class="rounded-md px-2 py-1.5 transition-colors disabled:cursor-not-allowed disabled:opacity-40" [class]="ampliarModo === 'mayor' ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'">
                  1 cuota dentro mes
                </button>
              </div>

              @if (ampliarModo === 'corta') {
                <div>
                  <label class="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">Nueva fecha de vencimiento <span class="font-normal text-slate-500 dark:text-slate-400">(usar fecha que banco registró)</span></label>
                  <input type="date" [(ngModel)]="ampliarFechaVencimientoNueva" [min]="ampliarFechaMin" [max]="ampliarFechaMax" class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white" />
                </div>
                <div>
                  <label class="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">Monto registrado en banco</label>
                  <input type="number" min="0.01" step="0.01" [(ngModel)]="ampliarMontoPago" class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white" />
                </div>
                <label class="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <input type="checkbox" [(ngModel)]="ampliarPagoCorrespondeAsesor" class="h-4 w-4 rounded border-slate-300 text-red-600 focus:ring-red-500" />
                  Pago corresponde al asesor original
                </label>
              } @else {
                <div class="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-800 dark:bg-red-950/20 dark:text-red-300">
                  Se creará una nueva promesa y el pago se asignará al sistema. Disponible solo para promesas de una cuota.
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">Fecha de pago</label>
                    <input type="date" [(ngModel)]="ampliarMayorFechaPago" [min]="ampliarMayorFechaMin" [max]="ampliarMayorFechaMax" class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white" />
                  </div>
                  <div>
                    <label class="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">Monto</label>
                    <input type="number" min="0.01" step="0.01" [(ngModel)]="ampliarMayorMontoPago" class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white" />
                  </div>
                </div>
              }

              @if (ampliarError) {
                <div class="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700 dark:border-red-800 dark:bg-red-950/20 dark:text-red-300">{{ ampliarError }}</div>
              }
            </div>

            <div class="flex justify-end gap-2 border-t border-slate-200 px-4 py-3 dark:border-slate-700">
              <button type="button" (click)="cerrarAmpliarVencimiento()" class="rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">Cancelar</button>
              <button type="button" (click)="guardarAmpliacion()" [disabled]="!canGuardarAmpliacion() || ampliandoVencimiento" class="rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-400">
                {{ ampliandoVencimiento ? 'Ampliando...' : 'Ampliar' }}
              </button>
            </div>
          </div>
        </div>
      }
    }
  `
})
export class ClienteResumenConciliacionDrawerWidget implements OnChanges {
  private fmt = inject(FormatService);
  private correccionPagosService = inject(CorreccionPagosService);
  activeView: 'promesas' | 'cancelaciones' = 'promesas';
  @Input() open = false;
  @Input() loading = false;
  @Input() error: string | null = null;
  @Input() documento: string | null = null;
  @Input() resumen: ResumenConciliacionCliente | null = null;
  @Input() tenantId: number | null = null;
  @Input() carteraId: number | null = null;
  @Input() subcarteraId: number | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() refreshRequested = new EventEmitter<void>();

  cuotasValidas: CuotaValidaTipificar[] = [];
  isLoadingCuotasValidas = false;
  crearPagoModalOpen = false;
  cuotaCrearPago: CuotaResumenConciliacion | null = null;
  crearPagoFecha = '';
  crearPagoMonto: number | null = null;
  crearPagoError: string | null = null;
  creandoPago = false;
  ampliarModalOpen = false;
  cuotaAmpliar: CuotaResumenConciliacion | null = null;
  ampliarFechaVencimientoNueva = '';
  ampliarFechaMin = '';
  ampliarFechaMax = '';
  ampliarMontoPago: number | null = null;
  ampliarPagoCorrespondeAsesor = true;
  ampliarError: string | null = null;
  ampliandoVencimiento = false;
  ampliarModo: 'corta' | 'mayor' = 'corta';
  ampliarMayorHabilitada = false;
  ampliarMayorFechaPago = '';
  ampliarMayorFechaMin = '';
  ampliarMayorFechaMax = '';
  ampliarMayorMontoPago: number | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open'] || changes['resumen'] || changes['documento'] || changes['tenantId'] || changes['carteraId'] || changes['subcarteraId']) {
      this.cargarCuotasValidasTipificar();
    }
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

  canCrearPago(cuota: CuotaResumenConciliacion): boolean {
    if (this.isLoadingCuotasValidas || this.creandoPago) return false;
    if (cuota.estado === 'PAGADA') return false;
    if (this.hasValue(cuota.fechaPagoReal) || cuota.montoPagadoReal !== null && cuota.montoPagadoReal !== undefined) return false;
    if (this.getPrimeraCuotaSinPago()?.cuotaId !== cuota.cuotaId) return false;
    return this.cuotasValidas.some(item => item.cuotaId === cuota.cuotaId);
  }

  canAmpliarVencimiento(promesa: ResumenConciliacionCliente['promesas'][number], cuota: CuotaResumenConciliacion): boolean {
    if (this.ampliandoVencimiento) return false;
    const target = this.getPrimeraCuotaVencidaUltimaPromesaVencida();
    return target?.promesa.idGestion === promesa.idGestion && target.cuota.cuotaId === cuota.cuotaId;
  }

  abrirCrearPago(cuota: CuotaResumenConciliacion): void {
    if (!this.canCrearPago(cuota)) return;
    this.cuotaCrearPago = cuota;
    this.crearPagoFecha = this.toDateInputValue(cuota.fechaPromesa);
    this.crearPagoMonto = Number(cuota.montoPromesa || 0);
    this.crearPagoError = null;
    this.crearPagoModalOpen = true;
  }

  cerrarCrearPago(): void {
    if (this.creandoPago) return;
    this.crearPagoModalOpen = false;
    this.cuotaCrearPago = null;
    this.crearPagoError = null;
  }

  canGuardarCrearPago(): boolean {
    return !!this.cuotaCrearPago && !!this.crearPagoFecha && Number(this.crearPagoMonto) > 0 && this.hasRequiredContext();
  }

  crearPago(): void {
    if (!this.cuotaCrearPago || !this.canGuardarCrearPago()) return;

    const documento = this.getDocumento();
    if (!documento) return;

    this.creandoPago = true;
    this.crearPagoError = null;

    this.correccionPagosService.crearCancelacion(
      this.cuotaCrearPago.cuotaId,
      {
        tenantId: Number(this.tenantId),
        carteraId: Number(this.carteraId),
        subcarteraId: Number(this.subcarteraId)
      },
      {
        documento,
        fechaPago: this.crearPagoFecha,
        montoPago: Number(this.crearPagoMonto)
      }
    ).subscribe({
      next: () => {
        this.creandoPago = false;
        this.crearPagoModalOpen = false;
        this.cuotaCrearPago = null;
        this.refreshRequested.emit();
      },
      error: (error) => {
        this.crearPagoError = error.error?.mensaje || error.error?.message || error.message || 'No se pudo crear el pago.';
        this.creandoPago = false;
      }
    });
  }

  abrirAmpliarVencimiento(promesa: ResumenConciliacionCliente['promesas'][number], cuota: CuotaResumenConciliacion): void {
    if (!this.canAmpliarVencimiento(promesa, cuota)) return;

    const fechaPromesa = this.toDateInputValue(cuota.fechaPromesa);
    const fechaMax = this.addDays(fechaPromesa, 3);

    this.cuotaAmpliar = cuota;
    this.ampliarFechaMin = fechaPromesa;
    this.ampliarFechaMax = fechaMax;
    this.ampliarFechaVencimientoNueva = fechaMax;
    this.ampliarMontoPago = Number(cuota.montoPromesa || 0);
    this.ampliarPagoCorrespondeAsesor = true;
    this.ampliarModo = 'corta';
    this.ampliarMayorFechaMin = this.addDays(fechaPromesa, 4);
    this.ampliarMayorFechaMax = this.endOfMonth(fechaPromesa);
    this.ampliarMayorHabilitada = this.isCuotaUnica(cuota) && this.ampliarMayorFechaMin <= this.ampliarMayorFechaMax;
    this.ampliarMayorFechaPago = this.ampliarMayorFechaMin <= this.ampliarMayorFechaMax ? this.ampliarMayorFechaMin : '';
    this.ampliarMayorMontoPago = Number(cuota.montoPromesa || 0);
    this.ampliarError = null;
    this.ampliarModalOpen = true;
  }

  setAmpliarModoMayor(): void {
    if (!this.ampliarMayorHabilitada) return;
    this.ampliarModo = 'mayor';
  }

  getAmpliarFechaMax(): string {
    return this.ampliarModo === 'mayor' ? this.ampliarMayorFechaMax : this.ampliarFechaMax;
  }

  cerrarAmpliarVencimiento(): void {
    if (this.ampliandoVencimiento) return;
    this.ampliarModalOpen = false;
    this.cuotaAmpliar = null;
    this.ampliarError = null;
  }

  canGuardarAmpliacion(): boolean {
    if (this.ampliarModo === 'mayor') {
      return !!this.cuotaAmpliar
        && this.ampliarMayorHabilitada
        && !!this.ampliarMayorFechaPago
        && Number(this.ampliarMayorMontoPago) > 0
        && this.hasRequiredContext()
        && this.ampliarMayorFechaPago >= this.ampliarMayorFechaMin
        && this.ampliarMayorFechaPago <= this.ampliarMayorFechaMax;
    }

    return !!this.cuotaAmpliar
      && !!this.ampliarFechaVencimientoNueva
      && Number(this.ampliarMontoPago) > 0
      && this.hasRequiredContext()
      && this.ampliarFechaVencimientoNueva >= this.ampliarFechaMin
      && this.ampliarFechaVencimientoNueva <= this.ampliarFechaMax;
  }

  guardarAmpliacion(): void {
    if (this.ampliarModo === 'mayor') {
      this.crearPromesaSistemaPagoBanco();
      return;
    }

    this.ampliarVencimiento();
  }

  ampliarVencimiento(): void {
    if (!this.cuotaAmpliar || !this.canGuardarAmpliacion()) return;

    const documento = this.getDocumento();
    if (!documento) return;

    this.ampliandoVencimiento = true;
    this.ampliarError = null;

    this.correccionPagosService.ampliarVencimiento(
      this.cuotaAmpliar.cuotaId,
      {
        tenantId: Number(this.tenantId),
        carteraId: Number(this.carteraId),
        subcarteraId: Number(this.subcarteraId)
      },
      {
        documento,
        fechaPago: this.ampliarFechaVencimientoNueva,
        montoPago: Number(this.ampliarMontoPago),
        pagoCorrespondeAsesor: this.ampliarPagoCorrespondeAsesor
      }
    ).subscribe({
      next: () => {
        this.ampliandoVencimiento = false;
        this.ampliarModalOpen = false;
        this.cuotaAmpliar = null;
        this.refreshRequested.emit();
      },
      error: (error) => {
        this.ampliarError = error.error?.mensaje || error.error?.message || error.message || 'No se pudo ampliar el vencimiento.';
        this.ampliandoVencimiento = false;
      }
    });
  }

  crearPromesaSistemaPagoBanco(): void {
    if (!this.cuotaAmpliar || !this.canGuardarAmpliacion()) return;

    const documento = this.getDocumento();
    if (!documento) return;

    this.ampliandoVencimiento = true;
    this.ampliarError = null;

    this.correccionPagosService.crearPromesaSistemaPagoBanco(
      this.cuotaAmpliar.cuotaId,
      {
        tenantId: Number(this.tenantId),
        carteraId: Number(this.carteraId),
        subcarteraId: Number(this.subcarteraId)
      },
      {
        documento,
        fechaPago: this.ampliarMayorFechaPago,
        montoPago: Number(this.ampliarMayorMontoPago)
      }
    ).subscribe({
      next: () => {
        this.ampliandoVencimiento = false;
        this.ampliarModalOpen = false;
        this.cuotaAmpliar = null;
        this.refreshRequested.emit();
      },
      error: (error) => {
        this.ampliarError = error.error?.mensaje || error.error?.message || error.message || 'No se pudo crear la nueva promesa.';
        this.ampliandoVencimiento = false;
      }
    });
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

  private cargarCuotasValidasTipificar(): void {
    if (!this.open || !this.hasRequiredContext() || !this.getDocumento()) {
      this.cuotasValidas = [];
      return;
    }

    this.isLoadingCuotasValidas = true;
    this.correccionPagosService.buscarCuotasValidasTipificar({
      documento: this.getDocumento(),
      tenantId: Number(this.tenantId),
      carteraId: Number(this.carteraId),
      subcarteraId: Number(this.subcarteraId)
    }).subscribe({
      next: (cuotas) => {
        this.cuotasValidas = cuotas;
        this.isLoadingCuotasValidas = false;
      },
      error: () => {
        this.cuotasValidas = [];
        this.isLoadingCuotasValidas = false;
      }
    });
  }

  private getPrimeraCuotaSinPago(): CuotaResumenConciliacion | null {
    return this.resumen?.promesas
      .flatMap(promesa => promesa.cuotas || [])
      .find(cuota => cuota.estado !== 'PAGADA'
        && !this.hasValue(cuota.fechaPagoReal)
        && (cuota.montoPagadoReal === null || cuota.montoPagadoReal === undefined)) || null;
  }

  private getPrimeraCuotaVencidaUltimaPromesaVencida(): { promesa: ResumenConciliacionCliente['promesas'][number]; cuota: CuotaResumenConciliacion } | null {
    const promesa = [...(this.resumen?.promesas || [])]
      .sort((a, b) => this.getTime(b.fechaGestion) - this.getTime(a.fechaGestion))[0];

    if (!promesa) return null;
    if (String(promesa.estadoPago || '').toUpperCase() !== 'VENCIDA') return null;

    const cuota = [...(promesa.cuotas || [])]
      .filter(cuota => String(cuota.estado || '').toUpperCase() === 'VENCIDA')
      .sort((a, b) => this.getTime(a.fechaPromesa) - this.getTime(b.fechaPromesa) || a.numeroCuota - b.numeroCuota)[0] || null;

    return cuota ? { promesa, cuota } : null;
  }

  private hasRequiredContext(): boolean {
    return Number(this.tenantId) > 0 && Number(this.carteraId) > 0 && Number(this.subcarteraId) > 0;
  }

  private getDocumento(): string {
    return String(this.documento || this.resumen?.documento || '').trim();
  }

  private toDateInputValue(value: string | null | undefined): string {
    if (!value) return '';
    return String(value).slice(0, 10);
  }

  private addDays(value: string, days: number): string {
    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    date.setDate(date.getDate() + days);
    return this.toDateInputValue(date.toISOString());
  }

  private endOfMonth(value: string): string {
    const [year, month] = value.split('-').map(Number);
    const date = new Date(year, month, 0);
    return this.toDateInputValue(date.toISOString());
  }

  private isCuotaUnica(cuota: CuotaResumenConciliacion): boolean {
    const promesa = (this.resumen?.promesas || []).find(item => (item.cuotas || []).some(row => row.cuotaId === cuota.cuotaId));
    return (promesa?.cuotas || []).length === 1;
  }

  private getTime(value: string | null | undefined): number {
    if (!value) return 0;
    const time = new Date(value).getTime();
    return Number.isNaN(time) ? 0 : time;
  }
}
