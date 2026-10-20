import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Volume2, Download, Search, Calendar, X, Disc, FileAudio, Loader, FileSpreadsheet, ChevronDown, ChevronUp } from 'lucide-angular';

import { CustomSelectComponent, SelectOption } from '../../../shared/components/custom-ui/custom-select/custom-select.component';
import { ToastService } from '../../../shared/services/toast.service';
import { AdminRecordingsService, RecordingDTO } from '../../../core/services/admin-recordings.service';
import { QualityMonitorComponent } from '../../legacy/recordings/components/quality-monitor/quality-monitor.component';
import { TenantService } from '../../../maintenance/services/tenant.service';
import { PortfolioService } from '../../../maintenance/services/portfolio.service';
import { Tenant } from '../../../maintenance/models/tenant.model';
import { Portfolio, SubPortfolio } from '../../../maintenance/models/portfolio.model';

/**
 * Tope del rango de fechas de la busqueda. Es el unico freno que existe hoy:
 * el backend no valida el rango, asi que este numero es la unica proteccion
 * contra una consulta de meses sobre una subcartera con volumen.
 */
const MAX_DIAS_RANGO = 31;

/**
 * Las dos vistas de este módulo.
 *
 * Monitoreo es la MISMA pantalla que la de Grabaciones Históricas, montada con
 * `modo="discador"`: mismas reglas, mismo cálculo de cumplimiento, misma ficha. Lo único
 * que cambia es de dónde salen las filas y cómo se resuelve el audio, y eso vive en
 * `MONITORING_MODES` y no acá.
 *
 * Se montan con `*ngIf` y no con `[hidden]`: cambiar de pestaña descarta el estado de la
 * otra, que es lo correcto. Son dos preguntas distintas —«quiero oír esta llamada» y
 * «cómo viene el equipo»— y conservar los filtros de una al volver de la otra confunde.
 */
type Pestana = 'grabaciones' | 'monitoreo';

/**
 * Una gestión con sus llamadas, que es la unidad que lista la pantalla.
 *
 * Antes la grilla mostraba una fila por llamada. Como una gestión puede abarcar
 * varias (la del discador más sus rellamadas, o una manual más las suyas), dos o
 * tres filas seguidas salían con el mismo cliente, documento, teléfono y
 * tipificación, y solo cambiaba la hora: parecían el mismo registro repetido.
 * Ahora la fila es la gestión y las llamadas van adentro.
 *
 * `principal` es la primera llamada por fecha. De ahí salen los datos de cabecera
 * y la fecha por la que se ordena: lo que se busca es cuándo empezó la gestión.
 *
 * `llamadas` son las que pasaron el filtro de la tabla, y `totalGestion` cuántas
 * tiene la gestión de verdad. Pueden no coincidir: una llamada fuera del rango de
 * fechas, o una que perdió su uuid y no entra en la búsqueda, dejan el grupo corto.
 * Por eso se muestran los dos números y se puede traer el resto.
 */
interface GrupoGestion {
  /** Identifica la fila. Por gestión, o por uuid cuando la llamada no tiene una. */
  clave: string;
  idGestion: number | null;
  principal: RecordingDTO;
  llamadas: RecordingDTO[];
  totalGestion: number;
  /** Las que se trajeron aparte y el filtro de la tabla no había dejado pasar. */
  fueraDelFiltro: Set<string>;
}

@Component({
  selector: 'app-admin-recordings',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, CustomSelectComponent,
            QualityMonitorComponent],
  templateUrl: './admin-recordings.component.html',
  styleUrls: ['./admin-recordings.component.css']
})
export class AdminRecordingsComponent implements OnInit {
  readonly Volume2 = Volume2;
  readonly Download = Download;
  readonly Search = Search;
  readonly Calendar = Calendar;
  readonly X = X;
  readonly Disc = Disc;
  readonly FileAudio = FileAudio;
  readonly Loader = Loader;
  readonly FileSpreadsheet = FileSpreadsheet;
  readonly ChevronDown = ChevronDown;
  readonly ChevronUp = ChevronUp;
  readonly Math = Math;

  pestana: Pestana = 'grabaciones';

  seleccionar(pestana: Pestana): void {
    this.pestana = pestana;
  }

  // Data. `recordings` y `filteredRecordings` siguen siendo llamadas: son la unidad
  // que baja del backend y la que se descarga en el zip. `grupos` es lo que se pinta.
  recordings: RecordingDTO[] = [];
  filteredRecordings: RecordingDTO[] = [];
  grupos: GrupoGestion[] = [];
  paginatedGrupos: GrupoGestion[] = [];
  hasSearched: boolean = false;

  // Tenant/Portfolio/SubPortfolio cascade
  tenants: Tenant[] = [];
  portfolios: Portfolio[] = [];
  subPortfolios: SubPortfolio[] = [];
  selectedTenantId: number = 0;
  selectedPortfolioId: number = 0;
  selectedSubPortfolioId: number = 0;

  // Pagination
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;
  pageSizeOptions: SelectOption[] = [
    { label: '5', value: 5 },
    { label: '10', value: 10 },
    { label: '20', value: 20 },
    { label: '50', value: 50 }
  ];

  // Search fields
  startDate: string = '';
  endDate: string = '';
  documento: string = '';
  telefono: string = '';
  rutaNivel1: string = '';
  errorMessage: string = '';

  /** Tipificaciones de nivel 1 para el combo del filtro. */
  tipificaciones: string[] = [];

  // Filter fields
  filterDocumento: string = '';
  filterTelefono: string = '';
  filterCampana: string = '';
  filterAgente: string = '';
  filterTipificacion: string = '';

  // Sort
  sortField: string = '';
  sortOrder: number = 0;

  // Loading
  isLoading: boolean = false;
  isDownloadingMassive: boolean = false;
  downloadingUuid: string = '';
  // Id numérico y no uuid, para que el spinner del reporte sea independiente del
  // de audio: bajar el audio de una fila no debe girar el botón de reporte.
  downloadingReporteId: number | null = null;

  // Las gestiones arrancan plegadas: con varias en pantalla, todas abiertas a la vez
  // tapan la tabla. Acá viven las que el usuario abrió.
  gruposAbiertos = new Set<string>();
  cargandoGestion: number | null = null;
  /** Detalle completo por gestión, para las llamadas que el filtro dejó fuera. */
  llamadasPorGestion = new Map<number, RecordingDTO[]>();

  constructor(
    private recordingsService: AdminRecordingsService,
    private tenantService: TenantService,
    private portfolioService: PortfolioService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadTenants();
    this.loadTipificaciones();
  }

  private loadTipificaciones(): void {
    this.recordingsService.getTipificaciones().subscribe({
      next: (data) => this.tipificaciones = data,
      error: (err) => console.error('No se pudieron cargar las tipificaciones', err)
    });
  }

  // === Cascade selectors ===

  loadTenants(): void {
    this.tenantService.getAllTenants().subscribe({
      next: (data) => { this.tenants = data; },
      error: (err) => { console.error('Error loading tenants:', err); }
    });
  }

  onTenantChange(): void {
    this.portfolios = [];
    this.subPortfolios = [];
    this.selectedPortfolioId = 0;
    this.selectedSubPortfolioId = 0;

    if (this.selectedTenantId > 0) {
      this.portfolioService.getPortfoliosByTenant(this.selectedTenantId).subscribe({
        next: (data) => { this.portfolios = data; },
        error: (err) => { console.error('Error loading portfolios:', err); }
      });
    }
  }

  onPortfolioChange(): void {
    this.subPortfolios = [];
    this.selectedSubPortfolioId = 0;

    if (this.selectedPortfolioId > 0) {
      this.portfolioService.getSubPortfoliosByPortfolio(this.selectedPortfolioId).subscribe({
        next: (data) => { this.subPortfolios = data; },
        error: (err) => { console.error('Error loading sub-portfolios:', err); }
      });
    }
  }

  // === Search ===

  limpiarBusqueda(): void {
    this.startDate = '';
    this.endDate = '';
    this.documento = '';
    this.telefono = '';
    this.rutaNivel1 = '';
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

      if (diffDays > MAX_DIAS_RANGO) {
        this.errorMessage = `La diferencia entre las fechas no puede ser mayor a ${MAX_DIAS_RANGO} días.`;
      }
    }
  }

  /**
   * Los filtros de columna son de la tabla, no de la búsqueda: si quedan puestos
   * de una consulta anterior recortan la siguiente en silencio. Un filtro de
   * campaña, por ejemplo, se lleva por delante todas las manuales, que salen
   * como "Llamada Manual".
   */
  private resetTableFilters(): void {
    this.filterDocumento = '';
    this.filterTelefono = '';
    this.filterCampana = '';
    this.filterAgente = '';
    this.filterTipificacion = '';
  }

  private validatePortfolioSelection(): boolean {
    if (!this.selectedTenantId || !this.selectedPortfolioId || !this.selectedSubPortfolioId) {
      this.toastService.error('Por favor, selecciona Proveedor, Cartera y Subcartera.');
      return false;
    }
    return true;
  }

  /**
   * Los criterios se combinan: fecha, documento, telefono o cualquier mezcla.
   * Basta con uno. El rango de fechas exige ambos extremos porque un rango a
   * medias no es un rango; documento y telefono sueltos si buscan todo el historico.
   */
  buscar(): void {
    if (!this.validatePortfolioSelection()) return;

    const doc = this.documento.trim();
    const tel = this.telefono.trim();
    const ruta = this.rutaNivel1.trim();
    const hayFecha = !!(this.startDate || this.endDate);

    if (!hayFecha && !doc && !tel && !ruta) {
      this.toastService.error('Ingresa al menos un criterio: fechas, documento, teléfono o tipificación.');
      return;
    }
    if (hayFecha && !(this.startDate && this.endDate)) {
      this.toastService.error('Para buscar por fechas indica ambas: Desde y Hasta.');
      return;
    }
    if (this.errorMessage) {
      this.toastService.error('Verificar la validación de las fechas.');
      return;
    }

    this.resetTableFilters();
    this.gruposAbiertos.clear();
    this.llamadasPorGestion.clear();
    this.isLoading = true;
    this.recordingsService.search(
      this.selectedTenantId, this.selectedPortfolioId, this.selectedSubPortfolioId,
      {
        fechaDesde: this.startDate || undefined,
        fechaHasta: this.endDate || undefined,
        documento: doc || undefined,
        telefono: tel || undefined,
        rutaNivel1: ruta || undefined
      }
    ).subscribe({
      next: (data) => {
        this.recordings = data;
        this.hasSearched = true;
        this.applyFilters();
        this.isLoading = false;
        this.toastService.success(`Se encontraron ${data.length} grabaciones.`);
      },
      error: (err) => {
        console.error(err);
        this.toastService.error('No se pudo cargar los datos.');
        this.isLoading = false;
      }
    });
  }

  // === Filters ===

  applyFilters(): void {
    let filtered = [...this.recordings];

    if (this.filterDocumento) {
      filtered = filtered.filter(r => r.documento?.toLowerCase().includes(this.filterDocumento.toLowerCase()));
    }
    if (this.filterTelefono) {
      filtered = filtered.filter(r => r.telefono?.toLowerCase().includes(this.filterTelefono.toLowerCase()));
    }
    if (this.filterCampana) {
      filtered = filtered.filter(r => r.campana?.toLowerCase().includes(this.filterCampana.toLowerCase()));
    }
    if (this.filterAgente) {
      filtered = filtered.filter(r => r.agente?.toLowerCase().includes(this.filterAgente.toLowerCase()));
    }
    if (this.filterTipificacion) {
      filtered = filtered.filter(r => r.tipificacion === this.filterTipificacion);
    }

    // El filtro se aplica sobre llamadas y recién después se agrupa, para que
    // filtrar por agente muestre lo que hizo ese agente y no lo de sus compañeros
    // que tocaron la misma gestión. La gestión aparece si alguna llamada calza.
    this.filteredRecordings = filtered;
    this.grupos = this.agrupar(filtered);
    this.ordenarGrupos();
    this.currentPage = 1;
    this.updatePagination();
  }

  /**
   * Junta las llamadas por gestión conservando el orden en que vinieron.
   *
   * Las que no tienen gestión van cada una por su cuenta: no hay nada que las
   * relacione y meterlas juntas mezclaría clientes distintos en una misma fila.
   */
  private agrupar(llamadas: RecordingDTO[]): GrupoGestion[] {
    const grupos = new Map<string, GrupoGestion>();

    for (const llamada of llamadas) {
      const clave = llamada.idGestion ? `g${llamada.idGestion}` : `u${llamada.uuidLlamada}`;
      const grupo = grupos.get(clave);
      if (grupo) {
        grupo.llamadas.push(llamada);
      } else {
        grupos.set(clave, {
          clave,
          idGestion: llamada.idGestion ?? null,
          principal: llamada,
          llamadas: [llamada],
          totalGestion: llamada.llamadasGestion ?? 1,
          fueraDelFiltro: new Set<string>()
        });
      }
    }

    for (const grupo of grupos.values()) {
      this.ordenarLlamadas(grupo);
    }
    return [...grupos.values()];
  }

  /** Cronológico dentro de la gestión, y la primera manda en la cabecera. */
  private ordenarLlamadas(grupo: GrupoGestion): void {
    grupo.llamadas.sort((a, b) => (a.fechaInicio || '').localeCompare(b.fechaInicio || ''));
    grupo.principal = grupo.llamadas[0];
  }

  clearFilters(): void {
    this.resetTableFilters();
    this.applyFilters();
  }

  // === Sorting ===

  sort(field: string): void {
    if (this.sortField === field) {
      if (this.sortOrder === 1) {
        this.sortOrder = -1;
      } else if (this.sortOrder === -1) {
        this.sortOrder = 0;
        this.sortField = '';
        this.applyFilters();
        return;
      }
    } else {
      this.sortField = field;
      this.sortOrder = 1;
    }

    this.ordenarGrupos();
    this.updatePagination();
  }

  /**
   * Ordena las filas por el campo elegido, leyéndolo de la llamada principal:
   * la fila es la gestión, así que ordenar por fecha es ordenar por cuándo empezó.
   */
  private ordenarGrupos(): void {
    if (!this.sortField || this.sortOrder === 0) return;
    const field = this.sortField;

    this.grupos.sort((ga, gb) => {
      const v1 = (ga.principal as any)[field], v2 = (gb.principal as any)[field];
      let result = 0;
      if (v1 == null && v2 != null) result = -1;
      else if (v1 != null && v2 == null) result = 1;
      else if (v1 == null && v2 == null) result = 0;
      else if (typeof v1 === 'string') result = v1.localeCompare(v2);
      else result = v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
      return this.sortOrder * result;
    });
  }

  // === Pagination ===

  updatePagination(): void {
    // Se pagina por gestión, no por llamada: una página de 10 puede traer más
    // de 10 audios si alguna gestión tuvo rellamadas.
    this.totalPages = Math.max(1, Math.ceil(this.grupos.length / this.pageSize));
    if (this.currentPage > this.totalPages) this.currentPage = 1;
    const start = (this.currentPage - 1) * this.pageSize;
    this.paginatedGrupos = this.grupos.slice(start, start + this.pageSize);
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
    if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }

  // === Llamadas de la gestión ===

  /**
   * Cuántas llamadas tuvo la gestión de verdad, no cuántas pasaron el filtro.
   *
   * `totalGestion` lo cuenta el backend sobre gestion_llamada; `llamadas` son las que
   * entraron en la búsqueda. Contar estas últimas hacía que la fila dijera "2 llamadas"
   * y pasara a 3 al abrirla, que es el momento en que se piden las que faltaban.
   */
  cantidadLlamadas(grupo: GrupoGestion): number {
    return Math.max(grupo.totalGestion, grupo.llamadas.length);
  }

  /** Una gestión de una sola llamada se pinta como fila simple, sin desplegable. */
  tieneVariasLlamadas(grupo: GrupoGestion): boolean {
    return this.cantidadLlamadas(grupo) > 1;
  }

  estaAbierto(grupo: GrupoGestion): boolean {
    return this.tieneVariasLlamadas(grupo) && this.gruposAbiertos.has(grupo.clave);
  }

  /**
   * Al abrir se traen de una las llamadas que la búsqueda dejó fuera, para que la
   * gestión se vea completa sin que el usuario tenga que pedirlo.
   *
   * Se hace acá y no al pintar la tabla porque serían tantas consultas como gestiones
   * en pantalla; abriendo es una sola, y la respuesta queda cacheada.
   */
  alternarGrupo(grupo: GrupoGestion): void {
    if (this.gruposAbiertos.has(grupo.clave)) {
      this.gruposAbiertos.delete(grupo.clave);
      return;
    }
    this.gruposAbiertos.add(grupo.clave);
    if (this.faltanLlamadas(grupo)) {
      this.completarGestion(grupo);
    }
  }

  /** Quedaron llamadas de esta gestión fuera del filtro o del rango de fechas. */
  faltanLlamadas(grupo: GrupoGestion): boolean {
    return !!grupo.idGestion && grupo.totalGestion > grupo.llamadas.length;
  }

  /**
   * Trae las llamadas de la gestión que la búsqueda no devolvió y las suma a la
   * fila, marcadas para que se note que no cumplen el filtro vigente.
   *
   * No se hace solo al pintar: serían tantas consultas como gestiones en pantalla,
   * y casi siempre el grupo ya está completo.
   */
  completarGestion(grupo: GrupoGestion): void {
    if (!grupo.idGestion) return;
    const idGestion = grupo.idGestion;

    const enCache = this.llamadasPorGestion.get(idGestion);
    if (enCache) {
      this.fusionar(grupo, enCache);
      return;
    }

    this.cargandoGestion = idGestion;
    this.recordingsService.getLlamadasDeGestion(idGestion).subscribe({
      next: (data) => {
        // Las manuales pueden venir sin documento; se hereda el de la fila para
        // que el nombre del audio descargado no salga con "null".
        data.forEach(d => d.documento = d.documento || grupo.principal.documento);
        this.llamadasPorGestion.set(idGestion, data);
        this.fusionar(grupo, data);
        this.cargandoGestion = null;
      },
      error: (err) => {
        console.error(err);
        this.cargandoGestion = null;
        this.toastService.error('No se pudieron cargar las llamadas de la gestión.');
      }
    });
  }

  /** Suma al grupo las llamadas que le faltaban, sin perder las que ya tenía. */
  private fusionar(grupo: GrupoGestion, todas: RecordingDTO[]): void {
    const presentes = new Set(grupo.llamadas.map(l => l.uuidLlamada));
    const faltantes = todas.filter(l => !presentes.has(l.uuidLlamada));
    if (faltantes.length === 0) {
      // La gestión dice tener más llamadas de las que el backend devuelve acá.
      // Se deja el contador al día para que la fila no insista con un botón
      // que no va a traer nada.
      grupo.totalGestion = grupo.llamadas.length;
      return;
    }
    faltantes.forEach(l => grupo.fueraDelFiltro.add(l.uuidLlamada));
    grupo.llamadas = [...grupo.llamadas, ...faltantes];
    this.ordenarLlamadas(grupo);
    this.gruposAbiertos.add(grupo.clave);
  }

  formatOrigen(origen: string | null | undefined): string {
    switch (origen) {
      case 'DISCADOR': return 'Discador';
      case 'RELLAMADA_DISCADOR': return 'Rellamada (discador)';
      case 'MANUAL': return 'Manual';
      case 'RELLAMADA_MANUAL': return 'Rellamada (manual)';
      case 'BOT': return 'Bot';
      case 'RECORDATORIO': return 'Recordatorio';
      default: return origen || '-';
    }
  }

  // === Downloads ===

  downloadAudio(recording: RecordingDTO): void {
    this.downloadingUuid = recording.uuidLlamada;
    this.recordingsService.downloadAudio(recording.uuidLlamada).subscribe({
      next: (data: Blob) => {
        const url = window.URL.createObjectURL(data);
        const a = document.createElement('a');
        a.href = url;
        a.download = `audio-${recording.documento}-${this.formatDate(recording.fechaInicio)}-${recording.agente || 'sin-agente'}.wav`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        this.downloadingUuid = '';
        this.toastService.success('Audio descargado correctamente.');
      },
      error: (err) => {
        console.error(err);
        this.downloadingUuid = '';
        this.toastService.error('No se encontró el archivo de audio para esta grabación.');
      }
    });
  }

  downloadReporte(recording: RecordingDTO): void {
    // El boton queda siempre habilitado para que se vea clickeable como el de
    // audio; si no hay evaluacion se avisa por toast en vez de bloquearlo.
    if (!recording.tieneEvaluacion) {
      this.toastService.error('Evaluación de calidad no disponible.');
      return;
    }

    this.downloadingReporteId = recording.id;
    this.recordingsService.downloadReporte(recording.id).subscribe({
      next: (data: Blob) => {
        const url = window.URL.createObjectURL(data);
        const a = document.createElement('a');
        a.href = url;
        a.download = `evaluacion-${recording.documento}-${this.formatDate(recording.fechaInicio)}-${recording.agente || 'sin-agente'}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        this.downloadingReporteId = null;
        this.toastService.success('Reporte descargado correctamente.');
      },
      error: (err) => {
        console.error(err);
        this.downloadingReporteId = null;
        this.toastService.error('Evaluación de calidad no disponible.');
      }
    });
  }

  massiveDownloadAudios(): void {
    const source = this.filteredRecordings.length > 0 ? this.filteredRecordings : this.recordings;
    if (source.length === 0) {
      this.toastService.error('No hay datos para descargar.');
      return;
    }

    this.isDownloadingMassive = true;
    this.toastService.info('Procesando descarga masiva de audios...');

    const uuids = source.map(r => r.uuidLlamada).filter(u => u != null);
    this.recordingsService.downloadAudiosZip(uuids).subscribe({
      next: (data: Blob) => {
        const url = window.URL.createObjectURL(data);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'grabaciones.zip';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        this.isDownloadingMassive = false;
        this.toastService.success('Los audios fueron descargados correctamente.');
      },
      error: (err) => {
        console.error(err);
        this.isDownloadingMassive = false;
        this.toastService.error('Un error ha ocurrido al realizar la descarga.');
      }
    });
  }

  // === Helpers ===

  formatDate(isoDate: string): string {
    if (!isoDate) return '-';
    return isoDate.substring(0, 10);
  }

  formatTime(isoDate: string): string {
    if (!isoDate) return '-';
    return isoDate.substring(11, 19);
  }

  formatDuration(seconds: number): string {
    if (seconds == null) return '-';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  getUniqueTipificaciones(): SelectOption[] {
    const tips = [...new Set(this.recordings.map(r => r.tipificacion).filter(t => t != null && t !== ''))];
    return [
      { label: 'Todos', value: '' },
      ...tips.sort().map(t => ({ label: t, value: t }))
    ];
  }
}
