import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  LucideAngularModule, Search, Eye, TrendingUp, TrendingDown,
  Minus, User, ArrowLeft, ChevronLeft, ChevronRight
} from 'lucide-angular';

import { CustomSelectComponent, SelectOption } from '../../../../../shared/components/custom-ui/custom-select/custom-select.component';
import { ToastService } from '../../../../../shared/services/toast.service';
import { QualityMonitoringService } from '../../services/quality-monitoring.service';
import { EvaluationEditorComponent } from '../evaluation-editor/evaluation-editor.component';
import {
  MonitoringAgent, MonitoringAudio, MonitoringCriterion, MonitoringDay, MonitoringWeek
} from '../../models/quality-monitoring.model';
import { TenantService } from '../../../../../maintenance/services/tenant.service';
import { PortfolioService } from '../../../../../maintenance/services/portfolio.service';
import { SubPortfolio } from '../../../../../maintenance/models/portfolio.model';

/**
 * El largo máximo del rango, en días.
 *
 * Siete es una semana: el ciclo con el que trabaja calidad y el ancho al que la matriz
 * sigue siendo legible. Cada día es una columna, y cada columna lleva el desglose de los
 * tres bloques, así que a partir de ahí la tabla se lee en horizontal a fuerza de scroll
 * y deja de servir para lo que existe, que es comparar filas entre sí.
 *
 * También es un freno del lado del cliente: la consulta recorre gestiones de producción y
 * un rango de tres meses la vuelve cara sin que nadie se lo haya propuesto.
 */
const MAX_DIAS = 7;

/**
 * Lo que se pide antes de dejar consultar.
 *
 * La cascada no admite «Todas» en ningún nivel, y no es una restricción heredada del
 * resto de la pantalla: es lo único que distingue dos subcarteras homónimas. En QAS hay
 * dos llamadas «Lima», una bajo Tramo 5 y otra bajo Tramo 3, y sin la cartera de arriba
 * el nombre no alcanza para saber cuál se eligió.
 */
const SIN_CASCADA = 'Seleccione Proveedor, Cartera y Subcartera.';

/**
 * La matriz asesor × día de evaluaciones de calidad.
 *
 * Es el gráfico "EVALUACIONES DIARIAS" del Excel de calidad generalizado a todo el
 * tramo: donde el archivo necesita un libro por asesor y un gráfico por libro, esta
 * pantalla pone a todos los asesores y todos los días en una sola vista. Las tres
 * barritas de cada celda son las tres series de ese gráfico plegadas al tamaño de
 * una celda.
 *
 * ## Las tres decisiones de diseño que hay que respetar al tocar este componente
 *
 * **1. La celda muestra porcentaje, no puntos sobre 15.** Cumplimiento = puntos
 * obtenidos ÷ puntos totales posibles, y el total posible no es una constante: un
 * audio CD se mide contra 14 criterios y uno PDP contra 16, más lo que calidad haya
 * agregado o apagado en esa subcartera. El backend resuelve el máximo audio por
 * audio; acá solo se formatea. Por eso también viajan `puntos` y `posibles`, que se
 * muestran debajo para poder cuadrar contra el Excel.
 *
 * **2. Una celda sin audios evaluados va VACÍA, no en 0%.** Un cero acusa al asesor
 * de haberlo hecho mal; el vacío dice la verdad, que es que ahí no se evaluó nada.
 * Con la cobertura actual del speech esta distinción no es cosmética: la mayoría de
 * los días están vacíos.
 *
 * **3. No hay meta y el color no es un semáforo.** La comparación es contra el
 * propio asesor —su día anterior, su semana anterior—, así que la rampa es de una
 * sola tinta y solo indica intensidad. Un verde/rojo anclado a un umbral exigiría
 * un número cargado a mano, y un número que alguien escribe no es un dato.
 */
@Component({
  selector: 'app-quality-monitor',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, CustomSelectComponent,
            EvaluationEditorComponent],
  templateUrl: './quality-monitor.component.html',
  styleUrls: ['./quality-monitor.component.scss']
})
export class QualityMonitorComponent implements OnInit {
  readonly Search = Search;
  readonly Eye = Eye;
  readonly TrendingUp = TrendingUp;
  readonly TrendingDown = TrendingDown;
  readonly Minus = Minus;
  readonly User = User;
  readonly ArrowLeft = ArrowLeft;
  readonly ChevronLeft = ChevronLeft;
  readonly ChevronRight = ChevronRight;

  /** El orden en que se dibujan las tres barras de una celda. */
  readonly SECCIONES = ['PRESENTACION', 'NEGOCIACION', 'CIERRE'];

  /**
   * Verde / amarillo / azul: las mismas bandas con que calidad ya pinta esos
   * bloques en su hoja. Reusarlas hace que el supervisor reconozca la pantalla
   * antes de leerla.
   */
  readonly COLOR_SECCION: Record<string, string> = {
    PRESENTACION: 'bg-emerald-500',
    NEGOCIACION: 'bg-amber-500',
    CIERRE: 'bg-sky-500'
  };

  readonly ETIQUETA_SECCION: Record<string, string> = {
    PRESENTACION: 'Presentación',
    NEGOCIACION: 'Negociación',
    CIERRE: 'Cierre'
  };

  // --- Filtros de la consulta: definen QUÉ trae el backend, para toda la pantalla ---

  /**
   * La cascada proveedor -> cartera -> subcartera, igual que en Plantillas Speech.
   *
   * Los catálogos salen de los mismos servicios que el resto del sistema
   * (`system-config/tenants`, `.../portfolios`, `subportfolios/by-portfolio`) y no de
   * un endpoint propio del monitoreo: así el árbol que se ve aquí es exactamente el que
   * se ve al configurar la rúbrica, y no dos listas que pueden divergir.
   *
   * `0` es «nada elegido» en los tres niveles; ninguno acepta «Todas».
   */
  proveedores: SelectOption[] = [];
  carteras: SelectOption[] = [];
  subcarteras: SelectOption[] = [];
  resultados: SelectOption[] = [];

  selectedProveedor = 0;
  selectedCartera = 0;
  selectedSubcartera = 0;
  selectedResultado = '';

  /**
   * Las subcarteras crudas del nivel abierto.
   *
   * Se guardan porque el desplegable trabaja con ids y el backend con nombres: esta
   * lista es la que traduce del uno al otro.
   */
  private subPortfolios: SubPortfolio[] = [];
  desde = '';
  hasta = '';
  errorMessage = '';

  /**
   * Los asesores que trajo la consulta, para los desplegables de las dos cards.
   *
   * **Arriba ya no hay filtro de asesor y es deliberado.** La matriz es el total contra
   * el que se compara: en cuanto se la recorta a una persona, la referencia desaparece y
   * la pantalla deja de poder responder «¿esto es de él o le pasa a todos?». El recorte
   * por persona vive en las cards de abajo, cada una con el suyo e independientes entre
   * sí, que es lo que permite mirar a un asesor y al conjunto al mismo tiempo.
   */
  asesoresDisponibles: SelectOption[] = [{ label: 'Todos', value: '' }];

  /** Filtro propio de la card de criterios. '' = todos. No toca nada más de la pantalla. */
  asesorCriterios = '';

  // --- Datos ---
  semana: MonitoringWeek | null = null;
  isLoading = false;

  // --- Revisión de reportes: card permanente con filtro propio ---

  /**
   * El asesor de la card de revisión. '' = todos.
   *
   * Independiente del de la card de criterios a propósito: el caso que justifica la
   * pantalla es comparar los criterios que falla una persona contra los audios de todo
   * el rango, y eso necesita las dos cards mirando recortes distintos a la vez.
   */
  asesorRevision = '';

  /** El día que se está mirando, o null para todo el rango. Lo fija el click en una celda. */
  fechaRevision: string | null = null;

  detalle: MonitoringAudio[] = [];
  isLoadingDetalle = false;

  /**
   * Filtro de rúbrica local al panel.
   *
   * Es distinto del de Resultado de arriba: aquel decide qué entra en la matriz y
   * viaja al backend, este solo recorta la lista que ya está en pantalla. Sirve para
   * lo que hace un supervisor al revisar —"muéstrame solo las promesas de pago"—
   * sin tener que recargar toda la semana y perder el sitio.
   */
  filtroRubrica: '' | 'CD' | 'PDP' = '';
  rubricas: SelectOption[] = [
    { label: 'TODOS', value: '' },
    { label: 'CD', value: 'CD' },
    { label: 'PDP', value: 'PDP' }
  ];

  // --- Paginación del panel ---
  pagina = 1;
  /**
   * 5 por página, y como mucho 10.
   *
   * La card convive con la matriz y con los criterios en la misma vista: una lista más
   * larga empuja todo lo demás fuera de pantalla y obliga a hacer scroll para volver al
   * dato contra el que se estaba comparando.
   */
  tamanoPagina = 5;
  tamanosPagina: SelectOption[] = [
    { label: '5', value: 5 },
    { label: '8', value: 8 },
    { label: '10', value: 10 }
  ];

  // --- Paginación de la matriz ---
  /**
   * Los asesores también se paginan.
   *
   * Cada celda lleva ahora el desglose de los tres bloques con sus puntos, así que una
   * fila mide el triple que antes. Con quince asesores la matriz se convertía en una
   * columna de scroll donde comparar dos filas exigía recordar la primera.
   */
  paginaMatriz = 1;
  tamanoMatriz = 10;
  tamanosMatriz: SelectOption[] = [
    { label: '5', value: 5 },
    { label: '10', value: 10 },
    { label: '20', value: 20 }
  ];

  /**
   * El audio abierto en la ficha de evaluación, o null si está cerrada.
   *
   * Se guarda el audio entero y no solo el idx porque el modal necesita también el
   * `nombre` del WAV para poder reproducirlo.
   */
  evaluacionAbierta: MonitoringAudio | null = null;

  constructor(
    private monitoreo: QualityMonitoringService,
    private tenantService: TenantService,
    private portfolioService: PortfolioService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.cargarProveedores();

    // Las tres rutas que el speech-analyzer evalúa, y solo esas. La lista tiene
    // que seguir a `_RUTAS_N2_EVALUABLES` de cashi_read.py: si aquí sobra una,
    // la pantalla ofrece un filtro que devuelve cero filas; si falta, hay
    // evaluaciones en la base que nadie puede aislar y quedan mezcladas dentro
    // de «Todos».
    //
    // CONTACTO CON TERCEROS no está y no es un olvido: su rúbrica no existe y
    // el backend la excluye de la consulta.
    this.resultados = [
      { label: 'Todos', value: '' },
      { label: 'Contacto directo', value: 'CONTACTO CON TITULAR O ENCARGADO' },
      { label: 'Promesa de pago', value: 'PROMESA DE PAGO' },
      { label: 'Oportunidad de pago', value: 'OPORTUNIDAD DE PAGO' }
    ];

    // Se fija el rango por defecto SIN consultar: sin la cascada elegida no hay nada
    // que pedir, y disparar la búsqueda aquí abriría la pantalla con el error puesto.
    this.fijarSemana(0, false);
  }

  // ---------------------------------------------------------------- cascada

  private cargarProveedores(): void {
    this.tenantService.getAllTenants().subscribe({
      next: (data) => {
        this.proveedores = data.map(t => ({ label: t.tenantName, value: t.id }));
      },
      error: () => {
        this.toast.error('No se pudieron cargar los proveedores');
      }
    });
  }

  /**
   * Bajar un nivel invalida los de abajo Y lo que hay en pantalla.
   *
   * Lo segundo es lo que importa: la matriz que se está viendo es de la subcartera que
   * se BUSCÓ, no de la que quedó elegida en el combo. Dejarla puesta mientras el
   * encabezado ya dice otra cosa es exactamente el error que se corrigió en Plantillas
   * Speech —leer los datos de TRAMO PROPIO creyendo que son de CASTIGO—, salvo que aquí
   * el precio es un porcentaje de calidad atribuido a la cartera equivocada.
   */
  onProveedorChange(): void {
    this.carteras = [];
    this.subcarteras = [];
    this.selectedCartera = 0;
    this.selectedSubcartera = 0;
    this.limpiarResultados();

    if (this.selectedProveedor > 0) {
      this.portfolioService.getPortfoliosByTenant(this.selectedProveedor).subscribe({
        next: (data) => {
          this.carteras = data.map(p => ({ label: p.portfolioName, value: p.id }));
        },
        error: () => { this.toast.error('No se pudieron cargar las carteras'); }
      });
    }
  }

  onCarteraChange(): void {
    this.subcarteras = [];
    this.selectedSubcartera = 0;
    this.limpiarResultados();

    if (this.selectedCartera > 0) {
      this.portfolioService.getSubPortfoliosByPortfolio(this.selectedCartera).subscribe({
        next: (data) => {
          this.subPortfolios = data;
          this.subcarteras = data.map(s => ({ label: s.subPortfolioName, value: s.id }));
        },
        error: () => { this.toast.error('No se pudieron cargar las subcarteras'); }
      });
    }
  }

  onSubcarteraChange(): void {
    this.limpiarResultados();
  }

  /** Descarta la consulta anterior para que nada quede rotulado con el filtro nuevo. */
  private limpiarResultados(): void {
    this.semana = null;
    this.detalle = [];
    this.evaluacionAbierta = null;
    this.errorMessage = '';
  }

  /**
   * El nombre de la subcartera elegida: es lo que viaja al backend.
   *
   * Va el nombre y no el id porque la tabla histórica no guarda el id de subcartera en
   * las filas recién cargadas —`id_subcartera` llega en NULL hasta que corre la
   * clasificación— mientras que la columna de texto `SUBCARTERA` viene siempre. Filtrar
   * por id dejaría fuera justamente lo más reciente, que es lo que calidad revisa.
   *
   * Además los ids no son estables entre entornos: la misma subcartera es 35 en QAS y
   * otra distinta con ese número en producción.
   */
  nombreSubcartera(): string {
    const sub = this.subPortfolios.find(s => s.id === this.selectedSubcartera);
    return sub?.subPortfolioName ?? '';
  }

  /** true cuando los tres niveles están elegidos. */
  get cascadaCompleta(): boolean {
    return this.selectedProveedor > 0 && this.selectedCartera > 0 && this.selectedSubcartera > 0;
  }

  // ------------------------------------------------------------------ rango

  /**
   * Lunes a viernes de la semana en curso.
   *
   * El Excel de calidad es de lunes a viernes y ese es el default, pero el rango
   * es libre: si hubiera un audio de sábado dentro del rango pedido, se dibuja su
   * columna. Recortar por defecto está bien; hacer desaparecer un dato sin avisar,
   * no.
   */
  semanaActual(): void {
    this.fijarSemana(0);
  }

  semanaAnterior(): void {
    this.fijarSemana(-1);
  }

  private fijarSemana(offset: number, consultar = true): void {
    const hoy = new Date();
    // getDay(): 0 es domingo. El lunes de la semana en curso queda a -6 el domingo.
    const diaSemana = hoy.getDay();
    const aLunes = diaSemana === 0 ? -6 : 1 - diaSemana;

    const lunes = new Date(hoy);
    lunes.setDate(hoy.getDate() + aLunes + offset * 7);

    const viernes = new Date(lunes);
    viernes.setDate(lunes.getDate() + 4);

    this.desde = this.comoIso(lunes);
    this.hasta = this.comoIso(viernes);
    if (consultar) {
      this.buscar();
    }
  }

  /**
   * 'YYYY-MM-DD' en hora local.
   *
   * `toISOString()` no sirve: pasa a UTC y en Lima (UTC-5) devuelve el día
   * anterior para cualquier fecha construida a medianoche local.
   */
  private comoIso(fecha: Date): string {
    const mes = `${fecha.getMonth() + 1}`.padStart(2, '0');
    const dia = `${fecha.getDate()}`.padStart(2, '0');
    return `${fecha.getFullYear()}-${mes}-${dia}`;
  }

  // ------------------------------------------------------------------ carga

  buscar(): void {
    this.errorMessage = '';

    // Antes que las fechas: sin subcartera no hay rúbrica contra la cual puntuar, y una
    // consulta «de todo» recorrería el histórico entero para devolver dos rúbricas
    // mezcladas en la misma matriz.
    if (!this.cascadaCompleta) {
      this.errorMessage = SIN_CASCADA;
      this.toast.error(SIN_CASCADA);
      return;
    }
    if (!this.desde || !this.hasta) {
      this.errorMessage = 'Seleccione el rango de fechas';
      return;
    }
    if (this.desde > this.hasta) {
      this.errorMessage = 'La fecha de inicio no puede ser posterior a la de fin';
      return;
    }
    if (this.diasDelRango() > MAX_DIAS) {
      this.errorMessage = `El rango no puede pasar de ${MAX_DIAS} días. `
        + `Elija hasta el ${this.maxHasta} o mueva la fecha de inicio.`;
      return;
    }

    this.isLoading = true;
    this.paginaMatriz = 1;

    // Sin `asesores`: la matriz muestra siempre a todos. El recorte por persona lo
    // hacen las cards de abajo, cada una por su cuenta.
    this.monitoreo.getSemana({
      tramo: this.nombreSubcartera(),
      desde: this.desde,
      hasta: this.hasta,
      resultado: this.selectedResultado || undefined
    }).subscribe({
      next: (data) => {
        this.semana = data;
        this.isLoading = false;
        this.recordarAsesores(data);
        this.cargarRevision();

        if (data.truncado) {
          this.toast.warning(
            'Se alcanzó el tope de filas: la matriz está incompleta. Acote el rango o el tramo.');
        }
        if (!data.asesores.length) {
          this.toast.info('No hay audios evaluados en ese rango');
        }
      },
      error: (e) => {
        this.isLoading = false;
        this.semana = null;
        this.detalle = [];
        this.errorMessage = e?.message || 'No se pudo cargar el monitoreo';
        this.toast.error(this.errorMessage);
      }
    });
  }

  /**
   * El catálogo de asesores de los dos desplegables de abajo.
   *
   * Se puede refrescar sin cuidados en cada consulta —a diferencia de la versión
   * anterior— porque la matriz ya no se filtra por asesor: la respuesta siempre trae a
   * todos los que tuvieron audios en el rango. Los filtros elegidos se conservan si la
   * persona sigue apareciendo, y se limpian si no, para no dejar una card mostrando el
   * recorte de alguien que no está en el rango nuevo.
   */
  private recordarAsesores(data: MonitoringWeek): void {
    const nombres = data.asesores.map(a => a.asesor);
    this.asesoresDisponibles = [
      { label: 'Todos', value: '' },
      ...nombres.map(n => ({ label: n, value: n }))
    ];

    if (this.asesorCriterios && !nombres.includes(this.asesorCriterios)) {
      this.asesorCriterios = '';
    }
    if (this.asesorRevision && !nombres.includes(this.asesorRevision)) {
      this.asesorRevision = '';
      this.fechaRevision = null;
    }
  }

  // ------------------------------------------------------------------ drill-down

  /**
   * Una celda: apunta la card de revisión a ese asesor y ese día.
   *
   * Ya no abre ni cierra nada. La card está siempre en pantalla y el click sobre la
   * matriz es un atajo para su filtro, no un panel que aparece: el supervisor no tiene
   * que descubrir dónde quedó la lista que estaba mirando.
   */
  abrirCelda(asesor: MonitoringAgent, dia: MonitoringDay): void {
    if (!dia.audios) {
      return;
    }
    this.asesorRevision = asesor.asesor;
    this.fechaRevision = dia.fecha;
    this.cargarRevision();
  }

  /** El nombre del asesor: sus audios de todo el rango. */
  abrirAsesor(asesor: MonitoringAgent): void {
    if (!asesor.audios) {
      return;
    }
    this.asesorRevision = asesor.asesor;
    this.fechaRevision = null;
    this.cargarRevision();
  }

  /** Cambiar el desplegable de la card descarta el día: vuelve a todo el rango. */
  cambiarAsesorRevision(): void {
    this.fechaRevision = null;
    this.cargarRevision();
  }

  /** Quita el recorte de un día sin perder el asesor. */
  verTodoElRango(): void {
    this.fechaRevision = null;
    this.cargarRevision();
  }

  private cargarRevision(): void {
    if (!this.desde || !this.hasta) {
      return;
    }

    this.detalle = [];
    this.pagina = 1;

    // Si la semana vino sin un solo asesor evaluado, el detalle solo puede volver
    // vacio: es la misma consulta con otro SELECT. Pedirlo igual gasta un viaje y
    // deja al usuario con dos avisos —uno informativo y otro de error— para
    // explicar una sola cosa, que no hay datos en ese rango.
    if (this.semana && !this.semana.asesores.length) {
      this.isLoadingDetalle = false;
      return;
    }

    this.isLoadingDetalle = true;

    this.monitoreo.getDetalle({
      tramo: this.nombreSubcartera(),
      // Vacío = todos. El backend acepta el asesor en blanco desde este cambio.
      asesor: this.asesorRevision || undefined,
      resultado: this.selectedResultado || undefined,
      // Una de las dos ventanas, nunca las dos: el backend prioriza `fecha`.
      fecha: this.fechaRevision ?? undefined,
      desde: this.fechaRevision ? undefined : this.desde,
      hasta: this.fechaRevision ? undefined : this.hasta
    }).subscribe({
      next: (data) => {
        this.detalle = data;
        this.isLoadingDetalle = false;
      },
      error: (e) => {
        this.isLoadingDetalle = false;
        this.toast.error(e?.message || 'No se pudo cargar la revisión');
      }
    });
  }

  /** Si la celda es la que está mirando la card de revisión. */
  estaAbierta(asesor: MonitoringAgent, dia: MonitoringDay): boolean {
    return this.asesorRevision === asesor.asesor && this.fechaRevision === dia.fecha;
  }

  filaAbierta(asesor: MonitoringAgent): boolean {
    return this.asesorRevision === asesor.asesor;
  }

  // ------------------------------------------------------------------ filtro y paginación

  /** Lo que queda después del filtro de rúbrica, antes de paginar. */
  get detalleFiltrado(): MonitoringAudio[] {
    if (!this.filtroRubrica) {
      return this.detalle;
    }
    return this.detalle.filter(a => a.rubrica === this.filtroRubrica);
  }

  /** La página que se está viendo. */
  get detallePaginado(): MonitoringAudio[] {
    const desde = (this.pagina - 1) * this.tamanoPagina;
    return this.detalleFiltrado.slice(desde, desde + this.tamanoPagina);
  }

  get totalPaginas(): number {
    return Math.max(1, Math.ceil(this.detalleFiltrado.length / this.tamanoPagina));
  }

  /**
   * Cambiar el filtro o el tamaño de página vuelve a la primera.
   *
   * Sin esto, filtrar estando en la página 4 de 5 deja la tabla vacía y parece que
   * el filtro no encontró nada, cuando lo que pasa es que el resultado tiene menos
   * páginas que la que se estaba mirando.
   */
  reiniciarPaginado(): void {
    this.pagina = 1;
  }

  irA(pagina: number): void {
    this.pagina = Math.min(Math.max(1, pagina), this.totalPaginas);
  }

  /** El rango que se está viendo, para el 'x–y de z' del pie. */
  get rangoVisible(): string {
    const total = this.detalleFiltrado.length;
    if (!total) {
      return '0';
    }
    const desde = (this.pagina - 1) * this.tamanoPagina + 1;
    return `${desde}–${Math.min(desde + this.tamanoPagina - 1, total)} de ${total}`;
  }

  // ------------------------------------------------------------------ acciones del detalle

  /**
   * Abre la ficha del audio: resumen, criterios y corrección manual.
   *
   * Es la única acción de la fila. La descarga del XLSX vive en la pestaña de
   * Grabaciones, que es donde el supervisor prepara la revisión; acá la fila tiene
   * una sola cosa que hacer y conviene que se note.
   */
  verEvaluacion(audio: MonitoringAudio): void {
    this.evaluacionAbierta = audio;
  }

  cerrarEvaluacion(): void {
    this.evaluacionAbierta = null;
  }

  /**
   * Después de corregir hay que recargar, no ajustar el número en memoria.
   *
   * Un cambio de criterio mueve el puntaje del audio, el de su celda, el del día,
   * el total del asesor, los dos deltas y la lista de criterios más fallados.
   * Recalcular todo eso en el front sería duplicar la lógica del backend con la
   * garantía de que en algún momento las dos versiones dejarían de coincidir.
   */
  refrescarTrasAjuste(): void {
    // `buscar` vuelve a pedir la revisión al terminar, así que la lista de abajo
    // muestra el puntaje nuevo sin que el supervisor tenga que hacer nada.
    this.buscar();
  }

  // ------------------------------------------------------------------ formato

  /** '—' y no '0%' cuando no se evaluó nada. Ver la nota 2 de la clase. */
  pct(valor: number | null | undefined): string {
    return valor === null || valor === undefined ? '—' : `${valor}%`;
  }

  delta(valor: number | null | undefined): string {
    if (valor === null || valor === undefined) {
      return '';
    }
    const signo = valor > 0 ? '+' : '';
    return `${signo}${valor}`;
  }

  /**
   * La rampa de color de una celda: una sola tinta, más intensa cuanto más alto.
   *
   * No es un semáforo a propósito. Sin meta no hay umbral que justifique pintar
   * un 62% de rojo y un 71% de verde; lo que la rampa comunica es magnitud
   * relativa, y la comparación real la hace el delta contra el propio asesor.
   */
  colorCelda(valor: number | null): string {
    // Cada tramo declara su par claro/oscuro. En claro la rampa arranca de un gris
    // frio y sube en indigo solido; las opacidades del tema oscuro sobre blanco dan
    // lavandas casi identicas entre si y la rampa deja de leerse.
    if (valor === null) {
      // Una celda sin datos apenas se separa del fondo: existe, pero no compite.
      return 'bg-slate-50 ring-slate-200 dark:bg-slate-950/40 dark:ring-white/[0.04]';
    }
    if (valor >= 85) {
      return 'bg-indigo-500/30 ring-indigo-400/50 dark:bg-indigo-500/35 dark:ring-indigo-400/40';
    }
    if (valor >= 70) {
      return 'bg-indigo-500/20 ring-indigo-400/35 dark:bg-indigo-500/24 dark:ring-indigo-400/25';
    }
    if (valor >= 55) {
      return 'bg-indigo-500/12 ring-indigo-400/25 dark:bg-indigo-500/15 dark:ring-indigo-400/15';
    }
    if (valor >= 40) {
      return 'bg-indigo-500/[0.06] ring-slate-200 dark:bg-indigo-500/8 dark:ring-white/[0.06]';
    }
    return 'bg-slate-100 ring-slate-200 dark:bg-white/[0.04] dark:ring-white/[0.06]';
  }

  /** El ancho de la barrita de un bloque. 0 si el bloque no se evaluó. */
  anchoBloque(dia: MonitoringDay | MonitoringAgent, seccion: string): number {
    const bloque = dia.bloques?.[seccion];
    return bloque?.cumplimiento ?? 0;
  }

  /**
   * El porcentaje del bloque, como etiqueta de la fila.
   *
   * Ocupa el sitio donde antes iba la inicial del bloque: quién es cada fila ya lo dice
   * el color, que es el mismo que calidad usa en su hoja y el que repite la leyenda del
   * pie. La inicial gastaba ancho en repetir eso.
   */
  pctBloque(dia: MonitoringDay | MonitoringAgent, seccion: string): string {
    const bloque = dia.bloques?.[seccion];
    if (!bloque || bloque.posibles === 0 || bloque.cumplimiento === null) {
      return '—';
    }
    return `${bloque.cumplimiento}%`;
  }

  /**
   * `153/217` — puntos obtenidos sobre posibles de ese bloque.
   *
   * Un bloque sin criterios evaluados devuelve una raya y no `0/0`: cero sobre cero se
   * lee como incumplimiento total, que es justo lo contrario de lo que pasó.
   */
  fraccionBloque(dia: MonitoringDay | MonitoringAgent, seccion: string): string {
    const bloque = dia.bloques?.[seccion];
    if (!bloque || bloque.posibles === 0) {
      return '—';
    }
    return `${bloque.puntos}/${bloque.posibles}`;
  }

  tituloBloque(dia: MonitoringDay | MonitoringAgent, seccion: string): string {
    const bloque = dia.bloques?.[seccion];
    const etiqueta = this.ETIQUETA_SECCION[seccion] ?? seccion;
    if (!bloque || bloque.posibles === 0) {
      return `${etiqueta}: sin evaluar`;
    }
    return `${etiqueta}: ${bloque.puntos}/${bloque.posibles} (${bloque.cumplimiento}%)`;
  }

  /**
   * Identidades estables para los `*ngFor`.
   *
   * `detallePaginado`, `topCriterios` y compañía son getters que devuelven arrays nuevos
   * en cada ciclo de detección de cambios. Sin `trackBy`, cada ciclo destruye y
   * reconstruye las filas, y un botón que se reconstruye entre el `mousedown` y el
   * `mouseup` nunca llega a emitir su `click`. Ver la nota de `bloques` en
   * `EvaluationEditorComponent`, donde ese bug se manifestó primero.
   */
  porAsesor = (_: number, a: MonitoringAgent) => a.asesor;
  porFecha = (_: number, d: MonitoringDay) => d.fecha;
  porDia = (_: number, fecha: string) => fecha;
  porCampo = (_: number, c: MonitoringCriterion) => c.campo;
  porIdx = (_: number, a: MonitoringAudio) => a.idx;
  porSeccion = (_: number, s: string) => s;

  // ------------------------------------------------------------------ rango de fechas

  /** Cuántos días cubre el rango elegido, extremos incluidos. */
  private diasDelRango(): number {
    if (!this.desde || !this.hasta) {
      return 0;
    }
    const a = new Date(`${this.desde}T00:00:00`).getTime();
    const b = new Date(`${this.hasta}T00:00:00`).getTime();
    return Math.round((b - a) / 86_400_000) + 1;
  }

  /**
   * El último día seleccionable, para que el calendario mismo frene el rango.
   *
   * Validar al buscar no alcanza: el supervisor ya eligió la fecha y recibe un error
   * por algo que la pantalla podía haberle impedido. El `max` del input lo bloquea
   * antes, y la validación se queda como red por si el valor entra escrito a mano.
   */
  get maxHasta(): string {
    if (!this.desde) {
      return '';
    }
    const tope = new Date(`${this.desde}T00:00:00`);
    tope.setDate(tope.getDate() + MAX_DIAS - 1);
    return this.comoIso(tope);
  }

  // ------------------------------------------------------------------ paginado de la matriz

  /** Los asesores de la página que se está viendo. */
  get asesoresPaginados(): MonitoringAgent[] {
    const todos = this.semana?.asesores ?? [];
    const desde = (this.paginaMatriz - 1) * this.tamanoMatriz;
    return todos.slice(desde, desde + this.tamanoMatriz);
  }

  get totalPaginasMatriz(): number {
    const todos = this.semana?.asesores.length ?? 0;
    return Math.max(1, Math.ceil(todos / this.tamanoMatriz));
  }

  get rangoVisibleMatriz(): string {
    const total = this.semana?.asesores.length ?? 0;
    if (!total) {
      return '0';
    }
    const desde = (this.paginaMatriz - 1) * this.tamanoMatriz + 1;
    return `${desde}–${Math.min(desde + this.tamanoMatriz - 1, total)} de ${total}`;
  }

  irAMatriz(pagina: number): void {
    this.paginaMatriz = Math.min(Math.max(1, pagina), this.totalPaginasMatriz);
  }

  reiniciarPaginadoMatriz(): void {
    this.paginaMatriz = 1;
  }

  /** 'lun 03' — el encabezado de columna. */
  etiquetaDia(fecha: string): string {
    const [a, m, d] = fecha.split('-').map(Number);
    const dias = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
    const local = new Date(a, m - 1, d);
    return `${dias[local.getDay()]} ${`${d}`.padStart(2, '0')}`;
  }

  get hayDatos(): boolean {
    return !!this.semana && this.semana.asesores.length > 0;
  }

  /**
   * Los criterios con más falla, recortados a lo que cabe sin volverse un reporte.
   *
   * Sale del asesor elegido en ESTA card, o del total del rango si está en Todos. El
   * desglose por persona ya viene en la respuesta de la semana, así que cambiar el
   * filtro no pide nada al servidor.
   */
  get topCriterios(): MonitoringCriterion[] {
    const fuente = this.asesorCriterios
      ? this.semana?.asesores.find(a => a.asesor === this.asesorCriterios)?.criteriosMasFallados
      : this.semana?.criteriosMasFallados;
    return (fuente ?? []).slice(0, 8);
  }

  /** Cuántos audios respaldan la card de criterios, para que el % no se lea suelto. */
  get audiosDeCriterios(): number {
    if (!this.asesorCriterios) {
      return this.semana?.totales.audios ?? 0;
    }
    return this.semana?.asesores.find(a => a.asesor === this.asesorCriterios)?.audios ?? 0;
  }

  // --- Cabecera de la card de revisión: se calcula sobre lo que se trajo ---

  get cumplimientoRevision(): number | null {
    let puntos = 0;
    let posibles = 0;
    for (const a of this.detalle) {
      puntos += a.puntos;
      posibles += a.posibles;
    }
    return posibles ? Math.round(puntos * 1000 / posibles) / 10 : null;
  }

  /** Si la lista mezcla varios días, la columna Día tiene sentido; si no, sobra. */
  get muestraColumnaDia(): boolean {
    return this.fechaRevision === null;
  }
}
