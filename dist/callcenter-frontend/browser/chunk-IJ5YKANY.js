import {
  CustomSelectComponent,
  ToastService
} from "./chunk-2BMIOZPH.js";
import {
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgModel
} from "./chunk-GRJ7XAPD.js";
import {
  Calendar,
  Download,
  FileSpreadsheet,
  LucideAngularComponent,
  LucideAngularModule,
  Search,
  Volume2,
  X
} from "./chunk-RFBUEVFE.js";
import {
  environment
} from "./chunk-QF774CZR.js";
import {
  CommonModule,
  Component,
  HttpClient,
  HttpHeaders,
  Injectable,
  NgForOf,
  NgIf,
  __spreadProps,
  __spreadValues,
  catchError,
  retry,
  setClassMetadata,
  throwError,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassProp,
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
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate3,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-CTRHJBBW.js";

// src/app/features/legacy/recordings/services/historical-recordings.service.ts
var _HistoricalRecordingsService = class _HistoricalRecordingsService {
  constructor(http) {
    this.http = http;
    this.baseUrl = environment.webServiceUrl + "/gestion/historica/audios";
    this.httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    };
  }
  handleError(error) {
    if (typeof ErrorEvent !== "undefined" && error.error instanceof ErrorEvent) {
      console.log(`An error occurred ${error.status}, body was: ${error.error.message}`);
    } else {
      console.log(`Backend returned code ${error.status}, body was: ${error.error.message}`);
    }
    return throwError(() => ({ status: error.status, message: error.error.message }));
  }
  getGestionHistoricaAudiosByTramo(tractRequest) {
    return this.http.post(this.baseUrl + "/tramo", tractRequest, this.httpOptions).pipe(retry(2), catchError(this.handleError));
  }
  getGestionHistoricaAudiosByDateRange(dateRangeRequest) {
    return this.http.post(this.baseUrl + "/date/range", dateRangeRequest, this.httpOptions).pipe(retry(2), catchError(this.handleError));
  }
  getGestionHistoricaAudiosByDocumento(documentoRequest) {
    return this.http.post(this.baseUrl + "/documento", documentoRequest, this.httpOptions).pipe(retry(2), catchError(this.handleError));
  }
  getGestionHistoricaAudiosByTelefono(telefonoRequest) {
    return this.http.post(this.baseUrl + "/telefono", telefonoRequest, this.httpOptions).pipe(retry(2), catchError(this.handleError));
  }
};
_HistoricalRecordingsService.\u0275fac = function HistoricalRecordingsService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _HistoricalRecordingsService)(\u0275\u0275inject(HttpClient));
};
_HistoricalRecordingsService.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _HistoricalRecordingsService, factory: _HistoricalRecordingsService.\u0275fac, providedIn: "root" });
var HistoricalRecordingsService = _HistoricalRecordingsService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(HistoricalRecordingsService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{ type: HttpClient }], null);
})();

// src/app/features/legacy/recordings/services/recording-download.service.ts
var _RecordingDownloadService = class _RecordingDownloadService {
  constructor(http) {
    this.http = http;
    this.baseUrl = environment.webServiceUrl + "/recording";
    this.fileHttpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      }),
      responseType: "blob"
    };
  }
  handleError(error) {
    if (typeof ErrorEvent !== "undefined" && error.error instanceof ErrorEvent) {
      console.log(`An error occurred ${error.status}, body was: ${error.error.message}`);
    } else {
      console.log(`Backend returned code ${error.status}, body was: ${error.error.message}`);
    }
    return throwError(() => ({ status: error.status, message: error.error.message }));
  }
  downloadGestionHistoricaAudioFileByName(downloadHistoricoAudioRequest) {
    console.log("Download Request:", downloadHistoricoAudioRequest);
    return this.http.post(this.baseUrl + "/download/historico/audio", downloadHistoricoAudioRequest, __spreadProps(__spreadValues({}, this.fileHttpOptions), { responseType: "blob" })).pipe(retry(2), catchError(this.handleError));
  }
  downloadGestionHistoricaAudioFiles(downloadHistoricoAudioRequest) {
    return this.http.post(this.baseUrl + "/download/historico/audio/zip", downloadHistoricoAudioRequest, __spreadProps(__spreadValues({}, this.fileHttpOptions), { responseType: "blob" })).pipe(retry(2), catchError(this.handleError));
  }
};
_RecordingDownloadService.\u0275fac = function RecordingDownloadService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _RecordingDownloadService)(\u0275\u0275inject(HttpClient));
};
_RecordingDownloadService.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _RecordingDownloadService, factory: _RecordingDownloadService.\u0275fac, providedIn: "root" });
var RecordingDownloadService = _RecordingDownloadService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RecordingDownloadService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{ type: HttpClient }], null);
})();

// src/app/features/legacy/recordings/services/recording-evaluation-report.service.ts
var _RecordingEvaluationReportService = class _RecordingEvaluationReportService {
  constructor(http) {
    this.http = http;
    this.baseUrl = environment.webServiceUrl + "/audio/evaluation";
    this.fileHttpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      }),
      responseType: "blob"
    };
  }
  handleError(error) {
    if (typeof ErrorEvent !== "undefined" && error.error instanceof ErrorEvent) {
      console.log(`An error occurred ${error.status}, body was: ${error.error.message}`);
    } else {
      console.log(`Backend returned code ${error.status}, body was: ${error.error.message}`);
    }
    return throwError(() => ({ status: error.status, message: error.error.message }));
  }
  downloadGestionHistoricaReporteFile(createAudioEvaluacionFileRequest) {
    return this.http.post(this.baseUrl + "/create", createAudioEvaluacionFileRequest, __spreadProps(__spreadValues({}, this.fileHttpOptions), { responseType: "blob" })).pipe(retry(2), catchError(this.handleError));
  }
  downloadGestionHistoricaReporteFiles(createAudioEvaluacionFileRequest) {
    return this.http.post(this.baseUrl + "/create/zip", createAudioEvaluacionFileRequest, __spreadProps(__spreadValues({}, this.fileHttpOptions), { responseType: "blob" })).pipe(retry(2), catchError(this.handleError));
  }
};
_RecordingEvaluationReportService.\u0275fac = function RecordingEvaluationReportService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _RecordingEvaluationReportService)(\u0275\u0275inject(HttpClient));
};
_RecordingEvaluationReportService.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _RecordingEvaluationReportService, factory: _RecordingEvaluationReportService.\u0275fac, providedIn: "root" });
var RecordingEvaluationReportService = _RecordingEvaluationReportService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RecordingEvaluationReportService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{ type: HttpClient }], null);
})();

// src/app/features/legacy/recordings/components/recordings-tracker/recordings-tracker.component.ts
function RecordingsTrackerComponent_div_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 18);
    \u0275\u0275element(1, "div", 19);
    \u0275\u0275elementEnd();
  }
}
function RecordingsTrackerComponent_div_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 10)(1, "div", 20)(2, "label", 4);
    \u0275\u0275text(3, "Fecha Inicio");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 21)(5, "input", 22);
    \u0275\u0275twoWayListener("ngModelChange", function RecordingsTrackerComponent_div_12_Template_input_ngModelChange_5_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.startDate, $event) || (ctx_r1.startDate = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("change", function RecordingsTrackerComponent_div_12_Template_input_change_5_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.validateDates());
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(6, "div", 20)(7, "label", 4);
    \u0275\u0275text(8, "Fecha Fin");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "div", 21)(10, "input", 22);
    \u0275\u0275twoWayListener("ngModelChange", function RecordingsTrackerComponent_div_12_Template_input_ngModelChange_10_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.endDate, $event) || (ctx_r1.endDate = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("change", function RecordingsTrackerComponent_div_12_Template_input_change_10_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.validateDates());
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(11, "button", 23);
    \u0275\u0275listener("click", function RecordingsTrackerComponent_div_12_Template_button_click_11_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.searchByDates());
    });
    \u0275\u0275element(12, "lucide-angular", 13);
    \u0275\u0275text(13, " Buscar ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.startDate);
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.endDate);
    \u0275\u0275advance(2);
    \u0275\u0275property("img", ctx_r1.Search)("size", 16);
  }
}
function RecordingsTrackerComponent_div_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 10)(1, "div", 24)(2, "label", 4);
    \u0275\u0275text(3, "Documento");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "input", 25);
    \u0275\u0275twoWayListener("ngModelChange", function RecordingsTrackerComponent_div_13_Template_input_ngModelChange_4_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.documento, $event) || (ctx_r1.documento = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "button", 23);
    \u0275\u0275listener("click", function RecordingsTrackerComponent_div_13_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.searchByDocumento());
    });
    \u0275\u0275element(6, "lucide-angular", 13);
    \u0275\u0275text(7, " Buscar ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.documento);
    \u0275\u0275advance(2);
    \u0275\u0275property("img", ctx_r1.Search)("size", 16);
  }
}
function RecordingsTrackerComponent_div_14_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 10)(1, "div", 24)(2, "label", 4);
    \u0275\u0275text(3, "Tel\xE9fono");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "input", 26);
    \u0275\u0275twoWayListener("ngModelChange", function RecordingsTrackerComponent_div_14_Template_input_ngModelChange_4_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.telefono, $event) || (ctx_r1.telefono = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "button", 23);
    \u0275\u0275listener("click", function RecordingsTrackerComponent_div_14_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.searchByTelefono());
    });
    \u0275\u0275element(6, "lucide-angular", 13);
    \u0275\u0275text(7, " Buscar ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.telefono);
    \u0275\u0275advance(2);
    \u0275\u0275property("img", ctx_r1.Search)("size", 16);
  }
}
function RecordingsTrackerComponent_div_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 27);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.errorMessage, " ");
  }
}
function RecordingsTrackerComponent_div_28_span_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 54);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.sortOrder === 1 ? "\u25B2" : "\u25BC", " ");
  }
}
function RecordingsTrackerComponent_div_28_span_30_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 54);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.sortOrder === 1 ? "\u25B2" : "\u25BC", " ");
  }
}
function RecordingsTrackerComponent_div_28_span_33_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 54);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.sortOrder === 1 ? "\u25B2" : "\u25BC", " ");
  }
}
function RecordingsTrackerComponent_div_28_span_36_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 54);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.sortOrder === 1 ? "\u25B2" : "\u25BC", " ");
  }
}
function RecordingsTrackerComponent_div_28_span_39_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 54);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.sortOrder === 1 ? "\u25B2" : "\u25BC", " ");
  }
}
function RecordingsTrackerComponent_div_28_span_42_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 54);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.sortOrder === 1 ? "\u25B2" : "\u25BC", " ");
  }
}
function RecordingsTrackerComponent_div_28_tr_50_button_20_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 62);
    \u0275\u0275listener("click", function RecordingsTrackerComponent_div_28_tr_50_button_20_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r8);
      const gestion_r7 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.downloadReport(gestion_r7));
    });
    \u0275\u0275element(1, "lucide-angular", 13);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275property("img", ctx_r1.FileSpreadsheet)("size", 14);
  }
}
function RecordingsTrackerComponent_div_28_tr_50_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr", 55)(1, "td", 56);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td", 56);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td", 56);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "td", 56);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "td", 56);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "td", 57)(12, "span", 58);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "td", 56);
    \u0275\u0275text(15);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "td", 59)(17, "button", 60);
    \u0275\u0275listener("click", function RecordingsTrackerComponent_div_28_tr_50_Template_button_click_17_listener() {
      const gestion_r7 = \u0275\u0275restoreView(_r6).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.downloadAudio(gestion_r7));
    });
    \u0275\u0275element(18, "lucide-angular", 13);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(19, "td", 59);
    \u0275\u0275template(20, RecordingsTrackerComponent_div_28_tr_50_button_20_Template, 2, 2, "button", 61);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const gestion_r7 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(gestion_r7.documento);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(gestion_r7.cartera);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(gestion_r7.telefono);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(gestion_r7.fechagestion);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(gestion_r7.horagestion);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", gestion_r7.resultado, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(gestion_r7.solucion);
    \u0275\u0275advance(3);
    \u0275\u0275property("img", ctx_r1.Volume2)("size", 14);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", ctx_r1.canDownloadReport(gestion_r7.resultado));
  }
}
function RecordingsTrackerComponent_div_28_button_59_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 63);
    \u0275\u0275listener("click", function RecordingsTrackerComponent_div_28_button_59_Template_button_click_0_listener() {
      const page_r10 = \u0275\u0275restoreView(_r9).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.goToPage(page_r10));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const page_r10 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("bg-blue-600", page_r10 === ctx_r1.currentPage)("border-blue-600", page_r10 === ctx_r1.currentPage)("bg-slate-700", page_r10 !== ctx_r1.currentPage)("border-slate-600", page_r10 !== ctx_r1.currentPage)("hover:bg-slate-600", page_r10 !== ctx_r1.currentPage);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", page_r10, " ");
  }
}
function RecordingsTrackerComponent_div_28_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 28)(1, "div", 29)(2, "table", 30)(3, "thead", 31)(4, "tr", 32)(5, "th", 33)(6, "div", 21);
    \u0275\u0275element(7, "lucide-angular", 34);
    \u0275\u0275elementStart(8, "input", 35);
    \u0275\u0275twoWayListener("ngModelChange", function RecordingsTrackerComponent_div_28_Template_input_ngModelChange_8_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.filterDocumento, $event) || (ctx_r1.filterDocumento = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("input", function RecordingsTrackerComponent_div_28_Template_input_input_8_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.applyFilters());
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(9, "th", 33)(10, "app-custom-select", 36);
    \u0275\u0275twoWayListener("ngModelChange", function RecordingsTrackerComponent_div_28_Template_app_custom_select_ngModelChange_10_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.filterCartera, $event) || (ctx_r1.filterCartera = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("selectionChange", function RecordingsTrackerComponent_div_28_Template_app_custom_select_selectionChange_10_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.applyFilters());
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "th", 33)(12, "div", 21);
    \u0275\u0275element(13, "lucide-angular", 34);
    \u0275\u0275elementStart(14, "input", 37);
    \u0275\u0275twoWayListener("ngModelChange", function RecordingsTrackerComponent_div_28_Template_input_ngModelChange_14_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.filterTelefono, $event) || (ctx_r1.filterTelefono = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("input", function RecordingsTrackerComponent_div_28_Template_input_input_14_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.applyFilters());
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275element(15, "th", 33)(16, "th", 33);
    \u0275\u0275elementStart(17, "th", 33)(18, "app-custom-select", 36);
    \u0275\u0275twoWayListener("ngModelChange", function RecordingsTrackerComponent_div_28_Template_app_custom_select_ngModelChange_18_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.filterResultado, $event) || (ctx_r1.filterResultado = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("selectionChange", function RecordingsTrackerComponent_div_28_Template_app_custom_select_selectionChange_18_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.applyFilters());
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275element(19, "th", 33);
    \u0275\u0275elementStart(20, "th", 38)(21, "button", 39);
    \u0275\u0275listener("click", function RecordingsTrackerComponent_div_28_Template_button_click_21_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.clearFilters());
    });
    \u0275\u0275element(22, "lucide-angular", 13);
    \u0275\u0275elementEnd()();
    \u0275\u0275element(23, "th", 33);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "tr")(25, "th", 40);
    \u0275\u0275listener("click", function RecordingsTrackerComponent_div_28_Template_th_click_25_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.sort("documento"));
    });
    \u0275\u0275text(26, " DNI ");
    \u0275\u0275template(27, RecordingsTrackerComponent_div_28_span_27_Template, 2, 1, "span", 41);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "th", 40);
    \u0275\u0275listener("click", function RecordingsTrackerComponent_div_28_Template_th_click_28_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.sort("cartera"));
    });
    \u0275\u0275text(29, " Tramo ");
    \u0275\u0275template(30, RecordingsTrackerComponent_div_28_span_30_Template, 2, 1, "span", 41);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "th", 40);
    \u0275\u0275listener("click", function RecordingsTrackerComponent_div_28_Template_th_click_31_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.sort("telefono"));
    });
    \u0275\u0275text(32, " Tel\xE9fono ");
    \u0275\u0275template(33, RecordingsTrackerComponent_div_28_span_33_Template, 2, 1, "span", 41);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(34, "th", 40);
    \u0275\u0275listener("click", function RecordingsTrackerComponent_div_28_Template_th_click_34_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.sort("fechagestion"));
    });
    \u0275\u0275text(35, " Fecha ");
    \u0275\u0275template(36, RecordingsTrackerComponent_div_28_span_36_Template, 2, 1, "span", 41);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(37, "th", 40);
    \u0275\u0275listener("click", function RecordingsTrackerComponent_div_28_Template_th_click_37_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.sort("horagestion"));
    });
    \u0275\u0275text(38, " Hora ");
    \u0275\u0275template(39, RecordingsTrackerComponent_div_28_span_39_Template, 2, 1, "span", 41);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(40, "th", 40);
    \u0275\u0275listener("click", function RecordingsTrackerComponent_div_28_Template_th_click_40_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.sort("resultado"));
    });
    \u0275\u0275text(41, " Resultado ");
    \u0275\u0275template(42, RecordingsTrackerComponent_div_28_span_42_Template, 2, 1, "span", 41);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(43, "th", 42);
    \u0275\u0275text(44, "Soluci\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(45, "th", 43);
    \u0275\u0275text(46, "Audio");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(47, "th", 43);
    \u0275\u0275text(48, "Reporte");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(49, "tbody");
    \u0275\u0275template(50, RecordingsTrackerComponent_div_28_tr_50_Template, 21, 10, "tr", 44);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(51, "div", 45)(52, "div", 46);
    \u0275\u0275text(53);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(54, "div", 47)(55, "button", 48);
    \u0275\u0275listener("click", function RecordingsTrackerComponent_div_28_Template_button_click_55_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.goToPage(1));
    });
    \u0275\u0275text(56, " \xAB ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(57, "button", 48);
    \u0275\u0275listener("click", function RecordingsTrackerComponent_div_28_Template_button_click_57_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.goToPage(ctx_r1.currentPage - 1));
    });
    \u0275\u0275text(58, " \u2039 ");
    \u0275\u0275elementEnd();
    \u0275\u0275template(59, RecordingsTrackerComponent_div_28_button_59_Template, 2, 11, "button", 49);
    \u0275\u0275elementStart(60, "button", 48);
    \u0275\u0275listener("click", function RecordingsTrackerComponent_div_28_Template_button_click_60_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.goToPage(ctx_r1.currentPage + 1));
    });
    \u0275\u0275text(61, " \u203A ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(62, "button", 48);
    \u0275\u0275listener("click", function RecordingsTrackerComponent_div_28_Template_button_click_62_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.goToPage(ctx_r1.totalPages));
    });
    \u0275\u0275text(63, " \xBB ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(64, "div", 50)(65, "label", 51);
    \u0275\u0275text(66, "Filas por p\xE1gina:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(67, "div", 52)(68, "app-custom-select", 53);
    \u0275\u0275twoWayListener("ngModelChange", function RecordingsTrackerComponent_div_28_Template_app_custom_select_ngModelChange_68_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.pageSize, $event) || (ctx_r1.pageSize = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("selectionChange", function RecordingsTrackerComponent_div_28_Template_app_custom_select_selectionChange_68_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onPageSizeChange($event));
    });
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(7);
    \u0275\u0275property("img", ctx_r1.Search)("size", 14);
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.filterDocumento);
    \u0275\u0275advance(2);
    \u0275\u0275property("options", ctx_r1.tramos);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.filterCartera);
    \u0275\u0275property("compact", true);
    \u0275\u0275advance(3);
    \u0275\u0275property("img", ctx_r1.Search)("size", 14);
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.filterTelefono);
    \u0275\u0275advance(4);
    \u0275\u0275property("options", ctx_r1.resultados);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.filterResultado);
    \u0275\u0275property("compact", true);
    \u0275\u0275advance(4);
    \u0275\u0275property("img", ctx_r1.X)("size", 14);
    \u0275\u0275advance(5);
    \u0275\u0275property("ngIf", ctx_r1.sortField === "documento");
    \u0275\u0275advance(3);
    \u0275\u0275property("ngIf", ctx_r1.sortField === "cartera");
    \u0275\u0275advance(3);
    \u0275\u0275property("ngIf", ctx_r1.sortField === "telefono");
    \u0275\u0275advance(3);
    \u0275\u0275property("ngIf", ctx_r1.sortField === "fechagestion");
    \u0275\u0275advance(3);
    \u0275\u0275property("ngIf", ctx_r1.sortField === "horagestion");
    \u0275\u0275advance(3);
    \u0275\u0275property("ngIf", ctx_r1.sortField === "resultado");
    \u0275\u0275advance(8);
    \u0275\u0275property("ngForOf", ctx_r1.paginatedGestiones);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate3(" Mostrando ", (ctx_r1.currentPage - 1) * ctx_r1.pageSize + 1, " a ", ctx_r1.Math.min(ctx_r1.currentPage * ctx_r1.pageSize, ctx_r1.filteredGestiones.length), " de ", ctx_r1.filteredGestiones.length, " registros ");
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r1.currentPage === 1);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r1.currentPage === 1);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngForOf", ctx_r1.getPageNumbers());
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r1.currentPage === ctx_r1.totalPages);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r1.currentPage === ctx_r1.totalPages);
    \u0275\u0275advance(6);
    \u0275\u0275property("options", ctx_r1.pageSizeOptions);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.pageSize);
  }
}
function RecordingsTrackerComponent_div_29_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 64)(1, "p", 65);
    \u0275\u0275text(2, "No hay grabaciones para mostrar. Realiza una b\xFAsqueda para ver resultados.");
    \u0275\u0275elementEnd()();
  }
}
var _RecordingsTrackerComponent = class _RecordingsTrackerComponent {
  constructor(gestionHistoricaAudiosService, ftpService, audioEvaluacionService, toastService) {
    this.gestionHistoricaAudiosService = gestionHistoricaAudiosService;
    this.ftpService = ftpService;
    this.audioEvaluacionService = audioEvaluacionService;
    this.toastService = toastService;
    this.Volume2 = Volume2;
    this.FileSpreadsheet = FileSpreadsheet;
    this.Download = Download;
    this.Search = Search;
    this.Calendar = Calendar;
    this.X = X;
    this.Math = Math;
    this.gestiones = [];
    this.filteredGestiones = [];
    this.paginatedGestiones = [];
    this.initialValue = [];
    this.currentPage = 1;
    this.pageSize = 5;
    this.totalPages = 1;
    this.pageSizeOptions = [
      { label: "5", value: 5 },
      { label: "10", value: 10 },
      { label: "20", value: 20 }
    ];
    this.startDate = "";
    this.endDate = "";
    this.documento = "";
    this.telefono = "";
    this.errorMessage = "";
    this.filterDocumento = "";
    this.filterTelefono = "";
    this.filterCartera = "";
    this.filterResultado = "";
    this.resultados = [];
    this.tramos = [];
    this.tipoBusqueda = [
      { label: "Fechas", value: "fechas" },
      { label: "Documento", value: "documento" },
      { label: "Telefono", value: "telefono" }
    ];
    this.selectedTipoBusqueda = "fechas";
    this.selectedTramo = "todos";
    this.sortField = "";
    this.sortOrder = 0;
    this.isLoading = false;
    this.isDownloadingMassive = false;
  }
  ngOnInit() {
    this.tramos = [
      { label: "Todos", value: "todos" },
      { label: "Tramo 3", value: "FO_TRAMO 3" },
      { label: "Tramo 5", value: "FO_TRAMO 5" },
      { label: "Cartera Propia", value: "TRAMO" }
    ];
    this.resultados = [
      { label: "Todos", value: "" },
      { label: "FUERA DE SERVICIO - NO EXISTE", value: "FUERA DE SERVICIO - NO EXISTE" },
      { label: "APAGADO", value: "APAGADO" },
      { label: "NO CONTESTA", value: "NO CONTESTA" },
      { label: "MSJ VOZ - SMS - WSP - BAJO PUERTA", value: "MSJ VOZ - SMS - WSP - BAJO PUERTA" },
      { label: "EQUIVOCADO", value: "EQUIVOCADO" },
      { label: "CONTACTO CON TERCEROS", value: "CONTACTO CON TERCEROS" },
      { label: "CONTACTO CON TITULAR O ENCARGADO", value: "CONTACTO CON TITULAR O ENCARGADO" },
      { label: "OPORTUNIDAD DE PAGO", value: "OPORTUNIDAD DE PAGO" },
      { label: "FRACCIONADO O ARMADAS", value: "FRACCIONADO O ARMADAS" },
      { label: "PROMESA DE PAGO", value: "PROMESA DE PAGO" },
      { label: "RECORDATORIO DE PAGO", value: "RECORDATORIO DE PAGO" },
      { label: "CONFIRMACION DE ABONO", value: "CONFIRMACION DE ABONO" },
      { label: "CANCELACION PARCIAL", value: "CANCELACION PARCIAL" },
      { label: "CANCELACION TOTAL", value: "CANCELACION TOTAL" },
      { label: "CANCELACION NO REPORTADAS O APLICADAS", value: "CANCELACION NO REPORTADAS O APLICADAS" },
      { label: "FALLECIDO", value: "FALLECIDO" }
    ];
  }
  changeTypeSearch() {
    this.startDate = "";
    this.endDate = "";
    this.documento = "";
    this.telefono = "";
    this.errorMessage = "";
  }
  validateDates() {
    this.errorMessage = "";
    if (this.startDate && this.endDate) {
      const start = new Date(this.startDate);
      const end = new Date(this.endDate);
      if (start > end) {
        this.errorMessage = "La fecha de inicio debe ser anterior a la fecha de fin.";
        return;
      }
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1e3 * 60 * 60 * 24));
      if (diffDays > 2) {
        this.errorMessage = "La diferencia entre las fechas no puede ser mayor a 2 d\xEDas.";
      }
    } else {
      this.errorMessage = "Por favor, selecciona ambas fechas.";
    }
  }
  searchByDates() {
    if (!this.startDate || !this.endDate) {
      this.toastService.error("Por favor, selecciona ambas fechas.");
      return;
    }
    if (this.errorMessage) {
      this.toastService.error("Verificar la validaci\xF3n de las fechas.");
      return;
    }
    this.isLoading = true;
    const dateRangeRequest = {
      tramo: this.selectedTramo,
      startDate: this.startDate,
      endDate: this.endDate
    };
    this.gestionHistoricaAudiosService.getGestionHistoricaAudiosByDateRange(dateRangeRequest).subscribe({
      next: (data) => {
        this.gestiones = data;
        this.initialValue = [...data];
        this.applyFilters();
        this.isLoading = false;
        this.toastService.success(`Se encontraron ${data.length} grabaciones.`);
      },
      error: (error) => {
        console.log(error);
        this.toastService.error("No se pudo cargar los datos.");
        this.isLoading = false;
      }
    });
  }
  searchByDocumento() {
    if (!this.documento) {
      this.toastService.error("Por favor, ingresa un documento.");
      return;
    }
    this.isLoading = true;
    const documentoRequest = {
      tramo: this.selectedTramo,
      documento: this.documento
    };
    this.gestionHistoricaAudiosService.getGestionHistoricaAudiosByDocumento(documentoRequest).subscribe({
      next: (data) => {
        this.gestiones = data;
        this.initialValue = [...data];
        this.applyFilters();
        this.isLoading = false;
        this.toastService.success(`Se encontraron ${data.length} grabaciones.`);
      },
      error: (error) => {
        console.log(error);
        this.toastService.error("No se pudo cargar los datos.");
        this.isLoading = false;
      }
    });
  }
  searchByTelefono() {
    if (!this.telefono) {
      this.toastService.error("Por favor, ingresa un tel\xE9fono.");
      return;
    }
    this.isLoading = true;
    const telefonoRequest = {
      tramo: this.selectedTramo,
      telefono: this.telefono
    };
    this.gestionHistoricaAudiosService.getGestionHistoricaAudiosByTelefono(telefonoRequest).subscribe({
      next: (data) => {
        this.gestiones = data;
        this.initialValue = [...data];
        this.applyFilters();
        this.isLoading = false;
        this.toastService.success(`Se encontraron ${data.length} grabaciones.`);
      },
      error: (error) => {
        console.log(error);
        this.toastService.error("No se pudo cargar los datos.");
        this.isLoading = false;
      }
    });
  }
  applyFilters() {
    let filtered = [...this.gestiones];
    if (this.filterDocumento) {
      filtered = filtered.filter((g) => g.documento.toLowerCase().includes(this.filterDocumento.toLowerCase()));
    }
    if (this.filterTelefono) {
      filtered = filtered.filter((g) => g.telefono.toLowerCase().includes(this.filterTelefono.toLowerCase()));
    }
    if (this.filterCartera) {
      filtered = filtered.filter((g) => g.cartera === this.filterCartera);
    }
    if (this.filterResultado) {
      filtered = filtered.filter((g) => g.resultado === this.filterResultado);
    }
    this.filteredGestiones = filtered;
    this.currentPage = 1;
    this.updatePagination();
  }
  clearFilters() {
    this.filterDocumento = "";
    this.filterTelefono = "";
    this.filterCartera = "";
    this.filterResultado = "";
    this.applyFilters();
  }
  sort(field) {
    if (this.sortField === field) {
      if (this.sortOrder === 1) {
        this.sortOrder = -1;
      } else if (this.sortOrder === -1) {
        this.sortOrder = 0;
        this.sortField = "";
        this.filteredGestiones = [...this.gestiones];
        this.applyFilters();
        return;
      }
    } else {
      this.sortField = field;
      this.sortOrder = 1;
    }
    this.filteredGestiones.sort((a, b) => {
      const value1 = a[field];
      const value2 = b[field];
      let result = 0;
      if (value1 == null && value2 != null)
        result = -1;
      else if (value1 != null && value2 == null)
        result = 1;
      else if (value1 == null && value2 == null)
        result = 0;
      else if (typeof value1 === "string" && typeof value2 === "string") {
        result = value1.localeCompare(value2);
      } else {
        result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;
      }
      return this.sortOrder * result;
    });
    this.updatePagination();
  }
  updatePagination() {
    this.totalPages = Math.ceil(this.filteredGestiones.length / this.pageSize);
    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedGestiones = this.filteredGestiones.slice(startIndex, endIndex);
  }
  onPageSizeChange(newSize) {
    this.pageSize = newSize;
    this.currentPage = 1;
    this.updatePagination();
  }
  goToPage(page) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }
  getPageNumbers() {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible - 1);
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }
  downloadAudio(gestion) {
    const anio_chain = typeof gestion.anio === "string" ? gestion.anio.split(",") : [gestion.anio];
    const mes_chain = typeof gestion.mes === "string" ? gestion.mes.split(",") : [gestion.mes];
    const dia_chain = typeof gestion.dia === "string" ? gestion.dia.split(",") : [gestion.dia];
    const nombre_chain = typeof gestion.nombre === "string" ? gestion.nombre.split(",") : [gestion.nombre];
    for (let i = 0; i < anio_chain.length; i++) {
      const newFechaGestion = gestion.fechagestion.replace(/-/g, "");
      const downloadHistoricoAudioRequest = {
        anio: anio_chain[i],
        mes: mes_chain[i],
        dia: dia_chain[i],
        nombre: nombre_chain[i],
        fecha: newFechaGestion,
        resultado: gestion.resultado,
        telefono: gestion.telefono,
        documento: gestion.documento,
        cliente: gestion.cliente,
        asesor: gestion.usuarioregistra
      };
      this.ftpService.downloadGestionHistoricaAudioFileByName(downloadHistoricoAudioRequest).subscribe({
        next: (data) => {
          const url = window.URL.createObjectURL(data);
          const a = document.createElement("a");
          a.href = url;
          if (i > 0) {
            a.download = `audio-${newFechaGestion}-${gestion.resultado}-${gestion.telefono}-${gestion.documento}-${gestion.cliente}-${gestion.usuarioregistra}(${i}).WAV`;
          } else {
            a.download = `audio-${newFechaGestion}-${gestion.resultado}-${gestion.telefono}-${gestion.documento}-${gestion.cliente}-${gestion.usuarioregistra}.WAV`;
          }
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
          this.toastService.success("Audio descargado correctamente.");
        },
        error: (error) => {
          this.toastService.error("No se encontr\xF3 el audio.");
          console.log(error);
        }
      });
    }
  }
  downloadReport(gestion) {
    const createAudioEvaluacionFileRequest = {
      dni: gestion.documento,
      cliente: gestion.cliente,
      telefono: gestion.telefono,
      fecha: gestion.fechagestion,
      asesor: gestion.usuarioregistra,
      resultado: gestion.resultado,
      gestionHistoricaAudioIdx: gestion.idx
    };
    const newFechaGestion = gestion.fechagestion.replace(/-/g, "");
    this.audioEvaluacionService.downloadGestionHistoricaReporteFile(createAudioEvaluacionFileRequest).subscribe({
      next: (data) => {
        const url = window.URL.createObjectURL(data);
        const a = document.createElement("a");
        a.href = url;
        a.download = `reporte-${newFechaGestion}-${gestion.resultado}-${gestion.telefono}-${gestion.documento}-${gestion.cliente}-${gestion.usuarioregistra}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        this.toastService.success("Reporte descargado correctamente.");
      },
      error: (error) => {
        this.toastService.error("No se encontr\xF3 el reporte en la base de datos.");
        console.log(error);
      }
    });
  }
  massiveDownloadAudios() {
    const audiosToDownload = this.filteredGestiones.length > 0 ? this.filteredGestiones : this.gestiones;
    if (audiosToDownload.length === 0) {
      this.toastService.error("No hay datos para descargar.");
      return;
    }
    this.isDownloadingMassive = true;
    this.toastService.info("Procesando descarga masiva de audios...");
    const downloadHistoricoAudioRequests = [];
    audiosToDownload.forEach((gestion) => {
      const anio_chain = typeof gestion.anio === "string" ? gestion.anio.split(",") : [gestion.anio];
      const mes_chain = typeof gestion.mes === "string" ? gestion.mes.split(",") : [gestion.mes];
      const dia_chain = typeof gestion.dia === "string" ? gestion.dia.split(",") : [gestion.dia];
      const nombre_chain = typeof gestion.nombre === "string" ? gestion.nombre.split(",") : [gestion.nombre];
      for (let i = 0; i < anio_chain.length; i++) {
        const newFechaGestion = gestion.fechagestion.replace(/-/g, "");
        const downloadHistoricoAudioRequest = {
          anio: anio_chain[i],
          mes: mes_chain[i],
          dia: dia_chain[i],
          nombre: nombre_chain[i],
          fecha: newFechaGestion,
          resultado: gestion.resultado,
          telefono: gestion.telefono,
          documento: gestion.documento,
          cliente: gestion.cliente,
          asesor: gestion.usuarioregistra
        };
        downloadHistoricoAudioRequests.push(downloadHistoricoAudioRequest);
      }
    });
    this.ftpService.downloadGestionHistoricaAudioFiles(downloadHistoricoAudioRequests).subscribe({
      next: (data) => {
        const url = window.URL.createObjectURL(data);
        const a = document.createElement("a");
        a.href = url;
        a.download = "audios.zip";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        this.isDownloadingMassive = false;
        this.toastService.success("Los audios fueron descargados correctamente.");
      },
      error: (error) => {
        console.log(error);
        this.isDownloadingMassive = false;
        this.toastService.error("Un error ha ocurrido al realizar la descarga.");
      }
    });
  }
  massiveDownloadReports() {
    const reportsToDownload = this.filteredGestiones.length > 0 ? this.filteredGestiones : this.gestiones;
    if (reportsToDownload.length === 0) {
      this.toastService.error("No hay datos para descargar.");
      return;
    }
    this.isDownloadingMassive = true;
    this.toastService.info("Procesando descarga masiva de reportes...");
    const createAudioEvaluacionFileRequests = [];
    reportsToDownload.forEach((gestion) => {
      const createAudioEvaluacionFileRequest = {
        dni: gestion.documento,
        cliente: gestion.cliente,
        telefono: gestion.telefono,
        fecha: gestion.fechagestion,
        asesor: gestion.usuarioregistra,
        resultado: gestion.resultado,
        gestionHistoricaAudioIdx: gestion.idx
      };
      createAudioEvaluacionFileRequests.push(createAudioEvaluacionFileRequest);
    });
    this.audioEvaluacionService.downloadGestionHistoricaReporteFiles(createAudioEvaluacionFileRequests).subscribe({
      next: (data) => {
        const url = window.URL.createObjectURL(data);
        const a = document.createElement("a");
        a.href = url;
        a.download = "reportes.zip";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        this.isDownloadingMassive = false;
        this.toastService.success("Los reportes fueron descargados correctamente.");
      },
      error: (error) => {
        console.log(error);
        this.isDownloadingMassive = false;
        this.toastService.error("Un error ha ocurrido al realizar la descarga.");
      }
    });
  }
  canDownloadReport(resultado) {
    return resultado === "PROMESA DE PAGO" || resultado === "CONTACTO CON TITULAR O ENCARGADO";
  }
};
_RecordingsTrackerComponent.\u0275fac = function RecordingsTrackerComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _RecordingsTrackerComponent)(\u0275\u0275directiveInject(HistoricalRecordingsService), \u0275\u0275directiveInject(RecordingDownloadService), \u0275\u0275directiveInject(RecordingEvaluationReportService), \u0275\u0275directiveInject(ToastService));
};
_RecordingsTrackerComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _RecordingsTrackerComponent, selectors: [["app-recordings-tracker"]], decls: 30, vars: 17, consts: [["class", "fixed inset-0 bg-black/50 flex items-center justify-center z-50", 4, "ngIf"], [1, "bg-slate-800", "p-3", "rounded-lg", "mb-3"], [1, "flex", "gap-2", "overflow-x-auto"], [1, "flex", "flex-col", "gap-1", "w-[140px]", "flex-shrink-0"], [1, "text-slate-400", "text-xs", "font-medium"], ["placeholder", "Seleccionar tramo", 3, "ngModelChange", "options", "ngModel"], [1, "flex", "flex-col", "gap-1", "w-[160px]", "flex-shrink-0"], ["placeholder", "Tipo de b\xFAsqueda", 3, "ngModelChange", "selectionChange", "options", "ngModel"], ["class", "flex gap-2 items-end flex-shrink-0", 4, "ngIf"], [1, "w-px", "bg-slate-700", "self-stretch", "flex-shrink-0"], [1, "flex", "gap-2", "items-end", "flex-shrink-0"], [1, "flex", "flex-col", "gap-1"], [1, "h-10", "inline-flex", "items-center", "gap-1.5", "px-3", "bg-gradient-to-r", "from-indigo-600", "to-indigo-700", "hover:from-indigo-700", "hover:to-indigo-800", "text-white", "text-sm", "font-medium", "rounded", "transition-all", "hover:-translate-y-0.5", "hover:shadow-lg", "hover:shadow-indigo-500/40", "disabled:opacity-50", "disabled:cursor-not-allowed", "disabled:hover:translate-y-0", "whitespace-nowrap", "cursor-pointer", 3, "click", "disabled"], [3, "img", "size"], [1, "h-10", "inline-flex", "items-center", "gap-1.5", "px-3", "bg-gradient-to-r", "from-emerald-600", "to-emerald-700", "hover:from-emerald-700", "hover:to-emerald-800", "text-white", "text-sm", "font-medium", "rounded", "transition-all", "hover:-translate-y-0.5", "hover:shadow-lg", "hover:shadow-emerald-500/40", "disabled:opacity-50", "disabled:cursor-not-allowed", "disabled:hover:translate-y-0", "whitespace-nowrap", "cursor-pointer", 3, "click", "disabled"], ["class", "mt-2 p-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded text-xs", 4, "ngIf"], ["class", "bg-slate-800 p-3 rounded-lg", 4, "ngIf"], ["class", "bg-slate-800 p-8 rounded-lg text-center", 4, "ngIf"], [1, "fixed", "inset-0", "bg-black/50", "flex", "items-center", "justify-center", "z-50"], [1, "w-12", "h-12", "border-4", "border-slate-700", "border-t-blue-500", "rounded-full", "animate-spin"], [1, "flex", "flex-col", "gap-1", "w-[150px]"], [1, "relative"], ["type", "date", 1, "w-full", "h-10", "pl-3", "pr-2", "bg-slate-900", "border", "border-slate-700", "rounded", "text-slate-100", "text-sm", "focus:outline-none", "focus:ring-2", "focus:ring-blue-500", "focus:border-transparent", 3, "ngModelChange", "change", "ngModel"], [1, "h-10", "inline-flex", "items-center", "gap-1.5", "px-3", "bg-gradient-to-r", "from-blue-600", "to-blue-700", "hover:from-blue-700", "hover:to-blue-800", "text-white", "text-sm", "font-medium", "rounded", "transition-all", "hover:-translate-y-0.5", "hover:shadow-lg", "hover:shadow-blue-500/40", "disabled:opacity-50", "disabled:cursor-not-allowed", "disabled:hover:translate-y-0", "whitespace-nowrap", "cursor-pointer", 3, "click"], [1, "flex", "flex-col", "gap-1", "w-[180px]"], ["type", "text", "placeholder", "Ingrese documento", 1, "w-full", "h-10", "px-3", "bg-slate-900", "border", "border-slate-700", "rounded", "text-slate-100", "text-sm", "placeholder:text-slate-500", "focus:outline-none", "focus:ring-2", "focus:ring-blue-500", "focus:border-transparent", 3, "ngModelChange", "ngModel"], ["type", "text", "placeholder", "Ingrese tel\xE9fono", 1, "w-full", "h-10", "px-3", "bg-slate-900", "border", "border-slate-700", "rounded", "text-slate-100", "text-sm", "placeholder:text-slate-500", "focus:outline-none", "focus:ring-2", "focus:ring-blue-500", "focus:border-transparent", 3, "ngModelChange", "ngModel"], [1, "mt-2", "p-2", "bg-red-500/10", "border", "border-red-500/30", "text-red-400", "rounded", "text-xs"], [1, "bg-slate-800", "p-3", "rounded-lg"], [1, "overflow-x-auto", "rounded", "border", "border-slate-700"], [1, "w-full", "border-collapse", "text-xs"], [1, "bg-slate-900"], [1, "border-b", "border-slate-700"], [1, "px-2", "py-2"], [1, "absolute", "left-2", "top-1/2", "-translate-y-1/2", "text-slate-500", "pointer-events-none", 3, "img", "size"], ["type", "text", "placeholder", "DNI...", 1, "w-full", "pl-7", "pr-2", "py-1.5", "bg-slate-800", "border", "border-slate-600", "rounded", "text-slate-100", "text-xs", "placeholder:text-slate-500", "focus:outline-none", "focus:ring-1", "focus:ring-blue-500", "focus:border-blue-500", 3, "ngModelChange", "input", "ngModel"], ["placeholder", "Filtrar...", 3, "ngModelChange", "selectionChange", "options", "ngModel", "compact"], ["type", "text", "placeholder", "Tel\xE9fono...", 1, "w-full", "pl-7", "pr-2", "py-1.5", "bg-slate-800", "border", "border-slate-600", "rounded", "text-slate-100", "text-xs", "placeholder:text-slate-500", "focus:outline-none", "focus:ring-1", "focus:ring-blue-500", "focus:border-blue-500", 3, "ngModelChange", "input", "ngModel"], [1, "px-2", "py-2", "text-center"], ["title", "Limpiar filtros", 1, "inline-flex", "items-center", "justify-center", "w-full", "px-2", "py-1.5", "bg-slate-700", "hover:bg-slate-600", "text-slate-300", "text-xs", "rounded", "transition-colors", "cursor-pointer", 3, "click"], [1, "px-2", "py-2.5", "text-left", "text-slate-400", "font-semibold", "border-b-2", "border-slate-700", "whitespace-nowrap", "cursor-pointer", "select-none", "hover:text-blue-400", "transition-colors", 3, "click"], ["class", "ml-1 text-[10px] text-blue-400", 4, "ngIf"], [1, "px-2", "py-2.5", "text-left", "text-slate-400", "font-semibold", "border-b-2", "border-slate-700", "whitespace-nowrap"], [1, "px-2", "py-2.5", "text-center", "text-slate-400", "font-semibold", "border-b-2", "border-slate-700", "w-12"], ["class", "transition-colors even:bg-slate-900/30 hover:bg-blue-500/10", 4, "ngFor", "ngForOf"], [1, "flex", "justify-between", "items-center", "mt-3", "gap-3", "overflow-x-auto"], [1, "text-slate-400", "text-xs", "whitespace-nowrap", "flex-shrink-0"], [1, "flex", "gap-1.5", "flex-shrink-0"], [1, "min-w-[28px]", "px-2", "py-1", "bg-slate-700", "hover:bg-slate-600", "border", "border-slate-600", "disabled:opacity-50", "disabled:cursor-not-allowed", "text-slate-100", "text-xs", "rounded", "transition-colors", "cursor-pointer", 3, "click", "disabled"], ["class", "min-w-[28px] px-2 py-1 border text-white text-xs rounded transition-colors cursor-pointer", 3, "bg-blue-600", "border-blue-600", "bg-slate-700", "border-slate-600", "hover:bg-slate-600", "click", 4, "ngFor", "ngForOf"], [1, "flex", "items-center", "gap-2", "flex-shrink-0"], [1, "text-slate-400", "text-xs", "whitespace-nowrap"], [1, "w-16"], [3, "ngModelChange", "selectionChange", "options", "ngModel"], [1, "ml-1", "text-[10px]", "text-blue-400"], [1, "transition-colors", "even:bg-slate-900/30", "hover:bg-blue-500/10"], [1, "px-2", "py-2", "text-slate-200", "border-b", "border-slate-700"], [1, "px-2", "py-2", "border-b", "border-slate-700"], [1, "inline-block", "px-2", "py-0.5", "bg-blue-500/10", "border", "border-blue-500/30", "text-blue-400", "rounded", "text-[10px]", "font-medium", "whitespace-nowrap"], [1, "px-2", "py-2", "text-center", "border-b", "border-slate-700"], ["title", "Descargar audio", 1, "inline-flex", "items-center", "justify-center", "w-7", "h-7", "bg-indigo-500/10", "hover:bg-indigo-500/20", "text-indigo-300", "rounded", "transition-all", "hover:-translate-y-0.5", "hover:shadow-md", "hover:shadow-indigo-500/30", "cursor-pointer", 3, "click"], ["class", "inline-flex items-center justify-center w-7 h-7 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 rounded transition-all hover:-translate-y-0.5 hover:shadow-md hover:shadow-emerald-500/30 cursor-pointer", "title", "Descargar reporte", 3, "click", 4, "ngIf"], ["title", "Descargar reporte", 1, "inline-flex", "items-center", "justify-center", "w-7", "h-7", "bg-emerald-500/10", "hover:bg-emerald-500/20", "text-emerald-300", "rounded", "transition-all", "hover:-translate-y-0.5", "hover:shadow-md", "hover:shadow-emerald-500/30", "cursor-pointer", 3, "click"], [1, "min-w-[28px]", "px-2", "py-1", "border", "text-white", "text-xs", "rounded", "transition-colors", "cursor-pointer", 3, "click"], [1, "bg-slate-800", "p-8", "rounded-lg", "text-center"], [1, "text-slate-400", "text-sm"]], template: function RecordingsTrackerComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div");
    \u0275\u0275template(1, RecordingsTrackerComponent_div_1_Template, 2, 0, "div", 0);
    \u0275\u0275elementStart(2, "div", 1)(3, "div", 2)(4, "div", 3)(5, "label", 4);
    \u0275\u0275text(6, "Tramo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "app-custom-select", 5);
    \u0275\u0275twoWayListener("ngModelChange", function RecordingsTrackerComponent_Template_app_custom_select_ngModelChange_7_listener($event) {
      \u0275\u0275twoWayBindingSet(ctx.selectedTramo, $event) || (ctx.selectedTramo = $event);
      return $event;
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "div", 6)(9, "label", 4);
    \u0275\u0275text(10, "Tipo de B\xFAsqueda");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "app-custom-select", 7);
    \u0275\u0275twoWayListener("ngModelChange", function RecordingsTrackerComponent_Template_app_custom_select_ngModelChange_11_listener($event) {
      \u0275\u0275twoWayBindingSet(ctx.selectedTipoBusqueda, $event) || (ctx.selectedTipoBusqueda = $event);
      return $event;
    });
    \u0275\u0275listener("selectionChange", function RecordingsTrackerComponent_Template_app_custom_select_selectionChange_11_listener() {
      return ctx.changeTypeSearch();
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275template(12, RecordingsTrackerComponent_div_12_Template, 14, 4, "div", 8)(13, RecordingsTrackerComponent_div_13_Template, 8, 3, "div", 8)(14, RecordingsTrackerComponent_div_14_Template, 8, 3, "div", 8);
    \u0275\u0275element(15, "div", 9);
    \u0275\u0275elementStart(16, "div", 10)(17, "div", 11)(18, "label", 4);
    \u0275\u0275text(19, "Descargar de forma masiva");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "div", 10)(21, "button", 12);
    \u0275\u0275listener("click", function RecordingsTrackerComponent_Template_button_click_21_listener() {
      return ctx.massiveDownloadAudios();
    });
    \u0275\u0275element(22, "lucide-angular", 13);
    \u0275\u0275text(23, " Audios ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "button", 14);
    \u0275\u0275listener("click", function RecordingsTrackerComponent_Template_button_click_24_listener() {
      return ctx.massiveDownloadReports();
    });
    \u0275\u0275element(25, "lucide-angular", 13);
    \u0275\u0275text(26, " Reportes ");
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275template(27, RecordingsTrackerComponent_div_27_Template, 2, 1, "div", 15);
    \u0275\u0275elementEnd();
    \u0275\u0275template(28, RecordingsTrackerComponent_div_28_Template, 69, 31, "div", 16)(29, RecordingsTrackerComponent_div_29_Template, 3, 0, "div", 17);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.isLoading);
    \u0275\u0275advance(6);
    \u0275\u0275property("options", ctx.tramos);
    \u0275\u0275twoWayProperty("ngModel", ctx.selectedTramo);
    \u0275\u0275advance(4);
    \u0275\u0275property("options", ctx.tipoBusqueda);
    \u0275\u0275twoWayProperty("ngModel", ctx.selectedTipoBusqueda);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.selectedTipoBusqueda === "fechas");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.selectedTipoBusqueda === "documento");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.selectedTipoBusqueda === "telefono");
    \u0275\u0275advance(7);
    \u0275\u0275property("disabled", ctx.isDownloadingMassive || ctx.gestiones.length === 0);
    \u0275\u0275advance();
    \u0275\u0275property("img", ctx.Volume2)("size", 16);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx.isDownloadingMassive || ctx.gestiones.length === 0);
    \u0275\u0275advance();
    \u0275\u0275property("img", ctx.FileSpreadsheet)("size", 16);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", ctx.errorMessage);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.gestiones.length > 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.gestiones.length === 0 && !ctx.isLoading);
  }
}, dependencies: [CommonModule, NgForOf, NgIf, FormsModule, DefaultValueAccessor, NgControlStatus, NgModel, LucideAngularModule, LucideAngularComponent, CustomSelectComponent], styles: ["\n\n/*# sourceMappingURL=recordings-tracker.component.css.map */"] });
var RecordingsTrackerComponent = _RecordingsTrackerComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RecordingsTrackerComponent, [{
    type: Component,
    args: [{ selector: "app-recordings-tracker", standalone: true, imports: [CommonModule, FormsModule, LucideAngularModule, CustomSelectComponent], template: `<div>\r
  <!-- Loading Overlay -->\r
  <div *ngIf="isLoading" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">\r
    <div class="w-12 h-12 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>\r
  </div>\r
\r
  <!-- Search Form -->\r
  <div class="bg-slate-800 p-3 rounded-lg mb-3">\r
    <div class="flex gap-2 overflow-x-auto">\r
      <!-- Tramo Filter -->\r
      <div class="flex flex-col gap-1 w-[140px] flex-shrink-0">\r
        <label class="text-slate-400 text-xs font-medium">Tramo</label>\r
        <app-custom-select\r
          [options]="tramos"\r
          [(ngModel)]="selectedTramo"\r
          placeholder="Seleccionar tramo">\r
        </app-custom-select>\r
      </div>\r
\r
      <!-- Type Search -->\r
      <div class="flex flex-col gap-1 w-[160px] flex-shrink-0">\r
        <label class="text-slate-400 text-xs font-medium">Tipo de B\xFAsqueda</label>\r
        <app-custom-select\r
          [options]="tipoBusqueda"\r
          [(ngModel)]="selectedTipoBusqueda"\r
          (selectionChange)="changeTypeSearch()"\r
          placeholder="Tipo de b\xFAsqueda">\r
        </app-custom-select>\r
      </div>\r
\r
      <!-- Search by Dates -->\r
      <div *ngIf="selectedTipoBusqueda === 'fechas'" class="flex gap-2 items-end flex-shrink-0">\r
        <div class="flex flex-col gap-1 w-[150px]">\r
          <label class="text-slate-400 text-xs font-medium">Fecha Inicio</label>\r
          <div class="relative">\r
            <input\r
              type="date"\r
              [(ngModel)]="startDate"\r
              (change)="validateDates()"\r
              class="w-full h-10 pl-3 pr-2 bg-slate-900 border border-slate-700 rounded text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />\r
          </div>\r
        </div>\r
\r
        <div class="flex flex-col gap-1 w-[150px]">\r
          <label class="text-slate-400 text-xs font-medium">Fecha Fin</label>\r
          <div class="relative">\r
            <input\r
              type="date"\r
              [(ngModel)]="endDate"\r
              (change)="validateDates()"\r
              class="w-full h-10 pl-3 pr-2 bg-slate-900 border border-slate-700 rounded text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />\r
          </div>\r
        </div>\r
\r
        <button\r
          (click)="searchByDates()"\r
          class="h-10 inline-flex items-center gap-1.5 px-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-medium rounded transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 whitespace-nowrap cursor-pointer">\r
          <lucide-angular [img]="Search" [size]="16"></lucide-angular>\r
          Buscar\r
        </button>\r
      </div>\r
\r
      <!-- Search by Document -->\r
      <div *ngIf="selectedTipoBusqueda === 'documento'" class="flex gap-2 items-end flex-shrink-0">\r
        <div class="flex flex-col gap-1 w-[180px]">\r
          <label class="text-slate-400 text-xs font-medium">Documento</label>\r
          <input\r
            type="text"\r
            [(ngModel)]="documento"\r
            placeholder="Ingrese documento"\r
            class="w-full h-10 px-3 bg-slate-900 border border-slate-700 rounded text-slate-100 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />\r
        </div>\r
\r
        <button\r
          (click)="searchByDocumento()"\r
          class="h-10 inline-flex items-center gap-1.5 px-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-medium rounded transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 whitespace-nowrap cursor-pointer">\r
          <lucide-angular [img]="Search" [size]="16"></lucide-angular>\r
          Buscar\r
        </button>\r
      </div>\r
\r
      <!-- Search by Phone -->\r
      <div *ngIf="selectedTipoBusqueda === 'telefono'" class="flex gap-2 items-end flex-shrink-0">\r
        <div class="flex flex-col gap-1 w-[180px]">\r
          <label class="text-slate-400 text-xs font-medium">Tel\xE9fono</label>\r
          <input\r
            type="text"\r
            [(ngModel)]="telefono"\r
            placeholder="Ingrese tel\xE9fono"\r
            class="w-full h-10 px-3 bg-slate-900 border border-slate-700 rounded text-slate-100 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />\r
        </div>\r
\r
        <button\r
          (click)="searchByTelefono()"\r
          class="h-10 inline-flex items-center gap-1.5 px-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-medium rounded transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 whitespace-nowrap cursor-pointer">\r
          <lucide-angular [img]="Search" [size]="16"></lucide-angular>\r
          Buscar\r
        </button>\r
      </div>\r
\r
      <!-- Divider -->\r
      <div class="w-px bg-slate-700 self-stretch flex-shrink-0"></div>\r
\r
      <!-- Massive Actions -->\r
      <div class="flex gap-2 items-end flex-shrink-0">\r
        <div class="flex flex-col gap-1">\r
          <label class="text-slate-400 text-xs font-medium">Descargar de forma masiva</label>\r
          <div class="flex gap-2 items-end flex-shrink-0">\r
             <button\r
              (click)="massiveDownloadAudios()"\r
              [disabled]="isDownloadingMassive || gestiones.length === 0"\r
              class="h-10 inline-flex items-center gap-1.5 px-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-sm font-medium rounded transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 whitespace-nowrap cursor-pointer">\r
              <lucide-angular [img]="Volume2" [size]="16"></lucide-angular>\r
              Audios\r
            </button>\r
\r
            <button\r
              (click)="massiveDownloadReports()"\r
              [disabled]="isDownloadingMassive || gestiones.length === 0"\r
              class="h-10 inline-flex items-center gap-1.5 px-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white text-sm font-medium rounded transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-500/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 whitespace-nowrap cursor-pointer">\r
              <lucide-angular [img]="FileSpreadsheet" [size]="16"></lucide-angular>\r
              Reportes\r
            </button>\r
          </div>\r
        </div>\r
\r
      </div>\r
    </div>\r
\r
    <!-- Error Message -->\r
    <div *ngIf="errorMessage" class="mt-2 p-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded text-xs">\r
      {{ errorMessage }}\r
    </div>\r
  </div>\r
\r
  <!-- Table Section -->\r
  <div class="bg-slate-800 p-3 rounded-lg" *ngIf="gestiones.length > 0">\r
    <!-- Custom Table -->\r
    <div class="overflow-x-auto rounded border border-slate-700">\r
      <table class="w-full border-collapse text-xs">\r
        <thead class="bg-slate-900">\r
          <!-- Filter Row -->\r
          <tr class="border-b border-slate-700">\r
            <th class="px-2 py-2">\r
              <div class="relative">\r
                <lucide-angular [img]="Search" [size]="14" class="absolute left-2 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"></lucide-angular>\r
                <input\r
                  type="text"\r
                  [(ngModel)]="filterDocumento"\r
                  (input)="applyFilters()"\r
                  placeholder="DNI..."\r
                  class="w-full pl-7 pr-2 py-1.5 bg-slate-800 border border-slate-600 rounded text-slate-100 text-xs placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" />\r
              </div>\r
            </th>\r
            <th class="px-2 py-2">\r
              <app-custom-select\r
                [options]="tramos"\r
                [(ngModel)]="filterCartera"\r
                (selectionChange)="applyFilters()"\r
                [compact]="true"\r
                placeholder="Filtrar...">\r
              </app-custom-select>\r
            </th>\r
            <th class="px-2 py-2">\r
              <div class="relative">\r
                <lucide-angular [img]="Search" [size]="14" class="absolute left-2 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"></lucide-angular>\r
                <input\r
                  type="text"\r
                  [(ngModel)]="filterTelefono"\r
                  (input)="applyFilters()"\r
                  placeholder="Tel\xE9fono..."\r
                  class="w-full pl-7 pr-2 py-1.5 bg-slate-800 border border-slate-600 rounded text-slate-100 text-xs placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" />\r
              </div>\r
            </th>\r
            <th class="px-2 py-2"></th>\r
            <th class="px-2 py-2"></th>\r
            <th class="px-2 py-2">\r
              <app-custom-select\r
                [options]="resultados"\r
                [(ngModel)]="filterResultado"\r
                (selectionChange)="applyFilters()"\r
                [compact]="true"\r
                placeholder="Filtrar...">\r
              </app-custom-select>\r
            </th>\r
            <th class="px-2 py-2"></th>\r
            <th class="px-2 py-2 text-center">\r
              <button\r
                (click)="clearFilters()"\r
                class="inline-flex items-center justify-center w-full px-2 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs rounded transition-colors cursor-pointer"\r
                title="Limpiar filtros">\r
                <lucide-angular [img]="X" [size]="14"></lucide-angular>\r
              </button>\r
            </th>\r
            <th class="px-2 py-2"></th>\r
          </tr>\r
\r
          <!-- Header Row -->\r
          <tr>\r
            <th\r
              (click)="sort('documento')"\r
              class="px-2 py-2.5 text-left text-slate-400 font-semibold border-b-2 border-slate-700 whitespace-nowrap cursor-pointer select-none hover:text-blue-400 transition-colors">\r
              DNI\r
              <span *ngIf="sortField === 'documento'" class="ml-1 text-[10px] text-blue-400">\r
                {{ sortOrder === 1 ? '\u25B2' : '\u25BC' }}\r
              </span>\r
            </th>\r
            <th\r
              (click)="sort('cartera')"\r
              class="px-2 py-2.5 text-left text-slate-400 font-semibold border-b-2 border-slate-700 whitespace-nowrap cursor-pointer select-none hover:text-blue-400 transition-colors">\r
              Tramo\r
              <span *ngIf="sortField === 'cartera'" class="ml-1 text-[10px] text-blue-400">\r
                {{ sortOrder === 1 ? '\u25B2' : '\u25BC' }}\r
              </span>\r
            </th>\r
            <th\r
              (click)="sort('telefono')"\r
              class="px-2 py-2.5 text-left text-slate-400 font-semibold border-b-2 border-slate-700 whitespace-nowrap cursor-pointer select-none hover:text-blue-400 transition-colors">\r
              Tel\xE9fono\r
              <span *ngIf="sortField === 'telefono'" class="ml-1 text-[10px] text-blue-400">\r
                {{ sortOrder === 1 ? '\u25B2' : '\u25BC' }}\r
              </span>\r
            </th>\r
            <th\r
              (click)="sort('fechagestion')"\r
              class="px-2 py-2.5 text-left text-slate-400 font-semibold border-b-2 border-slate-700 whitespace-nowrap cursor-pointer select-none hover:text-blue-400 transition-colors">\r
              Fecha\r
              <span *ngIf="sortField === 'fechagestion'" class="ml-1 text-[10px] text-blue-400">\r
                {{ sortOrder === 1 ? '\u25B2' : '\u25BC' }}\r
              </span>\r
            </th>\r
            <th\r
              (click)="sort('horagestion')"\r
              class="px-2 py-2.5 text-left text-slate-400 font-semibold border-b-2 border-slate-700 whitespace-nowrap cursor-pointer select-none hover:text-blue-400 transition-colors">\r
              Hora\r
              <span *ngIf="sortField === 'horagestion'" class="ml-1 text-[10px] text-blue-400">\r
                {{ sortOrder === 1 ? '\u25B2' : '\u25BC' }}\r
              </span>\r
            </th>\r
            <th\r
              (click)="sort('resultado')"\r
              class="px-2 py-2.5 text-left text-slate-400 font-semibold border-b-2 border-slate-700 whitespace-nowrap cursor-pointer select-none hover:text-blue-400 transition-colors">\r
              Resultado\r
              <span *ngIf="sortField === 'resultado'" class="ml-1 text-[10px] text-blue-400">\r
                {{ sortOrder === 1 ? '\u25B2' : '\u25BC' }}\r
              </span>\r
            </th>\r
            <th class="px-2 py-2.5 text-left text-slate-400 font-semibold border-b-2 border-slate-700 whitespace-nowrap">Soluci\xF3n</th>\r
            <th class="px-2 py-2.5 text-center text-slate-400 font-semibold border-b-2 border-slate-700 w-12">Audio</th>\r
            <th class="px-2 py-2.5 text-center text-slate-400 font-semibold border-b-2 border-slate-700 w-12">Reporte</th>\r
          </tr>\r
        </thead>\r
        <tbody>\r
          <tr *ngFor="let gestion of paginatedGestiones" class="transition-colors even:bg-slate-900/30 hover:bg-blue-500/10">\r
            <td class="px-2 py-2 text-slate-200 border-b border-slate-700">{{ gestion.documento }}</td>\r
            <td class="px-2 py-2 text-slate-200 border-b border-slate-700">{{ gestion.cartera }}</td>\r
            <td class="px-2 py-2 text-slate-200 border-b border-slate-700">{{ gestion.telefono }}</td>\r
            <td class="px-2 py-2 text-slate-200 border-b border-slate-700">{{ gestion.fechagestion }}</td>\r
            <td class="px-2 py-2 text-slate-200 border-b border-slate-700">{{ gestion.horagestion }}</td>\r
            <td class="px-2 py-2 border-b border-slate-700">\r
              <span class="inline-block px-2 py-0.5 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded text-[10px] font-medium whitespace-nowrap">\r
                {{ gestion.resultado }}\r
              </span>\r
            </td>\r
            <td class="px-2 py-2 text-slate-200 border-b border-slate-700">{{ gestion.solucion }}</td>\r
            <td class="px-2 py-2 text-center border-b border-slate-700">\r
              <button\r
                (click)="downloadAudio(gestion)"\r
                class="inline-flex items-center justify-center w-7 h-7 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 rounded transition-all hover:-translate-y-0.5 hover:shadow-md hover:shadow-indigo-500/30 cursor-pointer"\r
                title="Descargar audio">\r
                <lucide-angular [img]="Volume2" [size]="14"></lucide-angular>\r
              </button>\r
            </td>\r
            <td class="px-2 py-2 text-center border-b border-slate-700">\r
              <button\r
                *ngIf="canDownloadReport(gestion.resultado)"\r
                (click)="downloadReport(gestion)"\r
                class="inline-flex items-center justify-center w-7 h-7 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 rounded transition-all hover:-translate-y-0.5 hover:shadow-md hover:shadow-emerald-500/30 cursor-pointer"\r
                title="Descargar reporte">\r
                <lucide-angular [img]="FileSpreadsheet" [size]="14"></lucide-angular>\r
              </button>\r
            </td>\r
          </tr>\r
        </tbody>\r
      </table>\r
    </div>\r
\r
    <!-- Pagination -->\r
    <div class="flex justify-between items-center mt-3 gap-3 overflow-x-auto">\r
      <div class="text-slate-400 text-xs whitespace-nowrap flex-shrink-0">\r
        Mostrando {{ (currentPage - 1) * pageSize + 1 }} a\r
        {{ Math.min(currentPage * pageSize, filteredGestiones.length) }} de\r
        {{ filteredGestiones.length }} registros\r
      </div>\r
\r
      <div class="flex gap-1.5 flex-shrink-0">\r
        <button\r
          (click)="goToPage(1)"\r
          [disabled]="currentPage === 1"\r
          class="min-w-[28px] px-2 py-1 bg-slate-700 hover:bg-slate-600 border border-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-slate-100 text-xs rounded transition-colors cursor-pointer">\r
          \xAB\r
        </button>\r
\r
        <button\r
          (click)="goToPage(currentPage - 1)"\r
          [disabled]="currentPage === 1"\r
          class="min-w-[28px] px-2 py-1 bg-slate-700 hover:bg-slate-600 border border-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-slate-100 text-xs rounded transition-colors cursor-pointer">\r
          \u2039\r
        </button>\r
\r
        <button\r
          *ngFor="let page of getPageNumbers()"\r
          (click)="goToPage(page)"\r
          [class.bg-blue-600]="page === currentPage"\r
          [class.border-blue-600]="page === currentPage"\r
          [class.bg-slate-700]="page !== currentPage"\r
          [class.border-slate-600]="page !== currentPage"\r
          [class.hover:bg-slate-600]="page !== currentPage"\r
          class="min-w-[28px] px-2 py-1 border text-white text-xs rounded transition-colors cursor-pointer">\r
          {{ page }}\r
        </button>\r
\r
        <button\r
          (click)="goToPage(currentPage + 1)"\r
          [disabled]="currentPage === totalPages"\r
          class="min-w-[28px] px-2 py-1 bg-slate-700 hover:bg-slate-600 border border-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-slate-100 text-xs rounded transition-colors cursor-pointer">\r
          \u203A\r
        </button>\r
\r
        <button\r
          (click)="goToPage(totalPages)"\r
          [disabled]="currentPage === totalPages"\r
          class="min-w-[28px] px-2 py-1 bg-slate-700 hover:bg-slate-600 border border-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-slate-100 text-xs rounded transition-colors cursor-pointer">\r
          \xBB\r
        </button>\r
      </div>\r
\r
      <div class="flex items-center gap-2 flex-shrink-0">\r
        <label class="text-slate-400 text-xs whitespace-nowrap">Filas por p\xE1gina:</label>\r
        <div class="w-16">\r
          <app-custom-select\r
            [options]="pageSizeOptions"\r
            [(ngModel)]="pageSize"\r
            (selectionChange)="onPageSizeChange($event)">\r
          </app-custom-select>\r
        </div>\r
      </div>\r
    </div>\r
  </div>\r
\r
  <!-- Empty State -->\r
  <div *ngIf="gestiones.length === 0 && !isLoading" class="bg-slate-800 p-8 rounded-lg text-center">\r
    <p class="text-slate-400 text-sm">No hay grabaciones para mostrar. Realiza una b\xFAsqueda para ver resultados.</p>\r
  </div>\r
</div>\r
`, styles: ["/* src/app/features/legacy/recordings/components/recordings-tracker/recordings-tracker.component.scss */\n/*# sourceMappingURL=recordings-tracker.component.css.map */\n"] }]
  }], () => [{ type: HistoricalRecordingsService }, { type: RecordingDownloadService }, { type: RecordingEvaluationReportService }, { type: ToastService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(RecordingsTrackerComponent, { className: "RecordingsTrackerComponent", filePath: "src/app/features/legacy/recordings/components/recordings-tracker/recordings-tracker.component.ts", lineNumber: 41 });
})();

// src/app/features/legacy/recordings/pages/recordings-page/recordings-page.component.ts
var _RecordingsPageComponent = class _RecordingsPageComponent {
};
_RecordingsPageComponent.\u0275fac = function RecordingsPageComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _RecordingsPageComponent)();
};
_RecordingsPageComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _RecordingsPageComponent, selectors: [["app-recordings-page"]], decls: 10, vars: 1, consts: [[1, "min-h-screen", "bg-slate-950", "p-4"], [1, "flex", "items-center", "gap-2", "mb-3"], [1, "w-8", "h-8", "bg-gradient-to-br", "from-indigo-600", "to-indigo-700", "rounded-lg", "flex", "items-center", "justify-center"], ["name", "headphones", 1, "text-white!", 3, "size"], [1, "text-lg", "font-bold", "text-white"], [1, "text-xs", "text-gray-400"]], template: function RecordingsPageComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2);
    \u0275\u0275element(3, "lucide-angular", 3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div")(5, "h1", 4);
    \u0275\u0275text(6, "Grabaciones Hist\xF3ricas");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p", 5);
    \u0275\u0275text(8, "B\xFAsqueda y descarga de grabaciones de llamadas");
    \u0275\u0275elementEnd()()();
    \u0275\u0275element(9, "app-recordings-tracker");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance(3);
    \u0275\u0275property("size", 16);
  }
}, dependencies: [RecordingsTrackerComponent, LucideAngularModule, LucideAngularComponent], styles: ["\n\n/*# sourceMappingURL=recordings-page.component.css.map */"] });
var RecordingsPageComponent = _RecordingsPageComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RecordingsPageComponent, [{
    type: Component,
    args: [{ selector: "app-recordings-page", standalone: true, imports: [RecordingsTrackerComponent, LucideAngularModule], template: '<div class="min-h-screen bg-slate-950 p-4">\r\n  <!-- Header -->\r\n  <div class="flex items-center gap-2 mb-3">\r\n    <div class="w-8 h-8 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-lg flex items-center justify-center">\r\n      <lucide-angular name="headphones" [size]="16" class="text-white!"></lucide-angular>\r\n    </div>\r\n    <div>\r\n      <h1 class="text-lg font-bold text-white">Grabaciones Hist\xF3ricas</h1>\r\n      <p class="text-xs text-gray-400">B\xFAsqueda y descarga de grabaciones de llamadas</p>\r\n    </div>\r\n  </div>\r\n\r\n  <app-recordings-tracker></app-recordings-tracker>\r\n</div>\r\n', styles: ["/* src/app/features/legacy/recordings/pages/recordings-page/recordings-page.component.scss */\n/*# sourceMappingURL=recordings-page.component.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(RecordingsPageComponent, { className: "RecordingsPageComponent", filePath: "src/app/features/legacy/recordings/pages/recordings-page/recordings-page.component.ts", lineNumber: 12 });
})();
export {
  RecordingsPageComponent
};
//# sourceMappingURL=chunk-IJ5YKANY.js.map
