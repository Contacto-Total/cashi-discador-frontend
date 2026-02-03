import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import {
  HistorialLlamadasReportService,
  HistorialLlamadaDTO,
  ResumenMetricas,
  ReporteResponse
} from './historial-llamadas-report.service';

@Component({
  selector: 'app-historial-llamadas-report',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, DecimalPipe, DatePipe],
  template: `
    <div class="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
          <lucide-angular name="phone-call" [size]="28" class="text-blue-500"></lucide-angular>
          Historial de Llamadas
        </h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1">
          Detalle de llamadas con transiciones de estado y métricas de rendimiento
        </p>
      </div>

      <!-- Filtros -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-6 gap-4">
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
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <!-- Campaña -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Campaña
            </label>
            <input
              type="number"
              [(ngModel)]="filtros.idCampana"
              placeholder="ID Campaña"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <!-- Estado Final -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Estado Final
            </label>
            <select
              [(ngModel)]="filtros.estadoFinal"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos</option>
              <option value="CONNECTED">Conectada</option>
              <option value="NO_ANSWER">No Contestó</option>
              <option value="FAILED">Fallida</option>
              <option value="ABANDONED">Abandonada</option>
              <option value="BUSY">Ocupado</option>
            </select>
          </div>

          <!-- Botones -->
          <div class="flex items-end gap-2">
            <button
              (click)="buscar()"
              [disabled]="loading()"
              class="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold
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
          <!-- Total Llamadas -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <lucide-angular name="phone" [size]="24" class="text-blue-600 dark:text-blue-400"></lucide-angular>
              </div>
              <div>
                <p class="text-2xl font-bold text-gray-800 dark:text-white">{{ metricas()!.totalLlamadas }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Total Llamadas</p>
              </div>
            </div>
          </div>

          <!-- Conectadas -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <lucide-angular name="phone-incoming" [size]="24" class="text-green-600 dark:text-green-400"></lucide-angular>
              </div>
              <div>
                <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ metricas()!.llamadasConectadas }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Conectadas</p>
              </div>
            </div>
          </div>

          <!-- No Contestadas -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <lucide-angular name="phone-missed" [size]="24" class="text-yellow-600 dark:text-yellow-400"></lucide-angular>
              </div>
              <div>
                <p class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{{ metricas()!.llamadasNoContestadas }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">No Contestadas</p>
              </div>
            </div>
          </div>

          <!-- Fallidas -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <lucide-angular name="phone-off" [size]="24" class="text-red-600 dark:text-red-400"></lucide-angular>
              </div>
              <div>
                <p class="text-2xl font-bold text-red-600 dark:text-red-400">{{ metricas()!.llamadasFallidas }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Fallidas</p>
              </div>
            </div>
          </div>

          <!-- Duración Promedio -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <lucide-angular name="clock" [size]="24" class="text-purple-600 dark:text-purple-400"></lucide-angular>
              </div>
              <div>
                <p class="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {{ formatDuration(metricas()!.duracionPromedioSegundos) }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Duración Prom.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Métricas secundarias -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div class="bg-gradient-to-r from-gray-700 to-gray-800 rounded-xl shadow-md p-4 text-white">
            <p class="text-xs text-gray-300 uppercase">Total Transiciones</p>
            <p class="text-xl font-bold">{{ metricas()!.totalTransiciones }}</p>
          </div>
          <div class="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-md p-4 text-white">
            <p class="text-xs text-orange-100 uppercase">Abandonadas</p>
            <p class="text-xl font-bold">{{ metricas()!.llamadasAbandonadas }}</p>
          </div>
          <div class="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl shadow-md p-4 text-white">
            <p class="text-xs text-indigo-100 uppercase">Tiempo Prom. en Cola</p>
            <p class="text-xl font-bold">{{ formatMillis(metricas()!.tiempoPromedioEnColaMs) }}</p>
          </div>
          <div class="bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-xl shadow-md p-4 text-white">
            <p class="text-xs text-cyan-100 uppercase">Tiempo Prom. Marcando</p>
            <p class="text-xl font-bold">{{ formatMillis(metricas()!.tiempoPromedioMarcandoMs) }}</p>
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
                <th class="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Fecha/Hora</th>
                <th class="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Agente</th>
                <th class="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Cliente</th>
                <th class="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Teléfono</th>
                <th class="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Campaña</th>
                <th class="px-3 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Duración</th>
                <th class="px-3 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Resultado</th>
                <th class="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Transición</th>
                <th class="px-3 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Tiempo Estado</th>
                <th class="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Detalle</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              @if (loading()) {
                <tr>
                  <td colspan="11" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    <lucide-angular name="loader-2" [size]="32" class="animate-spin mx-auto mb-2"></lucide-angular>
                    <p>Cargando historial...</p>
                  </td>
                </tr>
              } @else if (data().length === 0) {
                <tr>
                  <td colspan="11" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    <lucide-angular name="phone-off" [size]="48" class="mx-auto mb-2 text-gray-400"></lucide-angular>
                    <p>No hay registros de llamadas</p>
                    <p class="text-xs mt-1">Aplica los filtros y presiona "Buscar"</p>
                  </td>
                </tr>
              } @else {
                @for (item of data(); track item.idHistorial || item.idLlamada) {
                  <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td class="px-3 py-2 text-gray-900 dark:text-white font-medium">{{ item.idLlamada }}</td>
                    <td class="px-3 py-2 text-gray-600 dark:text-gray-400 text-xs">
                      {{ item.fechaInicioLlamada | date:'dd/MM/yy HH:mm' }}
                    </td>
                    <td class="px-3 py-2 text-gray-900 dark:text-white">
                      <div class="flex items-center gap-2">
                        <span class="text-xs text-gray-500">{{ item.anexoAgente }}</span>
                        <span>{{ item.nombreAgente | slice:0:15 }}</span>
                      </div>
                    </td>
                    <td class="px-3 py-2">
                      <div>
                        <p class="text-gray-900 dark:text-white text-xs">{{ item.nombreCliente | slice:0:20 }}</p>
                        <p class="text-gray-500 dark:text-gray-400 text-xs font-mono">{{ item.documentoCliente }}</p>
                      </div>
                    </td>
                    <td class="px-3 py-2 text-gray-600 dark:text-gray-400 font-mono text-xs">{{ item.telefonoContacto }}</td>
                    <td class="px-3 py-2 text-gray-600 dark:text-gray-400 text-xs">{{ item.nombreCampana | slice:0:15 }}</td>
                    <td class="px-3 py-2 text-center text-gray-900 dark:text-white font-semibold">
                      {{ formatDuration(item.duracionTotalSegundos) }}
                    </td>
                    <td class="px-3 py-2 text-center">
                      <span [class]="getResultadoClass(item.resultadoFinal)">
                        {{ getResultadoLabel(item.resultadoFinal) }}
                      </span>
                    </td>
                    <td class="px-3 py-2">
                      @if (item.estadoAnterior && item.estadoNuevo) {
                        <div class="flex items-center gap-1 text-xs">
                          <span class="px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300">
                            {{ item.estadoAnterior }}
                          </span>
                          <lucide-angular name="arrow-right" [size]="12" class="text-gray-400"></lucide-angular>
                          <span class="px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                            {{ item.estadoNuevo }}
                          </span>
                        </div>
                      } @else {
                        <span class="text-gray-400">-</span>
                      }
                    </td>
                    <td class="px-3 py-2 text-center text-gray-600 dark:text-gray-400 text-xs">
                      {{ item.duracionEstadoAnteriorFormato || '-' }}
                    </td>
                    <td class="px-3 py-2 text-gray-500 dark:text-gray-400 text-xs">
                      {{ item.detalle | slice:0:30 }}{{ item.detalle && item.detalle.length > 30 ? '...' : '' }}
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
              Mostrando <span class="font-semibold">{{ data().length }}</span> registros
            </p>
          </div>
        }
      </div>
    </div>
  `,
  styles: []
})
export class HistorialLlamadasReportComponent implements OnInit {
  loading = signal(false);
  data = signal<HistorialLlamadaDTO[]>([]);
  metricas = signal<ResumenMetricas | null>(null);

  filtros = {
    fechaDesde: '',
    fechaHasta: '',
    idCampana: null as number | null,
    idCartera: null as number | null,
    estadoFinal: ''
  };

  constructor(private reporteService: HistorialLlamadasReportService) {}

  ngOnInit(): void {
    // Establecer fecha por defecto (hoy)
    const hoy = new Date().toISOString().split('T')[0];
    this.filtros.fechaDesde = hoy;
    this.filtros.fechaHasta = hoy;
    this.buscar();
  }

  buscar(): void {
    this.loading.set(true);

    this.reporteService.getReporte(
      this.filtros.fechaDesde || undefined,
      this.filtros.fechaHasta || undefined,
      this.filtros.idCampana || undefined,
      this.filtros.idCartera || undefined,
      undefined,
      this.filtros.estadoFinal || undefined
    ).subscribe({
      next: (response) => {
        this.data.set(response.data);
        this.metricas.set(response.metricas);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error cargando reporte:', error);
        this.loading.set(false);
        alert('Error al cargar el historial de llamadas');
      }
    });
  }

  exportarExcel(): void {
    this.loading.set(true);

    this.reporteService.exportarExcel(
      this.filtros.fechaDesde || undefined,
      this.filtros.fechaHasta || undefined,
      this.filtros.idCampana || undefined,
      this.filtros.idCartera || undefined,
      undefined,
      this.filtros.estadoFinal || undefined
    ).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Historial_Llamadas_${new Date().toISOString().split('T')[0]}.xlsx`;
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

  formatDuration(seconds: number): string {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  formatMillis(ms: number): string {
    if (!ms) return '0s';
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  }

  getResultadoClass(resultado: string): string {
    const base = 'px-2 py-1 rounded-full text-xs font-semibold';
    switch (resultado) {
      case 'CONNECTED':
        return `${base} bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400`;
      case 'NO_ANSWER':
        return `${base} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400`;
      case 'FAILED':
      case 'BUSY':
        return `${base} bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400`;
      case 'ABANDONED':
        return `${base} bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400`;
      default:
        return `${base} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400`;
    }
  }

  getResultadoLabel(resultado: string): string {
    switch (resultado) {
      case 'CONNECTED': return 'Conectada';
      case 'NO_ANSWER': return 'No Contestó';
      case 'FAILED': return 'Fallida';
      case 'ABANDONED': return 'Abandonada';
      case 'BUSY': return 'Ocupado';
      default: return resultado || '-';
    }
  }
}
