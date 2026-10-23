import { Component, DestroyRef, OnInit, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { A11yModule } from '@angular/cdk/a11y';
import { Tenant } from '../../maintenance/models/tenant.model';
import { Portfolio, SubPortfolio } from '../../maintenance/models/portfolio.model';
import { TenantService } from '../../maintenance/services/tenant.service';
import { PortfolioService } from '../../maintenance/services/portfolio.service';
import { BcpPagosService } from '../services/bcp-pagos.service';
import { MenuLateralService } from '@/shared/services/menu-lateral.service';
import {
  ArchivoCargaDetalleItem,
  ArchivoCargaHistorialItem,
  EstadoFilaArchivo,
  ResumenConciliacionCliente
} from '../models/bcp-archivo.model';
import { TONO_PILL, TonoCategoria, fechaCorta, infoCategoria, montoSoles } from '../models/categoria-pago';
import { coincideDocumento, cortarPagina } from '../models/paginacion';
import { BuscadorDocumentoWidget } from './buscador-documento.widget';
import { TablaPaginacionWidget } from './tabla-paginacion.widget';
import { CorreccionClienteDialogWidget, CorreccionClienteSolicitud } from './correccion-cliente-dialog.widget';
import { ClienteResumenConciliacionDrawerWidget } from './cliente-resumen-conciliacion-drawer.widget';

type FiltroEstado = EstadoFilaArchivo | 'TODOS';

const ESTADOS_FILA: Record<EstadoFilaArchivo, { label: string; tono: TonoCategoria }> = {
  CONCILIADO: { label: 'Conciliado', tono: 'ok' },
  PENDIENTE: { label: 'Pendiente', tono: 'espera' },
  RETENIDO: { label: 'Retenido', tono: 'revision' },
  NO_CORRESPONDE: { label: 'No corresponde', tono: 'neutro' }
};

const TIPOS_ARCHIVO: Record<string, string> = {
  BCP: 'BCP',
  OH: 'Financiera OH',
  CONSOLIDADO: 'Regularización del consolidado'
};

/**
 * Historial de archivos de pagos bancarios: todos los archivos cargados en la subcartera con el estado actual
 * de sus pagos, la búsqueda de los archivos donde llegó un cliente y el detalle fila por fila.
 */
@Component({
  selector: 'app-historial-cargas-bcp',
  standalone: true,
  imports: [CommonModule, FormsModule, A11yModule, BuscadorDocumentoWidget, TablaPaginacionWidget, ClienteResumenConciliacionDrawerWidget, CorreccionClienteDialogWidget],
  template: `
    <div class="space-y-4">
      <section class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800" aria-labelledby="historial-titulo">
        <div class="mb-3">
          <h2 id="historial-titulo" class="text-lg font-semibold text-slate-800 dark:text-white">Historial de archivos</h2>
          <p class="text-xs text-slate-600 dark:text-slate-400">Archivos cargados en la subcartera y cómo quedaron sus pagos. Busca un documento para ver en qué archivos llegó el cliente.</p>
        </div>

        <form class="grid grid-cols-1 gap-3 md:grid-cols-6 md:items-end" (submit)="buscar(0, $event)">
          <div>
            <label for="historial-tenant" class="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">Proveedor</label>
            <select id="historial-tenant" name="tenant" [(ngModel)]="selectedTenantId" (ngModelChange)="onTenantChange($event)" [class]="claseCampo">
              <option [ngValue]="0">Seleccionar</option>
              @for (tenant of tenants(); track tenant.id) {
                <option [ngValue]="tenant.id">{{ tenant.tenantCode }} - {{ tenant.tenantName }}</option>
              }
            </select>
          </div>
          <div>
            <label for="historial-cartera" class="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">Cartera</label>
            <select id="historial-cartera" name="cartera" [(ngModel)]="selectedPortfolioId" (ngModelChange)="onPortfolioChange($event)" [disabled]="selectedTenantId === 0" [class]="claseCampo">
              <option [ngValue]="0">Seleccionar</option>
              @for (portfolio of portfolios(); track portfolio.id) {
                <option [ngValue]="portfolio.id">{{ portfolio.portfolioCode }} - {{ portfolio.portfolioName }}</option>
              }
            </select>
          </div>
          <div>
            <label for="historial-subcartera" class="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">Subcartera</label>
            <select id="historial-subcartera" name="subcartera" [(ngModel)]="selectedSubPortfolioId" (ngModelChange)="onSubPortfolioChange($event)" [disabled]="selectedPortfolioId === 0" [class]="claseCampo">
              <option [ngValue]="0">Seleccionar</option>
              @for (subPortfolio of subPortfolios(); track subPortfolio.id) {
                <option [ngValue]="subPortfolio.id">{{ subPortfolio.subPortfolioCode }} - {{ subPortfolio.subPortfolioName }}</option>
              }
            </select>
          </div>
          <div>
            <label for="historial-mes" class="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">Mes de pago <span class="font-normal text-slate-500 dark:text-slate-400">(opcional)</span></label>
            <input id="historial-mes" name="mes" type="month" [(ngModel)]="mes" [class]="claseCampo" />
          </div>
          <div>
            <label for="historial-documento" class="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">Documento <span class="font-normal text-slate-500 dark:text-slate-400">(opcional)</span></label>
            <input id="historial-documento" name="documento" type="search" inputmode="numeric" autocomplete="off" placeholder="Ej.: 73634918" [(ngModel)]="documento" [class]="claseCampo" />
          </div>
          <button
            type="submit"
            [disabled]="!hasContext() || isLoading()"
            class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-400 dark:focus-visible:ring-offset-slate-800"
          >
            {{ isLoading() ? 'Buscando...' : 'Buscar' }}
          </button>
        </form>

        @if (errorMessage()) {
          <p role="alert" class="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/20 dark:text-red-300">{{ errorMessage() }}</p>
        }
      </section>

      @if (consultado()) {
        <!-- relative: contiene el caption sr-only; sin esto se sale del scroll de .main-content y estira la página -->
        <section class="relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800" aria-labelledby="archivos-titulo">
          <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-4 py-2 dark:border-slate-700">
            <div>
              <h3 id="archivos-titulo" class="text-sm font-semibold text-slate-800 dark:text-white">
                @if (documentoConsultado()) {
                  Archivos donde llegó {{ documentoConsultado() }}
                } @else {
                  Archivos cargados
                }
              </h3>
              <p class="text-xs text-slate-600 dark:text-slate-400" aria-live="polite">
                {{ totalElements() }} archivo(s){{ mesConsultado() ? ' con pagos de ' + mesConsultado() : '' }}
              </p>
            </div>
            @if (documentoConsultado()) {
              <button
                type="button"
                (click)="abrirResumen(documentoConsultado()!)"
                class="rounded-lg border border-slate-300 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                Ver resumen del cliente
              </button>
            }
          </div>

          @if (archivos().length === 0) {
            <p class="px-4 py-8 text-center text-sm text-slate-600 dark:text-slate-400">
              {{ documentoConsultado() ? 'El cliente no aparece en ningún archivo de esta subcartera con ese filtro.' : 'No hay archivos cargados con ese filtro.' }}
            </p>
          } @else {
            <div class="overflow-x-auto">
              <table class="min-w-full text-sm tabular-nums">
                <caption class="sr-only">Archivos de pagos bancarios cargados y el estado de sus pagos</caption>
                <thead class="bg-slate-100 text-[11px] uppercase tracking-wide text-slate-700 dark:bg-slate-700/60 dark:text-slate-200">
                  <tr>
                    <th scope="col" class="px-3 py-1.5 text-left font-bold">Archivo</th>
                    <th scope="col" class="px-3 py-1.5 text-left font-bold">Pagos del</th>
                    <th scope="col" class="px-3 py-1.5 text-right font-bold">Filas</th>
                    <th scope="col" class="px-3 py-1.5 text-right font-bold">Monto</th>
                    <th scope="col" class="px-3 py-1.5 text-left font-bold">Estado de los pagos</th>
                    @if (documentoConsultado()) {
                      <th scope="col" class="px-3 py-1.5 text-right font-bold">Del cliente</th>
                    }
                    <th scope="col" class="px-3 py-1.5 text-right font-bold"><span class="sr-only">Acciones</span></th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
                  @for (archivo of archivos(); track archivo.archivoCargaId) {
                    <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                      <th scope="row" class="max-w-80 px-3 py-1.5 text-left font-normal">
                        <span class="block truncate font-semibold text-slate-900 dark:text-white" [title]="archivo.nombreArchivo">{{ archivo.nombreArchivo }}</span>
                        <span class="block text-[11px] text-slate-600 dark:text-slate-400">
                          <span class="font-semibold">{{ tipoArchivo(archivo.tipo) }}</span>
                          · {{ fechaHora(archivo.fechaCarga) }} · {{ archivo.subidoPorNombre || '-' }}
                        </span>
                      </th>
                      <td class="whitespace-nowrap px-3 py-1.5 text-slate-700 dark:text-slate-300">{{ rangoFechas(archivo) }}</td>
                      <td class="whitespace-nowrap px-3 py-1.5 text-right text-slate-800 dark:text-slate-200">{{ archivo.cantidadPagos }}</td>
                      <td class="whitespace-nowrap px-3 py-1.5 text-right font-semibold text-slate-900 dark:text-white">{{ monto(archivo.montoTotal) }}</td>
                      <td class="min-w-56 px-3 py-1.5">
                        <div class="flex h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700" aria-hidden="true">
                          <div class="bg-emerald-500" [style.width.%]="porcentaje(archivo.conciliados, archivo)"></div>
                          <div class="bg-amber-400" [style.width.%]="porcentaje(archivo.pendientes, archivo)"></div>
                          <div class="bg-slate-400" [style.width.%]="porcentaje(archivo.noCorresponden, archivo)"></div>
                        </div>
                        <p class="mt-0.5 text-[11px] leading-tight text-slate-700 dark:text-slate-300">
                          {{ archivo.conciliados }} conciliado(s)
                          @if (archivo.pendientes > 0) {
                            · <span class="font-semibold text-amber-800 dark:text-amber-300">{{ archivo.pendientes }} pendiente(s) {{ monto(archivo.montoPendiente) }}</span>
                            @if (archivo.retenidos > 0) { ({{ archivo.retenidos }} retenido(s)) }
                          }
                          @if (archivo.noCorresponden > 0) {
                            · {{ archivo.noCorresponden }} no corresponde(n)
                          }
                        </p>
                      </td>
                      @if (documentoConsultado()) {
                        <td class="whitespace-nowrap px-3 py-1.5 text-right text-slate-800 dark:text-slate-200">
                          {{ monto(archivo.montoCliente) }}
                          <span class="text-[11px] text-slate-600 dark:text-slate-400">· {{ archivo.pagosCliente }} pago(s)</span>
                        </td>
                      }
                      <td class="whitespace-nowrap px-3 py-1.5 text-right">
                        <div class="flex justify-end gap-1.5">
                          @if (documentoConsultado()) {
                            <button
                              type="button"
                              (click)="alternarPagosCliente(archivo)"
                              [attr.aria-expanded]="expandido() === archivo.archivoCargaId"
                              [attr.aria-controls]="'pagos-cliente-' + archivo.archivoCargaId"
                              class="rounded-md border border-slate-300 px-2 py-0.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
                            >
                              {{ expandido() === archivo.archivoCargaId ? 'Ocultar pagos' : 'Ver pagos' }}
                            </button>
                          }
                          <button
                            type="button"
                            (click)="verDetalle(archivo)"
                            [attr.aria-label]="'Ver detalle del archivo ' + archivo.nombreArchivo"
                            class="rounded-md border border-blue-300 px-2 py-0.5 text-xs font-semibold text-blue-700 hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-950/30"
                          >
                            Detalle
                          </button>
                        </div>
                      </td>
                    </tr>
                    @if (expandido() === archivo.archivoCargaId) {
                      <tr [id]="'pagos-cliente-' + archivo.archivoCargaId" class="bg-slate-50 dark:bg-slate-900/40">
                        <td [attr.colspan]="documentoConsultado() ? 7 : 6" class="px-3 py-2">
                          @if (cargandoPagosCliente()) {
                            <p class="text-xs text-slate-600 dark:text-slate-400">Cargando pagos del cliente...</p>
                          } @else if (errorPagosCliente()) {
                            <p role="alert" class="text-xs text-red-700 dark:text-red-300">{{ errorPagosCliente() }}</p>
                          } @else {
                            <ul class="space-y-1">
                              @for (fila of pagosCliente(); track fila.bcpPagoDetalleId + '-' + (fila.conciliacionId ?? 0)) {
                                <li class="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-700 dark:text-slate-300">
                                  <span class="font-semibold text-slate-900 dark:text-white">{{ fecha(fila.fechaBanco) }} · {{ monto(fila.montoBanco) }}</span>
                                  <span class="rounded-full px-2 py-0.5 text-[11px] font-bold leading-tight" [class]="pillEstado(fila.estado)">{{ etiquetaEstado(fila) }}</span>
                                  <span>{{ aplicadoA(fila) }}</span>
                                </li>
                              }
                            </ul>
                          }
                        </td>
                      </tr>
                    }
                  }
                </tbody>
              </table>
            </div>
            <app-tabla-paginacion
              [total]="totalElements()"
              [pagina]="currentPage() + 1"
              [tamano]="pageSize"
              etiqueta="archivos cargados"
              (paginaChange)="cambiarPagina($event - 1)"
            ></app-tabla-paginacion>
          }
        </section>
      } @else {
        <div class="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400">Selecciona la subcartera y busca los archivos.</div>
      }
    </div>

    @if (detalleOpen()) {
      <div class="fixed inset-0 z-[1100] flex justify-end bg-transparent" (click)="cerrarDetalle()">
        <aside
          role="dialog"
          aria-modal="true"
          aria-labelledby="detalle-archivo-titulo"
          [cdkTrapFocus]="!resumenAbierto()"
          [cdkTrapFocusAutoCapture]="true"
          (keydown.escape)="cerrarDetalle()"
          (click)="$event.stopPropagation()"
          class="flex h-screen w-[900px] max-w-[96vw] flex-col border-l border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
        >
          <div class="border-b border-slate-200 px-4 py-3 dark:border-slate-700">
            <div class="flex items-start justify-between gap-4">
              <div class="min-w-0">
                <p class="text-[11px] font-bold uppercase tracking-wide text-slate-600 dark:text-slate-400">{{ tipoArchivo(selectedArchivo()?.tipo) }}</p>
                <h3 id="detalle-archivo-titulo" class="truncate text-base font-bold text-slate-900 dark:text-white" [title]="selectedArchivo()?.nombreArchivo">{{ selectedArchivo()?.nombreArchivo }}</h3>
                @if (selectedArchivo(); as archivo) {
                  <p class="text-xs text-slate-600 dark:text-slate-400">
                    Cargado el {{ fechaHora(archivo.fechaCarga) }} por {{ archivo.subidoPorNombre || '-' }} · pagos del {{ rangoFechas(archivo) }}
                    · {{ archivo.cantidadPagos }} fila(s) por {{ monto(archivo.montoTotal) }}
                  </p>
                }
              </div>
              <button type="button" (click)="cerrarDetalle()" class="rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-slate-300 dark:hover:bg-slate-800">Cerrar</button>
            </div>

            <div class="mt-2 flex flex-wrap items-center justify-between gap-2">
              <div class="flex flex-wrap gap-1.5" role="group" aria-label="Filtrar filas por estado">
                @for (opcion of opcionesEstado(); track opcion.valor) {
                  <button
                    type="button"
                    (click)="filtrarEstado(opcion.valor)"
                    [attr.aria-pressed]="filtroEstado() === opcion.valor"
                    [class]="filtroEstado() === opcion.valor
                      ? 'rounded-full border border-blue-600 bg-blue-600 px-2.5 py-0.5 text-xs font-bold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900'
                      : 'rounded-full border border-slate-300 px-2.5 py-0.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus-visible:ring-offset-slate-900'"
                  >
                    {{ opcion.label }} ({{ opcion.total }})
                  </button>
                }
              </div>
              <app-buscador-documento inputId="detalle-archivo-buscar" [valor]="busquedaDetalle()" (valorChange)="buscarEnDetalle($event)"></app-buscador-documento>
            </div>
          </div>

          <div class="relative flex-1 overflow-y-auto">
            @if (isLoadingDetalle()) {
              <p class="p-6 text-center text-sm text-slate-600 dark:text-slate-400">Cargando detalle...</p>
            } @else if (detalleError()) {
              <p role="alert" class="m-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/20 dark:text-red-300">{{ detalleError() }}</p>
            } @else if (detalleFiltrado().length === 0) {
              <p class="p-6 text-center text-sm text-slate-600 dark:text-slate-400">No hay filas con ese filtro.</p>
            } @else {
              <table class="min-w-full text-xs tabular-nums">
                <caption class="sr-only">Filas del archivo y en qué quedó cada pago</caption>
                <thead class="sticky top-0 bg-slate-100 text-left text-[11px] uppercase tracking-wide text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  <tr>
                    <th scope="col" class="px-2 py-1.5 text-right">Fila</th>
                    <th scope="col" class="px-2 py-1.5">Documento</th>
                    <th scope="col" class="px-2 py-1.5">Pago del banco</th>
                    <th scope="col" class="px-2 py-1.5">Estado</th>
                    <th scope="col" class="px-2 py-1.5">Aplicado a</th>
                    <th scope="col" class="px-2 py-1.5">Agente</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                  @for (row of detallePagina(); track row.bcpPagoDetalleId + '-' + (row.conciliacionId ?? 0)) {
                    <tr class="align-top hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td class="px-2 py-1 text-right text-slate-600 dark:text-slate-400">{{ row.numeroFila ?? '-' }}</td>
                      <th scope="row" class="px-2 py-1 text-left font-normal">
                        <button
                          type="button"
                          (click)="abrirResumen(row.documento)"
                          [attr.aria-label]="'Ver resumen del cliente ' + row.documento"
                          class="rounded font-mono font-semibold text-blue-700 underline underline-offset-2 hover:text-blue-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-blue-300 dark:hover:text-blue-200"
                        >
                          {{ row.documento }}
                        </button>
                        @if (row.nombreCliente) {
                          <span class="block max-w-44 truncate text-[11px] text-slate-600 dark:text-slate-400" [title]="row.nombreCliente">{{ row.nombreCliente }}</span>
                        }
                      </th>
                      <td class="whitespace-nowrap px-2 py-1 text-slate-700 dark:text-slate-300">
                        {{ fecha(row.fechaBanco) }} · <span class="font-bold text-slate-900 dark:text-white">{{ monto(row.montoBanco) }}</span>
                        @if (row.numeroOperacion) {
                          <span class="block text-[11px] text-slate-600 dark:text-slate-400">Op. {{ row.numeroOperacion }}</span>
                        }
                        @if (row.bcpPagoDetalleId) {
                          <button
                            type="button"
                            (click)="abrirCorreccion(row.documento, row.bcpPagoDetalleId)"
                            class="mt-0.5 block rounded text-[11px] font-semibold text-blue-700 underline underline-offset-2 hover:text-blue-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-blue-300 dark:hover:text-blue-200"
                          >
                            Corregir Pb {{ row.bcpPagoDetalleId }}
                          </button>
                        }
                      </td>
                      <td class="px-2 py-1">
                        <span class="inline-flex whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-bold leading-tight" [class]="pillEstado(row.estado)">{{ etiquetaEstado(row) }}</span>
                      </td>
                      <td class="px-2 py-1 text-slate-700 dark:text-slate-300">{{ aplicadoA(row) }}</td>
                      <td class="px-2 py-1 text-slate-700 dark:text-slate-300">{{ row.nombreAgente || '-' }}</td>
                    </tr>
                  }
                </tbody>
              </table>
              <app-tabla-paginacion
                [total]="detalleFiltrado().length"
                [pagina]="paginaDetalle()"
                etiqueta="filas del archivo"
                (paginaChange)="paginaDetalle.set($event)"
              ></app-tabla-paginacion>
            }
          </div>
        </aside>
      </div>
    }

    <app-cliente-resumen-conciliacion-drawer
      [open]="resumenAbierto()"
      [loading]="cargandoResumen()"
      [error]="errorResumen()"
      [documento]="documentoResumen()"
      [resumen]="resumen()"
      [tenantId]="selectedTenantId || null"
      [carteraId]="selectedPortfolioId || null"
      [subcarteraId]="selectedSubPortfolioId || null"
      (close)="resumenAbierto.set(false)"
      (ajustado)="abrirResumen($event)"
      (corregir)="correccion.set($event)"
    ></app-cliente-resumen-conciliacion-drawer>

    <app-correccion-cliente-dialog [solicitud]="correccion()" (cerrado)="onCorreccionCerrada($event)"></app-correccion-cliente-dialog>
  `
})
export class HistorialCargasBcpWidget implements OnInit {
  readonly claseCampo = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:disabled:bg-slate-800';

  tenants = signal<Tenant[]>([]);
  portfolios = signal<Portfolio[]>([]);
  subPortfolios = signal<SubPortfolio[]>([]);

  selectedTenantId = 0;
  selectedPortfolioId = 0;
  selectedSubPortfolioId = 0;
  mes = '';
  documento = '';

  archivos = signal<ArchivoCargaHistorialItem[]>([]);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  consultado = signal(false);
  /** Filtros con los que se hizo la última búsqueda (los campos pueden cambiar sin buscar). */
  documentoConsultado = signal<string | null>(null);
  mesConsultado = signal<string | null>(null);
  totalElements = signal(0);
  currentPage = signal(0);
  readonly pageSize = 20;

  /** Archivo con los pagos del cliente desplegados. */
  expandido = signal<number | null>(null);
  pagosCliente = signal<ArchivoCargaDetalleItem[]>([]);
  cargandoPagosCliente = signal(false);
  errorPagosCliente = signal<string | null>(null);

  detalleOpen = signal(false);
  selectedArchivo = signal<ArchivoCargaHistorialItem | null>(null);
  detalle = signal<ArchivoCargaDetalleItem[]>([]);
  isLoadingDetalle = signal(false);
  detalleError = signal<string | null>(null);
  filtroEstado = signal<FiltroEstado>('TODOS');
  busquedaDetalle = signal('');
  paginaDetalle = signal(1);
  /** Botón que abrió el detalle: recibe el foco al cerrarlo. */
  private origenDetalle: HTMLElement | null = null;

  /** Corrección de pagos abierta en un diálogo encima del historial. */
  correccion = signal<CorreccionClienteSolicitud | null>(null);

  resumenAbierto = signal(false);
  cargandoResumen = signal(false);
  errorResumen = signal<string | null>(null);
  documentoResumen = signal<string | null>(null);
  resumen = signal<ResumenConciliacionCliente | null>(null);

  readonly opcionesEstado = computed(() => {
    const filas = this.detalle();
    const contar = (estado: EstadoFilaArchivo) => filas.filter(f => f.estado === estado).length;
    return [
      { valor: 'TODOS' as FiltroEstado, label: 'Todas', total: filas.length },
      ...(Object.keys(ESTADOS_FILA) as EstadoFilaArchivo[])
        .map(estado => ({ valor: estado as FiltroEstado, label: ESTADOS_FILA[estado].label, total: contar(estado) }))
        .filter(opcion => opcion.total > 0)
    ];
  });

  readonly detalleFiltrado = computed(() => {
    const estado = this.filtroEstado();
    const texto = this.busquedaDetalle();
    return this.detalle().filter(f => (estado === 'TODOS' || f.estado === estado) && coincideDocumento(f.documento, texto));
  });

  readonly detallePagina = computed(() => cortarPagina(this.detalleFiltrado(), this.paginaDetalle()));

  constructor(
    private tenantService: TenantService,
    private portfolioService: PortfolioService,
    private bcpService: BcpPagosService
  ) {
    // El detalle es un panel lateral: pliega el menú principal mientras está abierto.
    const menuLateral = inject(MenuLateralService);
    let menuPlegado = false;
    const sincronizar = (plegar: boolean) => {
      if (plegar === menuPlegado) return;
      menuPlegado = plegar;
      if (plegar) {
        menuLateral.panelAbierto();
      } else {
        menuLateral.panelCerrado();
      }
    };
    effect(() => sincronizar(this.detalleOpen()));
    inject(DestroyRef).onDestroy(() => sincronizar(false));
  }

  ngOnInit(): void {
    this.tenantService.getAllTenants().subscribe({
      next: (tenants) => this.tenants.set(tenants),
      error: () => this.errorMessage.set('No se pudieron cargar los proveedores.')
    });
  }

  onTenantChange(tenantId: number): void {
    this.selectedTenantId = Number(tenantId) || 0;
    this.selectedPortfolioId = 0;
    this.selectedSubPortfolioId = 0;
    this.portfolios.set([]);
    this.subPortfolios.set([]);
    this.clearResults();

    if (this.selectedTenantId > 0) {
      this.portfolioService.getPortfoliosByTenant(this.selectedTenantId).subscribe({
        next: (portfolios) => this.portfolios.set(portfolios),
        error: () => this.errorMessage.set('No se pudieron cargar las carteras.')
      });
    }
  }

  onPortfolioChange(portfolioId: number): void {
    this.selectedPortfolioId = Number(portfolioId) || 0;
    this.selectedSubPortfolioId = 0;
    this.subPortfolios.set([]);
    this.clearResults();

    if (this.selectedPortfolioId > 0) {
      this.portfolioService.getSubPortfoliosByPortfolio(this.selectedPortfolioId).subscribe({
        next: (subPortfolios) => this.subPortfolios.set(subPortfolios),
        error: () => this.errorMessage.set('No se pudieron cargar las subcarteras.')
      });
    }
  }

  onSubPortfolioChange(subPortfolioId: number): void {
    this.selectedSubPortfolioId = Number(subPortfolioId) || 0;
    this.clearResults();
  }

  hasContext(): boolean {
    return this.selectedTenantId > 0 && this.selectedPortfolioId > 0 && this.selectedSubPortfolioId > 0;
  }

  /** Página 0 toma los filtros del formulario; las demás páginas repiten la última búsqueda. */
  buscar(page = 0, evento?: Event): void {
    evento?.preventDefault();
    if (!this.hasContext()) return;

    if (page === 0) {
      this.documentoConsultado.set(this.documento.replace(/\s+/g, '') || null);
      this.mesConsultado.set(this.mes || null);
    }
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.expandido.set(null);

    this.bcpService.listarHistorialArchivosCarga({
      ...this.contexto(),
      documento: this.documentoConsultado() ?? undefined,
      mes: this.mesConsultado() ?? undefined,
      page,
      size: this.pageSize
    }).subscribe({
      next: (response) => {
        this.archivos.set(response.content || []);
        this.totalElements.set(response.totalElements || 0);
        this.currentPage.set(response.number || 0);
        this.consultado.set(true);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err?.error?.mensaje || 'No se pudo cargar el historial de archivos.');
        this.isLoading.set(false);
      }
    });
  }

  cambiarPagina(page: number): void {
    if (page < 0 || page === this.currentPage()) return;
    this.buscar(page);
  }

  alternarPagosCliente(archivo: ArchivoCargaHistorialItem): void {
    const documento = this.documentoConsultado();
    if (!documento) return;
    if (this.expandido() === archivo.archivoCargaId) {
      this.expandido.set(null);
      return;
    }
    this.expandido.set(archivo.archivoCargaId);
    this.cargandoPagosCliente.set(true);
    this.errorPagosCliente.set(null);
    this.pagosCliente.set([]);
    this.bcpService.obtenerDetalleArchivoCarga(archivo.archivoCargaId, { ...this.contexto(), documento }).subscribe({
      next: (filas) => {
        this.pagosCliente.set(filas || []);
        this.cargandoPagosCliente.set(false);
      },
      error: () => {
        this.errorPagosCliente.set('No se pudieron cargar los pagos del cliente en este archivo.');
        this.cargandoPagosCliente.set(false);
      }
    });
  }

  verDetalle(archivo: ArchivoCargaHistorialItem): void {
    if (!this.hasContext()) return;

    this.origenDetalle = document.activeElement as HTMLElement | null;
    this.selectedArchivo.set(archivo);
    this.filtroEstado.set('TODOS');
    // Al buscar un cliente, el detalle abre filtrado por su documento; se puede borrar para ver todo el archivo.
    this.busquedaDetalle.set(this.documentoConsultado() ?? '');
    this.paginaDetalle.set(1);
    this.detalleOpen.set(true);
    this.isLoadingDetalle.set(true);
    this.detalleError.set(null);
    this.detalle.set([]);

    this.bcpService.obtenerDetalleArchivoCarga(archivo.archivoCargaId, this.contexto()).subscribe({
      next: (detalle) => {
        this.detalle.set(detalle || []);
        this.isLoadingDetalle.set(false);
      },
      error: () => {
        this.detalleError.set('No se pudo cargar el detalle del archivo.');
        this.isLoadingDetalle.set(false);
      }
    });
  }

  /** Los ajustes del pago se hacen en Corrección de pagos, abierta en un diálogo con el cliente y la ficha. */
  abrirCorreccion(documento: string, pagoId: number): void {
    if (!this.hasContext() || !documento) return;
    this.correccion.set({ documento, contexto: this.contexto(), pb: pagoId });
  }

  onCorreccionCerrada(evento: { documento: string; huboCambios: boolean }): void {
    this.correccion.set(null);
    if (!evento.huboCambios) return;
    this.recargarDetalle();
    if (this.resumenAbierto()) this.abrirResumen(evento.documento);
  }

  /** Vuelve a leer el detalle abierto sin cambiar filtros ni página. */
  private recargarDetalle(): void {
    const archivo = this.selectedArchivo();
    if (!archivo || !this.detalleOpen() || !this.hasContext()) return;
    this.bcpService.obtenerDetalleArchivoCarga(archivo.archivoCargaId, this.contexto()).subscribe({
      next: detalle => this.detalle.set(detalle || []),
      error: () => this.detalleError.set('No se pudo actualizar el detalle del archivo.')
    });
  }

  cerrarDetalle(): void {
    if (!this.detalleOpen()) return;
    this.detalleOpen.set(false);
    this.origenDetalle?.focus();
    this.origenDetalle = null;
  }

  filtrarEstado(estado: FiltroEstado): void {
    this.filtroEstado.set(estado);
    this.paginaDetalle.set(1);
  }

  buscarEnDetalle(texto: string): void {
    this.busquedaDetalle.set(texto);
    this.paginaDetalle.set(1);
  }

  abrirResumen(documento: string): void {
    if (!this.hasContext() || !documento) return;
    this.resumenAbierto.set(true);
    this.cargandoResumen.set(true);
    this.errorResumen.set(null);
    this.documentoResumen.set(documento);
    this.resumen.set(null);
    this.bcpService.obtenerResumenConciliacionCliente(documento, this.contexto()).subscribe({
      next: (resumen) => {
        this.resumen.set(resumen);
        this.cargandoResumen.set(false);
      },
      error: (err) => {
        this.errorResumen.set(err?.error?.mensaje || err?.error?.message || 'No se pudo cargar el resumen del cliente.');
        this.cargandoResumen.set(false);
      }
    });
  }

  tipoArchivo(tipo: string | null | undefined): string {
    return (tipo && TIPOS_ARCHIVO[tipo]) || tipo || '';
  }

  rangoFechas(archivo: ArchivoCargaHistorialItem): string {
    const desde = fechaCorta(archivo.fechaPagoDesde);
    const hasta = fechaCorta(archivo.fechaPagoHasta);
    return desde === hasta ? desde : `${desde} al ${hasta}`;
  }

  porcentaje(cantidad: number, archivo: ArchivoCargaHistorialItem): number {
    return archivo.cantidadPagos > 0 ? (cantidad / archivo.cantidadPagos) * 100 : 0;
  }

  pillEstado(estado: EstadoFilaArchivo): string {
    return TONO_PILL[ESTADOS_FILA[estado]?.tono ?? 'neutro'];
  }

  /** Estado de la fila; si está conciliada se muestra cómo (por suma, con desfase, parcial...). */
  etiquetaEstado(fila: ArchivoCargaDetalleItem): string {
    if (fila.estado === 'CONCILIADO' && fila.categoria) return infoCategoria(fila.categoria).label;
    return ESTADOS_FILA[fila.estado]?.label ?? fila.estado;
  }

  aplicadoA(fila: ArchivoCargaDetalleItem): string {
    if (fila.cuotaId) {
      const aplicado = fila.montoAplicado !== null && fila.montoAplicado !== undefined ? ` · aplicado ${montoSoles(fila.montoAplicado)}` : '';
      return `Cuota ${fila.numeroCuota ?? '-'} de ${montoSoles(fila.montoPromesa)} al ${fechaCorta(fila.fechaPromesa)}${aplicado}`;
    }
    if (fila.estado === 'CONCILIADO') return 'Conciliado sin cuota asociada';
    if (fila.estado === 'NO_CORRESPONDE') return 'Marcado por un supervisor';
    return 'Sin aplicar: revisar en pagos pendientes';
  }

  fecha(value: string | null | undefined): string {
    return fechaCorta(value);
  }

  fechaHora(value: string | null | undefined): string {
    if (!value) return '-';
    const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
    return match ? `${match[3]}/${match[2]}/${match[1]} ${match[4]}:${match[5]}` : String(value);
  }

  monto(value: number | null | undefined): string {
    return montoSoles(value);
  }

  private contexto(): { tenantId: number; carteraId: number; subcarteraId: number } {
    return { tenantId: this.selectedTenantId, carteraId: this.selectedPortfolioId, subcarteraId: this.selectedSubPortfolioId };
  }

  private clearResults(): void {
    this.archivos.set([]);
    this.totalElements.set(0);
    this.currentPage.set(0);
    this.consultado.set(false);
    this.expandido.set(null);
    this.errorMessage.set(null);
    this.cerrarDetalle();
  }
}
