import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef,
  MatDialogTitle
} from "./chunk-HBS4YI6H.js";
import "./chunk-CRNFYKBD.js";
import "./chunk-2GCPRO7O.js";
import "./chunk-XG3JRR2G.js";
import {
  MatButton,
  MatButtonModule
} from "./chunk-M2YI7FKS.js";
import "./chunk-Q5NKAKZL.js";
import {
  CustomSelectComponent,
  ToastService
} from "./chunk-2BMIOZPH.js";
import {
  DefaultValueAccessor,
  FormControl,
  FormControlName,
  FormGroup,
  FormGroupDirective,
  MaxLengthValidator,
  NgControlStatus,
  NgControlStatusGroup,
  ReactiveFormsModule,
  Validators,
  ɵNgNoValidate
} from "./chunk-GRJ7XAPD.js";
import {
  LucideAngularComponent,
  LucideAngularModule
} from "./chunk-RFBUEVFE.js";
import {
  environment
} from "./chunk-QF774CZR.js";
import {
  CommonModule,
  Component,
  EventEmitter,
  HttpClient,
  HttpHeaders,
  Inject,
  Injectable,
  Input,
  NgForOf,
  NgIf,
  Output,
  __spreadProps,
  __spreadValues,
  catchError,
  retry,
  setClassMetadata,
  throwError,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵinject,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-CTRHJBBW.js";

// src/app/features/blacklist-main/blacklist/components/blacklist-table/blacklist-table.component.ts
function BlacklistTableComponent_tr_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 10)(2, "div", 11);
    \u0275\u0275element(3, "lucide-angular", 12);
    \u0275\u0275elementStart(4, "span", 13);
    \u0275\u0275text(5, "No hay registros en la blacklist");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    \u0275\u0275advance(3);
    \u0275\u0275property("size", 48);
  }
}
function BlacklistTableComponent_tr_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr", 14)(1, "td", 15);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td", 16);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td", 15);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "td", 15);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "td", 15);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "td", 15);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const row_r1 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(row_r1.empresa);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(row_r1.documento);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(row_r1.email || "-");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(row_r1.telefono || "-");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(row_r1.fechaInicio);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(row_r1.fechaFin);
  }
}
function BlacklistTableComponent_div_21_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 17)(1, "button", 18);
    \u0275\u0275listener("click", function BlacklistTableComponent_div_21_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.previousPage());
    });
    \u0275\u0275element(2, "lucide-angular", 19);
    \u0275\u0275text(3, " Anterior ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 20);
    \u0275\u0275text(5, " P\xE1gina ");
    \u0275\u0275elementStart(6, "span", 21);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275text(8, " de ");
    \u0275\u0275elementStart(9, "span", 21);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "button", 18);
    \u0275\u0275listener("click", function BlacklistTableComponent_div_21_Template_button_click_11_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.nextPage());
    });
    \u0275\u0275text(12, " Siguiente ");
    \u0275\u0275element(13, "lucide-angular", 22);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r2.currentPage === 1);
    \u0275\u0275advance();
    \u0275\u0275property("size", 16);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r2.currentPage);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r2.totalPages);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r2.currentPage === ctx_r2.totalPages);
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 16);
  }
}
var _BlacklistTableComponent = class _BlacklistTableComponent {
  constructor() {
    this.blacklistRows = [];
    this.currentPage = 1;
    this.rowsPerPage = 10;
  }
  get paginatedRows() {
    const startIndex = (this.currentPage - 1) * this.rowsPerPage;
    return this.blacklistRows.slice(startIndex, startIndex + this.rowsPerPage);
  }
  get totalPages() {
    return Math.ceil(this.blacklistRows.length / this.rowsPerPage);
  }
  goToPage(page) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
};
_BlacklistTableComponent.\u0275fac = function BlacklistTableComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _BlacklistTableComponent)();
};
_BlacklistTableComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _BlacklistTableComponent, selectors: [["app-blacklist-table"]], inputs: { blacklistRows: "blacklistRows" }, decls: 22, vars: 3, consts: [[1, "space-y-3"], [1, "overflow-hidden", "rounded-lg", "border", "border-slate-700", "bg-slate-900"], [1, "overflow-x-auto"], [1, "w-full"], [1, "bg-slate-800", "border-b", "border-slate-700"], [1, "px-4", "py-3", "text-left", "text-xs", "font-semibold", "text-slate-300", "uppercase", "tracking-wider"], [1, "divide-y", "divide-slate-700"], [4, "ngIf"], ["class", "hover:bg-slate-800/50 transition-colors", 4, "ngFor", "ngForOf"], ["class", "flex items-center justify-between px-2", 4, "ngIf"], ["colspan", "6", 1, "px-4", "py-12", "text-center"], [1, "flex", "flex-col", "items-center", "gap-2", "text-slate-500"], ["name", "inbox", 3, "size"], [1, "text-sm"], [1, "hover:bg-slate-800/50", "transition-colors"], [1, "px-4", "py-3", "text-sm", "text-slate-200"], [1, "px-4", "py-3", "text-sm", "text-slate-200", "font-mono"], [1, "flex", "items-center", "justify-between", "px-2"], [1, "inline-flex", "items-center", "gap-1.5", "px-3", "py-2", "bg-slate-800", "hover:bg-slate-700", "text-slate-300", "text-sm", "rounded", "border", "border-slate-600", "transition-colors", "disabled:opacity-50", "disabled:cursor-not-allowed", "cursor-pointer", 3, "click", "disabled"], ["name", "chevron-left", 3, "size"], [1, "text-sm", "text-slate-400"], [1, "font-semibold", "text-slate-200"], ["name", "chevron-right", 3, "size"]], template: function BlacklistTableComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "table", 3)(4, "thead", 4)(5, "tr")(6, "th", 5);
    \u0275\u0275text(7, "Empresa");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th", 5);
    \u0275\u0275text(9, "Documento");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th", 5);
    \u0275\u0275text(11, "Email");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th", 5);
    \u0275\u0275text(13, "Tel\xE9fono");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "th", 5);
    \u0275\u0275text(15, "Fecha Inicio");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "th", 5);
    \u0275\u0275text(17, "Fecha Fin");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(18, "tbody", 6);
    \u0275\u0275template(19, BlacklistTableComponent_tr_19_Template, 6, 1, "tr", 7)(20, BlacklistTableComponent_tr_20_Template, 13, 6, "tr", 8);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275template(21, BlacklistTableComponent_div_21_Template, 14, 6, "div", 9);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance(19);
    \u0275\u0275property("ngIf", ctx.blacklistRows.length === 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx.paginatedRows);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.blacklistRows.length > 0);
  }
}, dependencies: [CommonModule, NgForOf, NgIf, LucideAngularModule, LucideAngularComponent], encapsulation: 2 });
var BlacklistTableComponent = _BlacklistTableComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BlacklistTableComponent, [{
    type: Component,
    args: [{ selector: "app-blacklist-table", standalone: true, imports: [CommonModule, LucideAngularModule], template: `<div class="space-y-3">\r
  <!-- Tabla con border radius -->\r
  <div class="overflow-hidden rounded-lg border border-slate-700 bg-slate-900">\r
    <div class="overflow-x-auto">\r
      <table class="w-full">\r
        <thead class="bg-slate-800 border-b border-slate-700">\r
          <tr>\r
            <th class="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Empresa</th>\r
            <th class="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Documento</th>\r
            <th class="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Email</th>\r
            <th class="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Tel\xE9fono</th>\r
            <th class="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Fecha Inicio</th>\r
            <th class="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Fecha Fin</th>\r
          </tr>\r
        </thead>\r
        <tbody class="divide-y divide-slate-700">\r
          <tr *ngIf="blacklistRows.length === 0">\r
            <td colspan="6" class="px-4 py-12 text-center">\r
              <div class="flex flex-col items-center gap-2 text-slate-500">\r
                <lucide-angular name="inbox" [size]="48"></lucide-angular>\r
                <span class="text-sm">No hay registros en la blacklist</span>\r
              </div>\r
            </td>\r
          </tr>\r
          <tr *ngFor="let row of paginatedRows" class="hover:bg-slate-800/50 transition-colors">\r
            <td class="px-4 py-3 text-sm text-slate-200">{{ row.empresa }}</td>\r
            <td class="px-4 py-3 text-sm text-slate-200 font-mono">{{ row.documento }}</td>\r
            <td class="px-4 py-3 text-sm text-slate-200">{{ row.email || '-' }}</td>\r
            <td class="px-4 py-3 text-sm text-slate-200">{{ row.telefono || '-' }}</td>\r
            <td class="px-4 py-3 text-sm text-slate-200">{{ row.fechaInicio }}</td>\r
            <td class="px-4 py-3 text-sm text-slate-200">{{ row.fechaFin }}</td>\r
          </tr>\r
        </tbody>\r
      </table>\r
    </div>\r
  </div>\r
\r
  <!-- Paginaci\xF3n -->\r
  <div *ngIf="blacklistRows.length > 0" class="flex items-center justify-between px-2">\r
    <button\r
      class="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm rounded border border-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"\r
      (click)="previousPage()"\r
      [disabled]="currentPage === 1">\r
      <lucide-angular name="chevron-left" [size]="16"></lucide-angular>\r
      Anterior\r
    </button>\r
\r
    <span class="text-sm text-slate-400">\r
      P\xE1gina <span class="font-semibold text-slate-200">{{ currentPage }}</span> de <span class="font-semibold text-slate-200">{{ totalPages }}</span>\r
    </span>\r
\r
    <button\r
      class="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm rounded border border-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"\r
      (click)="nextPage()"\r
      [disabled]="currentPage === totalPages">\r
      Siguiente\r
      <lucide-angular name="chevron-right" [size]="16"></lucide-angular>\r
    </button>\r
  </div>\r
</div>\r
` }]
  }], null, { blacklistRows: [{
    type: Input
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(BlacklistTableComponent, { className: "BlacklistTableComponent", filePath: "src/app/features/blacklist-main/blacklist/components/blacklist-table/blacklist-table.component.ts", lineNumber: 13 });
})();

// src/app/features/blacklist-main/blacklist/services/blacklist-service/blacklist.service.ts
var _BlacklistMainService = class _BlacklistMainService {
  constructor(http) {
    this.http = http;
    this.baseUrl = environment.webServiceUrl + "/blacklist";
    this.templateCanEdit = false;
    this.httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    };
  }
  handleError(error) {
    let errorMessage = "Ocurri\xF3 un error desconocido.";
    if (typeof error.error === "string") {
      errorMessage = error.error;
    } else if (error.error && error.error.message) {
      errorMessage = error.error.message;
    }
    console.error(`C\xF3digo de error: ${error.status}, mensaje: ${errorMessage}`);
    return throwError(() => ({ status: error.status, message: errorMessage }));
  }
  handleErrorGet(error) {
    if (typeof ErrorEvent !== "undefined" && error.error instanceof ErrorEvent) {
      console.log(`An error occurred ${error.status}, body was: ${error.error.message}`);
    } else {
      console.log(`Backend returned code ${error.status}, body was: ${error.error.message}`);
    }
    return throwError(() => ({ status: error.status, message: error.error.message }));
  }
  insertBlacklist(blacklist) {
    return this.http.post(this.baseUrl, blacklist, __spreadProps(__spreadValues({}, this.httpOptions), { responseType: "text" })).pipe(catchError(this.handleError));
  }
  getAllBlacklist() {
    return this.http.get(this.baseUrl + "/all", this.httpOptions).pipe(retry(2), catchError(this.handleErrorGet));
  }
  getEntidadByDocumento(documento) {
    return this.http.get(this.baseUrl + "/entidad/" + documento, { responseType: "text" }).pipe(catchError(this.handleError));
  }
};
_BlacklistMainService.\u0275fac = function BlacklistMainService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _BlacklistMainService)(\u0275\u0275inject(HttpClient));
};
_BlacklistMainService.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _BlacklistMainService, factory: _BlacklistMainService.\u0275fac, providedIn: "root" });
var BlacklistMainService = _BlacklistMainService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BlacklistMainService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{ type: HttpClient }], null);
})();

// src/app/shared/components/error-modal/error-modal.component.ts
function ErrorModalComponent_p_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 10);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.data.details);
  }
}
var _ErrorModalComponent = class _ErrorModalComponent {
  constructor(dialogRef, data) {
    this.dialogRef = dialogRef;
    this.data = data;
  }
  close() {
    this.dialogRef.close();
  }
};
_ErrorModalComponent.\u0275fac = function ErrorModalComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _ErrorModalComponent)(\u0275\u0275directiveInject(MatDialogRef), \u0275\u0275directiveInject(MAT_DIALOG_DATA));
};
_ErrorModalComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ErrorModalComponent, selectors: [["app-error-modal"]], decls: 14, vars: 5, consts: [[1, "error-modal"], [1, "error-header"], [1, "error-icon-container"], ["name", "alert-circle", 1, "error-icon", 3, "size"], ["mat-dialog-title", ""], [1, "error-message"], ["class", "error-details", 4, "ngIf"], ["align", "end"], ["mat-raised-button", "", "color", "primary", 3, "click"], ["name", "x", 3, "size"], [1, "error-details"]], template: function ErrorModalComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2);
    \u0275\u0275element(3, "lucide-angular", 3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "h2", 4);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "mat-dialog-content")(7, "p", 5);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275template(9, ErrorModalComponent_p_9_Template, 2, 1, "p", 6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "mat-dialog-actions", 7)(11, "button", 8);
    \u0275\u0275listener("click", function ErrorModalComponent_Template_button_click_11_listener() {
      return ctx.close();
    });
    \u0275\u0275element(12, "lucide-angular", 9);
    \u0275\u0275text(13, " Cerrar ");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    \u0275\u0275advance(3);
    \u0275\u0275property("size", 48);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx.data.title || "Error");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx.data.message);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.data.details);
    \u0275\u0275advance(3);
    \u0275\u0275property("size", 18);
  }
}, dependencies: [CommonModule, NgIf, MatDialogModule, MatDialogTitle, MatDialogActions, MatDialogContent, MatButtonModule, MatButton, LucideAngularModule, LucideAngularComponent], styles: ['\n\n.error-modal[_ngcontent-%COMP%] {\n  min-width: 400px;\n  max-width: 500px;\n  padding: 24px;\n  background: white;\n  border-radius: 12px;\n}\n.error-header[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 16px;\n  margin-bottom: 24px;\n  text-align: center;\n}\n.error-icon-container[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 80px;\n  height: 80px;\n  background:\n    linear-gradient(\n      135deg,\n      #ef4444 0%,\n      #dc2626 100%);\n  border-radius: 50%;\n  animation: _ngcontent-%COMP%_pulse 2s ease-in-out infinite;\n}\n@keyframes _ngcontent-%COMP%_pulse {\n  0%, 100% {\n    transform: scale(1);\n    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);\n  }\n  50% {\n    transform: scale(1.05);\n    box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);\n  }\n}\n.error-icon[_ngcontent-%COMP%] {\n  color: white;\n  width: 48px;\n  height: 48px;\n}\nh2[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #1f2937;\n  font-size: 24px;\n  font-weight: 600;\n}\nmat-dialog-content[_ngcontent-%COMP%] {\n  padding: 0 8px;\n  margin-bottom: 24px;\n}\n.error-message[_ngcontent-%COMP%] {\n  font-size: 16px;\n  color: #4b5563;\n  line-height: 1.6;\n  margin: 0 0 12px 0;\n  text-align: center;\n}\n.error-details[_ngcontent-%COMP%] {\n  font-size: 14px;\n  color: #6b7280;\n  background: #f3f4f6;\n  padding: 12px;\n  border-radius: 8px;\n  margin: 0;\n  border-left: 3px solid #ef4444;\n  font-family: "Courier New", monospace;\n  white-space: pre-wrap;\n  word-break: break-word;\n}\nmat-dialog-actions[_ngcontent-%COMP%] {\n  padding: 0;\n  margin: 0;\n  display: flex;\n  justify-content: center;\n}\nbutton[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  padding: 10px 24px;\n  font-size: 14px;\n  font-weight: 500;\n  border-radius: 8px;\n  transition: all 0.3s ease;\n}\nbutton[_ngcontent-%COMP%]:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);\n}\n/*# sourceMappingURL=error-modal.component.css.map */'] });
var ErrorModalComponent = _ErrorModalComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ErrorModalComponent, [{
    type: Component,
    args: [{ selector: "app-error-modal", standalone: true, imports: [
      CommonModule,
      MatDialogModule,
      MatButtonModule,
      LucideAngularModule
    ], template: `
    <div class="error-modal">
      <div class="error-header">
        <div class="error-icon-container">
          <lucide-angular name="alert-circle" [size]="48" class="error-icon"></lucide-angular>
        </div>
        <h2 mat-dialog-title>{{ data.title || 'Error' }}</h2>
      </div>

      <mat-dialog-content>
        <p class="error-message">{{ data.message }}</p>
        <p *ngIf="data.details" class="error-details">{{ data.details }}</p>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-raised-button color="primary" (click)="close()">
          <lucide-angular name="x" [size]="18"></lucide-angular>
          Cerrar
        </button>
      </mat-dialog-actions>
    </div>
  `, styles: ['/* angular:styles/component:css;96a06b8fd58d5e13f5ab0d1e5818b16181e7beef2282659f11a3cd747c9019dd;C:/Users/HP/Documents/Kubito-2.0-v1/cashi-discador-frontend/cashi-discador-frontend/src/app/shared/components/error-modal/error-modal.component.ts */\n.error-modal {\n  min-width: 400px;\n  max-width: 500px;\n  padding: 24px;\n  background: white;\n  border-radius: 12px;\n}\n.error-header {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 16px;\n  margin-bottom: 24px;\n  text-align: center;\n}\n.error-icon-container {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 80px;\n  height: 80px;\n  background:\n    linear-gradient(\n      135deg,\n      #ef4444 0%,\n      #dc2626 100%);\n  border-radius: 50%;\n  animation: pulse 2s ease-in-out infinite;\n}\n@keyframes pulse {\n  0%, 100% {\n    transform: scale(1);\n    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);\n  }\n  50% {\n    transform: scale(1.05);\n    box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);\n  }\n}\n.error-icon {\n  color: white;\n  width: 48px;\n  height: 48px;\n}\nh2 {\n  margin: 0;\n  color: #1f2937;\n  font-size: 24px;\n  font-weight: 600;\n}\nmat-dialog-content {\n  padding: 0 8px;\n  margin-bottom: 24px;\n}\n.error-message {\n  font-size: 16px;\n  color: #4b5563;\n  line-height: 1.6;\n  margin: 0 0 12px 0;\n  text-align: center;\n}\n.error-details {\n  font-size: 14px;\n  color: #6b7280;\n  background: #f3f4f6;\n  padding: 12px;\n  border-radius: 8px;\n  margin: 0;\n  border-left: 3px solid #ef4444;\n  font-family: "Courier New", monospace;\n  white-space: pre-wrap;\n  word-break: break-word;\n}\nmat-dialog-actions {\n  padding: 0;\n  margin: 0;\n  display: flex;\n  justify-content: center;\n}\nbutton {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  padding: 10px 24px;\n  font-size: 14px;\n  font-weight: 500;\n  border-radius: 8px;\n  transition: all 0.3s ease;\n}\nbutton:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);\n}\n/*# sourceMappingURL=error-modal.component.css.map */\n'] }]
  }], () => [{ type: MatDialogRef }, { type: void 0, decorators: [{
    type: Inject,
    args: [MAT_DIALOG_DATA]
  }] }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ErrorModalComponent, { className: "ErrorModalComponent", filePath: "src/app/shared/components/error-modal/error-modal.component.ts", lineNumber: 147 });
})();

// src/app/shared/components/success-modal/success-modal.component.ts
function SuccessModalComponent_p_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 10);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.data.details);
  }
}
var _SuccessModalComponent = class _SuccessModalComponent {
  constructor(dialogRef, data) {
    this.dialogRef = dialogRef;
    this.data = data;
  }
  close() {
    this.dialogRef.close();
  }
};
_SuccessModalComponent.\u0275fac = function SuccessModalComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _SuccessModalComponent)(\u0275\u0275directiveInject(MatDialogRef), \u0275\u0275directiveInject(MAT_DIALOG_DATA));
};
_SuccessModalComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SuccessModalComponent, selectors: [["app-success-modal"]], decls: 14, vars: 5, consts: [[1, "success-modal"], [1, "success-header"], [1, "success-icon-container"], ["name", "check-circle", 1, "success-icon", 3, "size"], ["mat-dialog-title", ""], [1, "success-message"], ["class", "success-details", 4, "ngIf"], ["align", "end"], ["mat-raised-button", "", "color", "primary", 3, "click"], ["name", "check", 3, "size"], [1, "success-details"]], template: function SuccessModalComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2);
    \u0275\u0275element(3, "lucide-angular", 3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "h2", 4);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "mat-dialog-content")(7, "p", 5);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275template(9, SuccessModalComponent_p_9_Template, 2, 1, "p", 6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "mat-dialog-actions", 7)(11, "button", 8);
    \u0275\u0275listener("click", function SuccessModalComponent_Template_button_click_11_listener() {
      return ctx.close();
    });
    \u0275\u0275element(12, "lucide-angular", 9);
    \u0275\u0275text(13, " Entendido ");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    \u0275\u0275advance(3);
    \u0275\u0275property("size", 48);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx.data.title || "\xC9xito");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx.data.message);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.data.details);
    \u0275\u0275advance(3);
    \u0275\u0275property("size", 18);
  }
}, dependencies: [CommonModule, NgIf, MatDialogModule, MatDialogTitle, MatDialogActions, MatDialogContent, MatButtonModule, MatButton, LucideAngularModule, LucideAngularComponent], styles: ["\n\n.success-modal[_ngcontent-%COMP%] {\n  min-width: 400px;\n  max-width: 500px;\n  padding: 24px;\n  background: white;\n  border-radius: 12px;\n}\n.success-header[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 16px;\n  margin-bottom: 24px;\n  text-align: center;\n}\n.success-icon-container[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 80px;\n  height: 80px;\n  background:\n    linear-gradient(\n      135deg,\n      #10b981 0%,\n      #059669 100%);\n  border-radius: 50%;\n  animation: _ngcontent-%COMP%_successPulse 1.5s ease-in-out;\n}\n@keyframes _ngcontent-%COMP%_successPulse {\n  0% {\n    transform: scale(0);\n    opacity: 0;\n  }\n  50% {\n    transform: scale(1.1);\n  }\n  100% {\n    transform: scale(1);\n    opacity: 1;\n  }\n}\n.success-icon[_ngcontent-%COMP%] {\n  color: white;\n  width: 48px;\n  height: 48px;\n}\nh2[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #1f2937;\n  font-size: 24px;\n  font-weight: 600;\n}\nmat-dialog-content[_ngcontent-%COMP%] {\n  padding: 0 8px;\n  margin-bottom: 24px;\n}\n.success-message[_ngcontent-%COMP%] {\n  font-size: 16px;\n  color: #4b5563;\n  line-height: 1.6;\n  margin: 0 0 12px 0;\n  text-align: center;\n}\n.success-details[_ngcontent-%COMP%] {\n  font-size: 14px;\n  color: #6b7280;\n  background: #f0fdf4;\n  padding: 12px;\n  border-radius: 8px;\n  margin: 0;\n  border-left: 3px solid #10b981;\n  text-align: center;\n}\nmat-dialog-actions[_ngcontent-%COMP%] {\n  padding: 0;\n  margin: 0;\n  display: flex;\n  justify-content: center;\n}\nbutton[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  padding: 10px 24px;\n  font-size: 14px;\n  font-weight: 500;\n  border-radius: 8px;\n  transition: all 0.3s ease;\n  background:\n    linear-gradient(\n      135deg,\n      #10b981 0%,\n      #059669 100%) !important;\n}\nbutton[_ngcontent-%COMP%]:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);\n}\n/*# sourceMappingURL=success-modal.component.css.map */"] });
var SuccessModalComponent = _SuccessModalComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SuccessModalComponent, [{
    type: Component,
    args: [{ selector: "app-success-modal", standalone: true, imports: [
      CommonModule,
      MatDialogModule,
      MatButtonModule,
      LucideAngularModule
    ], template: `
    <div class="success-modal">
      <div class="success-header">
        <div class="success-icon-container">
          <lucide-angular name="check-circle" [size]="48" class="success-icon"></lucide-angular>
        </div>
        <h2 mat-dialog-title>{{ data.title || '\xC9xito' }}</h2>
      </div>

      <mat-dialog-content>
        <p class="success-message">{{ data.message }}</p>
        <p *ngIf="data.details" class="success-details">{{ data.details }}</p>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-raised-button color="primary" (click)="close()">
          <lucide-angular name="check" [size]="18"></lucide-angular>
          Entendido
        </button>
      </mat-dialog-actions>
    </div>
  `, styles: ["/* angular:styles/component:css;b2c479fb7b74b64e83fd03785e0905103c661b5aa94cdbe48479f0f4962e666f;C:/Users/HP/Documents/Kubito-2.0-v1/cashi-discador-frontend/cashi-discador-frontend/src/app/shared/components/success-modal/success-modal.component.ts */\n.success-modal {\n  min-width: 400px;\n  max-width: 500px;\n  padding: 24px;\n  background: white;\n  border-radius: 12px;\n}\n.success-header {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 16px;\n  margin-bottom: 24px;\n  text-align: center;\n}\n.success-icon-container {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 80px;\n  height: 80px;\n  background:\n    linear-gradient(\n      135deg,\n      #10b981 0%,\n      #059669 100%);\n  border-radius: 50%;\n  animation: successPulse 1.5s ease-in-out;\n}\n@keyframes successPulse {\n  0% {\n    transform: scale(0);\n    opacity: 0;\n  }\n  50% {\n    transform: scale(1.1);\n  }\n  100% {\n    transform: scale(1);\n    opacity: 1;\n  }\n}\n.success-icon {\n  color: white;\n  width: 48px;\n  height: 48px;\n}\nh2 {\n  margin: 0;\n  color: #1f2937;\n  font-size: 24px;\n  font-weight: 600;\n}\nmat-dialog-content {\n  padding: 0 8px;\n  margin-bottom: 24px;\n}\n.success-message {\n  font-size: 16px;\n  color: #4b5563;\n  line-height: 1.6;\n  margin: 0 0 12px 0;\n  text-align: center;\n}\n.success-details {\n  font-size: 14px;\n  color: #6b7280;\n  background: #f0fdf4;\n  padding: 12px;\n  border-radius: 8px;\n  margin: 0;\n  border-left: 3px solid #10b981;\n  text-align: center;\n}\nmat-dialog-actions {\n  padding: 0;\n  margin: 0;\n  display: flex;\n  justify-content: center;\n}\nbutton {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  padding: 10px 24px;\n  font-size: 14px;\n  font-weight: 500;\n  border-radius: 8px;\n  transition: all 0.3s ease;\n  background:\n    linear-gradient(\n      135deg,\n      #10b981 0%,\n      #059669 100%) !important;\n}\nbutton:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);\n}\n/*# sourceMappingURL=success-modal.component.css.map */\n"] }]
  }], () => [{ type: MatDialogRef }, { type: void 0, decorators: [{
    type: Inject,
    args: [MAT_DIALOG_DATA]
  }] }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SuccessModalComponent, { className: "SuccessModalComponent", filePath: "src/app/shared/components/success-modal/success-modal.component.ts", lineNumber: 149 });
})();

// src/app/shared/services/error-modal.service.ts
var _ErrorModalService = class _ErrorModalService {
  constructor(dialog) {
    this.dialog = dialog;
  }
  /**
   * Muestra un modal de error con fondo difuminado
   * @param message Mensaje principal del error
   * @param title Título del modal (opcional, por defecto "Error")
   * @param details Detalles técnicos del error (opcional)
   */
  showError(message, title, details) {
    const config = {
      data: {
        title: title || "Error",
        message,
        details
      },
      panelClass: "error-modal-panel",
      backdropClass: "error-modal-backdrop",
      disableClose: false,
      hasBackdrop: true,
      width: "500px",
      maxWidth: "90vw"
    };
    this.dialog.open(ErrorModalComponent, config);
  }
  /**
   * Muestra un error de conexión estándar
   */
  showConnectionError() {
    this.showError("No se pudo conectar con el servidor. Por favor, verifica tu conexi\xF3n a internet e intenta nuevamente.", "Error de Conexi\xF3n");
  }
  /**
   * Muestra un error de validación
   */
  showValidationError(message) {
    this.showError(message, "Error de Validaci\xF3n");
  }
  /**
   * Muestra un error genérico del servidor
   */
  showServerError(details) {
    this.showError("Ocurri\xF3 un error en el servidor. Por favor, intenta nuevamente m\xE1s tarde.", "Error del Servidor", details);
  }
  /**
   * Muestra un modal de éxito con fondo difuminado
   * @param message Mensaje principal del éxito
   * @param title Título del modal (opcional, por defecto "Éxito")
   * @param details Detalles adicionales (opcional)
   */
  showSuccess(message, title, details) {
    const config = {
      data: {
        title: title || "\xC9xito",
        message,
        details
      },
      panelClass: "success-modal-panel",
      backdropClass: "success-modal-backdrop",
      disableClose: false,
      hasBackdrop: true,
      width: "500px",
      maxWidth: "90vw"
    };
    this.dialog.open(SuccessModalComponent, config);
  }
};
_ErrorModalService.\u0275fac = function ErrorModalService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _ErrorModalService)(\u0275\u0275inject(MatDialog));
};
_ErrorModalService.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ErrorModalService, factory: _ErrorModalService.\u0275fac, providedIn: "root" });
var ErrorModalService = _ErrorModalService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ErrorModalService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{ type: MatDialog }], null);
})();

// src/app/features/blacklist-main/blacklist/components/add-to-blacklist-form/add-to-blacklist-form.component.ts
function AddToBlacklistFormComponent_span_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 13);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.getFieldError("selectedProveedor"), " ");
  }
}
function AddToBlacklistFormComponent_span_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 13);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.getFieldError("documento"), " ");
  }
}
function AddToBlacklistFormComponent_span_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 13);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.getFieldError("fechaFin"), " ");
  }
}
function AddToBlacklistFormComponent_span_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "Agregar");
    \u0275\u0275elementEnd();
  }
}
function AddToBlacklistFormComponent_span_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "Guardando...");
    \u0275\u0275elementEnd();
  }
}
var _AddToBlacklistFormComponent = class _AddToBlacklistFormComponent {
  constructor(blacklistService, toastService, errorModalService) {
    this.blacklistService = blacklistService;
    this.toastService = toastService;
    this.errorModalService = errorModalService;
    this.blacklistAdded = new EventEmitter();
    this.formGroup = new FormGroup({});
    this.proveedores = [];
    this.isLoading = false;
  }
  ngOnInit() {
    this.initializeForm();
    this.loadProveedores();
  }
  initializeForm() {
    this.formGroup = new FormGroup({
      selectedProveedor: new FormControl(null, Validators.required),
      documento: new FormControl("", [Validators.required, Validators.pattern(/^\d+$/)]),
      fechaFin: new FormControl("", [Validators.required, this.validateFutureDate.bind(this)])
    });
  }
  loadProveedores() {
    this.proveedores = [
      { label: "FINANCIERA OH", value: "FINANCIERA_OH" },
      { label: "TRAMO PROPIO", value: "TRAMO_PROPIO" }
    ];
  }
  validateFutureDate(control) {
    if (!control.value) {
      return null;
    }
    const fechaSeleccionada = new Date(control.value);
    const fechaHoy = /* @__PURE__ */ new Date();
    fechaHoy.setHours(0, 0, 0, 0);
    if (fechaSeleccionada < fechaHoy) {
      return { fechaInvalida: true };
    }
    return null;
  }
  insertarBlacklist() {
    if (!this.formGroup.valid) {
      this.formGroup.markAllAsTouched();
      this.toastService.error("Por favor completa todos los campos requeridos");
      return;
    }
    const selectedProveedor = this.formGroup.value.selectedProveedor;
    const dni = this.formGroup.value.documento;
    const fechaFin = new Date(this.formGroup.value.fechaFin).toISOString().split("T")[0];
    this.isLoading = true;
    if (selectedProveedor === "TRAMO_PROPIO") {
      this.blacklistService.getEntidadByDocumento(dni).subscribe({
        next: (entidad) => {
          this.procesarBlacklist(selectedProveedor, dni, fechaFin, entidad);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorModalService.showError(error?.message || "Documento no encontrado en Tramo Propio", "Error", void 0);
        }
      });
    } else {
      this.procesarBlacklist(selectedProveedor, dni, fechaFin, "FUNO");
    }
  }
  procesarBlacklist(proveedor, dni, fechaFin, entidad) {
    const { cartera, subcartera } = this.mapProveedorToConfig(proveedor);
    const blacklistTemp = {
      empresa: proveedor,
      cartera,
      subcartera,
      documento: dni,
      fechaFin,
      entidad
    };
    this.blacklistService.insertBlacklist(blacklistTemp).subscribe({
      next: () => {
        const fechaActual = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
        this.errorModalService.showSuccess(`El cliente con DNI ${dni} ha sido agregado exitosamente a la blacklist.`, "Cliente Agregado", `Per\xEDodo: ${fechaActual} - ${fechaFin}`);
        this.formGroup.reset();
        this.blacklistAdded.emit();
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        let errorMessage = "Error al agregar a la blacklist";
        let errorDetails = void 0;
        if (error?.error?.message) {
          errorMessage = error.error.message;
        } else if (error?.message) {
          errorMessage = error.message;
        }
        if (error?.error?.details) {
          errorDetails = error.error.details;
        } else if (error?.status) {
          errorDetails = `C\xF3digo de error: ${error.status}`;
        }
        this.errorModalService.showError(errorMessage, "Error al agregar a Blacklist", errorDetails);
      }
    });
  }
  mapProveedorToConfig(proveedor) {
    if (proveedor === "FINANCIERA_OH") {
      return {
        cartera: "FO_TRAMO 5",
        subcartera: "FO_TRAMO_5"
      };
    } else {
      return {
        cartera: "TRAMO_PROPIO",
        subcartera: "TRAMO_PROPIO"
      };
    }
  }
  getFieldError(fieldName) {
    const field = this.formGroup.get(fieldName);
    if (field?.errors && (field?.touched || field?.dirty)) {
      if (field.errors["required"]) {
        return "Este campo es requerido";
      }
      if (field.errors["pattern"]) {
        return "Solo se permiten n\xFAmeros";
      }
      if (field.errors["fechaInvalida"]) {
        return "La fecha debe ser igual o mayor a hoy";
      }
    }
    return "";
  }
  isFieldInvalid(fieldName) {
    const field = this.formGroup.get(fieldName);
    return !!(field?.invalid && (field?.touched || field?.dirty));
  }
};
_AddToBlacklistFormComponent.\u0275fac = function AddToBlacklistFormComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _AddToBlacklistFormComponent)(\u0275\u0275directiveInject(BlacklistMainService), \u0275\u0275directiveInject(ToastService), \u0275\u0275directiveInject(ErrorModalService));
};
_AddToBlacklistFormComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AddToBlacklistFormComponent, selectors: [["app-add-to-blacklist-form"]], outputs: { blacklistAdded: "blacklistAdded" }, decls: 21, vars: 12, consts: [[1, "space-y-3", 3, "formGroup"], [1, "flex", "gap-3", "items-start"], [1, "flex-1"], ["for", "proveedor", 1, "block", "text-xs", "text-slate-400", "mb-1.5"], ["formControlName", "selectedProveedor", "placeholder", "Selecciona un proveedor", "id", "proveedor", 3, "options"], ["class", "text-xs text-red-400 mt-1 block", 4, "ngIf"], ["for", "documento", 1, "block", "text-xs", "text-slate-400", "mb-1.5"], ["type", "text", "id", "documento", "formControlName", "documento", "placeholder", "Ingresa el documento", "maxlength", "20", 1, "w-full", "h-10", "px-3", "bg-slate-900", "border", "border-slate-700", "rounded", "text-slate-100", "text-sm", "placeholder:text-slate-500", "focus:outline-none", "focus:ring-2", "focus:ring-blue-500", "focus:border-transparent"], ["for", "fechaFin", 1, "block", "text-xs", "text-slate-400", "mb-1.5"], ["type", "date", "id", "fechaFin", "formControlName", "fechaFin", 1, "w-full", "h-10", "px-3", "bg-slate-900", "border", "border-slate-700", "rounded", "text-slate-100", "text-sm", "focus:outline-none", "focus:ring-2", "focus:ring-blue-500", "focus:border-transparent"], [1, "pt-6"], ["type", "button", 1, "h-10", "inline-flex", "items-center", "gap-1.5", "px-4", "bg-gradient-to-r", "from-red-600", "to-red-700", "hover:from-red-700", "hover:to-red-800", "text-white", "text-sm", "font-medium", "rounded", "transition-all", "shadow-lg", "hover:shadow-red-500/50", "disabled:opacity-50", "disabled:cursor-not-allowed", "cursor-pointer", 3, "click", "disabled"], [4, "ngIf"], [1, "text-xs", "text-red-400", "mt-1", "block"]], template: function AddToBlacklistFormComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "form", 0)(1, "div", 1)(2, "div", 2)(3, "label", 3);
    \u0275\u0275text(4, "Proveedor *");
    \u0275\u0275elementEnd();
    \u0275\u0275element(5, "app-custom-select", 4);
    \u0275\u0275template(6, AddToBlacklistFormComponent_span_6_Template, 2, 1, "span", 5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "div", 2)(8, "label", 6);
    \u0275\u0275text(9, "Documento *");
    \u0275\u0275elementEnd();
    \u0275\u0275element(10, "input", 7);
    \u0275\u0275template(11, AddToBlacklistFormComponent_span_11_Template, 2, 1, "span", 5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "div", 2)(13, "label", 8);
    \u0275\u0275text(14, "Fecha de Fin *");
    \u0275\u0275elementEnd();
    \u0275\u0275element(15, "input", 9);
    \u0275\u0275template(16, AddToBlacklistFormComponent_span_16_Template, 2, 1, "span", 5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "div", 10)(18, "button", 11);
    \u0275\u0275listener("click", function AddToBlacklistFormComponent_Template_button_click_18_listener() {
      return ctx.insertarBlacklist();
    });
    \u0275\u0275template(19, AddToBlacklistFormComponent_span_19_Template, 2, 0, "span", 12)(20, AddToBlacklistFormComponent_span_20_Template, 2, 0, "span", 12);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    \u0275\u0275property("formGroup", ctx.formGroup);
    \u0275\u0275advance(5);
    \u0275\u0275property("options", ctx.proveedores);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.isFieldInvalid("selectedProveedor"));
    \u0275\u0275advance(4);
    \u0275\u0275classProp("border-red-500", ctx.isFieldInvalid("documento"));
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.isFieldInvalid("documento"));
    \u0275\u0275advance(4);
    \u0275\u0275classProp("border-red-500", ctx.isFieldInvalid("fechaFin"));
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.isFieldInvalid("fechaFin"));
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", !ctx.formGroup.valid || ctx.isLoading);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx.isLoading);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.isLoading);
  }
}, dependencies: [CommonModule, NgIf, ReactiveFormsModule, \u0275NgNoValidate, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, MaxLengthValidator, FormGroupDirective, FormControlName, CustomSelectComponent, LucideAngularModule], styles: ["\n\n.form[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: row;\n  gap: 15px;\n  align-items: center;\n}\n.form-group[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 10px;\n  align-items: center;\n  flex-wrap: wrap;\n}\n.fecha-container[_ngcontent-%COMP%] {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n}\n.fecha-error[_ngcontent-%COMP%] {\n  font-size: 0.8rem;\n  color: #f44336;\n  position: absolute;\n  bottom: -35px;\n  left: 0;\n}\n/*# sourceMappingURL=add-to-blacklist-form.component.css.map */"] });
var AddToBlacklistFormComponent = _AddToBlacklistFormComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AddToBlacklistFormComponent, [{
    type: Component,
    args: [{ selector: "app-add-to-blacklist-form", standalone: true, imports: [CommonModule, ReactiveFormsModule, CustomSelectComponent, LucideAngularModule], template: `<form [formGroup]="formGroup" class="space-y-3">\r
  <!-- Inputs en una fila -->\r
  <div class="flex gap-3 items-start">\r
    <div class="flex-1">\r
      <label for="proveedor" class="block text-xs text-slate-400 mb-1.5">Proveedor *</label>\r
      <app-custom-select\r
        formControlName="selectedProveedor"\r
        [options]="proveedores"\r
        placeholder="Selecciona un proveedor"\r
        id="proveedor">\r
      </app-custom-select>\r
      <span *ngIf="isFieldInvalid('selectedProveedor')" class="text-xs text-red-400 mt-1 block">\r
        {{ getFieldError('selectedProveedor') }}\r
      </span>\r
    </div>\r
\r
    <div class="flex-1">\r
      <label for="documento" class="block text-xs text-slate-400 mb-1.5">Documento *</label>\r
      <input\r
        type="text"\r
        id="documento"\r
        formControlName="documento"\r
        class="w-full h-10 px-3 bg-slate-900 border border-slate-700 rounded text-slate-100 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"\r
        [class.border-red-500]="isFieldInvalid('documento')"\r
        placeholder="Ingresa el documento"\r
        maxlength="20" />\r
      <span *ngIf="isFieldInvalid('documento')" class="text-xs text-red-400 mt-1 block">\r
        {{ getFieldError('documento') }}\r
      </span>\r
    </div>\r
\r
    <div class="flex-1">\r
      <label for="fechaFin" class="block text-xs text-slate-400 mb-1.5">Fecha de Fin *</label>\r
      <input\r
        type="date"\r
        id="fechaFin"\r
        formControlName="fechaFin"\r
        class="w-full h-10 px-3 bg-slate-900 border border-slate-700 rounded text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"\r
        [class.border-red-500]="isFieldInvalid('fechaFin')" />\r
      <span *ngIf="isFieldInvalid('fechaFin')" class="text-xs text-red-400 mt-1 block">\r
        {{ getFieldError('fechaFin') }}\r
      </span>\r
    </div>\r
\r
    <div class="pt-6">\r
      <button\r
        type="button"\r
        class="h-10 inline-flex items-center gap-1.5 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-sm font-medium rounded transition-all shadow-lg hover:shadow-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"\r
        [disabled]="!formGroup.valid || isLoading"\r
        (click)="insertarBlacklist()">\r
        <span *ngIf="!isLoading">Agregar</span>\r
        <span *ngIf="isLoading">Guardando...</span>\r
      </button>\r
    </div>\r
  </div>\r
</form>\r
`, styles: ["/* src/app/features/blacklist-main/blacklist/components/add-to-blacklist-form/add-to-blacklist-form.component.css */\n.form {\n  display: flex;\n  flex-direction: row;\n  gap: 15px;\n  align-items: center;\n}\n.form-group {\n  display: flex;\n  gap: 10px;\n  align-items: center;\n  flex-wrap: wrap;\n}\n.fecha-container {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n}\n.fecha-error {\n  font-size: 0.8rem;\n  color: #f44336;\n  position: absolute;\n  bottom: -35px;\n  left: 0;\n}\n/*# sourceMappingURL=add-to-blacklist-form.component.css.map */\n"] }]
  }], () => [{ type: BlacklistMainService }, { type: ToastService }, { type: ErrorModalService }], { blacklistAdded: [{
    type: Output
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AddToBlacklistFormComponent, { className: "AddToBlacklistFormComponent", filePath: "src/app/features/blacklist-main/blacklist/components/add-to-blacklist-form/add-to-blacklist-form.component.ts", lineNumber: 18 });
})();

// src/app/features/blacklist-main/blacklist/pages/blacklist-page/blacklist-page.component.ts
var _BlacklistMainPageComponent = class _BlacklistMainPageComponent {
  constructor(blacklistService, errorModalService) {
    this.blacklistService = blacklistService;
    this.errorModalService = errorModalService;
    this.blacklistRows = [];
  }
  ngOnInit() {
    this.loadBlacklistRows();
  }
  loadBlacklistRows() {
    this.blacklistService.getAllBlacklist().subscribe({
      next: (data) => {
        this.blacklistRows = data;
      },
      error: (error) => {
        console.error("Error al obtener la lista de blacklists", error);
        let errorMessage = "No se pudo cargar la lista de blacklist";
        let errorDetails = void 0;
        if (error?.error?.message) {
          errorMessage = error.error.message;
        } else if (error?.message) {
          errorMessage = error.message;
        }
        if (error?.status === 0) {
          errorMessage = "No se pudo conectar con el servidor";
          errorDetails = "Verifica tu conexi\xF3n a internet o contacta al administrador";
        } else if (error?.status) {
          errorDetails = `C\xF3digo de error: ${error.status}`;
        }
        this.errorModalService.showError(errorMessage, "Error al cargar Blacklist", errorDetails);
      }
    });
  }
};
_BlacklistMainPageComponent.\u0275fac = function BlacklistMainPageComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _BlacklistMainPageComponent)(\u0275\u0275directiveInject(BlacklistMainService), \u0275\u0275directiveInject(ErrorModalService));
};
_BlacklistMainPageComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _BlacklistMainPageComponent, selectors: [["app-blacklist-main-page"]], decls: 14, vars: 2, consts: [[1, "min-h-screen", "bg-slate-950", "p-4"], [1, "flex", "items-center", "gap-2", "mb-3"], [1, "w-8", "h-8", "bg-gradient-to-br", "from-red-600", "to-red-700", "rounded-lg", "flex", "items-center", "justify-center"], ["name", "shield-ban", 1, "text-white", 3, "size"], [1, "text-lg", "font-bold", "text-white"], [1, "text-xs", "text-gray-400"], [1, "section"], [3, "blacklistAdded"], [1, "table-container"], [3, "blacklistRows"]], template: function BlacklistMainPageComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2);
    \u0275\u0275element(3, "lucide-angular", 3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div")(5, "h1", 4);
    \u0275\u0275text(6, "Blacklist Principal");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p", 5);
    \u0275\u0275text(8, "Gesti\xF3n de contactos bloqueados");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(9, "div", 6)(10, "div")(11, "app-add-to-blacklist-form", 7);
    \u0275\u0275listener("blacklistAdded", function BlacklistMainPageComponent_Template_app_add_to_blacklist_form_blacklistAdded_11_listener() {
      return ctx.loadBlacklistRows();
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "div", 8);
    \u0275\u0275element(13, "app-blacklist-table", 9);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    \u0275\u0275advance(3);
    \u0275\u0275property("size", 16);
    \u0275\u0275advance(10);
    \u0275\u0275property("blacklistRows", ctx.blacklistRows);
  }
}, dependencies: [CommonModule, LucideAngularModule, LucideAngularComponent, AddToBlacklistFormComponent, BlacklistTableComponent], styles: ["\n\nbody[_ngcontent-%COMP%] {\n  margin-top: 7rem;\n  margin-bottom: 2rem;\n}\n.section[_ngcontent-%COMP%] {\n  max-width: 1350px;\n  margin: 0 auto;\n}\n.table-container[_ngcontent-%COMP%] {\n  margin-top: 2.4rem;\n}\n/*# sourceMappingURL=blacklist-page.component.css.map */"] });
var BlacklistMainPageComponent = _BlacklistMainPageComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BlacklistMainPageComponent, [{
    type: Component,
    args: [{ selector: "app-blacklist-main-page", standalone: true, imports: [CommonModule, LucideAngularModule, AddToBlacklistFormComponent, BlacklistTableComponent], template: '<div class="min-h-screen bg-slate-950 p-4">\r\n    <!-- Header -->\r\n    <div class="flex items-center gap-2 mb-3">\r\n        <div class="w-8 h-8 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center">\r\n            <lucide-angular name="shield-ban" [size]="16" class="text-white"></lucide-angular>\r\n        </div>\r\n        <div>\r\n            <h1 class="text-lg font-bold text-white">Blacklist Principal</h1>\r\n            <p class="text-xs text-gray-400">Gesti\xF3n de contactos bloqueados</p>\r\n        </div>\r\n    </div>\r\n\r\n    <div class="section">\r\n        <div>\r\n            <app-add-to-blacklist-form (blacklistAdded)="loadBlacklistRows()"></app-add-to-blacklist-form>\r\n        </div>\r\n\r\n        <div class="table-container">\r\n            <app-blacklist-table [blacklistRows]="blacklistRows"></app-blacklist-table>\r\n        </div>\r\n    </div>\r\n</div>', styles: ["/* src/app/features/blacklist-main/blacklist/pages/blacklist-page/blacklist-page.component.css */\nbody {\n  margin-top: 7rem;\n  margin-bottom: 2rem;\n}\n.section {\n  max-width: 1350px;\n  margin: 0 auto;\n}\n.table-container {\n  margin-top: 2.4rem;\n}\n/*# sourceMappingURL=blacklist-page.component.css.map */\n"] }]
  }], () => [{ type: BlacklistMainService }, { type: ErrorModalService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(BlacklistMainPageComponent, { className: "BlacklistMainPageComponent", filePath: "src/app/features/blacklist-main/blacklist/pages/blacklist-page/blacklist-page.component.ts", lineNumber: 17 });
})();
export {
  BlacklistMainPageComponent
};
//# sourceMappingURL=chunk-6YQIL66C.js.map
