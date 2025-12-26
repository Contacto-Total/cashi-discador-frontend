import {
  environment
} from "./chunk-QF774CZR.js";
import {
  HttpClient,
  HttpHeaders,
  Injectable,
  __spreadProps,
  __spreadValues,
  catchError,
  retry,
  setClassMetadata,
  throwError,
  ɵɵdefineInjectable,
  ɵɵinject
} from "./chunk-CTRHJBBW.js";

// src/app/features/legacy/agreements/services/agreements.service.ts
var _AgreementsService = class _AgreementsService {
  constructor(http) {
    this.http = http;
    this.baseUrl = environment.webServiceUrl + "/cartas";
    this.httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    };
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
  downloadAgreementCard(createPaymentAgreementRequest) {
    return this.http.post(this.baseUrl + "/carta-acuerdo", createPaymentAgreementRequest, __spreadProps(__spreadValues({}, this.fileHttpOptions), {
      responseType: "blob"
    })).pipe(retry(2), catchError(this.handleError));
  }
  downloadNoDebtLetter(request) {
    return this.http.post(this.baseUrl + "/carta-no-adeudo", request, __spreadProps(__spreadValues({}, this.fileHttpOptions), {
      responseType: "blob"
    })).pipe(retry(2), catchError(this.handleError));
  }
  getAgreementData(dni) {
    return this.http.get(this.baseUrl + `/datos-cliente/${dni}`, this.httpOptions);
  }
};
_AgreementsService.\u0275fac = function AgreementsService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _AgreementsService)(\u0275\u0275inject(HttpClient));
};
_AgreementsService.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AgreementsService, factory: _AgreementsService.\u0275fac, providedIn: "root" });
var AgreementsService = _AgreementsService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AgreementsService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{ type: HttpClient }], null);
})();

export {
  AgreementsService
};
//# sourceMappingURL=chunk-B2EH5ADJ.js.map
