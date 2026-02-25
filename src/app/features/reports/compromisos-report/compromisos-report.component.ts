import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import {
  ReporteGestionesDTO,
  ResumenMetricas,
  ReporteResponse
} from '../gestiones-report/gestiones-report.service';
import { CompromisosReportService, AgenteCompromiso } from './compromisos-report.service';
import { ComisionesService } from '../../../comisiones/services/comisiones.service';
import { Inquilino, Cartera, Subcartera } from '../../../comisiones/models/comision.model';

@Component({
  selector: 'app-compromisos-report',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, DecimalPipe, DatePipe],
  template: `
    <div class="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
          <lucide-angular name="handshake" [size]="28" class="text-purple-500"></lucide-angular>
          Reporte de Compromisos
        </h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1">
          Compromisos de pago registrados con detalle de cuotas y estados
        </p>
      </div>

      <!-- Filtros Fila 1 -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-4">
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <!-- Fecha Desde -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha Desde *</label>
            <input type="date" [(ngModel)]="filtros.fechaDesde"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-purple-500 focus:border-purple-500" />
          </div>

          <!-- Fecha Hasta -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha Hasta *</label>
            <input type="date" [(ngModel)]="filtros.fechaHasta"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-purple-500 focus:border-purple-500" />
          </div>

          <!-- Proveedor -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Proveedor</label>
            <select [(ngModel)]="filtros.idProveedor" (ngModelChange)="onProveedorChange($event)"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
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
                     focus:ring-2 focus:ring-purple-500 focus:border-purple-500
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
                     focus:ring-2 focus:ring-purple-500 focus:border-purple-500
                     disabled:opacity-50 disabled:cursor-not-allowed">
              <option [ngValue]="null">Todas</option>
              @for (sub of subcarteras(); track sub.id) {
                <option [ngValue]="sub.id">{{ sub.nombreSubcartera }}</option>
              }
            </select>
          </div>

          <!-- Asesor -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Asesor</label>
            <select [(ngModel)]="filtros.idAgente"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
              <option [ngValue]="null">Todos</option>
              @for (ag of agentes(); track ag.id) {
                <option [ngValue]="ag.id">{{ ag.nombre }}</option>
              }
            </select>
          </div>
        </div>

        <!-- Filtros Fila 2 -->
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-4">
          <!-- Tipo Compromiso -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo Compromiso</label>
            <select [(ngModel)]="filtros.rutaNivel2"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
              <option value="">Todos</option>
              @for (tipo of tiposCompromiso(); track tipo) {
                <option [value]="tipo">{{ tipo }}</option>
              }
            </select>
          </div>

          <!-- Estado Compromiso -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Estado Compromiso</label>
            <select [(ngModel)]="filtros.estadoPago"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
              <option value="">Todos</option>
              @for (est of estadosCompromiso(); track est) {
                <option [value]="est">{{ est }}</option>
              }
            </select>
          </div>

          <!-- Documento -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">N° Documento</label>
            <input type="text" [(ngModel)]="filtros.documento" placeholder="Ej: 12345678"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-purple-500 focus:border-purple-500" />
          </div>

          <!-- Nombre -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre</label>
            <input type="text" [(ngModel)]="filtros.nombre" placeholder="Buscar por nombre..."
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-purple-500 focus:border-purple-500" />
          </div>

          <!-- Botones -->
          <div class="flex items-end gap-2 lg:col-span-2">
            <button (click)="buscar()"
              [disabled]="loading() || !filtros.fechaDesde || !filtros.fechaHasta"
              class="flex-1 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white font-semibold
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
              class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold
                     rounded-lg transition-colors flex items-center gap-2
                     disabled:opacity-50 disabled:cursor-not-allowed">
              <lucide-angular name="download" [size]="18"></lucide-angular>
              Excel
            </button>
          </div>
        </div>

        @if (!filtros.fechaDesde || !filtros.fechaHasta) {
          <p class="mt-2 text-sm text-amber-600 dark:text-amber-400">
            * Las fechas son obligatorias para evitar consultas muy grandes
          </p>
        }
      </div>

      <!-- Metricas -->
      @if (metricas()) {
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <lucide-angular name="handshake" [size]="24" class="text-purple-600 dark:text-purple-400"></lucide-angular>
              </div>
              <div>
                <p class="text-2xl font-bold text-purple-600 dark:text-purple-400">{{ metricas()!.totalPromesas }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Total Compromisos</p>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <lucide-angular name="badge-check" [size]="24" class="text-green-600 dark:text-green-400"></lucide-angular>
              </div>
              <div>
                <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ metricas()!.promesasPagadas }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Pagadas</p>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <lucide-angular name="clock" [size]="24" class="text-yellow-600 dark:text-yellow-400"></lucide-angular>
              </div>
              <div>
                <p class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{{ metricas()!.promesasPendientes }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Pendientes</p>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <lucide-angular name="alert-triangle" [size]="24" class="text-red-600 dark:text-red-400"></lucide-angular>
              </div>
              <div>
                <p class="text-2xl font-bold text-red-600 dark:text-red-400">{{ metricas()!.promesasVencidas }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Vencidas</p>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <lucide-angular name="clipboard-list" [size]="24" class="text-blue-600 dark:text-blue-400"></lucide-angular>
              </div>
              <div>
                <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ metricas()!.gestionesCompletadas }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Gestiones</p>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <lucide-angular name="x-circle" [size]="24" class="text-gray-600 dark:text-gray-400"></lucide-angular>
              </div>
              <div>
                <p class="text-2xl font-bold text-gray-600 dark:text-gray-400">{{ metricas()!.gestionesAnuladas }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Anuladas</p>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div class="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-md p-4 text-white">
            <p class="text-xs text-purple-100 uppercase">Monto Total Promesas</p>
            <p class="text-xl font-bold">S/ {{ metricas()!.montoTotalPromesas | number:'1.2-2' }}</p>
          </div>
          <div class="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-md p-4 text-white">
            <p class="text-xs text-green-100 uppercase">Monto Pagado</p>
            <p class="text-xl font-bold">S/ {{ metricas()!.montoTotalPagado | number:'1.2-2' }}</p>
          </div>
          <div class="bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-md p-4 text-white">
            <p class="text-xs text-red-100 uppercase">Monto Pendiente</p>
            <p class="text-xl font-bold">S/ {{ metricas()!.montoTotalPendiente | number:'1.2-2' }}</p>
          </div>
        </div>
      }

      <!-- Tabla -->
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
                <th class="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Telefono</th>
                <th class="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Tipo</th>
                <th class="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Variable PDP</th>
                <th class="px-3 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Monto Promesa</th>
                <th class="px-3 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Cuotas</th>
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
                    <p>No hay compromisos para mostrar</p>
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
                    <td class="px-3 py-2 text-gray-600 dark:text-gray-400 text-xs font-mono">{{ item.telefonoContacto || '-' }}</td>
                    <td class="px-3 py-2 text-gray-600 dark:text-gray-400 text-xs">{{ item.rutaNivel2 || '-' }}</td>
                    <td class="px-3 py-2 text-gray-600 dark:text-gray-400 text-xs">{{ item.campoMontoOrigen || '-' }}</td>
                    <td class="px-3 py-2 text-right text-gray-900 dark:text-white">
                      @if (item.montoPromesa) {
                        S/ {{ item.montoPromesa | number:'1.2-2' }}
                      } @else { - }
                    </td>
                    <td class="px-3 py-2 text-center text-gray-900 dark:text-white">{{ item.totalCuotas || '-' }}</td>
                    <td class="px-3 py-2 text-center">
                      @if (item.estadoPago) {
                        <span [class]="getEstadoPagoClass(item.estadoPago)">{{ item.estadoPago }}</span>
                      } @else { - }
                    </td>
                    <td class="px-3 py-2 text-right text-green-600 dark:text-green-400">
                      @if (item.montoPagadoReal) {
                        S/ {{ item.montoPagadoReal | number:'1.2-2' }}
                      } @else { - }
                    </td>
                  </tr>
                }
              }
            </tbody>
          </table>
        </div>

        <!-- Paginacion -->
        @if (totalRecords() > 0) {
          <div class="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600
                      flex flex-col sm:flex-row items-center justify-between gap-3">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Mostrando <span class="font-semibold">{{ currentPage() * pageSize + 1 }}</span>
              - <span class="font-semibold">{{ Math.min((currentPage() + 1) * pageSize, totalRecords()) }}</span>
              de <span class="font-semibold">{{ totalRecords() }}</span> registros
            </p>
            <div class="flex items-center gap-1">
              <button (click)="goToPage(0)" [disabled]="currentPage() === 0 || loading()"
                class="px-2 py-1 text-sm rounded border border-gray-300 dark:border-gray-600
                       hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed
                       text-gray-700 dark:text-gray-300">&laquo;</button>
              <button (click)="goToPage(currentPage() - 1)" [disabled]="currentPage() === 0 || loading()"
                class="px-2 py-1 text-sm rounded border border-gray-300 dark:border-gray-600
                       hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed
                       text-gray-700 dark:text-gray-300">&lsaquo;</button>
              @for (p of getVisiblePages(); track p) {
                <button (click)="goToPage(p)" [disabled]="loading()"
                  [class]="p === currentPage()
                    ? 'px-3 py-1 text-sm rounded border font-bold bg-purple-500 text-white border-purple-500'
                    : 'px-3 py-1 text-sm rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'">
                  {{ p + 1 }}
                </button>
              }
              <button (click)="goToPage(currentPage() + 1)" [disabled]="currentPage() >= totalPages() - 1 || loading()"
                class="px-2 py-1 text-sm rounded border border-gray-300 dark:border-gray-600
                       hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed
                       text-gray-700 dark:text-gray-300">&rsaquo;</button>
              <button (click)="goToPage(totalPages() - 1)" [disabled]="currentPage() >= totalPages() - 1 || loading()"
                class="px-2 py-1 text-sm rounded border border-gray-300 dark:border-gray-600
                       hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed
                       text-gray-700 dark:text-gray-300">&raquo;</button>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: []
})
export class CompromisosReportComponent implements OnInit {
  loading = signal(false);
  data = signal<ReporteGestionesDTO[]>([]);
  metricas = signal<ResumenMetricas | null>(null);

  currentPage = signal(0);
  pageSize = 50;
  totalRecords = signal(0);
  totalPages = signal(0);

  Math = Math;

  // Dropdown data
  proveedores = signal<Inquilino[]>([]);
  carteras = signal<Cartera[]>([]);
  subcarteras = signal<Subcartera[]>([]);
  tiposCompromiso = signal<string[]>([]);
  estadosCompromiso = signal<string[]>([]);
  agentes = signal<AgenteCompromiso[]>([]);

  filtros = {
    fechaDesde: '',
    fechaHasta: '',
    idProveedor: null as number | null,
    idCartera: null as number | null,
    idSubcartera: null as number | null,
    idAgente: null as number | null,
    estadoPago: '',
    rutaNivel2: '',
    documento: '',
    nombre: ''
  };

  constructor(
    private compromisosService: CompromisosReportService,
    private comisionesService: ComisionesService
  ) {}

  ngOnInit(): void {
    const today = new Date();
    this.filtros.fechaDesde = today.toISOString().split('T')[0];
    this.filtros.fechaHasta = today.toISOString().split('T')[0];

    // Cargar dropdowns en paralelo
    this.comisionesService.obtenerInquilinos().subscribe({
      next: (data) => this.proveedores.set(data),
      error: (err) => console.error('Error cargando proveedores:', err)
    });

    this.compromisosService.getTiposCompromiso().subscribe({
      next: (data) => this.tiposCompromiso.set(data),
      error: (err) => console.error('Error cargando tipos:', err)
    });

    this.compromisosService.getEstadosCompromiso().subscribe({
      next: (data) => this.estadosCompromiso.set(data),
      error: (err) => console.error('Error cargando estados:', err)
    });

    this.compromisosService.getAgentesCompromiso().subscribe({
      next: (data) => this.agentes.set(data),
      error: (err) => console.error('Error cargando agentes:', err)
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
    if (!this.filtros.fechaDesde || !this.filtros.fechaHasta) {
      alert('Las fechas son obligatorias');
      return;
    }
    this.currentPage.set(0);
    this.loadPage(0);
  }

  goToPage(page: number): void {
    if (page < 0 || page >= this.totalPages()) return;
    this.loadPage(page);
  }

  private loadPage(page: number): void {
    this.loading.set(true);

    this.compromisosService.getReporte(
      this.filtros.fechaDesde,
      this.filtros.fechaHasta,
      this.filtros.idCartera || undefined,
      this.filtros.idSubcartera || undefined,
      this.filtros.idAgente || undefined,
      this.filtros.estadoPago || undefined,
      this.filtros.rutaNivel2 || undefined,
      this.filtros.documento || undefined,
      this.filtros.nombre || undefined,
      page,
      this.pageSize
    ).subscribe({
      next: (response) => {
        this.data.set(response.data);
        this.metricas.set(response.metricas);
        this.totalRecords.set(response.total);
        this.totalPages.set(response.totalPages);
        this.currentPage.set(response.page);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error cargando reporte:', error);
        this.loading.set(false);
        alert('Error al cargar el reporte de compromisos');
      }
    });
  }

  getVisiblePages(): number[] {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: number[] = [];
    const start = Math.max(0, current - 2);
    const end = Math.min(total - 1, current + 2);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  exportarExcel(): void {
    if (!this.filtros.fechaDesde || !this.filtros.fechaHasta) {
      alert('Las fechas son obligatorias');
      return;
    }

    this.loading.set(true);

    this.compromisosService.exportarExcel(
      this.filtros.fechaDesde,
      this.filtros.fechaHasta,
      this.filtros.idCartera || undefined,
      this.filtros.idSubcartera || undefined,
      this.filtros.idAgente || undefined,
      this.filtros.estadoPago || undefined,
      this.filtros.rutaNivel2 || undefined,
      this.filtros.documento || undefined,
      this.filtros.nombre || undefined
    ).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Reporte_Compromisos_${new Date().toISOString().split('T')[0]}.xlsx`;
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
