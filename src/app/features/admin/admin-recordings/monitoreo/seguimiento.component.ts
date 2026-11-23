import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { ToastService } from '../../../../shared/services/toast.service';
import { BotonDirective } from '../../../../shared/ui/boton.directive';
import { TarjetaDirective } from '../../../../shared/ui/tarjeta.directive';
import { BARRA, BARRA_ESTADO, CAMPO, ETIQUETA, PANTALLA, PRINCIPAL, REJILLA, REJILLA_SOLA, SUBTITULO, TITULO, VACIO } from '../../../asistencia/ui/clases';
import { BOTON_APAGADO, BOTON_SEC } from '../../../asistencia/ui/control-comun';
import { MINI } from '../../../asistencia/ui/ficha-clases';
import { SegmentadoComponent } from '../../../asistencia/ui/segmentado.component';
import { MonitoreoEstado, hoyIso } from './monitoreo-estado';
import { MonitoreoService } from './monitoreo.service';
import { CriterioRendimiento, Rubrica, SeguimientoCelda } from './monitoreo.models';
import { PuntoPerfil, pct, perfil, pts, puntosDe, rubricaEnFrase } from './monitoreo.calculos';

const NOMBRE: Record<Rubrica, string> = { TIT: 'Titular', TER: 'Tercero', PDP: 'PDP', CD: 'CD' };
const DIAS3 = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
const MESES3 = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'set', 'oct', 'nov', 'dic'];
/** Un color por punto de la rúbrica, en el orden del gráfico. */
const COLOR_PUNTO = ['bg-[#10b981] dark:bg-[#34d399]', 'bg-[#f59e0b] dark:bg-[#fbbf24]', 'bg-[#0ea5e9] dark:bg-[#38bdf8]',
  'bg-[#8b5cf6] dark:bg-[#a78bfa]', 'bg-[#64748b] dark:bg-[#94a3b8]'];
/** Hasta cuántas semanas atrás se busca una con llamadas al entrar. */
const SEMANAS_ATRAS = 8;

const fechaDe = (iso: string): Date => new Date(+iso.slice(0, 4), +iso.slice(5, 7) - 1, +iso.slice(8, 10));
const isoDe = (d: Date): string => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const masDias = (iso: string, n: number): string => { const d = fechaDe(iso); d.setDate(d.getDate() + n); return isoDe(d); };
const lunesDe = (iso: string): string => { const d = fechaDe(iso); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return isoDe(d); };
const diaCorto = (iso: string): string => `${+iso.slice(8, 10)} ${MESES3[+iso.slice(5, 7) - 1]}`;
const fechaLarga = (iso: string): string => `${iso.slice(8, 10)}/${iso.slice(5, 7)}/${iso.slice(0, 4)}`;

/** Lo que muestra una celda: el puntaje del día, la variación contra el día anterior con llamadas y cada punto. */
interface Valor { puntaje: number | null; puntos: number; posibles: number; llamadas: number; variacion: number | null; ejes: PuntoPerfil[]; }
interface Fila { asesor: string; llamadas: number; dias: (Valor | null)[]; total: Valor; }

/** Suma celdas de una misma rúbrica: puntos, llamadas y los criterios por código. */
function sumar(celdas: SeguimientoCelda[], rubrica: Rubrica, anterior: number | null): Valor {
  let puntos = 0, posibles = 0, llamadas = 0;
  const criterios = new Map<string, CriterioRendimiento>();
  for (const c of celdas) {
    puntos += c.puntos; posibles += c.posibles; llamadas += c.llamadas;
    for (const k of c.criterios) {
      const x = criterios.get(k.codigo);
      if (x) { x.cumple += k.cumple; x.noCumple += k.noCumple; x.na += k.na; } else { criterios.set(k.codigo, { ...k }); }
    }
  }
  const puntaje = posibles ? (puntos / posibles) * 100 : null;
  return { puntaje, puntos, posibles, llamadas, variacion: anterior != null && puntaje != null ? puntaje - anterior : null, ejes: perfil(rubrica, [...criterios.values()]) };
}

/**
 * Seguimiento por día: una semana a la vez, el puntaje de cada asesor en cada día, por rúbrica, como la matriz del
 * monitoreo de PROD. Lunes a viernes, y el sábado o el domingo si hubo llamadas, para no esconder datos del total.
 * Una celda vacía es un día sin llamadas de esa persona, no 0 %.
 */
@Component({
  selector: 'app-seguimiento',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: PANTALLA + ' @container/p5' },
  imports: [NgTemplateOutlet, LucideAngularModule, TarjetaDirective, BotonDirective, SegmentadoComponent],
  template: `
    <div [class]="REJILLA + ' ' + REJILLA_SOLA">
      <section appTarjeta [class]="PRINCIPAL + ' pb-8!'">
        <div class="mb-[.875rem] flex flex-none items-center gap-3 [@media(max-height:700px)]:mb-[.5rem]">
          <button type="button" appBoton="secundario" appBotonAlto="chico" [class]="MINI" (click)="volver()">
            <lucide-angular name="arrow-left" [size]="16" class="flex"></lucide-angular>Monitoreo
          </button>
        </div>
        <div class="mb-4 flex flex-none flex-wrap items-center justify-between gap-x-6 gap-y-3 [@media(max-height:700px)]:mb-[.75rem]">
          <div class="min-w-0 flex-none">
            <p role="heading" aria-level="1" [class]="TITULO + ' whitespace-normal!'">Seguimiento por día</p>
            <p [class]="SUBTITULO">Puntaje de cada asesor por día</p>
          </div>
          <div class="ml-auto flex flex-[1_1_auto] flex-nowrap items-end justify-end gap-x-3 gap-y-2">
            <div [class]="CAMPO + ' flex-none'">
              <span [class]="ETIQUETA">Semana</span>
              <div class="flex items-center gap-[.375rem]">
                <button type="button" appBoton="secundario" appBotonAlto="icono" [class]="MINI" aria-label="Semana anterior" (click)="moverSemana(-1)">
                  <lucide-angular name="chevron-left" [size]="16" class="flex"></lucide-angular>
                </button>
                <span class="min-w-[8.5rem] text-center text-[.875rem] font-semibold whitespace-nowrap text-foreground">{{ etiquetaSemana() }}</span>
                <button type="button" appBoton="secundario" appBotonAlto="icono" [class]="MINI" aria-label="Semana siguiente" [disabled]="lunes() >= lunesHoy" (click)="moverSemana(1)">
                  <lucide-angular name="chevron-right" [size]="16" class="flex"></lucide-angular>
                </button>
                <button type="button" appBoton="secundario" appBotonAlto="chico" [class]="MINI" [disabled]="lunes() === lunesHoy" (click)="irA(lunesHoy)">Esta semana</button>
              </div>
            </div>
            @if (rubricas().length) {
              <div [class]="CAMPO + ' flex-none'">
                <span [class]="ETIQUETA">Rúbrica</span>
                <app-segmentado [opciones]="opcionesRubrica()" [valor]="rubrica() ?? ''" (cambiar)="rubricaElegida.set($any($event))" />
              </div>
            }
          </div>
        </div>

        @if (cargando() && !celdas().length) {
          <div [class]="VACIO">Cargando…</div>
        } @else if (!filas().length) {
          <div [class]="VACIO">{{ error() || (rubrica() ? 'Sin llamadas de ' + enFrase(rubrica()!) + ' evaluadas esta semana' : 'Sin llamadas evaluadas esta semana') }}</div>
        } @else {
          <div class="min-h-0 flex-[0_1_auto] overflow-auto rounded-[.75rem] border border-solid border-border transition-opacity duration-200 motion-reduce:transition-none" [class.opacity-60]="cargando()">
            <table [class]="TABLA" [style.min-width]="'calc(21rem + ' + dias().length + ' * 9.75rem)'">
              <colgroup><col class="w-[11rem]">@for (d of dias(); track d) {<col class="w-[9.75rem]">}<col class="w-[10rem]"></colgroup>
              <thead class="bg-transparent!">
                <tr [class]="TR">
                  <th [class]="TH_AS">Asesor</th>
                  @for (d of dias(); track d) {
                    <th [class]="TH_DIA" [style.opacity]="d > hoy ? .55 : null">
                      <b class="block text-[.8125rem] font-semibold" [class]="d === hoy ? 'text-(--verde-txt)!' : 'text-foreground!'">{{ diaSemana(d) }} {{ +d.slice(8, 10) }}</b>{{ d === hoy ? 'Hoy' : mes(d) }}
                    </th>
                  }
                  <th [class]="TH_TOT">Semana</th>
                </tr>
              </thead>
              <tbody>
                @for (f of filas(); track f.asesor) {
                  <tr [class]="TR">
                    <th scope="row" [class]="TD_AS">
                      <button type="button" class="block max-w-full cursor-pointer overflow-hidden border-0 bg-transparent p-0 text-left [font:inherit] font-semibold! text-ellipsis whitespace-nowrap text-foreground hover:text-(--verde-txt) hover:underline"
                              [title]="'Ver el rendimiento de ' + f.asesor" (click)="verAsesor(f.asesor)">{{ f.asesor }}</button>
                      <small class="block text-[.6875rem] font-normal text-muted-foreground">{{ plural(f.llamadas, 'llamada', 'llamadas') }}</small>
                    </th>
                    @for (v of f.dias; track $index; let i = $index) {
                      <td [class]="TD">
                        @if (v) {
                          <button type="button" [class]="CELDA + ' cursor-pointer transition-[border-color,background-color] duration-150 hover:border-(--verde-txt) hover:bg-[color-mix(in_oklab,var(--ok-pt)_6%,var(--card))] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--verde-txt)'"
                                  [title]="'Ver las llamadas de ' + f.asesor + ' del ' + fechaLarga(dias()[i])" (click)="verDia(f.asesor, dias()[i])">
                            <ng-container *ngTemplateOutlet="cuerpo; context: { $implicit: v, conPuntos: true }" />
                          </button>
                        } @else if (dias()[i] <= hoy) {
                          <span class="absolute inset-x-[.375rem] inset-y-[.5rem] flex items-start rounded-[.625rem] border border-dashed border-border px-[.75rem] py-[.625rem] text-[.75rem] text-muted-foreground">Sin evaluar</span>
                        }
                      </td>
                    }
                    <td [class]="TD_TOT">
                      <div class="flex w-full flex-col gap-1">
                        <ng-container *ngTemplateOutlet="cuerpo; context: { $implicit: f.total, conPuntos: true, total: true }" />
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
              <tfoot>
                <tr [class]="TR">
                  <th [class]="PIE_AS">Equipo<small class="block text-[.6875rem] font-normal text-muted-foreground">{{ plural(filas().length, 'asesor', 'asesores') }}</small></th>
                  @for (v of equipo().dias; track $index) {
                    <td [class]="PIE_DIA">
                      @if (v) {
                        <div class="flex flex-col gap-[.0625rem] p-[.125rem]">
                          <span [class]="ARRIBA"><strong [class]="NUMERO">{{ pct(v.puntaje) }}<small [class]="UNIDAD">%</small></strong><ng-container *ngTemplateOutlet="flecha; context: { $implicit: v.variacion }" /></span>
                          <small class="block text-[.6875rem] text-muted-foreground">{{ plural(v.llamadas, 'llamada', 'llamadas') }}</small>
                        </div>
                      }
                    </td>
                  }
                  <td [class]="PIE_TOT">
                    <div class="flex flex-col gap-[.0625rem] p-[.125rem]">
                      <strong [class]="NUMERO">{{ pct(equipo().total.puntaje) }}<small [class]="UNIDAD">%</small></strong>
                      <small class="block text-[.6875rem] text-muted-foreground">{{ pts(equipo().total.puntos) }}/{{ pts(equipo().total.posibles) }} · {{ plural(equipo().total.llamadas, 'llamada', 'llamadas') }}</small>
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div class="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-[.75rem] text-muted-foreground">
            @for (p of puntos(); track p.clave; let i = $index) {
              <span class="inline-flex items-center gap-[.375rem]"><i class="size-2 rounded-full" [class]="COLOR_PUNTO[i]"></i>{{ p.nombre }}</span>
            }
            <span class="ml-auto">La flecha compara con el día anterior con llamadas · clic en una celda para ver sus llamadas</span>
          </div>
        }

        <ng-template #cuerpo let-v let-total="total">
          <span [class]="ARRIBA"><strong [class]="NUMERO">{{ pct(v.puntaje) }}<small [class]="UNIDAD">%</small></strong>@if (!total) {<ng-container *ngTemplateOutlet="flecha; context: { $implicit: v.variacion }" />}</span>
          <small class="block text-[.6875rem] text-muted-foreground">{{ pts(v.puntos) }}/{{ pts(v.posibles) }} · {{ plural(v.llamadas, 'llamada', 'llamadas') }}</small>
          <ol class="m-0 mt-[.375rem] grid list-none gap-[.3125rem] p-0">
            @for (e of v.ejes; track e.clave; let i = $index) {
              <li class="grid grid-cols-[.375rem_minmax(0,1fr)_2.75rem] items-center gap-[.375rem]" [title]="e.nombre + ': ' + (e.porcentaje == null ? 'no aplica' : pts(e.cumplidos) + ' de ' + pts(e.posibles) + ' puntos')">
                <i class="size-[.375rem] rounded-full" [class]="COLOR_PUNTO[i]"></i>
                <span class="h-[3px] overflow-hidden rounded-[2px] bg-(--line2)"><span class="block h-full rounded-[2px]" [class]="COLOR_PUNTO[i]" [style.width.%]="e.porcentaje ?? 0"></span></span>
                <b class="text-right text-[.6875rem] font-medium text-muted-foreground! [font-variant-numeric:tabular-nums]">{{ e.porcentaje == null ? '—' : pts(e.porcentaje) + ' %' }}</b>
              </li>
            }
          </ol>
        </ng-template>
        <ng-template #flecha let-d>
          @if (d != null) {
            <em class="inline-flex items-center gap-[.0625rem] text-[.6875rem] font-semibold not-italic [font-variant-numeric:tabular-nums]" [class]="d > 0 ? 'text-(--ok)' : d < 0 ? 'text-(--ro)' : 'text-muted-foreground'" title="Frente al día anterior con llamadas">
              <lucide-angular [name]="d > 0 ? 'trending-up' : d < 0 ? 'trending-down' : 'minus'" [size]="12" class="flex"></lucide-angular>{{ d > 0 ? '+' : d < 0 ? '−' : '' }}{{ pts(abs(d)) }}
            </em>
          }
        </ng-template>
      </section>
    </div>

    <div appTarjeta [class]="BARRA">
      <span [class]="BARRA_ESTADO">{{ estadoBarra() }}</span>
      <button type="button" appBoton="secundario" [class]="'px-4! ' + BOTON_SEC" [disabled]="!filas().length" (click)="verSemana()">
        <lucide-angular name="list" [size]="16" class="flex"></lucide-angular>Ver las llamadas de la semana
      </button>
    </div>
  `
})
export class SeguimientoComponent {
  private readonly servicio = inject(MonitoreoService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);
  private readonly e = inject(MonitoreoEstado);

  protected readonly REJILLA = REJILLA; protected readonly REJILLA_SOLA = REJILLA_SOLA; protected readonly PRINCIPAL = PRINCIPAL; protected readonly VACIO = VACIO;
  protected readonly TITULO = TITULO; protected readonly SUBTITULO = SUBTITULO; protected readonly CAMPO = CAMPO; protected readonly ETIQUETA = ETIQUETA;
  protected readonly BARRA = BARRA; protected readonly BARRA_ESTADO = BARRA_ESTADO; protected readonly MINI = MINI;
  protected readonly BOTON_SEC = BOTON_SEC + ' ' + BOTON_APAGADO; protected readonly COLOR_PUNTO = COLOR_PUNTO;
  protected readonly pct = pct; protected readonly pts = pts; protected readonly fechaLarga = fechaLarga; protected readonly enFrase = rubricaEnFrase;
  protected readonly abs = Math.abs;

  /**
   * Celdas de la tabla, con ! para ganarle a los estilos globales de tabla del tema. El contenido empieza donde
   * empieza el de las cajas (celda + borde + caja).
   */
  protected readonly TABLA = 'w-full table-fixed border-separate! border-spacing-0 bg-transparent! text-[.8125rem] text-foreground!';
  protected readonly TR = 'border-0! bg-transparent! hover:bg-transparent!';
  private static readonly CAB = 'sticky top-0 border-0! border-b! border-solid! border-border! bg-card! py-[.625rem]! text-left text-[.75rem]! leading-[1.5]! '
    + 'font-medium! tracking-normal! normal-case! whitespace-nowrap text-muted-foreground!';
  protected readonly TH_DIA = SeguimientoComponent.CAB + ' z-2 px-2! pl-[calc(.375rem+1px+.75rem)]! align-top';
  /** Asesor y Semana, al medio de la cabecera de dos líneas de los días. */
  protected readonly TH_AS = SeguimientoComponent.CAB + ' left-0 z-3 border-r! border-r-border! px-2! pl-[.75rem]! align-middle';
  protected readonly TH_TOT = SeguimientoComponent.CAB + ' right-0 z-3 border-l! border-l-border! px-[.75rem]! align-middle';
  private static readonly FILA = 'border-0! border-b! border-solid! border-(--line2)! bg-card! py-2! align-top leading-[1.5]! [tr:last-child>&]:border-b-0!';
  /** La columna del asesor lleva la letra de una cabecera; el nombre, la suya. */
  protected readonly TD_AS = SeguimientoComponent.FILA + ' sticky left-0 z-1 border-r! border-r-border! px-[.375rem]! pl-[.75rem]! pt-[calc(.5rem+1px+.625rem)]! '
    + 'text-left text-[.75rem]! font-medium! text-muted-foreground!';
  protected readonly TD = SeguimientoComponent.FILA + ' relative px-[.375rem]! text-[.8125rem]! text-foreground!';
  protected readonly TD_TOT = SeguimientoComponent.FILA + ' sticky right-0 z-1 border-l! border-l-border! px-[.75rem]! pt-[calc(.5rem+1px+.625rem)]! text-[.8125rem]! text-foreground!';
  private static readonly PIE = 'border-0! border-t! border-solid! border-border! bg-muted! py-2! align-top text-left leading-[1.5]!';
  protected readonly PIE_AS = SeguimientoComponent.PIE + ' sticky left-0 z-1 border-r! border-r-border! px-[.375rem]! pl-[.75rem]! text-[.75rem]! font-medium! text-muted-foreground!';
  protected readonly PIE_DIA = SeguimientoComponent.PIE + ' px-[.375rem]! pl-[calc(.375rem+1px+.75rem)]! text-[.8125rem]! text-foreground!';
  protected readonly PIE_TOT = SeguimientoComponent.PIE + ' sticky right-0 z-1 border-l! border-l-border! px-[.75rem]! text-[.8125rem]! text-foreground!';
  protected readonly CELDA = 'flex w-full flex-col gap-1 rounded-[.625rem] border border-solid border-border bg-card px-[.75rem] py-[.625rem] text-left [font:inherit] text-foreground';
  protected readonly ARRIBA = 'flex items-baseline justify-between gap-1 whitespace-nowrap';
  protected readonly NUMERO = 'text-[1rem] font-bold text-foreground! [font-variant-numeric:tabular-nums]';
  protected readonly UNIDAD = 'ml-[.125rem] text-[.6875rem] font-medium text-muted-foreground';

  protected readonly hoy = hoyIso();
  protected readonly lunesHoy = lunesDe(this.hoy);
  readonly lunes = signal(this.lunesHoy);
  readonly rubricas = signal<Rubrica[]>([]);
  readonly celdas = signal<SeguimientoCelda[]>([]);
  readonly rubricaElegida = signal<Rubrica | null>(null);
  readonly cargando = signal(false);
  readonly error = signal('');
  private pedido = 0;

  /** La elegida; si no, la que tiene más llamadas en la semana. */
  readonly rubrica = computed((): Rubrica | null => {
    const rs = this.rubricas(), elegida = this.rubricaElegida();
    if (elegida && rs.includes(elegida)) return elegida;
    const n = (r: Rubrica): number => this.celdas().filter(c => c.rubrica === r).reduce((s, c) => s + c.llamadas, 0);
    return [...rs].sort((a, b) => n(b) - n(a))[0] ?? null;
  });
  readonly opcionesRubrica = computed(() => this.rubricas().map(r => ({ clave: r, texto: NOMBRE[r] })));
  readonly puntos = computed(() => this.rubrica() ? puntosDe(this.rubrica()!) : []);
  private readonly deRubrica = computed(() => this.celdas().filter(c => c.rubrica === this.rubrica()));
  readonly dias = computed(() => {
    const lun = this.lunes(), conDatos = new Set(this.deRubrica().map(c => c.fecha));
    return [0, 1, 2, 3, 4].map(n => masDias(lun, n)).concat([masDias(lun, 5), masDias(lun, 6)].filter(d => conDatos.has(d)));
  });
  readonly etiquetaSemana = computed(() => {
    const a = this.lunes(), b = this.dias()[this.dias().length - 1];
    return a.slice(5, 7) === b.slice(5, 7) ? `${+a.slice(8, 10)} – ${diaCorto(b)}` : `${diaCorto(a)} – ${diaCorto(b)}`;
  });
  readonly filas = computed((): Fila[] => {
    const rub = this.rubrica(), dias = this.dias();
    if (!rub) return [];
    const celdas = this.deRubrica();
    return [...new Set(celdas.map(c => c.asesor))].sort((a, b) => a.localeCompare(b)).map(asesor => {
      const mias = celdas.filter(c => c.asesor === asesor);
      let anterior: number | null = null;
      const porDia = dias.map(d => {
        const del = mias.filter(c => c.fecha === d);
        if (!del.length) return null;
        const v = sumar(del, rub, anterior);
        anterior = v.puntaje;
        return v;
      });
      return { asesor, llamadas: mias.reduce((s, c) => s + c.llamadas, 0), dias: porDia, total: sumar(mias, rub, null) };
    });
  });
  readonly equipo = computed(() => {
    const rub = this.rubrica(), celdas = this.deRubrica();
    let anterior: number | null = null;
    const dias = this.dias().map(d => {
      const del = celdas.filter(c => c.fecha === d);
      if (!rub || !del.length) return null;
      const v = sumar(del, rub, anterior);
      anterior = v.puntaje;
      return v;
    });
    return { dias, total: sumar(celdas, rub ?? 'TER', null) };
  });
  readonly estadoBarra = computed(() => {
    const filas = this.filas();
    if (!filas.length) return 'Sin llamadas evaluadas esta semana';
    const n = filas.reduce((s, f) => s + f.llamadas, 0);
    return `${this.plural(filas.length, 'asesor', 'asesores')} · ${this.plural(n, 'llamada evaluada', 'llamadas evaluadas')} de ${rubricaEnFrase(this.rubrica()!)} esta semana`;
  });

  constructor() {
    if (!this.e.idSubcartera()) { this.volver(); return; }
    this.cargar(this.lunesHoy, true);
  }

  protected plural(n: number, uno: string, varios: string): string { return `${n} ${n === 1 ? uno : varios}`; }
  protected diaSemana(iso: string): string { return DIAS3[fechaDe(iso).getDay()]; }
  protected mes(iso: string): string { return MESES3[+iso.slice(5, 7) - 1]; }

  /**
   * Pide la semana. Al entrar (buscar), si esta semana no tiene llamadas, va hacia atrás hasta la última que sí,
   * hasta SEMANAS_ATRAS; si ninguna tiene, queda en esta semana.
   */
  private cargar(lunes: string, buscar = false, intentos = SEMANAS_ATRAS): void {
    const sub = this.e.idSubcartera();
    if (!sub) return;
    const n = ++this.pedido;
    this.cargando.set(true);
    this.error.set('');
    this.servicio.seguimiento(sub, lunes, masDias(lunes, 6)).subscribe({
      next: s => {
        if (n !== this.pedido) return;
        if (buscar && !s.celdas.length && intentos > 0) { this.cargar(masDias(lunes, -7), true, intentos - 1); return; }
        const vacia = buscar && !s.celdas.length;
        this.lunes.set(vacia ? this.lunesHoy : lunes);
        this.rubricas.set(s.rubricas);
        this.celdas.set(vacia ? [] : s.celdas);
        this.cargando.set(false);
      },
      error: err => {
        if (n !== this.pedido) return;
        this.cargando.set(false);
        this.error.set(err?.error?.message || 'No se pudo cargar el seguimiento');
        this.toast.error(this.error());
      }
    });
  }

  moverSemana(n: number): void {
    const destino = masDias(this.lunes(), 7 * n);
    this.irA(destino > this.lunesHoy ? this.lunesHoy : destino);
  }
  irA(lunes: string): void { this.lunes.set(lunes); this.cargar(lunes); }

  volver(): void { this.router.navigate(['/admin/recordings'], { queryParams: { tab: 'monitoreo' } }); }
  verAsesor(asesor: string): void { this.router.navigate(['/admin/recordings/rendimiento'], { queryParams: { asesor } }); }
  /** La lista de llamadas de ese asesor en ese día. */
  verDia(asesor: string, dia: string): void {
    this.e.asesor.set(asesor); this.e.desde.set(dia); this.e.hasta.set(dia);
    this.e.filtro.set(''); this.e.pagina.set(1);
    this.volver();
  }
  verSemana(): void {
    const dom = masDias(this.lunes(), 6);
    this.e.asesor.set(''); this.e.desde.set(this.lunes()); this.e.hasta.set(dom > this.hoy ? this.hoy : dom);
    this.e.filtro.set(''); this.e.pagina.set(1);
    this.volver();
  }
}
