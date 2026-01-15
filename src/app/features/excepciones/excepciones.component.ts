import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { ExcepcionesService, ExcepcionPendiente } from './excepciones.service';
import { ExcepcionesReportService, ReporteExcepcionDTO, ResumenMetricas } from '../reports/excepciones-report/excepciones-report.service';

@Component({
  selector: 'app-excepciones',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <lucide-angular name="alert-triangle" [size]="28" class="text-amber-500"></lucide-angular>
          Excepciones
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">
          Gestion de promesas con montos personalizados
        </p>
      </div>

      <!-- Tabs -->
      <div class="mb-6">
        <div class="border-b border-gray-200 dark:border-gray-700">
          <nav class="flex gap-4">
            <button
              (click)="tabActivo.set('pendientes')"
              [class]="tabActivo() === 'pendientes'
                ? 'border-b-2 border-amber-500 text-amber-600 dark:text-amber-400 font-semibold'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'"
              class="px-4 py-3 text-sm flex items-center gap-2 transition-colors"
            >
              <lucide-angular name="clock" [size]="18"></lucide-angular>
              Pendientes
              @if (excepcionesService.totalExcepciones() > 0) {
                <span class="bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-400 px-2 py-0.5 rounded-full text-xs font-bold">
                  {{ excepcionesService.totalExcepciones() }}
                </span>
              }
            </button>
            <button
              (click)="tabActivo.set('historial'); cargarHistorial()"
              [class]="tabActivo() === 'historial'
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400 font-semibold'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'"
              class="px-4 py-3 text-sm flex items-center gap-2 transition-colors"
            >
              <lucide-angular name="file-text" [size]="18"></lucide-angular>
              Historial / Reporte
            </button>
          </nav>
        </div>
      </div>

      <!-- ============== TAB PENDIENTES ============== -->
      @if (tabActivo() === 'pendientes') {
        <!-- Stats -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <div class="flex items-center gap-3">
              <div class="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                <lucide-angular name="clock" [size]="24" class="text-amber-600 dark:text-amber-400"></lucide-angular>
              </div>
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Pendientes</p>
                <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ excepcionesService.totalExcepciones() }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Loading -->
        @if (excepcionesService.cargando()) {
          <div class="flex justify-center items-center py-12">
            <lucide-angular name="loader" [size]="40" class="animate-spin text-blue-600"></lucide-angular>
            <span class="ml-3 text-gray-600 dark:text-gray-400">Cargando excepciones...</span>
          </div>
        } @else if (excepcionesService.excepciones().length === 0) {
          <!-- Empty state -->
          <div class="bg-white dark:bg-gray-800 rounded-xl p-12 text-center shadow-sm border border-gray-200 dark:border-gray-700">
            <lucide-angular name="check-circle" [size]="64" class="mx-auto text-green-500 mb-4"></lucide-angular>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">No hay excepciones pendientes</h3>
            <p class="text-gray-500 dark:text-gray-400">Todas las excepciones han sido procesadas</p>
          </div>
        } @else {
          <!-- Table Pendientes -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Cliente</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Agente</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Monto</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Cuotas</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Fecha</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Cartera</th>
                    <th class="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                  @for (excepcion of excepcionesService.excepciones(); track excepcion.id) {
                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td class="px-4 py-3">
                        <div class="font-medium text-gray-900 dark:text-white">{{ excepcion.nombreCliente }}</div>
                        <div class="text-sm text-gray-500 dark:text-gray-400">{{ excepcion.documentoCliente }}</div>
                      </td>
                      <td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{{ excepcion.nombreAgente }}</td>
                      <td class="px-4 py-3">
                        <div class="font-bold text-lg text-amber-600 dark:text-amber-400">{{ formatCurrency(excepcion.montoPromesa) }}</div>
                        @if (excepcion.montoBase) {
                          <div class="text-xs text-gray-500 dark:text-gray-400">Base: {{ formatCurrency(excepcion.montoBase) }}</div>
                        } @else {
                          <div class="text-xs text-purple-600 dark:text-purple-400 font-medium">Monto libre</div>
                        }
                      </td>
                      <td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{{ excepcion.totalCuotas }} cuota(s)</td>
                      <td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{{ formatDate(excepcion.fechaGestion) }}</td>
                      <td class="px-4 py-3">
                        <div class="text-sm text-gray-700 dark:text-gray-300">{{ excepcion.nombreCartera }}</div>
                        <div class="text-xs text-gray-500 dark:text-gray-400">{{ excepcion.nombreSubcartera }}</div>
                      </td>
                      <td class="px-4 py-3">
                        <div class="flex items-center justify-center gap-2">
                          <button (click)="verDetalle(excepcion)" class="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors" title="Ver detalle">
                            <lucide-angular name="eye" [size]="18"></lucide-angular>
                          </button>
                          <button (click)="aprobar(excepcion)" [disabled]="procesando()" class="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors disabled:opacity-50" title="Aprobar">
                            <lucide-angular name="check" [size]="18"></lucide-angular>
                          </button>
                          <button (click)="rechazar(excepcion)" [disabled]="procesando()" class="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors disabled:opacity-50" title="Rechazar">
                            <lucide-angular name="x" [size]="18"></lucide-angular>
                          </button>
                        </div>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>

            <!-- Pagination -->
            @if (totalPages() > 1) {
              <div class="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <div class="text-sm text-gray-500 dark:text-gray-400">Pagina {{ currentPage() + 1 }} de {{ totalPages() }}</div>
                <div class="flex gap-2">
                  <button (click)="previousPage()" [disabled]="currentPage() === 0" class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-700">Anterior</button>
                  <button (click)="nextPage()" [disabled]="currentPage() >= totalPages() - 1" class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-700">Siguiente</button>
                </div>
              </div>
            }
          </div>
        }
      }

      <!-- ============== TAB HISTORIAL ============== -->
      @if (tabActivo() === 'historial') {
        <!-- Filtros -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-6">
          <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Desde</label>
              <input type="date" [(ngModel)]="filtroFechaDesde" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hasta</label>
              <input type="date" [(ngModel)]="filtroFechaHasta" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Estado</label>
              <select [(ngModel)]="filtroEstado" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="">Todos</option>
                <option value="EN_EVALUACION">Pendientes</option>
                <option value="PENDIENTE">Aprobadas</option>
                <option value="CANCELADA">Rechazadas</option>
              </select>
            </div>
            <div class="flex items-end">
              <button (click)="cargarHistorial()" [disabled]="cargandoHistorial()" class="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50">
                <lucide-angular name="search" [size]="18"></lucide-angular>
                Buscar
              </button>
            </div>
            <div class="flex items-end">
              <button (click)="exportarExcel()" [disabled]="cargandoHistorial() || historialData().length === 0" class="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50">
                <lucide-angular name="download" [size]="18"></lucide-angular>
                Exportar Excel
              </button>
            </div>
          </div>
        </div>

        <!-- Metricas -->
        @if (historialMetricas()) {
          <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div class="text-sm text-gray-500 dark:text-gray-400">Total</div>
              <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ historialMetricas()!.totalExcepciones }}</div>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border-l-4 border-amber-500">
              <div class="text-sm text-gray-500 dark:text-gray-400">Pendientes</div>
              <div class="text-2xl font-bold text-amber-600">{{ historialMetricas()!.excepcionesPendientes }}</div>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border-l-4 border-green-500">
              <div class="text-sm text-gray-500 dark:text-gray-400">Aprobadas</div>
              <div class="text-2xl font-bold text-green-600">{{ historialMetricas()!.excepcionesAprobadas }}</div>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border-l-4 border-red-500">
              <div class="text-sm text-gray-500 dark:text-gray-400">Rechazadas</div>
              <div class="text-2xl font-bold text-red-600">{{ historialMetricas()!.excepcionesRechazadas }}</div>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div class="text-sm text-gray-500 dark:text-gray-400">Monto Total</div>
              <div class="text-xl font-bold text-gray-900 dark:text-white">{{ formatCurrency(historialMetricas()!.montoTotalSolicitado) }}</div>
            </div>
          </div>
        }

        <!-- Loading o Tabla Historial -->
        @if (cargandoHistorial()) {
          <div class="flex justify-center items-center py-12">
            <lucide-angular name="loader" [size]="40" class="animate-spin text-blue-600"></lucide-angular>
            <span class="ml-3 text-gray-600 dark:text-gray-400">Cargando historial...</span>
          </div>
        } @else if (historialData().length === 0) {
          <div class="bg-white dark:bg-gray-800 rounded-xl p-12 text-center shadow-sm">
            <lucide-angular name="file-search" [size]="64" class="mx-auto text-gray-400 mb-4"></lucide-angular>
            <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Sin resultados</h3>
            <p class="text-gray-500 dark:text-gray-400">Ajusta los filtros y haz clic en Buscar</p>
          </div>
        } @else {
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead class="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th class="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">Cliente</th>
                    <th class="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">Agente</th>
                    <th class="px-4 py-3 text-right font-semibold text-gray-600 dark:text-gray-300">Monto Base</th>
                    <th class="px-4 py-3 text-right font-semibold text-gray-600 dark:text-gray-300">Solicitado</th>
                    <th class="px-4 py-3 text-right font-semibold text-gray-600 dark:text-gray-300">Diferencia</th>
                    <th class="px-4 py-3 text-center font-semibold text-gray-600 dark:text-gray-300">Fecha</th>
                    <th class="px-4 py-3 text-center font-semibold text-gray-600 dark:text-gray-300">Estado</th>
                    <th class="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">Aprobador</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                  @for (item of historialData(); track item.id) {
                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td class="px-4 py-3">
                        <div class="font-medium text-gray-900 dark:text-white">{{ item.nombreCliente }}</div>
                        <div class="text-xs text-gray-500">{{ item.documentoCliente }}</div>
                      </td>
                      <td class="px-4 py-3 text-gray-700 dark:text-gray-300">{{ item.nombreAgente }}</td>
                      <td class="px-4 py-3 text-right text-gray-600 dark:text-gray-400">{{ item.montoBase ? formatCurrency(item.montoBase) : 'Libre' }}</td>
                      <td class="px-4 py-3 text-right font-bold text-amber-600">{{ formatCurrency(item.montoPromesa) }}</td>
                      <td class="px-4 py-3 text-right" [class]="item.diferencia > 0 ? 'text-green-600' : 'text-red-600'">
                        {{ item.diferencia > 0 ? '+' : '' }}{{ formatCurrency(item.diferencia) }}
                      </td>
                      <td class="px-4 py-3 text-center text-gray-700 dark:text-gray-300">{{ formatDate(item.fechaGestion) }}</td>
                      <td class="px-4 py-3 text-center">
                        <span [class]="getEstadoClass(item.estadoPago, item.motivoRechazo)" class="px-2 py-1 rounded-full text-xs font-medium">
                          {{ getEstadoLabel(item.estadoPago, item.motivoRechazo) }}
                        </span>
                      </td>
                      <td class="px-4 py-3">
                        @if (item.nombreAprobador) {
                          <div class="text-gray-700 dark:text-gray-300">{{ item.nombreAprobador }}</div>
                          @if (item.motivoRechazo) {
                            <div class="text-xs text-red-500 truncate max-w-[150px]" [title]="item.motivoRechazo">{{ item.motivoRechazo }}</div>
                          }
                        } @else {
                          <span class="text-gray-400">-</span>
                        }
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
            <div class="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
              <span class="text-sm text-gray-500">{{ historialData().length }} registros encontrados</span>
            </div>
          </div>
        }
      }

      <!-- Modal Detalle -->
      @if (showDetalleModal()) {
        <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div class="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h2 class="text-xl font-bold text-gray-900 dark:text-white">Detalle de Excepcion</h2>
              <button (click)="cerrarDetalle()" class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                <lucide-angular name="x" [size]="24"></lucide-angular>
              </button>
            </div>
            @if (excepcionSeleccionada()) {
              <div class="p-6 space-y-4">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Cliente</label>
                    <p class="text-gray-900 dark:text-white font-medium">{{ excepcionSeleccionada()!.nombreCliente }}</p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ excepcionSeleccionada()!.documentoCliente }}</p>
                  </div>
                  <div>
                    <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Agente</label>
                    <p class="text-gray-900 dark:text-white">{{ excepcionSeleccionada()!.nombreAgente }}</p>
                  </div>
                </div>
                <div class="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4">
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase">Monto Solicitado</label>
                      <p class="text-2xl font-bold text-amber-600 dark:text-amber-400">{{ formatCurrency(excepcionSeleccionada()!.montoPromesa) }}</p>
                    </div>
                    <div>
                      <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Monto Base</label>
                      @if (excepcionSeleccionada()!.montoBase) {
                        <p class="text-xl text-gray-700 dark:text-gray-300">{{ formatCurrency(excepcionSeleccionada()!.montoBase) }}</p>
                      } @else {
                        <p class="text-purple-600 dark:text-purple-400 font-medium">Monto libre (sin base)</p>
                      }
                    </div>
                  </div>
                </div>
                @if (excepcionSeleccionada()!.cuotas && excepcionSeleccionada()!.cuotas.length > 0) {
                  <div>
                    <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2 block">Cronograma de Cuotas</label>
                    <div class="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden">
                      <table class="w-full text-sm">
                        <thead class="bg-gray-100 dark:bg-gray-600">
                          <tr>
                            <th class="px-3 py-2 text-left">#</th>
                            <th class="px-3 py-2 text-left">Monto</th>
                            <th class="px-3 py-2 text-left">Fecha</th>
                          </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200 dark:divide-gray-600">
                          @for (cuota of excepcionSeleccionada()!.cuotas; track cuota.numeroCuota) {
                            <tr>
                              <td class="px-3 py-2">{{ cuota.numeroCuota }}</td>
                              <td class="px-3 py-2 font-medium">{{ formatCurrency(cuota.monto) }}</td>
                              <td class="px-3 py-2">{{ formatDate(cuota.fechaPago) }}</td>
                            </tr>
                          }
                        </tbody>
                      </table>
                    </div>
                  </div>
                }
                @if (excepcionSeleccionada()!.observaciones) {
                  <div>
                    <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Observaciones</label>
                    <p class="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mt-1">{{ excepcionSeleccionada()!.observaciones }}</p>
                  </div>
                }
                <div class="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button (click)="aprobar(excepcionSeleccionada()!)" [disabled]="procesando()" class="flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 px-4 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50">
                    <lucide-angular name="check" [size]="18"></lucide-angular>
                    Aprobar
                  </button>
                  <button (click)="rechazar(excepcionSeleccionada()!)" [disabled]="procesando()" class="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 px-4 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50">
                    <lucide-angular name="x" [size]="18"></lucide-angular>
                    Rechazar
                  </button>
                </div>
              </div>
            }
          </div>
        </div>
      }

      <!-- Modal Rechazo -->
      @if (showRechazoModal()) {
        <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full">
            <div class="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <lucide-angular name="x-circle" [size]="24" class="text-red-500"></lucide-angular>
                Rechazar Excepcion
              </h2>
            </div>
            <div class="p-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Motivo del rechazo (obligatorio)</label>
              <textarea [(ngModel)]="motivoRechazo" rows="4" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500" placeholder="Ingrese el motivo del rechazo..."></textarea>
            </div>
            <div class="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-3">
              <button (click)="cancelarRechazo()" class="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">Cancelar</button>
              <button (click)="confirmarRechazo()" [disabled]="!motivoRechazo.trim() || procesando()" class="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium disabled:opacity-50">Confirmar Rechazo</button>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class ExcepcionesComponent implements OnInit {
  excepcionesService = inject(ExcepcionesService);
  reporteService = inject(ExcepcionesReportService);

  // Tab activo
  tabActivo = signal<'pendientes' | 'historial'>('pendientes');

  // Paginacion (pendientes)
  currentPage = signal(0);
  totalPages = signal(0);
  pageSize = 20;

  // Modales
  showDetalleModal = signal(false);
  showRechazoModal = signal(false);
  excepcionSeleccionada = signal<ExcepcionPendiente | null>(null);
  excepcionParaRechazar = signal<ExcepcionPendiente | null>(null);
  motivoRechazo = '';

  // Estado
  procesando = signal(false);

  // Historial
  filtroFechaDesde = '';
  filtroFechaHasta = '';
  filtroEstado = '';
  cargandoHistorial = signal(false);
  historialData = signal<ReporteExcepcionDTO[]>([]);
  historialMetricas = signal<ResumenMetricas | null>(null);

  ngOnInit(): void {
    this.cargarExcepciones();

    // Fechas por defecto para historial
    const hoy = new Date();
    const hace30Dias = new Date();
    hace30Dias.setDate(hace30Dias.getDate() - 30);
    this.filtroFechaDesde = hace30Dias.toISOString().split('T')[0];
    this.filtroFechaHasta = hoy.toISOString().split('T')[0];
  }

  cargarExcepciones(): void {
    this.excepcionesService.getExcepcionesPendientes(this.currentPage(), this.pageSize)
      .subscribe({
        next: (response) => {
          this.totalPages.set(response.totalPages);
        },
        error: (error) => {
          console.error('Error cargando excepciones:', error);
          alert('Error al cargar las excepciones pendientes');
        }
      });
  }

  cargarHistorial(): void {
    this.cargandoHistorial.set(true);
    this.reporteService.getReporte(
      this.filtroFechaDesde || undefined,
      this.filtroFechaHasta || undefined,
      undefined,
      undefined,
      this.filtroEstado || undefined
    ).subscribe({
      next: (response) => {
        this.historialData.set(response.data);
        this.historialMetricas.set(response.metricas);
        this.cargandoHistorial.set(false);
      },
      error: (error) => {
        console.error('Error cargando historial:', error);
        this.cargandoHistorial.set(false);
        alert('Error al cargar el historial');
      }
    });
  }

  exportarExcel(): void {
    this.cargandoHistorial.set(true);
    this.reporteService.exportarExcel(
      this.filtroFechaDesde || undefined,
      this.filtroFechaHasta || undefined,
      undefined,
      undefined,
      this.filtroEstado || undefined
    ).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Reporte_Excepciones_${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        this.cargandoHistorial.set(false);
      },
      error: (error) => {
        console.error('Error exportando Excel:', error);
        this.cargandoHistorial.set(false);
        alert('Error al exportar el reporte');
      }
    });
  }

  verDetalle(excepcion: ExcepcionPendiente): void {
    this.excepcionSeleccionada.set(excepcion);
    this.showDetalleModal.set(true);
  }

  cerrarDetalle(): void {
    this.showDetalleModal.set(false);
    this.excepcionSeleccionada.set(null);
  }

  aprobar(excepcion: ExcepcionPendiente): void {
    if (!confirm(`¿Esta seguro de APROBAR esta excepcion?\n\nCliente: ${excepcion.nombreCliente}\nMonto: ${this.formatCurrency(excepcion.montoPromesa)}`)) {
      return;
    }
    this.procesando.set(true);
    this.excepcionesService.aprobarExcepcion(excepcion.id).subscribe({
      next: () => {
        alert('Excepcion aprobada exitosamente');
        this.cerrarDetalle();
        this.procesando.set(false);
      },
      error: (error) => {
        console.error('Error aprobando:', error);
        alert('Error al aprobar la excepcion');
        this.procesando.set(false);
      }
    });
  }

  rechazar(excepcion: ExcepcionPendiente): void {
    this.excepcionParaRechazar.set(excepcion);
    this.motivoRechazo = '';
    this.showRechazoModal.set(true);
  }

  cancelarRechazo(): void {
    this.showRechazoModal.set(false);
    this.excepcionParaRechazar.set(null);
    this.motivoRechazo = '';
  }

  confirmarRechazo(): void {
    const excepcion = this.excepcionParaRechazar();
    if (!excepcion || !this.motivoRechazo.trim()) return;
    this.procesando.set(true);
    this.excepcionesService.rechazarExcepcion(excepcion.id, this.motivoRechazo.trim()).subscribe({
      next: () => {
        alert('Excepcion rechazada exitosamente');
        this.showRechazoModal.set(false);
        this.cerrarDetalle();
        this.excepcionParaRechazar.set(null);
        this.motivoRechazo = '';
        this.procesando.set(false);
      },
      error: (error) => {
        console.error('Error rechazando:', error);
        alert('Error al rechazar la excepcion');
        this.procesando.set(false);
      }
    });
  }

  previousPage(): void {
    if (this.currentPage() > 0) {
      this.currentPage.update(p => p - 1);
      this.cargarExcepciones();
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages() - 1) {
      this.currentPage.update(p => p + 1);
      this.cargarExcepciones();
    }
  }

  getEstadoClass(estado: string, motivoRechazo: string | null): string {
    if (estado === 'EN_EVALUACION') {
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
    }
    if (estado === 'CANCELADA' || motivoRechazo) {
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    }
    return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
  }

  getEstadoLabel(estado: string, motivoRechazo: string | null): string {
    if (estado === 'EN_EVALUACION') return 'Pendiente';
    if (estado === 'CANCELADA' || motivoRechazo) return 'Rechazada';
    return 'Aprobada';
  }

  formatCurrency(value: number | null): string {
    if (value === null || value === undefined) return '-';
    return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(value);
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }
}
