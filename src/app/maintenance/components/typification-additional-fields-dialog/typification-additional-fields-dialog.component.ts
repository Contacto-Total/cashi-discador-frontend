import { Component, effect, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { AdditionalFieldV2, FieldTypeV2, FieldDataSourceV2 } from '../../models/typification-v2.model';

@Component({
  selector: 'app-typification-additional-fields-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    @if (isOpen()) {
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] flex flex-col">
          <!-- Header -->
          <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <lucide-angular name="settings" [size]="24" class="text-blue-600"></lucide-angular>
              Configurar Campos Adicionales - {{ typificationName() }}
            </h2>
            <button
              type="button"
              (click)="handleCancel()"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <lucide-angular name="x" [size]="24"></lucide-angular>
            </button>
          </div>

          <!-- Body -->
          <div class="flex-1 overflow-y-auto p-6 space-y-4">
            <!-- Botón agregar campo -->
            <button
              type="button"
              (click)="addField()"
              class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <lucide-angular name="plus" [size]="20"></lucide-angular>
              Agregar Campo
            </button>

            <!-- Lista de campos -->
            @if (localFields().length === 0) {
              <div class="text-center py-12 text-gray-500 dark:text-gray-400">
                <lucide-angular name="inbox" [size]="48" class="mx-auto mb-4 opacity-50"></lucide-angular>
                <p>No hay campos adicionales configurados</p>
              </div>
            }

            @for (field of localFields(); track field.nombreCampo; let idx = $index) {
              <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                <div class="flex items-start justify-between gap-4">
                  <div class="flex-1 space-y-3">
                    <!-- Row 1: Nombre y Label -->
                    <div class="grid grid-cols-2 gap-3">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Código del Campo
                        </label>
                        <input
                          type="text"
                          [(ngModel)]="field.nombreCampo"
                          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                          placeholder="monto_promesa"
                        />
                      </div>

                      <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Etiqueta
                        </label>
                        <input
                          type="text"
                          [(ngModel)]="field.labelCampo"
                          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                          placeholder="Monto a pagar"
                        />
                      </div>
                    </div>

                    <!-- Row 2: Tipo y Fuente -->
                    <div class="grid grid-cols-3 gap-3">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Tipo de Campo
                        </label>
                        <select
                          [(ngModel)]="field.tipoCampo"
                          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                        >
                          <option value="TEXT">Texto</option>
                          <option value="TEXTAREA">Área de texto</option>
                          <option value="NUMBER">Número</option>
                          <option value="DATE">Fecha</option>
                          <option value="CHIP_SELECT">Selección (Chips)</option>
                        </select>
                      </div>

                      <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Fuente de Datos
                        </label>
                        <select
                          [(ngModel)]="field.fuenteValor"
                          (ngModelChange)="onDataSourceChange(field)"
                          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                        >
                          <option value="MANUAL">Manual (usuario ingresa)</option>
                          <option value="DYNAMIC_TABLE">Tabla Dinámica</option>
                        </select>
                      </div>

                      <div class="flex items-end">
                        <label class="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            [(ngModel)]="field.esRequerido"
                            [disabled]="field.fuenteValor === 'DYNAMIC_TABLE'"
                            class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
                          />
                          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Requerido
                          </span>
                        </label>
                      </div>
                    </div>

                    <!-- Row 3: Campo de tabla dinámica (solo si fuente es DYNAMIC_TABLE) -->
                    @if (field.fuenteValor === 'DYNAMIC_TABLE') {
                      <div class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Campo en Tabla Dinámica
                        </label>
                        <input
                          type="text"
                          [(ngModel)]="field.campoTablaDinamica"
                          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                          placeholder="promocion_1"
                        />
                        <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          Nombre del campo tal como aparece en la tabla dinámica del cliente (ej: promocion_1, monto_minimo_pagar)
                        </p>
                      </div>
                    }
                  </div>

                  <!-- Delete button -->
                  <button
                    type="button"
                    (click)="removeField(idx)"
                    class="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                  >
                    <lucide-angular name="trash-2" [size]="20"></lucide-angular>
                  </button>
                </div>
              </div>
            }
          </div>

          <!-- Footer -->
          <div class="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              (click)="handleCancel()"
              class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancelar
            </button>
            <button
              type="button"
              (click)="handleSave()"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Guardar
            </button>
          </div>
        </div>
      </div>
    }
  `
})
export class TypificationAdditionalFieldsDialogComponent {
  isOpen = input.required<boolean>();
  typificationName = input<string>('');
  fields = input<AdditionalFieldV2[]>([]);

  close = output<void>();
  save = output<AdditionalFieldV2[]>();

  localFields = signal<AdditionalFieldV2[]>([]);

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        this.localFields.set([...this.fields()]);
      }
    });
  }

  addField() {
    const newField: AdditionalFieldV2 = {
      id: Date.now(),
      nombreCampo: '',
      tipoCampo: FieldTypeV2.TEXT,
      labelCampo: '',
      esRequerido: false,
      ordenVisualizacion: this.localFields().length + 1,
      fuenteValor: FieldDataSourceV2.MANUAL
    };
    this.localFields.update(fields => [...fields, newField]);
  }

  removeField(index: number) {
    this.localFields.update(fields => fields.filter((_, i) => i !== index));
  }

  onDataSourceChange(field: AdditionalFieldV2) {
    if (field.fuenteValor === FieldDataSourceV2.DYNAMIC_TABLE) {
      // Si cambia a DYNAMIC_TABLE, no es requerido
      field.esRequerido = false;
      field.tipoCampo = FieldTypeV2.CHIP_SELECT;
    } else {
      // Si cambia a MANUAL, limpiar campo de tabla dinámica
      field.campoTablaDinamica = undefined;
    }
  }

  handleCancel() {
    this.close.emit();
  }

  handleSave() {
    this.save.emit(this.localFields());
  }
}
