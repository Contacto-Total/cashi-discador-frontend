import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Volume2, FileSpreadsheet, Download, Search, Calendar, X } from 'lucide-angular';

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
  nombre: string;
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
  readonly Download = Download;
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
        this.gestiones = data;
        this.initialValue = [...data];
        this.applyFilters();
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
        this.gestiones = data;
        this.initialValue = [...data];
        this.applyFilters();
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
        this.gestiones = data;
        this.initialValue = [...data];
        this.applyFilters();
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

  applyFilters(): void {
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

    this.filteredGestiones = filtered;
    this.currentPage = 1;
    this.updatePagination();
  }

  clearFilters(): void {
    this.filterDocumento = '';
    this.filterTelefono = '';
    this.filterCartera = '';
    this.filterResultado = '';
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

  downloadAudio(gestion: Recording): void {
    const anio_chain = typeof gestion.anio === 'string' ? gestion.anio.split(',') : [gestion.anio];
    const mes_chain = typeof gestion.mes === 'string' ? gestion.mes.split(',') : [gestion.mes];
    const dia_chain = typeof gestion.dia === 'string' ? gestion.dia.split(',') : [gestion.dia];
    const nombre_chain = typeof gestion.nombre === 'string' ? gestion.nombre.split(',') : [gestion.nombre];

    for (let i = 0; i < anio_chain.length; i++) {
      const newFechaGestion = gestion.fechagestion.replace(/-/g, '');

      const downloadHistoricoAudioRequest: RecordingDownloadRequest = {
        anio: anio_chain[i],
        mes: mes_chain[i],
        dia: dia_chain[i],
        nombre: nombre_chain[i],
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
          if (i > 0) {
            a.download = `audio-${newFechaGestion}-${gestion.resultado}-${gestion.telefono}-${gestion.documento}-${gestion.cliente}-${gestion.usuarioregistra}(${i}).WAV`;
          } else {
            a.download = `audio-${newFechaGestion}-${gestion.resultado}-${gestion.telefono}-${gestion.documento}-${gestion.cliente}-${gestion.usuarioregistra}.WAV`;
          }
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

    audiosToDownload.forEach((gestion: Recording) => {
      const anio_chain = typeof gestion.anio === 'string' ? gestion.anio.split(',') : [gestion.anio];
      const mes_chain = typeof gestion.mes === 'string' ? gestion.mes.split(',') : [gestion.mes];
      const dia_chain = typeof gestion.dia === 'string' ? gestion.dia.split(',') : [gestion.dia];
      const nombre_chain = typeof gestion.nombre === 'string' ? gestion.nombre.split(',') : [gestion.nombre];

      for (let i = 0; i < anio_chain.length; i++) {
        const newFechaGestion = gestion.fechagestion.replace(/-/g, '');

        const downloadHistoricoAudioRequest: RecordingDownloadRequest = {
          anio: anio_chain[i],
          mes: mes_chain[i],
          dia: dia_chain[i],
          nombre: nombre_chain[i],
          fecha: newFechaGestion,
          resultado: gestion.resultado,
          telefono: gestion.telefono,
          documento: gestion.documento,
          cliente: gestion.cliente,
          asesor: gestion.usuarioregistra
        };

        downloadHistoricoAudioRequests.push(downloadHistoricoAudioRequest);
      }
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
