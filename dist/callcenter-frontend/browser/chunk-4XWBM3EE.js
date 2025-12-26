import {
  environment
} from "./chunk-QF774CZR.js";
import {
  HttpClient,
  Injectable,
  inject,
  setClassMetadata,
  ɵɵdefineInjectable
} from "./chunk-CTRHJBBW.js";

// src/app/maintenance/services/rol.service.ts
var _RolService = class _RolService {
  constructor() {
    this.http = inject(HttpClient);
    this.apiUrl = `${environment.apiUrl}/roles`;
  }
  obtenerTodos() {
    return this.http.get(this.apiUrl);
  }
  obtenerPorId(id) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
  crear(request) {
    return this.http.post(this.apiUrl, request);
  }
  actualizar(id, request) {
    return this.http.put(`${this.apiUrl}/${id}`, request);
  }
  eliminar(id) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
};
_RolService.\u0275fac = function RolService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _RolService)();
};
_RolService.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _RolService, factory: _RolService.\u0275fac, providedIn: "root" });
var RolService = _RolService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RolService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

export {
  RolService
};
//# sourceMappingURL=chunk-4XWBM3EE.js.map
