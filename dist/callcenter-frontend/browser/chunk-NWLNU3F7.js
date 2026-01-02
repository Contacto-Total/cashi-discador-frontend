import {
  CdkDrag,
  CdkDragHandle,
  DragDropModule
} from "./chunk-2M7QB47Q.js";
import {
  AgreementsService
} from "./chunk-B2EH5ADJ.js";
import "./chunk-XG3JRR2G.js";
import "./chunk-Q5NKAKZL.js";
import {
  ThemeService
} from "./chunk-D3RWIMJ4.js";
import {
  DefaultValueAccessor,
  FormArray,
  FormArrayName,
  FormBuilder,
  FormControlName,
  FormGroupDirective,
  FormGroupName,
  FormsModule,
  MaxLengthValidator,
  MinValidator,
  NgControlStatus,
  NgControlStatusGroup,
  NumberValueAccessor,
  ReactiveFormsModule,
  Validators,
  ɵNgNoValidate
} from "./chunk-GRJ7XAPD.js";
import {
  LucideAngularComponent,
  LucideAngularModule
} from "./chunk-RFBUEVFE.js";
import "./chunk-QF774CZR.js";
import {
  CommonModule,
  Component,
  NgClass,
  NgForOf,
  NgIf,
  effect,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵdefineComponent,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementContainerEnd,
  ɵɵelementContainerStart,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2
} from "./chunk-CTRHJBBW.js";

// src/app/features/legacy/agreements/pages/agreements-page/agreements-page.component.ts
function AgreementsPageComponent_div_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 19);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" Tramo: ", ctx_r0.tramoDetectado, " ");
  }
}
function AgreementsPageComponent_div_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 20);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275classProp("bg-blue-50", ctx_r0.selectedEntidad === "financiera_oh")("border-blue-500", ctx_r0.selectedEntidad === "financiera_oh")("text-blue-700", ctx_r0.selectedEntidad === "financiera_oh")("bg-purple-50", ctx_r0.selectedEntidad === "nsoluciones")("border-purple-500", ctx_r0.selectedEntidad === "nsoluciones")("text-purple-700", ctx_r0.selectedEntidad === "nsoluciones")("border", true);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" Plantilla: ", ctx_r0.selectedEntidad === "financiera_oh" ? "Financiera Oh" : "NSoluciones", " ");
  }
}
function AgreementsPageComponent_span_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 21);
  }
}
function AgreementsPageComponent_div_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 22)(1, "div", 23)(2, "div", 24);
    \u0275\u0275element(3, "lucide-angular", 25);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "h3", 26);
    \u0275\u0275text(5, " Busca un cliente para comenzar ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p", 27);
    \u0275\u0275text(7, " Ingresa el DNI del cliente en el buscador para cargar autom\xE1ticamente los datos y generar el acuerdo de pago. ");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275classProp("bg-white", !ctx_r0.isDarkMode)("bg-slate-800", ctx_r0.isDarkMode);
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 48);
    \u0275\u0275advance();
    \u0275\u0275classProp("text-slate-900", !ctx_r0.isDarkMode)("text-white", ctx_r0.isDarkMode);
    \u0275\u0275advance(2);
    \u0275\u0275classProp("text-slate-600", !ctx_r0.isDarkMode)("text-slate-400", ctx_r0.isDarkMode);
  }
}
function AgreementsPageComponent_div_23_div_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 82);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_2_0;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.formatDisplayDate((tmp_2_0 = ctx_r0.agreementForm.get("fechaActual")) == null ? null : tmp_2_0.value), " ");
  }
}
function AgreementsPageComponent_div_23_div_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 83);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.getFieldError("fechaActual"), " ");
  }
}
function AgreementsPageComponent_div_23_ng_container_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275text(1, " ACUERDO DE PAGO - CAMPA\xD1A LIMPIA TU DEUDA ");
    \u0275\u0275elementContainerEnd();
  }
}
function AgreementsPageComponent_div_23_ng_container_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275text(1, " ACUERDO DE PAGO - CANCELACI\xD3N TOTAL ");
    \u0275\u0275elementContainerEnd();
  }
}
function AgreementsPageComponent_div_23_div_49_span_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 85);
    \u0275\u0275text(1, " (Fecha del 1er pago) ");
    \u0275\u0275elementEnd();
  }
}
function AgreementsPageComponent_div_23_div_49_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 82);
    \u0275\u0275text(1);
    \u0275\u0275template(2, AgreementsPageComponent_div_23_div_49_span_2_Template, 2, 0, "span", 84);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_2_0;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.formatDisplayDate((tmp_2_0 = ctx_r0.agreementForm.get("fechaCompromiso")) == null ? null : tmp_2_0.value), " ");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.formasDePagoArray.length > 0);
  }
}
function AgreementsPageComponent_div_23_div_50_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 83);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.getFieldError("fechaCompromiso"), " ");
  }
}
function AgreementsPageComponent_div_23_tr_84_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr", 86)(1, "td", 87)(2, "div", 88)(3, "div", 89)(4, "strong");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "div", 90)(8, "button", 91);
    \u0275\u0275listener("click", function AgreementsPageComponent_div_23_tr_84_Template_button_click_8_listener() {
      const i_r4 = \u0275\u0275restoreView(_r3).index;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.abrirEditorFormaPago(i_r4));
    });
    \u0275\u0275text(9, "Editar");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "button", 92);
    \u0275\u0275listener("click", function AgreementsPageComponent_div_23_tr_84_Template_button_click_10_listener() {
      const i_r4 = \u0275\u0275restoreView(_r3).index;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.removeFormaPago(i_r4));
    });
    \u0275\u0275text(11, "Eliminar");
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    let tmp_6_0;
    const forma_r5 = ctx.$implicit;
    const i_r4 = ctx.index;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275property("formGroupName", i_r4);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate2("", i_r4 + 1, "", ctx_r0.getOrdinalSuffix(i_r4 + 1), " PAGO");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2(" \u2014 ", (tmp_6_0 = forma_r5.get("fechaPago")) == null ? null : tmp_6_0.value, " \u2014 S/ ", (tmp_6_0 = forma_r5.get("montoPago")) == null ? null : tmp_6_0.value, " SOLES ");
    \u0275\u0275advance(4);
    \u0275\u0275property("disabled", ctx_r0.formasDePagoArray.length <= 1);
  }
}
function AgreementsPageComponent_div_23_tr_85_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 93)(2, "div", 94);
    \u0275\u0275text(3, "Observaci\xF3n:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 95);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r0.observacionTexto);
  }
}
function AgreementsPageComponent_div_23_tr_86_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 96)(2, "em");
    \u0275\u0275text(3, "No hay formas de pago definidas.");
    \u0275\u0275elementEnd()()();
  }
}
function AgreementsPageComponent_div_23_div_87_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 97);
    \u0275\u0275text(1, " Acercarse con su DNI, tarjeta Oh! y este documento; Indicar en los cajeros que va a realizar un ");
    \u0275\u0275elementStart(2, "strong");
    \u0275\u0275text(3, "pago o abono");
    \u0275\u0275elementEnd();
    \u0275\u0275text(4, " a su Tarjeta Oh por el monto ");
    \u0275\u0275elementStart(5, "strong");
    \u0275\u0275text(6, "APROBADO");
    \u0275\u0275elementEnd();
    \u0275\u0275text(7, ", en caso de no tener la tarjeta puede pagar con el n\xFAmero de cuenta de su tarjeta consignada en la parte superior de este documento. ");
    \u0275\u0275elementEnd();
  }
}
function AgreementsPageComponent_div_23_ng_container_97_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275text(1, " Con su n\xFAmero de DNI ");
    \u0275\u0275elementContainerEnd();
  }
}
function AgreementsPageComponent_div_23_ng_container_98_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275text(1, " PAGO POR SERVICIO - NSOLUCIONES CONSULTING ");
    \u0275\u0275elementContainerEnd();
  }
}
function AgreementsPageComponent_div_23_ng_container_108_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275text(1, " Presentando su DNI ");
    \u0275\u0275elementContainerEnd();
  }
}
function AgreementsPageComponent_div_23_ng_container_109_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275text(1, " PAGO POR SERVICIO - NSOLUCIONES CONSULTING ");
    \u0275\u0275elementContainerEnd();
  }
}
function AgreementsPageComponent_div_23_ng_container_113_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275text(1, " Enviar foto del voucher de transacci\xF3n al WhatsApp corporativo de Financiera Oh para su validaci\xF3n, registro, cancelaci\xF3n de deuda y retiro de cobranza. ");
    \u0275\u0275elementContainerEnd();
  }
}
function AgreementsPageComponent_div_23_ng_container_114_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275text(1, " Enviar foto del v\xF3ucher de transacci\xF3n al WhatsApp corporativo de NSOLUCIONES para su validaci\xF3n, registro, cancelaci\xF3n de deuda y retiro de cobranza. ");
    \u0275\u0275elementContainerEnd();
  }
}
function AgreementsPageComponent_div_23_ng_container_118_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275text(1, " A partir de 15 d\xEDas h\xE1biles de la cancelaci\xF3n ya puede solicitar el tr\xE1mite su carta de no adeudo escribiendo al ");
    \u0275\u0275elementStart(2, "strong");
    \u0275\u0275text(3, "WhatsApp: 980732405 - OPCION 2");
    \u0275\u0275elementEnd();
    \u0275\u0275text(4, " o llamando al (01) 619-4800; (01) 631-5400; para que lo pueda recoger en plataforma o solicitar el env\xEDo a su correo. ");
    \u0275\u0275elementContainerEnd();
  }
}
function AgreementsPageComponent_div_23_ng_container_119_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275text(1, " A partir de 24 HORAS posterior al pago ya podr\xE1 solicitar el tr\xE1mite su carta de no adeudo escribiendo al WhatsApp: 915326798 para coordinar el env\xEDo a su correo. ");
    \u0275\u0275elementContainerEnd();
  }
}
function AgreementsPageComponent_div_23_ng_container_121_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275text(1, " Si desea mayor informaci\xF3n, comun\xEDquese a los siguientes n\xFAmeros de contacto directo: V\xEDa Telf.: o v\xEDa WhatsApp: ");
    \u0275\u0275elementStart(2, "strong");
    \u0275\u0275text(3, "968437436");
    \u0275\u0275elementEnd();
    \u0275\u0275elementContainerEnd();
  }
}
function AgreementsPageComponent_div_23_ng_container_122_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275text(1, " Si desea mayor informaci\xF3n, comun\xEDquese a los siguientes n\xFAmeros de contacto directo: V\xEDa Telf.: o v\xEDa WhatsApp: ");
    \u0275\u0275elementStart(2, "strong");
    \u0275\u0275text(3, "915257493");
    \u0275\u0275elementEnd();
    \u0275\u0275elementContainerEnd();
  }
}
function AgreementsPageComponent_div_23_ng_container_128_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275elementStart(1, "div", 79);
    \u0275\u0275text(2, "LOGO BCP");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 98)(4, "strong");
    \u0275\u0275text(5, "Romina Tapia Albinagorta \xA0\xA0\xA0\xA0\xA0\xA0 Dpto.");
    \u0275\u0275elementEnd();
    \u0275\u0275element(6, "br");
    \u0275\u0275elementStart(7, "strong");
    \u0275\u0275text(8, "COBRANZAS Oh!");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementContainerEnd();
  }
}
function AgreementsPageComponent_div_23_ng_container_129_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275elementStart(1, "div", 79);
    \u0275\u0275text(2, "FIRMA");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 98)(4, "strong");
    \u0275\u0275text(5, "Emily Dayana Saenz Martinez");
    \u0275\u0275elementEnd();
    \u0275\u0275element(6, "br");
    \u0275\u0275elementStart(7, "strong");
    \u0275\u0275text(8, "NSOLUCIONES CONSULTING S.A.C");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementContainerEnd();
  }
}
function AgreementsPageComponent_div_23_div_140_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 99)(1, "div", 100)(2, "div", 101)(3, "h3");
    \u0275\u0275text(4, "Editar forma de pago");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "button", 102);
    \u0275\u0275listener("click", function AgreementsPageComponent_div_23_div_140_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.cerrarEditor());
    });
    \u0275\u0275text(6, "\xD7");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 103)(8, "div", 104)(9, "label", 105);
    \u0275\u0275text(10, "\u{1F4C5} Fecha del pago");
    \u0275\u0275elementEnd();
    \u0275\u0275element(11, "input", 106);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "div", 104)(13, "label", 107);
    \u0275\u0275text(14, "\u{1F4B0} Monto (S/)");
    \u0275\u0275elementEnd();
    \u0275\u0275element(15, "input", 108);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "div", 109)(17, "button", 110);
    \u0275\u0275listener("click", function AgreementsPageComponent_div_23_div_140_Template_button_click_17_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.cerrarEditor());
    });
    \u0275\u0275text(18, "Cancelar");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "button", 111);
    \u0275\u0275listener("click", function AgreementsPageComponent_div_23_div_140_Template_button_click_19_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.guardarEdicionFormaPago());
    });
    \u0275\u0275text(20, "Guardar");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(7);
    \u0275\u0275property("formGroup", ctx_r0.formaPagoTemporal);
  }
}
function AgreementsPageComponent_div_23_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 22)(1, "form", 28)(2, "div", 29)(3, "div", 30)(4, "div", 31)(5, "div", 32);
    \u0275\u0275text(6, "LOGO 1");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 33)(8, "div", 32);
    \u0275\u0275text(9, "LOGO 2");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275element(10, "div", 34);
    \u0275\u0275elementStart(11, "div", 35)(12, "div", 36);
    \u0275\u0275element(13, "input", 37);
    \u0275\u0275template(14, AgreementsPageComponent_div_23_div_14_Template, 2, 1, "div", 38);
    \u0275\u0275elementEnd();
    \u0275\u0275template(15, AgreementsPageComponent_div_23_div_15_Template, 2, 1, "div", 39);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "div", 40);
    \u0275\u0275template(17, AgreementsPageComponent_div_23_ng_container_17_Template, 2, 0, "ng-container", 41)(18, AgreementsPageComponent_div_23_ng_container_18_Template, 2, 0, "ng-container", 41);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "table", 42)(20, "tr")(21, "td", 43);
    \u0275\u0275text(22, "NOMBRE DEL TITULAR");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "td", 44);
    \u0275\u0275element(24, "input", 45);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(25, "tr")(26, "td", 43);
    \u0275\u0275text(27, "NUMERO DNI");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "td", 44);
    \u0275\u0275element(29, "input", 46);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(30, "tr")(31, "td", 43);
    \u0275\u0275text(32, "Nro. CUENTA TARJETA Oh!");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "td", 44);
    \u0275\u0275element(34, "input", 47);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(35, "div", 48);
    \u0275\u0275text(36, " \xA1Felicitaciones!, ya se encuentra ");
    \u0275\u0275elementStart(37, "strong");
    \u0275\u0275text(38, "APROBADO");
    \u0275\u0275elementEnd();
    \u0275\u0275text(39, " su ");
    \u0275\u0275elementStart(40, "strong");
    \u0275\u0275text(41, "CAMPA\xD1A ESPECIAL");
    \u0275\u0275elementEnd();
    \u0275\u0275text(42, " con el cual estar\xEDa cancelando ");
    \u0275\u0275elementStart(43, "strong");
    \u0275\u0275text(44, "TODA SU DEUDA");
    \u0275\u0275elementEnd();
    \u0275\u0275text(45, ", lo puede pagar desde el d\xEDa de hoy, se encontrar\xE1 habilitado hasta este: ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(46, "div", 49)(47, "div", 36);
    \u0275\u0275element(48, "input", 50);
    \u0275\u0275template(49, AgreementsPageComponent_div_23_div_49_Template, 3, 2, "div", 38);
    \u0275\u0275elementEnd();
    \u0275\u0275template(50, AgreementsPageComponent_div_23_div_50_Template, 2, 1, "div", 39);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(51, "div", 51);
    \u0275\u0275text(52, " DETALLE DE DEUDA Y PROMOCI\xD3N APROBADA ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(53, "table", 52)(54, "tr")(55, "th", 53);
    \u0275\u0275text(56, "DEUDA TOTAL");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(57, "th", 53);
    \u0275\u0275text(58, "DESCUENTO");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(59, "th", 53);
    \u0275\u0275text(60, "MONTO APROBADO");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(61, "tr")(62, "td", 54)(63, "div", 55);
    \u0275\u0275text(64, " S/ ");
    \u0275\u0275element(65, "input", 56);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(66, "td", 54)(67, "div", 55);
    \u0275\u0275text(68, " S/ ");
    \u0275\u0275element(69, "input", 57);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(70, "td", 58)(71, "div", 55);
    \u0275\u0275text(72, " S/ ");
    \u0275\u0275elementStart(73, "input", 59);
    \u0275\u0275listener("input", function AgreementsPageComponent_div_23_Template_input_input_73_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.calculateDiscount());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(74, "button", 60);
    \u0275\u0275listener("click", function AgreementsPageComponent_div_23_Template_button_click_74_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.toggleBlackoutMode());
    });
    \u0275\u0275text(75);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(76, "tr")(77, "td", 61)(78, "div", 62)(79, "span", 63);
    \u0275\u0275text(80, "Formas de pago");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(81, "button", 64);
    \u0275\u0275listener("click", function AgreementsPageComponent_div_23_Template_button_click_81_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.addFormaPago());
    });
    \u0275\u0275text(82, "+ Agregar");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementContainerStart(83, 65);
    \u0275\u0275template(84, AgreementsPageComponent_div_23_tr_84_Template, 12, 6, "tr", 66);
    \u0275\u0275elementContainerEnd();
    \u0275\u0275template(85, AgreementsPageComponent_div_23_tr_85_Template, 6, 1, "tr", 41)(86, AgreementsPageComponent_div_23_tr_86_Template, 4, 0, "tr", 41);
    \u0275\u0275elementEnd();
    \u0275\u0275template(87, AgreementsPageComponent_div_23_div_87_Template, 8, 0, "div", 67);
    \u0275\u0275elementStart(88, "div", 68);
    \u0275\u0275text(89, "CENTROS DE PAGO VIRTUAL:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(90, "div", 69)(91, "div", 70)(92, "div", 71);
    \u0275\u0275text(93, "BCP");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(94, "div", 72);
    \u0275\u0275text(95, "APP/WEB");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(96, "div", 73);
    \u0275\u0275template(97, AgreementsPageComponent_div_23_ng_container_97_Template, 2, 0, "ng-container", 41)(98, AgreementsPageComponent_div_23_ng_container_98_Template, 2, 0, "ng-container", 41);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(99, "div", 68);
    \u0275\u0275text(100, "CENTROS DE PAGO PRESENCIAL :");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(101, "div", 69)(102, "div", 70)(103, "div", 71);
    \u0275\u0275text(104, "BCP");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(105, "div", 72);
    \u0275\u0275text(106, "AGENTE/VENTANILLA");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(107, "div", 73);
    \u0275\u0275template(108, AgreementsPageComponent_div_23_ng_container_108_Template, 2, 0, "ng-container", 41)(109, AgreementsPageComponent_div_23_ng_container_109_Template, 2, 0, "ng-container", 41);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(110, "div", 68);
    \u0275\u0275text(111, "CONFIRMACI\xD3N DE PAGO:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(112, "div", 69);
    \u0275\u0275template(113, AgreementsPageComponent_div_23_ng_container_113_Template, 2, 0, "ng-container", 41)(114, AgreementsPageComponent_div_23_ng_container_114_Template, 2, 0, "ng-container", 41);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(115, "div", 68);
    \u0275\u0275text(116, "TRAMITE DE CARTA DE NO ADEUDO:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(117, "div", 69);
    \u0275\u0275template(118, AgreementsPageComponent_div_23_ng_container_118_Template, 5, 0, "ng-container", 41)(119, AgreementsPageComponent_div_23_ng_container_119_Template, 2, 0, "ng-container", 41);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(120, "div", 74);
    \u0275\u0275template(121, AgreementsPageComponent_div_23_ng_container_121_Template, 4, 0, "ng-container", 41)(122, AgreementsPageComponent_div_23_ng_container_122_Template, 4, 0, "ng-container", 41);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(123, "div", 75)(124, "div", 76)(125, "span");
    \u0275\u0275text(126, "Atentamente,");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(127, "div", 77);
    \u0275\u0275template(128, AgreementsPageComponent_div_23_ng_container_128_Template, 9, 0, "ng-container", 41)(129, AgreementsPageComponent_div_23_ng_container_129_Template, 9, 0, "ng-container", 41);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(130, "div", 78)(131, "div", 79);
    \u0275\u0275text(132, "COMPROMISO");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(133, "div", 80)(134, "p");
    \u0275\u0275text(135, "(*) Si al recibir esta comunicaci\xF3n Ud. Ha cancelado o regularizado su deuda, por favor desestimar su contenido.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(136, "p");
    \u0275\u0275text(137, "(*) Para acceder a las facilidades deber\xE1 estar incluida en la relaci\xF3n de cuentas pre -aprobado.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(138, "p");
    \u0275\u0275text(139, "(*) Sujeto a variaci\xF3n, por negativa a facilidad.");
    \u0275\u0275elementEnd()()();
    \u0275\u0275template(140, AgreementsPageComponent_div_23_div_140_Template, 21, 1, "div", 81);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_3_0;
    let tmp_11_0;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("formGroup", ctx_r0.agreementForm);
    \u0275\u0275advance(12);
    \u0275\u0275classProp("is-invalid", ctx_r0.isFieldInvalid("fechaActual"));
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", (tmp_3_0 = ctx_r0.agreementForm.get("fechaActual")) == null ? null : tmp_3_0.value);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.isFieldInvalid("fechaActual"));
    \u0275\u0275advance();
    \u0275\u0275classProp("bg-[#d32f2f]", ctx_r0.selectedEntidad === "financiera_oh")("bg-black", ctx_r0.selectedEntidad === "nsoluciones");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.selectedEntidad === "financiera_oh");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.selectedEntidad === "nsoluciones");
    \u0275\u0275advance(30);
    \u0275\u0275classProp("is-invalid", ctx_r0.isFieldInvalid("fechaCompromiso"));
    \u0275\u0275property("readonly", ctx_r0.isFechaCompromisoReadonly);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", (tmp_11_0 = ctx_r0.agreementForm.get("fechaCompromiso")) == null ? null : tmp_11_0.value);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.isFieldInvalid("fechaCompromiso"));
    \u0275\u0275advance();
    \u0275\u0275classProp("bg-[#d32f2f]", ctx_r0.selectedEntidad === "financiera_oh")("bg-black", ctx_r0.selectedEntidad === "nsoluciones");
    \u0275\u0275advance(14);
    \u0275\u0275classProp("blackout", ctx_r0.isBlackoutMode);
    \u0275\u0275advance(4);
    \u0275\u0275classProp("blackout", ctx_r0.isBlackoutMode);
    \u0275\u0275advance(4);
    \u0275\u0275classProp("is-invalid", ctx_r0.isFieldInvalid("montoAprobado"));
    \u0275\u0275advance();
    \u0275\u0275classProp("active", ctx_r0.isBlackoutMode);
    \u0275\u0275property("title", ctx_r0.getToggleTitle());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.getToggleIcon(), " ");
    \u0275\u0275advance(9);
    \u0275\u0275property("ngForOf", ctx_r0.formasDePagoArray.controls);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.mostrarObservacion);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.formasDePagoArray.length === 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.selectedEntidad === "financiera_oh");
    \u0275\u0275advance(10);
    \u0275\u0275property("ngIf", ctx_r0.selectedEntidad === "financiera_oh");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.selectedEntidad === "nsoluciones");
    \u0275\u0275advance(10);
    \u0275\u0275property("ngIf", ctx_r0.selectedEntidad === "financiera_oh");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.selectedEntidad === "nsoluciones");
    \u0275\u0275advance(4);
    \u0275\u0275property("ngIf", ctx_r0.selectedEntidad === "financiera_oh");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.selectedEntidad === "nsoluciones");
    \u0275\u0275advance(4);
    \u0275\u0275property("ngIf", ctx_r0.selectedEntidad === "financiera_oh");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.selectedEntidad === "nsoluciones");
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", ctx_r0.selectedEntidad === "financiera_oh");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.selectedEntidad === "nsoluciones");
    \u0275\u0275advance(6);
    \u0275\u0275property("ngIf", ctx_r0.selectedEntidad === "financiera_oh");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.selectedEntidad === "nsoluciones");
    \u0275\u0275advance(11);
    \u0275\u0275property("ngIf", ctx_r0.formaPagoSeleccionadaIndex !== null);
  }
}
function AgreementsPageComponent_div_25_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 112)(1, "span", 113);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 114);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "button", 115);
    \u0275\u0275listener("click", function AgreementsPageComponent_div_25_Template_button_click_5_listener() {
      const toast_r8 = \u0275\u0275restoreView(_r7).$implicit;
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.removeToast(toast_r8.id));
    });
    \u0275\u0275text(6, "\xD7");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const toast_r8 = ctx.$implicit;
    \u0275\u0275property("ngClass", toast_r8.type);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(toast_r8.icon);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(toast_r8.message);
  }
}
var _AgreementsPageComponent = class _AgreementsPageComponent {
  constructor(fb, agreementsService, themeService) {
    this.fb = fb;
    this.agreementsService = agreementsService;
    this.themeService = themeService;
    this.isDarkMode = false;
    this.readonlyInputs = false;
    this.isLoading = false;
    this.isBlackoutMode = false;
    this.isDeudaTotalReset = false;
    this.tramoDetectado = "";
    this.mostrarObservacion = false;
    this.observacionTexto = "";
    this.mostrarDocumento = false;
    this.toasts = [];
    this.toastIdCounter = 0;
    this.formaPagoSeleccionadaIndex = null;
    this.formaPagoTemporal = this.fb.group({
      fechaPago: [""],
      montoPago: [0]
    });
    this.agreementForm = this.createForm();
    this.searchForm = this.fb.group({
      dniBusqueda: ["", [Validators.required, Validators.pattern(/^\d{8}$/)]]
    });
    effect(() => {
      this.isDarkMode = this.themeService.isDarkMode();
    });
  }
  ngOnInit() {
    this.setupFormValueChanges();
    this.setupFormasPagoListener();
  }
  createForm() {
    return this.fb.group({
      entidad: ["financiera_oh", Validators.required],
      fechaActual: [this.formatDate(/* @__PURE__ */ new Date()), Validators.required],
      nombreTitular: ["", [Validators.required, Validators.minLength(2)]],
      dni: ["", [Validators.required, Validators.pattern(/^\d{8}$/)]],
      cuentaTarjeta: ["", [Validators.required, Validators.minLength(10)]],
      fechaCompromiso: [this.formatDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1e3)), Validators.required],
      deudaTotal: [0, [Validators.required, Validators.min(0.01)]],
      descuento: [0, [Validators.required, Validators.min(0)]],
      montoAprobado: [0, [Validators.required, Validators.min(0.01)]],
      formasDePago: this.fb.array([])
    });
  }
  createFormaPago() {
    return this.fb.group({
      fechaPago: [this.formatDate(/* @__PURE__ */ new Date()), Validators.required],
      montoPago: [0, [Validators.required, Validators.min(0.01)]]
    });
  }
  get formasDePagoArray() {
    return this.agreementForm.get("formasDePago");
  }
  get isFechaCompromisoReadonly() {
    return this.formasDePagoArray.length > 0 || this.readonlyInputs;
  }
  setupFormValueChanges() {
    this.agreementForm.get("deudaTotal")?.valueChanges.subscribe(() => {
      if (!this.isDeudaTotalReset) {
        this.calculateDiscount();
      }
    });
    this.agreementForm.get("descuento")?.valueChanges.subscribe(() => {
      if (!this.isDeudaTotalReset) {
        this.calculateDiscount();
      }
    });
    this.agreementForm.get("montoAprobado")?.valueChanges.subscribe(() => {
      if (!this.isDeudaTotalReset) {
        this.calculateDiscount();
      }
    });
  }
  setupFormasPagoListener() {
    this.formasDePagoArray.valueChanges.subscribe(() => {
      this.updateFechaCompromisoFromFirstPayment();
    });
  }
  updateFechaCompromisoFromFirstPayment() {
    if (this.formasDePagoArray.length > 0) {
      const primeraFormaPago = this.formasDePagoArray.at(0);
      const fechaPrimerPago = primeraFormaPago.get("fechaPago")?.value;
      if (fechaPrimerPago) {
        this.agreementForm.patchValue({ fechaCompromiso: fechaPrimerPago }, { emitEvent: false });
      }
    }
  }
  formatDate(date) {
    return date.toISOString().split("T")[0];
  }
  formatDisplayDate(dateString) {
    if (!dateString)
      return "";
    const [year, month, day] = dateString.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    const formatted = date.toLocaleDateString("es-PE", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
    return formatted.replace("septiembre", "setiembre");
  }
  determinarEntidadPorTramo(tramo) {
    if (tramo === "Tramo 3" || tramo === "Tramo 5") {
      return "financiera_oh";
    } else if (tramo === "CONTACTO_TOTAL") {
      return "nsoluciones";
    }
    return "financiera_oh";
  }
  calculateDiscount() {
    const deudaTotal = this.agreementForm.get("deudaTotal")?.value || 0;
    const montoAprobado = this.agreementForm.get("montoAprobado")?.value || 0;
    let descuento = deudaTotal - montoAprobado;
    if (descuento < 0)
      descuento = 0;
    this.agreementForm.patchValue({ descuento: Number(descuento.toFixed(2)) }, { emitEvent: false });
  }
  addFormaPago() {
    if (this.formasDePagoArray.length < 10) {
      this.formasDePagoArray.push(this.createFormaPago());
    }
  }
  removeFormaPago(index) {
    this.formasDePagoArray.removeAt(index);
  }
  buscarPorDni() {
    if (this.searchForm.invalid) {
      this.searchForm.markAllAsTouched();
      return;
    }
    const dni = this.searchForm.get("dniBusqueda")?.value;
    this.limpiarCampos();
    this.searchForm.reset();
    this.isLoading = true;
    this.agreementsService.getAgreementData(dni).subscribe({
      next: (response) => {
        const entidad = this.determinarEntidadPorTramo(response.tramo);
        const deudaTotal = Math.ceil(Number(response.deudaTotal)).toFixed(2);
        this.agreementForm.patchValue({
          entidad,
          fechaActual: response.fechaActual,
          nombreTitular: response.nombreDelTitular,
          dni,
          cuentaTarjeta: response.cuentaTarjeta,
          fechaCompromiso: response.fechaCompromiso,
          deudaTotal: parseFloat(deudaTotal)
        });
        this.readonlyInputs = true;
        this.tramoDetectado = response.tramo;
        this.observacionTexto = `Deuda total: ${response.deudaTotal}
Saldo capital asignado: ${response.saldoCapitalAsig}
LTD: ${response.ltd}
LTDE: ${response.ltde}
Asesor: ${response.asesor}
Tipificaci\xF3n: ${response.observacion}`;
        this.mostrarObservacion = true;
        this.mostrarDocumento = true;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.readonlyInputs = false;
        if (error.status === 404) {
          this.showToast("error", "Cliente no encontrado en la base de datos.");
        } else if (error.status === 422) {
          this.showToast("warning", "El cliente no tiene promesa de pago registrada.");
        } else {
          this.showToast("error", "Error al obtener datos del cliente.");
        }
      }
    });
  }
  toggleBlackoutMode() {
    if (this.isBlackoutMode) {
      if (confirm("Desea volver a mostrar los campos?")) {
        this.isBlackoutMode = false;
      }
    } else {
      const montoAprobado = this.agreementForm.get("montoAprobado")?.value || 0;
      if (montoAprobado <= 0) {
        this.showToast("error", "Ingrese un monto aprobado v\xE1lido.");
        return;
      }
      if (confirm("Usar monto aprobado como deuda total?")) {
        this.isDeudaTotalReset = true;
        this.isBlackoutMode = true;
        this.agreementForm.patchValue({
          deudaTotal: montoAprobado,
          descuento: 0
        }, { emitEvent: false });
        setTimeout(() => {
          this.isDeudaTotalReset = false;
        }, 100);
      }
    }
  }
  calculateFromPercentage() {
    const deudaTotal = this.agreementForm.get("deudaTotal")?.value || 0;
    if (deudaTotal <= 0) {
      this.showToast("error", "Ingrese primero el monto de la deuda total.");
      return;
    }
    const percentage = prompt("Ingrese porcentaje de descuento (0-100):");
    if (percentage && !isNaN(Number(percentage)) && Number(percentage) >= 0 && Number(percentage) <= 100) {
      const descuento = deudaTotal * Number(percentage) / 100;
      const montoAprobado = deudaTotal - descuento;
      this.agreementForm.patchValue({
        descuento: Number(descuento.toFixed(2)),
        montoAprobado: Number(montoAprobado.toFixed(2))
      });
    }
  }
  onSubmit() {
    if (!this.agreementForm.valid) {
      this.markFormGroupTouched();
      this.showToast("error", "Campos requeridos incompletos.");
      return;
    }
    const montoAprobado = this.agreementForm.get("montoAprobado")?.value || 0;
    if (this.formasDePagoArray.length > 0) {
      const sumaPagos = this.formasDePagoArray.controls.reduce((acc, control) => acc + Number(control.get("montoPago")?.value || 0), 0);
      const diff = Math.abs(sumaPagos - montoAprobado);
      if (diff > 0.01) {
        this.showToast("error", `Suma de pagos no coincide con monto aprobado`);
        return;
      }
    }
    this.isLoading = true;
    const formValue = this.agreementForm.value;
    const deudaTotalParaEnvio = this.isBlackoutMode ? formValue.montoAprobado : formValue.deudaTotal;
    const request = {
      entidad: formValue.entidad,
      fechaActual: this.formatDisplayDate(formValue.fechaActual),
      nombreTitular: formValue.nombreTitular,
      dni: formValue.dni,
      cuentaTarjeta: formValue.cuentaTarjeta,
      fechaCompromiso: this.formatDisplayDate(formValue.fechaCompromiso),
      deudaTotal: deudaTotalParaEnvio,
      descuento: formValue.descuento,
      montoAprobado: formValue.montoAprobado,
      formasDePago: this.formasDePagoArray.controls.map((control, index) => {
        const fecha = control.get("fechaPago")?.value;
        const monto = control.get("montoPago")?.value;
        const [yyyy, mm, dd] = fecha.split("-");
        const fechaFormateada = `${dd}/${mm}`;
        return `${index + 1}${this.getOrdinalSuffix(index + 1)} PAGO - ${fechaFormateada} - ${monto} SOLES`;
      })
    };
    this.agreementsService.downloadAgreementCard(request).subscribe({
      next: (blob) => {
        this.downloadFile(blob, `ACUERDO_DE_PAGO_${request.dni}.pdf`);
        this.isLoading = false;
        this.showToast("success", "Acuerdo descargado.");
      },
      error: (error) => {
        console.error("Error completo:", error);
        console.error("Status:", error.status);
        console.error("Mensaje:", error.message);
        console.error("Request enviado:", request);
        this.isLoading = false;
        this.showToast("error", `Error ${error.status}: ${error.message || "Error al generar documento"}`);
      }
    });
  }
  limpiarCampos() {
    while (this.formasDePagoArray.length > 0) {
      this.formasDePagoArray.removeAt(0);
    }
    this.isDeudaTotalReset = false;
    this.mostrarObservacion = false;
    this.observacionTexto = "";
    this.readonlyInputs = false;
    this.isBlackoutMode = false;
    this.tramoDetectado = "";
    this.mostrarDocumento = false;
    this.toasts = [];
    const entidadActual = this.agreementForm.get("entidad")?.value || "financiera_oh";
    this.agreementForm.patchValue({
      entidad: entidadActual,
      fechaActual: this.formatDate(/* @__PURE__ */ new Date()),
      nombreTitular: "",
      dni: "",
      cuentaTarjeta: "",
      fechaCompromiso: this.formatDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1e3)),
      deudaTotal: 0,
      descuento: 0,
      montoAprobado: 0
    });
  }
  resetForm() {
    if (confirm("Limpiar todos los campos?")) {
      this.limpiarCampos();
    }
  }
  isFieldInvalid(fieldName) {
    const field = this.agreementForm.get(fieldName);
    return !!(field?.invalid && (field?.touched || field?.dirty));
  }
  getFieldError(fieldName) {
    const field = this.agreementForm.get(fieldName);
    if (field?.errors && (field?.touched || field?.dirty)) {
      if (field.errors["required"])
        return `${this.getFieldLabel(fieldName)} requerido`;
      if (field.errors["pattern"]) {
        if (fieldName === "dni")
          return "DNI: 8 d\xEDgitos";
        return `${this.getFieldLabel(fieldName)} inv\xE1lido`;
      }
      if (field.errors["minLength"]) {
        return `${this.getFieldLabel(fieldName)} m\xEDn ${field.errors["minLength"].requiredLength}`;
      }
      if (field.errors["min"]) {
        return `${this.getFieldLabel(fieldName)} > ${field.errors["min"].min}`;
      }
    }
    return "";
  }
  getFieldLabel(fieldName) {
    const labels = {
      "fechaActual": "Fecha",
      "nombreTitular": "Nombre",
      "dni": "DNI",
      "cuentaTarjeta": "Cuenta",
      "fechaCompromiso": "Fecha Compromiso",
      "deudaTotal": "Deuda",
      "descuento": "Descuento",
      "montoAprobado": "Monto Aprobado"
    };
    return labels[fieldName] || fieldName;
  }
  getOrdinalSuffix(n) {
    const suffixes = ["ER", "DO", "ER", "TO", "TO", "TO", "MO", "VO", "NO", "MO"];
    return n <= 10 ? suffixes[n - 1] : "";
  }
  downloadFile(blob, filename) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
  markFormGroupTouched() {
    Object.keys(this.agreementForm.controls).forEach((key) => {
      const control = this.agreementForm.get(key);
      control?.markAsTouched();
      if (control instanceof FormArray) {
        control.controls.forEach((c) => c.markAsTouched());
      }
    });
  }
  showToast(type, message) {
    const icon = type === "error" ? "\u274C" : type === "warning" ? "\u26A0\uFE0F" : "\u2705";
    const id = this.toastIdCounter++;
    this.toasts.push({ id, type, message, icon });
    setTimeout(() => this.removeToast(id), 5e3);
  }
  removeToast(id) {
    this.toasts = this.toasts.filter((toast) => toast.id !== id);
  }
  onlyNumbers(event) {
    const input = event.target;
    input.value = input.value.replace(/[^0-9]/g, "");
  }
  getFormGroupAt(index) {
    return this.formasDePagoArray.at(index);
  }
  abrirEditorFormaPago(index) {
    this.formaPagoSeleccionadaIndex = index;
    const forma = this.formasDePagoArray.at(index);
    this.formaPagoTemporal.setValue({
      fechaPago: forma.get("fechaPago")?.value,
      montoPago: forma.get("montoPago")?.value
    });
  }
  guardarEdicionFormaPago() {
    if (this.formaPagoTemporal.invalid) {
      this.formaPagoTemporal.markAllAsTouched();
      this.showToast("error", "Complete todos los campos del pago.");
      return;
    }
    if (this.formaPagoSeleccionadaIndex !== null) {
      const forma = this.formasDePagoArray.at(this.formaPagoSeleccionadaIndex);
      forma.patchValue({
        fechaPago: this.formaPagoTemporal.get("fechaPago")?.value,
        montoPago: this.formaPagoTemporal.get("montoPago")?.value
      });
      this.cerrarEditor();
    }
  }
  cerrarEditor() {
    this.formaPagoSeleccionadaIndex = null;
    this.formaPagoTemporal.reset({
      fechaPago: "",
      montoPago: 0
    });
  }
  getToggleIcon() {
    return this.isBlackoutMode ? "\u21B6" : "\xD7";
  }
  getToggleTitle() {
    return this.isBlackoutMode ? "Restaurar vista de deuda total" : "Ocultar deuda total y usar monto aprobado como deuda";
  }
  get selectedEntidad() {
    return this.agreementForm.get("entidad")?.value || "financiera_oh";
  }
};
_AgreementsPageComponent.\u0275fac = function AgreementsPageComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _AgreementsPageComponent)(\u0275\u0275directiveInject(FormBuilder), \u0275\u0275directiveInject(AgreementsService), \u0275\u0275directiveInject(ThemeService));
};
_AgreementsPageComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AgreementsPageComponent, selectors: [["app-agreements-page"]], decls: 26, vars: 11, consts: [[1, "payment-agreement-container"], [1, "flex", "items-center", "gap-2", "mb-3"], [1, "w-8", "h-8", "bg-gradient-to-br", "from-blue-600", "to-purple-700", "rounded-lg", "flex", "items-center", "justify-center"], ["name", "file-text", 1, "text-white!", 3, "size"], [1, "text-lg", "font-bold", "text-slate-900", "dark:text-white"], [1, "text-xs", "text-slate-600", "dark:text-slate-400"], [1, "document-header"], [1, "flex", "gap-2", "items-center", 3, "formGroup"], ["formControlName", "dniBusqueda", "type", "text", "placeholder", "DNI", "maxlength", "8", 1, "h-10", "w-[120px]", "px-3", "text-sm", "border", "border-slate-300", "dark:border-slate-600", "rounded-lg", "bg-white", "dark:bg-slate-700", "text-slate-900", "dark:text-white", "placeholder:text-slate-400", "focus:ring-2", "focus:ring-blue-500", "focus:border-transparent", "transition-colors"], ["type", "button", 1, "h-10", "px-4", "text-sm", "font-medium", "text-white", "bg-gradient-to-r", "from-emerald-500", "to-emerald-600", "hover:from-emerald-600", "hover:to-emerald-700", "rounded-lg", "transition-all", "duration-200", "disabled:opacity-50", "disabled:cursor-not-allowed", 3, "click", "disabled"], ["class", "ml-2 px-3 py-1 bg-green-50 border border-green-500 rounded text-sm font-bold text-green-700", 4, "ngIf"], ["class", "ml-2 px-3 py-1 rounded text-sm font-bold", 3, "bg-blue-50", "border-blue-500", "text-blue-700", "bg-purple-50", "border-purple-500", "text-purple-700", "border", 4, "ngIf"], ["class", "spinner", 4, "ngIf"], [1, "document-actions"], ["type", "button", 1, "h-10", "px-4", "text-sm", "font-medium", "text-white", "bg-gradient-to-r", "from-red-500", "to-red-600", "hover:from-red-600", "hover:to-red-700", "rounded-lg", "transition-all", "duration-200", 3, "click"], ["type", "button", 1, "h-10", "px-4", "text-sm", "font-medium", "text-white", "bg-gradient-to-r", "from-blue-600", "to-purple-700", "hover:from-blue-700", "hover:to-purple-800", "rounded-lg", "transition-all", "duration-200", "disabled:opacity-50", "disabled:cursor-not-allowed", 3, "click", "disabled"], ["class", "document-container", 4, "ngIf"], [1, "toast-container"], ["class", "toast", 3, "ngClass", 4, "ngFor", "ngForOf"], [1, "ml-2", "px-3", "py-1", "bg-green-50", "border", "border-green-500", "rounded", "text-sm", "font-bold", "text-green-700"], [1, "ml-2", "px-3", "py-1", "rounded", "text-sm", "font-bold"], [1, "spinner"], [1, "document-container"], [1, "flex", "flex-col", "items-center", "justify-center", "py-20", "px-8", "rounded-lg", "shadow-sm"], [1, "w-24", "h-24", "bg-gradient-to-br", "from-blue-600", "to-purple-700", "rounded-full", "flex", "items-center", "justify-center", "mb-6", "shadow-lg"], ["name", "search", 2, "color", "white !important", 3, "size"], [1, "text-xl", "font-bold", "mb-2"], [1, "text-sm", "text-center", "max-w-md"], [1, "document", "bg-white", "text-black", 3, "formGroup"], [1, "header"], [1, "logo-section"], [1, "logo-left"], [1, "logo-placeholder"], [1, "logo-right"], [1, "line"], [1, "date-location"], [1, "date-input-container"], ["type", "date", "formControlName", "fechaActual", 1, "editable-input", "date-input"], ["class", "formatted-date", 4, "ngIf"], ["class", "error-message", 4, "ngIf"], [1, "red-header", "text-white"], [4, "ngIf"], [1, "client-table", "bg-white", "text-black"], [1, "label-cell", "bg-[#f8f9fa]", "text-black"], [1, "highlight", "input-cell", "bg-white", "text-black"], ["type", "text", "formControlName", "nombreTitular", "readonly", "", "placeholder", "JUAN CARLOS PEREZ GARCIA", 1, "editable-input", "large-input", "readonly-input"], ["type", "text", "formControlName", "dni", "readonly", "", "placeholder", "12345678", 1, "editable-input", "readonly-input"], ["type", "text", "formControlName", "cuentaTarjeta", "readonly", "", "placeholder", "1234567890123456", 1, "editable-input", "large-input", "readonly-input"], [1, "congratulations", "text-black"], [1, "date-highlight", "text-black"], ["type", "date", "formControlName", "fechaCompromiso", 1, "editable-input", "date-input", 3, "readonly"], [1, "debt-header", "text-white"], [1, "debt-table", "bg-white", "text-black"], [1, "bg-white", "text-black"], [1, "amount", "bg-white", "text-black"], [1, "amount-input-container"], ["type", "number", "formControlName", "deudaTotal", "readonly", "", "step", "0.01", "min", "0", 1, "editable-input", "number-input", "readonly-input"], ["type", "number", "formControlName", "descuento", "readonly", "", 1, "editable-input", "number-input"], [1, "highlight-amount", "bg-yellow-300", "text-black"], ["type", "number", "formControlName", "montoAprobado", "step", "1", "min", "0", 1, "editable-input", "number-input", 3, "input"], ["type", "button", 1, "btn-toggle-debt", 3, "click", "title"], ["colspan", "3", 1, "payment-header-clean"], [1, "payment-header-container"], [1, "payment-title"], ["type", "button", 1, "btn", "btn-success", "btn-sm", 3, "click"], ["formArrayName", "formasDePago"], [3, "formGroupName", 4, "ngFor", "ngForOf"], ["class", "instructions text-black", 4, "ngIf"], [1, "section-header", "bg-[#e0e0e0]", "text-black"], [1, "section-content", "text-black"], [1, "centers-content"], [1, "bcp-logo"], [1, "center"], [1, "dni", "text-black"], [1, "contact-info", "text-black"], [1, "signature-section", "text-black"], [1, "signature-left", "text-black"], [1, "signature-center", "text-black"], [1, "signature-right"], [1, "logo-placeholder", "small"], [1, "footer-notes"], ["class", "modal-backdrop", 4, "ngIf"], [1, "formatted-date"], [1, "error-message"], ["style", "font-size: 0.8em; color: #666; margin-left: 5px;", 4, "ngIf"], [2, "font-size", "0.8em", "color", "#666", "margin-left", "5px"], [3, "formGroupName"], ["colspan", "3", 1, "payment-row"], [1, "payment-row-content"], [1, "payment-info"], [1, "payment-actions"], ["type", "button", 1, "btn", "btn-outline-primary", "btn-sm", 3, "click"], ["type", "button", 1, "btn", "btn-outline-danger", "btn-sm", 3, "click", "disabled"], ["colspan", "3", 1, "payment-observation-unique"], [1, "observation-header"], [1, "observation-content"], ["colspan", "3", 1, "payment-section"], [1, "instructions", "text-black"], [2, "text-align", "center", "padding", "10px"], [1, "modal-backdrop"], ["cdkDrag", "", 1, "modal-dialog", "enhanced"], ["cdkDragHandle", "", 1, "modal-header"], [1, "close-btn", 3, "click"], [1, "modal-body", 3, "formGroup"], [1, "modal-field"], ["for", "fechaPago"], ["type", "date", "formControlName", "fechaPago", "id", "fechaPago", 1, "editable-input", "date-input"], ["for", "montoPago"], ["type", "number", "formControlName", "montoPago", "step", "0.01", "min", "0", "id", "montoPago", 1, "editable-input", "number-input"], [1, "modal-footer"], [1, "btn", "btn-secondary", 3, "click"], [1, "btn", "btn-primary", 3, "click"], [1, "toast", 3, "ngClass"], [1, "toast-icon"], [1, "toast-content"], [1, "toast-close", 3, "click"]], template: function AgreementsPageComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2);
    \u0275\u0275element(3, "lucide-angular", 3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div")(5, "h1", 4);
    \u0275\u0275text(6, "Generador de Acuerdo de Pago");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p", 5);
    \u0275\u0275text(8, "Creaci\xF3n de acuerdos de pago para clientes");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(9, "div", 6)(10, "form", 7);
    \u0275\u0275element(11, "input", 8);
    \u0275\u0275elementStart(12, "button", 9);
    \u0275\u0275listener("click", function AgreementsPageComponent_Template_button_click_12_listener() {
      return ctx.buscarPorDni();
    });
    \u0275\u0275text(13, " Buscar ");
    \u0275\u0275elementEnd();
    \u0275\u0275template(14, AgreementsPageComponent_div_14_Template, 2, 1, "div", 10)(15, AgreementsPageComponent_div_15_Template, 2, 15, "div", 11)(16, AgreementsPageComponent_span_16_Template, 1, 0, "span", 12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "div", 13)(18, "button", 14);
    \u0275\u0275listener("click", function AgreementsPageComponent_Template_button_click_18_listener() {
      return ctx.resetForm();
    });
    \u0275\u0275text(19, " Limpiar ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "button", 15);
    \u0275\u0275listener("click", function AgreementsPageComponent_Template_button_click_20_listener() {
      return ctx.onSubmit();
    });
    \u0275\u0275text(21);
    \u0275\u0275elementEnd()()();
    \u0275\u0275template(22, AgreementsPageComponent_div_22_Template, 8, 13, "div", 16)(23, AgreementsPageComponent_div_23_Template, 141, 47, "div", 16);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "div", 17);
    \u0275\u0275template(25, AgreementsPageComponent_div_25_Template, 7, 3, "div", 18);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance(3);
    \u0275\u0275property("size", 16);
    \u0275\u0275advance(7);
    \u0275\u0275property("formGroup", ctx.searchForm);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx.searchForm.invalid);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", ctx.tramoDetectado);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.tramoDetectado);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.isLoading);
    \u0275\u0275advance(4);
    \u0275\u0275property("disabled", ctx.agreementForm.invalid || ctx.isLoading);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx.isLoading ? "Generando..." : "Generar PDF", " ");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx.mostrarDocumento);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.mostrarDocumento);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngForOf", ctx.toasts);
  }
}, dependencies: [CommonModule, NgClass, NgForOf, NgIf, ReactiveFormsModule, \u0275NgNoValidate, DefaultValueAccessor, NumberValueAccessor, NgControlStatus, NgControlStatusGroup, MaxLengthValidator, MinValidator, FormGroupDirective, FormControlName, FormGroupName, FormArrayName, FormsModule, LucideAngularModule, LucideAngularComponent, DragDropModule, CdkDrag, CdkDragHandle], styles: ["\n\nbody[_ngcontent-%COMP%] {\n  margin-top: 5rem;\n  margin-bottom: 2rem;\n}\n.payment-agreement-container[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  min-height: 100vh;\n  font-family: Arial, sans-serif;\n  background-color: #f5f5f5;\n  padding: 2rem 20px 20px 20px;\n  transition: background-color 0.3s ease;\n}\n.dark[_nghost-%COMP%]   .payment-agreement-container[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .payment-agreement-container[_ngcontent-%COMP%] {\n  background-color: #0f172a;\n}\n.dark[_nghost-%COMP%]   .document-header[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .document-header[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #1e293b 0%,\n      #0f172a 100%);\n  border-color: #334155;\n}\n.dark[_nghost-%COMP%]   .document-title[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .document-title[_ngcontent-%COMP%] {\n  color: #e2e8f0;\n}\n.document-header[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 2rem;\n  padding: 1.5rem 2rem;\n  background:\n    linear-gradient(\n      135deg,\n      #fff 0%,\n      #f8fafc 100%);\n  border-radius: 16px;\n  box-shadow: 0 4px 20px rgba(0, 0, 0, .08);\n  border: 1px solid #e2e8f0;\n  gap: 1rem;\n}\n.document-actions[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 1rem;\n  align-items: center;\n}\n.btn[_ngcontent-%COMP%] {\n  padding: 0.75rem 1.5rem;\n  border: none;\n  border-radius: 8px;\n  cursor: pointer;\n  font-size: 0.95rem;\n  font-weight: 500;\n  transition: all 0.3s ease;\n  text-decoration: none;\n  display: inline-flex;\n  align-items: center;\n  gap: 8px;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);\n  position: relative;\n  overflow: hidden;\n}\n.btn[_ngcontent-%COMP%]:hover {\n  transform: translateY(-1px);\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);\n}\n.btn-primary[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #3b82f6,\n      #8b5cf6);\n  color: white;\n  border: none;\n}\n.btn-primary[_ngcontent-%COMP%]:hover:not(:disabled) {\n  background:\n    linear-gradient(\n      135deg,\n      #2563eb,\n      #7c3aed);\n  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);\n}\n.btn-primary[_ngcontent-%COMP%]:disabled {\n  background:\n    linear-gradient(\n      135deg,\n      #94a3b8,\n      #cbd5e1);\n  cursor: not-allowed;\n  transform: none;\n}\n.btn-secondary[_ngcontent-%COMP%] {\n  background: #64748b;\n  color: white;\n  border: none;\n}\n.btn-secondary[_ngcontent-%COMP%]:hover {\n  background: #475569;\n}\n.btn-success[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #10b981,\n      #059669);\n  color: white;\n  border: none;\n}\n.btn-success[_ngcontent-%COMP%]:hover {\n  background:\n    linear-gradient(\n      135deg,\n      #059669,\n      #047857);\n  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.3);\n}\n.btn-search[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #10b981,\n      #059669);\n  color: white;\n  border: none;\n}\n.btn-search[_ngcontent-%COMP%]:hover {\n  background:\n    linear-gradient(\n      135deg,\n      #059669,\n      #047857);\n  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.3);\n}\n.btn-clean[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #ef4444,\n      #dc2626);\n  color: white;\n  border: none;\n}\n.btn-clean[_ngcontent-%COMP%]:hover {\n  background:\n    linear-gradient(\n      135deg,\n      #dc2626,\n      #b91c1c);\n  box-shadow: 0 4px 16px rgba(239, 68, 68, 0.3);\n}\n.spinner[_ngcontent-%COMP%] {\n  width: 20px;\n  height: 20px;\n  border: 2px solid rgba(255, 255, 255, 0.3);\n  border-top: 2px solid currentColor;\n  border-radius: 50%;\n  animation: _ngcontent-%COMP%_spin 1s linear infinite;\n}\n@keyframes _ngcontent-%COMP%_spin {\n  0% {\n    transform: rotate(0deg);\n  }\n  100% {\n    transform: rotate(360deg);\n  }\n}\n.document-container[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: center;\n  background:\n    linear-gradient(\n      135deg,\n      #fff 0%,\n      #f8fafc 100%);\n  border-radius: 8px;\n  padding: 40px;\n  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);\n}\n.dark[_nghost-%COMP%]   .document-container[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .document-container[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #1e293b 0%,\n      #0f172a 100%);\n}\n.document[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: 800px;\n  margin: 0 auto;\n  padding: 30px;\n  border: 2px solid black;\n  background: white;\n  font-family: Arial, sans-serif;\n  font-size: 12px;\n  position: relative;\n}\n.editable-input[_ngcontent-%COMP%] {\n  border: 1px dashed #3498db;\n  background: #f8f9fa;\n  padding: 6px 10px;\n  border-radius: 4px;\n  font-family: inherit;\n  font-size: inherit;\n  font-weight: inherit;\n  color: inherit;\n  display: inline-block;\n  transition: all 0.3s ease;\n  vertical-align: middle;\n  box-sizing: border-box;\n}\n.editable-input.blackout[_ngcontent-%COMP%] {\n  background: black !important;\n  color: transparent !important;\n  border-color: black !important;\n}\n.editable-input.blackout[_ngcontent-%COMP%]:focus {\n  background: black !important;\n  color: transparent !important;\n  box-shadow: none !important;\n}\n.editable-input[_ngcontent-%COMP%]:focus {\n  outline: none;\n  border-color: #2980b9;\n  background: white;\n  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);\n}\n.editable-input.is-invalid[_ngcontent-%COMP%] {\n  border-color: #e74c3c;\n  background: #fdf2f2;\n}\n.readonly-input[_ngcontent-%COMP%] {\n  background: #e2e8f0 !important;\n  border: 1px solid #94a3b8 !important;\n  cursor: not-allowed !important;\n  color: #475569 !important;\n  font-weight: 500 !important;\n  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.15) !important;\n}\n.readonly-input[_ngcontent-%COMP%]::placeholder {\n  color: #94a3b8 !important;\n  opacity: 0.9 !important;\n  font-style: normal !important;\n}\n.editable-input[_ngcontent-%COMP%]:readonly {\n  background: #d1d5db;\n  opacity: 0.85;\n  border: 1px solid #9ca3af;\n  border-style: solid;\n  cursor: not-allowed;\n  color: #4b5563;\n  font-weight: 500;\n  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.15);\n}\n.editable-input[_ngcontent-%COMP%]:readonly::placeholder {\n  color: #9ca3af;\n  opacity: 1;\n  font-style: italic;\n}\n.date-input-container[_ngcontent-%COMP%] {\n  position: relative;\n  display: inline-block;\n}\n.amount-input-container[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n  justify-content: center;\n  position: relative;\n}\n.btn-toggle-debt[_ngcontent-%COMP%] {\n  background: #e74c3c;\n  color: white;\n  border: none;\n  border-radius: 50%;\n  width: 22px;\n  height: 22px;\n  font-size: 12px;\n  font-weight: bold;\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  margin-left: 6px;\n  transition: all 0.2s ease;\n  line-height: 1;\n  padding: 0;\n}\n.btn-toggle-debt[_ngcontent-%COMP%]:hover {\n  background: #c0392b;\n  transform: scale(1.1);\n}\n.btn-toggle-debt[_ngcontent-%COMP%]:active {\n  transform: scale(0.95);\n}\n.btn-toggle-debt.active[_ngcontent-%COMP%] {\n  background: #28a745;\n}\n.btn-toggle-debt.active[_ngcontent-%COMP%]:hover {\n  background: #218838;\n}\n.editable-input.date-input[_ngcontent-%COMP%] {\n  min-width: 140px;\n  width: 140px;\n}\ninput[type=date][_ngcontent-%COMP%] {\n  color-scheme: light;\n}\ninput[type=date][_ngcontent-%COMP%]::-webkit-calendar-picker-indicator {\n  filter: none;\n  opacity: 1;\n  cursor: pointer;\n}\n.editable-input.number-input[_ngcontent-%COMP%] {\n  text-align: right;\n  min-width: 110px;\n  width: 110px;\n}\n.editable-input.large-input[_ngcontent-%COMP%] {\n  min-width: 280px;\n  width: 280px;\n}\n.editable-input.dni-input[_ngcontent-%COMP%] {\n  min-width: 100px;\n  width: 100px;\n  text-align: center;\n}\n.header[_ngcontent-%COMP%] {\n  padding: 5px 0;\n  position: relative;\n  width: 100%;\n}\n.logo-section[_ngcontent-%COMP%] {\n  width: 100%;\n  display: table;\n}\n.logo-left[_ngcontent-%COMP%] {\n  display: table-cell;\n  width: 50%;\n  text-align: left;\n  vertical-align: top;\n}\n.logo-right[_ngcontent-%COMP%] {\n  display: table-cell;\n  width: 50%;\n  text-align: right;\n  vertical-align: top;\n}\n.logo-placeholder[_ngcontent-%COMP%] {\n  display: inline-block;\n  padding: 10px 20px;\n  background: #ecf0f1;\n  border: 2px dashed #bdc3c7;\n  color: #7f8c8d;\n  font-weight: bold;\n  font-size: 12px;\n}\n.logo-placeholder.small[_ngcontent-%COMP%] {\n  padding: 5px 10px;\n  font-size: 10px;\n}\n.date-location[_ngcontent-%COMP%] {\n  text-align: right;\n  font-size: 11px;\n  margin: 10px 0;\n}\n.formatted-date[_ngcontent-%COMP%] {\n  margin-top: 8px;\n  font-size: 12px;\n  color: #2c3e50;\n  font-weight: 500;\n}\n.line[_ngcontent-%COMP%] {\n  border-top: 2px solid black;\n  margin: 5px 0 10px 0;\n}\n.red-header[_ngcontent-%COMP%] {\n  color: white;\n  text-align: center;\n  padding: 10px;\n  font-weight: bold;\n  font-size: 13px;\n  margin: 10px 0;\n}\n.client-table[_ngcontent-%COMP%] {\n  width: 100%;\n  border-collapse: collapse;\n  margin: 15px 0;\n}\n.client-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  padding: 10px 12px;\n  border: 1px solid #ccc;\n  font-size: 12px;\n}\n.client-table[_ngcontent-%COMP%]   td.label-cell[_ngcontent-%COMP%] {\n  background: #f8f9fa;\n}\n.label-cell[_ngcontent-%COMP%] {\n  width: 40%;\n  font-weight: normal;\n  background: #f8f9fa;\n}\n.input-cell[_ngcontent-%COMP%] {\n  width: 60%;\n  position: relative;\n}\n.highlight[_ngcontent-%COMP%] {\n  font-weight: bold;\n}\n.congratulations[_ngcontent-%COMP%] {\n  padding: 15px;\n  text-align: center;\n  font-size: 12px;\n  line-height: 1.5;\n  margin: 15px 0;\n}\n.date-highlight[_ngcontent-%COMP%] {\n  text-align: center;\n  font-weight: bold;\n  font-size: 14px;\n  padding: 15px 0;\n}\n.debt-header[_ngcontent-%COMP%] {\n  color: white;\n  text-align: center;\n  padding: 10px;\n  font-weight: bold;\n  font-size: 12px;\n  margin: 15px 0 0 0;\n}\n.debt-table[_ngcontent-%COMP%] {\n  width: 100%;\n  border-collapse: collapse;\n  table-layout: fixed;\n}\n.debt-table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%], \n.debt-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  border: 1px solid #ccc;\n  padding: 12px;\n  text-align: center;\n  font-size: 12px;\n  vertical-align: middle;\n}\n.highlight-amount[_ngcontent-%COMP%] {\n  background: yellow;\n  font-weight: bold;\n  font-size: 13px;\n}\n.amount[_ngcontent-%COMP%] {\n  font-weight: bold;\n}\n.payment-header-clean[_ngcontent-%COMP%] {\n  background: none;\n  padding: 12px;\n  font-size: 14px;\n  font-weight: bold;\n  border: none;\n}\n.payment-header-container[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n.payment-title[_ngcontent-%COMP%] {\n  font-weight: bold;\n  font-size: 14px;\n}\n.payment-row[_ngcontent-%COMP%] {\n  padding: 12px;\n  border: 1px solid #ccc;\n  font-size: 13px;\n  background: #f8f9fa;\n}\n.payment-row-content[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 15px;\n  flex-wrap: wrap;\n}\n.payment-info[_ngcontent-%COMP%] {\n  flex: 1;\n  font-weight: 500;\n  order: 1;\n}\n.payment-actions[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 8px;\n  flex-shrink: 0;\n  order: 2;\n}\n.payment-observation-unique[_ngcontent-%COMP%] {\n  border: 1px solid #ccc;\n  padding: 15px;\n  background: #fff9e6;\n  font-size: 12px;\n}\n.observation-header[_ngcontent-%COMP%] {\n  font-weight: bold;\n  color: #d32f2f;\n  margin-bottom: 8px;\n  font-size: 13px;\n}\n.observation-content[_ngcontent-%COMP%] {\n  white-space: pre-line;\n  line-height: 1.4;\n  color: #2c3e50;\n}\n.btn-sm[_ngcontent-%COMP%] {\n  font-size: 12px;\n  padding: 6px 12px;\n  border-radius: 4px;\n}\n.btn-outline-primary[_ngcontent-%COMP%] {\n  background: white;\n  color: #3498db;\n  border: 1px solid #3498db;\n}\n.btn-outline-primary[_ngcontent-%COMP%]:hover {\n  background: #3498db;\n  color: white;\n}\n.btn-outline-danger[_ngcontent-%COMP%] {\n  background: white;\n  color: #e74c3c;\n  border: 1px solid #e74c3c;\n}\n.btn-outline-danger[_ngcontent-%COMP%]:hover {\n  background: #e74c3c;\n  color: white;\n}\n.btn-outline-danger[_ngcontent-%COMP%]:disabled {\n  background: #f8f9fa;\n  color: #6c757d;\n  border-color: #dee2e6;\n  cursor: not-allowed;\n}\n.payment-section[_ngcontent-%COMP%] {\n  padding: 20px;\n  text-align: center;\n  color: #6c757d;\n  font-style: italic;\n  background: #f8f9fa;\n}\n.instructions[_ngcontent-%COMP%] {\n  padding: 15px;\n  text-align: justify;\n  font-size: 12px;\n  line-height: 1.4;\n  margin: 15px 0;\n}\n.section-header[_ngcontent-%COMP%] {\n  background: #e0e0e0;\n  padding: 8px 12px;\n  font-weight: bold;\n  font-size: 11px;\n  margin: 10px 0 0 0;\n}\n.section-content[_ngcontent-%COMP%] {\n  padding: 10px 12px;\n  font-size: 12px;\n  border: 1px solid #e0e0e0;\n  border-top: none;\n}\n.centers-content[_ngcontent-%COMP%] {\n  width: 100%;\n  display: table;\n}\n.bcp-logo[_ngcontent-%COMP%] {\n  color: #203764;\n  font-weight: bold;\n  font-size: 14px;\n  display: table-cell;\n  width: 80px;\n  text-align: center;\n  vertical-align: middle;\n}\n.center[_ngcontent-%COMP%] {\n  display: table-cell;\n  width: 120px;\n  text-align: center;\n  color: red;\n  vertical-align: middle;\n}\n.dni[_ngcontent-%COMP%] {\n  display: table-cell;\n  width: 150px;\n  text-align: center;\n  vertical-align: middle;\n  padding-left: 20px;\n}\n.contact-info[_ngcontent-%COMP%] {\n  padding: 10px 12px;\n  font-size: 12px;\n  text-align: justify;\n  margin: 10px 0;\n}\n.signature-section[_ngcontent-%COMP%] {\n  margin-top: 30px;\n  padding: 10px 12px;\n  width: 100%;\n  display: table;\n}\n.signature-left[_ngcontent-%COMP%] {\n  display: table-cell;\n  width: 25%;\n  vertical-align: top;\n  text-align: left;\n}\n.signature-center[_ngcontent-%COMP%] {\n  display: table-cell;\n  width: 50%;\n  vertical-align: top;\n  text-align: center;\n  padding: 0 10px;\n}\n.signature-right[_ngcontent-%COMP%] {\n  display: table-cell;\n  width: 25%;\n  vertical-align: top;\n  text-align: center;\n}\n.footer-notes[_ngcontent-%COMP%] {\n  padding: 10px 12px;\n  font-size: 9px;\n  border-top: 1px solid #ccc;\n  margin-top: 20px;\n}\n.footer-notes[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 3px 0;\n  line-height: 1.3;\n}\n.error-message[_ngcontent-%COMP%] {\n  color: #e74c3c;\n  font-size: 10px;\n  font-style: italic;\n  margin-top: 4px;\n  display: block;\n}\n.modal-backdrop[_ngcontent-%COMP%] {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  background: rgba(0, 0, 0, 0.5);\n  -webkit-backdrop-filter: blur(4px);\n  backdrop-filter: blur(4px);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 9999;\n}\n.modal-dialog[_ngcontent-%COMP%] {\n  background: white;\n  border-radius: 16px;\n  width: 420px;\n  max-width: 90%;\n  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);\n  position: relative;\n  overflow: hidden;\n  animation: _ngcontent-%COMP%_fadeInUp 0.3s ease-out;\n}\n.modal-header[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #3b82f6 0%,\n      #8b5cf6 100%);\n  color: white;\n  padding: 20px 24px;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  cursor: move;\n}\n.modal-header[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 18px;\n  font-weight: 600;\n  color: white !important;\n}\n.close-btn[_ngcontent-%COMP%] {\n  border: none;\n  background: rgba(255, 255, 255, 0.2);\n  color: white;\n  font-size: 24px;\n  cursor: pointer;\n  width: 32px;\n  height: 32px;\n  border-radius: 8px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  transition: all 0.2s;\n}\n.close-btn[_ngcontent-%COMP%]:hover {\n  background: rgba(255, 255, 255, 0.3);\n}\n.modal-dialog.enhanced[_ngcontent-%COMP%] {\n  width: 420px;\n}\n.modal-body[_ngcontent-%COMP%] {\n  padding: 24px;\n  display: flex;\n  flex-direction: column;\n  gap: 20px;\n}\n.modal-field[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n}\n.modal-field[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  font-size: 14px;\n  font-weight: 600;\n  color: #374151;\n  display: flex;\n  align-items: center;\n  gap: 6px;\n}\n.modal-body[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  width: 100%;\n  padding: 12px 16px;\n  border: 2px solid #e5e7eb;\n  border-radius: 10px;\n  font-size: 14px;\n  transition: all 0.2s;\n  background: #f9fafb;\n}\n.modal-body[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus {\n  outline: none;\n  border-color: #3b82f6;\n  background: white;\n  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);\n}\n.modal-footer[_ngcontent-%COMP%] {\n  padding: 16px 24px 24px 24px;\n  display: flex;\n  gap: 12px;\n  justify-content: flex-end;\n}\n.modal-footer[_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%] {\n  padding: 12px 24px;\n  border-radius: 10px;\n  font-weight: 600;\n  font-size: 14px;\n  transition: all 0.2s;\n  border: none;\n  cursor: pointer;\n}\n.modal-footer[_ngcontent-%COMP%]   .btn-secondary[_ngcontent-%COMP%] {\n  background: #f3f4f6;\n  color: #374151;\n}\n.modal-footer[_ngcontent-%COMP%]   .btn-secondary[_ngcontent-%COMP%]:hover {\n  background: #e5e7eb;\n}\n.modal-footer[_ngcontent-%COMP%]   .btn-primary[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #3b82f6 0%,\n      #8b5cf6 100%);\n  color: white;\n  box-shadow: 0 4px 6px rgba(59, 130, 246, 0.3);\n}\n.modal-footer[_ngcontent-%COMP%]   .btn-primary[_ngcontent-%COMP%]:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 6px 12px rgba(59, 130, 246, 0.4);\n}\n.dark[_nghost-%COMP%]   .modal-backdrop[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .modal-backdrop[_ngcontent-%COMP%] {\n  background: rgba(0, 0, 0, 0.7);\n  -webkit-backdrop-filter: blur(8px);\n  backdrop-filter: blur(8px);\n}\n.dark[_nghost-%COMP%]   .modal-dialog[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .modal-dialog[_ngcontent-%COMP%] {\n  background: #1f2937;\n  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.3);\n}\n.dark[_nghost-%COMP%]   .modal-field[_ngcontent-%COMP%]   label[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .modal-field[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  color: #e5e7eb;\n}\n.dark[_nghost-%COMP%]   .modal-body[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .modal-body[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  background: #374151;\n  border-color: #4b5563;\n  color: #f9fafb;\n}\n.dark[_nghost-%COMP%]   .modal-body[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus, .dark   [_nghost-%COMP%]   .modal-body[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus {\n  border-color: #3b82f6;\n  background: #374151;\n  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);\n}\n.dark[_nghost-%COMP%]   .modal-footer[_ngcontent-%COMP%]   .btn-secondary[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .modal-footer[_ngcontent-%COMP%]   .btn-secondary[_ngcontent-%COMP%] {\n  background: #374151;\n  color: #e5e7eb;\n}\n.dark[_nghost-%COMP%]   .modal-footer[_ngcontent-%COMP%]   .btn-secondary[_ngcontent-%COMP%]:hover, .dark   [_nghost-%COMP%]   .modal-footer[_ngcontent-%COMP%]   .btn-secondary[_ngcontent-%COMP%]:hover {\n  background: #4b5563;\n}\n@keyframes _ngcontent-%COMP%_fadeInUp {\n  from {\n    opacity: 0;\n    transform: translateY(15px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n.toast-container[_ngcontent-%COMP%] {\n  position: fixed;\n  top: 100px;\n  right: 20px;\n  z-index: 10000;\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n  max-width: 400px;\n}\n.toast[_ngcontent-%COMP%] {\n  background: #fff;\n  border-radius: 8px;\n  padding: 16px 20px;\n  box-shadow: 0 4px 12px rgba(0, 0, 0, .15);\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  border-left: 4px solid;\n  animation: _ngcontent-%COMP%_slideInRight .3s ease-out;\n  min-width: 300px;\n}\n.toast.error[_ngcontent-%COMP%] {\n  border-left-color: #ef4444;\n  background: #fef2f2;\n}\n.toast.warning[_ngcontent-%COMP%] {\n  border-left-color: #f59e0b;\n  background: #fffbeb;\n}\n.toast-icon[_ngcontent-%COMP%] {\n  font-size: 20px;\n}\n.toast-content[_ngcontent-%COMP%] {\n  flex: 1;\n  font-size: 14px;\n  color: #374151;\n  line-height: 1.4;\n}\n.toast-close[_ngcontent-%COMP%] {\n  background: 0 0;\n  border: 0;\n  font-size: 18px;\n  cursor: pointer;\n  color: #9ca3af;\n  padding: 0;\n  width: 20px;\n  height: 20px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.toast-close[_ngcontent-%COMP%]:hover {\n  color: #374151;\n}\n@keyframes _ngcontent-%COMP%_slideInRight {\n  from {\n    transform: translateX(400px);\n    opacity: 0;\n  }\n  to {\n    transform: translateX(0);\n    opacity: 1;\n  }\n}\n@media (max-width: 1024px) {\n  .document-container[_ngcontent-%COMP%] {\n    padding: 20px;\n  }\n  .document[_ngcontent-%COMP%] {\n    padding: 20px;\n  }\n}\n@media (max-width: 768px) {\n  .payment-agreement-container[_ngcontent-%COMP%] {\n    padding: 10px;\n  }\n  .document-header[_ngcontent-%COMP%] {\n    flex-direction: column;\n    gap: 15px;\n    text-align: center;\n  }\n  .document-actions[_ngcontent-%COMP%] {\n    justify-content: center;\n  }\n  .document-container[_ngcontent-%COMP%] {\n    padding: 15px;\n  }\n  .document[_ngcontent-%COMP%] {\n    padding: 15px;\n    font-size: 11px;\n  }\n  .editable-input[_ngcontent-%COMP%] {\n    min-width: 100px;\n    font-size: 11px;\n  }\n  .editable-input.large-input[_ngcontent-%COMP%] {\n    min-width: 200px;\n    width: 200px;\n  }\n}\n@media (max-width: 480px) {\n  .document[_ngcontent-%COMP%] {\n    font-size: 10px;\n    padding: 10px;\n  }\n  .editable-input[_ngcontent-%COMP%] {\n    min-width: 80px;\n    font-size: 10px;\n    padding: 4px 6px;\n  }\n  .editable-input.large-input[_ngcontent-%COMP%] {\n    min-width: 160px;\n    width: 160px;\n  }\n  .editable-input.number-input[_ngcontent-%COMP%] {\n    min-width: 85px;\n    width: 85px;\n  }\n  .client-table[_ngcontent-%COMP%] {\n    font-size: 10px;\n  }\n  .client-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n    padding: 6px 8px;\n  }\n}\n/*# sourceMappingURL=agreements-page.component.css.map */"] });
var AgreementsPageComponent = _AgreementsPageComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AgreementsPageComponent, [{
    type: Component,
    args: [{ selector: "app-agreements-page", standalone: true, imports: [CommonModule, ReactiveFormsModule, FormsModule, LucideAngularModule, DragDropModule], template: `<div class="payment-agreement-container">\r
  <!-- Header -->\r
  <div class="flex items-center gap-2 mb-3">\r
    <div class="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-700 rounded-lg flex items-center justify-center">\r
      <lucide-angular name="file-text" [size]="16" class="text-white!"></lucide-angular>\r
    </div>\r
    <div>\r
      <h1 class="text-lg font-bold text-slate-900 dark:text-white">Generador de Acuerdo de Pago</h1>\r
      <p class="text-xs text-slate-600 dark:text-slate-400">Creaci\xF3n de acuerdos de pago para clientes</p>\r
    </div>\r
  </div>\r
\r
  <!-- Barra de opciones -->\r
  <div class="document-header">\r
    <!-- B\xFAsqueda DNI -->\r
    <form [formGroup]="searchForm" class="flex gap-2 items-center">\r
      <input\r
        formControlName="dniBusqueda"\r
        type="text"\r
        placeholder="DNI"\r
        class="h-10 w-[120px] px-3 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"\r
        maxlength="8" />\r
      <button\r
        type="button"\r
        class="h-10 px-4 text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"\r
        (click)="buscarPorDni()"\r
        [disabled]="searchForm.invalid">\r
        Buscar\r
      </button>\r
      <div *ngIf="tramoDetectado" class="ml-2 px-3 py-1 bg-green-50 border border-green-500 rounded text-sm font-bold text-green-700">\r
        Tramo: {{ tramoDetectado }}\r
      </div>\r
      <div *ngIf="tramoDetectado" class="ml-2 px-3 py-1 rounded text-sm font-bold"\r
           [class.bg-blue-50]="selectedEntidad === 'financiera_oh'"\r
           [class.border-blue-500]="selectedEntidad === 'financiera_oh'"\r
           [class.text-blue-700]="selectedEntidad === 'financiera_oh'"\r
           [class.bg-purple-50]="selectedEntidad === 'nsoluciones'"\r
           [class.border-purple-500]="selectedEntidad === 'nsoluciones'"\r
           [class.text-purple-700]="selectedEntidad === 'nsoluciones'"\r
           [class.border]="true">\r
        Plantilla: {{ selectedEntidad === 'financiera_oh' ? 'Financiera Oh' : 'NSoluciones' }}\r
      </div>\r
      <span *ngIf="isLoading" class="spinner"></span>\r
    </form>\r
\r
    <!-- Botones de acci\xF3n -->\r
    <div class="document-actions">\r
      <button\r
        type="button"\r
        class="h-10 px-4 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-lg transition-all duration-200"\r
        (click)="resetForm()">\r
        Limpiar\r
      </button>\r
      <button\r
        type="button"\r
        class="h-10 px-4 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"\r
        (click)="onSubmit()"\r
        [disabled]="agreementForm.invalid || isLoading">\r
        {{ isLoading ? 'Generando...' : 'Generar PDF' }}\r
      </button>\r
    </div>\r
  </div>\r
\r
  <!-- Placeholder cuando no hay DNI buscado -->\r
  <div *ngIf="!mostrarDocumento" class="document-container">\r
    <div class="flex flex-col items-center justify-center py-20 px-8 rounded-lg shadow-sm"\r
         [class.bg-white]="!isDarkMode"\r
         [class.bg-slate-800]="isDarkMode">\r
      <div class="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-700 rounded-full flex items-center justify-center mb-6 shadow-lg">\r
        <lucide-angular name="search" [size]="48" style="color: white !important;"></lucide-angular>\r
      </div>\r
      <h3 class="text-xl font-bold mb-2"\r
          [class.text-slate-900]="!isDarkMode"\r
          [class.text-white]="isDarkMode">\r
        Busca un cliente para comenzar\r
      </h3>\r
      <p class="text-sm text-center max-w-md"\r
         [class.text-slate-600]="!isDarkMode"\r
         [class.text-slate-400]="isDarkMode">\r
        Ingresa el DNI del cliente en el buscador para cargar autom\xE1ticamente los datos y generar el acuerdo de pago.\r
      </p>\r
    </div>\r
  </div>\r
\r
  <!-- Documento con inputs incrustados -->\r
  <div *ngIf="mostrarDocumento" class="document-container">\r
    <form [formGroup]="agreementForm" class="document bg-white text-black">\r
        <!-- Header con logos -->\r
        <div class="header">\r
          <div class="logo-section">\r
            <div class="logo-left">\r
              <div class="logo-placeholder">LOGO 1</div>\r
            </div>\r
            <div class="logo-right">\r
              <div class="logo-placeholder">LOGO 2</div>\r
            </div>\r
          </div>\r
        </div>\r
\r
        <!-- L\xEDnea debajo de los logos -->\r
        <div class="line"></div>\r
\r
        <!-- Fecha -->\r
        <div class="date-location">\r
          <div class="date-input-container">\r
            <input \r
              type="date" \r
              formControlName="fechaActual"\r
              class="editable-input date-input"\r
              [class.is-invalid]="isFieldInvalid('fechaActual')">\r
\r
            <div class="formatted-date" *ngIf="agreementForm.get('fechaActual')?.value">\r
              {{ formatDisplayDate(agreementForm.get('fechaActual')?.value) }}\r
            </div>\r
          </div>\r
          <div class="error-message" *ngIf="isFieldInvalid('fechaActual')">\r
            {{ getFieldError('fechaActual') }}\r
          </div>\r
        </div>\r
\r
        <div class="red-header text-white"\r
             [class.bg-[#d32f2f]]="selectedEntidad === 'financiera_oh'"\r
             [class.bg-black]="selectedEntidad === 'nsoluciones'">\r
          <ng-container *ngIf="selectedEntidad === 'financiera_oh'">\r
            ACUERDO DE PAGO - CAMPA\xD1A LIMPIA TU DEUDA\r
          </ng-container>\r
          <ng-container *ngIf="selectedEntidad === 'nsoluciones'">\r
            ACUERDO DE PAGO - CANCELACI\xD3N TOTAL\r
          </ng-container>\r
        </div>\r
\r
        <table class="client-table bg-white text-black">\r
          <tr>\r
            <td class="label-cell bg-[#f8f9fa] text-black">NOMBRE DEL TITULAR</td>\r
            <td class="highlight input-cell bg-white text-black">\r
              <input\r
                type="text"\r
                formControlName="nombreTitular"\r
                class="editable-input large-input readonly-input"\r
                readonly\r
                placeholder="JUAN CARLOS PEREZ GARCIA">\r
            </td>\r
          </tr>\r
          <tr>\r
            <td class="label-cell bg-[#f8f9fa] text-black">NUMERO DNI</td>\r
            <td class="highlight input-cell bg-white text-black">\r
              <input\r
                type="text"\r
                formControlName="dni"\r
                class="editable-input readonly-input"\r
                readonly\r
                placeholder="12345678">\r
            </td>\r
          </tr>\r
          <tr>\r
            <td class="label-cell bg-[#f8f9fa] text-black">Nro. CUENTA TARJETA Oh!</td>\r
            <td class="highlight input-cell bg-white text-black">\r
              <input\r
                type="text"\r
                formControlName="cuentaTarjeta"\r
                class="editable-input large-input readonly-input"\r
                readonly\r
                placeholder="1234567890123456">\r
            </td>\r
          </tr>\r
        </table>\r
\r
        <div class="congratulations text-black">\r
          \xA1Felicitaciones!, ya se encuentra <strong>APROBADO</strong> su <strong>CAMPA\xD1A ESPECIAL</strong> con el cual estar\xEDa cancelando <strong>TODA SU DEUDA</strong>, lo puede pagar desde el d\xEDa de hoy, se encontrar\xE1 habilitado hasta este:\r
        </div>\r
\r
        <div class="date-highlight text-black">\r
          <div class="date-input-container">\r
            <input\r
              type="date"\r
              formControlName="fechaCompromiso"\r
              class="editable-input date-input"\r
              [class.is-invalid]="isFieldInvalid('fechaCompromiso')"\r
              [readonly]="isFechaCompromisoReadonly">\r
\r
            <div class="formatted-date" *ngIf="agreementForm.get('fechaCompromiso')?.value">\r
              {{ formatDisplayDate(agreementForm.get('fechaCompromiso')?.value) }}\r
              <span *ngIf="formasDePagoArray.length > 0" style="font-size: 0.8em; color: #666; margin-left: 5px;">\r
                (Fecha del 1er pago)\r
              </span>\r
            </div>\r
          </div>\r
          <div class="error-message" *ngIf="isFieldInvalid('fechaCompromiso')">\r
            {{ getFieldError('fechaCompromiso') }}\r
          </div>\r
        </div>\r
\r
        <div class="debt-header text-white"\r
             [class.bg-[#d32f2f]]="selectedEntidad === 'financiera_oh'"\r
             [class.bg-black]="selectedEntidad === 'nsoluciones'">\r
          DETALLE DE DEUDA Y PROMOCI\xD3N APROBADA\r
        </div>\r
\r
        <table class="debt-table bg-white text-black">\r
          <tr>\r
            <th class="bg-white text-black">DEUDA TOTAL</th>\r
            <th class="bg-white text-black">DESCUENTO</th>\r
            <th class="bg-white text-black">MONTO APROBADO</th>\r
          </tr>\r
          <tr>\r
            <td class="amount bg-white text-black">\r
              <div class="amount-input-container">\r
                S/ <input\r
                    type="number"\r
                    formControlName="deudaTotal"\r
                    class="editable-input number-input readonly-input"\r
                    [class.blackout]="isBlackoutMode"\r
                    readonly\r
                    step="0.01"\r
                    min="0">\r
              </div>\r
            </td>\r
\r
            <td class="amount bg-white text-black">\r
              <div class="amount-input-container">\r
                S/ <input\r
                    type="number"\r
                    formControlName="descuento"\r
                    class="editable-input number-input"\r
                    [class.blackout]="isBlackoutMode"\r
                    readonly>\r
              </div>\r
            </td>\r
\r
            <td class="highlight-amount bg-yellow-300 text-black">\r
              <div class="amount-input-container">\r
                S/ <input \r
                      type="number" \r
                      formControlName="montoAprobado"\r
                      class="editable-input number-input"\r
                      step="1"\r
                      min="0"\r
                      (input)="calculateDiscount()"\r
                      [class.is-invalid]="isFieldInvalid('montoAprobado')">\r
                <button \r
                  type="button" \r
                  class="btn-toggle-debt"\r
                  [class.active]="isBlackoutMode"\r
                  (click)="toggleBlackoutMode()"\r
                  [title]="getToggleTitle()">\r
                  {{ getToggleIcon() }}\r
                </button>\r
              </div>\r
            </td>\r
          </tr>\r
          \r
          <!-- Secci\xF3n de formas de pago -->\r
          <tr>\r
            <td colspan="3" class="payment-header-clean">\r
              <div class="payment-header-container">\r
                <span class="payment-title">Formas de pago</span>\r
                <button type="button" class="btn btn-success btn-sm" (click)="addFormaPago()">+ Agregar</button>\r
              </div>\r
            </td>\r
          </tr>\r
          \r
          <!-- Opciones de pago din\xE1micas -->\r
          <ng-container formArrayName="formasDePago">\r
            <tr *ngFor="let forma of formasDePagoArray.controls; let i = index" [formGroupName]="i">\r
              <!-- Columna con botones y detalles del pago -->\r
              <td class="payment-row" colspan="3">\r
                <div class="payment-row-content">\r
                  <!-- Primero la informaci\xF3n del pago -->\r
                  <div class="payment-info">\r
                    <strong>{{ i + 1 }}{{ getOrdinalSuffix(i + 1) }} PAGO</strong> \u2014 \r
                    {{ forma.get('fechaPago')?.value }} \u2014 \r
                    S/ {{ forma.get('montoPago')?.value }} SOLES\r
                  </div>\r
                  \r
                  <!-- Despu\xE9s los botones -->\r
                  <div class="payment-actions">\r
                    <button type="button" class="btn btn-outline-primary btn-sm" (click)="abrirEditorFormaPago(i)">Editar</button>\r
                    <button type="button" class="btn btn-outline-danger btn-sm" [disabled]="formasDePagoArray.length <= 1" (click)="removeFormaPago(i)">Eliminar</button>\r
                  </div>\r
                </div>\r
              </td>\r
            </tr>\r
          </ng-container>\r
\r
          <!-- Observaci\xF3n \xFAnica (solo se muestra si existe) -->\r
          <tr *ngIf="mostrarObservacion">\r
            <td colspan="3" class="payment-observation-unique">\r
              <div class="observation-header">Observaci\xF3n:</div>\r
              <div class="observation-content">{{ observacionTexto }}</div>\r
            </td>\r
          </tr>\r
          \r
          <!-- Mensaje cuando no hay formas de pago -->\r
          <tr *ngIf="formasDePagoArray.length === 0">\r
            <td colspan="3" class="payment-section">\r
              <em>No hay formas de pago definidas.</em>\r
            </td>\r
          </tr>\r
        </table>\r
\r
        <div class="instructions text-black" *ngIf="selectedEntidad === 'financiera_oh'">\r
          Acercarse con su DNI, tarjeta Oh! y este documento; Indicar en los cajeros que va a realizar un <strong>pago o abono</strong> a su Tarjeta Oh por el monto <strong>APROBADO</strong>, en caso de no tener la tarjeta puede pagar con el n\xFAmero de cuenta de su tarjeta consignada en la parte superior de este documento.\r
        </div>\r
\r
        <div class="section-header bg-[#e0e0e0] text-black">CENTROS DE PAGO VIRTUAL:</div>\r
        <div class="section-content text-black">\r
          <div class="centers-content">\r
            <div class="bcp-logo">BCP</div>\r
            <div class="center">APP/WEB</div>\r
            <div class="dni text-black">\r
              <ng-container *ngIf="selectedEntidad === 'financiera_oh'">\r
                Con su n\xFAmero de DNI\r
              </ng-container>\r
              <ng-container *ngIf="selectedEntidad === 'nsoluciones'">\r
                PAGO POR SERVICIO - NSOLUCIONES CONSULTING\r
              </ng-container>\r
            </div>\r
          </div>\r
        </div>\r
\r
        <div class="section-header bg-[#e0e0e0] text-black">CENTROS DE PAGO PRESENCIAL :</div>\r
        <div class="section-content text-black">\r
          <div class="centers-content">\r
            <div class="bcp-logo">BCP</div>\r
            <div class="center">AGENTE/VENTANILLA</div>\r
            <div class="dni text-black">\r
              <ng-container *ngIf="selectedEntidad === 'financiera_oh'">\r
                Presentando su DNI\r
              </ng-container>\r
              <ng-container *ngIf="selectedEntidad === 'nsoluciones'">\r
                PAGO POR SERVICIO - NSOLUCIONES CONSULTING\r
              </ng-container>\r
            </div>\r
          </div>\r
        </div>\r
\r
        <div class="section-header bg-[#e0e0e0] text-black">CONFIRMACI\xD3N DE PAGO:</div>\r
        <div class="section-content text-black">\r
          <ng-container *ngIf="selectedEntidad === 'financiera_oh'">\r
            Enviar foto del voucher de transacci\xF3n al WhatsApp corporativo de Financiera Oh para su validaci\xF3n, registro, cancelaci\xF3n de deuda y retiro de cobranza.\r
          </ng-container>\r
          <ng-container *ngIf="selectedEntidad === 'nsoluciones'">\r
            Enviar foto del v\xF3ucher de transacci\xF3n al WhatsApp corporativo de NSOLUCIONES para su validaci\xF3n, registro, cancelaci\xF3n de deuda y retiro de cobranza.\r
          </ng-container>\r
        </div>\r
\r
        <div class="section-header bg-[#e0e0e0] text-black">TRAMITE DE CARTA DE NO ADEUDO:</div>\r
        <div class="section-content text-black">\r
          <ng-container *ngIf="selectedEntidad === 'financiera_oh'">\r
            A partir de 15 d\xEDas h\xE1biles de la cancelaci\xF3n ya puede solicitar el tr\xE1mite su carta de no adeudo escribiendo al <strong>WhatsApp: 980732405 - OPCION 2</strong> o llamando al (01) 619-4800; (01) 631-5400; para que lo pueda recoger en plataforma o solicitar el env\xEDo a su correo.\r
          </ng-container>\r
          <ng-container *ngIf="selectedEntidad === 'nsoluciones'">\r
            A partir de 24 HORAS posterior al pago ya podr\xE1 solicitar el tr\xE1mite su carta de no adeudo escribiendo al WhatsApp: 915326798 para coordinar el env\xEDo  a su correo.\r
          </ng-container>\r
        </div>\r
\r
        <div class="contact-info text-black">\r
          <ng-container *ngIf="selectedEntidad === 'financiera_oh'">\r
            Si desea mayor informaci\xF3n, comun\xEDquese a los siguientes n\xFAmeros de contacto directo: V\xEDa Telf.: o v\xEDa WhatsApp: <strong>968437436</strong>\r
          </ng-container>\r
          <ng-container *ngIf="selectedEntidad === 'nsoluciones'">\r
            Si desea mayor informaci\xF3n, comun\xEDquese a los siguientes n\xFAmeros de contacto directo: V\xEDa Telf.: o v\xEDa WhatsApp: <strong>915257493</strong>\r
          </ng-container>\r
        </div>\r
\r
        <!-- Secci\xF3n de firma -->\r
        <div class="signature-section text-black">\r
          <div class="signature-left text-black">\r
            <span>Atentamente,</span>\r
          </div>\r
          <div class="signature-center text-black">\r
            <ng-container *ngIf="selectedEntidad === 'financiera_oh'">\r
              <div class="logo-placeholder small">LOGO BCP</div>\r
              <div style="text-align: center; padding: 10px;">\r
                <strong>Romina Tapia Albinagorta &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Dpto.</strong><br />\r
                <strong>COBRANZAS Oh!</strong>\r
              </div>\r
            </ng-container>\r
            <ng-container *ngIf="selectedEntidad === 'nsoluciones'">\r
              <div class="logo-placeholder small">FIRMA</div>\r
              <div style="text-align: center; padding: 10px;">\r
                <strong>Emily Dayana Saenz Martinez</strong><br />\r
                <strong>NSOLUCIONES CONSULTING S.A.C</strong>\r
              </div>\r
            </ng-container>\r
          </div>\r
          <div class="signature-right">\r
            <div class="logo-placeholder small">COMPROMISO</div>\r
          </div>\r
        </div>\r
\r
        <div class="footer-notes">\r
          <p>(*) Si al recibir esta comunicaci\xF3n Ud. Ha cancelado o regularizado su deuda, por favor desestimar su contenido.</p>\r
          <p>(*) Para acceder a las facilidades deber\xE1 estar incluida en la relaci\xF3n de cuentas pre -aprobado.</p>\r
          <p>(*) Sujeto a variaci\xF3n, por negativa a facilidad.</p>\r
        </div>\r
      </form>\r
\r
    <!--Modal-->\r
    <div class="modal-backdrop" *ngIf="formaPagoSeleccionadaIndex !== null">\r
      <div class="modal-dialog enhanced" cdkDrag>\r
        <div class="modal-header" cdkDragHandle>\r
          <h3>Editar forma de pago</h3>\r
          <button (click)="cerrarEditor()" class="close-btn">\xD7</button>\r
        </div>\r
\r
        <div class="modal-body" [formGroup]="formaPagoTemporal">\r
          <div class="modal-field">\r
            <label for="fechaPago">\u{1F4C5} Fecha del pago</label>\r
            <input \r
              type="date" \r
              formControlName="fechaPago" \r
              id="fechaPago"\r
              class="editable-input date-input" />\r
          </div>\r
\r
          <div class="modal-field">\r
            <label for="montoPago">\u{1F4B0} Monto (S/)</label>\r
            <input \r
              type="number" \r
              formControlName="montoPago" \r
              step="0.01" \r
              min="0"\r
              id="montoPago"\r
              class="editable-input number-input" />\r
          </div>\r
        </div>\r
\r
        <div class="modal-footer">\r
          <button class="btn btn-secondary" (click)="cerrarEditor()">Cancelar</button>\r
          <button class="btn btn-primary" (click)="guardarEdicionFormaPago()">Guardar</button>\r
        </div>\r
      </div>\r
    </div>\r
\r
  </div>\r
\r
  </div>\r
\r
  <!-- Toast Container -->\r
  <div class="toast-container">\r
    <div *ngFor="let toast of toasts"\r
         class="toast"\r
         [ngClass]="toast.type">\r
      <span class="toast-icon">{{ toast.icon }}</span>\r
      <div class="toast-content">{{ toast.message }}</div>\r
      <button class="toast-close" (click)="removeToast(toast.id)">\xD7</button>\r
    </div>\r
  </div>`, styles: ["/* src/app/features/legacy/agreements/pages/agreements-page/agreements-page.component.css */\nbody {\n  margin-top: 5rem;\n  margin-bottom: 2rem;\n}\n.payment-agreement-container {\n  display: flex;\n  flex-direction: column;\n  min-height: 100vh;\n  font-family: Arial, sans-serif;\n  background-color: #f5f5f5;\n  padding: 2rem 20px 20px 20px;\n  transition: background-color 0.3s ease;\n}\n:host-context(.dark) .payment-agreement-container {\n  background-color: #0f172a;\n}\n:host-context(.dark) .document-header {\n  background:\n    linear-gradient(\n      135deg,\n      #1e293b 0%,\n      #0f172a 100%);\n  border-color: #334155;\n}\n:host-context(.dark) .document-title {\n  color: #e2e8f0;\n}\n.document-header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 2rem;\n  padding: 1.5rem 2rem;\n  background:\n    linear-gradient(\n      135deg,\n      #fff 0%,\n      #f8fafc 100%);\n  border-radius: 16px;\n  box-shadow: 0 4px 20px rgba(0, 0, 0, .08);\n  border: 1px solid #e2e8f0;\n  gap: 1rem;\n}\n.document-actions {\n  display: flex;\n  gap: 1rem;\n  align-items: center;\n}\n.btn {\n  padding: 0.75rem 1.5rem;\n  border: none;\n  border-radius: 8px;\n  cursor: pointer;\n  font-size: 0.95rem;\n  font-weight: 500;\n  transition: all 0.3s ease;\n  text-decoration: none;\n  display: inline-flex;\n  align-items: center;\n  gap: 8px;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);\n  position: relative;\n  overflow: hidden;\n}\n.btn:hover {\n  transform: translateY(-1px);\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);\n}\n.btn-primary {\n  background:\n    linear-gradient(\n      135deg,\n      #3b82f6,\n      #8b5cf6);\n  color: white;\n  border: none;\n}\n.btn-primary:hover:not(:disabled) {\n  background:\n    linear-gradient(\n      135deg,\n      #2563eb,\n      #7c3aed);\n  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);\n}\n.btn-primary:disabled {\n  background:\n    linear-gradient(\n      135deg,\n      #94a3b8,\n      #cbd5e1);\n  cursor: not-allowed;\n  transform: none;\n}\n.btn-secondary {\n  background: #64748b;\n  color: white;\n  border: none;\n}\n.btn-secondary:hover {\n  background: #475569;\n}\n.btn-success {\n  background:\n    linear-gradient(\n      135deg,\n      #10b981,\n      #059669);\n  color: white;\n  border: none;\n}\n.btn-success:hover {\n  background:\n    linear-gradient(\n      135deg,\n      #059669,\n      #047857);\n  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.3);\n}\n.btn-search {\n  background:\n    linear-gradient(\n      135deg,\n      #10b981,\n      #059669);\n  color: white;\n  border: none;\n}\n.btn-search:hover {\n  background:\n    linear-gradient(\n      135deg,\n      #059669,\n      #047857);\n  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.3);\n}\n.btn-clean {\n  background:\n    linear-gradient(\n      135deg,\n      #ef4444,\n      #dc2626);\n  color: white;\n  border: none;\n}\n.btn-clean:hover {\n  background:\n    linear-gradient(\n      135deg,\n      #dc2626,\n      #b91c1c);\n  box-shadow: 0 4px 16px rgba(239, 68, 68, 0.3);\n}\n.spinner {\n  width: 20px;\n  height: 20px;\n  border: 2px solid rgba(255, 255, 255, 0.3);\n  border-top: 2px solid currentColor;\n  border-radius: 50%;\n  animation: spin 1s linear infinite;\n}\n@keyframes spin {\n  0% {\n    transform: rotate(0deg);\n  }\n  100% {\n    transform: rotate(360deg);\n  }\n}\n.document-container {\n  display: flex;\n  justify-content: center;\n  background:\n    linear-gradient(\n      135deg,\n      #fff 0%,\n      #f8fafc 100%);\n  border-radius: 8px;\n  padding: 40px;\n  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);\n}\n:host-context(.dark) .document-container {\n  background:\n    linear-gradient(\n      135deg,\n      #1e293b 0%,\n      #0f172a 100%);\n}\n.document {\n  width: 100%;\n  max-width: 800px;\n  margin: 0 auto;\n  padding: 30px;\n  border: 2px solid black;\n  background: white;\n  font-family: Arial, sans-serif;\n  font-size: 12px;\n  position: relative;\n}\n.editable-input {\n  border: 1px dashed #3498db;\n  background: #f8f9fa;\n  padding: 6px 10px;\n  border-radius: 4px;\n  font-family: inherit;\n  font-size: inherit;\n  font-weight: inherit;\n  color: inherit;\n  display: inline-block;\n  transition: all 0.3s ease;\n  vertical-align: middle;\n  box-sizing: border-box;\n}\n.editable-input.blackout {\n  background: black !important;\n  color: transparent !important;\n  border-color: black !important;\n}\n.editable-input.blackout:focus {\n  background: black !important;\n  color: transparent !important;\n  box-shadow: none !important;\n}\n.editable-input:focus {\n  outline: none;\n  border-color: #2980b9;\n  background: white;\n  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);\n}\n.editable-input.is-invalid {\n  border-color: #e74c3c;\n  background: #fdf2f2;\n}\n.readonly-input {\n  background: #e2e8f0 !important;\n  border: 1px solid #94a3b8 !important;\n  cursor: not-allowed !important;\n  color: #475569 !important;\n  font-weight: 500 !important;\n  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.15) !important;\n}\n.readonly-input::placeholder {\n  color: #94a3b8 !important;\n  opacity: 0.9 !important;\n  font-style: normal !important;\n}\n.editable-input:readonly {\n  background: #d1d5db;\n  opacity: 0.85;\n  border: 1px solid #9ca3af;\n  border-style: solid;\n  cursor: not-allowed;\n  color: #4b5563;\n  font-weight: 500;\n  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.15);\n}\n.editable-input:readonly::placeholder {\n  color: #9ca3af;\n  opacity: 1;\n  font-style: italic;\n}\n.date-input-container {\n  position: relative;\n  display: inline-block;\n}\n.amount-input-container {\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n  justify-content: center;\n  position: relative;\n}\n.btn-toggle-debt {\n  background: #e74c3c;\n  color: white;\n  border: none;\n  border-radius: 50%;\n  width: 22px;\n  height: 22px;\n  font-size: 12px;\n  font-weight: bold;\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  margin-left: 6px;\n  transition: all 0.2s ease;\n  line-height: 1;\n  padding: 0;\n}\n.btn-toggle-debt:hover {\n  background: #c0392b;\n  transform: scale(1.1);\n}\n.btn-toggle-debt:active {\n  transform: scale(0.95);\n}\n.btn-toggle-debt.active {\n  background: #28a745;\n}\n.btn-toggle-debt.active:hover {\n  background: #218838;\n}\n.editable-input.date-input {\n  min-width: 140px;\n  width: 140px;\n}\ninput[type=date] {\n  color-scheme: light;\n}\ninput[type=date]::-webkit-calendar-picker-indicator {\n  filter: none;\n  opacity: 1;\n  cursor: pointer;\n}\n.editable-input.number-input {\n  text-align: right;\n  min-width: 110px;\n  width: 110px;\n}\n.editable-input.large-input {\n  min-width: 280px;\n  width: 280px;\n}\n.editable-input.dni-input {\n  min-width: 100px;\n  width: 100px;\n  text-align: center;\n}\n.header {\n  padding: 5px 0;\n  position: relative;\n  width: 100%;\n}\n.logo-section {\n  width: 100%;\n  display: table;\n}\n.logo-left {\n  display: table-cell;\n  width: 50%;\n  text-align: left;\n  vertical-align: top;\n}\n.logo-right {\n  display: table-cell;\n  width: 50%;\n  text-align: right;\n  vertical-align: top;\n}\n.logo-placeholder {\n  display: inline-block;\n  padding: 10px 20px;\n  background: #ecf0f1;\n  border: 2px dashed #bdc3c7;\n  color: #7f8c8d;\n  font-weight: bold;\n  font-size: 12px;\n}\n.logo-placeholder.small {\n  padding: 5px 10px;\n  font-size: 10px;\n}\n.date-location {\n  text-align: right;\n  font-size: 11px;\n  margin: 10px 0;\n}\n.formatted-date {\n  margin-top: 8px;\n  font-size: 12px;\n  color: #2c3e50;\n  font-weight: 500;\n}\n.line {\n  border-top: 2px solid black;\n  margin: 5px 0 10px 0;\n}\n.red-header {\n  color: white;\n  text-align: center;\n  padding: 10px;\n  font-weight: bold;\n  font-size: 13px;\n  margin: 10px 0;\n}\n.client-table {\n  width: 100%;\n  border-collapse: collapse;\n  margin: 15px 0;\n}\n.client-table td {\n  padding: 10px 12px;\n  border: 1px solid #ccc;\n  font-size: 12px;\n}\n.client-table td.label-cell {\n  background: #f8f9fa;\n}\n.label-cell {\n  width: 40%;\n  font-weight: normal;\n  background: #f8f9fa;\n}\n.input-cell {\n  width: 60%;\n  position: relative;\n}\n.highlight {\n  font-weight: bold;\n}\n.congratulations {\n  padding: 15px;\n  text-align: center;\n  font-size: 12px;\n  line-height: 1.5;\n  margin: 15px 0;\n}\n.date-highlight {\n  text-align: center;\n  font-weight: bold;\n  font-size: 14px;\n  padding: 15px 0;\n}\n.debt-header {\n  color: white;\n  text-align: center;\n  padding: 10px;\n  font-weight: bold;\n  font-size: 12px;\n  margin: 15px 0 0 0;\n}\n.debt-table {\n  width: 100%;\n  border-collapse: collapse;\n  table-layout: fixed;\n}\n.debt-table th,\n.debt-table td {\n  border: 1px solid #ccc;\n  padding: 12px;\n  text-align: center;\n  font-size: 12px;\n  vertical-align: middle;\n}\n.highlight-amount {\n  background: yellow;\n  font-weight: bold;\n  font-size: 13px;\n}\n.amount {\n  font-weight: bold;\n}\n.payment-header-clean {\n  background: none;\n  padding: 12px;\n  font-size: 14px;\n  font-weight: bold;\n  border: none;\n}\n.payment-header-container {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n.payment-title {\n  font-weight: bold;\n  font-size: 14px;\n}\n.payment-row {\n  padding: 12px;\n  border: 1px solid #ccc;\n  font-size: 13px;\n  background: #f8f9fa;\n}\n.payment-row-content {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 15px;\n  flex-wrap: wrap;\n}\n.payment-info {\n  flex: 1;\n  font-weight: 500;\n  order: 1;\n}\n.payment-actions {\n  display: flex;\n  gap: 8px;\n  flex-shrink: 0;\n  order: 2;\n}\n.payment-observation-unique {\n  border: 1px solid #ccc;\n  padding: 15px;\n  background: #fff9e6;\n  font-size: 12px;\n}\n.observation-header {\n  font-weight: bold;\n  color: #d32f2f;\n  margin-bottom: 8px;\n  font-size: 13px;\n}\n.observation-content {\n  white-space: pre-line;\n  line-height: 1.4;\n  color: #2c3e50;\n}\n.btn-sm {\n  font-size: 12px;\n  padding: 6px 12px;\n  border-radius: 4px;\n}\n.btn-outline-primary {\n  background: white;\n  color: #3498db;\n  border: 1px solid #3498db;\n}\n.btn-outline-primary:hover {\n  background: #3498db;\n  color: white;\n}\n.btn-outline-danger {\n  background: white;\n  color: #e74c3c;\n  border: 1px solid #e74c3c;\n}\n.btn-outline-danger:hover {\n  background: #e74c3c;\n  color: white;\n}\n.btn-outline-danger:disabled {\n  background: #f8f9fa;\n  color: #6c757d;\n  border-color: #dee2e6;\n  cursor: not-allowed;\n}\n.payment-section {\n  padding: 20px;\n  text-align: center;\n  color: #6c757d;\n  font-style: italic;\n  background: #f8f9fa;\n}\n.instructions {\n  padding: 15px;\n  text-align: justify;\n  font-size: 12px;\n  line-height: 1.4;\n  margin: 15px 0;\n}\n.section-header {\n  background: #e0e0e0;\n  padding: 8px 12px;\n  font-weight: bold;\n  font-size: 11px;\n  margin: 10px 0 0 0;\n}\n.section-content {\n  padding: 10px 12px;\n  font-size: 12px;\n  border: 1px solid #e0e0e0;\n  border-top: none;\n}\n.centers-content {\n  width: 100%;\n  display: table;\n}\n.bcp-logo {\n  color: #203764;\n  font-weight: bold;\n  font-size: 14px;\n  display: table-cell;\n  width: 80px;\n  text-align: center;\n  vertical-align: middle;\n}\n.center {\n  display: table-cell;\n  width: 120px;\n  text-align: center;\n  color: red;\n  vertical-align: middle;\n}\n.dni {\n  display: table-cell;\n  width: 150px;\n  text-align: center;\n  vertical-align: middle;\n  padding-left: 20px;\n}\n.contact-info {\n  padding: 10px 12px;\n  font-size: 12px;\n  text-align: justify;\n  margin: 10px 0;\n}\n.signature-section {\n  margin-top: 30px;\n  padding: 10px 12px;\n  width: 100%;\n  display: table;\n}\n.signature-left {\n  display: table-cell;\n  width: 25%;\n  vertical-align: top;\n  text-align: left;\n}\n.signature-center {\n  display: table-cell;\n  width: 50%;\n  vertical-align: top;\n  text-align: center;\n  padding: 0 10px;\n}\n.signature-right {\n  display: table-cell;\n  width: 25%;\n  vertical-align: top;\n  text-align: center;\n}\n.footer-notes {\n  padding: 10px 12px;\n  font-size: 9px;\n  border-top: 1px solid #ccc;\n  margin-top: 20px;\n}\n.footer-notes p {\n  margin: 3px 0;\n  line-height: 1.3;\n}\n.error-message {\n  color: #e74c3c;\n  font-size: 10px;\n  font-style: italic;\n  margin-top: 4px;\n  display: block;\n}\n.modal-backdrop {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  background: rgba(0, 0, 0, 0.5);\n  -webkit-backdrop-filter: blur(4px);\n  backdrop-filter: blur(4px);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 9999;\n}\n.modal-dialog {\n  background: white;\n  border-radius: 16px;\n  width: 420px;\n  max-width: 90%;\n  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);\n  position: relative;\n  overflow: hidden;\n  animation: fadeInUp 0.3s ease-out;\n}\n.modal-header {\n  background:\n    linear-gradient(\n      135deg,\n      #3b82f6 0%,\n      #8b5cf6 100%);\n  color: white;\n  padding: 20px 24px;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  cursor: move;\n}\n.modal-header h3 {\n  margin: 0;\n  font-size: 18px;\n  font-weight: 600;\n  color: white !important;\n}\n.close-btn {\n  border: none;\n  background: rgba(255, 255, 255, 0.2);\n  color: white;\n  font-size: 24px;\n  cursor: pointer;\n  width: 32px;\n  height: 32px;\n  border-radius: 8px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  transition: all 0.2s;\n}\n.close-btn:hover {\n  background: rgba(255, 255, 255, 0.3);\n}\n.modal-dialog.enhanced {\n  width: 420px;\n}\n.modal-body {\n  padding: 24px;\n  display: flex;\n  flex-direction: column;\n  gap: 20px;\n}\n.modal-field {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n}\n.modal-field label {\n  font-size: 14px;\n  font-weight: 600;\n  color: #374151;\n  display: flex;\n  align-items: center;\n  gap: 6px;\n}\n.modal-body input {\n  width: 100%;\n  padding: 12px 16px;\n  border: 2px solid #e5e7eb;\n  border-radius: 10px;\n  font-size: 14px;\n  transition: all 0.2s;\n  background: #f9fafb;\n}\n.modal-body input:focus {\n  outline: none;\n  border-color: #3b82f6;\n  background: white;\n  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);\n}\n.modal-footer {\n  padding: 16px 24px 24px 24px;\n  display: flex;\n  gap: 12px;\n  justify-content: flex-end;\n}\n.modal-footer .btn {\n  padding: 12px 24px;\n  border-radius: 10px;\n  font-weight: 600;\n  font-size: 14px;\n  transition: all 0.2s;\n  border: none;\n  cursor: pointer;\n}\n.modal-footer .btn-secondary {\n  background: #f3f4f6;\n  color: #374151;\n}\n.modal-footer .btn-secondary:hover {\n  background: #e5e7eb;\n}\n.modal-footer .btn-primary {\n  background:\n    linear-gradient(\n      135deg,\n      #3b82f6 0%,\n      #8b5cf6 100%);\n  color: white;\n  box-shadow: 0 4px 6px rgba(59, 130, 246, 0.3);\n}\n.modal-footer .btn-primary:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 6px 12px rgba(59, 130, 246, 0.4);\n}\n:host-context(.dark) .modal-backdrop {\n  background: rgba(0, 0, 0, 0.7);\n  -webkit-backdrop-filter: blur(8px);\n  backdrop-filter: blur(8px);\n}\n:host-context(.dark) .modal-dialog {\n  background: #1f2937;\n  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.3);\n}\n:host-context(.dark) .modal-field label {\n  color: #e5e7eb;\n}\n:host-context(.dark) .modal-body input {\n  background: #374151;\n  border-color: #4b5563;\n  color: #f9fafb;\n}\n:host-context(.dark) .modal-body input:focus {\n  border-color: #3b82f6;\n  background: #374151;\n  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);\n}\n:host-context(.dark) .modal-footer .btn-secondary {\n  background: #374151;\n  color: #e5e7eb;\n}\n:host-context(.dark) .modal-footer .btn-secondary:hover {\n  background: #4b5563;\n}\n@keyframes fadeInUp {\n  from {\n    opacity: 0;\n    transform: translateY(15px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n.toast-container {\n  position: fixed;\n  top: 100px;\n  right: 20px;\n  z-index: 10000;\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n  max-width: 400px;\n}\n.toast {\n  background: #fff;\n  border-radius: 8px;\n  padding: 16px 20px;\n  box-shadow: 0 4px 12px rgba(0, 0, 0, .15);\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  border-left: 4px solid;\n  animation: slideInRight .3s ease-out;\n  min-width: 300px;\n}\n.toast.error {\n  border-left-color: #ef4444;\n  background: #fef2f2;\n}\n.toast.warning {\n  border-left-color: #f59e0b;\n  background: #fffbeb;\n}\n.toast-icon {\n  font-size: 20px;\n}\n.toast-content {\n  flex: 1;\n  font-size: 14px;\n  color: #374151;\n  line-height: 1.4;\n}\n.toast-close {\n  background: 0 0;\n  border: 0;\n  font-size: 18px;\n  cursor: pointer;\n  color: #9ca3af;\n  padding: 0;\n  width: 20px;\n  height: 20px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.toast-close:hover {\n  color: #374151;\n}\n@keyframes slideInRight {\n  from {\n    transform: translateX(400px);\n    opacity: 0;\n  }\n  to {\n    transform: translateX(0);\n    opacity: 1;\n  }\n}\n@media (max-width: 1024px) {\n  .document-container {\n    padding: 20px;\n  }\n  .document {\n    padding: 20px;\n  }\n}\n@media (max-width: 768px) {\n  .payment-agreement-container {\n    padding: 10px;\n  }\n  .document-header {\n    flex-direction: column;\n    gap: 15px;\n    text-align: center;\n  }\n  .document-actions {\n    justify-content: center;\n  }\n  .document-container {\n    padding: 15px;\n  }\n  .document {\n    padding: 15px;\n    font-size: 11px;\n  }\n  .editable-input {\n    min-width: 100px;\n    font-size: 11px;\n  }\n  .editable-input.large-input {\n    min-width: 200px;\n    width: 200px;\n  }\n}\n@media (max-width: 480px) {\n  .document {\n    font-size: 10px;\n    padding: 10px;\n  }\n  .editable-input {\n    min-width: 80px;\n    font-size: 10px;\n    padding: 4px 6px;\n  }\n  .editable-input.large-input {\n    min-width: 160px;\n    width: 160px;\n  }\n  .editable-input.number-input {\n    min-width: 85px;\n    width: 85px;\n  }\n  .client-table {\n    font-size: 10px;\n  }\n  .client-table td {\n    padding: 6px 8px;\n  }\n}\n/*# sourceMappingURL=agreements-page.component.css.map */\n"] }]
  }], () => [{ type: FormBuilder }, { type: AgreementsService }, { type: ThemeService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AgreementsPageComponent, { className: "AgreementsPageComponent", filePath: "src/app/features/legacy/agreements/pages/agreements-page/agreements-page.component.ts", lineNumber: 17 });
})();

// src/app/features/legacy/agreements/agreements.component.ts
var _AgreementsComponent = class _AgreementsComponent {
};
_AgreementsComponent.\u0275fac = function AgreementsComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _AgreementsComponent)();
};
_AgreementsComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AgreementsComponent, selectors: [["app-agreements"]], decls: 1, vars: 0, template: function AgreementsComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-agreements-page");
  }
}, dependencies: [AgreementsPageComponent], encapsulation: 2 });
var AgreementsComponent = _AgreementsComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AgreementsComponent, [{
    type: Component,
    args: [{
      selector: "app-agreements",
      standalone: true,
      imports: [AgreementsPageComponent],
      template: "<app-agreements-page></app-agreements-page>"
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AgreementsComponent, { className: "AgreementsComponent", filePath: "src/app/features/legacy/agreements/agreements.component.ts", lineNumber: 10 });
})();
export {
  AgreementsComponent
};
//# sourceMappingURL=chunk-NWLNU3F7.js.map
