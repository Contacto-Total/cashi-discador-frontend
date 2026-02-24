import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Volume2, Download, Search, Calendar, X, ChevronDown } from 'lucide-angular';

import { CustomSelectComponent, SelectOption } from '../../../shared/components/custom-ui/custom-select/custom-select.component';
import { ToastService } from '../../../shared/services/toast.service';
import { AdminRecordingsService, RecordingDTO } from '../../../core/services/admin-recordings.service';
import { TenantService } from '../../../maintenance/services/tenant.service';
import { PortfolioService } from '../../../maintenance/services/portfolio.service';
import { Tenant } from '../../../maintenance/models/tenant.model';
import { Portfolio, SubPortfolio } from '../../../maintenance/models/portfolio.model';

@Component({
  selector: 'app-admin-recordings',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, CustomSelectComponent],
  templateUrl: './admin-recordings.component.html',
  styleUrls: ['./admin-recordings.component.css']
})
export class AdminRecordingsComponent implements OnInit {
  // Lucide icons
  readonly Volume2 = Volume2;
  readonly Download = Download;
  readonly Search = Search;
  readonly Calendar = Calendar;
  readonly X = X;
  readonly ChevronDown = ChevronDown;

  // Math utility for template
  readonly Math = Math;

  // Data
  recordings: RecordingDTO[] = [];
  filteredRecordings: RecordingDTO[] = [];
  paginatedRecordings: RecordingDTO[] = [];

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
  errorMessage: string = '';

  // Filter fields
  filterDocumento: string = '';
  filterTelefono: string = '';
  filterCampana: string = '';
  filterEstado: string = '';
  filterAgente: string = '';

  // Dropdowns
  tipoBusqueda: SelectOption[] = [
    { label: 'Fechas', value: 'fechas' },
    { label: 'Documento', value: 'documento' },
    { label: 'Teléfono', value: 'telefono' }
  ];
  selectedTipoBusqueda: string = 'fechas';

  // Sort
  sortField: string = '';
  sortOrder: number = 0;

  // Loading
  isLoading: boolean = false;
  isDownloadingMassive: boolean = false;

  constructor(
    private recordingsService: AdminRecordingsService,
    private tenantService: TenantService,
    private portfolioService: PortfolioService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadTenants();
  }

  // === Cascade selectors ===

  loadTenants(): void {
    this.tenantService.getAllTenants().subscribe({
      next: (data) => {
        this.tenants = data;
      },
      error: (err) => {
        console.error('Error loading tenants:', err);
      }
    });
  }

  onTenantChange(): void {
    this.portfolios = [];
    this.subPortfolios = [];
    this.selectedPortfolioId = 0;
    this.selectedSubPortfolioId = 0;

    if (this.selectedTenantId > 0) {
      this.portfolioService.getPortfoliosByTenant(this.selectedTenantId).subscribe({
        next: (data) => {
          this.portfolios = data;
        },
        error: (err) => {
          console.error('Error loading portfolios:', err);
        }
      });
    }
  }

  onPortfolioChange(): void {
    this.subPortfolios = [];
    this.selectedSubPortfolioId = 0;

    if (this.selectedPortfolioId > 0) {
      this.portfolioService.getSubPortfoliosByPortfolio(this.selectedPortfolioId).subscribe({
        next: (data) => {
          this.subPortfolios = data;
        },
        error: (err) => {
          console.error('Error loading sub-portfolios:', err);
        }
      });
    }
  }

  // === Search ===

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

      if (diffDays > 7) {
        this.errorMessage = 'La diferencia entre las fechas no puede ser mayor a 7 días.';
      }
    } else {
      this.errorMessage = 'Por favor, selecciona ambas fechas.';
    }
  }

  private validatePortfolioSelection(): boolean {
    if (!this.selectedTenantId || !this.selectedPortfolioId || !this.selectedSubPortfolioId) {
      this.toastService.error('Por favor, selecciona Proveedor, Cartera y Subcartera.');
      return false;
    }
    return true;
  }

  searchByDates(): void {
    if (!this.validatePortfolioSelection()) return;

    if (!this.startDate || !this.endDate) {
      this.toastService.error('Por favor, selecciona ambas fechas.');
      return;
    }

    if (this.errorMessage) {
      this.toastService.error('Verificar la validación de las fechas.');
      return;
    }

    this.isLoading = true;
    this.recordingsService.searchByDates(
      this.selectedTenantId, this.selectedPortfolioId, this.selectedSubPortfolioId,
      this.startDate, this.endDate
    ).subscribe({
      next: (data) => {
        this.recordings = data;
        this.applyFilters();
        this.isLoading = false;
        this.toastService.success(`Se encontraron ${data.length} grabaciones.`);
      },
      error: (err) => {
        console.error('Error searching recordings:', err);
        this.toastService.error('No se pudo cargar los datos.');
        this.isLoading = false;
      }
    });
  }

  searchByDocumento(): void {
    if (!this.validatePortfolioSelection()) return;

    if (!this.documento) {
      this.toastService.error('Por favor, ingresa un documento.');
      return;
    }

    this.isLoading = true;
    this.recordingsService.searchByDocumento(
      this.selectedTenantId, this.selectedPortfolioId, this.selectedSubPortfolioId,
      this.documento
    ).subscribe({
      next: (data) => {
        this.recordings = data;
        this.applyFilters();
        this.isLoading = false;
        this.toastService.success(`Se encontraron ${data.length} grabaciones.`);
      },
      error: (err) => {
        console.error('Error searching recordings:', err);
        this.toastService.error('No se pudo cargar los datos.');
        this.isLoading = false;
      }
    });
  }

  searchByTelefono(): void {
    if (!this.validatePortfolioSelection()) return;

    if (!this.telefono) {
      this.toastService.error('Por favor, ingresa un teléfono.');
      return;
    }

    this.isLoading = true;
    this.recordingsService.searchByTelefono(
      this.selectedTenantId, this.selectedPortfolioId, this.selectedSubPortfolioId,
      this.telefono
    ).subscribe({
      next: (data) => {
        this.recordings = data;
        this.applyFilters();
        this.isLoading = false;
        this.toastService.success(`Se encontraron ${data.length} grabaciones.`);
      },
      error: (err) => {
        console.error('Error searching recordings:', err);
        this.toastService.error('No se pudo cargar los datos.');
        this.isLoading = false;
      }
    });
  }

  // === Filters ===

  applyFilters(): void {
    let filtered = [...this.recordings];

    if (this.filterDocumento) {
      filtered = filtered.filter(r =>
        r.documento?.toLowerCase().includes(this.filterDocumento.toLowerCase())
      );
    }

    if (this.filterTelefono) {
      filtered = filtered.filter(r =>
        r.telefono?.toLowerCase().includes(this.filterTelefono.toLowerCase())
      );
    }

    if (this.filterCampana) {
      filtered = filtered.filter(r =>
        r.campana?.toLowerCase().includes(this.filterCampana.toLowerCase())
      );
    }

    if (this.filterEstado) {
      filtered = filtered.filter(r => r.estadoLlamada === this.filterEstado);
    }

    if (this.filterAgente) {
      filtered = filtered.filter(r =>
        r.agente?.toLowerCase().includes(this.filterAgente.toLowerCase())
      );
    }

    this.filteredRecordings = filtered;
    this.currentPage = 1;
    this.updatePagination();
  }

  clearFilters(): void {
    this.filterDocumento = '';
    this.filterTelefono = '';
    this.filterCampana = '';
    this.filterEstado = '';
    this.filterAgente = '';
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
        this.filteredRecordings = [...this.recordings];
        this.applyFilters();
        return;
      }
    } else {
      this.sortField = field;
      this.sortOrder = 1;
    }

    this.filteredRecordings.sort((a: any, b: any) => {
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

  // === Pagination ===

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredRecordings.length / this.pageSize);
    if (this.totalPages === 0) this.totalPages = 1;
    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedRecordings = this.filteredRecordings.slice(startIndex, endIndex);
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

  // === Downloads ===

  downloadAudio(recording: RecordingDTO): void {
    this.recordingsService.downloadAudio(recording.uuidLlamada).subscribe({
      next: (data: Blob) => {
        const url = window.URL.createObjectURL(data);
        const a = document.createElement('a');
        a.href = url;
        a.download = `audio-${recording.uuidLlamada}.wav`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        this.toastService.success('Audio descargado correctamente.');
      },
      error: (err) => {
        console.error('Error downloading audio:', err);
        this.toastService.error('No se encontró el audio.');
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
        console.error('Error downloading audios:', err);
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

  getEstadoColor(estado: string): string {
    switch (estado) {
      case 'FINALIZADA': return 'bg-green-500/10 border-green-500/30 text-green-400';
      case 'EN_CURSO': case 'CONECTADA': return 'bg-blue-500/10 border-blue-500/30 text-blue-400';
      case 'NO_CONTESTADA': case 'SIN_RESPUESTA': return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400';
      case 'FALLIDA': case 'ABANDONADA': return 'bg-red-500/10 border-red-500/30 text-red-400';
      default: return 'bg-slate-500/10 border-slate-500/30 text-slate-400';
    }
  }

  getUniqueEstados(): SelectOption[] {
    const estados = [...new Set(this.recordings.map(r => r.estadoLlamada).filter(e => e != null))];
    return [
      { label: 'Todos', value: '' },
      ...estados.map(e => ({ label: e, value: e }))
    ];
  }
}
