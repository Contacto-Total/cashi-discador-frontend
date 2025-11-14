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
import { TypificationCatalog, AdditionalField, FieldType } from '../../../maintenance/models/typification.model';

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
    MatNativeDateModule
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
  loadingAdditionalFields = false;
  FieldType = FieldType; // Para usar en el template

  constructor(
    private fb: FormBuilder,
    private callService: CallService,
    private authService: AuthService,
    private typificationService: TypificationService
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

    this.typificationService.getAdditionalFields(typificationId).subscribe({
      next: (fields) => {
        this.additionalFields = fields;
        this.addDynamicFieldsToForm(fields);
        this.loadingAdditionalFields = false;
      },
      error: (error) => {
        console.error('Error loading additional fields:', error);
        this.additionalFields = [];
        this.loadingAdditionalFields = false;
      }
    });
  }

  clearAdditionalFields(): void {
    // Remover controles dinámicos del formulario
    this.additionalFields.forEach(field => {
      this.notesForm.removeControl(`campo_${field.id}`);
    });
    this.additionalFields = [];
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
        // Luego guardar el registro de gestión V2 con tipificaciones
        this.typificationService.saveManagementRecord(managementRecord).subscribe({
          next: () => {
            this.loading = false;
            this.notesComplete.emit();
          },
          error: (error) => {
            console.error('Error saving management record:', error);
            // Incluso si falla el registro V2, la llamada ya se completó
            this.loading = false;
            this.notesComplete.emit();
          }
        });
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
