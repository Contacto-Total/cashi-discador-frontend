import { Component, inject, OnInit, signal, ElementRef, ViewChild, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, FormsModule, FormArray, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { DynQueryService } from '../../services/dyn-query.service';
import { DynamicQueryRequest, Row } from '../../models/dyn-query.model';
import { ComboService } from '../../services/combo.service';
import { ComboCreateRequest } from '../../models/combo.model';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { debounceTime, map, distinctUntilChanged, startWith } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';
import { LucideAngularModule, Settings, Filter, Plus, Trash2, ListChecks, Ban, FileText, Table, Eye, Send, Save, XCircle } from 'lucide-angular';
import { ThemeService } from '../../../../../shared/services/theme.service';

const VAR_PATTERN_I = /\{([A-Z0-9_]+)\}/gi;
const VAR_PATTERN = /\{([A-Z0-9_]+)\}/g;
type VarChip = { key: string; label: string; affectsSelects: boolean };
type VarGroup = { key: 'cliente' | 'financiero' | 'fechas'; title: string; items: VarChip[] };

// Modal data types
type LoadingModalData = { title?: string; subtitle?: string };
type AlertModalData = { title?: string; message?: string };
type SuccessModalData = { title?: string; message?: string; autoCloseMs?: number };
type RoundWizardModalData = { sessionId?: string; init?: any; template?: string };

@Component({
  selector: 'app-dyn-query',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    LucideAngularModule
  ],
  templateUrl: './dyn-query.component.html',
  styleUrl: './dyn-query.component.scss'
})
export class DynQueryComponent implements OnInit {
  private fbRef = inject(FormBuilder);
  private api = inject(DynQueryService);
  private comboApi = inject(ComboService);
  private router = inject(Router);
  private themeService = inject(ThemeService);

  isDarkMode = this.themeService.isDarkMode;
  sampleRow = signal<Row | null>(null);

  @ViewChild('tplArea') tplArea?: ElementRef<HTMLTextAreaElement>;

  // Lucide icons
  Settings = Settings;
  Filter = Filter;
  Plus = Plus;
  Trash2 = Trash2;
  ListChecks = ListChecks;
  Ban = Ban;
  FileText = FileText;
  Table = Table;
  Eye = Eye;
  Send = Send;
  Save = Save;
  XCircle = XCircle;

  // Active tab
  activeTab: 'variables' | 'rangos' | 'condiciones' | 'restricciones' = 'variables';

  // Modal states
  loadingModal = signal<{ isOpen: boolean; data: LoadingModalData | null }>({ isOpen: false, data: null });
  alertModal = signal<{ isOpen: boolean; data: AlertModalData | null }>({ isOpen: false, data: null });
  successModal = signal<{ isOpen: boolean; data: SuccessModalData | null }>({ isOpen: false, data: null });
  roundWizardModal = signal<{ isOpen: boolean; data: RoundWizardModalData | null }>({ isOpen: false, data: null });

  rangeFields = [
    { key: 'DEUDA_TOTAL', label: 'Deuda total' },
    { key: 'CAPITAL', label: 'Capital' },
    { key: 'SALDO_MORA', label: 'Saldo mora' },
    { key: 'BAJA30', label: 'Baja 30' },
    { key: 'LTD', label: 'LTD' },
    { key: 'LTDE', label: 'LTDE' },
    { key: 'PKM', label: 'PKM' },
    { key: 'DIASMORA', label: 'Días mora' },
  ];

  private insertAtCursor(text: string) {
    const ctrl = this.form.controls.plantillaTexto;
    const el = this.tplArea?.nativeElement;

    if (!el) {
      const cur = ctrl.value ?? '';
      const sep = cur && !cur.endsWith(' ') ? ' ' : '';
      ctrl.setValue(cur + sep + text);
      ctrl.markAsDirty();
      return;
    }

    // Read from native element to get the most recent value (including user typing)
    const val = el.value ?? '';
    const start = el.selectionStart ?? val.length;
    const end = el.selectionEnd ?? start;

    const before = val.slice(0, start);
    const after = val.slice(end);

    const needsSpaceBefore = before.length && !/\s$/.test(before);
    const insert = (needsSpaceBefore ? ' ' : '') + text;

    const next = before + insert + after;

    // Update FormControl to sync with native element
    ctrl.setValue(next);
    ctrl.markAsDirty();

    const caret = (before + insert).length;
    setTimeout(() => {
      el.focus();
      el.selectionStart = el.selectionEnd = caret;
    }, 0);
  }

  private selects = new Set<string>();
  private condiciones = new Set<string>();

  chipGroups: VarGroup[] = [
    {
      key: 'cliente',
      title: 'Cliente',
      items: [
        { key: 'NOMBRE', label: 'Nombre', affectsSelects: true },
        { key: 'NOMBRECOMPLETO', label: 'Nombre completo', affectsSelects: true },
        { key: 'EMAIL', label: 'Correo', affectsSelects: true },
        { key: 'NUMCUENTAPMCP', label: 'N° de Cuenta', affectsSelects: true },
      ]
    },
    {
      key: 'financiero',
      title: 'Financiero',
      items: [
        { key: 'LTD', label: 'LTD', affectsSelects: true },
        { key: 'LTDE', label: 'LTDE', affectsSelects: true },
        { key: 'LTD_LTDE', label: 'LTD y LTDE', affectsSelects: true },
        { key: 'BAJA30', label: 'Baja 30', affectsSelects: true },
        { key: 'MORA', label: 'Saldo Mora', affectsSelects: true },
        { key: 'BAJA30_SALDOMORA', label: 'Baja 30 y Saldo Mora', affectsSelects: true },
        { key: 'PKM', label: 'PKM', affectsSelects: true },
        { key: 'CAPITAL', label: 'Capital', affectsSelects: true },
        { key: 'DEUDA_TOTAL', label: 'Deuda Total', affectsSelects: true },
      ]
    },
    {
      key: 'fechas',
      title: 'Fechas',
      items: [
        { key: 'DIASMORA', label: 'Días mora', affectsSelects: true },
        { key: 'HOY', label: 'Hoy', affectsSelects: false },
        { key: 'MANANA', label: 'Mañana', affectsSelects: false },
      ]
    }
  ];

  chips = this.chipGroups.flatMap(g => g.items);
  selectedChips = new Set<string>();

  isSelected(key: string) {
    return this.selectedChips.has(key);
  }

  private aliasKeys(raw: string): string[] {
    const k = raw.toUpperCase();
    switch (k) {
      case 'MORA':
      case 'SALDO_MORA':
        return ['SALDO_MORA', 'MORA', 'SALDO MORA'];

      case 'BAJA30':
        return ['BAJA30', 'BAJA_30', 'BAJA 30'];

      case 'BAJA30_SALDOMORA':
        return ['BAJA30_SALDOMORA', 'BAJA30_SALDO_MORA', 'BAJA 30 SALDO MORA'];

      case 'DEUDA_TOTAL':
        return ['DEUDA_TOTAL', 'DEUDA TOTAL'];

      case 'LTD_LTDE':
        return ['LTD_LTDE', 'LTD+LTDE', 'LTD LTDE'];

      case 'NOMBRECOMPLETO':
        return ['NOMBRECOMPLETO', 'NOMBRE COMPLETO'];

      case 'EMAIL':
        return ['EMAIL'];

      case 'NUMCUENTAPMCP':
        return ['NUMCUENTAPMCP', 'NUMCUENTA_PMCP', 'NUM_CUENTA_PMCP', 'NUMCUENTA PMCP', 'N° CUENTA PMCP'];

      case 'DIASMORA':
        return ['DIASMORA', 'DIAS_MORA', 'DIAS MORA'];

      default:
        return [k, k.replace(/\s+/g, '_')];
    }
  }

  private mapVar(key: string): string {
    const k = key.toUpperCase();
    if (k === 'MORA') return 'SALDO_MORA';
    return k;
  }

  private getVal(r: Record<string, any>, key: string): any {
    const candidates = this.aliasKeys(this.mapVar(key));
    for (const c of candidates) {
      if (r.hasOwnProperty(c)) return r[c];
    }
    return undefined;
  }

  private hasMeaningfulValue(row: Record<string, any>, col: string): boolean {
    const v = this.getVal(row, col);
    if (v === null || v === undefined) return false;
    if (typeof v === 'string') return v.trim().length > 0;
    if (typeof v === 'number') return v > 0;
    return true;
  }

  private requiredColumnsForPreview(): string[] {
    const fromChips = Array.from(this.selects);
    const tpl = this.form.controls.plantillaTexto.value ?? '';
    const fromTpl = (tpl.match(VAR_PATTERN) || []).map((m: string) => m.slice(1, -1));

    const all = Array.from(new Set([...fromChips, ...fromTpl])).map(k => this.mapVar(k));

    const candidates = new Set([
      'LTD', 'LTDE', 'LTD_LTDE', 'BAJA30', 'SALDO_MORA',
      'BAJA30_SALDOMORA', 'CAPITAL', 'DEUDA_TOTAL', 'PKM'
    ]);

    return Array.from(new Set(fromChips.map(k => this.mapVar(k))))
      .filter(k => candidates.has(k));
  }

  private preferredColumnsForPreview(): string[] {
    const tpl = this.form.controls.plantillaTexto.value ?? '';
    const fromTpl = (tpl.match(VAR_PATTERN) || []).map((m: string) => this.mapVar(m.slice(1, -1)));
    const req = new Set(this.requiredColumnsForPreview());
    return Array.from(new Set(fromTpl.filter(k => !req.has(k))));
  }

  private pickBestRow(
    rows: Row[],
    required: string[],
    preferred: string[],
  ): Row | null {
    const R = rows as Record<string, any>[];

    const full = R.filter(r => required.every(c => this.hasMeaningfulValue(r, c)));
    if (full.length) {
      full.sort((a, b) => {
        const sa = preferred.reduce((acc, c) => acc + (this.hasMeaningfulValue(a, c) ? 1 : 0), 0);
        const sb = preferred.reduce((acc, c) => acc + (this.hasMeaningfulValue(b, c) ? 1 : 0), 0);
        return sb - sa;
      });
      return full[0] as Row;
    }

    let best: Row | null = null;
    let bestReq = -1;
    let bestPref = -1;

    for (const r of R) {
      const reqCount = required.reduce((acc, c) => acc + (this.hasMeaningfulValue(r, c) ? 1 : 0), 0);
      const prefCount = preferred.reduce((acc, c) => acc + (this.hasMeaningfulValue(r, c) ? 1 : 0), 0);

      if (
        reqCount > bestReq ||
        (reqCount === bestReq && prefCount > bestPref)
      ) {
        best = r as Row;
        bestReq = reqCount;
        bestPref = prefCount;
      }
    }
    return best ?? (rows[0] ?? null);
  }

  toggleChip(key: string, affectsSelects = true) {
    const wasActive = this.selectedChips.has(key);

    if (wasActive) {
      this.selectedChips.delete(key);
      if (affectsSelects) this.selects.delete(key);
      this.removePlaceholder(key);
    } else {
      if (key === 'BAJA30' || key === 'MORA') {
        if (this.selectedChips.has('BAJA30_SALDOMORA')) {
          this.selectedChips.delete('BAJA30_SALDOMORA');
          this.selects.delete('BAJA30_SALDOMORA');
          this.removePlaceholder('BAJA30_SALDOMORA');
        }
      }
      if (key === 'BAJA30_SALDOMORA') {
        if (this.selectedChips.has('BAJA30')) {
          this.selectedChips.delete('BAJA30');
          this.selects.delete('BAJA30');
          this.removePlaceholder('BAJA30');
        }
        if (this.selectedChips.has('MORA')) {
          this.selectedChips.delete('MORA');
          this.selects.delete('MORA');
          this.removePlaceholder('MORA');
        }
      }

      if (key === 'LTD' || key === 'LTDE') {
        this.forceDeselect('LTD_LTDE');
      }
      if (key === 'LTD_LTDE') {
        this.forceDeselect('LTD');
        this.forceDeselect('LTDE');
      }

      this.selectedChips.add(key);
      if (affectsSelects) this.selects.add(key);
      this.insertPlaceholderOnce(key);
    }

    if (!this.hasTopUpSelect()) {
      this.form.controls.importeExtra.setValue(0);
    }
    this.fetchSampleRow();
  }

  previewText = computed(() => {
    const tpl = this.tplSig();
    const row = this.sampleRow();
    return this.renderTemplate(tpl, row);
  });

  private normalizeRow(row: any): Record<string, any> {
    const out: Record<string, any> = {};
    Object.keys(row || {}).forEach(k => {
      const key = k.replace(/\s+/g, '_').toUpperCase();
      out[key] = (row as any)[k];
    });
    return out;
  }

  private fetchSampleRow() {
    if (this.previewMode() === 'auto') {
      this.triggerPreview();
    }
  }

  private renderTemplate(tpl: string, row: Row | null): string {
    if (!tpl) return '';
    if (!row) return tpl;

    const r = this.normalizeRow(row as any);

    const firstName = (s: any) => String(s ?? '').trim().split(/\s+/)[0] || '';
    const fmtInt = (v: any) => {
      const n = Number(v);
      return Number.isFinite(n) ? Math.trunc(n).toLocaleString('es-PE') : '';
    };
    const hoy = new Date();
    const manana = new Date(hoy.getTime() + 24 * 60 * 60 * 1000);
    const fmtDate = (d: Date) =>
      d.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit' });

    return tpl.replace(VAR_PATTERN, (_m, key: string) => {
      switch (key) {
        case 'NOMBRE': return firstName(this.getVal(r, 'NOMBRE'));
        case 'HOY': return fmtDate(hoy);
        case 'MANANA': return fmtDate(manana);

        case 'DIASMORA':
        case 'LTD':
        case 'LTDE':
        case 'LTD_LTDE':
        case 'BAJA30':
        case 'SALDO_MORA':
        case 'BAJA30_SALDOMORA':
        case 'CAPITAL':
        case 'DEUDA_TOTAL':
        case 'PKM':
          return fmtInt(this.getVal(r, key));

        default:
          const v = this.getVal(r, key);
          return v === undefined ? '' : String(v);
      }
    });
  }

  private expandWithAliases(keys: string[]): string[] {
    const out = new Set<string>();
    keys.forEach(k => this.aliasKeys(k).forEach(a => out.add(a)));
    return Array.from(out);
  }

  ngOnInit() {
    const form$ = this.form.valueChanges.pipe(
      startWith(this.form.getRawValue()),
      debounceTime(300),
      map(v => ({
        tramo: v.tramo,
        importeExtra: v.importeExtra,
        plantillaTexto: v.plantillaTexto,
        selects: Array.from(this.selects),
        condiciones: Array.from(this.condiciones),
      })),
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
    );

    form$.subscribe(() => {
      this.syncChipsWithTemplate();
      if (this.previewMode() === 'auto') this.triggerPreview();
    });

    this.form.controls.plantillaTexto.valueChanges
      .pipe(debounceTime(200))
      .subscribe(() => {
        this.syncChipsWithTemplate();
        if (this.previewMode() === 'auto') this.triggerPreview();
      });

    this.syncChipsWithTemplate();
    if (this.previewMode() === 'auto') this.triggerPreview();
  }

  private insertPlaceholderOnce(key: string) {
    const ctrl = this.form.controls.plantillaTexto;
    const cur = ctrl.value ?? '';
    const re = new RegExp(`\\{${key}\\}(?!\\w)`, 'i');
    if (re.test(cur)) return;
    this.insertAtCursor(`{${key}}`);
  }

  private hasTopUpSelect(): boolean {
    return (
      this.selectedChips.has('LTD') ||
      this.selectedChips.has('LTDE') ||
      this.selectedChips.has('LTD_LTDE')
    );
  }

  form = inject(FormBuilder).nonNullable.group({
    tramo: '3' as '3' | '5' | 'CONTACTO_TOTAL',
    noContenido: false,
    excluirPromesasPeriodoActual: true,
    excluirCompromisos: true,
    excluirBlacklist: true,
    limit: 1000,

    nombre: inject(FormBuilder).nonNullable.control<string>(''),
    plantillaTexto: inject(FormBuilder).nonNullable.control<string>(''),
    descripcion: inject(FormBuilder).nonNullable.control<string>(''),

    importeExtra: inject(FormBuilder).nonNullable.control<number>(0),

    rangos: inject(FormBuilder).array<FormGroup<any>>([])
  });

  get rangosFA(): FormArray {
    return this.form.get('rangos') as FormArray;
  }

  private validateMinLTMax(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const fg = control as FormGroup;
      const min = fg.get('min')?.value;
      const max = fg.get('max')?.value;

      if (min != null && max != null && Number(min) > Number(max)) {
        return { rangeOrder: true };
      }
      return null;
    };
  }

  private makeRange(): FormGroup {
    return this.fbRef.nonNullable.group(
      {
        field: this.fbRef.nonNullable.control<string>('DEUDA_TOTAL', { validators: [Validators.required] }),
        mode: this.fbRef.nonNullable.control<'gt' | 'lt'>('gt'),
        useMin: this.fbRef.nonNullable.control<boolean>(true),
        min: this.fbRef.control<number | null>(null),
        inclusiveMin: this.fbRef.nonNullable.control<boolean>(false),

        useMax: this.fbRef.nonNullable.control<boolean>(false),
        max: this.fbRef.control<number | null>(null),
        inclusiveMax: this.fbRef.nonNullable.control<boolean>(true),
      },
      { validators: [this.validateRange()] }
    );
  }

  changeOperator(i: number, mode: 'gt' | 'lt') {
    const g = this.rangosFA.at(i) as FormGroup;
    g.get('mode')?.setValue(mode);
    if (mode === 'gt') {
      g.get('useMin')?.setValue(true);
      g.get('useMax')?.setValue(false);
      g.get('max')?.setValue(null);
    } else {
      g.get('useMin')?.setValue(false);
      g.get('useMax')?.setValue(true);
      g.get('min')?.setValue(null);
    }
  }

  toggleUseMin(i: number, checked: boolean) {
    const g = this.rangosFA.at(i) as FormGroup;
    g.get('useMin')?.setValue(checked);
    if (!checked) g.get('min')?.setValue(null);
  }

  toggleUseMax(i: number, checked: boolean) {
    const g = this.rangosFA.at(i) as FormGroup;
    g.get('useMax')?.setValue(checked);
    if (!checked) g.get('max')?.setValue(null);
  }

  toggleInterval(i: number, checked: boolean) {
    if (checked) {
      this.toggleUseMin(i, true);
      this.toggleUseMax(i, true);
    }
  }

  private validateRange(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const fg = control as FormGroup;
      const useMin = !!fg.get('useMin')?.value;
      const useMax = !!fg.get('useMax')?.value;
      const min = fg.get('min')?.value;
      const max = fg.get('max')?.value;

      if (!useMin && !useMax) return { noBoundSelected: true };

      if (useMin && (min == null || min === '')) return { minRequired: true };
      if (useMax && (max == null || max === '')) return { maxRequired: true };

      if (useMin && useMax && Number(min) > Number(max)) return { rangeOrder: true };

      return null;
    };
  }

  addRange() {
    this.rangosFA.push(this.makeRange());
  }

  removeRange(i: number) {
    this.rangosFA.removeAt(i);
  }

  tplSig = toSignal(
    this.form.controls.plantillaTexto.valueChanges.pipe(
      startWith(this.form.controls.plantillaTexto.value ?? '')
    ),
    { initialValue: this.form.controls.plantillaTexto.value ?? '' }
  );

  rows = signal<Row[]>([]);
  cols = signal<string[]>([]);

  onSelectChange(ev: Event, key: string) {
    const input = ev.target as HTMLInputElement;
    if (input.checked) {
      this.selects.add(input.value);
      this.insertPlaceholder(key);
    } else {
      this.selects.delete(input.value);
      this.removePlaceholder(key);
    }
  }

  toggleCond(ev: Event, key: 'PROMESAS_HOY' | 'PROMESAS_MANANA' | 'PROMESAS_MANANA2' | 'PROMESAS_ROTAS') {
    const input = ev.target as HTMLInputElement;
    if (input.checked) this.condiciones.add(key);
    else this.condiciones.delete(key);
    this.fetchSampleRow();
  }

  private buildBody(limitForPreview: boolean): DynamicQueryRequest {
    const v = this.form.getRawValue();

    let selects = Array.from(this.selects)
      .map(s => (s === 'MORA' ? 'SALDO_MORA' : s));

    const PROMESAS = new Set(['PROMESAS_HOY', 'PROMESAS_MANANA', 'PROMESAS_MANANA2', 'PROMESAS_ROTAS']);
    const condiciones = Array.from(this.condiciones).filter(c => PROMESAS.has(c));

    const tokens = Array.from(this.extractTokens());
    const fromText = tokens.filter(t => this.affectsMap.get(t));
    selects = Array.from(new Set([...selects, ...fromText]));

    const importeExtraAplica =
      this.hasTopUpSelect() && Number(v.importeExtra) > 0
        ? Math.trunc(Number(v.importeExtra))
        : null;

    const rangos = this.rangosFA.controls
      .map(g => {
        const field = String(g.get('field')?.value || '').toUpperCase();
        const useMin = !!g.get('useMin')?.value;
        const useMax = !!g.get('useMax')?.value;
        const min = g.get('min')?.value;
        const max = g.get('max')?.value;

        return {
          field,
          min: useMin ? Number(min) : undefined,
          max: useMax ? Number(max) : undefined,
          inclusiveMin: !!g.get('inclusiveMin')?.value,
          inclusiveMax: !!g.get('inclusiveMax')?.value,
        };
      })
      .filter(r => r.min != null || r.max != null);

    return {
      selects,
      tramo: v.tramo,
      condiciones,
      restricciones: {
        noContenido: !!v.noContenido,
        excluirPromesasPeriodoActual: !!v.excluirPromesasPeriodoActual,
        excluirCompromisos: !!v.excluirCompromisos,
        excluirBlacklist: !!v.excluirBlacklist,
      },
      limit: limitForPreview ? Number(v.limit || 1000) : undefined,
      importeExtra: importeExtraAplica,
      rangos: rangos.length ? rangos : undefined,
    } as any;
  }

  ejecutar() {
    const body = this.buildBody(true);
    this.api.run(body).subscribe(rs => {
      this.rows.set(rs);
      this.cols.set(rs.length ? Object.keys(rs[0]) : []);
    });
  }

  private alert(message: string, title = 'Aviso') {
    this.alertModal.set({
      isOpen: true,
      data: { title, message }
    });
  }

  private compactQuery<T extends Record<string, any>>(q: T): T {
    const c: any = { ...q };
    if (c.limit == null) delete c.limit;
    if (c.importeExtra == null) delete c.importeExtra;
    delete c.plantillaTexto;
    return c;
  }

  exportar() {
    const rawQuery = this.buildBody(false);
    const query = this.compactQuery(rawQuery);
    const queryAll = { ...query, selectAll: true };
    const template = (this.form.controls.plantillaTexto.value ?? '').trim();
    if (!template) {
      this.alert('Ingresa un texto de SMS antes de exportar.', 'Falta texto');
      return;
    }

    this.loadingModal.set({
      isOpen: true,
      data: { title: 'Generando Excel…', subtitle: 'Preparando datos y creando archivo' }
    });

    this.api.precheck(queryAll as any, template).subscribe({
      next: (res) => {
        if (!res.ok) {
          this.loadingModal.set({ isOpen: false, data: null });
          const header = `${res.excedidos} ${res.excedidos === 1 ? 'fila' : 'filas'} superan ${res.limite} caracteres.`;
          const ejemplosTxt = (res.ejemplos ?? [])
            .map((e) => `• ${e.len} caracteres — DNI: ${e.documento || '(sin DNI)'}`)
            .join('\n');
          this.alert(`${header}\n\nPrimeros ${Math.min((res.ejemplos ?? []).length, 3)} casos:\n${ejemplosTxt}`, 'Mensaje demasiado largo');
          return;
        }

        this.api.export(queryAll, template)
          .pipe(finalize(() => this.loadingModal.set({ isOpen: false, data: null })))
          .subscribe({
            next: (blob) => {
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `sms report ${new Date().toISOString().slice(0, 10)}.xlsx`;
              document.body.appendChild(a);
              a.click();
              a.remove();
              URL.revokeObjectURL(url);
              this.showSuccess('Exportación exitosa', 'Tu archivo se generó correctamente.');
            },
            error: (err) => {
              const msg =
                err?.status === 422
                  ? (err?.error?.message || 'No hay filas para exportar con los filtros seleccionados.')
                  : (err?.error?.message || err?.message || 'Ocurrió un error al exportar.');
              this.alert(msg, err?.status === 422 ? 'Sin resultados' : 'Error');
            }
          });
      },
      error: (err) => {
        this.loadingModal.set({ isOpen: false, data: null });
        const msg = err?.error?.message || err?.message || 'No se pudo validar el SMS.';
        this.alert(msg, 'Error en precheck');
      }
    });
  }

  insertPlaceholder(key: string) {
    this.insertAtCursor(`{${key}}`);
  }

  private mapRangosForPayload() {
    return this.rangosFA.controls
      .map(g => {
        const field = String(g.get('field')?.value || '').toUpperCase();
        const useMin = !!g.get('useMin')?.value;
        const useMax = !!g.get('useMax')?.value;
        const min = g.get('min')?.value;
        const max = g.get('max')?.value;
        return {
          field,
          min: useMin ? Number(min) : undefined,
          max: useMax ? Number(max) : undefined,
          inclusiveMin: !!g.get('inclusiveMin')?.value,
          inclusiveMax: !!g.get('inclusiveMax')?.value,
        };
      })
      .filter(r => r.min != null || r.max != null);
  }

  guardarCombo() {
    const v = this.form.getRawValue();
    const importeExtraAplica =
      this.hasTopUpSelect() && Number(v.importeExtra) > 0
        ? Math.trunc(Number(v.importeExtra))
        : null;
    const rangos = this.mapRangosForPayload();

    const payload: ComboCreateRequest = {
      name: v.nombre,
      plantillaName: v.nombre,
      descripcion: v.descripcion,
      tramo: v.tramo,
      selects: Array.from(this.selects),
      condiciones: Array.from(this.condiciones),
      restricciones: {
        noContenido: !!v.noContenido,
        excluirPromesasPeriodoActual: !!v.excluirPromesasPeriodoActual,
        excluirCompromisos: !!v.excluirCompromisos,
        excluirBlacklist: !!v.excluirBlacklist
      },
      plantillaTexto: v.plantillaTexto,
      importeExtra: importeExtraAplica,
      rangos: rangos.length ? rangos : undefined,
    };

    this.comboApi.createCombo(payload).subscribe({
      next: (_id) => {
        this.form.reset({
          tramo: '3',
          excluirPromesasPeriodoActual: true,
          excluirCompromisos: true,
          excluirBlacklist: true,
          limit: 1000,
          nombre: '',
          plantillaTexto: '',
          descripcion: ''
        });
        this.selects.clear();
        this.condiciones.clear();
        this.rows.set([]);
        this.cols.set([]);

        this.showSuccess('Guardado', 'El combo se guardó correctamente.');
        setTimeout(() => {
          this.router.navigate(['/SMS']);
        }, 1800);
      },
      error: (err) => {
        const msg = err?.error?.message || err?.message || 'No se pudo guardar el combo.';
        this.alert(msg, 'Error');
      }
    });
  }

  Cancel() {
    this.router.navigate(['/List-sms']);
  }

  protected readonly Math = Math;

  private removePlaceholder(key: string) {
    const ctrl = this.form.controls.plantillaTexto;
    const cur = ctrl.value ?? '';

    const re = new RegExp(`\\{${key}\\}`, 'g');

    let next = cur.replace(re, '');
    next = next.replace(/\s{2,}/g, ' ').replace(/\s+([.,;:!?])/g, '$1').trim();

    if (next !== cur) {
      ctrl.setValue(next);
      ctrl.markAsDirty();
    }
  }

  fieldLabel(key: string | null | undefined): string {
    const k = String(key || '').toUpperCase();
    const f = this.rangeFields.find(x => x.key === k);
    return f?.label ?? k;
  }

  private showSuccess(title: string, message?: string, ms = 1800) {
    this.successModal.set({
      isOpen: true,
      data: { title, message, autoCloseMs: ms }
    });
  }

  private forceDeselect(key: string, affectsSelects = true) {
    if (!this.selectedChips.has(key)) return;
    this.selectedChips.delete(key);
    if (affectsSelects) this.selects.delete(key);
    this.removePlaceholder(key);
  }

  isChipDisabled(key: string): boolean {
    if (this.isActive(key)) return false;

    if (key === 'LTD_LTDE') return this.isActive('LTD') || this.isActive('LTDE');
    if (key === 'LTD' || key === 'LTDE') return this.isActive('LTD_LTDE');

    if (key === 'BAJA30_SALDOMORA') return this.isActive('BAJA30') || this.isActive('MORA');
    if (key === 'BAJA30' || key === 'MORA') return this.isActive('BAJA30_SALDOMORA');

    return false;
  }

  private tokensInText = signal<Set<string>>(new Set());

  private affectsMap = new Map<string, boolean>(
    this.chipGroups.flatMap(g =>
      g.items.map(i => [this.mapVar(i.key), i.affectsSelects !== false] as [string, boolean])
    )
  );

  private extractTokens(): Set<string> {
    const tpl = this.form.controls.plantillaTexto.value ?? '';
    const ks = (tpl.match(VAR_PATTERN) || []).map(m => this.mapVar(m.slice(1, -1)));
    return new Set(ks);
  }

  private syncChipsWithText() {
    const tokens = this.extractTokens();
    this.tokensInText.set(tokens);

    for (const k of Array.from(this.selectedChips)) {
      const norm = this.mapVar(k);
      const affects = this.affectsMap.get(norm) ?? true;
      if (affects && !tokens.has(norm)) {
        this.selectedChips.delete(k);
        this.selects.delete(k === 'MORA' ? 'SALDO_MORA' : k);
      }
    }
  }

  isActive(key: string): boolean {
    return this.selectedChips.has(key) || this.tokensInText().has(this.mapVar(key));
  }

  private chipMeta(key: string) {
    for (const g of this.chipGroups) {
      const f = g.items.find(i => i.key === key);
      if (f) return f;
    }
    return undefined;
  }

  private affectsSelects(key: string) {
    return this.chipMeta(key)?.affectsSelects !== false;
  }

  private syncChipsWithTemplate() {
    const tpl = this.form.controls.plantillaTexto.value ?? '';

    const tokens = new Set<string>();
    for (const m of tpl.matchAll(VAR_PATTERN_I)) tokens.add(String(m[1]).toUpperCase());

    if (tokens.has('SALDO_MORA')) tokens.add('MORA');
    if (tokens.has('MORA')) tokens.add('SALDO_MORA');

    this.tokensInText.set(new Set(tokens));

    const want = (k: string) => tokens.has(k.toUpperCase());

    const activate = (k: string) => {
      if (!this.selectedChips.has(k)) {
        this.selectedChips.add(k);
        if (this.affectsSelects(k)) this.selects.add(k === 'MORA' ? 'SALDO_MORA' : k);
      }
    };
    const deactivate = (k: string) => {
      if (this.selectedChips.has(k)) {
        this.selectedChips.delete(k);
        if (this.affectsSelects(k)) this.selects.delete(k === 'MORA' ? 'SALDO_MORA' : k);
      }
    };

    if (want('BAJA30_SALDOMORA')) {
      activate('BAJA30_SALDOMORA');
      deactivate('BAJA30');
      deactivate('MORA');
    } else {
      deactivate('BAJA30_SALDOMORA');
      want('BAJA30') ? activate('BAJA30') : deactivate('BAJA30');
      want('MORA') ? activate('MORA') : deactivate('MORA');
    }

    if (want('LTD_LTDE')) {
      activate('LTD_LTDE');
      deactivate('LTD');
      deactivate('LTDE');
    } else {
      deactivate('LTD_LTDE');
      want('LTD') ? activate('LTD') : deactivate('LTD');
      want('LTDE') ? activate('LTDE') : deactivate('LTDE');
    }

    const alreadyHandled = new Set(['BAJA30', 'MORA', 'BAJA30_SALDOMORA', 'LTD', 'LTDE', 'LTD_LTDE']);
    for (const g of this.chipGroups) {
      for (const c of g.items) {
        if (alreadyHandled.has(c.key)) continue;
        want(c.key) ? activate(c.key) : deactivate(c.key);
      }
    }

    if (!this.hasTopUpSelect()) this.form.controls.importeExtra.setValue(0);
  }

  generarGuiado() {
    const template = (this.form.controls.plantillaTexto.value ?? '').trim();
    if (!template) {
      this.alert('Ingresa un texto de SMS antes de generar.', 'Falta texto');
      return;
    }

    const raw = this.buildBody(false);
    const query: any = this.compactQuery(raw);
    const tokens = Array.from(this.extractTokens());
    const textVars = tokens.filter(t => this.affectsMap.get(t));
    query.selects = Array.from(new Set([...(query.selects || []), ...textVars]));

    const candidatas = [
      'BAJA30', 'SALDO_MORA', 'BAJA30_SALDOMORA',
      'LTD', 'LTDE', 'LTD_LTDE',
      'PKM', 'CAPITAL'
    ];

    this.loadingModal.set({
      isOpen: true,
      data: { title: 'Preparando cohorte…', subtitle: 'Calculando variables candidatas' }
    });

    this.api.previewInit(query, template, candidatas).subscribe({
      next: (init) => {
        this.loadingModal.set({ isOpen: false, data: null });
        this.roundWizardModal.set({
          isOpen: true,
          data: { sessionId: init.sessionId, init, template }
        });
      },
      error: (err) => {
        this.loadingModal.set({ isOpen: false, data: null });
        const msg = err?.error?.message || err?.message || 'No se pudo iniciar el guiado.';
        this.alert(msg, 'Error');
      }
    });
  }

  private triggerPreview() {
    const base = this.currentQueryForPreview();
    const h = this.hash(base);
    if (h === this.lastHash() && this.sampleRow()) return;

    this.lastHash.set(h);
    this.loadingPreview.set(true);

    const required = this.requiredColumnsForPreview();
    const preferred = this.preferredColumnsForPreview();

    this.api.run(base).subscribe({
      next: (rows) => {
        const pick = this.pickBestRow(rows || [], required, preferred);
        this.sampleRow.set(pick ?? null);
        this.loadingPreview.set(false);
      },
      error: () => {
        this.sampleRow.set(null);
        this.loadingPreview.set(false);
      }
    });
  }

  refreshPreview() {
    this.triggerPreview();
  }

  previewMode = signal<'auto' | 'manual'>('manual');
  loadingPreview = signal(false);
  loadingExport = signal(false);
  loadingSave = signal(false);
  private lastHash = signal<string>('');

  setMode(m: 'auto' | 'manual') {
    this.previewMode.set(m);
    if (m === 'auto') this.triggerPreview();
  }

  private hash(q: DynamicQueryRequest): string {
    const key = {
      tramo: q.tramo,
      selects: [...(q.selects || [])].sort(),
      condiciones: [...(q.condiciones || [])].sort(),
      restricciones: q.restricciones,
      importeExtra: q.importeExtra ?? null
    };
    return JSON.stringify(key);
  }

  private currentQueryForPreview(): DynamicQueryRequest {
    const base = this.buildBody(true);

    const tpl = this.form.controls.plantillaTexto.value ?? '';
    const needed = Array.from(new Set(
      (tpl.match(VAR_PATTERN) || []).map(m => this.mapVar(m.slice(1, -1)))
    ));
    base.selects = Array.from(new Set([...(base.selects || []), ...needed]));
    base.selects = Array.from(new Set([...(base.selects || []), ...this.expandWithAliases(base.selects || [])]));
    return base as DynamicQueryRequest;
  }

  pendingPreview = computed(() =>
    this.previewMode() === 'manual' &&
    this.hash(this.currentQueryForPreview()) !== this.lastHash()
  );

  // Modal close handlers
  onLoadingModalClosed() {
    this.loadingModal.set({ isOpen: false, data: null });
  }

  onAlertModalClosed() {
    this.alertModal.set({ isOpen: false, data: null });
  }

  onSuccessModalClosed() {
    this.successModal.set({ isOpen: false, data: null });
  }

  onRoundWizardModalClosed() {
    this.roundWizardModal.set({ isOpen: false, data: null });
  }

  // Simple modal signal accessors for template
  alertMessage = computed(() => this.alertModal().isOpen ? (this.alertModal().data?.message || '') : null);
  successMessage = computed(() => this.successModal().isOpen ? (this.successModal().data?.message || '') : null);
  showRoundWizard = computed(() => this.roundWizardModal().isOpen);

  roundCount = 1;

  closeAlert() {
    this.alertModal.set({ isOpen: false, data: null });
  }

  closeSuccess() {
    this.successModal.set({ isOpen: false, data: null });
  }

  closeRoundWizard() {
    this.roundWizardModal.set({ isOpen: false, data: null });
  }

  confirmGenerate() {
    // Implementar lógica de generación guiada con número de rondas
    console.log(`Generando ${this.roundCount} rondas`);
    this.closeRoundWizard();
    // Aquí iría la llamada al servicio para generar las rondas
  }
}
