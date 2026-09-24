import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';

import {
  EstadoAgentesReportService, ResumenPorAgente, RegistroEstadoDTO
} from '../reports/estado-agentes-report/estado-agentes-report.service';
import {
  Col, TramoTL, COLS, GRUPOS, RAYADO, etiquetaGrupo, numCol, textoCol, formatSeg,
  composicion, desglose, colorOcupacion, fondoOcupacion, colorOcioso, fondoOcioso,
  tramosDeAgente, ventanaDe, construirLinea, ejeHoras
} from '../reports/estado-agentes-report/estado-agentes-catalogo';
import { AuthService } from '../../core/services/auth.service';
import { AgentStatusService } from '../../core/services/agent-status.service';
import { AgentState } from '../../core/models/agent-status.model';

/**
 * Mis Tiempos: la jornada del propio asesor.
 *
 * Arranca resumida y el asesor agrega las columnas que quiera desde el panel de la
 * derecha. Los datos salen de /mis-tiempos, que acota por el usuario del token: no hay
 * forma de pedir la jornada de otro.
 *
 * Al entrar, el sistema lo pone en Consulta de tiempos; al salir vuelve a En linea.
 */
@Component({
  selector: 'app-mis-tiempos',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="min-h-full bg-[#f6f7f9] font-['Plus_Jakarta_Sans',ui-sans-serif,system-ui,sans-serif]
                text-[#0f172a] p-4 md:p-5 dark:bg-slate-950 dark:text-slate-100">

      <!-- Cabecera -->
      <div class="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 class="!m-0 text-xl font-extrabold tracking-[-0.015em]">Mis Tiempos</h1>
          <p class="mt-1 text-[12.5px] text-[#5f6c80] dark:text-slate-400">{{ subtitulo() }}</p>
        </div>
        <div class="flex items-end gap-2">
          <div class="flex flex-col gap-1.5">
            <label for="mt-fecha" class="text-[11px] font-bold uppercase tracking-[0.05em] text-[#5f6c80]
                                         dark:text-slate-400">Fecha</label>
            <input id="mt-fecha" type="date" [(ngModel)]="fecha" (ngModelChange)="buscar()"
              class="h-9 rounded-lg border border-[#d5dbe3] bg-white px-3 text-[13px] font-semibold
                     outline-none focus:border-[#2563eb] dark:border-slate-700 dark:bg-slate-900
                     dark:text-slate-100"/>
          </div>
          <button type="button" (click)="buscar()" [disabled]="cargando() || !fecha"
            class="inline-flex h-9 items-center gap-2 rounded-lg bg-[#0f172a] px-4 text-[12.5px] font-bold
                   text-white transition-colors hover:bg-[#1e293b] disabled:cursor-not-allowed
                   disabled:opacity-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200">
            @if (cargando()) {
              <lucide-angular name="loader-2" [size]="15" class="animate-spin"></lucide-angular> Cargando
            } @else {
              <lucide-angular name="search" [size]="15"></lucide-angular> Ver
            }
          </button>
        </div>
      </div>

      @if (cargando()) {
        <div class="rounded-xl border border-[#e6e9ee] bg-white px-6 py-12 text-center
                    dark:border-slate-800 dark:bg-slate-900">
          <lucide-angular name="loader-2" [size]="28" class="mx-auto mb-2 animate-spin text-[#8491a3]"></lucide-angular>
          <p class="text-[13px] text-[#5f6c80]">Cargando tu jornada…</p>
        </div>
      } @else if (error()) {
        <div class="rounded-xl border border-[#f3d3d0] bg-[#f9e6e4] px-6 py-8 text-center">
          <p class="text-[13px] font-semibold text-[#b91c1c]">No se pudieron cargar tus tiempos.</p>
          <p class="mt-1 text-[12px] text-[#5f6c80]">Volvé a intentar en un momento.</p>
        </div>
      } @else if (yo(); as a) {

        <!-- Tiempos de la jornada -->
        <div class="mb-3 grid grid-cols-2 gap-2.5 md:grid-cols-3 lg:grid-cols-5">
          <div [class]="claseKpi">
            <span [class]="claseKpiK">Conectado</span>
            <span [class]="claseKpiV">{{ fmt(a.totalSegundosConectado) }}</span>
            <span [class]="claseKpiS">tu jornada de hoy</span>
          </div>
          <div [class]="claseKpi">
            <span [class]="claseKpiK">En cola</span>
            <span [class]="claseKpiV + ' text-[#2563eb]'">{{ fmt(a.totalSegundosEnCola) }}</span>
            <span [class]="claseKpiS">disponible para llamadas</span>
          </div>
          <div [class]="claseKpi">
            <span [class]="claseKpiK">Fuera de la cola</span>
            <span [class]="claseKpiV">{{ fmt(a.totalSegundosFueraDeCola) }}</span>
            <span [class]="claseKpiS">otras tareas, reuniones y pausas</span>
          </div>
          <div [class]="claseKpi">
            <span [class]="claseKpiK">Productivo</span>
            <span [class]="claseKpiV + ' text-[#15803d]'">{{ fmt(a.totalSegundosProductivo) }}</span>
            <span [class]="claseKpiS">llamada, tipificación y seguimiento</span>
          </div>
          <div [class]="claseKpi">
            <span [class]="claseKpiK">Ocioso</span>
            <span [class]="claseKpiV + ' ' + colorOcioso(a.porcentajeOcioso)">{{ fmt(a.totalSegundosOcioso) }}</span>
            <span [class]="claseKpiS">en cola esperando llamada</span>
          </div>
        </div>

        <!-- Línea de tiempo -->
        @if (linea().length > 0) {
          <section class="mb-3 flex flex-col gap-2 rounded-xl border border-[#e6e9ee] bg-white px-4 py-3.5
                          dark:border-slate-800 dark:bg-slate-900">
            <div class="flex flex-wrap items-center gap-2">
              <h2 class="!m-0 text-[13px] font-extrabold tracking-[-0.01em]">Tu jornada</h2>
              <div class="flex h-8 items-center rounded-lg border border-[#d5dbe3] bg-white p-[3px]
                          dark:border-slate-700 dark:bg-slate-900">
                <button type="button" (click)="cambiarZoom(-1, cajaTL)" [disabled]="zoom() === ZOOMS[0]"
                        aria-label="Alejar"
                        class="flex h-full w-7 items-center justify-center rounded-[5px] text-[#5f6c80]
                               hover:bg-[#f4f6f9] disabled:opacity-40 dark:hover:bg-slate-800">
                  <lucide-angular name="minus" [size]="14"></lucide-angular>
                </button>
                <span class="w-9 text-center text-[11.5px] font-bold tabular-nums">{{ zoom() }}x</span>
                <button type="button" (click)="cambiarZoom(1, cajaTL)"
                        [disabled]="zoom() === ZOOMS[ZOOMS.length - 1]" aria-label="Acercar"
                        class="flex h-full w-7 items-center justify-center rounded-[5px] text-[#5f6c80]
                               hover:bg-[#f4f6f9] disabled:opacity-40 dark:hover:bg-slate-800">
                  <lucide-angular name="plus" [size]="14"></lucide-angular>
                </button>
              </div>
              @if (zoom() > 1) {
                <button type="button" (click)="ajustarZoom(cajaTL)"
                        class="h-8 rounded-lg border border-[#d5dbe3] bg-white px-3 text-[11.5px] font-bold
                               text-[#5f6c80] hover:border-[#8491a3] dark:border-slate-700 dark:bg-slate-900">
                  Ver todo el día
                </button>
              }
              <span class="ml-auto flex items-center gap-1.5 text-[11.5px] font-semibold text-[#334155]
                           dark:text-slate-300">
                <span class="h-2.5 w-2.5 rounded-[3px] border border-[#d5dbe3]" [style.background]="RAYADO"></span>
                Fuera del sistema
              </span>
            </div>

            <div #cajaTL class="overflow-x-auto overflow-y-hidden rounded-[10px] border border-[#e6e9ee]
                                bg-[#f8fafc] pb-1.5 dark:border-slate-800 dark:bg-slate-950">
              <div [style.width.%]="zoom() * 100">
                <div class="relative h-[72px] overflow-hidden">
                  @for (s of linea(); track $index) {
                    <div class="absolute top-0 bottom-0 flex items-center justify-center overflow-hidden
                                border-r-2 border-white dark:border-slate-900"
                         [style.left.%]="s.left" [style.width.%]="s.width" [style.background]="s.color"
                         [title]="s.titulo">
                      @if (cabeEtiqueta(s.width)) {
                        <span [class]="'whitespace-nowrap px-1 text-[10px] font-bold ' +
                                       (s.claro ? 'text-[#3b2a00]' : 'text-white [text-shadow:0_1px_1px_rgba(15,23,42,.25)]')">
                          {{ s.label }}@if (s.hueco) {<span class="font-semibold"> · {{ s.duracion }}</span>}
                        </span>
                      }
                    </div>
                  }
                </div>
                <div class="relative h-[18px]">
                  @for (h of eje(); track h.left) {
                    <i class="absolute top-0 block h-1.5 w-px bg-[#d5dbe3]" [style.left.%]="h.left"></i>
                    <span class="absolute top-[7px] -translate-x-1/2 text-[10px] font-semibold tabular-nums
                                 text-[#8491a3]" [style.left.%]="h.left">{{ h.l }}</span>
                  }
                </div>
              </div>
            </div>
          </section>
        }

        <!-- Tabla + panel de columnas -->
        <div class="flex flex-col gap-2.5 lg:flex-row lg:items-start">
          <div class="flex min-w-0 flex-1 flex-col gap-2">
            <div class="flex items-center justify-between gap-3">
              <span class="text-[12px] text-[#5f6c80] dark:text-slate-400">
                Mostrando <b class="font-bold tabular-nums text-[#0f172a] dark:text-slate-100">{{ visibles().length }}</b>
                de {{ COLS.length }} columnas
              </span>
              <button type="button" (click)="panel.set(!panel())" [attr.aria-expanded]="panel()"
                aria-controls="panel-columnas"
                class="inline-flex h-8 items-center gap-2 rounded-lg border border-[#d5dbe3] bg-white px-3
                       text-[12px] font-bold text-[#5f6c80] hover:border-[#8491a3] dark:border-slate-700
                       dark:bg-slate-900">
                <lucide-angular name="columns" [size]="14"></lucide-angular>
                Columnas
              </button>
            </div>

            <div class="overflow-x-auto rounded-xl border border-[#e6e9ee] bg-white dark:border-slate-800
                        dark:bg-slate-900">
              <table class="w-full border-separate border-spacing-0 text-[12.5px] tabular-nums">
                <thead>
                  <tr>
                    <th [class]="claseTh + ' text-left'">Fecha</th>
                    @for (c of visibles(); track c.k) {
                      <th [class]="claseTh + (c.sep ? ' border-l border-l-[#e6e9ee] dark:border-l-slate-800' : '')">
                        {{ c.l }}
                      </th>
                    }
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td [class]="claseTd + ' text-left'">
                      <span class="block font-bold text-[#0f172a] dark:text-slate-100">{{ fecha }}</span>
                      <span class="text-[10.5px] font-semibold text-[#8491a3]">{{ diaSemana() }}</span>
                    </td>
                    @for (c of visibles(); track c.k) {
                      <td [class]="claseTd + (c.sep ? ' border-l border-l-[#e6e9ee] dark:border-l-slate-800' : '')
                                   + (c.fuerte ? ' font-extrabold text-[#0f172a] dark:text-slate-100' : '')">
                        @switch (c.tipo) {
                          @case ('comp') {
                            <span class="inline-flex h-2.5 w-[150px] gap-[2px] overflow-hidden rounded-full
                                         bg-[#e2e8f0] shadow-[inset_0_1px_2px_rgba(15,23,42,0.08)] dark:bg-slate-800"
                                  role="img" aria-label="Composición de tu jornada">
                              @for (p of composicion(a); track p.k) {
                                <i class="block h-full" [style.width.%]="p.pct" [style.background]="p.color"
                                   [title]="p.titulo"></i>
                              }
                            </span>
                          }
                          @case ('ind') {
                            <span class="inline-flex min-w-[56px] flex-col gap-1">
                              <b [class]="'text-[12px] font-extrabold ' + colorInd(c.k, num(a, c.k))">{{ num(a, c.k) }}%</b>
                              <span class="h-1 overflow-hidden rounded-full bg-[#e2e8f0] dark:bg-slate-800">
                                <i class="block h-full rounded-full" [class]="fondoInd(c.k, num(a, c.k))"
                                   [style.width.%]="min100(num(a, c.k))"></i>
                              </span>
                            </span>
                          }
                          @default { {{ texto(a, c) }} }
                        }
                      </td>
                    }
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          @if (panel()) {
            <aside id="panel-columnas"
                   class="w-full shrink-0 overflow-hidden rounded-xl border border-[#e6e9ee] bg-white
                          lg:w-[248px] dark:border-slate-800 dark:bg-slate-900">
              <div class="border-b border-[#e6e9ee] bg-[#f8fafc] px-3 py-2 text-[12px] font-extrabold
                          dark:border-slate-800 dark:bg-slate-800">Columnas</div>
              <div class="max-h-[340px] overflow-y-auto py-1">
                @for (g of grupos; track g.g) {
                  <div class="px-3 pb-1 pt-2.5 text-[9.5px] font-extrabold uppercase tracking-[0.1em]
                              text-[#8491a3]">{{ etiquetaGrupo(g.g) }}</div>
                  @for (c of g.cols; track c.k) {
                    <label class="flex cursor-pointer items-center justify-between gap-2 px-3 py-1 text-[12px]
                                  hover:bg-[#f8fafc] dark:hover:bg-slate-800"
                           [class.font-bold]="elegidas().includes(c.k)"
                           [class.text-\[#2563eb\]]="elegidas().includes(c.k)">
                      {{ c.l }}
                      <input type="checkbox" [checked]="elegidas().includes(c.k)" (change)="alternar(c.k)"
                             class="shrink-0 rounded border-[#c5ccd6] text-[#2563eb]"/>
                    </label>
                  }
                }
              </div>
              <div class="flex gap-1.5 border-t border-[#e6e9ee] bg-[#f8fafc] px-3 py-2 dark:border-slate-800
                          dark:bg-slate-800">
                <button type="button" (click)="soloResumen()" [class]="claseMini">Solo resumen</button>
                <button type="button" (click)="todas()" [class]="claseMini">Todas</button>
              </div>
            </aside>
          }
        </div>

        <!-- Desglose -->
        <div class="mt-3 grid gap-2.5 [grid-template-columns:repeat(auto-fit,minmax(196px,1fr))]">
          @for (b of desglose(a); track b.g) {
            <div class="flex flex-col gap-1.5 rounded-xl border border-[#e6e9ee] bg-white px-3 py-2.5
                        dark:border-slate-800 dark:bg-slate-900">
              <h3 class="!m-0 flex items-center gap-1.5 text-[10.5px] font-extrabold uppercase tracking-[0.06em]
                         text-[#5f6c80] dark:text-slate-400">
                <span class="h-2.5 w-2.5 rounded-[3px]" [style.background]="b.color"></span>{{ b.l }}
              </h3>
              @for (f of b.filas; track f.l) {
                <div class="flex justify-between gap-2.5 text-[12px] font-medium text-[#5f6c80] dark:text-slate-400">
                  <span>{{ f.l }}</span>
                  <b [class]="'tabular-nums font-bold ' + (f.v ? 'text-[#0f172a] dark:text-slate-100' : 'font-medium text-[#8491a3]')">
                    {{ f.v ? fmt(f.v) : '—' }}
                  </b>
                </div>
              }
              <div class="mt-0.5 flex justify-between gap-2.5 border-t border-[#e6e9ee] pt-1.5 text-[12px]
                          font-medium text-[#334155] dark:border-slate-800 dark:text-slate-300">
                <span>Total</span>
                <b class="font-bold tabular-nums text-[#0f172a] dark:text-slate-100">{{ fmt(b.total) }}</b>
              </div>
            </div>
          }
        </div>

      } @else {
        <div class="rounded-xl border border-dashed border-[#c5ccd6] bg-white px-6 py-12 text-center
                    dark:border-slate-700 dark:bg-slate-900">
          <lucide-angular name="inbox" [size]="40" class="mx-auto mb-2 text-[#c5ccd6]"></lucide-angular>
          <p class="text-[13px] text-[#5f6c80]">No tenés actividad registrada ese día.</p>
        </div>
      }
    </div>
  `,
  styles: []
})
export class MisTiemposComponent implements OnInit, OnDestroy {

  // ---------- sistema visual (el mismo de Bot de voz) ----------
  readonly claseKpi =
    'flex flex-col gap-0.5 rounded-xl border border-[#e6e9ee] bg-white px-3.5 py-3 dark:border-slate-800 dark:bg-slate-900';
  readonly claseKpiK = 'text-[11px] font-bold uppercase tracking-[0.05em] text-[#5f6c80] dark:text-slate-400';
  readonly claseKpiV = 'text-[24px] font-extrabold leading-tight tracking-[-0.025em] tabular-nums';
  readonly claseKpiS = 'mt-auto text-[11px] font-medium text-[#8491a3]';
  readonly claseTh =
    'whitespace-nowrap border-b border-[#e6e9ee] bg-[#f8fafc] px-3 py-2.5 text-center text-[11px] font-bold ' +
    'uppercase tracking-[0.05em] text-[#5f6c80] dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400';
  readonly claseTd =
    'whitespace-nowrap border-b border-[#e6e9ee] px-3 py-2.5 text-center font-medium text-[#334155] ' +
    'dark:border-slate-800 dark:text-slate-300';
  readonly claseMini =
    'flex-1 rounded-md border border-[#d5dbe3] bg-white px-2 py-1 text-[10.5px] font-bold text-[#5f6c80] ' +
    'hover:border-[#2563eb] hover:text-[#2563eb] dark:border-slate-700 dark:bg-slate-900';

  // ---------- catalogo compartido ----------
  readonly COLS = COLS;
  readonly GRUPOS = GRUPOS;
  readonly RAYADO = RAYADO;
  readonly ZOOMS = [1, 2, 4, 8];
  readonly etiquetaGrupo = etiquetaGrupo;
  readonly composicion = composicion;
  readonly desglose = desglose;
  readonly num = numCol;
  readonly texto = textoCol;
  readonly fmt = formatSeg;
  readonly colorOcioso = colorOcioso;

  /** Columnas del panel, agrupadas como en la tabla del supervisor. */
  readonly grupos = COLS.reduce((acc, c) => {
    const ultimo = acc[acc.length - 1];
    if (ultimo && ultimo.g === c.g) ultimo.cols.push(c);
    else acc.push({ g: c.g, cols: [c] });
    return acc;
  }, [] as { g: Col['g']; cols: Col[] }[]);

  /** Arranque: lo que el asesor necesita ver sin pedir nada. */
  private readonly RESUMEN = ['con', 'cola', 'inter', 'tipi', 'ocio', 'fuera', 'pausas', 'prod'];

  // ---------- estado ----------
  fecha = '';
  cargando = signal(false);
  error = signal(false);
  yo = signal<ResumenPorAgente | null>(null);
  tramos = signal<RegistroEstadoDTO[]>([]);
  elegidas = signal<string[]>(this.RESUMEN);
  panel = signal(true);
  zoom = signal(1);

  visibles = computed(() => this.COLS.filter(c => this.elegidas().includes(c.k)));

  private tramosCrudos = computed(() => {
    const a = this.yo();
    return a ? tramosDeAgente(this.tramos(), a.idUsuario, this.fecha) : [];
  });
  private ventana = computed(() => ventanaDe(this.tramosCrudos()));
  linea = computed<TramoTL[]>(() => construirLinea(this.tramosCrudos(), this.ventana().desde, this.ventana().hasta));
  eje = computed(() => ejeHoras(this.ventana().desde, this.ventana().hasta, this.zoom()));

  constructor(
    private reporteService: EstadoAgentesReportService,
    private auth: AuthService,
    private agentStatus: AgentStatusService
  ) {}

  ngOnInit(): void {
    const hoy = new Date();
    this.fecha = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;
    this.buscar();
    this.marcarConsultando();
  }

  ngOnDestroy(): void {
    this.volverAEnLinea();
  }

  // ---------- estado del asesor mientras mira sus tiempos ----------
  /**
   * Mientras esta en esta pantalla no esta en la cola: CONSULTA_TIEMPOS lo saca del
   * discador y ademas mide cuanto tiempo pasa mirando sus propios numeros.
   * Si esta en llamada o tipificando, el backend rechaza el cambio y no pasa nada.
   */
  private marcarConsultando(): void {
    const id = this.auth.getCurrentUserId();
    if (!id) return;
    this.agentStatus.changeStatus(id, {
      estado: AgentState.CONSULTA_TIEMPOS,
      notas: 'Entró a Mis Tiempos'
    }).subscribe({ error: () => {} });
  }

  /** Solo si sigue en CONSULTA_TIEMPOS: no le pisa un estado que haya elegido despues. */
  private volverAEnLinea(): void {
    const id = this.auth.getCurrentUserId();
    if (!id) return;
    if (this.agentStatus.getCurrentStatus()?.estadoActual !== AgentState.CONSULTA_TIEMPOS) return;

    this.agentStatus.changeStatus(id, {
      estado: AgentState.EN_LINEA,
      notas: 'Salió de Mis Tiempos'
    }).subscribe({ error: () => {} });
  }

  // ---------- datos ----------
  buscar(): void {
    if (!this.fecha) return;
    this.cargando.set(true);
    this.error.set(false);
    this.zoom.set(1);

    this.reporteService.getMisTiempos(this.fecha).subscribe({
      next: (res) => {
        this.yo.set(res.resumen?.agentes?.[0] ?? null);
        this.tramos.set(res.registros ?? []);
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error cargando mis tiempos:', err);
        this.error.set(true);
        this.cargando.set(false);
      }
    });
  }

  // ---------- panel de columnas ----------
  alternar(k: string): void {
    const actuales = this.elegidas();
    this.elegidas.set(actuales.includes(k) ? actuales.filter(x => x !== k) : [...actuales, k]);
  }

  soloResumen(): void {
    this.elegidas.set([...this.RESUMEN]);
  }

  todas(): void {
    this.elegidas.set(this.COLS.map(c => c.k));
  }

  // ---------- linea de tiempo ----------
  cabeEtiqueta(anchoPct: number): boolean {
    return anchoPct * this.zoom() > 5;
  }

  cambiarZoom(delta: number, caja: HTMLElement): void {
    const actual = this.zoom();
    const i = this.ZOOMS.indexOf(actual);
    const nuevo = this.ZOOMS[Math.max(0, Math.min(this.ZOOMS.length - 1, i + delta))];
    if (nuevo === actual) return;

    const centro = (caja.scrollLeft + caja.clientWidth / 2) / (caja.clientWidth * actual);
    this.zoom.set(nuevo);
    requestAnimationFrame(() => {
      caja.scrollLeft = centro * caja.clientWidth * nuevo - caja.clientWidth / 2;
    });
  }

  ajustarZoom(caja: HTMLElement): void {
    this.zoom.set(1);
    requestAnimationFrame(() => { caja.scrollLeft = 0; });
  }

  // ---------- helpers de plantilla ----------
  subtitulo(): string {
    const a = this.yo();
    const user = this.auth.getCurrentUser();
    const nombre = user ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.username : '';
    if (!a) return nombre;
    return `${nombre} · entrada ${a.horaEntrada || '—'} · última actividad ${a.horaSalida || '—'}`;
  }

  diaSemana(): string {
    if (!this.fecha) return '';
    const [y, m, d] = this.fecha.split('-').map(Number);
    return ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'][new Date(y, m - 1, d).getDay()];
  }

  min100(v: number): number {
    return Math.max(0, Math.min(100, v));
  }

  colorInd(k: string, v: number): string {
    return k === 'pOcup' ? colorOcupacion(v) : colorOcioso(v);
  }

  fondoInd(k: string, v: number): string {
    return k === 'pOcup' ? fondoOcupacion(v) : fondoOcioso(v);
  }
}
