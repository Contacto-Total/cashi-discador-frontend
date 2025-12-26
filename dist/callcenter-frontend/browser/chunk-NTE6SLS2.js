import {
  TypificationService
} from "./chunk-XGOWMJUN.js";
import {
  PortfolioService
} from "./chunk-K6HKS25L.js";
import {
  DefaultValueAccessor,
  FormsModule,
  MaxLengthValidator,
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

// src/app/maintenance/components/subportfolio-maintenance/subportfolio-maintenance.component.ts
var _forTrack0 = ($index, $item) => $item.id;
function SubPortfolioMaintenanceComponent_For_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 14);
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
function SubPortfolioMaintenanceComponent_For_34_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 14);
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
function SubPortfolioMaintenanceComponent_Conditional_35_Conditional_36_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 35);
    \u0275\u0275element(1, "div", 37);
    \u0275\u0275elementStart(2, "p", 38);
    \u0275\u0275text(3, "Cargando subcarteras...");
    \u0275\u0275elementEnd()();
  }
}
function SubPortfolioMaintenanceComponent_Conditional_35_Conditional_37_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " Intenta con otro t\xE9rmino de b\xFAsqueda ");
  }
}
function SubPortfolioMaintenanceComponent_Conditional_35_Conditional_37_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " Comienza creando tu primera subcartera ");
  }
}
function SubPortfolioMaintenanceComponent_Conditional_35_Conditional_37_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 35)(1, "div", 39);
    \u0275\u0275element(2, "lucide-angular", 40);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 41);
    \u0275\u0275text(4, "No se encontraron subcarteras");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 42);
    \u0275\u0275conditionalCreate(6, SubPortfolioMaintenanceComponent_Conditional_35_Conditional_37_Conditional_6_Template, 1, 0)(7, SubPortfolioMaintenanceComponent_Conditional_35_Conditional_37_Conditional_7_Template, 1, 0);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 32);
    \u0275\u0275advance(4);
    \u0275\u0275conditional(ctx_r3.searchTerm ? 6 : 7);
  }
}
function SubPortfolioMaintenanceComponent_Conditional_35_Conditional_38_For_18_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr", 47)(1, "td", 48)(2, "span", 49);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "td", 48)(5, "span", 50);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "td", 48)(8, "span", 51);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "td", 48)(11, "span", 51);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "td", 48)(14, "label", 52)(15, "input", 53);
    \u0275\u0275listener("change", function SubPortfolioMaintenanceComponent_Conditional_35_Conditional_38_For_18_Template_input_change_15_listener() {
      const subPortfolio_r6 = \u0275\u0275restoreView(_r5).$implicit;
      const ctx_r3 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r3.toggleSubPortfolioStatus(subPortfolio_r6));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275element(16, "div", 54);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(17, "td", 48)(18, "div", 55)(19, "button", 56);
    \u0275\u0275listener("click", function SubPortfolioMaintenanceComponent_Conditional_35_Conditional_38_For_18_Template_button_click_19_listener() {
      const subPortfolio_r6 = \u0275\u0275restoreView(_r5).$implicit;
      const ctx_r3 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r3.editSubPortfolio(subPortfolio_r6));
    });
    \u0275\u0275element(20, "lucide-angular", 57);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "button", 58);
    \u0275\u0275listener("click", function SubPortfolioMaintenanceComponent_Conditional_35_Conditional_38_For_18_Template_button_click_21_listener() {
      const subPortfolio_r6 = \u0275\u0275restoreView(_r5).$implicit;
      const ctx_r3 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r3.deleteSubPortfolio(subPortfolio_r6));
    });
    \u0275\u0275element(22, "lucide-angular", 59);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const subPortfolio_r6 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(subPortfolio_r6.subPortfolioCode);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(subPortfolio_r6.subPortfolioName);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(subPortfolio_r6.description || "-");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(subPortfolio_r6.portfolioName);
    \u0275\u0275advance(3);
    \u0275\u0275property("checked", subPortfolio_r6.isActive);
    \u0275\u0275advance(5);
    \u0275\u0275property("size", 18);
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 18);
  }
}
function SubPortfolioMaintenanceComponent_Conditional_35_Conditional_38_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 36)(1, "table", 43)(2, "thead", 44)(3, "tr")(4, "th", 45);
    \u0275\u0275text(5, "C\xF3digo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th", 45);
    \u0275\u0275text(7, "Nombre");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th", 45);
    \u0275\u0275text(9, "Descripci\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th", 45);
    \u0275\u0275text(11, "Cartera");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th", 45);
    \u0275\u0275text(13, "Estado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "th", 45);
    \u0275\u0275text(15, "Acciones");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(16, "tbody", 46);
    \u0275\u0275repeaterCreate(17, SubPortfolioMaintenanceComponent_Conditional_35_Conditional_38_For_18_Template, 23, 7, "tr", 47, _forTrack0);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(17);
    \u0275\u0275repeater(ctx_r3.filteredSubPortfolios());
  }
}
function SubPortfolioMaintenanceComponent_Conditional_35_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 17)(1, "div", 18)(2, "div", 2)(3, "div")(4, "p", 19);
    \u0275\u0275text(5, "Total Subcarteras");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p", 20);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "div", 21);
    \u0275\u0275element(9, "lucide-angular", 22);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(10, "div", 18)(11, "div", 2)(12, "div")(13, "p", 19);
    \u0275\u0275text(14, "Activas");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "p", 23);
    \u0275\u0275text(16);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(17, "div", 24);
    \u0275\u0275element(18, "lucide-angular", 25);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(19, "div", 18)(20, "div", 2)(21, "div")(22, "p", 19);
    \u0275\u0275text(23, "Inactivas");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "p", 26);
    \u0275\u0275text(25);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(26, "div", 27);
    \u0275\u0275element(27, "lucide-angular", 28);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(28, "div", 1)(29, "div", 10)(30, "div", 29)(31, "div", 30);
    \u0275\u0275element(32, "lucide-angular", 31);
    \u0275\u0275elementStart(33, "input", 32);
    \u0275\u0275twoWayListener("ngModelChange", function SubPortfolioMaintenanceComponent_Conditional_35_Template_input_ngModelChange_33_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r3 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r3.searchTerm, $event) || (ctx_r3.searchTerm = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function SubPortfolioMaintenanceComponent_Conditional_35_Template_input_ngModelChange_33_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.filterSubPortfolios());
    });
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275elementStart(34, "div", 33)(35, "div", 34);
    \u0275\u0275conditionalCreate(36, SubPortfolioMaintenanceComponent_Conditional_35_Conditional_36_Template, 4, 0, "div", 35)(37, SubPortfolioMaintenanceComponent_Conditional_35_Conditional_37_Template, 8, 2, "div", 35)(38, SubPortfolioMaintenanceComponent_Conditional_35_Conditional_38_Template, 19, 0, "div", 36);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(ctx_r3.subPortfolios().length);
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 24);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(ctx_r3.getActiveSubPortfolios());
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 24);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(ctx_r3.getInactiveSubPortfolios());
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 24);
    \u0275\u0275advance(5);
    \u0275\u0275property("size", 20);
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("ngModel", ctx_r3.searchTerm);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r3.loading() ? 36 : ctx_r3.filteredSubPortfolios().length === 0 ? 37 : 38);
  }
}
function SubPortfolioMaintenanceComponent_Conditional_36_Conditional_16_For_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 14);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const portfolio_r9 = ctx.$implicit;
    \u0275\u0275property("value", portfolio_r9.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", portfolio_r9.portfolioName, " (", portfolio_r9.portfolioCode, ")");
  }
}
function SubPortfolioMaintenanceComponent_Conditional_36_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div")(1, "label", 12);
    \u0275\u0275text(2, " Cartera ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "select", 78);
    \u0275\u0275twoWayListener("ngModelChange", function SubPortfolioMaintenanceComponent_Conditional_36_Conditional_16_Template_select_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r8);
      const ctx_r3 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r3.selectedPortfolioIdForForm, $event) || (ctx_r3.selectedPortfolioIdForForm = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275repeaterCreate(4, SubPortfolioMaintenanceComponent_Conditional_36_Conditional_16_For_5_Template, 2, 3, "option", 14, _forTrack0);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p", 72);
    \u0275\u0275text(7, "La subcartera se crear\xE1 para la cartera seleccionada");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", ctx_r3.selectedPortfolioIdForForm);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r3.portfolios());
  }
}
function SubPortfolioMaintenanceComponent_Conditional_36_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 71);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r3.getCodeErrorMessage());
  }
}
function SubPortfolioMaintenanceComponent_Conditional_36_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 72);
    \u0275\u0275text(1, "C\xF3digo \xFAnico alfanum\xE9rico de m\xE1ximo 3 caracteres (no se puede cambiar despu\xE9s de crear)");
    \u0275\u0275elementEnd();
  }
}
function SubPortfolioMaintenanceComponent_Conditional_36_Conditional_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 71);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r3.getNameErrorMessage());
  }
}
function SubPortfolioMaintenanceComponent_Conditional_36_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 16)(1, "div", 60)(2, "div", 61)(3, "div", 2)(4, "div", 55)(5, "div", 62);
    \u0275\u0275element(6, "lucide-angular", 63);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "div")(8, "h2", 64);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "p", 65);
    \u0275\u0275text(11, "Complete la informaci\xF3n de la subcartera");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(12, "button", 66);
    \u0275\u0275listener("click", function SubPortfolioMaintenanceComponent_Conditional_36_Template_button_click_12_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.closeDialog());
    });
    \u0275\u0275element(13, "lucide-angular", 67);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(14, "div", 68)(15, "div", 69);
    \u0275\u0275conditionalCreate(16, SubPortfolioMaintenanceComponent_Conditional_36_Conditional_16_Template, 8, 1, "div");
    \u0275\u0275elementStart(17, "div")(18, "label", 12);
    \u0275\u0275text(19, " C\xF3digo de la Subcartera * ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "input", 70);
    \u0275\u0275twoWayListener("ngModelChange", function SubPortfolioMaintenanceComponent_Conditional_36_Template_input_ngModelChange_20_listener($event) {
      \u0275\u0275restoreView(_r7);
      const ctx_r3 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r3.formData.subPortfolioCode, $event) || (ctx_r3.formData.subPortfolioCode = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(21, SubPortfolioMaintenanceComponent_Conditional_36_Conditional_21_Template, 2, 1, "p", 71)(22, SubPortfolioMaintenanceComponent_Conditional_36_Conditional_22_Template, 2, 0, "p", 72);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "div")(24, "label", 12);
    \u0275\u0275text(25, " Nombre de la Subcartera * ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "input", 73);
    \u0275\u0275twoWayListener("ngModelChange", function SubPortfolioMaintenanceComponent_Conditional_36_Template_input_ngModelChange_26_listener($event) {
      \u0275\u0275restoreView(_r7);
      const ctx_r3 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r3.formData.subPortfolioName, $event) || (ctx_r3.formData.subPortfolioName = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(27, SubPortfolioMaintenanceComponent_Conditional_36_Conditional_27_Template, 2, 1, "p", 71);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "div")(29, "label", 12);
    \u0275\u0275text(30, " Descripci\xF3n ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "textarea", 74);
    \u0275\u0275twoWayListener("ngModelChange", function SubPortfolioMaintenanceComponent_Conditional_36_Template_textarea_ngModelChange_31_listener($event) {
      \u0275\u0275restoreView(_r7);
      const ctx_r3 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r3.formData.description, $event) || (ctx_r3.formData.description = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(32, "p", 72);
    \u0275\u0275text(33, "Informaci\xF3n adicional sobre la subcartera (opcional)");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(34, "div", 75)(35, "button", 76);
    \u0275\u0275listener("click", function SubPortfolioMaintenanceComponent_Conditional_36_Template_button_click_35_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.closeDialog());
    });
    \u0275\u0275text(36, " Cancelar ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(37, "button", 77);
    \u0275\u0275listener("click", function SubPortfolioMaintenanceComponent_Conditional_36_Template_button_click_37_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.saveSubPortfolio());
    });
    \u0275\u0275text(38);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275property("size", 20);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r3.editingSubPortfolio() ? "Editar Subcartera" : "Nueva Subcartera");
    \u0275\u0275advance(4);
    \u0275\u0275property("size", 20);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r3.editingSubPortfolio() === null ? 16 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275classMap(ctx_r3.getCodeErrorMessage() ? "w-full px-4 py-2.5 bg-slate-800 border-2 border-red-500 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-slate-950 disabled:text-gray-600 uppercase" : "w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-950 disabled:text-gray-600 uppercase");
    \u0275\u0275twoWayProperty("ngModel", ctx_r3.formData.subPortfolioCode);
    \u0275\u0275property("disabled", ctx_r3.editingSubPortfolio() !== null);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r3.getCodeErrorMessage() ? 21 : 22);
    \u0275\u0275advance(5);
    \u0275\u0275classMap(ctx_r3.getNameErrorMessage() ? "w-full px-4 py-2.5 bg-slate-800 border-2 border-red-500 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500" : "w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500");
    \u0275\u0275twoWayProperty("ngModel", ctx_r3.formData.subPortfolioName);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r3.getNameErrorMessage() ? 27 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r3.formData.description);
    \u0275\u0275advance(6);
    \u0275\u0275property("disabled", !ctx_r3.canSave());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r3.editingSubPortfolio() ? "Guardar Cambios" : "Crear Subcartera", " ");
  }
}
var _SubPortfolioMaintenanceComponent = class _SubPortfolioMaintenanceComponent {
  constructor(portfolioService, typificationService) {
    this.portfolioService = portfolioService;
    this.typificationService = typificationService;
    this.tenants = signal([], ...ngDevMode ? [{ debugName: "tenants" }] : []);
    this.portfolios = signal([], ...ngDevMode ? [{ debugName: "portfolios" }] : []);
    this.subPortfolios = signal([], ...ngDevMode ? [{ debugName: "subPortfolios" }] : []);
    this.filteredSubPortfolios = signal([], ...ngDevMode ? [{ debugName: "filteredSubPortfolios" }] : []);
    this.loading = signal(false, ...ngDevMode ? [{ debugName: "loading" }] : []);
    this.showDialog = signal(false, ...ngDevMode ? [{ debugName: "showDialog" }] : []);
    this.editingSubPortfolio = signal(null, ...ngDevMode ? [{ debugName: "editingSubPortfolio" }] : []);
    this.selectedTenantId = 0;
    this.selectedPortfolioId = 0;
    this.selectedPortfolioIdForForm = 0;
    this.searchTerm = "";
    this.formData = {
      subPortfolioCode: "",
      subPortfolioName: "",
      description: ""
    };
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
    this.selectedPortfolioIdForForm = 0;
    this.portfolios.set([]);
    this.subPortfolios.set([]);
    this.filteredSubPortfolios.set([]);
    if (this.selectedTenantId > 0) {
      this.loadPortfolios();
    }
  }
  onPortfolioChange() {
    this.subPortfolios.set([]);
    this.filteredSubPortfolios.set([]);
    if (this.selectedPortfolioId > 0) {
      this.loadSubPortfolios();
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
  loadSubPortfolios() {
    this.loading.set(true);
    this.portfolioService.getSubPortfoliosByPortfolio(this.selectedPortfolioId).subscribe({
      next: (subPortfolios) => {
        this.subPortfolios.set(subPortfolios);
        this.filteredSubPortfolios.set(subPortfolios);
        this.loading.set(false);
      },
      error: (error) => {
        console.error("Error loading subportfolios:", error);
        this.loading.set(false);
      }
    });
  }
  filterSubPortfolios() {
    const term = this.searchTerm.toLowerCase();
    if (!term) {
      this.filteredSubPortfolios.set(this.subPortfolios());
      return;
    }
    const filtered = this.subPortfolios().filter((sp) => sp.subPortfolioCode.toLowerCase().includes(term) || sp.subPortfolioName.toLowerCase().includes(term));
    this.filteredSubPortfolios.set(filtered);
  }
  getActiveSubPortfolios() {
    return this.subPortfolios().filter((sp) => sp.isActive).length;
  }
  getInactiveSubPortfolios() {
    return this.subPortfolios().filter((sp) => !sp.isActive).length;
  }
  openCreateDialog() {
    if (this.selectedPortfolioId === 0) {
      alert("Por favor seleccione una cartera primero");
      return;
    }
    this.editingSubPortfolio.set(null);
    this.selectedPortfolioIdForForm = this.selectedPortfolioId;
    this.formData = {
      subPortfolioCode: "",
      subPortfolioName: "",
      description: ""
    };
    this.showDialog.set(true);
  }
  editSubPortfolio(subPortfolio) {
    this.editingSubPortfolio.set(subPortfolio);
    this.formData = {
      subPortfolioCode: subPortfolio.subPortfolioCode,
      subPortfolioName: subPortfolio.subPortfolioName,
      description: subPortfolio.description || ""
    };
    this.showDialog.set(true);
  }
  closeDialog() {
    this.showDialog.set(false);
    this.editingSubPortfolio.set(null);
  }
  isCodeDuplicated() {
    const editing = this.editingSubPortfolio();
    if (!this.formData.subPortfolioCode.trim() || editing) {
      return false;
    }
    const subPortfoliosInPortfolio = this.subPortfolios().filter((sp) => sp.portfolioId === this.selectedPortfolioIdForForm);
    return subPortfoliosInPortfolio.some((sp) => sp.subPortfolioCode.toLowerCase() === this.formData.subPortfolioCode.trim().toLowerCase());
  }
  getCodeErrorMessage() {
    if (!this.formData.subPortfolioCode.trim()) {
      return "";
    }
    if (this.isCodeDuplicated()) {
      return "Este c\xF3digo ya est\xE1 en uso en esta cartera";
    }
    return "";
  }
  isNameDuplicated() {
    if (!this.formData.subPortfolioName.trim()) {
      return false;
    }
    const subPortfoliosInPortfolio = this.subPortfolios().filter((sp) => sp.portfolioId === this.selectedPortfolioIdForForm);
    const editing = this.editingSubPortfolio();
    if (editing) {
      return subPortfoliosInPortfolio.some((sp) => sp.id !== editing.id && sp.subPortfolioName.toLowerCase() === this.formData.subPortfolioName.trim().toLowerCase());
    } else {
      return subPortfoliosInPortfolio.some((sp) => sp.subPortfolioName.toLowerCase() === this.formData.subPortfolioName.trim().toLowerCase());
    }
  }
  getNameErrorMessage() {
    if (!this.formData.subPortfolioName.trim()) {
      return "";
    }
    if (this.isNameDuplicated()) {
      return "Este nombre ya est\xE1 en uso en esta cartera";
    }
    return "";
  }
  canSave() {
    const editing = this.editingSubPortfolio();
    if (!this.formData.subPortfolioCode.trim() || !this.formData.subPortfolioName.trim()) {
      return false;
    }
    if (this.getCodeErrorMessage() || this.getNameErrorMessage()) {
      return false;
    }
    if (!editing && this.selectedPortfolioIdForForm <= 0) {
      return false;
    }
    return true;
  }
  saveSubPortfolio() {
    if (!this.canSave())
      return;
    const editing = this.editingSubPortfolio();
    if (editing) {
      const request = {
        subPortfolioName: this.formData.subPortfolioName,
        description: this.formData.description || void 0
      };
      this.portfolioService.updateSubPortfolio(editing.id, request).subscribe({
        next: () => {
          this.loadSubPortfolios();
          this.closeDialog();
        },
        error: (error) => {
          console.error("Error updating subportfolio:", error);
          alert("Error al actualizar la subcartera");
        }
      });
    } else {
      const request = {
        portfolioId: this.selectedPortfolioIdForForm,
        subPortfolioCode: this.formData.subPortfolioCode,
        subPortfolioName: this.formData.subPortfolioName,
        description: this.formData.description || void 0
      };
      this.portfolioService.createSubPortfolio(request).subscribe({
        next: () => {
          this.loadSubPortfolios();
          this.closeDialog();
        },
        error: (error) => {
          console.error("Error creating subportfolio:", error);
          alert("Error al crear la subcartera. Verifique que el c\xF3digo no est\xE9 duplicado.");
        }
      });
    }
  }
  toggleSubPortfolioStatus(subPortfolio) {
    const newStatus = !subPortfolio.isActive;
    const action = newStatus ? "activar" : "desactivar";
    if (confirm(`\xBFEst\xE1 seguro de ${action} la subcartera "${subPortfolio.subPortfolioName}"?`)) {
      this.portfolioService.toggleSubPortfolioStatus(subPortfolio.id, newStatus).subscribe({
        next: () => {
          this.loadSubPortfolios();
        },
        error: (error) => {
          console.error("Error updating subportfolio status:", error);
          alert("Error al cambiar el estado de la subcartera");
        }
      });
    }
  }
  deleteSubPortfolio(subPortfolio) {
    if (confirm(`\xBFEst\xE1 seguro de eliminar la subcartera "${subPortfolio.subPortfolioName}"? Esta acci\xF3n no se puede deshacer.`)) {
      this.portfolioService.deleteSubPortfolio(subPortfolio.id).subscribe({
        next: () => {
          this.loadSubPortfolios();
          alert("Subcartera eliminada exitosamente");
        },
        error: (error) => {
          console.error("Error deleting subportfolio:", error);
          alert("Error al eliminar la subcartera");
        }
      });
    }
  }
};
_SubPortfolioMaintenanceComponent.\u0275fac = function SubPortfolioMaintenanceComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _SubPortfolioMaintenanceComponent)(\u0275\u0275directiveInject(PortfolioService), \u0275\u0275directiveInject(TypificationService));
};
_SubPortfolioMaintenanceComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SubPortfolioMaintenanceComponent, selectors: [["app-subportfolio-maintenance"]], decls: 37, vars: 10, consts: [[1, "min-h-screen", "bg-gradient-to-br", "from-slate-900", "via-slate-800", "to-slate-900", "p-6"], [1, "max-w-7xl", "mx-auto", "mb-6"], [1, "flex", "items-center", "justify-between"], [1, "flex", "items-center", "gap-2", "mb-2"], [1, "w-8", "h-8", "bg-emerald-600", "rounded-lg", "flex", "items-center", "justify-center"], ["name", "folder", 1, "text-white", 3, "size"], [1, "text-lg", "font-bold", "text-white"], [1, "text-xs", "text-gray-400"], [1, "flex", "items-center", "gap-2", "px-5", "py-2.5", "bg-gradient-to-r", "from-emerald-600", "to-emerald-700", "text-white", "rounded-lg", "font-semibold", "hover:shadow-lg", "transition-all", "hover:scale-105", "disabled:opacity-50", "disabled:cursor-not-allowed", "disabled:hover:scale-100", "cursor-pointer", 3, "click", "disabled"], ["name", "plus", 3, "size"], [1, "bg-slate-900", "rounded-xl", "p-4", "shadow-sm", "border", "border-slate-800"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "gap-4"], [1, "block", "text-sm", "font-semibold", "text-gray-300", "mb-2"], [1, "w-full", "px-4", "py-2.5", "bg-slate-800", "border", "border-slate-700", "rounded-lg", "text-white", "focus:outline-none", "focus:ring-2", "focus:ring-emerald-500", 3, "ngModelChange", "ngModel"], [3, "value"], [1, "w-full", "px-4", "py-2.5", "bg-slate-800", "border", "border-slate-700", "rounded-lg", "text-white", "focus:outline-none", "focus:ring-2", "focus:ring-emerald-500", "disabled:opacity-50", "disabled:cursor-not-allowed", 3, "ngModelChange", "ngModel", "disabled"], [1, "fixed", "inset-0", "bg-black/80", "backdrop-blur-sm", "flex", "items-center", "justify-center", "z-50", "p-4"], [1, "max-w-7xl", "mx-auto", "mb-6", "grid", "grid-cols-1", "md:grid-cols-3", "gap-4"], [1, "bg-slate-900", "rounded-xl", "p-5", "shadow-sm", "border", "border-slate-800"], [1, "text-sm", "text-gray-400", "mb-1"], [1, "text-3xl", "font-bold", "text-white"], [1, "w-12", "h-12", "bg-emerald-900/30", "rounded-lg", "flex", "items-center", "justify-center"], ["name", "folder-tree", 1, "text-emerald-400", 3, "size"], [1, "text-3xl", "font-bold", "text-green-400"], [1, "w-12", "h-12", "bg-green-900/30", "rounded-lg", "flex", "items-center", "justify-center"], ["name", "check-circle", 1, "text-green-400", 3, "size"], [1, "text-3xl", "font-bold", "text-gray-500"], [1, "w-12", "h-12", "bg-slate-800", "rounded-lg", "flex", "items-center", "justify-center"], ["name", "x-circle", 1, "text-gray-500", 3, "size"], [1, "flex", "items-center", "gap-4"], [1, "flex-1", "relative"], ["name", "search", 1, "absolute", "left-3", "top-1/2", "-translate-y-1/2", "text-gray-500", 3, "size"], ["type", "text", "placeholder", "Buscar por c\xF3digo o nombre...", 1, "w-full", "pl-12", "pr-4", "py-2.5", "bg-slate-800", "border", "border-slate-700", "rounded-lg", "text-white", "placeholder-gray-500", "focus:outline-none", "focus:ring-2", "focus:ring-emerald-500", 3, "ngModelChange", "ngModel"], [1, "max-w-7xl", "mx-auto"], [1, "bg-slate-900", "rounded-xl", "shadow-sm", "border", "border-slate-800", "overflow-hidden"], [1, "p-12", "text-center"], [1, "overflow-x-auto"], [1, "inline-block", "w-8", "h-8", "border-4", "border-emerald-500", "border-t-transparent", "rounded-full", "animate-spin"], [1, "mt-4", "text-gray-400"], [1, "w-16", "h-16", "bg-slate-800", "rounded-full", "flex", "items-center", "justify-center", "mx-auto", "mb-4"], ["name", "folder-tree", 1, "text-gray-600", 3, "size"], [1, "text-gray-300", "mb-2"], [1, "text-sm", "text-gray-500"], [1, "w-full"], [1, "bg-slate-800", "border-b", "border-slate-700"], [1, "px-6", "py-3", "text-left", "text-xs", "font-semibold", "text-gray-400", "uppercase", "tracking-wider"], [1, "divide-y", "divide-slate-800"], [1, "hover:bg-slate-800", "transition-colors"], [1, "px-6", "py-3"], [1, "font-mono", "text-sm", "font-semibold", "text-white"], [1, "font-medium", "text-white"], [1, "text-sm", "text-gray-400"], [1, "relative", "inline-flex", "items-center", "cursor-pointer"], ["type", "checkbox", 1, "sr-only", "peer", 3, "change", "checked"], [1, "w-11", "h-6", "bg-slate-700", "peer-focus:outline-none", "peer-focus:ring-4", "peer-focus:ring-emerald-800", "rounded-full", "peer", "peer-checked:after:translate-x-full", "rtl:peer-checked:after:-translate-x-full", "peer-checked:after:border-white", "after:content-['']", "after:absolute", "after:top-[2px]", "after:start-[2px]", "after:bg-white", "after:border-gray-300", "after:border", "after:rounded-full", "after:h-5", "after:w-5", "after:transition-all", "peer-checked:bg-emerald-600"], [1, "flex", "items-center", "gap-3"], ["title", "Editar", 1, "text-emerald-400", "hover:text-emerald-500", "transition-colors", "cursor-pointer", 3, "click"], ["name", "edit", 3, "size"], ["title", "Eliminar", 1, "text-red-400", "hover:text-red-500", "transition-colors", "cursor-pointer", 3, "click"], ["name", "trash-2", 3, "size"], [1, "bg-slate-900", "rounded-xl", "shadow-2xl", "max-w-2xl", "w-full", "max-h-[90vh]", "overflow-hidden", "border", "border-slate-800"], [1, "bg-gradient-to-r", "from-emerald-600", "to-emerald-700", "p-5", "text-white"], [1, "w-10", "h-10", "bg-white/20", "rounded-lg", "flex", "items-center", "justify-center"], ["name", "folder-tree", 3, "size"], [1, "text-xl", "font-bold"], [1, "text-emerald-100", "text-sm"], [1, "text-white/80", "hover:text-white", 3, "click"], ["name", "x", 3, "size"], [1, "p-6", "overflow-y-auto", "max-h-[calc(90vh-200px)]"], [1, "space-y-4"], ["type", "text", "maxlength", "3", "placeholder", "Ej: S01, ABC", 3, "ngModelChange", "ngModel", "disabled"], [1, "text-xs", "text-red-400", "mt-1", "font-semibold"], [1, "text-xs", "text-gray-500", "mt-1"], ["type", "text", "placeholder", "Ej: TC Cl\xE1sica, Lima", 3, "ngModelChange", "ngModel"], ["placeholder", "Descripci\xF3n de la subcartera...", "rows", "3", 1, "w-full", "px-4", "py-2.5", "bg-slate-800", "border", "border-slate-700", "rounded-lg", "text-white", "placeholder-gray-500", "focus:outline-none", "focus:ring-2", "focus:ring-emerald-500", 3, "ngModelChange", "ngModel"], [1, "border-t", "border-slate-800", "p-4", "flex", "justify-end", "gap-3", "bg-slate-950"], [1, "px-5", "py-2", "text-gray-400", "hover:bg-slate-800", "hover:text-white", "rounded-lg", "font-medium", "transition-colors", 3, "click"], [1, "px-5", "py-2", "bg-gradient-to-r", "from-emerald-600", "to-emerald-700", "text-white", "rounded-lg", "font-semibold", "hover:shadow-lg", "transition-all", "disabled:opacity-50", "disabled:cursor-not-allowed", 3, "click", "disabled"], ["disabled", "", 1, "w-full", "px-4", "py-2.5", "bg-slate-800", "border", "border-slate-700", "rounded-lg", "text-white", "focus:outline-none", "focus:ring-2", "focus:ring-emerald-500", "opacity-70", "cursor-not-allowed", 3, "ngModelChange", "ngModel"]], template: function SubPortfolioMaintenanceComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div")(4, "div", 3)(5, "div", 4);
    \u0275\u0275element(6, "lucide-angular", 5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "div")(8, "h1", 6);
    \u0275\u0275text(9, "Subcarteras");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "p", 7);
    \u0275\u0275text(11, "Configuraci\xF3n de subcarteras por cartera");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(12, "button", 8);
    \u0275\u0275listener("click", function SubPortfolioMaintenanceComponent_Template_button_click_12_listener() {
      return ctx.openCreateDialog();
    });
    \u0275\u0275element(13, "lucide-angular", 9);
    \u0275\u0275elementStart(14, "span");
    \u0275\u0275text(15, "Nueva Subcartera");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(16, "div", 1)(17, "div", 10)(18, "div", 11)(19, "div")(20, "label", 12);
    \u0275\u0275text(21, " Seleccionar Proveedor ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "select", 13);
    \u0275\u0275twoWayListener("ngModelChange", function SubPortfolioMaintenanceComponent_Template_select_ngModelChange_22_listener($event) {
      \u0275\u0275twoWayBindingSet(ctx.selectedTenantId, $event) || (ctx.selectedTenantId = $event);
      return $event;
    });
    \u0275\u0275listener("ngModelChange", function SubPortfolioMaintenanceComponent_Template_select_ngModelChange_22_listener() {
      return ctx.onTenantChange();
    });
    \u0275\u0275elementStart(23, "option", 14);
    \u0275\u0275text(24, "Seleccione un proveedor...");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(25, SubPortfolioMaintenanceComponent_For_26_Template, 2, 3, "option", 14, _forTrack0);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(27, "div")(28, "label", 12);
    \u0275\u0275text(29, " Seleccionar Cartera ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(30, "select", 15);
    \u0275\u0275twoWayListener("ngModelChange", function SubPortfolioMaintenanceComponent_Template_select_ngModelChange_30_listener($event) {
      \u0275\u0275twoWayBindingSet(ctx.selectedPortfolioId, $event) || (ctx.selectedPortfolioId = $event);
      return $event;
    });
    \u0275\u0275listener("ngModelChange", function SubPortfolioMaintenanceComponent_Template_select_ngModelChange_30_listener() {
      return ctx.onPortfolioChange();
    });
    \u0275\u0275elementStart(31, "option", 14);
    \u0275\u0275text(32, "Seleccione una cartera...");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(33, SubPortfolioMaintenanceComponent_For_34_Template, 2, 3, "option", 14, _forTrack0);
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275conditionalCreate(35, SubPortfolioMaintenanceComponent_Conditional_35_Template, 39, 9);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(36, SubPortfolioMaintenanceComponent_Conditional_36_Template, 39, 16, "div", 16);
  }
  if (rf & 2) {
    \u0275\u0275advance(6);
    \u0275\u0275property("size", 16);
    \u0275\u0275advance(6);
    \u0275\u0275property("disabled", ctx.selectedPortfolioId === 0);
    \u0275\u0275advance();
    \u0275\u0275property("size", 18);
    \u0275\u0275advance(9);
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
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx.selectedPortfolioId > 0 ? 35 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx.showDialog() ? 36 : -1);
  }
}, dependencies: [CommonModule, FormsModule, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, SelectControlValueAccessor, NgControlStatus, MaxLengthValidator, NgModel, LucideAngularModule, LucideAngularComponent], encapsulation: 2 });
var SubPortfolioMaintenanceComponent = _SubPortfolioMaintenanceComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SubPortfolioMaintenanceComponent, [{
    type: Component,
    args: [{
      selector: "app-subportfolio-maintenance",
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
              <div class="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <lucide-angular name="folder" [size]="16" class="text-white"></lucide-angular>
              </div>
              <div>
                <h1 class="text-lg font-bold text-white">Subcarteras</h1>
                <p class="text-xs text-gray-400">Configuraci\xF3n de subcarteras por cartera</p>
              </div>
            </div>
          </div>

          <button (click)="openCreateDialog()"
                  [disabled]="selectedPortfolioId === 0"
                  class="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg font-semibold hover:shadow-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer">
            <lucide-angular name="plus" [size]="18"></lucide-angular>
            <span>Nueva Subcartera</span>
          </button>
        </div>
      </div>

      <!-- Tenant and Portfolio Selector -->
      <div class="max-w-7xl mx-auto mb-6">
        <div class="bg-slate-900 rounded-xl p-4 shadow-sm border border-slate-800">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Proveedor Selector -->
            <div>
              <label class="block text-sm font-semibold text-gray-300 mb-2">
                Seleccionar Proveedor
              </label>
              <select [(ngModel)]="selectedTenantId"
                      (ngModelChange)="onTenantChange()"
                      class="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option [value]="0">Seleccione un proveedor...</option>
                @for (tenant of tenants(); track tenant.id) {
                  <option [value]="tenant.id">{{ tenant.tenantName }} ({{ tenant.tenantCode }})</option>
                }
              </select>
            </div>

            <!-- Cartera Selector -->
            <div>
              <label class="block text-sm font-semibold text-gray-300 mb-2">
                Seleccionar Cartera
              </label>
              <select [(ngModel)]="selectedPortfolioId"
                      (ngModelChange)="onPortfolioChange()"
                      [disabled]="selectedTenantId === 0"
                      class="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed">
                <option [value]="0">Seleccione una cartera...</option>
                @for (portfolio of portfolios(); track portfolio.id) {
                  <option [value]="portfolio.id">{{ portfolio.portfolioName }} ({{ portfolio.portfolioCode }})</option>
                }
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      @if (selectedPortfolioId > 0) {
        <div class="max-w-7xl mx-auto mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-slate-900 rounded-xl p-5 shadow-sm border border-slate-800">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-400 mb-1">Total Subcarteras</p>
                <p class="text-3xl font-bold text-white">{{ subPortfolios().length }}</p>
              </div>
              <div class="w-12 h-12 bg-emerald-900/30 rounded-lg flex items-center justify-center">
                <lucide-angular name="folder-tree" [size]="24" class="text-emerald-400"></lucide-angular>
              </div>
            </div>
          </div>

          <div class="bg-slate-900 rounded-xl p-5 shadow-sm border border-slate-800">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-400 mb-1">Activas</p>
                <p class="text-3xl font-bold text-green-400">{{ getActiveSubPortfolios() }}</p>
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
                <p class="text-3xl font-bold text-gray-500">{{ getInactiveSubPortfolios() }}</p>
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
                       (ngModelChange)="filterSubPortfolios()"
                       placeholder="Buscar por c\xF3digo o nombre..."
                       class="w-full pl-12 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500">
              </div>
            </div>
          </div>
        </div>

        <!-- SubPortfolios Table -->
        <div class="max-w-7xl mx-auto">
          <div class="bg-slate-900 rounded-xl shadow-sm border border-slate-800 overflow-hidden">
            @if (loading()) {
              <div class="p-12 text-center">
                <div class="inline-block w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                <p class="mt-4 text-gray-400">Cargando subcarteras...</p>
              </div>
            } @else if (filteredSubPortfolios().length === 0) {
              <div class="p-12 text-center">
                <div class="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <lucide-angular name="folder-tree" [size]="32" class="text-gray-600"></lucide-angular>
                </div>
                <p class="text-gray-300 mb-2">No se encontraron subcarteras</p>
                <p class="text-sm text-gray-500">
                  @if (searchTerm) {
                    Intenta con otro t\xE9rmino de b\xFAsqueda
                  } @else {
                    Comienza creando tu primera subcartera
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
                      <th class="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Descripci\xF3n</th>
                      <th class="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Cartera</th>
                      <th class="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Estado</th>
                      <th class="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-800">
                    @for (subPortfolio of filteredSubPortfolios(); track subPortfolio.id) {
                      <tr class="hover:bg-slate-800 transition-colors">
                        <td class="px-6 py-3">
                          <span class="font-mono text-sm font-semibold text-white">{{ subPortfolio.subPortfolioCode }}</span>
                        </td>
                        <td class="px-6 py-3">
                          <span class="font-medium text-white">{{ subPortfolio.subPortfolioName }}</span>
                        </td>
                        <td class="px-6 py-3">
                          <span class="text-sm text-gray-400">{{ subPortfolio.description || '-' }}</span>
                        </td>
                        <td class="px-6 py-3">
                          <span class="text-sm text-gray-400">{{ subPortfolio.portfolioName }}</span>
                        </td>
                        <td class="px-6 py-3">
                          <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox"
                                   [checked]="subPortfolio.isActive"
                                   (change)="toggleSubPortfolioStatus(subPortfolio)"
                                   class="sr-only peer">
                            <div class="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                          </label>
                        </td>
                        <td class="px-6 py-3">
                          <div class="flex items-center gap-3">
                            <button (click)="editSubPortfolio(subPortfolio)"
                                    class="text-emerald-400 hover:text-emerald-500 transition-colors cursor-pointer"
                                    title="Editar">
                              <lucide-angular name="edit" [size]="18"></lucide-angular>
                            </button>
                            <button (click)="deleteSubPortfolio(subPortfolio)"
                                    class="text-red-400 hover:text-red-500 transition-colors cursor-pointer"
                                    title="Eliminar">
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
      }
    </div>

    <!-- Create/Edit Dialog -->
    @if (showDialog()) {
      <div class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div class="bg-slate-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-slate-800">
          <!-- Dialog Header -->
          <div class="bg-gradient-to-r from-emerald-600 to-emerald-700 p-5 text-white">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <lucide-angular name="folder-tree" [size]="20"></lucide-angular>
                </div>
                <div>
                  <h2 class="text-xl font-bold">{{ editingSubPortfolio() ? 'Editar Subcartera' : 'Nueva Subcartera' }}</h2>
                  <p class="text-emerald-100 text-sm">Complete la informaci\xF3n de la subcartera</p>
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
              <!-- Cartera (solo al crear) -->
              @if (editingSubPortfolio() === null) {
                <div>
                  <label class="block text-sm font-semibold text-gray-300 mb-2">
                    Cartera
                  </label>
                  <select [(ngModel)]="selectedPortfolioIdForForm"
                          disabled
                          class="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 opacity-70 cursor-not-allowed">
                    @for (portfolio of portfolios(); track portfolio.id) {
                      <option [value]="portfolio.id">{{ portfolio.portfolioName }} ({{ portfolio.portfolioCode }})</option>
                    }
                  </select>
                  <p class="text-xs text-gray-500 mt-1">La subcartera se crear\xE1 para la cartera seleccionada</p>
                </div>
              }

              <!-- C\xF3digo -->
              <div>
                <label class="block text-sm font-semibold text-gray-300 mb-2">
                  C\xF3digo de la Subcartera *
                </label>
                <input type="text"
                       [(ngModel)]="formData.subPortfolioCode"
                       [disabled]="editingSubPortfolio() !== null"
                       maxlength="3"
                       placeholder="Ej: S01, ABC"
                       [class]="getCodeErrorMessage() ? 'w-full px-4 py-2.5 bg-slate-800 border-2 border-red-500 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-slate-950 disabled:text-gray-600 uppercase' : 'w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-950 disabled:text-gray-600 uppercase'">
                @if (getCodeErrorMessage()) {
                  <p class="text-xs text-red-400 mt-1 font-semibold">{{ getCodeErrorMessage() }}</p>
                } @else {
                  <p class="text-xs text-gray-500 mt-1">C\xF3digo \xFAnico alfanum\xE9rico de m\xE1ximo 3 caracteres (no se puede cambiar despu\xE9s de crear)</p>
                }
              </div>

              <!-- Nombre -->
              <div>
                <label class="block text-sm font-semibold text-gray-300 mb-2">
                  Nombre de la Subcartera *
                </label>
                <input type="text"
                       [(ngModel)]="formData.subPortfolioName"
                       placeholder="Ej: TC Cl\xE1sica, Lima"
                       [class]="getNameErrorMessage() ? 'w-full px-4 py-2.5 bg-slate-800 border-2 border-red-500 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500' : 'w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500'">
                @if (getNameErrorMessage()) {
                  <p class="text-xs text-red-400 mt-1 font-semibold">{{ getNameErrorMessage() }}</p>
                }
              </div>

              <!-- Descripci\xF3n -->
              <div>
                <label class="block text-sm font-semibold text-gray-300 mb-2">
                  Descripci\xF3n
                </label>
                <textarea [(ngModel)]="formData.description"
                          placeholder="Descripci\xF3n de la subcartera..."
                          rows="3"
                          class="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"></textarea>
                <p class="text-xs text-gray-500 mt-1">Informaci\xF3n adicional sobre la subcartera (opcional)</p>
              </div>
            </div>
          </div>

          <!-- Dialog Footer -->
          <div class="border-t border-slate-800 p-4 flex justify-end gap-3 bg-slate-950">
            <button (click)="closeDialog()"
                    class="px-5 py-2 text-gray-400 hover:bg-slate-800 hover:text-white rounded-lg font-medium transition-colors">
              Cancelar
            </button>
            <button (click)="saveSubPortfolio()"
                    [disabled]="!canSave()"
                    class="px-5 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {{ editingSubPortfolio() ? 'Guardar Cambios' : 'Crear Subcartera' }}
            </button>
          </div>
        </div>
      </div>
    }
  `
    }]
  }], () => [{ type: PortfolioService }, { type: TypificationService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SubPortfolioMaintenanceComponent, { className: "SubPortfolioMaintenanceComponent", filePath: "src/app/maintenance/components/subportfolio-maintenance/subportfolio-maintenance.component.ts", lineNumber: 324 });
})();
export {
  SubPortfolioMaintenanceComponent
};
//# sourceMappingURL=chunk-NTE6SLS2.js.map
