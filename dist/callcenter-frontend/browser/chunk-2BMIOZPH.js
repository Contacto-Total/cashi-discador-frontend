import {
  NG_VALUE_ACCESSOR
} from "./chunk-GRJ7XAPD.js";
import {
  LucideAngularComponent,
  LucideAngularModule
} from "./chunk-RFBUEVFE.js";
import {
  CommonModule,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Injectable,
  Input,
  NgForOf,
  NgIf,
  Output,
  Subject,
  ViewChild,
  forwardRef,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵqueryRefresh,
  ɵɵresetView,
  ɵɵresolveDocument,
  ɵɵresolveWindow,
  ɵɵrestoreView,
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate1,
  ɵɵviewQuery
} from "./chunk-CTRHJBBW.js";

// src/app/shared/components/custom-ui/custom-select/custom-select.component.ts
var _c0 = ["trigger"];
function CustomSelectComponent_div_6_div_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 8);
    \u0275\u0275listener("click", function CustomSelectComponent_div_6_div_1_Template_div_click_0_listener() {
      const option_r3 = \u0275\u0275restoreView(_r2).$implicit;
      const ctx_r3 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r3.selectOption(option_r3));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const option_r3 = ctx.$implicit;
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("selected", ctx_r3.selectedValue === option_r3.value);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", option_r3.label, " ");
  }
}
function CustomSelectComponent_div_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 6);
    \u0275\u0275template(1, CustomSelectComponent_div_6_div_1_Template, 2, 3, "div", 7);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275styleProp("top", ctx_r3.dropdownPosition.top)("left", ctx_r3.dropdownPosition.left)("width", ctx_r3.dropdownPosition.width);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r3.options);
  }
}
var _CustomSelectComponent = class _CustomSelectComponent {
  constructor(elementRef) {
    this.elementRef = elementRef;
    this.options = [];
    this.placeholder = "Seleccionar...";
    this.disabled = false;
    this.compact = false;
    this.selectionChange = new EventEmitter();
    this.selectedValue = null;
    this.isOpen = false;
    this.dropdownPosition = { top: "0px", left: "0px", width: "0px" };
    this.onChange = () => {
    };
    this.onTouched = () => {
    };
  }
  onDocumentClick(event) {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside && this.isOpen) {
      this.isOpen = false;
    }
  }
  onWindowEvent() {
    if (this.isOpen) {
      this.updateDropdownPosition();
    }
  }
  toggleDropdown() {
    if (!this.disabled) {
      if (!this.isOpen) {
        this.updateDropdownPosition();
      }
      this.isOpen = !this.isOpen;
      if (this.isOpen) {
        setTimeout(() => this.updateDropdownPosition(), 0);
      }
    }
  }
  updateDropdownPosition() {
    if (this.triggerRef) {
      const rect = this.triggerRef.nativeElement.getBoundingClientRect();
      this.dropdownPosition = {
        top: `${rect.bottom + 4}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`
      };
    }
  }
  selectOption(option) {
    this.selectedValue = option.value;
    this.isOpen = false;
    this.onChange(option.value);
    this.onTouched();
    this.selectionChange.emit(option.value);
  }
  getSelectedLabel() {
    if (!this.selectedValue) {
      return this.placeholder;
    }
    const selected = this.options.find((opt) => opt.value === this.selectedValue);
    return selected ? selected.label : this.placeholder;
  }
  // ControlValueAccessor implementation
  writeValue(value) {
    this.selectedValue = value;
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
_CustomSelectComponent.\u0275fac = function CustomSelectComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _CustomSelectComponent)(\u0275\u0275directiveInject(ElementRef));
};
_CustomSelectComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _CustomSelectComponent, selectors: [["app-custom-select"]], viewQuery: function CustomSelectComponent_Query(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275viewQuery(_c0, 5, ElementRef);
  }
  if (rf & 2) {
    let _t;
    \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.triggerRef = _t.first);
  }
}, hostVars: 2, hostBindings: function CustomSelectComponent_HostBindings(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275listener("click", function CustomSelectComponent_click_HostBindingHandler($event) {
      return ctx.onDocumentClick($event);
    }, \u0275\u0275resolveDocument)("scroll", function CustomSelectComponent_scroll_HostBindingHandler($event) {
      return ctx.onWindowEvent($event);
    }, \u0275\u0275resolveWindow)("resize", function CustomSelectComponent_resize_HostBindingHandler($event) {
      return ctx.onWindowEvent($event);
    }, \u0275\u0275resolveWindow);
  }
  if (rf & 2) {
    \u0275\u0275classProp("compact", ctx.compact);
  }
}, inputs: { options: "options", placeholder: "placeholder", disabled: "disabled", compact: "compact" }, outputs: { selectionChange: "selectionChange" }, features: [\u0275\u0275ProvidersFeature([
  {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => _CustomSelectComponent),
    multi: true
  }
])], decls: 7, vars: 9, consts: [["trigger", ""], [1, "custom-select"], [1, "select-trigger", 3, "click"], [1, "select-value"], ["name", "chevron-down", 1, "select-icon", 3, "size"], ["class", "select-dropdown", 3, "top", "left", "width", 4, "ngIf"], [1, "select-dropdown"], ["class", "select-option", 3, "selected", "click", 4, "ngFor", "ngForOf"], [1, "select-option", 3, "click"]], template: function CustomSelectComponent_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 1)(1, "div", 2, 0);
    \u0275\u0275listener("click", function CustomSelectComponent_Template_div_click_1_listener() {
      \u0275\u0275restoreView(_r1);
      return \u0275\u0275resetView(ctx.toggleDropdown());
    });
    \u0275\u0275elementStart(3, "span", 3);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275element(5, "lucide-angular", 4);
    \u0275\u0275elementEnd();
    \u0275\u0275template(6, CustomSelectComponent_div_6_Template, 2, 7, "div", 5);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275classProp("disabled", ctx.disabled);
    \u0275\u0275advance(3);
    \u0275\u0275classProp("placeholder", !ctx.selectedValue);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx.getSelectedLabel(), " ");
    \u0275\u0275advance();
    \u0275\u0275classProp("open", ctx.isOpen);
    \u0275\u0275property("size", 16);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.isOpen);
  }
}, dependencies: [CommonModule, NgForOf, NgIf, LucideAngularModule, LucideAngularComponent], styles: ["\n\n.custom-select[_ngcontent-%COMP%] {\n  position: relative;\n  width: 100%;\n  min-width: unset;\n}\n.custom-select.compact[_ngcontent-%COMP%]   .select-trigger[_ngcontent-%COMP%] {\n  height: 32px;\n  padding: 0 8px;\n  font-size: 12px;\n  background: #1e293b;\n  border-color: #475569;\n}\n.custom-select.compact[_ngcontent-%COMP%]   .select-value[_ngcontent-%COMP%] {\n  font-size: 12px;\n}\n.custom-select.compact[_ngcontent-%COMP%]   .select-icon[_ngcontent-%COMP%] {\n  margin-left: 4px;\n}\n.custom-select[_ngcontent-%COMP%]   .select-trigger[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 0 12px;\n  background: #0f172a;\n  border: 1px solid #334155;\n  border-radius: 6px;\n  cursor: pointer;\n  transition: all 0.2s ease;\n  -webkit-user-select: none;\n  user-select: none;\n  height: 40px;\n}\n.custom-select[_ngcontent-%COMP%]   .select-trigger[_ngcontent-%COMP%]:hover:not(.disabled) {\n  border-color: #3b82f6;\n  background: #1e293b;\n}\n.custom-select[_ngcontent-%COMP%]   .select-trigger[_ngcontent-%COMP%]   .select-value[_ngcontent-%COMP%] {\n  color: #f1f5f9;\n  font-size: 14px;\n  flex: 1;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.custom-select[_ngcontent-%COMP%]   .select-trigger[_ngcontent-%COMP%]   .select-value.placeholder[_ngcontent-%COMP%] {\n  color: #64748b;\n}\n.custom-select[_ngcontent-%COMP%]   .select-trigger[_ngcontent-%COMP%]   .select-icon[_ngcontent-%COMP%] {\n  color: #94a3b8;\n  transition: transform 0.2s ease;\n  flex-shrink: 0;\n  margin-left: 6px;\n}\n.custom-select[_ngcontent-%COMP%]   .select-trigger[_ngcontent-%COMP%]   .select-icon.open[_ngcontent-%COMP%] {\n  transform: rotate(180deg);\n}\n.custom-select[_ngcontent-%COMP%]   .select-dropdown[_ngcontent-%COMP%] {\n  position: fixed;\n  background: #1e293b;\n  border: 1px solid #334155;\n  border-radius: 6px;\n  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);\n  max-height: 250px;\n  overflow-y: auto;\n  z-index: 9999;\n  animation: _ngcontent-%COMP%_slideDown 0.15s ease;\n  min-width: 150px;\n}\n.custom-select[_ngcontent-%COMP%]   .select-dropdown[_ngcontent-%COMP%]::-webkit-scrollbar {\n  width: 5px;\n}\n.custom-select[_ngcontent-%COMP%]   .select-dropdown[_ngcontent-%COMP%]::-webkit-scrollbar-track {\n  background: transparent;\n}\n.custom-select[_ngcontent-%COMP%]   .select-dropdown[_ngcontent-%COMP%]::-webkit-scrollbar-thumb {\n  background: #334155;\n  border-radius: 3px;\n}\n.custom-select[_ngcontent-%COMP%]   .select-dropdown[_ngcontent-%COMP%]::-webkit-scrollbar-thumb:hover {\n  background: #475569;\n}\n.custom-select[_ngcontent-%COMP%]   .select-dropdown[_ngcontent-%COMP%]   .select-option[_ngcontent-%COMP%] {\n  padding: 7px 10px;\n  color: #f1f5f9;\n  font-size: 12px;\n  cursor: pointer;\n  transition: all 0.15s ease;\n  white-space: nowrap;\n}\n.custom-select[_ngcontent-%COMP%]   .select-dropdown[_ngcontent-%COMP%]   .select-option[_ngcontent-%COMP%]:hover {\n  background: rgba(59, 130, 246, 0.1);\n  color: #60a5fa;\n}\n.custom-select[_ngcontent-%COMP%]   .select-dropdown[_ngcontent-%COMP%]   .select-option.selected[_ngcontent-%COMP%] {\n  background: rgba(59, 130, 246, 0.15);\n  color: #60a5fa;\n  font-weight: 500;\n}\n.custom-select.disabled[_ngcontent-%COMP%] {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n.custom-select.disabled[_ngcontent-%COMP%]   .select-trigger[_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  background: #0f172a;\n}\n@keyframes _ngcontent-%COMP%_slideDown {\n  from {\n    opacity: 0;\n    transform: translateY(-10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\nbody.light-theme[_nghost-%COMP%]   .custom-select[_ngcontent-%COMP%]   .select-trigger[_ngcontent-%COMP%], body.light-theme   [_nghost-%COMP%]   .custom-select[_ngcontent-%COMP%]   .select-trigger[_ngcontent-%COMP%] {\n  background: #ffffff;\n  border-color: #e2e8f0;\n  height: 40px;\n}\nbody.light-theme[_nghost-%COMP%]   .custom-select[_ngcontent-%COMP%]   .select-trigger[_ngcontent-%COMP%]:hover:not(.disabled), body.light-theme   [_nghost-%COMP%]   .custom-select[_ngcontent-%COMP%]   .select-trigger[_ngcontent-%COMP%]:hover:not(.disabled) {\n  border-color: #3b82f6;\n  background: #f8fafc;\n}\nbody.light-theme[_nghost-%COMP%]   .custom-select[_ngcontent-%COMP%]   .select-trigger[_ngcontent-%COMP%]   .select-value[_ngcontent-%COMP%], body.light-theme   [_nghost-%COMP%]   .custom-select[_ngcontent-%COMP%]   .select-trigger[_ngcontent-%COMP%]   .select-value[_ngcontent-%COMP%] {\n  color: #0f172a;\n  font-size: 14px;\n}\nbody.light-theme[_nghost-%COMP%]   .custom-select[_ngcontent-%COMP%]   .select-trigger[_ngcontent-%COMP%]   .select-value.placeholder[_ngcontent-%COMP%], body.light-theme   [_nghost-%COMP%]   .custom-select[_ngcontent-%COMP%]   .select-trigger[_ngcontent-%COMP%]   .select-value.placeholder[_ngcontent-%COMP%] {\n  color: #94a3b8;\n}\nbody.light-theme[_nghost-%COMP%]   .custom-select[_ngcontent-%COMP%]   .select-trigger[_ngcontent-%COMP%]   .select-icon[_ngcontent-%COMP%], body.light-theme   [_nghost-%COMP%]   .custom-select[_ngcontent-%COMP%]   .select-trigger[_ngcontent-%COMP%]   .select-icon[_ngcontent-%COMP%] {\n  color: #64748b;\n}\nbody.light-theme[_nghost-%COMP%]   .custom-select[_ngcontent-%COMP%]   .select-dropdown[_ngcontent-%COMP%], body.light-theme   [_nghost-%COMP%]   .custom-select[_ngcontent-%COMP%]   .select-dropdown[_ngcontent-%COMP%] {\n  background: #ffffff;\n  border-color: #e2e8f0;\n  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);\n}\nbody.light-theme[_nghost-%COMP%]   .custom-select[_ngcontent-%COMP%]   .select-dropdown[_ngcontent-%COMP%]::-webkit-scrollbar-thumb, body.light-theme   [_nghost-%COMP%]   .custom-select[_ngcontent-%COMP%]   .select-dropdown[_ngcontent-%COMP%]::-webkit-scrollbar-thumb {\n  background: #cbd5e1;\n}\nbody.light-theme[_nghost-%COMP%]   .custom-select[_ngcontent-%COMP%]   .select-dropdown[_ngcontent-%COMP%]::-webkit-scrollbar-thumb:hover, body.light-theme   [_nghost-%COMP%]   .custom-select[_ngcontent-%COMP%]   .select-dropdown[_ngcontent-%COMP%]::-webkit-scrollbar-thumb:hover {\n  background: #94a3b8;\n}\nbody.light-theme[_nghost-%COMP%]   .custom-select[_ngcontent-%COMP%]   .select-dropdown[_ngcontent-%COMP%]   .select-option[_ngcontent-%COMP%], body.light-theme   [_nghost-%COMP%]   .custom-select[_ngcontent-%COMP%]   .select-dropdown[_ngcontent-%COMP%]   .select-option[_ngcontent-%COMP%] {\n  color: #0f172a;\n}\nbody.light-theme[_nghost-%COMP%]   .custom-select[_ngcontent-%COMP%]   .select-dropdown[_ngcontent-%COMP%]   .select-option[_ngcontent-%COMP%]:hover, body.light-theme   [_nghost-%COMP%]   .custom-select[_ngcontent-%COMP%]   .select-dropdown[_ngcontent-%COMP%]   .select-option[_ngcontent-%COMP%]:hover {\n  background: rgba(59, 130, 246, 0.05);\n  color: #3b82f6;\n}\nbody.light-theme[_nghost-%COMP%]   .custom-select[_ngcontent-%COMP%]   .select-dropdown[_ngcontent-%COMP%]   .select-option.selected[_ngcontent-%COMP%], body.light-theme   [_nghost-%COMP%]   .custom-select[_ngcontent-%COMP%]   .select-dropdown[_ngcontent-%COMP%]   .select-option.selected[_ngcontent-%COMP%] {\n  background: rgba(59, 130, 246, 0.1);\n  color: #3b82f6;\n}\nbody.light-theme[_nghost-%COMP%]   .custom-select.disabled[_ngcontent-%COMP%]   .select-trigger[_ngcontent-%COMP%], body.light-theme   [_nghost-%COMP%]   .custom-select.disabled[_ngcontent-%COMP%]   .select-trigger[_ngcontent-%COMP%] {\n  background: #f8fafc;\n}\n/*# sourceMappingURL=custom-select.component.css.map */"] });
var CustomSelectComponent = _CustomSelectComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CustomSelectComponent, [{
    type: Component,
    args: [{ selector: "app-custom-select", standalone: true, imports: [CommonModule, LucideAngularModule], host: {
      "[class.compact]": "compact"
    }, providers: [
      {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => CustomSelectComponent),
        multi: true
      }
    ], template: '<div class="custom-select" [class.disabled]="disabled">\r\n  <div #trigger class="select-trigger" (click)="toggleDropdown()">\r\n    <span class="select-value" [class.placeholder]="!selectedValue">\r\n      {{ getSelectedLabel() }}\r\n    </span>\r\n    <lucide-angular name="chevron-down" [size]="16" class="select-icon" [class.open]="isOpen"></lucide-angular>\r\n  </div>\r\n\r\n  <div\r\n    class="select-dropdown"\r\n    *ngIf="isOpen"\r\n    [style.top]="dropdownPosition.top"\r\n    [style.left]="dropdownPosition.left"\r\n    [style.width]="dropdownPosition.width">\r\n    <div\r\n      *ngFor="let option of options"\r\n      class="select-option"\r\n      [class.selected]="selectedValue === option.value"\r\n      (click)="selectOption(option)">\r\n      {{ option.label }}\r\n    </div>\r\n  </div>\r\n</div>\r\n', styles: ["/* src/app/shared/components/custom-ui/custom-select/custom-select.component.scss */\n.custom-select {\n  position: relative;\n  width: 100%;\n  min-width: unset;\n}\n.custom-select.compact .select-trigger {\n  height: 32px;\n  padding: 0 8px;\n  font-size: 12px;\n  background: #1e293b;\n  border-color: #475569;\n}\n.custom-select.compact .select-value {\n  font-size: 12px;\n}\n.custom-select.compact .select-icon {\n  margin-left: 4px;\n}\n.custom-select .select-trigger {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 0 12px;\n  background: #0f172a;\n  border: 1px solid #334155;\n  border-radius: 6px;\n  cursor: pointer;\n  transition: all 0.2s ease;\n  -webkit-user-select: none;\n  user-select: none;\n  height: 40px;\n}\n.custom-select .select-trigger:hover:not(.disabled) {\n  border-color: #3b82f6;\n  background: #1e293b;\n}\n.custom-select .select-trigger .select-value {\n  color: #f1f5f9;\n  font-size: 14px;\n  flex: 1;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.custom-select .select-trigger .select-value.placeholder {\n  color: #64748b;\n}\n.custom-select .select-trigger .select-icon {\n  color: #94a3b8;\n  transition: transform 0.2s ease;\n  flex-shrink: 0;\n  margin-left: 6px;\n}\n.custom-select .select-trigger .select-icon.open {\n  transform: rotate(180deg);\n}\n.custom-select .select-dropdown {\n  position: fixed;\n  background: #1e293b;\n  border: 1px solid #334155;\n  border-radius: 6px;\n  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);\n  max-height: 250px;\n  overflow-y: auto;\n  z-index: 9999;\n  animation: slideDown 0.15s ease;\n  min-width: 150px;\n}\n.custom-select .select-dropdown::-webkit-scrollbar {\n  width: 5px;\n}\n.custom-select .select-dropdown::-webkit-scrollbar-track {\n  background: transparent;\n}\n.custom-select .select-dropdown::-webkit-scrollbar-thumb {\n  background: #334155;\n  border-radius: 3px;\n}\n.custom-select .select-dropdown::-webkit-scrollbar-thumb:hover {\n  background: #475569;\n}\n.custom-select .select-dropdown .select-option {\n  padding: 7px 10px;\n  color: #f1f5f9;\n  font-size: 12px;\n  cursor: pointer;\n  transition: all 0.15s ease;\n  white-space: nowrap;\n}\n.custom-select .select-dropdown .select-option:hover {\n  background: rgba(59, 130, 246, 0.1);\n  color: #60a5fa;\n}\n.custom-select .select-dropdown .select-option.selected {\n  background: rgba(59, 130, 246, 0.15);\n  color: #60a5fa;\n  font-weight: 500;\n}\n.custom-select.disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n.custom-select.disabled .select-trigger {\n  cursor: not-allowed;\n  background: #0f172a;\n}\n@keyframes slideDown {\n  from {\n    opacity: 0;\n    transform: translateY(-10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n:host-context(body.light-theme) .custom-select .select-trigger {\n  background: #ffffff;\n  border-color: #e2e8f0;\n  height: 40px;\n}\n:host-context(body.light-theme) .custom-select .select-trigger:hover:not(.disabled) {\n  border-color: #3b82f6;\n  background: #f8fafc;\n}\n:host-context(body.light-theme) .custom-select .select-trigger .select-value {\n  color: #0f172a;\n  font-size: 14px;\n}\n:host-context(body.light-theme) .custom-select .select-trigger .select-value.placeholder {\n  color: #94a3b8;\n}\n:host-context(body.light-theme) .custom-select .select-trigger .select-icon {\n  color: #64748b;\n}\n:host-context(body.light-theme) .custom-select .select-dropdown {\n  background: #ffffff;\n  border-color: #e2e8f0;\n  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);\n}\n:host-context(body.light-theme) .custom-select .select-dropdown::-webkit-scrollbar-thumb {\n  background: #cbd5e1;\n}\n:host-context(body.light-theme) .custom-select .select-dropdown::-webkit-scrollbar-thumb:hover {\n  background: #94a3b8;\n}\n:host-context(body.light-theme) .custom-select .select-dropdown .select-option {\n  color: #0f172a;\n}\n:host-context(body.light-theme) .custom-select .select-dropdown .select-option:hover {\n  background: rgba(59, 130, 246, 0.05);\n  color: #3b82f6;\n}\n:host-context(body.light-theme) .custom-select .select-dropdown .select-option.selected {\n  background: rgba(59, 130, 246, 0.1);\n  color: #3b82f6;\n}\n:host-context(body.light-theme) .custom-select.disabled .select-trigger {\n  background: #f8fafc;\n}\n/*# sourceMappingURL=custom-select.component.css.map */\n"] }]
  }], () => [{ type: ElementRef }], { options: [{
    type: Input
  }], placeholder: [{
    type: Input
  }], disabled: [{
    type: Input
  }], compact: [{
    type: Input
  }], selectionChange: [{
    type: Output
  }], triggerRef: [{
    type: ViewChild,
    args: ["trigger", { read: ElementRef }]
  }], onDocumentClick: [{
    type: HostListener,
    args: ["document:click", ["$event"]]
  }], onWindowEvent: [{
    type: HostListener,
    args: ["window:scroll", ["$event"]]
  }, {
    type: HostListener,
    args: ["window:resize", ["$event"]]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(CustomSelectComponent, { className: "CustomSelectComponent", filePath: "src/app/shared/components/custom-ui/custom-select/custom-select.component.ts", lineNumber: 28 });
})();

// src/app/shared/services/toast.service.ts
var _ToastService = class _ToastService {
  constructor() {
    this.toastSubject = new Subject();
    this.toasts$ = this.toastSubject.asObservable();
  }
  generateId() {
    return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  show(message, type = "info", duration = 3e3) {
    const toast = {
      id: this.generateId(),
      type,
      message,
      duration
    };
    this.toastSubject.next(toast);
  }
  success(message, duration) {
    this.show(message, "success", duration);
  }
  error(message, duration) {
    this.show(message, "error", duration);
  }
  warning(message, duration) {
    this.show(message, "warning", duration);
  }
  info(message, duration) {
    this.show(message, "info", duration);
  }
};
_ToastService.\u0275fac = function ToastService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _ToastService)();
};
_ToastService.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ToastService, factory: _ToastService.\u0275fac, providedIn: "root" });
var ToastService = _ToastService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ToastService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

export {
  CustomSelectComponent,
  ToastService
};
//# sourceMappingURL=chunk-2BMIOZPH.js.map
