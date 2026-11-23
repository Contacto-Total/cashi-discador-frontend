import { ChangeDetectionStrategy, Component, ElementRef, TemplateRef, ViewChild, computed, effect, inject, input, untracked } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { ToastService } from '../../../../shared/services/toast.service';
import { BotonDirective } from '../../../../shared/ui/boton.directive';
import { TarjetaDirective } from '../../../../shared/ui/tarjeta.directive';
import {
  BARRA, BARRA_ESTADO, BARRA_ESTADO_HAY, BUSCAR, BUSCAR_CAMPO, BUSCAR_ICONO, CAMPO, ENTRADA, ETIQUETA, FUERTE, INDICADORES, LISTA,
  PILL, PRINCIPAL, REJILLA, REJILLA_SOLA, SEC, TABLA, TABLA_CAJA, TD, TD_1, TD_NUM, TH, TH_NUM, THEAD, TR, TonoPill, VACIO, ZONA
} from '../../../asistencia/ui/clases';
import { TR_ABRE } from '../../../asistencia/ui/ficha-clases';
import { BOTON_APAGADO, BOTON_SEC } from '../../../asistencia/ui/control-comun';
import { IndicadorComponent } from '../../../asistencia/ui/indicador.component';
import { MedidorTabla } from '../../../asistencia/ui/medidor-tabla';
import { PiePaginaComponent } from '../../../asistencia/ui/pie-pagina.component';
import { SegmentadoComponent } from '../../../asistencia/ui/segmentado.component';
import { MonitoreoEstado, rangosSemana, hoyIso } from './monitoreo-estado';
import { MonitoreoService } from './monitoreo.service';
import { Llamada, Rubrica } from './monitoreo.models';
import { pct, pts } from './monitoreo.calculos';

/** «PROMESA DE PAGO» → «Promesa de pago». */
export const oracion = (t: string | null | undefined): string => {
  const s = (t ?? '').trim().toLowerCase();
  return s.charAt(0).toUpperCase() + s.slice(1);
};
const fechaCorta = (f: string): string => `${f.slice(8, 10)}/${f.slice(5, 7)}/${f.slice(0, 4)}`;

export const NOMBRE_RUBRICA: Record<Rubrica, string> = { PDP: 'PDP', CD: 'CD', TIT: 'Titular', TER: 'Tercero' };
/** Rótulo del grupo de resultados: la rúbrica en FOH; en Interbank, el tipo de contacto (efectivo o tercero relacionado). */
const GRUPO_RESULTADO: Record<Rubrica, string> = { PDP: 'PDP', CD: 'CD', TIT: 'CE', TER: 'TR' };
/** Orden de los resultados que evalúa el speech; los que no estén aquí van al final. */
const ORDEN_RESULTADO = ['PROMESA DE PAGO', 'REFINANCIAMIENTO', 'OPORTUNIDAD DE PAGO', 'CONTACTO CON TITULAR O ENCARGADO', 'CON INTENCIÓN',
  'SIN INTENCION', 'SIN INTENCIÓN', 'TITULAR PAGARÁ CON FRACCIONAMIENTO - CON DESCUENTO', 'TITULAR PAGARÁ CON FRACCIONAMIENTO - SIN DESCUENTO',
  'TERCERO INFORMARÁ A TITULAR', 'TERCERO CONOCE AL TITULAR - BRINDA NUEVOS DATOS'];
/** Texto corto de un resultado largo de Interbank. */
const CORTO: Record<string, string> = {
  'TITULAR PAGARÁ CON FRACCIONAMIENTO - CON DESCUENTO': 'Fraccionamiento con descuento',
  'TITULAR PAGARÁ CON FRACCIONAMIENTO - SIN DESCUENTO': 'Fraccionamiento sin descuento'
};
export const textoResultado = (r: string): string => CORTO[r.toUpperCase()] ?? oracion(r);
/** Los resultados que evalúa el speech de Interbank (clientes/ibk/seleccion.py): se ofrecen siempre, haya o no llamadas. */
const CATALOGO_IBK: [Rubrica, string[]][] = [
  ['TIT', ['PROMESA DE PAGO', 'TITULAR PAGARÁ CON FRACCIONAMIENTO - CON DESCUENTO', 'TITULAR PAGARÁ CON FRACCIONAMIENTO - SIN DESCUENTO']],
  ['TER', ['TERCERO INFORMARÁ A TITULAR', 'TERCERO CONOCE AL TITULAR - BRINDA NUEVOS DATOS']]
];
/** Una gestión multiproducto trae varios resultados unidos por « / ». */
const partes = (nivel2: string | null): string[] => (nivel2 ?? '').split(' / ').map(x => x.trim().toUpperCase()).filter(Boolean);

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
  host: { class: 'contents' },
  imports: [NgTemplateOutlet, LucideAngularModule, TarjetaDirective, BotonDirective, IndicadorComponent, PiePaginaComponent, SegmentadoComponent],
  template: `
    <div [class]="REJILLA + ' ' + REJILLA_SOLA">
      <section appTarjeta [class]="PRINCIPAL">
        <ng-container *ngTemplateOutlet="cabecera()" />

        <div [class]="INDICADORES + ' [@media(max-height:700px)]:mb-4 transition-opacity duration-200 motion-reduce:transition-none'" [class.opacity-60]="cargando()">
          <app-indicador [bajo]="true" [conDetalle]="false" [valor]="porRevisar()" rotulo="Por revisar" [filtra]="true" tono="am" [activo]="e.filtro() === 'revisar'" (elegir)="filtrar('revisar')" />
          <app-indicador [bajo]="true" [conDetalle]="false" [valor]="faltas()" rotulo="Falta por confirmar" [filtra]="true" tono="ro" [activo]="e.filtro() === 'falta'" (elegir)="filtrar('falta')" />
          <app-indicador [bajo]="true" [conDetalle]="false" [valor]="revisadas()" rotulo="Revisadas" [filtra]="true" tono="ok" [activo]="e.filtro() === 'revisadas'" (elegir)="filtrar('revisadas')" />
          <app-indicador [bajo]="true" [conDetalle]="false" [valor]="pct(promedio())" [unidad]="promedio() == null ? '' : '%'" rotulo="Puntaje promedio" />
        </div>

        @if (grupos().length) {
          <div [class]="CAMPO + ' mb-[.875rem]'">
            <span [class]="ETIQUETA">Resultado</span>
            <div class="flex flex-wrap items-center gap-x-3 gap-y-2">
              @for (g of grupos(); track g.rubrica) {
                <div class="inline-flex min-h-[2.375rem] flex-wrap items-center gap-1 rounded-[.625rem] bg-muted p-[.1875rem]">
                  <span class="pr-2 pl-[.4375rem] text-[.75rem] font-semibold text-muted-foreground">{{ g.nombre }}</span>
                  @for (r of g.resultados; track r) {
                    <button type="button" [class]="CHIP" [attr.aria-pressed]="e.resultado() === r" (click)="elegirResultado(r)">{{ textoResultado(r) }}</button>
                  }
                </div>
              }
            </div>
          </div>
        }

        <div class="mb-[.75rem] flex min-w-0 flex-wrap items-end gap-x-3 gap-y-2">
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
          <div [class]="CAMPO + ' min-w-[9rem] flex-[1.7_1_13rem]'">
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
              <input id="l-q" [class]="BUSCAR_CAMPO" placeholder="Asesor o cliente" [value]="e.q()" (input)="buscar($any($event.target).value)">
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
                        <td [class]="celda(l, TD)">{{ l.titular || '—' }}</td>
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

  readonly cabecera = input.required<TemplateRef<unknown>>();

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
  /** Chip de resultado: blanco sobre la cápsula gris; elegido, en verde. */
  protected readonly CHIP = 'h-8 cursor-pointer rounded-[.4375rem] border border-solid border-transparent bg-card px-[.875rem] [font-family:inherit] text-[.8125rem] font-medium text-(--ink2) '
    + 'shadow-[0_1px_2px_rgb(0_0_0/.05)] transition-[background-color,border-color,color] duration-150 '
    + 'hover:border-[color-mix(in_oklab,var(--verde-txt)_30%,var(--border))] hover:bg-[color-mix(in_oklab,var(--verde-txt)_6%,var(--card))] hover:text-foreground '
    + 'aria-pressed:border-(--verde-txt)! aria-pressed:bg-(--ok-bg)! aria-pressed:font-semibold aria-pressed:text-(--verde-txt)!';

  protected readonly cargando = computed(() => !!this.e.idSubcartera() && this.e.llave() !== this.llaveActual());
  private readonly llaveActual = computed(() => `${this.e.idSubcartera()}|${this.e.desde()}|${this.e.hasta()}`);

  /** Lo de las fechas y el ámbito, con el resultado y el asesor elegidos: sobre esto van los indicadores. */
  readonly rango = computed(() => this.e.llamadas().filter(l =>
    (!this.e.resultado() || partes(l.nivel2).includes(this.e.resultado())) && (!this.e.asesor() || l.asesor === this.e.asesor())));
  readonly porRevisar = computed(() => this.rango().filter(l => !esRevisada(l)).length);
  readonly faltas = computed(() => this.rango().filter(l => l.falta === 'PENDIENTE').length);
  readonly revisadas = computed(() => this.rango().length - this.porRevisar());
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
      return !q || l.asesor.toLowerCase().includes(q) || (l.titular ?? '').toLowerCase().includes(q);
    });
  });

  /** Los resultados por rúbrica, de lo que hay en el ámbito y las fechas. */
  readonly grupos = computed(() => {
    const por = new Map<Rubrica, Set<string>>();
    if (this.e.llamadas().some(l => l.cliente === 'IBK')) CATALOGO_IBK.forEach(([r, rs]) => por.set(r, new Set(rs)));
    for (const l of this.e.llamadas()) {
      if (!por.has(l.rubrica)) por.set(l.rubrica, new Set());
      partes(l.nivel2).forEach(x => por.get(l.rubrica)!.add(x));
    }
    const lugar = (x: string): number => { const i = ORDEN_RESULTADO.indexOf(x); return i < 0 ? 99 : i; };
    const orden: Rubrica[] = ['PDP', 'CD', 'TIT', 'TER'];
    return orden.filter(r => por.get(r)?.size).map(r => ({ rubrica: r, nombre: GRUPO_RESULTADO[r],
      resultados: [...por.get(r)!].sort((a, b) => lugar(a) - lugar(b) || a.localeCompare(b)) }));
  });

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
  verRendimiento(): void {
    this.router.navigate(['/admin/recordings/rendimiento'], { queryParams: this.e.asesor() ? { asesor: this.e.asesor() } : {} });
  }
  excel(): void {
    const sub = this.e.idSubcartera();
    if (sub) this.servicio.bajarExcel(sub, this.e.desde(), this.e.hasta(), () => this.toast.error('No se pudo descargar el Excel'));
  }
}
