import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BcpPagosService } from '../../services/bcp-pagos.service';

@Component({
  selector: 'app-conciliacion-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 md:p-6">
      <div class="max-w-4xl mx-auto">
        <!-- Header con gradiente -->
        <div class="mb-8">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg shadow-emerald-500/25">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <div>
              <h1 class="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">
                Reporte de Conciliación
              </h1>
              <p class="text-slate-500 dark:text-slate-400 mt-1">
                Genera y descarga el reporte de conciliación de pagos bancarios
              </p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Panel principal -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Card de selección de fecha -->
            <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
              <!-- Header del card -->
              <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50">
                <h2 class="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                  <svg class="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  Seleccionar Período
                </h2>
              </div>

              <div class="p-6 space-y-6">
                <!-- Tipo de consulta con tabs estilizados -->
                <div>
                  <label class="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">
                    Tipo de consulta
                  </label>
                  <div class="inline-flex p-1 bg-slate-100 dark:bg-slate-700/50 rounded-xl">
                    <button
                      (click)="tipoConsulta = 'unica'; fechaFin = ''"
                      [class]="tipoConsulta === 'unica'
                        ? 'bg-white dark:bg-slate-600 text-emerald-600 dark:text-emerald-400 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'"
                      class="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-2"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                      </svg>
                      Fecha única
                    </button>
                    <button
                      (click)="tipoConsulta = 'rango'"
                      [class]="tipoConsulta === 'rango'
                        ? 'bg-white dark:bg-slate-600 text-emerald-600 dark:text-emerald-400 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'"
                      class="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-2"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                      </svg>
                      Rango de fechas
                    </button>
                  </div>
                </div>

                <!-- Campos de fecha -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      {{ tipoConsulta === 'unica' ? 'Fecha' : 'Fecha inicio' }}
                      <span class="text-red-500 ml-1">*</span>
                    </label>
                    <div class="relative">
                      <input
                        type="date"
                        [(ngModel)]="fechaInicio"
                        [max]="fechaMaxima"
                        class="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200"
                      />
                    </div>
                  </div>

                  @if (tipoConsulta === 'rango') {
                    <div class="space-y-2">
                      <label class="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Fecha fin
                        <span class="text-red-500 ml-1">*</span>
                      </label>
                      <div class="relative">
                        <input
                          type="date"
                          [(ngModel)]="fechaFin"
                          [min]="fechaInicio"
                          [max]="fechaMaxima"
                          class="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200"
                        />
                      </div>
                    </div>
                  }
                </div>

                <!-- Accesos rápidos -->
                <div>
                  <label class="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">
                    Accesos rápidos
                  </label>
                  <div class="flex flex-wrap gap-2">
                    @for (acceso of accesosRapidos; track acceso.label) {
                      <button
                        (click)="acceso.action()"
                        class="group px-4 py-2 text-sm font-medium rounded-xl border-2 transition-all duration-200"
                        [class]="isAccesoActivo(acceso.label)
                          ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-500 text-emerald-700 dark:text-emerald-400'
                          : 'bg-white dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-emerald-300 dark:hover:border-emerald-600 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/20'"
                      >
                        <span class="flex items-center gap-2">
                          @if (isAccesoActivo(acceso.label)) {
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                            </svg>
                          }
                          {{ acceso.label }}
                        </span>
                      </button>
                    }
                  </div>
                </div>
              </div>

              <!-- Footer con botón de descarga -->
              <div class="px-6 py-4 border-t border-slate-100 dark:border-slate-700/50 bg-slate-50/30 dark:bg-slate-800/30">
                <div class="flex items-center justify-between">
                  <div class="text-sm text-slate-500 dark:text-slate-400">
                    @if (fechaInicio) {
                      <span class="flex items-center gap-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        Período: <span class="font-medium text-slate-700 dark:text-slate-300">{{ formatFechaDisplay(fechaInicio) }}</span>
                        @if (tipoConsulta === 'rango' && fechaFin) {
                          <span>al</span>
                          <span class="font-medium text-slate-700 dark:text-slate-300">{{ formatFechaDisplay(fechaFin) }}</span>
                        }
                      </span>
                    }
                  </div>
                  <button
                    (click)="descargarReporte()"
                    [disabled]="!puedeDescargar() || isLoading()"
                    class="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-medium shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:from-emerald-600 hover:to-teal-700 disabled:from-slate-400 disabled:to-slate-500 disabled:shadow-none disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2"
                  >
                    @if (isLoading()) {
                      <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      <span>Generando...</span>
                    } @else {
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                      </svg>
                      <span>Descargar Excel</span>
                    }
                  </button>
                </div>
              </div>
            </div>

            <!-- Mensaje de estado -->
            @if (mensaje()) {
              <div
                class="p-4 rounded-xl flex items-center gap-3 animate-fade-in"
                [class]="mensaje()!.tipo === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'"
              >
                @if (mensaje()!.tipo === 'success') {
                  <div class="p-2 bg-emerald-100 dark:bg-emerald-800/50 rounded-lg">
                    <svg class="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <p class="text-emerald-700 dark:text-emerald-300 font-medium">{{ mensaje()!.texto }}</p>
                } @else {
                  <div class="p-2 bg-red-100 dark:bg-red-800/50 rounded-lg">
                    <svg class="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <p class="text-red-700 dark:text-red-300 font-medium">{{ mensaje()!.texto }}</p>
                }
              </div>
            }
          </div>

          <!-- Panel lateral de información -->
          <div class="space-y-6">
            <!-- Card de información -->
            <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
              <div class="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                <h3 class="font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                  <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  Información
                </h3>
              </div>
              <div class="p-5">
                <ul class="space-y-3">
                  <li class="flex items-start gap-3 text-sm">
                    <div class="p-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg mt-0.5">
                      <svg class="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                      </svg>
                    </div>
                    <span class="text-slate-600 dark:text-slate-400">Incluye todos los pagos procesados en el período</span>
                  </li>
                  <li class="flex items-start gap-3 text-sm">
                    <div class="p-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg mt-0.5">
                      <svg class="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                      </svg>
                    </div>
                    <span class="text-slate-600 dark:text-slate-400">Muestra el estado de conciliación de cada pago</span>
                  </li>
                  <li class="flex items-start gap-3 text-sm">
                    <div class="p-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg mt-0.5">
                      <svg class="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                      </svg>
                    </div>
                    <span class="text-slate-600 dark:text-slate-400">Formato Excel (.xlsx) compatible con todas las versiones</span>
                  </li>
                </ul>
              </div>
            </div>

            <!-- Card de formato -->
            <div class="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 text-white shadow-xl shadow-emerald-500/25">
              <div class="flex items-center gap-3 mb-3">
                <div class="p-2 bg-white/20 rounded-xl">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                </div>
                <div>
                  <p class="font-semibold">Formato del reporte</p>
                  <p class="text-emerald-100 text-sm">Microsoft Excel</p>
                </div>
              </div>
              <div class="flex items-center gap-2 text-sm text-emerald-100">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                </svg>
                <span>Descarga automática</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes fade-in {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in {
      animation: fade-in 0.3s ease-out;
    }
  `]
})
export class ConciliacionReportComponent {
  tipoConsulta: 'unica' | 'rango' = 'unica';
  fechaInicio = '';
  fechaFin = '';
  fechaMaxima = this.formatDate(new Date());
  isLoading = signal(false);
  mensaje = signal<{ tipo: 'success' | 'error'; texto: string } | null>(null);
  accesoSeleccionado = signal<string | null>('Hoy');

  accesosRapidos = [
    { label: 'Hoy', action: () => this.setHoy() },
    { label: 'Ayer', action: () => this.setAyer() },
    { label: 'Últimos 7 días', action: () => this.setUltimos7Dias() },
    { label: 'Últimos 30 días', action: () => this.setUltimos30Dias() },
    { label: 'Mes actual', action: () => this.setMesActual() }
  ];

  constructor(private bcpService: BcpPagosService) {
    this.setHoy();
  }

  isAccesoActivo(label: string): boolean {
    return this.accesoSeleccionado() === label;
  }

  puedeDescargar(): boolean {
    if (!this.fechaInicio) return false;
    if (this.tipoConsulta === 'rango' && !this.fechaFin) return false;
    return true;
  }

  descargarReporte(): void {
    if (!this.puedeDescargar()) return;

    this.isLoading.set(true);
    this.mensaje.set(null);

    // Simular pequeño delay para mostrar el estado de carga
    setTimeout(() => {
      try {
        if (this.tipoConsulta === 'unica') {
          this.bcpService.descargarReporteConciliacionPorFecha(this.fechaInicio);
        } else {
          this.bcpService.descargarReporteConciliacionPorFecha(this.fechaInicio, this.fechaFin);
        }
        this.mensaje.set({ tipo: 'success', texto: 'Reporte generado correctamente. La descarga iniciará en breve.' });
      } catch (error) {
        this.mensaje.set({ tipo: 'error', texto: 'Error al generar el reporte. Intente nuevamente.' });
      } finally {
        this.isLoading.set(false);
        // Limpiar mensaje después de 5 segundos
        setTimeout(() => this.mensaje.set(null), 5000);
      }
    }, 500);
  }

  formatFechaDisplay(fecha: string): string {
    if (!fecha) return '';
    const [year, month, day] = fecha.split('-');
    return `${day}/${month}/${year}`;
  }

  // Accesos rápidos
  setHoy(): void {
    this.tipoConsulta = 'unica';
    this.fechaInicio = this.formatDate(new Date());
    this.fechaFin = '';
    this.accesoSeleccionado.set('Hoy');
  }

  setAyer(): void {
    this.tipoConsulta = 'unica';
    const ayer = new Date();
    ayer.setDate(ayer.getDate() - 1);
    this.fechaInicio = this.formatDate(ayer);
    this.fechaFin = '';
    this.accesoSeleccionado.set('Ayer');
  }

  setUltimos7Dias(): void {
    this.tipoConsulta = 'rango';
    const hoy = new Date();
    const hace7Dias = new Date();
    hace7Dias.setDate(hoy.getDate() - 6);
    this.fechaInicio = this.formatDate(hace7Dias);
    this.fechaFin = this.formatDate(hoy);
    this.accesoSeleccionado.set('Últimos 7 días');
  }

  setUltimos30Dias(): void {
    this.tipoConsulta = 'rango';
    const hoy = new Date();
    const hace30Dias = new Date();
    hace30Dias.setDate(hoy.getDate() - 29);
    this.fechaInicio = this.formatDate(hace30Dias);
    this.fechaFin = this.formatDate(hoy);
    this.accesoSeleccionado.set('Últimos 30 días');
  }

  setMesActual(): void {
    this.tipoConsulta = 'rango';
    const hoy = new Date();
    const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    this.fechaInicio = this.formatDate(primerDiaMes);
    this.fechaFin = this.formatDate(hoy);
    this.accesoSeleccionado.set('Mes actual');
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
