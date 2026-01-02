import {
  TypificationService
} from "./chunk-XGOWMJUN.js";
import {
  PortfolioService
} from "./chunk-K6HKS25L.js";
import {
  CheckboxControlValueAccessor,
  DefaultValueAccessor,
  FormsModule,
  MaxLengthValidator,
  NgControlStatus,
  NgControlStatusGroup,
  NgForm,
  NgModel,
  NgSelectOption,
  RequiredValidator,
  SelectControlValueAccessor,
  ɵNgNoValidate,
  ɵNgSelectMultipleOption
} from "./chunk-GRJ7XAPD.js";
import {
  LucideAngularComponent,
  LucideAngularModule
} from "./chunk-RFBUEVFE.js";
import "./chunk-QF774CZR.js";
import {
  CommonModule,
  Component,
  ViewEncapsulation,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassMap,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-CTRHJBBW.js";

// src/app/maintenance/components/portfolio-maintenance/portfolio-maintenance.component.ts
var _forTrack0 = ($index, $item) => $item.id;
function PortfolioMaintenanceComponent_For_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 13);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const tenant_r1 = ctx.$implicit;
    \u0275\u0275property("value", tenant_r1.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", tenant_r1.tenantName, " (", tenant_r1.tenantCode, ")");
  }
}
function PortfolioMaintenanceComponent_Conditional_25_For_51_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr", 37)(1, "td", 38)(2, "div", 39);
    \u0275\u0275element(3, "lucide-angular", 20);
    \u0275\u0275elementStart(4, "span", 40);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(6, "td", 41)(7, "div", 42);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "td", 41)(10, "div", 43);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "td", 38)(13, "label", 44)(14, "input", 45);
    \u0275\u0275listener("change", function PortfolioMaintenanceComponent_Conditional_25_For_51_Template_input_change_14_listener() {
      const portfolio_r5 = \u0275\u0275restoreView(_r4).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.togglePortfolioStatus(portfolio_r5));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275element(15, "div", 46);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "td", 47)(17, "div", 48)(18, "button", 49);
    \u0275\u0275listener("click", function PortfolioMaintenanceComponent_Conditional_25_For_51_Template_button_click_18_listener() {
      const portfolio_r5 = \u0275\u0275restoreView(_r4).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.openEditDialog(portfolio_r5));
    });
    \u0275\u0275element(19, "lucide-angular", 50);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "button", 51);
    \u0275\u0275listener("click", function PortfolioMaintenanceComponent_Conditional_25_For_51_Template_button_click_20_listener() {
      const portfolio_r5 = \u0275\u0275restoreView(_r4).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.deletePortfolio(portfolio_r5));
    });
    \u0275\u0275element(21, "lucide-angular", 52);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const portfolio_r5 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275property("size", 16);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(portfolio_r5.portfolioCode);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(portfolio_r5.portfolioName);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", portfolio_r5.description || "Sin descripci\xF3n", " ");
    \u0275\u0275advance(3);
    \u0275\u0275property("checked", portfolio_r5.isActive);
    \u0275\u0275advance(5);
    \u0275\u0275property("size", 18);
    \u0275\u0275advance();
    \u0275\u0275classMap(portfolio_r5.hasSubPortfolios ? "text-gray-600 cursor-not-allowed" : "text-red-400 hover:text-red-500 cursor-pointer");
    \u0275\u0275property("disabled", portfolio_r5.hasSubPortfolios)("title", portfolio_r5.hasSubPortfolios ? "No se puede eliminar: tiene subcarteras asociadas" : "Eliminar");
    \u0275\u0275advance();
    \u0275\u0275property("size", 18);
  }
}
function PortfolioMaintenanceComponent_Conditional_25_ForEmpty_52_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 53);
    \u0275\u0275text(2, " No se encontraron carteras ");
    \u0275\u0275elementEnd()();
  }
}
function PortfolioMaintenanceComponent_Conditional_25_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 15)(1, "div", 16)(2, "div", 2)(3, "div")(4, "p", 17);
    \u0275\u0275text(5, "Total Carteras");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p", 18);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "div", 19);
    \u0275\u0275element(9, "lucide-angular", 20);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(10, "div", 16)(11, "div", 2)(12, "div")(13, "p", 17);
    \u0275\u0275text(14, "Activas");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "p", 21);
    \u0275\u0275text(16);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(17, "div", 22);
    \u0275\u0275element(18, "lucide-angular", 23);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(19, "div", 16)(20, "div", 2)(21, "div")(22, "p", 17);
    \u0275\u0275text(23, "Inactivas");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "p", 24);
    \u0275\u0275text(25);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(26, "div", 25);
    \u0275\u0275element(27, "lucide-angular", 26);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(28, "div", 1)(29, "div", 10)(30, "div", 27);
    \u0275\u0275element(31, "lucide-angular", 28);
    \u0275\u0275elementStart(32, "input", 29);
    \u0275\u0275twoWayListener("ngModelChange", function PortfolioMaintenanceComponent_Conditional_25_Template_input_ngModelChange_32_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r2 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r2.searchTerm, $event) || (ctx_r2.searchTerm = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(33, "div", 30)(34, "div", 31)(35, "div", 32)(36, "table", 33)(37, "thead", 34)(38, "tr")(39, "th", 35);
    \u0275\u0275text(40, " C\xF3digo ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(41, "th", 35);
    \u0275\u0275text(42, " Nombre ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(43, "th", 35);
    \u0275\u0275text(44, " Descripci\xF3n ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(45, "th", 35);
    \u0275\u0275text(46, " Estado ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(47, "th", 35);
    \u0275\u0275text(48, " Acciones ");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(49, "tbody", 36);
    \u0275\u0275repeaterCreate(50, PortfolioMaintenanceComponent_Conditional_25_For_51_Template, 22, 11, "tr", 37, _forTrack0, false, PortfolioMaintenanceComponent_Conditional_25_ForEmpty_52_Template, 3, 0, "tr");
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(ctx_r2.portfolios().length);
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 24);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(ctx_r2.getActivePortfolios());
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 24);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(ctx_r2.getInactivePortfolios());
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 24);
    \u0275\u0275advance(4);
    \u0275\u0275property("size", 18);
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.searchTerm);
    \u0275\u0275advance(18);
    \u0275\u0275repeater(ctx_r2.filteredPortfolios());
  }
}
function PortfolioMaintenanceComponent_Conditional_26_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 61);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r2.getCodeErrorMessage());
  }
}
function PortfolioMaintenanceComponent_Conditional_26_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 62);
    \u0275\u0275text(1, "C\xF3digo \xFAnico de m\xE1ximo 3 caracteres");
    \u0275\u0275elementEnd();
  }
}
function PortfolioMaintenanceComponent_Conditional_26_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 61);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r2.getNameErrorMessage());
  }
}
function PortfolioMaintenanceComponent_Conditional_26_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 48)(1, "input", 68);
    \u0275\u0275twoWayListener("ngModelChange", function PortfolioMaintenanceComponent_Conditional_26_Conditional_23_Template_input_ngModelChange_1_listener($event) {
      \u0275\u0275restoreView(_r7);
      const ctx_r2 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r2.formData.isActive, $event) || (ctx_r2.formData.isActive = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "label", 69);
    \u0275\u0275text(3, " Cartera activa ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.formData.isActive);
  }
}
function PortfolioMaintenanceComponent_Conditional_26_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 14)(1, "div", 54)(2, "div", 55)(3, "h2", 56);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "button", 57);
    \u0275\u0275listener("click", function PortfolioMaintenanceComponent_Conditional_26_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.closeDialog());
    });
    \u0275\u0275element(6, "lucide-angular", 58);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "form", 59);
    \u0275\u0275listener("ngSubmit", function PortfolioMaintenanceComponent_Conditional_26_Template_form_ngSubmit_7_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.savePortfolio());
    });
    \u0275\u0275elementStart(8, "div")(9, "label", 11);
    \u0275\u0275text(10, " C\xF3digo de Cartera * ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "input", 60);
    \u0275\u0275twoWayListener("ngModelChange", function PortfolioMaintenanceComponent_Conditional_26_Template_input_ngModelChange_11_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r2 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r2.formData.portfolioCode, $event) || (ctx_r2.formData.portfolioCode = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(12, PortfolioMaintenanceComponent_Conditional_26_Conditional_12_Template, 2, 1, "p", 61)(13, PortfolioMaintenanceComponent_Conditional_26_Conditional_13_Template, 2, 0, "p", 62);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "div")(15, "label", 11);
    \u0275\u0275text(16, " Nombre de Cartera * ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "input", 63);
    \u0275\u0275twoWayListener("ngModelChange", function PortfolioMaintenanceComponent_Conditional_26_Template_input_ngModelChange_17_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r2 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r2.formData.portfolioName, $event) || (ctx_r2.formData.portfolioName = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(18, PortfolioMaintenanceComponent_Conditional_26_Conditional_18_Template, 2, 1, "p", 61);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "div")(20, "label", 11);
    \u0275\u0275text(21, " Descripci\xF3n ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "textarea", 64);
    \u0275\u0275twoWayListener("ngModelChange", function PortfolioMaintenanceComponent_Conditional_26_Template_textarea_ngModelChange_22_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r2 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r2.formData.description, $event) || (ctx_r2.formData.description = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(23, PortfolioMaintenanceComponent_Conditional_26_Conditional_23_Template, 4, 1, "div", 48);
    \u0275\u0275elementStart(24, "div", 65)(25, "button", 66);
    \u0275\u0275listener("click", function PortfolioMaintenanceComponent_Conditional_26_Template_button_click_25_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.closeDialog());
    });
    \u0275\u0275text(26, " Cancelar ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "button", 67);
    \u0275\u0275text(28);
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", ctx_r2.isEditMode ? "Editar Cartera" : "Nueva Cartera", " ");
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 20);
    \u0275\u0275advance(5);
    \u0275\u0275classMap(ctx_r2.getCodeErrorMessage() ? "w-full px-4 py-2.5 bg-slate-800 border-2 border-red-500 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-slate-950 disabled:text-gray-600 uppercase" : "w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-slate-950 disabled:text-gray-600 uppercase");
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.formData.portfolioCode);
    \u0275\u0275property("disabled", ctx_r2.isEditMode);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.getCodeErrorMessage() ? 12 : 13);
    \u0275\u0275advance(5);
    \u0275\u0275classMap(ctx_r2.getNameErrorMessage() ? "w-full px-4 py-2.5 bg-slate-800 border-2 border-red-500 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500" : "w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500");
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.formData.portfolioName);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.getNameErrorMessage() ? 18 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.formData.description);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.isEditMode ? 23 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275property("disabled", ctx_r2.isEditMode ? !ctx_r2.formData.portfolioName : !ctx_r2.canSave());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r2.isEditMode ? "Actualizar" : "Crear", " ");
  }
}
var _PortfolioMaintenanceComponent = class _PortfolioMaintenanceComponent {
  constructor(portfolioService, typificationService) {
    this.portfolioService = portfolioService;
    this.typificationService = typificationService;
    this.tenants = signal([], ...ngDevMode ? [{ debugName: "tenants" }] : []);
    this.portfolios = signal([], ...ngDevMode ? [{ debugName: "portfolios" }] : []);
    this.filteredPortfolios = signal([], ...ngDevMode ? [{ debugName: "filteredPortfolios" }] : []);
    this.selectedTenantId = 0;
    this.searchTerm = "";
    this.showDialog = false;
    this.isEditMode = false;
    this.selectedPortfolio = null;
    this.formData = {
      portfolioCode: "",
      portfolioName: "",
      description: "",
      isActive: true
    };
    this.watchSearchTerm();
  }
  ngOnInit() {
    this.loadTenants();
  }
  loadTenants() {
    this.typificationService.getAllTenants().subscribe({
      next: (tenants) => {
        this.tenants.set(tenants);
      },
      error: (error) => {
        console.error("Error loading tenants:", error);
      }
    });
  }
  onTenantChange() {
    if (this.selectedTenantId > 0) {
      this.loadPortfolios();
    } else {
      this.portfolios.set([]);
      this.filteredPortfolios.set([]);
    }
  }
  loadPortfolios() {
    this.portfolioService.getPortfoliosByTenant(this.selectedTenantId).subscribe({
      next: (portfolios) => {
        this.portfolios.set(portfolios);
        this.filterPortfolios();
      },
      error: (error) => {
        console.error("Error loading portfolios:", error);
      }
    });
  }
  watchSearchTerm() {
    setInterval(() => {
      this.filterPortfolios();
    }, 300);
  }
  filterPortfolios() {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredPortfolios.set(this.portfolios());
      return;
    }
    const filtered = this.portfolios().filter((p) => p.portfolioCode.toLowerCase().includes(term) || p.portfolioName.toLowerCase().includes(term) || p.description && p.description.toLowerCase().includes(term));
    this.filteredPortfolios.set(filtered);
  }
  getActivePortfolios() {
    return this.portfolios().filter((p) => p.isActive).length;
  }
  getInactivePortfolios() {
    return this.portfolios().filter((p) => !p.isActive).length;
  }
  openCreateDialog() {
    this.isEditMode = false;
    this.selectedPortfolio = null;
    this.formData = {
      portfolioCode: "",
      portfolioName: "",
      description: "",
      isActive: true
    };
    this.showDialog = true;
  }
  openEditDialog(portfolio) {
    this.isEditMode = true;
    this.selectedPortfolio = portfolio;
    this.formData = {
      portfolioCode: portfolio.portfolioCode,
      portfolioName: portfolio.portfolioName,
      description: portfolio.description || "",
      isActive: portfolio.isActive
    };
    this.showDialog = true;
  }
  closeDialog() {
    this.showDialog = false;
    this.isEditMode = false;
    this.selectedPortfolio = null;
  }
  isCodeDuplicated() {
    if (!this.formData.portfolioCode.trim() || this.isEditMode) {
      return false;
    }
    const portfoliosInTenant = this.portfolios().filter((p) => p.tenantId === this.selectedTenantId);
    return portfoliosInTenant.some((p) => p.portfolioCode.toLowerCase() === this.formData.portfolioCode.trim().toLowerCase());
  }
  isNameDuplicated() {
    if (!this.formData.portfolioName.trim()) {
      return false;
    }
    const portfoliosInTenant = this.portfolios().filter((p) => p.tenantId === this.selectedTenantId);
    if (this.isEditMode && this.selectedPortfolio) {
      return portfoliosInTenant.some((p) => p.id !== this.selectedPortfolio.id && p.portfolioName.toLowerCase() === this.formData.portfolioName.trim().toLowerCase());
    } else {
      return portfoliosInTenant.some((p) => p.portfolioName.toLowerCase() === this.formData.portfolioName.trim().toLowerCase());
    }
  }
  getCodeErrorMessage() {
    if (!this.formData.portfolioCode.trim()) {
      return "";
    }
    if (this.isCodeDuplicated()) {
      return "Este c\xF3digo ya est\xE1 en uso en este proveedor";
    }
    return "";
  }
  getNameErrorMessage() {
    if (!this.formData.portfolioName.trim()) {
      return "";
    }
    if (this.isNameDuplicated()) {
      return "Este nombre ya est\xE1 en uso en este proveedor";
    }
    return "";
  }
  canSave() {
    if (!this.formData.portfolioCode.trim() || !this.formData.portfolioName.trim()) {
      return false;
    }
    if (this.isCodeDuplicated() || this.isNameDuplicated()) {
      return false;
    }
    return true;
  }
  savePortfolio() {
    if (!this.canSave() && !this.isEditMode)
      return;
    if (this.isEditMode && this.selectedPortfolio) {
      const request = {
        portfolioName: this.formData.portfolioName,
        description: this.formData.description || void 0,
        isActive: this.formData.isActive
      };
      this.portfolioService.updatePortfolio(this.selectedPortfolio.id, request).subscribe({
        next: () => {
          this.closeDialog();
          this.loadPortfolios();
        },
        error: (error) => {
          console.error("Error updating portfolio:", error);
          alert("Error al actualizar la cartera: " + (error.error?.message || error.message));
        }
      });
    } else {
      const request = {
        tenantId: this.selectedTenantId,
        portfolioCode: this.formData.portfolioCode,
        portfolioName: this.formData.portfolioName,
        description: this.formData.description || void 0
      };
      this.portfolioService.createPortfolio(request).subscribe({
        next: () => {
          this.closeDialog();
          this.loadPortfolios();
        },
        error: (error) => {
          console.error("Error creating portfolio:", error);
          alert("Error al crear la cartera: " + (error.error?.message || error.message));
        }
      });
    }
  }
  togglePortfolioStatus(portfolio) {
    const newStatus = !portfolio.isActive;
    const request = {
      portfolioName: portfolio.portfolioName,
      description: portfolio.description,
      isActive: newStatus
    };
    this.portfolioService.updatePortfolio(portfolio.id, request).subscribe({
      next: () => {
        this.loadPortfolios();
      },
      error: (error) => {
        console.error("Error toggling portfolio status:", error);
        alert("Error al cambiar el estado de la cartera: " + (error.error?.message || error.message));
      }
    });
  }
  deletePortfolio(portfolio) {
    if (portfolio.hasSubPortfolios) {
      alert("No se puede eliminar esta cartera porque tiene subcarteras asociadas.");
      return;
    }
    if (!confirm(`\xBFEst\xE1 seguro de que desea eliminar la cartera "${portfolio.portfolioName}"? Esta acci\xF3n no se puede deshacer.`)) {
      return;
    }
    this.portfolioService.deletePortfolio(portfolio.id).subscribe({
      next: () => {
        this.loadPortfolios();
        alert("Cartera eliminada exitosamente");
      },
      error: (error) => {
        console.error("Error deleting portfolio:", error);
        alert("Error al eliminar la cartera: " + (error.error?.message || error.message));
      }
    });
  }
};
_PortfolioMaintenanceComponent.\u0275fac = function PortfolioMaintenanceComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _PortfolioMaintenanceComponent)(\u0275\u0275directiveInject(PortfolioService), \u0275\u0275directiveInject(TypificationService));
};
_PortfolioMaintenanceComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PortfolioMaintenanceComponent, selectors: [["app-portfolio-maintenance"]], decls: 27, vars: 7, consts: [[1, "min-h-screen", "bg-gradient-to-br", "from-slate-900", "via-slate-800", "to-slate-900", "p-6"], [1, "max-w-7xl", "mx-auto", "mb-6"], [1, "flex", "items-center", "justify-between"], [1, "flex", "items-center", "gap-2", "mb-2"], [1, "w-8", "h-8", "bg-teal-600", "rounded-lg", "flex", "items-center", "justify-center"], ["name", "briefcase", 1, "text-white", 3, "size"], [1, "text-lg", "font-bold", "text-white"], [1, "text-xs", "text-gray-400"], [1, "flex", "items-center", "gap-2", "px-5", "py-2.5", "bg-gradient-to-r", "from-purple-600", "to-purple-700", "text-white", "rounded-lg", "font-semibold", "hover:shadow-lg", "transition-all", "hover:scale-105", "disabled:opacity-50", "disabled:cursor-not-allowed", "disabled:hover:scale-100", "cursor-pointer", 3, "click", "disabled"], ["name", "plus", 3, "size"], [1, "bg-slate-900", "rounded-xl", "p-4", "shadow-sm", "border", "border-slate-800"], [1, "block", "text-sm", "font-semibold", "text-gray-300", "mb-2"], [1, "w-full", "px-4", "py-2.5", "bg-slate-800", "border", "border-slate-700", "rounded-lg", "text-white", "focus:outline-none", "focus:ring-2", "focus:ring-purple-500", 3, "ngModelChange", "ngModel"], [3, "value"], [1, "fixed", "inset-0", "bg-black/50", "backdrop-blur-sm", "flex", "items-center", "justify-center", "p-4", "z-50"], [1, "max-w-7xl", "mx-auto", "mb-6", "grid", "grid-cols-1", "md:grid-cols-3", "gap-4"], [1, "bg-slate-900", "rounded-xl", "p-5", "shadow-sm", "border", "border-slate-800"], [1, "text-sm", "text-gray-400", "mb-1"], [1, "text-3xl", "font-bold", "text-white"], [1, "w-12", "h-12", "bg-purple-900/30", "rounded-lg", "flex", "items-center", "justify-center"], ["name", "folder", 1, "text-purple-400", 3, "size"], [1, "text-3xl", "font-bold", "text-green-400"], [1, "w-12", "h-12", "bg-green-900/30", "rounded-lg", "flex", "items-center", "justify-center"], ["name", "check-circle", 1, "text-green-400", 3, "size"], [1, "text-3xl", "font-bold", "text-red-400"], [1, "w-12", "h-12", "bg-red-900/30", "rounded-lg", "flex", "items-center", "justify-center"], ["name", "x-circle", 1, "text-red-400", 3, "size"], [1, "relative"], ["name", "search", 1, "absolute", "left-3", "top-1/2", "transform", "-translate-y-1/2", "text-gray-400", 3, "size"], ["type", "text", "placeholder", "Buscar carteras por c\xF3digo, nombre o tipo...", 1, "w-full", "pl-12", "pr-4", "py-2.5", "bg-slate-800", "border", "border-slate-700", "rounded-lg", "text-white", "placeholder-gray-500", "focus:outline-none", "focus:ring-2", "focus:ring-purple-500", 3, "ngModelChange", "ngModel"], [1, "max-w-7xl", "mx-auto"], [1, "bg-slate-900", "rounded-xl", "shadow-sm", "border", "border-slate-800", "overflow-hidden"], [1, "overflow-x-auto"], [1, "min-w-full", "divide-y", "divide-slate-800"], [1, "bg-slate-800"], [1, "px-6", "py-4", "text-left", "text-xs", "font-semibold", "text-gray-300", "uppercase", "tracking-wider"], [1, "divide-y", "divide-slate-800"], [1, "hover:bg-slate-800/50", "transition-colors"], [1, "px-6", "py-4", "whitespace-nowrap"], [1, "flex", "items-center", "gap-2"], [1, "text-sm", "font-medium", "text-white"], [1, "px-6", "py-4"], [1, "text-sm", "text-white", "font-medium"], [1, "text-sm", "text-gray-400", "max-w-xs", "truncate"], [1, "relative", "inline-flex", "items-center", "cursor-pointer"], ["type", "checkbox", 1, "sr-only", "peer", 3, "change", "checked"], [1, "w-11", "h-6", "bg-slate-700", "peer-focus:outline-none", "peer-focus:ring-4", "peer-focus:ring-purple-800", "rounded-full", "peer", "peer-checked:after:translate-x-full", "rtl:peer-checked:after:-translate-x-full", "peer-checked:after:border-white", "after:content-['']", "after:absolute", "after:top-[2px]", "after:start-[2px]", "after:bg-white", "after:border-gray-300", "after:border", "after:rounded-full", "after:h-5", "after:w-5", "after:transition-all", "peer-checked:bg-purple-600"], [1, "px-6", "py-4", "whitespace-nowrap", "text-sm"], [1, "flex", "items-center", "gap-3"], [1, "text-blue-400", "hover:text-blue-500", "transition-colors", "cursor-pointer", 3, "click"], ["name", "edit", 3, "size"], [1, "transition-colors", "disabled:opacity-50", 3, "click", "disabled", "title"], ["name", "trash-2", 3, "size"], ["colspan", "5", 1, "px-6", "py-8", "text-center", "text-gray-500"], [1, "bg-slate-900", "rounded-xl", "shadow-xl", "max-w-md", "w-full", "border", "border-slate-800"], [1, "flex", "items-center", "justify-between", "p-6", "border-b", "border-slate-800"], [1, "text-xl", "font-bold", "text-white"], [1, "text-gray-400", "hover:text-white", "transition-colors", 3, "click"], ["name", "x", 3, "size"], [1, "p-6", "space-y-4", 3, "ngSubmit"], ["type", "text", "name", "portfolioCode", "required", "", "maxlength", "3", "placeholder", "Ej: C01, ABC", 3, "ngModelChange", "ngModel", "disabled"], [1, "text-xs", "text-red-400", "mt-1", "font-semibold"], [1, "text-xs", "text-gray-500", "mt-1"], ["type", "text", "name", "portfolioName", "required", "", "maxlength", "255", "placeholder", "Ej: Cartera de Consumo", 3, "ngModelChange", "ngModel"], ["name", "description", "rows", "3", "placeholder", "Descripci\xF3n de la cartera...", 1, "w-full", "px-4", "py-2.5", "bg-slate-800", "border", "border-slate-700", "rounded-lg", "text-white", "placeholder-gray-500", "focus:outline-none", "focus:ring-2", "focus:ring-purple-500", "resize-none", 3, "ngModelChange", "ngModel"], [1, "flex", "gap-3", "pt-4"], ["type", "button", 1, "flex-1", "px-4", "py-2.5", "bg-slate-800", "text-white", "rounded-lg", "font-semibold", "hover:bg-slate-700", "transition-colors", 3, "click"], ["type", "submit", 1, "flex-1", "px-4", "py-2.5", "bg-gradient-to-r", "from-purple-600", "to-purple-700", "text-white", "rounded-lg", "font-semibold", "hover:shadow-lg", "transition-all", "disabled:opacity-50", "disabled:cursor-not-allowed", 3, "disabled"], ["type", "checkbox", "name", "isActive", "id", "isActive", 1, "w-4", "h-4", "text-purple-600", "bg-slate-800", "border-slate-700", "rounded", "focus:ring-purple-500", 3, "ngModelChange", "ngModel"], ["for", "isActive", 1, "text-sm", "text-gray-300"]], template: function PortfolioMaintenanceComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div")(4, "div", 3)(5, "div", 4);
    \u0275\u0275element(6, "lucide-angular", 5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "div")(8, "h1", 6);
    \u0275\u0275text(9, "Carteras");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "p", 7);
    \u0275\u0275text(11, "Administraci\xF3n de carteras de cobranza");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(12, "button", 8);
    \u0275\u0275listener("click", function PortfolioMaintenanceComponent_Template_button_click_12_listener() {
      return ctx.openCreateDialog();
    });
    \u0275\u0275element(13, "lucide-angular", 9);
    \u0275\u0275elementStart(14, "span");
    \u0275\u0275text(15, "Nueva Cartera");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(16, "div", 1)(17, "div", 10)(18, "label", 11);
    \u0275\u0275text(19, " Seleccionar Proveedor ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "select", 12);
    \u0275\u0275twoWayListener("ngModelChange", function PortfolioMaintenanceComponent_Template_select_ngModelChange_20_listener($event) {
      \u0275\u0275twoWayBindingSet(ctx.selectedTenantId, $event) || (ctx.selectedTenantId = $event);
      return $event;
    });
    \u0275\u0275listener("ngModelChange", function PortfolioMaintenanceComponent_Template_select_ngModelChange_20_listener() {
      return ctx.onTenantChange();
    });
    \u0275\u0275elementStart(21, "option", 13);
    \u0275\u0275text(22, "Seleccione un proveedor...");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(23, PortfolioMaintenanceComponent_For_24_Template, 2, 3, "option", 13, _forTrack0);
    \u0275\u0275elementEnd()()();
    \u0275\u0275conditionalCreate(25, PortfolioMaintenanceComponent_Conditional_25_Template, 53, 9);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(26, PortfolioMaintenanceComponent_Conditional_26_Template, 29, 15, "div", 14);
  }
  if (rf & 2) {
    \u0275\u0275advance(6);
    \u0275\u0275property("size", 16);
    \u0275\u0275advance(6);
    \u0275\u0275property("disabled", ctx.selectedTenantId === 0);
    \u0275\u0275advance();
    \u0275\u0275property("size", 18);
    \u0275\u0275advance(7);
    \u0275\u0275twoWayProperty("ngModel", ctx.selectedTenantId);
    \u0275\u0275advance();
    \u0275\u0275property("value", 0);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx.tenants());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx.selectedTenantId > 0 ? 25 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx.showDialog ? 26 : -1);
  }
}, dependencies: [CommonModule, FormsModule, \u0275NgNoValidate, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, CheckboxControlValueAccessor, SelectControlValueAccessor, NgControlStatus, NgControlStatusGroup, RequiredValidator, MaxLengthValidator, NgModel, NgForm, LucideAngularModule, LucideAngularComponent], encapsulation: 2 });
var PortfolioMaintenanceComponent = _PortfolioMaintenanceComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PortfolioMaintenanceComponent, [{
    type: Component,
    args: [{
      selector: "app-portfolio-maintenance",
      standalone: true,
      imports: [CommonModule, FormsModule, LucideAngularModule],
      encapsulation: ViewEncapsulation.None,
      template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <!-- Header -->
      <div class="max-w-7xl mx-auto mb-6">
        <div class="flex items-center justify-between">
          <div>
            <div class="flex items-center gap-2 mb-2">
              <div class="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                <lucide-angular name="briefcase" [size]="16" class="text-white"></lucide-angular>
              </div>
              <div>
                <h1 class="text-lg font-bold text-white">Carteras</h1>
                <p class="text-xs text-gray-400">Administraci\xF3n de carteras de cobranza</p>
              </div>
            </div>
          </div>

          <button (click)="openCreateDialog()"
                  [disabled]="selectedTenantId === 0"
                  class="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-semibold hover:shadow-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer">
            <lucide-angular name="plus" [size]="18"></lucide-angular>
            <span>Nueva Cartera</span>
          </button>
        </div>
      </div>

      <!-- Tenant Selector -->
      <div class="max-w-7xl mx-auto mb-6">
        <div class="bg-slate-900 rounded-xl p-4 shadow-sm border border-slate-800">
          <label class="block text-sm font-semibold text-gray-300 mb-2">
            Seleccionar Proveedor
          </label>
          <select [(ngModel)]="selectedTenantId"
                  (ngModelChange)="onTenantChange()"
                  class="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
            <option [value]="0">Seleccione un proveedor...</option>
            @for (tenant of tenants(); track tenant.id) {
              <option [value]="tenant.id">{{ tenant.tenantName }} ({{ tenant.tenantCode }})</option>
            }
          </select>
        </div>
      </div>

      <!-- Stats Cards -->
      @if (selectedTenantId > 0) {
        <div class="max-w-7xl mx-auto mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-slate-900 rounded-xl p-5 shadow-sm border border-slate-800">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-400 mb-1">Total Carteras</p>
                <p class="text-3xl font-bold text-white">{{ portfolios().length }}</p>
              </div>
              <div class="w-12 h-12 bg-purple-900/30 rounded-lg flex items-center justify-center">
                <lucide-angular name="folder" [size]="24" class="text-purple-400"></lucide-angular>
              </div>
            </div>
          </div>

          <div class="bg-slate-900 rounded-xl p-5 shadow-sm border border-slate-800">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-400 mb-1">Activas</p>
                <p class="text-3xl font-bold text-green-400">{{ getActivePortfolios() }}</p>
              </div>
              <div class="w-12 h-12 bg-green-900/30 rounded-lg flex items-center justify-center">
                <lucide-angular name="check-circle" [size]="24" class="text-green-400"></lucide-angular>
              </div>
            </div>
          </div>

          <div class="bg-slate-900 rounded-xl p-5 shadow-sm border border-slate-800">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-400 mb-1">Inactivas</p>
                <p class="text-3xl font-bold text-red-400">{{ getInactivePortfolios() }}</p>
              </div>
              <div class="w-12 h-12 bg-red-900/30 rounded-lg flex items-center justify-center">
                <lucide-angular name="x-circle" [size]="24" class="text-red-400"></lucide-angular>
              </div>
            </div>
          </div>
        </div>

        <!-- Search Bar -->
        <div class="max-w-7xl mx-auto mb-6">
          <div class="bg-slate-900 rounded-xl p-4 shadow-sm border border-slate-800">
            <div class="relative">
              <lucide-angular name="search" [size]="18" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></lucide-angular>
              <input type="text"
                     [(ngModel)]="searchTerm"
                     placeholder="Buscar carteras por c\xF3digo, nombre o tipo..."
                     class="w-full pl-12 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500">
            </div>
          </div>
        </div>

        <!-- Portfolios Table -->
        <div class="max-w-7xl mx-auto">
          <div class="bg-slate-900 rounded-xl shadow-sm border border-slate-800 overflow-hidden">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-slate-800">
                <thead class="bg-slate-800">
                  <tr>
                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      C\xF3digo
                    </th>
                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Descripci\xF3n
                    </th>
                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Estado
                    </th>
                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-800">
                  @for (portfolio of filteredPortfolios(); track portfolio.id) {
                    <tr class="hover:bg-slate-800/50 transition-colors">
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center gap-2">
                          <lucide-angular name="folder" [size]="16" class="text-purple-400"></lucide-angular>
                          <span class="text-sm font-medium text-white">{{ portfolio.portfolioCode }}</span>
                        </div>
                      </td>
                      <td class="px-6 py-4">
                        <div class="text-sm text-white font-medium">{{ portfolio.portfolioName }}</div>
                      </td>
                      <td class="px-6 py-4">
                        <div class="text-sm text-gray-400 max-w-xs truncate">
                          {{ portfolio.description || 'Sin descripci\xF3n' }}
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <label class="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox"
                                 [checked]="portfolio.isActive"
                                 (change)="togglePortfolioStatus(portfolio)"
                                 class="sr-only peer">
                          <div class="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm">
                        <div class="flex items-center gap-3">
                          <button (click)="openEditDialog(portfolio)"
                                  class="text-blue-400 hover:text-blue-500 transition-colors cursor-pointer">
                            <lucide-angular name="edit" [size]="18"></lucide-angular>
                          </button>
                          <button (click)="deletePortfolio(portfolio)"
                                  [disabled]="portfolio.hasSubPortfolios"
                                  [class]="portfolio.hasSubPortfolios ? 'text-gray-600 cursor-not-allowed' : 'text-red-400 hover:text-red-500 cursor-pointer'"
                                  class="transition-colors disabled:opacity-50"
                                  [title]="portfolio.hasSubPortfolios ? 'No se puede eliminar: tiene subcarteras asociadas' : 'Eliminar'">
                            <lucide-angular name="trash-2" [size]="18"></lucide-angular>
                          </button>
                        </div>
                      </td>
                    </tr>
                  } @empty {
                    <tr>
                      <td colspan="5" class="px-6 py-8 text-center text-gray-500">
                        No se encontraron carteras
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      }
    </div>

    <!-- Create/Edit Modal -->
    @if (showDialog) {
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div class="bg-slate-900 rounded-xl shadow-xl max-w-md w-full border border-slate-800">
          <!-- Modal Header -->
          <div class="flex items-center justify-between p-6 border-b border-slate-800">
            <h2 class="text-xl font-bold text-white">
              {{ isEditMode ? 'Editar Cartera' : 'Nueva Cartera' }}
            </h2>
            <button (click)="closeDialog()"
                    class="text-gray-400 hover:text-white transition-colors">
              <lucide-angular name="x" [size]="20"></lucide-angular>
            </button>
          </div>

          <!-- Modal Body -->
          <form (ngSubmit)="savePortfolio()" class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-semibold text-gray-300 mb-2">
                C\xF3digo de Cartera *
              </label>
              <input type="text"
                     [(ngModel)]="formData.portfolioCode"
                     name="portfolioCode"
                     [disabled]="isEditMode"
                     required
                     maxlength="3"
                     placeholder="Ej: C01, ABC"
                     [class]="getCodeErrorMessage() ? 'w-full px-4 py-2.5 bg-slate-800 border-2 border-red-500 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-slate-950 disabled:text-gray-600 uppercase' : 'w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-slate-950 disabled:text-gray-600 uppercase'">
              @if (getCodeErrorMessage()) {
                <p class="text-xs text-red-400 mt-1 font-semibold">{{ getCodeErrorMessage() }}</p>
              } @else {
                <p class="text-xs text-gray-500 mt-1">C\xF3digo \xFAnico de m\xE1ximo 3 caracteres</p>
              }
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-300 mb-2">
                Nombre de Cartera *
              </label>
              <input type="text"
                     [(ngModel)]="formData.portfolioName"
                     name="portfolioName"
                     required
                     maxlength="255"
                     placeholder="Ej: Cartera de Consumo"
                     [class]="getNameErrorMessage() ? 'w-full px-4 py-2.5 bg-slate-800 border-2 border-red-500 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500' : 'w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500'">
              @if (getNameErrorMessage()) {
                <p class="text-xs text-red-400 mt-1 font-semibold">{{ getNameErrorMessage() }}</p>
              }
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-300 mb-2">
                Descripci\xF3n
              </label>
              <textarea [(ngModel)]="formData.description"
                        name="description"
                        rows="3"
                        placeholder="Descripci\xF3n de la cartera..."
                        class="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"></textarea>
            </div>

            @if (isEditMode) {
              <div class="flex items-center gap-3">
                <input type="checkbox"
                       [(ngModel)]="formData.isActive"
                       name="isActive"
                       id="isActive"
                       class="w-4 h-4 text-purple-600 bg-slate-800 border-slate-700 rounded focus:ring-purple-500">
                <label for="isActive" class="text-sm text-gray-300">
                  Cartera activa
                </label>
              </div>
            }

            <!-- Modal Actions -->
            <div class="flex gap-3 pt-4">
              <button type="button"
                      (click)="closeDialog()"
                      class="flex-1 px-4 py-2.5 bg-slate-800 text-white rounded-lg font-semibold hover:bg-slate-700 transition-colors">
                Cancelar
              </button>
              <button type="submit"
                      [disabled]="isEditMode ? (!formData.portfolioName) : (!canSave())"
                      class="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                {{ isEditMode ? 'Actualizar' : 'Crear' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    }
  `
    }]
  }], () => [{ type: PortfolioService }, { type: TypificationService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PortfolioMaintenanceComponent, { className: "PortfolioMaintenanceComponent", filePath: "src/app/maintenance/components/portfolio-maintenance/portfolio-maintenance.component.ts", lineNumber: 287 });
})();
export {
  PortfolioMaintenanceComponent
};
//# sourceMappingURL=chunk-SORKOYZI.js.map
