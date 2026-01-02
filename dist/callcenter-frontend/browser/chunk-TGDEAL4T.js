import {
  DomSanitizer
} from "./chunk-ZQICQP3Y.js";
import {
  Component,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵdefineComponent,
  ɵɵdirectiveInject,
  ɵɵdomElement,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵdomProperty,
  ɵɵsanitizeResourceUrl,
  ɵɵtext,
  ɵɵtextInterpolate
} from "./chunk-CTRHJBBW.js";

// src/app/features/legacy/reports/pages/contact-report/contact-report.component.ts
var _ContactReportComponent = class _ContactReportComponent {
  constructor(sanitizer) {
    this.sanitizer = sanitizer;
    this.reportTitle = "Reporte de Contacto";
    this.reportUrl = this.sanitizer.bypassSecurityTrustResourceUrl("https://docs.google.com/spreadsheets/d/14_qw5CebkN3Ar7fzF3k814dVyQ3KVwbQG1A9x_PrZpc/edit?rm=minimal");
  }
};
_ContactReportComponent.\u0275fac = function ContactReportComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _ContactReportComponent)(\u0275\u0275directiveInject(DomSanitizer));
};
_ContactReportComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ContactReportComponent, selectors: [["app-contact-report"]], decls: 6, vars: 2, consts: [[1, "report-container"], [1, "report-header"], [1, "report-title"], [1, "report-content"], ["frameborder", "0", "allowfullscreen", "", 1, "report-iframe", 3, "src"]], template: function ContactReportComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "div", 0)(1, "div", 1)(2, "h2", 2);
    \u0275\u0275text(3);
    \u0275\u0275domElementEnd()();
    \u0275\u0275domElementStart(4, "div", 3);
    \u0275\u0275domElement(5, "iframe", 4);
    \u0275\u0275domElementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx.reportTitle);
    \u0275\u0275advance(2);
    \u0275\u0275domProperty("src", ctx.reportUrl, \u0275\u0275sanitizeResourceUrl);
  }
}, styles: ["\n\n.report-container[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: 1400px;\n  margin: 0 auto;\n  padding: 2rem;\n  min-height: calc(100vh - 4rem);\n}\n.report-header[_ngcontent-%COMP%] {\n  margin-bottom: 1.5rem;\n}\n.report-title[_ngcontent-%COMP%] {\n  color: #f1f5f9;\n  font-size: 1.75rem;\n  font-weight: 600;\n  margin: 0;\n  background:\n    linear-gradient(\n      135deg,\n      #3b82f6,\n      #8b5cf6);\n  -webkit-background-clip: text;\n  -webkit-text-fill-color: transparent;\n  background-clip: text;\n}\n.report-content[_ngcontent-%COMP%] {\n  background: #1e293b;\n  border-radius: 12px;\n  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);\n  overflow: hidden;\n}\n.report-iframe[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 80vh;\n  min-height: 600px;\n  border: none;\n  display: block;\n}\nbody.light-theme[_nghost-%COMP%]   .report-title[_ngcontent-%COMP%], body.light-theme   [_nghost-%COMP%]   .report-title[_ngcontent-%COMP%] {\n  color: #1e293b;\n}\nbody.light-theme[_nghost-%COMP%]   .report-content[_ngcontent-%COMP%], body.light-theme   [_nghost-%COMP%]   .report-content[_ngcontent-%COMP%] {\n  background: white;\n  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);\n}\n@media screen and (max-width: 768px) {\n  .report-container[_ngcontent-%COMP%] {\n    padding: 1rem;\n  }\n  .report-title[_ngcontent-%COMP%] {\n    font-size: 1.5rem;\n  }\n  .report-iframe[_ngcontent-%COMP%] {\n    height: 70vh;\n    min-height: 400px;\n  }\n}\n/*# sourceMappingURL=contact-report.component.css.map */"] });
var ContactReportComponent = _ContactReportComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ContactReportComponent, [{
    type: Component,
    args: [{ selector: "app-contact-report", standalone: true, imports: [], template: '<div class="report-container">\r\n  <div class="report-header">\r\n    <h2 class="report-title">{{ reportTitle }}</h2>\r\n  </div>\r\n  <div class="report-content">\r\n    <iframe [src]="reportUrl" class="report-iframe" frameborder="0" allowfullscreen></iframe>\r\n  </div>\r\n</div>\r\n', styles: ["/* src/app/features/legacy/reports/pages/contact-report/contact-report.component.scss */\n.report-container {\n  width: 100%;\n  max-width: 1400px;\n  margin: 0 auto;\n  padding: 2rem;\n  min-height: calc(100vh - 4rem);\n}\n.report-header {\n  margin-bottom: 1.5rem;\n}\n.report-title {\n  color: #f1f5f9;\n  font-size: 1.75rem;\n  font-weight: 600;\n  margin: 0;\n  background:\n    linear-gradient(\n      135deg,\n      #3b82f6,\n      #8b5cf6);\n  -webkit-background-clip: text;\n  -webkit-text-fill-color: transparent;\n  background-clip: text;\n}\n.report-content {\n  background: #1e293b;\n  border-radius: 12px;\n  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);\n  overflow: hidden;\n}\n.report-iframe {\n  width: 100%;\n  height: 80vh;\n  min-height: 600px;\n  border: none;\n  display: block;\n}\n:host-context(body.light-theme) .report-title {\n  color: #1e293b;\n}\n:host-context(body.light-theme) .report-content {\n  background: white;\n  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);\n}\n@media screen and (max-width: 768px) {\n  .report-container {\n    padding: 1rem;\n  }\n  .report-title {\n    font-size: 1.5rem;\n  }\n  .report-iframe {\n    height: 70vh;\n    min-height: 400px;\n  }\n}\n/*# sourceMappingURL=contact-report.component.css.map */\n"] }]
  }], () => [{ type: DomSanitizer }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ContactReportComponent, { className: "ContactReportComponent", filePath: "src/app/features/legacy/reports/pages/contact-report/contact-report.component.ts", lineNumber: 11 });
})();
export {
  ContactReportComponent
};
//# sourceMappingURL=chunk-TGDEAL4T.js.map
