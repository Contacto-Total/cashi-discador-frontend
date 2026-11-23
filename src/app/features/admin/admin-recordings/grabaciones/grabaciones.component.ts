import { ChangeDetectionStrategy, Component, ElementRef, TemplateRef, ViewChild, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LucideAngularModule } from 'lucide-angular';
import { ToastService } from '../../../../shared/services/toast.service';
import { BotonDirective } from '../../../../shared/ui/boton.directive';
import { TarjetaDirective } from '../../../../shared/ui/tarjeta.directive';
import { AdminRecordingsService, RecordingDTO } from '../../../../core/services/admin-recordings.service';
import { TypificationV2Service } from '../../../../maintenance/services/typification-v2.service';
import { TenantTypificationConfigV2, TypificationCatalogV2 } from '../../../../maintenance/models/typification-v2.model';
import {
  BARRA, BARRA_ESTADO, BARRA_ESTADO_HAY, CAMPO, ENTRADA, ETIQUETA, FUERTE, LISTA, PRINCIPAL, REJILLA, REJILLA_SOLA, SEC, TABLA, TABLA_CAJA,
  TD, TD_1, TD_NUM, TH, TH_NUM, THEAD, TR, VACIO, ZONA
} from '../../../asistencia/ui/clases';
import { BOTON_APAGADO, BOTON_SEC } from '../../../asistencia/ui/control-comun';
import { MINI } from '../../../asistencia/ui/ficha-clases';
import { MedidorTabla } from '../../../asistencia/ui/medidor-tabla';
import { PiePaginaComponent } from '../../../asistencia/ui/pie-pagina.component';
import { MonitoreoEstado, hoyIso } from '../monitoreo/monitoreo-estado';

/** Una gestión con sus llamadas: la fila de la tabla. Las llamadas sin gestión van solas. */
interface Grupo {
  clave: string;
  idGestion: number | null;
  principal: RecordingDTO;
  llamadas: RecordingDTO[];
  total: number;
}
type Orden = 'cliente' | 'telefono' | 'campana' | 'agente' | 'tipificacion' | 'fechaInicio';

const ORIGEN: Record<string, string> = {
  DISCADOR: 'Discador', RELLAMADA_DISCADOR: 'Rellamada (discador)', MANUAL: 'Manual', RELLAMADA_MANUAL: 'Rellamada (manual)', BOT: 'Bot', RECORDATORIO: 'Recordatorio'
};
const ESTADO: Record<string, string> = {
  COMPLETED: 'Finalizada', FINALIZADA: 'Finalizada', CONNECTED: 'Conectada', NO_CONTESTADA: 'No contestada', NO_ANSWER: 'No contestada', BUSY: 'Ocupado', FAILED: 'Fallida'
};
const fecha = (iso: string): string => iso ? `${iso.slice(8, 10)}/${iso.slice(5, 7)}/${iso.slice(0, 4)}` : '—';
const hora = (iso: string): string => iso ? iso.slice(11, 16) : '';
const duracion = (s: number | null | undefined): string => s == null ? '—' : `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

/**
 * Pestaña Grabaciones de Grabaciones del Discador: buscar las grabaciones de la subcartera por fechas,
 * documento, teléfono o tipificación, y descargarlas. Basta un criterio; con fechas, las dos. El asesor
 * filtra al momento lo ya traído. Una gestión con varias llamadas se abre debajo con cada una.
 */
@Component({
  selector: 'app-grabaciones',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  imports: [NgTemplateOutlet, LucideAngularModule, TarjetaDirective, BotonDirective, PiePaginaComponent],
  template: `
    <div [class]="REJILLA + ' ' + REJILLA_SOLA">
      <section appTarjeta [class]="PRINCIPAL">
        <ng-container *ngTemplateOutlet="cabecera()" />

        <div class="mb-4 grid flex-none grid-cols-[repeat(4,minmax(0,1fr))] items-end gap-3 rounded-[.75rem] border border-solid border-[color-mix(in_srgb,var(--verde-txt)_16%,var(--border))] bg-[color-mix(in_srgb,var(--verde-txt)_5%,var(--card))] px-4 pt-[.875rem] pb-4
                    @min-[80rem]/tarjeta:grid-cols-[repeat(2,minmax(9.75rem,.85fr))_repeat(2,minmax(0,.8fr))_repeat(3,minmax(0,1.15fr))_auto] @max-[40.001rem]/tarjeta:grid-cols-[repeat(2,minmax(0,1fr))]">
          <div [class]="CAMPO"><label for="gb-desde" [class]="ETIQUETA">Desde</label>
            <input id="gb-desde" type="date" [class]="ENTRADA + ' min-w-0'" [value]="desde()" [max]="hasta() || hoy" (change)="cambiarDesde($any($event.target).value)"></div>
          <div [class]="CAMPO"><label for="gb-hasta" [class]="ETIQUETA">Hasta</label>
            <input id="gb-hasta" type="date" [class]="ENTRADA + ' min-w-0'" [value]="hasta()" [min]="desde()" [max]="hoy" (change)="cambiarHasta($any($event.target).value)"></div>
          <div [class]="CAMPO"><label for="gb-doc" [class]="ETIQUETA">Documento</label>
            <input id="gb-doc" [class]="ENTRADA" placeholder="Opcional" inputmode="numeric" [value]="documento()" (input)="documento.set($any($event.target).value)" (keydown.enter)="buscar()"></div>
          <div [class]="CAMPO"><label for="gb-tel" [class]="ETIQUETA">Teléfono</label>
            <input id="gb-tel" [class]="ENTRADA" placeholder="Opcional" inputmode="tel" [value]="telefono()" (input)="telefono.set($any($event.target).value)" (keydown.enter)="buscar()"></div>
          <div [class]="CAMPO"><label for="gb-t1" [class]="ETIQUETA">Tipificación nivel 1</label>
            <select id="gb-t1" [class]="LISTA" [disabled]="!nivel1().length" (change)="elegirNivel1($any($event.target).value)">
              <option value="" [selected]="!t1()">Todas</option>
              @for (t of nivel1(); track t) { <option [value]="t" [selected]="t === t1()">{{ t }}</option> }
            </select></div>
          <div [class]="CAMPO"><label for="gb-t2" [class]="ETIQUETA">Tipificación nivel 2</label>
            <select id="gb-t2" [class]="LISTA" [disabled]="!t1()" (change)="t2.set($any($event.target).value)">
              <option value="" [selected]="!t2()">Todas</option>
              @for (t of nivel2(); track t) { <option [value]="t" [selected]="t === t2()">{{ t }}</option> }
            </select></div>
          <div [class]="CAMPO"><label for="gb-ases" [class]="ETIQUETA">Asesor</label>
            <select id="gb-ases" [class]="LISTA" (change)="elegirAsesor($any($event.target).value)">
              <option value="" [selected]="!asesor()">Todos</option>
              @for (a of asesores(); track a) { <option [value]="a" [selected]="a === asesor()">{{ a }}</option> }
            </select></div>
          <div class="flex justify-end gap-2 @max-[40.001rem]/tarjeta:col-[1/-1]">
            <button type="button" appBoton="secundario" [class]="'h-[2.375rem]! px-4! ' + BOTON_SEC" [disabled]="cargando()" (click)="buscar()">
              <lucide-angular name="search" [size]="16" class="flex"></lucide-angular>Buscar
            </button>
            <button type="button" appBoton="secundario" [class]="'h-[2.375rem]! px-4! ' + BOTON_SEC" (click)="limpiar()">
              <lucide-angular name="x" [size]="16" class="flex"></lucide-angular>Limpiar
            </button>
          </div>
        </div>

        <div #zona [class]="ZONA">
          @if (!e.idSubcartera() || !buscado()) {
            <div [class]="VACIO">Ingresa al menos un criterio y pulsa Buscar</div>
          } @else if (cargando() && !visibles().length) {
            <div [class]="VACIO">Buscando…</div>
          } @else if (!visibles().length) {
            <div [class]="VACIO">{{ grupos().length ? 'Sin grabaciones con esta búsqueda' : 'Sin grabaciones con estos criterios' }}</div>
          } @else {
            <div class="flex min-h-0 flex-[1_1_auto] flex-col transition-opacity duration-200 motion-reduce:transition-none" [class.opacity-60]="cargando()" [attr.aria-busy]="cargando()">
              <div #caja [class]="TABLA_CAJA">
                <table [class]="TABLA">
                  <thead [class]="THEAD"><tr [class]="TR">
                    @for (c of COLUMNAS; track c[0]) {
                      <th [class]="TH" [attr.aria-sort]="orden()[0] === c[0] ? (orden()[1] > 0 ? 'ascending' : 'descending') : 'none'">
                        <button type="button" class="inline-flex cursor-pointer items-center gap-1 border-0 bg-transparent p-0 [font-family:inherit] text-inherit hover:text-foreground" (click)="ordenar(c[0])">
                          {{ c[1] }}@if (orden()[0] === c[0]) { <lucide-angular [name]="orden()[1] > 0 ? 'chevron-up' : 'chevron-down'" [size]="14" class="flex"></lucide-angular> }
                        </button>
                      </th>
                    }
                    <th [class]="TH">Gestión</th><th [class]="TH_NUM">Descargas</th>
                  </tr></thead>
                  <tbody>
                    @for (g of pagina(); track g.clave) {
                      @let abierta = abiertos().has(g.clave);
                      @let p = g.principal;
                      <tr [class]="TR">
                        <td [class]="TD"><span [class]="FUERTE">{{ p.cliente || '—' }}</span><span [class]="SEC">{{ p.documento }}</span></td>
                        <td [class]="TD">{{ p.telefono }}</td>
                        <td [class]="TD">{{ p.campana }}</td>
                        <td [class]="TD">{{ p.agente || '—' }}</td>
                        <td [class]="TD + ' max-w-[11.5rem] min-w-[9rem]'">{{ p.tipificacion || '—' }}<span [class]="SEC + ' overflow-hidden text-ellipsis whitespace-nowrap'" [title]="p.tipificacion2 || ''">{{ p.tipificacion2 }}</span></td>
                        <td [class]="TD"><span [class]="FUERTE">{{ fecha(p.fechaInicio) }}</span><span [class]="SEC">{{ hora(p.fechaInicio) }}</span></td>
                        <td [class]="TD">
                          @if (g.total > 1) {
                            <button type="button" appBoton="secundario" appBotonAlto="chico" [class]="MINI" [attr.aria-expanded]="abierta" [title]="'Gestión #' + g.idGestion + ': ver sus llamadas'" (click)="alternar(g)">
                              {{ g.total }} llamadas<lucide-angular [name]="abierta ? 'chevron-up' : 'chevron-down'" [size]="16" class="flex"></lucide-angular>
                            </button>
                          } @else if (g.idGestion) { <span [title]="'Gestión #' + g.idGestion">1 llamada</span> }
                          @else { <span class="text-[.75rem] text-muted-foreground" title="La llamada no quedó enlazada a ninguna gestión">Sin gestión</span> }
                        </td>
                        <td [class]="TD_NUM">
                          <span class="inline-flex min-w-[4.375rem] items-center justify-end gap-[.375rem]">
                            @if (g.total > 1) { <span class="text-[.75rem] text-muted-foreground" title="El audio de cada llamada está en el detalle">{{ g.total }} audios</span> }
                            @else {
                              <button type="button" appBoton="secundario" appBotonAlto="icono" [class]="MINI" aria-label="Descargar audio" title="Descargar audio" [disabled]="bajando() === p.uuidLlamada" (click)="bajarAudio(p)">
                                <lucide-angular name="download" [size]="16" class="flex"></lucide-angular>
                              </button>
                            }
                            @if (p.tieneEvaluacion) {
                              <button type="button" appBoton="secundario" appBotonAlto="icono" [class]="MINI" aria-label="Descargar el reporte de la evaluación" title="Descargar el reporte de la evaluación" [disabled]="bajandoReporte() === p.id" (click)="bajarReporte(p)">
                                <lucide-angular name="file-spreadsheet" [size]="16" class="flex"></lucide-angular>
                              </button>
                            }
                          </span>
                        </td>
                      </tr>
                      @if (abierta) {
                        <tr [class]="TR">
                          <td colspan="8" class="border-0! border-b! border-solid! border-(--line2)! p-0! pb-2!">
                            <ol class="m-0 flex list-none flex-col p-0 pt-1">
                              @for (l of g.llamadas; track l.uuidLlamada; let i = $index; let primero = $first) {
                                <li class="grid grid-cols-[1.5rem_minmax(9rem,1.3fr)_minmax(7rem,1fr)_minmax(9rem,1.4fr)_minmax(6rem,1fr)_3.5rem_auto] items-center gap-3 border-0 border-solid border-(--line2) py-2 pr-[calc(.625rem+1px)] pl-[calc(.625rem+1px)] text-[.8125rem]"
                                    [class.border-t]="!primero">
                                  <span class="font-semibold text-muted-foreground">{{ i + 1 }}</span>
                                  <span><span class="font-semibold">{{ origen(l.origen) }}</span><small class="block text-[.75rem] text-muted-foreground">{{ estado(l.estadoLlamada) }}</small></span>
                                  <span>{{ l.telefono }}</span>
                                  <span>{{ l.agente || '—' }}</span>
                                  <span>{{ fecha(l.fechaInicio) }}<small class="block text-[.75rem] text-muted-foreground">{{ hora(l.fechaInicio) }}</small></span>
                                  <span>{{ duracion(l.duracionSegundos) }}</span>
                                  <button type="button" appBoton="secundario" appBotonAlto="icono" [class]="MINI" aria-label="Descargar audio" title="Descargar audio" [disabled]="bajando() === l.uuidLlamada" (click)="bajarAudio(l)">
                                    <lucide-angular name="download" [size]="16" class="flex"></lucide-angular>
                                  </button>
                                </li>
                              }
                            </ol>
                          </td>
                        </tr>
                      }
                    }
                  </tbody>
                </table>
              </div>
              <app-pie-pagina [total]="visibles().length" [pagina]="paginaActual()" [porPagina]="porPagina()" (ir)="paginaElegida.set($event)" />
            </div>
          }
        </div>
      </section>
    </div>

    <div appTarjeta [class]="BARRA">
      <span [class]="grupos().length ? BARRA_ESTADO_HAY : BARRA_ESTADO">{{ estadoBarra() }}</span>
      <button type="button" appBoton="secundario" [class]="'px-4! ' + BOTON_SEC" [disabled]="!grupos().length || bajandoTodo()" (click)="bajarTodo()">
        <lucide-angular name="download" [size]="16" class="flex"></lucide-angular>Descargar todo
      </button>
    </div>
  `
})
export class GrabacionesComponent {
  private readonly servicio = inject(AdminRecordingsService);
  private readonly tipificaciones = inject(TypificationV2Service);
  private readonly toast = inject(ToastService);
  protected readonly e = inject(MonitoreoEstado);

  readonly cabecera = input.required<TemplateRef<unknown>>();

  protected readonly REJILLA = REJILLA; protected readonly REJILLA_SOLA = REJILLA_SOLA; protected readonly PRINCIPAL = PRINCIPAL; /** Como el prototipo: la tabla se encoge en pantallas bajas y el pie queda a la vista. */
  protected readonly ZONA = ZONA.replace('pb-6', 'pb-5');
  protected readonly VACIO = VACIO; protected readonly CAMPO = CAMPO; protected readonly ETIQUETA = ETIQUETA; protected readonly ENTRADA = ENTRADA; protected readonly LISTA = LISTA;
  /** La tabla se desplaza por dentro y su barra va contra el borde de la tarjeta, no pegada al contenido. */
  protected readonly TABLA_CAJA = TABLA_CAJA.replace('flex-[1_0_auto]', 'min-h-0 flex-[1_1_auto]').replace('-mx-1', '-ml-1 -mr-8').replace('px-1', 'pl-1 pr-8'); protected readonly TABLA = TABLA; protected readonly THEAD = THEAD; protected readonly TR = TR; protected readonly TH = TH;
  protected readonly TH_NUM = TH_NUM; /** Filas más altas que en el resto del molde: cada una lleva dos líneas (cliente y documento, tipificación, fecha y hora). */
  protected readonly TD = TD.replace('py-[.5625rem]!', 'py-[.875rem]!'); protected readonly TD_1 = TD_1; protected readonly TD_NUM = TD_NUM.replace('py-[.5625rem]!', 'py-[.875rem]!'); protected readonly SEC = SEC;
  protected readonly FUERTE = FUERTE; protected readonly BARRA = BARRA; protected readonly BARRA_ESTADO = BARRA_ESTADO; protected readonly BARRA_ESTADO_HAY = BARRA_ESTADO_HAY;
  protected readonly BOTON_SEC = BOTON_SEC + ' ' + BOTON_APAGADO; protected readonly MINI = MINI;
  protected readonly fecha = fecha; protected readonly hora = hora; protected readonly duracion = duracion; protected readonly hoy = hoyIso();
  protected readonly COLUMNAS: [Orden, string][] = [['cliente', 'Cliente'], ['telefono', 'Teléfono'], ['campana', 'Campaña'], ['agente', 'Asesor'], ['tipificacion', 'Tipificación'], ['fechaInicio', 'Fecha']];

  readonly desde = signal(''); readonly hasta = signal(''); readonly documento = signal(''); readonly telefono = signal('');
  readonly t1 = signal(''); readonly t2 = signal(''); readonly asesor = signal('');
  readonly grabaciones = signal<RecordingDTO[]>([]);
  readonly buscado = signal(false);
  readonly cargando = signal(false);
  readonly orden = signal<[Orden, number]>(['fechaInicio', -1]);
  readonly abiertos = signal(new Set<string>());
  readonly paginaElegida = signal(1);
  readonly bajando = signal(''); readonly bajandoReporte = signal<number | null>(null); readonly bajandoTodo = signal(false);
  private readonly configs = signal<TenantTypificationConfigV2[]>([]);
  private readonly porGestion = new Map<number, RecordingDTO[]>();

  /** El nombre con que el CRM muestra una tipificación: el efectivo, el personalizado o el del catálogo. */
  private nombre = (c: TenantTypificationConfigV2): string => c.nombreEfectivo || c.nombrePersonalizado || c.tipificacion.nombre;
  readonly nivel1 = computed(() => [...new Set(this.configs().filter(c => c.tipificacion.nivelJerarquia === 1).map(this.nombre))]);
  readonly nivel2 = computed(() => {
    const padre = this.configs().find(c => c.tipificacion.nivelJerarquia === 1 && this.nombre(c) === this.t1());
    if (!padre) return [];
    return [...new Set(this.configs().filter(c => c.tipificacion.nivelJerarquia === 2
      && (c.tipificacion.parentTypificationId ?? c.tipificacion.tipificacionPadre?.id) === padre.tipificacion.id).map(this.nombre))];
  });

  /** Se agrupa por gestión: la gestión aparece si alguna de sus llamadas calza con el asesor elegido. */
  readonly grupos = computed((): Grupo[] => {
    const mapa = new Map<string, Grupo>();
    for (const l of this.grabaciones()) {
      const clave = l.idGestion ? `g${l.idGestion}` : `u${l.uuidLlamada}`;
      const g = mapa.get(clave);
      if (g) g.llamadas.push(l);
      else mapa.set(clave, { clave, idGestion: l.idGestion ?? null, principal: l, llamadas: [l], total: l.llamadasGestion ?? 1 });
    }
    for (const g of mapa.values()) {
      g.llamadas.sort((a, b) => (a.fechaInicio || '').localeCompare(b.fechaInicio || ''));
      g.principal = g.llamadas[0];
      g.total = Math.max(g.total, g.llamadas.length);
    }
    return [...mapa.values()];
  });
  readonly asesores = computed(() => [...new Set(this.grabaciones().map(l => l.agente).filter(Boolean).concat(this.asesor() ? [this.asesor()] : []))]
    .sort((a, b) => a.localeCompare(b)));
  readonly visibles = computed(() => {
    const [k, d] = this.orden(), a = this.asesor();
    return this.grupos().filter(g => !a || g.llamadas.some(l => l.agente === a))
      .sort((x, y) => String((x.principal as unknown as Record<string, unknown>)[k] ?? '').localeCompare(String((y.principal as unknown as Record<string, unknown>)[k] ?? '')) * d);
  });
  readonly estadoBarra = computed(() => {
    if (!this.buscado()) return 'Sin búsqueda';
    const n = this.grupos().length, v = this.visibles().length;
    const t = `${n} ${n === 1 ? 'grabación' : 'grabaciones'}`;
    return v === n ? t : `${v} de ${t}`;
  });

  private readonly medidor = new MedidorTabla(() => ({
    zona: this.zona?.nativeElement, caja: this.abiertos().size ? undefined : this.caja?.nativeElement, total: this.visibles().length, amplia: false,
    clave: `${this.asesor()}|${this.orden().join()}|${this.visibles().length}`
  }));
  readonly porPagina = this.medidor.porPagina;
  readonly paginaActual = computed(() => Math.min(this.paginaElegida(), Math.max(1, Math.ceil(this.visibles().length / this.porPagina()))));
  readonly pagina = computed(() => { const n = this.porPagina(), p = this.paginaActual(); return this.visibles().slice((p - 1) * n, p * n); });

  @ViewChild('zona') private zona?: ElementRef<HTMLElement>;
  @ViewChild('caja') private caja?: ElementRef<HTMLElement>;

  constructor() {
    // Al cambiar el ámbito cambia el catálogo y la búsqueda se vuelve a pedir, como hasta ahora.
    effect(() => {
      const cli = this.e.idCliente(), car = this.e.idCartera(), sub = this.e.idSubcartera();
      untracked(() => { this.limpiar(); this.cargarCatalogo(cli, car, sub); });
    });
  }

  private cargarCatalogo(cli: number | null, car: number | null, sub: number | null): void {
    this.configs.set([]);
    if (!cli || !car) return;
    const configs$ = this.tipificaciones.getTenantClassifications(cli, car, false, sub ?? undefined);
    const efectivas$ = sub ? this.tipificaciones.getEffectiveTypifications(cli, car, sub).pipe(catchError(() => of([] as TypificationCatalogV2[]))) : of([] as TypificationCatalogV2[]);
    forkJoin({ configs: configs$, efectivas: efectivas$ }).subscribe({
      next: ({ configs, efectivas }) => {
        const padres = new Map(efectivas.map(t => [t.id, t.parentTypificationId ?? t.tipificacionPadre?.id]));
        configs.forEach(c => { if (padres.has(c.tipificacion.id)) c.tipificacion.parentTypificationId = padres.get(c.tipificacion.id); });
        this.configs.set(configs.filter(c => c.estaHabilitada && c.tipificacion.estaActiva));
      },
      error: () => this.toast.error('No se pudieron cargar las tipificaciones')
    });
  }

  elegirNivel1(v: string): void { this.t1.set(v); this.t2.set(''); }
  elegirAsesor(a: string): void { this.asesor.set(a); this.paginaElegida.set(1); }
  cambiarDesde(v: string): void { this.desde.set(v); if (v && this.hasta() && this.hasta() < v) this.hasta.set(v); }
  cambiarHasta(v: string): void { const h = v && v > this.hoy ? this.hoy : v; this.hasta.set(h); if (h && this.desde() > h) this.desde.set(h); }
  ordenar(k: Orden): void {
    const [actual, d] = this.orden();
    this.orden.set(actual === k ? [k, -d] : [k, k === 'fechaInicio' ? -1 : 1]);
  }
  alternar(g: Grupo): void {
    const s = new Set(this.abiertos());
    if (s.has(g.clave)) { s.delete(g.clave); this.abiertos.set(s); return; }
    s.add(g.clave); this.abiertos.set(s);
    if (g.idGestion && g.total > g.llamadas.length) this.completar(g.idGestion, g.principal.documento);
  }

  /** Trae las llamadas de la gestión que la búsqueda dejó fuera; se pide al abrir, una sola vez. */
  private completar(idGestion: number, documento: string): void {
    const sumar = (todas: RecordingDTO[]): void => {
      const presentes = new Set(this.grabaciones().map(l => l.uuidLlamada));
      const faltan = todas.filter(l => !presentes.has(l.uuidLlamada)).map(l => ({ ...l, documento: l.documento || documento, idGestion }));
      if (faltan.length) this.grabaciones.update(ls => [...ls, ...faltan]);
    };
    const cache = this.porGestion.get(idGestion);
    if (cache) { sumar(cache); return; }
    this.servicio.getLlamadasDeGestion(idGestion).subscribe({
      next: ls => { this.porGestion.set(idGestion, ls); sumar(ls); },
      error: () => this.toast.error('No se pudieron cargar las llamadas de la gestión')
    });
  }

  /** Basta un criterio: fechas, documento, teléfono o tipificación; con fechas, las dos. */
  buscar(): void {
    const cli = this.e.idCliente(), car = this.e.idCartera(), sub = this.e.idSubcartera();
    if (!cli || !car || !sub) { this.toast.error('Elige cliente, cartera y subcartera'); return; }
    const doc = this.documento().trim(), tel = this.telefono().trim(), hayFecha = !!(this.desde() || this.hasta());
    if (!hayFecha && !doc && !tel && !this.t1()) { this.toast.error('Ingresa al menos un criterio: fechas, documento, teléfono o tipificación'); return; }
    if (hayFecha && !(this.desde() && this.hasta())) { this.toast.error('Para buscar por fechas indica ambas: Desde y Hasta'); return; }
    this.cargando.set(true); this.buscado.set(true); this.abiertos.set(new Set()); this.porGestion.clear(); this.paginaElegida.set(1);
    this.servicio.search(cli, car, sub, {
      fechaDesde: this.desde() || undefined, fechaHasta: this.hasta() || undefined, documento: doc || undefined, telefono: tel || undefined,
      rutaNivel1: this.t1() || undefined, rutaNivel2: this.t2() || undefined
    }).subscribe({
      next: ls => { this.grabaciones.set(ls); this.cargando.set(false); },
      error: err => { this.grabaciones.set([]); this.cargando.set(false); this.toast.error(err?.error?.message || 'No se pudieron cargar las grabaciones'); }
    });
  }

  limpiar(): void {
    this.desde.set(''); this.hasta.set(''); this.documento.set(''); this.telefono.set(''); this.t1.set(''); this.t2.set(''); this.asesor.set('');
    this.grabaciones.set([]); this.buscado.set(false); this.abiertos.set(new Set()); this.paginaElegida.set(1);
  }

  protected origen(o: string | null | undefined): string { return o ? ORIGEN[o] ?? o : '—'; }
  protected estado(s: string | null | undefined): string { return s ? ESTADO[s.toUpperCase()] ?? s.charAt(0) + s.slice(1).toLowerCase() : ''; }

  private guardarArchivo(blob: Blob, nombre: string): void {
    const url = URL.createObjectURL(blob), a = document.createElement('a');
    a.href = url; a.download = nombre; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  }
  bajarAudio(l: RecordingDTO): void {
    this.bajando.set(l.uuidLlamada);
    this.servicio.downloadAudio(l.uuidLlamada).subscribe({
      next: b => { this.bajando.set(''); this.guardarArchivo(b, `audio-${l.documento}-${(l.fechaInicio || '').slice(0, 10)}-${l.agente || 'sin-agente'}.wav`); },
      error: () => { this.bajando.set(''); this.toast.error('No se encontró el archivo de audio de esta grabación'); }
    });
  }
  bajarReporte(l: RecordingDTO): void {
    this.bajandoReporte.set(l.id);
    this.servicio.downloadReporte(l.id).subscribe({
      next: b => { this.bajandoReporte.set(null); this.guardarArchivo(b, `evaluacion-${l.documento}-${(l.fechaInicio || '').slice(0, 10)}-${l.agente || 'sin-agente'}.xlsx`); },
      error: () => { this.bajandoReporte.set(null); this.toast.error('Evaluación de calidad no disponible'); }
    });
  }
  bajarTodo(): void {
    const uuids = this.visibles().flatMap(g => g.llamadas.map(l => l.uuidLlamada)).filter(Boolean);
    if (!uuids.length) return;
    this.bajandoTodo.set(true);
    this.servicio.downloadAudiosZip(uuids).subscribe({
      next: b => { this.bajandoTodo.set(false); this.guardarArchivo(b, 'grabaciones.zip'); },
      error: () => { this.bajandoTodo.set(false); this.toast.error('No se pudo descargar los audios'); }
    });
  }
}
