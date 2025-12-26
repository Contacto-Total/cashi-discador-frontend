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
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2
} from "./chunk-CTRHJBBW.js";

// src/app/features/legacy/blacklist/components/blacklist-table/blacklist-table.component.ts
function BlacklistTableComponent_tr_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr", 5)(1, "td", 6)(2, "div", 7);
    \u0275\u0275element(3, "lucide-icon", 8);
    \u0275\u0275elementStart(4, "span");
    \u0275\u0275text(5, "No hay registros en la blacklist");
    \u0275\u0275elementEnd()()()();
  }
}
function BlacklistTableComponent_tr_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr", 9)(1, "td");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "td");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "td");
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "td");
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
    \u0275\u0275textInterpolate(row_r1.email);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(row_r1.telefono);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(row_r1.fechaInicio);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(row_r1.fechaFin);
  }
}
function BlacklistTableComponent_div_19_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 10)(1, "button", 11);
    \u0275\u0275listener("click", function BlacklistTableComponent_div_19_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.previousPage());
    });
    \u0275\u0275element(2, "lucide-icon", 12);
    \u0275\u0275text(3, " Anterior ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 13);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "button", 11);
    \u0275\u0275listener("click", function BlacklistTableComponent_div_19_Template_button_click_6_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.nextPage());
    });
    \u0275\u0275text(7, " Siguiente ");
    \u0275\u0275element(8, "lucide-icon", 14);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r2.currentPage === 1);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate2(" P\xE1gina ", ctx_r2.currentPage, " de ", ctx_r2.totalPages, " ");
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r2.currentPage === ctx_r2.totalPages);
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
_BlacklistTableComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _BlacklistTableComponent, selectors: [["app-blacklist-table"]], inputs: { blacklistRows: "blacklistRows" }, decls: 20, vars: 3, consts: [[1, "table-container"], [1, "blacklist-table"], ["class", "empty-row", 4, "ngIf"], ["class", "data-row", 4, "ngFor", "ngForOf"], ["class", "pagination", 4, "ngIf"], [1, "empty-row"], ["colspan", "6", 1, "empty-cell"], [1, "empty-state"], ["name", "inbox"], [1, "data-row"], [1, "pagination"], [1, "pagination-btn", 3, "click", "disabled"], ["name", "chevron-left", "size", "18"], [1, "pagination-info"], ["name", "chevron-right", "size", "18"]], template: function BlacklistTableComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 0)(1, "table", 1)(2, "thead")(3, "tr")(4, "th");
    \u0275\u0275text(5, "Empresa");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th");
    \u0275\u0275text(7, "Documento");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th");
    \u0275\u0275text(9, "Email");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th");
    \u0275\u0275text(11, "Tel\xE9fono");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th");
    \u0275\u0275text(13, "Fecha de Inicio");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "th");
    \u0275\u0275text(15, "Fecha de Fin");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(16, "tbody");
    \u0275\u0275template(17, BlacklistTableComponent_tr_17_Template, 6, 0, "tr", 2)(18, BlacklistTableComponent_tr_18_Template, 13, 6, "tr", 3);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(19, BlacklistTableComponent_div_19_Template, 9, 4, "div", 4);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance(17);
    \u0275\u0275property("ngIf", ctx.blacklistRows.length === 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx.paginatedRows);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.blacklistRows.length > 0);
  }
}, dependencies: [CommonModule, NgForOf, NgIf, LucideAngularModule, LucideAngularComponent], styles: ["\n\nbody.light-theme[_nghost-%COMP%], body.light-theme   [_nghost-%COMP%] {\n  --bg-primary: #ffffff;\n  --text-primary: #2c3e50;\n  --text-secondary: #7f8c8d;\n  --border-color: #ddd;\n  --hover-bg: #f8f9fa;\n  --header-bg: #f5f5f5;\n  --button-hover: #e0e0e0;\n}\nbody.dark-theme[_nghost-%COMP%], body.dark-theme   [_nghost-%COMP%] {\n  --bg-primary: #1e1e1e;\n  --text-primary: #e0e0e0;\n  --text-secondary: #a8a8a8;\n  --border-color: #444;\n  --hover-bg: #2d2d2d;\n  --header-bg: #2a2a2a;\n  --button-hover: #3a3a3a;\n}\n.table-container[_ngcontent-%COMP%] {\n  width: 100%;\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n  padding: 1.5rem;\n  border-radius: 8px;\n  background: var(--bg-primary);\n}\n.blacklist-table[_ngcontent-%COMP%] {\n  width: 100%;\n  border-collapse: collapse;\n  font-size: 0.95rem;\n  background-color: var(--bg-primary);\n  border-radius: 4px;\n  overflow: hidden;\n}\n.blacklist-table[_ngcontent-%COMP%]   thead[_ngcontent-%COMP%] {\n  background-color: var(--header-bg);\n  border-bottom: 2px solid var(--border-color);\n}\n.blacklist-table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] {\n  padding: 1rem;\n  text-align: left;\n  font-weight: 600;\n  color: var(--text-primary);\n  white-space: nowrap;\n}\n.blacklist-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%] {\n  border-bottom: 1px solid var(--border-color);\n  transition: background-color 0.2s ease;\n}\n.blacklist-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr.data-row[_ngcontent-%COMP%]:hover {\n  background-color: var(--hover-bg);\n}\n.blacklist-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  padding: 0.75rem 1rem;\n  color: var(--text-secondary);\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.empty-row[_ngcontent-%COMP%]   .empty-cell[_ngcontent-%COMP%] {\n  padding: 3rem 1rem !important;\n}\n.empty-row[_ngcontent-%COMP%]   .empty-state[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 0.5rem;\n  color: var(--text-secondary);\n}\n.empty-row[_ngcontent-%COMP%]   .empty-state[_ngcontent-%COMP%]   lucide-icon[_ngcontent-%COMP%] {\n  width: 48px;\n  height: 48px;\n  opacity: 0.5;\n}\n.empty-row[_ngcontent-%COMP%]   .empty-state[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-style: italic;\n  font-size: 0.95rem;\n}\n.pagination[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  gap: 1rem;\n  padding: 1rem 0;\n  border-top: 1px solid var(--border-color);\n  flex-wrap: wrap;\n}\n.pagination-btn[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  padding: 0.625rem 1.25rem;\n  background-color: var(--header-bg);\n  color: var(--text-primary);\n  border: 1px solid var(--border-color);\n  border-radius: 4px;\n  cursor: pointer;\n  font-size: 0.9rem;\n  font-weight: 500;\n  transition: all 0.2s ease;\n  white-space: nowrap;\n}\n.pagination-btn[_ngcontent-%COMP%]:hover:not(:disabled) {\n  background-color: var(--button-hover);\n  transform: translateY(-1px);\n  border-color: var(--text-primary);\n}\n.pagination-btn[_ngcontent-%COMP%]:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n.pagination-btn[_ngcontent-%COMP%]   lucide-icon[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n}\n.pagination-info[_ngcontent-%COMP%] {\n  color: var(--text-secondary);\n  font-size: 0.9rem;\n  min-width: 150px;\n  text-align: center;\n}\n@media (max-width: 768px) {\n  .table-container[_ngcontent-%COMP%] {\n    padding: 1rem;\n  }\n  .blacklist-table[_ngcontent-%COMP%] {\n    font-size: 0.85rem;\n  }\n  .blacklist-table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%], \n   .blacklist-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n    padding: 0.5rem;\n  }\n  .pagination[_ngcontent-%COMP%] {\n    flex-wrap: wrap;\n    gap: 0.5rem;\n  }\n  .pagination-btn[_ngcontent-%COMP%] {\n    padding: 0.5rem 0.75rem;\n    font-size: 0.85rem;\n  }\n  .pagination-info[_ngcontent-%COMP%] {\n    min-width: 120px;\n  }\n}\n/*# sourceMappingURL=blacklist-table.component.css.map */"] });
var BlacklistTableComponent = _BlacklistTableComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BlacklistTableComponent, [{
    type: Component,
    args: [{ selector: "app-blacklist-table", standalone: true, imports: [CommonModule, LucideAngularModule], template: '<div class="table-container">\r\n  <table class="blacklist-table">\r\n    <thead>\r\n      <tr>\r\n        <th>Empresa</th>\r\n        <th>Documento</th>\r\n        <th>Email</th>\r\n        <th>Tel\xE9fono</th>\r\n        <th>Fecha de Inicio</th>\r\n        <th>Fecha de Fin</th>\r\n      </tr>\r\n    </thead>\r\n    <tbody>\r\n      <tr *ngIf="blacklistRows.length === 0" class="empty-row">\r\n        <td colspan="6" class="empty-cell">\r\n          <div class="empty-state">\r\n            <lucide-icon name="inbox"></lucide-icon>\r\n            <span>No hay registros en la blacklist</span>\r\n          </div>\r\n        </td>\r\n      </tr>\r\n      <tr *ngFor="let row of paginatedRows" class="data-row">\r\n        <td>{{ row.empresa }}</td>\r\n        <td>{{ row.documento }}</td>\r\n        <td>{{ row.email }}</td>\r\n        <td>{{ row.telefono }}</td>\r\n        <td>{{ row.fechaInicio }}</td>\r\n        <td>{{ row.fechaFin }}</td>\r\n      </tr>\r\n    </tbody>\r\n  </table>\r\n\r\n  <div *ngIf="blacklistRows.length > 0" class="pagination">\r\n    <button\r\n      class="pagination-btn"\r\n      (click)="previousPage()"\r\n      [disabled]="currentPage === 1">\r\n      <lucide-icon name="chevron-left" size="18"></lucide-icon>\r\n      Anterior\r\n    </button>\r\n\r\n    <span class="pagination-info">\r\n      P\xE1gina {{ currentPage }} de {{ totalPages }}\r\n    </span>\r\n\r\n    <button\r\n      class="pagination-btn"\r\n      (click)="nextPage()"\r\n      [disabled]="currentPage === totalPages">\r\n      Siguiente\r\n      <lucide-icon name="chevron-right" size="18"></lucide-icon>\r\n    </button>\r\n  </div>\r\n</div>\r\n', styles: ["/* src/app/features/legacy/blacklist/components/blacklist-table/blacklist-table.component.scss */\n:host-context(body.light-theme) {\n  --bg-primary: #ffffff;\n  --text-primary: #2c3e50;\n  --text-secondary: #7f8c8d;\n  --border-color: #ddd;\n  --hover-bg: #f8f9fa;\n  --header-bg: #f5f5f5;\n  --button-hover: #e0e0e0;\n}\n:host-context(body.dark-theme) {\n  --bg-primary: #1e1e1e;\n  --text-primary: #e0e0e0;\n  --text-secondary: #a8a8a8;\n  --border-color: #444;\n  --hover-bg: #2d2d2d;\n  --header-bg: #2a2a2a;\n  --button-hover: #3a3a3a;\n}\n.table-container {\n  width: 100%;\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n  padding: 1.5rem;\n  border-radius: 8px;\n  background: var(--bg-primary);\n}\n.blacklist-table {\n  width: 100%;\n  border-collapse: collapse;\n  font-size: 0.95rem;\n  background-color: var(--bg-primary);\n  border-radius: 4px;\n  overflow: hidden;\n}\n.blacklist-table thead {\n  background-color: var(--header-bg);\n  border-bottom: 2px solid var(--border-color);\n}\n.blacklist-table th {\n  padding: 1rem;\n  text-align: left;\n  font-weight: 600;\n  color: var(--text-primary);\n  white-space: nowrap;\n}\n.blacklist-table tbody tr {\n  border-bottom: 1px solid var(--border-color);\n  transition: background-color 0.2s ease;\n}\n.blacklist-table tbody tr.data-row:hover {\n  background-color: var(--hover-bg);\n}\n.blacklist-table tbody td {\n  padding: 0.75rem 1rem;\n  color: var(--text-secondary);\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.empty-row .empty-cell {\n  padding: 3rem 1rem !important;\n}\n.empty-row .empty-state {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 0.5rem;\n  color: var(--text-secondary);\n}\n.empty-row .empty-state lucide-icon {\n  width: 48px;\n  height: 48px;\n  opacity: 0.5;\n}\n.empty-row .empty-state span {\n  font-style: italic;\n  font-size: 0.95rem;\n}\n.pagination {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  gap: 1rem;\n  padding: 1rem 0;\n  border-top: 1px solid var(--border-color);\n  flex-wrap: wrap;\n}\n.pagination-btn {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  padding: 0.625rem 1.25rem;\n  background-color: var(--header-bg);\n  color: var(--text-primary);\n  border: 1px solid var(--border-color);\n  border-radius: 4px;\n  cursor: pointer;\n  font-size: 0.9rem;\n  font-weight: 500;\n  transition: all 0.2s ease;\n  white-space: nowrap;\n}\n.pagination-btn:hover:not(:disabled) {\n  background-color: var(--button-hover);\n  transform: translateY(-1px);\n  border-color: var(--text-primary);\n}\n.pagination-btn:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n.pagination-btn lucide-icon {\n  width: 18px;\n  height: 18px;\n}\n.pagination-info {\n  color: var(--text-secondary);\n  font-size: 0.9rem;\n  min-width: 150px;\n  text-align: center;\n}\n@media (max-width: 768px) {\n  .table-container {\n    padding: 1rem;\n  }\n  .blacklist-table {\n    font-size: 0.85rem;\n  }\n  .blacklist-table th,\n  .blacklist-table td {\n    padding: 0.5rem;\n  }\n  .pagination {\n    flex-wrap: wrap;\n    gap: 0.5rem;\n  }\n  .pagination-btn {\n    padding: 0.5rem 0.75rem;\n    font-size: 0.85rem;\n  }\n  .pagination-info {\n    min-width: 120px;\n  }\n}\n/*# sourceMappingURL=blacklist-table.component.css.map */\n"] }]
  }], null, { blacklistRows: [{
    type: Input
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(BlacklistTableComponent, { className: "BlacklistTableComponent", filePath: "src/app/features/legacy/blacklist/components/blacklist-table/blacklist-table.component.ts", lineNumber: 13 });
})();

// src/app/features/legacy/blacklist/services/blacklist.service.ts
var _BlacklistService = class _BlacklistService {
  constructor(http) {
    this.http = http;
    this.baseUrl = environment.webServiceUrl + "/blacklist";
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
  insertBlacklist(blacklist) {
    return this.http.post(this.baseUrl, blacklist, __spreadProps(__spreadValues({}, this.httpOptions), { responseType: "text" })).pipe(catchError((error) => this.handleError(error)));
  }
  getAllBlacklist() {
    return this.http.get(this.baseUrl + "/all", this.httpOptions).pipe(retry(2), catchError((error) => this.handleError(error)));
  }
  getEntidadByDocumento(documento) {
    return this.http.get(this.baseUrl + "/entidad/" + documento, { responseType: "text" }).pipe(catchError((error) => this.handleError(error)));
  }
};
_BlacklistService.\u0275fac = function BlacklistService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _BlacklistService)(\u0275\u0275inject(HttpClient));
};
_BlacklistService.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _BlacklistService, factory: _BlacklistService.\u0275fac, providedIn: "root" });
var BlacklistService = _BlacklistService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BlacklistService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{ type: HttpClient }], null);
})();

// src/app/features/legacy/blacklist/components/add-blacklist-form/add-blacklist-form.component.ts
function AddBlacklistFormComponent_span_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 11);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.getFieldError("selectedProveedor"), " ");
  }
}
function AddBlacklistFormComponent_span_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 11);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.getFieldError("documento"), " ");
  }
}
function AddBlacklistFormComponent_span_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 11);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.getFieldError("fechaFin"), " ");
  }
}
function AddBlacklistFormComponent_span_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "Guardar");
    \u0275\u0275elementEnd();
  }
}
function AddBlacklistFormComponent_span_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "Guardando...");
    \u0275\u0275elementEnd();
  }
}
var _AddBlacklistFormComponent = class _AddBlacklistFormComponent {
  constructor(blacklistService, toastService) {
    this.blacklistService = blacklistService;
    this.toastService = toastService;
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
          this.toastService.error(error?.message || "Documento no encontrado en Tramo Propio");
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
        this.toastService.success(`Cliente DNI: ${dni} agregado a Blacklist (${fechaActual} - ${fechaFin})`);
        this.formGroup.reset();
        this.blacklistAdded.emit();
        this.isLoading = false;
      },
      error: (error) => {
        const message = error?.message || "Error al agregar a la blacklist";
        this.toastService.error(message);
        this.isLoading = false;
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
_AddBlacklistFormComponent.\u0275fac = function AddBlacklistFormComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _AddBlacklistFormComponent)(\u0275\u0275directiveInject(BlacklistService), \u0275\u0275directiveInject(ToastService));
};
_AddBlacklistFormComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AddBlacklistFormComponent, selectors: [["app-add-blacklist-form"]], outputs: { blacklistAdded: "blacklistAdded" }, decls: 19, vars: 12, consts: [[1, "form-container", 3, "formGroup"], [1, "form-group"], ["for", "proveedor", 1, "form-label"], ["formControlName", "selectedProveedor", "placeholder", "Selecciona un proveedor", "id", "proveedor", 3, "options"], ["class", "error-message", 4, "ngIf"], ["for", "documento", 1, "form-label"], ["type", "text", "id", "documento", "formControlName", "documento", "placeholder", "Ingresa el documento", "maxlength", "20", 1, "form-input"], ["for", "fechaFin", 1, "form-label"], ["type", "date", "id", "fechaFin", "formControlName", "fechaFin", 1, "form-input"], ["type", "button", 1, "btn", "btn-submit", 3, "click", "disabled"], [4, "ngIf"], [1, "error-message"]], template: function AddBlacklistFormComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "form", 0)(1, "div", 1)(2, "label", 2);
    \u0275\u0275text(3, "Proveedor *");
    \u0275\u0275elementEnd();
    \u0275\u0275element(4, "app-custom-select", 3);
    \u0275\u0275template(5, AddBlacklistFormComponent_span_5_Template, 2, 1, "span", 4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 1)(7, "label", 5);
    \u0275\u0275text(8, "Documento *");
    \u0275\u0275elementEnd();
    \u0275\u0275element(9, "input", 6);
    \u0275\u0275template(10, AddBlacklistFormComponent_span_10_Template, 2, 1, "span", 4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "div", 1)(12, "label", 7);
    \u0275\u0275text(13, "Fecha de Fin *");
    \u0275\u0275elementEnd();
    \u0275\u0275element(14, "input", 8);
    \u0275\u0275template(15, AddBlacklistFormComponent_span_15_Template, 2, 1, "span", 4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "button", 9);
    \u0275\u0275listener("click", function AddBlacklistFormComponent_Template_button_click_16_listener() {
      return ctx.insertarBlacklist();
    });
    \u0275\u0275template(17, AddBlacklistFormComponent_span_17_Template, 2, 0, "span", 10)(18, AddBlacklistFormComponent_span_18_Template, 2, 0, "span", 10);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275property("formGroup", ctx.formGroup);
    \u0275\u0275advance(4);
    \u0275\u0275property("options", ctx.proveedores);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.isFieldInvalid("selectedProveedor"));
    \u0275\u0275advance(4);
    \u0275\u0275classProp("invalid", ctx.isFieldInvalid("documento"));
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.isFieldInvalid("documento"));
    \u0275\u0275advance(4);
    \u0275\u0275classProp("invalid", ctx.isFieldInvalid("fechaFin"));
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.isFieldInvalid("fechaFin"));
    \u0275\u0275advance();
    \u0275\u0275property("disabled", !ctx.formGroup.valid || ctx.isLoading);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx.isLoading);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.isLoading);
  }
}, dependencies: [CommonModule, NgIf, ReactiveFormsModule, \u0275NgNoValidate, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, MaxLengthValidator, FormGroupDirective, FormControlName, CustomSelectComponent, LucideAngularModule], styles: ["\n\n.form-container[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 1.5rem;\n  padding: 2rem;\n  border-radius: 8px;\n  background: var(--color-surface);\n  border: 1px solid var(--color-border);\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);\n}\n.form-group[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 0.5rem;\n}\n.form-label[_ngcontent-%COMP%] {\n  font-weight: 600;\n  color: var(--color-text-primary);\n  font-size: 0.95rem;\n}\n.form-input[_ngcontent-%COMP%] {\n  padding: 0.75rem 1rem;\n  border: 1px solid var(--color-border);\n  border-radius: 4px;\n  font-size: 1rem;\n  background: var(--color-input-bg);\n  color: var(--color-text-primary);\n  transition: border-color 0.3s ease, box-shadow 0.3s ease;\n}\n.form-input[_ngcontent-%COMP%]:focus {\n  outline: none;\n  border-color: var(--color-primary);\n  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);\n}\n.form-input.invalid[_ngcontent-%COMP%] {\n  border-color: var(--color-error);\n  background-color: rgba(239, 68, 68, 0.05);\n}\n.form-input.invalid[_ngcontent-%COMP%]:focus {\n  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.1);\n}\n.form-input[_ngcontent-%COMP%]::placeholder {\n  color: var(--color-text-secondary);\n}\n.error-message[_ngcontent-%COMP%] {\n  font-size: 0.85rem;\n  color: var(--color-error);\n  margin-top: 0.25rem;\n}\n.btn[_ngcontent-%COMP%] {\n  padding: 0.875rem 1.5rem;\n  border: none;\n  border-radius: 4px;\n  font-weight: 600;\n  font-size: 1rem;\n  cursor: pointer;\n  transition: all 0.3s ease;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.5rem;\n}\n.btn.btn-submit[_ngcontent-%COMP%] {\n  background: var(--color-primary);\n  color: white;\n}\n.btn.btn-submit[_ngcontent-%COMP%]:hover:not(:disabled) {\n  background: var(--color-primary-dark);\n  box-shadow: 0 4px 6px rgba(59, 130, 246, 0.3);\n}\n.btn.btn-submit[_ngcontent-%COMP%]:disabled {\n  background: var(--color-disabled);\n  cursor: not-allowed;\n  opacity: 0.6;\n}\n.dark[_nghost-%COMP%]   .form-container[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .form-container[_ngcontent-%COMP%] {\n  background: var(--color-surface-dark);\n  border-color: var(--color-border-dark);\n}\n.dark[_nghost-%COMP%]   .form-label[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .form-label[_ngcontent-%COMP%] {\n  color: var(--color-text-primary-dark);\n}\n.dark[_nghost-%COMP%]   .form-input[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .form-input[_ngcontent-%COMP%] {\n  background: var(--color-input-bg-dark);\n  color: var(--color-text-primary-dark);\n  border-color: var(--color-border-dark);\n}\n.dark[_nghost-%COMP%]   .form-input[_ngcontent-%COMP%]::placeholder, .dark   [_nghost-%COMP%]   .form-input[_ngcontent-%COMP%]::placeholder {\n  color: var(--color-text-secondary-dark);\n}\n/*# sourceMappingURL=add-blacklist-form.component.css.map */"] });
var AddBlacklistFormComponent = _AddBlacklistFormComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AddBlacklistFormComponent, [{
    type: Component,
    args: [{ selector: "app-add-blacklist-form", standalone: true, imports: [CommonModule, ReactiveFormsModule, CustomSelectComponent, LucideAngularModule], template: `<form [formGroup]="formGroup" class="form-container">\r
  <div class="form-group">\r
    <label for="proveedor" class="form-label">Proveedor *</label>\r
    <app-custom-select\r
      formControlName="selectedProveedor"\r
      [options]="proveedores"\r
      placeholder="Selecciona un proveedor"\r
      id="proveedor">\r
    </app-custom-select>\r
    <span *ngIf="isFieldInvalid('selectedProveedor')" class="error-message">\r
      {{ getFieldError('selectedProveedor') }}\r
    </span>\r
  </div>\r
\r
  <div class="form-group">\r
    <label for="documento" class="form-label">Documento *</label>\r
    <input\r
      type="text"\r
      id="documento"\r
      formControlName="documento"\r
      class="form-input"\r
      [class.invalid]="isFieldInvalid('documento')"\r
      placeholder="Ingresa el documento"\r
      maxlength="20" />\r
    <span *ngIf="isFieldInvalid('documento')" class="error-message">\r
      {{ getFieldError('documento') }}\r
    </span>\r
  </div>\r
\r
  <div class="form-group">\r
    <label for="fechaFin" class="form-label">Fecha de Fin *</label>\r
    <input\r
      type="date"\r
      id="fechaFin"\r
      formControlName="fechaFin"\r
      class="form-input"\r
      [class.invalid]="isFieldInvalid('fechaFin')" />\r
    <span *ngIf="isFieldInvalid('fechaFin')" class="error-message">\r
      {{ getFieldError('fechaFin') }}\r
    </span>\r
  </div>\r
\r
  <button\r
    type="button"\r
    class="btn btn-submit"\r
    [disabled]="!formGroup.valid || isLoading"\r
    (click)="insertarBlacklist()">\r
    <span *ngIf="!isLoading">Guardar</span>\r
    <span *ngIf="isLoading">Guardando...</span>\r
  </button>\r
</form>\r
`, styles: ["/* src/app/features/legacy/blacklist/components/add-blacklist-form/add-blacklist-form.component.scss */\n.form-container {\n  display: flex;\n  flex-direction: column;\n  gap: 1.5rem;\n  padding: 2rem;\n  border-radius: 8px;\n  background: var(--color-surface);\n  border: 1px solid var(--color-border);\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);\n}\n.form-group {\n  display: flex;\n  flex-direction: column;\n  gap: 0.5rem;\n}\n.form-label {\n  font-weight: 600;\n  color: var(--color-text-primary);\n  font-size: 0.95rem;\n}\n.form-input {\n  padding: 0.75rem 1rem;\n  border: 1px solid var(--color-border);\n  border-radius: 4px;\n  font-size: 1rem;\n  background: var(--color-input-bg);\n  color: var(--color-text-primary);\n  transition: border-color 0.3s ease, box-shadow 0.3s ease;\n}\n.form-input:focus {\n  outline: none;\n  border-color: var(--color-primary);\n  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);\n}\n.form-input.invalid {\n  border-color: var(--color-error);\n  background-color: rgba(239, 68, 68, 0.05);\n}\n.form-input.invalid:focus {\n  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.1);\n}\n.form-input::placeholder {\n  color: var(--color-text-secondary);\n}\n.error-message {\n  font-size: 0.85rem;\n  color: var(--color-error);\n  margin-top: 0.25rem;\n}\n.btn {\n  padding: 0.875rem 1.5rem;\n  border: none;\n  border-radius: 4px;\n  font-weight: 600;\n  font-size: 1rem;\n  cursor: pointer;\n  transition: all 0.3s ease;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.5rem;\n}\n.btn.btn-submit {\n  background: var(--color-primary);\n  color: white;\n}\n.btn.btn-submit:hover:not(:disabled) {\n  background: var(--color-primary-dark);\n  box-shadow: 0 4px 6px rgba(59, 130, 246, 0.3);\n}\n.btn.btn-submit:disabled {\n  background: var(--color-disabled);\n  cursor: not-allowed;\n  opacity: 0.6;\n}\n:host-context(.dark) .form-container {\n  background: var(--color-surface-dark);\n  border-color: var(--color-border-dark);\n}\n:host-context(.dark) .form-label {\n  color: var(--color-text-primary-dark);\n}\n:host-context(.dark) .form-input {\n  background: var(--color-input-bg-dark);\n  color: var(--color-text-primary-dark);\n  border-color: var(--color-border-dark);\n}\n:host-context(.dark) .form-input::placeholder {\n  color: var(--color-text-secondary-dark);\n}\n/*# sourceMappingURL=add-blacklist-form.component.css.map */\n"] }]
  }], () => [{ type: BlacklistService }, { type: ToastService }], { blacklistAdded: [{
    type: Output
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AddBlacklistFormComponent, { className: "AddBlacklistFormComponent", filePath: "src/app/features/legacy/blacklist/components/add-blacklist-form/add-blacklist-form.component.ts", lineNumber: 17 });
})();

// src/app/features/legacy/blacklist/pages/blacklist-page/blacklist-page.component.ts
var _BlacklistPageComponent = class _BlacklistPageComponent {
  constructor(blacklistService, toastService) {
    this.blacklistService = blacklistService;
    this.toastService = toastService;
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
        this.toastService.error("Error al cargar la blacklist");
      }
    });
  }
};
_BlacklistPageComponent.\u0275fac = function BlacklistPageComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _BlacklistPageComponent)(\u0275\u0275directiveInject(BlacklistService), \u0275\u0275directiveInject(ToastService));
};
_BlacklistPageComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _BlacklistPageComponent, selectors: [["app-blacklist-page"]], decls: 9, vars: 1, consts: [[1, "blacklist-container"], [1, "header-section"], [1, "content-section"], [1, "form-wrapper"], [3, "blacklistAdded"], [1, "table-wrapper"], [3, "blacklistRows"]], template: function BlacklistPageComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "h1");
    \u0275\u0275text(3, "Gesti\xF3n de Blacklist");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "div", 2)(5, "div", 3)(6, "app-add-blacklist-form", 4);
    \u0275\u0275listener("blacklistAdded", function BlacklistPageComponent_Template_app_add_blacklist_form_blacklistAdded_6_listener() {
      return ctx.loadBlacklistRows();
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 5);
    \u0275\u0275element(8, "app-blacklist-table", 6);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    \u0275\u0275advance(8);
    \u0275\u0275property("blacklistRows", ctx.blacklistRows);
  }
}, dependencies: [CommonModule, AddBlacklistFormComponent, BlacklistTableComponent], styles: ["\n\nbody.light-theme[_nghost-%COMP%], body.light-theme   [_nghost-%COMP%] {\n  --bg-primary: #ffffff;\n  --bg-secondary: #f5f5f5;\n  --text-primary: #2c3e50;\n  --text-secondary: #7f8c8d;\n  --border-color: #ddd;\n  --shadow: rgba(0, 0, 0, 0.1);\n}\nbody.dark-theme[_nghost-%COMP%], body.dark-theme   [_nghost-%COMP%] {\n  --bg-primary: #1e1e1e;\n  --bg-secondary: #0f0f0f;\n  --text-primary: #e0e0e0;\n  --text-secondary: #a8a8a8;\n  --border-color: #444;\n  --shadow: rgba(0, 0, 0, 0.3);\n}\n.blacklist-container[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 2rem;\n  padding: 2rem;\n  margin-top: 5rem;\n  margin-bottom: 2rem;\n  background-color: var(--bg-secondary);\n  min-height: calc(100vh - 7rem);\n}\n.header-section[_ngcontent-%COMP%] {\n  max-width: 1350px;\n  margin: 0 auto;\n  width: 100%;\n}\n.header-section[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 1.75rem;\n  font-weight: 700;\n  color: var(--text-primary);\n  letter-spacing: -0.5px;\n}\n.content-section[_ngcontent-%COMP%] {\n  max-width: 1350px;\n  margin: 0 auto;\n  width: 100%;\n  display: flex;\n  flex-direction: column;\n  gap: 1.5rem;\n}\n.form-wrapper[_ngcontent-%COMP%] {\n  background-color: var(--bg-primary);\n  border-radius: 8px;\n  box-shadow: 0 2px 8px var(--shadow);\n  overflow: hidden;\n}\n.table-wrapper[_ngcontent-%COMP%] {\n  background-color: var(--bg-primary);\n  border-radius: 8px;\n  box-shadow: 0 2px 8px var(--shadow);\n  overflow-x: auto;\n}\n@media (max-width: 768px) {\n  .table-wrapper[_ngcontent-%COMP%] {\n    overflow-x: auto;\n    -webkit-overflow-scrolling: touch;\n  }\n}\n@media (max-width: 1024px) {\n  .blacklist-container[_ngcontent-%COMP%] {\n    gap: 1.5rem;\n    padding: 1.5rem;\n  }\n  .header-section[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n    font-size: 1.5rem;\n  }\n}\n@media (max-width: 768px) {\n  .blacklist-container[_ngcontent-%COMP%] {\n    padding: 1rem;\n    margin-top: 4rem;\n    gap: 1rem;\n  }\n  .header-section[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n    font-size: 1.35rem;\n  }\n  .content-section[_ngcontent-%COMP%] {\n    gap: 1rem;\n  }\n  .form-wrapper[_ngcontent-%COMP%], \n   .table-wrapper[_ngcontent-%COMP%] {\n    border-radius: 6px;\n  }\n}\n@media (max-width: 480px) {\n  .blacklist-container[_ngcontent-%COMP%] {\n    padding: 0.75rem;\n    margin-top: 3.5rem;\n  }\n  .header-section[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n    font-size: 1.25rem;\n  }\n}\n/*# sourceMappingURL=blacklist-page.component.css.map */"] });
var BlacklistPageComponent = _BlacklistPageComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BlacklistPageComponent, [{
    type: Component,
    args: [{ selector: "app-blacklist-page", standalone: true, imports: [CommonModule, AddBlacklistFormComponent, BlacklistTableComponent], template: '<div class="blacklist-container">\r\n  <div class="header-section">\r\n    <h1>Gesti\xF3n de Blacklist</h1>\r\n  </div>\r\n\r\n  <div class="content-section">\r\n    <div class="form-wrapper">\r\n      <app-add-blacklist-form (blacklistAdded)="loadBlacklistRows()"></app-add-blacklist-form>\r\n    </div>\r\n\r\n    <div class="table-wrapper">\r\n      <app-blacklist-table [blacklistRows]="blacklistRows"></app-blacklist-table>\r\n    </div>\r\n  </div>\r\n</div>\r\n', styles: ["/* src/app/features/legacy/blacklist/pages/blacklist-page/blacklist-page.component.scss */\n:host-context(body.light-theme) {\n  --bg-primary: #ffffff;\n  --bg-secondary: #f5f5f5;\n  --text-primary: #2c3e50;\n  --text-secondary: #7f8c8d;\n  --border-color: #ddd;\n  --shadow: rgba(0, 0, 0, 0.1);\n}\n:host-context(body.dark-theme) {\n  --bg-primary: #1e1e1e;\n  --bg-secondary: #0f0f0f;\n  --text-primary: #e0e0e0;\n  --text-secondary: #a8a8a8;\n  --border-color: #444;\n  --shadow: rgba(0, 0, 0, 0.3);\n}\n.blacklist-container {\n  display: flex;\n  flex-direction: column;\n  gap: 2rem;\n  padding: 2rem;\n  margin-top: 5rem;\n  margin-bottom: 2rem;\n  background-color: var(--bg-secondary);\n  min-height: calc(100vh - 7rem);\n}\n.header-section {\n  max-width: 1350px;\n  margin: 0 auto;\n  width: 100%;\n}\n.header-section h1 {\n  margin: 0;\n  font-size: 1.75rem;\n  font-weight: 700;\n  color: var(--text-primary);\n  letter-spacing: -0.5px;\n}\n.content-section {\n  max-width: 1350px;\n  margin: 0 auto;\n  width: 100%;\n  display: flex;\n  flex-direction: column;\n  gap: 1.5rem;\n}\n.form-wrapper {\n  background-color: var(--bg-primary);\n  border-radius: 8px;\n  box-shadow: 0 2px 8px var(--shadow);\n  overflow: hidden;\n}\n.table-wrapper {\n  background-color: var(--bg-primary);\n  border-radius: 8px;\n  box-shadow: 0 2px 8px var(--shadow);\n  overflow-x: auto;\n}\n@media (max-width: 768px) {\n  .table-wrapper {\n    overflow-x: auto;\n    -webkit-overflow-scrolling: touch;\n  }\n}\n@media (max-width: 1024px) {\n  .blacklist-container {\n    gap: 1.5rem;\n    padding: 1.5rem;\n  }\n  .header-section h1 {\n    font-size: 1.5rem;\n  }\n}\n@media (max-width: 768px) {\n  .blacklist-container {\n    padding: 1rem;\n    margin-top: 4rem;\n    gap: 1rem;\n  }\n  .header-section h1 {\n    font-size: 1.35rem;\n  }\n  .content-section {\n    gap: 1rem;\n  }\n  .form-wrapper,\n  .table-wrapper {\n    border-radius: 6px;\n  }\n}\n@media (max-width: 480px) {\n  .blacklist-container {\n    padding: 0.75rem;\n    margin-top: 3.5rem;\n  }\n  .header-section h1 {\n    font-size: 1.25rem;\n  }\n}\n/*# sourceMappingURL=blacklist-page.component.css.map */\n"] }]
  }], () => [{ type: BlacklistService }, { type: ToastService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(BlacklistPageComponent, { className: "BlacklistPageComponent", filePath: "src/app/features/legacy/blacklist/pages/blacklist-page/blacklist-page.component.ts", lineNumber: 16 });
})();

// src/app/features/legacy/blacklist/blacklist.component.ts
var _BlacklistComponent = class _BlacklistComponent {
};
_BlacklistComponent.\u0275fac = function BlacklistComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _BlacklistComponent)();
};
_BlacklistComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _BlacklistComponent, selectors: [["app-blacklist"]], decls: 1, vars: 0, template: function BlacklistComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-blacklist-page");
  }
}, dependencies: [BlacklistPageComponent], encapsulation: 2 });
var BlacklistComponent = _BlacklistComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BlacklistComponent, [{
    type: Component,
    args: [{
      selector: "app-blacklist",
      standalone: true,
      imports: [BlacklistPageComponent],
      template: "<app-blacklist-page></app-blacklist-page>"
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(BlacklistComponent, { className: "BlacklistComponent", filePath: "src/app/features/legacy/blacklist/blacklist.component.ts", lineNumber: 10 });
})();
export {
  BlacklistComponent
};
//# sourceMappingURL=chunk-4QMINOCU.js.map
