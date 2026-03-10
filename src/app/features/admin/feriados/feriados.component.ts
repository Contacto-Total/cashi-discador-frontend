import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { FeriadosService, Feriado } from './feriados.service';

@Component({
  selector: 'app-feriados',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
          <lucide-angular name="calendar-off" [size]="28" class="text-teal-500"></lucide-angular>
          Feriados
        </h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1">
          Gestiona los feriados del sistema para excluirlos de la marcaci&oacute;n
        </p>
      </div>

      <!-- Filtros y acciones -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-6">
        <div class="flex flex-wrap items-end gap-4">
          <!-- Selector de a&ntilde;o -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">A&ntilde;o</label>
            <select [(ngModel)]="anioSeleccionado"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
              @for (a of aniosDisponibles; track a) {
                <option [ngValue]="a">{{ a }}</option>
              }
            </select>
          </div>

          <!-- Bot&oacute;n Buscar -->
          <button (click)="cargarFeriados()"
            [disabled]="loading()"
            class="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white font-semibold
                   rounded-lg transition-colors flex items-center gap-2
                   disabled:opacity-50 disabled:cursor-not-allowed">
            @if (loading()) {
              <lucide-angular name="loader-2" [size]="18" class="animate-spin"></lucide-angular>
            } @else {
              <lucide-angular name="search" [size]="18"></lucide-angular>
            }
            Buscar
          </button>

          <!-- Bot&oacute;n Agregar -->
          <button (click)="mostrarForm.set(!mostrarForm())"
            class="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white font-semibold
                   rounded-lg transition-colors flex items-center gap-2">
            <lucide-angular [name]="mostrarForm() ? 'x' : 'plus'" [size]="18"></lucide-angular>
            {{ mostrarForm() ? 'Cancelar' : 'Agregar Feriado' }}
          </button>
        </div>

        <!-- Formulario inline -->
        @if (mostrarForm()) {
          <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div class="flex flex-wrap items-end gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha</label>
                <input type="date" [(ngModel)]="nuevoFeriado.fecha"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-teal-500 focus:border-teal-500" />
              </div>
              <div class="flex-1 min-w-[200px]">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descripci&oacute;n</label>
                <input type="text" [(ngModel)]="nuevoFeriado.descripcion" placeholder="Ej: Navidad"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-teal-500 focus:border-teal-500" />
              </div>
              <button (click)="agregarFeriado()"
                [disabled]="loading()"
                class="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white font-semibold
                       rounded-lg transition-colors flex items-center gap-2
                       disabled:opacity-50 disabled:cursor-not-allowed">
                <lucide-angular name="save" [size]="18"></lucide-angular>
                Guardar
              </button>
              <button (click)="cancelarForm()"
                class="px-4 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500
                       text-gray-800 dark:text-white font-semibold rounded-lg transition-colors
                       flex items-center gap-2">
                <lucide-angular name="x" [size]="18"></lucide-angular>
                Cancelar
              </button>
            </div>
          </div>
        }
      </div>

      <!-- Tabla -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">#</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Fecha</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">D&iacute;a</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Descripci&oacute;n</th>
                <th class="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              @if (loading()) {
                <tr>
                  <td colspan="5" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    <lucide-angular name="loader-2" [size]="32" class="animate-spin mx-auto mb-2"></lucide-angular>
                    <p>Cargando feriados...</p>
                  </td>
                </tr>
              } @else if (feriados().length === 0) {
                <tr>
                  <td colspan="5" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    <lucide-angular name="inbox" [size]="48" class="mx-auto mb-2 text-gray-400"></lucide-angular>
                    <p>No hay feriados registrados para el a&ntilde;o {{ anioSeleccionado }}</p>
                    <p class="text-xs mt-1">Usa el bot&oacute;n "Agregar Feriado" para registrar uno</p>
                  </td>
                </tr>
              } @else {
                @for (feriado of feriados(); track feriado.id; let i = $index) {
                  <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td class="px-4 py-3 text-gray-500 dark:text-gray-400">{{ i + 1 }}</td>
                    <td class="px-4 py-3 text-gray-900 dark:text-white font-medium">{{ feriado.fecha }}</td>
                    <td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ getDiaSemana(feriado.fecha) }}</td>
                    <td class="px-4 py-3 text-gray-900 dark:text-white">{{ feriado.descripcion }}</td>
                    <td class="px-4 py-3 text-center">
                      <button (click)="eliminarFeriado(feriado.id!)"
                        class="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg
                               transition-colors" title="Eliminar feriado">
                        <lucide-angular name="trash-2" [size]="18"></lucide-angular>
                      </button>
                    </td>
                  </tr>
                }
              }
            </tbody>
          </table>
        </div>

        <!-- Footer -->
        @if (feriados().length > 0) {
          <div class="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Mostrando <span class="font-semibold">{{ feriados().length }}</span> feriados para el a&ntilde;o {{ anioSeleccionado }}
            </p>
          </div>
        }
      </div>
    </div>
  `,
  styles: []
})
export class FeriadosComponent implements OnInit {

  // State
  feriados = signal<Feriado[]>([]);
  loading = signal(false);
  mostrarForm = signal(false);

  // Year selector
  anioSeleccionado: number = new Date().getFullYear();
  aniosDisponibles: number[] = [];

  // Form model
  nuevoFeriado = { fecha: '', descripcion: '' };

  private readonly diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  constructor(private feriadosService: FeriadosService) {}

  ngOnInit(): void {
    const currentYear = new Date().getFullYear();
    this.anioSeleccionado = currentYear;
    this.aniosDisponibles = [currentYear - 1, currentYear, currentYear + 1];
    this.cargarFeriados();
  }

  cargarFeriados(): void {
    this.loading.set(true);
    this.feriadosService.listar(this.anioSeleccionado).subscribe({
      next: (data) => {
        this.feriados.set(data);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error cargando feriados:', error);
        this.loading.set(false);
        alert('Error al cargar los feriados');
      }
    });
  }

  agregarFeriado(): void {
    if (!this.nuevoFeriado.fecha || !this.nuevoFeriado.descripcion.trim()) {
      alert('Debe completar la fecha y la descripción');
      return;
    }

    const feriado: Feriado = {
      fecha: this.nuevoFeriado.fecha,
      descripcion: this.nuevoFeriado.descripcion.trim(),
      activo: true
    };

    this.loading.set(true);
    this.feriadosService.crear(feriado).subscribe({
      next: () => {
        this.cargarFeriados();
        this.mostrarForm.set(false);
        this.nuevoFeriado = { fecha: '', descripcion: '' };
      },
      error: (error) => {
        console.error('Error creando feriado:', error);
        this.loading.set(false);
        alert('Error al crear el feriado');
      }
    });
  }

  eliminarFeriado(id: number): void {
    if (!window.confirm('¿Está seguro de eliminar este feriado?')) {
      return;
    }

    this.loading.set(true);
    this.feriadosService.eliminar(id).subscribe({
      next: () => {
        this.cargarFeriados();
      },
      error: (error) => {
        console.error('Error eliminando feriado:', error);
        this.loading.set(false);
        alert('Error al eliminar el feriado');
      }
    });
  }

  cancelarForm(): void {
    this.mostrarForm.set(false);
    this.nuevoFeriado = { fecha: '', descripcion: '' };
  }

  getDiaSemana(fecha: string): string {
    const [year, month, day] = fecha.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return this.diasSemana[date.getDay()];
  }
}
