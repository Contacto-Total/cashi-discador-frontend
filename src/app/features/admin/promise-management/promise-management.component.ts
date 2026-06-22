import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormatService } from '@/shared/services/format.service';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { PromiseManagementService } from './services/promise-management.service';
import { PromesaGestion } from './models/promise.model';
import { AuthService } from '../../../core/services/auth.service';
import { UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-promise-management',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './promise-management.component.html',
  styleUrls: ['./promise-management.component.css']
})
export class PromiseManagementComponent implements OnInit {
  private fmt = inject(FormatService);

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
  reprogrammingCuotaId = signal<number | null>(null);
  reprogramDateDraft = signal<string>('');
  reprogrammingPromesaId = signal<number | null>(null);
  reprogramResult = signal<{ type: 'success' | 'error'; message: string } | null>(null);

  constructor(
    private promiseService: PromiseManagementService,
    private authService: AuthService
  ) {}

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
        const user = this.authService.getCurrentUser();
        if (user?.role === UserRole.SUPERVISOR && user.subPortfolioId) {
          const filtered = response.content.filter(p => p.idSubcartera === user.subPortfolioId);
          this.promesas.set(filtered);
          this.totalElements.set(filtered.length);
        } else {
          this.promesas.set(response.content);
          this.totalElements.set(response.totalElements);
        }
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
    const currentUser = this.authService.getCurrentUser();

    if (!promesa || motivo.length < 10) {
      this.error.set('El motivo debe tener al menos 10 caracteres');
      return;
    }

    if (!currentUser) {
      this.error.set('No se pudo obtener el usuario actual');
      return;
    }

    this.anulando.set(true);
    this.error.set(null);

    const userId = currentUser.id;
    const nombreUsuario = `${currentUser.firstName} ${currentUser.lastName}`.trim() || currentUser.username;

    this.promiseService.anularPromesa({
      idGestion: promesa.idGestion,
      motivo: motivo
    }, userId, nombreUsuario).subscribe({
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

  canReprogramInstallment(cuota: any): boolean {
    return cuota?.estado === 'PENDIENTE' || cuota?.estado === 'PARCIAL';
  }

  isReprogrammingCuota(idGestion: number, cuotaId: number): boolean {
    return this.reprogrammingPromesaId() === idGestion && this.reprogrammingCuotaId() === cuotaId;
  }

  startReprogrammingCuota(promesa: PromesaGestion, cuota: any): void {
    this.reprogrammingPromesaId.set(promesa.idGestion);
    this.reprogrammingCuotaId.set(cuota.id);
    this.reprogramDateDraft.set((cuota?.fechaPromesa || '').split('T')[0] || '');
    this.error.set(null);
    this.successMessage.set(null);
  }

  cancelReprogrammingCuota(): void {
    this.reprogrammingPromesaId.set(null);
    this.reprogrammingCuotaId.set(null);
    this.reprogramDateDraft.set('');
  }

  closeReprogramResultPopup(): void {
    this.reprogramResult.set(null);
  }

  getMinReprogramDate(cuota: any, promesa: PromesaGestion): string {
    const today = new Date();
    const minDate = new Date(today);
    const cuotas = promesa?.cuotas || [];
    const currentIndex = cuotas.findIndex((c: any) => c?.id === cuota?.id);
    const previous = currentIndex > 0 ? cuotas[currentIndex - 1] : null;
    const prevDateStr = previous?.fechaPromesa;

    if (prevDateStr) {
      const prevDate = new Date(prevDateStr);
      if (!isNaN(prevDate.getTime()) && prevDate > minDate) {
        minDate.setTime(prevDate.getTime());
      }
    }

    return minDate.toISOString().split('T')[0];
  }

  getMaxReprogramDate(cuota: any, promesa: PromesaGestion): string {
    const today = new Date();
    const cuotas = promesa?.cuotas || [];
    const currentIndex = cuotas.findIndex((c: any) => c?.id === cuota?.id);
    const nextInstallment = currentIndex >= 0 ? cuotas[currentIndex + 1] : null;
    const previousInstallment = currentIndex > 0 ? cuotas[currentIndex - 1] : null;
    const nextDateStr = nextInstallment?.fechaPromesa;
    const currentDateStr = cuota?.fechaPromesa;
    const maxDate = new Date(today);

    if (nextDateStr) {
      const nextDate = new Date(nextDateStr);
      if (!isNaN(nextDate.getTime())) {
        const maxBeforeNext = new Date(nextDate);
        maxBeforeNext.setDate(maxBeforeNext.getDate() - 4);
        maxDate.setTime(maxBeforeNext.getTime());
      }
    } else if (currentDateStr) {
      const isLastInstallment = currentIndex >= 0 && currentIndex === cuotas.length - 1;
      const hasMultipleInstallments = cuotas.length > 1;

      if (isLastInstallment && hasMultipleInstallments && previousInstallment?.fechaPromesa) {
        const previousDate = new Date(previousInstallment.fechaPromesa);
        if (!isNaN(previousDate.getTime())) {
          const endOfNextMonth = new Date(previousDate.getFullYear(), previousDate.getMonth() + 2, 0);
          maxDate.setTime(endOfNextMonth.getTime());
        }
      } else {
        const currentDate = new Date(currentDateStr);
        if (!isNaN(currentDate.getTime())) {
          const maxByCurrentInstallment = new Date(currentDate);
          maxByCurrentInstallment.setDate(maxByCurrentInstallment.getDate() + 30);
          maxDate.setTime(maxByCurrentInstallment.getTime());
        }
      }
    } else {
      maxDate.setDate(maxDate.getDate() + 30);
    }

    return maxDate.toISOString().split('T')[0];
  }

  confirmReprogramacion(promesa: PromesaGestion, cuota: any): void {
    const selectedDate = this.reprogramDateDraft();
    if (!selectedDate) {
      this.error.set('Selecciona una fecha para reprogramar la cuota');
      return;
    }

    const minDate = this.getMinReprogramDate(cuota, promesa);
    const maxDate = this.getMaxReprogramDate(cuota, promesa);
    if (selectedDate < minDate || selectedDate > maxDate) {
      this.error.set(`Fecha no valida. Debe estar entre ${minDate} y ${maxDate}`);
      return;
    }

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser?.id || !promesa?.idGestion || !cuota?.id) {
      this.error.set('No se pudo identificar el registro o la cuota a reprogramar');
      return;
    }

    this.promiseService.reprogramarPromesa(promesa.idGestion, {
      cuotaId: Number(cuota.id),
      nuevaFechaPromesa: selectedDate,
      motivo: '',
      observaciones: promesa.observaciones || null,
      solicitadoPorUsuarioId: Number(currentUser.id),
      solicitadoPorNombre: `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() || currentUser.username,
      forzarSupervision: false
    }).subscribe({
      next: () => {
        this.reprogramResult.set({ type: 'success', message: `Cuota ${cuota.numeroCuota} reprogramada correctamente` });
        this.cancelReprogrammingCuota();
        this.loadPromesas();
      },
      error: (err) => {
        console.error('Error reprogramando promesa:', err);
        this.reprogramResult.set({
          type: 'error',
          message:
            err?.error?.message ||
            err?.error?.mensaje ||
            err?.error?.error ||
            'No se pudo reprogramar la fecha de pago'
        });
      }
    });
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
    return this.fmt.currency(monto || 0);
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '-';
    let date: Date;
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      const [year, month, day] = dateStr.split('-').map(Number);
      date = new Date(year, month - 1, day);
    } else {
      date = new Date(dateStr);
    }
    return this.fmt.date(date, {
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
