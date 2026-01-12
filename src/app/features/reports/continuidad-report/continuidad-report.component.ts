import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import {
  ContinuidadReportService,
  ReporteContinuidadDTO,
  ResumenMetricas,
  ReporteResponse
} from './continuidad-report.service';

@Component({
  selector: 'app-continuidad-report',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, DecimalPipe, DatePipe],
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

          <!-- Cartera -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Cartera
            </label>
            <input
              type="number"
              [(ngModel)]="filtros.idCartera"
              placeholder="ID Cartera"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>

          <!-- Subcartera -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Subcartera
            </label>
            <input
              type="number"
              [(ngModel)]="filtros.idSubcartera"
              placeholder="ID Subcartera"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
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

      <!-- Métricas -->
      @if (metricas()) {
        <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <!-- Total Continuidades -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                <lucide-angular name="refresh-cw" [size]="24" class="text-amber-600 dark:text-amber-400"></lucide-angular>
              </div>
              <div>
                <p class="text-2xl font-bold text-gray-800 dark:text-white">{{ metricas()!.totalContinuidades }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Total Continuidades</p>
              </div>
            </div>
          </div>

          <!-- Pendientes -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <lucide-angular name="clock" [size]="24" class="text-yellow-600 dark:text-yellow-400"></lucide-angular>
              </div>
              <div>
                <p class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{{ metricas()!.continuidadesPendientes }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Pendientes</p>
              </div>
            </div>
          </div>

          <!-- Pagadas -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <lucide-angular name="check-circle" [size]="24" class="text-green-600 dark:text-green-400"></lucide-angular>
              </div>
              <div>
                <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ metricas()!.continuidadesPagadas }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Pagadas</p>
              </div>
            </div>
          </div>

          <!-- Vencidas -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <lucide-angular name="x-circle" [size]="24" class="text-red-600 dark:text-red-400"></lucide-angular>
              </div>
              <div>
                <p class="text-2xl font-bold text-red-600 dark:text-red-400">{{ metricas()!.continuidadesVencidas }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Vencidas</p>
              </div>
            </div>
          </div>

          <!-- % Recuperación -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <lucide-angular name="trending-up" [size]="24" class="text-blue-600 dark:text-blue-400"></lucide-angular>
              </div>
              <div>
                <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {{ metricas()!.porcentajeRecuperacionPromedio | number:'1.1-1' }}%
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">% Recuperación Prom.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Montos Totales -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div class="bg-gradient-to-r from-gray-700 to-gray-800 rounded-xl shadow-md p-4 text-white">
            <p class="text-xs text-gray-300 uppercase">Monto Total Original</p>
            <p class="text-xl font-bold">S/ {{ metricas()!.montoTotalOriginal | number:'1.2-2' }}</p>
          </div>
          <div class="bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl shadow-md p-4 text-white">
            <p class="text-xs text-amber-100 uppercase">Pagado Previo</p>
            <p class="text-xl font-bold">S/ {{ metricas()!.montoTotalPagadoPrevio | number:'1.2-2' }}</p>
          </div>
          <div class="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-md p-4 text-white">
            <p class="text-xs text-green-100 uppercase">Pagado en Continuidad</p>
            <p class="text-xl font-bold">S/ {{ metricas()!.montoTotalPagadoContinuidad | number:'1.2-2' }}</p>
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
                <th class="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">ID Cont.</th>
                <th class="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">ID Orig.</th>
                <th class="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Documento</th>
                <th class="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Cliente</th>
                <th class="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Cartera</th>
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
                  <td colspan="14" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    <lucide-angular name="loader-2" [size]="32" class="animate-spin mx-auto mb-2"></lucide-angular>
                    <p>Cargando datos...</p>
                  </td>
                </tr>
              } @else if (data().length === 0) {
                <tr>
                  <td colspan="14" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
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
                    <td class="px-3 py-2 text-right text-gray-900 dark:text-white">S/ {{ item.montoOriginalPromesa | number:'1.2-2' }}</td>
                    <td class="px-3 py-2 text-right text-amber-600 dark:text-amber-400">S/ {{ item.montoPagadoPrevio | number:'1.2-2' }}</td>
                    <td class="px-3 py-2 text-center text-gray-600 dark:text-gray-400 text-xs">{{ item.fechaContinuidad | date:'dd/MM/yy' }}</td>
                    <td class="px-3 py-2 text-gray-600 dark:text-gray-400 text-xs">{{ item.asesorContinuidad | slice:0:15 }}</td>
                    <td class="px-3 py-2 text-right text-gray-900 dark:text-white font-semibold">S/ {{ item.montoContinuidad | number:'1.2-2' }}</td>
                    <td class="px-3 py-2 text-center">
                      <span [class]="getEstadoClass(item.estadoContinuidad)">
                        {{ item.estadoContinuidad }}
                      </span>
                    </td>
                    <td class="px-3 py-2 text-right text-green-600 dark:text-green-400">S/ {{ item.pagadoEnContinuidad | number:'1.2-2' }}</td>
                    <td class="px-3 py-2 text-right text-red-600 dark:text-red-400">S/ {{ item.pendienteContinuidad | number:'1.2-2' }}</td>
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
                          {{ item.porcentajeAvance | number:'1.0-0' }}%
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
  `,
  styles: []
})
export class ContinuidadReportComponent implements OnInit {
  // Signals
  loading = signal(false);
  data = signal<ReporteContinuidadDTO[]>([]);
  metricas = signal<ResumenMetricas | null>(null);

  // Filtros
  filtros = {
    fechaDesde: '',
    fechaHasta: '',
    idCartera: null as number | null,
    idSubcartera: null as number | null
  };

  constructor(private reporteService: ContinuidadReportService) {}

  ngOnInit(): void {
    // Cargar datos iniciales sin filtros
    this.buscar();
  }

  buscar(): void {
    this.loading.set(true);

    this.reporteService.getReporte(
      this.filtros.fechaDesde || undefined,
      this.filtros.fechaHasta || undefined,
      this.filtros.idCartera || undefined,
      this.filtros.idSubcartera || undefined
    ).subscribe({
      next: (response) => {
        this.data.set(response.data);
        this.metricas.set(response.metricas);
        this.loading.set(false);
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
      this.filtros.idSubcartera || undefined
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
