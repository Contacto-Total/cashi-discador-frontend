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
    <!-- Backdrop con blur -->
    <div
      class="fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300"
      [class.opacity-0]="!isVisible()"
      [class.pointer-events-none]="!isVisible()"
      [class.opacity-100]="isVisible()"
    >
      <!-- Overlay con blur -->
      <div
        class="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        (click)="handleCancel()"
      ></div>

      <!-- Modal -->
      <div
        class="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col transform transition-all duration-300 border border-slate-200 dark:border-slate-700"
        [class.scale-95]="!isVisible()"
        [class.opacity-0]="!isVisible()"
        [class.scale-100]="isVisible()"
        [class.opacity-100]="isVisible()"
      >
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/20">
              <lucide-angular name="sliders" [size]="20" class="text-white"></lucide-angular>
            </div>
            <div>
              <h2 class="text-lg font-bold text-slate-900 dark:text-white">Configurar Montos</h2>
              <p class="text-sm text-slate-500 dark:text-slate-400">{{ typificationName() }}</p>
            </div>
          </div>
          <button
            type="button"
            (click)="handleCancel()"
            class="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
          >
            <lucide-angular name="x" [size]="20"></lucide-angular>
          </button>
        </div>

        <!-- Body -->
        <div class="flex-1 overflow-y-auto p-6 space-y-5">
          <!-- Selector de Subcartera -->
          @if (portfolioId()) {
            <div class="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl">
              <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                <lucide-angular name="database" [size]="16" class="text-violet-500"></lucide-angular>
                Subcartera
              </label>

              @if (loadingSubPortfolios()) {
                <div class="flex items-center gap-2 py-2 text-sm text-slate-500">
                  <lucide-angular name="loader" [size]="16" class="animate-spin"></lucide-angular>
                  Cargando subcarteras...
                </div>
              } @else if (subPortfolios().length > 0) {
                <select
                  [(ngModel)]="selectedSubPortfolioId"
                  (ngModelChange)="onSubPortfolioChange($event)"
                  class="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                >
                  <option [ngValue]="undefined">-- Seleccione una subcartera --</option>
                  @for (subPortfolio of subPortfolios(); track subPortfolio.id) {
                    <option [ngValue]="subPortfolio.id">{{ subPortfolio.nombre || subPortfolio.nombreSubcartera }}</option>
                  }
                </select>
              } @else {
                <p class="text-sm text-slate-500">No hay subcarteras disponibles</p>
              }
            </div>
          }

          <!-- Lista de Opciones con Toggles -->
          @if (selectedSubPortfolioId()) {
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <h3 class="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <lucide-angular name="list-checks" [size]="18" class="text-emerald-500"></lucide-angular>
                  Montos disponibles para el agente
                </h3>
                @if (opciones().length > 0) {
                  <span class="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold rounded-full">
                    {{ getOpcionesHabilitadasCount() }}/{{ opciones().length }} habilitados
                  </span>
                }
              </div>

              @if (loadingOpciones()) {
                <div class="flex flex-col items-center justify-center py-16 text-slate-500">
                  <div class="w-12 h-12 border-4 border-slate-200 dark:border-slate-700 border-t-violet-500 rounded-full animate-spin mb-4"></div>
                  <p class="text-sm">Cargando montos disponibles...</p>
                </div>
              } @else if (opcionesConNombres().length > 0) {
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-3 max-h-[450px] overflow-y-auto pr-1">
                  @for (opcion of opcionesConNombres(); track opcion.codigoOpcion) {
                    <div
                      class="p-4 rounded-xl border-2 transition-all duration-200"
                      [class.bg-emerald-50]="opcion.estaHabilitada"
                      [class.dark:bg-emerald-900/10]="opcion.estaHabilitada"
                      [class.border-emerald-400]="opcion.estaHabilitada"
                      [class.dark:border-emerald-600]="opcion.estaHabilitada"
                      [class.shadow-lg]="opcion.estaHabilitada"
                      [class.shadow-emerald-500/10]="opcion.estaHabilitada"
                      [class.bg-slate-50]="!opcion.estaHabilitada"
                      [class.dark:bg-slate-800/30]="!opcion.estaHabilitada"
                      [class.border-slate-200]="!opcion.estaHabilitada"
                      [class.dark:border-slate-700]="!opcion.estaHabilitada"
                    >
                      <!-- Row 1: Toggle + Label -->
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
                            <div class="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300/50 rounded-full peer dark:bg-slate-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all after:shadow-sm peer-checked:bg-emerald-500"></div>
                          </label>

                          <!-- Label -->
                          <div class="flex-1 min-w-0">
                            <span class="text-sm font-semibold text-slate-900 dark:text-white block truncate">
                              {{ opcion.visualName }}
                            </span>
                            @if (opcion.codigoOpcion !== 'personalizado' && opcion.campoTablaDinamica) {
                              <span class="text-xs text-slate-500 dark:text-slate-400">
                                {{ opcion.campoTablaDinamica }}
                              </span>
                            }
                          </div>

                          <!-- Badge -->
                          @if (opcion.codigoOpcion === 'personalizado') {
                            <span class="px-2 py-1 bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 text-xs font-semibold rounded-lg">
                              Manual
                            </span>
                          }
                        </div>
                      </div>

                      <!-- Configuración expandida (solo si está habilitada) -->
                      @if (opcion.estaHabilitada) {
                        <div class="mt-4 pt-4 border-t border-emerald-200 dark:border-emerald-800/50 space-y-4" (click)="$event.stopPropagation()">
                          <!-- Restricción de fecha -->
                          <div>
                            <label class="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
                              <lucide-angular name="calendar" [size]="12" class="text-blue-500"></lucide-angular>
                              Restricción de fecha
                            </label>
                            <select
                              [ngModel]="opcion.restriccionFecha || 'SIN_RESTRICCION'"
                              (ngModelChange)="onRestriccionFechaChange(opcion.codigoOpcion, $event)"
                              class="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="SIN_RESTRICCION">Sin restriccion</option>
                              <option value="DENTRO_MES">Solo dentro del mes actual</option>
                              <option value="FUERA_MES">Solo fuera del mes</option>
                            </select>
                          </div>

                          <!-- Genera Carta de Acuerdo -->
                          <div class="flex items-center justify-between">
                            <label class="text-xs font-medium text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                              <lucide-angular name="file-text" [size]="12" class="text-purple-500"></lucide-angular>
                              Genera Carta de Acuerdo
                            </label>
                            <label class="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                [checked]="opcion.generaCartaAcuerdo"
                                (change)="onGeneraCartaChange(opcion.codigoOpcion, $event)"
                                class="sr-only peer"
                              >
                              <div class="w-9 h-5 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300/50 rounded-full peer dark:bg-slate-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-500"></div>
                            </label>
                          </div>

                          <!-- Rango de Cuotas - Selector visual -->
                          <div>
                            <label class="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                              <lucide-angular name="layers" [size]="12" class="text-emerald-500"></lucide-angular>
                              Cuotas permitidas
                            </label>
                            <div class="flex flex-wrap gap-1.5">
                              @for (num of cuotasDisponibles; track num) {
                                <button
                                  type="button"
                                  (click)="toggleCuota(opcion.codigoOpcion, num)"
                                  class="w-8 h-8 rounded-lg text-xs font-semibold transition-all duration-150"
                                  [class.bg-emerald-500]="isCuotaInRange(opcion, num)"
                                  [class.text-white]="isCuotaInRange(opcion, num)"
                                  [class.shadow-md]="isCuotaInRange(opcion, num)"
                                  [class.shadow-emerald-500/30]="isCuotaInRange(opcion, num)"
                                  [class.bg-slate-100]="!isCuotaInRange(opcion, num)"
                                  [class.dark:bg-slate-700]="!isCuotaInRange(opcion, num)"
                                  [class.text-slate-600]="!isCuotaInRange(opcion, num)"
                                  [class.dark:text-slate-300]="!isCuotaInRange(opcion, num)"
                                  [class.hover:bg-slate-200]="!isCuotaInRange(opcion, num)"
                                  [class.dark:hover:bg-slate-600]="!isCuotaInRange(opcion, num)"
                                >
                                  {{ num }}
                                </button>
                              }
                            </div>
                            <p class="text-xs text-slate-500 mt-1.5">
                              @if ((opcion.minCuotas || 1) === (opcion.maxCuotas || 6)) {
                                Solo {{ opcion.minCuotas || 1 }} cuota{{ (opcion.minCuotas || 1) > 1 ? 's' : '' }}
                              } @else {
                                De {{ opcion.minCuotas || 1 }} a {{ opcion.maxCuotas || 6 }} cuotas
                              }
                            </p>
                          </div>

                          <!-- Porcentaje de Auto-aprobación - Solo para Personalizado -->
                          @if (opcion.codigoOpcion === 'personalizado') {
                            <div class="col-span-2 mt-2 p-3 bg-violet-50 dark:bg-violet-900/20 rounded-lg border border-violet-200 dark:border-violet-800">
                              <label class="text-xs font-medium text-violet-700 dark:text-violet-300 mb-2 flex items-center gap-1.5">
                                <lucide-angular name="percent" [size]="12"></lucide-angular>
                                Descuento máximo para auto-aprobación
                              </label>
                              <div class="flex items-center gap-3 mt-2">
                                <input
                                  type="range"
                                  [value]="opcion.porcentajeAutoAprobacion || 10"
                                  (input)="onPorcentajeChange(opcion.codigoOpcion, $event)"
                                  min="0"
                                  max="50"
                                  step="5"
                                  class="flex-1 h-2 bg-violet-200 dark:bg-violet-800 rounded-lg appearance-none cursor-pointer accent-violet-500"
                                >
                                <span class="text-sm font-bold text-violet-700 dark:text-violet-300 min-w-[50px] text-center">
                                  {{ opcion.porcentajeAutoAprobacion || 10 }}%
                                </span>
                              </div>
                              <p class="text-[10px] text-violet-600 dark:text-violet-400 mt-2">
                                Descuentos hasta {{ opcion.porcentajeAutoAprobacion || 10 }}% se aprueban automáticamente.
                                Descuentos mayores van a evaluación.
                              </p>
                            </div>
                          }
                        </div>
                      }
                    </div>
                  }
                </div>
              } @else if (errorMessage()) {
                <div class="text-center py-12 text-red-500 dark:text-red-400">
                  <div class="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <lucide-angular name="alert-circle" [size]="32"></lucide-angular>
                  </div>
                  <p class="text-sm mb-4">{{ errorMessage() }}</p>
                  <button
                    (click)="retryLoadOpciones()"
                    class="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm hover:bg-red-200 dark:hover:bg-red-900/50 transition-all"
                  >
                    Reintentar
                  </button>
                </div>
              } @else {
                <div class="text-center py-12 text-slate-400">
                  <div class="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <lucide-angular name="inbox" [size]="32"></lucide-angular>
                  </div>
                  <p class="text-sm">No se encontraron campos numericos en esta subcartera</p>
                </div>
              }
            </div>
          } @else {
            <!-- Estado inicial: seleccionar subcartera -->
            <div class="text-center py-16 text-slate-400">
              <div class="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <lucide-angular name="mouse-pointer-click" [size]="40" class="opacity-50"></lucide-angular>
              </div>
              <p class="text-sm">Seleccione una subcartera para ver los montos disponibles</p>
            </div>
          }
        </div>

        <!-- Footer -->
        <div class="flex justify-between items-center gap-4 p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <div class="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            @if (opciones().length > 0) {
              <lucide-angular name="info" [size]="14"></lucide-angular>
              Los montos habilitados apareceran como opciones para el agente
            }
          </div>
          <div class="flex gap-3">
            <button
              type="button"
              (click)="handleCancel()"
              class="px-5 py-2.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-sm font-medium transition-all"
            >
              Cancelar
            </button>
            <button
              type="button"
              (click)="handleSave()"
              [disabled]="!canSave()"
              class="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:from-emerald-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-semibold transition-all shadow-lg shadow-emerald-500/20 disabled:shadow-none"
            >
              <lucide-angular name="save" [size]="16"></lucide-angular>
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: contents;
    }
  `]
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
  isVisible = signal<boolean>(false);

  // Cuotas disponibles (1-12)
  cuotasDisponibles = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  // Cabeceras para nombres visuales
  cabeceras = signal<ConfiguracionCabecera[]>([]);
  private cabecerasUrl = `${environment.apiUrl}/configuracion-cabeceras`;

  // Computed: opciones con nombres visuales traducidos
  opcionesConNombres = computed(() => {
    const opciones = this.opciones();
    const cabeceras = this.cabeceras();

    // Crear mapa de codigo -> nombre visual
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
        // Animacion de entrada
        setTimeout(() => this.isVisible.set(true), 10);
      } else {
        this.isVisible.set(false);
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
          this.errorMessage.set('Error al cargar las opciones. Verifique la configuracion de la subcartera.');
          this.loadingOpciones.set(false);
        }
      });
  }

  retryLoadOpciones() {
    this.loadOpcionesAutomatically();
  }

  toggleOpcionOriginal(opcionConNombre: CampoOpcionDTO & { visualName: string }) {
    // Buscar la opcion original en el signal y modificarla
    const opciones = this.opciones();
    const opcionOriginal = opciones.find(o => o.codigoOpcion === opcionConNombre.codigoOpcion);
    if (opcionOriginal) {
      opcionOriginal.estaHabilitada = !opcionOriginal.estaHabilitada;
      // Si se habilita y no tiene restriccion, poner por defecto SIN_RESTRICCION
      if (opcionOriginal.estaHabilitada && !opcionOriginal.restriccionFecha) {
        opcionOriginal.restriccionFecha = RestriccionFecha.SIN_RESTRICCION;
      }
      // Forzar actualizacion del signal
      this.opciones.set([...opciones]);
    }
  }

  onRestriccionFechaChange(codigoOpcion: string, restriccion: string) {
    const opciones = this.opciones();
    const opcion = opciones.find(o => o.codigoOpcion === codigoOpcion);
    if (opcion) {
      opcion.restriccionFecha = restriccion as RestriccionFecha;
      // Forzar actualizacion del signal
      this.opciones.set([...opciones]);
    }
  }

  onGeneraCartaChange(codigoOpcion: string, event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const opciones = this.opciones();
    const opcion = opciones.find(o => o.codigoOpcion === codigoOpcion);
    if (opcion) {
      opcion.generaCartaAcuerdo = checkbox.checked;
      // Forzar actualizacion del signal
      this.opciones.set([...opciones]);
    }
  }

  // Verificar si una cuota esta en el rango seleccionado
  isCuotaInRange(opcion: CampoOpcionDTO, num: number): boolean {
    const min = opcion.minCuotas || 1;
    const max = opcion.maxCuotas || 6;
    return num >= min && num <= max;
  }

  // Toggle de cuota: expande o contrae el rango
  toggleCuota(codigoOpcion: string, num: number) {
    const opciones = this.opciones();
    const opcion = opciones.find(o => o.codigoOpcion === codigoOpcion);
    if (!opcion) return;

    const currentMin = opcion.minCuotas || 1;
    const currentMax = opcion.maxCuotas || 6;

    // Si el numero esta en el rango
    if (num >= currentMin && num <= currentMax) {
      // Si es el unico, no hacer nada
      if (currentMin === currentMax) return;

      // Si es el minimo, aumentar el minimo
      if (num === currentMin) {
        opcion.minCuotas = num + 1;
      }
      // Si es el maximo, reducir el maximo
      else if (num === currentMax) {
        opcion.maxCuotas = num - 1;
      }
      // Si esta en medio, verificar cual extremo esta mas cerca
      else {
        const distToMin = num - currentMin;
        const distToMax = currentMax - num;
        if (distToMin <= distToMax) {
          opcion.minCuotas = num + 1;
        } else {
          opcion.maxCuotas = num - 1;
        }
      }
    } else {
      // Fuera del rango: expandir para incluirlo
      if (num < currentMin) {
        opcion.minCuotas = num;
      } else {
        opcion.maxCuotas = num;
      }
    }

    this.opciones.set([...opciones]);
  }

  // Handler para cambio de porcentaje de auto-aprobación
  onPorcentajeChange(codigoOpcion: string, event: Event) {
    const target = event.target as HTMLInputElement;
    const porcentaje = parseInt(target.value, 10);

    const opciones = this.opciones();
    const opcion = opciones.find(o => o.codigoOpcion === codigoOpcion);
    if (!opcion) return;

    opcion.porcentajeAutoAprobacion = porcentaje;
    this.opciones.set([...opciones]);
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
    this.isVisible.set(false);
    setTimeout(() => this.close.emit(), 200);
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
        generaCartaAcuerdo: o.generaCartaAcuerdo || false,
        minCuotas: o.minCuotas || 1,
        maxCuotas: o.maxCuotas || 6,
        porcentajeAutoAprobacion: o.porcentajeAutoAprobacion || 10
      }))
    };

    this.typificationService.configurarOpciones(request).subscribe({
      next: (opcionesActualizadas) => {
        console.log('Options saved successfully:', opcionesActualizadas.length);
        this.opciones.set(opcionesActualizadas);
        this.isVisible.set(false);
        setTimeout(() => this.save.emit(), 200);
      },
      error: (error) => {
        console.error('Error saving options:', error);
        this.errorMessage.set('Error al guardar la configuracion');
      }
    });
  }
}
