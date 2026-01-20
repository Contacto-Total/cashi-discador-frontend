import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import {
  ExcepcionesReportService,
  ReporteExcepcionDTO,
  ResumenMetricas,
  ReporteResponse
} from './excepciones-report.service';

@Component({
  selector: 'app-excepciones-report',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, DecimalPipe, DatePipe],
  template: `
    <div class="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
          <lucide-angular name="alert-triangle" [size]="28" class="text-amber-500"></lucide-angular>
          Reporte de Excepciones
        </h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1">
          Historial de promesas con montos personalizados y su estado de aprobacion
        </p>
      </div>

      <!-- Filtros -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
          <!-- Fecha Desde -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Desde</label>
            <input
              type="date"
              [(ngModel)]="filtroFechaDesde"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <!-- Fecha Hasta -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hasta</label>
            <input
              type="date"
              [(ngModel)]="filtroFechaHasta"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <!-- Estado -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Estado</label>
            <select
              [(ngModel)]="filtroEstado"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Todos</option>
              <option value="EN_EVALUACION">Pendientes</option>
              <option value="PENDIENTE">Aprobadas</option>
              <option value="CANCELADA">Rechazadas</option>
            </select>
          </div>

          <!-- Botones -->
          <div class="flex items-end gap-2">
            <button
              (click)="buscar()"
              [disabled]="cargando()"
              class="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <lucide-angular name="search" [size]="18"></lucide-angular>
              Buscar
            </button>
          </div>

          <div class="flex items-end gap-2">
            <button
              (click)="exportarExcel()"
              [disabled]="cargando() || data().length === 0"
              class="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <lucide-angular name="download" [size]="18"></lucide-angular>
              Excel
            </button>
          </div>
        </div>
      </div>

      <!-- Metricas -->
      @if (metricas()) {
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
          <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <div class="text-sm text-gray-500 dark:text-gray-400">Total Excepciones</div>
            <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ metricas()!.totalExcepciones }}</div>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border-l-4 border-amber-500">
            <div class="text-sm text-gray-500 dark:text-gray-400">Pendientes</div>
            <div class="text-2xl font-bold text-amber-600">{{ metricas()!.excepcionesPendientes }}</div>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border-l-4 border-green-500">
            <div class="text-sm text-gray-500 dark:text-gray-400">Aprobadas</div>
            <div class="text-2xl font-bold text-green-600">{{ metricas()!.excepcionesAprobadas }}</div>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border-l-4 border-red-500">
            <div class="text-sm text-gray-500 dark:text-gray-400">Rechazadas</div>
            <div class="text-2xl font-bold text-red-600">{{ metricas()!.excepcionesRechazadas }}</div>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <div class="text-sm text-gray-500 dark:text-gray-400">Monto Total Solicitado</div>
            <div class="text-xl font-bold text-gray-900 dark:text-white">{{ formatCurrency(metricas()!.montoTotalSolicitado) }}</div>
          </div>
        </div>
      }

      <!-- Loading -->
      @if (cargando()) {
        <div class="flex justify-center items-center py-12">
          <lucide-angular name="loader" [size]="40" class="animate-spin text-blue-600"></lucide-angular>
          <span class="ml-3 text-gray-600 dark:text-gray-400">Cargando reporte...</span>
        </div>
      } @else if (data().length === 0) {
        <div class="bg-white dark:bg-gray-800 rounded-xl p-12 text-center shadow-sm">
          <lucide-angular name="file-search" [size]="64" class="mx-auto text-gray-400 mb-4"></lucide-angular>
          <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Sin resultados</h3>
          <p class="text-gray-500 dark:text-gray-400">Ajusta los filtros y haz clic en Buscar</p>
        </div>
      } @else {
        <!-- Tabla -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th class="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">Cliente</th>
                  <th class="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">Asesor</th>
                  <th class="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">Cartera</th>
                  <th class="px-4 py-3 text-right font-semibold text-gray-600 dark:text-gray-300">Monto Base</th>
                  <th class="px-4 py-3 text-right font-semibold text-gray-600 dark:text-gray-300">Solicitado</th>
                  <th class="px-4 py-3 text-right font-semibold text-gray-600 dark:text-gray-300">Diferencia</th>
                  <th class="px-4 py-3 text-center font-semibold text-gray-600 dark:text-gray-300">Cuotas</th>
                  <th class="px-4 py-3 text-center font-semibold text-gray-600 dark:text-gray-300">Fecha</th>
                  <th class="px-4 py-3 text-center font-semibold text-gray-600 dark:text-gray-300">Estado</th>
                  <th class="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">Aprobador</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                @for (item of data(); track item.id) {
                  <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td class="px-4 py-3">
                      <div class="font-medium text-gray-900 dark:text-white">{{ item.nombreCliente }}</div>
                      <div class="text-xs text-gray-500">{{ item.documentoCliente }}</div>
                    </td>
                    <td class="px-4 py-3 text-gray-700 dark:text-gray-300">{{ item.nombreAgente }}</td>
                    <td class="px-4 py-3">
                      <div class="text-gray-700 dark:text-gray-300">{{ item.nombreCartera }}</div>
                      <div class="text-xs text-gray-500">{{ item.nombreSubcartera }}</div>
                    </td>
                    <td class="px-4 py-3 text-right text-gray-600 dark:text-gray-400">
                      {{ item.montoBase ? formatCurrency(item.montoBase) : 'Libre' }}
                    </td>
                    <td class="px-4 py-3 text-right font-bold text-amber-600">
                      {{ formatCurrency(item.montoPromesa) }}
                    </td>
                    <td class="px-4 py-3 text-right" [class]="item.diferencia > 0 ? 'text-green-600' : 'text-red-600'">
                      {{ item.diferencia > 0 ? '+' : '' }}{{ formatCurrency(item.diferencia) }}
                    </td>
                    <td class="px-4 py-3 text-center text-gray-700 dark:text-gray-300">{{ item.totalCuotas }}</td>
                    <td class="px-4 py-3 text-center text-gray-700 dark:text-gray-300">{{ formatDate(item.fechaGestion) }}</td>
                    <td class="px-4 py-3 text-center">
                      <span [class]="getEstadoClass(item.estadoPago, item.motivoRechazo)" class="px-2 py-1 rounded-full text-xs font-medium">
                        {{ getEstadoLabel(item.estadoPago, item.motivoRechazo) }}
                      </span>
                    </td>
                    <td class="px-4 py-3">
                      @if (item.nombreAprobador) {
                        <div class="text-gray-700 dark:text-gray-300">{{ item.nombreAprobador }}</div>
                        @if (item.motivoRechazo) {
                          <div class="text-xs text-red-500 truncate max-w-[150px]" [title]="item.motivoRechazo">
                            {{ item.motivoRechazo }}
                          </div>
                        }
                      } @else {
                        <span class="text-gray-400">-</span>
                      }
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <!-- Paginacion simple -->
          <div class="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <span class="text-sm text-gray-500">{{ data().length }} registros encontrados</span>
          </div>
        </div>
      }
    </div>
  `
})
export class ExcepcionesReportComponent implements OnInit {
  // Filtros
  filtroFechaDesde = '';
  filtroFechaHasta = '';
  filtroEstado = '';

  // Estado
  cargando = signal(false);
  data = signal<ReporteExcepcionDTO[]>([]);
  metricas = signal<ResumenMetricas | null>(null);

  constructor(private reporteService: ExcepcionesReportService) {}

  ngOnInit(): void {
    // Establecer fechas por defecto (ultimo mes)
    const hoy = new Date();
    const hace30Dias = new Date();
    hace30Dias.setDate(hace30Dias.getDate() - 30);

    this.filtroFechaDesde = hace30Dias.toISOString().split('T')[0];
    this.filtroFechaHasta = hoy.toISOString().split('T')[0];

    this.buscar();
  }

  buscar(): void {
    this.cargando.set(true);
    this.reporteService.getReporte(
      this.filtroFechaDesde || undefined,
      this.filtroFechaHasta || undefined,
      undefined,
      undefined,
      this.filtroEstado || undefined
    ).subscribe({
      next: (response) => {
        this.data.set(response.data);
        this.metricas.set(response.metricas);
        this.cargando.set(false);
      },
      error: (error) => {
        console.error('Error cargando reporte:', error);
        this.cargando.set(false);
        alert('Error al cargar el reporte');
      }
    });
  }

  exportarExcel(): void {
    this.cargando.set(true);
    this.reporteService.exportarExcel(
      this.filtroFechaDesde || undefined,
      this.filtroFechaHasta || undefined,
      undefined,
      undefined,
      this.filtroEstado || undefined
    ).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Reporte_Excepciones_${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        this.cargando.set(false);
      },
      error: (error) => {
        console.error('Error exportando Excel:', error);
        this.cargando.set(false);
        alert('Error al exportar el reporte');
      }
    });
  }

  getEstadoClass(estado: string, motivoRechazo: string | null): string {
    if (estado === 'EN_EVALUACION') {
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
    }
    if (estado === 'CANCELADA' || motivoRechazo) {
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    }
    return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
  }

  getEstadoLabel(estado: string, motivoRechazo: string | null): string {
    if (estado === 'EN_EVALUACION') {
      return 'Pendiente';
    }
    if (estado === 'CANCELADA' || motivoRechazo) {
      return 'Rechazada';
    }
    return 'Aprobada';
  }

  formatCurrency(value: number | null): string {
    if (value === null || value === undefined) return '-';
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(value);
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}
