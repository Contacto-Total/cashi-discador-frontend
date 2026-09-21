import {
  AfterViewInit, Component, ElementRef, OnDestroy, computed, effect,
  inject, input, output, signal, viewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { Chart, registerables } from 'chart.js';
import { ToastService } from '../../shared/services/toast.service';
import { AsistenciaService } from './asistencia.service';
import { DashboardAsistencia, EstadoAsistencia } from './asistencia.models';
import { ESTILOS, duracionCorta, enDuracion, unidadDe } from './asistencia.estilos';

Chart.register(...registerables);

/** Los mismos colores plenos que usan las cintas del reporte. */
const COLOR: Record<string, string> = {
  PUNTUAL: '#16a34a',
  TARDE: '#f59e0b',
  FALTA: '#dc2626',
  INCOMPLETO: '#8491a3',
  JUSTIFICADO: '#6366f1',
  NO_LABORABLE: '#e6e9ee'
};

const DIAS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

/**
 * El pulso de la cartera: lo que se mira antes de entrar al detalle.
 *
 * Seis piezas que responden seis preguntas distintas: cómo vamos, cuánta
 * tardanza hay, quién pierde el bono, qué falta por completar, cómo fue cada
 * día y quién se queda corto de horas.
 *
 * Sin ámbito elegido no se dibuja nada: con la empresa entera el mapa tiene
 * cientos de filas y no responde a ninguna pregunta.
 */
@Component({
  selector: 'app-asistencia-dashboard',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  styles: [`
    :host { display: block; }
    .aparecer { animation: aparecer .18s ease-out }
    @keyframes aparecer { from { opacity: 0; transform: translateY(3px) } to { opacity: 1; transform: none } }

    /* Los lienzos llevan alto fijo: sin él, Chart.js crece sin parar. */
    .lienzo { position: relative; height: 210px }
    .lienzo-dona { height: 190px; flex: none; width: 190px }
    .lienzo-alto { height: 260px }
    .dona-con-leyenda { display: flex; flex-wrap: wrap; align-items: center; gap: 18px }

    /* La tira de la puntualidad: diez segmentos, uno por cada 10 %. */
    .tira { display: flex; gap: 3px; width: 100% }
    .tira .seg { flex: 1; height: 12px; border-radius: 3px; background: #f1f3f6 }
    :host-context(.dark) .tira .seg { background: #1e293b }

    /* La barra con el tope del equipo al medio. */
    .barra-tope { position: relative; height: 12px; width: 100%; border-radius: 999px; background: #f1f3f6 }
    .barra-tope::after {
      content: ""; position: absolute; left: 0; top: 0; height: 100%; width: var(--valor);
      border-radius: 999px; background: var(--color);
    }
    .barra-tope::before {
      content: ""; position: absolute; top: -4px; bottom: -4px; left: 50%; width: 2px;
      background: #0f172a; z-index: 1;
    }
    :host-context(.dark) .barra-tope { background: #1e293b }
    :host-context(.dark) .barra-tope::before { background: #e2e8f0 }

    /* Una silueta por persona: las que pierden el bono, en rojo. */
    .fila-personas { display: flex; flex-wrap: wrap; gap: 3px; color: #8491a3 }
    .fila-personas .mal { color: #dc2626 }

    /* El mapa de la semana: una fila por persona, un cuadro por día. */
    .mapa { display: grid; gap: 4px; align-items: center }
    .mapa .cuadro-dia { height: 26px; border-radius: 6px }
    .mapa .nombre {
      font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      padding-right: 8px;
    }
  `],
  template: `
  <!-- Cada pantalla trae su cabecera bajo la del módulo: es donde vive lo que
       solo sirve aquí. -->
  <div class="flex flex-col gap-4 border-b border-[#e6e9ee] bg-white px-7 py-5 dark:border-slate-800 dark:bg-slate-900">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="!m-0 text-xl font-extrabold tracking-[-0.01em]">Dashboard de Asistencia</h1>
        <p class="mt-[3px] text-[12.5px] text-[#5f6c80] dark:text-slate-400">{{ subtitulo() }}</p>
      </div>
      <button type="button" [class]="estilos.botonSecundario" (click)="semanaAnterior.emit()">
        <lucide-angular name="arrow-left" [size]="15" class="block"></lucide-angular>
        Semana anterior
      </button>
    </div>
  </div>

  <div class="px-7 py-5">
    @if (!idSubcartera()) {
      <div [class]="estilos.vacio">
        <strong class="block text-[13.5px]">Elige un cliente, una cartera o una subcartera</strong>
        <span class="text-[12.5px] text-[#5f6c80] dark:text-slate-400">
          El dashboard resume el ámbito elegido; con toda la empresa de golpe no se lee.
        </span>
      </div>
    } @else if (cargando()) {
      <p class="py-16 text-center text-[13px] text-[#5f6c80] dark:text-slate-400">Cargando…</p>
    } @else if (datos(); as d) {
      <div class="aparecer">

        <!-- Las cuatro cifras -->
        <div class="mb-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div [class]="estilos.tarjeta">
            <div class="mb-2 flex items-center gap-2.5">
              <span [class]="estilos.icono">
                <lucide-angular name="calendar-days" [size]="15" class="block"></lucide-angular>
              </span>
              <h3 [class]="estilos.rotulo">Puntualidad</h3>
            </div>
            <div [class]="estilos.cifra">{{ d.porcentajePuntualidad }}<small [class]="estilos.unidad">%</small></div>
            <div [class]="estilos.banda">
              <div class="tira">
                @for (s of segmentos(); track $index) {
                  <span class="seg" [style.background]="s"></span>
                }
              </div>
            </div>
            <p [class]="estilos.pie">{{ d.diasPuntuales }} de {{ d.diasTrabajados }} días trabajados</p>
          </div>

          <div [class]="estilos.tarjeta">
            <div class="mb-2 flex items-center gap-2.5">
              <span [class]="estilos.icono">
                <lucide-angular name="clock" [size]="15" class="block"></lucide-angular>
              </span>
              <h3 [class]="estilos.rotulo">Tardanza acumulada</h3>
            </div>
            <div [class]="estilos.cifra">
              {{ duracionCorta(d.minutosTardanzaTotal) }}<small [class]="estilos.unidad">{{ unidadDe(d.minutosTardanzaTotal) }}</small>
            </div>
            <div [class]="estilos.banda + ' mb-4'">
              <div class="relative w-full">
                <div class="barra-tope" role="img"
                     [style.--valor]="porcentajeTardanza() + '%'"
                     [style.--color]="d.minutosTardanzaTotal > d.minutosTopeEquipo ? '#dc2626' : '#16a34a'"
                     [attr.aria-label]="'Tardanza ' + enDuracion(d.minutosTardanzaTotal)
                        + ' de un tope de ' + enDuracion(d.minutosTopeEquipo)"></div>
                <span class="absolute left-1/2 top-[18px] -translate-x-1/2 whitespace-nowrap text-[10px] leading-none text-[#5f6c80] dark:text-slate-400">
                  tope {{ enDuracion(d.minutosTopeEquipo) }}
                </span>
              </div>
            </div>
            <p [class]="estilos.pie">Solo los días con retraso</p>
          </div>

          <div [class]="estilos.tarjeta">
            <div class="mb-2 flex items-center gap-2.5">
              <span [class]="estilos.icono">
                <lucide-angular name="bell" [size]="15" class="block"></lucide-angular>
              </span>
              <h3 [class]="estilos.rotulo">Pierden bono</h3>
            </div>
            <div [class]="estilos.cifra">
              {{ d.pierdenBono }}<small [class]="estilos.unidad">de {{ d.personas }}</small>
            </div>
            <div [class]="estilos.banda">
              <div class="fila-personas">
                @for (a of d.agentes; track a.idUsuario) {
                  <span [class.mal]="a.pierdeBono"
                        [title]="a.nombreAgente + ': ' + (a.pierdeBono ? 'pierde' : 'mantiene') + ' el bono'">
                    <lucide-angular name="user" [size]="16" class="block"></lucide-angular>
                  </span>
                }
              </div>
            </div>
            <p [class]="estilos.pie">Por tardanza de ingreso</p>
          </div>

          <div [class]="estilos.tarjeta">
            <div class="mb-2 flex items-center gap-2.5">
              <span [class]="estilos.icono">
                <lucide-angular name="pencil" [size]="15" class="block"></lucide-angular>
              </span>
              <h3 [class]="estilos.rotulo">Días por completar</h3>
            </div>
            <div [class]="estilos.cifra">{{ d.diasIncompletos }}</div>
            <!-- Aquí el color marca lo que FALTA, no lo que está bien. -->
            <div [class]="estilos.banda">
              <div class="flex w-full gap-1.5">
                @for (c of diasPorCompletar(); track c.dia) {
                  <span class="flex h-[26px] flex-1 items-center justify-center rounded-md text-[11px] font-bold"
                        [class]="c.pendientes
                          ? 'bg-[#ea580c] text-white'
                          : 'bg-[#f1f3f6] text-[#5f6c80] dark:bg-slate-800 dark:text-slate-400'"
                        [title]="c.dia + ': ' + (c.pendientes ? c.pendientes + ' sin completar' : 'completo')">
                    {{ c.dia.slice(0, 2) }}
                  </span>
                }
              </div>
            </div>
            <p [class]="estilos.pie">Sin marcación de almuerzo o salida</p>
          </div>
        </div>

        <!-- La curva y el reparto -->
        <div class="mb-4 grid gap-4 lg:grid-cols-2">
          <div [class]="estilos.tarjeta">
            <h2 [class]="estilos.titulo + ' !mb-0'">Tardanza del equipo por día</h2>
            <p class="!mb-3 !mt-1 text-[12.5px] text-[#5f6c80] dark:text-slate-400">
              Minutos de retraso en el ingreso, sumados
            </p>
            <div class="lienzo"><canvas #linea></canvas></div>
          </div>

          <div [class]="estilos.tarjeta">
            <h2 [class]="estilos.titulo + ' !mb-0'">Cómo se repartieron los días</h2>
            <p class="!mb-3 !mt-1 text-[12.5px] text-[#5f6c80] dark:text-slate-400">
              Todos los días del rango del ámbito
            </p>
            <div class="dona-con-leyenda">
              <div class="lienzo lienzo-dona"><canvas #dona></canvas></div>
              <ul class="!m-0 flex list-none flex-col gap-2 !p-0">
                @for (l of leyendaDona(); track l.texto) {
                  <li class="flex items-center gap-2.5 text-[12.5px]">
                    <span class="h-2.5 w-2.5 rounded-[3px]" [style.background]="l.color"></span>
                    <span class="min-w-[74px]">{{ l.texto }}</span>
                    <strong class="tabular-nums">{{ l.valor }}</strong>
                  </li>
                }
              </ul>
            </div>
          </div>
        </div>

        <!-- El mapa y las horas -->
        <div class="mb-4 grid gap-4 lg:grid-cols-2">
          <div [class]="estilos.tarjeta">
            <h2 [class]="estilos.titulo + ' !mb-0'">La semana, persona por día</h2>
            <p class="!mb-3 !mt-1 text-[12.5px] text-[#5f6c80] dark:text-slate-400">
              Cada cuadro es un día; el color, cómo terminó
            </p>

            <div class="overflow-x-auto">
              <div class="mapa" [style.grid-template-columns]="columnasMapa()">
                <span></span>
                @for (dia of diasDelRango(); track dia) {
                  <span class="text-center text-[11px] font-semibold text-[#5f6c80] dark:text-slate-400">{{ dia }}</span>
                }
                <span class="text-right text-[11px] font-semibold text-[#5f6c80] dark:text-slate-400">%</span>

                @for (a of d.agentes; track a.idUsuario) {
                  <span class="nombre" [title]="a.nombreAgente">{{ a.nombreCorto }}</span>
                  @for (c of a.semana; track c.fecha) {
                    <span class="cuadro-dia" [style.background]="COLOR[c.estado]"
                          [title]="a.nombreAgente + ' · ' + c.nombreDia + ': ' + c.estado.toLowerCase()"></span>
                  }
                  <strong class="text-right text-[12px] tabular-nums">{{ a.porcentajePuntualidad }}%</strong>
                }
              </div>
            </div>

            <div class="mt-3 flex flex-wrap gap-x-4 gap-y-1 border-t border-[#f1f3f6] pt-2.5 text-[11.5px] text-[#5f6c80] dark:border-slate-800 dark:text-slate-400">
              @for (l of leyendaMapa; track l.texto) {
                <span class="inline-flex items-center gap-1.5">
                  <span class="h-2.5 w-2.5 rounded-[3px]" [style.background]="l.color"></span>{{ l.texto }}
                </span>
              }
            </div>
          </div>

          <div [class]="estilos.tarjeta">
            <h2 [class]="estilos.titulo + ' !mb-0'">Horas trabajadas por persona</h2>
            <p class="!mb-3 !mt-1 text-[12.5px] text-[#5f6c80] dark:text-slate-400">
              Contra {{ jornadaTexto() }} del rango
            </p>
            <div class="lienzo lienzo-alto"><canvas #horas></canvas></div>
            <div class="mt-3 flex flex-wrap gap-x-4 gap-y-1 border-t border-[#f1f3f6] pt-2.5 text-[11.5px] text-[#5f6c80] dark:border-slate-800 dark:text-slate-400">
              <span class="inline-flex items-center gap-1.5">
                <span class="h-2.5 w-2.5 rounded-[3px] bg-[#16a34a]"></span>Cumple la jornada
              </span>
              <span class="inline-flex items-center gap-1.5">
                <span class="h-2.5 w-2.5 rounded-[3px] bg-[#f59e0b]"></span>Le falta
              </span>
              <span class="inline-flex items-center gap-1.5">
                <span class="h-2.5 w-[3px] border-l-2 border-dashed border-[#0f172a] dark:border-slate-300"></span>
                Jornada prevista
              </span>
            </div>
          </div>
        </div>

        <!-- Avisos de pausas -->
        <div [class]="estilos.tarjeta">
          <h2 [class]="estilos.titulo + ' !mb-0'">Avisos a la supervisora</h2>
          <p class="!mb-3 !mt-1 text-[12.5px] text-[#5f6c80] dark:text-slate-400">
            Exceso de break y de almuerzo. No afectan al bono: se gestionan como llamada de atención.
          </p>

          <div class="mb-2.5 flex flex-wrap items-baseline gap-x-5 gap-y-1">
            <span class="text-2xl font-extrabold tabular-nums">
              +{{ d.minutosExcesoAlmuerzo + d.minutosExcesoBreak }}<small [class]="estilos.unidad">min en total</small>
            </span>
            <span class="text-[12.5px] text-[#5f6c80] dark:text-slate-400">
              Almuerzo <strong class="tabular-nums text-[#0f172a] dark:text-slate-100">+{{ d.minutosExcesoAlmuerzo }}</strong>
              · Break <strong class="tabular-nums text-[#0f172a] dark:text-slate-100">+{{ d.minutosExcesoBreak }}</strong>
            </span>
          </div>

          <div class="flex flex-wrap gap-2">
            @for (a of d.avisos; track a.idUsuario) {
              <span class="inline-flex items-center gap-1.5 rounded-full border border-[#f3d9a4] bg-[#fef6e0] px-2.5 py-1 text-[11.5px] font-semibold text-[#92400e] dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200"
                    [title]="a.nombreAgente + ': almuerzo +' + a.excesoAlmuerzoMin + ', break +' + a.excesoBreakMin">
                {{ a.nombreCorto }} <strong class="tabular-nums">+{{ a.totalMin }}</strong>
              </span>
            } @empty {
              <span class="text-[12.5px] text-[#5f6c80] dark:text-slate-400">
                Nadie se pasó de sus pausas en el rango
              </span>
            }
          </div>
        </div>
      </div>
    }
  </div>
  `
})
export class AsistenciaDashboardComponent implements AfterViewInit, OnDestroy {
  private readonly servicio = inject(AsistenciaService);
  private readonly toast = inject(ToastService);

  protected readonly estilos = ESTILOS;
  protected readonly COLOR = COLOR;
  protected readonly duracionCorta = duracionCorta;
  protected readonly unidadDe = unidadDe;
  protected readonly enDuracion = enDuracion;

  protected readonly leyendaMapa = [
    { texto: 'Puntual', color: COLOR['PUNTUAL'] },
    { texto: 'Tarde', color: COLOR['TARDE'] },
    { texto: 'Falta', color: COLOR['FALTA'] },
    { texto: 'Incompleto', color: COLOR['INCOMPLETO'] }
  ];

  readonly idSubcartera = input<number | null>(null);
  readonly desde = input.required<string>();
  readonly hasta = input.required<string>();

  /** El botón de la cabecera lo resuelve el módulo: el rango vive allí. */
  readonly semanaAnterior = output<void>();

  readonly datos = signal<DashboardAsistencia | null>(null);
  readonly cargando = signal(false);

  readonly subtitulo = computed(() => {
    const d = this.datos();
    const rango = `${this.corta(this.desde())} – ${this.corta(this.hasta())}`;
    return d ? `${rango} · ${d.personas} personas` : rango;
  });

  private readonly lienzoLinea = viewChild<ElementRef<HTMLCanvasElement>>('linea');
  private readonly lienzoDona = viewChild<ElementRef<HTMLCanvasElement>>('dona');
  private readonly lienzoHoras = viewChild<ElementRef<HTMLCanvasElement>>('horas');

  private graficos: Chart[] = [];
  private listo = false;

  /** Verde con 80 % o más, ámbar desde 60, rojo por debajo. */
  readonly segmentos = computed(() => {
    const pct = this.datos()?.porcentajePuntualidad ?? 0;
    const color = pct >= 80 ? COLOR['PUNTUAL'] : pct >= 60 ? COLOR['TARDE'] : COLOR['FALTA'];
    const apagado = '#f1f3f6';
    return Array.from({ length: 10 }, (_, i) =>
      pct >= (i + 1) * 10 ? color : pct > i * 10 ? color + '73' : apagado);
  });

  /** La escala llega al doble del tope, así el tope cae justo a la mitad. */
  readonly porcentajeTardanza = computed(() => {
    const d = this.datos();
    if (!d || !d.minutosTopeEquipo) {
      return 0;
    }
    return Math.min(100, (d.minutosTardanzaTotal / (d.minutosTopeEquipo * 2)) * 100);
  });

  readonly leyendaDona = computed(() => {
    const d = this.datos();
    return [
      { texto: 'Puntual', valor: d?.totalPuntual ?? 0, color: COLOR['PUNTUAL'] },
      { texto: 'Tarde', valor: d?.totalTarde ?? 0, color: COLOR['TARDE'] },
      { texto: 'Falta', valor: d?.totalFalta ?? 0, color: COLOR['FALTA'] },
      { texto: 'Incompleto', valor: d?.totalIncompleto ?? 0, color: COLOR['INCOMPLETO'] }
    ];
  });

  /** Los días que de verdad tiene el rango, no los siete de siempre. */
  readonly diasDelRango = computed(() =>
    (this.datos()?.agentes[0]?.semana ?? []).map(c => c.nombreDia.slice(0, 3)));

  readonly columnasMapa = computed(() =>
    `minmax(80px, 1fr) repeat(${this.diasDelRango().length}, minmax(28px, 1fr)) 42px`);

  /** Cuántos días de cada nombre quedaron sin completar. */
  readonly diasPorCompletar = computed(() => {
    const d = this.datos();
    if (!d) {
      return [];
    }
    return d.porDia.map(p => ({ dia: p.nombreDia.slice(0, 3), pendientes: p.incompletos }))
      .slice(0, DIAS.length);
  });

  readonly jornadaTexto = computed(() => {
    const minutos = this.datos()?.agentes[0]?.minutosJornada ?? 0;
    return minutos ? `las ${duracionCorta(minutos)} ${unidadDe(minutos)}`.trim() : 'la jornada';
  });

  constructor() {
    effect(() => {
      const ambito = this.idSubcartera();
      const desde = this.desde();
      const hasta = this.hasta();
      if (!ambito) {
        this.datos.set(null);
        this.destruir();
        return;
      }
      this.cargar(desde, hasta, ambito);
    });
  }

  ngAfterViewInit(): void {
    this.listo = true;
    this.dibujar();
  }

  ngOnDestroy(): void {
    this.destruir();
  }

  private cargar(desde: string, hasta: string, idSubcartera: number): void {
    this.cargando.set(true);
    this.servicio.dashboard(desde, hasta, idSubcartera).subscribe({
      next: d => {
        this.datos.set(d);
        this.cargando.set(false);
        // Los lienzos se crean con el @if, así que hay que esperar al pintado.
        setTimeout(() => this.dibujar());
      },
      error: () => {
        this.toast.error('No se pudo cargar el dashboard');
        this.cargando.set(false);
      }
    });
  }

  private destruir(): void {
    this.graficos.forEach(g => g.destroy());
    this.graficos = [];
  }

  private corta(fecha: string): string {
    const [, mes, dia] = fecha.split('-');
    return `${dia}/${mes}`;
  }

  private dibujar(): void {
    const d = this.datos();
    if (!this.listo || !d) {
      return;
    }
    this.destruir();

    const tinta = '#5f6c80';
    const rejilla = 'rgba(100,116,139,.18)';

    // ---- Tardanza por día: área suave, que es una tendencia, no una suma ----
    const linea = this.lienzoLinea()?.nativeElement;
    if (linea) {
      this.graficos.push(new Chart(linea, {
        type: 'line',
        data: {
          labels: d.porDia.map(p => p.nombreDia.slice(0, 3)),
          datasets: [{
            data: d.porDia.map(p => p.minutosTardanza),
            borderColor: COLOR['TARDE'],
            backgroundColor: (ctx) => {
              const { ctx: c, chartArea: a } = ctx.chart;
              if (!a) {
                return 'transparent';
              }
              const grad = c.createLinearGradient(0, a.top, 0, a.bottom);
              grad.addColorStop(0, 'rgba(245,158,11,.35)');
              grad.addColorStop(1, 'rgba(245,158,11,0)');
              return grad;
            },
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: c => `${c.parsed.y} min de retraso` } }
          },
          scales: {
            x: { grid: { display: false }, ticks: { color: tinta } },
            y: { beginAtZero: true, grid: { color: rejilla }, ticks: { color: tinta, precision: 0 } }
          }
        }
      }));
    }

    // ---- Reparto de los días: dona con el total al centro ----
    const dona = this.lienzoDona()?.nativeElement;
    if (dona) {
      const total = d.totalPuntual + d.totalTarde + d.totalFalta + d.totalIncompleto;
      this.graficos.push(new Chart(dona, {
        type: 'doughnut',
        data: {
          labels: ['Puntual', 'Tarde', 'Falta', 'Incompleto'],
          datasets: [{
            data: [d.totalPuntual, d.totalTarde, d.totalFalta, d.totalIncompleto],
            backgroundColor: [COLOR['PUNTUAL'], COLOR['TARDE'], COLOR['FALTA'], COLOR['INCOMPLETO']],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '68%',
          plugins: { legend: { display: false } }
        },
        plugins: [{
          // El total al centro: es la cifra que se busca al mirar una dona.
          id: 'totalAlCentro',
          afterDraw(chart) {
            const { ctx, chartArea } = chart;
            if (!chartArea) {
              return;
            }
            const x = (chartArea.left + chartArea.right) / 2;
            const y = (chartArea.top + chartArea.bottom) / 2;
            ctx.save();
            ctx.textAlign = 'center';
            ctx.fillStyle = getComputedStyle(chart.canvas).color || '#0f172a';
            ctx.font = '800 26px "Plus Jakarta Sans", sans-serif';
            ctx.fillText(String(total), x, y);
            ctx.font = '600 11px "Plus Jakarta Sans", sans-serif';
            ctx.fillStyle = tinta;
            ctx.fillText('días', x, y + 16);
            ctx.restore();
          }
        }]
      }));
    }

    // ---- Horas por persona: barras con la jornada prevista marcada ----
    const horas = this.lienzoHoras()?.nativeElement;
    if (horas) {
      const jornada = d.agentes[0]?.minutosJornada ?? 0;
      this.graficos.push(new Chart(horas, {
        type: 'bar',
        data: {
          labels: d.agentes.map(a => a.nombreCorto),
          datasets: [{
            data: d.agentes.map(a => a.minutosTrabajados),
            backgroundColor: d.agentes.map(a =>
              a.minutosJornada && a.minutosTrabajados >= a.minutosJornada
                ? COLOR['PUNTUAL'] : COLOR['TARDE']),
            borderRadius: 999,
            borderSkipped: 'start',
            barThickness: 14
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: c => {
                  const a = d.agentes[c.dataIndex];
                  return `${a.horasTrabajadas} de ${a.jornada ?? '—'}`;
                }
              }
            }
          },
          scales: {
            x: {
              beginAtZero: true,
              grid: { color: rejilla },
              ticks: { color: tinta, callback: v => `${Math.round(Number(v) / 60)} h` }
            },
            y: { grid: { display: false }, ticks: { color: tinta } }
          }
        },
        plugins: [{
          // La jornada prevista, como raya: el objetivo se ve sin leer números.
          id: 'jornadaPrevista',
          afterDatasetsDraw(chart) {
            if (!jornada) {
              return;
            }
            const { ctx, chartArea, scales } = chart;
            const x = scales['x'].getPixelForValue(jornada);
            ctx.save();
            ctx.setLineDash([5, 4]);
            ctx.strokeStyle = '#0f172a';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(x, chartArea.top);
            ctx.lineTo(x, chartArea.bottom);
            ctx.stroke();
            ctx.restore();
          }
        }]
      }));
    }
  }
}
