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

// src/app/core/services/contact.service.ts
var _ContactService = class _ContactService {
  constructor(http) {
    this.http = http;
    this.apiUrl = `${environment.apiUrl}/contacts`;
  }
  getAllContacts(filters) {
    let params = new HttpParams();
    if (filters) {
      if (filters.campaignId)
        params = params.set("campaignId", filters.campaignId.toString());
      if (filters.status)
        params = params.set("status", filters.status);
      if (filters.search)
        params = params.set("search", filters.search);
      if (filters.page)
        params = params.set("page", filters.page.toString());
      if (filters.size)
        params = params.set("size", filters.size.toString());
    }
    return this.http.get(this.apiUrl, { params });
  }
  getContactById(id) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
  createContact(contact) {
    return this.http.post(this.apiUrl, contact);
  }
  updateContact(id, contact) {
    return this.http.put(`${this.apiUrl}/${id}`, contact);
  }
  deleteContact(id) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  getContactsByCampaign(campaignId, page, size) {
    let params = new HttpParams();
    if (page !== void 0)
      params = params.set("page", page.toString());
    if (size !== void 0)
      params = params.set("size", size.toString());
    return this.http.get(`${this.apiUrl}/campaign/${campaignId}`, { params });
  }
  importContacts(campaignId, file, mapping) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("campaignId", campaignId.toString());
    formData.append("mapping", JSON.stringify(mapping));
    return this.http.post(`${this.apiUrl}/import`, formData);
  }
  getNextContact(campaignId, agentId) {
    return this.http.get(`${this.apiUrl}/next?campaignId=${campaignId}&agentId=${agentId}`);
  }
  /**
   * Obtiene la llamada activa de un agente desde el auto-dialer (por ID de agente)
   */
  getActiveCall(agentId) {
    return this.http.get(`${environment.apiUrl}/autodialer/active-call/${agentId}`);
  }
  /**
   * Obtiene la llamada activa de un agente por su extensión SIP
   * Este método busca por anexo_destino en lugar de id_agente
   */
  getActiveCallByExtension(sipExtension) {
    return this.http.get(`${environment.apiUrl}/autodialer/active-call/extension/${sipExtension}`);
  }
  /**
   * Obtiene los datos completos del cliente para la pantalla de tipificación
   */
  getClienteDetalle(contactId) {
    return this.http.get(`${this.apiUrl}/${contactId}/cliente-detalle`);
  }
};
_ContactService.\u0275fac = function ContactService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _ContactService)(\u0275\u0275inject(HttpClient));
};
_ContactService.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ContactService, factory: _ContactService.\u0275fac, providedIn: "root" });
var ContactService = _ContactService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ContactService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{ type: HttpClient }], null);
})();

export {
  ContactService
};
//# sourceMappingURL=chunk-DLUNS3KN.js.map
