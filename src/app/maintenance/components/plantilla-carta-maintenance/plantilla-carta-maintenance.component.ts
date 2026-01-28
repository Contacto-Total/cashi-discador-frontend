import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { LucideAngularModule } from 'lucide-angular';
import { environment } from '../../../../environments/environment';

interface PlantillaDisponible {
  codigo: string;
  nombre: string;
  descripcion: string;
}

interface SubcarteraConPlantilla {
  id: number;
  nombre_subcartera: string;
  codigo_subcartera: string;
  nombre_cartera: string;
  nombre_inquilino: string;
  codigo_plantilla: string | null;
  nombrePlantilla: string | null;
  tieneAsignacion: boolean;
}

@Component({
  selector: 'app-plantilla-carta-maintenance',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <!-- Header -->
      <div class="max-w-7xl mx-auto mb-6">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
            <lucide-angular name="file-text" [size]="24" class="text-white"></lucide-angular>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-white">Plantillas de Carta de Acuerdo</h1>
            <p class="text-sm text-gray-400">Asignación de plantillas por subcartera</p>
          </div>
        </div>
      </div>

      <!-- Plantillas disponibles -->
      <div class="max-w-7xl mx-auto mb-6">
        <div class="bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-800">
          <h2 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <lucide-angular name="layout-template" [size]="20" class="text-purple-400"></lucide-angular>
            Plantillas Disponibles
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            @for (plantilla of plantillasDisponibles(); track plantilla.codigo) {
              <div class="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-purple-500 transition-colors">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
                    <lucide-angular name="file-check" [size]="20" class="text-purple-400"></lucide-angular>
                  </div>
                  <div>
                    <h3 class="font-semibold text-white">{{ plantilla.nombre }}</h3>
                    <p class="text-xs text-gray-400">{{ plantilla.codigo }}</p>
                  </div>
                </div>
                <p class="mt-2 text-sm text-gray-400">{{ plantilla.descripcion }}</p>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Tabla de subcarteras -->
      <div class="max-w-7xl mx-auto">
        <div class="bg-slate-900 rounded-xl shadow-sm border border-slate-800 overflow-hidden">
          <div class="p-6 border-b border-slate-800 flex items-center justify-between">
            <h2 class="text-lg font-semibold text-white flex items-center gap-2">
              <lucide-angular name="folder-tree" [size]="20" class="text-purple-400"></lucide-angular>
              Asignación por Subcartera
            </h2>
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-400">
                {{ subcarteras().length }} subcarteras
              </span>
              <button (click)="cargarDatos()"
                      class="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm flex items-center gap-2 transition-colors">
                <lucide-angular name="refresh-cw" [size]="16" [class]="loading() ? 'animate-spin' : ''"></lucide-angular>
                Actualizar
              </button>
            </div>
          </div>

          @if (loading()) {
            <div class="p-8 flex justify-center">
              <lucide-angular name="loader-2" [size]="32" class="text-purple-400 animate-spin"></lucide-angular>
            </div>
          } @else {
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-slate-800/50">
                  <tr>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Proveedor</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Cartera</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Subcartera</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Plantilla Asignada</th>
                    <th class="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-800">
                  @for (sub of subcarteras(); track sub.id) {
                    <tr class="hover:bg-slate-800/30 transition-colors">
                      <td class="px-4 py-3 text-sm text-gray-300">{{ sub.nombre_inquilino }}</td>
                      <td class="px-4 py-3 text-sm text-gray-300">{{ sub.nombre_cartera }}</td>
                      <td class="px-4 py-3">
                        <div class="flex items-center gap-2">
                          <span class="text-sm font-medium text-white">{{ sub.nombre_subcartera }}</span>
                          <span class="px-2 py-0.5 bg-slate-700 rounded text-xs text-gray-400">{{ sub.codigo_subcartera }}</span>
                        </div>
                      </td>
                      <td class="px-4 py-3">
                        @if (editingSubcarteraId() === sub.id) {
                          <select [(ngModel)]="selectedPlantilla"
                                  class="w-full px-3 py-1.5 bg-slate-800 border border-purple-500 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                            <option value="">Sin asignar</option>
                            @for (plantilla of plantillasDisponibles(); track plantilla.codigo) {
                              <option [value]="plantilla.codigo">{{ plantilla.nombre }}</option>
                            }
                          </select>
                        } @else {
                          @if (sub.tieneAsignacion) {
                            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-600/20 text-purple-300 rounded-lg text-sm">
                              <lucide-angular name="check-circle" [size]="14"></lucide-angular>
                              {{ sub.nombrePlantilla }}
                            </span>
                          } @else {
                            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-600/20 text-amber-300 rounded-lg text-sm">
                              <lucide-angular name="alert-circle" [size]="14"></lucide-angular>
                              Sin asignar
                            </span>
                          }
                        }
                      </td>
                      <td class="px-4 py-3 text-center">
                        @if (editingSubcarteraId() === sub.id) {
                          <div class="flex items-center justify-center gap-2">
                            <button (click)="guardarAsignacion(sub.id)"
                                    [disabled]="saving()"
                                    class="px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm flex items-center gap-1.5 transition-colors disabled:opacity-50">
                              @if (saving()) {
                                <lucide-angular name="loader-2" [size]="14" class="animate-spin"></lucide-angular>
                              } @else {
                                <lucide-angular name="check" [size]="14"></lucide-angular>
                              }
                              Guardar
                            </button>
                            <button (click)="cancelarEdicion()"
                                    class="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm flex items-center gap-1.5 transition-colors">
                              <lucide-angular name="x" [size]="14"></lucide-angular>
                              Cancelar
                            </button>
                          </div>
                        } @else {
                          <div class="flex items-center justify-center gap-2">
                            <button (click)="iniciarEdicion(sub)"
                                    class="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm flex items-center gap-1.5 transition-colors">
                              <lucide-angular name="pencil" [size]="14"></lucide-angular>
                              Editar
                            </button>
                            @if (sub.tieneAsignacion) {
                              <button (click)="eliminarAsignacion(sub.id)"
                                      class="px-3 py-1.5 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white rounded-lg text-sm flex items-center gap-1.5 transition-colors">
                                <lucide-angular name="trash-2" [size]="14"></lucide-angular>
                              </button>
                            }
                          </div>
                        }
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
        </div>
      </div>

      <!-- Toast de éxito/error -->
      @if (toastMessage()) {
        <div class="fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg animate-slide-in flex items-center gap-2"
             [class]="toastType() === 'success' ? 'bg-green-600' : 'bg-red-600'">
          <lucide-angular [name]="toastType() === 'success' ? 'check-circle' : 'alert-circle'" [size]="20" class="text-white"></lucide-angular>
          <span class="text-white font-medium">{{ toastMessage() }}</span>
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes slideIn {
      from {
        transform: translateY(100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
    .animate-slide-in {
      animation: slideIn 0.3s ease-out;
    }
  `]
})
export class PlantillaCartaMaintenanceComponent implements OnInit {
  private apiUrl = environment.apiUrl;

  plantillasDisponibles = signal<PlantillaDisponible[]>([]);
  subcarteras = signal<SubcarteraConPlantilla[]>([]);
  loading = signal(false);
  saving = signal(false);

  editingSubcarteraId = signal<number | null>(null);
  selectedPlantilla = '';

  toastMessage = signal('');
  toastType = signal<'success' | 'error'>('success');

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.loading.set(true);

    // Cargar plantillas disponibles
    this.http.get<any>(`${this.apiUrl}/plantillas-carta/disponibles`).subscribe({
      next: (res) => {
        this.plantillasDisponibles.set(res.data || []);
      },
      error: (err) => {
        console.error('Error cargando plantillas:', err);
      }
    });

    // Cargar subcarteras con estado
    this.http.get<any>(`${this.apiUrl}/plantillas-carta/subcarteras`).subscribe({
      next: (res) => {
        this.subcarteras.set(res.data || []);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error cargando subcarteras:', err);
        this.loading.set(false);
        this.mostrarToast('Error al cargar datos', 'error');
      }
    });
  }

  iniciarEdicion(subcartera: SubcarteraConPlantilla): void {
    this.editingSubcarteraId.set(subcartera.id);
    this.selectedPlantilla = subcartera.codigo_plantilla || '';
  }

  cancelarEdicion(): void {
    this.editingSubcarteraId.set(null);
    this.selectedPlantilla = '';
  }

  guardarAsignacion(idSubcartera: number): void {
    this.saving.set(true);

    if (this.selectedPlantilla === '') {
      // Si no hay plantilla seleccionada, eliminar asignación
      this.http.delete<any>(`${this.apiUrl}/plantillas-carta/asignacion/${idSubcartera}`).subscribe({
        next: () => {
          this.mostrarToast('Asignación eliminada correctamente', 'success');
          this.cargarDatos();
          this.cancelarEdicion();
          this.saving.set(false);
        },
        error: (err) => {
          // Si no existía, no es error
          if (err.status === 404) {
            this.mostrarToast('Cambios guardados', 'success');
          } else {
            this.mostrarToast('Error al guardar', 'error');
          }
          this.cargarDatos();
          this.cancelarEdicion();
          this.saving.set(false);
        }
      });
    } else {
      // Asignar plantilla
      this.http.post<any>(`${this.apiUrl}/plantillas-carta/asignar`, {
        idSubcartera: idSubcartera,
        codigoPlantilla: this.selectedPlantilla
      }).subscribe({
        next: () => {
          this.mostrarToast('Plantilla asignada correctamente', 'success');
          this.cargarDatos();
          this.cancelarEdicion();
          this.saving.set(false);
        },
        error: (err) => {
          console.error('Error asignando plantilla:', err);
          this.mostrarToast('Error al asignar plantilla', 'error');
          this.saving.set(false);
        }
      });
    }
  }

  eliminarAsignacion(idSubcartera: number): void {
    if (!confirm('¿Está seguro de eliminar esta asignación?')) return;

    this.http.delete<any>(`${this.apiUrl}/plantillas-carta/asignacion/${idSubcartera}`).subscribe({
      next: () => {
        this.mostrarToast('Asignación eliminada', 'success');
        this.cargarDatos();
      },
      error: (err) => {
        console.error('Error eliminando asignación:', err);
        this.mostrarToast('Error al eliminar', 'error');
      }
    });
  }

  private mostrarToast(mensaje: string, tipo: 'success' | 'error'): void {
    this.toastMessage.set(mensaje);
    this.toastType.set(tipo);
    setTimeout(() => this.toastMessage.set(''), 3000);
  }
}
