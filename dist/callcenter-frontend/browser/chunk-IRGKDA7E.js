import {
  LucideAngularComponent,
  LucideAngularModule
} from "./chunk-RFBUEVFE.js";
import {
  CommonModule,
  Component,
  Input,
  NgIf,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵNgOnChangesFeature,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵproperty,
  ɵɵtemplate,
  ɵɵtext
} from "./chunk-CTRHJBBW.js";

// src/app/shared/components/status-alarm-clock/status-alarm-clock.component.ts
function StatusAlarmClockComponent_span_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 3);
    \u0275\u0275text(1, "!");
    \u0275\u0275elementEnd();
  }
}
var _StatusAlarmClockComponent = class _StatusAlarmClockComponent {
  constructor() {
    this.color = "verde";
    this.excedido = false;
    this.size = 18;
    this.tooltip = "";
    this.tooltipText = "";
  }
  ngOnChanges(changes) {
    this.updateTooltip();
  }
  updateTooltip() {
    if (this.tooltip) {
      this.tooltipText = this.tooltip;
    } else {
      switch (this.color) {
        case "verde":
          this.tooltipText = "Tiempo normal";
          break;
        case "amarillo":
          this.tooltipText = "Acerc\xE1ndose al l\xEDmite";
          break;
        case "rojo":
          this.tooltipText = this.excedido ? "Tiempo excedido" : "Tiempo cr\xEDtico";
          break;
      }
    }
  }
};
_StatusAlarmClockComponent.\u0275fac = function StatusAlarmClockComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _StatusAlarmClockComponent)();
};
_StatusAlarmClockComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _StatusAlarmClockComponent, selectors: [["app-status-alarm-clock"]], inputs: { color: "color", excedido: "excedido", size: "size", tooltip: "tooltip" }, features: [\u0275\u0275NgOnChangesFeature], decls: 3, vars: 13, consts: [[1, "alarm-clock-container", 3, "title"], ["name", "alarm-clock", 1, "alarm-icon", 3, "size"], ["class", "exclamation", 4, "ngIf"], [1, "exclamation"]], template: function StatusAlarmClockComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 0);
    \u0275\u0275element(1, "lucide-angular", 1);
    \u0275\u0275template(2, StatusAlarmClockComponent_span_2_Template, 2, 0, "span", 2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275classProp("verde", ctx.color === "verde")("amarillo", ctx.color === "amarillo")("rojo", ctx.color === "rojo")("pulse", ctx.color === "rojo")("shake", ctx.excedido);
    \u0275\u0275property("title", ctx.tooltipText);
    \u0275\u0275advance();
    \u0275\u0275property("size", ctx.size);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.excedido);
  }
}, dependencies: [CommonModule, NgIf, LucideAngularModule, LucideAngularComponent], styles: ["\n\n.alarm-clock-container[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  position: relative;\n  padding: 6px;\n  border-radius: 50%;\n  transition: all 0.3s ease;\n  cursor: default;\n}\n.alarm-clock-container.verde[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #10B981 0%,\n      #059669 100%);\n  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.4);\n}\n.alarm-clock-container.verde[_ngcontent-%COMP%]   .alarm-icon[_ngcontent-%COMP%] {\n  color: white;\n}\n.alarm-clock-container.amarillo[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #F59E0B 0%,\n      #D97706 100%);\n  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.4);\n}\n.alarm-clock-container.amarillo[_ngcontent-%COMP%]   .alarm-icon[_ngcontent-%COMP%] {\n  color: white;\n}\n.alarm-clock-container.rojo[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #EF4444 0%,\n      #DC2626 100%);\n  box-shadow: 0 2px 12px rgba(239, 68, 68, 0.5);\n}\n.alarm-clock-container.rojo[_ngcontent-%COMP%]   .alarm-icon[_ngcontent-%COMP%] {\n  color: white;\n}\n.alarm-clock-container.pulse[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_pulse 1.5s ease-in-out infinite;\n}\n@keyframes _ngcontent-%COMP%_pulse {\n  0%, 100% {\n    transform: scale(1);\n    box-shadow: 0 2px 12px rgba(239, 68, 68, 0.5);\n  }\n  50% {\n    transform: scale(1.1);\n    box-shadow: 0 4px 20px rgba(239, 68, 68, 0.7);\n  }\n}\n.alarm-clock-container.shake[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_shake 0.5s ease-in-out infinite, _ngcontent-%COMP%_pulse 1.5s ease-in-out infinite;\n}\n@keyframes _ngcontent-%COMP%_shake {\n  0%, 100% {\n    transform: rotate(0deg);\n  }\n  25% {\n    transform: rotate(-5deg);\n  }\n  75% {\n    transform: rotate(5deg);\n  }\n}\n.exclamation[_ngcontent-%COMP%] {\n  position: absolute;\n  top: -4px;\n  right: -4px;\n  background: #fff;\n  color: #EF4444;\n  font-size: 10px;\n  font-weight: bold;\n  width: 14px;\n  height: 14px;\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);\n  animation: _ngcontent-%COMP%_bounce 1s ease infinite;\n}\n@keyframes _ngcontent-%COMP%_bounce {\n  0%, 100% {\n    transform: translateY(0);\n  }\n  50% {\n    transform: translateY(-2px);\n  }\n}\n.alarm-icon[_ngcontent-%COMP%] {\n  display: block;\n}\n/*# sourceMappingURL=status-alarm-clock.component.css.map */"] });
var StatusAlarmClockComponent = _StatusAlarmClockComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(StatusAlarmClockComponent, [{
    type: Component,
    args: [{ selector: "app-status-alarm-clock", standalone: true, imports: [CommonModule, LucideAngularModule], template: `
    <div class="alarm-clock-container"
         [class.verde]="color === 'verde'"
         [class.amarillo]="color === 'amarillo'"
         [class.rojo]="color === 'rojo'"
         [class.pulse]="color === 'rojo'"
         [class.shake]="excedido"
         [title]="tooltipText">
      <lucide-angular
        name="alarm-clock"
        [size]="size"
        class="alarm-icon">
      </lucide-angular>
      <span *ngIf="excedido" class="exclamation">!</span>
    </div>
  `, styles: ["/* angular:styles/component:css;834299b6025a92fcc68f9aba1bebcf3d5d1917e4a728fd024089ab87d4eb5de9;C:/Users/HP/Documents/Kubito-2.0-v1/cashi-discador-frontend/cashi-discador-frontend/src/app/shared/components/status-alarm-clock/status-alarm-clock.component.ts */\n.alarm-clock-container {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  position: relative;\n  padding: 6px;\n  border-radius: 50%;\n  transition: all 0.3s ease;\n  cursor: default;\n}\n.alarm-clock-container.verde {\n  background:\n    linear-gradient(\n      135deg,\n      #10B981 0%,\n      #059669 100%);\n  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.4);\n}\n.alarm-clock-container.verde .alarm-icon {\n  color: white;\n}\n.alarm-clock-container.amarillo {\n  background:\n    linear-gradient(\n      135deg,\n      #F59E0B 0%,\n      #D97706 100%);\n  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.4);\n}\n.alarm-clock-container.amarillo .alarm-icon {\n  color: white;\n}\n.alarm-clock-container.rojo {\n  background:\n    linear-gradient(\n      135deg,\n      #EF4444 0%,\n      #DC2626 100%);\n  box-shadow: 0 2px 12px rgba(239, 68, 68, 0.5);\n}\n.alarm-clock-container.rojo .alarm-icon {\n  color: white;\n}\n.alarm-clock-container.pulse {\n  animation: pulse 1.5s ease-in-out infinite;\n}\n@keyframes pulse {\n  0%, 100% {\n    transform: scale(1);\n    box-shadow: 0 2px 12px rgba(239, 68, 68, 0.5);\n  }\n  50% {\n    transform: scale(1.1);\n    box-shadow: 0 4px 20px rgba(239, 68, 68, 0.7);\n  }\n}\n.alarm-clock-container.shake {\n  animation: shake 0.5s ease-in-out infinite, pulse 1.5s ease-in-out infinite;\n}\n@keyframes shake {\n  0%, 100% {\n    transform: rotate(0deg);\n  }\n  25% {\n    transform: rotate(-5deg);\n  }\n  75% {\n    transform: rotate(5deg);\n  }\n}\n.exclamation {\n  position: absolute;\n  top: -4px;\n  right: -4px;\n  background: #fff;\n  color: #EF4444;\n  font-size: 10px;\n  font-weight: bold;\n  width: 14px;\n  height: 14px;\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);\n  animation: bounce 1s ease infinite;\n}\n@keyframes bounce {\n  0%, 100% {\n    transform: translateY(0);\n  }\n  50% {\n    transform: translateY(-2px);\n  }\n}\n.alarm-icon {\n  display: block;\n}\n/*# sourceMappingURL=status-alarm-clock.component.css.map */\n"] }]
  }], null, { color: [{
    type: Input
  }], excedido: [{
    type: Input
  }], size: [{
    type: Input
  }], tooltip: [{
    type: Input
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(StatusAlarmClockComponent, { className: "StatusAlarmClockComponent", filePath: "src/app/shared/components/status-alarm-clock/status-alarm-clock.component.ts", lineNumber: 126 });
})();

export {
  StatusAlarmClockComponent
};
//# sourceMappingURL=chunk-IRGKDA7E.js.map
