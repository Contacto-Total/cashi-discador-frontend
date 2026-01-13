import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { ExcepcionesService, ExcepcionPendiente } from './excepciones.service';

@Component({
  selector: 'app-excepciones',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <lucide-angular name="alert-triangle" [size]="28" class="text-amber-500"></lucide-angular>
          Excepciones Pendientes
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">
          Promesas con montos personalizados pendientes de aprobación
        </p>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div class="flex items-center gap-3">
            <div class="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <lucide-angular name="clock" [size]="24" class="text-amber-600 dark:text-amber-400"></lucide-angular>
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Pendientes</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ excepcionesService.totalExcepciones() }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading -->
      @if (excepcionesService.cargando()) {
        <div class="flex justify-center items-center py-12">
          <lucide-angular name="loader" [size]="40" class="animate-spin text-blue-600"></lucide-angular>
          <span class="ml-3 text-gray-600 dark:text-gray-400">Cargando excepciones...</span>
        </div>
      } @else if (excepcionesService.excepciones().length === 0) {
        <!-- Empty state -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-12 text-center shadow-sm border border-gray-200 dark:border-gray-700">
          <lucide-angular name="check-circle" [size]="64" class="mx-auto text-green-500 mb-4"></lucide-angular>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">No hay excepciones pendientes</h3>
          <p class="text-gray-500 dark:text-gray-400">Todas las excepciones han sido procesadas</p>
        </div>
      } @else {
        <!-- Table -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Cliente</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Agente</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Monto</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Cuotas</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Fecha</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Cartera</th>
                  <th class="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                @for (excepcion of excepcionesService.excepciones(); track excepcion.id) {
                  <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td class="px-4 py-3">
                      <div class="font-medium text-gray-900 dark:text-white">{{ excepcion.nombreCliente }}</div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">{{ excepcion.documentoCliente }}</div>
                    </td>
                    <td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                      {{ excepcion.nombreAgente }}
                    </td>
                    <td class="px-4 py-3">
                      <div class="font-bold text-lg text-amber-600 dark:text-amber-400">
                        {{ formatCurrency(excepcion.montoPromesa) }}
                      </div>
                      @if (excepcion.montoBase) {
                        <div class="text-xs text-gray-500 dark:text-gray-400">
                          Base: {{ formatCurrency(excepcion.montoBase) }}
                        </div>
                      } @else {
                        <div class="text-xs text-purple-600 dark:text-purple-400 font-medium">
                          Monto libre
                        </div>
                      }
                    </td>
                    <td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                      {{ excepcion.totalCuotas }} cuota(s)
                    </td>
                    <td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                      {{ formatDate(excepcion.fechaGestion) }}
                    </td>
                    <td class="px-4 py-3">
                      <div class="text-sm text-gray-700 dark:text-gray-300">{{ excepcion.nombreCartera }}</div>
                      <div class="text-xs text-gray-500 dark:text-gray-400">{{ excepcion.nombreSubcartera }}</div>
                    </td>
                    <td class="px-4 py-3">
                      <div class="flex items-center justify-center gap-2">
                        <button
                          (click)="verDetalle(excepcion)"
                          class="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                          title="Ver detalle"
                        >
                          <lucide-angular name="eye" [size]="18"></lucide-angular>
                        </button>
                        <button
                          (click)="aprobar(excepcion)"
                          [disabled]="procesando()"
                          class="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors disabled:opacity-50"
                          title="Aprobar"
                        >
                          <lucide-angular name="check" [size]="18"></lucide-angular>
                        </button>
                        <button
                          (click)="rechazar(excepcion)"
                          [disabled]="procesando()"
                          class="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors disabled:opacity-50"
                          title="Rechazar"
                        >
                          <lucide-angular name="x" [size]="18"></lucide-angular>
                        </button>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          @if (totalPages() > 1) {
            <div class="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div class="text-sm text-gray-500 dark:text-gray-400">
                Página {{ currentPage() + 1 }} de {{ totalPages() }}
              </div>
              <div class="flex gap-2">
                <button
                  (click)="previousPage()"
                  [disabled]="currentPage() === 0"
                  class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Anterior
                </button>
                <button
                  (click)="nextPage()"
                  [disabled]="currentPage() >= totalPages() - 1"
                  class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Siguiente
                </button>
              </div>
            </div>
          }
        </div>
      }

      <!-- Modal Detalle -->
      @if (showDetalleModal()) {
        <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div class="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h2 class="text-xl font-bold text-gray-900 dark:text-white">Detalle de Excepción</h2>
              <button (click)="cerrarDetalle()" class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                <lucide-angular name="x" [size]="24"></lucide-angular>
              </button>
            </div>
            @if (excepcionSeleccionada()) {
              <div class="p-6 space-y-4">
                <!-- Cliente -->
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Cliente</label>
                    <p class="text-gray-900 dark:text-white font-medium">{{ excepcionSeleccionada()!.nombreCliente }}</p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ excepcionSeleccionada()!.documentoCliente }}</p>
                  </div>
                  <div>
                    <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Agente</label>
                    <p class="text-gray-900 dark:text-white">{{ excepcionSeleccionada()!.nombreAgente }}</p>
                  </div>
                </div>

                <!-- Montos -->
                <div class="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4">
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase">Monto Solicitado</label>
                      <p class="text-2xl font-bold text-amber-600 dark:text-amber-400">
                        {{ formatCurrency(excepcionSeleccionada()!.montoPromesa) }}
                      </p>
                    </div>
                    <div>
                      <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Monto Base</label>
                      @if (excepcionSeleccionada()!.montoBase) {
                        <p class="text-xl text-gray-700 dark:text-gray-300">
                          {{ formatCurrency(excepcionSeleccionada()!.montoBase) }}
                        </p>
                      } @else {
                        <p class="text-purple-600 dark:text-purple-400 font-medium">Monto libre (sin base)</p>
                      }
                    </div>
                  </div>
                </div>

                <!-- Cuotas -->
                @if (excepcionSeleccionada()!.cuotas && excepcionSeleccionada()!.cuotas.length > 0) {
                  <div>
                    <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2 block">Cronograma de Cuotas</label>
                    <div class="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden">
                      <table class="w-full text-sm">
                        <thead class="bg-gray-100 dark:bg-gray-600">
                          <tr>
                            <th class="px-3 py-2 text-left">#</th>
                            <th class="px-3 py-2 text-left">Monto</th>
                            <th class="px-3 py-2 text-left">Fecha</th>
                          </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200 dark:divide-gray-600">
                          @for (cuota of excepcionSeleccionada()!.cuotas; track cuota.numeroCuota) {
                            <tr>
                              <td class="px-3 py-2">{{ cuota.numeroCuota }}</td>
                              <td class="px-3 py-2 font-medium">{{ formatCurrency(cuota.monto) }}</td>
                              <td class="px-3 py-2">{{ formatDate(cuota.fechaPago) }}</td>
                            </tr>
                          }
                        </tbody>
                      </table>
                    </div>
                  </div>
                }

                <!-- Observaciones -->
                @if (excepcionSeleccionada()!.observaciones) {
                  <div>
                    <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Observaciones</label>
                    <p class="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mt-1">
                      {{ excepcionSeleccionada()!.observaciones }}
                    </p>
                  </div>
                }

                <!-- Acciones -->
                <div class="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    (click)="aprobar(excepcionSeleccionada()!)"
                    [disabled]="procesando()"
                    class="flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 px-4 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <lucide-angular name="check" [size]="18"></lucide-angular>
                    Aprobar Excepción
                  </button>
                  <button
                    (click)="rechazar(excepcionSeleccionada()!)"
                    [disabled]="procesando()"
                    class="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 px-4 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <lucide-angular name="x" [size]="18"></lucide-angular>
                    Rechazar Excepción
                  </button>
                </div>
              </div>
            }
          </div>
        </div>
      }

      <!-- Modal Rechazo -->
      @if (showRechazoModal()) {
        <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full">
            <div class="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <lucide-angular name="x-circle" [size]="24" class="text-red-500"></lucide-angular>
                Rechazar Excepción
              </h2>
            </div>
            <div class="p-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Motivo del rechazo (obligatorio)
              </label>
              <textarea
                [(ngModel)]="motivoRechazo"
                rows="4"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
                placeholder="Ingrese el motivo del rechazo..."
              ></textarea>
            </div>
            <div class="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-3">
              <button
                (click)="cancelarRechazo()"
                class="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cancelar
              </button>
              <button
                (click)="confirmarRechazo()"
                [disabled]="!motivoRechazo.trim() || procesando()"
                class="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium disabled:opacity-50"
              >
                Confirmar Rechazo
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class ExcepcionesComponent implements OnInit {
  excepcionesService = inject(ExcepcionesService);

  // Paginación
  currentPage = signal(0);
  totalPages = signal(0);
  pageSize = 20;

  // Modales
  showDetalleModal = signal(false);
  showRechazoModal = signal(false);
  excepcionSeleccionada = signal<ExcepcionPendiente | null>(null);
  excepcionParaRechazar = signal<ExcepcionPendiente | null>(null);
  motivoRechazo = '';

  // Estado
  procesando = signal(false);

  ngOnInit(): void {
    this.cargarExcepciones();
  }

  cargarExcepciones(): void {
    this.excepcionesService.getExcepcionesPendientes(this.currentPage(), this.pageSize)
      .subscribe({
        next: (response) => {
          this.totalPages.set(response.totalPages);
        },
        error: (error) => {
          console.error('Error cargando excepciones:', error);
          alert('Error al cargar las excepciones pendientes');
        }
      });
  }

  verDetalle(excepcion: ExcepcionPendiente): void {
    this.excepcionSeleccionada.set(excepcion);
    this.showDetalleModal.set(true);
  }

  cerrarDetalle(): void {
    this.showDetalleModal.set(false);
    this.excepcionSeleccionada.set(null);
  }

  aprobar(excepcion: ExcepcionPendiente): void {
    if (!confirm(`¿Está seguro de APROBAR esta excepción?\n\nCliente: ${excepcion.nombreCliente}\nMonto: ${this.formatCurrency(excepcion.montoPromesa)}`)) {
      return;
    }

    this.procesando.set(true);
    this.excepcionesService.aprobarExcepcion(excepcion.id).subscribe({
      next: () => {
        alert('Excepción aprobada exitosamente');
        this.cerrarDetalle();
        this.procesando.set(false);
      },
      error: (error) => {
        console.error('Error aprobando:', error);
        alert('Error al aprobar la excepción');
        this.procesando.set(false);
      }
    });
  }

  rechazar(excepcion: ExcepcionPendiente): void {
    this.excepcionParaRechazar.set(excepcion);
    this.motivoRechazo = '';
    this.showRechazoModal.set(true);
  }

  cancelarRechazo(): void {
    this.showRechazoModal.set(false);
    this.excepcionParaRechazar.set(null);
    this.motivoRechazo = '';
  }

  confirmarRechazo(): void {
    const excepcion = this.excepcionParaRechazar();
    if (!excepcion || !this.motivoRechazo.trim()) return;

    this.procesando.set(true);
    this.excepcionesService.rechazarExcepcion(excepcion.id, this.motivoRechazo.trim()).subscribe({
      next: () => {
        alert('Excepción rechazada exitosamente');
        this.showRechazoModal.set(false);
        this.cerrarDetalle();
        this.excepcionParaRechazar.set(null);
        this.motivoRechazo = '';
        this.procesando.set(false);
      },
      error: (error) => {
        console.error('Error rechazando:', error);
        alert('Error al rechazar la excepción');
        this.procesando.set(false);
      }
    });
  }

  previousPage(): void {
    if (this.currentPage() > 0) {
      this.currentPage.update(p => p - 1);
      this.cargarExcepciones();
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages() - 1) {
      this.currentPage.update(p => p + 1);
      this.cargarExcepciones();
    }
  }

  formatCurrency(value: number | null): string {
    if (value === null || value === undefined) return '-';
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(value);
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}
