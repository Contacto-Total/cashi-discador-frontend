import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { PromiseManagementService } from './services/promise-management.service';
import { PromesaGestion, CuotaPromesa } from './models/promise.model';

@Component({
  selector: 'app-promise-management',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './promise-management.component.html',
  styleUrls: ['./promise-management.component.css']
})
export class PromiseManagementComponent implements OnInit {
  // Estado principal
  promesas = signal<PromesaGestion[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  // Paginacion
  currentPage = signal(0);
  pageSize = signal(10);
  totalElements = signal(0);
  totalPages = signal(0);

  // Busqueda
  searchQuery = signal('');

  // Modal anulacion
  showAnularModal = signal(false);
  selectedPromesa = signal<PromesaGestion | null>(null);
  motivoAnulacion = signal('');
  anulando = signal(false);

  // Cuotas expandidas
  expandedPromesas = signal<Set<number>>(new Set());

  constructor(private promiseService: PromiseManagementService) {}

  ngOnInit(): void {
    this.loadPromesas();
  }

  loadPromesas(): void {
    this.loading.set(true);
    this.error.set(null);

    const query = this.searchQuery();
    const observable = query.trim()
      ? this.promiseService.searchActivePromises(query, this.currentPage(), this.pageSize())
      : this.promiseService.getActivePromises(this.currentPage(), this.pageSize());

    observable.subscribe({
      next: (response) => {
        this.promesas.set(response.content);
        this.totalElements.set(response.totalElements);
        this.totalPages.set(response.totalPages);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading promesas:', err);
        this.error.set('Error al cargar las promesas');
        this.loading.set(false);
      }
    });
  }

  onSearch(): void {
    this.currentPage.set(0);
    this.loadPromesas();
  }

  clearSearch(): void {
    this.searchQuery.set('');
    this.currentPage.set(0);
    this.loadPromesas();
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages()) {
      this.currentPage.set(page);
      this.loadPromesas();
    }
  }

  // Modal anulacion
  openAnularModal(promesa: PromesaGestion): void {
    this.selectedPromesa.set(promesa);
    this.motivoAnulacion.set('');
    this.showAnularModal.set(true);
  }

  closeAnularModal(): void {
    this.showAnularModal.set(false);
    this.selectedPromesa.set(null);
    this.motivoAnulacion.set('');
  }

  anularPromesa(): void {
    const promesa = this.selectedPromesa();
    const motivo = this.motivoAnulacion();

    if (!promesa || motivo.length < 10) {
      this.error.set('El motivo debe tener al menos 10 caracteres');
      return;
    }

    this.anulando.set(true);
    this.error.set(null);

    this.promiseService.anularPromesa({
      idGestion: promesa.idGestion,
      motivo: motivo
    }).subscribe({
      next: () => {
        this.successMessage.set(`Promesa del cliente ${promesa.nombreCliente} anulada correctamente`);
        this.closeAnularModal();
        this.loadPromesas();
        this.anulando.set(false);

        setTimeout(() => this.successMessage.set(null), 5000);
      },
      error: (err) => {
        console.error('Error anulando promesa:', err);
        this.error.set(err.error?.message || 'Error al anular la promesa');
        this.anulando.set(false);
      }
    });
  }

  // Expandir/colapsar cuotas
  toggleCuotas(idGestion: number): void {
    const expanded = this.expandedPromesas();
    const newSet = new Set(expanded);
    if (newSet.has(idGestion)) {
      newSet.delete(idGestion);
    } else {
      newSet.add(idGestion);
    }
    this.expandedPromesas.set(newSet);
  }

  isExpanded(idGestion: number): boolean {
    return this.expandedPromesas().has(idGestion);
  }

  // Helpers
  getEstadoPagoColor(estado: string): string {
    switch (estado) {
      case 'PENDIENTE': return '#f59e0b';
      case 'PARCIAL': return '#3b82f6';
      case 'PAGADA': return '#10b981';
      case 'VENCIDA': return '#ef4444';
      case 'CANCELADA': return '#6b7280';
      default: return '#6b7280';
    }
  }

  getEstadoCuotaColor(estado: string): string {
    switch (estado) {
      case 'PENDIENTE': return '#f59e0b';
      case 'PARCIAL': return '#3b82f6';
      case 'PAGADA': return '#10b981';
      case 'VENCIDA': return '#ef4444';
      case 'CANCELADA': return '#6b7280';
      default: return '#6b7280';
    }
  }

  formatMonto(monto: number): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(monto || 0);
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  // Paginacion helpers
  get pageNumbers(): number[] {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: number[] = [];

    const start = Math.max(0, current - 2);
    const end = Math.min(total - 1, current + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }
}
