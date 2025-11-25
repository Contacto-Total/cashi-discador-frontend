import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CallService } from '../../../core/services/call.service';
import { Call, CallDisposition, CompleteCallRequest } from '../../../core/models/call.model';
import { Contact } from '../../../core/models/contact.model';
import { AuthService } from '../../../core/services/auth.service';
import { TypificationService } from '../../../maintenance/services/typification.service';
import { TypificationV2Service } from '../../../maintenance/services/typification-v2.service';
import { TypificationCatalog, AdditionalField, FieldType } from '../../../maintenance/models/typification.model';
import { AdditionalFieldV2, FieldTypeV2, FieldDataSourceV2, PaymentScheduleConfig } from '../../../maintenance/models/typification-v2.model';
import { ChipSelectComponent, ChipOption } from '../../../shared/components/chip-select/chip-select.component';
import { PaymentScheduleComponent, AmountOption } from '../../../shared/components/payment-schedule/payment-schedule.component';

@Component({
  selector: 'app-call-notes',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ChipSelectComponent,
    PaymentScheduleComponent
  ],
  templateUrl: './call-notes.component.html',
  styleUrls: ['./call-notes.component.css']
})
export class CallNotesComponent implements OnInit {
  @Input() call: Call | null = null;
  @Input() contact: Contact | null = null;

  @Output() notesComplete = new EventEmitter<void>();

  notesForm!: FormGroup;
  loading = false;

  dispositions = Object.values(CallDisposition);

  // Tipificaciones V2
  allTypifications: TypificationCatalog[] = [];
  nivel1Options: TypificationCatalog[] = [];
  nivel2Options: TypificationCatalog[] = [];
  nivel3Options: TypificationCatalog[] = [];
  nivel4Options: TypificationCatalog[] = [];
  loadingTypifications = false;

  // Campos adicionales dinámicos
  additionalFields: AdditionalField[] = [];
  additionalFieldsV2: AdditionalFieldV2[] = [];
  loadingAdditionalFields = false;
  FieldType = FieldType; // Para usar en el template
  FieldTypeV2 = FieldTypeV2; // Para usar en el template
  FieldDataSourceV2 = FieldDataSourceV2; // Para usar en el template

  // Cronograma de pagos
  paymentScheduleConfig: PaymentScheduleConfig | null = null;

  constructor(
    private fb: FormBuilder,
    private callService: CallService,
    private authService: AuthService,
    private typificationService: TypificationService,
    private typificationV2Service: TypificationV2Service
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadTypifications();
  }

  initForm(): void {
    this.notesForm = this.fb.group({
      disposition: ['', Validators.required],
      notes: ['', Validators.required],
      scheduleCallback: [null],
      // Nuevos campos de tipificación V2
      nivel1: [null],
      nivel2: [null],
      nivel3: [null],
      nivel4: [null]
    });

    // Suscribirse a cambios en los niveles para cargar opciones en cascada
    this.notesForm.get('nivel1')?.valueChanges.subscribe(value => {
      this.onNivel1Change(value);
    });

    this.notesForm.get('nivel2')?.valueChanges.subscribe(value => {
      this.onNivel2Change(value);
    });

    this.notesForm.get('nivel3')?.valueChanges.subscribe(value => {
      this.onNivel3Change(value);
    });

    this.notesForm.get('nivel4')?.valueChanges.subscribe(value => {
      this.onNivel4Change(value);
    });
  }

  loadTypifications(): void {
    const user = this.authService.getCurrentUser();

    if (!user || !user.tenantId || !user.portfolioId || !user.subPortfolioId) {
      console.warn('Usuario no tiene asignación de tenant/cartera/subcartera');
      return;
    }

    this.loadingTypifications = true;

    this.typificationService.getEffectiveTypifications(
      user.tenantId,
      user.portfolioId,
      user.subPortfolioId
    ).subscribe({
      next: (tipificaciones) => {
        this.allTypifications = tipificaciones;
        // Filtrar nivel 1 (raíces)
        this.nivel1Options = tipificaciones.filter(t => t.hierarchyLevel === 1);
        this.loadingTypifications = false;
      },
      error: (error) => {
        console.error('Error cargando tipificaciones:', error);
        this.loadingTypifications = false;
      }
    });
  }

  onNivel1Change(selectedId: number | null): void {
    // Limpiar niveles inferiores
    this.notesForm.patchValue({
      nivel2: null,
      nivel3: null,
      nivel4: null
    });
    this.nivel2Options = [];
    this.nivel3Options = [];
    this.nivel4Options = [];
    this.clearAdditionalFields();

    if (!selectedId) return;

    // Buscar hijos del nivel 1 seleccionado
    const selected = this.allTypifications.find(t => t.id === selectedId);
    if (selected && selected.parentTypificationId === null) {
      // Cargar opciones de nivel 2 (hijos del nivel 1)
      this.nivel2Options = this.allTypifications.filter(
        t => t.parentTypificationId === selectedId && t.hierarchyLevel === 2
      );
    }

    // Cargar campos adicionales para nivel 1
    this.loadAdditionalFields(selectedId);
  }

  onNivel2Change(selectedId: number | null): void {
    // Limpiar niveles inferiores
    this.notesForm.patchValue({
      nivel3: null,
      nivel4: null
    });
    this.nivel3Options = [];
    this.nivel4Options = [];
    this.clearAdditionalFields();

    if (!selectedId) return;

    // Cargar opciones de nivel 3 (hijos del nivel 2)
    this.nivel3Options = this.allTypifications.filter(
      t => t.parentTypificationId === selectedId && t.hierarchyLevel === 3
    );

    // Cargar campos adicionales para nivel 2
    this.loadAdditionalFields(selectedId);
  }

  onNivel3Change(selectedId: number | null): void {
    // Limpiar nivel inferior
    this.notesForm.patchValue({
      nivel4: null
    });
    this.nivel4Options = [];
    this.clearAdditionalFields();

    if (!selectedId) return;

    // Cargar opciones de nivel 4 (hijos del nivel 3)
    this.nivel4Options = this.allTypifications.filter(
      t => t.parentTypificationId === selectedId && t.hierarchyLevel === 4
    );

    // Cargar campos adicionales para nivel 3
    this.loadAdditionalFields(selectedId);
  }

  onNivel4Change(selectedId: number | null): void {
    this.clearAdditionalFields();

    if (!selectedId) return;

    // Cargar campos adicionales para nivel 4
    this.loadAdditionalFields(selectedId);
  }

  loadAdditionalFields(typificationId: number): void {
    this.loadingAdditionalFields = true;
    const user = this.authService.getCurrentUser();

    if (!user || !user.tenantId) {
      console.warn('No se pudo obtener información del usuario');
      this.loadingAdditionalFields = false;
      return;
    }

    // Usar API V2 con clientId para obtener valores dinámicos
    const clientId = this.contact?.id;

    this.typificationV2Service.getTypificationFieldsWithValues(
      user.tenantId,
      typificationId,
      user.portfolioId,
      clientId
    ).subscribe({
      next: (response) => {
        this.additionalFieldsV2 = response.fields;
        this.addDynamicFieldsToFormV2(response.fields);
        this.loadingAdditionalFields = false;
      },
      error: (error) => {
        console.error('Error loading additional fields V2:', error);
        this.additionalFieldsV2 = [];
        this.loadingAdditionalFields = false;
      }
    });
  }

  clearAdditionalFields(): void {
    // Remover controles dinámicos del formulario V1
    this.additionalFields.forEach(field => {
      this.notesForm.removeControl(`campo_${field.id}`);
    });
    this.additionalFields = [];

    // Remover controles dinámicos del formulario V2
    this.additionalFieldsV2.forEach(field => {
      this.notesForm.removeControl(`campo_${field.id}`);
    });
    this.additionalFieldsV2 = [];
  }

  addDynamicFieldsToForm(fields: AdditionalField[]): void {
    fields.forEach(field => {
      const validators = field.esRequerido ? [Validators.required] : [];

      // Agregar validadores según el tipo de campo
      if (field.tipoCampo === FieldType.NUMBER) {
        if (field.valorMinimo !== null && field.valorMinimo !== undefined) {
          validators.push(Validators.min(field.valorMinimo));
        }
        if (field.valorMaximo !== null && field.valorMaximo !== undefined) {
          validators.push(Validators.max(field.valorMaximo));
        }
      } else if (field.tipoCampo === FieldType.TEXT || field.tipoCampo === FieldType.TEXTAREA) {
        if (field.longitudMaxima) {
          validators.push(Validators.maxLength(field.longitudMaxima));
        }
      }

      this.notesForm.addControl(`campo_${field.id}`, this.fb.control('', validators));
    });
  }

  addDynamicFieldsToFormV2(fields: AdditionalFieldV2[]): void {
    fields.forEach(field => {
      const validators = field.esRequerido ? [Validators.required] : [];

      // Agregar validadores según el tipo de campo
      if (field.tipoCampo === FieldTypeV2.NUMBER) {
        if (field.valorMinimo !== null && field.valorMinimo !== undefined) {
          validators.push(Validators.min(field.valorMinimo));
        }
        if (field.valorMaximo !== null && field.valorMaximo !== undefined) {
          validators.push(Validators.max(field.valorMaximo));
        }
      } else if (field.tipoCampo === FieldTypeV2.TEXT || field.tipoCampo === FieldTypeV2.TEXTAREA) {
        if (field.longitudMaxima) {
          validators.push(Validators.maxLength(field.longitudMaxima));
        }
      }

      this.notesForm.addControl(`campo_${field.id}`, this.fb.control('', validators));
    });
  }

  buildChipOptions(field: AdditionalFieldV2): ChipOption[] {
    const options: ChipOption[] = [];

    // Si el campo tiene un valor desde la tabla dinámica, agregarlo como opción
    if (field.value !== null && field.value !== undefined) {
      options.push({
        label: `${field.labelCampo}: $${Number(field.value).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        value: field.value
      });
    }

    // TODO: Agregar otras opciones como Deuda Total si está disponible
    // if (this.contact?.debtAmount) {
    //   options.push({
    //     label: `Deuda Total: $${this.contact.debtAmount.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`,
    //     value: this.contact.debtAmount
    //   });
    // }

    return options;
  }

  onChipValueChange(fieldId: number, value: any): void {
    this.notesForm.get(`campo_${fieldId}`)?.setValue(value);
  }

  buildPaymentAmountOptions(field: AdditionalFieldV2): AmountOption[] {
    const options: AmountOption[] = [];

    // Si el campo tiene opciones predefinidas
    if (field.options && field.options.length > 0) {
      field.options.forEach(opt => {
        if (opt.value !== null && opt.value !== undefined) {
          options.push({
            label: opt.label,
            value: Number(opt.value),
            field: field.campoTablaDinamica
          });
        }
      });
    }

    // Si el campo tiene un valor desde la tabla dinámica
    if (field.value !== null && field.value !== undefined) {
      const exists = options.some(o => o.value === Number(field.value));
      if (!exists) {
        options.push({
          label: field.labelCampo,
          value: Number(field.value),
          field: field.campoTablaDinamica
        });
      }
    }

    return options;
  }

  onPaymentScheduleChange(config: PaymentScheduleConfig | null): void {
    this.paymentScheduleConfig = config;
  }

  onSubmit(): void {
    if (this.notesForm.invalid || !this.call || !this.contact) {
      return;
    }

    this.loading = true;
    const user = this.authService.getCurrentUser();

    if (!user) {
      console.error('No user logged in');
      this.loading = false;
      return;
    }

    // Primero, completar la llamada con el sistema existente
    const callRequest: CompleteCallRequest = {
      disposition: this.notesForm.value.disposition,
      notes: this.notesForm.value.notes,
      scheduleCallback: this.notesForm.value.scheduleCallback || undefined
    };

    // Guardar tipificaciones V2 y campos adicionales
    const managementRecord = {
      idTenant: user.tenantId,
      idCartera: user.portfolioId,
      idSubcartera: user.subPortfolioId,
      idCliente: this.contact.id,
      idAgente: user.id,
      idCampana: null, // TODO: Obtener de la campaña activa si existe
      observaciones: this.notesForm.value.notes,
      metodoContacto: 'LLAMADA_SALIENTE',
      canalContacto: this.call.phoneNumber,
      duracionSegundos: this.call.duration,
      fechaSeguimiento: this.notesForm.value.scheduleCallback || null,
      estadoGestion: 'COMPLETADA',
      tipificacion: {
        id: this.getSelectedTipificacionId()
      },
      tipificacionNivel1: this.notesForm.value.nivel1 ? { id: this.notesForm.value.nivel1 } : null,
      tipificacionNivel2: this.notesForm.value.nivel2 ? { id: this.notesForm.value.nivel2 } : null,
      tipificacionNivel3: this.notesForm.value.nivel3 ? { id: this.notesForm.value.nivel3 } : null,
      tipificacionNivel4: this.notesForm.value.nivel4 ? { id: this.notesForm.value.nivel4 } : null,
      valoresCamposAdicionales: this.getAdditionalFieldValues()
    };

    // Primero completar la llamada
    this.callService.completeCall(this.call.callId, callRequest).subscribe({
      next: () => {
        // Si hay cronograma de pagos configurado, usar el endpoint de payment-schedule
        if (this.paymentScheduleConfig && this.paymentScheduleConfig.cuotas.length > 0) {
          const paymentScheduleRequest = {
            idCliente: this.contact!.id,
            idAgente: user.id,
            idTenant: user.tenantId,
            idCartera: user.portfolioId,
            idSubcartera: user.subPortfolioId,
            idCampana: null,
            idTipificacion: this.getSelectedTipificacionId(),
            observaciones: this.notesForm.value.notes,
            metodoContacto: 'LLAMADA_SALIENTE',
            schedule: this.paymentScheduleConfig
          };

          this.typificationV2Service.createPaymentSchedule(paymentScheduleRequest).subscribe({
            next: (records) => {
              console.log('Payment schedule created with', records.length, 'installments');
              this.loading = false;
              this.notesComplete.emit();
            },
            error: (error) => {
              console.error('Error creating payment schedule:', error);
              this.loading = false;
              this.notesComplete.emit();
            }
          });
        } else {
          // Guardar registro de gestión normal
          this.typificationService.saveManagementRecord(managementRecord).subscribe({
            next: () => {
              this.loading = false;
              this.notesComplete.emit();
            },
            error: (error) => {
              console.error('Error saving management record:', error);
              this.loading = false;
              this.notesComplete.emit();
            }
          });
        }
      },
      error: (error) => {
        console.error('Error completing call:', error);
        this.loading = false;
      }
    });
  }

  private getSelectedTipificacionId(): number | null {
    // Retorna el ID de la tipificación de mayor nivel seleccionada
    if (this.notesForm.value.nivel4) return this.notesForm.value.nivel4;
    if (this.notesForm.value.nivel3) return this.notesForm.value.nivel3;
    if (this.notesForm.value.nivel2) return this.notesForm.value.nivel2;
    if (this.notesForm.value.nivel1) return this.notesForm.value.nivel1;
    return null;
  }

  private getAdditionalFieldValues(): any[] {
    const valores: any[] = [];

    this.additionalFields.forEach(field => {
      const controlName = `campo_${field.id}`;
      const valor = this.notesForm.get(controlName)?.value;

      if (valor !== null && valor !== undefined && valor !== '') {
        valores.push({
          campo: { id: field.id },
          valorTexto: field.tipoCampo === FieldType.TEXT || field.tipoCampo === FieldType.TEXTAREA ? valor : null,
          valorNumero: field.tipoCampo === FieldType.NUMBER ? valor : null,
          valorFecha: field.tipoCampo === FieldType.DATE ? valor : null
        });
      }
    });

    return valores;
  }

  onSkip(): void {
    if (confirm('Skip saving notes? The call will be marked without detailed notes.')) {
      this.notesComplete.emit();
    }
  }
}
