import { Component, Input, Output, EventEmitter, forwardRef, HostListener, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';

export interface SelectOption {
  label: string;
  value: any;
}

@Component({
  selector: 'app-custom-select',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './custom-select.component.html',
  styleUrls: ['./custom-select.component.scss'],
  host: {
    '[class.compact]': 'compact'
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomSelectComponent),
      multi: true
    }
  ]
})
export class CustomSelectComponent implements ControlValueAccessor {
  @Input() options: SelectOption[] = [];
  @Input() placeholder: string = 'Seleccionar...';
  @Input() disabled: boolean = false;
  @Input() compact: boolean = false;
  @Output() selectionChange = new EventEmitter<any>();
  @ViewChild('trigger', { read: ElementRef }) triggerRef!: ElementRef;

  selectedValue: any = null;
  isOpen: boolean = false;
  dropdownPosition = { top: '0px', left: '0px', width: '0px' };

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside && this.isOpen) {
      this.isOpen = false;
    }
  }

  @HostListener('window:scroll', ['$event'])
  @HostListener('window:resize', ['$event'])
  onWindowEvent(): void {
    if (this.isOpen) {
      this.updateDropdownPosition();
    }
  }

  toggleDropdown(): void {
    if (!this.disabled) {
      if (!this.isOpen) {
        // Update position BEFORE opening
        this.updateDropdownPosition();
      }
      this.isOpen = !this.isOpen;
      if (this.isOpen) {
        // Update again after DOM renders
        setTimeout(() => this.updateDropdownPosition(), 0);
      }
    }
  }

  private updateDropdownPosition(): void {
    if (this.triggerRef) {
      const rect = this.triggerRef.nativeElement.getBoundingClientRect();
      this.dropdownPosition = {
        top: `${rect.bottom + 4}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`
      };
    }
  }

  selectOption(option: SelectOption): void {
    this.selectedValue = option.value;
    this.isOpen = false;
    this.onChange(option.value);
    this.onTouched();
    this.selectionChange.emit(option.value);
  }

  getSelectedLabel(): string {
    if (!this.selectedValue) {
      return this.placeholder;
    }
    const selected = this.options.find(opt => opt.value === this.selectedValue);
    return selected ? selected.label : this.placeholder;
  }

  // ControlValueAccessor implementation
  writeValue(value: any): void {
    this.selectedValue = value;
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
