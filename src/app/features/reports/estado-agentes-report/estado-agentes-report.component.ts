import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import {
  EstadoAgentesReportService,
  ReporteEstadoAgentesResponse,
  RegistroEstadoDTO,
  ResumenEstadoAgentes,
  ResumenPorAgente
} from './estado-agentes-report.service';
import { ComisionesService } from '../../../comisiones/services/comisiones.service';
import { Inquilino, Cartera, Subcartera } from '../../../comisiones/models/comision.model';

@Component({
  selector: 'app-estado-agentes-report',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
          <lucide-angular name="user-check" [size]="28" class="text-indigo-500"></lucide-angular>
          Reporte de Estados por Agente
        </h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1">
          Historial de estados de agentes con tiempos y ratios de ocupacion
        </p>
      </div>

      <!-- Filtros -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <!-- Fecha Desde -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Fecha Desde *
            </label>
            <input
              type="date"
              [(ngModel)]="filtros.fechaDesde"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <!-- Fecha Hasta -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Fecha Hasta *
            </label>
            <input
              type="date"
              [(ngModel)]="filtros.fechaHasta"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <!-- Proveedor -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Proveedor
            </label>
            <select
              [(ngModel)]="filtros.idProveedor"
              (ngModelChange)="onProveedorChange($event)"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option [ngValue]="null">Todos</option>
              @for (prov of proveedores(); track prov.id) {
                <option [ngValue]="prov.id">{{ prov.nombreInquilino }}</option>
              }
            </select>
          </div>

          <!-- Cartera -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Cartera
            </label>
            <select
              [(ngModel)]="filtros.idCartera"
              (ngModelChange)="onCarteraChange($event)"
              [disabled]="!filtros.idProveedor"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                     disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option [ngValue]="null">Todas</option>
              @for (cart of carteras(); track cart.id) {
                <option [ngValue]="cart.id">{{ cart.nombreCartera }}</option>
              }
            </select>
          </div>

          <!-- Subcartera -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Subcartera
            </label>
            <select
              [(ngModel)]="filtros.idSubcartera"
              [disabled]="!filtros.idCartera"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                     disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option [ngValue]="null">Todas</option>
              @for (sub of subcarteras(); track sub.id) {
                <option [ngValue]="sub.id">{{ sub.nombreSubcartera }}</option>
              }
            </select>
          </div>

          <!-- Botones -->
          <div class="flex items-end gap-2">
            <button
              (click)="buscar()"
              [disabled]="loading() || !filtros.fechaDesde || !filtros.fechaHasta"
              class="flex-1 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold
                     rounded-lg transition-colors flex items-center justify-center gap-2
                     disabled:opacity-50 disabled:cursor-not-allowed"
            >
              @if (loading()) {
                <lucide-angular name="loader-2" [size]="18" class="animate-spin"></lucide-angular>
              } @else {
                <lucide-angular name="search" [size]="18"></lucide-angular>
              }
              Buscar
            </button>
            <button
              (click)="exportarExcel()"
              [disabled]="loading() || !resumen()"
              class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold
                     rounded-lg transition-colors flex items-center gap-2
                     disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <lucide-angular name="download" [size]="18"></lucide-angular>
              Excel
            </button>
          </div>
        </div>

        @if (!filtros.fechaDesde || !filtros.fechaHasta) {
          <p class="mt-2 text-sm text-amber-600 dark:text-amber-400">
            * Las fechas son obligatorias
          </p>
        }
      </div>

      <!-- KPI Cards -->
      @if (resumen()) {
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                <lucide-angular name="users" [size]="24" class="text-indigo-600 dark:text-indigo-400"></lucide-angular>
              </div>
              <div>
                <p class="text-2xl font-bold text-gray-800 dark:text-white">{{ resumen()!.totalAgentes }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Agentes</p>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <lucide-angular name="repeat" [size]="24" class="text-blue-600 dark:text-blue-400"></lucide-angular>
              </div>
              <div>
                <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ resumen()!.totalCambiosEstado | number }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Cambios de Estado</p>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <lucide-angular name="clock" [size]="24" class="text-green-600 dark:text-green-400"></lucide-angular>
              </div>
              <div>
                <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ avgOcupacion() }}%</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Ocupacion Promedio</p>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                <lucide-angular name="coffee" [size]="24" class="text-amber-600 dark:text-amber-400"></lucide-angular>
              </div>
              <div>
                <p class="text-2xl font-bold text-amber-600 dark:text-amber-400">{{ totalBreakTime() }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Tiempo Ocioso Total</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Tabs -->
        <div class="flex gap-2 mb-4">
          <button
            (click)="activeTab.set('resumen')"
            [class]="activeTab() === 'resumen'
              ? 'px-4 py-2 bg-indigo-500 text-white rounded-lg font-semibold'
              : 'px-4 py-2 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700'"
          >
            Resumen por Agente
          </button>
          <button
            (click)="activeTab.set('detalle')"
            [class]="activeTab() === 'detalle'
              ? 'px-4 py-2 bg-indigo-500 text-white rounded-lg font-semibold'
              : 'px-4 py-2 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700'"
          >
            Detalle de Cambios
          </button>
        </div>
      }

      <!-- Tab: Resumen por Agente -->
      @if (activeTab() === 'resumen' && resumen()) {
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th class="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Agente</th>
                  <th class="px-3 py-3 text-center text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase">Entrada</th>
                  <th class="px-3 py-3 text-center text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase">Salida</th>
                  <th class="px-3 py-3 text-center text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase">Jornada</th>
                  <th class="px-3 py-3 text-center text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase">Sesiones</th>
                  <th class="px-3 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Conectado</th>
                  <th class="px-3 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Productivo</th>
                  <th class="px-3 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Ocioso</th>
                  <th class="px-3 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">% Ocupacion</th>
                  <th class="px-3 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Disponible</th>
                  <th class="px-3 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">En Llamada</th>
                  <th class="px-3 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Tipificando</th>
                  <th class="px-3 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Gestion Manual</th>
                  <th class="px-3 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Refrigerio</th>
                  <th class="px-3 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">SSHH</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                @for (agente of resumen()!.agentes; track agente.idUsuario) {
                  <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td class="px-3 py-2">
                      <div class="text-gray-900 dark:text-white font-medium">{{ agente.nombreAgente }}</div>
                      <div class="text-xs text-gray-500 dark:text-gray-400">{{ agente.username }}</div>
                    </td>
                    <td class="px-3 py-2 text-center text-indigo-600 dark:text-indigo-400 text-xs font-medium">
                      {{ agente.horaEntrada || '-' }}
                    </td>
                    <td class="px-3 py-2 text-center text-indigo-600 dark:text-indigo-400 text-xs font-medium">
                      {{ agente.horaSalida || '-' }}
                    </td>
                    <td class="px-3 py-2 text-center text-indigo-700 dark:text-indigo-300 font-semibold text-xs">
                      {{ agente.jornadaTotalFormateada || '-' }}
                    </td>
                    <td class="px-3 py-2 text-center text-gray-600 dark:text-gray-400 text-xs">
                      {{ agente.cantidadSesiones || 1 }}
                    </td>
                    <td class="px-3 py-2 text-center text-gray-900 dark:text-white font-medium">
                      {{ agente.tiempoConectadoFormateado }}
                    </td>
                    <td class="px-3 py-2 text-center text-green-600 dark:text-green-400 font-medium">
                      {{ agente.tiempoProductivoFormateado }}
                    </td>
                    <td class="px-3 py-2 text-center text-amber-600 dark:text-amber-400 font-medium">
                      {{ formatSeg(agente.totalSegundosBreak) }}
                    </td>
                    <td class="px-3 py-2 text-center">
                      <div class="flex items-center justify-center gap-2">
                        <div class="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div
                            class="h-2 rounded-full"
                            [style.width.%]="agente.porcentajeOcupacion"
                            [style.background-color]="getOcupacionColor(agente.porcentajeOcupacion)"
                          ></div>
                        </div>
                        <span class="text-xs font-semibold" [style.color]="getOcupacionColor(agente.porcentajeOcupacion)">
                          {{ agente.porcentajeOcupacion }}%
                        </span>
                      </div>
                    </td>
                    <td class="px-3 py-2 text-center text-gray-600 dark:text-gray-400 text-xs">
                      {{ formatSeg(agente.segundosPorEstado['DISPONIBLE']) }}
                    </td>
                    <td class="px-3 py-2 text-center text-gray-600 dark:text-gray-400 text-xs">
                      {{ formatSeg(agente.segundosPorEstado['EN_LLAMADA']) }}
                    </td>
                    <td class="px-3 py-2 text-center text-gray-600 dark:text-gray-400 text-xs">
                      {{ formatSeg(agente.segundosPorEstado['TIPIFICANDO']) }}
                    </td>
                    <td class="px-3 py-2 text-center text-gray-600 dark:text-gray-400 text-xs">
                      {{ formatSeg(agente.segundosPorEstado['GESTION_MANUAL']) }}
                    </td>
                    <td class="px-3 py-2 text-center text-gray-600 dark:text-gray-400 text-xs">
                      {{ formatSeg(agente.segundosPorEstado['REFRIGERIO']) }}
                    </td>
                    <td class="px-3 py-2 text-center text-gray-600 dark:text-gray-400 text-xs">
                      {{ formatSeg(agente.segundosPorEstado['SSHH']) }}
                    </td>
                  </tr>
                }
                @if (resumen()!.agentes.length === 0) {
                  <tr>
                    <td colspan="11" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                      <lucide-angular name="inbox" [size]="48" class="mx-auto mb-2 text-gray-400"></lucide-angular>
                      <p>No hay datos para mostrar</p>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }

      <!-- Tab: Detalle de Cambios -->
      @if (activeTab() === 'detalle') {
        <!-- Filtro visual -->
        <div class="mb-3">
          <div class="relative">
            <lucide-angular name="search" [size]="16"
              class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></lucide-angular>
            <input
              type="text"
              [ngModel]="detalleFilter()"
              (ngModelChange)="detalleFilter.set($event)"
              placeholder="Filtrar por agente, estado o notas..."
              class="w-full md:w-80 pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm
                     focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                     placeholder:text-gray-400"
            />
          </div>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th class="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Agente</th>
                  <th class="px-3 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Estado Anterior</th>
                  <th class="px-3 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Estado Nuevo</th>
                  <th class="px-3 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Inicio</th>
                  <th class="px-3 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Fin</th>
                  <th class="px-3 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Duracion</th>
                  <th class="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Notas</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                @if (loading()) {
                  <tr>
                    <td colspan="7" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                      <lucide-angular name="loader-2" [size]="32" class="animate-spin mx-auto mb-2"></lucide-angular>
                      <p>Cargando datos...</p>
                    </td>
                  </tr>
                } @else if (registros().length === 0) {
                  <tr>
                    <td colspan="7" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                      <lucide-angular name="inbox" [size]="48" class="mx-auto mb-2 text-gray-400"></lucide-angular>
                      <p>No hay cambios de estado para mostrar</p>
                      <p class="text-xs mt-1">Selecciona las fechas y presiona "Buscar"</p>
                    </td>
                  </tr>
                } @else {
                  @for (reg of filteredRegistros(); track reg.idHistory) {
                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td class="px-3 py-2">
                        <div class="text-gray-900 dark:text-white font-medium text-xs">{{ reg.nombreAgente }}</div>
                      </td>
                      <td class="px-3 py-2 text-center">
                        @if (reg.estadoAnterior) {
                          <span [class]="getEstadoClass(reg.estadoAnterior)">{{ formatEstado(reg.estadoAnterior) }}</span>
                        } @else {
                          <span class="text-gray-400 text-xs">-</span>
                        }
                      </td>
                      <td class="px-3 py-2 text-center">
                        <span [class]="getEstadoClass(reg.estadoNuevo)">{{ formatEstado(reg.estadoNuevo) }}</span>
                      </td>
                      <td class="px-3 py-2 text-center text-gray-600 dark:text-gray-400 text-xs font-mono">
                        {{ reg.timestampInicio | slice:11:19 }}
                      </td>
                      <td class="px-3 py-2 text-center text-gray-600 dark:text-gray-400 text-xs font-mono">
                        {{ reg.timestampFin ? (reg.timestampFin | slice:11:19) : '-' }}
                      </td>
                      <td class="px-3 py-2 text-center text-gray-900 dark:text-white text-xs font-medium">
                        {{ reg.duracionFormateada }}
                      </td>
                      <td class="px-3 py-2 text-gray-600 dark:text-gray-400 text-xs max-w-[200px] truncate">
                        {{ reg.notas || '-' }}
                      </td>
                    </tr>
                  }
                }
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          @if (totalRecords() > 0) {
            <div class="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600
                        flex flex-col sm:flex-row items-center justify-between gap-3">
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Mostrando <span class="font-semibold">{{ registros().length }}</span> de
                <span class="font-semibold">{{ totalRecords() | number }}</span> registros
                (Pagina {{ currentPage() + 1 }})
              </p>
              <div class="flex items-center gap-1">
                <button
                  (click)="goToPage(0)"
                  [disabled]="currentPage() === 0"
                  class="px-2 py-1 text-xs rounded bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500
                         disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-500
                         text-gray-700 dark:text-gray-200"
                >
                  <lucide-angular name="chevrons-left" [size]="14"></lucide-angular>
                </button>
                <button
                  (click)="goToPage(currentPage() - 1)"
                  [disabled]="currentPage() === 0"
                  class="px-2 py-1 text-xs rounded bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500
                         disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-500
                         text-gray-700 dark:text-gray-200"
                >
                  <lucide-angular name="chevron-left" [size]="14"></lucide-angular>
                </button>
                <span class="px-3 py-1 text-xs text-gray-600 dark:text-gray-300">
                  {{ currentPage() + 1 }} / {{ totalPages() }}
                </span>
                <button
                  (click)="goToPage(currentPage() + 1)"
                  [disabled]="currentPage() >= totalPages() - 1"
                  class="px-2 py-1 text-xs rounded bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500
                         disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-500
                         text-gray-700 dark:text-gray-200"
                >
                  <lucide-angular name="chevron-right" [size]="14"></lucide-angular>
                </button>
                <button
                  (click)="goToPage(totalPages() - 1)"
                  [disabled]="currentPage() >= totalPages() - 1"
                  class="px-2 py-1 text-xs rounded bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500
                         disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-500
                         text-gray-700 dark:text-gray-200"
                >
                  <lucide-angular name="chevrons-right" [size]="14"></lucide-angular>
                </button>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: []
})
export class EstadoAgentesReportComponent implements OnInit {
  loading = signal(false);
  registros = signal<RegistroEstadoDTO[]>([]);
  resumen = signal<ResumenEstadoAgentes | null>(null);
  totalRecords = signal(0);
  currentPage = signal(0);
  totalPages = signal(0);
  activeTab = signal<'resumen' | 'detalle'>('resumen');
  detalleFilter = signal('');

  filteredRegistros = computed(() => {
    const filter = this.detalleFilter().toLowerCase().trim();
    const regs = this.registros();
    if (!filter) return regs;
    return regs.filter(r =>
      r.nombreAgente?.toLowerCase().includes(filter) ||
      r.estadoAnterior?.toLowerCase().includes(filter) ||
      r.estadoNuevo?.toLowerCase().includes(filter) ||
      r.notas?.toLowerCase().includes(filter)
    );
  });

  proveedores = signal<Inquilino[]>([]);
  carteras = signal<Cartera[]>([]);
  subcarteras = signal<Subcartera[]>([]);

  filtros = {
    fechaDesde: '',
    fechaHasta: '',
    idProveedor: null as number | null,
    idCartera: null as number | null,
    idSubcartera: null as number | null
  };

  constructor(
    private reporteService: EstadoAgentesReportService,
    private comisionesService: ComisionesService
  ) {}

  ngOnInit(): void {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayStr = `${yyyy}-${mm}-${dd}`;
    this.filtros.fechaDesde = todayStr;
    this.filtros.fechaHasta = todayStr;

    this.comisionesService.obtenerInquilinos().subscribe({
      next: (data) => this.proveedores.set(data),
      error: (err) => console.error('Error cargando proveedores:', err)
    });
  }

  onProveedorChange(idProveedor: number | null): void {
    this.filtros.idCartera = null;
    this.filtros.idSubcartera = null;
    this.carteras.set([]);
    this.subcarteras.set([]);

    if (idProveedor) {
      this.comisionesService.obtenerCarteras(idProveedor).subscribe({
        next: (data) => this.carteras.set(data),
        error: (err) => console.error('Error cargando carteras:', err)
      });
    }
  }

  onCarteraChange(idCartera: number | null): void {
    this.filtros.idSubcartera = null;
    this.subcarteras.set([]);

    if (idCartera) {
      this.comisionesService.obtenerSubcarteras(idCartera).subscribe({
        next: (data) => this.subcarteras.set(data),
        error: (err) => console.error('Error cargando subcarteras:', err)
      });
    }
  }

  buscar(): void {
    if (!this.filtros.fechaDesde || !this.filtros.fechaHasta) return;
    this.currentPage.set(0);
    this.loadData();
  }

  goToPage(page: number): void {
    this.currentPage.set(page);
    this.loadData();
  }

  private loadData(): void {
    this.loading.set(true);

    this.reporteService.getReporte(
      this.filtros.fechaDesde,
      this.filtros.fechaHasta,
      this.filtros.idProveedor || undefined,
      this.filtros.idCartera || undefined,
      this.filtros.idSubcartera || undefined,
      this.currentPage(),
      15
    ).subscribe({
      next: (response) => {
        this.registros.set(response.registros);
        this.resumen.set(response.resumen);
        this.totalRecords.set(response.total);
        this.totalPages.set(Math.ceil(response.total / 15));
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error cargando reporte:', err);
        this.loading.set(false);
        alert('Error al cargar el reporte de estados');
      }
    });
  }

  exportarExcel(): void {
    if (!this.filtros.fechaDesde || !this.filtros.fechaHasta) return;

    this.loading.set(true);

    this.reporteService.exportarExcel(
      this.filtros.fechaDesde,
      this.filtros.fechaHasta,
      this.filtros.idProveedor || undefined,
      this.filtros.idCartera || undefined,
      this.filtros.idSubcartera || undefined
    ).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Reporte_Estados_Agentes_${this.filtros.fechaDesde}_${this.filtros.fechaHasta}.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error exportando Excel:', err);
        this.loading.set(false);
        alert('Error al exportar el reporte a Excel');
      }
    });
  }

  // Helpers
  avgOcupacion(): string {
    const r = this.resumen();
    if (!r || !r.agentes || r.agentes.length === 0) return '0';
    const avg = r.agentes.reduce((sum, a) => sum + a.porcentajeOcupacion, 0) / r.agentes.length;
    return avg.toFixed(1);
  }

  totalBreakTime(): string {
    const r = this.resumen();
    if (!r || !r.agentes) return '0m';
    const totalSeg = r.agentes.reduce((sum, a) => sum + (a.totalSegundosBreak || 0), 0);
    return this.formatSeg(totalSeg);
  }

  formatSeg(seg: number | undefined): string {
    if (!seg) return '0m';
    const h = Math.floor(seg / 3600);
    const m = Math.floor((seg % 3600) / 60);
    const s = seg % 60;
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  }

  formatEstado(estado: string): string {
    return estado.replace(/_/g, ' ');
  }

  getEstadoClass(estado: string): string {
    const base = 'px-2 py-0.5 rounded-full text-[10px] font-semibold';
    switch (estado) {
      case 'DISPONIBLE':
        return `${base} bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400`;
      case 'EN_LLAMADA':
        return `${base} bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400`;
      case 'TIPIFICANDO':
        return `${base} bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400`;
      case 'EN_REUNION':
        return `${base} bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400`;
      case 'REFRIGERIO':
        return `${base} bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400`;
      case 'SSHH':
        return `${base} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400`;
      case 'DESCONECTADO':
        return `${base} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400`;
      case 'GESTION_MANUAL':
      case 'EN_MANUAL':
        return `${base} bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400`;
      case 'SEGUIMIENTO':
        return `${base} bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400`;
      default:
        return `${base} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400`;
    }
  }

  getOcupacionColor(porcentaje: number): string {
    if (porcentaje >= 80) return '#10b981';
    if (porcentaje >= 60) return '#f59e0b';
    return '#ef4444';
  }
}
