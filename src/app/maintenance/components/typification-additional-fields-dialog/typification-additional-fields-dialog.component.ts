import { Component, effect, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { AdditionalFieldV2, CampoOpcionDTO, ConfigurarOpcionesCampoRequest, FieldTypeV2, OpcionToggleDTO } from '../../models/typification-v2.model';
import { TypificationV2Service } from '../../services/typification-v2.service';

@Component({
  selector: 'app-typification-additional-fields-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    @if (isOpen()) {
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
          <!-- Header -->
          <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <lucide-angular name="settings" [size]="24" class="text-blue-600"></lucide-angular>
              Configurar Campos Adicionales - {{ typificationName() }}
            </h2>
            <button
              type="button"
              (click)="handleCancel()"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <lucide-angular name="x" [size]="24"></lucide-angular>
            </button>
          </div>

          <!-- Body -->
          <div class="flex-1 overflow-y-auto p-6 space-y-4">
            <!-- Instrucciones -->
            <div class="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p class="text-sm text-blue-700 dark:text-blue-400 flex items-center gap-2">
                <lucide-angular name="info" [size]="16"></lucide-angular>
                <span>
                  <strong>Instrucciones:</strong> Seleccione una subcartera y un campo para configurar qué montos puede ver el agente.
                  Los montos se obtienen de las columnas numéricas de la tabla de clientes.
                </span>
              </p>
            </div>

            <!-- Selector de Subcartera -->
            @if (portfolioId()) {
              <div class="p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg">
                <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <lucide-angular name="database" [size]="16" class="text-blue-600"></lucide-angular>
                  Seleccionar Subcartera
                </label>

                @if (loadingSubPortfolios()) {
                  <div class="flex items-center gap-2 py-2 text-sm text-gray-600 dark:text-gray-400">
                    <lucide-angular name="loader" [size]="16" class="animate-spin"></lucide-angular>
                    Cargando subcarteras...
                  </div>
                } @else if (subPortfolios().length > 0) {
                  <select
                    [(ngModel)]="selectedSubPortfolioId"
                    (ngModelChange)="onSubPortfolioChange($event)"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                  >
                    <option [ngValue]="undefined">-- Seleccione una subcartera --</option>
                    @for (subPortfolio of subPortfolios(); track subPortfolio.id) {
                      <option [ngValue]="subPortfolio.id">{{ subPortfolio.nombre || subPortfolio.nombreSubcartera }}</option>
                    }
                  </select>
                } @else {
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    No hay subcarteras disponibles para este portfolio
                  </p>
                }
              </div>
            }

            <!-- Selector de Campo Configurable (CHIP_SELECT o PAYMENT_SCHEDULE) -->
            @if (selectedSubPortfolioId()) {
              <div class="p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg">
                <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <lucide-angular name="list" [size]="16" class="text-purple-600"></lucide-angular>
                  Seleccionar Campo a Configurar
                </label>

                @if (loadingFields()) {
                  <div class="flex items-center gap-2 py-2 text-sm text-gray-600 dark:text-gray-400">
                    <lucide-angular name="loader" [size]="16" class="animate-spin"></lucide-angular>
                    Cargando campos...
                  </div>
                } @else if (additionalFields().length > 0) {
                  <select
                    [(ngModel)]="selectedCampoId"
                    (ngModelChange)="onCampoChange($event)"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                  >
                    <option [ngValue]="undefined">-- Seleccione un campo --</option>
                    @for (campo of additionalFields(); track campo.id) {
                      <option [ngValue]="campo.id">
                        {{ campo.labelCampo || campo.nombreCampo }}
                        ({{ campo.tipoCampo === 'CHIP_SELECT' ? 'Selector' : 'Cronograma' }})
                      </option>
                    }
                  </select>
                } @else {
                  <div class="text-center py-4 text-yellow-600 dark:text-yellow-400">
                    <lucide-angular name="alert-triangle" [size]="24" class="mx-auto mb-2"></lucide-angular>
                    <p class="text-sm">Esta tipificación no tiene campos configurables (CHIP_SELECT o PAYMENT_SCHEDULE)</p>
                  </div>
                }
              </div>
            }

            <!-- Lista de Opciones con Toggles -->
            @if (selectedSubPortfolioId() && selectedCampoId()) {
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <lucide-angular name="list-checks" [size]="20" class="text-green-600"></lucide-angular>
                    Opciones para: {{ getSelectedCampoName() }}
                  </h3>
                  @if (!opcionesInicializadas() && !loadingOpciones()) {
                    <button
                      type="button"
                      (click)="inicializarOpciones()"
                      class="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                    >
                      <lucide-angular name="refresh-cw" [size]="16"></lucide-angular>
                      Cargar Opciones
                    </button>
                  }
                </div>

                @if (loadingOpciones()) {
                  <div class="flex items-center justify-center py-12">
                    <lucide-angular name="loader" [size]="48" class="animate-spin text-blue-600"></lucide-angular>
                  </div>
                } @else if (opciones().length === 0 && !opcionesInicializadas()) {
                  <div class="text-center py-12 text-gray-500 dark:text-gray-400">
                    <lucide-angular name="inbox" [size]="48" class="mx-auto mb-4 opacity-50"></lucide-angular>
                    <p>Haga clic en "Cargar Opciones" para ver los campos disponibles</p>
                  </div>
                } @else if (opciones().length > 0) {
                  <div class="space-y-2">
                    @for (opcion of opciones(); track opcion.codigoOpcion) {
                      <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                        <div class="flex items-center gap-3 flex-1">
                          <!-- Toggle Switch -->
                          <label class="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              [(ngModel)]="opcion.estaHabilitada"
                              class="sr-only peer"
                            >
                            <div class="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                          </label>

                          <!-- Label y Badge -->
                          <div class="flex items-center gap-2 flex-1">
                            <span class="text-sm font-medium text-gray-900 dark:text-white">
                              {{ opcion.labelOpcion }}
                            </span>
                            @if (opcion.codigoOpcion === 'personalizado') {
                              <span class="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-xs font-semibold rounded-full">
                                Input Manual
                              </span>
                            } @else {
                              <span class="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs font-medium rounded-full">
                                {{ opcion.campoTablaDinamica }}
                              </span>
                            }
                          </div>

                          <!-- Estado -->
                          <div class="flex items-center gap-1">
                            @if (opcion.estaHabilitada) {
                              <lucide-angular name="check-circle" [size]="16" class="text-green-600"></lucide-angular>
                              <span class="text-xs text-green-600 dark:text-green-400 font-medium">Habilitada</span>
                            } @else {
                              <lucide-angular name="x-circle" [size]="16" class="text-gray-400"></lucide-angular>
                              <span class="text-xs text-gray-500 dark:text-gray-400">Deshabilitada</span>
                            }
                          </div>
                        </div>
                      </div>
                    }
                  </div>

                  <!-- Resumen -->
                  <div class="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <p class="text-sm text-green-700 dark:text-green-400 flex items-center gap-2">
                      <lucide-angular name="check" [size]="16"></lucide-angular>
                      <strong>{{ getOpcionesHabilitadasCount() }}</strong> de <strong>{{ opciones().length }}</strong> opciones habilitadas
                    </p>
                  </div>
                } @else {
                  <div class="text-center py-12 text-yellow-600 dark:text-yellow-400">
                    <lucide-angular name="alert-triangle" [size]="48" class="mx-auto mb-4"></lucide-angular>
                    <p>No se encontraron campos numéricos en esta subcartera</p>
                  </div>
                }
              </div>
            }
          </div>

          <!-- Footer -->
          <div class="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              (click)="handleCancel()"
              class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancelar
            </button>
            <button
              type="button"
              (click)="handleSave()"
              [disabled]="!selectedSubPortfolioId() || !selectedCampoId() || opciones().length === 0 || loadingOpciones()"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <lucide-angular name="save" [size]="20"></lucide-angular>
              Guardar Configuración
            </button>
          </div>
        </div>
      </div>
    }
  `
})
export class TypificationAdditionalFieldsDialogComponent {
  isOpen = input.required<boolean>();
  typificationName = input<string>('');
  typificationId = input.required<number>();
  tenantId = input.required<number>();
  portfolioId = input<number | undefined>(undefined);
  subPortfolioId = input<number | undefined>(undefined);

  close = output<void>();
  save = output<void>();

  opciones = signal<CampoOpcionDTO[]>([]);
  loadingOpciones = signal<boolean>(false);
  opcionesInicializadas = signal<boolean>(false);
  subPortfolios = signal<any[]>([]);
  loadingSubPortfolios = signal<boolean>(false);
  selectedSubPortfolioId = signal<number | undefined>(undefined);

  // New: Additional fields (CHIP_SELECT type only)
  additionalFields = signal<AdditionalFieldV2[]>([]);
  loadingFields = signal<boolean>(false);
  selectedCampoId = signal<number | undefined>(undefined);

  private typificationService = inject(TypificationV2Service);

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        console.log('Dialog opened with:', {
          typificationId: this.typificationId(),
          tenantId: this.tenantId(),
          portfolioId: this.portfolioId(),
          subPortfolioId: this.subPortfolioId()
        });
        this.loadSubPortfolios();
        this.loadAdditionalFields();
      }
    });
  }

  loadAdditionalFields() {
    const typificationId = this.typificationId();
    if (!typificationId) return;

    this.loadingFields.set(true);
    this.typificationService.getAdditionalFields(typificationId).subscribe({
      next: (fields) => {
        // Filter CHIP_SELECT and PAYMENT_SCHEDULE type fields (both need amount configuration)
        const configurableFields = fields.filter(f =>
          f.tipoCampo === FieldTypeV2.CHIP_SELECT ||
          f.tipoCampo === FieldTypeV2.PAYMENT_SCHEDULE
        );
        this.additionalFields.set(configurableFields);
        this.loadingFields.set(false);
        console.log('Configurable fields loaded:', configurableFields.length, configurableFields.map(f => f.tipoCampo));

        // Auto-select if only one configurable field
        if (configurableFields.length === 1) {
          this.selectedCampoId.set(configurableFields[0].id);
        }
      },
      error: (error) => {
        console.error('Error loading additional fields:', error);
        this.additionalFields.set([]);
        this.loadingFields.set(false);
      }
    });
  }

  loadSubPortfolios() {
    const portfolioId = this.portfolioId();

    if (!portfolioId) {
      console.warn('No portfolio selected, cannot load subportfolios');
      return;
    }

    this.loadingSubPortfolios.set(true);

    this.typificationService.getSubPortfoliosByPortfolio(portfolioId)
      .subscribe({
        next: (subPortfolios) => {
          this.subPortfolios.set(subPortfolios);
          this.loadingSubPortfolios.set(false);

          // Si hay subPortfolioId preseleccionado, usarlo
          if (this.subPortfolioId()) {
            this.selectedSubPortfolioId.set(this.subPortfolioId());
          }
        },
        error: (error) => {
          console.error('Error loading subportfolios:', error);
          this.subPortfolios.set([]);
          this.loadingSubPortfolios.set(false);
        }
      });
  }

  onSubPortfolioChange(subPortfolioId: number) {
    this.selectedSubPortfolioId.set(subPortfolioId);
    this.opciones.set([]);
    this.opcionesInicializadas.set(false);
  }

  onCampoChange(campoId: number) {
    this.selectedCampoId.set(campoId);
    this.opciones.set([]);
    this.opcionesInicializadas.set(false);
  }

  inicializarOpciones() {
    const tenantId = this.tenantId();
    const portfolioId = this.portfolioId();
    const subPortfolioId = this.selectedSubPortfolioId();
    const campoId = this.selectedCampoId();

    if (!tenantId || !portfolioId || !subPortfolioId || !campoId) {
      console.warn('Faltan parámetros para inicializar opciones', { tenantId, portfolioId, subPortfolioId, campoId });
      return;
    }

    this.loadingOpciones.set(true);

    // Primero intentamos cargar opciones existentes usando el campoId (NOT typificationId)
    this.typificationService.getOpcionesCampo(campoId)
      .subscribe({
        next: (opciones) => {
          if (opciones && opciones.length > 0) {
            // Ya existen opciones, cargarlas
            this.opciones.set(opciones);
            this.opcionesInicializadas.set(true);
            this.loadingOpciones.set(false);
            console.log('Opciones cargadas para campo', campoId, ':', opciones.length);
          } else {
            // No existen opciones, inicializarlas
            this.inicializarNuevasOpciones(campoId, tenantId, portfolioId, subPortfolioId);
          }
        },
        error: (error) => {
          console.error('Error cargando opciones para campo', campoId, ', intentando inicializar:', error);
          this.inicializarNuevasOpciones(campoId, tenantId, portfolioId, subPortfolioId);
        }
      });
  }

  private inicializarNuevasOpciones(
    campoId: number,
    tenantId: number,
    portfolioId: number,
    subPortfolioId: number
  ) {
    this.typificationService.inicializarOpcionesCampo(campoId, tenantId, portfolioId, subPortfolioId)
      .subscribe({
        next: (opciones) => {
          this.opciones.set(opciones);
          this.opcionesInicializadas.set(true);
          this.loadingOpciones.set(false);
          console.log('Opciones inicializadas:', opciones.length);
        },
        error: (error) => {
          console.error('Error inicializando opciones:', error);
          this.opciones.set([]);
          this.opcionesInicializadas.set(false);
          this.loadingOpciones.set(false);
        }
      });
  }

  getOpcionesHabilitadasCount(): number {
    return this.opciones().filter(o => o.estaHabilitada).length;
  }

  handleCancel() {
    this.close.emit();
  }

  handleSave() {
    const campoId = this.selectedCampoId();
    const opcionesActuales = this.opciones();

    if (!campoId || opcionesActuales.length === 0) {
      console.warn('No hay opciones para guardar');
      return;
    }

    // Preparar request usando el campoId correcto (NOT typificationId)
    const request: ConfigurarOpcionesCampoRequest = {
      idCampo: campoId,
      opciones: opcionesActuales.map(o => ({
        codigoOpcion: o.codigoOpcion,
        estaHabilitada: o.estaHabilitada,
        ordenVisualizacion: o.ordenVisualizacion
      }))
    };

    // Guardar configuración
    this.typificationService.configurarOpciones(request)
      .subscribe({
        next: (opcionesActualizadas) => {
          console.log('Opciones guardadas exitosamente para campo', campoId, ':', opcionesActualizadas.length);
          this.opciones.set(opcionesActualizadas);
          this.save.emit();
        },
        error: (error) => {
          console.error('Error guardando opciones:', error);
        }
      });
  }

  getSelectedCampoName(): string {
    const campoId = this.selectedCampoId();
    if (!campoId) return '';
    const campo = this.additionalFields().find(f => f.id === campoId);
    return campo?.labelCampo || campo?.nombreCampo || '';
  }
}
