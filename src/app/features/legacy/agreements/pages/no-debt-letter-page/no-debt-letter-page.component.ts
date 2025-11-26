import { Component, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AgreementsService } from '../../services/agreements.service';
import { LucideAngularModule } from 'lucide-angular';
import { ThemeService } from '../../../../../shared/services/theme.service';

@Component({
  selector: 'app-no-debt-letter-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './no-debt-letter-page.component.html',
  styleUrls: ['./no-debt-letter-page.component.css']
})
export class NoDebtLetterPageComponent {
  searchForm: FormGroup;
  letterForm: FormGroup;
  isDarkMode = false;

  isLoading = false;
  mostrarDocumento = false;

  toasts: Array<{ id: number; type: 'error' | 'warning' | 'success'; message: string; icon: string }> = [];
  private toastIdCounter = 0;

  // Datos estáticos para nsoluciones
  entidad = 'nsoluciones';
  rucFinanciera = '20522291201';
  rucNsoluciones = '20611923202';
  direccion = 'Calle Morelli 217, Int 205 San Borja – Lima – Perú';
  telefono = '+51 915 326 798';
  firmaNombre = 'Emily Dayana Saenz Martinez';
  firmaCargo = 'Administración';

  constructor(
    private fb: FormBuilder,
    private agreementsService: AgreementsService,
    private themeService: ThemeService
  ) {
    this.searchForm = this.fb.group({
      dniBusqueda: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]]
    });

    this.letterForm = this.fb.group({
      nombreCompleto: ['', Validators.required],
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      numeroCuenta: ['', Validators.required],
      fechaActual: [this.formatDate(new Date()), Validators.required],
      fechaCancelacion: [this.formatDate(new Date()), Validators.required]
    });

    effect(() => {
      this.isDarkMode = this.themeService.isDarkMode();
    });
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  formatDisplayDate(dateString: string): string {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const formatted = date.toLocaleDateString('es-PE', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    return formatted.replace('septiembre', 'setiembre');
  }

  buscarPorDni() {
    if (this.searchForm.invalid) {
      this.searchForm.markAllAsTouched();
      return;
    }

    const dni = this.searchForm.get('dniBusqueda')?.value;
    this.limpiarCampos();
    this.searchForm.reset();
    this.isLoading = true;

    this.agreementsService.getAgreementData(dni).subscribe({
      next: (response) => {
        this.letterForm.patchValue({
          nombreCompleto: response.nombreDelTitular,
          dni: dni,
          numeroCuenta: response.cuentaTarjeta,
          fechaActual: this.formatDate(new Date()),
          fechaCancelacion: this.formatDate(new Date())
        });

        this.mostrarDocumento = true;
        this.isLoading = false;
        this.showToast('success', 'Datos cargados correctamente');
      },
      error: (error) => {
        this.isLoading = false;

        if (error.status === 404) {
          this.showToast('error', 'Cliente no encontrado en la base de datos.');
        } else if (error.status === 422) {
          this.showToast('warning', 'El cliente no tiene datos registrados.');
        } else {
          this.showToast('error', 'Error al obtener datos del cliente.');
        }
      }
    });
  }

  generarPDF() {
    if (!this.letterForm.valid) {
      this.showToast('error', 'Complete los campos requeridos.');
      return;
    }

    this.isLoading = true;
    const formValue = this.letterForm.value;

    const request = {
      entidad: this.entidad,
      nombreCompleto: formValue.nombreCompleto,
      dni: formValue.dni,
      numeroCuenta: formValue.numeroCuenta,
      fechaActual: this.formatDisplayDate(formValue.fechaActual),
      fechaCancelacion: this.formatDisplayDate(formValue.fechaCancelacion),
      rucFinanciera: this.rucFinanciera,
      rucNsoluciones: this.rucNsoluciones
    };

    this.agreementsService.downloadNoDebtLetter(request).subscribe({
      next: (blob) => {
        this.downloadFile(blob, `CARTA_NO_ADEUDO_${formValue.dni}.pdf`);
        this.isLoading = false;
        this.showToast('success', 'Carta de No Adeudo descargada correctamente');
      },
      error: (error) => {
        console.error('Error completo:', error);
        this.isLoading = false;
        this.showToast('error', `Error al generar documento: ${error.message || 'Error desconocido'}`);
      }
    });
  }

  private downloadFile(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  limpiarCampos() {
    this.mostrarDocumento = false;
    this.toasts = [];
    this.letterForm.patchValue({
      nombreCompleto: '',
      dni: '',
      numeroCuenta: '',
      fechaActual: this.formatDate(new Date()),
      fechaCancelacion: this.formatDate(new Date())
    });
  }

  resetForm() {
    if (confirm('Limpiar todos los campos?')) {
      this.limpiarCampos();
    }
  }

  showToast(type: 'error' | 'warning' | 'success', message: string) {
    const icon = type === 'error' ? '❌' : type === 'warning' ? '⚠️' : '✅';
    const id = this.toastIdCounter++;
    this.toasts.push({ id, type, message, icon });
    setTimeout(() => this.removeToast(id), 5000);
  }

  removeToast(id: number) {
    this.toasts = this.toasts.filter(toast => toast.id !== id);
  }

  onlyNumbers(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
  }
}
