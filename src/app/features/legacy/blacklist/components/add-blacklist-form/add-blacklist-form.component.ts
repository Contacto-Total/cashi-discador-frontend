import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BlacklistService } from '../../services/blacklist.service';
import { BlacklistRequest } from '../../models/blacklist.request';
import { ToastService } from '../../../../../shared/services/toast.service';
import { CustomSelectComponent, SelectOption } from '../../../../../shared/components/custom-ui/custom-select/custom-select.component';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-add-blacklist-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CustomSelectComponent, LucideAngularModule],
  templateUrl: './add-blacklist-form.component.html',
  styleUrls: ['./add-blacklist-form.component.scss']
})
export class AddBlacklistFormComponent implements OnInit {
  @Output() blacklistAdded = new EventEmitter<void>();

  formGroup: FormGroup = new FormGroup({});
  proveedores: SelectOption[] = [];
  isLoading = false;

  constructor(
    private blacklistService: BlacklistService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadProveedores();
  }

  private initializeForm(): void {
    this.formGroup = new FormGroup({
      selectedProveedor: new FormControl<string | null>(null, Validators.required),
      documento: new FormControl<string>('', [Validators.required, Validators.pattern(/^\d+$/)]),
      fechaFin: new FormControl<string>('', [Validators.required, this.validateFutureDate.bind(this)])
    });
  }

  private loadProveedores(): void {
    this.proveedores = [
      { label: 'FINANCIERA OH', value: 'FINANCIERA_OH' },
      { label: 'TRAMO PROPIO', value: 'TRAMO_PROPIO' }
    ];
  }

  private validateFutureDate(control: FormControl): { [key: string]: boolean } | null {
    if (!control.value) {
      return null;
    }
    const fechaSeleccionada = new Date(control.value);
    const fechaHoy = new Date();
    fechaHoy.setHours(0, 0, 0, 0);
    if (fechaSeleccionada < fechaHoy) {
      return { fechaInvalida: true };
    }
    return null;
  }

  insertarBlacklist(): void {
    if (!this.formGroup.valid) {
      this.formGroup.markAllAsTouched();
      this.toastService.error('Por favor completa todos los campos requeridos');
      return;
    }

    const selectedProveedor = this.formGroup.value.selectedProveedor;
    const dni = this.formGroup.value.documento;
    const fechaFin = new Date(this.formGroup.value.fechaFin).toISOString().split('T')[0];

    this.isLoading = true;

    if (selectedProveedor === 'TRAMO_PROPIO') {
      // Buscar entidad automáticamente
      this.blacklistService.getEntidadByDocumento(dni).subscribe({
        next: (entidad) => {
          this.procesarBlacklist(selectedProveedor, dni, fechaFin, entidad);
        },
        error: (error) => {
          this.isLoading = false;
          this.toastService.error(error?.message || 'Documento no encontrado en Tramo Propio');
        }
      });
    } else {
      // FINANCIERA_OH
      this.procesarBlacklist(selectedProveedor, dni, fechaFin, 'FUNO');
    }
  }

  private procesarBlacklist(proveedor: string, dni: string, fechaFin: string, entidad: string): void {
    const { cartera, subcartera } = this.mapProveedorToConfig(proveedor);

    const blacklistTemp: BlacklistRequest = {
      empresa: proveedor,
      cartera,
      subcartera,
      documento: dni,
      fechaFin,
      entidad
    };

    this.blacklistService.insertBlacklist(blacklistTemp).subscribe({
      next: () => {
        const fechaActual = new Date().toISOString().split('T')[0];
        this.toastService.success(
          `Cliente DNI: ${dni} agregado a Blacklist (${fechaActual} - ${fechaFin})`
        );
        this.formGroup.reset();
        this.blacklistAdded.emit();
        this.isLoading = false;
      },
      error: (error) => {
        const message = error?.message || 'Error al agregar a la blacklist';
        this.toastService.error(message);
        this.isLoading = false;
      }
    });
  }

  private mapProveedorToConfig(proveedor: string): { cartera: string; subcartera: string } {
    if (proveedor === 'FINANCIERA_OH') {
      return {
        cartera: 'FO_TRAMO 5',
        subcartera: 'FO_TRAMO_5'
      };
    } else {
      return {
        cartera: 'TRAMO_PROPIO',
        subcartera: 'TRAMO_PROPIO'
      };
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.formGroup.get(fieldName);
    if (field?.errors && (field?.touched || field?.dirty)) {
      if (field.errors['required']) {
        return 'Este campo es requerido';
      }
      if (field.errors['pattern']) {
        return 'Solo se permiten números';
      }
      if (field.errors['fechaInvalida']) {
        return 'La fecha debe ser igual o mayor a hoy';
      }
    }
    return '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.formGroup.get(fieldName);
    return !!(field?.invalid && (field?.touched || field?.dirty));
  }
}
