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

// src/app/maintenance/services/header-configuration.service.ts
var _HeaderConfigurationService = class _HeaderConfigurationService {
  constructor(http) {
    this.http = http;
    this.baseUrl = `${environment.tipificacionUrl}/system-config/header-configurations`;
  }
  /**
   * Obtiene todas las configuraciones de cabeceras de una subcartera
   */
  getBySubPortfolio(subPortfolioId) {
    return this.http.get(`${this.baseUrl}/subportfolio/${subPortfolioId}`);
  }
  /**
   * Obtiene todas las configuraciones de cabeceras de una subcartera filtradas por tipo de carga
   */
  getBySubPortfolioAndLoadType(subPortfolioId, loadType) {
    return this.http.get(`${this.baseUrl}/subportfolio/${subPortfolioId}/load-type/${loadType}`);
  }
  /**
   * Obtiene una configuración específica por ID
   */
  getById(id) {
    return this.http.get(`${this.baseUrl}/${id}`);
  }
  /**
   * Crea una nueva configuración de cabecera
   */
  create(request) {
    return this.http.post(this.baseUrl, request);
  }
  /**
   * Crea múltiples configuraciones en lote (para importar CSV)
   */
  createBulk(request) {
    return this.http.post(`${this.baseUrl}/bulk`, request);
  }
  /**
   * Actualiza una configuración existente
   */
  update(id, request) {
    return this.http.put(`${this.baseUrl}/${id}`, request);
  }
  /**
   * Elimina una configuración
   */
  delete(id) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
  /**
   * Elimina todas las configuraciones de una subcartera y tipo de carga específicos
   */
  deleteAllBySubPortfolioAndLoadType(subPortfolioId, loadType) {
    return this.http.delete(`${this.baseUrl}/subportfolio/${subPortfolioId}/load-type/${loadType}`);
  }
  /**
   * Cuenta cuántas configuraciones tiene una subcartera
   */
  countBySubPortfolio(subPortfolioId) {
    return this.http.get(`${this.baseUrl}/subportfolio/${subPortfolioId}/count`);
  }
  /**
   * Importa datos masivos a la tabla dinámica de una subcartera
   */
  importData(subPortfolioId, loadType, data) {
    return this.http.post(`${this.baseUrl}/subportfolio/${subPortfolioId}/import-data`, {
      subPortfolioId,
      loadType,
      data
    });
  }
};
_HeaderConfigurationService.\u0275fac = function HeaderConfigurationService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _HeaderConfigurationService)(\u0275\u0275inject(HttpClient));
};
_HeaderConfigurationService.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _HeaderConfigurationService, factory: _HeaderConfigurationService.\u0275fac, providedIn: "root" });
var HeaderConfigurationService = _HeaderConfigurationService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(HeaderConfigurationService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{ type: HttpClient }], null);
})();

export {
  HeaderConfigurationService
};
//# sourceMappingURL=chunk-A2MX5XEA.js.map
