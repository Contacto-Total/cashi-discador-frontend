import { Component, input, Input, Output, EventEmitter, OnInit, signal, computed, effect, inject } from '@angular/core';
import { FormatService } from '@/shared/services/format.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { PaymentScheduleConfig, PaymentInstallment } from '../../../maintenance/models/typification-v2.model';

export interface AmountOption {
  label: string;
  value: number;
  field?: string;
  restriccionFecha?: 'SIN_RESTRICCION' | 'DENTRO_MES' | 'FUERA_MES' | string;
  generaCartaAcuerdo?: boolean;  // Indica si al seleccionar este monto se genera carta de acuerdo
  minCuotas?: number;  // Número mínimo de cuotas permitidas
  maxCuotas?: number;  // Número máximo de cuotas permitidas
  idOpcion?: number;  // Opción de la tarjeta (tipificacion_campo_opciones): su descuento máximo se lee en el backend
  porcentajeMaximoPromesa?: number;
  topeSobrepagoSoles?: number | null;  // Sobrepago máximo en soles; si la promesa lo pasa es monto libre (null = sin tope)
}

@Component({
  selector: 'app-payment-schedule',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="payment-schedule-container bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-2 py-3 transition-colors duration-300">
      <!-- Selector de Monto -->
      <div class="field-group mb-4">
        <label class="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-200 text-xs mb-2 transition-colors duration-300">
          <div class="w-5 h-5 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg flex items-center justify-center transition-colors duration-300">
            <lucide-angular name="wallet" [size]="12" class="text-emerald-600 dark:text-emerald-400"></lucide-angular>
          </div>
          Seleccionar Monto
        </label>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
          @for (option of regularAmountOptions(); track option.field) {
            @if (selectedField() === option.field && !isCustomAmount()) {
              <!-- Tarjeta elegida: el monto se ajusta aquí mismo con − / + o escribiéndolo -->
              <div
                role="group"
                [attr.aria-label]="'Monto de ' + option.label"
                class="flex flex-col items-center gap-1 p-2 border-2 rounded-lg min-w-0 bg-white dark:bg-slate-800 ring-4 transition-all duration-200 border-blue-500 dark:border-blue-400 ring-blue-100 dark:ring-blue-900/40"
              >
                <span class="text-[9px] font-bold uppercase tracking-wide leading-tight text-center truncate w-full text-slate-500 dark:text-slate-400">{{ option.label }}</span>
                @if (puedeAjustar(option)) {
                  <div class="flex items-center gap-1 w-full max-w-[180px] p-0.5 rounded-full border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900">
                    <button
                      type="button"
                      class="w-6 h-6 flex-shrink-0 rounded-full flex items-center justify-center bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm hover:bg-blue-50 dark:hover:bg-slate-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                      [attr.aria-label]="'Bajar 1 % sobre ' + option.label"
                      (click)="ajustarPaso(-1)"
                    >
                      <lucide-angular name="minus" [size]="13"></lucide-angular>
                    </button>
                    <span class="pl-0.5 text-[10px] text-slate-400 dark:text-slate-500">{{ simboloMoneda() }}</span>
                    <input
                      type="number"
                      class="flex-1 w-full min-w-0 p-0 border-0 bg-transparent text-center text-xs font-bold tabular-nums text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-0"
                      [(ngModel)]="montoTarjeta"
                      (ngModelChange)="onMontoTarjetaChange($event)"
                      (wheel)="$event.preventDefault()"
                      [attr.aria-label]="'Monto acordado sobre ' + option.label"
                      min="0"
                      step="0.01"
                    >
                    <button
                      type="button"
                      class="w-6 h-6 flex-shrink-0 rounded-full flex items-center justify-center bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm hover:bg-blue-50 dark:hover:bg-slate-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                      [attr.aria-label]="'Subir 1 % sobre ' + option.label"
                      (click)="ajustarPaso(1)"
                    >
                      <lucide-angular name="plus" [size]="13"></lucide-angular>
                    </button>
                  </div>
                  @if (montoAjustado()) {
                    <span class="text-[9px] tabular-nums text-slate-400 dark:text-slate-500">Base <span class="line-through">{{ formatCurrency(option.value) }}</span></span>
                  }
                } @else {
                  <span class="text-xs font-bold text-slate-800 dark:text-slate-100">{{ formatCurrency(option.value) }}</span>
                }
                <!-- Bajar o subir el monto no muestra etiquetas ni avisos: el backend decide al guardar -->
                @if (option.restriccionFecha && option.restriccionFecha !== 'SIN_RESTRICCION') {
                  <span class="text-[7px] px-1 py-0.5 rounded-full"
                    [class]="option.restriccionFecha === 'DENTRO_MES'
                      ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300'
                      : 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300'">
                    {{ option.restriccionFecha === 'DENTRO_MES' ? 'Este mes' : 'Mensual' }}
                  </span>
                }
              </div>
            } @else {
              <button
                type="button"
                class="flex flex-col items-center p-2 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md min-w-0 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-slate-600"
                (click)="selectAmount(option)"
              >
                <span class="text-[9px] opacity-70 leading-tight text-center truncate w-full">{{ option.label }}</span>
                <span class="text-xs font-bold mt-0.5">{{ formatCurrency(option.value) }}</span>
                @if (option.restriccionFecha && option.restriccionFecha !== 'SIN_RESTRICCION') {
                  <span class="text-[7px] mt-0.5 px-1 py-0.5 rounded-full"
                    [class]="option.restriccionFecha === 'DENTRO_MES'
                      ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300'
                      : 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300'">
                    {{ option.restriccionFecha === 'DENTRO_MES' ? 'Este mes' : 'Mensual' }}
                  </span>
                }
              </button>
            }
          }
          <!-- Opción personalizada -->
          @if (hasCustomOption()) {
            <button
              type="button"
              [class]="'flex flex-col items-center p-2 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md min-w-0 ' +
                (isCustomAmount()
                  ? 'sm:col-span-2 border-purple-500 bg-purple-500 dark:bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                  : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:border-purple-400 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-slate-600')"
              (click)="enableCustomAmount()"
            >
              <span class="text-[9px] opacity-70">Excepción</span>
              @if (isCustomAmount()) {
                <input
                  type="number"
                  class="w-full mt-0.5 px-2 py-1 border border-white/30 rounded text-center text-sm font-bold bg-white/90 dark:bg-slate-800 text-slate-800 dark:text-white min-w-[90px]"
                  [(ngModel)]="customAmountValue"
                  (ngModelChange)="onCustomAmountChange($event)"
                  (click)="$event.stopPropagation()"
                  (wheel)="$event.preventDefault()"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                >
                @if (superaLimite) {
                  <p class="text-xs text-red-600 font-bold mt-1">
                    La promesa de pago supera la DEUDA TOTAL en más del  {{ selectedPorcentajeMaximoPromesa() }}%. Máximo permitido: {{ simboloMoneda() }} {{ limitePermitidoValor.toFixed(2) }} <!--Actualizar code-->
                  </p>
                }

              } @else {
                <lucide-angular name="edit-3" [size]="14" class="mt-0.5"></lucide-angular>
              }
            </button>
          }
        </div>

      </div>

      <!-- Selector de Cuotas -->
      @if (selectedAmount() > 0) {
        <div class="field-group mb-4">
          <label class="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-200 text-xs mb-2 transition-colors duration-300">
            <div class="w-5 h-5 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center transition-colors duration-300">
              <lucide-angular name="calendar-days" [size]="12" class="text-blue-600 dark:text-blue-400"></lucide-angular>
            </div>
            Número de Cuotas
          </label>
          <div class="flex flex-wrap gap-1.5">
            @for (num of installmentOptionsComputed(); track num) {
              <button
                type="button"
                [class]="'px-3 py-1.5 border-2 rounded-lg cursor-pointer transition-all duration-200 text-xs font-medium hover:shadow-md ' +
                  (numberOfInstallments() === num
                    ? 'border-emerald-500 bg-emerald-500 dark:bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                    : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:border-emerald-400 dark:hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-slate-600')"
                (click)="setInstallments(num)"
              >
                {{ num }} {{ num === 1 ? 'cuota' : 'cuotas' }}
              </button>
            }
          </div>
        </div>
      }

      <!-- Detalle de Cuotas -->
      @if (installments().length > 0) {
        <div class="field-group">
          <label class="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-200 text-xs mb-2 transition-colors duration-300">
            <div class="w-5 h-5 bg-amber-100 dark:bg-amber-900/50 rounded-lg flex items-center justify-center transition-colors duration-300">
              <lucide-angular name="list-ordered" [size]="12" class="text-amber-600 dark:text-amber-400"></lucide-angular>
            </div>
            Detalle del Cronograma
          </label>
          <!-- Mensaje de restricción de fecha -->
          @if (dateRestrictionInfo().message) {
            <div class="mb-2 px-2 py-1.5 rounded-lg text-[10px] flex items-center gap-1.5"
              [class]="selectedRestriccion() === 'DENTRO_MES'
                ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                : 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'">
              <lucide-angular name="info" [size]="12"></lucide-angular>
              <span>{{ dateRestrictionInfo().message }}</span>
            </div>
          }
          <div class="bg-white dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600 overflow-hidden transition-colors duration-300">
            @for (installment of installments(); track installment.numeroCuota) {
              <div class="flex flex-wrap gap-2 p-2.5 border-b border-slate-100 dark:border-slate-600 last:border-b-0 items-center transition-colors duration-300">
                <div class="font-bold text-blue-600 dark:text-blue-400 text-xs flex items-center gap-1 min-w-[70px]">
                  <lucide-angular name="hash" [size]="12"></lucide-angular>
                  Cuota {{ installment.numeroCuota }}
                </div>
                <div class="flex items-center gap-1.5 flex-1 min-w-[120px]">
                  <label class="text-[10px] text-slate-500 dark:text-slate-400 whitespace-nowrap">Monto:</label>
                  <input
                    type="number"
                    [(ngModel)]="installment.monto"
                    (ngModelChange)="onInstallmentAmountChange(installment.numeroCuota)"
                    (wheel)="$event.preventDefault()"
                    [min]="1"
                    step="0.01"
                    class="flex-1 min-w-0 px-2 py-1.5 border border-slate-200 dark:border-slate-500 rounded-lg text-xs bg-slate-50 dark:bg-slate-600 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                </div>
                <div class="flex items-center gap-1.5 flex-1 min-w-[130px]">
                  <label class="text-[10px] text-slate-500 dark:text-slate-400 whitespace-nowrap">Fecha:</label>
                  <input
                    type="date"
                    [(ngModel)]="installment.fechaPago"
                    (ngModelChange)="onInstallmentChange()"
                    [min]="dateRestrictionInfo().minDate"
                    [max]="dateRestrictionInfo().maxDate"
                    class="flex-1 min-w-0 px-2 py-1.5 border border-slate-200 dark:border-slate-500 rounded-lg text-xs bg-slate-50 dark:bg-slate-600 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                </div>
              </div>
            }
          </div>

          <!-- Resumen -->
          <div class="mt-3 p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl border border-emerald-200 dark:border-emerald-800 transition-colors duration-300">
            <div class="flex justify-between items-center text-xs text-emerald-700 dark:text-emerald-300">
              <span class="flex items-center gap-1.5">
                <lucide-angular name="calculator" [size]="14"></lucide-angular>
                Monto Total:
              </span>
              <span class="text-sm font-bold">{{ formatCurrency(totalAmount()) }}</span>
            </div>
            @if (numberOfInstallments() > 1) {
              <div class="flex justify-between items-center text-xs text-emerald-600 dark:text-emerald-400 mt-1.5 pt-1.5 border-t border-emerald-200 dark:border-emerald-700">
                <span>Monto por cuota:</span>
                <span class="font-semibold">{{ formatCurrency(amountPerInstallment()) }}</span>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(-5px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .animate-fade-in {
      animation: fadeIn 0.3s ease-out forwards;
    }

    /* Date input styling for dark mode */
    input[type="date"]::-webkit-calendar-picker-indicator {
      filter: invert(0);
    }

    :host-context(html.dark) input[type="date"]::-webkit-calendar-picker-indicator {
      filter: invert(1);
    }

    /* Number input arrows */
    input[type="number"]::-webkit-inner-spin-button,
    input[type="number"]::-webkit-outer-spin-button {
      -webkit-appearance: none;
      appearance: none;
      margin: 0;
    }
      input[type="number"] {
      -moz-appearance: textfield;
      appearance: textfield;
    }
  `]
})
export class PaymentScheduleComponent implements OnInit {
  // Signal inputs for reactivity
  availableAmounts = input<AmountOption[]>([]);
  /** Símbolo de la moneda de los montos */
  simboloMoneda = input<string>('S/');
  /** Deuda a la que van los montos: si cambia, la selección se reinicia aunque los campos sean los mismos */
  deuda = input<string | null>(null);
  @Input() maxInstallments: number = 6;  // Default, será sobrescrito por la opción seleccionada
  @Input() minInstallments: number = 1;  // Default, será sobrescrito por la opción seleccionada
  @Output() scheduleChange = new EventEmitter<PaymentScheduleConfig | null>();
  @Output() customAmountSelected = new EventEmitter<boolean>();

  // Signals
  selectedAmount = signal<number>(0);
  selectedField = signal<string | undefined>(undefined);
  selectedRestriccion = signal<string>('SIN_RESTRICCION');
  selectedGeneraCartaAcuerdo = signal<boolean>(false);  // Si la opción seleccionada genera carta de acuerdo
  selectedMinCuotas = signal<number>(1);   // Min cuotas de la opción seleccionada
  selectedMaxCuotas = signal<number>(6);   // Max cuotas de la opción seleccionada
  selectedIdOpcion = signal<number | undefined>(undefined);  // Opción de la tarjeta elegida
  selectedPorcentajeMaximoPromesa = signal<number>(10);
  numberOfInstallments = signal<number>(1);
  installments = signal<PaymentInstallment[]>([]);
  customAmountValue: number = 0;
  //definicion de variables para la validacion de promesa de pago
  superaLimite: boolean = false;
  limitePermitidoValor: number = 0;
  private _isCustomAmount = signal<boolean>(false);
  montoBase = signal<number | undefined>(undefined);  // Monto original del campo seleccionado

  // Ajuste del monto dentro de la tarjeta elegida: lo que escribe el asesor (o mueve con − / +)
  montoTarjeta: number | null = null;
  // Sobrepago máximo en soles de la tarjeta elegida (null = sin tope)
  selectedTopeSobrepago = signal<number | null>(null);

  /** El monto de la tarjeta elegida ya no es el suyo tal cual: lo bajó o lo subió. */
  montoAjustado = computed(() => {
    const base = this.montoBase();
    if (this._isCustomAmount() || !base) return false;
    return Math.round(this.selectedAmount() * 100) !== Math.round(base * 100);
  });


  // Computed: opciones de cuotas basadas en min/max de la opción seleccionada
  installmentOptionsComputed = computed(() => {
    const min = this.selectedMinCuotas();
    const max = this.selectedMaxCuotas();
    return Array.from({ length: max - min + 1 }, (_, i) => min + i);
  });

  // Computed
  amountOptions = computed(() => this.availableAmounts());

  // Computed para restricción de fecha
  dateRestrictionInfo = computed(() => {
    const restriccion = this.selectedRestriccion();
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // Último día del mes actual
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    // Primer día del próximo mes
    const firstDayNextMonth = new Date(currentYear, currentMonth + 1, 1);

    // Helper para formatear sin timezone issues
    const formatDate = (date: Date): string => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    switch (restriccion) {
      case 'DENTRO_MES':
        return {
          minDate: formatDate(today),
          maxDate: formatDate(lastDayOfMonth),
          message: `Solo fechas dentro del mes actual (hasta ${this.fmt.date(lastDayOfMonth)})`
        };
      case 'FUERA_MES':
        // Permitir desde mañana, cuotas espaciadas cada 30 días
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return {
          minDate: formatDate(tomorrow),
          maxDate: undefined,
          message: 'Cuotas cada 30 días'
        };
      default:
        return {
          minDate: formatDate(today),
          maxDate: undefined,
          message: undefined
        };
    }
  });

  regularAmountOptions = computed(() =>
    this.availableAmounts().filter(opt => opt.field !== 'personalizado')
  );

  hasCustomOption = computed(() =>
    this.availableAmounts().some(opt => opt.field === 'personalizado')
  );

  totalAmount = computed(() =>
    this.installments().reduce((sum, i) => sum + (i.monto || 0), 0)
  );

  amountPerInstallment = computed(() => {
    const num = this.numberOfInstallments();
    const amount = this.selectedAmount();
    return num > 0 ? amount / num : 0;
  });

  installmentOptions: number[] = [];
  minDate: string = '';

  // Track previous amounts to detect significant changes
  private previousAmountsKey = '';

  private fmt = inject(FormatService);

  constructor() {
    // Effect que resetea la selección cuando los montos disponibles cambian significativamente
    // Esto es importante para CONTINUIDAD donde los montos cambian de [varios] a [Saldo Restante]
    effect(() => {
      const amounts = this.availableAmounts();
      // Crear una key basada en los fields disponibles para detectar cambios
      const currentKey = amounts.map(a => a.field).sort().join(',') + '|' + (this.deuda() ?? '');

      if (this.previousAmountsKey && this.previousAmountsKey !== currentKey) {
        console.log('[PaymentSchedule] Amounts changed, resetting selection. Old:', this.previousAmountsKey, 'New:', currentKey);
        // Resetear estado de selección
        this.selectedAmount.set(0);
        this.selectedField.set(undefined);
        this.selectedRestriccion.set('SIN_RESTRICCION');
        this.selectedGeneraCartaAcuerdo.set(false);
        this.numberOfInstallments.set(1);
        this.installments.set([]);
        this._isCustomAmount.set(false);
        this.customAmountValue = 0;
        this.montoBase.set(undefined);
        this.montoTarjeta = null;
        this.selectedTopeSobrepago.set(null);
        this.selectedIdOpcion.set(undefined);
        // El cronograma anterior deja de valer para quien lo recibió
        this.scheduleChange.emit(null);

        // Si solo hay una opción (como en CONTINUIDAD), auto-seleccionarla
        if (amounts.length === 1 && amounts[0].value > 0) {
          console.log('[PaymentSchedule] Auto-selecting single amount option:', amounts[0]);
          this.selectAmount(amounts[0]);
        }
      }

      this.previousAmountsKey = currentKey;
    });
  }

  ngOnInit(): void {
    this.installmentOptions = Array.from({ length: this.maxInstallments }, (_, i) => i + 1);
    const today = new Date();
    this.minDate = this.formatDateToYYYYMMDD(today);
  }

  isCustomAmount(): boolean {
    return this._isCustomAmount();
  }

  selectAmount(option: AmountOption): void {
    const amount = option.value;
    this._isCustomAmount.set(false);
    this.selectedAmount.set(amount);
    this.selectedField.set(option.field);
    this.selectedRestriccion.set(option.restriccionFecha || 'SIN_RESTRICCION');
    this.selectedGeneraCartaAcuerdo.set(option.generaCartaAcuerdo || false);  // Guardar si genera carta
    this.selectedMinCuotas.set(option.minCuotas ?? this.minInstallments);  // Min cuotas de la opción o default
    this.selectedMaxCuotas.set(option.maxCuotas ?? this.maxInstallments);  // Max cuotas de la opción o default
    this.selectedPorcentajeMaximoPromesa.set(option.porcentajeMaximoPromesa ?? 10);
    this.selectedIdOpcion.set(option.idOpcion);
    this.montoBase.set(amount);  // Guardar monto original del campo
    this.montoTarjeta = amount;  // La tarjeta arranca con su monto tal cual
    this.selectedTopeSobrepago.set(option.topeSobrepagoSoles ?? null);

    // Ajustar número de cuotas si está fuera del nuevo rango
    const currentNum = this.numberOfInstallments();
    const newMin = this.selectedMinCuotas();
    const newMax = this.selectedMaxCuotas();
    if (currentNum < newMin) {
      this.numberOfInstallments.set(newMin);
    } else if (currentNum > newMax) {
      this.numberOfInstallments.set(newMax);
    }

    this.generateInstallments();
    this.customAmountSelected.emit(false);
  }

  // Método para obtener la restricción de una opción por su field
  getRestriccionForField(field: string): string {
    const option = this.availableAmounts().find(o => o.field === field);
    return option?.restriccionFecha || 'SIN_RESTRICCION';
  }

  enableCustomAmount(): void {
    this._isCustomAmount.set(true);
    this.selectedField.set(undefined);
    this.montoBase.set(undefined);  // Excepción no tiene base
    this.selectedTopeSobrepago.set(null);

    // Buscar la opción "personalizado" para obtener sus configuraciones
    const customOption = this.availableAmounts().find(o => o.field === 'personalizado');
    this.selectedGeneraCartaAcuerdo.set(customOption?.generaCartaAcuerdo || false);
    this.selectedMinCuotas.set(customOption?.minCuotas ?? this.minInstallments);
    this.selectedMaxCuotas.set(customOption?.maxCuotas ?? this.maxInstallments);
    this.selectedIdOpcion.set(customOption?.idOpcion);
    this.selectedPorcentajeMaximoPromesa.set(customOption?.porcentajeMaximoPromesa ?? 10);

    // Ajustar número de cuotas si está fuera del nuevo rango
    const currentNum = this.numberOfInstallments();
    const newMin = this.selectedMinCuotas();
    const newMax = this.selectedMaxCuotas();
    if (currentNum < newMin) {
      this.numberOfInstallments.set(newMin);
    } else if (currentNum > newMax) {
      this.numberOfInstallments.set(newMax);
    }

    this.customAmountSelected.emit(true);
    if (this.customAmountValue > 0) {
      this.selectedAmount.set(this.customAmountValue);
      this.generateInstallments();
    }
  }

  onCustomAmountChange(value: number): void {
    this.customAmountValue = value;
    this.selectedAmount.set(value);
    //Validacion: la promesa no puede exceder la DEUDA TOTAL en más de 10%
    const coincideDeudaTotal = (s?: string) =>
        !!s && s.toString().trim().toLowerCase().replace(/\s+/g, '_').includes('deuda_total');
    const deudaTotalOption = this.availableAmounts().find(o => coincideDeudaTotal(o.field) || coincideDeudaTotal(o.label));    if (deudaTotalOption && deudaTotalOption.value > 0) {
      const factorLimite = 1 + (this.selectedPorcentajeMaximoPromesa() / 100);//validacion restriccion
      const limitePermitido = deudaTotalOption.value * factorLimite;
      this.superaLimite = value > limitePermitido;
      this.limitePermitidoValor = limitePermitido;
    } else {
      this.superaLimite = false;
    }
    // Si supera el límite permitido, no se genera cronograma ni se emite (no deja continuar)
    if (this.superaLimite) {
      this.installments.set([]);
      this.scheduleChange.emit(null);
      return;
    }

    this.generateInstallments();
  }

  /** La tarjeta elegida se puede ajustar: no en continuidad ni sin monto. */
  puedeAjustar(option: AmountOption): boolean {
    return option.value > 0 && option.field !== 'saldo_continuidad' && option.field !== 'default';
  }

  /** − / + en la tarjeta elegida: baja o sube 1 % de su monto base. */
  ajustarPaso(direccion: 1 | -1): void {
    const base = this.montoBase();
    if (!base) return;
    const actual = this.montoTarjeta ?? base;
    const nuevo = Math.round((actual + direccion * base / 100) * 100) / 100;
    if (nuevo <= 0) return;
    this.montoTarjeta = nuevo;
    this.aplicarMontoTarjeta(nuevo);
  }

  /** El asesor escribe el monto acordado dentro de la tarjeta. */
  onMontoTarjetaChange(valor: number | null): void {
    if (valor === null || valor === undefined || isNaN(valor) || valor <= 0) {
      this.selectedAmount.set(0);
      this.installments.set([]);
      this.scheduleChange.emit(null);
      return;
    }
    this.aplicarMontoTarjeta(Math.round(valor * 100) / 100);
  }

  /** Lleva el monto ajustado al cronograma. Subir o bajar no se bloquea: solo cambia cómo se guarda. */
  private aplicarMontoTarjeta(monto: number): void {
    this.selectedAmount.set(monto);
    this.generateInstallments();
  }

  setInstallments(num: number): void {
    this.numberOfInstallments.set(num);
    this.generateInstallments();
  }

  generateInstallments(): void {
    const amount = this.selectedAmount();
    const numInstallments = this.numberOfInstallments();

    if (amount <= 0 || numInstallments <= 0) {
      this.installments.set([]);
      this.emitChange();
      return;
    }

    const amountPerInstallment = Math.floor((amount / numInstallments) * 100) / 100;
    const remainder = Math.round((amount - (amountPerInstallment * numInstallments)) * 100) / 100;

    const newInstallments: PaymentInstallment[] = [];
    const restriccion = this.selectedRestriccion();

    // Determinar la fecha inicial según la restricción
    let startDate: Date;
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // Para todas las restricciones, empezar desde mañana
    startDate = new Date(today);
    startDate.setDate(startDate.getDate() + 1);

    // Para DENTRO_MES, calcular el último día permitido
    const lastDayOfMonth = restriccion === 'DENTRO_MES'
      ? new Date(currentYear, currentMonth + 1, 0)
      : null;

    for (let i = 0; i < numInstallments; i++) {
      let dueDate: Date;

      if (restriccion === 'DENTRO_MES' && lastDayOfMonth) {
        // Distribuir fechas dentro del mes actual
        const daysRemaining = Math.max(1, lastDayOfMonth.getDate() - startDate.getDate());
        const dayIncrement = Math.floor(daysRemaining / numInstallments);
        dueDate = new Date(startDate);
        dueDate.setDate(startDate.getDate() + (dayIncrement * i));
        // Asegurar que no pase del último día del mes
        if (dueDate > lastDayOfMonth) {
          dueDate = new Date(lastDayOfMonth);
        }
      } else if (restriccion === 'FUERA_MES') {
        // Cada cuota con 30 días de diferencia
        dueDate = new Date(startDate);
        dueDate.setDate(dueDate.getDate() + (30 * i));
      } else {
        // SIN_RESTRICCION: cuota 1 = hoy, siguientes cada 30 días
        dueDate = new Date(today);
        dueDate.setDate(dueDate.getDate() + (30 * i));
      }

      // Última cuota incluye el remainder, con redondeo para evitar decimales flotantes
      const installmentAmount = i === numInstallments - 1
        ? Math.round((amountPerInstallment + remainder) * 100) / 100
        : amountPerInstallment;

      newInstallments.push({
        numeroCuota: i + 1,
        monto: installmentAmount,
        fechaPago: this.formatDateToYYYYMMDD(dueDate)
      });
    }

    this.installments.set(newInstallments);
    this.emitChange();
  }

  onInstallmentChange(): void {
    this.emitChange();
  }

  // Monto mínimo por cuota
  private readonly MIN_CUOTA_AMOUNT = 1;

  /**
   * Recalcula las cuotas posteriores cuando se edita el monto de una cuota.
   * Las cuotas anteriores a la editada no se modifican.
   * El restante se distribuye equitativamente entre las cuotas posteriores.
   *
   * Validaciones:
   * - Ninguna cuota puede ser menor a S/ 1.00
   * - Ninguna cuota puede superar el monto total
   * - La suma de cuotas debe ser exactamente igual al monto total
   */
  onInstallmentAmountChange(editedCuotaNumber: number): void {
    const currentInstallments = this.installments();
    const totalAmount = this.selectedAmount();
    const numInstallments = currentInstallments.length;
    const editedIndex = editedCuotaNumber - 1; // Convertir a índice base 0
    const editedCuota = currentInstallments[editedIndex];

    // Validación 1: El monto no puede ser menor al mínimo
    if (editedCuota.monto < this.MIN_CUOTA_AMOUNT) {
      editedCuota.monto = this.MIN_CUOTA_AMOUNT;
    }

    // Validación 2: Calcular el máximo permitido para esta cuota
    // Máximo = Total - (suma de cuotas anteriores) - (mínimo * cuotas posteriores)
    let sumaPreviousCuotas = 0;
    for (let i = 0; i < editedIndex; i++) {
      sumaPreviousCuotas += currentInstallments[i].monto || 0;
    }
    const cuotasPosteriores = numInstallments - editedCuotaNumber;
    const minimoReservadoParaPosteriores = cuotasPosteriores * this.MIN_CUOTA_AMOUNT;
    const maxAllowedForThisCuota = totalAmount - sumaPreviousCuotas - minimoReservadoParaPosteriores;

    // Si el monto editado supera el máximo permitido, ajustarlo
    if (editedCuota.monto > maxAllowedForThisCuota) {
      editedCuota.monto = Math.max(this.MIN_CUOTA_AMOUNT, Math.floor(maxAllowedForThisCuota * 100) / 100);
    }

    // Si es la última cuota, solo validar y emitir
    if (editedCuotaNumber >= numInstallments) {
      this.installments.set([...currentInstallments]);
      this.emitChange();
      return;
    }

    // Calcular la suma de las cuotas desde la primera hasta la editada (inclusive)
    let sumUpToEdited = 0;
    for (let i = 0; i < editedCuotaNumber; i++) {
      sumUpToEdited += currentInstallments[i].monto || 0;
    }

    // Calcular el restante para las cuotas posteriores
    const remaining = totalAmount - sumUpToEdited;
    const remainingInstallments = numInstallments - editedCuotaNumber;

    // Distribuir el restante equitativamente entre las cuotas posteriores
    // Asegurando que cada una tenga al menos el mínimo
    if (remaining < remainingInstallments * this.MIN_CUOTA_AMOUNT) {
      // No hay suficiente para dar el mínimo a cada cuota posterior
      // Esto no debería pasar si la validación de arriba funciona, pero por seguridad
      const amountPerRemaining = Math.floor((remaining / remainingInstallments) * 100) / 100;
      for (let i = editedCuotaNumber; i < numInstallments; i++) {
        currentInstallments[i].monto = Math.max(this.MIN_CUOTA_AMOUNT, amountPerRemaining);
      }
    } else {
      // Distribuir normalmente
      const amountPerRemaining = Math.floor((remaining / remainingInstallments) * 100) / 100;
      const remainder = Math.round((remaining - (amountPerRemaining * remainingInstallments)) * 100) / 100;

      for (let i = editedCuotaNumber; i < numInstallments; i++) {
        // La última cuota recibe el remainder para cuadrar exacto
        currentInstallments[i].monto = i === numInstallments - 1
          ? amountPerRemaining + remainder
          : amountPerRemaining;
      }
    }

    // Actualizar el signal con los nuevos valores
    this.installments.set([...currentInstallments]);
    this.emitChange();
  }

  private emitChange(): void {
    const installments = this.installments();

    if (installments.length === 0) {
      this.scheduleChange.emit(null);
      return;
    }

    const config: PaymentScheduleConfig = {
      montoTotal: this.selectedAmount(),
      numeroCuotas: this.numberOfInstallments(),
      cuotas: installments,
      campoMontoOrigen: this.selectedField(),
      montoBase: this.montoBase(),  // Monto original del campo (undefined si es monto libre)
      generaCartaAcuerdo: this.selectedGeneraCartaAcuerdo(),  // Si el monto seleccionado genera carta
      idOpcion: this.selectedIdOpcion(),
      porcentajeMaximoPromesa: this.selectedPorcentajeMaximoPromesa(),
      topeSobrepagoSoles: this.selectedTopeSobrepago()
    };

    this.scheduleChange.emit(config);
  }


  formatCurrency(value: number): string {
    const numero = this.fmt.number(value, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return numero ? `${this.simboloMoneda()} ${numero}` : '';
  }

  /**
   * Formatea una fecha a YYYY-MM-DD sin conversión a UTC
   * Evita el bug de timezone donde toISOString() resta un día
   */
  private formatDateToYYYYMMDD(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
