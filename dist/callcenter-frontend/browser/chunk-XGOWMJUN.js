import {
  environment
} from "./chunk-QF774CZR.js";
import {
  HttpClient,
  HttpParams,
  Injectable,
  setClassMetadata,
  ɵɵdefineInjectable,
  ɵɵinject
} from "./chunk-CTRHJBBW.js";

// src/app/maintenance/services/typification.service.ts
var _TypificationService = class _TypificationService {
  constructor(http) {
    this.http = http;
    this.baseUrl = environment.tipificacionUrl;
  }
  // Catalog Management
  getAllClassifications() {
    return this.http.get(`${this.baseUrl}/typifications`);
  }
  getTypificationsByType(type) {
    return this.http.get(`${this.baseUrl}/typifications/type/${type}`);
  }
  getTypificationsByLevel(level) {
    return this.http.get(`${this.baseUrl}/typifications/level/${level}`);
  }
  getTypificationsByParent(parentId) {
    return this.http.get(`${this.baseUrl}/typifications/${parentId}/children`);
  }
  getClassificationById(id) {
    return this.http.get(`${this.baseUrl}/typifications/${id}`);
  }
  createTypification(command) {
    return this.http.post(`${this.baseUrl}/typifications`, command);
  }
  updateTypification(id, command) {
    return this.http.put(`${this.baseUrl}/typifications/${id}`, command);
  }
  deleteTypification(id) {
    return this.http.delete(`${this.baseUrl}/typifications/${id}`);
  }
  updateDisplayOrder(updates) {
    return this.http.patch(`${this.baseUrl}/typifications/display-order`, updates);
  }
  // Tenant Configuration Management
  getTenantClassifications(tenantId, portfolioId, includeDisabled) {
    let params = new HttpParams();
    if (portfolioId) {
      params = params.set("portfolioId", portfolioId.toString());
    }
    if (includeDisabled) {
      params = params.set("includeDisabled", "true");
    }
    return this.http.get(`${this.baseUrl}/tenants/${tenantId}/typifications`, { params });
  }
  getTenantClassificationsByType(tenantId, type, portfolioId) {
    let params = new HttpParams();
    if (portfolioId) {
      params = params.set("portfolioId", portfolioId.toString());
    }
    return this.http.get(`${this.baseUrl}/tenants/${tenantId}/typifications/type/${type}`, { params });
  }
  getTenantClassificationsByLevel(tenantId, level, portfolioId) {
    let params = new HttpParams();
    if (portfolioId) {
      params = params.set("portfolioId", portfolioId.toString());
    }
    return this.http.get(`${this.baseUrl}/tenants/${tenantId}/typifications/level/${level}`, { params });
  }
  getEnabledClassifications(tenantId, portfolioId) {
    let params = new HttpParams();
    if (portfolioId) {
      params = params.set("portfolioId", portfolioId.toString());
    }
    return this.http.get(`${this.baseUrl}/tenants/${tenantId}/typifications/enabled`, { params });
  }
  updateTenantTypificationConfig(tenantId, typificationId, command, portfolioId) {
    let params = new HttpParams();
    if (portfolioId) {
      params = params.set("portfolioId", portfolioId.toString());
    }
    return this.http.put(`${this.baseUrl}/tenants/${tenantId}/typifications/${typificationId}/config`, command, { params });
  }
  enableClassification(tenantId, typificationId, portfolioId) {
    let params = new HttpParams();
    if (portfolioId) {
      params = params.set("portfolioId", portfolioId.toString());
    }
    return this.http.post(`${this.baseUrl}/tenants/${tenantId}/typifications/${typificationId}/enable`, {}, { params });
  }
  disableClassification(tenantId, typificationId, portfolioId) {
    let params = new HttpParams();
    if (portfolioId) {
      params = params.set("portfolioId", portfolioId.toString());
    }
    return this.http.post(`${this.baseUrl}/tenants/${tenantId}/typifications/${typificationId}/disable`, {}, { params });
  }
  // Tenant Management
  getAllTenants() {
    return this.http.get(`${this.baseUrl}/system-config/tenants`);
  }
  createTenant(data) {
    return this.http.post(`${this.baseUrl}/system-config/tenants`, data);
  }
  updateTenant(tenantId, data) {
    return this.http.put(`${this.baseUrl}/system-config/tenants/${tenantId}`, data);
  }
  deleteTenant(tenantId) {
    return this.http.delete(`${this.baseUrl}/system-config/tenants/${tenantId}`);
  }
  // Portfolio Management
  getPortfoliosByTenant(tenantId) {
    return this.http.get(`${this.baseUrl}/system-config/tenants/${tenantId}/portfolios`);
  }
  createPortfolio(data) {
    return this.http.post(`${this.baseUrl}/system-config/portfolios`, data);
  }
  updatePortfolio(portfolioId, data) {
    return this.http.put(`${this.baseUrl}/system-config/portfolios/${portfolioId}`, data);
  }
  deletePortfolio(portfolioId) {
    return this.http.delete(`${this.baseUrl}/system-config/portfolios/${portfolioId}`);
  }
  // SubPortfolio Management
  getSubPortfoliosByPortfolio(portfolioId) {
    return this.http.get(`${this.baseUrl}/system-config/portfolios/${portfolioId}/subportfolios`);
  }
  // CSV Column Mapping Management
  saveCsvMappings(portfolioId, csvHeaders) {
    return this.http.post(`${this.baseUrl}/portfolios/${portfolioId}/csv-mappings`, { csvHeaders });
  }
  getCsvMappings(portfolioId) {
    return this.http.get(`${this.baseUrl}/portfolios/${portfolioId}/csv-mappings`);
  }
  deleteCsvMappings(portfolioId) {
    return this.http.delete(`${this.baseUrl}/portfolios/${portfolioId}/csv-mappings`);
  }
  // V2 API Methods
  getEffectiveTypifications(tenantId, portfolioId, subPortfolioId) {
    return this.http.get(`${environment.gatewayUrl}/v2/typifications/config/effective/tenant/${tenantId}/portfolio/${portfolioId}/subportfolio/${subPortfolioId}`);
  }
  getAdditionalFields(typificationId) {
    return this.http.get(`${environment.gatewayUrl}/v2/typifications/catalog/${typificationId}/additional-fields`);
  }
  saveManagementRecord(record) {
    return this.http.post(`${environment.gatewayUrl}/v2/management-records`, record);
  }
  // Helper method to build tree structure
  buildClassificationTree(typifications) {
    const map = /* @__PURE__ */ new Map();
    const roots = [];
    typifications.forEach((typification) => {
      map.set(typification.id, {
        typification,
        children: [],
        level: typification.hierarchyLevel
      });
    });
    typifications.forEach((typification) => {
      const node = map.get(typification.id);
      if (typification.parentTypificationId) {
        const parent = map.get(typification.parentTypificationId);
        if (parent) {
          parent.children.push(node);
        }
      } else {
        roots.push(node);
      }
    });
    const sortChildren = (node) => {
      if (node.children.length > 0) {
        node.children.sort((a, b) => {
          const orderA = a.typification.displayOrder || 0;
          const orderB = b.typification.displayOrder || 0;
          return orderA - orderB;
        });
        node.children.forEach((child) => sortChildren(child));
      }
    };
    roots.forEach((root) => sortChildren(root));
    return roots;
  }
};
_TypificationService.\u0275fac = function TypificationService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _TypificationService)(\u0275\u0275inject(HttpClient));
};
_TypificationService.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _TypificationService, factory: _TypificationService.\u0275fac, providedIn: "root" });
var TypificationService = _TypificationService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TypificationService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{ type: HttpClient }], null);
})();

export {
  TypificationService
};
//# sourceMappingURL=chunk-XGOWMJUN.js.map
