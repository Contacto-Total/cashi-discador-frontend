import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import {
  ProduccionReportService,
  ReporteProduccionDTO,
  ResumenProduccion
} from './produccion-report.service';
import { ComisionesService } from '../../../comisiones/services/comisiones.service';
import { Inquilino, Cartera, Subcartera } from '../../../comisiones/models/comision.model';

@Component({
  selector: 'app-produccion-report',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, DecimalPipe],
  template: `
    <div class="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
          <lucide-angular name="bar-chart-3" [size]="28" class="text-teal-500"></lucide-angular>
          Reporte de Producción
        </h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1">
          Producción diaria por cartera: Meta, Generación, Proyectado, Pagos y Puntos
        </p>
      </div>

      <!-- Filtros -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4">
          <!-- Fecha -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha</label>
            <input type="date" [(ngModel)]="filtros.fecha"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-teal-500 focus:border-teal-500" />
          </div>

          <!-- Proveedor -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Proveedor</label>
            <select [(ngModel)]="filtros.idProveedor" (ngModelChange)="onProveedorChange($event)"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
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
                     focus:ring-2 focus:ring-teal-500 focus:border-teal-500
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
                     focus:ring-2 focus:ring-teal-500 focus:border-teal-500
                     disabled:opacity-50 disabled:cursor-not-allowed">
              <option [ngValue]="null">Todas</option>
              @for (sub of subcarteras(); track sub.id) {
                <option [ngValue]="sub.id">{{ sub.nombreSubcartera }}</option>
              }
            </select>
          </div>

          <!-- Hora Desde -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hora Desde</label>
            <select [(ngModel)]="filtros.horaDesde"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
              <option [ngValue]="null">--</option>
              @for (h of horas; track h) {
                <option [ngValue]="h">{{ h.toString().padStart(2, '0') }}:00</option>
              }
            </select>
          </div>

          <!-- Hora Hasta -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hora Hasta</label>
            <select [(ngModel)]="filtros.horaHasta"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
              <option [ngValue]="null">--</option>
              @for (h of horas; track h) {
                <option [ngValue]="h">{{ h.toString().padStart(2, '0') }}:00</option>
              }
            </select>
          </div>

          <!-- Botones -->
          <div class="flex items-end gap-2">
            <button (click)="buscar()"
              [disabled]="loading()"
              class="flex-1 px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white font-semibold
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
      </div>

      <!-- Métricas Resumen -->
      @if (resumen()) {
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <!-- Total Meta -->
          <div class="bg-gradient-to-r from-gray-700 to-gray-800 rounded-xl shadow-md p-4 text-white">
            <p class="text-xs text-gray-300 uppercase">Meta Total</p>
            <p class="text-xl font-bold">S/ {{ resumen()!.totalMeta | number:'1.2-2' }}</p>
          </div>

          <!-- Generación -->
          <div class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-md p-4 text-white">
            <p class="text-xs text-blue-100 uppercase">Generación Hoy</p>
            <p class="text-xl font-bold">S/ {{ resumen()!.totalGeneracion | number:'1.2-2' }}</p>
          </div>

          <!-- Proyectado -->
          <div class="bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl shadow-md p-4 text-white">
            <p class="text-xs text-amber-100 uppercase">Proyectado Hoy</p>
            <p class="text-xl font-bold">S/ {{ resumen()!.totalProyectado | number:'1.2-2' }}</p>
          </div>

          <!-- Pagos -->
          <div class="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-md p-4 text-white">
            <p class="text-xs text-green-100 uppercase">Pagos Hoy</p>
            <p class="text-xl font-bold">S/ {{ resumen()!.totalPagos | number:'1.2-2' }}</p>
          </div>

          <!-- Puntos Global -->
          <div class="bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl shadow-md p-4 text-white">
            <p class="text-xs text-teal-100 uppercase">Puntos Global</p>
            <p class="text-xl font-bold">{{ resumen()!.puntosGlobalPct | number:'1.2-2' }}%</p>
          </div>

          <!-- Total Carteras -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
                <lucide-angular name="layers" [size]="24" class="text-teal-600 dark:text-teal-400"></lucide-angular>
              </div>
              <div>
                <p class="text-2xl font-bold text-gray-800 dark:text-white">{{ resumen()!.totalCarteras }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Carteras</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Row 2: Distribution metrics -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <!-- Meta Diaria Efectiva -->
          <div class="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-md p-4 text-white">
            <p class="text-xs text-purple-100 uppercase">Meta Diaria Efectiva</p>
            <p class="text-xl font-bold">S/ {{ resumen()!.totalMetaDiariaEfectiva | number:'1.2-2' }}</p>
          </div>

          <!-- Déficit -->
          <div class="bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-md p-4 text-white">
            <p class="text-xs text-red-100 uppercase">Déficit Acumulado</p>
            <p class="text-xl font-bold">S/ {{ resumen()!.totalDeficit | number:'1.2-2' }}</p>
          </div>

          <!-- Cumplimiento Diario -->
          <div class="rounded-xl shadow-md p-4 text-white"
               [class]="getCumplimientoBgClass(resumen()!.cumplimientoDiarioGlobalPct)">
            <p class="text-xs uppercase opacity-80">Cumplimiento Diario</p>
            <p class="text-xl font-bold">{{ resumen()!.cumplimientoDiarioGlobalPct | number:'1.2-2' }}%</p>
          </div>
        </div>
      }

      <!-- Tabla -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Cartera</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Subcartera</th>
                <th class="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Meta (Monto Capital)</th>
                <th class="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Generación Hoy</th>
                <th class="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Proyectado Hoy</th>
                <th class="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Pagos Hoy</th>
                <th class="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Puntos Hoy %</th>
                <th class="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Punto Efect. %</th>
                <th class="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Meta Diaria</th>
                <th class="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Déficit</th>
                <th class="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Cumpl. Diario %</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              @if (loading()) {
                <tr>
                  <td colspan="11" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    <lucide-angular name="loader-2" [size]="32" class="animate-spin mx-auto mb-2"></lucide-angular>
                    <p>Cargando datos...</p>
                  </td>
                </tr>
              } @else if (data().length === 0) {
                <tr>
                  <td colspan="11" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    <lucide-angular name="inbox" [size]="48" class="mx-auto mb-2 text-gray-400"></lucide-angular>
                    <p>No hay datos de producción para mostrar</p>
                    <p class="text-xs mt-1">Selecciona los filtros y presiona "Buscar"</p>
                  </td>
                </tr>
              } @else {
                @for (item of data(); track item.idSubcartera) {
                  <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td class="px-4 py-3 text-gray-900 dark:text-white font-medium">{{ item.nombreCartera }}</td>
                    <td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ item.nombreSubcartera }}</td>
                    <td class="px-4 py-3 text-right text-gray-900 dark:text-white font-semibold">
                      S/ {{ item.meta | number:'1.2-2' }}
                    </td>
                    <td class="px-4 py-3 text-right text-blue-600 dark:text-blue-400 font-semibold">
                      S/ {{ item.generacionHoy | number:'1.2-2' }}
                    </td>
                    <td class="px-4 py-3 text-right text-amber-600 dark:text-amber-400 font-semibold">
                      S/ {{ item.proyectadoHoy | number:'1.2-2' }}
                    </td>
                    <td class="px-4 py-3 text-right text-green-600 dark:text-green-400 font-semibold">
                      S/ {{ item.pagosHoy | number:'1.2-2' }}
                    </td>
                    <td class="px-4 py-3 text-center">
                      <div class="flex items-center justify-center gap-2">
                        <div class="w-20 bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                          <div
                            class="h-2.5 rounded-full transition-all"
                            [class]="getProgressClass(item.puntosHoyPct)"
                            [style.width.%]="Math.min(item.puntosHoyPct, 100)"
                          ></div>
                        </div>
                        <span class="text-sm font-bold" [class]="getPuntosTextClass(item.puntosHoyPct)">
                          {{ item.puntosHoyPct | number:'1.2-2' }}%
                        </span>
                      </div>
                    </td>
                    <td class="px-4 py-3 text-center">
                      <span class="text-sm font-medium text-purple-600 dark:text-purple-400">
                        {{ item.puntoEfectivoPct | number:'1.2-2' }}%
                      </span>
                    </td>
                    <td class="px-4 py-3 text-right text-purple-600 dark:text-purple-400 font-semibold">
                      S/ {{ item.metaDiariaEfectiva | number:'1.2-2' }}
                    </td>
                    <td class="px-4 py-3 text-right font-semibold"
                        [class]="item.deficitAcumulado > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-400 dark:text-gray-500'">
                      S/ {{ item.deficitAcumulado | number:'1.2-2' }}
                    </td>
                    <td class="px-4 py-3 text-center">
                      <span class="text-sm font-bold" [class]="getCumplimientoTextClass(item.cumplimientoDiarioPct)">
                        {{ item.cumplimientoDiarioPct | number:'1.2-2' }}%
                      </span>
                    </td>
                  </tr>
                }

                <!-- Fila Total -->
                @if (resumen()) {
                  <tr class="bg-gray-100 dark:bg-gray-700 font-bold border-t-2 border-gray-300 dark:border-gray-500">
                    <td class="px-4 py-3 text-gray-900 dark:text-white" colspan="2">TOTAL</td>
                    <td class="px-4 py-3 text-right text-gray-900 dark:text-white">
                      S/ {{ resumen()!.totalMeta | number:'1.2-2' }}
                    </td>
                    <td class="px-4 py-3 text-right text-blue-700 dark:text-blue-300">
                      S/ {{ resumen()!.totalGeneracion | number:'1.2-2' }}
                    </td>
                    <td class="px-4 py-3 text-right text-amber-700 dark:text-amber-300">
                      S/ {{ resumen()!.totalProyectado | number:'1.2-2' }}
                    </td>
                    <td class="px-4 py-3 text-right text-green-700 dark:text-green-300">
                      S/ {{ resumen()!.totalPagos | number:'1.2-2' }}
                    </td>
                    <td class="px-4 py-3 text-center text-teal-700 dark:text-teal-300">
                      {{ resumen()!.puntosGlobalPct | number:'1.2-2' }}%
                    </td>
                    <td class="px-4 py-3 text-center text-gray-500">-</td>
                    <td class="px-4 py-3 text-right text-purple-700 dark:text-purple-300">
                      S/ {{ resumen()!.totalMetaDiariaEfectiva | number:'1.2-2' }}
                    </td>
                    <td class="px-4 py-3 text-right text-red-700 dark:text-red-300">
                      S/ {{ resumen()!.totalDeficit | number:'1.2-2' }}
                    </td>
                    <td class="px-4 py-3 text-center font-bold" [class]="getCumplimientoTextClass(resumen()!.cumplimientoDiarioGlobalPct)">
                      {{ resumen()!.cumplimientoDiarioGlobalPct | number:'1.2-2' }}%
                    </td>
                  </tr>
                }
              }
            </tbody>
          </table>
        </div>

        <!-- Footer -->
        @if (data().length > 0) {
          <div class="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Mostrando <span class="font-semibold">{{ data().length }}</span> carteras/subcarteras
            </p>
          </div>
        }
      </div>
    </div>
  `,
  styles: []
})
export class ProduccionReportComponent implements OnInit {
  Math = Math;

  // State
  loading = signal(false);
  data = signal<ReporteProduccionDTO[]>([]);
  resumen = signal<ResumenProduccion | null>(null);

  // Dropdowns
  proveedores = signal<Inquilino[]>([]);
  carteras = signal<Cartera[]>([]);
  subcarteras = signal<Subcartera[]>([]);

  // Horas disponibles (0-23)
  horas = Array.from({ length: 24 }, (_, i) => i);

  // Filtros
  filtros = {
    fecha: '',
    idProveedor: null as number | null,
    idCartera: null as number | null,
    idSubcartera: null as number | null,
    horaDesde: null as number | null,
    horaHasta: null as number | null
  };

  constructor(
    private produccionService: ProduccionReportService,
    private comisionesService: ComisionesService
  ) {}

  ngOnInit(): void {
    // Fecha por defecto: hoy
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    this.filtros.fecha = `${yyyy}-${mm}-${dd}`;

    // Cargar proveedores
    this.comisionesService.obtenerInquilinos().subscribe({
      next: (data) => this.proveedores.set(data),
      error: (err) => console.error('Error cargando proveedores:', err)
    });

    // Auto-buscar al inicio
    this.buscar();
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
    this.loading.set(true);

    this.produccionService.getReporte(
      this.filtros.fecha || undefined,
      this.filtros.idCartera || undefined,
      this.filtros.idSubcartera || undefined,
      this.filtros.horaDesde ?? undefined,
      this.filtros.horaHasta ?? undefined
    ).subscribe({
      next: (response) => {
        this.data.set(response.data);
        this.resumen.set(response.resumen);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error cargando reporte:', error);
        this.loading.set(false);
        alert('Error al cargar el reporte de producción');
      }
    });
  }

  exportarExcel(): void {
    this.loading.set(true);

    this.produccionService.exportarExcel(
      this.filtros.fecha || undefined,
      this.filtros.idCartera || undefined,
      this.filtros.idSubcartera || undefined,
      this.filtros.horaDesde ?? undefined,
      this.filtros.horaHasta ?? undefined
    ).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Reporte_Produccion_${new Date().toISOString().split('T')[0]}.xlsx`;
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

  getProgressClass(puntaje: number): string {
    if (puntaje >= 100) return 'bg-green-500';
    if (puntaje >= 50) return 'bg-amber-500';
    if (puntaje >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  }

  getPuntosTextClass(puntaje: number): string {
    if (puntaje >= 100) return 'text-green-600 dark:text-green-400';
    if (puntaje >= 50) return 'text-amber-600 dark:text-amber-400';
    if (puntaje >= 25) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  }

  getCumplimientoTextClass(pct: number): string {
    if (pct >= 100) return 'text-green-600 dark:text-green-400';
    if (pct >= 80) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  }

  getCumplimientoBgClass(pct: number): string {
    if (pct >= 100) return 'bg-gradient-to-r from-green-500 to-green-600';
    if (pct >= 80) return 'bg-gradient-to-r from-amber-500 to-amber-600';
    return 'bg-gradient-to-r from-red-500 to-red-600';
  }
}
