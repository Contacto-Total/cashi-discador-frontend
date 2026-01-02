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
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-CTRHJBBW.js";

// src/app/maintenance/services/usuario.service.ts
var _UsuarioService = class _UsuarioService {
  constructor() {
    this.http = inject(HttpClient);
    this.apiUrl = `${environment.apiUrl}/usuarios`;
  }
  obtenerTodos() {
    return this.http.get(this.apiUrl);
  }
  obtenerPorId(id) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
  crear(request) {
    return this.http.post(this.apiUrl, request);
  }
  actualizar(id, request) {
    return this.http.put(`${this.apiUrl}/${id}`, request);
  }
  eliminar(id) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
};
_UsuarioService.\u0275fac = function UsuarioService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _UsuarioService)();
};
_UsuarioService.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _UsuarioService, factory: _UsuarioService.\u0275fac, providedIn: "root" });
var UsuarioService = _UsuarioService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(UsuarioService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/maintenance/components/user-management/user-management.component.ts
var _forTrack0 = ($index, $item) => $item.id;
function UserManagementComponent_Conditional_32_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 44);
    \u0275\u0275listener("click", function UserManagementComponent_Conditional_32_Conditional_4_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.clearFilter());
    });
    \u0275\u0275text(1, " Limpiar ");
    \u0275\u0275elementEnd();
  }
}
function UserManagementComponent_Conditional_32_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 42)(1, "p", 45);
    \u0275\u0275text(2, "\xBFQu\xE9 desea filtrar?");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 46)(4, "button", 47);
    \u0275\u0275listener("click", function UserManagementComponent_Conditional_32_Conditional_5_Template_button_click_4_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.setFilterType("INQUILINO"));
    });
    \u0275\u0275element(5, "lucide-angular", 48);
    \u0275\u0275elementStart(6, "span");
    \u0275\u0275text(7, "Proveedor");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "button", 49);
    \u0275\u0275listener("click", function UserManagementComponent_Conditional_32_Conditional_5_Template_button_click_8_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.setFilterType("CARTERA"));
    });
    \u0275\u0275element(9, "lucide-angular", 50);
    \u0275\u0275elementStart(10, "span");
    \u0275\u0275text(11, "Cartera");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "button", 51);
    \u0275\u0275listener("click", function UserManagementComponent_Conditional_32_Conditional_5_Template_button_click_12_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.setFilterType("SUBCARTERA"));
    });
    \u0275\u0275element(13, "lucide-angular", 52);
    \u0275\u0275elementStart(14, "span");
    \u0275\u0275text(15, "Subcartera");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    \u0275\u0275advance(5);
    \u0275\u0275property("size", 14);
    \u0275\u0275advance(4);
    \u0275\u0275property("size", 14);
    \u0275\u0275advance(4);
    \u0275\u0275property("size", 14);
  }
}
function UserManagementComponent_Conditional_32_Conditional_6_Conditional_6_For_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 57);
    \u0275\u0275listener("click", function UserManagementComponent_Conditional_32_Conditional_6_Conditional_6_For_1_Template_button_click_0_listener() {
      const tenant_r6 = \u0275\u0275restoreView(_r5).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.setFilter("INQUILINO", tenant_r6.id, tenant_r6.tenantName));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const tenant_r6 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275classMap(ctx_r1.isFilterActive("INQUILINO", tenant_r6.id) ? "bg-blue-900/40 border-blue-500" : "bg-slate-700/50 border-slate-600 hover:border-blue-500/50");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", tenant_r6.tenantName, " ");
  }
}
function UserManagementComponent_Conditional_32_Conditional_6_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275repeaterCreate(0, UserManagementComponent_Conditional_32_Conditional_6_Conditional_6_For_1_Template, 2, 3, "button", 56, _forTrack0);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275repeater(ctx_r1.tenants());
  }
}
function UserManagementComponent_Conditional_32_Conditional_6_Conditional_7_For_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 57);
    \u0275\u0275listener("click", function UserManagementComponent_Conditional_32_Conditional_6_Conditional_7_For_1_Template_button_click_0_listener() {
      const portfolio_r8 = \u0275\u0275restoreView(_r7).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.setFilter("CARTERA", portfolio_r8.id, ctx_r1.getPortfolioDisplayName(portfolio_r8.id)));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const portfolio_r8 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275classMap(ctx_r1.isFilterActive("CARTERA", portfolio_r8.id) ? "bg-blue-900/40 border-blue-500" : "bg-slate-700/50 border-slate-600 hover:border-blue-500/50");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.getPortfolioDisplayName(portfolio_r8.id), " ");
  }
}
function UserManagementComponent_Conditional_32_Conditional_6_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275repeaterCreate(0, UserManagementComponent_Conditional_32_Conditional_6_Conditional_7_For_1_Template, 2, 3, "button", 56, _forTrack0);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275repeater(ctx_r1.allPortfolios());
  }
}
function UserManagementComponent_Conditional_32_Conditional_6_Conditional_8_For_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 57);
    \u0275\u0275listener("click", function UserManagementComponent_Conditional_32_Conditional_6_Conditional_8_For_1_Template_button_click_0_listener() {
      const subPortfolio_r10 = \u0275\u0275restoreView(_r9).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.setFilter("SUBCARTERA", subPortfolio_r10.id, ctx_r1.getSubPortfolioDisplayName(subPortfolio_r10.id)));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const subPortfolio_r10 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275classMap(ctx_r1.isFilterActive("SUBCARTERA", subPortfolio_r10.id) ? "bg-blue-900/40 border-blue-500" : "bg-slate-700/50 border-slate-600 hover:border-blue-500/50");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.getSubPortfolioDisplayName(subPortfolio_r10.id), " ");
  }
}
function UserManagementComponent_Conditional_32_Conditional_6_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275repeaterCreate(0, UserManagementComponent_Conditional_32_Conditional_6_Conditional_8_For_1_Template, 2, 3, "button", 56, _forTrack0);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275repeater(ctx_r1.allSubPortfolios());
  }
}
function UserManagementComponent_Conditional_32_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 43)(1, "div", 53)(2, "button", 54);
    \u0275\u0275listener("click", function UserManagementComponent_Conditional_32_Conditional_6_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.filterType.set(null));
    });
    \u0275\u0275element(3, "lucide-angular", 55);
    \u0275\u0275elementStart(4, "span");
    \u0275\u0275text(5, "Volver");
    \u0275\u0275elementEnd()()();
    \u0275\u0275conditionalCreate(6, UserManagementComponent_Conditional_32_Conditional_6_Conditional_6_Template, 2, 0)(7, UserManagementComponent_Conditional_32_Conditional_6_Conditional_7_Template, 2, 0)(8, UserManagementComponent_Conditional_32_Conditional_6_Conditional_8_Template, 2, 0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275property("size", 12);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r1.filterType() === "INQUILINO" ? 6 : ctx_r1.filterType() === "CARTERA" ? 7 : ctx_r1.filterType() === "SUBCARTERA" ? 8 : -1);
  }
}
function UserManagementComponent_Conditional_32_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 24)(1, "div", 39)(2, "span", 40);
    \u0275\u0275text(3, "Filtrar por asignaci\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(4, UserManagementComponent_Conditional_32_Conditional_4_Template, 2, 0, "button", 41);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(5, UserManagementComponent_Conditional_32_Conditional_5_Template, 16, 3, "div", 42)(6, UserManagementComponent_Conditional_32_Conditional_6_Template, 9, 2, "div", 43);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275conditional(ctx_r1.activeFilter() ? 4 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r1.filterType() ? 5 : 6);
  }
}
function UserManagementComponent_Conditional_33_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "lucide-angular", 48);
  }
  if (rf & 2) {
    \u0275\u0275property("size", 10);
  }
}
function UserManagementComponent_Conditional_33_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "lucide-angular", 50);
  }
  if (rf & 2) {
    \u0275\u0275property("size", 10);
  }
}
function UserManagementComponent_Conditional_33_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "lucide-angular", 52);
  }
  if (rf & 2) {
    \u0275\u0275property("size", 10);
  }
}
function UserManagementComponent_Conditional_33_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 25)(1, "div", 58);
    \u0275\u0275conditionalCreate(2, UserManagementComponent_Conditional_33_Conditional_2_Template, 1, 1, "lucide-angular", 48)(3, UserManagementComponent_Conditional_33_Conditional_3_Template, 1, 1, "lucide-angular", 50)(4, UserManagementComponent_Conditional_33_Conditional_4_Template, 1, 1, "lucide-angular", 52);
    \u0275\u0275elementStart(5, "span");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "button", 59);
    \u0275\u0275listener("click", function UserManagementComponent_Conditional_33_Template_button_click_7_listener() {
      \u0275\u0275restoreView(_r11);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.clearFilter());
    });
    \u0275\u0275element(8, "lucide-angular", 60);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.activeFilter().type === "INQUILINO" ? 2 : ctx_r1.activeFilter().type === "CARTERA" ? 3 : 4);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.activeFilter().name);
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 10);
  }
}
function UserManagementComponent_Conditional_35_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 27);
    \u0275\u0275element(1, "lucide-angular", 61);
    \u0275\u0275elementStart(2, "p", 8);
    \u0275\u0275text(3, "Sin resultados");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p", 62);
    \u0275\u0275text(5, "Intenta otra b\xFAsqueda");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 28);
  }
}
function UserManagementComponent_Conditional_36_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 27);
    \u0275\u0275element(1, "lucide-angular", 63);
    \u0275\u0275elementStart(2, "p", 8);
    \u0275\u0275text(3, "Sin usuarios");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p", 62);
    \u0275\u0275text(5, "Crea uno nuevo");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 28);
  }
}
function UserManagementComponent_Conditional_37_For_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 65);
    \u0275\u0275listener("click", function UserManagementComponent_Conditional_37_For_1_Template_div_click_0_listener() {
      const user_r13 = \u0275\u0275restoreView(_r12).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.selectUser(user_r13));
    });
    \u0275\u0275elementStart(1, "div", 66)(2, "div", 67)(3, "div", 68);
    \u0275\u0275element(4, "lucide-angular", 69);
    \u0275\u0275elementStart(5, "h3", 70);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 71);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "div", 72)(10, "span", 73);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "span", 74);
    \u0275\u0275text(13, "\u2022");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "span", 62);
    \u0275\u0275text(15);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(16, "button", 75);
    \u0275\u0275listener("click", function UserManagementComponent_Conditional_37_For_1_Template_button_click_16_listener($event) {
      const user_r13 = \u0275\u0275restoreView(_r12).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      ctx_r1.deleteUser(user_r13);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275element(17, "lucide-angular", 76);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    let tmp_11_0;
    const user_r13 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classMap(((tmp_11_0 = ctx_r1.selectedUser()) == null ? null : tmp_11_0.id) === user_r13.id ? "bg-blue-900/40 border-blue-500" : "bg-slate-800 border-slate-700 hover:border-blue-500/50");
    \u0275\u0275advance(4);
    \u0275\u0275property("size", 12);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(user_r13.nombreCompleto);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", user_r13.nombreUsuario, " ");
    \u0275\u0275advance(2);
    \u0275\u0275classMap(user_r13.activo ? "text-green-400" : "text-red-400");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", user_r13.activo ? "Activo" : "Inactivo", " ");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("", user_r13.roleIds.length, " roles");
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 12);
  }
}
function UserManagementComponent_Conditional_37_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275repeaterCreate(0, UserManagementComponent_Conditional_37_For_1_Template, 18, 10, "div", 64, _forTrack0);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275repeater(ctx_r1.filteredUsers());
  }
}
function UserManagementComponent_Conditional_45_Conditional_36_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 89);
    \u0275\u0275element(1, "lucide-angular", 92);
    \u0275\u0275elementStart(2, "div", 93);
    \u0275\u0275text(3, " La contrase\xF1a se generar\xE1 autom\xE1ticamente al crear el usuario ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
  }
}
function UserManagementComponent_Conditional_45_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 77)(1, "div", 78)(2, "div")(3, "label", 79);
    \u0275\u0275text(4, " Primer Nombre ");
    \u0275\u0275elementStart(5, "span", 80);
    \u0275\u0275text(6, "*");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "input", 81);
    \u0275\u0275twoWayListener("ngModelChange", function UserManagementComponent_Conditional_45_Template_input_ngModelChange_7_listener($event) {
      \u0275\u0275restoreView(_r14);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.selectedUser().primerNombre, $event) || (ctx_r1.selectedUser().primerNombre = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function UserManagementComponent_Conditional_45_Template_input_ngModelChange_7_listener() {
      \u0275\u0275restoreView(_r14);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.updateNombreCompleto());
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "div")(9, "label", 79);
    \u0275\u0275text(10, "Segundo Nombre");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "input", 82);
    \u0275\u0275twoWayListener("ngModelChange", function UserManagementComponent_Conditional_45_Template_input_ngModelChange_11_listener($event) {
      \u0275\u0275restoreView(_r14);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.selectedUser().segundoNombre, $event) || (ctx_r1.selectedUser().segundoNombre = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function UserManagementComponent_Conditional_45_Template_input_ngModelChange_11_listener() {
      \u0275\u0275restoreView(_r14);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.updateNombreCompleto());
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(12, "div", 78)(13, "div")(14, "label", 79);
    \u0275\u0275text(15, " Primer Apellido ");
    \u0275\u0275elementStart(16, "span", 80);
    \u0275\u0275text(17, "*");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(18, "input", 83);
    \u0275\u0275twoWayListener("ngModelChange", function UserManagementComponent_Conditional_45_Template_input_ngModelChange_18_listener($event) {
      \u0275\u0275restoreView(_r14);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.selectedUser().primerApellido, $event) || (ctx_r1.selectedUser().primerApellido = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function UserManagementComponent_Conditional_45_Template_input_ngModelChange_18_listener() {
      \u0275\u0275restoreView(_r14);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.updateNombreCompleto());
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(19, "div")(20, "label", 79);
    \u0275\u0275text(21, "Segundo Apellido");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "input", 84);
    \u0275\u0275twoWayListener("ngModelChange", function UserManagementComponent_Conditional_45_Template_input_ngModelChange_22_listener($event) {
      \u0275\u0275restoreView(_r14);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.selectedUser().segundoApellido, $event) || (ctx_r1.selectedUser().segundoApellido = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function UserManagementComponent_Conditional_45_Template_input_ngModelChange_22_listener() {
      \u0275\u0275restoreView(_r14);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.updateNombreCompleto());
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(23, "div")(24, "label", 79);
    \u0275\u0275text(25, "Nombre Completo");
    \u0275\u0275elementEnd();
    \u0275\u0275element(26, "input", 85);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(27, "div", 86)(28, "div")(29, "label", 79);
    \u0275\u0275text(30, " Nombre de Usuario ");
    \u0275\u0275elementStart(31, "span", 80);
    \u0275\u0275text(32, "*");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(33, "input", 87);
    \u0275\u0275twoWayListener("ngModelChange", function UserManagementComponent_Conditional_45_Template_input_ngModelChange_33_listener($event) {
      \u0275\u0275restoreView(_r14);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.selectedUser().nombreUsuario, $event) || (ctx_r1.selectedUser().nombreUsuario = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(34, "p", 88);
    \u0275\u0275text(35, "Usuario \xFAnico para iniciar sesi\xF3n");
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(36, UserManagementComponent_Conditional_45_Conditional_36_Template, 4, 1, "div", 89);
    \u0275\u0275elementStart(37, "div", 4)(38, "input", 90);
    \u0275\u0275twoWayListener("ngModelChange", function UserManagementComponent_Conditional_45_Template_input_ngModelChange_38_listener($event) {
      \u0275\u0275restoreView(_r14);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.selectedUser().activo, $event) || (ctx_r1.selectedUser().activo = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(39, "label", 91);
    \u0275\u0275text(40, "Usuario activo");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(7);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.selectedUser().primerNombre);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.selectedUser().segundoNombre);
    \u0275\u0275advance(7);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.selectedUser().primerApellido);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.selectedUser().segundoApellido);
    \u0275\u0275advance(4);
    \u0275\u0275property("value", ctx_r1.selectedUser().nombreCompleto);
    \u0275\u0275advance(7);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.selectedUser().nombreUsuario);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(!ctx_r1.selectedUser().id ? 36 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.selectedUser().activo);
  }
}
function UserManagementComponent_Conditional_46_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 32);
    \u0275\u0275element(1, "lucide-angular", 94);
    \u0275\u0275elementStart(2, "p", 95);
    \u0275\u0275text(3, "Selecciona o crea un usuario");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 32);
  }
}
function UserManagementComponent_Conditional_56_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 27);
    \u0275\u0275element(1, "lucide-angular", 96);
    \u0275\u0275elementStart(2, "p", 8);
    \u0275\u0275text(3, "Sin roles disponibles");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p", 62);
    \u0275\u0275text(5, "Crea roles primero");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 28);
  }
}
function UserManagementComponent_Conditional_56_Conditional_2_For_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r15 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "label", 97)(1, "input", 98);
    \u0275\u0275listener("change", function UserManagementComponent_Conditional_56_Conditional_2_For_1_Template_input_change_1_listener() {
      const role_r16 = \u0275\u0275restoreView(_r15).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.toggleRole(role_r16.id));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "div", 67)(3, "div", 99);
    \u0275\u0275element(4, "lucide-angular", 34);
    \u0275\u0275elementStart(5, "h3", 100);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "p", 101);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const role_r16 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275property("checked", ctx_r1.isRoleAssigned(role_r16.id));
    \u0275\u0275advance(3);
    \u0275\u0275property("size", 12);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(role_r16.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(role_r16.description);
  }
}
function UserManagementComponent_Conditional_56_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275repeaterCreate(0, UserManagementComponent_Conditional_56_Conditional_2_For_1_Template, 9, 4, "label", 97, _forTrack0);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275repeater(ctx_r1.availableRoles());
  }
}
function UserManagementComponent_Conditional_56_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 36);
    \u0275\u0275conditionalCreate(1, UserManagementComponent_Conditional_56_Conditional_1_Template, 6, 1, "div", 27)(2, UserManagementComponent_Conditional_56_Conditional_2_Template, 2, 0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.availableRoles().length === 0 ? 1 : 2);
  }
}
function UserManagementComponent_Conditional_57_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 32);
    \u0275\u0275element(1, "lucide-angular", 102);
    \u0275\u0275elementStart(2, "p", 8);
    \u0275\u0275text(3, "Selecciona un usuario para asignar roles");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 32);
  }
}
function UserManagementComponent_Conditional_58_Template(rf, ctx) {
  if (rf & 1) {
    const _r17 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 37)(1, "button", 103);
    \u0275\u0275listener("click", function UserManagementComponent_Conditional_58_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r17);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.cancelEdit());
    });
    \u0275\u0275text(2, " Cancelar ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "button", 104);
    \u0275\u0275listener("click", function UserManagementComponent_Conditional_58_Template_button_click_3_listener() {
      \u0275\u0275restoreView(_r17);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.saveUser());
    });
    \u0275\u0275element(4, "lucide-angular", 105);
    \u0275\u0275text(5, " Guardar ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275property("disabled", !ctx_r1.isUserValid());
    \u0275\u0275advance();
    \u0275\u0275property("size", 16);
  }
}
function UserManagementComponent_Conditional_59_Template(rf, ctx) {
  if (rf & 1) {
    const _r18 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 38)(1, "div", 106)(2, "div", 107);
    \u0275\u0275element(3, "lucide-angular", 108);
    \u0275\u0275elementStart(4, "h3", 109);
    \u0275\u0275text(5, "Usuario Creado Exitosamente");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 110)(7, "p", 111);
    \u0275\u0275text(8, " El usuario ");
    \u0275\u0275elementStart(9, "strong", 112);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275text(11, " ha sido creado. ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "div", 113);
    \u0275\u0275element(13, "lucide-angular", 114);
    \u0275\u0275elementStart(14, "div", 115)(15, "strong");
    \u0275\u0275text(16, "Importante:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(17, " Copia esta contrase\xF1a ahora. No se volver\xE1 a mostrar. ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(18, "div")(19, "label", 79);
    \u0275\u0275text(20, "Contrase\xF1a Temporal");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "div", 116);
    \u0275\u0275element(22, "input", 117);
    \u0275\u0275elementStart(23, "button", 118);
    \u0275\u0275listener("click", function UserManagementComponent_Conditional_59_Template_button_click_23_listener() {
      \u0275\u0275restoreView(_r18);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.copyPassword());
    });
    \u0275\u0275element(24, "lucide-angular", 119);
    \u0275\u0275text(25);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(26, "p", 8);
    \u0275\u0275text(27, " Proporciona esta contrase\xF1a al usuario. Deber\xE1 cambiarla en su primer inicio de sesi\xF3n. ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(28, "div", 120)(29, "button", 121);
    \u0275\u0275listener("click", function UserManagementComponent_Conditional_59_Template_button_click_29_listener() {
      \u0275\u0275restoreView(_r18);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.closePasswordModal());
    });
    \u0275\u0275text(30);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    let tmp_2_0;
    let tmp_4_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275property("size", 20);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate((tmp_2_0 = ctx_r1.generatedUserInfo()) == null ? null : tmp_2_0.nombreUsuario);
    \u0275\u0275advance(3);
    \u0275\u0275property("size", 16);
    \u0275\u0275advance(9);
    \u0275\u0275property("value", (tmp_4_0 = ctx_r1.generatedUserInfo()) == null ? null : tmp_4_0.password);
    \u0275\u0275advance(2);
    \u0275\u0275property("name", ctx_r1.passwordCopied() ? "check" : "copy")("size", 14);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.passwordCopied() ? "Copiado" : "Copiar", " ");
    \u0275\u0275advance(4);
    \u0275\u0275property("disabled", !ctx_r1.passwordCopied());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.passwordCopied() ? "Cerrar" : "Copiar antes de cerrar", " ");
  }
}
var _UserManagementComponent = class _UserManagementComponent {
  constructor() {
    this.usuarioService = inject(UsuarioService);
    this.rolService = inject(RolService);
    this.tenantService = inject(TenantService);
    this.portfolioService = inject(PortfolioService);
    this.users = signal([], ...ngDevMode ? [{ debugName: "users" }] : []);
    this.selectedUser = signal(null, ...ngDevMode ? [{ debugName: "selectedUser" }] : []);
    this.originalUser = signal(null, ...ngDevMode ? [{ debugName: "originalUser" }] : []);
    this.availableRoles = signal([], ...ngDevMode ? [{ debugName: "availableRoles" }] : []);
    this.showPasswordModal = signal(false, ...ngDevMode ? [{ debugName: "showPasswordModal" }] : []);
    this.generatedUserInfo = signal(null, ...ngDevMode ? [{ debugName: "generatedUserInfo" }] : []);
    this.passwordCopied = signal(false, ...ngDevMode ? [{ debugName: "passwordCopied" }] : []);
    this.tenants = signal([], ...ngDevMode ? [{ debugName: "tenants" }] : []);
    this.allPortfolios = signal([], ...ngDevMode ? [{ debugName: "allPortfolios" }] : []);
    this.allSubPortfolios = signal([], ...ngDevMode ? [{ debugName: "allSubPortfolios" }] : []);
    this.searchTerm = signal("", ...ngDevMode ? [{ debugName: "searchTerm" }] : []);
    this.showFilterDropdown = signal(false, ...ngDevMode ? [{ debugName: "showFilterDropdown" }] : []);
    this.filterType = signal(null, ...ngDevMode ? [{ debugName: "filterType" }] : []);
    this.activeFilter = signal(null, ...ngDevMode ? [{ debugName: "activeFilter" }] : []);
    this.filteredUsers = computed(() => {
      let filtered = this.users();
      const search = this.searchTerm().toLowerCase();
      if (search) {
        filtered = filtered.filter((u) => u.nombreCompleto.toLowerCase().includes(search) || u.nombreUsuario.toLowerCase().includes(search));
      }
      const filter = this.activeFilter();
      if (filter) {
        filtered = filtered.filter((user) => {
          const userRoles = this.availableRoles().filter((r) => user.roleIds.includes(r.id));
          return userRoles.some((role) => {
            if (!role.assignments || role.assignments.length === 0)
              return false;
            return role.assignments.some((assignment) => {
              if (filter.type === "INQUILINO") {
                return assignment.type === "INQUILINO" && assignment.tenantId === filter.id;
              }
              if (filter.type === "CARTERA") {
                return assignment.type === "CARTERA" && assignment.portfolioId === filter.id || assignment.type === "INQUILINO" && assignment.tenantId === this.getTenantIdForPortfolio(filter.id);
              }
              if (filter.type === "SUBCARTERA") {
                const portfolioId = this.getPortfolioIdForSubPortfolio(filter.id);
                const tenantId = portfolioId ? this.getTenantIdForPortfolio(portfolioId) : null;
                return assignment.type === "SUBCARTERA" && assignment.subPortfolioId === filter.id || assignment.type === "CARTERA" && assignment.portfolioId === portfolioId || assignment.type === "INQUILINO" && assignment.tenantId === tenantId;
              }
              return false;
            });
          });
        });
      }
      return filtered;
    }, ...ngDevMode ? [{ debugName: "filteredUsers" }] : []);
    this.hasChanges = computed(() => {
      const current = this.selectedUser();
      const original = this.originalUser();
      if (!current || !original)
        return false;
      return JSON.stringify(current) !== JSON.stringify(original);
    }, ...ngDevMode ? [{ debugName: "hasChanges" }] : []);
  }
  ngOnInit() {
    this.loadData();
    this.loadTenantsAndFilters();
  }
  loadData() {
    this.rolService.obtenerTodos().subscribe({
      next: (roles) => {
        this.availableRoles.set(roles.map((r) => ({
          id: r.idRol,
          name: r.nombreRol,
          description: r.descripcion || "",
          assignments: r.asignaciones.map((a) => ({
            type: a.tipoAsignacion,
            tenantId: a.tenantId,
            portfolioId: a.portfolioId,
            subPortfolioId: a.subPortfolioId
          }))
        })));
      },
      error: (err) => console.error("Error al cargar roles:", err)
    });
    this.usuarioService.obtenerTodos().subscribe({
      next: (usuarios) => {
        this.users.set(usuarios.map((u) => this.mapUsuarioResponseToUser(u)));
      },
      error: (err) => console.error("Error al cargar usuarios:", err)
    });
  }
  loadTenantsAndFilters() {
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
                  error: (err) => console.error(`Error al cargar subportfolios para portfolio ${portfolio.id}:`, err)
                });
              });
            },
            error: (err) => console.error(`Error al cargar portfolios para tenant ${tenant.id}:`, err)
          });
        });
      },
      error: (err) => console.error("Error al cargar tenants:", err)
    });
  }
  mapUsuarioResponseToUser(response) {
    return {
      id: response.idUsuario,
      primerNombre: response.primerNombre || "",
      segundoNombre: response.segundoNombre,
      primerApellido: response.primerApellido || "",
      segundoApellido: response.segundoApellido,
      nombreCompleto: response.nombreCompleto,
      nombreUsuario: response.nombreUsuario,
      roleIds: response.roleIds,
      activo: response.activo
    };
  }
  createNewUser() {
    const newUser = {
      primerNombre: "",
      segundoNombre: "",
      primerApellido: "",
      segundoApellido: "",
      nombreCompleto: "",
      nombreUsuario: "",
      roleIds: [],
      activo: true
    };
    this.selectedUser.set(newUser);
    this.originalUser.set(null);
  }
  selectUser(user) {
    const userCopy = __spreadProps(__spreadValues({}, user), { roleIds: [...user.roleIds] });
    this.selectedUser.set(userCopy);
    this.originalUser.set(JSON.parse(JSON.stringify(user)));
  }
  deleteUser(user) {
    if (!user.id)
      return;
    if (confirm(`\xBFEst\xE1s seguro de eliminar el usuario "${user.nombreCompleto}"?`)) {
      this.usuarioService.eliminar(user.id).subscribe({
        next: () => {
          const currentUsers = this.users();
          this.users.set(currentUsers.filter((u) => u.id !== user.id));
          if (this.selectedUser()?.id === user.id) {
            this.selectedUser.set(null);
          }
          alert("Usuario eliminado correctamente");
        },
        error: (err) => {
          console.error("Error al eliminar usuario:", err);
          alert("Error al eliminar usuario: " + (err.error?.message || err.message));
        }
      });
    }
  }
  updateNombreCompleto() {
    const user = this.selectedUser();
    if (!user)
      return;
    const parts = [
      user.primerNombre?.trim(),
      user.segundoNombre?.trim(),
      user.primerApellido?.trim(),
      user.segundoApellido?.trim()
    ].filter((part) => part && part.length > 0);
    user.nombreCompleto = parts.join(" ");
    this.selectedUser.set(__spreadValues({}, user));
  }
  isRoleAssigned(roleId) {
    return this.selectedUser()?.roleIds.includes(roleId) || false;
  }
  toggleRole(roleId) {
    const user = this.selectedUser();
    if (!user)
      return;
    const index = user.roleIds.indexOf(roleId);
    if (index > -1) {
      user.roleIds.splice(index, 1);
    } else {
      user.roleIds.push(roleId);
    }
    this.selectedUser.set(__spreadValues({}, user));
  }
  isUserValid() {
    const user = this.selectedUser();
    const isValid = !!(user && user.primerNombre.trim() && user.primerApellido.trim() && user.nombreUsuario.trim());
    if (!user?.id)
      return isValid;
    return isValid && this.hasChanges();
  }
  generatePassword() {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*";
    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  }
  saveUser() {
    const user = this.selectedUser();
    if (!user || !this.isUserValid())
      return;
    const request = {
      primerNombre: user.primerNombre,
      segundoNombre: user.segundoNombre,
      primerApellido: user.primerApellido,
      segundoApellido: user.segundoApellido,
      nombreUsuario: user.nombreUsuario,
      activo: user.activo,
      roleIds: user.roleIds
    };
    if (user.id) {
      this.usuarioService.actualizar(user.id, request).subscribe({
        next: (response) => {
          const currentUsers = this.users();
          const index = currentUsers.findIndex((u) => u.id === user.id);
          if (index > -1) {
            currentUsers[index] = this.mapUsuarioResponseToUser(response);
            this.users.set([...currentUsers]);
          }
          this.selectedUser.set(null);
          alert("Usuario actualizado correctamente");
        },
        error: (err) => {
          console.error("Error al actualizar usuario:", err);
          alert("Error al actualizar usuario: " + (err.error?.message || err.message));
        }
      });
    } else {
      this.usuarioService.crear(request).subscribe({
        next: (response) => {
          const newUser = this.mapUsuarioResponseToUser(response);
          this.users.set([...this.users(), newUser]);
          if (response.generatedPassword) {
            this.generatedUserInfo.set({
              nombreUsuario: newUser.nombreUsuario,
              password: response.generatedPassword
            });
            this.showPasswordModal.set(true);
            this.passwordCopied.set(false);
          }
          this.selectedUser.set(null);
        },
        error: (err) => {
          console.error("Error al crear usuario:", err);
          alert("Error al crear usuario: " + (err.error?.message || err.message));
        }
      });
    }
  }
  copyPassword() {
    const password = this.generatedUserInfo()?.password;
    if (password) {
      navigator.clipboard.writeText(password).then(() => {
        this.passwordCopied.set(true);
      });
    }
  }
  closePasswordModal() {
    if (this.passwordCopied()) {
      this.showPasswordModal.set(false);
      this.generatedUserInfo.set(null);
      this.passwordCopied.set(false);
    }
  }
  cancelEdit() {
    this.selectedUser.set(null);
  }
  // Métodos para el filtro único
  toggleFilterDropdown() {
    const newState = !this.showFilterDropdown();
    this.showFilterDropdown.set(newState);
    if (newState) {
      this.filterType.set(null);
    }
  }
  setFilterType(type) {
    this.filterType.set(type);
  }
  setFilter(type, id, name) {
    this.activeFilter.set({ type, id, name });
    this.showFilterDropdown.set(false);
    this.filterType.set(null);
  }
  clearFilter() {
    this.activeFilter.set(null);
    this.filterType.set(null);
    this.showFilterDropdown.set(false);
  }
  isFilterActive(type, id) {
    const filter = this.activeFilter();
    return filter?.type === type && filter?.id === id;
  }
  // Métodos para obtener nombres con jerarquía completa
  getPortfolioDisplayName(portfolioId) {
    const portfolio = this.allPortfolios().find((p) => p.id === portfolioId);
    if (!portfolio)
      return "";
    const tenant = this.tenants().find((t) => t.id === portfolio.tenantId);
    if (!tenant)
      return portfolio.portfolioName;
    return `${tenant.tenantName} - ${portfolio.portfolioName}`;
  }
  getSubPortfolioDisplayName(subPortfolioId) {
    const subPortfolio = this.allSubPortfolios().find((sp) => sp.id === subPortfolioId);
    if (!subPortfolio)
      return "";
    const portfolio = this.allPortfolios().find((p) => p.id === subPortfolio.portfolioId);
    if (!portfolio)
      return subPortfolio.subPortfolioName;
    const tenant = this.tenants().find((t) => t.id === portfolio.tenantId);
    if (!tenant)
      return `${portfolio.portfolioName} - ${subPortfolio.subPortfolioName}`;
    return `${tenant.tenantName} - ${portfolio.portfolioName} - ${subPortfolio.subPortfolioName}`;
  }
  // Métodos auxiliares para obtener IDs de la jerarquía
  getTenantIdForPortfolio(portfolioId) {
    const portfolio = this.allPortfolios().find((p) => p.id === portfolioId);
    return portfolio?.tenantId || null;
  }
  getPortfolioIdForSubPortfolio(subPortfolioId) {
    const subPortfolio = this.allSubPortfolios().find((sp) => sp.id === subPortfolioId);
    return subPortfolio?.portfolioId || null;
  }
};
_UserManagementComponent.\u0275fac = function UserManagementComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _UserManagementComponent)();
};
_UserManagementComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _UserManagementComponent, selectors: [["app-user-management"]], decls: 60, vars: 20, consts: [[1, "h-[calc(100dvh-56px)]", "bg-slate-950", "overflow-hidden", "flex", "flex-col"], [1, "flex-1", "overflow-y-auto"], [1, "p-3", "max-w-[1800px]", "mx-auto"], [1, "mb-3"], [1, "flex", "items-center", "gap-2"], [1, "w-8", "h-8", "bg-gradient-to-br", "from-blue-600", "to-blue-700", "rounded-lg", "flex", "items-center", "justify-center"], ["name", "users", 1, "text-white", 3, "size"], [1, "text-lg", "font-bold", "text-white"], [1, "text-xs", "text-gray-400"], [1, "grid", "grid-cols-12", "gap-3"], [1, "col-span-3", "bg-slate-900", "rounded-lg", "border", "border-slate-800", "shadow-sm", "flex", "flex-col", "max-h-[calc(100vh-140px)]"], [1, "p-3", "border-b", "border-slate-800", "flex", "items-center", "justify-between", "flex-shrink-0"], ["name", "list", 1, "text-blue-400", 3, "size"], [1, "text-sm", "font-bold", "text-white"], [1, "px-2", "py-1", "bg-blue-600", "hover:bg-blue-700", "text-white", "rounded", "text-xs", "font-semibold", "transition-colors", "flex", "items-center", "gap-1", 3, "click"], ["name", "plus", 3, "size"], [1, "p-2", "border-b", "border-slate-800"], [1, "flex", "gap-1.5"], [1, "relative", "flex-1"], ["name", "search", 1, "absolute", "left-1.5", "top-1/2", "-translate-y-1/2", "text-gray-500", 3, "size"], ["type", "text", "placeholder", "Buscar usuario...", 1, "w-full", "pl-9", "pr-2", "py-1.5", "bg-slate-800", "border", "border-slate-700", "rounded", "text-white", "text-xs", "placeholder:text-gray-500", "focus:outline-none", "focus:ring-1", "focus:ring-blue-500", 3, "ngModelChange", "ngModel"], [1, "relative"], [1, "p-1.5", "rounded", "transition-colors", 3, "click"], ["name", "filter", 1, "text-white", 3, "size"], [1, "absolute", "right-0", "top-full", "mt-1", "w-72", "bg-slate-800", "border", "border-slate-700", "rounded", "shadow-lg", "z-50"], [1, "mt-1.5", "flex", "items-center", "gap-1"], [1, "p-2", "space-y-1", "overflow-y-auto", "flex-1"], [1, "text-center", "py-8"], [1, "col-span-5", "bg-slate-900", "rounded-lg", "border", "border-slate-800", "shadow-sm", "flex", "flex-col", "max-h-[calc(100vh-140px)]"], [1, "p-3", "border-b", "border-slate-800", "flex-shrink-0"], ["name", "user-cog", 1, "text-blue-400", 3, "size"], [1, "p-3", "space-y-3", "overflow-y-auto", "flex-1"], [1, "text-center", "py-12"], [1, "col-span-4", "bg-slate-900", "rounded-lg", "border", "border-slate-800", "shadow-sm", "flex", "flex-col", "max-h-[calc(100vh-140px)]"], ["name", "shield-check", 1, "text-purple-400", 3, "size"], [1, "p-3", "overflow-y-auto", "flex-1"], [1, "space-y-1.5"], [1, "mt-3", "flex", "justify-end", "gap-2"], [1, "fixed", "inset-0", "bg-black/60", "backdrop-blur-sm", "flex", "items-center", "justify-center", "z-50", "p-4"], [1, "p-2", "border-b", "border-slate-700", "flex", "items-center", "justify-between"], [1, "text-xs", "font-semibold", "text-white"], [1, "text-xs", "text-blue-400", "hover:text-blue-300"], [1, "p-2"], [1, "p-2", "max-h-96", "overflow-y-auto"], [1, "text-xs", "text-blue-400", "hover:text-blue-300", 3, "click"], [1, "text-xs", "text-gray-400", "mb-2"], [1, "space-y-1"], [1, "w-full", "flex", "items-center", "gap-2", "px-3", "py-2", "bg-slate-700/50", "hover:bg-slate-700", "border", "border-slate-600", "hover:border-blue-500/50", "rounded", "text-xs", "text-white", "transition-colors", 3, "click"], ["name", "building", 1, "text-blue-400", 3, "size"], [1, "w-full", "flex", "items-center", "gap-2", "px-3", "py-2", "bg-slate-700/50", "hover:bg-slate-700", "border", "border-slate-600", "hover:border-purple-500/50", "rounded", "text-xs", "text-white", "transition-colors", 3, "click"], ["name", "briefcase", 1, "text-purple-400", 3, "size"], [1, "w-full", "flex", "items-center", "gap-2", "px-3", "py-2", "bg-slate-700/50", "hover:bg-slate-700", "border", "border-slate-600", "hover:border-green-500/50", "rounded", "text-xs", "text-white", "transition-colors", 3, "click"], ["name", "folder", 1, "text-green-400", 3, "size"], [1, "flex", "items-center", "justify-between", "mb-2"], [1, "flex", "items-center", "gap-1", "text-xs", "text-gray-400", "hover:text-white", "transition-colors", 3, "click"], ["name", "arrow-left", 3, "size"], [1, "w-full", "text-left", "px-2", "py-1.5", "rounded", "border", "text-xs", "text-white", "mb-1", "transition-colors", 3, "class"], [1, "w-full", "text-left", "px-2", "py-1.5", "rounded", "border", "text-xs", "text-white", "mb-1", "transition-colors", 3, "click"], [1, "inline-flex", "items-center", "gap-1", "px-2", "py-1", "bg-blue-900/40", "border", "border-blue-500", "rounded", "text-xs", "text-white"], [1, "ml-1", "hover:text-red-400", 3, "click"], ["name", "x", 3, "size"], ["name", "search-x", 1, "text-gray-600", "mx-auto", "mb-2", 3, "size"], [1, "text-xs", "text-gray-500"], ["name", "user-x", 1, "text-gray-600", "mx-auto", "mb-2", 3, "size"], [1, "p-2", "rounded", "border", "cursor-pointer", "transition-all", 3, "class"], [1, "p-2", "rounded", "border", "cursor-pointer", "transition-all", 3, "click"], [1, "flex", "items-start", "justify-between"], [1, "flex-1", "min-w-0"], [1, "flex", "items-center", "gap-1"], ["name", "user", 1, "text-blue-400", "flex-shrink-0", 3, "size"], [1, "text-xs", "font-semibold", "text-white", "truncate"], [1, "mt-0.5", "text-xs", "text-gray-500", "truncate"], [1, "mt-0.5", "flex", "items-center", "gap-1"], [1, "text-xs"], [1, "text-gray-500"], [1, "p-0.5", "text-gray-400", "hover:text-red-400", "rounded", "transition-colors", "flex-shrink-0", 3, "click"], ["name", "trash-2", 3, "size"], [1, "space-y-2"], [1, "grid", "grid-cols-2", "gap-2"], [1, "block", "text-xs", "font-semibold", "text-gray-300", "mb-1"], [1, "text-red-400"], ["type", "text", "placeholder", "Ej: Juan", 1, "w-full", "px-2", "py-1.5", "bg-slate-800", "border", "border-slate-700", "rounded", "text-white", "text-sm", "placeholder:text-gray-500", "focus:outline-none", "focus:ring-1", "focus:ring-blue-500", 3, "ngModelChange", "ngModel"], ["type", "text", "placeholder", "Ej: Carlos", 1, "w-full", "px-2", "py-1.5", "bg-slate-800", "border", "border-slate-700", "rounded", "text-white", "text-sm", "placeholder:text-gray-500", "focus:outline-none", "focus:ring-1", "focus:ring-blue-500", 3, "ngModelChange", "ngModel"], ["type", "text", "placeholder", "Ej: Garc\xEDa", 1, "w-full", "px-2", "py-1.5", "bg-slate-800", "border", "border-slate-700", "rounded", "text-white", "text-sm", "placeholder:text-gray-500", "focus:outline-none", "focus:ring-1", "focus:ring-blue-500", 3, "ngModelChange", "ngModel"], ["type", "text", "placeholder", "Ej: L\xF3pez", 1, "w-full", "px-2", "py-1.5", "bg-slate-800", "border", "border-slate-700", "rounded", "text-white", "text-sm", "placeholder:text-gray-500", "focus:outline-none", "focus:ring-1", "focus:ring-blue-500", 3, "ngModelChange", "ngModel"], ["type", "text", "readonly", "", 1, "w-full", "px-2", "py-1.5", "bg-slate-700", "border", "border-slate-600", "rounded", "text-gray-400", "text-sm", "cursor-not-allowed", 3, "value"], [1, "space-y-2", "pt-2", "border-t", "border-slate-800"], ["type", "text", "placeholder", "Ej: jgarcia", 1, "w-full", "px-2", "py-1.5", "bg-slate-800", "border", "border-slate-700", "rounded", "text-white", "text-sm", "placeholder:text-gray-500", "focus:outline-none", "focus:ring-1", "focus:ring-blue-500", 3, "ngModelChange", "ngModel"], [1, "mt-1", "text-xs", "text-gray-500"], [1, "bg-blue-900/20", "border", "border-blue-700/50", "rounded", "p-2", "flex", "items-start", "gap-2"], ["type", "checkbox", "id", "userActive", 1, "w-3.5", "h-3.5", "text-blue-600", "bg-slate-800", "border-slate-700", "rounded", "focus:ring-blue-500", 3, "ngModelChange", "ngModel"], ["for", "userActive", 1, "text-xs", "text-gray-300", "cursor-pointer"], ["name", "info", 1, "text-blue-400", "flex-shrink-0", "mt-0.5", 3, "size"], [1, "text-xs", "text-blue-300"], ["name", "user-circle", 1, "text-gray-600", "mx-auto", "mb-2", 3, "size"], [1, "text-sm", "text-gray-400"], ["name", "shield-off", 1, "text-gray-600", "mx-auto", "mb-2", 3, "size"], [1, "flex", "items-start", "gap-2", "p-2", "bg-slate-800", "hover:bg-slate-700/50", "border", "border-slate-700", "rounded", "cursor-pointer", "group"], ["type", "checkbox", 1, "mt-0.5", "w-4", "h-4", "text-purple-600", "bg-slate-700", "border-slate-600", "rounded", "focus:ring-purple-500", 3, "change", "checked"], [1, "flex", "items-center", "gap-1.5"], [1, "text-xs", "font-semibold", "text-white", "group-hover:text-purple-300"], [1, "text-xs", "text-gray-500", "leading-tight", "mt-0.5"], ["name", "shield", 1, "text-gray-600", "mx-auto", "mb-2", 3, "size"], [1, "px-4", "py-2", "bg-slate-700", "hover:bg-slate-600", "text-white", "rounded", "text-sm", "font-semibold", "transition-colors", 3, "click"], [1, "px-4", "py-2", "bg-blue-600", "hover:bg-blue-700", "disabled:bg-slate-700", "disabled:cursor-not-allowed", "text-white", "rounded", "text-sm", "font-semibold", "transition-colors", "flex", "items-center", "gap-1.5", 3, "click", "disabled"], ["name", "save", 3, "size"], [1, "bg-slate-800", "rounded-lg", "border", "border-slate-700", "shadow-2xl", "max-w-md", "w-full"], [1, "p-4", "border-b", "border-slate-700", "flex", "items-center", "gap-2"], ["name", "key", 1, "text-green-400", 3, "size"], [1, "text-base", "font-bold", "text-white"], [1, "p-4", "space-y-3"], [1, "text-sm", "text-gray-300"], [1, "text-white"], [1, "bg-amber-900/20", "border", "border-amber-700/50", "rounded", "p-3", "flex", "items-start", "gap-2"], ["name", "alert-triangle", 1, "text-amber-400", "flex-shrink-0", "mt-0.5", 3, "size"], [1, "text-xs", "text-amber-300"], [1, "flex", "gap-2"], ["type", "text", "readonly", "", 1, "flex-1", "px-3", "py-2", "bg-slate-900", "border", "border-slate-600", "rounded", "text-white", "font-mono", "text-sm", 3, "value"], [1, "px-3", "py-2", "bg-blue-600", "hover:bg-blue-700", "text-white", "rounded", "text-sm", "font-semibold", "transition-colors", "flex", "items-center", "gap-1.5", 3, "click"], [3, "name", "size"], [1, "p-4", "border-t", "border-slate-700", "flex", "justify-end"], [1, "px-4", "py-2", "bg-green-600", "hover:bg-green-700", "disabled:bg-slate-700", "disabled:cursor-not-allowed", "text-white", "rounded", "text-sm", "font-semibold", "transition-colors", 3, "click", "disabled"]], template: function UserManagementComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "div", 4)(5, "div", 5);
    \u0275\u0275element(6, "lucide-angular", 6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "div")(8, "h1", 7);
    \u0275\u0275text(9, "Gesti\xF3n de Usuarios");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "p", 8);
    \u0275\u0275text(11, "Crea y administra usuarios del sistema");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(12, "div", 9)(13, "div", 10)(14, "div", 11)(15, "div", 4);
    \u0275\u0275element(16, "lucide-angular", 12);
    \u0275\u0275elementStart(17, "h2", 13);
    \u0275\u0275text(18, "Usuarios");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "span", 8);
    \u0275\u0275text(20);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(21, "button", 14);
    \u0275\u0275listener("click", function UserManagementComponent_Template_button_click_21_listener() {
      return ctx.createNewUser();
    });
    \u0275\u0275element(22, "lucide-angular", 15);
    \u0275\u0275text(23, " Nuevo ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(24, "div", 16)(25, "div", 17)(26, "div", 18);
    \u0275\u0275element(27, "lucide-angular", 19);
    \u0275\u0275elementStart(28, "input", 20);
    \u0275\u0275twoWayListener("ngModelChange", function UserManagementComponent_Template_input_ngModelChange_28_listener($event) {
      \u0275\u0275twoWayBindingSet(ctx.searchTerm, $event) || (ctx.searchTerm = $event);
      return $event;
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(29, "div", 21)(30, "button", 22);
    \u0275\u0275listener("click", function UserManagementComponent_Template_button_click_30_listener() {
      return ctx.toggleFilterDropdown();
    });
    \u0275\u0275element(31, "lucide-angular", 23);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(32, UserManagementComponent_Conditional_32_Template, 7, 2, "div", 24);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(33, UserManagementComponent_Conditional_33_Template, 9, 3, "div", 25);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(34, "div", 26);
    \u0275\u0275conditionalCreate(35, UserManagementComponent_Conditional_35_Template, 6, 1, "div", 27)(36, UserManagementComponent_Conditional_36_Template, 6, 1, "div", 27)(37, UserManagementComponent_Conditional_37_Template, 2, 0);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(38, "div", 28)(39, "div", 29)(40, "div", 4);
    \u0275\u0275element(41, "lucide-angular", 30);
    \u0275\u0275elementStart(42, "h2", 13);
    \u0275\u0275text(43);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(44, "div", 31);
    \u0275\u0275conditionalCreate(45, UserManagementComponent_Conditional_45_Template, 41, 8)(46, UserManagementComponent_Conditional_46_Template, 4, 1, "div", 32);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(47, "div", 33)(48, "div", 29)(49, "div", 4);
    \u0275\u0275element(50, "lucide-angular", 34);
    \u0275\u0275elementStart(51, "h2", 13);
    \u0275\u0275text(52, "Roles Asignados");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(53, "span", 8);
    \u0275\u0275text(54);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(55, "div", 35);
    \u0275\u0275conditionalCreate(56, UserManagementComponent_Conditional_56_Template, 3, 1, "div", 36)(57, UserManagementComponent_Conditional_57_Template, 4, 1, "div", 32);
    \u0275\u0275elementEnd()()();
    \u0275\u0275conditionalCreate(58, UserManagementComponent_Conditional_58_Template, 6, 2, "div", 37);
    \u0275\u0275elementEnd()()();
    \u0275\u0275conditionalCreate(59, UserManagementComponent_Conditional_59_Template, 31, 9, "div", 38);
  }
  if (rf & 2) {
    let tmp_12_0;
    \u0275\u0275advance(6);
    \u0275\u0275property("size", 16);
    \u0275\u0275advance(10);
    \u0275\u0275property("size", 16);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("(", ctx.users().length, ")");
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 12);
    \u0275\u0275advance(5);
    \u0275\u0275property("size", 14);
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("ngModel", ctx.searchTerm);
    \u0275\u0275advance(2);
    \u0275\u0275classMap(ctx.activeFilter() ? "bg-blue-600 hover:bg-blue-700" : "bg-slate-700 hover:bg-slate-600");
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx.showFilterDropdown() ? 32 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx.activeFilter() ? 33 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx.filteredUsers().length === 0 && ctx.users().length > 0 ? 35 : ctx.users().length === 0 ? 36 : 37);
    \u0275\u0275advance(6);
    \u0275\u0275property("size", 16);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ((tmp_12_0 = ctx.selectedUser()) == null ? null : tmp_12_0.id) ? "Editar Usuario" : ctx.selectedUser() ? "Nuevo Usuario" : "Informaci\xF3n", " ");
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx.selectedUser() ? 45 : 46);
    \u0275\u0275advance(5);
    \u0275\u0275property("size", 16);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("(", ctx.selectedUser() ? ctx.selectedUser().roleIds.length : 0, ")");
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx.selectedUser() ? 56 : 57);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx.selectedUser() ? 58 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx.showPasswordModal() ? 59 : -1);
  }
}, dependencies: [CommonModule, FormsModule, DefaultValueAccessor, CheckboxControlValueAccessor, NgControlStatus, NgModel, LucideAngularModule, LucideAngularComponent], encapsulation: 2 });
var UserManagementComponent = _UserManagementComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(UserManagementComponent, [{
    type: Component,
    args: [{
      selector: "app-user-management",
      standalone: true,
      imports: [CommonModule, FormsModule, LucideAngularModule],
      template: `
    <div class="h-[calc(100dvh-56px)] bg-slate-950 overflow-hidden flex flex-col">
      <div class="flex-1 overflow-y-auto">
        <div class="p-3 max-w-[1800px] mx-auto">
          <!-- Header -->
          <div class="mb-3">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <lucide-angular name="users" [size]="16" class="text-white"></lucide-angular>
              </div>
              <div>
                <h1 class="text-lg font-bold text-white">Gesti\xF3n de Usuarios</h1>
                <p class="text-xs text-gray-400">Crea y administra usuarios del sistema</p>
              </div>
            </div>
          </div>

          <!-- Grid de 3 Columnas -->
          <div class="grid grid-cols-12 gap-3">
            <!-- Columna 1: Lista de Usuarios (25%) -->
            <div class="col-span-3 bg-slate-900 rounded-lg border border-slate-800 shadow-sm flex flex-col max-h-[calc(100vh-140px)]">
              <div class="p-3 border-b border-slate-800 flex items-center justify-between flex-shrink-0">
                <div class="flex items-center gap-2">
                  <lucide-angular name="list" [size]="16" class="text-blue-400"></lucide-angular>
                  <h2 class="text-sm font-bold text-white">Usuarios</h2>
                  <span class="text-xs text-gray-400">({{ users().length }})</span>
                </div>
                <button (click)="createNewUser()"
                        class="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold transition-colors flex items-center gap-1">
                  <lucide-angular name="plus" [size]="12"></lucide-angular>
                  Nuevo
                </button>
              </div>

              <!-- B\xFAsqueda y Filtro -->
              <div class="p-2 border-b border-slate-800">
                <div class="flex gap-1.5">
                  <!-- Input de b\xFAsqueda -->
                  <div class="relative flex-1">
                    <lucide-angular name="search" [size]="14" class="absolute left-1.5 top-1/2 -translate-y-1/2 text-gray-500"></lucide-angular>
                    <input type="text"
                           [(ngModel)]="searchTerm"
                           placeholder="Buscar usuario..."
                           class="w-full pl-9 pr-2 py-1.5 bg-slate-800 border border-slate-700 rounded text-white text-xs placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                  </div>

                  <!-- Bot\xF3n de filtro -->
                  <div class="relative">
                    <button (click)="toggleFilterDropdown()"
                            [class]="activeFilter() ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-700 hover:bg-slate-600'"
                            class="p-1.5 rounded transition-colors">
                      <lucide-angular name="filter" [size]="14" class="text-white"></lucide-angular>
                    </button>

                    <!-- Dropdown de filtros -->
                    @if (showFilterDropdown()) {
                      <div class="absolute right-0 top-full mt-1 w-72 bg-slate-800 border border-slate-700 rounded shadow-lg z-50">
                        <div class="p-2 border-b border-slate-700 flex items-center justify-between">
                          <span class="text-xs font-semibold text-white">Filtrar por asignaci\xF3n</span>
                          @if (activeFilter()) {
                            <button (click)="clearFilter()"
                                    class="text-xs text-blue-400 hover:text-blue-300">
                              Limpiar
                            </button>
                          }
                        </div>

                        @if (!filterType()) {
                          <!-- Selecci\xF3n de tipo de filtro -->
                          <div class="p-2">
                            <p class="text-xs text-gray-400 mb-2">\xBFQu\xE9 desea filtrar?</p>
                            <div class="space-y-1">
                              <button (click)="setFilterType('INQUILINO')"
                                      class="w-full flex items-center gap-2 px-3 py-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 hover:border-blue-500/50 rounded text-xs text-white transition-colors">
                                <lucide-angular name="building" [size]="14" class="text-blue-400"></lucide-angular>
                                <span>Proveedor</span>
                              </button>
                              <button (click)="setFilterType('CARTERA')"
                                      class="w-full flex items-center gap-2 px-3 py-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 hover:border-purple-500/50 rounded text-xs text-white transition-colors">
                                <lucide-angular name="briefcase" [size]="14" class="text-purple-400"></lucide-angular>
                                <span>Cartera</span>
                              </button>
                              <button (click)="setFilterType('SUBCARTERA')"
                                      class="w-full flex items-center gap-2 px-3 py-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 hover:border-green-500/50 rounded text-xs text-white transition-colors">
                                <lucide-angular name="folder" [size]="14" class="text-green-400"></lucide-angular>
                                <span>Subcartera</span>
                              </button>
                            </div>
                          </div>
                        } @else {
                          <!-- Lista de opciones seg\xFAn el tipo -->
                          <div class="p-2 max-h-96 overflow-y-auto">
                            <div class="flex items-center justify-between mb-2">
                              <button (click)="filterType.set(null)"
                                      class="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors">
                                <lucide-angular name="arrow-left" [size]="12"></lucide-angular>
                                <span>Volver</span>
                              </button>
                            </div>

                            @if (filterType() === 'INQUILINO') {
                              <!-- Proveedores -->
                              @for (tenant of tenants(); track tenant.id) {
                                <button (click)="setFilter('INQUILINO', tenant.id, tenant.tenantName)"
                                        [class]="isFilterActive('INQUILINO', tenant.id) ? 'bg-blue-900/40 border-blue-500' : 'bg-slate-700/50 border-slate-600 hover:border-blue-500/50'"
                                        class="w-full text-left px-2 py-1.5 rounded border text-xs text-white mb-1 transition-colors">
                                  {{ tenant.tenantName }}
                                </button>
                              }
                            } @else if (filterType() === 'CARTERA') {
                              <!-- Carteras con jerarqu\xEDa -->
                              @for (portfolio of allPortfolios(); track portfolio.id) {
                                <button (click)="setFilter('CARTERA', portfolio.id, getPortfolioDisplayName(portfolio.id))"
                                        [class]="isFilterActive('CARTERA', portfolio.id) ? 'bg-blue-900/40 border-blue-500' : 'bg-slate-700/50 border-slate-600 hover:border-blue-500/50'"
                                        class="w-full text-left px-2 py-1.5 rounded border text-xs text-white mb-1 transition-colors">
                                  {{ getPortfolioDisplayName(portfolio.id) }}
                                </button>
                              }
                            } @else if (filterType() === 'SUBCARTERA') {
                              <!-- Subcarteras con jerarqu\xEDa -->
                              @for (subPortfolio of allSubPortfolios(); track subPortfolio.id) {
                                <button (click)="setFilter('SUBCARTERA', subPortfolio.id, getSubPortfolioDisplayName(subPortfolio.id))"
                                        [class]="isFilterActive('SUBCARTERA', subPortfolio.id) ? 'bg-blue-900/40 border-blue-500' : 'bg-slate-700/50 border-slate-600 hover:border-blue-500/50'"
                                        class="w-full text-left px-2 py-1.5 rounded border text-xs text-white mb-1 transition-colors">
                                  {{ getSubPortfolioDisplayName(subPortfolio.id) }}
                                </button>
                              }
                            }
                          </div>
                        }
                      </div>
                    }
                  </div>
                </div>

                <!-- Filtro activo (chip) -->
                @if (activeFilter()) {
                  <div class="mt-1.5 flex items-center gap-1">
                    <div class="inline-flex items-center gap-1 px-2 py-1 bg-blue-900/40 border border-blue-500 rounded text-xs text-white">
                      @if (activeFilter()!.type === 'INQUILINO') {
                        <lucide-angular name="building" [size]="10" class="text-blue-400"></lucide-angular>
                      } @else if (activeFilter()!.type === 'CARTERA') {
                        <lucide-angular name="briefcase" [size]="10" class="text-purple-400"></lucide-angular>
                      } @else {
                        <lucide-angular name="folder" [size]="10" class="text-green-400"></lucide-angular>
                      }
                      <span>{{ activeFilter()!.name }}</span>
                      <button (click)="clearFilter()" class="ml-1 hover:text-red-400">
                        <lucide-angular name="x" [size]="10"></lucide-angular>
                      </button>
                    </div>
                  </div>
                }
              </div>

              <div class="p-2 space-y-1 overflow-y-auto flex-1">
                @if (filteredUsers().length === 0 && users().length > 0) {
                  <div class="text-center py-8">
                    <lucide-angular name="search-x" [size]="28" class="text-gray-600 mx-auto mb-2"></lucide-angular>
                    <p class="text-xs text-gray-400">Sin resultados</p>
                    <p class="text-xs text-gray-500">Intenta otra b\xFAsqueda</p>
                  </div>
                } @else if (users().length === 0) {
                  <div class="text-center py-8">
                    <lucide-angular name="user-x" [size]="28" class="text-gray-600 mx-auto mb-2"></lucide-angular>
                    <p class="text-xs text-gray-400">Sin usuarios</p>
                    <p class="text-xs text-gray-500">Crea uno nuevo</p>
                  </div>
                } @else {
                  @for (user of filteredUsers(); track user.id) {
                    <div (click)="selectUser(user)"
                         [class]="selectedUser()?.id === user.id ? 'bg-blue-900/40 border-blue-500' : 'bg-slate-800 border-slate-700 hover:border-blue-500/50'"
                         class="p-2 rounded border cursor-pointer transition-all">
                      <div class="flex items-start justify-between">
                        <div class="flex-1 min-w-0">
                          <div class="flex items-center gap-1">
                            <lucide-angular name="user" [size]="12" class="text-blue-400 flex-shrink-0"></lucide-angular>
                            <h3 class="text-xs font-semibold text-white truncate">{{ user.nombreCompleto }}</h3>
                          </div>
                          <div class="mt-0.5 text-xs text-gray-500 truncate">
                            {{ user.nombreUsuario }}
                          </div>
                          <div class="mt-0.5 flex items-center gap-1">
                            <span [class]="user.activo ? 'text-green-400' : 'text-red-400'" class="text-xs">
                              {{ user.activo ? 'Activo' : 'Inactivo' }}
                            </span>
                            <span class="text-gray-500">\u2022</span>
                            <span class="text-xs text-gray-500">{{ user.roleIds.length }} roles</span>
                          </div>
                        </div>
                        <button (click)="deleteUser(user); $event.stopPropagation()"
                                class="p-0.5 text-gray-400 hover:text-red-400 rounded transition-colors flex-shrink-0">
                          <lucide-angular name="trash-2" [size]="12"></lucide-angular>
                        </button>
                      </div>
                    </div>
                  }
                }
              </div>
            </div>

            <!-- Columna 2: Formulario de Usuario (40%) -->
            <div class="col-span-5 bg-slate-900 rounded-lg border border-slate-800 shadow-sm flex flex-col max-h-[calc(100vh-140px)]">
              <div class="p-3 border-b border-slate-800 flex-shrink-0">
                <div class="flex items-center gap-2">
                  <lucide-angular name="user-cog" [size]="16" class="text-blue-400"></lucide-angular>
                  <h2 class="text-sm font-bold text-white">
                    {{ selectedUser()?.id ? 'Editar Usuario' : selectedUser() ? 'Nuevo Usuario' : 'Informaci\xF3n' }}
                  </h2>
                </div>
              </div>

              <div class="p-3 space-y-3 overflow-y-auto flex-1">
                @if (selectedUser()) {
                  <!-- Informaci\xF3n Personal -->
                  <div class="space-y-2">
                    <div class="grid grid-cols-2 gap-2">
                      <div>
                        <label class="block text-xs font-semibold text-gray-300 mb-1">
                          Primer Nombre <span class="text-red-400">*</span>
                        </label>
                        <input type="text"
                               [(ngModel)]="selectedUser()!.primerNombre"
                               (ngModelChange)="updateNombreCompleto()"
                               placeholder="Ej: Juan"
                               class="w-full px-2 py-1.5 bg-slate-800 border border-slate-700 rounded text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                      </div>

                      <div>
                        <label class="block text-xs font-semibold text-gray-300 mb-1">Segundo Nombre</label>
                        <input type="text"
                               [(ngModel)]="selectedUser()!.segundoNombre"
                               (ngModelChange)="updateNombreCompleto()"
                               placeholder="Ej: Carlos"
                               class="w-full px-2 py-1.5 bg-slate-800 border border-slate-700 rounded text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                      </div>
                    </div>

                    <div class="grid grid-cols-2 gap-2">
                      <div>
                        <label class="block text-xs font-semibold text-gray-300 mb-1">
                          Primer Apellido <span class="text-red-400">*</span>
                        </label>
                        <input type="text"
                               [(ngModel)]="selectedUser()!.primerApellido"
                               (ngModelChange)="updateNombreCompleto()"
                               placeholder="Ej: Garc\xEDa"
                               class="w-full px-2 py-1.5 bg-slate-800 border border-slate-700 rounded text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                      </div>

                      <div>
                        <label class="block text-xs font-semibold text-gray-300 mb-1">Segundo Apellido</label>
                        <input type="text"
                               [(ngModel)]="selectedUser()!.segundoApellido"
                               (ngModelChange)="updateNombreCompleto()"
                               placeholder="Ej: L\xF3pez"
                               class="w-full px-2 py-1.5 bg-slate-800 border border-slate-700 rounded text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                      </div>
                    </div>

                    <div>
                      <label class="block text-xs font-semibold text-gray-300 mb-1">Nombre Completo</label>
                      <input type="text"
                             [value]="selectedUser()!.nombreCompleto"
                             readonly
                             class="w-full px-2 py-1.5 bg-slate-700 border border-slate-600 rounded text-gray-400 text-sm cursor-not-allowed">
                    </div>
                  </div>

                  <!-- Credenciales -->
                  <div class="space-y-2 pt-2 border-t border-slate-800">
                    <div>
                      <label class="block text-xs font-semibold text-gray-300 mb-1">
                        Nombre de Usuario <span class="text-red-400">*</span>
                      </label>
                      <input type="text"
                             [(ngModel)]="selectedUser()!.nombreUsuario"
                             placeholder="Ej: jgarcia"
                             class="w-full px-2 py-1.5 bg-slate-800 border border-slate-700 rounded text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                      <p class="mt-1 text-xs text-gray-500">Usuario \xFAnico para iniciar sesi\xF3n</p>
                    </div>

                    @if (!selectedUser()!.id) {
                      <div class="bg-blue-900/20 border border-blue-700/50 rounded p-2 flex items-start gap-2">
                        <lucide-angular name="info" [size]="14" class="text-blue-400 flex-shrink-0 mt-0.5"></lucide-angular>
                        <div class="text-xs text-blue-300">
                          La contrase\xF1a se generar\xE1 autom\xE1ticamente al crear el usuario
                        </div>
                      </div>
                    }

                    <div class="flex items-center gap-2">
                      <input type="checkbox"
                             [(ngModel)]="selectedUser()!.activo"
                             id="userActive"
                             class="w-3.5 h-3.5 text-blue-600 bg-slate-800 border-slate-700 rounded focus:ring-blue-500">
                      <label for="userActive" class="text-xs text-gray-300 cursor-pointer">Usuario activo</label>
                    </div>
                  </div>
                } @else {
                  <div class="text-center py-12">
                    <lucide-angular name="user-circle" [size]="32" class="text-gray-600 mx-auto mb-2"></lucide-angular>
                    <p class="text-sm text-gray-400">Selecciona o crea un usuario</p>
                  </div>
                }
              </div>
            </div>

            <!-- Columna 3: Asignaci\xF3n de Roles (35%) -->
            <div class="col-span-4 bg-slate-900 rounded-lg border border-slate-800 shadow-sm flex flex-col max-h-[calc(100vh-140px)]">
              <div class="p-3 border-b border-slate-800 flex-shrink-0">
                <div class="flex items-center gap-2">
                  <lucide-angular name="shield-check" [size]="16" class="text-purple-400"></lucide-angular>
                  <h2 class="text-sm font-bold text-white">Roles Asignados</h2>
                  <span class="text-xs text-gray-400">({{ selectedUser() ? selectedUser()!.roleIds.length : 0 }})</span>
                </div>
              </div>

              <div class="p-3 overflow-y-auto flex-1">
                @if (selectedUser()) {
                  <div class="space-y-1.5">
                    @if (availableRoles().length === 0) {
                      <div class="text-center py-8">
                        <lucide-angular name="shield-off" [size]="28" class="text-gray-600 mx-auto mb-2"></lucide-angular>
                        <p class="text-xs text-gray-400">Sin roles disponibles</p>
                        <p class="text-xs text-gray-500">Crea roles primero</p>
                      </div>
                    } @else {
                      @for (role of availableRoles(); track role.id) {
                        <label class="flex items-start gap-2 p-2 bg-slate-800 hover:bg-slate-700/50 border border-slate-700 rounded cursor-pointer group">
                          <input type="checkbox"
                                 [checked]="isRoleAssigned(role.id)"
                                 (change)="toggleRole(role.id)"
                                 class="mt-0.5 w-4 h-4 text-purple-600 bg-slate-700 border-slate-600 rounded focus:ring-purple-500">
                          <div class="flex-1 min-w-0">
                            <div class="flex items-center gap-1.5">
                              <lucide-angular name="shield-check" [size]="12" class="text-purple-400"></lucide-angular>
                              <h3 class="text-xs font-semibold text-white group-hover:text-purple-300">{{ role.name }}</h3>
                            </div>
                            <p class="text-xs text-gray-500 leading-tight mt-0.5">{{ role.description }}</p>
                          </div>
                        </label>
                      }
                    }
                  </div>
                } @else {
                  <div class="text-center py-12">
                    <lucide-angular name="shield" [size]="32" class="text-gray-600 mx-auto mb-2"></lucide-angular>
                    <p class="text-xs text-gray-400">Selecciona un usuario para asignar roles</p>
                  </div>
                }
              </div>
            </div>
          </div>

          <!-- Botones de Acci\xF3n -->
          @if (selectedUser()) {
            <div class="mt-3 flex justify-end gap-2">
              <button (click)="cancelEdit()"
                      class="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded text-sm font-semibold transition-colors">
                Cancelar
              </button>
              <button (click)="saveUser()"
                      [disabled]="!isUserValid()"
                      class="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded text-sm font-semibold transition-colors flex items-center gap-1.5">
                <lucide-angular name="save" [size]="16"></lucide-angular>
                Guardar
              </button>
            </div>
          }
        </div>
      </div>
    </div>

    <!-- Modal de Contrase\xF1a Generada -->
    @if (showPasswordModal()) {
      <div class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div class="bg-slate-800 rounded-lg border border-slate-700 shadow-2xl max-w-md w-full">
          <div class="p-4 border-b border-slate-700 flex items-center gap-2">
            <lucide-angular name="key" [size]="20" class="text-green-400"></lucide-angular>
            <h3 class="text-base font-bold text-white">Usuario Creado Exitosamente</h3>
          </div>

          <div class="p-4 space-y-3">
            <p class="text-sm text-gray-300">
              El usuario <strong class="text-white">{{ generatedUserInfo()?.nombreUsuario }}</strong> ha sido creado.
            </p>

            <div class="bg-amber-900/20 border border-amber-700/50 rounded p-3 flex items-start gap-2">
              <lucide-angular name="alert-triangle" [size]="16" class="text-amber-400 flex-shrink-0 mt-0.5"></lucide-angular>
              <div class="text-xs text-amber-300">
                <strong>Importante:</strong> Copia esta contrase\xF1a ahora. No se volver\xE1 a mostrar.
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-300 mb-1">Contrase\xF1a Temporal</label>
              <div class="flex gap-2">
                <input type="text"
                       [value]="generatedUserInfo()?.password"
                       readonly
                       class="flex-1 px-3 py-2 bg-slate-900 border border-slate-600 rounded text-white font-mono text-sm">
                <button (click)="copyPassword()"
                        class="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-semibold transition-colors flex items-center gap-1.5">
                  <lucide-angular [name]="passwordCopied() ? 'check' : 'copy'" [size]="14"></lucide-angular>
                  {{ passwordCopied() ? 'Copiado' : 'Copiar' }}
                </button>
              </div>
            </div>

            <p class="text-xs text-gray-400">
              Proporciona esta contrase\xF1a al usuario. Deber\xE1 cambiarla en su primer inicio de sesi\xF3n.
            </p>
          </div>

          <div class="p-4 border-t border-slate-700 flex justify-end">
            <button (click)="closePasswordModal()"
                    [disabled]="!passwordCopied()"
                    class="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded text-sm font-semibold transition-colors">
              {{ passwordCopied() ? 'Cerrar' : 'Copiar antes de cerrar' }}
            </button>
          </div>
        </div>
      </div>
    }
  `
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(UserManagementComponent, { className: "UserManagementComponent", filePath: "src/app/maintenance/components/user-management/user-management.component.ts", lineNumber: 472 });
})();
export {
  UserManagementComponent
};
//# sourceMappingURL=chunk-4A2Y62AO.js.map
