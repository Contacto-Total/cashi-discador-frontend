import { ChangeDetectionStrategy, Component, ElementRef, OnInit, computed, inject, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { A11yModule } from '@angular/cdk/a11y';
import { CdkConnectedOverlay, CdkOverlayOrigin, ConnectedPosition } from '@angular/cdk/overlay';
import { LucideAngularModule } from 'lucide-angular';
import { Observable, catchError, firstValueFrom, forkJoin, map, of, switchMap } from 'rxjs';
import { HeaderConfigurationService } from '../../services/header-configuration.service';
import { FieldDefinitionService } from '../../services/field-definition.service';
import { TypificationService } from '../../services/typification.service';
import { PortfolioService } from '../../services/portfolio.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../shared/services/toast.service';
import { BotonDirective } from '../../../shared/ui/boton.directive';
import { PageHeaderComponent } from '../../../shared/ui/page-header.component';
import { EtiquetaSubcartera, PanelSubcarterasComponent, SubcarteraPanel } from '../../../shared/ui/panel-subcarteras.component';
import { TarjetaDirective } from '../../../shared/ui/tarjeta.directive';
import { NombrePropioPipe } from '../../../shared/ui/nombre-propio.pipe';
import { ComboboxComponent, OpcionCombobox } from '../../../shared/ui/combobox.component';
import {
  DataType,
  HeaderAlias,
  HeaderConfiguration,
  HeaderConfigurationItem,
  ImportPreviewResult,
  LoadType,
  UpdateHeaderConfigurationRequest
} from '../../models/header-configuration.model';
import { FieldDefinition } from '../../models/field-definition.model';
import { SEPARADOR_ORIGEN, columnasOrigen, origenLegible } from '../../../shared/utils/cabecera-derivada';
import { TUI } from '../typification-ui';

/** Largo de la columna campo_origen de configuracion_cabeceras. */
const LARGO_MAX_ORIGEN = 100;

type Carga = Extract<LoadType, 'INICIAL' | 'ACTUALIZACION'>;

/** Una subcartera con su cliente y su cartera. */
interface Ambito {
  cliente: string;
  cartera: string;
  subId: number;
  subcartera: string;
}

/** Una cabecera tal como se edita. `clave` es su id en la base, o un número negativo si es nueva. */
interface Cabecera {
  clave: number;
  headerName: string;
  displayLabel: string;
  dataType: DataType;
  format: string;
  required: boolean;
  /** Dato del catálogo enlazado; 0 = ninguno. */
  fieldDefinitionId: number;
  sourceField: string;
  regexPattern: string;
  /** Otros nombres con que llega la columna, sin el principal. Sin leer ni tocar: undefined. */
  alias?: string[];
  nueva?: boolean;
  borrada?: boolean;
}

/** Una fila del archivo de configuración (una cabecera por fila). */
interface ColumnaArchivo {
  cabecera: HeaderConfigurationItem;
  codigoCampo: string;
  elegida: boolean;
}

const TIPOS: { valor: DataType; texto: string; grupo: string }[] = [
  { valor: 'TEXTO', texto: 'Texto', grupo: 'Textos' },
  { valor: 'NUMERICO', texto: 'Número', grupo: 'Números' },
  { valor: 'FECHA', texto: 'Fecha', grupo: 'Fechas' },
  { valor: 'BOOLEANO', texto: 'Sí / no', grupo: 'Sí / no' }
];
const FORMATO_EJEMPLO: Record<DataType, string> = { TEXTO: 'VARCHAR(100)', NUMERICO: 'DECIMAL(18,2)', FECHA: 'yyyyMMdd', BOOLEANO: '' };
const GRUPOS_DATO: { tabla: string; titulo: string }[] = [
  { tabla: 'clientes', titulo: 'Datos del cliente' },
  { tabla: 'metodos_contacto', titulo: 'Teléfonos y correos' },
  { tabla: '', titulo: 'Otros datos' }
];
const COLUMNAS_PLANTILLA = ['codigoCampo', 'nombreCabecera', 'etiquetaVisual', 'formato', 'tipoDato', 'obligatorio', 'campoAsociado', 'regEx'];
const EJEMPLO_PLANTILLA = [
  ['documento', 'DNI', 'Número de Documento', '', 'TEXTO', '1', '', ''],
  ['nombre_completo', 'NOMBRE', 'Nombre del Cliente', '', 'TEXTO', '1', '', ''],
  ['telefono_principal', 'TELEFONO', 'Teléfono Principal', '', 'TEXTO', '0', '', ''],
  ['email', 'CORREO', 'Correo Electrónico', '', 'TEXTO', '0', '', ''],
  ['monto_capital', 'MONTO_CAPITAL', 'Monto Capital (S/.)', 'decimal(18,2)', 'NUMERICO', '1', '', ''],
  ['fecha_vencimiento', 'FEC_VENC', 'Fecha de Vencimiento', 'dd/MM/yyyy', 'FECHA', '1', '', ''],
  ['', 'DOCUMENTO_EXTRAIDO', 'Documento Extraído', '', 'TEXTO', '0', 'DNI', '^D.*?(\\d{7})$|^C.*?(\\d{8})$']
];
const SEPARADORES = [
  { valor: ';', nombre: 'Punto y coma', muestra: ';', archivo: 'punto-coma' },
  { valor: ',', nombre: 'Coma', muestra: ',', archivo: 'coma' },
  { valor: '|', nombre: 'Pipe', muestra: '|', archivo: 'pipe' },
  { valor: '\t', nombre: 'Tabulación', muestra: 'Tab', archivo: 'tab' }
];

/** Sin tildes ni mayúsculas ni signos, para comparar nombres de columna. */
const clave = (s: string | null | undefined) => (s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
/** Nombre de la columna en la tabla de la subcartera; misma regla que SqlSanitizer.headerToColumnName. */
const columnaEnTabla = (s: string) => (s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()
  .replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
const mismosAlias = (a: string[], b: string[]) => a.length === b.length && a.every((x, i) => x === b[i]);

/**
 * Configuración de cabeceras por subcartera: las columnas que trae cada carga, cómo se ven y a qué dato
 * del sistema corresponden (lo que usan los filtros de campañas, la ficha y las reglas).
 *
 * Misma forma que Umbrales de estado y Tipificaciones: se edita en la lista y nada se envía hasta
 * «Guardar cambios». Crear un dato del catálogo se aplica al momento, porque vale para todas las carteras.
 */
@Component({
  selector: 'app-header-configuration',
  standalone: true,
  imports: [
    NgClass, A11yModule, CdkOverlayOrigin, CdkConnectedOverlay, LucideAngularModule,
    PageHeaderComponent, PanelSubcarterasComponent, TarjetaDirective, BotonDirective, NombrePropioPipe, ComboboxComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header-configuration.component.html',
  host: { class: 'cashi-pantalla @container/cab flex min-h-0 flex-1 flex-col gap-3' }
})
export class HeaderConfigurationComponent implements OnInit {
  private readonly cabeceras = inject(HeaderConfigurationService);
  private readonly definicionesApi = inject(FieldDefinitionService);
  private readonly clientesApi = inject(TypificationService);
  private readonly carterasApi = inject(PortfolioService);
  private readonly auth = inject(AuthService);
  private readonly avisos = inject(ToastService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly nombrePropio = new NombrePropioPipe();

  readonly ui = TUI;
  readonly TIPOS = TIPOS;
  readonly SEPARADORES = SEPARADORES;
  readonly FORMATO_EJEMPLO = FORMATO_EJEMPLO;
  readonly origenLegible = origenLegible;
  readonly columnaEnTabla = columnaEnTabla;

  /**
   * Columnas de la cabecera y de cada fila: cabecera, revertir, tipo, formato, dato del sistema, obligatoria y
   * editar. Con menos ancho se van el formato y luego el tipo y revertir.
   */
  readonly REJILLA = 'grid grid-cols-[minmax(0,1fr)_10rem_3.5rem_1.75rem] items-center gap-x-[clamp(.5rem,2cqw,1.25rem)] px-2 '
    + '@min-[44rem]/tabla:grid-cols-[minmax(0,1fr)_auto_5.25rem_12rem_4.5rem_1.75rem] '
    + '@min-[50rem]/tabla:grid-cols-[minmax(0,1fr)_auto_5.25rem_6.5rem_13.5rem_4.5rem_1.75rem]';
  readonly LISTA = 'font-cashi m-0! h-auto! w-full rounded-[.625rem]! border! border-(--campo-ln)! bg-(--campo)! px-2.5! py-2! text-[.875rem]! leading-[1.5]! text-ellipsis text-foreground! outline-none '
    + 'focus:border-ring! focus:shadow-[0_0_0_3px_rgb(16_185_129/.3)] disabled:opacity-60';
  /** El tema antiguo fija con !important el aspecto de los campos: de ahí los `!`. */
  readonly CAMPO = 'font-cashi m-0! w-full min-w-0 rounded-[.625rem]! border! border-(--campo-ln)! bg-(--campo)! px-3! py-2! text-[.875rem]! leading-[1.5]! text-foreground! outline-none '
    + 'placeholder:text-muted-foreground focus:border-ring! focus:shadow-[0_0_0_3px_rgb(16_185_129/.3)] disabled:opacity-60';
  /** Campos del editor y del modal: todos de 2.5rem, igual que el buscador del dato del sistema. */
  readonly CAMPO_ED = 'font-cashi m-0! h-10! w-full min-w-0 rounded-[.625rem]! border! border-(--campo-ln)! bg-(--campo)! px-3! py-0! text-[.875rem]! leading-[1.5]! text-foreground! outline-none '
    + 'placeholder:text-muted-foreground focus:border-ring! focus:shadow-[0_0_0_3px_rgb(16_185_129/.3)] disabled:opacity-60';
  readonly LISTA_ED = 'font-cashi m-0! h-10! min-w-0 rounded-[.625rem]! border! border-(--campo-ln)! bg-(--campo)! px-2.5! py-0! text-[.875rem]! leading-[1.5]! text-ellipsis text-foreground! outline-none '
    + 'focus:border-ring! focus:shadow-[0_0_0_3px_rgb(16_185_129/.3)] disabled:opacity-60';
  readonly ETIQUETA = 'm-0! text-[.75rem]! leading-[1.5]! font-medium! text-foreground/80!';
  readonly AYUDA = 'text-[.75rem] text-muted-foreground';
  readonly INTERRUPTOR = "relative block h-[1.125rem] w-8 flex-none cursor-pointer justify-self-center rounded-full border-0! p-0! transition-colors duration-150 after:absolute after:top-0.5 after:left-0.5 after:size-3.5 after:rounded-full after:bg-white after:shadow-[0_1px_2px_rgb(0_0_0/.25)] after:transition-transform after:duration-150 after:content-[''] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-default disabled:opacity-50";
  readonly ICONO = 'grid size-7 flex-none cursor-pointer place-items-center rounded-lg border-0! bg-transparent p-0! text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground '
    + 'aria-expanded:bg-muted aria-expanded:text-foreground focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring';
  readonly PILL = 'rounded-full px-2.5 py-0.5 text-[.75rem] font-medium whitespace-nowrap text-muted-foreground shadow-[inset_0_0_0_1px_var(--border)]';
  readonly CHIP = 'flex-none self-center rounded-full px-[.5625rem] py-[.1875rem] text-[.75rem] font-medium whitespace-nowrap text-muted-foreground shadow-[inset_0_0_0_1px_var(--border)]';
  readonly FICHA = 'inline-flex items-center gap-1 rounded-md bg-muted py-[.1875rem] pr-1 pl-2 font-mono text-[.75rem] text-foreground';
  readonly FICHA_X = 'grid size-4 cursor-pointer place-items-center rounded border-0! bg-transparent p-0! text-muted-foreground hover:text-(--ro)';
  readonly PESTANA = 'font-cashi cursor-pointer rounded-md border-0 px-1.5 py-[.4375rem] text-[.875rem] font-medium transition-colors duration-150';
  readonly PESTANA_ACTIVA = 'bg-(--seg-activo) text-foreground shadow-[0_1px_2px_rgb(0_0_0/.08)]';
  readonly PESTANA_REPOSO = 'bg-transparent text-foreground/60';
  readonly OPCION_MENU = 'font-cashi m-0! flex w-full cursor-pointer items-center gap-2 rounded-[.25rem] border-0! bg-transparent! px-2! py-1.5! text-left text-[.875rem] text-foreground! hover:bg-muted!';
  readonly POSICIONES_MENU: ConnectedPosition[] = [
    { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -4 },
    { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 4 }
  ];

  readonly cargando = signal(true);
  readonly error = signal<string | null>(null);
  readonly guardando = signal(false);

  readonly ambito = signal<Ambito[]>([]);
  readonly sub = signal<number | null>(null);
  readonly carga = signal<Carga>('INICIAL');
  readonly buscar = signal('');
  readonly definiciones = signal<FieldDefinition[]>([]);
  /** Cabeceras guardadas por subcartera (las dos cargas); null si no se pudieron leer. */
  private readonly base = signal<Record<number, HeaderConfiguration[] | null>>({});
  /** Lo editado sin guardar, por subcartera y carga. Lo que no está, no cambió. */
  private readonly trabajo = signal<Record<string, Cabecera[]>>({});
  private readonly aliasBase = signal<Record<number, HeaderAlias[]>>({});
  /** Grupos desplegados (por tipo de dato) en la lista a la vista; al entrar, todos cerrados salvo las nuevas. */
  private readonly desplegados = signal<string[]>([]);
  /** Cabecera con la edición abierta debajo de su fila. */
  readonly abierta = signal<number | null>(null);
  /** Cambia cuando hay que volver a crear los campos de texto: solo toman el valor al nacer. */
  readonly version = signal(0);
  private siguienteClave = -1;

  // ---------------------------------------------------------------- Diálogos
  /** Cabecera nueva en el modal: una que se está agregando o una nueva aún sin guardar que se edita. */
  readonly form = signal<Cabecera | null>(null);
  readonly formEsNueva = signal(true);
  readonly menuPlantilla = signal(false);
  readonly confirmarBorrado = signal<Cabecera[] | null>(null);
  /** Dato nuevo del catálogo que se está creando desde el buscador de una fila. */
  readonly datoNuevo = signal<{ fila: number; nombre: string; tipo: DataType } | null>(null);
  readonly creandoDato = signal(false);
  readonly separador = signal(';');
  readonly archivoCsv = signal<File | null>(null);
  readonly nombreArchivo = signal('');
  readonly columnasArchivo = signal<ColumnaArchivo[] | null>(null);
  readonly copiar = signal(false);
  readonly copiarOrigen = signal(0);
  readonly copiarVista = signal<ImportPreviewResult | null>(null);
  readonly copiarCargando = signal(false);

  // ---------------------------------------------------------------- Derivados
  readonly actual = computed(() => this.ambito().find(a => a.subId === this.sub()) ?? null);
  readonly clientes = computed(() => [...new Set(this.ambito().map(a => a.cliente))]);
  readonly carteras = computed(() => [...new Set(this.ambito().filter(a => a.cliente === this.actual()?.cliente).map(a => a.cartera))]);
  readonly deLaCartera = computed(() => this.ambito().filter(a => a.cliente === this.actual()?.cliente && a.cartera === this.actual()?.cartera));
  readonly panelSubs = computed<SubcarteraPanel[]>(() => this.ambito().map(a => ({ id: a.subId, cliente: a.cliente, cartera: a.cartera, subcartera: a.subcartera })));
  readonly etiquetasPanel = computed(() => {
    const etiquetas: Record<number, EtiquetaSubcartera> = {};
    for (const a of this.ambito()) {
      if (!this.base()[a.subId]) continue;
      const n = this.filasDe(a.subId, this.carga()).filter(c => !c.borrada).length;
      etiquetas[a.subId] = { texto: `${n} ${n === 1 ? 'cabecera' : 'cabeceras'}`, tono: 'neutra' };
    }
    return etiquetas;
  });
  /** La subcartera elegida no se pudo leer. */
  readonly sinDatos = computed(() => {
    const id = this.sub();
    return !!id && !this.cargando() && this.base()[id] === null;
  });

  /** Cabeceras de la subcartera y carga a la vista, con lo editado. */
  readonly filas = computed(() => {
    const id = this.sub();
    return id ? this.filasDe(id, this.carga()) : [];
  });
  readonly cuenta = computed(() => {
    const id = this.sub();
    const n = (k: Carga) => (id ? this.filasDe(id, k).filter(c => !c.borrada).length : 0);
    return { INICIAL: n('INICIAL'), ACTUALIZACION: n('ACTUALIZACION') };
  });
  readonly visibles = computed(() => {
    const q = clave(this.buscar());
    if (!q) return this.filas();
    return this.filas().filter(c => clave(c.headerName).includes(q) || clave(c.displayLabel).includes(q)
      || clave(this.definicion(c.fieldDefinitionId)?.fieldName).includes(q));
  });
  /** Las nuevas arriba; las demás, por tipo de dato. */
  readonly grupos = computed(() => {
    const filas = this.visibles(), desplegados = this.desplegados(), buscando = !!this.buscar().trim();
    const grupos = [
      { clave: 'NUEVA', titulo: 'Nuevas', filas: filas.filter(c => c.nueva) },
      ...TIPOS.map(t => ({ clave: t.valor as string, titulo: t.grupo, filas: filas.filter(c => !c.nueva && c.dataType === t.valor) }))
    ];
    // Un tipo que no esté en la lista (por ejemplo, uno escrito a mano en la base) no se pierde.
    const otras = filas.filter(c => !c.nueva && !TIPOS.some(t => t.valor === c.dataType));
    if (otras.length) grupos.push({ clave: 'OTRO', titulo: 'Otros tipos', filas: otras });
    return grupos.filter(g => g.filas.length).map(g => ({
      ...g,
      abierto: buscando || g.clave === 'NUEVA' || desplegados.includes(g.clave),
      enlazadas: g.filas.filter(c => c.fieldDefinitionId).length
    }));
  });

  /** Opciones del buscador del dato del sistema, sin lo que depende de la fila. */
  private readonly opcionesBase = computed(() => {
    const definiciones = [...this.definiciones()].sort((a, b) => this.nombreDato(a).localeCompare(this.nombreDato(b), 'es'));
    const grupo = (d: FieldDefinition) => GRUPOS_DATO.find(g => g.tabla && g.tabla === d.associatedTable)?.tabla ?? '';
    return GRUPOS_DATO.flatMap(g => definiciones
      .filter(d => grupo(d) === g.tabla)
      .map(d => ({ valor: String(d.id), etiqueta: this.nombreDato(d), ayuda: this.tipoTexto(d.dataType), grupo: g.titulo } as OpcionCombobox)));
  });
  /** Opciones por fila: los datos que ya usa otra cabecera de la misma carga van deshabilitados. */
  readonly opcionesPorFila = computed(() => {
    const filas = this.filas().filter(c => !c.borrada), resultado = new Map<number, OpcionCombobox[]>();
    for (const c of filas) resultado.set(c.clave, this.opcionesPara(c, filas));
    return resultado;
  });
  readonly opcionesForm = computed(() => {
    const f = this.form();
    return f ? this.opcionesPara(f, this.filas().filter(c => !c.borrada)) : [];
  });

  /** Lo que falta para agregar la cabecera del modal; la primera se muestra al pie. */
  readonly problemasForm = computed(() => {
    const f = this.form();
    if (!f) return [];
    const mal: string[] = [], origenes = columnasOrigen(f.sourceField);
    if (!f.headerName.trim()) mal.push('Escribe el nombre de la columna');
    else if (!columnaEnTabla(f.headerName)) mal.push('El nombre no sirve como columna');
    else if (this.filas().some(x => x.clave !== f.clave && !x.borrada && columnaEnTabla(x.headerName) === columnaEnTabla(f.headerName))) {
      mal.push(`La columna ${f.headerName} ya existe en esta carga`);
    }
    if (!f.displayLabel.trim()) mal.push('Escribe la etiqueta visual');
    if (origenes.length === 1 && !f.regexPattern.trim()) mal.push('Con una sola columna de origen, el regex es obligatorio');
    if (f.sourceField.length > LARGO_MAX_ORIGEN) mal.push(`Las columnas de origen pasan de ${LARGO_MAX_ORIGEN} caracteres`);
    return mal;
  });

  readonly cambios = computed(() => {
    let n = 0;
    for (const [k, filas] of Object.entries(this.trabajo())) {
      const originales = this.originalesPorClave(k);
      n += filas.filter(c => this.distinta(c, originales.get(c.clave))).length;
    }
    return n;
  });
  readonly problemas = computed(() => {
    const mal: string[] = [];
    for (const filas of Object.values(this.trabajo())) {
      const vivas = filas.filter(c => !c.borrada);
      for (const c of vivas) {
        const nombre = c.headerName || 'una cabecera nueva';
        if (c.nueva && !c.headerName.trim()) mal.push('Falta el nombre de una cabecera nueva');
        else if (c.nueva && !columnaEnTabla(c.headerName)) mal.push(`El nombre ${c.headerName} no sirve como columna`);
        if (!c.displayLabel.trim()) mal.push(`Falta la etiqueta de ${nombre}`);
        if (c.nueva && c.headerName.trim() && vivas.some(x => x !== c && columnaEnTabla(x.headerName) === columnaEnTabla(c.headerName))) {
          mal.push(`La columna ${c.headerName} ya existe en esta carga`);
        }
        if (columnasOrigen(c.sourceField).length === 1 && !c.regexPattern.trim()) mal.push(`Falta el regex de ${nombre}`);
        if (c.nueva && c.sourceField.length > LARGO_MAX_ORIGEN) mal.push(`Las columnas de origen de ${nombre} pasan de ${LARGO_MAX_ORIGEN} caracteres`);
      }
    }
    return [...new Set(mal)];
  });
  readonly resumen = computed(() => {
    const n = this.cambios(), mal = this.problemas();
    return mal.length ? mal[0] : n === 0 ? 'Sin cambios' : n === 1 ? '1 cambio sin guardar' : `${n} cambios sin guardar`;
  });

  ngOnInit(): void {
    this.cargarAmbito();
  }

  // ---------------------------------------------------------------- Carga

  /**
   * Clientes y subcarteras activos, el catálogo de datos y las cabeceras de cada subcartera. El servicio manda
   * `isActive` como 0/1. La marca de la cartera no se mira: hay carteras en uso marcadas como inactivas.
   */
  cargarAmbito(): void {
    this.cargando.set(true);
    this.error.set(null);
    const activo = (v: unknown) => Number(v) !== 0;
    forkJoin({
      clientes: this.clientesApi.getAllTenants(),
      subs: this.carterasApi.getAllSubPortfolios(),
      definiciones: this.definicionesApi.getAllActive().pipe(catchError(() => of([] as FieldDefinition[])))
    }).pipe(
      switchMap(({ clientes, subs, definiciones }) => {
        const activos = clientes.filter(c => activo(c.isActive));
        const carteras$ = activos.map(c => this.carterasApi.getPortfoliosByTenant(c.id).pipe(catchError(() => of([]))));
        return (carteras$.length ? forkJoin(carteras$) : of([])).pipe(map(porCliente => ({ activos, porCliente, subs, definiciones })));
      })
    ).subscribe({
      next: ({ activos, porCliente, subs, definiciones }) => {
        const ambito: Ambito[] = [];
        activos.forEach((c, i) => (porCliente[i] ?? []).forEach(p => subs
          .filter(s => s.portfolioId === p.id && activo(s.isActive))
          .forEach(s => ambito.push({ cliente: c.tenantName, cartera: p.portfolioName, subId: s.id, subcartera: s.subPortfolioName }))));
        this.ambito.set(ambito);
        this.definiciones.set(definiciones);
        if (!ambito.length) {
          this.cargando.set(false);
          return;
        }
        this.leerCabeceras(ambito.map(a => a.subId), () => {
          const conCabeceras = ambito.find(a => this.base()[a.subId]?.length);
          this.sub.set((conCabeceras ?? ambito[0]).subId);
        });
      },
      error: () => {
        this.error.set('No se pudieron cargar las subcarteras');
        this.cargando.set(false);
      }
    });
  }

  private leerCabeceras(ids: number[], luego?: () => void): void {
    this.cargando.set(true);
    forkJoin(ids.map(id => this.cabeceras.getBySubPortfolio(id).pipe(
      catchError(e => of(e?.status === 404 ? [] : null))
    ))).subscribe(listas => {
      this.base.update(b => {
        const nueva = { ...b };
        ids.forEach((id, i) => (nueva[id] = listas[i]));
        return nueva;
      });
      this.cargando.set(false);
      luego?.();
    });
  }

  reintentar(): void {
    const id = this.sub();
    if (this.error() || !id) {
      this.cargarAmbito();
    } else {
      this.leerCabeceras([id]);
    }
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
    this.sub.set(Number(id));
    this.abierta.set(null);
    this.buscar.set('');
    this.desplegados.set([]);
    this.version.update(v => v + 1);
  }

  elegirCarga(carga: Carga): void {
    this.carga.set(carga);
    this.desplegados.set([]);
    this.abierta.set(null);
    this.version.update(v => v + 1);
  }

  escribirBusqueda(texto: string): void {
    this.buscar.set(texto);
    this.abierta.set(null);
  }

  alternarGrupo(claveGrupo: string): void {
    if (claveGrupo === 'NUEVA') return;
    this.desplegados.update(d => d.includes(claveGrupo) ? d.filter(x => x !== claveGrupo) : [...d, claveGrupo]);
  }

  // ---------------------------------------------------------------- Lectura de filas

  private llave(sub: number, carga: LoadType): string {
    return `${sub}:${carga}`;
  }

  private originales(sub: number, carga: LoadType): Cabecera[] {
    return (this.base()[sub] ?? []).filter(h => h.loadType === carga).map(h => ({
      clave: h.id,
      headerName: h.headerName,
      displayLabel: h.displayLabel ?? '',
      dataType: h.dataType,
      format: h.format ?? '',
      required: !!h.required,
      fieldDefinitionId: h.fieldDefinitionId || 0,
      sourceField: h.sourceField ?? '',
      regexPattern: h.regexPattern ?? ''
    }));
  }

  private originalesPorClave(k: string): Map<number, Cabecera> {
    const [sub, carga] = k.split(':');
    return new Map(this.originales(Number(sub), carga as LoadType).map(o => [o.clave, o]));
  }

  private filasDe(sub: number, carga: LoadType): Cabecera[] {
    return this.trabajo()[this.llave(sub, carga)] ?? this.originales(sub, carga);
  }

  private aliasOriginales(id: number): string[] {
    return (this.aliasBase()[id] ?? []).filter(a => !a.isPrincipal).map(a => a.alias);
  }

  private distinta(c: Cabecera, o: Cabecera | undefined): boolean {
    if (c.nueva || c.borrada || !o) return !(c.nueva && c.borrada);
    return c.displayLabel.trim() !== o.displayLabel.trim()
      || c.format.trim() !== o.format.trim()
      || c.required !== o.required
      || c.fieldDefinitionId !== o.fieldDefinitionId
      || c.regexPattern.trim() !== o.regexPattern.trim()
      || (c.alias !== undefined && !mismosAlias(c.alias, this.aliasOriginales(c.clave)));
  }

  cambiada(c: Cabecera): boolean {
    const id = this.sub();
    if (!id || c.nueva) return false;
    return this.distinta(c, this.originales(id, this.carga()).find(o => o.clave === c.clave));
  }

  /** Alias a la vista; null mientras no se hayan leído. */
  aliasDe(c: Cabecera): string[] | null {
    if (c.alias) return c.alias;
    if (c.nueva) return [];
    return this.aliasBase()[c.clave] ? this.aliasOriginales(c.clave) : null;
  }

  definicion(id: number): FieldDefinition | undefined {
    return id ? this.definiciones().find(d => d.id === id) : undefined;
  }

  nombreDato(d: FieldDefinition): string {
    return this.nombrePropio.transform(d.fieldName);
  }

  tipoTexto(tipo: string): string {
    return TIPOS.find(t => t.valor === tipo)?.texto ?? this.nombrePropio.transform(tipo);
  }

  /** Parte del id de los campos del editor: las nuevas tienen clave negativa. */
  idDom(c: Cabecera): string {
    return c.clave < 0 ? `n${-c.clave}` : String(c.clave);
  }

  valorDato(c: Cabecera): string | null {
    return c.fieldDefinitionId ? String(c.fieldDefinitionId) : null;
  }

  /** Columnas del archivo que pueden armar una cabecera nueva: las que vienen tal cual. */
  columnasParaOrigen(c: Cabecera): string[] {
    const elegidas = columnasOrigen(c.sourceField);
    return this.filas().filter(x => x !== c && !x.borrada && !x.nueva && !columnasOrigen(x.sourceField).length && x.headerName
      && !elegidas.includes(x.headerName)).map(x => x.headerName);
  }

  origenes(c: Cabecera): string[] {
    return columnasOrigen(c.sourceField);
  }

  private opcionesPara(c: Cabecera, vivas: Cabecera[]): OpcionCombobox[] {
    const usados = new Map(vivas.filter(x => x.clave !== c.clave && x.fieldDefinitionId).map(x => [String(x.fieldDefinitionId), x.headerName || 'una cabecera nueva']));
    const propias = this.opcionesBase().map(o => usados.has(o.valor) ? { ...o, deshabilitada: true, ayuda: 'en ' + usados.get(o.valor) } : o);
    const sugeridas = this.sugeridos(c).filter(d => !usados.has(String(d.id)) && d.id !== c.fieldDefinitionId)
      .map(d => ({ valor: String(d.id), etiqueta: this.nombreDato(d), ayuda: this.tipoTexto(d.dataType), grupo: 'Sugerido por el nombre', sugerida: true }));
    const quitar: OpcionCombobox[] = c.fieldDefinitionId ? [{ valor: '0', etiqueta: 'Sin dato del sistema' }] : [];
    return [...quitar, ...sugeridas, ...propias];
  }

  /** Datos del catálogo que se parecen al nombre o a la etiqueta de la cabecera. */
  private sugeridos(c: Cabecera): FieldDefinition[] {
    const n = clave(c.headerName), e = clave(c.displayLabel);
    if (!n && !e) return [];
    return this.definiciones().filter(d => {
      const cod = clave(d.fieldCode), nom = clave(d.fieldName);
      return (n && (cod === n || nom === n || (n.length > 4 && (cod.includes(n) || (cod.length > 4 && n.includes(cod))))))
        || (e && (nom === e || cod === e));
    }).slice(0, 3);
  }

  // ---------------------------------------------------------------- Edición

  /** Cambia la cabecera del modal si es esa; si no, la fila de la lista. */
  private cambiar(c: Cabecera, cambios: Partial<Cabecera>): void {
    if (this.form()?.clave === c.clave) {
      this.form.update(f => f ? { ...f, ...cambios } : f);
      return;
    }
    const id = this.sub();
    if (!id) return;
    const k = this.llave(id, this.carga());
    const filas = this.filasDe(id, this.carga()).map(x => x.clave === c.clave ? { ...x, ...cambios } : x);
    this.trabajo.update(t => ({ ...t, [k]: filas }));
  }

  editar(c: Cabecera): void {
    if (c.nueva) {
      this.formEsNueva.set(false);
      this.form.set({ ...c, alias: [...(c.alias ?? [])] });
      return;
    }
    const abrir = this.abierta() !== c.clave;
    this.abierta.set(abrir ? c.clave : null);
    if (abrir && !c.nueva && !this.aliasBase()[c.clave]) {
      this.cabeceras.getAliases(c.clave).pipe(catchError(() => of([] as HeaderAlias[])))
        .subscribe(alias => this.aliasBase.update(a => ({ ...a, [c.clave]: alias })));
    }
  }

  escribir(c: Cabecera, campo: 'displayLabel' | 'format' | 'regexPattern', valor: string): void {
    this.cambiar(c, { [campo]: valor });
  }

  escribirNombre(c: Cabecera, valor: string): void {
    this.cambiar(c, { headerName: valor.trim().toUpperCase().replace(/\s+/g, '_') });
  }

  elegirTipo(c: Cabecera, tipo: DataType): void {
    this.cambiar(c, { dataType: tipo });
  }

  alternarObligatoria(c: Cabecera): void {
    this.cambiar(c, { required: !c.required });
  }

  elegirDato(c: Cabecera, valor: string): void {
    this.cambiar(c, { fieldDefinitionId: Number(valor) || 0 });
  }

  agregarAlias(c: Cabecera, campo: HTMLInputElement): void {
    const alias = campo.value.trim(), actuales = this.aliasDe(c) ?? [];
    if (!alias) return;
    if (clave(alias) === clave(c.headerName) || actuales.some(a => clave(a) === clave(alias))) {
      this.avisos.warning(`«${alias}» ya es un nombre de esta cabecera`);
      return;
    }
    this.cambiar(c, { alias: [...actuales, alias] });
    campo.value = '';
  }

  quitarAlias(c: Cabecera, alias: string): void {
    this.cambiar(c, { alias: (this.aliasDe(c) ?? []).filter(a => a !== alias) });
  }

  agregarOrigen(c: Cabecera, columna: string): void {
    if (!columna) return;
    this.cambiar(c, { sourceField: [...this.origenes(c), columna].join(SEPARADOR_ORIGEN) });
  }

  quitarOrigen(c: Cabecera, columna: string): void {
    const quedan = this.origenes(c).filter(x => x !== columna);
    this.cambiar(c, { sourceField: quedan.join(SEPARADOR_ORIGEN), regexPattern: quedan.length ? c.regexPattern : '' });
  }

  revertir(c: Cabecera): void {
    const id = this.sub();
    const o = id ? this.originales(id, this.carga()).find(x => x.clave === c.clave) : undefined;
    if (!o) return;
    this.cambiar(c, { ...o, alias: undefined, borrada: false });
    this.version.update(v => v + 1);
  }

  /** Una nueva se quita sin más; una guardada queda marcada y se elimina al guardar. */
  alternarBorrada(c: Cabecera): void {
    const id = this.sub();
    if (!id) return;
    if (c.nueva) {
      const k = this.llave(id, this.carga());
      this.trabajo.update(t => ({ ...t, [k]: this.filasDe(id, this.carga()).filter(x => x.clave !== c.clave) }));
      this.abierta.set(null);
      return;
    }
    this.cambiar(c, { borrada: !c.borrada });
    if (!c.borrada) this.abierta.set(null);
  }

  agregar(): void {
    this.formEsNueva.set(true);
    this.form.set({
      clave: this.siguienteClave--, headerName: '', displayLabel: '', dataType: 'TEXTO', format: '', required: false,
      fieldDefinitionId: 0, sourceField: '', regexPattern: '', alias: [], nueva: true
    });
  }

  /** Pasa la cabecera del modal a la lista, como nueva; se crea al guardar los cambios. */
  confirmarForm(): void {
    const f = this.form(), id = this.sub();
    if (!f || !id || this.problemasForm().length) return;
    const cabecera = { ...f, headerName: f.headerName.trim(), displayLabel: f.displayLabel.trim() };
    const filas = this.filasDe(id, this.carga()), k = this.llave(id, this.carga());
    const lista = filas.some(x => x.clave === f.clave) ? filas.map(x => x.clave === f.clave ? cabecera : x) : [cabecera, ...filas];
    this.trabajo.update(t => ({ ...t, [k]: lista }));
    this.form.set(null);
    this.buscar.set('');
  }

  /** Quita de la lista la cabecera nueva que se estaba editando en el modal. */
  quitarForm(): void {
    const f = this.form();
    this.form.set(null);
    const fila = f && this.filas().find(x => x.clave === f.clave);
    if (fila) this.alternarBorrada(fila);
  }

  descartar(): void {
    this.trabajo.set({});
    this.abierta.set(null);
    this.version.update(v => v + 1);
  }

  // ---------------------------------------------------------------- Dato nuevo del catálogo

  abrirDatoNuevo(c: Cabecera, texto: string): void {
    const nombre = texto.trim();
    this.datoNuevo.set({ fila: c.clave, nombre: nombre.charAt(0).toUpperCase() + nombre.slice(1), tipo: c.dataType });
  }

  async crearDato(nombre: string, tipo: DataType): Promise<void> {
    const pedido = this.datoNuevo();
    if (!pedido || !nombre.trim()) return;
    this.creandoDato.set(true);
    try {
      const creado = await firstValueFrom(this.definicionesApi.create(nombre.trim(), tipo));
      this.definiciones.update(d => [...d, creado]);
      const fila = this.form()?.clave === pedido.fila ? this.form() : this.filas().find(c => c.clave === pedido.fila);
      if (fila) this.cambiar(fila, { fieldDefinitionId: creado.id });
      this.datoNuevo.set(null);
      this.avisos.success(`Dato «${creado.fieldName}» agregado al catálogo`);
    } catch (e) {
      this.avisos.error(this.mensajeError(e));
    } finally {
      this.creandoDato.set(false);
    }
  }

  // ---------------------------------------------------------------- Guardar

  /** Eliminaciones pendientes, para confirmarlas antes de guardar. */
  private porBorrar(): Cabecera[] {
    return Object.values(this.trabajo()).flat().filter(c => c.borrada && !c.nueva);
  }

  async guardar(confirmado = false): Promise<void> {
    if (!this.cambios() || this.problemas().length || this.guardando()) return;
    const borrar = this.porBorrar();
    if (borrar.length && !confirmado) {
      this.confirmarBorrado.set(borrar);
      return;
    }
    this.confirmarBorrado.set(null);
    this.guardando.set(true);
    const errores: string[] = [], tocadas = new Set<number>(), n = this.cambios();
    const usuario = this.auth.getCurrentUser()?.username || 'system';

    try {
      for (const [k, filas] of Object.entries(this.trabajo())) {
        const [subTxt, carga] = k.split(':'), sub = Number(subTxt), originales = this.originalesPorClave(k);
        const cambiadas = filas.filter(c => this.distinta(c, originales.get(c.clave)));
        if (!cambiadas.length) continue;
        tocadas.add(sub);

        for (const c of cambiadas.filter(x => x.borrada && !x.nueva)) {
          await this.intentar(errores, c.headerName, this.cabeceras.delete(c.clave), true);
        }

        // Un dato que pasa de una cabecera a otra se suelta antes: el servidor no deja enlazarlo a dos.
        const actualizar = cambiadas.filter(x => !x.borrada && !x.nueva);
        for (const c of actualizar) {
          const o = originales.get(c.clave)!;
          const loTomaOtra = o.fieldDefinitionId && c.fieldDefinitionId !== o.fieldDefinitionId
            && filas.some(x => x !== c && !x.borrada && x.fieldDefinitionId === o.fieldDefinitionId);
          if (loTomaOtra) await this.intentar(errores, c.headerName, this.cabeceras.update(c.clave, { fieldDefinitionId: 0 }));
        }
        for (const c of actualizar) {
          const o = originales.get(c.clave)!, pedido: UpdateHeaderConfigurationRequest = {};
          if (c.displayLabel.trim() !== o.displayLabel.trim()) pedido.displayLabel = c.displayLabel.trim();
          if (c.format.trim() !== o.format.trim()) pedido.format = c.format.trim();
          if (c.required !== o.required) pedido.required = c.required;
          if (c.fieldDefinitionId !== o.fieldDefinitionId) pedido.fieldDefinitionId = c.fieldDefinitionId;
          if (c.regexPattern.trim() !== o.regexPattern.trim()) pedido.regexPattern = c.regexPattern.trim();
          if (Object.keys(pedido).length) await this.intentar(errores, c.headerName, this.cabeceras.update(c.clave, pedido));
          if (c.alias) await this.aplicarAlias(c.clave, c.headerName, c.alias, this.aliasBase()[c.clave] ?? [], usuario, errores);
        }

        const nuevas = cambiadas.filter(x => x.nueva && !x.borrada);
        if (nuevas.length) {
          try {
            const creadas = await firstValueFrom(this.cabeceras.createBulk({
              subPortfolioId: sub,
              loadType: carga as LoadType,
              headers: nuevas.map(c => ({
                fieldDefinitionId: c.fieldDefinitionId,
                headerName: c.headerName.trim(),
                dataType: c.dataType,
                displayLabel: c.displayLabel.trim(),
                format: c.format.trim() || undefined,
                required: c.required,
                sourceField: c.sourceField.trim() || undefined,
                regexPattern: c.regexPattern.trim() || undefined
              }))
            }));
            for (const c of nuevas.filter(x => x.alias?.length)) {
              const h = creadas.find(x => clave(x.headerName) === clave(c.headerName));
              if (h) await this.aplicarAlias(h.id, c.headerName, c.alias!, [], usuario, errores);
            }
          } catch (e) {
            errores.push(`Cabeceras nuevas: ${this.mensajeError(e)}`);
          }
        }
      }
    } finally {
      this.trabajo.set({});
      this.aliasBase.set({});
      this.abierta.set(null);
      this.version.update(v => v + 1);
      this.guardando.set(false);
      this.leerCabeceras([...tocadas]);
    }

    if (errores.length) {
      this.avisos.error(`No se guardó todo: ${errores.slice(0, 3).join(' · ')}${errores.length > 3 ? ` y ${errores.length - 3} más` : ''}`, 9000);
    } else {
      this.avisos.success(n === 1 ? '1 cambio guardado' : `${n} cambios guardados`);
    }
  }

  private async intentar(errores: string[], nombre: string, pedido: Observable<unknown>, ignorar404 = false): Promise<void> {
    try {
      await firstValueFrom(pedido, { defaultValue: null });
    } catch (e: any) {
      if (!(ignorar404 && e?.status === 404)) errores.push(`${nombre}: ${this.mensajeError(e)}`);
    }
  }

  private async aplicarAlias(id: number, nombre: string, quedan: string[], antes: HeaderAlias[], usuario: string, errores: string[]): Promise<void> {
    const previos = antes.filter(a => !a.isPrincipal);
    for (const a of previos.filter(a => !quedan.includes(a.alias))) {
      await this.intentar(errores, `${nombre} (alias ${a.alias})`, this.cabeceras.removeAlias(a.id, usuario), true);
    }
    for (const alias of quedan.filter(x => !previos.some(a => a.alias === x))) {
      await this.intentar(errores, `${nombre} (alias ${alias})`, this.cabeceras.addAlias(id, { alias, username: usuario }));
    }
  }

  // ---------------------------------------------------------------- Importar desde archivo

  elegirArchivo(entrada: HTMLInputElement): void {
    const archivo = entrada.files?.[0];
    entrada.value = '';
    if (!archivo) return;
    this.nombreArchivo.set(archivo.name);
    if (/\.xlsx?$/i.test(archivo.name)) {
      this.leerExcel(archivo);
    } else {
      this.archivoCsv.set(archivo);
    }
  }

  leerCsv(): void {
    const archivo = this.archivoCsv();
    if (!archivo) return;
    const lector = new FileReader();
    lector.onload = () => {
      const filas = String(lector.result ?? '').replace(/^﻿/, '').split(/\r?\n/).filter(l => l.trim())
        .map(l => this.partirLineaCsv(l, this.separador()));
      this.leerFilasConfiguracion(filas);
    };
    lector.readAsText(archivo);
    this.archivoCsv.set(null);
  }

  private leerExcel(archivo: File): void {
    const lector = new FileReader();
    lector.onload = async () => {
      try {
        const XLSX = await this.libreriaExcel();
        const libro = XLSX.read(new Uint8Array(lector.result as ArrayBuffer), { type: 'array' });
        const filas = XLSX.utils.sheet_to_json(libro.Sheets[libro.SheetNames[0]], { header: 1, defval: '' }) as unknown[][];
        this.leerFilasConfiguracion(filas.map(f => f.map(v => String(v ?? ''))));
      } catch {
        this.avisos.error('No se pudo leer el Excel: revisa que tenga una cabecera por fila');
      }
    };
    lector.readAsArrayBuffer(archivo);
  }

  /** SheetJS se carga solo cuando hace falta. */
  private libreriaExcel(): Promise<any> {
    const w = window as any;
    if (w.XLSX) return Promise.resolve(w.XLSX);
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.sheetjs.com/xlsx-0.20.1/package/dist/xlsx.full.min.js';
      script.onload = () => resolve(w.XLSX);
      script.onerror = () => reject(new Error('No se pudo cargar la librería XLSX'));
      document.head.appendChild(script);
    });
  }

  /** Una línea CSV; el separador dentro de comillas no corta el campo («DECIMAL(10,2)»). */
  private partirLineaCsv(linea: string, separador: string): string[] {
    const campos: string[] = [];
    let actual = '', entreComillas = false;
    for (let i = 0; i < linea.length; i++) {
      const ch = linea[i];
      if (ch === '"') {
        if (entreComillas && linea[i + 1] === '"') {
          actual += '"';
          i++;
        } else {
          entreComillas = !entreComillas;
        }
      } else if (ch === separador && !entreComillas) {
        campos.push(actual.trim());
        actual = '';
      } else {
        actual += ch;
      }
    }
    campos.push(actual.trim());
    return campos;
  }

  /**
   * El archivo de configuración trae una cabecera por fila (no es un archivo de cartera, donde la primera fila
   * son las columnas de datos).
   */
  private leerFilasConfiguracion(filas: string[][]): void {
    if (filas.length < 2) {
      this.avisos.error('El archivo debe tener una fila de títulos y al menos una cabecera');
      return;
    }
    const indices = new Map<string, number>();
    filas[0].forEach((nombre, i) => indices.set(clave(nombre), i));
    const col = (fila: string[], ...nombres: string[]) => {
      const i = nombres.map(n => indices.get(clave(n))).find((x): x is number => x !== undefined);
      return i === undefined ? '' : (fila[i] || '').trim();
    };

    const leidas: ColumnaArchivo[] = [], errores: string[] = [], vistos = new Set<string>();
    filas.slice(1).forEach((fila, i) => {
      const linea = i + 2;
      const headerName = col(fila, 'nombreCabecera', 'headerName');
      const displayLabel = col(fila, 'etiquetaVisual', 'displayLabel');
      const dataType = col(fila, 'tipoDato', 'dataType').toUpperCase() as DataType;
      const codigoCampo = col(fila, 'codigoCampo', 'fieldCode');
      const sourceField = col(fila, 'campoAsociado', 'sourceField');
      const regexPattern = col(fila, 'regEx', 'regexPattern');
      if (!headerName && !displayLabel && !dataType) return;
      if (!headerName || !displayLabel || !TIPOS.some(t => t.valor === dataType)) {
        errores.push(`Fila ${linea}: nombre, etiqueta y tipo de dato válido son obligatorios`);
        return;
      }
      const origenes = columnasOrigen(sourceField);
      if ((origenes.length === 1 && !regexPattern) || (!origenes.length && regexPattern)) {
        errores.push(`Fila ${linea}: con un campo asociado el regex es obligatorio, y un regex necesita campo asociado`);
        return;
      }
      if (sourceField.length > LARGO_MAX_ORIGEN) {
        errores.push(`Fila ${linea}: el campo asociado pasa de ${LARGO_MAX_ORIGEN} caracteres`);
        return;
      }
      if (vistos.has(clave(headerName))) {
        errores.push(`Fila ${linea}: la cabecera ${headerName} está repetida en el archivo`);
        return;
      }
      vistos.add(clave(headerName));
      const definicion = codigoCampo ? this.definiciones().find(d => clave(d.fieldCode) === clave(codigoCampo)) : undefined;
      if (codigoCampo && !definicion) {
        errores.push(`Fila ${linea}: el código de campo ${codigoCampo} no existe en el catálogo`);
        return;
      }
      leidas.push({
        codigoCampo: definicion ? this.nombreDato(definicion) : '',
        elegida: true,
        cabecera: {
          fieldDefinitionId: definicion?.id ?? 0,
          headerName,
          dataType,
          displayLabel,
          format: col(fila, 'formato', 'format') || undefined,
          required: ['1', 'true', 'si', 'sí'].includes(col(fila, 'obligatorio', 'required').toLowerCase()),
          sourceField: sourceField || undefined,
          regexPattern: regexPattern || undefined
        }
      });
    });

    if (errores.length) {
      this.avisos.error(`Archivo inválido. ${errores.slice(0, 3).join(' · ')}`, 9000);
      return;
    }
    const existentes = new Set(this.filas().filter(c => !c.borrada).map(c => clave(c.headerName)));
    const nuevas = leidas.filter(c => !existentes.has(clave(c.cabecera.headerName)));
    if (!nuevas.length) {
      this.avisos.info(leidas.length ? 'Todas las cabeceras del archivo ya están en esta carga' : 'El archivo no trae cabeceras');
      return;
    }
    this.columnasArchivo.set(nuevas);
  }

  alternarColumnaArchivo(i: number): void {
    this.columnasArchivo.update(l => l?.map((c, j) => j === i ? { ...c, elegida: !c.elegida } : c) ?? null);
  }

  marcarColumnasArchivo(elegida: boolean): void {
    this.columnasArchivo.update(l => l?.map(c => ({ ...c, elegida })) ?? null);
  }

  get columnasElegidas(): number {
    return this.columnasArchivo()?.filter(c => c.elegida).length ?? 0;
  }

  agregarDelArchivo(): void {
    const elegidas = (this.columnasArchivo() ?? []).filter(c => c.elegida).map(c => c.cabecera);
    this.columnasArchivo.set(null);
    this.sumarNuevas(elegidas);
  }

  /** Cabeceras que llegan de un archivo o de otra subcartera: se suman como nuevas, sin las que ya están. */
  private sumarNuevas(cabeceras: HeaderConfigurationItem[]): void {
    const id = this.sub();
    if (!id || !cabeceras.length) return;
    const actuales = this.filasDe(id, this.carga()), usados = new Set(actuales.filter(c => !c.borrada).map(c => c.fieldDefinitionId).filter(Boolean));
    const nombres = new Set(actuales.filter(c => !c.borrada).map(c => clave(c.headerName)));
    const nuevas: Cabecera[] = [];
    for (const h of cabeceras.filter(x => !nombres.has(clave(x.headerName)))) {
      // Un dato del sistema que ya tiene otra cabecera de esta carga no se repite.
      const dato = h.fieldDefinitionId && !usados.has(h.fieldDefinitionId) ? h.fieldDefinitionId : 0;
      if (dato) usados.add(dato);
      nombres.add(clave(h.headerName));
      nuevas.push({
        clave: this.siguienteClave--, headerName: h.headerName.trim().toUpperCase().replace(/\s+/g, '_'), displayLabel: h.displayLabel ?? '',
        dataType: h.dataType, format: h.format ?? '', required: !!h.required, fieldDefinitionId: dato,
        sourceField: h.sourceField ?? '', regexPattern: h.regexPattern ?? '', alias: [], nueva: true
      });
    }
    if (!nuevas.length) {
      this.avisos.info('Esas cabeceras ya están en esta carga');
      return;
    }
    const k = this.llave(id, this.carga());
    this.trabajo.update(t => ({ ...t, [k]: [...nuevas, ...actuales] }));
    this.buscar.set('');
    this.avisos.success(`${nuevas.length} ${nuevas.length === 1 ? 'cabecera agregada' : 'cabeceras agregadas'}; revisa y guarda`);
  }

  // ---------------------------------------------------------------- Copiar de otra subcartera

  readonly otrasSubs = computed(() => this.ambito().filter(a => a.subId !== this.sub() && this.base()[a.subId]?.some(h => h.loadType === this.carga())));

  abrirCopiar(): void {
    this.copiarOrigen.set(0);
    this.copiarVista.set(null);
    this.copiar.set(true);
  }

  async elegirOrigenCopia(valor: string): Promise<void> {
    const origen = Number(valor), destino = this.sub();
    this.copiarOrigen.set(origen);
    this.copiarVista.set(null);
    if (!origen || !destino) return;
    this.copiarCargando.set(true);
    try {
      this.copiarVista.set(await firstValueFrom(this.cabeceras.previewImportFromSubPortfolio(destino, origen, this.carga())));
    } catch (e) {
      this.avisos.error(this.mensajeError(e));
    } finally {
      this.copiarCargando.set(false);
    }
  }

  confirmarCopia(): void {
    const vista = this.copiarVista();
    this.copiar.set(false);
    if (!vista) return;
    this.sumarNuevas(vista.headersToImport.map(h => ({
      fieldDefinitionId: h.fieldDefinitionId ?? 0,
      headerName: h.headerName,
      dataType: h.dataType,
      displayLabel: h.displayLabel,
      format: h.format,
      required: h.required,
      sourceField: h.sourceField,
      regexPattern: h.regexPattern
    })));
  }

  // ---------------------------------------------------------------- Plantilla

  private filasPlantilla(): { filas: string[][]; conConfiguracion: boolean } {
    const vivas = this.filas().filter(c => !c.borrada);
    if (!vivas.length) return { filas: [COLUMNAS_PLANTILLA, ...EJEMPLO_PLANTILLA], conConfiguracion: false };
    return {
      conConfiguracion: true,
      filas: [COLUMNAS_PLANTILLA, ...vivas.map(c => [
        this.definicion(c.fieldDefinitionId)?.fieldCode ?? '', c.headerName, c.displayLabel, c.format, c.dataType,
        c.required ? '1' : '0', c.sourceField, c.regexPattern
      ])]
    };
  }

  private nombrePlantilla(extension: string): string {
    const a = this.actual(), { conConfiguracion } = this.filasPlantilla();
    const sufijo = this.carga() === 'INICIAL' ? 'inicial' : 'diaria';
    return conConfiguracion && a ? `cabeceras-${columnaEnTabla(a.subcartera)}-${sufijo}.${extension}` : `plantilla-cabeceras.${extension}`;
  }

  descargarCsv(): void {
    this.menuPlantilla.set(false);
    const sep = ';', { filas } = this.filasPlantilla();
    const escapar = (v: string, forzar: boolean) => !v ? '' : (forzar || /["\r\n]/.test(v) || v.includes(sep)) ? `"${v.replace(/"/g, '""')}"` : v;
    // El regex va siempre entre comillas: suele traer separadores.
    const texto = filas.map((f, i) => f.map((v, j) => escapar(v, i > 0 && j === 7)).join(sep)).join('\n');
    const enlace = document.createElement('a');
    enlace.href = URL.createObjectURL(new Blob([texto], { type: 'text/csv;charset=utf-8;' }));
    enlace.download = this.nombrePlantilla('csv');
    enlace.click();
    URL.revokeObjectURL(enlace.href);
  }

  async descargarExcel(): Promise<void> {
    this.menuPlantilla.set(false);
    try {
      const XLSX = await this.libreriaExcel(), libro = XLSX.utils.book_new(), hoja = XLSX.utils.aoa_to_sheet(this.filasPlantilla().filas);
      hoja['!cols'] = [25, 20, 30, 20, 12, 12, 18, 35].map(wch => ({ wch }));
      XLSX.utils.book_append_sheet(libro, hoja, 'Configuración Cabeceras');
      XLSX.writeFile(libro, this.nombrePlantilla('xlsx'));
    } catch {
      this.avisos.error('No se pudo preparar el Excel');
    }
  }

  // ---------------------------------------------------------------- Errores

  private mensajeError(error: any): string {
    const mensaje = error?.error?.message;
    if (mensaje && !String(mensaje).includes('Http failure')) return mensaje;
    switch (error?.status) {
      case 0: return 'No se pudo conectar con el servidor';
      case 400: return 'Datos inválidos';
      case 403: return 'No tienes permiso para esta acción';
      case 404: return 'Ya no existe en el sistema';
      case 409: return 'Tiene datos asociados';
      case 502: case 503: case 504: return 'El servidor tardó demasiado en responder';
      default: return 'Ocurrió un error inesperado';
    }
  }
}
