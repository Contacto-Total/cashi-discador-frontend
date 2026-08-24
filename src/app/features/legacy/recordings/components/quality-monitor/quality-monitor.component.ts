import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  LucideAngularModule, Search, Eye, X, TrendingUp, TrendingDown,
  Minus, User, ArrowLeft, ChevronLeft, ChevronRight
} from 'lucide-angular';

import { CustomSelectComponent, SelectOption } from '../../../../../shared/components/custom-ui/custom-select/custom-select.component';
import { ToastService } from '../../../../../shared/services/toast.service';
import { QualityMonitoringService } from '../../services/quality-monitoring.service';
import { EvaluationEditorComponent } from '../evaluation-editor/evaluation-editor.component';
import {
  MonitoringAgent, MonitoringAudio, MonitoringDay, MonitoringWeek
} from '../../models/quality-monitoring.model';

/**
 * Lo que está abierto en el panel de detalle.
 *
 * Un solo tipo para los dos niveles de drill-down porque la diferencia es la ventana
 * y nada más: `fecha` con valor es una celda, `fecha` en null es el asesor completo.
 */
interface Foco {
  asesor: string;
  fecha: string | null;
  cumplimiento: number | null;
  audios: number;
}


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
  readonly X = X;
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

  // --- Filtros ---
  tramos: SelectOption[] = [];
  resultados: SelectOption[] = [];
  /** Se arma con los asesores que de verdad trajo la consulta. Ver `recordarAsesores`. */
  opcionesAsesor: SelectOption[] = [{ label: 'Todos', value: '' }];

  selectedTramo = 'todos';
  selectedResultado = '';
  selectedAsesor = '';
  desde = '';
  hasta = '';
  errorMessage = '';

  // --- Datos ---
  semana: MonitoringWeek | null = null;
  isLoading = false;

  // --- Revisión de reportes: una celda o un asesor completo ---
  foco: Foco | null = null;
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
    { label: 'CD y PDP', value: '' },
    { label: 'Solo CD', value: 'CD' },
    { label: 'Solo PDP', value: 'PDP' }
  ];

  // --- Paginación del panel ---
  pagina = 1;
  tamanoPagina = 10;
  tamanosPagina: SelectOption[] = [
    { label: '10', value: 10 },
    { label: '25', value: 25 },
    { label: '50', value: 50 }
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
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    // Mismo catálogo que la grilla, para que las dos pestañas hablen igual.
    this.tramos = [
      { label: 'Todos', value: 'todos' },
      { label: 'Tramo 3', value: 'FO_TRAMO 3' },
      { label: 'Tramo 5', value: 'FO_TRAMO 5' },
      { label: 'Cartera Propia', value: 'TRAMO' }
    ];

    // Solo los dos resultados que el sistema sabe evaluar. CONTACTO CON TERCEROS
    // NO está: su rúbrica no existe en el sistema y el backend además la excluye,
    // así que ofrecerla sería prometer una vista que devuelve cero filas.
    this.resultados = [
      { label: 'Todos (PDP + CD)', value: '' },
      { label: 'Promesa de pago (PDP)', value: 'PROMESA DE PAGO' },
      { label: 'Contacto directo (CD)', value: 'CONTACTO CON TITULAR O ENCARGADO' }
    ];

    this.semanaActual();
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

  private fijarSemana(offset: number): void {
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
    this.buscar();
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
    if (!this.desde || !this.hasta) {
      this.errorMessage = 'Seleccione el rango de fechas';
      return;
    }
    if (this.desde > this.hasta) {
      this.errorMessage = 'La fecha de inicio no puede ser posterior a la de fin';
      return;
    }

    this.cerrarDetalle();
    this.isLoading = true;

    this.monitoreo.getSemana({
      tramo: this.selectedTramo,
      desde: this.desde,
      hasta: this.hasta,
      resultado: this.selectedResultado || undefined,
      asesores: this.selectedAsesor ? [this.selectedAsesor] : undefined
    }).subscribe({
      next: (data) => {
        this.semana = data;
        this.isLoading = false;
        this.recordarAsesores(data);

        if (data.truncado) {
          this.toast.warning(
            'Se alcanzó el tope de filas: la matriz está incompleta. Acote el rango o el tramo.');
        }
        if (!data.asesores.length) {
          this.toast.info('No hay audios evaluados en ese rango');
          return;
        }
        // Si se filtró por una persona, se entra directo a su ficha: pedir un
        // asesor y quedarse mirando una matriz de una fila no ayuda a nadie.
        if (this.selectedAsesor && data.asesores.length === 1) {
          this.abrirAsesor(data.asesores[0]);
        }
      },
      error: (e) => {
        this.isLoading = false;
        this.semana = null;
        this.errorMessage = e?.message || 'No se pudo cargar el monitoreo';
        this.toast.error(this.errorMessage);
      }
    });
  }

  /**
   * Refresca el catálogo de asesores, pero **solo cuando la consulta vino sin
   * filtrar por asesor**.
   *
   * Si se refrescara siempre, al elegir a una persona el desplegable se quedaría
   * con esa sola opción y no habría forma de volver a las demás ni de saltar a
   * otra. Es el mismo cuidado que ya tiene la grilla con sus filtros de columna.
   */
  private recordarAsesores(data: MonitoringWeek): void {
    if (this.selectedAsesor) {
      return;
    }
    this.opcionesAsesor = [
      { label: 'Todos', value: '' },
      ...data.asesores.map(a => ({ label: a.asesor, value: a.asesor }))
    ];
  }

  /** El desplegable de asesor recarga: el backend filtra y los totales quedan bien. */
  cambiarAsesor(): void {
    this.buscar();
  }

  // ------------------------------------------------------------------ drill-down

  /** Una celda: un asesor, un día. */
  abrirCelda(asesor: MonitoringAgent, dia: MonitoringDay): void {
    if (!dia.audios) {
      return;
    }
    this.abrirDetalle({
      asesor: asesor.asesor,
      fecha: dia.fecha,
      cumplimiento: dia.cumplimiento,
      audios: dia.audios
    });
  }

  /** La ficha del asesor: todos sus audios del rango. */
  abrirAsesor(asesor: MonitoringAgent): void {
    if (!asesor.audios) {
      return;
    }
    this.abrirDetalle({
      asesor: asesor.asesor,
      fecha: null,
      cumplimiento: asesor.cumplimiento,
      audios: asesor.audios
    });
  }

  private abrirDetalle(foco: Foco): void {
    this.foco = foco;
    this.detalle = [];
    this.pagina = 1;
    this.isLoadingDetalle = true;

    this.monitoreo.getDetalle({
      tramo: this.selectedTramo,
      asesor: foco.asesor,
      resultado: this.selectedResultado || undefined,
      // Una de las dos ventanas, nunca las dos: el backend prioriza `fecha`.
      fecha: foco.fecha ?? undefined,
      desde: foco.fecha ? undefined : this.desde,
      hasta: foco.fecha ? undefined : this.hasta
    }).subscribe({
      next: (data) => {
        this.detalle = data;
        this.isLoadingDetalle = false;
      },
      error: (e) => {
        this.isLoadingDetalle = false;
        this.toast.error(e?.message || 'No se pudo cargar el detalle');
      }
    });
  }

  cerrarDetalle(): void {
    this.foco = null;
    this.detalle = [];
  }

  /** Desde la ficha del asesor se vuelve a la matriz completa. */
  volverATodos(): void {
    this.selectedAsesor = '';
    this.buscar();
  }

  estaAbierta(asesor: MonitoringAgent, dia: MonitoringDay): boolean {
    return !!this.foco && this.foco.asesor === asesor.asesor && this.foco.fecha === dia.fecha;
  }

  filaAbierta(asesor: MonitoringAgent): boolean {
    return !!this.foco && this.foco.asesor === asesor.asesor;
  }

  get esFichaDeAsesor(): boolean {
    return !!this.foco && this.foco.fecha === null;
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
    const foco = this.foco;
    this.buscar();
    if (foco) {
      // Se vuelve a pedir el detalle para que la lista de abajo muestre el
      // puntaje nuevo sin que el supervisor tenga que reabrirla.
      this.abrirDetalle(foco);
    }
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
    if (valor === null) {
      // Una celda sin datos apenas se separa del fondo: existe, pero no compite.
      return 'bg-slate-950/40 ring-white/[0.04]';
    }
    if (valor >= 85) {
      return 'bg-indigo-500/35 ring-indigo-400/40';
    }
    if (valor >= 70) {
      return 'bg-indigo-500/24 ring-indigo-400/25';
    }
    if (valor >= 55) {
      return 'bg-indigo-500/15 ring-indigo-400/15';
    }
    if (valor >= 40) {
      return 'bg-indigo-500/8 ring-white/[0.06]';
    }
    return 'bg-white/[0.04] ring-white/[0.06]';
  }

  /** El ancho de la barrita de un bloque. 0 si el bloque no se evaluó. */
  anchoBloque(dia: MonitoringDay | MonitoringAgent, seccion: string): number {
    const bloque = dia.bloques?.[seccion];
    return bloque?.cumplimiento ?? 0;
  }

  tituloBloque(dia: MonitoringDay | MonitoringAgent, seccion: string): string {
    const bloque = dia.bloques?.[seccion];
    const etiqueta = this.ETIQUETA_SECCION[seccion] ?? seccion;
    if (!bloque || bloque.posibles === 0) {
      return `${etiqueta}: sin evaluar`;
    }
    return `${etiqueta}: ${bloque.puntos}/${bloque.posibles} (${bloque.cumplimiento}%)`;
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

  /** Los criterios con más falla, recortados a lo que cabe sin volverse un reporte. */
  get topCriterios() {
    return (this.semana?.criteriosMasFallados ?? []).slice(0, 8);
  }
}
