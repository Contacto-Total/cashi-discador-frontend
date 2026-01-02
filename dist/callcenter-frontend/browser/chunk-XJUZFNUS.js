import {
  AdminMonitoringService
} from "./chunk-IBGBXKRK.js";
import {
  Router
} from "./chunk-OCZLH7K5.js";
import "./chunk-ZQICQP3Y.js";
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
  ViewEncapsulation,
  interval,
  setClassMetadata,
  switchMap,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵdefineComponent,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-CTRHJBBW.js";

// src/app/features/admin/extensions-registry/extensions-registry.component.ts
function ExtensionsRegistryComponent_div_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 9);
    \u0275\u0275element(1, "lucide-angular", 10);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("size", 18);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.error);
  }
}
function ExtensionsRegistryComponent_div_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 11);
    \u0275\u0275element(1, "div", 12);
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3, "Cargando extensiones...");
    \u0275\u0275elementEnd()();
  }
}
function ExtensionsRegistryComponent_div_11_tr_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 21);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "td");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "td")(10, "span", 22);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "td", 23);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ext_r2 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ext_r2.extension);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ext_r2.fullName || ext_r2.displayName || "-");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ext_r2.ipAddress);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ext_r2.port);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngClass", ctx_r0.getStatusClass(ext_r2.status));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ext_r2.status, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ext_r2.pingMs);
  }
}
function ExtensionsRegistryComponent_div_11_tr_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 24);
    \u0275\u0275element(2, "lucide-angular", 25);
    \u0275\u0275text(3, " No hay extensiones registradas en este momento ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 20);
  }
}
function ExtensionsRegistryComponent_div_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 13)(1, "div", 14)(2, "h3");
    \u0275\u0275element(3, "lucide-angular", 15);
    \u0275\u0275text(4, " Extensiones Registradas");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 16);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 17)(8, "table", 18)(9, "thead")(10, "tr")(11, "th");
    \u0275\u0275text(12, "Extensi\xF3n/Anexo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "th");
    \u0275\u0275text(14, "Nombre");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "th");
    \u0275\u0275text(16, "IP");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "th");
    \u0275\u0275text(18, "Puerto");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "th");
    \u0275\u0275text(20, "Estado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "th");
    \u0275\u0275text(22, "Respuesta");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(23, "tbody");
    \u0275\u0275template(24, ExtensionsRegistryComponent_div_11_tr_24_Template, 14, 7, "tr", 19)(25, ExtensionsRegistryComponent_div_11_tr_25_Template, 4, 1, "tr", 20);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275property("size", 20);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" Total: ", ctx_r0.extensions.length, " ");
    \u0275\u0275advance(18);
    \u0275\u0275property("ngForOf", ctx_r0.extensions);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.extensions.length === 0);
  }
}
var _ExtensionsRegistryComponent = class _ExtensionsRegistryComponent {
  constructor(router, monitoringService) {
    this.router = router;
    this.monitoringService = monitoringService;
    this.extensions = [];
    this.loading = false;
    this.error = null;
  }
  ngOnInit() {
    this.loadExtensions();
    this.startPolling();
  }
  ngOnDestroy() {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }
  /**
   * Carga las extensiones registradas
   */
  loadExtensions() {
    this.loading = true;
    this.error = null;
    this.monitoringService.getExtensionRegistrations().subscribe({
      next: (extensions) => {
        this.extensions = extensions;
        this.loading = false;
      },
      error: (err) => {
        console.error("Error loading extensions:", err);
        this.error = "Error al cargar las extensiones registradas";
        this.loading = false;
      }
    });
  }
  /**
   * Inicia polling cada 5 segundos
   */
  startPolling() {
    this.pollingSubscription = interval(5e3).pipe(switchMap(() => this.monitoringService.getExtensionRegistrations())).subscribe({
      next: (extensions) => {
        this.extensions = extensions;
      },
      error: (err) => {
        console.error("Error polling extensions:", err);
      }
    });
  }
  /**
   * Vuelve a la pantalla de campañas
   */
  goBack() {
    this.router.navigate(["/admin/campaigns"]);
  }
  /**
   * Obtiene la clase CSS según el estado
   */
  getStatusClass(status) {
    return status === "REGISTRADO" ? "status-registered" : "status-unregistered";
  }
};
_ExtensionsRegistryComponent.\u0275fac = function ExtensionsRegistryComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _ExtensionsRegistryComponent)(\u0275\u0275directiveInject(Router), \u0275\u0275directiveInject(AdminMonitoringService));
};
_ExtensionsRegistryComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ExtensionsRegistryComponent, selectors: [["app-extensions-registry"]], decls: 12, vars: 4, consts: [[1, "extensions-container"], [1, "flex", "items-center", "gap-2", "mb-2"], [1, "w-8", "h-8", "bg-gradient-to-br", "from-indigo-600", "to-indigo-700", "rounded-lg", "flex", "items-center", "justify-center"], ["name", "phone", 1, "text-white", 3, "size"], [1, "text-lg", "font-bold", "text-white"], [1, "text-xs", "text-gray-400"], ["class", "error-message", 4, "ngIf"], ["class", "loading-state", 4, "ngIf"], ["class", "extensions-section", 4, "ngIf"], [1, "error-message"], ["name", "x-circle", 3, "size"], [1, "loading-state"], [1, "spinner"], [1, "extensions-section"], [1, "table-header"], ["name", "clipboard-list", 3, "size"], [1, "info-badge"], [1, "table-container"], [1, "extensions-table"], [4, "ngFor", "ngForOf"], [4, "ngIf"], [1, "extension-cell"], [1, "status-badge", 3, "ngClass"], [1, "ping-cell"], ["colspan", "6", 1, "empty-row"], ["name", "inbox", 3, "size"]], template: function ExtensionsRegistryComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2);
    \u0275\u0275element(3, "lucide-angular", 3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div")(5, "h1", 4);
    \u0275\u0275text(6, "Registro de Extensiones");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p", 5);
    \u0275\u0275text(8, "Gesti\xF3n de extensiones telef\xF3nicas registradas");
    \u0275\u0275elementEnd()()();
    \u0275\u0275template(9, ExtensionsRegistryComponent_div_9_Template, 3, 2, "div", 6)(10, ExtensionsRegistryComponent_div_10_Template, 4, 0, "div", 7)(11, ExtensionsRegistryComponent_div_11_Template, 26, 4, "div", 8);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance(3);
    \u0275\u0275property("size", 16);
    \u0275\u0275advance(6);
    \u0275\u0275property("ngIf", ctx.error);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.loading && ctx.extensions.length === 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx.loading || ctx.extensions.length > 0);
  }
}, dependencies: [CommonModule, NgClass, NgForOf, NgIf, LucideAngularModule, LucideAngularComponent], styles: ["/* src/app/features/admin/extensions-registry/extensions-registry.component.css */\n.extensions-container {\n  padding: 20px !important;\n  max-width: 1400px;\n  margin: 0 auto;\n  background:\n    linear-gradient(\n      to bottom right,\n      #0f172a,\n      #1e293b,\n      #0f172a);\n  min-height: 100vh;\n  color: #e2e8f0;\n}\n.header {\n  display: flex;\n  align-items: center;\n  gap: 20px;\n  margin-bottom: 30px;\n}\n.header h1 {\n  margin: 0;\n  color: #f1f5f9;\n  font-size: 28px;\n  font-weight: 600;\n}\n.btn-back {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  padding: 10px 16px;\n  background: #1e293b;\n  color: #e2e8f0;\n  border: 1px solid #334155;\n  border-radius: 8px;\n  cursor: pointer;\n  font-size: 14px;\n  transition: all 0.3s;\n}\n.btn-back:hover {\n  background: #334155;\n  border-color: #475569;\n}\n.error-message {\n  background: rgba(239, 68, 68, 0.1);\n  border: 1px solid #EF4444;\n  color: #EF4444;\n  padding: 12px 16px;\n  border-radius: 8px;\n  margin-bottom: 20px;\n  font-size: 14px;\n}\n.loading-state {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  padding: 60px;\n  color: #94a3b8;\n}\n.spinner {\n  border: 4px solid #334155;\n  border-top: 4px solid #3B82F6;\n  border-radius: 50%;\n  width: 40px;\n  height: 40px;\n  animation: spin 1s linear infinite;\n  margin-bottom: 16px;\n}\n@keyframes spin {\n  0% {\n    transform: rotate(0deg);\n  }\n  100% {\n    transform: rotate(360deg);\n  }\n}\n.extensions-section {\n  background: #1e293b;\n  border: 1px solid #334155;\n  border-radius: 12px;\n  padding: 20px;\n}\n.table-header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 20px;\n}\n.table-header h3 {\n  margin: 0;\n  color: #f1f5f9;\n  font-size: 20px;\n  font-weight: 600;\n}\n.info-badge {\n  padding: 6px 12px;\n  background: #3B82F6;\n  color: white;\n  border-radius: 6px;\n  font-size: 13px;\n  font-weight: 500;\n}\n.table-container {\n  overflow-x: auto;\n}\n.extensions-table {\n  width: 100%;\n  border-collapse: collapse;\n}\n.extensions-table thead {\n  background: #0f172a;\n}\n.extensions-table th {\n  padding: 12px;\n  text-align: left;\n  color: #94a3b8;\n  font-size: 13px;\n  font-weight: 600;\n  border-bottom: 2px solid #334155;\n}\n.extensions-table tbody tr {\n  border-bottom: 1px solid #334155;\n  transition: all 0.3s;\n}\n.extensions-table tbody tr:hover {\n  background: #0f172a;\n}\n.extensions-table td {\n  padding: 12px;\n  color: #e2e8f0;\n  font-size: 14px;\n}\n.extension-cell {\n  font-weight: 600;\n  color: #3B82F6;\n}\n.ping-cell {\n  font-weight: 500;\n  color: #10B981;\n}\n.user-agent-cell {\n  color: #94a3b8;\n  font-size: 12px;\n}\n.empty-row {\n  text-align: center;\n  color: #94a3b8;\n  padding: 40px !important;\n  font-size: 16px;\n}\n.status-badge {\n  padding: 4px 10px;\n  border-radius: 6px;\n  font-size: 12px;\n  font-weight: 500;\n  display: inline-block;\n}\n.status-registered {\n  background: rgba(16, 185, 129, 0.2);\n  color: #10B981;\n  border: 1px solid #10B981;\n}\n.status-unregistered {\n  background: rgba(239, 68, 68, 0.2);\n  color: #EF4444;\n  border: 1px solid #EF4444;\n}\n@media (max-width: 768px) {\n  .extensions-container {\n    padding: 15px;\n  }\n  .header {\n    flex-direction: column;\n    align-items: flex-start;\n  }\n  .table-header {\n    flex-direction: column;\n    align-items: flex-start;\n    gap: 10px;\n  }\n}\n/*# sourceMappingURL=extensions-registry.component.css.map */\n"], encapsulation: 2 });
var ExtensionsRegistryComponent = _ExtensionsRegistryComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ExtensionsRegistryComponent, [{
    type: Component,
    args: [{ selector: "app-extensions-registry", standalone: true, imports: [CommonModule, LucideAngularModule], encapsulation: ViewEncapsulation.None, template: `<div class="extensions-container">\r
  <!-- Header -->\r
  <div class="flex items-center gap-2 mb-2">\r
    <div class="w-8 h-8 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-lg flex items-center justify-center">\r
      <lucide-angular name="phone" [size]="16" class="text-white"></lucide-angular>\r
    </div>\r
    <div>\r
      <h1 class="text-lg font-bold text-white">Registro de Extensiones</h1>\r
      <p class="text-xs text-gray-400">Gesti\xF3n de extensiones telef\xF3nicas registradas</p>\r
    </div>\r
  </div>\r
\r
  <!-- Error Message -->\r
  <div *ngIf="error" class="error-message"><lucide-angular name="x-circle" [size]="18"></lucide-angular> {{ error }}</div>\r
\r
  <!-- Loading State -->\r
  <div *ngIf="loading && extensions.length === 0" class="loading-state">\r
    <div class="spinner"></div>\r
    <p>Cargando extensiones...</p>\r
  </div>\r
\r
  <!-- Extensions Table -->\r
  <div *ngIf="!loading || extensions.length > 0" class="extensions-section">\r
    <div class="table-header">\r
      <h3><lucide-angular name="clipboard-list" [size]="20"></lucide-angular> Extensiones Registradas</h3>\r
      <div class="info-badge">\r
        Total: {{ extensions.length }}\r
      </div>\r
    </div>\r
\r
    <div class="table-container">\r
      <table class="extensions-table">\r
        <thead>\r
          <tr>\r
            <th>Extensi\xF3n/Anexo</th>\r
            <th>Nombre</th>\r
            <th>IP</th>\r
            <th>Puerto</th>\r
            <th>Estado</th>\r
            <th>Respuesta</th>\r
          </tr>\r
        </thead>\r
        <tbody>\r
          <tr *ngFor="let ext of extensions">\r
            <td class="extension-cell">{{ ext.extension }}</td>\r
            <td>{{ ext.fullName || ext.displayName || '-' }}</td>\r
            <td>{{ ext.ipAddress }}</td>\r
            <td>{{ ext.port }}</td>\r
            <td>\r
              <span class="status-badge" [ngClass]="getStatusClass(ext.status)">\r
                {{ ext.status }}\r
              </span>\r
            </td>\r
            <td class="ping-cell">{{ ext.pingMs }}</td>\r
          </tr>\r
          <tr *ngIf="extensions.length === 0">\r
            <td colspan="6" class="empty-row">\r
              <lucide-angular name="inbox" [size]="20"></lucide-angular> No hay extensiones registradas en este momento\r
            </td>\r
          </tr>\r
        </tbody>\r
      </table>\r
    </div>\r
  </div>\r
</div>\r
`, styles: ["/* src/app/features/admin/extensions-registry/extensions-registry.component.css */\n.extensions-container {\n  padding: 20px !important;\n  max-width: 1400px;\n  margin: 0 auto;\n  background:\n    linear-gradient(\n      to bottom right,\n      #0f172a,\n      #1e293b,\n      #0f172a);\n  min-height: 100vh;\n  color: #e2e8f0;\n}\n.header {\n  display: flex;\n  align-items: center;\n  gap: 20px;\n  margin-bottom: 30px;\n}\n.header h1 {\n  margin: 0;\n  color: #f1f5f9;\n  font-size: 28px;\n  font-weight: 600;\n}\n.btn-back {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  padding: 10px 16px;\n  background: #1e293b;\n  color: #e2e8f0;\n  border: 1px solid #334155;\n  border-radius: 8px;\n  cursor: pointer;\n  font-size: 14px;\n  transition: all 0.3s;\n}\n.btn-back:hover {\n  background: #334155;\n  border-color: #475569;\n}\n.error-message {\n  background: rgba(239, 68, 68, 0.1);\n  border: 1px solid #EF4444;\n  color: #EF4444;\n  padding: 12px 16px;\n  border-radius: 8px;\n  margin-bottom: 20px;\n  font-size: 14px;\n}\n.loading-state {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  padding: 60px;\n  color: #94a3b8;\n}\n.spinner {\n  border: 4px solid #334155;\n  border-top: 4px solid #3B82F6;\n  border-radius: 50%;\n  width: 40px;\n  height: 40px;\n  animation: spin 1s linear infinite;\n  margin-bottom: 16px;\n}\n@keyframes spin {\n  0% {\n    transform: rotate(0deg);\n  }\n  100% {\n    transform: rotate(360deg);\n  }\n}\n.extensions-section {\n  background: #1e293b;\n  border: 1px solid #334155;\n  border-radius: 12px;\n  padding: 20px;\n}\n.table-header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 20px;\n}\n.table-header h3 {\n  margin: 0;\n  color: #f1f5f9;\n  font-size: 20px;\n  font-weight: 600;\n}\n.info-badge {\n  padding: 6px 12px;\n  background: #3B82F6;\n  color: white;\n  border-radius: 6px;\n  font-size: 13px;\n  font-weight: 500;\n}\n.table-container {\n  overflow-x: auto;\n}\n.extensions-table {\n  width: 100%;\n  border-collapse: collapse;\n}\n.extensions-table thead {\n  background: #0f172a;\n}\n.extensions-table th {\n  padding: 12px;\n  text-align: left;\n  color: #94a3b8;\n  font-size: 13px;\n  font-weight: 600;\n  border-bottom: 2px solid #334155;\n}\n.extensions-table tbody tr {\n  border-bottom: 1px solid #334155;\n  transition: all 0.3s;\n}\n.extensions-table tbody tr:hover {\n  background: #0f172a;\n}\n.extensions-table td {\n  padding: 12px;\n  color: #e2e8f0;\n  font-size: 14px;\n}\n.extension-cell {\n  font-weight: 600;\n  color: #3B82F6;\n}\n.ping-cell {\n  font-weight: 500;\n  color: #10B981;\n}\n.user-agent-cell {\n  color: #94a3b8;\n  font-size: 12px;\n}\n.empty-row {\n  text-align: center;\n  color: #94a3b8;\n  padding: 40px !important;\n  font-size: 16px;\n}\n.status-badge {\n  padding: 4px 10px;\n  border-radius: 6px;\n  font-size: 12px;\n  font-weight: 500;\n  display: inline-block;\n}\n.status-registered {\n  background: rgba(16, 185, 129, 0.2);\n  color: #10B981;\n  border: 1px solid #10B981;\n}\n.status-unregistered {\n  background: rgba(239, 68, 68, 0.2);\n  color: #EF4444;\n  border: 1px solid #EF4444;\n}\n@media (max-width: 768px) {\n  .extensions-container {\n    padding: 15px;\n  }\n  .header {\n    flex-direction: column;\n    align-items: flex-start;\n  }\n  .table-header {\n    flex-direction: column;\n    align-items: flex-start;\n    gap: 10px;\n  }\n}\n/*# sourceMappingURL=extensions-registry.component.css.map */\n"] }]
  }], () => [{ type: Router }, { type: AdminMonitoringService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ExtensionsRegistryComponent, { className: "ExtensionsRegistryComponent", filePath: "src/app/features/admin/extensions-registry/extensions-registry.component.ts", lineNumber: 17 });
})();
export {
  ExtensionsRegistryComponent
};
//# sourceMappingURL=chunk-XJUZFNUS.js.map
