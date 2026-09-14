import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import {
  ProduccionReportService,
  ReporteProduccionDTO,
  ResumenProduccion,
  MetaReporteProduccion,
  TipoMetaReporteProduccion,
  FiltrosReporteProduccion,
  PageResponse
} from './produccion-report.service';
import { ComisionesService } from '../../../comisiones/services/comisiones.service';
import { Inquilino, Cartera, Subcartera } from '../../../comisiones/models/comision.model';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-produccion-report',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, DecimalPipe],
  template: `
    <div class="min-h-screen bg-gray-100 p-4 dark:bg-gray-900 md:p-6">
      <div class="mx-auto flex max-w-[1800px] flex-col items-start gap-4 xl:flex-row">
      <main class="min-w-0 flex-1">
      <!-- Header -->
      <div class="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div class="min-w-0">
          <h1 class="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
            <lucide-angular name="bar-chart-3" [size]="28" class="shrink-0 text-teal-500"></lucide-angular>
            Reporte de Producción
          </h1>
          <p class="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
            Producción diaria por cartera: Meta, Generación, Proyectado, Pagos y Puntos
          </p>
        </div>
      </div>

      <!-- Filtros -->
      <div class="mb-4 rounded-xl bg-white p-3 shadow-md dark:bg-gray-800">
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[160px_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto]">
          <!-- Fecha -->
          <div>
            <label class="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">Fecha</label>
            <input type="date" [(ngModel)]="filtros.fecha"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-teal-500 focus:border-teal-500" />
          </div>

          <!-- Proveedor -->
          <div>
            <label class="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">Proveedor</label>
            <select [(ngModel)]="filtros.idProveedor" (ngModelChange)="onProveedorChange($event)"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
              <option [ngValue]="null">Todos los proveedores</option>
              @for (prov of proveedores(); track prov.id) {
                <option [ngValue]="prov.id">{{ prov.nombreInquilino }}</option>
              }
            </select>
          </div>

          <!-- Cartera -->
          <div>
            <label class="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">Cartera</label>
            <select [(ngModel)]="filtros.idCartera" (ngModelChange)="onCarteraChange($event)"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-teal-500 focus:border-teal-500
                     disabled:opacity-50 disabled:cursor-not-allowed">
              <option [ngValue]="null">Todas las carteras</option>
              @for (cart of carteras(); track cart.id) {
                <option [ngValue]="cart.id">{{ cart.nombreCartera }}</option>
              }
            </select>
          </div>

          <!-- Subcartera -->
          <div>
            <label class="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">Subcartera</label>
            <select [(ngModel)]="filtros.idSubcartera" (ngModelChange)="onSubcarteraChange()"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-teal-500 focus:border-teal-500
                     disabled:opacity-50 disabled:cursor-not-allowed">
              <option [ngValue]="null">Todas las subcarteras</option>
              @for (sub of subcarteras(); track sub.id) {
                <option [ngValue]="sub.id">{{ sub.nombreSubcartera }}</option>
              }
            </select>
          </div>

          <!-- Botones -->
            <div class="flex min-w-0 items-end gap-2 sm:col-span-2 lg:col-span-1">
            <button (click)="buscar()"
              [disabled]="loading()"
              class="min-w-0 flex-1 whitespace-nowrap px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white font-semibold
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
              class="flex-1 whitespace-nowrap px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold
                     rounded-lg transition-colors flex items-center gap-2
                     disabled:opacity-50 disabled:cursor-not-allowed">
              <lucide-angular name="download" [size]="18"></lucide-angular>
              Excel
            </button>
            <button (click)="irAHistorico()" [disabled]="!contextoSeleccionado()" class="flex-1 whitespace-nowrap rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200">Histórico</button>
          </div>
        </div>
      </div>

      <!-- Métricas Resumen -->
      @if (resumen()) {
        <div class="mb-6 grid grid-cols-2 gap-3 md:grid-cols-3">
          <!-- Total Meta -->
          <div class="rounded-xl bg-gradient-to-r from-slate-800 to-slate-950 p-3 text-white shadow-md">
            <p class="text-xs font-semibold text-white uppercase">Meta Total</p>
             <p class="text-lg font-extrabold text-white">S/ {{ resumen()!.totalMeta | number:'1.2-2' }}</p>
          </div>

          <!-- Generación -->
          <div class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-md p-3 text-white">
            <p class="text-xs text-blue-100 uppercase">Generación Hoy</p>
             <p class="text-lg font-bold">S/ {{ resumen()!.totalGeneracion | number:'1.2-2' }}</p>
          </div>

          <!-- Proyectado -->
          <div class="bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl shadow-md p-3 text-white">
            <p class="text-xs text-amber-100 uppercase">Proyectado Hoy</p>
             <p class="text-lg font-bold">S/ {{ resumen()!.totalProyectado | number:'1.2-2' }}</p>
          </div>

          <!-- Pagos -->
          <div class="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-md p-3 text-white">
            <p class="text-xs text-green-100 uppercase">Pagos Hoy</p>
             <p class="text-lg font-bold">S/ {{ resumen()!.totalPagos | number:'1.2-2' }}</p>
          </div>

          <!-- Puntos Global -->
          <div class="bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl shadow-md p-3 text-white">
            <p class="text-xs text-teal-100 uppercase">Puntos Global</p>
             <p class="text-lg font-bold">{{ resumen()!.puntosGlobalPct | number:'1.2-2' }}%</p>
          </div>

          <!-- Total Carteras -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-3">
            <div class="flex items-center gap-2">
              <div class="p-1.5 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
                <lucide-angular name="layers" [size]="20" class="text-teal-600 dark:text-teal-400"></lucide-angular>
              </div>
              <div>
                <p class="text-xl font-bold text-gray-800 dark:text-white">{{ resumen()!.totalCarteras }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Carteras</p>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- Tabla -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-3 py-2 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Cartera</th>
                <th class="px-3 py-2 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Subcartera</th>
                <th class="px-3 py-2 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Meta {{ filtros.tipoMeta === 'INTERNA' ? 'Interna' : 'SIP' }}</th>
                <th class="px-3 py-2 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Generación Hoy</th>
                <th class="px-3 py-2 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Proyectado Hoy</th>
                <th class="px-3 py-2 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Pagos Hoy</th>
                <th class="px-3 py-2 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Puntos Hoy %</th>
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
              } @else if (data().length === 0) {
                <tr>
                  <td colspan="7" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    <lucide-angular name="inbox" [size]="48" class="mx-auto mb-2 text-gray-400"></lucide-angular>
                    <p>No hay datos de producción para mostrar</p>
                    <p class="text-xs mt-1">Selecciona los filtros y presiona "Buscar"</p>
                  </td>
                </tr>
              } @else {
                @for (item of data(); track item.idSubcartera) {
                  <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td class="px-3 py-2 text-gray-900 dark:text-white font-medium">{{ item.nombreCartera }}</td>
                    <td class="px-3 py-2 text-gray-600 dark:text-gray-400">{{ item.nombreSubcartera }}</td>
                    <td class="px-3 py-2 text-right text-gray-900 dark:text-white font-semibold">
                      S/ {{ item.meta | number:'1.2-2' }}
                    </td>
                    <td class="px-3 py-2 text-right text-blue-600 dark:text-blue-400 font-semibold">
                      S/ {{ item.generacionHoy | number:'1.2-2' }}
                    </td>
                    <td class="px-3 py-2 text-right text-amber-600 dark:text-amber-400 font-semibold">
                      S/ {{ item.proyectadoHoy | number:'1.2-2' }}
                    </td>
                    <td class="px-3 py-2 text-right text-green-600 dark:text-green-400 font-semibold">
                      S/ {{ item.pagosHoy | number:'1.2-2' }}
                    </td>
                    <td class="px-3 py-2 text-center">
                      <span class="text-sm font-bold" [class]="getPuntosTextClass(item.puntosHoyPct)">
                        {{ item.puntosHoyPct | number:'1.2-2' }}%
                      </span>
                    </td>
                  </tr>
                }

                <!-- Fila Total -->
                @if (resumen()) {
                  <tr class="bg-gray-100 dark:bg-gray-700 font-bold border-t-2 border-gray-300 dark:border-gray-500">
                    <td class="px-3 py-2 text-gray-900 dark:text-white" colspan="2">TOTAL</td>
                    <td class="px-3 py-2 text-right text-gray-900 dark:text-white">
                      S/ {{ resumen()!.totalMeta | number:'1.2-2' }}
                    </td>
                    <td class="px-3 py-2 text-right text-blue-700 dark:text-blue-300">
                      S/ {{ resumen()!.totalGeneracion | number:'1.2-2' }}
                    </td>
                    <td class="px-3 py-2 text-right text-amber-700 dark:text-amber-300">
                      S/ {{ resumen()!.totalProyectado | number:'1.2-2' }}
                    </td>
                    <td class="px-3 py-2 text-right text-green-700 dark:text-green-300">
                      S/ {{ resumen()!.totalPagos | number:'1.2-2' }}
                    </td>
                    <td class="px-3 py-2 text-center text-teal-700 dark:text-teal-300">
                      {{ resumen()!.puntosGlobalPct | number:'1.2-2' }}%
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
      </main>

        @if (isAdmin) {
        <aside class="w-full shrink-0 rounded-xl bg-white p-3 shadow-md dark:bg-gray-800 xl:sticky xl:top-4 xl:w-64">
          <div class="mb-4 flex items-start justify-between gap-3">
            <div>
              <h2 class="text-sm font-bold text-gray-800 dark:text-white">Configuración de meta</h2>
            </div>
            <div class="flex rounded-lg bg-gray-100 p-0.5 dark:bg-gray-700"><button type="button" (click)="seleccionarTipoMeta('INTERNA')" [class]="filtros.tipoMeta === 'INTERNA' ? 'bg-teal-600 text-white' : 'text-gray-600 dark:text-gray-300'" class="rounded-md px-2 py-1 text-xs font-semibold">Interna</button><button type="button" (click)="seleccionarTipoMeta('SIP')" [class]="filtros.tipoMeta === 'SIP' ? 'bg-indigo-600 text-white' : 'text-gray-600 dark:text-gray-300'" class="rounded-md px-2 py-1 text-xs font-semibold">SIP</button></div>
          </div>

          @if (!contextoSeleccionado()) {
            <p class="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">Selecciona proveedor, cartera y subcartera para registrar una meta.</p>
          }

          <div class="space-y-3 border-b border-gray-200 pb-4 dark:border-gray-700">
            <div>
              <label class="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">Valor de meta</label>
              <input type="number" min="0" [(ngModel)]="valorMetaNueva" placeholder="0.00" class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
            </div>
            <div>
              <label class="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">Mes de aplicación</label>
              <input type="month" [(ngModel)]="mesVigenciaNueva" class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
            </div>
            <button type="button" (click)="guardarMeta()" [disabled]="guardandoMeta() || valorMetaNueva === null || !contextoSeleccionado()" class="w-full rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50">Guardar meta</button>
          </div>

          <div class="mt-4">
            <div class="mb-2 flex items-center justify-between"><h3 class="text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">Metas configuradas</h3><button type="button" (click)="cargarGestionMetas()" class="text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-300">Actualizar</button></div>
            <div class="max-h-[45vh] space-y-1 overflow-y-auto pr-1">
              @for (meta of metas(); track meta.id) {
                <div class="rounded-md border border-gray-200 px-2.5 py-2 dark:border-gray-700">
                  <div class="flex items-center justify-between gap-2"><span class="text-sm font-bold text-gray-900 dark:text-white">S/ {{ meta.valorMeta | number:'1.2-2' }}</span><span [class]="meta.activo ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'" class="rounded-full px-1.5 py-0.5 text-[11px] font-semibold">{{ meta.activo ? 'Activa' : 'Inactiva' }}</span></div>
                   <div class="mt-1 flex items-center justify-between gap-2 text-xs"><span class="text-gray-500 dark:text-gray-400">{{ meta.mesVigencia }}</span><button type="button" (click)="cambiarEstadoMeta(meta)" class="font-semibold text-indigo-600 hover:underline dark:text-indigo-300">{{ meta.activo ? 'Desactivar' : 'Activar' }}</button></div>
                 </div>
               } @empty { <p class="py-4 text-center text-sm text-gray-500">No hay metas configuradas.</p> }
             </div>
             @if (paginaMetas(); as pagina) {
               @if (pagina.totalPages > 1) {
                 <div class="mt-3 flex items-center justify-between text-xs">
                   <button type="button" (click)="cargarGestionMetas(pagina.number - 1)" [disabled]="pagina.first" class="rounded border border-gray-300 px-2 py-1 font-semibold disabled:opacity-50 dark:border-gray-600">Anterior</button>
                   <span class="text-gray-500 dark:text-gray-400">{{ pagina.number + 1 }} / {{ pagina.totalPages }}</span>
                   <button type="button" (click)="cargarGestionMetas(pagina.number + 1)" [disabled]="pagina.last" class="rounded border border-gray-300 px-2 py-1 font-semibold disabled:opacity-50 dark:border-gray-600">Siguiente</button>
                 </div>
               }
             }
          </div>
        </aside>
        }
      </div>
    </div>
  `,
  styles: []
})
export class ProduccionReportComponent implements OnInit {
  // State
  loading = signal(false);
  data = signal<ReporteProduccionDTO[]>([]);
  resumen = signal<ResumenProduccion | null>(null);
  metas = signal<MetaReporteProduccion[]>([]);
  paginaMetas = signal<PageResponse<MetaReporteProduccion> | null>(null);
  guardandoMeta = signal(false);

  valorMetaNueva: number | null = null;
  mesVigenciaNueva = '';

  // Dropdowns
  proveedores = signal<Inquilino[]>([]);
  carteras = signal<Cartera[]>([]);
  subcarteras = signal<Subcartera[]>([]);

  // Filtros
  filtros = {
    fecha: '',
    idProveedor: null as number | null,
    idCartera: null as number | null,
    idSubcartera: null as number | null,
    tipoMeta: 'INTERNA' as TipoMetaReporteProduccion
  };

  constructor(
    private produccionService: ProduccionReportService,
    private comisionesService: ComisionesService,
    private router: Router,
    private authService: AuthService
  ) {}

  get isAdmin(): boolean {
    return this.authService.getCurrentUser()?.role === 'ADMIN';
  }

  ngOnInit(): void {
    // Fecha por defecto: hoy
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    this.filtros.fecha = `${yyyy}-${mm}-${dd}`;
    this.mesVigenciaNueva = `${yyyy}-${mm}`;

    // Cargar proveedores
    this.comisionesService.obtenerInquilinos().subscribe({
      next: (data) => { this.proveedores.set(data); this.cargarTodasLasCarteras(); this.buscar(); },
      error: (err) => console.error('Error cargando proveedores:', err)
    });

  }

  onProveedorChange(idProveedor: number | null): void {
    this.filtros.idCartera = null;
    this.filtros.idSubcartera = null;
    this.subcarteras.set([]);
    this.limpiarResultados();

    if (idProveedor) {
      this.comisionesService.obtenerCarteras(idProveedor).subscribe({
        next: (data) => this.carteras.set(data),
        error: (err) => console.error('Error cargando carteras:', err)
      });
    } else {
      this.cargarTodasLasCarteras();
    }
  }

  onCarteraChange(idCartera: number | null): void {
    this.filtros.idSubcartera = null;
    this.subcarteras.set([]);
    this.limpiarResultados();

    if (idCartera) {
      this.comisionesService.obtenerSubcarteras(idCartera).subscribe({
        next: (data) => this.subcarteras.set(data),
        error: (err) => console.error('Error cargando subcarteras:', err)
      });
    } else {
      this.cargarTodasLasSubcarteras();
    }
  }

  buscar(): void {
    this.loading.set(true);

    this.produccionService.getReporte(this.construirFiltros()).subscribe({
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

    this.produccionService.exportarExcel(this.construirFiltros()).subscribe({
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

  seleccionarTipoMeta(tipoMeta: TipoMetaReporteProduccion): void {
    this.filtros.tipoMeta = tipoMeta;
    this.buscar();
    if (this.contextoSeleccionado()) {
      this.cargarGestionMetas();
    }
  }

  onSubcarteraChange(): void {
    this.limpiarResultados();
    if (this.contextoSeleccionado()) {
      this.cargarGestionMetas();
    }
  }

  cargarGestionMetas(page = 0): void {
    if (!this.contextoSeleccionado()) return;
    const { idProveedor, idCartera, idSubcartera } = this.filtros;
    this.produccionService.getMetas(idProveedor!, idCartera!, idSubcartera!, this.filtros.tipoMeta, page).subscribe({
      next: respuesta => {
        this.metas.set(respuesta.content);
        this.paginaMetas.set(respuesta);
      },
      error: error => console.error('Error cargando metas:', error)
    });
  }

  guardarMeta(): void {
    if (!this.contextoSeleccionado() || this.valorMetaNueva === null || this.valorMetaNueva < 0 || !this.mesVigenciaNueva) return;
    this.guardandoMeta.set(true);
    this.produccionService.crearMeta({
      idTenant: this.filtros.idProveedor!,
      idCartera: this.filtros.idCartera!,
      idSubcartera: this.filtros.idSubcartera!,
      tipoMeta: this.filtros.tipoMeta,
      valorMeta: this.valorMetaNueva,
      mesVigencia: this.mesVigenciaNueva,
      activo: true
    }).subscribe({
      next: () => {
        this.valorMetaNueva = null;
        this.guardandoMeta.set(false);
        this.cargarGestionMetas();
        this.buscar();
      },
      error: error => {
        console.error('Error guardando meta:', error);
        this.guardandoMeta.set(false);
        alert('No se pudo guardar la meta. Verifica que no exista otra para el mismo mes.');
      }
    });
  }

  cambiarEstadoMeta(meta: MetaReporteProduccion): void {
    if (!meta.id) return;
    const request = meta.activo
      ? this.produccionService.desactivarMeta(meta.id)
      : this.produccionService.activarMeta(meta.id);
    request.subscribe({
      next: () => {
        this.cargarGestionMetas();
        this.buscar();
      },
      error: error => console.error('Error actualizando meta:', error)
    });
  }

  contextoSeleccionado(): boolean {
    return this.filtros.idProveedor !== null
      && this.filtros.idCartera !== null
      && this.filtros.idSubcartera !== null;
  }

  private construirFiltros(): FiltrosReporteProduccion {
    return {
      fecha: this.filtros.fecha || undefined,
      idTenant: this.filtros.idProveedor ?? undefined,
      idCartera: this.filtros.idCartera ?? undefined,
      idSubcartera: this.filtros.idSubcartera ?? undefined,
      tipoMeta: this.filtros.tipoMeta
    };
  }

  irAHistorico(): void {
    if (!this.contextoSeleccionado()) return;
    this.router.navigate(['/reports/produccion/historico'], {
      queryParams: {
        idTenant: this.filtros.idProveedor,
        idCartera: this.filtros.idCartera,
        idSubcartera: this.filtros.idSubcartera,
        tipoMeta: this.filtros.tipoMeta
      }
    });
  }

  private cargarTodasLasCarteras(): void {
    const solicitudes = this.proveedores().map(proveedor => this.comisionesService.obtenerCarteras(proveedor.id));
    if (solicitudes.length) forkJoin(solicitudes).subscribe({ next: grupos => this.carteras.set(grupos.flat()) });
  }

  private cargarTodasLasSubcarteras(): void {
    const solicitudes = this.carteras().map(cartera => this.comisionesService.obtenerSubcarteras(cartera.id));
    if (solicitudes.length) forkJoin(solicitudes).subscribe({ next: grupos => this.subcarteras.set(grupos.flat()) });
  }

  private limpiarResultados(): void {
    this.data.set([]);
    this.resumen.set(null);
    this.metas.set([]);
    this.paginaMetas.set(null);
  }

  getPuntosTextClass(puntaje: number): string {
    if (puntaje >= 100) return 'text-green-600 dark:text-green-400';
    if (puntaje >= 50) return 'text-amber-600 dark:text-amber-400';
    if (puntaje >= 25) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  }
}
