import { Component, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AgreementsService } from '../../services/agreements.service';
import { CreatePaymentAgreementRequest } from '../../models/create-payment-agreement.request';
import { LucideAngularModule } from 'lucide-angular';
import { ThemeService } from '../../../../../shared/services/theme.service';

@Component({
  selector: 'app-agreements-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, LucideAngularModule, DragDropModule],
  templateUrl: './agreements-page.component.html',
  styleUrls: ['./agreements-page.component.css']
})
export class AgreementsPageComponent implements OnInit {

  agreementForm: FormGroup;
  searchForm: FormGroup;
  isDarkMode = false;

  readonlyInputs = false;
  isLoading = false;
  isBlackoutMode = false;
  isDeudaTotalReset = false;

  tramoDetectado = '';
  mostrarObservacion = false;
  observacionTexto = '';
  mostrarDocumento = false;

  toasts: Array<{ id: number; type: 'error' | 'warning' | 'success'; message: string; icon: string }> = [];
  private toastIdCounter = 0;

  formaPagoSeleccionadaIndex: number | null = null;
  formaPagoTemporal: FormGroup = this.fb.group({
    fechaPago: [''],
    montoPago: [0]
  });

  constructor(
    private fb: FormBuilder,
    private agreementsService: AgreementsService,
    private themeService: ThemeService
  ) {
    this.agreementForm = this.createForm();
    this.searchForm = this.fb.group({
      dniBusqueda: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]]
    });

    // Reactividad: actualizar isDarkMode cuando cambie el tema
    effect(() => {
      this.isDarkMode = this.themeService.isDarkMode();
    });
  }

  ngOnInit() {
    this.setupFormValueChanges();
  }

  createForm(): FormGroup {
    return this.fb.group({
      entidad: ['financiera_oh', Validators.required],
      fechaActual: [this.formatDate(new Date()), Validators.required],
      nombreTitular: ['', [Validators.required, Validators.minLength(2)]],
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      cuentaTarjeta: ['', [Validators.required, Validators.minLength(10)]],
      fechaCompromiso: [this.formatDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)), Validators.required],
      deudaTotal: [0, [Validators.required, Validators.min(0.01)]],
      descuento: [0, [Validators.required, Validators.min(0)]],
      montoAprobado: [0, [Validators.required, Validators.min(0.01)]],
      formasDePago: this.fb.array([])
    });
  }

  createFormaPago(): FormGroup {
    return this.fb.group({
      fechaPago: [this.formatDate(new Date()), Validators.required],
      montoPago: [0, [Validators.required, Validators.min(0.01)]]
    });
  }

  get formasDePagoArray(): FormArray {
    return this.agreementForm.get('formasDePago') as FormArray;
  }

  setupFormValueChanges() {
    this.agreementForm.get('deudaTotal')?.valueChanges.subscribe(() => {
      if (!this.isDeudaTotalReset) {
        this.calculateDiscount();
      }
    });

    this.agreementForm.get('descuento')?.valueChanges.subscribe(() => {
      if (!this.isDeudaTotalReset) {
        this.calculateDiscount();
      }
    });

    this.agreementForm.get('montoAprobado')?.valueChanges.subscribe(() => {
      if (!this.isDeudaTotalReset) {
        this.calculateDiscount();
      }
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
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    return formatted.replace('septiembre', 'setiembre');
  }

  determinarEntidadPorTramo(tramo: string): string {
    // Tramo 3 o Tramo 5 → financiera_oh
    // CONTACTO_TOTAL → nsoluciones
    if (tramo === 'Tramo 3' || tramo === 'Tramo 5') {
      return 'financiera_oh';
    } else if (tramo === 'CONTACTO_TOTAL') {
      return 'nsoluciones';
    }
    // Por defecto, usar financiera_oh
    return 'financiera_oh';
  }

  calculateDiscount() {
    const deudaTotal = this.agreementForm.get('deudaTotal')?.value || 0;
    const montoAprobado = this.agreementForm.get('montoAprobado')?.value || 0;
    let descuento = deudaTotal - montoAprobado;
    if (descuento < 0) descuento = 0;
    this.agreementForm.patchValue({ descuento: Number(descuento.toFixed(2)) }, { emitEvent: false });
  }

  addFormaPago() {
    if (this.formasDePagoArray.length < 10) {
      this.formasDePagoArray.push(this.createFormaPago());
    }
  }

  removeFormaPago(index: number) {
    this.formasDePagoArray.removeAt(index);
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
        // Determinar la entidad basándose en el tramo
        const entidad = this.determinarEntidadPorTramo(response.tramo);

        // Formatear deuda total con 2 decimales
        const deudaTotal = parseFloat(response.deudaTotal).toFixed(2);

        this.agreementForm.patchValue({
          entidad: entidad,
          fechaActual: response.fechaActual,
          nombreTitular: response.nombreDelTitular,
          dni: dni,
          cuentaTarjeta: response.cuentaTarjeta,
          fechaCompromiso: response.fechaCompromiso,
          deudaTotal: parseFloat(deudaTotal)
        });

        this.readonlyInputs = true;
        this.tramoDetectado = response.tramo;
        this.observacionTexto = `Deuda total: ${response.deudaTotal}\nSaldo capital asignado: ${response.saldoCapitalAsig}\nLTD: ${response.ltd}\nLTDE: ${response.ltde}\nAsesor: ${response.asesor}\nTipificación: ${response.observacion}`;
        this.mostrarObservacion = true;
        this.mostrarDocumento = true;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.readonlyInputs = false;

        if (error.status === 404) {
          this.showToast('error', 'Cliente no encontrado en la base de datos.');
        } else if (error.status === 422) {
          this.showToast('warning', 'El cliente no tiene promesa de pago registrada.');
        } else {
          this.showToast('error', 'Error al obtener datos del cliente.');
        }
      }
    });
  }

  toggleBlackoutMode() {
    if (this.isBlackoutMode) {
      if (confirm('Desea volver a mostrar los campos?')) {
        this.isBlackoutMode = false;
      }
    } else {
      const montoAprobado = this.agreementForm.get('montoAprobado')?.value || 0;
      if (montoAprobado <= 0) {
        this.showToast('error', 'Ingrese un monto aprobado válido.');
        return;
      }

      if (confirm('Usar monto aprobado como deuda total?')) {
        this.isDeudaTotalReset = true;
        this.isBlackoutMode = true;

        this.agreementForm.patchValue({
          deudaTotal: montoAprobado,
          descuento: 0
        }, { emitEvent: false });

        setTimeout(() => {
          this.isDeudaTotalReset = false;
        }, 100);
      }
    }
  }

  calculateFromPercentage() {
    const deudaTotal = this.agreementForm.get('deudaTotal')?.value || 0;
    if (deudaTotal <= 0) {
      this.showToast('error', 'Ingrese primero el monto de la deuda total.');
      return;
    }

    const percentage = prompt('Ingrese porcentaje de descuento (0-100):');
    if (percentage && !isNaN(Number(percentage)) && Number(percentage) >= 0 && Number(percentage) <= 100) {
      const descuento = (deudaTotal * Number(percentage)) / 100;
      const montoAprobado = deudaTotal - descuento;

      this.agreementForm.patchValue({
        descuento: Number(descuento.toFixed(2)),
        montoAprobado: Number(montoAprobado.toFixed(2))
      });
    }
  }

  onSubmit() {
    if (!this.agreementForm.valid) {
      this.markFormGroupTouched();
      this.showToast('error', 'Campos requeridos incompletos.');
      return;
    }

    const montoAprobado = this.agreementForm.get('montoAprobado')?.value || 0;

    if (this.formasDePagoArray.length > 0) {
      const sumaPagos = this.formasDePagoArray.controls
        .reduce((acc, control) => acc + Number(control.get('montoPago')?.value || 0), 0);

      const diff = Math.abs(sumaPagos - montoAprobado);
      if (diff > 0.01) {
        this.showToast('error', `Suma de pagos no coincide con monto aprobado`);
        return;
      }
    }

    this.isLoading = true;
    const formValue = this.agreementForm.value;
    const deudaTotalParaEnvio = this.isBlackoutMode ? formValue.montoAprobado : formValue.deudaTotal;

    const request: CreatePaymentAgreementRequest = {
      entidad: formValue.entidad,
      fechaActual: this.formatDisplayDate(formValue.fechaActual),
      nombreTitular: formValue.nombreTitular,
      dni: formValue.dni,
      cuentaTarjeta: formValue.cuentaTarjeta,
      fechaCompromiso: this.formatDisplayDate(formValue.fechaCompromiso),
      deudaTotal: deudaTotalParaEnvio,
      descuento: formValue.descuento,
      montoAprobado: formValue.montoAprobado,
      formasDePago: this.formasDePagoArray.controls.map((control, index) => {
        const fecha: string = control.get('fechaPago')?.value;
        const monto: number = control.get('montoPago')?.value;
        const [yyyy, mm, dd] = fecha.split('-');
        const fechaFormateada = `${dd}/${mm}`;
        return `${index + 1}${this.getOrdinalSuffix(index + 1)} PAGO - ${fechaFormateada} - ${monto} SOLES`;
      }),
    };

    this.agreementsService.downloadAgreementCard(request).subscribe({
      next: (blob) => {
        this.downloadFile(blob, `ACUERDO_DE_PAGO_${request.dni}.pdf`);
        this.isLoading = false;
        this.showToast('success', 'Acuerdo descargado.');
      },
      error: (error) => {
        console.error('Error completo:', error);
        console.error('Status:', error.status);
        console.error('Mensaje:', error.message);
        console.error('Request enviado:', request);
        this.isLoading = false;
        this.showToast('error', `Error ${error.status}: ${error.message || 'Error al generar documento'}`);
      }
    });
  }

  limpiarCampos() {
    while (this.formasDePagoArray.length > 0) {
      this.formasDePagoArray.removeAt(0);
    }

    this.isDeudaTotalReset = false;
    this.mostrarObservacion = false;
    this.observacionTexto = '';
    this.readonlyInputs = false;
    this.isBlackoutMode = false;
    this.tramoDetectado = '';
    this.mostrarDocumento = false;
    this.toasts = [];

    // Preservar la entidad seleccionada
    const entidadActual = this.agreementForm.get('entidad')?.value || 'financiera_oh';

    this.agreementForm.patchValue({
      entidad: entidadActual,
      fechaActual: this.formatDate(new Date()),
      nombreTitular: '',
      dni: '',
      cuentaTarjeta: '',
      fechaCompromiso: this.formatDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),
      deudaTotal: 0,
      descuento: 0,
      montoAprobado: 0
    });
  }

  resetForm() {
    if (confirm('Limpiar todos los campos?')) {
      this.limpiarCampos();
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.agreementForm.get(fieldName);
    return !!(field?.invalid && (field?.touched || field?.dirty));
  }

  getFieldError(fieldName: string): string {
    const field = this.agreementForm.get(fieldName);
    if (field?.errors && (field?.touched || field?.dirty)) {
      if (field.errors['required']) return `${this.getFieldLabel(fieldName)} requerido`;
      if (field.errors['pattern']) {
        if (fieldName === 'dni') return 'DNI: 8 dígitos';
        return `${this.getFieldLabel(fieldName)} inválido`;
      }
      if (field.errors['minLength']) {
        return `${this.getFieldLabel(fieldName)} mín ${field.errors['minLength'].requiredLength}`;
      }
      if (field.errors['min']) {
        return `${this.getFieldLabel(fieldName)} > ${field.errors['min'].min}`;
      }
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      'fechaActual': 'Fecha',
      'nombreTitular': 'Nombre',
      'dni': 'DNI',
      'cuentaTarjeta': 'Cuenta',
      'fechaCompromiso': 'Fecha Compromiso',
      'deudaTotal': 'Deuda',
      'descuento': 'Descuento',
      'montoAprobado': 'Monto Aprobado'
    };
    return labels[fieldName] || fieldName;
  }

  getOrdinalSuffix(n: number): string {
    const suffixes = ['ER', 'DO', 'ER', 'TO', 'TO', 'TO', 'MO', 'VO', 'NO', 'MO'];
    return n <= 10 ? suffixes[n - 1] : '';
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

  private markFormGroupTouched() {
    Object.keys(this.agreementForm.controls).forEach(key => {
      const control = this.agreementForm.get(key);
      control?.markAsTouched();
      if (control instanceof FormArray) {
        control.controls.forEach(c => c.markAsTouched());
      }
    });
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

  getFormGroupAt(index: number): FormGroup {
    return this.formasDePagoArray.at(index) as FormGroup;
  }

  abrirEditorFormaPago(index: number): void {
    this.formaPagoSeleccionadaIndex = index;
    const forma = this.formasDePagoArray.at(index) as FormGroup;
    this.formaPagoTemporal.setValue({
      fechaPago: forma.get('fechaPago')?.value,
      montoPago: forma.get('montoPago')?.value
    });
  }

  guardarEdicionFormaPago(): void {
    if (this.formaPagoTemporal.invalid) {
      this.formaPagoTemporal.markAllAsTouched();
      this.showToast('error', 'Complete todos los campos del pago.');
      return;
    }

    if (this.formaPagoSeleccionadaIndex !== null) {
      const forma = this.formasDePagoArray.at(this.formaPagoSeleccionadaIndex) as FormGroup;
      forma.patchValue({
        fechaPago: this.formaPagoTemporal.get('fechaPago')?.value,
        montoPago: this.formaPagoTemporal.get('montoPago')?.value
      });
      this.cerrarEditor();
    }
  }

  cerrarEditor(): void {
    this.formaPagoSeleccionadaIndex = null;
    this.formaPagoTemporal.reset({
      fechaPago: '',
      montoPago: 0
    });
  }

  getToggleIcon(): string {
    return this.isBlackoutMode ? '↶' : '×';
  }

  getToggleTitle(): string {
    return this.isBlackoutMode
      ? 'Restaurar vista de deuda total'
      : 'Ocultar deuda total y usar monto aprobado como deuda';
  }

  get selectedEntidad(): string {
    return this.agreementForm.get('entidad')?.value || 'financiera_oh';
  }
}
