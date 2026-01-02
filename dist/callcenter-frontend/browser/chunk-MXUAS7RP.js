import {
  environment
} from "./chunk-QF774CZR.js";
import {
  HttpClient,
  HttpHeaders,
  Injectable,
  setClassMetadata,
  ɵɵdefineInjectable,
  ɵɵinject
} from "./chunk-CTRHJBBW.js";

// src/app/core/services/campaign-admin.service.ts
var _CampaignAdminService = class _CampaignAdminService {
  constructor(http) {
    this.http = http;
    this.apiUrl = `${environment.gatewayUrl}/campaigns`;
  }
  getHeaders() {
    const token = localStorage.getItem("token");
    return new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": token ? `Bearer ${token}` : ""
    });
  }
  /**
   * Obtiene todas las campañas
   */
  getAllCampaigns() {
    return this.http.get(`${this.apiUrl}/list`, { headers: this.getHeaders() });
  }
  /**
   * Obtiene una campaña por ID con estadísticas
   */
  getCampaignById(id) {
    return this.http.get(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
  /**
   * Crea una nueva campaña
   */
  createCampaign(campaign) {
    return this.http.post(this.apiUrl, campaign, { headers: this.getHeaders() });
  }
  /**
   * Actualiza una campaña
   */
  updateCampaign(id, campaign) {
    return this.http.put(`${this.apiUrl}/${id}`, campaign, { headers: this.getHeaders() });
  }
  /**
   * Elimina una campaña
   */
  deleteCampaign(id) {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
  /**
   * Activa una campaña (inicia discado automático)
   */
  activarCampaign(id) {
    return this.http.post(`${this.apiUrl}/${id}/start`, {}, { headers: this.getHeaders() });
  }
  /**
   * Pausa una campaña
   */
  pausarCampaign(id) {
    return this.http.post(`${this.apiUrl}/${id}/pause`, {}, { headers: this.getHeaders() });
  }
  /**
   * Detiene una campaña completamente
   */
  detenerCampaign(id) {
    return this.http.post(`${this.apiUrl}/${id}/detener`, {}, { headers: this.getHeaders() });
  }
  /**
   * Inicia el discado automático para una campaña específica
   */
  startDialing(id) {
    return this.http.post(`${this.apiUrl}/${id}/start-dialing`, {}, { headers: this.getHeaders() });
  }
  /**
   * Detiene el discado automático para una campaña específica
   */
  stopDialing(id) {
    return this.http.post(`${this.apiUrl}/${id}/stop-dialing`, {}, { headers: this.getHeaders() });
  }
  /**
   * Importa contactos desde cashi_db.clientes (ya no usa límite)
   */
  importarContactos(id) {
    return this.http.post(`${this.apiUrl}/${id}/importar-contactos`, {}, { headers: this.getHeaders() });
  }
  /**
   * Obtiene estadísticas de importación disponibles para una campaña
   */
  getImportStats(id) {
    return this.http.get(`${this.apiUrl}/${id}/import-stats`, { headers: this.getHeaders() });
  }
  /**
   * Helper para obtener el color según el estado
   */
  getStatusColor(status) {
    const colors = {
      "DRAFT": "#6B7280",
      "ACTIVE": "#10B981",
      "PAUSED": "#F59E0B",
      "COMPLETED": "#3B82F6"
    };
    return colors[status] || "#6B7280";
  }
  /**
   * Helper para obtener el texto del estado
   */
  getStatusText(status) {
    const texts = {
      "DRAFT": "Borrador",
      "ACTIVE": "Activa",
      "PAUSED": "Pausada",
      "COMPLETED": "Completada"
    };
    return texts[status] || status;
  }
  /**
   * Obtiene estadísticas detalladas de una campaña
   */
  getCampaignStatistics(id) {
    return this.http.get(`${environment.gatewayUrl}/admin/campaigns/${id}/statistics`, { headers: this.getHeaders() });
  }
  /**
   * Obtiene el historial de llamadas de una campaña con paginación y búsqueda
   */
  getCampaignCalls(id, page = 0, size = 10, search) {
    let url = `${environment.gatewayUrl}/admin/campaigns/${id}/calls?page=${page}&size=${size}`;
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }
    return this.http.get(url, { headers: this.getHeaders() });
  }
  // ========================================
  // FILTROS DE CAMPAÑA
  // ========================================
  /**
   * Obtiene los campos numéricos disponibles para filtrar según la subcartera
   */
  getFilterableFieldsBySubcartera(subcarteraId) {
    return this.http.get(`${this.apiUrl}/filterable-fields/by-subcartera/${subcarteraId}`, { headers: this.getHeaders() });
  }
  /**
   * Obtiene los campos numéricos disponibles para filtrar según la campaña
   */
  getFilterableFields(campaignId) {
    return this.http.get(`${this.apiUrl}/${campaignId}/filterable-fields`, { headers: this.getHeaders() });
  }
  /**
   * Obtiene los filtros actuales de una campaña
   */
  getCampaignFilters(campaignId) {
    return this.http.get(`${this.apiUrl}/${campaignId}/filters`, { headers: this.getHeaders() });
  }
  /**
   * Guarda filtros para una campaña (reemplaza los existentes)
   */
  saveCampaignFilters(campaignId, filters) {
    return this.http.post(`${this.apiUrl}/${campaignId}/filters`, filters, { headers: this.getHeaders() });
  }
  /**
   * Elimina todos los filtros de una campaña
   */
  deleteAllFilters(campaignId) {
    return this.http.delete(`${this.apiUrl}/${campaignId}/filters`, { headers: this.getHeaders() });
  }
};
_CampaignAdminService.\u0275fac = function CampaignAdminService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _CampaignAdminService)(\u0275\u0275inject(HttpClient));
};
_CampaignAdminService.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _CampaignAdminService, factory: _CampaignAdminService.\u0275fac, providedIn: "root" });
var CampaignAdminService = _CampaignAdminService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CampaignAdminService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{ type: HttpClient }], null);
})();

export {
  CampaignAdminService
};
//# sourceMappingURL=chunk-MXUAS7RP.js.map
