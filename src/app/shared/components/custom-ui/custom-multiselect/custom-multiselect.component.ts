import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';

export interface MultiSelectOption {
  label: string;
  value: any;
}

@Component({
  selector: 'app-custom-multiselect',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './custom-multiselect.component.html',
  styleUrls: ['./custom-multiselect.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomMultiSelectComponent),
      multi: true
    }
  ]
})
export class CustomMultiSelectComponent implements ControlValueAccessor {
  @Input() options: MultiSelectOption[] = [];
  @Input() placeholder: string = 'Seleccionar...';
  @Input() disabled: boolean = false;
  @Input() showToggleAll: boolean = true;
  @Input() showClear: boolean = true;
  @Output() selectionChange = new EventEmitter<any[]>();

  selectedValues: any[] = [];
  isOpen: boolean = false;

  private onChange: (value: any[]) => void = () => {};
  private onTouched: () => void = () => {};

  toggleDropdown(): void {
    if (!this.disabled) {
      this.isOpen = !this.isOpen;
    }
  }

  toggleOption(option: MultiSelectOption): void {
    const index = this.selectedValues.indexOf(option.value);
    if (index > -1) {
      this.selectedValues.splice(index, 1);
    } else {
      this.selectedValues.push(option.value);
    }
    this.onChange(this.selectedValues);
    this.onTouched();
    this.selectionChange.emit(this.selectedValues);
  }

  isSelected(value: any): boolean {
    return this.selectedValues.includes(value);
  }

  selectAll(): void {
    this.selectedValues = this.options.map(opt => opt.value);
    this.onChange(this.selectedValues);
    this.selectionChange.emit(this.selectedValues);
  }

  clearAll(): void {
    this.selectedValues = [];
    this.onChange(this.selectedValues);
    this.selectionChange.emit(this.selectedValues);
  }

  getDisplayText(): string {
    if (this.selectedValues.length === 0) {
      return this.placeholder;
    }
    if (this.selectedValues.length === this.options.length) {
      return `Todos seleccionados (${this.selectedValues.length})`;
    }
    return `${this.selectedValues.length} seleccionado${this.selectedValues.length > 1 ? 's' : ''}`;
  }

  // ControlValueAccessor implementation
  writeValue(value: any[]): void {
    this.selectedValues = value || [];
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
