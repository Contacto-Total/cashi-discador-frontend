import {
  MatInputModule
} from "./chunk-DG4BJB2Z.js";
import {
  MatIconModule
} from "./chunk-NFPOATIL.js";
import {
  AlertDialogComponent,
  ComboService,
  LoadingDialogComponent,
  MatCheckboxModule,
  MatSelectModule,
  SuccessDialogComponent,
  toSignal
} from "./chunk-NN4H66CO.js";
import "./chunk-FWQ24ISG.js";
import "./chunk-PB3KJUWG.js";
import {
  CdkDialogContainer,
  Dialog,
  DialogModule,
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef
} from "./chunk-HBS4YI6H.js";
import {
  createBlockScrollStrategy,
  createGlobalPositionStrategy
} from "./chunk-CRNFYKBD.js";
import {
  MatTableModule
} from "./chunk-L5DRRBK6.js";
import "./chunk-524SGLBK.js";
import {
  CdkPortalOutlet,
  PortalModule
} from "./chunk-2GCPRO7O.js";
import "./chunk-XG3JRR2G.js";
import "./chunk-MAXKR5SL.js";
import {
  BreakpointObserver,
  Breakpoints,
  ESCAPE,
  MatButton,
  MatButtonModule,
  MatCommonModule,
  _animationsDisabled,
  hasModifierKey
} from "./chunk-M2YI7FKS.js";
import "./chunk-Q5NKAKZL.js";
import {
  Router
} from "./chunk-OCZLH7K5.js";
import "./chunk-ZQICQP3Y.js";
import {
  CheckboxControlValueAccessor,
  DefaultValueAccessor,
  FormBuilder,
  FormControlDirective,
  FormControlName,
  FormGroupDirective,
  MinValidator,
  NgControlStatus,
  NgControlStatusGroup,
  NgSelectOption,
  NumberValueAccessor,
  ReactiveFormsModule,
  SelectControlValueAccessor,
  Validators,
  ɵNgNoValidate,
  ɵNgSelectMultipleOption
} from "./chunk-GRJ7XAPD.js";
import "./chunk-QF774CZR.js";
import {
  ChangeDetectionStrategy,
  CommonModule,
  Component,
  EventEmitter,
  Injectable,
  InjectionToken,
  Injector,
  NgForOf,
  NgIf,
  NgModule,
  NgSwitch,
  NgSwitchCase,
  Subject,
  ViewEncapsulation,
  __spreadProps,
  __spreadValues,
  computed,
  debounceTime,
  effect,
  filter,
  finalize,
  inject,
  merge,
  setClassMetadata,
  signal,
  startWith,
  take,
  ɵsetClassDebugInfo,
  ɵɵInheritDefinitionFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassProp,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementContainerEnd,
  ɵɵelementContainerStart,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵreference,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-CTRHJBBW.js";

// src/app/features/legacy/SMS_DYNAMIC/pages/edit-combo-dialog/edit-combo-dialog.component.ts
function EditComboDialogComponent_div_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 53);
    \u0275\u0275text(1, " El texto es obligatorio. ");
    \u0275\u0275elementEnd();
  }
}
function EditComboDialogComponent_div_90_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 54)(1, "label", 55);
    \u0275\u0275text(2, "Sumar importe");
    \u0275\u0275elementEnd();
    \u0275\u0275element(3, "input", 56);
    \u0275\u0275elementEnd();
  }
}
function EditComboDialogComponent_div_97_div_1_option_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 77);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const f_r2 = ctx.$implicit;
    \u0275\u0275property("value", f_r2.key);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(f_r2.label);
  }
}
function EditComboDialogComponent_div_97_div_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 60)(1, "div", 61)(2, "select", 62);
    \u0275\u0275template(3, EditComboDialogComponent_div_97_div_1_option_3_Template, 2, 2, "option", 63);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "button", 64);
    \u0275\u0275listener("click", function EditComboDialogComponent_div_97_div_1_Template_button_click_4_listener() {
      \u0275\u0275restoreView(_r1);
      const i_r3 = \u0275\u0275nextContext().index;
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.removeRange(i_r3));
    });
    \u0275\u0275elementStart(5, "span", 65);
    \u0275\u0275text(6, "delete");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(7, "div", 66);
    \u0275\u0275element(8, "input", 67);
    \u0275\u0275elementStart(9, "label", 68);
    \u0275\u0275element(10, "input", 69);
    \u0275\u0275elementStart(11, "span", 70);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "div", 71);
    \u0275\u0275text(14);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "label", 68);
    \u0275\u0275element(16, "input", 72);
    \u0275\u0275elementStart(17, "span", 70);
    \u0275\u0275text(18);
    \u0275\u0275elementEnd()();
    \u0275\u0275element(19, "input", 73);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "div", 74)(21, "label", 75)(22, "input", 76);
    \u0275\u0275listener("change", function EditComboDialogComponent_div_97_div_1_Template_input_change_22_listener() {
      let tmp_6_0;
      \u0275\u0275restoreView(_r1);
      const ctx_r4 = \u0275\u0275nextContext();
      const rg_r6 = ctx_r4.$implicit;
      const i_r3 = ctx_r4.index;
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(((tmp_6_0 = rg_r6.get("mode")) == null ? null : tmp_6_0.value) === "gt" ? ctx_r3.toggleUseMax(i_r3, false) : ctx_r3.toggleUseMin(i_r3, false));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "span");
    \u0275\u0275text(24, "Desactivar intervalo");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    let tmp_6_0;
    let tmp_7_0;
    let tmp_8_0;
    const rg_r6 = \u0275\u0275nextContext().$implicit;
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275property("ngForOf", ctx_r3.rangeFields);
    \u0275\u0275advance(9);
    \u0275\u0275textInterpolate(((tmp_6_0 = rg_r6.get("inclusiveMin")) == null ? null : tmp_6_0.value) ? "\u2264" : "<");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r3.fieldLabel((tmp_7_0 = rg_r6.get("field")) == null ? null : tmp_7_0.value) || "Variable", " ");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(((tmp_8_0 = rg_r6.get("inclusiveMax")) == null ? null : tmp_8_0.value) ? "\u2264" : "<");
  }
}
function EditComboDialogComponent_div_97_ng_template_2_option_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 77);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const f_r8 = ctx.$implicit;
    \u0275\u0275property("value", f_r8.key);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(f_r8.label);
  }
}
function EditComboDialogComponent_div_97_ng_template_2_ng_container_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275element(1, "input", 89);
    \u0275\u0275elementStart(2, "label", 75);
    \u0275\u0275element(3, "input", 69);
    \u0275\u0275elementStart(4, "span");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    let tmp_6_0;
    const rg_r6 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(((tmp_6_0 = rg_r6.get("inclusiveMin")) == null ? null : tmp_6_0.value) ? "\u2265" : ">");
  }
}
function EditComboDialogComponent_div_97_ng_template_2_ng_container_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275element(1, "input", 90);
    \u0275\u0275elementStart(2, "label", 75);
    \u0275\u0275element(3, "input", 72);
    \u0275\u0275elementStart(4, "span");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    let tmp_6_0;
    const rg_r6 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(((tmp_6_0 = rg_r6.get("inclusiveMax")) == null ? null : tmp_6_0.value) ? "\u2264" : "<");
  }
}
function EditComboDialogComponent_div_97_ng_template_2_ng_container_17_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275elementStart(1, "input", 91);
    \u0275\u0275listener("change", function EditComboDialogComponent_div_97_ng_template_2_ng_container_17_Template_input_change_1_listener($event) {
      \u0275\u0275restoreView(_r9);
      const i_r3 = \u0275\u0275nextContext(2).index;
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.toggleUseMax(i_r3, $event.target.checked));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3, "a\xF1adir l\xEDmite");
    \u0275\u0275elementEnd();
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    let tmp_6_0;
    const rg_r6 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("checked", (tmp_6_0 = rg_r6.get("useMax")) == null ? null : tmp_6_0.value);
  }
}
function EditComboDialogComponent_div_97_ng_template_2_ng_container_18_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275elementStart(1, "input", 91);
    \u0275\u0275listener("change", function EditComboDialogComponent_div_97_ng_template_2_ng_container_18_Template_input_change_1_listener($event) {
      \u0275\u0275restoreView(_r10);
      const i_r3 = \u0275\u0275nextContext(2).index;
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.toggleUseMin(i_r3, $event.target.checked));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3, "a\xF1adir l\xEDmite inferior");
    \u0275\u0275elementEnd();
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    let tmp_6_0;
    const rg_r6 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("checked", (tmp_6_0 = rg_r6.get("useMin")) == null ? null : tmp_6_0.value);
  }
}
function EditComboDialogComponent_div_97_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 78)(1, "select", 79);
    \u0275\u0275template(2, EditComboDialogComponent_div_97_ng_template_2_option_2_Template, 2, 2, "option", 63);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "select", 80);
    \u0275\u0275listener("change", function EditComboDialogComponent_div_97_ng_template_2_Template_select_change_3_listener($event) {
      \u0275\u0275restoreView(_r7);
      const i_r3 = \u0275\u0275nextContext().index;
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.changeOperator(i_r3, $event.target.value));
    });
    \u0275\u0275elementStart(4, "option", 81);
    \u0275\u0275text(5, ">");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "option", 82);
    \u0275\u0275text(7, "<");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "div", 83);
    \u0275\u0275elementContainerStart(9, 84);
    \u0275\u0275template(10, EditComboDialogComponent_div_97_ng_template_2_ng_container_10_Template, 6, 1, "ng-container", 85)(11, EditComboDialogComponent_div_97_ng_template_2_ng_container_11_Template, 6, 1, "ng-container", 85);
    \u0275\u0275elementContainerEnd();
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "button", 86);
    \u0275\u0275listener("click", function EditComboDialogComponent_div_97_ng_template_2_Template_button_click_12_listener() {
      \u0275\u0275restoreView(_r7);
      const i_r3 = \u0275\u0275nextContext().index;
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.removeRange(i_r3));
    });
    \u0275\u0275elementStart(13, "span", 65);
    \u0275\u0275text(14, "delete");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(15, "div", 87)(16, "label", 75);
    \u0275\u0275template(17, EditComboDialogComponent_div_97_ng_template_2_ng_container_17_Template, 4, 1, "ng-container", 88)(18, EditComboDialogComponent_div_97_ng_template_2_ng_container_18_Template, 4, 1, "ng-container", 88);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_6_0;
    let tmp_7_0;
    let tmp_10_0;
    let tmp_11_0;
    const rg_r6 = \u0275\u0275nextContext().$implicit;
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275property("ngForOf", ctx_r3.rangeFields);
    \u0275\u0275advance();
    \u0275\u0275property("value", (tmp_6_0 = rg_r6.get("mode")) == null ? null : tmp_6_0.value);
    \u0275\u0275advance(6);
    \u0275\u0275property("ngSwitch", (tmp_7_0 = rg_r6.get("mode")) == null ? null : tmp_7_0.value);
    \u0275\u0275advance();
    \u0275\u0275property("ngSwitchCase", "gt");
    \u0275\u0275advance();
    \u0275\u0275property("ngSwitchCase", "lt");
    \u0275\u0275advance(6);
    \u0275\u0275property("ngIf", ((tmp_10_0 = rg_r6.get("mode")) == null ? null : tmp_10_0.value) === "gt");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ((tmp_11_0 = rg_r6.get("mode")) == null ? null : tmp_11_0.value) === "lt");
  }
}
function EditComboDialogComponent_div_97_div_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 92);
    \u0275\u0275text(1, " \u26A0\uFE0F El m\xEDnimo no puede ser mayor que el m\xE1ximo. ");
    \u0275\u0275elementEnd();
  }
}
function EditComboDialogComponent_div_97_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 57);
    \u0275\u0275template(1, EditComboDialogComponent_div_97_div_1_Template, 25, 4, "div", 58)(2, EditComboDialogComponent_div_97_ng_template_2_Template, 19, 7, "ng-template", null, 0, \u0275\u0275templateRefExtractor)(4, EditComboDialogComponent_div_97_div_4_Template, 2, 0, "div", 59);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_5_0;
    const rg_r6 = ctx.$implicit;
    const singleMode_r11 = \u0275\u0275reference(3);
    \u0275\u0275property("formGroup", rg_r6);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ((tmp_5_0 = rg_r6.get("useMin")) == null ? null : tmp_5_0.value) && ((tmp_5_0 = rg_r6.get("useMax")) == null ? null : tmp_5_0.value))("ngIfElse", singleMode_r11);
    \u0275\u0275advance(3);
    \u0275\u0275property("ngIf", rg_r6.errors == null ? null : rg_r6.errors["rangeOrder"]);
  }
}
var VAR_RE = /\{([A-Z0-9_]+)\}/gi;
var _EditComboDialogComponent = class _EditComboDialogComponent {
  constructor() {
    this.dialog = inject(MatDialog);
    this.router = inject(Router);
    this.dialogRef = inject(MatDialogRef);
    this.data = inject(MAT_DIALOG_DATA);
    this.fb = inject(FormBuilder);
    this.api = inject(ComboService);
    this.submitted = false;
    this.saving = false;
    this.chips = [
      { key: "NOMBRE", label: "Nombre", affectsSelects: true },
      { key: "LTD", label: "LTD", affectsSelects: true },
      { key: "LTDE", label: "LTDE", affectsSelects: true },
      { key: "LTD_LTDE", label: "LTD + LTDE", affectsSelects: true },
      { key: "BAJA30", label: "Baja 30", affectsSelects: true },
      { key: "SALDO_MORA", label: "Mora", affectsSelects: true },
      { key: "BAJA30_SALDOMORA", label: "Baja30 + Mora", affectsSelects: true },
      { key: "CAPITAL", label: "Capital", affectsSelects: true },
      { key: "DEUDA_TOTAL", label: "Deuda Total", affectsSelects: true },
      { key: "PKM", label: "PKM", affectsSelects: true },
      { key: "NOMBRECOMPLETO", label: "Nombre completo", affectsSelects: true },
      { key: "EMAIL", label: "Correo", affectsSelects: true },
      { key: "NUMCUENTAPMCP", label: "N\xB0 de Cuenta", affectsSelects: true },
      { key: "DIASMORA", label: "D\xEDas mora", affectsSelects: true },
      { key: "HOY", label: "Hoy", affectsSelects: false },
      { key: "MANANA", label: "Ma\xF1ana", affectsSelects: false }
    ];
    this.rangeFields = [
      { key: "DEUDA_TOTAL", label: "Deuda total" },
      { key: "CAPITAL", label: "Capital" },
      { key: "SALDO_MORA", label: "Saldo mora" },
      { key: "BAJA30", label: "Baja 30" },
      { key: "LTD", label: "LTD" },
      { key: "LTDE", label: "LTDE" },
      { key: "PKM", label: "PKM" },
      { key: "DIASMORA", label: "D\xEDas mora" }
    ];
    this.selected = new Set(this.data?.selects ?? []);
    this.form = this.fb.nonNullable.group({
      nombre: this.data.name ?? "",
      plantillaTexto: ["", [Validators.required, Validators.maxLength(612)]],
      descripcion: this.data.descripcion ?? "",
      tramo: this.data.tramo ?? "3",
      // RESTRICCIONES
      noContenido: this.data.restricciones?.noContenido ?? true,
      excluirPromesasPeriodoActual: this.data.restricciones?.excluirPromesasPeriodoActual ?? true,
      excluirCompromisos: this.data.restricciones?.excluirCompromisos ?? true,
      excluirBlacklist: this.data.restricciones?.excluirBlacklist ?? true,
      // 💡 NUEVO: Condiciones (PROMESAS_*)
      cond_PROMESAS_HOY: (this.data.condiciones ?? []).includes("PROMESAS_HOY"),
      cond_PROMESAS_MANANA: (this.data.condiciones ?? []).includes("PROMESAS_MANANA"),
      cond_PROMESAS_MANANA2: (this.data.condiciones ?? []).includes("PROMESAS_MANANA2"),
      cond_PROMESAS_ROTAS: (this.data.condiciones ?? []).includes("PROMESAS_ROTAS"),
      importeExtra: this.fb.nonNullable.control(this.data?.importeExtra ?? 0),
      rangos: this.fb.array([])
    });
    this.SMS_MAX = 160;
    this.sampleRow = signal(null, ...ngDevMode ? [{ debugName: "sampleRow" }] : []);
    this.previewText = computed(() => this.renderTemplate(this.smsCtrl.value, this.sampleRow()), ...ngDevMode ? [{ debugName: "previewText" }] : []);
    this.Math = Math;
  }
  hasTopUpSelect() {
    return this.selected.has("LTD") || this.selected.has("LTDE") || this.selected.has("LTD_LTDE");
  }
  get rangosFA() {
    return this.form.get("rangos");
  }
  validateRange() {
    return (fg) => {
      const g = fg;
      const useMin = !!g.get("useMin")?.value;
      const useMax = !!g.get("useMax")?.value;
      const min = g.get("min")?.value;
      const max = g.get("max")?.value;
      if (!useMin && !useMax)
        return null;
      if (useMin && (min == null || min === ""))
        return { minRequired: true };
      if (useMax && (max == null || max === ""))
        return { maxRequired: true };
      if (useMin && useMax && Number(min) > Number(max))
        return { rangeOrder: true };
      return null;
    };
  }
  makeRange() {
    return this.fb.nonNullable.group({
      field: this.fb.nonNullable.control("DEUDA_TOTAL", { validators: [Validators.required] }),
      mode: this.fb.nonNullable.control("gt"),
      useMin: this.fb.nonNullable.control(false),
      // ⬅️ antes true
      min: this.fb.control(null),
      inclusiveMin: this.fb.nonNullable.control(false),
      useMax: this.fb.nonNullable.control(false),
      // ⬅️ antes false (ok), lo dejamos igual
      max: this.fb.control(null),
      inclusiveMax: this.fb.nonNullable.control(true)
    }, { validators: [this.validateRange()] });
  }
  addRange() {
    this.rangosFA.push(this.makeRange());
  }
  removeRange(i) {
    this.rangosFA.removeAt(i);
  }
  changeOperator(i, mode) {
    const g = this.rangosFA.at(i);
    g.get("mode")?.setValue(mode);
    if (mode === "gt") {
      g.get("useMin")?.setValue(true);
      g.get("useMax")?.setValue(false);
      g.get("max")?.setValue(null);
    } else {
      g.get("useMin")?.setValue(false);
      g.get("useMax")?.setValue(true);
      g.get("min")?.setValue(null);
    }
  }
  toggleUseMin(i, checked) {
    const g = this.rangosFA.at(i);
    g.get("useMin")?.setValue(checked);
    if (!checked)
      g.get("min")?.setValue(null);
  }
  toggleUseMax(i, checked) {
    const g = this.rangosFA.at(i);
    g.get("useMax")?.setValue(checked);
    if (!checked)
      g.get("max")?.setValue(null);
  }
  fieldLabel(key) {
    const k = String(key || "").toUpperCase();
    const f = this.rangeFields.find((x) => x.key === k);
    return f?.label ?? k;
  }
  aliasKeys(raw) {
    const k = raw.toUpperCase();
    switch (k) {
      case "MORA":
      case "SALDO_MORA":
        return ["SALDO_MORA", "MORA", "SALDO MORA"];
      case "BAJA30":
        return ["BAJA30", "BAJA_30", "BAJA 30"];
      case "BAJA30_SALDOMORA":
        return ["BAJA30_SALDOMORA", "BAJA30_SALDO_MORA", "BAJA 30 SALDO MORA"];
      case "DEUDA_TOTAL":
        return ["DEUDA_TOTAL", "DEUDA TOTAL"];
      case "LTD_LTDE":
        return ["LTD_LTDE", "LTD+LTDE", "LTD LTDE"];
      default:
        return [k, k.replace(/\s+/g, "_")];
    }
  }
  getVal(r, key) {
    const candidates = this.aliasKeys(key);
    for (const c of candidates) {
      if (r.hasOwnProperty(c))
        return r[c];
    }
    return void 0;
  }
  get smsCtrl() {
    return this.form.controls.plantillaTexto;
  }
  smsLength() {
    return (this.smsCtrl.value || "").length;
  }
  smsSegundos() {
    const n = this.smsLength();
    return Math.max(1, Math.ceil(n / 20));
  }
  ngOnInit() {
    const embebido = this.data?.plantillaTexto ?? "";
    if (embebido && typeof embebido === "string") {
      this.smsCtrl.setValue(embebido);
      this.smsCtrl.markAsPristine();
      this.syncNombreChipWithText();
      this.fetchSampleRow();
    } else if (this.data.plantillaSmsId) {
      this.api.getPlantillaTexto(this.data.plantillaSmsId).subscribe({
        next: (txt) => {
          const real = typeof txt === "string" ? txt : txt?.template ?? "";
          this.smsCtrl.setValue(real || "");
          this.smsCtrl.markAsPristine();
          this.syncNombreChipWithText();
          this.fetchSampleRow();
        },
        error: (_) => {
          this.smsCtrl.setValue("");
          this.smsCtrl.markAsPristine();
          this.syncNombreChipWithText();
          this.fetchSampleRow();
        }
      });
    }
    this.fetchSampleRow();
    this.smsCtrl.valueChanges.pipe(debounceTime(200)).subscribe(() => {
      this.syncNombreChipWithText();
      this.fetchSampleRow();
    });
    const incoming = this.data?.rangos;
    if (Array.isArray(incoming) && incoming.length) {
      this.hydrateRanges(incoming);
    } else {
      this.api.get(this.data.id).subscribe({
        next: (full) => {
          const fromApi = full?.rangos;
          if (Array.isArray(fromApi) && fromApi.length) {
            this.rangosFA.clear();
            this.hydrateRanges(fromApi);
          }
        }
      });
    }
  }
  hydrateRanges(rangos) {
    for (const r of rangos) {
      const g = this.makeRange();
      g.get("field")?.setValue(String(r.field || "DEUDA_TOTAL").toUpperCase());
      g.get("inclusiveMin")?.setValue(r.inclusiveMin ?? r.inclusive_min ?? false);
      g.get("inclusiveMax")?.setValue(r.inclusiveMax ?? r.inclusive_max ?? true);
      const hasMin = r.min != null;
      const hasMax = r.max != null;
      if (hasMin && hasMax) {
        g.get("mode")?.setValue("gt");
        g.get("useMin")?.setValue(true);
        g.get("useMax")?.setValue(true);
      } else if (hasMin) {
        g.get("mode")?.setValue("gt");
        g.get("useMin")?.setValue(true);
        g.get("useMax")?.setValue(false);
      } else if (hasMax) {
        g.get("mode")?.setValue("lt");
        g.get("useMin")?.setValue(false);
        g.get("useMax")?.setValue(true);
      } else {
        continue;
      }
      g.get("min")?.setValue(hasMin ? Number(r.min) : null);
      g.get("max")?.setValue(hasMax ? Number(r.max) : null);
      g.get("inclusiveMin")?.setValue(!!r.inclusiveMin);
      g.get("inclusiveMax")?.setValue(!!r.inclusiveMax);
      this.rangosFA.push(g);
    }
  }
  fetchSampleRow() {
    this.api.previewFromCombo(this.data.id, 100).subscribe({
      next: (rows) => this.sampleRow.set(rows?.[0] ?? null),
      error: () => this.sampleRow.set(null)
    });
  }
  renderTemplate(tpl, row) {
    if (!tpl)
      return "";
    if (!row)
      return tpl;
    const r = row;
    const firstName = (s) => String(s ?? "").split(/\s+/)[0] || "";
    const fmtInt = (v) => Number.isFinite(Number(v)) ? Math.trunc(Number(v)).toLocaleString("es-PE") : "";
    const hoy = /* @__PURE__ */ new Date();
    const manana = new Date(hoy.getTime() + 864e5);
    const fmtDate = (d) => d.toLocaleDateString("es-PE", { day: "2-digit", month: "2-digit" });
    return tpl.replace(VAR_RE, (_m, keyRaw) => {
      const key = String(keyRaw).toUpperCase();
      switch (key) {
        case "NOMBRE":
          return firstName(this.getVal(r, "NOMBRE"));
        case "HOY":
          return fmtDate(hoy);
        case "MANANA":
          return fmtDate(manana);
        case "DIASMORA":
        case "LTD":
        case "LTDE":
        case "LTD_LTDE":
        case "BAJA30":
        case "SALDO_MORA":
        case "BAJA30_SALDOMORA":
        case "CAPITAL":
        case "DEUDA_TOTAL":
        case "PKM":
          return fmtInt(this.getVal(r, key));
        default:
          const v = this.getVal(r, key);
          return v === void 0 ? "" : String(v);
      }
    });
  }
  onChipClick(ev, k) {
    ev.preventDefault();
    ev.stopPropagation();
    this.toggleSelect(k);
  }
  placeholderFromKey(k) {
    return k;
  }
  // --- helpers que pide el HTML ---
  hasSelect(k) {
    if (k === "NOMBRE") {
      const cur = this.form.controls.plantillaTexto.value || "";
      return /\{NOMBRE\}/i.test(cur);
    }
    return this.selected.has(k);
  }
  toggleSelect(k) {
    const was = this.selected.has(k);
    const ph = this.placeholderFromKey(k);
    if (was) {
      this.selected.delete(k);
      this.removePlaceholder(ph);
    } else {
      if (k === "BAJA30" || k === "SALDO_MORA") {
        this.forceDeselect("BAJA30_SALDOMORA");
      }
      if (k === "BAJA30_SALDOMORA") {
        this.forceDeselect("BAJA30");
        this.forceDeselect("SALDO_MORA");
      }
      if (k === "LTD" || k === "LTDE") {
        this.forceDeselect("LTD_LTDE");
      }
      if (k === "LTD_LTDE") {
        this.forceDeselect("LTD");
        this.forceDeselect("LTDE");
      }
      this.selected.add(k);
      this.insertPlaceholderOnce(ph);
    }
    if (!this.hasTopUpSelect()) {
      this.form.controls.importeExtra.setValue(0);
    }
  }
  close() {
    this.dialogRef.close();
  }
  save() {
    this.submitted = true;
    if (this.form.invalid) {
      this.smsCtrl.markAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const condiciones = [];
    if (v.cond_PROMESAS_HOY)
      condiciones.push("PROMESAS_HOY");
    if (v.cond_PROMESAS_MANANA)
      condiciones.push("PROMESAS_MANANA");
    if (v.cond_PROMESAS_MANANA2)
      condiciones.push("PROMESAS_MANANA2");
    if (v.cond_PROMESAS_ROTAS)
      condiciones.push("PROMESAS_ROTAS");
    const importeExtraAplica = this.hasTopUpSelect() && Number(v.importeExtra) > 0 ? Math.trunc(Number(v.importeExtra)) : null;
    const selectsSet = new Set(this.selected);
    if (/\{NOMBRE\}/i.test(v.plantillaTexto || "")) {
      selectsSet.add("NOMBRE");
    }
    const rangos = this.rangosFA.controls.map((g) => {
      const field = String(g.get("field")?.value || "").toUpperCase();
      const useMin = !!g.get("useMin")?.value;
      const useMax = !!g.get("useMax")?.value;
      const rawMin = g.get("min")?.value;
      const rawMax = g.get("max")?.value;
      const minNum = Number(rawMin);
      const maxNum = Number(rawMax);
      return {
        field,
        min: useMin && Number.isFinite(minNum) ? minNum : void 0,
        // 👈 evita NaN
        max: useMax && Number.isFinite(maxNum) ? maxNum : void 0,
        // 👈 evita NaN
        inclusiveMin: !!g.get("inclusiveMin")?.value,
        inclusiveMax: !!g.get("inclusiveMax")?.value
      };
    }).filter((r) => r.min != null || r.max != null);
    const payload = {
      id: this.data.id,
      // si decides dejar el PUT sin /{id}, igual lo mandas
      name: v.nombre,
      descripcion: v.descripcion,
      tramo: v.tramo,
      selects: Array.from(selectsSet),
      restricciones: {
        noContenido: !!v.noContenido,
        excluirPromesasPeriodoActual: !!v.excluirPromesasPeriodoActual,
        excluirCompromisos: !!v.excluirCompromisos,
        excluirBlacklist: !!v.excluirBlacklist
      },
      plantillaSmsId: this.data.plantillaSmsId ?? null,
      // << AÑADIR ESTO
      plantillaTexto: v.plantillaTexto,
      // 👈 ENVIAR TEXTO
      plantillaName: v.nombre,
      condiciones,
      importeExtra: importeExtraAplica,
      rangos: rangos.length ? rangos : []
    };
    this.saving = true;
    this.api.update(this.data.id, payload).subscribe({
      next: () => {
        this.saving = false;
        this.showSuccess("Cambios guardados", "Se actualizaron los datos del combo.").subscribe(() => {
          this.dialogRef.close(true);
          this.router.navigate(["/sms/combos"]);
        });
      },
      error: () => {
        this.saving = false;
        this.dialogRef.close(false);
      }
    });
  }
  insertPlaceholderOnce(placeholderKey) {
    const ctrl = this.form.controls.plantillaTexto;
    const cur = ctrl.value ?? "";
    const re = new RegExp(`\\{${placeholderKey}\\}(?!\\w)`, "i");
    if (re.test(cur))
      return;
    const sep = cur && !cur.endsWith(" ") ? " " : "";
    ctrl.setValue(cur + `${sep}{${placeholderKey}}`);
    ctrl.markAsDirty();
  }
  removePlaceholder(key) {
    const ctrl = this.form.controls.plantillaTexto;
    const cur = ctrl.value ?? "";
    const re = new RegExp(`\\s*\\{${key}\\}`, "i");
    const next = cur.replace(re, "");
    if (next !== cur) {
      ctrl.setValue(next);
      ctrl.markAsDirty();
    }
  }
  showSuccess(title, message, ms = 1800) {
    return this.dialog.open(SuccessDialogComponent, {
      data: { title, message, autoCloseMs: ms },
      panelClass: "dialog-success",
      disableClose: true
    }).afterClosed();
  }
  syncNombreChipWithText() {
    const has = /\{NOMBRE\}/i.test(this.smsCtrl.value || "");
    if (has)
      this.selected.add("NOMBRE");
    else
      this.selected.delete("NOMBRE");
  }
  forceDeselect(k) {
    if (!this.selected.has(k))
      return;
    this.selected.delete(k);
    this.removePlaceholder(this.placeholderFromKey(k));
  }
  isChipDisabled(k) {
    if (this.selected.has(k))
      return false;
    if (k === "BAJA30_SALDOMORA") {
      return this.selected.has("BAJA30") || this.selected.has("SALDO_MORA");
    }
    if (k === "BAJA30" || k === "SALDO_MORA") {
      return this.selected.has("BAJA30_SALDOMORA");
    }
    if (k === "LTD_LTDE") {
      return this.selected.has("LTD") || this.selected.has("LTDE");
    }
    if (k === "LTD" || k === "LTDE") {
      return this.selected.has("LTD_LTDE");
    }
    return false;
  }
};
_EditComboDialogComponent.\u0275fac = function EditComboDialogComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _EditComboDialogComponent)();
};
_EditComboDialogComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _EditComboDialogComponent, selectors: [["app-edit-combo-dialog"]], decls: 135, vars: 52, consts: [["singleMode", ""], ["novalidate", "", 1, "dlg", 2, "display", "flex", "flex-direction", "column", "width", "640px", "max-height", "80vh", 3, "ngSubmit", "formGroup"], [1, "dlg__head", 2, "flex", "0 0 auto"], ["type", "button", "aria-label", "Cerrar", 1, "icon-btn", 3, "click"], [1, "dlg__body", 2, "flex", "1 1 auto", "overflow", "auto", "padding-right", "8px"], [1, "grid"], [1, "full"], ["formControlName", "nombre", "type", "text", "placeholder", "Nombre del combo"], [1, "row-between"], [1, "req"], ["formControlName", "plantillaTexto", "rows", "5", "placeholder", "Hola {NOMBRE}, \u2026"], ["class", "error", 4, "ngIf"], [1, "preview-box"], [1, "character-meter"], [1, "character-bar"], [1, "character-count"], [1, "adv", 2, "margin-top", "16px"], [1, "adv__title", 2, "font-weight", "600", "background", "#f6f7f9", "padding", "12px 16px", "border-radius", "10px"], [1, "grid", 2, "margin-top", "12px"], [1, "group-card", "group--tramo"], ["formControlName", "tramo"], ["value", "3"], ["value", "5"], ["value", "CONTACTO_TOTAL"], [1, "group-card", "group--selects"], [1, "chip-groups"], [1, "chip-group", "chip-group--cliente"], [1, "chip-group-title"], [1, "chip-container"], ["type", "button", 1, "chip", 3, "click"], [1, "chip-group", "chip-group--financiero"], ["type", "button", 1, "chip", 3, "click", "disabled"], [1, "chip-group", "chip-group--fechas"], ["class", "form-field", 4, "ngIf"], [1, "group-card", "group--rangos"], [1, "group-title", 2, "display", "flex", "align-items", "center", "justify-content", "space-between", "gap", "8px"], ["type", "button", 1, "btn", "btn-secondary", 3, "click"], ["class", "range-item", 3, "formGroup", 4, "ngFor", "ngForOf"], [1, "group-card", "group--cond"], [1, "group-title"], [1, "checks"], ["type", "checkbox", "formControlName", "cond_PROMESAS_HOY"], ["type", "checkbox", "formControlName", "cond_PROMESAS_MANANA"], ["type", "checkbox", "formControlName", "cond_PROMESAS_MANANA2"], ["type", "checkbox", "formControlName", "cond_PROMESAS_ROTAS"], [1, "group-card", "group--restr"], ["type", "checkbox", "formControlName", "noContenido"], ["type", "checkbox", "formControlName", "excluirPromesasPeriodoActual"], ["type", "checkbox", "formControlName", "excluirCompromisos"], ["type", "checkbox", "formControlName", "excluirBlacklist"], [1, "dlg__foot", 2, "flex", "0 0 auto"], ["type", "button", "mat-button", "", 3, "click"], ["type", "submit", "mat-raised-button", "", "color", "primary", 3, "disabled"], [1, "error"], [1, "form-field"], [1, "form-label"], ["type", "number", "min", "0", "step", "1", "formControlName", "importeExtra", "placeholder", "0", 1, "form-input"], [1, "range-item", 3, "formGroup"], ["class", "interval-mode", 4, "ngIf", "ngIfElse"], ["class", "hint error-inline", 4, "ngIf"], [1, "interval-mode"], [1, "interval-header"], ["formControlName", "field", "title", "Campo", 1, "form-select", "slim", "interval-field"], [3, "value", 4, "ngFor", "ngForOf"], ["type", "button", 1, "btn", "btn-danger", "btn-small", 3, "click"], [1, "material-icons"], [1, "interval-expression"], ["type", "number", "formControlName", "min", "placeholder", "m\xEDn", 1, "form-input", "slim", "interval-input"], [1, "interval-check"], ["type", "checkbox", "formControlName", "inclusiveMin"], [1, "interval-symbol"], [1, "interval-variable"], ["type", "checkbox", "formControlName", "inclusiveMax"], ["type", "number", "formControlName", "max", "placeholder", "m\xE1x", 1, "form-input", "slim", "interval-input"], [1, "interval-footer"], [1, "tiny-check"], ["type", "checkbox", "checked", "", 3, "change"], [3, "value"], [1, "range-row"], ["formControlName", "field", "title", "Campo", 1, "form-select", "slim", "col-field"], ["title", "Operador", 1, "form-select", "slim", "col-op", 3, "change", "value"], ["value", "gt"], ["value", "lt"], [1, "value-box", "col-value"], [3, "ngSwitch"], [4, "ngSwitchCase"], ["type", "button", 1, "btn", "btn-danger", "btn-small", "col-del", 3, "click"], [1, "hint", 2, "margin", "8px 0 0 0"], [4, "ngIf"], ["type", "number", "formControlName", "min", "placeholder", "valor m\xEDnimo", 1, "form-input", "slim"], ["type", "number", "formControlName", "max", "placeholder", "valor m\xE1ximo", 1, "form-input", "slim"], ["type", "checkbox", 3, "change", "checked"], [1, "hint", "error-inline"]], template: function EditComboDialogComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "form", 1);
    \u0275\u0275listener("ngSubmit", function EditComboDialogComponent_Template_form_ngSubmit_0_listener() {
      return ctx.save();
    });
    \u0275\u0275elementStart(1, "header", 2)(2, "h2");
    \u0275\u0275text(3, "Editar");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "button", 3);
    \u0275\u0275listener("click", function EditComboDialogComponent_Template_button_click_4_listener() {
      return ctx.close();
    });
    \u0275\u0275text(5, "\u2715");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "section", 4)(7, "div", 5)(8, "div", 6)(9, "label");
    \u0275\u0275text(10, "Nombre");
    \u0275\u0275elementEnd();
    \u0275\u0275element(11, "input", 7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "div", 6)(13, "div", 8)(14, "label");
    \u0275\u0275text(15, "Texto de SMS (Plantilla) ");
    \u0275\u0275elementStart(16, "span", 9);
    \u0275\u0275text(17, "*");
    \u0275\u0275elementEnd()()();
    \u0275\u0275element(18, "textarea", 10);
    \u0275\u0275template(19, EditComboDialogComponent_div_19_Template, 2, 0, "div", 11);
    \u0275\u0275elementStart(20, "label");
    \u0275\u0275text(21, "Preview");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "div", 12);
    \u0275\u0275text(23);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "div", 13);
    \u0275\u0275element(25, "div", 14);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "div", 15);
    \u0275\u0275text(27);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(28, "section", 16)(29, "div", 17);
    \u0275\u0275text(30, " Opciones avanzadas ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "div", 18)(32, "div", 19)(33, "label");
    \u0275\u0275text(34, "Tramo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(35, "select", 20)(36, "option", 21);
    \u0275\u0275text(37, "Tramo 3");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(38, "option", 22);
    \u0275\u0275text(39, "Tramo 5");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(40, "option", 23);
    \u0275\u0275text(41, "Cartera Propia");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(42, "div", 24)(43, "label");
    \u0275\u0275text(44, "Selecci\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(45, "div", 25)(46, "div", 26)(47, "h4", 27);
    \u0275\u0275text(48, "Cliente");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(49, "div", 28)(50, "button", 29);
    \u0275\u0275listener("click", function EditComboDialogComponent_Template_button_click_50_listener($event) {
      return ctx.onChipClick($event, "NOMBRE");
    });
    \u0275\u0275text(51, "Nombre");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(52, "button", 29);
    \u0275\u0275listener("click", function EditComboDialogComponent_Template_button_click_52_listener($event) {
      return ctx.onChipClick($event, "NOMBRECOMPLETO");
    });
    \u0275\u0275text(53, "Nombre completo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(54, "button", 29);
    \u0275\u0275listener("click", function EditComboDialogComponent_Template_button_click_54_listener($event) {
      return ctx.onChipClick($event, "EMAIL");
    });
    \u0275\u0275text(55, "Correo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(56, "button", 29);
    \u0275\u0275listener("click", function EditComboDialogComponent_Template_button_click_56_listener($event) {
      return ctx.onChipClick($event, "NUMCUENTAPMCP");
    });
    \u0275\u0275text(57, "N\xB0 de Cuenta");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(58, "div", 30)(59, "h4", 27);
    \u0275\u0275text(60, "Financiero");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(61, "div", 28)(62, "button", 31);
    \u0275\u0275listener("click", function EditComboDialogComponent_Template_button_click_62_listener($event) {
      return ctx.onChipClick($event, "LTD");
    });
    \u0275\u0275text(63, "LTD");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(64, "button", 31);
    \u0275\u0275listener("click", function EditComboDialogComponent_Template_button_click_64_listener($event) {
      return ctx.onChipClick($event, "LTDE");
    });
    \u0275\u0275text(65, "LTDE");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(66, "button", 31);
    \u0275\u0275listener("click", function EditComboDialogComponent_Template_button_click_66_listener($event) {
      return ctx.onChipClick($event, "LTD_LTDE");
    });
    \u0275\u0275text(67, "LTD + LTDE");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(68, "button", 31);
    \u0275\u0275listener("click", function EditComboDialogComponent_Template_button_click_68_listener($event) {
      return ctx.onChipClick($event, "BAJA30");
    });
    \u0275\u0275text(69, "Baja 30");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(70, "button", 31);
    \u0275\u0275listener("click", function EditComboDialogComponent_Template_button_click_70_listener($event) {
      return ctx.onChipClick($event, "SALDO_MORA");
    });
    \u0275\u0275text(71, "Mora");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(72, "button", 31);
    \u0275\u0275listener("click", function EditComboDialogComponent_Template_button_click_72_listener($event) {
      return ctx.onChipClick($event, "BAJA30_SALDOMORA");
    });
    \u0275\u0275text(73, "Baja 30 y Saldo Mora");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(74, "button", 29);
    \u0275\u0275listener("click", function EditComboDialogComponent_Template_button_click_74_listener($event) {
      return ctx.onChipClick($event, "PKM");
    });
    \u0275\u0275text(75, "PKM");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(76, "button", 29);
    \u0275\u0275listener("click", function EditComboDialogComponent_Template_button_click_76_listener($event) {
      return ctx.onChipClick($event, "CAPITAL");
    });
    \u0275\u0275text(77, "Capital");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(78, "button", 29);
    \u0275\u0275listener("click", function EditComboDialogComponent_Template_button_click_78_listener($event) {
      return ctx.onChipClick($event, "DEUDA_TOTAL");
    });
    \u0275\u0275text(79, "Deuda Total");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(80, "div", 32)(81, "h4", 27);
    \u0275\u0275text(82, "Fechas");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(83, "div", 28)(84, "button", 29);
    \u0275\u0275listener("click", function EditComboDialogComponent_Template_button_click_84_listener($event) {
      return ctx.onChipClick($event, "DIASMORA");
    });
    \u0275\u0275text(85, "D\xEDas mora");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(86, "button", 29);
    \u0275\u0275listener("click", function EditComboDialogComponent_Template_button_click_86_listener($event) {
      return ctx.onChipClick($event, "HOY");
    });
    \u0275\u0275text(87, "Hoy");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(88, "button", 29);
    \u0275\u0275listener("click", function EditComboDialogComponent_Template_button_click_88_listener($event) {
      return ctx.onChipClick($event, "MANANA");
    });
    \u0275\u0275text(89, "Ma\xF1ana");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275template(90, EditComboDialogComponent_div_90_Template, 4, 0, "div", 33);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(91, "div", 34)(92, "div", 35)(93, "span");
    \u0275\u0275text(94, "Rangos");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(95, "button", 36);
    \u0275\u0275listener("click", function EditComboDialogComponent_Template_button_click_95_listener() {
      return ctx.addRange();
    });
    \u0275\u0275text(96, " + A\xF1adir rango ");
    \u0275\u0275elementEnd()();
    \u0275\u0275template(97, EditComboDialogComponent_div_97_Template, 5, 4, "div", 37);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(98, "div", 38)(99, "div", 39);
    \u0275\u0275text(100, "Condiciones");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(101, "div", 40)(102, "label");
    \u0275\u0275element(103, "input", 41);
    \u0275\u0275text(104, " Promesas HOY");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(105, "label");
    \u0275\u0275element(106, "input", 42);
    \u0275\u0275text(107, " Promesas MA\xD1ANA");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(108, "label");
    \u0275\u0275element(109, "input", 43);
    \u0275\u0275text(110, " Promesas HOY y MA\xD1ANA");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(111, "label");
    \u0275\u0275element(112, "input", 44);
    \u0275\u0275text(113, " Promesas ROTAS");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(114, "div", 45)(115, "div", 39);
    \u0275\u0275text(116, "Restricciones");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(117, "div", 40)(118, "label");
    \u0275\u0275element(119, "input", 46);
    \u0275\u0275text(120, " No Contenido");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(121, "label");
    \u0275\u0275element(122, "input", 47);
    \u0275\u0275text(123, " Excluir promesas periodo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(124, "label");
    \u0275\u0275element(125, "input", 48);
    \u0275\u0275text(126, " Excluir compromisos");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(127, "label");
    \u0275\u0275element(128, "input", 49);
    \u0275\u0275text(129, " Excluir blacklist");
    \u0275\u0275elementEnd()()()()()();
    \u0275\u0275elementStart(130, "footer", 50)(131, "button", 51);
    \u0275\u0275listener("click", function EditComboDialogComponent_Template_button_click_131_listener() {
      return ctx.close();
    });
    \u0275\u0275text(132, "Cancelar");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(133, "button", 52);
    \u0275\u0275text(134);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    \u0275\u0275property("formGroup", ctx.form);
    \u0275\u0275advance(19);
    \u0275\u0275property("ngIf", ctx.smsCtrl.invalid && (ctx.smsCtrl.dirty || ctx.submitted));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", ctx.previewText() || "Tu SMS aparecer\xE1 aqu\xED\u2026", " ");
    \u0275\u0275advance(2);
    \u0275\u0275styleProp("width", ctx.Math.min(ctx.previewText().length / 160 * 100, 100), "%");
    \u0275\u0275classProp("warning", ctx.previewText().length > 120)("danger", ctx.previewText().length > 160);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx.previewText().length, " / 160 ");
    \u0275\u0275advance(23);
    \u0275\u0275classProp("active", ctx.hasSelect("NOMBRE"));
    \u0275\u0275advance(2);
    \u0275\u0275classProp("active", ctx.hasSelect("NOMBRECOMPLETO"));
    \u0275\u0275advance(2);
    \u0275\u0275classProp("active", ctx.hasSelect("EMAIL"));
    \u0275\u0275advance(2);
    \u0275\u0275classProp("active", ctx.hasSelect("NUMCUENTAPMCP"));
    \u0275\u0275advance(6);
    \u0275\u0275classProp("active", ctx.hasSelect("LTD"));
    \u0275\u0275property("disabled", ctx.isChipDisabled("LTD"));
    \u0275\u0275advance(2);
    \u0275\u0275classProp("active", ctx.hasSelect("LTDE"));
    \u0275\u0275property("disabled", ctx.isChipDisabled("LTDE"));
    \u0275\u0275advance(2);
    \u0275\u0275classProp("active", ctx.hasSelect("LTD_LTDE"));
    \u0275\u0275property("disabled", ctx.isChipDisabled("LTD_LTDE"));
    \u0275\u0275advance(2);
    \u0275\u0275classProp("active", ctx.hasSelect("BAJA30"));
    \u0275\u0275property("disabled", ctx.isChipDisabled("BAJA30"));
    \u0275\u0275advance(2);
    \u0275\u0275classProp("active", ctx.hasSelect("SALDO_MORA"));
    \u0275\u0275property("disabled", ctx.isChipDisabled("SALDO_MORA"));
    \u0275\u0275advance(2);
    \u0275\u0275classProp("active", ctx.hasSelect("BAJA30_SALDOMORA"));
    \u0275\u0275property("disabled", ctx.isChipDisabled("BAJA30_SALDOMORA"));
    \u0275\u0275advance(2);
    \u0275\u0275classProp("active", ctx.hasSelect("PKM"));
    \u0275\u0275advance(2);
    \u0275\u0275classProp("active", ctx.hasSelect("CAPITAL"));
    \u0275\u0275advance(2);
    \u0275\u0275classProp("active", ctx.hasSelect("DEUDA_TOTAL"));
    \u0275\u0275advance(6);
    \u0275\u0275classProp("active", ctx.hasSelect("DIASMORA"));
    \u0275\u0275advance(2);
    \u0275\u0275classProp("active", ctx.hasSelect("HOY"));
    \u0275\u0275advance(2);
    \u0275\u0275classProp("active", ctx.hasSelect("MANANA"));
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", ctx.hasTopUpSelect());
    \u0275\u0275advance(7);
    \u0275\u0275property("ngForOf", ctx.rangosFA.controls);
    \u0275\u0275advance(36);
    \u0275\u0275property("disabled", ctx.form.invalid || ctx.saving);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx.saving ? "Guardando\u2026" : "Guardar", " ");
  }
}, dependencies: [CommonModule, NgForOf, NgIf, NgSwitch, NgSwitchCase, ReactiveFormsModule, \u0275NgNoValidate, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, NumberValueAccessor, CheckboxControlValueAccessor, SelectControlValueAccessor, NgControlStatus, NgControlStatusGroup, MinValidator, FormGroupDirective, FormControlName, MatButtonModule, MatButton, MatCheckboxModule, MatSelectModule, MatInputModule], styles: ['\n\n[_nghost-%COMP%]     .combo-dialog .mdc-dialog__surface {\n  border-radius: 20px !important;\n  overflow: hidden;\n  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;\n}\n[_nghost-%COMP%]     .combo-dialog .mat-mdc-dialog-container {\n  --mdc-dialog-container-shape: 20px;\n}\n.dlg[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  max-height: 80vh;\n  background: #ffffff;\n  border-radius: 20px;\n  overflow: hidden;\n}\n.dlg__head[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 14px;\n  padding: 20px 24px;\n  background:\n    linear-gradient(\n      135deg,\n      #f8fafc 0%,\n      #f1f5f9 100%);\n  border-bottom: 1px solid #e2e8f0;\n  position: relative;\n}\n.dlg__head[_ngcontent-%COMP%]::after {\n  content: "";\n  position: absolute;\n  bottom: 0;\n  left: 24px;\n  right: 24px;\n  height: 1px;\n  background:\n    linear-gradient(\n      90deg,\n      transparent,\n      #cbd5e1,\n      transparent);\n}\n.dlg__head[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 1.25rem;\n  font-weight: 700;\n  color: #1e293b;\n  letter-spacing: -0.025em;\n}\n.icon-btn[_ngcontent-%COMP%] {\n  border: none;\n  background: #f1f5f9;\n  font-size: 18px;\n  margin-left: auto;\n  cursor: pointer;\n  width: 36px;\n  height: 36px;\n  border-radius: 10px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  color: #64748b;\n  transition: all 0.2s ease;\n}\n.icon-btn[_ngcontent-%COMP%]:hover {\n  background: #e2e8f0;\n  color: #1e293b;\n  transform: scale(1.05);\n}\n.dlg__body[_ngcontent-%COMP%] {\n  padding: 24px;\n  overflow-y: auto;\n  background: #ffffff;\n}\n.dlg__foot[_ngcontent-%COMP%] {\n  padding: 16px 24px;\n  border-top: 1px solid #e2e8f0;\n  background:\n    linear-gradient(\n      135deg,\n      #f8fafc 0%,\n      #ffffff 100%);\n  box-shadow: 0 -4px 20px -5px rgba(0, 0, 0, 0.08);\n  display: flex;\n  justify-content: flex-end;\n  gap: 12px;\n}\n.dlg__foot[_ngcontent-%COMP%]   button[_ngcontent-%COMP%], \n.dlg__foot[_ngcontent-%COMP%]   .btn-cancel[_ngcontent-%COMP%], \n.dlg__foot[_ngcontent-%COMP%]   .btn-save[_ngcontent-%COMP%] {\n  padding: 10px 20px;\n  border-radius: 10px;\n  font-weight: 600;\n  font-size: 0.9rem;\n  cursor: pointer;\n  transition: all 0.2s ease;\n  border: none;\n}\n.dlg__foot[_ngcontent-%COMP%]   .btn-cancel[_ngcontent-%COMP%], \n.dlg__foot[_ngcontent-%COMP%]   button[type=button][_ngcontent-%COMP%]:not(.btn-save) {\n  background: #f1f5f9;\n  color: #475569;\n  border: 1px solid #e2e8f0;\n}\n.dlg__foot[_ngcontent-%COMP%]   .btn-cancel[_ngcontent-%COMP%]:hover, \n.dlg__foot[_ngcontent-%COMP%]   button[type=button][_ngcontent-%COMP%]:not(.btn-save):hover {\n  background: #e2e8f0;\n  border-color: #cbd5e1;\n}\n.dlg__foot[_ngcontent-%COMP%]   .btn-save[_ngcontent-%COMP%], \n.dlg__foot[_ngcontent-%COMP%]   button[type=submit][_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #3b82f6 0%,\n      #2563eb 100%);\n  color: white;\n  box-shadow: 0 4px 14px -3px rgba(59, 130, 246, 0.4);\n}\n.dlg__foot[_ngcontent-%COMP%]   .btn-save[_ngcontent-%COMP%]:hover, \n.dlg__foot[_ngcontent-%COMP%]   button[type=submit][_ngcontent-%COMP%]:hover {\n  background:\n    linear-gradient(\n      135deg,\n      #2563eb 0%,\n      #1d4ed8 100%);\n  transform: translateY(-1px);\n  box-shadow: 0 6px 20px -3px rgba(59, 130, 246, 0.5);\n}\n.dlg__foot[_ngcontent-%COMP%]   .btn-save[_ngcontent-%COMP%]:disabled, \n.dlg__foot[_ngcontent-%COMP%]   button[type=submit][_ngcontent-%COMP%]:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n  transform: none;\n  box-shadow: none;\n}\n.grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(12, 1fr);\n  gap: 12px;\n}\n.grid[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%] {\n  grid-column: span 6;\n}\n.grid[_ngcontent-%COMP%]   .full[_ngcontent-%COMP%] {\n  grid-column: 1/-1;\n}\nlabel[_ngcontent-%COMP%] {\n  margin-bottom: 6px;\n}\ninput[_ngcontent-%COMP%], \nselect[_ngcontent-%COMP%], \ntextarea[_ngcontent-%COMP%] {\n  width: 100%;\n  border: 1.5px solid #d1d5db;\n  border-radius: 10px;\n  padding: 10px 12px;\n  outline: none;\n  background: #fff;\n  color: #0f172a;\n  transition: .15s border, .15s box-shadow;\n}\ninput[_ngcontent-%COMP%]:focus, \nselect[_ngcontent-%COMP%]:focus, \ntextarea[_ngcontent-%COMP%]:focus {\n  border-color: #3b82f6;\n  box-shadow: 0 0 0 3px rgba(99, 102, 241, .15);\n}\ntextarea[_ngcontent-%COMP%] {\n  resize: vertical;\n}\n.req[_ngcontent-%COMP%] {\n  color: #ef4444;\n  font-weight: 700;\n}\n.row-between[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n}\n.muted[_ngcontent-%COMP%] {\n  color: #6b7280;\n  font-size: .85rem;\n}\n.hint[_ngcontent-%COMP%] {\n  color: #64748b;\n  font-size: .85rem;\n  margin-top: 6px;\n}\n.error[_ngcontent-%COMP%] {\n  color: #ef4444;\n  margin-top: 6px;\n}\n.chips[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 10px 12px;\n}\n.chip[_ngcontent-%COMP%] {\n  appearance: none;\n  border: 1px solid #cfd8dc;\n  background: #fff;\n  color: #111827;\n  border-radius: 999px;\n  padding: 8px 14px;\n  font-weight: 600;\n  line-height: 1.1;\n  cursor: pointer;\n  transition:\n    background .15s,\n    border-color .15s,\n    transform .04s;\n  box-shadow: 0 1px 0 rgba(0, 0, 0, .02);\n}\n.chip[_ngcontent-%COMP%]:hover {\n  background: #f8fafc;\n}\n.chip[_ngcontent-%COMP%]:active {\n  transform: translateY(1px);\n}\n.chip[_ngcontent-%COMP%]:focus-visible {\n  outline: 2px solid #3b82f6;\n  outline-offset: 2px;\n}\n.chip.active[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      var(--group-accent, #2563eb) 0%,\n      var(--group-accent-2, #2563eb) 100%);\n  border-color: var(--group-accent, #3b82f6);\n  color: #fff;\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);\n}\n.adv[_ngcontent-%COMP%] {\n  margin-top: 12px;\n  border: 1px solid #e5e7eb;\n  border-radius: 12px;\n  overflow: hidden;\n}\n.adv__title[_ngcontent-%COMP%] {\n  font-weight: 600;\n  background: #f6f7f9;\n  padding: 12px 16px;\n  border-bottom: 1px solid #e5e7eb;\n}\n.adv[_ngcontent-%COMP%]    > summary[_ngcontent-%COMP%] {\n  cursor: pointer;\n  padding: 10px 14px;\n  background: #f8fafc;\n  font-weight: 700;\n}\n.adv[open][_ngcontent-%COMP%]    > summary[_ngcontent-%COMP%] {\n  border-bottom: 1px solid #e5e7eb;\n}\n.adv[_ngcontent-%COMP%]   .grid[_ngcontent-%COMP%] {\n  padding: 14px 16px;\n  gap: 16px;\n}\n@media (min-width: 980px) {\n  .adv[_ngcontent-%COMP%]   .grid[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%]:nth-child(1) {\n    grid-column: span 4;\n  }\n  .adv[_ngcontent-%COMP%]   .grid[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%]:nth-child(2) {\n    grid-column: 1 / -1;\n  }\n  .adv[_ngcontent-%COMP%]   .grid[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%]:nth-child(3) {\n    grid-column: span 6;\n  }\n}\n@media (max-width: 980px) {\n  .grid[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%] {\n    grid-column: 1/-1;\n  }\n}\n.preview-box[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #2c3e50 0%,\n      #34495e 100%);\n  color: white;\n  padding: 16px;\n  border-radius: 12px;\n  min-height: 100px;\n  margin-bottom: 16px;\n  font-family: monospace;\n  font-size: 14px;\n  line-height: 1.5;\n}\n.character-meter[_ngcontent-%COMP%] {\n  background: #f3f4f6;\n  height: 8px;\n  border-radius: 4px;\n  overflow: hidden;\n  margin-bottom: 8px;\n}\n.character-bar[_ngcontent-%COMP%] {\n  height: 100%;\n  background:\n    linear-gradient(\n      90deg,\n      #10b981 0%,\n      #059669 100%);\n  transition: all 0.3s ease;\n  border-radius: 4px;\n}\n.character-bar.warning[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      90deg,\n      #f59e0b 0%,\n      #d97706 100%);\n}\n.character-bar.danger[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      90deg,\n      #ef4444 0%,\n      #dc2626 100%);\n}\n.character-count[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: #6b7280;\n  text-align: right;\n}\n@media (max-width: 980px) {\n  .checks[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n.checks[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));\n  gap: 12px;\n  width: 100%;\n}\n.checks[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  padding: 12px 14px;\n  border: 1px solid #e5e7eb;\n  border-radius: 12px;\n  background: #fff;\n  line-height: 1.25;\n  -webkit-user-select: none;\n  user-select: none;\n  cursor: pointer;\n  transition:\n    border-color .15s,\n    box-shadow .15s,\n    background .15s;\n}\n.checks[_ngcontent-%COMP%]   label[_ngcontent-%COMP%]:hover {\n  border-color: #cbd5e1;\n  box-shadow: 0 2px 10px -8px rgba(0, 0, 0, .25);\n}\n.checks[_ngcontent-%COMP%]   label[_ngcontent-%COMP%]:has(input:checked) {\n  border-color: #3b82f6;\n  background: #eef2ff;\n  box-shadow: 0 0 0 3px rgba(79, 70, 229, .12) inset;\n}\n.checks[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  transform: scale(1.05);\n  margin-top: 1px;\n  width: 16px;\n}\n.chip-groups[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 12px;\n}\n.chip-group[_ngcontent-%COMP%] {\n  border: 1px solid #e9ecf3;\n  background: #fff;\n  border-radius: 12px;\n  padding: 12px;\n}\n.chip-group-title[_ngcontent-%COMP%] {\n  margin: 0 0 8px 0;\n  font-size: 14px;\n  font-weight: 600;\n  color: #4b587c;\n}\n.chip-container[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 10px;\n  align-items: center;\n}\n.chip[_ngcontent-%COMP%] {\n  padding: 8px 14px;\n  border-radius: 999px;\n  border: 1px solid #dfe3ee;\n  background: #f8f9fc;\n  cursor: pointer;\n  font-size: 13px;\n}\n.chip-group--cliente[_ngcontent-%COMP%] {\n  --group-accent: #3b82f6;\n  --group-accent-2: #1d4ed8;\n}\n.chip-group--financiero[_ngcontent-%COMP%] {\n  --group-accent: #3b82f6;\n  --group-accent-2: #1d4ed8;\n}\n.chip-group--fechas[_ngcontent-%COMP%] {\n  --group-accent: #3b82f6;\n  --group-accent-2: #1d4ed8;\n}\n.chip.active[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      var(--group-accent, #2563eb) 0%,\n      var(--group-accent-2, #2563eb) 100%);\n  border-color: var(--group-accent, #3b82f6);\n  color: #fff;\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);\n}\n.form-label[_ngcontent-%COMP%] {\n  display: block;\n  font-weight: 500;\n  color: #374151;\n  margin-top: 25px;\n  margin-bottom: 8px;\n  font-size: 14px;\n}\n.chip[disabled][_ngcontent-%COMP%] {\n  opacity: 0.45;\n  cursor: not-allowed;\n  pointer-events: none;\n}\n.adv[_ngcontent-%COMP%] {\n  margin-top: 12px;\n  border: 1px solid #e5e7eb;\n  border-radius: 12px;\n  overflow: hidden;\n}\n.adv__title[_ngcontent-%COMP%] {\n  font-weight: 600;\n  background: #f6f7f9;\n  padding: 12px 16px;\n  border-bottom: 1px solid #e5e7eb;\n}\n.adv[_ngcontent-%COMP%]   .grid[_ngcontent-%COMP%] {\n  padding: 14px 16px;\n  gap: 16px;\n  display: grid;\n  grid-template-columns: repeat(12, 1fr);\n}\n.group-card[_ngcontent-%COMP%] {\n  border: 1px solid #e5e7eb;\n  background: #fff;\n  border-radius: 12px;\n  padding: 12px;\n}\n.group-title[_ngcontent-%COMP%] {\n  margin: 0 0 10px 0;\n  font-size: 14px;\n  font-weight: 600;\n  color: #374151;\n}\n@media (min-width: 980px) {\n  .group--tramo[_ngcontent-%COMP%] {\n    grid-column: span 4;\n  }\n  .group--selects[_ngcontent-%COMP%] {\n    grid-column: 1 / -1;\n  }\n  .group--cond[_ngcontent-%COMP%] {\n    grid-column: span 6;\n  }\n  .group--restr[_ngcontent-%COMP%] {\n    grid-column: span 6;\n  }\n}\n@media (max-width: 980px) {\n  .group--tramo[_ngcontent-%COMP%], \n   .group--selects[_ngcontent-%COMP%], \n   .group--cond[_ngcontent-%COMP%], \n   .group--restr[_ngcontent-%COMP%] {\n    grid-column: 1 / -1;\n  }\n}\n.adv[_ngcontent-%COMP%]   .grid[_ngcontent-%COMP%] {\n  padding: 14px 16px;\n  gap: 16px;\n  display: grid;\n  grid-template-columns: repeat(12, 1fr);\n}\n@media (min-width: 980px) {\n  .group--tramo[_ngcontent-%COMP%] {\n    grid-column: span 4;\n  }\n  .group--selects[_ngcontent-%COMP%] {\n    grid-column: 1 / -1;\n  }\n  .group--rangos[_ngcontent-%COMP%] {\n    grid-column: 1 / -1;\n  }\n  .group--cond[_ngcontent-%COMP%] {\n    grid-column: 1 / span 6;\n  }\n  .group--restr[_ngcontent-%COMP%] {\n    grid-column: 7 / span 6;\n  }\n}\n@media (max-width: 980px) {\n  .group--tramo[_ngcontent-%COMP%], \n   .group--selects[_ngcontent-%COMP%], \n   .group--rangos[_ngcontent-%COMP%], \n   .group--cond[_ngcontent-%COMP%], \n   .group--restr[_ngcontent-%COMP%] {\n    grid-column: 1 / -1;\n  }\n}\n@media (min-width: 980px) {\n  .adv[_ngcontent-%COMP%]   .grid[_ngcontent-%COMP%] {\n    display: grid !important;\n    grid-template-columns: repeat(12, 1fr) !important;\n    gap: 16px !important;\n  }\n  .adv[_ngcontent-%COMP%]   .grid[_ngcontent-%COMP%]    > .group--rangos[_ngcontent-%COMP%] {\n    grid-column: 1 / -1 !important;\n  }\n  .adv[_ngcontent-%COMP%]   .grid[_ngcontent-%COMP%]    > .group--cond[_ngcontent-%COMP%] {\n    grid-column: 1 / span 6 !important;\n  }\n  .adv[_ngcontent-%COMP%]   .grid[_ngcontent-%COMP%]    > .group--restr[_ngcontent-%COMP%] {\n    grid-column: 7 / span 6 !important;\n  }\n}\n@media (max-width: 980px) {\n  .adv[_ngcontent-%COMP%]   .grid[_ngcontent-%COMP%]    > .group--rangos[_ngcontent-%COMP%], \n   .adv[_ngcontent-%COMP%]   .grid[_ngcontent-%COMP%]    > .group--cond[_ngcontent-%COMP%], \n   .adv[_ngcontent-%COMP%]   .grid[_ngcontent-%COMP%]    > .group--restr[_ngcontent-%COMP%] {\n    grid-column: 1 / -1 !important;\n  }\n}\n.group--rangos[_ngcontent-%COMP%] {\n  display: block;\n}\n.group--rangos[_ngcontent-%COMP%]   .range-item[_ngcontent-%COMP%] {\n  display: block;\n  width: 100%;\n  box-sizing: border-box;\n  margin-bottom: 12px;\n}\n.group--rangos[_ngcontent-%COMP%]   .range-list[_ngcontent-%COMP%], \n.group--rangos[_ngcontent-%COMP%]   .range-container[_ngcontent-%COMP%] {\n  display: block;\n}\n.btn[_ngcontent-%COMP%] {\n  padding: 12px 24px;\n  border: none;\n  border-radius: 12px;\n  font-size: 14px;\n  font-weight: 500;\n  cursor: pointer;\n  transition: all 0.2s ease;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n}\n.btn-small[_ngcontent-%COMP%] {\n  padding: 8px 12px;\n  font-size: 12px;\n  border-radius: 10px;\n  line-height: 1;\n}\n.btn-danger[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #ef4444 0%,\n      #dc2626 100%);\n  color: #fff;\n  box-shadow: 0 4px 16px rgba(239, 68, 68, 0.3);\n}\n.btn-danger[_ngcontent-%COMP%]:hover {\n  transform: translateY(-1px);\n  box-shadow: 0 8px 24px rgba(239, 68, 68, 0.4);\n}\n.btn-secondary[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #3b82f6 0%,\n      #2563eb 100%);\n  color: #fff;\n  box-shadow: 0 4px 16px rgba(139, 92, 246, 0.3);\n}\n.btn-secondary[_ngcontent-%COMP%]:hover {\n  transform: translateY(-1px);\n  box-shadow: 0 8px 24px rgba(139, 92, 246, 0.4);\n}\n.group--rangos[_ngcontent-%COMP%] {\n  display: block;\n}\n.group--rangos[_ngcontent-%COMP%]   .range-item[_ngcontent-%COMP%] {\n  background: #fafafa;\n  border: 1px solid #e5e7eb;\n  border-radius: 12px;\n  padding: 12px;\n  margin-bottom: 12px;\n  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.02) inset;\n}\n.interval-mode[_ngcontent-%COMP%] {\n  background: #f8fafc;\n  border: 2px solid #e2e8f0;\n  border-radius: 12px;\n  padding: 16px;\n}\n.interval-header[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 16px;\n  gap: 12px;\n}\n.interval-header[_ngcontent-%COMP%]   .interval-field[_ngcontent-%COMP%] {\n  flex: 1;\n  max-width: 300px;\n}\n.interval-expression[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 16px;\n  padding: 20px 16px;\n  background: #fff;\n  border-radius: 10px;\n  border: 2px solid #e2e8f0;\n  flex-wrap: wrap;\n}\n.form-select.slim[_ngcontent-%COMP%], \n.form-input.slim[_ngcontent-%COMP%] {\n  height: 36px;\n  padding: 6px 10px;\n  border: 2px solid #e5e7eb;\n  border-radius: 10px;\n  background: #fff;\n  font-size: 14px;\n  transition: all .2s ease;\n}\n.interval-input[_ngcontent-%COMP%] {\n  width: 130px !important;\n  height: 42px !important;\n  text-align: center;\n  font-weight: 600;\n  font-size: 16px;\n  border: 2px solid #cbd5e1 !important;\n}\n.interval-input[_ngcontent-%COMP%]:focus {\n  border-color: #3b82f6 !important;\n}\n.interval-check[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 6px;\n  cursor: pointer;\n}\n.interval-check[_ngcontent-%COMP%]   input[type=checkbox][_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  cursor: pointer;\n}\n.interval-symbol[_ngcontent-%COMP%] {\n  font-size: 28px;\n  font-weight: 700;\n  color: #475569;\n  line-height: 1;\n  -webkit-user-select: none;\n  user-select: none;\n}\n.interval-variable[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #3b82f6 0%,\n      #2563eb 100%);\n  color: #fff;\n  padding: 12px 24px;\n  border-radius: 24px;\n  font-weight: 700;\n  font-size: 16px;\n  min-width: 140px;\n  text-align: center;\n  box-shadow: 0 4px 14px rgba(102, 126, 234, 0.35);\n  white-space: nowrap;\n}\n.interval-footer[_ngcontent-%COMP%] {\n  margin-top: 12px;\n  padding-top: 12px;\n  border-top: 1px solid #e2e8f0;\n  text-align: center;\n}\n.interval-footer[_ngcontent-%COMP%]   .tiny-check[_ngcontent-%COMP%] {\n  font-size: 13px;\n  color: #64748b;\n}\n.range-row[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 240px 80px 1fr max-content;\n  gap: 12px;\n  align-items: center;\n}\n.col-field[_ngcontent-%COMP%] {\n  grid-column: 1;\n}\n.col-op[_ngcontent-%COMP%] {\n  grid-column: 2;\n}\n.col-value[_ngcontent-%COMP%] {\n  grid-column: 3;\n}\n.col-del[_ngcontent-%COMP%] {\n  grid-column: 4;\n  justify-self: end;\n}\n.range-row[_ngcontent-%COMP%]   .value-box[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 10px;\n}\n.range-row[_ngcontent-%COMP%]   .form-input.slim[_ngcontent-%COMP%] {\n  width: 180px;\n}\n.tiny-check[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  font-size: 12px;\n  color: #6b7280;\n  cursor: pointer;\n}\n.tiny-check[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  transform: translateY(1px);\n}\n.hint.error-inline[_ngcontent-%COMP%] {\n  color: #ef4444;\n  font-weight: 500;\n  margin-top: 8px;\n}\n@media (max-width: 900px) {\n  .interval-expression[_ngcontent-%COMP%] {\n    gap: 12px;\n    padding: 16px 12px;\n  }\n  .interval-input[_ngcontent-%COMP%] {\n    width: 110px !important;\n  }\n  .interval-variable[_ngcontent-%COMP%] {\n    min-width: 120px;\n    font-size: 15px;\n    padding: 10px 20px;\n  }\n  .interval-symbol[_ngcontent-%COMP%] {\n    font-size: 24px;\n  }\n}\n@media (max-width: 700px) {\n  .interval-expression[_ngcontent-%COMP%] {\n    flex-direction: column;\n    gap: 10px;\n    padding: 16px;\n  }\n  .interval-input[_ngcontent-%COMP%] {\n    width: 100% !important;\n    max-width: 200px;\n  }\n  .interval-variable[_ngcontent-%COMP%] {\n    width: 100%;\n    max-width: 200px;\n  }\n  .range-row[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n    gap: 12px;\n  }\n  .range-row[_ngcontent-%COMP%]   .btn-small[_ngcontent-%COMP%] {\n    justify-self: stretch;\n  }\n}\n.group--rangos[_ngcontent-%COMP%]   .group-title[_ngcontent-%COMP%] {\n  font-size: 13px;\n}\n.group--rangos[_ngcontent-%COMP%]   .range-item[_ngcontent-%COMP%] {\n  padding: 10px;\n  border-radius: 10px;\n}\n.group--rangos[_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%] {\n  padding: 8px 14px;\n  font-size: 12px;\n  border-radius: 10px;\n  gap: 6px;\n}\n.group--rangos[_ngcontent-%COMP%]   .btn-small[_ngcontent-%COMP%] {\n  padding: 6px 10px;\n  font-size: 11px;\n  border-radius: 8px;\n  line-height: 1;\n}\n.group--rangos[_ngcontent-%COMP%]   .interval-mode[_ngcontent-%COMP%] {\n  padding: 12px;\n  border-radius: 10px;\n  border-width: 1.5px;\n}\n.group--rangos[_ngcontent-%COMP%]   .interval-header[_ngcontent-%COMP%] {\n  margin-bottom: 10px;\n  gap: 8px;\n}\n.group--rangos[_ngcontent-%COMP%]   .interval-header[_ngcontent-%COMP%]   .interval-field[_ngcontent-%COMP%] {\n  max-width: 100px;\n}\n.group--rangos[_ngcontent-%COMP%]   .interval-expression[_ngcontent-%COMP%] {\n  gap: 12px;\n  padding: 12px;\n  border-radius: 8px;\n  border-width: 1.5px;\n}\n.group--rangos[_ngcontent-%COMP%]   .form-select.slim[_ngcontent-%COMP%], \n.group--rangos[_ngcontent-%COMP%]   .form-input.slim[_ngcontent-%COMP%] {\n  height: 30px;\n  padding: 4px 8px;\n  font-size: 12px;\n  border-radius: 8px;\n  border-width: 1.5px;\n}\n.group--rangos[_ngcontent-%COMP%]   .interval-input[_ngcontent-%COMP%] {\n  width: 100px !important;\n  height: 36px !important;\n  font-size: 14px;\n  font-weight: 600;\n}\n.group--rangos[_ngcontent-%COMP%]   .interval-check[_ngcontent-%COMP%] {\n  gap: 4px;\n}\n.group--rangos[_ngcontent-%COMP%]   .interval-check[_ngcontent-%COMP%]   input[type=checkbox][_ngcontent-%COMP%] {\n  width: 14px;\n  height: 14px;\n}\n.group--rangos[_ngcontent-%COMP%]   .interval-symbol[_ngcontent-%COMP%] {\n  font-size: 22px;\n}\n.group--rangos[_ngcontent-%COMP%]   .interval-variable[_ngcontent-%COMP%] {\n  padding: 8px 16px;\n  border-radius: 18px;\n  font-size: 14px;\n  min-width: 110px;\n  box-shadow: 0 3px 10px rgba(102, 126, 234, .28);\n}\n.group--rangos[_ngcontent-%COMP%]   .interval-footer[_ngcontent-%COMP%] {\n  margin-top: 8px;\n  padding-top: 8px;\n}\n.group--rangos[_ngcontent-%COMP%]   .interval-footer[_ngcontent-%COMP%]   .tiny-check[_ngcontent-%COMP%] {\n  font-size: 12px;\n}\n.group--rangos[_ngcontent-%COMP%]   .range-row[_ngcontent-%COMP%] {\n  grid-template-columns: 200px 64px 1fr max-content;\n  gap: 8px;\n}\n.group--rangos[_ngcontent-%COMP%]   .range-row[_ngcontent-%COMP%]   .form-input.slim[_ngcontent-%COMP%] {\n  width: 140px;\n}\n.group--rangos[_ngcontent-%COMP%]   .tiny-check[_ngcontent-%COMP%] {\n  font-size: 11px;\n  gap: 4px;\n}\n.group--rangos[_ngcontent-%COMP%]   .tiny-check[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  transform: translateY(1px);\n}\n.group--rangos[_ngcontent-%COMP%]   .btn-danger.btn-small[_ngcontent-%COMP%] {\n  padding: 6px 10px;\n  font-size: 11px;\n}\n@media (max-width: 700px) {\n  .group--rangos[_ngcontent-%COMP%]   .interval-input[_ngcontent-%COMP%] {\n    width: 92px !important;\n  }\n  .group--rangos[_ngcontent-%COMP%]   .interval-variable[_ngcontent-%COMP%] {\n    min-width: 100px;\n    font-size: 13px;\n    padding: 7px 14px;\n  }\n  .group--rangos[_ngcontent-%COMP%]   .interval-symbol[_ngcontent-%COMP%] {\n    font-size: 20px;\n  }\n}\n.group--rangos[_ngcontent-%COMP%]   .hint[_ngcontent-%COMP%]   .tiny-check[_ngcontent-%COMP%], \n.group--rangos[_ngcontent-%COMP%]   .hint[_ngcontent-%COMP%]   .tiny-check[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  white-space: nowrap;\n}\n.group--rangos[_ngcontent-%COMP%]   .hint[_ngcontent-%COMP%]   .tiny-check[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  font-size: 12px;\n  line-height: 1.1;\n}\n.dark[_nghost-%COMP%]   .dlg[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .dlg[_ngcontent-%COMP%] {\n  background: #0f172a;\n}\n.dark[_nghost-%COMP%]   .dlg__head[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .dlg__head[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #1e293b 0%,\n      #0f172a 100%);\n  border-bottom-color: #334155;\n}\n.dark[_nghost-%COMP%]   .dlg__head[_ngcontent-%COMP%]::after, .dark   [_nghost-%COMP%]   .dlg__head[_ngcontent-%COMP%]::after {\n  background:\n    linear-gradient(\n      90deg,\n      transparent,\n      #475569,\n      transparent);\n}\n.dark[_nghost-%COMP%]   .dlg__head[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .dlg__head[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  color: #f8fafc;\n}\n.dark[_nghost-%COMP%]   .icon-btn[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .icon-btn[_ngcontent-%COMP%] {\n  background: #1e293b;\n  color: #94a3b8;\n}\n.dark[_nghost-%COMP%]   .icon-btn[_ngcontent-%COMP%]:hover, .dark   [_nghost-%COMP%]   .icon-btn[_ngcontent-%COMP%]:hover {\n  background: #334155;\n  color: #f8fafc;\n}\n.dark[_nghost-%COMP%]   .dlg__body[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .dlg__body[_ngcontent-%COMP%] {\n  background: #0f172a;\n}\n.dark[_nghost-%COMP%]   .dlg__foot[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .dlg__foot[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #1e293b 0%,\n      #0f172a 100%);\n  border-top-color: #334155;\n  box-shadow: 0 -4px 20px -5px rgba(0, 0, 0, 0.4);\n}\n.dark[_nghost-%COMP%]   .dlg__foot[_ngcontent-%COMP%]   .btn-cancel[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .dlg__foot[_ngcontent-%COMP%]   .btn-cancel[_ngcontent-%COMP%], \n.dark[_nghost-%COMP%]   .dlg__foot[_ngcontent-%COMP%]   button[type=button][_ngcontent-%COMP%]:not(.btn-save), .dark   [_nghost-%COMP%]   .dlg__foot[_ngcontent-%COMP%]   button[type=button][_ngcontent-%COMP%]:not(.btn-save) {\n  background: #1e293b;\n  color: #cbd5e1;\n  border-color: #334155;\n}\n.dark[_nghost-%COMP%]   .dlg__foot[_ngcontent-%COMP%]   .btn-cancel[_ngcontent-%COMP%]:hover, .dark   [_nghost-%COMP%]   .dlg__foot[_ngcontent-%COMP%]   .btn-cancel[_ngcontent-%COMP%]:hover, \n.dark[_nghost-%COMP%]   .dlg__foot[_ngcontent-%COMP%]   button[type=button][_ngcontent-%COMP%]:not(.btn-save):hover, .dark   [_nghost-%COMP%]   .dlg__foot[_ngcontent-%COMP%]   button[type=button][_ngcontent-%COMP%]:not(.btn-save):hover {\n  background: #334155;\n  border-color: #475569;\n}\n.dark[_nghost-%COMP%]   label[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   label[_ngcontent-%COMP%] {\n  color: #cbd5e1;\n}\n.dark[_nghost-%COMP%]   input[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   input[_ngcontent-%COMP%], \n.dark[_nghost-%COMP%]   select[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   select[_ngcontent-%COMP%], \n.dark[_nghost-%COMP%]   textarea[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   textarea[_ngcontent-%COMP%] {\n  background: #1e293b;\n  border-color: #334155;\n  color: #f8fafc;\n}\n.dark[_nghost-%COMP%]   input[_ngcontent-%COMP%]:focus, .dark   [_nghost-%COMP%]   input[_ngcontent-%COMP%]:focus, \n.dark[_nghost-%COMP%]   select[_ngcontent-%COMP%]:focus, .dark   [_nghost-%COMP%]   select[_ngcontent-%COMP%]:focus, \n.dark[_nghost-%COMP%]   textarea[_ngcontent-%COMP%]:focus, .dark   [_nghost-%COMP%]   textarea[_ngcontent-%COMP%]:focus {\n  border-color: #3b82f6;\n  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);\n}\n.dark[_nghost-%COMP%]   .muted[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .muted[_ngcontent-%COMP%] {\n  color: #94a3b8;\n}\n.dark[_nghost-%COMP%]   .hint[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .hint[_ngcontent-%COMP%] {\n  color: #64748b;\n}\n.dark[_nghost-%COMP%]   .chip[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .chip[_ngcontent-%COMP%] {\n  background: #1e293b;\n  border-color: #334155;\n  color: #94a3b8;\n}\n.dark[_nghost-%COMP%]   .chip[_ngcontent-%COMP%]:hover, .dark   [_nghost-%COMP%]   .chip[_ngcontent-%COMP%]:hover {\n  background: #334155;\n}\n.dark[_nghost-%COMP%]   .adv[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .adv[_ngcontent-%COMP%] {\n  border-color: #334155;\n}\n.dark[_nghost-%COMP%]   .adv__title[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .adv__title[_ngcontent-%COMP%] {\n  background: #1e293b;\n  border-bottom-color: #334155;\n  color: #f8fafc;\n}\n.dark[_nghost-%COMP%]   .adv[_ngcontent-%COMP%]    > summary[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .adv[_ngcontent-%COMP%]    > summary[_ngcontent-%COMP%] {\n  background: #1e293b;\n  color: #f8fafc;\n}\n.dark[_nghost-%COMP%]   .adv[open][_ngcontent-%COMP%]    > summary[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .adv[open][_ngcontent-%COMP%]    > summary[_ngcontent-%COMP%] {\n  border-bottom-color: #334155;\n}\n.dark[_nghost-%COMP%]   .checks[_ngcontent-%COMP%]   label[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .checks[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  background: #1e293b;\n  border-color: #334155;\n  color: #cbd5e1;\n}\n.dark[_nghost-%COMP%]   .checks[_ngcontent-%COMP%]   label[_ngcontent-%COMP%]:hover, .dark   [_nghost-%COMP%]   .checks[_ngcontent-%COMP%]   label[_ngcontent-%COMP%]:hover {\n  border-color: #475569;\n  box-shadow: 0 2px 10px -8px rgba(0, 0, 0, 0.5);\n}\n.dark[_nghost-%COMP%]   .checks[_ngcontent-%COMP%]   label[_ngcontent-%COMP%]:has(input:checked), .dark   [_nghost-%COMP%]   .checks[_ngcontent-%COMP%]   label[_ngcontent-%COMP%]:has(input:checked) {\n  border-color: #3b82f6;\n  background: #1e3a8a;\n}\n.dark[_nghost-%COMP%]   .chip-group[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .chip-group[_ngcontent-%COMP%] {\n  background: #1e293b;\n  border-color: #334155;\n}\n.dark[_nghost-%COMP%]   .chip-group-title[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .chip-group-title[_ngcontent-%COMP%] {\n  color: #cbd5e1;\n}\n.dark[_nghost-%COMP%]   .group-card[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .group-card[_ngcontent-%COMP%] {\n  background: #1e293b;\n  border-color: #334155;\n}\n.dark[_nghost-%COMP%]   .group-title[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .group-title[_ngcontent-%COMP%] {\n  color: #f8fafc;\n}\n.dark[_nghost-%COMP%]   .form-label[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .form-label[_ngcontent-%COMP%] {\n  color: #cbd5e1;\n}\n.dark[_nghost-%COMP%]   .range-item[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .range-item[_ngcontent-%COMP%] {\n  background: #0f172a;\n  border-color: #334155;\n}\n.dark[_nghost-%COMP%]   .interval-mode[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .interval-mode[_ngcontent-%COMP%] {\n  background: #1e293b;\n  border-color: #334155;\n}\n.dark[_nghost-%COMP%]   .interval-expression[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .interval-expression[_ngcontent-%COMP%] {\n  background: #0f172a;\n  border-color: #334155;\n}\n.dark[_nghost-%COMP%]   .interval-input[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .interval-input[_ngcontent-%COMP%] {\n  background: #1e293b !important;\n  border-color: #475569 !important;\n  color: #f8fafc;\n}\n.dark[_nghost-%COMP%]   .interval-input[_ngcontent-%COMP%]:focus, .dark   [_nghost-%COMP%]   .interval-input[_ngcontent-%COMP%]:focus {\n  border-color: #3b82f6 !important;\n}\n.dark[_nghost-%COMP%]   .interval-symbol[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .interval-symbol[_ngcontent-%COMP%] {\n  color: #94a3b8;\n}\n.dark[_nghost-%COMP%]   .interval-footer[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .interval-footer[_ngcontent-%COMP%] {\n  border-top-color: #334155;\n}\n.dark[_nghost-%COMP%]   .tiny-check[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .tiny-check[_ngcontent-%COMP%] {\n  color: #94a3b8;\n}\n.dark[_nghost-%COMP%]   .form-select.slim[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .form-select.slim[_ngcontent-%COMP%], \n.dark[_nghost-%COMP%]   .form-input.slim[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .form-input.slim[_ngcontent-%COMP%] {\n  background: #0f172a;\n  border-color: #334155;\n  color: #f8fafc;\n}\n.dark[_nghost-%COMP%]   .character-meter[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .character-meter[_ngcontent-%COMP%] {\n  background: #334155;\n}\n.dark[_nghost-%COMP%]   .character-count[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .character-count[_ngcontent-%COMP%] {\n  color: #94a3b8;\n}\n/*# sourceMappingURL=edit-combo-dialog.component.css.map */'] });
var EditComboDialogComponent = _EditComboDialogComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(EditComboDialogComponent, [{
    type: Component,
    args: [{ selector: "app-edit-combo-dialog", standalone: true, imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatCheckboxModule, MatSelectModule, MatInputModule], template: `<!-- edit-combo-dialog.component.html -->\r
<form\r
  [formGroup]="form"\r
  class="dlg"\r
  (ngSubmit)="save()"\r
  novalidate\r
  style="display:flex; flex-direction:column; width:640px; max-height:80vh;"\r
>\r
  <header class="dlg__head" style="flex:0 0 auto;">\r
    <h2>Editar</h2>\r
    <button type="button" class="icon-btn" (click)="close()" aria-label="Cerrar">\u2715</button>\r
  </header>\r
\r
  <!-- Cuerpo con scroll: crece dentro del alto fijo sin expandir el di\xE1logo -->\r
  <section class="dlg__body" style="flex:1 1 auto; overflow:auto; padding-right:8px;">\r
    <!-- Obligatorios -->\r
    <div class="grid">\r
      <div class="full">\r
        <label>Nombre</label>\r
        <input formControlName="nombre" type="text" placeholder="Nombre del combo" />\r
      </div>\r
\r
      <div class="full">\r
        <div class="row-between">\r
          <label>Texto de SMS (Plantilla) <span class="req">*</span></label>\r
        </div>\r
        <textarea formControlName="plantillaTexto" rows="5" placeholder="Hola {NOMBRE}, \u2026"></textarea>\r
        <div class="error" *ngIf="smsCtrl.invalid && (smsCtrl.dirty || submitted)">\r
          El texto es obligatorio.\r
        </div>\r
        <label>Preview</label>\r
        <div class="preview-box">\r
          {{ previewText() || 'Tu SMS aparecer\xE1 aqu\xED\u2026' }}\r
        </div>\r
        <div class="character-meter">\r
          <div class="character-bar"\r
               [class.warning]="previewText().length > 120"\r
               [class.danger]="previewText().length > 160"\r
               [style.width.%]="Math.min((previewText().length / 160) * 100, 100)">\r
          </div>\r
        </div>\r
        <div class="character-count">\r
          {{ previewText().length }} / 160\r
        </div>\r
      </div>\r
    </div>\r
\r
    <!-- Opciones avanzadas SIEMPRE visibles (sin <details>) -->\r
    <section class="adv" style="margin-top:16px;">\r
      <div class="adv__title" style="font-weight:600; background:#f6f7f9; padding:12px 16px; border-radius:10px;">\r
        Opciones avanzadas\r
      </div>\r
\r
      <div class="grid" style="margin-top:12px;">\r
\r
        <div class="group-card group--tramo">\r
          <label>Tramo</label>\r
          <select formControlName="tramo">\r
            <option value="3">Tramo 3</option>\r
            <option value="5">Tramo 5</option>\r
            <option value="CONTACTO_TOTAL">Cartera Propia</option>  <!-- \u2190 A\xD1ADIR -->\r
          </select>\r
        </div>\r
\r
\r
        <div class="group-card group--selects">\r
          <label>Selecci\xF3n</label>\r
\r
          <div class="chip-groups">\r
            <!-- Cliente -->\r
            <div class="chip-group chip-group--cliente">\r
              <h4 class="chip-group-title">Cliente</h4>\r
              <div class="chip-container">\r
                <button type="button" class="chip" [class.active]="hasSelect('NOMBRE')" (click)="onChipClick($event,'NOMBRE')">Nombre</button>\r
                <button type="button" class="chip" [class.active]="hasSelect('NOMBRECOMPLETO')" (click)="onChipClick($event,'NOMBRECOMPLETO')">Nombre completo</button>\r
                <button type="button" class="chip" [class.active]="hasSelect('EMAIL')" (click)="onChipClick($event,'EMAIL')">Correo</button>\r
                <button type="button" class="chip" [class.active]="hasSelect('NUMCUENTAPMCP')" (click)="onChipClick($event,'NUMCUENTAPMCP')">N\xB0 de Cuenta</button>\r
              </div>\r
            </div>\r
\r
            <!-- Financiero -->\r
            <div class="chip-group chip-group--financiero">\r
              <h4 class="chip-group-title">Financiero</h4>\r
              <div class="chip-container">\r
                <button type="button" class="chip"\r
                        [class.active]="hasSelect('LTD')"\r
                        [disabled]="isChipDisabled('LTD')"\r
                        (click)="onChipClick($event,'LTD')">LTD</button>\r
\r
                <button type="button" class="chip"\r
                        [class.active]="hasSelect('LTDE')"\r
                        [disabled]="isChipDisabled('LTDE')"\r
                        (click)="onChipClick($event,'LTDE')">LTDE</button>\r
\r
                <button type="button" class="chip"\r
                        [class.active]="hasSelect('LTD_LTDE')"\r
                        [disabled]="isChipDisabled('LTD_LTDE')"\r
                        (click)="onChipClick($event,'LTD_LTDE')">LTD + LTDE</button>\r
\r
                <button type="button" class="chip"\r
                        [class.active]="hasSelect('BAJA30')"\r
                        [disabled]="isChipDisabled('BAJA30')"\r
                        (click)="onChipClick($event,'BAJA30')">Baja 30</button>\r
\r
                <button type="button" class="chip"\r
                        [class.active]="hasSelect('SALDO_MORA')"\r
                        [disabled]="isChipDisabled('SALDO_MORA')"\r
                        (click)="onChipClick($event,'SALDO_MORA')">Mora</button>\r
\r
                <button type="button" class="chip"\r
                        [class.active]="hasSelect('BAJA30_SALDOMORA')"\r
                        [disabled]="isChipDisabled('BAJA30_SALDOMORA')"\r
                        (click)="onChipClick($event,'BAJA30_SALDOMORA')">Baja 30 y Saldo Mora</button>\r
\r
                <button type="button" class="chip" [class.active]="hasSelect('PKM')" (click)="onChipClick($event,'PKM')">PKM</button>\r
                <button type="button" class="chip" [class.active]="hasSelect('CAPITAL')" (click)="onChipClick($event,'CAPITAL')">Capital</button>\r
                <button type="button" class="chip" [class.active]="hasSelect('DEUDA_TOTAL')" (click)="onChipClick($event,'DEUDA_TOTAL')">Deuda Total</button>\r
              </div>\r
            </div>\r
\r
\r
            <!-- Fechas -->\r
            <div class="chip-group chip-group--fechas">\r
              <h4 class="chip-group-title">Fechas</h4>\r
              <div class="chip-container">\r
                <button type="button" class="chip" [class.active]="hasSelect('DIASMORA')" (click)="onChipClick($event,'DIASMORA')">D\xEDas mora</button>\r
                <button type="button" class="chip" [class.active]="hasSelect('HOY')" (click)="onChipClick($event,'HOY')">Hoy</button>\r
                <button type="button" class="chip" [class.active]="hasSelect('MANANA')" (click)="onChipClick($event,'MANANA')">Ma\xF1ana</button>\r
              </div>\r
            </div>\r
          </div>\r
          <div *ngIf="hasTopUpSelect()" class="form-field">\r
            <label class="form-label">Sumar importe</label>\r
            <input type="number" min="0" step="1" class="form-input"\r
                   formControlName="importeExtra" placeholder="0">\r
          </div>\r
        </div>\r
\r
        <!-- Rangos -->\r
        <div class="group-card group--rangos">\r
          <div class="group-title" style="display:flex;align-items:center;justify-content:space-between;gap:8px;">\r
            <span>Rangos</span>\r
            <button type="button" class="btn btn-secondary" (click)="addRange()">\r
              + A\xF1adir rango\r
            </button>\r
          </div>\r
\r
          <div class="range-item" *ngFor="let rg of rangosFA.controls; let i = index" [formGroup]="$any(rg)">\r
            <!-- Modo intervalo -->\r
            <div *ngIf="$any(rg).get('useMin')?.value && $any(rg).get('useMax')?.value; else singleMode" class="interval-mode">\r
\r
              <div class="interval-header">\r
                <select class="form-select slim interval-field" formControlName="field" title="Campo">\r
                  <option *ngFor="let f of rangeFields" [value]="f.key">{{ f.label }}</option>\r
                </select>\r
\r
                <button type="button" class="btn btn-danger btn-small" (click)="removeRange(i)">\r
                  <span class="material-icons">delete</span>\r
                </button>\r
              </div>\r
\r
              <div class="interval-expression">\r
                <input type="number" class="form-input slim interval-input" formControlName="min" placeholder="m\xEDn">\r
\r
                <label class="interval-check">\r
                  <input type="checkbox" formControlName="inclusiveMin">\r
                  <span class="interval-symbol">{{ $any(rg).get('inclusiveMin')?.value ? '\u2264' : '<' }}</span>\r
                </label>\r
\r
                <div class="interval-variable">\r
                  {{ fieldLabel($any(rg).get('field')?.value) || 'Variable' }}\r
                </div>\r
\r
                <label class="interval-check">\r
                  <input type="checkbox" formControlName="inclusiveMax">\r
                  <span class="interval-symbol">{{ $any(rg).get('inclusiveMax')?.value ? '\u2264' : '<' }}</span>\r
                </label>\r
\r
                <input type="number" class="form-input slim interval-input" formControlName="max" placeholder="m\xE1x">\r
              </div>\r
\r
              <div class="interval-footer">\r
                <label class="tiny-check">\r
                  <input type="checkbox"\r
                         checked\r
                         (change)="$any(rg).get('mode')?.value === 'gt' ? toggleUseMax(i, false) : toggleUseMin(i, false)">\r
                  <span>Desactivar intervalo</span>\r
                </label>\r
              </div>\r
            </div>\r
\r
            <!-- Modo simple -->\r
            <ng-template #singleMode>\r
              <div class="range-row">\r
                <select class="form-select slim col-field" formControlName="field" title="Campo">\r
                  <option *ngFor="let f of rangeFields" [value]="f.key">{{ f.label }}</option>\r
                </select>\r
\r
                <select class="form-select slim col-op"\r
                        [value]="$any(rg).get('mode')?.value"\r
                        (change)="changeOperator(i, $any($event.target).value)"\r
                        title="Operador">\r
                  <option value="gt">&gt;</option>\r
                  <option value="lt">&lt;</option>\r
                </select>\r
\r
                <div class="value-box col-value">\r
                  <ng-container [ngSwitch]="$any(rg).get('mode')?.value">\r
                    <ng-container *ngSwitchCase="'gt'">\r
                      <input type="number" class="form-input slim" formControlName="min" placeholder="valor m\xEDnimo">\r
                      <label class="tiny-check">\r
                        <input type="checkbox" formControlName="inclusiveMin">\r
                        <span>{{ $any(rg).get('inclusiveMin')?.value ? '\u2265' : '>' }}</span>\r
                      </label>\r
                    </ng-container>\r
                    <ng-container *ngSwitchCase="'lt'">\r
                      <input type="number" class="form-input slim" formControlName="max" placeholder="valor m\xE1ximo">\r
                      <label class="tiny-check">\r
                        <input type="checkbox" formControlName="inclusiveMax">\r
                        <span>{{ $any(rg).get('inclusiveMax')?.value ? '\u2264' : '<' }}</span>\r
                      </label>\r
                    </ng-container>\r
                  </ng-container>\r
                </div>\r
\r
                <button type="button" class="btn btn-danger btn-small col-del" (click)="removeRange(i)">\r
                  <span class="material-icons">delete</span>\r
                </button>\r
              </div>\r
\r
              <div class="hint" style="margin:8px 0 0 0;">\r
                <label class="tiny-check">\r
                  <ng-container *ngIf="$any(rg).get('mode')?.value === 'gt'">\r
                    <input type="checkbox"\r
                           [checked]="$any(rg).get('useMax')?.value"\r
                           (change)="toggleUseMax(i, $any($event.target).checked)">\r
                    <span>a\xF1adir l\xEDmite</span>\r
                  </ng-container>\r
                  <ng-container *ngIf="$any(rg).get('mode')?.value === 'lt'">\r
                    <input type="checkbox"\r
                           [checked]="$any(rg).get('useMin')?.value"\r
                           (change)="toggleUseMin(i, $any($event.target).checked)">\r
                    <span>a\xF1adir l\xEDmite inferior</span>\r
                  </ng-container>\r
                </label>\r
              </div>\r
            </ng-template>\r
\r
            <div *ngIf="$any(rg).errors?.['rangeOrder']" class="hint error-inline">\r
              \u26A0\uFE0F El m\xEDnimo no puede ser mayor que el m\xE1ximo.\r
            </div>\r
          </div>\r
        </div>\r
\r
\r
        <!-- \u2026 dentro de la grid de Opciones avanzadas, cerca de Restricciones \u2026 -->\r
        <div class="group-card group--cond">\r
          <div class="group-title">Condiciones</div>\r
          <div class="checks">\r
            <label><input type="checkbox" formControlName="cond_PROMESAS_HOY"> Promesas HOY</label>\r
            <label><input type="checkbox" formControlName="cond_PROMESAS_MANANA"> Promesas MA\xD1ANA</label>\r
            <label><input type="checkbox" formControlName="cond_PROMESAS_MANANA2"> Promesas HOY y MA\xD1ANA</label>\r
            <label><input type="checkbox" formControlName="cond_PROMESAS_ROTAS"> Promesas ROTAS</label>\r
          </div>\r
        </div>\r
\r
        <div class="group-card group--restr">\r
          <div class="group-title">Restricciones</div>\r
          <div class="checks">\r
            <label><input type="checkbox" formControlName="noContenido"> No Contenido</label>\r
            <label><input type="checkbox" formControlName="excluirPromesasPeriodoActual"> Excluir promesas periodo</label>\r
            <label><input type="checkbox" formControlName="excluirCompromisos"> Excluir compromisos</label>\r
            <label><input type="checkbox" formControlName="excluirBlacklist"> Excluir blacklist</label>\r
          </div>\r
        </div>\r
\r
\r
      </div>\r
    </section>\r
  </section>\r
\r
    <footer class="dlg__foot" style="flex:0 0 auto;">\r
    <button type="button" mat-button (click)="close()">Cancelar</button>\r
    <button type="submit" mat-raised-button color="primary" [disabled]="form.invalid || saving">\r
      {{ saving ? 'Guardando\u2026' : 'Guardar' }}\r
    </button>\r
  </footer>\r
</form>\r
`, styles: ['/* src/app/features/legacy/SMS_DYNAMIC/pages/edit-combo-dialog/edit-combo-dialog.component.css */\n:host ::ng-deep .combo-dialog .mdc-dialog__surface {\n  border-radius: 20px !important;\n  overflow: hidden;\n  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;\n}\n:host ::ng-deep .combo-dialog .mat-mdc-dialog-container {\n  --mdc-dialog-container-shape: 20px;\n}\n.dlg {\n  display: flex;\n  flex-direction: column;\n  max-height: 80vh;\n  background: #ffffff;\n  border-radius: 20px;\n  overflow: hidden;\n}\n.dlg__head {\n  display: flex;\n  align-items: center;\n  gap: 14px;\n  padding: 20px 24px;\n  background:\n    linear-gradient(\n      135deg,\n      #f8fafc 0%,\n      #f1f5f9 100%);\n  border-bottom: 1px solid #e2e8f0;\n  position: relative;\n}\n.dlg__head::after {\n  content: "";\n  position: absolute;\n  bottom: 0;\n  left: 24px;\n  right: 24px;\n  height: 1px;\n  background:\n    linear-gradient(\n      90deg,\n      transparent,\n      #cbd5e1,\n      transparent);\n}\n.dlg__head h2 {\n  margin: 0;\n  font-size: 1.25rem;\n  font-weight: 700;\n  color: #1e293b;\n  letter-spacing: -0.025em;\n}\n.icon-btn {\n  border: none;\n  background: #f1f5f9;\n  font-size: 18px;\n  margin-left: auto;\n  cursor: pointer;\n  width: 36px;\n  height: 36px;\n  border-radius: 10px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  color: #64748b;\n  transition: all 0.2s ease;\n}\n.icon-btn:hover {\n  background: #e2e8f0;\n  color: #1e293b;\n  transform: scale(1.05);\n}\n.dlg__body {\n  padding: 24px;\n  overflow-y: auto;\n  background: #ffffff;\n}\n.dlg__foot {\n  padding: 16px 24px;\n  border-top: 1px solid #e2e8f0;\n  background:\n    linear-gradient(\n      135deg,\n      #f8fafc 0%,\n      #ffffff 100%);\n  box-shadow: 0 -4px 20px -5px rgba(0, 0, 0, 0.08);\n  display: flex;\n  justify-content: flex-end;\n  gap: 12px;\n}\n.dlg__foot button,\n.dlg__foot .btn-cancel,\n.dlg__foot .btn-save {\n  padding: 10px 20px;\n  border-radius: 10px;\n  font-weight: 600;\n  font-size: 0.9rem;\n  cursor: pointer;\n  transition: all 0.2s ease;\n  border: none;\n}\n.dlg__foot .btn-cancel,\n.dlg__foot button[type=button]:not(.btn-save) {\n  background: #f1f5f9;\n  color: #475569;\n  border: 1px solid #e2e8f0;\n}\n.dlg__foot .btn-cancel:hover,\n.dlg__foot button[type=button]:not(.btn-save):hover {\n  background: #e2e8f0;\n  border-color: #cbd5e1;\n}\n.dlg__foot .btn-save,\n.dlg__foot button[type=submit] {\n  background:\n    linear-gradient(\n      135deg,\n      #3b82f6 0%,\n      #2563eb 100%);\n  color: white;\n  box-shadow: 0 4px 14px -3px rgba(59, 130, 246, 0.4);\n}\n.dlg__foot .btn-save:hover,\n.dlg__foot button[type=submit]:hover {\n  background:\n    linear-gradient(\n      135deg,\n      #2563eb 0%,\n      #1d4ed8 100%);\n  transform: translateY(-1px);\n  box-shadow: 0 6px 20px -3px rgba(59, 130, 246, 0.5);\n}\n.dlg__foot .btn-save:disabled,\n.dlg__foot button[type=submit]:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n  transform: none;\n  box-shadow: none;\n}\n.grid {\n  display: grid;\n  grid-template-columns: repeat(12, 1fr);\n  gap: 12px;\n}\n.grid > div {\n  grid-column: span 6;\n}\n.grid .full {\n  grid-column: 1/-1;\n}\nlabel {\n  margin-bottom: 6px;\n}\ninput,\nselect,\ntextarea {\n  width: 100%;\n  border: 1.5px solid #d1d5db;\n  border-radius: 10px;\n  padding: 10px 12px;\n  outline: none;\n  background: #fff;\n  color: #0f172a;\n  transition: .15s border, .15s box-shadow;\n}\ninput:focus,\nselect:focus,\ntextarea:focus {\n  border-color: #3b82f6;\n  box-shadow: 0 0 0 3px rgba(99, 102, 241, .15);\n}\ntextarea {\n  resize: vertical;\n}\n.req {\n  color: #ef4444;\n  font-weight: 700;\n}\n.row-between {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n}\n.muted {\n  color: #6b7280;\n  font-size: .85rem;\n}\n.hint {\n  color: #64748b;\n  font-size: .85rem;\n  margin-top: 6px;\n}\n.error {\n  color: #ef4444;\n  margin-top: 6px;\n}\n.chips {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 10px 12px;\n}\n.chip {\n  appearance: none;\n  border: 1px solid #cfd8dc;\n  background: #fff;\n  color: #111827;\n  border-radius: 999px;\n  padding: 8px 14px;\n  font-weight: 600;\n  line-height: 1.1;\n  cursor: pointer;\n  transition:\n    background .15s,\n    border-color .15s,\n    transform .04s;\n  box-shadow: 0 1px 0 rgba(0, 0, 0, .02);\n}\n.chip:hover {\n  background: #f8fafc;\n}\n.chip:active {\n  transform: translateY(1px);\n}\n.chip:focus-visible {\n  outline: 2px solid #3b82f6;\n  outline-offset: 2px;\n}\n.chip.active {\n  background:\n    linear-gradient(\n      135deg,\n      var(--group-accent, #2563eb) 0%,\n      var(--group-accent-2, #2563eb) 100%);\n  border-color: var(--group-accent, #3b82f6);\n  color: #fff;\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);\n}\n.adv {\n  margin-top: 12px;\n  border: 1px solid #e5e7eb;\n  border-radius: 12px;\n  overflow: hidden;\n}\n.adv__title {\n  font-weight: 600;\n  background: #f6f7f9;\n  padding: 12px 16px;\n  border-bottom: 1px solid #e5e7eb;\n}\n.adv > summary {\n  cursor: pointer;\n  padding: 10px 14px;\n  background: #f8fafc;\n  font-weight: 700;\n}\n.adv[open] > summary {\n  border-bottom: 1px solid #e5e7eb;\n}\n.adv .grid {\n  padding: 14px 16px;\n  gap: 16px;\n}\n@media (min-width: 980px) {\n  .adv .grid > div:nth-child(1) {\n    grid-column: span 4;\n  }\n  .adv .grid > div:nth-child(2) {\n    grid-column: 1 / -1;\n  }\n  .adv .grid > div:nth-child(3) {\n    grid-column: span 6;\n  }\n}\n@media (max-width: 980px) {\n  .grid > div {\n    grid-column: 1/-1;\n  }\n}\n.preview-box {\n  background:\n    linear-gradient(\n      135deg,\n      #2c3e50 0%,\n      #34495e 100%);\n  color: white;\n  padding: 16px;\n  border-radius: 12px;\n  min-height: 100px;\n  margin-bottom: 16px;\n  font-family: monospace;\n  font-size: 14px;\n  line-height: 1.5;\n}\n.character-meter {\n  background: #f3f4f6;\n  height: 8px;\n  border-radius: 4px;\n  overflow: hidden;\n  margin-bottom: 8px;\n}\n.character-bar {\n  height: 100%;\n  background:\n    linear-gradient(\n      90deg,\n      #10b981 0%,\n      #059669 100%);\n  transition: all 0.3s ease;\n  border-radius: 4px;\n}\n.character-bar.warning {\n  background:\n    linear-gradient(\n      90deg,\n      #f59e0b 0%,\n      #d97706 100%);\n}\n.character-bar.danger {\n  background:\n    linear-gradient(\n      90deg,\n      #ef4444 0%,\n      #dc2626 100%);\n}\n.character-count {\n  font-size: 12px;\n  color: #6b7280;\n  text-align: right;\n}\n@media (max-width: 980px) {\n  .checks {\n    grid-template-columns: 1fr;\n  }\n}\n.checks {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));\n  gap: 12px;\n  width: 100%;\n}\n.checks label {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  padding: 12px 14px;\n  border: 1px solid #e5e7eb;\n  border-radius: 12px;\n  background: #fff;\n  line-height: 1.25;\n  -webkit-user-select: none;\n  user-select: none;\n  cursor: pointer;\n  transition:\n    border-color .15s,\n    box-shadow .15s,\n    background .15s;\n}\n.checks label:hover {\n  border-color: #cbd5e1;\n  box-shadow: 0 2px 10px -8px rgba(0, 0, 0, .25);\n}\n.checks label:has(input:checked) {\n  border-color: #3b82f6;\n  background: #eef2ff;\n  box-shadow: 0 0 0 3px rgba(79, 70, 229, .12) inset;\n}\n.checks input {\n  transform: scale(1.05);\n  margin-top: 1px;\n  width: 16px;\n}\n.chip-groups {\n  display: grid;\n  gap: 12px;\n}\n.chip-group {\n  border: 1px solid #e9ecf3;\n  background: #fff;\n  border-radius: 12px;\n  padding: 12px;\n}\n.chip-group-title {\n  margin: 0 0 8px 0;\n  font-size: 14px;\n  font-weight: 600;\n  color: #4b587c;\n}\n.chip-container {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 10px;\n  align-items: center;\n}\n.chip {\n  padding: 8px 14px;\n  border-radius: 999px;\n  border: 1px solid #dfe3ee;\n  background: #f8f9fc;\n  cursor: pointer;\n  font-size: 13px;\n}\n.chip-group--cliente {\n  --group-accent: #3b82f6;\n  --group-accent-2: #1d4ed8;\n}\n.chip-group--financiero {\n  --group-accent: #3b82f6;\n  --group-accent-2: #1d4ed8;\n}\n.chip-group--fechas {\n  --group-accent: #3b82f6;\n  --group-accent-2: #1d4ed8;\n}\n.chip.active {\n  background:\n    linear-gradient(\n      135deg,\n      var(--group-accent, #2563eb) 0%,\n      var(--group-accent-2, #2563eb) 100%);\n  border-color: var(--group-accent, #3b82f6);\n  color: #fff;\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);\n}\n.form-label {\n  display: block;\n  font-weight: 500;\n  color: #374151;\n  margin-top: 25px;\n  margin-bottom: 8px;\n  font-size: 14px;\n}\n.chip[disabled] {\n  opacity: 0.45;\n  cursor: not-allowed;\n  pointer-events: none;\n}\n.adv {\n  margin-top: 12px;\n  border: 1px solid #e5e7eb;\n  border-radius: 12px;\n  overflow: hidden;\n}\n.adv__title {\n  font-weight: 600;\n  background: #f6f7f9;\n  padding: 12px 16px;\n  border-bottom: 1px solid #e5e7eb;\n}\n.adv .grid {\n  padding: 14px 16px;\n  gap: 16px;\n  display: grid;\n  grid-template-columns: repeat(12, 1fr);\n}\n.group-card {\n  border: 1px solid #e5e7eb;\n  background: #fff;\n  border-radius: 12px;\n  padding: 12px;\n}\n.group-title {\n  margin: 0 0 10px 0;\n  font-size: 14px;\n  font-weight: 600;\n  color: #374151;\n}\n@media (min-width: 980px) {\n  .group--tramo {\n    grid-column: span 4;\n  }\n  .group--selects {\n    grid-column: 1 / -1;\n  }\n  .group--cond {\n    grid-column: span 6;\n  }\n  .group--restr {\n    grid-column: span 6;\n  }\n}\n@media (max-width: 980px) {\n  .group--tramo,\n  .group--selects,\n  .group--cond,\n  .group--restr {\n    grid-column: 1 / -1;\n  }\n}\n.adv .grid {\n  padding: 14px 16px;\n  gap: 16px;\n  display: grid;\n  grid-template-columns: repeat(12, 1fr);\n}\n@media (min-width: 980px) {\n  .group--tramo {\n    grid-column: span 4;\n  }\n  .group--selects {\n    grid-column: 1 / -1;\n  }\n  .group--rangos {\n    grid-column: 1 / -1;\n  }\n  .group--cond {\n    grid-column: 1 / span 6;\n  }\n  .group--restr {\n    grid-column: 7 / span 6;\n  }\n}\n@media (max-width: 980px) {\n  .group--tramo,\n  .group--selects,\n  .group--rangos,\n  .group--cond,\n  .group--restr {\n    grid-column: 1 / -1;\n  }\n}\n@media (min-width: 980px) {\n  .adv .grid {\n    display: grid !important;\n    grid-template-columns: repeat(12, 1fr) !important;\n    gap: 16px !important;\n  }\n  .adv .grid > .group--rangos {\n    grid-column: 1 / -1 !important;\n  }\n  .adv .grid > .group--cond {\n    grid-column: 1 / span 6 !important;\n  }\n  .adv .grid > .group--restr {\n    grid-column: 7 / span 6 !important;\n  }\n}\n@media (max-width: 980px) {\n  .adv .grid > .group--rangos,\n  .adv .grid > .group--cond,\n  .adv .grid > .group--restr {\n    grid-column: 1 / -1 !important;\n  }\n}\n.group--rangos {\n  display: block;\n}\n.group--rangos .range-item {\n  display: block;\n  width: 100%;\n  box-sizing: border-box;\n  margin-bottom: 12px;\n}\n.group--rangos .range-list,\n.group--rangos .range-container {\n  display: block;\n}\n.btn {\n  padding: 12px 24px;\n  border: none;\n  border-radius: 12px;\n  font-size: 14px;\n  font-weight: 500;\n  cursor: pointer;\n  transition: all 0.2s ease;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n}\n.btn-small {\n  padding: 8px 12px;\n  font-size: 12px;\n  border-radius: 10px;\n  line-height: 1;\n}\n.btn-danger {\n  background:\n    linear-gradient(\n      135deg,\n      #ef4444 0%,\n      #dc2626 100%);\n  color: #fff;\n  box-shadow: 0 4px 16px rgba(239, 68, 68, 0.3);\n}\n.btn-danger:hover {\n  transform: translateY(-1px);\n  box-shadow: 0 8px 24px rgba(239, 68, 68, 0.4);\n}\n.btn-secondary {\n  background:\n    linear-gradient(\n      135deg,\n      #3b82f6 0%,\n      #2563eb 100%);\n  color: #fff;\n  box-shadow: 0 4px 16px rgba(139, 92, 246, 0.3);\n}\n.btn-secondary:hover {\n  transform: translateY(-1px);\n  box-shadow: 0 8px 24px rgba(139, 92, 246, 0.4);\n}\n.group--rangos {\n  display: block;\n}\n.group--rangos .range-item {\n  background: #fafafa;\n  border: 1px solid #e5e7eb;\n  border-radius: 12px;\n  padding: 12px;\n  margin-bottom: 12px;\n  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.02) inset;\n}\n.interval-mode {\n  background: #f8fafc;\n  border: 2px solid #e2e8f0;\n  border-radius: 12px;\n  padding: 16px;\n}\n.interval-header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 16px;\n  gap: 12px;\n}\n.interval-header .interval-field {\n  flex: 1;\n  max-width: 300px;\n}\n.interval-expression {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 16px;\n  padding: 20px 16px;\n  background: #fff;\n  border-radius: 10px;\n  border: 2px solid #e2e8f0;\n  flex-wrap: wrap;\n}\n.form-select.slim,\n.form-input.slim {\n  height: 36px;\n  padding: 6px 10px;\n  border: 2px solid #e5e7eb;\n  border-radius: 10px;\n  background: #fff;\n  font-size: 14px;\n  transition: all .2s ease;\n}\n.interval-input {\n  width: 130px !important;\n  height: 42px !important;\n  text-align: center;\n  font-weight: 600;\n  font-size: 16px;\n  border: 2px solid #cbd5e1 !important;\n}\n.interval-input:focus {\n  border-color: #3b82f6 !important;\n}\n.interval-check {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 6px;\n  cursor: pointer;\n}\n.interval-check input[type=checkbox] {\n  width: 16px;\n  height: 16px;\n  cursor: pointer;\n}\n.interval-symbol {\n  font-size: 28px;\n  font-weight: 700;\n  color: #475569;\n  line-height: 1;\n  -webkit-user-select: none;\n  user-select: none;\n}\n.interval-variable {\n  background:\n    linear-gradient(\n      135deg,\n      #3b82f6 0%,\n      #2563eb 100%);\n  color: #fff;\n  padding: 12px 24px;\n  border-radius: 24px;\n  font-weight: 700;\n  font-size: 16px;\n  min-width: 140px;\n  text-align: center;\n  box-shadow: 0 4px 14px rgba(102, 126, 234, 0.35);\n  white-space: nowrap;\n}\n.interval-footer {\n  margin-top: 12px;\n  padding-top: 12px;\n  border-top: 1px solid #e2e8f0;\n  text-align: center;\n}\n.interval-footer .tiny-check {\n  font-size: 13px;\n  color: #64748b;\n}\n.range-row {\n  display: grid;\n  grid-template-columns: 240px 80px 1fr max-content;\n  gap: 12px;\n  align-items: center;\n}\n.col-field {\n  grid-column: 1;\n}\n.col-op {\n  grid-column: 2;\n}\n.col-value {\n  grid-column: 3;\n}\n.col-del {\n  grid-column: 4;\n  justify-self: end;\n}\n.range-row .value-box {\n  display: inline-flex;\n  align-items: center;\n  gap: 10px;\n}\n.range-row .form-input.slim {\n  width: 180px;\n}\n.tiny-check {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  font-size: 12px;\n  color: #6b7280;\n  cursor: pointer;\n}\n.tiny-check input {\n  transform: translateY(1px);\n}\n.hint.error-inline {\n  color: #ef4444;\n  font-weight: 500;\n  margin-top: 8px;\n}\n@media (max-width: 900px) {\n  .interval-expression {\n    gap: 12px;\n    padding: 16px 12px;\n  }\n  .interval-input {\n    width: 110px !important;\n  }\n  .interval-variable {\n    min-width: 120px;\n    font-size: 15px;\n    padding: 10px 20px;\n  }\n  .interval-symbol {\n    font-size: 24px;\n  }\n}\n@media (max-width: 700px) {\n  .interval-expression {\n    flex-direction: column;\n    gap: 10px;\n    padding: 16px;\n  }\n  .interval-input {\n    width: 100% !important;\n    max-width: 200px;\n  }\n  .interval-variable {\n    width: 100%;\n    max-width: 200px;\n  }\n  .range-row {\n    grid-template-columns: 1fr;\n    gap: 12px;\n  }\n  .range-row .btn-small {\n    justify-self: stretch;\n  }\n}\n.group--rangos .group-title {\n  font-size: 13px;\n}\n.group--rangos .range-item {\n  padding: 10px;\n  border-radius: 10px;\n}\n.group--rangos .btn {\n  padding: 8px 14px;\n  font-size: 12px;\n  border-radius: 10px;\n  gap: 6px;\n}\n.group--rangos .btn-small {\n  padding: 6px 10px;\n  font-size: 11px;\n  border-radius: 8px;\n  line-height: 1;\n}\n.group--rangos .interval-mode {\n  padding: 12px;\n  border-radius: 10px;\n  border-width: 1.5px;\n}\n.group--rangos .interval-header {\n  margin-bottom: 10px;\n  gap: 8px;\n}\n.group--rangos .interval-header .interval-field {\n  max-width: 100px;\n}\n.group--rangos .interval-expression {\n  gap: 12px;\n  padding: 12px;\n  border-radius: 8px;\n  border-width: 1.5px;\n}\n.group--rangos .form-select.slim,\n.group--rangos .form-input.slim {\n  height: 30px;\n  padding: 4px 8px;\n  font-size: 12px;\n  border-radius: 8px;\n  border-width: 1.5px;\n}\n.group--rangos .interval-input {\n  width: 100px !important;\n  height: 36px !important;\n  font-size: 14px;\n  font-weight: 600;\n}\n.group--rangos .interval-check {\n  gap: 4px;\n}\n.group--rangos .interval-check input[type=checkbox] {\n  width: 14px;\n  height: 14px;\n}\n.group--rangos .interval-symbol {\n  font-size: 22px;\n}\n.group--rangos .interval-variable {\n  padding: 8px 16px;\n  border-radius: 18px;\n  font-size: 14px;\n  min-width: 110px;\n  box-shadow: 0 3px 10px rgba(102, 126, 234, .28);\n}\n.group--rangos .interval-footer {\n  margin-top: 8px;\n  padding-top: 8px;\n}\n.group--rangos .interval-footer .tiny-check {\n  font-size: 12px;\n}\n.group--rangos .range-row {\n  grid-template-columns: 200px 64px 1fr max-content;\n  gap: 8px;\n}\n.group--rangos .range-row .form-input.slim {\n  width: 140px;\n}\n.group--rangos .tiny-check {\n  font-size: 11px;\n  gap: 4px;\n}\n.group--rangos .tiny-check input {\n  transform: translateY(1px);\n}\n.group--rangos .btn-danger.btn-small {\n  padding: 6px 10px;\n  font-size: 11px;\n}\n@media (max-width: 700px) {\n  .group--rangos .interval-input {\n    width: 92px !important;\n  }\n  .group--rangos .interval-variable {\n    min-width: 100px;\n    font-size: 13px;\n    padding: 7px 14px;\n  }\n  .group--rangos .interval-symbol {\n    font-size: 20px;\n  }\n}\n.group--rangos .hint .tiny-check,\n.group--rangos .hint .tiny-check span {\n  white-space: nowrap;\n}\n.group--rangos .hint .tiny-check {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  font-size: 12px;\n  line-height: 1.1;\n}\n:host-context(.dark) .dlg {\n  background: #0f172a;\n}\n:host-context(.dark) .dlg__head {\n  background:\n    linear-gradient(\n      135deg,\n      #1e293b 0%,\n      #0f172a 100%);\n  border-bottom-color: #334155;\n}\n:host-context(.dark) .dlg__head::after {\n  background:\n    linear-gradient(\n      90deg,\n      transparent,\n      #475569,\n      transparent);\n}\n:host-context(.dark) .dlg__head h2 {\n  color: #f8fafc;\n}\n:host-context(.dark) .icon-btn {\n  background: #1e293b;\n  color: #94a3b8;\n}\n:host-context(.dark) .icon-btn:hover {\n  background: #334155;\n  color: #f8fafc;\n}\n:host-context(.dark) .dlg__body {\n  background: #0f172a;\n}\n:host-context(.dark) .dlg__foot {\n  background:\n    linear-gradient(\n      135deg,\n      #1e293b 0%,\n      #0f172a 100%);\n  border-top-color: #334155;\n  box-shadow: 0 -4px 20px -5px rgba(0, 0, 0, 0.4);\n}\n:host-context(.dark) .dlg__foot .btn-cancel,\n:host-context(.dark) .dlg__foot button[type=button]:not(.btn-save) {\n  background: #1e293b;\n  color: #cbd5e1;\n  border-color: #334155;\n}\n:host-context(.dark) .dlg__foot .btn-cancel:hover,\n:host-context(.dark) .dlg__foot button[type=button]:not(.btn-save):hover {\n  background: #334155;\n  border-color: #475569;\n}\n:host-context(.dark) label {\n  color: #cbd5e1;\n}\n:host-context(.dark) input,\n:host-context(.dark) select,\n:host-context(.dark) textarea {\n  background: #1e293b;\n  border-color: #334155;\n  color: #f8fafc;\n}\n:host-context(.dark) input:focus,\n:host-context(.dark) select:focus,\n:host-context(.dark) textarea:focus {\n  border-color: #3b82f6;\n  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);\n}\n:host-context(.dark) .muted {\n  color: #94a3b8;\n}\n:host-context(.dark) .hint {\n  color: #64748b;\n}\n:host-context(.dark) .chip {\n  background: #1e293b;\n  border-color: #334155;\n  color: #94a3b8;\n}\n:host-context(.dark) .chip:hover {\n  background: #334155;\n}\n:host-context(.dark) .adv {\n  border-color: #334155;\n}\n:host-context(.dark) .adv__title {\n  background: #1e293b;\n  border-bottom-color: #334155;\n  color: #f8fafc;\n}\n:host-context(.dark) .adv > summary {\n  background: #1e293b;\n  color: #f8fafc;\n}\n:host-context(.dark) .adv[open] > summary {\n  border-bottom-color: #334155;\n}\n:host-context(.dark) .checks label {\n  background: #1e293b;\n  border-color: #334155;\n  color: #cbd5e1;\n}\n:host-context(.dark) .checks label:hover {\n  border-color: #475569;\n  box-shadow: 0 2px 10px -8px rgba(0, 0, 0, 0.5);\n}\n:host-context(.dark) .checks label:has(input:checked) {\n  border-color: #3b82f6;\n  background: #1e3a8a;\n}\n:host-context(.dark) .chip-group {\n  background: #1e293b;\n  border-color: #334155;\n}\n:host-context(.dark) .chip-group-title {\n  color: #cbd5e1;\n}\n:host-context(.dark) .group-card {\n  background: #1e293b;\n  border-color: #334155;\n}\n:host-context(.dark) .group-title {\n  color: #f8fafc;\n}\n:host-context(.dark) .form-label {\n  color: #cbd5e1;\n}\n:host-context(.dark) .range-item {\n  background: #0f172a;\n  border-color: #334155;\n}\n:host-context(.dark) .interval-mode {\n  background: #1e293b;\n  border-color: #334155;\n}\n:host-context(.dark) .interval-expression {\n  background: #0f172a;\n  border-color: #334155;\n}\n:host-context(.dark) .interval-input {\n  background: #1e293b !important;\n  border-color: #475569 !important;\n  color: #f8fafc;\n}\n:host-context(.dark) .interval-input:focus {\n  border-color: #3b82f6 !important;\n}\n:host-context(.dark) .interval-symbol {\n  color: #94a3b8;\n}\n:host-context(.dark) .interval-footer {\n  border-top-color: #334155;\n}\n:host-context(.dark) .tiny-check {\n  color: #94a3b8;\n}\n:host-context(.dark) .form-select.slim,\n:host-context(.dark) .form-input.slim {\n  background: #0f172a;\n  border-color: #334155;\n  color: #f8fafc;\n}\n:host-context(.dark) .character-meter {\n  background: #334155;\n}\n:host-context(.dark) .character-count {\n  color: #94a3b8;\n}\n/*# sourceMappingURL=edit-combo-dialog.component.css.map */\n'] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(EditComboDialogComponent, { className: "EditComboDialogComponent", filePath: "src/app/features/legacy/sms_dynamic/pages/edit-combo-dialog/edit-combo-dialog.component.ts", lineNumber: 33 });
})();

// src/app/features/legacy/SMS_DYNAMIC/utils.ts
function fmtFecha(d = /* @__PURE__ */ new Date()) {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}`;
}
function normalizeToken(s) {
  return s.trim().toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "");
}
function renderPreviewMessage(tpl, row) {
  if (!tpl)
    return "";
  const dict = {
    HOY: fmtFecha(/* @__PURE__ */ new Date()),
    MANANA: fmtFecha(new Date(Date.now() + 24 * 60 * 60 * 1e3))
  };
  for (const [k, v] of Object.entries(row || {})) {
    dict[normalizeToken(k)] = String(v ?? "");
  }
  if (!dict["MORA"] && dict["SALDO_MORA"])
    dict["MORA"] = dict["SALDO_MORA"];
  if (!dict["BAJA30"] && dict["BAJA_30"])
    dict["BAJA30"] = dict["BAJA_30"];
  return tpl.replace(/\{([^}]+)\}/g, (_, raw) => {
    const key = normalizeToken(raw);
    return key in dict ? dict[key] : `{${raw}}`;
  });
}
function smsSegmentsLen(text) {
  const n = (text || "").length;
  if (n === 0)
    return { chars: 0, segs: 0 };
  if (n <= 160)
    return { chars: n, segs: 1 };
  return { chars: n, segs: Math.ceil(n / 153) };
}

// node_modules/@angular/material/fesm2022/bottom-sheet.mjs
function MatBottomSheetContainer_ng_template_0_Template(rf, ctx) {
}
var ENTER_ANIMATION = "_mat-bottom-sheet-enter";
var EXIT_ANIMATION = "_mat-bottom-sheet-exit";
var MatBottomSheetContainer = class _MatBottomSheetContainer extends CdkDialogContainer {
  _breakpointSubscription;
  _animationsDisabled = _animationsDisabled();
  /** The state of the bottom sheet animations. */
  _animationState = "void";
  /** Emits whenever the state of the animation changes. */
  _animationStateChanged = new EventEmitter();
  /** Whether the component has been destroyed. */
  _destroyed;
  constructor() {
    super();
    const breakpointObserver = inject(BreakpointObserver);
    this._breakpointSubscription = breakpointObserver.observe([Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge]).subscribe(() => {
      const classList = this._elementRef.nativeElement.classList;
      classList.toggle("mat-bottom-sheet-container-medium", breakpointObserver.isMatched(Breakpoints.Medium));
      classList.toggle("mat-bottom-sheet-container-large", breakpointObserver.isMatched(Breakpoints.Large));
      classList.toggle("mat-bottom-sheet-container-xlarge", breakpointObserver.isMatched(Breakpoints.XLarge));
    });
  }
  /** Begin animation of bottom sheet entrance into view. */
  enter() {
    if (!this._destroyed) {
      this._animationState = "visible";
      this._changeDetectorRef.markForCheck();
      this._changeDetectorRef.detectChanges();
      if (this._animationsDisabled) {
        this._simulateAnimation(ENTER_ANIMATION);
      }
    }
  }
  /** Begin animation of the bottom sheet exiting from view. */
  exit() {
    if (!this._destroyed) {
      this._elementRef.nativeElement.setAttribute("mat-exit", "");
      this._animationState = "hidden";
      this._changeDetectorRef.markForCheck();
      if (this._animationsDisabled) {
        this._simulateAnimation(EXIT_ANIMATION);
      }
    }
  }
  ngOnDestroy() {
    super.ngOnDestroy();
    this._breakpointSubscription.unsubscribe();
    this._destroyed = true;
  }
  _simulateAnimation(name) {
    this._ngZone.run(() => {
      this._handleAnimationEvent(true, name);
      setTimeout(() => this._handleAnimationEvent(false, name));
    });
  }
  _trapFocus() {
    super._trapFocus({
      preventScroll: true
    });
  }
  _handleAnimationEvent(isStart, animationName) {
    const isEnter = animationName === ENTER_ANIMATION;
    const isExit = animationName === EXIT_ANIMATION;
    if (isEnter || isExit) {
      this._animationStateChanged.emit({
        toState: isEnter ? "visible" : "hidden",
        phase: isStart ? "start" : "done"
      });
    }
  }
  static \u0275fac = function MatBottomSheetContainer_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatBottomSheetContainer)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
    type: _MatBottomSheetContainer,
    selectors: [["mat-bottom-sheet-container"]],
    hostAttrs: ["tabindex", "-1", 1, "mat-bottom-sheet-container"],
    hostVars: 9,
    hostBindings: function MatBottomSheetContainer_HostBindings(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275listener("animationstart", function MatBottomSheetContainer_animationstart_HostBindingHandler($event) {
          return ctx._handleAnimationEvent(true, $event.animationName);
        })("animationend", function MatBottomSheetContainer_animationend_HostBindingHandler($event) {
          return ctx._handleAnimationEvent(false, $event.animationName);
        })("animationcancel", function MatBottomSheetContainer_animationcancel_HostBindingHandler($event) {
          return ctx._handleAnimationEvent(false, $event.animationName);
        });
      }
      if (rf & 2) {
        \u0275\u0275attribute("role", ctx._config.role)("aria-modal", ctx._config.ariaModal)("aria-label", ctx._config.ariaLabel);
        \u0275\u0275classProp("mat-bottom-sheet-container-animations-enabled", !ctx._animationsDisabled)("mat-bottom-sheet-container-enter", ctx._animationState === "visible")("mat-bottom-sheet-container-exit", ctx._animationState === "hidden");
      }
    },
    features: [\u0275\u0275InheritDefinitionFeature],
    decls: 1,
    vars: 0,
    consts: [["cdkPortalOutlet", ""]],
    template: function MatBottomSheetContainer_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275template(0, MatBottomSheetContainer_ng_template_0_Template, 0, 0, "ng-template", 0);
      }
    },
    dependencies: [CdkPortalOutlet],
    styles: ["@keyframes _mat-bottom-sheet-enter{from{transform:translateY(100%)}to{transform:none}}@keyframes _mat-bottom-sheet-exit{from{transform:none}to{transform:translateY(100%)}}.mat-bottom-sheet-container{box-shadow:0px 8px 10px -5px rgba(0, 0, 0, 0.2), 0px 16px 24px 2px rgba(0, 0, 0, 0.14), 0px 6px 30px 5px rgba(0, 0, 0, 0.12);padding:8px 16px;min-width:100vw;box-sizing:border-box;display:block;outline:0;max-height:80vh;overflow:auto;position:relative;background:var(--mat-bottom-sheet-container-background-color, var(--mat-sys-surface-container-low));color:var(--mat-bottom-sheet-container-text-color, var(--mat-sys-on-surface));font-family:var(--mat-bottom-sheet-container-text-font, var(--mat-sys-body-large-font));font-size:var(--mat-bottom-sheet-container-text-size, var(--mat-sys-body-large-size));line-height:var(--mat-bottom-sheet-container-text-line-height, var(--mat-sys-body-large-line-height));font-weight:var(--mat-bottom-sheet-container-text-weight, var(--mat-sys-body-large-weight));letter-spacing:var(--mat-bottom-sheet-container-text-tracking, var(--mat-sys-body-large-tracking))}@media(forced-colors: active){.mat-bottom-sheet-container{outline:1px solid}}.mat-bottom-sheet-container-animations-enabled{transform:translateY(100%)}.mat-bottom-sheet-container-animations-enabled.mat-bottom-sheet-container-enter{animation:_mat-bottom-sheet-enter 195ms cubic-bezier(0, 0, 0.2, 1) forwards}.mat-bottom-sheet-container-animations-enabled.mat-bottom-sheet-container-exit{animation:_mat-bottom-sheet-exit 375ms cubic-bezier(0.4, 0, 1, 1) backwards}.mat-bottom-sheet-container-xlarge,.mat-bottom-sheet-container-large,.mat-bottom-sheet-container-medium{border-top-left-radius:var(--mat-bottom-sheet-container-shape, 28px);border-top-right-radius:var(--mat-bottom-sheet-container-shape, 28px)}.mat-bottom-sheet-container-medium{min-width:384px;max-width:calc(100vw - 128px)}.mat-bottom-sheet-container-large{min-width:512px;max-width:calc(100vw - 256px)}.mat-bottom-sheet-container-xlarge{min-width:576px;max-width:calc(100vw - 384px)}\n"],
    encapsulation: 2
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatBottomSheetContainer, [{
    type: Component,
    args: [{
      selector: "mat-bottom-sheet-container",
      changeDetection: ChangeDetectionStrategy.Default,
      encapsulation: ViewEncapsulation.None,
      host: {
        "class": "mat-bottom-sheet-container",
        "[class.mat-bottom-sheet-container-animations-enabled]": "!_animationsDisabled",
        "[class.mat-bottom-sheet-container-enter]": '_animationState === "visible"',
        "[class.mat-bottom-sheet-container-exit]": '_animationState === "hidden"',
        "tabindex": "-1",
        "[attr.role]": "_config.role",
        "[attr.aria-modal]": "_config.ariaModal",
        "[attr.aria-label]": "_config.ariaLabel",
        "(animationstart)": "_handleAnimationEvent(true, $event.animationName)",
        "(animationend)": "_handleAnimationEvent(false, $event.animationName)",
        "(animationcancel)": "_handleAnimationEvent(false, $event.animationName)"
      },
      imports: [CdkPortalOutlet],
      template: "<ng-template cdkPortalOutlet></ng-template>\r\n",
      styles: ["@keyframes _mat-bottom-sheet-enter{from{transform:translateY(100%)}to{transform:none}}@keyframes _mat-bottom-sheet-exit{from{transform:none}to{transform:translateY(100%)}}.mat-bottom-sheet-container{box-shadow:0px 8px 10px -5px rgba(0, 0, 0, 0.2), 0px 16px 24px 2px rgba(0, 0, 0, 0.14), 0px 6px 30px 5px rgba(0, 0, 0, 0.12);padding:8px 16px;min-width:100vw;box-sizing:border-box;display:block;outline:0;max-height:80vh;overflow:auto;position:relative;background:var(--mat-bottom-sheet-container-background-color, var(--mat-sys-surface-container-low));color:var(--mat-bottom-sheet-container-text-color, var(--mat-sys-on-surface));font-family:var(--mat-bottom-sheet-container-text-font, var(--mat-sys-body-large-font));font-size:var(--mat-bottom-sheet-container-text-size, var(--mat-sys-body-large-size));line-height:var(--mat-bottom-sheet-container-text-line-height, var(--mat-sys-body-large-line-height));font-weight:var(--mat-bottom-sheet-container-text-weight, var(--mat-sys-body-large-weight));letter-spacing:var(--mat-bottom-sheet-container-text-tracking, var(--mat-sys-body-large-tracking))}@media(forced-colors: active){.mat-bottom-sheet-container{outline:1px solid}}.mat-bottom-sheet-container-animations-enabled{transform:translateY(100%)}.mat-bottom-sheet-container-animations-enabled.mat-bottom-sheet-container-enter{animation:_mat-bottom-sheet-enter 195ms cubic-bezier(0, 0, 0.2, 1) forwards}.mat-bottom-sheet-container-animations-enabled.mat-bottom-sheet-container-exit{animation:_mat-bottom-sheet-exit 375ms cubic-bezier(0.4, 0, 1, 1) backwards}.mat-bottom-sheet-container-xlarge,.mat-bottom-sheet-container-large,.mat-bottom-sheet-container-medium{border-top-left-radius:var(--mat-bottom-sheet-container-shape, 28px);border-top-right-radius:var(--mat-bottom-sheet-container-shape, 28px)}.mat-bottom-sheet-container-medium{min-width:384px;max-width:calc(100vw - 128px)}.mat-bottom-sheet-container-large{min-width:512px;max-width:calc(100vw - 256px)}.mat-bottom-sheet-container-xlarge{min-width:576px;max-width:calc(100vw - 384px)}\n"]
    }]
  }], () => [], null);
})();
var MAT_BOTTOM_SHEET_DATA = new InjectionToken("MatBottomSheetData");
var MatBottomSheetConfig = class {
  /** The view container to place the overlay for the bottom sheet into. */
  viewContainerRef;
  /** Extra CSS classes to be added to the bottom sheet container. */
  panelClass;
  /** Text layout direction for the bottom sheet. */
  direction;
  /** Data being injected into the child component. */
  data = null;
  /** Whether the bottom sheet has a backdrop. */
  hasBackdrop = true;
  /** Custom class for the backdrop. */
  backdropClass;
  /** Whether the user can use escape or clicking outside to close the bottom sheet. */
  disableClose = false;
  /** Aria label to assign to the bottom sheet element. */
  ariaLabel = null;
  /**
   * Whether this is a modal dialog. Used to set the `aria-modal` attribute. Off by default,
   * because it can interfere with other overlay-based components (e.g. `mat-select`) and because
   * it is redundant since the dialog marks all outside content as `aria-hidden` anyway.
   */
  ariaModal = false;
  /**
   * Whether the bottom sheet should close when the user goes backwards/forwards in history.
   * Note that this usually doesn't include clicking on links (unless the user is using
   * the `HashLocationStrategy`).
   */
  closeOnNavigation = true;
  /**
   * Where the bottom sheet should focus on open.
   * @breaking-change 14.0.0 Remove boolean option from autoFocus. Use string or
   * AutoFocusTarget instead.
   */
  autoFocus = "first-tabbable";
  /**
   * Whether the bottom sheet should restore focus to the
   * previously-focused element, after it's closed.
   */
  restoreFocus = true;
  /** Scroll strategy to be used for the bottom sheet. */
  scrollStrategy;
  /** Height for the bottom sheet. */
  height = "";
  /** Minimum height for the bottom sheet. If a number is provided, assumes pixel units. */
  minHeight;
  /** Maximum height for the bottom sheet. If a number is provided, assumes pixel units. */
  maxHeight;
};
var MatBottomSheetRef = class {
  _ref;
  /** Instance of the component making up the content of the bottom sheet. */
  get instance() {
    return this._ref.componentInstance;
  }
  /**
   * `ComponentRef` of the component opened into the bottom sheet. Will be
   * null when the bottom sheet is opened using a `TemplateRef`.
   */
  get componentRef() {
    return this._ref.componentRef;
  }
  /**
   * Instance of the component into which the bottom sheet content is projected.
   * @docs-private
   */
  containerInstance;
  /** Whether the user is allowed to close the bottom sheet. */
  disableClose;
  /** Subject for notifying the user that the bottom sheet has opened and appeared. */
  _afterOpened = new Subject();
  /** Result to be passed down to the `afterDismissed` stream. */
  _result;
  /** Handle to the timeout that's running as a fallback in case the exit animation doesn't fire. */
  _closeFallbackTimeout;
  constructor(_ref, config, containerInstance) {
    this._ref = _ref;
    this.containerInstance = containerInstance;
    this.disableClose = config.disableClose;
    containerInstance._animationStateChanged.pipe(filter((event) => event.phase === "done" && event.toState === "visible"), take(1)).subscribe(() => {
      this._afterOpened.next();
      this._afterOpened.complete();
    });
    containerInstance._animationStateChanged.pipe(filter((event) => event.phase === "done" && event.toState === "hidden"), take(1)).subscribe(() => {
      clearTimeout(this._closeFallbackTimeout);
      this._ref.close(this._result);
    });
    _ref.overlayRef.detachments().subscribe(() => {
      this._ref.close(this._result);
    });
    merge(this.backdropClick(), this.keydownEvents().pipe(filter((event) => event.keyCode === ESCAPE))).subscribe((event) => {
      if (!this.disableClose && (event.type !== "keydown" || !hasModifierKey(event))) {
        event.preventDefault();
        this.dismiss();
      }
    });
  }
  /**
   * Dismisses the bottom sheet.
   * @param result Data to be passed back to the bottom sheet opener.
   */
  dismiss(result) {
    if (!this.containerInstance) {
      return;
    }
    this.containerInstance._animationStateChanged.pipe(filter((event) => event.phase === "start"), take(1)).subscribe(() => {
      this._closeFallbackTimeout = setTimeout(() => this._ref.close(this._result), 500);
      this._ref.overlayRef.detachBackdrop();
    });
    this._result = result;
    this.containerInstance.exit();
    this.containerInstance = null;
  }
  /** Gets an observable that is notified when the bottom sheet is finished closing. */
  afterDismissed() {
    return this._ref.closed;
  }
  /** Gets an observable that is notified when the bottom sheet has opened and appeared. */
  afterOpened() {
    return this._afterOpened;
  }
  /**
   * Gets an observable that emits when the overlay's backdrop has been clicked.
   */
  backdropClick() {
    return this._ref.backdropClick;
  }
  /**
   * Gets an observable that emits when keydown events are targeted on the overlay.
   */
  keydownEvents() {
    return this._ref.keydownEvents;
  }
};
var MAT_BOTTOM_SHEET_DEFAULT_OPTIONS = new InjectionToken("mat-bottom-sheet-default-options");
var MatBottomSheet = class _MatBottomSheet {
  _injector = inject(Injector);
  _parentBottomSheet = inject(_MatBottomSheet, {
    optional: true,
    skipSelf: true
  });
  _animationsDisabled = _animationsDisabled();
  _defaultOptions = inject(MAT_BOTTOM_SHEET_DEFAULT_OPTIONS, {
    optional: true
  });
  _bottomSheetRefAtThisLevel = null;
  _dialog = inject(Dialog);
  /** Reference to the currently opened bottom sheet. */
  get _openedBottomSheetRef() {
    const parent = this._parentBottomSheet;
    return parent ? parent._openedBottomSheetRef : this._bottomSheetRefAtThisLevel;
  }
  set _openedBottomSheetRef(value) {
    if (this._parentBottomSheet) {
      this._parentBottomSheet._openedBottomSheetRef = value;
    } else {
      this._bottomSheetRefAtThisLevel = value;
    }
  }
  constructor() {
  }
  open(componentOrTemplateRef, config) {
    const _config = __spreadValues(__spreadValues({}, this._defaultOptions || new MatBottomSheetConfig()), config);
    let ref;
    this._dialog.open(componentOrTemplateRef, __spreadProps(__spreadValues({}, _config), {
      // Disable closing since we need to sync it up to the animation ourselves.
      disableClose: true,
      // Disable closing on detachments so that we can sync up the animation.
      closeOnOverlayDetachments: false,
      maxWidth: "100%",
      container: MatBottomSheetContainer,
      scrollStrategy: _config.scrollStrategy || createBlockScrollStrategy(this._injector),
      positionStrategy: createGlobalPositionStrategy(this._injector).centerHorizontally().bottom("0"),
      disableAnimations: this._animationsDisabled,
      templateContext: () => ({
        bottomSheetRef: ref
      }),
      providers: (cdkRef, _cdkConfig, container) => {
        ref = new MatBottomSheetRef(cdkRef, _config, container);
        return [{
          provide: MatBottomSheetRef,
          useValue: ref
        }, {
          provide: MAT_BOTTOM_SHEET_DATA,
          useValue: _config.data
        }];
      }
    }));
    ref.afterDismissed().subscribe(() => {
      if (this._openedBottomSheetRef === ref) {
        this._openedBottomSheetRef = null;
      }
    });
    if (this._openedBottomSheetRef) {
      this._openedBottomSheetRef.afterDismissed().subscribe(() => ref.containerInstance?.enter());
      this._openedBottomSheetRef.dismiss();
    } else {
      ref.containerInstance.enter();
    }
    this._openedBottomSheetRef = ref;
    return ref;
  }
  /**
   * Dismisses the currently-visible bottom sheet.
   * @param result Data to pass to the bottom sheet instance.
   */
  dismiss(result) {
    if (this._openedBottomSheetRef) {
      this._openedBottomSheetRef.dismiss(result);
    }
  }
  ngOnDestroy() {
    if (this._bottomSheetRefAtThisLevel) {
      this._bottomSheetRefAtThisLevel.dismiss();
    }
  }
  static \u0275fac = function MatBottomSheet_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatBottomSheet)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _MatBottomSheet,
    factory: _MatBottomSheet.\u0275fac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatBottomSheet, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();
var MatBottomSheetModule = class _MatBottomSheetModule {
  static \u0275fac = function MatBottomSheetModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatBottomSheetModule)();
  };
  static \u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
    type: _MatBottomSheetModule,
    imports: [DialogModule, MatCommonModule, PortalModule, MatBottomSheetContainer],
    exports: [MatBottomSheetContainer, MatCommonModule]
  });
  static \u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({
    providers: [MatBottomSheet],
    imports: [DialogModule, MatCommonModule, PortalModule, MatCommonModule]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatBottomSheetModule, [{
    type: NgModule,
    args: [{
      imports: [DialogModule, MatCommonModule, PortalModule, MatBottomSheetContainer],
      exports: [MatBottomSheetContainer, MatCommonModule],
      providers: [MatBottomSheet]
    }]
  }], null, null);
})();

// src/app/features/legacy/SMS_DYNAMIC/pages/combo-list-page/combo-list-page.component.ts
function ComboListPageComponent_button_24_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 23);
    \u0275\u0275listener("click", function ComboListPageComponent_button_24_Template_button_click_0_listener() {
      const c_r3 = \u0275\u0275restoreView(_r2).$implicit;
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.toggleChip(c_r3.key));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const c_r3 = ctx.$implicit;
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275classProp("active", ctx_r3.isSelected(c_r3.key));
    \u0275\u0275attribute("aria-pressed", ctx_r3.isSelected(c_r3.key));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", c_r3.label, " ");
  }
}
function ComboListPageComponent_div_25_div_2_p_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 38);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const t_r7 = ctx.ngIf;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", t_r7, " ");
  }
}
function ComboListPageComponent_div_25_div_2_ng_template_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 39);
    \u0275\u0275text(1, "(sin texto de SMS)");
    \u0275\u0275elementEnd();
  }
}
function ComboListPageComponent_div_25_div_2_span_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 40);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const s_r8 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", s_r8 === "SALDO_MORA" ? "MORA" : s_r8 === "LTD_LTDE" ? "LTD y LTDE" : s_r8, " ");
  }
}
function ComboListPageComponent_div_25_div_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 27)(1, "div", 28)(2, "span", 29);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 30)(5, "button", 31);
    \u0275\u0275listener("click", function ComboListPageComponent_div_25_div_2_Template_button_click_5_listener() {
      const r_r6 = \u0275\u0275restoreView(_r5).$implicit;
      const ctx_r3 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r3.preview(r_r6));
    });
    \u0275\u0275elementStart(6, "span", 16);
    \u0275\u0275text(7, "visibility");
    \u0275\u0275elementEnd();
    \u0275\u0275text(8, " Preview ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "button", 32);
    \u0275\u0275listener("click", function ComboListPageComponent_div_25_div_2_Template_button_click_9_listener() {
      const r_r6 = \u0275\u0275restoreView(_r5).$implicit;
      const ctx_r3 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r3.openEdit(r_r6));
    });
    \u0275\u0275elementStart(10, "span", 16);
    \u0275\u0275text(11, "edit");
    \u0275\u0275elementEnd();
    \u0275\u0275text(12, " Editar ");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(13, "div", 33)(14, "div", 34);
    \u0275\u0275template(15, ComboListPageComponent_div_25_div_2_p_15_Template, 2, 1, "p", 35)(16, ComboListPageComponent_div_25_div_2_ng_template_16_Template, 2, 0, "ng-template", null, 3, \u0275\u0275templateRefExtractor);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "div", 36);
    \u0275\u0275template(19, ComboListPageComponent_div_25_div_2_span_19_Template, 2, 1, "span", 37);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const r_r6 = ctx.$implicit;
    const noSms_r9 = \u0275\u0275reference(17);
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(r_r6.name || "(Sin nombre)");
    \u0275\u0275advance(12);
    \u0275\u0275property("ngIf", r_r6.plantillaTexto)("ngIfElse", noSms_r9);
    \u0275\u0275advance(4);
    \u0275\u0275property("ngForOf", ctx_r3.visibleTags(r_r6));
  }
}
function ComboListPageComponent_div_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 24)(1, "div", 25);
    \u0275\u0275template(2, ComboListPageComponent_div_25_div_2_Template, 20, 4, "div", 26);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275property("ngForOf", ctx_r3.filtered())("ngForTrackBy", ctx_r3.trackById);
  }
}
function ComboListPageComponent_ng_template_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 41)(1, "i", 16);
    \u0275\u0275text(2, "inbox");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p");
    \u0275\u0275text(4, "No hay tenores disponibles");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 42);
    \u0275\u0275text(6, "Crea un nuevo tenor o ajusta los filtros");
    \u0275\u0275elementEnd()();
  }
}
function ComboListPageComponent_div_28_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 43);
    \u0275\u0275listener("click", function ComboListPageComponent_div_28_Template_div_click_0_listener() {
      \u0275\u0275restoreView(_r10);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.closePreview());
    });
    \u0275\u0275elementEnd();
  }
}
function ComboListPageComponent_aside_29_div_9_ng_container_1_div_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 58)(1, "div", 59);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 60);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const p_r12 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(p_r12[0]);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(p_r12[1]);
  }
}
function ComboListPageComponent_aside_29_div_9_ng_container_1_section_3_small_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 65);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const sms_r13 = ctx.ngIf;
    const ctx_r3 = \u0275\u0275nextContext(5);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r3.smsLen(sms_r13).chars, "/160 caracteres ");
  }
}
function ComboListPageComponent_aside_29_div_9_ng_container_1_section_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 61)(1, "label", 62);
    \u0275\u0275text(2, "Previsualizaci\xF3n del SMS");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 63);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275template(5, ComboListPageComponent_aside_29_div_9_ng_container_1_section_3_small_5_Template, 2, 1, "small", 64);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext(4);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r3.previewSms());
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r3.previewSms());
  }
}
function ComboListPageComponent_aside_29_div_9_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275elementStart(1, "div", 55);
    \u0275\u0275template(2, ComboListPageComponent_aside_29_div_9_ng_container_1_div_2_Template, 5, 2, "div", 56);
    \u0275\u0275elementEnd();
    \u0275\u0275template(3, ComboListPageComponent_aside_29_div_9_ng_container_1_section_3_Template, 6, 2, "section", 57);
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngForOf", ctx_r3.previewPairs());
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r3.previewSms() !== null);
  }
}
function ComboListPageComponent_aside_29_div_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 53);
    \u0275\u0275template(1, ComboListPageComponent_aside_29_div_9_ng_container_1_Template, 4, 2, "ng-container", 54);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext(2);
    const emptyTpl_r14 = \u0275\u0275reference(33);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r3.previewRow())("ngIfElse", emptyTpl_r14);
  }
}
function ComboListPageComponent_aside_29_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "aside", 44);
    \u0275\u0275listener("click", function ComboListPageComponent_aside_29_Template_aside_click_0_listener($event) {
      \u0275\u0275restoreView(_r11);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275elementStart(1, "header", 45)(2, "h3", 46);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275element(4, "div", 47);
    \u0275\u0275elementStart(5, "button", 48);
    \u0275\u0275listener("click", function ComboListPageComponent_aside_29_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r11);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.closePreview());
    });
    \u0275\u0275elementStart(6, "span", 16);
    \u0275\u0275text(7, "close");
    \u0275\u0275elementEnd();
    \u0275\u0275text(8, " Cerrar ");
    \u0275\u0275elementEnd()();
    \u0275\u0275template(9, ComboListPageComponent_aside_29_div_9_Template, 2, 2, "div", 49);
    \u0275\u0275elementStart(10, "footer", 50);
    \u0275\u0275element(11, "div", 47);
    \u0275\u0275elementStart(12, "button", 51);
    \u0275\u0275listener("click", function ComboListPageComponent_aside_29_Template_button_click_12_listener() {
      \u0275\u0275restoreView(_r11);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.exportSelected());
    });
    \u0275\u0275elementStart(13, "span", 16);
    \u0275\u0275text(14, "download");
    \u0275\u0275elementEnd();
    \u0275\u0275text(15, " Exportar ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "button", 52);
    \u0275\u0275listener("click", function ComboListPageComponent_aside_29_Template_button_click_16_listener() {
      \u0275\u0275restoreView(_r11);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.removeSelected());
    });
    \u0275\u0275elementStart(17, "span", 16);
    \u0275\u0275text(18, "delete");
    \u0275\u0275elementEnd();
    \u0275\u0275text(19, " Eliminar ");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext();
    const loadingTpl_r15 = \u0275\u0275reference(31);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r3.previewTitle());
    \u0275\u0275advance(6);
    \u0275\u0275property("ngIf", !ctx_r3.previewLoading())("ngIfElse", loadingTpl_r15);
  }
}
function ComboListPageComponent_ng_template_30_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 66);
    \u0275\u0275element(1, "div", 67);
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3, "Cargando\u2026");
    \u0275\u0275elementEnd()();
  }
}
function ComboListPageComponent_ng_template_32_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 68)(1, "span", 16);
    \u0275\u0275text(2, "info");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p");
    \u0275\u0275text(4, "No se encontraron filas para este combo.");
    \u0275\u0275elementEnd()();
  }
}
var _ComboListPageComponent = class _ComboListPageComponent {
  openEdit(c) {
    this.dialog.open(EditComboDialogComponent, {
      data: c,
      width: "650px",
      maxWidth: "92vw",
      autoFocus: false,
      panelClass: "combo-dialog"
      // para estilos del contenedor
    }).afterClosed().subscribe((ok) => ok && this.load());
  }
  labelOf(k) {
    if (k === "TELEFONOCELULAR")
      return "TEL\xC9FONO";
    if (k === "DEUDA_TOTAL")
      return "DEUDA TOTAL";
    return k.replaceAll("_", " ").toUpperCase();
  }
  preview(c) {
    this.lockBodyScroll(true);
    this.previewOpen.set(true);
    this.previewTitle.set(`${c.name}`);
    this.previewLoading.set(true);
    this.previewRow.set(null);
    this.previewSms.set(null);
    this.selectedCombo.set(c);
    this.api.previewFromCombo(c.id, 1e3).subscribe({
      next: (rows) => {
        const first = rows?.[0] ?? {};
        this.previewRow.set(first);
        const renderYMostrar = (tpl) => {
          const rendered = renderPreviewMessage(tpl || "", first);
          this.previewSms.set(rendered || "(sin texto)");
          this.previewLoading.set(false);
        };
        if (c.plantillaTexto) {
          renderYMostrar(c.plantillaTexto);
        } else if (c.plantillaSmsId) {
          this.api.getPlantillaTexto(c.plantillaSmsId).subscribe({
            next: (res) => renderYMostrar(typeof res === "string" ? res : res?.template ?? ""),
            error: (_) => {
              this.previewSms.set("(no se pudo cargar el texto)");
              this.previewLoading.set(false);
            }
          });
        } else {
          this.previewSms.set("(sin texto de SMS)");
          this.previewLoading.set(false);
        }
      },
      error: (_) => {
        this.previewLoading.set(false);
        this.previewSms.set("(error al obtener preview)");
      }
    });
  }
  constructor(bottomSheet, matDialog) {
    this.bottomSheet = bottomSheet;
    this.matDialog = matDialog;
    this.api = inject(ComboService);
    this.fb = inject(FormBuilder);
    this.dialog = inject(MatDialog);
    this.router = inject(Router);
    this.previewSms = signal(null, ...ngDevMode ? [{ debugName: "previewSms" }] : []);
    this.smsLen = (t) => smsSegmentsLen(t);
    this.selectedCombo = signal(null, ...ngDevMode ? [{ debugName: "selectedCombo" }] : []);
    this.previewOpen = signal(false, ...ngDevMode ? [{ debugName: "previewOpen" }] : []);
    this.previewTitle = signal("", ...ngDevMode ? [{ debugName: "previewTitle" }] : []);
    this.previewRow = signal(null, ...ngDevMode ? [{ debugName: "previewRow" }] : []);
    this.previewLoading = signal(false, ...ngDevMode ? [{ debugName: "previewLoading" }] : []);
    this.previewOrder = [
      "DOCUMENTO",
      "TELEFONOCELULAR",
      "NOMBRE",
      "BAJA30",
      "DEUDA_TOTAL"
    ];
    this.all = signal([], ...ngDevMode ? [{ debugName: "all" }] : []);
    this.loading = signal(false, ...ngDevMode ? [{ debugName: "loading" }] : []);
    this.chips = [
      { key: "NOMBRE", label: "Nombre" },
      { key: "LTD", label: "LTD" },
      { key: "LTDE", label: "LTDE" },
      { key: "LTD_LTDE", label: "LTD + LTDE" },
      // solo visual
      { key: "BAJA30", label: "Baja 30" },
      { key: "SALDO_MORA", label: "Mora" },
      { key: "BAJA30_SALDOMORA", label: "Baja30 + Mora" },
      { key: "PKM", label: "PKM" },
      { key: "CAPITAL", label: "Capital" },
      { key: "DEUDA_TOTAL", label: "Deuda Total" },
      { key: "MANANA", label: "Ma\xF1ana" },
      { key: "HOY", label: "Hoy" },
      { key: "NOMBRECOMPLETO", label: "Nombre Completo" },
      { key: "EMAIL", label: "Correo" },
      { key: "NUMCUENTAPMCP", label: "N\xFAmero de Cuenta" },
      { key: "DIASMORA", label: "D\xEDas Mora" }
    ];
    this.selected = signal(/* @__PURE__ */ new Set(), ...ngDevMode ? [{ debugName: "selected" }] : []);
    this.form = this.fb.nonNullable.group({
      q: "",
      tramo: "ALL",
      soloActivos: true
    });
    this.filtersSig = toSignal(this.form.valueChanges.pipe(startWith(this.form.getRawValue())), { initialValue: this.form.getRawValue() });
    this.filtered = computed(() => {
      const { q, tramo, soloActivos } = this.filtersSig();
      const keys = this.selected();
      const qn = (q ?? "").trim().toLowerCase();
      return this.all().filter((c) => {
        if (soloActivos && !c.isActive)
          return false;
        if (tramo !== "ALL" && c.tramo !== tramo)
          return false;
        if (keys.size) {
          const s = new Set(c.selects ?? []);
          const hasNombre = s.has("NOMBRE") || /\{NOMBRE\}/i.test(c.plantillaTexto || "");
          for (const k of keys) {
            if (k === "NOMBRE") {
              if (!hasNombre)
                return false;
              continue;
            }
            if (!s.has(k))
              return false;
          }
        }
        if (qn) {
          const hay = (c.name ?? "").toLowerCase().includes(qn) || (c.plantillaTexto ?? "").toLowerCase().includes(qn);
          if (!hay)
            return false;
        }
        return true;
      });
    }, ...ngDevMode ? [{ debugName: "filtered" }] : []);
    this.displayedColumns = ["name", "selects", "acciones"];
    this.savedScrollTop = 0;
    this.load();
    effect(() => this.filtered());
  }
  load() {
    this.loading.set(true);
    this.api.list().subscribe({
      next: (rs) => {
        this.all.set(rs ?? []);
        this.loading.set(false);
      },
      error: (_) => {
        this.all.set([]);
        this.loading.set(false);
      }
    });
  }
  trackById(_i, r) {
    return r.id;
  }
  // chips
  isSelected(key) {
    return this.selected().has(key);
  }
  toggleChip(key) {
    const set = new Set(this.selected());
    set.has(key) ? set.delete(key) : set.add(key);
    this.selected.set(set);
  }
  clearChips() {
    this.selected.set(/* @__PURE__ */ new Set());
  }
  buildDownloadName(c) {
    const date = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
    const base = (c.name ?? `combo_${c.id}`).trim();
    const safe = base.replace(/[<>:"/\\|?*]+/g, "").replace(/\s+/g, " ").slice(0, 150);
    return `${safe} - ${date}.xlsx`;
  }
  /** Pop-up reutilizable */
  alert(message, title = "Aviso") {
    this.matDialog.open(AlertDialogComponent, {
      width: "420px",
      data: { title, message }
    });
  }
  export(c) {
    const id = c.id;
    const dlg = this.matDialog.open(LoadingDialogComponent, {
      disableClose: true,
      data: { title: "Generando Excel\u2026", subtitle: "Preparando datos y creando archivo" },
      panelClass: "loading-dialog-panel",
      backdropClass: "blur-dialog-backdrop",
      width: "460px",
      height: "310px"
    });
    this.api.precheck(id).subscribe({
      next: (res) => {
        if (!res.ok) {
          dlg.close();
          const header = `${res.excedidos} ${res.excedidos === 1 ? "fila" : "filas"} superan los caracteres.`;
          const ejemplosTxt = (res.ejemplos ?? []).map((e, i) => `\u2022 ${e.len} caracteres \u2014 DNI: ${e.documento || "(sin DNI)"}`).join("\n");
          this.alert(`${header}

Primeros ${Math.min((res.ejemplos ?? []).length, 3)} casos:
${ejemplosTxt}$`, "Mensaje demasiado largo");
          return;
        }
        this.api.exportFromCombo(id).pipe(finalize(() => dlg.close())).subscribe({
          next: (blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = this.buildDownloadName(c);
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
          },
          error: (err) => {
            dlg.close();
            const msg = err?.status === 422 ? err?.error?.message || "No hay filas para exportar con los filtros seleccionados." : err?.error?.message || err?.message || "Ocurri\xF3 un error al exportar.";
            this.alert(msg, err?.status === 422 ? "Sin resultados" : "Error");
          }
        });
      },
      error: (err) => {
        const msg = err?.error?.message || err?.message || "No se pudo validar el SMS del combo.";
        this.alert(msg, "Error en precheck");
      }
    });
  }
  // acciones desde el sheet
  exportSelected() {
    const c = this.selectedCombo();
    if (!c)
      return;
    this.export(c);
  }
  removeSelected() {
    const c = this.selectedCombo();
    if (!c)
      return;
    if (!confirm(`\xBFEliminar el combo "${c.name}"?`))
      return;
    this.api.delete(c.id).subscribe(() => {
      this.closePreview();
      this.load();
    });
  }
  closePreview() {
    this.previewOpen.set(false);
    this.lockBodyScroll(false);
    this.previewSms.set("");
    this.previewSms.set(null);
    this.previewRow.set(null);
    this.selectedCombo.set(null);
  }
  // devuelve pares [label, value] en orden bonito (si existen), y luego el resto
  previewPairs() {
    const row = this.previewRow();
    if (!row)
      return [];
    const used = /* @__PURE__ */ new Set();
    const primary = [];
    for (const k of this.previewOrder) {
      if (row[k] !== void 0) {
        primary.push([this.labelOf(String(k)), row[k]]);
        used.add(String(k));
      }
    }
    const rest = [];
    for (const [k, v] of Object.entries(row)) {
      if (!used.has(k))
        rest.push([this.labelOf(k), v]);
    }
    return [...primary, ...rest];
  }
  New() {
    this.router.navigate(["/sms/dynamic"]);
  }
  remove(c) {
    if (!confirm(`\xBFEliminar el combo "${c.name}"?`))
      return;
    this.api.delete(c.id).subscribe(() => this.load());
  }
  lockBodyScroll(lock) {
    const body = document.body;
    if (lock) {
      this.savedScrollTop = window.scrollY || window.pageYOffset || 0;
      body.style.top = `-${this.savedScrollTop}px`;
      body.classList.add("no-scroll");
    } else {
      body.classList.remove("no-scroll");
      body.style.top = "";
      window.scrollTo(0, this.savedScrollTop || 0);
    }
  }
  visibleTags(c) {
    const out = [...c.selects ?? []];
    if (/\{NOMBRE\}/i.test(c.plantillaTexto || "") && !out.includes("NOMBRE")) {
      out.unshift("NOMBRE");
    }
    return out;
  }
};
_ComboListPageComponent.\u0275fac = function ComboListPageComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _ComboListPageComponent)(\u0275\u0275directiveInject(MatBottomSheet), \u0275\u0275directiveInject(MatDialog));
};
_ComboListPageComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ComboListPageComponent, selectors: [["app-combo-list-page"]], decls: 34, vars: 7, consts: [["noData", ""], ["loadingTpl", ""], ["emptyTpl", ""], ["noSms", ""], [1, "container"], [1, "header-section"], [1, "main-title"], [1, "filters-wrapper"], [1, "search-filters"], ["type", "text", "placeholder", "Buscar por nombre o tenor...", 1, "search-input", 3, "formControl"], [1, "tramo-select", 3, "formControl"], ["value", "ALL"], ["value", "3"], ["value", "5"], [1, "action-buttons"], ["mat-button", "", "type", "button", 1, "clear-filters-btn", 3, "click"], [1, "material-icons"], ["mat-button", "", "type", "button", 1, "create-tenor-btn", 3, "click"], [1, "chips-wrapper"], ["type", "button", "class", "filter-chip", 3, "active", "click", 4, "ngFor", "ngForOf"], ["class", "tenors-wrapper", 4, "ngIf", "ngIfElse"], ["class", "sheet-backdrop", 3, "click", 4, "ngIf"], ["class", "preview-sheet", 3, "click", 4, "ngIf"], ["type", "button", 1, "filter-chip", 3, "click"], [1, "tenors-wrapper"], [1, "tenors-list"], ["class", "tenor-row", 4, "ngFor", "ngForOf", "ngForTrackBy"], [1, "tenor-row"], [1, "tenor-header"], [1, "tenor-label"], [1, "tenor-actions"], ["mat-button", "", 1, "preview-btn", 3, "click"], ["mat-button", "", 1, "edit-btn", 3, "click"], [1, "tenor-content"], [1, "tenor-text"], ["class", "sms-text", 4, "ngIf", "ngIfElse"], [1, "tenor-tags"], ["class", "tag", 4, "ngFor", "ngForOf"], [1, "sms-text"], [1, "sms-text", "no-text"], [1, "tag"], [1, "empty-state"], [1, "empty-subtitle"], [1, "sheet-backdrop", 3, "click"], [1, "preview-sheet", 3, "click"], [1, "sheet-header"], [1, "sheet-title"], [1, "sheet-spacer"], ["mat-button", "", 1, "close-btn", 3, "click"], ["class", "sheet-body", 4, "ngIf", "ngIfElse"], [1, "sheet-footer"], ["mat-stroked-button", "", 1, "export-btn", 3, "click"], ["mat-button", "", "color", "warn", 1, "delete-btn", 3, "click"], [1, "sheet-body"], [4, "ngIf", "ngIfElse"], [1, "data-grid"], ["class", "data-row", 4, "ngFor", "ngForOf"], ["class", "sms-section", 4, "ngIf"], [1, "data-row"], [1, "data-key"], [1, "data-value"], [1, "sms-section"], [1, "sms-label"], [1, "sms-bubble"], ["class", "sms-counter", 4, "ngIf"], [1, "sms-counter"], [1, "sheet-loading"], [1, "loading-spinner"], [1, "sheet-empty"]], template: function ComboListPageComponent_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 4)(1, "div", 5)(2, "h2", 6);
    \u0275\u0275text(3, "Gesti\xF3n de Tenores");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 7)(5, "div", 8);
    \u0275\u0275element(6, "input", 9);
    \u0275\u0275elementStart(7, "select", 10)(8, "option", 11);
    \u0275\u0275text(9, "Todos los tramos");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "option", 12);
    \u0275\u0275text(11, "Tramo 3");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "option", 13);
    \u0275\u0275text(13, "Tramo 5");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(14, "div", 14)(15, "button", 15);
    \u0275\u0275listener("click", function ComboListPageComponent_Template_button_click_15_listener() {
      \u0275\u0275restoreView(_r1);
      return \u0275\u0275resetView(ctx.clearChips());
    });
    \u0275\u0275elementStart(16, "span", 16);
    \u0275\u0275text(17, "clear_all");
    \u0275\u0275elementEnd();
    \u0275\u0275text(18, " Limpiar ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "button", 17);
    \u0275\u0275listener("click", function ComboListPageComponent_Template_button_click_19_listener() {
      \u0275\u0275restoreView(_r1);
      return \u0275\u0275resetView(ctx.New());
    });
    \u0275\u0275elementStart(20, "span", 16);
    \u0275\u0275text(21, "add");
    \u0275\u0275elementEnd();
    \u0275\u0275text(22, " Crear ");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(23, "div", 18);
    \u0275\u0275template(24, ComboListPageComponent_button_24_Template, 2, 4, "button", 19);
    \u0275\u0275elementEnd();
    \u0275\u0275template(25, ComboListPageComponent_div_25_Template, 3, 2, "div", 20)(26, ComboListPageComponent_ng_template_26_Template, 7, 0, "ng-template", null, 0, \u0275\u0275templateRefExtractor);
    \u0275\u0275elementEnd();
    \u0275\u0275template(28, ComboListPageComponent_div_28_Template, 1, 0, "div", 21)(29, ComboListPageComponent_aside_29_Template, 20, 3, "aside", 22)(30, ComboListPageComponent_ng_template_30_Template, 4, 0, "ng-template", null, 1, \u0275\u0275templateRefExtractor)(32, ComboListPageComponent_ng_template_32_Template, 5, 0, "ng-template", null, 2, \u0275\u0275templateRefExtractor);
  }
  if (rf & 2) {
    const noData_r16 = \u0275\u0275reference(27);
    \u0275\u0275advance(6);
    \u0275\u0275property("formControl", ctx.form.controls.q);
    \u0275\u0275advance();
    \u0275\u0275property("formControl", ctx.form.controls.tramo);
    \u0275\u0275advance(17);
    \u0275\u0275property("ngForOf", ctx.chips);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.filtered().length)("ngIfElse", noData_r16);
    \u0275\u0275advance(3);
    \u0275\u0275property("ngIf", ctx.previewOpen());
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.previewOpen());
  }
}, dependencies: [
  CommonModule,
  NgForOf,
  NgIf,
  ReactiveFormsModule,
  NgSelectOption,
  \u0275NgSelectMultipleOption,
  DefaultValueAccessor,
  SelectControlValueAccessor,
  NgControlStatus,
  FormControlDirective,
  MatTableModule,
  MatButtonModule,
  MatButton,
  MatIconModule,
  MatDialogModule
], styles: ['\n\n.container[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #f8fafc 0%,\n      #f1f5f9 100%);\n  padding: 1.4rem;\n  border-radius: 16px;\n  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);\n  width: 100%;\n  max-width: 1400px;\n  margin: 0 auto;\n  min-height: 500px;\n  margin-top: 0;\n}\n.header-section[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 1.5rem;\n  padding-bottom: 1.2rem;\n  border-bottom: 2px solid #e2e8f0;\n  flex-wrap: wrap;\n  gap: 1rem;\n}\n.main-title[_ngcontent-%COMP%] {\n  color: #1e293b;\n  font-size: 1.75rem;\n  font-weight: 600;\n  margin: 0;\n  background:\n    linear-gradient(\n      135deg,\n      #3b82f6,\n      #2563eb);\n  -webkit-background-clip: text;\n  -webkit-text-fill-color: transparent;\n  background-clip: text;\n}\n.filters-wrapper[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 1rem;\n  align-items: center;\n  flex-wrap: wrap;\n}\n.search-filters[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 0.75rem;\n  align-items: center;\n}\n.search-input[_ngcontent-%COMP%] {\n  padding: 0.75rem 1rem;\n  border: 1px solid #d1d5db;\n  border-radius: 8px;\n  font-size: 0.95rem;\n  transition: all 0.2s ease;\n  background: white;\n  min-width: 250px;\n}\n.search-input[_ngcontent-%COMP%]:focus {\n  outline: none;\n  border-color: #3b82f6;\n  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);\n}\n.tramo-select[_ngcontent-%COMP%] {\n  padding: 0.75rem 1rem;\n  border: 1px solid #d1d5db;\n  border-radius: 8px;\n  font-size: 0.95rem;\n  transition: all 0.2s ease;\n  background: white;\n  min-width: 150px;\n  cursor: pointer;\n}\n.tramo-select[_ngcontent-%COMP%]:focus {\n  outline: none;\n  border-color: #3b82f6;\n  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);\n}\n.action-buttons[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 0.75rem;\n  align-items: center;\n}\n.clear-filters-btn[_ngcontent-%COMP%], \n.create-tenor-btn[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  padding: 0.75rem 1.5rem;\n  border-radius: 8px;\n  font-weight: 500;\n  transition: all 0.2s ease;\n  border: none;\n  cursor: pointer;\n}\n.clear-filters-btn[_ngcontent-%COMP%] {\n  background: transparent;\n  color: #64748b;\n  border: 2px solid #e2e8f0;\n}\n.clear-filters-btn[_ngcontent-%COMP%]:hover {\n  background: #f8fafc;\n  border-color: #cbd5e1;\n}\n.create-tenor-btn[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #3b82f6,\n      #2563eb);\n  color: white !important;\n}\n.create-tenor-btn[_ngcontent-%COMP%]   .material-icons[_ngcontent-%COMP%] {\n  color: white !important;\n}\n.create-tenor-btn[_ngcontent-%COMP%]:hover {\n  background:\n    linear-gradient(\n      135deg,\n      #2563eb,\n      #1d4ed8);\n  transform: translateY(-1px);\n  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);\n}\n.chips-wrapper[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.75rem;\n  margin-bottom: 1.5rem;\n  padding: 1rem;\n  background: white;\n  border-radius: 12px;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);\n}\n.filter-chip[_ngcontent-%COMP%] {\n  padding: 0.5rem 1rem;\n  border: 2px solid #e2e8f0;\n  border-radius: 20px;\n  background: white;\n  color: #64748b;\n  font-size: 0.9rem;\n  font-weight: 500;\n  cursor: pointer;\n  transition: all 0.2s ease;\n}\n.filter-chip[_ngcontent-%COMP%]:hover {\n  background: #f8fafc;\n  border-color: #cbd5e1;\n  transform: translateY(-1px);\n}\n.filter-chip.active[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #3b82f6,\n      #2563eb);\n  color: white;\n  border-color: transparent;\n}\n.tenors-wrapper[_ngcontent-%COMP%] {\n  background: white;\n  border-radius: 12px;\n  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);\n  overflow: hidden;\n}\n.tenors-list[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 0;\n}\n.tenor-row[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #ffffff 0%,\n      #f8fafc 100%);\n  border-bottom: 1px solid #e2e8f0;\n  padding: 1.2rem 1.5rem;\n  transition: all 0.3s ease;\n  position: relative;\n  overflow: hidden;\n}\n.tenor-row[_ngcontent-%COMP%]:last-child {\n  border-bottom: none;\n}\n.tenor-row[_ngcontent-%COMP%]::before {\n  content: "";\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  width: 3px;\n  background:\n    linear-gradient(\n      180deg,\n      #3b82f6,\n      #2563eb);\n  transform: scaleY(0);\n  transition: transform 0.3s ease;\n  transform-origin: top;\n}\n.tenor-row[_ngcontent-%COMP%]:hover {\n  background:\n    linear-gradient(\n      135deg,\n      #f8fafc 0%,\n      #f1f5f9 100%);\n  padding-left: 1.8rem;\n}\n.tenor-row[_ngcontent-%COMP%]:hover::before {\n  transform: scaleY(1);\n}\n.tenor-header[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 0.75rem;\n  gap: 1rem;\n}\n.tenor-label[_ngcontent-%COMP%] {\n  font-weight: 600;\n  color: #1e293b;\n  font-size: 1.1rem;\n  padding: 0.4rem 0.8rem;\n  background:\n    linear-gradient(\n      135deg,\n      #f1f5f9,\n      #e2e8f0);\n  border-radius: 8px;\n  border: 1px solid #cbd5e1;\n}\n.tenor-actions[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 0.5rem;\n  align-items: center;\n}\n.preview-btn[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.4rem;\n  padding: 0.5rem 1rem;\n  border-radius: 6px;\n  font-size: 0.9rem;\n  font-weight: 500;\n  transition: all 0.2s ease;\n  cursor: pointer;\n  color: #293c4e;\n  background: transparent;\n  border: 2px solid #e2e8f0;\n}\n.edit-btn[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.4rem;\n  padding: 0.5rem 1rem;\n  border-radius: 6px;\n  font-size: 0.9rem;\n  font-weight: 500;\n  transition: all 0.2s ease;\n  cursor: pointer;\n  color: #255d80;\n  background: transparent;\n  border: 2px solid #e2e8f0;\n}\n.preview-btn[_ngcontent-%COMP%]:hover {\n  background: #293c4e;\n  color: white;\n}\n.edit-btn[_ngcontent-%COMP%]:hover {\n  background: #345187;\n  color: white;\n}\n.preview-btn[_ngcontent-%COMP%]   .material-icons[_ngcontent-%COMP%], \n.edit-btn[_ngcontent-%COMP%]   .material-icons[_ngcontent-%COMP%] {\n  font-size: 18px;\n}\n.tenor-content[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: flex-start;\n  gap: 1rem;\n}\n.tenor-text[_ngcontent-%COMP%] {\n  flex: 1;\n  padding-right: 1rem;\n}\n.sms-text[_ngcontent-%COMP%] {\n  color: #475569;\n  font-size: 0.95rem;\n  line-height: 1.6;\n  margin: 0;\n  padding: 0.75rem;\n  background: #f8fafc;\n  border-radius: 8px;\n  border-left: 3px solid #cbd5e1;\n}\n.sms-text.no-text[_ngcontent-%COMP%] {\n  color: #9ca3af;\n  font-style: italic;\n}\n.tenor-tags[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.5rem;\n  align-items: center;\n  max-width: 300px;\n}\n.tag[_ngcontent-%COMP%] {\n  padding: 0.35rem 0.75rem;\n  background:\n    linear-gradient(\n      135deg,\n      #dbeafe,\n      #bfdbfe);\n  color: #1d4ed8;\n  border-radius: 6px;\n  font-size: 0.85rem;\n  font-weight: 500;\n  border: 1px solid #93c5fd;\n}\n.empty-state[_ngcontent-%COMP%] {\n  text-align: center;\n  padding: 3rem 2rem;\n  color: #6b7280;\n  background:\n    linear-gradient(\n      135deg,\n      #f8fafc 0%,\n      #f1f5f9 100%);\n  border: 2px dashed #d1d5db;\n  border-radius: 12px;\n  margin-top: 2rem;\n}\n.empty-state[_ngcontent-%COMP%]   .material-icons[_ngcontent-%COMP%] {\n  font-size: 3rem;\n  color: #9ca3af;\n  margin-bottom: 1rem;\n  display: block;\n}\n.empty-state[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0.5rem 0;\n  font-size: 1.1rem;\n  font-weight: 500;\n}\n.empty-subtitle[_ngcontent-%COMP%] {\n  color: #9ca3af !important;\n  font-size: 0.9rem !important;\n  font-weight: 400 !important;\n}\n.sheet-backdrop[_ngcontent-%COMP%] {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background: rgba(0, 0, 0, 0.4);\n  z-index: 999;\n  animation: _ngcontent-%COMP%_fadeIn 0.2s ease;\n}\n.preview-sheet[_ngcontent-%COMP%] {\n  position: fixed;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  width: 480px;\n  background: white;\n  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.1);\n  z-index: 1000;\n  display: flex;\n  flex-direction: column;\n  animation: _ngcontent-%COMP%_slideIn 0.3s ease;\n}\n.sheet-header[_ngcontent-%COMP%] {\n  padding: 1.5rem;\n  border-bottom: 1px solid #e2e8f0;\n  display: flex;\n  align-items: center;\n  background:\n    linear-gradient(\n      135deg,\n      #f8fafc 0%,\n      #f1f5f9 100%);\n}\n.sheet-title[_ngcontent-%COMP%] {\n  font-size: 1.25rem;\n  font-weight: 600;\n  color: #1e293b;\n  margin: 0;\n}\n.sheet-spacer[_ngcontent-%COMP%] {\n  flex: 1;\n}\n.close-btn[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  padding: 0.5rem 1rem;\n  border-radius: 6px;\n  background: transparent;\n  border: 1px solid #e2e8f0;\n  color: #64748b;\n  cursor: pointer;\n  transition: all 0.2s ease;\n}\n.close-btn[_ngcontent-%COMP%]:hover {\n  background: #f8fafc;\n  border-color: #cbd5e1;\n}\n.sheet-body[_ngcontent-%COMP%] {\n  flex: 1;\n  overflow-y: auto;\n  padding: 1.5rem;\n}\n.data-grid[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 0.75rem;\n  margin-bottom: 1.5rem;\n}\n.data-row[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 140px 1fr;\n  gap: 1rem;\n  padding: 0.75rem;\n  background: #f8fafc;\n  border-radius: 6px;\n}\n.data-key[_ngcontent-%COMP%] {\n  font-weight: 600;\n  color: #475569;\n  font-size: 0.9rem;\n}\n.data-value[_ngcontent-%COMP%] {\n  color: #1e293b;\n  font-size: 0.9rem;\n}\n.sms-section[_ngcontent-%COMP%] {\n  margin-top: 1.5rem;\n  padding-top: 1.5rem;\n  border-top: 1px solid #e2e8f0;\n}\n.sms-label[_ngcontent-%COMP%] {\n  display: block;\n  font-weight: 600;\n  color: #475569;\n  font-size: 0.95rem;\n  margin-bottom: 0.75rem;\n}\n.sms-bubble[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #3b82f6,\n      #2563eb);\n  color: white;\n  padding: 1rem;\n  border-radius: 12px;\n  font-size: 0.95rem;\n  line-height: 1.5;\n  position: relative;\n  margin-bottom: 0.5rem;\n}\n.sms-counter[_ngcontent-%COMP%] {\n  color: #64748b;\n  font-size: 0.85rem;\n}\n.sheet-footer[_ngcontent-%COMP%] {\n  padding: 1.5rem;\n  border-top: 1px solid #e2e8f0;\n  display: flex;\n  gap: 0.75rem;\n  background: #f8fafc;\n}\n.export-btn[_ngcontent-%COMP%], \n.delete-btn[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  padding: 0.75rem 1.5rem;\n  border-radius: 6px;\n  font-weight: 500;\n  cursor: pointer;\n  transition: all 0.2s ease;\n}\n.export-btn[_ngcontent-%COMP%] {\n  background: transparent;\n  border: 2px solid #3b82f6;\n  color: #3b82f6;\n}\n.export-btn[_ngcontent-%COMP%]:hover {\n  background: #3b82f6;\n  color: white;\n}\n.delete-btn[_ngcontent-%COMP%] {\n  background: #ef4444;\n  border: none;\n  color: white !important;\n}\n.delete-btn[_ngcontent-%COMP%]   .material-icons[_ngcontent-%COMP%] {\n  color: white;\n}\n.delete-btn[_ngcontent-%COMP%]:hover {\n  background: white;\n  border: 2px solid #dc2626;\n  color: #dc2626 !important;\n}\n.delete-btn[_ngcontent-%COMP%]:hover   .material-icons[_ngcontent-%COMP%] {\n  color: #dc2626;\n}\n.sheet-loading[_ngcontent-%COMP%], \n.sheet-empty[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  padding: 3rem;\n  color: #64748b;\n}\n.loading-spinner[_ngcontent-%COMP%] {\n  width: 40px;\n  height: 40px;\n  border: 3px solid #e2e8f0;\n  border-top-color: #3b82f6;\n  border-radius: 50%;\n  animation: _ngcontent-%COMP%_spin 1s linear infinite;\n  margin-bottom: 1rem;\n}\n@keyframes _ngcontent-%COMP%_fadeIn {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n@keyframes _ngcontent-%COMP%_slideIn {\n  from {\n    transform: translateX(100%);\n  }\n  to {\n    transform: translateX(0);\n  }\n}\n@keyframes _ngcontent-%COMP%_spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n@media screen and (max-width: 1024px) {\n  .header-section[_ngcontent-%COMP%] {\n    flex-direction: column;\n    align-items: stretch;\n    gap: 1rem;\n  }\n  .filters-wrapper[_ngcontent-%COMP%] {\n    width: 100%;\n    justify-content: space-between;\n  }\n  .search-filters[_ngcontent-%COMP%] {\n    flex: 1;\n  }\n  .search-input[_ngcontent-%COMP%] {\n    min-width: 200px;\n  }\n}\n@media screen and (max-width: 768px) {\n  .container[_ngcontent-%COMP%] {\n    padding: 1rem;\n  }\n  .main-title[_ngcontent-%COMP%] {\n    font-size: 1.5rem;\n  }\n  .filters-wrapper[_ngcontent-%COMP%] {\n    flex-direction: column;\n    gap: 1rem;\n  }\n  .search-filters[_ngcontent-%COMP%] {\n    width: 100%;\n    flex-direction: column;\n  }\n  .search-input[_ngcontent-%COMP%], \n   .tramo-select[_ngcontent-%COMP%] {\n    width: 100%;\n  }\n  .action-buttons[_ngcontent-%COMP%] {\n    width: 100%;\n    justify-content: stretch;\n  }\n  .clear-filters-btn[_ngcontent-%COMP%], \n   .create-tenor-btn[_ngcontent-%COMP%] {\n    flex: 1;\n  }\n  .tenor-content[_ngcontent-%COMP%] {\n    flex-direction: column;\n  }\n  .tenor-tags[_ngcontent-%COMP%] {\n    max-width: 100%;\n  }\n  .preview-sheet[_ngcontent-%COMP%] {\n    width: 100%;\n  }\n}\n@media screen and (max-width: 480px) {\n  .tenor-header[_ngcontent-%COMP%] {\n    flex-direction: column;\n    align-items: stretch;\n  }\n  .tenor-actions[_ngcontent-%COMP%] {\n    justify-content: flex-start;\n  }\n  .chips-wrapper[_ngcontent-%COMP%] {\n    padding: 0.75rem;\n  }\n  .filter-chip[_ngcontent-%COMP%] {\n    padding: 0.4rem 0.8rem;\n    font-size: 0.85rem;\n  }\n}\n.dark[_nghost-%COMP%]   .container[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .container[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #0f172a 0%,\n      #1e293b 100%);\n  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);\n}\n.dark[_nghost-%COMP%]   .header-section[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .header-section[_ngcontent-%COMP%] {\n  border-bottom-color: #334155;\n}\n.dark[_nghost-%COMP%]   .search-input[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .search-input[_ngcontent-%COMP%], \n.dark[_nghost-%COMP%]   .tramo-select[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .tramo-select[_ngcontent-%COMP%] {\n  background: #1e293b;\n  border-color: #334155;\n  color: #f8fafc;\n}\n.dark[_nghost-%COMP%]   .search-input[_ngcontent-%COMP%]:focus, .dark   [_nghost-%COMP%]   .search-input[_ngcontent-%COMP%]:focus, \n.dark[_nghost-%COMP%]   .tramo-select[_ngcontent-%COMP%]:focus, .dark   [_nghost-%COMP%]   .tramo-select[_ngcontent-%COMP%]:focus {\n  border-color: #3b82f6;\n  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);\n}\n.dark[_nghost-%COMP%]   .clear-filters-btn[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .clear-filters-btn[_ngcontent-%COMP%] {\n  color: #94a3b8;\n  border-color: #334155;\n}\n.dark[_nghost-%COMP%]   .clear-filters-btn[_ngcontent-%COMP%]:hover, .dark   [_nghost-%COMP%]   .clear-filters-btn[_ngcontent-%COMP%]:hover {\n  background: #1e293b;\n  border-color: #475569;\n}\n.dark[_nghost-%COMP%]   .chips-wrapper[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .chips-wrapper[_ngcontent-%COMP%] {\n  background: #1e293b;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);\n}\n.dark[_nghost-%COMP%]   .filter-chip[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .filter-chip[_ngcontent-%COMP%] {\n  border-color: #334155;\n  background: #0f172a;\n  color: #94a3b8;\n}\n.dark[_nghost-%COMP%]   .filter-chip[_ngcontent-%COMP%]:hover, .dark   [_nghost-%COMP%]   .filter-chip[_ngcontent-%COMP%]:hover {\n  background: #1e293b;\n  border-color: #475569;\n}\n.dark[_nghost-%COMP%]   .filter-chip.active[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .filter-chip.active[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #3b82f6,\n      #2563eb);\n  color: white;\n  border-color: transparent;\n}\n.dark[_nghost-%COMP%]   .tenors-wrapper[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .tenors-wrapper[_ngcontent-%COMP%] {\n  background: #1e293b;\n  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);\n}\n.dark[_nghost-%COMP%]   .tenor-row[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .tenor-row[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #1e293b 0%,\n      #0f172a 100%);\n  border-bottom-color: #334155;\n}\n.dark[_nghost-%COMP%]   .tenor-row[_ngcontent-%COMP%]:hover, .dark   [_nghost-%COMP%]   .tenor-row[_ngcontent-%COMP%]:hover {\n  background:\n    linear-gradient(\n      135deg,\n      #0f172a 0%,\n      #1e293b 100%);\n}\n.dark[_nghost-%COMP%]   .tenor-label[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .tenor-label[_ngcontent-%COMP%] {\n  color: #f8fafc;\n  background:\n    linear-gradient(\n      135deg,\n      #1e293b,\n      #334155);\n  border-color: #475569;\n}\n.dark[_nghost-%COMP%]   .preview-btn[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .preview-btn[_ngcontent-%COMP%], \n.dark[_nghost-%COMP%]   .edit-btn[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .edit-btn[_ngcontent-%COMP%] {\n  color: #94a3b8;\n  border-color: #334155;\n}\n.dark[_nghost-%COMP%]   .preview-btn[_ngcontent-%COMP%]:hover, .dark   [_nghost-%COMP%]   .preview-btn[_ngcontent-%COMP%]:hover {\n  background: #293c4e;\n  color: white;\n}\n.dark[_nghost-%COMP%]   .edit-btn[_ngcontent-%COMP%]:hover, .dark   [_nghost-%COMP%]   .edit-btn[_ngcontent-%COMP%]:hover {\n  background: #345187;\n  color: white;\n}\n.dark[_nghost-%COMP%]   .sms-text[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .sms-text[_ngcontent-%COMP%] {\n  color: #cbd5e1;\n  background: #0f172a;\n  border-left-color: #475569;\n}\n.dark[_nghost-%COMP%]   .sms-text.no-text[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .sms-text.no-text[_ngcontent-%COMP%] {\n  color: #64748b;\n}\n.dark[_nghost-%COMP%]   .tag[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .tag[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #1e3a8a,\n      #172554);\n  color: #93c5fd;\n  border-color: #1d4ed8;\n}\n.dark[_nghost-%COMP%]   .empty-state[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .empty-state[_ngcontent-%COMP%] {\n  color: #94a3b8;\n  background:\n    linear-gradient(\n      135deg,\n      #0f172a 0%,\n      #1e293b 100%);\n  border-color: #334155;\n}\n.dark[_nghost-%COMP%]   .empty-state[_ngcontent-%COMP%]   .material-icons[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .empty-state[_ngcontent-%COMP%]   .material-icons[_ngcontent-%COMP%] {\n  color: #64748b;\n}\n.dark[_nghost-%COMP%]   .sheet-backdrop[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .sheet-backdrop[_ngcontent-%COMP%] {\n  background: rgba(0, 0, 0, 0.6);\n}\n.dark[_nghost-%COMP%]   .preview-sheet[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .preview-sheet[_ngcontent-%COMP%] {\n  background: #0f172a;\n  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.4);\n}\n.dark[_nghost-%COMP%]   .sheet-header[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .sheet-header[_ngcontent-%COMP%] {\n  border-bottom-color: #334155;\n  background:\n    linear-gradient(\n      135deg,\n      #1e293b 0%,\n      #0f172a 100%);\n}\n.dark[_nghost-%COMP%]   .sheet-title[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .sheet-title[_ngcontent-%COMP%] {\n  color: #f8fafc;\n}\n.dark[_nghost-%COMP%]   .close-btn[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .close-btn[_ngcontent-%COMP%] {\n  border-color: #334155;\n  color: #94a3b8;\n}\n.dark[_nghost-%COMP%]   .close-btn[_ngcontent-%COMP%]:hover, .dark   [_nghost-%COMP%]   .close-btn[_ngcontent-%COMP%]:hover {\n  background: #1e293b;\n  border-color: #475569;\n}\n.dark[_nghost-%COMP%]   .data-row[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .data-row[_ngcontent-%COMP%] {\n  background: #1e293b;\n}\n.dark[_nghost-%COMP%]   .data-key[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .data-key[_ngcontent-%COMP%] {\n  color: #94a3b8;\n}\n.dark[_nghost-%COMP%]   .data-value[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .data-value[_ngcontent-%COMP%] {\n  color: #f8fafc;\n}\n.dark[_nghost-%COMP%]   .sms-section[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .sms-section[_ngcontent-%COMP%] {\n  border-top-color: #334155;\n}\n.dark[_nghost-%COMP%]   .sms-label[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .sms-label[_ngcontent-%COMP%] {\n  color: #94a3b8;\n}\n.dark[_nghost-%COMP%]   .sms-counter[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .sms-counter[_ngcontent-%COMP%] {\n  color: #64748b;\n}\n.dark[_nghost-%COMP%]   .sheet-footer[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .sheet-footer[_ngcontent-%COMP%] {\n  border-top-color: #334155;\n  background: #1e293b;\n}\n.dark[_nghost-%COMP%]   .export-btn[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .export-btn[_ngcontent-%COMP%] {\n  border-color: #3b82f6;\n  color: #3b82f6;\n}\n.dark[_nghost-%COMP%]   .export-btn[_ngcontent-%COMP%]:hover, .dark   [_nghost-%COMP%]   .export-btn[_ngcontent-%COMP%]:hover {\n  background: #3b82f6;\n  color: white;\n}\n.dark[_nghost-%COMP%]   .sheet-loading[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .sheet-loading[_ngcontent-%COMP%], \n.dark[_nghost-%COMP%]   .sheet-empty[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .sheet-empty[_ngcontent-%COMP%] {\n  color: #94a3b8;\n}\n.dark[_nghost-%COMP%]   .loading-spinner[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .loading-spinner[_ngcontent-%COMP%] {\n  border-color: #334155;\n  border-top-color: #3b82f6;\n}\n/*# sourceMappingURL=combo-list-page.component.css.map */'] });
var ComboListPageComponent = _ComboListPageComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ComboListPageComponent, [{
    type: Component,
    args: [{ selector: "app-combo-list-page", standalone: true, imports: [
      CommonModule,
      ReactiveFormsModule,
      MatTableModule,
      MatButtonModule,
      MatIconModule,
      MatDialogModule
    ], template: `<div class="container">\r
  <!-- Header con filtros -->\r
  <div class="header-section">\r
    <h2 class="main-title">Gesti\xF3n de Tenores</h2>\r
    <div class="filters-wrapper">\r
      <div class="search-filters">\r
        <input type="text"\r
               class="search-input"\r
               placeholder="Buscar por nombre o tenor..."\r
               [formControl]="form.controls.q">\r
\r
        <select class="tramo-select" [formControl]="form.controls.tramo">\r
          <option value="ALL">Todos los tramos</option>\r
          <option value="3">Tramo 3</option>\r
          <option value="5">Tramo 5</option>\r
        </select>\r
      </div>\r
\r
      <div class="action-buttons">\r
        <button mat-button\r
                type="button"\r
                class="clear-filters-btn"\r
                (click)="clearChips()">\r
          <span class="material-icons">clear_all</span>\r
          Limpiar\r
        </button>\r
        <button mat-button\r
                type="button"\r
                class="create-tenor-btn"\r
                (click)="New()">\r
          <span class="material-icons">add</span>\r
          Crear\r
        </button>\r
      </div>\r
    </div>\r
  </div>\r
\r
  <!-- Chips de filtros -->\r
  <div class="chips-wrapper">\r
    <button\r
      *ngFor="let c of chips"\r
      type="button"\r
      class="filter-chip"\r
      [class.active]="isSelected(c.key)"\r
      (click)="toggleChip(c.key)"\r
      [attr.aria-pressed]="isSelected(c.key)">\r
      {{ c.label }}\r
    </button>\r
  </div>\r
\r
  <!-- Lista de tenores en filas -->\r
  <div class="tenors-wrapper" *ngIf="filtered().length; else noData">\r
    <div class="tenors-list">\r
      <div class="tenor-row" *ngFor="let r of filtered(); trackBy: trackById">\r
        <div class="tenor-header">\r
          <span class="tenor-label">{{ r.name || '(Sin nombre)' }}</span>\r
          <div class="tenor-actions">\r
            <button mat-button\r
                    class="preview-btn"\r
                    (click)="preview(r)">\r
              <span class="material-icons">visibility</span>\r
              Preview\r
            </button>\r
            <button mat-button\r
                    class="edit-btn"\r
                    (click)="openEdit(r)">\r
              <span class="material-icons">edit</span>\r
              Editar\r
            </button>\r
          </div>\r
        </div>\r
\r
        <div class="tenor-content">\r
          <div class="tenor-text">\r
            <p class="sms-text" *ngIf="r.plantillaTexto as t; else noSms">\r
              {{ t }}\r
            </p>\r
            <ng-template #noSms>\r
              <p class="sms-text no-text">(sin texto de SMS)</p>\r
            </ng-template>\r
          </div>\r
\r
          <div class="tenor-tags">\r
            <span class="tag" *ngFor="let s of visibleTags(r)">\r
                {{ s === 'SALDO_MORA' ? 'MORA' : (s === 'LTD_LTDE' ? 'LTD y LTDE' : s) }}\r
            </span>\r
          </div>\r
        </div>\r
      </div>\r
    </div>\r
  </div>\r
\r
  <!-- Estado vac\xEDo -->\r
  <ng-template #noData>\r
    <div class="empty-state">\r
      <i class="material-icons">inbox</i>\r
      <p>No hay tenores disponibles</p>\r
      <p class="empty-subtitle">Crea un nuevo tenor o ajusta los filtros</p>\r
    </div>\r
  </ng-template>\r
</div>\r
\r
<!-- Side Sheet Preview -->\r
<div class="sheet-backdrop" *ngIf="previewOpen()" (click)="closePreview()"></div>\r
<aside class="preview-sheet" *ngIf="previewOpen()" (click)="$event.stopPropagation()">\r
  <header class="sheet-header">\r
    <h3 class="sheet-title">{{ previewTitle() }}</h3>\r
    <div class="sheet-spacer"></div>\r
    <button mat-button\r
            class="close-btn"\r
            (click)="closePreview()">\r
      <span class="material-icons">close</span>\r
      Cerrar\r
    </button>\r
  </header>\r
  <div class="sheet-body" *ngIf="!previewLoading(); else loadingTpl">\r
    <ng-container *ngIf="previewRow(); else emptyTpl">\r
      <!-- Key-Value Pairs -->\r
      <div class="data-grid">\r
        <div class="data-row" *ngFor="let p of previewPairs()">\r
          <div class="data-key">{{ p[0] }}</div>\r
          <div class="data-value">{{ p[1] }}</div>\r
        </div>\r
      </div>\r
      <!-- SMS Preview -->\r
      <section class="sms-section" *ngIf="previewSms() !== null">\r
        <label class="sms-label">Previsualizaci\xF3n del SMS</label>\r
        <div class="sms-bubble">{{ previewSms() }}</div>\r
        <small class="sms-counter" *ngIf="previewSms() as sms">\r
          {{ smsLen(sms).chars }}/160 caracteres\r
        </small>\r
      </section>\r
    </ng-container>\r
  </div>\r
  <footer class="sheet-footer">\r
    <div class="sheet-spacer"></div>\r
    <button mat-stroked-button\r
            class="export-btn"\r
            (click)="exportSelected()">\r
      <span class="material-icons">download</span>\r
      Exportar\r
    </button>\r
    <button mat-button\r
            color="warn"\r
            class="delete-btn"\r
            (click)="removeSelected()">\r
      <span class="material-icons">delete</span>\r
      Eliminar\r
    </button>\r
  </footer>\r
</aside>\r
<!-- Loading Template -->\r
<ng-template #loadingTpl>\r
  <div class="sheet-loading">\r
    <div class="loading-spinner"></div>\r
    <p>Cargando\u2026</p>\r
  </div>\r
</ng-template>\r
<!-- Empty Template -->\r
<ng-template #emptyTpl>\r
  <div class="sheet-empty">\r
    <span class="material-icons">info</span>\r
    <p>No se encontraron filas para este combo.</p>\r
  </div>\r
</ng-template>\r
`, styles: ['/* src/app/features/legacy/SMS_DYNAMIC/pages/combo-list-page/combo-list-page.component.css */\n.container {\n  background:\n    linear-gradient(\n      135deg,\n      #f8fafc 0%,\n      #f1f5f9 100%);\n  padding: 1.4rem;\n  border-radius: 16px;\n  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);\n  width: 100%;\n  max-width: 1400px;\n  margin: 0 auto;\n  min-height: 500px;\n  margin-top: 0;\n}\n.header-section {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 1.5rem;\n  padding-bottom: 1.2rem;\n  border-bottom: 2px solid #e2e8f0;\n  flex-wrap: wrap;\n  gap: 1rem;\n}\n.main-title {\n  color: #1e293b;\n  font-size: 1.75rem;\n  font-weight: 600;\n  margin: 0;\n  background:\n    linear-gradient(\n      135deg,\n      #3b82f6,\n      #2563eb);\n  -webkit-background-clip: text;\n  -webkit-text-fill-color: transparent;\n  background-clip: text;\n}\n.filters-wrapper {\n  display: flex;\n  gap: 1rem;\n  align-items: center;\n  flex-wrap: wrap;\n}\n.search-filters {\n  display: flex;\n  gap: 0.75rem;\n  align-items: center;\n}\n.search-input {\n  padding: 0.75rem 1rem;\n  border: 1px solid #d1d5db;\n  border-radius: 8px;\n  font-size: 0.95rem;\n  transition: all 0.2s ease;\n  background: white;\n  min-width: 250px;\n}\n.search-input:focus {\n  outline: none;\n  border-color: #3b82f6;\n  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);\n}\n.tramo-select {\n  padding: 0.75rem 1rem;\n  border: 1px solid #d1d5db;\n  border-radius: 8px;\n  font-size: 0.95rem;\n  transition: all 0.2s ease;\n  background: white;\n  min-width: 150px;\n  cursor: pointer;\n}\n.tramo-select:focus {\n  outline: none;\n  border-color: #3b82f6;\n  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);\n}\n.action-buttons {\n  display: flex;\n  gap: 0.75rem;\n  align-items: center;\n}\n.clear-filters-btn,\n.create-tenor-btn {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  padding: 0.75rem 1.5rem;\n  border-radius: 8px;\n  font-weight: 500;\n  transition: all 0.2s ease;\n  border: none;\n  cursor: pointer;\n}\n.clear-filters-btn {\n  background: transparent;\n  color: #64748b;\n  border: 2px solid #e2e8f0;\n}\n.clear-filters-btn:hover {\n  background: #f8fafc;\n  border-color: #cbd5e1;\n}\n.create-tenor-btn {\n  background:\n    linear-gradient(\n      135deg,\n      #3b82f6,\n      #2563eb);\n  color: white !important;\n}\n.create-tenor-btn .material-icons {\n  color: white !important;\n}\n.create-tenor-btn:hover {\n  background:\n    linear-gradient(\n      135deg,\n      #2563eb,\n      #1d4ed8);\n  transform: translateY(-1px);\n  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);\n}\n.chips-wrapper {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.75rem;\n  margin-bottom: 1.5rem;\n  padding: 1rem;\n  background: white;\n  border-radius: 12px;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);\n}\n.filter-chip {\n  padding: 0.5rem 1rem;\n  border: 2px solid #e2e8f0;\n  border-radius: 20px;\n  background: white;\n  color: #64748b;\n  font-size: 0.9rem;\n  font-weight: 500;\n  cursor: pointer;\n  transition: all 0.2s ease;\n}\n.filter-chip:hover {\n  background: #f8fafc;\n  border-color: #cbd5e1;\n  transform: translateY(-1px);\n}\n.filter-chip.active {\n  background:\n    linear-gradient(\n      135deg,\n      #3b82f6,\n      #2563eb);\n  color: white;\n  border-color: transparent;\n}\n.tenors-wrapper {\n  background: white;\n  border-radius: 12px;\n  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);\n  overflow: hidden;\n}\n.tenors-list {\n  display: flex;\n  flex-direction: column;\n  gap: 0;\n}\n.tenor-row {\n  background:\n    linear-gradient(\n      135deg,\n      #ffffff 0%,\n      #f8fafc 100%);\n  border-bottom: 1px solid #e2e8f0;\n  padding: 1.2rem 1.5rem;\n  transition: all 0.3s ease;\n  position: relative;\n  overflow: hidden;\n}\n.tenor-row:last-child {\n  border-bottom: none;\n}\n.tenor-row::before {\n  content: "";\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  width: 3px;\n  background:\n    linear-gradient(\n      180deg,\n      #3b82f6,\n      #2563eb);\n  transform: scaleY(0);\n  transition: transform 0.3s ease;\n  transform-origin: top;\n}\n.tenor-row:hover {\n  background:\n    linear-gradient(\n      135deg,\n      #f8fafc 0%,\n      #f1f5f9 100%);\n  padding-left: 1.8rem;\n}\n.tenor-row:hover::before {\n  transform: scaleY(1);\n}\n.tenor-header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 0.75rem;\n  gap: 1rem;\n}\n.tenor-label {\n  font-weight: 600;\n  color: #1e293b;\n  font-size: 1.1rem;\n  padding: 0.4rem 0.8rem;\n  background:\n    linear-gradient(\n      135deg,\n      #f1f5f9,\n      #e2e8f0);\n  border-radius: 8px;\n  border: 1px solid #cbd5e1;\n}\n.tenor-actions {\n  display: flex;\n  gap: 0.5rem;\n  align-items: center;\n}\n.preview-btn {\n  display: flex;\n  align-items: center;\n  gap: 0.4rem;\n  padding: 0.5rem 1rem;\n  border-radius: 6px;\n  font-size: 0.9rem;\n  font-weight: 500;\n  transition: all 0.2s ease;\n  cursor: pointer;\n  color: #293c4e;\n  background: transparent;\n  border: 2px solid #e2e8f0;\n}\n.edit-btn {\n  display: flex;\n  align-items: center;\n  gap: 0.4rem;\n  padding: 0.5rem 1rem;\n  border-radius: 6px;\n  font-size: 0.9rem;\n  font-weight: 500;\n  transition: all 0.2s ease;\n  cursor: pointer;\n  color: #255d80;\n  background: transparent;\n  border: 2px solid #e2e8f0;\n}\n.preview-btn:hover {\n  background: #293c4e;\n  color: white;\n}\n.edit-btn:hover {\n  background: #345187;\n  color: white;\n}\n.preview-btn .material-icons,\n.edit-btn .material-icons {\n  font-size: 18px;\n}\n.tenor-content {\n  display: flex;\n  justify-content: space-between;\n  align-items: flex-start;\n  gap: 1rem;\n}\n.tenor-text {\n  flex: 1;\n  padding-right: 1rem;\n}\n.sms-text {\n  color: #475569;\n  font-size: 0.95rem;\n  line-height: 1.6;\n  margin: 0;\n  padding: 0.75rem;\n  background: #f8fafc;\n  border-radius: 8px;\n  border-left: 3px solid #cbd5e1;\n}\n.sms-text.no-text {\n  color: #9ca3af;\n  font-style: italic;\n}\n.tenor-tags {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.5rem;\n  align-items: center;\n  max-width: 300px;\n}\n.tag {\n  padding: 0.35rem 0.75rem;\n  background:\n    linear-gradient(\n      135deg,\n      #dbeafe,\n      #bfdbfe);\n  color: #1d4ed8;\n  border-radius: 6px;\n  font-size: 0.85rem;\n  font-weight: 500;\n  border: 1px solid #93c5fd;\n}\n.empty-state {\n  text-align: center;\n  padding: 3rem 2rem;\n  color: #6b7280;\n  background:\n    linear-gradient(\n      135deg,\n      #f8fafc 0%,\n      #f1f5f9 100%);\n  border: 2px dashed #d1d5db;\n  border-radius: 12px;\n  margin-top: 2rem;\n}\n.empty-state .material-icons {\n  font-size: 3rem;\n  color: #9ca3af;\n  margin-bottom: 1rem;\n  display: block;\n}\n.empty-state p {\n  margin: 0.5rem 0;\n  font-size: 1.1rem;\n  font-weight: 500;\n}\n.empty-subtitle {\n  color: #9ca3af !important;\n  font-size: 0.9rem !important;\n  font-weight: 400 !important;\n}\n.sheet-backdrop {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background: rgba(0, 0, 0, 0.4);\n  z-index: 999;\n  animation: fadeIn 0.2s ease;\n}\n.preview-sheet {\n  position: fixed;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  width: 480px;\n  background: white;\n  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.1);\n  z-index: 1000;\n  display: flex;\n  flex-direction: column;\n  animation: slideIn 0.3s ease;\n}\n.sheet-header {\n  padding: 1.5rem;\n  border-bottom: 1px solid #e2e8f0;\n  display: flex;\n  align-items: center;\n  background:\n    linear-gradient(\n      135deg,\n      #f8fafc 0%,\n      #f1f5f9 100%);\n}\n.sheet-title {\n  font-size: 1.25rem;\n  font-weight: 600;\n  color: #1e293b;\n  margin: 0;\n}\n.sheet-spacer {\n  flex: 1;\n}\n.close-btn {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  padding: 0.5rem 1rem;\n  border-radius: 6px;\n  background: transparent;\n  border: 1px solid #e2e8f0;\n  color: #64748b;\n  cursor: pointer;\n  transition: all 0.2s ease;\n}\n.close-btn:hover {\n  background: #f8fafc;\n  border-color: #cbd5e1;\n}\n.sheet-body {\n  flex: 1;\n  overflow-y: auto;\n  padding: 1.5rem;\n}\n.data-grid {\n  display: flex;\n  flex-direction: column;\n  gap: 0.75rem;\n  margin-bottom: 1.5rem;\n}\n.data-row {\n  display: grid;\n  grid-template-columns: 140px 1fr;\n  gap: 1rem;\n  padding: 0.75rem;\n  background: #f8fafc;\n  border-radius: 6px;\n}\n.data-key {\n  font-weight: 600;\n  color: #475569;\n  font-size: 0.9rem;\n}\n.data-value {\n  color: #1e293b;\n  font-size: 0.9rem;\n}\n.sms-section {\n  margin-top: 1.5rem;\n  padding-top: 1.5rem;\n  border-top: 1px solid #e2e8f0;\n}\n.sms-label {\n  display: block;\n  font-weight: 600;\n  color: #475569;\n  font-size: 0.95rem;\n  margin-bottom: 0.75rem;\n}\n.sms-bubble {\n  background:\n    linear-gradient(\n      135deg,\n      #3b82f6,\n      #2563eb);\n  color: white;\n  padding: 1rem;\n  border-radius: 12px;\n  font-size: 0.95rem;\n  line-height: 1.5;\n  position: relative;\n  margin-bottom: 0.5rem;\n}\n.sms-counter {\n  color: #64748b;\n  font-size: 0.85rem;\n}\n.sheet-footer {\n  padding: 1.5rem;\n  border-top: 1px solid #e2e8f0;\n  display: flex;\n  gap: 0.75rem;\n  background: #f8fafc;\n}\n.export-btn,\n.delete-btn {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  padding: 0.75rem 1.5rem;\n  border-radius: 6px;\n  font-weight: 500;\n  cursor: pointer;\n  transition: all 0.2s ease;\n}\n.export-btn {\n  background: transparent;\n  border: 2px solid #3b82f6;\n  color: #3b82f6;\n}\n.export-btn:hover {\n  background: #3b82f6;\n  color: white;\n}\n.delete-btn {\n  background: #ef4444;\n  border: none;\n  color: white !important;\n}\n.delete-btn .material-icons {\n  color: white;\n}\n.delete-btn:hover {\n  background: white;\n  border: 2px solid #dc2626;\n  color: #dc2626 !important;\n}\n.delete-btn:hover .material-icons {\n  color: #dc2626;\n}\n.sheet-loading,\n.sheet-empty {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  padding: 3rem;\n  color: #64748b;\n}\n.loading-spinner {\n  width: 40px;\n  height: 40px;\n  border: 3px solid #e2e8f0;\n  border-top-color: #3b82f6;\n  border-radius: 50%;\n  animation: spin 1s linear infinite;\n  margin-bottom: 1rem;\n}\n@keyframes fadeIn {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n@keyframes slideIn {\n  from {\n    transform: translateX(100%);\n  }\n  to {\n    transform: translateX(0);\n  }\n}\n@keyframes spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n@media screen and (max-width: 1024px) {\n  .header-section {\n    flex-direction: column;\n    align-items: stretch;\n    gap: 1rem;\n  }\n  .filters-wrapper {\n    width: 100%;\n    justify-content: space-between;\n  }\n  .search-filters {\n    flex: 1;\n  }\n  .search-input {\n    min-width: 200px;\n  }\n}\n@media screen and (max-width: 768px) {\n  .container {\n    padding: 1rem;\n  }\n  .main-title {\n    font-size: 1.5rem;\n  }\n  .filters-wrapper {\n    flex-direction: column;\n    gap: 1rem;\n  }\n  .search-filters {\n    width: 100%;\n    flex-direction: column;\n  }\n  .search-input,\n  .tramo-select {\n    width: 100%;\n  }\n  .action-buttons {\n    width: 100%;\n    justify-content: stretch;\n  }\n  .clear-filters-btn,\n  .create-tenor-btn {\n    flex: 1;\n  }\n  .tenor-content {\n    flex-direction: column;\n  }\n  .tenor-tags {\n    max-width: 100%;\n  }\n  .preview-sheet {\n    width: 100%;\n  }\n}\n@media screen and (max-width: 480px) {\n  .tenor-header {\n    flex-direction: column;\n    align-items: stretch;\n  }\n  .tenor-actions {\n    justify-content: flex-start;\n  }\n  .chips-wrapper {\n    padding: 0.75rem;\n  }\n  .filter-chip {\n    padding: 0.4rem 0.8rem;\n    font-size: 0.85rem;\n  }\n}\n:host-context(.dark) .container {\n  background:\n    linear-gradient(\n      135deg,\n      #0f172a 0%,\n      #1e293b 100%);\n  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);\n}\n:host-context(.dark) .header-section {\n  border-bottom-color: #334155;\n}\n:host-context(.dark) .search-input,\n:host-context(.dark) .tramo-select {\n  background: #1e293b;\n  border-color: #334155;\n  color: #f8fafc;\n}\n:host-context(.dark) .search-input:focus,\n:host-context(.dark) .tramo-select:focus {\n  border-color: #3b82f6;\n  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);\n}\n:host-context(.dark) .clear-filters-btn {\n  color: #94a3b8;\n  border-color: #334155;\n}\n:host-context(.dark) .clear-filters-btn:hover {\n  background: #1e293b;\n  border-color: #475569;\n}\n:host-context(.dark) .chips-wrapper {\n  background: #1e293b;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);\n}\n:host-context(.dark) .filter-chip {\n  border-color: #334155;\n  background: #0f172a;\n  color: #94a3b8;\n}\n:host-context(.dark) .filter-chip:hover {\n  background: #1e293b;\n  border-color: #475569;\n}\n:host-context(.dark) .filter-chip.active {\n  background:\n    linear-gradient(\n      135deg,\n      #3b82f6,\n      #2563eb);\n  color: white;\n  border-color: transparent;\n}\n:host-context(.dark) .tenors-wrapper {\n  background: #1e293b;\n  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);\n}\n:host-context(.dark) .tenor-row {\n  background:\n    linear-gradient(\n      135deg,\n      #1e293b 0%,\n      #0f172a 100%);\n  border-bottom-color: #334155;\n}\n:host-context(.dark) .tenor-row:hover {\n  background:\n    linear-gradient(\n      135deg,\n      #0f172a 0%,\n      #1e293b 100%);\n}\n:host-context(.dark) .tenor-label {\n  color: #f8fafc;\n  background:\n    linear-gradient(\n      135deg,\n      #1e293b,\n      #334155);\n  border-color: #475569;\n}\n:host-context(.dark) .preview-btn,\n:host-context(.dark) .edit-btn {\n  color: #94a3b8;\n  border-color: #334155;\n}\n:host-context(.dark) .preview-btn:hover {\n  background: #293c4e;\n  color: white;\n}\n:host-context(.dark) .edit-btn:hover {\n  background: #345187;\n  color: white;\n}\n:host-context(.dark) .sms-text {\n  color: #cbd5e1;\n  background: #0f172a;\n  border-left-color: #475569;\n}\n:host-context(.dark) .sms-text.no-text {\n  color: #64748b;\n}\n:host-context(.dark) .tag {\n  background:\n    linear-gradient(\n      135deg,\n      #1e3a8a,\n      #172554);\n  color: #93c5fd;\n  border-color: #1d4ed8;\n}\n:host-context(.dark) .empty-state {\n  color: #94a3b8;\n  background:\n    linear-gradient(\n      135deg,\n      #0f172a 0%,\n      #1e293b 100%);\n  border-color: #334155;\n}\n:host-context(.dark) .empty-state .material-icons {\n  color: #64748b;\n}\n:host-context(.dark) .sheet-backdrop {\n  background: rgba(0, 0, 0, 0.6);\n}\n:host-context(.dark) .preview-sheet {\n  background: #0f172a;\n  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.4);\n}\n:host-context(.dark) .sheet-header {\n  border-bottom-color: #334155;\n  background:\n    linear-gradient(\n      135deg,\n      #1e293b 0%,\n      #0f172a 100%);\n}\n:host-context(.dark) .sheet-title {\n  color: #f8fafc;\n}\n:host-context(.dark) .close-btn {\n  border-color: #334155;\n  color: #94a3b8;\n}\n:host-context(.dark) .close-btn:hover {\n  background: #1e293b;\n  border-color: #475569;\n}\n:host-context(.dark) .data-row {\n  background: #1e293b;\n}\n:host-context(.dark) .data-key {\n  color: #94a3b8;\n}\n:host-context(.dark) .data-value {\n  color: #f8fafc;\n}\n:host-context(.dark) .sms-section {\n  border-top-color: #334155;\n}\n:host-context(.dark) .sms-label {\n  color: #94a3b8;\n}\n:host-context(.dark) .sms-counter {\n  color: #64748b;\n}\n:host-context(.dark) .sheet-footer {\n  border-top-color: #334155;\n  background: #1e293b;\n}\n:host-context(.dark) .export-btn {\n  border-color: #3b82f6;\n  color: #3b82f6;\n}\n:host-context(.dark) .export-btn:hover {\n  background: #3b82f6;\n  color: white;\n}\n:host-context(.dark) .sheet-loading,\n:host-context(.dark) .sheet-empty {\n  color: #94a3b8;\n}\n:host-context(.dark) .loading-spinner {\n  border-color: #334155;\n  border-top-color: #3b82f6;\n}\n/*# sourceMappingURL=combo-list-page.component.css.map */\n'] }]
  }], () => [{ type: MatBottomSheet }, { type: MatDialog }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ComboListPageComponent, { className: "ComboListPageComponent", filePath: "src/app/features/legacy/sms_dynamic/pages/combo-list-page/combo-list-page.component.ts", lineNumber: 55 });
})();
export {
  ComboListPageComponent
};
//# sourceMappingURL=chunk-XF5O7UJT.js.map
