import { ChangeDetectionStrategy, Component, ElementRef, OnInit, computed, inject, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { A11yModule } from '@angular/cdk/a11y';
import { Observable, catchError, concatMap, forkJoin, from, map, of, switchMap, toArray } from 'rxjs';
import { LucideAngularModule } from 'lucide-angular';
import { TypificationV2Service } from '../../services/typification-v2.service';
import { ToastService } from '../../../shared/services/toast.service';
import { BotonDirective } from '../../../shared/ui/boton.directive';
import { PageHeaderComponent } from '../../../shared/ui/page-header.component';
import { TarjetaDirective } from '../../../shared/ui/tarjeta.directive';
import {
  AdditionalFieldV2,
  TenantTypificationConfigV2,
  TypificationCatalogV2,
  TypificationTreeNodeV2,
  UpdateTypificationConfigCommandV2
} from '../../models/typification-v2.model';
import { TypificationFormDialogComponent } from '../typification-form-dialog/typification-form-dialog.component';
import { CategoryFormDialogComponent } from '../category-form-dialog/category-form-dialog.component';
import { TypificationAdditionalFieldsDialogComponent } from '../typification-additional-fields-dialog/typification-additional-fields-dialog.component';
import { TUI } from '../typification-ui';

/** Una subcartera con su cliente y su cartera. */
interface Ambito {
  tenantId: number;
  cliente: string;
  portfolioId: number;
  cartera: string;
  subId: number;
  subcartera: string;
}

/** Campo de lista que una tipificación pasa a todas las que cuelgan de ella (por ejemplo, el motivo de no pago). */
interface CampoLista {
  campoId: number;
  etiqueta: string;
  tipificacionId: number;
}

interface Motivo {
  codigo: string;
  nombre: string;
  activo: boolean;
}

/** Lo cargado de una subcartera. */
interface DatosSub {
  configs: TenantTypificationConfigV2[];
  arbol: TypificationTreeNodeV2[];
  campos: Record<number, AdditionalFieldV2[]>;
  lista: CampoLista | null;
  motivos: Motivo[];
}

/** Cambios sin guardar de una tipificación en una subcartera. Lo que no está, no cambió. */
interface Borrador {
  habilitada?: boolean;
  nombre?: string;
  descripcion?: string;
  color?: string;
}

/** Una fila de la lista: el nodo, su nivel y el tipo de contacto del que cuelga. */
interface Fila {
  node: TypificationTreeNodeV2;
  nivel: number;
  raiz: number;
  ancestros: TypificationTreeNodeV2[];
  /** Fila de la lista que el nodo pasa a sus opciones (el motivo de no pago); `node` es quien la define. */
  lista?: boolean;
}

interface EstadoEliminar {
  tip: TypificationCatalogV2;
  /** 'enUso': el backend se negó a borrarla y `mensaje` trae el motivo. */
  paso: 'confirmar' | 'enUso';
  mensaje: string;
}

const COLORES = [
  { hex: '#3B82F6', nombre: 'Azul' },
  { hex: '#10B981', nombre: 'Verde' },
  { hex: '#EF4444', nombre: 'Rojo' },
  { hex: '#F59E0B', nombre: 'Naranja' },
  { hex: '#8B5CF6', nombre: 'Violeta' },
  { hex: '#EC4899', nombre: 'Rosa' },
  { hex: '#6366F1', nombre: 'Índigo' },
  { hex: '#14B8A6', nombre: 'Turquesa' }
];

const PERSONALES: (keyof Borrador)[] = ['nombre', 'descripcion', 'color'];

/**
 * Tipificaciones por subcartera: qué opciones del catálogo ve el asesor, con qué nombre, y la lista que
 * piden las opciones de una rama (el motivo de no pago).
 *
 * Misma forma que Umbrales de estado: se edita en la lista, cada tipo de contacto se pliega, y nada se
 * envía hasta «Guardar cambios». Lo que toca el catálogo (crear, editar, eliminar) va por sus diálogos
 * y se aplica al momento, porque afecta a todas las carteras.
 */
@Component({
  selector: 'app-typification-maintenance',
  standalone: true,
  imports: [
    NgClass, A11yModule, LucideAngularModule, PageHeaderComponent, TarjetaDirective, BotonDirective,
    TypificationFormDialogComponent, CategoryFormDialogComponent, TypificationAdditionalFieldsDialogComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './typification-maintenance.component.html',
  host: { class: 'cashi-pantalla @container/tipif flex min-h-0 flex-1 flex-col gap-3' }
})
export class TypificationMaintenanceComponent implements OnInit {
  private readonly api = inject(TypificationV2Service);
  private readonly avisos = inject(ToastService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  /** Estilos de los diálogos que se conservan (eliminar). */
  readonly ui = TUI;
  readonly COLORES = COLORES;

  /** Columnas de la cabecera y de cada fila: tipificación, campos, habilitada y editar. */
  readonly REJILLA = 'grid grid-cols-[minmax(0,1fr)_auto_4.25rem_1.75rem] items-center gap-x-[clamp(.5rem,2.4cqw,1.5rem)] px-2 '
    + '@max-[44rem]/tabla:grid-cols-[minmax(0,1fr)_auto_3.5rem_1.75rem]';
  readonly REJILLA_LISTA = 'grid grid-cols-[6rem_minmax(0,1fr)_4.25rem_1.75rem] items-center gap-x-[clamp(.5rem,2.4cqw,1.5rem)] px-2';
  readonly LISTA = 'font-cashi m-0! h-auto! w-full rounded-[.625rem]! border! border-(--campo-ln)! bg-(--campo)! px-2.5! py-2! text-[.875rem]! leading-[1.5]! text-ellipsis text-foreground! outline-none '
    + 'focus:border-ring! focus:shadow-[0_0_0_3px_rgb(16_185_129/.3)]';
  /** El tema antiguo fija con !important el aspecto de los campos: de ahí los `!`. */
  readonly CAMPO = 'font-cashi m-0! w-full min-w-0 rounded-[.625rem]! border! border-(--campo-ln)! bg-(--campo)! px-3! py-2! text-[.875rem]! leading-[1.5]! text-foreground! outline-none '
    + 'placeholder:text-muted-foreground focus:border-ring! focus:shadow-[0_0_0_3px_rgb(16_185_129/.3)]';
  readonly CAMPO_FILA = 'font-cashi m-0! w-full min-w-0 rounded-lg! border! bg-(--campo)! px-2! py-[.3125rem]! text-[.875rem]! leading-[1.5]! text-foreground! outline-none '
    + 'placeholder:text-muted-foreground focus:border-ring! focus:shadow-[0_0_0_3px_rgb(16_185_129/.3)]';
  readonly ETIQUETA = 'm-0! text-[.75rem]! leading-[1.5]! font-medium! text-foreground/80!';
  readonly INTERRUPTOR = "relative block h-[1.125rem] w-8 flex-none cursor-pointer justify-self-center rounded-full border-0! p-0! transition-colors duration-150 after:absolute after:top-0.5 after:left-0.5 after:size-3.5 after:rounded-full after:bg-white after:shadow-[0_1px_2px_rgb(0_0_0/.25)] after:transition-transform after:duration-150 after:content-[''] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";
  readonly ICONO = 'grid size-7 flex-none cursor-pointer place-items-center rounded-lg border-0! bg-transparent p-0! text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground '
    + 'aria-expanded:bg-muted aria-expanded:text-foreground focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring';
  readonly PILL = 'rounded-full px-2.5 py-0.5 text-[.75rem] font-medium whitespace-nowrap text-muted-foreground shadow-[inset_0_0_0_1px_var(--border)]';
  readonly PESTANA = 'font-cashi cursor-pointer rounded-md border-0 px-1.5 py-[.4375rem] text-[.875rem] font-medium transition-colors duration-150';
  readonly PESTANA_ACTIVA = 'bg-(--seg-activo) text-foreground shadow-[0_1px_2px_rgb(0_0_0/.08)]';
  readonly PESTANA_REPOSO = 'bg-transparent text-foreground/60';

  readonly cargando = signal(true);
  readonly error = signal<string | null>(null);
  readonly guardando = signal(false);

  readonly ambito = signal<Ambito[]>([]);
  readonly sub = signal<number | null>(null);
  private readonly datos = signal<Record<number, DatosSub>>({});
  private readonly borradores = signal<Record<number, Record<number, Borrador>>>({});
  private readonly motivosTrabajo = signal<Record<number, Motivo[]>>({});
  /** Tipos de contacto desplegados por subcartera; al entrar a una, todos plegados. */
  private readonly desplegados = signal<Record<number, number[]>>({});
  readonly pestana = signal<'arbol' | 'lista'>('arbol');
  /** Tipificación con la edición abierta debajo de su fila. */
  readonly abierta = signal<number | null>(null);
  /** Cambia cuando hay que volver a crear los campos de texto: solo toman el valor al nacer. */
  readonly version = signal(0);

  // ---------------------------------------------------------------- Diálogos
  readonly showClassificationDialog = signal(false);
  readonly showCategoryDialog = signal(false);
  readonly showAdditionalFieldsDialog = signal(false);
  readonly classificationDialogMode = signal<'create' | 'edit'>('create');
  readonly selectedClassificationForEdit = signal<TypificationCatalogV2 | undefined>(undefined);
  readonly selectedTypificationForFields = signal<TypificationCatalogV2 | undefined>(undefined);
  readonly parentClassificationForCreate = signal<TypificationCatalogV2 | undefined>(undefined);
  readonly eliminar = signal<EstadoEliminar | null>(null);
  readonly eliminando = signal(false);

  // ---------------------------------------------------------------- Derivados
  readonly actual = computed(() => this.ambito().find(a => a.subId === this.sub()) ?? null);
  readonly clientes = computed(() => [...new Set(this.ambito().map(a => a.cliente))]);
  readonly carteras = computed(() => [...new Set(this.ambito().filter(a => a.cliente === this.actual()?.cliente).map(a => a.cartera))]);
  readonly deLaCartera = computed(() => this.ambito().filter(a => a.cliente === this.actual()?.cliente && a.cartera === this.actual()?.cartera));
  readonly porCliente = computed(() => this.clientes().map(nombre => ({ nombre, subs: this.ambito().filter(a => a.cliente === nombre) })));
  readonly datosActual = computed(() => {
    const id = this.sub();
    return id ? this.datos()[id] ?? null : null;
  });
  readonly lista = computed(() => this.datosActual()?.lista ?? null);
  readonly motivos = computed(() => {
    const id = this.sub();
    return id ? this.motivosTrabajo()[id] ?? [] : [];
  });

  /** Filas a la vista: los tipos de contacto y, de los desplegados, todo lo que cuelga de ellos. */
  readonly filas = computed<Fila[]>(() => {
    const d = this.datosActual(), id = this.sub();
    if (!d || !id) {
      return [];
    }
    const abiertos = this.desplegadosDe(id);
    const filas: Fila[] = [];
    // La lista que un nodo pasa a sus opciones se ve como un nivel entre él y ellas: el asesor la
    // elige antes del detalle. En el catálogo sigue siendo un campo de ese nodo.
    const bajar = (nodes: TypificationTreeNodeV2[], nivel: number, raiz: number, ancestros: TypificationTreeNodeV2[]) => nodes.forEach(n => {
      const r = nivel === 1 ? n.typification.id : raiz;
      filas.push({ node: n, nivel, raiz: r, ancestros });
      if (n.children.length && (nivel > 1 || abiertos.includes(n.typification.id))) {
        const conLista = d.lista?.tipificacionId === n.typification.id;
        if (conLista) {
          filas.push({ node: n, nivel: nivel + 1, raiz: r, ancestros: [...ancestros, n], lista: true });
        }
        bajar(n.children, nivel + (conLista ? 2 : 1), r, [...ancestros, n]);
      }
    });
    bajar(d.arbol, 1, 0, []);
    return filas;
  });

  readonly cambios = computed(() => {
    let n = 0;
    for (const porTip of Object.values(this.borradores())) {
      n += Object.keys(porTip).length;
    }
    const datos = this.datos();
    for (const [id, trabajo] of Object.entries(this.motivosTrabajo())) {
      const antes = datos[Number(id)]?.motivos ?? [];
      const largo = Math.max(antes.length, trabajo.length);
      for (let i = 0; i < largo; i++) {
        if (JSON.stringify(antes[i] ?? null) !== JSON.stringify(trabajo[i] ?? null)) {
          n++;
        }
      }
    }
    return n;
  });

  readonly hayInvalido = computed(() => Object.values(this.motivosTrabajo()).some(l => l.some((m, i) => this.motivoMal(l, m, i))));

  readonly resumen = computed(() => {
    const n = this.cambios();
    return this.hayInvalido() ? 'Cada motivo necesita código y nombre, sin repetir'
      : n === 0 ? 'Sin cambios' : n === 1 ? '1 cambio sin guardar' : `${n} cambios sin guardar`;
  });

  ngOnInit(): void {
    this.cargarAmbito();
  }

  // ---------------------------------------------------------------- Carga

  /** Todas las subcarteras de todos los clientes, para los filtros y la lista del costado. */
  cargarAmbito(): void {
    this.cargando.set(true);
    this.error.set(null);
    this.api.getAllTenants().pipe(
      switchMap(tenants => tenants.length
        ? forkJoin(tenants.map(t => this.api.getPortfoliosByTenant(t.id).pipe(
            map(ps => ps.map(p => ({ t, p }))),
            catchError(() => of([]))
          ))).pipe(map(l => l.flat()))
        : of([])),
      switchMap(pares => pares.length
        ? forkJoin(pares.map(({ t, p }) => this.api.getSubPortfoliosByPortfolio(p.id).pipe(
            map(subs => subs.map((s: any): Ambito => ({
              tenantId: t.id, cliente: (t.tenantName || '').trim(), portfolioId: p.id, cartera: p.portfolioName,
              subId: s.id, subcartera: s.subPortfolioName || s.nombre || ''
            }))),
            catchError(() => of([] as Ambito[]))
          ))).pipe(map(l => l.flat()))
        : of([] as Ambito[]))
    ).subscribe({
      next: ambito => {
        this.ambito.set(ambito);
        if (ambito.length) {
          this.elegirSub(ambito[0].subId);
        } else {
          this.cargando.set(false);
        }
      },
      error: () => {
        this.error.set('No se pudieron cargar las subcarteras');
        this.cargando.set(false);
      }
    });
  }

  /** Configuración, árbol, campos y lista de una subcartera. */
  private cargarSub(id: number): void {
    const a = this.ambito().find(x => x.subId === id);
    if (!a) {
      return;
    }
    this.cargando.set(true);
    this.error.set(null);
    forkJoin({
      configs: this.api.getTenantClassifications(a.tenantId, a.portfolioId, true, id),
      efectivas: this.api.getEffectiveTypifications(a.tenantId, a.portfolioId, id).pipe(catchError(() => of([] as TypificationCatalogV2[])))
    }).pipe(
      switchMap(({ configs, efectivas }) => {
        // La subcartera puede colgar una tipificación de otro padre que el del catálogo.
        const padres = new Map(efectivas.map(t => [t.id, t.parentTypificationId ?? null]));
        configs.forEach(c => {
          if (padres.has(c.tipificacion.id)) {
            c.tipificacion.parentTypificationId = padres.get(c.tipificacion.id) ?? undefined;
          }
        });
        const ids = configs.map(c => c.tipificacion.id);
        return (ids.length ? this.api.getAdditionalFieldsByTypifications(ids).pipe(catchError(() => of({}))) : of({}))
          .pipe(map(campos => ({ configs, campos: campos as Record<number, AdditionalFieldV2[]> })));
      }),
      switchMap(({ configs, campos }) => {
        const lista = this.campoLista(configs, campos);
        const motivos$: Observable<Motivo[]> = lista
          ? this.api.getOpcionesCampo(lista.campoId, id).pipe(
              map(ops => [...ops].sort((x, y) => (x.ordenVisualizacion ?? 0) - (y.ordenVisualizacion ?? 0))
                .map(o => ({ codigo: o.codigoOpcion, nombre: o.labelOpcion, activo: !!o.estaHabilitada }))),
              catchError(() => of([])))
          : of([]);
        return motivos$.pipe(map(motivos => ({ configs, campos, lista, motivos })));
      })
    ).subscribe({
      next: ({ configs, campos, lista, motivos }) => {
        // Al volver a leer tras un cambio del catálogo, la lista que se estaba editando no se pierde.
        const previo = this.datos()[id], trabajo = this.motivosTrabajo()[id];
        const conservar = !!lista && !!previo && !!trabajo && JSON.stringify(trabajo) !== JSON.stringify(previo.motivos);
        this.datos.update(d => ({ ...d, [id]: { configs, arbol: this.armarArbol(configs), campos, lista, motivos } }));
        this.motivosTrabajo.update(m => {
          const { [id]: _, ...resto } = m;
          return lista ? { ...resto, [id]: conservar ? trabajo : motivos.map(x => ({ ...x })) } : resto;
        });
        if (!lista) {
          this.pestana.set('arbol');
        }
        this.version.update(n => n + 1);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar las tipificaciones');
        this.cargando.set(false);
      }
    });
  }

  /** El primer campo de lista que una tipificación pasa a las de abajo. */
  private campoLista(configs: TenantTypificationConfigV2[], campos: Record<number, AdditionalFieldV2[]>): CampoLista | null {
    for (const c of configs) {
      const f = (campos[c.tipificacion.id] ?? []).find(x => String(x.tipoCampo).toUpperCase() === 'SELECT' && x.aplicaADescendientes);
      if (f) {
        return { campoId: f.id, etiqueta: f.labelCampo, tipificacionId: c.tipificacion.id };
      }
    }
    return null;
  }

  private armarArbol(configs: TenantTypificationConfigV2[]): TypificationTreeNodeV2[] {
    const nodos = new Map<number, TypificationTreeNodeV2>();
    configs.forEach(c => nodos.set(c.tipificacion.id, { typification: c.tipificacion, config: c, children: [], level: c.tipificacion.nivelJerarquia }));
    const raices: TypificationTreeNodeV2[] = [];
    configs.forEach(c => {
      const nodo = nodos.get(c.tipificacion.id)!;
      const padre = c.tipificacion.parentTypificationId || c.tipificacion.tipificacionPadre?.id;
      const p = padre ? nodos.get(padre) : undefined;
      (p ? p.children : raices).push(nodo);
    });
    const ordenar = (l: TypificationTreeNodeV2[]) => {
      l.sort((x, y) => (x.typification.ordenVisualizacion || 0) - (y.typification.ordenVisualizacion || 0));
      l.forEach(n => ordenar(n.children));
    };
    ordenar(raices);
    return raices;
  }

  // ---------------------------------------------------------------- Alcance

  elegirCliente(nombre: string): void {
    const a = this.ambito().find(x => x.cliente === nombre);
    if (a) {
      this.elegirSub(a.subId);
    }
  }

  elegirCartera(nombre: string): void {
    const a = this.ambito().find(x => x.cliente === this.actual()?.cliente && x.cartera === nombre);
    if (a) {
      this.elegirSub(a.subId);
    }
  }

  /** Los cambios sin guardar de la subcartera que se deja se conservan hasta guardar o descartar. */
  elegirSub(id: number | string): void {
    const n = Number(id);
    this.sub.set(n);
    this.abierta.set(null);
    if (!this.datos()[n]) {
      this.cargarSub(n);
    } else if (!this.datos()[n].lista) {
      this.pestana.set('arbol');
    }
  }

  // ---------------------------------------------------------------- Filas

  private desplegadosDe(id: number): number[] {
    return this.desplegados()[id] ?? [];
  }

  desplegado(f: Fila): boolean {
    const id = this.sub(), d = this.datosActual();
    return !!id && !!d && this.desplegadosDe(id).includes(f.node.typification.id);
  }

  alternarGrupo(f: Fila): void {
    const id = this.sub(), d = this.datosActual();
    if (f.nivel !== 1 || !id || !d) {
      return;
    }
    const tip = f.node.typification.id, abiertos = this.desplegadosDe(id);
    this.desplegados.update(x => ({ ...x, [id]: abiertos.includes(tip) ? abiertos.filter(t => t !== tip) : [...abiertos, tip] }));
    // La edición de una fila que queda plegada se cierra.
    const ab = this.abierta();
    if (ab && !this.filas().some(x => x.node.typification.id === ab)) {
      this.abierta.set(null);
    }
  }

  private borrador(tip: number): Borrador {
    const id = this.sub();
    return id ? this.borradores()[id]?.[tip] ?? {} : {};
  }

  /** Valor guardado de lo personal de una tipificación en esta subcartera. */
  private guardadoPersonal(c: TenantTypificationConfigV2 | undefined, k: keyof Borrador): string {
    if (!c) {
      return '';
    }
    return (k === 'nombre' ? c.nombrePersonalizado : k === 'descripcion' ? c.descripcionPersonalizada : c.colorPersonalizado) || '';
  }

  personal(f: Fila, k: 'nombre' | 'descripcion' | 'color'): string {
    const b = this.borrador(f.node.typification.id);
    return b[k] !== undefined ? b[k] as string : this.guardadoPersonal(f.node.config, k);
  }

  habilitada(f: Fila): boolean {
    const b = this.borrador(f.node.typification.id);
    return b.habilitada ?? f.node.config?.estaHabilitada === true;
  }

  /** Se ve apagada si ella o alguno de sus padres está deshabilitado. */
  apagada(f: Fila): boolean {
    return !this.habilitada(f) || f.ancestros.some(a => !this.habilitada({ node: a, nivel: 0, raiz: 0, ancestros: [] }));
  }

  nombre(f: Fila): string {
    return this.personal(f, 'nombre') || f.node.typification.nombre;
  }

  personalizada(f: Fila): boolean {
    return !!(this.personal(f, 'nombre') || this.personal(f, 'descripcion') || this.personal(f, 'color') || f.node.config?.iconoPersonalizado);
  }

  cambiada(f: Fila): boolean {
    return Object.keys(this.borrador(f.node.typification.id)).length > 0;
  }

  /** Clave de la fila: la de la lista comparte nodo con la tipificación que la define. */
  clave(f: Fila): string {
    return (f.lista ? 'lista-' : '') + f.node.typification.id;
  }

  /** Motivos activos de la lista de la subcartera abierta. */
  motivosActivos(): number {
    return this.motivos().filter(m => m.activo).length;
  }

  finales(n: TypificationTreeNodeV2): number {
    return n.children.length ? n.children.reduce((s, x) => s + this.finales(x), 0) : 1;
  }

  /** Lo que muestra la columna Campos: los campos propios y, en la tipificación que la tiene, la lista que pasa a las de abajo. */
  pills(f: Fila): string[] {
    const d = this.datosActual(), tip = f.node.typification.id;
    const propios = (d?.campos[tip] ?? []);
    const pills: string[] = [];
    propios.filter(c => !(String(c.tipoCampo).toUpperCase() === 'SELECT' && c.aplicaADescendientes))
      .forEach(c => pills.push((c.labelCampo || c.nombreCampo).toLowerCase()));
    return pills;
  }

  /** Cambia un valor de la tipificación en esta subcartera; si vuelve a lo guardado, deja de contar como cambio. */
  private fijar(f: Fila, k: keyof Borrador, valor: string | boolean): void {
    const id = this.sub();
    if (!id) {
      return;
    }
    const tip = f.node.typification.id, c = f.node.config;
    const guardado = k === 'habilitada' ? c?.estaHabilitada === true : this.guardadoPersonal(c, k);
    this.borradores.update(todos => {
      const porTip = { ...(todos[id] ?? {}) };
      const b: Borrador = { ...(porTip[tip] ?? {}) };
      if (valor === guardado) {
        delete b[k];
      } else {
        (b as any)[k] = valor;
      }
      if (Object.keys(b).length) {
        porTip[tip] = b;
      } else {
        delete porTip[tip];
      }
      return { ...todos, [id]: porTip };
    });
  }

  alternarHabilitada(f: Fila): void {
    this.fijar(f, 'habilitada', !this.habilitada(f));
  }

  escribir(f: Fila, k: 'nombre' | 'descripcion', texto: string): void {
    this.fijar(f, k, texto.trim() ? texto : '');
  }

  elegirColor(f: Fila, hex: string): void {
    this.fijar(f, 'color', this.personal(f, 'color') === hex ? '' : hex);
  }

  quitarPersonalizacion(f: Fila): void {
    PERSONALES.forEach(k => this.fijar(f, k, ''));
    this.version.update(n => n + 1);
  }

  revertir(f: Fila): void {
    const id = this.sub();
    if (!id) {
      return;
    }
    this.borradores.update(todos => {
      const { [f.node.typification.id]: _, ...resto } = todos[id] ?? {};
      return { ...todos, [id]: resto };
    });
    this.version.update(n => n + 1);
  }

  editar(f: Fila): void {
    this.abierta.set(this.abierta() === f.node.typification.id ? null : f.node.typification.id);
  }

  // ---------------------------------------------------------------- Lista (motivos)

  motivoMal(l: Motivo[], m: Motivo, i: number): boolean {
    return !m.codigo.trim() || !m.nombre.trim() || l.findIndex(x => x.codigo.trim() === m.codigo.trim()) !== i;
  }

  private cambiarMotivos(cambio: (l: Motivo[]) => Motivo[]): void {
    const id = this.sub();
    if (id) {
      this.motivosTrabajo.update(m => ({ ...m, [id]: cambio((m[id] ?? []).map(x => ({ ...x }))) }));
    }
  }

  escribirMotivo(i: number, k: 'codigo' | 'nombre', texto: string): void {
    this.cambiarMotivos(l => {
      l[i][k] = texto;
      return l;
    });
  }

  alternarMotivo(i: number): void {
    this.cambiarMotivos(l => {
      l[i].activo = !l[i].activo;
      return l;
    });
  }

  quitarMotivo(i: number): void {
    this.cambiarMotivos(l => l.filter((_, j) => j !== i));
    this.version.update(n => n + 1);
  }

  /** El botón está arriba y la fila nueva queda al final: el cursor salta a ella. */
  agregarMotivo(): void {
    this.cambiarMotivos(l => [...l, { codigo: '', nombre: '', activo: true }]);
    this.version.update(n => n + 1);
    setTimeout(() => {
      const codigos = this.host.nativeElement.querySelectorAll<HTMLInputElement>('input[placeholder="Código"]');
      codigos.item(codigos.length - 1)?.focus();
    });
  }

  // ---------------------------------------------------------------- Guardar

  descartar(): void {
    const datos = this.datos();
    this.borradores.set({});
    this.motivosTrabajo.set(Object.fromEntries(Object.entries(datos).filter(([, d]) => d.lista).map(([id, d]) => [id, d.motivos.map(x => ({ ...x }))])));
    this.version.update(n => n + 1);
  }

  /**
   * Envía todo en orden: primero habilitar o deshabilitar, después lo personal (el backend reemplaza la
   * configuración entera, así que va con el estado final) y al último las listas.
   */
  guardar(): void {
    if (!this.cambios() || this.hayInvalido() || this.guardando()) {
      return;
    }
    const estados: Observable<unknown>[] = [], personales: Observable<unknown>[] = [], listas: Observable<unknown>[] = [];
    const tocadas = new Set<number>();
    for (const [idTexto, porTip] of Object.entries(this.borradores())) {
      const id = Number(idTexto), a = this.ambito().find(x => x.subId === id), d = this.datos()[id];
      if (!a || !d) {
        continue;
      }
      for (const [tipTexto, b] of Object.entries(porTip)) {
        const tip = Number(tipTexto), c = d.configs.find(x => x.tipificacion.id === tip);
        if (!c) {
          continue;
        }
        tocadas.add(id);
        if (b.habilitada !== undefined) {
          estados.push(b.habilitada
            ? this.api.enableClassification(a.tenantId, tip, a.portfolioId, id)
            : this.api.disableClassification(a.tenantId, tip, a.portfolioId, id));
        }
        if (PERSONALES.some(k => b[k] !== undefined)) {
          const valor = (k: keyof Borrador) => (b[k] !== undefined ? b[k] as string : this.guardadoPersonal(c, k)) || undefined;
          const command: UpdateTypificationConfigCommandV2 = {
            estaHabilitada: b.habilitada ?? c.estaHabilitada,
            heredaDePadre: c.heredaDePadre,
            nombrePersonalizado: valor('nombre'),
            descripcionPersonalizada: valor('descripcion'),
            colorPersonalizado: valor('color'),
            // No se editan aquí: se reenvían tal cual para no borrarlos.
            iconoPersonalizado: c.iconoPersonalizado || undefined,
            ordenVisualizacionPersonalizado: c.ordenVisualizacionPersonalizado ?? undefined,
            requiereObservacionesPersonalizado: c.requiereObservacionesPersonalizado ?? undefined
          };
          personales.push(this.api.updateTenantTypificationConfig(c.id, command));
        }
      }
    }
    for (const [idTexto, trabajo] of Object.entries(this.motivosTrabajo())) {
      const id = Number(idTexto), d = this.datos()[id];
      if (!d?.lista || JSON.stringify(d.motivos) === JSON.stringify(trabajo)) {
        continue;
      }
      tocadas.add(id);
      listas.push(this.api.guardarOpcionesLista(d.lista.campoId, id,
        trabajo.map(m => ({ codigoOpcion: m.codigo.trim(), labelOpcion: m.nombre.trim(), estaHabilitada: m.activo }))));
    }

    this.guardando.set(true);
    from([...estados, ...personales, ...listas]).pipe(concatMap(p => p), toArray()).subscribe({
      next: () => this.alGuardar(tocadas, true),
      error: err => this.alGuardar(tocadas, false, err?.error?.error || err?.error?.message)
    });
  }

  /** Tras guardar (o fallar a medias) se vuelve a leer lo que quedó en las subcarteras tocadas. */
  private alGuardar(tocadas: Set<number>, ok: boolean, mensaje?: string): void {
    this.guardando.set(false);
    this.borradores.set({});
    this.abierta.set(null);
    this.datos.update(d => Object.fromEntries(Object.entries(d).filter(([id]) => !tocadas.has(Number(id)))));
    this.motivosTrabajo.update(m => Object.fromEntries(Object.entries(m).filter(([id]) => !tocadas.has(Number(id)))));
    const id = this.sub();
    if (id) {
      this.cargarSub(id);
    }
    if (ok) {
      this.avisos.success('Tipificaciones guardadas.');
    } else {
      this.avisos.error(mensaje || 'No se pudieron guardar todos los cambios. La lista muestra lo que quedó.');
    }
  }

  /** Lo del catálogo se aplica al momento: se vuelve a leer la subcartera abierta sin perder lo que no se guardó. */
  private recargarActual(): void {
    const id = this.sub();
    if (id) {
      this.cargarSub(id);
    }
  }

  // ---------------------------------------------------------------- Catálogo y diálogos

  openCreateRootDialog(): void {
    if (!this.sub()) {
      return;
    }
    this.classificationDialogMode.set('create');
    this.selectedClassificationForEdit.set(undefined);
    this.parentClassificationForCreate.set(undefined);
    this.showClassificationDialog.set(true);
  }

  openCreateChildDialog(parent: TypificationCatalogV2): void {
    this.classificationDialogMode.set('create');
    this.selectedClassificationForEdit.set(undefined);
    this.parentClassificationForCreate.set(parent);
    this.showClassificationDialog.set(true);
  }

  openEditDialog(typification: TypificationCatalogV2): void {
    this.classificationDialogMode.set('edit');
    this.selectedClassificationForEdit.set(typification);
    this.parentClassificationForCreate.set(undefined);
    this.showClassificationDialog.set(true);
  }

  closeClassificationDialog(): void {
    this.showClassificationDialog.set(false);
    this.selectedClassificationForEdit.set(undefined);
    this.parentClassificationForCreate.set(undefined);
  }

  onClassificationSaved(typification: TypificationCatalogV2): void {
    const eraEdicion = this.classificationDialogMode() === 'edit';
    this.closeClassificationDialog();
    this.avisos.success(eraEdicion
      ? `«${typification.nombre}» se actualizó en el catálogo`
      : `«${typification.nombre}» se creó y quedó habilitada en esta subcartera`);
    this.recargarActual();
  }

  openAdditionalFieldsDialog(typification: TypificationCatalogV2): void {
    this.selectedTypificationForFields.set(typification);
    this.showAdditionalFieldsDialog.set(true);
  }

  closeAdditionalFieldsDialog(): void {
    this.showAdditionalFieldsDialog.set(false);
    this.selectedTypificationForFields.set(undefined);
  }

  onAdditionalFieldsSaved(): void {
    this.closeAdditionalFieldsDialog();
    this.avisos.success('Montos guardados');
  }

  openCreateCategoryDialog(): void {
    this.showCategoryDialog.set(true);
  }

  closeCategoryDialog(): void {
    this.showCategoryDialog.set(false);
  }

  onCategorySaved(): void {
    this.showCategoryDialog.set(false);
    this.avisos.success('Categoría creada');
  }

  /** Tipificaciones de la subcartera abierta, para el diálogo de categoría. */
  get typifications(): TypificationCatalogV2[] {
    return this.datosActual()?.configs.map(c => c.tipificacion) ?? [];
  }

  abrirEliminar(typification: TypificationCatalogV2): void {
    if (!typification.esSistema) {
      this.eliminar.set({ tip: typification, paso: 'confirmar', mensaje: '' });
    }
  }

  cerrarEliminar(): void {
    if (!this.eliminando()) {
      this.eliminar.set(null);
    }
  }

  /** La tipificación que se intentó borrar ya está apagada en esta subcartera. */
  get eliminarYaDeshabilitada(): boolean {
    const e = this.eliminar();
    return !!e && !!this.datosActual()?.configs.some(c => c.tipificacion.id === e.tip.id && c.estaHabilitada !== true);
  }

  confirmarEliminar(): void {
    const e = this.eliminar();
    if (!e || this.eliminando()) {
      return;
    }
    this.eliminando.set(true);
    this.api.deleteTypification(e.tip.id).subscribe({
      next: () => {
        this.eliminando.set(false);
        this.eliminar.set(null);
        this.avisos.success(`«${e.tip.nombre}» se eliminó del catálogo`);
        this.recargarActual();
      },
      error: error => {
        this.eliminando.set(false);
        // El backend rechaza con 400 y explica por qué (casi siempre: tiene gestiones asociadas).
        const mensaje = error?.error?.error || error?.error?.message;
        if (error?.status === 400 && mensaje) {
          this.eliminar.set({ tip: e.tip, paso: 'enUso', mensaje });
        } else {
          this.eliminar.set(null);
          this.avisos.error('Error al eliminar la tipificación');
        }
      }
    });
  }

  deshabilitarEnSubcartera(): void {
    const e = this.eliminar(), a = this.actual();
    if (!e || !a || this.eliminando()) {
      return;
    }
    this.eliminando.set(true);
    this.api.disableClassification(a.tenantId, e.tip.id, a.portfolioId, a.subId).subscribe({
      next: () => {
        this.eliminando.set(false);
        this.eliminar.set(null);
        this.avisos.success(`«${e.tip.nombre}» quedó deshabilitada en esta subcartera`);
        this.recargarActual();
      },
      error: () => {
        this.eliminando.set(false);
        this.avisos.error('No se pudo deshabilitar la tipificación');
      }
    });
  }
}
