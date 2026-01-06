import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { Subscription } from 'rxjs';
import { Chart, registerables } from 'chart.js';
import {
  ReportService,
  AgentProductivityResponse,
  ProductivitySummary,
  AgentMetrics,
  ChartData
} from '../../../core/services/report.service';
import { TenantService } from '../../../maintenance/services/tenant.service';
import { PortfolioService } from '../../../maintenance/services/portfolio.service';
import { Tenant } from '../../../maintenance/models/tenant.model';
import { Portfolio, SubPortfolio } from '../../../maintenance/models/portfolio.model';

Chart.register(...registerables);

type PeriodType = 'today' | 'week' | 'month' | 'lastMonth' | 'year' | 'custom';

@Component({
  selector: 'app-agent-productivity',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './agent-productivity.component.html',
  styleUrls: ['./agent-productivity.component.css']
})
export class AgentProductivityComponent implements OnInit, OnDestroy, AfterViewInit {
  // Filtros
  tenants: Tenant[] = [];
  portfolios: Portfolio[] = [];
  subPortfolios: SubPortfolio[] = [];

  selectedTenantId: number | null = null;
  selectedCarteraId: number | null = null;
  selectedSubcarteraId: number | null = null;
  selectedPeriod: PeriodType = 'today';
  customDateFrom: string = '';
  customDateTo: string = '';

  // Estado
  loading = false;
  error: string | null = null;

  // Datos
  productivityData: AgentProductivityResponse | null = null;

  // Charts
  @ViewChild('barChart') barChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('lineChart') lineChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('doughnutChart') doughnutChartRef!: ElementRef<HTMLCanvasElement>;

  private barChart: Chart | null = null;
  private lineChart: Chart | null = null;
  private doughnutChart: Chart | null = null;

  private subscriptions: Subscription[] = [];

  constructor(
    private reportService: ReportService,
    private tenantService: TenantService,
    private portfolioService: PortfolioService
  ) {}

  ngOnInit(): void {
    this.loadTenants();
    this.setDefaultDates();
    this.loadData();
  }

  ngAfterViewInit(): void {
    // Los gráficos se inicializan después de cargar datos
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.destroyCharts();
  }

  private setDefaultDates(): void {
    const today = new Date();
    this.customDateTo = this.formatDate(today);
    this.customDateFrom = this.formatDate(today);
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private getDateRange(): { fechaInicio: string; fechaFin: string } {
    const today = new Date();
    let fechaInicio: Date;
    let fechaFin: Date = today;

    switch (this.selectedPeriod) {
      case 'today':
        fechaInicio = today;
        break;
      case 'week':
        fechaInicio = new Date(today);
        fechaInicio.setDate(today.getDate() - 7);
        break;
      case 'month':
        fechaInicio = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      case 'lastMonth':
        fechaInicio = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        fechaFin = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      case 'year':
        fechaInicio = new Date(today.getFullYear(), 0, 1);
        break;
      case 'custom':
        return { fechaInicio: this.customDateFrom, fechaFin: this.customDateTo };
      default:
        fechaInicio = today;
    }

    return {
      fechaInicio: this.formatDate(fechaInicio),
      fechaFin: this.formatDate(fechaFin)
    };
  }

  loadTenants(): void {
    this.tenantService.getAllTenants().subscribe({
      next: (tenants) => {
        this.tenants = tenants;
      },
      error: (err) => {
        console.error('Error loading tenants:', err);
      }
    });
  }

  onTenantChange(): void {
    this.portfolios = [];
    this.subPortfolios = [];
    this.selectedCarteraId = null;
    this.selectedSubcarteraId = null;

    if (this.selectedTenantId) {
      this.portfolioService.getPortfoliosByTenant(this.selectedTenantId).subscribe({
        next: (portfolios) => {
          this.portfolios = portfolios;
        },
        error: (err) => {
          console.error('Error loading portfolios:', err);
        }
      });
    }
  }

  onCarteraChange(): void {
    this.subPortfolios = [];
    this.selectedSubcarteraId = null;

    if (this.selectedCarteraId) {
      this.portfolioService.getActiveSubPortfoliosByPortfolio(this.selectedCarteraId).subscribe({
        next: (subPortfolios) => {
          this.subPortfolios = subPortfolios;
        },
        error: (err) => {
          console.error('Error loading subportfolios:', err);
        }
      });
    }
  }

  onPeriodChange(): void {
    if (this.selectedPeriod !== 'custom') {
      this.loadData();
    }
  }

  loadData(): void {
    this.loading = true;
    this.error = null;

    const { fechaInicio, fechaFin } = this.getDateRange();

    this.reportService.getAgentProductivity(
      fechaInicio,
      fechaFin,
      this.selectedTenantId || undefined,
      this.selectedCarteraId || undefined,
      this.selectedSubcarteraId || undefined
    ).subscribe({
      next: (data) => {
        this.productivityData = data;
        this.loading = false;
        setTimeout(() => this.initCharts(), 100);
      },
      error: (err) => {
        console.error('Error loading productivity data:', err);
        this.error = 'Error al cargar los datos de productividad';
        this.loading = false;
      }
    });
  }

  private destroyCharts(): void {
    if (this.barChart) {
      this.barChart.destroy();
      this.barChart = null;
    }
    if (this.lineChart) {
      this.lineChart.destroy();
      this.lineChart = null;
    }
    if (this.doughnutChart) {
      this.doughnutChart.destroy();
      this.doughnutChart = null;
    }
  }

  private initCharts(): void {
    this.destroyCharts();

    if (!this.productivityData?.chartData) return;

    this.initBarChart();
    this.initLineChart();
    this.initDoughnutChart();
  }

  private initBarChart(): void {
    if (!this.barChartRef?.nativeElement || !this.productivityData?.chartData.topAgentesPorPromesas) return;

    const data = this.productivityData.chartData.topAgentesPorPromesas;
    const isDark = document.body.classList.contains('dark-theme');

    this.barChart = new Chart(this.barChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: data.map(d => this.truncateName(d.nombre)),
        datasets: [{
          label: 'Promesas',
          data: data.map(d => d.cantidad),
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          borderColor: 'rgb(59, 130, 246)',
          borderWidth: 1,
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const agent = data[ctx.dataIndex];
                return [`Promesas: ${agent.cantidad}`, `Monto: S/ ${agent.monto.toLocaleString()}`];
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: isDark ? '#94a3b8' : '#64748b'
            },
            grid: {
              color: isDark ? 'rgba(148, 163, 184, 0.1)' : 'rgba(0, 0, 0, 0.1)'
            }
          },
          x: {
            ticks: {
              color: isDark ? '#94a3b8' : '#64748b',
              maxRotation: 45,
              minRotation: 45
            },
            grid: {
              display: false
            }
          }
        }
      }
    });
  }

  private initLineChart(): void {
    if (!this.lineChartRef?.nativeElement || !this.productivityData?.chartData.promesasPorDia) return;

    const data = this.productivityData.chartData.promesasPorDia;
    const isDark = document.body.classList.contains('dark-theme');

    this.lineChart = new Chart(this.lineChartRef.nativeElement, {
      type: 'line',
      data: {
        labels: data.map(d => this.formatChartDate(d.fecha)),
        datasets: [{
          label: 'Promesas',
          data: data.map(d => d.cantidad),
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: true,
          tension: 0.3,
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const item = data[ctx.dataIndex];
                return [`Promesas: ${item.cantidad}`, `Monto: S/ ${item.monto.toLocaleString()}`];
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: isDark ? '#94a3b8' : '#64748b'
            },
            grid: {
              color: isDark ? 'rgba(148, 163, 184, 0.1)' : 'rgba(0, 0, 0, 0.1)'
            }
          },
          x: {
            ticks: {
              color: isDark ? '#94a3b8' : '#64748b'
            },
            grid: {
              display: false
            }
          }
        }
      }
    });
  }

  private initDoughnutChart(): void {
    if (!this.doughnutChartRef?.nativeElement || !this.productivityData?.chartData.tipificacionesDistribucion) return;

    const data = this.productivityData.chartData.tipificacionesDistribucion;
    const labels = Object.keys(data);
    const values = Object.values(data);
    const isDark = document.body.classList.contains('dark-theme');

    const colors = [
      'rgba(59, 130, 246, 0.8)',
      'rgba(16, 185, 129, 0.8)',
      'rgba(245, 158, 11, 0.8)',
      'rgba(239, 68, 68, 0.8)',
      'rgba(139, 92, 246, 0.8)',
      'rgba(236, 72, 153, 0.8)',
      'rgba(20, 184, 166, 0.8)',
      'rgba(251, 146, 60, 0.8)'
    ];

    this.doughnutChart = new Chart(this.doughnutChartRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels: labels.map(l => this.truncateName(l, 20)),
        datasets: [{
          data: values,
          backgroundColor: colors.slice(0, labels.length),
          borderWidth: 2,
          borderColor: isDark ? '#1e293b' : '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              color: isDark ? '#e2e8f0' : '#334155',
              padding: 12,
              usePointStyle: true,
              pointStyle: 'circle'
            }
          }
        }
      }
    });
  }

  private truncateName(name: string, maxLength: number = 15): string {
    if (!name) return '';
    return name.length > maxLength ? name.substring(0, maxLength) + '...' : name;
  }

  private formatChartDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-PE', { day: '2-digit', month: 'short' });
  }

  // Helpers para template
  get summary(): ProductivitySummary | null {
    return this.productivityData?.summary || null;
  }

  get agents(): AgentMetrics[] {
    return this.productivityData?.agents || [];
  }

  formatMoney(value: number): string {
    return value?.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00';
  }

  formatPercent(value: number | undefined): string {
    if (value === undefined || value === null) return '0%';
    const sign = value > 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  }

  getTrendIcon(trend: string): string {
    switch (trend) {
      case 'up': return 'trending-up';
      case 'down': return 'trending-down';
      default: return 'minus';
    }
  }

  getTrendClass(trend: string): string {
    switch (trend) {
      case 'up': return 'trend-up';
      case 'down': return 'trend-down';
      default: return 'trend-stable';
    }
  }

  getChangeClass(value: number | undefined): string {
    if (!value) return '';
    return value > 0 ? 'change-positive' : value < 0 ? 'change-negative' : '';
  }

  getPeriodLabel(): string {
    switch (this.selectedPeriod) {
      case 'today': return 'Hoy';
      case 'week': return 'Últimos 7 días';
      case 'month': return 'Este mes';
      case 'lastMonth': return 'Mes anterior';
      case 'year': return 'Este año';
      case 'custom': return 'Personalizado';
      default: return '';
    }
  }
}
