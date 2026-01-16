import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { CartaAcuerdoService, CartaPendiente } from '../../core/services/carta-acuerdo.service';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import { UserRole } from '../../core/models/user.model';

@Component({
  selector: 'app-cartas-pendientes',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-900 p-6 transition-colors duration-300">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
          <div class="w-10 h-10 bg-amber-100 dark:bg-amber-900/50 rounded-xl flex items-center justify-center">
            <lucide-angular name="clock" [size]="24" class="text-amber-600 dark:text-amber-400"></lucide-angular>
          </div>
          Cartas de Acuerdo Pendientes
        </h1>
        <p class="text-slate-500 dark:text-slate-400 mt-1">
          Promesas de pago que requieren generar carta de acuerdo
        </p>
      </div>

      <!-- Filtros -->
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 mb-6">
        <div class="flex flex-wrap gap-4 items-end">
          <div class="flex-1 min-w-[200px]">
            <label class="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Fecha Inicio</label>
            <input type="date" [(ngModel)]="filtroFechaInicio"
              class="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div class="flex-1 min-w-[200px]">
            <label class="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Fecha Fin</label>
            <input type="date" [(ngModel)]="filtroFechaFin"
              class="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <button (click)="buscar()"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
            <lucide-angular name="search" [size]="16"></lucide-angular>
            Buscar
          </button>
          <button (click)="limpiarFiltros()"
            class="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
            <lucide-angular name="x" [size]="16"></lucide-angular>
            Limpiar
          </button>
        </div>
      </div>

      <!-- Resumen -->
      <div class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6 flex items-center gap-4">
        <div class="w-12 h-12 bg-amber-100 dark:bg-amber-900/50 rounded-full flex items-center justify-center">
          <lucide-angular name="alert-circle" [size]="24" class="text-amber-600 dark:text-amber-400"></lucide-angular>
        </div>
        <div>
          <p class="text-amber-800 dark:text-amber-200 font-semibold text-lg">
            {{ cartasPendientes().length }} cartas pendientes por generar
          </p>
          <p class="text-amber-600 dark:text-amber-400 text-sm">
            Monto total comprometido: {{ formatCurrency(montoTotalPendiente()) }}
          </p>
        </div>
      </div>

      <!-- Loading -->
      @if (loading()) {
        <div class="flex justify-center items-center py-12">
          <div class="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      }

      <!-- Tabla -->
      @if (!loading() && cartasPendientes().length > 0) {
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-slate-50 dark:bg-slate-700/50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Cliente</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Documento</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Monto</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Cuotas</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Fecha</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Agente</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Cartera</th>
                  <th class="px-4 py-3 text-center text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Acción</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
                @for (carta of cartasPendientes(); track carta.idGestion) {
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td class="px-4 py-3">
                      <span class="font-medium text-slate-800 dark:text-white text-sm">{{ carta.nombreCliente }}</span>
                    </td>
                    <td class="px-4 py-3">
                      <span class="text-slate-600 dark:text-slate-300 text-sm font-mono">{{ carta.documentoCliente }}</span>
                    </td>
                    <td class="px-4 py-3">
                      <span class="font-semibold text-emerald-600 dark:text-emerald-400 text-sm">{{ formatCurrency(carta.montoPromesa) }}</span>
                    </td>
                    <td class="px-4 py-3">
                      <span class="px-2 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                        {{ carta.totalCuotas }} {{ carta.totalCuotas === 1 ? 'cuota' : 'cuotas' }}
                      </span>
                    </td>
                    <td class="px-4 py-3">
                      <span class="text-slate-600 dark:text-slate-300 text-sm">{{ formatDate(carta.fechaGestion) }}</span>
                    </td>
                    <td class="px-4 py-3">
                      <span class="text-slate-600 dark:text-slate-300 text-sm">{{ carta.nombreAgente }}</span>
                    </td>
                    <td class="px-4 py-3">
                      <div class="text-xs">
                        <span class="text-slate-500 dark:text-slate-400">{{ carta.nombreCartera }}</span>
                        @if (carta.nombreSubcartera) {
                          <span class="text-slate-400 dark:text-slate-500"> / {{ carta.nombreSubcartera }}</span>
                        }
                      </div>
                    </td>
                    <td class="px-4 py-3 text-center">
                      <button (click)="generarCarta(carta)"
                        [disabled]="generando() === carta.idGestion"
                        class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white rounded-lg text-xs font-medium transition-colors">
                        @if (generando() === carta.idGestion) {
                          <div class="animate-spin w-3 h-3 border-2 border-white border-t-transparent rounded-full"></div>
                          Generando...
                        } @else {
                          <lucide-angular name="download" [size]="14"></lucide-angular>
                          Generar Carta
                        }
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }

      <!-- Empty State -->
      @if (!loading() && cartasPendientes().length === 0) {
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-12 text-center">
          <div class="w-16 h-16 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <lucide-angular name="check-circle" [size]="32" class="text-green-600 dark:text-green-400"></lucide-angular>
          </div>
          <h3 class="text-lg font-semibold text-slate-800 dark:text-white mb-2">
            No hay cartas pendientes
          </h3>
          <p class="text-slate-500 dark:text-slate-400">
            Todas las promesas de pago tienen su carta de acuerdo generada.
          </p>
        </div>
      }
    </div>
  `
})
export class CartasPendientesComponent implements OnInit {
  loading = signal(false);
  cartasPendientes = signal<CartaPendiente[]>([]);
  generando = signal<number | null>(null);

  filtroFechaInicio = '';
  filtroFechaFin = '';

  montoTotalPendiente = computed(() =>
    this.cartasPendientes().reduce((sum, c) => sum + (c.montoPromesa || 0), 0)
  );

  constructor(
    private cartaAcuerdoService: CartaAcuerdoService,
    private authService: AuthService,
    public themeService: ThemeService
  ) {}

  ngOnInit(): void {
    // Establecer fechas por defecto (últimos 30 días)
    const hoy = new Date();
    const hace30Dias = new Date();
    hace30Dias.setDate(hace30Dias.getDate() - 30);

    this.filtroFechaFin = this.formatDateToInput(hoy);
    this.filtroFechaInicio = this.formatDateToInput(hace30Dias);

    this.buscar();
  }

  buscar(): void {
    this.loading.set(true);
    const currentUser = this.authService.getCurrentUser();

    // Si es AGENT, solo ver sus propias cartas pendientes
    const agenteId = currentUser?.role === UserRole.AGENT ? currentUser.id : undefined;

    this.cartaAcuerdoService.obtenerCartasPendientes({
      fechaInicio: this.filtroFechaInicio || undefined,
      fechaFin: this.filtroFechaFin || undefined,
      agenteId: agenteId
    }).subscribe({
      next: (response) => {
        this.cartasPendientes.set(response.data || []);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error al obtener cartas pendientes:', err);
        this.loading.set(false);
      }
    });
  }

  limpiarFiltros(): void {
    this.filtroFechaInicio = '';
    this.filtroFechaFin = '';
    this.buscar();
  }

  generarCarta(carta: CartaPendiente): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser?.id) {
      alert('Error: No se pudo obtener el usuario actual');
      return;
    }

    this.generando.set(carta.idGestion);

    this.cartaAcuerdoService.generarCarta(carta.idGestion, currentUser.id).subscribe({
      next: (blob) => {
        // Descargar el PDF
        this.cartaAcuerdoService.descargarPdf(blob, `carta_acuerdo_${carta.documentoCliente}.pdf`);

        // Remover de la lista
        this.cartasPendientes.update(items => items.filter(c => c.idGestion !== carta.idGestion));

        this.generando.set(null);
      },
      error: (err) => {
        console.error('Error al generar carta:', err);
        alert('Error al generar la carta de acuerdo. Por favor intente nuevamente.');
        this.generando.set(null);
      }
    });
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(value);
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '-';
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  private formatDateToInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
