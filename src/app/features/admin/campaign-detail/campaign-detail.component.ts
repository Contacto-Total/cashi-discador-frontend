import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { LucideAngularModule } from 'lucide-angular';
import { CampaignAdminService, CampaignStatistics, CampaignCall } from '../../../core/services/campaign-admin.service';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartConfiguration, ChartData, DoughnutController, ArcElement, Tooltip, Legend } from 'chart.js';

// Registrar TODOS los componentes necesarios de Chart.js
Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

@Component({
  selector: 'app-campaign-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective, LucideAngularModule],
  templateUrl: './campaign-detail.component.html',
  styleUrls: ['./campaign-detail.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CampaignDetailComponent implements OnInit, OnDestroy {
  campaignId: number | null = null;
  statistics: CampaignStatistics | null = null;
  calls: CampaignCall[] = [];
  loading: boolean = false;
  error: string | null = null;

  // Paginación
  currentPage: number = 0;
  pageSize: number = 10;
  totalElements: number = 0;
  totalPages: number = 0;
  pageSizeOptions: number[] = [10, 25, 50, 100];

  // Búsqueda
  searchTerm: string = '';

  // Exponer Math para usar en el template
  Math = Math;

  // Toggle para mostrar gráfico o métricas
  showChart: boolean = false;

  // Configuración del gráfico de dona
  public doughnutChartType: 'doughnut' = 'doughnut' as const;
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: [],
    datasets: []
  };
  public doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = (context.dataset.data as number[]).reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  private pollingSubscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private campaignService: CampaignAdminService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.campaignId = +params['id'];
      if (this.campaignId) {
        this.loadCampaignData();
        this.startPolling();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }

  /**
   * Carga los datos de la campaña (estadísticas y llamadas)
   */
  loadCampaignData(): void {
    if (!this.campaignId) return;

    this.loading = true;
    this.error = null;

    // Cargar estadísticas
    this.campaignService.getCampaignStatistics(this.campaignId).subscribe({
      next: (stats) => {
        this.statistics = stats;
        this.updateChartData(stats);
      },
      error: (err) => {
        console.error('Error loading campaign statistics:', err);
        this.error = 'Error al cargar las estadísticas de la campaña';
      }
    });

    // Cargar llamadas
    this.loadCalls();
  }

  /**
   * Carga las llamadas con paginación y búsqueda
   */
  loadCalls(): void {
    if (!this.campaignId) return;

    this.campaignService.getCampaignCalls(
      this.campaignId,
      this.currentPage,
      this.pageSize,
      this.searchTerm
    ).subscribe({
      next: (response) => {
        this.calls = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.currentPage = response.currentPage;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading campaign calls:', err);
        this.error = 'Error al cargar las llamadas';
        this.loading = false;
      }
    });
  }

  /**
   * Inicia polling para actualizar estadísticas cada 10 segundos
   */
  startPolling(): void {
    this.pollingSubscription = interval(10000).pipe(
      switchMap(() => {
        if (!this.campaignId) return [];
        return this.campaignService.getCampaignStatistics(this.campaignId);
      })
    ).subscribe({
      next: (stats) => {
        this.statistics = stats;
      },
      error: (err) => {
        console.error('Error polling statistics:', err);
      }
    });
  }

  /**
   * Maneja el cambio de página
   */
  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadCalls();
  }

  /**
   * Maneja el cambio de tamaño de página
   */
  onPageSizeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.pageSize = +target.value;
    this.currentPage = 0; // Resetear a la primera página
    this.loadCalls();
  }

  /**
   * Maneja la búsqueda
   */
  onSearch(): void {
    this.currentPage = 0; // Resetear a la primera página
    this.loadCalls();
  }

  /**
   * Vuelve a la lista de campañas
   */
  goBack(): void {
    this.router.navigate(['/admin/campaigns']);
  }

  /**
   * Genera el array de números de página para la paginación
   */
  getPageNumbers(): number[] {
    const pages: number[] = [];
    for (let i = 0; i < this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  /**
   * Formatea el estado del contacto a texto legible
   */
  getEstadoTexto(estado: string): string {
    const estados: { [key: string]: string } = {
      'INICIADA': 'Iniciada',
      'MARCANDO': 'Marcando',
      'CONECTADA': 'Conectada',
      'EN_CURSO': 'En Curso',
      'NO_CONTESTADA': 'No Contestada',
      'ABANDONADA': 'Abandonada',
      'FINALIZADA': 'Finalizada',
      'FALLIDA': 'Fallida'
    };
    return estados[estado] || estado;
  }

  /**
   * Obtiene la clase CSS según el estado
   */
  getEstadoClass(estado: string): string {
    const classes: { [key: string]: string } = {
      'CONECTADA': 'estado-exitoso',
      'FINALIZADA': 'estado-exitoso',
      'EN_CURSO': 'estado-en-proceso',
      'MARCANDO': 'estado-en-proceso',
      'NO_CONTESTADA': 'estado-warning',
      'ABANDONADA': 'estado-error',
      'FALLIDA': 'estado-error'
    };
    return classes[estado] || 'estado-default';
  }

  /**
   * Formatea el estado de la campaña
   */
  getEstadoCampanaTexto(estado: string): string {
    const estados: { [key: string]: string } = {
      'DRAFT': 'Borrador',
      'ACTIVE': 'Activa',
      'PAUSED': 'Pausada',
      'COMPLETED': 'Terminada'
    };
    return estados[estado] || estado;
  }

  /**
   * Obtiene el color según el estado de la campaña
   */
  getEstadoCampanaColor(estado: string): string {
    const colores: { [key: string]: string } = {
      'DRAFT': '#6B7280',
      'ACTIVE': '#10B981',
      'PAUSED': '#F59E0B',
      'COMPLETED': '#3B82F6'
    };
    return colores[estado] || '#6B7280';
  }

  /**
   * Toggle para mostrar/ocultar el gráfico
   */
  toggleChart(): void {
    this.showChart = !this.showChart;
  }

  /**
   * Actualiza los datos del gráfico de dona
   */
  updateChartData(stats: CampaignStatistics): void {
    const total = stats.totalLlamadas;

    this.doughnutChartData = {
      labels: ['Contestadas', 'Cortas', 'Abandonadas', 'No Responden', 'Buzón de Voz', 'Fallidas', 'Pausadas'],
      datasets: [{
        data: [
          stats.llamadasContestadas || 0,
          stats.llamadasCortas || 0,
          stats.llamadasAbandonadas || 0,
          stats.llamadasNoContestadas || 0,
          stats.llamadasBuzonVoz || 0,
          stats.llamadasFallidas || 0,
          stats.llamadasPausadas || 0
        ],
        backgroundColor: [
          '#10B981', // Verde - Contestadas
          '#F59E0B', // Amarillo - Cortas
          '#EF4444', // Rojo - Abandonadas
          '#F97316', // Naranja - No Responden
          '#3B82F6', // Azul - Buzón de Voz
          '#6B7280', // Gris oscuro - Fallidas
          '#94A3B8'  // Gris claro - Pausadas
        ],
        borderWidth: 2,
        borderColor: '#1e293b'
      }]
    };
  }

  /**
   * Obtiene el porcentaje de un estado
   */
  getPercentage(value: number, total: number): string {
    if (total === 0) return '0%';
    return ((value / total) * 100).toFixed(0) + '%';
  }

  /**
   * Obtiene la clase CSS para la fila de la tabla según el porcentaje
   */
  getRowClass(percentage: string): string {
    const percent = parseFloat(percentage);
    if (percent >= 50) return 'high-percentage';
    if (percent >= 20) return 'medium-percentage';
    return 'low-percentage';
  }
}
