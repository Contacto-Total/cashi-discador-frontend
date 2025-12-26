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

// src/app/maintenance/services/portfolio.service.ts
var _PortfolioService = class _PortfolioService {
  constructor(http) {
    this.http = http;
    this.apiUrl = `${environment.tipificacionUrl}/system-config`;
    this.subPortfolioUrl = `${environment.tipificacionUrl}/subportfolios`;
  }
  // Portfolio endpoints
  getPortfoliosByTenant(tenantId) {
    return this.http.get(`${this.apiUrl}/tenants/${tenantId}/portfolios`);
  }
  getPortfolioById(portfolioId) {
    return this.http.get(`${this.apiUrl}/portfolios/${portfolioId}`);
  }
  createPortfolio(request) {
    return this.http.post(`${this.apiUrl}/portfolios`, request);
  }
  updatePortfolio(portfolioId, request) {
    return this.http.put(`${this.apiUrl}/portfolios/${portfolioId}`, request);
  }
  deletePortfolio(portfolioId) {
    return this.http.delete(`${this.apiUrl}/portfolios/${portfolioId}`);
  }
  // SubPortfolio endpoints
  getSubPortfoliosByPortfolio(portfolioId) {
    return this.http.get(`${this.subPortfolioUrl}/by-portfolio/${portfolioId}`);
  }
  getActiveSubPortfoliosByPortfolio(portfolioId) {
    return this.http.get(`${this.subPortfolioUrl}/by-portfolio/${portfolioId}/active`);
  }
  getSubPortfoliosByTenant(tenantId) {
    return this.http.get(`${this.subPortfolioUrl}/by-tenant/${tenantId}`);
  }
  getAllSubPortfolios() {
    return this.http.get(this.subPortfolioUrl);
  }
  getSubPortfolioById(subPortfolioId) {
    return this.http.get(`${this.subPortfolioUrl}/${subPortfolioId}`);
  }
  createSubPortfolio(request) {
    return this.http.post(this.subPortfolioUrl, request);
  }
  updateSubPortfolio(subPortfolioId, request) {
    return this.http.put(`${this.subPortfolioUrl}/${subPortfolioId}`, request);
  }
  toggleSubPortfolioStatus(subPortfolioId, isActive) {
    return this.http.patch(`${this.subPortfolioUrl}/${subPortfolioId}/toggle-status?isActive=${isActive}`, {});
  }
  deleteSubPortfolio(subPortfolioId) {
    return this.http.delete(`${this.subPortfolioUrl}/${subPortfolioId}`);
  }
};
_PortfolioService.\u0275fac = function PortfolioService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _PortfolioService)(\u0275\u0275inject(HttpClient));
};
_PortfolioService.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _PortfolioService, factory: _PortfolioService.\u0275fac, providedIn: "root" });
var PortfolioService = _PortfolioService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PortfolioService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{ type: HttpClient }], null);
})();

export {
  PortfolioService
};
//# sourceMappingURL=chunk-K6HKS25L.js.map
