import {
  readSync,
  utils,
  writeFileSync
} from "./chunk-LQJYZV75.js";
import {
  HeaderConfigurationService
} from "./chunk-A2MX5XEA.js";
import {
  TenantService
} from "./chunk-RDUKPQZZ.js";
import {
  PortfolioService
} from "./chunk-K6HKS25L.js";
import {
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
  __async,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassProp,
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
  ɵɵrepeaterTrackByIndex,
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

// src/app/data-load/components/daily-load/daily-load.component.ts
var _forTrack0 = ($index, $item) => $item.id;
function DailyLoadComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 0);
    \u0275\u0275element(1, "div", 20);
    \u0275\u0275elementStart(2, "div", 21)(3, "div", 22)(4, "div", 23);
    \u0275\u0275element(5, "div", 24)(6, "div", 25);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "div", 26)(8, "h3", 27);
    \u0275\u0275text(9, "Importando datos...");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "p", 28);
    \u0275\u0275text(11, "Por favor espere, este proceso puede tardar varios minutos dependiendo de la cantidad de registros.");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "div", 29);
    \u0275\u0275element(13, "div", 30);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "p", 31);
    \u0275\u0275text(15, "No cierre esta ventana");
    \u0275\u0275elementEnd()()()();
  }
}
function DailyLoadComponent_For_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 14);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const tenant_r1 = ctx.$implicit;
    \u0275\u0275property("value", tenant_r1.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", tenant_r1.tenantCode, " - ", tenant_r1.tenantName);
  }
}
function DailyLoadComponent_For_31_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 14);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const portfolio_r2 = ctx.$implicit;
    \u0275\u0275property("value", portfolio_r2.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", portfolio_r2.portfolioCode, " - ", portfolio_r2.portfolioName);
  }
}
function DailyLoadComponent_For_40_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 14);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const sp_r3 = ctx.$implicit;
    \u0275\u0275property("value", sp_r3.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", sp_r3.subPortfolioCode, " - ", sp_r3.subPortfolioName);
  }
}
function DailyLoadComponent_Conditional_41_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 47)(1, "div", 44)(2, "span", 31);
    \u0275\u0275text(3, "Total:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 56);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 44);
    \u0275\u0275element(7, "lucide-angular", 57);
    \u0275\u0275elementStart(8, "span", 58);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "div", 44);
    \u0275\u0275element(11, "lucide-angular", 59);
    \u0275\u0275elementStart(12, "span", 60);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r4 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r4.importedData().length);
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 12);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r4.validData().length);
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 12);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r4.invalidData().length);
  }
}
function DailyLoadComponent_Conditional_41_Conditional_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 31);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r4 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("", ctx_r4.previewHeaders().length, " columnas");
  }
}
function DailyLoadComponent_Conditional_41_Conditional_32_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 52);
    \u0275\u0275text(1, "Estado");
    \u0275\u0275elementEnd();
  }
}
function DailyLoadComponent_Conditional_41_For_34_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "lucide-angular", 62);
  }
  if (rf & 2) {
    const header_r6 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("size", 12)("title", "Campo transformado desde: " + header_r6.sourceField);
  }
}
function DailyLoadComponent_Conditional_41_For_34_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 53)(1, "div", 61);
    \u0275\u0275conditionalCreate(2, DailyLoadComponent_Conditional_41_For_34_Conditional_2_Template, 1, 2, "lucide-angular", 62);
    \u0275\u0275elementStart(3, "div", 63)(4, "span", 64);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span", 65);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const header_r6 = ctx.$implicit;
    \u0275\u0275property("title", header_r6.dataType + (header_r6.format ? " (" + header_r6.format + ")" : ""));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(header_r6.sourceField && header_r6.regexPattern ? 2 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(header_r6.headerName);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", header_r6.dataType, "", header_r6.format ? " (" + header_r6.format + ")" : "");
  }
}
function DailyLoadComponent_Conditional_41_Conditional_36_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr", 54)(1, "td", 66)(2, "div", 67);
    \u0275\u0275element(3, "lucide-angular", 68);
    \u0275\u0275elementStart(4, "span", 69);
    \u0275\u0275text(5, "No hay datos. Importa un archivo Excel para ver los datos aqu\xED.");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r4 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275attribute("colspan", ctx_r4.previewHeaders().length + 1);
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 24);
  }
}
function DailyLoadComponent_Conditional_41_Conditional_37_For_1_For_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 77);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const header_r7 = ctx.$implicit;
    const row_r8 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275classProp("text-gray-500", !row_r8[header_r7.headerName]);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", row_r8[header_r7.headerName] || "NULL", " ");
  }
}
function DailyLoadComponent_Conditional_41_Conditional_37_For_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr", 70)(1, "td", 72);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td", 73)(4, "span", 74);
    \u0275\u0275element(5, "lucide-angular", 75);
    \u0275\u0275text(6, " V\xE1lido ");
    \u0275\u0275elementEnd()();
    \u0275\u0275repeaterCreate(7, DailyLoadComponent_Conditional_41_Conditional_37_For_1_For_8_Template, 2, 3, "td", 76, _forTrack0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const \u0275$index_222_r9 = ctx.$index;
    const ctx_r4 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275$index_222_r9 + 1);
    \u0275\u0275advance(3);
    \u0275\u0275property("size", 10);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r4.previewHeaders());
  }
}
function DailyLoadComponent_Conditional_41_Conditional_37_For_3_For_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 77);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const header_r10 = ctx.$implicit;
    const row_r11 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275classProp("text-gray-500", !row_r11.data[header_r10.headerName]);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", row_r11.data[header_r10.headerName] || "NULL", " ");
  }
}
function DailyLoadComponent_Conditional_41_Conditional_37_For_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr", 71)(1, "td", 72);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td", 73)(4, "span", 78);
    \u0275\u0275element(5, "lucide-angular", 79);
    \u0275\u0275text(6, " Error ");
    \u0275\u0275elementEnd()();
    \u0275\u0275repeaterCreate(7, DailyLoadComponent_Conditional_41_Conditional_37_For_3_For_8_Template, 2, 3, "td", 76, _forTrack0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const row_r11 = ctx.$implicit;
    const \u0275$index_239_r12 = ctx.$index;
    const ctx_r4 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r4.validData().length + \u0275$index_239_r12 + 1);
    \u0275\u0275advance(2);
    \u0275\u0275property("title", row_r11.error);
    \u0275\u0275advance();
    \u0275\u0275property("size", 10);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r4.previewHeaders());
  }
}
function DailyLoadComponent_Conditional_41_Conditional_37_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275repeaterCreate(0, DailyLoadComponent_Conditional_41_Conditional_37_For_1_Template, 9, 2, "tr", 70, \u0275\u0275repeaterTrackByIndex);
    \u0275\u0275repeaterCreate(2, DailyLoadComponent_Conditional_41_Conditional_37_For_3_Template, 9, 3, "tr", 71, \u0275\u0275repeaterTrackByIndex);
  }
  if (rf & 2) {
    const ctx_r4 = \u0275\u0275nextContext(2);
    \u0275\u0275repeater(ctx_r4.validData());
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r4.invalidData());
  }
}
function DailyLoadComponent_Conditional_41_Conditional_38_Conditional_1_For_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 94);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const error_r14 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", error_r14, " ");
  }
}
function DailyLoadComponent_Conditional_41_Conditional_38_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 80)(1, "div", 88);
    \u0275\u0275element(2, "lucide-angular", 89);
    \u0275\u0275elementStart(3, "div", 90)(4, "h3", 91);
    \u0275\u0275text(5, "Errores al Importar Datos");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p", 92);
    \u0275\u0275text(7, " La importaci\xF3n fall\xF3 debido a los siguientes errores. No se insert\xF3 ning\xFAn dato. ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "div", 93);
    \u0275\u0275repeaterCreate(9, DailyLoadComponent_Conditional_41_Conditional_38_Conditional_1_For_10_Template, 2, 1, "div", 94, \u0275\u0275repeaterTrackByIndex);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r4 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 24);
    \u0275\u0275advance(7);
    \u0275\u0275repeater(ctx_r4.backendErrors());
  }
}
function DailyLoadComponent_Conditional_41_Conditional_38_Conditional_2_For_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 83)(1, "span", 84);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const row_r15 = ctx.$implicit;
    const \u0275$index_294_r16 = ctx.$index;
    const ctx_r4 = \u0275\u0275nextContext(4);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("Fila ", ctx_r4.validData().length + \u0275$index_294_r16 + 1, ":");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", row_r15.error, " ");
  }
}
function DailyLoadComponent_Conditional_41_Conditional_38_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 81)(1, "div", 88);
    \u0275\u0275element(2, "lucide-angular", 95);
    \u0275\u0275elementStart(3, "div", 90)(4, "h3", 96);
    \u0275\u0275text(5, "Registros con Errores");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 97);
    \u0275\u0275repeaterCreate(7, DailyLoadComponent_Conditional_41_Conditional_38_Conditional_2_For_8_Template, 4, 2, "p", 83, \u0275\u0275repeaterTrackByIndex);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r4 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 20);
    \u0275\u0275advance(5);
    \u0275\u0275repeater(ctx_r4.invalidData());
  }
}
function DailyLoadComponent_Conditional_41_Conditional_38_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 84);
    \u0275\u0275text(1, "La importaci\xF3n fall\xF3. Corrija los errores e intente nuevamente.");
    \u0275\u0275elementEnd();
  }
}
function DailyLoadComponent_Conditional_41_Conditional_38_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 98);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275text(2, " listo(s) para importar ");
  }
  if (rf & 2) {
    const ctx_r4 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("", ctx_r4.validData().length, " registro(s)");
  }
}
function DailyLoadComponent_Conditional_41_Conditional_38_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 84);
    \u0275\u0275text(1, "No hay registros v\xE1lidos para importar");
    \u0275\u0275elementEnd();
  }
}
function DailyLoadComponent_Conditional_41_Conditional_38_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r17 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 99);
    \u0275\u0275listener("click", function DailyLoadComponent_Conditional_41_Conditional_38_Conditional_11_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r17);
      const ctx_r4 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r4.confirmImport());
    });
    \u0275\u0275text(1, " Confirmar Importaci\xF3n ");
    \u0275\u0275elementEnd();
  }
}
function DailyLoadComponent_Conditional_41_Conditional_38_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 55);
    \u0275\u0275conditionalCreate(1, DailyLoadComponent_Conditional_41_Conditional_38_Conditional_1_Template, 11, 1, "div", 80);
    \u0275\u0275conditionalCreate(2, DailyLoadComponent_Conditional_41_Conditional_38_Conditional_2_Template, 9, 1, "div", 81);
    \u0275\u0275elementStart(3, "div", 82)(4, "div", 83);
    \u0275\u0275conditionalCreate(5, DailyLoadComponent_Conditional_41_Conditional_38_Conditional_5_Template, 2, 0, "span", 84)(6, DailyLoadComponent_Conditional_41_Conditional_38_Conditional_6_Template, 3, 1)(7, DailyLoadComponent_Conditional_41_Conditional_38_Conditional_7_Template, 2, 0, "span", 84);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "div", 85)(9, "button", 86);
    \u0275\u0275listener("click", function DailyLoadComponent_Conditional_41_Conditional_38_Template_button_click_9_listener() {
      \u0275\u0275restoreView(_r13);
      const ctx_r4 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r4.clearImportedData());
    });
    \u0275\u0275text(10, " Cancelar ");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(11, DailyLoadComponent_Conditional_41_Conditional_38_Conditional_11_Template, 2, 0, "button", 87);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r4 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r4.backendErrors().length > 0 ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r4.invalidData().length > 0 ? 2 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r4.backendErrors().length > 0 ? 5 : ctx_r4.validData().length > 0 ? 6 : 7);
    \u0275\u0275advance(6);
    \u0275\u0275conditional(ctx_r4.validData().length > 0 && ctx_r4.backendErrors().length === 0 ? 11 : -1);
  }
}
function DailyLoadComponent_Conditional_41_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 18)(1, "div", 32)(2, "div")(3, "h2", 33);
    \u0275\u0275text(4, "Importaci\xF3n de Datos");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 34);
    \u0275\u0275text(6, " Sube un archivo Excel con los datos para esta subcartera ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 35)(8, "button", 36);
    \u0275\u0275listener("click", function DailyLoadComponent_Conditional_41_Template_button_click_8_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r4 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r4.downloadDataTemplate());
    });
    \u0275\u0275element(9, "lucide-angular", 37);
    \u0275\u0275elementStart(10, "span");
    \u0275\u0275text(11, "Descargar Plantilla");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "label", 38);
    \u0275\u0275element(13, "lucide-angular", 39);
    \u0275\u0275elementStart(14, "span");
    \u0275\u0275text(15, "Importar Datos");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "input", 40);
    \u0275\u0275listener("change", function DailyLoadComponent_Conditional_41_Template_input_change_16_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r4 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r4.onDataFileSelected($event));
    });
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(17, "div", 41)(18, "div", 42)(19, "div", 43)(20, "div", 44);
    \u0275\u0275element(21, "lucide-angular", 45);
    \u0275\u0275elementStart(22, "span", 46);
    \u0275\u0275text(23, " Tabla de Datos ");
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(24, DailyLoadComponent_Conditional_41_Conditional_24_Template, 14, 5, "div", 47)(25, DailyLoadComponent_Conditional_41_Conditional_25_Template, 2, 1, "span", 31);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(26, "div", 48)(27, "table", 49)(28, "thead", 50)(29, "tr")(30, "th", 51);
    \u0275\u0275text(31, "#");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(32, DailyLoadComponent_Conditional_41_Conditional_32_Template, 2, 0, "th", 52);
    \u0275\u0275repeaterCreate(33, DailyLoadComponent_Conditional_41_For_34_Template, 8, 5, "th", 53, _forTrack0);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(35, "tbody");
    \u0275\u0275conditionalCreate(36, DailyLoadComponent_Conditional_41_Conditional_36_Template, 6, 2, "tr", 54)(37, DailyLoadComponent_Conditional_41_Conditional_37_Template, 4, 0);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275conditionalCreate(38, DailyLoadComponent_Conditional_41_Conditional_38_Template, 12, 4, "div", 55);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r4 = \u0275\u0275nextContext();
    \u0275\u0275advance(9);
    \u0275\u0275property("size", 16);
    \u0275\u0275advance(4);
    \u0275\u0275property("size", 16);
    \u0275\u0275advance(8);
    \u0275\u0275property("size", 16);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r4.importedData().length > 0 ? 24 : 25);
    \u0275\u0275advance(8);
    \u0275\u0275conditional(ctx_r4.importedData().length > 0 ? 32 : -1);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r4.previewHeaders());
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r4.importedData().length === 0 ? 36 : 37);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r4.importedData().length > 0 ? 38 : -1);
  }
}
function DailyLoadComponent_Conditional_42_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 19)(1, "div", 88);
    \u0275\u0275element(2, "lucide-angular", 100);
    \u0275\u0275elementStart(3, "div")(4, "h3", 101);
    \u0275\u0275text(5, "No hay cabeceras configuradas");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p", 28);
    \u0275\u0275text(7, " Primero debes configurar las cabeceras para esta subcartera en el m\xF3dulo de Mantenimiento. ");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 20);
  }
}
var _DailyLoadComponent = class _DailyLoadComponent {
  constructor(tenantService, portfolioService, headerConfigService) {
    this.tenantService = tenantService;
    this.portfolioService = portfolioService;
    this.headerConfigService = headerConfigService;
    this.tenants = signal([], ...ngDevMode ? [{ debugName: "tenants" }] : []);
    this.portfolios = signal([], ...ngDevMode ? [{ debugName: "portfolios" }] : []);
    this.subPortfolios = signal([], ...ngDevMode ? [{ debugName: "subPortfolios" }] : []);
    this.selectedTenantId = 0;
    this.selectedPortfolioId = 0;
    this.selectedSubPortfolioId = 0;
    this.previewHeaders = signal([], ...ngDevMode ? [{ debugName: "previewHeaders" }] : []);
    this.headersAreSaved = signal(false, ...ngDevMode ? [{ debugName: "headersAreSaved" }] : []);
    this.importedData = signal([], ...ngDevMode ? [{ debugName: "importedData" }] : []);
    this.validData = signal([], ...ngDevMode ? [{ debugName: "validData" }] : []);
    this.invalidData = signal([], ...ngDevMode ? [{ debugName: "invalidData" }] : []);
    this.backendErrors = signal([], ...ngDevMode ? [{ debugName: "backendErrors" }] : []);
    this.isLoading = signal(false, ...ngDevMode ? [{ debugName: "isLoading" }] : []);
  }
  ngOnInit() {
    this.loadTenants();
  }
  loadTenants() {
    this.tenantService.getAllTenants().subscribe({
      next: (data) => {
        this.tenants.set(data);
      },
      error: (error) => {
        console.error("Error cargando proveedores:", error);
        alert("Error al cargar los proveedores");
      }
    });
  }
  onTenantChange(tenantId) {
    this.selectedTenantId = tenantId;
    this.selectedPortfolioId = 0;
    this.selectedSubPortfolioId = 0;
    this.portfolios.set([]);
    this.subPortfolios.set([]);
    this.previewHeaders.set([]);
    this.headersAreSaved.set(false);
    if (tenantId > 0) {
      this.loadPortfoliosByTenant(tenantId);
    }
  }
  loadPortfoliosByTenant(tenantId) {
    this.portfolioService.getPortfoliosByTenant(tenantId).subscribe({
      next: (data) => {
        this.portfolios.set(data);
      },
      error: (error) => {
        console.error("Error cargando carteras:", error);
        alert("Error al cargar las carteras");
      }
    });
  }
  onPortfolioChange(portfolioId) {
    this.selectedPortfolioId = portfolioId;
    this.selectedSubPortfolioId = 0;
    this.subPortfolios.set([]);
    this.previewHeaders.set([]);
    this.headersAreSaved.set(false);
    if (portfolioId > 0) {
      this.loadSubPortfoliosByPortfolio(portfolioId);
    }
  }
  loadSubPortfoliosByPortfolio(portfolioId) {
    this.portfolioService.getSubPortfoliosByPortfolio(portfolioId).subscribe({
      next: (data) => {
        this.subPortfolios.set(data);
      },
      error: (error) => {
        console.error("Error cargando subcarteras:", error);
        alert("Error al cargar las subcarteras");
      }
    });
  }
  onSubPortfolioChange(subPortfolioId) {
    if (subPortfolioId > 0) {
      this.loadHeadersForSubPortfolio(subPortfolioId);
    } else {
      this.previewHeaders.set([]);
      this.headersAreSaved.set(false);
    }
  }
  loadHeadersForSubPortfolio(subPortfolioId) {
    this.headerConfigService.getBySubPortfolioAndLoadType(subPortfolioId, "ACTUALIZACION").subscribe({
      next: (headers) => {
        this.previewHeaders.set(headers);
        this.headersAreSaved.set(headers.length > 0);
      },
      error: (error) => {
        console.error("Error cargando cabeceras:", error);
        this.previewHeaders.set([]);
        this.headersAreSaved.set(false);
      }
    });
  }
  downloadDataTemplate() {
    return __async(this, null, function* () {
      if (this.previewHeaders().length === 0) {
        alert("No hay cabeceras configuradas para generar la plantilla de datos");
        return;
      }
      const headers = this.previewHeaders().map((h) => h.headerName);
      const wb = utils.book_new();
      const ws = utils.aoa_to_sheet([headers]);
      ws["!cols"] = headers.map((h) => ({ wch: Math.max(h.length + 2, 15) }));
      utils.book_append_sheet(wb, ws, "Datos");
      const subPortfolio = this.subPortfolios().find((sp) => sp.id === this.selectedSubPortfolioId);
      const fileName = `plantilla-datos-${subPortfolio?.subPortfolioCode || "subcartera"}.xlsx`;
      writeFileSync(wb, fileName);
      alert("Plantilla de datos descargada exitosamente.");
    });
  }
  onDataFileSelected(event) {
    return __async(this, null, function* () {
      const file = event.target.files[0];
      if (!file)
        return;
      const fileName = file.name.toLowerCase();
      const isCSV = fileName.endsWith(".csv");
      if (isCSV) {
        this.parseCSVFile(file);
        event.target.value = "";
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => __async(this, null, function* () {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = readSync(data, { type: "array" });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = utils.sheet_to_json(firstSheet, { header: 1 });
          if (jsonData.length === 0) {
            alert("El archivo Excel est\xE1 vac\xEDo");
            return;
          }
          const excelHeaders = jsonData[0].map((h) => String(h).toLowerCase());
          const configuredHeaders = this.previewHeaders();
          const columnMapping = {};
          const missingHeaders = [];
          configuredHeaders.forEach((header, configIndex) => {
            const excelIndex = excelHeaders.findIndex((excelH) => excelH === header.headerName.toLowerCase());
            if (excelIndex !== -1) {
              columnMapping[excelIndex] = configIndex;
            } else {
              if (!(header.sourceField && header.regexPattern)) {
                missingHeaders.push(header);
              }
            }
          });
          if (missingHeaders.length > 0) {
            const missingNames = missingHeaders.map((h) => h.headerName).join(", ");
            const continuar = confirm(`\u26A0\uFE0F ADVERTENCIA: Faltan las siguientes columnas en el archivo Excel:

${missingNames}

Estas columnas se guardar\xE1n como NULL.

\xBFDesea continuar con la importaci\xF3n?`);
            if (!continuar) {
              return;
            }
          }
          const dataRows = jsonData.slice(1);
          if (dataRows.length === 0) {
            alert("El archivo Excel no contiene datos (solo cabeceras)");
            return;
          }
          const valid = [];
          const invalid = [];
          dataRows.forEach((row, rowIndex) => {
            const transformedRow = {};
            let rowError = "";
            configuredHeaders.forEach((header, configIndex) => {
              const excelColumnIndex = Object.keys(columnMapping).find((key) => columnMapping[parseInt(key)] === configIndex);
              if (excelColumnIndex !== void 0) {
                const value = row[parseInt(excelColumnIndex)];
                if (value !== void 0 && value !== null && String(value).trim() !== "") {
                  try {
                    if (header.dataType === "FECHA" && typeof value === "number") {
                      const excelEpoch = new Date(1899, 11, 30);
                      const dateMs = excelEpoch.getTime() + value * 24 * 60 * 60 * 1e3;
                      const date = new Date(dateMs);
                      const format = header.format || "dd/MM/yyyy";
                      transformedRow[header.headerName] = this.formatDateByPattern(date, format);
                    } else if (header.dataType === "FECHA" && value instanceof Date) {
                      const format = header.format || "dd/MM/yyyy";
                      transformedRow[header.headerName] = this.formatDateByPattern(value, format);
                    } else {
                      transformedRow[header.headerName] = String(value).trim();
                    }
                  } catch (error) {
                    rowError = `Error procesando columna ${header.headerName}`;
                    transformedRow[header.headerName] = String(value);
                  }
                } else {
                  transformedRow[header.headerName] = null;
                }
              } else {
                transformedRow[header.headerName] = null;
              }
            });
            configuredHeaders.forEach((header) => {
              if (header.sourceField && header.regexPattern) {
                try {
                  const sourceValue = transformedRow[header.sourceField];
                  if (sourceValue) {
                    const regex = new RegExp(header.regexPattern);
                    const match = String(sourceValue).match(regex);
                    if (match) {
                      transformedRow[header.headerName] = match[1] || match[0];
                    } else {
                      transformedRow[header.headerName] = null;
                    }
                  } else {
                    transformedRow[header.headerName] = null;
                  }
                } catch (error) {
                  console.error(`Error aplicando regex en ${header.headerName}:`, error);
                  transformedRow[header.headerName] = null;
                }
              }
            });
            const hasData = Object.values(transformedRow).some((v) => v !== null && v !== "");
            if (!hasData) {
              invalid.push({
                error: "Fila vac\xEDa - no contiene datos",
                data: transformedRow
              });
            } else if (rowError) {
              invalid.push({
                error: rowError,
                data: transformedRow
              });
            } else {
              valid.push(transformedRow);
            }
          });
          this.importedData.set([...valid, ...invalid.map((i) => i.data)]);
          this.validData.set(valid);
          this.invalidData.set(invalid);
          console.log("Previsualizaci\xF3n de datos:", {
            total: dataRows.length,
            v\u00E1lidos: valid.length,
            inv\u00E1lidos: invalid.length
          });
        } catch (error) {
          console.error("Error procesando el archivo:", error);
          alert("Error al procesar el archivo Excel");
        }
      });
      reader.readAsArrayBuffer(file);
      event.target.value = "";
    });
  }
  parseCSVFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const lines = text.split("\n").map((line) => line.trim()).filter((line) => line.length > 0);
        if (lines.length === 0) {
          alert("El archivo CSV est\xE1 vac\xEDo");
          return;
        }
        const firstLine = lines[0];
        let separator = ";";
        if (firstLine.includes(";")) {
          separator = ";";
        } else if (firstLine.includes(",")) {
          separator = ",";
        } else if (firstLine.includes("|")) {
          separator = "|";
        } else if (firstLine.includes("	")) {
          separator = "	";
        }
        const csvHeaders = lines[0].split(separator).map((h) => h.trim().toLowerCase());
        const configuredHeaders = this.previewHeaders();
        const columnMapping = {};
        const missingHeaders = [];
        configuredHeaders.forEach((header, configIndex) => {
          const csvIndex = csvHeaders.findIndex((csvH) => csvH === header.headerName.toLowerCase());
          if (csvIndex !== -1) {
            columnMapping[csvIndex] = configIndex;
          } else {
            if (!(header.sourceField && header.regexPattern)) {
              missingHeaders.push(header);
            }
          }
        });
        if (missingHeaders.length > 0) {
          const missingNames = missingHeaders.map((h) => h.headerName).join(", ");
          const continuar = confirm(`\u26A0\uFE0F ADVERTENCIA: Faltan las siguientes columnas en el archivo CSV:

${missingNames}

Estas columnas se guardar\xE1n como NULL.

\xBFDesea continuar con la importaci\xF3n?`);
          if (!continuar) {
            return;
          }
        }
        const dataLines = lines.slice(1);
        if (dataLines.length === 0) {
          alert("El archivo CSV no contiene datos (solo cabeceras)");
          return;
        }
        const valid = [];
        const invalid = [];
        dataLines.forEach((line, lineIndex) => {
          const values = line.split(separator).map((v) => v.trim());
          const transformedRow = {};
          let rowError = "";
          configuredHeaders.forEach((header, configIndex) => {
            const csvColumnIndex = Object.keys(columnMapping).find((key) => columnMapping[parseInt(key)] === configIndex);
            if (csvColumnIndex !== void 0) {
              const value = values[parseInt(csvColumnIndex)];
              if (value !== void 0 && value !== null && value !== "") {
                try {
                  if (header.dataType === "FECHA") {
                    const dateValue = this.parseCSVDate(value, header.format || "dd/MM/yyyy");
                    if (dateValue) {
                      transformedRow[header.headerName] = dateValue;
                    } else {
                      rowError = `Valor no es fecha v\xE1lida para campo ${header.headerName}: ${value} (formato esperado: ${header.format || "dd/MM/yyyy"})`;
                      transformedRow[header.headerName] = value;
                    }
                  } else {
                    transformedRow[header.headerName] = value;
                  }
                } catch (error) {
                  rowError = `Error procesando columna ${header.headerName}: ${error}`;
                  transformedRow[header.headerName] = value;
                }
              } else {
                transformedRow[header.headerName] = null;
              }
            } else {
              transformedRow[header.headerName] = null;
            }
          });
          configuredHeaders.forEach((header) => {
            if (header.sourceField && header.regexPattern) {
              try {
                const sourceValue = transformedRow[header.sourceField];
                if (sourceValue) {
                  const regex = new RegExp(header.regexPattern);
                  const match = String(sourceValue).match(regex);
                  if (match) {
                    transformedRow[header.headerName] = match[1] || match[0];
                  } else {
                    transformedRow[header.headerName] = null;
                  }
                } else {
                  transformedRow[header.headerName] = null;
                }
              } catch (error) {
                console.error(`Error aplicando regex en ${header.headerName}:`, error);
                transformedRow[header.headerName] = null;
              }
            }
          });
          const hasData = Object.values(transformedRow).some((v) => v !== null && v !== "");
          if (!hasData) {
            invalid.push({
              error: "Fila vac\xEDa - no contiene datos",
              data: transformedRow
            });
          } else if (rowError) {
            invalid.push({
              error: rowError,
              data: transformedRow
            });
          } else {
            valid.push(transformedRow);
          }
        });
        this.importedData.set([...valid, ...invalid.map((i) => i.data)]);
        this.validData.set(valid);
        this.invalidData.set(invalid);
        console.log("Previsualizaci\xF3n de datos CSV:", {
          total: dataLines.length,
          v\u00E1lidos: valid.length,
          inv\u00E1lidos: invalid.length
        });
      } catch (error) {
        console.error("Error procesando el archivo CSV:", error);
        alert("Error al procesar el archivo CSV");
      }
    };
    reader.readAsText(file);
  }
  parseCSVDate(value, format) {
    try {
      const formatRegex = format.replace(/dd/g, "\\d{2}").replace(/MM/g, "\\d{2}").replace(/yyyy/g, "\\d{4}").replace(/yy/g, "\\d{2}").replace(/HH/g, "\\d{2}").replace(/mm/g, "\\d{2}").replace(/ss/g, "\\d{2}");
      const regex = new RegExp("^" + formatRegex + "$");
      if (regex.test(value.trim())) {
        return value.trim();
      }
      const dateParts = value.split(/[-\/\s:]/);
      if (dateParts.length < 3) {
        return null;
      }
      let day, month, year;
      let hours = 0, minutes = 0, seconds = 0;
      if (format.startsWith("dd")) {
        day = parseInt(dateParts[0]);
        month = parseInt(dateParts[1]);
        year = parseInt(dateParts[2]);
      } else if (format.startsWith("MM")) {
        month = parseInt(dateParts[0]);
        day = parseInt(dateParts[1]);
        year = parseInt(dateParts[2]);
      } else {
        year = parseInt(dateParts[0]);
        month = parseInt(dateParts[1]);
        day = parseInt(dateParts[2]);
      }
      if (dateParts.length > 3) {
        hours = parseInt(dateParts[3]) || 0;
        minutes = parseInt(dateParts[4]) || 0;
        seconds = parseInt(dateParts[5]) || 0;
      }
      if (isNaN(day) || isNaN(month) || isNaN(year) || day < 1 || day > 31 || month < 1 || month > 12 || year < 1900) {
        return null;
      }
      const date = new Date(year, month - 1, day, hours, minutes, seconds);
      if (isNaN(date.getTime())) {
        return null;
      }
      return this.formatDateByPattern(date, format);
    } catch (error) {
      console.error("Error parseando fecha:", error);
      return null;
    }
  }
  formatDateByPattern(date, pattern) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    let formatted = pattern;
    formatted = formatted.replace(/yyyy/g, String(year));
    formatted = formatted.replace(/yy/g, String(year).slice(-2));
    formatted = formatted.replace(/MM/g, month);
    formatted = formatted.replace(/dd/g, day);
    formatted = formatted.replace(/HH/g, hours);
    formatted = formatted.replace(/mm/g, minutes);
    formatted = formatted.replace(/ss/g, seconds);
    return formatted;
  }
  simplifyBackendError(error) {
    const rowMatch = error.match(/Fila (\d+):/);
    const rowNumber = rowMatch ? rowMatch[1] : "?";
    if (error.includes("doesn't have a default value")) {
      const fieldMatch = error.match(/Field '([^']+)'/);
      const fieldName = fieldMatch ? fieldMatch[1] : "desconocido";
      return `Fila ${rowNumber}: El campo '${fieldName}' est\xE1 vac\xEDo pero es obligatorio. Por favor, proporcione un valor.`;
    }
    if (error.includes("cannot be null") || error.includes("Column") && error.includes("cannot be null")) {
      const fieldMatch = error.match(/Column '([^']+)'/) || error.match(/Field '([^']+)'/);
      const fieldName = fieldMatch ? fieldMatch[1] : "desconocido";
      return `Fila ${rowNumber}: El campo '${fieldName}' no puede estar vac\xEDo. Es un campo obligatorio.`;
    }
    if (error.includes("Data too long") || error.includes("too long for column")) {
      const fieldMatch = error.match(/column '([^']+)'/) || error.match(/Field '([^']+)'/);
      const fieldName = fieldMatch ? fieldMatch[1] : "desconocido";
      return `Fila ${rowNumber}: El valor del campo '${fieldName}' es demasiado largo. Reduzca el tama\xF1o del texto.`;
    }
    if (error.includes("Incorrect date") || error.includes("Incorrect datetime")) {
      const fieldMatch = error.match(/column '([^']+)'/) || error.match(/Field '([^']+)'/);
      const fieldName = fieldMatch ? fieldMatch[1] : "desconocido";
      return `Fila ${rowNumber}: El campo '${fieldName}' tiene un formato de fecha incorrecto. Verifique el formato.`;
    }
    if (error.includes("Duplicate entry")) {
      const valueMatch = error.match(/Duplicate entry '([^']+)'/);
      const value = valueMatch ? valueMatch[1] : "desconocido";
      return `Fila ${rowNumber}: El valor '${value}' ya existe en la base de datos. No se permiten duplicados.`;
    }
    if (error.includes("Incorrect integer") || error.includes("Incorrect decimal")) {
      const fieldMatch = error.match(/column '([^']+)'/) || error.match(/Field '([^']+)'/);
      const fieldName = fieldMatch ? fieldMatch[1] : "desconocido";
      return `Fila ${rowNumber}: El campo '${fieldName}' debe contener un n\xFAmero v\xE1lido.`;
    }
    if (error.includes("foreign key constraint fails") || error.includes("Cannot add or update a child row")) {
      return `Fila ${rowNumber}: Hay una referencia a un dato que no existe en el sistema. Verifique los datos relacionados.`;
    }
    const simplifiedMatch = error.match(/Fila \d+: Error al insertar datos: (.+?)(?:\s*;|$)/);
    if (simplifiedMatch) {
      return `Fila ${rowNumber}: ${simplifiedMatch[1]}`;
    }
    return error.length > 200 ? error.substring(0, 200) + "..." : error;
  }
  clearImportedData() {
    this.importedData.set([]);
    this.validData.set([]);
    this.invalidData.set([]);
    this.backendErrors.set([]);
  }
  confirmImport() {
    const dataToImport = this.validData();
    if (dataToImport.length === 0) {
      alert("No hay datos v\xE1lidos para importar");
      return;
    }
    console.log("Datos transformados listos para importar:", dataToImport);
    console.log("Subcartera ID:", this.selectedSubPortfolioId);
    this.isLoading.set(true);
    this.backendErrors.set([]);
    this.headerConfigService.importData(this.selectedSubPortfolioId, "ACTUALIZACION", dataToImport).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        console.log("Respuesta del servidor:", response);
        if (response.errors && response.errors.length > 0) {
          const simplifiedErrors = response.errors.map((error) => this.simplifyBackendError(error));
          this.backendErrors.set(simplifiedErrors);
          console.error("Errores del backend:", response.errors);
        } else {
          alert(`\u2705 Se importaron ${response.insertedRows || dataToImport.length} filas de datos exitosamente a la tabla din\xE1mica.`);
          this.clearImportedData();
        }
      },
      error: (error) => {
        this.isLoading.set(false);
        console.error("Error HTTP al importar datos:", error);
        if (error.error?.errors && Array.isArray(error.error.errors)) {
          const simplifiedErrors = error.error.errors.map((err) => this.simplifyBackendError(err));
          this.backendErrors.set(simplifiedErrors);
        } else {
          this.backendErrors.set([`Error de conexi\xF3n: ${error.error?.message || error.message}`]);
        }
      }
    });
  }
};
_DailyLoadComponent.\u0275fac = function DailyLoadComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _DailyLoadComponent)(\u0275\u0275directiveInject(TenantService), \u0275\u0275directiveInject(PortfolioService), \u0275\u0275directiveInject(HeaderConfigurationService));
};
_DailyLoadComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _DailyLoadComponent, selectors: [["app-daily-load"]], decls: 43, vars: 14, consts: [[1, "fixed", "inset-0", "z-50", "flex", "items-center", "justify-center"], [1, "min-h-screen", "bg-gradient-to-br", "from-slate-900", "via-slate-800", "to-slate-900", "p-6"], [1, "max-w-7xl", "mx-auto"], [1, "mb-8"], [1, "flex", "items-center", "gap-2", "mb-2"], [1, "w-8", "h-8", "bg-orange-600", "rounded-lg", "flex", "items-center", "justify-center"], ["name", "calendar", 1, "text-white", 3, "size"], [1, "text-lg", "font-bold", "text-white"], [1, "text-xs", "text-gray-400"], [1, "bg-slate-900", "rounded-lg", "p-3", "shadow-sm", "border", "border-slate-800", "mb-6"], [1, "grid", "grid-cols-1", "md:grid-cols-3", "gap-3"], [1, "block", "text-xs", "font-semibold", "text-gray-300", "mb-1.5"], ["name", "building-2", 1, "inline", "mr-1", 3, "size"], [1, "w-full", "px-3", "py-2", "bg-slate-800", "border", "border-slate-700", "rounded-lg", "text-white", "text-sm", "focus:outline-none", "focus:ring-2", "focus:ring-green-500", 3, "ngModelChange", "ngModel"], [3, "value"], ["name", "folder", 1, "inline", "mr-1", 3, "size"], [1, "w-full", "px-3", "py-2", "bg-slate-800", "border", "border-slate-700", "rounded-lg", "text-white", "text-sm", "focus:outline-none", "focus:ring-2", "focus:ring-green-500", "disabled:opacity-50", "disabled:cursor-not-allowed", 3, "ngModelChange", "ngModel", "disabled"], ["name", "folder-tree", 1, "inline", "mr-1", 3, "size"], [1, "bg-slate-800", "border", "border-slate-700", "rounded-xl", "p-6"], [1, "bg-yellow-900/20", "border", "border-yellow-700/50", "rounded-xl", "p-6"], [1, "absolute", "inset-0", "bg-black/60", "backdrop-blur-sm"], [1, "relative", "bg-slate-800", "rounded-2xl", "p-8", "shadow-2xl", "border", "border-slate-700", "max-w-md", "w-full", "mx-4"], [1, "flex", "flex-col", "items-center", "gap-6"], [1, "relative"], [1, "w-16", "h-16", "border-4", "border-slate-600", "rounded-full"], [1, "absolute", "top-0", "left-0", "w-16", "h-16", "border-4", "border-green-500", "rounded-full", "border-t-transparent", "animate-spin"], [1, "text-center"], [1, "text-xl", "font-bold", "text-white", "mb-2"], [1, "text-gray-400", "text-sm"], [1, "w-full", "bg-slate-700", "rounded-full", "h-2", "overflow-hidden"], [1, "bg-gradient-to-r", "from-green-500", "to-emerald-400", "h-full", "rounded-full", "animate-pulse", 2, "width", "100%"], [1, "text-xs", "text-gray-500"], [1, "flex", "flex-col", "sm:flex-row", "sm:items-center", "sm:justify-between", "gap-4", "mb-4"], [1, "text-xl", "font-bold", "text-white"], [1, "text-gray-400", "text-sm", "mt-1"], [1, "flex", "flex-col", "sm:flex-row", "gap-2"], [1, "flex", "items-center", "gap-2", "px-4", "py-2", "bg-purple-600", "text-white", "rounded-lg", "hover:bg-purple-700", "transition-all", "font-medium", "text-sm", "cursor-pointer", 3, "click"], ["name", "file-text", 3, "size"], [1, "flex", "items-center", "gap-2", "px-4", "py-2", "bg-green-600", "text-white", "rounded-lg", "hover:bg-green-700", "transition-all", "font-medium", "cursor-pointer", "text-sm"], ["name", "folder-open", 3, "size"], ["type", "file", "accept", ".xlsx,.xls,.csv", 1, "hidden", 3, "change"], [1, "bg-slate-900", "border", "border-slate-700", "rounded-lg", "overflow-hidden"], [1, "px-4", "py-2", "bg-slate-800", "border-b", "border-slate-700"], [1, "flex", "items-center", "justify-between"], [1, "flex", "items-center", "gap-2"], ["name", "table", 1, "text-green-400", 3, "size"], [1, "text-sm", "font-semibold", "text-gray-300"], [1, "flex", "items-center", "gap-4"], [1, "overflow-auto", 2, "max-height", "500px"], [1, "w-full", "text-xs", "border-collapse"], [1, "bg-slate-800", "sticky", "top-0", "z-10"], [1, "px-3", "py-2", "text-left", "font-semibold", "text-gray-300", "border-r", "border-slate-700", "bg-slate-800", 2, "min-width", "50px"], [1, "px-3", "py-2", "text-left", "font-semibold", "text-gray-300", "border-r", "border-slate-700", "bg-slate-800", 2, "min-width", "80px"], [1, "px-3", "py-2", "text-left", "font-semibold", "text-gray-300", "border-r", "border-slate-700", "bg-slate-800", 2, "min-width", "150px", 3, "title"], [1, "border-b", "border-slate-700"], [1, "space-y-4", "mt-4"], [1, "text-xs", "font-bold", "text-white"], ["name", "check-circle", 1, "text-green-400", 3, "size"], [1, "text-xs", "font-bold", "text-green-400"], ["name", "x-circle", 1, "text-red-400", 3, "size"], [1, "text-xs", "font-bold", "text-red-400"], [1, "flex", "items-center", "gap-1.5"], ["name", "sparkles", 1, "text-amber-400", "flex-shrink-0", 3, "size", "title"], [1, "flex", "flex-col", "gap-0.5"], [1, "font-semibold"], [1, "text-[10px]", "text-green-400", "font-normal"], [1, "px-3", "py-8", "text-center", "text-gray-500", "bg-slate-800/30"], [1, "flex", "flex-col", "items-center", "gap-2"], ["name", "inbox", 1, "text-gray-600", 3, "size"], [1, "text-sm"], [1, "border-b", "border-slate-700", "hover:bg-slate-800/50"], [1, "border-b", "border-slate-700", "hover:bg-slate-800/50", "bg-red-900/10"], [1, "px-3", "py-2", "text-gray-400", "border-r", "border-slate-700", "bg-slate-800/30"], [1, "px-3", "py-2", "border-r", "border-slate-700"], [1, "inline-flex", "items-center", "gap-1", "px-2", "py-0.5", "bg-green-900/30", "text-green-400", "rounded", "text-[10px]"], ["name", "check", 3, "size"], [1, "px-3", "py-2", "text-gray-300", "border-r", "border-slate-700", 3, "text-gray-500"], [1, "px-3", "py-2", "text-gray-300", "border-r", "border-slate-700"], [1, "inline-flex", "items-center", "gap-1", "px-2", "py-0.5", "bg-red-900/30", "text-red-400", "rounded", "text-[10px]", 3, "title"], ["name", "x", 3, "size"], [1, "bg-red-900/30", "border-2", "border-red-700", "rounded-xl", "p-4"], [1, "bg-red-900/20", "border", "border-red-700/50", "rounded-lg", "p-4"], [1, "flex", "justify-between", "items-center"], [1, "text-sm", "text-gray-400"], [1, "text-red-400"], [1, "flex", "gap-3"], [1, "px-4", "py-2", "bg-slate-700", "text-white", "rounded-lg", "hover:bg-slate-600", "transition-all", "font-medium", "text-sm", 3, "click"], [1, "px-4", "py-2", "bg-green-600", "text-white", "rounded-lg", "hover:bg-green-700", "transition-all", "font-medium", "text-sm"], [1, "flex", "items-start", "gap-3"], ["name", "x-circle", 1, "text-red-500", "flex-shrink-0", "mt-1", 3, "size"], [1, "flex-1"], [1, "text-red-500", "font-bold", "text-lg", "mb-2"], [1, "text-red-300", "text-sm", "mb-3"], [1, "bg-red-950/50", "rounded-lg", "p-3", "max-h-60", "overflow-y-auto"], [1, "text-red-200", "text-xs", "font-mono", "mb-2", "pb-2", "border-b", "border-red-800/50", "last:border-0"], ["name", "alert-circle", 1, "text-red-400", "mt-0.5", 3, "size"], [1, "text-red-400", "font-semibold", "mb-2"], [1, "space-y-1"], [1, "text-green-400"], [1, "px-4", "py-2", "bg-green-600", "text-white", "rounded-lg", "hover:bg-green-700", "transition-all", "font-medium", "text-sm", 3, "click"], ["name", "alert-circle", 1, "text-yellow-500", "mt-0.5", 3, "size"], [1, "text-yellow-500", "font-semibold", "mb-1"]], template: function DailyLoadComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, DailyLoadComponent_Conditional_0_Template, 16, 0, "div", 0);
    \u0275\u0275elementStart(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "div", 4)(5, "div", 5);
    \u0275\u0275element(6, "lucide-angular", 6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "div")(8, "h1", 7);
    \u0275\u0275text(9, "Carga Diaria");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "p", 8);
    \u0275\u0275text(11, "Importaci\xF3n diaria de actualizaciones");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(12, "div", 9)(13, "div", 10)(14, "div")(15, "label", 11);
    \u0275\u0275element(16, "lucide-angular", 12);
    \u0275\u0275text(17, " Proveedor ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "select", 13);
    \u0275\u0275twoWayListener("ngModelChange", function DailyLoadComponent_Template_select_ngModelChange_18_listener($event) {
      \u0275\u0275twoWayBindingSet(ctx.selectedTenantId, $event) || (ctx.selectedTenantId = $event);
      return $event;
    });
    \u0275\u0275listener("ngModelChange", function DailyLoadComponent_Template_select_ngModelChange_18_listener($event) {
      return ctx.onTenantChange($event);
    });
    \u0275\u0275elementStart(19, "option", 14);
    \u0275\u0275text(20, "Seleccione un proveedor...");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(21, DailyLoadComponent_For_22_Template, 2, 3, "option", 14, _forTrack0);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(23, "div")(24, "label", 11);
    \u0275\u0275element(25, "lucide-angular", 15);
    \u0275\u0275text(26, " Cartera ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "select", 16);
    \u0275\u0275twoWayListener("ngModelChange", function DailyLoadComponent_Template_select_ngModelChange_27_listener($event) {
      \u0275\u0275twoWayBindingSet(ctx.selectedPortfolioId, $event) || (ctx.selectedPortfolioId = $event);
      return $event;
    });
    \u0275\u0275listener("ngModelChange", function DailyLoadComponent_Template_select_ngModelChange_27_listener($event) {
      return ctx.onPortfolioChange($event);
    });
    \u0275\u0275elementStart(28, "option", 14);
    \u0275\u0275text(29, "Seleccione una cartera...");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(30, DailyLoadComponent_For_31_Template, 2, 3, "option", 14, _forTrack0);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(32, "div")(33, "label", 11);
    \u0275\u0275element(34, "lucide-angular", 17);
    \u0275\u0275text(35, " Subcartera ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(36, "select", 16);
    \u0275\u0275twoWayListener("ngModelChange", function DailyLoadComponent_Template_select_ngModelChange_36_listener($event) {
      \u0275\u0275twoWayBindingSet(ctx.selectedSubPortfolioId, $event) || (ctx.selectedSubPortfolioId = $event);
      return $event;
    });
    \u0275\u0275listener("ngModelChange", function DailyLoadComponent_Template_select_ngModelChange_36_listener($event) {
      return ctx.onSubPortfolioChange($event);
    });
    \u0275\u0275elementStart(37, "option", 14);
    \u0275\u0275text(38, "Seleccione una subcartera...");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(39, DailyLoadComponent_For_40_Template, 2, 3, "option", 14, _forTrack0);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275conditionalCreate(41, DailyLoadComponent_Conditional_41_Template, 39, 7, "div", 18)(42, DailyLoadComponent_Conditional_42_Template, 8, 1, "div", 19);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275conditional(ctx.isLoading() ? 0 : -1);
    \u0275\u0275advance(6);
    \u0275\u0275property("size", 16);
    \u0275\u0275advance(10);
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
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx.selectedSubPortfolioId > 0 && ctx.headersAreSaved() ? 41 : ctx.selectedSubPortfolioId > 0 && !ctx.headersAreSaved() ? 42 : -1);
  }
}, dependencies: [CommonModule, FormsModule, NgSelectOption, \u0275NgSelectMultipleOption, SelectControlValueAccessor, NgControlStatus, NgModel, LucideAngularModule, LucideAngularComponent], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n}\n/*# sourceMappingURL=daily-load.component.css.map */"] });
var DailyLoadComponent = _DailyLoadComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DailyLoadComponent, [{
    type: Component,
    args: [{ selector: "app-daily-load", standalone: true, imports: [CommonModule, FormsModule, LucideAngularModule], template: `
    <!-- Loading Overlay Modal -->
    @if (isLoading()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center">
        <!-- Backdrop with blur -->
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

        <!-- Modal Content -->
        <div class="relative bg-slate-800 rounded-2xl p-8 shadow-2xl border border-slate-700 max-w-md w-full mx-4">
          <div class="flex flex-col items-center gap-6">
            <!-- Spinner Animation -->
            <div class="relative">
              <div class="w-16 h-16 border-4 border-slate-600 rounded-full"></div>
              <div class="absolute top-0 left-0 w-16 h-16 border-4 border-green-500 rounded-full border-t-transparent animate-spin"></div>
            </div>

            <!-- Loading Text -->
            <div class="text-center">
              <h3 class="text-xl font-bold text-white mb-2">Importando datos...</h3>
              <p class="text-gray-400 text-sm">Por favor espere, este proceso puede tardar varios minutos dependiendo de la cantidad de registros.</p>
            </div>

            <!-- Progress indicator -->
            <div class="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
              <div class="bg-gradient-to-r from-green-500 to-emerald-400 h-full rounded-full animate-pulse" style="width: 100%"></div>
            </div>

            <p class="text-xs text-gray-500">No cierre esta ventana</p>
          </div>
        </div>
      </div>
    }

    <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="mb-8">
          <div class="flex items-center gap-2 mb-2">
            <div class="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
              <lucide-angular name="calendar" [size]="16" class="text-white"></lucide-angular>
            </div>
            <div>
              <h1 class="text-lg font-bold text-white">Carga Diaria</h1>
              <p class="text-xs text-gray-400">Importaci\xF3n diaria de actualizaciones</p>
            </div>
          </div>
        </div>

        <!-- Selectores en Cascada -->
        <div class="bg-slate-900 rounded-lg p-3 shadow-sm border border-slate-800 mb-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <!-- Proveedor -->
            <div>
              <label class="block text-xs font-semibold text-gray-300 mb-1.5">
                <lucide-angular name="building-2" [size]="16" class="inline mr-1"></lucide-angular>
                Proveedor
              </label>
              <select [(ngModel)]="selectedTenantId"
                      (ngModelChange)="onTenantChange($event)"
                      class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                <option [value]="0">Seleccione un proveedor...</option>
                @for (tenant of tenants(); track tenant.id) {
                  <option [value]="tenant.id">{{ tenant.tenantCode }} - {{ tenant.tenantName }}</option>
                }
              </select>
            </div>

            <!-- Cartera -->
            <div>
              <label class="block text-xs font-semibold text-gray-300 mb-1.5">
                <lucide-angular name="folder" [size]="16" class="inline mr-1"></lucide-angular>
                Cartera
              </label>
              <select [(ngModel)]="selectedPortfolioId"
                      (ngModelChange)="onPortfolioChange($event)"
                      [disabled]="selectedTenantId === 0"
                      class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed">
                <option [value]="0">Seleccione una cartera...</option>
                @for (portfolio of portfolios(); track portfolio.id) {
                  <option [value]="portfolio.id">{{ portfolio.portfolioCode }} - {{ portfolio.portfolioName }}</option>
                }
              </select>
            </div>

            <!-- Subcartera -->
            <div>
              <label class="block text-xs font-semibold text-gray-300 mb-1.5">
                <lucide-angular name="folder-tree" [size]="16" class="inline mr-1"></lucide-angular>
                Subcartera
              </label>
              <select [(ngModel)]="selectedSubPortfolioId"
                      (ngModelChange)="onSubPortfolioChange($event)"
                      [disabled]="selectedPortfolioId === 0"
                      class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed">
                <option [value]="0">Seleccione una subcartera...</option>
                @for (sp of subPortfolios(); track sp.id) {
                  <option [value]="sp.id">{{ sp.subPortfolioCode }} - {{ sp.subPortfolioName }}</option>
                }
              </select>
            </div>
          </div>
        </div>

        @if (selectedSubPortfolioId > 0 && headersAreSaved()) {
          <!-- \xC1rea de carga de datos -->
          <div class="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <!-- Header y Botones de acci\xF3n -->
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div>
                <h2 class="text-xl font-bold text-white">Importaci\xF3n de Datos</h2>
                <p class="text-gray-400 text-sm mt-1">
                  Sube un archivo Excel con los datos para esta subcartera
                </p>
              </div>
              <div class="flex flex-col sm:flex-row gap-2">
                <button
                  (click)="downloadDataTemplate()"
                  class="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all font-medium text-sm cursor-pointer">
                  <lucide-angular name="file-text" [size]="16"></lucide-angular>
                  <span>Descargar Plantilla</span>
                </button>

                <label class="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-medium cursor-pointer text-sm">
                  <lucide-angular name="folder-open" [size]="16"></lucide-angular>
                  <span>Importar Datos</span>
                  <input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    (change)="onDataFileSelected($event)"
                    class="hidden">
                </label>
              </div>
            </div>

            <!-- Tabla de previsualizaci\xF3n estilo MySQL Workbench -->
            <div class="bg-slate-900 border border-slate-700 rounded-lg overflow-hidden">
              <div class="px-4 py-2 bg-slate-800 border-b border-slate-700">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <lucide-angular name="table" [size]="16" class="text-green-400"></lucide-angular>
                    <span class="text-sm font-semibold text-gray-300">
                      Tabla de Datos
                    </span>
                  </div>
                  @if (importedData().length > 0) {
                    <div class="flex items-center gap-4">
                      <div class="flex items-center gap-2">
                        <span class="text-xs text-gray-500">Total:</span>
                        <span class="text-xs font-bold text-white">{{ importedData().length }}</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <lucide-angular name="check-circle" [size]="12" class="text-green-400"></lucide-angular>
                        <span class="text-xs font-bold text-green-400">{{ validData().length }}</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <lucide-angular name="x-circle" [size]="12" class="text-red-400"></lucide-angular>
                        <span class="text-xs font-bold text-red-400">{{ invalidData().length }}</span>
                      </div>
                    </div>
                  } @else {
                    <span class="text-xs text-gray-500">{{ previewHeaders().length }} columnas</span>
                  }
                </div>
              </div>
              <div class="overflow-auto" style="max-height: 500px;">
                <table class="w-full text-xs border-collapse">
                  <thead class="bg-slate-800 sticky top-0 z-10">
                    <tr>
                      <th class="px-3 py-2 text-left font-semibold text-gray-300 border-r border-slate-700 bg-slate-800" style="min-width: 50px;">#</th>
                      @if (importedData().length > 0) {
                        <th class="px-3 py-2 text-left font-semibold text-gray-300 border-r border-slate-700 bg-slate-800" style="min-width: 80px;">Estado</th>
                      }
                      @for (header of previewHeaders(); track header.id) {
                        <th class="px-3 py-2 text-left font-semibold text-gray-300 border-r border-slate-700 bg-slate-800"
                            style="min-width: 150px;"
                            [title]="header.dataType + (header.format ? ' (' + header.format + ')' : '')">
                          <div class="flex items-center gap-1.5">
                            @if (header.sourceField && header.regexPattern) {
                              <lucide-angular
                                name="sparkles"
                                [size]="12"
                                class="text-amber-400 flex-shrink-0"
                                [title]="'Campo transformado desde: ' + header.sourceField">
                              </lucide-angular>
                            }
                            <div class="flex flex-col gap-0.5">
                              <span class="font-semibold">{{ header.headerName }}</span>
                              <span class="text-[10px] text-green-400 font-normal">{{ header.dataType }}{{ header.format ? ' (' + header.format + ')' : '' }}</span>
                            </div>
                          </div>
                        </th>
                      }
                    </tr>
                  </thead>
                  <tbody>
                    @if (importedData().length === 0) {
                      <!-- Fila vac\xEDa cuando no hay datos -->
                      <tr class="border-b border-slate-700">
                        <td class="px-3 py-8 text-center text-gray-500 bg-slate-800/30" [attr.colspan]="previewHeaders().length + 1">
                          <div class="flex flex-col items-center gap-2">
                            <lucide-angular name="inbox" [size]="24" class="text-gray-600"></lucide-angular>
                            <span class="text-sm">No hay datos. Importa un archivo Excel para ver los datos aqu\xED.</span>
                          </div>
                        </td>
                      </tr>
                    } @else {
                      <!-- Datos v\xE1lidos -->
                      @for (row of validData(); track $index; let i = $index) {
                        <tr class="border-b border-slate-700 hover:bg-slate-800/50">
                          <td class="px-3 py-2 text-gray-400 border-r border-slate-700 bg-slate-800/30">{{ i + 1 }}</td>
                          <td class="px-3 py-2 border-r border-slate-700">
                            <span class="inline-flex items-center gap-1 px-2 py-0.5 bg-green-900/30 text-green-400 rounded text-[10px]">
                              <lucide-angular name="check" [size]="10"></lucide-angular>
                              V\xE1lido
                            </span>
                          </td>
                          @for (header of previewHeaders(); track header.id) {
                            <td class="px-3 py-2 text-gray-300 border-r border-slate-700"
                                [class.text-gray-500]="!row[header.headerName]">
                              {{ row[header.headerName] || 'NULL' }}
                            </td>
                          }
                        </tr>
                      }
                      <!-- Datos inv\xE1lidos -->
                      @for (row of invalidData(); track $index; let i = $index) {
                        <tr class="border-b border-slate-700 hover:bg-slate-800/50 bg-red-900/10">
                          <td class="px-3 py-2 text-gray-400 border-r border-slate-700 bg-slate-800/30">{{ validData().length + i + 1 }}</td>
                          <td class="px-3 py-2 border-r border-slate-700">
                            <span class="inline-flex items-center gap-1 px-2 py-0.5 bg-red-900/30 text-red-400 rounded text-[10px]"
                                  [title]="row.error">
                              <lucide-angular name="x" [size]="10"></lucide-angular>
                              Error
                            </span>
                          </td>
                          @for (header of previewHeaders(); track header.id) {
                            <td class="px-3 py-2 text-gray-300 border-r border-slate-700"
                                [class.text-gray-500]="!row.data[header.headerName]">
                              {{ row.data[header.headerName] || 'NULL' }}
                            </td>
                          }
                        </tr>
                      }
                    }
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Mensaje de error para datos inv\xE1lidos y botones de acci\xF3n -->
            @if (importedData().length > 0) {
              <div class="space-y-4 mt-4">
                <!-- Error Display Section - Backend Errors -->
                @if (backendErrors().length > 0) {
                  <div class="bg-red-900/30 border-2 border-red-700 rounded-xl p-4">
                    <div class="flex items-start gap-3">
                      <lucide-angular name="x-circle" [size]="24" class="text-red-500 flex-shrink-0 mt-1"></lucide-angular>
                      <div class="flex-1">
                        <h3 class="text-red-500 font-bold text-lg mb-2">Errores al Importar Datos</h3>
                        <p class="text-red-300 text-sm mb-3">
                          La importaci\xF3n fall\xF3 debido a los siguientes errores. No se insert\xF3 ning\xFAn dato.
                        </p>
                        <div class="bg-red-950/50 rounded-lg p-3 max-h-60 overflow-y-auto">
                          @for (error of backendErrors(); track $index) {
                            <div class="text-red-200 text-xs font-mono mb-2 pb-2 border-b border-red-800/50 last:border-0">
                              {{ error }}
                            </div>
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                }

                @if (invalidData().length > 0) {
                  <div class="bg-red-900/20 border border-red-700/50 rounded-lg p-4">
                    <div class="flex items-start gap-3">
                      <lucide-angular name="alert-circle" [size]="20" class="text-red-400 mt-0.5"></lucide-angular>
                      <div class="flex-1">
                        <h3 class="text-red-400 font-semibold mb-2">Registros con Errores</h3>
                        <div class="space-y-1">
                          @for (row of invalidData(); track $index; let i = $index) {
                            <p class="text-sm text-gray-400">
                              <span class="text-red-400">Fila {{ validData().length + i + 1 }}:</span> {{ row.error }}
                            </p>
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                }

                <!-- Botones de acci\xF3n -->
                <div class="flex justify-between items-center">
                  <div class="text-sm text-gray-400">
                    @if (backendErrors().length > 0) {
                      <span class="text-red-400">La importaci\xF3n fall\xF3. Corrija los errores e intente nuevamente.</span>
                    } @else if (validData().length > 0) {
                      <span class="text-green-400">{{ validData().length }} registro(s)</span> listo(s) para importar
                    } @else {
                      <span class="text-red-400">No hay registros v\xE1lidos para importar</span>
                    }
                  </div>
                  <div class="flex gap-3">
                    <button
                      (click)="clearImportedData()"
                      class="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-all font-medium text-sm">
                      Cancelar
                    </button>
                    @if (validData().length > 0 && backendErrors().length === 0) {
                      <button
                        (click)="confirmImport()"
                        class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-medium text-sm">
                        Confirmar Importaci\xF3n
                      </button>
                    }
                  </div>
                </div>
              </div>
            }
          </div>
        } @else if (selectedSubPortfolioId > 0 && !headersAreSaved()) {
          <!-- Mensaje de advertencia -->
          <div class="bg-yellow-900/20 border border-yellow-700/50 rounded-xl p-6">
            <div class="flex items-start gap-3">
              <lucide-angular name="alert-circle" [size]="20" class="text-yellow-500 mt-0.5"></lucide-angular>
              <div>
                <h3 class="text-yellow-500 font-semibold mb-1">No hay cabeceras configuradas</h3>
                <p class="text-gray-400 text-sm">
                  Primero debes configurar las cabeceras para esta subcartera en el m\xF3dulo de Mantenimiento.
                </p>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `, styles: ["/* angular:styles/component:css;219558ef63f119a92210704329b58a3cdceaa4fb296db559e672f74512827dc7;C:/Users/HP/Documents/Kubito-2.0-v1/cashi-discador-frontend/cashi-discador-frontend/src/app/data-load/components/daily-load/daily-load.component.ts */\n:host {\n  display: block;\n}\n/*# sourceMappingURL=daily-load.component.css.map */\n"] }]
  }], () => [{ type: TenantService }, { type: PortfolioService }, { type: HeaderConfigurationService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(DailyLoadComponent, { className: "DailyLoadComponent", filePath: "src/app/data-load/components/daily-load/daily-load.component.ts", lineNumber: 361 });
})();
export {
  DailyLoadComponent
};
//# sourceMappingURL=chunk-KWYRQBOM.js.map
