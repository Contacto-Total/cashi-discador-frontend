import { Component, EventEmitter, Output, signal, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { A11yModule } from '@angular/cdk/a11y';
import { ClassificationTypeV2 } from '../../models/typification-v2.model';
import { ClassificationTypeService } from '../../services/classification-type.service';
import { ToastService } from '../../../shared/services/toast.service';
import { TUI, TUI_ANIM } from '../typification-ui';

interface CategoryForm {
  code: string;
  name: string;
  description: string;
}

interface CategoriaExistente {
  code: string;
  name: string;
  count: number;
}

@Component({
  selector: 'app-category-form-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, A11yModule],
  template: `
    <div [class]="ui.fondo" (click)="onCancel()">
      <div [class]="ui.panel + ' max-w-[540px]'" role="dialog" aria-modal="true" aria-labelledby="cf-titulo"
           cdkTrapFocus [cdkTrapFocusAutoCapture]="true"
           (click)="$event.stopPropagation()" (keydown.escape)="onCancel()">

        <!-- Cabecera -->
        <div [class]="ui.cabecera">
          <div class="min-w-0">
            <h2 id="cf-titulo" [class]="ui.titulo">Nueva categoría</h2>
            <p [class]="ui.subtitulo">Un tipo para agrupar tipificaciones, como Resultado de Contacto</p>
          </div>
          <button type="button" (click)="onCancel()" [class]="ui.iconBtn" aria-label="Cerrar">
            <lucide-angular name="x" [size]="17"></lucide-angular>
          </button>
        </div>

        <!-- Cuerpo -->
        <div [class]="ui.cuerpo">
          <p [class]="ui.aviso">
            <lucide-angular name="alert-triangle" [size]="15" class="mt-px shrink-0"></lucide-angular>
            <span>Las categorías son del sistema. Una vez creada no se elimina desde aquí, porque puede estar en uso por varias tipificaciones.</span>
          </p>

          <div class="flex flex-col gap-1.5">
            <label for="cf-codigo" [class]="ui.label">Código <span class="text-[#b91c1c]">*</span></label>
            <input id="cf-codigo" type="text" maxlength="50" placeholder="Ej.: METODO_PAGO"
                   [(ngModel)]="form.code" [attr.aria-invalid]="!!errors()['code']"
                   [class]="ui.input + ' w-full font-mono uppercase ' + (errors()['code'] ? claseInvalido : '')"/>
            @if (errors()['code']) {
              <span [class]="ui.error">{{ errors()['code'] }}</span>
            } @else {
              <span [class]="ui.ayuda">Solo MAYÚSCULAS y guion bajo, sin espacios ni números</span>
            }
          </div>

          <div class="flex flex-col gap-1.5">
            <label for="cf-nombre" [class]="ui.label">Nombre <span class="text-[#b91c1c]">*</span></label>
            <input id="cf-nombre" type="text" maxlength="100" placeholder="Ej.: Método de pago"
                   [(ngModel)]="form.name" [attr.aria-invalid]="!!errors()['name']"
                   [class]="ui.input + ' w-full ' + (errors()['name'] ? claseInvalido : '')"/>
            @if (errors()['name']) {
              <span [class]="ui.error">{{ errors()['name'] }}</span>
            } @else {
              <span [class]="ui.ayuda">Es el nombre que verán los usuarios</span>
            }
          </div>

          <div class="flex flex-col gap-1.5">
            <label for="cf-desc" [class]="ui.label">Descripción (opcional)</label>
            <textarea id="cf-desc" rows="2" placeholder="Para qué sirve y cuándo usarla"
                      [(ngModel)]="form.description" [class]="ui.textarea"></textarea>
          </div>

          <!-- Categorías que maneja esta pantalla, con cuántas tipificaciones tiene cada una -->
          <div class="flex flex-col gap-2">
            <span [class]="ui.label">Categorías que ya existen</span>
            <div class="flex flex-col rounded-[10px] border border-[#e6e9ee] dark:border-slate-700">
              @for (cat of categorias(); track cat.code) {
                <div class="flex min-h-[38px] items-center gap-2.5 border-b border-[#eef1f5] px-3 last:border-b-0 dark:border-slate-800">
                  <span class="min-w-0 flex-1 truncate text-[12.5px] font-bold">{{ cat.name }}</span>
                  <span class="hidden truncate font-mono text-[11px] text-[#5f6c80] dark:text-slate-400 sm:inline">{{ cat.code }}</span>
                  @if (hayTipificaciones) {
                    <span [class]="'w-[104px] shrink-0 text-right text-[11.5px] font-semibold tabular-nums '
                                   + (cat.count > 0 ? 'text-[#334155] dark:text-slate-300' : 'text-[#5f6c80] dark:text-slate-400')">
                      {{ cat.count === 0 ? 'Sin uso aquí' : cat.count === 1 ? '1 tipificación' : cat.count + ' tipificaciones' }}
                    </span>
                  }
                </div>
              }
            </div>
            @if (hayTipificaciones) {
              <span [class]="ui.ayuda">El conteo es de la subcartera que tienes abierta</span>
            }
          </div>
        </div>

        <!-- Pie -->
        <div [class]="ui.pie">
          <button type="button" (click)="onCancel()" [disabled]="saving()" [class]="ui.secundario">Cancelar</button>
          <button type="button" (click)="onSave()" [disabled]="saving()" [class]="ui.primario">
            @if (saving()) {
              <lucide-angular name="loader-2" [size]="15" class="animate-spin"></lucide-angular>
              Creando
            } @else {
              Crear categoría
            }
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [TUI_ANIM]
})
export class CategoryFormDialogComponent implements OnInit, OnChanges {
  /** Tipificaciones de la subcartera abierta (modelo V2), para contar por categoría. */
  @Input() typifications: any[] = [];
  @Output() save = new EventEmitter<string>();
  @Output() cancel = new EventEmitter<void>();

  readonly ui = TUI;
  readonly claseInvalido = 'shadow-[0_0_0_1px_#b91c1c]';

  form: CategoryForm = {
    code: '',
    name: '',
    description: ''
  };

  saving = signal(false);
  errors = signal<Record<string, string>>({});
  categorias = signal<CategoriaExistente[]>([]);

  constructor(
    private classificationTypeService: ClassificationTypeService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.construirCategorias();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['typifications'] && changes['typifications'].currentValue) {
      this.construirCategorias();
    }
  }

  get hayTipificaciones(): boolean {
    return (this.typifications?.length ?? 0) > 0;
  }

  /**
   * Antes esta lista leía el modelo antiguo (`classificationType`, `code`, `name` y
   * un enum de seis tipos que esta pantalla no usa): mostraba categorías que no
   * existen aquí y siempre en cero. Ahora cuenta sobre el modelo V2.
   */
  construirCategorias() {
    const conteo = new Map<string, number>();
    (this.typifications || []).forEach(t => {
      const tipo = t?.tipoClasificacion;
      if (tipo) conteo.set(tipo, (conteo.get(tipo) ?? 0) + 1);
    });

    const fijas = Object.values(ClassificationTypeV2) as string[];
    // Primero las cuatro fijas; después cualquier otra que traigan las tipificaciones
    const codigos = [...fijas, ...Array.from(conteo.keys()).filter(c => !fijas.includes(c))];

    this.categorias.set(codigos.map(code => ({
      code,
      name: this.getTypeLabel(code),
      count: conteo.get(code) ?? 0
    })));
  }

  getTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      [ClassificationTypeV2.RESULTADO_CONTACTO]: 'Resultado de Contacto',
      [ClassificationTypeV2.TIPO_GESTION]: 'Tipo de Gestión',
      [ClassificationTypeV2.MODALIDAD_PAGO]: 'Modalidad de Pago',
      [ClassificationTypeV2.TIPO_FRACCIONAMIENTO]: 'Tipo de Fraccionamiento'
    };
    return labels[type] ?? type;
  }

  validate(): boolean {
    const newErrors: Record<string, string> = {};
    // El campo se muestra en mayúsculas por estilo: se valida y se guarda en mayúsculas
    const code = this.form.code.trim().toUpperCase();

    if (!code) {
      newErrors['code'] = 'El código es requerido';
    } else if (!/^[A-Z_]+$/.test(code)) {
      newErrors['code'] = 'Usa solo letras y guion bajo: sin espacios, números ni símbolos';
    }

    if (!this.form.name.trim()) {
      newErrors['name'] = 'El nombre es requerido';
    }

    this.errors.set(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  onSave() {
    if (!this.validate()) return;

    this.saving.set(true);

    // Crear el tipo de clasificación en el backend
    const newType = {
      code: this.form.code.trim().toUpperCase(),
      name: this.form.name.trim(),
      description: this.form.description.trim() || undefined,
      isActive: true,
      isSystem: false,
      displayOrder: 0
    };

    this.classificationTypeService.createType(newType).subscribe({
      next: (created) => {
        this.saving.set(false);
        this.save.emit(created.code);
      },
      error: (error) => {
        console.error('Error creando tipo de clasificación:', error);
        this.saving.set(false);

        // Mostrar error al usuario
        const detalle = typeof error?.error === 'string' ? error.error : (error?.error?.message || error?.error?.error);
        this.toast.error(detalle ? `No se pudo crear la categoría: ${detalle}` : 'No se pudo crear la categoría');
      }
    });
  }

  onCancel() {
    if (this.saving()) return;
    this.cancel.emit();
  }
}
