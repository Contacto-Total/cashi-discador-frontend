import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { ToastService } from '../../shared/services/toast.service';
import { AsistenciaService } from './asistencia.service';
import {
  AsistenciaDia,
  AsistenciaReporte,
  ResumenAgente,
  SemanaAgente,
  TipoMarcacion
} from './asistencia.models';
import { ESTADOS, ESTILOS, estadoVisible, textoLimite } from './asistencia.estilos';

/** El cuadro de cada día en la cinta: color pleno, el mismo de los gráficos. */
const COLOR_DIA: Record<string, string> = {
  PUNTUAL: 'bg-[#16a34a]',
  TARDE: 'bg-[#f59e0b]',
  FALTA: 'bg-[#dc2626]',
  INCOMPLETO: 'bg-[#8491a3]',
  JUSTIFICADO: 'bg-[#6366f1]',
  NO_LABORABLE: 'bg-[#e6e9ee] !text-[#5f6c80]'
};

/**
 * Reporte de asistencia: la semana de una persona a la vez.
 *
 * Sustituye al tab «Asistencia» del reporte de estados, que tomaba como hora de
 * ingreso el momento en que el asesor abría la pantalla de agente y la comparaba
 * contra una hora escrita a mano, la misma para todos.
 *
 * Se muestra a una sola persona porque es como se revisa: apiladas, las tablas
 * obligaban a bajar media pantalla para llegar a la siguiente y no dejaban sitio
 * para el resumen. El campo de agente busca y elige a la vez, y las flechas
 * caminan el roster.
 *
 * Una raya gris significa que NO hay marca; se completa en «Corregir
 * marcaciones», que exige un motivo. Una celda con punto ámbar es una marca
 * escrita a mano: la hoja actual no distingue lo uno de lo otro más que por el
 * color, y no guarda quién la escribió.
 */
@Component({
  selector: 'app-asistencia-reporte',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  styles: [`
    :host { display: block; }
    .aparecer { animation: aparecer .18s ease-out }
    @keyframes aparecer { from { opacity: 0; transform: translateY(3px) } to { opacity: 1; transform: none } }
    /* Barra con meta: la medida encima de la pista y la raya del tope al medio. */
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
    /* La marca escrita a mano: el amarillo de la hoja, dicho con un punto. */
    .manual { position: relative; padding-right: 16px }
    .manual::after {
      content: ""; position: absolute; right: 4px; top: 50%; transform: translateY(-50%);
      width: 6px; height: 6px; border-radius: 999px; background: #d97706;
    }
    /* La raya de «sin marca», en gris: no es un dato. */
    .sin-marca { color: #8491a3 }
    :host-context(.dark) .sin-marca { color: #64748b }
  `],
  template: `
    <div class="px-7 py-5">
        @if (!idSubcartera()) {
          <div [class]="estilos.vacio">
            <strong class="block text-[13.5px]">Elige un cliente, una cartera o una subcartera</strong>
            <span class="text-[12.5px] text-[#5f6c80] dark:text-slate-400">
              El reporte se consulta por ámbito. Así no se trae a toda la empresa de golpe.
            </span>
          </div>
        } @else if (cargando()) {
          <p class="py-16 text-center text-[13px] text-[#5f6c80] dark:text-slate-400">Cargando asistencia…</p>
        } @else if (roster().length === 0) {
          <div [class]="estilos.vacio">
            <strong class="block text-[13.5px]">Nadie en ese ámbito</strong>
            <span class="text-[12.5px] text-[#5f6c80] dark:text-slate-400">
              Prueba con otra cartera o subcartera.
            </span>
          </div>
        } @else if (persona(); as p) {
          <div class="aparecer">

            <!-- Quién se está viendo y por dónde va del roster -->
            <div class="mb-3 flex flex-wrap items-center justify-between gap-3 px-0.5">
              <div>
                <h2 class="!m-0 flex flex-wrap items-center gap-[9px] text-[20px] font-extrabold tracking-[-0.01em]">
                  {{ p.nombreAgente }}
                  @if (p.rol) {
                    <span [class]="p.rol === 'Supervisor' ? estilos.rolSupervisor : estilos.rolAsesor">
                      {{ p.rol }}
                    </span>
                  }
                </h2>
                <p class="mt-[3px] text-[11.5px] text-[#5f6c80] dark:text-slate-400">{{ rangoTexto() }}</p>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="text-[11.5px] text-[#5f6c80] dark:text-slate-400">
                  {{ indice() + 1 }} de {{ roster().length }}
                </span>
                <button type="button" [class]="estilos.botonIcono" (click)="mover(-1)"
                        [disabled]="indice() === 0" aria-label="Persona anterior">
                  <lucide-angular name="chevron-left" [size]="14" class="block"></lucide-angular>
                </button>
                <button type="button" [class]="estilos.botonIcono" (click)="mover(1)"
                        [disabled]="indice() === roster().length - 1" aria-label="Persona siguiente">
                  <lucide-angular name="chevron-right" [size]="14" class="block"></lucide-angular>
                </button>
              </div>
            </div>

            <!-- Resumen: lo que hoy hay que sumar leyendo la tabla -->
            <div class="mb-3.5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              <div [class]="estilos.tarjeta">
                <div class="mb-2 flex items-center gap-[9px]">
                  <span [class]="estilos.icono">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4.5" width="18" height="16" rx="2"/><path d="M8 2.5v4M16 2.5v4M3 10h18"/></svg>
                  </span>
                  <h3 [class]="estilos.rotulo">Puntualidad</h3>
                </div>
                <div [class]="estilos.cifra">{{ puntualidad() }}<small [class]="estilos.unidad">%</small></div>
                <!-- Una semana: un cuadro por día, con su letra. Más de una: cuadritos
                     del mismo alto, para que un rango largo no los vuelva barras. -->
                <div [class]="estilos.banda">
                  @if (cintaCompacta()) {
                    <div class="flex w-full flex-wrap gap-[2px]">
                      @for (d of diasCinta(); track d.fecha) {
                        <span class="h-2.5 w-2.5 rounded-[2px]" [class]="COLOR_DIA[estadoVisible(d)]"
                              [title]="(d.fecha | date: 'dd/MM') + ' ' + d.nombreDia + ' · ' + (d.tipoDia ?? ESTADOS[estadoVisible(d)].texto)"></span>
                      }
                    </div>
                  } @else {
                    <div class="flex w-full gap-[5px]">
                      @for (d of diasCinta(); track d.fecha) {
                        <span class="flex h-[26px] flex-1 items-center justify-center rounded-md text-[11px] font-bold text-white"
                              [class]="COLOR_DIA[estadoVisible(d)]"
                              [title]="(d.fecha | date: 'dd/MM') + ' ' + d.nombreDia + ' · ' + (d.tipoDia ?? ESTADOS[estadoVisible(d)].texto)">
                          {{ d.nombreDia.slice(0, 2) }}
                        </span>
                      }
                    </div>
                  }
                </div>
                <p [class]="estilos.pie">
                  {{ diasPuntuales() }} de {{ diasLaborables() }}
                  {{ diasLaborables() === 1 ? 'día' : 'días' }} ·
                  {{ diasFalta() }} {{ diasFalta() === 1 ? 'falta' : 'faltas' }}
                </p>
              </div>

              <div [class]="estilos.tarjeta">
                <div class="mb-2 flex items-center gap-[9px]">
                  <span [class]="estilos.icono">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7.5V12l3 1.8"/></svg>
                  </span>
                  <h3 [class]="estilos.rotulo">{{ variasSemanas() ? 'Tardanza del período' : 'Tardanza de la semana' }}</h3>
                </div>
                <div [class]="estilos.cifra">
                  {{ duracionCorta(minutosTardanza()) }}<small [class]="estilos.unidad">{{ unidadDe(minutosTardanza()) }}</small>
                </div>
                <div [class]="estilos.banda + ' mb-4'">
                  <div class="relative w-full">
                    <div class="barra-tope" role="img"
                         [style.--valor]="porcentajeTardanza() + '%'"
                         [style.--color]="pasaTope() ? '#dc2626' : '#16a34a'"
                         [attr.aria-label]="'Tardanza ' + enDuracion(minutosTardanza()) + ', tope ' + enDuracion(tope())"></div>
                    <span class="absolute left-1/2 top-[20px] -translate-x-1/2 whitespace-nowrap text-[10px] leading-none text-[#5f6c80] dark:text-slate-400">
                      tope {{ enDuracion(tope()) }}
                    </span>
                  </div>
                </div>
                <p [class]="estilos.pie">{{ limiteTexto() }}</p>
              </div>

              <div [class]="estilos.tarjeta">
                <div class="mb-2 flex items-center gap-[9px]">
                  <span [class]="estilos.icono">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 20h18"/><rect x="5" y="11" width="3.5" height="6" rx="1"/><rect x="10.2" y="7" width="3.5" height="10" rx="1"/><rect x="15.4" y="4" width="3.5" height="13" rx="1"/></svg>
                  </span>
                  <h3 [class]="estilos.rotulo">Horas trabajadas</h3>
                </div>
                <div [class]="estilos.cifra">
                  {{ duracionCorta(minutosTrabajados()) }}<small [class]="estilos.unidad">de {{ duracionCorta(minutosJornada()) }}</small>
                </div>
                <!-- Diez segmentos, uno por cada 10 % de la jornada. -->
                <div [class]="estilos.banda">
                  <div class="flex w-full gap-[3px]">
                    @for (s of segmentos(); track $index) {
                      <span class="h-3 flex-1 rounded-[3px]" [class]="s"></span>
                    }
                  </div>
                </div>
                <p [class]="estilos.pie">{{ porcentajeJornada() }}% de la jornada</p>
              </div>

              <div [class]="estilos.tarjeta">
                <div class="mb-2 flex items-center gap-[9px]">
                  <span [class]="estilos.icono">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8.5h13v4.5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8.5z"/><path d="M17 10h1.5a2 2 0 0 1 0 4H17"/><path d="M7 3v2.5M11 3v2.5"/></svg>
                  </span>
                  <h3 [class]="estilos.rotulo">Exceso de pausas</h3>
                </div>
                <div [class]="estilos.cifra">
                  {{ excesoTotal() > 0 ? '+' + excesoTotal() : '0' }}<small [class]="estilos.unidad">min</small>
                </div>
                <div [class]="estilos.banda + ' h-auto min-h-[26px]'">
                  <div class="mb-1 mt-2.5 flex w-full flex-wrap gap-x-3.5 gap-y-1 text-[11.5px] text-[#5f6c80] dark:text-slate-400">
                    <span class="inline-flex items-center gap-[5px]">
                      <svg width="15" height="15" class="shrink-0 text-[#8491a3]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 3v6a2.5 2.5 0 0 0 5 0V3"/><path d="M7.5 9v12"/><path d="M17.5 3c-1.4 1.8-2 3.6-2 5.6 0 1.6.7 2.4 2 2.4h1V3z"/><path d="M18.5 11v10"/></svg>
                      Almuerzo <strong class="tabular-nums !text-[#0f172a] dark:!text-slate-100">+{{ excesoAlmuerzo() }}</strong>
                    </span>
                    <span class="inline-flex items-center gap-[5px]">
                      <svg width="15" height="15" class="shrink-0 text-[#8491a3]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8.5h13v4.5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8.5z"/><path d="M17 10h1.5a2 2 0 0 1 0 4H17"/><path d="M7 3v2.5M11 3v2.5"/></svg>
                      Break <strong class="tabular-nums !text-[#0f172a] dark:!text-slate-100">+{{ excesoBreak() }}</strong>
                    </span>
                  </div>
                </div>
                <p [class]="estilos.pie">Sobre 60 y 15 min por día</p>
              </div>
            </div>

            <!-- Los días, con el corte de la semana al pie -->
            <div class="overflow-x-auto rounded-xl border border-[#e6e9ee] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900">
              <table class="w-full border-collapse">
                <caption class="sr-only">Asistencia de {{ p.nombreAgente }}</caption>
                <thead class="border-b border-[#e6e9ee] dark:border-slate-800">
                  <tr>
                    <th scope="col" [class]="estilos.th">Fecha</th>
                    <th scope="col" [class]="estilos.th">Entrada</th>
                    <th scope="col" [class]="estilos.th">Almuerzo</th>
                    <th scope="col" [class]="estilos.th">Break</th>
                    <th scope="col" [class]="estilos.th">Salida</th>
                    <th scope="col" [class]="estilos.th">Tardanza</th>
                    <th scope="col" [class]="estilos.th">Horas mañana</th>
                    <th scope="col" [class]="estilos.th">Horas tarde</th>
                    <th scope="col" [class]="estilos.th">Horas trabajadas</th>
                    <th scope="col" [class]="estilos.th">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  @for (dia of dias(); track dia.fecha) {
                    <tr class="border-b border-[#f1f3f6] last:border-0 hover:bg-[#fafbfc] dark:border-slate-800 dark:hover:bg-slate-800/40">
                      <td [class]="estilos.td">
                        <strong>{{ dia.fecha | date: 'dd/MM' }}</strong><span class="ml-[5px] text-[#8491a3] dark:text-slate-500">{{ dia.nombreDia.slice(0, 3) }}</span>
                      </td>
                      <td [class]="estilos.td"><ng-container *ngTemplateOutlet="hora; context: { $implicit: dia.entrada, manual: esManual(dia, 'ENTRADA') }" /></td>
                      <td [class]="estilos.td"><ng-container *ngTemplateOutlet="hora; context: { $implicit: dia.almuerzoInicio, manual: esManual(dia, 'ALMUERZO_INICIO') }" /> – <ng-container *ngTemplateOutlet="hora; context: { $implicit: dia.almuerzoFin, manual: esManual(dia, 'ALMUERZO_FIN') }" /></td>
                      <td [class]="estilos.td"><ng-container *ngTemplateOutlet="hora; context: { $implicit: dia.breakInicio, manual: esManual(dia, 'BREAK_INICIO') }" /> – <ng-container *ngTemplateOutlet="hora; context: { $implicit: dia.breakFin, manual: esManual(dia, 'BREAK_FIN') }" /></td>
                      <td [class]="estilos.td"><ng-container *ngTemplateOutlet="hora; context: { $implicit: dia.salida, manual: esManual(dia, 'SALIDA') }" /></td>
                      <td [class]="estilos.td + ((dia.minutosTardanza ?? 0) > 0 ? ' con-tardanza' : '')">
                        @if (dia.tardanza) { {{ dia.tardanza }} } @else { <span class="sin-marca">—</span> }
                      </td>
                      <td [class]="estilos.td">@if (dia.horasManana) { {{ dia.horasManana }} } @else { <span class="sin-marca">—</span> }</td>
                      <td [class]="estilos.td">@if (dia.horasTarde) { {{ dia.horasTarde }} } @else { <span class="sin-marca">—</span> }</td>
                      <td [class]="estilos.td + ' font-bold'">@if (dia.horasTrabajadas) { {{ dia.horasTrabajadas }} } @else { <span class="sin-marca">—</span> }</td>
                      <td [class]="estilos.td">
                        <span class="inline-flex items-center rounded-full px-[9px] py-0.5 text-[11.5px] font-bold"
                              [class]="ESTADOS[estadoVisible(dia)].clase">{{ dia.tipoDia ?? ESTADOS[estadoVisible(dia)].texto }}</span>
                      </td>
                    </tr>
                  }
                </tbody>
                <ng-template #hora let-valor let-manual="manual">@if (valor) {<span [class.manual]="manual" [attr.title]="manual ? 'Completada a mano' : null">{{ valor }}</span>} @else {<span class="sin-marca">—</span>}</ng-template>
                <!-- El corte semanal cierra la tabla: es donde se mira, y evita una pestaña aparte. -->
                @if (semanas().length) {
                  <tfoot>
                    @for (s of semanas(); track s.lunes) {
                    <tr class="border-t border-[#e6e9ee] bg-[#f4f6f9] font-bold dark:border-slate-800 dark:bg-slate-800/60">
                      <td [class]="estilos.td" colspan="5">
                        Semana {{ rangoDeSemana(s) }}
                        <span class="secundario">
                          {{ s.diasTrabajados }} {{ s.diasTrabajados === 1 ? 'día trabajado' : 'días trabajados' }}
                          · {{ s.diasFalta }} {{ s.diasFalta === 1 ? 'falta' : 'faltas' }}@if (justificadosDe(s)) { · {{ justificadosDe(s) }} {{ justificadosDe(s) === 1 ? 'justificado' : 'justificados' }}}
                        </span>
                      </td>
                      <td [class]="estilos.td + (s.minutosTardanza > 0 ? ' con-tardanza' : '')">{{ s.tardanza }}</td>
                      <td [class]="estilos.td"><span class="sin-marca">—</span></td>
                      <td [class]="estilos.td"><span class="sin-marca">—</span></td>
                      <td [class]="estilos.td">
                        {{ s.horasTrabajadas }} <span class="secundario">de {{ s.jornada }}</span>
                      </td>
                      <td [class]="estilos.td">
                        <span class="inline-flex items-center gap-[7px] font-semibold"
                              [class]="s.pierdeBono ? 'text-[#b91c1c] dark:text-red-300' : 'text-[#166534] dark:text-green-300'">
                          <span class="h-2 w-2 rounded-full"
                                [class]="s.pierdeBono ? 'bg-[#dc2626]' : 'bg-[#16a34a]'"></span>
                          {{ textoLimite(s) }}
                        </span>
                      </td>
                    </tr>
                    }
                  </tfoot>
                }
              </table>
            </div>
          </div>
        }

    </div>
  `
})
export class AsistenciaReporteComponent {
  private readonly servicio = inject(AsistenciaService);
  private readonly toast = inject(ToastService);

  protected readonly estilos = ESTILOS;
  protected readonly ESTADOS = ESTADOS;
  protected readonly COLOR_DIA = COLOR_DIA;
  protected readonly estadoVisible = estadoVisible;

  /**
   * El tope semanal de tardanza, tal como vino en el reporte: es por
   * subcartera, así que se lee de la respuesta y no de una constante. El 30 es
   * solo el valor de la empresa mientras no haya reporte cargado.
   */
  readonly TOPE_SEMANA_MIN = computed(() => this.reporte()?.toleranciaSemanaMin ?? 30);

  /** El ámbito, el rango y el agente los pone la cabecera del módulo: son
   *  comunes a todas las pestañas y, repetidos, se desincronizan. */
  readonly idSubcartera = input<number | null>(null);
  readonly desde = input.required<string>();
  readonly hasta = input.required<string>();
  readonly agente = input<string>('');

  /** El roster, para que la cabecera pueda ofrecerlo en su desplegable. */
  readonly rosterCambia = output<string[]>();
  readonly reporteCargado = output<AsistenciaReporte | null>();

  readonly reporte = signal<AsistenciaReporte | null>(null);
  /** Lo que eligieron las flechas; manda sobre lo escrito en la cabecera. */
  readonly agenteElegido = signal('');
  readonly cargando = signal(false);

  /** El roster del reporte: por donde caminan las flechas. */
  readonly roster = computed<ResumenAgente[]>(() => this.reporte()?.agentes ?? []);

  /**
   * Quién se está viendo: lo exacto que se escribió, lo parecido, o el primero.
   * El filtro va en el cliente porque el reporte de una semana son decenas de
   * filas y volver al servidor por cada letra solo añadiría espera.
   */
  readonly indice = computed(() => {
    const gente = this.roster();
    const texto = (this.agenteElegido() || this.agente()).toLowerCase().trim();
    if (!texto) {
      return 0;
    }
    const exacto = gente.findIndex(a => a.nombreAgente.toLowerCase() === texto);
    if (exacto >= 0) {
      return exacto;
    }
    const parecido = gente.findIndex(a =>
      a.nombreAgente.toLowerCase().includes(texto) || (a.username ?? '').toLowerCase().includes(texto));
    return Math.max(0, parecido);
  });

  readonly persona = computed<ResumenAgente | null>(() => this.roster()[this.indice()] ?? null);

  readonly dias = computed<AsistenciaDia[]>(() => {
    const p = this.persona();
    return p ? (this.reporte()?.dias ?? []).filter(d => d.idUsuario === p.idUsuario) : [];
  });

  /**
   * Las semanas de la persona en el rango. Con una sola, las tarjetas son las
   * de esa semana; con varias, suman el período y el pie de la tabla lleva una
   * fila por semana.
   */
  readonly semanas = computed<SemanaAgente[]>(() => {
    const p = this.persona();
    return p ? (this.reporte()?.semanas ?? []).filter(s => s.idUsuario === p.idUsuario)
      .sort((a, b) => a.lunes.localeCompare(b.lunes)) : [];
  });
  readonly variasSemanas = computed(() => this.semanas().length > 1);

  readonly rangoTexto = computed(() => {
    const d = this.dias();
    return d.length ? `${this.corta(d[0].fecha)} – ${this.corta(d[d.length - 1].fecha)}` : '';
  });

  /**
   * Los días de la cinta: de lunes a viernes, y el sábado o el domingo solo si
   * se trabajó. Un fin de semana vacío no dice nada de la puntualidad.
   */
  readonly diasCinta = computed(() => this.dias().filter(d => {
    const dia = new Date(d.fecha + 'T00:00:00').getDay();
    return (dia !== 0 && dia !== 6) || !!d.entrada;
  }));
  /** Más de una semana: cuadritos sin letra, del mismo alto. */
  readonly cintaCompacta = computed(() => this.diasCinta().length > 7);

  /** Los días que tocaba trabajar, los puntuales y las faltas: los mismos que se ven en la cinta. */
  readonly diasLaborables = computed(() => this.diasCinta().filter(d => d.estado !== 'NO_LABORABLE').length);
  readonly diasPuntuales = computed(() => this.diasCinta().filter(d => estadoVisible(d) === 'PUNTUAL').length);
  readonly diasFalta = computed(() => this.diasCinta().filter(d => estadoVisible(d) === 'FALTA').length);

  readonly puntualidad = computed(() => {
    const base = this.diasLaborables();
    return base ? Math.round((this.diasPuntuales() / base) * 100) : 0;
  });

  private sumar(campo: (s: SemanaAgente) => number): number {
    return this.semanas().reduce((total, s) => total + (campo(s) ?? 0), 0);
  }
  readonly minutosTardanza = computed(() => this.sumar(s => s.minutosTardanza));
  readonly minutosTrabajados = computed(() => this.sumar(s => s.minutosTrabajados));
  readonly minutosJornada = computed(() => this.sumar(s => s.minutosJornada));

  /** El tope de la barra: el de la semana, o la suma de los de cada semana del período. */
  readonly tope = computed(() => this.TOPE_SEMANA_MIN() * Math.max(1, this.semanas().length));
  readonly pasaTope = computed(() => this.minutosTardanza() > this.tope());

  /** La escala llega al doble del tope, así el tope cae justo a la mitad. */
  readonly porcentajeTardanza = computed(() =>
    Math.min(100, (this.minutosTardanza() / (this.tope() * 2)) * 100));

  /** El límite es de cada semana: con varias, en cuántas se pasó. */
  readonly limiteTexto = computed(() => {
    const semanas = this.semanas();
    if (semanas.length <= 1) {
      return semanas.length ? textoLimite(semanas[0]) : '';
    }
    const fuera = semanas.filter(s => s.pierdeBono).length;
    return fuera ? `Fuera del límite en ${fuera} de ${semanas.length} semanas` : 'Dentro del límite';
  });

  readonly porcentajeJornada = computed(() => {
    const jornada = this.minutosJornada();
    return jornada ? Math.round((this.minutosTrabajados() / jornada) * 100) : 0;
  });

  /** Verde con la jornada cumplida, ámbar si le falta poco, rojo por debajo del 80 %. */
  readonly segmentos = computed(() => {
    const pct = this.porcentajeJornada();
    const lleno = pct >= 100 ? 'bg-[#16a34a]' : pct >= 80 ? 'bg-[#f59e0b]' : 'bg-[#dc2626]';
    const medio = pct >= 100 ? 'bg-[#16a34a]/45' : pct >= 80 ? 'bg-[#f59e0b]/45' : 'bg-[#dc2626]/45';
    return Array.from({ length: 10 }, (_, i) =>
      pct >= (i + 1) * 10 ? lleno : pct > i * 10 ? medio : 'bg-[#f1f3f6] dark:bg-slate-800');
  });

  readonly excesoAlmuerzo = computed(() =>
    this.dias().reduce((total, d) => total + (d.excesoAlmuerzoMin ?? 0), 0));
  readonly excesoBreak = computed(() =>
    this.dias().reduce((total, d) => total + (d.excesoBreakMin ?? 0), 0));
  readonly excesoTotal = computed(() => this.excesoAlmuerzo() + this.excesoBreak());

  /** Los días de una semana del rango (del lunes al domingo). */
  private diasDe(s: SemanaAgente): AsistenciaDia[] {
    const domingo = new Date(s.lunes + 'T00:00:00');
    domingo.setDate(domingo.getDate() + 6);
    const hasta = `${domingo.getFullYear()}-${String(domingo.getMonth() + 1).padStart(2, '0')}-${String(domingo.getDate()).padStart(2, '0')}`;
    return this.dias().filter(d => d.fecha >= s.lunes && d.fecha <= hasta);
  }

  /** «14/09 – 19/09»: los días de esa semana que caen en el rango (sin el fin de semana que no se trabajó). */
  rangoDeSemana(s: SemanaAgente): string {
    const cinta = new Set(this.diasCinta().map(d => d.fecha));
    const dias = this.diasDe(s).filter(d => cinta.has(d.fecha));
    return dias.length ? `${this.corta(dias[0].fecha)} – ${this.corta(dias[dias.length - 1].fecha)}` : this.corta(s.lunes);
  }

  /** Los días con una ausencia aprobada: el pie de cada semana los cuenta aparte. */
  justificadosDe(s: SemanaAgente): number {
    return this.diasDe(s).filter(d => d.estado === 'JUSTIFICADO').length;
  }

  constructor() {
    // Vuelve a pedir cuando cambia el ámbito o el rango: son los tres valores
    // que definen la consulta y no hay más de donde venga el cambio. Cambiar de
    // ámbito vacía además la persona elegida, porque el roster es otro.
    effect(() => {
      const ambito = this.idSubcartera();
      const desde = this.desde();
      const hasta = this.hasta();
      if (!ambito) {
        this.reporte.set(null);
        return;
      }
      this.pedir(desde, hasta, ambito);
    });
  }

  private pedir(desde: string, hasta: string, idSubcartera: number): void {
    this.cargando.set(true);
    this.servicio.reporte(desde, hasta, idSubcartera).subscribe({
      next: r => {
        this.reporte.set(r);
        this.agenteElegido.set('');
        this.rosterCambia.emit(r.agentes.map(a => a.nombreAgente));
        this.reporteCargado.emit(r);
        this.cargando.set(false);
      },
      error: () => {
        this.toast.error('No se pudo cargar la asistencia');
        this.cargando.set(false);
      }
    });
  }

  /** Las flechas caminan el roster; el nombre lo escribe la cabecera. */
  mover(paso: number): void {
    const gente = this.roster();
    const siguiente = Math.min(gente.length - 1, Math.max(0, this.indice() + paso));
    this.agenteElegido.set(gente[siguiente]?.nombreAgente ?? '');
  }


  // ==================== PRESENTACIÓN ====================

  esManual(dia: AsistenciaDia, tipo: TipoMarcacion): boolean {
    return (dia.marcasManuales ?? []).includes(tipo);
  }

  textoLimite(s: SemanaAgente): string {
    return textoLimite(s);
  }

  /** La duración sin unidad: «43 h 57», «38». Una duración no es una hora de reloj. */
  duracionCorta(minutos: number): string {
    const h = Math.floor(minutos / 60);
    const m = minutos % 60;
    return h && m ? `${h} h ${m}` : h ? `${h} h` : `${m}`;
  }

  /** Lo mismo pero dicho entero: «9 h 30 min», no «09:30». */
  enDuracion(minutos: number): string {
    const h = Math.floor(minutos / 60);
    const m = minutos % 60;
    return h && m ? `${h} h ${m} min` : h ? `${h} h` : `${m} min`;
  }

  unidadDe(minutos: number): string {
    return minutos >= 60 && minutos % 60 === 0 ? '' : 'min';
  }

  // ==================== APOYO ====================

  private corta(fecha: string): string {
    const [, mes, dia] = fecha.split('-');
    return `${dia}/${mes}`;
  }
}
