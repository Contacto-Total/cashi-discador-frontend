import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, computed, effect, inject, signal, untracked } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { ToastService } from '../../../../shared/services/toast.service';
import { BotonDirective } from '../../../../shared/ui/boton.directive';
import { TarjetaDirective } from '../../../../shared/ui/tarjeta.directive';
import { BARRA, BARRA_ESTADO, BARRA_ESTADO_HAY, CAMPO, ENTRADA, ETIQUETA, LISTA, PANTALLA, PRINCIPAL, REJILLA, REJILLA_SOLA, SUBTITULO, TITULO, VACIO } from '../../../asistencia/ui/clases';
import { BOTON_APAGADO, BOTON_SEC } from '../../../asistencia/ui/control-comun';
import { MINI } from '../../../asistencia/ui/ficha-clases';
import { IndicadorComponent } from '../../../asistencia/ui/indicador.component';
import { SegmentadoComponent } from '../../../asistencia/ui/segmentado.component';
import { MonitoreoEstado, hoyIso } from './monitoreo-estado';
import { MonitoreoService } from './monitoreo.service';
import { CriterioRendimiento, Rendimiento, Rubrica } from './monitoreo.models';
import { PuntoPerfil, gruposDe, pct, perfil, puntoDe, pts, rubricaEnFrase, rubricasDe } from './monitoreo.calculos';

const NOMBRE: Record<Rubrica, string> = { TIT: 'Titular', TER: 'Tercero', PDP: 'PDP', CD: 'CD' };
const fechaCorta = (f: string): string => `${f.slice(8, 10)}/${f.slice(5, 7)}/${f.slice(0, 4)}`;

interface Etiqueta { x: number; y: number; ancla: string; nombre: string; valor: string; }

/**
 * Rendimiento de un asesor o de todo el equipo en la subcartera: toda la historia evaluada. Puntaje, llamadas,
 * faltas y revisadas; el puntaje de cada punto de la rúbrica elegida en un gráfico radial (5 puntos con el
 * titular, 3 con un tercero), y los criterios que más falla agrupados por punto.
 */
@Component({
  selector: 'app-rendimiento',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: PANTALLA + ' @container/p5' },
  imports: [LucideAngularModule, TarjetaDirective, BotonDirective, IndicadorComponent, SegmentadoComponent],
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
            <p role="heading" aria-level="1" [class]="TITULO + ' whitespace-normal!'">{{ asesor() || 'Todo el equipo' }}</p>
            <p [class]="SUBTITULO">{{ subtitulo() }}</p>
          </div>
          <div class="ml-auto flex min-w-0 flex-[1_1_auto] flex-nowrap items-end justify-end gap-x-3 gap-y-2">
            <!-- El rango es el mismo de la lista de llamadas: «Ver las llamadas» abre las mismas fechas. -->
            <div [class]="CAMPO + ' flex-none'">
              <label for="r-desde" [class]="ETIQUETA">Desde</label>
              <input id="r-desde" type="date" [class]="ENTRADA" [value]="e.desde()" [max]="e.hasta()" (change)="cambiarDesde($any($event.target).value)">
            </div>
            <div [class]="CAMPO + ' flex-none'">
              <label for="r-hasta" [class]="ETIQUETA">Hasta</label>
              <input id="r-hasta" type="date" [class]="ENTRADA" [value]="e.hasta()" [min]="e.desde()" [max]="hoy" (change)="cambiarHasta($any($event.target).value)">
            </div>
            <div [class]="CAMPO + ' flex-none'">
              <span [class]="ETIQUETA">Rúbrica</span>
              <app-segmentado [opciones]="opcionesRubrica()" [valor]="rubrica() ?? ''" (cambiar)="rubricaElegida.set($any($event))" />
            </div>
            <div [class]="CAMPO + ' flex-[0_0_15rem]'">
              <label for="r-asesor" [class]="ETIQUETA">Asesor</label>
              <select id="r-asesor" [class]="LISTA" (change)="elegirAsesor($any($event.target).value)">
                <option value="" [selected]="!asesor()">Todo el equipo</option>
                @for (a of datos()?.asesores ?? []; track a) { <option [value]="a" [selected]="a === asesor()">{{ a }}</option> }
              </select>
            </div>
          </div>
        </div>

        @if (datos(); as d) {
          @let r = deRubrica();
          <div class="mb-8 grid flex-none grid-cols-4 items-stretch gap-8 [@media(max-height:700px)]:mb-4 transition-opacity duration-200 motion-reduce:transition-none" [class.opacity-60]="actualizando()">
            <app-indicador [bajo]="true" [compacto]="true" [valor]="pct(puntaje())" [unidad]="puntaje() == null ? '' : '%'" rotulo="Puntaje" [detalle]="pts(r?.puntos ?? 0) + ' de ' + pts(r?.posibles ?? 0) + ' puntos'" />
            <app-indicador [bajo]="true" [compacto]="true" [valor]="r?.llamadas ?? 0" rotulo="Llamadas evaluadas" [detalle]="desglose()" />
            @if (asesor() && esFoh()) {
              <!-- FOH no tiene faltas críticas: con un asesor, se compara con el equipo en la misma rúbrica y fechas. -->
              <app-indicador [bajo]="true" [compacto]="true" [valor]="pct(puntajeEquipo().valor)" [unidad]="puntajeEquipo().valor == null ? '' : '%'" rotulo="Puntaje del equipo"
                             [detalle]="'Promedio de ' + puntajeEquipo().asesores + (puntajeEquipo().asesores === 1 ? ' asesor' : ' asesores')" />
            } @else if (asesor()) {
              <app-indicador [bajo]="true" [compacto]="true" [valor]="r?.faltas ?? 0" rotulo="Faltas críticas" [detalle]="r?.faltas ? 'Revisar en sus llamadas' : 'Ninguna'" />
            } @else {
              <app-indicador [bajo]="true" [compacto]="true" [valor]="r?.asesores ?? 0" rotulo="Asesores" detalle="con llamadas evaluadas" />
            }
            <app-indicador [bajo]="true" [compacto]="true" [valor]="r?.revisadas ?? 0" rotulo="Revisadas" [detalle]="'de ' + (r?.llamadas ?? 0)" />
          </div>

          <div class="grid min-h-0 flex-auto grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] items-stretch gap-8 max-[1100px]:grid-cols-1 transition-opacity duration-200 motion-reduce:transition-none" [class.opacity-60]="actualizando()">
            <section [class]="CAJA">
              <div [class]="CAB">
                <p role="heading" aria-level="2" class="m-0 text-[.9375rem] font-semibold text-foreground">Puntaje por punto</p>
                @if (rubrica()) { <span class="text-[.8125rem] text-muted-foreground">{{ NOMBRE[rubrica()!] }}</span> }
              </div>
              @if (llamadasRubrica()) {
                <svg class="mx-auto block h-full min-h-0 w-full max-w-[28rem] flex-auto overflow-visible pt-[.75rem]" [attr.viewBox]="'0 0 ' + radar().w + ' 290'" role="img" [attr.aria-label]="'Puntaje por punto de ' + (asesor() || 'todo el equipo')">
                  @for (pol of radar().rejilla; track $index) { <polygon [attr.points]="pol" fill="none" stroke="var(--border)" stroke-width="1" /> }
                  @for (l of radar().ejes; track $index) { <line [attr.x1]="radar().cx" [attr.y1]="radar().cy" [attr.x2]="l[0]" [attr.y2]="l[1]" stroke="var(--border)" stroke-width="1" /> }
                  <polygon [attr.points]="radar().forma" fill="color-mix(in oklab, var(--serie-a) 16%, transparent)" stroke="var(--serie-a)" stroke-width="2" stroke-linejoin="round" />
                  @for (c of radar().puntos; track $index) {
                    <circle [attr.cx]="c.x" [attr.cy]="c.y" r="5" fill="var(--serie-a)" stroke="var(--card)" stroke-width="2" />
                  }
                  @for (e of radar().etiquetas; track $index) {
                    <text [attr.x]="e.x" [attr.y]="e.y" [attr.text-anchor]="e.ancla" fill="var(--ink2)" font-size="11.5px">{{ e.nombre }}<tspan [attr.x]="e.x" dy="17" fill="var(--foreground)" font-weight="700" font-size="12px">{{ e.valor }}</tspan></text>
                  }
                  <!-- Zona de 14 px alrededor de cada punto: el punto mide 5 y no se acierta con el mouse. -->
                  @for (z of radar().zonas; track $index) {
                    <circle [attr.cx]="z.x" [attr.cy]="z.y" r="14" tabindex="0" class="cursor-default fill-transparent outline-none hover:fill-[color-mix(in_srgb,var(--serie-a)_14%,transparent)] focus-visible:fill-[color-mix(in_srgb,var(--serie-a)_14%,transparent)]"
                            [attr.aria-label]="z.titulo + ': ' + z.detalle"
                            (pointerenter)="verTip(z, $event.clientX, $event.clientY)" (pointermove)="verTip(z, $event.clientX, $event.clientY)" (pointerleave)="tip.set(null)"
                            (focus)="verTipFoco(z, $event)" (blur)="tip.set(null)" />
                  }
                </svg>
                <p class="m-0 text-[.75rem] text-muted-foreground">Calculado sobre {{ llamadasRubrica() }} {{ llamadasRubrica() === 1 ? 'llamada' : 'llamadas' }}</p>
              } @else {
                <div [class]="VACIO">Sin llamadas evaluadas</div>
              }
            </section>

            <section [class]="CAJA">
              <div [class]="CAB">
                <p role="heading" aria-level="2" class="m-0 text-[.9375rem] font-semibold text-foreground">Criterios que más falla</p>
                @if (rubrica()) { <span class="text-[.8125rem] text-muted-foreground">{{ NOMBRE[rubrica()!] }}</span> }
              </div>
              @if (fallas().length) {
                <div class="-mr-2 min-h-0 flex-auto overflow-y-auto pr-2">
                  @for (g of fallas(); track g.clave; let primero = $first) {
                    <div [class]="primero ? '' : 'mt-[.5rem]'">
                      <div class="flex items-baseline justify-between gap-3 rounded-[.5rem] bg-muted px-[.625rem] py-2"><span class="text-[.8125rem] font-semibold">{{ g.nombre }}</span></div>
                      <ol class="m-0 flex list-none flex-col p-0">
                        @for (k of g.items; track k.codigo; let pri = $first) {
                          <li class="grid items-center gap-3 border-0 border-solid border-(--line2) py-[.625rem] text-foreground"
                              [class]="(esFoh() ? 'grid-cols-[minmax(0,1fr)_7rem_3.25rem] ' : 'grid-cols-[2.25rem_minmax(0,1fr)_8rem_3rem] ') + (pri ? 'pt-[.625rem]' : 'border-t')">
                            @if (!esFoh()) { <span class="font-semibold text-muted-foreground">{{ k.codigo }}</span> }
                            <span class="min-w-0 text-foreground">{{ k.texto }}<small class="mt-[.0625rem] block text-[.75rem] text-muted-foreground">Falla en {{ k.noCumple }} de {{ k.cumple + k.noCumple }} llamadas</small></span>
                            <span class="h-[.375rem] overflow-hidden rounded-full bg-muted"><span class="block h-full rounded-[inherit] bg-(--ro-pt)" [style.width.%]="falla(k)"></span></span>
                            <span class="text-right font-semibold text-foreground">{{ pts(falla(k)) }} %</span>
                          </li>
                        }
                      </ol>
                    </div>
                  }
                </div>
              } @else {
                <div [class]="VACIO">{{ llamadasRubrica() ? 'Ningún criterio falla' : 'Sin llamadas evaluadas' }}</div>
              }
            </section>
          </div>
        } @else {
          <div [class]="VACIO">{{ error() || 'Cargando…' }}</div>
        }
      </section>
    </div>

    @if (tip(); as t) {
      <!-- El tooltip del gráfico, como el del artifact: el punto arriba, en negrita, y su puntaje debajo. -->
      <div class="pointer-events-none fixed z-60 max-w-[18rem] min-w-[10rem] -translate-y-full rounded-[.5rem] border border-solid border-border bg-(--popover) px-[.625rem] py-[.5rem] text-[.75rem] leading-[1.45] text-(--ink2) shadow-[0_8px_24px_rgb(0_0_0/.12)]"
           [style.left.px]="t.x" [style.top.px]="t.y" role="tooltip">
        <div class="mb-1 font-semibold text-foreground">{{ t.titulo }}</div>
        <div>{{ t.detalle }}</div>
      </div>
    }
    <div appTarjeta [class]="BARRA">
      <span [class]="porRevisar() ? BARRA_ESTADO_HAY : BARRA_ESTADO">{{ estadoBarra() }}</span>
      <button type="button" appBoton="secundario" [class]="'px-4! ' + BOTON_SEC" (click)="verLlamadas()">
        <lucide-angular name="list" [size]="16" class="flex"></lucide-angular>{{ asesor() ? 'Ver sus llamadas' : 'Ver las llamadas' }}
      </button>
    </div>
  `
})
export class RendimientoComponent implements OnDestroy {
  private readonly servicio = inject(MonitoreoService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);
  private readonly ruta = inject(ActivatedRoute);
  protected readonly e = inject(MonitoreoEstado);

  protected readonly REJILLA = REJILLA; protected readonly REJILLA_SOLA = REJILLA_SOLA; protected readonly PRINCIPAL = PRINCIPAL; protected readonly VACIO = VACIO;
  protected readonly TITULO = TITULO; protected readonly SUBTITULO = SUBTITULO; protected readonly CAMPO = CAMPO; protected readonly ETIQUETA = ETIQUETA;
  protected readonly ENTRADA = ENTRADA;
  protected readonly LISTA = LISTA; protected readonly BARRA = BARRA; protected readonly BARRA_ESTADO = BARRA_ESTADO; protected readonly BARRA_ESTADO_HAY = BARRA_ESTADO_HAY;
  protected readonly BOTON_SEC = BOTON_SEC + ' ' + BOTON_APAGADO; protected readonly MINI = MINI; protected readonly NOMBRE = NOMBRE; protected readonly pct = pct; protected readonly pts = pts;
  protected readonly CAJA = 'flex min-h-0 flex-col gap-[.875rem] overflow-hidden rounded-[.75rem] border border-solid border-border bg-card px-5 py-[1.125rem]';
  protected readonly CAB = 'flex min-h-[2.25rem] items-center justify-between gap-3 border-0 border-b border-solid border-(--line2) pb-[.75rem]';

  readonly asesor = signal<string | null>(null);
  readonly datos = signal<Rendimiento | null>(null);
  /** Pidiendo otro asesor: lo anterior sigue a la vista, atenuado, hasta que llega lo nuevo. */
  readonly actualizando = signal(false);
  private pedido = 0;
  /** Los porcentajes que dibuja el gráfico; pasan de un asesor al otro en una transición corta. */
  private readonly dibujados = signal<number[] | null>(null);
  /** El tooltip del gráfico: arriba a la derecha del puntero, como el del artifact; null si no se muestra. */
  readonly tip = signal<{ x: number; y: number; titulo: string; detalle: string } | null>(null);
  private readonly anfitrion = inject<ElementRef<HTMLElement>>(ElementRef);
  private cuadro = 0;
  readonly error = signal('');
  readonly rubricaElegida = signal<Rubrica | null>(null);

  readonly esFoh = computed(() => this.rubrica() === 'PDP' || this.rubrica() === 'CD');
  /** Cada rúbrica se mide por separado: tarjetas, gráfico, criterios y barra son de la elegida. */
  readonly deRubrica = computed(() => this.datos()?.rubricas.find(r => r.rubrica === this.rubrica()) ?? null);
  readonly puntaje = computed(() => { const r = this.deRubrica(); return r?.posibles ? (r.puntos / r.posibles) * 100 : null; });
  readonly subtitulo = computed(() => {
    const d = this.datos();
    if (!d) return '';
    const rango = `del ${fechaCorta(this.e.desde())} al ${fechaCorta(this.e.hasta())}`;
    return d.llamadas ? 'D' + rango.slice(1) : 'Sin llamadas evaluadas ' + rango;
  });
  /** El rendimiento del equipo en las mismas fechas, para comparar a un asesor de FOH. */
  private readonly equipo = signal<Rendimiento | null>(null);
  readonly puntajeEquipo = computed(() => {
    const r = this.equipo()?.rubricas.find(x => x.rubrica === this.rubrica());
    return { valor: r?.posibles ? (r.puntos / r.posibles) * 100 : null, asesores: r?.asesores ?? 0 };
  });
  protected readonly hoy = hoyIso();
  readonly desglose = computed(() => this.rubricas().map(r => `${this.datos()?.rubricas.find(x => x.rubrica === r)?.llamadas ?? 0} ${rubricaEnFrase(r)}`).join(' · '));
  /** Las dos rúbricas del cliente, aunque una no tenga llamadas. */
  readonly rubricas = computed((): Rubrica[] => rubricasDe((this.datos()?.rubricas ?? []).map(r => r.rubrica)));
  /** La rúbrica elegida; si no, la que tiene más llamadas. */
  readonly rubrica = computed((): Rubrica | null => {
    if (!this.datos()) return null;
    const rs = this.rubricas(), elegida = this.rubricaElegida();
    if (elegida && rs.includes(elegida)) return elegida;
    const n = (r: Rubrica): number => this.datos()?.rubricas.find(x => x.rubrica === r)?.llamadas ?? 0;
    return [...rs].sort((a, b) => n(b) - n(a))[0] ?? null;
  });
  readonly opcionesRubrica = computed(() => this.rubricas().map(r => ({ clave: r, texto: NOMBRE[r] })));
  private readonly criterios = computed((): CriterioRendimiento[] => this.datos()?.rubricas.find(r => r.rubrica === this.rubrica())?.criterios ?? []);
  readonly llamadasRubrica = computed(() => this.datos()?.rubricas.find(r => r.rubrica === this.rubrica())?.llamadas ?? 0);
  readonly ejes = computed((): PuntoPerfil[] => this.rubrica() ? perfil(this.rubrica()!, this.criterios()) : []);

  /** Geometría del gráfico: la misma del prototipo (3 ejes: R 110 y centro 176; 5 ejes: R 92 y centro 150). */
  readonly radar = computed(() => {
    const ejes = this.ejes(), n = ejes.length || 3;
    const w = n === 3 ? 400 : 450, cx = w / 2, cy = n === 3 ? 176 : 150, r = n === 3 ? 110 : 92;
    const ang = (i: number): number => -Math.PI / 2 + (i * 2 * Math.PI) / n;
    const pt = (i: number, v: number): [number, number] => [cx + Math.cos(ang(i)) * r * v / 100, cy + Math.sin(ang(i)) * r * v / 100];
    const poli = (v: number): string => ejes.map((_, i) => pt(i, v).map(z => z.toFixed(1)).join(',')).join(' ');
    const dib = this.dibujados();
    const valor = (i: number): number => dib && dib.length === ejes.length ? dib[i] : (ejes[i].porcentaje ?? 0);
    const etiquetas: Etiqueta[] = ejes.map((e, i) => {
      const [x, y] = pt(i, 128);
      const ancla = Math.abs(x - cx) < 4 ? 'middle' : x > cx ? 'start' : 'end';
      const dy = y < cy - r * 0.9 ? -6 : y > cy + 20 ? 12 : 4;
      return { x: +x.toFixed(1), y: +(y + dy).toFixed(1), ancla, nombre: e.nombre, valor: e.porcentaje == null ? '—' : pts(e.porcentaje) + ' %' };
    });
    return {
      w, cx, cy,
      rejilla: [25, 50, 75, 100].map(poli),
      ejes: ejes.map((_, i) => pt(i, 100).map(z => +z.toFixed(1))),
      forma: ejes.map((e, i) => pt(i, valor(i)).map(z => z.toFixed(1)).join(',')).join(' '),
      zonas: ejes.map((e, i) => ({ x: +pt(i, e.porcentaje ?? 0)[0].toFixed(1), y: +pt(i, e.porcentaje ?? 0)[1].toFixed(1), titulo: e.nombre,
        detalle: e.porcentaje == null ? 'No aplica' : `${pts(e.porcentaje)} % · ${pts(e.cumplidos)} de ${pts(e.posibles)} puntos` })),
      puntos: ejes.flatMap((e, i) => e.porcentaje == null ? [] : [{ x: +pt(i, valor(i))[0].toFixed(1), y: +pt(i, valor(i))[1].toFixed(1) }]),
      etiquetas
    };
  });

  /** Solo los criterios que fallan, en los puntos del gráfico; en cada punto, primero el que más veces falló. */
  readonly fallas = computed(() => {
    const rub = this.rubrica();
    if (!rub) return [];
    return gruposDe(rub).map(p => ({
      clave: p.clave, nombre: p.nombre,
      items: this.criterios().filter(c => c.noCumple > 0 && puntoDe(rub, c) === p.clave)
        .sort((a, b) => b.noCumple - a.noCumple || this.falla(b) - this.falla(a))
    })).filter(g => g.items.length);
  });

  readonly porRevisar = computed(() => (this.deRubrica()?.llamadas ?? 0) - (this.deRubrica()?.revisadas ?? 0));
  readonly estadoBarra = computed(() => {
    const r = this.deRubrica();
    if (!r?.llamadas) return 'Sin llamadas evaluadas';
    const n = this.porRevisar();
    return `${r.llamadas} ${r.llamadas === 1 ? 'llamada evaluada' : 'llamadas evaluadas'} de ${rubricaEnFrase(r.rubrica)}` + (n ? ` · ${n} por revisar` : '');
  });

  constructor() {
    effect(() => {
      const destino = this.ejes().map(e => e.porcentaje ?? 0);
      untracked(() => this.animar(destino));
    });
    this.ruta.queryParamMap.subscribe(q => {
      this.asesor.set(q.get('asesor'));
      this.cargar();
    });
  }

  protected falla(k: CriterioRendimiento): number { const t = k.cumple + k.noCumple; return t ? (k.noCumple / t) * 100 : 0; }

  private cargar(): void {
    const sub = this.e.idSubcartera();
    if (!sub) { this.volver(); return; }
    const n = ++this.pedido;
    this.error.set('');
    this.actualizando.set(true);
    const desde = this.e.desde(), hasta = this.e.hasta(), asesor = this.asesor();
    this.servicio.rendimiento(sub, asesor, desde, hasta).subscribe({
      next: d => {
        if (n !== this.pedido) return;
        this.datos.set(d); this.actualizando.set(false);
        this.equipo.set(null);
        // Solo FOH con un asesor necesita el equipo (la tarjeta que reemplaza a «Faltas críticas»).
        const foh = d.rubricas.some(r => r.rubrica === 'PDP' || r.rubrica === 'CD');
        if (asesor && foh) {
          this.servicio.rendimiento(sub, null, desde, hasta).subscribe({ next: eq => { if (n === this.pedido) this.equipo.set(eq); }, error: () => this.equipo.set(null) });
        }
      },
      error: err => {
        if (n !== this.pedido) return;
        this.actualizando.set(false);
        this.error.set(err?.error?.message || 'No se pudo cargar el rendimiento');
        this.toast.error(this.error());
      }
    });
  }

  cambiarDesde(v: string): void {
    if (!v) return;
    this.e.desde.set(v);
    if (this.e.hasta() < v) this.e.hasta.set(v);
    this.e.pagina.set(1);
    this.cargar();
  }
  cambiarHasta(v: string): void {
    if (!v) return;
    const h = v > this.hoy ? this.hoy : v;
    this.e.hasta.set(h);
    if (this.e.desde() > h) this.e.desde.set(h);
    this.e.pagina.set(1);
    this.cargar();
  }

  /** Lleva el gráfico a los porcentajes nuevos en 280 ms; sin forma previa, con otra rúbrica o sin animaciones, de golpe. */
  private animar(destino: number[]): void {
    cancelAnimationFrame(this.cuadro);
    const desde = this.dibujados();
    if (!desde || desde.length !== destino.length || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.dibujados.set(destino);
      return;
    }
    const inicio = performance.now();
    const paso = (t: number): void => {
      const k = Math.min(1, (t - inicio) / 280), e = 1 - Math.pow(1 - k, 3);
      this.dibujados.set(destino.map((d, i) => desde[i] + (d - desde[i]) * e));
      if (k < 1) this.cuadro = requestAnimationFrame(paso);
    };
    this.cuadro = requestAnimationFrame(paso);
  }

  /**
   * La pantalla es un contenedor (@container) y eso la vuelve la referencia de position: fixed; por eso el tooltip
   * se ubica con coordenadas relativas a ella y no a la ventana.
   */
  verTip(z: { titulo: string; detalle: string }, x: number, y: number): void {
    const caja = this.anfitrion.nativeElement.getBoundingClientRect();
    this.tip.set({ titulo: z.titulo, detalle: z.detalle, x: Math.min(caja.width - 296, x - caja.left + 14), y: Math.max(8, y - caja.top - 10) });
  }
  /** Con teclado, el tooltip sale junto al punto enfocado. */
  verTipFoco(z: { titulo: string; detalle: string }, ev: FocusEvent): void {
    const r = (ev.target as Element).getBoundingClientRect();
    this.verTip(z, r.right, r.top);
  }

  ngOnDestroy(): void { cancelAnimationFrame(this.cuadro); }

  elegirAsesor(a: string): void {
    this.router.navigate([], { relativeTo: this.ruta, queryParams: a ? { asesor: a } : {}, replaceUrl: true });
  }
  volver(): void { this.router.navigate(['/admin/recordings'], { queryParams: { tab: 'monitoreo' } }); }
  verLlamadas(): void {
    this.e.asesor.set(this.asesor() ?? '');
    this.e.filtro.set('');
    this.e.pagina.set(1);
    this.router.navigate(['/admin/recordings/llamadas']);
  }
}
