import {
  TypificationService
} from "./chunk-XGOWMJUN.js";
import {
  DefaultValueAccessor,
  FormsModule,
  MaxLengthValidator,
  NgControlStatus,
  NgModel
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
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-CTRHJBBW.js";

// src/app/maintenance/components/tenant-maintenance/tenant-maintenance.component.ts
var _forTrack0 = ($index, $item) => $item.id;
function TenantMaintenanceComponent_Conditional_52_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 29);
    \u0275\u0275element(1, "div", 32);
    \u0275\u0275elementStart(2, "p", 33);
    \u0275\u0275text(3, "Cargando proveedores...");
    \u0275\u0275elementEnd()();
  }
}
function TenantMaintenanceComponent_Conditional_53_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " Intenta con otro t\xE9rmino de b\xFAsqueda ");
  }
}
function TenantMaintenanceComponent_Conditional_53_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " Comienza creando tu primer proveedor ");
  }
}
function TenantMaintenanceComponent_Conditional_53_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 29)(1, "div", 34);
    \u0275\u0275element(2, "lucide-angular", 35);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 36);
    \u0275\u0275text(4, "No se encontraron proveedores");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 37);
    \u0275\u0275conditionalCreate(6, TenantMaintenanceComponent_Conditional_53_Conditional_6_Template, 1, 0)(7, TenantMaintenanceComponent_Conditional_53_Conditional_7_Template, 1, 0);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 32);
    \u0275\u0275advance(4);
    \u0275\u0275conditional(ctx_r0.searchTerm ? 6 : 7);
  }
}
function TenantMaintenanceComponent_Conditional_54_For_16_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr", 42)(1, "td", 43)(2, "span", 44);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "td", 43)(5, "span", 45);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "td", 43)(8, "span", 46);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "td", 43)(11, "label", 47)(12, "input", 48);
    \u0275\u0275listener("change", function TenantMaintenanceComponent_Conditional_54_For_16_Template_input_change_12_listener() {
      const tenant_r3 = \u0275\u0275restoreView(_r2).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.toggleTenantStatus(tenant_r3));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275element(13, "div", 49);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "td", 43)(15, "div", 50)(16, "button", 51);
    \u0275\u0275listener("click", function TenantMaintenanceComponent_Conditional_54_For_16_Template_button_click_16_listener() {
      const tenant_r3 = \u0275\u0275restoreView(_r2).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.editTenant(tenant_r3));
    });
    \u0275\u0275element(17, "lucide-angular", 52);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "button", 53);
    \u0275\u0275listener("click", function TenantMaintenanceComponent_Conditional_54_For_16_Template_button_click_18_listener() {
      const tenant_r3 = \u0275\u0275restoreView(_r2).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.deleteTenant(tenant_r3));
    });
    \u0275\u0275element(19, "lucide-angular", 54);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const tenant_r3 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(tenant_r3.tenantCode);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(tenant_r3.tenantName);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(tenant_r3.businessName || "-");
    \u0275\u0275advance(3);
    \u0275\u0275property("checked", tenant_r3.isActive);
    \u0275\u0275advance(5);
    \u0275\u0275property("size", 18);
    \u0275\u0275advance();
    \u0275\u0275classMap(tenant_r3.hasPortfolios ? "text-gray-600 cursor-not-allowed" : "text-red-400 hover:text-red-500 cursor-pointer");
    \u0275\u0275property("disabled", tenant_r3.hasPortfolios)("title", tenant_r3.hasPortfolios ? "No se puede eliminar: tiene carteras asociadas" : "Eliminar");
    \u0275\u0275advance();
    \u0275\u0275property("size", 18);
  }
}
function TenantMaintenanceComponent_Conditional_54_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 30)(1, "table", 38)(2, "thead", 39)(3, "tr")(4, "th", 40);
    \u0275\u0275text(5, "C\xF3digo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th", 40);
    \u0275\u0275text(7, "Nombre");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th", 40);
    \u0275\u0275text(9, "Raz\xF3n Social");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th", 40);
    \u0275\u0275text(11, "Estado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th", 40);
    \u0275\u0275text(13, "Acciones");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(14, "tbody", 41);
    \u0275\u0275repeaterCreate(15, TenantMaintenanceComponent_Conditional_54_For_16_Template, 20, 10, "tr", 42, _forTrack0);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(15);
    \u0275\u0275repeater(ctx_r0.filteredTenants());
  }
}
function TenantMaintenanceComponent_Conditional_55_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 67);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.getCodeErrorMessage());
  }
}
function TenantMaintenanceComponent_Conditional_55_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 68);
    \u0275\u0275text(1, "C\xF3digo \xFAnico alfanum\xE9rico de m\xE1ximo 3 caracteres (no se puede cambiar despu\xE9s de crear)");
    \u0275\u0275elementEnd();
  }
}
function TenantMaintenanceComponent_Conditional_55_Conditional_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 67);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.getNameErrorMessage());
  }
}
function TenantMaintenanceComponent_Conditional_55_Conditional_31_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 67);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.getBusinessNameErrorMessage());
  }
}
function TenantMaintenanceComponent_Conditional_55_Conditional_32_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 68);
    \u0275\u0275text(1, "Nombre legal de la empresa (opcional)");
    \u0275\u0275elementEnd();
  }
}
function TenantMaintenanceComponent_Conditional_55_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 31)(1, "div", 55)(2, "div", 56)(3, "div", 2)(4, "div", 50)(5, "div", 57);
    \u0275\u0275element(6, "lucide-angular", 58);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "div")(8, "h2", 59);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "p", 60);
    \u0275\u0275text(11, "Complete la informaci\xF3n del proveedor");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(12, "button", 61);
    \u0275\u0275listener("click", function TenantMaintenanceComponent_Conditional_55_Template_button_click_12_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.closeDialog());
    });
    \u0275\u0275element(13, "lucide-angular", 62);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(14, "div", 63)(15, "div", 64)(16, "div")(17, "label", 65);
    \u0275\u0275text(18, " C\xF3digo del Proveedor * ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "input", 66);
    \u0275\u0275twoWayListener("ngModelChange", function TenantMaintenanceComponent_Conditional_55_Template_input_ngModelChange_19_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.formData.tenantCode, $event) || (ctx_r0.formData.tenantCode = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(20, TenantMaintenanceComponent_Conditional_55_Conditional_20_Template, 2, 1, "p", 67)(21, TenantMaintenanceComponent_Conditional_55_Conditional_21_Template, 2, 0, "p", 68);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "div")(23, "label", 65);
    \u0275\u0275text(24, " Nombre del Proveedor * ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "input", 69);
    \u0275\u0275twoWayListener("ngModelChange", function TenantMaintenanceComponent_Conditional_55_Template_input_ngModelChange_25_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.formData.tenantName, $event) || (ctx_r0.formData.tenantName = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(26, TenantMaintenanceComponent_Conditional_55_Conditional_26_Template, 2, 1, "p", 67);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "div")(28, "label", 65);
    \u0275\u0275text(29, " Raz\xF3n Social ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(30, "input", 70);
    \u0275\u0275twoWayListener("ngModelChange", function TenantMaintenanceComponent_Conditional_55_Template_input_ngModelChange_30_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.formData.businessName, $event) || (ctx_r0.formData.businessName = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(31, TenantMaintenanceComponent_Conditional_55_Conditional_31_Template, 2, 1, "p", 67)(32, TenantMaintenanceComponent_Conditional_55_Conditional_32_Template, 2, 0, "p", 68);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(33, "div", 71)(34, "button", 72);
    \u0275\u0275listener("click", function TenantMaintenanceComponent_Conditional_55_Template_button_click_34_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.closeDialog());
    });
    \u0275\u0275text(35, " Cancelar ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(36, "button", 73);
    \u0275\u0275listener("click", function TenantMaintenanceComponent_Conditional_55_Template_button_click_36_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.saveTenant());
    });
    \u0275\u0275text(37);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275property("size", 20);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.editingTenant() ? "Editar Proveedor" : "Nuevo Proveedor");
    \u0275\u0275advance(4);
    \u0275\u0275property("size", 20);
    \u0275\u0275advance(6);
    \u0275\u0275classMap(ctx_r0.getCodeErrorMessage() ? "w-full px-4 py-2.5 bg-slate-800 border-2 border-red-500 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-slate-950 disabled:text-gray-600 uppercase" : "w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-950 disabled:text-gray-600 uppercase");
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.formData.tenantCode);
    \u0275\u0275property("disabled", ctx_r0.editingTenant() !== null);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.getCodeErrorMessage() ? 20 : 21);
    \u0275\u0275advance(5);
    \u0275\u0275classMap(ctx_r0.getNameErrorMessage() ? "w-full px-4 py-2.5 bg-slate-800 border-2 border-red-500 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500" : "w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500");
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.formData.tenantName);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.getNameErrorMessage() ? 26 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275classMap(ctx_r0.getBusinessNameErrorMessage() ? "w-full px-4 py-2.5 bg-slate-800 border-2 border-red-500 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500" : "w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500");
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.formData.businessName);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.getBusinessNameErrorMessage() ? 31 : 32);
    \u0275\u0275advance(5);
    \u0275\u0275property("disabled", !ctx_r0.canSave());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.editingTenant() ? "Guardar Cambios" : "Crear Proveedor", " ");
  }
}
var _TenantMaintenanceComponent = class _TenantMaintenanceComponent {
  constructor(typificationService) {
    this.typificationService = typificationService;
    this.tenants = signal([], ...ngDevMode ? [{ debugName: "tenants" }] : []);
    this.filteredTenants = signal([], ...ngDevMode ? [{ debugName: "filteredTenants" }] : []);
    this.loading = signal(true, ...ngDevMode ? [{ debugName: "loading" }] : []);
    this.showDialog = signal(false, ...ngDevMode ? [{ debugName: "showDialog" }] : []);
    this.editingTenant = signal(null, ...ngDevMode ? [{ debugName: "editingTenant" }] : []);
    this.searchTerm = "";
    this.formData = {
      tenantCode: "",
      tenantName: "",
      businessName: ""
    };
  }
  ngOnInit() {
    this.loadTenants();
  }
  loadTenants() {
    this.loading.set(true);
    this.typificationService.getAllTenants().subscribe({
      next: (tenants) => {
        this.tenants.set(tenants);
        this.filteredTenants.set(tenants);
        this.loading.set(false);
      },
      error: (error) => {
        console.error("Error loading tenants:", error);
        this.loading.set(false);
      }
    });
  }
  filterTenants() {
    const term = this.searchTerm.toLowerCase();
    if (!term) {
      this.filteredTenants.set(this.tenants());
      return;
    }
    const filtered = this.tenants().filter((t) => t.tenantCode.toLowerCase().includes(term) || t.tenantName.toLowerCase().includes(term) || t.businessName && t.businessName.toLowerCase().includes(term));
    this.filteredTenants.set(filtered);
  }
  getActiveTenants() {
    return this.tenants().filter((t) => t.isActive).length;
  }
  getInactiveTenants() {
    return this.tenants().filter((t) => !t.isActive).length;
  }
  openCreateDialog() {
    this.editingTenant.set(null);
    this.formData = {
      tenantCode: "",
      tenantName: "",
      businessName: ""
    };
    this.showDialog.set(true);
  }
  editTenant(tenant) {
    this.editingTenant.set(tenant);
    this.formData = {
      tenantCode: tenant.tenantCode,
      tenantName: tenant.tenantName,
      businessName: tenant.businessName || ""
    };
    this.showDialog.set(true);
  }
  closeDialog() {
    this.showDialog.set(false);
    this.editingTenant.set(null);
  }
  canSave() {
    if (!this.formData.tenantCode.trim() || !this.formData.tenantName.trim()) {
      return false;
    }
    if (this.getCodeErrorMessage() || this.getNameErrorMessage() || this.getBusinessNameErrorMessage()) {
      return false;
    }
    return true;
  }
  getCodeErrorMessage() {
    if (!this.formData.tenantCode.trim()) {
      return "";
    }
    if (!this.editingTenant()) {
      const codeExists = this.tenants().some((t) => t.tenantCode.toLowerCase() === this.formData.tenantCode.trim().toLowerCase());
      if (codeExists) {
        return "Este c\xF3digo ya est\xE1 en uso";
      }
    }
    return "";
  }
  getNameErrorMessage() {
    if (!this.formData.tenantName.trim()) {
      return "";
    }
    const editing = this.editingTenant();
    const nameExists = this.tenants().some((t) => (!editing || t.id !== editing.id) && t.tenantName.toLowerCase() === this.formData.tenantName.trim().toLowerCase());
    if (nameExists) {
      return "Este nombre ya est\xE1 en uso";
    }
    return "";
  }
  getBusinessNameErrorMessage() {
    if (!this.formData.businessName?.trim()) {
      return "";
    }
    const editing = this.editingTenant();
    const businessNameExists = this.tenants().some((t) => (!editing || t.id !== editing.id) && t.businessName && t.businessName.toLowerCase() === this.formData.businessName.trim().toLowerCase());
    if (businessNameExists) {
      return "Esta raz\xF3n social ya est\xE1 en uso";
    }
    return "";
  }
  saveTenant() {
    if (!this.canSave())
      return;
    const editing = this.editingTenant();
    if (editing) {
      this.typificationService.updateTenant(editing.id, this.formData).subscribe({
        next: () => {
          this.loadTenants();
          this.closeDialog();
        },
        error: (error) => {
          console.error("Error updating tenant:", error);
          alert("Error al actualizar el proveedor");
        }
      });
    } else {
      this.typificationService.createTenant(this.formData).subscribe({
        next: () => {
          this.loadTenants();
          this.closeDialog();
        },
        error: (error) => {
          console.error("Error creating tenant:", error);
          alert("Error al crear el proveedor. Verifique que el c\xF3digo no est\xE9 duplicado.");
        }
      });
    }
  }
  toggleTenantStatus(tenant) {
    const newStatus = !tenant.isActive;
    const action = newStatus ? "activar" : "desactivar";
    if (confirm(`\xBFEst\xE1 seguro de ${action} el proveedor "${tenant.tenantName}"?`)) {
      this.typificationService.updateTenant(tenant.id, __spreadProps(__spreadValues({}, tenant), {
        isActive: newStatus
      })).subscribe({
        next: () => {
          this.loadTenants();
        },
        error: (error) => {
          console.error("Error updating tenant status:", error);
          alert("Error al cambiar el estado del proveedor");
        }
      });
    }
  }
  deleteTenant(tenant) {
    if (tenant.hasPortfolios) {
      alert("No se puede eliminar este proveedor porque tiene carteras asociadas.");
      return;
    }
    if (confirm(`\xBFEst\xE1 seguro de eliminar el proveedor "${tenant.tenantName}"? Esta acci\xF3n no se puede deshacer.`)) {
      this.typificationService.deleteTenant(tenant.id).subscribe({
        next: () => {
          this.loadTenants();
          alert("Proveedor eliminado exitosamente");
        },
        error: (error) => {
          console.error("Error deleting tenant:", error);
          alert("Error al eliminar el proveedor");
        }
      });
    }
  }
};
_TenantMaintenanceComponent.\u0275fac = function TenantMaintenanceComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _TenantMaintenanceComponent)(\u0275\u0275directiveInject(TypificationService));
};
_TenantMaintenanceComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _TenantMaintenanceComponent, selectors: [["app-tenant-maintenance"]], decls: 56, vars: 12, consts: [[1, "min-h-screen", "bg-gradient-to-br", "from-slate-900", "via-slate-800", "to-slate-900", "p-6"], [1, "max-w-7xl", "mx-auto", "mb-6"], [1, "flex", "items-center", "justify-between"], [1, "flex", "items-center", "gap-2", "mb-2"], [1, "w-8", "h-8", "bg-cyan-600", "rounded-lg", "flex", "items-center", "justify-center"], ["name", "building-2", 1, "text-white", 3, "size"], [1, "text-lg", "font-bold", "text-white"], [1, "text-xs", "text-gray-400"], [1, "flex", "items-center", "gap-2", "px-5", "py-2.5", "bg-gradient-to-r", "from-blue-600", "to-blue-700", "text-white", "rounded-lg", "font-semibold", "hover:shadow-lg", "transition-all", "hover:scale-105", "cursor-pointer", 3, "click"], ["name", "plus", 3, "size"], [1, "max-w-7xl", "mx-auto", "mb-6", "grid", "grid-cols-1", "md:grid-cols-3", "gap-4"], [1, "bg-slate-900", "rounded-xl", "p-5", "shadow-sm", "border", "border-slate-800"], [1, "text-sm", "text-gray-400", "mb-1"], [1, "text-3xl", "font-bold", "text-white"], [1, "w-12", "h-12", "bg-blue-900/30", "rounded-lg", "flex", "items-center", "justify-center"], ["name", "building-2", 1, "text-blue-400", 3, "size"], [1, "text-3xl", "font-bold", "text-green-400"], [1, "w-12", "h-12", "bg-green-900/30", "rounded-lg", "flex", "items-center", "justify-center"], ["name", "check-circle", 1, "text-green-400", 3, "size"], [1, "text-3xl", "font-bold", "text-gray-500"], [1, "w-12", "h-12", "bg-slate-800", "rounded-lg", "flex", "items-center", "justify-center"], ["name", "x-circle", 1, "text-gray-500", 3, "size"], [1, "bg-slate-900", "rounded-xl", "p-4", "shadow-sm", "border", "border-slate-800"], [1, "flex", "items-center", "gap-4"], [1, "flex-1", "relative"], ["name", "search", 1, "absolute", "left-3", "top-1/2", "-translate-y-1/2", "text-gray-500", 3, "size"], ["type", "text", "placeholder", "Buscar por c\xF3digo, nombre o raz\xF3n social...", 1, "w-full", "pl-12", "pr-4", "py-2.5", "bg-slate-800", "border", "border-slate-700", "rounded-lg", "text-white", "placeholder-gray-500", "focus:outline-none", "focus:ring-2", "focus:ring-blue-500", 3, "ngModelChange", "ngModel"], [1, "max-w-7xl", "mx-auto"], [1, "bg-slate-900", "rounded-xl", "shadow-sm", "border", "border-slate-800", "overflow-hidden"], [1, "p-12", "text-center"], [1, "overflow-x-auto"], [1, "fixed", "inset-0", "bg-black/80", "backdrop-blur-sm", "flex", "items-center", "justify-center", "z-50", "p-4"], [1, "inline-block", "w-8", "h-8", "border-4", "border-blue-500", "border-t-transparent", "rounded-full", "animate-spin"], [1, "mt-4", "text-gray-400"], [1, "w-16", "h-16", "bg-slate-800", "rounded-full", "flex", "items-center", "justify-center", "mx-auto", "mb-4"], ["name", "building-2", 1, "text-gray-600", 3, "size"], [1, "text-gray-300", "mb-2"], [1, "text-sm", "text-gray-500"], [1, "w-full"], [1, "bg-slate-800", "border-b", "border-slate-700"], [1, "px-6", "py-3", "text-left", "text-xs", "font-semibold", "text-gray-400", "uppercase", "tracking-wider"], [1, "divide-y", "divide-slate-800"], [1, "hover:bg-slate-800", "transition-colors"], [1, "px-6", "py-3"], [1, "font-mono", "text-sm", "font-semibold", "text-white"], [1, "font-medium", "text-white"], [1, "text-sm", "text-gray-400"], [1, "relative", "inline-flex", "items-center", "cursor-pointer"], ["type", "checkbox", 1, "sr-only", "peer", 3, "change", "checked"], [1, "w-11", "h-6", "bg-slate-700", "peer-focus:outline-none", "peer-focus:ring-4", "peer-focus:ring-blue-800", "rounded-full", "peer", "peer-checked:after:translate-x-full", "rtl:peer-checked:after:-translate-x-full", "peer-checked:after:border-white", "after:content-['']", "after:absolute", "after:top-[2px]", "after:start-[2px]", "after:bg-white", "after:border-gray-300", "after:border", "after:rounded-full", "after:h-5", "after:w-5", "after:transition-all", "peer-checked:bg-blue-600"], [1, "flex", "items-center", "gap-3"], ["title", "Editar", 1, "text-blue-400", "hover:text-blue-500", "transition-colors", "cursor-pointer", 3, "click"], ["name", "edit", 3, "size"], [1, "transition-colors", "disabled:opacity-50", 3, "click", "disabled", "title"], ["name", "trash-2", 3, "size"], [1, "bg-slate-900", "rounded-xl", "shadow-2xl", "max-w-2xl", "w-full", "max-h-[90vh]", "overflow-hidden", "border", "border-slate-800"], [1, "bg-gradient-to-r", "from-blue-600", "to-blue-700", "p-5", "text-white"], [1, "w-10", "h-10", "bg-white/20", "rounded-lg", "flex", "items-center", "justify-center"], ["name", "building-2", 3, "size"], [1, "text-xl", "font-bold"], [1, "text-blue-100", "text-sm"], [1, "text-white/80", "hover:text-white", 3, "click"], ["name", "x", 3, "size"], [1, "p-6", "overflow-y-auto", "max-h-[calc(90vh-200px)]"], [1, "space-y-4"], [1, "block", "text-sm", "font-semibold", "text-gray-300", "mb-2"], ["type", "text", "maxlength", "3", "placeholder", "Ej: F01, ABC", 3, "ngModelChange", "ngModel", "disabled"], [1, "text-xs", "text-red-400", "mt-1", "font-semibold"], [1, "text-xs", "text-gray-500", "mt-1"], ["type", "text", "placeholder", "Ej: Financiera XYZ", 3, "ngModelChange", "ngModel"], ["type", "text", "placeholder", "Ej: Financiera XYZ S.A.C.", 3, "ngModelChange", "ngModel"], [1, "border-t", "border-slate-800", "p-4", "flex", "justify-end", "gap-3", "bg-slate-950"], [1, "px-5", "py-2", "text-gray-400", "hover:bg-slate-800", "hover:text-white", "rounded-lg", "font-medium", "transition-colors", 3, "click"], [1, "px-5", "py-2", "bg-gradient-to-r", "from-blue-600", "to-blue-700", "text-white", "rounded-lg", "font-semibold", "hover:shadow-lg", "transition-all", "disabled:opacity-50", "disabled:cursor-not-allowed", 3, "click", "disabled"]], template: function TenantMaintenanceComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div")(4, "div", 3)(5, "div", 4);
    \u0275\u0275element(6, "lucide-angular", 5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "div")(8, "h1", 6);
    \u0275\u0275text(9, "Proveedores");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "p", 7);
    \u0275\u0275text(11, "Gesti\xF3n de proveedores de telefon\xEDa");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(12, "button", 8);
    \u0275\u0275listener("click", function TenantMaintenanceComponent_Template_button_click_12_listener() {
      return ctx.openCreateDialog();
    });
    \u0275\u0275element(13, "lucide-angular", 9);
    \u0275\u0275elementStart(14, "span");
    \u0275\u0275text(15, "Nuevo Proveedor");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(16, "div", 10)(17, "div", 11)(18, "div", 2)(19, "div")(20, "p", 12);
    \u0275\u0275text(21, "Total Proveedores");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "p", 13);
    \u0275\u0275text(23);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(24, "div", 14);
    \u0275\u0275element(25, "lucide-angular", 15);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(26, "div", 11)(27, "div", 2)(28, "div")(29, "p", 12);
    \u0275\u0275text(30, "Activos");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "p", 16);
    \u0275\u0275text(32);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(33, "div", 17);
    \u0275\u0275element(34, "lucide-angular", 18);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(35, "div", 11)(36, "div", 2)(37, "div")(38, "p", 12);
    \u0275\u0275text(39, "Inactivos");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(40, "p", 19);
    \u0275\u0275text(41);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(42, "div", 20);
    \u0275\u0275element(43, "lucide-angular", 21);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(44, "div", 1)(45, "div", 22)(46, "div", 23)(47, "div", 24);
    \u0275\u0275element(48, "lucide-angular", 25);
    \u0275\u0275elementStart(49, "input", 26);
    \u0275\u0275twoWayListener("ngModelChange", function TenantMaintenanceComponent_Template_input_ngModelChange_49_listener($event) {
      \u0275\u0275twoWayBindingSet(ctx.searchTerm, $event) || (ctx.searchTerm = $event);
      return $event;
    });
    \u0275\u0275listener("ngModelChange", function TenantMaintenanceComponent_Template_input_ngModelChange_49_listener() {
      return ctx.filterTenants();
    });
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275elementStart(50, "div", 27)(51, "div", 28);
    \u0275\u0275conditionalCreate(52, TenantMaintenanceComponent_Conditional_52_Template, 4, 0, "div", 29)(53, TenantMaintenanceComponent_Conditional_53_Template, 8, 2, "div", 29)(54, TenantMaintenanceComponent_Conditional_54_Template, 17, 0, "div", 30);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(55, TenantMaintenanceComponent_Conditional_55_Template, 38, 18, "div", 31);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance(6);
    \u0275\u0275property("size", 16);
    \u0275\u0275advance(7);
    \u0275\u0275property("size", 18);
    \u0275\u0275advance(10);
    \u0275\u0275textInterpolate(ctx.tenants().length);
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 24);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(ctx.getActiveTenants());
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 24);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(ctx.getInactiveTenants());
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 24);
    \u0275\u0275advance(5);
    \u0275\u0275property("size", 20);
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("ngModel", ctx.searchTerm);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx.loading() ? 52 : ctx.filteredTenants().length === 0 ? 53 : 54);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx.showDialog() ? 55 : -1);
  }
}, dependencies: [CommonModule, FormsModule, DefaultValueAccessor, NgControlStatus, MaxLengthValidator, NgModel, LucideAngularModule, LucideAngularComponent], encapsulation: 2 });
var TenantMaintenanceComponent = _TenantMaintenanceComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TenantMaintenanceComponent, [{
    type: Component,
    args: [{
      selector: "app-tenant-maintenance",
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
              <div class="w-8 h-8 bg-cyan-600 rounded-lg flex items-center justify-center">
                <lucide-angular name="building-2" [size]="16" class="text-white"></lucide-angular>
              </div>
              <div>
                <h1 class="text-lg font-bold text-white">Proveedores</h1>
                <p class="text-xs text-gray-400">Gesti\xF3n de proveedores de telefon\xEDa</p>
              </div>
            </div>
          </div>

          <button (click)="openCreateDialog()"
                  class="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
            <lucide-angular name="plus" [size]="18"></lucide-angular>
            <span>Nuevo Proveedor</span>
          </button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="max-w-7xl mx-auto mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-slate-900 rounded-xl p-5 shadow-sm border border-slate-800">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-400 mb-1">Total Proveedores</p>
              <p class="text-3xl font-bold text-white">{{ tenants().length }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-900/30 rounded-lg flex items-center justify-center">
              <lucide-angular name="building-2" [size]="24" class="text-blue-400"></lucide-angular>
            </div>
          </div>
        </div>

        <div class="bg-slate-900 rounded-xl p-5 shadow-sm border border-slate-800">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-400 mb-1">Activos</p>
              <p class="text-3xl font-bold text-green-400">{{ getActiveTenants() }}</p>
            </div>
            <div class="w-12 h-12 bg-green-900/30 rounded-lg flex items-center justify-center">
              <lucide-angular name="check-circle" [size]="24" class="text-green-400"></lucide-angular>
            </div>
          </div>
        </div>

        <div class="bg-slate-900 rounded-xl p-5 shadow-sm border border-slate-800">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-400 mb-1">Inactivos</p>
              <p class="text-3xl font-bold text-gray-500">{{ getInactiveTenants() }}</p>
            </div>
            <div class="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center">
              <lucide-angular name="x-circle" [size]="24" class="text-gray-500"></lucide-angular>
            </div>
          </div>
        </div>
      </div>

      <!-- Search and Filters -->
      <div class="max-w-7xl mx-auto mb-6">
        <div class="bg-slate-900 rounded-xl p-4 shadow-sm border border-slate-800">
          <div class="flex items-center gap-4">
            <div class="flex-1 relative">
              <lucide-angular name="search" [size]="20" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"></lucide-angular>
              <input type="text"
                     [(ngModel)]="searchTerm"
                     (ngModelChange)="filterTenants()"
                     placeholder="Buscar por c\xF3digo, nombre o raz\xF3n social..."
                     class="w-full pl-12 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
          </div>
        </div>
      </div>

      <!-- Tenants Table -->
      <div class="max-w-7xl mx-auto">
        <div class="bg-slate-900 rounded-xl shadow-sm border border-slate-800 overflow-hidden">
          @if (loading()) {
            <div class="p-12 text-center">
              <div class="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p class="mt-4 text-gray-400">Cargando proveedores...</p>
            </div>
          } @else if (filteredTenants().length === 0) {
            <div class="p-12 text-center">
              <div class="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <lucide-angular name="building-2" [size]="32" class="text-gray-600"></lucide-angular>
              </div>
              <p class="text-gray-300 mb-2">No se encontraron proveedores</p>
              <p class="text-sm text-gray-500">
                @if (searchTerm) {
                  Intenta con otro t\xE9rmino de b\xFAsqueda
                } @else {
                  Comienza creando tu primer proveedor
                }
              </p>
            </div>
          } @else {
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-slate-800 border-b border-slate-700">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">C\xF3digo</th>
                    <th class="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Nombre</th>
                    <th class="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Raz\xF3n Social</th>
                    <th class="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Estado</th>
                    <th class="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-800">
                  @for (tenant of filteredTenants(); track tenant.id) {
                    <tr class="hover:bg-slate-800 transition-colors">
                      <td class="px-6 py-3">
                        <span class="font-mono text-sm font-semibold text-white">{{ tenant.tenantCode }}</span>
                      </td>
                      <td class="px-6 py-3">
                        <span class="font-medium text-white">{{ tenant.tenantName }}</span>
                      </td>
                      <td class="px-6 py-3">
                        <span class="text-sm text-gray-400">{{ tenant.businessName || '-' }}</span>
                      </td>
                      <td class="px-6 py-3">
                        <label class="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox"
                                 [checked]="tenant.isActive"
                                 (change)="toggleTenantStatus(tenant)"
                                 class="sr-only peer">
                          <div class="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </td>
                      <td class="px-6 py-3">
                        <div class="flex items-center gap-3">
                          <button (click)="editTenant(tenant)"
                                  class="text-blue-400 hover:text-blue-500 transition-colors cursor-pointer"
                                  title="Editar">
                            <lucide-angular name="edit" [size]="18"></lucide-angular>
                          </button>
                          <button (click)="deleteTenant(tenant)"
                                  [disabled]="tenant.hasPortfolios"
                                  [class]="tenant.hasPortfolios ? 'text-gray-600 cursor-not-allowed' : 'text-red-400 hover:text-red-500 cursor-pointer'"
                                  class="transition-colors disabled:opacity-50"
                                  [title]="tenant.hasPortfolios ? 'No se puede eliminar: tiene carteras asociadas' : 'Eliminar'">
                            <lucide-angular name="trash-2" [size]="18"></lucide-angular>
                          </button>
                        </div>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
        </div>
      </div>

      <!-- Create/Edit Dialog -->
      @if (showDialog()) {
        <div class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div class="bg-slate-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-slate-800">
            <!-- Dialog Header -->
            <div class="bg-gradient-to-r from-blue-600 to-blue-700 p-5 text-white">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <lucide-angular name="building-2" [size]="20"></lucide-angular>
                  </div>
                  <div>
                    <h2 class="text-xl font-bold">{{ editingTenant() ? 'Editar Proveedor' : 'Nuevo Proveedor' }}</h2>
                    <p class="text-blue-100 text-sm">Complete la informaci\xF3n del proveedor</p>
                  </div>
                </div>
                <button (click)="closeDialog()" class="text-white/80 hover:text-white">
                  <lucide-angular name="x" [size]="20"></lucide-angular>
                </button>
              </div>
            </div>

            <!-- Dialog Body -->
            <div class="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <div class="space-y-4">
                <!-- C\xF3digo -->
                <div>
                  <label class="block text-sm font-semibold text-gray-300 mb-2">
                    C\xF3digo del Proveedor *
                  </label>
                  <input type="text"
                         [(ngModel)]="formData.tenantCode"
                         [disabled]="editingTenant() !== null"
                         maxlength="3"
                         placeholder="Ej: F01, ABC"
                         [class]="getCodeErrorMessage() ? 'w-full px-4 py-2.5 bg-slate-800 border-2 border-red-500 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-slate-950 disabled:text-gray-600 uppercase' : 'w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-950 disabled:text-gray-600 uppercase'">
                  @if (getCodeErrorMessage()) {
                    <p class="text-xs text-red-400 mt-1 font-semibold">{{ getCodeErrorMessage() }}</p>
                  } @else {
                    <p class="text-xs text-gray-500 mt-1">C\xF3digo \xFAnico alfanum\xE9rico de m\xE1ximo 3 caracteres (no se puede cambiar despu\xE9s de crear)</p>
                  }
                </div>

                <!-- Nombre -->
                <div>
                  <label class="block text-sm font-semibold text-gray-300 mb-2">
                    Nombre del Proveedor *
                  </label>
                  <input type="text"
                         [(ngModel)]="formData.tenantName"
                         placeholder="Ej: Financiera XYZ"
                         [class]="getNameErrorMessage() ? 'w-full px-4 py-2.5 bg-slate-800 border-2 border-red-500 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500' : 'w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500'">
                  @if (getNameErrorMessage()) {
                    <p class="text-xs text-red-400 mt-1 font-semibold">{{ getNameErrorMessage() }}</p>
                  }
                </div>

                <!-- Raz\xF3n Social -->
                <div>
                  <label class="block text-sm font-semibold text-gray-300 mb-2">
                    Raz\xF3n Social
                  </label>
                  <input type="text"
                         [(ngModel)]="formData.businessName"
                         placeholder="Ej: Financiera XYZ S.A.C."
                         [class]="getBusinessNameErrorMessage() ? 'w-full px-4 py-2.5 bg-slate-800 border-2 border-red-500 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500' : 'w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500'">
                  @if (getBusinessNameErrorMessage()) {
                    <p class="text-xs text-red-400 mt-1 font-semibold">{{ getBusinessNameErrorMessage() }}</p>
                  } @else {
                    <p class="text-xs text-gray-500 mt-1">Nombre legal de la empresa (opcional)</p>
                  }
                </div>
              </div>
            </div>

            <!-- Dialog Footer -->
            <div class="border-t border-slate-800 p-4 flex justify-end gap-3 bg-slate-950">
              <button (click)="closeDialog()"
                      class="px-5 py-2 text-gray-400 hover:bg-slate-800 hover:text-white rounded-lg font-medium transition-colors">
                Cancelar
              </button>
              <button (click)="saveTenant()"
                      [disabled]="!canSave()"
                      class="px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                {{ editingTenant() ? 'Guardar Cambios' : 'Crear Proveedor' }}
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `
    }]
  }], () => [{ type: TypificationService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(TenantMaintenanceComponent, { className: "TenantMaintenanceComponent", filePath: "src/app/maintenance/components/tenant-maintenance/tenant-maintenance.component.ts", lineNumber: 266 });
})();
export {
  TenantMaintenanceComponent
};
//# sourceMappingURL=chunk-REOKUV7V.js.map
