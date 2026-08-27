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
  @ViewChild('lista', { read: ElementRef }) listaRef?: ElementRef;

  selectedValue: any = null;
  isOpen: boolean = false;
  dropdownPosition = { top: '0px', left: '0px', width: '0px' };

  /**
   * Si la lista se desplegó hacia arriba porque abajo no cabía.
   *
   * El desplegable es `position: fixed`, así que no lo recorta ningún contenedor:
   * simplemente se sale de la ventana y las opciones de abajo quedan inalcanzables.
   * Pasaba con el «Por página» de la card de revisión, que vive al final de la
   * pantalla y dejaba el 10 fuera de vista.
   */
  abreArriba: boolean = false;

  /** El `max-height` que el SCSS le da a la lista. */
  private static readonly ALTO_MAXIMO = 250;
  private static readonly MARGEN = 8;
  private static readonly ALTO_OPCION = 29;

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

  /**
   * Coloca la lista debajo del control, o encima si abajo no entra.
   *
   * Se llama dos veces al abrir: la primera con la lista todavía sin renderizar
   * —de ahí la altura estimada— y la segunda con el elemento ya en el DOM, que es
   * cuando se puede medir de verdad.
   */
  private updateDropdownPosition(): void {
    if (!this.triggerRef) {
      return;
    }
    const rect = this.triggerRef.nativeElement.getBoundingClientRect();
    const margen = CustomSelectComponent.MARGEN;

    const medido = this.listaRef?.nativeElement?.offsetHeight;
    const alto = medido || Math.min(
      CustomSelectComponent.ALTO_MAXIMO,
      this.options.length * CustomSelectComponent.ALTO_OPCION + 2);

    const espacioAbajo = window.innerHeight - rect.bottom - margen;
    const espacioArriba = rect.top - margen;

    // Solo se invierte si abajo no cabe Y arriba hay más sitio: con las dos
    // opciones apretadas, quedarse abajo es lo esperable.
    this.abreArriba = alto > espacioAbajo && espacioArriba > espacioAbajo;

    this.dropdownPosition = {
      top: this.abreArriba
        ? `${Math.max(margen, rect.top - alto - 4)}px`
        : `${rect.bottom + 4}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`
    };
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
