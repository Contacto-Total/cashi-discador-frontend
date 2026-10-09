import { Component, effect, inject, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { HttpClient } from '@angular/common/http';
import { A11yModule } from '@angular/cdk/a11y';
import { CampoOpcionDTO, ConfigurarOpcionesCampoRequest, FieldTypeV2, RestriccionFecha } from '../../models/typification-v2.model';
import { TypificationV2Service } from '../../services/typification-v2.service';
import { ToastService } from '../../../shared/services/toast.service';
import { environment } from '../../../../environments/environment';
import { TUI, TUI_ANIM, tuiSwitch, tuiPerilla } from '../typification-ui';

interface ConfiguracionCabecera {
  codigo: string;
  nombre: string;
  tipoDato: string;
  tipoSql: string;
}

@Component({
  selector: 'app-typification-additional-fields-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, A11yModule],
  template: `
    <div [class]="ui.fondo" (click)="handleCancel()">
      <div [class]="ui.panel + ' max-w-[940px]'" role="dialog" aria-modal="true" aria-labelledby="mf-titulo"
           cdkTrapFocus [cdkTrapFocusAutoCapture]="true"
           (click)="$event.stopPropagation()" (keydown.escape)="handleCancel()">

        <!-- Cabecera -->
        <div [class]="ui.cabecera">
          <div class="min-w-0">
            <h2 id="mf-titulo" [class]="ui.titulo">Configurar montos</h2>
            <p [class]="ui.subtitulo">
              <b class="font-bold text-[#334155] dark:text-slate-200">{{ typificationName() }}</b>
              · qué montos puede ofrecer el asesor y con qué reglas
            </p>
          </div>
          <button type="button" (click)="handleCancel()" [class]="ui.iconBtn" aria-label="Cerrar">
            <lucide-angular name="x" [size]="17"></lucide-angular>
          </button>
        </div>

        <!-- Cuerpo -->
        <div [class]="ui.cuerpo">
          @if (sinCronograma()) {
            <!-- Antes este caso decía "No se encontraron campos numéricos" y el diálogo
                 quedaba reintentando cada medio segundo, incluso después de cerrarse -->
            <div class="flex flex-col items-center gap-2 px-4 py-10 text-center">
              <lucide-angular name="inbox" [size]="36" class="text-[#c5ccd6]"></lucide-angular>
              <p class="text-[13px] font-bold text-[#334155] dark:text-slate-200">Esta tipificación no registra promesas de pago</p>
              <p class="max-w-[440px] text-[12.5px] leading-[1.5] text-[#5f6c80] dark:text-slate-400">
                Los montos se configuran en las tipificaciones que tienen un campo de cronograma de pagos.
                Se agrega desde «Editar en el catálogo», en «Campos de la tipificación».
              </p>
            </div>
          } @else {
            <!-- Subcartera: llega elegida la misma de la pantalla -->
            <div class="flex flex-wrap items-end justify-between gap-2.5">
              <div class="flex flex-col gap-1.5">
                <label for="mf-sub" [class]="ui.label">Subcartera</label>
                @if (loadingSubPortfolios()) {
                  <span class="flex h-[38px] items-center gap-2 text-[12.5px] text-[#5f6c80] dark:text-slate-400">
                    <lucide-angular name="loader-2" [size]="15" class="animate-spin"></lucide-angular>
                    Cargando subcarteras…
                  </span>
                } @else if (subPortfolios().length > 0) {
                  <select id="mf-sub" [ngModel]="selectedSubPortfolioId()" (ngModelChange)="onSubPortfolioChange($event)"
                          [class]="ui.input + ' min-w-[240px]'">
                    <option [ngValue]="undefined">Seleccionar subcartera</option>
                    @for (subPortfolio of subPortfolios(); track subPortfolio.id) {
                      <option [ngValue]="subPortfolio.id">{{ subPortfolio.nombre || subPortfolio.nombreSubcartera || subPortfolio.subPortfolioName }}</option>
                    }
                  </select>
                } @else {
                  <span class="flex h-[38px] items-center text-[12.5px] text-[#5f6c80] dark:text-slate-400">No hay subcarteras disponibles</span>
                }
              </div>
              @if (opciones().length > 0) {
                <span class="pb-[9px] text-[12px] text-[#5f6c80] dark:text-slate-400">
                  <b class="font-bold tabular-nums text-[#0f172a] dark:text-slate-100">{{ getOpcionesHabilitadasCount() }}</b> de
                  <b class="font-bold tabular-nums text-[#0f172a] dark:text-slate-100">{{ opciones().length }}</b> montos habilitados
                </span>
              }
            </div>

            @if (!selectedSubPortfolioId()) {
              <div class="flex flex-col items-center gap-2 px-4 py-10 text-center text-[13px] text-[#5f6c80] dark:text-slate-400">
                <lucide-angular name="inbox" [size]="36" class="text-[#c5ccd6]"></lucide-angular>
                <span>Elige una subcartera para ver sus montos</span>
              </div>
            } @else if (loadingOpciones() || cargandoCampos()) {
              <div class="grid animate-pulse grid-cols-1 gap-2.5 motion-reduce:animate-none md:grid-cols-2" role="status">
                <span class="sr-only">Cargando montos…</span>
                @for (n of esqueleto; track n) {
                  <div class="h-[52px] rounded-xl border border-[#e6e9ee] bg-[#f8fafc] dark:border-slate-800 dark:bg-slate-800/60"></div>
                }
              </div>
            } @else if (errorMessage()) {
              <div class="flex flex-col items-center gap-2.5 px-4 py-10 text-center" role="alert">
                <lucide-angular name="alert-circle" [size]="32" class="text-[#b91c1c]"></lucide-angular>
                <p class="text-[13px] text-[#b91c1c] dark:text-red-300">{{ errorMessage() }}</p>
                <button type="button" (click)="retryLoadOpciones()" [class]="ui.secundario">Reintentar</button>
              </div>
            } @else if (opcionesConNombres().length === 0) {
              <div class="flex flex-col items-center gap-2 px-4 py-10 text-center text-[13px] text-[#5f6c80] dark:text-slate-400">
                <lucide-angular name="inbox" [size]="36" class="text-[#c5ccd6]"></lucide-angular>
                <span>No se encontraron campos numéricos en esta subcartera</span>
              </div>
            } @else {
              <div class="grid grid-cols-1 items-start gap-2.5 md:grid-cols-2">
                @for (opcion of opcionesConNombres(); track opcion.codigoOpcion) {
                  <div [class]="'flex flex-col rounded-xl border bg-white transition-colors duration-150 dark:bg-slate-900 '
                                + (opcion.estaHabilitada ? 'border-[#c5ccd6] dark:border-slate-600' : 'border-[#e6e9ee] dark:border-slate-800')">

                    <!-- Interruptor y nombre -->
                    <div class="flex min-h-[52px] items-center gap-2.5 px-3 py-2">
                      <button type="button" role="switch" (click)="toggleOpcionOriginal(opcion)"
                              [attr.aria-checked]="opcion.estaHabilitada"
                              [attr.aria-label]="(opcion.estaHabilitada ? 'Deshabilitar ' : 'Habilitar ') + opcion.visualName"
                              [class]="sw(opcion.estaHabilitada)">
                        <span [class]="perilla(opcion.estaHabilitada)"></span>
                      </button>
                      <div class="flex min-w-0 flex-1 flex-col">
                        <span [class]="'truncate text-[12.5px] font-bold leading-[1.35] tracking-[-0.01em] '
                                       + (opcion.estaHabilitada ? 'text-[#0f172a] dark:text-slate-100' : 'text-[#5f6c80] dark:text-slate-400')">{{ opcion.visualName }}</span>
                        @if (opcion.codigoOpcion !== 'personalizado' && opcion.campoTablaDinamica) {
                          <span class="truncate font-mono text-[11px] leading-[1.35] text-[#5f6c80] dark:text-slate-400">{{ opcion.campoTablaDinamica }}</span>
                        }
                      </div>
                      @if (opcion.codigoOpcion === 'personalizado') {
                        <span [class]="ui.chipVioleta">Lo escribe el asesor</span>
                      }
                    </div>

                    <!-- Reglas: solo si el monto está habilitado -->
                    @if (opcion.estaHabilitada) {
                      <div class="tui-entra flex flex-col gap-3.5 border-t border-[#eef1f5] p-3 dark:border-slate-800">
                        <div class="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                          <div class="flex flex-col gap-1.5">
                            <span [class]="ui.label">Fecha de pago</span>
                            <select [ngModel]="opcion.restriccionFecha || 'SIN_RESTRICCION'"
                                    (ngModelChange)="onRestriccionFechaChange(opcion.codigoOpcion, $event)"
                                    [attr.aria-label]="'Restricción de fecha de ' + opcion.visualName"
                                    [class]="ui.inputSm + ' w-full'">
                              <option value="SIN_RESTRICCION">Sin restricción</option>
                              <option value="DENTRO_MES">Solo dentro del mes actual</option>
                              <option value="FUERA_MES">Solo fuera del mes</option>
                            </select>
                          </div>
                          <div class="flex flex-col gap-1.5">
                            <span [class]="ui.label">Cuotas permitidas</span>
                            <!-- Lo que se guarda es un mínimo y un máximo: antes eran 48 botones -->
                            <div class="flex items-center gap-1.5 text-[12.5px] text-[#334155] dark:text-slate-300">
                              <span>De</span>
                              <input type="number" min="1" max="48" [value]="opcion.minCuotas || 1"
                                     (change)="onMinCuotasChange(opcion.codigoOpcion, $event)"
                                     [attr.aria-label]="'Mínimo de cuotas de ' + opcion.visualName"
                                     [class]="ui.inputSm + ' w-[58px] tabular-nums'"/>
                              <span>a</span>
                              <input type="number" min="1" max="48" [value]="opcion.maxCuotas || 6"
                                     (change)="onMaxCuotasChange(opcion.codigoOpcion, $event)"
                                     [attr.aria-label]="'Máximo de cuotas de ' + opcion.visualName"
                                     [class]="ui.inputSm + ' w-[58px] tabular-nums'"/>
                            </div>
                          </div>
                        </div>

                        <div class="flex items-center justify-between gap-2.5">
                          <span class="text-[12.5px] font-semibold text-[#334155] dark:text-slate-300">Genera carta de acuerdo</span>
                          <button type="button" role="switch" (click)="alternarCarta(opcion.codigoOpcion)"
                                  [attr.aria-checked]="!!opcion.generaCartaAcuerdo"
                                  [attr.aria-label]="'Genera carta de acuerdo: ' + opcion.visualName"
                                  [class]="sw(!!opcion.generaCartaAcuerdo)">
                            <span [class]="perilla(!!opcion.generaCartaAcuerdo)"></span>
                          </button>
                        </div>

                        <div class="flex flex-col gap-1">
                          <div class="flex items-baseline justify-between gap-2.5">
                            <span class="text-[12.5px] font-semibold text-[#334155] dark:text-slate-300">Descuento máximo que se aprueba solo</span>
                            <b class="text-[13px] font-extrabold tabular-nums">{{ opcion.porcentajeAutoAprobacion ?? 10 }}%</b>
                          </div>
                          <input type="range" min="0" max="100" step="5" [value]="opcion.porcentajeAutoAprobacion ?? 10"
                                 (input)="onPorcentajeChange(opcion.codigoOpcion, $event)"
                                 [attr.aria-label]="'Descuento máximo para auto-aprobación de ' + opcion.visualName"
                                 class="w-full cursor-pointer accent-[#2563eb]"/>
                          <span [class]="ui.ayuda">
                            Hasta {{ opcion.porcentajeAutoAprobacion ?? 10 }}% se aprueba automáticamente. Un descuento mayor pasa a evaluación.
                          </span>
                        </div>

                        @if (opcion.codigoOpcion === 'personalizado') {
                          <div class="flex flex-col gap-1">
                            <div class="flex items-baseline justify-between gap-2.5">
                              <span class="text-[12.5px] font-semibold text-[#334155] dark:text-slate-300">Aumento máximo sobre la deuda que se aprueba solo</span>
                              <b class="text-[13px] font-extrabold tabular-nums">{{ opcion.porcentajeAutoAprobacionAumento ?? 5 }}%</b>
                            </div>
                            <input type="range" min="0" max="100" step="5" [value]="opcion.porcentajeAutoAprobacionAumento ?? 5"
                                   (input)="onPorcentajeAumentoChange(opcion.codigoOpcion, $event)"
                                   aria-label="Aumento máximo sobre la deuda para auto-aprobación"
                                   class="w-full cursor-pointer accent-[#2563eb]"/>
                            <span [class]="ui.ayuda">
                              Hasta {{ opcion.porcentajeAutoAprobacionAumento ?? 5 }}% por encima de la deuda se aprueba automáticamente. Más, pasa a evaluación.
                            </span>
                          </div>

                          <div class="flex flex-col gap-1">
                            <div class="flex items-baseline justify-between gap-2.5">
                              <span class="inline-flex items-center gap-[7px] text-[12.5px] font-semibold text-[#334155] dark:text-slate-300">
                                Tope de la promesa sobre la deuda
                                <span [class]="ui.chipAmbar">Bloquea</span>
                              </span>
                              <b class="text-[13px] font-extrabold tabular-nums">{{ opcion.porcentajeMaximoPromesa ?? 10 }}%</b>
                            </div>
                            <input type="range" min="0" max="100" step="5" [value]="opcion.porcentajeMaximoPromesa ?? 10"
                                   (input)="onPorcentajeMaximoChange(opcion.codigoOpcion, $event)"
                                   aria-label="Límite máximo de la promesa sobre la deuda"
                                   class="w-full cursor-pointer accent-[#2563eb]"/>
                            <span [class]="ui.ayuda">
                              Si la promesa supera la deuda en más de {{ opcion.porcentajeMaximoPromesa ?? 10 }}%, no se puede registrar.
                            </span>
                          </div>
                        }
                      </div>
                    }
                  </div>
                }
              </div>
            }
          }
        </div>

        <!-- Pie -->
        <div class="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-[#e6e9ee] px-[18px] py-3 dark:border-slate-700">
          <span class="text-[11.5px] text-[#5f6c80] dark:text-slate-400">
            @if (opciones().length > 0) {
              Los montos habilitados aparecen como opciones para el asesor al registrar la promesa
            }
          </span>
          <div class="flex gap-2">
            <button type="button" (click)="handleCancel()" [disabled]="guardando()" [class]="ui.secundario">
              {{ sinCronograma() ? 'Cerrar' : 'Cancelar' }}
            </button>
            @if (!sinCronograma()) {
              <button type="button" (click)="handleSave()" [disabled]="!canSave()" [class]="ui.primario">
                @if (guardando()) {
                  <lucide-angular name="loader-2" [size]="15" class="animate-spin"></lucide-angular>
                  Guardando
                } @else {
                  Guardar
                }
              </button>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [TUI_ANIM]
})
export class TypificationAdditionalFieldsDialogComponent {
  isOpen = input.required<boolean>();
  typificationName = input<string>('');
  typificationId = input.required<number>();
  tenantId = input.required<number>();
  portfolioId = input<number | undefined>(undefined);
  /** Subcartera abierta en la pantalla: el diálogo arranca con esa misma elegida. */
  subPortfolioId = input<number | undefined>(undefined);

  close = output<void>();
  save = output<void>();

  readonly ui = TUI;
  readonly sw = tuiSwitch;
  readonly perilla = tuiPerilla;
  readonly esqueleto = [0, 1, 2, 3];

  opciones = signal<CampoOpcionDTO[]>([]);
  loadingOpciones = signal<boolean>(false);
  errorMessage = signal<string>('');
  subPortfolios = signal<any[]>([]);
  loadingSubPortfolios = signal<boolean>(false);
  selectedSubPortfolioId = signal<number | undefined>(undefined);
  paymentScheduleFieldId = signal<number | null>(null);
  /** Aún no se sabe si la tipificación tiene campo de cronograma de pagos. */
  cargandoCampos = signal<boolean>(false);
  /** Ya se sabe que no lo tiene: no hay montos que configurar. */
  sinCronograma = signal<boolean>(false);
  guardando = signal<boolean>(false);

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
  private toast = inject(ToastService);

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
    this.sinCronograma.set(false);
    this.guardando.set(false);
  }

  private loadPaymentScheduleField() {
    const typificationId = this.typificationId();
    if (!typificationId) return;

    this.cargandoCampos.set(true);

    this.typificationService.getAdditionalFields(typificationId).subscribe({
      next: (fields) => {
        this.cargandoCampos.set(false);
        // Find PAYMENT_SCHEDULE field
        const paymentField = fields.find(f => f.tipoCampo === FieldTypeV2.PAYMENT_SCHEDULE);
        if (paymentField) {
          this.paymentScheduleFieldId.set(paymentField.id);
          // Si la subcartera ya estaba elegida, los montos se cargan ahora
          this.loadOpcionesAutomatically();
        } else {
          this.sinCronograma.set(true);
        }
      },
      error: (error) => {
        console.error('Error loading fields:', error);
        this.cargandoCampos.set(false);
        this.errorMessage.set('No se pudieron cargar los campos de la tipificación.');
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

          // Se parte de la subcartera abierta en la pantalla. Antes el diálogo la
          // descartaba y obligaba a elegirla otra vez (salvo que hubiera una sola).
          const deLaPantalla = this.subPortfolioId();
          const inicial = subPortfolios.some(s => s.id === deLaPantalla)
            ? deLaPantalla
            : (subPortfolios.length === 1 ? subPortfolios[0].id : undefined);

          if (inicial !== undefined) {
            this.selectedSubPortfolioId.set(inicial);
            this.loadCabeceras(inicial);
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

  onSubPortfolioChange(subPortfolioId: number | undefined) {
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
        },
        error: (error) => {
          console.warn('[DIALOG] Error loading cabeceras:', error);
        }
      });
  }

  /**
   * Carga los montos cuando ya se conocen las dos cosas que necesita: el campo de
   * cronograma y la subcartera. Se llama al resolverse cada una, así que ya no hace
   * falta el reintento con temporizador que había antes (y que nunca se detenía si
   * la tipificación no tenía ese campo).
   */
  private loadOpcionesAutomatically() {
    const tenantId = this.tenantId();
    const portfolioId = this.portfolioId();
    const subPortfolioId = this.selectedSubPortfolioId();
    const campoId = this.paymentScheduleFieldId();

    if (!tenantId || !portfolioId || !subPortfolioId || !campoId) {
      return;
    }

    this.loadingOpciones.set(true);
    this.errorMessage.set('');

    // First try to get existing options for this subPortfolio
    this.typificationService.getOpcionesCampo(campoId, subPortfolioId).subscribe({
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
          this.errorMessage.set('Error al cargar las opciones. Verifica la configuración de la subcartera.');
          this.loadingOpciones.set(false);
        }
      });
  }

  retryLoadOpciones() {
    if (this.paymentScheduleFieldId()) {
      this.loadOpcionesAutomatically();
    } else {
      // Lo que falló fue la carga de los campos de la tipificación
      this.errorMessage.set('');
      this.loadPaymentScheduleField();
    }
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

  alternarCarta(codigoOpcion: string) {
    const opciones = this.opciones();
    const opcion = opciones.find(o => o.codigoOpcion === codigoOpcion);
    if (opcion) {
      opcion.generaCartaAcuerdo = !opcion.generaCartaAcuerdo;
      this.opciones.set([...opciones]);
    }
  }

  /** Lee un número de cuotas del campo, lo acota a 1–48 y deja el campo mostrando el valor acotado. */
  private leerCuotas(event: Event): number {
    const campo = event.target as HTMLInputElement;
    const leido = parseInt(campo.value, 10);
    const valor = Math.max(1, Math.min(48, isNaN(leido) ? 1 : leido));
    campo.value = String(valor);
    return valor;
  }

  // El mínimo nunca queda por encima del máximo, ni al revés: el otro extremo lo acompaña
  onMinCuotasChange(codigoOpcion: string, event: Event) {
    const min = this.leerCuotas(event);
    const opciones = this.opciones();
    const opcion = opciones.find(o => o.codigoOpcion === codigoOpcion);
    if (!opcion) return;

    opcion.minCuotas = min;
    if ((opcion.maxCuotas || 6) < min) opcion.maxCuotas = min;
    this.opciones.set([...opciones]);
  }

  onMaxCuotasChange(codigoOpcion: string, event: Event) {
    const max = this.leerCuotas(event);
    const opciones = this.opciones();
    const opcion = opciones.find(o => o.codigoOpcion === codigoOpcion);
    if (!opcion) return;

    opcion.maxCuotas = max;
    if ((opcion.minCuotas || 1) > max) opcion.minCuotas = max;
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

  onPorcentajeAumentoChange(codigoOpcion: string, event: Event) {
    const porcentaje = parseInt((event.target as HTMLInputElement).value, 10);
    const opciones = this.opciones();
    const opcion = opciones.find(o => o.codigoOpcion === codigoOpcion);
    if (!opcion) return;
    opcion.porcentajeAutoAprobacionAumento = porcentaje;
    this.opciones.set([...opciones]);
  }

  onPorcentajeMaximoChange(codigoOpcion: string, event: Event) {
    const porcentaje = parseInt((event.target as HTMLInputElement).value, 10);
    const opciones = this.opciones();
    const opcion = opciones.find(o => o.codigoOpcion === codigoOpcion);
    if (!opcion) return;
    opcion.porcentajeMaximoPromesa = porcentaje;
    this.opciones.set([...opciones]);
  }

  getOpcionesHabilitadasCount(): number {
    return this.opciones().filter(o => o.estaHabilitada).length;
  }

  canSave(): boolean {
    return this.selectedSubPortfolioId() !== undefined &&
           this.paymentScheduleFieldId() !== null &&
           this.opciones().length > 0 &&
           !this.loadingOpciones() &&
           !this.guardando();
  }

  handleCancel() {
    if (this.guardando()) return;
    this.close.emit();
  }

  handleSave() {
    const campoId = this.paymentScheduleFieldId();
    const opcionesActuales = this.opciones();

    if (!campoId || opcionesActuales.length === 0 || this.guardando()) {
      return;
    }

    const request: ConfigurarOpcionesCampoRequest = {
      idCampo: campoId,
      idSubcartera: this.selectedSubPortfolioId(),
      opciones: opcionesActuales.map(o => ({
        codigoOpcion: o.codigoOpcion,
        estaHabilitada: o.estaHabilitada,
        ordenVisualizacion: o.ordenVisualizacion,
        restriccionFecha: o.restriccionFecha || RestriccionFecha.SIN_RESTRICCION,
        generaCartaAcuerdo: o.generaCartaAcuerdo || false,
        minCuotas: o.minCuotas || 1,
        maxCuotas: o.maxCuotas || 6,
        porcentajeAutoAprobacion: o.porcentajeAutoAprobacion ?? 10,
        porcentajeAutoAprobacionAumento: o.porcentajeAutoAprobacionAumento ?? 5,
        porcentajeMaximoPromesa: o.porcentajeMaximoPromesa ?? 10
      }))
    };

    this.guardando.set(true);

    this.typificationService.configurarOpciones(request).subscribe({
      next: (opcionesActualizadas) => {
        this.guardando.set(false);
        this.opciones.set(opcionesActualizadas);
        this.save.emit();
      },
      error: (error) => {
        // Antes el mensaje se guardaba en un sitio que no se pinta mientras hay montos
        // en pantalla: el guardado fallaba sin avisar.
        console.error('Error saving options:', error);
        this.guardando.set(false);
        this.toast.error('Error al guardar la configuración de montos');
      }
    });
  }
}
