import "./chunk-F5IUR55I.js";
import {
  MatProgressSpinnerModule
} from "./chunk-ITNLXDRW.js";
import {
  MatInputModule
} from "./chunk-DG4BJB2Z.js";
import {
  MatFormFieldModule
} from "./chunk-PB3KJUWG.js";
import "./chunk-MAXKR5SL.js";
import {
  MatCardModule
} from "./chunk-6IEEJC5K.js";
import {
  MatButtonModule
} from "./chunk-M2YI7FKS.js";
import "./chunk-Q5NKAKZL.js";
import {
  DomSanitizer
} from "./chunk-ZQICQP3Y.js";
import {
  DefaultValueAccessor,
  FormsModule,
  MaxLengthValidator,
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
  CommonModule,
  Component,
  HttpClient,
  Injectable,
  NgIf,
  ViewEncapsulation,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵinject,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeResourceUrl,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate2,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-CTRHJBBW.js";

// src/app/core/services/carta-cesion.service.ts
var _CartaCesionService = class _CartaCesionService {
  constructor(http) {
    this.http = http;
    this.apiUrl = `${environment.webServiceUrl}/cartas-cesion`;
  }
  /**
   * Buscar carta de cesión por DNI
   */
  searchByDni(dni) {
    return this.http.get(`${this.apiUrl}/search`, {
      params: { dni }
    });
  }
  /**
   * Obtener URL para ver el PDF
   */
  getViewUrl(filename) {
    return `${this.apiUrl}/view/${filename}`;
  }
  /**
   * Obtener URL para descargar el PDF
   */
  getDownloadUrl(filename) {
    return `${this.apiUrl}/download/${filename}`;
  }
  /**
   * Descargar PDF como blob
   */
  downloadPdf(filename) {
    return this.http.get(`${this.apiUrl}/download/${filename}`, {
      responseType: "blob"
    });
  }
};
_CartaCesionService.\u0275fac = function CartaCesionService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _CartaCesionService)(\u0275\u0275inject(HttpClient));
};
_CartaCesionService.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _CartaCesionService, factory: _CartaCesionService.\u0275fac, providedIn: "root" });
var CartaCesionService = _CartaCesionService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CartaCesionService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{ type: HttpClient }], null);
})();

// src/app/features/admin/carta-cesion-viewer/carta-cesion-viewer.component.ts
function CartaCesionViewerComponent_button_24_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 23);
    \u0275\u0275listener("click", function CartaCesionViewerComponent_button_24_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.clearSearch());
    });
    \u0275\u0275element(1, "lucide-angular", 24);
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3, "Limpiar");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 18);
  }
}
function CartaCesionViewerComponent_div_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 25);
    \u0275\u0275element(1, "lucide-angular", 26);
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("size", 18);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.errorMessage);
  }
}
function CartaCesionViewerComponent_div_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 27);
    \u0275\u0275element(1, "lucide-angular", 28);
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3, "Ingrese el DNI del cliente (8 d\xEDgitos) para buscar su carta de cesi\xF3n");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 18);
  }
}
function CartaCesionViewerComponent_div_28_div_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 39);
    \u0275\u0275element(1, "div", 40);
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3, "Cargando PDF...");
    \u0275\u0275elementEnd()();
  }
}
function CartaCesionViewerComponent_div_28_div_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 41);
    \u0275\u0275element(1, "iframe", 42);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("src", ctx_r1.pdfUrl, \u0275\u0275sanitizeResourceUrl);
  }
}
function CartaCesionViewerComponent_div_28_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 29)(1, "div", 8)(2, "div", 30)(3, "div", 31)(4, "div", 32);
    \u0275\u0275element(5, "lucide-angular", 33);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 34)(7, "h3");
    \u0275\u0275text(8, "Carta Encontrada");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "p");
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(11, "button", 35);
    \u0275\u0275listener("click", function CartaCesionViewerComponent_div_28_Template_button_click_11_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.downloadPdf());
    });
    \u0275\u0275element(12, "lucide-angular", 36);
    \u0275\u0275elementStart(13, "span");
    \u0275\u0275text(14, "Descargar PDF");
    \u0275\u0275elementEnd()()();
    \u0275\u0275template(15, CartaCesionViewerComponent_div_28_div_15_Template, 4, 0, "div", 37)(16, CartaCesionViewerComponent_div_28_div_16_Template, 2, 1, "div", 38);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275property("size", 20);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate2("DNI: ", ctx_r1.cartaData == null ? null : ctx_r1.cartaData.dni, " - ", ctx_r1.cartaData == null ? null : ctx_r1.cartaData.filename);
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 18);
    \u0275\u0275advance(3);
    \u0275\u0275property("ngIf", ctx_r1.loading);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r1.loading && ctx_r1.pdfUrl);
  }
}
function CartaCesionViewerComponent_div_29_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 43)(1, "div", 8)(2, "div", 44);
    \u0275\u0275element(3, "lucide-angular", 45);
    \u0275\u0275elementStart(4, "h3");
    \u0275\u0275text(5, "Vista Previa del PDF");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p");
    \u0275\u0275text(7, "Busque una carta de cesi\xF3n para visualizarla aqu\xED");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    \u0275\u0275advance(3);
    \u0275\u0275property("size", 64);
  }
}
var _CartaCesionViewerComponent = class _CartaCesionViewerComponent {
  constructor(cartaCesionService, sanitizer) {
    this.cartaCesionService = cartaCesionService;
    this.sanitizer = sanitizer;
    this.dni = "";
    this.loading = false;
    this.searching = false;
    this.cartaFound = false;
    this.errorMessage = "";
    this.cartaData = null;
    this.pdfUrl = null;
  }
  ngOnInit() {
  }
  /**
   * Buscar carta por DNI
   */
  searchCarta() {
    if (!this.dni || this.dni.trim().length !== 8) {
      this.errorMessage = "Por favor ingrese un DNI v\xE1lido de 8 d\xEDgitos";
      return;
    }
    if (!/^\d{8}$/.test(this.dni)) {
      this.errorMessage = "El DNI debe contener solo n\xFAmeros";
      return;
    }
    this.searching = true;
    this.loading = true;
    this.errorMessage = "";
    this.cartaFound = false;
    this.pdfUrl = null;
    this.cartaCesionService.searchByDni(this.dni).subscribe({
      next: (response) => {
        console.log("Carta encontrada:", response);
        this.cartaData = response;
        this.cartaFound = true;
        this.searching = false;
        this.loadPdf(response.filename);
      },
      error: (error) => {
        console.error("Error buscando carta:", error);
        this.searching = false;
        this.loading = false;
        if (error.status === 404) {
          this.errorMessage = `No se encontr\xF3 carta de cesi\xF3n para el DNI: ${this.dni}`;
        } else if (error.status === 400) {
          this.errorMessage = "DNI inv\xE1lido. Debe tener exactamente 8 d\xEDgitos";
        } else {
          this.errorMessage = "Error al buscar la carta de cesi\xF3n. Por favor intente nuevamente";
        }
      }
    });
  }
  /**
   * Cargar PDF para visualización (usando blob con autenticación)
   */
  loadPdf(filename) {
    this.cartaCesionService.downloadPdf(filename).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        this.loading = false;
      },
      error: (error) => {
        console.error("Error cargando PDF:", error);
        this.loading = false;
        this.errorMessage = "Error al cargar el PDF para visualizaci\xF3n";
      }
    });
  }
  /**
   * Descargar PDF
   */
  downloadPdf() {
    if (!this.cartaData)
      return;
    this.cartaCesionService.downloadPdf(this.cartaData.filename).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = this.cartaData.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        console.log("PDF descargado:", this.cartaData.filename);
      },
      error: (error) => {
        console.error("Error descargando PDF:", error);
        this.errorMessage = "Error al descargar el PDF. Por favor intente nuevamente";
      }
    });
  }
  /**
   * Limpiar búsqueda
   */
  clearSearch() {
    this.dni = "";
    this.cartaFound = false;
    this.cartaData = null;
    this.pdfUrl = null;
    this.errorMessage = "";
    this.searching = false;
    this.loading = false;
  }
  /**
   * Manejar Enter en el input
   */
  onEnter() {
    this.searchCarta();
  }
};
_CartaCesionViewerComponent.\u0275fac = function CartaCesionViewerComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _CartaCesionViewerComponent)(\u0275\u0275directiveInject(CartaCesionService), \u0275\u0275directiveInject(DomSanitizer));
};
_CartaCesionViewerComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _CartaCesionViewerComponent, selectors: [["app-carta-cesion-viewer"]], decls: 30, vars: 12, consts: [[1, "carta-cesion-container"], [1, "header-section"], [1, "header-icon"], ["name", "file-text", 1, "text-white", 3, "size"], [1, "header-text"], [1, "two-column-layout"], [1, "left-column"], [1, "search-card"], [1, "card-content"], [1, "search-section"], [1, "input-group"], [1, "input-label"], [1, "input-wrapper"], ["name", "hash", 1, "input-icon", 3, "size"], ["type", "text", "placeholder", "Ej: 12345678", "maxlength", "8", 1, "dni-input", 3, "ngModelChange", "keyup.enter", "ngModel", "disabled"], [1, "search-button", 3, "click", "disabled"], ["name", "search", 3, "size"], ["class", "clear-button", 3, "click", 4, "ngIf"], ["class", "error-message", 4, "ngIf"], ["class", "info-message", 4, "ngIf"], [1, "right-column"], ["class", "pdf-viewer-card", 4, "ngIf"], ["class", "pdf-placeholder-card", 4, "ngIf"], [1, "clear-button", 3, "click"], ["name", "x", 3, "size"], [1, "error-message"], ["name", "alert-circle", 3, "size"], [1, "info-message"], ["name", "info", 3, "size"], [1, "pdf-viewer-card"], [1, "pdf-info-header"], [1, "pdf-info"], [1, "success-icon"], ["name", "file-check", 3, "size"], [1, "pdf-info-text"], [1, "download-button", 3, "click"], ["name", "download", 3, "size"], ["class", "loading-container", 4, "ngIf"], ["class", "pdf-container", 4, "ngIf"], [1, "loading-container"], [1, "spinner"], [1, "pdf-container"], ["frameborder", "0", 1, "pdf-iframe", 3, "src"], [1, "pdf-placeholder-card"], [1, "placeholder-content"], ["name", "file-search", 3, "size"]], template: function CartaCesionViewerComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2);
    \u0275\u0275element(3, "lucide-angular", 3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 4)(5, "h1");
    \u0275\u0275text(6, "Cartas de Cesi\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p");
    \u0275\u0275text(8, "Buscar y visualizar cartas de cesi\xF3n por DNI");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(9, "div", 5)(10, "div", 6)(11, "div", 7)(12, "div", 8)(13, "div", 9)(14, "div", 10)(15, "label", 11);
    \u0275\u0275text(16, "DNI del Cliente");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "div", 12);
    \u0275\u0275element(18, "lucide-angular", 13);
    \u0275\u0275elementStart(19, "input", 14);
    \u0275\u0275twoWayListener("ngModelChange", function CartaCesionViewerComponent_Template_input_ngModelChange_19_listener($event) {
      \u0275\u0275twoWayBindingSet(ctx.dni, $event) || (ctx.dni = $event);
      return $event;
    });
    \u0275\u0275listener("keyup.enter", function CartaCesionViewerComponent_Template_input_keyup_enter_19_listener() {
      return ctx.onEnter();
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(20, "button", 15);
    \u0275\u0275listener("click", function CartaCesionViewerComponent_Template_button_click_20_listener() {
      return ctx.searchCarta();
    });
    \u0275\u0275element(21, "lucide-angular", 16);
    \u0275\u0275elementStart(22, "span");
    \u0275\u0275text(23);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(24, CartaCesionViewerComponent_button_24_Template, 4, 1, "button", 17);
    \u0275\u0275elementEnd();
    \u0275\u0275template(25, CartaCesionViewerComponent_div_25_Template, 4, 2, "div", 18)(26, CartaCesionViewerComponent_div_26_Template, 4, 1, "div", 19);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(27, "div", 20);
    \u0275\u0275template(28, CartaCesionViewerComponent_div_28_Template, 17, 6, "div", 21)(29, CartaCesionViewerComponent_div_29_Template, 8, 1, "div", 22);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    \u0275\u0275advance(3);
    \u0275\u0275property("size", 18);
    \u0275\u0275advance(15);
    \u0275\u0275property("size", 18);
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("ngModel", ctx.dni);
    \u0275\u0275property("disabled", ctx.searching);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx.searching || !ctx.dni || ctx.dni.length !== 8);
    \u0275\u0275advance();
    \u0275\u0275property("size", 18);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx.searching ? "Buscando..." : "Buscar");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.cartaFound);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.errorMessage);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx.cartaFound && !ctx.searching && !ctx.errorMessage);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", ctx.cartaFound);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx.cartaFound);
  }
}, dependencies: [
  CommonModule,
  NgIf,
  FormsModule,
  DefaultValueAccessor,
  NgControlStatus,
  MaxLengthValidator,
  NgModel,
  MatCardModule,
  MatButtonModule,
  MatInputModule,
  MatFormFieldModule,
  MatProgressSpinnerModule,
  LucideAngularModule,
  LucideAngularComponent
], styles: ['/* src/app/features/admin/carta-cesion-viewer/carta-cesion-viewer.component.css */\n.carta-cesion-container {\n  padding: 20px;\n  max-width: 1400px;\n  margin: 0 auto;\n  background-color: #f8fafc;\n  min-height: 100vh;\n  transition: background-color 0.3s ease;\n}\n:root.dark .carta-cesion-container,\nbody.dark-theme .carta-cesion-container {\n  background-color: #0f172a;\n}\n.header-section {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  margin-bottom: 20px;\n  animation: fadeInDown 0.5s ease;\n}\n@keyframes fadeInDown {\n  from {\n    opacity: 0;\n    transform: translateY(-20px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n.header-icon {\n  width: 40px;\n  height: 40px;\n  background:\n    linear-gradient(\n      135deg,\n      #3b82f6 0%,\n      #2563eb 100%);\n  border-radius: 10px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-shrink: 0;\n  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);\n  transition: all 0.3s ease;\n}\n.header-icon:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);\n}\n.header-text h1 {\n  font-size: 24px;\n  font-weight: 700;\n  color: #0f172a;\n  margin: 0;\n  line-height: 1.2;\n  transition: color 0.3s ease;\n}\n:root.dark .header-text h1,\nbody.dark-theme .header-text h1 {\n  color: #f8fafc;\n}\n.header-text p {\n  font-size: 14px;\n  color: #64748b;\n  margin: 0;\n  line-height: 1.2;\n  transition: color 0.3s ease;\n}\n:root.dark .header-text p,\nbody.dark-theme .header-text p {\n  color: #94a3b8;\n}\n.two-column-layout {\n  display: grid;\n  grid-template-columns: 400px 1fr;\n  gap: 20px;\n  align-items: start;\n}\n.left-column {\n  animation: slideInLeft 0.5s ease;\n}\n.right-column {\n  animation: slideInRight 0.5s ease;\n}\n@keyframes slideInLeft {\n  from {\n    opacity: 0;\n    transform: translateX(-30px);\n  }\n  to {\n    opacity: 1;\n    transform: translateX(0);\n  }\n}\n@keyframes slideInRight {\n  from {\n    opacity: 0;\n    transform: translateX(30px);\n  }\n  to {\n    opacity: 1;\n    transform: translateX(0);\n  }\n}\n.search-card,\n.pdf-viewer-card,\n.pdf-placeholder-card {\n  background-color: #ffffff;\n  border: 1px solid #e2e8f0;\n  border-radius: 16px;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);\n  transition: all 0.3s ease;\n}\n.search-card:hover,\n.pdf-viewer-card:hover,\n.pdf-placeholder-card:hover {\n  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);\n  transform: translateY(-2px);\n}\n:root.dark .search-card,\n:root.dark .pdf-viewer-card,\n:root.dark .pdf-placeholder-card,\nbody.dark-theme .search-card,\nbody.dark-theme .pdf-viewer-card,\nbody.dark-theme .pdf-placeholder-card {\n  background-color: #1e293b;\n  border: 1px solid #334155;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);\n}\n.card-content {\n  padding: 24px;\n}\n.search-section {\n  display: flex;\n  flex-direction: column;\n  gap: 16px;\n}\n.input-group {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n}\n.input-label {\n  font-size: 13px;\n  font-weight: 600;\n  color: #475569;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n  transition: color 0.3s ease;\n}\n:root.dark .input-label,\nbody.dark-theme .input-label {\n  color: #cbd5e1;\n}\n.input-wrapper {\n  position: relative;\n  display: flex;\n  align-items: center;\n  background: #ffffff;\n  border: 2px solid #e2e8f0;\n  border-radius: 12px;\n  padding: 0 16px;\n  height: 52px;\n  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);\n}\n.input-wrapper:hover {\n  border-color: #cbd5e1;\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);\n  transform: translateY(-1px);\n}\n.input-wrapper:focus-within {\n  border-color: #10B981;\n  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);\n  transform: translateY(-1px);\n}\n:root.dark .input-wrapper,\nbody.dark-theme .input-wrapper {\n  background: #0f172a;\n  border-color: #334155;\n}\n:root.dark .input-wrapper:hover,\nbody.dark-theme .input-wrapper:hover {\n  border-color: #475569;\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);\n}\n:root.dark .input-wrapper:focus-within,\nbody.dark-theme .input-wrapper:focus-within {\n  border-color: #10B981;\n  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.15);\n}\n.input-icon {\n  color: #94a3b8;\n  margin-right: 12px;\n  transition: all 0.3s ease;\n  flex-shrink: 0;\n}\n.input-wrapper:focus-within .input-icon {\n  color: #10B981;\n  transform: scale(1.1);\n}\n:root.dark .input-icon,\nbody.dark-theme .input-icon {\n  color: #64748b;\n}\n.dni-input {\n  flex: 1;\n  background: transparent;\n  border: none;\n  outline: none;\n  color: #0f172a;\n  font-size: 15px;\n  font-weight: 500;\n  padding: 0;\n  transition: color 0.3s ease;\n}\n.dni-input::placeholder {\n  color: #94a3b8;\n  opacity: 0.6;\n}\n.dni-input:disabled {\n  cursor: not-allowed;\n  opacity: 0.6;\n}\n:root.dark .dni-input,\nbody.dark-theme .dni-input {\n  color: #f8fafc;\n}\n:root.dark .dni-input::placeholder,\nbody.dark-theme .dni-input::placeholder {\n  color: #64748b;\n}\n.search-button,\n.clear-button,\n.download-button {\n  height: 52px;\n  width: 100%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 10px;\n  font-weight: 600;\n  font-size: 15px;\n  border-radius: 12px;\n  border: none;\n  cursor: pointer;\n  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);\n  position: relative;\n  overflow: hidden;\n}\n.search-button::before,\n.download-button::before {\n  content: "";\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  width: 0;\n  height: 0;\n  border-radius: 50%;\n  background: rgba(255, 255, 255, 0.3);\n  transform: translate(-50%, -50%);\n  transition: width 0.6s, height 0.6s;\n}\n.search-button:active::before,\n.download-button:active::before {\n  width: 300px;\n  height: 300px;\n}\n.search-button {\n  background:\n    linear-gradient(\n      135deg,\n      #3b82f6 0%,\n      #2563eb 100%);\n  color: white;\n  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);\n}\n.search-button:hover:not(:disabled) {\n  background:\n    linear-gradient(\n      135deg,\n      #2563eb 0%,\n      #1d4ed8 100%);\n  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);\n  transform: translateY(-2px);\n}\n.search-button:active:not(:disabled) {\n  transform: translateY(0);\n  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);\n}\n.search-button:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n  transform: none;\n}\n.clear-button {\n  background: #ffffff;\n  border: 2px solid #e2e8f0;\n  color: #64748b;\n}\n.clear-button:hover {\n  background: #f8fafc;\n  border-color: #cbd5e1;\n  color: #475569;\n  transform: translateY(-2px);\n}\n:root.dark .clear-button,\nbody.dark-theme .clear-button {\n  background: #0f172a;\n  border-color: #334155;\n  color: #94a3b8;\n}\n:root.dark .clear-button:hover,\nbody.dark-theme .clear-button:hover {\n  background: #1e293b;\n  border-color: #475569;\n  color: #cbd5e1;\n}\n.download-button {\n  width: auto;\n  padding: 0 24px;\n  background:\n    linear-gradient(\n      135deg,\n      #10b981 0%,\n      #059669 100%);\n  color: white;\n  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);\n}\n.download-button:hover {\n  background:\n    linear-gradient(\n      135deg,\n      #059669 0%,\n      #047857 100%);\n  box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);\n  transform: translateY(-2px);\n}\n.download-button:active {\n  transform: translateY(0);\n  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);\n}\n.error-message,\n.info-message {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  padding: 14px 16px;\n  border-radius: 12px;\n  font-size: 14px;\n  font-weight: 500;\n  animation: slideIn 0.3s ease;\n  transition: all 0.3s ease;\n}\n@keyframes slideIn {\n  from {\n    opacity: 0;\n    transform: translateY(-10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n.error-message {\n  background: #fef2f2;\n  border: 2px solid #fecaca;\n  color: #991b1b;\n}\n.error-message lucide-angular {\n  color: #dc2626;\n}\n:root.dark .error-message,\nbody.dark-theme .error-message {\n  background: rgba(239, 68, 68, 0.1);\n  border-color: rgba(239, 68, 68, 0.3);\n  color: #fca5a5;\n}\n.info-message {\n  background: #eff6ff;\n  border: 2px solid #bfdbfe;\n  color: #1e40af;\n}\n.info-message lucide-angular {\n  color: #3b82f6;\n}\n:root.dark .info-message,\nbody.dark-theme .info-message {\n  background: rgba(59, 130, 246, 0.1);\n  border-color: rgba(59, 130, 246, 0.3);\n  color: #93c5fd;\n}\n.pdf-info-header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 20px;\n  padding-bottom: 16px;\n  border-bottom: 2px solid #e2e8f0;\n  animation: fadeIn 0.5s ease;\n  transition: border-color 0.3s ease;\n}\n@keyframes fadeIn {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n:root.dark .pdf-info-header,\nbody.dark-theme .pdf-info-header {\n  border-color: #334155;\n}\n.pdf-info {\n  display: flex;\n  align-items: center;\n  gap: 14px;\n}\n.success-icon {\n  width: 44px;\n  height: 44px;\n  background:\n    linear-gradient(\n      135deg,\n      #10b981 0%,\n      #059669 100%);\n  border-radius: 12px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  color: white;\n  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);\n  animation: scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);\n}\n@keyframes scaleIn {\n  from {\n    opacity: 0;\n    transform: scale(0);\n  }\n  to {\n    opacity: 1;\n    transform: scale(1);\n  }\n}\n.pdf-info-text h3 {\n  font-size: 18px;\n  font-weight: 700;\n  color: #0f172a;\n  margin: 0 0 4px 0;\n  line-height: 1.2;\n  transition: color 0.3s ease;\n}\n:root.dark .pdf-info-text h3,\nbody.dark-theme .pdf-info-text h3 {\n  color: #f8fafc;\n}\n.pdf-info-text p {\n  font-size: 13px;\n  color: #64748b;\n  margin: 0;\n  line-height: 1.2;\n  transition: color 0.3s ease;\n}\n:root.dark .pdf-info-text p,\nbody.dark-theme .pdf-info-text p {\n  color: #94a3b8;\n}\n.loading-container {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  padding: 60px 20px;\n  gap: 16px;\n}\n.spinner {\n  width: 48px;\n  height: 48px;\n  border: 4px solid #e2e8f0;\n  border-top-color: #3b82f6;\n  border-radius: 50%;\n  animation: spin 0.8s linear infinite;\n}\n@keyframes spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n:root.dark .spinner,\nbody.dark-theme .spinner {\n  border-color: #334155;\n  border-top-color: #3b82f6;\n}\n.loading-container p {\n  color: #64748b;\n  font-size: 15px;\n  font-weight: 500;\n  transition: color 0.3s ease;\n}\n:root.dark .loading-container p,\nbody.dark-theme .loading-container p {\n  color: #94a3b8;\n}\n.pdf-container {\n  width: 100%;\n  height: calc(100vh - 280px);\n  min-height: 600px;\n  background: #f3f4f6;\n  border-radius: 12px;\n  overflow: hidden;\n  border: 2px solid #e2e8f0;\n  animation: fadeIn 0.5s ease;\n  transition: all 0.3s ease;\n}\n.pdf-container:hover {\n  border-color: #cbd5e1;\n}\n:root.dark .pdf-container,\nbody.dark-theme .pdf-container {\n  background: #0f172a;\n  border-color: #334155;\n}\n:root.dark .pdf-container:hover,\nbody.dark-theme .pdf-container:hover {\n  border-color: #475569;\n}\n.pdf-iframe {\n  width: 100%;\n  height: 100%;\n  border: none;\n}\n.placeholder-content {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  padding: 100px 20px;\n  text-align: center;\n  color: #94a3b8;\n  animation: fadeIn 0.5s ease;\n}\n.placeholder-content lucide-angular {\n  color: #cbd5e1;\n  margin-bottom: 24px;\n  opacity: 0.5;\n  animation: float 3s ease-in-out infinite;\n}\n@keyframes float {\n  0%, 100% {\n    transform: translateY(0);\n  }\n  50% {\n    transform: translateY(-10px);\n  }\n}\n:root.dark .placeholder-content lucide-angular,\nbody.dark-theme .placeholder-content lucide-angular {\n  color: #334155;\n}\n.placeholder-content h3 {\n  font-size: 20px;\n  font-weight: 600;\n  color: #64748b;\n  margin: 0 0 8px 0;\n  transition: color 0.3s ease;\n}\n:root.dark .placeholder-content h3,\nbody.dark-theme .placeholder-content h3 {\n  color: #94a3b8;\n}\n.placeholder-content p {\n  font-size: 15px;\n  color: #94a3b8;\n  margin: 0;\n  transition: color 0.3s ease;\n}\n:root.dark .placeholder-content p,\nbody.dark-theme .placeholder-content p {\n  color: #64748b;\n}\n@media (max-width: 1024px) {\n  .two-column-layout {\n    grid-template-columns: 1fr;\n  }\n  .pdf-container {\n    height: 500px;\n    min-height: 500px;\n  }\n}\n@media (max-width: 768px) {\n  .carta-cesion-container {\n    padding: 12px;\n  }\n  .header-text h1 {\n    font-size: 20px;\n  }\n  .header-text p {\n    font-size: 13px;\n  }\n  .card-content {\n    padding: 20px;\n  }\n  .pdf-info-header {\n    flex-direction: column;\n    align-items: flex-start;\n    gap: 12px;\n  }\n  .download-button {\n    width: 100%;\n  }\n  .pdf-container {\n    height: 450px;\n    min-height: 450px;\n  }\n  .placeholder-content {\n    padding: 60px 20px;\n  }\n}\n@media (prefers-reduced-motion: reduce) {\n  *,\n  *::before,\n  *::after {\n    animation-duration: 0.01ms !important;\n    animation-iteration-count: 1 !important;\n    transition-duration: 0.01ms !important;\n  }\n}\n/*# sourceMappingURL=carta-cesion-viewer.component.css.map */\n'], encapsulation: 2 });
var CartaCesionViewerComponent = _CartaCesionViewerComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CartaCesionViewerComponent, [{
    type: Component,
    args: [{ selector: "app-carta-cesion-viewer", standalone: true, imports: [
      CommonModule,
      FormsModule,
      MatCardModule,
      MatButtonModule,
      MatInputModule,
      MatFormFieldModule,
      MatProgressSpinnerModule,
      LucideAngularModule
    ], encapsulation: ViewEncapsulation.None, template: `<div class="carta-cesion-container">\r
  <!-- Header -->\r
  <div class="header-section">\r
    <div class="header-icon">\r
      <lucide-angular name="file-text" [size]="18" class="text-white"></lucide-angular>\r
    </div>\r
    <div class="header-text">\r
      <h1>Cartas de Cesi\xF3n</h1>\r
      <p>Buscar y visualizar cartas de cesi\xF3n por DNI</p>\r
    </div>\r
  </div>\r
\r
  <!-- Two Column Layout -->\r
  <div class="two-column-layout">\r
    <!-- Left Column: Search -->\r
    <div class="left-column">\r
      <div class="search-card">\r
        <div class="card-content">\r
          <div class="search-section">\r
            <!-- Search Input -->\r
            <div class="input-group">\r
              <label class="input-label">DNI del Cliente</label>\r
              <div class="input-wrapper">\r
                <lucide-angular name="hash" [size]="18" class="input-icon"></lucide-angular>\r
                <input\r
                  type="text"\r
                  [(ngModel)]="dni"\r
                  placeholder="Ej: 12345678"\r
                  maxlength="8"\r
                  (keyup.enter)="onEnter()"\r
                  [disabled]="searching"\r
                  class="dni-input">\r
              </div>\r
            </div>\r
\r
            <!-- Search Button -->\r
            <button\r
              (click)="searchCarta()"\r
              [disabled]="searching || !dni || dni.length !== 8"\r
              class="search-button">\r
              <lucide-angular name="search" [size]="18"></lucide-angular>\r
              <span>{{ searching ? 'Buscando...' : 'Buscar' }}</span>\r
            </button>\r
\r
            <!-- Clear Button -->\r
            <button\r
              *ngIf="cartaFound"\r
              (click)="clearSearch()"\r
              class="clear-button">\r
              <lucide-angular name="x" [size]="18"></lucide-angular>\r
              <span>Limpiar</span>\r
            </button>\r
          </div>\r
\r
          <!-- Error Message -->\r
          <div *ngIf="errorMessage" class="error-message">\r
            <lucide-angular name="alert-circle" [size]="18"></lucide-angular>\r
            <span>{{ errorMessage }}</span>\r
          </div>\r
\r
          <!-- Info Message -->\r
          <div *ngIf="!cartaFound && !searching && !errorMessage" class="info-message">\r
            <lucide-angular name="info" [size]="18"></lucide-angular>\r
            <span>Ingrese el DNI del cliente (8 d\xEDgitos) para buscar su carta de cesi\xF3n</span>\r
          </div>\r
        </div>\r
      </div>\r
    </div>\r
\r
    <!-- Right Column: PDF Viewer -->\r
    <div class="right-column">\r
      <div class="pdf-viewer-card" *ngIf="cartaFound">\r
        <div class="card-content">\r
          <!-- PDF Info Header -->\r
          <div class="pdf-info-header">\r
            <div class="pdf-info">\r
              <div class="success-icon">\r
                <lucide-angular name="file-check" [size]="20"></lucide-angular>\r
              </div>\r
              <div class="pdf-info-text">\r
                <h3>Carta Encontrada</h3>\r
                <p>DNI: {{ cartaData?.dni }} - {{ cartaData?.filename }}</p>\r
              </div>\r
            </div>\r
\r
            <!-- Download Button -->\r
            <button\r
              (click)="downloadPdf()"\r
              class="download-button">\r
              <lucide-angular name="download" [size]="18"></lucide-angular>\r
              <span>Descargar PDF</span>\r
            </button>\r
          </div>\r
\r
          <!-- Loading Spinner -->\r
          <div *ngIf="loading" class="loading-container">\r
            <div class="spinner"></div>\r
            <p>Cargando PDF...</p>\r
          </div>\r
\r
          <!-- PDF Iframe -->\r
          <div *ngIf="!loading && pdfUrl" class="pdf-container">\r
            <iframe\r
              [src]="pdfUrl"\r
              class="pdf-iframe"\r
              frameborder="0">\r
            </iframe>\r
          </div>\r
        </div>\r
      </div>\r
\r
      <!-- Placeholder when no PDF -->\r
      <div class="pdf-placeholder-card" *ngIf="!cartaFound">\r
        <div class="card-content">\r
          <div class="placeholder-content">\r
            <lucide-angular name="file-search" [size]="64"></lucide-angular>\r
            <h3>Vista Previa del PDF</h3>\r
            <p>Busque una carta de cesi\xF3n para visualizarla aqu\xED</p>\r
          </div>\r
        </div>\r
      </div>\r
    </div>\r
  </div>\r
</div>\r
`, styles: ['/* src/app/features/admin/carta-cesion-viewer/carta-cesion-viewer.component.css */\n.carta-cesion-container {\n  padding: 20px;\n  max-width: 1400px;\n  margin: 0 auto;\n  background-color: #f8fafc;\n  min-height: 100vh;\n  transition: background-color 0.3s ease;\n}\n:root.dark .carta-cesion-container,\nbody.dark-theme .carta-cesion-container {\n  background-color: #0f172a;\n}\n.header-section {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  margin-bottom: 20px;\n  animation: fadeInDown 0.5s ease;\n}\n@keyframes fadeInDown {\n  from {\n    opacity: 0;\n    transform: translateY(-20px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n.header-icon {\n  width: 40px;\n  height: 40px;\n  background:\n    linear-gradient(\n      135deg,\n      #3b82f6 0%,\n      #2563eb 100%);\n  border-radius: 10px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-shrink: 0;\n  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);\n  transition: all 0.3s ease;\n}\n.header-icon:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);\n}\n.header-text h1 {\n  font-size: 24px;\n  font-weight: 700;\n  color: #0f172a;\n  margin: 0;\n  line-height: 1.2;\n  transition: color 0.3s ease;\n}\n:root.dark .header-text h1,\nbody.dark-theme .header-text h1 {\n  color: #f8fafc;\n}\n.header-text p {\n  font-size: 14px;\n  color: #64748b;\n  margin: 0;\n  line-height: 1.2;\n  transition: color 0.3s ease;\n}\n:root.dark .header-text p,\nbody.dark-theme .header-text p {\n  color: #94a3b8;\n}\n.two-column-layout {\n  display: grid;\n  grid-template-columns: 400px 1fr;\n  gap: 20px;\n  align-items: start;\n}\n.left-column {\n  animation: slideInLeft 0.5s ease;\n}\n.right-column {\n  animation: slideInRight 0.5s ease;\n}\n@keyframes slideInLeft {\n  from {\n    opacity: 0;\n    transform: translateX(-30px);\n  }\n  to {\n    opacity: 1;\n    transform: translateX(0);\n  }\n}\n@keyframes slideInRight {\n  from {\n    opacity: 0;\n    transform: translateX(30px);\n  }\n  to {\n    opacity: 1;\n    transform: translateX(0);\n  }\n}\n.search-card,\n.pdf-viewer-card,\n.pdf-placeholder-card {\n  background-color: #ffffff;\n  border: 1px solid #e2e8f0;\n  border-radius: 16px;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);\n  transition: all 0.3s ease;\n}\n.search-card:hover,\n.pdf-viewer-card:hover,\n.pdf-placeholder-card:hover {\n  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);\n  transform: translateY(-2px);\n}\n:root.dark .search-card,\n:root.dark .pdf-viewer-card,\n:root.dark .pdf-placeholder-card,\nbody.dark-theme .search-card,\nbody.dark-theme .pdf-viewer-card,\nbody.dark-theme .pdf-placeholder-card {\n  background-color: #1e293b;\n  border: 1px solid #334155;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);\n}\n.card-content {\n  padding: 24px;\n}\n.search-section {\n  display: flex;\n  flex-direction: column;\n  gap: 16px;\n}\n.input-group {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n}\n.input-label {\n  font-size: 13px;\n  font-weight: 600;\n  color: #475569;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n  transition: color 0.3s ease;\n}\n:root.dark .input-label,\nbody.dark-theme .input-label {\n  color: #cbd5e1;\n}\n.input-wrapper {\n  position: relative;\n  display: flex;\n  align-items: center;\n  background: #ffffff;\n  border: 2px solid #e2e8f0;\n  border-radius: 12px;\n  padding: 0 16px;\n  height: 52px;\n  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);\n}\n.input-wrapper:hover {\n  border-color: #cbd5e1;\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);\n  transform: translateY(-1px);\n}\n.input-wrapper:focus-within {\n  border-color: #10B981;\n  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);\n  transform: translateY(-1px);\n}\n:root.dark .input-wrapper,\nbody.dark-theme .input-wrapper {\n  background: #0f172a;\n  border-color: #334155;\n}\n:root.dark .input-wrapper:hover,\nbody.dark-theme .input-wrapper:hover {\n  border-color: #475569;\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);\n}\n:root.dark .input-wrapper:focus-within,\nbody.dark-theme .input-wrapper:focus-within {\n  border-color: #10B981;\n  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.15);\n}\n.input-icon {\n  color: #94a3b8;\n  margin-right: 12px;\n  transition: all 0.3s ease;\n  flex-shrink: 0;\n}\n.input-wrapper:focus-within .input-icon {\n  color: #10B981;\n  transform: scale(1.1);\n}\n:root.dark .input-icon,\nbody.dark-theme .input-icon {\n  color: #64748b;\n}\n.dni-input {\n  flex: 1;\n  background: transparent;\n  border: none;\n  outline: none;\n  color: #0f172a;\n  font-size: 15px;\n  font-weight: 500;\n  padding: 0;\n  transition: color 0.3s ease;\n}\n.dni-input::placeholder {\n  color: #94a3b8;\n  opacity: 0.6;\n}\n.dni-input:disabled {\n  cursor: not-allowed;\n  opacity: 0.6;\n}\n:root.dark .dni-input,\nbody.dark-theme .dni-input {\n  color: #f8fafc;\n}\n:root.dark .dni-input::placeholder,\nbody.dark-theme .dni-input::placeholder {\n  color: #64748b;\n}\n.search-button,\n.clear-button,\n.download-button {\n  height: 52px;\n  width: 100%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 10px;\n  font-weight: 600;\n  font-size: 15px;\n  border-radius: 12px;\n  border: none;\n  cursor: pointer;\n  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);\n  position: relative;\n  overflow: hidden;\n}\n.search-button::before,\n.download-button::before {\n  content: "";\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  width: 0;\n  height: 0;\n  border-radius: 50%;\n  background: rgba(255, 255, 255, 0.3);\n  transform: translate(-50%, -50%);\n  transition: width 0.6s, height 0.6s;\n}\n.search-button:active::before,\n.download-button:active::before {\n  width: 300px;\n  height: 300px;\n}\n.search-button {\n  background:\n    linear-gradient(\n      135deg,\n      #3b82f6 0%,\n      #2563eb 100%);\n  color: white;\n  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);\n}\n.search-button:hover:not(:disabled) {\n  background:\n    linear-gradient(\n      135deg,\n      #2563eb 0%,\n      #1d4ed8 100%);\n  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);\n  transform: translateY(-2px);\n}\n.search-button:active:not(:disabled) {\n  transform: translateY(0);\n  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);\n}\n.search-button:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n  transform: none;\n}\n.clear-button {\n  background: #ffffff;\n  border: 2px solid #e2e8f0;\n  color: #64748b;\n}\n.clear-button:hover {\n  background: #f8fafc;\n  border-color: #cbd5e1;\n  color: #475569;\n  transform: translateY(-2px);\n}\n:root.dark .clear-button,\nbody.dark-theme .clear-button {\n  background: #0f172a;\n  border-color: #334155;\n  color: #94a3b8;\n}\n:root.dark .clear-button:hover,\nbody.dark-theme .clear-button:hover {\n  background: #1e293b;\n  border-color: #475569;\n  color: #cbd5e1;\n}\n.download-button {\n  width: auto;\n  padding: 0 24px;\n  background:\n    linear-gradient(\n      135deg,\n      #10b981 0%,\n      #059669 100%);\n  color: white;\n  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);\n}\n.download-button:hover {\n  background:\n    linear-gradient(\n      135deg,\n      #059669 0%,\n      #047857 100%);\n  box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);\n  transform: translateY(-2px);\n}\n.download-button:active {\n  transform: translateY(0);\n  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);\n}\n.error-message,\n.info-message {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  padding: 14px 16px;\n  border-radius: 12px;\n  font-size: 14px;\n  font-weight: 500;\n  animation: slideIn 0.3s ease;\n  transition: all 0.3s ease;\n}\n@keyframes slideIn {\n  from {\n    opacity: 0;\n    transform: translateY(-10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n.error-message {\n  background: #fef2f2;\n  border: 2px solid #fecaca;\n  color: #991b1b;\n}\n.error-message lucide-angular {\n  color: #dc2626;\n}\n:root.dark .error-message,\nbody.dark-theme .error-message {\n  background: rgba(239, 68, 68, 0.1);\n  border-color: rgba(239, 68, 68, 0.3);\n  color: #fca5a5;\n}\n.info-message {\n  background: #eff6ff;\n  border: 2px solid #bfdbfe;\n  color: #1e40af;\n}\n.info-message lucide-angular {\n  color: #3b82f6;\n}\n:root.dark .info-message,\nbody.dark-theme .info-message {\n  background: rgba(59, 130, 246, 0.1);\n  border-color: rgba(59, 130, 246, 0.3);\n  color: #93c5fd;\n}\n.pdf-info-header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 20px;\n  padding-bottom: 16px;\n  border-bottom: 2px solid #e2e8f0;\n  animation: fadeIn 0.5s ease;\n  transition: border-color 0.3s ease;\n}\n@keyframes fadeIn {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n:root.dark .pdf-info-header,\nbody.dark-theme .pdf-info-header {\n  border-color: #334155;\n}\n.pdf-info {\n  display: flex;\n  align-items: center;\n  gap: 14px;\n}\n.success-icon {\n  width: 44px;\n  height: 44px;\n  background:\n    linear-gradient(\n      135deg,\n      #10b981 0%,\n      #059669 100%);\n  border-radius: 12px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  color: white;\n  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);\n  animation: scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);\n}\n@keyframes scaleIn {\n  from {\n    opacity: 0;\n    transform: scale(0);\n  }\n  to {\n    opacity: 1;\n    transform: scale(1);\n  }\n}\n.pdf-info-text h3 {\n  font-size: 18px;\n  font-weight: 700;\n  color: #0f172a;\n  margin: 0 0 4px 0;\n  line-height: 1.2;\n  transition: color 0.3s ease;\n}\n:root.dark .pdf-info-text h3,\nbody.dark-theme .pdf-info-text h3 {\n  color: #f8fafc;\n}\n.pdf-info-text p {\n  font-size: 13px;\n  color: #64748b;\n  margin: 0;\n  line-height: 1.2;\n  transition: color 0.3s ease;\n}\n:root.dark .pdf-info-text p,\nbody.dark-theme .pdf-info-text p {\n  color: #94a3b8;\n}\n.loading-container {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  padding: 60px 20px;\n  gap: 16px;\n}\n.spinner {\n  width: 48px;\n  height: 48px;\n  border: 4px solid #e2e8f0;\n  border-top-color: #3b82f6;\n  border-radius: 50%;\n  animation: spin 0.8s linear infinite;\n}\n@keyframes spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n:root.dark .spinner,\nbody.dark-theme .spinner {\n  border-color: #334155;\n  border-top-color: #3b82f6;\n}\n.loading-container p {\n  color: #64748b;\n  font-size: 15px;\n  font-weight: 500;\n  transition: color 0.3s ease;\n}\n:root.dark .loading-container p,\nbody.dark-theme .loading-container p {\n  color: #94a3b8;\n}\n.pdf-container {\n  width: 100%;\n  height: calc(100vh - 280px);\n  min-height: 600px;\n  background: #f3f4f6;\n  border-radius: 12px;\n  overflow: hidden;\n  border: 2px solid #e2e8f0;\n  animation: fadeIn 0.5s ease;\n  transition: all 0.3s ease;\n}\n.pdf-container:hover {\n  border-color: #cbd5e1;\n}\n:root.dark .pdf-container,\nbody.dark-theme .pdf-container {\n  background: #0f172a;\n  border-color: #334155;\n}\n:root.dark .pdf-container:hover,\nbody.dark-theme .pdf-container:hover {\n  border-color: #475569;\n}\n.pdf-iframe {\n  width: 100%;\n  height: 100%;\n  border: none;\n}\n.placeholder-content {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  padding: 100px 20px;\n  text-align: center;\n  color: #94a3b8;\n  animation: fadeIn 0.5s ease;\n}\n.placeholder-content lucide-angular {\n  color: #cbd5e1;\n  margin-bottom: 24px;\n  opacity: 0.5;\n  animation: float 3s ease-in-out infinite;\n}\n@keyframes float {\n  0%, 100% {\n    transform: translateY(0);\n  }\n  50% {\n    transform: translateY(-10px);\n  }\n}\n:root.dark .placeholder-content lucide-angular,\nbody.dark-theme .placeholder-content lucide-angular {\n  color: #334155;\n}\n.placeholder-content h3 {\n  font-size: 20px;\n  font-weight: 600;\n  color: #64748b;\n  margin: 0 0 8px 0;\n  transition: color 0.3s ease;\n}\n:root.dark .placeholder-content h3,\nbody.dark-theme .placeholder-content h3 {\n  color: #94a3b8;\n}\n.placeholder-content p {\n  font-size: 15px;\n  color: #94a3b8;\n  margin: 0;\n  transition: color 0.3s ease;\n}\n:root.dark .placeholder-content p,\nbody.dark-theme .placeholder-content p {\n  color: #64748b;\n}\n@media (max-width: 1024px) {\n  .two-column-layout {\n    grid-template-columns: 1fr;\n  }\n  .pdf-container {\n    height: 500px;\n    min-height: 500px;\n  }\n}\n@media (max-width: 768px) {\n  .carta-cesion-container {\n    padding: 12px;\n  }\n  .header-text h1 {\n    font-size: 20px;\n  }\n  .header-text p {\n    font-size: 13px;\n  }\n  .card-content {\n    padding: 20px;\n  }\n  .pdf-info-header {\n    flex-direction: column;\n    align-items: flex-start;\n    gap: 12px;\n  }\n  .download-button {\n    width: 100%;\n  }\n  .pdf-container {\n    height: 450px;\n    min-height: 450px;\n  }\n  .placeholder-content {\n    padding: 60px 20px;\n  }\n}\n@media (prefers-reduced-motion: reduce) {\n  *,\n  *::before,\n  *::after {\n    animation-duration: 0.01ms !important;\n    animation-iteration-count: 1 !important;\n    transition-duration: 0.01ms !important;\n  }\n}\n/*# sourceMappingURL=carta-cesion-viewer.component.css.map */\n'] }]
  }], () => [{ type: CartaCesionService }, { type: DomSanitizer }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(CartaCesionViewerComponent, { className: "CartaCesionViewerComponent", filePath: "src/app/features/admin/carta-cesion-viewer/carta-cesion-viewer.component.ts", lineNumber: 30 });
})();
export {
  CartaCesionViewerComponent
};
//# sourceMappingURL=chunk-2EPL3REI.js.map
