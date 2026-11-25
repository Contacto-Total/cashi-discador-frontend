import { ChangeDetectionStrategy, Component, ElementRef, ViewChild, computed, effect, inject, untracked } from '@angular/core';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { ToastService } from '../../../../shared/services/toast.service';
import { BotonDirective } from '../../../../shared/ui/boton.directive';
import { TarjetaDirective } from '../../../../shared/ui/tarjeta.directive';
import {
  BARRA, BARRA_ESTADO, BARRA_ESTADO_HAY, BUSCAR, BUSCAR_CAMPO, BUSCAR_ICONO, CAMPO, ENTRADA, ETIQUETA, FUERTE, INDICADORES, LISTA,
  PANTALLA, PILL, PRINCIPAL, REJILLA, REJILLA_SOLA, SEC, SUBTITULO, TABLA, TABLA_CAJA, TD, TD_1, TD_NUM, TH, TH_NUM, THEAD, TITULO, TR, TonoPill, VACIO, ZONA
} from '../../../asistencia/ui/clases';
import { MINI, TR_ABRE } from '../../../asistencia/ui/ficha-clases';
import { BOTON_APAGADO, BOTON_SEC } from '../../../asistencia/ui/control-comun';
import { IndicadorComponent } from '../../../asistencia/ui/indicador.component';
import { MedidorTabla } from '../../../asistencia/ui/medidor-tabla';
import { PiePaginaComponent } from '../../../asistencia/ui/pie-pagina.component';
import { SegmentadoComponent } from '../../../asistencia/ui/segmentado.component';
import { MonitoreoEstado, rangosSemana, hoyIso } from './monitoreo-estado';
import { MonitoreoService } from './monitoreo.service';
import { Llamada, Rubrica } from './monitoreo.models';
import { NOMBRE_CLIENTE, pct, pts, rubricaEnFrase } from './monitoreo.calculos';
import { ResultadoFiltroComponent, gruposResultado, oracion, partes, textoResultado } from './resultado-filtro.component';

export { oracion, textoResultado };

const fechaCorta = (f: string): string => `${f.slice(8, 10)}/${f.slice(5, 7)}/${f.slice(0, 4)}`;

export const NOMBRE_RUBRICA: Record<Rubrica, string> = { PDP: 'PDP', CD: 'CD', TIT: 'Titular', TER: 'Tercero' };

/** El estado que ve la supervisora en la píldora de cada llamada. */
export function estadoLlamada(l: Llamada): [string, TonoPill] {
  if (l.falta === 'PENDIENTE') return ['Falta por confirmar', 'ro'];
  if (l.estado === 'REVISADA_AJUSTES') return ['Revisada con ajustes', 'info'];
  if (l.estado === 'REVISADA') return ['Revisada', 'ok'];
  return ['Por revisar', 'am'];
}
const esRevisada = (l: Llamada): boolean => l.estado !== 'POR_REVISAR';

/**
 * Pestaña Monitoreo de Grabaciones Discador: las llamadas evaluadas por el speech en el ámbito y las fechas
 * elegidas, con indicadores que filtran, resultados por rúbrica, asesor y búsqueda. Cada fila abre su
 * revisión; la barra abre el rendimiento del asesor elegido o del equipo.
 */
@Component({
  selector: 'app-monitoreo-lista',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: PANTALLA + ' @container/p5' },
  imports: [LucideAngularModule, TarjetaDirective, BotonDirective, IndicadorComponent, PiePaginaComponent, SegmentadoComponent, ResultadoFiltroComponent],
  template: `
    <div [class]="REJILLA + ' ' + REJILLA_SOLA">
      <section appTarjeta [class]="PRINCIPAL">
        <div class="mb-[.875rem] flex flex-none items-center gap-3 [@media(max-height:700px)]:mb-[.5rem]">
          <button type="button" appBoton="secundario" appBotonAlto="chico" [class]="MINI" (click)="volver()">
            <lucide-angular name="arrow-left" [size]="16" class="flex"></lucide-angular>Seguimiento por día
          </button>
        </div>
        <div class="mb-4 flex flex-none flex-wrap items-center justify-between gap-x-6 gap-y-3 [@media(max-height:700px)]:mb-[.75rem]">
          <div class="min-w-0 flex-none">
            <p role="heading" aria-level="1" [class]="TITULO + ' whitespace-normal!'">Llamadas evaluadas</p>
            <p [class]="SUBTITULO">Puntaje y revisión de cada llamada</p>
          </div>
          <!-- Las fechas son el filtro principal: indicadores, resultado, asesor y tabla se miden en este rango. -->
          <div class="ml-auto flex min-w-0 flex-[0_1_auto] flex-nowrap items-end justify-end gap-x-3 gap-y-2">
            <div [class]="CAMPO + ' flex-[0_0_9.5rem]'">
              <label for="l-desde" [class]="ETIQUETA">Desde</label>
              <input id="l-desde" type="date" [class]="ENTRADA" [value]="e.desde()" [max]="e.hasta()" (change)="cambiarDesde($any($event.target).value)">
            </div>
            <div [class]="CAMPO + ' flex-[0_0_9.5rem]'">
              <label for="l-hasta" [class]="ETIQUETA">Hasta</label>
              <input id="l-hasta" type="date" [class]="ENTRADA" [value]="e.hasta()" [max]="hoy" (change)="cambiarHasta($any($event.target).value)">
            </div>
            <div [class]="CAMPO + ' flex-none'">
              <span [class]="ETIQUETA">Periodo</span>
              <app-segmentado [opciones]="PERIODOS" [valor]="e.periodo()" (cambiar)="elegirPeriodo($any($event))" />
            </div>
          </div>
        </div>

        <div [class]="INDICADORES + ' [@media(max-height:700px)]:mb-4 transition-opacity duration-200 motion-reduce:transition-none'" [class.opacity-60]="cargando()">
          <app-indicador [bajo]="true" [conDetalle]="false" [valor]="porRevisar()" rotulo="Por revisar" [filtra]="true" tono="am" [activo]="e.filtro() === 'revisar'" (elegir)="filtrar('revisar')" />
          <app-indicador [bajo]="true" [conDetalle]="false" [valor]="faltas()" rotulo="Falta por confirmar" [filtra]="true" tono="ro" [activo]="e.filtro() === 'falta'" (elegir)="filtrar('falta')" />
          <app-indicador [bajo]="true" [conDetalle]="false" [valor]="revisadas()" rotulo="Revisadas" [filtra]="true" tono="ok" [activo]="e.filtro() === 'revisadas'" (elegir)="filtrar('revisadas')" />
          @if (puntajesRubrica().length > 1) {
            <!-- Cada rúbrica tiene otros criterios y otros puntos: con llamadas de dos, un puntaje por columna. -->
            <div class="flex min-w-0">
              <div class="flex w-full min-w-0 flex-row rounded-xl border border-border bg-card py-[.75rem] shadow-[0_1px_2px_rgb(15_23_42/.04)] [@media(max-height:700px)]:py-[.5rem]">
                @for (p of puntajesRubrica(); track p.rubrica; let primero = $first) {
                  <div class="flex min-w-0 flex-[1_1_0] flex-col items-center gap-[2px] px-[.5rem] text-center" [class]="primero ? '' : 'border-0 border-l border-solid border-border'" [title]="'Puntaje promedio de ' + p.nombre">
                    <span class="block text-[1.5rem] leading-[1.15] font-bold text-foreground [font-variant-numeric:proportional-nums_lining-nums]">{{ pct(p.valor) }}@if (p.valor != null) {<small class="ml-[.3125rem] text-[.75rem] leading-[1.15] font-medium text-muted-foreground">%</small>}</span>
                    <span class="block max-w-full overflow-hidden text-[.75rem] leading-[1.5] text-ellipsis whitespace-nowrap text-muted-foreground">Puntaje {{ p.nombre }}</span>
                  </div>
                }
              </div>
            </div>
          } @else {
            <app-indicador [bajo]="true" [conDetalle]="false" [valor]="pct(promedio())" [unidad]="promedio() == null ? '' : '%'" rotulo="Puntaje promedio" />
          }
        </div>

        @if (grupos().length) {
          <app-resultado-filtro [grupos]="grupos()" [valor]="e.resultado()" (elegir)="elegirResultado($event)" />
        }

        <div class="mb-[.75rem] flex min-w-0 flex-wrap items-end gap-x-3 gap-y-2">
          <div [class]="CAMPO + ' min-w-0 flex-[0_1_16rem]'">
            <label for="l-ases" [class]="ETIQUETA">Asesor</label>
            <select id="l-ases" [class]="LISTA" (change)="elegirAsesor($any($event.target).value)">
              <option value="" [selected]="!e.asesor()">Todos</option>
              @for (a of asesores(); track a) { <option [value]="a" [selected]="a === e.asesor()">{{ a }}</option> }
            </select>
          </div>
          <div [class]="CAMPO + ' flex-[1_1_9rem]'">
            <label for="l-q" [class]="ETIQUETA">Buscar</label>
            <div [class]="BUSCAR">
              <lucide-angular name="search" [size]="16" [class]="BUSCAR_ICONO"></lucide-angular>
              <input id="l-q" [class]="BUSCAR_CAMPO" [placeholder]="esIbk() ? 'DNI, CJ o nombre' : 'DNI o nombre'" [value]="e.q()" (input)="buscar($any($event.target).value)">
            </div>
          </div>
        </div>

        <div #zona [class]="ZONA">
          @if (!e.idSubcartera()) {
            <div [class]="VACIO">Elige cliente, cartera y subcartera</div>
          } @else if (cargando() && !visibles().length) {
            <div [class]="VACIO">Cargando…</div>
          } @else if (!visibles().length) {
            <div [class]="VACIO">{{ rango().length ? 'Sin llamadas con estos filtros' : 'Sin llamadas evaluadas en estas fechas' }}</div>
          } @else {
            <div class="flex min-h-0 flex-[1_1_auto] flex-col transition-opacity duration-200 motion-reduce:transition-none" [class.opacity-60]="cargando()" [attr.aria-busy]="cargando()">
              <div #caja [class]="TABLA_CAJA">
                <table [class]="TABLA">
                  <thead [class]="THEAD"><tr [class]="TR">
                    <th [class]="TH">Fecha</th><th [class]="TH">Asesor</th><th [class]="TH">Cliente</th><th [class]="TH">Tipificación</th>
                    <th [class]="TH_NUM">Puntaje</th><th [class]="TH">Estado</th><th [class]="TH"></th>
                  </tr></thead>
                  <tbody>
                    @for (l of pagina(); track l.idx) {
                      @let est = estado(l);
                      <tr [class]="TR + ' ' + TR_ABRE" tabindex="0" [attr.aria-current]="e.ultima() === l.idx" (click)="abrir(l)" (keydown.enter)="abrir(l)">
                        <td [class]="celda(l, TD)"><span [class]="FUERTE">{{ fechaCorta(l.fecha) }}</span><span [class]="SEC">{{ l.hora }}</span></td>
                        <td [class]="celda(l, TD)">{{ l.asesor }}</td>
                        <td [class]="celda(l, TD)"><span [class]="NOMBRE_CLIENTE" [title]="l.titular || ''">{{ l.titular || '—' }}</span>@if (docCj(l); as d) {<span [class]="SEC">{{ d }}</span>}</td>
                        <td [class]="celda(l, TD) + ' max-w-[16rem] min-w-[9rem]'">{{ oracion(l.nivel1) }}<span [class]="SEC + ' overflow-hidden text-ellipsis whitespace-nowrap'" [title]="oracion(l.nivel2)">{{ oracion(l.nivel2) }}</span></td>
                        <td [class]="celda(l, TD_NUM)">
                          <span class="text-[.9375rem] font-semibold">{{ pts(l.puntos) }}/{{ pts(l.posibles) }}</span>
                          @if (anula(l)) { <span [class]="SEC + ' text-(--ro)!'">Falta crítica</span> } @else { <span [class]="SEC">{{ pts(nota(l)) }}%</span> }
                        </td>
                        <td [class]="celda(l, TD)"><span [class]="PILL[est[1]]">{{ est[0] }}</span></td>
                        <td [class]="celda(l, TD) + ' w-8 pr-1! text-right!'"><lucide-angular name="chevron-right" [size]="16" class="inline-flex text-muted-foreground"></lucide-angular></td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
              <app-pie-pagina [total]="visibles().length" [pagina]="paginaActual()" [porPagina]="porPagina()" (ir)="e.pagina.set($event)" />
            </div>
          }
        </div>
      </section>
    </div>

    <div appTarjeta [class]="BARRA">
      <span [class]="porRevisar() ? BARRA_ESTADO_HAY : BARRA_ESTADO">{{ estadoBarra() }}</span>
      <button type="button" appBoton="secundario" [class]="'px-4! ' + BOTON_SEC" [disabled]="!e.idSubcartera()" (click)="verRendimiento()">
        <lucide-angular name="gauge" [size]="16" class="flex"></lucide-angular>{{ e.asesor() ? 'Ver rendimiento' : 'Ver rendimiento del equipo' }}
      </button>
      <button type="button" appBoton="secundario" [class]="'px-4! ' + BOTON_SEC" [disabled]="!rango().length" (click)="excel()">
        <lucide-angular name="download" [size]="16" class="flex"></lucide-angular>Descargar Excel
      </button>
    </div>
  `
})
export class MonitoreoListaComponent {
  private readonly servicio = inject(MonitoreoService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);
  protected readonly e = inject(MonitoreoEstado);

  protected readonly TITULO = TITULO; protected readonly SUBTITULO = SUBTITULO; protected readonly MINI = MINI;

  protected readonly REJILLA = REJILLA; protected readonly REJILLA_SOLA = REJILLA_SOLA; protected readonly PRINCIPAL = PRINCIPAL; /** Como el prototipo: la tabla se encoge en pantallas bajas y el pie queda a la vista. */
  protected readonly ZONA = ZONA.replace('pb-6', 'pb-5');
  protected readonly VACIO = VACIO; protected readonly INDICADORES = INDICADORES; protected readonly CAMPO = CAMPO; protected readonly ETIQUETA = ETIQUETA;
  protected readonly ENTRADA = ENTRADA; protected readonly LISTA = LISTA; protected readonly BUSCAR = BUSCAR; protected readonly BUSCAR_ICONO = BUSCAR_ICONO;
  protected readonly BUSCAR_CAMPO = BUSCAR_CAMPO; /** La tabla se desplaza por dentro y su barra va contra el borde de la tarjeta, no pegada al contenido. */
  protected readonly TABLA_CAJA = TABLA_CAJA.replace('flex-[1_0_auto]', 'min-h-0 flex-[1_1_auto]').replace('-mx-1', '-ml-1 -mr-8').replace('px-1', 'pl-1 pr-8'); protected readonly TABLA = TABLA; protected readonly THEAD = THEAD;
  protected readonly TR = TR; protected readonly TH = TH; protected readonly TH_NUM = TH_NUM; protected readonly TD = TD; protected readonly TD_1 = TD_1;
  protected readonly TD_NUM = TD_NUM; protected readonly SEC = SEC; protected readonly FUERTE = FUERTE; protected readonly PILL = PILL; protected readonly TR_ABRE = TR_ABRE;
  protected readonly BARRA = BARRA; protected readonly BARRA_ESTADO = BARRA_ESTADO; protected readonly BARRA_ESTADO_HAY = BARRA_ESTADO_HAY; protected readonly BOTON_SEC = BOTON_SEC + ' ' + BOTON_APAGADO;
  protected readonly oracion = oracion; protected readonly textoResultado = textoResultado; protected readonly fechaCorta = fechaCorta; protected readonly pct = pct; protected readonly pts = pts;
  protected readonly estado = estadoLlamada;
  protected readonly hoy = hoyIso();
  protected readonly PERIODOS = [{ clave: 'anterior', texto: 'Semana anterior' }, { clave: 'semana', texto: 'Esta semana' }];

  protected readonly cargando = computed(() => !!this.e.idSubcartera() && this.e.llave() !== this.llaveActual());
  private readonly llaveActual = computed(() => `${this.e.idSubcartera()}|${this.e.desde()}|${this.e.hasta()}`);

  /** Lo de las fechas y el ámbito, con el resultado y el asesor elegidos: sobre esto van los indicadores. */
  readonly rango = computed(() => this.e.llamadas().filter(l =>
    (!this.e.resultado() || partes(l.nivel2).includes(this.e.resultado())) && (!this.e.asesor() || l.asesor === this.e.asesor())));
  readonly porRevisar = computed(() => this.rango().filter(l => !esRevisada(l)).length);
  readonly faltas = computed(() => this.rango().filter(l => l.falta === 'PENDIENTE').length);
  readonly revisadas = computed(() => this.rango().length - this.porRevisar());
  protected readonly NOMBRE_CLIENTE = NOMBRE_CLIENTE;
  /** El puntaje de cada rúbrica con llamadas en el rango, en el orden del cliente. */
  readonly puntajesRubrica = computed(() => (['TIT', 'TER', 'PDP', 'CD'] as Rubrica[]).flatMap(r => {
    const del = this.rango().filter(l => l.rubrica === r);
    if (!del.length) return [];
    let c = 0, a = 0;
    for (const l of del) { c += l.puntos; a += l.posibles; }
    return [{ rubrica: r, nombre: rubricaEnFrase(r), valor: a ? (c / a) * 100 : null }];
  }));
  readonly promedio = computed(() => {
    let c = 0, a = 0;
    for (const l of this.rango()) { c += l.puntos; a += l.posibles; }
    return a ? (c / a) * 100 : null;
  });

  readonly visibles = computed(() => {
    const q = this.e.q().trim().toLowerCase(), f = this.e.filtro();
    return this.rango().filter(l => {
      if (f === 'revisar' && esRevisada(l)) return false;
      if (f === 'falta' && l.falta !== 'PENDIENTE') return false;
      if (f === 'revisadas' && !esRevisada(l)) return false;
      return !q || [l.asesor, l.titular, l.documento, l.cj].some(x => (x ?? '').toLowerCase().includes(q));
    });
  });

  readonly esIbk = computed(() => this.e.llamadas().some(l => l.cliente === 'IBK'));

  /** Documento del cliente y, en Interbank, sus CJ: debajo del nombre. */
  docCj(l: Llamada): string {
    return [l.documento, l.cj ? `CJ ${l.cj}` : ''].filter(Boolean).join(' · ');
  }

  /** Los resultados por rúbrica, de lo que hay en el ámbito y las fechas. */
  readonly grupos = computed(() => gruposResultado(this.e.llamadas(), this.esIbk(), this.e.resultado()));

  readonly asesores = computed(() => [...new Set(this.e.llamadas().map(l => l.asesor).concat(this.e.asesor() ? [this.e.asesor()] : []))]
    .filter(Boolean).sort((a, b) => a.localeCompare(b)));

  private readonly medidor = new MedidorTabla(() => ({
    zona: this.zona?.nativeElement, caja: this.caja?.nativeElement, total: this.visibles().length, amplia: false,
    clave: `${this.e.filtro()}|${this.e.resultado()}|${this.e.asesor()}|${this.visibles().length}`
  }));
  readonly porPagina = this.medidor.porPagina;
  readonly paginas = computed(() => Math.max(1, Math.ceil(this.visibles().length / this.porPagina())));
  readonly paginaActual = computed(() => Math.min(this.e.pagina(), this.paginas()));
  readonly pagina = computed(() => {
    const n = this.porPagina(), p = this.paginaActual();
    return this.visibles().slice((p - 1) * n, p * n);
  });

  readonly estadoBarra = computed(() => {
    if (!this.rango().length) return 'Sin llamadas en estas fechas';
    const n = this.porRevisar();
    return n ? `${n} ${n === 1 ? 'llamada por revisar' : 'llamadas por revisar'}` : 'Todas las llamadas revisadas';
  });

  @ViewChild('zona') private zona?: ElementRef<HTMLElement>;
  @ViewChild('caja') private caja?: ElementRef<HTMLElement>;
  private pedido = 0;

  constructor() {
    // Se llega desde el seguimiento: sin subcartera elegida (un enlace directo) se vuelve a él.
    if (!this.e.idSubcartera()) { this.volver(); return; }
    effect(() => {
      const sub = this.e.idSubcartera(), desde = this.e.desde(), hasta = this.e.hasta(), llave = this.llaveActual();
      untracked(() => {
        if (!sub || this.e.llave() === llave) return;
        const n = ++this.pedido;
        this.servicio.llamadas(sub, desde, hasta).subscribe({
          next: ll => { if (n !== this.pedido) return; this.e.llamadas.set(ll); this.e.llave.set(llave); },
          error: err => {
            if (n !== this.pedido) return;
            this.e.llamadas.set([]); this.e.llave.set(llave);
            this.toast.error(err?.error?.message || 'No se pudieron cargar las llamadas');
          }
        });
      });
    });
    // La revisión usa la lista a la vista para «anterior» y «siguiente».
    effect(() => { const v = this.visibles(); untracked(() => this.e.visibles.set(v)); });
  }

  protected celda(l: Llamada, base: string): string {
    return this.e.ultima() === l.idx
      ? base + ' bg-[color-mix(in_srgb,var(--muted)_55%,transparent)]! first:rounded-l-[.625rem] last:rounded-r-[.625rem]'
      : base;
  }
  protected anula(l: Llamada): boolean { return l.falta === 'PENDIENTE' || l.falta === 'CONFIRMADA'; }
  protected nota(l: Llamada): number { return l.posibles ? (l.puntos / l.posibles) * 100 : 0; }

  filtrar(f: 'revisar' | 'falta' | 'revisadas'): void { this.e.filtro.set(this.e.filtro() === f ? '' : f); this.e.pagina.set(1); }
  elegirResultado(r: string): void { this.e.resultado.set(this.e.resultado() === r ? '' : r); this.e.pagina.set(1); }
  elegirAsesor(a: string): void { this.e.asesor.set(a); this.e.pagina.set(1); }
  buscar(q: string): void { this.e.q.set(q); this.e.pagina.set(1); }

  cambiarDesde(v: string): void {
    if (!v) return;
    this.e.desde.set(v);
    if (this.e.hasta() < v) this.e.hasta.set(v);
    this.e.pagina.set(1);
  }
  cambiarHasta(v: string): void {
    if (!v) return;
    const h = v > this.hoy ? this.hoy : v;
    this.e.hasta.set(h);
    if (this.e.desde() > h) this.e.desde.set(h);
    this.e.pagina.set(1);
  }
  elegirPeriodo(clave: 'semana' | 'anterior'): void {
    const [d, h] = rangosSemana()[clave];
    this.e.desde.set(d); this.e.hasta.set(h); this.e.pagina.set(1);
  }

  abrir(l: Llamada): void {
    this.e.ultima.set(l.idx);
    this.router.navigate(['/admin/recordings/llamada', l.idx]);
  }
  volver(): void { this.router.navigate(['/admin/recordings'], { queryParams: { tab: 'monitoreo' } }); }
  verRendimiento(): void {
    this.router.navigate(['/admin/recordings/rendimiento'], { queryParams: this.e.asesor() ? { asesor: this.e.asesor() } : {} });
  }
  excel(): void {
    const sub = this.e.idSubcartera();
    if (sub) this.servicio.bajarExcel(sub, this.e.desde(), this.e.hasta(), () => this.toast.error('No se pudo descargar el Excel'));
  }
}
