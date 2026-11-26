import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import {
  ContinuidadReportService,
  ReporteContinuidadDTO,
  ResumenMetricas,
  ReporteResponse
} from './continuidad-report.service';
import { Cartera, Inquilino, Subcartera } from '@/comisiones/models/comision.model';
import {
  ComprasCarteraService,
  leerOpcionCompra,
  opcionesSubcartera
} from '@/core/services/compras-cartera.service';
import { ComisionesService } from '@/comisiones/services/comisiones.service';
import { AppDatePipe, AppNumberPipe } from '@/shared/pipes/format.pipes';
import { forkJoin } from 'rxjs';
import {
  CargandoComprasComponent, DesgloseCompraComponent, EtiquetaCompraComponent, ValorCompra, VerCompraComponent, formatoCompra
} from '@/shared/ui/desglose-compra.component';

@Component({
  selector: 'app-continuidad-report',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, AppDatePipe, AppNumberPipe,
    VerCompraComponent, DesgloseCompraComponent, EtiquetaCompraComponent, CargandoComprasComponent],
  template: `
    <div class="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
          <lucide-angular name="refresh-cw" [size]="28" class="text-amber-500"></lucide-angular>
          Reporte de Continuidad de Promesas
        </h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1">
          Seguimiento de promesas de continuidad y su estado de recuperación
        </p>
      </div>

      <!-- Filtros -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
          <!-- Fecha Desde -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Fecha Desde
            </label>
            <input
              type="date"
              [(ngModel)]="filtros.fechaDesde"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>

          <!-- Fecha Hasta -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Fecha Hasta
            </label>
            <input
              type="date"
              [(ngModel)]="filtros.fechaHasta"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
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
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500
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
              [(ngModel)]="seleccionSubcartera"
              (ngModelChange)="onSubcarteraChange($event)"
              [disabled]="!filtros.idCartera"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Todas</option>
              @for (op of opcionesSubcartera(); track op.valor) {
                <option [value]="op.valor">{{ op.etiqueta }}</option>
              }
            </select>
          </div>

          <!-- Botones -->
          <div class="flex items-end gap-2">
            <button
              (click)="buscar()"
              [disabled]="loading()"
              class="flex-1 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold
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
              [disabled]="loading() || data().length === 0"
              class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold
                     rounded-lg transition-colors flex items-center gap-2
                     disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <lucide-angular name="download" [size]="18"></lucide-angular>
              Excel
            </button>
          </div>
        </div>
      </div>

      @if (hayDesglose()) {
        <div class="mb-3">
          <app-ver-compra [porCompra]="verPorCompra()" (porCompraChange)="cambiarVista($event)" [cargando]="cargandoCompras()" />
        </div>
      }

      <div class="relative">
      @if (cargandoCompras()) { <app-cargando-compras [compras]="comprasDesglose()" /> }
      <!-- Métricas -->
      @if (metricas()) {
        <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6 [&>*]:min-w-0">
          <!-- Total Continuidades -->
          <div class="@container bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
            <div class="flex flex-col items-start gap-2 @min-[13rem]:flex-row @min-[13rem]:items-center @min-[13rem]:gap-3">
              <div class="shrink-0 p-1.5 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                <lucide-angular name="refresh-cw" [size]="18" class="text-amber-600 dark:text-amber-400"></lucide-angular>
              </div>
              <div class="min-w-0">
                <p class="text-2xl font-bold leading-tight tabular-nums text-gray-800 dark:text-white">{{ metricas()!.totalContinuidades | appNumber }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Total Continuidades</p>
              </div>
            </div>
            @if (porCompra() || cargandoCompras()) { <app-desglose-compra [cargando]="cargandoCompras()" [valores]="desgloseTarjeta('totalContinuidades', 'num')" /> }
          </div>

          <!-- Pendientes -->
          <div class="@container bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
            <div class="flex flex-col items-start gap-2 @min-[13rem]:flex-row @min-[13rem]:items-center @min-[13rem]:gap-3">
              <div class="shrink-0 p-1.5 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <lucide-angular name="clock" [size]="18" class="text-yellow-600 dark:text-yellow-400"></lucide-angular>
              </div>
              <div class="min-w-0">
                <p class="text-2xl font-bold leading-tight tabular-nums text-yellow-600 dark:text-yellow-400">{{ metricas()!.continuidadesPendientes | appNumber }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Pendientes</p>
              </div>
            </div>
            @if (porCompra() || cargandoCompras()) { <app-desglose-compra [cargando]="cargandoCompras()" [valores]="desgloseTarjeta('continuidadesPendientes', 'num')" /> }
          </div>

          <!-- Pagadas -->
          <div class="@container bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
            <div class="flex flex-col items-start gap-2 @min-[13rem]:flex-row @min-[13rem]:items-center @min-[13rem]:gap-3">
              <div class="shrink-0 p-1.5 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <lucide-angular name="check-circle" [size]="18" class="text-green-600 dark:text-green-400"></lucide-angular>
              </div>
              <div class="min-w-0">
                <p class="text-2xl font-bold leading-tight tabular-nums text-green-600 dark:text-green-400">{{ metricas()!.continuidadesPagadas | appNumber }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Pagadas</p>
              </div>
            </div>
            @if (porCompra() || cargandoCompras()) { <app-desglose-compra [cargando]="cargandoCompras()" [valores]="desgloseTarjeta('continuidadesPagadas', 'num')" /> }
          </div>

          <!-- Vencidas -->
          <div class="@container bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
            <div class="flex flex-col items-start gap-2 @min-[13rem]:flex-row @min-[13rem]:items-center @min-[13rem]:gap-3">
              <div class="shrink-0 p-1.5 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <lucide-angular name="x-circle" [size]="18" class="text-red-600 dark:text-red-400"></lucide-angular>
              </div>
              <div class="min-w-0">
                <p class="text-2xl font-bold leading-tight tabular-nums text-red-600 dark:text-red-400">{{ metricas()!.continuidadesVencidas | appNumber }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Vencidas</p>
              </div>
            </div>
            @if (porCompra() || cargandoCompras()) { <app-desglose-compra [cargando]="cargandoCompras()" [valores]="desgloseTarjeta('continuidadesVencidas', 'num')" /> }
          </div>

          <!-- % Recuperación -->
          <div class="@container bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
            <div class="flex flex-col items-start gap-2 @min-[13rem]:flex-row @min-[13rem]:items-center @min-[13rem]:gap-3">
              <div class="shrink-0 p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <lucide-angular name="trending-up" [size]="18" class="text-blue-600 dark:text-blue-400"></lucide-angular>
              </div>
              <div class="min-w-0">
                <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {{ metricas()!.porcentajeRecuperacionPromedio | appNumber:'1.1-1' }}%
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">% Recuperación Prom.</p>
              </div>
            </div>
            @if (porCompra() || cargandoCompras()) { <app-desglose-compra [cargando]="cargandoCompras()" [valores]="desgloseTarjeta('porcentajeRecuperacionPromedio', 'pct')" /> }
          </div>
        </div>

        <!-- Montos Totales -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 [&>*]:min-w-0">
          <div class="bg-linear-to-r from-gray-700 to-gray-800 rounded-xl shadow-md p-4 text-white">
            <p class="text-xs text-gray-300 uppercase">Monto Total Original</p>
            <p class="text-xl font-bold">S/ {{ metricas()!.montoTotalOriginal | appNumber:'1.2-2' }}</p>
            @if (porCompra() || cargandoCompras()) { <app-desglose-compra [cargando]="cargandoCompras()" [valores]="desgloseTarjeta('montoTotalOriginal', 'soles')" [sobreColor]="true" /> }
          </div>
          <div class="bg-linear-to-r from-amber-500 to-amber-600 rounded-xl shadow-md p-4 text-white">
            <p class="text-xs text-amber-100 uppercase">Pagado Previo</p>
            <p class="text-xl font-bold">S/ {{ metricas()!.montoTotalPagadoPrevio | appNumber:'1.2-2' }}</p>
            @if (porCompra() || cargandoCompras()) { <app-desglose-compra [cargando]="cargandoCompras()" [valores]="desgloseTarjeta('montoTotalPagadoPrevio', 'soles')" [sobreColor]="true" /> }
          </div>
          <div class="bg-linear-to-r from-green-500 to-green-600 rounded-xl shadow-md p-4 text-white">
            <p class="text-xs text-green-100 uppercase">Pagado en Continuidad</p>
            <p class="text-xl font-bold">S/ {{ metricas()!.montoTotalPagadoContinuidad | appNumber:'1.2-2' }}</p>
            @if (porCompra() || cargandoCompras()) { <app-desglose-compra [cargando]="cargandoCompras()" [valores]="desgloseTarjeta('montoTotalPagadoContinuidad', 'soles')" [sobreColor]="true" /> }
          </div>
          <div class="bg-linear-to-r from-red-500 to-red-600 rounded-xl shadow-md p-4 text-white">
            <p class="text-xs text-red-100 uppercase">Monto Pendiente</p>
            <p class="text-xl font-bold">S/ {{ metricas()!.montoTotalPendiente | appNumber:'1.2-2' }}</p>
            @if (porCompra() || cargandoCompras()) { <app-desglose-compra [cargando]="cargandoCompras()" [valores]="desgloseTarjeta('montoTotalPendiente', 'soles')" [sobreColor]="true" /> }
          </div>
        </div>
      }

      <!-- Tabla -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">ID Cont.</th>
                <th class="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">ID Orig.</th>
                <th class="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Documento</th>
                <th class="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Cliente</th>
                <th class="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Cartera</th>
                @if (porCompra()) { <th class="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Compra</th> }
                <th class="px-3 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Monto Orig.</th>
                <th class="px-3 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Pagado Prev.</th>
                <th class="px-3 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Fecha Cont.</th>
                <th class="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Asesor</th>
                <th class="px-3 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Monto Cont.</th>
                <th class="px-3 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Estado</th>
                <th class="px-3 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Pagado</th>
                <th class="px-3 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Pendiente</th>
                <th class="px-3 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">% Avance</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              @if (loading()) {
                <tr>
                  <td [attr.colspan]="porCompra() ? 15 : 14" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    <lucide-angular name="loader-2" [size]="32" class="animate-spin mx-auto mb-2"></lucide-angular>
                    <p>Cargando datos...</p>
                  </td>
                </tr>
              } @else if (data().length === 0) {
                <tr>
                  <td [attr.colspan]="porCompra() ? 15 : 14" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    <lucide-angular name="inbox" [size]="48" class="mx-auto mb-2 text-gray-400"></lucide-angular>
                    <p>No hay datos de continuidad para mostrar</p>
                    <p class="text-xs mt-1">Aplica los filtros y presiona "Buscar"</p>
                  </td>
                </tr>
              } @else {
                @for (item of data(); track item.idGestionContinuidad) {
                  <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td class="px-3 py-2 text-gray-900 dark:text-white font-medium">{{ item.idGestionContinuidad }}</td>
                    <td class="px-3 py-2 text-gray-600 dark:text-gray-400">{{ item.idGestionOriginal || '-' }}</td>
                    <td class="px-3 py-2 text-gray-900 dark:text-white font-mono text-xs">{{ item.documentoCliente }}</td>
                    <td class="px-3 py-2 text-gray-900 dark:text-white">{{ item.nombreCliente | slice:0:25 }}</td>
                    <td class="px-3 py-2 text-gray-600 dark:text-gray-400 text-xs">{{ item.nombreCartera }}</td>
                    @if (porCompra()) {
                      <td class="px-3 py-2"><app-etiqueta-compra [compra]="compraDe(item.idGestionContinuidad)" [indice]="indiceCompra(item.idGestionContinuidad)" /></td>
                    }
                    <td class="px-3 py-2 text-right text-gray-900 dark:text-white">S/ {{ item.montoOriginalPromesa | appNumber:'1.2-2' }}</td>
                    <td class="px-3 py-2 text-right text-amber-600 dark:text-amber-400">S/ {{ item.montoPagadoPrevio | appNumber:'1.2-2' }}</td>
                    <td class="px-3 py-2 text-center text-gray-600 dark:text-gray-400 text-xs">{{ item.fechaContinuidad | appDate:'short' }}</td>
                    <td class="px-3 py-2 text-gray-600 dark:text-gray-400 text-xs">{{ item.asesorContinuidad | slice:0:15 }}</td>
                    <td class="px-3 py-2 text-right text-gray-900 dark:text-white font-semibold">S/ {{ item.montoContinuidad | appNumber:'1.2-2' }}</td>
                    <td class="px-3 py-2 text-center">
                      <span [class]="getEstadoClass(item.estadoContinuidad)">
                        {{ item.estadoContinuidad }}
                      </span>
                    </td>
                    <td class="px-3 py-2 text-right text-green-600 dark:text-green-400">S/ {{ item.pagadoEnContinuidad | appNumber:'1.2-2' }}</td>
                    <td class="px-3 py-2 text-right text-red-600 dark:text-red-400">S/ {{ item.pendienteContinuidad | appNumber:'1.2-2' }}</td>
                    <td class="px-3 py-2 text-center">
                      <div class="flex items-center justify-center gap-1">
                        <div class="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div
                            class="h-2 rounded-full transition-all"
                            [class]="getProgressClass(item.porcentajeAvance)"
                            [style.width.%]="item.porcentajeAvance || 0"
                          ></div>
                        </div>
                        <span class="text-xs text-gray-600 dark:text-gray-400 w-10">
                          {{ item.porcentajeAvance | appNumber:'1.0-0' }}%
                        </span>
                      </div>
                    </td>
                  </tr>
                }
              }
            </tbody>
          </table>
        </div>

        <!-- Footer con total -->
        @if (data().length > 0) {
          <div class="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Mostrando <span class="font-semibold">{{ data().length }}</span> registros de continuidad
            </p>
          </div>
        }
      </div>
      </div>
    </div>
  `,
  styles: []
})
export class ContinuidadReportComponent implements OnInit {
  // Signals
  loading = signal(false);
  data = signal<ReporteContinuidadDTO[]>([]);
  metricas = signal<ResumenMetricas | null>(null);

  // Dropdown data
  proveedores = signal<Inquilino[]>([]);
  carteras = signal<Cartera[]>([]);
  subcarteras = signal<Subcartera[]>([]);
  /** Cada subcartera y sus compras («TRAMO PROPIO · PRIMERA»). Valor '21' o '21:PRIMERA'. */
  opcionesSubcartera = computed(() => opcionesSubcartera(this.subcarteras(), this.comprasCartera.compras()));
  seleccionSubcartera = '';

  // Filtros
  filtros = {
    fechaDesde: '',
    fechaHasta: '',
    idProveedor: null as number | null, // ✅ debe coincidir con ngModel
    idCartera: null as number | null,
    idSubcartera: null as number | null,
    compra: null as string | null
  };

  constructor(private reporteService: ContinuidadReportService,
    private comisionesService: ComisionesService,
    private comprasCartera: ComprasCarteraService
  ) {}

  ngOnInit(): void {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const todayStr = `${yyyy}-${mm}-${dd}`;
  this.filtros.fechaDesde = todayStr;
  this.filtros.fechaHasta = todayStr;

  this.comprasCartera.cargar();

  // Cargar proveedores
  this.comisionesService.obtenerInquilinos().subscribe({
    next: (data) => this.proveedores.set(data),
    error: (err) => console.error('Error cargando proveedores:', err)
  });

  this.comisionesService.obtenerInquilinos().subscribe(data => this.proveedores.set(data));

  // Opcional: cargar el reporte inicial
  this.buscar();
}

    onProveedorChange(idProveedor: number | null): void {
      this.filtros.idCartera = null;
      this.limpiarSubcartera();
      this.carteras.set([]);
      this.subcarteras.set([]);

      if (idProveedor) {
        this.comisionesService.obtenerCarteras(idProveedor).subscribe({
          next: (data) => this.carteras.set(data),
          error: (err) => console.error('Error cargando carteras:', err)
        });
      }
  }

  private limpiarSubcartera(): void {
    this.seleccionSubcartera = '';
    this.filtros.idSubcartera = null;
    this.filtros.compra = null;
  }

  onSubcarteraChange(seleccion: string): void {
    const { idSubcartera, compra } = leerOpcionCompra(seleccion);
    this.filtros.idSubcartera = idSubcartera;
    this.filtros.compra = compra;
  }

  onCarteraChange(idCartera: number | null): void {
    this.limpiarSubcartera();
    this.subcarteras.set([]);

    if (idCartera) {
      this.comisionesService.obtenerSubcarteras(idCartera).subscribe({
        next: (data) => this.subcarteras.set(data),
        error: (err) => console.error('Error cargando subcarteras:', err)
      });
    }
  }

  // ==================== DESGLOSE POR COMPRA ====================
  verPorCompra = signal(false);
  cargandoCompras = signal(false);
  datosCompra = signal<ReporteResponse[] | null>(null);
  /** Filtros de la última búsqueda */
  private consultado = { ...this.filtros };

  comprasDesglose(): string[] {
    const { idSubcartera, compra } = this.consultado;
    if (compra || !idSubcartera) return [];
    return this.comprasCartera.compras()[idSubcartera] ?? [];
  }

  hayDesglose(): boolean {
    return this.comprasDesglose().length > 0 && !!this.metricas();
  }

  porCompra(): boolean {
    return this.hayDesglose() && this.verPorCompra() && this.datosCompra()?.length === this.comprasDesglose().length;
  }

  /** Índice de compra de cada continuidad */
  private compraPorId = computed(() => {
    const mapa = new Map<number, number>();
    this.datosCompra()?.forEach((r, k) => r.data.forEach(d => mapa.set(d.idGestionContinuidad, k)));
    return mapa;
  });

  compraDe(id: number): string | null {
    const k = this.compraPorId().get(id);
    return k === undefined ? null : this.comprasDesglose()[k];
  }

  indiceCompra(id: number): number {
    return this.compraPorId().get(id) ?? 0;
  }

  cambiarVista(porCompra: boolean): void {
    this.verPorCompra.set(porCompra);
    if (porCompra && !this.datosCompra()) this.cargarCompras();
  }

  private cargarCompras(): void {
    const compras = this.comprasDesglose();
    if (!compras.length) return;
    const f = this.consultado;
    this.cargandoCompras.set(true);
    forkJoin(compras.map(compra => this.reporteService.getReporte(
      f.fechaDesde || undefined, f.fechaHasta || undefined, f.idCartera || undefined, f.idSubcartera || undefined, compra
    ))).subscribe({
      next: r => { this.datosCompra.set(r); this.cargandoCompras.set(false); },
      error: err => {
        console.error('Error cargando el desglose por compra:', err);
        this.cargandoCompras.set(false);
        this.verPorCompra.set(false);
        alert('Error al cargar el desglose por compra');
      }
    });
  }

  desgloseTarjeta(campo: keyof ResumenMetricas, tipo: 'num' | 'soles' | 'pct'): ValorCompra[] {
    return this.comprasDesglose().map((compra, k) =>
      ({ compra, valor: formatoCompra(this.datosCompra()?.[k]?.metricas?.[campo], tipo) }));
  }

  buscar(): void {
    this.loading.set(true);
    this.consultado = { ...this.filtros };
    this.datosCompra.set(null);

    this.reporteService.getReporte(
      this.filtros.fechaDesde || undefined,
      this.filtros.fechaHasta || undefined,
      this.filtros.idCartera || undefined,
      this.filtros.idSubcartera || undefined,
      this.filtros.compra || undefined
    ).subscribe({
      next: (response) => {
        this.data.set(response.data);
        this.metricas.set(response.metricas);
        this.loading.set(false);
        this.verPorCompra.set(false);
      },
      error: (error) => {
        console.error('Error cargando reporte:', error);
        this.loading.set(false);
        alert('Error al cargar el reporte de continuidad');
      }
    });
  }

  exportarExcel(): void {
    this.loading.set(true);

    this.reporteService.exportarExcel(
      this.filtros.fechaDesde || undefined,
      this.filtros.fechaHasta || undefined,
      this.filtros.idCartera || undefined,
      this.filtros.idSubcartera || undefined,
      this.filtros.compra || undefined
    ).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Reporte_Continuidad_${new Date().toISOString().split('T')[0]}.xlsx`;
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

  getEstadoClass(estado: string): string {
    const base = 'px-2 py-1 rounded-full text-xs font-semibold';
    switch (estado) {
      case 'PAGADA':
        return `${base} bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400`;
      case 'PENDIENTE':
      case 'PARCIAL':
        return `${base} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400`;
      case 'VENCIDA':
        return `${base} bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400`;
      default:
        return `${base} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400`;
    }
  }

  getProgressClass(porcentaje: number): string {
    if (porcentaje >= 100) return 'bg-green-500';
    if (porcentaje >= 50) return 'bg-amber-500';
    return 'bg-red-500';
  }
}
