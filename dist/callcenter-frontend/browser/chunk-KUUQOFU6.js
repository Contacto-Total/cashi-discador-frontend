import {
  HeaderConfigurationService
} from "./chunk-A2MX5XEA.js";
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
  ElementRef,
  HttpClient,
  Injectable,
  ViewChild,
  __async,
  computed,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassMap,
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
  ɵɵinterpolate1,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵqueryRefresh,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIndex,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵstyleProp,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty,
  ɵɵviewQuery
} from "./chunk-CTRHJBBW.js";

// src/app/maintenance/services/field-definition.service.ts
var _FieldDefinitionService = class _FieldDefinitionService {
  constructor(http) {
    this.http = http;
    this.baseUrl = `${environment.tipificacionUrl}/system-config/field-definitions`;
  }
  /**
   * Obtiene todas las definiciones de campos activas
   */
  getAllActive() {
    return this.http.get(this.baseUrl);
  }
  /**
   * Obtiene definiciones de campos por categoría
   */
  getByCategory(category) {
    return this.http.get(`${this.baseUrl}/category/${category}`);
  }
  /**
   * Obtiene definiciones de campos por tipo de dato
   */
  getByDataType(dataType) {
    return this.http.get(`${this.baseUrl}/data-type/${dataType}`);
  }
  /**
   * Obtiene una definición de campo por ID
   */
  getById(id) {
    return this.http.get(`${this.baseUrl}/${id}`);
  }
  /**
   * Obtiene una definición de campo por código
   */
  getByFieldCode(fieldCode) {
    return this.http.get(`${this.baseUrl}/code/${fieldCode}`);
  }
  /**
   * Cuenta el total de campos activos
   */
  countActiveFields() {
    return this.http.get(`${this.baseUrl}/count`);
  }
};
_FieldDefinitionService.\u0275fac = function FieldDefinitionService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _FieldDefinitionService)(\u0275\u0275inject(HttpClient));
};
_FieldDefinitionService.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _FieldDefinitionService, factory: _FieldDefinitionService.\u0275fac, providedIn: "root" });
var FieldDefinitionService = _FieldDefinitionService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FieldDefinitionService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{ type: HttpClient }], null);
})();

// src/app/maintenance/components/header-configuration/header-configuration.component.ts
var _c0 = ["downloadButton"];
var _forTrack0 = ($index, $item) => $item.id;
var _forTrack1 = ($index, $item) => $item.headerName;
function HeaderConfigurationComponent_For_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 15);
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
function HeaderConfigurationComponent_For_32_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 15);
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
function HeaderConfigurationComponent_For_41_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 15);
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
function HeaderConfigurationComponent_Conditional_51_Conditional_29_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 40);
    \u0275\u0275element(1, "lucide-angular", 44);
    \u0275\u0275elementStart(2, "span", 45);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 46);
    \u0275\u0275text(5, "cabecera(s)");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r4 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r4.previewHeaders().length);
  }
}
function HeaderConfigurationComponent_Conditional_51_Conditional_30_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 47);
    \u0275\u0275listener("click", function HeaderConfigurationComponent_Conditional_51_Conditional_30_Template_div_click_0_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r4 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r4.downloadMenuOpen.set(false));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(1, "div", 48)(2, "button", 49);
    \u0275\u0275listener("click", function HeaderConfigurationComponent_Conditional_51_Conditional_30_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r4 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r4.downloadCSVTemplate());
    });
    \u0275\u0275element(3, "lucide-angular", 50);
    \u0275\u0275elementStart(4, "span", 51);
    \u0275\u0275text(5, "Descargar CSV");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "button", 49);
    \u0275\u0275listener("click", function HeaderConfigurationComponent_Conditional_51_Conditional_30_Template_button_click_6_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r4 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r4.downloadExcelTemplate());
    });
    \u0275\u0275element(7, "lucide-angular", 52);
    \u0275\u0275elementStart(8, "span", 51);
    \u0275\u0275text(9, "Descargar Excel (.xlsx)");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r4 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275styleProp("top", ctx_r4.dropdownPosition().top, "px")("left", ctx_r4.dropdownPosition().left, "px");
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 16);
    \u0275\u0275advance(4);
    \u0275\u0275property("size", 16);
  }
}
function HeaderConfigurationComponent_Conditional_51_Conditional_31_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 41)(1, "button", 53);
    \u0275\u0275listener("click", function HeaderConfigurationComponent_Conditional_51_Conditional_31_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r4 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r4.clearAll());
    });
    \u0275\u0275element(2, "lucide-angular", 54);
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4, "Limpiar");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "button", 55);
    \u0275\u0275listener("click", function HeaderConfigurationComponent_Conditional_51_Conditional_31_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r4 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r4.confirmConfiguration());
    });
    \u0275\u0275element(6, "lucide-angular", 56);
    \u0275\u0275elementStart(7, "span");
    \u0275\u0275text(8, "Guardar");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 14);
    \u0275\u0275advance(4);
    \u0275\u0275property("size", 16);
  }
}
function HeaderConfigurationComponent_Conditional_51_Conditional_34_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 42)(1, "div", 57);
    \u0275\u0275element(2, "lucide-angular", 58);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 59);
    \u0275\u0275text(4, "No hay cabeceras configuradas");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 24);
  }
}
function HeaderConfigurationComponent_Conditional_51_Conditional_35_For_20_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "lucide-angular", 69);
  }
  if (rf & 2) {
    const header_r9 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("title", \u0275\u0275interpolate1("Campo transformado mediante expresi\xF3n regular desde: ", header_r9.sourceField))("size", 12);
  }
}
function HeaderConfigurationComponent_Conditional_51_Conditional_35_For_20_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 72);
    \u0275\u0275text(1, "Sin asociar");
    \u0275\u0275elementEnd();
  }
}
function HeaderConfigurationComponent_Conditional_51_Conditional_35_For_20_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 73);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const header_r9 = \u0275\u0275nextContext().$implicit;
    const ctx_r4 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r4.getFieldCodeById(header_r9.fieldDefinitionId));
  }
}
function HeaderConfigurationComponent_Conditional_51_Conditional_35_For_20_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "lucide-angular", 75);
  }
  if (rf & 2) {
    \u0275\u0275property("size", 14);
  }
}
function HeaderConfigurationComponent_Conditional_51_Conditional_35_For_20_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "lucide-angular", 76);
  }
  if (rf & 2) {
    \u0275\u0275property("size", 14);
  }
}
function HeaderConfigurationComponent_Conditional_51_Conditional_35_For_20_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr", 65)(1, "td", 66)(2, "div", 67)(3, "span", 68);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(5, HeaderConfigurationComponent_Conditional_51_Conditional_35_For_20_Conditional_5_Template, 1, 3, "lucide-angular", 69);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "td", 66)(7, "span", 70);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "td", 66)(10, "span", 71);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "td", 66);
    \u0275\u0275conditionalCreate(13, HeaderConfigurationComponent_Conditional_51_Conditional_35_For_20_Conditional_13_Template, 2, 0, "span", 72)(14, HeaderConfigurationComponent_Conditional_51_Conditional_35_For_20_Conditional_14_Template, 2, 1, "span", 73);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "td", 66)(16, "span", 9);
    \u0275\u0275text(17);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(18, "td", 74);
    \u0275\u0275conditionalCreate(19, HeaderConfigurationComponent_Conditional_51_Conditional_35_For_20_Conditional_19_Template, 1, 1, "lucide-angular", 75)(20, HeaderConfigurationComponent_Conditional_51_Conditional_35_For_20_Conditional_20_Template, 1, 1, "lucide-angular", 76);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "td", 66)(22, "div", 67)(23, "button", 77);
    \u0275\u0275listener("click", function HeaderConfigurationComponent_Conditional_51_Conditional_35_For_20_Template_button_click_23_listener() {
      const $index_r10 = \u0275\u0275restoreView(_r8).$index;
      const ctx_r4 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r4.editPreviewHeader($index_r10));
    });
    \u0275\u0275element(24, "lucide-angular", 78);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "button", 79);
    \u0275\u0275listener("click", function HeaderConfigurationComponent_Conditional_51_Conditional_35_For_20_Template_button_click_25_listener() {
      const $index_r10 = \u0275\u0275restoreView(_r8).$index;
      const ctx_r4 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r4.removePreviewHeader($index_r10));
    });
    \u0275\u0275element(26, "lucide-angular", 54);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const header_r9 = ctx.$implicit;
    const ctx_r4 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(header_r9.headerName);
    \u0275\u0275advance();
    \u0275\u0275conditional(header_r9.sourceField && header_r9.regexPattern ? 5 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275classMap(ctx_r4.getDataTypeBadgeClass(header_r9.dataType));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", header_r9.dataType, " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(header_r9.displayLabel);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(header_r9.fieldDefinitionId === 0 ? 13 : 14);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(header_r9.format || "-");
    \u0275\u0275advance(2);
    \u0275\u0275conditional(header_r9.required ? 19 : 20);
    \u0275\u0275advance(5);
    \u0275\u0275property("size", 14);
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 14);
  }
}
function HeaderConfigurationComponent_Conditional_51_Conditional_35_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 43)(1, "table", 60)(2, "thead", 61)(3, "tr")(4, "th", 62);
    \u0275\u0275text(5, "Nombre");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th", 62);
    \u0275\u0275text(7, "Tipo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th", 62);
    \u0275\u0275text(9, "Etiqueta");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th", 62);
    \u0275\u0275text(11, "Campo Cat\xE1logo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th", 62);
    \u0275\u0275text(13, "Formato");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "th", 63);
    \u0275\u0275text(15, "Req.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "th", 62);
    \u0275\u0275text(17, "Acciones");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(18, "tbody", 64);
    \u0275\u0275repeaterCreate(19, HeaderConfigurationComponent_Conditional_51_Conditional_35_For_20_Template, 27, 11, "tr", 65, \u0275\u0275repeaterTrackByIndex);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r4 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(19);
    \u0275\u0275repeater(ctx_r4.previewHeaders());
  }
}
function HeaderConfigurationComponent_Conditional_51_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 4)(1, "div", 23)(2, "div", 24)(3, "div", 25)(4, "div", 26)(5, "button", 27, 0);
    \u0275\u0275listener("click", function HeaderConfigurationComponent_Conditional_51_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r4 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r4.toggleDownloadMenu());
    });
    \u0275\u0275element(7, "lucide-angular", 28);
    \u0275\u0275elementStart(8, "span", 29);
    \u0275\u0275text(9, "Descargar Plantilla");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "span", 30);
    \u0275\u0275text(11, "Plantilla");
    \u0275\u0275elementEnd();
    \u0275\u0275element(12, "lucide-angular", 31);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "select", 32);
    \u0275\u0275twoWayListener("ngModelChange", function HeaderConfigurationComponent_Conditional_51_Template_select_ngModelChange_13_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r4 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r4.csvSeparator, $event) || (ctx_r4.csvSeparator = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(14, "option", 33);
    \u0275\u0275text(15, "Separador: Punto y coma (;)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "option", 34);
    \u0275\u0275text(17, "Separador: Coma (,)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "option", 35);
    \u0275\u0275text(19, "Separador: Pipe (|)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "option", 36);
    \u0275\u0275text(21, "Separador: Tabulaci\xF3n (Tab)");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(22, "label", 37);
    \u0275\u0275element(23, "lucide-angular", 38);
    \u0275\u0275elementStart(24, "span", 29);
    \u0275\u0275text(25, "Importar CSV/Excel");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "span", 30);
    \u0275\u0275text(27, "Importar");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "input", 39);
    \u0275\u0275listener("change", function HeaderConfigurationComponent_Conditional_51_Template_input_change_28_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r4 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r4.onFileSelected($event));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(29, HeaderConfigurationComponent_Conditional_51_Conditional_29_Template, 6, 2, "div", 40);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(30, HeaderConfigurationComponent_Conditional_51_Conditional_30_Template, 10, 6);
    \u0275\u0275conditionalCreate(31, HeaderConfigurationComponent_Conditional_51_Conditional_31_Template, 9, 2, "div", 41);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(32, "div")(33, "div", 23);
    \u0275\u0275conditionalCreate(34, HeaderConfigurationComponent_Conditional_51_Conditional_34_Template, 5, 1, "div", 42)(35, HeaderConfigurationComponent_Conditional_51_Conditional_35_Template, 21, 0, "div", 43);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r4 = \u0275\u0275nextContext();
    \u0275\u0275advance(7);
    \u0275\u0275property("size", 16);
    \u0275\u0275advance(5);
    \u0275\u0275property("name", ctx_r4.downloadMenuOpen() ? "chevron-up" : "chevron-down")("size", 14);
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("ngModel", ctx_r4.csvSeparator);
    \u0275\u0275advance(10);
    \u0275\u0275property("size", 16);
    \u0275\u0275advance(6);
    \u0275\u0275conditional(ctx_r4.previewHeaders().length > 0 ? 29 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r4.downloadMenuOpen() ? 30 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r4.previewHeaders().length > 0 ? 31 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r4.previewHeaders().length === 0 ? 34 : 35);
  }
}
function HeaderConfigurationComponent_Conditional_52_For_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 15);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const field_r12 = ctx.$implicit;
    \u0275\u0275property("value", field_r12.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2(" ", field_r12.fieldName, " (", field_r12.fieldCode, ") ");
  }
}
function HeaderConfigurationComponent_Conditional_52_Conditional_27_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 9)(1, "span", 113);
    \u0275\u0275text(2, "Descripci\xF3n:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const selectedField_r13 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", selectedField_r13.description, " ");
  }
}
function HeaderConfigurationComponent_Conditional_52_Conditional_27_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 9)(1, "span", 113);
    \u0275\u0275text(2, "Formato del Sistema:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "code", 114);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const selectedField_r13 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(selectedField_r13.format);
  }
}
function HeaderConfigurationComponent_Conditional_52_Conditional_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 96)(1, "p", 111);
    \u0275\u0275text(2, "\u{1F4CB} Informaci\xF3n del Cat\xE1logo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 5)(4, "span", 9);
    \u0275\u0275text(5, "Tipo de Dato:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span", 112);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(8, HeaderConfigurationComponent_Conditional_52_Conditional_27_Conditional_8_Template, 4, 1, "div", 9);
    \u0275\u0275conditionalCreate(9, HeaderConfigurationComponent_Conditional_52_Conditional_27_Conditional_9_Template, 5, 1, "div", 9);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const selectedField_r13 = ctx;
    const ctx_r4 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(6);
    \u0275\u0275classMap(ctx_r4.getDataTypeBadgeClass(selectedField_r13.dataType));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", selectedField_r13.dataType, " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(selectedField_r13.description ? 8 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(selectedField_r13.format ? 9 : -1);
  }
}
function HeaderConfigurationComponent_Conditional_52_Conditional_28_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div")(1, "label", 92);
    \u0275\u0275element(2, "lucide-angular", 115);
    \u0275\u0275text(3, " Tipo de Dato * ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "select", 94);
    \u0275\u0275twoWayListener("ngModelChange", function HeaderConfigurationComponent_Conditional_52_Conditional_28_Template_select_ngModelChange_4_listener($event) {
      \u0275\u0275restoreView(_r14);
      const ctx_r4 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r4.formData.dataType, $event) || (ctx_r4.formData.dataType = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(5, "option", 116);
    \u0275\u0275text(6, "TEXTO");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "option", 117);
    \u0275\u0275text(8, "NUMERICO");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "option", 118);
    \u0275\u0275text(10, "FECHA");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "p", 95);
    \u0275\u0275text(12, " Seleccione el tipo de dato para este campo personalizado. ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r4 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 16);
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("ngModel", ctx_r4.formData.dataType);
  }
}
function HeaderConfigurationComponent_Conditional_52_Conditional_60_For_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 15);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const header_r16 = ctx.$implicit;
    \u0275\u0275property("value", header_r16.headerName);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2(" ", header_r16.headerName, " - ", header_r16.displayLabel, " ");
  }
}
function HeaderConfigurationComponent_Conditional_52_Conditional_60_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 125);
    \u0275\u0275text(1, "*");
    \u0275\u0275elementEnd();
  }
}
function HeaderConfigurationComponent_Conditional_52_Conditional_60_Template(rf, ctx) {
  if (rf & 1) {
    const _r15 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p", 119);
    \u0275\u0275text(1, " Si este campo se deriva de otro campo mediante regex, config\xFAralo aqu\xED.");
    \u0275\u0275element(2, "br");
    \u0275\u0275text(3, " Ejemplo: extraer documento desde IDENTITY_CODE. ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 120)(5, "div")(6, "label", 92);
    \u0275\u0275element(7, "lucide-angular", 121);
    \u0275\u0275text(8, " Campo Origen ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "select", 122);
    \u0275\u0275twoWayListener("ngModelChange", function HeaderConfigurationComponent_Conditional_52_Conditional_60_Template_select_ngModelChange_9_listener($event) {
      \u0275\u0275restoreView(_r15);
      const ctx_r4 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r4.formData.sourceField, $event) || (ctx_r4.formData.sourceField = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(10, "option", 123);
    \u0275\u0275text(11, "Seleccione un campo origen...");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(12, HeaderConfigurationComponent_Conditional_52_Conditional_60_For_13_Template, 2, 3, "option", 15, _forTrack1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "p", 95);
    \u0275\u0275text(15, " Campo desde donde se extraer\xE1 el valor mediante regex. ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "div")(17, "label", 92);
    \u0275\u0275element(18, "lucide-angular", 124);
    \u0275\u0275text(19, " Patr\xF3n Regex ");
    \u0275\u0275conditionalCreate(20, HeaderConfigurationComponent_Conditional_52_Conditional_60_Conditional_20_Template, 2, 0, "span", 125);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "input", 126);
    \u0275\u0275twoWayListener("ngModelChange", function HeaderConfigurationComponent_Conditional_52_Conditional_60_Template_input_ngModelChange_21_listener($event) {
      \u0275\u0275restoreView(_r15);
      const ctx_r4 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r4.formData.regexPattern, $event) || (ctx_r4.formData.regexPattern = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "p", 95);
    \u0275\u0275text(23, " Ejemplos: ");
    \u0275\u0275elementStart(24, "code", 127);
    \u0275\u0275text(25);
    \u0275\u0275elementEnd();
    \u0275\u0275text(26, " \xFAltimos 8 \u2022 ");
    \u0275\u0275elementStart(27, "code", 127);
    \u0275\u0275text(28);
    \u0275\u0275elementEnd();
    \u0275\u0275text(29, " 8 d\xEDgitos ");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r4 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(7);
    \u0275\u0275property("size", 16);
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("ngModel", ctx_r4.formData.sourceField);
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r4.availableSourceHeaders());
    \u0275\u0275advance(6);
    \u0275\u0275property("size", 16);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r4.formData.sourceField && ctx_r4.formData.sourceField.trim() !== "" ? 20 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("placeholder", \u0275\u0275interpolate1("Ej: .", 8, "$ (\xFAltimos 8 caracteres)"));
    \u0275\u0275twoWayProperty("ngModel", ctx_r4.formData.regexPattern);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(".", 8, "$");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("\\d", 8);
  }
}
function HeaderConfigurationComponent_Conditional_52_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 22)(1, "div", 80)(2, "div", 81)(3, "div", 82)(4, "div", 83)(5, "div", 84);
    \u0275\u0275element(6, "lucide-angular", 85);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "div")(8, "h2", 86);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "p", 87);
    \u0275\u0275text(11, "Complete la informaci\xF3n de la cabecera");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(12, "button", 88);
    \u0275\u0275listener("click", function HeaderConfigurationComponent_Conditional_52_Template_button_click_12_listener() {
      \u0275\u0275restoreView(_r11);
      const ctx_r4 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r4.closeManualDialog());
    });
    \u0275\u0275element(13, "lucide-angular", 89);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(14, "div", 90)(15, "div", 91)(16, "div")(17, "label", 92);
    \u0275\u0275element(18, "lucide-angular", 93);
    \u0275\u0275text(19, " Campo Base de Datos (Opcional) ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "select", 94);
    \u0275\u0275twoWayListener("ngModelChange", function HeaderConfigurationComponent_Conditional_52_Template_select_ngModelChange_20_listener($event) {
      \u0275\u0275restoreView(_r11);
      const ctx_r4 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r4.formData.fieldDefinitionId, $event) || (ctx_r4.formData.fieldDefinitionId = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function HeaderConfigurationComponent_Conditional_52_Template_select_ngModelChange_20_listener() {
      \u0275\u0275restoreView(_r11);
      const ctx_r4 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r4.onFieldDefinitionSelect());
    });
    \u0275\u0275elementStart(21, "option", 15);
    \u0275\u0275text(22, "Sin asociar - Campo personalizado");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(23, HeaderConfigurationComponent_Conditional_52_For_24_Template, 2, 3, "option", 15, _forTrack0);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "p", 95);
    \u0275\u0275text(26, ' Seleccione un campo del cat\xE1logo o deje "Sin asociar" para crear un campo personalizado. ');
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(27, HeaderConfigurationComponent_Conditional_52_Conditional_27_Template, 10, 5, "div", 96);
    \u0275\u0275conditionalCreate(28, HeaderConfigurationComponent_Conditional_52_Conditional_28_Template, 13, 2, "div");
    \u0275\u0275elementStart(29, "div")(30, "label", 92);
    \u0275\u0275element(31, "lucide-angular", 97);
    \u0275\u0275text(32, " Campo Sistema * ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "input", 98);
    \u0275\u0275twoWayListener("ngModelChange", function HeaderConfigurationComponent_Conditional_52_Template_input_ngModelChange_33_listener($event) {
      \u0275\u0275restoreView(_r11);
      const ctx_r4 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r4.formData.headerName, $event) || (ctx_r4.formData.headerName = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(34, "p", 95);
    \u0275\u0275text(35, " Nombre de la cabecera tal como viene del proveedor. ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(36, "div")(37, "label", 92);
    \u0275\u0275element(38, "lucide-angular", 99);
    \u0275\u0275text(39, " Etiqueta Visual * ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(40, "input", 100);
    \u0275\u0275twoWayListener("ngModelChange", function HeaderConfigurationComponent_Conditional_52_Template_input_ngModelChange_40_listener($event) {
      \u0275\u0275restoreView(_r11);
      const ctx_r4 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r4.formData.displayLabel, $event) || (ctx_r4.formData.displayLabel = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(41, "p", 95);
    \u0275\u0275text(42, " Texto que se mostrar\xE1 en la interfaz de usuario. ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(43, "div")(44, "label", 92);
    \u0275\u0275element(45, "lucide-angular", 101);
    \u0275\u0275text(46, " Formato ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(47, "input", 102);
    \u0275\u0275twoWayListener("ngModelChange", function HeaderConfigurationComponent_Conditional_52_Template_input_ngModelChange_47_listener($event) {
      \u0275\u0275restoreView(_r11);
      const ctx_r4 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r4.formData.format, $event) || (ctx_r4.formData.format = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(48, "p", 95);
    \u0275\u0275text(49, " Formato espec\xEDfico para esta subcartera (opcional, puede diferir del formato del sistema). ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(50, "div", 83)(51, "input", 103);
    \u0275\u0275twoWayListener("ngModelChange", function HeaderConfigurationComponent_Conditional_52_Template_input_ngModelChange_51_listener($event) {
      \u0275\u0275restoreView(_r11);
      const ctx_r4 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r4.formData.required, $event) || (ctx_r4.formData.required = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(52, "label", 104);
    \u0275\u0275text(53, " Campo obligatorio ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(54, "div", 105)(55, "button", 106);
    \u0275\u0275listener("click", function HeaderConfigurationComponent_Conditional_52_Template_button_click_55_listener() {
      \u0275\u0275restoreView(_r11);
      const ctx_r4 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r4.showTransformSection.set(!ctx_r4.showTransformSection()));
    });
    \u0275\u0275elementStart(56, "div", 5);
    \u0275\u0275element(57, "lucide-angular", 107);
    \u0275\u0275text(58, " Transformaci\xF3n de Campo (Opcional) ");
    \u0275\u0275elementEnd();
    \u0275\u0275element(59, "lucide-angular", 31);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(60, HeaderConfigurationComponent_Conditional_52_Conditional_60_Template, 30, 9);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(61, "div", 108)(62, "button", 109);
    \u0275\u0275listener("click", function HeaderConfigurationComponent_Conditional_52_Template_button_click_62_listener() {
      \u0275\u0275restoreView(_r11);
      const ctx_r4 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r4.closeManualDialog());
    });
    \u0275\u0275text(63, " Cancelar ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(64, "button", 110);
    \u0275\u0275listener("click", function HeaderConfigurationComponent_Conditional_52_Template_button_click_64_listener() {
      \u0275\u0275restoreView(_r11);
      const ctx_r4 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r4.saveManualHeader());
    });
    \u0275\u0275text(65);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    let tmp_8_0;
    const ctx_r4 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275property("size", 20);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("", ctx_r4.editingIndex() !== null ? "Editar" : "Agregar", " Cabecera");
    \u0275\u0275advance(4);
    \u0275\u0275property("size", 20);
    \u0275\u0275advance(5);
    \u0275\u0275property("size", 16);
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("ngModel", ctx_r4.formData.fieldDefinitionId);
    \u0275\u0275advance();
    \u0275\u0275property("value", 0);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r4.availableFieldDefinitions());
    \u0275\u0275advance(4);
    \u0275\u0275conditional((tmp_8_0 = ctx_r4.getSelectedFieldDefinition()) ? 27 : -1, tmp_8_0);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r4.formData.fieldDefinitionId === 0 ? 28 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275property("size", 16);
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("ngModel", ctx_r4.formData.headerName);
    \u0275\u0275advance(5);
    \u0275\u0275property("size", 16);
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("ngModel", ctx_r4.formData.displayLabel);
    \u0275\u0275advance(5);
    \u0275\u0275property("size", 16);
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("ngModel", ctx_r4.formData.format);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r4.formData.required);
    \u0275\u0275advance(6);
    \u0275\u0275property("size", 16);
    \u0275\u0275advance(2);
    \u0275\u0275property("name", ctx_r4.showTransformSection() ? "chevron-up" : "chevron-down")("size", 16);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r4.showTransformSection() ? 60 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275property("disabled", !ctx_r4.canSaveManualHeader());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r4.editingIndex() !== null ? "Actualizar" : "Agregar", " ");
  }
}
var _HeaderConfigurationComponent = class _HeaderConfigurationComponent {
  constructor(headerConfigService, fieldDefinitionService, typificationService, portfolioService) {
    this.headerConfigService = headerConfigService;
    this.fieldDefinitionService = fieldDefinitionService;
    this.typificationService = typificationService;
    this.portfolioService = portfolioService;
    this.tenants = signal([], ...ngDevMode ? [{ debugName: "tenants" }] : []);
    this.portfolios = signal([], ...ngDevMode ? [{ debugName: "portfolios" }] : []);
    this.subPortfolios = signal([], ...ngDevMode ? [{ debugName: "subPortfolios" }] : []);
    this.fieldDefinitions = signal([], ...ngDevMode ? [{ debugName: "fieldDefinitions" }] : []);
    this.previewHeaders = signal([], ...ngDevMode ? [{ debugName: "previewHeaders" }] : []);
    this.showManualDialog = signal(false, ...ngDevMode ? [{ debugName: "showManualDialog" }] : []);
    this.editingIndex = signal(null, ...ngDevMode ? [{ debugName: "editingIndex" }] : []);
    this.downloadMenuOpen = signal(false, ...ngDevMode ? [{ debugName: "downloadMenuOpen" }] : []);
    this.showTransformSection = signal(false, ...ngDevMode ? [{ debugName: "showTransformSection" }] : []);
    this.dropdownPosition = signal({ top: 120, left: 100 }, ...ngDevMode ? [{ debugName: "dropdownPosition" }] : []);
    this.headersAreSaved = signal(false, ...ngDevMode ? [{ debugName: "headersAreSaved" }] : []);
    this.availableFieldDefinitions = computed(() => {
      const usedIds = this.previewHeaders().map((h) => h.fieldDefinitionId);
      const currentId = this.formData.fieldDefinitionId;
      const editIdx = this.editingIndex();
      return this.fieldDefinitions().filter((f) => {
        if (editIdx !== null && f.id === currentId) {
          return true;
        }
        return !usedIds.includes(f.id);
      });
    }, ...ngDevMode ? [{ debugName: "availableFieldDefinitions" }] : []);
    this.availableSourceHeaders = computed(() => {
      const currentHeaderName = this.formData.headerName;
      return this.previewHeaders().filter((h) => {
        if (h.sourceField && h.regexPattern) {
          return false;
        }
        if (h.headerName === currentHeaderName) {
          return false;
        }
        return true;
      });
    }, ...ngDevMode ? [{ debugName: "availableSourceHeaders" }] : []);
    this.selectedTenantId = 0;
    this.selectedPortfolioId = 0;
    this.selectedSubPortfolioId = 0;
    this.selectedLoadType = "ACTUALIZACION";
    this.csvSeparator = ";";
    this.formData = {
      fieldDefinitionId: 0,
      headerName: "",
      dataType: "TEXTO",
      displayLabel: "",
      format: "",
      required: false,
      sourceField: "",
      regexPattern: ""
    };
  }
  ngOnInit() {
    this.loadTenants();
    this.loadFieldDefinitions();
  }
  loadFieldDefinitions() {
    this.fieldDefinitionService.getAllActive().subscribe({
      next: (definitions) => {
        this.fieldDefinitions.set(definitions);
      },
      error: (error) => {
        console.error("Error al cargar definiciones de campos:", error);
      }
    });
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
    this.previewHeaders.set([]);
    if (this.selectedTenantId > 0) {
      this.loadPortfolios();
    }
  }
  onPortfolioChange() {
    this.selectedSubPortfolioId = 0;
    this.subPortfolios.set([]);
    this.previewHeaders.set([]);
    if (this.selectedPortfolioId > 0) {
      this.loadSubPortfolios();
    }
  }
  onSubPortfolioChange() {
    this.previewHeaders.set([]);
    this.headersAreSaved.set(false);
    if (this.selectedSubPortfolioId > 0) {
      this.loadExistingHeaders();
    }
  }
  onLoadTypeChange() {
    this.previewHeaders.set([]);
    this.headersAreSaved.set(false);
    if (this.selectedSubPortfolioId > 0) {
      this.loadExistingHeaders();
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
    this.portfolioService.getSubPortfoliosByPortfolio(this.selectedPortfolioId).subscribe({
      next: (subPortfolios) => {
        this.subPortfolios.set(subPortfolios);
      },
      error: (error) => {
        console.error("Error loading subportfolios:", error);
      }
    });
  }
  loadExistingHeaders() {
    this.headerConfigService.getBySubPortfolioAndLoadType(this.selectedSubPortfolioId, this.selectedLoadType).subscribe({
      next: (headers) => {
        const items = headers.map((h) => ({
          fieldDefinitionId: h.fieldDefinitionId,
          headerName: h.headerName,
          dataType: h.dataType,
          displayLabel: h.displayLabel,
          format: h.format,
          required: h.required,
          sourceField: h.sourceField,
          regexPattern: h.regexPattern
        }));
        this.previewHeaders.set(items);
        this.headersAreSaved.set(headers.length > 0);
      },
      error: (error) => {
        console.error("Error loading headers:", error);
        this.headersAreSaved.set(false);
      }
    });
  }
  openManualDialog() {
    this.editingIndex.set(null);
    this.formData = {
      fieldDefinitionId: 0,
      headerName: "",
      dataType: "TEXTO",
      displayLabel: "",
      format: "",
      required: false,
      sourceField: "",
      regexPattern: ""
    };
    this.showTransformSection.set(false);
    this.showManualDialog.set(true);
  }
  onFieldDefinitionSelect() {
    const selectedId = this.formData.fieldDefinitionId;
    if (selectedId === 0) {
      this.formData.dataType = "TEXTO";
      return;
    }
    const selectedField = this.fieldDefinitions().find((f) => f.id === selectedId);
    if (selectedField) {
      this.formData.dataType = selectedField.dataType;
    }
  }
  getSelectedFieldDefinition() {
    const selectedId = this.formData.fieldDefinitionId;
    if (selectedId === 0)
      return null;
    return this.fieldDefinitions().find((f) => f.id === selectedId);
  }
  closeManualDialog() {
    this.showManualDialog.set(false);
    this.editingIndex.set(null);
  }
  canSaveManualHeader() {
    if (!this.formData.headerName.trim() || !this.formData.displayLabel.trim()) {
      return false;
    }
    if (this.formData.sourceField && this.formData.sourceField.trim() !== "") {
      if (!this.formData.regexPattern || this.formData.regexPattern.trim() === "") {
        return false;
      }
    }
    if (this.formData.fieldDefinitionId === 0) {
      return !!this.formData.dataType && ["TEXTO", "NUMERICO", "FECHA"].includes(this.formData.dataType);
    }
    return true;
  }
  saveManualHeader() {
    if (!this.canSaveManualHeader())
      return;
    const newHeader = {
      fieldDefinitionId: this.formData.fieldDefinitionId,
      headerName: this.formData.headerName.trim(),
      dataType: this.formData.dataType,
      displayLabel: this.formData.displayLabel.trim(),
      format: this.formData.format?.trim() || void 0,
      required: this.formData.required,
      sourceField: this.formData.sourceField?.trim() || void 0,
      regexPattern: this.formData.regexPattern?.trim() || void 0
    };
    const currentHeaders = [...this.previewHeaders()];
    const editIdx = this.editingIndex();
    if (editIdx !== null) {
      currentHeaders[editIdx] = newHeader;
    } else {
      currentHeaders.push(newHeader);
    }
    this.previewHeaders.set(currentHeaders);
    this.closeManualDialog();
  }
  editPreviewHeader(index) {
    const header = this.previewHeaders()[index];
    this.editingIndex.set(index);
    this.formData = {
      fieldDefinitionId: header.fieldDefinitionId,
      headerName: header.headerName,
      dataType: header.dataType,
      displayLabel: header.displayLabel,
      format: header.format || "",
      required: header.required || false,
      sourceField: header.sourceField || "",
      regexPattern: header.regexPattern || ""
    };
    this.showTransformSection.set(!!(header.sourceField || header.regexPattern));
    this.showManualDialog.set(true);
  }
  removePreviewHeader(index) {
    const currentHeaders = [...this.previewHeaders()];
    currentHeaders.splice(index, 1);
    this.previewHeaders.set(currentHeaders);
  }
  clearAll() {
    if (confirm("\xBFEst\xE1 seguro de limpiar todas las cabeceras? Esta acci\xF3n no se puede deshacer.")) {
      this.previewHeaders.set([]);
    }
  }
  confirmConfiguration() {
    if (this.previewHeaders().length === 0) {
      alert("No hay cabeceras para confirmar");
      return;
    }
    if (!confirm(`\xBFConfirmar la configuraci\xF3n de ${this.previewHeaders().length} cabeceras?`)) {
      return;
    }
    const request = {
      subPortfolioId: this.selectedSubPortfolioId,
      loadType: this.selectedLoadType,
      headers: this.previewHeaders()
    };
    this.headerConfigService.deleteAllBySubPortfolioAndLoadType(this.selectedSubPortfolioId, this.selectedLoadType).subscribe({
      next: () => {
        this.headerConfigService.createBulk(request).subscribe({
          next: () => {
            alert("Configuraci\xF3n guardada exitosamente");
            this.loadExistingHeaders();
          },
          error: (error) => {
            console.error("Error saving configuration:", error);
            alert("Error al guardar la configuraci\xF3n: " + (error.error?.message || error.message));
          }
        });
      },
      error: (error) => {
        console.error("Error deleting old configuration:", error);
        alert("Error al eliminar configuraci\xF3n anterior");
      }
    });
  }
  onFileSelected(event) {
    const file = event.target.files[0];
    if (!file)
      return;
    const fileName = file.name.toLowerCase();
    const isExcel = fileName.endsWith(".xlsx") || fileName.endsWith(".xls");
    if (isExcel) {
      this.parseExcel(file);
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        const csv = e.target.result;
        this.parseCSV(csv);
      };
      reader.readAsText(file);
    }
    event.target.value = "";
  }
  /**
   * Parsea un archivo Excel (.xlsx o .xls)
   */
  parseExcel(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        if (!window.XLSX) {
          alert("Cargando soporte para Excel... intente nuevamente en unos segundos.");
          this.loadXLSXLibrary().then(() => {
            this.parseExcel(file);
          });
          return;
        }
        const XLSX = window.XLSX;
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const csvData = XLSX.utils.sheet_to_csv(worksheet, {
          FS: this.csvSeparator
        });
        this.parseCSV(csvData);
      } catch (error) {
        console.error("Error al procesar Excel:", error);
        alert("Error al procesar el archivo Excel. Verifique que el formato sea correcto.");
      }
    };
    reader.readAsArrayBuffer(file);
  }
  /**
   * Carga la librería XLSX desde CDN si no está disponible
   */
  loadXLSXLibrary() {
    return new Promise((resolve, reject) => {
      if (window.XLSX) {
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.src = "https://cdn.sheetjs.com/xlsx-0.20.1/package/dist/xlsx.full.min.js";
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("No se pudo cargar la librer\xEDa XLSX"));
      document.head.appendChild(script);
    });
  }
  /**
   * Parsea una línea CSV respetando comillas dobles
   * Los separadores dentro de comillas no se consideran delimitadores
   * Ejemplo: "DECIMAL(10,2)" se mantiene como un solo campo aunque contenga coma
   */
  parseCsvLine(line, separator) {
    const result = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === separator && !inQuotes) {
        result.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result.map((field) => {
      if (field.startsWith('"') && field.endsWith('"')) {
        return field.slice(1, -1);
      }
      return field;
    });
  }
  parseCSV(csv) {
    const lines = csv.split("\n").filter((line) => line.trim());
    if (lines.length < 2) {
      alert("El archivo CSV est\xE1 vac\xEDo o no tiene datos");
      return;
    }
    const headers = [];
    for (let i = 1; i < lines.length; i++) {
      const columns = this.parseCsvLine(lines[i], this.csvSeparator);
      if (columns.length < 3)
        continue;
      const [fieldCode, headerName, displayLabel, format, tipoDato, obligatorio, campoAsociado, regEx] = columns;
      if (!headerName || !displayLabel)
        continue;
      const isRequired = obligatorio ? obligatorio === "1" || obligatorio.toLowerCase() === "true" : void 0;
      let cleanRegex = regEx?.trim();
      if (cleanRegex) {
        if (cleanRegex.startsWith('"') && cleanRegex.endsWith('"')) {
          cleanRegex = cleanRegex.slice(1, -1);
        }
      }
      if (!fieldCode || fieldCode.trim() === "") {
        if (!tipoDato || !["TEXTO", "NUMERICO", "FECHA"].includes(tipoDato.toUpperCase())) {
          alert(`Campo personalizado en l\xEDnea ${i + 1} requiere un tipo de dato v\xE1lido (TEXTO, NUMERICO, FECHA)`);
          return;
        }
        headers.push({
          fieldDefinitionId: 0,
          // Sin asociar a BD
          headerName: headerName.trim(),
          dataType: tipoDato.toUpperCase(),
          displayLabel: displayLabel.trim(),
          format: format?.trim() || void 0,
          required: isRequired,
          sourceField: campoAsociado?.trim() || void 0,
          regexPattern: cleanRegex || void 0
        });
      } else {
        const fieldDef = this.fieldDefinitions().find((f) => f.fieldCode === fieldCode.trim());
        if (!fieldDef) {
          alert(`C\xF3digo de campo no encontrado en l\xEDnea ${i + 1}: ${fieldCode}. Revise el cat\xE1logo de campos.`);
          return;
        }
        headers.push({
          fieldDefinitionId: fieldDef.id,
          headerName: headerName.trim(),
          dataType: fieldDef.dataType,
          displayLabel: displayLabel.trim(),
          format: format?.trim() || void 0,
          required: isRequired !== void 0 ? isRequired : true,
          // Usar el valor del CSV o true por defecto
          sourceField: campoAsociado?.trim() || void 0,
          regexPattern: cleanRegex || void 0
        });
      }
    }
    if (headers.length === 0) {
      alert("No se encontraron cabeceras v\xE1lidas en el archivo CSV");
      return;
    }
    this.previewHeaders.set(headers);
    alert(`Se importaron ${headers.length} cabeceras exitosamente`);
  }
  toggleDownloadMenu() {
    this.downloadMenuOpen.update((v) => !v);
    if (this.downloadMenuOpen() && this.downloadButton) {
      const rect = this.downloadButton.nativeElement.getBoundingClientRect();
      this.dropdownPosition.set({
        top: rect.bottom + 8,
        left: rect.left
      });
    }
  }
  /**
   * Escapa un valor para CSV: si contiene el separador, comillas o saltos de línea,
   * lo envuelve en comillas dobles y escapa las comillas internas
   */
  escapeCsvValue(value, separator) {
    if (!value)
      return "";
    if (value.includes(separator) || value.includes('"') || value.includes("\n") || value.includes("\r")) {
      const escaped = value.replace(/"/g, '""');
      return `"${escaped}"`;
    }
    return value;
  }
  /**
   * Crea una fila CSV escapando correctamente los valores
   */
  createCsvRow(values, separator) {
    return values.map((v) => this.escapeCsvValue(v, separator)).join(separator);
  }
  downloadCSVTemplate() {
    this.downloadMenuOpen.set(false);
    const sep = this.csvSeparator;
    let rows;
    if (this.previewHeaders().length > 0) {
      rows = [
        ["codigoCampo", "nombreCabecera", "etiquetaVisual", "formato", "tipoDato", "obligatorio", "campoAsociado", "regEx"]
      ];
      this.previewHeaders().forEach((header) => {
        const fieldDef = this.fieldDefinitions().find((fd) => fd.id === header.fieldDefinitionId);
        const codigoCampo = fieldDef ? fieldDef.fieldCode : "";
        rows.push([
          codigoCampo,
          header.headerName,
          header.displayLabel,
          header.format || "",
          header.dataType || "",
          header.required ? "1" : "0",
          header.sourceField || "",
          header.regexPattern || ""
          // Este será procesado especialmente al crear el CSV
        ]);
      });
    } else {
      rows = [
        ["codigoCampo", "nombreCabecera", "etiquetaVisual", "formato", "tipoDato", "obligatorio", "campoAsociado", "regEx"],
        ["documento", "DNI", "N\xFAmero de Documento", "", "TEXTO", "1", "", ""],
        ["nombre_completo", "NOMBRE", "Nombre del Cliente", "", "TEXTO", "1", "", ""],
        ["telefono_principal", "TELEFONO", "Tel\xE9fono Principal", "", "TEXTO", "0", "", ""],
        ["email", "CORREO", "Correo Electr\xF3nico", "", "TEXTO", "0", "", ""],
        ["monto_capital", "MONTO_CAPITAL", "Monto Capital (S/.)", "decimal(18,2)", "NUMERICO", "1", "", ""],
        ["fecha_vencimiento", "FEC_VENC", "Fecha de Vencimiento", "dd/MM/yyyy", "FECHA", "1", "", ""],
        ["", "DOCUMENTO_EXTRAIDO", "Documento Extra\xEDdo", "", "TEXTO", "0", "DNI", '"^D.*?(\\d{7})$|^C.*?(\\d{8})$"']
      ];
    }
    const csvLines = rows.map((row, index) => {
      if (index === 0) {
        return this.createCsvRow(row, sep);
      }
      const firstSevenFields = row.slice(0, 7);
      const regexField = row[7] || "";
      let csvRow = this.createCsvRow(firstSevenFields, sep);
      if (regexField && regexField.trim() !== "") {
        const escapedRegex = regexField.replace(/"/g, '""');
        csvRow += sep + `"${escapedRegex}"`;
      } else {
        csvRow += sep;
      }
      return csvRow;
    });
    const csvContent = csvLines.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    const separatorName = this.csvSeparator === "," ? "coma" : this.csvSeparator === ";" ? "punto-coma" : this.csvSeparator === "|" ? "pipe" : "tab";
    const fileName = this.previewHeaders().length > 0 ? `header-configuration-actual-${separatorName}.csv` : `header-configuration-template-${separatorName}.csv`;
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    const message = this.previewHeaders().length > 0 ? "Configuraci\xF3n actual descargada exitosamente" : "Plantilla CSV descargada exitosamente";
    alert(message);
  }
  downloadExcelTemplate() {
    return __async(this, null, function* () {
      this.downloadMenuOpen.set(false);
      if (!window.XLSX) {
        try {
          yield this.loadXLSXLibrary();
        } catch (error) {
          alert("No se pudo cargar el soporte para Excel. Intente de nuevo.");
          return;
        }
      }
      const XLSX = window.XLSX;
      const data = [
        ["codigoCampo", "nombreCabecera", "etiquetaVisual", "formato", "tipoDato"],
        ["documento", "DNI", "N\xFAmero de Documento", "", ""],
        ["nombre_completo", "NOMBRE", "Nombre del Cliente", "", ""],
        ["telefono_principal", "TELEFONO", "Tel\xE9fono Principal", "", ""],
        ["email", "CORREO", "Correo Electr\xF3nico", "", ""],
        ["direccion", "DIRECCION", "Direcci\xF3n Completa", "", ""],
        ["distrito", "DISTRITO", "Distrito", "", ""],
        ["provincia", "PROVINCIA", "Provincia", "", ""],
        ["numero_contrato", "NRO_CONTRATO", "N\xFAmero de Contrato", "", ""],
        ["tipo_producto", "PRODUCTO", "Tipo de Producto", "", ""],
        ["estado_cuenta", "ESTADO", "Estado de Cuenta", "", ""],
        ["monto_capital", "MONTO_CAPITAL", "Monto Capital (S/.)", "decimal(18,2)", ""],
        ["monto_interes", "INTERES", "Inter\xE9s (S/.)", "decimal(18,2)", ""],
        ["saldo_pendiente", "SALDO", "Saldo Pendiente (S/.)", "decimal(18,2)", ""],
        ["monto_mora", "MORA", "Monto Mora (S/.)", "decimal(18,2)", ""],
        ["dias_mora", "DIAS_MORA", "D\xEDas de Mora", "", ""],
        ["monto_minimo_pagar", "PAGO_MINIMO", "Monto M\xEDnimo a Pagar (S/.)", "decimal(18,2)", ""],
        ["fecha_vencimiento", "FEC_VENC", "Fecha de Vencimiento", "dd/MM/yyyy", ""],
        ["fecha_desembolso", "FEC_DESEMB", "Fecha de Desembolso", "dd/MM/yyyy", ""],
        ["fecha_proximo_vencimiento", "FEC_PROX_VENC", "Fecha Pr\xF3ximo Vencimiento", "dd/MM/yyyy", ""],
        ["fecha_corte", "FEC_CORTE", "Fecha de Corte", "dd/MM/yyyy", ""],
        ["", "CAMPO_PERSONALIZADO", "Ejemplo Campo Extra", "", "TEXTO"]
      ];
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(data);
      ws["!cols"] = [
        { wch: 25 },
        // codigoCampo
        { wch: 20 },
        // nombreCabecera
        { wch: 30 },
        // etiquetaVisual
        { wch: 20 },
        // formato
        { wch: 15 }
        // tipoDato
      ];
      XLSX.utils.book_append_sheet(wb, ws, "Configuraci\xF3n Cabeceras");
      XLSX.writeFile(wb, "header-configuration-template.xlsx");
      alert("Modelo Excel descargado exitosamente");
    });
  }
  getDataTypeBadgeClass(dataType) {
    switch (dataType) {
      case "TEXTO":
        return "bg-blue-900/30 text-blue-400";
      case "NUMERICO":
        return "bg-emerald-900/30 text-emerald-400";
      case "FECHA":
        return "bg-amber-900/30 text-amber-400";
      default:
        return "bg-gray-900/30 text-gray-400";
    }
  }
  getFieldCodeById(fieldDefinitionId) {
    const field = this.fieldDefinitions().find((f) => f.id === fieldDefinitionId);
    return field ? field.fieldCode : "-";
  }
};
_HeaderConfigurationComponent.\u0275fac = function HeaderConfigurationComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _HeaderConfigurationComponent)(\u0275\u0275directiveInject(HeaderConfigurationService), \u0275\u0275directiveInject(FieldDefinitionService), \u0275\u0275directiveInject(TypificationService), \u0275\u0275directiveInject(PortfolioService));
};
_HeaderConfigurationComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _HeaderConfigurationComponent, selectors: [["app-header-configuration"]], viewQuery: function HeaderConfigurationComponent_Query(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275viewQuery(_c0, 5, ElementRef);
  }
  if (rf & 2) {
    let _t;
    \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.downloadButton = _t.first);
  }
}, decls: 53, vars: 17, consts: [["downloadButton", ""], [1, "h-[calc(100dvh-56px)]", "bg-slate-950", "overflow-hidden", "flex", "flex-col"], [1, "flex-1", "overflow-y-auto"], [1, "p-3", "max-w-7xl", "mx-auto"], [1, "mb-2"], [1, "flex", "items-center", "gap-2"], [1, "w-8", "h-8", "bg-gradient-to-br", "from-indigo-600", "to-indigo-700", "rounded-lg", "flex", "items-center", "justify-center"], ["name", "table-2", 1, "text-white", 3, "size"], [1, "text-lg", "font-bold", "text-white"], [1, "text-xs", "text-gray-400"], [1, "bg-slate-900", "rounded-lg", "p-2", "shadow-sm", "border", "border-slate-800"], [1, "grid", "grid-cols-1", "md:grid-cols-4", "gap-2"], [1, "block", "text-xs", "font-semibold", "text-gray-300", "mb-1"], ["name", "building-2", 1, "inline", "mr-1", 3, "size"], [1, "w-full", "px-3", "py-1.5", "bg-slate-800", "border", "border-slate-700", "rounded-lg", "text-white", "text-sm", "focus:outline-none", "focus:ring-2", "focus:ring-indigo-500", 3, "ngModelChange", "ngModel"], [3, "value"], ["name", "folder", 1, "inline", "mr-1", 3, "size"], [1, "w-full", "px-3", "py-1.5", "bg-slate-800", "border", "border-slate-700", "rounded-lg", "text-white", "text-sm", "focus:outline-none", "focus:ring-2", "focus:ring-indigo-500", "disabled:opacity-50", "disabled:cursor-not-allowed", 3, "ngModelChange", "ngModel", "disabled"], ["name", "folder-tree", 1, "inline", "mr-1", 3, "size"], ["name", "database", 1, "inline", "mr-1", 3, "size"], ["value", "ACTUALIZACION"], ["value", "INICIAL"], [1, "fixed", "inset-0", "bg-black/80", "backdrop-blur-sm", "flex", "items-center", "justify-center", "z-50", "p-4"], [1, "bg-slate-900", "rounded-lg", "shadow-sm", "border", "border-slate-800", "overflow-hidden"], [1, "p-3"], [1, "flex", "flex-wrap", "items-center", "gap-2", "mb-2"], [1, "relative"], [1, "flex", "items-center", "gap-1.5", "px-3", "py-1.5", "bg-blue-600", "text-white", "rounded-lg", "text-sm", "font-medium", "hover:bg-blue-700", "transition-all", "cursor-pointer", 3, "click"], ["name", "file-text", 3, "size"], [1, "hidden", "sm:inline"], [1, "sm:hidden"], [3, "name", "size"], [1, "px-3", "py-1.5", "bg-slate-800", "border", "border-slate-700", "rounded-lg", "text-white", "text-sm", "focus:outline-none", "focus:ring-2", "focus:ring-emerald-500", "cursor-pointer", 3, "ngModelChange", "ngModel"], ["value", ";"], ["value", ","], ["value", "|"], ["value", "	"], [1, "flex", "items-center", "gap-1.5", "px-3", "py-1.5", "bg-emerald-600", "text-white", "rounded-lg", "text-sm", "font-medium", "hover:bg-emerald-700", "transition-all", "cursor-pointer"], ["name", "folder-open", 3, "size"], ["type", "file", "accept", ".csv,.xlsx,.xls", 1, "hidden", 3, "change"], [1, "ml-auto", "flex", "items-center", "gap-2", "px-3", "py-1.5"], [1, "flex", "flex-wrap", "items-center", "justify-end", "gap-2", "pt-2", "border-t", "border-slate-700"], [1, "p-6", "text-center"], [1, "overflow-x-auto", "max-h-[calc(100dvh-340px)]", "overflow-y-auto"], ["name", "table-2", 1, "text-indigo-400", 3, "size"], [1, "text-sm", "font-semibold", "text-indigo-400"], [1, "text-xs", "text-indigo-400"], [1, "fixed", "inset-0", "z-[9998]", 3, "click"], [1, "fixed", "w-56", "bg-slate-800", "rounded-lg", "shadow-xl", "border", "border-slate-700", "py-1", "z-[9999]"], [1, "w-full", "flex", "items-center", "gap-2", "px-3", "py-2", "hover:bg-slate-700", "transition-colors", "text-left", "text-gray-300", "cursor-pointer", 3, "click"], ["name", "file-text", 1, "text-gray-400", 3, "size"], [1, "text-sm", "font-medium"], ["name", "table-2", 1, "text-green-400", 3, "size"], [1, "flex", "items-center", "gap-1", "px-3", "py-1.5", "bg-slate-800", "text-gray-300", "rounded-lg", "text-sm", "hover:bg-slate-700", "hover:text-white", "transition-all", "cursor-pointer", 3, "click"], ["name", "trash-2", 3, "size"], [1, "flex", "items-center", "gap-1.5", "px-3", "py-1.5", "bg-green-600", "text-white", "rounded-lg", "text-sm", "font-medium", "hover:bg-green-700", "transition-all", "cursor-pointer", 3, "click"], ["name", "save", 3, "size"], [1, "w-12", "h-12", "bg-slate-800", "rounded-full", "flex", "items-center", "justify-center", "mx-auto", "mb-2"], ["name", "table-2", 1, "text-gray-600", 3, "size"], [1, "text-sm", "text-gray-400"], [1, "w-full"], [1, "bg-slate-800", "border-b", "border-slate-700", "sticky", "top-0"], [1, "px-2", "py-1.5", "text-left", "text-xs", "font-semibold", "text-gray-400"], [1, "px-2", "py-1.5", "text-center", "text-xs", "font-semibold", "text-gray-400"], [1, "divide-y", "divide-slate-800"], [1, "hover:bg-slate-800", "transition-colors"], [1, "px-2", "py-1.5"], [1, "flex", "items-center", "gap-1"], [1, "font-mono", "text-xs", "font-semibold", "text-indigo-400"], ["name", "sparkles", 1, "text-amber-400", "flex-shrink-0", 3, "size", "title"], [1, "inline-flex", "px-1.5", "py-0.5", "rounded", "text-xs", "font-medium"], [1, "text-xs", "text-white"], [1, "text-xs", "text-amber-400", "italic"], [1, "font-mono", "text-xs", "text-gray-400"], [1, "px-2", "py-1.5", "text-center"], ["name", "check-circle", 1, "text-green-400", "inline", 3, "size"], ["name", "circle", 1, "text-gray-600", "inline", 3, "size"], ["title", "Editar", 1, "p-1", "text-blue-400", "hover:bg-slate-800", "rounded", "transition-colors", 3, "click"], ["name", "edit", 3, "size"], ["title", "Eliminar", 1, "p-1", "text-red-400", "hover:bg-slate-800", "rounded", "transition-colors", 3, "click"], [1, "bg-slate-900", "rounded-xl", "shadow-2xl", "max-w-2xl", "w-full", "max-h-[90vh]", "overflow-hidden", "border", "border-slate-800"], [1, "bg-gradient-to-r", "from-indigo-600", "to-indigo-700", "p-5", "text-white"], [1, "flex", "items-center", "justify-between"], [1, "flex", "items-center", "gap-3"], [1, "w-10", "h-10", "bg-white/20", "rounded-lg", "flex", "items-center", "justify-center"], ["name", "plus-circle", 3, "size"], [1, "text-xl", "font-bold"], [1, "text-indigo-100", "text-sm"], [1, "text-white/80", "hover:text-white", 3, "click"], ["name", "x", 3, "size"], [1, "p-6", "overflow-y-auto", "max-h-[calc(90vh-200px)]"], [1, "space-y-4"], [1, "block", "text-sm", "font-semibold", "text-gray-300", "mb-2"], ["name", "book-open", 1, "inline", "mr-1", 3, "size"], [1, "w-full", "px-4", "py-2.5", "bg-slate-800", "border", "border-slate-700", "rounded-lg", "text-white", "focus:outline-none", "focus:ring-2", "focus:ring-indigo-500", 3, "ngModelChange", "ngModel"], [1, "text-xs", "text-gray-400", "mt-1"], [1, "bg-slate-800/50", "rounded-lg", "p-4", "space-y-2", "border", "border-slate-700/50"], ["name", "settings", 1, "inline", "mr-1", 3, "size"], ["type", "text", "placeholder", "Ej: DNI, Saldo Vencido, Tel\xE9fono Principal", 1, "w-full", "px-4", "py-2.5", "bg-slate-800", "border", "border-slate-700", "rounded-lg", "text-white", "placeholder-gray-500", "focus:outline-none", "focus:ring-2", "focus:ring-indigo-500", 3, "ngModelChange", "ngModel"], ["name", "eye", 1, "inline", "mr-1", 3, "size"], ["type", "text", "placeholder", "Ej: N\xFAmero de Documento, Saldo Pendiente", 1, "w-full", "px-4", "py-2.5", "bg-slate-800", "border", "border-slate-700", "rounded-lg", "text-white", "placeholder-gray-500", "focus:outline-none", "focus:ring-2", "focus:ring-indigo-500", 3, "ngModelChange", "ngModel"], ["name", "file-text", 1, "inline", "mr-1", 3, "size"], ["type", "text", "placeholder", "Ej: dd/MM/yyyy, decimal(18,2)", 1, "w-full", "px-4", "py-2.5", "bg-slate-800", "border", "border-slate-700", "rounded-lg", "text-white", "placeholder-gray-500", "focus:outline-none", "focus:ring-2", "focus:ring-indigo-500", 3, "ngModelChange", "ngModel"], ["type", "checkbox", "id", "required", 1, "w-4", "h-4", "text-indigo-600", "bg-slate-800", "border-slate-700", "rounded", "focus:ring-indigo-500", 3, "ngModelChange", "ngModel"], ["for", "required", 1, "text-sm", "text-gray-300"], [1, "col-span-2", "border-t", "border-slate-700", "pt-4", "mt-2"], ["type", "button", 1, "w-full", "flex", "items-center", "justify-between", "text-sm", "font-bold", "text-emerald-400", "mb-3", "hover:text-emerald-300", "transition-colors", 3, "click"], ["name", "git-branch", 3, "size"], [1, "border-t", "border-slate-800", "p-4", "flex", "justify-end", "gap-3", "bg-slate-950"], [1, "px-5", "py-2", "text-gray-400", "hover:bg-slate-800", "hover:text-white", "rounded-lg", "font-medium", "transition-colors", 3, "click"], [1, "px-5", "py-2", "bg-gradient-to-r", "from-indigo-600", "to-indigo-700", "text-white", "rounded-lg", "font-semibold", "hover:shadow-lg", "transition-all", "disabled:opacity-50", "disabled:cursor-not-allowed", 3, "click", "disabled"], [1, "text-xs", "font-semibold", "text-gray-400", "mb-2"], [1, "inline-flex", "px-2", "py-0.5", "rounded", "text-xs", "font-medium"], [1, "font-semibold"], [1, "text-cyan-400"], ["name", "type", 1, "inline", "mr-1", 3, "size"], ["value", "TEXTO"], ["value", "NUMERICO"], ["value", "FECHA"], [1, "text-xs", "text-gray-400", "mb-4"], [1, "grid", "grid-cols-1", "gap-4"], ["name", "arrow-right", 1, "inline", "mr-1", 3, "size"], [1, "w-full", "px-4", "py-2.5", "bg-slate-800", "border", "border-slate-700", "rounded-lg", "text-white", "focus:outline-none", "focus:ring-2", "focus:ring-emerald-500", 3, "ngModelChange", "ngModel"], ["value", ""], ["name", "code", 1, "inline", "mr-1", 3, "size"], [1, "text-red-400", "ml-1"], ["type", "text", 1, "w-full", "px-4", "py-2.5", "bg-slate-800", "border", "border-slate-700", "rounded-lg", "text-white", "placeholder-gray-500", "focus:outline-none", "focus:ring-2", "focus:ring-emerald-500", "font-mono", "text-sm", 3, "ngModelChange", "ngModel", "placeholder"], [1, "text-emerald-400"]], template: function HeaderConfigurationComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 1)(1, "div", 2)(2, "div", 3)(3, "div", 4)(4, "div", 5)(5, "div", 6);
    \u0275\u0275element(6, "lucide-angular", 7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "div")(8, "h1", 8);
    \u0275\u0275text(9, "Configuraci\xF3n de Cabeceras");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "p", 9);
    \u0275\u0275text(11, "Define las cabeceras personalizadas por subcartera");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(12, "div", 4)(13, "div", 10)(14, "div", 11)(15, "div")(16, "label", 12);
    \u0275\u0275element(17, "lucide-angular", 13);
    \u0275\u0275text(18, " Proveedor ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "select", 14);
    \u0275\u0275twoWayListener("ngModelChange", function HeaderConfigurationComponent_Template_select_ngModelChange_19_listener($event) {
      \u0275\u0275twoWayBindingSet(ctx.selectedTenantId, $event) || (ctx.selectedTenantId = $event);
      return $event;
    });
    \u0275\u0275listener("ngModelChange", function HeaderConfigurationComponent_Template_select_ngModelChange_19_listener() {
      return ctx.onTenantChange();
    });
    \u0275\u0275elementStart(20, "option", 15);
    \u0275\u0275text(21, "Seleccione un proveedor...");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(22, HeaderConfigurationComponent_For_23_Template, 2, 2, "option", 15, _forTrack0);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(24, "div")(25, "label", 12);
    \u0275\u0275element(26, "lucide-angular", 16);
    \u0275\u0275text(27, " Cartera ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "select", 17);
    \u0275\u0275twoWayListener("ngModelChange", function HeaderConfigurationComponent_Template_select_ngModelChange_28_listener($event) {
      \u0275\u0275twoWayBindingSet(ctx.selectedPortfolioId, $event) || (ctx.selectedPortfolioId = $event);
      return $event;
    });
    \u0275\u0275listener("ngModelChange", function HeaderConfigurationComponent_Template_select_ngModelChange_28_listener() {
      return ctx.onPortfolioChange();
    });
    \u0275\u0275elementStart(29, "option", 15);
    \u0275\u0275text(30, "Seleccione una cartera...");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(31, HeaderConfigurationComponent_For_32_Template, 2, 2, "option", 15, _forTrack0);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(33, "div")(34, "label", 12);
    \u0275\u0275element(35, "lucide-angular", 18);
    \u0275\u0275text(36, " Subcartera ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(37, "select", 17);
    \u0275\u0275twoWayListener("ngModelChange", function HeaderConfigurationComponent_Template_select_ngModelChange_37_listener($event) {
      \u0275\u0275twoWayBindingSet(ctx.selectedSubPortfolioId, $event) || (ctx.selectedSubPortfolioId = $event);
      return $event;
    });
    \u0275\u0275listener("ngModelChange", function HeaderConfigurationComponent_Template_select_ngModelChange_37_listener() {
      return ctx.onSubPortfolioChange();
    });
    \u0275\u0275elementStart(38, "option", 15);
    \u0275\u0275text(39, "Seleccione una subcartera...");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(40, HeaderConfigurationComponent_For_41_Template, 2, 2, "option", 15, _forTrack0);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(42, "div")(43, "label", 12);
    \u0275\u0275element(44, "lucide-angular", 19);
    \u0275\u0275text(45, " Tipo de Carga ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(46, "select", 17);
    \u0275\u0275twoWayListener("ngModelChange", function HeaderConfigurationComponent_Template_select_ngModelChange_46_listener($event) {
      \u0275\u0275twoWayBindingSet(ctx.selectedLoadType, $event) || (ctx.selectedLoadType = $event);
      return $event;
    });
    \u0275\u0275listener("ngModelChange", function HeaderConfigurationComponent_Template_select_ngModelChange_46_listener() {
      return ctx.onLoadTypeChange();
    });
    \u0275\u0275elementStart(47, "option", 20);
    \u0275\u0275text(48, "Carga Diaria");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(49, "option", 21);
    \u0275\u0275text(50, "Carga Inicial del Mes");
    \u0275\u0275elementEnd()()()()()();
    \u0275\u0275conditionalCreate(51, HeaderConfigurationComponent_Conditional_51_Template, 36, 9);
    \u0275\u0275conditionalCreate(52, HeaderConfigurationComponent_Conditional_52_Template, 66, 21, "div", 22);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    \u0275\u0275advance(6);
    \u0275\u0275property("size", 16);
    \u0275\u0275advance(11);
    \u0275\u0275property("size", 16);
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("ngModel", ctx.selectedTenantId);
    \u0275\u0275advance();
    \u0275\u0275property("value", 0);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx.tenants());
    \u0275\u0275advance(4);
    \u0275\u0275property("size", 16);
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("ngModel", ctx.selectedPortfolioId);
    \u0275\u0275property("disabled", ctx.selectedTenantId === 0);
    \u0275\u0275advance();
    \u0275\u0275property("value", 0);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx.portfolios());
    \u0275\u0275advance(4);
    \u0275\u0275property("size", 16);
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("ngModel", ctx.selectedSubPortfolioId);
    \u0275\u0275property("disabled", ctx.selectedPortfolioId === 0);
    \u0275\u0275advance();
    \u0275\u0275property("value", 0);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx.subPortfolios());
    \u0275\u0275advance(4);
    \u0275\u0275property("size", 16);
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("ngModel", ctx.selectedLoadType);
    \u0275\u0275property("disabled", ctx.selectedSubPortfolioId === 0);
    \u0275\u0275advance(5);
    \u0275\u0275conditional(ctx.selectedSubPortfolioId > 0 ? 51 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx.showManualDialog() ? 52 : -1);
  }
}, dependencies: [CommonModule, FormsModule, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, CheckboxControlValueAccessor, SelectControlValueAccessor, NgControlStatus, NgModel, LucideAngularModule, LucideAngularComponent], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n}\n/*# sourceMappingURL=header-configuration.component.css.map */"] });
var HeaderConfigurationComponent = _HeaderConfigurationComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(HeaderConfigurationComponent, [{
    type: Component,
    args: [{ selector: "app-header-configuration", standalone: true, imports: [CommonModule, FormsModule, LucideAngularModule], template: `
    <div class="h-[calc(100dvh-56px)] bg-slate-950 overflow-hidden flex flex-col">
      <div class="flex-1 overflow-y-auto">
        <div class="p-3 max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-2">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-lg flex items-center justify-center">
            <lucide-angular name="table-2" [size]="16" class="text-white"></lucide-angular>
          </div>
          <div>
            <h1 class="text-lg font-bold text-white">Configuraci\xF3n de Cabeceras</h1>
            <p class="text-xs text-gray-400">Define las cabeceras personalizadas por subcartera</p>
          </div>
        </div>
      </div>

      <!-- Filtros en Cascada -->
      <div class="mb-2">
        <div class="bg-slate-900 rounded-lg p-2 shadow-sm border border-slate-800">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-2">
            <!-- Proveedor -->
            <div>
              <label class="block text-xs font-semibold text-gray-300 mb-1">
                <lucide-angular name="building-2" [size]="16" class="inline mr-1"></lucide-angular>
                Proveedor
              </label>
              <select [(ngModel)]="selectedTenantId"
                      (ngModelChange)="onTenantChange()"
                      class="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option [value]="0">Seleccione un proveedor...</option>
                @for (tenant of tenants(); track tenant.id) {
                  <option [value]="tenant.id">{{ tenant.tenantName }}</option>
                }
              </select>
            </div>

            <!-- Cartera -->
            <div>
              <label class="block text-xs font-semibold text-gray-300 mb-1">
                <lucide-angular name="folder" [size]="16" class="inline mr-1"></lucide-angular>
                Cartera
              </label>
              <select [(ngModel)]="selectedPortfolioId"
                      (ngModelChange)="onPortfolioChange()"
                      [disabled]="selectedTenantId === 0"
                      class="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
                <option [value]="0">Seleccione una cartera...</option>
                @for (portfolio of portfolios(); track portfolio.id) {
                  <option [value]="portfolio.id">{{ portfolio.portfolioName }}</option>
                }
              </select>
            </div>

            <!-- Subcartera -->
            <div>
              <label class="block text-xs font-semibold text-gray-300 mb-1">
                <lucide-angular name="folder-tree" [size]="16" class="inline mr-1"></lucide-angular>
                Subcartera
              </label>
              <select [(ngModel)]="selectedSubPortfolioId"
                      (ngModelChange)="onSubPortfolioChange()"
                      [disabled]="selectedPortfolioId === 0"
                      class="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
                <option [value]="0">Seleccione una subcartera...</option>
                @for (subPortfolio of subPortfolios(); track subPortfolio.id) {
                  <option [value]="subPortfolio.id">{{ subPortfolio.subPortfolioName }}</option>
                }
              </select>
            </div>

            <!-- Tipo de Carga -->
            <div>
              <label class="block text-xs font-semibold text-gray-300 mb-1">
                <lucide-angular name="database" [size]="16" class="inline mr-1"></lucide-angular>
                Tipo de Carga
              </label>
              <select [(ngModel)]="selectedLoadType"
                      (ngModelChange)="onLoadTypeChange()"
                      [disabled]="selectedSubPortfolioId === 0"
                      class="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
                <option value="ACTUALIZACION">Carga Diaria</option>
                <option value="INICIAL">Carga Inicial del Mes</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      @if (selectedSubPortfolioId > 0) {
        <!-- Panel de Acciones -->
        <div class="mb-2">
          <div class="bg-slate-900 rounded-lg shadow-sm border border-slate-800 overflow-hidden">
            <!-- Contenido del Panel -->
            <div class="p-3">
              <!-- Primera fila: Botones principales y contador -->
              <div class="flex flex-wrap items-center gap-2 mb-2">
                <!-- Dropdown para descargar plantillas -->
                <div class="relative">
                  <button (click)="toggleDownloadMenu()"
                          #downloadButton
                          class="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all cursor-pointer">
                    <lucide-angular name="file-text" [size]="16"></lucide-angular>
                    <span class="hidden sm:inline">Descargar Plantilla</span>
                    <span class="sm:hidden">Plantilla</span>
                    <lucide-angular [name]="downloadMenuOpen() ? 'chevron-up' : 'chevron-down'" [size]="14"></lucide-angular>
                  </button>
                </div>

                <!-- Selector de Separador -->
                <select [(ngModel)]="csvSeparator"
                        class="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer">
                  <option value=";">Separador: Punto y coma (;)</option>
                  <option value=",">Separador: Coma (,)</option>
                  <option value="|">Separador: Pipe (|)</option>
                  <option value="	">Separador: Tabulaci\xF3n (Tab)</option>
                </select>

                <!-- Bot\xF3n Importar Configuraci\xF3n -->
                <label class="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-all cursor-pointer">
                  <lucide-angular name="folder-open" [size]="16"></lucide-angular>
                  <span class="hidden sm:inline">Importar CSV/Excel</span>
                  <span class="sm:hidden">Importar</span>
                  <input type="file"
                         accept=".csv,.xlsx,.xls"
                         (change)="onFileSelected($event)"
                         class="hidden">
                </label>

                <!-- Contador de cabeceras -->
                @if (previewHeaders().length > 0) {
                  <div class="ml-auto flex items-center gap-2 px-3 py-1.5">
                    <lucide-angular name="table-2" [size]="14" class="text-indigo-400"></lucide-angular>
                    <span class="text-sm font-semibold text-indigo-400">{{ previewHeaders().length }}</span>
                    <span class="text-xs text-indigo-400">cabecera(s)</span>
                  </div>
                }
              </div>

              <!-- Men\xFA dropdown con posici\xF3n fixed para evitar overflow hidden del contenedor -->
              @if (downloadMenuOpen()) {
                <div class="fixed inset-0 z-[9998]" (click)="downloadMenuOpen.set(false)"></div>
                <div class="fixed w-56 bg-slate-800 rounded-lg shadow-xl border border-slate-700 py-1 z-[9999]"
                     [style.top.px]="dropdownPosition().top"
                     [style.left.px]="dropdownPosition().left">
                  <button (click)="downloadCSVTemplate()"
                          class="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-700 transition-colors text-left text-gray-300 cursor-pointer">
                    <lucide-angular name="file-text" [size]="16" class="text-gray-400"></lucide-angular>
                    <span class="text-sm font-medium">Descargar CSV</span>
                  </button>
                  <button (click)="downloadExcelTemplate()"
                          class="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-700 transition-colors text-left text-gray-300 cursor-pointer">
                    <lucide-angular name="table-2" [size]="16" class="text-green-400"></lucide-angular>
                    <span class="text-sm font-medium">Descargar Excel (.xlsx)</span>
                  </button>
                </div>
              }

              <!-- Segunda fila: Botones de acci\xF3n cuando hay cabeceras -->
              @if (previewHeaders().length > 0) {
                <div class="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-slate-700">
                  <button (click)="clearAll()"
                          class="flex items-center gap-1 px-3 py-1.5 bg-slate-800 text-gray-300 rounded-lg text-sm hover:bg-slate-700 hover:text-white transition-all cursor-pointer">
                    <lucide-angular name="trash-2" [size]="14"></lucide-angular>
                    <span>Limpiar</span>
                  </button>

                  <button (click)="confirmConfiguration()"
                          class="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-all cursor-pointer">
                    <lucide-angular name="save" [size]="16"></lucide-angular>
                    <span>Guardar</span>
                  </button>
                </div>
              }
            </div>
          </div>
        </div>

        <!-- Tabla de Previsualizaci\xF3n -->
        <div>
          <div class="bg-slate-900 rounded-lg shadow-sm border border-slate-800 overflow-hidden">
            @if (previewHeaders().length === 0) {
              <div class="p-6 text-center">
                <div class="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-2">
                  <lucide-angular name="table-2" [size]="24" class="text-gray-600"></lucide-angular>
                </div>
                <p class="text-sm text-gray-400">No hay cabeceras configuradas</p>
              </div>
            } @else {
              <div class="overflow-x-auto max-h-[calc(100dvh-340px)] overflow-y-auto">
                <table class="w-full">
                  <thead class="bg-slate-800 border-b border-slate-700 sticky top-0">
                    <tr>
                      <th class="px-2 py-1.5 text-left text-xs font-semibold text-gray-400">Nombre</th>
                      <th class="px-2 py-1.5 text-left text-xs font-semibold text-gray-400">Tipo</th>
                      <th class="px-2 py-1.5 text-left text-xs font-semibold text-gray-400">Etiqueta</th>
                      <th class="px-2 py-1.5 text-left text-xs font-semibold text-gray-400">Campo Cat\xE1logo</th>
                      <th class="px-2 py-1.5 text-left text-xs font-semibold text-gray-400">Formato</th>
                      <th class="px-2 py-1.5 text-center text-xs font-semibold text-gray-400">Req.</th>
                      <th class="px-2 py-1.5 text-left text-xs font-semibold text-gray-400">Acciones</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-800">
                    @for (header of previewHeaders(); track $index) {
                      <tr class="hover:bg-slate-800 transition-colors">
                        <td class="px-2 py-1.5">
                          <div class="flex items-center gap-1">
                            <span class="font-mono text-xs font-semibold text-indigo-400">{{ header.headerName }}</span>
                            @if (header.sourceField && header.regexPattern) {
                              <lucide-angular
                                name="sparkles"
                                [size]="12"
                                class="text-amber-400 flex-shrink-0"
                                title="Campo transformado mediante expresi\xF3n regular desde: {{ header.sourceField }}">
                              </lucide-angular>
                            }
                          </div>
                        </td>
                        <td class="px-2 py-1.5">
                          <span [class]="getDataTypeBadgeClass(header.dataType)"
                                class="inline-flex px-1.5 py-0.5 rounded text-xs font-medium">
                            {{ header.dataType }}
                          </span>
                        </td>
                        <td class="px-2 py-1.5">
                          <span class="text-xs text-white">{{ header.displayLabel }}</span>
                        </td>
                        <td class="px-2 py-1.5">
                          @if (header.fieldDefinitionId === 0) {
                            <span class="text-xs text-amber-400 italic">Sin asociar</span>
                          } @else {
                            <span class="font-mono text-xs text-gray-400">{{ getFieldCodeById(header.fieldDefinitionId) }}</span>
                          }
                        </td>
                        <td class="px-2 py-1.5">
                          <span class="text-xs text-gray-400">{{ header.format || '-' }}</span>
                        </td>
                        <td class="px-2 py-1.5 text-center">
                          @if (header.required) {
                            <lucide-angular name="check-circle" [size]="14" class="text-green-400 inline"></lucide-angular>
                          } @else {
                            <lucide-angular name="circle" [size]="14" class="text-gray-600 inline"></lucide-angular>
                          }
                        </td>
                        <td class="px-2 py-1.5">
                          <div class="flex items-center gap-1">
                            <button (click)="editPreviewHeader($index)"
                                    class="p-1 text-blue-400 hover:bg-slate-800 rounded transition-colors"
                                    title="Editar">
                              <lucide-angular name="edit" [size]="14"></lucide-angular>
                            </button>
                            <button (click)="removePreviewHeader($index)"
                                    class="p-1 text-red-400 hover:bg-slate-800 rounded transition-colors"
                                    title="Eliminar">
                              <lucide-angular name="trash-2" [size]="14"></lucide-angular>
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

      <!-- Dialog Agregar/Editar Manual -->
      @if (showManualDialog()) {
        <div class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div class="bg-slate-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-slate-800">
            <!-- Dialog Header -->
            <div class="bg-gradient-to-r from-indigo-600 to-indigo-700 p-5 text-white">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <lucide-angular name="plus-circle" [size]="20"></lucide-angular>
                  </div>
                  <div>
                    <h2 class="text-xl font-bold">{{ editingIndex() !== null ? 'Editar' : 'Agregar' }} Cabecera</h2>
                    <p class="text-indigo-100 text-sm">Complete la informaci\xF3n de la cabecera</p>
                  </div>
                </div>
                <button (click)="closeManualDialog()" class="text-white/80 hover:text-white">
                  <lucide-angular name="x" [size]="20"></lucide-angular>
                </button>
              </div>
            </div>

            <!-- Dialog Body -->
            <div class="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <div class="space-y-4">
                <!-- Campo Base de Datos (Dropdown del Cat\xE1logo) -->
                <div>
                  <label class="block text-sm font-semibold text-gray-300 mb-2">
                    <lucide-angular name="book-open" [size]="16" class="inline mr-1"></lucide-angular>
                    Campo Base de Datos (Opcional)
                  </label>
                  <select [(ngModel)]="formData.fieldDefinitionId"
                          (ngModelChange)="onFieldDefinitionSelect()"
                          class="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option [value]="0">Sin asociar - Campo personalizado</option>
                    @for (field of availableFieldDefinitions(); track field.id) {
                      <option [value]="field.id">
                        {{ field.fieldName }} ({{ field.fieldCode }})
                      </option>
                    }
                  </select>
                  <p class="text-xs text-gray-400 mt-1">
                    Seleccione un campo del cat\xE1logo o deje "Sin asociar" para crear un campo personalizado.
                  </p>
                </div>

                <!-- Informaci\xF3n del Cat\xE1logo (Solo Lectura) -->
                @if (getSelectedFieldDefinition(); as selectedField) {
                  <div class="bg-slate-800/50 rounded-lg p-4 space-y-2 border border-slate-700/50">
                    <p class="text-xs font-semibold text-gray-400 mb-2">\u{1F4CB} Informaci\xF3n del Cat\xE1logo</p>

                    <div class="flex items-center gap-2">
                      <span class="text-xs text-gray-400">Tipo de Dato:</span>
                      <span [class]="getDataTypeBadgeClass(selectedField.dataType)"
                            class="inline-flex px-2 py-0.5 rounded text-xs font-medium">
                        {{ selectedField.dataType }}
                      </span>
                    </div>

                    @if (selectedField.description) {
                      <div class="text-xs text-gray-400">
                        <span class="font-semibold">Descripci\xF3n:</span> {{ selectedField.description }}
                      </div>
                    }

                    @if (selectedField.format) {
                      <div class="text-xs text-gray-400">
                        <span class="font-semibold">Formato del Sistema:</span>
                        <code class="text-cyan-400">{{ selectedField.format }}</code>
                      </div>
                    }
                  </div>
                }

                <!-- Selector de Tipo de Dato (para campos personalizados) -->
                @if (formData.fieldDefinitionId === 0) {
                  <div>
                    <label class="block text-sm font-semibold text-gray-300 mb-2">
                      <lucide-angular name="type" [size]="16" class="inline mr-1"></lucide-angular>
                      Tipo de Dato *
                    </label>
                    <select [(ngModel)]="formData.dataType"
                            class="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      <option value="TEXTO">TEXTO</option>
                      <option value="NUMERICO">NUMERICO</option>
                      <option value="FECHA">FECHA</option>
                    </select>
                    <p class="text-xs text-gray-400 mt-1">
                      Seleccione el tipo de dato para este campo personalizado.
                    </p>
                  </div>
                }

                <!-- Campo Sistema (Input Texto Libre) -->
                <div>
                  <label class="block text-sm font-semibold text-gray-300 mb-2">
                    <lucide-angular name="settings" [size]="16" class="inline mr-1"></lucide-angular>
                    Campo Sistema *
                  </label>
                  <input type="text"
                         [(ngModel)]="formData.headerName"
                         placeholder="Ej: DNI, Saldo Vencido, Tel\xE9fono Principal"
                         class="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <p class="text-xs text-gray-400 mt-1">
                    Nombre de la cabecera tal como viene del proveedor.
                  </p>
                </div>

                <!-- Etiqueta Visual (Input Texto) -->
                <div>
                  <label class="block text-sm font-semibold text-gray-300 mb-2">
                    <lucide-angular name="eye" [size]="16" class="inline mr-1"></lucide-angular>
                    Etiqueta Visual *
                  </label>
                  <input type="text"
                         [(ngModel)]="formData.displayLabel"
                         placeholder="Ej: N\xFAmero de Documento, Saldo Pendiente"
                         class="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <p class="text-xs text-gray-400 mt-1">
                    Texto que se mostrar\xE1 en la interfaz de usuario.
                  </p>
                </div>

                <!-- Formato (Input Texto Opcional) -->
                <div>
                  <label class="block text-sm font-semibold text-gray-300 mb-2">
                    <lucide-angular name="file-text" [size]="16" class="inline mr-1"></lucide-angular>
                    Formato
                  </label>
                  <input type="text"
                         [(ngModel)]="formData.format"
                         placeholder="Ej: dd/MM/yyyy, decimal(18,2)"
                         class="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <p class="text-xs text-gray-400 mt-1">
                    Formato espec\xEDfico para esta subcartera (opcional, puede diferir del formato del sistema).
                  </p>
                </div>

                <!-- Obligatorio -->
                <div class="flex items-center gap-3">
                  <input type="checkbox"
                         [(ngModel)]="formData.required"
                         id="required"
                         class="w-4 h-4 text-indigo-600 bg-slate-800 border-slate-700 rounded focus:ring-indigo-500">
                  <label for="required" class="text-sm text-gray-300">
                    Campo obligatorio
                  </label>
                </div>

                <!-- Secci\xF3n de Transformaci\xF3n -->
                <div class="col-span-2 border-t border-slate-700 pt-4 mt-2">
                  <!-- Toggle Header -->
                  <button type="button"
                          (click)="showTransformSection.set(!showTransformSection())"
                          class="w-full flex items-center justify-between text-sm font-bold text-emerald-400 mb-3 hover:text-emerald-300 transition-colors">
                    <div class="flex items-center gap-2">
                      <lucide-angular name="git-branch" [size]="16"></lucide-angular>
                      Transformaci\xF3n de Campo (Opcional)
                    </div>
                    <lucide-angular
                      [name]="showTransformSection() ? 'chevron-up' : 'chevron-down'"
                      [size]="16">
                    </lucide-angular>
                  </button>

                  @if (showTransformSection()) {
                    <p class="text-xs text-gray-400 mb-4">
                      Si este campo se deriva de otro campo mediante regex, config\xFAralo aqu\xED.<br>
                      Ejemplo: extraer documento desde IDENTITY_CODE.
                    </p>

                    <div class="grid grid-cols-1 gap-4">
                      <!-- Campo Origen -->
                      <div>
                        <label class="block text-sm font-semibold text-gray-300 mb-2">
                          <lucide-angular name="arrow-right" [size]="16" class="inline mr-1"></lucide-angular>
                          Campo Origen
                        </label>
                        <select [(ngModel)]="formData.sourceField"
                                class="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                          <option value="">Seleccione un campo origen...</option>
                          @for (header of availableSourceHeaders(); track header.headerName) {
                            <option [value]="header.headerName">
                              {{ header.headerName }} - {{ header.displayLabel }}
                            </option>
                          }
                        </select>
                        <p class="text-xs text-gray-400 mt-1">
                          Campo desde donde se extraer\xE1 el valor mediante regex.
                        </p>
                      </div>

                      <!-- Patr\xF3n Regex -->
                      <div>
                        <label class="block text-sm font-semibold text-gray-300 mb-2">
                          <lucide-angular name="code" [size]="16" class="inline mr-1"></lucide-angular>
                          Patr\xF3n Regex
                          @if (formData.sourceField && formData.sourceField.trim() !== '') {
                            <span class="text-red-400 ml-1">*</span>
                          }
                        </label>
                        <input type="text"
                               [(ngModel)]="formData.regexPattern"
                               placeholder="Ej: .{{8}}$ (\xFAltimos 8 caracteres)"
                               class="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-sm">
                        <p class="text-xs text-gray-400 mt-1">
                          Ejemplos: <code class="text-emerald-400">.{{8}}$</code> \xFAltimos 8 \u2022 <code class="text-emerald-400">\\d{{8}}</code> 8 d\xEDgitos
                        </p>
                      </div>
                    </div>
                  }
                </div>
              </div>
            </div>

            <!-- Dialog Footer -->
            <div class="border-t border-slate-800 p-4 flex justify-end gap-3 bg-slate-950">
              <button (click)="closeManualDialog()"
                      class="px-5 py-2 text-gray-400 hover:bg-slate-800 hover:text-white rounded-lg font-medium transition-colors">
                Cancelar
              </button>
              <button (click)="saveManualHeader()"
                      [disabled]="!canSaveManualHeader()"
                      class="px-5 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                {{ editingIndex() !== null ? 'Actualizar' : 'Agregar' }}
              </button>
            </div>
          </div>
        </div>
      }
        </div>
      </div>
    </div>
  `, styles: ["/* angular:styles/component:css;219558ef63f119a92210704329b58a3cdceaa4fb296db559e672f74512827dc7;C:/Users/HP/Documents/Kubito-2.0-v1/cashi-discador-frontend/cashi-discador-frontend/src/app/maintenance/components/header-configuration/header-configuration.component.ts */\n:host {\n  display: block;\n}\n/*# sourceMappingURL=header-configuration.component.css.map */\n"] }]
  }], () => [{ type: HeaderConfigurationService }, { type: FieldDefinitionService }, { type: TypificationService }, { type: PortfolioService }], { downloadButton: [{
    type: ViewChild,
    args: ["downloadButton", { read: ElementRef }]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(HeaderConfigurationComponent, { className: "HeaderConfigurationComponent", filePath: "src/app/maintenance/components/header-configuration/header-configuration.component.ts", lineNumber: 532 });
})();
export {
  HeaderConfigurationComponent
};
//# sourceMappingURL=chunk-KUUQOFU6.js.map
