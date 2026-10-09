import { Component, effect, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { A11yModule } from '@angular/cdk/a11y';
import {
  FieldConfig,
  FieldType,
  MetadataSchema,
  SelectOption,
  TableColumn
} from '../../models/field-config.model';
import { ApiSystemConfigService, FieldTypeResource } from '../../../collection-management/services/api-system-config.service';
import { DynamicFieldRendererComponent } from '../../../collection-management/components/dynamic-field-renderer/dynamic-field-renderer.component';
import { TUI, TUI_ANIM } from '../typification-ui';

@Component({
  selector: 'app-field-config-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, A11yModule, DynamicFieldRendererComponent],
  template: `
    @if (isOpen()) {
      <!-- Sin cierre al hacer clic fuera: aquí hay mucho escrito a mano y se perdería -->
      <div [class]="ui.fondo">
        <div [class]="ui.panel + ' max-w-[780px]'" role="dialog" aria-modal="true" aria-labelledby="fc-titulo"
             cdkTrapFocus [cdkTrapFocusAutoCapture]="true" (keydown.escape)="handleCancel()">

          <!-- Cabecera -->
          <div [class]="ui.cabecera">
            <div class="min-w-0">
              <h2 id="fc-titulo" [class]="ui.titulo">Campos de la tipificación</h2>
              <p [class]="ui.subtitulo">
                Datos que el asesor completa al elegir
                <b class="font-bold text-[#334155] dark:text-slate-200">{{ typificationName() || 'esta tipificación' }}</b>
              </p>
            </div>
            <button type="button" (click)="handleCancel()" [class]="ui.iconBtn" aria-label="Cerrar">
              <lucide-angular name="x" [size]="17"></lucide-angular>
            </button>
          </div>

          <!-- Cuerpo -->
          <div [class]="ui.cuerpo + ' !gap-2.5'">
            <!-- Se sigue cada campo por el objeto y no por su id: el id es editable, y al
                 seguirlo por id cada tecla recreaba la tarjeta y el campo perdía el foco -->
            @for (field of fields(); track field; let idx = $index) {
              <div [class]="ui.tarjeta + ' tui-entra flex flex-col gap-3 p-3'">
                <div class="flex items-center justify-between gap-2.5">
                  <span class="text-[10.5px] font-extrabold uppercase tracking-[0.07em] text-[#5f6c80] dark:text-slate-400">Campo {{ idx + 1 }}</span>
                  <button type="button" (click)="removeField(idx)" [class]="ui.iconBtnPeligro"
                          [attr.aria-label]="'Eliminar el campo ' + field.label" title="Eliminar campo">
                    <lucide-angular name="trash-2" [size]="15"></lucide-angular>
                  </button>
                </div>

                <div class="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                  <div class="flex flex-col gap-1.5">
                    <label [attr.for]="'fc-et-' + idx" [class]="ui.label">Etiqueta</label>
                    <input [id]="'fc-et-' + idx" type="text" [(ngModel)]="field.label" placeholder="Cronograma de pago"
                           [class]="ui.input + ' w-full'"/>
                  </div>
                  <div class="flex flex-col gap-1.5">
                    <label [attr.for]="'fc-id-' + idx" [class]="ui.label">ID del campo</label>
                    <input [id]="'fc-id-' + idx" type="text" [(ngModel)]="field.id" placeholder="payment_schedule"
                           [class]="ui.input + ' w-full font-mono'"/>
                  </div>
                  <div class="flex flex-col gap-1.5">
                    <label [attr.for]="'fc-tipo-' + idx" [class]="ui.label">Tipo</label>
                    <select [id]="'fc-tipo-' + idx" [(ngModel)]="field.type" (ngModelChange)="onFieldTypeChange(field)"
                            [class]="ui.input + ' w-full'">
                      @for (type of fieldTypes(); track type.id) {
                        <option [value]="type.typeCode">{{ type.typeName }}</option>
                      }
                    </select>
                  </div>
                </div>

                <div class="grid grid-cols-1 items-end gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
                  <div class="flex flex-col gap-1.5">
                    <label [attr.for]="'fc-ay-' + idx" [class]="ui.label">Texto de ayuda (opcional)</label>
                    <input [id]="'fc-ay-' + idx" type="text" [(ngModel)]="field.helpText" placeholder="Instrucciones para el asesor"
                           [class]="ui.input + ' w-full'"/>
                  </div>
                  <label class="flex h-[38px] cursor-pointer items-center gap-2 text-[12.5px] font-semibold text-[#334155] dark:text-slate-300">
                    <input type="checkbox" [(ngModel)]="field.required" class="h-[15px] w-[15px] accent-[#2563eb]"/>
                    Obligatorio
                  </label>
                </div>

                <!-- Columnas: solo para campos de tipo tabla -->
                @if (field.type === 'table') {
                  <div class="flex flex-col gap-2">
                    <div class="flex items-center justify-between gap-2.5">
                      <span [class]="ui.label">Columnas de la tabla</span>
                      <button type="button" (click)="addColumn(field)" [class]="ui.textoBtn">
                        <lucide-angular name="plus" [size]="13"></lucide-angular>
                        Agregar columna
                      </button>
                    </div>
                    @for (column of field.columns; track column; let colIdx = $index) {
                      <div class="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,150px)_28px] items-center gap-1.5">
                        <input type="text" [(ngModel)]="column.label" placeholder="Etiqueta"
                               [attr.aria-label]="'Etiqueta de la columna ' + (colIdx + 1)"
                               [class]="ui.inputSm + ' w-full'"/>
                        <input type="text" [(ngModel)]="column.id" placeholder="ID"
                               [attr.aria-label]="'ID de la columna ' + (colIdx + 1)"
                               [class]="ui.inputSm + ' w-full font-mono'"/>
                        <select [(ngModel)]="column.type" [attr.aria-label]="'Tipo de la columna ' + (colIdx + 1)"
                                [class]="ui.inputSm + ' w-full'">
                          @for (colType of columnFieldTypes(); track colType.id) {
                            <option [value]="colType.typeCode">{{ colType.typeName }}</option>
                          }
                        </select>
                        <button type="button" (click)="removeColumn(field, colIdx)" [class]="ui.iconBtnPeligro"
                                [attr.aria-label]="'Eliminar la columna ' + (colIdx + 1)">
                          <lucide-angular name="x" [size]="14"></lucide-angular>
                        </button>
                      </div>
                    }
                  </div>
                }

                <!-- Vista previa: el campo tal como lo verá el asesor -->
                <div [class]="ui.caja + ' flex flex-col gap-2 px-3 py-2.5'">
                  <span class="text-[10.5px] font-extrabold uppercase tracking-[0.07em] text-[#5f6c80] dark:text-slate-400">Vista previa</span>
                  <app-dynamic-field-renderer
                    [schema]="{ fields: [field] }"
                    (dataChange)="onPreviewDataChange($event)"
                  ></app-dynamic-field-renderer>
                </div>
              </div>
            } @empty {
              <div class="flex flex-col items-center gap-1 px-4 py-8 text-center">
                <lucide-angular name="inbox" [size]="32" class="mb-1 text-[#c5ccd6]"></lucide-angular>
                <p class="text-[13px] font-bold text-[#334155] dark:text-slate-200">Esta tipificación no pide datos adicionales</p>
                <p class="text-[12.5px] text-[#5f6c80] dark:text-slate-400">Agrega el primero con «Agregar campo».</p>
              </div>
            }

            <button type="button" (click)="addField()"
                    class="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-[10px] border border-dashed border-[#c5ccd6]
                           bg-white text-[12.5px] font-bold text-[#334155] transition-colors duration-150
                           hover:border-[#2563eb] hover:text-[#1d4ed8]
                           dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-blue-500 dark:hover:text-blue-300">
              <lucide-angular name="plus" [size]="15"></lucide-angular>
              Agregar campo
            </button>
          </div>

          <!-- Pie -->
          <div [class]="ui.pie">
            <button type="button" (click)="handleCancel()" [class]="ui.secundario">Cancelar</button>
            <button type="button" (click)="handleSave()" [class]="ui.primario">Guardar campos</button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [TUI_ANIM]
})
export class FieldConfigDialogComponent {
  private apiSystemConfigService = inject(ApiSystemConfigService);

  isOpen = input.required<boolean>();
  existingSchema = input<MetadataSchema | null>(null);
  /** Nombre de la tipificación, solo para el subtítulo. */
  typificationName = input<string>('');

  save = output<MetadataSchema>();
  cancel = output<void>();

  readonly ui = TUI;

  fields = signal<FieldConfig[]>([]);
  fieldTypes = signal<FieldTypeResource[]>([]);
  columnFieldTypes = signal<FieldTypeResource[]>([]);

  constructor() {
    // Cargar tipos de campo desde el backend
    this.apiSystemConfigService.getFieldTypesForMainFields().subscribe(types => {
      // Agregar PAYMENT_SCHEDULE si no existe
      const hasPaymentSchedule = types.some(t => t.typeCode === 'payment_schedule');
      if (!hasPaymentSchedule) {
        types.push({
          id: 999,
          typeCode: 'payment_schedule',
          typeName: 'Cronograma de Pagos',
          description: 'Permite dividir un monto en múltiples cuotas con fechas',
          icon: 'calendar-check',
          availableForMainField: true,
          availableForTableColumn: false,
          displayOrder: 100
        });
      }
      this.fieldTypes.set(types);
    });

    this.apiSystemConfigService.getFieldTypesForTableColumns().subscribe(types => {
      this.columnFieldTypes.set(types);
    });

    effect(() => {
      const schema = this.existingSchema();
      if (schema && schema.fields) {
        // Normalizar tipos a lowercase para que coincidan con los typeCode del backend
        const normalizedFields = JSON.parse(JSON.stringify(schema.fields)).map((field: FieldConfig) => ({
          ...field,
          type: field.type?.toLowerCase() || 'text',
          columns: field.columns?.map(col => ({
            ...col,
            type: col.type?.toLowerCase() || 'text'
          }))
        }));
        this.fields.set(normalizedFields);
      } else {
        this.fields.set([]);
      }
    });
  }

  addField() {
    const newField: FieldConfig = {
      id: `field_${Date.now()}`,
      label: 'Nuevo Campo',
      type: 'text',
      required: false,
      displayOrder: this.fields().length
    };
    this.fields.update(fields => [...fields, newField]);
  }

  removeField(index: number) {
    this.fields.update(fields => fields.filter((_, i) => i !== index));
  }

  onFieldTypeChange(field: FieldConfig) {
    if (field.type === 'table') {
      if (!field.columns || field.columns.length === 0) {
        field.columns = [
          { id: 'cuota', label: 'Cuota', type: 'auto-number', required: true },
          { id: 'fecha', label: 'Fecha', type: 'date', required: true },
          { id: 'monto', label: 'Monto', type: 'currency', required: true }
        ];
      }
      field.allowAddRow = true;
      field.allowDeleteRow = true;
    }
  }

  addColumn(field: FieldConfig) {
    if (!field.columns) {
      field.columns = [];
    }
    const newColumn: TableColumn = {
      id: `column_${Date.now()}`,
      label: 'Nueva Columna',
      type: 'text'
    };
    field.columns.push(newColumn);
    this.fields.set([...this.fields()]);
  }

  removeColumn(field: FieldConfig, columnIndex: number) {
    if (field.columns) {
      field.columns.splice(columnIndex, 1);
      this.fields.set([...this.fields()]);
    }
  }

  handleSave() {
    const schema: MetadataSchema = {
      fields: this.fields()
    };
    this.save.emit(schema);
  }

  handleCancel() {
    this.cancel.emit();
  }

  onPreviewDataChange(_data: any) {
    // No hacemos nada con los datos de la preview, es solo para visualización
  }
}
