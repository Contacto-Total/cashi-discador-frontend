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
  DatePipe,
  HttpClient,
  Injectable,
  NgClass,
  NgForOf,
  NgIf,
  interval,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassMap,
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
  ɵɵpipe,
  ɵɵpipeBind2,
  ɵɵproperty,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-CTRHJBBW.js";

// src/app/features/phone-lines/services/phone-line.service.ts
var _PhoneLineService = class _PhoneLineService {
  constructor(http) {
    this.http = http;
    this.baseUrl = environment.gatewayUrl || "http://localhost:8090";
  }
  // ========================================
  // Single Document Query
  // ========================================
  queryPhoneLines(request) {
    return this.http.post(`${this.baseUrl}/v1/phone-lines/query`, request);
  }
  queryPhoneLinesForceRefresh(request) {
    return this.http.post(`${this.baseUrl}/v1/phone-lines/query/refresh`, request);
  }
  queryPhoneLinesByDocument(documentNumber) {
    return this.http.get(`${this.baseUrl}/v1/phone-lines/query/${documentNumber}`);
  }
  // ========================================
  // Batch Processing (OSIPTEL)
  // ========================================
  startBatch(skipWhatsApp = false) {
    return this.http.post(`${this.baseUrl}/batch/phone-lines/start?skipWhatsApp=${skipWhatsApp}`, {});
  }
  getBatchStatus(batchId) {
    return this.http.get(`${this.baseUrl}/batch/phone-lines/status/${batchId}`);
  }
  isBatchRunning() {
    return this.http.get(`${this.baseUrl}/batch/phone-lines/running`);
  }
  stopBatch(batchId) {
    return this.http.post(`${this.baseUrl}/batch/phone-lines/stop/${batchId}`, {});
  }
  resetStuckBatches() {
    return this.http.post(`${this.baseUrl}/batch/phone-lines/reset`, {}, { responseType: "text" });
  }
  // ========================================
  // WhatsApp Verification
  // ========================================
  getWhatsAppStatus() {
    return this.http.get(`${this.baseUrl}/v1/whatsapp/status`);
  }
  connectWhatsApp() {
    return this.http.post(`${this.baseUrl}/v1/whatsapp/connect`, {});
  }
  getWhatsAppQR() {
    return this.http.get(`${this.baseUrl}/v1/whatsapp/qr`);
  }
  verifyPendingPhones() {
    return this.http.post(`${this.baseUrl}/v1/whatsapp/verify`, {});
  }
  logoutWhatsApp() {
    return this.http.post(`${this.baseUrl}/v1/whatsapp/logout`, {});
  }
};
_PhoneLineService.\u0275fac = function PhoneLineService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _PhoneLineService)(\u0275\u0275inject(HttpClient));
};
_PhoneLineService.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _PhoneLineService, factory: _PhoneLineService.\u0275fac, providedIn: "root" });
var PhoneLineService = _PhoneLineService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PhoneLineService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{ type: HttpClient }], null);
})();

// src/app/features/phone-lines/pages/phone-lines-page/phone-lines-page.component.ts
function PhoneLinesPageComponent_div_28_span_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 36);
    \u0275\u0275text(1, " Sin WhatsApp ");
    \u0275\u0275elementEnd();
  }
}
function PhoneLinesPageComponent_div_28_button_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 37);
    \u0275\u0275listener("click", function PhoneLinesPageComponent_div_28_button_9_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.stopBatch());
    });
    \u0275\u0275text(1, " Detener ");
    \u0275\u0275elementEnd();
  }
}
function PhoneLinesPageComponent_div_28_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 26)(1, "div", 27)(2, "div", 28)(3, "span", 29);
    \u0275\u0275text(4, "Proceso Batch");
    \u0275\u0275elementEnd();
    \u0275\u0275template(5, PhoneLinesPageComponent_div_28_span_5_Template, 2, 0, "span", 30);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 28)(7, "span", 31);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275template(9, PhoneLinesPageComponent_div_28_button_9_Template, 2, 0, "button", 32);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "div", 33);
    \u0275\u0275element(11, "div", 34);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "div", 35)(13, "span");
    \u0275\u0275text(14);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "span");
    \u0275\u0275text(16);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275property("ngIf", ctx_r1.batchSkippedWhatsApp);
    \u0275\u0275advance(2);
    \u0275\u0275classMap(ctx_r1.batchStatus.status === "RUNNING" ? "bg-blue-500/20 text-blue-400" : ctx_r1.batchStatus.status === "COMPLETED" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.batchStatus.status, " ");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.isBatchRunning);
    \u0275\u0275advance(2);
    \u0275\u0275styleProp("width", ctx_r1.getBatchProgressPercent(), "%");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2("", ctx_r1.batchStatus.processedRecords, " / ", ctx_r1.batchStatus.totalRecords);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("Exitosos: ", ctx_r1.batchStatus.successfulRecords, " | Fallidos: ", ctx_r1.batchStatus.failedRecords);
  }
}
function PhoneLinesPageComponent_div_29_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 38)(1, "p", 39);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.batchError);
  }
}
function PhoneLinesPageComponent_div_30_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 40);
    \u0275\u0275element(1, "div", 41);
    \u0275\u0275elementStart(2, "p", 42);
    \u0275\u0275text(3, "Consultando OSIPTEL...");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p", 43);
    \u0275\u0275text(5, "Esto puede tomar unos segundos");
    \u0275\u0275elementEnd()();
  }
}
function PhoneLinesPageComponent_div_31_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 44);
    \u0275\u0275element(1, "lucide-angular", 45);
    \u0275\u0275elementStart(2, "div")(3, "p", 46);
    \u0275\u0275text(4, "Error en la consulta");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 39);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("size", 24);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.error);
  }
}
function PhoneLinesPageComponent_div_32_div_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 62);
    \u0275\u0275element(1, "lucide-angular", 63);
    \u0275\u0275elementStart(2, "p", 42);
    \u0275\u0275text(3, "No se encontraron lineas telefonicas asociadas a este documento");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 48);
  }
}
function PhoneLinesPageComponent_div_32_div_20_tr_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr", 70)(1, "td", 71);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td", 72)(4, "div", 28);
    \u0275\u0275element(5, "lucide-angular", 73);
    \u0275\u0275elementStart(6, "span", 74);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(8, "td", 72)(9, "span", 75);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const line_r3 = ctx.$implicit;
    const i_r4 = ctx.index;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(i_r4 + 1);
    \u0275\u0275advance(3);
    \u0275\u0275property("size", 16);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(line_r3.phoneNumber);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngClass", ctx_r1.getCarrierColor(line_r3.carrier));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", line_r3.carrier, " ");
  }
}
function PhoneLinesPageComponent_div_32_div_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 64)(1, "table", 65)(2, "thead", 66)(3, "tr")(4, "th", 67);
    \u0275\u0275text(5, "#");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th", 67);
    \u0275\u0275text(7, "Telefono");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th", 67);
    \u0275\u0275text(9, "Empresa");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(10, "tbody", 68);
    \u0275\u0275template(11, PhoneLinesPageComponent_div_32_div_20_tr_11_Template, 11, 5, "tr", 69);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(11);
    \u0275\u0275property("ngForOf", ctx_r1.response.phoneLines);
  }
}
function PhoneLinesPageComponent_div_32_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 47)(1, "div", 48)(2, "div", 49)(3, "div", 50)(4, "div", 51);
    \u0275\u0275element(5, "lucide-angular", 52);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div")(7, "p", 53);
    \u0275\u0275text(8, "Documento");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "p", 54);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "span", 55);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(13, "div", 56)(14, "div", 57)(15, "p", 58);
    \u0275\u0275text(16);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "p", 53);
    \u0275\u0275text(18, "Lineas encontradas");
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275template(19, PhoneLinesPageComponent_div_32_div_19_Template, 4, 1, "div", 59)(20, PhoneLinesPageComponent_div_32_div_20_Template, 12, 1, "div", 60);
    \u0275\u0275elementStart(21, "div", 61);
    \u0275\u0275text(22);
    \u0275\u0275pipe(23, "date");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275property("size", 24);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.response.documentNumber);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.response.documentType);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.response.totalLines);
    \u0275\u0275advance(3);
    \u0275\u0275property("ngIf", ctx_r1.response.phoneLines.length === 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.response.phoneLines.length > 0);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" Consulta realizada: ", \u0275\u0275pipeBind2(23, 7, ctx_r1.response.queryDate, "dd/MM/yyyy HH:mm:ss"), " ");
  }
}
function PhoneLinesPageComponent_div_33_div_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 91)(1, "p", 92);
    \u0275\u0275text(2, "Escanea el codigo QR con WhatsApp");
    \u0275\u0275elementEnd();
    \u0275\u0275element(3, "img", 93);
    \u0275\u0275elementStart(4, "p", 94);
    \u0275\u0275text(5, "El codigo expira en 60 segundos");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275property("src", ctx_r1.whatsAppQR, \u0275\u0275sanitizeUrl);
  }
}
function PhoneLinesPageComponent_div_33_div_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 95);
    \u0275\u0275element(1, "lucide-angular", 96);
    \u0275\u0275elementStart(2, "p", 97);
    \u0275\u0275text(3, "WhatsApp conectado correctamente");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 48);
  }
}
function PhoneLinesPageComponent_div_33_div_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 98)(1, "p", 39);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.whatsAppError);
  }
}
function PhoneLinesPageComponent_div_33_button_16_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 99);
    \u0275\u0275listener("click", function PhoneLinesPageComponent_div_33_button_16_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.connectWhatsApp());
    });
    \u0275\u0275element(1, "lucide-angular", 100);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("disabled", ctx_r1.isConnectingWhatsApp);
    \u0275\u0275advance();
    \u0275\u0275property("size", 16);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.isConnectingWhatsApp ? "Conectando..." : "Generar QR", " ");
  }
}
function PhoneLinesPageComponent_div_33_button_17_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 101);
    \u0275\u0275listener("click", function PhoneLinesPageComponent_div_33_button_17_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.confirmStartBatch());
    });
    \u0275\u0275element(1, "lucide-angular", 102);
    \u0275\u0275text(2, " Iniciar Consulta Masiva ");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 16);
  }
}
function PhoneLinesPageComponent_div_33_button_20_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 103);
    \u0275\u0275listener("click", function PhoneLinesPageComponent_div_33_button_20_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.skipWhatsAppAndStartBatch());
    });
    \u0275\u0275element(1, "lucide-angular", 104);
    \u0275\u0275text(2, " Saltar y continuar sin WhatsApp ");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 16);
  }
}
function PhoneLinesPageComponent_div_33_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 76)(1, "div", 77)(2, "div", 78)(3, "h3", 79);
    \u0275\u0275text(4, "Conectar WhatsApp");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "button", 80);
    \u0275\u0275listener("click", function PhoneLinesPageComponent_div_33_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.closeWhatsAppModal());
    });
    \u0275\u0275element(6, "lucide-angular", 16);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 1);
    \u0275\u0275element(8, "div", 81);
    \u0275\u0275elementStart(9, "span", 29);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(11, PhoneLinesPageComponent_div_33_div_11_Template, 6, 1, "div", 82)(12, PhoneLinesPageComponent_div_33_div_12_Template, 4, 1, "div", 83)(13, PhoneLinesPageComponent_div_33_div_13_Template, 3, 1, "div", 84);
    \u0275\u0275elementStart(14, "div", 85)(15, "div", 86);
    \u0275\u0275template(16, PhoneLinesPageComponent_div_33_button_16_Template, 3, 3, "button", 87)(17, PhoneLinesPageComponent_div_33_button_17_Template, 3, 1, "button", 88);
    \u0275\u0275elementStart(18, "button", 89);
    \u0275\u0275listener("click", function PhoneLinesPageComponent_div_33_Template_button_click_18_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.closeWhatsAppModal());
    });
    \u0275\u0275text(19, " Cancelar ");
    \u0275\u0275elementEnd()();
    \u0275\u0275template(20, PhoneLinesPageComponent_div_33_button_20_Template, 3, 1, "button", 90);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275property("size", 20);
    \u0275\u0275advance(2);
    \u0275\u0275classMap(ctx_r1.isWhatsAppConnected() ? "bg-green-500" : "bg-red-500");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r1.isWhatsAppConnected() ? "Conectado" : "Desconectado", " ");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.whatsAppQR && !ctx_r1.isWhatsAppConnected());
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.isWhatsAppConnected());
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.whatsAppError);
    \u0275\u0275advance(3);
    \u0275\u0275property("ngIf", !ctx_r1.isWhatsAppConnected());
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.isWhatsAppConnected());
    \u0275\u0275advance(3);
    \u0275\u0275property("ngIf", !ctx_r1.isWhatsAppConnected());
  }
}
function PhoneLinesPageComponent_div_34_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 76)(1, "div", 105);
    \u0275\u0275element(2, "lucide-angular", 106);
    \u0275\u0275elementStart(3, "p", 107);
    \u0275\u0275text(4, "Proceso iniciado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 108);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "button", 109);
    \u0275\u0275listener("click", function PhoneLinesPageComponent_div_34_Template_button_click_7_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.closeBatchStartedPopup());
    });
    \u0275\u0275text(8, " Entendido ");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 48);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", ctx_r1.batchSkippedWhatsApp ? "El batch se est\xE1 ejecutando sin verificaci\xF3n de WhatsApp" : "El batch se est\xE1 ejecutando", " ");
  }
}
var _PhoneLinesPageComponent = class _PhoneLinesPageComponent {
  constructor(phoneLineService) {
    this.phoneLineService = phoneLineService;
    this.documentNumber = "";
    this.isLoading = false;
    this.response = null;
    this.error = null;
    this.batchStatus = null;
    this.isBatchRunning = false;
    this.batchError = null;
    this.batchSkippedWhatsApp = false;
    this.showBatchStartedPopup = false;
    this.whatsAppStatus = null;
    this.whatsAppQR = null;
    this.isConnectingWhatsApp = false;
    this.whatsAppError = null;
    this.showWhatsAppModal = false;
    this.batchPolling$ = null;
    this.whatsAppPolling$ = null;
  }
  ngOnInit() {
    this.checkInitialStatus();
  }
  ngOnDestroy() {
    this.stopBatchPolling();
    this.stopWhatsAppPolling();
  }
  checkInitialStatus() {
    this.phoneLineService.isBatchRunning().subscribe({
      next: (running) => {
        this.isBatchRunning = running;
      }
    });
    this.refreshWhatsAppStatus();
  }
  // ========================================
  // Batch Process Flow
  // ========================================
  startBatchProcess() {
    this.refreshWhatsAppStatus();
    this.showWhatsAppModal = true;
  }
  closeWhatsAppModal() {
    this.showWhatsAppModal = false;
    this.whatsAppError = null;
  }
  confirmStartBatch() {
    this.showWhatsAppModal = false;
    this.startBatch(false);
  }
  skipWhatsAppAndStartBatch() {
    this.showWhatsAppModal = false;
    this.startBatch(true);
  }
  // ========================================
  // Single Document Query
  // ========================================
  search() {
    if (!this.documentNumber || this.documentNumber.length < 8) {
      this.error = "Ingrese un documento valido (minimo 8 digitos)";
      return;
    }
    this.isLoading = true;
    this.error = null;
    this.response = null;
    this.phoneLineService.queryPhoneLines({ documentNumber: this.documentNumber }).subscribe({
      next: (response) => {
        this.response = response;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || "Error al consultar las lineas telefonicas";
        this.isLoading = false;
      }
    });
  }
  forceRefresh() {
    if (!this.documentNumber || this.documentNumber.length < 8) {
      this.error = "Ingrese un documento valido (minimo 8 digitos)";
      return;
    }
    this.isLoading = true;
    this.error = null;
    this.response = null;
    this.phoneLineService.queryPhoneLinesForceRefresh({ documentNumber: this.documentNumber }).subscribe({
      next: (response) => {
        this.response = response;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || "Error al consultar las lineas telefonicas";
        this.isLoading = false;
      }
    });
  }
  clearResults() {
    this.documentNumber = "";
    this.response = null;
    this.error = null;
  }
  // ========================================
  // Batch Processing
  // ========================================
  startBatch(skipWhatsApp = false) {
    if (this.isBatchRunning)
      return;
    this.batchError = null;
    this.batchSkippedWhatsApp = skipWhatsApp;
    this.isBatchRunning = true;
    this.phoneLineService.startBatch(skipWhatsApp).subscribe({
      next: (response) => {
        this.batchStatus = response;
        this.isBatchRunning = response.status === "RUNNING" || response.status === "STARTED";
        if (this.isBatchRunning) {
          this.showBatchStartedPopup = true;
          this.startBatchPolling(response.batchId);
        }
      },
      error: (err) => {
        this.batchError = err?.error?.message || "Error al iniciar el proceso batch";
        this.isBatchRunning = false;
      }
    });
  }
  closeBatchStartedPopup() {
    this.showBatchStartedPopup = false;
  }
  stopBatch() {
    if (!this.batchStatus?.batchId)
      return;
    this.phoneLineService.stopBatch(this.batchStatus.batchId).subscribe({
      next: (response) => {
        this.batchStatus = response;
        this.isBatchRunning = false;
        this.stopBatchPolling();
      },
      error: (err) => {
        this.batchError = err?.error?.message || "Error al detener el proceso batch";
      }
    });
  }
  resetBatches() {
    this.phoneLineService.resetStuckBatches().subscribe({
      next: () => {
        this.batchStatus = null;
        this.isBatchRunning = false;
        this.stopBatchPolling();
      },
      error: (err) => {
        this.batchError = "Error al resetear batches";
      }
    });
  }
  startBatchPolling(batchId) {
    this.stopBatchPolling();
    this.batchPolling$ = interval(3e3).subscribe(() => {
      this.phoneLineService.getBatchStatus(batchId).subscribe({
        next: (response) => {
          this.batchStatus = response;
          if (response.status !== "RUNNING") {
            this.isBatchRunning = false;
            this.stopBatchPolling();
          }
        }
      });
    });
  }
  stopBatchPolling() {
    if (this.batchPolling$) {
      this.batchPolling$.unsubscribe();
      this.batchPolling$ = null;
    }
  }
  getBatchProgressPercent() {
    if (!this.batchStatus || this.batchStatus.totalRecords === 0)
      return 0;
    return Math.round(this.batchStatus.processedRecords / this.batchStatus.totalRecords * 100);
  }
  // ========================================
  // WhatsApp
  // ========================================
  refreshWhatsAppStatus() {
    this.phoneLineService.getWhatsAppStatus().subscribe({
      next: (status) => {
        this.whatsAppStatus = status;
        if (status.status === "qr_ready") {
          this.phoneLineService.getWhatsAppQR().subscribe({
            next: (qr) => {
              this.whatsAppQR = qr.qrCode;
            }
          });
        } else {
          this.whatsAppQR = null;
        }
      },
      error: () => {
        this.whatsAppStatus = null;
      }
    });
  }
  connectWhatsApp() {
    this.isConnectingWhatsApp = true;
    this.whatsAppError = null;
    this.phoneLineService.connectWhatsApp().subscribe({
      next: (response) => {
        this.isConnectingWhatsApp = false;
        if (response.status === "connected") {
          this.whatsAppQR = null;
          this.refreshWhatsAppStatus();
        } else if (response.qrCode) {
          this.whatsAppQR = response.qrCode;
          this.startWhatsAppPolling();
        }
      },
      error: (err) => {
        this.isConnectingWhatsApp = false;
        this.whatsAppError = err?.error?.message || "Error al conectar WhatsApp";
      }
    });
  }
  startWhatsAppPolling() {
    this.stopWhatsAppPolling();
    this.whatsAppPolling$ = interval(3e3).subscribe(() => {
      this.refreshWhatsAppStatus();
      if (this.whatsAppStatus?.status === "connected") {
        this.stopWhatsAppPolling();
      }
    });
  }
  stopWhatsAppPolling() {
    if (this.whatsAppPolling$) {
      this.whatsAppPolling$.unsubscribe();
      this.whatsAppPolling$ = null;
    }
  }
  isWhatsAppConnected() {
    return this.whatsAppStatus?.status === "connected";
  }
  // ========================================
  // Utility
  // ========================================
  getCarrierColor(carrier) {
    const lowerCarrier = carrier?.toLowerCase() || "";
    if (lowerCarrier.includes("claro"))
      return "bg-red-100 text-red-700 border-red-300";
    if (lowerCarrier.includes("movistar"))
      return "bg-blue-100 text-blue-700 border-blue-300";
    if (lowerCarrier.includes("entel"))
      return "bg-orange-100 text-orange-700 border-orange-300";
    if (lowerCarrier.includes("bitel"))
      return "bg-green-100 text-green-700 border-green-300";
    return "bg-gray-100 text-gray-700 border-gray-300";
  }
  getModalityIcon(modality) {
    const lowerModality = modality?.toLowerCase() || "";
    if (lowerModality.includes("prepago"))
      return "credit-card";
    if (lowerModality.includes("postpago"))
      return "file-text";
    if (lowerModality.includes("control"))
      return "sliders";
    return "smartphone";
  }
};
_PhoneLinesPageComponent.\u0275fac = function PhoneLinesPageComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _PhoneLinesPageComponent)(\u0275\u0275directiveInject(PhoneLineService));
};
_PhoneLinesPageComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PhoneLinesPageComponent, selectors: [["app-phone-lines-page"]], decls: 35, vars: 18, consts: [[1, "min-h-screen", "bg-slate-950", "p-4"], [1, "flex", "items-center", "gap-2", "mb-4"], [1, "w-8", "h-8", "bg-gradient-to-br", "from-cyan-600", "to-blue-700", "rounded-lg", "flex", "items-center", "justify-center"], ["name", "smartphone", 1, "text-white", 3, "size"], [1, "text-lg", "font-bold", "text-white"], [1, "text-xs", "text-gray-400"], [1, "bg-slate-800", "rounded-lg", "p-4", "mb-4", "border", "border-slate-700"], [1, "flex", "flex-wrap", "gap-3", "items-end"], [1, "flex-1", "min-w-[200px]"], [1, "block", "text-sm", "font-medium", "text-gray-300", "mb-1"], ["type", "text", "placeholder", "Ingrese DNI o CE", "maxlength", "12", 1, "w-full", "h-10", "px-3", "text-sm", "border", "border-slate-600", "rounded-lg", "bg-slate-700", "text-white", "placeholder:text-slate-400", "focus:ring-2", "focus:ring-cyan-500", "focus:border-transparent", "transition-colors", 3, "ngModelChange", "keyup.enter", "ngModel"], ["type", "button", 1, "h-10", "px-4", "text-sm", "font-medium", "text-white", "bg-gradient-to-r", "from-cyan-600", "to-blue-700", "hover:from-cyan-700", "hover:to-blue-800", "rounded-lg", "transition-all", "duration-200", "disabled:opacity-50", "disabled:cursor-not-allowed", "flex", "items-center", "gap-2", 3, "click", "disabled"], ["name", "search", 3, "size"], ["type", "button", "title", "Forzar nueva consulta (ignorar cache)", 1, "h-10", "px-4", "text-sm", "font-medium", "text-white", "bg-gradient-to-r", "from-orange-500", "to-orange-600", "hover:from-orange-600", "hover:to-orange-700", "rounded-lg", "transition-all", "duration-200", "disabled:opacity-50", "disabled:cursor-not-allowed", "flex", "items-center", "gap-2", 3, "click", "disabled"], ["name", "refresh-cw", 3, "size"], ["type", "button", 1, "h-10", "px-4", "text-sm", "font-medium", "text-gray-300", "bg-slate-700", "hover:bg-slate-600", "rounded-lg", "transition-all", "duration-200", "flex", "items-center", "gap-2", 3, "click"], ["name", "x", 3, "size"], [1, "w-px", "h-10", "bg-slate-600", "mx-2"], ["type", "button", 1, "h-10", "px-4", "text-sm", "font-medium", "text-white", "bg-gradient-to-r", "from-purple-600", "to-purple-700", "hover:from-purple-700", "hover:to-purple-800", "rounded-lg", "transition-all", "duration-200", "disabled:opacity-50", "disabled:cursor-not-allowed", "flex", "items-center", "gap-2", 3, "click", "disabled"], ["name", "layers", 3, "size"], ["class", "mt-4 p-3 bg-slate-900 rounded-lg", 4, "ngIf"], ["class", "mt-3 p-2 bg-red-900/30 rounded-lg border border-red-700", 4, "ngIf"], ["class", "bg-slate-800 rounded-lg p-8 border border-slate-700 flex flex-col items-center justify-center", 4, "ngIf"], ["class", "bg-red-900/30 rounded-lg p-4 border border-red-700 flex items-center gap-3", 4, "ngIf"], ["class", "space-y-4", 4, "ngIf"], ["class", "fixed inset-0 bg-black/70 flex items-center justify-center z-50", 4, "ngIf"], [1, "mt-4", "p-3", "bg-slate-900", "rounded-lg"], [1, "flex", "items-center", "justify-between", "mb-2"], [1, "flex", "items-center", "gap-2"], [1, "text-sm", "text-gray-300"], ["class", "px-2 py-0.5 text-xs font-medium rounded-full bg-orange-500/20 text-orange-400", 4, "ngIf"], [1, "px-2", "py-0.5", "text-xs", "font-medium", "rounded-full"], ["class", "text-red-400 hover:text-red-300 text-xs", 3, "click", 4, "ngIf"], [1, "h-2", "bg-slate-700", "rounded-full", "overflow-hidden", "mb-2"], [1, "h-full", "bg-gradient-to-r", "from-cyan-500", "to-blue-500", "transition-all", "duration-300"], [1, "flex", "justify-between", "text-xs", "text-gray-400"], [1, "px-2", "py-0.5", "text-xs", "font-medium", "rounded-full", "bg-orange-500/20", "text-orange-400"], [1, "text-red-400", "hover:text-red-300", "text-xs", 3, "click"], [1, "mt-3", "p-2", "bg-red-900/30", "rounded-lg", "border", "border-red-700"], [1, "text-red-400", "text-sm"], [1, "bg-slate-800", "rounded-lg", "p-8", "border", "border-slate-700", "flex", "flex-col", "items-center", "justify-center"], [1, "animate-spin", "rounded-full", "h-12", "w-12", "border-b-2", "border-cyan-500", "mb-4"], [1, "text-gray-400"], [1, "text-xs", "text-gray-500", "mt-1"], [1, "bg-red-900/30", "rounded-lg", "p-4", "border", "border-red-700", "flex", "items-center", "gap-3"], ["name", "alert-circle", 1, "text-red-400", 3, "size"], [1, "text-red-300", "font-medium"], [1, "space-y-4"], [1, "bg-slate-800", "rounded-lg", "p-4", "border", "border-slate-700"], [1, "flex", "flex-wrap", "items-center", "justify-between", "gap-4"], [1, "flex", "items-center", "gap-4"], [1, "w-12", "h-12", "bg-gradient-to-br", "from-cyan-600", "to-blue-700", "rounded-full", "flex", "items-center", "justify-center"], ["name", "user", 1, "text-white", 3, "size"], [1, "text-gray-400", "text-sm"], [1, "text-white", "text-lg", "font-bold"], [1, "text-xs", "px-2", "py-0.5", "rounded", "bg-slate-700", "text-gray-300"], [1, "flex", "items-center", "gap-6"], [1, "text-center"], [1, "text-3xl", "font-bold", "text-cyan-400"], ["class", "bg-slate-800 rounded-lg p-8 border border-slate-700 text-center", 4, "ngIf"], ["class", "bg-slate-800 rounded-lg border border-slate-700 overflow-hidden", 4, "ngIf"], [1, "text-center", "text-xs", "text-gray-500"], [1, "bg-slate-800", "rounded-lg", "p-8", "border", "border-slate-700", "text-center"], ["name", "phone-off", 1, "text-gray-500", "mx-auto", "mb-4", 3, "size"], [1, "bg-slate-800", "rounded-lg", "border", "border-slate-700", "overflow-hidden"], [1, "w-full"], [1, "bg-slate-900"], [1, "px-4", "py-3", "text-left", "text-xs", "font-medium", "text-gray-400", "uppercase", "tracking-wider"], [1, "divide-y", "divide-slate-700"], ["class", "hover:bg-slate-700/50 transition-colors", 4, "ngFor", "ngForOf"], [1, "hover:bg-slate-700/50", "transition-colors"], [1, "px-4", "py-3", "text-sm", "text-gray-400"], [1, "px-4", "py-3"], ["name", "phone", 1, "text-cyan-400", 3, "size"], [1, "text-white", "font-medium"], [1, "px-2", "py-1", "text-xs", "font-medium", "rounded-full", "border", 3, "ngClass"], [1, "fixed", "inset-0", "bg-black/70", "flex", "items-center", "justify-center", "z-50"], [1, "bg-slate-800", "rounded-lg", "p-6", "max-w-md", "w-full", "mx-4", "border", "border-slate-700"], [1, "flex", "items-center", "justify-between", "mb-4"], [1, "text-lg", "font-semibold", "text-white"], [1, "text-gray-400", "hover:text-white", 3, "click"], [1, "w-3", "h-3", "rounded-full"], ["class", "flex flex-col items-center gap-4 p-4 bg-slate-900 rounded-lg mb-4", 4, "ngIf"], ["class", "flex flex-col items-center gap-4 p-4 bg-green-900/30 rounded-lg mb-4 border border-green-700", 4, "ngIf"], ["class", "bg-red-900/30 rounded-lg p-3 border border-red-700 mb-4", 4, "ngIf"], [1, "flex", "flex-col", "gap-3"], [1, "flex", "gap-2"], ["type", "button", "class", "flex-1 h-10 px-4 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2", 3, "disabled", "click", 4, "ngIf"], ["type", "button", "class", "flex-1 h-10 px-4 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 rounded-lg transition-all duration-200 flex items-center justify-center gap-2", 3, "click", 4, "ngIf"], ["type", "button", 1, "h-10", "px-4", "text-sm", "font-medium", "text-gray-300", "bg-slate-700", "hover:bg-slate-600", "rounded-lg", "transition-all", "duration-200", 3, "click"], ["type", "button", "class", "w-full h-9 text-sm font-medium text-gray-400 hover:text-white border border-slate-600 hover:border-slate-500 rounded-lg transition-all duration-200 flex items-center justify-center gap-2", 3, "click", 4, "ngIf"], [1, "flex", "flex-col", "items-center", "gap-4", "p-4", "bg-slate-900", "rounded-lg", "mb-4"], [1, "text-sm", "text-gray-400"], ["alt", "QR Code", 1, "w-48", "h-48", "bg-white", "p-2", "rounded-lg", 3, "src"], [1, "text-xs", "text-gray-500"], [1, "flex", "flex-col", "items-center", "gap-4", "p-4", "bg-green-900/30", "rounded-lg", "mb-4", "border", "border-green-700"], ["name", "check-circle", 1, "text-green-400", 3, "size"], [1, "text-green-300", "text-center"], [1, "bg-red-900/30", "rounded-lg", "p-3", "border", "border-red-700", "mb-4"], ["type", "button", 1, "flex-1", "h-10", "px-4", "text-sm", "font-medium", "text-white", "bg-gradient-to-r", "from-green-500", "to-green-600", "hover:from-green-600", "hover:to-green-700", "rounded-lg", "transition-all", "duration-200", "disabled:opacity-50", "disabled:cursor-not-allowed", "flex", "items-center", "justify-center", "gap-2", 3, "click", "disabled"], ["name", "qr-code", 3, "size"], ["type", "button", 1, "flex-1", "h-10", "px-4", "text-sm", "font-medium", "text-white", "bg-gradient-to-r", "from-purple-600", "to-purple-700", "hover:from-purple-700", "hover:to-purple-800", "rounded-lg", "transition-all", "duration-200", "flex", "items-center", "justify-center", "gap-2", 3, "click"], ["name", "play", 3, "size"], ["type", "button", 1, "w-full", "h-9", "text-sm", "font-medium", "text-gray-400", "hover:text-white", "border", "border-slate-600", "hover:border-slate-500", "rounded-lg", "transition-all", "duration-200", "flex", "items-center", "justify-center", "gap-2", 3, "click"], ["name", "skip-forward", 3, "size"], [1, "bg-slate-800", "rounded-lg", "p-6", "max-w-sm", "w-full", "mx-4", "border", "border-slate-700", "text-center"], ["name", "check-circle", 1, "text-green-400", "mx-auto", "mb-4", 3, "size"], [1, "text-white", "font-medium", "text-lg"], [1, "text-gray-400", "text-sm", "mt-2"], [1, "mt-4", "w-full", "h-10", "px-4", "text-sm", "font-medium", "text-white", "bg-gradient-to-r", "from-cyan-600", "to-blue-700", "hover:from-cyan-700", "hover:to-blue-800", "rounded-lg", "transition-all", 3, "click"]], template: function PhoneLinesPageComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2);
    \u0275\u0275element(3, "lucide-angular", 3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div")(5, "h1", 4);
    \u0275\u0275text(6, "Consulta de Lineas Telefonicas");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p", 5);
    \u0275\u0275text(8, "Consulta lineas asociadas a un documento (OSIPTEL)");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(9, "div", 6)(10, "div", 7)(11, "div", 8)(12, "label", 9);
    \u0275\u0275text(13, "Numero de Documento");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "input", 10);
    \u0275\u0275twoWayListener("ngModelChange", function PhoneLinesPageComponent_Template_input_ngModelChange_14_listener($event) {
      \u0275\u0275twoWayBindingSet(ctx.documentNumber, $event) || (ctx.documentNumber = $event);
      return $event;
    });
    \u0275\u0275listener("keyup.enter", function PhoneLinesPageComponent_Template_input_keyup_enter_14_listener() {
      return ctx.search();
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "button", 11);
    \u0275\u0275listener("click", function PhoneLinesPageComponent_Template_button_click_15_listener() {
      return ctx.search();
    });
    \u0275\u0275element(16, "lucide-angular", 12);
    \u0275\u0275text(17);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "button", 13);
    \u0275\u0275listener("click", function PhoneLinesPageComponent_Template_button_click_18_listener() {
      return ctx.forceRefresh();
    });
    \u0275\u0275element(19, "lucide-angular", 14);
    \u0275\u0275text(20, " Actualizar ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "button", 15);
    \u0275\u0275listener("click", function PhoneLinesPageComponent_Template_button_click_21_listener() {
      return ctx.clearResults();
    });
    \u0275\u0275element(22, "lucide-angular", 16);
    \u0275\u0275text(23, " Limpiar ");
    \u0275\u0275elementEnd();
    \u0275\u0275element(24, "div", 17);
    \u0275\u0275elementStart(25, "button", 18);
    \u0275\u0275listener("click", function PhoneLinesPageComponent_Template_button_click_25_listener() {
      return ctx.startBatchProcess();
    });
    \u0275\u0275element(26, "lucide-angular", 19);
    \u0275\u0275text(27);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(28, PhoneLinesPageComponent_div_28_Template, 17, 11, "div", 20)(29, PhoneLinesPageComponent_div_29_Template, 3, 1, "div", 21);
    \u0275\u0275elementEnd();
    \u0275\u0275template(30, PhoneLinesPageComponent_div_30_Template, 6, 0, "div", 22)(31, PhoneLinesPageComponent_div_31_Template, 7, 2, "div", 23)(32, PhoneLinesPageComponent_div_32_Template, 24, 10, "div", 24);
    \u0275\u0275elementEnd();
    \u0275\u0275template(33, PhoneLinesPageComponent_div_33_Template, 21, 10, "div", 25)(34, PhoneLinesPageComponent_div_34_Template, 9, 2, "div", 25);
  }
  if (rf & 2) {
    \u0275\u0275advance(3);
    \u0275\u0275property("size", 16);
    \u0275\u0275advance(11);
    \u0275\u0275twoWayProperty("ngModel", ctx.documentNumber);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx.isLoading || !ctx.documentNumber);
    \u0275\u0275advance();
    \u0275\u0275property("size", 16);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx.isLoading ? "Consultando..." : "Consultar", " ");
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx.isLoading || !ctx.documentNumber);
    \u0275\u0275advance();
    \u0275\u0275property("size", 16);
    \u0275\u0275advance(3);
    \u0275\u0275property("size", 16);
    \u0275\u0275advance(3);
    \u0275\u0275property("disabled", ctx.isBatchRunning);
    \u0275\u0275advance();
    \u0275\u0275property("size", 16);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx.isBatchRunning ? "Procesando..." : "Consulta Masiva OSIPTEL", " ");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.batchStatus);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.batchError);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.isLoading);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.error && !ctx.isLoading);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.response && !ctx.isLoading);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.showWhatsAppModal);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.showBatchStartedPopup);
  }
}, dependencies: [CommonModule, NgClass, NgForOf, NgIf, FormsModule, DefaultValueAccessor, NgControlStatus, MaxLengthValidator, NgModel, LucideAngularModule, LucideAngularComponent, DatePipe], styles: ["\n\n/*# sourceMappingURL=phone-lines-page.component.css.map */"] });
var PhoneLinesPageComponent = _PhoneLinesPageComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PhoneLinesPageComponent, [{
    type: Component,
    args: [{ selector: "app-phone-lines-page", standalone: true, imports: [CommonModule, FormsModule, LucideAngularModule], template: `<div class="min-h-screen bg-slate-950 p-4">\r
  <!-- Header -->\r
  <div class="flex items-center gap-2 mb-4">\r
    <div class="w-8 h-8 bg-gradient-to-br from-cyan-600 to-blue-700 rounded-lg flex items-center justify-center">\r
      <lucide-angular name="smartphone" [size]="16" class="text-white"></lucide-angular>\r
    </div>\r
    <div>\r
      <h1 class="text-lg font-bold text-white">Consulta de Lineas Telefonicas</h1>\r
      <p class="text-xs text-gray-400">Consulta lineas asociadas a un documento (OSIPTEL)</p>\r
    </div>\r
  </div>\r
\r
  <!-- Search Form -->\r
  <div class="bg-slate-800 rounded-lg p-4 mb-4 border border-slate-700">\r
    <div class="flex flex-wrap gap-3 items-end">\r
      <!-- Documento Input -->\r
      <div class="flex-1 min-w-[200px]">\r
        <label class="block text-sm font-medium text-gray-300 mb-1">Numero de Documento</label>\r
        <input\r
          type="text"\r
          [(ngModel)]="documentNumber"\r
          placeholder="Ingrese DNI o CE"\r
          maxlength="12"\r
          class="w-full h-10 px-3 text-sm border border-slate-600 rounded-lg bg-slate-700 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"\r
          (keyup.enter)="search()"\r
        />\r
      </div>\r
\r
      <!-- Consultar Individual -->\r
      <button\r
        type="button"\r
        class="h-10 px-4 text-sm font-medium text-white bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-700 hover:to-blue-800 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"\r
        (click)="search()"\r
        [disabled]="isLoading || !documentNumber">\r
        <lucide-angular name="search" [size]="16"></lucide-angular>\r
        {{ isLoading ? 'Consultando...' : 'Consultar' }}\r
      </button>\r
\r
      <!-- Actualizar (Force Refresh) -->\r
      <button\r
        type="button"\r
        class="h-10 px-4 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"\r
        (click)="forceRefresh()"\r
        [disabled]="isLoading || !documentNumber"\r
        title="Forzar nueva consulta (ignorar cache)">\r
        <lucide-angular name="refresh-cw" [size]="16"></lucide-angular>\r
        Actualizar\r
      </button>\r
\r
      <!-- Limpiar -->\r
      <button\r
        type="button"\r
        class="h-10 px-4 text-sm font-medium text-gray-300 bg-slate-700 hover:bg-slate-600 rounded-lg transition-all duration-200 flex items-center gap-2"\r
        (click)="clearResults()">\r
        <lucide-angular name="x" [size]="16"></lucide-angular>\r
        Limpiar\r
      </button>\r
\r
      <!-- Separador -->\r
      <div class="w-px h-10 bg-slate-600 mx-2"></div>\r
\r
      <!-- Consulta Masiva OSIPTEL -->\r
      <button\r
        type="button"\r
        class="h-10 px-4 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"\r
        (click)="startBatchProcess()"\r
        [disabled]="isBatchRunning">\r
        <lucide-angular name="layers" [size]="16"></lucide-angular>\r
        {{ isBatchRunning ? 'Procesando...' : 'Consulta Masiva OSIPTEL' }}\r
      </button>\r
    </div>\r
\r
    <!-- Batch Progress (solo visible cuando hay batch corriendo o terminado) -->\r
    <div *ngIf="batchStatus" class="mt-4 p-3 bg-slate-900 rounded-lg">\r
      <div class="flex items-center justify-between mb-2">\r
        <div class="flex items-center gap-2">\r
          <span class="text-sm text-gray-300">Proceso Batch</span>\r
          <span *ngIf="batchSkippedWhatsApp" class="px-2 py-0.5 text-xs font-medium rounded-full bg-orange-500/20 text-orange-400">\r
            Sin WhatsApp\r
          </span>\r
        </div>\r
        <div class="flex items-center gap-2">\r
          <span class="px-2 py-0.5 text-xs font-medium rounded-full"\r
            [class]="batchStatus.status === 'RUNNING' ? 'bg-blue-500/20 text-blue-400' :\r
                     batchStatus.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400' :\r
                     'bg-yellow-500/20 text-yellow-400'">\r
            {{ batchStatus.status }}\r
          </span>\r
          <button *ngIf="isBatchRunning" (click)="stopBatch()" class="text-red-400 hover:text-red-300 text-xs">\r
            Detener\r
          </button>\r
        </div>\r
      </div>\r
      <div class="h-2 bg-slate-700 rounded-full overflow-hidden mb-2">\r
        <div class="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"\r
          [style.width.%]="getBatchProgressPercent()"></div>\r
      </div>\r
      <div class="flex justify-between text-xs text-gray-400">\r
        <span>{{ batchStatus.processedRecords }} / {{ batchStatus.totalRecords }}</span>\r
        <span>Exitosos: {{ batchStatus.successfulRecords }} | Fallidos: {{ batchStatus.failedRecords }}</span>\r
      </div>\r
    </div>\r
\r
    <!-- Batch Error -->\r
    <div *ngIf="batchError" class="mt-3 p-2 bg-red-900/30 rounded-lg border border-red-700">\r
      <p class="text-red-400 text-sm">{{ batchError }}</p>\r
    </div>\r
  </div>\r
\r
  <!-- Loading State -->\r
  <div *ngIf="isLoading" class="bg-slate-800 rounded-lg p-8 border border-slate-700 flex flex-col items-center justify-center">\r
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mb-4"></div>\r
    <p class="text-gray-400">Consultando OSIPTEL...</p>\r
    <p class="text-xs text-gray-500 mt-1">Esto puede tomar unos segundos</p>\r
  </div>\r
\r
  <!-- Error State -->\r
  <div *ngIf="error && !isLoading" class="bg-red-900/30 rounded-lg p-4 border border-red-700 flex items-center gap-3">\r
    <lucide-angular name="alert-circle" [size]="24" class="text-red-400"></lucide-angular>\r
    <div>\r
      <p class="text-red-300 font-medium">Error en la consulta</p>\r
      <p class="text-red-400 text-sm">{{ error }}</p>\r
    </div>\r
  </div>\r
\r
  <!-- Results -->\r
  <div *ngIf="response && !isLoading" class="space-y-4">\r
    <!-- Summary Card -->\r
    <div class="bg-slate-800 rounded-lg p-4 border border-slate-700">\r
      <div class="flex flex-wrap items-center justify-between gap-4">\r
        <div class="flex items-center gap-4">\r
          <div class="w-12 h-12 bg-gradient-to-br from-cyan-600 to-blue-700 rounded-full flex items-center justify-center">\r
            <lucide-angular name="user" [size]="24" class="text-white"></lucide-angular>\r
          </div>\r
          <div>\r
            <p class="text-gray-400 text-sm">Documento</p>\r
            <p class="text-white text-lg font-bold">{{ response.documentNumber }}</p>\r
            <span class="text-xs px-2 py-0.5 rounded bg-slate-700 text-gray-300">{{ response.documentType }}</span>\r
          </div>\r
        </div>\r
\r
        <div class="flex items-center gap-6">\r
          <div class="text-center">\r
            <p class="text-3xl font-bold text-cyan-400">{{ response.totalLines }}</p>\r
            <p class="text-gray-400 text-sm">Lineas encontradas</p>\r
          </div>\r
        </div>\r
      </div>\r
    </div>\r
\r
    <!-- No results message -->\r
    <div *ngIf="response.phoneLines.length === 0" class="bg-slate-800 rounded-lg p-8 border border-slate-700 text-center">\r
      <lucide-angular name="phone-off" [size]="48" class="text-gray-500 mx-auto mb-4"></lucide-angular>\r
      <p class="text-gray-400">No se encontraron lineas telefonicas asociadas a este documento</p>\r
    </div>\r
\r
    <!-- Phone Lines Table -->\r
    <div *ngIf="response.phoneLines.length > 0" class="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">\r
      <table class="w-full">\r
        <thead class="bg-slate-900">\r
          <tr>\r
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">#</th>\r
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Telefono</th>\r
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Empresa</th>\r
          </tr>\r
        </thead>\r
        <tbody class="divide-y divide-slate-700">\r
          <tr *ngFor="let line of response.phoneLines; let i = index" class="hover:bg-slate-700/50 transition-colors">\r
            <td class="px-4 py-3 text-sm text-gray-400">{{ i + 1 }}</td>\r
            <td class="px-4 py-3">\r
              <div class="flex items-center gap-2">\r
                <lucide-angular name="phone" [size]="16" class="text-cyan-400"></lucide-angular>\r
                <span class="text-white font-medium">{{ line.phoneNumber }}</span>\r
              </div>\r
            </td>\r
            <td class="px-4 py-3">\r
              <span class="px-2 py-1 text-xs font-medium rounded-full border" [ngClass]="getCarrierColor(line.carrier)">\r
                {{ line.carrier }}\r
              </span>\r
            </td>\r
          </tr>\r
        </tbody>\r
      </table>\r
    </div>\r
\r
    <!-- Query Info -->\r
    <div class="text-center text-xs text-gray-500">\r
      Consulta realizada: {{ response.queryDate | date:'dd/MM/yyyy HH:mm:ss' }}\r
    </div>\r
  </div>\r
</div>\r
\r
<!-- WhatsApp Connection Modal -->\r
<div *ngIf="showWhatsAppModal" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50">\r
  <div class="bg-slate-800 rounded-lg p-6 max-w-md w-full mx-4 border border-slate-700">\r
    <div class="flex items-center justify-between mb-4">\r
      <h3 class="text-lg font-semibold text-white">Conectar WhatsApp</h3>\r
      <button (click)="closeWhatsAppModal()" class="text-gray-400 hover:text-white">\r
        <lucide-angular name="x" [size]="20"></lucide-angular>\r
      </button>\r
    </div>\r
\r
    <!-- Status -->\r
    <div class="flex items-center gap-2 mb-4">\r
      <div class="w-3 h-3 rounded-full" [class]="isWhatsAppConnected() ? 'bg-green-500' : 'bg-red-500'"></div>\r
      <span class="text-sm text-gray-300">\r
        {{ isWhatsAppConnected() ? 'Conectado' : 'Desconectado' }}\r
      </span>\r
    </div>\r
\r
    <!-- QR Code -->\r
    <div *ngIf="whatsAppQR && !isWhatsAppConnected()" class="flex flex-col items-center gap-4 p-4 bg-slate-900 rounded-lg mb-4">\r
      <p class="text-sm text-gray-400">Escanea el codigo QR con WhatsApp</p>\r
      <img [src]="whatsAppQR" alt="QR Code" class="w-48 h-48 bg-white p-2 rounded-lg" />\r
      <p class="text-xs text-gray-500">El codigo expira en 60 segundos</p>\r
    </div>\r
\r
    <!-- WhatsApp Connected Message -->\r
    <div *ngIf="isWhatsAppConnected()" class="flex flex-col items-center gap-4 p-4 bg-green-900/30 rounded-lg mb-4 border border-green-700">\r
      <lucide-angular name="check-circle" [size]="48" class="text-green-400"></lucide-angular>\r
      <p class="text-green-300 text-center">WhatsApp conectado correctamente</p>\r
    </div>\r
\r
    <!-- Error -->\r
    <div *ngIf="whatsAppError" class="bg-red-900/30 rounded-lg p-3 border border-red-700 mb-4">\r
      <p class="text-red-400 text-sm">{{ whatsAppError }}</p>\r
    </div>\r
\r
    <!-- Actions -->\r
    <div class="flex flex-col gap-3">\r
      <div class="flex gap-2">\r
        <button\r
          *ngIf="!isWhatsAppConnected()"\r
          type="button"\r
          class="flex-1 h-10 px-4 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"\r
          (click)="connectWhatsApp()"\r
          [disabled]="isConnectingWhatsApp">\r
          <lucide-angular name="qr-code" [size]="16"></lucide-angular>\r
          {{ isConnectingWhatsApp ? 'Conectando...' : 'Generar QR' }}\r
        </button>\r
\r
        <button\r
          *ngIf="isWhatsAppConnected()"\r
          type="button"\r
          class="flex-1 h-10 px-4 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"\r
          (click)="confirmStartBatch()">\r
          <lucide-angular name="play" [size]="16"></lucide-angular>\r
          Iniciar Consulta Masiva\r
        </button>\r
\r
        <button\r
          type="button"\r
          class="h-10 px-4 text-sm font-medium text-gray-300 bg-slate-700 hover:bg-slate-600 rounded-lg transition-all duration-200"\r
          (click)="closeWhatsAppModal()">\r
          Cancelar\r
        </button>\r
      </div>\r
\r
      <!-- Skip WhatsApp option -->\r
      <button\r
        *ngIf="!isWhatsAppConnected()"\r
        type="button"\r
        class="w-full h-9 text-sm font-medium text-gray-400 hover:text-white border border-slate-600 hover:border-slate-500 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"\r
        (click)="skipWhatsAppAndStartBatch()">\r
        <lucide-angular name="skip-forward" [size]="16"></lucide-angular>\r
        Saltar y continuar sin WhatsApp\r
      </button>\r
    </div>\r
  </div>\r
</div>\r
\r
<!-- Popup de confirmaci\xF3n de batch iniciado -->\r
<div *ngIf="showBatchStartedPopup" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50">\r
  <div class="bg-slate-800 rounded-lg p-6 max-w-sm w-full mx-4 border border-slate-700 text-center">\r
    <lucide-angular name="check-circle" [size]="48" class="text-green-400 mx-auto mb-4"></lucide-angular>\r
    <p class="text-white font-medium text-lg">Proceso iniciado</p>\r
    <p class="text-gray-400 text-sm mt-2">\r
      {{ batchSkippedWhatsApp ? 'El batch se est\xE1 ejecutando sin verificaci\xF3n de WhatsApp' : 'El batch se est\xE1 ejecutando' }}\r
    </p>\r
    <button\r
      (click)="closeBatchStartedPopup()"\r
      class="mt-4 w-full h-10 px-4 text-sm font-medium text-white bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-700 hover:to-blue-800 rounded-lg transition-all">\r
      Entendido\r
    </button>\r
  </div>\r
</div>\r
`, styles: ["/* src/app/features/phone-lines/pages/phone-lines-page/phone-lines-page.component.css */\n/*# sourceMappingURL=phone-lines-page.component.css.map */\n"] }]
  }], () => [{ type: PhoneLineService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PhoneLinesPageComponent, { className: "PhoneLinesPageComponent", filePath: "src/app/features/phone-lines/pages/phone-lines-page/phone-lines-page.component.ts", lineNumber: 16 });
})();
export {
  PhoneLinesPageComponent
};
//# sourceMappingURL=chunk-HTH4EF6E.js.map
