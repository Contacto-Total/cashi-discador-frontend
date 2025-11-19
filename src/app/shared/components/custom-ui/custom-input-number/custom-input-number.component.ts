import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-custom-input-number',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './custom-input-number.component.html',
  styleUrls: ['./custom-input-number.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputNumberComponent),
      multi: true
    }
  ]
})
export class CustomInputNumberComponent implements ControlValueAccessor {
  @Input() min: number | null = null;
  @Input() max: number | null = null;
  @Input() step: number = 1;
  @Input() placeholder: string = '';
  @Input() disabled: boolean = false;
  @Input() hasError: boolean = false;
  @Output() valueChange = new EventEmitter<number | null>();

  value: number | null = null;

  private onChange: (value: number | null) => void = () => {};
  private onTouched: () => void = () => {};

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const numValue = input.value === '' ? null : parseFloat(input.value);

    if (numValue !== null) {
      // Apply min/max constraints
      let constrainedValue = numValue;
      if (this.min !== null && numValue < this.min) {
        constrainedValue = this.min;
      }
      if (this.max !== null && numValue > this.max) {
        constrainedValue = this.max;
      }
      this.value = constrainedValue;
    } else {
      this.value = null;
    }

    this.onChange(this.value);
    this.onTouched();
    this.valueChange.emit(this.value);
  }

  onBlur(): void {
    this.onTouched();
  }

  // ControlValueAccessor implementation
  writeValue(value: number | null): void {
    this.value = value;
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
