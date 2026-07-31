import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import {
  EstadoAgentesReportService,
  ReporteEstadoAgentesResponse,
  RegistroEstadoDTO,
  ResumenEstadoAgentes,
  ResumenPorAgente,
  RegistroAsistenciaDTO,
  ResumenAsistencia,
  AgenteOption
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
          <!-- Fecha: un solo dia para Resumen/Detalle, rango para Asistencia -->
          @if (activeTab() === 'asistencia') {
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Desde *
              </label>
              <input
                type="date"
                [(ngModel)]="filtrosAsistencia.fechaDesde"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Hasta *
              </label>
              <input
                type="date"
                [(ngModel)]="filtrosAsistencia.fechaHasta"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          } @else {
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Fecha *
              </label>
              <input
                type="date"
                [(ngModel)]="filtros.fecha"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          }

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
              (ngModelChange)="onSubcarteraChange($event)"
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
              (click)="onBuscar()"
              [disabled]="anyLoading() || !filtrosCompletos()"
              class="flex-1 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold
                     rounded-lg transition-colors flex items-center justify-center gap-2
                     disabled:opacity-50 disabled:cursor-not-allowed"
            >
              @if (anyLoading()) {
                <lucide-angular name="loader-2" [size]="18" class="animate-spin"></lucide-angular>
              } @else {
                <lucide-angular name="search" [size]="18"></lucide-angular>
              }
              Buscar
            </button>
            <button
              (click)="onExportar()"
              [disabled]="anyLoading() || !hayDatosParaExportar()"
              class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold
                     rounded-lg transition-colors flex items-center gap-2
                     disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <lucide-angular name="download" [size]="18"></lucide-angular>
              Excel
            </button>
          </div>
        </div>

        <!-- Filtros propios del tab de Asistencia -->
        @if (activeTab() === 'asistencia') {
          <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700
                      grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Hora de entrada
              </label>
              <input
                type="time"
                step="1"
                [(ngModel)]="filtrosAsistencia.horaEntrada"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tolerancia (min)
              </label>
              <input
                type="number"
                min="0"
                max="120"
                [(ngModel)]="filtrosAsistencia.toleranciaMin"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Minutos de gracia antes de marcar TARDE
              </p>
            </div>

            <!-- Multiselect de agentes -->
            <div class="relative">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Agentes
              </label>
              <button
                type="button"
                (click)="showAgentePicker.set(!showAgentePicker())"
                [disabled]="agentesDisponibles().length === 0"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-left text-sm
                       flex items-center justify-between gap-2
                       disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span class="truncate">{{ etiquetaAgentes() }}</span>
                <lucide-angular name="chevron-down" [size]="16" class="shrink-0"></lucide-angular>
              </button>

              @if (showAgentePicker()) {
                <div class="absolute z-20 mt-1 w-full max-h-64 overflow-y-auto rounded-lg shadow-lg
                            bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                  <div class="sticky top-0 flex gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-800
                              border-b border-gray-200 dark:border-gray-600">
                    <button type="button" (click)="seleccionarTodosAgentes()"
                            class="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                      Todos
                    </button>
                    <button type="button" (click)="limpiarAgentes()"
                            class="text-xs font-semibold text-gray-500 dark:text-gray-400 hover:underline">
                      Ninguno
                    </button>
                  </div>
                  @for (ag of agentesDisponibles(); track ag.id) {
                    <label class="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer
                                  text-gray-700 dark:text-gray-200
                                  hover:bg-gray-50 dark:hover:bg-gray-600">
                      <input
                        type="checkbox"
                        [checked]="agentesSeleccionados().includes(ag.id)"
                        (change)="toggleAgente(ag.id)"
                        class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span class="truncate">{{ ag.nombre }}</span>
                    </label>
                  }
                </div>
              }
              @if (agentesDisponibles().length === 0) {
                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Elegi una subcartera para acotar la lista
                </p>
              }
            </div>

            <div class="flex items-end">
              <label class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  [(ngModel)]="filtrosAsistencia.incluirDomingos"
                  class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                Incluir domingos
              </label>
            </div>
          </div>
        }

        @if (!filtrosCompletos()) {
          <p class="mt-2 text-sm text-amber-600 dark:text-amber-400">
            @if (activeTab() === 'asistencia') {
              * El rango de fechas es obligatorio
            } @else {
              * La fecha es obligatoria
            }
          </p>
        }
      </div>

      <!-- Tabs: siempre visibles, Asistencia no depende de haber buscado antes -->
      <div class="flex flex-wrap gap-2 mb-4">
        <button
          (click)="cambiarTab('resumen')"
          [class]="tabClass('resumen')"
        >
          Resumen por Agente
        </button>
        <button
          (click)="cambiarTab('detalle')"
          [class]="tabClass('detalle')"
        >
          Detalle de Cambios
        </button>
        <button
          (click)="cambiarTab('asistencia')"
          [class]="tabClass('asistencia')"
        >
          Asistencia
        </button>
      </div>

      <!-- KPI Cards -->
      @if (resumen() && activeTab() !== 'asistencia') {
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

          <!-- Pagination detalle -->
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
      <!-- Tab: Asistencia -->
      @if (activeTab() === 'asistencia') {
        @if (asistenciaResumen(); as ra) {
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
              <div class="flex items-center gap-3">
                <div class="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <lucide-angular name="check-circle" [size]="24" class="text-green-600 dark:text-green-400"></lucide-angular>
                </div>
                <div>
                  <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ ra.porcentajePuntualidad }}%</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Puntualidad ({{ ra.totalPuntual | number }} dias)</p>
                </div>
              </div>
            </div>

            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
              <div class="flex items-center gap-3">
                <div class="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                  <lucide-angular name="clock" [size]="24" class="text-amber-600 dark:text-amber-400"></lucide-angular>
                </div>
                <div>
                  <p class="text-2xl font-bold text-amber-600 dark:text-amber-400">{{ ra.totalTarde | number }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Tardanzas</p>
                </div>
              </div>
            </div>

            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
              <div class="flex items-center gap-3">
                <div class="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <lucide-angular name="user-x" [size]="24" class="text-red-600 dark:text-red-400"></lucide-angular>
                </div>
                <div>
                  <p class="text-2xl font-bold text-red-600 dark:text-red-400">{{ ra.totalFalta | number }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Faltas</p>
                </div>
              </div>
            </div>

            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
              <div class="flex items-center gap-3">
                <div class="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                  <lucide-angular name="timer" [size]="24" class="text-indigo-600 dark:text-indigo-400"></lucide-angular>
                </div>
                <div>
                  <p class="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{{ ra.totalMinutosTardanza | number }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Min. de tardanza ({{ ra.tardanzaAcumulada }})</p>
                </div>
              </div>
            </div>
          </div>
        }

        <!-- Sub-vista + filtro -->
        <div class="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div class="flex gap-2">
            <button
              (click)="asistenciaVista.set('diario')"
              [class]="subTabClass('diario')"
            >
              Detalle diario
            </button>
            <button
              (click)="asistenciaVista.set('agente')"
              [class]="subTabClass('agente')"
            >
              Resumen por agente
            </button>
          </div>

          <div class="relative">
            <lucide-angular name="search" [size]="16"
              class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></lucide-angular>
            <input
              type="text"
              [ngModel]="asistenciaFilter()"
              (ngModelChange)="asistenciaFilter.set($event)"
              placeholder="Filtrar por agente o estado..."
              class="w-full md:w-72 pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm
                     focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                     placeholder:text-gray-400"
            />
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div class="overflow-x-auto">
            @if (asistenciaVista() === 'diario') {
              <table class="w-full text-sm">
                <thead class="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th class="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Fecha</th>
                    <th class="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Agente</th>
                    <th class="px-3 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Ingreso</th>
                    <th class="px-3 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Salida</th>
                    <th class="px-3 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Estado</th>
                    <th class="px-3 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Tardanza</th>
                    <th class="px-3 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Conectado</th>
                    <th class="px-3 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Jornada</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                  @if (asistenciaLoading()) {
                    <tr>
                      <td colspan="8" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                        <lucide-angular name="loader-2" [size]="32" class="animate-spin mx-auto mb-2"></lucide-angular>
                        <p>Cargando asistencia...</p>
                      </td>
                    </tr>
                  } @else if (filteredAsistencia().length === 0) {
                    <tr>
                      <td colspan="8" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                        <lucide-angular name="inbox" [size]="48" class="mx-auto mb-2 text-gray-400"></lucide-angular>
                        <p>{{ asistenciaRegistros().length === 0
                              ? 'Selecciona el rango y presiona "Buscar"'
                              : 'Ningun registro coincide con el filtro' }}</p>
                      </td>
                    </tr>
                  } @else {
                    @for (reg of filteredAsistencia(); track reg.fecha + '-' + reg.idUsuario) {
                      <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td class="px-3 py-2 text-gray-600 dark:text-gray-400 text-xs font-mono">{{ reg.fecha }}</td>
                        <td class="px-3 py-2">
                          <div class="text-gray-900 dark:text-white font-medium text-xs">{{ reg.nombreAgente }}</div>
                          <div class="text-[10px] text-gray-500 dark:text-gray-400">{{ reg.subcartera }}</div>
                        </td>
                        <td class="px-3 py-2 text-center text-gray-600 dark:text-gray-400 text-xs font-mono">
                          {{ reg.horaIngreso || '-' }}
                        </td>
                        <td class="px-3 py-2 text-center text-gray-600 dark:text-gray-400 text-xs font-mono">
                          {{ reg.horaSalida || '-' }}
                        </td>
                        <td class="px-3 py-2 text-center">
                          <span [class]="getAsistenciaClass(reg.estadoAsistencia)">{{ reg.estadoAsistencia }}</span>
                        </td>
                        <td class="px-3 py-2 text-center text-xs font-medium"
                            [class.text-amber-600]="reg.minutosTardanza > 0"
                            [class.dark:text-amber-400]="reg.minutosTardanza > 0"
                            [class.text-gray-400]="reg.minutosTardanza === 0">
                          {{ reg.minutosTardanza > 0 ? (reg.minutosTardanza + ' min') : '-' }}
                        </td>
                        <td class="px-3 py-2 text-center text-gray-600 dark:text-gray-400 text-xs font-mono">
                          {{ reg.estadoAsistencia === 'FALTA' ? '-' : reg.tiempoConectado }}
                        </td>
                        <td class="px-3 py-2 text-center text-gray-600 dark:text-gray-400 text-xs font-mono">
                          {{ reg.estadoAsistencia === 'FALTA' ? '-' : reg.jornada }}
                        </td>
                      </tr>
                    }
                  }
                </tbody>
              </table>
            } @else {
              <table class="w-full text-sm">
                <thead class="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th class="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Agente</th>
                    <th class="px-3 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Dias Trab.</th>
                    <th class="px-3 py-3 text-center text-xs font-semibold text-green-600 dark:text-green-400 uppercase">Puntual</th>
                    <th class="px-3 py-3 text-center text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase">Tarde</th>
                    <th class="px-3 py-3 text-center text-xs font-semibold text-red-600 dark:text-red-400 uppercase">Falta</th>
                    <th class="px-3 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">% Puntualidad</th>
                    <th class="px-3 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Min. Tardanza</th>
                    <th class="px-3 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Prom. Ingreso</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                  @if (filteredAsistenciaAgentes().length === 0) {
                    <tr>
                      <td colspan="8" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                        <lucide-angular name="inbox" [size]="48" class="mx-auto mb-2 text-gray-400"></lucide-angular>
                        <p>No hay datos para mostrar</p>
                      </td>
                    </tr>
                  } @else {
                    @for (ag of filteredAsistenciaAgentes(); track ag.idUsuario) {
                      <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td class="px-3 py-2">
                          <div class="text-gray-900 dark:text-white font-medium">{{ ag.nombreAgente }}</div>
                          <div class="text-xs text-gray-500 dark:text-gray-400">{{ ag.username }}</div>
                        </td>
                        <td class="px-3 py-2 text-center text-gray-900 dark:text-white font-medium">{{ ag.diasTrabajados }}</td>
                        <td class="px-3 py-2 text-center text-green-600 dark:text-green-400 font-medium">{{ ag.diasPuntual }}</td>
                        <td class="px-3 py-2 text-center text-amber-600 dark:text-amber-400 font-medium">{{ ag.diasTarde }}</td>
                        <td class="px-3 py-2 text-center text-red-600 dark:text-red-400 font-medium">{{ ag.diasFalta }}</td>
                        <td class="px-3 py-2 text-center">
                          <div class="flex items-center justify-center gap-2">
                            <div class="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                              <div
                                class="h-2 rounded-full"
                                [style.width.%]="ag.porcentajePuntualidad"
                                [style.background-color]="getPuntualidadColor(ag.porcentajePuntualidad)"
                              ></div>
                            </div>
                            <span class="text-xs font-semibold" [style.color]="getPuntualidadColor(ag.porcentajePuntualidad)">
                              {{ ag.porcentajePuntualidad }}%
                            </span>
                          </div>
                        </td>
                        <td class="px-3 py-2 text-center text-gray-600 dark:text-gray-400 text-xs">
                          {{ ag.totalMinutosTardanza }} <span class="text-[10px]">({{ ag.tardanzaAcumulada }})</span>
                        </td>
                        <td class="px-3 py-2 text-center text-gray-600 dark:text-gray-400 text-xs font-mono">
                          {{ ag.promedioHoraIngreso || '-' }}
                        </td>
                      </tr>
                    }
                  }
                </tbody>
              </table>
            }
          </div>

          @if (asistenciaRegistros().length > 0) {
            <div class="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
              <p class="text-sm text-gray-600 dark:text-gray-400">
                <span class="font-semibold">{{ asistenciaResumen()?.totalAgentes }}</span> agentes x
                <span class="font-semibold">{{ asistenciaResumen()?.totalDias }}</span> dias laborables =
                <span class="font-semibold">{{ asistenciaRegistros().length | number }}</span> registros
              </p>
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
  activeTab = signal<'resumen' | 'detalle' | 'asistencia'>('resumen');
  detalleFilter = signal('');

  // ==================== ASISTENCIA ====================
  asistenciaLoading = signal(false);
  asistenciaRegistros = signal<RegistroAsistenciaDTO[]>([]);
  asistenciaResumen = signal<ResumenAsistencia | null>(null);
  asistenciaVista = signal<'diario' | 'agente'>('diario');
  asistenciaFilter = signal('');
  agentesDisponibles = signal<AgenteOption[]>([]);
  agentesSeleccionados = signal<number[]>([]);
  showAgentePicker = signal(false);

  filtrosAsistencia = {
    fechaDesde: '',
    fechaHasta: '',
    horaEntrada: '08:00:00',
    toleranciaMin: 0,
    incluirDomingos: false
  };

  filteredAsistencia = computed(() => {
    const filter = this.asistenciaFilter().toLowerCase().trim();
    const regs = this.asistenciaRegistros();
    if (!filter) return regs;
    return regs.filter(r =>
      r.nombreAgente?.toLowerCase().includes(filter) ||
      r.username?.toLowerCase().includes(filter) ||
      r.estadoAsistencia?.toLowerCase().includes(filter) ||
      r.fecha?.includes(filter)
    );
  });

  filteredAsistenciaAgentes = computed(() => {
    const filter = this.asistenciaFilter().toLowerCase().trim();
    const agentes = this.asistenciaResumen()?.agentes ?? [];
    if (!filter) return agentes;
    return agentes.filter(a =>
      a.nombreAgente?.toLowerCase().includes(filter) ||
      a.username?.toLowerCase().includes(filter)
    );
  });

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
    fecha: '',
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
    this.filtros.fecha = todayStr;

    // Asistencia arranca en el mes en curso: es un reporte de periodo, no de un dia
    this.filtrosAsistencia.fechaDesde = `${yyyy}-${mm}-01`;
    this.filtrosAsistencia.fechaHasta = todayStr;

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
    this.resetAgentes();

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
    this.resetAgentes();

    if (idCartera) {
      this.comisionesService.obtenerSubcarteras(idCartera).subscribe({
        next: (data) => this.subcarteras.set(data),
        error: (err) => console.error('Error cargando subcarteras:', err)
      });
    }
  }

  /** Al elegir subcartera se precarga el roster para el multiselect de asistencia. */
  onSubcarteraChange(idSubcartera: number | null): void {
    this.resetAgentes();
    if (!idSubcartera) return;

    this.reporteService.getAgentesSubcartera(idSubcartera).subscribe({
      next: (data) => this.agentesDisponibles.set(data),
      error: (err) => console.error('Error cargando agentes de la subcartera:', err)
    });
  }

  private resetAgentes(): void {
    this.agentesDisponibles.set([]);
    this.agentesSeleccionados.set([]);
    this.showAgentePicker.set(false);
  }

  buscar(): void {
    if (!this.filtros.fecha) return;
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
      this.filtros.fecha,
      this.filtros.fecha,
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
    if (!this.filtros.fecha || !this.filtros.fecha) return;

    this.loading.set(true);

    this.reporteService.exportarExcel(
      this.filtros.fecha,
      this.filtros.fecha,
      this.filtros.idProveedor || undefined,
      this.filtros.idCartera || undefined,
      this.filtros.idSubcartera || undefined
    ).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Reporte_Estados_Agentes_${this.filtros.fecha}_${this.filtros.fecha}.xlsx`;
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

  // ==================== ASISTENCIA ====================

  cambiarTab(tab: 'resumen' | 'detalle' | 'asistencia'): void {
    this.activeTab.set(tab);
    this.showAgentePicker.set(false);
  }

  tabClass(tab: 'resumen' | 'detalle' | 'asistencia'): string {
    return this.activeTab() === tab
      ? 'px-4 py-2 bg-indigo-500 text-white rounded-lg font-semibold'
      : 'px-4 py-2 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700';
  }

  subTabClass(vista: 'diario' | 'agente'): string {
    return this.asistenciaVista() === vista
      ? 'px-3 py-1.5 text-sm bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded-lg font-semibold'
      : 'px-3 py-1.5 text-sm bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700';
  }

  anyLoading(): boolean {
    return this.loading() || this.asistenciaLoading();
  }

  filtrosCompletos(): boolean {
    return this.activeTab() === 'asistencia'
      ? !!this.filtrosAsistencia.fechaDesde && !!this.filtrosAsistencia.fechaHasta
      : !!this.filtros.fecha;
  }

  hayDatosParaExportar(): boolean {
    return this.activeTab() === 'asistencia'
      ? this.asistenciaRegistros().length > 0
      : !!this.resumen();
  }

  onBuscar(): void {
    if (this.activeTab() === 'asistencia') {
      this.buscarAsistencia();
    } else {
      this.buscar();
    }
  }

  onExportar(): void {
    if (this.activeTab() === 'asistencia') {
      this.exportarAsistenciaExcel();
    } else {
      this.exportarExcel();
    }
  }

  etiquetaAgentes(): string {
    const total = this.agentesDisponibles().length;
    const sel = this.agentesSeleccionados().length;
    if (total === 0) return 'Todos';
    if (sel === 0 || sel === total) return `Todos (${total})`;
    return `${sel} de ${total} seleccionados`;
  }

  toggleAgente(id: number): void {
    const actuales = this.agentesSeleccionados();
    this.agentesSeleccionados.set(
      actuales.includes(id) ? actuales.filter(x => x !== id) : [...actuales, id]
    );
  }

  seleccionarTodosAgentes(): void {
    this.agentesSeleccionados.set(this.agentesDisponibles().map(a => a.id));
  }

  limpiarAgentes(): void {
    this.agentesSeleccionados.set([]);
  }

  buscarAsistencia(): void {
    if (!this.filtrosCompletos()) return;

    this.asistenciaLoading.set(true);
    this.showAgentePicker.set(false);

    this.reporteService.getAsistencia(this.construirFiltrosAsistencia()).subscribe({
      next: (response) => {
        this.asistenciaRegistros.set(response.registros);
        this.asistenciaResumen.set(response.resumen);
        this.asistenciaLoading.set(false);
      },
      error: (err) => {
        console.error('Error cargando asistencia:', err);
        this.asistenciaLoading.set(false);
        alert('Error al cargar el reporte de asistencia');
      }
    });
  }

  exportarAsistenciaExcel(): void {
    if (!this.filtrosCompletos()) return;

    this.asistenciaLoading.set(true);

    this.reporteService.exportarAsistenciaExcel(this.construirFiltrosAsistencia()).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Reporte_Asistencia_${this.filtrosAsistencia.fechaDesde}_${this.filtrosAsistencia.fechaHasta}.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        this.asistenciaLoading.set(false);
      },
      error: (err) => {
        console.error('Error exportando asistencia:', err);
        this.asistenciaLoading.set(false);
        alert('Error al exportar la asistencia a Excel');
      }
    });
  }

  /**
   * Seleccionar todos los agentes equivale a no mandar el filtro: el SP ya acota
   * por subcartera y asi la URL no se llena de ids.
   */
  private construirFiltrosAsistencia() {
    const sel = this.agentesSeleccionados();
    const todos = sel.length === 0 || sel.length === this.agentesDisponibles().length;

    return {
      fechaDesde: this.filtrosAsistencia.fechaDesde,
      fechaHasta: this.filtrosAsistencia.fechaHasta,
      tenantId: this.filtros.idProveedor || undefined,
      carteraId: this.filtros.idCartera || undefined,
      subcarteraId: this.filtros.idSubcartera || undefined,
      idsUsuarios: todos ? undefined : sel,
      horaEntrada: this.filtrosAsistencia.horaEntrada,
      toleranciaMin: this.filtrosAsistencia.toleranciaMin || 0,
      incluirDomingos: this.filtrosAsistencia.incluirDomingos
    };
  }

  getAsistenciaClass(estado: string): string {
    const base = 'px-2 py-0.5 rounded-full text-[10px] font-semibold';
    switch (estado) {
      case 'PUNTUAL':
        return `${base} bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400`;
      case 'TARDE':
        return `${base} bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400`;
      case 'FALTA':
        return `${base} bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400`;
      default:
        return `${base} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400`;
    }
  }

  getPuntualidadColor(porcentaje: number): string {
    if (porcentaje >= 90) return '#10b981';
    if (porcentaje >= 70) return '#f59e0b';
    return '#ef4444';
  }
}
