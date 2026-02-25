import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { UmbralesEstadoService, ConfigUmbralEstado } from '../../services/umbrales-estado.service';

@Component({
  selector: 'app-umbrales-estado',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  styles: [`
    @keyframes slideIn {
      from { transform: translateY(-100%); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    .animate-slide-in { animation: slideIn 0.3s ease-out; }
  `],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <!-- Toast -->
      @if (toastMessage()) {
        <div class="fixed top-4 right-4 z-50 animate-slide-in">
          <div class="px-4 py-3 rounded-lg shadow-lg border flex items-center gap-2"
               [class]="toastType() === 'success'
                 ? 'bg-emerald-900/90 border-emerald-700 text-emerald-200'
                 : 'bg-red-900/90 border-red-700 text-red-200'">
            <lucide-angular [name]="toastType() === 'success' ? 'check-circle' : 'alert-circle'" [size]="18"></lucide-angular>
            <span class="text-sm font-medium">{{ toastMessage() }}</span>
          </div>
        </div>
      }

      <!-- Header -->
      <div class="max-w-7xl mx-auto mb-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <lucide-angular name="timer" [size]="24" class="text-white"></lucide-angular>
            </div>
            <div>
              <h1 class="text-2xl font-bold text-white">Umbrales de Estado</h1>
              <p class="text-sm text-gray-400">Configuración de tiempos límite por estado de agente</p>
            </div>
          </div>
          <button (click)="recargarCache()"
                  [disabled]="saving()"
                  class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-lg text-sm font-medium transition-all disabled:opacity-50 shadow-lg">
            <lucide-angular name="refresh-cw" [size]="16" [class.animate-spin]="saving()"></lucide-angular>
            Recargar Cache
          </button>
        </div>
      </div>

      <!-- Table -->
      <div class="max-w-7xl mx-auto">
        <div class="bg-slate-900/80 rounded-xl shadow-sm border border-slate-800 overflow-hidden">
          @if (loading()) {
            <div class="flex items-center justify-center py-20">
              <div class="flex items-center gap-3 text-gray-400">
                <lucide-angular name="loader-2" [size]="24" class="animate-spin"></lucide-angular>
                <span>Cargando umbrales...</span>
              </div>
            </div>
          } @else {
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="border-b border-slate-700/50">
                    <th class="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Estado</th>
                    <th class="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Umbrales</th>
                    <th class="text-center px-4 py-3 text-xs font-semibold text-emerald-400 uppercase tracking-wider">Verde (min)</th>
                    <th class="text-center px-4 py-3 text-xs font-semibold text-amber-400 uppercase tracking-wider">Amarillo (min)</th>
                    <th class="text-center px-4 py-3 text-xs font-semibold text-red-400 uppercase tracking-wider">Rojo/Máx (min)</th>
                    <th class="text-center px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Alerta Sup.</th>
                    <th class="text-center px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Sonido</th>
                    <th class="text-center px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Activo</th>
                    <th class="text-center px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  @for (umbral of umbrales(); track umbral.id) {
                    <tr class="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                        [class.bg-slate-800/50]="editingId() === umbral.id"
                        (click)="startEditing(umbral)">
                      <!-- Estado badge -->
                      <td class="px-4 py-3">
                        <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                              [style.background-color]="getEstadoColor(umbral.estado) + '22'"
                              [style.color]="getEstadoColor(umbral.estado)"
                              [style.border]="'1px solid ' + getEstadoColor(umbral.estado) + '44'">
                          {{ umbral.estado }}
                        </span>
                      </td>

                      <!-- Barra visual -->
                      <td class="px-4 py-3">
                        <div class="flex h-3 rounded-full overflow-hidden bg-slate-700/50 w-36">
                          <div class="bg-emerald-500" [style.width.%]="getBarPercent(umbral, 'verde')"></div>
                          <div class="bg-amber-500" [style.width.%]="getBarPercent(umbral, 'amarillo')"></div>
                          <div class="bg-red-500" [style.width.%]="getBarPercent(umbral, 'rojo')"></div>
                        </div>
                      </td>

                      <!-- Verde -->
                      <td class="px-4 py-3 text-center" (click)="$event.stopPropagation()">
                        @if (editingId() === umbral.id) {
                          <input type="number" [(ngModel)]="editForm.umbralVerdeMin" min="0" step="0.5"
                                 class="w-20 px-2 py-1 bg-slate-700 border border-emerald-500/50 rounded text-white text-sm text-center focus:outline-none focus:ring-2 focus:ring-emerald-500">
                        } @else {
                          <span class="text-emerald-400 font-medium">{{ toMin(umbral.umbralVerdeSegundos) }}</span>
                        }
                      </td>

                      <!-- Amarillo -->
                      <td class="px-4 py-3 text-center" (click)="$event.stopPropagation()">
                        @if (editingId() === umbral.id) {
                          <input type="number" [(ngModel)]="editForm.umbralAmarilloMin" min="0" step="0.5"
                                 class="w-20 px-2 py-1 bg-slate-700 border border-amber-500/50 rounded text-white text-sm text-center focus:outline-none focus:ring-2 focus:ring-amber-500">
                        } @else {
                          <span class="text-amber-400 font-medium">{{ toMin(umbral.umbralAmarilloSegundos) }}</span>
                        }
                      </td>

                      <!-- Rojo / Máximo (siempre iguales) -->
                      <td class="px-4 py-3 text-center" (click)="$event.stopPropagation()">
                        @if (editingId() === umbral.id) {
                          <input type="number" [(ngModel)]="editForm.tiempoMaximoMin" min="0" step="0.5"
                                 class="w-20 px-2 py-1 bg-slate-700 border border-red-500/50 rounded text-white text-sm text-center focus:outline-none focus:ring-2 focus:ring-red-500">
                        } @else {
                          <span class="text-red-400 font-medium">{{ toMin(umbral.tiempoMaximoSegundos) }}</span>
                        }
                      </td>

                      <!-- Alerta Supervisor -->
                      <td class="px-4 py-3 text-center" (click)="$event.stopPropagation()">
                        @if (editingId() === umbral.id) {
                          <button (click)="editForm.alertaSupervisor = !editForm.alertaSupervisor"
                                  class="w-8 h-8 rounded-lg flex items-center justify-center transition-colors mx-auto"
                                  [class]="editForm.alertaSupervisor ? 'bg-blue-600 text-white' : 'bg-slate-700 text-gray-500'">
                            <lucide-angular [name]="editForm.alertaSupervisor ? 'bell' : 'bell-off'" [size]="16"></lucide-angular>
                          </button>
                        } @else {
                          <div class="flex justify-center">
                            <lucide-angular [name]="umbral.alertaSupervisor ? 'bell' : 'bell-off'" [size]="16"
                                            [class]="umbral.alertaSupervisor ? 'text-blue-400' : 'text-gray-600'"></lucide-angular>
                          </div>
                        }
                      </td>

                      <!-- Sonido -->
                      <td class="px-4 py-3 text-center" (click)="$event.stopPropagation()">
                        @if (editingId() === umbral.id) {
                          <button (click)="editForm.sonidoAlerta = !editForm.sonidoAlerta"
                                  class="w-8 h-8 rounded-lg flex items-center justify-center transition-colors mx-auto"
                                  [class]="editForm.sonidoAlerta ? 'bg-purple-600 text-white' : 'bg-slate-700 text-gray-500'">
                            <lucide-angular [name]="editForm.sonidoAlerta ? 'volume-2' : 'volume-x'" [size]="16"></lucide-angular>
                          </button>
                        } @else {
                          <div class="flex justify-center">
                            <lucide-angular [name]="umbral.sonidoAlerta ? 'volume-2' : 'volume-x'" [size]="16"
                                            [class]="umbral.sonidoAlerta ? 'text-purple-400' : 'text-gray-600'"></lucide-angular>
                          </div>
                        }
                      </td>

                      <!-- Activo -->
                      <td class="px-4 py-3 text-center" (click)="$event.stopPropagation()">
                        @if (editingId() === umbral.id) {
                          <button (click)="editForm.activo = !editForm.activo"
                                  class="w-8 h-8 rounded-lg flex items-center justify-center transition-colors mx-auto"
                                  [class]="editForm.activo ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-gray-500'">
                            <lucide-angular [name]="editForm.activo ? 'check' : 'x'" [size]="16"></lucide-angular>
                          </button>
                        } @else {
                          <div class="flex justify-center">
                            <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                                  [class]="umbral.activo ? 'bg-emerald-900/50 text-emerald-400' : 'bg-gray-800 text-gray-500'">
                              {{ umbral.activo ? 'Sí' : 'No' }}
                            </span>
                          </div>
                        }
                      </td>

                      <!-- Acciones -->
                      <td class="px-4 py-3 text-center" (click)="$event.stopPropagation()">
                        @if (editingId() === umbral.id) {
                          <div class="flex items-center justify-center gap-1">
                            <button (click)="saveUmbral(umbral)"
                                    [disabled]="saving()"
                                    class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium transition-colors disabled:opacity-50 flex items-center gap-1">
                              <lucide-angular name="save" [size]="14"></lucide-angular>
                              Guardar
                            </button>
                            <button (click)="cancelEditing()"
                                    class="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded-lg text-xs font-medium transition-colors flex items-center gap-1">
                              <lucide-angular name="x" [size]="14"></lucide-angular>
                            </button>
                          </div>
                        } @else {
                          <button (click)="startEditing(umbral)"
                                  class="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded-lg text-xs font-medium transition-colors">
                            <lucide-angular name="pencil" [size]="14"></lucide-angular>
                          </button>
                        }
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>

            <!-- Info footer -->
            <div class="px-4 py-3 border-t border-slate-800/50 flex items-center gap-2 text-xs text-gray-500">
              <lucide-angular name="info" [size]="14"></lucide-angular>
              <span>Los valores se muestran en minutos. Click en una fila para editar. Recuerda recargar cache después de guardar cambios.</span>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class UmbralesEstadoComponent implements OnInit {
  umbrales = signal<ConfigUmbralEstado[]>([]);
  loading = signal(true);
  saving = signal(false);
  editingId = signal<number | null>(null);
  toastMessage = signal('');
  toastType = signal<'success' | 'error'>('success');

  editForm = {
    umbralVerdeMin: 0,
    umbralAmarilloMin: 0,
    tiempoMaximoMin: 0,
    alertaSupervisor: false,
    sonidoAlerta: false,
    activo: true
  };

  private estadoColors: Record<string, string> = {
    'DISPONIBLE': '#22c55e',
    'EN_LLAMADA': '#3b82f6',
    'ACW': '#f59e0b',
    'BREAK': '#a855f7',
    'LUNCH': '#ec4899',
    'CAPACITACION': '#06b6d4',
    'FEEDBACK': '#8b5cf6',
    'SERVICIOS': '#64748b',
    'DESCONECTADO': '#ef4444'
  };

  constructor(private umbralesService: UmbralesEstadoService) {}

  ngOnInit(): void {
    this.loadUmbrales();
  }

  loadUmbrales(): void {
    this.loading.set(true);
    this.umbralesService.getAll().subscribe({
      next: (data) => {
        this.umbrales.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.showToast('Error al cargar umbrales', 'error');
        this.loading.set(false);
      }
    });
  }

  toMin(seconds: number): number {
    return Math.round((seconds / 60) * 100) / 100;
  }

  getEstadoColor(estado: string): string {
    return this.estadoColors[estado] || '#94a3b8';
  }

  getBarPercent(umbral: ConfigUmbralEstado, segment: string): number {
    const total = umbral.tiempoMaximoSegundos || 1;
    switch (segment) {
      case 'verde': return (umbral.umbralVerdeSegundos / total) * 100;
      case 'amarillo': return ((umbral.umbralAmarilloSegundos - umbral.umbralVerdeSegundos) / total) * 100;
      case 'rojo': return ((total - umbral.umbralAmarilloSegundos) / total) * 100;
      default: return 0;
    }
  }

  startEditing(umbral: ConfigUmbralEstado): void {
    if (this.editingId() === umbral.id) return;
    this.editingId.set(umbral.id);
    this.editForm = {
      umbralVerdeMin: this.toMin(umbral.umbralVerdeSegundos),
      umbralAmarilloMin: this.toMin(umbral.umbralAmarilloSegundos),
      tiempoMaximoMin: this.toMin(umbral.tiempoMaximoSegundos),
      alertaSupervisor: umbral.alertaSupervisor,
      sonidoAlerta: umbral.sonidoAlerta,
      activo: umbral.activo
    };
  }

  cancelEditing(): void {
    this.editingId.set(null);
  }

  saveUmbral(umbral: ConfigUmbralEstado): void {
    this.saving.set(true);
    const tiempoMaxSeg = Math.round(this.editForm.tiempoMaximoMin * 60);
    const payload: Partial<ConfigUmbralEstado> = {
      umbralVerdeSegundos: Math.round(this.editForm.umbralVerdeMin * 60),
      umbralAmarilloSegundos: Math.round(this.editForm.umbralAmarilloMin * 60),
      umbralRojoSegundos: tiempoMaxSeg,
      tiempoMaximoSegundos: tiempoMaxSeg,
      alertaSupervisor: this.editForm.alertaSupervisor,
      sonidoAlerta: this.editForm.sonidoAlerta,
      activo: this.editForm.activo
    };

    this.umbralesService.update(umbral.id, payload).subscribe({
      next: () => {
        // Update local data
        const updated = this.umbrales().map(u =>
          u.id === umbral.id ? { ...u, ...payload } : u
        );
        this.umbrales.set(updated);
        this.editingId.set(null);
        this.saving.set(false);
        this.showToast(`Umbral "${umbral.estado}" actualizado correctamente`, 'success');
      },
      error: () => {
        this.saving.set(false);
        this.showToast('Error al guardar umbral', 'error');
      }
    });
  }

  recargarCache(): void {
    this.saving.set(true);
    this.umbralesService.recargarCache().subscribe({
      next: () => {
        this.saving.set(false);
        this.showToast('Cache recargado correctamente', 'success');
      },
      error: () => {
        this.saving.set(false);
        this.showToast('Error al recargar cache', 'error');
      }
    });
  }

  private showToast(message: string, type: 'success' | 'error'): void {
    this.toastMessage.set(message);
    this.toastType.set(type);
    setTimeout(() => this.toastMessage.set(''), 3000);
  }
}
