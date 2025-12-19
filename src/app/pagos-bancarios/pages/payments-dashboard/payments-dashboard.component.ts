import { Component, OnInit, OnDestroy, signal, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartConfiguration, ChartData, DoughnutController, ArcElement, Tooltip, Legend, BarController, BarElement, CategoryScale, LinearScale, LineController, LineElement, PointElement } from 'chart.js';
import { interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { PaymentsDashboardService, PaymentsDashboard } from '../../services/payments-dashboard.service';
import { ThemeService } from '../../../shared/services/theme.service';

// Registrar componentes de Chart.js
Chart.register(
  DoughnutController, ArcElement,
  BarController, BarElement,
  LineController, LineElement, PointElement,
  CategoryScale, LinearScale,
  Tooltip, Legend
);

@Component({
  selector: 'app-payments-dashboard',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, BaseChartDirective],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-slate-900 p-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
          <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <lucide-angular name="bar-chart-3" [size]="24" class="text-white"></lucide-angular>
          </div>
          Dashboard de Pagos y Conciliación
        </h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1">Métricas consolidadas de pagos bancarios, agentes y promesas</p>
      </div>

      @if (loading()) {
        <div class="flex items-center justify-center h-64">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      } @else if (error()) {
        <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-300">
          {{ error() }}
        </div>
      } @else {
        <!-- KPI Cards Row 1 - Resumen General -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <!-- Total Pagos Banco -->
          <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-5">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Pagos Banco</p>
                <p class="text-2xl font-bold text-gray-800 dark:text-white">{{ dashboard()?.totalPagosBanco | number }}</p>
                <p class="text-sm text-blue-600 dark:text-blue-400 font-medium">{{ formatCurrency(dashboard()?.montoTotalBanco) }}</p>
              </div>
              <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <lucide-angular name="building-2" [size]="24" class="text-blue-600 dark:text-blue-400"></lucide-angular>
              </div>
            </div>
          </div>

          <!-- Pagos Conciliados -->
          <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-5">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Conciliados</p>
                <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ dashboard()?.pagosConciliados | number }}</p>
                <p class="text-sm text-green-600 dark:text-green-400 font-medium">{{ formatCurrency(dashboard()?.montoConciliado) }}</p>
              </div>
              <div class="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <lucide-angular name="check-circle" [size]="24" class="text-green-600 dark:text-green-400"></lucide-angular>
              </div>
            </div>
          </div>

          <!-- Pagos Por Fuera (Voluntarios) -->
          <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-5">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Pagos Voluntarios</p>
                <p class="text-2xl font-bold text-amber-600 dark:text-amber-400">{{ dashboard()?.pagosPorFuera | number }}</p>
                <p class="text-sm text-amber-600 dark:text-amber-400 font-medium">{{ formatCurrency(dashboard()?.montoPorFuera) }}</p>
              </div>
              <div class="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                <lucide-angular name="user-check" [size]="24" class="text-amber-600 dark:text-amber-400"></lucide-angular>
              </div>
            </div>
          </div>

          <!-- Pagos No Verificados -->
          <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-5">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Sin Verificar</p>
                <p class="text-2xl font-bold text-red-600 dark:text-red-400">{{ dashboard()?.pagosNoVerificados | number }}</p>
                <p class="text-sm text-red-600 dark:text-red-400 font-medium">{{ formatCurrency(dashboard()?.montoNoVerificado) }}</p>
              </div>
              <div class="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <lucide-angular name="alert-triangle" [size]="24" class="text-red-600 dark:text-red-400"></lucide-angular>
              </div>
            </div>
          </div>
        </div>

        <!-- KPI Cards Row 2 - Promesas -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <!-- Total Promesas -->
          <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-5">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Total Promesas</p>
                <p class="text-2xl font-bold text-gray-800 dark:text-white">{{ dashboard()?.totalPromesas | number }}</p>
                <p class="text-sm text-indigo-600 dark:text-indigo-400 font-medium">{{ formatCurrency(dashboard()?.montoPrometido) }}</p>
              </div>
              <div class="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                <lucide-angular name="handshake" [size]="24" class="text-indigo-600 dark:text-indigo-400"></lucide-angular>
              </div>
            </div>
          </div>

          <!-- Promesas Cumplidas -->
          <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-5">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Cumplidas</p>
                <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ dashboard()?.promesasCumplidas | number }}</p>
              </div>
              <div class="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <lucide-angular name="badge-check" [size]="24" class="text-green-600 dark:text-green-400"></lucide-angular>
              </div>
            </div>
          </div>

          <!-- Promesas Vencidas -->
          <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-5">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Vencidas</p>
                <p class="text-2xl font-bold text-red-600 dark:text-red-400">{{ dashboard()?.promesasVencidas | number }}</p>
              </div>
              <div class="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <lucide-angular name="clock" [size]="24" class="text-red-600 dark:text-red-400"></lucide-angular>
              </div>
            </div>
          </div>

          <!-- Tasa de Cumplimiento -->
          <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-5">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Tasa Cumplimiento</p>
                <p class="text-2xl font-bold" [class]="getTasaClass(dashboard()?.tasaCumplimiento || 0)">
                  {{ dashboard()?.tasaCumplimiento | number:'1.1-1' }}%
                </p>
              </div>
              <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                <lucide-angular name="trending-up" [size]="24" class="text-purple-600 dark:text-purple-400"></lucide-angular>
              </div>
            </div>
          </div>
        </div>

        <!-- Charts Row -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <!-- Gráfico Dona - Estado de Conciliación -->
          <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-5">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <lucide-angular name="pie-chart" [size]="20" class="text-blue-500"></lucide-angular>
              Estado de Conciliación
            </h3>
            <div class="h-64 flex items-center justify-center">
              @if (chartKey()) {
                <canvas baseChart
                  [type]="'doughnut'"
                  [data]="conciliacionChartData"
                  [options]="doughnutChartOptions()">
                </canvas>
              }
            </div>
            <!-- Leyenda personalizada -->
            <div class="mt-4 flex flex-wrap justify-center gap-4">
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full bg-green-500"></div>
                <span class="text-sm text-gray-600 dark:text-gray-400">Conciliados</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full bg-amber-500"></div>
                <span class="text-sm text-gray-600 dark:text-gray-400">Voluntarios</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full bg-red-500"></div>
                <span class="text-sm text-gray-600 dark:text-gray-400">Sin Verificar</span>
              </div>
            </div>
          </div>

          <!-- Gráfico Dona - Estado de Promesas -->
          <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-5">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <lucide-angular name="target" [size]="20" class="text-indigo-500"></lucide-angular>
              Estado de Promesas
            </h3>
            <div class="h-64 flex items-center justify-center">
              @if (chartKey()) {
                <canvas baseChart
                  [type]="'doughnut'"
                  [data]="promesasChartData"
                  [options]="doughnutChartOptions()">
                </canvas>
              }
            </div>
            <!-- Leyenda personalizada -->
            <div class="mt-4 flex flex-wrap justify-center gap-4">
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full bg-green-500"></div>
                <span class="text-sm text-gray-600 dark:text-gray-400">Cumplidas</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full bg-blue-500"></div>
                <span class="text-sm text-gray-600 dark:text-gray-400">Pendientes</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full bg-red-500"></div>
                <span class="text-sm text-gray-600 dark:text-gray-400">Vencidas</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Tendencia y Top Agentes Row -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <!-- Gráfico Línea - Tendencia Diaria -->
          <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-5">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <lucide-angular name="trending-up" [size]="20" class="text-green-500"></lucide-angular>
              Tendencia de Pagos (Últimos 30 días)
            </h3>
            <div class="h-64">
              @if (chartKey()) {
                <canvas baseChart
                  [type]="'line'"
                  [data]="tendenciaChartData"
                  [options]="lineChartOptions()">
                </canvas>
              }
            </div>
          </div>

          <!-- Top Agentes -->
          <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-5">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <lucide-angular name="trophy" [size]="20" class="text-yellow-500"></lucide-angular>
              Top Agentes por Monto
            </h3>
            <div class="space-y-3 max-h-72 overflow-y-auto">
              @for (agente of dashboard()?.topAgentes; track agente.agenteId; let i = $index) {
                <div class="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-slate-700/50">
                  <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                       [class]="i === 0 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400' :
                                i === 1 ? 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300' :
                                i === 2 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400' :
                                'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400'">
                    {{ i + 1 }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-800 dark:text-white truncate">{{ agente.nombreAgente }}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      {{ agente.promesasRegistradas }} promesas · {{ agente.tasaCumplimiento | number:'1.0-0' }}% cumplimiento
                    </p>
                  </div>
                  <div class="text-right">
                    <p class="text-sm font-bold text-green-600 dark:text-green-400">{{ formatCurrency(agente.montoTotal) }}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">{{ agente.cantidadPagos }} pagos</p>
                  </div>
                </div>
              } @empty {
                <div class="text-center py-8 text-gray-500 dark:text-gray-400">
                  <lucide-angular name="users" [size]="32" class="mx-auto mb-2 opacity-50"></lucide-angular>
                  <p>No hay datos de agentes</p>
                </div>
              }
            </div>
          </div>
        </div>

        <!-- Distribución por Banco -->
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-5">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <lucide-angular name="landmark" [size]="20" class="text-blue-500"></lucide-angular>
            Distribución por Banco
          </h3>
          <div class="h-64">
            @if (chartKey()) {
              <canvas baseChart
                [type]="'bar'"
                [data]="bancosChartData"
                [options]="barChartOptions()">
              </canvas>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class PaymentsDashboardComponent implements OnInit, OnDestroy {

  dashboard = signal<PaymentsDashboard | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  private pollingSubscription?: Subscription;

  // Key que cambia cuando cambia el tema - fuerza recrear los gráficos
  chartKey = computed(() => {
    const isDark = this.themeService.isDarkMode();
    return isDark ? 'dark' : 'light';
  });

  // Opciones de gráficos computadas - se recalculan cuando cambia el tema
  doughnutChartOptions = computed<ChartConfiguration<'doughnut'>['options']>(() => {
    const isDark = this.themeService.isDarkMode();
    const textColor = isDark ? '#e2e8f0' : '#1f2937';
    const tooltipBg = isDark ? '#1e293b' : '#ffffff';
    const tooltipBorder = isDark ? '#334155' : '#d1d5db';

    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: tooltipBg,
          titleColor: textColor,
          bodyColor: textColor,
          borderColor: tooltipBorder,
          borderWidth: 1,
          callbacks: {
            label: (context) => {
              const value = context.parsed || 0;
              const total = (context.dataset.data as number[]).reduce((a, b) => a + b, 0);
              const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
              return `${context.label}: ${value} (${percentage}%)`;
            }
          }
        }
      }
    };
  });

  lineChartOptions = computed<ChartConfiguration<'line'>['options']>(() => {
    const isDark = this.themeService.isDarkMode();
    const textColor = isDark ? '#e2e8f0' : '#1f2937';
    const gridColor = isDark ? 'rgba(148, 163, 184, 0.2)' : 'rgba(107, 114, 128, 0.3)';
    const tooltipBg = isDark ? '#1e293b' : '#ffffff';
    const tooltipBorder = isDark ? '#334155' : '#d1d5db';

    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            color: textColor
          }
        },
        tooltip: {
          backgroundColor: tooltipBg,
          titleColor: textColor,
          bodyColor: textColor,
          borderColor: tooltipBorder,
          borderWidth: 1
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: gridColor
          },
          ticks: {
            color: textColor
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: textColor
          }
        }
      }
    };
  });

  barChartOptions = computed<ChartConfiguration<'bar'>['options']>(() => {
    const isDark = this.themeService.isDarkMode();
    const textColor = isDark ? '#e2e8f0' : '#1f2937';
    const gridColor = isDark ? 'rgba(148, 163, 184, 0.2)' : 'rgba(107, 114, 128, 0.3)';
    const tooltipBg = isDark ? '#1e293b' : '#ffffff';
    const tooltipBorder = isDark ? '#334155' : '#d1d5db';

    return {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: tooltipBg,
          titleColor: textColor,
          bodyColor: textColor,
          borderColor: tooltipBorder,
          borderWidth: 1
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          grid: {
            color: gridColor
          },
          ticks: {
            color: textColor
          }
        },
        y: {
          grid: {
            display: false
          },
          ticks: {
            color: textColor
          }
        }
      }
    };
  });

  // Datos de gráficos
  conciliacionChartData: ChartData<'doughnut'> = { labels: [], datasets: [] };
  promesasChartData: ChartData<'doughnut'> = { labels: [], datasets: [] };
  tendenciaChartData: ChartData<'line'> = { labels: [], datasets: [] };
  bancosChartData: ChartData<'bar'> = { labels: [], datasets: [] };

  constructor(
    private dashboardService: PaymentsDashboardService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
    this.startPolling();
  }

  ngOnDestroy(): void {
    this.pollingSubscription?.unsubscribe();
  }

  loadDashboard(): void {
    this.loading.set(true);
    this.error.set(null);

    this.dashboardService.getDashboard().subscribe({
      next: (data) => {
        this.dashboard.set(data);
        this.updateCharts(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('[DASHBOARD] Error cargando dashboard:', err);
        this.error.set('Error al cargar el dashboard. Intente nuevamente.');
        this.loading.set(false);
      }
    });
  }

  startPolling(): void {
    // Actualizar cada 60 segundos
    this.pollingSubscription = interval(60000).pipe(
      switchMap(() => this.dashboardService.getDashboard())
    ).subscribe({
      next: (data) => {
        this.dashboard.set(data);
        this.updateCharts(data);
      },
      error: (err) => console.error('[DASHBOARD] Error en polling:', err)
    });
  }

  updateCharts(data: PaymentsDashboard): void {
    // Gráfico de Conciliación
    this.conciliacionChartData = {
      labels: ['Conciliados', 'Voluntarios', 'Sin Verificar'],
      datasets: [{
        data: [data.pagosConciliados, data.pagosPorFuera, data.pagosNoVerificados],
        backgroundColor: ['#22c55e', '#f59e0b', '#ef4444'],
        borderWidth: 0
      }]
    };

    // Gráfico de Promesas
    this.promesasChartData = {
      labels: ['Cumplidas', 'Pendientes', 'Vencidas'],
      datasets: [{
        data: [data.promesasCumplidas, data.promesasPendientes, data.promesasVencidas],
        backgroundColor: ['#22c55e', '#3b82f6', '#ef4444'],
        borderWidth: 0
      }]
    };

    // Gráfico de Tendencia
    const tendencia = [...(data.tendenciaDiaria || [])].reverse().slice(-15);
    this.tendenciaChartData = {
      labels: tendencia.map(t => this.formatDate(t.fecha)),
      datasets: [
        {
          label: 'Banco',
          data: tendencia.map(t => t.cantidadBanco),
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4
        },
        {
          label: 'Agente',
          data: tendencia.map(t => t.cantidadAgente),
          borderColor: '#22c55e',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          fill: true,
          tension: 0.4
        }
      ]
    };

    // Gráfico de Bancos
    const bancos = data.distribucionBancos || [];
    this.bancosChartData = {
      labels: bancos.map(b => b.banco || 'OTRO'),
      datasets: [{
        data: bancos.map(b => b.monto),
        backgroundColor: ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef'],
        borderWidth: 0
      }]
    };
  }

  formatCurrency(value: number | null | undefined): string {
    if (value == null) return 'S/ 0.00';
    return 'S/ ' + value.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    // Formato dd/mm o dd/mm/yyyy
    const parts = dateStr.split(/[\/\-]/);
    if (parts.length >= 2) {
      return `${parts[0]}/${parts[1]}`;
    }
    return dateStr;
  }

  getTasaClass(tasa: number): string {
    if (tasa >= 70) return 'text-green-600 dark:text-green-400';
    if (tasa >= 40) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  }
}
