import { Component, effect, inject, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { HttpClient } from '@angular/common/http';
import { AdditionalFieldV2, CampoOpcionDTO, ConfigurarOpcionesCampoRequest, FieldTypeV2, RestriccionFecha } from '../../models/typification-v2.model';
import { TypificationV2Service } from '../../services/typification-v2.service';
import { environment } from '../../../../environments/environment';

interface ConfiguracionCabecera {
  codigo: string;
  nombre: string;
  tipoDato: string;
  tipoSql: string;
}

@Component({
  selector: 'app-typification-additional-fields-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    @if (isOpen()) {
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col">
          <!-- Header -->
          <div class="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-600 to-blue-600">
            <h2 class="text-lg font-bold text-white flex items-center gap-2">
              <lucide-angular name="sliders" [size]="22" class="text-white"></lucide-angular>
              Configurar Montos - {{ typificationName() }}
            </h2>
            <button
              type="button"
              (click)="handleCancel()"
              class="text-white/80 hover:text-white"
            >
              <lucide-angular name="x" [size]="24"></lucide-angular>
            </button>
          </div>

          <!-- Body -->
          <div class="flex-1 overflow-y-auto p-5 space-y-4">
            <!-- Selector de Subcartera -->
            @if (portfolioId()) {
              <div class="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <lucide-angular name="database" [size]="16" class="text-blue-600"></lucide-angular>
                  Subcartera
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
                    class="w-full px-3 py-2 border border-blue-300 dark:border-blue-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option [ngValue]="undefined">-- Seleccione una subcartera --</option>
                    @for (subPortfolio of subPortfolios(); track subPortfolio.id) {
                      <option [ngValue]="subPortfolio.id">{{ subPortfolio.nombre || subPortfolio.nombreSubcartera }}</option>
                    }
                  </select>
                } @else {
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    No hay subcarteras disponibles
                  </p>
                }
              </div>
            }

            <!-- Lista de Opciones con Toggles -->
            @if (selectedSubPortfolioId()) {
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <h3 class="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <lucide-angular name="list-checks" [size]="18" class="text-green-600"></lucide-angular>
                    Montos disponibles para el agente
                  </h3>
                  @if (opciones().length > 0) {
                    <span class="text-xs text-gray-500 dark:text-gray-400">
                      {{ getOpcionesHabilitadasCount() }}/{{ opciones().length }} habilitados
                    </span>
                  }
                </div>

                @if (loadingOpciones()) {
                  <div class="flex flex-col items-center justify-center py-12 text-gray-500">
                    <lucide-angular name="loader" [size]="40" class="animate-spin text-blue-600 mb-3"></lucide-angular>
                    <p class="text-sm">Cargando montos disponibles...</p>
                  </div>
                } @else if (opcionesConNombres().length > 0) {
                  <div class="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                    @for (opcion of opcionesConNombres(); track opcion.codigoOpcion) {
                      <div
                        class="p-3 rounded-lg border transition-all"
                        [class.bg-green-50]="opcion.estaHabilitada"
                        [class.dark:bg-green-900/20]="opcion.estaHabilitada"
                        [class.border-green-300]="opcion.estaHabilitada"
                        [class.dark:border-green-700]="opcion.estaHabilitada"
                        [class.bg-gray-50]="!opcion.estaHabilitada"
                        [class.dark:bg-gray-700/50]="!opcion.estaHabilitada"
                        [class.border-gray-200]="!opcion.estaHabilitada"
                        [class.dark:border-gray-600]="!opcion.estaHabilitada"
                      >
                        <!-- Row 1: Toggle + Label + Badge -->
                        <div class="flex items-center justify-between cursor-pointer" (click)="toggleOpcionOriginal(opcion)">
                          <div class="flex items-center gap-3 flex-1">
                            <!-- Toggle Switch -->
                            <label class="relative inline-flex items-center cursor-pointer" (click)="$event.stopPropagation()">
                              <input
                                type="checkbox"
                                [checked]="opcion.estaHabilitada"
                                (change)="toggleOpcionOriginal(opcion)"
                                class="sr-only peer"
                              >
                              <div class="w-10 h-5 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-300 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                            </label>

                            <!-- Label -->
                            <div class="flex-1">
                              <span class="text-sm font-medium text-gray-900 dark:text-white">
                                {{ opcion.visualName }}
                              </span>
                              @if (opcion.codigoOpcion !== 'personalizado') {
                                <span class="ml-2 text-xs text-gray-500 dark:text-gray-400">
                                  ({{ opcion.campoTablaDinamica }})
                                </span>
                              }
                            </div>

                            <!-- Badge -->
                            @if (opcion.codigoOpcion === 'personalizado') {
                              <span class="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-xs font-semibold rounded-full">
                                Manual
                              </span>
                            }
                          </div>

                          <!-- Status Icon -->
                          <div class="ml-2">
                            @if (opcion.estaHabilitada) {
                              <lucide-angular name="check-circle" [size]="20" class="text-green-600"></lucide-angular>
                            } @else {
                              <lucide-angular name="circle" [size]="20" class="text-gray-300 dark:text-gray-500"></lucide-angular>
                            }
                          </div>
                        </div>

                        <!-- Row 2: Restricción de Fecha y Genera Carta (solo si está habilitada) -->
                        @if (opcion.estaHabilitada) {
                          <div class="mt-2 pt-2 border-t border-green-200 dark:border-green-800 space-y-2" (click)="$event.stopPropagation()">
                            <!-- Restricción de fecha -->
                            <div class="flex items-center gap-2">
                              <lucide-angular name="calendar" [size]="14" class="text-blue-600"></lucide-angular>
                              <span class="text-xs font-medium text-gray-700 dark:text-gray-300">Restricción de fecha:</span>
                              <select
                                [ngModel]="opcion.restriccionFecha || 'SIN_RESTRICCION'"
                                (ngModelChange)="onRestriccionFechaChange(opcion.codigoOpcion, $event)"
                                class="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="SIN_RESTRICCION">Sin restricción (cualquier fecha)</option>
                                <option value="DENTRO_MES">Solo dentro del mes actual</option>
                                <option value="FUERA_MES">Solo fuera del mes (próximo mes+)</option>
                              </select>
                            </div>
                            <!-- Genera Carta de Acuerdo -->
                            <div class="flex items-center gap-2">
                              <lucide-angular name="file-text" [size]="14" class="text-purple-600"></lucide-angular>
                              <span class="text-xs font-medium text-gray-700 dark:text-gray-300">Genera Carta de Acuerdo:</span>
                              <label class="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  [checked]="opcion.generaCartaAcuerdo"
                                  (change)="onGeneraCartaChange(opcion.codigoOpcion, $event)"
                                  class="sr-only peer"
                                >
                                <div class="w-9 h-5 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-300 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-500"></div>
                              </label>
                              <span class="text-xs text-gray-500 dark:text-gray-400">
                                {{ opcion.generaCartaAcuerdo ? 'Sí' : 'No' }}
                              </span>
                            </div>
                          </div>
                        }
                      </div>
                    }
                  </div>
                } @else if (errorMessage()) {
                  <div class="text-center py-8 text-red-500 dark:text-red-400">
                    <lucide-angular name="alert-circle" [size]="40" class="mx-auto mb-3"></lucide-angular>
                    <p class="text-sm">{{ errorMessage() }}</p>
                    <button
                      (click)="retryLoadOpciones()"
                      class="mt-3 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm hover:bg-red-200"
                    >
                      Reintentar
                    </button>
                  </div>
                } @else {
                  <div class="text-center py-8 text-yellow-600 dark:text-yellow-400">
                    <lucide-angular name="inbox" [size]="40" class="mx-auto mb-3 opacity-60"></lucide-angular>
                    <p class="text-sm">No se encontraron campos numéricos en esta subcartera</p>
                  </div>
                }
              </div>
            } @else {
              <!-- Estado inicial: seleccionar subcartera -->
              <div class="text-center py-12 text-gray-400 dark:text-gray-500">
                <lucide-angular name="pointer" [size]="48" class="mx-auto mb-4 opacity-50"></lucide-angular>
                <p class="text-sm">Seleccione una subcartera para ver los montos disponibles</p>
              </div>
            }
          </div>

          <!-- Footer -->
          <div class="flex justify-between items-center gap-3 p-5 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <div class="text-xs text-gray-500 dark:text-gray-400">
              @if (opciones().length > 0) {
                <lucide-angular name="info" [size]="14" class="inline mr-1"></lucide-angular>
                Los montos habilitados aparecerán como opciones para el agente
              }
            </div>
            <div class="flex gap-3">
              <button
                type="button"
                (click)="handleCancel()"
                class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
              >
                Cancelar
              </button>
              <button
                type="button"
                (click)="handleSave()"
                [disabled]="!canSave()"
                class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium"
              >
                <lucide-angular name="save" [size]="18"></lucide-angular>
                Guardar
              </button>
            </div>
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
  errorMessage = signal<string>('');
  subPortfolios = signal<any[]>([]);
  loadingSubPortfolios = signal<boolean>(false);
  selectedSubPortfolioId = signal<number | undefined>(undefined);
  paymentScheduleFieldId = signal<number | null>(null);

  // Cabeceras para nombres visuales
  cabeceras = signal<ConfiguracionCabecera[]>([]);
  private cabecerasUrl = `${environment.apiUrl}/configuracion-cabeceras`;

  // Computed: opciones con nombres visuales traducidos
  opcionesConNombres = computed(() => {
    const opciones = this.opciones();
    const cabeceras = this.cabeceras();

    // Crear mapa de código -> nombre visual
    const codigoToNombre = new Map<string, string>();
    for (const c of cabeceras) {
      codigoToNombre.set(c.codigo.toLowerCase(), c.nombre);
    }

    // Devolver opciones con nombre visual
    return opciones.map(opcion => {
      let visualName = opcion.labelOpcion || opcion.codigoOpcion;

      if (opcion.codigoOpcion === 'personalizado') {
        visualName = 'Personalizado';
      } else if (opcion.campoTablaDinamica) {
        const nombre = codigoToNombre.get(opcion.campoTablaDinamica.toLowerCase());
        if (nombre) {
          visualName = nombre;
        }
      }

      return { ...opcion, visualName };
    });
  });

  private typificationService = inject(TypificationV2Service);
  private http = inject(HttpClient);

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        this.resetState();
        this.loadSubPortfolios();
        this.loadPaymentScheduleField();
      }
    });
  }

  private resetState() {
    this.opciones.set([]);
    this.cabeceras.set([]);
    this.errorMessage.set('');
    this.selectedSubPortfolioId.set(undefined);
    this.paymentScheduleFieldId.set(null);
  }

  private loadPaymentScheduleField() {
    const typificationId = this.typificationId();
    if (!typificationId) return;

    this.typificationService.getAdditionalFields(typificationId).subscribe({
      next: (fields) => {
        // Find PAYMENT_SCHEDULE field
        const paymentField = fields.find(f => f.tipoCampo === FieldTypeV2.PAYMENT_SCHEDULE);
        if (paymentField) {
          this.paymentScheduleFieldId.set(paymentField.id);
          console.log('Found PAYMENT_SCHEDULE field:', paymentField.id);
        } else {
          console.warn('No PAYMENT_SCHEDULE field found for typification', typificationId);
        }
      },
      error: (error) => {
        console.error('Error loading fields:', error);
      }
    });
  }

  loadSubPortfolios() {
    const portfolioId = this.portfolioId();
    if (!portfolioId) return;

    this.loadingSubPortfolios.set(true);

    this.typificationService.getSubPortfoliosByPortfolio(portfolioId)
      .subscribe({
        next: (subPortfolios) => {
          this.subPortfolios.set(subPortfolios);
          this.loadingSubPortfolios.set(false);

          // Auto-select if only one subportfolio
          if (subPortfolios.length === 1) {
            this.selectedSubPortfolioId.set(subPortfolios[0].id);
            this.loadCabeceras(subPortfolios[0].id);
            this.loadOpcionesAutomatically();
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
    this.cabeceras.set([]);
    this.errorMessage.set('');

    if (subPortfolioId) {
      this.loadCabeceras(subPortfolioId);
      this.loadOpcionesAutomatically();
    }
  }

  private loadCabeceras(subPortfolioId: number) {
    this.http.get<ConfiguracionCabecera[]>(`${this.cabecerasUrl}/subcartera/${subPortfolioId}/montos`)
      .subscribe({
        next: (cabeceras) => {
          this.cabeceras.set(cabeceras);
          console.log('[DIALOG] Loaded cabeceras:', cabeceras.length);
        },
        error: (error) => {
          console.warn('[DIALOG] Error loading cabeceras:', error);
        }
      });
  }

  private loadOpcionesAutomatically() {
    const tenantId = this.tenantId();
    const portfolioId = this.portfolioId();
    const subPortfolioId = this.selectedSubPortfolioId();
    const campoId = this.paymentScheduleFieldId();

    if (!tenantId || !portfolioId || !subPortfolioId) {
      return;
    }

    // Wait for field ID if not loaded yet
    if (!campoId) {
      setTimeout(() => this.loadOpcionesAutomatically(), 500);
      return;
    }

    this.loadingOpciones.set(true);
    this.errorMessage.set('');

    // First try to get existing options
    this.typificationService.getOpcionesCampo(campoId).subscribe({
      next: (opciones) => {
        if (opciones && opciones.length > 0) {
          this.opciones.set(opciones);
          this.loadingOpciones.set(false);
        } else {
          // Initialize options from subportfolio
          this.initializeOpciones(campoId, tenantId, portfolioId, subPortfolioId);
        }
      },
      error: () => {
        // Initialize options from subportfolio
        this.initializeOpciones(campoId, tenantId, portfolioId, subPortfolioId);
      }
    });
  }

  private initializeOpciones(campoId: number, tenantId: number, portfolioId: number, subPortfolioId: number) {
    this.typificationService.inicializarOpcionesCampo(campoId, tenantId, portfolioId, subPortfolioId)
      .subscribe({
        next: (opciones) => {
          this.opciones.set(opciones);
          this.loadingOpciones.set(false);
        },
        error: (error) => {
          console.error('Error initializing options:', error);
          this.errorMessage.set('Error al cargar las opciones. Verifique la configuración de la subcartera.');
          this.loadingOpciones.set(false);
        }
      });
  }

  retryLoadOpciones() {
    this.loadOpcionesAutomatically();
  }

  toggleOpcionOriginal(opcionConNombre: CampoOpcionDTO & { visualName: string }) {
    // Buscar la opción original en el signal y modificarla
    const opciones = this.opciones();
    const opcionOriginal = opciones.find(o => o.codigoOpcion === opcionConNombre.codigoOpcion);
    if (opcionOriginal) {
      opcionOriginal.estaHabilitada = !opcionOriginal.estaHabilitada;
      // Si se habilita y no tiene restricción, poner por defecto SIN_RESTRICCION
      if (opcionOriginal.estaHabilitada && !opcionOriginal.restriccionFecha) {
        opcionOriginal.restriccionFecha = RestriccionFecha.SIN_RESTRICCION;
      }
      // Forzar actualización del signal
      this.opciones.set([...opciones]);
    }
  }

  onRestriccionFechaChange(codigoOpcion: string, restriccion: string) {
    const opciones = this.opciones();
    const opcion = opciones.find(o => o.codigoOpcion === codigoOpcion);
    if (opcion) {
      opcion.restriccionFecha = restriccion as RestriccionFecha;
      // Forzar actualización del signal
      this.opciones.set([...opciones]);
    }
  }

  onGeneraCartaChange(codigoOpcion: string, event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const opciones = this.opciones();
    const opcion = opciones.find(o => o.codigoOpcion === codigoOpcion);
    if (opcion) {
      opcion.generaCartaAcuerdo = checkbox.checked;
      // Forzar actualización del signal
      this.opciones.set([...opciones]);
    }
  }

  getOpcionesHabilitadasCount(): number {
    return this.opciones().filter(o => o.estaHabilitada).length;
  }

  canSave(): boolean {
    return this.selectedSubPortfolioId() !== undefined &&
           this.paymentScheduleFieldId() !== null &&
           this.opciones().length > 0 &&
           !this.loadingOpciones();
  }

  handleCancel() {
    this.close.emit();
  }

  handleSave() {
    const campoId = this.paymentScheduleFieldId();
    const opcionesActuales = this.opciones();

    if (!campoId || opcionesActuales.length === 0) {
      return;
    }

    const request: ConfigurarOpcionesCampoRequest = {
      idCampo: campoId,
      opciones: opcionesActuales.map(o => ({
        codigoOpcion: o.codigoOpcion,
        estaHabilitada: o.estaHabilitada,
        ordenVisualizacion: o.ordenVisualizacion,
        restriccionFecha: o.restriccionFecha || RestriccionFecha.SIN_RESTRICCION,
        generaCartaAcuerdo: o.generaCartaAcuerdo || false
      }))
    };

    this.typificationService.configurarOpciones(request).subscribe({
      next: (opcionesActualizadas) => {
        console.log('Options saved successfully:', opcionesActualizadas.length);
        this.opciones.set(opcionesActualizadas);
        this.save.emit();
      },
      error: (error) => {
        console.error('Error saving options:', error);
        this.errorMessage.set('Error al guardar la configuración');
      }
    });
  }
}
