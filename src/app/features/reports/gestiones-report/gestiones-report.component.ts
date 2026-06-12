import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import {
  GestionesReportService,
  ReporteGestionesDTO,
  ResumenMetricas,
  ReporteResponse,
  AgenteGestion,
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
            <select [(ngModel)]="filtros.idSubcartera" [disabled]="!filtros.idCartera"
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

          <!-- Asesor (autocomplete) -->
          <div class="relative">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Asesor</label>
            <div class="relative">
              <input type="text" [(ngModel)]="asesorBusqueda"
                (ngModelChange)="onAsesorInput($event)"
                (focus)="showAsesorList.set(true)"
                (blur)="showAsesorList.set(false)"
                placeholder="Todos"
                autocomplete="off"
                class="w-full px-3 py-2 pr-8 border border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              @if (filtros.idAgente) {
                <button type="button" (mousedown)="clearAsesor()"
                  class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                  <lucide-angular name="x" [size]="16"></lucide-angular>
                </button>
              }
            </div>
            @if (showAsesorList() && agentesFiltrados().length > 0) {
              <ul class="absolute z-30 mt-1 w-full max-h-56 overflow-auto rounded-lg border border-gray-200
                         dark:border-gray-600 bg-white dark:bg-gray-700 shadow-lg text-sm">
                @for (ag of agentesFiltrados(); track ag.id) {
                  <li (mousedown)="selectAsesor(ag)"
                    class="px-3 py-2 cursor-pointer text-gray-800 dark:text-gray-100
                           hover:bg-blue-50 dark:hover:bg-blue-900/30">
                    {{ ag.nombre }}
                  </li>
                }
              </ul>
            }
          </div>
        </div>

        <!-- Fila 2: documento + celular + estado de gestion -->
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-4">
          <!-- Documento -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">N° Documento</label>
            <input type="text" inputmode="numeric" [(ngModel)]="filtros.documento" placeholder="Ej: 12345678"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>

          <!-- Celular -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">N° Celular</label>
            <input type="text" inputmode="numeric" [(ngModel)]="filtros.celular" placeholder="Ej: 987654321"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>

          <!-- Estado de gestion (chips multi-seleccion) -->
          <div class="lg:col-span-4">
            <div class="flex items-center justify-between mb-1">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Estado de gestión</label>
              @if (estadosSeleccionados().length > 0) {
                <button type="button" (click)="estadosSeleccionados.set([])"
                  class="text-xs text-blue-600 dark:text-blue-400 hover:underline">Limpiar</button>
              }
            </div>
            <div class="flex flex-wrap gap-2">
              @for (e of estadosDisponibles; track e.value) {
                <button type="button" (click)="toggleEstado(e.value)" [class]="chipClass(e.value)">
                  <span class="w-2 h-2 rounded-full"
                    [class]="isEstadoActivo(e.value) ? 'bg-white' : e.dot"></span>
                  {{ e.label }}
                </button>
              }
              <span class="text-xs text-gray-400 dark:text-gray-500 self-center ml-1">
                {{ estadosSeleccionados().length === 0 ? '(ninguno = todos)' : '' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Fila 3: acciones -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4">
          @if (!filtros.fechaDesde || !filtros.fechaHasta) {
            <p class="text-sm text-amber-600 dark:text-amber-400">
              * Las fechas son obligatorias para evitar consultas muy grandes
            </p>
          } @else {
            <span></span>
          }
          <div class="flex items-end gap-2">
            <button (click)="buscar()"
              [disabled]="loading() || !filtros.fechaDesde || !filtros.fechaHasta"
              class="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold
                     rounded-lg transition-colors flex items-center justify-center gap-2
                     disabled:opacity-50 disabled:cursor-not-allowed">
              @if (loading()) {
                <lucide-angular name="loader-2" [size]="18" class="animate-spin"></lucide-angular>
              } @else {
                <lucide-angular name="search" [size]="18"></lucide-angular>
              }
              Buscar
            </button>
            <button (click)="exportarExcel()"
              [disabled]="loading() || data().length === 0"
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
              @if (loading()) {
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
                    <p class="text-xs mt-1">Selecciona las fechas y presiona "Buscar"</p>
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
              [disabled]="loading()"
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
  `,
  styles: []
})
export class GestionesReportComponent implements OnInit {
  loading = signal(false);
  data = signal<ReporteGestionesDTO[]>([]);
  metricas = signal<ResumenMetricas | null>(null);
  totalRecords = signal(0);

  previewSize = 4;

  // Dropdown data
  proveedores = signal<Inquilino[]>([]);
  carteras = signal<Cartera[]>([]);
  subcarteras = signal<Subcartera[]>([]);

  // Asesor (autocomplete)
  private agentes: AgenteGestion[] = [];
  agentesFiltrados = signal<AgenteGestion[]>([]);
  asesorBusqueda = '';
  showAsesorList = signal(false);

  // Estado de gestion (chips multi-seleccion)
  estadosDisponibles = [
    { value: 'COMPLETADA',    label: 'Completada',    dot: 'bg-green-500',  active: 'bg-green-500 border-green-500 text-white' },
    { value: 'SIN_CONTACTO',  label: 'Sin Contacto',  dot: 'bg-orange-500', active: 'bg-orange-500 border-orange-500 text-white' },
    { value: 'NO_GESTIONADA', label: 'No Gestionada', dot: 'bg-yellow-500', active: 'bg-yellow-500 border-yellow-500 text-white' },
    { value: 'ANULADA',       label: 'Anulada',       dot: 'bg-red-500',    active: 'bg-red-500 border-red-500 text-white' }
  ];
  estadosSeleccionados = signal<string[]>([]);

  filtros = {
    fechaDesde: '',
    fechaHasta: '',
    idProveedor: null as number | null,
    idCartera: null as number | null,
    idSubcartera: null as number | null,
    idAgente: null as number | null,
    documento: '',
    celular: ''
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

    this.reporteService.getAgentes().subscribe({
      next: (data) => { this.agentes = data; this.agentesFiltrados.set(data.slice(0, 50)); },
      error: (err) => console.error('Error cargando asesores:', err)
    });
  }

  // ===== Asesor autocomplete =====
  onAsesorInput(texto: string): void {
    this.showAsesorList.set(true);
    const q = (texto || '').trim().toLowerCase();
    // Si el usuario edita el texto, se invalida la seleccion previa
    this.filtros.idAgente = null;
    const base = q
      ? this.agentes.filter(a => a.nombre.toLowerCase().includes(q))
      : this.agentes;
    this.agentesFiltrados.set(base.slice(0, 50));
  }

  selectAsesor(ag: AgenteGestion): void {
    this.filtros.idAgente = ag.id;
    this.asesorBusqueda = ag.nombre;
    this.showAsesorList.set(false);
  }

  clearAsesor(): void {
    this.filtros.idAgente = null;
    this.asesorBusqueda = '';
    this.agentesFiltrados.set(this.agentes.slice(0, 50));
    this.showAsesorList.set(false);
  }

  // ===== Estado de gestion chips =====
  toggleEstado(value: string): void {
    const actuales = this.estadosSeleccionados();
    this.estadosSeleccionados.set(
      actuales.includes(value) ? actuales.filter(v => v !== value) : [...actuales, value]
    );
  }

  isEstadoActivo(value: string): boolean {
    return this.estadosSeleccionados().includes(value);
  }

  chipClass(value: string): string {
    const base = 'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors cursor-pointer';
    const est = this.estadosDisponibles.find(e => e.value === value);
    if (this.isEstadoActivo(value)) {
      return `${base} ${est?.active ?? ''}`;
    }
    return `${base} bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600`;
  }

  /** Construye el objeto de filtros para el service */
  private buildFiltros(): GestionesFiltros {
    return {
      fechaDesde: this.filtros.fechaDesde,
      fechaHasta: this.filtros.fechaHasta,
      idCartera: this.filtros.idCartera,
      idSubcartera: this.filtros.idSubcartera,
      idAgente: this.filtros.idAgente,
      documento: this.filtros.documento,
      telefono: this.filtros.celular,
      estadosGestion: this.estadosSeleccionados()
    };
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
    if (!this.filtros.fechaDesde || !this.filtros.fechaHasta) {
      alert('Las fechas son obligatorias');
      return;
    }
    this.loadPreview();
  }

  private loadPreview(): void {
    this.loading.set(true);

    this.reporteService.getReporte(this.buildFiltros(), 0, this.previewSize).subscribe({
      next: (response) => {
        this.data.set(response.data);
        this.metricas.set(response.metricas);
        this.totalRecords.set(response.total);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error cargando reporte:', error);
        this.loading.set(false);
        alert('Error al cargar el reporte de gestiones');
      }
    });
  }

  exportarExcel(): void {
    if (!this.filtros.fechaDesde || !this.filtros.fechaHasta) {
      alert('Las fechas son obligatorias');
      return;
    }

    this.loading.set(true);

    this.reporteService.exportarExcel(this.buildFiltros()).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Reporte_Gestiones_${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error exportando Excel:', error);
        this.loading.set(false);
        alert('Error al exportar el reporte a Excel');
      }
    });
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
