import { Component, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';

export interface ChipOption {
  label: string;
  value: any;
}

@Component({
  selector: 'app-chip-select',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="space-y-3">
      <!-- Label -->
      @if (label()) {
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {{ label() }}
          @if (required()) {
            <span class="text-red-500">*</span>
          }
        </label>
      }

      <!-- Chips -->
      <div class="flex flex-wrap gap-2">
        @for (option of options(); track option.value) {
          <button
            type="button"
            (click)="selectOption(option)"
            [class.ring-2]="selectedValue() === option.value"
            [class.ring-blue-500]="selectedValue() === option.value"
            [class.bg-blue-600]="selectedValue() === option.value"
            [class.text-white]="selectedValue() === option.value"
            [class.bg-gray-100]="selectedValue() !== option.value"
            [class.dark:bg-gray-700]="selectedValue() !== option.value"
            [class.text-gray-700]="selectedValue() !== option.value"
            [class.dark:text-gray-300]="selectedValue() !== option.value"
            [class.hover:bg-gray-200]="selectedValue() !== option.value"
            [class.dark:hover:bg-gray-600]="selectedValue() !== option.value"
            class="px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 transition-all duration-200 text-sm font-medium"
          >
            {{ option.label }}
          </button>
        }

        @if (allowCustomValue()) {
          <button
            type="button"
            (click)="toggleCustomInput()"
            [class.ring-2]="showCustomInput()"
            [class.ring-blue-500]="showCustomInput()"
            [class.bg-blue-600]="showCustomInput()"
            [class.text-white]="showCustomInput()"
            [class.bg-gray-100]="!showCustomInput()"
            [class.dark:bg-gray-700]="!showCustomInput()"
            [class.text-gray-700]="!showCustomInput()"
            [class.dark:text-gray-300]="!showCustomInput()"
            class="px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 transition-all duration-200 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            <lucide-angular name="edit-3" [size]="16" class="inline mr-1"></lucide-angular>
            Otro monto
          </button>
        }
      </div>

      <!-- Custom input -->
      @if (showCustomInput()) {
        <div class="flex gap-2 items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <input
            type="number"
            [(ngModel)]="customValue"
            (ngModelChange)="onCustomValueChange($event)"
            [placeholder]="placeholder()"
            class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
          />
          <button
            type="button"
            (click)="clearCustomInput()"
            class="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <lucide-angular name="x" [size]="16"></lucide-angular>
          </button>
        </div>
      }

      <!-- Description -->
      @if (description()) {
        <p class="text-xs text-gray-600 dark:text-gray-400">
          {{ description() }}
        </p>
      }

      <!-- Error message -->
      @if (errorMessage()) {
        <p class="text-xs text-red-500">
          {{ errorMessage() }}
        </p>
      }

      <!-- Selected value display -->
      @if (selectedValue() !== null && selectedValue() !== undefined) {
        <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <lucide-angular name="check-circle" [size]="16" class="text-green-500"></lucide-angular>
          Valor seleccionado: <span class="font-semibold">{{ formatValue(selectedValue()) }}</span>
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ChipSelectComponent {
  label = input<string>('');
  options = input.required<ChipOption[]>();
  value = input<any>(null);
  required = input<boolean>(false);
  allowCustomValue = input<boolean>(true);
  placeholder = input<string>('Ingrese un monto');
  description = input<string>('');
  errorMessage = input<string>('');

  valueChange = output<any>();

  selectedValue = signal<any>(null);
  showCustomInput = signal<boolean>(false);
  customValue: number | null = null;

  constructor() {
    // Sincronizar valor inicial
    this.selectedValue.set(this.value());
  }

  selectOption(option: ChipOption) {
    this.selectedValue.set(option.value);
    this.showCustomInput.set(false);
    this.customValue = null;
    this.valueChange.emit(option.value);
  }

  toggleCustomInput() {
    this.showCustomInput.update(show => !show);
    if (this.showCustomInput()) {
      this.selectedValue.set(null);
    }
  }

  onCustomValueChange(value: number | null) {
    if (value !== null && value !== undefined) {
      this.selectedValue.set(value);
      this.valueChange.emit(value);
    }
  }

  clearCustomInput() {
    this.showCustomInput.set(false);
    this.customValue = null;
    this.selectedValue.set(null);
    this.valueChange.emit(null);
  }

  formatValue(value: any): string {
    if (typeof value === 'number') {
      return `$${value.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return String(value);
  }
}
