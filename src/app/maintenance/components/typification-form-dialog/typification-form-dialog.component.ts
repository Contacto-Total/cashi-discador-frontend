import { Component, EventEmitter, Input, Output, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { A11yModule } from '@angular/cdk/a11y';
import { TypificationV2Service } from '../../services/typification-v2.service';
import { ToastService } from '../../../shared/services/toast.service';
import {
  TypificationCatalogV2,
  ClassificationTypeV2,
  CreateTypificationCommandV2,
  UpdateTypificationCommandV2,
  AdditionalFieldV2
} from '../../models/typification-v2.model';
import { FieldConfigDialogComponent } from '../field-config-dialog/field-config-dialog.component';
import { MetadataSchema, FieldType } from '../../models/field-config.model';
import { TUI, TUI_ANIM, tuiSwitch, tuiPerilla } from '../typification-ui';

interface ClassificationFormV2 {
  codigo: string;
  nombre: string;
  tipoClasificacion: ClassificationTypeV2 | '';
  descripcion: string;
  ordenVisualizacion: number;
  iconoSugerido: string;
  colorSugerido: string;
  estaActiva: boolean;
  metadataSchema?: MetadataSchema | null;
}

@Component({
  selector: 'app-typification-form-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, A11yModule, FieldConfigDialogComponent],
  template: `
    <div [class]="ui.fondo" (click)="onCancel()">
      <div [class]="ui.panel + ' max-w-[720px]'" role="dialog" aria-modal="true" aria-labelledby="tf-titulo"
           cdkTrapFocus [cdkTrapFocusAutoCapture]="true"
           (click)="$event.stopPropagation()" (keydown.escape)="onCancel()">

        <!-- Cabecera -->
        <div [class]="ui.cabecera">
          <div class="min-w-0">
            <h2 id="tf-titulo" [class]="ui.titulo">{{ getDialogTitle() }}</h2>
            <p [class]="ui.subtitulo">Catálogo global: lo que guardes aquí vale para todas las carteras</p>
          </div>
          <button type="button" (click)="onCancel()" [class]="ui.iconBtn" aria-label="Cerrar">
            <lucide-angular name="x" [size]="17"></lucide-angular>
          </button>
        </div>

        <!-- Cuerpo -->
        <div [class]="ui.cuerpo">

          @if (parentClassification) {
            <div [class]="ui.caja + ' flex items-center gap-[9px] px-3 py-[9px] text-[12.5px] text-[#334155] dark:text-slate-300'">
              <lucide-angular name="git-branch" [size]="15" class="shrink-0 text-[#5f6c80]"></lucide-angular>
              <span>
                Hija de <b class="font-bold text-[#0f172a] dark:text-slate-100">{{ parentClassification.nombre }}</b>
                <span class="font-mono text-[11px] text-[#5f6c80] dark:text-slate-400">{{ parentClassification.codigo }}</span>
                · quedará en el nivel {{ parentClassification.nivelJerarquia + 1 }}
              </span>
            </div>
          }

          <!-- Código y nombre -->
          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div class="flex flex-col gap-1.5">
              <label for="tf-codigo" [class]="ui.label">Código <span class="text-[#b91c1c]">*</span></label>
              <input id="tf-codigo" type="text" maxlength="20" placeholder="Ej.: PP, CPC"
                     [(ngModel)]="form.codigo" [disabled]="isEditMode"
                     [attr.aria-invalid]="!!errors()['codigo']"
                     [class]="ui.input + ' w-full font-mono ' + (errors()['codigo'] ? claseInvalido : '')"/>
              @if (errors()['codigo']) {
                <span [class]="ui.error">{{ errors()['codigo'] }}</span>
              } @else {
                <span [class]="ui.ayuda">{{ isEditMode ? 'El código no se puede cambiar' : 'Único, hasta 20 caracteres. Después no se puede cambiar.' }}</span>
              }
            </div>

            <div class="flex flex-col gap-1.5">
              <label for="tf-nombre" [class]="ui.label">Nombre <span class="text-[#b91c1c]">*</span></label>
              <input id="tf-nombre" type="text" maxlength="255" placeholder="Ej.: Promesa de pago"
                     [(ngModel)]="form.nombre"
                     [attr.aria-invalid]="!!errors()['nombre']"
                     [class]="ui.input + ' w-full ' + (errors()['nombre'] ? claseInvalido : '')"/>
              @if (errors()['nombre']) {
                <span [class]="ui.error">{{ errors()['nombre'] }}</span>
              }
            </div>
          </div>

          <!-- Tipo y orden -->
          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div class="flex flex-col gap-1.5">
              <label for="tf-tipo" [class]="ui.label">Tipo <span class="text-[#b91c1c]">*</span></label>
              <select id="tf-tipo" [(ngModel)]="form.tipoClasificacion" [disabled]="isEditMode || !!defaultType"
                      [attr.aria-invalid]="!!errors()['tipoClasificacion']"
                      [class]="ui.input + ' w-full ' + (errors()['tipoClasificacion'] ? claseInvalido : '')">
                <option value="">Seleccionar</option>
                <option [value]="ClassificationTypeV2.RESULTADO_CONTACTO">Resultado de Contacto</option>
                <option [value]="ClassificationTypeV2.TIPO_GESTION">Tipo de Gestión</option>
                <option [value]="ClassificationTypeV2.MODALIDAD_PAGO">Modalidad de Pago</option>
                <option [value]="ClassificationTypeV2.TIPO_FRACCIONAMIENTO">Tipo de Fraccionamiento</option>
              </select>
              @if (errors()['tipoClasificacion']) {
                <span [class]="ui.error">{{ errors()['tipoClasificacion'] }}</span>
              }
            </div>

            <div class="flex flex-col gap-1.5">
              <label for="tf-orden" [class]="ui.label">Orden</label>
              <input id="tf-orden" type="number" min="0" step="10" [(ngModel)]="form.ordenVisualizacion"
                     [class]="ui.input + ' w-full tabular-nums'"/>
              <span [class]="ui.ayuda">El número menor va primero. Con múltiplos de 10 queda sitio para intercalar.</span>
            </div>
          </div>

          <!-- Descripción -->
          <div class="flex flex-col gap-1.5">
            <label for="tf-desc" [class]="ui.label">Descripción (opcional)</label>
            <textarea id="tf-desc" rows="2" placeholder="Cuándo debe usarla el asesor"
                      [(ngModel)]="form.descripcion" [class]="ui.textarea"></textarea>
          </div>

          <!-- Color e icono -->
          <div class="grid grid-cols-1 gap-4 md:grid-cols-[252px_minmax(0,1fr)]">
            <div class="flex flex-col gap-2">
              <span [class]="ui.label">Color</span>
              <div class="grid grid-cols-8 gap-1.5" role="group" aria-label="Color de la tipificación">
                @for (color of presetColors; track color.hex) {
                  <button type="button" (click)="form.colorSugerido = color.hex"
                          [attr.aria-pressed]="mismoColor(color.hex)" [attr.aria-label]="color.name" [title]="color.name"
                          [class]="'aspect-square w-full rounded-[7px] border-2 border-white transition-shadow duration-150 dark:border-slate-900 '
                                   + (mismoColor(color.hex)
                                      ? 'shadow-[0_0_0_2px_#0f172a] dark:shadow-[0_0_0_2px_#ffffff]'
                                      : 'shadow-[0_0_0_2px_transparent]')"
                          [style.background-color]="color.hex"></button>
                }
              </div>
              <label class="flex items-center gap-2 text-[12px] font-semibold text-[#334155] dark:text-slate-300">
                <input type="color" [(ngModel)]="form.colorSugerido" aria-label="Otro color"
                       class="h-[26px] w-[34px] cursor-pointer rounded-[6px] border border-[#d5dbe3] bg-white p-px dark:border-slate-700 dark:bg-slate-900"/>
                Otro color
                <span class="font-mono text-[11px] font-medium text-[#5f6c80] dark:text-slate-400">{{ form.colorSugerido }}</span>
              </label>
            </div>

            <div class="flex min-w-0 flex-col gap-2">
              <span [class]="ui.label">Icono (opcional)</span>
              <div [class]="ui.caja + ' grid max-h-[116px] grid-cols-10 gap-1 overflow-y-auto p-1.5 sm:grid-cols-12'"
                   role="group" aria-label="Icono de la tipificación">
                @for (icon of commonIcons; track icon.name) {
                  <button type="button" (click)="form.iconoSugerido = icon.name"
                          [attr.aria-pressed]="form.iconoSugerido === icon.name" [attr.aria-label]="icon.label" [title]="icon.label"
                          [class]="'inline-flex aspect-square w-full items-center justify-center rounded-[7px] border transition-colors duration-150 '
                                   + (form.iconoSugerido === icon.name
                                      ? 'border-[#2563eb] bg-[#e8effd] text-[#1d4ed8] dark:border-blue-500 dark:bg-blue-500/20 dark:text-blue-300'
                                      : 'border-transparent text-[#334155] hover:bg-white dark:text-slate-300 dark:hover:bg-slate-700')">
                    <lucide-angular [name]="icon.name" [size]="15"></lucide-angular>
                  </button>
                }
              </div>
              @if (form.iconoSugerido) {
                <button type="button" (click)="form.iconoSugerido = ''" [class]="ui.enlace + ' self-start'">Quitar icono</button>
              }
            </div>
          </div>

          <!-- Vista previa: la fila tal como saldrá en la lista -->
          <div [class]="ui.caja + ' flex items-center gap-3 px-3 py-2.5'">
            <span [class]="ui.label + ' shrink-0'">Así se verá</span>
            <span class="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-[7px] text-[10px] font-extrabold text-white"
                  [style.background-color]="form.colorSugerido" aria-hidden="true">
              @if (form.iconoSugerido) {
                <lucide-angular [name]="form.iconoSugerido" [size]="16"></lucide-angular>
              } @else {
                {{ (form.codigo || 'NA').substring(0, 2).toUpperCase() }}
              }
            </span>
            <span class="min-w-0 truncate text-[12.5px] font-bold tracking-[-0.01em]">{{ form.nombre || 'Nombre de la tipificación' }}</span>
            <span class="shrink-0 font-mono text-[11px] text-[#5f6c80] dark:text-slate-400">{{ form.codigo }}</span>
          </div>

          @if (isEditMode) {
            <div class="flex items-center justify-between gap-3 rounded-[10px] border border-[#e6e9ee] px-3 py-2.5 dark:border-slate-700">
              <div class="flex flex-col gap-0.5">
                <span class="text-[12.5px] font-bold">Tipificación activa</span>
                <span class="text-[11.5px] text-[#5f6c80] dark:text-slate-400">Apágala para dejar de usarla temporalmente, sin borrarla</span>
              </div>
              <button type="button" role="switch" (click)="form.estaActiva = !form.estaActiva"
                      [attr.aria-checked]="form.estaActiva" aria-label="Tipificación activa" [class]="sw(form.estaActiva)">
                <span [class]="perilla(form.estaActiva)"></span>
              </button>
            </div>
          } @else {
            <p class="flex items-start gap-2 text-[12px] leading-[1.5] text-[#5f6c80] dark:text-slate-400">
              <lucide-angular name="info" [size]="14" class="mt-0.5 shrink-0"></lucide-angular>
              <span>
                Al crearla queda habilitada en
                <b class="font-bold text-[#334155] dark:text-slate-200">{{ subPortfolioName || 'esta subcartera' }}</b>.
                En las demás carteras hay que habilitarla desde su propia lista.
              </span>
            </p>
          }
        </div>

        <!-- Pie -->
        <div class="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-[#e6e9ee] px-[18px] py-3 dark:border-slate-700">
          <button type="button" (click)="openFieldConfig()" [class]="ui.secundario">
            <lucide-angular name="sliders" [size]="15"></lucide-angular>
            Campos de la tipificación
            @if (totalCampos > 0) {
              <span [class]="ui.chipGris + ' tabular-nums'">{{ totalCampos }}</span>
            }
          </button>
          <div class="flex gap-2">
            <button type="button" (click)="onCancel()" [disabled]="saving()" [class]="ui.secundario">Cancelar</button>
            <button type="button" (click)="onSave()" [disabled]="saving()" [class]="ui.primario">
              @if (saving()) {
                <lucide-angular name="loader-2" [size]="15" class="animate-spin"></lucide-angular>
                Guardando
              } @else {
                {{ isEditMode ? 'Guardar cambios' : 'Crear tipificación' }}
              }
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Campos de la tipificación -->
    @if (showFieldConfig()) {
      <app-field-config-dialog
        [isOpen]="showFieldConfig()"
        [existingSchema]="form.metadataSchema || null"
        [typificationName]="form.nombre"
        (save)="onFieldConfigSave($event)"
        (cancel)="onFieldConfigCancel()"
      />
    }
  `,
  styles: [TUI_ANIM]
})
export class TypificationFormDialogComponent implements OnInit {
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() typification?: TypificationCatalogV2;
  @Input() parentClassification?: TypificationCatalogV2;
  @Input() defaultType?: ClassificationTypeV2;
  @Input() tenantId?: number;
  @Input() portfolioId?: number;
  /**
   * Subcartera donde se habilita la tipificación recién creada. La lista de
   * mantenimiento se arma por subcartera: si se habilita solo a nivel cartera, la
   * tipificación queda creada pero nunca aparece.
   */
  @Input() subPortfolioId?: number;
  @Input() subPortfolioName?: string;
  @Output() save = new EventEmitter<TypificationCatalogV2>();
  @Output() cancel = new EventEmitter<void>();

  readonly ui = TUI;
  readonly sw = tuiSwitch;
  readonly perilla = tuiPerilla;
  // Con sombra y no con borde: el campo ya trae su color de borde y dos utilidades
  // de Tailwind sobre la misma propiedad no se resuelven por orden de escritura.
  readonly claseInvalido = 'shadow-[0_0_0_1px_#b91c1c]';

  ClassificationTypeV2 = ClassificationTypeV2;
  isEditMode = false;

  form: ClassificationFormV2 = {
    codigo: '',
    nombre: '',
    tipoClasificacion: '',
    descripcion: '',
    ordenVisualizacion: 0,
    iconoSugerido: '',
    colorSugerido: '#3B82F6',
    estaActiva: true
  };

  showFieldConfig = signal(false);

  /** Campos tal como estaban al abrir, para no perder lo que el editor no muestra. */
  private camposOriginales: AdditionalFieldV2[] = [];
  /** El usuario abrió el editor de campos y guardó: recién ahí se reenvían al backend. */
  private camposEditados = false;

  presetColors = [
    { hex: '#3B82F6', name: 'Azul' },
    { hex: '#10B981', name: 'Verde' },
    { hex: '#EF4444', name: 'Rojo' },
    { hex: '#F59E0B', name: 'Naranja' },
    { hex: '#8B5CF6', name: 'Violeta' },
    { hex: '#EC4899', name: 'Rosa' },
    { hex: '#6366F1', name: 'Índigo' },
    { hex: '#14B8A6', name: 'Turquesa' },
    { hex: '#F97316', name: 'Naranja Oscuro' },
    { hex: '#06B6D4', name: 'Cyan' },
    { hex: '#84CC16', name: 'Lima' },
    { hex: '#A855F7', name: 'Púrpura' },
    { hex: '#64748B', name: 'Gris' },
    { hex: '#0EA5E9', name: 'Azul Cielo' },
    { hex: '#22C55E', name: 'Verde Claro' },
    { hex: '#DC2626', name: 'Rojo Oscuro' }
  ];

  commonIcons = [
    { name: 'phone', label: 'Teléfono' },
    { name: 'phone-call', label: 'Llamada' },
    { name: 'phone-incoming', label: 'Llamada Entrante' },
    { name: 'phone-outgoing', label: 'Llamada Saliente' },
    { name: 'phone-missed', label: 'Llamada Perdida' },
    { name: 'check-circle', label: 'Éxito' },
    { name: 'x-circle', label: 'Error' },
    { name: 'alert-circle', label: 'Alerta' },
    { name: 'alert-triangle', label: 'Advertencia' },
    { name: 'info', label: 'Información' },
    { name: 'user', label: 'Usuario' },
    { name: 'users', label: 'Usuarios' },
    { name: 'user-check', label: 'Usuario Verificado' },
    { name: 'user-x', label: 'Usuario Rechazado' },
    { name: 'credit-card', label: 'Tarjeta' },
    { name: 'dollar-sign', label: 'Dinero' },
    { name: 'banknote', label: 'Billete' },
    { name: 'coins', label: 'Monedas' },
    { name: 'calendar', label: 'Calendario' },
    { name: 'calendar-check', label: 'Fecha Confirmada' },
    { name: 'calendar-x', label: 'Fecha Cancelada' },
    { name: 'clock', label: 'Reloj' },
    { name: 'timer', label: 'Temporizador' },
    { name: 'mail', label: 'Correo' },
    { name: 'message-square', label: 'Mensaje' },
    { name: 'message-circle', label: 'Chat' },
    { name: 'file-text', label: 'Documento' },
    { name: 'file-check', label: 'Documento Aprobado' },
    { name: 'file-x', label: 'Documento Rechazado' },
    { name: 'building', label: 'Edificio' },
    { name: 'home', label: 'Casa' },
    { name: 'wallet', label: 'Billetera' },
    { name: 'briefcase', label: 'Maletín' },
    { name: 'trending-up', label: 'Tendencia Positiva' },
    { name: 'trending-down', label: 'Tendencia Negativa' },
    { name: 'thumbs-up', label: 'Me gusta' },
    { name: 'thumbs-down', label: 'No me gusta' },
    { name: 'star', label: 'Estrella' },
    { name: 'heart', label: 'Corazón' },
    { name: 'bell', label: 'Campana' },
    { name: 'bell-off', label: 'Silenciar' },
    { name: 'settings', label: 'Configuración' },
    { name: 'shield', label: 'Seguridad' },
    { name: 'shield-check', label: 'Verificado' },
    { name: 'lock', label: 'Bloqueado' },
    { name: 'unlock', label: 'Desbloqueado' },
    { name: 'map-pin', label: 'Ubicación' },
    { name: 'navigation', label: 'Navegación' },
    { name: 'send', label: 'Enviar' },
    { name: 'download', label: 'Descargar' },
    { name: 'upload', label: 'Subir' },
    { name: 'plus-circle', label: 'Agregar' },
    { name: 'minus-circle', label: 'Quitar' },
    { name: 'edit', label: 'Editar' },
    { name: 'trash', label: 'Eliminar' },
    { name: 'archive', label: 'Archivar' },
    { name: 'bookmark', label: 'Marcador' },
    { name: 'tag', label: 'Etiqueta' },
    { name: 'flag', label: 'Bandera' },
    { name: 'zap', label: 'Rayo' },
    { name: 'target', label: 'Objetivo' }
  ];

  saving = signal(false);
  errors = signal<Record<string, string>>({});

  constructor(
    private classificationService: TypificationV2Service,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.isEditMode = this.mode === 'edit';

    if (this.defaultType) {
      this.form.tipoClasificacion = this.defaultType;
    } else if (this.parentClassification) {
      // Una hija casi siempre es del mismo tipo que su padre: se propone, se puede cambiar
      this.form.tipoClasificacion = this.parentClassification.tipoClasificacion;
    }

    if (this.isEditMode && this.typification) {
      this.form = {
        codigo: this.typification.codigo,
        nombre: this.typification.nombre,
        tipoClasificacion: this.typification.tipoClasificacion,
        descripcion: this.typification.descripcion || '',
        ordenVisualizacion: this.typification.ordenVisualizacion || 0,
        iconoSugerido: this.typification.iconoSugerido || '',
        colorSugerido: this.typification.colorSugerido || '#3B82F6',
        estaActiva: this.typification.estaActiva
      };

      // Cargar campos adicionales existentes
      this.loadExistingFields();
    }
  }

  get totalCampos(): number {
    return this.form.metadataSchema?.fields?.length ?? 0;
  }

  /** El selector nativo devuelve el color en minúsculas y los predefinidos van en mayúsculas. */
  mismoColor(hex: string): boolean {
    return (this.form.colorSugerido || '').toLowerCase() === hex.toLowerCase();
  }

  /**
   * Carga los campos adicionales existentes de la tipificación
   */
  private loadExistingFields() {
    if (!this.typification?.id) return;

    this.classificationService.getAdditionalFields(this.typification.id).subscribe({
      next: (fields) => {
        this.camposOriginales = fields || [];
        if (fields && fields.length > 0) {
          this.form.metadataSchema = this.convertAdditionalFieldsToMetadata(fields);
        }
      },
      error: (error) => {
        console.warn('No se pudieron cargar campos existentes:', error);
      }
    });
  }

  /**
   * Convierte AdditionalFieldV2[] a MetadataSchema para el editor
   */
  private convertAdditionalFieldsToMetadata(fields: AdditionalFieldV2[]): MetadataSchema {
    return {
      fields: fields.map(field => ({
        id: field.nombreCampo,
        label: field.labelCampo,
        type: this.mapFieldTypeV2ToFieldType(field.tipoCampo),
        required: field.esRequerido,
        displayOrder: field.ordenVisualizacion,
        min: field.valorMinimo,
        max: field.valorMaximo,
        maxLength: field.longitudMaxima
      }))
    };
  }

  /**
   * Mapea tipo del backend a FieldType para el editor
   */
  private mapFieldTypeV2ToFieldType(type: string): FieldType {
    const typeStr = String(type).toUpperCase();
    const typeMap: Record<string, FieldType> = {
      'TEXT': 'text',
      'TEXTAREA': 'textarea',
      'NUMBER': 'number',
      'DECIMAL': 'decimal',
      'CURRENCY': 'currency',
      'DATE': 'date',
      'TIME': 'time',
      'DATETIME': 'datetime',
      'CHECKBOX': 'checkbox',
      'SELECT': 'select',
      'CHIP_SELECT': 'select',
      'MULTISELECT': 'multiselect',
      'EMAIL': 'email',
      'PHONE': 'phone',
      'URL': 'url',
      'TABLE': 'table',
      'PAYMENT_SCHEDULE': 'payment_schedule'
    };
    return typeMap[typeStr] || 'text';
  }

  validate(): boolean {
    const newErrors: Record<string, string> = {};

    if (!this.form.codigo.trim()) {
      newErrors['codigo'] = 'El código es requerido';
    }

    if (!this.form.nombre.trim()) {
      newErrors['nombre'] = 'El nombre es requerido';
    }

    if (!this.form.tipoClasificacion) {
      newErrors['tipoClasificacion'] = 'El tipo de clasificación es requerido';
    }

    this.errors.set(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  onSave() {
    if (!this.validate()) return;

    this.saving.set(true);

    if (this.isEditMode && this.typification) {
      this.updateTypification();
    } else {
      this.createTypification();
    }
  }

  createTypification() {
    const command: CreateTypificationCommandV2 = {
      codigo: this.form.codigo.trim(),
      nombre: this.form.nombre.trim(),
      tipoClasificacion: this.form.tipoClasificacion as ClassificationTypeV2,
      parentTypificationId: this.parentClassification ? this.parentClassification.id : undefined,
      descripcion: this.form.descripcion.trim() || undefined,
      ordenVisualizacion: this.form.ordenVisualizacion,
      iconoSugerido: this.form.iconoSugerido.trim() || undefined,
      colorSugerido: this.form.colorSugerido || undefined
    };

    this.classificationService.createTypification(command).subscribe({
      next: (created: TypificationCatalogV2) => {
        // Antes los campos configurados al crear se descartaban: solo se guardaban al editar
        const terminar = () => this.guardarCamposSiCambiaron(created.id, () => {
          this.saving.set(false);
          this.save.emit(created);
        });

        // Auto-habilitar en la subcartera desde la que se creó
        if (this.tenantId) {
          this.classificationService.enableClassification(
            this.tenantId,
            created.id,
            this.portfolioId,
            this.subPortfolioId
          ).subscribe({
            next: () => terminar(),
            error: (error: any) => {
              // Aunque falle el enable, la clasificación se creó exitosamente
              console.error('Error al auto-habilitar (pero la clasificación se creó):', error);
              this.toast.warning('La tipificación se creó, pero no se pudo habilitar en esta subcartera');
              terminar();
            }
          });
        } else {
          terminar();
        }
      },
      error: (error: any) => {
        console.error('Error al crear tipificación:', error);
        this.saving.set(false);
        this.toast.error('Error al crear la tipificación. Verifica que el código no esté duplicado.');
      }
    });
  }

  updateTypification() {
    if (!this.typification) return;

    const command: UpdateTypificationCommandV2 = {
      nombre: this.form.nombre.trim(),
      descripcion: this.form.descripcion.trim() || undefined,
      ordenVisualizacion: this.form.ordenVisualizacion,
      iconoSugerido: this.form.iconoSugerido.trim() || undefined,
      colorSugerido: this.form.colorSugerido || undefined,
      estaActiva: this.form.estaActiva
    };

    // Actualizar tipificación
    this.classificationService.updateTypification(this.typification.id, command).subscribe({
      next: (updated: TypificationCatalogV2) => {
        this.guardarCamposSiCambiaron(this.typification!.id, () => {
          this.saving.set(false);
          this.save.emit(updated);
        });
      },
      error: (error: any) => {
        console.error('Error al actualizar tipificación:', error);
        this.saving.set(false);
        this.toast.error('Error al actualizar la tipificación');
      }
    });
  }

  /**
   * Reenvía los campos solo si el usuario los tocó en esta sesión. Antes se
   * reenviaban en cada guardado del catálogo, y como el backend reemplaza la
   * fuente del valor de cada campo con lo que llega, bastaba cambiar el nombre o
   * el color de la tipificación para borrarla.
   */
  private guardarCamposSiCambiaron(typificationId: number, alTerminar: () => void) {
    if (!this.camposEditados) {
      alTerminar();
      return;
    }

    const additionalFields = this.convertMetadataToAdditionalFields(this.form.metadataSchema ?? { fields: [] });
    this.classificationService.saveAdditionalFields(typificationId, additionalFields).subscribe({
      next: () => alTerminar(),
      error: (error: any) => {
        // La tipificación se guardó pero los campos fallaron
        console.error('Error al guardar campos adicionales:', error);
        this.toast.warning('La tipificación se guardó, pero sus campos no');
        alTerminar();
      }
    });
  }

  /**
   * Convierte MetadataSchema a AdditionalFieldV2[] para el backend
   */
  private convertMetadataToAdditionalFields(schema: MetadataSchema): AdditionalFieldV2[] {
    return schema.fields.map((field, index) => {
      // El editor no maneja la fuente del valor: se arrastra la que el campo ya tenía
      const original = this.camposOriginales.find(c => c.nombreCampo === field.id);
      return {
        id: 0, // El backend asignará el ID
        nombreCampo: field.id,
        tipoCampo: this.mapFieldType(field.type),
        labelCampo: field.label,
        esRequerido: field.required || false,
        ordenVisualizacion: field.displayOrder ?? index * 10,
        valorMinimo: field.min,
        valorMaximo: field.max,
        longitudMaxima: field.maxLength,
        fuenteValor: original?.fuenteValor,
        campoTablaDinamica: original?.campoTablaDinamica
      };
    });
  }

  /**
   * Mapea tipos de FieldConfig a string para el backend
   */
  private mapFieldType(type: FieldType): string {
    // El backend usa strings en mayúsculas
    return type.toUpperCase().replace('_', '_');
  }

  onCancel() {
    if (this.saving()) return;
    this.cancel.emit();
  }

  getDialogTitle(): string {
    if (this.isEditMode) {
      return 'Editar tipificación';
    }
    return this.parentClassification ? 'Nueva tipificación hija' : 'Nueva tipificación';
  }

  openFieldConfig() {
    this.showFieldConfig.set(true);
  }

  onFieldConfigSave(schema: MetadataSchema) {
    this.form.metadataSchema = schema;
    this.camposEditados = true;
    this.showFieldConfig.set(false);
  }

  onFieldConfigCancel() {
    this.showFieldConfig.set(false);
  }
}
