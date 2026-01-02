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

// src/app/core/services/admin-monitoring.service.ts
var _AdminMonitoringService = class _AdminMonitoringService {
  constructor(http) {
    this.http = http;
    this.apiUrl = `${environment.gatewayUrl}/admin/monitoring`;
  }
  /**
   * Get all active calls
   */
  getActiveCalls() {
    return this.http.get(`${this.apiUrl}/active-calls`);
  }
  /**
   * Get specific call details
   */
  getCall(callUuid) {
    return this.http.get(`${this.apiUrl}/active-calls/${callUuid}`);
  }
  /**
   * Start SPY mode (Vigía) - Listen only
   */
  startSpyMode(request) {
    return this.http.post(`${this.apiUrl}/spy`, request);
  }
  /**
   * Start WHISPER mode (Susurro) - Speak to agent only
   */
  startWhisperMode(request) {
    return this.http.post(`${this.apiUrl}/whisper`, request);
  }
  /**
   * Start BARGE mode (Tripartita) - Join as full participant
   */
  startBargeMode(request) {
    return this.http.post(`${this.apiUrl}/barge`, request);
  }
  /**
   * Stop monitoring a call
   */
  stopMonitoring(callUuid, adminCallUuid, adminUsername) {
    return this.http.post(`${this.apiUrl}/stop`, {
      callUuid,
      adminCallUuid,
      adminUsername
    });
  }
  /**
   * Get active call count
   */
  getActiveCallCount() {
    return this.http.get(`${this.apiUrl}/stats/active-count`);
  }
  /**
   * Get FreeSWITCH status (for debugging)
   */
  getFreeSwitchStatus() {
    return this.http.get(`${this.apiUrl}/freeswitch/status`);
  }
  /**
   * Get specific active call (alias for getCall)
   */
  getActiveCall(callUuid) {
    return this.getCall(callUuid);
  }
  /**
   * SPY mode - simplified (admin extension 1000)
   */
  spyCall(callUuid) {
    return this.http.post(`${this.apiUrl}/spy`, {
      callUuid,
      adminExtension: "1000",
      adminUsername: "admin"
    });
  }
  /**
   * WHISPER mode - simplified (admin extension 1000)
   */
  whisperCall(callUuid) {
    return this.http.post(`${this.apiUrl}/whisper`, {
      callUuid,
      adminExtension: "1000",
      adminUsername: "admin"
    });
  }
  /**
   * BARGE mode - simplified (admin extension 1000)
   */
  bargeCall(callUuid) {
    return this.http.post(`${this.apiUrl}/barge`, {
      callUuid,
      adminExtension: "1000",
      adminUsername: "admin"
    });
  }
  /**
   * Get SIP extension registrations
   */
  getExtensionRegistrations() {
    return this.http.get(`${this.apiUrl}/extensions/registrations`);
  }
};
_AdminMonitoringService.\u0275fac = function AdminMonitoringService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _AdminMonitoringService)(\u0275\u0275inject(HttpClient));
};
_AdminMonitoringService.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AdminMonitoringService, factory: _AdminMonitoringService.\u0275fac, providedIn: "root" });
var AdminMonitoringService = _AdminMonitoringService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AdminMonitoringService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{ type: HttpClient }], null);
})();

export {
  AdminMonitoringService
};
//# sourceMappingURL=chunk-IBGBXKRK.js.map
