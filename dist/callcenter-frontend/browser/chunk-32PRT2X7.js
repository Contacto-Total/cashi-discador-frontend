import {
  environment
} from "./chunk-QF774CZR.js";
import {
  HttpClient,
  HttpHeaders,
  Injectable,
  interval,
  setClassMetadata,
  startWith,
  switchMap,
  ɵɵdefineInjectable,
  ɵɵinject
} from "./chunk-CTRHJBBW.js";

// src/app/core/services/autodialer.service.ts
var _AutoDialerService = class _AutoDialerService {
  constructor(http) {
    this.http = http;
    this.apiUrl = `${environment.gatewayUrl}/admin/autodialer`;
  }
  getHeaders() {
    const token = localStorage.getItem("token");
    return new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": token ? `Bearer ${token}` : ""
    });
  }
  /**
   * Activa el auto-dialer
   */
  activar(usuario = "admin", notas = "Activaci\xF3n desde panel") {
    return this.http.post(`${this.apiUrl}/activar`, { usuario, notas }, { headers: this.getHeaders() });
  }
  /**
   * Desactiva el auto-dialer
   */
  desactivar(notas = "Desactivaci\xF3n desde panel") {
    return this.http.post(`${this.apiUrl}/desactivar`, { notas }, { headers: this.getHeaders() });
  }
  /**
   * Toggle (activar/desactivar) el auto-dialer
   */
  toggle(usuario = "admin") {
    return this.http.post(`${this.apiUrl}/toggle`, { usuario }, { headers: this.getHeaders() });
  }
  /**
   * Obtiene el estado actual del auto-dialer
   */
  getEstado() {
    return this.http.get(`${this.apiUrl}/estado`, { headers: this.getHeaders() });
  }
  /**
   * Obtiene estadísticas en tiempo real
   * @param campaignId ID de campaña para filtrar (opcional)
   */
  getEstadisticas(campaignId) {
    const url = campaignId ? `${this.apiUrl}/estadisticas?campaignId=${campaignId}` : `${this.apiUrl}/estadisticas`;
    return this.http.get(url, { headers: this.getHeaders() });
  }
  /**
   * Health check del servicio
   */
  healthCheck() {
    return this.http.get(`${this.apiUrl}/health`, { headers: this.getHeaders() });
  }
  /**
   * Inicia polling de estadísticas cada 5 segundos
   * @param campaignId ID de campaña para filtrar (opcional)
   */
  startStatsPolling(campaignId) {
    return interval(5e3).pipe(startWith(0), switchMap(() => this.getEstadisticas(campaignId)));
  }
  /**
   * Obtiene lista de agentes para monitoreo en tiempo real
   */
  getAgentesMonitoreo() {
    return this.http.get(`${this.apiUrl}/agentes-monitoreo`, { headers: this.getHeaders() });
  }
  /**
   * Inicia polling de agentes cada 3 segundos
   */
  startAgentesPolling() {
    return interval(3e3).pipe(startWith(0), switchMap(() => this.getAgentesMonitoreo()));
  }
  /**
   * Obtiene todas las llamadas en tiempo real (MARCANDO, CONECTADA, EN_CURSO)
   */
  getLlamadasEnTiempoReal() {
    return this.http.get(`${this.apiUrl}/llamadas-tiempo-real`, { headers: this.getHeaders() });
  }
  /**
   * Obtiene llamadas en tiempo real filtradas por campaña
   */
  getLlamadasEnTiempoRealByCampaign(campaignId) {
    return this.http.get(`${this.apiUrl}/llamadas-tiempo-real/${campaignId}`, { headers: this.getHeaders() });
  }
  /**
   * Inicia polling de llamadas en tiempo real cada 2 segundos
   * Si se proporciona campaignId, filtra por esa campaña
   */
  startLlamadasPolling(campaignId) {
    return interval(2e3).pipe(startWith(0), switchMap(() => campaignId ? this.getLlamadasEnTiempoRealByCampaign(campaignId) : this.getLlamadasEnTiempoReal()));
  }
  /**
   * Obtiene la configuración actual del autodialer
   */
  getConfiguracion() {
    return this.http.get(`${this.apiUrl}/configuracion`, { headers: this.getHeaders() });
  }
  /**
   * Actualiza la configuración del autodialer
   */
  updateConfiguracion(config) {
    return this.http.put(`${this.apiUrl}/configuracion`, config, { headers: this.getHeaders() });
  }
};
_AutoDialerService.\u0275fac = function AutoDialerService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _AutoDialerService)(\u0275\u0275inject(HttpClient));
};
_AutoDialerService.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AutoDialerService, factory: _AutoDialerService.\u0275fac, providedIn: "root" });
var AutoDialerService = _AutoDialerService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AutoDialerService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{ type: HttpClient }], null);
})();

export {
  AutoDialerService
};
//# sourceMappingURL=chunk-32PRT2X7.js.map
