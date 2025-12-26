import {
  environment
} from "./chunk-QF774CZR.js";
import {
  HttpClient,
  Injectable,
  setClassMetadata,
  ɵɵdefineInjectable,
  ɵɵinject
} from "./chunk-CTRHJBBW.js";

// src/app/maintenance/services/tenant.service.ts
var _TenantService = class _TenantService {
  constructor(http) {
    this.http = http;
    this.apiUrl = `${environment.webServiceUrl}/v1/system-config/tenants`;
  }
  getAllTenants() {
    return this.http.get(this.apiUrl);
  }
  getTenantById(tenantId) {
    return this.http.get(`${this.apiUrl}/${tenantId}`);
  }
  createTenant(tenant) {
    return this.http.post(this.apiUrl, tenant);
  }
  updateTenant(tenantId, tenant) {
    return this.http.put(`${this.apiUrl}/${tenantId}`, tenant);
  }
  deleteTenant(tenantId) {
    return this.http.delete(`${this.apiUrl}/${tenantId}`);
  }
};
_TenantService.\u0275fac = function TenantService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _TenantService)(\u0275\u0275inject(HttpClient));
};
_TenantService.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _TenantService, factory: _TenantService.\u0275fac, providedIn: "root" });
var TenantService = _TenantService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TenantService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{ type: HttpClient }], null);
})();

export {
  TenantService
};
//# sourceMappingURL=chunk-RDUKPQZZ.js.map
