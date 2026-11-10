import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormatService } from '@/shared/services/format.service';
import { AppNumberPipe } from '@/shared/pipes/format.pipes';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { Subscription } from 'rxjs';
import { Chart, registerables } from 'chart.js';
import {
  ReportService,
  AgentProductivityResponse,
  ProductivitySummary,
  AgentMetrics,
  ChartData,
  CorteHorarioResponse,
  AgentCorte
} from '../../../core/services/report.service';
import { TenantService } from '../../../maintenance/services/tenant.service';
import { PortfolioService } from '../../../maintenance/services/portfolio.service';
import { Tenant } from '../../../maintenance/models/tenant.model';
import { Portfolio, SubPortfolio } from '../../../maintenance/models/portfolio.model';

Chart.register(...registerables);

type PeriodType = 'today' | 'week' | 'month' | 'lastMonth' | 'year' | 'custom';
type TabType = 'productividad' | 'corteHorario';
// Ventana de vencimiento de la columna Generacion: de lo pactado hoy, que
// cuotas se cuentan segun cuando vencen.
type GeneracionVentana = 'hoy' | 'manana' | 'semana' | 'mes';
// Ventana de la Tasa de Cierre: el dia o el mes corrido.
type CierreVentana = 'hoy' | 'mes';
// Que gestiones muestra la columna. Se resuelve en memoria: el SP ya manda
// los tres conteos, asi que cambiar el selector no reconsulta nada.
type GestionesTipo = 'todos' | 'cd' | 'ci' | 'nc';

// Una de las seis tablas de Corte Horario, ya formateada: el template solo pinta.
interface TablaCorte {
  k: string;
  titulo: string;
  unidad: string;
  color: string;
  filas: { id: number; nombre: string; v: string[] }[];
  total: string[];
}

@Component({
  selector: 'app-agent-productivity',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, AppNumberPipe],
  templateUrl: './agent-productivity.component.html',
  styleUrls: ['./agent-productivity.component.css']
})
export class AgentProductivityComponent implements OnInit, OnDestroy, AfterViewInit {
  private fmt = inject(FormatService);

  // Exponer Math para el template
  Math = Math;

  // ==================== SISTEMA VISUAL (el de /reports/estado-agentes) ====================
  // Cada constante lleva un solo valor por propiedad: dos utilidades de Tailwind
  // que pisan lo mismo no se resuelven por el orden en que se escriben.
  readonly claseLabel = 'text-[11px] font-bold uppercase tracking-[0.05em] text-[#5f6c80] dark:text-slate-400';
  readonly claseInput =
    'h-[38px] rounded-lg border border-[#d5dbe3] bg-white px-3 text-[13px] font-semibold text-[#0f172a] ' +
    'outline-none transition-colors focus:border-[#2563eb] disabled:opacity-50 ' +
    'dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100';
  readonly claseKpi =
    'ap-rise flex flex-col gap-0.5 rounded-xl border border-[#e6e9ee] bg-white px-3.5 py-3 ' +
    'dark:border-slate-800 dark:bg-slate-900';
  readonly claseKpiV = 'text-[24px] font-extrabold leading-tight tracking-[-0.025em] tabular-nums';
  readonly claseKpiS = 'mt-auto text-[11px] font-medium text-[#5f6c80] dark:text-slate-400';
  readonly claseMeter =
    'mt-1.5 block h-1.5 overflow-hidden rounded-full bg-[#e2e8f0] shadow-[inset_0_1px_2px_rgba(15,23,42,0.08)] dark:bg-slate-800';
  readonly claseProy = 'flex min-w-0 flex-[1_1_240px] flex-col gap-0.5 bg-white px-3.5 py-3 dark:bg-slate-900';
  readonly claseProyV = 'text-[20px] font-extrabold leading-snug tracking-[-0.02em] tabular-nums';
  readonly claseProyS = 'text-[11px] font-medium tabular-nums text-[#5f6c80] dark:text-slate-400';
  readonly claseCaja =
    'flex h-8 max-w-full items-center gap-0.5 overflow-x-auto rounded-lg border border-[#d5dbe3] bg-white p-0.5 ' +
    'dark:border-slate-700 dark:bg-slate-900';

  // Tabla de asesores
  readonly claseSep = 'border-l border-l-[#e6e9ee] dark:border-l-slate-800 ';
  readonly claseGrupo =
    'h-[26px] whitespace-nowrap border-b border-l border-[#e6e9ee] bg-[#f8fafc] px-2.5 text-left text-[10px] ' +
    'font-extrabold uppercase tracking-[0.07em] dark:border-slate-800 dark:bg-slate-800 ';
  private readonly thBase =
    'whitespace-nowrap border-b border-[#e6e9ee] bg-[#f8fafc] py-2 align-middle text-[11.5px] font-bold leading-[1.3] ' +
    'text-[#334155] dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 ';
  readonly claseTh = this.thBase + 'px-2.5 text-right ';
  readonly claseThInd = this.thBase + 'px-3 text-left ';
  readonly claseThCentro = this.thBase + 'px-2.5 text-center ';
  readonly claseThAgente = this.thBase + 'sticky left-0 z-[2] min-w-[210px] border-r px-2.5 text-left ';
  readonly claseThSub = 'block text-[10.5px] font-semibold text-[#1d4ed8] dark:text-blue-300';
  private readonly tdBase = 'whitespace-nowrap border-b border-[#e6e9ee] bg-inherit py-2 align-middle dark:border-slate-800 ';
  readonly claseTd = this.tdBase + 'px-2.5 text-right font-medium text-[#334155] dark:text-slate-300 ';
  readonly claseTdFuerte = this.tdBase + 'px-2.5 text-right font-extrabold text-[#0f172a] dark:text-slate-100 ';
  readonly claseTdInd = this.tdBase + 'px-3 text-left ';
  readonly claseTdCentro = this.tdBase + 'px-2.5 text-center ';
  /** El fondo lo hereda de la fila: asi la celda fija sigue al hover. */
  readonly claseTdAgente = this.tdBase + 'sticky left-0 z-[1] min-w-[210px] border-r px-2.5 text-left ';
  private readonly totalBase =
    'whitespace-nowrap border-t border-[#d5dbe3] bg-inherit py-2 align-middle text-[12px] font-extrabold dark:border-slate-700 ';
  readonly claseTotal = this.totalBase + 'px-2.5 text-right ';
  readonly claseTotalInd = this.totalBase + 'px-3 text-left ';
  readonly claseTotalCentro = this.totalBase + 'px-2.5 text-center text-[#5f6c80] dark:text-slate-400';
  readonly claseTotalAgente = this.totalBase + 'sticky left-0 z-[1] min-w-[210px] border-r px-2.5 text-left ';
  readonly claseBarra = 'ap-fill block h-full rounded-full bg-[#2563eb] dark:bg-blue-500';

  // Tablas de Corte Horario. La columna Cierre va resaltada.
  private readonly corteFondoCierre = 'bg-[rgba(15,23,42,0.035)] dark:bg-white/5 ';
  private readonly corteThBase =
    'whitespace-nowrap border-b border-[#e6e9ee] bg-[#f8fafc] py-[7px] text-[11.5px] font-bold dark:border-slate-800 dark:bg-slate-800 ';
  readonly claseCorteThAgente = this.corteThBase + 'px-3 text-left text-[#334155] dark:text-slate-300';
  readonly claseCorteTh = this.corteThBase + 'px-2.5 text-right text-[#334155] dark:text-slate-300';
  readonly claseCorteThCierre = this.corteThBase + 'pl-2.5 pr-3 text-right text-[#0f172a] dark:text-slate-100';
  private readonly corteTdBase = 'whitespace-nowrap border-b border-[#e6e9ee] py-[7px] dark:border-slate-800 ';
  readonly claseCorteTdAgente =
    this.corteTdBase + 'max-w-[190px] truncate px-3 text-left text-[12.5px] font-bold tracking-[-0.01em] text-[#0f172a] dark:text-slate-100';
  readonly claseCorteTd = this.corteTdBase + 'px-2.5 text-right font-medium text-[#334155] dark:text-slate-300';
  readonly claseCorteTdCierre =
    this.corteTdBase + this.corteFondoCierre + 'pl-2.5 pr-3 text-right font-extrabold text-[#0f172a] dark:text-slate-100';
  private readonly corteTotalBase =
    'whitespace-nowrap border-t border-[#d5dbe3] py-2 font-extrabold text-[#0f172a] dark:border-slate-700 dark:text-slate-100 ';
  readonly claseCorteTotalAgente = this.corteTotalBase + 'px-3 text-left text-[12.5px]';
  readonly claseCorteTotal = this.corteTotalBase + 'px-2.5 text-right';
  readonly claseCorteTotalCierre = this.corteTotalBase + this.corteFondoCierre + 'pl-2.5 pr-3 text-right';

  claseTab(activo: boolean): string {
    return 'shrink-0 rounded-[6px] px-3.5 text-[12.5px] font-bold transition-colors duration-150 ' +
      (activo ? 'bg-[#0f172a] text-white dark:bg-white dark:text-slate-900'
              : 'text-[#5f6c80] hover:text-[#0f172a] dark:text-slate-400 dark:hover:text-slate-100');
  }

  /** Opcion de columna: mas liviana que una pestaña para que no compita con ellas. */
  claseSeg(activo: boolean): string {
    return 'h-[26px] shrink-0 whitespace-nowrap rounded-[6px] px-2.5 text-[12px] font-bold transition-colors duration-150 ' +
      'disabled:cursor-not-allowed ' +
      (activo ? 'bg-[#e8effd] text-[#1d4ed8] dark:bg-blue-500/20 dark:text-blue-300'
              : 'text-[#5f6c80] hover:text-[#0f172a] dark:text-slate-400 dark:hover:text-slate-100');
  }

  // Opciones de columna. "sub" es lo que se lee bajo el titulo de la columna.
  readonly opcionesGestiones: { k: GestionesTipo; l: string; sub: string }[] = [
    { k: 'todos', l: 'Todos (CD+CI)', sub: 'CD + CI' },
    { k: 'cd',    l: 'CD',            sub: 'solo CD' },
    { k: 'ci',    l: 'CI',            sub: 'solo CI' },
    { k: 'nc',    l: 'NC',            sub: 'solo NC' }
  ];
  readonly opcionesGeneracion: { k: GeneracionVentana; l: string; sub: string }[] = [
    { k: 'hoy',    l: 'Ese día',       sub: 'vence ese día' },
    { k: 'manana', l: 'Día siguiente', sub: 'vence al día siguiente' },
    { k: 'semana', l: 'Esa semana',    sub: 'vence esa semana' },
    { k: 'mes',    l: 'Ese mes',       sub: 'vence ese mes' }
  ];
  readonly opcionesCierre: { k: CierreVentana; l: string; sub: string }[] = [
    { k: 'hoy', l: 'Hoy',      sub: 'hoy' },
    { k: 'mes', l: 'Este mes', sub: 'este mes' }
  ];

  readonly HORAS_CORTE = [
    { k: '12', l: '12:00' },
    { k: '15', l: '15:00' },
    { k: '17', l: '17:00' },
    { k: '23', l: 'Cierre' }
  ];

  readonly esqueletoKpi = [0, 1, 2, 3, 4];
  readonly esqueletoFilas = [0, 1, 2, 3, 4, 5, 6, 7];
  readonly esqueletoCorte = [0, 1, 2, 3, 4, 5];

  // Filtros
  tenants: Tenant[] = [];
  portfolios: Portfolio[] = [];
  subPortfolios: SubPortfolio[] = [];

  selectedTenantId: number | null = null;
  selectedCarteraId: number | null = null;
  selectedSubcarteraId: number | null = null;
  selectedPeriod: PeriodType = 'today';
  generacionVentana: GeneracionVentana = 'mes';
  cierreVentana: CierreVentana = 'hoy';
  gestionesTipo: GestionesTipo = 'todos';
  // Filtro por nombre. Se resuelve en memoria sobre lo ya consultado.
  buscarAgente = '';
  customDateFrom: string = '';
  customDateTo: string = '';

  // Tab activo
  activeTab: TabType = 'productividad';

  // Estado
  loading = false;
  loadingCorte = false;
  error: string | null = null;

  // Datos
  productivityData: AgentProductivityResponse | null = null;
  corteHorarioData: CorteHorarioResponse | null = null;

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
    // No se consulta al entrar: el usuario debe pulsar "Buscar" para lanzar la consulta.
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
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
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
      this.loadData(true);
    }
  }

  // Cambiar un selector de columna reconsultaba el SP entero. Como la respuesta
  // depende solo de estos parametros, se guarda por combinacion: volver a una
  // ventana ya vista es instantaneo. "Buscar" limpia el cache.
  private cache = new Map<string, AgentProductivityResponse>();

  private cacheKey(fechaInicio: string, fechaFin: string): string {
    return [
      fechaInicio, fechaFin,
      this.selectedTenantId, this.selectedCarteraId, this.selectedSubcarteraId,
      this.generacionVentana, this.cierreVentana
    ].join('|');
  }

  loadData(forzar: boolean = false): void {
    const { fechaInicio, fechaFin } = this.getDateRange();
    const key = this.cacheKey(fechaInicio, fechaFin);

    if (forzar) {
      this.cache.clear();
    } else {
      const cacheado = this.cache.get(key);
      if (cacheado) {
        this.productivityData = cacheado;
        this.error = null;
        setTimeout(() => this.initCharts(), 100);
        return;
      }
    }

    this.loading = true;
    this.error = null;

    this.reportService.getAgentProductivity(
      fechaInicio,
      fechaFin,
      this.selectedTenantId || undefined,
      this.selectedCarteraId || undefined,
      this.selectedSubcarteraId || undefined,
      this.generacionVentana,
      this.cierreVentana
    ).subscribe({
      next: (data) => {
        this.productivityData = data;
        this.cache.set(key, data);
        this.loading = false;
        setTimeout(() => this.initCharts(), 100);
      },
      error: (err) => {
        console.error('Error loading productivity data:', err);
        this.error = 'Error al cargar los datos de productividad';
        this.loading = false;
      }
    });

    // Recargar corte horario si está en ese tab o si ya se cargó antes
    if (this.activeTab === 'corteHorario' || this.corteHorarioData) {
      this.loadCorteHorario();
    }
  }

  onGeneracionVentanaChange(): void {
    if (this.productivityData) {
      this.loadData();
    }
  }

  onCierreVentanaChange(): void {
    if (this.productivityData) {
      this.loadData();
    }
  }

  // "Todos" es CD + CI, el universo historico de la pantalla; NC va aparte.
  gestionesDe(agent: AgentMetrics): number {
    switch (this.gestionesTipo) {
      case 'cd': return agent.gestionesCd;
      case 'ci': return agent.gestionesCi;
      case 'nc': return agent.gestionesNc;
      default:   return agent.gestionesCd + agent.gestionesCi;
    }
  }

  totalGestionesMostradas(): number {
    return this.agentesFiltrados.reduce((sum, a) => sum + this.gestionesDe(a), 0);
  }

  elegirGeneracion(v: GeneracionVentana): void {
    if (this.generacionVentana === v) return;
    this.generacionVentana = v;
    this.onGeneracionVentanaChange();
  }

  elegirCierre(v: CierreVentana): void {
    if (this.cierreVentana === v) return;
    this.cierreVentana = v;
    this.onCierreVentanaChange();
  }

  get gestionesSub(): string {
    return this.opcionesGestiones.find(o => o.k === this.gestionesTipo)?.sub ?? '';
  }

  get generacionSub(): string {
    return this.opcionesGeneracion.find(o => o.k === this.generacionVentana)?.sub ?? '';
  }

  get cierreSub(): string {
    return this.opcionesCierre.find(o => o.k === this.cierreVentana)?.sub ?? '';
  }

  // ==================== BUSCADOR DE ASESOR ====================
  /** Sin tildes ni mayusculas: "oscar" encuentra a "Óscar". */
  private normalizar(s: string | null | undefined): string {
    return (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
  }

  get hayFiltroAgente(): boolean {
    return this.normalizar(this.buscarAgente).length > 0;
  }

  onBuscarAgenteChange(valor: string): void {
    this.buscarAgente = valor;
    this.construirCorte();
  }

  private filtroCache: { src: AgentMetrics[]; q: string; out: AgentMetrics[] } | null = null;

  get agentesFiltrados(): AgentMetrics[] {
    const src = this.agents;
    const q = this.normalizar(this.buscarAgente);
    if (!q) return src;
    const c = this.filtroCache;
    if (c && c.src === src && c.q === q) return c.out;
    const out = src.filter(a => this.normalizar(a.nombreAgente).includes(q));
    this.filtroCache = { src, q, out };
    return out;
  }

  // ==================== CABECERA ====================
  get anyLoading(): boolean {
    return this.loading || this.loadingCorte;
  }

  /** 'YYYY-MM-DD' -> 'DD/MM/YYYY'. A mano: new Date() lo leeria en UTC y en Lima cae al dia anterior. */
  private fechaCorta(iso: string): string {
    const [y, m, d] = (iso || '').split('-');
    return y && m && d ? `${d}/${m}/${y}` : '—';
  }

  get subtitulo(): string {
    const { fechaInicio, fechaFin } = this.getDateRange();
    const rango = fechaInicio === fechaFin
      ? this.fechaCorta(fechaInicio)
      : `${this.fechaCorta(fechaInicio)} al ${this.fechaCorta(fechaFin)}`;
    const partes = [this.selectedPeriod === 'custom' ? rango : `${this.getPeriodLabel()}, ${rango}`];

    const tenant = this.tenants.find(t => t.id === this.selectedTenantId);
    const cartera = this.portfolios.find(p => p.id === this.selectedCarteraId);
    const sub = this.subPortfolios.find(s => s.id === this.selectedSubcarteraId);
    [tenant?.tenantName, cartera?.portfolioName, sub?.subPortfolioName]
      .forEach(n => { if (n) partes.push(n); });

    const n = this.activeTab === 'corteHorario'
      ? (this.corteHorarioData ? this.corteAgents.length : null)
      : (this.productivityData ? this.agents.length : null);
    if (n !== null) partes.push(n === 1 ? '1 asesor' : `${n} asesores`);

    return partes.join(' · ');
  }

  // ==================== BARRAS ====================
  min100(v: number | null | undefined): number {
    return Math.max(0, Math.min(100, v || 0));
  }

  /**
   * La barra se desplaza en vez de cambiar de ancho: transform no recalcula el
   * layout de la tabla en cada cuadro y conserva el extremo redondeado.
   */
  barra(v: number | null | undefined): string {
    return `translateX(${this.min100(v) - 100}%)`;
  }

  get etiquetaTasaCierre(): string {
    return this.cierreVentana === 'hoy' ? 'Tasa de Cierre (Hoy)' : 'Tasa de Cierre (Mes)';
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
    return this.fmt.date(date, { day: '2-digit', month: 'short' });
  }

  // Helpers para template
  get summary(): ProductivitySummary | null {
    return this.productivityData?.summary || null;
  }

  get agents(): AgentMetrics[] {
    return this.productivityData?.agents || [];
  }

  // El fallback cubre al backend que todavia no manda el campo: sin el, la
  // cabecera de la columna saldria vacia.
  get etiquetaRecaudo(): string {
    return this.productivityData?.etiquetaRecaudo || 'Recaudo';
  }

  get etiquetaRecaudoAcumulado(): string {
    return this.productivityData?.etiquetaRecaudoAcumulado || 'Recaudo Acumulado';
  }

  // Totales de la fila de cierre de la tabla.
  agentTotal(field: string): number {
    return this.agentesFiltrados.reduce((sum, a) => sum + ((a as any)[field] || 0), 0);
  }

  formatMoney(value: number): string {
    return this.fmt.number(value, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00';
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
      case 'up': return 'bg-[#e8f5ec] text-[#15803d] dark:bg-emerald-500/15 dark:text-emerald-300';
      case 'down': return 'bg-[#fdecec] text-[#b91c1c] dark:bg-red-500/15 dark:text-red-300';
      default: return 'bg-[#eef1f5] text-[#334155] dark:bg-slate-800 dark:text-slate-300';
    }
  }

  // La tendencia no se distingue solo por color: lleva icono y texto.
  getTrendLabel(trend: string): string {
    switch (trend) {
      case 'up': return 'Sube';
      case 'down': return 'Baja';
      default: return 'Igual';
    }
  }

  getChangeClass(value: number | undefined): string {
    if (!value) return 'text-[#5f6c80] dark:text-slate-400';
    return value > 0 ? 'text-[#15803d] dark:text-emerald-400' : 'text-[#b91c1c] dark:text-red-400';
  }

  getChangeIcon(value: number | undefined): string {
    if (!value) return 'minus';
    return value > 0 ? 'trending-up' : 'trending-down';
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

  // Tab management
  switchTab(tab: TabType): void {
    this.activeTab = tab;
    if (tab === 'corteHorario' && !this.corteHorarioData) {
      this.loadCorteHorario();
    }
  }

  loadCorteHorario(): void {
    this.loadingCorte = true;

    // Usa el mismo rango de fechas del filtro de productividad
    const { fechaInicio, fechaFin } = this.getDateRange();

    this.reportService.getCorteHorario(
      fechaInicio,
      fechaFin,
      this.selectedTenantId || undefined,
      this.selectedCarteraId || undefined,
      this.selectedSubcarteraId || undefined
    ).subscribe({
      next: (data) => {
        this.corteHorarioData = data;
        this.construirCorte();
        this.loadingCorte = false;
      },
      error: (err) => {
        console.error('Error loading corte horario:', err);
        this.loadingCorte = false;
      }
    });
  }

  get corteAgents(): AgentCorte[] {
    return this.corteHorarioData?.agents || [];
  }

  get corteAgentesFiltrados(): AgentCorte[] {
    const q = this.normalizar(this.buscarAgente);
    return q ? this.corteAgents.filter(a => this.normalizar(a.nombreAgente).includes(q)) : this.corteAgents;
  }

  // Las seis tablas, ya calculadas. Se rearman al llegar datos o al cambiar el
  // buscador, no en cada deteccion de cambios: son 24 celdas por asesor.
  tablasCorte: TablaCorte[] = [];

  private construirCorte(): void {
    const agentes = this.corteAgentesFiltrados;
    const horas = this.HORAS_CORTE.map(h => h.k);

    type Leer = (campo: string, hora: string) => number;
    const leerDe = (a: AgentCorte): Leer =>
      (campo, hora) => Number(a[(campo + hora) as keyof AgentCorte]) || 0;
    const sumar: Leer = (campo, hora) => agentes.reduce((s, a) => s + leerDe(a)(campo, hora), 0);

    const entero = (n: number): string => this.fmt.number(n, { maximumFractionDigits: 0 });
    // Ticket y tasa salen de dividir los acumulados: asi el TOTAL no promedia promedios.
    const ticket = (monto: number, cant: number): string => cant ? entero(monto / cant) : '—';
    const tasa = (cant: number, cd: number): string =>
      cd ? this.fmt.number(cant / cd * 100, { minimumFractionDigits: 0, maximumFractionDigits: 1 }) + '%' : '—';

    const tabla = (k: string, titulo: string, unidad: string, color: string,
                   celda: (leer: Leer, hora: string) => string): TablaCorte => ({
      k, titulo, unidad, color,
      filas: agentes.map(a => ({
        id: a.idAgente,
        nombre: a.nombreAgente,
        v: horas.map(h => celda(leerDe(a), h))
      })),
      total: horas.map(h => celda(sumar, h))
    });

    this.tablasCorte = [
      tabla('gestiones', 'Gestiones', '', 'text-[#2563eb] dark:text-blue-400',
        (leer, h) => entero(leer('gestiones', h))),
      tabla('cd', 'CD · Contacto directo', '', 'text-[#1746a2] dark:text-blue-300',
        (leer, h) => entero(leer('cd', h))),
      tabla('pdpCant', 'PDP cantidad', '', 'text-[#4a3aa7] dark:text-violet-300',
        (leer, h) => entero(leer('pdpCant', h))),
      tabla('pdpMonto', 'PDP monto', 'S/', 'text-[#4a3aa7] dark:text-violet-300',
        (leer, h) => entero(leer('pdpMonto', h))),
      tabla('ticket', 'Ticket promedio', 'S/', 'text-[#0f7a55] dark:text-emerald-400',
        (leer, h) => ticket(leer('pdpMonto', h), leer('pdpCant', h))),
      tabla('tasa', 'Tasa de cierre', '', 'text-[#334155] dark:text-slate-300',
        (leer, h) => tasa(leer('pdpCant', h), leer('cd', h)))
    ];
  }
}
