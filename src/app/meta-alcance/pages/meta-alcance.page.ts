import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import {
  Chart, LineController, LineElement, PointElement, LinearScale,
  CategoryScale, Tooltip, Legend, Filler, ChartConfiguration
} from 'chart.js';

import { MetaAlcanceService } from '../services/meta-alcance.service';
import { MetaAlcance, MetaResumen, MetaTiming } from '../models/meta-alcance.model';
import { ComisionesService } from '../../comisiones/services/comisiones.service';
import { Inquilino, Cartera, Subcartera } from '../../comisiones/models/comision.model';

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Filler);

// Paleta por rango (índice = orden - 1)
const RANGO_COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#a855f7', '#ef4444', '#06b6d4', '#64748b'];

@Component({
  selector: 'app-meta-alcance',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective],
  template: `
  <div class="p-6 bg-slate-50 dark:bg-slate-900 min-h-screen">

    <!-- Cabecera -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-slate-800 dark:text-white">Alcance de Meta · Rango Capital</h1>
      <button (click)="refrescar()" [disabled]="refrescando()"
              class="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium disabled:opacity-50">
        {{ refrescando() ? 'Refrescando…' : 'Refrescar avance' }}
      </button>
    </div>

    <!-- Filtros -->
    <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 mb-6">
      <div class="flex flex-wrap gap-4 items-end">
        <div>
          <label class="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Año</label>
          <select [(ngModel)]="anio" (change)="cargar()" class="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm">
            @for (a of anios; track a) { <option [value]="a">{{ a }}</option> }
          </select>
        </div>
        <div>
          <label class="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Mes</label>
          <select [(ngModel)]="mes" (change)="cargar()" class="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm">
            @for (m of meses; track m.v) { <option [value]="m.v">{{ m.n }}</option> }
          </select>
        </div>
        <div>
          <label class="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Inquilino</label>
          <select [(ngModel)]="idInquilino" (change)="onInquilino()" class="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm min-w-40">
            <option [ngValue]="undefined">Todos</option>
            @for (i of inquilinos(); track i.id) { <option [ngValue]="i.id">{{ i.nombreInquilino }}</option> }
          </select>
        </div>
        <div>
          <label class="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Cartera</label>
          <select [(ngModel)]="idCartera" (change)="onCartera()" [disabled]="!idInquilino" class="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm min-w-40 disabled:opacity-50">
            <option [ngValue]="undefined">Todas</option>
            @for (c of carteras(); track c.id) { <option [ngValue]="c.id">{{ c.nombreCartera }}</option> }
          </select>
        </div>
        <div>
          <label class="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Subcartera</label>
          <select [(ngModel)]="idSubcartera" (change)="cargar()" [disabled]="!idCartera" class="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm min-w-40 disabled:opacity-50">
            <option [ngValue]="undefined">Todas</option>
            @for (s of subcarteras(); track s.id) { <option [ngValue]="s.id">{{ s.nombreSubcartera }}</option> }
          </select>
        </div>
        <div>
          <label class="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Rango</label>
          <select [(ngModel)]="codigoRango" (change)="cargar()" class="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm min-w-40">
            <option [ngValue]="undefined">Todos</option>
            @for (r of rangosDisponibles(); track r.codigo) { <option [ngValue]="r.codigo">{{ r.etiqueta }}</option> }
          </select>
        </div>
      </div>
    </div>

    @if (loading()) {
      <div class="text-center text-slate-500 py-12">Cargando…</div>
    } @else if (filas().length === 0) {
      <div class="text-center text-slate-500 py-12">Sin metas configuradas para el periodo. Configura metas o pulsa “Refrescar avance”.</div>
    } @else {

      <!-- KPI cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4">
          <div class="text-xs text-slate-500 dark:text-slate-400">Alcance global</div>
          <div class="text-3xl font-bold" [class.text-green-600]="(resumen()?.pctGlobal||0) >= idealPctGlobal()" [class.text-amber-500]="(resumen()?.pctGlobal||0) < idealPctGlobal()">
            {{ resumen()?.pctGlobal | number:'1.1-1' }}%
          </div>
          <div class="text-xs text-slate-400">ideal hoy: {{ idealPctGlobal() | number:'1.1-1' }}%</div>
        </div>
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4">
          <div class="text-xs text-slate-500 dark:text-slate-400">Recaudo (avance)</div>
          <div class="text-2xl font-bold text-slate-800 dark:text-white">S/ {{ resumen()?.totalAvance | number:'1.0-0' }}</div>
          <div class="text-xs text-slate-400">de S/ {{ resumen()?.totalMeta | number:'1.0-0' }}</div>
        </div>
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4">
          <div class="text-xs text-slate-500 dark:text-slate-400">Meta restante</div>
          <div class="text-2xl font-bold text-slate-800 dark:text-white">S/ {{ metaRestante() | number:'1.0-0' }}</div>
        </div>
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4">
          <div class="text-xs text-slate-500 dark:text-slate-400">Brecha vs ideal hoy</div>
          <div class="text-2xl font-bold" [class.text-green-600]="brechaIdeal() >= 0" [class.text-red-500]="brechaIdeal() < 0">
            S/ {{ brechaIdeal() | number:'1.0-0' }}
          </div>
        </div>
      </div>

      <!-- Bullet por rango -->
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-6">
        <h2 class="text-lg font-semibold text-slate-800 dark:text-white mb-4">Alcance por rango capital</h2>
        <div class="space-y-4">
          @for (f of filas(); track f.codigoRango + f.idSubcartera) {
            <div>
              <div class="flex justify-between text-sm mb-1">
                <span class="font-medium text-slate-700 dark:text-slate-200">{{ f.etiquetaRango }}
                  @if (!idSubcartera) { <span class="text-slate-400 font-normal">· {{ f.nombreSubcartera }}</span> }
                </span>
                <span class="text-slate-600 dark:text-slate-300">
                  {{ f.pctAlcance | number:'1.1-1' }}% ·
                  S/ {{ f.avance | number:'1.0-0' }} / {{ f.meta | number:'1.0-0' }}
                </span>
              </div>
              <div class="relative h-5 bg-slate-100 dark:bg-slate-700 rounded">
                <!-- avance -->
                <div class="absolute top-0 left-0 h-5 rounded"
                     [style.width.%]="barWidth(f.pctAlcance)"
                     [style.background]="rangoColor(f.orden)"></div>
                <!-- marcador meta ideal hoy -->
                <div class="absolute top-[-2px] h-7 w-0.5 bg-slate-800 dark:bg-white"
                     [style.left.%]="barWidth(idealPct(f))"
                     [title]="'Meta ideal hoy: ' + (f.metaIdealHoy | number:'1.0-0')"></div>
              </div>
            </div>
          }
        </div>
        <div class="mt-3 text-xs text-slate-400">La barra es el avance (% de la meta del rango); la línea vertical es la meta prorrateada al día de hoy. Barra a la derecha de la línea = en ritmo.</div>
      </div>

      <!-- Curva de timing -->
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-6">
        <h2 class="text-lg font-semibold text-slate-800 dark:text-white mb-4">Avance acumulado por día</h2>
        <div class="h-80">
          @if (timingData().datasets.length) {
            <canvas baseChart [type]="'line'" [data]="timingData()" [options]="timingOptions"></canvas>
          } @else {
            <div class="text-center text-slate-400 py-12 text-sm">Sin recaudo acumulado en el periodo.</div>
          }
        </div>
      </div>

      <!-- Tabla detalle -->
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <h2 class="text-lg font-semibold text-slate-800 dark:text-white mb-4">Detalle</h2>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="text-left text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                <th class="py-2 pr-4">Cartera</th><th class="py-2 pr-4">Subcartera</th><th class="py-2 pr-4">Rango</th>
                <th class="py-2 pr-4 text-right">Meta</th><th class="py-2 pr-4 text-right">Avance</th>
                <th class="py-2 pr-4 text-right">% Alcance</th><th class="py-2 pr-4 text-right">Ideal hoy</th>
              </tr>
            </thead>
            <tbody>
              @for (f of filas(); track f.codigoRango + f.idSubcartera) {
                <tr class="border-b border-slate-100 dark:border-slate-700/50 text-slate-700 dark:text-slate-200">
                  <td class="py-2 pr-4">{{ f.nombreCartera }}</td>
                  <td class="py-2 pr-4">{{ f.nombreSubcartera }}</td>
                  <td class="py-2 pr-4">{{ f.etiquetaRango }}</td>
                  <td class="py-2 pr-4 text-right">{{ f.meta | number:'1.0-0' }}</td>
                  <td class="py-2 pr-4 text-right">{{ f.avance | number:'1.0-0' }}</td>
                  <td class="py-2 pr-4 text-right font-medium">{{ f.pctAlcance | number:'1.1-1' }}%</td>
                  <td class="py-2 pr-4 text-right text-slate-400">{{ f.metaIdealHoy | number:'1.0-0' }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    }
  </div>
  `
})
export class MetaAlcancePage implements OnInit {

  private metaSvc = inject(MetaAlcanceService);
  private comSvc = inject(ComisionesService);

  // filtros
  anio = new Date().getFullYear();
  mes = new Date().getMonth() + 1;
  idInquilino?: number;
  idCartera?: number;
  idSubcartera?: number;
  codigoRango?: string;

  anios = [this.anio - 1, this.anio, this.anio + 1];
  meses = [
    { v: 1, n: 'Enero' }, { v: 2, n: 'Febrero' }, { v: 3, n: 'Marzo' }, { v: 4, n: 'Abril' },
    { v: 5, n: 'Mayo' }, { v: 6, n: 'Junio' }, { v: 7, n: 'Julio' }, { v: 8, n: 'Agosto' },
    { v: 9, n: 'Setiembre' }, { v: 10, n: 'Octubre' }, { v: 11, n: 'Noviembre' }, { v: 12, n: 'Diciembre' }
  ];

  inquilinos = signal<Inquilino[]>([]);
  carteras = signal<Cartera[]>([]);
  subcarteras = signal<Subcartera[]>([]);

  loading = signal(false);
  refrescando = signal(false);
  filas = signal<MetaAlcance[]>([]);
  resumen = signal<MetaResumen | null>(null);
  timing = signal<MetaTiming[]>([]);

  rangosDisponibles = computed(() => {
    const map = new Map<string, string>();
    for (const f of this.filas()) map.set(f.codigoRango, f.etiquetaRango);
    return Array.from(map, ([codigo, etiqueta]) => ({ codigo, etiqueta }));
  });

  timingData = computed<ChartConfiguration<'line'>['data']>(() => {
    const pts = this.timing();
    const dias = Array.from(new Set(pts.map(p => p.dia))).sort((a, b) => a - b);
    const byRango = new Map<string, { etiqueta: string; orden: number; pts: MetaTiming[] }>();
    for (const p of pts) {
      if (!byRango.has(p.codigoRango)) byRango.set(p.codigoRango, { etiqueta: p.etiquetaRango, orden: p.orden, pts: [] });
      byRango.get(p.codigoRango)!.pts.push(p);
    }
    const datasets = Array.from(byRango.values())
      .sort((a, b) => (a.orden || 0) - (b.orden || 0))
      .map(g => {
        const acumByDia = new Map(g.pts.map(p => [p.dia, p.recaudoAcum]));
        let last = 0;
        const data = dias.map(d => { if (acumByDia.has(d)) last = acumByDia.get(d)!; return last; });
        const color = this.rangoColor(g.orden);
        return { label: g.etiqueta, data, borderColor: color, backgroundColor: color, tension: 0.3, pointRadius: 2, fill: false };
      });
    return { labels: dias.map(d => d.toString()), datasets };
  });

  timingOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true, maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: { legend: { position: 'bottom' } },
    scales: { x: { title: { display: true, text: 'Día del mes' } }, y: { beginAtZero: true } }
  };

  ngOnInit(): void {
    this.comSvc.obtenerInquilinos().subscribe(r => this.inquilinos.set(r || []));
    this.cargar();
  }

  onInquilino(): void {
    this.idCartera = undefined; this.idSubcartera = undefined;
    this.carteras.set([]); this.subcarteras.set([]);
    if (this.idInquilino) this.comSvc.obtenerCarteras(this.idInquilino).subscribe(r => this.carteras.set(r || []));
    this.cargar();
  }

  onCartera(): void {
    this.idSubcartera = undefined; this.subcarteras.set([]);
    if (this.idCartera) this.comSvc.obtenerSubcarteras(this.idCartera).subscribe(r => this.subcarteras.set(r || []));
    this.cargar();
  }

  cargar(): void {
    const f = {
      anio: +this.anio, mes: +this.mes,
      idInquilino: this.idInquilino, idCartera: this.idCartera,
      idSubcartera: this.idSubcartera, codigoRango: this.codigoRango
    };
    this.loading.set(true);
    this.metaSvc.getAlcance(f).subscribe({
      next: r => { this.filas.set(r.data || []); this.resumen.set(r.resumen); this.loading.set(false); },
      error: () => { this.filas.set([]); this.resumen.set(null); this.loading.set(false); }
    });
    this.metaSvc.getTiming(f).subscribe({ next: r => this.timing.set(r.data || []), error: () => this.timing.set([]) });
  }

  refrescar(): void {
    this.refrescando.set(true);
    this.metaSvc.refrescar({ anio: +this.anio, mes: +this.mes, idSubcartera: this.idSubcartera }).subscribe({
      next: () => { this.refrescando.set(false); this.cargar(); },
      error: () => this.refrescando.set(false)
    });
  }

  // ----- helpers de presentación -----
  rangoColor(orden?: number): string { return RANGO_COLORS[((orden || 1) - 1) % RANGO_COLORS.length]; }
  barWidth(pct: number): number { return Math.max(0, Math.min(100, pct || 0)); }
  idealPct(f: MetaAlcance): number { return f.meta > 0 ? (f.metaIdealHoy / f.meta) * 100 : 0; }

  idealPctGlobal(): number {
    const r = this.resumen();
    return r && r.totalMeta > 0 ? (r.totalMetaIdealHoy / r.totalMeta) * 100 : 0;
  }
  metaRestante(): number {
    const r = this.resumen();
    return r ? Math.max(0, r.totalMeta - r.totalAvance) : 0;
  }
  brechaIdeal(): number {
    const r = this.resumen();
    return r ? r.totalAvance - r.totalMetaIdealHoy : 0;
  }
}
