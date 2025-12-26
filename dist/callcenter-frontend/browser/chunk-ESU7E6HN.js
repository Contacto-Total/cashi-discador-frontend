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

// src/app/core/services/agent.service.ts
var _AgentService = class _AgentService {
  constructor(http) {
    this.http = http;
    this.apiUrl = `${environment.gatewayUrl}/agent-status`;
  }
  getAllAgents() {
    return this.http.get(this.apiUrl);
  }
  getAgentStatus(agentId) {
    return this.http.get(`${this.apiUrl}/${agentId}/status`);
  }
  changeAgentStatus(agentId, request) {
    return this.http.post(`${this.apiUrl}/${agentId}/status`, request);
  }
  getAvailableAgents() {
    return this.http.get(`${this.apiUrl}/available`);
  }
};
_AgentService.\u0275fac = function AgentService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _AgentService)(\u0275\u0275inject(HttpClient));
};
_AgentService.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AgentService, factory: _AgentService.\u0275fac, providedIn: "root" });
var AgentService = _AgentService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AgentService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{ type: HttpClient }], null);
})();

export {
  AgentService
};
//# sourceMappingURL=chunk-ESU7E6HN.js.map
