import { Component, input, Input, Output, EventEmitter, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { PaymentScheduleConfig, PaymentInstallment } from '../../../maintenance/models/typification-v2.model';

export interface AmountOption {
  label: string;
  value: number;
  field?: string;
  restriccionFecha?: 'SIN_RESTRICCION' | 'DENTRO_MES' | 'FUERA_MES' | string;
}

@Component({
  selector: 'app-payment-schedule',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="payment-schedule-container bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-4 transition-colors duration-300">
      <!-- Selector de Monto -->
      <div class="field-group mb-5">
        <label class="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-200 text-sm mb-3 transition-colors duration-300">
          <div class="w-6 h-6 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg flex items-center justify-center transition-colors duration-300">
            <lucide-angular name="wallet" [size]="14" class="text-emerald-600 dark:text-emerald-400"></lucide-angular>
          </div>
          Seleccionar Monto
        </label>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2">
          @for (option of regularAmountOptions(); track option.field) {
            <button
              type="button"
              [class]="'flex flex-col items-center p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ' +
                (selectedField() === option.field && !isCustomAmount()
                  ? 'border-blue-500 bg-blue-500 dark:bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-slate-600')"
              (click)="selectAmount(option.value, option.field, option.restriccionFecha)"
            >
              <span class="text-[10px] opacity-70 leading-tight text-center">{{ option.label }}</span>
              <span class="text-sm font-bold mt-1">{{ formatCurrency(option.value) }}</span>
              @if (option.restriccionFecha && option.restriccionFecha !== 'SIN_RESTRICCION') {
                <span class="text-[8px] mt-1 px-1.5 py-0.5 rounded-full"
                  [class]="option.restriccionFecha === 'DENTRO_MES'
                    ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300'
                    : 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300'">
                  {{ option.restriccionFecha === 'DENTRO_MES' ? 'Este mes' : 'Próx. mes+' }}
                </span>
              }
            </button>
          }
          <!-- Opción personalizada -->
          @if (hasCustomOption()) {
            <button
              type="button"
              [class]="'flex flex-col items-center p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ' +
                (isCustomAmount()
                  ? 'col-span-2 border-purple-500 bg-purple-500 dark:bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                  : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:border-purple-400 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-slate-600')"
              (click)="enableCustomAmount()"
            >
              <span class="text-[10px] opacity-70">Otro monto</span>
              @if (isCustomAmount()) {
                <input
                  type="number"
                  class="w-full mt-1 px-3 py-1.5 border border-white/30 rounded text-center text-base font-bold bg-white/90 dark:bg-slate-800 text-slate-800 dark:text-white min-w-[120px]"
                  [(ngModel)]="customAmountValue"
                  (ngModelChange)="onCustomAmountChange($event)"
                  (click)="$event.stopPropagation()"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                >
              } @else {
                <lucide-angular name="edit-3" [size]="16" class="mt-1"></lucide-angular>
              }
            </button>
          }
        </div>

        <!-- Selector de campo base para "Otro monto" -->
        @if (isCustomAmount()) {
          <div class="mt-3 flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <lucide-angular name="link" [size]="16" class="text-purple-500 flex-shrink-0"></lucide-angular>
            <span class="text-xs text-purple-700 dark:text-purple-300">Campo base:</span>
            <select
              class="flex-1 px-2 py-1.5 text-sm border border-purple-300 dark:border-purple-600 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              [ngModel]="selectedBaseField()"
              (ngModelChange)="onBaseFieldChange($event)"
            >
              <option value="">Ninguno (monto libre)</option>
              @for (option of regularAmountOptions(); track option.field) {
                <option [value]="option.field">{{ option.label }} ({{ formatCurrency(option.value) }})</option>
              }
            </select>
            @if (selectedBaseField()) {
              <div class="relative">
                <!-- Badge clickeable -->
                <button
                  type="button"
                  class="text-xs font-medium px-2.5 py-1 rounded-full cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-md"
                  [class]="getDiscountInfo().isDiscount
                    ? 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800/50'
                    : 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800/50'"
                  (click)="togglePercentageEditor($event)"
                >
                  {{ getDiscountInfo().isDiscount ? '-' : '+' }}{{ getDiscountInfo().percentage }}%
                </button>

                <!-- Popover para editar porcentaje -->
                @if (showPercentageEditor()) {
                  <!-- Overlay para cerrar al hacer click fuera -->
                  <div class="fixed inset-0 z-40" (click)="showPercentageEditor.set(false)"></div>
                  <div class="absolute right-0 top-full mt-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div class="bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-600 p-3 min-w-[180px]">
                      <!-- Flecha -->
                      <div class="absolute -top-2 right-4 w-4 h-4 bg-white dark:bg-slate-800 border-l border-t border-slate-200 dark:border-slate-600 transform rotate-45"></div>

                      <div class="relative">
                        <label class="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wide font-medium">Ajuste %</label>
                        <div class="flex items-center gap-2 mt-1.5">
                          <button
                            type="button"
                            class="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                            [class]="isDiscountMode()
                              ? 'bg-red-500 text-white'
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-500 hover:bg-red-100 dark:hover:bg-red-900/30'"
                            (click)="setDiscountMode(true)"
                          >
                            <lucide-angular name="minus" [size]="14"></lucide-angular>
                          </button>
                          <input
                            type="number"
                            class="flex-1 w-16 px-2 py-1.5 text-center text-sm font-bold border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            [ngModel]="editablePercentage()"
                            (ngModelChange)="onPercentageChange($event)"
                            (click)="$event.stopPropagation()"
                            min="0"
                            max="100"
                            step="1"
                          >
                          <button
                            type="button"
                            class="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                            [class]="!isDiscountMode()
                              ? 'bg-green-500 text-white'
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-500 hover:bg-green-100 dark:hover:bg-green-900/30'"
                            (click)="setDiscountMode(false)"
                          >
                            <lucide-angular name="plus" [size]="14"></lucide-angular>
                          </button>
                        </div>
                        <p class="text-[10px] text-slate-400 dark:text-slate-500 mt-2 text-center">
                          Base: {{ formatCurrency(montoBase() || 0) }}
                        </p>
                      </div>
                    </div>
                  </div>
                }
              </div>
            }
          </div>
        }
      </div>

      <!-- Selector de Cuotas -->
      @if (selectedAmount() > 0) {
        <div class="field-group mb-5">
          <label class="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-200 text-sm mb-3 transition-colors duration-300">
            <div class="w-6 h-6 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center transition-colors duration-300">
              <lucide-angular name="calendar-days" [size]="14" class="text-blue-600 dark:text-blue-400"></lucide-angular>
            </div>
            Número de Cuotas
          </label>
          <div class="flex flex-wrap gap-2">
            @for (num of installmentOptions; track num) {
              <button
                type="button"
                [class]="'px-4 py-2 border-2 rounded-lg cursor-pointer transition-all duration-200 text-sm font-medium hover:shadow-md ' +
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
          <label class="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-200 text-sm mb-3 transition-colors duration-300">
            <div class="w-6 h-6 bg-amber-100 dark:bg-amber-900/50 rounded-lg flex items-center justify-center transition-colors duration-300">
              <lucide-angular name="list-ordered" [size]="14" class="text-amber-600 dark:text-amber-400"></lucide-angular>
            </div>
            Detalle del Cronograma
          </label>
          <!-- Mensaje de restricción de fecha -->
          @if (dateRestrictionInfo().message) {
            <div class="mb-3 px-3 py-2 rounded-lg text-xs flex items-center gap-2"
              [class]="selectedRestriccion() === 'DENTRO_MES'
                ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                : 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'">
              <lucide-angular name="info" [size]="14"></lucide-angular>
              <span>{{ dateRestrictionInfo().message }}</span>
            </div>
          }
          <div class="bg-white dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600 overflow-hidden transition-colors duration-300">
            @for (installment of installments(); track installment.numeroCuota) {
              <div class="grid grid-cols-1 sm:grid-cols-[100px_1fr_1fr] gap-3 p-3 border-b border-slate-100 dark:border-slate-600 last:border-b-0 items-center transition-colors duration-300">
                <div class="font-bold text-blue-600 dark:text-blue-400 text-sm flex items-center gap-2">
                  <lucide-angular name="hash" [size]="14"></lucide-angular>
                  Cuota {{ installment.numeroCuota }}
                </div>
                <div class="flex items-center gap-2">
                  <label class="text-xs text-slate-500 dark:text-slate-400 min-w-[50px]">Monto:</label>
                  <input
                    type="number"
                    [(ngModel)]="installment.monto"
                    (ngModelChange)="onInstallmentAmountChange(installment.numeroCuota)"
                    [min]="1"
                    step="0.01"
                    class="flex-1 px-3 py-2 border border-slate-200 dark:border-slate-500 rounded-lg text-sm bg-slate-50 dark:bg-slate-600 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                </div>
                <div class="flex items-center gap-2">
                  <label class="text-xs text-slate-500 dark:text-slate-400 min-w-[50px]">Fecha:</label>
                  <input
                    type="date"
                    [(ngModel)]="installment.fechaPago"
                    (ngModelChange)="onInstallmentChange()"
                    [min]="dateRestrictionInfo().minDate"
                    [max]="dateRestrictionInfo().maxDate"
                    class="flex-1 px-3 py-2 border border-slate-200 dark:border-slate-500 rounded-lg text-sm bg-slate-50 dark:bg-slate-600 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                </div>
              </div>
            }
          </div>

          <!-- Resumen -->
          <div class="mt-4 p-4 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl border border-emerald-200 dark:border-emerald-800 transition-colors duration-300">
            <div class="flex justify-between items-center text-sm text-emerald-700 dark:text-emerald-300">
              <span class="flex items-center gap-2">
                <lucide-angular name="calculator" [size]="16"></lucide-angular>
                Monto Total:
              </span>
              <span class="text-lg font-bold">{{ formatCurrency(totalAmount()) }}</span>
            </div>
            @if (numberOfInstallments() > 1) {
              <div class="flex justify-between items-center text-sm text-emerald-600 dark:text-emerald-400 mt-2 pt-2 border-t border-emerald-200 dark:border-emerald-700">
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
      opacity: 1;
    }
  `]
})
export class PaymentScheduleComponent implements OnInit {
  // Signal inputs for reactivity
  availableAmounts = input<AmountOption[]>([]);
  @Input() maxInstallments: number = 6;
  @Output() scheduleChange = new EventEmitter<PaymentScheduleConfig | null>();
  @Output() customAmountSelected = new EventEmitter<boolean>();

  // Signals
  selectedAmount = signal<number>(0);
  selectedField = signal<string | undefined>(undefined);
  selectedRestriccion = signal<string>('SIN_RESTRICCION');
  numberOfInstallments = signal<number>(1);
  installments = signal<PaymentInstallment[]>([]);
  customAmountValue: number = 0;
  private _isCustomAmount = signal<boolean>(false);
  montoBase = signal<number | undefined>(undefined);  // Monto original del campo seleccionado
  selectedBaseField = signal<string>('');  // Campo base seleccionado para "Otro monto"

  // Signals para editor de porcentaje
  showPercentageEditor = signal<boolean>(false);
  editablePercentage = signal<number>(0);
  isDiscountMode = signal<boolean>(true);  // true = descuento (-), false = aumento (+)

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
          message: `Solo fechas dentro del mes actual (hasta ${lastDayOfMonth.toLocaleDateString('es-PE')})`
        };
      case 'FUERA_MES':
        return {
          minDate: formatDate(firstDayNextMonth),
          maxDate: undefined,
          message: `Solo fechas a partir del ${firstDayNextMonth.toLocaleDateString('es-PE')}`
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

  ngOnInit(): void {
    this.installmentOptions = Array.from({ length: this.maxInstallments }, (_, i) => i + 1);
    const today = new Date();
    this.minDate = this.formatDateToYYYYMMDD(today);
  }

  isCustomAmount(): boolean {
    return this._isCustomAmount();
  }

  selectAmount(amount: number, field?: string, restriccion?: string): void {
    this._isCustomAmount.set(false);
    this.selectedAmount.set(amount);
    this.selectedField.set(field);
    this.selectedRestriccion.set(restriccion || 'SIN_RESTRICCION');
    this.montoBase.set(amount);  // Guardar monto original del campo
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
    this.montoBase.set(undefined);  // Monto libre no tiene base
    this.selectedBaseField.set('');  // Resetear campo base
    this.customAmountSelected.emit(true);
    if (this.customAmountValue > 0) {
      this.selectedAmount.set(this.customAmountValue);
      this.generateInstallments();
    }
  }

  onCustomAmountChange(value: number): void {
    this.customAmountValue = value;
    this.selectedAmount.set(value);
    // Re-calcular montoBase si hay campo base seleccionado
    if (this.selectedBaseField()) {
      const option = this.availableAmounts().find(o => o.field === this.selectedBaseField());
      if (option) {
        this.montoBase.set(option.value);
        this.selectedField.set(option.field);
      }
    }
    this.generateInstallments();
  }

  /**
   * Cuando el usuario selecciona un campo base para "Otro monto"
   */
  onBaseFieldChange(fieldValue: string): void {
    this.selectedBaseField.set(fieldValue);

    if (fieldValue) {
      // Buscar la opción seleccionada
      const option = this.availableAmounts().find(o => o.field === fieldValue);
      if (option) {
        this.montoBase.set(option.value);
        this.selectedField.set(option.field);
      }
    } else {
      // "Ninguno" - monto libre
      this.montoBase.set(undefined);
      this.selectedField.set(undefined);
    }
    this.emitChange();
  }

  /**
   * Calcula info del descuento para mostrar en el UI
   */
  getDiscountInfo(): { hasDiscount: boolean; isDiscount: boolean; percentage: number } {
    const base = this.montoBase();
    const actual = this.customAmountValue;

    if (!base || !actual || base === actual) {
      return { hasDiscount: false, isDiscount: false, percentage: 0 };
    }

    const diff = base - actual;
    const percentage = Math.abs(Math.round((diff / base) * 100));

    return {
      hasDiscount: true,
      isDiscount: diff > 0,  // true = descuento, false = exceso
      percentage
    };
  }

  /**
   * Abre/cierra el editor de porcentaje
   */
  togglePercentageEditor(event: Event): void {
    event.stopPropagation();
    const isOpen = !this.showPercentageEditor();
    this.showPercentageEditor.set(isOpen);

    if (isOpen) {
      // Sincronizar valores al abrir
      const info = this.getDiscountInfo();
      this.editablePercentage.set(info.percentage);
      this.isDiscountMode.set(info.isDiscount);
    }
  }

  /**
   * Cambia entre modo descuento (-) y aumento (+)
   */
  setDiscountMode(isDiscount: boolean): void {
    this.isDiscountMode.set(isDiscount);
    // Recalcular monto con el nuevo modo
    this.applyPercentageToAmount(this.editablePercentage());
  }

  /**
   * Cuando el usuario cambia el porcentaje manualmente
   */
  onPercentageChange(percentage: number): void {
    this.editablePercentage.set(percentage);
    this.applyPercentageToAmount(percentage);
  }

  /**
   * Aplica el porcentaje al monto base y actualiza customAmountValue
   */
  private applyPercentageToAmount(percentage: number): void {
    const base = this.montoBase();
    if (!base) return;

    let newAmount: number;
    if (this.isDiscountMode()) {
      // Descuento: restar porcentaje del base
      newAmount = base * (1 - percentage / 100);
    } else {
      // Aumento: sumar porcentaje al base
      newAmount = base * (1 + percentage / 100);
    }

    // Redondear a 2 decimales
    this.customAmountValue = Math.round(newAmount * 100) / 100;
    this.selectedAmount.set(this.customAmountValue);
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

    if (restriccion === 'FUERA_MES') {
      // Empezar desde el primer día del próximo mes
      startDate = new Date(currentYear, currentMonth + 1, 1);
    } else {
      // Para SIN_RESTRICCION o DENTRO_MES, empezar desde mañana
      startDate = new Date(today);
      startDate.setDate(startDate.getDate() + 1);
    }

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
        // Cada cuota con 30 días de diferencia, empezando desde el próximo mes
        dueDate = new Date(startDate);
        dueDate.setDate(dueDate.getDate() + (30 * i));
      } else {
        // SIN_RESTRICCION: comportamiento original
        dueDate = new Date(today);
        dueDate.setDate(dueDate.getDate() + (30 * (i + 1)));
      }

      const installmentAmount = i === numInstallments - 1
        ? amountPerInstallment + remainder
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
      montoBase: this.montoBase()  // Monto original del campo (undefined si es monto libre)
    };

    this.scheduleChange.emit(config);
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(value);
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
