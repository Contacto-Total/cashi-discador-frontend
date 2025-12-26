import {
  AgentStatusService
} from "./chunk-T6TTP2GO.js";
import {
  AGENT_STATE_LABELS,
  AgentState,
  MANUAL_STATES
} from "./chunk-GI66PYSZ.js";
import {
  AuthService
} from "./chunk-55FOSRV6.js";
import {
  Router
} from "./chunk-OCZLH7K5.js";
import "./chunk-ZQICQP3Y.js";
import {
  LucideAngularComponent,
  LucideAngularModule
} from "./chunk-RFBUEVFE.js";
import "./chunk-QF774CZR.js";
import {
  CommonModule,
  Component,
  NgForOf,
  NgIf,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵdefineComponent,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-CTRHJBBW.js";

// src/app/features/agent-dashboard/agent-status-dashboard.component.ts
function AgentStatusDashboardComponent_div_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 10);
    \u0275\u0275element(1, "div", 11);
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3, "Cargando estado...");
    \u0275\u0275elementEnd()();
  }
}
function AgentStatusDashboardComponent_div_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 12)(1, "p");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "button", 13);
    \u0275\u0275listener("click", function AgentStatusDashboardComponent_div_13_Template_button_click_3_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.loadAgentStatus((ctx_r1.currentStatus == null ? null : ctx_r1.currentStatus.idUsuario) || 0));
    });
    \u0275\u0275text(4, " Reintentar ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.error);
  }
}
function AgentStatusDashboardComponent_div_14_button_32_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 31);
    \u0275\u0275listener("click", function AgentStatusDashboardComponent_div_14_button_32_Template_button_click_0_listener() {
      const state_r5 = \u0275\u0275restoreView(_r4).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.changeStatus(state_r5));
    });
    \u0275\u0275element(1, "div", 32);
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const state_r5 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275styleProp("border-color", ctx_r1.getStateColor(state_r5));
    \u0275\u0275classProp("active", ctx_r1.isCurrentState(state_r5))("disabled", !ctx_r1.canChangeToState(state_r5) || ctx_r1.loading);
    \u0275\u0275property("disabled", !ctx_r1.canChangeToState(state_r5) || ctx_r1.loading);
    \u0275\u0275advance();
    \u0275\u0275styleProp("background-color", ctx_r1.getStateColor(state_r5));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.stateLabels[state_r5]);
  }
}
function AgentStatusDashboardComponent_div_14_p_43_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 33);
    \u0275\u0275text(1, " Est\xE1s en modo manual. Ve al softphone para hacer llamadas. ");
    \u0275\u0275elementEnd();
  }
}
function AgentStatusDashboardComponent_div_14_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 14)(1, "div", 15)(2, "div", 16)(3, "h2");
    \u0275\u0275text(4, "Estado Actual");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 17)(6, "div", 18);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(8, "div", 19)(9, "h3");
    \u0275\u0275element(10, "lucide-angular", 20);
    \u0275\u0275text(11, " Informaci\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "ul")(13, "li")(14, "strong");
    \u0275\u0275text(15, "Disponible:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(16, " Recibir\xE1s llamadas autom\xE1ticas");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "li")(18, "strong");
    \u0275\u0275text(19, "En Reuni\xF3n/Refrigerio/Ba\xF1o:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(20, " No recibir\xE1s llamadas");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "li")(22, "strong");
    \u0275\u0275text(23, "Modo Manual:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(24, " Puedes llamar, pero no recibes autom\xE1ticas");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(25, "div", 21)(26, "div", 22)(27, "h2");
    \u0275\u0275text(28, "Cambiar Estado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "p", 23);
    \u0275\u0275text(30, "Selecciona tu estado actual");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "div", 24);
    \u0275\u0275template(32, AgentStatusDashboardComponent_div_14_button_32_Template, 4, 10, "button", 25);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(33, "div", 26)(34, "h2");
    \u0275\u0275text(35, "Llamadas Manuales");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(36, "p", 23);
    \u0275\u0275text(37, "Inicia el modo manual para realizar llamadas");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(38, "button", 27);
    \u0275\u0275listener("click", function AgentStatusDashboardComponent_div_14_Template_button_click_38_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.enterManualMode());
    });
    \u0275\u0275elementStart(39, "span", 28);
    \u0275\u0275element(40, "lucide-angular", 29);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(41, "span");
    \u0275\u0275text(42, "LLAMAR MANUAL");
    \u0275\u0275elementEnd()();
    \u0275\u0275template(43, AgentStatusDashboardComponent_div_14_p_43_Template, 2, 0, "p", 30);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275styleProp("background-color", ctx_r1.getStateColor(ctx_r1.currentStatus.estadoActual));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.stateLabels[ctx_r1.currentStatus.estadoActual], " ");
    \u0275\u0275advance(3);
    \u0275\u0275property("size", 20);
    \u0275\u0275advance(22);
    \u0275\u0275property("ngForOf", ctx_r1.manualStates);
    \u0275\u0275advance(6);
    \u0275\u0275property("disabled", ctx_r1.loading || ctx_r1.currentStatus.estadoActual === ctx_r1.AgentState.EN_LLAMADA || ctx_r1.currentStatus.estadoActual === ctx_r1.AgentState.TIPIFICANDO);
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 20);
    \u0275\u0275advance(3);
    \u0275\u0275property("ngIf", ctx_r1.currentStatus.estadoActual === ctx_r1.AgentState.EN_MANUAL);
  }
}
var _AgentStatusDashboardComponent = class _AgentStatusDashboardComponent {
  constructor(agentStatusService, authService, router) {
    this.agentStatusService = agentStatusService;
    this.authService = authService;
    this.router = router;
    this.currentStatus = null;
    this.agentName = "";
    this.loading = false;
    this.error = null;
    this.AgentState = AgentState;
    this.stateLabels = AGENT_STATE_LABELS;
    this.manualStates = MANUAL_STATES;
  }
  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.router.navigate(["/login"]);
      return;
    }
    this.agentName = user.firstName + " " + user.lastName || user.username;
    this.loadAgentStatus(user.id);
    this.statusSubscription = this.agentStatusService.startStatusPolling(user.id).subscribe();
  }
  ngOnDestroy() {
    if (this.statusSubscription) {
      this.statusSubscription.unsubscribe();
    }
  }
  loadAgentStatus(userId) {
    this.loading = true;
    this.error = null;
    this.agentStatusService.getAgentStatus(userId).subscribe({
      next: (response) => {
        this.currentStatus = {
          idUsuario: response.idUsuario,
          estadoActual: response.estadoActual,
          estadoAnterior: response.estadoAnterior,
          timestampCambio: response.timestampCambio,
          tiempoEnEstadoMinutos: response.tiempoEnEstadoMinutos,
          notas: response.notas,
          sessionId: response.sessionId
        };
        this.loading = false;
      },
      error: (err) => {
        console.error("Error loading agent status:", err);
        this.error = "Error al cargar el estado del agente";
        this.loading = false;
      }
    });
    this.agentStatusService.currentStatus$.subscribe((status) => {
      if (status) {
        this.currentStatus = status;
      }
    });
  }
  changeStatus(newState) {
    if (!this.currentStatus || this.loading)
      return;
    this.loading = true;
    this.error = null;
    this.agentStatusService.changeStatus(this.currentStatus.idUsuario, {
      estado: newState,
      notas: `Cambio manual a ${this.stateLabels[newState]}`
    }).subscribe({
      next: () => {
        this.loading = false;
      },
      error: (err) => {
        console.error("Error changing status:", err);
        this.error = "Error al cambiar el estado";
        this.loading = false;
      }
    });
  }
  enterManualMode() {
    if (!this.currentStatus || this.loading)
      return;
    this.loading = true;
    this.error = null;
    this.agentStatusService.enterManualMode(this.currentStatus.idUsuario).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(["/dialer"]);
      },
      error: (err) => {
        console.error("Error entering manual mode:", err);
        this.error = "Error al entrar en modo manual";
        this.loading = false;
      }
    });
  }
  getStateColor(state) {
    const colors = {
      [AgentState.DISPONIBLE]: "#4caf50",
      [AgentState.EN_REUNION]: "#ff9800",
      [AgentState.REFRIGERIO]: "#2196f3",
      [AgentState.SSHH]: "#9c27b0",
      [AgentState.EN_LLAMADA]: "#f44336",
      [AgentState.TIPIFICANDO]: "#ff5722",
      [AgentState.EN_MANUAL]: "#607d8b"
    };
    return colors[state] || "#757575";
  }
  isCurrentState(state) {
    return this.currentStatus?.estadoActual === state;
  }
  canChangeToState(state) {
    if (this.currentStatus?.estadoActual === AgentState.EN_LLAMADA || this.currentStatus?.estadoActual === AgentState.TIPIFICANDO) {
      return false;
    }
    return this.manualStates.includes(state);
  }
  logout() {
    this.authService.logout();
    this.router.navigate(["/login"]);
  }
};
_AgentStatusDashboardComponent.\u0275fac = function AgentStatusDashboardComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _AgentStatusDashboardComponent)(\u0275\u0275directiveInject(AgentStatusService), \u0275\u0275directiveInject(AuthService), \u0275\u0275directiveInject(Router));
};
_AgentStatusDashboardComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AgentStatusDashboardComponent, selectors: [["app-agent-status-dashboard"]], decls: 15, vars: 4, consts: [[1, "dashboard-container"], [1, "dashboard-header"], [1, "header-content"], [1, "agent-info"], [1, "agent-name"], [1, "logout-btn", 3, "click"], [1, "dashboard-main"], ["class", "loading-state", 4, "ngIf"], ["class", "error-state", 4, "ngIf"], ["class", "status-dashboard", 4, "ngIf"], [1, "loading-state"], [1, "spinner"], [1, "error-state"], [3, "click"], [1, "status-dashboard"], [1, "left-column"], [1, "status-card"], [1, "current-status"], [1, "status-badge"], [1, "info-card"], ["name", "info", 3, "size"], [1, "right-column"], [1, "change-status-section"], [1, "section-subtitle"], [1, "status-buttons"], ["class", "status-btn", 3, "active", "disabled", "border-color", "click", 4, "ngFor", "ngForOf"], [1, "manual-calling-section"], [1, "manual-call-btn", 3, "click", "disabled"], [1, "btn-icon"], ["name", "phone-call", 3, "size"], ["class", "manual-call-note", 4, "ngIf"], [1, "status-btn", 3, "click", "disabled"], [1, "status-btn-icon"], [1, "manual-call-note"]], template: function AgentStatusDashboardComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "h1");
    \u0275\u0275text(4, "Panel de Asesor");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 3)(6, "span", 4);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "button", 5);
    \u0275\u0275listener("click", function AgentStatusDashboardComponent_Template_button_click_8_listener() {
      return ctx.logout();
    });
    \u0275\u0275elementStart(9, "span");
    \u0275\u0275text(10, "Cerrar Sesi\xF3n");
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275elementStart(11, "div", 6);
    \u0275\u0275template(12, AgentStatusDashboardComponent_div_12_Template, 4, 0, "div", 7)(13, AgentStatusDashboardComponent_div_13_Template, 5, 1, "div", 8)(14, AgentStatusDashboardComponent_div_14_Template, 44, 8, "div", 9);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(ctx.agentName);
    \u0275\u0275advance(5);
    \u0275\u0275property("ngIf", ctx.loading && !ctx.currentStatus);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.error);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.currentStatus && !ctx.loading);
  }
}, dependencies: [CommonModule, NgForOf, NgIf, LucideAngularModule, LucideAngularComponent], styles: ["\n\n.dashboard-container[_ngcontent-%COMP%] {\n  min-height: 100vh;\n  background:\n    linear-gradient(\n      to bottom right,\n      #0f172a,\n      #1e293b,\n      #0f172a);\n  display: flex;\n  flex-direction: column;\n}\n.dashboard-header[_ngcontent-%COMP%] {\n  background: #1E293B;\n  border-bottom: 1px solid #334155;\n  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);\n  padding: 0.8rem 1.5rem;\n}\n.header-content[_ngcontent-%COMP%] {\n  max-width: 900px;\n  margin: 0 auto;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n.dashboard-header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 1.3rem;\n  color: #ffffff;\n  font-weight: 600;\n}\n.agent-info[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 1rem;\n}\n.agent-name[_ngcontent-%COMP%] {\n  font-size: 1rem;\n  color: #94a3b8;\n  font-weight: 500;\n}\n.logout-btn[_ngcontent-%COMP%] {\n  display: none;\n  background: #ef4444;\n  color: white;\n  border: none;\n  padding: 0.6rem 1.2rem;\n  border-radius: 6px;\n  cursor: pointer;\n  font-size: 0.9rem;\n  font-weight: 500;\n  transition: background 0.3s;\n}\n.logout-btn[_ngcontent-%COMP%]:hover {\n  background: #dc2626;\n}\n.dashboard-main[_ngcontent-%COMP%] {\n  flex: 1;\n  padding: 1rem;\n  max-width: 1400px;\n  width: 100%;\n  margin: 0 auto;\n}\n.loading-state[_ngcontent-%COMP%] {\n  text-align: center;\n  padding: 4rem 2rem;\n  color: #94a3b8;\n}\n.spinner[_ngcontent-%COMP%] {\n  width: 50px;\n  height: 50px;\n  border: 4px solid #334155;\n  border-top-color: #10B981;\n  border-radius: 50%;\n  animation: _ngcontent-%COMP%_spin 1s linear infinite;\n  margin: 0 auto 1rem;\n}\n@keyframes _ngcontent-%COMP%_spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n.error-state[_ngcontent-%COMP%] {\n  background: rgba(239, 68, 68, 0.15);\n  color: #ef4444;\n  padding: 2rem;\n  border-radius: 8px;\n  border: 1px solid rgba(239, 68, 68, 0.3);\n  text-align: center;\n}\n.error-state[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  margin-top: 1rem;\n  background: #10B981;\n  color: white;\n  border: none;\n  padding: 0.6rem 1.5rem;\n  border-radius: 6px;\n  cursor: pointer;\n  font-weight: 500;\n  transition: background 0.3s;\n}\n.error-state[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:hover {\n  background: #059669;\n}\n.status-dashboard[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 350px 1fr;\n  gap: 1rem;\n  align-items: start;\n}\n.left-column[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n}\n.right-column[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n}\n.status-card[_ngcontent-%COMP%] {\n  background: #1E293B;\n  border: 1px solid #334155;\n  border-radius: 8px;\n  padding: 1.2rem;\n  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);\n}\n.status-card[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin: 0 0 1rem 0;\n  font-size: 1rem;\n  color: #ffffff;\n}\n.current-status[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 0;\n}\n.status-badge[_ngcontent-%COMP%] {\n  display: inline-block;\n  padding: 0.6rem 2rem;\n  border-radius: 50px;\n  color: white;\n  font-size: 1.1rem;\n  font-weight: 600;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);\n}\n.change-status-section[_ngcontent-%COMP%] {\n  background: #1E293B;\n  border: 1px solid #334155;\n  border-radius: 8px;\n  padding: 1.2rem;\n  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);\n}\n.change-status-section[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin: 0 0 0.3rem 0;\n  font-size: 1rem;\n  color: #ffffff;\n}\n.section-subtitle[_ngcontent-%COMP%] {\n  margin: 0 0 1rem 0;\n  color: #94a3b8;\n  font-size: 0.85rem;\n}\n.status-buttons[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));\n  gap: 0.7rem;\n}\n.status-btn[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.7rem;\n  background: #0A0E27;\n  border: 2px solid #334155;\n  padding: 0.7rem 1rem;\n  border-radius: 8px;\n  cursor: pointer;\n  font-size: 0.9rem;\n  font-weight: 500;\n  color: #94a3b8;\n  transition: all 0.3s;\n}\n.status-btn[_ngcontent-%COMP%]:hover:not(.disabled) {\n  transform: translateY(-2px);\n  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);\n  background: rgba(16, 185, 129, 0.1);\n  color: #10B981;\n}\n.status-btn.active[_ngcontent-%COMP%] {\n  border-width: 2px;\n  background: rgba(16, 185, 129, 0.15);\n  color: #10B981;\n  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);\n}\n.status-btn.disabled[_ngcontent-%COMP%] {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n.status-btn-icon[_ngcontent-%COMP%] {\n  width: 20px;\n  height: 20px;\n  border-radius: 50%;\n}\n.manual-calling-section[_ngcontent-%COMP%] {\n  background: #1E293B;\n  border: 1px solid #334155;\n  border-radius: 8px;\n  padding: 1.2rem;\n  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);\n}\n.manual-calling-section[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin: 0 0 0.3rem 0;\n  font-size: 1rem;\n  color: #ffffff;\n}\n.manual-call-btn[_ngcontent-%COMP%] {\n  width: 100%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.5rem;\n  background: #10B981;\n  color: white;\n  border: none;\n  padding: 0.7rem 1.2rem;\n  border-radius: 8px;\n  cursor: pointer;\n  font-size: 0.9rem;\n  font-weight: 600;\n  margin-top: 0.7rem;\n  transition: all 0.3s;\n}\n.manual-call-btn[_ngcontent-%COMP%]:hover:not(:disabled) {\n  transform: translateY(-2px);\n  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);\n  background: #059669;\n}\n.manual-call-btn[_ngcontent-%COMP%]:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n.btn-icon[_ngcontent-%COMP%] {\n  font-size: 1.2rem;\n}\n.manual-call-note[_ngcontent-%COMP%] {\n  margin-top: 0.7rem;\n  padding: 0.7rem;\n  background: rgba(16, 185, 129, 0.1);\n  border-left: 4px solid #10B981;\n  border-radius: 4px;\n  color: #10B981;\n  font-weight: 500;\n  font-size: 0.85rem;\n}\n.info-card[_ngcontent-%COMP%] {\n  background: #1E293B;\n  border: 1px solid #334155;\n  border-radius: 8px;\n  padding: 1.2rem;\n  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);\n}\n.info-card[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  margin: 0 0 0.7rem 0;\n  font-size: 0.95rem;\n  color: #ffffff;\n}\n.info-card[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%] {\n  list-style: none;\n  padding: 0;\n  margin: 0;\n}\n.info-card[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  padding: 0.4rem 0;\n  color: #94a3b8;\n  font-size: 0.85rem;\n}\n.info-card[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #10B981;\n}\n@media (max-width: 1024px) {\n  .status-dashboard[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .left-column[_ngcontent-%COMP%] {\n    max-width: 100%;\n  }\n}\n@media (max-width: 768px) {\n  .dashboard-header[_ngcontent-%COMP%] {\n    padding: 1rem;\n  }\n  .header-content[_ngcontent-%COMP%] {\n    flex-direction: column;\n    gap: 1rem;\n    text-align: center;\n  }\n  .dashboard-main[_ngcontent-%COMP%] {\n    padding: 1rem;\n  }\n  .status-buttons[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .status-badge[_ngcontent-%COMP%] {\n    font-size: 1rem;\n    padding: 0.6rem 1.5rem;\n  }\n}\nbody.light-theme[_nghost-%COMP%]   .dashboard-container[_ngcontent-%COMP%], body.light-theme   [_nghost-%COMP%]   .dashboard-container[_ngcontent-%COMP%], \nhtml:not(.dark)[_nghost-%COMP%]   .dashboard-container[_ngcontent-%COMP%], html:not(.dark)   [_nghost-%COMP%]   .dashboard-container[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      to bottom right,\n      #f8fafc,\n      #f1f5f9,\n      #f8fafc);\n}\nbody.light-theme[_nghost-%COMP%]   .dashboard-header[_ngcontent-%COMP%], body.light-theme   [_nghost-%COMP%]   .dashboard-header[_ngcontent-%COMP%], \nhtml:not(.dark)[_nghost-%COMP%]   .dashboard-header[_ngcontent-%COMP%], html:not(.dark)   [_nghost-%COMP%]   .dashboard-header[_ngcontent-%COMP%] {\n  background: #ffffff;\n  border-bottom: 1px solid #e2e8f0;\n  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);\n}\nbody.light-theme[_nghost-%COMP%]   .dashboard-header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%], body.light-theme   [_nghost-%COMP%]   .dashboard-header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%], \nhtml:not(.dark)[_nghost-%COMP%]   .dashboard-header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%], html:not(.dark)   [_nghost-%COMP%]   .dashboard-header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  color: #0f172a;\n}\nbody.light-theme[_nghost-%COMP%]   .agent-name[_ngcontent-%COMP%], body.light-theme   [_nghost-%COMP%]   .agent-name[_ngcontent-%COMP%], \nhtml:not(.dark)[_nghost-%COMP%]   .agent-name[_ngcontent-%COMP%], html:not(.dark)   [_nghost-%COMP%]   .agent-name[_ngcontent-%COMP%] {\n  color: #475569;\n}\nbody.light-theme[_nghost-%COMP%]   .status-card[_ngcontent-%COMP%], body.light-theme   [_nghost-%COMP%]   .status-card[_ngcontent-%COMP%], \nbody.light-theme[_nghost-%COMP%]   .change-status-section[_ngcontent-%COMP%], body.light-theme   [_nghost-%COMP%]   .change-status-section[_ngcontent-%COMP%], \nbody.light-theme[_nghost-%COMP%]   .manual-calling-section[_ngcontent-%COMP%], body.light-theme   [_nghost-%COMP%]   .manual-calling-section[_ngcontent-%COMP%], \nbody.light-theme[_nghost-%COMP%]   .info-card[_ngcontent-%COMP%], body.light-theme   [_nghost-%COMP%]   .info-card[_ngcontent-%COMP%], \nhtml:not(.dark)[_nghost-%COMP%]   .status-card[_ngcontent-%COMP%], html:not(.dark)   [_nghost-%COMP%]   .status-card[_ngcontent-%COMP%], \nhtml:not(.dark)[_nghost-%COMP%]   .change-status-section[_ngcontent-%COMP%], html:not(.dark)   [_nghost-%COMP%]   .change-status-section[_ngcontent-%COMP%], \nhtml:not(.dark)[_nghost-%COMP%]   .manual-calling-section[_ngcontent-%COMP%], html:not(.dark)   [_nghost-%COMP%]   .manual-calling-section[_ngcontent-%COMP%], \nhtml:not(.dark)[_nghost-%COMP%]   .info-card[_ngcontent-%COMP%], html:not(.dark)   [_nghost-%COMP%]   .info-card[_ngcontent-%COMP%] {\n  background: #ffffff;\n  border: 1px solid #e2e8f0;\n  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);\n}\nbody.light-theme[_nghost-%COMP%]   .status-card[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%], body.light-theme   [_nghost-%COMP%]   .status-card[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%], \nbody.light-theme[_nghost-%COMP%]   .change-status-section[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%], body.light-theme   [_nghost-%COMP%]   .change-status-section[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%], \nbody.light-theme[_nghost-%COMP%]   .manual-calling-section[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%], body.light-theme   [_nghost-%COMP%]   .manual-calling-section[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%], \nbody.light-theme[_nghost-%COMP%]   .info-card[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%], body.light-theme   [_nghost-%COMP%]   .info-card[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%], \nhtml:not(.dark)[_nghost-%COMP%]   .status-card[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%], html:not(.dark)   [_nghost-%COMP%]   .status-card[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%], \nhtml:not(.dark)[_nghost-%COMP%]   .change-status-section[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%], html:not(.dark)   [_nghost-%COMP%]   .change-status-section[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%], \nhtml:not(.dark)[_nghost-%COMP%]   .manual-calling-section[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%], html:not(.dark)   [_nghost-%COMP%]   .manual-calling-section[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%], \nhtml:not(.dark)[_nghost-%COMP%]   .info-card[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%], html:not(.dark)   [_nghost-%COMP%]   .info-card[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  color: #0f172a;\n}\nbody.light-theme[_nghost-%COMP%]   .section-subtitle[_ngcontent-%COMP%], body.light-theme   [_nghost-%COMP%]   .section-subtitle[_ngcontent-%COMP%], \nhtml:not(.dark)[_nghost-%COMP%]   .section-subtitle[_ngcontent-%COMP%], html:not(.dark)   [_nghost-%COMP%]   .section-subtitle[_ngcontent-%COMP%] {\n  color: #64748b;\n}\nbody.light-theme[_nghost-%COMP%]   .status-btn[_ngcontent-%COMP%], body.light-theme   [_nghost-%COMP%]   .status-btn[_ngcontent-%COMP%], \nhtml:not(.dark)[_nghost-%COMP%]   .status-btn[_ngcontent-%COMP%], html:not(.dark)   [_nghost-%COMP%]   .status-btn[_ngcontent-%COMP%] {\n  background: #f8fafc;\n  border: 2px solid #e2e8f0;\n  color: #475569;\n}\nbody.light-theme[_nghost-%COMP%]   .status-btn[_ngcontent-%COMP%]:hover:not(.disabled), body.light-theme   [_nghost-%COMP%]   .status-btn[_ngcontent-%COMP%]:hover:not(.disabled), \nhtml:not(.dark)[_nghost-%COMP%]   .status-btn[_ngcontent-%COMP%]:hover:not(.disabled), html:not(.dark)   [_nghost-%COMP%]   .status-btn[_ngcontent-%COMP%]:hover:not(.disabled) {\n  background: rgba(16, 185, 129, 0.1);\n  color: #059669;\n  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.15);\n}\nbody.light-theme[_nghost-%COMP%]   .status-btn.active[_ngcontent-%COMP%], body.light-theme   [_nghost-%COMP%]   .status-btn.active[_ngcontent-%COMP%], \nhtml:not(.dark)[_nghost-%COMP%]   .status-btn.active[_ngcontent-%COMP%], html:not(.dark)   [_nghost-%COMP%]   .status-btn.active[_ngcontent-%COMP%] {\n  background: rgba(16, 185, 129, 0.15);\n  color: #059669;\n  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.2);\n}\nbody.light-theme[_nghost-%COMP%]   .info-card[_ngcontent-%COMP%]   li[_ngcontent-%COMP%], body.light-theme   [_nghost-%COMP%]   .info-card[_ngcontent-%COMP%]   li[_ngcontent-%COMP%], \nhtml:not(.dark)[_nghost-%COMP%]   .info-card[_ngcontent-%COMP%]   li[_ngcontent-%COMP%], html:not(.dark)   [_nghost-%COMP%]   .info-card[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  color: #64748b;\n}\nbody.light-theme[_nghost-%COMP%]   .info-card[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], body.light-theme   [_nghost-%COMP%]   .info-card[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], \nhtml:not(.dark)[_nghost-%COMP%]   .info-card[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], html:not(.dark)   [_nghost-%COMP%]   .info-card[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #059669;\n}\nbody.light-theme[_nghost-%COMP%]   .loading-state[_ngcontent-%COMP%], body.light-theme   [_nghost-%COMP%]   .loading-state[_ngcontent-%COMP%], \nhtml:not(.dark)[_nghost-%COMP%]   .loading-state[_ngcontent-%COMP%], html:not(.dark)   [_nghost-%COMP%]   .loading-state[_ngcontent-%COMP%] {\n  color: #64748b;\n}\nbody.light-theme[_nghost-%COMP%]   .spinner[_ngcontent-%COMP%], body.light-theme   [_nghost-%COMP%]   .spinner[_ngcontent-%COMP%], \nhtml:not(.dark)[_nghost-%COMP%]   .spinner[_ngcontent-%COMP%], html:not(.dark)   [_nghost-%COMP%]   .spinner[_ngcontent-%COMP%] {\n  border: 4px solid #e2e8f0;\n  border-top-color: #10B981;\n}\nbody.light-theme[_nghost-%COMP%]   .error-state[_ngcontent-%COMP%], body.light-theme   [_nghost-%COMP%]   .error-state[_ngcontent-%COMP%], \nhtml:not(.dark)[_nghost-%COMP%]   .error-state[_ngcontent-%COMP%], html:not(.dark)   [_nghost-%COMP%]   .error-state[_ngcontent-%COMP%] {\n  background: rgba(239, 68, 68, 0.1);\n  border: 1px solid rgba(239, 68, 68, 0.2);\n}\n/*# sourceMappingURL=agent-status-dashboard.component.css.map */"] });
var AgentStatusDashboardComponent = _AgentStatusDashboardComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AgentStatusDashboardComponent, [{
    type: Component,
    args: [{ selector: "app-agent-status-dashboard", standalone: true, imports: [CommonModule, LucideAngularModule], template: '<div class="dashboard-container">\r\n  <!-- Header -->\r\n  <div class="dashboard-header">\r\n    <div class="header-content">\r\n      <h1>Panel de Asesor</h1>\r\n      <div class="agent-info">\r\n        <span class="agent-name">{{ agentName }}</span>\r\n        <button class="logout-btn" (click)="logout()">\r\n          <span>Cerrar Sesi\xF3n</span>\r\n        </button>\r\n      </div>\r\n    </div>\r\n  </div>\r\n\r\n  <!-- Main Content -->\r\n  <div class="dashboard-main">\r\n    <!-- Loading State -->\r\n    <div *ngIf="loading && !currentStatus" class="loading-state">\r\n      <div class="spinner"></div>\r\n      <p>Cargando estado...</p>\r\n    </div>\r\n\r\n    <!-- Error State -->\r\n    <div *ngIf="error" class="error-state">\r\n      <p>{{ error }}</p>\r\n      <button (click)="loadAgentStatus(currentStatus?.idUsuario || 0)">\r\n        Reintentar\r\n      </button>\r\n    </div>\r\n\r\n    <!-- Status Dashboard -->\r\n    <div *ngIf="currentStatus && !loading" class="status-dashboard">\r\n\r\n      <!-- Left Column -->\r\n      <div class="left-column">\r\n        <!-- Current Status Card -->\r\n        <div class="status-card">\r\n          <h2>Estado Actual</h2>\r\n          <div class="current-status">\r\n            <div class="status-badge" [style.background-color]="getStateColor(currentStatus.estadoActual)">\r\n              {{ stateLabels[currentStatus.estadoActual] }}\r\n            </div>\r\n          </div>\r\n        </div>\r\n\r\n        <!-- Info Card -->\r\n        <div class="info-card">\r\n          <h3><lucide-angular name="info" [size]="20"></lucide-angular> Informaci\xF3n</h3>\r\n          <ul>\r\n            <li><strong>Disponible:</strong> Recibir\xE1s llamadas autom\xE1ticas</li>\r\n            <li><strong>En Reuni\xF3n/Refrigerio/Ba\xF1o:</strong> No recibir\xE1s llamadas</li>\r\n            <li><strong>Modo Manual:</strong> Puedes llamar, pero no recibes autom\xE1ticas</li>\r\n          </ul>\r\n        </div>\r\n      </div>\r\n\r\n      <!-- Right Column -->\r\n      <div class="right-column">\r\n        <!-- Change Status Section -->\r\n        <div class="change-status-section">\r\n          <h2>Cambiar Estado</h2>\r\n          <p class="section-subtitle">Selecciona tu estado actual</p>\r\n\r\n          <div class="status-buttons">\r\n            <button\r\n              *ngFor="let state of manualStates"\r\n              class="status-btn"\r\n              [class.active]="isCurrentState(state)"\r\n              [class.disabled]="!canChangeToState(state) || loading"\r\n              [disabled]="!canChangeToState(state) || loading"\r\n              [style.border-color]="getStateColor(state)"\r\n              (click)="changeStatus(state)">\r\n              <div class="status-btn-icon" [style.background-color]="getStateColor(state)"></div>\r\n              <span>{{ stateLabels[state] }}</span>\r\n            </button>\r\n          </div>\r\n        </div>\r\n\r\n        <!-- Manual Calling Section -->\r\n        <div class="manual-calling-section">\r\n          <h2>Llamadas Manuales</h2>\r\n          <p class="section-subtitle">Inicia el modo manual para realizar llamadas</p>\r\n\r\n          <button\r\n            class="manual-call-btn"\r\n            [disabled]="loading || currentStatus.estadoActual === AgentState.EN_LLAMADA || currentStatus.estadoActual === AgentState.TIPIFICANDO"\r\n            (click)="enterManualMode()">\r\n            <span class="btn-icon"><lucide-angular name="phone-call" [size]="20"></lucide-angular></span>\r\n            <span>LLAMAR MANUAL</span>\r\n          </button>\r\n\r\n          <p class="manual-call-note" *ngIf="currentStatus.estadoActual === AgentState.EN_MANUAL">\r\n            Est\xE1s en modo manual. Ve al softphone para hacer llamadas.\r\n          </p>\r\n        </div>\r\n      </div>\r\n\r\n    </div>\r\n  </div>\r\n</div>\r\n', styles: ["/* src/app/features/agent-dashboard/agent-status-dashboard.component.css */\n.dashboard-container {\n  min-height: 100vh;\n  background:\n    linear-gradient(\n      to bottom right,\n      #0f172a,\n      #1e293b,\n      #0f172a);\n  display: flex;\n  flex-direction: column;\n}\n.dashboard-header {\n  background: #1E293B;\n  border-bottom: 1px solid #334155;\n  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);\n  padding: 0.8rem 1.5rem;\n}\n.header-content {\n  max-width: 900px;\n  margin: 0 auto;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n.dashboard-header h1 {\n  margin: 0;\n  font-size: 1.3rem;\n  color: #ffffff;\n  font-weight: 600;\n}\n.agent-info {\n  display: flex;\n  align-items: center;\n  gap: 1rem;\n}\n.agent-name {\n  font-size: 1rem;\n  color: #94a3b8;\n  font-weight: 500;\n}\n.logout-btn {\n  display: none;\n  background: #ef4444;\n  color: white;\n  border: none;\n  padding: 0.6rem 1.2rem;\n  border-radius: 6px;\n  cursor: pointer;\n  font-size: 0.9rem;\n  font-weight: 500;\n  transition: background 0.3s;\n}\n.logout-btn:hover {\n  background: #dc2626;\n}\n.dashboard-main {\n  flex: 1;\n  padding: 1rem;\n  max-width: 1400px;\n  width: 100%;\n  margin: 0 auto;\n}\n.loading-state {\n  text-align: center;\n  padding: 4rem 2rem;\n  color: #94a3b8;\n}\n.spinner {\n  width: 50px;\n  height: 50px;\n  border: 4px solid #334155;\n  border-top-color: #10B981;\n  border-radius: 50%;\n  animation: spin 1s linear infinite;\n  margin: 0 auto 1rem;\n}\n@keyframes spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n.error-state {\n  background: rgba(239, 68, 68, 0.15);\n  color: #ef4444;\n  padding: 2rem;\n  border-radius: 8px;\n  border: 1px solid rgba(239, 68, 68, 0.3);\n  text-align: center;\n}\n.error-state button {\n  margin-top: 1rem;\n  background: #10B981;\n  color: white;\n  border: none;\n  padding: 0.6rem 1.5rem;\n  border-radius: 6px;\n  cursor: pointer;\n  font-weight: 500;\n  transition: background 0.3s;\n}\n.error-state button:hover {\n  background: #059669;\n}\n.status-dashboard {\n  display: grid;\n  grid-template-columns: 350px 1fr;\n  gap: 1rem;\n  align-items: start;\n}\n.left-column {\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n}\n.right-column {\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n}\n.status-card {\n  background: #1E293B;\n  border: 1px solid #334155;\n  border-radius: 8px;\n  padding: 1.2rem;\n  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);\n}\n.status-card h2 {\n  margin: 0 0 1rem 0;\n  font-size: 1rem;\n  color: #ffffff;\n}\n.current-status {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 0;\n}\n.status-badge {\n  display: inline-block;\n  padding: 0.6rem 2rem;\n  border-radius: 50px;\n  color: white;\n  font-size: 1.1rem;\n  font-weight: 600;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);\n}\n.change-status-section {\n  background: #1E293B;\n  border: 1px solid #334155;\n  border-radius: 8px;\n  padding: 1.2rem;\n  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);\n}\n.change-status-section h2 {\n  margin: 0 0 0.3rem 0;\n  font-size: 1rem;\n  color: #ffffff;\n}\n.section-subtitle {\n  margin: 0 0 1rem 0;\n  color: #94a3b8;\n  font-size: 0.85rem;\n}\n.status-buttons {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));\n  gap: 0.7rem;\n}\n.status-btn {\n  display: flex;\n  align-items: center;\n  gap: 0.7rem;\n  background: #0A0E27;\n  border: 2px solid #334155;\n  padding: 0.7rem 1rem;\n  border-radius: 8px;\n  cursor: pointer;\n  font-size: 0.9rem;\n  font-weight: 500;\n  color: #94a3b8;\n  transition: all 0.3s;\n}\n.status-btn:hover:not(.disabled) {\n  transform: translateY(-2px);\n  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);\n  background: rgba(16, 185, 129, 0.1);\n  color: #10B981;\n}\n.status-btn.active {\n  border-width: 2px;\n  background: rgba(16, 185, 129, 0.15);\n  color: #10B981;\n  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);\n}\n.status-btn.disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n.status-btn-icon {\n  width: 20px;\n  height: 20px;\n  border-radius: 50%;\n}\n.manual-calling-section {\n  background: #1E293B;\n  border: 1px solid #334155;\n  border-radius: 8px;\n  padding: 1.2rem;\n  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);\n}\n.manual-calling-section h2 {\n  margin: 0 0 0.3rem 0;\n  font-size: 1rem;\n  color: #ffffff;\n}\n.manual-call-btn {\n  width: 100%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.5rem;\n  background: #10B981;\n  color: white;\n  border: none;\n  padding: 0.7rem 1.2rem;\n  border-radius: 8px;\n  cursor: pointer;\n  font-size: 0.9rem;\n  font-weight: 600;\n  margin-top: 0.7rem;\n  transition: all 0.3s;\n}\n.manual-call-btn:hover:not(:disabled) {\n  transform: translateY(-2px);\n  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);\n  background: #059669;\n}\n.manual-call-btn:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n.btn-icon {\n  font-size: 1.2rem;\n}\n.manual-call-note {\n  margin-top: 0.7rem;\n  padding: 0.7rem;\n  background: rgba(16, 185, 129, 0.1);\n  border-left: 4px solid #10B981;\n  border-radius: 4px;\n  color: #10B981;\n  font-weight: 500;\n  font-size: 0.85rem;\n}\n.info-card {\n  background: #1E293B;\n  border: 1px solid #334155;\n  border-radius: 8px;\n  padding: 1.2rem;\n  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);\n}\n.info-card h3 {\n  margin: 0 0 0.7rem 0;\n  font-size: 0.95rem;\n  color: #ffffff;\n}\n.info-card ul {\n  list-style: none;\n  padding: 0;\n  margin: 0;\n}\n.info-card li {\n  padding: 0.4rem 0;\n  color: #94a3b8;\n  font-size: 0.85rem;\n}\n.info-card li strong {\n  color: #10B981;\n}\n@media (max-width: 1024px) {\n  .status-dashboard {\n    grid-template-columns: 1fr;\n  }\n  .left-column {\n    max-width: 100%;\n  }\n}\n@media (max-width: 768px) {\n  .dashboard-header {\n    padding: 1rem;\n  }\n  .header-content {\n    flex-direction: column;\n    gap: 1rem;\n    text-align: center;\n  }\n  .dashboard-main {\n    padding: 1rem;\n  }\n  .status-buttons {\n    grid-template-columns: 1fr;\n  }\n  .status-badge {\n    font-size: 1rem;\n    padding: 0.6rem 1.5rem;\n  }\n}\n:host-context(body.light-theme) .dashboard-container,\n:host-context(html:not(.dark)) .dashboard-container {\n  background:\n    linear-gradient(\n      to bottom right,\n      #f8fafc,\n      #f1f5f9,\n      #f8fafc);\n}\n:host-context(body.light-theme) .dashboard-header,\n:host-context(html:not(.dark)) .dashboard-header {\n  background: #ffffff;\n  border-bottom: 1px solid #e2e8f0;\n  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);\n}\n:host-context(body.light-theme) .dashboard-header h1,\n:host-context(html:not(.dark)) .dashboard-header h1 {\n  color: #0f172a;\n}\n:host-context(body.light-theme) .agent-name,\n:host-context(html:not(.dark)) .agent-name {\n  color: #475569;\n}\n:host-context(body.light-theme) .status-card,\n:host-context(body.light-theme) .change-status-section,\n:host-context(body.light-theme) .manual-calling-section,\n:host-context(body.light-theme) .info-card,\n:host-context(html:not(.dark)) .status-card,\n:host-context(html:not(.dark)) .change-status-section,\n:host-context(html:not(.dark)) .manual-calling-section,\n:host-context(html:not(.dark)) .info-card {\n  background: #ffffff;\n  border: 1px solid #e2e8f0;\n  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);\n}\n:host-context(body.light-theme) .status-card h2,\n:host-context(body.light-theme) .change-status-section h2,\n:host-context(body.light-theme) .manual-calling-section h2,\n:host-context(body.light-theme) .info-card h3,\n:host-context(html:not(.dark)) .status-card h2,\n:host-context(html:not(.dark)) .change-status-section h2,\n:host-context(html:not(.dark)) .manual-calling-section h2,\n:host-context(html:not(.dark)) .info-card h3 {\n  color: #0f172a;\n}\n:host-context(body.light-theme) .section-subtitle,\n:host-context(html:not(.dark)) .section-subtitle {\n  color: #64748b;\n}\n:host-context(body.light-theme) .status-btn,\n:host-context(html:not(.dark)) .status-btn {\n  background: #f8fafc;\n  border: 2px solid #e2e8f0;\n  color: #475569;\n}\n:host-context(body.light-theme) .status-btn:hover:not(.disabled),\n:host-context(html:not(.dark)) .status-btn:hover:not(.disabled) {\n  background: rgba(16, 185, 129, 0.1);\n  color: #059669;\n  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.15);\n}\n:host-context(body.light-theme) .status-btn.active,\n:host-context(html:not(.dark)) .status-btn.active {\n  background: rgba(16, 185, 129, 0.15);\n  color: #059669;\n  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.2);\n}\n:host-context(body.light-theme) .info-card li,\n:host-context(html:not(.dark)) .info-card li {\n  color: #64748b;\n}\n:host-context(body.light-theme) .info-card li strong,\n:host-context(html:not(.dark)) .info-card li strong {\n  color: #059669;\n}\n:host-context(body.light-theme) .loading-state,\n:host-context(html:not(.dark)) .loading-state {\n  color: #64748b;\n}\n:host-context(body.light-theme) .spinner,\n:host-context(html:not(.dark)) .spinner {\n  border: 4px solid #e2e8f0;\n  border-top-color: #10B981;\n}\n:host-context(body.light-theme) .error-state,\n:host-context(html:not(.dark)) .error-state {\n  background: rgba(239, 68, 68, 0.1);\n  border: 1px solid rgba(239, 68, 68, 0.2);\n}\n/*# sourceMappingURL=agent-status-dashboard.component.css.map */\n"] }]
  }], () => [{ type: AgentStatusService }, { type: AuthService }, { type: Router }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AgentStatusDashboardComponent, { className: "AgentStatusDashboardComponent", filePath: "src/app/features/agent-dashboard/agent-status-dashboard.component.ts", lineNumber: 22 });
})();
export {
  AgentStatusDashboardComponent
};
//# sourceMappingURL=chunk-7IPNCEWU.js.map
