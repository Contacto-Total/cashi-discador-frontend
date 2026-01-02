import {
  CustomSelectComponent,
  ToastService
} from "./chunk-2BMIOZPH.js";
import {
  ThemeService
} from "./chunk-D3RWIMJ4.js";
import {
  FormsModule,
  NG_VALUE_ACCESSOR,
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
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  CommonModule,
  Component,
  EventEmitter,
  HttpClient,
  HttpHeaders,
  Injectable,
  Input,
  NgForOf,
  NgIf,
  Output,
  Subject,
  __spreadValues,
  forwardRef,
  inject,
  setClassMetadata,
  signal,
  takeUntil,
  ɵsetClassDebugInfo,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdirectiveInject,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵdomListener,
  ɵɵdomProperty,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵinject,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵproperty,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-CTRHJBBW.js";

// src/app/shared/components/custom-ui/custom-input-number/custom-input-number.component.ts
var _CustomInputNumberComponent = class _CustomInputNumberComponent {
  constructor() {
    this.min = null;
    this.max = null;
    this.step = 1;
    this.placeholder = "";
    this.disabled = false;
    this.hasError = false;
    this.valueChange = new EventEmitter();
    this.value = null;
    this.onChange = () => {
    };
    this.onTouched = () => {
    };
  }
  onInput(event) {
    const input = event.target;
    const numValue = input.value === "" ? null : parseFloat(input.value);
    if (numValue !== null) {
      let constrainedValue = numValue;
      if (this.min !== null && numValue < this.min) {
        constrainedValue = this.min;
      }
      if (this.max !== null && numValue > this.max) {
        constrainedValue = this.max;
      }
      this.value = constrainedValue;
    } else {
      this.value = null;
    }
    this.onChange(this.value);
    this.onTouched();
    this.valueChange.emit(this.value);
  }
  onBlur() {
    this.onTouched();
  }
  // ControlValueAccessor implementation
  writeValue(value) {
    this.value = value;
  }
  registerOnChange(fn) {
    this.onChange = fn;
  }
  registerOnTouched(fn) {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled) {
    this.disabled = isDisabled;
  }
};
_CustomInputNumberComponent.\u0275fac = function CustomInputNumberComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _CustomInputNumberComponent)();
};
_CustomInputNumberComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _CustomInputNumberComponent, selectors: [["app-custom-input-number"]], inputs: { min: "min", max: "max", step: "step", placeholder: "placeholder", disabled: "disabled", hasError: "hasError" }, outputs: { valueChange: "valueChange" }, features: [\u0275\u0275ProvidersFeature([
  {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => _CustomInputNumberComponent),
    multi: true
  }
])], decls: 2, vars: 10, consts: [[1, "custom-input-number"], ["type", "number", 1, "number-input", 3, "input", "blur", "value", "min", "max", "step", "placeholder", "disabled"]], template: function CustomInputNumberComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "div", 0)(1, "input", 1);
    \u0275\u0275domListener("input", function CustomInputNumberComponent_Template_input_input_1_listener($event) {
      return ctx.onInput($event);
    })("blur", function CustomInputNumberComponent_Template_input_blur_1_listener() {
      return ctx.onBlur();
    });
    \u0275\u0275domElementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275classProp("disabled", ctx.disabled)("error", ctx.hasError);
    \u0275\u0275advance();
    \u0275\u0275domProperty("value", ctx.value ?? "")("min", ctx.min ?? void 0)("max", ctx.max ?? void 0)("step", ctx.step)("placeholder", ctx.placeholder)("disabled", ctx.disabled);
  }
}, dependencies: [CommonModule, FormsModule], styles: ["\n\n.custom-input-number[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.custom-input-number[_ngcontent-%COMP%]   .number-input[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 32px;\n  padding: 0 10px;\n  background: #1E293B;\n  border: 1px solid #334155;\n  border-radius: 6px;\n  color: #ffffff;\n  font-size: 12px;\n  transition: all 0.2s ease;\n  outline: none;\n}\n.custom-input-number[_ngcontent-%COMP%]   .number-input[_ngcontent-%COMP%]::placeholder {\n  color: #64748b;\n}\n.custom-input-number[_ngcontent-%COMP%]   .number-input[_ngcontent-%COMP%]:hover:not(:disabled) {\n  border-color: #10B981;\n}\n.custom-input-number[_ngcontent-%COMP%]   .number-input[_ngcontent-%COMP%]:focus {\n  border-color: #10B981;\n  background: #0F172A;\n  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);\n}\n.custom-input-number[_ngcontent-%COMP%]   .number-input[_ngcontent-%COMP%]:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n  background: #0F172A;\n}\n.custom-input-number[_ngcontent-%COMP%]   .number-input[_ngcontent-%COMP%]::-webkit-inner-spin-button, \n.custom-input-number[_ngcontent-%COMP%]   .number-input[_ngcontent-%COMP%]::-webkit-outer-spin-button {\n  -webkit-appearance: none;\n  margin: 0;\n}\n.custom-input-number[_ngcontent-%COMP%]   .number-input[type=number][_ngcontent-%COMP%] {\n  -moz-appearance: textfield;\n}\n.custom-input-number.error[_ngcontent-%COMP%]   .number-input[_ngcontent-%COMP%] {\n  border-color: #ef4444;\n}\n.custom-input-number.error[_ngcontent-%COMP%]   .number-input[_ngcontent-%COMP%]:focus {\n  border-color: #ef4444;\n  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);\n}\n.custom-input-number.disabled[_ngcontent-%COMP%] {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\nbody.light-theme[_nghost-%COMP%]   .custom-input-number[_ngcontent-%COMP%]   .number-input[_ngcontent-%COMP%], body.light-theme   [_nghost-%COMP%]   .custom-input-number[_ngcontent-%COMP%]   .number-input[_ngcontent-%COMP%] {\n  background: #ffffff;\n  border-color: #e2e8f0;\n  color: #0f172a;\n}\nbody.light-theme[_nghost-%COMP%]   .custom-input-number[_ngcontent-%COMP%]   .number-input[_ngcontent-%COMP%]::placeholder, body.light-theme   [_nghost-%COMP%]   .custom-input-number[_ngcontent-%COMP%]   .number-input[_ngcontent-%COMP%]::placeholder {\n  color: #94a3b8;\n}\nbody.light-theme[_nghost-%COMP%]   .custom-input-number[_ngcontent-%COMP%]   .number-input[_ngcontent-%COMP%]:hover:not(:disabled), body.light-theme   [_nghost-%COMP%]   .custom-input-number[_ngcontent-%COMP%]   .number-input[_ngcontent-%COMP%]:hover:not(:disabled) {\n  border-color: #10B981;\n}\nbody.light-theme[_nghost-%COMP%]   .custom-input-number[_ngcontent-%COMP%]   .number-input[_ngcontent-%COMP%]:focus, body.light-theme   [_nghost-%COMP%]   .custom-input-number[_ngcontent-%COMP%]   .number-input[_ngcontent-%COMP%]:focus {\n  border-color: #10B981;\n  background: #f8fafc;\n}\nbody.light-theme[_nghost-%COMP%]   .custom-input-number[_ngcontent-%COMP%]   .number-input[_ngcontent-%COMP%]:disabled, body.light-theme   [_nghost-%COMP%]   .custom-input-number[_ngcontent-%COMP%]   .number-input[_ngcontent-%COMP%]:disabled {\n  background: #f8fafc;\n}\n/*# sourceMappingURL=custom-input-number.component.css.map */"] });
var CustomInputNumberComponent = _CustomInputNumberComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CustomInputNumberComponent, [{
    type: Component,
    args: [{ selector: "app-custom-input-number", standalone: true, imports: [CommonModule, FormsModule], providers: [
      {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => CustomInputNumberComponent),
        multi: true
      }
    ], template: `<div class="custom-input-number" [class.disabled]="disabled" [class.error]="hasError">\r
  <input\r
    type="number"\r
    class="number-input"\r
    [value]="value ?? ''"\r
    [min]="min ?? undefined"\r
    [max]="max ?? undefined"\r
    [step]="step"\r
    [placeholder]="placeholder"\r
    [disabled]="disabled"\r
    (input)="onInput($event)"\r
    (blur)="onBlur()"\r
  />\r
</div>\r
`, styles: ["/* src/app/shared/components/custom-ui/custom-input-number/custom-input-number.component.scss */\n.custom-input-number {\n  width: 100%;\n}\n.custom-input-number .number-input {\n  width: 100%;\n  height: 32px;\n  padding: 0 10px;\n  background: #1E293B;\n  border: 1px solid #334155;\n  border-radius: 6px;\n  color: #ffffff;\n  font-size: 12px;\n  transition: all 0.2s ease;\n  outline: none;\n}\n.custom-input-number .number-input::placeholder {\n  color: #64748b;\n}\n.custom-input-number .number-input:hover:not(:disabled) {\n  border-color: #10B981;\n}\n.custom-input-number .number-input:focus {\n  border-color: #10B981;\n  background: #0F172A;\n  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);\n}\n.custom-input-number .number-input:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n  background: #0F172A;\n}\n.custom-input-number .number-input::-webkit-inner-spin-button,\n.custom-input-number .number-input::-webkit-outer-spin-button {\n  -webkit-appearance: none;\n  margin: 0;\n}\n.custom-input-number .number-input[type=number] {\n  -moz-appearance: textfield;\n}\n.custom-input-number.error .number-input {\n  border-color: #ef4444;\n}\n.custom-input-number.error .number-input:focus {\n  border-color: #ef4444;\n  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);\n}\n.custom-input-number.disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n:host-context(body.light-theme) .custom-input-number .number-input {\n  background: #ffffff;\n  border-color: #e2e8f0;\n  color: #0f172a;\n}\n:host-context(body.light-theme) .custom-input-number .number-input::placeholder {\n  color: #94a3b8;\n}\n:host-context(body.light-theme) .custom-input-number .number-input:hover:not(:disabled) {\n  border-color: #10B981;\n}\n:host-context(body.light-theme) .custom-input-number .number-input:focus {\n  border-color: #10B981;\n  background: #f8fafc;\n}\n:host-context(body.light-theme) .custom-input-number .number-input:disabled {\n  background: #f8fafc;\n}\n/*# sourceMappingURL=custom-input-number.component.css.map */\n"] }]
  }], null, { min: [{
    type: Input
  }], max: [{
    type: Input
  }], step: [{
    type: Input
  }], placeholder: [{
    type: Input
  }], disabled: [{
    type: Input
  }], hasError: [{
    type: Input
  }], valueChange: [{
    type: Output
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(CustomInputNumberComponent, { className: "CustomInputNumberComponent", filePath: "src/app/shared/components/custom-ui/custom-input-number/custom-input-number.component.ts", lineNumber: 19 });
})();

// src/app/shared/components/custom-ui/custom-checkbox/custom-checkbox.component.ts
function CustomCheckboxComponent_lucide_angular_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "lucide-angular", 4);
  }
  if (rf & 2) {
    \u0275\u0275property("size", 16);
  }
}
function CustomCheckboxComponent_span_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 5);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.label);
  }
}
var _CustomCheckboxComponent = class _CustomCheckboxComponent {
  constructor() {
    this.label = "";
    this.disabled = false;
    this.checkedChange = new EventEmitter();
    this.checked = false;
    this.onChange = () => {
    };
    this.onTouched = () => {
    };
  }
  toggle() {
    if (!this.disabled) {
      this.checked = !this.checked;
      this.onChange(this.checked);
      this.onTouched();
      this.checkedChange.emit(this.checked);
    }
  }
  // ControlValueAccessor implementation
  writeValue(value) {
    this.checked = value;
  }
  registerOnChange(fn) {
    this.onChange = fn;
  }
  registerOnTouched(fn) {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled) {
    this.disabled = isDisabled;
  }
};
_CustomCheckboxComponent.\u0275fac = function CustomCheckboxComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _CustomCheckboxComponent)();
};
_CustomCheckboxComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _CustomCheckboxComponent, selectors: [["app-custom-checkbox"]], inputs: { label: "label", disabled: "disabled" }, outputs: { checkedChange: "checkedChange" }, features: [\u0275\u0275ProvidersFeature([
  {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => _CustomCheckboxComponent),
    multi: true
  }
])], decls: 4, vars: 6, consts: [[1, "custom-checkbox", 3, "click"], [1, "checkbox-box"], ["name", "check", "class", "check-icon", 3, "size", 4, "ngIf"], ["class", "checkbox-label", 4, "ngIf"], ["name", "check", 1, "check-icon", 3, "size"], [1, "checkbox-label"]], template: function CustomCheckboxComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 0);
    \u0275\u0275listener("click", function CustomCheckboxComponent_Template_div_click_0_listener() {
      return ctx.toggle();
    });
    \u0275\u0275elementStart(1, "div", 1);
    \u0275\u0275template(2, CustomCheckboxComponent_lucide_angular_2_Template, 1, 1, "lucide-angular", 2);
    \u0275\u0275elementEnd();
    \u0275\u0275template(3, CustomCheckboxComponent_span_3_Template, 2, 1, "span", 3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275classProp("disabled", ctx.disabled);
    \u0275\u0275advance();
    \u0275\u0275classProp("checked", ctx.checked);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.checked);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.label);
  }
}, dependencies: [CommonModule, NgIf, FormsModule, LucideAngularModule, LucideAngularComponent], styles: ["\n\n.custom-checkbox[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 10px;\n  cursor: pointer;\n  -webkit-user-select: none;\n  user-select: none;\n}\n.custom-checkbox[_ngcontent-%COMP%]   .checkbox-box[_ngcontent-%COMP%] {\n  width: 20px;\n  height: 20px;\n  border: 2px solid #334155;\n  border-radius: 4px;\n  background: #1E293B;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  transition: all 0.2s ease;\n  flex-shrink: 0;\n}\n.custom-checkbox[_ngcontent-%COMP%]   .checkbox-box[_ngcontent-%COMP%]   .check-icon[_ngcontent-%COMP%] {\n  color: #ffffff;\n}\n.custom-checkbox[_ngcontent-%COMP%]   .checkbox-box.checked[_ngcontent-%COMP%] {\n  background: #10B981;\n  border-color: #10B981;\n}\n.custom-checkbox[_ngcontent-%COMP%]   .checkbox-label[_ngcontent-%COMP%] {\n  color: #ffffff;\n  font-size: 12px;\n  line-height: 1.4;\n}\n.custom-checkbox[_ngcontent-%COMP%]:hover:not(.disabled)   .checkbox-box[_ngcontent-%COMP%] {\n  border-color: #10B981;\n}\n.custom-checkbox[_ngcontent-%COMP%]:hover:not(.disabled)   .checkbox-box[_ngcontent-%COMP%]:not(.checked) {\n  background: rgba(16, 185, 129, 0.05);\n}\n.custom-checkbox.disabled[_ngcontent-%COMP%] {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\nbody.light-theme[_nghost-%COMP%]   .custom-checkbox[_ngcontent-%COMP%]   .checkbox-box[_ngcontent-%COMP%], body.light-theme   [_nghost-%COMP%]   .custom-checkbox[_ngcontent-%COMP%]   .checkbox-box[_ngcontent-%COMP%] {\n  background: #ffffff;\n  border-color: #cbd5e1;\n}\nbody.light-theme[_nghost-%COMP%]   .custom-checkbox[_ngcontent-%COMP%]   .checkbox-box[_ngcontent-%COMP%]   .check-icon[_ngcontent-%COMP%], body.light-theme   [_nghost-%COMP%]   .custom-checkbox[_ngcontent-%COMP%]   .checkbox-box[_ngcontent-%COMP%]   .check-icon[_ngcontent-%COMP%] {\n  color: #ffffff;\n}\nbody.light-theme[_nghost-%COMP%]   .custom-checkbox[_ngcontent-%COMP%]   .checkbox-box.checked[_ngcontent-%COMP%], body.light-theme   [_nghost-%COMP%]   .custom-checkbox[_ngcontent-%COMP%]   .checkbox-box.checked[_ngcontent-%COMP%] {\n  background: #10B981;\n  border-color: #10B981;\n}\nbody.light-theme[_nghost-%COMP%]   .custom-checkbox[_ngcontent-%COMP%]   .checkbox-label[_ngcontent-%COMP%], body.light-theme   [_nghost-%COMP%]   .custom-checkbox[_ngcontent-%COMP%]   .checkbox-label[_ngcontent-%COMP%] {\n  color: #0f172a;\n}\nbody.light-theme[_nghost-%COMP%]   .custom-checkbox[_ngcontent-%COMP%]:hover:not(.disabled)   .checkbox-box[_ngcontent-%COMP%], body.light-theme   [_nghost-%COMP%]   .custom-checkbox[_ngcontent-%COMP%]:hover:not(.disabled)   .checkbox-box[_ngcontent-%COMP%] {\n  border-color: #10B981;\n}\nbody.light-theme[_nghost-%COMP%]   .custom-checkbox[_ngcontent-%COMP%]:hover:not(.disabled)   .checkbox-box[_ngcontent-%COMP%]:not(.checked), body.light-theme   [_nghost-%COMP%]   .custom-checkbox[_ngcontent-%COMP%]:hover:not(.disabled)   .checkbox-box[_ngcontent-%COMP%]:not(.checked) {\n  background: rgba(16, 185, 129, 0.05);\n}\n/*# sourceMappingURL=custom-checkbox.component.css.map */"] });
var CustomCheckboxComponent = _CustomCheckboxComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CustomCheckboxComponent, [{
    type: Component,
    args: [{ selector: "app-custom-checkbox", standalone: true, imports: [CommonModule, FormsModule, LucideAngularModule], providers: [
      {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => CustomCheckboxComponent),
        multi: true
      }
    ], template: '<div class="custom-checkbox" [class.disabled]="disabled" (click)="toggle()">\r\n  <div class="checkbox-box" [class.checked]="checked">\r\n    <lucide-angular *ngIf="checked" name="check" [size]="16" class="check-icon"></lucide-angular>\r\n  </div>\r\n  <span class="checkbox-label" *ngIf="label">{{ label }}</span>\r\n</div>\r\n', styles: ["/* src/app/shared/components/custom-ui/custom-checkbox/custom-checkbox.component.scss */\n.custom-checkbox {\n  display: inline-flex;\n  align-items: center;\n  gap: 10px;\n  cursor: pointer;\n  -webkit-user-select: none;\n  user-select: none;\n}\n.custom-checkbox .checkbox-box {\n  width: 20px;\n  height: 20px;\n  border: 2px solid #334155;\n  border-radius: 4px;\n  background: #1E293B;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  transition: all 0.2s ease;\n  flex-shrink: 0;\n}\n.custom-checkbox .checkbox-box .check-icon {\n  color: #ffffff;\n}\n.custom-checkbox .checkbox-box.checked {\n  background: #10B981;\n  border-color: #10B981;\n}\n.custom-checkbox .checkbox-label {\n  color: #ffffff;\n  font-size: 12px;\n  line-height: 1.4;\n}\n.custom-checkbox:hover:not(.disabled) .checkbox-box {\n  border-color: #10B981;\n}\n.custom-checkbox:hover:not(.disabled) .checkbox-box:not(.checked) {\n  background: rgba(16, 185, 129, 0.05);\n}\n.custom-checkbox.disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n:host-context(body.light-theme) .custom-checkbox .checkbox-box {\n  background: #ffffff;\n  border-color: #cbd5e1;\n}\n:host-context(body.light-theme) .custom-checkbox .checkbox-box .check-icon {\n  color: #ffffff;\n}\n:host-context(body.light-theme) .custom-checkbox .checkbox-box.checked {\n  background: #10B981;\n  border-color: #10B981;\n}\n:host-context(body.light-theme) .custom-checkbox .checkbox-label {\n  color: #0f172a;\n}\n:host-context(body.light-theme) .custom-checkbox:hover:not(.disabled) .checkbox-box {\n  border-color: #10B981;\n}\n:host-context(body.light-theme) .custom-checkbox:hover:not(.disabled) .checkbox-box:not(.checked) {\n  background: rgba(16, 185, 129, 0.05);\n}\n/*# sourceMappingURL=custom-checkbox.component.css.map */\n"] }]
  }], null, { label: [{
    type: Input
  }], disabled: [{
    type: Input
  }], checkedChange: [{
    type: Output
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(CustomCheckboxComponent, { className: "CustomCheckboxComponent", filePath: "src/app/shared/components/custom-ui/custom-checkbox/custom-checkbox.component.ts", lineNumber: 20 });
})();

// src/app/shared/components/custom-ui/custom-tabs/custom-tabs.component.ts
var _c0 = ["*"];
function CustomTabsComponent_button_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 4);
    \u0275\u0275listener("click", function CustomTabsComponent_button_2_Template_button_click_0_listener() {
      const i_r2 = \u0275\u0275restoreView(_r1).index;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.selectTab(i_r2));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const tab_r4 = ctx.$implicit;
    const i_r2 = ctx.index;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275classProp("active", i_r2 === ctx_r2.activeIndex);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", tab_r4.title, " ");
  }
}
var _CustomTabsComponent = class _CustomTabsComponent {
  constructor() {
    this.tabs = [];
    this.activeIndex = 0;
    this.activeIndexChange = new EventEmitter();
    this.tabChange = new EventEmitter();
  }
  selectTab(index) {
    if (this.activeIndex !== index) {
      this.activeIndex = index;
      this.activeIndexChange.emit(index);
      this.tabChange.emit(index);
    }
  }
};
_CustomTabsComponent.\u0275fac = function CustomTabsComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _CustomTabsComponent)();
};
_CustomTabsComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _CustomTabsComponent, selectors: [["app-custom-tabs"]], inputs: { tabs: "tabs", activeIndex: "activeIndex" }, outputs: { activeIndexChange: "activeIndexChange", tabChange: "tabChange" }, ngContentSelectors: _c0, decls: 5, vars: 1, consts: [[1, "custom-tabs"], [1, "tabs-header"], ["class", "tab-button", 3, "active", "click", 4, "ngFor", "ngForOf"], [1, "tabs-content"], [1, "tab-button", 3, "click"]], template: function CustomTabsComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275projectionDef();
    \u0275\u0275elementStart(0, "div", 0)(1, "div", 1);
    \u0275\u0275template(2, CustomTabsComponent_button_2_Template, 2, 3, "button", 2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 3);
    \u0275\u0275projection(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance(2);
    \u0275\u0275property("ngForOf", ctx.tabs);
  }
}, dependencies: [CommonModule, NgForOf], styles: ["\n\n.custom-tabs[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  width: 100%;\n  max-width: 100%;\n  box-sizing: border-box;\n}\n.custom-tabs[_ngcontent-%COMP%]   .tabs-header[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 0;\n  border-bottom: 2px solid #334155;\n  background: #1E293B;\n  width: 100%;\n}\n.custom-tabs[_ngcontent-%COMP%]   .tabs-header[_ngcontent-%COMP%]   .tab-button[_ngcontent-%COMP%] {\n  padding: 14px 24px;\n  background: transparent;\n  border: none;\n  color: #94a3b8;\n  font-size: 14px;\n  font-weight: 500;\n  cursor: pointer;\n  transition: all 0.2s ease;\n  position: relative;\n  border-bottom: 3px solid transparent;\n}\n.custom-tabs[_ngcontent-%COMP%]   .tabs-header[_ngcontent-%COMP%]   .tab-button[_ngcontent-%COMP%]:hover:not(.active) {\n  color: #cbd5e1;\n  background: rgba(255, 255, 255, 0.02);\n}\n.custom-tabs[_ngcontent-%COMP%]   .tabs-header[_ngcontent-%COMP%]   .tab-button.active[_ngcontent-%COMP%] {\n  color: #10B981;\n  border-bottom-color: #10B981;\n  background: rgba(16, 185, 129, 0.05);\n}\n.custom-tabs[_ngcontent-%COMP%]   .tabs-content[_ngcontent-%COMP%] {\n  padding: 0;\n  background: transparent;\n  border-radius: 0;\n  width: 100%;\n  box-sizing: border-box;\n}\nbody.light-theme[_nghost-%COMP%]   .custom-tabs[_ngcontent-%COMP%]   .tabs-header[_ngcontent-%COMP%], body.light-theme   [_nghost-%COMP%]   .custom-tabs[_ngcontent-%COMP%]   .tabs-header[_ngcontent-%COMP%] {\n  border-bottom-color: #e2e8f0;\n  background: #ffffff;\n}\nbody.light-theme[_nghost-%COMP%]   .custom-tabs[_ngcontent-%COMP%]   .tabs-header[_ngcontent-%COMP%]   .tab-button[_ngcontent-%COMP%], body.light-theme   [_nghost-%COMP%]   .custom-tabs[_ngcontent-%COMP%]   .tabs-header[_ngcontent-%COMP%]   .tab-button[_ngcontent-%COMP%] {\n  color: #64748b;\n}\nbody.light-theme[_nghost-%COMP%]   .custom-tabs[_ngcontent-%COMP%]   .tabs-header[_ngcontent-%COMP%]   .tab-button[_ngcontent-%COMP%]:hover:not(.active), body.light-theme   [_nghost-%COMP%]   .custom-tabs[_ngcontent-%COMP%]   .tabs-header[_ngcontent-%COMP%]   .tab-button[_ngcontent-%COMP%]:hover:not(.active) {\n  color: #475569;\n  background: rgba(0, 0, 0, 0.02);\n}\nbody.light-theme[_nghost-%COMP%]   .custom-tabs[_ngcontent-%COMP%]   .tabs-header[_ngcontent-%COMP%]   .tab-button.active[_ngcontent-%COMP%], body.light-theme   [_nghost-%COMP%]   .custom-tabs[_ngcontent-%COMP%]   .tabs-header[_ngcontent-%COMP%]   .tab-button.active[_ngcontent-%COMP%] {\n  color: #10B981;\n  border-bottom-color: #10B981;\n  background: rgba(16, 185, 129, 0.05);\n}\nbody.light-theme[_nghost-%COMP%]   .custom-tabs[_ngcontent-%COMP%]   .tabs-content[_ngcontent-%COMP%], body.light-theme   [_nghost-%COMP%]   .custom-tabs[_ngcontent-%COMP%]   .tabs-content[_ngcontent-%COMP%] {\n  background: #f8fafc;\n  padding: 0;\n}\n/*# sourceMappingURL=custom-tabs.component.css.map */"] });
var CustomTabsComponent = _CustomTabsComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CustomTabsComponent, [{
    type: Component,
    args: [{ selector: "app-custom-tabs", standalone: true, imports: [CommonModule], template: '<div class="custom-tabs">\r\n  <div class="tabs-header">\r\n    <button\r\n      *ngFor="let tab of tabs; let i = index"\r\n      class="tab-button"\r\n      [class.active]="i === activeIndex"\r\n      (click)="selectTab(i)">\r\n      {{ tab.title }}\r\n    </button>\r\n  </div>\r\n\r\n  <div class="tabs-content">\r\n    <ng-content></ng-content>\r\n  </div>\r\n</div>\r\n', styles: ["/* src/app/shared/components/custom-ui/custom-tabs/custom-tabs.component.scss */\n.custom-tabs {\n  display: flex;\n  flex-direction: column;\n  width: 100%;\n  max-width: 100%;\n  box-sizing: border-box;\n}\n.custom-tabs .tabs-header {\n  display: flex;\n  gap: 0;\n  border-bottom: 2px solid #334155;\n  background: #1E293B;\n  width: 100%;\n}\n.custom-tabs .tabs-header .tab-button {\n  padding: 14px 24px;\n  background: transparent;\n  border: none;\n  color: #94a3b8;\n  font-size: 14px;\n  font-weight: 500;\n  cursor: pointer;\n  transition: all 0.2s ease;\n  position: relative;\n  border-bottom: 3px solid transparent;\n}\n.custom-tabs .tabs-header .tab-button:hover:not(.active) {\n  color: #cbd5e1;\n  background: rgba(255, 255, 255, 0.02);\n}\n.custom-tabs .tabs-header .tab-button.active {\n  color: #10B981;\n  border-bottom-color: #10B981;\n  background: rgba(16, 185, 129, 0.05);\n}\n.custom-tabs .tabs-content {\n  padding: 0;\n  background: transparent;\n  border-radius: 0;\n  width: 100%;\n  box-sizing: border-box;\n}\n:host-context(body.light-theme) .custom-tabs .tabs-header {\n  border-bottom-color: #e2e8f0;\n  background: #ffffff;\n}\n:host-context(body.light-theme) .custom-tabs .tabs-header .tab-button {\n  color: #64748b;\n}\n:host-context(body.light-theme) .custom-tabs .tabs-header .tab-button:hover:not(.active) {\n  color: #475569;\n  background: rgba(0, 0, 0, 0.02);\n}\n:host-context(body.light-theme) .custom-tabs .tabs-header .tab-button.active {\n  color: #10B981;\n  border-bottom-color: #10B981;\n  background: rgba(16, 185, 129, 0.05);\n}\n:host-context(body.light-theme) .custom-tabs .tabs-content {\n  background: #f8fafc;\n  padding: 0;\n}\n/*# sourceMappingURL=custom-tabs.component.css.map */\n"] }]
  }], null, { tabs: [{
    type: Input
  }], activeIndex: [{
    type: Input
  }], activeIndexChange: [{
    type: Output
  }], tabChange: [{
    type: Output
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(CustomTabsComponent, { className: "CustomTabsComponent", filePath: "src/app/shared/components/custom-ui/custom-tabs/custom-tabs.component.ts", lineNumber: 16 });
})();

// src/app/shared/components/custom-ui/custom-multiselect/custom-multiselect.component.ts
function CustomMultiSelectComponent_div_5_div_1_button_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 11);
    \u0275\u0275listener("click", function CustomMultiSelectComponent_div_5_div_1_button_1_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.selectAll());
    });
    \u0275\u0275text(1, "Seleccionar todos");
    \u0275\u0275elementEnd();
  }
}
function CustomMultiSelectComponent_div_5_div_1_button_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 11);
    \u0275\u0275listener("click", function CustomMultiSelectComponent_div_5_div_1_button_2_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.clearAll());
    });
    \u0275\u0275text(1, "Limpiar");
    \u0275\u0275elementEnd();
  }
}
function CustomMultiSelectComponent_div_5_div_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 9);
    \u0275\u0275template(1, CustomMultiSelectComponent_div_5_div_1_button_1_Template, 2, 0, "button", 10)(2, CustomMultiSelectComponent_div_5_div_1_button_2_Template, 2, 0, "button", 10);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.showToggleAll);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.showClear);
  }
}
function CustomMultiSelectComponent_div_5_div_3_lucide_angular_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "lucide-angular", 16);
  }
  if (rf & 2) {
    \u0275\u0275property("size", 14);
  }
}
function CustomMultiSelectComponent_div_5_div_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 12);
    \u0275\u0275listener("click", function CustomMultiSelectComponent_div_5_div_3_Template_div_click_0_listener() {
      const option_r5 = \u0275\u0275restoreView(_r4).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.toggleOption(option_r5));
    });
    \u0275\u0275elementStart(1, "div", 13);
    \u0275\u0275template(2, CustomMultiSelectComponent_div_5_div_3_lucide_angular_2_Template, 1, 1, "lucide-angular", 14);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 15);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const option_r5 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275classProp("checked", ctx_r1.isSelected(option_r5.value));
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.isSelected(option_r5.value));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(option_r5.label);
  }
}
function CustomMultiSelectComponent_div_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 5);
    \u0275\u0275template(1, CustomMultiSelectComponent_div_5_div_1_Template, 3, 2, "div", 6);
    \u0275\u0275elementStart(2, "div", 7);
    \u0275\u0275template(3, CustomMultiSelectComponent_div_5_div_3_Template, 5, 4, "div", 8);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.showToggleAll || ctx_r1.showClear);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngForOf", ctx_r1.options);
  }
}
var _CustomMultiSelectComponent = class _CustomMultiSelectComponent {
  constructor() {
    this.options = [];
    this.placeholder = "Seleccionar...";
    this.disabled = false;
    this.showToggleAll = true;
    this.showClear = true;
    this.selectionChange = new EventEmitter();
    this.selectedValues = [];
    this.isOpen = false;
    this.onChange = () => {
    };
    this.onTouched = () => {
    };
  }
  toggleDropdown() {
    if (!this.disabled) {
      this.isOpen = !this.isOpen;
    }
  }
  toggleOption(option) {
    const index = this.selectedValues.indexOf(option.value);
    if (index > -1) {
      this.selectedValues.splice(index, 1);
    } else {
      this.selectedValues.push(option.value);
    }
    this.onChange(this.selectedValues);
    this.onTouched();
    this.selectionChange.emit(this.selectedValues);
  }
  isSelected(value) {
    return this.selectedValues.includes(value);
  }
  selectAll() {
    this.selectedValues = this.options.map((opt) => opt.value);
    this.onChange(this.selectedValues);
    this.selectionChange.emit(this.selectedValues);
  }
  clearAll() {
    this.selectedValues = [];
    this.onChange(this.selectedValues);
    this.selectionChange.emit(this.selectedValues);
  }
  getDisplayText() {
    if (this.selectedValues.length === 0) {
      return this.placeholder;
    }
    if (this.selectedValues.length === this.options.length) {
      return `Todos seleccionados (${this.selectedValues.length})`;
    }
    return `${this.selectedValues.length} seleccionado${this.selectedValues.length > 1 ? "s" : ""}`;
  }
  // ControlValueAccessor implementation
  writeValue(value) {
    this.selectedValues = value || [];
  }
  registerOnChange(fn) {
    this.onChange = fn;
  }
  registerOnTouched(fn) {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled) {
    this.disabled = isDisabled;
  }
};
_CustomMultiSelectComponent.\u0275fac = function CustomMultiSelectComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _CustomMultiSelectComponent)();
};
_CustomMultiSelectComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _CustomMultiSelectComponent, selectors: [["app-custom-multiselect"]], inputs: { options: "options", placeholder: "placeholder", disabled: "disabled", showToggleAll: "showToggleAll", showClear: "showClear" }, outputs: { selectionChange: "selectionChange" }, features: [\u0275\u0275ProvidersFeature([
  {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => _CustomMultiSelectComponent),
    multi: true
  }
])], decls: 6, vars: 9, consts: [[1, "custom-multiselect"], [1, "multiselect-trigger", 3, "click"], [1, "multiselect-value"], ["name", "chevron-down", 1, "multiselect-icon", 3, "size"], ["class", "multiselect-dropdown", 4, "ngIf"], [1, "multiselect-dropdown"], ["class", "multiselect-actions", 4, "ngIf"], [1, "multiselect-options"], ["class", "multiselect-option", 3, "click", 4, "ngFor", "ngForOf"], [1, "multiselect-actions"], ["class", "action-btn", 3, "click", 4, "ngIf"], [1, "action-btn", 3, "click"], [1, "multiselect-option", 3, "click"], [1, "option-checkbox"], ["name", "check", "class", "check-icon", 3, "size", 4, "ngIf"], [1, "option-label"], ["name", "check", 1, "check-icon", 3, "size"]], template: function CustomMultiSelectComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 0)(1, "div", 1);
    \u0275\u0275listener("click", function CustomMultiSelectComponent_Template_div_click_1_listener() {
      return ctx.toggleDropdown();
    });
    \u0275\u0275elementStart(2, "span", 2);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275element(4, "lucide-angular", 3);
    \u0275\u0275elementEnd();
    \u0275\u0275template(5, CustomMultiSelectComponent_div_5_Template, 4, 2, "div", 4);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275classProp("disabled", ctx.disabled);
    \u0275\u0275advance(2);
    \u0275\u0275classProp("placeholder", ctx.selectedValues.length === 0);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx.getDisplayText(), " ");
    \u0275\u0275advance();
    \u0275\u0275classProp("open", ctx.isOpen);
    \u0275\u0275property("size", 20);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.isOpen);
  }
}, dependencies: [CommonModule, NgForOf, NgIf, LucideAngularModule, LucideAngularComponent], styles: ["\n\n.custom-multiselect[_ngcontent-%COMP%] {\n  position: relative;\n  width: 100%;\n  min-width: 200px;\n}\n.custom-multiselect[_ngcontent-%COMP%]   .multiselect-trigger[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  height: 32px;\n  padding: 0 10px;\n  background: #1E293B;\n  border: 1px solid #334155;\n  border-radius: 6px;\n  cursor: pointer;\n  transition: all 0.2s ease;\n  -webkit-user-select: none;\n  user-select: none;\n}\n.custom-multiselect[_ngcontent-%COMP%]   .multiselect-trigger[_ngcontent-%COMP%]:hover:not(.disabled) {\n  border-color: #10B981;\n  background: #0F172A;\n}\n.custom-multiselect[_ngcontent-%COMP%]   .multiselect-trigger[_ngcontent-%COMP%]   .multiselect-value[_ngcontent-%COMP%] {\n  color: #ffffff;\n  font-size: 12px;\n  flex: 1;\n}\n.custom-multiselect[_ngcontent-%COMP%]   .multiselect-trigger[_ngcontent-%COMP%]   .multiselect-value.placeholder[_ngcontent-%COMP%] {\n  color: #64748b;\n}\n.custom-multiselect[_ngcontent-%COMP%]   .multiselect-trigger[_ngcontent-%COMP%]   .multiselect-icon[_ngcontent-%COMP%] {\n  color: #94a3b8;\n  transition: transform 0.2s ease;\n  flex-shrink: 0;\n  margin-left: 8px;\n}\n.custom-multiselect[_ngcontent-%COMP%]   .multiselect-trigger[_ngcontent-%COMP%]   .multiselect-icon.open[_ngcontent-%COMP%] {\n  transform: rotate(180deg);\n}\n.custom-multiselect[_ngcontent-%COMP%]   .multiselect-dropdown[_ngcontent-%COMP%] {\n  position: absolute;\n  top: calc(100% + 4px);\n  left: 0;\n  right: 0;\n  background: #1E293B;\n  border: 1px solid #334155;\n  border-radius: 8px;\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);\n  z-index: 1000;\n  animation: _ngcontent-%COMP%_slideDown 0.2s ease;\n}\n.custom-multiselect[_ngcontent-%COMP%]   .multiselect-dropdown[_ngcontent-%COMP%]   .multiselect-actions[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 8px;\n  padding: 10px;\n  border-bottom: 1px solid #334155;\n}\n.custom-multiselect[_ngcontent-%COMP%]   .multiselect-dropdown[_ngcontent-%COMP%]   .multiselect-actions[_ngcontent-%COMP%]   .action-btn[_ngcontent-%COMP%] {\n  flex: 1;\n  padding: 6px 12px;\n  background: transparent;\n  border: 1px solid #334155;\n  border-radius: 6px;\n  color: #10B981;\n  font-size: 13px;\n  cursor: pointer;\n  transition: all 0.2s ease;\n}\n.custom-multiselect[_ngcontent-%COMP%]   .multiselect-dropdown[_ngcontent-%COMP%]   .multiselect-actions[_ngcontent-%COMP%]   .action-btn[_ngcontent-%COMP%]:hover {\n  background: rgba(16, 185, 129, 0.1);\n  border-color: #10B981;\n}\n.custom-multiselect[_ngcontent-%COMP%]   .multiselect-dropdown[_ngcontent-%COMP%]   .multiselect-options[_ngcontent-%COMP%] {\n  max-height: 300px;\n  overflow-y: auto;\n}\n.custom-multiselect[_ngcontent-%COMP%]   .multiselect-dropdown[_ngcontent-%COMP%]   .multiselect-options[_ngcontent-%COMP%]::-webkit-scrollbar {\n  width: 6px;\n}\n.custom-multiselect[_ngcontent-%COMP%]   .multiselect-dropdown[_ngcontent-%COMP%]   .multiselect-options[_ngcontent-%COMP%]::-webkit-scrollbar-track {\n  background: transparent;\n}\n.custom-multiselect[_ngcontent-%COMP%]   .multiselect-dropdown[_ngcontent-%COMP%]   .multiselect-options[_ngcontent-%COMP%]::-webkit-scrollbar-thumb {\n  background: #334155;\n  border-radius: 3px;\n}\n.custom-multiselect[_ngcontent-%COMP%]   .multiselect-dropdown[_ngcontent-%COMP%]   .multiselect-options[_ngcontent-%COMP%]::-webkit-scrollbar-thumb:hover {\n  background: #475569;\n}\n.custom-multiselect[_ngcontent-%COMP%]   .multiselect-dropdown[_ngcontent-%COMP%]   .multiselect-options[_ngcontent-%COMP%]   .multiselect-option[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 10px 14px;\n  cursor: pointer;\n  transition: all 0.2s ease;\n}\n.custom-multiselect[_ngcontent-%COMP%]   .multiselect-dropdown[_ngcontent-%COMP%]   .multiselect-options[_ngcontent-%COMP%]   .multiselect-option[_ngcontent-%COMP%]:hover {\n  background: rgba(16, 185, 129, 0.05);\n}\n.custom-multiselect[_ngcontent-%COMP%]   .multiselect-dropdown[_ngcontent-%COMP%]   .multiselect-options[_ngcontent-%COMP%]   .multiselect-option[_ngcontent-%COMP%]   .option-checkbox[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  border: 2px solid #334155;\n  border-radius: 4px;\n  background: transparent;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  transition: all 0.2s ease;\n  flex-shrink: 0;\n}\n.custom-multiselect[_ngcontent-%COMP%]   .multiselect-dropdown[_ngcontent-%COMP%]   .multiselect-options[_ngcontent-%COMP%]   .multiselect-option[_ngcontent-%COMP%]   .option-checkbox[_ngcontent-%COMP%]   .check-icon[_ngcontent-%COMP%] {\n  color: #ffffff;\n}\n.custom-multiselect[_ngcontent-%COMP%]   .multiselect-dropdown[_ngcontent-%COMP%]   .multiselect-options[_ngcontent-%COMP%]   .multiselect-option[_ngcontent-%COMP%]   .option-checkbox.checked[_ngcontent-%COMP%] {\n  background: #10B981;\n  border-color: #10B981;\n}\n.custom-multiselect[_ngcontent-%COMP%]   .multiselect-dropdown[_ngcontent-%COMP%]   .multiselect-options[_ngcontent-%COMP%]   .multiselect-option[_ngcontent-%COMP%]   .option-label[_ngcontent-%COMP%] {\n  color: #ffffff;\n  font-size: 14px;\n  flex: 1;\n}\n.custom-multiselect.disabled[_ngcontent-%COMP%] {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n.custom-multiselect.disabled[_ngcontent-%COMP%]   .multiselect-trigger[_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  background: #0F172A;\n}\n@keyframes _ngcontent-%COMP%_slideDown {\n  from {\n    opacity: 0;\n    transform: translateY(-10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\nbody.light-theme[_nghost-%COMP%]   .custom-multiselect[_ngcontent-%COMP%]   .multiselect-trigger[_ngcontent-%COMP%], body.light-theme   [_nghost-%COMP%]   .custom-multiselect[_ngcontent-%COMP%]   .multiselect-trigger[_ngcontent-%COMP%] {\n  background: #ffffff;\n  border-color: #e2e8f0;\n}\nbody.light-theme[_nghost-%COMP%]   .custom-multiselect[_ngcontent-%COMP%]   .multiselect-trigger[_ngcontent-%COMP%]:hover:not(.disabled), body.light-theme   [_nghost-%COMP%]   .custom-multiselect[_ngcontent-%COMP%]   .multiselect-trigger[_ngcontent-%COMP%]:hover:not(.disabled) {\n  border-color: #10B981;\n  background: #f8fafc;\n}\nbody.light-theme[_nghost-%COMP%]   .custom-multiselect[_ngcontent-%COMP%]   .multiselect-trigger[_ngcontent-%COMP%]   .multiselect-value[_ngcontent-%COMP%], body.light-theme   [_nghost-%COMP%]   .custom-multiselect[_ngcontent-%COMP%]   .multiselect-trigger[_ngcontent-%COMP%]   .multiselect-value[_ngcontent-%COMP%] {\n  color: #0f172a;\n}\nbody.light-theme[_nghost-%COMP%]   .custom-multiselect[_ngcontent-%COMP%]   .multiselect-trigger[_ngcontent-%COMP%]   .multiselect-value.placeholder[_ngcontent-%COMP%], body.light-theme   [_nghost-%COMP%]   .custom-multiselect[_ngcontent-%COMP%]   .multiselect-trigger[_ngcontent-%COMP%]   .multiselect-value.placeholder[_ngcontent-%COMP%] {\n  color: #94a3b8;\n}\nbody.light-theme[_nghost-%COMP%]   .custom-multiselect[_ngcontent-%COMP%]   .multiselect-trigger[_ngcontent-%COMP%]   .multiselect-icon[_ngcontent-%COMP%], body.light-theme   [_nghost-%COMP%]   .custom-multiselect[_ngcontent-%COMP%]   .multiselect-trigger[_ngcontent-%COMP%]   .multiselect-icon[_ngcontent-%COMP%] {\n  color: #64748b;\n}\nbody.light-theme[_nghost-%COMP%]   .custom-multiselect[_ngcontent-%COMP%]   .multiselect-dropdown[_ngcontent-%COMP%], body.light-theme   [_nghost-%COMP%]   .custom-multiselect[_ngcontent-%COMP%]   .multiselect-dropdown[_ngcontent-%COMP%] {\n  background: #ffffff;\n  border-color: #e2e8f0;\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);\n}\nbody.light-theme[_nghost-%COMP%]   .custom-multiselect[_ngcontent-%COMP%]   .multiselect-dropdown[_ngcontent-%COMP%]   .multiselect-actions[_ngcontent-%COMP%], body.light-theme   [_nghost-%COMP%]   .custom-multiselect[_ngcontent-%COMP%]   .multiselect-dropdown[_ngcontent-%COMP%]   .multiselect-actions[_ngcontent-%COMP%] {\n  border-bottom-color: #e2e8f0;\n}\nbody.light-theme[_nghost-%COMP%]   .custom-multiselect[_ngcontent-%COMP%]   .multiselect-dropdown[_ngcontent-%COMP%]   .multiselect-actions[_ngcontent-%COMP%]   .action-btn[_ngcontent-%COMP%], body.light-theme   [_nghost-%COMP%]   .custom-multiselect[_ngcontent-%COMP%]   .multiselect-dropdown[_ngcontent-%COMP%]   .multiselect-actions[_ngcontent-%COMP%]   .action-btn[_ngcontent-%COMP%] {\n  border-color: #e2e8f0;\n  color: #10B981;\n}\nbody.light-theme[_nghost-%COMP%]   .custom-multiselect[_ngcontent-%COMP%]   .multiselect-dropdown[_ngcontent-%COMP%]   .multiselect-actions[_ngcontent-%COMP%]   .action-btn[_ngcontent-%COMP%]:hover, body.light-theme   [_nghost-%COMP%]   .custom-multiselect[_ngcontent-%COMP%]   .multiselect-dropdown[_ngcontent-%COMP%]   .multiselect-actions[_ngcontent-%COMP%]   .action-btn[_ngcontent-%COMP%]:hover {\n  background: rgba(16, 185, 129, 0.05);\n  border-color: #10B981;\n}\nbody.light-theme[_nghost-%COMP%]   .custom-multiselect[_ngcontent-%COMP%]   .multiselect-dropdown[_ngcontent-%COMP%]   .multiselect-options[_ngcontent-%COMP%]::-webkit-scrollbar-thumb, body.light-theme   [_nghost-%COMP%]   .custom-multiselect[_ngcontent-%COMP%]   .multiselect-dropdown[_ngcontent-%COMP%]   .multiselect-options[_ngcontent-%COMP%]::-webkit-scrollbar-thumb {\n  background: #cbd5e1;\n}\nbody.light-theme[_nghost-%COMP%]   .custom-multiselect[_ngcontent-%COMP%]   .multiselect-dropdown[_ngcontent-%COMP%]   .multiselect-options[_ngcontent-%COMP%]::-webkit-scrollbar-thumb:hover, body.light-theme   [_nghost-%COMP%]   .custom-multiselect[_ngcontent-%COMP%]   .multiselect-dropdown[_ngcontent-%COMP%]   .multiselect-options[_ngcontent-%COMP%]::-webkit-scrollbar-thumb:hover {\n  background: #94a3b8;\n}\nbody.light-theme[_nghost-%COMP%]   .custom-multiselect[_ngcontent-%COMP%]   .multiselect-dropdown[_ngcontent-%COMP%]   .multiselect-options[_ngcontent-%COMP%]   .multiselect-option[_ngcontent-%COMP%]:hover, body.light-theme   [_nghost-%COMP%]   .custom-multiselect[_ngcontent-%COMP%]   .multiselect-dropdown[_ngcontent-%COMP%]   .multiselect-options[_ngcontent-%COMP%]   .multiselect-option[_ngcontent-%COMP%]:hover {\n  background: rgba(16, 185, 129, 0.03);\n}\nbody.light-theme[_nghost-%COMP%]   .custom-multiselect[_ngcontent-%COMP%]   .multiselect-dropdown[_ngcontent-%COMP%]   .multiselect-options[_ngcontent-%COMP%]   .multiselect-option[_ngcontent-%COMP%]   .option-checkbox[_ngcontent-%COMP%], body.light-theme   [_nghost-%COMP%]   .custom-multiselect[_ngcontent-%COMP%]   .multiselect-dropdown[_ngcontent-%COMP%]   .multiselect-options[_ngcontent-%COMP%]   .multiselect-option[_ngcontent-%COMP%]   .option-checkbox[_ngcontent-%COMP%] {\n  border-color: #cbd5e1;\n}\nbody.light-theme[_nghost-%COMP%]   .custom-multiselect[_ngcontent-%COMP%]   .multiselect-dropdown[_ngcontent-%COMP%]   .multiselect-options[_ngcontent-%COMP%]   .multiselect-option[_ngcontent-%COMP%]   .option-checkbox.checked[_ngcontent-%COMP%], body.light-theme   [_nghost-%COMP%]   .custom-multiselect[_ngcontent-%COMP%]   .multiselect-dropdown[_ngcontent-%COMP%]   .multiselect-options[_ngcontent-%COMP%]   .multiselect-option[_ngcontent-%COMP%]   .option-checkbox.checked[_ngcontent-%COMP%] {\n  background: #10B981;\n  border-color: #10B981;\n}\nbody.light-theme[_nghost-%COMP%]   .custom-multiselect[_ngcontent-%COMP%]   .multiselect-dropdown[_ngcontent-%COMP%]   .multiselect-options[_ngcontent-%COMP%]   .multiselect-option[_ngcontent-%COMP%]   .option-label[_ngcontent-%COMP%], body.light-theme   [_nghost-%COMP%]   .custom-multiselect[_ngcontent-%COMP%]   .multiselect-dropdown[_ngcontent-%COMP%]   .multiselect-options[_ngcontent-%COMP%]   .multiselect-option[_ngcontent-%COMP%]   .option-label[_ngcontent-%COMP%] {\n  color: #0f172a;\n}\nbody.light-theme[_nghost-%COMP%]   .custom-multiselect.disabled[_ngcontent-%COMP%]   .multiselect-trigger[_ngcontent-%COMP%], body.light-theme   [_nghost-%COMP%]   .custom-multiselect.disabled[_ngcontent-%COMP%]   .multiselect-trigger[_ngcontent-%COMP%] {\n  background: #f8fafc;\n}\n/*# sourceMappingURL=custom-multiselect.component.css.map */"] });
var CustomMultiSelectComponent = _CustomMultiSelectComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CustomMultiSelectComponent, [{
    type: Component,
    args: [{ selector: "app-custom-multiselect", standalone: true, imports: [CommonModule, LucideAngularModule], providers: [
      {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => CustomMultiSelectComponent),
        multi: true
      }
    ], template: '<div class="custom-multiselect" [class.disabled]="disabled">\r\n  <div class="multiselect-trigger" (click)="toggleDropdown()">\r\n    <span class="multiselect-value" [class.placeholder]="selectedValues.length === 0">\r\n      {{ getDisplayText() }}\r\n    </span>\r\n    <lucide-angular name="chevron-down" [size]="20" class="multiselect-icon" [class.open]="isOpen"></lucide-angular>\r\n  </div>\r\n\r\n  <div class="multiselect-dropdown" *ngIf="isOpen">\r\n    <div class="multiselect-actions" *ngIf="showToggleAll || showClear">\r\n      <button class="action-btn" *ngIf="showToggleAll" (click)="selectAll()">Seleccionar todos</button>\r\n      <button class="action-btn" *ngIf="showClear" (click)="clearAll()">Limpiar</button>\r\n    </div>\r\n\r\n    <div class="multiselect-options">\r\n      <div\r\n        *ngFor="let option of options"\r\n        class="multiselect-option"\r\n        (click)="toggleOption(option)">\r\n        <div class="option-checkbox" [class.checked]="isSelected(option.value)">\r\n          <lucide-angular *ngIf="isSelected(option.value)" name="check" [size]="14" class="check-icon"></lucide-angular>\r\n        </div>\r\n        <span class="option-label">{{ option.label }}</span>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>\r\n', styles: ["/* src/app/shared/components/custom-ui/custom-multiselect/custom-multiselect.component.scss */\n.custom-multiselect {\n  position: relative;\n  width: 100%;\n  min-width: 200px;\n}\n.custom-multiselect .multiselect-trigger {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  height: 32px;\n  padding: 0 10px;\n  background: #1E293B;\n  border: 1px solid #334155;\n  border-radius: 6px;\n  cursor: pointer;\n  transition: all 0.2s ease;\n  -webkit-user-select: none;\n  user-select: none;\n}\n.custom-multiselect .multiselect-trigger:hover:not(.disabled) {\n  border-color: #10B981;\n  background: #0F172A;\n}\n.custom-multiselect .multiselect-trigger .multiselect-value {\n  color: #ffffff;\n  font-size: 12px;\n  flex: 1;\n}\n.custom-multiselect .multiselect-trigger .multiselect-value.placeholder {\n  color: #64748b;\n}\n.custom-multiselect .multiselect-trigger .multiselect-icon {\n  color: #94a3b8;\n  transition: transform 0.2s ease;\n  flex-shrink: 0;\n  margin-left: 8px;\n}\n.custom-multiselect .multiselect-trigger .multiselect-icon.open {\n  transform: rotate(180deg);\n}\n.custom-multiselect .multiselect-dropdown {\n  position: absolute;\n  top: calc(100% + 4px);\n  left: 0;\n  right: 0;\n  background: #1E293B;\n  border: 1px solid #334155;\n  border-radius: 8px;\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);\n  z-index: 1000;\n  animation: slideDown 0.2s ease;\n}\n.custom-multiselect .multiselect-dropdown .multiselect-actions {\n  display: flex;\n  gap: 8px;\n  padding: 10px;\n  border-bottom: 1px solid #334155;\n}\n.custom-multiselect .multiselect-dropdown .multiselect-actions .action-btn {\n  flex: 1;\n  padding: 6px 12px;\n  background: transparent;\n  border: 1px solid #334155;\n  border-radius: 6px;\n  color: #10B981;\n  font-size: 13px;\n  cursor: pointer;\n  transition: all 0.2s ease;\n}\n.custom-multiselect .multiselect-dropdown .multiselect-actions .action-btn:hover {\n  background: rgba(16, 185, 129, 0.1);\n  border-color: #10B981;\n}\n.custom-multiselect .multiselect-dropdown .multiselect-options {\n  max-height: 300px;\n  overflow-y: auto;\n}\n.custom-multiselect .multiselect-dropdown .multiselect-options::-webkit-scrollbar {\n  width: 6px;\n}\n.custom-multiselect .multiselect-dropdown .multiselect-options::-webkit-scrollbar-track {\n  background: transparent;\n}\n.custom-multiselect .multiselect-dropdown .multiselect-options::-webkit-scrollbar-thumb {\n  background: #334155;\n  border-radius: 3px;\n}\n.custom-multiselect .multiselect-dropdown .multiselect-options::-webkit-scrollbar-thumb:hover {\n  background: #475569;\n}\n.custom-multiselect .multiselect-dropdown .multiselect-options .multiselect-option {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 10px 14px;\n  cursor: pointer;\n  transition: all 0.2s ease;\n}\n.custom-multiselect .multiselect-dropdown .multiselect-options .multiselect-option:hover {\n  background: rgba(16, 185, 129, 0.05);\n}\n.custom-multiselect .multiselect-dropdown .multiselect-options .multiselect-option .option-checkbox {\n  width: 18px;\n  height: 18px;\n  border: 2px solid #334155;\n  border-radius: 4px;\n  background: transparent;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  transition: all 0.2s ease;\n  flex-shrink: 0;\n}\n.custom-multiselect .multiselect-dropdown .multiselect-options .multiselect-option .option-checkbox .check-icon {\n  color: #ffffff;\n}\n.custom-multiselect .multiselect-dropdown .multiselect-options .multiselect-option .option-checkbox.checked {\n  background: #10B981;\n  border-color: #10B981;\n}\n.custom-multiselect .multiselect-dropdown .multiselect-options .multiselect-option .option-label {\n  color: #ffffff;\n  font-size: 14px;\n  flex: 1;\n}\n.custom-multiselect.disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n.custom-multiselect.disabled .multiselect-trigger {\n  cursor: not-allowed;\n  background: #0F172A;\n}\n@keyframes slideDown {\n  from {\n    opacity: 0;\n    transform: translateY(-10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n:host-context(body.light-theme) .custom-multiselect .multiselect-trigger {\n  background: #ffffff;\n  border-color: #e2e8f0;\n}\n:host-context(body.light-theme) .custom-multiselect .multiselect-trigger:hover:not(.disabled) {\n  border-color: #10B981;\n  background: #f8fafc;\n}\n:host-context(body.light-theme) .custom-multiselect .multiselect-trigger .multiselect-value {\n  color: #0f172a;\n}\n:host-context(body.light-theme) .custom-multiselect .multiselect-trigger .multiselect-value.placeholder {\n  color: #94a3b8;\n}\n:host-context(body.light-theme) .custom-multiselect .multiselect-trigger .multiselect-icon {\n  color: #64748b;\n}\n:host-context(body.light-theme) .custom-multiselect .multiselect-dropdown {\n  background: #ffffff;\n  border-color: #e2e8f0;\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);\n}\n:host-context(body.light-theme) .custom-multiselect .multiselect-dropdown .multiselect-actions {\n  border-bottom-color: #e2e8f0;\n}\n:host-context(body.light-theme) .custom-multiselect .multiselect-dropdown .multiselect-actions .action-btn {\n  border-color: #e2e8f0;\n  color: #10B981;\n}\n:host-context(body.light-theme) .custom-multiselect .multiselect-dropdown .multiselect-actions .action-btn:hover {\n  background: rgba(16, 185, 129, 0.05);\n  border-color: #10B981;\n}\n:host-context(body.light-theme) .custom-multiselect .multiselect-dropdown .multiselect-options::-webkit-scrollbar-thumb {\n  background: #cbd5e1;\n}\n:host-context(body.light-theme) .custom-multiselect .multiselect-dropdown .multiselect-options::-webkit-scrollbar-thumb:hover {\n  background: #94a3b8;\n}\n:host-context(body.light-theme) .custom-multiselect .multiselect-dropdown .multiselect-options .multiselect-option:hover {\n  background: rgba(16, 185, 129, 0.03);\n}\n:host-context(body.light-theme) .custom-multiselect .multiselect-dropdown .multiselect-options .multiselect-option .option-checkbox {\n  border-color: #cbd5e1;\n}\n:host-context(body.light-theme) .custom-multiselect .multiselect-dropdown .multiselect-options .multiselect-option .option-checkbox.checked {\n  background: #10B981;\n  border-color: #10B981;\n}\n:host-context(body.light-theme) .custom-multiselect .multiselect-dropdown .multiselect-options .multiselect-option .option-label {\n  color: #0f172a;\n}\n:host-context(body.light-theme) .custom-multiselect.disabled .multiselect-trigger {\n  background: #f8fafc;\n}\n/*# sourceMappingURL=custom-multiselect.component.css.map */\n"] }]
  }], null, { options: [{
    type: Input
  }], placeholder: [{
    type: Input
  }], disabled: [{
    type: Input
  }], showToggleAll: [{
    type: Input
  }], showClear: [{
    type: Input
  }], selectionChange: [{
    type: Output
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(CustomMultiSelectComponent, { className: "CustomMultiSelectComponent", filePath: "src/app/shared/components/custom-ui/custom-multiselect/custom-multiselect.component.ts", lineNumber: 25 });
})();

// src/app/features/legacy/campaign/services/campaign.service.ts
var _CampaignService = class _CampaignService {
  constructor(http) {
    this.http = http;
    this.apiUrl = environment.webServiceUrl;
    this.httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    };
  }
  getDueDates() {
    return this.http.get(`${this.apiUrl}/campania/fechas-de-vencimiento-disponibles`, this.httpOptions);
  }
  getFileToCampa\u00F1a(request) {
    const headers = new HttpHeaders({
      "Content-Type": "application/json"
    });
    return this.http.post(`${this.apiUrl}/campania/generar-zip-reportes`, request, {
      headers,
      responseType: "blob"
    });
  }
};
_CampaignService.\u0275fac = function CampaignService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _CampaignService)(\u0275\u0275inject(HttpClient));
};
_CampaignService.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _CampaignService, factory: _CampaignService.\u0275fac, providedIn: "root" });
var CampaignService = _CampaignService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CampaignService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{ type: HttpClient }], null);
})();

// src/app/features/legacy/campaign/components/range-slider/range-slider.component.ts
function RangeSliderComponent_app_custom_select_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-custom-select", 23);
    \u0275\u0275twoWayListener("ngModelChange", function RangeSliderComponent_app_custom_select_13_Template_app_custom_select_ngModelChange_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.filterType, $event) || (ctx_r1.filterType = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.filterType);
    \u0275\u0275property("options", ctx_r1.filterTypeOptions);
  }
}
function RangeSliderComponent_app_custom_multiselect_14_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-custom-multiselect", 24);
    \u0275\u0275twoWayListener("ngModelChange", function RangeSliderComponent_app_custom_multiselect_14_Template_app_custom_multiselect_ngModelChange_0_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.dueDatesSelected, $event) || (ctx_r1.dueDatesSelected = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.dueDatesSelected);
    \u0275\u0275property("options", ctx_r1.dueDatesOptions)("placeholder", ctx_r1.getSelectedDatesLabel())("disabled", ctx_r1.isDatesDisabled());
  }
}
function RangeSliderComponent_app_custom_checkbox_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-custom-checkbox", 25);
    \u0275\u0275twoWayListener("ngModelChange", function RangeSliderComponent_app_custom_checkbox_15_Template_app_custom_checkbox_ngModelChange_0_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.contenido, $event) || (ctx_r1.contenido = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.contenido);
  }
}
function RangeSliderComponent_div_27_div_7_div_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 38)(1, "label", 39);
    \u0275\u0275text(2, "Hasta");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "app-custom-input-number", 46);
    \u0275\u0275twoWayListener("ngModelChange", function RangeSliderComponent_div_27_div_7_div_10_Template_app_custom_input_number_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r8);
      const range_r6 = \u0275\u0275nextContext().$implicit;
      \u0275\u0275twoWayBindingSet(range_r6.max, $event) || (range_r6.max = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function RangeSliderComponent_div_27_div_7_div_10_Template_app_custom_input_number_ngModelChange_3_listener() {
      \u0275\u0275restoreView(_r8);
      const i_r7 = \u0275\u0275nextContext().index;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onMaxInputChange(i_r7));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r8 = \u0275\u0275nextContext();
    const range_r6 = ctx_r8.$implicit;
    const i_r7 = ctx_r8.index;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", range_r6.max);
    \u0275\u0275property("min", 0)("disabled", range_r6.isChecked)("hasError", ctx_r1.contactoDirectoMaxErrors[i_r7]);
  }
}
function RangeSliderComponent_div_27_div_7_app_custom_checkbox_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-custom-checkbox", 47);
    \u0275\u0275twoWayListener("ngModelChange", function RangeSliderComponent_div_27_div_7_app_custom_checkbox_12_Template_app_custom_checkbox_ngModelChange_0_listener($event) {
      \u0275\u0275restoreView(_r10);
      const range_r6 = \u0275\u0275nextContext().$implicit;
      \u0275\u0275twoWayBindingSet(range_r6.isChecked, $event) || (range_r6.isChecked = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("checkedChange", function RangeSliderComponent_div_27_div_7_app_custom_checkbox_12_Template_app_custom_checkbox_checkedChange_0_listener() {
      \u0275\u0275restoreView(_r10);
      const i_r7 = \u0275\u0275nextContext().index;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.toggleCheck(i_r7));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const range_r6 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275twoWayProperty("ngModel", range_r6.isChecked);
    \u0275\u0275property("disabled", ctx_r1.isAnyChecked() && !range_r6.isChecked);
  }
}
function RangeSliderComponent_div_27_div_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 33)(1, "div", 34)(2, "span", 35);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 36)(5, "div", 37)(6, "div", 38)(7, "label", 39);
    \u0275\u0275text(8, "Desde");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "app-custom-input-number", 40);
    \u0275\u0275twoWayListener("ngModelChange", function RangeSliderComponent_div_27_div_7_Template_app_custom_input_number_ngModelChange_9_listener($event) {
      const range_r6 = \u0275\u0275restoreView(_r5).$implicit;
      \u0275\u0275twoWayBindingSet(range_r6.min, $event) || (range_r6.min = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function RangeSliderComponent_div_27_div_7_Template_app_custom_input_number_ngModelChange_9_listener() {
      const i_r7 = \u0275\u0275restoreView(_r5).index;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onMinInputChange(i_r7));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275template(10, RangeSliderComponent_div_27_div_7_div_10_Template, 4, 4, "div", 41);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "div", 42);
    \u0275\u0275template(12, RangeSliderComponent_div_27_div_7_app_custom_checkbox_12_Template, 1, 2, "app-custom-checkbox", 43);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "button", 44);
    \u0275\u0275listener("click", function RangeSliderComponent_div_27_div_7_Template_button_click_13_listener() {
      const i_r7 = \u0275\u0275restoreView(_r5).index;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.deleteRange(i_r7));
    });
    \u0275\u0275element(14, "lucide-angular", 45);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const range_r6 = ctx.$implicit;
    const i_r7 = ctx.index;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("Rango ", i_r7 + 1);
    \u0275\u0275advance(6);
    \u0275\u0275twoWayProperty("ngModel", range_r6.min);
    \u0275\u0275property("min", 0)("hasError", ctx_r1.contactoDirectoMinErrors[i_r7]);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !range_r6.isChecked);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", i_r7 === ctx_r1.contactoDirectoRanges.length - 1);
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 18);
  }
}
function RangeSliderComponent_div_27_div_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 48);
    \u0275\u0275element(1, "lucide-angular", 49);
    \u0275\u0275elementStart(2, "p", 50);
    \u0275\u0275text(3, "No hay rangos configurados");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p", 51);
    \u0275\u0275text(5, 'Haz clic en "A\xF1adir Rango" para comenzar');
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 48);
  }
}
function RangeSliderComponent_div_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 26)(1, "div", 27)(2, "h3", 28);
    \u0275\u0275text(3, "Contacto Directo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p", 29);
    \u0275\u0275text(5, "Define los rangos capitales para contacto directo");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 30);
    \u0275\u0275template(7, RangeSliderComponent_div_27_div_7_Template, 15, 7, "div", 31)(8, RangeSliderComponent_div_27_div_8_Template, 6, 1, "div", 32);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(7);
    \u0275\u0275property("ngForOf", ctx_r1.contactoDirectoRanges);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.contactoDirectoRanges.length === 0);
  }
}
function RangeSliderComponent_div_28_div_7_div_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 38)(1, "label", 39);
    \u0275\u0275text(2, "Hasta");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "app-custom-input-number", 46);
    \u0275\u0275twoWayListener("ngModelChange", function RangeSliderComponent_div_28_div_7_div_10_Template_app_custom_input_number_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r14);
      const range_r12 = \u0275\u0275nextContext().$implicit;
      \u0275\u0275twoWayBindingSet(range_r12.max, $event) || (range_r12.max = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function RangeSliderComponent_div_28_div_7_div_10_Template_app_custom_input_number_ngModelChange_3_listener() {
      \u0275\u0275restoreView(_r14);
      const i_r13 = \u0275\u0275nextContext().index;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onMaxInputChange(i_r13));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r14 = \u0275\u0275nextContext();
    const range_r12 = ctx_r14.$implicit;
    const i_r13 = ctx_r14.index;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", range_r12.max);
    \u0275\u0275property("min", 0)("disabled", range_r12.isChecked)("hasError", ctx_r1.contactoIndirectoMaxErrors[i_r13]);
  }
}
function RangeSliderComponent_div_28_div_7_app_custom_checkbox_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r16 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-custom-checkbox", 47);
    \u0275\u0275twoWayListener("ngModelChange", function RangeSliderComponent_div_28_div_7_app_custom_checkbox_12_Template_app_custom_checkbox_ngModelChange_0_listener($event) {
      \u0275\u0275restoreView(_r16);
      const range_r12 = \u0275\u0275nextContext().$implicit;
      \u0275\u0275twoWayBindingSet(range_r12.isChecked, $event) || (range_r12.isChecked = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("checkedChange", function RangeSliderComponent_div_28_div_7_app_custom_checkbox_12_Template_app_custom_checkbox_checkedChange_0_listener() {
      \u0275\u0275restoreView(_r16);
      const i_r13 = \u0275\u0275nextContext().index;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.toggleCheck(i_r13));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const range_r12 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275twoWayProperty("ngModel", range_r12.isChecked);
    \u0275\u0275property("disabled", ctx_r1.isAnyChecked() && !range_r12.isChecked);
  }
}
function RangeSliderComponent_div_28_div_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 33)(1, "div", 34)(2, "span", 35);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 36)(5, "div", 37)(6, "div", 38)(7, "label", 39);
    \u0275\u0275text(8, "Desde");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "app-custom-input-number", 40);
    \u0275\u0275twoWayListener("ngModelChange", function RangeSliderComponent_div_28_div_7_Template_app_custom_input_number_ngModelChange_9_listener($event) {
      const range_r12 = \u0275\u0275restoreView(_r11).$implicit;
      \u0275\u0275twoWayBindingSet(range_r12.min, $event) || (range_r12.min = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function RangeSliderComponent_div_28_div_7_Template_app_custom_input_number_ngModelChange_9_listener() {
      const i_r13 = \u0275\u0275restoreView(_r11).index;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onMinInputChange(i_r13));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275template(10, RangeSliderComponent_div_28_div_7_div_10_Template, 4, 4, "div", 41);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "div", 42);
    \u0275\u0275template(12, RangeSliderComponent_div_28_div_7_app_custom_checkbox_12_Template, 1, 2, "app-custom-checkbox", 43);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "button", 44);
    \u0275\u0275listener("click", function RangeSliderComponent_div_28_div_7_Template_button_click_13_listener() {
      const i_r13 = \u0275\u0275restoreView(_r11).index;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.deleteRange(i_r13));
    });
    \u0275\u0275element(14, "lucide-angular", 45);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const range_r12 = ctx.$implicit;
    const i_r13 = ctx.index;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("Rango ", i_r13 + 1);
    \u0275\u0275advance(6);
    \u0275\u0275twoWayProperty("ngModel", range_r12.min);
    \u0275\u0275property("min", 0)("hasError", ctx_r1.contactoIndirectoMinErrors[i_r13]);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !range_r12.isChecked);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", i_r13 === ctx_r1.contactoIndirectoRanges.length - 1);
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 18);
  }
}
function RangeSliderComponent_div_28_div_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 48);
    \u0275\u0275element(1, "lucide-angular", 49);
    \u0275\u0275elementStart(2, "p", 50);
    \u0275\u0275text(3, "No hay rangos configurados");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p", 51);
    \u0275\u0275text(5, 'Haz clic en "A\xF1adir Rango" para comenzar');
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 48);
  }
}
function RangeSliderComponent_div_28_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 26)(1, "div", 27)(2, "h3", 28);
    \u0275\u0275text(3, "Contacto Indirecto");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p", 29);
    \u0275\u0275text(5, "Define los rangos capitales para contacto indirecto");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 30);
    \u0275\u0275template(7, RangeSliderComponent_div_28_div_7_Template, 15, 7, "div", 31)(8, RangeSliderComponent_div_28_div_8_Template, 6, 1, "div", 32);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(7);
    \u0275\u0275property("ngForOf", ctx_r1.contactoIndirectoRanges);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.contactoIndirectoRanges.length === 0);
  }
}
function RangeSliderComponent_div_29_div_7_div_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r20 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 38)(1, "label", 39);
    \u0275\u0275text(2, "Hasta");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "app-custom-input-number", 46);
    \u0275\u0275twoWayListener("ngModelChange", function RangeSliderComponent_div_29_div_7_div_10_Template_app_custom_input_number_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r20);
      const range_r18 = \u0275\u0275nextContext().$implicit;
      \u0275\u0275twoWayBindingSet(range_r18.max, $event) || (range_r18.max = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function RangeSliderComponent_div_29_div_7_div_10_Template_app_custom_input_number_ngModelChange_3_listener() {
      \u0275\u0275restoreView(_r20);
      const i_r19 = \u0275\u0275nextContext().index;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onMaxInputChange(i_r19));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r20 = \u0275\u0275nextContext();
    const range_r18 = ctx_r20.$implicit;
    const i_r19 = ctx_r20.index;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", range_r18.max);
    \u0275\u0275property("min", 0)("disabled", range_r18.isChecked)("hasError", ctx_r1.promesasRotasMaxErrors[i_r19]);
  }
}
function RangeSliderComponent_div_29_div_7_app_custom_checkbox_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r22 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-custom-checkbox", 47);
    \u0275\u0275twoWayListener("ngModelChange", function RangeSliderComponent_div_29_div_7_app_custom_checkbox_12_Template_app_custom_checkbox_ngModelChange_0_listener($event) {
      \u0275\u0275restoreView(_r22);
      const range_r18 = \u0275\u0275nextContext().$implicit;
      \u0275\u0275twoWayBindingSet(range_r18.isChecked, $event) || (range_r18.isChecked = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("checkedChange", function RangeSliderComponent_div_29_div_7_app_custom_checkbox_12_Template_app_custom_checkbox_checkedChange_0_listener() {
      \u0275\u0275restoreView(_r22);
      const i_r19 = \u0275\u0275nextContext().index;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.toggleCheck(i_r19));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const range_r18 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275twoWayProperty("ngModel", range_r18.isChecked);
    \u0275\u0275property("disabled", ctx_r1.isAnyChecked() && !range_r18.isChecked);
  }
}
function RangeSliderComponent_div_29_div_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r17 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 33)(1, "div", 34)(2, "span", 35);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 36)(5, "div", 37)(6, "div", 38)(7, "label", 39);
    \u0275\u0275text(8, "Desde");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "app-custom-input-number", 40);
    \u0275\u0275twoWayListener("ngModelChange", function RangeSliderComponent_div_29_div_7_Template_app_custom_input_number_ngModelChange_9_listener($event) {
      const range_r18 = \u0275\u0275restoreView(_r17).$implicit;
      \u0275\u0275twoWayBindingSet(range_r18.min, $event) || (range_r18.min = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function RangeSliderComponent_div_29_div_7_Template_app_custom_input_number_ngModelChange_9_listener() {
      const i_r19 = \u0275\u0275restoreView(_r17).index;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onMinInputChange(i_r19));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275template(10, RangeSliderComponent_div_29_div_7_div_10_Template, 4, 4, "div", 41);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "div", 42);
    \u0275\u0275template(12, RangeSliderComponent_div_29_div_7_app_custom_checkbox_12_Template, 1, 2, "app-custom-checkbox", 43);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "button", 44);
    \u0275\u0275listener("click", function RangeSliderComponent_div_29_div_7_Template_button_click_13_listener() {
      const i_r19 = \u0275\u0275restoreView(_r17).index;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.deleteRange(i_r19));
    });
    \u0275\u0275element(14, "lucide-angular", 45);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const range_r18 = ctx.$implicit;
    const i_r19 = ctx.index;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("Rango ", i_r19 + 1);
    \u0275\u0275advance(6);
    \u0275\u0275twoWayProperty("ngModel", range_r18.min);
    \u0275\u0275property("min", 0)("hasError", ctx_r1.promesasRotasMinErrors[i_r19]);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !range_r18.isChecked);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", i_r19 === ctx_r1.promesasRotasRanges.length - 1);
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 18);
  }
}
function RangeSliderComponent_div_29_div_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 48);
    \u0275\u0275element(1, "lucide-angular", 49);
    \u0275\u0275elementStart(2, "p", 50);
    \u0275\u0275text(3, "No hay rangos configurados");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p", 51);
    \u0275\u0275text(5, 'Haz clic en "A\xF1adir Rango" para comenzar');
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 48);
  }
}
function RangeSliderComponent_div_29_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 26)(1, "div", 27)(2, "h3", 28);
    \u0275\u0275text(3, "Promesas Rotas");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p", 29);
    \u0275\u0275text(5, "Define los rangos capitales para promesas rotas");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 30);
    \u0275\u0275template(7, RangeSliderComponent_div_29_div_7_Template, 15, 7, "div", 31)(8, RangeSliderComponent_div_29_div_8_Template, 6, 1, "div", 32);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(7);
    \u0275\u0275property("ngForOf", ctx_r1.promesasRotasRanges);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.promesasRotasRanges.length === 0);
  }
}
function RangeSliderComponent_div_30_div_7_div_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r26 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 38)(1, "label", 39);
    \u0275\u0275text(2, "Hasta");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "app-custom-input-number", 46);
    \u0275\u0275twoWayListener("ngModelChange", function RangeSliderComponent_div_30_div_7_div_10_Template_app_custom_input_number_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r26);
      const range_r24 = \u0275\u0275nextContext().$implicit;
      \u0275\u0275twoWayBindingSet(range_r24.max, $event) || (range_r24.max = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function RangeSliderComponent_div_30_div_7_div_10_Template_app_custom_input_number_ngModelChange_3_listener() {
      \u0275\u0275restoreView(_r26);
      const i_r25 = \u0275\u0275nextContext().index;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onMaxInputChange(i_r25));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r26 = \u0275\u0275nextContext();
    const range_r24 = ctx_r26.$implicit;
    const i_r25 = ctx_r26.index;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", range_r24.max);
    \u0275\u0275property("min", 0)("disabled", range_r24.isChecked)("hasError", ctx_r1.noContactadoMaxErrors[i_r25]);
  }
}
function RangeSliderComponent_div_30_div_7_app_custom_checkbox_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r28 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-custom-checkbox", 47);
    \u0275\u0275twoWayListener("ngModelChange", function RangeSliderComponent_div_30_div_7_app_custom_checkbox_12_Template_app_custom_checkbox_ngModelChange_0_listener($event) {
      \u0275\u0275restoreView(_r28);
      const range_r24 = \u0275\u0275nextContext().$implicit;
      \u0275\u0275twoWayBindingSet(range_r24.isChecked, $event) || (range_r24.isChecked = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("checkedChange", function RangeSliderComponent_div_30_div_7_app_custom_checkbox_12_Template_app_custom_checkbox_checkedChange_0_listener() {
      \u0275\u0275restoreView(_r28);
      const i_r25 = \u0275\u0275nextContext().index;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.toggleCheck(i_r25));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const range_r24 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275twoWayProperty("ngModel", range_r24.isChecked);
    \u0275\u0275property("disabled", ctx_r1.isAnyChecked() && !range_r24.isChecked);
  }
}
function RangeSliderComponent_div_30_div_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r23 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 33)(1, "div", 34)(2, "span", 35);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 36)(5, "div", 37)(6, "div", 38)(7, "label", 39);
    \u0275\u0275text(8, "Desde");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "app-custom-input-number", 40);
    \u0275\u0275twoWayListener("ngModelChange", function RangeSliderComponent_div_30_div_7_Template_app_custom_input_number_ngModelChange_9_listener($event) {
      const range_r24 = \u0275\u0275restoreView(_r23).$implicit;
      \u0275\u0275twoWayBindingSet(range_r24.min, $event) || (range_r24.min = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function RangeSliderComponent_div_30_div_7_Template_app_custom_input_number_ngModelChange_9_listener() {
      const i_r25 = \u0275\u0275restoreView(_r23).index;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onMinInputChange(i_r25));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275template(10, RangeSliderComponent_div_30_div_7_div_10_Template, 4, 4, "div", 41);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "div", 42);
    \u0275\u0275template(12, RangeSliderComponent_div_30_div_7_app_custom_checkbox_12_Template, 1, 2, "app-custom-checkbox", 43);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "button", 44);
    \u0275\u0275listener("click", function RangeSliderComponent_div_30_div_7_Template_button_click_13_listener() {
      const i_r25 = \u0275\u0275restoreView(_r23).index;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.deleteRange(i_r25));
    });
    \u0275\u0275element(14, "lucide-angular", 45);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const range_r24 = ctx.$implicit;
    const i_r25 = ctx.index;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("Rango ", i_r25 + 1);
    \u0275\u0275advance(6);
    \u0275\u0275twoWayProperty("ngModel", range_r24.min);
    \u0275\u0275property("min", 0)("hasError", ctx_r1.noContactadoMinErrors[i_r25]);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !range_r24.isChecked);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", i_r25 === ctx_r1.noContactadoRanges.length - 1);
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 18);
  }
}
function RangeSliderComponent_div_30_div_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 48);
    \u0275\u0275element(1, "lucide-angular", 49);
    \u0275\u0275elementStart(2, "p", 50);
    \u0275\u0275text(3, "No hay rangos configurados");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p", 51);
    \u0275\u0275text(5, 'Haz clic en "A\xF1adir Rango" para comenzar');
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 48);
  }
}
function RangeSliderComponent_div_30_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 26)(1, "div", 27)(2, "h3", 28);
    \u0275\u0275text(3, "No Contactado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p", 29);
    \u0275\u0275text(5, "Define los rangos capitales para no contactados");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 30);
    \u0275\u0275template(7, RangeSliderComponent_div_30_div_7_Template, 15, 7, "div", 31)(8, RangeSliderComponent_div_30_div_8_Template, 6, 1, "div", 32);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(7);
    \u0275\u0275property("ngForOf", ctx_r1.noContactadoRanges);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.noContactadoRanges.length === 0);
  }
}
function RangeSliderComponent_div_31_Template(rf, ctx) {
  if (rf & 1) {
    const _r29 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 52);
    \u0275\u0275listener("click", function RangeSliderComponent_div_31_Template_div_click_0_listener($event) {
      \u0275\u0275restoreView(_r29);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275elementStart(1, "div", 53);
    \u0275\u0275listener("click", function RangeSliderComponent_div_31_Template_div_click_1_listener($event) {
      \u0275\u0275restoreView(_r29);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275elementStart(2, "div", 54)(3, "div", 55);
    \u0275\u0275element(4, "lucide-angular", 56);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 57)(6, "h3", 58);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "p", 29);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(10, "div", 59);
    \u0275\u0275element(11, "div", 60);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "div", 61)(13, "button", 62);
    \u0275\u0275listener("click", function RangeSliderComponent_div_31_Template_button_click_13_listener() {
      \u0275\u0275restoreView(_r29);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.cancelCampaignGeneration());
    });
    \u0275\u0275element(14, "lucide-angular", 63);
    \u0275\u0275elementStart(15, "span");
    \u0275\u0275text(16, "Cancelar");
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    let tmp_2_0;
    let tmp_3_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275property("size", 24);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", ((tmp_2_0 = ctx_r1.loadingModal().data) == null ? null : tmp_2_0.title) || "Procesando", " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ((tmp_3_0 = ctx_r1.loadingModal().data) == null ? null : tmp_3_0.subtitle) || "Por favor espere...", " ");
    \u0275\u0275advance(5);
    \u0275\u0275property("size", 18);
  }
}
var _RangeSliderComponent = class _RangeSliderComponent {
  constructor(campaignService, toastService, cdr) {
    this.campaignService = campaignService;
    this.toastService = toastService;
    this.cdr = cdr;
    this.campaignName = "Tramo 3";
    this.tramoOptions = [
      { label: "Tramo 3", value: "Tramo 3" },
      { label: "Tramo 5", value: "Tramo 5" },
      { label: "Contacto Total", value: "CONTACTO_TOTAL" }
    ];
    this.filterType = "saldoCapital";
    this.filterTypeOptions = [
      { label: "Saldo Capital", value: "saldoCapital" },
      { label: "Baja 30", value: "baja30" }
    ];
    this.dueDatesSelected = [];
    this.dueDatesOptions = [];
    this.contactoDirectoRanges = [];
    this.contactoIndirectoRanges = [];
    this.promesasRotasRanges = [];
    this.noContactadoRanges = [];
    this.contenido = true;
    this.excluirPagadasHoy = false;
    this.activeIndex = 3;
    this.tabs = [
      { title: "Contacto Directo" },
      { title: "Contacto Indirecto" },
      { title: "Promesas Rotas" },
      { title: "No Contactado" }
    ];
    this.contactoDirectoMinErrors = [];
    this.contactoDirectoMaxErrors = [];
    this.contactoIndirectoMinErrors = [];
    this.contactoIndirectoMaxErrors = [];
    this.promesasRotasMinErrors = [];
    this.promesasRotasMaxErrors = [];
    this.noContactadoMinErrors = [];
    this.noContactadoMaxErrors = [];
    this.lastEditedRangeIndex = -1;
    this.lastEditedField = "min";
    this.isGenerating = false;
    this.themeService = inject(ThemeService);
    this.isDarkMode = this.themeService.isDarkMode;
    this.loadingModal = signal({ isOpen: false }, ...ngDevMode ? [{ debugName: "loadingModal" }] : []);
    this.cancelGeneration$ = new Subject();
  }
  ngOnInit() {
    this.campaignService.getDueDates().subscribe({
      next: (dates) => {
        this.dueDatesOptions = dates.map((date) => ({ label: date, value: date }));
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error("Error al obtener fechas:", err);
        this.toastService.error("Error al cargar fechas de vencimiento");
        this.cdr.markForCheck();
      }
    });
    const initialRangesCd = [{ min: 0, max: 8e3, isChecked: true }];
    const initialRangesCi = [{ min: 0, max: 8e3, isChecked: true }];
    const initialRangesPr = [{ min: 0, max: 8e3, isChecked: true }];
    const initialRangesNc = [
      { min: 1e3, max: 2e3, isChecked: false },
      { min: 2e3, max: 3e3, isChecked: false },
      { min: 3e3, max: 4e3, isChecked: false },
      { min: 4e3, max: 5e3, isChecked: true }
    ];
    this.campaignName = "Tramo 3";
    this.contenido = true;
    this.contactoDirectoRanges = initialRangesCd.map((range) => __spreadValues({}, range));
    this.contactoIndirectoRanges = initialRangesCi.map((range) => __spreadValues({}, range));
    this.promesasRotasRanges = initialRangesPr.map((range) => __spreadValues({}, range));
    this.noContactadoRanges = initialRangesNc.map((range) => __spreadValues({}, range));
    this.updateErrorArrays();
    this.cdr.markForCheck();
  }
  updateErrorArrays() {
    this.contactoDirectoMinErrors = new Array(this.contactoDirectoRanges.length).fill(false);
    this.contactoDirectoMaxErrors = new Array(this.contactoDirectoRanges.length).fill(false);
    this.contactoIndirectoMinErrors = new Array(this.contactoIndirectoRanges.length).fill(false);
    this.contactoIndirectoMaxErrors = new Array(this.contactoIndirectoRanges.length).fill(false);
    this.promesasRotasMinErrors = new Array(this.promesasRotasRanges.length).fill(false);
    this.promesasRotasMaxErrors = new Array(this.promesasRotasRanges.length).fill(false);
    this.noContactadoMinErrors = new Array(this.noContactadoRanges.length).fill(false);
    this.noContactadoMaxErrors = new Array(this.noContactadoRanges.length).fill(false);
  }
  getActiveRanges() {
    switch (this.activeIndex) {
      case 0:
        return this.contactoDirectoRanges;
      case 1:
        return this.contactoIndirectoRanges;
      case 2:
        return this.promesasRotasRanges;
      case 3:
        return this.noContactadoRanges;
      default:
        return [];
    }
  }
  getActiveMinErrors() {
    switch (this.activeIndex) {
      case 0:
        return this.contactoDirectoMinErrors;
      case 1:
        return this.contactoIndirectoMinErrors;
      case 2:
        return this.promesasRotasMinErrors;
      case 3:
        return this.noContactadoMinErrors;
      default:
        return [];
    }
  }
  getActiveMaxErrors() {
    switch (this.activeIndex) {
      case 0:
        return this.contactoDirectoMaxErrors;
      case 1:
        return this.contactoIndirectoMaxErrors;
      case 2:
        return this.promesasRotasMaxErrors;
      case 3:
        return this.noContactadoMaxErrors;
      default:
        return [];
    }
  }
  onTabChange(index) {
    this.activeIndex = index;
    this.cdr.markForCheck();
  }
  addRange() {
    const ranges = this.getActiveRanges();
    if (ranges.length > 0) {
      const lastRange = ranges[ranges.length - 1];
      if (lastRange.isChecked) {
        lastRange.isChecked = false;
        lastRange.max = lastRange.min + 1e3;
      }
      const newRange = {
        min: lastRange.max,
        max: lastRange.max + 1e3,
        isChecked: true
      };
      ranges.push(newRange);
    } else {
      const newRange = { min: 0, max: 1e3, isChecked: false };
      ranges.push(newRange);
    }
    ranges.sort((a, b) => a.min - b.min);
    this.updateErrorArrays();
    this.clearAllErrors();
    this.cdr.markForCheck();
  }
  toggleCheck(index) {
    const ranges = this.getActiveRanges();
    ranges.forEach((range, i) => {
      if (i !== index) {
        range.isChecked = false;
      }
    });
    this.lastEditedRangeIndex = index;
    this.validateSpecificRange(index, "min");
    this.cdr.markForCheck();
  }
  isAnyChecked() {
    const ranges = this.getActiveRanges();
    return ranges.some((range) => range.isChecked);
  }
  deleteRange(index) {
    const ranges = this.getActiveRanges();
    ranges.splice(index, 1);
    this.updateErrorArrays();
    this.clearAllErrors();
    this.cdr.markForCheck();
  }
  clearAllErrors() {
    const minErrors = this.getActiveMinErrors();
    const maxErrors = this.getActiveMaxErrors();
    minErrors.fill(false);
    maxErrors.fill(false);
    this.lastEditedRangeIndex = -1;
  }
  validateSpecificRange(editedIndex, field) {
    const ranges = this.getActiveRanges();
    const minErrors = this.getActiveMinErrors();
    const maxErrors = this.getActiveMaxErrors();
    const editedRange = ranges[editedIndex];
    minErrors[editedIndex] = false;
    maxErrors[editedIndex] = false;
    if (!editedRange.isChecked && editedRange.min >= editedRange.max) {
      if (field === "min") {
        minErrors[editedIndex] = true;
      } else {
        maxErrors[editedIndex] = true;
      }
      return;
    }
    let hasOverlap = false;
    for (let i = 0; i < ranges.length; i++) {
      if (i === editedIndex)
        continue;
      const otherRange = ranges[i];
      let overlaps = false;
      if (!editedRange.isChecked && !otherRange.isChecked) {
        overlaps = editedRange.min < otherRange.max && editedRange.max > otherRange.min;
      } else if (editedRange.isChecked && !otherRange.isChecked) {
        overlaps = otherRange.max > editedRange.min;
      } else if (!editedRange.isChecked && otherRange.isChecked) {
        overlaps = editedRange.max > otherRange.min;
      } else if (editedRange.isChecked && otherRange.isChecked) {
        overlaps = true;
      }
      if (overlaps) {
        hasOverlap = true;
        break;
      }
    }
    if (hasOverlap) {
      if (field === "min") {
        minErrors[editedIndex] = true;
      } else {
        maxErrors[editedIndex] = true;
      }
    }
  }
  onMinInputChange(index) {
    this.lastEditedRangeIndex = index;
    this.lastEditedField = "min";
    setTimeout(() => {
      this.validateSpecificRange(index, "min");
      this.cdr.markForCheck();
    }, 0);
  }
  onMaxInputChange(index) {
    this.lastEditedRangeIndex = index;
    this.lastEditedField = "max";
    setTimeout(() => {
      this.validateSpecificRange(index, "max");
      this.cdr.markForCheck();
    }, 0);
  }
  validateRanges() {
    let isValid = true;
    const sections = [
      {
        ranges: this.contactoDirectoRanges,
        minErrors: this.contactoDirectoMinErrors,
        maxErrors: this.contactoDirectoMaxErrors
      },
      {
        ranges: this.contactoIndirectoRanges,
        minErrors: this.contactoIndirectoMinErrors,
        maxErrors: this.contactoIndirectoMaxErrors
      },
      {
        ranges: this.promesasRotasRanges,
        minErrors: this.promesasRotasMinErrors,
        maxErrors: this.promesasRotasMaxErrors
      },
      {
        ranges: this.noContactadoRanges,
        minErrors: this.noContactadoMinErrors,
        maxErrors: this.noContactadoMaxErrors
      }
    ];
    for (const section of sections) {
      const { ranges, minErrors, maxErrors } = section;
      minErrors.fill(false);
      maxErrors.fill(false);
      for (let i = 0; i < ranges.length; i++) {
        const current = ranges[i];
        if (!current.isChecked && current.min >= current.max) {
          minErrors[i] = true;
          maxErrors[i] = true;
          isValid = false;
          continue;
        }
        for (let j = i + 1; j < ranges.length; j++) {
          const other = ranges[j];
          let hasOverlap = false;
          if (!current.isChecked && !other.isChecked) {
            hasOverlap = current.min < other.max && current.max > other.min;
          } else if (current.isChecked && !other.isChecked) {
            hasOverlap = other.min < current.min;
          } else if (!current.isChecked && other.isChecked) {
            hasOverlap = current.max > other.min;
          } else if (current.isChecked && other.isChecked) {
            hasOverlap = true;
          }
          if (hasOverlap) {
            minErrors[i] = true;
            maxErrors[i] = true;
            minErrors[j] = true;
            maxErrors[j] = true;
            isValid = false;
          }
        }
      }
    }
    if (!isValid) {
      this.toastService.error("Por favor, corrige los rangos marcados en rojo antes de continuar");
      this.cdr.markForCheck();
    }
    return isValid;
  }
  onTramoChange() {
    if (this.campaignName === "Tramo 5" || this.campaignName === "CONTACTO_TOTAL") {
      this.dueDatesSelected = [];
      this.contenido = false;
      this.filterType = "saldoCapital";
    } else {
      this.contenido = true;
    }
    this.cdr.markForCheck();
  }
  isDatesDisabled() {
    return this.campaignName === "Tramo 5" || this.campaignName === "CONTACTO_TOTAL";
  }
  getSelectedDatesLabel() {
    const count = this.dueDatesSelected.length;
    if (count === 0) {
      return "Fechas de vencimiento";
    }
    return count === 1 ? "1 fecha seleccionada" : `${count} fechas seleccionadas`;
  }
  printRanges() {
    console.log("\u{1F680} printRanges() llamado");
    if (this.isGenerating) {
      console.log("\u23F8\uFE0F Ya se est\xE1 generando, saliendo...");
      return;
    }
    console.log("\u2705 Validando rangos...");
    if (!this.validateRanges()) {
      console.log("\u274C Validaci\xF3n fall\xF3");
      return;
    }
    console.log("\u2705 Validaci\xF3n exitosa, iniciando generaci\xF3n...");
    this.isGenerating = true;
    this.loadingModal.set({
      isOpen: true,
      data: {
        title: "Generando Campa\xF1a",
        subtitle: "Procesando rangos y generando archivos..."
      }
    });
    const contactoDirectoRangesToConsult = this.contactoDirectoRanges.map((range) => ({
      min: range.min.toString(),
      max: range.isChecked ? "+" : range.max.toString()
    }));
    const contactoIndirectoRangesToConsult = this.contactoIndirectoRanges.map((range) => ({
      min: range.min.toString(),
      max: range.isChecked ? "+" : range.max.toString()
    }));
    const promesasRotasRangesToConsult = this.promesasRotasRanges.map((range) => ({
      min: range.min.toString(),
      max: range.isChecked ? "+" : range.max.toString()
    }));
    const noContactadoRangesToConsult = this.noContactadoRanges.map((range) => ({
      min: range.min.toString(),
      max: range.isChecked ? "+" : range.max.toString()
    }));
    const request = {
      campaignName: this.campaignName,
      filterType: this.filterType,
      dueDates: this.dueDatesSelected,
      directContactRanges: contactoDirectoRangesToConsult,
      indirectContactRanges: contactoIndirectoRangesToConsult,
      brokenPromisesRanges: promesasRotasRangesToConsult,
      notContactedRanges: noContactadoRangesToConsult,
      content: !this.contenido,
      excluirPagadasHoy: this.excluirPagadasHoy
    };
    this.campaignService.getFileToCampa\u00F1a(request).pipe(takeUntil(this.cancelGeneration$)).subscribe({
      next: (data) => {
        const url = window.URL.createObjectURL(data);
        const a = document.createElement("a");
        a.href = url;
        a.download = "output-files.zip";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        this.toastService.success("Los rangos han sido procesados correctamente");
        this.isGenerating = false;
        this.loadingModal.set({ isOpen: false });
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error(error);
        if (error?.name === "AbortError" || error === "cancelled") {
          this.toastService.info("Generaci\xF3n de campa\xF1a cancelada");
        } else {
          this.toastService.error("Un error ha ocurrido al procesar los rangos");
        }
        this.isGenerating = false;
        this.loadingModal.set({ isOpen: false });
        this.cdr.markForCheck();
      }
    });
  }
  cancelCampaignGeneration() {
    this.cancelGeneration$.next();
    this.isGenerating = false;
    this.loadingModal.set({ isOpen: false });
    this.toastService.info("Generaci\xF3n de campa\xF1a cancelada");
    this.cdr.markForCheck();
  }
};
_RangeSliderComponent.\u0275fac = function RangeSliderComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _RangeSliderComponent)(\u0275\u0275directiveInject(CampaignService), \u0275\u0275directiveInject(ToastService), \u0275\u0275directiveInject(ChangeDetectorRef));
};
_RangeSliderComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _RangeSliderComponent, selectors: [["app-range-slider"]], decls: 32, vars: 31, consts: [[1, "min-h-screen", "p-4", "transition-colors", "duration-300"], [1, "flex", "items-center", "gap-2", "mb-3"], [1, "w-8", "h-8", "bg-gradient-to-br", "from-blue-600", "to-purple-700", "rounded-lg", "flex", "items-center", "justify-center"], ["name", "megaphone", 1, "text-white!", 3, "size"], [1, "text-lg", "font-bold", "text-slate-900", "dark:text-white"], [1, "text-xs", "text-slate-600", "dark:text-slate-400"], [1, "bg-white", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-slate-700", "rounded-lg", "shadow-sm", "p-3", "mb-3"], [1, "flex", "flex-wrap", "justify-between", "items-center", "gap-3"], [1, "flex", "flex-wrap", "gap-2", "items-center", "flex-1"], ["placeholder", "Seleccionar tramo", 3, "ngModelChange", "selectionChange", "ngModel", "options"], ["placeholder", "Tipo de filtro", 3, "ngModel", "options", "ngModelChange", 4, "ngIf"], [3, "ngModel", "options", "placeholder", "disabled", "ngModelChange", 4, "ngIf"], ["label", "No contenidos", 3, "ngModel", "ngModelChange", 4, "ngIf"], [1, "flex", "gap-2", "flex-shrink-0"], [1, "flex", "items-center", "gap-2", "px-4", "py-2", "border-2", "border-blue-500", "text-blue-500", "hover:bg-blue-500", "hover:text-white", "rounded-lg", "font-medium", "text-sm", "transition-all", 3, "click"], ["name", "plus", 3, "size"], [1, "hover:cursor-pointer"], [1, "flex", "items-center", "gap-2", "px-4", "py-2", "bg-gradient-to-r", "from-blue-500", "to-purple-600", "hover:from-blue-600", "hover:to-purple-700", "text-white", "rounded-lg", "font-medium", "text-sm", "transition-all", "shadow-md", "cursor-pointer", 3, "click"], ["name", "send", 3, "size"], [1, "bg-white", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-slate-700", "rounded-lg", "shadow-sm"], [1, "w-full", 3, "activeIndexChange", "tabChange", "tabs", "activeIndex"], ["class", "p-3 w-full", 4, "ngIf"], ["class", "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm", 3, "click", 4, "ngIf"], ["placeholder", "Tipo de filtro", 3, "ngModelChange", "ngModel", "options"], [3, "ngModelChange", "ngModel", "options", "placeholder", "disabled"], ["label", "No contenidos", 3, "ngModelChange", "ngModel"], [1, "p-3", "w-full"], [1, "mb-3", "pb-3", "border-b-2", "border-gray-200", "dark:border-slate-700"], [1, "text-lg", "font-semibold", "text-slate-900", "dark:text-slate-100", "mb-1"], [1, "text-sm", "text-slate-600", "dark:text-slate-400"], [1, "flex", "flex-col", "gap-3"], ["class", "bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md p-3 transition-all hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md", 4, "ngFor", "ngForOf"], ["class", "text-center p-12 text-slate-400 bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg", 4, "ngIf"], [1, "bg-slate-50", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "rounded-md", "p-3", "transition-all", "hover:border-slate-300", "dark:hover:border-slate-600", "hover:shadow-md"], [1, "flex", "items-center", "gap-3", "w-full"], [1, "font-semibold", "text-slate-900", "dark:text-slate-100", "text-sm", "px-3", "py-2", "bg-slate-200", "dark:bg-slate-700", "rounded", "border", "border-slate-300", "dark:border-slate-600", "flex-shrink-0", "min-w-[90px]", "text-center"], [1, "flex", "items-center", "gap-3", "flex-1", "flex-wrap"], [1, "flex", "items-center", "gap-3", "flex-1", "min-w-[300px]"], [1, "flex", "flex-col", "min-w-[100px]", "flex-1"], [1, "text-xs", "font-medium", "text-slate-600", "dark:text-slate-400", "mb-1"], [3, "ngModelChange", "ngModel", "min", "hasError"], ["class", "flex flex-col min-w-[100px] flex-1", 4, "ngIf"], [1, "flex", "items-center", "flex-shrink-0"], ["label", "Sin l\xEDmite superior", 3, "ngModel", "disabled", "ngModelChange", "checkedChange", 4, "ngIf"], [1, "flex", "items-center", "justify-center", "p-2", "rounded-md", "bg-transparent", "border-none", "cursor-pointer", "transition-all", "text-slate-500", "dark:text-slate-400", "hover:bg-red-50", "dark:hover:bg-red-900/20", "hover:text-red-600", "dark:hover:text-red-400", 3, "click"], ["name", "trash-2", 3, "size"], [3, "ngModelChange", "ngModel", "min", "disabled", "hasError"], ["label", "Sin l\xEDmite superior", 3, "ngModelChange", "checkedChange", "ngModel", "disabled"], [1, "text-center", "p-12", "text-slate-400", "bg-slate-50", "dark:bg-slate-800", "border-2", "border-dashed", "border-slate-300", "dark:border-slate-700", "rounded-lg"], ["name", "inbox", 1, "mx-auto", "text-slate-300", "dark:text-slate-600", 3, "size"], [1, "mt-3", "text-base", "font-medium", "text-slate-600", "dark:text-slate-400"], [1, "text-sm", "text-slate-500", "dark:text-slate-500"], [1, "fixed", "inset-0", "z-50", "flex", "items-center", "justify-center", "bg-black", "bg-opacity-50", "backdrop-blur-sm", 3, "click"], [1, "bg-white", "dark:bg-slate-900", "rounded-lg", "shadow-2xl", "p-6", "max-w-md", "w-full", "mx-4", "border", "border-slate-200", "dark:border-slate-700", 3, "click"], [1, "flex", "items-center", "gap-3", "mb-4"], [1, "flex", "items-center", "justify-center", "w-12", "h-12", "bg-gradient-to-br", "from-blue-500", "to-purple-600", "rounded-full"], ["name", "loader", 1, "text-white", "animate-spin", 3, "size"], [1, "flex-1"], [1, "text-lg", "font-semibold", "text-slate-900", "dark:text-white"], [1, "w-full", "bg-slate-200", "dark:bg-slate-700", "rounded-full", "h-2", "mb-4", "overflow-hidden"], [1, "bg-gradient-to-r", "from-blue-500", "to-purple-600", "h-full", "rounded-full", "animate-pulse"], [1, "flex", "justify-end"], [1, "flex", "items-center", "gap-2", "px-4", "py-2", "bg-slate-200", "dark:bg-slate-700", "hover:bg-slate-300", "dark:hover:bg-slate-600", "text-slate-900", "dark:text-white", "rounded-lg", "font-medium", "text-sm", "transition-all", "cursor-pointer", 3, "click"], ["name", "x-circle", 3, "size"]], template: function RangeSliderComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2);
    \u0275\u0275element(3, "lucide-angular", 3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div")(5, "h1", 4);
    \u0275\u0275text(6, "Generaci\xF3n de Campa\xF1as");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p", 5);
    \u0275\u0275text(8, "Configuraci\xF3n de rangos y filtros para generar archivos de campa\xF1a");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(9, "div", 6)(10, "div", 7)(11, "div", 8)(12, "app-custom-select", 9);
    \u0275\u0275twoWayListener("ngModelChange", function RangeSliderComponent_Template_app_custom_select_ngModelChange_12_listener($event) {
      \u0275\u0275twoWayBindingSet(ctx.campaignName, $event) || (ctx.campaignName = $event);
      return $event;
    });
    \u0275\u0275listener("selectionChange", function RangeSliderComponent_Template_app_custom_select_selectionChange_12_listener() {
      return ctx.onTramoChange();
    });
    \u0275\u0275elementEnd();
    \u0275\u0275template(13, RangeSliderComponent_app_custom_select_13_Template, 1, 2, "app-custom-select", 10)(14, RangeSliderComponent_app_custom_multiselect_14_Template, 1, 4, "app-custom-multiselect", 11)(15, RangeSliderComponent_app_custom_checkbox_15_Template, 1, 1, "app-custom-checkbox", 12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "div", 13)(17, "button", 14);
    \u0275\u0275listener("click", function RangeSliderComponent_Template_button_click_17_listener() {
      return ctx.addRange();
    });
    \u0275\u0275element(18, "lucide-angular", 15);
    \u0275\u0275elementStart(19, "span", 16);
    \u0275\u0275text(20, "A\xF1adir Rango");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(21, "button", 17);
    \u0275\u0275listener("click", function RangeSliderComponent_Template_button_click_21_listener() {
      return ctx.printRanges();
    });
    \u0275\u0275element(22, "lucide-angular", 18);
    \u0275\u0275elementStart(23, "span");
    \u0275\u0275text(24, "Generar Campa\xF1a");
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275elementStart(25, "div", 19)(26, "app-custom-tabs", 20);
    \u0275\u0275twoWayListener("activeIndexChange", function RangeSliderComponent_Template_app_custom_tabs_activeIndexChange_26_listener($event) {
      \u0275\u0275twoWayBindingSet(ctx.activeIndex, $event) || (ctx.activeIndex = $event);
      return $event;
    });
    \u0275\u0275listener("tabChange", function RangeSliderComponent_Template_app_custom_tabs_tabChange_26_listener($event) {
      return ctx.onTabChange($event);
    });
    \u0275\u0275template(27, RangeSliderComponent_div_27_Template, 9, 2, "div", 21)(28, RangeSliderComponent_div_28_Template, 9, 2, "div", 21)(29, RangeSliderComponent_div_29_Template, 9, 2, "div", 21)(30, RangeSliderComponent_div_30_Template, 9, 2, "div", 21);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(31, RangeSliderComponent_div_31_Template, 17, 4, "div", 22);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275classProp("dark", ctx.isDarkMode())("bg-gradient-to-br", true)("from-slate-50", !ctx.isDarkMode())("via-blue-50", !ctx.isDarkMode())("to-slate-100", !ctx.isDarkMode())("from-slate-950", ctx.isDarkMode())("via-gray-950", ctx.isDarkMode())("to-black", ctx.isDarkMode());
    \u0275\u0275advance(3);
    \u0275\u0275property("size", 16);
    \u0275\u0275advance(9);
    \u0275\u0275twoWayProperty("ngModel", ctx.campaignName);
    \u0275\u0275property("options", ctx.tramoOptions);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.campaignName === "Tramo 3");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.campaignName === "Tramo 3");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.campaignName === "Tramo 3");
    \u0275\u0275advance(3);
    \u0275\u0275property("size", 18);
    \u0275\u0275advance(4);
    \u0275\u0275property("size", 18);
    \u0275\u0275advance(4);
    \u0275\u0275property("tabs", ctx.tabs);
    \u0275\u0275twoWayProperty("activeIndex", ctx.activeIndex);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.activeIndex === 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.activeIndex === 1);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.activeIndex === 2);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.activeIndex === 3);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.loadingModal().isOpen);
  }
}, dependencies: [
  CommonModule,
  NgForOf,
  NgIf,
  FormsModule,
  NgControlStatus,
  NgModel,
  CustomSelectComponent,
  CustomInputNumberComponent,
  CustomCheckboxComponent,
  CustomTabsComponent,
  CustomMultiSelectComponent,
  LucideAngularModule,
  LucideAngularComponent
], styles: ['@charset "UTF-8";\n\n\n\n@media screen and (max-width: 1400px) {\n  .min-w-\\__ph-0__[_ngcontent-%COMP%] {\n    min-width: 200px;\n  }\n}\n@media screen and (max-width: 768px) {\n  .min-w-\\__ph-0__[_ngcontent-%COMP%] {\n    min-width: auto;\n    width: 100%;\n  }\n  .min-w-\\__ph-0__[_ngcontent-%COMP%] {\n    width: 100%;\n  }\n}\n.min-h-screen[_ngcontent-%COMP%]:not(.dark) {\n  background:\n    linear-gradient(\n      to bottom right,\n      rgb(248, 250, 252),\n      rgb(239, 246, 255),\n      rgb(241, 245, 249)) !important;\n}\n.min-h-screen[_ngcontent-%COMP%]:not(.dark)   *[_ngcontent-%COMP%] {\n}\n.min-h-screen[_ngcontent-%COMP%]:not(.dark)   *[class*="dark:from-slate-950"][_ngcontent-%COMP%] {\n  background: none !important;\n}\n.min-h-screen[_ngcontent-%COMP%]:not(.dark)   *[class*="dark:via-gray-950"][_ngcontent-%COMP%] {\n  background: none !important;\n}\n.min-h-screen[_ngcontent-%COMP%]:not(.dark)   *[class*="dark:to-black"][_ngcontent-%COMP%] {\n  background: none !important;\n}\n.min-h-screen[_ngcontent-%COMP%]:not(.dark)   *[class*="dark:bg-slate-900"][_ngcontent-%COMP%] {\n  background-color: white !important;\n}\n.min-h-screen[_ngcontent-%COMP%]:not(.dark)   *[class*="dark:bg-slate-800"][_ngcontent-%COMP%] {\n  background-color: rgb(241, 245, 249) !important;\n}\n.min-h-screen[_ngcontent-%COMP%]:not(.dark)   *[class*="dark:bg-slate-700"][_ngcontent-%COMP%] {\n  background-color: rgb(203, 213, 225) !important;\n}\n.min-h-screen[_ngcontent-%COMP%]:not(.dark)   *[class*="dark:bg-gray-700"][_ngcontent-%COMP%] {\n  background-color: rgb(203, 213, 225) !important;\n}\n.min-h-screen[_ngcontent-%COMP%]:not(.dark)   *[class*="dark:bg-slate-600"][_ngcontent-%COMP%] {\n  background-color: rgb(226, 232, 240) !important;\n}\n.min-h-screen[_ngcontent-%COMP%]:not(.dark)   *[class*="dark:text-white"][_ngcontent-%COMP%] {\n  color: rgb(15, 23, 42) !important;\n}\n.min-h-screen[_ngcontent-%COMP%]:not(.dark)   *[class*="dark:text-slate-100"][_ngcontent-%COMP%] {\n  color: rgb(15, 23, 42) !important;\n}\n.min-h-screen[_ngcontent-%COMP%]:not(.dark)   *[class*="dark:text-slate-400"][_ngcontent-%COMP%] {\n  color: rgb(71, 85, 105) !important;\n}\n.min-h-screen[_ngcontent-%COMP%]:not(.dark)   *[class*="dark:text-slate-300"][_ngcontent-%COMP%] {\n  color: rgb(51, 65, 85) !important;\n}\n.min-h-screen[_ngcontent-%COMP%]:not(.dark)   *[class*="dark:text-slate-500"][_ngcontent-%COMP%] {\n  color: rgb(100, 116, 139) !important;\n}\n.min-h-screen[_ngcontent-%COMP%]:not(.dark)   *[class*="dark:border-slate-700"][_ngcontent-%COMP%] {\n  border-color: rgb(203, 213, 225) !important;\n}\n.min-h-screen[_ngcontent-%COMP%]:not(.dark)   *[class*="dark:border-slate-600"][_ngcontent-%COMP%] {\n  border-color: rgb(148, 163, 184) !important;\n}\n.min-h-screen[_ngcontent-%COMP%]:not(.dark)   div[class*=bg-slate-50][_ngcontent-%COMP%] {\n  background-color: rgb(241, 245, 249) !important;\n}\n.min-h-screen[_ngcontent-%COMP%]:not(.dark)   span[class*=bg-slate-200][_ngcontent-%COMP%] {\n  background-color: rgb(226, 232, 240) !important;\n}\n.min-h-screen[_ngcontent-%COMP%]:not(.dark)   label[class*=text-slate-600][_ngcontent-%COMP%] {\n  color: rgb(71, 85, 105) !important;\n}\n.min-h-screen[_ngcontent-%COMP%]:not(.dark)   div[class*=border-slate-200][_ngcontent-%COMP%] {\n  border-color: rgb(203, 213, 225) !important;\n}\n.min-h-screen[_ngcontent-%COMP%]:not(.dark)   lucide-angular[class*=text-white][_ngcontent-%COMP%] {\n  color: white !important;\n}\n.min-h-screen[_ngcontent-%COMP%]:not(.dark)   div[class*=from-blue-600][class*=to-purple-700][_ngcontent-%COMP%]   lucide-angular[_ngcontent-%COMP%] {\n  color: white !important;\n}\n.min-h-screen[_ngcontent-%COMP%]:not(.dark)   button[class*=border-blue-500][class*=text-blue-500][_ngcontent-%COMP%] {\n  color: rgb(59, 130, 246) !important;\n}\n.min-h-screen[_ngcontent-%COMP%]:not(.dark)   button[class*=from-blue-500][class*=to-purple-600][_ngcontent-%COMP%] {\n  color: white !important;\n}\n.min-h-screen[_ngcontent-%COMP%]:not(.dark)   app-custom-tabs[_ngcontent-%COMP%]     .tabs-header {\n  background: white !important;\n  border-bottom-color: rgb(226, 232, 240) !important;\n}\n.min-h-screen[_ngcontent-%COMP%]:not(.dark)   app-custom-tabs[_ngcontent-%COMP%]     .tabs-header .tab-button {\n  color: rgb(100, 116, 139) !important;\n}\n.min-h-screen[_ngcontent-%COMP%]:not(.dark)   app-custom-tabs[_ngcontent-%COMP%]     .tabs-header .tab-button:hover:not(.active) {\n  color: rgb(71, 85, 105) !important;\n  background: rgba(0, 0, 0, 0.02) !important;\n}\n.min-h-screen[_ngcontent-%COMP%]:not(.dark)   app-custom-tabs[_ngcontent-%COMP%]     .tabs-header .tab-button.active {\n  color: rgb(16, 185, 129) !important;\n  border-bottom-color: rgb(16, 185, 129) !important;\n  background: rgba(16, 185, 129, 0.05) !important;\n}\n.min-h-screen.dark[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      to bottom right,\n      rgb(2, 6, 23),\n      rgb(17, 24, 39),\n      rgb(0, 0, 0)) !important;\n}\n.min-h-screen.dark[_ngcontent-%COMP%]   *[class*=bg-white][_ngcontent-%COMP%] {\n  background-color: rgb(30, 41, 59) !important;\n}\n.min-h-screen.dark[_ngcontent-%COMP%]   *[class*=bg-slate-50][_ngcontent-%COMP%] {\n  background-color: rgb(30, 41, 59) !important;\n}\n.min-h-screen.dark[_ngcontent-%COMP%]   *[class*=bg-slate-100][_ngcontent-%COMP%] {\n  background-color: rgb(30, 41, 59) !important;\n}\n.min-h-screen.dark[_ngcontent-%COMP%]   *[class*=bg-slate-200][_ngcontent-%COMP%] {\n  background-color: rgb(51, 65, 85) !important;\n}\n.min-h-screen.dark[_ngcontent-%COMP%]   *[class*=text-slate-900][_ngcontent-%COMP%] {\n  color: white !important;\n}\n.min-h-screen.dark[_ngcontent-%COMP%]   *[class*=text-slate-600][_ngcontent-%COMP%] {\n  color: rgb(148, 163, 184) !important;\n}\n.min-h-screen.dark[_ngcontent-%COMP%]   *[class*=text-slate-500][_ngcontent-%COMP%] {\n  color: rgb(148, 163, 184) !important;\n}\n.min-h-screen.dark[_ngcontent-%COMP%]   *[class*=border-slate-200][_ngcontent-%COMP%] {\n  border-color: rgb(51, 65, 85) !important;\n}\n.min-h-screen.dark[_ngcontent-%COMP%]   *[class*=border-slate-300][_ngcontent-%COMP%] {\n  border-color: rgb(51, 65, 85) !important;\n}\n.min-h-screen.dark[_ngcontent-%COMP%]   lucide-angular[class*=text-white][_ngcontent-%COMP%] {\n  color: white !important;\n}\n.min-h-screen.dark[_ngcontent-%COMP%]   div[class*=from-blue-600][class*=to-purple-700][_ngcontent-%COMP%]   lucide-angular[_ngcontent-%COMP%] {\n  color: white !important;\n}\n.min-h-screen.dark[_ngcontent-%COMP%]   button[class*=from-blue-500][class*=to-purple-600][_ngcontent-%COMP%] {\n  color: white !important;\n}\n.min-h-screen.dark[_ngcontent-%COMP%]   app-custom-tabs[_ngcontent-%COMP%]     .tabs-header {\n  background: rgb(30, 41, 59) !important;\n  border-bottom-color: rgb(51, 65, 85) !important;\n}\n.min-h-screen.dark[_ngcontent-%COMP%]   app-custom-tabs[_ngcontent-%COMP%]     .tabs-header .tab-button {\n  color: rgb(148, 163, 184) !important;\n}\n.min-h-screen.dark[_ngcontent-%COMP%]   app-custom-tabs[_ngcontent-%COMP%]     .tabs-header .tab-button:hover:not(.active) {\n  color: rgb(203, 213, 225) !important;\n  background: rgba(255, 255, 255, 0.02) !important;\n}\n.min-h-screen.dark[_ngcontent-%COMP%]   app-custom-tabs[_ngcontent-%COMP%]     .tabs-header .tab-button.active {\n  color: rgb(16, 185, 129) !important;\n  border-bottom-color: rgb(16, 185, 129) !important;\n  background: rgba(16, 185, 129, 0.05) !important;\n}\n/*# sourceMappingURL=range-slider.component.css.map */'], changeDetection: 0 });
var RangeSliderComponent = _RangeSliderComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RangeSliderComponent, [{
    type: Component,
    args: [{ selector: "app-range-slider", standalone: true, imports: [
      CommonModule,
      FormsModule,
      CustomSelectComponent,
      CustomInputNumberComponent,
      CustomCheckboxComponent,
      CustomTabsComponent,
      CustomMultiSelectComponent,
      LucideAngularModule
    ], changeDetection: ChangeDetectionStrategy.OnPush, template: `<div class="min-h-screen p-4 transition-colors duration-300" [class.dark]="isDarkMode()" [class.bg-gradient-to-br]="true" [class.from-slate-50]="!isDarkMode()" [class.via-blue-50]="!isDarkMode()" [class.to-slate-100]="!isDarkMode()" [class.from-slate-950]="isDarkMode()" [class.via-gray-950]="isDarkMode()" [class.to-black]="isDarkMode()">\r
  <!-- Header -->\r
  <div class="flex items-center gap-2 mb-3">\r
    <div class="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-700 rounded-lg flex items-center justify-center">\r
      <lucide-angular name="megaphone" [size]="16" class="text-white!"></lucide-angular>\r
    </div>\r
    <div>\r
      <h1 class="text-lg font-bold text-slate-900 dark:text-white">Generaci\xF3n de Campa\xF1as</h1>\r
      <p class="text-xs text-slate-600 dark:text-slate-400">Configuraci\xF3n de rangos y filtros para generar archivos de campa\xF1a</p>\r
    </div>\r
  </div>\r
\r
  <!-- Barra de Controles -->\r
  <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm p-3 mb-3">\r
    <div class="flex flex-wrap justify-between items-center gap-3">\r
      <!-- Filtros a la izquierda -->\r
      <div class="flex flex-wrap gap-2 items-center flex-1">\r
        <app-custom-select\r
          [(ngModel)]="campaignName"\r
          [options]="tramoOptions"\r
          placeholder="Seleccionar tramo"\r
          (selectionChange)="onTramoChange()">\r
        </app-custom-select>\r
\r
        <app-custom-select\r
          *ngIf="campaignName === 'Tramo 3'"\r
          [(ngModel)]="filterType"\r
          [options]="filterTypeOptions"\r
          placeholder="Tipo de filtro">\r
        </app-custom-select>\r
\r
        <app-custom-multiselect\r
          *ngIf="campaignName === 'Tramo 3'"\r
          [(ngModel)]="dueDatesSelected"\r
          [options]="dueDatesOptions"\r
          [placeholder]="getSelectedDatesLabel()"\r
          [disabled]="isDatesDisabled()">\r
        </app-custom-multiselect>\r
\r
        <app-custom-checkbox\r
          *ngIf="campaignName === 'Tramo 3'"\r
          label="No contenidos"\r
          [(ngModel)]="contenido">\r
        </app-custom-checkbox>\r
      </div>\r
\r
      <!-- Botones a la derecha -->\r
      <div class="flex gap-2 flex-shrink-0">\r
        <button\r
          class="flex items-center gap-2 px-4 py-2 border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white rounded-lg font-medium text-sm transition-all"\r
          (click)="addRange()">\r
          <lucide-angular name="plus" [size]="18"></lucide-angular>\r
          <span class="hover:cursor-pointer">A\xF1adir Rango</span>\r
        </button>\r
        <button\r
          class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg font-medium text-sm transition-all shadow-md cursor-pointer"\r
          (click)="printRanges()">\r
          <lucide-angular name="send" [size]="18"></lucide-angular>\r
          <span>Generar Campa\xF1a</span>\r
        </button>\r
      </div>\r
    </div>\r
  </div>\r
\r
  <!-- Contenido Principal con Tabs -->\r
  <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm">\r
    <app-custom-tabs\r
      [tabs]="tabs"\r
      [(activeIndex)]="activeIndex"\r
      (tabChange)="onTabChange($event)"\r
      class="w-full">\r
\r
        <!-- Tab Panel: Contacto Directo -->\r
        <div class="p-3 w-full" *ngIf="activeIndex === 0">\r
        <div class="mb-3 pb-3 border-b-2 border-gray-200 dark:border-slate-700">\r
          <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">Contacto Directo</h3>\r
          <p class="text-sm text-slate-600 dark:text-slate-400">Define los rangos capitales para contacto directo</p>\r
        </div>\r
\r
        <div class="flex flex-col gap-3">\r
          <div *ngFor="let range of contactoDirectoRanges; let i = index" class="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md p-3 transition-all hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md">\r
            <div class="flex items-center gap-3 w-full">\r
              <span class="font-semibold text-slate-900 dark:text-slate-100 text-sm px-3 py-2 bg-slate-200 dark:bg-slate-700 rounded border border-slate-300 dark:border-slate-600 flex-shrink-0 min-w-[90px] text-center">Rango {{ i + 1 }}</span>\r
              <div class="flex items-center gap-3 flex-1 flex-wrap">\r
                <div class="flex items-center gap-3 flex-1 min-w-[300px]">\r
                  <div class="flex flex-col min-w-[100px] flex-1">\r
                    <label class="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Desde</label>\r
                    <app-custom-input-number\r
                      [(ngModel)]="range.min"\r
                      [min]="0"\r
                      [hasError]="contactoDirectoMinErrors[i]"\r
                      (ngModelChange)="onMinInputChange(i)">\r
                    </app-custom-input-number>\r
                  </div>\r
\r
                  <div class="flex flex-col min-w-[100px] flex-1" *ngIf="!range.isChecked">\r
                    <label class="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Hasta</label>\r
                    <app-custom-input-number\r
                      [(ngModel)]="range.max"\r
                      [min]="0"\r
                      [disabled]="range.isChecked"\r
                      [hasError]="contactoDirectoMaxErrors[i]"\r
                      (ngModelChange)="onMaxInputChange(i)">\r
                    </app-custom-input-number>\r
                  </div>\r
                </div>\r
\r
                <div class="flex items-center flex-shrink-0">\r
                  <app-custom-checkbox\r
                    *ngIf="i === contactoDirectoRanges.length - 1"\r
                    label="Sin l\xEDmite superior"\r
                    [(ngModel)]="range.isChecked"\r
                    [disabled]="isAnyChecked() && !range.isChecked"\r
                    (checkedChange)="toggleCheck(i)">\r
                  </app-custom-checkbox>\r
                </div>\r
              </div>\r
\r
              <button class="flex items-center justify-center p-2 rounded-md bg-transparent border-none cursor-pointer transition-all text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400" (click)="deleteRange(i)">\r
                <lucide-angular name="trash-2" [size]="18"></lucide-angular>\r
              </button>\r
            </div>\r
          </div>\r
\r
          <div *ngIf="contactoDirectoRanges.length === 0" class="text-center p-12 text-slate-400 bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg">\r
            <lucide-angular name="inbox" [size]="48" class="mx-auto text-slate-300 dark:text-slate-600"></lucide-angular>\r
            <p class="mt-3 text-base font-medium text-slate-600 dark:text-slate-400">No hay rangos configurados</p>\r
            <p class="text-sm text-slate-500 dark:text-slate-500">Haz clic en "A\xF1adir Rango" para comenzar</p>\r
          </div>\r
        </div>\r
        </div>\r
\r
        <!-- Tab Panel: Contacto Indirecto -->\r
        <div class="p-3 w-full" *ngIf="activeIndex === 1">\r
        <div class="mb-3 pb-3 border-b-2 border-gray-200 dark:border-slate-700">\r
          <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">Contacto Indirecto</h3>\r
          <p class="text-sm text-slate-600 dark:text-slate-400">Define los rangos capitales para contacto indirecto</p>\r
        </div>\r
\r
        <div class="flex flex-col gap-3">\r
          <div *ngFor="let range of contactoIndirectoRanges; let i = index" class="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md p-3 transition-all hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md">\r
            <div class="flex items-center gap-3 w-full">\r
              <span class="font-semibold text-slate-900 dark:text-slate-100 text-sm px-3 py-2 bg-slate-200 dark:bg-slate-700 rounded border border-slate-300 dark:border-slate-600 flex-shrink-0 min-w-[90px] text-center">Rango {{ i + 1 }}</span>\r
              <div class="flex items-center gap-3 flex-1 flex-wrap">\r
                <div class="flex items-center gap-3 flex-1 min-w-[300px]">\r
                  <div class="flex flex-col min-w-[100px] flex-1">\r
                    <label class="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Desde</label>\r
                    <app-custom-input-number\r
                      [(ngModel)]="range.min"\r
                      [min]="0"\r
                      [hasError]="contactoIndirectoMinErrors[i]"\r
                      (ngModelChange)="onMinInputChange(i)">\r
                    </app-custom-input-number>\r
                  </div>\r
\r
                  <div class="flex flex-col min-w-[100px] flex-1" *ngIf="!range.isChecked">\r
                    <label class="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Hasta</label>\r
                    <app-custom-input-number\r
                      [(ngModel)]="range.max"\r
                      [min]="0"\r
                      [disabled]="range.isChecked"\r
                      [hasError]="contactoIndirectoMaxErrors[i]"\r
                      (ngModelChange)="onMaxInputChange(i)">\r
                    </app-custom-input-number>\r
                  </div>\r
                </div>\r
\r
                <div class="flex items-center flex-shrink-0">\r
                  <app-custom-checkbox\r
                    *ngIf="i === contactoIndirectoRanges.length - 1"\r
                    label="Sin l\xEDmite superior"\r
                    [(ngModel)]="range.isChecked"\r
                    [disabled]="isAnyChecked() && !range.isChecked"\r
                    (checkedChange)="toggleCheck(i)">\r
                  </app-custom-checkbox>\r
                </div>\r
              </div>\r
\r
              <button class="flex items-center justify-center p-2 rounded-md bg-transparent border-none cursor-pointer transition-all text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400" (click)="deleteRange(i)">\r
                <lucide-angular name="trash-2" [size]="18"></lucide-angular>\r
              </button>\r
            </div>\r
          </div>\r
\r
          <div *ngIf="contactoIndirectoRanges.length === 0" class="text-center p-12 text-slate-400 bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg">\r
            <lucide-angular name="inbox" [size]="48" class="mx-auto text-slate-300 dark:text-slate-600"></lucide-angular>\r
            <p class="mt-3 text-base font-medium text-slate-600 dark:text-slate-400">No hay rangos configurados</p>\r
            <p class="text-sm text-slate-500 dark:text-slate-500">Haz clic en "A\xF1adir Rango" para comenzar</p>\r
          </div>\r
        </div>\r
        </div>\r
\r
        <!-- Tab Panel: Promesas Rotas -->\r
        <div class="p-3 w-full" *ngIf="activeIndex === 2">\r
        <div class="mb-3 pb-3 border-b-2 border-gray-200 dark:border-slate-700">\r
          <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">Promesas Rotas</h3>\r
          <p class="text-sm text-slate-600 dark:text-slate-400">Define los rangos capitales para promesas rotas</p>\r
        </div>\r
\r
        <div class="flex flex-col gap-3">\r
          <div *ngFor="let range of promesasRotasRanges; let i = index" class="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md p-3 transition-all hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md">\r
            <div class="flex items-center gap-3 w-full">\r
              <span class="font-semibold text-slate-900 dark:text-slate-100 text-sm px-3 py-2 bg-slate-200 dark:bg-slate-700 rounded border border-slate-300 dark:border-slate-600 flex-shrink-0 min-w-[90px] text-center">Rango {{ i + 1 }}</span>\r
              <div class="flex items-center gap-3 flex-1 flex-wrap">\r
                <div class="flex items-center gap-3 flex-1 min-w-[300px]">\r
                  <div class="flex flex-col min-w-[100px] flex-1">\r
                    <label class="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Desde</label>\r
                    <app-custom-input-number\r
                      [(ngModel)]="range.min"\r
                      [min]="0"\r
                      [hasError]="promesasRotasMinErrors[i]"\r
                      (ngModelChange)="onMinInputChange(i)">\r
                    </app-custom-input-number>\r
                  </div>\r
\r
                  <div class="flex flex-col min-w-[100px] flex-1" *ngIf="!range.isChecked">\r
                    <label class="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Hasta</label>\r
                    <app-custom-input-number\r
                      [(ngModel)]="range.max"\r
                      [min]="0"\r
                      [disabled]="range.isChecked"\r
                      [hasError]="promesasRotasMaxErrors[i]"\r
                      (ngModelChange)="onMaxInputChange(i)">\r
                    </app-custom-input-number>\r
                  </div>\r
                </div>\r
\r
                <div class="flex items-center flex-shrink-0">\r
                  <app-custom-checkbox\r
                    *ngIf="i === promesasRotasRanges.length - 1"\r
                    label="Sin l\xEDmite superior"\r
                    [(ngModel)]="range.isChecked"\r
                    [disabled]="isAnyChecked() && !range.isChecked"\r
                    (checkedChange)="toggleCheck(i)">\r
                  </app-custom-checkbox>\r
                </div>\r
              </div>\r
\r
              <button class="flex items-center justify-center p-2 rounded-md bg-transparent border-none cursor-pointer transition-all text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400" (click)="deleteRange(i)">\r
                <lucide-angular name="trash-2" [size]="18"></lucide-angular>\r
              </button>\r
            </div>\r
          </div>\r
\r
          <div *ngIf="promesasRotasRanges.length === 0" class="text-center p-12 text-slate-400 bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg">\r
            <lucide-angular name="inbox" [size]="48" class="mx-auto text-slate-300 dark:text-slate-600"></lucide-angular>\r
            <p class="mt-3 text-base font-medium text-slate-600 dark:text-slate-400">No hay rangos configurados</p>\r
            <p class="text-sm text-slate-500 dark:text-slate-500">Haz clic en "A\xF1adir Rango" para comenzar</p>\r
          </div>\r
        </div>\r
        </div>\r
\r
        <!-- Tab Panel: No Contactado -->\r
        <div class="p-3 w-full" *ngIf="activeIndex === 3">\r
        <div class="mb-3 pb-3 border-b-2 border-gray-200 dark:border-slate-700">\r
          <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">No Contactado</h3>\r
          <p class="text-sm text-slate-600 dark:text-slate-400">Define los rangos capitales para no contactados</p>\r
        </div>\r
\r
        <div class="flex flex-col gap-3">\r
          <div *ngFor="let range of noContactadoRanges; let i = index" class="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md p-3 transition-all hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md">\r
            <div class="flex items-center gap-3 w-full">\r
              <span class="font-semibold text-slate-900 dark:text-slate-100 text-sm px-3 py-2 bg-slate-200 dark:bg-slate-700 rounded border border-slate-300 dark:border-slate-600 flex-shrink-0 min-w-[90px] text-center">Rango {{ i + 1 }}</span>\r
              <div class="flex items-center gap-3 flex-1 flex-wrap">\r
                <div class="flex items-center gap-3 flex-1 min-w-[300px]">\r
                  <div class="flex flex-col min-w-[100px] flex-1">\r
                    <label class="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Desde</label>\r
                    <app-custom-input-number\r
                      [(ngModel)]="range.min"\r
                      [min]="0"\r
                      [hasError]="noContactadoMinErrors[i]"\r
                      (ngModelChange)="onMinInputChange(i)">\r
                    </app-custom-input-number>\r
                  </div>\r
\r
                  <div class="flex flex-col min-w-[100px] flex-1" *ngIf="!range.isChecked">\r
                    <label class="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Hasta</label>\r
                    <app-custom-input-number\r
                      [(ngModel)]="range.max"\r
                      [min]="0"\r
                      [disabled]="range.isChecked"\r
                      [hasError]="noContactadoMaxErrors[i]"\r
                      (ngModelChange)="onMaxInputChange(i)">\r
                    </app-custom-input-number>\r
                  </div>\r
                </div>\r
\r
                <div class="flex items-center flex-shrink-0">\r
                  <app-custom-checkbox\r
                    *ngIf="i === noContactadoRanges.length - 1"\r
                    label="Sin l\xEDmite superior"\r
                    [(ngModel)]="range.isChecked"\r
                    [disabled]="isAnyChecked() && !range.isChecked"\r
                    (checkedChange)="toggleCheck(i)">\r
                  </app-custom-checkbox>\r
                </div>\r
              </div>\r
\r
              <button class="flex items-center justify-center p-2 rounded-md bg-transparent border-none cursor-pointer transition-all text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400" (click)="deleteRange(i)">\r
                <lucide-angular name="trash-2" [size]="18"></lucide-angular>\r
              </button>\r
            </div>\r
          </div>\r
\r
          <div *ngIf="noContactadoRanges.length === 0" class="text-center p-12 text-slate-400 bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg">\r
            <lucide-angular name="inbox" [size]="48" class="mx-auto text-slate-300 dark:text-slate-600"></lucide-angular>\r
            <p class="mt-3 text-base font-medium text-slate-600 dark:text-slate-400">No hay rangos configurados</p>\r
            <p class="text-sm text-slate-500 dark:text-slate-500">Haz clic en "A\xF1adir Rango" para comenzar</p>\r
          </div>\r
        </div>\r
        </div>\r
\r
      </app-custom-tabs>\r
  </div>\r
\r
  <!-- Loading Modal -->\r
  <div *ngIf="loadingModal().isOpen"\r
       class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"\r
       (click)="$event.stopPropagation()">\r
    <div class="bg-white dark:bg-slate-900 rounded-lg shadow-2xl p-6 max-w-md w-full mx-4 border border-slate-200 dark:border-slate-700"\r
         (click)="$event.stopPropagation()">\r
      <!-- Header -->\r
      <div class="flex items-center gap-3 mb-4">\r
        <div class="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full">\r
          <lucide-angular name="loader" [size]="24" class="text-white animate-spin"></lucide-angular>\r
        </div>\r
        <div class="flex-1">\r
          <h3 class="text-lg font-semibold text-slate-900 dark:text-white">\r
            {{ loadingModal().data?.title || 'Procesando' }}\r
          </h3>\r
          <p class="text-sm text-slate-600 dark:text-slate-400">\r
            {{ loadingModal().data?.subtitle || 'Por favor espere...' }}\r
          </p>\r
        </div>\r
      </div>\r
\r
      <!-- Progress Bar -->\r
      <div class="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-4 overflow-hidden">\r
        <div class="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full animate-pulse"></div>\r
      </div>\r
\r
      <!-- Cancel Button -->\r
      <div class="flex justify-end">\r
        <button\r
          (click)="cancelCampaignGeneration()"\r
          class="flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-lg font-medium text-sm transition-all cursor-pointer">\r
          <lucide-angular name="x-circle" [size]="18"></lucide-angular>\r
          <span>Cancelar</span>\r
        </button>\r
      </div>\r
    </div>\r
  </div>\r
</div>\r
`, styles: ['@charset "UTF-8";\n\n/* src/app/features/legacy/campaign/components/range-slider/range-slider.component.scss */\n@media screen and (max-width: 1400px) {\n  .min-w-\\[300px\\] {\n    min-width: 200px;\n  }\n}\n@media screen and (max-width: 768px) {\n  .min-w-\\[300px\\] {\n    min-width: auto;\n    width: 100%;\n  }\n  .min-w-\\[100px\\] {\n    width: 100%;\n  }\n}\n.min-h-screen:not(.dark) {\n  background:\n    linear-gradient(\n      to bottom right,\n      rgb(248, 250, 252),\n      rgb(239, 246, 255),\n      rgb(241, 245, 249)) !important;\n}\n.min-h-screen:not(.dark) * {\n}\n.min-h-screen:not(.dark) *[class*="dark:from-slate-950"] {\n  background: none !important;\n}\n.min-h-screen:not(.dark) *[class*="dark:via-gray-950"] {\n  background: none !important;\n}\n.min-h-screen:not(.dark) *[class*="dark:to-black"] {\n  background: none !important;\n}\n.min-h-screen:not(.dark) *[class*="dark:bg-slate-900"] {\n  background-color: white !important;\n}\n.min-h-screen:not(.dark) *[class*="dark:bg-slate-800"] {\n  background-color: rgb(241, 245, 249) !important;\n}\n.min-h-screen:not(.dark) *[class*="dark:bg-slate-700"] {\n  background-color: rgb(203, 213, 225) !important;\n}\n.min-h-screen:not(.dark) *[class*="dark:bg-gray-700"] {\n  background-color: rgb(203, 213, 225) !important;\n}\n.min-h-screen:not(.dark) *[class*="dark:bg-slate-600"] {\n  background-color: rgb(226, 232, 240) !important;\n}\n.min-h-screen:not(.dark) *[class*="dark:text-white"] {\n  color: rgb(15, 23, 42) !important;\n}\n.min-h-screen:not(.dark) *[class*="dark:text-slate-100"] {\n  color: rgb(15, 23, 42) !important;\n}\n.min-h-screen:not(.dark) *[class*="dark:text-slate-400"] {\n  color: rgb(71, 85, 105) !important;\n}\n.min-h-screen:not(.dark) *[class*="dark:text-slate-300"] {\n  color: rgb(51, 65, 85) !important;\n}\n.min-h-screen:not(.dark) *[class*="dark:text-slate-500"] {\n  color: rgb(100, 116, 139) !important;\n}\n.min-h-screen:not(.dark) *[class*="dark:border-slate-700"] {\n  border-color: rgb(203, 213, 225) !important;\n}\n.min-h-screen:not(.dark) *[class*="dark:border-slate-600"] {\n  border-color: rgb(148, 163, 184) !important;\n}\n.min-h-screen:not(.dark) div[class*=bg-slate-50] {\n  background-color: rgb(241, 245, 249) !important;\n}\n.min-h-screen:not(.dark) span[class*=bg-slate-200] {\n  background-color: rgb(226, 232, 240) !important;\n}\n.min-h-screen:not(.dark) label[class*=text-slate-600] {\n  color: rgb(71, 85, 105) !important;\n}\n.min-h-screen:not(.dark) div[class*=border-slate-200] {\n  border-color: rgb(203, 213, 225) !important;\n}\n.min-h-screen:not(.dark) lucide-angular[class*=text-white] {\n  color: white !important;\n}\n.min-h-screen:not(.dark) div[class*=from-blue-600][class*=to-purple-700] lucide-angular {\n  color: white !important;\n}\n.min-h-screen:not(.dark) button[class*=border-blue-500][class*=text-blue-500] {\n  color: rgb(59, 130, 246) !important;\n}\n.min-h-screen:not(.dark) button[class*=from-blue-500][class*=to-purple-600] {\n  color: white !important;\n}\n.min-h-screen:not(.dark) app-custom-tabs ::ng-deep .tabs-header {\n  background: white !important;\n  border-bottom-color: rgb(226, 232, 240) !important;\n}\n.min-h-screen:not(.dark) app-custom-tabs ::ng-deep .tabs-header .tab-button {\n  color: rgb(100, 116, 139) !important;\n}\n.min-h-screen:not(.dark) app-custom-tabs ::ng-deep .tabs-header .tab-button:hover:not(.active) {\n  color: rgb(71, 85, 105) !important;\n  background: rgba(0, 0, 0, 0.02) !important;\n}\n.min-h-screen:not(.dark) app-custom-tabs ::ng-deep .tabs-header .tab-button.active {\n  color: rgb(16, 185, 129) !important;\n  border-bottom-color: rgb(16, 185, 129) !important;\n  background: rgba(16, 185, 129, 0.05) !important;\n}\n.min-h-screen.dark {\n  background:\n    linear-gradient(\n      to bottom right,\n      rgb(2, 6, 23),\n      rgb(17, 24, 39),\n      rgb(0, 0, 0)) !important;\n}\n.min-h-screen.dark *[class*=bg-white] {\n  background-color: rgb(30, 41, 59) !important;\n}\n.min-h-screen.dark *[class*=bg-slate-50] {\n  background-color: rgb(30, 41, 59) !important;\n}\n.min-h-screen.dark *[class*=bg-slate-100] {\n  background-color: rgb(30, 41, 59) !important;\n}\n.min-h-screen.dark *[class*=bg-slate-200] {\n  background-color: rgb(51, 65, 85) !important;\n}\n.min-h-screen.dark *[class*=text-slate-900] {\n  color: white !important;\n}\n.min-h-screen.dark *[class*=text-slate-600] {\n  color: rgb(148, 163, 184) !important;\n}\n.min-h-screen.dark *[class*=text-slate-500] {\n  color: rgb(148, 163, 184) !important;\n}\n.min-h-screen.dark *[class*=border-slate-200] {\n  border-color: rgb(51, 65, 85) !important;\n}\n.min-h-screen.dark *[class*=border-slate-300] {\n  border-color: rgb(51, 65, 85) !important;\n}\n.min-h-screen.dark lucide-angular[class*=text-white] {\n  color: white !important;\n}\n.min-h-screen.dark div[class*=from-blue-600][class*=to-purple-700] lucide-angular {\n  color: white !important;\n}\n.min-h-screen.dark button[class*=from-blue-500][class*=to-purple-600] {\n  color: white !important;\n}\n.min-h-screen.dark app-custom-tabs ::ng-deep .tabs-header {\n  background: rgb(30, 41, 59) !important;\n  border-bottom-color: rgb(51, 65, 85) !important;\n}\n.min-h-screen.dark app-custom-tabs ::ng-deep .tabs-header .tab-button {\n  color: rgb(148, 163, 184) !important;\n}\n.min-h-screen.dark app-custom-tabs ::ng-deep .tabs-header .tab-button:hover:not(.active) {\n  color: rgb(203, 213, 225) !important;\n  background: rgba(255, 255, 255, 0.02) !important;\n}\n.min-h-screen.dark app-custom-tabs ::ng-deep .tabs-header .tab-button.active {\n  color: rgb(16, 185, 129) !important;\n  border-bottom-color: rgb(16, 185, 129) !important;\n  background: rgba(16, 185, 129, 0.05) !important;\n}\n/*# sourceMappingURL=range-slider.component.css.map */\n'] }]
  }], () => [{ type: CampaignService }, { type: ToastService }, { type: ChangeDetectorRef }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(RangeSliderComponent, { className: "RangeSliderComponent", filePath: "src/app/features/legacy/campaign/components/range-slider/range-slider.component.ts", lineNumber: 34 });
})();

// src/app/features/legacy/campaign/pages/campaign-page/campaign-page.component.ts
var _CampaignPageComponent = class _CampaignPageComponent {
};
_CampaignPageComponent.\u0275fac = function CampaignPageComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _CampaignPageComponent)();
};
_CampaignPageComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _CampaignPageComponent, selectors: [["app-campaign-page"]], decls: 3, vars: 0, consts: [[1, "campaign-page-container"], [1, "section"]], template: function CampaignPageComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 0)(1, "div", 1);
    \u0275\u0275element(2, "app-range-slider");
    \u0275\u0275elementEnd()();
  }
}, dependencies: [RangeSliderComponent], styles: ["\n\n.campaign-page-container[_ngcontent-%COMP%] {\n  padding: 0;\n  min-height: 100vh;\n  background: #f8f9fa;\n}\n.section[_ngcontent-%COMP%] {\n  width: 100%;\n}\n/*# sourceMappingURL=campaign-page.component.css.map */"] });
var CampaignPageComponent = _CampaignPageComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CampaignPageComponent, [{
    type: Component,
    args: [{ selector: "app-campaign-page", standalone: true, imports: [RangeSliderComponent], template: '<div class="campaign-page-container">\r\n  <div class="section">\r\n    <app-range-slider></app-range-slider>\r\n  </div>\r\n</div>', styles: ["/* src/app/features/legacy/campaign/pages/campaign-page/campaign-page.component.css */\n.campaign-page-container {\n  padding: 0;\n  min-height: 100vh;\n  background: #f8f9fa;\n}\n.section {\n  width: 100%;\n}\n/*# sourceMappingURL=campaign-page.component.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(CampaignPageComponent, { className: "CampaignPageComponent", filePath: "src/app/features/legacy/campaign/pages/campaign-page/campaign-page.component.ts", lineNumber: 11 });
})();
export {
  CampaignPageComponent
};
//# sourceMappingURL=chunk-NQIAR4WC.js.map
