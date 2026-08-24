import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Volume2, FileSpreadsheet, FileText, Download, ChevronDown, Search, Calendar, X } from 'lucide-angular';

import { CustomSelectComponent, SelectOption } from '../../../../../shared/components/custom-ui/custom-select/custom-select.component';
import { ToastService } from '../../../../../shared/services/toast.service';
import { HistoricalRecordingsService } from '../../services/historical-recordings.service';
import { RecordingDownloadService } from '../../services/recording-download.service';
import { RecordingEvaluationReportService } from '../../services/recording-evaluation-report.service';
import { RecordingDownloadRequest } from '../../models/recording-download.request';
import { HistoricalRecordingsByDocumentRequest } from '../../models/historical-recordings-by-document.request';
import { HistoricalRecordingsByPhoneRequest } from '../../models/historical-recordings-by-phone.request';
import { HistoricalRecordingsByDateRangeRequest } from '../../models/historical-recordings-by-date-range.request';
import { CreateRecordingEvaluationReportRequest } from '../../models/create-recording-evaluation-report.request';
import { Transcription } from '../../models/transcription.model';

interface Recording {
  idx: number;
  documento: string;
  cartera: string;
  telefono: string;
  fechagestion: string;
  horagestion: string;
  resultado: string;
  solucion: string;
  cliente: string;
  usuarioregistra: string;
  anio: string;
  mes: string;
  dia: string;
  /** Uno o varios WAV separados por coma. DURACION viene partida igual; ANIO/MES/DIA no. */
  nombre: string;
  /** Segundos con decimales por archivo: '179.96' o '8.04,8.12,45.92'. */
  duracion: string;
  /**
   * Si hay texto en `audios_transcripcion` para esta gestión. Lo calcula el
   * backend al armar el listado; decide si se dibuja el botón de transcripción.
   */
  tieneTranscripcion: boolean;
}

/**
 * Un WAV concreto de una gestión, ya separado de sus hermanos.
 *
 * La fila de la grilla sigue siendo una por gestión; esto es lo que se despliega
 * debajo cuando tiene más de una grabación.
 */
interface AudioDeGestion {
  nombre: string;
  anio: string;
  mes: string;
  dia: string;
  /** Ya formateada como m:ss. Vacía si DURACION no traía valor. */
  duracion: string;
}

@Component({
  selector: 'app-recordings-tracker',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, CustomSelectComponent],
  templateUrl: './recordings-tracker.component.html',
  styleUrls: ['./recordings-tracker.component.scss']
})
export class RecordingsTrackerComponent implements OnInit {
  // Lucide icons
  readonly Volume2 = Volume2;
  readonly FileSpreadsheet = FileSpreadsheet;
  readonly FileText = FileText;
  readonly Download = Download;
  readonly ChevronDown = ChevronDown;
  readonly Search = Search;
  readonly Calendar = Calendar;
  readonly X = X;

  // Math utility for template
  readonly Math = Math;

  gestiones: Recording[] = [];
  filteredGestiones: Recording[] = [];
  paginatedGestiones: Recording[] = [];
  initialValue: Recording[] = [];

  // Pagination
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;
  pageSizeOptions: SelectOption[] = [
    { label: '5', value: 5 },
    { label: '10', value: 10 },
    { label: '20', value: 20 }
  ];

  // Search fields
  startDate: string = '';
  endDate: string = '';
  documento: string = '';
  telefono: string = '';
  errorMessage: string = '';

  // Filter fields
  filterDocumento: string = '';
  filterTelefono: string = '';
  filterCartera: string = '';
  filterResultado: string = '';
  filterAsesor: string = '';

  /**
   * Qué filtros de columna tienen sentido sobre lo que se trajo.
   *
   * Un filtro solo sirve si su columna tiene más de un valor distinto en el
   * resultado: buscar por documento devuelve un solo DNI, y elegir Tramo 5
   * arriba deja un solo tramo, así que esas cajas no filtrarían nada y solo
   * hacen ruido. Se calcula sobre `gestiones` —el universo traído— y nunca
   * sobre `filteredGestiones`: mirando lo ya filtrado, cada filtro se
   * escondería al usarlo y no habría forma de deshacerlo.
   */
  mostrarFiltroDocumento: boolean = false;
  mostrarFiltroCartera: boolean = false;
  mostrarFiltroTelefono: boolean = false;
  mostrarFiltroResultado: boolean = false;
  mostrarFiltroAsesor: boolean = false;

  /**
   * Las opciones de cada desplegable de la grilla, armadas con los valores que
   * de verdad están en el resultado. Ofrecer FALLECIDO cuando no hay ninguna
   * gestión con ese resultado es el mismo problema que ofrecer el filtro de DNI
   * después de buscar por DNI: una opción que solo puede devolver cero filas.
   */
  opcionesTramo: SelectOption[] = [];
  opcionesResultado: SelectOption[] = [];
  opcionesAsesor: SelectOption[] = [];

  // Dropdowns
  resultados: SelectOption[] = [];
  tramos: SelectOption[] = [];
  tipoBusqueda: SelectOption[] = [
    { label: 'Fechas', value: 'fechas' },
    { label: 'Documento', value: 'documento' },
    { label: 'Telefono', value: 'telefono' }
  ];

  selectedTipoBusqueda: string = 'fechas';
  selectedTramo: string = 'todos';

  // Sort
  sortField: string = '';
  sortOrder: number = 0; // 0 = none, 1 = asc, -1 = desc

  // Loading
  isLoading: boolean = false;
  isDownloadingMassive: boolean = false;

  constructor(
    private gestionHistoricaAudiosService: HistoricalRecordingsService,
    private ftpService: RecordingDownloadService,
    private audioEvaluacionService: RecordingEvaluationReportService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.tramos = [
      { label: 'Todos', value: 'todos' },
      { label: 'Tramo 3', value: 'FO_TRAMO 3' },
      { label: 'Tramo 5', value: 'FO_TRAMO 5' },
      { label: 'Cartera Propia', value: 'TRAMO' }
    ];

    this.resultados = [
      { label: 'Todos', value: '' },
      { label: 'FUERA DE SERVICIO - NO EXISTE', value: 'FUERA DE SERVICIO - NO EXISTE' },
      { label: 'APAGADO', value: 'APAGADO' },
      { label: 'NO CONTESTA', value: 'NO CONTESTA' },
      { label: 'MSJ VOZ - SMS - WSP - BAJO PUERTA', value: 'MSJ VOZ - SMS - WSP - BAJO PUERTA' },
      { label: 'EQUIVOCADO', value: 'EQUIVOCADO' },
      { label: 'CONTACTO CON TERCEROS', value: 'CONTACTO CON TERCEROS' },
      { label: 'CONTACTO CON TITULAR O ENCARGADO', value: 'CONTACTO CON TITULAR O ENCARGADO' },
      { label: 'OPORTUNIDAD DE PAGO', value: 'OPORTUNIDAD DE PAGO' },
      { label: 'FRACCIONADO O ARMADAS', value: 'FRACCIONADO O ARMADAS' },
      { label: 'PROMESA DE PAGO', value: 'PROMESA DE PAGO' },
      { label: 'RECORDATORIO DE PAGO', value: 'RECORDATORIO DE PAGO' },
      { label: 'CONFIRMACION DE ABONO', value: 'CONFIRMACION DE ABONO' },
      { label: 'CANCELACION PARCIAL', value: 'CANCELACION PARCIAL' },
      { label: 'CANCELACION TOTAL', value: 'CANCELACION TOTAL' },
      { label: 'CANCELACION NO REPORTADAS O APLICADAS', value: 'CANCELACION NO REPORTADAS O APLICADAS' },
      { label: 'FALLECIDO', value: 'FALLECIDO' }
    ];
  }

  changeTypeSearch(): void {
    this.startDate = '';
    this.endDate = '';
    this.documento = '';
    this.telefono = '';
    this.errorMessage = '';
  }

  validateDates(): void {
    this.errorMessage = '';

    if (this.startDate && this.endDate) {
      const start = new Date(this.startDate);
      const end = new Date(this.endDate);

      if (start > end) {
        this.errorMessage = 'La fecha de inicio debe ser anterior a la fecha de fin.';
        return;
      }

      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > 2) {
        this.errorMessage = 'La diferencia entre las fechas no puede ser mayor a 2 días.';
      }
    } else {
      this.errorMessage = 'Por favor, selecciona ambas fechas.';
    }
  }

  searchByDates(): void {
    if (!this.startDate || !this.endDate) {
      this.toastService.error('Por favor, selecciona ambas fechas.');
      return;
    }

    if (this.errorMessage) {
      this.toastService.error('Verificar la validación de las fechas.');
      return;
    }

    this.isLoading = true;

    const dateRangeRequest: HistoricalRecordingsByDateRangeRequest = {
      tramo: this.selectedTramo,
      startDate: this.startDate,
      endDate: this.endDate
    };

    this.gestionHistoricaAudiosService.getGestionHistoricaAudiosByDateRange(dateRangeRequest).subscribe({
      next: (data: any) => {
        this.cargarResultados(data);
        this.isLoading = false;
        this.toastService.success(`Se encontraron ${data.length} grabaciones.`);
      },
      error: (error: any) => {
        console.log(error);
        this.toastService.error('No se pudo cargar los datos.');
        this.isLoading = false;
      }
    });
  }

  searchByDocumento(): void {
    if (!this.documento) {
      this.toastService.error('Por favor, ingresa un documento.');
      return;
    }

    this.isLoading = true;

    const documentoRequest: HistoricalRecordingsByDocumentRequest = {
      tramo: this.selectedTramo,
      documento: this.documento
    };

    this.gestionHistoricaAudiosService.getGestionHistoricaAudiosByDocumento(documentoRequest).subscribe({
      next: (data: any) => {
        this.cargarResultados(data);
        this.isLoading = false;
        this.toastService.success(`Se encontraron ${data.length} grabaciones.`);
      },
      error: (error: any) => {
        console.log(error);
        this.toastService.error('No se pudo cargar los datos.');
        this.isLoading = false;
      }
    });
  }

  searchByTelefono(): void {
    if (!this.telefono) {
      this.toastService.error('Por favor, ingresa un teléfono.');
      return;
    }

    this.isLoading = true;

    const telefonoRequest: HistoricalRecordingsByPhoneRequest = {
      tramo: this.selectedTramo,
      telefono: this.telefono
    };

    this.gestionHistoricaAudiosService.getGestionHistoricaAudiosByTelefono(telefonoRequest).subscribe({
      next: (data: any) => {
        this.cargarResultados(data);
        this.isLoading = false;
        this.toastService.success(`Se encontraron ${data.length} grabaciones.`);
      },
      error: (error: any) => {
        console.log(error);
        this.toastService.error('No se pudo cargar los datos.');
        this.isLoading = false;
      }
    });
  }

  /**
   * Deja la grilla lista con lo que acaba de traer el backend.
   *
   * Limpia los filtros de columna antes de mostrar: si venían de la búsqueda
   * anterior seguirían aplicándose sobre datos nuevos, y encima invisibles
   * cuando la columna deja de ofrecer su caja —el supervisor vería menos filas
   * de las que trajo su búsqueda sin nada en pantalla que lo explique.
   */
  private cargarResultados(data: Recording[]): void {
    this.gestiones = data;
    this.initialValue = [...data];
    this.filterDocumento = '';
    this.filterTelefono = '';
    this.filterCartera = '';
    this.filterResultado = '';
    this.filterAsesor = '';
    this.actualizarFiltrosDisponibles();
    this.applyFilters();
  }

  /**
   * Qué cajas de filtro se dibujan y con qué opciones, según el resultado.
   * Ver la nota de `mostrarFiltroDocumento` para el criterio.
   */
  private actualizarFiltrosDisponibles(): void {
    const carteras = this.valoresDistintos(g => g.cartera);
    const resultadosPresentes = this.valoresDistintos(g => g.resultado);
    const asesores = this.valoresDistintos(g => g.usuarioregistra);

    this.mostrarFiltroDocumento = this.valoresDistintos(g => g.documento).length > 1;
    this.mostrarFiltroTelefono = this.valoresDistintos(g => g.telefono).length > 1;
    this.mostrarFiltroCartera = carteras.length > 1;
    this.mostrarFiltroResultado = resultadosPresentes.length > 1;
    this.mostrarFiltroAsesor = asesores.length > 1;

    // El tramo sale del dato y no del catálogo de `tramos`: la grilla muestra
    // la cartera tal cual viene ('FO_TRAMO 3'), y una cartera que el catálogo
    // no contemple quedaría sin forma de filtrarse. El catálogo solo aporta la
    // etiqueta corta cuando el valor coincide.
    this.opcionesTramo = [
      { label: 'Todos', value: '' },
      ...carteras.map(cartera => ({
        label: this.tramos.find(opcion => opcion.value === cartera)?.label ?? cartera,
        value: cartera
      }))
    ];

    // El catálogo de resultados va de peor a mejor gestión, así que se filtra
    // conservando ese orden en vez de reordenar alfabéticamente.
    this.opcionesResultado = this.resultados.filter(
      opcion => !opcion.value || resultadosPresentes.includes(opcion.value)
    );

    this.opcionesAsesor = [
      { label: 'Todos', value: '' },
      ...asesores.map(asesor => ({ label: asesor, value: asesor }))
    ];
  }

  /** Los valores distintos de una columna en lo traído, ordenados y sin vacíos. */
  private valoresDistintos(columna: (gestion: Recording) => string): string[] {
    const valores = new Set<string>();
    this.gestiones.forEach(gestion => {
      const valor = columna(gestion);
      if (valor) {
        valores.add(valor);
      }
    });
    return [...valores].sort((a, b) => a.localeCompare(b));
  }

  /** Si la fila de filtros tiene algo que mostrar. */
  get hayFiltrosDisponibles(): boolean {
    return this.mostrarFiltroDocumento
      || this.mostrarFiltroTelefono
      || this.mostrarFiltroCartera
      || this.mostrarFiltroResultado
      || this.mostrarFiltroAsesor;
  }

  applyFilters(): void {
    // Los despliegues abiertos no sobreviven a un cambio de resultados: la fila
    // que estaba abierta puede no estar en la lista nueva, y dejar el idx marcado
    // haría que se abriera sola una gestión distinta que reutilice la posición.
    this.gestionesDesplegadas.clear();

    let filtered = [...this.gestiones];

    if (this.filterDocumento) {
      filtered = filtered.filter(g =>
        g.documento.toLowerCase().includes(this.filterDocumento.toLowerCase())
      );
    }

    if (this.filterTelefono) {
      filtered = filtered.filter(g =>
        g.telefono.toLowerCase().includes(this.filterTelefono.toLowerCase())
      );
    }

    if (this.filterCartera) {
      filtered = filtered.filter(g => g.cartera === this.filterCartera);
    }

    if (this.filterResultado) {
      filtered = filtered.filter(g => g.resultado === this.filterResultado);
    }

    if (this.filterAsesor) {
      filtered = filtered.filter(g => g.usuarioregistra === this.filterAsesor);
    }

    this.filteredGestiones = filtered;
    this.currentPage = 1;
    this.updatePagination();
  }

  clearFilters(): void {
    this.filterDocumento = '';
    this.filterTelefono = '';
    this.filterCartera = '';
    this.filterResultado = '';
    this.filterAsesor = '';
    this.applyFilters();
  }

  sort(field: string): void {
    if (this.sortField === field) {
      // Cycle through: asc -> desc -> none
      if (this.sortOrder === 1) {
        this.sortOrder = -1;
      } else if (this.sortOrder === -1) {
        this.sortOrder = 0;
        this.sortField = '';
        this.filteredGestiones = [...this.gestiones];
        this.applyFilters();
        return;
      }
    } else {
      this.sortField = field;
      this.sortOrder = 1;
    }

    this.filteredGestiones.sort((a: any, b: any) => {
      const value1 = a[field];
      const value2 = b[field];
      let result = 0;

      if (value1 == null && value2 != null) result = -1;
      else if (value1 != null && value2 == null) result = 1;
      else if (value1 == null && value2 == null) result = 0;
      else if (typeof value1 === 'string' && typeof value2 === 'string') {
        result = value1.localeCompare(value2);
      } else {
        result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;
      }

      return this.sortOrder * result;
    });

    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredGestiones.length / this.pageSize);
    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedGestiones = this.filteredGestiones.slice(startIndex, endIndex);
  }

  onPageSizeChange(newSize: number): void {
    this.pageSize = newSize;
    this.currentPage = 1;
    this.updatePagination();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  // ------------------------------------------------------------------ audios de la gestión

  /** Las gestiones desplegadas, por idx. Se cierra todo al hacer una búsqueda nueva. */
  gestionesDesplegadas = new Set<number>();

  /**
   * Los WAV de una gestión, ya separados.
   *
   * NOMBRE y DURACION traen un valor por archivo separado por coma; ANIO, MES y
   * DIA traen UNO SOLO para toda la gestión aunque tenga varias grabaciones.
   * Verificado sobre producción: de las 755 gestiones con más de un WAV, cero
   * tienen DURACION desalineada de NOMBRE, y las 755 tienen ANIO sin partir.
   *
   * De ahí la regla de `alineado`: un valor único vale para todos los audios
   * —son del mismo día, por definición—, y varios valores se toman por posición.
   */
  audiosDe(gestion: Recording): AudioDeGestion[] {
    const nombres = this.partir(gestion.nombre);
    const anios = this.partir(gestion.anio);
    const meses = this.partir(gestion.mes);
    const dias = this.partir(gestion.dia);
    const duraciones = this.partir(gestion.duracion);

    return nombres.map((nombre, i) => ({
      nombre,
      anio: this.alineado(anios, i),
      mes: this.alineado(meses, i),
      dia: this.alineado(dias, i),
      duracion: this.formatearDuracion(this.alineado(duraciones, i))
    }));
  }

  /**
   * El valor que le toca al audio i.
   *
   * Un valor único se aplica a todos —es el caso de ANIO/MES/DIA, que describen
   * la gestión y no el archivo—; con varios se toma el de la posición. Devolver
   * vacío al segundo audio, como hacía antes, obligaba al backend a resolverlo
   * por su índice global de S3 en vez de ir directo a la carpeta del día.
   */
  private alineado(valores: string[], i: number): string {
    if (valores.length === 0) {
      return '';
    }
    return valores.length === 1 ? valores[0] : (valores[i] ?? '');
  }

  /**
   * DURACION viene en segundos con decimales ('179.96', '1225.40'), que no le
   * dice nada a nadie. Se muestra como m:ss.
   */
  private formatearDuracion(segundos: string): string {
    const valor = Number(segundos);
    if (!segundos || Number.isNaN(valor)) {
      return '';
    }
    const total = Math.round(valor);
    const minutos = Math.floor(total / 60);
    const resto = total % 60;
    return `${minutos}:${resto.toString().padStart(2, '0')}`;
  }

  private partir(valor: string): string[] {
    if (!valor) {
      return [];
    }
    return String(valor).split(',').map(parte => parte.trim()).filter(parte => parte.length > 0);
  }

  /** Cuántas grabaciones tiene la gestión. Decide si la fila se puede desplegar. */
  cantidadAudios(gestion: Recording): number {
    return this.partir(gestion.nombre).length;
  }

  estaDesplegada(gestion: Recording): boolean {
    return this.gestionesDesplegadas.has(gestion.idx);
  }

  alternarDespliegue(gestion: Recording): void {
    if (this.gestionesDesplegadas.has(gestion.idx)) {
      this.gestionesDesplegadas.delete(gestion.idx);
    } else {
      this.gestionesDesplegadas.add(gestion.idx);
    }
  }

  /**
   * Descarga TODOS los audios de la gestión, uno por archivo.
   *
   * Es el botón de la fila. El asesor que quiera solo uno lo baja desde el
   * desplegable con `downloadAudioSuelto`.
   */
  downloadAudio(gestion: Recording): void {
    const audios = this.audiosDe(gestion);
    audios.forEach((audio, i) => this.descargar(gestion, audio, i));
  }

  /** Descarga un solo WAV, el que el asesor eligió en el desplegable. */
  downloadAudioSuelto(gestion: Recording, audio: AudioDeGestion, indice: number): void {
    this.descargar(gestion, audio, indice);
  }

  /**
   * El sufijo `(n)` va por POSICIÓN dentro de la gestión, no por orden de
   * descarga: así el segundo audio se llama siempre igual, lo baje suelto o
   * dentro de la descarga completa.
   */
  private descargar(gestion: Recording, audio: AudioDeGestion, indice: number): void {
    const newFechaGestion = gestion.fechagestion.replace(/-/g, '');
    const base = `audio-${newFechaGestion}-${gestion.resultado}-${gestion.telefono}-${gestion.documento}-${gestion.cliente}-${gestion.usuarioregistra}`;

    const downloadHistoricoAudioRequest: RecordingDownloadRequest = {
      anio: audio.anio,
      mes: audio.mes,
      dia: audio.dia,
      nombre: audio.nombre,
      fecha: newFechaGestion,
      resultado: gestion.resultado,
      telefono: gestion.telefono,
      documento: gestion.documento,
      cliente: gestion.cliente,
      asesor: gestion.usuarioregistra
    };

    this.ftpService.downloadGestionHistoricaAudioFileByName(downloadHistoricoAudioRequest).subscribe({
      next: (data: Blob) => {
        const url = window.URL.createObjectURL(data);
        const a = document.createElement('a');
        a.href = url;
        a.download = indice > 0 ? `${base}(${indice}).WAV` : `${base}.WAV`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        this.toastService.success('Audio descargado correctamente.');
      },
      error: (error: any) => {
        this.toastService.error('No se encontró el audio.');
        console.log(error);
      }
    });
  }

  // ------------------------------------------------------------------ transcripción

  /**
   * El modal de transcripción.
   *
   * Los cuatro campos son estados excluyentes de la misma vista: cargando, error,
   * sin texto (`partes` vacío) o con texto. Se separan `isLoading` y `error`
   * porque "todavía no llegó" y "no se pudo traer" no pueden verse igual.
   *
   * El estado "sin texto" sigue existiendo aunque el botón ya solo aparezca en las
   * gestiones que tienen transcripción: `tieneTranscripcion` es una foto del
   * momento en que se cargó la grilla, y el pipeline puede rehacer esa fila
   * mientras el supervisor mira la pantalla.
   */
  transcripcionAbierta: boolean = false;
  transcripcionCargando: boolean = false;
  transcripcionError: boolean = false;
  transcripcionPartes: Transcription[] = [];
  transcripcionGestion: Recording | null = null;

  /**
   * Abre el modal y pide el texto de la gestión.
   *
   * Se pide por idx y sin nombre de archivo: el botón es uno por gestión, así
   * que trae todas las partes que haya en `audios_transcripcion` y el modal las
   * apila rotuladas con su título.
   *
   * El modal se abre ANTES de que responda el backend, mostrando el estado de
   * carga: la consulta va contra la base de producción y puede demorar, y abrir
   * al final dejaría al supervisor sin saber si su click hizo algo.
   */
  verTranscripcion(gestion: Recording): void {
    this.transcripcionGestion = gestion;
    this.transcripcionPartes = [];
    this.transcripcionError = false;
    this.transcripcionCargando = true;
    this.transcripcionAbierta = true;

    this.gestionHistoricaAudiosService.getTranscripcionByIdx(gestion.idx).subscribe({
      next: (partes: any) => {
        this.transcripcionPartes = partes ?? [];
        this.transcripcionCargando = false;
      },
      error: (error: any) => {
        console.log(error);
        this.transcripcionError = true;
        this.transcripcionCargando = false;
      }
    });
  }

  cerrarTranscripcion(): void {
    this.transcripcionAbierta = false;
    this.transcripcionGestion = null;
    this.transcripcionPartes = [];
    this.transcripcionError = false;
    this.transcripcionCargando = false;
  }

  downloadReport(gestion: Recording): void {
    const createAudioEvaluacionFileRequest: CreateRecordingEvaluationReportRequest = {
      dni: gestion.documento,
      cliente: gestion.cliente,
      telefono: gestion.telefono,
      fecha: gestion.fechagestion,
      asesor: gestion.usuarioregistra,
      resultado: gestion.resultado,
      gestionHistoricaAudioIdx: gestion.idx
    };

    const newFechaGestion = gestion.fechagestion.replace(/-/g, '');

    this.audioEvaluacionService.downloadGestionHistoricaReporteFile(createAudioEvaluacionFileRequest).subscribe({
      next: (data: Blob) => {
        const url = window.URL.createObjectURL(data);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reporte-${newFechaGestion}-${gestion.resultado}-${gestion.telefono}-${gestion.documento}-${gestion.cliente}-${gestion.usuarioregistra}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        this.toastService.success('Reporte descargado correctamente.');
      },
      error: (error: any) => {
        this.toastService.error('No se encontró el reporte en la base de datos.');
        console.log(error);
      }
    });
  }

  massiveDownloadAudios(): void {
    const audiosToDownload = this.filteredGestiones.length > 0 ? this.filteredGestiones : this.gestiones;

    if (audiosToDownload.length === 0) {
      this.toastService.error('No hay datos para descargar.');
      return;
    }

    this.isDownloadingMassive = true;
    this.toastService.info('Procesando descarga masiva de audios...');

    const downloadHistoricoAudioRequests: RecordingDownloadRequest[] = [];

    // Una petición por ARCHIVO: la masiva se lleva todas las grabaciones de cada
    // gestión, sin importar si la fila está desplegada o no.
    audiosToDownload.forEach((gestion: Recording) => {
      const newFechaGestion = gestion.fechagestion.replace(/-/g, '');

      this.audiosDe(gestion).forEach((audio: AudioDeGestion) => {
        downloadHistoricoAudioRequests.push({
          anio: audio.anio,
          mes: audio.mes,
          dia: audio.dia,
          nombre: audio.nombre,
          fecha: newFechaGestion,
          resultado: gestion.resultado,
          telefono: gestion.telefono,
          documento: gestion.documento,
          cliente: gestion.cliente,
          asesor: gestion.usuarioregistra
        });
      });
    });

    this.ftpService.downloadGestionHistoricaAudioFiles(downloadHistoricoAudioRequests).subscribe({
      next: (data: Blob) => {
        const url = window.URL.createObjectURL(data);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'audios.zip';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        this.isDownloadingMassive = false;
        this.toastService.success('Los audios fueron descargados correctamente.');
      },
      error: (error: any) => {
        console.log(error);
        this.isDownloadingMassive = false;
        this.toastService.error('Un error ha ocurrido al realizar la descarga.');
      }
    });
  }

  massiveDownloadReports(): void {
    const reportsToDownload = this.filteredGestiones.length > 0 ? this.filteredGestiones : this.gestiones;

    if (reportsToDownload.length === 0) {
      this.toastService.error('No hay datos para descargar.');
      return;
    }

    this.isDownloadingMassive = true;
    this.toastService.info('Procesando descarga masiva de reportes...');

    const createAudioEvaluacionFileRequests: CreateRecordingEvaluationReportRequest[] = [];

    reportsToDownload.forEach((gestion: Recording) => {
      const createAudioEvaluacionFileRequest: CreateRecordingEvaluationReportRequest = {
        dni: gestion.documento,
        cliente: gestion.cliente,
        telefono: gestion.telefono,
        fecha: gestion.fechagestion,
        asesor: gestion.usuarioregistra,
        resultado: gestion.resultado,
        gestionHistoricaAudioIdx: gestion.idx
      };

      createAudioEvaluacionFileRequests.push(createAudioEvaluacionFileRequest);
    });

    this.audioEvaluacionService.downloadGestionHistoricaReporteFiles(createAudioEvaluacionFileRequests).subscribe({
      next: (data: Blob) => {
        const url = window.URL.createObjectURL(data);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'reportes.zip';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        this.isDownloadingMassive = false;
        this.toastService.success('Los reportes fueron descargados correctamente.');
      },
      error: (error: any) => {
        console.log(error);
        this.isDownloadingMassive = false;
        this.toastService.error('Un error ha ocurrido al realizar la descarga.');
      }
    });
  }

  canDownloadReport(resultado: string): boolean {
    return resultado === 'PROMESA DE PAGO' || resultado === 'CONTACTO CON TITULAR O ENCARGADO';
  }
}
