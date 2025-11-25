import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ClientSearchService, DynamicClient } from '../../core/services/client-search.service';
import { AuthService } from '../../core/services/auth.service';
import { TypificationV2Service } from '../../maintenance/services/typification-v2.service';
import { environment } from '../../../environments/environment';
import { AdditionalFieldV2, FieldTypeV2, FieldDataSourceV2, TypificationCatalogV2 } from '../../maintenance/models/typification-v2.model';
import { ChipSelectComponent, ChipOption } from '../../shared/components/chip-select/chip-select.component';

import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { Subject, of } from 'rxjs';

@Component({
  selector: 'app-manual-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    ChipSelectComponent
  ],
  templateUrl: './manual-management.component.html',
  styleUrls: ['./manual-management.component.css']
})
export class ManualManagementComponent implements OnInit {
  // Búsqueda
  searchDocument = signal('');
  searchResults = signal<DynamicClient[]>([]);
  selectedClient = signal<DynamicClient | null>(null);
  searching = signal(false);
  searchError = signal('');

  // Tipificación
  typificationForm!: FormGroup;
  allTypifications: TypificationCatalogV2[] = [];
  nivel1Options: TypificationCatalogV2[] = [];
  nivel2Options: TypificationCatalogV2[] = [];
  nivel3Options: TypificationCatalogV2[] = [];
  nivel4Options: TypificationCatalogV2[] = [];
  loadingTypifications = signal(false);

  // Campos adicionales
  additionalFieldsV2: AdditionalFieldV2[] = [];
  loadingAdditionalFields = signal(false);
  FieldTypeV2 = FieldTypeV2;
  FieldDataSourceV2 = FieldDataSourceV2;

  // Usuario y contexto
  tenantId: number = 0;
  portfolioId: number = 0;
  subPortfolioId: number = 0;

  // Guardado
  saving = signal(false);
  saveSuccess = signal(false);
  saveError = signal('');

  private searchSubject = new Subject<string>();

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private clientSearchService: ClientSearchService,
    private authService: AuthService,
    private typificationV2Service: TypificationV2Service
  ) {}

  ngOnInit(): void {
    this.loadUserContext();
    this.initTypificationForm();
    this.setupSearchAutocomplete();
    this.loadTypifications();
  }

  private loadUserContext(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.tenantId = user.tenantId || 0;
      this.portfolioId = user.portfolioId || 0;
      this.subPortfolioId = user.subPortfolioId || 0;
    }
  }

  private initTypificationForm(): void {
    this.typificationForm = this.fb.group({
      nivel1: [null, Validators.required],
      nivel2: [null],
      nivel3: [null],
      nivel4: [null],
      notes: ['', Validators.required],
      scheduleCallback: [null]
    });

    // Suscribirse a cambios en cascada
    this.typificationForm.get('nivel1')?.valueChanges.subscribe(value => {
      this.onNivel1Change(value);
    });

    this.typificationForm.get('nivel2')?.valueChanges.subscribe(value => {
      this.onNivel2Change(value);
    });

    this.typificationForm.get('nivel3')?.valueChanges.subscribe(value => {
      this.onNivel3Change(value);
    });

    this.typificationForm.get('nivel4')?.valueChanges.subscribe(value => {
      this.onNivel4Change(value);
    });
  }

  private setupSearchAutocomplete(): void {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => {
        if (!term || term.length < 3) {
          return of([]);
        }
        this.searching.set(true);
        this.searchError.set('');
        return this.clientSearchService.searchClientsByDocumento(
          this.tenantId,
          this.portfolioId,
          this.subPortfolioId,
          term,
          10
        ).pipe(
          catchError(err => {
            console.error('Error buscando clientes:', err);
            this.searchError.set('Error al buscar clientes');
            return of([]);
          })
        );
      })
    ).subscribe(results => {
      this.searching.set(false);
      this.searchResults.set(results);
    });
  }

  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchDocument.set(value);
    this.searchSubject.next(value);
  }

  searchByDocument(): void {
    const documento = this.searchDocument();
    if (!documento) {
      this.searchError.set('Ingresa un documento para buscar');
      return;
    }

    this.searching.set(true);
    this.searchError.set('');
    this.selectedClient.set(null);

    this.clientSearchService.findClientByDocumento(
      this.tenantId,
      this.portfolioId,
      this.subPortfolioId,
      documento
    ).subscribe({
      next: (client) => {
        this.searching.set(false);
        this.selectedClient.set(client);
        this.searchResults.set([]);
      },
      error: (err) => {
        this.searching.set(false);
        if (err.status === 404) {
          this.searchError.set('Cliente no encontrado con ese documento');
        } else {
          this.searchError.set('Error al buscar el cliente');
        }
        console.error('Error:', err);
      }
    });
  }

  selectClient(client: DynamicClient): void {
    this.selectedClient.set(client);
    this.searchDocument.set(client.documento);
    this.searchResults.set([]);
  }

  clearSelection(): void {
    this.selectedClient.set(null);
    this.searchDocument.set('');
    this.searchResults.set([]);
    this.searchError.set('');
    this.resetTypificationForm();
  }

  private resetTypificationForm(): void {
    this.typificationForm.reset();
    this.nivel2Options = [];
    this.nivel3Options = [];
    this.nivel4Options = [];
    this.additionalFieldsV2 = [];
  }

  // ========== TIPIFICACIÓN EN CASCADA ==========

  private loadTypifications(): void {
    this.loadingTypifications.set(true);

    this.typificationV2Service.getEffectiveTypifications(
      this.tenantId,
      this.portfolioId,
      this.subPortfolioId
    ).subscribe({
      next: (typifications) => {
        this.allTypifications = typifications;
        // Cargar nivel 1 (tipificaciones raíz)
        this.nivel1Options = typifications.filter(t => !t.idTipificacionPadre && t.nivelJerarquia === 1);
        this.loadingTypifications.set(false);
      },
      error: (err) => {
        console.error('Error cargando tipificaciones:', err);
        this.loadingTypifications.set(false);
      }
    });
  }

  private onNivel1Change(nivel1Id: number | null): void {
    // Resetear niveles inferiores
    this.typificationForm.patchValue({ nivel2: null, nivel3: null, nivel4: null });
    this.nivel2Options = [];
    this.nivel3Options = [];
    this.nivel4Options = [];
    this.additionalFieldsV2 = [];

    if (nivel1Id) {
      this.nivel2Options = this.allTypifications.filter(t => t.idTipificacionPadre === nivel1Id);
      this.loadAdditionalFields(nivel1Id);
    }
  }

  private onNivel2Change(nivel2Id: number | null): void {
    this.typificationForm.patchValue({ nivel3: null, nivel4: null });
    this.nivel3Options = [];
    this.nivel4Options = [];

    if (nivel2Id) {
      this.nivel3Options = this.allTypifications.filter(t => t.idTipificacionPadre === nivel2Id);
      this.loadAdditionalFields(nivel2Id);
    }
  }

  private onNivel3Change(nivel3Id: number | null): void {
    this.typificationForm.patchValue({ nivel4: null });
    this.nivel4Options = [];

    if (nivel3Id) {
      this.nivel4Options = this.allTypifications.filter(t => t.idTipificacionPadre === nivel3Id);
      this.loadAdditionalFields(nivel3Id);
    }
  }

  private onNivel4Change(nivel4Id: number | null): void {
    if (nivel4Id) {
      this.loadAdditionalFields(nivel4Id);
    }
  }

  private loadAdditionalFields(typificationId: number): void {
    this.loadingAdditionalFields.set(true);
    const clientId = this.selectedClient()?.id;

    this.typificationV2Service.getTypificationFieldsWithValues(
      this.tenantId,
      typificationId,
      this.portfolioId,
      clientId
    ).subscribe({
      next: (response) => {
        this.additionalFieldsV2 = response.fields || [];
        // Agregar controles dinámicos al formulario
        this.additionalFieldsV2.forEach(field => {
          if (!this.typificationForm.contains(field.nombreCampo)) {
            this.typificationForm.addControl(
              field.nombreCampo,
              this.fb.control(field.value || '', field.esRequerido ? Validators.required : [])
            );
          } else {
            this.typificationForm.get(field.nombreCampo)?.setValue(field.value || '');
          }
        });
        this.loadingAdditionalFields.set(false);
      },
      error: (err: Error) => {
        console.error('Error cargando campos adicionales:', err);
        this.loadingAdditionalFields.set(false);
      }
    });
  }

  // Convertir tipificaciones a opciones de chips
  getChipOptions(options: TypificationCatalogV2[]): ChipOption[] {
    return options.map(opt => ({
      value: opt.id,
      label: opt.nombre,
      color: opt.colorSugerido || '#6366f1',
      icon: opt.iconoSugerido
    }));
  }

  onNivelChipSelect(nivel: string, value: number | null): void {
    this.typificationForm.patchValue({ [nivel]: value });
  }

  // ========== GUARDAR TIPIFICACIÓN ==========

  saveTypification(): void {
    if (!this.typificationForm.valid) {
      this.saveError.set('Por favor completa todos los campos requeridos');
      return;
    }

    const client = this.selectedClient();
    if (!client) {
      this.saveError.set('No hay cliente seleccionado');
      return;
    }

    this.saving.set(true);
    this.saveError.set('');

    const formValue = this.typificationForm.value;

    // Obtener la tipificación más específica seleccionada
    const tipificacionFinal = formValue.nivel4 || formValue.nivel3 || formValue.nivel2 || formValue.nivel1;

    // Recopilar valores de campos adicionales
    const camposAdicionales: { [key: string]: any } = {};
    this.additionalFieldsV2.forEach(field => {
      camposAdicionales[field.nombreCampo] = formValue[field.nombreCampo];
    });

    const user = this.authService.getCurrentUser();

    const record = {
      idTenant: this.tenantId,
      idCartera: this.portfolioId,
      idSubcartera: this.subPortfolioId,
      documento: client.documento,
      idAgente: user?.id,
      idTipificacionNivel1: formValue.nivel1,
      idTipificacionNivel2: formValue.nivel2,
      idTipificacionNivel3: formValue.nivel3,
      idTipificacionNivel4: formValue.nivel4,
      idTipificacion: tipificacionFinal,
      observaciones: formValue.notes,
      fechaSeguimiento: formValue.scheduleCallback,
      camposAdicionales: JSON.stringify(camposAdicionales),
      fuenteGestion: 'MANUAL'
    };

    this.http.post(`${environment.apiUrl}/v2/management-records`, record).subscribe({
      next: () => {
        this.saving.set(false);
        this.saveSuccess.set(true);
        setTimeout(() => this.saveSuccess.set(false), 3000);
        this.resetTypificationForm();
      },
      error: (err: Error) => {
        this.saving.set(false);
        this.saveError.set('Error al guardar la tipificación');
        console.error('Error:', err);
      }
    });
  }

  // ========== HELPERS PARA MOSTRAR DATOS DEL CLIENTE ==========

  getClientName(client: DynamicClient): string {
    if (client.nombre) return client.nombre;
    const nombres = client.nombres || '';
    const apellidos = client.apellidos || '';
    return `${nombres} ${apellidos}`.trim() || 'Sin nombre';
  }

  getClientPhone(client: DynamicClient): string {
    return client.telefono || client.telefono_1 || client.telefono_2 || 'Sin teléfono';
  }

  formatCurrency(value: number | undefined): string {
    if (value === undefined || value === null) return '-';
    return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(value);
  }

  // Obtener todos los campos dinámicos del cliente para mostrar
  getClientFields(client: DynamicClient): { key: string; value: any }[] {
    const excludedKeys = ['id', 'documento'];
    return Object.entries(client)
      .filter(([key, value]) => !excludedKeys.includes(key) && value !== null && value !== undefined)
      .map(([key, value]) => ({ key: this.formatFieldName(key), value }));
  }

  private formatFieldName(key: string): string {
    return key
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  }
}
