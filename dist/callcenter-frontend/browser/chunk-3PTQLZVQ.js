import {
  RolService
} from "./chunk-4XWBM3EE.js";
import {
  TenantService
} from "./chunk-RDUKPQZZ.js";
import {
  PortfolioService
} from "./chunk-K6HKS25L.js";
import {
  CheckboxControlValueAccessor,
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgModel
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
  __spreadProps,
  __spreadValues,
  computed,
  inject,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassMap,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-CTRHJBBW.js";

// src/app/maintenance/services/permiso.service.ts
var _PermisoService = class _PermisoService {
  constructor() {
    this.http = inject(HttpClient);
    this.apiUrl = `${environment.apiUrl}/permisos`;
  }
  obtenerTodos() {
    return this.http.get(this.apiUrl);
  }
  obtenerAgrupados() {
    return this.http.get(`${this.apiUrl}/agrupados`);
  }
  obtenerPorCategoria(categoria) {
    return this.http.get(`${this.apiUrl}/categoria/${categoria}`);
  }
};
_PermisoService.\u0275fac = function PermisoService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _PermisoService)();
};
_PermisoService.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _PermisoService, factory: _PermisoService.\u0275fac, providedIn: "root" });
var PermisoService = _PermisoService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PermisoService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/maintenance/components/roles-management/roles-management.component.ts
var _forTrack0 = ($index, $item) => $item.id;
function RolesManagementComponent_Conditional_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 17);
    \u0275\u0275element(1, "lucide-angular", 30);
    \u0275\u0275elementStart(2, "p", 8);
    \u0275\u0275text(3, "Sin roles");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p", 31);
    \u0275\u0275text(5, "Crea uno nuevo");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 28);
  }
}
function RolesManagementComponent_Conditional_26_For_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 33);
    \u0275\u0275listener("click", function RolesManagementComponent_Conditional_26_For_1_Template_div_click_0_listener() {
      const role_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.selectRole(role_r2));
    });
    \u0275\u0275elementStart(1, "div", 34)(2, "div", 35)(3, "div", 36);
    \u0275\u0275element(4, "lucide-angular", 37);
    \u0275\u0275elementStart(5, "h3", 38);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 39)(8, "span");
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "span");
    \u0275\u0275text(11, "\u2022");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "span");
    \u0275\u0275text(13);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(14, "button", 40);
    \u0275\u0275listener("click", function RolesManagementComponent_Conditional_26_For_1_Template_button_click_14_listener($event) {
      const role_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      ctx_r2.deleteRole(role_r2);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275element(15, "lucide-angular", 41);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    let tmp_11_0;
    const role_r2 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275classMap(((tmp_11_0 = ctx_r2.selectedRole()) == null ? null : tmp_11_0.id) === role_r2.id ? "bg-purple-900/40 border-purple-500" : "bg-slate-800 border-slate-700 hover:border-purple-500/50");
    \u0275\u0275advance(4);
    \u0275\u0275property("size", 12);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(role_r2.name);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("", role_r2.permissions.length, " permisos");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("", ctx_r2.countSubPortfoliosForRole(role_r2), " subcarteras");
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 12);
  }
}
function RolesManagementComponent_Conditional_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275repeaterCreate(0, RolesManagementComponent_Conditional_26_For_1_Template, 16, 7, "div", 32, _forTrack0);
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275repeater(ctx_r2.roles());
  }
}
function RolesManagementComponent_Conditional_36_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 42);
    \u0275\u0275listener("click", function RolesManagementComponent_Conditional_36_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.toggleExpandAll());
    });
    \u0275\u0275element(1, "lucide-angular", 43);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("title", ctx_r2.isAnyExpanded() ? "Colapsar todo" : "Expandir todo");
    \u0275\u0275advance();
    \u0275\u0275property("name", ctx_r2.isAnyExpanded() ? "chevron-up" : "chevron-down")("size", 12);
  }
}
function RolesManagementComponent_Conditional_38_For_2_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 52);
    \u0275\u0275listener("click", function RolesManagementComponent_Conditional_38_For_2_Conditional_7_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r7);
      const tenant_r6 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      ctx_r2.toggleTenantExpand(tenant_r6.id);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275element(1, "lucide-angular", 53);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const tenant_r6 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("name", ctx_r2.isTenantExpanded(tenant_r6.id) ? "chevron-down" : "chevron-right")("size", 12);
  }
}
function RolesManagementComponent_Conditional_38_For_2_Conditional_8_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 54);
    \u0275\u0275text(1, " Sin carteras ");
    \u0275\u0275elementEnd();
  }
}
function RolesManagementComponent_Conditional_38_For_2_Conditional_8_For_3_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 52);
    \u0275\u0275listener("click", function RolesManagementComponent_Conditional_38_For_2_Conditional_8_For_3_Conditional_7_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r10);
      const portfolio_r9 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext(4);
      ctx_r2.togglePortfolioExpand(portfolio_r9.id);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275element(1, "lucide-angular", 53);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const portfolio_r9 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275property("name", ctx_r2.isPortfolioExpanded(portfolio_r9.id) ? "chevron-down" : "chevron-right")("size", 11);
  }
}
function RolesManagementComponent_Conditional_38_For_2_Conditional_8_For_3_Conditional_8_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 62);
    \u0275\u0275text(1, " Sin subcarteras ");
    \u0275\u0275elementEnd();
  }
}
function RolesManagementComponent_Conditional_38_For_2_Conditional_8_For_3_Conditional_8_For_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 63)(1, "label", 57)(2, "input", 64);
    \u0275\u0275listener("change", function RolesManagementComponent_Conditional_38_For_2_Conditional_8_For_3_Conditional_8_For_3_Template_input_change_2_listener() {
      const subPortfolio_r12 = \u0275\u0275restoreView(_r11).$implicit;
      const portfolio_r9 = \u0275\u0275nextContext(2).$implicit;
      const tenant_r6 = \u0275\u0275nextContext(2).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.toggleSubPortfolioAssignment(tenant_r6.id, portfolio_r9.id, subPortfolio_r12.id));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275element(3, "lucide-angular", 65);
    \u0275\u0275elementStart(4, "span", 66);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const subPortfolio_r12 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(6);
    \u0275\u0275advance(2);
    \u0275\u0275property("checked", ctx_r2.isSubPortfolioAssigned(subPortfolio_r12.id));
    \u0275\u0275advance();
    \u0275\u0275property("size", 10);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", subPortfolio_r12.subPortfolioName, " ");
  }
}
function RolesManagementComponent_Conditional_38_For_2_Conditional_8_For_3_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 61);
    \u0275\u0275conditionalCreate(1, RolesManagementComponent_Conditional_38_For_2_Conditional_8_For_3_Conditional_8_Conditional_1_Template, 2, 0, "div", 62);
    \u0275\u0275repeaterCreate(2, RolesManagementComponent_Conditional_38_For_2_Conditional_8_For_3_Conditional_8_For_3_Template, 6, 3, "div", 63, _forTrack0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const portfolio_r9 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.getSubPortfoliosByPortfolio(portfolio_r9.id).length === 0 ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r2.getSubPortfoliosByPortfolio(portfolio_r9.id));
  }
}
function RolesManagementComponent_Conditional_38_For_2_Conditional_8_For_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 55)(1, "div", 56)(2, "label", 57)(3, "input", 58);
    \u0275\u0275listener("change", function RolesManagementComponent_Conditional_38_For_2_Conditional_8_For_3_Template_input_change_3_listener() {
      const portfolio_r9 = \u0275\u0275restoreView(_r8).$implicit;
      const tenant_r6 = \u0275\u0275nextContext(2).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.togglePortfolioAssignment(tenant_r6.id, portfolio_r9.id));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275element(4, "lucide-angular", 59);
    \u0275\u0275elementStart(5, "span", 60);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(7, RolesManagementComponent_Conditional_38_For_2_Conditional_8_For_3_Conditional_7_Template, 2, 2, "button", 50);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(8, RolesManagementComponent_Conditional_38_For_2_Conditional_8_For_3_Conditional_8_Template, 4, 1, "div", 61);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const portfolio_r9 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(4);
    \u0275\u0275advance(3);
    \u0275\u0275property("checked", ctx_r2.isPortfolioAssigned(portfolio_r9.id));
    \u0275\u0275advance();
    \u0275\u0275property("size", 11);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", portfolio_r9.portfolioName, " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.getSubPortfoliosByPortfolio(portfolio_r9.id).length > 0 ? 7 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.isPortfolioExpanded(portfolio_r9.id) ? 8 : -1);
  }
}
function RolesManagementComponent_Conditional_38_For_2_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 51);
    \u0275\u0275conditionalCreate(1, RolesManagementComponent_Conditional_38_For_2_Conditional_8_Conditional_1_Template, 2, 0, "div", 54);
    \u0275\u0275repeaterCreate(2, RolesManagementComponent_Conditional_38_For_2_Conditional_8_For_3_Template, 9, 5, "div", 55, _forTrack0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const tenant_r6 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.getPortfoliosByTenant(tenant_r6.id).length === 0 ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r2.getPortfoliosByTenant(tenant_r6.id));
  }
}
function RolesManagementComponent_Conditional_38_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 44)(1, "div", 45)(2, "label", 46)(3, "input", 47);
    \u0275\u0275listener("change", function RolesManagementComponent_Conditional_38_For_2_Template_input_change_3_listener() {
      const tenant_r6 = \u0275\u0275restoreView(_r5).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.toggleTenantAssignment(tenant_r6.id));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275element(4, "lucide-angular", 48);
    \u0275\u0275elementStart(5, "span", 49);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(7, RolesManagementComponent_Conditional_38_For_2_Conditional_7_Template, 2, 2, "button", 50);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(8, RolesManagementComponent_Conditional_38_For_2_Conditional_8_Template, 4, 1, "div", 51);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const tenant_r6 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275property("checked", ctx_r2.isTenantAssigned(tenant_r6.id));
    \u0275\u0275advance();
    \u0275\u0275property("size", 12);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", tenant_r6.tenantName, " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.getPortfoliosByTenant(tenant_r6.id).length > 0 ? 7 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.isTenantExpanded(tenant_r6.id) ? 8 : -1);
  }
}
function RolesManagementComponent_Conditional_38_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 24);
    \u0275\u0275repeaterCreate(1, RolesManagementComponent_Conditional_38_For_2_Template, 9, 5, "div", 44, _forTrack0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r2.tenants());
  }
}
function RolesManagementComponent_Conditional_39_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 25);
    \u0275\u0275element(1, "lucide-angular", 67);
    \u0275\u0275elementStart(2, "p", 8);
    \u0275\u0275text(3, "Selecciona un rol para asignar");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 32);
  }
}
function RolesManagementComponent_Conditional_47_For_21_For_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "label", 82)(1, "input", 83);
    \u0275\u0275listener("change", function RolesManagementComponent_Conditional_47_For_21_For_7_Template_input_change_1_listener() {
      const permission_r15 = \u0275\u0275restoreView(_r14).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.togglePermission(permission_r15.id));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "div", 35)(3, "div", 84);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 85);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const permission_r15 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275property("checked", ctx_r2.isPermissionSelected(permission_r15.id));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", permission_r15.name, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", permission_r15.description, " ");
  }
}
function RolesManagementComponent_Conditional_47_For_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 77)(1, "div", 78);
    \u0275\u0275element(2, "lucide-angular", 79);
    \u0275\u0275elementStart(3, "h4", 80);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "div", 81);
    \u0275\u0275repeaterCreate(6, RolesManagementComponent_Conditional_47_For_21_For_7_Template, 7, 3, "label", 82, _forTrack0);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const category_r16 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 12);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(category_r16);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r2.getPermissionsByCategory(category_r16));
  }
}
function RolesManagementComponent_Conditional_47_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 68)(1, "div")(2, "label", 69);
    \u0275\u0275text(3, "Nombre del Rol");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "input", 70);
    \u0275\u0275twoWayListener("ngModelChange", function RolesManagementComponent_Conditional_47_Template_input_ngModelChange_4_listener($event) {
      \u0275\u0275restoreView(_r13);
      const ctx_r2 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r2.selectedRole().name, $event) || (ctx_r2.selectedRole().name = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "div")(6, "label", 69);
    \u0275\u0275text(7, "Descripci\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "textarea", 71);
    \u0275\u0275twoWayListener("ngModelChange", function RolesManagementComponent_Conditional_47_Template_textarea_ngModelChange_8_listener($event) {
      \u0275\u0275restoreView(_r13);
      const ctx_r2 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r2.selectedRole().description, $event) || (ctx_r2.selectedRole().description = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "div", 4)(10, "input", 72);
    \u0275\u0275twoWayListener("ngModelChange", function RolesManagementComponent_Conditional_47_Template_input_ngModelChange_10_listener($event) {
      \u0275\u0275restoreView(_r13);
      const ctx_r2 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r2.selectedRole().active, $event) || (ctx_r2.selectedRole().active = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "label", 73);
    \u0275\u0275text(12, "Rol activo");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(13, "div")(14, "div", 74)(15, "label", 75);
    \u0275\u0275text(16, "Permisos");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "span", 8);
    \u0275\u0275text(18);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(19, "div", 76);
    \u0275\u0275repeaterCreate(20, RolesManagementComponent_Conditional_47_For_21_Template, 8, 2, "div", 77, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.selectedRole().name);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.selectedRole().description);
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.selectedRole().active);
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate1("", ctx_r2.selectedRole().permissions.length, " seleccionados");
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r2.permissionCategories());
  }
}
function RolesManagementComponent_Conditional_48_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 25);
    \u0275\u0275element(1, "lucide-angular", 86);
    \u0275\u0275elementStart(2, "p", 87);
    \u0275\u0275text(3, "Selecciona o crea un rol");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 32);
  }
}
function RolesManagementComponent_Conditional_49_Template(rf, ctx) {
  if (rf & 1) {
    const _r17 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 29)(1, "button", 88);
    \u0275\u0275listener("click", function RolesManagementComponent_Conditional_49_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r17);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.cancelEdit());
    });
    \u0275\u0275text(2, " Cancelar ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "button", 89);
    \u0275\u0275listener("click", function RolesManagementComponent_Conditional_49_Template_button_click_3_listener() {
      \u0275\u0275restoreView(_r17);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.saveRole());
    });
    \u0275\u0275element(4, "lucide-angular", 90);
    \u0275\u0275text(5, " Guardar ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275property("disabled", !ctx_r2.isRoleValid());
    \u0275\u0275advance();
    \u0275\u0275property("size", 16);
  }
}
var _RolesManagementComponent = class _RolesManagementComponent {
  constructor() {
    this.tenants = signal([], ...ngDevMode ? [{ debugName: "tenants" }] : []);
    this.allPortfolios = signal([], ...ngDevMode ? [{ debugName: "allPortfolios" }] : []);
    this.allSubPortfolios = signal([], ...ngDevMode ? [{ debugName: "allSubPortfolios" }] : []);
    this.expandedTenants = signal([], ...ngDevMode ? [{ debugName: "expandedTenants" }] : []);
    this.expandedPortfolios = signal([], ...ngDevMode ? [{ debugName: "expandedPortfolios" }] : []);
    this.roles = signal([], ...ngDevMode ? [{ debugName: "roles" }] : []);
    this.selectedRole = signal(null, ...ngDevMode ? [{ debugName: "selectedRole" }] : []);
    this.availablePermissions = signal([], ...ngDevMode ? [{ debugName: "availablePermissions" }] : []);
    this.permissionCategories = computed(() => {
      const categories = new Set(this.availablePermissions().map((p) => p.category));
      return Array.from(categories);
    }, ...ngDevMode ? [{ debugName: "permissionCategories" }] : []);
    this.tenantService = inject(TenantService);
    this.portfolioService = inject(PortfolioService);
    this.rolService = inject(RolService);
    this.permisoService = inject(PermisoService);
  }
  ngOnInit() {
    this.loadAllData();
    this.loadRolesFromBackend();
    this.loadPermissionsFromBackend();
  }
  loadAllData() {
    this.tenantService.getAllTenants().subscribe({
      next: (tenants) => {
        this.tenants.set(tenants);
        tenants.forEach((tenant) => {
          this.portfolioService.getPortfoliosByTenant(tenant.id).subscribe({
            next: (portfolios) => {
              const portfoliosWithTenant = portfolios.map((p) => __spreadProps(__spreadValues({}, p), { tenantId: tenant.id }));
              this.allPortfolios.set([...this.allPortfolios(), ...portfoliosWithTenant]);
              portfolios.forEach((portfolio) => {
                this.portfolioService.getSubPortfoliosByPortfolio(portfolio.id).subscribe({
                  next: (subPortfolios) => {
                    this.allSubPortfolios.set([...this.allSubPortfolios(), ...subPortfolios]);
                  },
                  error: (err) => console.error(`Error loading subportfolios for portfolio ${portfolio.id}:`, err)
                });
              });
            },
            error: (err) => console.error(`Error loading portfolios for tenant ${tenant.id}:`, err)
          });
        });
      },
      error: (err) => console.error("Error loading tenants:", err)
    });
  }
  loadRolesFromBackend() {
    this.rolService.obtenerTodos().subscribe({
      next: (roles) => {
        this.roles.set(roles.map((r) => ({
          id: r.idRol,
          name: r.nombreRol,
          description: r.descripcion || "",
          permissions: r.permisoIds,
          assignments: r.asignaciones.map((a) => ({
            type: a.tipoAsignacion,
            tenantId: a.tenantId,
            portfolioId: a.portfolioId,
            subPortfolioId: a.subPortfolioId
          })),
          active: r.activo
        })));
      },
      error: (err) => console.error("Error al cargar roles:", err)
    });
  }
  loadPermissionsFromBackend() {
    this.permisoService.obtenerTodos().subscribe({
      next: (permisos) => {
        this.availablePermissions.set(permisos.map((p) => ({
          id: p.idPermiso,
          code: p.codigoPermiso,
          name: p.nombrePermiso,
          description: p.descripcion || "",
          category: p.categoria
        })));
      },
      error: (err) => console.error("Error al cargar permisos:", err)
    });
  }
  getPortfoliosByTenant(tenantId) {
    return this.allPortfolios().filter((p) => p.tenantId === tenantId);
  }
  getSubPortfoliosByPortfolio(portfolioId) {
    return this.allSubPortfolios().filter((sp) => sp.portfolioId === portfolioId);
  }
  // Calcular el número real de subcarteras cubiertas por las asignaciones de un rol
  countSubPortfoliosForRole(role) {
    const subPortfolioIds = /* @__PURE__ */ new Set();
    role.assignments.forEach((assignment) => {
      if (assignment.type === "INQUILINO") {
        const portfolios = this.allPortfolios().filter((p) => p.tenantId === assignment.tenantId);
        portfolios.forEach((portfolio) => {
          const subPortfolios = this.allSubPortfolios().filter((sp) => sp.portfolioId === portfolio.id);
          subPortfolios.forEach((sp) => subPortfolioIds.add(sp.id));
        });
      } else if (assignment.type === "CARTERA" && assignment.portfolioId) {
        const subPortfolios = this.allSubPortfolios().filter((sp) => sp.portfolioId === assignment.portfolioId);
        subPortfolios.forEach((sp) => subPortfolioIds.add(sp.id));
      } else if (assignment.type === "SUBCARTERA" && assignment.subPortfolioId) {
        subPortfolioIds.add(assignment.subPortfolioId);
      }
    });
    return subPortfolioIds.size;
  }
  // Expansión de árbol
  toggleTenantExpand(tenantId) {
    const expanded = this.expandedTenants();
    if (expanded.includes(tenantId)) {
      this.expandedTenants.set(expanded.filter((id) => id !== tenantId));
    } else {
      this.expandedTenants.set([...expanded, tenantId]);
    }
  }
  isTenantExpanded(tenantId) {
    return this.expandedTenants().includes(tenantId);
  }
  togglePortfolioExpand(portfolioId) {
    const expanded = this.expandedPortfolios();
    if (expanded.includes(portfolioId)) {
      this.expandedPortfolios.set(expanded.filter((id) => id !== portfolioId));
    } else {
      this.expandedPortfolios.set([...expanded, portfolioId]);
    }
  }
  isPortfolioExpanded(portfolioId) {
    return this.expandedPortfolios().includes(portfolioId);
  }
  // Verificar asignaciones (con herencia visual)
  isTenantAssigned(tenantId) {
    const role = this.selectedRole();
    if (!role)
      return false;
    return role.assignments.some((a) => a.type === "INQUILINO" && a.tenantId === tenantId);
  }
  isPortfolioAssigned(portfolioId) {
    const role = this.selectedRole();
    if (!role)
      return false;
    const portfolio = this.allPortfolios().find((p) => p.id === portfolioId);
    if (!portfolio)
      return false;
    return role.assignments.some((a) => a.type === "INQUILINO" && a.tenantId === portfolio.tenantId || a.type === "CARTERA" && a.portfolioId === portfolioId);
  }
  isSubPortfolioAssigned(subPortfolioId) {
    const role = this.selectedRole();
    if (!role)
      return false;
    const subPortfolio = this.allSubPortfolios().find((sp) => sp.id === subPortfolioId);
    if (!subPortfolio)
      return false;
    const portfolio = this.allPortfolios().find((p) => p.id === subPortfolio.portfolioId);
    if (!portfolio)
      return false;
    return role.assignments.some((a) => a.type === "INQUILINO" && a.tenantId === portfolio.tenantId || a.type === "CARTERA" && a.portfolioId === subPortfolio.portfolioId || a.type === "SUBCARTERA" && a.subPortfolioId === subPortfolioId);
  }
  // Toggle asignaciones
  toggleTenantAssignment(tenantId) {
    const role = this.selectedRole();
    if (!role)
      return;
    if (this.isTenantAssigned(tenantId)) {
      role.assignments = role.assignments.filter((a) => a.tenantId !== tenantId);
    } else {
      role.assignments.push({ type: "INQUILINO", tenantId });
      role.assignments = role.assignments.filter((a) => !(a.tenantId === tenantId && (a.type === "CARTERA" || a.type === "SUBCARTERA")));
    }
    this.selectedRole.set(__spreadValues({}, role));
  }
  togglePortfolioAssignment(tenantId, portfolioId) {
    const role = this.selectedRole();
    if (!role)
      return;
    const isTenantAssigned = this.isTenantAssigned(tenantId);
    const isCurrentlyAssigned = this.isPortfolioAssigned(portfolioId);
    if (isCurrentlyAssigned) {
      if (isTenantAssigned) {
        role.assignments = role.assignments.filter((a) => !(a.type === "INQUILINO" && a.tenantId === tenantId));
        const portfoliosOfTenant = this.getPortfoliosByTenant(tenantId);
        portfoliosOfTenant.forEach((p) => {
          if (p.id !== portfolioId) {
            role.assignments.push({ type: "CARTERA", tenantId, portfolioId: p.id });
          }
        });
      } else {
        role.assignments = role.assignments.filter((a) => !(a.type === "CARTERA" && a.portfolioId === portfolioId));
      }
      role.assignments = role.assignments.filter((a) => !(a.type === "SUBCARTERA" && a.portfolioId === portfolioId));
    } else {
      role.assignments.push({ type: "CARTERA", tenantId, portfolioId });
      role.assignments = role.assignments.filter((a) => !(a.type === "SUBCARTERA" && a.portfolioId === portfolioId));
      const portfoliosOfTenant = this.getPortfoliosByTenant(tenantId);
      const allPortfoliosAssigned = portfoliosOfTenant.every((p) => role.assignments.some((a) => a.type === "CARTERA" && a.portfolioId === p.id));
      if (allPortfoliosAssigned && portfoliosOfTenant.length > 0) {
        role.assignments = role.assignments.filter((a) => !(a.type === "CARTERA" && a.tenantId === tenantId));
        role.assignments.push({ type: "INQUILINO", tenantId });
      }
    }
    this.selectedRole.set(__spreadValues({}, role));
  }
  toggleSubPortfolioAssignment(tenantId, portfolioId, subPortfolioId) {
    const role = this.selectedRole();
    if (!role)
      return;
    const isTenantAssigned = this.isTenantAssigned(tenantId);
    const isPortfolioAssigned = this.isPortfolioAssigned(portfolioId);
    const isCurrentlyAssigned = this.isSubPortfolioAssigned(subPortfolioId);
    if (isCurrentlyAssigned) {
      if (isTenantAssigned) {
        role.assignments = role.assignments.filter((a) => !(a.type === "INQUILINO" && a.tenantId === tenantId));
        const portfoliosOfTenant = this.getPortfoliosByTenant(tenantId);
        portfoliosOfTenant.forEach((p) => {
          if (p.id === portfolioId) {
            const subPortfoliosOfPortfolio = this.getSubPortfoliosByPortfolio(p.id);
            subPortfoliosOfPortfolio.forEach((sp) => {
              if (sp.id !== subPortfolioId) {
                role.assignments.push({ type: "SUBCARTERA", tenantId, portfolioId: p.id, subPortfolioId: sp.id });
              }
            });
          } else {
            role.assignments.push({ type: "CARTERA", tenantId, portfolioId: p.id });
          }
        });
      } else if (isPortfolioAssigned && !role.assignments.some((a) => a.type === "SUBCARTERA" && a.portfolioId === portfolioId)) {
        role.assignments = role.assignments.filter((a) => !(a.type === "CARTERA" && a.portfolioId === portfolioId));
        const subPortfoliosOfPortfolio = this.getSubPortfoliosByPortfolio(portfolioId);
        subPortfoliosOfPortfolio.forEach((sp) => {
          if (sp.id !== subPortfolioId) {
            role.assignments.push({ type: "SUBCARTERA", tenantId, portfolioId, subPortfolioId: sp.id });
          }
        });
      } else {
        role.assignments = role.assignments.filter((a) => !(a.type === "SUBCARTERA" && a.subPortfolioId === subPortfolioId));
      }
    } else {
      role.assignments.push({ type: "SUBCARTERA", tenantId, portfolioId, subPortfolioId });
      const subPortfoliosOfPortfolio = this.getSubPortfoliosByPortfolio(portfolioId);
      const allSubPortfoliosAssigned = subPortfoliosOfPortfolio.every((sp) => role.assignments.some((a) => a.type === "SUBCARTERA" && a.subPortfolioId === sp.id));
      if (allSubPortfoliosAssigned && subPortfoliosOfPortfolio.length > 0) {
        role.assignments = role.assignments.filter((a) => !(a.type === "SUBCARTERA" && a.portfolioId === portfolioId));
        role.assignments.push({ type: "CARTERA", tenantId, portfolioId });
        const portfoliosOfTenant = this.getPortfoliosByTenant(tenantId);
        const allPortfoliosAssigned = portfoliosOfTenant.every((p) => role.assignments.some((a) => a.type === "CARTERA" && a.portfolioId === p.id));
        if (allPortfoliosAssigned && portfoliosOfTenant.length > 0) {
          role.assignments = role.assignments.filter((a) => !(a.type === "CARTERA" && a.tenantId === tenantId));
          role.assignments.push({ type: "INQUILINO", tenantId });
        }
      }
    }
    this.selectedRole.set(__spreadValues({}, role));
  }
  createNewRole() {
    const newRole = {
      name: "",
      description: "",
      permissions: [],
      assignments: [],
      active: true
    };
    this.selectedRole.set(newRole);
    this.expandedTenants.set([]);
    this.expandedPortfolios.set([]);
  }
  selectRole(role) {
    this.selectedRole.set(__spreadValues({}, role));
    this.expandOnlyAssignedBranches();
  }
  isAnyExpanded() {
    return this.expandedTenants().length > 0 || this.expandedPortfolios().length > 0;
  }
  toggleExpandAll() {
    if (this.isAnyExpanded()) {
      this.expandedTenants.set([]);
      this.expandedPortfolios.set([]);
    } else {
      const tenantIds = this.tenants().map((t) => t.id);
      this.expandedTenants.set(tenantIds);
      const portfolioIds = this.allPortfolios().map((p) => p.id);
      this.expandedPortfolios.set(portfolioIds);
    }
  }
  expandOnlyAssignedBranches() {
    const role = this.selectedRole();
    if (!role || role.assignments.length === 0) {
      this.expandedTenants.set([]);
      this.expandedPortfolios.set([]);
      return;
    }
    const tenantsToExpand = [];
    const portfoliosToExpand = [];
    role.assignments.forEach((assignment) => {
      if (assignment.type === "INQUILINO" || assignment.type === "CARTERA" || assignment.type === "SUBCARTERA") {
        if (!tenantsToExpand.includes(assignment.tenantId)) {
          tenantsToExpand.push(assignment.tenantId);
        }
      }
      if ((assignment.type === "CARTERA" || assignment.type === "SUBCARTERA") && assignment.portfolioId) {
        if (!portfoliosToExpand.includes(assignment.portfolioId)) {
          portfoliosToExpand.push(assignment.portfolioId);
        }
      }
    });
    this.expandedTenants.set(tenantsToExpand);
    this.expandedPortfolios.set(portfoliosToExpand);
  }
  deleteRole(role) {
    if (!role.id)
      return;
    if (confirm(`\xBFEst\xE1s seguro de eliminar el rol "${role.name}"?`)) {
      this.rolService.eliminar(role.id).subscribe({
        next: () => {
          const currentRoles = this.roles();
          this.roles.set(currentRoles.filter((r) => r.id !== role.id));
          if (this.selectedRole()?.id === role.id) {
            this.selectedRole.set(null);
          }
          alert("Rol eliminado correctamente");
        },
        error: (err) => {
          console.error("Error al eliminar rol:", err);
          alert("Error al eliminar rol: " + (err.error?.message || err.message));
        }
      });
    }
  }
  getPermissionsByCategory(category) {
    return this.availablePermissions().filter((p) => p.category === category);
  }
  isPermissionSelected(permissionId) {
    return this.selectedRole()?.permissions.includes(permissionId) || false;
  }
  togglePermission(permissionId) {
    const role = this.selectedRole();
    if (!role)
      return;
    const index = role.permissions.indexOf(permissionId);
    if (index > -1) {
      role.permissions.splice(index, 1);
    } else {
      role.permissions.push(permissionId);
    }
    this.selectedRole.set(__spreadValues({}, role));
  }
  isRoleValid() {
    const role = this.selectedRole();
    return !!(role && role.name.trim() && role.description.trim());
  }
  saveRole() {
    const role = this.selectedRole();
    if (!role || !this.isRoleValid())
      return;
    const request = {
      nombreRol: role.name,
      descripcion: role.description,
      activo: role.active,
      permisoIds: role.permissions,
      asignaciones: role.assignments.map((a) => ({
        tipoAsignacion: a.type,
        tenantId: a.tenantId,
        portfolioId: a.portfolioId,
        subPortfolioId: a.subPortfolioId
      }))
    };
    if (role.id) {
      this.rolService.actualizar(role.id, request).subscribe({
        next: (response) => {
          const currentRoles = this.roles();
          const index = currentRoles.findIndex((r) => r.id === role.id);
          if (index > -1) {
            currentRoles[index] = {
              id: response.idRol,
              name: response.nombreRol,
              description: response.descripcion || "",
              permissions: response.permisoIds,
              assignments: response.asignaciones.map((a) => ({
                type: a.tipoAsignacion,
                tenantId: a.tenantId,
                portfolioId: a.portfolioId,
                subPortfolioId: a.subPortfolioId
              })),
              active: response.activo
            };
            this.roles.set([...currentRoles]);
          }
          this.selectedRole.set(null);
          alert("Rol actualizado correctamente");
        },
        error: (err) => {
          console.error("Error al actualizar rol:", err);
          alert("Error al actualizar rol: " + (err.error?.message || err.message));
        }
      });
    } else {
      this.rolService.crear(request).subscribe({
        next: (response) => {
          const newRole = {
            id: response.idRol,
            name: response.nombreRol,
            description: response.descripcion || "",
            permissions: response.permisoIds,
            assignments: response.asignaciones.map((a) => ({
              type: a.tipoAsignacion,
              tenantId: a.tenantId,
              portfolioId: a.portfolioId,
              subPortfolioId: a.subPortfolioId
            })),
            active: response.activo
          };
          this.roles.set([...this.roles(), newRole]);
          this.selectedRole.set(null);
          alert("Rol creado correctamente");
        },
        error: (err) => {
          console.error("Error al crear rol:", err);
          alert("Error al crear rol: " + (err.error?.message || err.message));
        }
      });
    }
  }
  cancelEdit() {
    this.selectedRole.set(null);
  }
};
_RolesManagementComponent.\u0275fac = function RolesManagementComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _RolesManagementComponent)();
};
_RolesManagementComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _RolesManagementComponent, selectors: [["app-roles-management"]], decls: 50, vars: 13, consts: [[1, "h-[calc(100dvh-56px)]", "bg-slate-950", "overflow-hidden", "flex", "flex-col"], [1, "flex-1", "overflow-y-auto"], [1, "p-3", "max-w-[1800px]", "mx-auto"], [1, "mb-3"], [1, "flex", "items-center", "gap-2"], [1, "w-8", "h-8", "bg-gradient-to-br", "from-purple-600", "to-purple-700", "rounded-lg", "flex", "items-center", "justify-center"], ["name", "shield-check", 1, "text-white", 3, "size"], [1, "text-lg", "font-bold", "text-white"], [1, "text-xs", "text-gray-400"], [1, "grid", "grid-cols-12", "gap-3"], [1, "col-span-3", "bg-slate-900", "rounded-lg", "border", "border-slate-800", "shadow-sm", "flex", "flex-col", "max-h-[calc(100vh-140px)]"], [1, "p-3", "border-b", "border-slate-800", "flex", "items-center", "justify-between", "flex-shrink-0"], ["name", "list", 1, "text-purple-400", 3, "size"], [1, "text-sm", "font-bold", "text-white"], [1, "px-2", "py-1", "bg-purple-600", "hover:bg-purple-700", "text-white", "rounded", "text-xs", "font-semibold", "transition-colors", "flex", "items-center", "gap-1", 3, "click"], ["name", "plus", 3, "size"], [1, "p-2", "space-y-1", "overflow-y-auto", "flex-1"], [1, "text-center", "py-8"], [1, "col-span-4", "bg-slate-900", "rounded-lg", "border", "border-slate-800", "shadow-sm", "flex", "flex-col", "max-h-[calc(100vh-140px)]"], [1, "p-3", "border-b", "border-slate-800", "flex-shrink-0"], [1, "flex", "items-center", "justify-between"], ["name", "map-pin", 1, "text-green-400", 3, "size"], [1, "p-1", "text-xs", "text-gray-400", "hover:text-white", "hover:bg-slate-700", "rounded", "transition-colors", 3, "title"], [1, "p-3", "overflow-y-auto", "flex-1"], [1, "space-y-1"], [1, "text-center", "py-12"], [1, "col-span-5", "bg-slate-900", "rounded-lg", "border", "border-slate-800", "shadow-sm", "flex", "flex-col", "max-h-[calc(100vh-140px)]"], ["name", "edit", 1, "text-purple-400", 3, "size"], [1, "p-3", "space-y-3", "overflow-y-auto", "flex-1"], [1, "mt-3", "flex", "justify-end", "gap-2"], ["name", "shield-off", 1, "text-gray-600", "mx-auto", "mb-2", 3, "size"], [1, "text-xs", "text-gray-500"], [1, "p-2", "rounded", "border", "cursor-pointer", "transition-all", 3, "class"], [1, "p-2", "rounded", "border", "cursor-pointer", "transition-all", 3, "click"], [1, "flex", "items-start", "justify-between"], [1, "flex-1", "min-w-0"], [1, "flex", "items-center", "gap-1"], ["name", "shield-check", 1, "text-purple-400", "flex-shrink-0", 3, "size"], [1, "text-xs", "font-semibold", "text-white", "truncate"], [1, "mt-0.5", "flex", "items-center", "gap-1", "text-xs", "text-gray-500"], [1, "p-0.5", "text-gray-400", "hover:text-red-400", "rounded", "transition-colors", "flex-shrink-0", 3, "click"], ["name", "trash-2", 3, "size"], [1, "p-1", "text-xs", "text-gray-400", "hover:text-white", "hover:bg-slate-700", "rounded", "transition-colors", 3, "click", "title"], [3, "name", "size"], [1, "border", "border-slate-700", "rounded", "overflow-hidden"], [1, "bg-slate-800", "p-2"], [1, "flex", "items-center", "gap-2", "cursor-pointer", "group"], ["type", "checkbox", 1, "w-3.5", "h-3.5", "text-blue-600", "bg-slate-700", "border-slate-600", "rounded", "focus:ring-blue-500", 3, "change", "checked"], ["name", "building-2", 1, "text-blue-400", 3, "size"], [1, "text-xs", "font-semibold", "text-white", "group-hover:text-purple-300", "flex-1"], [1, "p-0.5", "hover:bg-slate-700", "rounded"], [1, "bg-slate-800/50", "pl-4"], [1, "p-0.5", "hover:bg-slate-700", "rounded", 3, "click"], [1, "text-gray-400", 3, "name", "size"], [1, "p-2", "text-xs", "text-gray-500", "italic"], [1, "border-t", "border-slate-700/50"], [1, "p-1.5"], [1, "flex", "items-center", "gap-1.5", "cursor-pointer", "group"], ["type", "checkbox", 1, "w-3", "h-3", "text-green-600", "bg-slate-700", "border-slate-600", "rounded", "focus:ring-green-500", 3, "change", "checked"], ["name", "folder", 1, "text-green-400", 3, "size"], [1, "text-xs", "font-medium", "text-gray-300", "group-hover:text-purple-300", "flex-1"], [1, "pl-3", "pb-1"], [1, "p-1", "text-xs", "text-gray-500", "italic"], [1, "p-1"], ["type", "checkbox", 1, "w-3", "h-3", "text-purple-600", "bg-slate-700", "border-slate-600", "rounded", "focus:ring-purple-500", 3, "change", "checked"], ["name", "folder-tree", 1, "text-purple-400", 3, "size"], [1, "text-xs", "text-gray-400", "group-hover:text-purple-300"], ["name", "map", 1, "text-gray-600", "mx-auto", "mb-2", 3, "size"], [1, "space-y-2"], [1, "block", "text-xs", "font-semibold", "text-gray-300", "mb-1"], ["type", "text", "placeholder", "Ej: Asesor de Cobranza", 1, "w-full", "px-2", "py-1.5", "bg-slate-800", "border", "border-slate-700", "rounded", "text-white", "text-sm", "placeholder:text-gray-500", "focus:outline-none", "focus:ring-1", "focus:ring-purple-500", 3, "ngModelChange", "ngModel"], ["rows", "2", "placeholder", "Describe las responsabilidades...", 1, "w-full", "px-2", "py-1.5", "bg-slate-800", "border", "border-slate-700", "rounded", "text-white", "text-sm", "placeholder:text-gray-500", "focus:outline-none", "focus:ring-1", "focus:ring-purple-500", "resize-none", 3, "ngModelChange", "ngModel"], ["type", "checkbox", "id", "roleActive", 1, "w-3.5", "h-3.5", "text-purple-600", "bg-slate-800", "border-slate-700", "rounded", "focus:ring-purple-500", 3, "ngModelChange", "ngModel"], ["for", "roleActive", 1, "text-xs", "text-gray-300", "cursor-pointer"], [1, "flex", "items-center", "justify-between", "mb-2"], [1, "text-xs", "font-semibold", "text-purple-300"], [1, "space-y-1.5"], [1, "bg-slate-800", "rounded", "border", "border-slate-700", "p-2"], [1, "flex", "items-center", "gap-1.5", "mb-1.5"], ["name", "package", 1, "text-purple-400", 3, "size"], [1, "text-xs", "font-semibold", "text-white"], [1, "space-y-0.5", "ml-4"], [1, "flex", "items-start", "gap-1.5", "p-1", "hover:bg-slate-700/50", "rounded", "cursor-pointer", "group"], ["type", "checkbox", 1, "mt-0.5", "w-3.5", "h-3.5", "text-purple-600", "bg-slate-700", "border-slate-600", "rounded", "focus:ring-purple-500", 3, "change", "checked"], [1, "text-xs", "font-medium", "text-gray-300", "group-hover:text-white", "truncate"], [1, "text-xs", "text-gray-500", "leading-tight"], ["name", "hand-metal", 1, "text-gray-600", "mx-auto", "mb-2", 3, "size"], [1, "text-sm", "text-gray-400"], [1, "px-4", "py-2", "bg-slate-700", "hover:bg-slate-600", "text-white", "rounded", "text-sm", "font-semibold", "transition-colors", 3, "click"], [1, "px-4", "py-2", "bg-purple-600", "hover:bg-purple-700", "disabled:bg-slate-700", "disabled:cursor-not-allowed", "text-white", "rounded", "text-sm", "font-semibold", "transition-colors", "flex", "items-center", "gap-1.5", 3, "click", "disabled"], ["name", "save", 3, "size"]], template: function RolesManagementComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "div", 4)(5, "div", 5);
    \u0275\u0275element(6, "lucide-angular", 6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "div")(8, "h1", 7);
    \u0275\u0275text(9, "Gesti\xF3n de Roles");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "p", 8);
    \u0275\u0275text(11, "Define roles, permisos y asignaciones m\xFAltiples");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(12, "div", 9)(13, "div", 10)(14, "div", 11)(15, "div", 4);
    \u0275\u0275element(16, "lucide-angular", 12);
    \u0275\u0275elementStart(17, "h2", 13);
    \u0275\u0275text(18, "Roles");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "span", 8);
    \u0275\u0275text(20);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(21, "button", 14);
    \u0275\u0275listener("click", function RolesManagementComponent_Template_button_click_21_listener() {
      return ctx.createNewRole();
    });
    \u0275\u0275element(22, "lucide-angular", 15);
    \u0275\u0275text(23, " Nuevo ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(24, "div", 16);
    \u0275\u0275conditionalCreate(25, RolesManagementComponent_Conditional_25_Template, 6, 1, "div", 17)(26, RolesManagementComponent_Conditional_26_Template, 2, 0);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(27, "div", 18)(28, "div", 19)(29, "div", 20)(30, "div", 4);
    \u0275\u0275element(31, "lucide-angular", 21);
    \u0275\u0275elementStart(32, "h2", 13);
    \u0275\u0275text(33, "Asignaciones");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(34, "span", 8);
    \u0275\u0275text(35);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(36, RolesManagementComponent_Conditional_36_Template, 2, 3, "button", 22);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(37, "div", 23);
    \u0275\u0275conditionalCreate(38, RolesManagementComponent_Conditional_38_Template, 3, 0, "div", 24)(39, RolesManagementComponent_Conditional_39_Template, 4, 1, "div", 25);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(40, "div", 26)(41, "div", 19)(42, "div", 4);
    \u0275\u0275element(43, "lucide-angular", 27);
    \u0275\u0275elementStart(44, "h2", 13);
    \u0275\u0275text(45);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(46, "div", 28);
    \u0275\u0275conditionalCreate(47, RolesManagementComponent_Conditional_47_Template, 22, 4)(48, RolesManagementComponent_Conditional_48_Template, 4, 1, "div", 25);
    \u0275\u0275elementEnd()()();
    \u0275\u0275conditionalCreate(49, RolesManagementComponent_Conditional_49_Template, 6, 2, "div", 29);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    let tmp_10_0;
    \u0275\u0275advance(6);
    \u0275\u0275property("size", 16);
    \u0275\u0275advance(10);
    \u0275\u0275property("size", 16);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("(", ctx.roles().length, ")");
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 12);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx.roles().length === 0 ? 25 : 26);
    \u0275\u0275advance(6);
    \u0275\u0275property("size", 16);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("(", ctx.selectedRole() ? ctx.selectedRole().assignments.length : 0, ")");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx.selectedRole() ? 36 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx.selectedRole() ? 38 : 39);
    \u0275\u0275advance(5);
    \u0275\u0275property("size", 16);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ((tmp_10_0 = ctx.selectedRole()) == null ? null : tmp_10_0.id) ? "Editar Rol" : ctx.selectedRole() ? "Nuevo Rol" : "Informaci\xF3n", " ");
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx.selectedRole() ? 47 : 48);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx.selectedRole() ? 49 : -1);
  }
}, dependencies: [CommonModule, FormsModule, DefaultValueAccessor, CheckboxControlValueAccessor, NgControlStatus, NgModel, LucideAngularModule, LucideAngularComponent], encapsulation: 2 });
var RolesManagementComponent = _RolesManagementComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RolesManagementComponent, [{
    type: Component,
    args: [{
      selector: "app-roles-management",
      standalone: true,
      imports: [CommonModule, FormsModule, LucideAngularModule],
      template: `
    <div class="h-[calc(100dvh-56px)] bg-slate-950 overflow-hidden flex flex-col">
      <div class="flex-1 overflow-y-auto">
        <div class="p-3 max-w-[1800px] mx-auto">
          <!-- Header -->
          <div class="mb-3">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
                <lucide-angular name="shield-check" [size]="16" class="text-white"></lucide-angular>
              </div>
              <div>
                <h1 class="text-lg font-bold text-white">Gesti\xF3n de Roles</h1>
                <p class="text-xs text-gray-400">Define roles, permisos y asignaciones m\xFAltiples</p>
              </div>
            </div>
          </div>

          <!-- Grid de 3 Columnas -->
          <div class="grid grid-cols-12 gap-3">
            <!-- Columna 1: Lista de Roles (25%) -->
            <div class="col-span-3 bg-slate-900 rounded-lg border border-slate-800 shadow-sm flex flex-col max-h-[calc(100vh-140px)]">
              <div class="p-3 border-b border-slate-800 flex items-center justify-between flex-shrink-0">
                <div class="flex items-center gap-2">
                  <lucide-angular name="list" [size]="16" class="text-purple-400"></lucide-angular>
                  <h2 class="text-sm font-bold text-white">Roles</h2>
                  <span class="text-xs text-gray-400">({{ roles().length }})</span>
                </div>
                <button (click)="createNewRole()"
                        class="px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs font-semibold transition-colors flex items-center gap-1">
                  <lucide-angular name="plus" [size]="12"></lucide-angular>
                  Nuevo
                </button>
              </div>

              <div class="p-2 space-y-1 overflow-y-auto flex-1">
                @if (roles().length === 0) {
                  <div class="text-center py-8">
                    <lucide-angular name="shield-off" [size]="28" class="text-gray-600 mx-auto mb-2"></lucide-angular>
                    <p class="text-xs text-gray-400">Sin roles</p>
                    <p class="text-xs text-gray-500">Crea uno nuevo</p>
                  </div>
                } @else {
                  @for (role of roles(); track role.id) {
                    <div (click)="selectRole(role)"
                         [class]="selectedRole()?.id === role.id ? 'bg-purple-900/40 border-purple-500' : 'bg-slate-800 border-slate-700 hover:border-purple-500/50'"
                         class="p-2 rounded border cursor-pointer transition-all">
                      <div class="flex items-start justify-between">
                        <div class="flex-1 min-w-0">
                          <div class="flex items-center gap-1">
                            <lucide-angular name="shield-check" [size]="12" class="text-purple-400 flex-shrink-0"></lucide-angular>
                            <h3 class="text-xs font-semibold text-white truncate">{{ role.name }}</h3>
                          </div>
                          <div class="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
                            <span>{{ role.permissions.length }} permisos</span>
                            <span>\u2022</span>
                            <span>{{ countSubPortfoliosForRole(role) }} subcarteras</span>
                          </div>
                        </div>
                        <button (click)="deleteRole(role); $event.stopPropagation()"
                                class="p-0.5 text-gray-400 hover:text-red-400 rounded transition-colors flex-shrink-0">
                          <lucide-angular name="trash-2" [size]="12"></lucide-angular>
                        </button>
                      </div>
                    </div>
                  }
                }
              </div>
            </div>

            <!-- Columna 2: Asignaciones (35%) -->
            <div class="col-span-4 bg-slate-900 rounded-lg border border-slate-800 shadow-sm flex flex-col max-h-[calc(100vh-140px)]">
              <div class="p-3 border-b border-slate-800 flex-shrink-0">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <lucide-angular name="map-pin" [size]="16" class="text-green-400"></lucide-angular>
                    <h2 class="text-sm font-bold text-white">Asignaciones</h2>
                    <span class="text-xs text-gray-400">({{ selectedRole() ? selectedRole()!.assignments.length : 0 }})</span>
                  </div>
                  @if (selectedRole()) {
                    <button (click)="toggleExpandAll()"
                            [title]="isAnyExpanded() ? 'Colapsar todo' : 'Expandir todo'"
                            class="p-1 text-xs text-gray-400 hover:text-white hover:bg-slate-700 rounded transition-colors">
                      <lucide-angular [name]="isAnyExpanded() ? 'chevron-up' : 'chevron-down'" [size]="12"></lucide-angular>
                    </button>
                  }
                </div>
              </div>

              <div class="p-3 overflow-y-auto flex-1">
                @if (selectedRole()) {
                  <div class="space-y-1">
                    @for (tenant of tenants(); track tenant.id) {
                      <div class="border border-slate-700 rounded overflow-hidden">
                        <!-- Tenant Level -->
                        <div class="bg-slate-800 p-2">
                          <label class="flex items-center gap-2 cursor-pointer group">
                            <input type="checkbox"
                                   [checked]="isTenantAssigned(tenant.id)"
                                   (change)="toggleTenantAssignment(tenant.id)"
                                   class="w-3.5 h-3.5 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500">
                            <lucide-angular name="building-2" [size]="12" class="text-blue-400"></lucide-angular>
                            <span class="text-xs font-semibold text-white group-hover:text-purple-300 flex-1">
                              {{ tenant.tenantName }}
                            </span>
                            @if (getPortfoliosByTenant(tenant.id).length > 0) {
                              <button (click)="toggleTenantExpand(tenant.id); $event.stopPropagation()"
                                      class="p-0.5 hover:bg-slate-700 rounded">
                                <lucide-angular [name]="isTenantExpanded(tenant.id) ? 'chevron-down' : 'chevron-right'"
                                                [size]="12"
                                                class="text-gray-400"></lucide-angular>
                              </button>
                            }
                          </label>
                        </div>

                        <!-- Portfolios (if expanded) -->
                        @if (isTenantExpanded(tenant.id)) {
                          <div class="bg-slate-800/50 pl-4">
                            @if (getPortfoliosByTenant(tenant.id).length === 0) {
                              <div class="p-2 text-xs text-gray-500 italic">
                                Sin carteras
                              </div>
                            }
                            @for (portfolio of getPortfoliosByTenant(tenant.id); track portfolio.id) {
                              <div class="border-t border-slate-700/50">
                                <!-- Portfolio Level -->
                                <div class="p-1.5">
                                  <label class="flex items-center gap-1.5 cursor-pointer group">
                                    <input type="checkbox"
                                           [checked]="isPortfolioAssigned(portfolio.id)"
                                           (change)="togglePortfolioAssignment(tenant.id, portfolio.id)"
                                           class="w-3 h-3 text-green-600 bg-slate-700 border-slate-600 rounded focus:ring-green-500">
                                    <lucide-angular name="folder" [size]="11" class="text-green-400"></lucide-angular>
                                    <span class="text-xs font-medium text-gray-300 group-hover:text-purple-300 flex-1">
                                      {{ portfolio.portfolioName }}
                                    </span>
                                    @if (getSubPortfoliosByPortfolio(portfolio.id).length > 0) {
                                      <button (click)="togglePortfolioExpand(portfolio.id); $event.stopPropagation()"
                                              class="p-0.5 hover:bg-slate-700 rounded">
                                        <lucide-angular [name]="isPortfolioExpanded(portfolio.id) ? 'chevron-down' : 'chevron-right'"
                                                        [size]="11"
                                                        class="text-gray-400"></lucide-angular>
                                      </button>
                                    }
                                  </label>
                                </div>

                                <!-- SubPortfolios (if expanded) -->
                                @if (isPortfolioExpanded(portfolio.id)) {
                                  <div class="pl-3 pb-1">
                                    @if (getSubPortfoliosByPortfolio(portfolio.id).length === 0) {
                                      <div class="p-1 text-xs text-gray-500 italic">
                                        Sin subcarteras
                                      </div>
                                    }
                                    @for (subPortfolio of getSubPortfoliosByPortfolio(portfolio.id); track subPortfolio.id) {
                                      <div class="p-1">
                                        <label class="flex items-center gap-1.5 cursor-pointer group">
                                          <input type="checkbox"
                                                 [checked]="isSubPortfolioAssigned(subPortfolio.id)"
                                                 (change)="toggleSubPortfolioAssignment(tenant.id, portfolio.id, subPortfolio.id)"
                                                 class="w-3 h-3 text-purple-600 bg-slate-700 border-slate-600 rounded focus:ring-purple-500">
                                          <lucide-angular name="folder-tree" [size]="10" class="text-purple-400"></lucide-angular>
                                          <span class="text-xs text-gray-400 group-hover:text-purple-300">
                                            {{ subPortfolio.subPortfolioName }}
                                          </span>
                                        </label>
                                      </div>
                                    }
                                  </div>
                                }
                              </div>
                            }
                          </div>
                        }
                      </div>
                    }
                  </div>
                } @else {
                  <div class="text-center py-12">
                    <lucide-angular name="map" [size]="32" class="text-gray-600 mx-auto mb-2"></lucide-angular>
                    <p class="text-xs text-gray-400">Selecciona un rol para asignar</p>
                  </div>
                }
              </div>
            </div>

            <!-- Columna 3: Editor de Rol + Permisos (40%) -->
            <div class="col-span-5 bg-slate-900 rounded-lg border border-slate-800 shadow-sm flex flex-col max-h-[calc(100vh-140px)]">
              <div class="p-3 border-b border-slate-800 flex-shrink-0">
                <div class="flex items-center gap-2">
                  <lucide-angular name="edit" [size]="16" class="text-purple-400"></lucide-angular>
                  <h2 class="text-sm font-bold text-white">
                    {{ selectedRole()?.id ? 'Editar Rol' : selectedRole() ? 'Nuevo Rol' : 'Informaci\xF3n' }}
                  </h2>
                </div>
              </div>

              <div class="p-3 space-y-3 overflow-y-auto flex-1">
                @if (selectedRole()) {
                  <!-- Informaci\xF3n B\xE1sica -->
                  <div class="space-y-2">
                    <div>
                      <label class="block text-xs font-semibold text-gray-300 mb-1">Nombre del Rol</label>
                      <input type="text"
                             [(ngModel)]="selectedRole()!.name"
                             placeholder="Ej: Asesor de Cobranza"
                             class="w-full px-2 py-1.5 bg-slate-800 border border-slate-700 rounded text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500">
                    </div>

                    <div>
                      <label class="block text-xs font-semibold text-gray-300 mb-1">Descripci\xF3n</label>
                      <textarea [(ngModel)]="selectedRole()!.description"
                                rows="2"
                                placeholder="Describe las responsabilidades..."
                                class="w-full px-2 py-1.5 bg-slate-800 border border-slate-700 rounded text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 resize-none"></textarea>
                    </div>

                    <div class="flex items-center gap-2">
                      <input type="checkbox"
                             [(ngModel)]="selectedRole()!.active"
                             id="roleActive"
                             class="w-3.5 h-3.5 text-purple-600 bg-slate-800 border-slate-700 rounded focus:ring-purple-500">
                      <label for="roleActive" class="text-xs text-gray-300 cursor-pointer">Rol activo</label>
                    </div>
                  </div>

                  <!-- Permisos -->
                  <div>
                    <div class="flex items-center justify-between mb-2">
                      <label class="text-xs font-semibold text-purple-300">Permisos</label>
                      <span class="text-xs text-gray-400">{{ selectedRole()!.permissions.length }} seleccionados</span>
                    </div>

                    <div class="space-y-1.5">
                      @for (category of permissionCategories(); track category) {
                        <div class="bg-slate-800 rounded border border-slate-700 p-2">
                          <div class="flex items-center gap-1.5 mb-1.5">
                            <lucide-angular name="package" [size]="12" class="text-purple-400"></lucide-angular>
                            <h4 class="text-xs font-semibold text-white">{{ category }}</h4>
                          </div>
                          <div class="space-y-0.5 ml-4">
                            @for (permission of getPermissionsByCategory(category); track permission.id) {
                              <label class="flex items-start gap-1.5 p-1 hover:bg-slate-700/50 rounded cursor-pointer group">
                                <input type="checkbox"
                                       [checked]="isPermissionSelected(permission.id)"
                                       (change)="togglePermission(permission.id)"
                                       class="mt-0.5 w-3.5 h-3.5 text-purple-600 bg-slate-700 border-slate-600 rounded focus:ring-purple-500">
                                <div class="flex-1 min-w-0">
                                  <div class="text-xs font-medium text-gray-300 group-hover:text-white truncate">
                                    {{ permission.name }}
                                  </div>
                                  <div class="text-xs text-gray-500 leading-tight">
                                    {{ permission.description }}
                                  </div>
                                </div>
                              </label>
                            }
                          </div>
                        </div>
                      }
                    </div>
                  </div>
                } @else {
                  <div class="text-center py-12">
                    <lucide-angular name="hand-metal" [size]="32" class="text-gray-600 mx-auto mb-2"></lucide-angular>
                    <p class="text-sm text-gray-400">Selecciona o crea un rol</p>
                  </div>
                }
              </div>
            </div>
          </div>

          <!-- Botones de Acci\xF3n -->
          @if (selectedRole()) {
            <div class="mt-3 flex justify-end gap-2">
              <button (click)="cancelEdit()"
                      class="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded text-sm font-semibold transition-colors">
                Cancelar
              </button>
              <button (click)="saveRole()"
                      [disabled]="!isRoleValid()"
                      class="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded text-sm font-semibold transition-colors flex items-center gap-1.5">
                <lucide-angular name="save" [size]="16"></lucide-angular>
                Guardar
              </button>
            </div>
          }
        </div>
      </div>
    </div>
  `
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(RolesManagementComponent, { className: "RolesManagementComponent", filePath: "src/app/maintenance/components/roles-management/roles-management.component.ts", lineNumber: 335 });
})();
export {
  RolesManagementComponent
};
//# sourceMappingURL=chunk-3PTQLZVQ.js.map
