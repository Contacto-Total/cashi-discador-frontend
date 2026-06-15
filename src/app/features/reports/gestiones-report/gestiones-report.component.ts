import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { Subscription } from 'rxjs';
import {
  GestionesReportService,
  ReporteGestionesDTO,
  ResumenMetricas,
  AgenteGestion,
  TipificacionCatalogo,
  GestionesFiltros
} from './gestiones-report.service';
import { ComisionesService } from '../../../comisiones/services/comisiones.service';
import { Inquilino, Cartera, Subcartera } from '../../../comisiones/models/comision.model';

@Component({
  selector: 'app-gestiones-report',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, DecimalPipe, DatePipe],
  template: `
    <div class="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
          <lucide-angular name="clipboard-list" [size]="28" class="text-blue-500"></lucide-angular>
          Reporte de Gestiones
        </h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1">
          Historial completo de gestiones de cobranza con exportacion a Excel
        </p>
      </div>

      <!-- Filtros -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-6">
        <!-- Fila 1: fechas + jerarquia + asesor -->
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <!-- Fecha Desde -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha Desde *</label>
            <input type="date" [(ngModel)]="filtros.fechaDesde"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>

          <!-- Fecha Hasta -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha Hasta *</label>
            <input type="date" [(ngModel)]="filtros.fechaHasta"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>

          <!-- Proveedor -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Proveedor</label>
            <select [(ngModel)]="filtros.idProveedor" (ngModelChange)="onProveedorChange($event)"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option [ngValue]="null">Todos</option>
              @for (prov of proveedores(); track prov.id) {
                <option [ngValue]="prov.id">{{ prov.nombreInquilino }}</option>
              }
            </select>
          </div>

          <!-- Cartera -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cartera</label>
            <select [(ngModel)]="filtros.idCartera" (ngModelChange)="onCarteraChange($event)"
              [disabled]="!filtros.idProveedor"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     disabled:opacity-50 disabled:cursor-not-allowed">
              <option [ngValue]="null">Todas</option>
              @for (cart of carteras(); track cart.id) {
                <option [ngValue]="cart.id">{{ cart.nombreCartera }}</option>
              }
            </select>
          </div>

          <!-- Subcartera -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subcartera</label>
            <select [(ngModel)]="filtros.idSubcartera" (ngModelChange)="onSubcarteraChange()"
              [disabled]="!filtros.idCartera"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     disabled:opacity-50 disabled:cursor-not-allowed">
              <option [ngValue]="null">Todas</option>
              @for (sub of subcarteras(); track sub.id) {
                <option [ngValue]="sub.id">{{ sub.nombreSubcartera }}</option>
              }
            </select>
          </div>

          <!-- Asesor (multi-seleccion, amarrado al alcance) -->
          <div class="relative">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Asesor(es)</label>
            <button type="button" (click)="toggleAsesorList()"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-left
                     flex items-center justify-between gap-2
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <span class="truncate" [class.text-gray-400]="selectedAgentes().length === 0">
                {{ selectedAgentes().length === 0 ? 'Todos' : selectedAgentes().length + ' seleccionado(s)' }}
              </span>
              <lucide-angular name="chevron-down" [size]="16" class="text-gray-400 shrink-0"></lucide-angular>
            </button>

            @if (showAsesorList()) {
              <div class="fixed inset-0 z-20" (click)="showAsesorList.set(false)"></div>
              <div class="absolute z-30 mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-600
                          bg-white dark:bg-gray-700 shadow-lg">
                <div class="p-2 border-b border-gray-200 dark:border-gray-600">
                  <input type="text" [ngModel]="asesorBusqueda" (ngModelChange)="onAsesorInput($event)"
                    placeholder="Buscar asesor..." autocomplete="off"
                    class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                </div>
                <ul class="max-h-48 overflow-auto text-sm">
                  @for (ag of agentesFiltrados(); track ag.id) {
                    <li (click)="toggleAgente(ag.id)"
                      class="flex items-center gap-2 px-3 py-2 cursor-pointer
                             text-gray-800 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-blue-900/30">
                      <input type="checkbox" [checked]="isAgenteSel(ag.id)" class="pointer-events-none" />
                      <span class="truncate">{{ ag.nombre }}</span>
                    </li>
                  }
                  @if (agentesFiltrados().length === 0) {
                    <li class="px-3 py-2 text-gray-400 dark:text-gray-500">Sin asesores en este alcance</li>
                  }
                </ul>
              </div>
            }

            @if (selectedAgentes().length > 0) {
              <div class="flex flex-wrap gap-1 mt-1">
                @for (id of selectedAgentes(); track id) {
                  <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs
                               bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
                    {{ nombreAgente(id) }}
                    <button type="button" (click)="toggleAgente(id)" class="hover:text-blue-600 dark:hover:text-blue-200">
                      <lucide-angular name="x" [size]="12"></lucide-angular>
                    </button>
                  </span>
                }
              </div>
            }
          </div>
        </div>

        <!-- Fila 2: documento + celular + tipificacion en cascada -->
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-4">
          <!-- Documento -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">N° Documento</label>
            <input type="text" inputmode="numeric" maxlength="8"
              [ngModel]="filtros.documento" (ngModelChange)="onDocumentoInput($event)" placeholder="DNI (8 dígitos)"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>

          <!-- Celular -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">N° Celular</label>
            <input type="text" inputmode="numeric" maxlength="9"
              [ngModel]="filtros.celular" (ngModelChange)="onCelularInput($event)" placeholder="9 dígitos"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>

          <!-- Tipificacion Nivel 1 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipificación N1</label>
            <select [ngModel]="tipN1()" (ngModelChange)="onTipN1Change($event)"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option [ngValue]="null">Todas</option>
              @for (t of nivel1Opciones(); track t.id) {
                <option [ngValue]="t.id">{{ t.nombre }}</option>
              }
            </select>
          </div>

          <!-- Tipificacion Nivel 2 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipificación N2</label>
            <select [ngModel]="tipN2()" (ngModelChange)="onTipN2Change($event)" [disabled]="!tipN1()"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     disabled:opacity-50 disabled:cursor-not-allowed">
              <option [ngValue]="null">Todas</option>
              @for (t of nivel2Opciones(); track t.id) {
                <option [ngValue]="t.id">{{ t.nombre }}</option>
              }
            </select>
          </div>

          <!-- Tipificacion Nivel 3 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipificación N3</label>
            <select [ngModel]="tipN3()" (ngModelChange)="tipN3.set($event)" [disabled]="!tipN2()"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     disabled:opacity-50 disabled:cursor-not-allowed">
              <option [ngValue]="null">Todas</option>
              @for (t of nivel3Opciones(); track t.id) {
                <option [ngValue]="t.id">{{ t.nombre }}</option>
              }
            </select>
          </div>

          <!-- Tipo de gestion -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo de gestión</label>
            <select [(ngModel)]="filtros.gestionSistema"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="">Seleccione</option>
              <option value="EXCLUIR">Gestión Call</option>
              <option value="SOLO">Gestión Progresivo, Predictivo</option>
              <option value="EXTERNA">Gestión Externa</option>
            </select>
          </div>
        </div>

        <!-- Fila 3: acciones -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4">
          @if (!puedeConsultar) {
            <p class="text-sm text-amber-600 dark:text-amber-400">
              * Mínimo requerido para consultar: Fecha Desde, Fecha Hasta, Proveedor y Cartera
            </p>
          } @else {
            <span></span>
          }
          <div class="flex items-end gap-2">
            <button (click)="buscar()"
              [disabled]="loadingAction() !== null || !puedeConsultar"
              class="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold
                     rounded-lg transition-colors flex items-center justify-center gap-2
                     disabled:opacity-50 disabled:cursor-not-allowed">
              <lucide-angular name="search" [size]="18"></lucide-angular>
              Buscar
            </button>
            <button (click)="exportarExcel()"
              [disabled]="loadingAction() !== null || totalRecords() === 0"
              class="px-5 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold
                     rounded-lg transition-colors flex items-center gap-2
                     disabled:opacity-50 disabled:cursor-not-allowed">
              <lucide-angular name="download" [size]="18"></lucide-angular>
              Excel
            </button>
          </div>
        </div>
      </div>

      <!-- Metricas -->
      @if (metricas()) {
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
          <!-- Total Gestiones -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <lucide-angular name="clipboard-list" [size]="24" class="text-blue-600 dark:text-blue-400"></lucide-angular>
              </div>
              <div>
                <p class="text-2xl font-bold text-gray-800 dark:text-white">{{ metricas()!.totalGestiones }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Total Gestiones</p>
              </div>
            </div>
          </div>

          <!-- Completadas -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <lucide-angular name="check-circle" [size]="24" class="text-green-600 dark:text-green-400"></lucide-angular>
              </div>
              <div>
                <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ metricas()!.gestionesCompletadas }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Completadas</p>
              </div>
            </div>
          </div>

          <!-- Sin Contacto -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <lucide-angular name="phone-off" [size]="24" class="text-orange-600 dark:text-orange-400"></lucide-angular>
              </div>
              <div>
                <p class="text-2xl font-bold text-orange-600 dark:text-orange-400">{{ metricas()!.gestionesSinContacto }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Sin Contacto</p>
              </div>
            </div>
          </div>

          <!-- Anuladas -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <lucide-angular name="x-circle" [size]="24" class="text-red-600 dark:text-red-400"></lucide-angular>
              </div>
              <div>
                <p class="text-2xl font-bold text-red-600 dark:text-red-400">{{ metricas()!.gestionesAnuladas }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Anuladas</p>
              </div>
            </div>
          </div>

          <!-- Total Promesas -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <lucide-angular name="handshake" [size]="24" class="text-purple-600 dark:text-purple-400"></lucide-angular>
              </div>
              <div>
                <p class="text-2xl font-bold text-purple-600 dark:text-purple-400">{{ metricas()!.totalPromesas }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Total Promesas</p>
              </div>
            </div>
          </div>

          <!-- Promesas Pagadas -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                <lucide-angular name="badge-check" [size]="24" class="text-emerald-600 dark:text-emerald-400"></lucide-angular>
              </div>
              <div>
                <p class="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{{ metricas()!.promesasPagadas }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Promesas Pagadas</p>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- Tabla Preview -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">ID</th>
                <th class="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Fecha</th>
                <th class="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Documento</th>
                <th class="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Cliente</th>
                <th class="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Agente</th>
                <th class="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Cartera</th>
                <th class="px-3 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Estado</th>
                <th class="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Canal</th>
                <th class="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Tipificacion</th>
                <th class="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Variable PDP</th>
                <th class="px-3 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Monto Promesa</th>
                <th class="px-3 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Estado Pago</th>
                <th class="px-3 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Pagado</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              @if (loadingAction() === 'buscar') {
                <tr>
                  <td colspan="13" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    <lucide-angular name="loader-2" [size]="32" class="animate-spin mx-auto mb-2"></lucide-angular>
                    <p>Cargando datos...</p>
                  </td>
                </tr>
              } @else if (data().length === 0) {
                <tr>
                  <td colspan="13" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    <lucide-angular name="inbox" [size]="48" class="mx-auto mb-2 text-gray-400"></lucide-angular>
                    <p>No hay gestiones para mostrar</p>
                    <p class="text-xs mt-1">Ajusta los filtros y presiona "Buscar"</p>
                  </td>
                </tr>
              } @else {
                @for (item of data(); track item.id) {
                  <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td class="px-3 py-2 text-gray-900 dark:text-white font-medium">{{ item.id }}</td>
                    <td class="px-3 py-2 text-gray-600 dark:text-gray-400 text-xs">{{ item.fechaGestion | date:'dd/MM/yy' }}</td>
                    <td class="px-3 py-2 text-gray-900 dark:text-white font-mono text-xs">{{ item.documentoCliente }}</td>
                    <td class="px-3 py-2 text-gray-900 dark:text-white">{{ item.nombreCliente | slice:0:20 }}</td>
                    <td class="px-3 py-2 text-gray-600 dark:text-gray-400 text-xs">{{ item.nombreAgente | slice:0:15 }}</td>
                    <td class="px-3 py-2 text-gray-600 dark:text-gray-400 text-xs">{{ item.nombreCartera | slice:0:15 }}</td>
                    <td class="px-3 py-2 text-center">
                      <span [class]="getEstadoGestionClass(item.estadoGestion)">
                        {{ item.estadoGestion }}
                      </span>
                    </td>
                    <td class="px-3 py-2 text-gray-600 dark:text-gray-400 text-xs">{{ item.canalContacto }}</td>
                    <td class="px-3 py-2 text-gray-600 dark:text-gray-400 text-xs" [title]="item.rutaJerarquia">
                      {{ item.rutaNivel1 | slice:0:20 }}
                    </td>
                    <td class="px-3 py-2 text-gray-600 dark:text-gray-400 text-xs">{{ item.campoMontoOrigen || '-' }}</td>
                    <td class="px-3 py-2 text-right text-gray-900 dark:text-white">
                      @if (item.montoPromesa) {
                        S/ {{ item.montoPromesa | number:'1.2-2' }}
                      } @else {
                        -
                      }
                    </td>
                    <td class="px-3 py-2 text-center">
                      @if (item.estadoPago) {
                        <span [class]="getEstadoPagoClass(item.estadoPago)">
                          {{ item.estadoPago }}
                        </span>
                      } @else {
                        -
                      }
                    </td>
                    <td class="px-3 py-2 text-right text-green-600 dark:text-green-400">
                      @if (item.montoPagadoReal) {
                        S/ {{ item.montoPagadoReal | number:'1.2-2' }}
                      } @else {
                        -
                      }
                    </td>
                  </tr>
                }
              }
            </tbody>
          </table>
        </div>

        <!-- Footer: preview message -->
        @if (totalRecords() > 0) {
          <div class="px-4 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600
                      flex flex-col sm:flex-row items-center justify-between gap-3">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Vista previa de <span class="font-semibold">{{ data().length }}</span> de
              <span class="font-semibold">{{ totalRecords() | number }}</span> registros
            </p>
            <button
              (click)="exportarExcel()"
              [disabled]="loadingAction() !== null"
              class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold
                     rounded-lg transition-colors flex items-center gap-2
                     disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <lucide-angular name="download" [size]="18"></lucide-angular>
              Exportar todo a Excel ({{ totalRecords() | number }} registros)
            </button>
          </div>
        }
      </div>
    </div>

    <!-- Modal de carga (busqueda / exportacion) con cancelar -->
    @if (loadingAction()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-80 max-w-[90vw]
                    flex flex-col items-center gap-4">
          <div class="relative w-16 h-16 flex items-center justify-center">
            <div class="absolute inset-0 rounded-full border-4 border-blue-100 dark:border-gray-700
                        border-t-blue-500 dark:border-t-blue-400 animate-spin"></div>
            <lucide-angular [name]="loadingAction() === 'exportar' ? 'download' : 'search'" [size]="24"
              class="text-blue-600 dark:text-blue-400"></lucide-angular>
          </div>
          <p class="text-gray-700 dark:text-gray-200 font-medium">
            {{ loadingAction() === 'exportar' ? 'Exportando a Excel...' : 'Buscando gestiones...' }}
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-400 text-center">
            {{ loadingAction() === 'exportar' ? 'La descarga puede tardar según el volumen.' : 'Aplicando filtros.' }}
          </p>
          <button (click)="cancelarOperacion()"
            class="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600
                   text-gray-800 dark:text-gray-100 rounded-lg text-sm font-medium flex items-center gap-2">
            <lucide-angular name="x" [size]="16"></lucide-angular>
            Cancelar
          </button>
        </div>
      </div>
    }
  `,
  styles: []
})
export class GestionesReportComponent implements OnInit {
  data = signal<ReporteGestionesDTO[]>([]);
  metricas = signal<ResumenMetricas | null>(null);
  totalRecords = signal(0);

  previewSize = 4;

  // Estado de carga: null | 'buscar' | 'exportar' (controla el modal y los botones)
  loadingAction = signal<'buscar' | 'exportar' | null>(null);
  private currentSub?: Subscription;

  // Dropdown data
  proveedores = signal<Inquilino[]>([]);
  carteras = signal<Cartera[]>([]);
  subcarteras = signal<Subcartera[]>([]);

  // Asesor (multi-seleccion, amarrado al alcance)
  private agentes: AgenteGestion[] = [];
  agentesFiltrados = signal<AgenteGestion[]>([]);
  asesorBusqueda = '';
  showAsesorList = signal(false);
  selectedAgentes = signal<number[]>([]);

  // Tipificacion (cascada N1 -> N2 -> N3)
  private tipificaciones: TipificacionCatalogo[] = [];
  tipN1 = signal<number | null>(null);
  tipN2 = signal<number | null>(null);
  tipN3 = signal<number | null>(null);
  nivel1Opciones = signal<TipificacionCatalogo[]>([]);
  nivel2Opciones = signal<TipificacionCatalogo[]>([]);
  nivel3Opciones = signal<TipificacionCatalogo[]>([]);

  filtros = {
    fechaDesde: '',
    fechaHasta: '',
    idProveedor: null as number | null,
    idCartera: null as number | null,
    idSubcartera: null as number | null,
    documento: '',
    celular: '',
    gestionSistema: '' as '' | 'EXCLUIR' | 'SOLO' | 'EXTERNA'
  };

  constructor(
    private reporteService: GestionesReportService,
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

    this.reporteService.getTipificaciones().subscribe({
      next: (data) => {
        this.tipificaciones = data;
        this.nivel1Opciones.set(data.filter(t => t.nivel === 1));
      },
      error: (err) => console.error('Error cargando tipificaciones:', err)
    });

    this.reloadAgentes();
  }

  // ===== Cascada proveedor/cartera/subcartera (+ recarga de asesores) =====
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
    this.reloadAgentes();
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
    this.reloadAgentes();
  }

  onSubcarteraChange(): void {
    this.reloadAgentes();
  }

  // ===== Asesor multi-seleccion =====
  private reloadAgentes(): void {
    this.reporteService.getAgentes(this.filtros.idProveedor, this.filtros.idCartera, this.filtros.idSubcartera).subscribe({
      next: (data) => {
        this.agentes = data;
        this.filtrarAgentes(this.asesorBusqueda);
        // Podar asesores seleccionados que ya no existen en el nuevo alcance
        const validos = new Set(data.map(a => a.id));
        const podados = this.selectedAgentes().filter(id => validos.has(id));
        if (podados.length !== this.selectedAgentes().length) {
          this.selectedAgentes.set(podados);
        }
      },
      error: (err) => console.error('Error cargando asesores:', err)
    });
  }

  toggleAsesorList(): void {
    const abrir = !this.showAsesorList();
    this.showAsesorList.set(abrir);
    if (abrir) {
      this.asesorBusqueda = '';
      this.filtrarAgentes('');
    }
  }

  private filtrarAgentes(texto: string): void {
    const q = (texto || '').trim().toLowerCase();
    const base = q ? this.agentes.filter(a => a.nombre.toLowerCase().includes(q)) : this.agentes;
    this.agentesFiltrados.set(base.slice(0, 100));
  }

  onAsesorInput(texto: string): void {
    this.asesorBusqueda = texto;
    this.filtrarAgentes(texto);
    this.showAsesorList.set(true);
  }

  toggleAgente(id: number): void {
    const cur = this.selectedAgentes();
    this.selectedAgentes.set(cur.includes(id) ? cur.filter(x => x !== id) : [...cur, id]);
  }

  isAgenteSel(id: number): boolean {
    return this.selectedAgentes().includes(id);
  }

  nombreAgente(id: number): string {
    return this.agentes.find(a => a.id === id)?.nombre ?? '';
  }

  // ===== Tipificacion en cascada =====
  onTipN1Change(value: number | null): void {
    this.tipN1.set(value);
    this.tipN2.set(null);
    this.tipN3.set(null);
    this.nivel2Opciones.set(value ? this.tipificaciones.filter(t => t.nivel === 2 && t.parentId === value) : []);
    this.nivel3Opciones.set([]);
  }

  onTipN2Change(value: number | null): void {
    this.tipN2.set(value);
    this.tipN3.set(null);
    this.nivel3Opciones.set(value ? this.tipificaciones.filter(t => t.nivel === 3 && t.parentId === value) : []);
  }

  private nombreTip(id: number | null): string | null {
    if (!id) return null;
    return this.tipificaciones.find(t => t.id === id)?.nombre ?? null;
  }

  // ===== Documento / Celular: solo digitos =====
  onDocumentoInput(valor: string): void {
    this.filtros.documento = (valor || '').replace(/\D/g, '').slice(0, 8);
  }

  onCelularInput(valor: string): void {
    this.filtros.celular = (valor || '').replace(/\D/g, '').slice(0, 9);
  }

  // ===== Busqueda / Exportacion =====
  private buildFiltros(): GestionesFiltros {
    return {
      fechaDesde: this.filtros.fechaDesde,
      fechaHasta: this.filtros.fechaHasta,
      idCartera: this.filtros.idCartera,
      idSubcartera: this.filtros.idSubcartera,
      idAgentes: this.selectedAgentes(),
      documento: this.filtros.documento,
      telefono: this.filtros.celular,
      rutaNivel1: this.nombreTip(this.tipN1()),
      rutaNivel2: this.nombreTip(this.tipN2()),
      rutaNivel3: this.nombreTip(this.tipN3()),
      gestionSistema: this.filtros.gestionSistema || null
    };
  }

  /** Mínimo requerido para consultar: fechas + proveedor + cartera. */
  get puedeConsultar(): boolean {
    return !!this.filtros.fechaDesde && !!this.filtros.fechaHasta
        && !!this.filtros.idProveedor && !!this.filtros.idCartera;
  }

  buscar(): void {
    if (!this.puedeConsultar) {
      alert('Debe seleccionar como mínimo: Fecha Desde, Fecha Hasta, Proveedor y Cartera');
      return;
    }
    this.loadingAction.set('buscar');
    this.currentSub = this.reporteService.getReporte(this.buildFiltros(), 0, this.previewSize).subscribe({
      next: (response) => {
        this.data.set(response.data);
        this.metricas.set(response.metricas);
        this.totalRecords.set(response.total);
        this.finalizar();
      },
      error: (error) => {
        console.error('Error cargando reporte:', error);
        this.finalizar();
        alert('Error al cargar el reporte de gestiones');
      }
    });
  }

  exportarExcel(): void {
    if (!this.puedeConsultar) {
      alert('Debe seleccionar como mínimo: Fecha Desde, Fecha Hasta, Proveedor y Cartera');
      return;
    }
    this.loadingAction.set('exportar');
    this.currentSub = this.reporteService.exportarExcel(this.buildFiltros()).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Reporte_Gestiones_${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        this.finalizar();
      },
      error: (error) => {
        console.error('Error exportando Excel:', error);
        this.finalizar();
        alert('Error al exportar el reporte a Excel');
      }
    });
  }

  cancelarOperacion(): void {
    this.currentSub?.unsubscribe();
    this.finalizar();
  }

  private finalizar(): void {
    this.loadingAction.set(null);
    this.currentSub = undefined;
  }

  getEstadoGestionClass(estado: string): string {
    const base = 'px-2 py-1 rounded-full text-xs font-semibold';
    switch (estado) {
      case 'COMPLETADA':
        return `${base} bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400`;
      case 'SIN_CONTACTO':
        return `${base} bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400`;
      case 'NO_GESTIONADA':
        return `${base} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400`;
      case 'ANULADA':
        return `${base} bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400`;
      default:
        return `${base} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400`;
    }
  }

  getEstadoPagoClass(estado: string): string {
    const base = 'px-2 py-1 rounded-full text-xs font-semibold';
    switch (estado) {
      case 'PAGADA':
        return `${base} bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400`;
      case 'PENDIENTE':
      case 'PARCIAL':
        return `${base} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400`;
      case 'VENCIDA':
        return `${base} bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400`;
      case 'EN_EVALUACION':
        return `${base} bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400`;
      case 'CANCELADA':
        return `${base} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400`;
      default:
        return `${base} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400`;
    }
  }
}
