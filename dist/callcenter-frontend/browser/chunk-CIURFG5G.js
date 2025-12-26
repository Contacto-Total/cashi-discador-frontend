import {
  TypificationService
} from "./chunk-XGOWMJUN.js";
import {
  PortfolioService
} from "./chunk-K6HKS25L.js";
import {
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgModel,
  NgSelectOption,
  SelectControlValueAccessor,
  ɵNgSelectMultipleOption
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
  HttpClient,
  Injectable,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
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
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-CTRHJBBW.js";

// src/app/maintenance/services/blacklist.service.ts
var _BlacklistService = class _BlacklistService {
  constructor(http) {
    this.http = http;
    this.apiUrl = `${environment.tipificacionUrl}/blacklist`;
  }
  getAllBlacklists() {
    return this.http.get(this.apiUrl);
  }
  getBlacklistById(id) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
  getBlacklistsByTenant(tenantId) {
    return this.http.get(`${this.apiUrl}/tenant/${tenantId}`);
  }
  createBlacklist(blacklist) {
    return this.http.post(this.apiUrl, blacklist);
  }
  updateBlacklist(id, blacklist) {
    return this.http.put(`${this.apiUrl}/${id}`, blacklist);
  }
  deleteBlacklist(id) {
    return this.http.delete(`${this.apiUrl}/${id}`);
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

// src/app/maintenance/components/blacklist-maintenance/blacklist-maintenance.component.ts
var _forTrack0 = ($index, $item) => $item.id;
function BlacklistMaintenanceComponent_For_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 11);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const tenant_r1 = ctx.$implicit;
    \u0275\u0275property("value", tenant_r1.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(tenant_r1.tenantName);
  }
}
function BlacklistMaintenanceComponent_For_28_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 11);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const portfolio_r2 = ctx.$implicit;
    \u0275\u0275property("value", portfolio_r2.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(portfolio_r2.portfolioName);
  }
}
function BlacklistMaintenanceComponent_For_36_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 11);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const subPortfolio_r3 = ctx.$implicit;
    \u0275\u0275property("value", subPortfolio_r3.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(subPortfolio_r3.subPortfolioName);
  }
}
function BlacklistMaintenanceComponent_Conditional_50_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 19);
    \u0275\u0275element(1, "div", 24);
    \u0275\u0275elementStart(2, "p", 25);
    \u0275\u0275text(3, "Cargando bloqueos...");
    \u0275\u0275elementEnd()();
  }
}
function BlacklistMaintenanceComponent_Conditional_51_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 19);
    \u0275\u0275element(1, "lucide-angular", 26);
    \u0275\u0275elementStart(2, "p", 27);
    \u0275\u0275text(3, "No hay bloqueos registrados");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p", 28);
    \u0275\u0275text(5, "Usa el formulario de arriba para a\xF1adir un nuevo bloqueo");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 48);
  }
}
function BlacklistMaintenanceComponent_Conditional_52_Conditional_10_For_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 41);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const tenant_r7 = ctx.$implicit;
    \u0275\u0275property("ngValue", tenant_r7.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(tenant_r7.name);
  }
}
function BlacklistMaintenanceComponent_Conditional_52_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 36)(1, "select", 40);
    \u0275\u0275twoWayListener("ngModelChange", function BlacklistMaintenanceComponent_Conditional_52_Conditional_10_Template_select_ngModelChange_1_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r4 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r4.filterTenantId, $event) || (ctx_r4.filterTenantId = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function BlacklistMaintenanceComponent_Conditional_52_Conditional_10_Template_select_ngModelChange_1_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r4 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r4.onFilterTenantChange());
    });
    \u0275\u0275elementStart(2, "option", 41);
    \u0275\u0275text(3, "Todos");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(4, BlacklistMaintenanceComponent_Conditional_52_Conditional_10_For_5_Template, 2, 2, "option", 41, _forTrack0);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r4 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("ngModel", ctx_r4.filterTenantId);
    \u0275\u0275advance();
    \u0275\u0275property("ngValue", null);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r4.availableTenants());
  }
}
function BlacklistMaintenanceComponent_Conditional_52_Conditional_17_For_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 41);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const portfolio_r9 = ctx.$implicit;
    \u0275\u0275property("ngValue", portfolio_r9.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(portfolio_r9.name);
  }
}
function BlacklistMaintenanceComponent_Conditional_52_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 36)(1, "select", 40);
    \u0275\u0275twoWayListener("ngModelChange", function BlacklistMaintenanceComponent_Conditional_52_Conditional_17_Template_select_ngModelChange_1_listener($event) {
      \u0275\u0275restoreView(_r8);
      const ctx_r4 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r4.filterPortfolioId, $event) || (ctx_r4.filterPortfolioId = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function BlacklistMaintenanceComponent_Conditional_52_Conditional_17_Template_select_ngModelChange_1_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r4 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r4.onFilterPortfolioChange());
    });
    \u0275\u0275elementStart(2, "option", 41);
    \u0275\u0275text(3, "Todas");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(4, BlacklistMaintenanceComponent_Conditional_52_Conditional_17_For_5_Template, 2, 2, "option", 41, _forTrack0);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r4 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("ngModel", ctx_r4.filterPortfolioId);
    \u0275\u0275advance();
    \u0275\u0275property("ngValue", null);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r4.getFilteredPortfolios());
  }
}
function BlacklistMaintenanceComponent_Conditional_52_Conditional_24_For_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 41);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const subPortfolio_r11 = ctx.$implicit;
    \u0275\u0275property("ngValue", subPortfolio_r11.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(subPortfolio_r11.name);
  }
}
function BlacklistMaintenanceComponent_Conditional_52_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 36)(1, "select", 40);
    \u0275\u0275twoWayListener("ngModelChange", function BlacklistMaintenanceComponent_Conditional_52_Conditional_24_Template_select_ngModelChange_1_listener($event) {
      \u0275\u0275restoreView(_r10);
      const ctx_r4 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r4.filterSubPortfolioId, $event) || (ctx_r4.filterSubPortfolioId = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function BlacklistMaintenanceComponent_Conditional_52_Conditional_24_Template_select_ngModelChange_1_listener() {
      \u0275\u0275restoreView(_r10);
      const ctx_r4 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r4.applyFilters());
    });
    \u0275\u0275elementStart(2, "option", 41);
    \u0275\u0275text(3, "Todas");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(4, BlacklistMaintenanceComponent_Conditional_52_Conditional_24_For_5_Template, 2, 2, "option", 41, _forTrack0);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r4 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("ngModel", ctx_r4.filterSubPortfolioId);
    \u0275\u0275advance();
    \u0275\u0275property("ngValue", null);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r4.getFilteredSubPortfolios());
  }
}
function BlacklistMaintenanceComponent_Conditional_52_Conditional_31_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 36)(1, "div", 42);
    \u0275\u0275element(2, "lucide-angular", 43);
    \u0275\u0275elementStart(3, "input", 44);
    \u0275\u0275twoWayListener("ngModelChange", function BlacklistMaintenanceComponent_Conditional_52_Conditional_31_Template_input_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r12);
      const ctx_r4 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r4.searchTerm, $event) || (ctx_r4.searchTerm = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function BlacklistMaintenanceComponent_Conditional_52_Conditional_31_Template_input_ngModelChange_3_listener() {
      \u0275\u0275restoreView(_r12);
      const ctx_r4 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r4.applyFilters());
    });
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r4 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 14);
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("ngModel", ctx_r4.searchTerm);
  }
}
function BlacklistMaintenanceComponent_Conditional_52_For_42_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr", 39)(1, "td", 45)(2, "div", 46);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "td", 45)(5, "div", 47);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "td", 45)(8, "div", 47);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "td", 45)(11, "div", 47);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "td", 45)(14, "div", 47);
    \u0275\u0275text(15);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "td", 45)(17, "div", 47);
    \u0275\u0275text(18);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(19, "td", 45)(20, "div", 47);
    \u0275\u0275text(21);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(22, "td", 45)(23, "div", 47);
    \u0275\u0275text(24);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const blacklist_r13 = ctx.$implicit;
    const ctx_r4 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(blacklist_r13.tenantName);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(blacklist_r13.portfolioName || "-");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(blacklist_r13.subPortfolioName || "-");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(blacklist_r13.document || "-");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(blacklist_r13.email || "-");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(blacklist_r13.phone || "-");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r4.formatDate(blacklist_r13.startDate));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r4.formatDate(blacklist_r13.endDate));
  }
}
function BlacklistMaintenanceComponent_Conditional_52_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 20)(1, "table", 29)(2, "thead", 30)(3, "tr", 31)(4, "th", 32)(5, "div", 33)(6, "span");
    \u0275\u0275text(7, "Proveedor");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "button", 34);
    \u0275\u0275listener("click", function BlacklistMaintenanceComponent_Conditional_52_Template_button_click_8_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r4 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r4.toggleFilterPopover("tenant"));
    });
    \u0275\u0275element(9, "lucide-angular", 35);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(10, BlacklistMaintenanceComponent_Conditional_52_Conditional_10_Template, 6, 2, "div", 36);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "th", 32)(12, "div", 33)(13, "span");
    \u0275\u0275text(14, "Cartera");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "button", 34);
    \u0275\u0275listener("click", function BlacklistMaintenanceComponent_Conditional_52_Template_button_click_15_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r4 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r4.toggleFilterPopover("portfolio"));
    });
    \u0275\u0275element(16, "lucide-angular", 35);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(17, BlacklistMaintenanceComponent_Conditional_52_Conditional_17_Template, 6, 2, "div", 36);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "th", 32)(19, "div", 33)(20, "span");
    \u0275\u0275text(21, "Subcartera");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "button", 34);
    \u0275\u0275listener("click", function BlacklistMaintenanceComponent_Conditional_52_Template_button_click_22_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r4 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r4.toggleFilterPopover("subportfolio"));
    });
    \u0275\u0275element(23, "lucide-angular", 35);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(24, BlacklistMaintenanceComponent_Conditional_52_Conditional_24_Template, 6, 2, "div", 36);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "th", 32)(26, "div", 33)(27, "span");
    \u0275\u0275text(28, "Documento");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "button", 34);
    \u0275\u0275listener("click", function BlacklistMaintenanceComponent_Conditional_52_Template_button_click_29_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r4 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r4.toggleFilterPopover("document"));
    });
    \u0275\u0275element(30, "lucide-angular", 35);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(31, BlacklistMaintenanceComponent_Conditional_52_Conditional_31_Template, 4, 2, "div", 36);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(32, "th", 37);
    \u0275\u0275text(33, "Email");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(34, "th", 37);
    \u0275\u0275text(35, "Tel\xE9fono");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(36, "th", 37);
    \u0275\u0275text(37, "Fecha Inicio");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(38, "th", 37);
    \u0275\u0275text(39, "Fecha Fin");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(40, "tbody", 38);
    \u0275\u0275repeaterCreate(41, BlacklistMaintenanceComponent_Conditional_52_For_42_Template, 25, 8, "tr", 39, _forTrack0);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r4 = \u0275\u0275nextContext();
    \u0275\u0275advance(8);
    \u0275\u0275classProp("text-red-400", ctx_r4.filterTenantId);
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r4.openFilterPopover === "tenant" ? 10 : -1);
    \u0275\u0275advance(5);
    \u0275\u0275classProp("text-red-400", ctx_r4.filterPortfolioId);
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r4.openFilterPopover === "portfolio" ? 17 : -1);
    \u0275\u0275advance(5);
    \u0275\u0275classProp("text-red-400", ctx_r4.filterSubPortfolioId);
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r4.openFilterPopover === "subportfolio" ? 24 : -1);
    \u0275\u0275advance(5);
    \u0275\u0275classProp("text-red-400", ctx_r4.searchTerm);
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r4.openFilterPopover === "document" ? 31 : -1);
    \u0275\u0275advance(10);
    \u0275\u0275repeater(ctx_r4.filteredBlacklists());
  }
}
function BlacklistMaintenanceComponent_Conditional_53_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 48);
    \u0275\u0275listener("click", function BlacklistMaintenanceComponent_Conditional_53_Template_div_click_0_listener() {
      \u0275\u0275restoreView(_r14);
      const ctx_r4 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r4.openFilterPopover = null);
    });
    \u0275\u0275elementEnd();
  }
}
function BlacklistMaintenanceComponent_Conditional_54_Template(rf, ctx) {
  if (rf & 1) {
    const _r15 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 22)(1, "div", 49)(2, "div", 50)(3, "div", 51);
    \u0275\u0275element(4, "lucide-angular", 52);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 53)(6, "h3", 54);
    \u0275\u0275text(7, "Error");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "p", 55);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "button", 56);
    \u0275\u0275listener("click", function BlacklistMaintenanceComponent_Conditional_54_Template_button_click_10_listener() {
      \u0275\u0275restoreView(_r15);
      const ctx_r4 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r4.errorMessage.set(null));
    });
    \u0275\u0275element(11, "lucide-angular", 57);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r4 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275property("size", 20);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r4.errorMessage());
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 18);
  }
}
function BlacklistMaintenanceComponent_Conditional_55_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 66)(1, "span", 67);
    \u0275\u0275text(2, "Cartera:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 69);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r4 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r4.getSelectedPortfolioName());
  }
}
function BlacklistMaintenanceComponent_Conditional_55_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 66)(1, "span", 67);
    \u0275\u0275text(2, "Subcartera:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 69);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r4 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r4.getSelectedSubPortfolioName());
  }
}
function BlacklistMaintenanceComponent_Conditional_55_Template(rf, ctx) {
  if (rf & 1) {
    const _r16 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 23)(1, "div", 58)(2, "div", 59)(3, "div", 60)(4, "div", 61);
    \u0275\u0275element(5, "lucide-angular", 62);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "h3", 63);
    \u0275\u0275text(7, "Confirmar Bloqueo");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "p", 64);
    \u0275\u0275text(9, "\xBFEst\xE1 seguro de a\xF1adir este cliente a la blacklist?");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "div", 65)(11, "div", 66)(12, "span", 67);
    \u0275\u0275text(13, "Documento:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "span", 68);
    \u0275\u0275text(15);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "div", 66)(17, "span", 67);
    \u0275\u0275text(18, "Proveedor:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "span", 69);
    \u0275\u0275text(20);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(21, BlacklistMaintenanceComponent_Conditional_55_Conditional_21_Template, 5, 1, "div", 66);
    \u0275\u0275conditionalCreate(22, BlacklistMaintenanceComponent_Conditional_55_Conditional_22_Template, 5, 1, "div", 66);
    \u0275\u0275elementStart(23, "div", 66)(24, "span", 67);
    \u0275\u0275text(25, "Email:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "span", 69);
    \u0275\u0275text(27);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(28, "div", 66)(29, "span", 67);
    \u0275\u0275text(30, "Tel\xE9fono:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "span", 69);
    \u0275\u0275text(32);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(33, "div", 66)(34, "span", 67);
    \u0275\u0275text(35, "Fecha Fin:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(36, "span", 69);
    \u0275\u0275text(37);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(38, "div", 70)(39, "button", 71);
    \u0275\u0275listener("click", function BlacklistMaintenanceComponent_Conditional_55_Template_button_click_39_listener() {
      \u0275\u0275restoreView(_r16);
      const ctx_r4 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r4.closeConfirmDialog());
    });
    \u0275\u0275text(40, " Cancelar ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(41, "button", 72);
    \u0275\u0275listener("click", function BlacklistMaintenanceComponent_Conditional_55_Template_button_click_41_listener() {
      \u0275\u0275restoreView(_r16);
      const ctx_r4 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r4.confirmAddBlacklist());
    });
    \u0275\u0275text(42, " Confirmar ");
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const ctx_r4 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275property("size", 24);
    \u0275\u0275advance(10);
    \u0275\u0275textInterpolate(ctx_r4.document);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r4.getSelectedTenantName());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r4.selectedPortfolioId ? 21 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r4.selectedSubPortfolioId ? 22 : -1);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r4.customerEmail || "No disponible");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r4.customerPhone || "No disponible");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r4.formatDate(ctx_r4.endDate));
  }
}
var _BlacklistMaintenanceComponent = class _BlacklistMaintenanceComponent {
  constructor(blacklistService, typificationService, portfolioService, http) {
    this.blacklistService = blacklistService;
    this.typificationService = typificationService;
    this.portfolioService = portfolioService;
    this.http = http;
    this.blacklists = signal([], ...ngDevMode ? [{ debugName: "blacklists" }] : []);
    this.filteredBlacklists = signal([], ...ngDevMode ? [{ debugName: "filteredBlacklists" }] : []);
    this.tenants = signal([], ...ngDevMode ? [{ debugName: "tenants" }] : []);
    this.portfolios = signal([], ...ngDevMode ? [{ debugName: "portfolios" }] : []);
    this.subPortfolios = signal([], ...ngDevMode ? [{ debugName: "subPortfolios" }] : []);
    this.availableTenants = signal([], ...ngDevMode ? [{ debugName: "availableTenants" }] : []);
    this.availablePortfolios = signal([], ...ngDevMode ? [{ debugName: "availablePortfolios" }] : []);
    this.availableSubPortfolios = signal([], ...ngDevMode ? [{ debugName: "availableSubPortfolios" }] : []);
    this.loading = signal(false, ...ngDevMode ? [{ debugName: "loading" }] : []);
    this.showConfirmDialog = signal(false, ...ngDevMode ? [{ debugName: "showConfirmDialog" }] : []);
    this.openFilterPopover = null;
    this.errorMessage = signal(null, ...ngDevMode ? [{ debugName: "errorMessage" }] : []);
    this.selectedTenantId = null;
    this.selectedPortfolioId = null;
    this.selectedSubPortfolioId = null;
    this.document = "";
    this.endDate = "";
    this.customerId = null;
    this.customerEmail = "";
    this.customerPhone = "";
    this.filterTenantId = null;
    this.filterPortfolioId = null;
    this.filterSubPortfolioId = null;
    this.searchTerm = "";
  }
  ngOnInit() {
    this.loadTenants();
    this.loadBlacklists();
  }
  loadTenants() {
    this.typificationService.getAllTenants().subscribe({
      next: (data) => {
        this.tenants.set(data);
      },
      error: (error) => console.error("Error loading tenants:", error)
    });
  }
  loadBlacklists() {
    this.loading.set(true);
    this.blacklistService.getAllBlacklists().subscribe({
      next: (data) => {
        this.blacklists.set(data);
        this.calculateAvailableFilters();
        this.applyFilters();
        this.loading.set(false);
      },
      error: (error) => {
        console.error("Error loading blacklists:", error);
        this.loading.set(false);
      }
    });
  }
  calculateAvailableFilters() {
    const blacklists = this.blacklists();
    const tenantsMap = /* @__PURE__ */ new Map();
    blacklists.forEach((b) => {
      if (b.tenantId && b.tenantName) {
        tenantsMap.set(b.tenantId, b.tenantName);
      }
    });
    this.availableTenants.set(Array.from(tenantsMap.entries()).map(([id, name]) => ({ id, name })));
    const portfoliosMap = /* @__PURE__ */ new Map();
    blacklists.forEach((b) => {
      if (b.portfolioId && b.portfolioName) {
        portfoliosMap.set(b.portfolioId, b.portfolioName);
      }
    });
    this.availablePortfolios.set(Array.from(portfoliosMap.entries()).map(([id, name]) => ({ id, name })));
    const subPortfoliosMap = /* @__PURE__ */ new Map();
    blacklists.forEach((b) => {
      if (b.subPortfolioId && b.subPortfolioName) {
        subPortfoliosMap.set(b.subPortfolioId, b.subPortfolioName);
      }
    });
    this.availableSubPortfolios.set(Array.from(subPortfoliosMap.entries()).map(([id, name]) => ({ id, name })));
  }
  onTenantChange() {
    this.selectedPortfolioId = null;
    this.selectedSubPortfolioId = null;
    this.portfolios.set([]);
    this.subPortfolios.set([]);
    if (this.selectedTenantId) {
      this.typificationService.getPortfoliosByTenant(this.selectedTenantId).subscribe({
        next: (data) => this.portfolios.set(data),
        error: (error) => console.error("Error loading portfolios:", error)
      });
    }
  }
  onPortfolioChange() {
    this.selectedSubPortfolioId = null;
    this.subPortfolios.set([]);
    if (this.selectedPortfolioId) {
      this.portfolioService.getSubPortfoliosByPortfolio(this.selectedPortfolioId).subscribe({
        next: (data) => this.subPortfolios.set(data),
        error: (error) => console.error("Error loading subportfolios:", error)
      });
    }
  }
  onFilterTenantChange() {
    this.filterPortfolioId = null;
    this.filterSubPortfolioId = null;
    this.applyFilters();
  }
  onFilterPortfolioChange() {
    this.filterSubPortfolioId = null;
    this.applyFilters();
  }
  getFilteredPortfolios() {
    if (!this.filterTenantId) {
      return this.availablePortfolios();
    }
    return this.availablePortfolios().filter((p) => {
      return this.blacklists().some((b) => b.tenantId === this.filterTenantId && b.portfolioId === p.id);
    });
  }
  getFilteredSubPortfolios() {
    if (!this.filterPortfolioId) {
      return this.availableSubPortfolios();
    }
    return this.availableSubPortfolios().filter((sp) => {
      return this.blacklists().some((b) => b.portfolioId === this.filterPortfolioId && b.subPortfolioId === sp.id);
    });
  }
  applyFilters() {
    let filtered = this.blacklists();
    if (this.filterTenantId) {
      filtered = filtered.filter((b) => b.tenantId == this.filterTenantId);
    }
    if (this.filterPortfolioId) {
      filtered = filtered.filter((b) => b.portfolioId == this.filterPortfolioId);
    }
    if (this.filterSubPortfolioId) {
      filtered = filtered.filter((b) => b.subPortfolioId == this.filterSubPortfolioId);
    }
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter((b) => b.document?.toLowerCase().includes(term));
    }
    this.filteredBlacklists.set(filtered);
  }
  canAddBlacklist() {
    return !!(this.selectedTenantId && this.document && this.endDate);
  }
  addToBlacklist() {
    if (!this.canAddBlacklist())
      return;
    const today = /* @__PURE__ */ new Date();
    today.setHours(0, 0, 0, 0);
    const endDateObj = new Date(this.endDate);
    endDateObj.setHours(0, 0, 0, 0);
    if (endDateObj <= today) {
      this.showError("La fecha de fin debe ser mayor al d\xEDa actual");
      return;
    }
    const params = {
      document: this.document,
      tenantId: this.selectedTenantId
    };
    if (this.selectedPortfolioId) {
      params.portfolioId = this.selectedPortfolioId;
    }
    if (this.selectedSubPortfolioId) {
      params.subPortfolioId = this.selectedSubPortfolioId;
    }
    this.http.get(`${environment.apiUrl}/customers/blacklist-contact-info`, { params }).subscribe({
      next: (contactInfo) => {
        this.customerId = contactInfo.customerId ? parseInt(contactInfo.customerId) : null;
        this.customerEmail = contactInfo.email || "";
        this.customerPhone = contactInfo.phone || "";
        this.showConfirmDialog.set(true);
      },
      error: (error) => {
        console.error("Error al obtener informaci\xF3n de contacto:", error);
        if (error.status === 404) {
          this.showError("Cliente no encontrado en el contexto seleccionado (proveedor/cartera/subcartera)");
        } else {
          this.showError("Error al buscar el cliente. Por favor, intente nuevamente.");
        }
      }
    });
  }
  showError(message) {
    this.errorMessage.set(message);
    setTimeout(() => {
      this.errorMessage.set(null);
    }, 4e3);
  }
  closeConfirmDialog() {
    this.showConfirmDialog.set(false);
  }
  getSelectedTenantName() {
    const tenant = this.tenants().find((t) => t.id == this.selectedTenantId);
    return tenant?.tenantName || "";
  }
  getSelectedPortfolioName() {
    const portfolio = this.portfolios().find((p) => p.id == this.selectedPortfolioId);
    return portfolio?.portfolioName || "";
  }
  getSelectedSubPortfolioName() {
    const subPortfolio = this.subPortfolios().find((s) => s.id == this.selectedSubPortfolioId);
    return subPortfolio?.subPortfolioName || "";
  }
  confirmAddBlacklist() {
    const tenant = this.tenants().find((t) => t.id == this.selectedTenantId);
    const portfolio = this.portfolios().find((p) => p.id == this.selectedPortfolioId);
    const subPortfolio = this.subPortfolios().find((s) => s.id == this.selectedSubPortfolioId);
    const blacklist = {
      customerId: this.customerId || void 0,
      tenantId: this.selectedTenantId,
      tenantName: tenant?.tenantName || "",
      portfolioId: this.selectedPortfolioId || void 0,
      portfolioName: portfolio?.portfolioName || void 0,
      subPortfolioId: this.selectedSubPortfolioId || void 0,
      subPortfolioName: subPortfolio?.subPortfolioName || void 0,
      document: this.document,
      email: this.customerEmail,
      phone: this.customerPhone,
      startDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      endDate: this.endDate
    };
    this.blacklistService.createBlacklist(blacklist).subscribe({
      next: () => {
        this.loadBlacklists();
        this.closeConfirmDialog();
        this.resetForm();
      },
      error: (error) => console.error("Error creating blacklist:", error)
    });
  }
  resetForm() {
    this.selectedTenantId = null;
    this.selectedPortfolioId = null;
    this.selectedSubPortfolioId = null;
    this.document = "";
    this.endDate = "";
    this.customerId = null;
    this.customerEmail = "";
    this.customerPhone = "";
    this.portfolios.set([]);
    this.subPortfolios.set([]);
  }
  deleteBlacklist(blacklist) {
    if (confirm(`\xBFEst\xE1s seguro de eliminar este bloqueo?`)) {
      this.blacklistService.deleteBlacklist(blacklist.id).subscribe({
        next: () => this.loadBlacklists(),
        error: (error) => console.error("Error deleting blacklist:", error)
      });
    }
  }
  formatDate(dateString) {
    if (!dateString)
      return "-";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }
  getTomorrowDate() {
    const tomorrow = /* @__PURE__ */ new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  }
  toggleFilterPopover(filterName) {
    if (this.openFilterPopover === filterName) {
      this.openFilterPopover = null;
    } else {
      this.openFilterPopover = filterName;
    }
  }
};
_BlacklistMaintenanceComponent.\u0275fac = function BlacklistMaintenanceComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _BlacklistMaintenanceComponent)(\u0275\u0275directiveInject(BlacklistService), \u0275\u0275directiveInject(TypificationService), \u0275\u0275directiveInject(PortfolioService), \u0275\u0275directiveInject(HttpClient));
};
_BlacklistMaintenanceComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _BlacklistMaintenanceComponent, selectors: [["app-blacklist-maintenance"]], decls: 56, vars: 17, consts: [[1, "min-h-screen", "bg-gradient-to-br", "from-slate-900", "via-slate-800", "to-slate-900", "p-6"], [1, "max-w-7xl", "mx-auto", "mb-6"], [1, "flex", "items-center", "gap-3"], [1, "w-12", "h-12", "bg-gradient-to-br", "from-red-600", "to-red-700", "rounded-xl", "flex", "items-center", "justify-center", "shadow-lg"], ["name", "shield-ban", 1, "text-white", 3, "size"], [1, "text-2xl", "font-bold", "text-white"], [1, "text-sm", "text-gray-400"], [1, "bg-slate-900", "rounded-xl", "p-6", "shadow-sm", "border", "border-slate-800"], [1, "grid", "grid-cols-6", "gap-4"], [1, "block", "text-sm", "font-semibold", "text-gray-300", "mb-2"], [1, "w-full", "px-3", "py-2", "bg-slate-800", "border", "border-slate-700", "rounded-lg", "text-white", "text-sm", "focus:outline-none", "focus:ring-2", "focus:ring-red-500", 3, "ngModelChange", "ngModel"], [3, "value"], [1, "w-full", "px-3", "py-2", "bg-slate-800", "border", "border-slate-700", "rounded-lg", "text-white", "text-sm", "focus:outline-none", "focus:ring-2", "focus:ring-red-500", "disabled:opacity-50", 3, "ngModelChange", "ngModel", "disabled"], ["type", "text", "placeholder", "Ingrese el documento", 1, "w-full", "px-3", "py-2", "bg-slate-800", "border", "border-slate-700", "rounded-lg", "text-white", "text-sm", "placeholder-gray-500", "focus:outline-none", "focus:ring-2", "focus:ring-red-500", 3, "ngModelChange", "ngModel"], ["type", "date", 1, "w-full", "px-3", "py-2", "bg-slate-800", "border", "border-slate-700", "rounded-lg", "text-white", "text-sm", "focus:outline-none", "focus:ring-2", "focus:ring-red-500", 3, "ngModelChange", "ngModel", "min"], [1, "flex", "items-end"], [1, "w-full", "px-4", "py-2", "bg-gradient-to-r", "from-red-600", "to-red-700", "text-white", "rounded-lg", "font-semibold", "hover:shadow-lg", "transition-all", "hover:scale-105", "disabled:opacity-50", "disabled:cursor-not-allowed", "disabled:hover:scale-100", 3, "click", "disabled"], [1, "max-w-7xl", "mx-auto"], [1, "bg-slate-900", "rounded-xl", "shadow-sm", "border", "border-slate-800"], [1, "p-12", "text-center"], [1, "overflow-x-auto", "rounded-xl", "pb-3"], [1, "fixed", "inset-0", "z-40"], [1, "fixed", "top-4", "right-4", "z-50", "animate-slide-in"], [1, "fixed", "inset-0", "bg-black/50", "backdrop-blur-sm", "flex", "items-center", "justify-center", "p-4", "z-50"], [1, "inline-block", "w-8", "h-8", "border-4", "border-red-500", "border-t-transparent", "rounded-full", "animate-spin"], [1, "mt-4", "text-gray-400"], ["name", "shield-ban", 1, "mx-auto", "text-gray-600", "mb-4", 3, "size"], [1, "text-gray-400", "text-lg", "mb-2"], [1, "text-gray-500", "text-sm"], [1, "w-full"], [1, "bg-slate-800/50"], [1, "border-b", "border-slate-700"], [1, "px-2", "py-3", "text-left", "text-xs", "font-semibold", "text-gray-400", "uppercase", "tracking-wider", "relative"], [1, "flex", "items-center", "gap-2"], [1, "p-1", "hover:bg-slate-700", "rounded", "transition-colors", 3, "click"], ["name", "filter", 3, "size"], [1, "absolute", "top-full", "left-0", "mt-1", "bg-slate-800", "border", "border-slate-700", "rounded-lg", "shadow-xl", "p-2", "z-50", "w-48"], [1, "px-2", "py-3", "text-left", "text-xs", "font-semibold", "text-gray-400", "uppercase", "tracking-wider"], [1, "divide-y", "divide-slate-800"], [1, "hover:bg-slate-800/50", "transition-colors"], [1, "w-full", "px-2", "py-1.5", "bg-slate-700", "border", "border-slate-600", "rounded", "text-white", "text-xs", "focus:outline-none", "focus:ring-2", "focus:ring-red-500", 3, "ngModelChange", "ngModel"], [3, "ngValue"], [1, "relative"], ["name", "search", 1, "absolute", "left-2", "top-1/2", "-translate-y-1/2", "text-gray-500", 3, "size"], ["type", "text", "placeholder", "Buscar...", 1, "w-full", "pl-8", "pr-2", "py-1.5", "bg-slate-700", "border", "border-slate-600", "rounded", "text-white", "text-xs", "placeholder-gray-400", "focus:outline-none", "focus:ring-2", "focus:ring-red-500", 3, "ngModelChange", "ngModel"], [1, "px-2", "py-3"], [1, "text-xs", "font-medium", "text-white"], [1, "text-xs", "text-gray-300"], [1, "fixed", "inset-0", "z-40", 3, "click"], [1, "bg-red-900", "border", "border-red-700", "rounded-lg", "shadow-2xl", "p-4", "max-w-md"], [1, "flex", "items-start", "gap-3"], [1, "flex-shrink-0"], ["name", "alert-circle", 1, "text-red-400", 3, "size"], [1, "flex-1"], [1, "text-sm", "font-semibold", "text-white", "mb-1"], [1, "text-sm", "text-red-200"], [1, "flex-shrink-0", "text-red-400", "hover:text-red-300", "transition-colors", 3, "click"], ["name", "x", 3, "size"], [1, "bg-slate-900", "rounded-xl", "shadow-2xl", "border", "border-slate-800", "max-w-md", "w-full"], [1, "p-6"], [1, "flex", "items-center", "gap-3", "mb-4"], [1, "w-12", "h-12", "bg-red-900/30", "rounded-full", "flex", "items-center", "justify-center"], ["name", "shield-ban", 1, "text-red-400", 3, "size"], [1, "text-lg", "font-bold", "text-white"], [1, "text-gray-300", "mb-4"], [1, "bg-slate-800", "rounded-lg", "p-3", "mb-4", "space-y-2", "text-sm"], [1, "flex", "justify-between"], [1, "text-gray-400"], [1, "text-white", "font-semibold"], [1, "text-white"], [1, "flex", "gap-3"], [1, "flex-1", "px-4", "py-2.5", "bg-slate-800", "text-white", "rounded-lg", "font-semibold", "hover:bg-slate-700", "transition-colors", 3, "click"], [1, "flex-1", "px-4", "py-2.5", "bg-gradient-to-r", "from-red-600", "to-red-700", "text-white", "rounded-lg", "font-semibold", "hover:shadow-lg", "transition-all", 3, "click"]], template: function BlacklistMaintenanceComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3);
    \u0275\u0275element(4, "lucide-angular", 4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div")(6, "h1", 5);
    \u0275\u0275text(7, "Gesti\xF3n de Blacklist");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "p", 6);
    \u0275\u0275text(9, "Bloqueo de clientes por proveedor, cartera y subcartera");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(10, "div", 1)(11, "div", 7)(12, "div", 8)(13, "div")(14, "label", 9);
    \u0275\u0275text(15, "Proveedor");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "select", 10);
    \u0275\u0275twoWayListener("ngModelChange", function BlacklistMaintenanceComponent_Template_select_ngModelChange_16_listener($event) {
      \u0275\u0275twoWayBindingSet(ctx.selectedTenantId, $event) || (ctx.selectedTenantId = $event);
      return $event;
    });
    \u0275\u0275listener("ngModelChange", function BlacklistMaintenanceComponent_Template_select_ngModelChange_16_listener() {
      return ctx.onTenantChange();
    });
    \u0275\u0275elementStart(17, "option", 11);
    \u0275\u0275text(18, "Seleccionar");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(19, BlacklistMaintenanceComponent_For_20_Template, 2, 2, "option", 11, _forTrack0);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(21, "div")(22, "label", 9);
    \u0275\u0275text(23, "Cartera");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "select", 12);
    \u0275\u0275twoWayListener("ngModelChange", function BlacklistMaintenanceComponent_Template_select_ngModelChange_24_listener($event) {
      \u0275\u0275twoWayBindingSet(ctx.selectedPortfolioId, $event) || (ctx.selectedPortfolioId = $event);
      return $event;
    });
    \u0275\u0275listener("ngModelChange", function BlacklistMaintenanceComponent_Template_select_ngModelChange_24_listener() {
      return ctx.onPortfolioChange();
    });
    \u0275\u0275elementStart(25, "option", 11);
    \u0275\u0275text(26, "Seleccionar");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(27, BlacklistMaintenanceComponent_For_28_Template, 2, 2, "option", 11, _forTrack0);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(29, "div")(30, "label", 9);
    \u0275\u0275text(31, "Subcartera");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(32, "select", 12);
    \u0275\u0275twoWayListener("ngModelChange", function BlacklistMaintenanceComponent_Template_select_ngModelChange_32_listener($event) {
      \u0275\u0275twoWayBindingSet(ctx.selectedSubPortfolioId, $event) || (ctx.selectedSubPortfolioId = $event);
      return $event;
    });
    \u0275\u0275elementStart(33, "option", 11);
    \u0275\u0275text(34, "Seleccionar");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(35, BlacklistMaintenanceComponent_For_36_Template, 2, 2, "option", 11, _forTrack0);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(37, "div")(38, "label", 9);
    \u0275\u0275text(39, "Documento");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(40, "input", 13);
    \u0275\u0275twoWayListener("ngModelChange", function BlacklistMaintenanceComponent_Template_input_ngModelChange_40_listener($event) {
      \u0275\u0275twoWayBindingSet(ctx.document, $event) || (ctx.document = $event);
      return $event;
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(41, "div")(42, "label", 9);
    \u0275\u0275text(43, "Fecha Fin");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(44, "input", 14);
    \u0275\u0275twoWayListener("ngModelChange", function BlacklistMaintenanceComponent_Template_input_ngModelChange_44_listener($event) {
      \u0275\u0275twoWayBindingSet(ctx.endDate, $event) || (ctx.endDate = $event);
      return $event;
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(45, "div", 15)(46, "button", 16);
    \u0275\u0275listener("click", function BlacklistMaintenanceComponent_Template_button_click_46_listener() {
      return ctx.addToBlacklist();
    });
    \u0275\u0275text(47, " A\xF1adir ");
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275elementStart(48, "div", 17)(49, "div", 18);
    \u0275\u0275conditionalCreate(50, BlacklistMaintenanceComponent_Conditional_50_Template, 4, 0, "div", 19)(51, BlacklistMaintenanceComponent_Conditional_51_Template, 6, 1, "div", 19)(52, BlacklistMaintenanceComponent_Conditional_52_Template, 43, 16, "div", 20);
    \u0275\u0275elementEnd()()();
    \u0275\u0275conditionalCreate(53, BlacklistMaintenanceComponent_Conditional_53_Template, 1, 0, "div", 21);
    \u0275\u0275conditionalCreate(54, BlacklistMaintenanceComponent_Conditional_54_Template, 12, 3, "div", 22);
    \u0275\u0275conditionalCreate(55, BlacklistMaintenanceComponent_Conditional_55_Template, 43, 8, "div", 23);
  }
  if (rf & 2) {
    \u0275\u0275advance(4);
    \u0275\u0275property("size", 24);
    \u0275\u0275advance(12);
    \u0275\u0275twoWayProperty("ngModel", ctx.selectedTenantId);
    \u0275\u0275advance();
    \u0275\u0275property("value", null);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx.tenants());
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx.selectedPortfolioId);
    \u0275\u0275property("disabled", !ctx.selectedTenantId);
    \u0275\u0275advance();
    \u0275\u0275property("value", null);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx.portfolios());
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx.selectedSubPortfolioId);
    \u0275\u0275property("disabled", !ctx.selectedPortfolioId);
    \u0275\u0275advance();
    \u0275\u0275property("value", null);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx.subPortfolios());
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx.document);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx.endDate);
    \u0275\u0275property("min", ctx.getTomorrowDate());
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", !ctx.canAddBlacklist());
    \u0275\u0275advance(4);
    \u0275\u0275conditional(ctx.loading() ? 50 : ctx.filteredBlacklists().length === 0 ? 51 : 52);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx.openFilterPopover ? 53 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx.errorMessage() ? 54 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx.showConfirmDialog() ? 55 : -1);
  }
}, dependencies: [CommonModule, FormsModule, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, SelectControlValueAccessor, NgControlStatus, NgModel, LucideAngularModule, LucideAngularComponent], styles: ["\n\n@keyframes _ngcontent-%COMP%_slideIn {\n  from {\n    transform: translateY(-100%);\n    opacity: 0;\n  }\n  to {\n    transform: translateY(0);\n    opacity: 1;\n  }\n}\n.animate-slide-in[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_slideIn 0.3s ease-out;\n}\n/*# sourceMappingURL=blacklist-maintenance.component.css.map */"] });
var BlacklistMaintenanceComponent = _BlacklistMaintenanceComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BlacklistMaintenanceComponent, [{
    type: Component,
    args: [{ selector: "app-blacklist-maintenance", standalone: true, imports: [CommonModule, FormsModule, LucideAngularModule], template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <!-- Header -->
      <div class="max-w-7xl mx-auto mb-6">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center shadow-lg">
            <lucide-angular name="shield-ban" [size]="24" class="text-white"></lucide-angular>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-white">Gesti\xF3n de Blacklist</h1>
            <p class="text-sm text-gray-400">Bloqueo de clientes por proveedor, cartera y subcartera</p>
          </div>
        </div>
      </div>

      <!-- Formulario de a\xF1adir blacklist -->
      <div class="max-w-7xl mx-auto mb-6">
        <div class="bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-800">
          <div class="grid grid-cols-6 gap-4">
            <!-- Proveedor -->
            <div>
              <label class="block text-sm font-semibold text-gray-300 mb-2">Proveedor</label>
              <select [(ngModel)]="selectedTenantId"
                      (ngModelChange)="onTenantChange()"
                      class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
                <option [value]="null">Seleccionar</option>
                @for (tenant of tenants(); track tenant.id) {
                  <option [value]="tenant.id">{{ tenant.tenantName }}</option>
                }
              </select>
            </div>

            <!-- Cartera -->
            <div>
              <label class="block text-sm font-semibold text-gray-300 mb-2">Cartera</label>
              <select [(ngModel)]="selectedPortfolioId"
                      (ngModelChange)="onPortfolioChange()"
                      [disabled]="!selectedTenantId"
                      class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50">
                <option [value]="null">Seleccionar</option>
                @for (portfolio of portfolios(); track portfolio.id) {
                  <option [value]="portfolio.id">{{ portfolio.portfolioName }}</option>
                }
              </select>
            </div>

            <!-- Subcartera -->
            <div>
              <label class="block text-sm font-semibold text-gray-300 mb-2">Subcartera</label>
              <select [(ngModel)]="selectedSubPortfolioId"
                      [disabled]="!selectedPortfolioId"
                      class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50">
                <option [value]="null">Seleccionar</option>
                @for (subPortfolio of subPortfolios(); track subPortfolio.id) {
                  <option [value]="subPortfolio.id">{{ subPortfolio.subPortfolioName }}</option>
                }
              </select>
            </div>

            <!-- Documento -->
            <div>
              <label class="block text-sm font-semibold text-gray-300 mb-2">Documento</label>
              <input type="text"
                     [(ngModel)]="document"
                     placeholder="Ingrese el documento"
                     class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500">
            </div>

            <!-- Fecha Fin -->
            <div>
              <label class="block text-sm font-semibold text-gray-300 mb-2">Fecha Fin</label>
              <input type="date"
                     [(ngModel)]="endDate"
                     [min]="getTomorrowDate()"
                     class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
            </div>

            <!-- Bot\xF3n A\xF1adir -->
            <div class="flex items-end">
              <button (click)="addToBlacklist()"
                      [disabled]="!canAddBlacklist()"
                      class="w-full px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-semibold hover:shadow-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
                A\xF1adir
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Blacklists Table -->
      <div class="max-w-7xl mx-auto">
        <div class="bg-slate-900 rounded-xl shadow-sm border border-slate-800">
          @if (loading()) {
            <div class="p-12 text-center">
              <div class="inline-block w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
              <p class="mt-4 text-gray-400">Cargando bloqueos...</p>
            </div>
          } @else if (filteredBlacklists().length === 0) {
            <div class="p-12 text-center">
              <lucide-angular name="shield-ban" [size]="48" class="mx-auto text-gray-600 mb-4"></lucide-angular>
              <p class="text-gray-400 text-lg mb-2">No hay bloqueos registrados</p>
              <p class="text-gray-500 text-sm">Usa el formulario de arriba para a\xF1adir un nuevo bloqueo</p>
            </div>
          } @else {
            <div class="overflow-x-auto rounded-xl pb-3">
              <table class="w-full">
                <thead class="bg-slate-800/50">
                  <tr class="border-b border-slate-700">
                    <th class="px-2 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider relative">
                      <div class="flex items-center gap-2">
                        <span>Proveedor</span>
                        <button (click)="toggleFilterPopover('tenant')"
                                class="p-1 hover:bg-slate-700 rounded transition-colors"
                                [class.text-red-400]="filterTenantId">
                          <lucide-angular name="filter" [size]="14"></lucide-angular>
                        </button>
                      </div>
                      @if (openFilterPopover === 'tenant') {
                        <div class="absolute top-full left-0 mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl p-2 z-50 w-48">
                          <select [(ngModel)]="filterTenantId"
                                  (ngModelChange)="onFilterTenantChange()"
                                  class="w-full px-2 py-1.5 bg-slate-700 border border-slate-600 rounded text-white text-xs focus:outline-none focus:ring-2 focus:ring-red-500">
                            <option [ngValue]="null">Todos</option>
                            @for (tenant of availableTenants(); track tenant.id) {
                              <option [ngValue]="tenant.id">{{ tenant.name }}</option>
                            }
                          </select>
                        </div>
                      }
                    </th>
                    <th class="px-2 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider relative">
                      <div class="flex items-center gap-2">
                        <span>Cartera</span>
                        <button (click)="toggleFilterPopover('portfolio')"
                                class="p-1 hover:bg-slate-700 rounded transition-colors"
                                [class.text-red-400]="filterPortfolioId">
                          <lucide-angular name="filter" [size]="14"></lucide-angular>
                        </button>
                      </div>
                      @if (openFilterPopover === 'portfolio') {
                        <div class="absolute top-full left-0 mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl p-2 z-50 w-48">
                          <select [(ngModel)]="filterPortfolioId"
                                  (ngModelChange)="onFilterPortfolioChange()"
                                  class="w-full px-2 py-1.5 bg-slate-700 border border-slate-600 rounded text-white text-xs focus:outline-none focus:ring-2 focus:ring-red-500">
                            <option [ngValue]="null">Todas</option>
                            @for (portfolio of getFilteredPortfolios(); track portfolio.id) {
                              <option [ngValue]="portfolio.id">{{ portfolio.name }}</option>
                            }
                          </select>
                        </div>
                      }
                    </th>
                    <th class="px-2 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider relative">
                      <div class="flex items-center gap-2">
                        <span>Subcartera</span>
                        <button (click)="toggleFilterPopover('subportfolio')"
                                class="p-1 hover:bg-slate-700 rounded transition-colors"
                                [class.text-red-400]="filterSubPortfolioId">
                          <lucide-angular name="filter" [size]="14"></lucide-angular>
                        </button>
                      </div>
                      @if (openFilterPopover === 'subportfolio') {
                        <div class="absolute top-full left-0 mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl p-2 z-50 w-48">
                          <select [(ngModel)]="filterSubPortfolioId"
                                  (ngModelChange)="applyFilters()"
                                  class="w-full px-2 py-1.5 bg-slate-700 border border-slate-600 rounded text-white text-xs focus:outline-none focus:ring-2 focus:ring-red-500">
                            <option [ngValue]="null">Todas</option>
                            @for (subPortfolio of getFilteredSubPortfolios(); track subPortfolio.id) {
                              <option [ngValue]="subPortfolio.id">{{ subPortfolio.name }}</option>
                            }
                          </select>
                        </div>
                      }
                    </th>
                    <th class="px-2 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider relative">
                      <div class="flex items-center gap-2">
                        <span>Documento</span>
                        <button (click)="toggleFilterPopover('document')"
                                class="p-1 hover:bg-slate-700 rounded transition-colors"
                                [class.text-red-400]="searchTerm">
                          <lucide-angular name="filter" [size]="14"></lucide-angular>
                        </button>
                      </div>
                      @if (openFilterPopover === 'document') {
                        <div class="absolute top-full left-0 mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl p-2 z-50 w-48">
                          <div class="relative">
                            <lucide-angular name="search" [size]="14" class="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500"></lucide-angular>
                            <input type="text"
                                   [(ngModel)]="searchTerm"
                                   (ngModelChange)="applyFilters()"
                                   placeholder="Buscar..."
                                   class="w-full pl-8 pr-2 py-1.5 bg-slate-700 border border-slate-600 rounded text-white text-xs placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500">
                          </div>
                        </div>
                      }
                    </th>
                    <th class="px-2 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Email</th>
                    <th class="px-2 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Tel\xE9fono</th>
                    <th class="px-2 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Fecha Inicio</th>
                    <th class="px-2 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Fecha Fin</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-800">
                  @for (blacklist of filteredBlacklists(); track blacklist.id) {
                    <tr class="hover:bg-slate-800/50 transition-colors">
                      <td class="px-2 py-3">
                        <div class="text-xs font-medium text-white">{{ blacklist.tenantName }}</div>
                      </td>
                      <td class="px-2 py-3">
                        <div class="text-xs text-gray-300">{{ blacklist.portfolioName || '-' }}</div>
                      </td>
                      <td class="px-2 py-3">
                        <div class="text-xs text-gray-300">{{ blacklist.subPortfolioName || '-' }}</div>
                      </td>
                      <td class="px-2 py-3">
                        <div class="text-xs text-gray-300">{{ blacklist.document || '-' }}</div>
                      </td>
                      <td class="px-2 py-3">
                        <div class="text-xs text-gray-300">{{ blacklist.email || '-' }}</div>
                      </td>
                      <td class="px-2 py-3">
                        <div class="text-xs text-gray-300">{{ blacklist.phone || '-' }}</div>
                      </td>
                      <td class="px-2 py-3">
                        <div class="text-xs text-gray-300">{{ formatDate(blacklist.startDate) }}</div>
                      </td>
                      <td class="px-2 py-3">
                        <div class="text-xs text-gray-300">{{ formatDate(blacklist.endDate) }}</div>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
        </div>
      </div>
    </div>

    <!-- Overlay para cerrar popovers -->
    @if (openFilterPopover) {
      <div class="fixed inset-0 z-40" (click)="openFilterPopover = null"></div>
    }

    <!-- Toast de error -->
    @if (errorMessage()) {
      <div class="fixed top-4 right-4 z-50 animate-slide-in">
        <div class="bg-red-900 border border-red-700 rounded-lg shadow-2xl p-4 max-w-md">
          <div class="flex items-start gap-3">
            <div class="flex-shrink-0">
              <lucide-angular name="alert-circle" [size]="20" class="text-red-400"></lucide-angular>
            </div>
            <div class="flex-1">
              <h3 class="text-sm font-semibold text-white mb-1">Error</h3>
              <p class="text-sm text-red-200">{{ errorMessage() }}</p>
            </div>
            <button (click)="errorMessage.set(null)"
                    class="flex-shrink-0 text-red-400 hover:text-red-300 transition-colors">
              <lucide-angular name="x" [size]="18"></lucide-angular>
            </button>
          </div>
        </div>
      </div>
    }

    <!-- Popup de confirmaci\xF3n -->
    @if (showConfirmDialog()) {
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div class="bg-slate-900 rounded-xl shadow-2xl border border-slate-800 max-w-md w-full">
          <div class="p-6">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-12 h-12 bg-red-900/30 rounded-full flex items-center justify-center">
                <lucide-angular name="shield-ban" [size]="24" class="text-red-400"></lucide-angular>
              </div>
              <h3 class="text-lg font-bold text-white">Confirmar Bloqueo</h3>
            </div>
            <p class="text-gray-300 mb-4">\xBFEst\xE1 seguro de a\xF1adir este cliente a la blacklist?</p>
            <div class="bg-slate-800 rounded-lg p-3 mb-4 space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-400">Documento:</span>
                <span class="text-white font-semibold">{{ document }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Proveedor:</span>
                <span class="text-white">{{ getSelectedTenantName() }}</span>
              </div>
              @if (selectedPortfolioId) {
                <div class="flex justify-between">
                  <span class="text-gray-400">Cartera:</span>
                  <span class="text-white">{{ getSelectedPortfolioName() }}</span>
                </div>
              }
              @if (selectedSubPortfolioId) {
                <div class="flex justify-between">
                  <span class="text-gray-400">Subcartera:</span>
                  <span class="text-white">{{ getSelectedSubPortfolioName() }}</span>
                </div>
              }
              <div class="flex justify-between">
                <span class="text-gray-400">Email:</span>
                <span class="text-white">{{ customerEmail || 'No disponible' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Tel\xE9fono:</span>
                <span class="text-white">{{ customerPhone || 'No disponible' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Fecha Fin:</span>
                <span class="text-white">{{ formatDate(endDate) }}</span>
              </div>
            </div>
            <div class="flex gap-3">
              <button (click)="closeConfirmDialog()"
                      class="flex-1 px-4 py-2.5 bg-slate-800 text-white rounded-lg font-semibold hover:bg-slate-700 transition-colors">
                Cancelar
              </button>
              <button (click)="confirmAddBlacklist()"
                      class="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
                Confirmar
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `, styles: ["/* angular:styles/component:css;bd94950073832d0d6070ea2629b5b5784d7dea48ede39b889ffee9a06a991f2c;C:/Users/HP/Documents/Kubito-2.0-v1/cashi-discador-frontend/cashi-discador-frontend/src/app/maintenance/components/blacklist-maintenance/blacklist-maintenance.component.ts */\n@keyframes slideIn {\n  from {\n    transform: translateY(-100%);\n    opacity: 0;\n  }\n  to {\n    transform: translateY(0);\n    opacity: 1;\n  }\n}\n.animate-slide-in {\n  animation: slideIn 0.3s ease-out;\n}\n/*# sourceMappingURL=blacklist-maintenance.component.css.map */\n"] }]
  }], () => [{ type: BlacklistService }, { type: TypificationService }, { type: PortfolioService }, { type: HttpClient }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(BlacklistMaintenanceComponent, { className: "BlacklistMaintenanceComponent", filePath: "src/app/maintenance/components/blacklist-maintenance/blacklist-maintenance.component.ts", lineNumber: 360 });
})();
export {
  BlacklistMaintenanceComponent
};
//# sourceMappingURL=chunk-CIURFG5G.js.map
