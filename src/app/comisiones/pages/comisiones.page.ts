import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComisionesService } from '../services/comisiones.service';
import {
  ComisionMeta,
  ComisionMetaEscala,
  ComisionBono,
  ComisionBonoEscala,
  ComisionReporte,
  ComisionAgente,
  Subcartera
} from '../models/comision.model';

@Component({
  selector: 'app-comisiones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-slate-800 dark:text-white">
          Comisiones
        </h1>
        <p class="text-slate-600 dark:text-slate-400">
          Configuración de metas, bonos y cálculo de comisiones por agente
        </p>
      </div>

      <!-- Tabs -->
      <div class="mb-6">
        <div class="border-b border-slate-200 dark:border-slate-700">
          <nav class="-mb-px flex space-x-8">
            <button
              (click)="activeTab.set('metas')"
              [class]="activeTab() === 'metas'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 hover:border-slate-300'"
              class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
              Metas
            </button>
            <button
              (click)="activeTab.set('bonos'); cargarBonos()"
              [class]="activeTab() === 'bonos'
                ? 'border-green-500 text-green-600 dark:text-green-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 hover:border-slate-300'"
              class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Bonos
            </button>
            <button
              (click)="activeTab.set('reporte')"
              [class]="activeTab() === 'reporte'
                ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 hover:border-slate-300'"
              class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              Reporte
            </button>
          </nav>
        </div>
      </div>

      <!-- ==================== TAB: METAS ==================== -->
      @if (activeTab() === 'metas') {
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-6">
          <!-- Selector de período -->
          <div class="flex flex-wrap gap-4 items-end mb-6">
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Año</label>
              <select [(ngModel)]="filtroAnio" (change)="cargarMetas()" class="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white">
                @for (a of aniosDisponibles; track a) {
                  <option [value]="a">{{ a }}</option>
                }
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Mes</label>
              <select [(ngModel)]="filtroMes" (change)="cargarMetas()" class="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white">
                @for (m of mesesDisponibles; track m.value) {
                  <option [value]="m.value">{{ m.label }}</option>
                }
              </select>
            </div>
            <button (click)="nuevaMeta()" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              Nueva Meta
            </button>
          </div>

          <!-- Formulario de meta -->
          @if (mostrarFormMeta()) {
            <div class="mb-6 p-4 border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h3 class="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                {{ metaEditando()?.id ? 'Editar Meta' : 'Nueva Meta' }}
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Subcartera</label>
                  <select [(ngModel)]="metaEditando()!.idSubcartera" (change)="onSubcarteraChange()" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white">
                    <option [value]="0">Seleccionar subcartera...</option>
                    @for (sub of subcarteras(); track sub.id) {
                      <option [value]="sub.id">{{ sub.nombreSubcartera }}</option>
                    }
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Meta Grupal (S/)</label>
                  <input type="number" [(ngModel)]="metaEditando()!.metaGrupal" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white" placeholder="0.00">
                </div>
              </div>

              <!-- Escalas de comisión -->
              <div class="mb-4">
                <div class="flex justify-between items-center mb-2">
                  <label class="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Escalas de Comisión (por % de cumplimiento)
                  </label>
                  <button (click)="agregarEscalaMeta()" class="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                    </svg>
                    Agregar escala
                  </button>
                </div>
                <div class="space-y-2">
                  @for (escala of metaEditando()!.escalas; track $index; let i = $index) {
                    <div class="flex gap-2 items-center flex-wrap">
                      <span class="text-slate-500 text-sm">Desde</span>
                      <input type="number" [(ngModel)]="escala.porcentajeDesde" class="w-20 px-2 py-1.5 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm" placeholder="0">
                      <span class="text-slate-500 text-sm">% hasta</span>
                      <input type="number" [(ngModel)]="escala.porcentajeHasta" class="w-20 px-2 py-1.5 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm" placeholder="100">
                      <span class="text-slate-500 text-sm">% =</span>
                      <span class="text-slate-500 text-sm">S/</span>
                      <input type="number" step="0.01" [(ngModel)]="escala.montoComision" class="w-24 px-2 py-1.5 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm" placeholder="0.00">
                      <button (click)="eliminarEscalaMeta(i)" class="text-red-500 hover:text-red-700 p-1">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                      </button>
                    </div>
                  }
                  @if (metaEditando()!.escalas.length === 0) {
                    <p class="text-sm text-slate-400 italic">No hay escalas configuradas. Agrega al menos una escala.</p>
                  }
                </div>
              </div>

              <div class="flex gap-2">
                <button (click)="guardarMeta()" [disabled]="isLoading()" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-400 transition-colors">
                  {{ isLoading() ? 'Guardando...' : 'Guardar' }}
                </button>
                <button (click)="cancelarMeta()" class="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                  Cancelar
                </button>
              </div>
            </div>
          }

          <!-- Lista de metas -->
          @if (metas().length > 0) {
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                <thead class="bg-slate-50 dark:bg-slate-700/50">
                  <tr>
                    <th class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Subcartera</th>
                    <th class="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Meta Grupal</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Escalas de Comisión</th>
                    <th class="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">Estado</th>
                    <th class="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
                  @for (meta of metas(); track meta.id) {
                    <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                      <td class="px-4 py-3 text-sm text-slate-800 dark:text-white font-medium">
                        {{ meta.nombreSubcartera || 'Subcartera ' + meta.idSubcartera }}
                      </td>
                      <td class="px-4 py-3 text-sm text-right text-green-600 font-semibold">
                        S/ {{ formatMonto(meta.metaGrupal) }}
                      </td>
                      <td class="px-4 py-3 text-sm">
                        <div class="flex flex-wrap gap-1">
                          @for (escala of meta.escalas || []; track escala.id) {
                            <span class="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 rounded text-xs text-blue-700 dark:text-blue-300">
                              {{ escala.porcentajeDesde }}-{{ escala.porcentajeHasta || '100+' }}% = S/{{ escala.montoComision }}
                            </span>
                          }
                          @if (!meta.escalas || meta.escalas.length === 0) {
                            <span class="text-slate-400 italic text-xs">Sin escalas</span>
                          }
                        </div>
                      </td>
                      <td class="px-4 py-3 text-center">
                        <span [class]="meta.activo ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-400'" class="px-2 py-1 rounded-full text-xs font-medium">
                          {{ meta.activo ? 'Activo' : 'Inactivo' }}
                        </span>
                      </td>
                      <td class="px-4 py-3 text-center">
                        <button (click)="editarMeta(meta)" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mr-2">
                          <svg class="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                          </svg>
                        </button>
                        <button (click)="eliminarMeta(meta)" class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                          <svg class="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          } @else {
            <div class="text-center py-8 text-slate-500 dark:text-slate-400">
              No hay metas configuradas para este período
            </div>
          }
        </div>
      }

      <!-- ==================== TAB: BONOS ==================== -->
      @if (activeTab() === 'bonos') {
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-lg font-semibold text-slate-800 dark:text-white">Configuración de Bonos</h2>
            <button (click)="nuevoBono()" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              Nuevo Bono
            </button>
          </div>

          <!-- Formulario de bono -->
          @if (mostrarFormBono()) {
            <div class="mb-6 p-4 border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h3 class="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                {{ bonoEditando()?.id ? 'Editar Bono' : 'Nuevo Bono' }}
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nombre del Bono</label>
                  <input type="text" [(ngModel)]="bonoEditando()!.nombre" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white" placeholder="Ej: Bono LTD T5">
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Descripción</label>
                  <input type="text" [(ngModel)]="bonoEditando()!.descripcion" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white" placeholder="Descripción opcional">
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Campo a Evaluar</label>
                  <select [(ngModel)]="bonoEditando()!.campoEvaluar" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white">
                    <option value="">Seleccionar campo...</option>
                    @for (campo of camposDisponibles(); track campo) {
                      <option [value]="campo">{{ comisionesService.getNombreCampo(campo) }}</option>
                    }
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Valor a Buscar</label>
                  <input type="text" [(ngModel)]="bonoEditando()!.valorBuscar" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white" placeholder="Ej: ltd_t5">
                </div>
              </div>

              <!-- Escalas -->
              <div class="mb-4">
                <div class="flex justify-between items-center mb-2">
                  <label class="block text-sm font-medium text-slate-700 dark:text-slate-300">Escalas</label>
                  <button (click)="agregarEscala()" class="text-sm text-green-600 hover:text-green-800 dark:text-green-400 flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                    </svg>
                    Agregar escala
                  </button>
                </div>
                <div class="space-y-2">
                  @for (escala of bonoEditando()!.escalas; track $index; let i = $index) {
                    <div class="flex gap-2 items-center">
                      <input type="number" [(ngModel)]="escala.cantidadMinima" class="w-32 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white" placeholder="Cantidad">
                      <span class="text-slate-500">pagos =</span>
                      <input type="number" step="0.01" [(ngModel)]="escala.monto" class="w-32 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white" placeholder="Monto">
                      <span class="text-slate-500">S/</span>
                      <button (click)="eliminarEscala(i)" class="text-red-500 hover:text-red-700">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                      </button>
                    </div>
                  }
                </div>
              </div>

              <div class="flex gap-2">
                <button (click)="guardarBono()" [disabled]="isLoading()" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-slate-400 transition-colors">
                  {{ isLoading() ? 'Guardando...' : 'Guardar' }}
                </button>
                <button (click)="cancelarBono()" class="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                  Cancelar
                </button>
              </div>
            </div>
          }

          <!-- Lista de bonos -->
          @if (bonos().length > 0) {
            <div class="space-y-4">
              @for (bono of bonos(); track bono.id) {
                <div class="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                  <div class="flex justify-between items-start">
                    <div>
                      <h4 class="font-semibold text-slate-800 dark:text-white">{{ bono.nombre }}</h4>
                      <p class="text-sm text-slate-600 dark:text-slate-400">
                        {{ comisionesService.getNombreCampo(bono.campoEvaluar) }} = "{{ bono.valorBuscar }}"
                      </p>
                      @if (bono.descripcion) {
                        <p class="text-sm text-slate-500 dark:text-slate-500 mt-1">{{ bono.descripcion }}</p>
                      }
                    </div>
                    <div class="flex items-center gap-2">
                      <span [class]="bono.activo ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-400'" class="px-2 py-1 rounded-full text-xs font-medium">
                        {{ bono.activo ? 'Activo' : 'Inactivo' }}
                      </span>
                      <button (click)="editarBono(bono)" class="text-blue-600 hover:text-blue-800 dark:text-blue-400">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                      </button>
                      <button (click)="eliminarBono(bono)" class="text-red-600 hover:text-red-800 dark:text-red-400">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <!-- Escalas del bono -->
                  @if (bono.escalas && bono.escalas.length > 0) {
                    <div class="mt-3 flex flex-wrap gap-2">
                      @for (escala of bono.escalas; track escala.id) {
                        <span class="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-sm text-slate-700 dark:text-slate-300">
                          {{ escala.cantidadMinima }}+ pagos = S/ {{ escala.monto }}
                        </span>
                      }
                    </div>
                  }
                </div>
              }
            </div>
          } @else {
            <div class="text-center py-8 text-slate-500 dark:text-slate-400">
              No hay bonos configurados
            </div>
          }
        </div>
      }

      <!-- ==================== TAB: REPORTE ==================== -->
      @if (activeTab() === 'reporte') {
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-6">
          <!-- Filtros -->
          <div class="flex flex-wrap gap-4 items-end mb-6">
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Año</label>
              <select [(ngModel)]="filtroAnio" class="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white">
                @for (a of aniosDisponibles; track a) {
                  <option [value]="a">{{ a }}</option>
                }
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Mes</label>
              <select [(ngModel)]="filtroMes" class="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white">
                @for (m of mesesDisponibles; track m.value) {
                  <option [value]="m.value">{{ m.label }}</option>
                }
              </select>
            </div>
            <button (click)="calcularComisiones()" [disabled]="isLoading()" class="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-slate-400 transition-colors flex items-center gap-2">
              @if (isLoading()) {
                <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Calculando...
              } @else {
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                </svg>
                Calcular Comisiones
              }
            </button>
          </div>

          <!-- Resumen -->
          @if (reporte()) {
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <p class="text-sm text-blue-600 dark:text-blue-400 font-medium">Total Recaudo</p>
                <p class="text-2xl font-bold text-blue-800 dark:text-blue-300">S/ {{ formatMonto(reporte()!.totalRecaudo) }}</p>
              </div>
              <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <p class="text-sm text-green-600 dark:text-green-400 font-medium">Total Comisiones</p>
                <p class="text-2xl font-bold text-green-800 dark:text-green-300">S/ {{ formatMonto(reporte()!.totalComisiones) }}</p>
              </div>
              <div class="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4">
                <p class="text-sm text-amber-600 dark:text-amber-400 font-medium">Total Bonos</p>
                <p class="text-2xl font-bold text-amber-800 dark:text-amber-300">S/ {{ formatMonto(reporte()!.totalBonos) }}</p>
              </div>
              <div class="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                <p class="text-sm text-purple-600 dark:text-purple-400 font-medium">Agentes</p>
                <p class="text-2xl font-bold text-purple-800 dark:text-purple-300">{{ reporte()!.totalAgentes }}</p>
              </div>
            </div>

            <!-- Tabla de agentes -->
            @if (reporte()!.agentes && reporte()!.agentes.length > 0) {
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                  <thead class="bg-slate-50 dark:bg-slate-700/50">
                    <tr>
                      <th class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Agente</th>
                      <th class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Subcartera</th>
                      <th class="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Recaudo</th>
                      <th class="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Meta</th>
                      <th class="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">% Cumpl.</th>
                      <th class="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Comisión</th>
                      <th class="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Bonos</th>
                      <th class="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Total</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
                    @for (agente of reporte()!.agentes; track agente.idAgente) {
                      <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                        <td class="px-4 py-3 text-sm font-medium text-slate-800 dark:text-white">
                          {{ agente.nombreAgente || 'Agente ' + agente.idAgente }}
                        </td>
                        <td class="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                          {{ agente.nombreSubcartera }}
                        </td>
                        <td class="px-4 py-3 text-sm text-right text-green-600 font-semibold">
                          S/ {{ formatMonto(agente.recaudoTotal) }}
                        </td>
                        <td class="px-4 py-3 text-sm text-right text-slate-600 dark:text-slate-400">
                          S/ {{ formatMonto(agente.metaIndividual) }}
                        </td>
                        <td class="px-4 py-3 text-sm text-right">
                          <span [class]="agente.metaAlcanzada ? 'text-green-600 font-semibold' : 'text-amber-600'">
                            {{ agente.porcentajeCumplimiento | number:'1.1-1' }}%
                          </span>
                        </td>
                        <td class="px-4 py-3 text-sm text-right text-blue-600">
                          S/ {{ formatMonto(agente.comisionBase) }}
                        </td>
                        <td class="px-4 py-3 text-sm text-right text-amber-600">
                          S/ {{ formatMonto(agente.totalBonos) }}
                          @if (agente.bonosGanados && agente.bonosGanados.length > 0) {
                            <button (click)="toggleDetalleBonos(agente)" class="ml-1 text-slate-400 hover:text-slate-600">
                              <svg class="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                              </svg>
                            </button>
                          }
                        </td>
                        <td class="px-4 py-3 text-sm text-right font-bold text-purple-600">
                          S/ {{ formatMonto(agente.totalComision) }}
                        </td>
                      </tr>
                      <!-- Detalle de bonos expandible -->
                      @if (agenteExpandido() === agente.idAgente && agente.bonosGanados && agente.bonosGanados.length > 0) {
                        <tr class="bg-amber-50 dark:bg-amber-900/10">
                          <td colspan="8" class="px-4 py-2">
                            <div class="text-sm">
                              <span class="font-medium text-amber-700 dark:text-amber-400">Bonos ganados:</span>
                              @for (bono of agente.bonosGanados; track bono.bonoId) {
                                <span class="ml-2 px-2 py-1 bg-amber-100 dark:bg-amber-900/30 rounded text-amber-800 dark:text-amber-300">
                                  {{ bono.nombreBono }}: {{ bono.cantidadPagos }} pagos = S/ {{ bono.montoGanado }}
                                </span>
                              }
                            </div>
                          </td>
                        </tr>
                      }
                    }
                  </tbody>
                </table>
              </div>
            } @else {
              <div class="text-center py-8 text-slate-500 dark:text-slate-400">
                No hay datos para mostrar
              </div>
            }
          } @else {
            <div class="text-center py-12 text-slate-500 dark:text-slate-400">
              <svg class="w-12 h-12 mx-auto mb-4 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              <p>Selecciona un período y haz clic en "Calcular Comisiones"</p>
            </div>
          }
        </div>
      }

      <!-- Mensajes -->
      @if (mensaje()) {
        <div [class]="mensajeError() ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800' : 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'"
             class="fixed bottom-4 right-4 p-4 border rounded-lg shadow-lg max-w-md">
          <p [class]="mensajeError() ? 'text-red-700 dark:text-red-400' : 'text-green-700 dark:text-green-400'">
            {{ mensaje() }}
          </p>
        </div>
      }
    </div>
  `
})
export class ComisionesPage implements OnInit {

  activeTab = signal<'metas' | 'bonos' | 'reporte'>('metas');
  isLoading = signal(false);
  mensaje = signal('');
  mensajeError = signal(false);

  // Subcarteras
  subcarteras = signal<Subcartera[]>([]);

  // Metas
  metas = signal<ComisionMeta[]>([]);
  mostrarFormMeta = signal(false);
  metaEditando = signal<ComisionMeta | null>(null);

  // Bonos
  bonos = signal<ComisionBono[]>([]);
  mostrarFormBono = signal(false);
  bonoEditando = signal<ComisionBono | null>(null);
  camposDisponibles = signal<string[]>([]);

  // Reporte
  reporte = signal<ComisionReporte | null>(null);
  agenteExpandido = signal<number | null>(null);

  // Filtros
  filtroAnio = new Date().getFullYear();
  filtroMes = new Date().getMonth() + 1;

  aniosDisponibles = [2024, 2025, 2026];
  mesesDisponibles = [
    { value: 1, label: 'Enero' },
    { value: 2, label: 'Febrero' },
    { value: 3, label: 'Marzo' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Mayo' },
    { value: 6, label: 'Junio' },
    { value: 7, label: 'Julio' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Septiembre' },
    { value: 10, label: 'Octubre' },
    { value: 11, label: 'Noviembre' },
    { value: 12, label: 'Diciembre' }
  ];

  constructor(public comisionesService: ComisionesService) {}

  ngOnInit() {
    this.cargarSubcarteras();
    this.cargarMetas();
    this.cargarCamposDisponibles();
  }

  // ==================== SUBCARTERAS ====================

  cargarSubcarteras() {
    this.comisionesService.obtenerSubcarteras().subscribe({
      next: (data) => this.subcarteras.set(data),
      error: (err) => console.error('Error al cargar subcarteras:', err)
    });
  }

  // ==================== METAS ====================

  cargarMetas() {
    this.comisionesService.obtenerMetas(this.filtroAnio, this.filtroMes).subscribe({
      next: (data) => this.metas.set(data),
      error: (err) => this.mostrarMensaje('Error al cargar metas: ' + err.message, true)
    });
  }

  nuevaMeta() {
    this.metaEditando.set({
      idSubcartera: 0,
      nombreSubcartera: '',
      anio: this.filtroAnio,
      mes: this.filtroMes,
      metaGrupal: 0,
      escalas: [],
      activo: true
    });
    this.mostrarFormMeta.set(true);
  }

  editarMeta(meta: ComisionMeta) {
    this.metaEditando.set({
      ...meta,
      escalas: meta.escalas ? [...meta.escalas] : []
    });
    this.mostrarFormMeta.set(true);
  }

  onSubcarteraChange() {
    if (!this.metaEditando()) return;
    const subcartera = this.subcarteras().find(s => s.id == this.metaEditando()!.idSubcartera);
    if (subcartera) {
      this.metaEditando.set({
        ...this.metaEditando()!,
        nombreSubcartera: subcartera.nombreSubcartera
      });
    }
  }

  agregarEscalaMeta() {
    if (!this.metaEditando()) return;
    const escalas = [...this.metaEditando()!.escalas, {
      porcentajeDesde: 0,
      porcentajeHasta: undefined,
      montoComision: 0
    }];
    this.metaEditando.set({ ...this.metaEditando()!, escalas });
  }

  eliminarEscalaMeta(index: number) {
    if (!this.metaEditando()) return;
    const escalas = this.metaEditando()!.escalas.filter((_, i) => i !== index);
    this.metaEditando.set({ ...this.metaEditando()!, escalas });
  }

  guardarMeta() {
    if (!this.metaEditando()) return;

    this.isLoading.set(true);
    this.comisionesService.guardarMeta(this.metaEditando()!).subscribe({
      next: () => {
        this.mostrarMensaje('Meta guardada correctamente', false);
        this.cargarMetas();
        this.cancelarMeta();
      },
      error: (err) => this.mostrarMensaje('Error: ' + err.error?.message || err.message, true),
      complete: () => this.isLoading.set(false)
    });
  }

  eliminarMeta(meta: ComisionMeta) {
    if (!confirm('¿Eliminar esta meta?')) return;

    this.comisionesService.eliminarMeta(meta.id!).subscribe({
      next: () => {
        this.mostrarMensaje('Meta eliminada', false);
        this.cargarMetas();
      },
      error: (err) => this.mostrarMensaje('Error: ' + err.message, true)
    });
  }

  cancelarMeta() {
    this.metaEditando.set(null);
    this.mostrarFormMeta.set(false);
  }

  // ==================== BONOS ====================

  cargarBonos() {
    this.comisionesService.obtenerBonos().subscribe({
      next: (data) => this.bonos.set(data),
      error: (err) => this.mostrarMensaje('Error al cargar bonos: ' + err.message, true)
    });
  }

  cargarCamposDisponibles() {
    this.comisionesService.obtenerCamposDisponibles().subscribe({
      next: (data) => this.camposDisponibles.set(data),
      error: () => {}
    });
  }

  nuevoBono() {
    this.bonoEditando.set({
      nombre: '',
      descripcion: '',
      campoEvaluar: '',
      valorBuscar: '',
      activo: true,
      escalas: []
    });
    this.mostrarFormBono.set(true);
  }

  editarBono(bono: ComisionBono) {
    this.bonoEditando.set({
      ...bono,
      escalas: bono.escalas ? [...bono.escalas] : []
    });
    this.mostrarFormBono.set(true);
  }

  agregarEscala() {
    if (!this.bonoEditando()) return;
    const escalas = [...this.bonoEditando()!.escalas, { cantidadMinima: 0, monto: 0 }];
    this.bonoEditando.set({ ...this.bonoEditando()!, escalas });
  }

  eliminarEscala(index: number) {
    if (!this.bonoEditando()) return;
    const escalas = this.bonoEditando()!.escalas.filter((_, i) => i !== index);
    this.bonoEditando.set({ ...this.bonoEditando()!, escalas });
  }

  guardarBono() {
    if (!this.bonoEditando()) return;

    this.isLoading.set(true);
    this.comisionesService.guardarBono(this.bonoEditando()!).subscribe({
      next: () => {
        this.mostrarMensaje('Bono guardado correctamente', false);
        this.cargarBonos();
        this.cancelarBono();
      },
      error: (err) => this.mostrarMensaje('Error: ' + err.error?.message || err.message, true),
      complete: () => this.isLoading.set(false)
    });
  }

  eliminarBono(bono: ComisionBono) {
    if (!confirm('¿Eliminar este bono?')) return;

    this.comisionesService.eliminarBono(bono.id!).subscribe({
      next: () => {
        this.mostrarMensaje('Bono eliminado', false);
        this.cargarBonos();
      },
      error: (err) => this.mostrarMensaje('Error: ' + err.message, true)
    });
  }

  cancelarBono() {
    this.bonoEditando.set(null);
    this.mostrarFormBono.set(false);
  }

  // ==================== REPORTE ====================

  calcularComisiones() {
    this.isLoading.set(true);
    this.reporte.set(null);

    this.comisionesService.calcularComisiones(this.filtroAnio, this.filtroMes).subscribe({
      next: (data) => {
        this.reporte.set(data);
        if (data.agentes.length === 0) {
          this.mostrarMensaje('No hay datos para el período seleccionado', false);
        }
      },
      error: (err) => this.mostrarMensaje('Error al calcular: ' + err.message, true),
      complete: () => this.isLoading.set(false)
    });
  }

  toggleDetalleBonos(agente: ComisionAgente) {
    if (this.agenteExpandido() === agente.idAgente) {
      this.agenteExpandido.set(null);
    } else {
      this.agenteExpandido.set(agente.idAgente);
    }
  }

  // ==================== UTILIDADES ====================

  formatMonto(monto: number | undefined): string {
    if (monto === undefined || monto === null) return '0.00';
    return monto.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  mostrarMensaje(msg: string, error: boolean) {
    this.mensaje.set(msg);
    this.mensajeError.set(error);
    setTimeout(() => this.mensaje.set(''), 4000);
  }
}
