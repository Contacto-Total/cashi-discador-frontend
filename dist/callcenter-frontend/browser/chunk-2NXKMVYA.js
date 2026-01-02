import {
  MatBadgeModule
} from "./chunk-XMCFZ2BL.js";
import {
  MatTooltip,
  MatTooltipModule
} from "./chunk-C6Q5OSF7.js";
import "./chunk-CRNFYKBD.js";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableModule
} from "./chunk-L5DRRBK6.js";
import "./chunk-524SGLBK.js";
import "./chunk-2GCPRO7O.js";
import "./chunk-XG3JRR2G.js";
import {
  AdminMonitoringService
} from "./chunk-IBGBXKRK.js";
import {
  MatCard,
  MatCardContent,
  MatCardModule
} from "./chunk-6IEEJC5K.js";
import {
  WebsocketService
} from "./chunk-NSDE3IOW.js";
import {
  MatButton,
  MatButtonModule
} from "./chunk-M2YI7FKS.js";
import "./chunk-Q5NKAKZL.js";
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
  NgIf,
  ViewEncapsulation,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassMap,
  ɵɵdefineComponent,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementContainerEnd,
  ɵɵelementContainerStart,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-CTRHJBBW.js";

// src/app/features/admin/admin-monitoring/admin-monitoring.component.ts
function AdminMonitoringComponent_div_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 10);
    \u0275\u0275element(1, "div", 11);
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3, "Cargando llamadas activas...");
    \u0275\u0275elementEnd()();
  }
}
function AdminMonitoringComponent_div_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 12);
    \u0275\u0275element(1, "lucide-angular", 13);
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3, "No hay llamadas activas en este momento");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 48);
  }
}
function AdminMonitoringComponent_div_13_th_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 26);
    \u0275\u0275text(1, "Agente");
    \u0275\u0275elementEnd();
  }
}
function AdminMonitoringComponent_div_13_td_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 27)(1, "div", 28);
    \u0275\u0275element(2, "lucide-angular", 29);
    \u0275\u0275elementStart(3, "div")(4, "div", 30);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 31);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const call_r1 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 20);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(call_r1.agentName);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("Ext: ", call_r1.agentExtension);
  }
}
function AdminMonitoringComponent_div_13_th_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 26);
    \u0275\u0275text(1, "Cliente");
    \u0275\u0275elementEnd();
  }
}
function AdminMonitoringComponent_div_13_td_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 27)(1, "div", 32);
    \u0275\u0275element(2, "lucide-angular", 33);
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const call_r2 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 20);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(call_r2.clientNumber);
  }
}
function AdminMonitoringComponent_div_13_th_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 26);
    \u0275\u0275text(1, "Duraci\xF3n");
    \u0275\u0275elementEnd();
  }
}
function AdminMonitoringComponent_div_13_td_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 27)(1, "div", 34);
    \u0275\u0275element(2, "lucide-angular", 35);
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const call_r3 = ctx.$implicit;
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 20);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r3.formatDuration(call_r3.duration));
  }
}
function AdminMonitoringComponent_div_13_th_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 26);
    \u0275\u0275text(1, "Estado");
    \u0275\u0275elementEnd();
  }
}
function AdminMonitoringComponent_div_13_td_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 27)(1, "div", 36);
    \u0275\u0275element(2, "lucide-angular", 37);
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const call_r5 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275classMap("state-" + call_r5.callState.toLowerCase());
    \u0275\u0275advance();
    \u0275\u0275property("size", 20);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(call_r5.callState);
  }
}
function AdminMonitoringComponent_div_13_th_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 26);
    \u0275\u0275text(1, "Campa\xF1a");
    \u0275\u0275elementEnd();
  }
}
function AdminMonitoringComponent_div_13_td_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 27)(1, "span", 38);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const call_r6 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(call_r6.campaignName || "-");
  }
}
function AdminMonitoringComponent_div_13_th_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 26);
    \u0275\u0275text(1, "Acciones");
    \u0275\u0275elementEnd();
  }
}
function AdminMonitoringComponent_div_13_td_19_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "td", 27)(1, "button", 39);
    \u0275\u0275listener("click", function AdminMonitoringComponent_div_13_td_19_Template_button_click_1_listener() {
      const call_r8 = \u0275\u0275restoreView(_r7).$implicit;
      const ctx_r3 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r3.superviseCall(call_r8));
    });
    \u0275\u0275element(2, "lucide-angular", 40);
    \u0275\u0275text(3, " Supervisar ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 20);
  }
}
function AdminMonitoringComponent_div_13_tr_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "tr", 41);
  }
}
function AdminMonitoringComponent_div_13_tr_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "tr", 42);
  }
}
function AdminMonitoringComponent_div_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 14)(1, "table", 15);
    \u0275\u0275elementContainerStart(2, 16);
    \u0275\u0275template(3, AdminMonitoringComponent_div_13_th_3_Template, 2, 0, "th", 17)(4, AdminMonitoringComponent_div_13_td_4_Template, 8, 3, "td", 18);
    \u0275\u0275elementContainerEnd();
    \u0275\u0275elementContainerStart(5, 19);
    \u0275\u0275template(6, AdminMonitoringComponent_div_13_th_6_Template, 2, 0, "th", 17)(7, AdminMonitoringComponent_div_13_td_7_Template, 5, 2, "td", 18);
    \u0275\u0275elementContainerEnd();
    \u0275\u0275elementContainerStart(8, 20);
    \u0275\u0275template(9, AdminMonitoringComponent_div_13_th_9_Template, 2, 0, "th", 17)(10, AdminMonitoringComponent_div_13_td_10_Template, 5, 2, "td", 18);
    \u0275\u0275elementContainerEnd();
    \u0275\u0275elementContainerStart(11, 21);
    \u0275\u0275template(12, AdminMonitoringComponent_div_13_th_12_Template, 2, 0, "th", 17)(13, AdminMonitoringComponent_div_13_td_13_Template, 5, 4, "td", 18);
    \u0275\u0275elementContainerEnd();
    \u0275\u0275elementContainerStart(14, 22);
    \u0275\u0275template(15, AdminMonitoringComponent_div_13_th_15_Template, 2, 0, "th", 17)(16, AdminMonitoringComponent_div_13_td_16_Template, 3, 1, "td", 18);
    \u0275\u0275elementContainerEnd();
    \u0275\u0275elementContainerStart(17, 23);
    \u0275\u0275template(18, AdminMonitoringComponent_div_13_th_18_Template, 2, 0, "th", 17)(19, AdminMonitoringComponent_div_13_td_19_Template, 4, 1, "td", 18);
    \u0275\u0275elementContainerEnd();
    \u0275\u0275template(20, AdminMonitoringComponent_div_13_tr_20_Template, 1, 0, "tr", 24)(21, AdminMonitoringComponent_div_13_tr_21_Template, 1, 0, "tr", 25);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("dataSource", ctx_r3.activeCalls);
    \u0275\u0275advance(19);
    \u0275\u0275property("matHeaderRowDef", ctx_r3.displayedColumns);
    \u0275\u0275advance();
    \u0275\u0275property("matRowDefColumns", ctx_r3.displayedColumns);
  }
}
function AdminMonitoringComponent_div_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 43)(1, "h4");
    \u0275\u0275text(2, "Modos de Monitoreo:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 44)(4, "div", 45);
    \u0275\u0275element(5, "lucide-angular", 46);
    \u0275\u0275elementStart(6, "span")(7, "strong");
    \u0275\u0275text(8, "VIG\xCDA:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(9, " Escuchas la llamada, pero nadie te escucha");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "div", 45);
    \u0275\u0275element(11, "lucide-angular", 47);
    \u0275\u0275elementStart(12, "span")(13, "strong");
    \u0275\u0275text(14, "SUSURRO:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(15, " Solo el agente puede escucharte, el cliente no");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "div", 45);
    \u0275\u0275element(17, "lucide-angular", 48);
    \u0275\u0275elementStart(18, "span")(19, "strong");
    \u0275\u0275text(20, "TRIPARTITA:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(21, " Todos te escuchan (agente y cliente)");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    \u0275\u0275advance(5);
    \u0275\u0275property("size", 20);
    \u0275\u0275advance(6);
    \u0275\u0275property("size", 20);
    \u0275\u0275advance(6);
    \u0275\u0275property("size", 20);
  }
}
var _AdminMonitoringComponent = class _AdminMonitoringComponent {
  constructor(adminMonitoringService, websocketService, authService, router) {
    this.adminMonitoringService = adminMonitoringService;
    this.websocketService = websocketService;
    this.authService = authService;
    this.router = router;
    this.activeCalls = [];
    this.loading = true;
    this.currentUser = null;
    this.currentMonitoringCall = null;
    this.currentAdminCallUuid = null;
    this.displayedColumns = ["agent", "client", "duration", "state", "campaign", "actions"];
    this.subscriptions = [];
  }
  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.loadActiveCalls();
    this.subscribeToWebSocket();
    this.refreshInterval = setInterval(() => {
      this.loadActiveCalls();
    }, 5e3);
  }
  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }
  loadActiveCalls() {
    this.adminMonitoringService.getActiveCalls().subscribe({
      next: (calls) => {
        this.activeCalls = calls;
        this.loading = false;
      },
      error: (error) => {
        console.error("Error loading active calls:", error);
        this.loading = false;
      }
    });
  }
  subscribeToWebSocket() {
    const callsSub = this.websocketService.subscribe("/topic/admin/calls").subscribe({
      next: (event) => {
        console.log("Admin call event received:", event);
        this.handleCallEvent(event);
      },
      error: (error) => {
        console.error("WebSocket error:", error);
      }
    });
    const monitoringSub = this.websocketService.subscribe("/topic/admin/monitoring").subscribe({
      next: (event) => {
        console.log("Monitoring event received:", event);
        this.handleMonitoringEvent(event);
      },
      error: (error) => {
        console.error("WebSocket monitoring error:", error);
      }
    });
    this.subscriptions.push(callsSub, monitoringSub);
  }
  handleCallEvent(event) {
    const callData = event.data || event;
    if (callData.callState === "ENDED") {
      this.activeCalls = this.activeCalls.filter((c) => c.callUuid !== callData.callUuid);
    } else {
      const index = this.activeCalls.findIndex((c) => c.callUuid === callData.callUuid);
      if (index >= 0) {
        this.activeCalls[index] = callData;
      } else {
        this.activeCalls.push(callData);
      }
    }
  }
  handleMonitoringEvent(event) {
    console.log("Monitoring event:", event);
  }
  startSpyMode(call) {
    if (!this.currentUser || this.currentMonitoringCall) {
      return;
    }
    console.log("Starting SPY mode for call:", call.callUuid);
    this.adminMonitoringService.startSpyMode({
      callUuid: call.callUuid,
      adminExtension: "1003",
      // TODO: Get from current user
      adminUsername: this.currentUser.username
    }).subscribe({
      next: (response) => {
        console.log("SPY mode started:", response);
        this.currentMonitoringCall = call.callUuid;
        this.currentAdminCallUuid = response.adminCallUuid;
        alert(`Modo VIG\xCDA activado. Escucha la llamada sin ser o\xEDdo.`);
      },
      error: (error) => {
        console.error("Error starting SPY mode:", error);
        alert("Error al activar modo VIG\xCDA");
      }
    });
  }
  startWhisperMode(call) {
    if (!this.currentUser || this.currentMonitoringCall) {
      return;
    }
    console.log("Starting WHISPER mode for call:", call.callUuid);
    this.adminMonitoringService.startWhisperMode({
      callUuid: call.callUuid,
      adminExtension: "1003",
      // TODO: Get from current user
      adminUsername: this.currentUser.username
    }).subscribe({
      next: (response) => {
        console.log("WHISPER mode started:", response);
        this.currentMonitoringCall = call.callUuid;
        this.currentAdminCallUuid = response.adminCallUuid;
        alert(`Modo SUSURRO activado. Solo el agente puede escucharte.`);
      },
      error: (error) => {
        console.error("Error starting WHISPER mode:", error);
        alert("Error al activar modo SUSURRO");
      }
    });
  }
  startBargeMode(call) {
    if (!this.currentUser || this.currentMonitoringCall) {
      return;
    }
    console.log("Starting BARGE mode for call:", call.callUuid);
    this.adminMonitoringService.startBargeMode({
      callUuid: call.callUuid,
      adminExtension: "1003",
      // TODO: Get from current user
      adminUsername: this.currentUser.username
    }).subscribe({
      next: (response) => {
        console.log("BARGE mode started:", response);
        this.currentMonitoringCall = call.callUuid;
        this.currentAdminCallUuid = response.adminCallUuid;
        alert(`Modo TRIPARTITA activado. Todos pueden escucharte.`);
      },
      error: (error) => {
        console.error("Error starting BARGE mode:", error);
        alert("Error al activar modo TRIPARTITA");
      }
    });
  }
  stopMonitoring(call) {
    if (!this.currentMonitoringCall || !this.currentAdminCallUuid) {
      return;
    }
    console.log("Stopping monitoring for call:", call.callUuid);
    this.adminMonitoringService.stopMonitoring(call.callUuid, this.currentAdminCallUuid, this.currentUser.username).subscribe({
      next: (response) => {
        console.log("Monitoring stopped:", response);
        this.currentMonitoringCall = null;
        this.currentAdminCallUuid = null;
        alert("Monitoreo detenido");
      },
      error: (error) => {
        console.error("Error stopping monitoring:", error);
        alert("Error al detener monitoreo");
      }
    });
  }
  isMonitoring(call) {
    return this.currentMonitoringCall === call.callUuid;
  }
  formatDuration(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  getStateIcon(state) {
    switch (state) {
      case "RINGING":
        return "phone_in_talk";
      case "ANSWERED":
        return "call";
      case "ACTIVE":
        return "call";
      default:
        return "phone";
    }
  }
  getStateColor(state) {
    switch (state) {
      case "RINGING":
        return "accent";
      case "ANSWERED":
        return "primary";
      case "ACTIVE":
        return "primary";
      default:
        return "";
    }
  }
  /**
   * Navigate to supervision detail view
   */
  superviseCall(call) {
    this.router.navigate(["/admin/supervision", call.callUuid]);
  }
};
_AdminMonitoringComponent.\u0275fac = function AdminMonitoringComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _AdminMonitoringComponent)(\u0275\u0275directiveInject(AdminMonitoringService), \u0275\u0275directiveInject(WebsocketService), \u0275\u0275directiveInject(AuthService), \u0275\u0275directiveInject(Router));
};
_AdminMonitoringComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AdminMonitoringComponent, selectors: [["app-admin-monitoring"]], decls: 15, vars: 5, consts: [[1, "monitoring-container"], [1, "flex", "items-center", "gap-2", "mb-2"], [1, "w-8", "h-8", "bg-gradient-to-br", "from-green-600", "to-green-700", "rounded-lg", "flex", "items-center", "justify-center"], ["name", "phone-call", 1, "text-white", 3, "size"], [1, "text-lg", "font-bold", "text-white"], [1, "text-xs", "text-gray-400"], ["class", "loading-container", 4, "ngIf"], ["class", "no-calls", 4, "ngIf"], ["class", "table-container", 4, "ngIf"], ["class", "legend", 4, "ngIf"], [1, "loading-container"], [1, "w-8", "h-8", "border-4", "border-blue-500", "border-t-transparent", "rounded-full", "animate-spin"], [1, "no-calls"], ["name", "phone-off", 3, "size"], [1, "table-container"], ["mat-table", "", 1, "calls-table", 3, "dataSource"], ["matColumnDef", "agent"], ["mat-header-cell", "", 4, "matHeaderCellDef"], ["mat-cell", "", 4, "matCellDef"], ["matColumnDef", "client"], ["matColumnDef", "duration"], ["matColumnDef", "state"], ["matColumnDef", "campaign"], ["matColumnDef", "actions"], ["mat-header-row", "", 4, "matHeaderRowDef"], ["mat-row", "", 4, "matRowDef", "matRowDefColumns"], ["mat-header-cell", ""], ["mat-cell", ""], [1, "agent-info"], ["name", "user", 3, "size"], [1, "agent-name"], [1, "agent-ext"], [1, "client-info"], ["name", "phone", 3, "size"], [1, "duration"], ["name", "clock", 3, "size"], [1, "call-state"], ["name", "phone-call", 3, "size"], [1, "campaign-name"], ["mat-raised-button", "", "color", "primary", "matTooltip", "Abrir pantalla de supervisi\xF3n", 3, "click"], ["name", "eye", 3, "size"], ["mat-header-row", ""], ["mat-row", ""], [1, "legend"], [1, "legend-items"], [1, "legend-item"], ["name", "eye", 1, "text-blue-500", 3, "size"], ["name", "mic", 1, "text-green-500", 3, "size"], ["name", "users", 1, "text-red-500", 3, "size"]], template: function AdminMonitoringComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2);
    \u0275\u0275element(3, "lucide-angular", 3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div")(5, "h1", 4);
    \u0275\u0275text(6, "Llamadas Activas");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p", 5);
    \u0275\u0275text(8, "Monitoreo en tiempo real de llamadas en curso");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(9, "mat-card")(10, "mat-card-content");
    \u0275\u0275template(11, AdminMonitoringComponent_div_11_Template, 4, 0, "div", 6)(12, AdminMonitoringComponent_div_12_Template, 4, 1, "div", 7)(13, AdminMonitoringComponent_div_13_Template, 22, 3, "div", 8)(14, AdminMonitoringComponent_div_14_Template, 22, 3, "div", 9);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    \u0275\u0275advance(3);
    \u0275\u0275property("size", 16);
    \u0275\u0275advance(8);
    \u0275\u0275property("ngIf", ctx.loading);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx.loading && ctx.activeCalls.length === 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx.loading && ctx.activeCalls.length > 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx.loading && ctx.activeCalls.length > 0);
  }
}, dependencies: [
  CommonModule,
  NgIf,
  MatCardModule,
  MatCard,
  MatCardContent,
  MatButtonModule,
  MatButton,
  MatTableModule,
  MatTable,
  MatHeaderCellDef,
  MatHeaderRowDef,
  MatColumnDef,
  MatCellDef,
  MatRowDef,
  MatHeaderCell,
  MatCell,
  MatHeaderRow,
  MatRow,
  MatTooltipModule,
  MatTooltip,
  MatBadgeModule,
  LucideAngularModule,
  LucideAngularComponent
], styles: ["/* src/app/features/admin/admin-monitoring/admin-monitoring.component.css */\n.monitoring-container {\n  padding: 20px;\n  max-width: 1400px;\n  margin: 0 auto;\n  background-color: #f8fafc;\n  min-height: 100vh;\n}\napp-admin-monitoring mat-card {\n  margin-bottom: 20px;\n  background-color: #ffffff !important;\n  border: 1px solid #e2e8f0 !important;\n  border-radius: 12px !important;\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;\n}\napp-admin-monitoring mat-card-header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 20px;\n  padding: 16px;\n  background-color: transparent !important;\n}\napp-admin-monitoring mat-card-title {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  font-size: 24px !important;\n  font-weight: 600 !important;\n  color: #0f172a !important;\n  margin: 0 !important;\n}\napp-admin-monitoring mat-card-title mat-icon {\n  color: #10B981 !important;\n}\napp-admin-monitoring mat-card-content {\n  padding: 16px !important;\n  color: #0f172a !important;\n}\n.header-actions {\n  display: flex;\n  gap: 10px;\n}\n.loading-container {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  padding: 60px 20px;\n}\n.loading-container p {\n  margin-top: 20px;\n  color: #64748b !important;\n  font-size: 16px;\n}\n.no-calls {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  padding: 60px 20px;\n  color: #94a3b8;\n  background-color: #f8fafc;\n  border-radius: 8px;\n  border: 1px dashed #cbd5e1;\n}\n.no-calls mat-icon {\n  font-size: 64px !important;\n  width: 64px !important;\n  height: 64px !important;\n  margin-bottom: 20px;\n  color: #cbd5e1 !important;\n}\n.no-calls p {\n  font-size: 16px;\n  color: #64748b !important;\n  margin: 0;\n}\n.table-container {\n  overflow-x: auto;\n  background-color: #ffffff;\n  border-radius: 8px;\n}\n.calls-table {\n  width: 100%;\n  background-color: #ffffff !important;\n}\n.calls-table th {\n  background-color: #f8fafc !important;\n  font-weight: 600 !important;\n  color: #0f172a !important;\n  font-size: 13px !important;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n  padding: 12px 16px !important;\n  border-bottom: 1px solid #e2e8f0 !important;\n}\n.calls-table td {\n  padding: 12px 16px !important;\n  border-bottom: 1px solid #e2e8f0 !important;\n  color: #1e293b !important;\n  font-weight: 500 !important;\n}\n.calls-table tr:last-child td {\n  border-bottom: none !important;\n}\n.calls-table tr:hover td {\n  background-color: #f8fafc !important;\n}\n.agent-info,\n.client-info,\n.duration,\n.call-state {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n}\n.agent-info mat-icon,\n.client-info mat-icon,\n.duration mat-icon {\n  color: #64748b !important;\n  font-size: 20px !important;\n  width: 20px !important;\n  height: 20px !important;\n}\n.agent-name {\n  font-weight: 600 !important;\n  color: #0f172a !important;\n}\n.agent-ext {\n  font-size: 12px;\n  color: #64748b !important;\n}\n.client-info span,\n.duration span {\n  color: #1e293b !important;\n  font-weight: 500 !important;\n}\n.call-state {\n  padding: 6px 12px;\n  border-radius: 16px;\n  font-size: 12px;\n  font-weight: 600;\n  text-transform: uppercase;\n  letter-spacing: 0.3px;\n}\n.call-state mat-icon {\n  font-size: 18px !important;\n  width: 18px !important;\n  height: 18px !important;\n}\n.call-state.state-ringing {\n  background-color: #fff7ed !important;\n  color: #ea580c !important;\n}\n.call-state.state-ringing mat-icon {\n  color: #ea580c !important;\n}\n.call-state.state-answered,\n.call-state.state-active {\n  background-color: #f0fdf4 !important;\n  color: #16a34a !important;\n}\n.call-state.state-answered mat-icon,\n.call-state.state-active mat-icon {\n  color: #16a34a !important;\n}\n.campaign-name {\n  font-size: 13px;\n  color: #334155 !important;\n  font-weight: 500 !important;\n}\n.legend {\n  margin-top: 30px;\n  padding: 20px;\n  background-color: #f8fafc !important;\n  border-radius: 8px;\n  border: 1px solid #e2e8f0 !important;\n}\n.legend h4 {\n  margin: 0 0 16px 0;\n  color: #0f172a !important;\n  font-weight: 600 !important;\n  font-size: 16px;\n}\n.legend-items {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n}\n.legend-item {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n}\n.legend-item mat-icon {\n  color: #64748b !important;\n}\n.legend-item span {\n  font-size: 14px;\n  color: #334155 !important;\n}\n.legend-item strong {\n  color: #0f172a !important;\n  font-weight: 600;\n}\n:root.dark .monitoring-container,\nbody.dark-theme .monitoring-container {\n  background-color: #0f172a !important;\n}\n:root.dark app-admin-monitoring mat-card,\nbody.dark-theme app-admin-monitoring mat-card {\n  background-color: #1e293b !important;\n  border: 1px solid #334155 !important;\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3) !important;\n}\n:root.dark app-admin-monitoring mat-card-title,\nbody.dark-theme app-admin-monitoring mat-card-title {\n  color: #f8fafc !important;\n}\n:root.dark app-admin-monitoring mat-card-title mat-icon,\nbody.dark-theme app-admin-monitoring mat-card-title mat-icon {\n  color: #10B981 !important;\n}\n:root.dark app-admin-monitoring mat-card-content,\nbody.dark-theme app-admin-monitoring mat-card-content {\n  color: #e2e8f0 !important;\n}\n:root.dark .loading-container p,\nbody.dark-theme .loading-container p {\n  color: #94a3b8 !important;\n}\n:root.dark .no-calls,\nbody.dark-theme .no-calls {\n  background-color: #0f172a !important;\n  border: 1px dashed #334155 !important;\n  color: #64748b !important;\n}\n:root.dark .no-calls mat-icon,\nbody.dark-theme .no-calls mat-icon {\n  color: #334155 !important;\n}\n:root.dark .no-calls p,\nbody.dark-theme .no-calls p {\n  color: #94a3b8 !important;\n}\n:root.dark .table-container,\nbody.dark-theme .table-container {\n  background-color: #1e293b !important;\n}\n:root.dark .calls-table,\nbody.dark-theme .calls-table {\n  background-color: #1e293b !important;\n}\n:root.dark .calls-table th,\nbody.dark-theme .calls-table th {\n  background-color: #0f172a !important;\n  color: #f8fafc !important;\n  border-bottom: 1px solid #334155 !important;\n}\n:root.dark .calls-table td,\nbody.dark-theme .calls-table td {\n  color: #e2e8f0 !important;\n  border-bottom: 1px solid #334155 !important;\n}\n:root.dark .calls-table tr:hover td,\nbody.dark-theme .calls-table tr:hover td {\n  background-color: #0f172a !important;\n}\n:root.dark .agent-info mat-icon,\n:root.dark .client-info mat-icon,\n:root.dark .duration mat-icon,\nbody.dark-theme .agent-info mat-icon,\nbody.dark-theme .client-info mat-icon,\nbody.dark-theme .duration mat-icon {\n  color: #94a3b8 !important;\n}\n:root.dark .agent-name,\nbody.dark-theme .agent-name {\n  color: #ffffff !important;\n}\n:root.dark .agent-ext,\nbody.dark-theme .agent-ext {\n  color: #64748b !important;\n}\n:root.dark .client-info span,\n:root.dark .duration span,\nbody.dark-theme .client-info span,\nbody.dark-theme .duration span {\n  color: #e2e8f0 !important;\n}\n:root.dark .call-state.state-ringing,\nbody.dark-theme .call-state.state-ringing {\n  background-color: rgba(251, 146, 60, 0.15) !important;\n  color: #fb923c !important;\n}\n:root.dark .call-state.state-ringing mat-icon,\nbody.dark-theme .call-state.state-ringing mat-icon {\n  color: #fb923c !important;\n}\n:root.dark .call-state.state-answered,\n:root.dark .call-state.state-active,\nbody.dark-theme .call-state.state-answered,\nbody.dark-theme .call-state.state-active {\n  background-color: rgba(16, 185, 129, 0.15) !important;\n  color: #10B981 !important;\n}\n:root.dark .call-state.state-answered mat-icon,\n:root.dark .call-state.state-active mat-icon,\nbody.dark-theme .call-state.state-answered mat-icon,\nbody.dark-theme .call-state.state-active mat-icon {\n  color: #10B981 !important;\n}\n:root.dark .campaign-name,\nbody.dark-theme .campaign-name {\n  color: #e2e8f0 !important;\n}\n:root.dark .legend,\nbody.dark-theme .legend {\n  background-color: #0f172a !important;\n  border: 1px solid #334155 !important;\n}\n:root.dark .legend h4,\nbody.dark-theme .legend h4 {\n  color: #f8fafc !important;\n}\n:root.dark .legend-item mat-icon,\nbody.dark-theme .legend-item mat-icon {\n  color: #94a3b8 !important;\n}\n:root.dark .legend-item span,\nbody.dark-theme .legend-item span {\n  color: #e2e8f0 !important;\n}\n:root.dark .legend-item strong,\nbody.dark-theme .legend-item strong {\n  color: #f8fafc !important;\n}\n:root.dark app-admin-monitoring button[mat-raised-button],\nbody.dark-theme app-admin-monitoring button[mat-raised-button] {\n  background-color: #10B981 !important;\n  color: #ffffff !important;\n}\n:root.dark app-admin-monitoring button[mat-raised-button]:hover,\nbody.dark-theme app-admin-monitoring button[mat-raised-button]:hover {\n  background-color: #059669 !important;\n}\n@media (max-width: 768px) {\n  .monitoring-container {\n    padding: 10px;\n  }\n  app-admin-monitoring mat-card-title {\n    font-size: 18px !important;\n  }\n  app-admin-monitoring mat-card-header {\n    flex-direction: column;\n    align-items: flex-start;\n    gap: 12px;\n  }\n  .calls-table td,\n  .calls-table th {\n    padding: 8px 12px !important;\n    font-size: 13px !important;\n  }\n}\n@media (max-width: 480px) {\n  .monitoring-container {\n    padding: 8px;\n  }\n  app-admin-monitoring mat-card-title {\n    font-size: 16px !important;\n  }\n  .calls-table td,\n  .calls-table th {\n    padding: 6px 8px !important;\n    font-size: 12px !important;\n  }\n  .call-state {\n    font-size: 11px;\n    padding: 4px 8px;\n  }\n}\n.action-buttons button:focus-visible {\n  outline: 3px solid #10B981 !important;\n  outline-offset: 2px;\n}\n@media (prefers-contrast: high) {\n  app-admin-monitoring mat-card {\n    border-width: 2px !important;\n  }\n  .call-state {\n    border: 2px solid currentColor !important;\n  }\n}\n@media (prefers-reduced-motion: reduce) {\n  * {\n    animation: none !important;\n    transition: none !important;\n  }\n}\n/*# sourceMappingURL=admin-monitoring.component.css.map */\n"], encapsulation: 2 });
var AdminMonitoringComponent = _AdminMonitoringComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AdminMonitoringComponent, [{
    type: Component,
    args: [{ selector: "app-admin-monitoring", standalone: true, imports: [
      CommonModule,
      MatCardModule,
      MatButtonModule,
      MatTableModule,
      MatTooltipModule,
      MatBadgeModule,
      LucideAngularModule
    ], encapsulation: ViewEncapsulation.None, template: `<div class="monitoring-container">\r
  <!-- Header -->\r
  <div class="flex items-center gap-2 mb-2">\r
    <div class="w-8 h-8 bg-gradient-to-br from-green-600 to-green-700 rounded-lg flex items-center justify-center">\r
      <lucide-angular name="phone-call" [size]="16" class="text-white"></lucide-angular>\r
    </div>\r
    <div>\r
      <h1 class="text-lg font-bold text-white">Llamadas Activas</h1>\r
      <p class="text-xs text-gray-400">Monitoreo en tiempo real de llamadas en curso</p>\r
    </div>\r
  </div>\r
\r
  <mat-card>\r
    <mat-card-content>\r
      <!-- Loading spinner -->\r
      <div *ngIf="loading" class="loading-container">\r
        <div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>\r
        <p>Cargando llamadas activas...</p>\r
      </div>\r
\r
      <!-- No active calls message -->\r
      <div *ngIf="!loading && activeCalls.length === 0" class="no-calls">\r
        <lucide-angular name="phone-off" [size]="48"></lucide-angular>\r
        <p>No hay llamadas activas en este momento</p>\r
      </div>\r
\r
      <!-- Active calls table -->\r
      <div *ngIf="!loading && activeCalls.length > 0" class="table-container">\r
        <table mat-table [dataSource]="activeCalls" class="calls-table">\r
\r
          <!-- Agent Column -->\r
          <ng-container matColumnDef="agent">\r
            <th mat-header-cell *matHeaderCellDef>Agente</th>\r
            <td mat-cell *matCellDef="let call">\r
              <div class="agent-info">\r
                <lucide-angular name="user" [size]="20"></lucide-angular>\r
                <div>\r
                  <div class="agent-name">{{call.agentName}}</div>\r
                  <div class="agent-ext">Ext: {{call.agentExtension}}</div>\r
                </div>\r
              </div>\r
            </td>\r
          </ng-container>\r
\r
          <!-- Client Column -->\r
          <ng-container matColumnDef="client">\r
            <th mat-header-cell *matHeaderCellDef>Cliente</th>\r
            <td mat-cell *matCellDef="let call">\r
              <div class="client-info">\r
                <lucide-angular name="phone" [size]="20"></lucide-angular>\r
                <span>{{call.clientNumber}}</span>\r
              </div>\r
            </td>\r
          </ng-container>\r
\r
          <!-- Duration Column -->\r
          <ng-container matColumnDef="duration">\r
            <th mat-header-cell *matHeaderCellDef>Duraci\xF3n</th>\r
            <td mat-cell *matCellDef="let call">\r
              <div class="duration">\r
                <lucide-angular name="clock" [size]="20"></lucide-angular>\r
                <span>{{formatDuration(call.duration)}}</span>\r
              </div>\r
            </td>\r
          </ng-container>\r
\r
          <!-- State Column -->\r
          <ng-container matColumnDef="state">\r
            <th mat-header-cell *matHeaderCellDef>Estado</th>\r
            <td mat-cell *matCellDef="let call">\r
              <div class="call-state" [class]="'state-' + call.callState.toLowerCase()">\r
                <lucide-angular name="phone-call" [size]="20"></lucide-angular>\r
                <span>{{call.callState}}</span>\r
              </div>\r
            </td>\r
          </ng-container>\r
\r
          <!-- Campaign Column -->\r
          <ng-container matColumnDef="campaign">\r
            <th mat-header-cell *matHeaderCellDef>Campa\xF1a</th>\r
            <td mat-cell *matCellDef="let call">\r
              <span class="campaign-name">{{call.campaignName || '-'}}</span>\r
            </td>\r
          </ng-container>\r
\r
          <!-- Actions Column -->\r
          <ng-container matColumnDef="actions">\r
            <th mat-header-cell *matHeaderCellDef>Acciones</th>\r
            <td mat-cell *matCellDef="let call">\r
              <button\r
                mat-raised-button\r
                color="primary"\r
                (click)="superviseCall(call)"\r
                matTooltip="Abrir pantalla de supervisi\xF3n">\r
                <lucide-angular name="eye" [size]="20"></lucide-angular>\r
                Supervisar\r
              </button>\r
            </td>\r
          </ng-container>\r
\r
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>\r
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>\r
        </table>\r
      </div>\r
\r
      <!-- Legend -->\r
      <div *ngIf="!loading && activeCalls.length > 0" class="legend">\r
        <h4>Modos de Monitoreo:</h4>\r
        <div class="legend-items">\r
          <div class="legend-item">\r
            <lucide-angular name="eye" [size]="20" class="text-blue-500"></lucide-angular>\r
            <span><strong>VIG\xCDA:</strong> Escuchas la llamada, pero nadie te escucha</span>\r
          </div>\r
          <div class="legend-item">\r
            <lucide-angular name="mic" [size]="20" class="text-green-500"></lucide-angular>\r
            <span><strong>SUSURRO:</strong> Solo el agente puede escucharte, el cliente no</span>\r
          </div>\r
          <div class="legend-item">\r
            <lucide-angular name="users" [size]="20" class="text-red-500"></lucide-angular>\r
            <span><strong>TRIPARTITA:</strong> Todos te escuchan (agente y cliente)</span>\r
          </div>\r
        </div>\r
      </div>\r
    </mat-card-content>\r
  </mat-card>\r
</div>\r
`, styles: ["/* src/app/features/admin/admin-monitoring/admin-monitoring.component.css */\n.monitoring-container {\n  padding: 20px;\n  max-width: 1400px;\n  margin: 0 auto;\n  background-color: #f8fafc;\n  min-height: 100vh;\n}\napp-admin-monitoring mat-card {\n  margin-bottom: 20px;\n  background-color: #ffffff !important;\n  border: 1px solid #e2e8f0 !important;\n  border-radius: 12px !important;\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;\n}\napp-admin-monitoring mat-card-header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 20px;\n  padding: 16px;\n  background-color: transparent !important;\n}\napp-admin-monitoring mat-card-title {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  font-size: 24px !important;\n  font-weight: 600 !important;\n  color: #0f172a !important;\n  margin: 0 !important;\n}\napp-admin-monitoring mat-card-title mat-icon {\n  color: #10B981 !important;\n}\napp-admin-monitoring mat-card-content {\n  padding: 16px !important;\n  color: #0f172a !important;\n}\n.header-actions {\n  display: flex;\n  gap: 10px;\n}\n.loading-container {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  padding: 60px 20px;\n}\n.loading-container p {\n  margin-top: 20px;\n  color: #64748b !important;\n  font-size: 16px;\n}\n.no-calls {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  padding: 60px 20px;\n  color: #94a3b8;\n  background-color: #f8fafc;\n  border-radius: 8px;\n  border: 1px dashed #cbd5e1;\n}\n.no-calls mat-icon {\n  font-size: 64px !important;\n  width: 64px !important;\n  height: 64px !important;\n  margin-bottom: 20px;\n  color: #cbd5e1 !important;\n}\n.no-calls p {\n  font-size: 16px;\n  color: #64748b !important;\n  margin: 0;\n}\n.table-container {\n  overflow-x: auto;\n  background-color: #ffffff;\n  border-radius: 8px;\n}\n.calls-table {\n  width: 100%;\n  background-color: #ffffff !important;\n}\n.calls-table th {\n  background-color: #f8fafc !important;\n  font-weight: 600 !important;\n  color: #0f172a !important;\n  font-size: 13px !important;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n  padding: 12px 16px !important;\n  border-bottom: 1px solid #e2e8f0 !important;\n}\n.calls-table td {\n  padding: 12px 16px !important;\n  border-bottom: 1px solid #e2e8f0 !important;\n  color: #1e293b !important;\n  font-weight: 500 !important;\n}\n.calls-table tr:last-child td {\n  border-bottom: none !important;\n}\n.calls-table tr:hover td {\n  background-color: #f8fafc !important;\n}\n.agent-info,\n.client-info,\n.duration,\n.call-state {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n}\n.agent-info mat-icon,\n.client-info mat-icon,\n.duration mat-icon {\n  color: #64748b !important;\n  font-size: 20px !important;\n  width: 20px !important;\n  height: 20px !important;\n}\n.agent-name {\n  font-weight: 600 !important;\n  color: #0f172a !important;\n}\n.agent-ext {\n  font-size: 12px;\n  color: #64748b !important;\n}\n.client-info span,\n.duration span {\n  color: #1e293b !important;\n  font-weight: 500 !important;\n}\n.call-state {\n  padding: 6px 12px;\n  border-radius: 16px;\n  font-size: 12px;\n  font-weight: 600;\n  text-transform: uppercase;\n  letter-spacing: 0.3px;\n}\n.call-state mat-icon {\n  font-size: 18px !important;\n  width: 18px !important;\n  height: 18px !important;\n}\n.call-state.state-ringing {\n  background-color: #fff7ed !important;\n  color: #ea580c !important;\n}\n.call-state.state-ringing mat-icon {\n  color: #ea580c !important;\n}\n.call-state.state-answered,\n.call-state.state-active {\n  background-color: #f0fdf4 !important;\n  color: #16a34a !important;\n}\n.call-state.state-answered mat-icon,\n.call-state.state-active mat-icon {\n  color: #16a34a !important;\n}\n.campaign-name {\n  font-size: 13px;\n  color: #334155 !important;\n  font-weight: 500 !important;\n}\n.legend {\n  margin-top: 30px;\n  padding: 20px;\n  background-color: #f8fafc !important;\n  border-radius: 8px;\n  border: 1px solid #e2e8f0 !important;\n}\n.legend h4 {\n  margin: 0 0 16px 0;\n  color: #0f172a !important;\n  font-weight: 600 !important;\n  font-size: 16px;\n}\n.legend-items {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n}\n.legend-item {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n}\n.legend-item mat-icon {\n  color: #64748b !important;\n}\n.legend-item span {\n  font-size: 14px;\n  color: #334155 !important;\n}\n.legend-item strong {\n  color: #0f172a !important;\n  font-weight: 600;\n}\n:root.dark .monitoring-container,\nbody.dark-theme .monitoring-container {\n  background-color: #0f172a !important;\n}\n:root.dark app-admin-monitoring mat-card,\nbody.dark-theme app-admin-monitoring mat-card {\n  background-color: #1e293b !important;\n  border: 1px solid #334155 !important;\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3) !important;\n}\n:root.dark app-admin-monitoring mat-card-title,\nbody.dark-theme app-admin-monitoring mat-card-title {\n  color: #f8fafc !important;\n}\n:root.dark app-admin-monitoring mat-card-title mat-icon,\nbody.dark-theme app-admin-monitoring mat-card-title mat-icon {\n  color: #10B981 !important;\n}\n:root.dark app-admin-monitoring mat-card-content,\nbody.dark-theme app-admin-monitoring mat-card-content {\n  color: #e2e8f0 !important;\n}\n:root.dark .loading-container p,\nbody.dark-theme .loading-container p {\n  color: #94a3b8 !important;\n}\n:root.dark .no-calls,\nbody.dark-theme .no-calls {\n  background-color: #0f172a !important;\n  border: 1px dashed #334155 !important;\n  color: #64748b !important;\n}\n:root.dark .no-calls mat-icon,\nbody.dark-theme .no-calls mat-icon {\n  color: #334155 !important;\n}\n:root.dark .no-calls p,\nbody.dark-theme .no-calls p {\n  color: #94a3b8 !important;\n}\n:root.dark .table-container,\nbody.dark-theme .table-container {\n  background-color: #1e293b !important;\n}\n:root.dark .calls-table,\nbody.dark-theme .calls-table {\n  background-color: #1e293b !important;\n}\n:root.dark .calls-table th,\nbody.dark-theme .calls-table th {\n  background-color: #0f172a !important;\n  color: #f8fafc !important;\n  border-bottom: 1px solid #334155 !important;\n}\n:root.dark .calls-table td,\nbody.dark-theme .calls-table td {\n  color: #e2e8f0 !important;\n  border-bottom: 1px solid #334155 !important;\n}\n:root.dark .calls-table tr:hover td,\nbody.dark-theme .calls-table tr:hover td {\n  background-color: #0f172a !important;\n}\n:root.dark .agent-info mat-icon,\n:root.dark .client-info mat-icon,\n:root.dark .duration mat-icon,\nbody.dark-theme .agent-info mat-icon,\nbody.dark-theme .client-info mat-icon,\nbody.dark-theme .duration mat-icon {\n  color: #94a3b8 !important;\n}\n:root.dark .agent-name,\nbody.dark-theme .agent-name {\n  color: #ffffff !important;\n}\n:root.dark .agent-ext,\nbody.dark-theme .agent-ext {\n  color: #64748b !important;\n}\n:root.dark .client-info span,\n:root.dark .duration span,\nbody.dark-theme .client-info span,\nbody.dark-theme .duration span {\n  color: #e2e8f0 !important;\n}\n:root.dark .call-state.state-ringing,\nbody.dark-theme .call-state.state-ringing {\n  background-color: rgba(251, 146, 60, 0.15) !important;\n  color: #fb923c !important;\n}\n:root.dark .call-state.state-ringing mat-icon,\nbody.dark-theme .call-state.state-ringing mat-icon {\n  color: #fb923c !important;\n}\n:root.dark .call-state.state-answered,\n:root.dark .call-state.state-active,\nbody.dark-theme .call-state.state-answered,\nbody.dark-theme .call-state.state-active {\n  background-color: rgba(16, 185, 129, 0.15) !important;\n  color: #10B981 !important;\n}\n:root.dark .call-state.state-answered mat-icon,\n:root.dark .call-state.state-active mat-icon,\nbody.dark-theme .call-state.state-answered mat-icon,\nbody.dark-theme .call-state.state-active mat-icon {\n  color: #10B981 !important;\n}\n:root.dark .campaign-name,\nbody.dark-theme .campaign-name {\n  color: #e2e8f0 !important;\n}\n:root.dark .legend,\nbody.dark-theme .legend {\n  background-color: #0f172a !important;\n  border: 1px solid #334155 !important;\n}\n:root.dark .legend h4,\nbody.dark-theme .legend h4 {\n  color: #f8fafc !important;\n}\n:root.dark .legend-item mat-icon,\nbody.dark-theme .legend-item mat-icon {\n  color: #94a3b8 !important;\n}\n:root.dark .legend-item span,\nbody.dark-theme .legend-item span {\n  color: #e2e8f0 !important;\n}\n:root.dark .legend-item strong,\nbody.dark-theme .legend-item strong {\n  color: #f8fafc !important;\n}\n:root.dark app-admin-monitoring button[mat-raised-button],\nbody.dark-theme app-admin-monitoring button[mat-raised-button] {\n  background-color: #10B981 !important;\n  color: #ffffff !important;\n}\n:root.dark app-admin-monitoring button[mat-raised-button]:hover,\nbody.dark-theme app-admin-monitoring button[mat-raised-button]:hover {\n  background-color: #059669 !important;\n}\n@media (max-width: 768px) {\n  .monitoring-container {\n    padding: 10px;\n  }\n  app-admin-monitoring mat-card-title {\n    font-size: 18px !important;\n  }\n  app-admin-monitoring mat-card-header {\n    flex-direction: column;\n    align-items: flex-start;\n    gap: 12px;\n  }\n  .calls-table td,\n  .calls-table th {\n    padding: 8px 12px !important;\n    font-size: 13px !important;\n  }\n}\n@media (max-width: 480px) {\n  .monitoring-container {\n    padding: 8px;\n  }\n  app-admin-monitoring mat-card-title {\n    font-size: 16px !important;\n  }\n  .calls-table td,\n  .calls-table th {\n    padding: 6px 8px !important;\n    font-size: 12px !important;\n  }\n  .call-state {\n    font-size: 11px;\n    padding: 4px 8px;\n  }\n}\n.action-buttons button:focus-visible {\n  outline: 3px solid #10B981 !important;\n  outline-offset: 2px;\n}\n@media (prefers-contrast: high) {\n  app-admin-monitoring mat-card {\n    border-width: 2px !important;\n  }\n  .call-state {\n    border: 2px solid currentColor !important;\n  }\n}\n@media (prefers-reduced-motion: reduce) {\n  * {\n    animation: none !important;\n    transition: none !important;\n  }\n}\n/*# sourceMappingURL=admin-monitoring.component.css.map */\n"] }]
  }], () => [{ type: AdminMonitoringService }, { type: WebsocketService }, { type: AuthService }, { type: Router }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AdminMonitoringComponent, { className: "AdminMonitoringComponent", filePath: "src/app/features/admin/admin-monitoring/admin-monitoring.component.ts", lineNumber: 31 });
})();
export {
  AdminMonitoringComponent
};
//# sourceMappingURL=chunk-2NXKMVYA.js.map
