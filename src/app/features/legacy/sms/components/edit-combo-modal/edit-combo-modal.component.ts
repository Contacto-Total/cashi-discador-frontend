import { Component, EventEmitter, Input, OnInit, Output, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule, X, Settings, Filter, ListChecks, Ban, Plus, Trash2 } from 'lucide-angular';
import { ComboService } from '../../services/combo.service';
import { ComboResponse } from '../../models/combo.model';
import { renderPreviewMessage, smsSegmentsLen } from '../../utils/sms-utils';
import { ThemeService } from '../../../../../shared/services/theme.service';

type ChipKey =
  | 'NOMBRE'
  | 'LTD'
  | 'LTDE'
  | 'LTD_LTDE'
  | 'BAJA30'
  | 'SALDO_MORA'
  | 'BAJA30_SALDOMORA'
  | 'PKM'
  | 'CAPITAL'
  | 'DEUDA_TOTAL'
  | 'HOY'
  | 'MANANA'
  | 'NOMBRECOMPLETO'
  | 'EMAIL'
  | 'NUMCUENTAPMCP'
  | 'DIASMORA';

@Component({
  selector: 'app-edit-combo-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LucideAngularModule
  ],
  templateUrl: './edit-combo-modal.component.html',
  styleUrl: './edit-combo-modal.component.scss'
})
export class EditComboModalComponent implements OnInit {
  @Input() combo!: ComboResponse;
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  // Icons
  readonly X = X;
  readonly Settings = Settings;
  readonly Filter = Filter;
  readonly ListChecks = ListChecks;
  readonly Ban = Ban;
  readonly Plus = Plus;
  readonly Trash2 = Trash2;

  activeTab = signal<'variables' | 'rangos' | 'condiciones' | 'restricciones'>('variables');
  saving = signal(false);

  private themeService = inject(ThemeService);
  isDarkMode = this.themeService.isDarkMode;

  selectedChips = new Set<ChipKey>();

  chipGroups: Array<{ title: string; items: Array<{ key: ChipKey; label: string; affectsSelects?: boolean }> }> = [
    {
      title: 'Información Personal',
      items: [
        { key: 'NOMBRE', label: 'Nombre' },
        { key: 'NOMBRECOMPLETO', label: 'Nombre Completo' },
        { key: 'EMAIL', label: 'Correo' },
      ]
    },
    {
      title: 'Información Financiera',
      items: [
        { key: 'LTD', label: 'LTD' },
        { key: 'LTDE', label: 'LTDE' },
        { key: 'LTD_LTDE', label: 'LTD + LTDE' },
        { key: 'BAJA30', label: 'Baja 30' },
        { key: 'SALDO_MORA', label: 'Mora' },
        { key: 'BAJA30_SALDOMORA', label: 'Baja30 + Mora' },
        { key: 'PKM', label: 'PKM' },
        { key: 'CAPITAL', label: 'Capital' },
        { key: 'DEUDA_TOTAL', label: 'Deuda Total' },
        { key: 'DIASMORA', label: 'Días Mora' },
      ]
    },
    {
      title: 'Fechas',
      items: [
        { key: 'HOY', label: 'Hoy' },
        { key: 'MANANA', label: 'Mañana' },
      ]
    },
    {
      title: 'Cuenta',
      items: [
        { key: 'NUMCUENTAPMCP', label: 'Número de Cuenta' },
      ]
    }
  ];

  rangeFields = [
    { key: 'BAJA30', label: 'Baja 30' },
    { key: 'SALDO_MORA', label: 'Mora' },
    { key: 'DEUDA_TOTAL', label: 'Deuda Total' },
    { key: 'CAPITAL', label: 'Capital' },
    { key: 'DIASMORA', label: 'Días Mora' }
  ];

  form = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    tramo: ['3' as '3' | '5' | 'CONTACTO_TOTAL'],
    plantillaTexto: ['', Validators.required],
    importeExtra: [0],
    rangos: this.fb.array([]),
    noContenido: [false],
    excluirPromesasPeriodoActual: [false],
    excluirCompromisos: [false],
    excluirBlacklist: [false]
  });

  condiciones: string[] = [];
  previewSample = signal<any>(null);
  previewText = computed(() => {
    const tpl = this.form.get('plantillaTexto')?.value || '';
    const sample = this.previewSample();
    if (!sample || !tpl) return '';
    return renderPreviewMessage(tpl, sample);
  });

  smsLen = (t: string) => smsSegmentsLen(t);

  get rangosFA() {
    return this.form.get('rangos') as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private api: ComboService
  ) {}

  ngOnInit() {
    if (this.combo) {
      this.loadComboData();
    }
  }

  private loadComboData() {
    // Cargar datos del combo directamente del @Input
    this.form.patchValue({
      nombre: this.combo.name || '',
      tramo: this.combo.tramo || '3',
      plantillaTexto: this.combo.plantillaTexto || '',
      importeExtra: (this.combo as any).importeExtra || 0,
      noContenido: this.combo.restricciones?.noContenido || false,
      excluirPromesasPeriodoActual: this.combo.restricciones?.excluirPromesasPeriodoActual || false,
      excluirCompromisos: this.combo.restricciones?.excluirCompromisos || false,
      excluirBlacklist: this.combo.restricciones?.excluirBlacklist || false
    });

    // Cargar chips seleccionados
    this.selectedChips.clear();
    if (this.combo.selects) {
      this.combo.selects.forEach(s => this.selectedChips.add(s as ChipKey));
    }

    // Cargar rangos
    this.rangosFA.clear();
    const rangos = this.combo.rangos || [];
    rangos.forEach((r: any) => {
      this.rangosFA.push(this.fb.nonNullable.group({
        field: [r.field || 'BAJA30'],
        min: [r.min || 0],
        max: [r.max || 0],
        inclusiveMin: [r.inclusiveMin !== false],
        inclusiveMax: [r.inclusiveMax !== false],
        useMin: [r.useMin !== false],
        useMax: [r.useMax !== false],
        mode: [r.mode || 'gt']
      }));
    });

    // Cargar condiciones
    this.condiciones = this.combo.condiciones || [];

    // Obtener sample para preview
    this.loadPreviewSample();
  }

  private loadPreviewSample() {
    this.api.previewFromCombo(this.combo.id, 1).subscribe({
      next: rows => {
        if (rows && rows.length > 0) {
          this.previewSample.set(rows[0]);
        }
      }
    });
  }

  toggleChip(key: ChipKey, affectsSelects = true) {
    if (this.selectedChips.has(key)) {
      this.selectedChips.delete(key);
    } else {
      this.selectedChips.add(key);

      // Exclusiones
      if (key === 'LTD_LTDE') {
        this.selectedChips.delete('LTD');
        this.selectedChips.delete('LTDE');
      } else if (key === 'LTD' || key === 'LTDE') {
        this.selectedChips.delete('LTD_LTDE');
      }

      if (key === 'BAJA30_SALDOMORA') {
        this.selectedChips.delete('BAJA30');
        this.selectedChips.delete('SALDO_MORA');
      } else if (key === 'BAJA30' || key === 'SALDO_MORA') {
        this.selectedChips.delete('BAJA30_SALDOMORA');
      }
    }
  }

  isActive(key: ChipKey): boolean {
    return this.selectedChips.has(key);
  }

  isChipDisabled(key: ChipKey): boolean {
    return false;
  }

  addRange() {
    this.rangosFA.push(this.fb.nonNullable.group({
      field: ['BAJA30'],
      min: [0],
      max: [0],
      inclusiveMin: [true],
      inclusiveMax: [true],
      useMin: [true],
      useMax: [false],
      mode: ['gt']
    }));
  }

  removeRange(index: number) {
    this.rangosFA.removeAt(index);
  }

  changeOperator(index: number, mode: 'gt' | 'lt') {
    const rg = this.rangosFA.at(index);
    rg.patchValue({
      mode,
      useMin: mode === 'gt',
      useMax: mode === 'lt'
    });
  }

  toggleInterval(index: number, useInterval: boolean) {
    const rg = this.rangosFA.at(index);
    rg.patchValue({
      useMin: useInterval,
      useMax: useInterval
    });
  }

  fieldLabel(key: string): string {
    return this.rangeFields.find(f => f.key === key)?.label || key;
  }

  toggleCond(event: any, cond: string) {
    if (event.target.checked) {
      if (!this.condiciones.includes(cond)) {
        this.condiciones.push(cond);
      }
    } else {
      const idx = this.condiciones.indexOf(cond);
      if (idx >= 0) {
        this.condiciones.splice(idx, 1);
      }
    }
  }

  isConditionChecked(cond: string): boolean {
    return this.condiciones.includes(cond);
  }

  close() {
    this.closed.emit();
  }

  save() {
    if (this.form.invalid) {
      return;
    }

    this.saving.set(true);

    const v = this.form.getRawValue();

    const payload: any = {
      name: v.nombre,
      tramo: v.tramo,
      selects: Array.from(this.selectedChips),
      plantillaTexto: v.plantillaTexto,
      importeExtra: v.importeExtra,
      rangos: v.rangos,
      condiciones: this.condiciones,
      restricciones: {
        noContenido: v.noContenido,
        excluirPromesasPeriodoActual: v.excluirPromesasPeriodoActual,
        excluirCompromisos: v.excluirCompromisos,
        excluirBlacklist: v.excluirBlacklist
      }
    };

    this.api.update(this.combo.id, payload).subscribe({
      next: () => {
        this.saving.set(false);
        this.saved.emit();
        this.close();
      },
      error: (err) => {
        console.error('Error saving combo:', err);
        this.saving.set(false);
      }
    });
  }
}
