import {
  ManagementService
} from "./chunk-R2DTYY2X.js";
import {
  TypificationService
} from "./chunk-XGOWMJUN.js";
import {
  CdkDrag,
  CdkDragHandle,
  CdkDragPlaceholder,
  CdkDropList,
  DragDropModule,
  moveItemInArray
} from "./chunk-2M7QB47Q.js";
import "./chunk-XG3JRR2G.js";
import "./chunk-Q5NKAKZL.js";
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
import "./chunk-QF774CZR.js";
import {
  CommonModule,
  Component,
  __spreadProps,
  __spreadValues,
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
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-CTRHJBBW.js";

// src/app/maintenance/components/amount-display-config/amount-display-config.component.ts
var _forTrack0 = ($index, $item) => $item.id;
function AmountDisplayConfigComponent_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 16);
    \u0275\u0275elementStart(1, "span");
    \u0275\u0275text(2, "Guardando...");
    \u0275\u0275elementEnd();
  }
}
function AmountDisplayConfigComponent_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "lucide-angular", 17);
    \u0275\u0275elementStart(1, "span");
    \u0275\u0275text(2, "Guardar Cambios");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275property("size", 18);
  }
}
function AmountDisplayConfigComponent_For_25_Template(rf, ctx) {
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
function AmountDisplayConfigComponent_For_33_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 13);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const portfolio_r2 = ctx.$implicit;
    \u0275\u0275property("value", portfolio_r2.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", portfolio_r2.portfolioName, " (", portfolio_r2.portfolioCode, ")");
  }
}
function AmountDisplayConfigComponent_For_41_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 13);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const subPortfolio_r3 = ctx.$implicit;
    \u0275\u0275property("value", subPortfolio_r3.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", subPortfolio_r3.subPortfolioName, " (", subPortfolio_r3.subPortfolioCode, ")");
  }
}
function AmountDisplayConfigComponent_Conditional_42_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 25);
    \u0275\u0275element(1, "div", 26);
    \u0275\u0275elementStart(2, "p", 27);
    \u0275\u0275text(3, "Cargando campos de montos...");
    \u0275\u0275elementEnd()();
  }
}
function AmountDisplayConfigComponent_Conditional_42_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 25)(1, "div", 28);
    \u0275\u0275element(2, "lucide-angular", 29);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 30);
    \u0275\u0275text(4, "No se encontraron campos de montos");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 31);
    \u0275\u0275text(6, " Esta subcartera no tiene campos num\xE9ricos decimales configurados ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 32);
  }
}
function AmountDisplayConfigComponent_Conditional_42_Conditional_20_For_11_div_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 52);
  }
}
function AmountDisplayConfigComponent_Conditional_42_Conditional_20_For_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 38)(1, "div", 39)(2, "div", 40);
    \u0275\u0275element(3, "lucide-angular", 41);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 42);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 43)(7, "input", 44);
    \u0275\u0275twoWayListener("ngModelChange", function AmountDisplayConfigComponent_Conditional_42_Conditional_20_For_11_Template_input_ngModelChange_7_listener($event) {
      const field_r7 = \u0275\u0275restoreView(_r6).$implicit;
      \u0275\u0275twoWayBindingSet(field_r7.nombre, $event) || (field_r7.nombre = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function AmountDisplayConfigComponent_Conditional_42_Conditional_20_For_11_Template_input_ngModelChange_7_listener() {
      const field_r7 = \u0275\u0275restoreView(_r6).$implicit;
      const ctx_r4 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r4.onNameChange(field_r7));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "div", 45);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "div", 46);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "label", 47)(13, "input", 48);
    \u0275\u0275listener("change", function AmountDisplayConfigComponent_Conditional_42_Conditional_20_For_11_Template_input_change_13_listener() {
      const field_r7 = \u0275\u0275restoreView(_r6).$implicit;
      const ctx_r4 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r4.toggleVisibility(field_r7));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275element(14, "div", 49);
    \u0275\u0275elementStart(15, "span", 50);
    \u0275\u0275text(16);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(17, AmountDisplayConfigComponent_Conditional_42_Conditional_20_For_11_div_17_Template, 1, 0, "div", 51);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const field_r7 = ctx.$implicit;
    const \u0275$index_156_r8 = ctx.$index;
    \u0275\u0275advance(3);
    \u0275\u0275property("size", 20);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", \u0275$index_156_r8 + 1, " ");
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("ngModel", field_r7.nombre);
    \u0275\u0275property("title", "Editar nombre: " + field_r7.nombre);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(field_r7.codigo);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", field_r7.tipoSql, " ");
    \u0275\u0275advance(2);
    \u0275\u0275property("checked", field_r7.isVisible);
    \u0275\u0275advance(2);
    \u0275\u0275classMap(field_r7.isVisible ? "text-amber-400" : "text-gray-500");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", field_r7.isVisible ? "Visible" : "Oculto", " ");
  }
}
function AmountDisplayConfigComponent_Conditional_42_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 32)(1, "div", 2)(2, "span", 33);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 34)(5, "button", 35);
    \u0275\u0275listener("click", function AmountDisplayConfigComponent_Conditional_42_Conditional_20_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r4 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r4.toggleAll(true));
    });
    \u0275\u0275text(6, " Mostrar todos ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "button", 36);
    \u0275\u0275listener("click", function AmountDisplayConfigComponent_Conditional_42_Conditional_20_Template_button_click_7_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r4 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r4.toggleAll(false));
    });
    \u0275\u0275text(8, " Ocultar todos ");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(9, "div", 37);
    \u0275\u0275listener("cdkDropListDropped", function AmountDisplayConfigComponent_Conditional_42_Conditional_20_Template_div_cdkDropListDropped_9_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r4 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r4.drop($event));
    });
    \u0275\u0275repeaterCreate(10, AmountDisplayConfigComponent_Conditional_42_Conditional_20_For_11_Template, 18, 10, "div", 38, _forTrack0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r4 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", ctx_r4.amountFields().length, " campos de montos encontrados ");
    \u0275\u0275advance(7);
    \u0275\u0275repeater(ctx_r4.amountFields());
  }
}
function AmountDisplayConfigComponent_Conditional_42_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 1)(1, "div", 18)(2, "div", 19);
    \u0275\u0275element(3, "lucide-angular", 20);
    \u0275\u0275elementStart(4, "div")(5, "p", 21);
    \u0275\u0275text(6, "Instrucciones");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "ul", 22)(8, "li");
    \u0275\u0275text(9, "Use los toggles para mostrar u ocultar cada campo de monto en el panel de deuda");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "li");
    \u0275\u0275text(11, "Haga clic en el nombre para editarlo y personalizar c\xF3mo se muestra");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "li");
    \u0275\u0275text(13, "Arrastre los campos para cambiar el orden de visualizaci\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "li");
    \u0275\u0275text(15, 'Los cambios se guardan al hacer clic en "Guardar Cambios"');
    \u0275\u0275elementEnd()()()()()();
    \u0275\u0275elementStart(16, "div", 23)(17, "div", 24);
    \u0275\u0275conditionalCreate(18, AmountDisplayConfigComponent_Conditional_42_Conditional_18_Template, 4, 0, "div", 25)(19, AmountDisplayConfigComponent_Conditional_42_Conditional_19_Template, 7, 1, "div", 25)(20, AmountDisplayConfigComponent_Conditional_42_Conditional_20_Template, 12, 1);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r4 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275property("size", 20);
    \u0275\u0275advance(15);
    \u0275\u0275conditional(ctx_r4.loading() ? 18 : ctx_r4.amountFields().length === 0 ? 19 : 20);
  }
}
function AmountDisplayConfigComponent_Conditional_43_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 15);
    \u0275\u0275element(1, "lucide-angular", 53);
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3, "Cambios guardados exitosamente");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 20);
  }
}
var _AmountDisplayConfigComponent = class _AmountDisplayConfigComponent {
  constructor(typificationService, portfolioService, managementService) {
    this.typificationService = typificationService;
    this.portfolioService = portfolioService;
    this.managementService = managementService;
    this.tenants = signal([], ...ngDevMode ? [{ debugName: "tenants" }] : []);
    this.portfolios = signal([], ...ngDevMode ? [{ debugName: "portfolios" }] : []);
    this.subPortfolios = signal([], ...ngDevMode ? [{ debugName: "subPortfolios" }] : []);
    this.amountFields = signal([], ...ngDevMode ? [{ debugName: "amountFields" }] : []);
    this.originalFields = signal([], ...ngDevMode ? [{ debugName: "originalFields" }] : []);
    this.loading = signal(false, ...ngDevMode ? [{ debugName: "loading" }] : []);
    this.saving = signal(false, ...ngDevMode ? [{ debugName: "saving" }] : []);
    this.showSuccess = signal(false, ...ngDevMode ? [{ debugName: "showSuccess" }] : []);
    this.selectedTenantId = 0;
    this.selectedPortfolioId = 0;
    this.selectedSubPortfolioId = 0;
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
    this.selectedPortfolioId = 0;
    this.selectedSubPortfolioId = 0;
    this.portfolios.set([]);
    this.subPortfolios.set([]);
    this.amountFields.set([]);
    this.originalFields.set([]);
    if (this.selectedTenantId > 0) {
      this.loadPortfolios();
    }
  }
  loadPortfolios() {
    this.portfolioService.getPortfoliosByTenant(this.selectedTenantId).subscribe({
      next: (portfolios) => {
        this.portfolios.set(portfolios);
      },
      error: (error) => {
        console.error("Error loading portfolios:", error);
      }
    });
  }
  onPortfolioChange() {
    this.selectedSubPortfolioId = 0;
    this.subPortfolios.set([]);
    this.amountFields.set([]);
    this.originalFields.set([]);
    if (this.selectedPortfolioId > 0) {
      this.loadSubPortfolios();
    }
  }
  loadSubPortfolios() {
    this.portfolioService.getSubPortfoliosByPortfolio(this.selectedPortfolioId).subscribe({
      next: (subPortfolios) => {
        this.subPortfolios.set(subPortfolios);
      },
      error: (error) => {
        console.error("Error loading subportfolios:", error);
      }
    });
  }
  onSubPortfolioChange() {
    this.amountFields.set([]);
    this.originalFields.set([]);
    if (this.selectedSubPortfolioId > 0) {
      this.loadAmountFields();
    }
  }
  loadAmountFields() {
    this.loading.set(true);
    this.managementService.getMontoCabeceras(this.selectedSubPortfolioId).subscribe({
      next: (cabeceras) => {
        const sorted = [...cabeceras].sort((a, b) => (a.ordenMonto || 0) - (b.ordenMonto || 0));
        const fields = sorted.map((c) => __spreadProps(__spreadValues({}, c), {
          isVisible: c.esVisibleMonto === 1 || c.esVisibleMonto === void 0 || c.esVisibleMonto === null
        }));
        this.amountFields.set(fields);
        this.originalFields.set(JSON.parse(JSON.stringify(fields)));
        this.loading.set(false);
      },
      error: (error) => {
        console.error("Error loading amount fields:", error);
        this.loading.set(false);
      }
    });
  }
  toggleVisibility(field) {
    field.isVisible = !field.isVisible;
    this.amountFields.set([...this.amountFields()]);
  }
  onNameChange(field) {
    this.amountFields.set([...this.amountFields()]);
  }
  toggleAll(visible) {
    const fields = this.amountFields().map((f) => __spreadProps(__spreadValues({}, f), {
      isVisible: visible
    }));
    this.amountFields.set(fields);
  }
  drop(event) {
    const fields = [...this.amountFields()];
    moveItemInArray(fields, event.previousIndex, event.currentIndex);
    this.amountFields.set(fields);
  }
  hasChanges() {
    const current = this.amountFields();
    const original = this.originalFields();
    if (current.length !== original.length)
      return true;
    for (let i = 0; i < current.length; i++) {
      if (current[i].id !== original[i].id)
        return true;
      if (current[i].isVisible !== original[i].isVisible)
        return true;
      if (current[i].nombre !== original[i].nombre)
        return true;
    }
    return false;
  }
  saveChanges() {
    if (!this.hasChanges() || this.saving())
      return;
    this.saving.set(true);
    const updates = this.amountFields().map((field, index) => ({
      id: field.id,
      esVisibleMonto: field.isVisible ? 1 : 0,
      ordenMonto: index * 10,
      // Espaciado de 10 para permitir inserciones futuras
      nombre: field.nombre
    }));
    this.managementService.updateAmountVisibility(this.selectedSubPortfolioId, updates).subscribe({
      next: () => {
        this.saving.set(false);
        this.showSuccessMessage();
        this.originalFields.set(JSON.parse(JSON.stringify(this.amountFields())));
      },
      error: (error) => {
        console.error("Error saving changes:", error);
        this.saving.set(false);
        alert("Error al guardar los cambios");
      }
    });
  }
  showSuccessMessage() {
    this.showSuccess.set(true);
    setTimeout(() => this.showSuccess.set(false), 3e3);
  }
};
_AmountDisplayConfigComponent.\u0275fac = function AmountDisplayConfigComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _AmountDisplayConfigComponent)(\u0275\u0275directiveInject(TypificationService), \u0275\u0275directiveInject(PortfolioService), \u0275\u0275directiveInject(ManagementService));
};
_AmountDisplayConfigComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AmountDisplayConfigComponent, selectors: [["app-amount-display-config"]], decls: 44, vars: 13, consts: [[1, "min-h-screen", "bg-gradient-to-br", "from-slate-900", "via-slate-800", "to-slate-900", "p-6"], [1, "max-w-5xl", "mx-auto", "mb-6"], [1, "flex", "items-center", "justify-between"], [1, "flex", "items-center", "gap-2", "mb-2"], [1, "w-8", "h-8", "bg-amber-600", "rounded-lg", "flex", "items-center", "justify-center"], ["name", "eye", 1, "text-white", 3, "size"], [1, "text-lg", "font-bold", "text-white"], [1, "text-xs", "text-gray-400"], [1, "flex", "items-center", "gap-2", "px-5", "py-2.5", "bg-gradient-to-r", "from-emerald-600", "to-emerald-700", "text-white", "rounded-lg", "font-semibold", "hover:shadow-lg", "transition-all", "hover:scale-105", "disabled:opacity-50", "disabled:cursor-not-allowed", "disabled:hover:scale-100", "cursor-pointer", 3, "click", "disabled"], [1, "bg-slate-900", "rounded-xl", "p-4", "shadow-sm", "border", "border-slate-800"], [1, "grid", "grid-cols-1", "md:grid-cols-3", "gap-4"], [1, "block", "text-sm", "font-semibold", "text-gray-300", "mb-2"], [1, "w-full", "px-4", "py-2.5", "bg-slate-800", "border", "border-slate-700", "rounded-lg", "text-white", "focus:outline-none", "focus:ring-2", "focus:ring-amber-500", 3, "ngModelChange", "ngModel"], [3, "value"], [1, "w-full", "px-4", "py-2.5", "bg-slate-800", "border", "border-slate-700", "rounded-lg", "text-white", "focus:outline-none", "focus:ring-2", "focus:ring-amber-500", "disabled:opacity-50", "disabled:cursor-not-allowed", 3, "ngModelChange", "ngModel", "disabled"], [1, "fixed", "bottom-6", "right-6", "bg-emerald-600", "text-white", "px-6", "py-3", "rounded-lg", "shadow-lg", "flex", "items-center", "gap-3", "animate-slide-in"], [1, "w-4", "h-4", "border-2", "border-white", "border-t-transparent", "rounded-full", "animate-spin"], ["name", "save", 3, "size"], [1, "bg-amber-900/20", "border", "border-amber-700/50", "rounded-xl", "p-4"], [1, "flex", "items-start", "gap-3"], ["name", "info", 1, "text-amber-400", "mt-0.5", "flex-shrink-0", 3, "size"], [1, "text-amber-200", "text-sm", "font-medium"], [1, "text-amber-200/70", "text-sm", "mt-1", "space-y-1"], [1, "max-w-5xl", "mx-auto"], [1, "bg-slate-900", "rounded-xl", "shadow-sm", "border", "border-slate-800", "overflow-hidden"], [1, "p-12", "text-center"], [1, "inline-block", "w-8", "h-8", "border-4", "border-amber-500", "border-t-transparent", "rounded-full", "animate-spin"], [1, "mt-4", "text-gray-400"], [1, "w-16", "h-16", "bg-slate-800", "rounded-full", "flex", "items-center", "justify-center", "mx-auto", "mb-4"], ["name", "dollar-sign", 1, "text-gray-600", 3, "size"], [1, "text-gray-300", "mb-2"], [1, "text-sm", "text-gray-500"], [1, "bg-slate-800", "border-b", "border-slate-700", "px-6", "py-3"], [1, "text-sm", "font-semibold", "text-gray-300"], [1, "flex", "items-center", "gap-4"], [1, "text-xs", "text-emerald-400", "hover:text-emerald-300", "transition-colors", 3, "click"], [1, "text-xs", "text-red-400", "hover:text-red-300", "transition-colors", 3, "click"], ["cdkDropList", "", 1, "divide-y", "divide-slate-800", 3, "cdkDropListDropped"], ["cdkDrag", "", 1, "flex", "items-center", "justify-between", "px-6", "py-4", "hover:bg-slate-800/50", "transition-colors", "cursor-move"], [1, "flex", "items-center", "gap-4", "flex-1"], ["cdkDragHandle", "", 1, "text-slate-600", "hover:text-slate-400", "cursor-grab", "active:cursor-grabbing"], ["name", "grip-vertical", 3, "size"], [1, "w-8", "h-8", "bg-slate-800", "rounded-lg", "flex", "items-center", "justify-center", "text-sm", "font-bold", "text-slate-400"], [1, "flex-1", "min-w-0"], ["type", "text", 1, "w-full", "bg-transparent", "border-b", "border-transparent", "hover:border-slate-600", "focus:border-amber-500", "focus:outline-none", "font-medium", "text-white", "px-1", "py-0.5", "-ml-1", "transition-colors", 3, "ngModelChange", "ngModel", "title"], [1, "text-xs", "text-gray-500", "font-mono", "mt-0.5"], [1, "px-2", "py-1", "bg-slate-800", "rounded", "text-xs", "text-gray-400"], [1, "relative", "inline-flex", "items-center", "cursor-pointer", "ml-4"], ["type", "checkbox", 1, "sr-only", "peer", 3, "change", "checked"], [1, "w-11", "h-6", "bg-slate-700", "peer-focus:outline-none", "peer-focus:ring-4", "peer-focus:ring-amber-800", "rounded-full", "peer", "peer-checked:after:translate-x-full", "rtl:peer-checked:after:-translate-x-full", "peer-checked:after:border-white", "after:content-['']", "after:absolute", "after:top-[2px]", "after:start-[2px]", "after:bg-white", "after:border-gray-300", "after:border", "after:rounded-full", "after:h-5", "after:w-5", "after:transition-all", "peer-checked:bg-amber-600"], [1, "ml-3", "text-sm", "font-medium"], ["class", "bg-amber-900/20 border-2 border-dashed border-amber-500 rounded-lg h-16", 4, "cdkDragPlaceholder"], [1, "bg-amber-900/20", "border-2", "border-dashed", "border-amber-500", "rounded-lg", "h-16"], ["name", "check-circle", 3, "size"]], template: function AmountDisplayConfigComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div")(4, "div", 3)(5, "div", 4);
    \u0275\u0275element(6, "lucide-angular", 5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "div")(8, "h1", 6);
    \u0275\u0275text(9, "Campos de Montos a Mostrar");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "p", 7);
    \u0275\u0275text(11, "Configure qu\xE9 campos de importes se muestran en el panel de deuda");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(12, "button", 8);
    \u0275\u0275listener("click", function AmountDisplayConfigComponent_Template_button_click_12_listener() {
      return ctx.saveChanges();
    });
    \u0275\u0275conditionalCreate(13, AmountDisplayConfigComponent_Conditional_13_Template, 3, 0)(14, AmountDisplayConfigComponent_Conditional_14_Template, 3, 1);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(15, "div", 1)(16, "div", 9)(17, "div", 10)(18, "div")(19, "label", 11);
    \u0275\u0275text(20, " Proveedor ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "select", 12);
    \u0275\u0275twoWayListener("ngModelChange", function AmountDisplayConfigComponent_Template_select_ngModelChange_21_listener($event) {
      \u0275\u0275twoWayBindingSet(ctx.selectedTenantId, $event) || (ctx.selectedTenantId = $event);
      return $event;
    });
    \u0275\u0275listener("ngModelChange", function AmountDisplayConfigComponent_Template_select_ngModelChange_21_listener() {
      return ctx.onTenantChange();
    });
    \u0275\u0275elementStart(22, "option", 13);
    \u0275\u0275text(23, "Seleccione un proveedor...");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(24, AmountDisplayConfigComponent_For_25_Template, 2, 3, "option", 13, _forTrack0);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(26, "div")(27, "label", 11);
    \u0275\u0275text(28, " Cartera ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "select", 14);
    \u0275\u0275twoWayListener("ngModelChange", function AmountDisplayConfigComponent_Template_select_ngModelChange_29_listener($event) {
      \u0275\u0275twoWayBindingSet(ctx.selectedPortfolioId, $event) || (ctx.selectedPortfolioId = $event);
      return $event;
    });
    \u0275\u0275listener("ngModelChange", function AmountDisplayConfigComponent_Template_select_ngModelChange_29_listener() {
      return ctx.onPortfolioChange();
    });
    \u0275\u0275elementStart(30, "option", 13);
    \u0275\u0275text(31, "Seleccione una cartera...");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(32, AmountDisplayConfigComponent_For_33_Template, 2, 3, "option", 13, _forTrack0);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(34, "div")(35, "label", 11);
    \u0275\u0275text(36, " Subcartera ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(37, "select", 14);
    \u0275\u0275twoWayListener("ngModelChange", function AmountDisplayConfigComponent_Template_select_ngModelChange_37_listener($event) {
      \u0275\u0275twoWayBindingSet(ctx.selectedSubPortfolioId, $event) || (ctx.selectedSubPortfolioId = $event);
      return $event;
    });
    \u0275\u0275listener("ngModelChange", function AmountDisplayConfigComponent_Template_select_ngModelChange_37_listener() {
      return ctx.onSubPortfolioChange();
    });
    \u0275\u0275elementStart(38, "option", 13);
    \u0275\u0275text(39, "Seleccione una subcartera...");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(40, AmountDisplayConfigComponent_For_41_Template, 2, 3, "option", 13, _forTrack0);
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275conditionalCreate(42, AmountDisplayConfigComponent_Conditional_42_Template, 21, 2);
    \u0275\u0275conditionalCreate(43, AmountDisplayConfigComponent_Conditional_43_Template, 4, 1, "div", 15);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance(6);
    \u0275\u0275property("size", 16);
    \u0275\u0275advance(6);
    \u0275\u0275property("disabled", !ctx.hasChanges() || ctx.saving());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx.saving() ? 13 : 14);
    \u0275\u0275advance(8);
    \u0275\u0275twoWayProperty("ngModel", ctx.selectedTenantId);
    \u0275\u0275advance();
    \u0275\u0275property("value", 0);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx.tenants());
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx.selectedPortfolioId);
    \u0275\u0275property("disabled", ctx.selectedTenantId === 0);
    \u0275\u0275advance();
    \u0275\u0275property("value", 0);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx.portfolios());
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx.selectedSubPortfolioId);
    \u0275\u0275property("disabled", ctx.selectedPortfolioId === 0);
    \u0275\u0275advance();
    \u0275\u0275property("value", 0);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx.subPortfolios());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx.selectedSubPortfolioId > 0 ? 42 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx.showSuccess() ? 43 : -1);
  }
}, dependencies: [CommonModule, FormsModule, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, SelectControlValueAccessor, NgControlStatus, NgModel, LucideAngularModule, LucideAngularComponent, DragDropModule, CdkDropList, CdkDrag, CdkDragHandle, CdkDragPlaceholder], styles: ["\n\n@keyframes _ngcontent-%COMP%_slide-in {\n  from {\n    transform: translateX(100%);\n    opacity: 0;\n  }\n  to {\n    transform: translateX(0);\n    opacity: 1;\n  }\n}\n.animate-slide-in[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_slide-in 0.3s ease-out;\n}\n.cdk-drag-preview[_ngcontent-%COMP%] {\n  background: #1e293b;\n  border-radius: 0.5rem;\n  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);\n  border: 1px solid #334155;\n}\n.cdk-drag-animating[_ngcontent-%COMP%] {\n  transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);\n}\n.cdk-drop-list-dragging[_ngcontent-%COMP%]   .cdk-drag[_ngcontent-%COMP%] {\n  transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);\n}\n/*# sourceMappingURL=amount-display-config.component.css.map */"] });
var AmountDisplayConfigComponent = _AmountDisplayConfigComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AmountDisplayConfigComponent, [{
    type: Component,
    args: [{ selector: "app-amount-display-config", standalone: true, imports: [CommonModule, FormsModule, LucideAngularModule, DragDropModule], template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <!-- Header -->
      <div class="max-w-5xl mx-auto mb-6">
        <div class="flex items-center justify-between">
          <div>
            <div class="flex items-center gap-2 mb-2">
              <div class="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center">
                <lucide-angular name="eye" [size]="16" class="text-white"></lucide-angular>
              </div>
              <div>
                <h1 class="text-lg font-bold text-white">Campos de Montos a Mostrar</h1>
                <p class="text-xs text-gray-400">Configure qu\xE9 campos de importes se muestran en el panel de deuda</p>
              </div>
            </div>
          </div>

          <button (click)="saveChanges()"
                  [disabled]="!hasChanges() || saving()"
                  class="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg font-semibold hover:shadow-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer">
            @if (saving()) {
              <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Guardando...</span>
            } @else {
              <lucide-angular name="save" [size]="18"></lucide-angular>
              <span>Guardar Cambios</span>
            }
          </button>
        </div>
      </div>

      <!-- Selectors -->
      <div class="max-w-5xl mx-auto mb-6">
        <div class="bg-slate-900 rounded-xl p-4 shadow-sm border border-slate-800">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Tenant Selector -->
            <div>
              <label class="block text-sm font-semibold text-gray-300 mb-2">
                Proveedor
              </label>
              <select [(ngModel)]="selectedTenantId"
                      (ngModelChange)="onTenantChange()"
                      class="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500">
                <option [value]="0">Seleccione un proveedor...</option>
                @for (tenant of tenants(); track tenant.id) {
                  <option [value]="tenant.id">{{ tenant.tenantName }} ({{ tenant.tenantCode }})</option>
                }
              </select>
            </div>

            <!-- Portfolio Selector -->
            <div>
              <label class="block text-sm font-semibold text-gray-300 mb-2">
                Cartera
              </label>
              <select [(ngModel)]="selectedPortfolioId"
                      (ngModelChange)="onPortfolioChange()"
                      [disabled]="selectedTenantId === 0"
                      class="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed">
                <option [value]="0">Seleccione una cartera...</option>
                @for (portfolio of portfolios(); track portfolio.id) {
                  <option [value]="portfolio.id">{{ portfolio.portfolioName }} ({{ portfolio.portfolioCode }})</option>
                }
              </select>
            </div>

            <!-- SubPortfolio Selector -->
            <div>
              <label class="block text-sm font-semibold text-gray-300 mb-2">
                Subcartera
              </label>
              <select [(ngModel)]="selectedSubPortfolioId"
                      (ngModelChange)="onSubPortfolioChange()"
                      [disabled]="selectedPortfolioId === 0"
                      class="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed">
                <option [value]="0">Seleccione una subcartera...</option>
                @for (subPortfolio of subPortfolios(); track subPortfolio.id) {
                  <option [value]="subPortfolio.id">{{ subPortfolio.subPortfolioName }} ({{ subPortfolio.subPortfolioCode }})</option>
                }
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Info Card -->
      @if (selectedSubPortfolioId > 0) {
        <div class="max-w-5xl mx-auto mb-6">
          <div class="bg-amber-900/20 border border-amber-700/50 rounded-xl p-4">
            <div class="flex items-start gap-3">
              <lucide-angular name="info" [size]="20" class="text-amber-400 mt-0.5 flex-shrink-0"></lucide-angular>
              <div>
                <p class="text-amber-200 text-sm font-medium">Instrucciones</p>
                <ul class="text-amber-200/70 text-sm mt-1 space-y-1">
                  <li>Use los toggles para mostrar u ocultar cada campo de monto en el panel de deuda</li>
                  <li>Haga clic en el nombre para editarlo y personalizar c\xF3mo se muestra</li>
                  <li>Arrastre los campos para cambiar el orden de visualizaci\xF3n</li>
                  <li>Los cambios se guardan al hacer clic en "Guardar Cambios"</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Fields List -->
        <div class="max-w-5xl mx-auto">
          <div class="bg-slate-900 rounded-xl shadow-sm border border-slate-800 overflow-hidden">
            @if (loading()) {
              <div class="p-12 text-center">
                <div class="inline-block w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                <p class="mt-4 text-gray-400">Cargando campos de montos...</p>
              </div>
            } @else if (amountFields().length === 0) {
              <div class="p-12 text-center">
                <div class="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <lucide-angular name="dollar-sign" [size]="32" class="text-gray-600"></lucide-angular>
                </div>
                <p class="text-gray-300 mb-2">No se encontraron campos de montos</p>
                <p class="text-sm text-gray-500">
                  Esta subcartera no tiene campos num\xE9ricos decimales configurados
                </p>
              </div>
            } @else {
              <!-- Header -->
              <div class="bg-slate-800 border-b border-slate-700 px-6 py-3">
                <div class="flex items-center justify-between">
                  <span class="text-sm font-semibold text-gray-300">
                    {{ amountFields().length }} campos de montos encontrados
                  </span>
                  <div class="flex items-center gap-4">
                    <button (click)="toggleAll(true)"
                            class="text-xs text-emerald-400 hover:text-emerald-300 transition-colors">
                      Mostrar todos
                    </button>
                    <button (click)="toggleAll(false)"
                            class="text-xs text-red-400 hover:text-red-300 transition-colors">
                      Ocultar todos
                    </button>
                  </div>
                </div>
              </div>

              <!-- Draggable List -->
              <div cdkDropList
                   (cdkDropListDropped)="drop($event)"
                   class="divide-y divide-slate-800">
                @for (field of amountFields(); track field.id; let i = $index) {
                  <div cdkDrag
                       class="flex items-center justify-between px-6 py-4 hover:bg-slate-800/50 transition-colors cursor-move">
                    <!-- Drag Handle -->
                    <div class="flex items-center gap-4 flex-1">
                      <div cdkDragHandle class="text-slate-600 hover:text-slate-400 cursor-grab active:cursor-grabbing">
                        <lucide-angular name="grip-vertical" [size]="20"></lucide-angular>
                      </div>

                      <!-- Order Number -->
                      <div class="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-sm font-bold text-slate-400">
                        {{ i + 1 }}
                      </div>

                      <!-- Field Info -->
                      <div class="flex-1 min-w-0">
                        <input type="text"
                               [(ngModel)]="field.nombre"
                               (ngModelChange)="onNameChange(field)"
                               class="w-full bg-transparent border-b border-transparent hover:border-slate-600 focus:border-amber-500 focus:outline-none font-medium text-white px-1 py-0.5 -ml-1 transition-colors"
                               [title]="'Editar nombre: ' + field.nombre">
                        <div class="text-xs text-gray-500 font-mono mt-0.5">{{ field.codigo }}</div>
                      </div>

                      <!-- Data Type Badge -->
                      <div class="px-2 py-1 bg-slate-800 rounded text-xs text-gray-400">
                        {{ field.tipoSql }}
                      </div>
                    </div>

                    <!-- Toggle -->
                    <label class="relative inline-flex items-center cursor-pointer ml-4">
                      <input type="checkbox"
                             [checked]="field.isVisible"
                             (change)="toggleVisibility(field)"
                             class="sr-only peer">
                      <div class="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                      <span class="ml-3 text-sm font-medium" [class]="field.isVisible ? 'text-amber-400' : 'text-gray-500'">
                        {{ field.isVisible ? 'Visible' : 'Oculto' }}
                      </span>
                    </label>

                    <!-- Drag Placeholder -->
                    <div *cdkDragPlaceholder class="bg-amber-900/20 border-2 border-dashed border-amber-500 rounded-lg h-16"></div>
                  </div>
                }
              </div>
            }
          </div>
        </div>
      }

      <!-- Success Toast -->
      @if (showSuccess()) {
        <div class="fixed bottom-6 right-6 bg-emerald-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in">
          <lucide-angular name="check-circle" [size]="20"></lucide-angular>
          <span>Cambios guardados exitosamente</span>
        </div>
      }
    </div>
  `, styles: ["/* angular:styles/component:css;236bc5b3c345118b2cc18c6e1a62b207abef17132b6f9431022f375733646764;C:/Users/HP/Documents/Kubito-2.0-v1/cashi-discador-frontend/cashi-discador-frontend/src/app/maintenance/components/amount-display-config/amount-display-config.component.ts */\n@keyframes slide-in {\n  from {\n    transform: translateX(100%);\n    opacity: 0;\n  }\n  to {\n    transform: translateX(0);\n    opacity: 1;\n  }\n}\n.animate-slide-in {\n  animation: slide-in 0.3s ease-out;\n}\n.cdk-drag-preview {\n  background: #1e293b;\n  border-radius: 0.5rem;\n  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);\n  border: 1px solid #334155;\n}\n.cdk-drag-animating {\n  transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);\n}\n.cdk-drop-list-dragging .cdk-drag {\n  transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);\n}\n/*# sourceMappingURL=amount-display-config.component.css.map */\n"] }]
  }], () => [{ type: TypificationService }, { type: PortfolioService }, { type: ManagementService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AmountDisplayConfigComponent, { className: "AmountDisplayConfigComponent", filePath: "src/app/maintenance/components/amount-display-config/amount-display-config.component.ts", lineNumber: 259 });
})();
export {
  AmountDisplayConfigComponent
};
//# sourceMappingURL=chunk-NNINHUNU.js.map
