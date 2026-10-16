import { ChangeDetectionStrategy, Component, ElementRef, HostListener, Injector, OnInit, afterNextRender, computed, inject, signal, viewChild } from '@angular/core';
import { NgClass } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { catchError, firstValueFrom, forkJoin, map, of, switchMap } from 'rxjs';
import { TypificationService } from '../../services/typification.service';
import { PortfolioService } from '../../services/portfolio.service';
import { FirstInstallmentConfigService } from '../../services/first-installment-config.service';
import { ManagementService, ConfiguracionCabecera } from '../../../collection-management/services/management.service';
import { ToastService } from '../../../shared/services/toast.service';
import { BotonDirective } from '../../../shared/ui/boton.directive';
import { PageHeaderComponent } from '../../../shared/ui/page-header.component';
import { EtiquetaSubcartera, PanelSubcarterasComponent, SubcarteraPanel } from '../../../shared/ui/panel-subcarteras.component';
import { TarjetaDirective } from '../../../shared/ui/tarjeta.directive';
import { NombrePropioPipe } from '../../../shared/ui/nombre-propio.pipe';
import { OpcionCombobox } from '../../../shared/ui/combobox.component';

type Panel = 'cli' | 'mon';

/** Una subcartera con su cliente y su cartera. */
interface Ambito {
  cliente: string;
  cartera: string;
  subId: number;
  subcartera: string;
}

/** Lo que muestra la ficha de una subcartera: columnas de cada panel en orden, formatos y etiquetas cambiadas. */
interface Config {
  cli: number[];
  mon: { id: number; formato: string }[];
  etiquetas: Record<number, string>;
  diasPrimeraCuota: number | null;
}

const FORMATOS = [
  { valor: 'MONEDA', texto: 'Moneda (S/)' },
  { valor: 'NUMERO', texto: 'Número' },
  { valor: 'PORCENTAJE', texto: 'Porcentaje' },
  { valor: 'TEXTO', texto: 'Texto' }
];
const TIPOS: Record<string, { texto: string; icono: string }> = {
  TEXTO: { texto: 'Texto', icono: 'type' },
  NUMERICO: { texto: 'Número', icono: 'hash' },
  FECHA: { texto: 'Fecha', icono: 'calendar' },
  BOOLEANO: { texto: 'Sí / no', icono: 'toggle-left' }
};
const DIAS_PRIMERA_CUOTA = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
/** Bloques fijos del panel del cliente, en el orden de la ficha; las columnas elegidas salen debajo. */
const FIJOS = ['DNI/Documento', 'Nombre completo', 'Edad', 'Métodos de contacto'];
/** Opciones por página en la fila nueva, como el selector compartido. */
const POR_PAGINA = 5;
const normalizar = (s: string | undefined) => (s ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

/**
 * Ficha del cliente: por subcartera, qué columnas de la carga inicial ve el asesor en el panel del cliente
 * (izquierdo) y en el de montos (derecho), en qué orden, con qué etiqueta y, en montos, con qué formato.
 * También el máximo de días para la primera cuota de la promesa.
 *
 * Sin columnas en el panel del cliente, la ficha muestra sus datos de siempre. Los bloques con estilo propio
 * (edad, ocupación y métodos de contacto) siguen debajo. Nada se envía hasta «Guardar cambios».
 */
@Component({
  selector: 'app-amount-display-config',
  standalone: true,
  imports: [NgClass, LucideAngularModule, PageHeaderComponent, PanelSubcarterasComponent, TarjetaDirective, BotonDirective, NombrePropioPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './amount-display-config.component.html',
  host: { class: 'cashi-pantalla @container/fic flex min-h-0 flex-1 flex-col gap-3' }
})
export class AmountDisplayConfigComponent implements OnInit {
  private readonly clientesApi = inject(TypificationService);
  private readonly carterasApi = inject(PortfolioService);
  private readonly cabecerasApi = inject(ManagementService);
  private readonly primeraCuotaApi = inject(FirstInstallmentConfigService);
  private readonly avisos = inject(ToastService);

  readonly FORMATOS = FORMATOS;
  readonly DIAS_PRIMERA_CUOTA = DIAS_PRIMERA_CUOTA;
  readonly FIJOS = FIJOS;

  /** Columnas de la cabecera y de cada fila: orden, columna, etiqueta, formato (montos) y quitar. */
  readonly REJILLA = 'grid grid-cols-[4.5rem_minmax(0,1fr)_1.75rem] items-center gap-x-[clamp(.5rem,2cqw,1.25rem)] px-2 '
    + '@min-[44rem]/tabla:grid-cols-[4.5rem_minmax(0,1fr)_minmax(0,15rem)_1.75rem]';
  readonly REJILLA_MON = 'grid grid-cols-[4.5rem_minmax(0,1fr)_7.5rem_1.75rem] items-center gap-x-[clamp(.5rem,2cqw,1.25rem)] px-2 '
    + '@min-[44rem]/tabla:grid-cols-[4.5rem_minmax(0,1fr)_minmax(0,15rem)_9rem_1.75rem]';
  readonly LISTA = 'font-cashi m-0! h-auto! w-full rounded-[.625rem]! border! border-(--campo-ln)! bg-(--campo)! px-2.5! py-2! text-[.875rem]! leading-[1.5]! text-ellipsis text-foreground! outline-none '
    + 'focus:border-ring! focus:shadow-[0_0_0_3px_rgb(16_185_129/.3)]';
  readonly LISTA_FILA = 'font-cashi m-0! h-auto! w-full min-w-0 rounded-lg! border! border-(--campo-ln)! bg-(--campo)! px-2! py-[.3125rem]! text-[.875rem]! leading-[1.5]! text-ellipsis text-foreground! outline-none '
    + 'focus:border-ring! focus:shadow-[0_0_0_3px_rgb(16_185_129/.3)]';
  /** El tema antiguo fija con !important el aspecto de los campos: de ahí los `!`. */
  readonly CAMPO_FILA = 'font-cashi m-0! w-full min-w-0 rounded-lg! border! border-(--campo-ln)! bg-(--campo)! px-2! py-[.3125rem]! text-[.875rem]! leading-[1.5]! text-foreground! outline-none '
    + 'placeholder:text-muted-foreground focus:border-ring! focus:shadow-[0_0_0_3px_rgb(16_185_129/.3)]';
  readonly ETIQUETA = 'm-0! text-[.75rem]! leading-[1.5]! font-medium! text-foreground/80!';
  readonly ICONO = 'grid size-6 flex-none cursor-pointer place-items-center rounded-md border-0! bg-transparent p-0! text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground '
    + 'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent';
  readonly QUITAR = 'grid size-7 flex-none cursor-pointer place-items-center rounded-lg border-0! bg-transparent p-0! text-muted-foreground transition-colors duration-150 hover:bg-(--ro-bg) hover:text-(--ro) '
    + 'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring';
  readonly PESTANA = 'font-cashi cursor-pointer rounded-md border-0 px-1.5 py-[.4375rem] text-[.875rem] font-medium transition-colors duration-150';
  readonly PESTANA_ACTIVA = 'bg-(--seg-activo) text-foreground shadow-[0_1px_2px_rgb(0_0_0/.08)]';
  readonly PESTANA_REPOSO = 'bg-transparent text-foreground/60';

  readonly cargando = signal(true);
  readonly error = signal<string | null>(null);
  readonly guardando = signal(false);
  readonly ambito = signal<Ambito[]>([]);
  readonly sub = signal<number | null>(null);
  readonly panel = signal<Panel>('cli');
  /** Cambia cuando hay que volver a crear los campos de texto: solo toman el valor al nacer. */
  readonly version = signal(0);
  /** Cabeceras de la carga inicial de cada subcartera, como llegaron; null si no se pudieron leer. */
  private readonly cabeceras = signal<Record<number, ConfiguracionCabecera[] | null>>({});
  private readonly diasBase = signal<Record<number, number | null>>({});
  /** Lo editado sin guardar, por subcartera. Lo que no está, no cambió. */
  private readonly trabajo = signal<Record<number, Config>>({});
  /** Fila nueva al pie de la tabla: lo escrito, la página de opciones y la opción con el foco. */
  readonly agregando = signal(false);
  readonly consulta = signal('');
  readonly paginaAgregar = signal(0);
  readonly focoAgregar = signal(0);
  private readonly injector = inject(Injector);
  private readonly zonaAgregar = viewChild<ElementRef<HTMLElement>>('zonaAgregar');
  private readonly busquedaAgregar = viewChild<ElementRef<HTMLInputElement>>('busquedaAgregar');
  private readonly botonAgregar = viewChild<ElementRef<HTMLButtonElement>>('botonAgregar');
  private readonly desplazable = viewChild<ElementRef<HTMLElement>>('desplazable');

  readonly actual = computed(() => this.ambito().find(a => a.subId === this.sub()) ?? null);
  readonly clientes = computed(() => [...new Set(this.ambito().map(a => a.cliente))]);
  readonly carteras = computed(() => [...new Set(this.ambito().filter(a => a.cliente === this.actual()?.cliente).map(a => a.cartera))]);
  readonly deLaCartera = computed(() => this.ambito().filter(a => a.cliente === this.actual()?.cliente && a.cartera === this.actual()?.cartera));
  readonly panelSubs = computed<SubcarteraPanel[]>(() => this.ambito().map(a => ({ id: a.subId, cliente: a.cliente, cartera: a.cartera, subcartera: a.subcartera })));
  readonly etiquetasPanel = computed(() => {
    const etiquetas: Record<number, EtiquetaSubcartera> = {};
    for (const a of this.ambito()) {
      if (!this.cabeceras()[a.subId]) continue;
      const c = this.configDe(a.subId), n = c.cli.length + c.mon.length;
      etiquetas[a.subId] = { texto: `${n} ${n === 1 ? 'campo' : 'campos'}`, tono: 'neutra' };
    }
    return etiquetas;
  });
  readonly sinDatos = computed(() => {
    const id = this.sub();
    return !!id && !this.cargando() && this.cabeceras()[id] === null;
  });

  readonly lista = computed(() => {
    const id = this.sub();
    return id ? this.cabeceras()[id] ?? [] : [];
  });
  readonly config = computed(() => {
    const id = this.sub();
    return id ? this.configDe(id) : null;
  });
  /** Filas del panel a la vista, en orden. */
  readonly filas = computed(() => {
    const id = this.sub(), c = this.config();
    if (!id || !c) return [];
    const porId = new Map(this.lista().map(h => [h.id, h]));
    const base = this.configOriginal(id);
    const filas = this.panel() === 'cli'
      ? c.cli.map(i => ({ cabecera: porId.get(i), formato: '' }))
      : c.mon.map(m => ({ cabecera: porId.get(m.id), formato: m.formato }));
    const principal = this.panel() === 'mon' ? c.mon.find(m => m.formato !== 'TEXTO')?.id : undefined;
    return filas.filter(f => !!f.cabecera).map((f, n) => {
      const h = f.cabecera!, antes = this.panel() === 'cli' ? base.cli.indexOf(h.id) : base.mon.findIndex(m => m.id === h.id);
      const etiqueta = c.etiquetas[h.id] ?? h.nombre;
      const cambiada = antes !== n || etiqueta !== (base.etiquetas[h.id] ?? h.nombre)
        || (this.panel() === 'mon' && base.mon[antes]?.formato !== f.formato);
      return { cabecera: h, formato: f.formato, etiqueta, principal: h.id === principal, cambiada, tipo: TIPOS[h.tipoDato]?.texto ?? h.tipoDato };
    });
  });
  /** Columnas que se pueden agregar al panel a la vista, para el buscador. */
  readonly opcionesAgregar = computed<OpcionCombobox[]>(() => {
    const c = this.config();
    if (!c) return [];
    const usados = new Set(this.panel() === 'cli' ? c.cli : c.mon.map(m => m.id));
    return this.lista().filter(h => !usados.has(h.id))
      .map(h => ({ valor: String(h.id), etiqueta: c.etiquetas[h.id] ?? h.nombre, titulo: h.codigo, icono: TIPOS[h.tipoDato]?.icono ?? 'type' }))
      .sort((a, b) => a.etiqueta.localeCompare(b.etiqueta, 'es'));
  });
  readonly coincidencias = computed(() => {
    const q = normalizar(this.consulta().trim());
    return q ? this.opcionesAgregar().filter(o => normalizar(o.etiqueta).includes(q) || normalizar(o.titulo).includes(q)) : this.opcionesAgregar();
  });
  readonly paginasAgregar = computed(() => Math.max(1, Math.ceil(this.coincidencias().length / POR_PAGINA)));
  readonly desdeAgregar = computed(() => Math.min(this.paginaAgregar(), this.paginasAgregar() - 1) * POR_PAGINA);
  readonly hastaAgregar = computed(() => Math.min(this.desdeAgregar() + POR_PAGINA, this.coincidencias().length));
  readonly opcionesPagina = computed(() => this.coincidencias().slice(this.desdeAgregar(), this.hastaAgregar())
    .map((opcion, k) => ({ opcion, indice: this.desdeAgregar() + k })));

  readonly cambios = computed(() => Object.keys(this.trabajo()).reduce((n, id) => n + this.cambiosDe(Number(id)), 0));
  readonly resumen = computed(() => {
    const n = this.cambios();
    return n === 0 ? 'Sin cambios' : n === 1 ? '1 cambio sin guardar' : `${n} cambios sin guardar`;
  });

  ngOnInit(): void {
    this.cargarAmbito();
  }

  // ---------------------------------------------------------------- Carga

  /** Clientes y subcarteras activos (la marca de la cartera no se mira: hay carteras en uso marcadas como inactivas). */
  cargarAmbito(): void {
    this.cargando.set(true);
    this.error.set(null);
    const activo = (v: unknown) => Number(v) !== 0;
    forkJoin({ clientes: this.clientesApi.getAllTenants(), subs: this.carterasApi.getAllSubPortfolios() }).pipe(
      switchMap(({ clientes, subs }) => {
        const activos = clientes.filter(c => activo(c.isActive));
        const carteras$ = activos.map(c => this.carterasApi.getPortfoliosByTenant(c.id).pipe(catchError(() => of([]))));
        return (carteras$.length ? forkJoin(carteras$) : of([])).pipe(map(porCliente => ({ activos, porCliente, subs })));
      })
    ).subscribe({
      next: ({ activos, porCliente, subs }) => {
        const ambito: Ambito[] = [];
        activos.forEach((c, i) => (porCliente[i] ?? []).forEach(p => subs
          .filter(s => s.portfolioId === p.id && activo(s.isActive))
          .forEach(s => ambito.push({ cliente: c.tenantName, cartera: p.portfolioName, subId: s.id, subcartera: s.subPortfolioName }))));
        this.ambito.set(ambito);
        if (!ambito.length) {
          this.cargando.set(false);
          return;
        }
        this.leer(ambito.map(a => a.subId), () => {
          const conCabeceras = ambito.find(a => this.cabeceras()[a.subId]?.length);
          this.sub.set((conCabeceras ?? ambito[0]).subId);
        });
      },
      error: () => {
        this.error.set('No se pudieron cargar las subcarteras');
        this.cargando.set(false);
      }
    });
  }

  private leer(ids: number[], luego?: () => void): void {
    this.cargando.set(true);
    forkJoin(ids.map(id => forkJoin({
      cabeceras: this.cabecerasApi.getMontoCabeceras(id).pipe(catchError(() => of(null))),
      primera: this.primeraCuotaApi.getConfig(id).pipe(catchError(() => of(null)))
    }))).subscribe(datos => {
      this.cabeceras.update(c => {
        const nuevo = { ...c };
        ids.forEach((id, i) => (nuevo[id] = datos[i].cabeceras));
        return nuevo;
      });
      this.diasBase.update(d => {
        const nuevo = { ...d };
        ids.forEach((id, i) => (nuevo[id] = datos[i].primera?.maxDays ?? null));
        return nuevo;
      });
      this.cargando.set(false);
      luego?.();
    });
  }

  reintentar(): void {
    const id = this.sub();
    if (this.error() || !id) this.cargarAmbito();
    else this.leer([id]);
  }

  /**
   * Configuración guardada de una subcartera. En montos, una cabecera sin marca cuenta como visible (así la
   * lee la ficha); el orden empata por id.
   */
  private configOriginal(id: number): Config {
    const lista = this.cabeceras()[id] ?? [];
    const orden = (a: number | undefined, b: number | undefined, x: ConfiguracionCabecera, y: ConfiguracionCabecera) => (a ?? 0) - (b ?? 0) || x.id - y.id;
    return {
      cli: lista.filter(h => h.esVisibleCliente === 1).sort((x, y) => orden(x.ordenCliente, y.ordenCliente, x, y)).map(h => h.id),
      mon: lista.filter(h => h.esVisibleMonto === 1 || h.esVisibleMonto == null).sort((x, y) => orden(x.ordenMonto, y.ordenMonto, x, y))
        .map(h => ({ id: h.id, formato: h.formatoVisualizacion || 'MONEDA' })),
      etiquetas: {},
      diasPrimeraCuota: this.diasBase()[id] ?? null
    };
  }

  private configDe(id: number): Config {
    return this.trabajo()[id] ?? this.configOriginal(id);
  }

  private cambiosDe(id: number): number {
    const c = this.trabajo()[id];
    if (!c) return 0;
    const o = this.configOriginal(id);
    return Number(JSON.stringify(c.cli) !== JSON.stringify(o.cli)) + Number(JSON.stringify(c.mon) !== JSON.stringify(o.mon))
      + Object.keys(c.etiquetas).length + Number(c.diasPrimeraCuota !== o.diasPrimeraCuota);
  }

  // ---------------------------------------------------------------- Filtros

  elegirCliente(cliente: string): void {
    const a = this.ambito().find(x => x.cliente === cliente);
    if (a) this.elegirSub(a.subId);
  }

  elegirCartera(cartera: string): void {
    const a = this.ambito().find(x => x.cliente === this.actual()?.cliente && x.cartera === cartera);
    if (a) this.elegirSub(a.subId);
  }

  elegirSub(id: number | string): void {
    this.cerrarAgregar();
    this.sub.set(Number(id));
    this.version.update(v => v + 1);
  }

  elegirPanel(p: Panel): void {
    this.cerrarAgregar();
    this.panel.set(p);
  }

  // ---------------------------------------------------------------- Fila nueva

  abrirAgregar(): void {
    this.consulta.set('');
    this.paginaAgregar.set(0);
    this.focoAgregar.set(0);
    this.agregando.set(true);
    afterNextRender(() => {
      this.busquedaAgregar()?.nativeElement.focus();
      const d = this.desplazable()?.nativeElement;
      if (d) d.scrollTop = d.scrollHeight;
    }, { injector: this.injector });
  }

  cerrarAgregar(devolverFoco = false): void {
    if (!this.agregando()) return;
    this.agregando.set(false);
    if (devolverFoco) afterNextRender(() => this.botonAgregar()?.nativeElement.focus(), { injector: this.injector });
  }

  buscarAgregar(texto: string): void {
    this.consulta.set(texto);
    this.paginaAgregar.set(0);
    this.focoAgregar.set(0);
  }

  irAPaginaAgregar(p: number): void {
    const pagina = Math.max(0, Math.min(p, this.paginasAgregar() - 1));
    this.paginaAgregar.set(pagina);
    this.focoAgregar.set(pagina * POR_PAGINA);
    this.busquedaAgregar()?.nativeElement.focus();
  }

  elegirAgregar(o: OpcionCombobox): void {
    this.agregar(o.valor);
    this.cerrarAgregar(true);
  }

  /** ↑↓ recorren las opciones (y cambian de página), RePág/AvPág saltan de página, Enter agrega y Esc cancela. */
  teclaAgregar(ev: KeyboardEvent): void {
    const n = this.coincidencias().length;
    let foco = this.focoAgregar();
    if (ev.key === 'Escape') { ev.preventDefault(); this.cerrarAgregar(true); return; }
    if (ev.key === 'Enter') { ev.preventDefault(); const o = this.coincidencias()[foco]; if (o) this.elegirAgregar(o); return; }
    if (ev.key === 'ArrowDown') foco = Math.min(n - 1, foco + 1);
    else if (ev.key === 'ArrowUp') foco = Math.max(0, foco - 1);
    else if (ev.key === 'PageDown') foco = Math.min(n - 1, (Math.floor(foco / POR_PAGINA) + 1) * POR_PAGINA);
    else if (ev.key === 'PageUp') foco = Math.max(0, (Math.floor(foco / POR_PAGINA) - 1) * POR_PAGINA);
    else return;
    ev.preventDefault();
    this.focoAgregar.set(Math.max(0, foco));
    this.paginaAgregar.set(Math.floor(Math.max(0, foco) / POR_PAGINA));
  }

  /** Un clic fuera de la fila nueva la cierra sin agregar. */
  @HostListener('document:mousedown', ['$event'])
  clicFuera(ev: MouseEvent): void {
    const zona = this.zonaAgregar()?.nativeElement;
    if (this.agregando() && zona && !zona.contains(ev.target as Node)) this.cerrarAgregar();
  }

  // ---------------------------------------------------------------- Edición

  private cambiar(f: (c: Config) => Config): void {
    const id = this.sub();
    if (!id) return;
    const c = this.configDe(id);
    this.trabajo.update(t => ({ ...t, [id]: f({ ...c, cli: [...c.cli], mon: c.mon.map(m => ({ ...m })), etiquetas: { ...c.etiquetas } }) }));
  }

  agregar(valor: string): void {
    const id = Number(valor), h = this.lista().find(x => x.id === id);
    if (!h) return;
    this.cambiar(c => this.panel() === 'cli'
      ? { ...c, cli: [...c.cli, id] }
      : { ...c, mon: [...c.mon, { id, formato: h.tipoDato === 'NUMERICO' ? 'MONEDA' : 'TEXTO' }] });
  }

  quitar(id: number): void {
    this.cambiar(c => this.panel() === 'cli' ? { ...c, cli: c.cli.filter(x => x !== id) } : { ...c, mon: c.mon.filter(m => m.id !== id) });
  }

  mover(id: number, paso: number): void {
    this.cambiar(c => {
      if (this.panel() === 'cli') {
        const i = c.cli.indexOf(id), j = i + paso;
        if (i >= 0 && j >= 0 && j < c.cli.length) [c.cli[i], c.cli[j]] = [c.cli[j], c.cli[i]];
      } else {
        const i = c.mon.findIndex(m => m.id === id), j = i + paso;
        if (i >= 0 && j >= 0 && j < c.mon.length) [c.mon[i], c.mon[j]] = [c.mon[j], c.mon[i]];
      }
      return c;
    });
  }

  elegirFormato(id: number, formato: string): void {
    this.cambiar(c => ({ ...c, mon: c.mon.map(m => m.id === id ? { ...m, formato } : m) }));
  }

  escribirEtiqueta(h: ConfiguracionCabecera, texto: string): void {
    this.cambiar(c => {
      const etiquetas = { ...c.etiquetas };
      if (texto.trim() && texto.trim() !== h.nombre) etiquetas[h.id] = texto.trim();
      else delete etiquetas[h.id];
      return { ...c, etiquetas };
    });
  }

  elegirDias(valor: string): void {
    this.cambiar(c => ({ ...c, diasPrimeraCuota: valor ? Number(valor) : null }));
  }

  descartar(): void {
    this.cerrarAgregar();
    this.trabajo.set({});
    this.version.update(v => v + 1);
  }

  // ---------------------------------------------------------------- Guardar

  /**
   * Por subcartera, una actualización por cabecera que cambia. El servicio escribe la visibilidad, el orden y el
   * formato de montos tal cual llegan, así que se mandan siempre; la etiqueta solo si cambió.
   */
  async guardar(): Promise<void> {
    if (!this.cambios() || this.guardando()) return;
    this.guardando.set(true);
    const errores: string[] = [], tocadas: number[] = [], n = this.cambios();
    for (const [idTxt, c] of Object.entries(this.trabajo())) {
      const id = Number(idTxt);
      if (!this.cambiosDe(id)) continue;
      tocadas.push(id);
      const a = this.ambito().find(x => x.subId === id), donde = a ? `${a.cliente} · ${a.subcartera}` : `Subcartera ${id}`;
      const o = this.configOriginal(id), lista = this.cabeceras()[id] ?? [];
      const estado = (cfg: Config, h: ConfiguracionCabecera) => {
        const iCli = cfg.cli.indexOf(h.id), iMon = cfg.mon.findIndex(m => m.id === h.id);
        return {
          id: h.id,
          esVisibleMonto: iMon >= 0 ? 1 : 0,
          ordenMonto: iMon >= 0 ? (iMon + 1) * 10 : 0,
          formatoVisualizacion: iMon >= 0 ? cfg.mon[iMon].formato : (h.formatoVisualizacion || 'MONEDA'),
          esVisibleCliente: iCli >= 0 ? 1 : 0,
          ordenCliente: iCli >= 0 ? (iCli + 1) * 10 : 0,
          nombre: cfg.etiquetas[h.id]
        };
      };
      const actualizaciones = lista.map(h => ({ antes: estado(o, h), ahora: estado(c, h) }))
        .filter(x => JSON.stringify(x.antes) !== JSON.stringify(x.ahora))
        .map(x => x.ahora);
      try {
        if (actualizaciones.length) await firstValueFrom(this.cabecerasApi.updateAmountVisibility(id, actualizaciones));
      } catch {
        errores.push(`${donde}: columnas`);
      }
      if (c.diasPrimeraCuota !== o.diasPrimeraCuota) {
        try {
          await firstValueFrom(this.primeraCuotaApi.saveConfig({ subPortfolioId: id, maxDays: c.diasPrimeraCuota }));
        } catch {
          errores.push(`${donde}: primera cuota`);
        }
      }
    }
    this.trabajo.set({});
    this.guardando.set(false);
    this.version.update(v => v + 1);
    this.leer(tocadas);
    if (errores.length) this.avisos.error(`No se guardó todo: ${errores.join(' · ')}`, 9000);
    else this.avisos.success(n === 1 ? '1 cambio guardado' : `${n} cambios guardados`);
  }
}
