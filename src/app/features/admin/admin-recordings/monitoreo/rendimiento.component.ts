import { ChangeDetectionStrategy, Component, OnDestroy, computed, effect, inject, signal, untracked } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { ToastService } from '../../../../shared/services/toast.service';
import { BotonDirective } from '../../../../shared/ui/boton.directive';
import { TarjetaDirective } from '../../../../shared/ui/tarjeta.directive';
import { BARRA, BARRA_ESTADO, BARRA_ESTADO_HAY, CAMPO, ETIQUETA, LISTA, PANTALLA, PRINCIPAL, REJILLA, REJILLA_SOLA, SUBTITULO, TITULO, VACIO } from '../../../asistencia/ui/clases';
import { BOTON_APAGADO, BOTON_SEC } from '../../../asistencia/ui/control-comun';
import { MINI } from '../../../asistencia/ui/ficha-clases';
import { IndicadorComponent } from '../../../asistencia/ui/indicador.component';
import { SegmentadoComponent } from '../../../asistencia/ui/segmentado.component';
import { MonitoreoEstado } from './monitoreo-estado';
import { MonitoreoService } from './monitoreo.service';
import { CriterioRendimiento, Rendimiento, Rubrica } from './monitoreo.models';
import { PuntoPerfil, pct, perfil, puntoDe, puntosDe, pts } from './monitoreo.calculos';

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
          <div [class]="CAMPO + ' ml-auto flex-[0_0_15rem]'">
            <label for="r-asesor" [class]="ETIQUETA">Asesor</label>
            <select id="r-asesor" [class]="LISTA" (change)="elegirAsesor($any($event.target).value)">
              <option value="" [selected]="!asesor()">Todo el equipo</option>
              @for (a of datos()?.asesores ?? []; track a) { <option [value]="a" [selected]="a === asesor()">{{ a }}</option> }
            </select>
          </div>
        </div>

        @if (datos(); as d) {
          <div class="mb-8 grid flex-none grid-cols-4 items-stretch gap-8 [@media(max-height:700px)]:mb-4 transition-opacity duration-200 motion-reduce:transition-none" [class.opacity-60]="actualizando()">
            <app-indicador [bajo]="true" [compacto]="true" [valor]="pct(puntaje())" [unidad]="puntaje() == null ? '' : '%'" rotulo="Puntaje" [detalle]="pts(d.puntos) + ' de ' + pts(d.posibles) + ' puntos'" />
            <app-indicador [bajo]="true" [compacto]="true" [valor]="d.llamadas" rotulo="Llamadas evaluadas" [detalle]="desglose()" />
            @if (asesor()) {
              <app-indicador [bajo]="true" [compacto]="true" [valor]="d.faltas" rotulo="Faltas críticas" [detalle]="d.faltas ? 'Revisar en sus llamadas' : 'Ninguna'" />
            } @else {
              <app-indicador [bajo]="true" [compacto]="true" [valor]="d.asesores.length" rotulo="Asesores" detalle="con llamadas evaluadas" />
            }
            <app-indicador [bajo]="true" [compacto]="true" [valor]="d.revisadas" rotulo="Revisadas" [detalle]="'de ' + d.llamadas" />
          </div>

          <div class="grid min-h-0 flex-auto grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] items-stretch gap-8 max-[1100px]:grid-cols-1 transition-opacity duration-200 motion-reduce:transition-none" [class.opacity-60]="actualizando()">
            <section [class]="CAJA">
              <div [class]="CAB">
                <p role="heading" aria-level="2" class="m-0 text-[.9375rem] font-semibold text-foreground">Puntaje por punto</p>
                @if (d.rubricas.length > 1) {
                  <app-segmentado [opciones]="opcionesRubrica()" [valor]="rubrica() ?? ''" (cambiar)="rubricaElegida.set($any($event))" />
                } @else if (rubrica()) { <span class="text-[.8125rem] text-muted-foreground">{{ NOMBRE[rubrica()!] }}</span> }
              </div>
              @if (llamadasRubrica()) {
                <svg class="mx-auto block h-full min-h-0 w-full max-w-[28rem] flex-auto overflow-visible pt-[.75rem]" [attr.viewBox]="'0 0 ' + radar().w + ' 290'" role="img" [attr.aria-label]="'Puntaje por punto de ' + (asesor() || 'todo el equipo')">
                  @for (pol of radar().rejilla; track $index) { <polygon [attr.points]="pol" fill="none" stroke="var(--border)" stroke-width="1" /> }
                  @for (l of radar().ejes; track $index) { <line [attr.x1]="radar().cx" [attr.y1]="radar().cy" [attr.x2]="l[0]" [attr.y2]="l[1]" stroke="var(--border)" stroke-width="1" /> }
                  <polygon [attr.points]="radar().forma" fill="color-mix(in oklab, var(--serie-a) 16%, transparent)" stroke="var(--serie-a)" stroke-width="2" stroke-linejoin="round" />
                  @for (c of radar().puntos; track $index) {
                    <circle [attr.cx]="c.x" [attr.cy]="c.y" r="5" fill="var(--serie-a)" stroke="var(--card)" stroke-width="2"><title>{{ c.tip }}</title></circle>
                  }
                  @for (e of radar().etiquetas; track $index) {
                    <text [attr.x]="e.x" [attr.y]="e.y" [attr.text-anchor]="e.ancla" fill="var(--ink2)" font-size="11.5px">{{ e.nombre }}<tspan [attr.x]="e.x" dy="17" fill="var(--foreground)" font-weight="700" font-size="12px">{{ e.valor }}</tspan></text>
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
  private readonly e = inject(MonitoreoEstado);

  protected readonly REJILLA = REJILLA; protected readonly REJILLA_SOLA = REJILLA_SOLA; protected readonly PRINCIPAL = PRINCIPAL; protected readonly VACIO = VACIO;
  protected readonly TITULO = TITULO; protected readonly SUBTITULO = SUBTITULO; protected readonly CAMPO = CAMPO; protected readonly ETIQUETA = ETIQUETA;
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
  private cuadro = 0;
  readonly error = signal('');
  readonly rubricaElegida = signal<Rubrica | null>(null);

  readonly esFoh = computed(() => this.rubrica() === 'PDP' || this.rubrica() === 'CD');
  readonly puntaje = computed(() => { const d = this.datos(); return d?.posibles ? (d.puntos / d.posibles) * 100 : null; });
  readonly subtitulo = computed(() => {
    const d = this.datos();
    if (!d) return '';
    return d.llamadas && d.desde && d.hasta ? `Toda la historia evaluada: del ${fechaCorta(d.desde)} al ${fechaCorta(d.hasta)}` : 'Sin llamadas evaluadas';
  });
  readonly desglose = computed(() => (this.datos()?.rubricas ?? [])
    .map(r => `${r.llamadas} ${NOMBRE[r.rubrica].length > 3 ? NOMBRE[r.rubrica].toLowerCase() : NOMBRE[r.rubrica]}`).join(' · '));
  /** La rúbrica elegida; si no, la que tiene más llamadas. */
  readonly rubrica = computed((): Rubrica | null => {
    const rs = this.datos()?.rubricas ?? [], elegida = this.rubricaElegida();
    if (elegida && rs.some(r => r.rubrica === elegida)) return elegida;
    return [...rs].sort((a, b) => b.llamadas - a.llamadas)[0]?.rubrica ?? null;
  });
  readonly opcionesRubrica = computed(() => (this.datos()?.rubricas ?? []).map(r => ({ clave: r.rubrica, texto: NOMBRE[r.rubrica] })));
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
      puntos: ejes.flatMap((e, i) => e.porcentaje == null ? [] : [{ x: +pt(i, valor(i))[0].toFixed(1), y: +pt(i, valor(i))[1].toFixed(1),
        tip: `${e.nombre}: ${pts(e.porcentaje)} % · ${pts(e.cumplidos)} de ${pts(e.posibles)} puntos` }]),
      etiquetas
    };
  });

  /** Solo los criterios que fallan, en los puntos del gráfico; en cada punto, primero el que más veces falló. */
  readonly fallas = computed(() => {
    const rub = this.rubrica();
    if (!rub) return [];
    return puntosDe(rub).map(p => ({
      clave: p.clave, nombre: p.nombre,
      items: this.criterios().filter(c => c.noCumple > 0 && puntoDe(rub, c) === p.clave)
        .sort((a, b) => b.noCumple - a.noCumple || this.falla(b) - this.falla(a))
    })).filter(g => g.items.length);
  });

  readonly porRevisar = computed(() => (this.datos()?.llamadas ?? 0) - (this.datos()?.revisadas ?? 0));
  readonly estadoBarra = computed(() => {
    const d = this.datos();
    if (!d?.llamadas) return 'Sin llamadas evaluadas';
    const n = this.porRevisar();
    return `${d.llamadas} ${d.llamadas === 1 ? 'llamada evaluada' : 'llamadas evaluadas'}` + (n ? ` · ${n} por revisar` : '');
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
    this.servicio.rendimiento(sub, this.asesor()).subscribe({
      next: d => { if (n !== this.pedido) return; this.datos.set(d); this.actualizando.set(false); },
      error: err => {
        if (n !== this.pedido) return;
        this.actualizando.set(false);
        this.error.set(err?.error?.message || 'No se pudo cargar el rendimiento');
        this.toast.error(this.error());
      }
    });
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

  ngOnDestroy(): void { cancelAnimationFrame(this.cuadro); }

  elegirAsesor(a: string): void {
    this.router.navigate([], { relativeTo: this.ruta, queryParams: a ? { asesor: a } : {}, replaceUrl: true });
  }
  volver(): void { this.router.navigate(['/admin/recordings'], { queryParams: { tab: 'monitoreo' } }); }
  verLlamadas(): void {
    this.e.asesor.set(this.asesor() ?? '');
    this.e.filtro.set('');
    this.e.pagina.set(1);
    this.volver();
  }
}
