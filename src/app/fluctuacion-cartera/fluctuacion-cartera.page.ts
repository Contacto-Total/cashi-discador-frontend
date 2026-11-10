import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import {
  BarController, BarElement, CategoryScale, Chart, ChartConfiguration, Legend, LineController, LineElement,
  LinearScale, Plugin, PointElement, Tooltip
} from 'chart.js';

import { FluctuacionCarteraService } from './fluctuacion-cartera.service';
import {
  DashboardFluctuacion, FilaDetalle, GestionResumen, ModoFluctuacion, PeriodoFluctuacion, SubcarteraFluctuacion
} from './fluctuacion-cartera.model';

Chart.register(LineController, BarController, LineElement, PointElement, BarElement, LinearScale, CategoryScale,
  Tooltip, Legend);

const VERDE = '#047857';
const VERDE_CLARO = '#a7d7c5';
const ROJO = '#dc2626';
const TEXTO = '#1b2422';
const POR_PAGINA = 50;

type FiltroDetalle = 'todos' | 'op' | 'sale';
type VistaComparacion = 'total' | 'grupo';

/** Escribe el valor encima de cada barra o punto. */
function etiquetas(formato: (v: number, dataset: number, i: number) => string | null): Plugin {
  return {
    id: 'etiquetas',
    afterDatasetsDraw(chart) {
      const ctx = chart.ctx;
      ctx.save();
      ctx.fillStyle = TEXTO;
      ctx.font = '600 12px system-ui, sans-serif';
      ctx.textAlign = 'center';
      chart.data.datasets.forEach((ds, d) => {
        chart.getDatasetMeta(d).data.forEach((el: any, i) => {
          const crudo = ds.data[i] as any;
          if (crudo == null) return;
          const v = Array.isArray(crudo) ? crudo[1] - crudo[0] : crudo;
          const texto = formato(v, d, i);
          if (texto == null) return;
          const y = Array.isArray(crudo) ? Math.min(el.y, el.base) : el.y;
          ctx.fillText(texto, el.x, y - 8);
        });
      });
      ctx.restore();
    }
  };
}

@Component({
  selector: 'app-fluctuacion-cartera',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective],
  templateUrl: './fluctuacion-cartera.page.html'
})
export class FluctuacionCarteraPage implements OnInit {

  private readonly svc = inject(FluctuacionCarteraService);

  // Filtros
  readonly opciones = signal<SubcarteraFluctuacion[]>([]);
  idInquilino?: number;
  idCartera?: number;
  idSubcartera?: number;
  readonly modo = signal<ModoFluctuacion>('MES');
  readonly periodos = signal<PeriodoFluctuacion[]>([]);
  corte?: string;

  readonly inquilinos = computed(() => this.unicos(this.opciones().map(o => ({ id: o.idInquilino, nombre: o.inquilino }))));
  readonly carteras = signal<{ id: number; nombre: string }[]>([]);
  readonly subcarteras = signal<{ id: number; nombre: string }[]>([]);

  // Estado
  readonly cargando = signal(false);
  readonly error = signal<string | null>(null);
  readonly datos = signal<DashboardFluctuacion | null>(null);
  readonly vista = signal<VistaComparacion>('total');
  readonly filtro = signal<FiltroDetalle>('todos');
  readonly busqueda = signal('');
  readonly pagina = signal(0);

  ngOnInit(): void {
    this.svc.subcarteras().subscribe({
      next: ops => {
        this.opciones.set(ops);
        if (ops.length) {
          this.idInquilino = ops[0].idInquilino;
          this.onInquilino();
        }
      },
      error: () => this.error.set('No se pudieron cargar las subcarteras.')
    });
  }

  // ---------------------------------------------------------------- filtros

  onInquilino(): void {
    const ops = this.opciones().filter(o => o.idInquilino === this.idInquilino);
    this.carteras.set(this.unicos(ops.map(o => ({ id: o.idCartera, nombre: o.cartera }))));
    this.idCartera = this.carteras()[0]?.id;
    this.onCartera();
  }

  onCartera(): void {
    const ops = this.opciones().filter(o => o.idInquilino === this.idInquilino && o.idCartera === this.idCartera);
    this.subcarteras.set(ops.map(o => ({ id: o.idSubcartera, nombre: o.subcartera })));
    this.idSubcartera = this.subcarteras()[0]?.id;
    this.onSubcartera();
  }

  onSubcartera(): void {
    this.corte = undefined;
    this.cargarPeriodos();
  }

  cambiarModo(m: ModoFluctuacion): void {
    if (this.modo() === m) return;
    this.modo.set(m);
    this.corte = undefined;
    this.cargarPeriodos();
  }

  private cargarPeriodos(): void {
    this.datos.set(null);
    this.periodos.set([]);
    if (!this.idSubcartera) return;
    this.svc.periodos(this.idSubcartera, this.modo()).subscribe({
      next: p => {
        this.periodos.set(p);
        this.corte = p[0]?.clave;
        this.cargar();
      },
      error: () => this.error.set('No se pudieron cargar los periodos.')
    });
  }

  cargar(): void {
    if (!this.idSubcartera || !this.corte) {
      this.datos.set(null);
      return;
    }
    this.cargando.set(true);
    this.error.set(null);
    this.svc.dashboard(this.idSubcartera, this.modo(), this.corte).subscribe({
      next: d => {
        this.datos.set(d);
        this.pagina.set(0);
        this.cargando.set(false);
      },
      error: () => {
        this.datos.set(null);
        this.error.set('No se pudo cargar la información del periodo.');
        this.cargando.set(false);
      }
    });
  }

  // ---------------------------------------------------------------- indicadores

  variacion(actual: number, previo: number | undefined | null): number | null {
    if (previo == null || previo === 0) return null;
    return (actual - previo) / previo * 100;
  }

  millones(v: number | null | undefined): string {
    return v == null ? '—' : 'S/ ' + (v / 1e6).toFixed(2) + ' M';
  }

  // ---------------------------------------------------------------- gráficos

  readonly serieData = computed<ChartConfiguration<'line'>['data']>(() => {
    const d = this.datos();
    const s = d?.serie ?? [];
    return {
      labels: s.map(p => p.etiqueta),
      datasets: [{
        data: s.map(p => p.score),
        borderColor: VERDE,
        backgroundColor: s.map(p => p.clave === d?.corte.clave ? VERDE : '#ffffff'),
        pointBorderColor: VERDE,
        pointBorderWidth: 2.5,
        pointRadius: s.map(p => p.clave === d?.corte.clave ? 7 : 5),
        pointHoverRadius: 8,
        borderWidth: 2.5,
        tension: 0.3
      }]
    };
  });

  readonly serieOpciones: ChartConfiguration<'line'>['options'] = {
    maintainAspectRatio: false,
    layout: { padding: { left: 24, right: 24, top: 18 } },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: c => {
            const p = this.datos()?.serie[c.dataIndex];
            return p ? ['Score ' + (p.score ?? 0).toFixed(2), p.cj.toLocaleString('en-US') + ' CJ · S/ '
              + p.capital.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })] : '';
          }
        }
      }
    },
    scales: { x: { grid: { display: false }, offset: true }, y: { min: 0, max: 100 } }
  };

  readonly serieEtiquetas = [etiquetas(v => v.toFixed(2))];

  readonly comparacionData = computed<ChartConfiguration<'bar'>['data']>(() => {
    const d = this.datos();
    if (!d || !d.previo || !d.anterior) return { labels: [], datasets: [] };
    const ant = d.anterior.etiquetaCorta;
    const act = d.corte.etiquetaCorta;
    if (this.vista() === 'total') {
      return {
        labels: ['Toda la cartera'],
        datasets: [
          { label: ant, data: [d.previo.score], backgroundColor: VERDE_CLARO, borderRadius: 4, categoryPercentage: 0.5 },
          { label: act, data: [d.actual.score], backgroundColor: VERDE, borderRadius: 4, categoryPercentage: 0.5 }
        ]
      };
    }
    return {
      labels: ['Salieron', 'Mantiene', 'Entraron'],
      datasets: [
        { label: ant, data: [d.salieron.score, d.mantienenAntes.score, null], backgroundColor: VERDE_CLARO,
          borderRadius: 4, skipNull: true, categoryPercentage: 0.7 },
        { label: act, data: [null, d.mantienen.score, d.entraron.score], backgroundColor: VERDE,
          borderRadius: 4, skipNull: true, categoryPercentage: 0.7 }
      ]
    };
  });

  readonly comparacionOpciones: ChartConfiguration<'bar'>['options'] = {
    maintainAspectRatio: false,
    layout: { padding: { top: 18 } },
    plugins: {
      legend: { position: 'bottom', labels: { boxWidth: 10, boxHeight: 10 } },
      tooltip: {
        callbacks: {
          label: c => {
            const d = this.datos();
            if (!d) return '';
            const grupos = this.vista() === 'total'
              ? [[d.previo], [d.actual]]
              : [[d.salieron, d.mantienenAntes, null], [null, d.mantienen, d.entraron]];
            const g = grupos[c.datasetIndex][c.dataIndex];
            return g ? [c.dataset.label + ': score ' + (c.raw as number).toFixed(2),
              g.cj.toLocaleString('en-US') + ' CJ · ' + this.millones(g.capital)] : '';
          }
        }
      }
    },
    scales: { x: { grid: { display: false } }, y: { min: 0, max: 100 } }
  };

  readonly comparacionEtiquetas = [etiquetas(v => v.toFixed(2))];

  readonly capitalData = computed<ChartConfiguration<'bar'>['data']>(() => {
    const d = this.datos();
    if (!d || !d.previo || !d.anterior) return { labels: [], datasets: [] };
    const prev = d.previo.capital;
    const sal = d.salieron.capital;
    const ent = d.entraron.capital;
    return {
      labels: [d.anterior.etiquetaCorta, 'Salieron', 'Entraron', d.corte.etiquetaCorta],
      datasets: [{
        data: [[0, prev], [prev - sal, prev], [prev - sal, prev - sal + ent], [0, d.actual.capital]] as any,
        backgroundColor: [VERDE, ROJO, VERDE_CLARO, VERDE],
        borderRadius: 4,
        barPercentage: 0.6
      }]
    };
  });

  readonly capitalOpciones: ChartConfiguration<'bar'>['options'] = {
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: c => {
            const d = this.datos();
            if (!d || !d.previo) return '';
            const f2 = (v: number) => v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            const g = [d.previo, d.salieron, d.entraron, d.actual][c.dataIndex];
            const signo = c.dataIndex === 1 ? '−' : c.dataIndex === 2 ? '+' : '';
            const lineas = [signo + 'S/ ' + f2(g.capital), g.cj.toLocaleString('en-US') + ' CJ · '
              + g.clientes.toLocaleString('en-US') + ' clientes'];
            if (c.dataIndex === 2) {
              const dif = d.mantienen.capital - d.mantienenAntes.capital;
              lineas.push('Los que se mantienen: ' + (dif < 0 ? '−' : '+') + 'S/ ' + f2(Math.abs(dif)));
            }
            return lineas;
          }
        }
      }
    },
    scales: {
      x: { grid: { display: false } },
      y: { ticks: { callback: v => (Number(v) / 1e6) + ' M' } }
    }
  };

  // ---------------------------------------------------------------- tablas

  readonly scoreAnterior = computed(() => this.datos()?.previo?.score ?? null);

  readonly detalleFiltrado = computed<FilaDetalle[]>(() => {
    const filas = this.datos()?.detalle ?? [];
    const f = this.filtro();
    const q = this.busqueda().trim();
    return filas.filter(r =>
      (f === 'todos' || (f === 'op' && r.conOportunidadOPromesa) || (f === 'sale' && r.asignacion === 'SALIO'))
      && (!q || (r.documento ?? '').includes(q) || r.cj.includes(q)));
  });

  readonly totalPaginas = computed(() => Math.max(1, Math.ceil(this.detalleFiltrado().length / POR_PAGINA)));

  readonly paginaDetalle = computed(() => {
    const inicio = this.pagina() * POR_PAGINA;
    return this.detalleFiltrado().slice(inicio, inicio + POR_PAGINA);
  });

  cambiarFiltro(f: FiltroDetalle): void {
    this.filtro.set(f);
    this.pagina.set(0);
  }

  buscar(q: string): void {
    this.busqueda.set(q);
    this.pagina.set(0);
  }

  irA(p: number): void {
    this.pagina.set(Math.min(Math.max(0, p), this.totalPaginas() - 1));
  }

  asignacion(r: FilaDetalle): string {
    switch (r.asignacion) {
      case 'ENTRO': return 'Entró el ' + this.diaCorto(r.fechaMovimiento);
      case 'SALIO': return 'Salió el ' + this.diaCorto(r.fechaMovimiento);
      case 'MANTIENE': return 'Mantiene';
      default: return 'Asignado';
    }
  }

  gestion(g: GestionResumen | null): string {
    if (!g) return '';
    const partes = [g.tipificacion ?? ''];
    if (g.montoPromesa != null) {
      partes.push('S/ ' + g.montoPromesa.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    }
    if (g.estadoPago) partes.push(g.estadoPago);
    if (g.fecha) partes.push(this.diaCorto(g.fecha));
    return partes.filter(p => p).join(' · ');
  }

  claseEstado(e: string | null): string {
    switch (e) {
      case 'PR': return 'text-amber-800 bg-amber-50 dark:text-amber-300 dark:bg-amber-900/30';
      case 'CD': return 'text-green-800 bg-green-50 dark:text-green-300 dark:bg-green-900/30';
      case 'CI': return 'text-sky-800 bg-sky-50 dark:text-sky-300 dark:bg-sky-900/30';
      default: return 'text-slate-700 bg-slate-100 dark:text-slate-300 dark:bg-slate-700';
    }
  }

  /** El periodo dentro de una frase: «octubre 2026» o «03/11/2026». */
  enFrase(p: PeriodoFluctuacion): string {
    return this.modo() === 'MES' ? p.etiqueta.charAt(0).toLowerCase() + p.etiqueta.slice(1) : p.etiqueta;
  }

  diaCorto(f: string | null): string {
    if (!f) return '';
    const [, m, d] = f.substring(0, 10).split('-');
    return `${d}/${m}`;
  }

  dia(f: string | null): string {
    if (!f) return '';
    const [a, m, d] = f.substring(0, 10).split('-');
    return `${d}/${m}/${a}`;
  }

  private unicos(items: { id: number; nombre: string }[]): { id: number; nombre: string }[] {
    const vistos = new Map<number, string>();
    items.forEach(i => vistos.set(i.id, i.nombre));
    return [...vistos].map(([id, nombre]) => ({ id, nombre }));
  }
}
