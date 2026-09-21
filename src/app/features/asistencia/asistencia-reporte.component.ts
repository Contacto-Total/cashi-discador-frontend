import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
import { ESTADOS, ESTILOS } from './asistencia.estilos';

/** Las seis marcas, en el orden en que ocurren: el break va después del almuerzo. */
const MARCAS: { tipo: TipoMarcacion; etiqueta: string; campo: keyof AsistenciaDia }[] = [
  { tipo: 'ENTRADA', etiqueta: 'Entrada', campo: 'entrada' },
  { tipo: 'ALMUERZO_INICIO', etiqueta: 'Inicio almuerzo', campo: 'almuerzoInicio' },
  { tipo: 'ALMUERZO_FIN', etiqueta: 'Fin almuerzo', campo: 'almuerzoFin' },
  { tipo: 'BREAK_INICIO', etiqueta: 'Inicio break', campo: 'breakInicio' },
  { tipo: 'BREAK_FIN', etiqueta: 'Fin break', campo: 'breakFin' },
  { tipo: 'SALIDA', etiqueta: 'Salida', campo: 'salida' }
];

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
 * Una celda vacía significa que NO hay marca, y se completa desde el modal de
 * corrección, que exige un motivo. Una celda con punto ámbar es una marca
 * escrita a mano: la hoja actual no distingue lo uno de lo otro más que por el
 * color, y no guarda quién la escribió.
 */
@Component({
  selector: 'app-asistencia-reporte',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
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
    .manual { position: relative; padding-right: 14px }
    .manual::after {
      content: ""; position: absolute; right: 0; top: 50%; transform: translateY(-50%);
      width: 6px; height: 6px; border-radius: 999px; background: #d97706;
    }
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
                <h2 class="!m-0 flex flex-wrap items-center gap-[9px] text-xl font-extrabold tracking-[-0.01em]">
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
                <div class="mb-2 flex items-center gap-2.5">
                  <span [class]="estilos.icono">
                    <lucide-angular name="calendar-days" [size]="15" class="block"></lucide-angular>
                  </span>
                  <h3 [class]="estilos.rotulo">Puntualidad</h3>
                </div>
                <div [class]="estilos.cifra">{{ puntualidad() }}<small [class]="estilos.unidad">%</small></div>
                <div [class]="estilos.banda">
                  <div class="flex w-full gap-1.5">
                    @for (d of dias(); track d.fecha) {
                      <span class="flex h-[26px] flex-1 items-center justify-center rounded-md text-[11px] font-bold text-white"
                            [class]="COLOR_DIA[d.estado]"
                            [title]="(d.fecha | date: 'dd/MM') + ' ' + d.nombreDia + ' · ' + (d.tipoDia ?? ESTADOS[d.estado].texto)">
                        {{ d.nombreDia.slice(0, 2) }}
                      </span>
                    }
                  </div>
                </div>
                <p [class]="estilos.pie">
                  {{ semana()?.diasPuntual ?? 0 }} de {{ diasLaborables() }}
                  {{ diasLaborables() === 1 ? 'día' : 'días' }} ·
                  {{ semana()?.diasFalta ?? 0 }} {{ (semana()?.diasFalta ?? 0) === 1 ? 'falta' : 'faltas' }}
                </p>
              </div>

              <div [class]="estilos.tarjeta">
                <div class="mb-2 flex items-center gap-2.5">
                  <span [class]="estilos.icono">
                    <lucide-angular name="clock" [size]="15" class="block"></lucide-angular>
                  </span>
                  <h3 [class]="estilos.rotulo">Tardanza de la semana</h3>
                </div>
                <div [class]="estilos.cifra">
                  {{ duracionCorta(minutosTardanza()) }}<small [class]="estilos.unidad">{{ unidadDe(minutosTardanza()) }}</small>
                </div>
                <div [class]="estilos.banda + ' mb-4'">
                  <div class="relative w-full">
                    <div class="barra-tope" role="img"
                         [style.--valor]="porcentajeTardanza() + '%'"
                         [style.--color]="pasaTope() ? '#dc2626' : '#16a34a'"
                         [attr.aria-label]="'Tardanza ' + enDuracion(minutosTardanza()) + ', tope ' + enDuracion(TOPE_SEMANA_MIN())"></div>
                    <span class="absolute left-1/2 top-[18px] -translate-x-1/2 whitespace-nowrap text-[10px] leading-none text-[#5f6c80] dark:text-slate-400">
                      tope {{ enDuracion(TOPE_SEMANA_MIN()) }}
                    </span>
                  </div>
                </div>
                <p [class]="estilos.pie">{{ semana()?.pierdeBono ? 'Pierde el bono' : 'Mantiene el bono' }}</p>
              </div>

              <div [class]="estilos.tarjeta">
                <div class="mb-2 flex items-center gap-2.5">
                  <span [class]="estilos.icono">
                    <lucide-angular name="bar-chart-2" [size]="15" class="block"></lucide-angular>
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
                <div class="mb-2 flex items-center gap-2.5">
                  <span [class]="estilos.icono">
                    <lucide-angular name="coffee" [size]="15" class="block"></lucide-angular>
                  </span>
                  <h3 [class]="estilos.rotulo">Exceso de pausas</h3>
                </div>
                <div [class]="estilos.cifra">
                  {{ excesoTotal() > 0 ? '+' + excesoTotal() : '0' }}<small [class]="estilos.unidad">min</small>
                </div>
                <div [class]="estilos.banda + ' h-auto min-h-[26px]'">
                  <div class="flex w-full flex-wrap gap-x-3.5 gap-y-1 text-[11.5px] text-[#5f6c80] dark:text-slate-400">
                    <span class="inline-flex items-center gap-[5px]">
                      <lucide-angular name="utensils" [size]="13" class="block text-[#8491a3]"></lucide-angular>
                      Almuerzo <strong class="tabular-nums text-[#0f172a] dark:text-slate-100">+{{ excesoAlmuerzo() }}</strong>
                    </span>
                    <span class="inline-flex items-center gap-[5px]">
                      <lucide-angular name="coffee" [size]="13" class="block text-[#8491a3]"></lucide-angular>
                      Break <strong class="tabular-nums text-[#0f172a] dark:text-slate-100">+{{ excesoBreak() }}</strong>
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
                    <th scope="col" [class]="estilos.th">Mañana</th>
                    <th scope="col" [class]="estilos.th">Tarde</th>
                    <th scope="col" [class]="estilos.th">Trabajadas</th>
                    <th scope="col" [class]="estilos.th">Estado</th>
                    <th scope="col" [class]="estilos.th"><span class="sr-only">Corregir</span></th>
                  </tr>
                </thead>
                <tbody>
                  @for (dia of dias(); track dia.fecha) {
                    <tr class="border-b border-[#f1f3f6] last:border-0 hover:bg-[#fafbfc] dark:border-slate-800 dark:hover:bg-slate-800/40">
                      <td [class]="estilos.td">
                        <span class="font-semibold">{{ dia.fecha | date: 'dd/MM' }}</span>
                        <span class="ml-1.5 text-[#8491a3] dark:text-slate-500">{{ dia.nombreDia.slice(0, 3) }}</span>
                      </td>
                      <td [class]="estilos.td">
                        <span [class.manual]="esManual(dia, 'ENTRADA')">{{ dia.entrada ?? '—' }}</span>
                      </td>
                      <td [class]="estilos.td">{{ rango(dia.almuerzoInicio, dia.almuerzoFin) }}</td>
                      <td [class]="estilos.td">{{ rango(dia.breakInicio, dia.breakFin) }}</td>
                      <td [class]="estilos.td">
                        <span [class.manual]="esManual(dia, 'SALIDA')">{{ dia.salida ?? '—' }}</span>
                      </td>
                      <td [class]="estilos.td + ((dia.minutosTardanza ?? 0) > 0 ? ' con-tardanza' : '')">
                        {{ dia.tardanza ?? '—' }}
                      </td>
                      <td [class]="estilos.td">{{ dia.horasManana ?? '—' }}</td>
                      <td [class]="estilos.td">{{ dia.horasTarde ?? '—' }}</td>
                      <td [class]="estilos.td + ' font-bold'">{{ dia.horasTrabajadas ?? '—' }}</td>
                      <td [class]="estilos.td">
                        <span class="inline-flex items-center rounded-full px-2 py-0.5 text-[11.5px] font-bold"
                              [class]="ESTADOS[dia.estado].clase">{{ dia.tipoDia ?? ESTADOS[dia.estado].texto }}</span>
                      </td>
                      <td [class]="estilos.td + ' text-right'">
                        @if (dia.estado !== 'NO_LABORABLE' && dia.estado !== 'JUSTIFICADO') {
                          <button type="button" [class]="estilos.botonIcono" (click)="abrirPanel(dia)"
                                  [attr.aria-label]="'Corregir las horas del ' + dia.fecha" title="Corregir">
                            <lucide-angular name="pencil" [size]="13" class="block"></lucide-angular>
                          </button>
                        }
                      </td>
                    </tr>
                  }
                </tbody>
                <!-- El corte semanal cierra la tabla: es donde se mira, y evita una pestaña aparte. -->
                @if (semana(); as s) {
                  <tfoot>
                    <tr class="border-t border-[#e6e9ee] bg-[#f4f6f9] font-bold dark:border-slate-800 dark:bg-slate-800/60">
                      <td [class]="estilos.td" colspan="5">
                        Semana {{ rangoTexto() }}
                        <span class="ml-2 text-[11.5px] font-normal text-[#5f6c80] dark:text-slate-400">
                          {{ s.diasTrabajados }} {{ s.diasTrabajados === 1 ? 'día trabajado' : 'días trabajados' }}
                          · {{ s.diasFalta }} {{ s.diasFalta === 1 ? 'falta' : 'faltas' }}
                        </span>
                      </td>
                      <td [class]="estilos.td + (s.minutosTardanza > 0 ? ' con-tardanza' : '')">{{ s.tardanza }}</td>
                      <td [class]="estilos.td">—</td>
                      <td [class]="estilos.td">—</td>
                      <td [class]="estilos.td">
                        {{ s.horasTrabajadas }}
                        <span class="text-[11.5px] font-normal text-[#5f6c80] dark:text-slate-400">de {{ s.jornada }}</span>
                      </td>
                      <td [class]="estilos.td" colspan="2">
                        <span class="inline-flex items-center gap-1.5 text-[11.5px] font-bold"
                              [class]="s.pierdeBono ? 'text-[#b91c1c] dark:text-red-300' : 'text-[#166534] dark:text-green-300'"
                              [title]="motivoDelBono(s)">
                          <span class="h-2 w-2 rounded-full"
                                [class]="s.pierdeBono ? 'bg-[#dc2626]' : 'bg-[#16a34a]'"></span>
                          {{ s.pierdeBono ? 'Pierde el bono' : 'Mantiene el bono' }}
                        </span>
                      </td>
                    </tr>
                  </tfoot>
                }
              </table>
            </div>
          </div>
        }

      <!-- Corrección de un día. Modal y no panel lateral: es un formulario corto
           que se rellena de una vez. -->
      @if (panel(); as dia) {
        <div class="fixed inset-0 z-40 bg-[rgba(2,6,23,0.35)] backdrop-blur-[5px]" (click)="cerrarPanel()"></div>
        <div class="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="pointer-events-auto flex max-h-[88vh] w-[min(100%,480px)] flex-col overflow-hidden rounded-[14px] border border-[#e6e9ee] bg-white shadow-[0_18px_50px_rgba(15,23,42,0.22)] dark:border-slate-800 dark:bg-slate-900"
               role="dialog" aria-modal="true" aria-labelledby="titulo-correccion">
            <header class="flex items-start justify-between gap-3 border-b border-[#e6e9ee] px-5 py-4 dark:border-slate-800">
              <div>
                <h2 id="titulo-correccion" class="!m-0 text-[15px] font-extrabold">Motivo de la corrección</h2>
                <p class="mt-[3px] text-[12.5px] text-[#5f6c80] dark:text-slate-400">
                  {{ dia.nombreAgente }} · {{ dia.fecha | date: 'dd/MM/yyyy' }}
                </p>
              </div>
              <button type="button" [class]="estilos.botonIcono" (click)="cerrarPanel()" aria-label="Cerrar">
                <lucide-angular name="x" [size]="15" class="block"></lucide-angular>
              </button>
            </header>

            <div class="flex flex-1 flex-col gap-3.5 overflow-y-auto px-5 py-4">
              @for (m of MARCAS; track m.tipo) {
                <div class="flex flex-col gap-1.5">
                  <label [class]="estilos.etiqueta" [for]="'marca-' + m.tipo">
                    {{ m.etiqueta }}
                    @if (!valorDe(dia, m.campo)) {
                      <span class="ml-1.5 font-normal normal-case tracking-normal text-[#b91c1c]">sin marcación</span>
                    } @else if (esManual(dia, m.tipo)) {
                      <span class="ml-1.5 font-normal normal-case tracking-normal text-[#d97706]">completada a mano</span>
                    }
                  </label>
                  <input [id]="'marca-' + m.tipo" type="time" [class]="estilos.campo"
                         [ngModel]="edicion()[m.tipo] ?? valorDe(dia, m.campo)"
                         (ngModelChange)="editar(m.tipo, $event)">
                </div>
              }

              <div class="flex flex-col gap-1.5">
                <label [class]="estilos.etiqueta" for="motivo-correccion">Qué pasó</label>
                <textarea id="motivo-correccion" rows="2"
                          class="w-full rounded-lg border !border-[#8491a3] !bg-white px-[11px] py-2 text-[13px] !text-[#0f172a] focus:!border-[#2563eb] focus:outline-none dark:!border-slate-600 dark:!bg-slate-800 dark:!text-slate-100"
                          placeholder="Ej.: olvidó marcar el regreso del almuerzo"
                          [ngModel]="motivo()" (ngModelChange)="alEscribirMotivo($event)"></textarea>
                @if (errorMotivo()) {
                  <p class="!m-0 text-xs text-[#b91c1c]">{{ errorMotivo() }}</p>
                }
              </div>
            </div>

            <footer class="flex justify-end gap-2 border-t border-[#e6e9ee] px-5 py-3.5 dark:border-slate-800">
              <button type="button" [class]="estilos.botonSecundario" (click)="cerrarPanel()">Cancelar</button>
              <button type="button" [class]="estilos.botonPrimario" (click)="guardar()"
                      [disabled]="guardando() || !hayCambios()">
                <lucide-angular name="save" [size]="15" class="block"></lucide-angular>
                {{ guardando() ? 'Guardando…' : 'Aceptar' }}
              </button>
            </footer>
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
  protected readonly MARCAS = MARCAS;

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
  readonly guardando = signal(false);

  readonly panel = signal<AsistenciaDia | null>(null);
  readonly edicion = signal<Partial<Record<TipoMarcacion, string>>>({});
  readonly motivo = signal('');
  readonly errorMotivo = signal('');

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

  readonly semana = computed<SemanaAgente | null>(() => {
    const p = this.persona();
    return p ? (this.reporte()?.semanas ?? []).find(s => s.idUsuario === p.idUsuario) ?? null : null;
  });

  readonly rangoTexto = computed(() => {
    const d = this.dias();
    return d.length ? `${this.corta(d[0].fecha)} – ${this.corta(d[d.length - 1].fecha)}` : '';
  });

  /** Los días del rango que tocaba trabajar: el domingo no cuenta en contra. */
  readonly diasLaborables = computed(() =>
    this.dias().filter(d => d.estado !== 'NO_LABORABLE').length);

  readonly puntualidad = computed(() => {
    const s = this.semana();
    const base = this.diasLaborables();
    return s && base ? Math.round((s.diasPuntual / base) * 100) : 0;
  });

  readonly minutosTardanza = computed(() => this.semana()?.minutosTardanza ?? 0);
  readonly minutosTrabajados = computed(() => this.semana()?.minutosTrabajados ?? 0);
  readonly minutosJornada = computed(() => this.semana()?.minutosJornada ?? 0);

  readonly pasaTope = computed(() => this.minutosTardanza() > this.TOPE_SEMANA_MIN());

  /** La escala llega al doble del tope, así el tope cae justo a la mitad. */
  readonly porcentajeTardanza = computed(() =>
    Math.min(100, (this.minutosTardanza() / (this.TOPE_SEMANA_MIN() * 2)) * 100));

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

  cargar(): void {
    const ambito = this.idSubcartera();
    if (ambito) {
      this.pedir(this.desde(), this.hasta(), ambito);
    }
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


  // ==================== CORRECCIÓN ====================

  abrirPanel(dia: AsistenciaDia): void {
    this.panel.set(dia);
    this.edicion.set({});
    this.motivo.set('');
    this.errorMotivo.set('');
  }

  cerrarPanel(): void {
    this.panel.set(null);
  }

  editar(tipo: TipoMarcacion, valor: string): void {
    this.edicion.update(actual => ({ ...actual, [tipo]: valor }));
  }

  alEscribirMotivo(texto: string): void {
    this.motivo.set(texto);
    this.errorMotivo.set('');
  }

  hayCambios(): boolean {
    const dia = this.panel();
    if (!dia) {
      return false;
    }
    return MARCAS.some(m => {
      const nuevo = this.edicion()[m.tipo];
      return nuevo != null && nuevo !== '' && nuevo !== this.valorDe(dia, m.campo);
    });
  }

  /**
   * Manda una corrección por cada marca cambiada. Van de una en una porque cada
   * marcación es una fila propia en el backend, con su origen y su motivo.
   */
  guardar(): void {
    const dia = this.panel();
    if (!dia) {
      return;
    }
    if (!this.motivo().trim()) {
      this.errorMotivo.set('Escribe por qué se corrige: queda en la auditoría');
      return;
    }

    const cambios = MARCAS
      .filter(m => {
        const nuevo = this.edicion()[m.tipo];
        return nuevo != null && nuevo !== '' && nuevo !== this.valorDe(dia, m.campo);
      })
      .map(m => ({
        idUsuario: dia.idUsuario,
        fecha: dia.fecha,
        tipo: m.tipo,
        hora: this.conSegundos(this.edicion()[m.tipo]!),
        motivo: this.motivo().trim()
      }));

    this.guardando.set(true);
    let pendientes = cambios.length;
    let fallo = false;

    cambios.forEach(cambio => {
      this.servicio.completarMarcacion(cambio).subscribe({
        next: () => this.alTerminar(--pendientes, fallo),
        error: () => {
          fallo = true;
          this.alTerminar(--pendientes, fallo);
        }
      });
    });
  }

  private alTerminar(pendientes: number, fallo: boolean): void {
    if (pendientes > 0) {
      return;
    }
    this.guardando.set(false);
    if (fallo) {
      this.toast.error('Alguna corrección no se pudo guardar');
    } else {
      this.toast.success('Marcaciones corregidas');
      this.cerrarPanel();
      this.cargar();
    }
  }

  // ==================== PRESENTACIÓN ====================

  rango(inicio: string | null, fin: string | null): string {
    if (!inicio && !fin) {
      return '—';
    }
    return `${inicio ?? '—'} – ${fin ?? '—'}`;
  }

  esManual(dia: AsistenciaDia, tipo: TipoMarcacion): boolean {
    return (dia.marcasManuales ?? []).includes(tipo);
  }

  valorDe(dia: AsistenciaDia, campo: keyof AsistenciaDia): string {
    return (dia[campo] as string | null) ?? '';
  }

  motivoDelBono(s: SemanaAgente): string {
    const motivos: string[] = [];
    if (s.superoToleranciaDiaria) {
      motivos.push('pasó el tope de un día');
    }
    if (s.superoToleranciaSemanal) {
      motivos.push('pasó el tope de la semana');
    }
    return motivos.join(' y ');
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

  /** El input de tipo time devuelve HH:mm cuando los segundos son cero. */
  private conSegundos(hora: string): string {
    return hora.length === 5 ? `${hora}:00` : hora;
  }
}
