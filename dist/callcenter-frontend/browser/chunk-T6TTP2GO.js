import {
  environment
} from "./chunk-QF774CZR.js";
import {
  BehaviorSubject,
  HttpClient,
  Injectable,
  interval,
  setClassMetadata,
  startWith,
  switchMap,
  tap,
  ɵɵdefineInjectable,
  ɵɵinject
} from "./chunk-CTRHJBBW.js";

// src/app/core/services/agent-status.service.ts
var _AgentStatusService = class _AgentStatusService {
  constructor(http) {
    this.http = http;
    this.apiUrl = `${environment.gatewayUrl}/agent-status`;
    this.currentStatusSubject = new BehaviorSubject(null);
    this.currentStatus$ = this.currentStatusSubject.asObservable();
  }
  /**
   * Obtiene el estado actual de un agente
   */
  getAgentStatus(idUsuario) {
    return this.http.get(`${this.apiUrl}/${idUsuario}`).pipe(tap((response) => {
      const status = {
        idUsuario: response.idUsuario,
        estadoActual: response.estadoActual,
        estadoAnterior: response.estadoAnterior,
        timestampCambio: response.timestampCambio,
        tiempoEnEstadoMinutos: response.tiempoEnEstadoMinutos,
        notas: response.notas,
        sessionId: response.sessionId,
        // Campos de umbral de tiempo
        segundosEnEstado: response.segundosEnEstado,
        colorIndicador: response.colorIndicador,
        porcentajeTiempo: response.porcentajeTiempo,
        excedeTiempoMaximo: response.excedeTiempoMaximo,
        tiempoMaximoSegundos: response.tiempoMaximoSegundos
      };
      this.currentStatusSubject.next(status);
    }));
  }
  /**
   * Cambia el estado de un agente manualmente
   */
  changeStatus(idUsuario, request) {
    return this.http.post(`${this.apiUrl}/${idUsuario}/cambiar-estado`, request).pipe(tap(() => {
      this.getAgentStatus(idUsuario).subscribe();
    }));
  }
  /**
   * Entra en modo manual
   */
  enterManualMode(idUsuario) {
    return this.http.post(`${this.apiUrl}/${idUsuario}/modo-manual/entrar`, {}).pipe(tap(() => {
      this.getAgentStatus(idUsuario).subscribe();
    }));
  }
  /**
   * Sale de modo manual
   */
  exitManualMode(idUsuario) {
    return this.http.post(`${this.apiUrl}/${idUsuario}/modo-manual/salir`, {}).pipe(tap(() => {
      this.getAgentStatus(idUsuario).subscribe();
    }));
  }
  /**
   * Obtiene los estados disponibles
   */
  getAvailableStates() {
    return this.http.get(`${this.apiUrl}/estados-disponibles`);
  }
  /**
   * Verifica si un agente está disponible para llamadas
   */
  isAvailableForCalls(idUsuario) {
    return this.http.get(`${this.apiUrl}/${idUsuario}/disponible-para-llamadas`);
  }
  /**
   * Inicia el polling automático del estado del agente cada 10 segundos
   * para mantener actualizado el indicador de umbral de tiempo
   */
  startStatusPolling(idUsuario) {
    return interval(1e4).pipe(startWith(0), switchMap(() => this.getAgentStatus(idUsuario)));
  }
  /**
   * Limpia el estado actual
   */
  clearCurrentStatus() {
    this.currentStatusSubject.next(null);
  }
  /**
   * Desconecta al agente (elimina su estado en el backend)
   * Llamar al hacer logout para que el monitoreo muestre al agente como desconectado
   */
  disconnectAgent(idUsuario) {
    return this.http.delete(`${this.apiUrl}/${idUsuario}`).pipe(tap(() => {
      console.log(`[AgentStatusService] Agente ${idUsuario} marcado como desconectado`);
      this.currentStatusSubject.next(null);
    }));
  }
  /**
   * Obtiene el estado actual sin hacer una nueva petición
   */
  getCurrentStatus() {
    return this.currentStatusSubject.value;
  }
  /**
   * Finaliza la tipificación y cambia a DISPONIBLE
   * Se llama después de guardar la gestión
   */
  finalizarTipificacion(idUsuario) {
    return this.http.post(`${this.apiUrl}/${idUsuario}/sistema/finalizar-tipificacion`, {}).pipe(tap(() => {
      console.log(`[AgentStatusService] Tipificaci\xF3n finalizada para agente ${idUsuario}`);
      this.getAgentStatus(idUsuario).subscribe();
    }));
  }
};
_AgentStatusService.\u0275fac = function AgentStatusService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _AgentStatusService)(\u0275\u0275inject(HttpClient));
};
_AgentStatusService.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AgentStatusService, factory: _AgentStatusService.\u0275fac, providedIn: "root" });
var AgentStatusService = _AgentStatusService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AgentStatusService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{ type: HttpClient }], null);
})();

export {
  AgentStatusService
};
//# sourceMappingURL=chunk-T6TTP2GO.js.map
