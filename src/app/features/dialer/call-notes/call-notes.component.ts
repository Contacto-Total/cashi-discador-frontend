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
import { TypificationCatalog } from '../../../maintenance/models/typification.model';

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

    if (!selectedId) return;

    // Buscar hijos del nivel 1 seleccionado
    const selected = this.allTypifications.find(t => t.id === selectedId);
    if (selected && selected.parentTypificationId === null) {
      // Cargar opciones de nivel 2 (hijos del nivel 1)
      this.nivel2Options = this.allTypifications.filter(
        t => t.parentTypificationId === selectedId && t.hierarchyLevel === 2
      );
    }
  }

  onNivel2Change(selectedId: number | null): void {
    // Limpiar niveles inferiores
    this.notesForm.patchValue({
      nivel3: null,
      nivel4: null
    });
    this.nivel3Options = [];
    this.nivel4Options = [];

    if (!selectedId) return;

    // Cargar opciones de nivel 3 (hijos del nivel 2)
    this.nivel3Options = this.allTypifications.filter(
      t => t.parentTypificationId === selectedId && t.hierarchyLevel === 3
    );
  }

  onNivel3Change(selectedId: number | null): void {
    // Limpiar nivel inferior
    this.notesForm.patchValue({
      nivel4: null
    });
    this.nivel4Options = [];

    if (!selectedId) return;

    // Cargar opciones de nivel 4 (hijos del nivel 3)
    this.nivel4Options = this.allTypifications.filter(
      t => t.parentTypificationId === selectedId && t.hierarchyLevel === 4
    );
  }

  onSubmit(): void {
    if (this.notesForm.invalid || !this.call) {
      return;
    }

    this.loading = true;

    const request: CompleteCallRequest = {
      disposition: this.notesForm.value.disposition,
      notes: this.notesForm.value.notes,
      scheduleCallback: this.notesForm.value.scheduleCallback || undefined
    };

    // TODO: Aquí podrías también guardar las tipificaciones seleccionadas
    // en un endpoint V2 si es necesario, o incluirlas en el request
    console.log('Tipificaciones seleccionadas:', {
      nivel1: this.notesForm.value.nivel1,
      nivel2: this.notesForm.value.nivel2,
      nivel3: this.notesForm.value.nivel3,
      nivel4: this.notesForm.value.nivel4
    });

    this.callService.completeCall(this.call.callId, request).subscribe({
      next: () => {
        this.loading = false;
        this.notesComplete.emit();
      },
      error: (error) => {
        console.error('Error saving call notes:', error);
        this.loading = false;
      }
    });
  }

  onSkip(): void {
    if (confirm('Skip saving notes? The call will be marked without detailed notes.')) {
      this.notesComplete.emit();
    }
  }
}
