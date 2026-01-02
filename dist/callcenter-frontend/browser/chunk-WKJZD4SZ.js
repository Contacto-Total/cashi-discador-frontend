import {
  CheckboxControlValueAccessor,
  CheckboxRequiredValidator,
  DefaultValueAccessor,
  FormsModule,
  MaxLengthValidator,
  MaxValidator,
  MinLengthValidator,
  MinValidator,
  NgControlStatus,
  NgModel,
  NgSelectOption,
  NumberValueAccessor,
  PatternValidator,
  RequiredValidator,
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
  EventEmitter,
  HttpClient,
  HttpParams,
  Injectable,
  Input,
  Output,
  __spreadValues,
  catchError,
  computed,
  effect,
  input,
  of,
  output,
  setClassMetadata,
  signal,
  tap,
  untracked,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassMap,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
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
  ɵɵrepeaterTrackByIdentity,
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

// src/app/shared/components/payment-schedule/payment-schedule.component.ts
var _forTrack0 = ($index, $item) => $item.field;
var _forTrack1 = ($index, $item) => $item.numeroCuota;
function PaymentScheduleComponent_For_8_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 13);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const option_r2 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275classMap(option_r2.restriccionFecha === "DENTRO_MES" ? "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300" : "bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", option_r2.restriccionFecha === "DENTRO_MES" ? "Este mes" : "Pr\xF3x. mes+", " ");
  }
}
function PaymentScheduleComponent_For_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 9);
    \u0275\u0275listener("click", function PaymentScheduleComponent_For_8_Template_button_click_0_listener() {
      const option_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.selectAmount(option_r2.value, option_r2.field, option_r2.restriccionFecha, option_r2.generaCartaAcuerdo));
    });
    \u0275\u0275elementStart(1, "span", 10);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 11);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(5, PaymentScheduleComponent_For_8_Conditional_5_Template, 2, 3, "span", 12);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const option_r2 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275classMap("flex flex-col items-center p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md " + (ctx_r2.selectedField() === option_r2.field && !ctx_r2.isCustomAmount() ? "border-blue-500 bg-blue-500 dark:bg-blue-600 text-white shadow-lg shadow-blue-500/30" : "border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-slate-600"));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(option_r2.label);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.formatCurrency(option_r2.value));
    \u0275\u0275advance();
    \u0275\u0275conditional(option_r2.restriccionFecha && option_r2.restriccionFecha !== "SIN_RESTRICCION" ? 5 : -1);
  }
}
function PaymentScheduleComponent_Conditional_9_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "input", 17);
    \u0275\u0275twoWayListener("ngModelChange", function PaymentScheduleComponent_Conditional_9_Conditional_3_Template_input_ngModelChange_0_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r2 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r2.customAmountValue, $event) || (ctx_r2.customAmountValue = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function PaymentScheduleComponent_Conditional_9_Conditional_3_Template_input_ngModelChange_0_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.onCustomAmountChange($event));
    })("click", function PaymentScheduleComponent_Conditional_9_Conditional_3_Template_input_click_0_listener($event) {
      \u0275\u0275restoreView(_r5);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.customAmountValue);
  }
}
function PaymentScheduleComponent_Conditional_9_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "lucide-angular", 16);
  }
  if (rf & 2) {
    \u0275\u0275property("size", 16);
  }
}
function PaymentScheduleComponent_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 9);
    \u0275\u0275listener("click", function PaymentScheduleComponent_Conditional_9_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.enableCustomAmount());
    });
    \u0275\u0275elementStart(1, "span", 14);
    \u0275\u0275text(2, "Otro monto");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(3, PaymentScheduleComponent_Conditional_9_Conditional_3_Template, 1, 1, "input", 15)(4, PaymentScheduleComponent_Conditional_9_Conditional_4_Template, 1, 1, "lucide-angular", 16);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275classMap("flex flex-col items-center p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md " + (ctx_r2.isCustomAmount() ? "col-span-2 border-purple-500 bg-purple-500 dark:bg-purple-600 text-white shadow-lg shadow-purple-500/30" : "border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:border-purple-400 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-slate-600"));
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r2.isCustomAmount() ? 3 : 4);
  }
}
function PaymentScheduleComponent_Conditional_10_For_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 22);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const option_r7 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275property("value", option_r7.field);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", option_r7.label, " (", ctx_r2.formatCurrency(option_r7.value), ")");
  }
}
function PaymentScheduleComponent_Conditional_10_Conditional_9_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 25);
    \u0275\u0275listener("click", function PaymentScheduleComponent_Conditional_10_Conditional_9_Conditional_3_Template_div_click_0_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.showPercentageEditor.set(false));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(1, "div", 26)(2, "div", 27);
    \u0275\u0275element(3, "div", 28);
    \u0275\u0275elementStart(4, "div", 23)(5, "label", 29);
    \u0275\u0275text(6, "Ajuste %");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "div", 30)(8, "button", 31);
    \u0275\u0275listener("click", function PaymentScheduleComponent_Conditional_10_Conditional_9_Conditional_3_Template_button_click_8_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.setDiscountMode(true));
    });
    \u0275\u0275element(9, "lucide-angular", 32);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "input", 33);
    \u0275\u0275listener("ngModelChange", function PaymentScheduleComponent_Conditional_10_Conditional_9_Conditional_3_Template_input_ngModelChange_10_listener($event) {
      \u0275\u0275restoreView(_r9);
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.onPercentageChange($event));
    })("click", function PaymentScheduleComponent_Conditional_10_Conditional_9_Conditional_3_Template_input_click_10_listener($event) {
      \u0275\u0275restoreView(_r9);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "button", 31);
    \u0275\u0275listener("click", function PaymentScheduleComponent_Conditional_10_Conditional_9_Conditional_3_Template_button_click_11_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.setDiscountMode(false));
    });
    \u0275\u0275element(12, "lucide-angular", 34);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "p", 35);
    \u0275\u0275text(14);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(8);
    \u0275\u0275classMap(ctx_r2.isDiscountMode() ? "bg-red-500 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-500 hover:bg-red-100 dark:hover:bg-red-900/30");
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
    \u0275\u0275advance();
    \u0275\u0275property("ngModel", ctx_r2.editablePercentage());
    \u0275\u0275advance();
    \u0275\u0275classMap(!ctx_r2.isDiscountMode() ? "bg-green-500 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-500 hover:bg-green-100 dark:hover:bg-green-900/30");
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" Base: ", ctx_r2.formatCurrency(ctx_r2.montoBase() || 0), " ");
  }
}
function PaymentScheduleComponent_Conditional_10_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 23)(1, "button", 24);
    \u0275\u0275listener("click", function PaymentScheduleComponent_Conditional_10_Conditional_9_Template_button_click_1_listener($event) {
      \u0275\u0275restoreView(_r8);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.togglePercentageEditor($event));
    });
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(3, PaymentScheduleComponent_Conditional_10_Conditional_9_Conditional_3_Template, 15, 8);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275classMap(ctx_r2.getDiscountInfo().isDiscount ? "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800/50" : "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800/50");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2(" ", ctx_r2.getDiscountInfo().isDiscount ? "-" : "+", "", ctx_r2.getDiscountInfo().percentage, "% ");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.showPercentageEditor() ? 3 : -1);
  }
}
function PaymentScheduleComponent_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 7);
    \u0275\u0275element(1, "lucide-angular", 18);
    \u0275\u0275elementStart(2, "span", 19);
    \u0275\u0275text(3, "Campo base:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "select", 20);
    \u0275\u0275listener("ngModelChange", function PaymentScheduleComponent_Conditional_10_Template_select_ngModelChange_4_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.onBaseFieldChange($event));
    });
    \u0275\u0275elementStart(5, "option", 21);
    \u0275\u0275text(6, "Ninguno (monto libre)");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(7, PaymentScheduleComponent_Conditional_10_For_8_Template, 2, 3, "option", 22, _forTrack0);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(9, PaymentScheduleComponent_Conditional_10_Conditional_9_Template, 4, 5, "div", 23);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("size", 16);
    \u0275\u0275advance(3);
    \u0275\u0275property("ngModel", ctx_r2.selectedBaseField());
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r2.regularAmountOptions());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r2.selectedBaseField() ? 9 : -1);
  }
}
function PaymentScheduleComponent_Conditional_11_For_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 9);
    \u0275\u0275listener("click", function PaymentScheduleComponent_Conditional_11_For_7_Template_button_click_0_listener() {
      const num_r11 = \u0275\u0275restoreView(_r10).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.setInstallments(num_r11));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const num_r11 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275classMap("px-4 py-2 border-2 rounded-lg cursor-pointer transition-all duration-200 text-sm font-medium hover:shadow-md " + (ctx_r2.numberOfInstallments() === num_r11 ? "border-emerald-500 bg-emerald-500 dark:bg-emerald-600 text-white shadow-lg shadow-emerald-500/30" : "border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:border-emerald-400 dark:hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-slate-600"));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2(" ", num_r11, " ", num_r11 === 1 ? "cuota" : "cuotas", " ");
  }
}
function PaymentScheduleComponent_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 1)(1, "label", 2)(2, "div", 36);
    \u0275\u0275element(3, "lucide-angular", 37);
    \u0275\u0275elementEnd();
    \u0275\u0275text(4, " N\xFAmero de Cuotas ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 38);
    \u0275\u0275repeaterCreate(6, PaymentScheduleComponent_Conditional_11_For_7_Template, 2, 4, "button", 6, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275property("size", 14);
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r2.installmentOptions);
  }
}
function PaymentScheduleComponent_Conditional_12_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 50);
    \u0275\u0275element(1, "lucide-angular", 51);
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275classMap(ctx_r2.selectedRestriccion() === "DENTRO_MES" ? "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800" : "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800");
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.dateRestrictionInfo().message);
  }
}
function PaymentScheduleComponent_Conditional_12_For_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 43)(1, "div", 52);
    \u0275\u0275element(2, "lucide-angular", 53);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 46)(5, "label", 54);
    \u0275\u0275text(6, "Monto:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "input", 55);
    \u0275\u0275twoWayListener("ngModelChange", function PaymentScheduleComponent_Conditional_12_For_8_Template_input_ngModelChange_7_listener($event) {
      const installment_r13 = \u0275\u0275restoreView(_r12).$implicit;
      \u0275\u0275twoWayBindingSet(installment_r13.monto, $event) || (installment_r13.monto = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function PaymentScheduleComponent_Conditional_12_For_8_Template_input_ngModelChange_7_listener() {
      const installment_r13 = \u0275\u0275restoreView(_r12).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.onInstallmentAmountChange(installment_r13.numeroCuota));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "div", 46)(9, "label", 54);
    \u0275\u0275text(10, "Fecha:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "input", 56);
    \u0275\u0275twoWayListener("ngModelChange", function PaymentScheduleComponent_Conditional_12_For_8_Template_input_ngModelChange_11_listener($event) {
      const installment_r13 = \u0275\u0275restoreView(_r12).$implicit;
      \u0275\u0275twoWayBindingSet(installment_r13.fechaPago, $event) || (installment_r13.fechaPago = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function PaymentScheduleComponent_Conditional_12_For_8_Template_input_ngModelChange_11_listener() {
      \u0275\u0275restoreView(_r12);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.onInstallmentChange());
    });
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const installment_r13 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 14);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" Cuota ", installment_r13.numeroCuota, " ");
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", installment_r13.monto);
    \u0275\u0275property("min", 1);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", installment_r13.fechaPago);
    \u0275\u0275property("min", ctx_r2.dateRestrictionInfo().minDate)("max", ctx_r2.dateRestrictionInfo().maxDate);
  }
}
function PaymentScheduleComponent_Conditional_12_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 49)(1, "span");
    \u0275\u0275text(2, "Monto por cuota:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 57);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r2.formatCurrency(ctx_r2.amountPerInstallment()));
  }
}
function PaymentScheduleComponent_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 8)(1, "label", 2)(2, "div", 39);
    \u0275\u0275element(3, "lucide-angular", 40);
    \u0275\u0275elementEnd();
    \u0275\u0275text(4, " Detalle del Cronograma ");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(5, PaymentScheduleComponent_Conditional_12_Conditional_5_Template, 4, 4, "div", 41);
    \u0275\u0275elementStart(6, "div", 42);
    \u0275\u0275repeaterCreate(7, PaymentScheduleComponent_Conditional_12_For_8_Template, 12, 7, "div", 43, _forTrack1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "div", 44)(10, "div", 45)(11, "span", 46);
    \u0275\u0275element(12, "lucide-angular", 47);
    \u0275\u0275text(13, " Monto Total: ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "span", 48);
    \u0275\u0275text(15);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(16, PaymentScheduleComponent_Conditional_12_Conditional_16_Template, 5, 1, "div", 49);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275property("size", 14);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r2.dateRestrictionInfo().message ? 5 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r2.installments());
    \u0275\u0275advance(5);
    \u0275\u0275property("size", 16);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r2.formatCurrency(ctx_r2.totalAmount()));
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.numberOfInstallments() > 1 ? 16 : -1);
  }
}
var _PaymentScheduleComponent = class _PaymentScheduleComponent {
  constructor() {
    this.availableAmounts = input([], ...ngDevMode ? [{ debugName: "availableAmounts" }] : []);
    this.maxInstallments = 6;
    this.scheduleChange = new EventEmitter();
    this.customAmountSelected = new EventEmitter();
    this.selectedAmount = signal(0, ...ngDevMode ? [{ debugName: "selectedAmount" }] : []);
    this.selectedField = signal(void 0, ...ngDevMode ? [{ debugName: "selectedField" }] : []);
    this.selectedRestriccion = signal("SIN_RESTRICCION", ...ngDevMode ? [{ debugName: "selectedRestriccion" }] : []);
    this.selectedGeneraCartaAcuerdo = signal(false, ...ngDevMode ? [{ debugName: "selectedGeneraCartaAcuerdo" }] : []);
    this.numberOfInstallments = signal(1, ...ngDevMode ? [{ debugName: "numberOfInstallments" }] : []);
    this.installments = signal([], ...ngDevMode ? [{ debugName: "installments" }] : []);
    this.customAmountValue = 0;
    this._isCustomAmount = signal(false, ...ngDevMode ? [{ debugName: "_isCustomAmount" }] : []);
    this.montoBase = signal(void 0, ...ngDevMode ? [{ debugName: "montoBase" }] : []);
    this.selectedBaseField = signal("", ...ngDevMode ? [{ debugName: "selectedBaseField" }] : []);
    this.showPercentageEditor = signal(false, ...ngDevMode ? [{ debugName: "showPercentageEditor" }] : []);
    this.editablePercentage = signal(0, ...ngDevMode ? [{ debugName: "editablePercentage" }] : []);
    this.isDiscountMode = signal(true, ...ngDevMode ? [{ debugName: "isDiscountMode" }] : []);
    this.amountOptions = computed(() => this.availableAmounts(), ...ngDevMode ? [{ debugName: "amountOptions" }] : []);
    this.dateRestrictionInfo = computed(() => {
      const restriccion = this.selectedRestriccion();
      const today = /* @__PURE__ */ new Date();
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();
      const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
      const firstDayNextMonth = new Date(currentYear, currentMonth + 1, 1);
      const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };
      switch (restriccion) {
        case "DENTRO_MES":
          return {
            minDate: formatDate(today),
            maxDate: formatDate(lastDayOfMonth),
            message: `Solo fechas dentro del mes actual (hasta ${lastDayOfMonth.toLocaleDateString("es-PE")})`
          };
        case "FUERA_MES":
          return {
            minDate: formatDate(firstDayNextMonth),
            maxDate: void 0,
            message: `Solo fechas a partir del ${firstDayNextMonth.toLocaleDateString("es-PE")}`
          };
        default:
          return {
            minDate: formatDate(today),
            maxDate: void 0,
            message: void 0
          };
      }
    }, ...ngDevMode ? [{ debugName: "dateRestrictionInfo" }] : []);
    this.regularAmountOptions = computed(() => this.availableAmounts().filter((opt) => opt.field !== "personalizado"), ...ngDevMode ? [{ debugName: "regularAmountOptions" }] : []);
    this.hasCustomOption = computed(() => this.availableAmounts().some((opt) => opt.field === "personalizado"), ...ngDevMode ? [{ debugName: "hasCustomOption" }] : []);
    this.totalAmount = computed(() => this.installments().reduce((sum, i) => sum + (i.monto || 0), 0), ...ngDevMode ? [{ debugName: "totalAmount" }] : []);
    this.amountPerInstallment = computed(() => {
      const num = this.numberOfInstallments();
      const amount = this.selectedAmount();
      return num > 0 ? amount / num : 0;
    }, ...ngDevMode ? [{ debugName: "amountPerInstallment" }] : []);
    this.installmentOptions = [];
    this.minDate = "";
    this.MIN_CUOTA_AMOUNT = 1;
  }
  ngOnInit() {
    this.installmentOptions = Array.from({ length: this.maxInstallments }, (_, i) => i + 1);
    const today = /* @__PURE__ */ new Date();
    this.minDate = this.formatDateToYYYYMMDD(today);
  }
  isCustomAmount() {
    return this._isCustomAmount();
  }
  selectAmount(amount, field, restriccion, generaCartaAcuerdo) {
    this._isCustomAmount.set(false);
    this.selectedAmount.set(amount);
    this.selectedField.set(field);
    this.selectedRestriccion.set(restriccion || "SIN_RESTRICCION");
    this.selectedGeneraCartaAcuerdo.set(generaCartaAcuerdo || false);
    this.montoBase.set(amount);
    this.generateInstallments();
    this.customAmountSelected.emit(false);
  }
  // Método para obtener la restricción de una opción por su field
  getRestriccionForField(field) {
    const option = this.availableAmounts().find((o) => o.field === field);
    return option?.restriccionFecha || "SIN_RESTRICCION";
  }
  enableCustomAmount() {
    this._isCustomAmount.set(true);
    this.selectedField.set(void 0);
    this.montoBase.set(void 0);
    this.selectedBaseField.set("");
    this.customAmountSelected.emit(true);
    if (this.customAmountValue > 0) {
      this.selectedAmount.set(this.customAmountValue);
      this.generateInstallments();
    }
  }
  onCustomAmountChange(value) {
    this.customAmountValue = value;
    this.selectedAmount.set(value);
    if (this.selectedBaseField()) {
      const option = this.availableAmounts().find((o) => o.field === this.selectedBaseField());
      if (option) {
        this.montoBase.set(option.value);
        this.selectedField.set(option.field);
      }
    }
    this.generateInstallments();
  }
  /**
   * Cuando el usuario selecciona un campo base para "Otro monto"
   */
  onBaseFieldChange(fieldValue) {
    this.selectedBaseField.set(fieldValue);
    if (fieldValue) {
      const option = this.availableAmounts().find((o) => o.field === fieldValue);
      if (option) {
        this.montoBase.set(option.value);
        this.selectedField.set(option.field);
      }
    } else {
      this.montoBase.set(void 0);
      this.selectedField.set(void 0);
    }
    this.emitChange();
  }
  /**
   * Calcula info del descuento para mostrar en el UI
   */
  getDiscountInfo() {
    const base = this.montoBase();
    const actual = this.customAmountValue;
    if (!base || !actual || base === actual) {
      return { hasDiscount: false, isDiscount: false, percentage: 0 };
    }
    const diff = base - actual;
    const percentage = Math.abs(Math.round(diff / base * 100));
    return {
      hasDiscount: true,
      isDiscount: diff > 0,
      // true = descuento, false = exceso
      percentage
    };
  }
  /**
   * Abre/cierra el editor de porcentaje
   */
  togglePercentageEditor(event) {
    event.stopPropagation();
    const isOpen = !this.showPercentageEditor();
    this.showPercentageEditor.set(isOpen);
    if (isOpen) {
      const info = this.getDiscountInfo();
      this.editablePercentage.set(info.percentage);
      this.isDiscountMode.set(info.isDiscount);
    }
  }
  /**
   * Cambia entre modo descuento (-) y aumento (+)
   */
  setDiscountMode(isDiscount) {
    this.isDiscountMode.set(isDiscount);
    this.applyPercentageToAmount(this.editablePercentage());
  }
  /**
   * Cuando el usuario cambia el porcentaje manualmente
   */
  onPercentageChange(percentage) {
    this.editablePercentage.set(percentage);
    this.applyPercentageToAmount(percentage);
  }
  /**
   * Aplica el porcentaje al monto base y actualiza customAmountValue
   */
  applyPercentageToAmount(percentage) {
    const base = this.montoBase();
    if (!base)
      return;
    let newAmount;
    if (this.isDiscountMode()) {
      newAmount = base * (1 - percentage / 100);
    } else {
      newAmount = base * (1 + percentage / 100);
    }
    this.customAmountValue = Math.round(newAmount * 100) / 100;
    this.selectedAmount.set(this.customAmountValue);
    this.generateInstallments();
  }
  setInstallments(num) {
    this.numberOfInstallments.set(num);
    this.generateInstallments();
  }
  generateInstallments() {
    const amount = this.selectedAmount();
    const numInstallments = this.numberOfInstallments();
    if (amount <= 0 || numInstallments <= 0) {
      this.installments.set([]);
      this.emitChange();
      return;
    }
    const amountPerInstallment = Math.floor(amount / numInstallments * 100) / 100;
    const remainder = Math.round((amount - amountPerInstallment * numInstallments) * 100) / 100;
    const newInstallments = [];
    const restriccion = this.selectedRestriccion();
    let startDate;
    const today = /* @__PURE__ */ new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    if (restriccion === "FUERA_MES") {
      startDate = new Date(currentYear, currentMonth + 1, 1);
    } else {
      startDate = new Date(today);
      startDate.setDate(startDate.getDate() + 1);
    }
    const lastDayOfMonth = restriccion === "DENTRO_MES" ? new Date(currentYear, currentMonth + 1, 0) : null;
    for (let i = 0; i < numInstallments; i++) {
      let dueDate;
      if (restriccion === "DENTRO_MES" && lastDayOfMonth) {
        const daysRemaining = Math.max(1, lastDayOfMonth.getDate() - startDate.getDate());
        const dayIncrement = Math.floor(daysRemaining / numInstallments);
        dueDate = new Date(startDate);
        dueDate.setDate(startDate.getDate() + dayIncrement * i);
        if (dueDate > lastDayOfMonth) {
          dueDate = new Date(lastDayOfMonth);
        }
      } else if (restriccion === "FUERA_MES") {
        dueDate = new Date(startDate);
        dueDate.setDate(dueDate.getDate() + 30 * i);
      } else {
        dueDate = new Date(today);
        dueDate.setDate(dueDate.getDate() + 30 * (i + 1));
      }
      const installmentAmount = i === numInstallments - 1 ? amountPerInstallment + remainder : amountPerInstallment;
      newInstallments.push({
        numeroCuota: i + 1,
        monto: installmentAmount,
        fechaPago: this.formatDateToYYYYMMDD(dueDate)
      });
    }
    this.installments.set(newInstallments);
    this.emitChange();
  }
  onInstallmentChange() {
    this.emitChange();
  }
  /**
   * Recalcula las cuotas posteriores cuando se edita el monto de una cuota.
   * Las cuotas anteriores a la editada no se modifican.
   * El restante se distribuye equitativamente entre las cuotas posteriores.
   *
   * Validaciones:
   * - Ninguna cuota puede ser menor a S/ 1.00
   * - Ninguna cuota puede superar el monto total
   * - La suma de cuotas debe ser exactamente igual al monto total
   */
  onInstallmentAmountChange(editedCuotaNumber) {
    const currentInstallments = this.installments();
    const totalAmount = this.selectedAmount();
    const numInstallments = currentInstallments.length;
    const editedIndex = editedCuotaNumber - 1;
    const editedCuota = currentInstallments[editedIndex];
    if (editedCuota.monto < this.MIN_CUOTA_AMOUNT) {
      editedCuota.monto = this.MIN_CUOTA_AMOUNT;
    }
    let sumaPreviousCuotas = 0;
    for (let i = 0; i < editedIndex; i++) {
      sumaPreviousCuotas += currentInstallments[i].monto || 0;
    }
    const cuotasPosteriores = numInstallments - editedCuotaNumber;
    const minimoReservadoParaPosteriores = cuotasPosteriores * this.MIN_CUOTA_AMOUNT;
    const maxAllowedForThisCuota = totalAmount - sumaPreviousCuotas - minimoReservadoParaPosteriores;
    if (editedCuota.monto > maxAllowedForThisCuota) {
      editedCuota.monto = Math.max(this.MIN_CUOTA_AMOUNT, Math.floor(maxAllowedForThisCuota * 100) / 100);
    }
    if (editedCuotaNumber >= numInstallments) {
      this.installments.set([...currentInstallments]);
      this.emitChange();
      return;
    }
    let sumUpToEdited = 0;
    for (let i = 0; i < editedCuotaNumber; i++) {
      sumUpToEdited += currentInstallments[i].monto || 0;
    }
    const remaining = totalAmount - sumUpToEdited;
    const remainingInstallments = numInstallments - editedCuotaNumber;
    if (remaining < remainingInstallments * this.MIN_CUOTA_AMOUNT) {
      const amountPerRemaining = Math.floor(remaining / remainingInstallments * 100) / 100;
      for (let i = editedCuotaNumber; i < numInstallments; i++) {
        currentInstallments[i].monto = Math.max(this.MIN_CUOTA_AMOUNT, amountPerRemaining);
      }
    } else {
      const amountPerRemaining = Math.floor(remaining / remainingInstallments * 100) / 100;
      const remainder = Math.round((remaining - amountPerRemaining * remainingInstallments) * 100) / 100;
      for (let i = editedCuotaNumber; i < numInstallments; i++) {
        currentInstallments[i].monto = i === numInstallments - 1 ? amountPerRemaining + remainder : amountPerRemaining;
      }
    }
    this.installments.set([...currentInstallments]);
    this.emitChange();
  }
  emitChange() {
    const installments = this.installments();
    if (installments.length === 0) {
      this.scheduleChange.emit(null);
      return;
    }
    const config = {
      montoTotal: this.selectedAmount(),
      numeroCuotas: this.numberOfInstallments(),
      cuotas: installments,
      campoMontoOrigen: this.selectedField(),
      montoBase: this.montoBase(),
      // Monto original del campo (undefined si es monto libre)
      generaCartaAcuerdo: this.selectedGeneraCartaAcuerdo()
      // Si el monto seleccionado genera carta
    };
    this.scheduleChange.emit(config);
  }
  formatCurrency(value) {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN"
    }).format(value);
  }
  /**
   * Formatea una fecha a YYYY-MM-DD sin conversión a UTC
   * Evita el bug de timezone donde toISOString() resta un día
   */
  formatDateToYYYYMMDD(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
};
_PaymentScheduleComponent.\u0275fac = function PaymentScheduleComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _PaymentScheduleComponent)();
};
_PaymentScheduleComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PaymentScheduleComponent, selectors: [["app-payment-schedule"]], inputs: { availableAmounts: [1, "availableAmounts"], maxInstallments: "maxInstallments" }, outputs: { scheduleChange: "scheduleChange", customAmountSelected: "customAmountSelected" }, decls: 13, vars: 5, consts: [[1, "payment-schedule-container", "bg-slate-100", "dark:bg-slate-800/50", "border", "border-slate-200", "dark:border-slate-700", "rounded-xl", "p-4", "transition-colors", "duration-300"], [1, "field-group", "mb-5"], [1, "flex", "items-center", "gap-2", "font-semibold", "text-slate-700", "dark:text-slate-200", "text-sm", "mb-3", "transition-colors", "duration-300"], [1, "w-6", "h-6", "bg-emerald-100", "dark:bg-emerald-900/50", "rounded-lg", "flex", "items-center", "justify-center", "transition-colors", "duration-300"], ["name", "wallet", 1, "text-emerald-600", "dark:text-emerald-400", 3, "size"], [1, "grid", "grid-cols-2", "sm:grid-cols-3", "lg:grid-cols-4", "xl:grid-cols-6", "gap-2"], ["type", "button", 3, "class"], [1, "mt-3", "flex", "items-center", "gap-3", "p-3", "bg-purple-50", "dark:bg-purple-900/20", "rounded-lg", "border", "border-purple-200", "dark:border-purple-800"], [1, "field-group"], ["type", "button", 3, "click"], [1, "text-[10px]", "opacity-70", "leading-tight", "text-center"], [1, "text-sm", "font-bold", "mt-1"], [1, "text-[8px]", "mt-1", "px-1.5", "py-0.5", "rounded-full", 3, "class"], [1, "text-[8px]", "mt-1", "px-1.5", "py-0.5", "rounded-full"], [1, "text-[10px]", "opacity-70"], ["type", "number", "placeholder", "0.00", "min", "0", "step", "0.01", 1, "w-full", "mt-1", "px-3", "py-1.5", "border", "border-white/30", "rounded", "text-center", "text-base", "font-bold", "bg-white/90", "dark:bg-slate-800", "text-slate-800", "dark:text-white", "min-w-[120px]", 3, "ngModel"], ["name", "edit-3", 1, "mt-1", 3, "size"], ["type", "number", "placeholder", "0.00", "min", "0", "step", "0.01", 1, "w-full", "mt-1", "px-3", "py-1.5", "border", "border-white/30", "rounded", "text-center", "text-base", "font-bold", "bg-white/90", "dark:bg-slate-800", "text-slate-800", "dark:text-white", "min-w-[120px]", 3, "ngModelChange", "click", "ngModel"], ["name", "link", 1, "text-purple-500", "flex-shrink-0", 3, "size"], [1, "text-xs", "text-purple-700", "dark:text-purple-300"], [1, "flex-1", "px-2", "py-1.5", "text-sm", "border", "border-purple-300", "dark:border-purple-600", "rounded-lg", "bg-white", "dark:bg-slate-700", "text-slate-700", "dark:text-slate-200", "focus:outline-none", "focus:ring-2", "focus:ring-purple-500", 3, "ngModelChange", "ngModel"], ["value", ""], [3, "value"], [1, "relative"], ["type", "button", 1, "text-xs", "font-medium", "px-2.5", "py-1", "rounded-full", "cursor-pointer", "transition-all", "duration-200", "hover:scale-105", "hover:shadow-md", 3, "click"], [1, "fixed", "inset-0", "z-40", 3, "click"], [1, "absolute", "right-0", "top-full", "mt-2", "z-50", "animate-in", "fade-in", "slide-in-from-top-2", "duration-200"], [1, "bg-white", "dark:bg-slate-800", "rounded-xl", "shadow-xl", "border", "border-slate-200", "dark:border-slate-600", "p-3", "min-w-[180px]"], [1, "absolute", "-top-2", "right-4", "w-4", "h-4", "bg-white", "dark:bg-slate-800", "border-l", "border-t", "border-slate-200", "dark:border-slate-600", "transform", "rotate-45"], [1, "text-[10px]", "text-slate-500", "dark:text-slate-400", "uppercase", "tracking-wide", "font-medium"], [1, "flex", "items-center", "gap-2", "mt-1.5"], ["type", "button", 1, "w-7", "h-7", "rounded-lg", "flex", "items-center", "justify-center", "transition-colors", 3, "click"], ["name", "minus", 3, "size"], ["type", "number", "min", "0", "max", "100", "step", "1", 1, "flex-1", "w-16", "px-2", "py-1.5", "text-center", "text-sm", "font-bold", "border", "border-slate-200", "dark:border-slate-600", "rounded-lg", "bg-slate-50", "dark:bg-slate-700", "text-slate-800", "dark:text-white", "focus:outline-none", "focus:ring-2", "focus:ring-purple-500", 3, "ngModelChange", "click", "ngModel"], ["name", "plus", 3, "size"], [1, "text-[10px]", "text-slate-400", "dark:text-slate-500", "mt-2", "text-center"], [1, "w-6", "h-6", "bg-blue-100", "dark:bg-blue-900/50", "rounded-lg", "flex", "items-center", "justify-center", "transition-colors", "duration-300"], ["name", "calendar-days", 1, "text-blue-600", "dark:text-blue-400", 3, "size"], [1, "flex", "flex-wrap", "gap-2"], [1, "w-6", "h-6", "bg-amber-100", "dark:bg-amber-900/50", "rounded-lg", "flex", "items-center", "justify-center", "transition-colors", "duration-300"], ["name", "list-ordered", 1, "text-amber-600", "dark:text-amber-400", 3, "size"], [1, "mb-3", "px-3", "py-2", "rounded-lg", "text-xs", "flex", "items-center", "gap-2", 3, "class"], [1, "bg-white", "dark:bg-slate-700/50", "rounded-xl", "border", "border-slate-200", "dark:border-slate-600", "overflow-hidden", "transition-colors", "duration-300"], [1, "grid", "grid-cols-1", "sm:grid-cols-[100px_1fr_1fr]", "gap-3", "p-3", "border-b", "border-slate-100", "dark:border-slate-600", "last:border-b-0", "items-center", "transition-colors", "duration-300"], [1, "mt-4", "p-4", "bg-emerald-50", "dark:bg-emerald-900/30", "rounded-xl", "border", "border-emerald-200", "dark:border-emerald-800", "transition-colors", "duration-300"], [1, "flex", "justify-between", "items-center", "text-sm", "text-emerald-700", "dark:text-emerald-300"], [1, "flex", "items-center", "gap-2"], ["name", "calculator", 3, "size"], [1, "text-lg", "font-bold"], [1, "flex", "justify-between", "items-center", "text-sm", "text-emerald-600", "dark:text-emerald-400", "mt-2", "pt-2", "border-t", "border-emerald-200", "dark:border-emerald-700"], [1, "mb-3", "px-3", "py-2", "rounded-lg", "text-xs", "flex", "items-center", "gap-2"], ["name", "info", 3, "size"], [1, "font-bold", "text-blue-600", "dark:text-blue-400", "text-sm", "flex", "items-center", "gap-2"], ["name", "hash", 3, "size"], [1, "text-xs", "text-slate-500", "dark:text-slate-400", "min-w-[50px]"], ["type", "number", "step", "0.01", 1, "flex-1", "px-3", "py-2", "border", "border-slate-200", "dark:border-slate-500", "rounded-lg", "text-sm", "bg-slate-50", "dark:bg-slate-600", "text-slate-800", "dark:text-white", "focus:outline-none", "focus:ring-2", "focus:ring-blue-500", "focus:border-transparent", "transition-all", "duration-200", 3, "ngModelChange", "ngModel", "min"], ["type", "date", 1, "flex-1", "px-3", "py-2", "border", "border-slate-200", "dark:border-slate-500", "rounded-lg", "text-sm", "bg-slate-50", "dark:bg-slate-600", "text-slate-800", "dark:text-white", "focus:outline-none", "focus:ring-2", "focus:ring-blue-500", "focus:border-transparent", "transition-all", "duration-200", 3, "ngModelChange", "ngModel", "min", "max"], [1, "font-semibold"]], template: function PaymentScheduleComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "label", 2)(3, "div", 3);
    \u0275\u0275element(4, "lucide-angular", 4);
    \u0275\u0275elementEnd();
    \u0275\u0275text(5, " Seleccionar Monto ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 5);
    \u0275\u0275repeaterCreate(7, PaymentScheduleComponent_For_8_Template, 6, 5, "button", 6, _forTrack0);
    \u0275\u0275conditionalCreate(9, PaymentScheduleComponent_Conditional_9_Template, 5, 3, "button", 6);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(10, PaymentScheduleComponent_Conditional_10_Template, 10, 3, "div", 7);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(11, PaymentScheduleComponent_Conditional_11_Template, 8, 1, "div", 1);
    \u0275\u0275conditionalCreate(12, PaymentScheduleComponent_Conditional_12_Template, 17, 5, "div", 8);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance(4);
    \u0275\u0275property("size", 14);
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx.regularAmountOptions());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx.hasCustomOption() ? 9 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx.isCustomAmount() ? 10 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx.selectedAmount() > 0 ? 11 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx.installments().length > 0 ? 12 : -1);
  }
}, dependencies: [CommonModule, FormsModule, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, NumberValueAccessor, SelectControlValueAccessor, NgControlStatus, MinValidator, MaxValidator, NgModel, LucideAngularModule, LucideAngularComponent], styles: ["\n\n@keyframes _ngcontent-%COMP%_fadeIn {\n  from {\n    opacity: 0;\n    transform: translateY(-5px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n.animate-fade-in[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_fadeIn 0.3s ease-out forwards;\n}\ninput[type=date][_ngcontent-%COMP%]::-webkit-calendar-picker-indicator {\n  filter: invert(0);\n}\nhtml.dark[_nghost-%COMP%]   input[type=date][_ngcontent-%COMP%]::-webkit-calendar-picker-indicator, html.dark   [_nghost-%COMP%]   input[type=date][_ngcontent-%COMP%]::-webkit-calendar-picker-indicator {\n  filter: invert(1);\n}\ninput[type=number][_ngcontent-%COMP%]::-webkit-inner-spin-button, \ninput[type=number][_ngcontent-%COMP%]::-webkit-outer-spin-button {\n  opacity: 1;\n}\n/*# sourceMappingURL=payment-schedule.component.css.map */"] });
var PaymentScheduleComponent = _PaymentScheduleComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PaymentScheduleComponent, [{
    type: Component,
    args: [{ selector: "app-payment-schedule", standalone: true, imports: [CommonModule, FormsModule, LucideAngularModule], template: `
    <div class="payment-schedule-container bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-4 transition-colors duration-300">
      <!-- Selector de Monto -->
      <div class="field-group mb-5">
        <label class="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-200 text-sm mb-3 transition-colors duration-300">
          <div class="w-6 h-6 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg flex items-center justify-center transition-colors duration-300">
            <lucide-angular name="wallet" [size]="14" class="text-emerald-600 dark:text-emerald-400"></lucide-angular>
          </div>
          Seleccionar Monto
        </label>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2">
          @for (option of regularAmountOptions(); track option.field) {
            <button
              type="button"
              [class]="'flex flex-col items-center p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ' +
                (selectedField() === option.field && !isCustomAmount()
                  ? 'border-blue-500 bg-blue-500 dark:bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-slate-600')"
              (click)="selectAmount(option.value, option.field, option.restriccionFecha, option.generaCartaAcuerdo)"
            >
              <span class="text-[10px] opacity-70 leading-tight text-center">{{ option.label }}</span>
              <span class="text-sm font-bold mt-1">{{ formatCurrency(option.value) }}</span>
              @if (option.restriccionFecha && option.restriccionFecha !== 'SIN_RESTRICCION') {
                <span class="text-[8px] mt-1 px-1.5 py-0.5 rounded-full"
                  [class]="option.restriccionFecha === 'DENTRO_MES'
                    ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300'
                    : 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300'">
                  {{ option.restriccionFecha === 'DENTRO_MES' ? 'Este mes' : 'Pr\xF3x. mes+' }}
                </span>
              }
            </button>
          }
          <!-- Opci\xF3n personalizada -->
          @if (hasCustomOption()) {
            <button
              type="button"
              [class]="'flex flex-col items-center p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ' +
                (isCustomAmount()
                  ? 'col-span-2 border-purple-500 bg-purple-500 dark:bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                  : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:border-purple-400 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-slate-600')"
              (click)="enableCustomAmount()"
            >
              <span class="text-[10px] opacity-70">Otro monto</span>
              @if (isCustomAmount()) {
                <input
                  type="number"
                  class="w-full mt-1 px-3 py-1.5 border border-white/30 rounded text-center text-base font-bold bg-white/90 dark:bg-slate-800 text-slate-800 dark:text-white min-w-[120px]"
                  [(ngModel)]="customAmountValue"
                  (ngModelChange)="onCustomAmountChange($event)"
                  (click)="$event.stopPropagation()"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                >
              } @else {
                <lucide-angular name="edit-3" [size]="16" class="mt-1"></lucide-angular>
              }
            </button>
          }
        </div>

        <!-- Selector de campo base para "Otro monto" -->
        @if (isCustomAmount()) {
          <div class="mt-3 flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <lucide-angular name="link" [size]="16" class="text-purple-500 flex-shrink-0"></lucide-angular>
            <span class="text-xs text-purple-700 dark:text-purple-300">Campo base:</span>
            <select
              class="flex-1 px-2 py-1.5 text-sm border border-purple-300 dark:border-purple-600 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              [ngModel]="selectedBaseField()"
              (ngModelChange)="onBaseFieldChange($event)"
            >
              <option value="">Ninguno (monto libre)</option>
              @for (option of regularAmountOptions(); track option.field) {
                <option [value]="option.field">{{ option.label }} ({{ formatCurrency(option.value) }})</option>
              }
            </select>
            @if (selectedBaseField()) {
              <div class="relative">
                <!-- Badge clickeable -->
                <button
                  type="button"
                  class="text-xs font-medium px-2.5 py-1 rounded-full cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-md"
                  [class]="getDiscountInfo().isDiscount
                    ? 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800/50'
                    : 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800/50'"
                  (click)="togglePercentageEditor($event)"
                >
                  {{ getDiscountInfo().isDiscount ? '-' : '+' }}{{ getDiscountInfo().percentage }}%
                </button>

                <!-- Popover para editar porcentaje -->
                @if (showPercentageEditor()) {
                  <!-- Overlay para cerrar al hacer click fuera -->
                  <div class="fixed inset-0 z-40" (click)="showPercentageEditor.set(false)"></div>
                  <div class="absolute right-0 top-full mt-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div class="bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-600 p-3 min-w-[180px]">
                      <!-- Flecha -->
                      <div class="absolute -top-2 right-4 w-4 h-4 bg-white dark:bg-slate-800 border-l border-t border-slate-200 dark:border-slate-600 transform rotate-45"></div>

                      <div class="relative">
                        <label class="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wide font-medium">Ajuste %</label>
                        <div class="flex items-center gap-2 mt-1.5">
                          <button
                            type="button"
                            class="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                            [class]="isDiscountMode()
                              ? 'bg-red-500 text-white'
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-500 hover:bg-red-100 dark:hover:bg-red-900/30'"
                            (click)="setDiscountMode(true)"
                          >
                            <lucide-angular name="minus" [size]="14"></lucide-angular>
                          </button>
                          <input
                            type="number"
                            class="flex-1 w-16 px-2 py-1.5 text-center text-sm font-bold border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            [ngModel]="editablePercentage()"
                            (ngModelChange)="onPercentageChange($event)"
                            (click)="$event.stopPropagation()"
                            min="0"
                            max="100"
                            step="1"
                          >
                          <button
                            type="button"
                            class="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                            [class]="!isDiscountMode()
                              ? 'bg-green-500 text-white'
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-500 hover:bg-green-100 dark:hover:bg-green-900/30'"
                            (click)="setDiscountMode(false)"
                          >
                            <lucide-angular name="plus" [size]="14"></lucide-angular>
                          </button>
                        </div>
                        <p class="text-[10px] text-slate-400 dark:text-slate-500 mt-2 text-center">
                          Base: {{ formatCurrency(montoBase() || 0) }}
                        </p>
                      </div>
                    </div>
                  </div>
                }
              </div>
            }
          </div>
        }
      </div>

      <!-- Selector de Cuotas -->
      @if (selectedAmount() > 0) {
        <div class="field-group mb-5">
          <label class="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-200 text-sm mb-3 transition-colors duration-300">
            <div class="w-6 h-6 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center transition-colors duration-300">
              <lucide-angular name="calendar-days" [size]="14" class="text-blue-600 dark:text-blue-400"></lucide-angular>
            </div>
            N\xFAmero de Cuotas
          </label>
          <div class="flex flex-wrap gap-2">
            @for (num of installmentOptions; track num) {
              <button
                type="button"
                [class]="'px-4 py-2 border-2 rounded-lg cursor-pointer transition-all duration-200 text-sm font-medium hover:shadow-md ' +
                  (numberOfInstallments() === num
                    ? 'border-emerald-500 bg-emerald-500 dark:bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                    : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:border-emerald-400 dark:hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-slate-600')"
                (click)="setInstallments(num)"
              >
                {{ num }} {{ num === 1 ? 'cuota' : 'cuotas' }}
              </button>
            }
          </div>
        </div>
      }

      <!-- Detalle de Cuotas -->
      @if (installments().length > 0) {
        <div class="field-group">
          <label class="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-200 text-sm mb-3 transition-colors duration-300">
            <div class="w-6 h-6 bg-amber-100 dark:bg-amber-900/50 rounded-lg flex items-center justify-center transition-colors duration-300">
              <lucide-angular name="list-ordered" [size]="14" class="text-amber-600 dark:text-amber-400"></lucide-angular>
            </div>
            Detalle del Cronograma
          </label>
          <!-- Mensaje de restricci\xF3n de fecha -->
          @if (dateRestrictionInfo().message) {
            <div class="mb-3 px-3 py-2 rounded-lg text-xs flex items-center gap-2"
              [class]="selectedRestriccion() === 'DENTRO_MES'
                ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                : 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'">
              <lucide-angular name="info" [size]="14"></lucide-angular>
              <span>{{ dateRestrictionInfo().message }}</span>
            </div>
          }
          <div class="bg-white dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600 overflow-hidden transition-colors duration-300">
            @for (installment of installments(); track installment.numeroCuota) {
              <div class="grid grid-cols-1 sm:grid-cols-[100px_1fr_1fr] gap-3 p-3 border-b border-slate-100 dark:border-slate-600 last:border-b-0 items-center transition-colors duration-300">
                <div class="font-bold text-blue-600 dark:text-blue-400 text-sm flex items-center gap-2">
                  <lucide-angular name="hash" [size]="14"></lucide-angular>
                  Cuota {{ installment.numeroCuota }}
                </div>
                <div class="flex items-center gap-2">
                  <label class="text-xs text-slate-500 dark:text-slate-400 min-w-[50px]">Monto:</label>
                  <input
                    type="number"
                    [(ngModel)]="installment.monto"
                    (ngModelChange)="onInstallmentAmountChange(installment.numeroCuota)"
                    [min]="1"
                    step="0.01"
                    class="flex-1 px-3 py-2 border border-slate-200 dark:border-slate-500 rounded-lg text-sm bg-slate-50 dark:bg-slate-600 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                </div>
                <div class="flex items-center gap-2">
                  <label class="text-xs text-slate-500 dark:text-slate-400 min-w-[50px]">Fecha:</label>
                  <input
                    type="date"
                    [(ngModel)]="installment.fechaPago"
                    (ngModelChange)="onInstallmentChange()"
                    [min]="dateRestrictionInfo().minDate"
                    [max]="dateRestrictionInfo().maxDate"
                    class="flex-1 px-3 py-2 border border-slate-200 dark:border-slate-500 rounded-lg text-sm bg-slate-50 dark:bg-slate-600 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                </div>
              </div>
            }
          </div>

          <!-- Resumen -->
          <div class="mt-4 p-4 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl border border-emerald-200 dark:border-emerald-800 transition-colors duration-300">
            <div class="flex justify-between items-center text-sm text-emerald-700 dark:text-emerald-300">
              <span class="flex items-center gap-2">
                <lucide-angular name="calculator" [size]="16"></lucide-angular>
                Monto Total:
              </span>
              <span class="text-lg font-bold">{{ formatCurrency(totalAmount()) }}</span>
            </div>
            @if (numberOfInstallments() > 1) {
              <div class="flex justify-between items-center text-sm text-emerald-600 dark:text-emerald-400 mt-2 pt-2 border-t border-emerald-200 dark:border-emerald-700">
                <span>Monto por cuota:</span>
                <span class="font-semibold">{{ formatCurrency(amountPerInstallment()) }}</span>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `, styles: ["/* angular:styles/component:css;2bcbbb4722d24eda9f06aa2e6e207fb394e15d7024380d5f8c8a1f56601da570;C:/Users/HP/Documents/Kubito-2.0-v1/cashi-discador-frontend/cashi-discador-frontend/src/app/shared/components/payment-schedule/payment-schedule.component.ts */\n@keyframes fadeIn {\n  from {\n    opacity: 0;\n    transform: translateY(-5px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n.animate-fade-in {\n  animation: fadeIn 0.3s ease-out forwards;\n}\ninput[type=date]::-webkit-calendar-picker-indicator {\n  filter: invert(0);\n}\n:host-context(html.dark) input[type=date]::-webkit-calendar-picker-indicator {\n  filter: invert(1);\n}\ninput[type=number]::-webkit-inner-spin-button,\ninput[type=number]::-webkit-outer-spin-button {\n  opacity: 1;\n}\n/*# sourceMappingURL=payment-schedule.component.css.map */\n"] }]
  }], null, { maxInstallments: [{
    type: Input
  }], scheduleChange: [{
    type: Output
  }], customAmountSelected: [{
    type: Output
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PaymentScheduleComponent, { className: "PaymentScheduleComponent", filePath: "src/app/shared/components/payment-schedule/payment-schedule.component.ts", lineNumber: 295 });
})();

// src/app/collection-management/components/dynamic-field-renderer/dynamic-field-renderer.component.ts
var _forTrack02 = ($index, $item) => $item.id;
var _forTrack12 = ($index, $item) => $item.value;
var _forTrack2 = ($index, $item) => $item.value || $item;
function DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 6);
    \u0275\u0275text(1, "*");
    \u0275\u0275elementEnd();
  }
}
function DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 7);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const field_r1 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(field_r1.helpText);
  }
}
function DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "input", 21);
    \u0275\u0275twoWayListener("ngModelChange", function DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_5_Template_input_ngModelChange_0_listener($event) {
      \u0275\u0275restoreView(_r2);
      const field_r1 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r2.fieldData()[field_r1.id], $event) || (ctx_r2.fieldData()[field_r1.id] = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const field_r1 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.fieldData()[field_r1.id]);
    \u0275\u0275property("placeholder", field_r1.placeholder || "")("required", field_r1.required ?? false)("minlength", field_r1.minLength ?? null)("maxlength", field_r1.maxLength ?? null);
  }
}
function DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "input", 22);
    \u0275\u0275listener("ngModelChange", function DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_6_Template_input_ngModelChange_0_listener($event) {
      \u0275\u0275restoreView(_r4);
      const field_r1 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.updateFieldValue(field_r1.id, $event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const field_r1 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275property("ngModel", ctx_r2.fieldData()[field_r1.id])("placeholder", field_r1.placeholder || "")("required", field_r1.required ?? false)("min", field_r1.min ?? null)("max", field_r1.max ?? null);
  }
}
function DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 10)(1, "span", 23);
    \u0275\u0275text(2, "S/");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "input", 24);
    \u0275\u0275listener("ngModelChange", function DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_7_Template_input_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r5);
      const field_r1 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.updateFieldValue(field_r1.id, $event));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const field_r1 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275property("ngModel", ctx_r2.fieldData()[field_r1.id])("placeholder", field_r1.placeholder || "0.00")("required", field_r1.required ?? false)("min", field_r1.min || 0);
  }
}
function DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "input", 25);
    \u0275\u0275twoWayListener("ngModelChange", function DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_8_Template_input_ngModelChange_0_listener($event) {
      \u0275\u0275restoreView(_r6);
      const field_r1 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r2.fieldData()[field_r1.id], $event) || (ctx_r2.fieldData()[field_r1.id] = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const field_r1 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.fieldData()[field_r1.id]);
    \u0275\u0275property("required", field_r1.required ?? false);
  }
}
function DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "input", 26);
    \u0275\u0275twoWayListener("ngModelChange", function DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_9_Template_input_ngModelChange_0_listener($event) {
      \u0275\u0275restoreView(_r7);
      const field_r1 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r2.fieldData()[field_r1.id], $event) || (ctx_r2.fieldData()[field_r1.id] = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const field_r1 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.fieldData()[field_r1.id]);
    \u0275\u0275property("required", field_r1.required ?? false);
  }
}
function DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_10_For_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 29);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const option_r9 = ctx.$implicit;
    \u0275\u0275property("value", option_r9.value);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(option_r9.label);
  }
}
function DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "select", 27);
    \u0275\u0275twoWayListener("ngModelChange", function DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_10_Template_select_ngModelChange_0_listener($event) {
      \u0275\u0275restoreView(_r8);
      const field_r1 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r2.fieldData()[field_r1.id], $event) || (ctx_r2.fieldData()[field_r1.id] = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(1, "option", 28);
    \u0275\u0275text(2, "-- Seleccionar --");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(3, DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_10_For_4_Template, 2, 2, "option", 29, _forTrack12);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const field_r1 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.fieldData()[field_r1.id]);
    \u0275\u0275property("required", field_r1.required ?? false);
    \u0275\u0275advance(3);
    \u0275\u0275repeater(field_r1.options);
  }
}
function DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "textarea", 30);
    \u0275\u0275twoWayListener("ngModelChange", function DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_11_Template_textarea_ngModelChange_0_listener($event) {
      \u0275\u0275restoreView(_r10);
      const field_r1 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r2.fieldData()[field_r1.id], $event) || (ctx_r2.fieldData()[field_r1.id] = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const field_r1 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.fieldData()[field_r1.id]);
    \u0275\u0275property("placeholder", field_r1.placeholder || "")("required", field_r1.required ?? false)("minlength", field_r1.minLength ?? null)("maxlength", field_r1.maxLength ?? null);
  }
}
function DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 15)(1, "input", 31);
    \u0275\u0275twoWayListener("ngModelChange", function DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_12_Template_input_ngModelChange_1_listener($event) {
      \u0275\u0275restoreView(_r11);
      const field_r1 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r2.fieldData()[field_r1.id], $event) || (ctx_r2.fieldData()[field_r1.id] = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "span", 32);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const field_r1 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.fieldData()[field_r1.id]);
    \u0275\u0275property("required", field_r1.required ?? false);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(field_r1.placeholder || "Marcar si aplica");
  }
}
function DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 10)(1, "span", 23);
    \u0275\u0275text(2, "\u{1F4F1}");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "input", 33);
    \u0275\u0275twoWayListener("ngModelChange", function DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_13_Template_input_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r12);
      const field_r1 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r2.fieldData()[field_r1.id], $event) || (ctx_r2.fieldData()[field_r1.id] = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const field_r1 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.fieldData()[field_r1.id]);
    \u0275\u0275property("placeholder", field_r1.placeholder || "999 999 999")("required", field_r1.required ?? false);
  }
}
function DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "input", 34);
    \u0275\u0275twoWayListener("ngModelChange", function DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_14_Template_input_ngModelChange_0_listener($event) {
      \u0275\u0275restoreView(_r13);
      const field_r1 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r2.fieldData()[field_r1.id], $event) || (ctx_r2.fieldData()[field_r1.id] = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const field_r1 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.fieldData()[field_r1.id]);
    \u0275\u0275property("required", field_r1.required ?? false);
  }
}
function DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "input", 35);
    \u0275\u0275twoWayListener("ngModelChange", function DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_15_Template_input_ngModelChange_0_listener($event) {
      \u0275\u0275restoreView(_r14);
      const field_r1 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r2.fieldData()[field_r1.id], $event) || (ctx_r2.fieldData()[field_r1.id] = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const field_r1 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.fieldData()[field_r1.id]);
    \u0275\u0275property("placeholder", field_r1.placeholder || "ejemplo@correo.com")("required", field_r1.required ?? false);
  }
}
function DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    const _r15 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "input", 36);
    \u0275\u0275twoWayListener("ngModelChange", function DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_16_Template_input_ngModelChange_0_listener($event) {
      \u0275\u0275restoreView(_r15);
      const field_r1 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r2.fieldData()[field_r1.id], $event) || (ctx_r2.fieldData()[field_r1.id] = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const field_r1 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.fieldData()[field_r1.id]);
    \u0275\u0275property("placeholder", field_r1.placeholder || "https://ejemplo.com")("required", field_r1.required ?? false);
  }
}
function DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    const _r16 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-payment-schedule", 37);
    \u0275\u0275listener("scheduleChange", function DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_17_Template_app_payment_schedule_scheduleChange_0_listener($event) {
      \u0275\u0275restoreView(_r16);
      const field_r1 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.onPaymentScheduleChange(field_r1.id, $event));
    })("customAmountSelected", function DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_17_Template_app_payment_schedule_customAmountSelected_0_listener($event) {
      \u0275\u0275restoreView(_r16);
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.onCustomAmountSelected($event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const field_r1 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275property("availableAmounts", ctx_r2.getPaymentAmountOptions(field_r1))("maxInstallments", 6);
  }
}
function DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_18_For_6_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 46);
    \u0275\u0275text(1, "*");
    \u0275\u0275elementEnd();
  }
}
function DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_18_For_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 41);
    \u0275\u0275text(1);
    \u0275\u0275conditionalCreate(2, DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_18_For_6_Conditional_2_Template, 2, 0, "span", 46);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const column_r17 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", column_r17.label, " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(column_r17.required ? 2 : -1);
  }
}
function DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_18_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "th", 42);
  }
}
function DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_18_For_10_For_2_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 49);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const \u0275$index_110_r18 = \u0275\u0275nextContext(2).$index;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", \u0275$index_110_r18 + 1, " ");
  }
}
function DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_18_For_10_For_2_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r19 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "input", 56);
    \u0275\u0275twoWayListener("ngModelChange", function DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_18_For_10_For_2_Conditional_2_Template_input_ngModelChange_0_listener($event) {
      \u0275\u0275restoreView(_r19);
      const column_r20 = \u0275\u0275nextContext().$implicit;
      const row_r21 = \u0275\u0275nextContext().$implicit;
      \u0275\u0275twoWayBindingSet(row_r21[column_r20.id], $event) || (row_r21[column_r20.id] = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const column_r20 = \u0275\u0275nextContext().$implicit;
    const row_r21 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275twoWayProperty("ngModel", row_r21[column_r20.id]);
    \u0275\u0275property("required", column_r20.required ?? false);
  }
}
function DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_18_For_10_For_2_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r22 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "input", 57);
    \u0275\u0275twoWayListener("ngModelChange", function DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_18_For_10_For_2_Conditional_3_Template_input_ngModelChange_0_listener($event) {
      \u0275\u0275restoreView(_r22);
      const column_r20 = \u0275\u0275nextContext().$implicit;
      const row_r21 = \u0275\u0275nextContext().$implicit;
      \u0275\u0275twoWayBindingSet(row_r21[column_r20.id], $event) || (row_r21[column_r20.id] = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const column_r20 = \u0275\u0275nextContext().$implicit;
    const row_r21 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275twoWayProperty("ngModel", row_r21[column_r20.id]);
    \u0275\u0275property("required", column_r20.required ?? false);
  }
}
function DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_18_For_10_For_2_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r23 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 10)(1, "span", 58);
    \u0275\u0275text(2, "S/");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "input", 59);
    \u0275\u0275twoWayListener("ngModelChange", function DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_18_For_10_For_2_Conditional_4_Template_input_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r23);
      const column_r20 = \u0275\u0275nextContext().$implicit;
      const row_r21 = \u0275\u0275nextContext().$implicit;
      \u0275\u0275twoWayBindingSet(row_r21[column_r20.id], $event) || (row_r21[column_r20.id] = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const column_r20 = \u0275\u0275nextContext().$implicit;
    const row_r21 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", row_r21[column_r20.id]);
    \u0275\u0275property("required", column_r20.required ?? false);
  }
}
function DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_18_For_10_For_2_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r24 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "input", 60);
    \u0275\u0275twoWayListener("ngModelChange", function DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_18_For_10_For_2_Conditional_5_Template_input_ngModelChange_0_listener($event) {
      \u0275\u0275restoreView(_r24);
      const column_r20 = \u0275\u0275nextContext().$implicit;
      const row_r21 = \u0275\u0275nextContext().$implicit;
      \u0275\u0275twoWayBindingSet(row_r21[column_r20.id], $event) || (row_r21[column_r20.id] = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const column_r20 = \u0275\u0275nextContext().$implicit;
    const row_r21 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext(4);
    \u0275\u0275twoWayProperty("ngModel", row_r21[column_r20.id]);
    \u0275\u0275property("required", column_r20.required ?? false)("min", ctx_r2.getMinDate(column_r20))("max", ctx_r2.getMaxDate(column_r20));
  }
}
function DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_18_For_10_For_2_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r25 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "input", 61);
    \u0275\u0275twoWayListener("ngModelChange", function DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_18_For_10_For_2_Conditional_6_Template_input_ngModelChange_0_listener($event) {
      \u0275\u0275restoreView(_r25);
      const column_r20 = \u0275\u0275nextContext().$implicit;
      const row_r21 = \u0275\u0275nextContext().$implicit;
      \u0275\u0275twoWayBindingSet(row_r21[column_r20.id], $event) || (row_r21[column_r20.id] = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const column_r20 = \u0275\u0275nextContext().$implicit;
    const row_r21 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275twoWayProperty("ngModel", row_r21[column_r20.id]);
    \u0275\u0275property("required", column_r20.required ?? false);
  }
}
function DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_18_For_10_For_2_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r26 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "input", 62);
    \u0275\u0275twoWayListener("ngModelChange", function DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_18_For_10_For_2_Conditional_7_Template_input_ngModelChange_0_listener($event) {
      \u0275\u0275restoreView(_r26);
      const column_r20 = \u0275\u0275nextContext().$implicit;
      const row_r21 = \u0275\u0275nextContext().$implicit;
      \u0275\u0275twoWayBindingSet(row_r21[column_r20.id], $event) || (row_r21[column_r20.id] = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const column_r20 = \u0275\u0275nextContext().$implicit;
    const row_r21 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275twoWayProperty("ngModel", row_r21[column_r20.id]);
    \u0275\u0275property("required", column_r20.required ?? false);
  }
}
function DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_18_For_10_For_2_Conditional_8_For_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 29);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const option_r28 = ctx.$implicit;
    \u0275\u0275property("value", option_r28.value || option_r28);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", option_r28.label || option_r28, " ");
  }
}
function DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_18_For_10_For_2_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r27 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "select", 63);
    \u0275\u0275twoWayListener("ngModelChange", function DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_18_For_10_For_2_Conditional_8_Template_select_ngModelChange_0_listener($event) {
      \u0275\u0275restoreView(_r27);
      const column_r20 = \u0275\u0275nextContext().$implicit;
      const row_r21 = \u0275\u0275nextContext().$implicit;
      \u0275\u0275twoWayBindingSet(row_r21[column_r20.id], $event) || (row_r21[column_r20.id] = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(1, "option", 28);
    \u0275\u0275text(2, "Seleccionar...");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(3, DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_18_For_10_For_2_Conditional_8_For_4_Template, 2, 2, "option", 29, _forTrack2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const column_r20 = \u0275\u0275nextContext().$implicit;
    const row_r21 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275twoWayProperty("ngModel", row_r21[column_r20.id]);
    \u0275\u0275property("required", column_r20.required ?? false);
    \u0275\u0275advance(3);
    \u0275\u0275repeater(column_r20.options);
  }
}
function DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_18_For_10_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 47);
    \u0275\u0275conditionalCreate(1, DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_18_For_10_For_2_Conditional_1_Template, 2, 1, "div", 49)(2, DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_18_For_10_For_2_Conditional_2_Template, 1, 2, "input", 50)(3, DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_18_For_10_For_2_Conditional_3_Template, 1, 2, "input", 51)(4, DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_18_For_10_For_2_Conditional_4_Template, 4, 2, "div", 10)(5, DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_18_For_10_For_2_Conditional_5_Template, 1, 4, "input", 52)(6, DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_18_For_10_For_2_Conditional_6_Template, 1, 2, "input", 53)(7, DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_18_For_10_For_2_Conditional_7_Template, 1, 2, "input", 54)(8, DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_18_For_10_For_2_Conditional_8_Template, 5, 2, "select", 55);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const column_r20 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275conditional(column_r20.type === "auto-number" ? 1 : column_r20.type === "text" ? 2 : column_r20.type === "number" ? 3 : column_r20.type === "currency" ? 4 : column_r20.type === "date" ? 5 : column_r20.type === "time" ? 6 : column_r20.type === "phone" ? 7 : column_r20.type === "select" ? 8 : -1);
  }
}
function DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_18_For_10_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r29 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "td", 48)(1, "button", 64);
    \u0275\u0275listener("click", function DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_18_For_10_Conditional_3_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r29);
      const \u0275$index_110_r18 = \u0275\u0275nextContext().$index;
      const field_r1 = \u0275\u0275nextContext(2).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.removeTableRow(field_r1.id, \u0275$index_110_r18));
    });
    \u0275\u0275elementEnd()();
  }
}
function DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_18_For_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr", 44);
    \u0275\u0275repeaterCreate(1, DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_18_For_10_For_2_Template, 9, 1, "td", 47, _forTrack02);
    \u0275\u0275conditionalCreate(3, DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_18_For_10_Conditional_3_Template, 2, 0, "td", 48);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const field_r1 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance();
    \u0275\u0275repeater(field_r1.columns);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(field_r1.allowDeleteRow ? 3 : -1);
  }
}
function DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_18_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 65)(2, "div", 66);
    \u0275\u0275element(3, "div", 67);
    \u0275\u0275elementStart(4, "p", 68);
    \u0275\u0275text(5, "No hay registros en la tabla");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p", 69);
    \u0275\u0275text(7, 'Haz clic en "Agregar Fila" para comenzar');
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const field_r1 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance();
    \u0275\u0275attribute("colspan", field_r1.columns.length + (field_r1.allowDeleteRow ? 1 : 0));
  }
}
function DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_18_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r30 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 45)(1, "button", 70);
    \u0275\u0275listener("click", function DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_18_Conditional_12_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r30);
      const field_r1 = \u0275\u0275nextContext(2).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.addTableRow(field_r1.id, field_r1.columns || []));
    });
    \u0275\u0275text(2, " Agregar Fila ");
    \u0275\u0275elementEnd()();
  }
}
function DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 20)(1, "div", 38)(2, "table", 39)(3, "thead")(4, "tr", 40);
    \u0275\u0275repeaterCreate(5, DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_18_For_6_Template, 3, 2, "th", 41, _forTrack02);
    \u0275\u0275conditionalCreate(7, DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_18_Conditional_7_Template, 1, 0, "th", 42);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "tbody", 43);
    \u0275\u0275repeaterCreate(9, DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_18_For_10_Template, 4, 1, "tr", 44, \u0275\u0275repeaterTrackByIndex);
    \u0275\u0275conditionalCreate(11, DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_18_Conditional_11_Template, 8, 1, "tr");
    \u0275\u0275elementEnd()()();
    \u0275\u0275conditionalCreate(12, DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_18_Conditional_12_Template, 3, 0, "div", 45);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const field_r1 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(5);
    \u0275\u0275repeater(field_r1.columns);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(field_r1.allowDeleteRow ? 7 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r2.getTableRows(field_r1.id));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r2.getTableRows(field_r1.id).length === 0 ? 11 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(field_r1.allowAddRow && (!field_r1.maxRows || ctx_r2.getTableRows(field_r1.id).length < field_r1.maxRows) ? 12 : -1);
  }
}
function DynamicFieldRendererComponent_Conditional_0_For_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div")(1, "label", 5);
    \u0275\u0275text(2);
    \u0275\u0275conditionalCreate(3, DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_3_Template, 2, 0, "span", 6);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(4, DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_4_Template, 2, 1, "p", 7);
    \u0275\u0275conditionalCreate(5, DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_5_Template, 1, 5, "input", 8);
    \u0275\u0275conditionalCreate(6, DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_6_Template, 1, 5, "input", 9);
    \u0275\u0275conditionalCreate(7, DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_7_Template, 4, 4, "div", 10);
    \u0275\u0275conditionalCreate(8, DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_8_Template, 1, 2, "input", 11);
    \u0275\u0275conditionalCreate(9, DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_9_Template, 1, 2, "input", 12);
    \u0275\u0275conditionalCreate(10, DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_10_Template, 5, 2, "select", 13);
    \u0275\u0275conditionalCreate(11, DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_11_Template, 1, 5, "textarea", 14);
    \u0275\u0275conditionalCreate(12, DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_12_Template, 4, 3, "div", 15);
    \u0275\u0275conditionalCreate(13, DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_13_Template, 4, 3, "div", 10);
    \u0275\u0275conditionalCreate(14, DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_14_Template, 1, 2, "input", 16);
    \u0275\u0275conditionalCreate(15, DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_15_Template, 1, 3, "input", 17);
    \u0275\u0275conditionalCreate(16, DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_16_Template, 1, 3, "input", 18);
    \u0275\u0275conditionalCreate(17, DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_17_Template, 1, 2, "app-payment-schedule", 19);
    \u0275\u0275conditionalCreate(18, DynamicFieldRendererComponent_Conditional_0_For_6_Conditional_18_Template, 13, 3, "div", 20);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const field_r1 = ctx.$implicit;
    \u0275\u0275classProp("md:col-span-2", field_r1.type === "table" || field_r1.type === "textarea" || field_r1.type === "payment_schedule");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", field_r1.label, " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(field_r1.required ? 3 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(field_r1.helpText ? 4 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(field_r1.type === "text" ? 5 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(field_r1.type === "number" ? 6 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(field_r1.type === "currency" ? 7 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(field_r1.type === "date" ? 8 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(field_r1.type === "datetime" ? 9 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(field_r1.type === "select" ? 10 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(field_r1.type === "textarea" ? 11 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(field_r1.type === "checkbox" ? 12 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(field_r1.type === "phone" ? 13 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(field_r1.type === "time" ? 14 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(field_r1.type === "email" ? 15 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(field_r1.type === "url" ? 16 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(field_r1.type === "payment_schedule" ? 17 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(field_r1.type === "table" ? 18 : -1);
  }
}
function DynamicFieldRendererComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "h3", 2);
    \u0275\u0275text(3, "Campos Adicionales");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "div", 3);
    \u0275\u0275repeaterCreate(5, DynamicFieldRendererComponent_Conditional_0_For_6_Template, 19, 19, "div", 4, _forTrack02);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275repeater(ctx_r2.schema().fields);
  }
}
var _DynamicFieldRendererComponent = class _DynamicFieldRendererComponent {
  constructor() {
    this.schema = input(null, ...ngDevMode ? [{ debugName: "schema" }] : []);
    this.externalUpdates = input({}, ...ngDevMode ? [{ debugName: "externalUpdates" }] : []);
    this.selectedClassification = input(null, ...ngDevMode ? [{ debugName: "selectedClassification" }] : []);
    this.customerAmounts = input([], ...ngDevMode ? [{ debugName: "customerAmounts" }] : []);
    this.fieldData = signal({}, ...ngDevMode ? [{ debugName: "fieldData" }] : []);
    this.dataChange = output();
    this.customAmountDetected = output();
    effect(() => {
      const currentSchema = this.schema();
      if (currentSchema && currentSchema.fields) {
        console.log("[DynamicFieldRenderer] Schema received with fields:", currentSchema.fields.map((f) => ({ id: f.id, type: f.type, label: f.label })));
        const initialData = {};
        currentSchema.fields.forEach((field) => {
          console.log(`[DynamicFieldRenderer] Processing field: ${field.id}, type: ${field.type}`);
          if (field.type === "table") {
            const minRows = field.minRows || 0;
            initialData[field.id] = Array.from({ length: minRows }, () => this.createEmptyTableRow(field.columns || []));
          } else if (field.type === "checkbox") {
            initialData[field.id] = false;
          } else if (field.type === "payment_schedule") {
            initialData[field.id] = null;
          } else {
            initialData[field.id] = "";
          }
        });
        this.fieldData.set(initialData);
      }
    });
    effect(() => {
      const updates = this.externalUpdates();
      if (updates && Object.keys(updates).length > 0) {
        console.log("[DynamicField] Received external updates:", updates);
        const currentData = untracked(() => __spreadValues({}, this.fieldData()));
        let hasChanges = false;
        Object.keys(updates).forEach((key) => {
          if (updates[key] !== void 0 && updates[key] !== null && currentData[key] !== updates[key]) {
            currentData[key] = updates[key];
            hasChanges = true;
          }
        });
        if (hasChanges) {
          console.log("[DynamicField] Applying updates to fieldData");
          this.fieldData.set(currentData);
        } else {
          console.log("[DynamicField] No changes detected, skipping update");
        }
      }
    });
    effect(() => {
      const data = this.fieldData();
      const currentSchema = this.schema();
      if (!currentSchema?.fields) {
        return;
      }
      const linkedTables = currentSchema.fields.filter((field) => field.type === "table" && field.linkedToField);
      linkedTables.forEach((tableField) => {
        const linkedFieldId = tableField.linkedToField;
        const linkedFieldValue = data[linkedFieldId];
        console.log(`\u{1F517} Sincronizaci\xF3n n\xFAmero\u2192tabla: "${linkedFieldId}"=${linkedFieldValue} \u2192 tabla="${tableField.id}"`);
        if (linkedFieldValue && typeof linkedFieldValue === "number" && linkedFieldValue > 0) {
          const currentRows = this.getTableRows(tableField.id);
          const targetRows = Math.floor(linkedFieldValue);
          console.log(`   Filas actuales: ${currentRows.length}, Filas objetivo: ${targetRows}`);
          if (currentRows.length !== targetRows) {
            console.log(`   \u2705 Ajustando tabla de ${currentRows.length} a ${targetRows} filas`);
            this.adjustTableRows(tableField.id, targetRows, tableField.columns || []);
          }
        }
      });
    });
    effect(() => {
      this.dataChange.emit(this.fieldData());
    });
  }
  updateFieldValue(fieldId, value) {
    const currentData = __spreadValues({}, this.fieldData());
    if (typeof value === "string" && value !== "" && !isNaN(Number(value))) {
      currentData[fieldId] = Number(value);
    } else {
      currentData[fieldId] = value;
    }
    this.fieldData.set(currentData);
    this.checkLinkedTables(fieldId, currentData);
  }
  checkLinkedTables(changedFieldId, currentData) {
    const currentSchema = this.schema();
    if (!currentSchema?.fields) {
      return;
    }
    const linkedTables = currentSchema.fields.filter((field) => field.type === "table" && field.linkedToField === changedFieldId);
    linkedTables.forEach((tableField) => {
      const linkedFieldValue = currentData[changedFieldId];
      if (linkedFieldValue && typeof linkedFieldValue === "number" && linkedFieldValue > 0) {
        const currentRows = this.getTableRows(tableField.id);
        const targetRows = Math.floor(linkedFieldValue);
        if (currentRows.length !== targetRows) {
          this.adjustTableRows(tableField.id, targetRows, tableField.columns || []);
        }
      }
    });
  }
  getTableRows(fieldId) {
    const data = this.fieldData()[fieldId];
    if (Array.isArray(data)) {
      return data;
    }
    return [];
  }
  addTableRow(fieldId, columns) {
    const currentData = __spreadValues({}, this.fieldData());
    if (!Array.isArray(currentData[fieldId])) {
      currentData[fieldId] = [];
    }
    const newRow = this.createEmptyTableRow(columns);
    currentData[fieldId].push(newRow);
    const newRowCount = currentData[fieldId].length;
    console.log(`\u2795 Tabla\u2192N\xFAmero: Agregada fila, total=${newRowCount}`);
    this.fieldData.set(currentData);
    this.updateLinkedFieldFromTable(fieldId, newRowCount);
  }
  removeTableRow(fieldId, rowIndex) {
    const currentData = __spreadValues({}, this.fieldData());
    if (Array.isArray(currentData[fieldId])) {
      const currentRowCount = currentData[fieldId].length;
      const typification = this.selectedClassification();
      if (typification?.codigo === "PF") {
        if (currentRowCount <= 2) {
          alert("Los Pagos Fraccionados requieren m\xEDnimo 2 cuotas. No se puede eliminar m\xE1s filas.");
          return;
        }
      } else if (typification?.codigo === "CF") {
        if (currentRowCount <= 1) {
          alert("Los Convenios requieren m\xEDnimo 1 cuota. No se puede eliminar esta fila.");
          return;
        }
      }
      currentData[fieldId].splice(rowIndex, 1);
      const newRowCount = currentData[fieldId].length;
      console.log(`\u2796 Tabla\u2192N\xFAmero: Eliminada fila, total=${newRowCount}`);
      this.fieldData.set(currentData);
      this.updateLinkedFieldFromTable(fieldId, newRowCount);
    }
  }
  /**
   * Actualiza el campo vinculado (linkedToField) cuando cambian las filas de una tabla
   */
  updateLinkedFieldFromTable(tableFieldId, rowCount) {
    const currentSchema = this.schema();
    console.log(`\u{1F50D} updateLinkedFieldFromTable: tableFieldId="${tableFieldId}", rowCount=${rowCount}`);
    if (!currentSchema?.fields) {
      console.log(`   \u274C No hay schema o fields`);
      return;
    }
    const tableField = currentSchema.fields.find((f) => f.id === tableFieldId);
    console.log(`   Campo tabla encontrado:`, tableField);
    if (!tableField || tableField.type !== "table") {
      console.log(`   \u274C Campo no encontrado o no es tabla`);
      return;
    }
    const linkedFieldId = tableField.linkedToField;
    console.log(`   linkedToField="${linkedFieldId}"`);
    if (!linkedFieldId) {
      console.log(`   \u274C No hay linkedToField definido`);
      return;
    }
    const currentData = __spreadValues({}, this.fieldData());
    const currentValue = currentData[linkedFieldId];
    console.log(`   Valor actual del campo vinculado: ${currentValue}`);
    if (currentValue !== rowCount) {
      currentData[linkedFieldId] = rowCount;
      this.fieldData.set(currentData);
      console.log(`   \u2705 Campo "${linkedFieldId}" actualizado: ${currentValue} \u2192 ${rowCount}`);
    } else {
      console.log(`   \u26A0\uFE0F El valor ya es ${rowCount}, no se actualiza`);
    }
  }
  adjustTableRows(fieldId, targetCount, columns) {
    const currentData = __spreadValues({}, this.fieldData());
    if (!Array.isArray(currentData[fieldId])) {
      currentData[fieldId] = [];
    }
    const currentRows = currentData[fieldId];
    const currentCount = currentRows.length;
    if (targetCount > currentCount) {
      for (let i = currentCount; i < targetCount; i++) {
        currentRows.push(this.createEmptyTableRow(columns));
      }
    } else if (targetCount < currentCount) {
      currentRows.splice(targetCount);
    }
    this.fieldData.set(currentData);
  }
  getTodayDate() {
    const today = /* @__PURE__ */ new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  getEndOfMonthDate() {
    const today = /* @__PURE__ */ new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const lastDay = new Date(year, month + 1, 0).getDate();
    const monthStr = String(month + 1).padStart(2, "0");
    const dayStr = String(lastDay).padStart(2, "0");
    return `${year}-${monthStr}-${dayStr}`;
  }
  getMinDate(column) {
    const minDate = column.minDate;
    if (minDate === "today") {
      return this.getTodayDate();
    }
    return minDate;
  }
  getMaxDate(column) {
    const typification = this.selectedClassification();
    if (typification?.codigo === "PF") {
      return this.getEndOfMonthDate();
    }
    return column.maxDate;
  }
  createEmptyTableRow(columns) {
    const row = {};
    columns.forEach((column) => {
      if (column.type === "auto-number") {
        row[column.id] = null;
      } else if (column.type === "number" || column.type === "currency") {
        row[column.id] = column.defaultValue || 0;
      } else if (column.type === "date") {
        row[column.id] = column.defaultValue || "";
      } else {
        row[column.id] = column.defaultValue || "";
      }
    });
    return row;
  }
  // Public method to get current field data
  getData() {
    return this.fieldData();
  }
  // Public method to set field data (for loading existing data)
  setData(data) {
    this.fieldData.set(data);
  }
  // Payment Schedule methods
  getPaymentAmountOptions(field) {
    const amounts = this.customerAmounts();
    if (amounts && amounts.length > 0) {
      console.log("[DynamicFieldRenderer] Using customer amounts:", amounts);
      return amounts;
    }
    if (field.options && field.options.length > 0) {
      return field.options.map((opt) => ({
        label: opt.label || String(opt.value),
        value: typeof opt.value === "number" ? opt.value : parseFloat(String(opt.value)) || 0,
        field: opt.field
      }));
    }
    console.log("[DynamicFieldRenderer] No customer amounts, using defaults");
    return [
      { label: "Sin datos de deuda", value: 0, field: "default" }
    ];
  }
  onPaymentScheduleChange(fieldId, schedule) {
    const currentData = __spreadValues({}, this.fieldData());
    currentData[fieldId] = schedule;
    this.fieldData.set(currentData);
    console.log("[DynamicField] Payment schedule changed:", fieldId, schedule);
  }
  /**
   * Maneja cuando se selecciona monto personalizado
   * Emite al padre para que muestre el botón de autorización
   */
  onCustomAmountSelected(isCustom) {
    console.log("[DynamicField] Custom amount selected:", isCustom);
    this.customAmountDetected.emit(isCustom);
  }
};
_DynamicFieldRendererComponent.\u0275fac = function DynamicFieldRendererComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _DynamicFieldRendererComponent)();
};
_DynamicFieldRendererComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _DynamicFieldRendererComponent, selectors: [["app-dynamic-field-renderer"]], inputs: { schema: [1, "schema"], externalUpdates: [1, "externalUpdates"], selectedClassification: [1, "selectedClassification"], customerAmounts: [1, "customerAmounts"] }, outputs: { dataChange: "dataChange", customAmountDetected: "customAmountDetected" }, decls: 1, vars: 1, consts: [[1, "bg-purple-50", "dark:bg-purple-950/20", "border", "border-purple-200", "dark:border-purple-900/50", "rounded-lg", "shadow-md", "p-3"], [1, "flex", "items-center", "gap-2", "text-purple-800", "dark:text-purple-200", "mb-3", "pb-2", "border-b", "border-purple-200", "dark:border-purple-800"], [1, "font-bold", "text-xs", "uppercase", "tracking-wide"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "gap-3"], [3, "md:col-span-2"], [1, "text-[11px]", "font-bold", "text-gray-800", "dark:text-gray-100", "mb-1", "flex", "items-center", "gap-1"], [1, "text-red-500", "text-xs"], [1, "text-[9px]", "text-gray-500", "dark:text-gray-400", "mb-1", "italic"], ["type", "text", 1, "w-full", "px-2", "py-1.5", "text-xs", "border", "border-gray-300", "dark:border-gray-600", "rounded", "focus:ring-1", "focus:ring-purple-500", "focus:border-purple-500", "bg-white", "dark:bg-slate-800", "text-gray-900", "dark:text-gray-100", 3, "ngModel", "placeholder", "required", "minlength", "maxlength"], ["type", "number", 1, "w-full", "px-2", "py-1.5", "text-xs", "border", "border-gray-300", "dark:border-gray-600", "rounded", "focus:ring-1", "focus:ring-purple-500", "focus:border-purple-500", "bg-white", "dark:bg-slate-800", "text-gray-900", "dark:text-gray-100", 3, "ngModel", "placeholder", "required", "min", "max"], [1, "relative"], ["type", "date", 1, "w-full", "px-2", "py-1.5", "text-xs", "border", "border-gray-300", "dark:border-gray-600", "rounded", "focus:ring-1", "focus:ring-purple-500", "focus:border-purple-500", "bg-white", "dark:bg-slate-800", "text-gray-900", "dark:text-gray-100", 3, "ngModel", "required"], ["type", "datetime-local", 1, "w-full", "px-2", "py-1.5", "text-xs", "border", "border-gray-300", "dark:border-gray-600", "rounded", "focus:ring-1", "focus:ring-purple-500", "focus:border-purple-500", "bg-white", "dark:bg-slate-800", "text-gray-900", "dark:text-gray-100", 3, "ngModel", "required"], [1, "w-full", "px-2", "py-1.5", "text-xs", "border", "border-gray-300", "dark:border-gray-600", "rounded", "focus:ring-1", "focus:ring-purple-500", "focus:border-purple-500", "bg-white", "dark:bg-slate-800", "text-gray-900", "dark:text-gray-100", 3, "ngModel", "required"], ["rows", "2", 1, "w-full", "px-2", "py-1.5", "text-xs", "border", "border-gray-300", "dark:border-gray-600", "rounded", "focus:ring-1", "focus:ring-purple-500", "focus:border-purple-500", "resize-none", "bg-white", "dark:bg-slate-800", "text-gray-900", "dark:text-gray-100", 3, "ngModel", "placeholder", "required", "minlength", "maxlength"], [1, "flex", "items-center", "gap-2"], ["type", "time", 1, "w-full", "px-2", "py-1.5", "text-xs", "border", "border-gray-300", "dark:border-gray-600", "rounded", "focus:ring-1", "focus:ring-purple-500", "focus:border-purple-500", "bg-white", "dark:bg-slate-800", "text-gray-900", "dark:text-gray-100", 3, "ngModel", "required"], ["type", "email", 1, "w-full", "px-2", "py-1.5", "text-xs", "border", "border-gray-300", "dark:border-gray-600", "rounded", "focus:ring-1", "focus:ring-purple-500", "focus:border-purple-500", "bg-white", "dark:bg-slate-800", "text-gray-900", "dark:text-gray-100", 3, "ngModel", "placeholder", "required"], ["type", "url", 1, "w-full", "px-2", "py-1.5", "text-xs", "border", "border-gray-300", "dark:border-gray-600", "rounded", "focus:ring-1", "focus:ring-purple-500", "focus:border-purple-500", "bg-white", "dark:bg-slate-800", "text-gray-900", "dark:text-gray-100", 3, "ngModel", "placeholder", "required"], [3, "availableAmounts", "maxInstallments"], [1, "rounded-lg", "border", "border-purple-200", "dark:border-purple-800/50", "overflow-hidden", "shadow-sm"], ["type", "text", 1, "w-full", "px-2", "py-1.5", "text-xs", "border", "border-gray-300", "dark:border-gray-600", "rounded", "focus:ring-1", "focus:ring-purple-500", "focus:border-purple-500", "bg-white", "dark:bg-slate-800", "text-gray-900", "dark:text-gray-100", 3, "ngModelChange", "ngModel", "placeholder", "required", "minlength", "maxlength"], ["type", "number", 1, "w-full", "px-2", "py-1.5", "text-xs", "border", "border-gray-300", "dark:border-gray-600", "rounded", "focus:ring-1", "focus:ring-purple-500", "focus:border-purple-500", "bg-white", "dark:bg-slate-800", "text-gray-900", "dark:text-gray-100", 3, "ngModelChange", "ngModel", "placeholder", "required", "min", "max"], [1, "absolute", "left-2", "top-1/2", "-translate-y-1/2", "text-[10px]", "text-gray-500", "dark:text-gray-400", "font-semibold"], ["type", "number", "step", "0.01", 1, "w-full", "pl-7", "pr-2", "py-1.5", "text-xs", "border", "border-gray-300", "dark:border-gray-600", "rounded", "focus:ring-1", "focus:ring-purple-500", "focus:border-purple-500", "bg-white", "dark:bg-slate-800", "text-gray-900", "dark:text-gray-100", 3, "ngModelChange", "ngModel", "placeholder", "required", "min"], ["type", "date", 1, "w-full", "px-2", "py-1.5", "text-xs", "border", "border-gray-300", "dark:border-gray-600", "rounded", "focus:ring-1", "focus:ring-purple-500", "focus:border-purple-500", "bg-white", "dark:bg-slate-800", "text-gray-900", "dark:text-gray-100", 3, "ngModelChange", "ngModel", "required"], ["type", "datetime-local", 1, "w-full", "px-2", "py-1.5", "text-xs", "border", "border-gray-300", "dark:border-gray-600", "rounded", "focus:ring-1", "focus:ring-purple-500", "focus:border-purple-500", "bg-white", "dark:bg-slate-800", "text-gray-900", "dark:text-gray-100", 3, "ngModelChange", "ngModel", "required"], [1, "w-full", "px-2", "py-1.5", "text-xs", "border", "border-gray-300", "dark:border-gray-600", "rounded", "focus:ring-1", "focus:ring-purple-500", "focus:border-purple-500", "bg-white", "dark:bg-slate-800", "text-gray-900", "dark:text-gray-100", 3, "ngModelChange", "ngModel", "required"], ["value", ""], [3, "value"], ["rows", "2", 1, "w-full", "px-2", "py-1.5", "text-xs", "border", "border-gray-300", "dark:border-gray-600", "rounded", "focus:ring-1", "focus:ring-purple-500", "focus:border-purple-500", "resize-none", "bg-white", "dark:bg-slate-800", "text-gray-900", "dark:text-gray-100", 3, "ngModelChange", "ngModel", "placeholder", "required", "minlength", "maxlength"], ["type", "checkbox", 1, "w-4", "h-4", "text-purple-600", "bg-gray-100", "dark:bg-gray-700", "border-gray-300", "dark:border-gray-600", "rounded", "focus:ring-purple-500", "cursor-pointer", 3, "ngModelChange", "ngModel", "required"], [1, "text-xs", "text-gray-700", "dark:text-gray-300"], ["type", "tel", "pattern", "[0-9]{9}", "maxlength", "9", 1, "w-full", "pl-7", "pr-2", "py-1.5", "text-xs", "border", "border-gray-300", "dark:border-gray-600", "rounded", "focus:ring-1", "focus:ring-purple-500", "focus:border-purple-500", "bg-white", "dark:bg-slate-800", "text-gray-900", "dark:text-gray-100", 3, "ngModelChange", "ngModel", "placeholder", "required"], ["type", "time", 1, "w-full", "px-2", "py-1.5", "text-xs", "border", "border-gray-300", "dark:border-gray-600", "rounded", "focus:ring-1", "focus:ring-purple-500", "focus:border-purple-500", "bg-white", "dark:bg-slate-800", "text-gray-900", "dark:text-gray-100", 3, "ngModelChange", "ngModel", "required"], ["type", "email", 1, "w-full", "px-2", "py-1.5", "text-xs", "border", "border-gray-300", "dark:border-gray-600", "rounded", "focus:ring-1", "focus:ring-purple-500", "focus:border-purple-500", "bg-white", "dark:bg-slate-800", "text-gray-900", "dark:text-gray-100", 3, "ngModelChange", "ngModel", "placeholder", "required"], ["type", "url", 1, "w-full", "px-2", "py-1.5", "text-xs", "border", "border-gray-300", "dark:border-gray-600", "rounded", "focus:ring-1", "focus:ring-purple-500", "focus:border-purple-500", "bg-white", "dark:bg-slate-800", "text-gray-900", "dark:text-gray-100", 3, "ngModelChange", "ngModel", "placeholder", "required"], [3, "scheduleChange", "customAmountSelected", "availableAmounts", "maxInstallments"], [1, "overflow-x-auto"], [1, "w-full", "border-collapse"], [1, "bg-gradient-to-r", "from-purple-50", "to-purple-100", "dark:from-purple-950/50", "dark:to-purple-900/30"], [1, "px-3", "py-2", "text-left", "text-[10px]", "font-bold", "text-purple-900", "dark:text-purple-200", "uppercase", "tracking-wide", "border-b-2", "border-purple-300", "dark:border-purple-700"], [1, "px-3", "py-2", "text-center", "text-[10px]", "font-bold", "text-purple-900", "dark:text-purple-200", "uppercase", "tracking-wide", "border-b-2", "border-purple-300", "dark:border-purple-700", "w-16"], [1, "bg-white", "dark:bg-slate-800"], [1, "border-b", "border-purple-100", "dark:border-purple-900/30", "hover:bg-purple-50/50", "dark:hover:bg-purple-950/20", "transition-colors"], [1, "border-t", "border-purple-300", "dark:border-purple-700", "p-2", "from-purple-100/70", "to-white", "dark:from-purple-950/40", "dark:to-purple-800/60"], [1, "text-red-500", "ml-0.5"], [1, "px-3", "py-2"], [1, "px-3", "py-2", "text-center"], [1, "flex", "items-center", "justify-center", "w-7", "h-7", "rounded-full", "bg-purple-100", "dark:bg-purple-900/30", "text-[11px]", "font-bold", "text-purple-700", "dark:text-purple-300"], ["type", "text", 1, "w-full", "px-2", "py-1", "text-[11px]", "border", "border-purple-200", "dark:border-purple-800", "rounded", "focus:ring-1", "focus:ring-purple-500", "focus:border-purple-500", "bg-white", "dark:bg-slate-900", "text-gray-900", "dark:text-gray-100", 3, "ngModel", "required"], ["type", "number", 1, "w-full", "px-2", "py-1", "text-[11px]", "border", "border-purple-200", "dark:border-purple-800", "rounded", "focus:ring-1", "focus:ring-purple-500", "focus:border-purple-500", "bg-white", "dark:bg-slate-900", "text-gray-900", "dark:text-gray-100", 3, "ngModel", "required"], ["type", "date", 1, "w-full", "px-2", "py-1", "text-[11px]", "border", "border-purple-200", "dark:border-purple-800", "rounded", "focus:ring-1", "focus:ring-purple-500", "focus:border-purple-500", "bg-white", "dark:bg-slate-900", "text-gray-900", "dark:text-gray-100", 3, "ngModel", "required", "min", "max"], ["type", "time", 1, "w-full", "px-2", "py-1", "text-[11px]", "border", "border-purple-200", "dark:border-purple-800", "rounded", "focus:ring-1", "focus:ring-purple-500", "focus:border-purple-500", "bg-white", "dark:bg-slate-900", "text-gray-900", "dark:text-gray-100", 3, "ngModel", "required"], ["type", "tel", "pattern", "[0-9]{9}", "maxlength", "9", "placeholder", "999999999", 1, "w-full", "px-2", "py-1", "text-[11px]", "border", "border-purple-200", "dark:border-purple-800", "rounded", "focus:ring-1", "focus:ring-purple-500", "focus:border-purple-500", "bg-white", "dark:bg-slate-900", "text-gray-900", "dark:text-gray-100", 3, "ngModel", "required"], [1, "w-full", "px-2", "py-1", "text-[11px]", "border", "border-purple-200", "dark:border-purple-800", "rounded", "focus:ring-1", "focus:ring-purple-500", "focus:border-purple-500", "bg-white", "dark:bg-slate-900", "text-gray-900", "dark:text-gray-100", 3, "ngModel", "required"], ["type", "text", 1, "w-full", "px-2", "py-1", "text-[11px]", "border", "border-purple-200", "dark:border-purple-800", "rounded", "focus:ring-1", "focus:ring-purple-500", "focus:border-purple-500", "bg-white", "dark:bg-slate-900", "text-gray-900", "dark:text-gray-100", 3, "ngModelChange", "ngModel", "required"], ["type", "number", 1, "w-full", "px-2", "py-1", "text-[11px]", "border", "border-purple-200", "dark:border-purple-800", "rounded", "focus:ring-1", "focus:ring-purple-500", "focus:border-purple-500", "bg-white", "dark:bg-slate-900", "text-gray-900", "dark:text-gray-100", 3, "ngModelChange", "ngModel", "required"], [1, "absolute", "left-2", "top-1/2", "-translate-y-1/2", "text-[10px]", "text-purple-600", "dark:text-purple-400", "font-semibold"], ["type", "number", "step", "0.01", 1, "w-full", "pl-6", "pr-2", "py-1", "text-[11px]", "border", "border-purple-200", "dark:border-purple-800", "rounded", "focus:ring-1", "focus:ring-purple-500", "focus:border-purple-500", "bg-white", "dark:bg-slate-900", "text-gray-900", "dark:text-gray-100", 3, "ngModelChange", "ngModel", "required"], ["type", "date", 1, "w-full", "px-2", "py-1", "text-[11px]", "border", "border-purple-200", "dark:border-purple-800", "rounded", "focus:ring-1", "focus:ring-purple-500", "focus:border-purple-500", "bg-white", "dark:bg-slate-900", "text-gray-900", "dark:text-gray-100", 3, "ngModelChange", "ngModel", "required", "min", "max"], ["type", "time", 1, "w-full", "px-2", "py-1", "text-[11px]", "border", "border-purple-200", "dark:border-purple-800", "rounded", "focus:ring-1", "focus:ring-purple-500", "focus:border-purple-500", "bg-white", "dark:bg-slate-900", "text-gray-900", "dark:text-gray-100", 3, "ngModelChange", "ngModel", "required"], ["type", "tel", "pattern", "[0-9]{9}", "maxlength", "9", "placeholder", "999999999", 1, "w-full", "px-2", "py-1", "text-[11px]", "border", "border-purple-200", "dark:border-purple-800", "rounded", "focus:ring-1", "focus:ring-purple-500", "focus:border-purple-500", "bg-white", "dark:bg-slate-900", "text-gray-900", "dark:text-gray-100", 3, "ngModelChange", "ngModel", "required"], [1, "w-full", "px-2", "py-1", "text-[11px]", "border", "border-purple-200", "dark:border-purple-800", "rounded", "focus:ring-1", "focus:ring-purple-500", "focus:border-purple-500", "bg-white", "dark:bg-slate-900", "text-gray-900", "dark:text-gray-100", 3, "ngModelChange", "ngModel", "required"], ["type", "button", "title", "Eliminar fila", 1, "inline-flex", "items-center", "justify-center", "w-7", "h-7", "rounded-full", "hover:bg-red-50", "dark:hover:bg-red-900/20", "text-red-500", "hover:text-red-700", "dark:text-red-400", "dark:hover:text-red-300", "transition-colors", 3, "click"], [1, "px-4", "py-12", "text-center"], [1, "flex", "flex-col", "items-center", "gap-2"], [1, "w-12", "h-12", "rounded-full", "bg-purple-100", "dark:bg-purple-900/30", "flex", "items-center", "justify-center"], [1, "text-[11px]", "text-gray-500", "dark:text-gray-400", "font-medium"], [1, "text-[10px]", "text-gray-400", "dark:text-gray-500"], ["type", "button", 1, "w-full", "py-1.5", "px-3", "border", "border-dashed", "border-purple-400", "dark:border-purple-600", "rounded-lg", "text-purple-900/50", "dark:text-purple-300", "hover:bg-purple-100", "dark:hover:bg-purple-900/50", "hover:border-purple-600", "dark:hover:border-purple-400", "transition-all", "flex", "items-center", "justify-center", "gap-2", "text-[11px]", "font-semibold", 3, "click"]], template: function DynamicFieldRendererComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, DynamicFieldRendererComponent_Conditional_0_Template, 7, 0, "div", 0);
  }
  if (rf & 2) {
    \u0275\u0275conditional(ctx.schema() && ctx.schema().fields && ctx.schema().fields.length > 0 ? 0 : -1);
  }
}, dependencies: [CommonModule, FormsModule, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, NumberValueAccessor, CheckboxControlValueAccessor, SelectControlValueAccessor, NgControlStatus, RequiredValidator, MinLengthValidator, MaxLengthValidator, PatternValidator, CheckboxRequiredValidator, MinValidator, MaxValidator, NgModel, PaymentScheduleComponent], styles: ["\n\n[_nghost-%COMP%] {\n  display: contents;\n}\n/*# sourceMappingURL=dynamic-field-renderer.component.css.map */"] });
var DynamicFieldRendererComponent = _DynamicFieldRendererComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DynamicFieldRendererComponent, [{
    type: Component,
    args: [{ selector: "app-dynamic-field-renderer", standalone: true, imports: [CommonModule, FormsModule, PaymentScheduleComponent], template: `
    @if (schema() && schema()!.fields && schema()!.fields.length > 0) {
      <div class="bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/50 rounded-lg shadow-md p-3">
        <!-- Header -->
        <div class="flex items-center gap-2 text-purple-800 dark:text-purple-200 mb-3 pb-2 border-b border-purple-200 dark:border-purple-800">
          <h3 class="font-bold text-xs uppercase tracking-wide">Campos Adicionales</h3>
        </div>

        <!-- Dynamic Fields in Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          @for (field of schema()!.fields; track field.id) {
            <div [class.md:col-span-2]="field.type === 'table' || field.type === 'textarea' || field.type === 'payment_schedule'">
              <label class="text-[11px] font-bold text-gray-800 dark:text-gray-100 mb-1 flex items-center gap-1">
                {{ field.label }}
                @if (field.required) {
                  <span class="text-red-500 text-xs">*</span>
                }
              </label>

              @if (field.helpText) {
                <p class="text-[9px] text-gray-500 dark:text-gray-400 mb-1 italic">{{ field.helpText }}</p>
              }

              <!-- Text Input -->
              @if (field.type === 'text') {
                <input
                  type="text"
                  [(ngModel)]="fieldData()[field.id]"
                  [placeholder]="field.placeholder || ''"
                  [required]="field.required ?? false"
                  [minlength]="field.minLength ?? null"
                  [maxlength]="field.maxLength ?? null"
                  class="w-full px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
                />
              }

              <!-- Number Input -->
              @if (field.type === 'number') {
                <input
                  type="number"
                  [ngModel]="fieldData()[field.id]"
                  (ngModelChange)="updateFieldValue(field.id, $event)"
                  [placeholder]="field.placeholder || ''"
                  [required]="field.required ?? false"
                  [min]="field.min ?? null"
                  [max]="field.max ?? null"
                  class="w-full px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
                />
              }

              <!-- Currency Input -->
              @if (field.type === 'currency') {
                <div class="relative">
                  <span class="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-500 dark:text-gray-400 font-semibold">S/</span>
                  <input
                    type="number"
                    [ngModel]="fieldData()[field.id]"
                    (ngModelChange)="updateFieldValue(field.id, $event)"
                    [placeholder]="field.placeholder || '0.00'"
                    [required]="field.required ?? false"
                    [min]="field.min || 0"
                    step="0.01"
                    class="w-full pl-7 pr-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
                  />
                </div>
              }

              <!-- Date Input -->
              @if (field.type === 'date') {
                <input
                  type="date"
                  [(ngModel)]="fieldData()[field.id]"
                  [required]="field.required ?? false"
                  class="w-full px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
                />
              }

              <!-- DateTime Input -->
              @if (field.type === 'datetime') {
                <input
                  type="datetime-local"
                  [(ngModel)]="fieldData()[field.id]"
                  [required]="field.required ?? false"
                  class="w-full px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
                />
              }

              <!-- Select Input -->
              @if (field.type === 'select') {
                <select
                  [(ngModel)]="fieldData()[field.id]"
                  [required]="field.required ?? false"
                  class="w-full px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
                >
                  <option value="">-- Seleccionar --</option>
                  @for (option of field.options; track option.value) {
                    <option [value]="option.value">{{ option.label }}</option>
                  }
                </select>
              }

              <!-- Textarea Input -->
              @if (field.type === 'textarea') {
                <textarea
                  [(ngModel)]="fieldData()[field.id]"
                  [placeholder]="field.placeholder || ''"
                  [required]="field.required ?? false"
                  [minlength]="field.minLength ?? null"
                  [maxlength]="field.maxLength ?? null"
                  rows="2"
                  class="w-full px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-purple-500 focus:border-purple-500 resize-none bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
                ></textarea>
              }

              <!-- Checkbox Input -->
              @if (field.type === 'checkbox') {
                <div class="flex items-center gap-2">
                  <input
                    type="checkbox"
                    [(ngModel)]="fieldData()[field.id]"
                    [required]="field.required ?? false"
                    class="w-4 h-4 text-purple-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-purple-500 cursor-pointer"
                  />
                  <span class="text-xs text-gray-700 dark:text-gray-300">{{ field.placeholder || 'Marcar si aplica' }}</span>
                </div>
              }

              <!-- Phone Input -->
              @if (field.type === 'phone') {
                <div class="relative">
                  <span class="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-500 dark:text-gray-400 font-semibold">\u{1F4F1}</span>
                  <input
                    type="tel"
                    [(ngModel)]="fieldData()[field.id]"
                    [placeholder]="field.placeholder || '999 999 999'"
                    [required]="field.required ?? false"
                    pattern="[0-9]{9}"
                    maxlength="9"
                    class="w-full pl-7 pr-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
                  />
                </div>
              }

              <!-- Time Input -->
              @if (field.type === 'time') {
                <input
                  type="time"
                  [(ngModel)]="fieldData()[field.id]"
                  [required]="field.required ?? false"
                  class="w-full px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
                />
              }

              <!-- Email Input -->
              @if (field.type === 'email') {
                <input
                  type="email"
                  [(ngModel)]="fieldData()[field.id]"
                  [placeholder]="field.placeholder || 'ejemplo@correo.com'"
                  [required]="field.required ?? false"
                  class="w-full px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
                />
              }

              <!-- URL Input -->
              @if (field.type === 'url') {
                <input
                  type="url"
                  [(ngModel)]="fieldData()[field.id]"
                  [placeholder]="field.placeholder || 'https://ejemplo.com'"
                  [required]="field.required ?? false"
                  class="w-full px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
                />
              }

              <!-- Payment Schedule Input -->
              @if (field.type === 'payment_schedule') {
                <app-payment-schedule
                  [availableAmounts]="getPaymentAmountOptions(field)"
                  [maxInstallments]="6"
                  (scheduleChange)="onPaymentScheduleChange(field.id, $event)"
                  (customAmountSelected)="onCustomAmountSelected($event)"
                />
              }

            <!-- Table/Cronograma Input -->
            @if (field.type === 'table') {
              <div class="rounded-lg border border-purple-200 dark:border-purple-800/50 overflow-hidden shadow-sm">
                <!-- Table Header -->
                <div class="overflow-x-auto">
                  <table class="w-full border-collapse">
                    <thead>
                      <tr class="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/30">
                        @for (column of field.columns; track column.id) {
                          <th class="px-3 py-2 text-left text-[10px] font-bold text-purple-900 dark:text-purple-200 uppercase tracking-wide border-b-2 border-purple-300 dark:border-purple-700">
                            {{ column.label }}
                            @if (column.required) {
                              <span class="text-red-500 ml-0.5">*</span>
                            }
                          </th>
                        }
                        @if (field.allowDeleteRow) {
                          <th class="px-3 py-2 text-center text-[10px] font-bold text-purple-900 dark:text-purple-200 uppercase tracking-wide border-b-2 border-purple-300 dark:border-purple-700 w-16">
                          </th>
                        }
                      </tr>
                    </thead>
                    <tbody class="bg-white dark:bg-slate-800">
                      @for (row of getTableRows(field.id); track $index; let rowIdx = $index) {
                        <tr class="border-b border-purple-100 dark:border-purple-900/30 hover:bg-purple-50/50 dark:hover:bg-purple-950/20 transition-colors">
                          @for (column of field.columns; track column.id) {
                            <td class="px-3 py-2">
                              <!-- Auto-number column -->
                              @if (column.type === 'auto-number') {
                                <div class="flex items-center justify-center w-7 h-7 rounded-full bg-purple-100 dark:bg-purple-900/30 text-[11px] font-bold text-purple-700 dark:text-purple-300">
                                  {{ rowIdx + 1 }}
                                </div>
                              }
                              <!-- Text column -->
                              @else if (column.type === 'text') {
                                <input
                                  type="text"
                                  [(ngModel)]="row[column.id]"
                                  [required]="column.required ?? false"
                                  class="w-full px-2 py-1 text-[11px] border border-purple-200 dark:border-purple-800 rounded focus:ring-1 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100"
                                />
                              }
                              <!-- Number column -->
                              @else if (column.type === 'number') {
                                <input
                                  type="number"
                                  [(ngModel)]="row[column.id]"
                                  [required]="column.required ?? false"
                                  class="w-full px-2 py-1 text-[11px] border border-purple-200 dark:border-purple-800 rounded focus:ring-1 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100"
                                />
                              }
                              <!-- Currency column -->
                              @else if (column.type === 'currency') {
                                <div class="relative">
                                  <span class="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-purple-600 dark:text-purple-400 font-semibold">S/</span>
                                  <input
                                    type="number"
                                    [(ngModel)]="row[column.id]"
                                    [required]="column.required ?? false"
                                    step="0.01"
                                    class="w-full pl-6 pr-2 py-1 text-[11px] border border-purple-200 dark:border-purple-800 rounded focus:ring-1 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100"
                                  />
                                </div>
                              }
                              <!-- Date column -->
                              @else if (column.type === 'date') {
                                <input
                                  type="date"
                                  [(ngModel)]="row[column.id]"
                                  [required]="column.required ?? false"
                                  [min]="getMinDate(column)"
                                  [max]="getMaxDate(column)"
                                  class="w-full px-2 py-1 text-[11px] border border-purple-200 dark:border-purple-800 rounded focus:ring-1 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100"
                                />
                              }
                              <!-- Time column -->
                              @else if (column.type === 'time') {
                                <input
                                  type="time"
                                  [(ngModel)]="row[column.id]"
                                  [required]="column.required ?? false"
                                  class="w-full px-2 py-1 text-[11px] border border-purple-200 dark:border-purple-800 rounded focus:ring-1 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100"
                                />
                              }
                              <!-- Phone column -->
                              @else if (column.type === 'phone') {
                                <input
                                  type="tel"
                                  [(ngModel)]="row[column.id]"
                                  [required]="column.required ?? false"
                                  pattern="[0-9]{9}"
                                  maxlength="9"
                                  placeholder="999999999"
                                  class="w-full px-2 py-1 text-[11px] border border-purple-200 dark:border-purple-800 rounded focus:ring-1 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100"
                                />
                              }
                              <!-- Select column -->
                              @else if (column.type === 'select') {
                                <select
                                  [(ngModel)]="row[column.id]"
                                  [required]="column.required ?? false"
                                  class="w-full px-2 py-1 text-[11px] border border-purple-200 dark:border-purple-800 rounded focus:ring-1 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100"
                                >
                                  <option value="">Seleccionar...</option>
                                  @for (option of column.options; track option.value || option) {
                                    <option [value]="option.value || option">
                                      {{ option.label || option }}
                                    </option>
                                  }
                                </select>
                              }
                            </td>
                          }
                          @if (field.allowDeleteRow) {
                            <td class="px-3 py-2 text-center">
                              <button
                                type="button"
                                (click)="removeTableRow(field.id, rowIdx)"
                                class="inline-flex items-center justify-center w-7 h-7 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                                title="Eliminar fila"
                              >
                              </button>
                            </td>
                          }
                        </tr>
                      }
                      @if (getTableRows(field.id).length === 0) {
                        <tr>
                          <td [attr.colspan]="field.columns!.length + (field.allowDeleteRow ? 1 : 0)" class="px-4 py-12 text-center">
                            <div class="flex flex-col items-center gap-2">
                              <div class="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                              </div>
                              <p class="text-[11px] text-gray-500 dark:text-gray-400 font-medium">No hay registros en la tabla</p>
                              <p class="text-[10px] text-gray-400 dark:text-gray-500">Haz clic en "Agregar Fila" para comenzar</p>
                            </div>
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>

                <!-- Add Row Button -->
                @if (field.allowAddRow && (!field.maxRows || getTableRows(field.id).length < field.maxRows)) {
                  <div class="border-t border-purple-300 dark:border-purple-700 p-2  from-purple-100/70 to-white dark:from-purple-950/40 dark:to-purple-800/60">
                    <button
                      type="button"
                      (click)="addTableRow(field.id, field.columns || [])"
                      class="w-full py-1.5 px-3 border border-dashed border-purple-400 dark:border-purple-600 rounded-lg 
                            text-purple-900/50  dark:text-purple-300 
                            hover:bg-purple-100 dark:hover:bg-purple-900/50 
                            hover:border-purple-600 dark:hover:border-purple-400 
                            transition-all flex items-center justify-center gap-2 text-[11px] font-semibold"
                    >
                      Agregar Fila
                    </button>
                  </div>
                }
              </div>
            }
            </div>
          }
        </div>
      </div>
    }
  `, styles: ["/* angular:styles/component:css;93756b56e987a68945ac88192773c1a2bb21a2d9096208e7060585053fff0968;C:/Users/HP/Documents/Kubito-2.0-v1/cashi-discador-frontend/cashi-discador-frontend/src/app/collection-management/components/dynamic-field-renderer/dynamic-field-renderer.component.ts */\n:host {\n  display: contents;\n}\n/*# sourceMappingURL=dynamic-field-renderer.component.css.map */\n"] }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(DynamicFieldRendererComponent, { className: "DynamicFieldRendererComponent", filePath: "src/app/collection-management/components/dynamic-field-renderer/dynamic-field-renderer.component.ts", lineNumber: 374 });
})();

// src/app/collection-management/services/api-system-config.service.ts
var _ApiSystemConfigService = class _ApiSystemConfigService {
  constructor(http) {
    this.http = http;
    this.baseUrl = `${environment.tipificacionUrl}/system-config`;
    this.classificationsUrl = `${environment.tipificacionUrl}/typifications`;
    this.contactClassifications = signal([], ...ngDevMode ? [{ debugName: "contactClassifications" }] : []);
    this.managementClassifications = signal([], ...ngDevMode ? [{ debugName: "managementClassifications" }] : []);
    this.campaigns = signal([], ...ngDevMode ? [{ debugName: "campaigns" }] : []);
    this.tenantClassifications = signal([], ...ngDevMode ? [{ debugName: "tenantClassifications" }] : []);
    this.isLoading = signal(false, ...ngDevMode ? [{ debugName: "isLoading" }] : []);
    this.isLoaded = signal(false, ...ngDevMode ? [{ debugName: "isLoaded" }] : []);
  }
  /**
   * Configura el tenant, portfolio y subportfolio actual y recarga las clasificaciones
   */
  setTenantAndPortfolio(tenantId, portfolioId, subPortfolioId) {
    this.tenantClassifications.set([]);
    this.contactClassifications.set([]);
    this.managementClassifications.set([]);
    this.currentTenantId = tenantId;
    this.currentPortfolioId = portfolioId;
    this.currentSubPortfolioId = subPortfolioId;
    this.loadTenantClassifications();
    this.loadTypificationsFromCatalog();
  }
  /**
   * Carga todos los datos del backend
   * Se ejecuta en segundo plano sin bloquear la UI
   */
  loadAllData() {
    this.isLoading.set(true);
    Promise.all([
      // this.loadContactClassifications(),
      // this.loadManagementClassifications(),
      // this.loadActiveCampaigns(),
      this.loadTenantClassifications(),
      this.loadTypificationsFromCatalog()
    ]).finally(() => {
      this.isLoading.set(false);
      this.isLoaded.set(true);
    });
  }
  /**
   * Carga tipificaciones desde el catálogo global
   * Filtra las tipificaciones CUSTOM que son específicas por tenant
   */
  loadTypificationsFromCatalog() {
    return new Promise((resolve) => {
      if (!this.currentTenantId) {
        console.warn("[V2] No se puede cargar tipificaciones sin tenant configurado");
        resolve();
        return;
      }
      const subportfolioParam = this.currentSubPortfolioId || 0;
      const portfolioParam = this.currentPortfolioId || 0;
      const url = `${environment.gatewayUrl}/v2/typifications/config/effective/tenant/${this.currentTenantId}/portfolio/${portfolioParam}/subportfolio/${subportfolioParam}`;
      console.log("[V2] Cargando tipificaciones efectivas desde:", url);
      this.http.get(url).pipe(tap((data) => {
        console.log("[V2] Tipificaciones efectivas cargadas:", data);
        const managementClasses = data.map((t) => ({
          id: t.id,
          codigo: t.codigo,
          label: t.nombre,
          requiresPayment: false,
          requiresSchedule: false,
          requiresFollowUp: false,
          parentId: t.parentTypificationId,
          hierarchyLevel: t.nivelJerarquia,
          suggestsFullAmount: t.suggestsFullAmount ?? null,
          allowsInstallmentSelection: t.allowsInstallmentSelection ?? null,
          requiresManualAmount: t.requiresManualAmount ?? null
        }));
        this.managementClassifications.set(managementClasses);
        console.log("[V2] Nivel 1:", managementClasses.filter((c) => c.hierarchyLevel === 1).map((c) => `${c.codigo} (${c.label})`));
        console.log("[V2] Nivel 2:", managementClasses.filter((c) => c.hierarchyLevel === 2).map((c) => `${c.codigo} -> parent:${c.parentId}`));
        console.log("[V2] Nivel 3:", managementClasses.filter((c) => c.hierarchyLevel === 3).map((c) => `${c.codigo} -> parent:${c.parentId}`));
        console.log("[V2] Nivel 4:", managementClasses.filter((c) => c.hierarchyLevel === 4).map((c) => `${c.codigo} -> parent:${c.parentId}`));
      }), catchError((error) => {
        console.error("[V2] Error cargando tipificaciones efectivas:", error);
        this.managementClassifications.set([]);
        return of([]);
      })).subscribe(() => resolve());
    });
  }
  /**
   * Carga clasificaciones habilitadas para el tenant/portfolio actual
   */
  loadTenantClassifications() {
    return new Promise((resolve) => {
      if (!this.currentTenantId) {
        resolve();
        return;
      }
      console.log("[TEMPORAL] loadTenantClassifications - endpoint /tenants/.../typifications no existe");
      const mockData = [];
      this.tenantClassifications.set(mockData);
      this.contactClassifications.set([]);
      this.managementClassifications.set([]);
      resolve();
      return;
    });
  }
  /**
   * Carga tipificaciones de contacto desde el backend
   */
  loadContactClassifications() {
    return new Promise((resolve) => {
      this.http.get(`${this.baseUrl}/contact-typifications`).pipe(tap((data) => {
        this.contactClassifications.set(data);
      }), catchError((error) => {
        console.error("Error cargando tipificaciones de contacto:", error);
        return of([]);
      })).subscribe(() => resolve());
    });
  }
  /**
   * Carga tipificaciones de gestión desde el backend
   */
  loadManagementClassifications() {
    return new Promise((resolve) => {
      this.http.get(`${this.baseUrl}/management-typifications`).pipe(tap((data) => {
        this.managementClassifications.set(data);
      }), catchError((error) => {
        console.error("Error cargando tipificaciones de gesti\xF3n:", error);
        return of([]);
      })).subscribe(() => resolve());
    });
  }
  /**
   * Carga campañas activas desde el backend
   */
  loadActiveCampaigns() {
    return new Promise((resolve) => {
      this.http.get(`${this.baseUrl}/campaigns/active`).pipe(tap((data) => {
        this.campaigns.set(data);
      }), catchError((error) => {
        console.error("Error cargando campa\xF1as:", error);
        return of([]);
      })).subscribe(() => resolve());
    });
  }
  /**
   * Fuerza la recarga de todos los datos
   */
  refresh() {
    this.loadAllData();
  }
  /**
   * Convierte las tipificaciones de contacto del backend al formato del frontend
   */
  getContactClassificationsForUI() {
    return this.contactClassifications().map((item) => ({
      id: item.codigo,
      codigo: item.codigo,
      label: item.label,
      // Ahora coincide con la interfaz
      isSuccessful: item.isSuccessful
    }));
  }
  /**
   * Convierte las tipificaciones de gestión del backend al formato del frontend
   */
  getManagementClassificationsForUI() {
    return this.managementClassifications().map((item) => ({
      id: String(item.id),
      // Usar el ID numérico como string para que funcione la jerarquía
      codigo: item.codigo,
      label: item.label,
      requiere_pago: item.requiresPayment,
      requiere_cronograma: item.requiresSchedule,
      requiere_seguimiento: item.requiresFollowUp,
      parentId: item.parentId,
      hierarchyLevel: item.hierarchyLevel,
      // Campos del tipo de clasificación
      suggestsFullAmount: item.suggestsFullAmount,
      allowsInstallmentSelection: item.allowsInstallmentSelection,
      requiresManualAmount: item.requiresManualAmount
    }));
  }
  /**
   * Obtiene la campaña activa principal
   */
  getActiveCampaign() {
    const campaigns = this.campaigns();
    return campaigns.length > 0 ? {
      id: campaigns[0].campaignId,
      nombre: campaigns[0].nombre,
      tipo: campaigns[0].campaignType
    } : null;
  }
  /**
   * Obtiene los campos dinámicos configurados para una clasificación específica
   * Solo las clasificaciones "hoja" (sin hijos) deberían tener campos
   */
  getClassificationFields(typificationId) {
    if (!this.currentTenantId) {
      throw new Error("No hay tenant configurado");
    }
    let url = `${environment.gatewayUrl}/v2/typifications/config/tenant/${this.currentTenantId}/typifications/${typificationId}/fields`;
    if (this.currentPortfolioId) {
      url += `?portfolioId=${this.currentPortfolioId}`;
    }
    console.log("[V2] Cargando campos din\xE1micos desde:", url);
    return this.http.get(url).pipe(tap((response) => {
      console.log("[V2] Campos din\xE1micos cargados:", response);
    }), catchError((error) => {
      console.error("[V2] Error cargando campos din\xE1micos:", error);
      return of({
        typificationId,
        isLeaf: false,
        fields: []
      });
    }));
  }
  /**
   * Obtiene todos los tipos de campo disponibles
   */
  getAllFieldTypes() {
    const url = `${environment.tipificacionUrl}/field-types`;
    return this.http.get(url).pipe(catchError((error) => {
      console.error("Error cargando tipos de campo:", error);
      return of([]);
    }));
  }
  /**
   * Obtiene tipos de campo disponibles para campos principales
   */
  getFieldTypesForMainFields() {
    const url = `${environment.tipificacionUrl}/field-types/main-fields`;
    return this.http.get(url).pipe(catchError((error) => {
      console.error("Error cargando tipos para campos principales:", error);
      return of([]);
    }));
  }
  /**
   * Obtiene tipos de campo disponibles para columnas de tabla
   */
  getFieldTypesForTableColumns() {
    const url = `${environment.tipificacionUrl}/field-types/table-columns`;
    return this.http.get(url).pipe(catchError((error) => {
      console.error("Error cargando tipos para columnas de tabla:", error);
      return of([]);
    }));
  }
};
_ApiSystemConfigService.\u0275fac = function ApiSystemConfigService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _ApiSystemConfigService)(\u0275\u0275inject(HttpClient));
};
_ApiSystemConfigService.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ApiSystemConfigService, factory: _ApiSystemConfigService.\u0275fac, providedIn: "root" });
var ApiSystemConfigService = _ApiSystemConfigService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ApiSystemConfigService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{ type: HttpClient }], null);
})();

// src/app/maintenance/services/typification-v2.service.ts
var _TypificationV2Service = class _TypificationV2Service {
  constructor(http) {
    this.http = http;
    this.catalogUrl = `${environment.gatewayUrl}/v2/typifications/catalog`;
    this.configUrl = `${environment.gatewayUrl}/v2/typifications/config`;
  }
  // ========================================
  // Catalog Management (V2)
  // ========================================
  getAllClassifications() {
    return this.http.get(`${this.catalogUrl}`);
  }
  getActiveClassifications() {
    return this.http.get(`${this.catalogUrl}/active`);
  }
  getTypificationsByType(type) {
    return this.http.get(`${this.catalogUrl}/type/${type}`);
  }
  getTypificationsByLevel(level) {
    return this.http.get(`${this.catalogUrl}/level/${level}`);
  }
  getTypificationsByParent(parentId) {
    return this.http.get(`${this.catalogUrl}/${parentId}/children`);
  }
  getClassificationById(id) {
    return this.http.get(`${this.catalogUrl}/${id}`);
  }
  getRootTypifications() {
    return this.http.get(`${this.catalogUrl}/roots`);
  }
  createTypification(command) {
    return this.http.post(`${this.catalogUrl}`, command);
  }
  updateTypification(id, command) {
    return this.http.put(`${this.catalogUrl}/${id}`, command);
  }
  deleteTypification(id) {
    return this.http.delete(`${this.catalogUrl}/${id}`);
  }
  activateTypification(id) {
    return this.http.put(`${this.catalogUrl}/${id}/activate`, {});
  }
  deactivateTypification(id) {
    return this.http.put(`${this.catalogUrl}/${id}/deactivate`, {});
  }
  // ========================================
  // Tenant Configuration Management (V2)
  // ========================================
  getTenantClassifications(tenantId, portfolioId, includeDisabled) {
    let params = new HttpParams();
    if (includeDisabled) {
      params = params.set("includeDisabled", "true");
    }
    if (portfolioId) {
      return this.http.get(`${this.configUrl}/tenant/${tenantId}/portfolio/${portfolioId}`, { params });
    } else {
      return this.http.get(`${this.configUrl}/tenant/${tenantId}`, { params });
    }
  }
  getTenantClassificationsByType(tenantId, type, portfolioId) {
    let params = new HttpParams();
    if (portfolioId) {
      params = params.set("portfolioId", portfolioId.toString());
    }
    return this.http.get(`${this.configUrl}/tenant/${tenantId}/type/${type}`, { params });
  }
  getEffectiveTypifications(tenantId, portfolioId, subPortfolioId) {
    return this.http.get(`${this.configUrl}/effective/tenant/${tenantId}/portfolio/${portfolioId}/subportfolio/${subPortfolioId}`);
  }
  updateTenantTypificationConfig(configId, command) {
    return this.http.put(`${this.configUrl}/${configId}`, command);
  }
  enableClassification(tenantId, typificationId, portfolioId, subPortfolioId, userId) {
    const params = new HttpParams().set("userId", userId?.toString() || "1");
    if (subPortfolioId && portfolioId) {
      return this.http.post(`${this.configUrl}/tenant/${tenantId}/portfolio/${portfolioId}/subportfolio/${subPortfolioId}/typification/${typificationId}/enable`, {}, { params });
    } else if (portfolioId) {
      return this.http.post(`${this.configUrl}/tenant/${tenantId}/portfolio/${portfolioId}/typification/${typificationId}/enable`, {}, { params });
    } else {
      return this.http.post(`${this.configUrl}/tenant/${tenantId}/typification/${typificationId}/enable`, {}, { params });
    }
  }
  disableClassification(tenantId, typificationId, portfolioId, subPortfolioId, userId) {
    const params = new HttpParams().set("userId", userId?.toString() || "1");
    if (subPortfolioId && portfolioId) {
      return this.http.post(`${this.configUrl}/tenant/${tenantId}/portfolio/${portfolioId}/subportfolio/${subPortfolioId}/typification/${typificationId}/disable`, {}, { params });
    } else if (portfolioId) {
      return this.http.post(`${this.configUrl}/tenant/${tenantId}/portfolio/${portfolioId}/typification/${typificationId}/disable`, {}, { params });
    } else {
      return this.http.post(`${this.configUrl}/tenant/${tenantId}/typification/${typificationId}/disable`, {}, { params });
    }
  }
  // ========================================
  // Tenant & Portfolio Management
  // ========================================
  getAllTenants() {
    return this.http.get(`${environment.webServiceUrl}/v1/system-config/tenants`);
  }
  getPortfoliosByTenant(tenantId) {
    return this.http.get(`${environment.webServiceUrl}/v1/system-config/tenants/${tenantId}/portfolios`);
  }
  getSubPortfoliosByPortfolio(portfolioId) {
    return this.http.get(`${this.configUrl}/portfolios/${portfolioId}/subportfolios`);
  }
  // ========================================
  // Additional Fields
  // ========================================
  getAdditionalFields(typificationId) {
    return this.http.get(`${this.catalogUrl}/${typificationId}/additional-fields`);
  }
  saveAdditionalFields(typificationId, fields) {
    return this.http.put(`${this.catalogUrl}/${typificationId}/additional-fields`, fields);
  }
  /**
   * Obtiene los campos adicionales de una tipificación con valores dinámicos desde la tabla del cliente
   * @param tenantId ID del tenant
   * @param typificationId ID de la tipificación
   * @param portfolioId ID del portfolio (opcional)
   * @param clientId ID del cliente (opcional, para cargar valores dinámicos)
   */
  getTypificationFieldsWithValues(tenantId, typificationId, portfolioId, clientId) {
    let params = new HttpParams();
    if (portfolioId) {
      params = params.set("portfolioId", portfolioId.toString());
    }
    if (clientId) {
      params = params.set("clientId", clientId.toString());
    }
    return this.http.get(`${this.configUrl}/tenant/${tenantId}/typifications/${typificationId}/fields`, { params });
  }
  /**
   * Obtiene las columnas numéricas disponibles en la tabla dinámica de una subcartera
   * @param tenantId ID del tenant
   * @param portfolioId ID del portfolio
   * @param subPortfolioId ID de la subcartera
   */
  getDynamicTableColumns(tenantId, portfolioId, subPortfolioId) {
    const params = new HttpParams().set("tenantId", tenantId.toString()).set("portfolioId", portfolioId.toString()).set("subPortfolioId", subPortfolioId.toString());
    return this.http.get(`${this.configUrl}/dynamic-table-columns`, { params });
  }
  // ========================================
  // Field Options (Toggle System)
  // ========================================
  /**
   * Genera opciones automáticamente desde las columnas dinámicas de una subcartera
   */
  generarOpcionesCampo(campoId, tenantId, portfolioId, subPortfolioId) {
    const params = new HttpParams().set("tenantId", tenantId.toString()).set("portfolioId", portfolioId.toString()).set("subPortfolioId", subPortfolioId.toString());
    return this.http.get(`${this.catalogUrl}/campo/${campoId}/opciones/generar`, { params });
  }
  /**
   * Inicializa las opciones de un campo en la base de datos
   */
  inicializarOpcionesCampo(campoId, tenantId, portfolioId, subPortfolioId) {
    const params = new HttpParams().set("tenantId", tenantId.toString()).set("portfolioId", portfolioId.toString()).set("subPortfolioId", subPortfolioId.toString());
    return this.http.post(`${this.catalogUrl}/campo/${campoId}/opciones/inicializar`, {}, { params });
  }
  /**
   * Obtiene todas las opciones de un campo (para mostrar toggles al admin)
   */
  getOpcionesCampo(campoId) {
    return this.http.get(`${this.catalogUrl}/campo/${campoId}/opciones`);
  }
  /**
   * Obtiene solo las opciones habilitadas de un campo (para dropdown del agente)
   */
  getOpcionesHabilitadas(campoId) {
    return this.http.get(`${this.catalogUrl}/campo/${campoId}/opciones/habilitadas`);
  }
  /**
   * Configura las opciones de un campo (activa/desactiva toggles)
   */
  configurarOpciones(request) {
    return this.http.put(`${this.catalogUrl}/campo/opciones/configurar`, request);
  }
  /**
   * Obtiene las opciones habilitadas con sus valores desde la tabla dinámica del cliente
   */
  getOpcionesConValores(campoId, tenantId, portfolioId, subPortfolioId, clientId) {
    const params = new HttpParams().set("tenantId", tenantId.toString()).set("portfolioId", portfolioId.toString()).set("subPortfolioId", subPortfolioId.toString()).set("clientId", clientId.toString());
    return this.http.get(`${this.catalogUrl}/campo/${campoId}/opciones/valores`, { params });
  }
  // ========================================
  // Payment Schedule
  // ========================================
  /**
   * Crea un cronograma de pagos (1 cabecera + N cuotas en tabla separada)
   */
  createPaymentSchedule(request) {
    return this.http.post(`${environment.gatewayUrl}/v2/management-records/payment-schedule`, request);
  }
  /**
   * Obtiene los cronogramas de pago de un cliente
   */
  getPaymentSchedulesByClient(clientId) {
    return this.http.get(`${environment.gatewayUrl}/v2/management-records/payment-schedule/client/${clientId}`);
  }
  /**
   * Obtiene un grupo de cuotas por su UUID
   */
  getPaymentScheduleByGroup(groupUuid) {
    return this.http.get(`${environment.gatewayUrl}/v2/management-records/payment-schedule/group/${groupUuid}`);
  }
  /**
   * Actualiza el estado de pago de una cuota
   */
  updatePaymentStatus(recordId, estadoPago, montoPagadoReal, fechaPagoReal) {
    let params = new HttpParams().set("estadoPago", estadoPago);
    if (montoPagadoReal !== void 0) {
      params = params.set("montoPagadoReal", montoPagadoReal.toString());
    }
    if (fechaPagoReal) {
      params = params.set("fechaPagoReal", fechaPagoReal);
    }
    return this.http.put(`${environment.gatewayUrl}/v2/management-records/${recordId}/payment-status`, {}, { params });
  }
  // ========================================
  // Helper Methods
  // ========================================
  buildClassificationTree(typifications) {
    const map = /* @__PURE__ */ new Map();
    const roots = [];
    typifications.forEach((typification) => {
      map.set(typification.id, {
        typification,
        children: [],
        level: typification.nivelJerarquia
      });
    });
    typifications.forEach((typification) => {
      const node = map.get(typification.id);
      const parentId = typification.tipificacionPadre?.id;
      if (parentId) {
        const parent = map.get(parentId);
        if (parent) {
          parent.children.push(node);
        }
      } else {
        roots.push(node);
      }
    });
    const sortChildren = (node) => {
      if (node.children.length > 0) {
        node.children.sort((a, b) => {
          const orderA = a.typification.ordenVisualizacion || 0;
          const orderB = b.typification.ordenVisualizacion || 0;
          return orderA - orderB;
        });
        node.children.forEach((child) => sortChildren(child));
      }
    };
    roots.forEach((root) => sortChildren(root));
    return roots;
  }
};
_TypificationV2Service.\u0275fac = function TypificationV2Service_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _TypificationV2Service)(\u0275\u0275inject(HttpClient));
};
_TypificationV2Service.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _TypificationV2Service, factory: _TypificationV2Service.\u0275fac, providedIn: "root" });
var TypificationV2Service = _TypificationV2Service;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TypificationV2Service, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{ type: HttpClient }], null);
})();

export {
  DynamicFieldRendererComponent,
  ApiSystemConfigService,
  TypificationV2Service
};
//# sourceMappingURL=chunk-WKJZD4SZ.js.map
