import { Component, input, Input, Output, EventEmitter, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentScheduleConfig, PaymentInstallment } from '../../../maintenance/models/typification-v2.model';

export interface AmountOption {
  label: string;
  value: number;
  field?: string;
}

@Component({
  selector: 'app-payment-schedule',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="payment-schedule-container">
      <!-- Selector de Monto -->
      <div class="field-group">
        <label class="field-label">
          <span class="label-icon">💰</span>
          Seleccionar Monto
        </label>
        <div class="amount-chips">
          @for (option of regularAmountOptions(); track option.field) {
            <button
              type="button"
              class="amount-chip"
              [class.selected]="selectedField() === option.field && !isCustomAmount()"
              (click)="selectAmount(option.value, option.field)"
            >
              <span class="chip-label">{{ option.label }}</span>
              <span class="chip-value">{{ formatCurrency(option.value) }}</span>
            </button>
          }
          <!-- Opción personalizada - solo si está habilitada -->
          @if (hasCustomOption()) {
            <button
              type="button"
              class="amount-chip custom"
              [class.selected]="isCustomAmount()"
              (click)="enableCustomAmount()"
            >
              <span class="chip-label">Otro monto</span>
              @if (isCustomAmount()) {
                <input
                  type="number"
                  class="custom-input"
                  [(ngModel)]="customAmountValue"
                  (ngModelChange)="onCustomAmountChange($event)"
                  (click)="$event.stopPropagation()"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                >
              }
            </button>
          }
        </div>
      </div>

      <!-- Selector de Cuotas -->
      @if (selectedAmount() > 0) {
        <div class="field-group">
          <label class="field-label">
            <span class="label-icon">📅</span>
            Número de Cuotas
          </label>
          <div class="installments-selector">
            @for (num of installmentOptions; track num) {
              <button
                type="button"
                class="installment-btn"
                [class.selected]="numberOfInstallments() === num"
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
          <label class="field-label">
            <span class="label-icon">📋</span>
            Detalle del Cronograma
          </label>
          <div class="installments-detail">
            @for (installment of installments(); track installment.numeroCuota) {
              <div class="installment-row">
                <div class="installment-number">
                  Cuota {{ installment.numeroCuota }}
                </div>
                <div class="installment-amount">
                  <label>Monto:</label>
                  <input
                    type="number"
                    [(ngModel)]="installment.monto"
                    (ngModelChange)="onInstallmentChange()"
                    min="0"
                    step="0.01"
                    class="amount-input"
                  >
                </div>
                <div class="installment-date">
                  <label>Fecha:</label>
                  <input
                    type="date"
                    [(ngModel)]="installment.fechaPago"
                    (ngModelChange)="onInstallmentChange()"
                    [min]="minDate"
                    class="date-input"
                  >
                </div>
              </div>
            }
          </div>

          <!-- Resumen -->
          <div class="schedule-summary">
            <div class="summary-row">
              <span>Monto Total:</span>
              <span class="total-amount">{{ formatCurrency(totalAmount()) }}</span>
            </div>
            @if (numberOfInstallments() > 1) {
              <div class="summary-row">
                <span>Monto por cuota:</span>
                <span>{{ formatCurrency(amountPerInstallment()) }}</span>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .payment-schedule-container {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      padding: 1rem;
      background: #f8fafc;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
    }

    .field-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .field-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 600;
      color: #334155;
      font-size: 0.875rem;
    }

    .label-icon {
      font-size: 1rem;
    }

    .amount-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .amount-chip {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0.75rem 1rem;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      background: white;
      cursor: pointer;
      transition: all 0.2s;
      min-width: 120px;
    }

    .amount-chip:hover {
      border-color: #3b82f6;
      background: #eff6ff;
    }

    .amount-chip.selected {
      border-color: #3b82f6;
      background: #3b82f6;
      color: white;
    }

    .amount-chip.custom {
      min-width: 140px;
    }

    .chip-label {
      font-size: 0.75rem;
      opacity: 0.8;
    }

    .chip-value {
      font-size: 1rem;
      font-weight: 600;
    }

    .custom-input {
      width: 100%;
      padding: 0.25rem;
      border: 1px solid white;
      border-radius: 4px;
      text-align: center;
      font-size: 0.875rem;
      margin-top: 0.25rem;
      background: rgba(255,255,255,0.9);
      color: #1e293b;
    }

    .installments-selector {
      display: flex;
      gap: 0.5rem;
    }

    .installment-btn {
      padding: 0.5rem 1rem;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      background: white;
      cursor: pointer;
      transition: all 0.2s;
      font-size: 0.875rem;
    }

    .installment-btn:hover {
      border-color: #10b981;
      background: #ecfdf5;
    }

    .installment-btn.selected {
      border-color: #10b981;
      background: #10b981;
      color: white;
    }

    .installments-detail {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      background: white;
      padding: 1rem;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
    }

    .installment-row {
      display: grid;
      grid-template-columns: 80px 1fr 1fr;
      gap: 1rem;
      align-items: center;
      padding: 0.5rem;
      border-bottom: 1px solid #f1f5f9;
    }

    .installment-row:last-child {
      border-bottom: none;
    }

    .installment-number {
      font-weight: 600;
      color: #3b82f6;
      font-size: 0.875rem;
    }

    .installment-amount,
    .installment-date {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .installment-amount label,
    .installment-date label {
      font-size: 0.75rem;
      color: #64748b;
      min-width: 45px;
    }

    .amount-input,
    .date-input {
      flex: 1;
      padding: 0.5rem;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      font-size: 0.875rem;
    }

    .amount-input:focus,
    .date-input:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .schedule-summary {
      margin-top: 1rem;
      padding: 1rem;
      background: #f0fdf4;
      border-radius: 8px;
      border: 1px solid #bbf7d0;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.875rem;
      color: #166534;
    }

    .total-amount {
      font-size: 1.125rem;
      font-weight: 700;
    }

    @media (max-width: 640px) {
      .installment-row {
        grid-template-columns: 1fr;
        gap: 0.5rem;
      }

      .amount-chips {
        flex-direction: column;
      }

      .amount-chip {
        width: 100%;
      }
    }
  `]
})
export class PaymentScheduleComponent implements OnInit {
  // Signal inputs for reactivity
  availableAmounts = input<AmountOption[]>([]);
  @Input() maxInstallments: number = 6;
  @Output() scheduleChange = new EventEmitter<PaymentScheduleConfig | null>();
  @Output() customAmountSelected = new EventEmitter<boolean>(); // Emite cuando se selecciona monto personalizado

  // Signals
  selectedAmount = signal<number>(0);
  selectedField = signal<string | undefined>(undefined);
  numberOfInstallments = signal<number>(1);
  installments = signal<PaymentInstallment[]>([]);
  customAmountValue: number = 0;
  private _isCustomAmount = signal<boolean>(false);

  // Computed - now reactive because availableAmounts is a signal
  amountOptions = computed(() => this.availableAmounts());

  // Filter out the custom option for regular display
  regularAmountOptions = computed(() =>
    this.availableAmounts().filter(opt => opt.field !== 'personalizado')
  );

  // Check if custom option is enabled
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
    // Generar opciones de cuotas
    this.installmentOptions = Array.from({ length: this.maxInstallments }, (_, i) => i + 1);

    // Fecha mínima es hoy
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  isCustomAmount(): boolean {
    return this._isCustomAmount();
  }

  selectAmount(amount: number, field?: string): void {
    this._isCustomAmount.set(false);
    this.selectedAmount.set(amount);
    this.selectedField.set(field);
    this.generateInstallments();
    this.customAmountSelected.emit(false); // No es monto personalizado
  }

  enableCustomAmount(): void {
    this._isCustomAmount.set(true);
    this.selectedField.set(undefined);
    this.customAmountSelected.emit(true); // Es monto personalizado - requiere autorización
    if (this.customAmountValue > 0) {
      this.selectedAmount.set(this.customAmountValue);
      this.generateInstallments();
    }
  }

  onCustomAmountChange(value: number): void {
    this.customAmountValue = value;
    this.selectedAmount.set(value);
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
    const today = new Date();

    for (let i = 0; i < numInstallments; i++) {
      // Calcular fecha (cada 30 días)
      const dueDate = new Date(today);
      dueDate.setDate(dueDate.getDate() + (30 * (i + 1)));

      // La última cuota recibe el remainder
      const installmentAmount = i === numInstallments - 1
        ? amountPerInstallment + remainder
        : amountPerInstallment;

      newInstallments.push({
        numeroCuota: i + 1,
        monto: installmentAmount,
        fechaPago: dueDate.toISOString().split('T')[0]
      });
    }

    this.installments.set(newInstallments);
    this.emitChange();
  }

  onInstallmentChange(): void {
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
      campoMontoOrigen: this.selectedField()  // El nombre del campo de donde viene el monto (ej: sld_mora)
    };

    this.scheduleChange.emit(config);
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(value);
  }
}
