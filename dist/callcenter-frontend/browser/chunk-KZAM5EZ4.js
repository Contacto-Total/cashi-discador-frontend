import {
  SipService
} from "./chunk-FHH72WSF.js";
import {
  MatChip,
  MatChipsModule
} from "./chunk-SO6AHRRM.js";
import "./chunk-MAXKR5SL.js";
import {
  AdminMonitoringService
} from "./chunk-IBGBXKRK.js";
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardModule,
  MatCardTitle
} from "./chunk-6IEEJC5K.js";
import "./chunk-NSDE3IOW.js";
import {
  MatButton,
  MatButtonModule,
  MatIconButton
} from "./chunk-M2YI7FKS.js";
import "./chunk-Q5NKAKZL.js";
import "./chunk-55FOSRV6.js";
import {
  ActivatedRoute,
  Router
} from "./chunk-OCZLH7K5.js";
import "./chunk-ZQICQP3Y.js";
import "./chunk-GRJ7XAPD.js";
import {
  LucideAngularComponent,
  LucideAngularModule
} from "./chunk-RFBUEVFE.js";
import "./chunk-QF774CZR.js";
import {
  CommonModule,
  Component,
  NgIf,
  interval,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
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
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-CTRHJBBW.js";

// src/app/features/admin/admin-call-supervision/admin-call-supervision.ts
function AdminCallSupervision_div_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 6);
    \u0275\u0275element(1, "div", 7);
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3, "Cargando detalles de la llamada...");
    \u0275\u0275elementEnd()();
  }
}
function AdminCallSupervision_div_7_div_65_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 41);
    \u0275\u0275element(1, "div", 7);
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3, "Conectando...");
    \u0275\u0275elementEnd()();
  }
}
function AdminCallSupervision_div_7_div_66_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 42)(1, "button", 43);
    \u0275\u0275listener("click", function AdminCallSupervision_div_7_div_66_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.toggleMute());
    });
    \u0275\u0275element(2, "lucide-angular", 12);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "button", 44);
    \u0275\u0275listener("click", function AdminCallSupervision_div_7_div_66_Template_button_click_4_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.disconnectSupervision());
    });
    \u0275\u0275element(5, "lucide-angular", 45);
    \u0275\u0275text(6, " Desconectar ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("color", ctx_r1.isMuted ? "warn" : "");
    \u0275\u0275advance();
    \u0275\u0275property("name", ctx_r1.isMuted ? "mic-off" : "mic")("size", 20);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.isMuted ? "Activar Micr\xF3fono" : "Silenciar", " ");
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 20);
  }
}
function AdminCallSupervision_div_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 8)(1, "mat-card", 9)(2, "mat-card-header")(3, "mat-card-title");
    \u0275\u0275text(4, "Estado de la Supervisi\xF3n");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "mat-card-content")(6, "div", 10)(7, "mat-chip", 11);
    \u0275\u0275element(8, "lucide-angular", 12);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "div", 13);
    \u0275\u0275element(11, "lucide-angular", 14);
    \u0275\u0275elementStart(12, "span");
    \u0275\u0275text(13);
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275elementStart(14, "mat-card", 15)(15, "mat-card-header")(16, "mat-card-title");
    \u0275\u0275text(17, "Informaci\xF3n de la Llamada");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(18, "mat-card-content")(19, "div", 16)(20, "div", 17);
    \u0275\u0275element(21, "lucide-angular", 18);
    \u0275\u0275elementStart(22, "div")(23, "div", 19);
    \u0275\u0275text(24, "Agente");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "div", 20);
    \u0275\u0275text(26);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "div", 21);
    \u0275\u0275text(28);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(29, "div", 17);
    \u0275\u0275element(30, "lucide-angular", 22);
    \u0275\u0275elementStart(31, "div")(32, "div", 19);
    \u0275\u0275text(33, "Cliente");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(34, "div", 20);
    \u0275\u0275text(35);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(36, "div", 21);
    \u0275\u0275text(37);
    \u0275\u0275elementEnd()()()()()();
    \u0275\u0275elementStart(38, "mat-card", 23)(39, "mat-card-header")(40, "mat-card-title");
    \u0275\u0275text(41, "Modos de Supervisi\xF3n");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(42, "mat-card-content")(43, "div", 24)(44, "button", 25);
    \u0275\u0275listener("click", function AdminCallSupervision_div_7_Template_button_click_44_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.startSpyMode());
    });
    \u0275\u0275element(45, "lucide-angular", 26);
    \u0275\u0275elementStart(46, "div", 27)(47, "span", 28);
    \u0275\u0275text(48, "Vig\xEDa");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(49, "span", 29);
    \u0275\u0275text(50, "Solo escuchar");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(51, "button", 30);
    \u0275\u0275listener("click", function AdminCallSupervision_div_7_Template_button_click_51_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.startWhisperMode());
    });
    \u0275\u0275element(52, "lucide-angular", 31);
    \u0275\u0275elementStart(53, "div", 27)(54, "span", 28);
    \u0275\u0275text(55, "Susurro");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(56, "span", 29);
    \u0275\u0275text(57, "Hablar al agente");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(58, "button", 32);
    \u0275\u0275listener("click", function AdminCallSupervision_div_7_Template_button_click_58_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.startBargeMode());
    });
    \u0275\u0275element(59, "lucide-angular", 33);
    \u0275\u0275elementStart(60, "div", 27)(61, "span", 28);
    \u0275\u0275text(62, "Tripartita");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(63, "span", 29);
    \u0275\u0275text(64, "Unirse a la llamada");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275template(65, AdminCallSupervision_div_7_div_65_Template, 4, 0, "div", 34)(66, AdminCallSupervision_div_7_div_66_Template, 7, 5, "div", 35);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(67, "mat-card", 36)(68, "mat-card-header")(69, "mat-card-title");
    \u0275\u0275text(70, "Instrucciones");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(71, "mat-card-content")(72, "div", 37);
    \u0275\u0275element(73, "lucide-angular", 38);
    \u0275\u0275elementStart(74, "div")(75, "strong");
    \u0275\u0275text(76, "Vig\xEDa:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(77, " Escuchas la conversaci\xF3n entre agente y cliente. Nadie puede escucharte. ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(78, "div", 37);
    \u0275\u0275element(79, "lucide-angular", 39);
    \u0275\u0275elementStart(80, "div")(81, "strong");
    \u0275\u0275text(82, "Susurro:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(83, " Hablas solo con el agente. El cliente no puede escucharte. ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(84, "div", 37);
    \u0275\u0275element(85, "lucide-angular", 40);
    \u0275\u0275elementStart(86, "div")(87, "strong");
    \u0275\u0275text(88, "Tripartita:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(89, " Te unes como participante completo. Todos se escuchan. ");
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(7);
    \u0275\u0275property("color", ctx_r1.getModeColor())("highlighted", ctx_r1.currentMode !== "none");
    \u0275\u0275advance();
    \u0275\u0275property("name", ctx_r1.currentMode !== "none" ? "eye" : "eye-off")("size", 16);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.getModeLabel(), " ");
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 20);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.formatDuration(ctx_r1.callDuration));
    \u0275\u0275advance(8);
    \u0275\u0275property("size", 24);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.call.agentName);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("Ext: ", ctx_r1.call.agentExtension);
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 24);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.call.clientNumber);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.call.callState);
    \u0275\u0275advance(7);
    \u0275\u0275property("disabled", ctx_r1.currentMode !== "none" || ctx_r1.isConnecting);
    \u0275\u0275advance();
    \u0275\u0275property("size", 20);
    \u0275\u0275advance(6);
    \u0275\u0275property("disabled", ctx_r1.currentMode !== "none" || ctx_r1.isConnecting);
    \u0275\u0275advance();
    \u0275\u0275property("size", 20);
    \u0275\u0275advance(6);
    \u0275\u0275property("disabled", ctx_r1.currentMode !== "none" || ctx_r1.isConnecting);
    \u0275\u0275advance();
    \u0275\u0275property("size", 20);
    \u0275\u0275advance(6);
    \u0275\u0275property("ngIf", ctx_r1.isConnecting);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.currentMode !== "none");
    \u0275\u0275advance(7);
    \u0275\u0275property("size", 24);
    \u0275\u0275advance(6);
    \u0275\u0275property("size", 24);
    \u0275\u0275advance(6);
    \u0275\u0275property("size", 24);
  }
}
var _AdminCallSupervision = class _AdminCallSupervision {
  constructor(route, router, adminService, sipService) {
    this.route = route;
    this.router = router;
    this.adminService = adminService;
    this.sipService = sipService;
    this.call = null;
    this.currentMode = "none";
    this.isConnecting = false;
    this.isMuted = false;
    this.callDuration = 0;
    this.callUuid = "";
    this.sipRegistered = false;
  }
  ngOnInit() {
    this.callUuid = this.route.snapshot.paramMap.get("callUuid") || "";
    if (!this.callUuid) {
      console.error("No call UUID provided");
      this.router.navigate(["/admin/monitoring"]);
      return;
    }
    this.loadCallDetails();
    this.initializeAdminSip();
    this.startDurationTimer();
  }
  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    if (this.currentMode !== "none") {
      this.disconnectSupervision();
    }
    this.sipService.disableAutoAnswer();
    if (this.sipRegistered) {
      this.sipService.unregister();
    }
  }
  loadCallDetails() {
    this.adminService.getActiveCall(this.callUuid).subscribe({
      next: (call) => {
        this.call = call;
        this.callDuration = call.duration;
      },
      error: (error) => {
        console.error("Error loading call details:", error);
        this.router.navigate(["/admin/monitoring"]);
      }
    });
  }
  initializeAdminSip() {
    const adminConfig = {
      extension: "1000",
      password: "admin1234",
      wsUrl: "cobranza.contactototal.com.pe:7443",
      domain: "cobranza.contactototal.com.pe"
    };
    console.log("\u{1F527} Initializing admin SIP with extension 1000");
    this.sipService.enableAutoAnswer();
    this.sipService.register(adminConfig.extension, adminConfig.password, adminConfig.wsUrl, adminConfig.domain).then(() => {
      console.log("\u2705 Admin SIP registered successfully with auto-answer enabled");
      this.sipRegistered = true;
    }).catch((error) => {
      console.error("\u274C Admin SIP registration failed:", error);
    });
  }
  startDurationTimer() {
    this.timerSubscription = interval(1e3).subscribe(() => {
      this.callDuration++;
    });
  }
  // Spy Mode (Vigía) - Admin listens only
  startSpyMode() {
    if (this.currentMode !== "none") {
      alert("Ya est\xE1s en modo de supervisi\xF3n. Desconecta primero.");
      return;
    }
    this.isConnecting = true;
    console.log("\u{1F575}\uFE0F Starting SPY mode for call:", this.callUuid);
    this.adminService.spyCall(this.callUuid).subscribe({
      next: () => {
        console.log("\u2705 SPY mode activated");
        this.currentMode = "spy";
        this.isConnecting = false;
      },
      error: (error) => {
        console.error("\u274C Error starting spy mode:", error);
        this.isConnecting = false;
        alert("Error al iniciar modo Vig\xEDa");
      }
    });
  }
  // Whisper Mode (Susurro) - Admin speaks to agent only
  startWhisperMode() {
    if (this.currentMode !== "none") {
      alert("Ya est\xE1s en modo de supervisi\xF3n. Desconecta primero.");
      return;
    }
    this.isConnecting = true;
    console.log("\u{1F5E3}\uFE0F Starting WHISPER mode for call:", this.callUuid);
    this.adminService.whisperCall(this.callUuid).subscribe({
      next: () => {
        console.log("\u2705 WHISPER mode activated");
        this.currentMode = "whisper";
        this.isConnecting = false;
      },
      error: (error) => {
        console.error("\u274C Error starting whisper mode:", error);
        this.isConnecting = false;
        alert("Error al iniciar modo Susurro");
      }
    });
  }
  // Barge Mode (Tripartita) - Admin joins as full participant
  startBargeMode() {
    if (this.currentMode !== "none") {
      alert("Ya est\xE1s en modo de supervisi\xF3n. Desconecta primero.");
      return;
    }
    this.isConnecting = true;
    console.log("\u{1F4DE} Starting BARGE mode for call:", this.callUuid);
    this.adminService.bargeCall(this.callUuid).subscribe({
      next: () => {
        console.log("\u2705 BARGE mode activated");
        this.currentMode = "barge";
        this.isConnecting = false;
      },
      error: (error) => {
        console.error("\u274C Error starting barge mode:", error);
        this.isConnecting = false;
        alert("Error al iniciar modo Tripartita");
      }
    });
  }
  // Disconnect from supervision
  disconnectSupervision() {
    console.log("\u{1F50C} Disconnecting from supervision");
    this.sipService.hangup();
    this.currentMode = "none";
    this.isMuted = false;
  }
  // Toggle mute/unmute
  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.sipService.mute();
    } else {
      this.sipService.unmute();
    }
    console.log(this.isMuted ? "\u{1F507} Muted" : "\u{1F50A} Unmuted");
  }
  // Go back to monitoring list
  goBack() {
    this.router.navigate(["/admin/monitoring"]);
  }
  // Format duration as MM:SS
  formatDuration(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  // Get mode label in Spanish
  getModeLabel() {
    switch (this.currentMode) {
      case "spy":
        return "Vig\xEDa";
      case "whisper":
        return "Susurro";
      case "barge":
        return "Tripartita";
      default:
        return "Sin conexi\xF3n";
    }
  }
  // Get mode color
  getModeColor() {
    switch (this.currentMode) {
      case "spy":
        return "accent";
      case "whisper":
        return "primary";
      case "barge":
        return "warn";
      default:
        return "";
    }
  }
};
_AdminCallSupervision.\u0275fac = function AdminCallSupervision_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _AdminCallSupervision)(\u0275\u0275directiveInject(ActivatedRoute), \u0275\u0275directiveInject(Router), \u0275\u0275directiveInject(AdminMonitoringService), \u0275\u0275directiveInject(SipService));
};
_AdminCallSupervision.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AdminCallSupervision, selectors: [["app-admin-call-supervision"]], decls: 8, vars: 3, consts: [[1, "supervision-container"], [1, "supervision-header"], ["mat-icon-button", "", 3, "click"], ["name", "arrow-left", 3, "size"], ["class", "loading-container", 4, "ngIf"], ["class", "call-details-container", 4, "ngIf"], [1, "loading-container"], [1, "w-8", "h-8", "border-4", "border-blue-500", "border-t-transparent", "rounded-full", "animate-spin"], [1, "call-details-container"], [1, "status-card"], [1, "status-info"], [3, "color", "highlighted"], [3, "name", "size"], [1, "duration"], ["name", "clock", 3, "size"], [1, "info-card"], [1, "info-grid"], [1, "info-item"], ["name", "user", 3, "size"], [1, "info-label"], [1, "info-value"], [1, "info-sublabel"], ["name", "phone", 3, "size"], [1, "controls-card"], [1, "mode-buttons"], ["mat-raised-button", "", "color", "accent", 1, "mode-button", 3, "click", "disabled"], ["name", "eye", 3, "size"], [1, "button-content"], [1, "mode-name"], [1, "mode-description"], ["mat-raised-button", "", "color", "primary", 1, "mode-button", 3, "click", "disabled"], ["name", "mic", 3, "size"], ["mat-raised-button", "", "color", "warn", 1, "mode-button", 3, "click", "disabled"], ["name", "users", 3, "size"], ["class", "connecting-status", 4, "ngIf"], ["class", "active-controls", 4, "ngIf"], [1, "instructions-card"], [1, "instruction-item"], ["name", "eye", 1, "text-blue-500", 3, "size"], ["name", "mic", 1, "text-green-500", 3, "size"], ["name", "users", 1, "text-red-500", 3, "size"], [1, "connecting-status"], [1, "active-controls"], ["mat-raised-button", "", 3, "click", "color"], ["mat-raised-button", "", "color", "warn", 3, "click"], ["name", "phone-off", 3, "size"]], template: function AdminCallSupervision_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "button", 2);
    \u0275\u0275listener("click", function AdminCallSupervision_Template_button_click_2_listener() {
      return ctx.goBack();
    });
    \u0275\u0275element(3, "lucide-angular", 3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "h2");
    \u0275\u0275text(5, "Supervisi\xF3n de Llamada");
    \u0275\u0275elementEnd()();
    \u0275\u0275template(6, AdminCallSupervision_div_6_Template, 4, 0, "div", 4)(7, AdminCallSupervision_div_7_Template, 90, 24, "div", 5);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance(3);
    \u0275\u0275property("size", 20);
    \u0275\u0275advance(3);
    \u0275\u0275property("ngIf", !ctx.call);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.call);
  }
}, dependencies: [CommonModule, NgIf, MatCardModule, MatCard, MatCardContent, MatCardHeader, MatCardTitle, MatButtonModule, MatButton, MatIconButton, MatChipsModule, MatChip, LucideAngularModule, LucideAngularComponent], styles: ["\n\n.supervision-container[_ngcontent-%COMP%] {\n  padding: 20px;\n  max-width: 1200px;\n  margin: 0 auto;\n}\n.supervision-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 16px;\n  margin-bottom: 24px;\n}\n.supervision-header[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 24px;\n  font-weight: 500;\n}\n.loading-container[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  padding: 60px 20px;\n  gap: 20px;\n}\n.loading-container[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  font-size: 16px;\n  color: #666;\n}\n.call-details-container[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 20px;\n}\n.status-card[_ngcontent-%COMP%]   mat-card-content[_ngcontent-%COMP%] {\n  padding-top: 16px;\n}\n.status-info[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  flex-wrap: wrap;\n  gap: 16px;\n}\n.status-info[_ngcontent-%COMP%]   mat-chip[_ngcontent-%COMP%] {\n  font-size: 14px;\n}\n.status-info[_ngcontent-%COMP%]   mat-chip[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  margin-right: 8px;\n}\n.duration[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  font-size: 18px;\n  font-weight: 500;\n}\n.duration[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  color: #666;\n}\n.info-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n  gap: 24px;\n  padding: 8px 0;\n}\n.info-item[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 16px;\n  align-items: flex-start;\n}\n.info-item[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  color: #3f51b5;\n  margin-top: 4px;\n}\n.info-label[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: #666;\n  text-transform: uppercase;\n  margin-bottom: 4px;\n}\n.info-value[_ngcontent-%COMP%] {\n  font-size: 18px;\n  font-weight: 500;\n  margin-bottom: 2px;\n}\n.info-sublabel[_ngcontent-%COMP%] {\n  font-size: 14px;\n  color: #888;\n}\n.mode-buttons[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));\n  gap: 16px;\n  margin-bottom: 20px;\n}\n.mode-button[_ngcontent-%COMP%] {\n  min-height: 80px !important;\n  display: flex !important;\n  flex-direction: column !important;\n  align-items: center !important;\n  justify-content: center !important;\n  gap: 8px !important;\n  padding: 16px !important;\n}\n.mode-button[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 32px;\n  width: 32px;\n  height: 32px;\n}\n.button-content[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  text-align: center;\n}\n.mode-name[_ngcontent-%COMP%] {\n  font-size: 16px;\n  font-weight: 500;\n}\n.mode-description[_ngcontent-%COMP%] {\n  font-size: 12px;\n  opacity: 0.8;\n}\n.connecting-status[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 16px;\n  padding: 20px;\n  background-color: #f5f5f5;\n  border-radius: 4px;\n  margin-bottom: 16px;\n}\n.active-controls[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 12px;\n  justify-content: center;\n  flex-wrap: wrap;\n  padding: 20px;\n  background-color: #e3f2fd;\n  border-radius: 4px;\n}\n.active-controls[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  min-width: 160px;\n}\n.instruction-item[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 16px;\n  align-items: flex-start;\n  padding: 12px 0;\n}\n.instruction-item[_ngcontent-%COMP%]:not(:last-child) {\n  border-bottom: 1px solid #e0e0e0;\n}\n.instruction-item[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  margin-top: 2px;\n}\n.instruction-item[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #333;\n}\n@media (max-width: 768px) {\n  .supervision-container[_ngcontent-%COMP%] {\n    padding: 12px;\n  }\n  .mode-buttons[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .info-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .active-controls[_ngcontent-%COMP%] {\n    flex-direction: column;\n  }\n  .active-controls[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n    width: 100%;\n  }\n}\n/*# sourceMappingURL=admin-call-supervision.css.map */"] });
var AdminCallSupervision = _AdminCallSupervision;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AdminCallSupervision, [{
    type: Component,
    args: [{ selector: "app-admin-call-supervision", standalone: true, imports: [
      CommonModule,
      MatCardModule,
      MatButtonModule,
      MatChipsModule,
      LucideAngularModule
    ], template: `<div class="supervision-container">\r
  <!-- Header -->\r
  <div class="supervision-header">\r
    <button mat-icon-button (click)="goBack()">\r
      <lucide-angular name="arrow-left" [size]="20"></lucide-angular>\r
    </button>\r
    <h2>Supervisi\xF3n de Llamada</h2>\r
  </div>\r
\r
  <!-- Loading state -->\r
  <div *ngIf="!call" class="loading-container">\r
    <div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>\r
    <p>Cargando detalles de la llamada...</p>\r
  </div>\r
\r
  <!-- Call details -->\r
  <div *ngIf="call" class="call-details-container">\r
    <!-- Status card -->\r
    <mat-card class="status-card">\r
      <mat-card-header>\r
        <mat-card-title>Estado de la Supervisi\xF3n</mat-card-title>\r
      </mat-card-header>\r
      <mat-card-content>\r
        <div class="status-info">\r
          <mat-chip [color]="getModeColor()" [highlighted]="currentMode !== 'none'">\r
            <lucide-angular [name]="currentMode !== 'none' ? 'eye' : 'eye-off'" [size]="16"></lucide-angular>\r
            {{ getModeLabel() }}\r
          </mat-chip>\r
          <div class="duration">\r
            <lucide-angular name="clock" [size]="20"></lucide-angular>\r
            <span>{{ formatDuration(callDuration) }}</span>\r
          </div>\r
        </div>\r
      </mat-card-content>\r
    </mat-card>\r
\r
    <!-- Call information card -->\r
    <mat-card class="info-card">\r
      <mat-card-header>\r
        <mat-card-title>Informaci\xF3n de la Llamada</mat-card-title>\r
      </mat-card-header>\r
      <mat-card-content>\r
        <div class="info-grid">\r
          <div class="info-item">\r
            <lucide-angular name="user" [size]="24"></lucide-angular>\r
            <div>\r
              <div class="info-label">Agente</div>\r
              <div class="info-value">{{ call.agentName }}</div>\r
              <div class="info-sublabel">Ext: {{ call.agentExtension }}</div>\r
            </div>\r
          </div>\r
\r
          <div class="info-item">\r
            <lucide-angular name="phone" [size]="24"></lucide-angular>\r
            <div>\r
              <div class="info-label">Cliente</div>\r
              <div class="info-value">{{ call.clientNumber }}</div>\r
              <div class="info-sublabel">{{ call.callState }}</div>\r
            </div>\r
          </div>\r
        </div>\r
      </mat-card-content>\r
    </mat-card>\r
\r
    <!-- Supervision controls -->\r
    <mat-card class="controls-card">\r
      <mat-card-header>\r
        <mat-card-title>Modos de Supervisi\xF3n</mat-card-title>\r
      </mat-card-header>\r
      <mat-card-content>\r
        <div class="mode-buttons">\r
          <!-- Spy Mode (Vig\xEDa) -->\r
          <button\r
            mat-raised-button\r
            color="accent"\r
            class="mode-button"\r
            [disabled]="currentMode !== 'none' || isConnecting"\r
            (click)="startSpyMode()">\r
            <lucide-angular name="eye" [size]="20"></lucide-angular>\r
            <div class="button-content">\r
              <span class="mode-name">Vig\xEDa</span>\r
              <span class="mode-description">Solo escuchar</span>\r
            </div>\r
          </button>\r
\r
          <!-- Whisper Mode (Susurro) -->\r
          <button\r
            mat-raised-button\r
            color="primary"\r
            class="mode-button"\r
            [disabled]="currentMode !== 'none' || isConnecting"\r
            (click)="startWhisperMode()">\r
            <lucide-angular name="mic" [size]="20"></lucide-angular>\r
            <div class="button-content">\r
              <span class="mode-name">Susurro</span>\r
              <span class="mode-description">Hablar al agente</span>\r
            </div>\r
          </button>\r
\r
          <!-- Barge Mode (Tripartita) -->\r
          <button\r
            mat-raised-button\r
            color="warn"\r
            class="mode-button"\r
            [disabled]="currentMode !== 'none' || isConnecting"\r
            (click)="startBargeMode()">\r
            <lucide-angular name="users" [size]="20"></lucide-angular>\r
            <div class="button-content">\r
              <span class="mode-name">Tripartita</span>\r
              <span class="mode-description">Unirse a la llamada</span>\r
            </div>\r
          </button>\r
        </div>\r
\r
        <!-- Connection status -->\r
        <div *ngIf="isConnecting" class="connecting-status">\r
          <div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>\r
          <span>Conectando...</span>\r
        </div>\r
\r
        <!-- Active controls (when connected) -->\r
        <div *ngIf="currentMode !== 'none'" class="active-controls">\r
          <button\r
            mat-raised-button\r
            [color]="isMuted ? 'warn' : ''"\r
            (click)="toggleMute()">\r
            <lucide-angular [name]="isMuted ? 'mic-off' : 'mic'" [size]="20"></lucide-angular>\r
            {{ isMuted ? 'Activar Micr\xF3fono' : 'Silenciar' }}\r
          </button>\r
\r
          <button\r
            mat-raised-button\r
            color="warn"\r
            (click)="disconnectSupervision()">\r
            <lucide-angular name="phone-off" [size]="20"></lucide-angular>\r
            Desconectar\r
          </button>\r
        </div>\r
      </mat-card-content>\r
    </mat-card>\r
\r
    <!-- Instructions card -->\r
    <mat-card class="instructions-card">\r
      <mat-card-header>\r
        <mat-card-title>Instrucciones</mat-card-title>\r
      </mat-card-header>\r
      <mat-card-content>\r
        <div class="instruction-item">\r
          <lucide-angular name="eye" [size]="24" class="text-blue-500"></lucide-angular>\r
          <div>\r
            <strong>Vig\xEDa:</strong> Escuchas la conversaci\xF3n entre agente y cliente. Nadie puede escucharte.\r
          </div>\r
        </div>\r
        <div class="instruction-item">\r
          <lucide-angular name="mic" [size]="24" class="text-green-500"></lucide-angular>\r
          <div>\r
            <strong>Susurro:</strong> Hablas solo con el agente. El cliente no puede escucharte.\r
          </div>\r
        </div>\r
        <div class="instruction-item">\r
          <lucide-angular name="users" [size]="24" class="text-red-500"></lucide-angular>\r
          <div>\r
            <strong>Tripartita:</strong> Te unes como participante completo. Todos se escuchan.\r
          </div>\r
        </div>\r
      </mat-card-content>\r
    </mat-card>\r
  </div>\r
</div>\r
`, styles: ["/* src/app/features/admin/admin-call-supervision/admin-call-supervision.css */\n.supervision-container {\n  padding: 20px;\n  max-width: 1200px;\n  margin: 0 auto;\n}\n.supervision-header {\n  display: flex;\n  align-items: center;\n  gap: 16px;\n  margin-bottom: 24px;\n}\n.supervision-header h2 {\n  margin: 0;\n  font-size: 24px;\n  font-weight: 500;\n}\n.loading-container {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  padding: 60px 20px;\n  gap: 20px;\n}\n.loading-container p {\n  font-size: 16px;\n  color: #666;\n}\n.call-details-container {\n  display: flex;\n  flex-direction: column;\n  gap: 20px;\n}\n.status-card mat-card-content {\n  padding-top: 16px;\n}\n.status-info {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  flex-wrap: wrap;\n  gap: 16px;\n}\n.status-info mat-chip {\n  font-size: 14px;\n}\n.status-info mat-chip mat-icon {\n  margin-right: 8px;\n}\n.duration {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  font-size: 18px;\n  font-weight: 500;\n}\n.duration mat-icon {\n  color: #666;\n}\n.info-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n  gap: 24px;\n  padding: 8px 0;\n}\n.info-item {\n  display: flex;\n  gap: 16px;\n  align-items: flex-start;\n}\n.info-item mat-icon {\n  color: #3f51b5;\n  margin-top: 4px;\n}\n.info-label {\n  font-size: 12px;\n  color: #666;\n  text-transform: uppercase;\n  margin-bottom: 4px;\n}\n.info-value {\n  font-size: 18px;\n  font-weight: 500;\n  margin-bottom: 2px;\n}\n.info-sublabel {\n  font-size: 14px;\n  color: #888;\n}\n.mode-buttons {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));\n  gap: 16px;\n  margin-bottom: 20px;\n}\n.mode-button {\n  min-height: 80px !important;\n  display: flex !important;\n  flex-direction: column !important;\n  align-items: center !important;\n  justify-content: center !important;\n  gap: 8px !important;\n  padding: 16px !important;\n}\n.mode-button mat-icon {\n  font-size: 32px;\n  width: 32px;\n  height: 32px;\n}\n.button-content {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  text-align: center;\n}\n.mode-name {\n  font-size: 16px;\n  font-weight: 500;\n}\n.mode-description {\n  font-size: 12px;\n  opacity: 0.8;\n}\n.connecting-status {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 16px;\n  padding: 20px;\n  background-color: #f5f5f5;\n  border-radius: 4px;\n  margin-bottom: 16px;\n}\n.active-controls {\n  display: flex;\n  gap: 12px;\n  justify-content: center;\n  flex-wrap: wrap;\n  padding: 20px;\n  background-color: #e3f2fd;\n  border-radius: 4px;\n}\n.active-controls button {\n  min-width: 160px;\n}\n.instruction-item {\n  display: flex;\n  gap: 16px;\n  align-items: flex-start;\n  padding: 12px 0;\n}\n.instruction-item:not(:last-child) {\n  border-bottom: 1px solid #e0e0e0;\n}\n.instruction-item mat-icon {\n  margin-top: 2px;\n}\n.instruction-item strong {\n  color: #333;\n}\n@media (max-width: 768px) {\n  .supervision-container {\n    padding: 12px;\n  }\n  .mode-buttons {\n    grid-template-columns: 1fr;\n  }\n  .info-grid {\n    grid-template-columns: 1fr;\n  }\n  .active-controls {\n    flex-direction: column;\n  }\n  .active-controls button {\n    width: 100%;\n  }\n}\n/*# sourceMappingURL=admin-call-supervision.css.map */\n"] }]
  }], () => [{ type: ActivatedRoute }, { type: Router }, { type: AdminMonitoringService }, { type: SipService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AdminCallSupervision, { className: "AdminCallSupervision", filePath: "src/app/features/admin/admin-call-supervision/admin-call-supervision.ts", lineNumber: 36 });
})();
export {
  AdminCallSupervision
};
//# sourceMappingURL=chunk-KZAM5EZ4.js.map
