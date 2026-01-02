import {
  TenantService
} from "./chunk-RDUKPQZZ.js";
import {
  PortfolioService
} from "./chunk-K6HKS25L.js";
import {
  Router
} from "./chunk-OCZLH7K5.js";
import "./chunk-ZQICQP3Y.js";
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
  HttpParams,
  Injectable,
  Subject,
  catchError,
  debounceTime,
  distinctUntilChanged,
  of,
  setClassMetadata,
  signal,
  switchMap,
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
  ɵɵstyleProp,
  ɵɵtext,
  ɵɵtextInterpolate
} from "./chunk-CTRHJBBW.js";

// src/app/core/services/client-search.service.ts
var _ClientSearchService = class _ClientSearchService {
  constructor(http) {
    this.http = http;
    this.apiUrl = `${environment.apiUrl}/client-search`;
  }
  /**
   * Busca un cliente por documento exacto
   */
  findClientByDocumento(tenantId, portfolioId, subPortfolioId, documento) {
    const params = new HttpParams().set("tenantId", tenantId.toString()).set("portfolioId", portfolioId.toString()).set("subPortfolioId", subPortfolioId.toString()).set("documento", documento);
    return this.http.get(`${this.apiUrl}/find`, { params });
  }
  /**
   * Busca clientes por documento parcial (autocompletado)
   */
  searchClientsByDocumento(tenantId, portfolioId, subPortfolioId, documento, limit = 10) {
    const params = new HttpParams().set("tenantId", tenantId.toString()).set("portfolioId", portfolioId.toString()).set("subPortfolioId", subPortfolioId.toString()).set("documento", documento).set("limit", limit.toString());
    return this.http.get(`${this.apiUrl}/search`, { params });
  }
};
_ClientSearchService.\u0275fac = function ClientSearchService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _ClientSearchService)(\u0275\u0275inject(HttpClient));
};
_ClientSearchService.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ClientSearchService, factory: _ClientSearchService.\u0275fac, providedIn: "root" });
var ClientSearchService = _ClientSearchService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ClientSearchService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{ type: HttpClient }], null);
})();

// src/app/features/manual-management/manual-management.component.ts
var _forTrack0 = ($index, $item) => $item.id;
var _forTrack1 = ($index, $item) => $item.documento;
function ManualManagementComponent_For_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 16);
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
function ManualManagementComponent_For_31_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 16);
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
function ManualManagementComponent_For_39_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 16);
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
function ManualManagementComponent_Conditional_40_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 17);
    \u0275\u0275element(1, "lucide-angular", 26);
    \u0275\u0275elementStart(2, "span", 27);
    \u0275\u0275text(3, "Selecciona inquilino, cartera y subcartera para buscar clientes");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 16);
  }
}
function ManualManagementComponent_Conditional_50_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "lucide-angular", 28);
    \u0275\u0275text(1, " Buscando... ");
  }
  if (rf & 2) {
    \u0275\u0275property("size", 16);
  }
}
function ManualManagementComponent_Conditional_51_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "lucide-angular", 29);
    \u0275\u0275text(1, " Buscar ");
  }
  if (rf & 2) {
    \u0275\u0275property("size", 16);
  }
}
function ManualManagementComponent_Conditional_52_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 31);
    \u0275\u0275listener("click", function ManualManagementComponent_Conditional_52_For_2_Template_div_click_0_listener() {
      const client_r5 = \u0275\u0275restoreView(_r4).$implicit;
      const ctx_r5 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r5.selectClient(client_r5));
    });
    \u0275\u0275elementStart(1, "span", 32);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 33);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 34);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275element(7, "lucide-angular", 35);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const client_r5 = ctx.$implicit;
    const \u0275$index_108_r7 = ctx.$index;
    const ctx_r5 = \u0275\u0275nextContext(2);
    \u0275\u0275styleProp("animation-delay", \u0275$index_108_r7 * 50 + "ms");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(client_r5.documento);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r5.getClientName(client_r5));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r5.getClientPhone(client_r5));
    \u0275\u0275advance();
    \u0275\u0275property("size", 16);
  }
}
function ManualManagementComponent_Conditional_52_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 24);
    \u0275\u0275repeaterCreate(1, ManualManagementComponent_Conditional_52_For_2_Template, 8, 6, "div", 30, _forTrack1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r5 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r5.searchResults());
  }
}
function ManualManagementComponent_Conditional_53_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 25);
    \u0275\u0275element(1, "lucide-angular", 36);
    \u0275\u0275elementStart(2, "span", 37);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r5 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("size", 16);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r5.searchError());
  }
}
var _ManualManagementComponent = class _ManualManagementComponent {
  constructor(router, clientSearchService, tenantService, portfolioService) {
    this.router = router;
    this.clientSearchService = clientSearchService;
    this.tenantService = tenantService;
    this.portfolioService = portfolioService;
    this.tenants = [];
    this.portfolios = [];
    this.subPortfolios = [];
    this.selectedTenantId = signal(null, ...ngDevMode ? [{ debugName: "selectedTenantId" }] : []);
    this.selectedPortfolioId = signal(null, ...ngDevMode ? [{ debugName: "selectedPortfolioId" }] : []);
    this.selectedSubPortfolioId = signal(null, ...ngDevMode ? [{ debugName: "selectedSubPortfolioId" }] : []);
    this.loadingTenants = signal(false, ...ngDevMode ? [{ debugName: "loadingTenants" }] : []);
    this.loadingPortfolios = signal(false, ...ngDevMode ? [{ debugName: "loadingPortfolios" }] : []);
    this.loadingSubPortfolios = signal(false, ...ngDevMode ? [{ debugName: "loadingSubPortfolios" }] : []);
    this.searchDocument = signal("", ...ngDevMode ? [{ debugName: "searchDocument" }] : []);
    this.searchResults = signal([], ...ngDevMode ? [{ debugName: "searchResults" }] : []);
    this.searching = signal(false, ...ngDevMode ? [{ debugName: "searching" }] : []);
    this.searchError = signal("", ...ngDevMode ? [{ debugName: "searchError" }] : []);
    this.searchSubject = new Subject();
  }
  ngOnInit() {
    this.setupSearchAutocomplete();
    this.loadTenants();
  }
  // ========== CARGA DE SELECTORES EN CASCADA ==========
  loadTenants() {
    this.loadingTenants.set(true);
    this.tenantService.getAllTenants().subscribe({
      next: (tenants) => {
        this.tenants = tenants;
        this.loadingTenants.set(false);
      },
      error: (err) => {
        console.error("Error cargando inquilinos:", err);
        this.loadingTenants.set(false);
      }
    });
  }
  onTenantChange(tenantId) {
    this.selectedTenantId.set(tenantId);
    this.selectedPortfolioId.set(null);
    this.selectedSubPortfolioId.set(null);
    this.portfolios = [];
    this.subPortfolios = [];
    this.clearSearch();
    if (tenantId) {
      this.loadingPortfolios.set(true);
      this.portfolioService.getPortfoliosByTenant(tenantId).subscribe({
        next: (portfolios) => {
          this.portfolios = portfolios.filter((p) => p.isActive);
          this.loadingPortfolios.set(false);
        },
        error: (err) => {
          console.error("Error cargando carteras:", err);
          this.loadingPortfolios.set(false);
        }
      });
    }
  }
  onPortfolioChange(portfolioId) {
    this.selectedPortfolioId.set(portfolioId);
    this.selectedSubPortfolioId.set(null);
    this.subPortfolios = [];
    this.clearSearch();
    if (portfolioId) {
      this.loadingSubPortfolios.set(true);
      this.portfolioService.getSubPortfoliosByPortfolio(portfolioId).subscribe({
        next: (subPortfolios) => {
          this.subPortfolios = subPortfolios.filter((sp) => sp.isActive);
          this.loadingSubPortfolios.set(false);
        },
        error: (err) => {
          console.error("Error cargando subcarteras:", err);
          this.loadingSubPortfolios.set(false);
        }
      });
    }
  }
  onSubPortfolioChange(subPortfolioId) {
    this.selectedSubPortfolioId.set(subPortfolioId);
    this.clearSearch();
  }
  canSearch() {
    return this.selectedTenantId() !== null && this.selectedPortfolioId() !== null && this.selectedSubPortfolioId() !== null;
  }
  // ========== BÚSQUEDA DE CLIENTE ==========
  setupSearchAutocomplete() {
    this.searchSubject.pipe(debounceTime(300), distinctUntilChanged(), switchMap((term) => {
      if (!term || term.length < 3 || !this.canSearch()) {
        return of([]);
      }
      this.searching.set(true);
      this.searchError.set("");
      return this.clientSearchService.searchClientsByDocumento(this.selectedTenantId(), this.selectedPortfolioId(), this.selectedSubPortfolioId(), term, 10).pipe(catchError((err) => {
        console.error("Error buscando clientes:", err);
        this.searchError.set("Error al buscar clientes");
        return of([]);
      }));
    })).subscribe((results) => {
      this.searching.set(false);
      this.searchResults.set(results);
    });
  }
  onSearchInput(event) {
    const value = event.target.value;
    this.searchDocument.set(value);
    this.searchSubject.next(value);
  }
  searchByDocument() {
    const documento = this.searchDocument();
    if (!documento) {
      this.searchError.set("Ingresa un documento para buscar");
      return;
    }
    if (!this.canSearch()) {
      this.searchError.set("Selecciona inquilino, cartera y subcartera primero");
      return;
    }
    this.searching.set(true);
    this.searchError.set("");
    this.clientSearchService.findClientByDocumento(this.selectedTenantId(), this.selectedPortfolioId(), this.selectedSubPortfolioId(), documento).subscribe({
      next: (client) => {
        this.searching.set(false);
        this.navigateToCollectionManagement(client);
      },
      error: (err) => {
        this.searching.set(false);
        if (err.status === 404) {
          this.searchError.set("Cliente no encontrado con ese documento");
        } else {
          this.searchError.set("Error al buscar el cliente");
        }
        console.error("Error:", err);
      }
    });
  }
  selectClient(client) {
    this.navigateToCollectionManagement(client);
  }
  navigateToCollectionManagement(client) {
    this.router.navigate(["/collection-management"], {
      queryParams: {
        documento: client.documento,
        tenantId: this.selectedTenantId(),
        portfolioId: this.selectedPortfolioId(),
        subPortfolioId: this.selectedSubPortfolioId(),
        source: "manual"
      }
    });
  }
  clearSearch() {
    this.searchDocument.set("");
    this.searchResults.set([]);
    this.searchError.set("");
  }
  // ========== HELPERS ==========
  getClientName(client) {
    if (client.nombre)
      return client.nombre;
    const nombres = client.nombres || "";
    const apellidos = client.apellidos || "";
    return `${nombres} ${apellidos}`.trim() || "Sin nombre";
  }
  getClientPhone(client) {
    return client.telefono || client.telefono_1 || client.telefono_2 || "Sin tel\xE9fono";
  }
};
_ManualManagementComponent.\u0275fac = function ManualManagementComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _ManualManagementComponent)(\u0275\u0275directiveInject(Router), \u0275\u0275directiveInject(ClientSearchService), \u0275\u0275directiveInject(TenantService), \u0275\u0275directiveInject(PortfolioService));
};
_ManualManagementComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ManualManagementComponent, selectors: [["app-manual-management"]], decls: 54, vars: 20, consts: [[1, "min-h-screen", "bg-gray-100", "dark:bg-slate-950", "p-4", "transition-colors", "duration-300"], [1, "flex", "items-center", "gap-2", "mb-3", "animate-fade-in"], [1, "w-8", "h-8", "bg-gradient-to-br", "from-blue-600", "to-blue-700", "rounded-lg", "flex", "items-center", "justify-center", "shadow-lg", "shadow-blue-500/20", "hover:shadow-blue-500/40", "hover:scale-110", "transition-all", "duration-300"], ["name", "clipboard-edit", 1, "text-white", 3, "size"], [1, "text-lg", "font-bold", "text-slate-800", "dark:text-white", "transition-colors", "duration-300"], [1, "text-xs", "text-slate-500", "dark:text-gray-400", "transition-colors", "duration-300"], [1, "section"], [1, "bg-white", "dark:bg-slate-900", "rounded-xl", "border", "border-slate-200", "dark:border-slate-800", "p-4", "mb-4", "shadow-sm", "hover:shadow-md", "transition-all", "duration-300", "animate-slide-in"], [1, "flex", "items-center", "gap-2", "mb-4"], ["name", "building-2", 1, "text-blue-500", "dark:text-blue-400", "transition-colors", "duration-300", 3, "size"], [1, "text-sm", "font-semibold", "text-slate-800", "dark:text-white", "transition-colors", "duration-300"], [1, "grid", "grid-cols-1", "md:grid-cols-3", "gap-4"], [1, "transform", "hover:scale-[1.02]", "transition-transform", "duration-200"], [1, "block", "text-xs", "text-slate-500", "dark:text-gray-400", "mb-1.5", "transition-colors", "duration-300"], [1, "w-full", "bg-slate-100", "dark:bg-slate-800", "border", "border-slate-300", "dark:border-slate-700", "rounded-lg", "px-3", "py-2", "text-sm", "text-slate-800", "dark:text-white", "focus:outline-none", "focus:ring-2", "focus:ring-blue-500", "focus:border-transparent", "disabled:opacity-50", "transition-all", "duration-200", "hover:border-blue-400", "cursor-pointer", 3, "change", "value", "disabled"], ["value", ""], [3, "value"], [1, "flex", "items-center", "gap-2", "mt-3", "px-3", "py-2", "bg-amber-100", "dark:bg-amber-500/10", "border", "border-amber-300", "dark:border-amber-500/20", "rounded-lg", "transition-all", "duration-300", "animate-pulse-subtle"], [1, "bg-white", "dark:bg-slate-900", "rounded-xl", "border", "border-slate-200", "dark:border-slate-800", "p-4", "shadow-sm", "hover:shadow-md", "transition-all", "duration-300", "animate-slide-in-delayed"], ["name", "search", 1, "text-green-500", "dark:text-green-400", "transition-colors", "duration-300", 3, "size"], [1, "flex", "gap-3"], [1, "flex-1", "relative", "group"], ["type", "text", "placeholder", "Ingresa el documento del cliente (DNI/C\xE9dula)", 1, "w-full", "bg-slate-100", "dark:bg-slate-800", "border", "border-slate-300", "dark:border-slate-700", "rounded-lg", "px-4", "py-2.5", "text-sm", "text-slate-800", "dark:text-white", "placeholder-slate-400", "dark:placeholder-gray-500", "focus:outline-none", "focus:ring-2", "focus:ring-green-500", "focus:border-transparent", "disabled:opacity-50", "transition-all", "duration-200", "hover:border-green-400", "group-hover:shadow-sm", 3, "input", "keyup.enter", "value", "disabled"], [1, "px-5", "py-2.5", "bg-gradient-to-r", "from-green-600", "to-green-700", "hover:from-green-500", "hover:to-green-600", "disabled:from-gray-400", "disabled:to-gray-500", "dark:disabled:from-gray-600", "dark:disabled:to-gray-700", "text-white", "text-sm", "font-semibold", "rounded-lg", "transition-all", "duration-300", "flex", "items-center", "gap-2", "disabled:cursor-not-allowed", "hover:shadow-lg", "hover:shadow-green-500/30", "hover:scale-105", "active:scale-95", 3, "click", "disabled"], [1, "mt-3", "bg-slate-100", "dark:bg-slate-800", "border", "border-slate-300", "dark:border-slate-700", "rounded-lg", "overflow-hidden", "max-h-48", "overflow-y-auto", "shadow-inner", "transition-all", "duration-300", "animate-scale-in"], [1, "flex", "items-center", "gap-2", "mt-3", "px-3", "py-2", "bg-red-100", "dark:bg-red-500/10", "border", "border-red-300", "dark:border-red-500/20", "rounded-lg", "transition-all", "duration-300", "animate-shake"], ["name", "info", 1, "text-amber-600", "dark:text-amber-400", "transition-colors", "duration-300", 3, "size"], [1, "text-xs", "text-amber-700", "dark:text-amber-400", "transition-colors", "duration-300"], ["name", "loader-2", 1, "animate-spin", 3, "size"], ["name", "search", 3, "size"], [1, "flex", "items-center", "gap-4", "px-4", "py-3", "hover:bg-slate-200", "dark:hover:bg-slate-700", "cursor-pointer", "border-b", "border-slate-300", "dark:border-slate-700", "last:border-b-0", "transition-all", "duration-200", "hover:pl-6", 3, "animation-delay"], [1, "flex", "items-center", "gap-4", "px-4", "py-3", "hover:bg-slate-200", "dark:hover:bg-slate-700", "cursor-pointer", "border-b", "border-slate-300", "dark:border-slate-700", "last:border-b-0", "transition-all", "duration-200", "hover:pl-6", 3, "click"], [1, "text-blue-600", "dark:text-blue-400", "font-semibold", "text-sm", "min-w-[100px]", "transition-colors", "duration-200"], [1, "flex-1", "text-slate-800", "dark:text-white", "text-sm", "transition-colors", "duration-200"], [1, "text-slate-500", "dark:text-gray-400", "text-xs", "transition-colors", "duration-200"], ["name", "chevron-right", 1, "text-slate-400", "dark:text-slate-500", "opacity-0", "group-hover:opacity-100", "transition-all", "duration-200", 3, "size"], ["name", "alert-circle", 1, "text-red-500", "dark:text-red-400", "transition-colors", "duration-300", 3, "size"], [1, "text-xs", "text-red-600", "dark:text-red-400", "transition-colors", "duration-300"]], template: function ManualManagementComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2);
    \u0275\u0275element(3, "lucide-angular", 3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div")(5, "h1", 4);
    \u0275\u0275text(6, "Gesti\xF3n Manual");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p", 5);
    \u0275\u0275text(8, "Busca un cliente por documento para tipificar");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(9, "div", 6)(10, "div", 7)(11, "div", 8);
    \u0275\u0275element(12, "lucide-angular", 9);
    \u0275\u0275elementStart(13, "span", 10);
    \u0275\u0275text(14, "Seleccionar Contexto");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "div", 11)(16, "div", 12)(17, "label", 13);
    \u0275\u0275text(18, "Inquilino");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "select", 14);
    \u0275\u0275listener("change", function ManualManagementComponent_Template_select_change_19_listener($event) {
      return ctx.onTenantChange($event.target.value);
    });
    \u0275\u0275elementStart(20, "option", 15);
    \u0275\u0275text(21, "Seleccionar...");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(22, ManualManagementComponent_For_23_Template, 2, 2, "option", 16, _forTrack0);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(24, "div", 12)(25, "label", 13);
    \u0275\u0275text(26, "Cartera");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "select", 14);
    \u0275\u0275listener("change", function ManualManagementComponent_Template_select_change_27_listener($event) {
      return ctx.onPortfolioChange($event.target.value);
    });
    \u0275\u0275elementStart(28, "option", 15);
    \u0275\u0275text(29, "Seleccionar...");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(30, ManualManagementComponent_For_31_Template, 2, 2, "option", 16, _forTrack0);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(32, "div", 12)(33, "label", 13);
    \u0275\u0275text(34, "Subcartera");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(35, "select", 14);
    \u0275\u0275listener("change", function ManualManagementComponent_Template_select_change_35_listener($event) {
      return ctx.onSubPortfolioChange($event.target.value);
    });
    \u0275\u0275elementStart(36, "option", 15);
    \u0275\u0275text(37, "Seleccionar...");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(38, ManualManagementComponent_For_39_Template, 2, 2, "option", 16, _forTrack0);
    \u0275\u0275elementEnd()()();
    \u0275\u0275conditionalCreate(40, ManualManagementComponent_Conditional_40_Template, 4, 1, "div", 17);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(41, "div", 18)(42, "div", 8);
    \u0275\u0275element(43, "lucide-angular", 19);
    \u0275\u0275elementStart(44, "span", 10);
    \u0275\u0275text(45, "Buscar Cliente");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(46, "div", 20)(47, "div", 21)(48, "input", 22);
    \u0275\u0275listener("input", function ManualManagementComponent_Template_input_input_48_listener($event) {
      return ctx.onSearchInput($event);
    })("keyup.enter", function ManualManagementComponent_Template_input_keyup_enter_48_listener() {
      return ctx.searchByDocument();
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(49, "button", 23);
    \u0275\u0275listener("click", function ManualManagementComponent_Template_button_click_49_listener() {
      return ctx.searchByDocument();
    });
    \u0275\u0275conditionalCreate(50, ManualManagementComponent_Conditional_50_Template, 2, 1)(51, ManualManagementComponent_Conditional_51_Template, 2, 1);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(52, ManualManagementComponent_Conditional_52_Template, 3, 0, "div", 24);
    \u0275\u0275conditionalCreate(53, ManualManagementComponent_Conditional_53_Template, 4, 2, "div", 25);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    \u0275\u0275advance(3);
    \u0275\u0275property("size", 16);
    \u0275\u0275advance(9);
    \u0275\u0275property("size", 18);
    \u0275\u0275advance(7);
    \u0275\u0275property("value", ctx.selectedTenantId())("disabled", ctx.loadingTenants());
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx.tenants);
    \u0275\u0275advance(5);
    \u0275\u0275property("value", ctx.selectedPortfolioId())("disabled", !ctx.selectedTenantId() || ctx.loadingPortfolios());
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx.portfolios);
    \u0275\u0275advance(5);
    \u0275\u0275property("value", ctx.selectedSubPortfolioId())("disabled", !ctx.selectedPortfolioId() || ctx.loadingSubPortfolios());
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx.subPortfolios);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(!ctx.canSearch() ? 40 : -1);
    \u0275\u0275advance();
    \u0275\u0275classProp("opacity-50", !ctx.canSearch())("pointer-events-none", !ctx.canSearch());
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 18);
    \u0275\u0275advance(5);
    \u0275\u0275property("value", ctx.searchDocument())("disabled", !ctx.canSearch());
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx.searching() || !ctx.canSearch());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx.searching() ? 50 : 51);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx.searchResults().length > 0 ? 52 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx.searchError() ? 53 : -1);
  }
}, dependencies: [
  CommonModule,
  LucideAngularModule,
  LucideAngularComponent
], styles: ["\n\n.section[_ngcontent-%COMP%] {\n  max-width: 900px;\n  margin: 0 auto;\n}\n@keyframes _ngcontent-%COMP%_fadeIn {\n  from {\n    opacity: 0;\n    transform: translateY(-10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n@keyframes _ngcontent-%COMP%_slideIn {\n  from {\n    opacity: 0;\n    transform: translateX(-20px);\n  }\n  to {\n    opacity: 1;\n    transform: translateX(0);\n  }\n}\n@keyframes _ngcontent-%COMP%_scaleIn {\n  from {\n    opacity: 0;\n    transform: scale(0.95);\n  }\n  to {\n    opacity: 1;\n    transform: scale(1);\n  }\n}\n@keyframes _ngcontent-%COMP%_shake {\n  0%, 100% {\n    transform: translateX(0);\n  }\n  10%, 30%, 50%, 70%, 90% {\n    transform: translateX(-4px);\n  }\n  20%, 40%, 60%, 80% {\n    transform: translateX(4px);\n  }\n}\n@keyframes _ngcontent-%COMP%_pulseSubtle {\n  0%, 100% {\n    opacity: 1;\n  }\n  50% {\n    opacity: 0.7;\n  }\n}\n.animate-fade-in[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_fadeIn 0.4s ease-out forwards;\n}\n.animate-slide-in[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_slideIn 0.5s ease-out forwards;\n}\n.animate-slide-in-delayed[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_slideIn 0.5s ease-out 0.1s forwards;\n  opacity: 0;\n}\n.animate-scale-in[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_scaleIn 0.3s ease-out forwards;\n}\n.animate-shake[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_shake 0.5s ease-in-out;\n}\n.animate-pulse-subtle[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_pulseSubtle 2s ease-in-out infinite;\n}\n*[_ngcontent-%COMP%] {\n  transition-property:\n    background-color,\n    border-color,\n    color,\n    fill,\n    stroke,\n    box-shadow;\n  transition-timing-function: ease-in-out;\n  transition-duration: 200ms;\n}\nselect[_ngcontent-%COMP%]:hover:not(:disabled), \ninput[_ngcontent-%COMP%]:hover:not(:disabled) {\n  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);\n}\nselect[_ngcontent-%COMP%]:focus, \ninput[_ngcontent-%COMP%]:focus {\n  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);\n}\n.overflow-y-auto[_ngcontent-%COMP%]::-webkit-scrollbar {\n  width: 6px;\n}\n.overflow-y-auto[_ngcontent-%COMP%]::-webkit-scrollbar-track {\n  background: transparent;\n}\n.overflow-y-auto[_ngcontent-%COMP%]::-webkit-scrollbar-thumb {\n  background: #94a3b8;\n  border-radius: 3px;\n}\n.overflow-y-auto[_ngcontent-%COMP%]::-webkit-scrollbar-thumb:hover {\n  background: #64748b;\n}\nhtml.dark[_nghost-%COMP%]   .overflow-y-auto[_ngcontent-%COMP%]::-webkit-scrollbar-thumb, html.dark   [_nghost-%COMP%]   .overflow-y-auto[_ngcontent-%COMP%]::-webkit-scrollbar-thumb {\n  background: #475569;\n}\nhtml.dark[_nghost-%COMP%]   .overflow-y-auto[_ngcontent-%COMP%]::-webkit-scrollbar-thumb:hover, html.dark   [_nghost-%COMP%]   .overflow-y-auto[_ngcontent-%COMP%]::-webkit-scrollbar-thumb:hover {\n  background: #64748b;\n}\n/*# sourceMappingURL=manual-management.component.css.map */"] });
var ManualManagementComponent = _ManualManagementComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ManualManagementComponent, [{
    type: Component,
    args: [{ selector: "app-manual-management", standalone: true, imports: [
      CommonModule,
      LucideAngularModule
    ], template: `<div class="min-h-screen bg-gray-100 dark:bg-slate-950 p-4 transition-colors duration-300">\r
  <!-- Header -->\r
  <div class="flex items-center gap-2 mb-3 animate-fade-in">\r
    <div class="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-110 transition-all duration-300">\r
      <lucide-angular name="clipboard-edit" [size]="16" class="text-white"></lucide-angular>\r
    </div>\r
    <div>\r
      <h1 class="text-lg font-bold text-slate-800 dark:text-white transition-colors duration-300">Gesti\xF3n Manual</h1>\r
      <p class="text-xs text-slate-500 dark:text-gray-400 transition-colors duration-300">Busca un cliente por documento para tipificar</p>\r
    </div>\r
  </div>\r
\r
  <div class="section">\r
    <!-- Selectores de contexto -->\r
    <div class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 mb-4 shadow-sm hover:shadow-md transition-all duration-300 animate-slide-in">\r
      <div class="flex items-center gap-2 mb-4">\r
        <lucide-angular name="building-2" [size]="18" class="text-blue-500 dark:text-blue-400 transition-colors duration-300"></lucide-angular>\r
        <span class="text-sm font-semibold text-slate-800 dark:text-white transition-colors duration-300">Seleccionar Contexto</span>\r
      </div>\r
\r
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">\r
        <!-- Selector de Inquilino -->\r
        <div class="transform hover:scale-[1.02] transition-transform duration-200">\r
          <label class="block text-xs text-slate-500 dark:text-gray-400 mb-1.5 transition-colors duration-300">Inquilino</label>\r
          <select\r
            [value]="selectedTenantId()"\r
            (change)="onTenantChange($any($event.target).value)"\r
            [disabled]="loadingTenants()"\r
            class="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 transition-all duration-200 hover:border-blue-400 cursor-pointer">\r
            <option value="">Seleccionar...</option>\r
            @for (tenant of tenants; track tenant.id) {\r
              <option [value]="tenant.id">{{ tenant.tenantName }}</option>\r
            }\r
          </select>\r
        </div>\r
\r
        <!-- Selector de Cartera -->\r
        <div class="transform hover:scale-[1.02] transition-transform duration-200">\r
          <label class="block text-xs text-slate-500 dark:text-gray-400 mb-1.5 transition-colors duration-300">Cartera</label>\r
          <select\r
            [value]="selectedPortfolioId()"\r
            (change)="onPortfolioChange($any($event.target).value)"\r
            [disabled]="!selectedTenantId() || loadingPortfolios()"\r
            class="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 transition-all duration-200 hover:border-blue-400 cursor-pointer">\r
            <option value="">Seleccionar...</option>\r
            @for (portfolio of portfolios; track portfolio.id) {\r
              <option [value]="portfolio.id">{{ portfolio.portfolioName }}</option>\r
            }\r
          </select>\r
        </div>\r
\r
        <!-- Selector de Subcartera -->\r
        <div class="transform hover:scale-[1.02] transition-transform duration-200">\r
          <label class="block text-xs text-slate-500 dark:text-gray-400 mb-1.5 transition-colors duration-300">Subcartera</label>\r
          <select\r
            [value]="selectedSubPortfolioId()"\r
            (change)="onSubPortfolioChange($any($event.target).value)"\r
            [disabled]="!selectedPortfolioId() || loadingSubPortfolios()"\r
            class="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 transition-all duration-200 hover:border-blue-400 cursor-pointer">\r
            <option value="">Seleccionar...</option>\r
            @for (subPortfolio of subPortfolios; track subPortfolio.id) {\r
              <option [value]="subPortfolio.id">{{ subPortfolio.subPortfolioName }}</option>\r
            }\r
          </select>\r
        </div>\r
      </div>\r
\r
      @if (!canSearch()) {\r
        <div class="flex items-center gap-2 mt-3 px-3 py-2 bg-amber-100 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-500/20 rounded-lg transition-all duration-300 animate-pulse-subtle">\r
          <lucide-angular name="info" [size]="16" class="text-amber-600 dark:text-amber-400 transition-colors duration-300"></lucide-angular>\r
          <span class="text-xs text-amber-700 dark:text-amber-400 transition-colors duration-300">Selecciona inquilino, cartera y subcartera para buscar clientes</span>\r
        </div>\r
      }\r
    </div>\r
\r
    <!-- Buscador -->\r
    <div class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm hover:shadow-md transition-all duration-300 animate-slide-in-delayed" [class.opacity-50]="!canSearch()" [class.pointer-events-none]="!canSearch()">\r
      <div class="flex items-center gap-2 mb-4">\r
        <lucide-angular name="search" [size]="18" class="text-green-500 dark:text-green-400 transition-colors duration-300"></lucide-angular>\r
        <span class="text-sm font-semibold text-slate-800 dark:text-white transition-colors duration-300">Buscar Cliente</span>\r
      </div>\r
\r
      <div class="flex gap-3">\r
        <div class="flex-1 relative group">\r
          <input\r
            type="text"\r
            [value]="searchDocument()"\r
            (input)="onSearchInput($event)"\r
            (keyup.enter)="searchByDocument()"\r
            [disabled]="!canSearch()"\r
            placeholder="Ingresa el documento del cliente (DNI/C\xE9dula)"\r
            class="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 transition-all duration-200 hover:border-green-400 group-hover:shadow-sm">\r
        </div>\r
        <button\r
          (click)="searchByDocument()"\r
          [disabled]="searching() || !canSearch()"\r
          class="px-5 py-2.5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 disabled:from-gray-400 disabled:to-gray-500 dark:disabled:from-gray-600 dark:disabled:to-gray-700 text-white text-sm font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-green-500/30 hover:scale-105 active:scale-95">\r
          @if (searching()) {\r
            <lucide-angular name="loader-2" [size]="16" class="animate-spin"></lucide-angular>\r
            Buscando...\r
          } @else {\r
            <lucide-angular name="search" [size]="16"></lucide-angular>\r
            Buscar\r
          }\r
        </button>\r
      </div>\r
\r
      <!-- Resultados de autocompletado -->\r
      @if (searchResults().length > 0) {\r
        <div class="mt-3 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg overflow-hidden max-h-48 overflow-y-auto shadow-inner transition-all duration-300 animate-scale-in">\r
          @for (client of searchResults(); track client.documento; let i = $index) {\r
            <div\r
              (click)="selectClient(client)"\r
              class="flex items-center gap-4 px-4 py-3 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer border-b border-slate-300 dark:border-slate-700 last:border-b-0 transition-all duration-200 hover:pl-6"\r
              [style.animation-delay]="i * 50 + 'ms'">\r
              <span class="text-blue-600 dark:text-blue-400 font-semibold text-sm min-w-[100px] transition-colors duration-200">{{ client.documento }}</span>\r
              <span class="flex-1 text-slate-800 dark:text-white text-sm transition-colors duration-200">{{ getClientName(client) }}</span>\r
              <span class="text-slate-500 dark:text-gray-400 text-xs transition-colors duration-200">{{ getClientPhone(client) }}</span>\r
              <lucide-angular name="chevron-right" [size]="16" class="text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 transition-all duration-200"></lucide-angular>\r
            </div>\r
          }\r
        </div>\r
      }\r
\r
      <!-- Error de b\xFAsqueda -->\r
      @if (searchError()) {\r
        <div class="flex items-center gap-2 mt-3 px-3 py-2 bg-red-100 dark:bg-red-500/10 border border-red-300 dark:border-red-500/20 rounded-lg transition-all duration-300 animate-shake">\r
          <lucide-angular name="alert-circle" [size]="16" class="text-red-500 dark:text-red-400 transition-colors duration-300"></lucide-angular>\r
          <span class="text-xs text-red-600 dark:text-red-400 transition-colors duration-300">{{ searchError() }}</span>\r
        </div>\r
      }\r
    </div>\r
  </div>\r
</div>\r
`, styles: ["/* src/app/features/manual-management/manual-management.component.css */\n.section {\n  max-width: 900px;\n  margin: 0 auto;\n}\n@keyframes fadeIn {\n  from {\n    opacity: 0;\n    transform: translateY(-10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n@keyframes slideIn {\n  from {\n    opacity: 0;\n    transform: translateX(-20px);\n  }\n  to {\n    opacity: 1;\n    transform: translateX(0);\n  }\n}\n@keyframes scaleIn {\n  from {\n    opacity: 0;\n    transform: scale(0.95);\n  }\n  to {\n    opacity: 1;\n    transform: scale(1);\n  }\n}\n@keyframes shake {\n  0%, 100% {\n    transform: translateX(0);\n  }\n  10%, 30%, 50%, 70%, 90% {\n    transform: translateX(-4px);\n  }\n  20%, 40%, 60%, 80% {\n    transform: translateX(4px);\n  }\n}\n@keyframes pulseSubtle {\n  0%, 100% {\n    opacity: 1;\n  }\n  50% {\n    opacity: 0.7;\n  }\n}\n.animate-fade-in {\n  animation: fadeIn 0.4s ease-out forwards;\n}\n.animate-slide-in {\n  animation: slideIn 0.5s ease-out forwards;\n}\n.animate-slide-in-delayed {\n  animation: slideIn 0.5s ease-out 0.1s forwards;\n  opacity: 0;\n}\n.animate-scale-in {\n  animation: scaleIn 0.3s ease-out forwards;\n}\n.animate-shake {\n  animation: shake 0.5s ease-in-out;\n}\n.animate-pulse-subtle {\n  animation: pulseSubtle 2s ease-in-out infinite;\n}\n* {\n  transition-property:\n    background-color,\n    border-color,\n    color,\n    fill,\n    stroke,\n    box-shadow;\n  transition-timing-function: ease-in-out;\n  transition-duration: 200ms;\n}\nselect:hover:not(:disabled),\ninput:hover:not(:disabled) {\n  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);\n}\nselect:focus,\ninput:focus {\n  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);\n}\n.overflow-y-auto::-webkit-scrollbar {\n  width: 6px;\n}\n.overflow-y-auto::-webkit-scrollbar-track {\n  background: transparent;\n}\n.overflow-y-auto::-webkit-scrollbar-thumb {\n  background: #94a3b8;\n  border-radius: 3px;\n}\n.overflow-y-auto::-webkit-scrollbar-thumb:hover {\n  background: #64748b;\n}\n:host-context(html.dark) .overflow-y-auto::-webkit-scrollbar-thumb {\n  background: #475569;\n}\n:host-context(html.dark) .overflow-y-auto::-webkit-scrollbar-thumb:hover {\n  background: #64748b;\n}\n/*# sourceMappingURL=manual-management.component.css.map */\n"] }]
  }], () => [{ type: Router }, { type: ClientSearchService }, { type: TenantService }, { type: PortfolioService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ManualManagementComponent, { className: "ManualManagementComponent", filePath: "src/app/features/manual-management/manual-management.component.ts", lineNumber: 25 });
})();
export {
  ManualManagementComponent
};
//# sourceMappingURL=chunk-HB7PMDCN.js.map
