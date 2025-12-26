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
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef
} from "./chunk-HBS4YI6H.js";
import "./chunk-CRNFYKBD.js";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableModule
} from "./chunk-L5DRRBK6.js";
import "./chunk-524SGLBK.js";
import "./chunk-2GCPRO7O.js";
import "./chunk-XG3JRR2G.js";
import "./chunk-MAXKR5SL.js";
import {
  MatButton,
  MatButtonModule
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
import {
  environment
} from "./chunk-QF774CZR.js";
import {
  CommonModule,
  Component,
  HttpClient,
  Inject,
  Injectable,
  NgClass,
  NgForOf,
  NgIf,
  NgSwitch,
  NgSwitchCase,
  ViewChild,
  __spreadProps,
  __spreadValues,
  computed,
  debounceTime,
  distinctUntilChanged,
  finalize,
  inject,
  map,
  setClassMetadata,
  signal,
  startWith,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassProp,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementContainerEnd,
  ɵɵelementContainerStart,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵqueryRefresh,
  ɵɵreference,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵviewQuery
} from "./chunk-CTRHJBBW.js";

// src/app/features/legacy/SMS_DYNAMIC/services/dyn-query.service.ts
var _DynQueryService = class _DynQueryService {
  constructor() {
    this.http = inject(HttpClient);
    this.root = `${environment.webServiceUrl}/plantillas/sms`;
    this.dynamicQueryUrl = `${this.root}/dynamic-query`;
    this.exportUrl = `${this.root}/export`;
    this.precheckUrl = `${this.root}/precheck`;
    this.previewInitUrl = `${this.root}/preview/init`;
    this.previewChooseUrl = `${this.root}/preview/choose`;
    this.previewSkipUrl = `${this.root}/preview/skip`;
    this.previewDlUrl = `${this.root}/preview/download`;
  }
  /** Ejecuta la consulta dinámica (para tabla/preview en la misma página) */
  run(body) {
    return this.http.post(this.dynamicQueryUrl, body);
  }
  /** Precheck de 160 caracteres (el backend espera { query, template }) */
  precheck(body, template) {
    return this.http.post(this.precheckUrl, { query: body, template });
  }
  // ✅ no fuerces limit:null; no envíes plantillaTexto
  export(body, template) {
    const payload = __spreadValues({}, body);
    if (payload.limit == null)
      delete payload.limit;
    payload.selectAll = false;
    payload.template = template;
    return this.http.post(this.exportUrl, payload, { responseType: "blob" });
  }
  // ======== PREVIEW (GUIADO) ========
  previewInit(query, template, candidatas) {
    const payload = { query: __spreadProps(__spreadValues({}, query), { template }), candidatas };
    return this.http.post(this.previewInitUrl, payload);
  }
  previewChoose(sessionId, variableElegida) {
    return this.http.post(this.previewChooseUrl, { sessionId, variableElegida });
  }
  previewSkip(sessionId) {
    return this.http.post(this.previewSkipUrl, { sessionId });
  }
  previewDownload(sessionId) {
    return this.http.post(this.previewDlUrl, { sessionId }, { responseType: "blob" });
  }
  previewDownloadBase(sessionId) {
    return this.http.get(`${this.root}/preview/${sessionId}/download-base`, {
      responseType: "blob"
    });
  }
};
_DynQueryService.\u0275fac = function DynQueryService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _DynQueryService)();
};
_DynQueryService.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _DynQueryService, factory: _DynQueryService.\u0275fac, providedIn: "root" });
var DynQueryService = _DynQueryService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DynQueryService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

// src/app/features/legacy/SMS_DYNAMIC/Common/round-wizard-dialog.component.ts
var _c0 = () => [];
function RoundWizardDialogComponent_ng_container_27_button_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 19);
    \u0275\u0275listener("click", function RoundWizardDialogComponent_ng_container_27_button_2_Template_button_click_0_listener() {
      const c_r3 = \u0275\u0275restoreView(_r2).$implicit;
      const ctx_r3 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r3.choose(c_r3.variable));
    });
    \u0275\u0275elementStart(1, "span", 20);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 21);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const c_r3 = ctx.$implicit;
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r3.pretty(c_r3.variable));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", c_r3.filasQueResuelve, " casos");
  }
}
function RoundWizardDialogComponent_ng_container_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275elementStart(1, "div", 17);
    \u0275\u0275template(2, RoundWizardDialogComponent_ng_container_27_button_2_Template, 5, 2, "button", 18);
    \u0275\u0275elementEnd();
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275property("ngForOf", ctx_r3.state().candidatas);
  }
}
function RoundWizardDialogComponent_ng_template_28_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 22);
    \u0275\u0275text(1, "No existen casos para resolver.");
    \u0275\u0275elementEnd();
  }
}
function RoundWizardDialogComponent_div_34_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 23)(1, "div", 24)(2, "div", 25);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 26);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 27)(7, "span");
    \u0275\u0275text(8, "Usada: ");
    \u0275\u0275elementStart(9, "b");
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "span");
    \u0275\u0275text(12, "Valor: ");
    \u0275\u0275elementStart(13, "b");
    \u0275\u0275text(14);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(15, "div", 28);
    \u0275\u0275text(16);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const p_r5 = ctx.$implicit;
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(p_r5.documento || "(sin doc.)");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(p_r5.nombre);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r3.pretty(p_r5.variableUsada) || "\u2014");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(p_r5.valorUsado ?? "\u2014");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(p_r5.sms);
  }
}
var _RoundWizardDialogComponent = class _RoundWizardDialogComponent {
  pretty(v) {
    const key = (v ?? "").toUpperCase();
    if (!key)
      return "";
    if (this.prettyMap[key])
      return this.prettyMap[key];
    return key.replace(/_/g, " ").toLowerCase().replace(new RegExp("\\b\\p{L}", "gu"), (m) => m.toUpperCase());
  }
  constructor(data) {
    this.data = data;
    this.dialogRef = inject(MatDialogRef);
    this.api = inject(DynQueryService);
    this.prettyMap = {
      // Siglas que deben quedar en mayúsculas
      "LTD": "LTD",
      "LTDE": "LTDE",
      "PKM": "PKM",
      // Finanzas legibles
      "SALDO_MORA": "Saldo Mora",
      "BAJA30": "Baja 30",
      "BAJA30_SALDOMORA": "Baja 30 + Mora",
      "CAPITAL": "Capital",
      "DEUDA_TOTAL": "Deuda Total",
      // Otros (por si aparecen en preview)
      "NOMBRECOMPLETO": "Nombre completo",
      "NUMCUENTAPMCP": "N\xB0 de Cuenta",
      "DIASMORA": "D\xEDas mora",
      "LTD_LTDE": "LTD + LTDE"
    };
    this.state = signal(this.data.init, ...ngDevMode ? [{ debugName: "state" }] : []);
    this.loading = signal(false, ...ngDevMode ? [{ debugName: "loading" }] : []);
  }
  choose(variable) {
    this.loading.set(true);
    this.api.previewChoose(this.data.sessionId, variable).subscribe({
      next: (res) => {
        this.state.set(res);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
  skip() {
    this.loading.set(true);
    this.api.previewDownloadBase(this.data.sessionId).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `sms_report_${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.xlsx`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        this.loading.set(false);
        this.dialogRef.close(true);
      },
      error: () => this.loading.set(false)
    });
  }
  download() {
    this.loading.set(true);
    this.api.previewDownload(this.data.sessionId).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `sms_report_${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.xlsx`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        this.loading.set(false);
        this.dialogRef.close(true);
      },
      error: () => this.loading.set(false)
    });
  }
  close() {
    this.dialogRef.close(false);
  }
};
_RoundWizardDialogComponent.\u0275fac = function RoundWizardDialogComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _RoundWizardDialogComponent)(\u0275\u0275directiveInject(MAT_DIALOG_DATA));
};
_RoundWizardDialogComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _RoundWizardDialogComponent, selectors: [["app-round-wizard-dialog"]], decls: 41, vars: 9, consts: [["noCand", ""], [1, "dlg"], [1, "dlg__head"], [1, "dlg__body"], [1, "group-card"], [1, "group-title"], [1, "stats"], [1, "stat"], [1, "ok"], [1, "warn"], [4, "ngIf", "ngIfElse"], [1, "preview-list"], ["class", "pv-item", 4, "ngFor", "ngForOf"], [1, "dlg__foot"], ["mat-button", "", "type", "button", 3, "click", "disabled"], [1, "spacer"], ["mat-raised-button", "", "type", "button", 2, "color", "white", "background", "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)", 3, "click", "disabled"], [1, "chip-container"], ["type", "button", "class", "chip", 3, "click", 4, "ngFor", "ngForOf"], ["type", "button", 1, "chip", 3, "click"], [1, "chip__var"], [1, "chip__count"], [1, "muted"], [1, "pv-item"], [1, "pv-left"], [1, "pv-doc"], [1, "pv-nom", "muted"], [1, "pv-meta"], [1, "pv-sms", "preview-box"]], template: function RoundWizardDialogComponent_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 1)(1, "header", 2)(2, "h2");
    \u0275\u0275text(3, "\xBFCompletar con otro importe?");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "section", 3)(5, "div", 4)(6, "div", 5);
    \u0275\u0275text(7, "Progreso");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "div", 6)(9, "div", 7)(10, "span");
    \u0275\u0275text(11, "Total");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "b");
    \u0275\u0275text(13);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "div", 7)(15, "span");
    \u0275\u0275text(16, "Resueltas");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "b", 8);
    \u0275\u0275text(18);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(19, "div", 7)(20, "span");
    \u0275\u0275text(21, "Pendientes");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "b", 9);
    \u0275\u0275text(23);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(24, "div", 4)(25, "div", 5);
    \u0275\u0275text(26, "Opciones");
    \u0275\u0275elementEnd();
    \u0275\u0275template(27, RoundWizardDialogComponent_ng_container_27_Template, 3, 1, "ng-container", 10)(28, RoundWizardDialogComponent_ng_template_28_Template, 2, 0, "ng-template", null, 0, \u0275\u0275templateRefExtractor);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(30, "div", 4)(31, "div", 5);
    \u0275\u0275text(32, "Previsualizaci\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "div", 11);
    \u0275\u0275template(34, RoundWizardDialogComponent_div_34_Template, 17, 5, "div", 12);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(35, "footer", 13)(36, "button", 14);
    \u0275\u0275listener("click", function RoundWizardDialogComponent_Template_button_click_36_listener() {
      \u0275\u0275restoreView(_r1);
      return \u0275\u0275resetView(ctx.skip());
    });
    \u0275\u0275text(37, "Omitir");
    \u0275\u0275elementEnd();
    \u0275\u0275element(38, "span", 15);
    \u0275\u0275elementStart(39, "button", 16);
    \u0275\u0275listener("click", function RoundWizardDialogComponent_Template_button_click_39_listener() {
      \u0275\u0275restoreView(_r1);
      return \u0275\u0275resetView(ctx.download());
    });
    \u0275\u0275text(40, " Generar ");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    let tmp_4_0;
    const noCand_r6 = \u0275\u0275reference(29);
    \u0275\u0275advance(13);
    \u0275\u0275textInterpolate(ctx.state().total);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx.state().resueltas);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx.state().pendientes);
    \u0275\u0275advance(4);
    \u0275\u0275property("ngIf", (tmp_4_0 = ctx.state().candidatas) == null ? null : tmp_4_0.length)("ngIfElse", noCand_r6);
    \u0275\u0275advance(7);
    \u0275\u0275property("ngForOf", ctx.state().muestraPreview || \u0275\u0275pureFunction0(8, _c0));
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx.loading());
    \u0275\u0275advance(3);
    \u0275\u0275property("disabled", ctx.loading());
  }
}, dependencies: [CommonModule, NgForOf, NgIf, MatButtonModule, MatButton], styles: ["\n\n.dlg[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: 100%;\n  display: flex;\n  flex-direction: column;\n  max-height: 80vh;\n}\n.dlg__head[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 22px;\n  padding: 14px 18px;\n  border-bottom: 1px solid #e5e7eb;\n  justify-content: center;\n}\n.dlg__head[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 1.2rem;\n  font-weight: 700;\n}\n.icon-btn[_ngcontent-%COMP%] {\n  border: none;\n  background: transparent;\n  font-size: 18px;\n  margin-left: auto;\n  cursor: pointer;\n}\n.dlg__body[_ngcontent-%COMP%] {\n  flex: 1 1 auto;\n  overflow: auto;\n}\n.dlg__foot[_ngcontent-%COMP%] {\n  padding: 12px 18px;\n  border-top: 1px solid #e5e7eb;\n  background: #fff;\n  box-shadow: 0 -6px 12px -10px rgba(0, 0, 0, .12);\n  display: flex;\n  align-items: center;\n  gap: 10px;\n}\n.spacer[_ngcontent-%COMP%] {\n  flex: 1;\n}\n.group-card[_ngcontent-%COMP%] {\n  border: 1px solid #e5e7eb;\n  background: #fff;\n  border-radius: 12px;\n  padding: 12px;\n  margin-top: 20px;\n  margin-left: 15px;\n  margin-right: 15px;\n}\n.group-title[_ngcontent-%COMP%] {\n  margin: 0 0 10px 0;\n  font-size: 14px;\n  font-weight: 600;\n  color: #374151;\n}\n.stats[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));\n  gap: 10px;\n}\n.stat[_ngcontent-%COMP%] {\n  border: 1px solid #e5e7eb;\n  border-radius: 10px;\n  padding: 10px 12px;\n  background: #fafafa;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n}\n.stat[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  color: #6b7280;\n  font-size: .9rem;\n}\n.stat[_ngcontent-%COMP%]   b[_ngcontent-%COMP%] {\n  font-size: 1rem;\n}\n.stat[_ngcontent-%COMP%]   b.ok[_ngcontent-%COMP%] {\n  color: #059669;\n}\n.stat[_ngcontent-%COMP%]   b.warn[_ngcontent-%COMP%] {\n  color: #b45309;\n}\n.chip-container[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 10px;\n  align-items: center;\n}\n.chip[_ngcontent-%COMP%] {\n  appearance: none;\n  border: 1px solid #dfe3ee;\n  background: #f8f9fc;\n  color: #111827;\n  border-radius: 999px;\n  padding: 8px 14px;\n  font-weight: 600;\n  line-height: 1.1;\n  cursor: pointer;\n  transition:\n    background .15s,\n    border-color .15s,\n    transform .04s;\n  box-shadow: 0 1px 0 rgba(0, 0, 0, .02);\n}\n.chip[_ngcontent-%COMP%]:hover {\n  background: #f8fafc;\n}\n.chip[_ngcontent-%COMP%]:active {\n  transform: translateY(1px);\n}\n.chip[_ngcontent-%COMP%]:focus-visible {\n  outline: 2px solid #6366f1;\n  outline-offset: 2px;\n}\n.chip__var[_ngcontent-%COMP%] {\n  margin-right: 8px;\n}\n.chip__count[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: #4b5563;\n}\n.preview-list[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n}\n.pv-item[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 260px 1fr;\n  gap: 12px;\n  border: 1px solid #e5e7eb;\n  border-radius: 12px;\n  padding: 12px;\n  background: #fff;\n}\n.pv-left[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n}\n.pv-doc[_ngcontent-%COMP%] {\n  font-weight: 600;\n  font-size: 13px;\n}\n.pv-meta[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 12px;\n  font-size: 12px;\n  color: #334155;\n}\n.muted[_ngcontent-%COMP%] {\n  color: #6b7280;\n}\n.preview-box[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #2c3e50 0%,\n      #34495e 100%);\n  color: #fff;\n  padding: 12px;\n  border-radius: 12px;\n  min-height: 85px;\n  font-family: monospace;\n  font-size: 14px;\n  line-height: 1.5;\n  white-space: pre-wrap;\n}\n.dlg__body[_ngcontent-%COMP%]    > *[_ngcontent-%COMP%]    + *[_ngcontent-%COMP%] {\n  margin-top: 16px;\n}\n.adv[_ngcontent-%COMP%]   .grid[_ngcontent-%COMP%]    > *[_ngcontent-%COMP%]    + *[_ngcontent-%COMP%] {\n  margin-top: 12px;\n}\n.group-card[_ngcontent-%COMP%]    + .group-card[_ngcontent-%COMP%] {\n  margin-top: 16px;\n}\n.cand-list[_ngcontent-%COMP%] {\n  gap: 12px;\n}\n.preview-list[_ngcontent-%COMP%] {\n  gap: 12px;\n}\n.pv-item[_ngcontent-%COMP%] {\n  padding: 12px;\n}\n@media (max-width: 720px) {\n  .pv-item[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n/*# sourceMappingURL=round-wizard-dialog.component.css.map */"] });
var RoundWizardDialogComponent = _RoundWizardDialogComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RoundWizardDialogComponent, [{
    type: Component,
    args: [{ selector: "app-round-wizard-dialog", standalone: true, imports: [CommonModule, MatButtonModule], template: `
    <div class="dlg">
    <header class="dlg__head">
      <h2>\xBFCompletar con otro importe?</h2>
    </header>

    <section class="dlg__body">
      <!-- STATS -->
      <div class="group-card">
        <div class="group-title">Progreso</div>
        <div class="stats">
          <div class="stat"><span>Total</span><b>{{ state().total }}</b></div>
          <div class="stat"><span>Resueltas</span><b class="ok">{{ state().resueltas }}</b></div>
          <div class="stat"><span>Pendientes</span><b class="warn">{{ state().pendientes }}</b></div>
        </div>
      </div>

      <!-- CANDIDATAS -->
      <div class="group-card">
        <div class="group-title">Opciones</div>

        <ng-container *ngIf="state().candidatas?.length; else noCand">
          <div class="chip-container">
            <button type="button" class="chip"
                    *ngFor="let c of state().candidatas"
                    (click)="choose(c.variable)">
              <span class="chip__var">{{ pretty(c.variable) }}</span>
              <span class="chip__count">{{ c.filasQueResuelve }} casos</span>
            </button>
          </div>
        </ng-container>
        <ng-template #noCand>
          <div class="muted">No existen casos para resolver.</div>
        </ng-template>
      </div>

      <!-- PREVIEW -->
      <div class="group-card">
        <div class="group-title">Previsualizaci\xF3n</div>
        <div class="preview-list">
          <div class="pv-item" *ngFor="let p of (state().muestraPreview || [])">
            <div class="pv-left">
              <div class="pv-doc">{{ p.documento || '(sin doc.)' }}</div>
              <div class="pv-nom muted">{{ p.nombre }}</div>
              <div class="pv-meta">
                <span>Usada: <b>{{ pretty(p.variableUsada) || '\u2014' }}</b></span>
                <span>Valor: <b>{{ p.valorUsado ?? '\u2014' }}</b></span>
              </div>
            </div>
            <div class="pv-sms preview-box">{{ p.sms }}</div>
          </div>
        </div>
      </div>
    </section>

    <footer class="dlg__foot">
      <button mat-button type="button" (click)="skip()" [disabled]="loading()">Omitir</button>
      <span class="spacer"></span>
      <button mat-raised-button style="color: white; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);" type="button" (click)="download()" [disabled]="loading()">
        Generar
      </button>
    </footer>
  </div>
  `, styles: ["/* angular:styles/component:css;5fd2a04a4c8804a12669ebf2961d636522cfefd95dbff9aaddceae16dc1d4463;C:/Users/HP/Documents/Kubito-2.0-v1/cashi-discador-frontend/cashi-discador-frontend/src/app/features/legacy/SMS_DYNAMIC/Common/round-wizard-dialog.component.ts */\n.dlg {\n  width: 100%;\n  max-width: 100%;\n  display: flex;\n  flex-direction: column;\n  max-height: 80vh;\n}\n.dlg__head {\n  display: flex;\n  align-items: center;\n  gap: 22px;\n  padding: 14px 18px;\n  border-bottom: 1px solid #e5e7eb;\n  justify-content: center;\n}\n.dlg__head h2 {\n  margin: 0;\n  font-size: 1.2rem;\n  font-weight: 700;\n}\n.icon-btn {\n  border: none;\n  background: transparent;\n  font-size: 18px;\n  margin-left: auto;\n  cursor: pointer;\n}\n.dlg__body {\n  flex: 1 1 auto;\n  overflow: auto;\n}\n.dlg__foot {\n  padding: 12px 18px;\n  border-top: 1px solid #e5e7eb;\n  background: #fff;\n  box-shadow: 0 -6px 12px -10px rgba(0, 0, 0, .12);\n  display: flex;\n  align-items: center;\n  gap: 10px;\n}\n.spacer {\n  flex: 1;\n}\n.group-card {\n  border: 1px solid #e5e7eb;\n  background: #fff;\n  border-radius: 12px;\n  padding: 12px;\n  margin-top: 20px;\n  margin-left: 15px;\n  margin-right: 15px;\n}\n.group-title {\n  margin: 0 0 10px 0;\n  font-size: 14px;\n  font-weight: 600;\n  color: #374151;\n}\n.stats {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));\n  gap: 10px;\n}\n.stat {\n  border: 1px solid #e5e7eb;\n  border-radius: 10px;\n  padding: 10px 12px;\n  background: #fafafa;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n}\n.stat span {\n  color: #6b7280;\n  font-size: .9rem;\n}\n.stat b {\n  font-size: 1rem;\n}\n.stat b.ok {\n  color: #059669;\n}\n.stat b.warn {\n  color: #b45309;\n}\n.chip-container {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 10px;\n  align-items: center;\n}\n.chip {\n  appearance: none;\n  border: 1px solid #dfe3ee;\n  background: #f8f9fc;\n  color: #111827;\n  border-radius: 999px;\n  padding: 8px 14px;\n  font-weight: 600;\n  line-height: 1.1;\n  cursor: pointer;\n  transition:\n    background .15s,\n    border-color .15s,\n    transform .04s;\n  box-shadow: 0 1px 0 rgba(0, 0, 0, .02);\n}\n.chip:hover {\n  background: #f8fafc;\n}\n.chip:active {\n  transform: translateY(1px);\n}\n.chip:focus-visible {\n  outline: 2px solid #6366f1;\n  outline-offset: 2px;\n}\n.chip__var {\n  margin-right: 8px;\n}\n.chip__count {\n  font-size: 12px;\n  color: #4b5563;\n}\n.preview-list {\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n}\n.pv-item {\n  display: grid;\n  grid-template-columns: 260px 1fr;\n  gap: 12px;\n  border: 1px solid #e5e7eb;\n  border-radius: 12px;\n  padding: 12px;\n  background: #fff;\n}\n.pv-left {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n}\n.pv-doc {\n  font-weight: 600;\n  font-size: 13px;\n}\n.pv-meta {\n  display: flex;\n  gap: 12px;\n  font-size: 12px;\n  color: #334155;\n}\n.muted {\n  color: #6b7280;\n}\n.preview-box {\n  background:\n    linear-gradient(\n      135deg,\n      #2c3e50 0%,\n      #34495e 100%);\n  color: #fff;\n  padding: 12px;\n  border-radius: 12px;\n  min-height: 85px;\n  font-family: monospace;\n  font-size: 14px;\n  line-height: 1.5;\n  white-space: pre-wrap;\n}\n.dlg__body > * + * {\n  margin-top: 16px;\n}\n.adv .grid > * + * {\n  margin-top: 12px;\n}\n.group-card + .group-card {\n  margin-top: 16px;\n}\n.cand-list {\n  gap: 12px;\n}\n.preview-list {\n  gap: 12px;\n}\n.pv-item {\n  padding: 12px;\n}\n@media (max-width: 720px) {\n  .pv-item {\n    grid-template-columns: 1fr;\n  }\n}\n/*# sourceMappingURL=round-wizard-dialog.component.css.map */\n"] }]
  }], () => [{ type: void 0, decorators: [{
    type: Inject,
    args: [MAT_DIALOG_DATA]
  }] }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(RoundWizardDialogComponent, { className: "RoundWizardDialogComponent", filePath: "src/app/features/legacy/sms_dynamic/common/round-wizard-dialog.component.ts", lineNumber: 196 });
})();

// src/app/features/legacy/SMS_DYNAMIC/pages/dyn-query-page/dyn-query-page.component.ts
var _c02 = ["tplArea"];
function DynQueryPageComponent_ng_container_22_button_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 55);
    \u0275\u0275listener("click", function DynQueryPageComponent_ng_container_22_button_5_Template_button_click_0_listener() {
      const c_r3 = \u0275\u0275restoreView(_r2).$implicit;
      const ctx_r3 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r3.toggleChip(c_r3.key, c_r3.affectsSelects !== false));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const c_r3 = ctx.$implicit;
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("active", ctx_r3.isActive(c_r3.key));
    \u0275\u0275property("disabled", ctx_r3.isChipDisabled(c_r3.key));
    \u0275\u0275attribute("aria-pressed", ctx_r3.isActive(c_r3.key));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", c_r3.label, " ");
  }
}
function DynQueryPageComponent_ng_container_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275elementStart(1, "div", 51)(2, "h3", 52);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 53);
    \u0275\u0275template(5, DynQueryPageComponent_ng_container_22_button_5_Template, 2, 5, "button", 54);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const g_r5 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", "chip-group--" + g_r5.key);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(g_r5.title);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngForOf", g_r5.items);
  }
}
function DynQueryPageComponent_div_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 8)(1, "label", 9);
    \u0275\u0275text(2, "Sumar importe");
    \u0275\u0275elementEnd();
    \u0275\u0275element(3, "input", 56);
    \u0275\u0275elementEnd();
  }
}
function DynQueryPageComponent_div_33_div_1_option_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 76);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const f_r7 = ctx.$implicit;
    \u0275\u0275property("value", f_r7.key);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(f_r7.label);
  }
}
function DynQueryPageComponent_div_33_div_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 60)(1, "div", 61)(2, "select", 62);
    \u0275\u0275template(3, DynQueryPageComponent_div_33_div_1_option_3_Template, 2, 2, "option", 63);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "button", 64);
    \u0275\u0275listener("click", function DynQueryPageComponent_div_33_div_1_Template_button_click_4_listener() {
      \u0275\u0275restoreView(_r6);
      const i_r8 = \u0275\u0275nextContext().index;
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.removeRange(i_r8));
    });
    \u0275\u0275elementStart(5, "span", 15);
    \u0275\u0275text(6, "delete");
    \u0275\u0275elementEnd();
    \u0275\u0275text(7, " Borrar ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "div", 65);
    \u0275\u0275element(9, "input", 66);
    \u0275\u0275elementStart(10, "label", 67);
    \u0275\u0275element(11, "input", 68);
    \u0275\u0275elementStart(12, "span", 69);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "div", 70);
    \u0275\u0275text(15);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "label", 67);
    \u0275\u0275element(17, "input", 71);
    \u0275\u0275elementStart(18, "span", 69);
    \u0275\u0275text(19);
    \u0275\u0275elementEnd()();
    \u0275\u0275element(20, "input", 72);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "div", 73)(22, "label", 74)(23, "input", 75);
    \u0275\u0275listener("change", function DynQueryPageComponent_div_33_div_1_Template_input_change_23_listener() {
      let tmp_7_0;
      \u0275\u0275restoreView(_r6);
      const ctx_r8 = \u0275\u0275nextContext();
      const rg_r10 = ctx_r8.$implicit;
      const i_r8 = ctx_r8.index;
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(((tmp_7_0 = rg_r10.get("mode")) == null ? null : tmp_7_0.value) === "gt" ? ctx_r3.toggleUseMax(i_r8, false) : ctx_r3.toggleUseMin(i_r8, false));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "span");
    \u0275\u0275text(25, "Desactivar intervalo");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    let tmp_7_0;
    let tmp_8_0;
    let tmp_9_0;
    const rg_r10 = \u0275\u0275nextContext().$implicit;
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275property("ngForOf", ctx_r3.rangeFields);
    \u0275\u0275advance(10);
    \u0275\u0275textInterpolate(((tmp_7_0 = rg_r10.get("inclusiveMin")) == null ? null : tmp_7_0.value) ? "\u2264" : "<");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r3.fieldLabel((tmp_8_0 = rg_r10.get("field")) == null ? null : tmp_8_0.value) || "Variable", " ");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(((tmp_9_0 = rg_r10.get("inclusiveMax")) == null ? null : tmp_9_0.value) ? "\u2264" : "<");
  }
}
function DynQueryPageComponent_div_33_ng_template_2_option_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 76);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const f_r12 = ctx.$implicit;
    \u0275\u0275property("value", f_r12.key);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(f_r12.label);
  }
}
function DynQueryPageComponent_div_33_ng_template_2_ng_container_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275element(1, "input", 88);
    \u0275\u0275elementStart(2, "label", 74);
    \u0275\u0275element(3, "input", 68);
    \u0275\u0275elementStart(4, "span");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    let tmp_7_0;
    const rg_r10 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(((tmp_7_0 = rg_r10.get("inclusiveMin")) == null ? null : tmp_7_0.value) ? "\u2265" : ">");
  }
}
function DynQueryPageComponent_div_33_ng_template_2_ng_container_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275element(1, "input", 89);
    \u0275\u0275elementStart(2, "label", 74);
    \u0275\u0275element(3, "input", 71);
    \u0275\u0275elementStart(4, "span");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    let tmp_7_0;
    const rg_r10 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(((tmp_7_0 = rg_r10.get("inclusiveMax")) == null ? null : tmp_7_0.value) ? "\u2264" : "<");
  }
}
function DynQueryPageComponent_div_33_ng_template_2_ng_container_18_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = \u0275\u0275getCurrentView();
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275elementStart(1, "input", 38);
    \u0275\u0275listener("change", function DynQueryPageComponent_div_33_ng_template_2_ng_container_18_Template_input_change_1_listener($event) {
      \u0275\u0275restoreView(_r13);
      const i_r8 = \u0275\u0275nextContext(2).index;
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.toggleUseMax(i_r8, $event.target.checked));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3, "a\xF1adir l\xEDmite superior");
    \u0275\u0275elementEnd();
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    let tmp_7_0;
    const rg_r10 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("checked", (tmp_7_0 = rg_r10.get("useMax")) == null ? null : tmp_7_0.value);
  }
}
function DynQueryPageComponent_div_33_ng_template_2_ng_container_19_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = \u0275\u0275getCurrentView();
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275elementStart(1, "input", 38);
    \u0275\u0275listener("change", function DynQueryPageComponent_div_33_ng_template_2_ng_container_19_Template_input_change_1_listener($event) {
      \u0275\u0275restoreView(_r14);
      const i_r8 = \u0275\u0275nextContext(2).index;
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.toggleUseMin(i_r8, $event.target.checked));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3, "a\xF1adir l\xEDmite inferior");
    \u0275\u0275elementEnd();
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    let tmp_7_0;
    const rg_r10 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("checked", (tmp_7_0 = rg_r10.get("useMin")) == null ? null : tmp_7_0.value);
  }
}
function DynQueryPageComponent_div_33_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 77)(1, "select", 78);
    \u0275\u0275template(2, DynQueryPageComponent_div_33_ng_template_2_option_2_Template, 2, 2, "option", 63);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "select", 79);
    \u0275\u0275listener("change", function DynQueryPageComponent_div_33_ng_template_2_Template_select_change_3_listener($event) {
      \u0275\u0275restoreView(_r11);
      const i_r8 = \u0275\u0275nextContext().index;
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.changeOperator(i_r8, $event.target.value));
    });
    \u0275\u0275elementStart(4, "option", 80);
    \u0275\u0275text(5, ">");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "option", 81);
    \u0275\u0275text(7, "<");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "div", 82);
    \u0275\u0275elementContainerStart(9, 83);
    \u0275\u0275template(10, DynQueryPageComponent_div_33_ng_template_2_ng_container_10_Template, 6, 1, "ng-container", 84)(11, DynQueryPageComponent_div_33_ng_template_2_ng_container_11_Template, 6, 1, "ng-container", 84);
    \u0275\u0275elementContainerEnd();
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "button", 85);
    \u0275\u0275listener("click", function DynQueryPageComponent_div_33_ng_template_2_Template_button_click_12_listener() {
      \u0275\u0275restoreView(_r11);
      const i_r8 = \u0275\u0275nextContext().index;
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.removeRange(i_r8));
    });
    \u0275\u0275elementStart(13, "span", 15);
    \u0275\u0275text(14, "delete");
    \u0275\u0275elementEnd();
    \u0275\u0275text(15, " Borrar ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "div", 86)(17, "label", 74);
    \u0275\u0275template(18, DynQueryPageComponent_div_33_ng_template_2_ng_container_18_Template, 4, 1, "ng-container", 87)(19, DynQueryPageComponent_div_33_ng_template_2_ng_container_19_Template, 4, 1, "ng-container", 87);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_7_0;
    let tmp_8_0;
    let tmp_11_0;
    let tmp_12_0;
    const rg_r10 = \u0275\u0275nextContext().$implicit;
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275property("ngForOf", ctx_r3.rangeFields);
    \u0275\u0275advance();
    \u0275\u0275property("value", (tmp_7_0 = rg_r10.get("mode")) == null ? null : tmp_7_0.value);
    \u0275\u0275advance(6);
    \u0275\u0275property("ngSwitch", (tmp_8_0 = rg_r10.get("mode")) == null ? null : tmp_8_0.value);
    \u0275\u0275advance();
    \u0275\u0275property("ngSwitchCase", "gt");
    \u0275\u0275advance();
    \u0275\u0275property("ngSwitchCase", "lt");
    \u0275\u0275advance(7);
    \u0275\u0275property("ngIf", ((tmp_11_0 = rg_r10.get("mode")) == null ? null : tmp_11_0.value) === "gt");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ((tmp_12_0 = rg_r10.get("mode")) == null ? null : tmp_12_0.value) === "lt");
  }
}
function DynQueryPageComponent_div_33_div_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 90);
    \u0275\u0275text(1, " \u26A0\uFE0F El valor m\xEDnimo no puede ser mayor que el m\xE1ximo. ");
    \u0275\u0275elementEnd();
  }
}
function DynQueryPageComponent_div_33_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 57);
    \u0275\u0275template(1, DynQueryPageComponent_div_33_div_1_Template, 26, 4, "div", 58)(2, DynQueryPageComponent_div_33_ng_template_2_Template, 20, 7, "ng-template", null, 1, \u0275\u0275templateRefExtractor)(4, DynQueryPageComponent_div_33_div_4_Template, 2, 0, "div", 59);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_6_0;
    const rg_r10 = ctx.$implicit;
    const singleMode_r15 = \u0275\u0275reference(3);
    \u0275\u0275property("formGroup", rg_r10);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ((tmp_6_0 = rg_r10.get("useMin")) == null ? null : tmp_6_0.value) && ((tmp_6_0 = rg_r10.get("useMax")) == null ? null : tmp_6_0.value))("ngIfElse", singleMode_r15);
    \u0275\u0275advance(3);
    \u0275\u0275property("ngIf", rg_r10.errors == null ? null : rg_r10.errors["rangeOrder"]);
  }
}
function DynQueryPageComponent_div_98_ng_container_7_th_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 100);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const c_r16 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(c_r16);
  }
}
function DynQueryPageComponent_div_98_ng_container_7_td_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 101);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const r_r17 = ctx.$implicit;
    const c_r16 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(r_r17[c_r16]);
  }
}
function DynQueryPageComponent_div_98_ng_container_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0, 97);
    \u0275\u0275template(1, DynQueryPageComponent_div_98_ng_container_7_th_1_Template, 2, 1, "th", 98)(2, DynQueryPageComponent_div_98_ng_container_7_td_2_Template, 2, 1, "td", 99);
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const c_r16 = ctx.$implicit;
    \u0275\u0275property("matColumnDef", c_r16);
  }
}
function DynQueryPageComponent_div_98_tr_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "tr", 102);
  }
}
function DynQueryPageComponent_div_98_tr_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "tr", 103);
  }
}
function DynQueryPageComponent_div_98_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 91)(1, "h2", 14)(2, "span", 15);
    \u0275\u0275text(3, "table_chart");
    \u0275\u0275elementEnd();
    \u0275\u0275text(4, " Resultado ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 92)(6, "table", 93);
    \u0275\u0275template(7, DynQueryPageComponent_div_98_ng_container_7_Template, 3, 1, "ng-container", 94)(8, DynQueryPageComponent_div_98_tr_8_Template, 1, 0, "tr", 95)(9, DynQueryPageComponent_div_98_tr_9_Template, 1, 0, "tr", 96);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275property("dataSource", ctx_r3.rows());
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r3.cols());
    \u0275\u0275advance();
    \u0275\u0275property("matHeaderRowDef", ctx_r3.cols());
    \u0275\u0275advance();
    \u0275\u0275property("matRowDefColumns", ctx_r3.cols());
  }
}
var VAR_PATTERN_I = /\{([A-Z0-9_]+)\}/gi;
var VAR_PATTERN = /\{([A-Z0-9_]+)\}/g;
var _DynQueryPageComponent = class _DynQueryPageComponent {
  constructor() {
    this.fbRef = inject(FormBuilder);
    this.api = inject(DynQueryService);
    this.comboApi = inject(ComboService);
    this.router = inject(Router);
    this.sampleRow = signal(null, ...ngDevMode ? [{ debugName: "sampleRow" }] : []);
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
    this.selects = /* @__PURE__ */ new Set();
    this.condiciones = /* @__PURE__ */ new Set();
    this.chipGroups = [
      {
        key: "cliente",
        title: "Cliente",
        items: [
          { key: "NOMBRE", label: "Nombre", affectsSelects: true },
          { key: "NOMBRECOMPLETO", label: "Nombre completo", affectsSelects: true },
          { key: "EMAIL", label: "Correo", affectsSelects: true },
          { key: "NUMCUENTAPMCP", label: "N\xB0 de Cuenta", affectsSelects: true }
        ]
      },
      {
        key: "financiero",
        title: "Financiero",
        items: [
          { key: "LTD", label: "LTD", affectsSelects: true },
          { key: "LTDE", label: "LTDE", affectsSelects: true },
          { key: "LTD_LTDE", label: "LTD y LTDE", affectsSelects: true },
          { key: "BAJA30", label: "Baja 30", affectsSelects: true },
          { key: "MORA", label: "Saldo Mora", affectsSelects: true },
          { key: "BAJA30_SALDOMORA", label: "Baja 30 y Saldo Mora", affectsSelects: true },
          { key: "PKM", label: "PKM", affectsSelects: true },
          { key: "CAPITAL", label: "Capital", affectsSelects: true },
          { key: "DEUDA_TOTAL", label: "Deuda Total", affectsSelects: true }
        ]
      },
      {
        key: "fechas",
        title: "Fechas",
        items: [
          { key: "DIASMORA", label: "D\xEDas mora", affectsSelects: true },
          { key: "HOY", label: "Hoy", affectsSelects: false },
          { key: "MANANA", label: "Ma\xF1ana", affectsSelects: false }
        ]
      }
    ];
    this.chips = this.chipGroups.flatMap((g) => g.items);
    this.selectedChips = /* @__PURE__ */ new Set();
    this.previewText = computed(() => {
      const tpl = this.tplSig();
      const row = this.sampleRow();
      return this.renderTemplate(tpl, row);
    }, ...ngDevMode ? [{ debugName: "previewText" }] : []);
    this.form = inject(FormBuilder).nonNullable.group({
      tramo: "3",
      noContenido: false,
      excluirPromesasPeriodoActual: true,
      excluirCompromisos: true,
      excluirBlacklist: true,
      limit: 1e3,
      // estos tres siguen siendo string
      nombre: inject(FormBuilder).nonNullable.control(""),
      plantillaTexto: inject(FormBuilder).nonNullable.control(""),
      descripcion: inject(FormBuilder).nonNullable.control(""),
      // 👇 TIPAR COMO NÚMERO
      importeExtra: inject(FormBuilder).nonNullable.control(0),
      rangos: inject(FormBuilder).array([])
    });
    this.tplSig = toSignal(this.form.controls.plantillaTexto.valueChanges.pipe(startWith(this.form.controls.plantillaTexto.value ?? "")), { initialValue: this.form.controls.plantillaTexto.value ?? "" });
    this.rows = signal([], ...ngDevMode ? [{ debugName: "rows" }] : []);
    this.cols = signal([], ...ngDevMode ? [{ debugName: "cols" }] : []);
    this.matDialog = inject(MatDialog);
    this.Math = Math;
    this.tokensInText = signal(/* @__PURE__ */ new Set(), ...ngDevMode ? [{ debugName: "tokensInText" }] : []);
    this.affectsMap = new Map(this.chipGroups.flatMap((g) => g.items.map((i) => [this.mapVar(i.key), i.affectsSelects !== false])));
    this.previewMode = signal("manual", ...ngDevMode ? [{ debugName: "previewMode" }] : []);
    this.loadingPreview = signal(false, ...ngDevMode ? [{ debugName: "loadingPreview" }] : []);
    this.lastHash = signal("", ...ngDevMode ? [{ debugName: "lastHash" }] : []);
    this.pendingPreview = computed(() => this.previewMode() === "manual" && this.hash(this.currentQueryForPreview()) !== this.lastHash(), ...ngDevMode ? [{ debugName: "pendingPreview" }] : []);
  }
  insertAtCursor(text) {
    const ctrl = this.form.controls.plantillaTexto;
    const el = this.tplArea?.nativeElement;
    if (!el) {
      const cur = ctrl.value ?? "";
      const sep = cur && !cur.endsWith(" ") ? " " : "";
      ctrl.setValue(cur + sep + text);
      ctrl.markAsDirty();
      return;
    }
    const val = ctrl.value ?? "";
    const start = el.selectionStart ?? val.length;
    const end = el.selectionEnd ?? start;
    const before = val.slice(0, start);
    const after = val.slice(end);
    const needsSpaceBefore = before.length && !/\s$/.test(before);
    const insert = (needsSpaceBefore ? " " : "") + text;
    const next = before + insert + after;
    ctrl.setValue(next);
    ctrl.markAsDirty();
    const caret = (before + insert).length;
    setTimeout(() => {
      el.focus();
      el.selectionStart = el.selectionEnd = caret;
    }, 0);
  }
  isSelected(key) {
    return this.selectedChips.has(key);
  }
  // --- ALIAS de columnas que pueden venir con espacios/underscore ---
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
      case "NOMBRECOMPLETO":
        return ["NOMBRECOMPLETO", "NOMBRE COMPLETO"];
      case "EMAIL":
        return ["EMAIL"];
      case "NUMCUENTAPMCP":
        return ["NUMCUENTAPMCP", "NUMCUENTA_PMCP", "NUM_CUENTA_PMCP", "NUMCUENTA PMCP", "N\xB0 CUENTA PMCP"];
      case "DIASMORA":
        return ["DIASMORA", "DIAS_MORA", "DIAS MORA"];
      default:
        return [k, k.replace(/\s+/g, "_")];
    }
  }
  // Normaliza nombre de variable de plantilla a su “familia” base
  mapVar(key) {
    const k = key.toUpperCase();
    if (k === "MORA")
      return "SALDO_MORA";
    return k;
  }
  // Obtiene el valor probando alias
  getVal(r, key) {
    const candidates = this.aliasKeys(this.mapVar(key));
    for (const c of candidates) {
      if (r.hasOwnProperty(c))
        return r[c];
    }
    return void 0;
  }
  // Reglas de “valor significativo” (usa getVal + alias)
  hasMeaningfulValue(row, col) {
    const v = this.getVal(row, col);
    if (v === null || v === void 0)
      return false;
    if (typeof v === "string")
      return v.trim().length > 0;
    if (typeof v === "number")
      return v > 0;
    return true;
  }
  requiredColumnsForPreview() {
    const fromChips = Array.from(this.selects);
    const tpl = this.form.controls.plantillaTexto.value ?? "";
    const fromTpl = (tpl.match(VAR_PATTERN) || []).map((m) => m.slice(1, -1));
    const all = Array.from(/* @__PURE__ */ new Set([...fromChips, ...fromTpl])).map((k) => this.mapVar(k));
    const candidates = /* @__PURE__ */ new Set([
      "LTD",
      "LTDE",
      "LTD_LTDE",
      "BAJA30",
      "SALDO_MORA",
      "BAJA30_SALDOMORA",
      "CAPITAL",
      "DEUDA_TOTAL",
      "PKM"
    ]);
    return Array.from(new Set(fromChips.map((k) => this.mapVar(k)))).filter((k) => candidates.has(k));
  }
  preferredColumnsForPreview() {
    const tpl = this.form.controls.plantillaTexto.value ?? "";
    const fromTpl = (tpl.match(VAR_PATTERN) || []).map((m) => this.mapVar(m.slice(1, -1)));
    const req = new Set(this.requiredColumnsForPreview());
    return Array.from(new Set(fromTpl.filter((k) => !req.has(k))));
  }
  // === NUEVO: selecciona la “mejor” fila con dos pasos ===
  pickBestRow(rows, required, preferred) {
    const R = rows;
    const full = R.filter((r) => required.every((c) => this.hasMeaningfulValue(r, c)));
    if (full.length) {
      full.sort((a, b) => {
        const sa = preferred.reduce((acc, c) => acc + (this.hasMeaningfulValue(a, c) ? 1 : 0), 0);
        const sb = preferred.reduce((acc, c) => acc + (this.hasMeaningfulValue(b, c) ? 1 : 0), 0);
        return sb - sa;
      });
      return full[0];
    }
    let best = null;
    let bestReq = -1;
    let bestPref = -1;
    for (const r of R) {
      const reqCount = required.reduce((acc, c) => acc + (this.hasMeaningfulValue(r, c) ? 1 : 0), 0);
      const prefCount = preferred.reduce((acc, c) => acc + (this.hasMeaningfulValue(r, c) ? 1 : 0), 0);
      if (reqCount > bestReq || reqCount === bestReq && prefCount > bestPref) {
        best = r;
        bestReq = reqCount;
        bestPref = prefCount;
      }
    }
    return best ?? (rows[0] ?? null);
  }
  // Toggle visual + lógica (insertar solo al seleccionar)
  toggleChip(key, affectsSelects = true) {
    const wasActive = this.selectedChips.has(key);
    if (wasActive) {
      this.selectedChips.delete(key);
      if (affectsSelects)
        this.selects.delete(key);
      this.removePlaceholder(key);
    } else {
      if (key === "BAJA30" || key === "MORA") {
        if (this.selectedChips.has("BAJA30_SALDOMORA")) {
          this.selectedChips.delete("BAJA30_SALDOMORA");
          this.selects.delete("BAJA30_SALDOMORA");
          this.removePlaceholder("BAJA30_SALDOMORA");
        }
      }
      if (key === "BAJA30_SALDOMORA") {
        if (this.selectedChips.has("BAJA30")) {
          this.selectedChips.delete("BAJA30");
          this.selects.delete("BAJA30");
          this.removePlaceholder("BAJA30");
        }
        if (this.selectedChips.has("MORA")) {
          this.selectedChips.delete("MORA");
          this.selects.delete("MORA");
          this.removePlaceholder("MORA");
        }
      }
      if (key === "LTD" || key === "LTDE") {
        this.forceDeselect("LTD_LTDE");
      }
      if (key === "LTD_LTDE") {
        this.forceDeselect("LTD");
        this.forceDeselect("LTDE");
      }
      this.selectedChips.add(key);
      if (affectsSelects)
        this.selects.add(key);
      this.insertPlaceholderOnce(key);
    }
    if (!this.hasTopUpSelect()) {
      this.form.controls.importeExtra.setValue(0);
    }
    this.fetchSampleRow();
  }
  // 1) Helper: normaliza claves del row
  normalizeRow(row) {
    const out = {};
    Object.keys(row || {}).forEach((k) => {
      const key = k.replace(/\s+/g, "_").toUpperCase();
      out[key] = row[k];
    });
    return out;
  }
  // 2) Pide la fila de muestra con fallback y normalización
  fetchSampleRow() {
    if (this.previewMode() === "auto") {
      this.triggerPreview();
    }
  }
  renderTemplate(tpl, row) {
    if (!tpl)
      return "";
    if (!row)
      return tpl;
    const r = this.normalizeRow(row);
    const firstName = (s) => String(s ?? "").trim().split(/\s+/)[0] || "";
    const fmtInt = (v) => {
      const n = Number(v);
      return Number.isFinite(n) ? Math.trunc(n).toLocaleString("es-PE") : "";
    };
    const hoy = /* @__PURE__ */ new Date();
    const manana = new Date(hoy.getTime() + 24 * 60 * 60 * 1e3);
    const fmtDate = (d) => d.toLocaleDateString("es-PE", { day: "2-digit", month: "2-digit" });
    return tpl.replace(VAR_PATTERN, (_m, key) => {
      switch (key) {
        case "NOMBRE":
          return firstName(this.getVal(r, "NOMBRE"));
        case "HOY":
          return fmtDate(hoy);
        case "MANANA":
          return fmtDate(manana);
        // numéricas esperadas (todas pasan por getVal para soportar alias)
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
  expandWithAliases(keys) {
    const out = /* @__PURE__ */ new Set();
    keys.forEach((k) => this.aliasKeys(k).forEach((a) => out.add(a)));
    return Array.from(out);
  }
  ngOnInit() {
    const form$ = this.form.valueChanges.pipe(
      startWith(this.form.getRawValue()),
      debounceTime(300),
      map((v) => ({
        tramo: v.tramo,
        importeExtra: v.importeExtra,
        plantillaTexto: v.plantillaTexto,
        // convierto tu Set a array estable
        selects: Array.from(this.selects),
        condiciones: Array.from(this.condiciones)
      })),
      // evita llamadas si no cambia nada importante
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
    );
    form$.subscribe(() => {
      this.syncChipsWithTemplate();
      if (this.previewMode() === "auto")
        this.triggerPreview();
    });
    this.form.controls.plantillaTexto.valueChanges.pipe(debounceTime(200)).subscribe(() => {
      this.syncChipsWithTemplate();
      if (this.previewMode() === "auto")
        this.triggerPreview();
    });
    this.syncChipsWithTemplate();
    if (this.previewMode() === "auto")
      this.triggerPreview();
  }
  // Inserta {KEY} una sola vez
  insertPlaceholderOnce(key) {
    const ctrl = this.form.controls.plantillaTexto;
    const cur = ctrl.value ?? "";
    const re = new RegExp(`\\{${key}\\}(?!\\w)`, "i");
    if (re.test(cur))
      return;
    this.insertAtCursor(`{${key}}`);
  }
  hasTopUpSelect() {
    return this.selectedChips.has("LTD") || this.selectedChips.has("LTDE") || this.selectedChips.has("LTD_LTDE");
  }
  get rangosFA() {
    return this.form.get("rangos");
  }
  validateMinLTMax() {
    return (control) => {
      const fg = control;
      const min = fg.get("min")?.value;
      const max = fg.get("max")?.value;
      if (min != null && max != null && Number(min) > Number(max)) {
        return { rangeOrder: true };
      }
      return null;
    };
  }
  makeRange() {
    return this.fbRef.nonNullable.group({
      field: this.fbRef.nonNullable.control("DEUDA_TOTAL", { validators: [Validators.required] }),
      mode: this.fbRef.nonNullable.control("gt"),
      // operador inicial
      // límites
      useMin: this.fbRef.nonNullable.control(true),
      // al empezar con 'gt'
      min: this.fbRef.control(null),
      inclusiveMin: this.fbRef.nonNullable.control(false),
      useMax: this.fbRef.nonNullable.control(false),
      max: this.fbRef.control(null),
      inclusiveMax: this.fbRef.nonNullable.control(true)
    }, { validators: [this.validateRange()] });
  }
  // cambia operador inicial y enciende el límite correspondiente
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
  validateRange() {
    return (control) => {
      const fg = control;
      const useMin = !!fg.get("useMin")?.value;
      const useMax = !!fg.get("useMax")?.value;
      const min = fg.get("min")?.value;
      const max = fg.get("max")?.value;
      if (!useMin && !useMax)
        return { noBoundSelected: true };
      if (useMin && (min == null || min === ""))
        return { minRequired: true };
      if (useMax && (max == null || max === ""))
        return { maxRequired: true };
      if (useMin && useMax && Number(min) > Number(max))
        return { rangeOrder: true };
      return null;
    };
  }
  addRange() {
    this.rangosFA.push(this.makeRange());
  }
  removeRange(i) {
    this.rangosFA.removeAt(i);
  }
  // change de checkbox con inserción solo al marcar
  onSelectChange(ev, key) {
    const input = ev.target;
    if (input.checked) {
      this.selects.add(input.value);
      this.insertPlaceholder(key);
    } else {
      this.selects.delete(input.value);
      this.removePlaceholder(key);
    }
  }
  // change de condiciones (solo PROMESAS)
  toggleCond(ev, key) {
    const input = ev.target;
    if (input.checked)
      this.condiciones.add(key);
    else
      this.condiciones.delete(key);
    this.fetchSampleRow();
  }
  buildBody(limitForPreview) {
    const v = this.form.getRawValue();
    let selects = Array.from(this.selects).map((s) => s === "MORA" ? "SALDO_MORA" : s);
    const PROMESAS = /* @__PURE__ */ new Set(["PROMESAS_HOY", "PROMESAS_MANANA", "PROMESAS_MANANA2", "PROMESAS_ROTAS"]);
    const condiciones = Array.from(this.condiciones).filter((c) => PROMESAS.has(c));
    const tokens = Array.from(this.extractTokens());
    const fromText = tokens.filter((t) => this.affectsMap.get(t));
    selects = Array.from(/* @__PURE__ */ new Set([...selects, ...fromText]));
    const importeExtraAplica = this.hasTopUpSelect() && Number(v.importeExtra) > 0 ? Math.trunc(Number(v.importeExtra)) : null;
    const rangos = this.rangosFA.controls.map((g) => {
      const field = String(g.get("field")?.value || "").toUpperCase();
      const useMin = !!g.get("useMin")?.value;
      const useMax = !!g.get("useMax")?.value;
      const min = g.get("min")?.value;
      const max = g.get("max")?.value;
      return {
        field,
        min: useMin ? Number(min) : void 0,
        max: useMax ? Number(max) : void 0,
        inclusiveMin: !!g.get("inclusiveMin")?.value,
        inclusiveMax: !!g.get("inclusiveMax")?.value
      };
    }).filter((r) => r.min != null || r.max != null);
    return {
      selects,
      tramo: v.tramo,
      condiciones,
      restricciones: {
        noContenido: !!v.noContenido,
        excluirPromesasPeriodoActual: !!v.excluirPromesasPeriodoActual,
        excluirCompromisos: !!v.excluirCompromisos,
        excluirBlacklist: !!v.excluirBlacklist
      },
      limit: limitForPreview ? Number(v.limit || 1e3) : void 0,
      importeExtra: importeExtraAplica,
      rangos: rangos.length ? rangos : void 0
      // 👈 solo si hay
    };
  }
  ejecutar() {
    const body = this.buildBody(true);
    this.api.run(body).subscribe((rs) => {
      this.rows.set(rs);
      this.cols.set(rs.length ? Object.keys(rs[0]) : []);
    });
  }
  // helper para mostrar pop-up
  alert(message, title = "Aviso") {
    this.matDialog.open(AlertDialogComponent, {
      width: "420px",
      data: { title, message }
    });
  }
  /** Borra claves que el backend no quiere ver si están null/undefined */
  compactQuery(q) {
    const c = __spreadValues({}, q);
    if (c.limit == null)
      delete c.limit;
    if (c.importeExtra == null)
      delete c.importeExtra;
    delete c.plantillaTexto;
    return c;
  }
  exportar() {
    const rawQuery = this.buildBody(false);
    const query = this.compactQuery(rawQuery);
    const queryAll = __spreadProps(__spreadValues({}, query), { selectAll: true });
    const template = (this.form.controls.plantillaTexto.value ?? "").trim();
    if (!template) {
      this.alert("Ingresa un texto de SMS antes de exportar.", "Falta texto");
      return;
    }
    const dlg = this.matDialog.open(LoadingDialogComponent, {
      disableClose: true,
      data: { title: "Generando Excel\u2026", subtitle: "Preparando datos y creando archivo" },
      panelClass: "loading-dialog-panel",
      backdropClass: "blur-dialog-backdrop",
      width: "320px",
      // Opcional: 280–320 queda bien
      autoFocus: false
    });
    this.api.precheck(queryAll, template).subscribe({
      next: (res) => {
        if (!res.ok) {
          dlg.close();
          const header = `${res.excedidos} ${res.excedidos === 1 ? "fila" : "filas"} superan ${res.limite} caracteres.`;
          const ejemplosTxt = (res.ejemplos ?? []).map((e) => `\u2022 ${e.len} caracteres \u2014 DNI: ${e.documento || "(sin DNI)"}`).join("\n");
          this.alert(`${header}

Primeros ${Math.min((res.ejemplos ?? []).length, 3)} casos:
${ejemplosTxt}`, "Mensaje demasiado largo");
          return;
        }
        this.api.export(queryAll, template).pipe(finalize(() => dlg.close())).subscribe({
          next: (blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `sms report ${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.xlsx`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
            this.showSuccess("Exportaci\xF3n exitosa", "Tu archivo se gener\xF3 correctamente.").subscribe();
          },
          error: (err) => {
            const msg = err?.status === 422 ? err?.error?.message || "No hay filas para exportar con los filtros seleccionados." : err?.error?.message || err?.message || "Ocurri\xF3 un error al exportar.";
            this.alert(msg, err?.status === 422 ? "Sin resultados" : "Error");
          }
        });
      },
      error: (err) => {
        dlg.close();
        const msg = err?.error?.message || err?.message || "No se pudo validar el SMS.";
        this.alert(msg, "Error en precheck");
      }
    });
  }
  // inserta {KEY} al final del textarea
  insertPlaceholder(key) {
    this.insertAtCursor(`{${key}}`);
  }
  mapRangosForPayload() {
    return this.rangosFA.controls.map((g) => {
      const field = String(g.get("field")?.value || "").toUpperCase();
      const useMin = !!g.get("useMin")?.value;
      const useMax = !!g.get("useMax")?.value;
      const min = g.get("min")?.value;
      const max = g.get("max")?.value;
      return {
        field,
        min: useMin ? Number(min) : void 0,
        max: useMax ? Number(max) : void 0,
        inclusiveMin: !!g.get("inclusiveMin")?.value,
        inclusiveMax: !!g.get("inclusiveMax")?.value
      };
    }).filter((r) => r.min != null || r.max != null);
  }
  guardarCombo() {
    const v = this.form.getRawValue();
    const importeExtraAplica = this.hasTopUpSelect() && Number(v.importeExtra) > 0 ? Math.trunc(Number(v.importeExtra)) : null;
    const rangos = this.mapRangosForPayload();
    const payload = {
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
      // crea también la plantilla si viene el texto
      plantillaTexto: v.plantillaTexto,
      importeExtra: importeExtraAplica,
      rangos: rangos.length ? rangos : void 0
    };
    this.comboApi.createCombo(payload).subscribe({
      next: (_id) => {
        this.form.reset({
          tramo: "3",
          excluirPromesasPeriodoActual: true,
          excluirCompromisos: true,
          excluirBlacklist: true,
          limit: 1e3,
          nombre: "",
          plantillaTexto: "",
          descripcion: ""
        });
        this.selects.clear();
        this.condiciones.clear();
        this.rows.set([]);
        this.cols.set([]);
        this.showSuccess("Guardado", "El combo se guard\xF3 correctamente.").subscribe(() => this.router.navigate(["/sms/combos"]));
      },
      error: (err) => {
        const msg = err?.error?.message || err?.message || "No se pudo guardar el combo.";
        this.alert(msg, "Error");
      }
    });
  }
  Cancel() {
    this.router.navigate(["/sms/combos"]);
  }
  removePlaceholder(key) {
    const ctrl = this.form.controls.plantillaTexto;
    const cur = ctrl.value ?? "";
    const re = new RegExp(`\\{${key}\\}`, "g");
    let next = cur.replace(re, "");
    next = next.replace(/\s{2,}/g, " ").replace(/\s+([.,;:!?])/g, "$1").trim();
    if (next !== cur) {
      ctrl.setValue(next);
      ctrl.markAsDirty();
    }
  }
  fieldLabel(key) {
    const k = String(key || "").toUpperCase();
    const f = this.rangeFields.find((x) => x.key === k);
    return f?.label ?? k;
  }
  showSuccess(title, message, ms = 1800) {
    return this.matDialog.open(SuccessDialogComponent, {
      data: { title, message, autoCloseMs: ms },
      panelClass: "dialog-success",
      disableClose: true
    }).afterClosed();
  }
  forceDeselect(key, affectsSelects = true) {
    if (!this.selectedChips.has(key))
      return;
    this.selectedChips.delete(key);
    if (affectsSelects)
      this.selects.delete(key);
    this.removePlaceholder(key);
  }
  isChipDisabled(key) {
    if (this.isActive(key))
      return false;
    if (key === "LTD_LTDE")
      return this.isActive("LTD") || this.isActive("LTDE");
    if (key === "LTD" || key === "LTDE")
      return this.isActive("LTD_LTDE");
    if (key === "BAJA30_SALDOMORA")
      return this.isActive("BAJA30") || this.isActive("MORA");
    if (key === "BAJA30" || key === "MORA")
      return this.isActive("BAJA30_SALDOMORA");
    return false;
  }
  // extrae {TOKENS} del textarea normalizados (MORA -> SALDO_MORA)
  extractTokens() {
    const tpl = this.form.controls.plantillaTexto.value ?? "";
    const ks = (tpl.match(VAR_PATTERN) || []).map((m) => this.mapVar(m.slice(1, -1)));
    return new Set(ks);
  }
  // sincroniza chips/sets con el contenido del textarea
  syncChipsWithText() {
    const tokens = this.extractTokens();
    this.tokensInText.set(tokens);
    for (const k of Array.from(this.selectedChips)) {
      const norm = this.mapVar(k);
      const affects = this.affectsMap.get(norm) ?? true;
      if (affects && !tokens.has(norm)) {
        this.selectedChips.delete(k);
        this.selects.delete(k === "MORA" ? "SALDO_MORA" : k);
      }
    }
  }
  // “activo” si está seleccionado o si el token existe en el texto
  isActive(key) {
    return this.selectedChips.has(key) || this.tokensInText().has(this.mapVar(key));
  }
  // devuelve el meta del chip
  chipMeta(key) {
    for (const g of this.chipGroups) {
      const f = g.items.find((i) => i.key === key);
      if (f)
        return f;
    }
    return void 0;
  }
  affectsSelects(key) {
    return this.chipMeta(key)?.affectsSelects !== false;
  }
  /** Mantiene chips y selects en sincronía con lo que realmente hay escrito en el textarea */
  syncChipsWithTemplate() {
    const tpl = this.form.controls.plantillaTexto.value ?? "";
    const tokens = /* @__PURE__ */ new Set();
    for (const m of tpl.matchAll(VAR_PATTERN_I))
      tokens.add(String(m[1]).toUpperCase());
    if (tokens.has("SALDO_MORA"))
      tokens.add("MORA");
    if (tokens.has("MORA"))
      tokens.add("SALDO_MORA");
    this.tokensInText.set(new Set(tokens));
    const want = (k) => tokens.has(k.toUpperCase());
    const activate = (k) => {
      if (!this.selectedChips.has(k)) {
        this.selectedChips.add(k);
        if (this.affectsSelects(k))
          this.selects.add(k === "MORA" ? "SALDO_MORA" : k);
      }
    };
    const deactivate = (k) => {
      if (this.selectedChips.has(k)) {
        this.selectedChips.delete(k);
        if (this.affectsSelects(k))
          this.selects.delete(k === "MORA" ? "SALDO_MORA" : k);
      }
    };
    if (want("BAJA30_SALDOMORA")) {
      activate("BAJA30_SALDOMORA");
      deactivate("BAJA30");
      deactivate("MORA");
    } else {
      deactivate("BAJA30_SALDOMORA");
      want("BAJA30") ? activate("BAJA30") : deactivate("BAJA30");
      want("MORA") ? activate("MORA") : deactivate("MORA");
    }
    if (want("LTD_LTDE")) {
      activate("LTD_LTDE");
      deactivate("LTD");
      deactivate("LTDE");
    } else {
      deactivate("LTD_LTDE");
      want("LTD") ? activate("LTD") : deactivate("LTD");
      want("LTDE") ? activate("LTDE") : deactivate("LTDE");
    }
    const alreadyHandled = /* @__PURE__ */ new Set(["BAJA30", "MORA", "BAJA30_SALDOMORA", "LTD", "LTDE", "LTD_LTDE"]);
    for (const g of this.chipGroups) {
      for (const c of g.items) {
        if (alreadyHandled.has(c.key))
          continue;
        want(c.key) ? activate(c.key) : deactivate(c.key);
      }
    }
    if (!this.hasTopUpSelect())
      this.form.controls.importeExtra.setValue(0);
  }
  generarGuiado() {
    const template = (this.form.controls.plantillaTexto.value ?? "").trim();
    if (!template) {
      this.alert("Ingresa un texto de SMS antes de generar.", "Falta texto");
      return;
    }
    const raw = this.buildBody(false);
    const query = this.compactQuery(raw);
    const tokens = Array.from(this.extractTokens());
    const textVars = tokens.filter((t) => this.affectsMap.get(t));
    query.selects = Array.from(/* @__PURE__ */ new Set([...query.selects || [], ...textVars]));
    const candidatas = [
      "BAJA30",
      "SALDO_MORA",
      "BAJA30_SALDOMORA",
      "LTD",
      "LTDE",
      "LTD_LTDE",
      "PKM",
      "CAPITAL"
    ];
    const loadingDlg = this.matDialog.open(LoadingDialogComponent, {
      disableClose: true,
      data: { title: "Preparando cohorte\u2026", subtitle: "Calculando variables candidatas" },
      panelClass: "loading-dialog-panel",
      width: "320px",
      autoFocus: false
    });
    this.api.previewInit(query, template, candidatas).subscribe({
      next: (init) => {
        loadingDlg.close();
        this.matDialog.open(RoundWizardDialogComponent, {
          width: "820px",
          data: { sessionId: init.sessionId, init, template },
          disableClose: false
        });
      },
      error: (err) => {
        loadingDlg.close();
        const msg = err?.error?.message || err?.message || "No se pudo iniciar el guiado.";
        this.alert(msg, "Error");
      }
    });
  }
  triggerPreview() {
    const base = this.currentQueryForPreview();
    const h = this.hash(base);
    if (h === this.lastHash() && this.sampleRow())
      return;
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
  // Cambiar modo
  setMode(m) {
    this.previewMode.set(m);
    if (m === "auto")
      this.triggerPreview();
  }
  // Hash estable del “query” que afecta la fila de muestra
  hash(q) {
    const key = {
      tramo: q.tramo,
      selects: [...q.selects || []].sort(),
      condiciones: [...q.condiciones || []].sort(),
      restricciones: q.restricciones,
      importeExtra: q.importeExtra ?? null
    };
    return JSON.stringify(key);
  }
  // Construye el body para la PREVIEW (incluye tokens/aliases como ya hacías)
  currentQueryForPreview() {
    const base = this.buildBody(true);
    const tpl = this.form.controls.plantillaTexto.value ?? "";
    const needed = Array.from(new Set((tpl.match(VAR_PATTERN) || []).map((m) => this.mapVar(m.slice(1, -1)))));
    base.selects = Array.from(/* @__PURE__ */ new Set([...base.selects || [], ...needed]));
    base.selects = Array.from(/* @__PURE__ */ new Set([...base.selects || [], ...this.expandWithAliases(base.selects || [])]));
    return base;
  }
};
_DynQueryPageComponent.\u0275fac = function DynQueryPageComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _DynQueryPageComponent)();
};
_DynQueryPageComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _DynQueryPageComponent, selectors: [["app-dyn-query-page"]], viewQuery: function DynQueryPageComponent_Query(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275viewQuery(_c02, 5);
  }
  if (rf & 2) {
    let _t;
    \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.tplArea = _t.first);
  }
}, decls: 136, vars: 15, consts: [["tplArea", ""], ["singleMode", ""], [1, "container"], [1, "header"], [1, "page-title"], [1, "layout"], [1, "main-card"], [1, "dynamic-form", 3, "formGroup"], [1, "form-field"], [1, "form-label"], ["formControlName", "tramo", 1, "form-select"], ["value", "3"], ["value", "5"], ["value", "CONTACTO_TOTAL"], [1, "section-title"], [1, "material-icons"], [1, "chip-groups"], [4, "ngFor", "ngForOf"], ["class", "form-field", 4, "ngIf"], ["type", "button", 1, "btn", "btn-secondary", 3, "click"], ["class", "range-item", 3, "formGroup", 4, "ngFor", "ngForOf"], [1, "checkbox-group"], [1, "checkbox-item"], [1, "checkbox"], ["type", "checkbox", 3, "change"], [1, "checkmark"], ["type", "checkbox", "formControlName", "noContenido"], ["type", "checkbox", "formControlName", "excluirPromesasPeriodoActual"], ["type", "checkbox", "formControlName", "excluirCompromisos"], ["type", "checkbox", "formControlName", "excluirBlacklist"], ["type", "text", "formControlName", "nombre", "placeholder", "Nombre del combo/plantilla", 1, "form-input"], [1, "form-label", "label-with-count"], ["formControlName", "plantillaTexto", "placeholder", "Escribe el mensaje y usa las variables", 1, "form-textarea"], ["class", "results-card", 4, "ngIf"], [1, "aside-card"], [1, "preview-controls"], [1, "mode-label"], ["aria-label", "Cambiar modo de previsualizaci\xF3n", 1, "switch"], ["type", "checkbox", 3, "change", "checked"], [1, "slider"], [1, "preview-header"], [1, "preview-title"], ["type", "button", 1, "btn", "btn-small", "btn-ghost", 3, "click", "disabled"], [1, "preview-box"], [1, "character-meter"], [1, "character-bar"], [1, "character-count"], [1, "hint"], [1, "button-group"], ["type", "button", 1, "btn", "btn-primary", 3, "click"], ["type", "button", 1, "btn", "btn-danger", 3, "click"], [1, "chip-group", 3, "ngClass"], [1, "chip-group-title"], [1, "chip-container"], ["type", "button", "class", "chip", 3, "active", "disabled", "click", 4, "ngFor", "ngForOf"], ["type", "button", 1, "chip", 3, "click", "disabled"], ["type", "number", "min", "0", "step", "1", "formControlName", "importeExtra", "placeholder", "0", 1, "form-input"], [1, "range-item", 3, "formGroup"], ["class", "interval-mode", 4, "ngIf", "ngIfElse"], ["class", "hint error-inline", 4, "ngIf"], [1, "interval-mode"], [1, "interval-header"], ["formControlName", "field", "title", "Campo", 1, "form-select", "slim", "interval-field"], [3, "value", 4, "ngFor", "ngForOf"], ["type", "button", 1, "btn", "btn-danger", "btn-small", 3, "click"], [1, "interval-expression"], ["type", "number", "formControlName", "min", "placeholder", "m\xEDn", 1, "form-input", "slim", "interval-input"], [1, "interval-check"], ["type", "checkbox", "formControlName", "inclusiveMin"], [1, "interval-symbol"], [1, "interval-variable"], ["type", "checkbox", "formControlName", "inclusiveMax"], ["type", "number", "formControlName", "max", "placeholder", "m\xE1x", 1, "form-input", "slim", "interval-input"], [1, "interval-footer"], [1, "tiny-check"], ["type", "checkbox", "checked", "", 3, "change"], [3, "value"], [1, "range-row"], ["formControlName", "field", "title", "Campo", 1, "form-select", "slim", "col-field"], ["title", "Operador", 1, "form-select", "slim", "col-op", 3, "change", "value"], ["value", "gt"], ["value", "lt"], [1, "value-box", "col-value"], [3, "ngSwitch"], [4, "ngSwitchCase"], ["type", "button", 1, "btn", "btn-danger", "btn-small", "col-del", 3, "click"], [1, "hint", 2, "margin", "8px 0 0 0"], [4, "ngIf"], ["type", "number", "formControlName", "min", "placeholder", "valor m\xEDnimo", 1, "form-input", "slim"], ["type", "number", "formControlName", "max", "placeholder", "valor m\xE1ximo", 1, "form-input", "slim"], [1, "hint", "error-inline"], [1, "results-card"], [1, "table-container"], ["mat-table", "", 1, "data-table", 3, "dataSource"], [3, "matColumnDef", 4, "ngFor", "ngForOf"], ["mat-header-row", "", 4, "matHeaderRowDef"], ["mat-row", "", 4, "matRowDef", "matRowDefColumns"], [3, "matColumnDef"], ["mat-header-cell", "", 4, "matHeaderCellDef"], ["mat-cell", "", 4, "matCellDef"], ["mat-header-cell", ""], ["mat-cell", ""], ["mat-header-row", ""], ["mat-row", ""]], template: function DynQueryPageComponent_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 2)(1, "div", 3)(2, "h1", 4);
    \u0275\u0275text(3, "Consulta Din\xE1mica");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "div", 5)(5, "div", 6)(6, "form", 7)(7, "div", 8)(8, "label", 9);
    \u0275\u0275text(9, "Tramo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "select", 10)(11, "option", 11);
    \u0275\u0275text(12, "Tramo 3");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "option", 12);
    \u0275\u0275text(14, "Tramo 5");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "option", 13);
    \u0275\u0275text(16, "Cartera Propia");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(17, "h2", 14)(18, "span", 15);
    \u0275\u0275text(19, "tune");
    \u0275\u0275elementEnd();
    \u0275\u0275text(20, " Variables ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "div", 16);
    \u0275\u0275template(22, DynQueryPageComponent_ng_container_22_Template, 6, 3, "ng-container", 17);
    \u0275\u0275elementEnd();
    \u0275\u0275template(23, DynQueryPageComponent_div_23_Template, 4, 0, "div", 18);
    \u0275\u0275elementStart(24, "h2", 14)(25, "span", 15);
    \u0275\u0275text(26, "filter_alt");
    \u0275\u0275elementEnd();
    \u0275\u0275text(27, " Rangos ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "div", 8)(29, "button", 19);
    \u0275\u0275listener("click", function DynQueryPageComponent_Template_button_click_29_listener() {
      \u0275\u0275restoreView(_r1);
      return \u0275\u0275resetView(ctx.addRange());
    });
    \u0275\u0275elementStart(30, "span", 15);
    \u0275\u0275text(31, "add");
    \u0275\u0275elementEnd();
    \u0275\u0275text(32, " A\xF1adir rango ");
    \u0275\u0275elementEnd()();
    \u0275\u0275template(33, DynQueryPageComponent_div_33_Template, 5, 4, "div", 20);
    \u0275\u0275elementStart(34, "h2", 14)(35, "span", 15);
    \u0275\u0275text(36, "rule");
    \u0275\u0275elementEnd();
    \u0275\u0275text(37, " Condiciones ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(38, "div", 21)(39, "label", 22)(40, "div", 23)(41, "input", 24);
    \u0275\u0275listener("change", function DynQueryPageComponent_Template_input_change_41_listener($event) {
      \u0275\u0275restoreView(_r1);
      return \u0275\u0275resetView(ctx.toggleCond($event, "PROMESAS_HOY"));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275element(42, "span", 25);
    \u0275\u0275elementEnd();
    \u0275\u0275text(43, " PROMESAS HOY ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(44, "label", 22)(45, "div", 23)(46, "input", 24);
    \u0275\u0275listener("change", function DynQueryPageComponent_Template_input_change_46_listener($event) {
      \u0275\u0275restoreView(_r1);
      return \u0275\u0275resetView(ctx.toggleCond($event, "PROMESAS_MANANA"));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275element(47, "span", 25);
    \u0275\u0275elementEnd();
    \u0275\u0275text(48, " PROMESAS MA\xD1ANA ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(49, "label", 22)(50, "div", 23)(51, "input", 24);
    \u0275\u0275listener("change", function DynQueryPageComponent_Template_input_change_51_listener($event) {
      \u0275\u0275restoreView(_r1);
      return \u0275\u0275resetView(ctx.toggleCond($event, "PROMESAS_MANANA2"));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275element(52, "span", 25);
    \u0275\u0275elementEnd();
    \u0275\u0275text(53, " PROMESAS HOY Y MA\xD1ANA ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(54, "label", 22)(55, "div", 23)(56, "input", 24);
    \u0275\u0275listener("change", function DynQueryPageComponent_Template_input_change_56_listener($event) {
      \u0275\u0275restoreView(_r1);
      return \u0275\u0275resetView(ctx.toggleCond($event, "PROMESAS_ROTAS"));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275element(57, "span", 25);
    \u0275\u0275elementEnd();
    \u0275\u0275text(58, " PROMESAS ROTAS ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(59, "h2", 14)(60, "span", 15);
    \u0275\u0275text(61, "block");
    \u0275\u0275elementEnd();
    \u0275\u0275text(62, " Restricciones ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(63, "div", 21)(64, "label", 22)(65, "div", 23);
    \u0275\u0275element(66, "input", 26)(67, "span", 25);
    \u0275\u0275elementEnd();
    \u0275\u0275text(68, " No Contenido ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(69, "label", 22)(70, "div", 23);
    \u0275\u0275element(71, "input", 27)(72, "span", 25);
    \u0275\u0275elementEnd();
    \u0275\u0275text(73, " Excluir Promesas periodo actual ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(74, "label", 22)(75, "div", 23);
    \u0275\u0275element(76, "input", 28)(77, "span", 25);
    \u0275\u0275elementEnd();
    \u0275\u0275text(78, " Excluir Compromisos ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(79, "label", 22)(80, "div", 23);
    \u0275\u0275element(81, "input", 29)(82, "span", 25);
    \u0275\u0275elementEnd();
    \u0275\u0275text(83, " Excluir Blacklist ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(84, "h2", 14)(85, "span", 15);
    \u0275\u0275text(86, "description");
    \u0275\u0275elementEnd();
    \u0275\u0275text(87, " Plantilla ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(88, "div", 8)(89, "label", 9);
    \u0275\u0275text(90, "Nombre");
    \u0275\u0275elementEnd();
    \u0275\u0275element(91, "input", 30);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(92, "div", 8)(93, "label", 31)(94, "span");
    \u0275\u0275text(95, "Texto de SMS");
    \u0275\u0275elementEnd()();
    \u0275\u0275element(96, "textarea", 32, 0);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(98, DynQueryPageComponent_div_98_Template, 10, 4, "div", 33);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(99, "aside", 34)(100, "div", 35)(101, "span", 36);
    \u0275\u0275text(102, "Manual");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(103, "label", 37)(104, "input", 38);
    \u0275\u0275listener("change", function DynQueryPageComponent_Template_input_change_104_listener($event) {
      \u0275\u0275restoreView(_r1);
      return \u0275\u0275resetView(ctx.setMode($event.target.checked ? "auto" : "manual"));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275element(105, "span", 39);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(106, "span", 36);
    \u0275\u0275text(107, "Auto");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(108, "div", 40)(109, "h3", 41)(110, "span", 15);
    \u0275\u0275text(111, "preview");
    \u0275\u0275elementEnd();
    \u0275\u0275text(112, " Previsualizaci\xF3n ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(113, "button", 42);
    \u0275\u0275listener("click", function DynQueryPageComponent_Template_button_click_113_listener() {
      \u0275\u0275restoreView(_r1);
      return \u0275\u0275resetView(ctx.refreshPreview());
    });
    \u0275\u0275text(114, " Actualizar ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(115, "div", 43);
    \u0275\u0275text(116);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(117, "div", 44);
    \u0275\u0275element(118, "div", 45);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(119, "div", 46);
    \u0275\u0275text(120);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(121, "p", 47);
    \u0275\u0275text(122, " \u{1F4A1} Consejo: mant\xE9n el mensaje bajo 160 caracteres o usa variables cortas. ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(123, "div", 48)(124, "button", 49);
    \u0275\u0275listener("click", function DynQueryPageComponent_Template_button_click_124_listener() {
      \u0275\u0275restoreView(_r1);
      return \u0275\u0275resetView(ctx.generarGuiado());
    });
    \u0275\u0275elementStart(125, "span", 15);
    \u0275\u0275text(126, "send");
    \u0275\u0275elementEnd();
    \u0275\u0275text(127, " Generar ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(128, "button", 19);
    \u0275\u0275listener("click", function DynQueryPageComponent_Template_button_click_128_listener() {
      \u0275\u0275restoreView(_r1);
      return \u0275\u0275resetView(ctx.guardarCombo());
    });
    \u0275\u0275elementStart(129, "span", 15);
    \u0275\u0275text(130, "save");
    \u0275\u0275elementEnd();
    \u0275\u0275text(131, " Guardar ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(132, "button", 50);
    \u0275\u0275listener("click", function DynQueryPageComponent_Template_button_click_132_listener() {
      \u0275\u0275restoreView(_r1);
      return \u0275\u0275resetView(ctx.Cancel());
    });
    \u0275\u0275elementStart(133, "span", 15);
    \u0275\u0275text(134, "cancel");
    \u0275\u0275elementEnd();
    \u0275\u0275text(135, " Cancelar ");
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    \u0275\u0275advance(6);
    \u0275\u0275property("formGroup", ctx.form);
    \u0275\u0275advance(16);
    \u0275\u0275property("ngForOf", ctx.chipGroups);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.selectedChips.has("LTD") || ctx.selectedChips.has("LTDE") || ctx.selectedChips.has("LTD_LTDE"));
    \u0275\u0275advance(10);
    \u0275\u0275property("ngForOf", ctx.rangosFA.controls);
    \u0275\u0275advance(65);
    \u0275\u0275property("ngIf", ctx.rows().length);
    \u0275\u0275advance(6);
    \u0275\u0275property("checked", ctx.previewMode() === "auto");
    \u0275\u0275advance(9);
    \u0275\u0275property("disabled", ctx.previewMode() !== "manual" || ctx.loadingPreview());
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", ctx.previewText() || "Tu SMS aparecer\xE1 aqu\xED\u2026", " ");
    \u0275\u0275advance(2);
    \u0275\u0275styleProp("width", ctx.Math.min(ctx.previewText().length / 160 * 100, 100), "%");
    \u0275\u0275classProp("warning", ctx.previewText().length > 120)("danger", ctx.previewText().length > 160);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx.previewText().length, " / 160 ");
  }
}, dependencies: [
  CommonModule,
  NgClass,
  NgForOf,
  NgIf,
  NgSwitch,
  NgSwitchCase,
  ReactiveFormsModule,
  \u0275NgNoValidate,
  NgSelectOption,
  \u0275NgSelectMultipleOption,
  DefaultValueAccessor,
  NumberValueAccessor,
  CheckboxControlValueAccessor,
  SelectControlValueAccessor,
  NgControlStatus,
  NgControlStatusGroup,
  MinValidator,
  FormGroupDirective,
  FormControlName,
  MatButtonModule,
  MatCheckboxModule,
  MatSelectModule,
  MatTableModule,
  MatTable,
  MatHeaderCellDef,
  MatHeaderRowDef,
  MatColumnDef,
  MatCellDef,
  MatRowDef,
  MatHeaderCell,
  MatCell,
  MatHeaderRow,
  MatRow
], styles: ['\n\n.container[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #f5f7fa 0%,\n      #c3cfe2 100%);\n  min-height: 100vh;\n  color: #2c3e50;\n  max-width: 1800px;\n  margin: 0 auto;\n  padding: 20px;\n}\n.header[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #3b82f6 0%,\n      #2563eb 100%);\n  color: white;\n  padding: 24px;\n  border-radius: 12px;\n  margin-bottom: 24px;\n  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);\n  margin-top: 0;\n}\n.page-title[_ngcontent-%COMP%] {\n  font-size: 28px;\n  font-weight: 600;\n  margin: 0;\n}\n.layout[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 1fr 400px;\n  gap: 24px;\n  align-items: start;\n}\n.main-card[_ngcontent-%COMP%] {\n  background: white;\n  border-radius: 16px;\n  padding: 24px;\n  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);\n  -webkit-backdrop-filter: blur(20px);\n  backdrop-filter: blur(20px);\n}\n.aside-card[_ngcontent-%COMP%] {\n  background: white;\n  border-radius: 16px;\n  padding: 24px;\n  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);\n  position: sticky;\n  top: 20px;\n}\n.section-title[_ngcontent-%COMP%] {\n  font-size: 18px;\n  font-weight: 600;\n  color: #2c3e50;\n  margin: 44px 0 16px 0;\n  display: flex;\n  align-items: center;\n  gap: 8px;\n}\n.section-title[_ngcontent-%COMP%]:first-child {\n  margin-top: 0;\n}\n.section-title[_ngcontent-%COMP%]::before {\n  content: "";\n  width: 4px;\n  height: 20px;\n  background:\n    linear-gradient(\n      135deg,\n      #3b82f6 0%,\n      #2563eb 100%);\n  border-radius: 2px;\n}\n.form-field[_ngcontent-%COMP%] {\n  margin-bottom: 20px;\n}\n.form-label[_ngcontent-%COMP%] {\n  display: block;\n  font-weight: 500;\n  color: #374151;\n  margin-top: 25px;\n  margin-bottom: 8px;\n  font-size: 14px;\n}\n.form-select[_ngcontent-%COMP%], \n.form-input[_ngcontent-%COMP%], \n.form-textarea[_ngcontent-%COMP%] {\n  width: 100%;\n  padding: 12px 16px;\n  border: 2px solid #e5e7eb;\n  border-radius: 12px;\n  font-size: 14px;\n  transition: all 0.3s ease;\n  background: white;\n}\n.form-select[_ngcontent-%COMP%]:focus, \n.form-input[_ngcontent-%COMP%]:focus, \n.form-textarea[_ngcontent-%COMP%]:focus {\n  outline: none;\n  border-color: #3b82f6;\n  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);\n}\n.form-textarea[_ngcontent-%COMP%] {\n  resize: vertical;\n  min-height: 120px;\n}\n.grid-2[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 16px;\n}\n.chip-container[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 8px;\n  flex-wrap: wrap;\n}\n.chip[_ngcontent-%COMP%] {\n  padding: 8px 16px;\n  background: #f3f4f6;\n  border: 2px solid #e5e7eb;\n  border-radius: 20px;\n  font-size: 13px;\n  font-weight: 500;\n  cursor: pointer;\n  transition: all 0.3s ease;\n  color: #6b7280;\n  margin-right: 8px;\n}\n.chip[_ngcontent-%COMP%]:hover {\n  background: #e5e7eb;\n  transform: translateY(-1px);\n}\n.chip.active[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #3b82f6 0%,\n      #2563eb 100%);\n  border-color: #3b82f6;\n  color: white;\n  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);\n}\n.checkbox-group[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 16px;\n}\n.checkbox-item[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  cursor: pointer;\n  font-size: 14px;\n  color: #374151;\n}\n.checkbox[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  border: 2px solid #d1d5db;\n  border-radius: 4px;\n  position: relative;\n  cursor: pointer;\n  transition: all 0.3s ease;\n}\n.checkbox[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  opacity: 0;\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  cursor: pointer;\n}\n.checkbox[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:checked    + .checkmark[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #3b82f6 0%,\n      #2563eb 100%);\n  border-color: #3b82f6;\n}\n.checkmark[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  border-radius: 4px;\n  transition: all 0.3s ease;\n}\n.checkmark[_ngcontent-%COMP%]::after {\n  content: "";\n  position: absolute;\n  display: none;\n  left: 5px;\n  top: 2px;\n  width: 4px;\n  height: 8px;\n  border: solid white;\n  border-width: 0 2px 2px 0;\n  transform: rotate(45deg);\n}\n.checkbox[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:checked    + .checkmark[_ngcontent-%COMP%]::after {\n  display: block;\n}\n.preview-title[_ngcontent-%COMP%] {\n  font-size: 16px;\n  font-weight: 600;\n  color: #2c3e50;\n  margin-bottom: 16px;\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  margin-top: 10px;\n}\n.preview-box[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #2c3e50 0%,\n      #34495e 100%);\n  color: white;\n  padding: 16px;\n  border-radius: 12px;\n  min-height: 100px;\n  margin-bottom: 16px;\n  font-family: monospace;\n  font-size: 14px;\n  line-height: 1.5;\n}\n.character-meter[_ngcontent-%COMP%] {\n  background: #f3f4f6;\n  height: 8px;\n  border-radius: 4px;\n  overflow: hidden;\n  margin-bottom: 8px;\n}\n.character-bar[_ngcontent-%COMP%] {\n  height: 100%;\n  background:\n    linear-gradient(\n      90deg,\n      #10b981 0%,\n      #059669 100%);\n  transition: all 0.3s ease;\n  border-radius: 4px;\n}\n.character-bar.warning[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      90deg,\n      #f59e0b 0%,\n      #d97706 100%);\n}\n.character-bar.danger[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      90deg,\n      #ef4444 0%,\n      #dc2626 100%);\n}\n.character-count[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: #6b7280;\n  text-align: right;\n}\n.hint[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: #6b7280;\n  margin-bottom: 16px;\n}\n.button-group[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 12px;\n  flex-direction: column;\n}\n.btn[_ngcontent-%COMP%] {\n  padding: 12px 24px;\n  border: none;\n  border-radius: 12px;\n  font-size: 14px;\n  font-weight: 500;\n  cursor: pointer;\n  transition: all 0.3s ease;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n}\n.btn-primary[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #3b82f6 0%,\n      #2563eb 100%);\n  color: white;\n  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);\n}\n.btn-primary[_ngcontent-%COMP%]:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4);\n}\n.btn-secondary[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #3b82f6 0%,\n      #2563eb 100%);\n  color: white;\n  box-shadow: 0 4px 16px rgba(139, 92, 246, 0.3);\n}\n.btn-secondary[_ngcontent-%COMP%]:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 8px 24px rgba(139, 92, 246, 0.4);\n}\n.btn-danger[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #ef4444 0%,\n      #dc2626 100%);\n  color: white;\n  box-shadow: 0 4px 16px rgba(239, 68, 68, 0.3);\n}\n.btn-danger[_ngcontent-%COMP%]:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 8px 24px rgba(239, 68, 68, 0.4);\n}\n.results-card[_ngcontent-%COMP%] {\n  background: white;\n  border-radius: 16px;\n  padding: 24px;\n  margin-top: 24px;\n  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);\n}\n.table-container[_ngcontent-%COMP%] {\n  overflow-x: auto;\n  border-radius: 12px;\n  border: 1px solid #e5e7eb;\n}\n.data-table[_ngcontent-%COMP%] {\n  width: 100%;\n  border-collapse: collapse;\n}\n.data-table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #f8fafc 0%,\n      #e2e8f0 100%);\n  padding: 12px 16px;\n  text-align: left;\n  font-weight: 600;\n  color: #374151;\n  border-bottom: 2px solid #e5e7eb;\n}\n.data-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  padding: 12px 16px;\n  border-bottom: 1px solid #f3f4f6;\n  color: #6b7280;\n}\n.data-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:hover {\n  background: #f8fafc;\n}\n.label-with-count[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n.count-badge[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #3b82f6 0%,\n      #2563eb 100%);\n  color: white;\n  padding: 2px 8px;\n  border-radius: 12px;\n  font-size: 11px;\n  font-weight: 500;\n}\n@media (max-width: 1024px) {\n  .layout[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n    gap: 20px;\n  }\n  .aside-card[_ngcontent-%COMP%] {\n    position: static;\n  }\n}\n@media (max-width: 768px) {\n  .container[_ngcontent-%COMP%] {\n    padding: 12px;\n  }\n  .grid-2[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .checkbox-group[_ngcontent-%COMP%] {\n    flex-direction: column;\n    gap: 12px;\n  }\n}\n.chip-groups[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n}\n.chip-group[_ngcontent-%COMP%] {\n  --group-accent: #374151;\n  --group-bg: rgba(0,0,0,0.03);\n  --group-border: rgba(0,0,0,0.08);\n  --label-col: 90px;\n  border: 1px solid var(--group-border);\n  border-radius: 12px;\n  padding: 12px;\n  display: grid;\n  grid-template-columns: var(--label-col) 1fr;\n  column-gap: 12px;\n  row-gap: 6px;\n  align-items: center;\n}\n.chip-group-title[_ngcontent-%COMP%] {\n  grid-column: 1;\n  font-weight: 600;\n  font-size: 0.95rem;\n  color: var(--group-accent);\n  opacity: .9;\n  margin: 0;\n  padding: 2px 0 0 0;\n}\n.chip-container[_ngcontent-%COMP%] {\n  grid-column: 2;\n  margin: 0;\n}\n.chip-group--cliente[_ngcontent-%COMP%] {\n  --group-accent: #364278;\n  --group-bg: rgba(102, 126, 234, 0.06);\n  --group-border: rgba(102, 126, 234, 0.18);\n}\n.chip-group--financiero[_ngcontent-%COMP%] {\n  --group-accent: #3a4785;\n  --group-bg: rgba(102, 126, 234, 0.06);\n  --group-border: rgba(102, 126, 234, 0.18);\n}\n.chip-group--fechas[_ngcontent-%COMP%] {\n  --group-accent: #4563a1;\n  --group-bg: rgba(102, 126, 234, 0.06);\n  --group-border: rgba(102, 126, 234, 0.18);\n}\n.chip-group--cliente[_ngcontent-%COMP%]   .chip[_ngcontent-%COMP%], \n.chip-group--financiero[_ngcontent-%COMP%]   .chip[_ngcontent-%COMP%], \n.chip-group--fechas[_ngcontent-%COMP%]   .chip[_ngcontent-%COMP%] {\n  background: rgba(255, 255, 255, 0.6);\n  border-color: var(--group-border);\n}\n.chip-group--cliente[_ngcontent-%COMP%]   .chip[_ngcontent-%COMP%]:hover, \n.chip-group--financiero[_ngcontent-%COMP%]   .chip[_ngcontent-%COMP%]:hover, \n.chip-group--fechas[_ngcontent-%COMP%]   .chip[_ngcontent-%COMP%]:hover {\n  background: rgba(255, 255, 255, 0.9);\n  box-shadow: 0 2px 10px var(--group-border);\n}\n.chip-group--cliente[_ngcontent-%COMP%] {\n  --group-accent: #3b82f6;\n  --group-accent-2: #1d4ed8;\n}\n.chip-group--financiero[_ngcontent-%COMP%] {\n  --group-accent: #3b82f6;\n  --group-accent-2: #1d4ed8;\n}\n.chip-group--fechas[_ngcontent-%COMP%] {\n  --group-accent: #3b82f6;\n  --group-accent-2: #1d4ed8;\n}\n.chip-group[_ngcontent-%COMP%]   .chip.active[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      var(--group-accent, #2563eb) 0%,\n      var(--group-accent-2, #2563eb) 100%);\n  border-color: var(--group-accent, #3b82f6);\n  color: #fff;\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);\n}\n.chip[disabled][_ngcontent-%COMP%] {\n  opacity: 0.45;\n  cursor: not-allowed;\n  pointer-events: none;\n}\n.switch[_ngcontent-%COMP%] {\n  font-size: 1rem;\n  position: relative;\n  display: inline-block;\n  width: 4em;\n  height: 2em;\n}\n.switch[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  opacity: 0;\n  width: 0;\n  height: 0;\n}\n.slider[_ngcontent-%COMP%] {\n  position: absolute;\n  cursor: pointer;\n  inset: 0;\n  background-color: #eee;\n  transition: 0.4s;\n  border-radius: 0.5em;\n  box-shadow: 0 0.2em #dfd9d9;\n}\n.slider[_ngcontent-%COMP%]:before {\n  position: absolute;\n  content: "";\n  height: 1.5em;\n  width: 1.4em;\n  border-radius: 0.3em;\n  left: 0.3em;\n  bottom: 0.7em;\n  background-color: #5d6ebc;\n  transition: 0.4s;\n  box-shadow: 0 0.4em #b4b8bc;\n}\n.slider[_ngcontent-%COMP%]:hover::before {\n  box-shadow: 0 0.2em #b4b7bc;\n  bottom: 0.5em;\n}\ninput[_ngcontent-%COMP%]:checked    + .slider[_ngcontent-%COMP%]:before {\n  transform: translateX(2em);\n  background: #282e61;\n}\n.preview-controls[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  margin-bottom: 12px;\n  flex-wrap: wrap;\n}\n.preview-controls[_ngcontent-%COMP%]   .mode-label[_ngcontent-%COMP%] {\n  font-size: 13px;\n  color: #374151;\n}\n.btn-small[_ngcontent-%COMP%] {\n  padding: 8px 12px;\n  font-size: 12px;\n  border-radius: 10px;\n  line-height: 1;\n}\n.btn-inline[_ngcontent-%COMP%] {\n  margin-left: 8px;\n}\n.badge[_ngcontent-%COMP%] {\n  background: #eef2ff;\n  color: #374151;\n  border: 1px solid #dbeafe;\n  padding: 4px 8px;\n  border-radius: 999px;\n  font-size: 12px;\n}\n.switch[_ngcontent-%COMP%] {\n  vertical-align: middle;\n}\n.preview-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 12px;\n  margin-top: 30px;\n  margin-bottom: 12px;\n}\n.btn-ghost[_ngcontent-%COMP%] {\n  background: #eef2ff;\n  color: #374151;\n  border: 1px solid #dbeafe;\n}\n.btn-ghost[_ngcontent-%COMP%]:hover {\n  filter: brightness(0.98);\n  transform: translateY(-1px);\n}\n.preview-controls[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: flex-end;\n  gap: 12px;\n  margin-bottom: 8px;\n  flex-wrap: wrap;\n}\n.preview-controls[_ngcontent-%COMP%]   .mode-label[_ngcontent-%COMP%] {\n  font-size: 13px;\n  color: #374151;\n}\n.btn[_ngcontent-%COMP%]:disabled, \n.btn[disabled][_ngcontent-%COMP%], \n.btn-ghost[_ngcontent-%COMP%]:disabled, \n.btn-ghost[disabled][_ngcontent-%COMP%], \n.btn.is-disabled[_ngcontent-%COMP%], \n.btn-ghost.is-disabled[_ngcontent-%COMP%] {\n  opacity: 0.5;\n  cursor: not-allowed;\n  pointer-events: none;\n  box-shadow: none;\n  transform: none;\n  filter: grayscale(0.2) saturate(0.6);\n}\n.range-item[_ngcontent-%COMP%] {\n  background: #fafafa;\n  border: 1px solid #e5e7eb;\n  border-radius: 12px;\n  padding: 12px;\n  margin-bottom: 12px;\n  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.02) inset;\n}\n.interval-mode[_ngcontent-%COMP%] {\n  background: #f8fafc;\n  border: 2px solid #e2e8f0;\n  border-radius: 12px;\n  padding: 16px;\n}\n.interval-header[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 16px;\n  gap: 12px;\n}\n.interval-header[_ngcontent-%COMP%]   .interval-field[_ngcontent-%COMP%] {\n  flex: 1;\n  max-width: 300px;\n}\n.interval-expression[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 16px;\n  padding: 20px 16px;\n  background: white;\n  border-radius: 10px;\n  border: 2px solid #e2e8f0;\n  flex-wrap: wrap;\n}\n.interval-input[_ngcontent-%COMP%] {\n  width: 130px !important;\n  height: 42px !important;\n  text-align: center;\n  font-weight: 600;\n  font-size: 16px;\n  border: 2px solid #cbd5e1 !important;\n}\n.interval-input[_ngcontent-%COMP%]:focus {\n  border-color: #3b82f6 !important;\n}\n.interval-check[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 6px;\n  cursor: pointer;\n}\n.interval-check[_ngcontent-%COMP%]   input[type=checkbox][_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  cursor: pointer;\n}\n.interval-symbol[_ngcontent-%COMP%] {\n  font-size: 28px;\n  font-weight: 700;\n  color: #475569;\n  line-height: 1;\n  -webkit-user-select: none;\n  user-select: none;\n}\n.interval-variable[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #3b82f6 0%,\n      #2563eb 100%);\n  color: white;\n  padding: 12px 24px;\n  border-radius: 24px;\n  font-weight: 700;\n  font-size: 16px;\n  min-width: 140px;\n  text-align: center;\n  box-shadow: 0 4px 14px rgba(102, 126, 234, 0.35);\n  white-space: nowrap;\n}\n.interval-footer[_ngcontent-%COMP%] {\n  margin-top: 12px;\n  padding-top: 12px;\n  border-top: 1px solid #e2e8f0;\n  text-align: center;\n}\n.interval-footer[_ngcontent-%COMP%]   .tiny-check[_ngcontent-%COMP%] {\n  font-size: 13px;\n  color: #64748b;\n}\n.range-row[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 240px 80px 1fr max-content;\n  gap: 12px;\n  align-items: center;\n}\n.col-field[_ngcontent-%COMP%] {\n  grid-column: 1;\n}\n.col-op[_ngcontent-%COMP%] {\n  grid-column: 2;\n}\n.col-value[_ngcontent-%COMP%] {\n  grid-column: 3;\n}\n.col-del[_ngcontent-%COMP%] {\n  grid-column: 4;\n  justify-self: end;\n}\n.range-row[_ngcontent-%COMP%]   .value-box[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 10px;\n}\n.range-row[_ngcontent-%COMP%]   .form-input.slim[_ngcontent-%COMP%] {\n  width: 180px;\n}\n.form-select.slim[_ngcontent-%COMP%], \n.form-input.slim[_ngcontent-%COMP%] {\n  height: 36px;\n  padding: 6px 10px;\n  border: 2px solid #e5e7eb;\n  border-radius: 10px;\n  background: #fff;\n  font-size: 14px;\n  transition: all 0.2s ease;\n}\n.tiny-check[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  font-size: 12px;\n  color: #6b7280;\n  cursor: pointer;\n}\n.tiny-check[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  transform: translateY(1px);\n}\n.error-inline[_ngcontent-%COMP%] {\n  color: #ef4444;\n  font-weight: 500;\n  margin-top: 8px;\n}\n@media (max-width: 900px) {\n  .interval-expression[_ngcontent-%COMP%] {\n    gap: 12px;\n    padding: 16px 12px;\n  }\n  .interval-input[_ngcontent-%COMP%] {\n    width: 110px !important;\n  }\n  .interval-variable[_ngcontent-%COMP%] {\n    min-width: 120px;\n    font-size: 15px;\n    padding: 10px 20px;\n  }\n  .interval-symbol[_ngcontent-%COMP%] {\n    font-size: 24px;\n  }\n}\n@media (max-width: 700px) {\n  .interval-expression[_ngcontent-%COMP%] {\n    flex-direction: column;\n    gap: 10px;\n    padding: 16px;\n  }\n  .interval-input[_ngcontent-%COMP%] {\n    width: 100% !important;\n    max-width: 200px;\n  }\n  .interval-variable[_ngcontent-%COMP%] {\n    width: 100%;\n    max-width: 200px;\n  }\n  .range-row[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n    gap: 12px;\n  }\n  .range-row[_ngcontent-%COMP%]   .btn-small[_ngcontent-%COMP%] {\n    justify-self: stretch;\n  }\n}\n.dark[_nghost-%COMP%]   .container[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .container[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #0f172a 0%,\n      #1e293b 100%);\n  color: #f8fafc;\n}\n.dark[_nghost-%COMP%]   .header[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .header[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #3b4a9c 0%,\n      #4f2f7a 100%);\n  box-shadow: 0 4px 20px rgba(59, 73, 156, 0.4);\n}\n.dark[_nghost-%COMP%]   .main-card[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .main-card[_ngcontent-%COMP%], \n.dark[_nghost-%COMP%]   .aside-card[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .aside-card[_ngcontent-%COMP%], \n.dark[_nghost-%COMP%]   .results-card[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .results-card[_ngcontent-%COMP%] {\n  background: #1e293b;\n  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);\n}\n.dark[_nghost-%COMP%]   .section-title[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .section-title[_ngcontent-%COMP%] {\n  color: #f8fafc;\n}\n.dark[_nghost-%COMP%]   .form-label[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .form-label[_ngcontent-%COMP%] {\n  color: #cbd5e1;\n}\n.dark[_nghost-%COMP%]   .form-select[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .form-select[_ngcontent-%COMP%], \n.dark[_nghost-%COMP%]   .form-input[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .form-input[_ngcontent-%COMP%], \n.dark[_nghost-%COMP%]   .form-textarea[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .form-textarea[_ngcontent-%COMP%] {\n  background: #0f172a;\n  border-color: #334155;\n  color: #f8fafc;\n}\n.dark[_nghost-%COMP%]   .form-select[_ngcontent-%COMP%]:focus, .dark   [_nghost-%COMP%]   .form-select[_ngcontent-%COMP%]:focus, \n.dark[_nghost-%COMP%]   .form-input[_ngcontent-%COMP%]:focus, .dark   [_nghost-%COMP%]   .form-input[_ngcontent-%COMP%]:focus, \n.dark[_nghost-%COMP%]   .form-textarea[_ngcontent-%COMP%]:focus, .dark   [_nghost-%COMP%]   .form-textarea[_ngcontent-%COMP%]:focus {\n  border-color: #3b82f6;\n  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);\n}\n.dark[_nghost-%COMP%]   .chip[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .chip[_ngcontent-%COMP%] {\n  background: #0f172a;\n  border-color: #334155;\n  color: #94a3b8;\n}\n.dark[_nghost-%COMP%]   .chip[_ngcontent-%COMP%]:hover, .dark   [_nghost-%COMP%]   .chip[_ngcontent-%COMP%]:hover {\n  background: #1e293b;\n}\n.dark[_nghost-%COMP%]   .checkbox-item[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .checkbox-item[_ngcontent-%COMP%] {\n  color: #cbd5e1;\n}\n.dark[_nghost-%COMP%]   .checkbox[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .checkbox[_ngcontent-%COMP%] {\n  border-color: #475569;\n}\n.dark[_nghost-%COMP%]   .preview-title[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .preview-title[_ngcontent-%COMP%] {\n  color: #f8fafc;\n}\n.dark[_nghost-%COMP%]   .character-meter[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .character-meter[_ngcontent-%COMP%] {\n  background: #334155;\n}\n.dark[_nghost-%COMP%]   .character-count[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .character-count[_ngcontent-%COMP%] {\n  color: #94a3b8;\n}\n.dark[_nghost-%COMP%]   .hint[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .hint[_ngcontent-%COMP%] {\n  color: #94a3b8;\n}\n.dark[_nghost-%COMP%]   .table-container[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .table-container[_ngcontent-%COMP%] {\n  border-color: #334155;\n}\n.dark[_nghost-%COMP%]   .data-table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .data-table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #1e293b 0%,\n      #334155 100%);\n  color: #f8fafc;\n  border-bottom-color: #475569;\n}\n.dark[_nghost-%COMP%]   .data-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .data-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  border-bottom-color: #334155;\n  color: #94a3b8;\n}\n.dark[_nghost-%COMP%]   .data-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:hover, .dark   [_nghost-%COMP%]   .data-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:hover {\n  background: #0f172a;\n}\n.dark[_nghost-%COMP%]   .chip-group[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .chip-group[_ngcontent-%COMP%] {\n  --group-bg: rgba(255, 255, 255, 0.03);\n  --group-border: rgba(255, 255, 255, 0.08);\n  border-color: #334155;\n}\n.dark[_nghost-%COMP%]   .chip-group-title[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .chip-group-title[_ngcontent-%COMP%] {\n  color: #cbd5e1;\n}\n.dark[_nghost-%COMP%]   .chip-group--cliente[_ngcontent-%COMP%]   .chip[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .chip-group--cliente[_ngcontent-%COMP%]   .chip[_ngcontent-%COMP%], \n.dark[_nghost-%COMP%]   .chip-group--financiero[_ngcontent-%COMP%]   .chip[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .chip-group--financiero[_ngcontent-%COMP%]   .chip[_ngcontent-%COMP%], \n.dark[_nghost-%COMP%]   .chip-group--fechas[_ngcontent-%COMP%]   .chip[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .chip-group--fechas[_ngcontent-%COMP%]   .chip[_ngcontent-%COMP%] {\n  background: rgba(15, 23, 42, 0.8);\n  border-color: #334155;\n}\n.dark[_nghost-%COMP%]   .chip-group--cliente[_ngcontent-%COMP%]   .chip[_ngcontent-%COMP%]:hover, .dark   [_nghost-%COMP%]   .chip-group--cliente[_ngcontent-%COMP%]   .chip[_ngcontent-%COMP%]:hover, \n.dark[_nghost-%COMP%]   .chip-group--financiero[_ngcontent-%COMP%]   .chip[_ngcontent-%COMP%]:hover, .dark   [_nghost-%COMP%]   .chip-group--financiero[_ngcontent-%COMP%]   .chip[_ngcontent-%COMP%]:hover, \n.dark[_nghost-%COMP%]   .chip-group--fechas[_ngcontent-%COMP%]   .chip[_ngcontent-%COMP%]:hover, .dark   [_nghost-%COMP%]   .chip-group--fechas[_ngcontent-%COMP%]   .chip[_ngcontent-%COMP%]:hover {\n  background: rgba(30, 41, 59, 0.9);\n  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);\n}\n.dark[_nghost-%COMP%]   .slider[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .slider[_ngcontent-%COMP%] {\n  background-color: #334155;\n  box-shadow: 0 0.2em #1e293b;\n}\n.dark[_nghost-%COMP%]   .slider[_ngcontent-%COMP%]:before, .dark   [_nghost-%COMP%]   .slider[_ngcontent-%COMP%]:before {\n  background-color: #3b82f6;\n  box-shadow: 0 0.4em #475569;\n}\n.dark[_nghost-%COMP%]   .preview-controls[_ngcontent-%COMP%]   .mode-label[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .preview-controls[_ngcontent-%COMP%]   .mode-label[_ngcontent-%COMP%] {\n  color: #cbd5e1;\n}\n.dark[_nghost-%COMP%]   .badge[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .badge[_ngcontent-%COMP%] {\n  background: #1e293b;\n  color: #cbd5e1;\n  border-color: #334155;\n}\n.dark[_nghost-%COMP%]   .btn-ghost[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .btn-ghost[_ngcontent-%COMP%] {\n  background: #1e293b;\n  color: #cbd5e1;\n  border-color: #334155;\n}\n.dark[_nghost-%COMP%]   .btn-ghost[_ngcontent-%COMP%]:hover, .dark   [_nghost-%COMP%]   .btn-ghost[_ngcontent-%COMP%]:hover {\n  background: #334155;\n}\n.dark[_nghost-%COMP%]   .range-item[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .range-item[_ngcontent-%COMP%] {\n  background: #0f172a;\n  border-color: #334155;\n}\n.dark[_nghost-%COMP%]   .interval-mode[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .interval-mode[_ngcontent-%COMP%] {\n  background: #1e293b;\n  border-color: #334155;\n}\n.dark[_nghost-%COMP%]   .interval-expression[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .interval-expression[_ngcontent-%COMP%] {\n  background: #0f172a;\n  border-color: #334155;\n}\n.dark[_nghost-%COMP%]   .interval-input[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .interval-input[_ngcontent-%COMP%] {\n  background: #1e293b !important;\n  border-color: #475569 !important;\n  color: #f8fafc;\n}\n.dark[_nghost-%COMP%]   .interval-input[_ngcontent-%COMP%]:focus, .dark   [_nghost-%COMP%]   .interval-input[_ngcontent-%COMP%]:focus {\n  border-color: #3b82f6 !important;\n}\n.dark[_nghost-%COMP%]   .interval-symbol[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .interval-symbol[_ngcontent-%COMP%] {\n  color: #94a3b8;\n}\n.dark[_nghost-%COMP%]   .interval-footer[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .interval-footer[_ngcontent-%COMP%] {\n  border-top-color: #334155;\n}\n.dark[_nghost-%COMP%]   .tiny-check[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .tiny-check[_ngcontent-%COMP%] {\n  color: #94a3b8;\n}\n.dark[_nghost-%COMP%]   .form-select.slim[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .form-select.slim[_ngcontent-%COMP%], \n.dark[_nghost-%COMP%]   .form-input.slim[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .form-input.slim[_ngcontent-%COMP%] {\n  background: #0f172a;\n  border-color: #334155;\n  color: #f8fafc;\n}\n/*# sourceMappingURL=dyn-query-page.component.css.map */'] });
var DynQueryPageComponent = _DynQueryPageComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DynQueryPageComponent, [{
    type: Component,
    args: [{ selector: "app-dyn-query-page", standalone: true, imports: [
      CommonModule,
      ReactiveFormsModule,
      MatButtonModule,
      MatCheckboxModule,
      MatSelectModule,
      MatTableModule
    ], template: `<div class="container">\r
  <!-- Header -->\r
  <div class="header">\r
    <h1 class="page-title">Consulta Din\xE1mica</h1>\r
  </div>\r
\r
  <div class="layout">\r
    <!-- Main Form -->\r
    <div class="main-card">\r
      <form [formGroup]="form" class="dynamic-form">\r
        <!-- Tramo Section -->\r
        <div class="form-field">\r
          <label class="form-label">Tramo</label>\r
          <select formControlName="tramo" class="form-select">\r
            <option value="3">Tramo 3</option>\r
            <option value="5">Tramo 5</option>\r
            <option value="CONTACTO_TOTAL">Cartera Propia</option>  <!-- \u2190 A\xD1ADIR ESTA L\xCDNEA -->\r
          </select>\r
        </div>\r
\r
        <!-- Variables Section -->\r
        <h2 class="section-title">\r
          <span class="material-icons">tune</span>\r
          Variables\r
        </h2>\r
\r
        <div class="chip-groups">\r
          <ng-container *ngFor="let g of chipGroups">\r
            <!-- \u2B07\uFE0F wrapper con clase por grupo -->\r
            <div class="chip-group" [ngClass]="'chip-group--' + g.key">\r
              <h3 class="chip-group-title">{{ g.title }}</h3>\r
\r
              <div class="chip-container">\r
                <button\r
                  *ngFor="let c of g.items"\r
                  type="button"\r
                  class="chip"\r
                  [class.active]="isActive(c.key)"\r
                (click)="toggleChip(c.key, c.affectsSelects !== false)"\r
                [attr.aria-pressed]="isActive(c.key)"\r
                [disabled]="isChipDisabled(c.key)"\r
                >\r
                {{ c.label }}\r
                </button>\r
              </div>\r
            </div>\r
          </ng-container>\r
        </div>\r
\r
\r
        <!-- Importe Extra -->\r
        <div *ngIf="selectedChips.has('LTD') || selectedChips.has('LTDE') || selectedChips.has('LTD_LTDE')" class="form-field">\r
          <label class="form-label">Sumar importe</label>\r
          <input type="number" min="0" step="1" class="form-input" formControlName="importeExtra" placeholder="0">\r
        </div>\r
\r
        <!-- Rangos Section -->\r
        <h2 class="section-title">\r
          <span class="material-icons">filter_alt</span>\r
          Rangos\r
        </h2>\r
\r
        <div class="form-field">\r
          <button type="button" class="btn btn-secondary" (click)="addRange()">\r
            <span class="material-icons">add</span>\r
            A\xF1adir rango\r
          </button>\r
        </div>\r
\r
        <div class="range-item"\r
             *ngFor="let rg of rangosFA.controls; let i = index"\r
             [formGroup]="$any(rg)">\r
\r
          <!-- Modo intervalo: cuando ambos l\xEDmites est\xE1n activos -->\r
          <div *ngIf="$any(rg).get('useMin')?.value && $any(rg).get('useMax')?.value; else singleMode"\r
               class="interval-mode">\r
\r
            <div class="interval-header">\r
              <select class="form-select slim interval-field" formControlName="field" title="Campo">\r
                <option *ngFor="let f of rangeFields" [value]="f.key">{{ f.label }}</option>\r
              </select>\r
\r
              <button type="button" class="btn btn-danger btn-small" (click)="removeRange(i)">\r
                <span class="material-icons">delete</span>\r
                Borrar\r
              </button>\r
            </div>\r
\r
            <div class="interval-expression">\r
              <!-- MIN -->\r
              <input type="number" class="form-input slim interval-input" formControlName="min" placeholder="m\xEDn">\r
\r
              <!-- S\xEDmbolo < o \u2264 con checkbox -->\r
              <label class="interval-check">\r
                <input type="checkbox" formControlName="inclusiveMin">\r
                <span class="interval-symbol">{{ $any(rg).get('inclusiveMin')?.value ? '\u2264' : '<' }}</span>\r
              </label>\r
\r
              <!-- VARIABLE -->\r
              <div class="interval-variable">\r
                {{ fieldLabel($any(rg).get('field')?.value) || 'Variable' }}\r
              </div>\r
\r
              <!-- S\xEDmbolo < o \u2264 con checkbox -->\r
              <label class="interval-check">\r
                <input type="checkbox" formControlName="inclusiveMax">\r
                <span class="interval-symbol">{{ $any(rg).get('inclusiveMax')?.value ? '\u2264' : '<' }}</span>\r
              </label>\r
\r
              <!-- MAX -->\r
              <input type="number" class="form-input slim interval-input" formControlName="max" placeholder="m\xE1x">\r
            </div>\r
\r
            <!-- Checkbox para desactivar intervalo -->\r
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
          <!-- Modo simple: un solo l\xEDmite -->\r
          <ng-template #singleMode>\r
            <div class="range-row">\r
              <!-- 1) Campo -->\r
              <select class="form-select slim col-field" formControlName="field" title="Campo">\r
                <option *ngFor="let f of rangeFields" [value]="f.key">{{ f.label }}</option>\r
              </select>\r
\r
              <!-- 2) Operador -->\r
              <select class="form-select slim col-op"\r
                      [value]="$any(rg).get('mode')?.value"\r
                      (change)="changeOperator(i, $any($event.target).value)"\r
                      title="Operador">\r
                <option value="gt">&gt;</option>\r
                <option value="lt">&lt;</option>\r
              </select>\r
\r
              <!-- 3) Valor \xFAnico -->\r
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
              <!-- 4) Borrar -->\r
              <button type="button" class="btn btn-danger btn-small col-del" (click)="removeRange(i)">\r
                <span class="material-icons">delete</span>\r
                Borrar\r
              </button>\r
            </div>\r
\r
            <!-- Checkbox para activar el segundo l\xEDmite -->\r
            <div class="hint" style="margin:8px 0 0 0;">\r
              <label class="tiny-check">\r
                <ng-container *ngIf="$any(rg).get('mode')?.value === 'gt'">\r
                  <input type="checkbox"\r
                         [checked]="$any(rg).get('useMax')?.value"\r
                         (change)="toggleUseMax(i, $any($event.target).checked)">\r
                  <span>a\xF1adir l\xEDmite superior</span>\r
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
          <!-- Error de orden -->\r
          <div *ngIf="$any(rg).errors?.['rangeOrder']" class="hint error-inline">\r
            \u26A0\uFE0F El valor m\xEDnimo no puede ser mayor que el m\xE1ximo.\r
          </div>\r
        </div>\r
\r
\r
\r
        <!-- Condiciones Section -->\r
        <h2 class="section-title">\r
          <span class="material-icons">rule</span>\r
          Condiciones\r
        </h2>\r
        <div class="checkbox-group">\r
          <label class="checkbox-item">\r
            <div class="checkbox">\r
              <input type="checkbox" (change)="toggleCond($event,'PROMESAS_HOY')">\r
              <span class="checkmark"></span>\r
            </div>\r
            PROMESAS HOY\r
          </label>\r
          <label class="checkbox-item">\r
            <div class="checkbox">\r
              <input type="checkbox" (change)="toggleCond($event,'PROMESAS_MANANA')">\r
              <span class="checkmark"></span>\r
            </div>\r
            PROMESAS MA\xD1ANA\r
          </label>\r
          <label class="checkbox-item">\r
            <div class="checkbox">\r
              <input type="checkbox" (change)="toggleCond($event,'PROMESAS_MANANA2')">\r
              <span class="checkmark"></span>\r
            </div>\r
            PROMESAS HOY Y MA\xD1ANA\r
          </label>\r
          <label class="checkbox-item">\r
            <div class="checkbox">\r
              <input type="checkbox" (change)="toggleCond($event,'PROMESAS_ROTAS')">\r
              <span class="checkmark"></span>\r
            </div>\r
            PROMESAS ROTAS\r
          </label>\r
        </div>\r
\r
        <!-- Restricciones Section -->\r
        <h2 class="section-title">\r
          <span class="material-icons">block</span>\r
          Restricciones\r
        </h2>\r
        <div class="checkbox-group">\r
          <label class="checkbox-item">\r
            <div class="checkbox">\r
              <input type="checkbox" formControlName="noContenido">\r
              <span class="checkmark"></span>\r
            </div>\r
            No Contenido\r
          </label>\r
          <label class="checkbox-item">\r
            <div class="checkbox">\r
              <input type="checkbox" formControlName="excluirPromesasPeriodoActual">\r
              <span class="checkmark"></span>\r
            </div>\r
            Excluir Promesas periodo actual\r
          </label>\r
          <label class="checkbox-item">\r
            <div class="checkbox">\r
              <input type="checkbox" formControlName="excluirCompromisos">\r
              <span class="checkmark"></span>\r
            </div>\r
            Excluir Compromisos\r
          </label>\r
          <label class="checkbox-item">\r
            <div class="checkbox">\r
              <input type="checkbox" formControlName="excluirBlacklist">\r
              <span class="checkmark"></span>\r
            </div>\r
            Excluir Blacklist\r
          </label>\r
        </div>\r
\r
        <!-- Plantilla Section -->\r
        <h2 class="section-title">\r
          <span class="material-icons">description</span>\r
          Plantilla\r
        </h2>\r
        <div class="form-field">\r
          <label class="form-label">Nombre</label>\r
          <input type="text" class="form-input" formControlName="nombre" placeholder="Nombre del combo/plantilla">\r
        </div>\r
\r
        <div class="form-field">\r
          <label class="form-label label-with-count">\r
            <span>Texto de SMS</span>\r
          </label>\r
          <textarea #tplArea class="form-textarea" formControlName="plantillaTexto" placeholder="Escribe el mensaje y usa las variables"></textarea>\r
        </div>\r
      </form>\r
\r
      <!-- Results Table -->\r
      <div *ngIf="rows().length" class="results-card">\r
        <h2 class="section-title">\r
          <span class="material-icons">table_chart</span>\r
          Resultado\r
        </h2>\r
        <div class="table-container">\r
          <table class="data-table" mat-table [dataSource]="rows()">\r
            <ng-container *ngFor="let c of cols()" [matColumnDef]="c">\r
              <th mat-header-cell *matHeaderCellDef>{{ c }}</th>\r
              <td mat-cell *matCellDef="let r">{{ r[c] }}</td>\r
            </ng-container>\r
            <tr mat-header-row *matHeaderRowDef="cols()"></tr>\r
            <tr mat-row *matRowDef="let row; columns: cols();"></tr>\r
          </table>\r
        </div>\r
      </div>\r
    </div>\r
\r
    <!-- Sidebar -->\r
    <aside class="aside-card">\r
\r
      <!-- Controles de vista previa (toggle a la derecha) -->\r
      <div class="preview-controls">\r
        <span class="mode-label">Manual</span>\r
\r
        <label class="switch" aria-label="Cambiar modo de previsualizaci\xF3n">\r
          <input type="checkbox"\r
                 [checked]="previewMode() === 'auto'"\r
                 (change)="setMode($any($event.target).checked ? 'auto' : 'manual')">\r
          <span class="slider"></span>\r
        </label>\r
\r
        <span class="mode-label">Auto</span>\r
\r
      </div>\r
\r
\r
\r
      <!-- Header de previsualizaci\xF3n con bot\xF3n a la derecha -->\r
      <div class="preview-header">\r
        <h3 class="preview-title">\r
          <span class="material-icons">preview</span>\r
          Previsualizaci\xF3n\r
        </h3>\r
\r
        <button type="button"\r
                class="btn btn-small btn-ghost"\r
                (click)="refreshPreview()"\r
                [disabled]="previewMode() !== 'manual' || loadingPreview()">\r
          Actualizar\r
        </button>\r
      </div>\r
\r
      <div class="preview-box">\r
        {{ previewText() || 'Tu SMS aparecer\xE1 aqu\xED\u2026' }}\r
      </div>\r
\r
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
\r
\r
\r
\r
      <p class="hint">\r
        \u{1F4A1} Consejo: mant\xE9n el mensaje bajo 160 caracteres o usa variables cortas.\r
      </p>\r
\r
      <div class="button-group">\r
        <button type="button" class="btn btn-primary" (click)="generarGuiado()">\r
          <span class="material-icons">send</span>\r
          Generar\r
        </button>\r
        <button type="button" class="btn btn-secondary" (click)="guardarCombo()">\r
          <span class="material-icons">save</span>\r
          Guardar\r
        </button>\r
        <button type="button" class="btn btn-danger" (click)="Cancel()">\r
          <span class="material-icons">cancel</span>\r
          Cancelar\r
        </button>\r
      </div>\r
    </aside>\r
  </div>\r
</div>\r
`, styles: ['/* src/app/features/legacy/SMS_DYNAMIC/pages/dyn-query-page/dyn-query-page.component.css */\n.container {\n  background:\n    linear-gradient(\n      135deg,\n      #f5f7fa 0%,\n      #c3cfe2 100%);\n  min-height: 100vh;\n  color: #2c3e50;\n  max-width: 1800px;\n  margin: 0 auto;\n  padding: 20px;\n}\n.header {\n  background:\n    linear-gradient(\n      135deg,\n      #3b82f6 0%,\n      #2563eb 100%);\n  color: white;\n  padding: 24px;\n  border-radius: 12px;\n  margin-bottom: 24px;\n  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);\n  margin-top: 0;\n}\n.page-title {\n  font-size: 28px;\n  font-weight: 600;\n  margin: 0;\n}\n.layout {\n  display: grid;\n  grid-template-columns: 1fr 400px;\n  gap: 24px;\n  align-items: start;\n}\n.main-card {\n  background: white;\n  border-radius: 16px;\n  padding: 24px;\n  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);\n  -webkit-backdrop-filter: blur(20px);\n  backdrop-filter: blur(20px);\n}\n.aside-card {\n  background: white;\n  border-radius: 16px;\n  padding: 24px;\n  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);\n  position: sticky;\n  top: 20px;\n}\n.section-title {\n  font-size: 18px;\n  font-weight: 600;\n  color: #2c3e50;\n  margin: 44px 0 16px 0;\n  display: flex;\n  align-items: center;\n  gap: 8px;\n}\n.section-title:first-child {\n  margin-top: 0;\n}\n.section-title::before {\n  content: "";\n  width: 4px;\n  height: 20px;\n  background:\n    linear-gradient(\n      135deg,\n      #3b82f6 0%,\n      #2563eb 100%);\n  border-radius: 2px;\n}\n.form-field {\n  margin-bottom: 20px;\n}\n.form-label {\n  display: block;\n  font-weight: 500;\n  color: #374151;\n  margin-top: 25px;\n  margin-bottom: 8px;\n  font-size: 14px;\n}\n.form-select,\n.form-input,\n.form-textarea {\n  width: 100%;\n  padding: 12px 16px;\n  border: 2px solid #e5e7eb;\n  border-radius: 12px;\n  font-size: 14px;\n  transition: all 0.3s ease;\n  background: white;\n}\n.form-select:focus,\n.form-input:focus,\n.form-textarea:focus {\n  outline: none;\n  border-color: #3b82f6;\n  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);\n}\n.form-textarea {\n  resize: vertical;\n  min-height: 120px;\n}\n.grid-2 {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 16px;\n}\n.chip-container {\n  display: flex;\n  gap: 8px;\n  flex-wrap: wrap;\n}\n.chip {\n  padding: 8px 16px;\n  background: #f3f4f6;\n  border: 2px solid #e5e7eb;\n  border-radius: 20px;\n  font-size: 13px;\n  font-weight: 500;\n  cursor: pointer;\n  transition: all 0.3s ease;\n  color: #6b7280;\n  margin-right: 8px;\n}\n.chip:hover {\n  background: #e5e7eb;\n  transform: translateY(-1px);\n}\n.chip.active {\n  background:\n    linear-gradient(\n      135deg,\n      #3b82f6 0%,\n      #2563eb 100%);\n  border-color: #3b82f6;\n  color: white;\n  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);\n}\n.checkbox-group {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 16px;\n}\n.checkbox-item {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  cursor: pointer;\n  font-size: 14px;\n  color: #374151;\n}\n.checkbox {\n  width: 18px;\n  height: 18px;\n  border: 2px solid #d1d5db;\n  border-radius: 4px;\n  position: relative;\n  cursor: pointer;\n  transition: all 0.3s ease;\n}\n.checkbox input {\n  opacity: 0;\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  cursor: pointer;\n}\n.checkbox input:checked + .checkmark {\n  background:\n    linear-gradient(\n      135deg,\n      #3b82f6 0%,\n      #2563eb 100%);\n  border-color: #3b82f6;\n}\n.checkmark {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  border-radius: 4px;\n  transition: all 0.3s ease;\n}\n.checkmark::after {\n  content: "";\n  position: absolute;\n  display: none;\n  left: 5px;\n  top: 2px;\n  width: 4px;\n  height: 8px;\n  border: solid white;\n  border-width: 0 2px 2px 0;\n  transform: rotate(45deg);\n}\n.checkbox input:checked + .checkmark::after {\n  display: block;\n}\n.preview-title {\n  font-size: 16px;\n  font-weight: 600;\n  color: #2c3e50;\n  margin-bottom: 16px;\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  margin-top: 10px;\n}\n.preview-box {\n  background:\n    linear-gradient(\n      135deg,\n      #2c3e50 0%,\n      #34495e 100%);\n  color: white;\n  padding: 16px;\n  border-radius: 12px;\n  min-height: 100px;\n  margin-bottom: 16px;\n  font-family: monospace;\n  font-size: 14px;\n  line-height: 1.5;\n}\n.character-meter {\n  background: #f3f4f6;\n  height: 8px;\n  border-radius: 4px;\n  overflow: hidden;\n  margin-bottom: 8px;\n}\n.character-bar {\n  height: 100%;\n  background:\n    linear-gradient(\n      90deg,\n      #10b981 0%,\n      #059669 100%);\n  transition: all 0.3s ease;\n  border-radius: 4px;\n}\n.character-bar.warning {\n  background:\n    linear-gradient(\n      90deg,\n      #f59e0b 0%,\n      #d97706 100%);\n}\n.character-bar.danger {\n  background:\n    linear-gradient(\n      90deg,\n      #ef4444 0%,\n      #dc2626 100%);\n}\n.character-count {\n  font-size: 12px;\n  color: #6b7280;\n  text-align: right;\n}\n.hint {\n  font-size: 12px;\n  color: #6b7280;\n  margin-bottom: 16px;\n}\n.button-group {\n  display: flex;\n  gap: 12px;\n  flex-direction: column;\n}\n.btn {\n  padding: 12px 24px;\n  border: none;\n  border-radius: 12px;\n  font-size: 14px;\n  font-weight: 500;\n  cursor: pointer;\n  transition: all 0.3s ease;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n}\n.btn-primary {\n  background:\n    linear-gradient(\n      135deg,\n      #3b82f6 0%,\n      #2563eb 100%);\n  color: white;\n  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);\n}\n.btn-primary:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4);\n}\n.btn-secondary {\n  background:\n    linear-gradient(\n      135deg,\n      #3b82f6 0%,\n      #2563eb 100%);\n  color: white;\n  box-shadow: 0 4px 16px rgba(139, 92, 246, 0.3);\n}\n.btn-secondary:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 8px 24px rgba(139, 92, 246, 0.4);\n}\n.btn-danger {\n  background:\n    linear-gradient(\n      135deg,\n      #ef4444 0%,\n      #dc2626 100%);\n  color: white;\n  box-shadow: 0 4px 16px rgba(239, 68, 68, 0.3);\n}\n.btn-danger:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 8px 24px rgba(239, 68, 68, 0.4);\n}\n.results-card {\n  background: white;\n  border-radius: 16px;\n  padding: 24px;\n  margin-top: 24px;\n  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);\n}\n.table-container {\n  overflow-x: auto;\n  border-radius: 12px;\n  border: 1px solid #e5e7eb;\n}\n.data-table {\n  width: 100%;\n  border-collapse: collapse;\n}\n.data-table th {\n  background:\n    linear-gradient(\n      135deg,\n      #f8fafc 0%,\n      #e2e8f0 100%);\n  padding: 12px 16px;\n  text-align: left;\n  font-weight: 600;\n  color: #374151;\n  border-bottom: 2px solid #e5e7eb;\n}\n.data-table td {\n  padding: 12px 16px;\n  border-bottom: 1px solid #f3f4f6;\n  color: #6b7280;\n}\n.data-table tbody tr:hover {\n  background: #f8fafc;\n}\n.label-with-count {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n.count-badge {\n  background:\n    linear-gradient(\n      135deg,\n      #3b82f6 0%,\n      #2563eb 100%);\n  color: white;\n  padding: 2px 8px;\n  border-radius: 12px;\n  font-size: 11px;\n  font-weight: 500;\n}\n@media (max-width: 1024px) {\n  .layout {\n    grid-template-columns: 1fr;\n    gap: 20px;\n  }\n  .aside-card {\n    position: static;\n  }\n}\n@media (max-width: 768px) {\n  .container {\n    padding: 12px;\n  }\n  .grid-2 {\n    grid-template-columns: 1fr;\n  }\n  .checkbox-group {\n    flex-direction: column;\n    gap: 12px;\n  }\n}\n.chip-groups {\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n}\n.chip-group {\n  --group-accent: #374151;\n  --group-bg: rgba(0,0,0,0.03);\n  --group-border: rgba(0,0,0,0.08);\n  --label-col: 90px;\n  border: 1px solid var(--group-border);\n  border-radius: 12px;\n  padding: 12px;\n  display: grid;\n  grid-template-columns: var(--label-col) 1fr;\n  column-gap: 12px;\n  row-gap: 6px;\n  align-items: center;\n}\n.chip-group-title {\n  grid-column: 1;\n  font-weight: 600;\n  font-size: 0.95rem;\n  color: var(--group-accent);\n  opacity: .9;\n  margin: 0;\n  padding: 2px 0 0 0;\n}\n.chip-container {\n  grid-column: 2;\n  margin: 0;\n}\n.chip-group--cliente {\n  --group-accent: #364278;\n  --group-bg: rgba(102, 126, 234, 0.06);\n  --group-border: rgba(102, 126, 234, 0.18);\n}\n.chip-group--financiero {\n  --group-accent: #3a4785;\n  --group-bg: rgba(102, 126, 234, 0.06);\n  --group-border: rgba(102, 126, 234, 0.18);\n}\n.chip-group--fechas {\n  --group-accent: #4563a1;\n  --group-bg: rgba(102, 126, 234, 0.06);\n  --group-border: rgba(102, 126, 234, 0.18);\n}\n.chip-group--cliente .chip,\n.chip-group--financiero .chip,\n.chip-group--fechas .chip {\n  background: rgba(255, 255, 255, 0.6);\n  border-color: var(--group-border);\n}\n.chip-group--cliente .chip:hover,\n.chip-group--financiero .chip:hover,\n.chip-group--fechas .chip:hover {\n  background: rgba(255, 255, 255, 0.9);\n  box-shadow: 0 2px 10px var(--group-border);\n}\n.chip-group--cliente {\n  --group-accent: #3b82f6;\n  --group-accent-2: #1d4ed8;\n}\n.chip-group--financiero {\n  --group-accent: #3b82f6;\n  --group-accent-2: #1d4ed8;\n}\n.chip-group--fechas {\n  --group-accent: #3b82f6;\n  --group-accent-2: #1d4ed8;\n}\n.chip-group .chip.active {\n  background:\n    linear-gradient(\n      135deg,\n      var(--group-accent, #2563eb) 0%,\n      var(--group-accent-2, #2563eb) 100%);\n  border-color: var(--group-accent, #3b82f6);\n  color: #fff;\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);\n}\n.chip[disabled] {\n  opacity: 0.45;\n  cursor: not-allowed;\n  pointer-events: none;\n}\n.switch {\n  font-size: 1rem;\n  position: relative;\n  display: inline-block;\n  width: 4em;\n  height: 2em;\n}\n.switch input {\n  opacity: 0;\n  width: 0;\n  height: 0;\n}\n.slider {\n  position: absolute;\n  cursor: pointer;\n  inset: 0;\n  background-color: #eee;\n  transition: 0.4s;\n  border-radius: 0.5em;\n  box-shadow: 0 0.2em #dfd9d9;\n}\n.slider:before {\n  position: absolute;\n  content: "";\n  height: 1.5em;\n  width: 1.4em;\n  border-radius: 0.3em;\n  left: 0.3em;\n  bottom: 0.7em;\n  background-color: #5d6ebc;\n  transition: 0.4s;\n  box-shadow: 0 0.4em #b4b8bc;\n}\n.slider:hover::before {\n  box-shadow: 0 0.2em #b4b7bc;\n  bottom: 0.5em;\n}\ninput:checked + .slider:before {\n  transform: translateX(2em);\n  background: #282e61;\n}\n.preview-controls {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  margin-bottom: 12px;\n  flex-wrap: wrap;\n}\n.preview-controls .mode-label {\n  font-size: 13px;\n  color: #374151;\n}\n.btn-small {\n  padding: 8px 12px;\n  font-size: 12px;\n  border-radius: 10px;\n  line-height: 1;\n}\n.btn-inline {\n  margin-left: 8px;\n}\n.badge {\n  background: #eef2ff;\n  color: #374151;\n  border: 1px solid #dbeafe;\n  padding: 4px 8px;\n  border-radius: 999px;\n  font-size: 12px;\n}\n.switch {\n  vertical-align: middle;\n}\n.preview-header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 12px;\n  margin-top: 30px;\n  margin-bottom: 12px;\n}\n.btn-ghost {\n  background: #eef2ff;\n  color: #374151;\n  border: 1px solid #dbeafe;\n}\n.btn-ghost:hover {\n  filter: brightness(0.98);\n  transform: translateY(-1px);\n}\n.preview-controls {\n  display: flex;\n  align-items: center;\n  justify-content: flex-end;\n  gap: 12px;\n  margin-bottom: 8px;\n  flex-wrap: wrap;\n}\n.preview-controls .mode-label {\n  font-size: 13px;\n  color: #374151;\n}\n.btn:disabled,\n.btn[disabled],\n.btn-ghost:disabled,\n.btn-ghost[disabled],\n.btn.is-disabled,\n.btn-ghost.is-disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n  pointer-events: none;\n  box-shadow: none;\n  transform: none;\n  filter: grayscale(0.2) saturate(0.6);\n}\n.range-item {\n  background: #fafafa;\n  border: 1px solid #e5e7eb;\n  border-radius: 12px;\n  padding: 12px;\n  margin-bottom: 12px;\n  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.02) inset;\n}\n.interval-mode {\n  background: #f8fafc;\n  border: 2px solid #e2e8f0;\n  border-radius: 12px;\n  padding: 16px;\n}\n.interval-header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 16px;\n  gap: 12px;\n}\n.interval-header .interval-field {\n  flex: 1;\n  max-width: 300px;\n}\n.interval-expression {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 16px;\n  padding: 20px 16px;\n  background: white;\n  border-radius: 10px;\n  border: 2px solid #e2e8f0;\n  flex-wrap: wrap;\n}\n.interval-input {\n  width: 130px !important;\n  height: 42px !important;\n  text-align: center;\n  font-weight: 600;\n  font-size: 16px;\n  border: 2px solid #cbd5e1 !important;\n}\n.interval-input:focus {\n  border-color: #3b82f6 !important;\n}\n.interval-check {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 6px;\n  cursor: pointer;\n}\n.interval-check input[type=checkbox] {\n  width: 16px;\n  height: 16px;\n  cursor: pointer;\n}\n.interval-symbol {\n  font-size: 28px;\n  font-weight: 700;\n  color: #475569;\n  line-height: 1;\n  -webkit-user-select: none;\n  user-select: none;\n}\n.interval-variable {\n  background:\n    linear-gradient(\n      135deg,\n      #3b82f6 0%,\n      #2563eb 100%);\n  color: white;\n  padding: 12px 24px;\n  border-radius: 24px;\n  font-weight: 700;\n  font-size: 16px;\n  min-width: 140px;\n  text-align: center;\n  box-shadow: 0 4px 14px rgba(102, 126, 234, 0.35);\n  white-space: nowrap;\n}\n.interval-footer {\n  margin-top: 12px;\n  padding-top: 12px;\n  border-top: 1px solid #e2e8f0;\n  text-align: center;\n}\n.interval-footer .tiny-check {\n  font-size: 13px;\n  color: #64748b;\n}\n.range-row {\n  display: grid;\n  grid-template-columns: 240px 80px 1fr max-content;\n  gap: 12px;\n  align-items: center;\n}\n.col-field {\n  grid-column: 1;\n}\n.col-op {\n  grid-column: 2;\n}\n.col-value {\n  grid-column: 3;\n}\n.col-del {\n  grid-column: 4;\n  justify-self: end;\n}\n.range-row .value-box {\n  display: inline-flex;\n  align-items: center;\n  gap: 10px;\n}\n.range-row .form-input.slim {\n  width: 180px;\n}\n.form-select.slim,\n.form-input.slim {\n  height: 36px;\n  padding: 6px 10px;\n  border: 2px solid #e5e7eb;\n  border-radius: 10px;\n  background: #fff;\n  font-size: 14px;\n  transition: all 0.2s ease;\n}\n.tiny-check {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  font-size: 12px;\n  color: #6b7280;\n  cursor: pointer;\n}\n.tiny-check input {\n  transform: translateY(1px);\n}\n.error-inline {\n  color: #ef4444;\n  font-weight: 500;\n  margin-top: 8px;\n}\n@media (max-width: 900px) {\n  .interval-expression {\n    gap: 12px;\n    padding: 16px 12px;\n  }\n  .interval-input {\n    width: 110px !important;\n  }\n  .interval-variable {\n    min-width: 120px;\n    font-size: 15px;\n    padding: 10px 20px;\n  }\n  .interval-symbol {\n    font-size: 24px;\n  }\n}\n@media (max-width: 700px) {\n  .interval-expression {\n    flex-direction: column;\n    gap: 10px;\n    padding: 16px;\n  }\n  .interval-input {\n    width: 100% !important;\n    max-width: 200px;\n  }\n  .interval-variable {\n    width: 100%;\n    max-width: 200px;\n  }\n  .range-row {\n    grid-template-columns: 1fr;\n    gap: 12px;\n  }\n  .range-row .btn-small {\n    justify-self: stretch;\n  }\n}\n:host-context(.dark) .container {\n  background:\n    linear-gradient(\n      135deg,\n      #0f172a 0%,\n      #1e293b 100%);\n  color: #f8fafc;\n}\n:host-context(.dark) .header {\n  background:\n    linear-gradient(\n      135deg,\n      #3b4a9c 0%,\n      #4f2f7a 100%);\n  box-shadow: 0 4px 20px rgba(59, 73, 156, 0.4);\n}\n:host-context(.dark) .main-card,\n:host-context(.dark) .aside-card,\n:host-context(.dark) .results-card {\n  background: #1e293b;\n  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);\n}\n:host-context(.dark) .section-title {\n  color: #f8fafc;\n}\n:host-context(.dark) .form-label {\n  color: #cbd5e1;\n}\n:host-context(.dark) .form-select,\n:host-context(.dark) .form-input,\n:host-context(.dark) .form-textarea {\n  background: #0f172a;\n  border-color: #334155;\n  color: #f8fafc;\n}\n:host-context(.dark) .form-select:focus,\n:host-context(.dark) .form-input:focus,\n:host-context(.dark) .form-textarea:focus {\n  border-color: #3b82f6;\n  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);\n}\n:host-context(.dark) .chip {\n  background: #0f172a;\n  border-color: #334155;\n  color: #94a3b8;\n}\n:host-context(.dark) .chip:hover {\n  background: #1e293b;\n}\n:host-context(.dark) .checkbox-item {\n  color: #cbd5e1;\n}\n:host-context(.dark) .checkbox {\n  border-color: #475569;\n}\n:host-context(.dark) .preview-title {\n  color: #f8fafc;\n}\n:host-context(.dark) .character-meter {\n  background: #334155;\n}\n:host-context(.dark) .character-count {\n  color: #94a3b8;\n}\n:host-context(.dark) .hint {\n  color: #94a3b8;\n}\n:host-context(.dark) .table-container {\n  border-color: #334155;\n}\n:host-context(.dark) .data-table th {\n  background:\n    linear-gradient(\n      135deg,\n      #1e293b 0%,\n      #334155 100%);\n  color: #f8fafc;\n  border-bottom-color: #475569;\n}\n:host-context(.dark) .data-table td {\n  border-bottom-color: #334155;\n  color: #94a3b8;\n}\n:host-context(.dark) .data-table tbody tr:hover {\n  background: #0f172a;\n}\n:host-context(.dark) .chip-group {\n  --group-bg: rgba(255, 255, 255, 0.03);\n  --group-border: rgba(255, 255, 255, 0.08);\n  border-color: #334155;\n}\n:host-context(.dark) .chip-group-title {\n  color: #cbd5e1;\n}\n:host-context(.dark) .chip-group--cliente .chip,\n:host-context(.dark) .chip-group--financiero .chip,\n:host-context(.dark) .chip-group--fechas .chip {\n  background: rgba(15, 23, 42, 0.8);\n  border-color: #334155;\n}\n:host-context(.dark) .chip-group--cliente .chip:hover,\n:host-context(.dark) .chip-group--financiero .chip:hover,\n:host-context(.dark) .chip-group--fechas .chip:hover {\n  background: rgba(30, 41, 59, 0.9);\n  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);\n}\n:host-context(.dark) .slider {\n  background-color: #334155;\n  box-shadow: 0 0.2em #1e293b;\n}\n:host-context(.dark) .slider:before {\n  background-color: #3b82f6;\n  box-shadow: 0 0.4em #475569;\n}\n:host-context(.dark) .preview-controls .mode-label {\n  color: #cbd5e1;\n}\n:host-context(.dark) .badge {\n  background: #1e293b;\n  color: #cbd5e1;\n  border-color: #334155;\n}\n:host-context(.dark) .btn-ghost {\n  background: #1e293b;\n  color: #cbd5e1;\n  border-color: #334155;\n}\n:host-context(.dark) .btn-ghost:hover {\n  background: #334155;\n}\n:host-context(.dark) .range-item {\n  background: #0f172a;\n  border-color: #334155;\n}\n:host-context(.dark) .interval-mode {\n  background: #1e293b;\n  border-color: #334155;\n}\n:host-context(.dark) .interval-expression {\n  background: #0f172a;\n  border-color: #334155;\n}\n:host-context(.dark) .interval-input {\n  background: #1e293b !important;\n  border-color: #475569 !important;\n  color: #f8fafc;\n}\n:host-context(.dark) .interval-input:focus {\n  border-color: #3b82f6 !important;\n}\n:host-context(.dark) .interval-symbol {\n  color: #94a3b8;\n}\n:host-context(.dark) .interval-footer {\n  border-top-color: #334155;\n}\n:host-context(.dark) .tiny-check {\n  color: #94a3b8;\n}\n:host-context(.dark) .form-select.slim,\n:host-context(.dark) .form-input.slim {\n  background: #0f172a;\n  border-color: #334155;\n  color: #f8fafc;\n}\n/*# sourceMappingURL=dyn-query-page.component.css.map */\n'] }]
  }], null, { tplArea: [{
    type: ViewChild,
    args: ["tplArea"]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(DynQueryPageComponent, { className: "DynQueryPageComponent", filePath: "src/app/features/legacy/sms_dynamic/pages/dyn-query-page/dyn-query-page.component.ts", lineNumber: 45 });
})();
export {
  DynQueryPageComponent
};
//# sourceMappingURL=chunk-ED4U4TKD.js.map
