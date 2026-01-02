import {
  AutoDialerService
} from "./chunk-32PRT2X7.js";
import {
  StatusAlarmClockComponent
} from "./chunk-IRGKDA7E.js";
import {
  CampaignAdminService
} from "./chunk-MXUAS7RP.js";
import {
  Router
} from "./chunk-OCZLH7K5.js";
import "./chunk-ZQICQP3Y.js";
import {
  FormsModule,
  NgControlStatus,
  NgModel,
  NgSelectOption,
  SelectControlValueAccessor,
  ɵNgSelectMultipleOption
} from "./chunk-GRJ7XAPD.js";
import {
  LucideAngularComponent,
  LucideAngularModule
} from "./chunk-RFBUEVFE.js";
import "./chunk-QF774CZR.js";
import {
  CommonModule,
  Component,
  DatePipe,
  NgForOf,
  NgIf,
  ViewEncapsulation,
  interval,
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
  ɵɵpipe,
  ɵɵpipeBind2,
  ɵɵproperty,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-CTRHJBBW.js";

// src/app/features/admin/campaign-monitoring/campaign-monitoring.component.ts
function CampaignMonitoringComponent_option_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 36);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const campaign_r1 = ctx.$implicit;
    \u0275\u0275property("value", campaign_r1.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2(" ", campaign_r1.name, " (", campaign_r1.status, ") ");
  }
}
function CampaignMonitoringComponent_div_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 37)(1, "h3");
    \u0275\u0275element(2, "lucide-angular", 38);
    \u0275\u0275text(3, " M\xE9tricas del Auto-Dialer en Tiempo Real");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 39)(5, "div", 40)(6, "span", 41);
    \u0275\u0275element(7, "lucide-angular", 38);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "div", 42)(9, "span", 43);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "span", 44);
    \u0275\u0275text(12, "Total llamadas");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(13, "div", 40)(14, "span", 41);
    \u0275\u0275element(15, "lucide-angular", 45);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "div", 42)(17, "span", 43);
    \u0275\u0275text(18);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "span", 44);
    \u0275\u0275text(20, "Llamadas en cola");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(21, "div", 40)(22, "span", 41);
    \u0275\u0275element(23, "lucide-angular", 46);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "div", 42)(25, "span", 43);
    \u0275\u0275text(26);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "span", 44);
    \u0275\u0275text(28, "Llamadas conectadas");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(29, "div", 40)(30, "span", 41);
    \u0275\u0275element(31, "lucide-angular", 47);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(32, "div", 42)(33, "span", 43);
    \u0275\u0275text(34);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(35, "span", 44);
    \u0275\u0275text(36, "Llamadas por realizar");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(37, "div", 40)(38, "span", 41);
    \u0275\u0275element(39, "lucide-angular", 20);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(40, "div", 42)(41, "span", 43);
    \u0275\u0275text(42);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(43, "span", 44);
    \u0275\u0275text(44, "Llamadas siendo marcadas");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(45, "div", 40)(46, "span", 41);
    \u0275\u0275element(47, "lucide-angular", 48);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(48, "div", 42)(49, "span", 43);
    \u0275\u0275text(50);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(51, "span", 44);
    \u0275\u0275text(52, "Llamadas siendo procesadas");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(53, "div", 40)(54, "span", 41);
    \u0275\u0275element(55, "lucide-angular", 49);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(56, "div", 42)(57, "span", 43);
    \u0275\u0275text(58);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(59, "span", 44);
    \u0275\u0275text(60, "Llamadas fallidas");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(61, "div", 40)(62, "span", 41);
    \u0275\u0275element(63, "lucide-angular", 50);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(64, "div", 42)(65, "span", 43);
    \u0275\u0275text(66);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(67, "span", 44);
    \u0275\u0275text(68, "Llamadas no contestadas");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(69, "div", 40)(70, "span", 41);
    \u0275\u0275element(71, "lucide-angular", 51);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(72, "div", 42)(73, "span", 43);
    \u0275\u0275text(74);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(75, "span", 44);
    \u0275\u0275text(76, "Llamadas abandonadas");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(77, "div", 40)(78, "span", 41);
    \u0275\u0275element(79, "lucide-angular", 45);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(80, "div", 42)(81, "span", 43);
    \u0275\u0275text(82);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(83, "span", 44);
    \u0275\u0275text(84, "Duraci\xF3n promedio de llamada");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(85, "div", 40)(86, "span", 41);
    \u0275\u0275element(87, "lucide-angular", 52);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(88, "div", 42)(89, "span", 43);
    \u0275\u0275text(90);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(91, "span", 44);
    \u0275\u0275text(92, "Duraci\xF3n m\xE1xima de llamada");
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 20);
    \u0275\u0275advance(5);
    \u0275\u0275property("size", 24);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.autoDialerStats.totalLlamadas);
    \u0275\u0275advance(5);
    \u0275\u0275property("size", 24);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.autoDialerStats.llamadasEnCola);
    \u0275\u0275advance(5);
    \u0275\u0275property("size", 24);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.autoDialerStats.llamadasConectadas);
    \u0275\u0275advance(5);
    \u0275\u0275property("size", 24);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.autoDialerStats.contactosPendientes);
    \u0275\u0275advance(5);
    \u0275\u0275property("size", 24);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.autoDialerStats.llamadasMarcando);
    \u0275\u0275advance(5);
    \u0275\u0275property("size", 24);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.autoDialerStats.llamadasActivas);
    \u0275\u0275advance(5);
    \u0275\u0275property("size", 24);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.autoDialerStats.contactosFallidos);
    \u0275\u0275advance(5);
    \u0275\u0275property("size", 24);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.autoDialerStats.llamadasNoContestadas);
    \u0275\u0275advance(5);
    \u0275\u0275property("size", 24);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.autoDialerStats.llamadasAbandonadas);
    \u0275\u0275advance(5);
    \u0275\u0275property("size", 24);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.autoDialerStats.duracionPromedioFormato);
    \u0275\u0275advance(5);
    \u0275\u0275property("size", 24);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.autoDialerStats.duracionMaximaFormato);
  }
}
function CampaignMonitoringComponent_tr_47_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr", 53)(1, "td", 54);
    \u0275\u0275text(2);
    \u0275\u0275pipe(3, "date");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "td", 55);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "td", 56);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "td", 57)(9, "span", 58);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "td", 59);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const llamada_r3 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(3, 5, llamada_r3.fechaInicio, "HH:mm:ss"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(llamada_r3.anexoDestino);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(llamada_r3.nombreAgente);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(llamada_r3.estadoLlamada);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.formatTiempo(llamada_r3.duracionSegundos));
  }
}
function CampaignMonitoringComponent_tr_48_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr", 60)(1, "td", 61);
    \u0275\u0275text(2, " No hay llamadas en curso ");
    \u0275\u0275elementEnd()();
  }
}
function CampaignMonitoringComponent_tr_73_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr", 62)(1, "td", 63)(2, "div", 64);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 65);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "td", 66)(7, "span", 67);
    \u0275\u0275element(8, "lucide-angular", 10);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "td", 68);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "td", 69);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "td", 70);
    \u0275\u0275element(15, "app-status-alarm-clock", 71);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const agente_r4 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275classProp("alert-row", agente_r4.excedeTiempoMaximo);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("SIP/", agente_r4.sipExtension);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(agente_r4.nombreCompleto);
    \u0275\u0275advance(2);
    \u0275\u0275styleProp("background-color", ctx_r1.getEstadoColor(agente_r4.estadoActual));
    \u0275\u0275advance();
    \u0275\u0275property("name", ctx_r1.getEstadoIcon(agente_r4.estadoActual))("size", 14);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.getEstadoTexto(agente_r4.estadoActual), " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", agente_r4.telefonoDestino || "-", " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r1.formatTiempo(agente_r4.segundosEnEstado), " ");
    \u0275\u0275advance(2);
    \u0275\u0275property("color", agente_r4.colorIndicador)("excedido", agente_r4.excedeTiempoMaximo)("size", 20)("tooltip", agente_r4.mensajeAlerta || "");
  }
}
function CampaignMonitoringComponent_tr_74_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr", 60)(1, "td", 61);
    \u0275\u0275text(2, " No hay agentes registrados ");
    \u0275\u0275elementEnd()();
  }
}
function CampaignMonitoringComponent_div_75_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 72);
    \u0275\u0275listener("click", function CampaignMonitoringComponent_div_75_Template_div_click_0_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onOverlayClick($event));
    });
    \u0275\u0275elementStart(1, "div", 73)(2, "button", 74);
    \u0275\u0275listener("click", function CampaignMonitoringComponent_div_75_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.dismissAlert());
    });
    \u0275\u0275element(3, "lucide-angular", 75);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 76)(5, "div", 77);
    \u0275\u0275element(6, "lucide-angular", 78);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "h3");
    \u0275\u0275text(8, "Alerta de Agente");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "div", 79)(10, "div", 80)(11, "div", 81);
    \u0275\u0275element(12, "lucide-angular", 82);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "div", 83)(14, "span", 84);
    \u0275\u0275text(15);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "span", 85);
    \u0275\u0275text(17);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(18, "div", 86)(19, "span", 87);
    \u0275\u0275text(20, "Estado:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "span", 88);
    \u0275\u0275text(22);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(23, "div", 89);
    \u0275\u0275element(24, "lucide-angular", 45);
    \u0275\u0275elementStart(25, "span");
    \u0275\u0275text(26, "Tiempo en estado: ");
    \u0275\u0275elementStart(27, "strong");
    \u0275\u0275text(28);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(29, "div", 90);
    \u0275\u0275element(30, "lucide-angular", 91);
    \u0275\u0275elementStart(31, "span");
    \u0275\u0275text(32);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(33, "div", 92)(34, "button", 93);
    \u0275\u0275listener("click", function CampaignMonitoringComponent_div_75_Template_button_click_34_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.dismissAlert());
    });
    \u0275\u0275text(35, " Entendido ");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275property("size", 20);
    \u0275\u0275advance(3);
    \u0275\u0275property("size", 32);
    \u0275\u0275advance(6);
    \u0275\u0275property("size", 24);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.alertaActiva.agente.nombreCompleto);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("SIP/", ctx_r1.alertaActiva.agente.sipExtension);
    \u0275\u0275advance(4);
    \u0275\u0275styleProp("background-color", ctx_r1.getEstadoColor(ctx_r1.alertaActiva.agente.estadoActual));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.getEstadoTexto(ctx_r1.alertaActiva.agente.estadoActual), " ");
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 18);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.formatTiempo(ctx_r1.alertaActiva.agente.segundosEnEstado));
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 18);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.alertaActiva.agente.mensajeAlerta);
  }
}
var _CampaignMonitoringComponent = class _CampaignMonitoringComponent {
  constructor(campaignService, autoDialerService, router) {
    this.campaignService = campaignService;
    this.autoDialerService = autoDialerService;
    this.router = router;
    this.campaigns = [];
    this.selectedCampaignId = null;
    this.loadingCampaigns = false;
    this.autoDialerStats = null;
    this.agentesMonitoreo = [];
    this.llamadasEnTiempoReal = [];
    this.alertaActiva = null;
    this.alertasDismissed = /* @__PURE__ */ new Set();
    this.soundEnabled = false;
    this.SOUND_STORAGE_KEY = "supervisor_sound_enabled";
    this.audioContext = null;
    this.oscillator = null;
    this.gainNode = null;
    this.isAlarmPlaying = false;
    this.previousAgentStates = /* @__PURE__ */ new Map();
  }
  ngOnInit() {
    this.loadSoundPreference();
    this.initAlarmAudio();
    this.loadCampaigns();
    this.startAutoDialerPolling();
    this.startAgentesPolling();
    this.startLlamadasPolling();
    this.startLocalTimer();
  }
  /**
   * Timer local que incrementa los segundos cada 1 segundo
   * para que el conteo sea fluido en lugar de saltar cada 3-5 segundos
   */
  startLocalTimer() {
    this.localTimerSubscription = interval(1e3).subscribe(() => {
      this.agentesMonitoreo.forEach((agente) => {
        if (agente.segundosEnEstado !== void 0) {
          agente.segundosEnEstado++;
        }
      });
    });
  }
  /**
   * Carga la preferencia de sonido desde localStorage
   */
  loadSoundPreference() {
    const saved = localStorage.getItem(this.SOUND_STORAGE_KEY);
    this.soundEnabled = saved === "true";
  }
  /**
   * Guarda la preferencia de sonido en localStorage
   */
  saveSoundPreference() {
    localStorage.setItem(this.SOUND_STORAGE_KEY, String(this.soundEnabled));
  }
  ngOnDestroy() {
    if (this.localTimerSubscription) {
      this.localTimerSubscription.unsubscribe();
    }
    if (this.autoDialerSubscription) {
      this.autoDialerSubscription.unsubscribe();
    }
    if (this.agentesSubscription) {
      this.agentesSubscription.unsubscribe();
    }
    if (this.llamadasSubscription) {
      this.llamadasSubscription.unsubscribe();
    }
    this.stopAlarm();
    if (this.audioContext) {
      this.audioContext.close();
    }
  }
  /**
   * Inicializa el audio de alarma usando Web Audio API para generar un beep
   */
  initAlarmAudio() {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  /**
   * Carga todas las campañas para el selector
   */
  loadCampaigns() {
    this.loadingCampaigns = true;
    this.campaignService.getAllCampaigns().subscribe({
      next: (campaigns) => {
        this.campaigns = campaigns;
        this.loadingCampaigns = false;
        if (campaigns.length > 0 && !this.selectedCampaignId) {
          const activeCampaign = campaigns.find((c) => c.status === "ACTIVE");
          this.selectedCampaignId = activeCampaign?.id || campaigns[0].id || null;
        }
      },
      error: (err) => {
        console.error("Error loading campaigns:", err);
        this.loadingCampaigns = false;
      }
    });
  }
  /**
   * Handler cuando se selecciona una campaña diferente
   */
  onCampaignChange() {
    console.log("Selected campaign changed to:", this.selectedCampaignId);
    if (this.autoDialerSubscription) {
      this.autoDialerSubscription.unsubscribe();
    }
    this.startAutoDialerPolling();
    if (this.llamadasSubscription) {
      this.llamadasSubscription.unsubscribe();
    }
    this.startLlamadasPolling();
  }
  /**
   * Inicia polling del estado del auto-dialer cada 5 segundos
   * Filtra por campaña si hay una seleccionada
   */
  startAutoDialerPolling() {
    const campaignId = this.selectedCampaignId || void 0;
    this.autoDialerSubscription = this.autoDialerService.startStatsPolling(campaignId).subscribe({
      next: (stats) => {
        this.autoDialerStats = stats;
      },
      error: (err) => {
        console.error("Error polling auto-dialer stats:", err);
      }
    });
  }
  /**
   * Inicia polling de agentes cada 3 segundos
   */
  startAgentesPolling() {
    this.agentesSubscription = this.autoDialerService.startAgentesPolling().subscribe({
      next: (agentes) => {
        this.agentesMonitoreo = agentes;
        const agentesExcedidos = agentes.filter((a) => a.excedeTiempoMaximo);
        if (agentesExcedidos.length > 0) {
          console.log("[Monitor] Agentes con tiempo excedido:", agentesExcedidos.map((a) => ({
            nombre: a.nombreCompleto,
            estado: a.estadoActual,
            excede: a.excedeTiempoMaximo,
            mensaje: a.mensajeAlerta,
            sonido: a.sonidoAlerta
          })));
        }
        this.checkAgentAlerts(agentes);
      },
      error: (err) => {
        console.error("Error polling agentes:", err);
      }
    });
  }
  /**
   * Verifica si hay agentes que exceden el tiempo y muestra alerta
   */
  checkAgentAlerts(agentes) {
    for (const agente of agentes) {
      const prevState = this.previousAgentStates.get(agente.idUsuario);
      if (prevState && prevState !== agente.estadoActual) {
        console.log(`[Monitor] Agente ${agente.nombreCompleto} cambi\xF3 de ${prevState} a ${agente.estadoActual}, limpiando alertas`);
        this.clearDismissedForAgent(agente.idUsuario);
      }
      this.previousAgentStates.set(agente.idUsuario, agente.estadoActual);
    }
    if (this.alertaActiva) {
      console.log("[Monitor] Ya hay una alerta activa, no se mostrar\xE1n nuevas");
      return;
    }
    for (const agente of agentes) {
      if (agente.excedeTiempoMaximo && agente.mensajeAlerta) {
        const alertKey = `${agente.idUsuario}-${agente.estadoActual}`;
        if (this.alertasDismissed.has(alertKey)) {
          console.log(`[Monitor] Alerta ${alertKey} ya fue cerrada, ignorando`);
          continue;
        }
        console.log(`[Monitor] Mostrando alerta para agente ${agente.nombreCompleto}`);
        this.showAlert(agente);
        break;
      }
    }
  }
  /**
   * Muestra la alerta para un agente
   */
  showAlert(agente) {
    this.alertaActiva = {
      agente,
      timestamp: /* @__PURE__ */ new Date()
    };
    if (agente.sonidoAlerta && this.soundEnabled) {
      this.speakAlert(agente);
      this.playAlarm();
    }
  }
  /**
   * Usa Text-to-Speech para anunciar la alerta (voz tipo Jarvis)
   */
  speakAlert(agente) {
    if (!("speechSynthesis" in window)) {
      console.warn("Text-to-Speech no soportado");
      return;
    }
    const estadoHablado = this.getEstadoHablado(agente.estadoActual);
    const mensaje = `Atenci\xF3n. El agente ${agente.nombreCompleto} lleva demasiado tiempo en estado ${estadoHablado}. Requiere supervisi\xF3n.`;
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(mensaje);
    utterance.lang = "es-ES";
    utterance.rate = 0.9;
    utterance.pitch = 0.8;
    utterance.volume = 1;
    const voices = speechSynthesis.getVoices();
    const spanishVoice = voices.find((v) => v.lang.startsWith("es"));
    if (spanishVoice) {
      utterance.voice = spanishVoice;
    }
    speechSynthesis.speak(utterance);
  }
  /**
   * Convierte estado a texto hablado
   */
  getEstadoHablado(estado) {
    const estados = {
      "DISPONIBLE": "disponible",
      "EN_LLAMADA": "en llamada",
      "TIPIFICANDO": "tipificando",
      "EN_REUNION": "en reuni\xF3n",
      "REFRIGERIO": "refrigerio",
      "SSHH": "ba\xF1o",
      "EN_MANUAL": "modo manual",
      "PAUSADO": "pausado"
    };
    return estados[estado] || estado;
  }
  /**
   * Cierra la alerta actual
   */
  dismissAlert() {
    if (this.alertaActiva) {
      const alertKey = `${this.alertaActiva.agente.idUsuario}-${this.alertaActiva.agente.estadoActual}`;
      this.alertasDismissed.add(alertKey);
      this.alertaActiva = null;
      this.stopAlarm();
      if ("speechSynthesis" in window) {
        speechSynthesis.cancel();
      }
    }
  }
  /**
   * Cierra alerta si se hace click fuera del modal
   */
  onOverlayClick(event) {
    if (event.target.classList.contains("alert-overlay")) {
      this.dismissAlert();
    }
  }
  /**
   * Activa/desactiva el sonido de alertas
   * El usuario debe hacer click para activar (política de navegadores)
   */
  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    this.saveSoundPreference();
    if (this.soundEnabled && this.audioContext) {
      if (this.audioContext.state === "suspended") {
        this.audioContext.resume();
      }
      this.playTestBeep();
    }
  }
  /**
   * Reproduce un beep corto de prueba/confirmación
   */
  playTestBeep() {
    if (!this.audioContext)
      return;
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 0.1);
  }
  /**
   * Reproduce el sonido de alarma usando Web Audio API
   * Genera un beep intermitente tipo alarma
   */
  playAlarm() {
    if (!this.audioContext || this.isAlarmPlaying || !this.soundEnabled)
      return;
    try {
      if (this.audioContext.state === "suspended") {
        this.audioContext.resume();
      }
      this.isAlarmPlaying = true;
      this.startBeepSequence();
    } catch (err) {
      console.warn("No se pudo reproducir la alarma:", err);
    }
  }
  /**
   * Inicia una secuencia de beeps intermitentes
   */
  startBeepSequence() {
    if (!this.audioContext || !this.isAlarmPlaying)
      return;
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(880, this.audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.5, this.audioContext.currentTime);
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 0.2);
    oscillator.onended = () => {
      if (this.isAlarmPlaying) {
        setTimeout(() => this.startBeepSequence(), 200);
      }
    };
  }
  /**
   * Detiene el sonido de alarma
   */
  stopAlarm() {
    this.isAlarmPlaying = false;
  }
  /**
   * Limpia las alertas cerradas cuando un agente cambia de estado
   */
  clearDismissedForAgent(idUsuario) {
    const keysToRemove = [];
    this.alertasDismissed.forEach((key) => {
      if (key.startsWith(`${idUsuario}-`)) {
        keysToRemove.push(key);
      }
    });
    keysToRemove.forEach((key) => this.alertasDismissed.delete(key));
  }
  /**
   * Inicia polling de llamadas en tiempo real
   * Filtra por campaña si hay una seleccionada
   */
  startLlamadasPolling() {
    const campaignId = this.selectedCampaignId || void 0;
    this.llamadasSubscription = this.autoDialerService.startLlamadasPolling(campaignId).subscribe({
      next: (llamadas) => {
        this.llamadasEnTiempoReal = llamadas;
      },
      error: (err) => {
        console.error("Error polling llamadas en tiempo real:", err);
      }
    });
  }
  /**
   * Obtiene la hora actual en formato HH:MM:SS
   */
  getCurrentTime() {
    const now = /* @__PURE__ */ new Date();
    return now.toLocaleTimeString("es-PE", { hour12: false });
  }
  /**
   * Obtiene el color según el estado del agente
   */
  getEstadoColor(estado) {
    switch (estado) {
      case "DISPONIBLE":
        return "#10B981";
      // Verde
      case "EN_LLAMADA":
        return "#3B82F6";
      // Azul
      case "DESCONECTADO":
        return "#EF4444";
      // Rojo
      case "PAUSADO":
        return "#F59E0B";
      // Amarillo
      case "EN_REUNION":
        return "#8B5CF6";
      // Púrpura
      case "REFRIGERIO":
        return "#F59E0B";
      // Amarillo
      case "SSHH":
        return "#F59E0B";
      // Amarillo
      case "TIPIFICANDO":
        return "#06B6D4";
      // Cyan
      default:
        return "#6B7280";
    }
  }
  /**
   * Obtiene el ícono según el estado del agente
   */
  getEstadoIcon(estado) {
    switch (estado) {
      case "DISPONIBLE":
        return "circle";
      case "EN_LLAMADA":
        return "phone-call";
      case "DESCONECTADO":
        return "circle";
      case "PAUSADO":
        return "pause";
      case "EN_REUNION":
        return "users";
      case "REFRIGERIO":
        return "coffee";
      case "SSHH":
        return "user";
      case "TIPIFICANDO":
        return "edit";
      default:
        return "circle";
    }
  }
  /**
   * Obtiene texto legible del estado
   */
  getEstadoTexto(estado) {
    switch (estado) {
      case "DISPONIBLE":
        return "Libre";
      case "EN_LLAMADA":
        return "En Llamada";
      case "DESCONECTADO":
        return "Desconectado";
      case "PAUSADO":
        return "Pausado";
      case "EN_REUNION":
        return "En Reuni\xF3n";
      case "REFRIGERIO":
        return "Refrigerio";
      case "SSHH":
        return "SSHH";
      case "TIPIFICANDO":
        return "Tipificando";
      default:
        return estado;
    }
  }
  /**
   * Formatea segundos a formato MM:SS o HH:MM:SS
   */
  formatTiempo(segundos) {
    if (!segundos || segundos < 0)
      return "-";
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor(segundos % 3600 / 60);
    const segs = segundos % 60;
    if (horas > 0) {
      return `${horas.toString().padStart(2, "0")}:${minutos.toString().padStart(2, "0")}:${segs.toString().padStart(2, "0")}`;
    } else {
      return `${minutos.toString().padStart(2, "0")}:${segs.toString().padStart(2, "0")}`;
    }
  }
  /**
   * Navega de vuelta a campañas
   */
  goBack() {
    this.router.navigate(["/admin/campaigns"]);
  }
  /**
   * Navega a la pantalla de registro de extensiones
   */
  navigateToExtensions() {
    this.router.navigate(["/admin/extensions"]);
  }
};
_CampaignMonitoringComponent.\u0275fac = function CampaignMonitoringComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _CampaignMonitoringComponent)(\u0275\u0275directiveInject(CampaignAdminService), \u0275\u0275directiveInject(AutoDialerService), \u0275\u0275directiveInject(Router));
};
_CampaignMonitoringComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _CampaignMonitoringComponent, selectors: [["app-campaign-monitoring"]], decls: 76, vars: 20, consts: [[1, "monitoring-container"], [1, "flex", "items-center", "gap-2", "mb-2"], [1, "w-8", "h-8", "bg-gradient-to-br", "from-blue-600", "to-blue-700", "rounded-lg", "flex", "items-center", "justify-center"], ["name", "bar-chart-2", 1, "text-white", 3, "size"], [1, "text-lg", "font-bold", "text-white"], [1, "text-xs", "text-gray-400"], [1, "header"], [1, "btn-back", 3, "click"], ["name", "arrow-left", 3, "size"], [1, "btn-sound", 3, "click", "title"], [3, "name", "size"], [1, "campaign-selector"], ["for", "campaignSelect"], ["id", "campaignSelect", 1, "campaign-select", 3, "ngModelChange", "change", "ngModel"], ["disabled", "", 3, "value"], [3, "value", 4, "ngFor", "ngForOf"], ["class", "metrics-panel", 4, "ngIf"], [1, "two-column-layout"], [1, "left-column"], [1, "discado-panel"], ["name", "phone-call", 3, "size"], [1, "discado-table-container"], [1, "discado-table"], ["class", "llamada-row", 4, "ngFor", "ngForOf"], ["class", "empty-row", 4, "ngIf"], [1, "right-column"], [1, "agentes-panel"], [1, "agentes-header"], ["name", "users", 3, "size"], [1, "btn-view-all", 3, "click"], ["name", "phone", 3, "size"], [1, "agentes-table-container"], [1, "agentes-table"], [2, "width", "50px", "text-align", "center"], ["class", "agente-row", 3, "alert-row", 4, "ngFor", "ngForOf"], ["class", "alert-overlay", 3, "click", 4, "ngIf"], [3, "value"], [1, "metrics-panel"], ["name", "bar-chart-2", 3, "size"], [1, "metrics-grid"], [1, "metric-item"], [1, "metric-icon"], [1, "metric-info"], [1, "metric-value"], [1, "metric-label"], ["name", "clock", 3, "size"], ["name", "check-circle", 3, "size"], ["name", "clipboard-list", 3, "size"], ["name", "activity", 3, "size"], ["name", "x-circle", 3, "size"], ["name", "phone-missed", 3, "size"], ["name", "phone-off", 3, "size"], ["name", "timer", 3, "size"], [1, "llamada-row"], [1, "llamada-hora"], [1, "llamada-telefono"], [1, "llamada-agente"], [1, "llamada-estado"], [1, "estado-badge-mini"], [1, "llamada-duracion"], [1, "empty-row"], ["colspan", "5", 2, "text-align", "center", "color", "#94a3b8"], [1, "agente-row"], [1, "agente-info"], [1, "agente-extension"], [1, "agente-nombre"], [1, "agente-estado"], [1, "estado-badge"], [1, "agente-telefono"], [1, "agente-tiempo"], [1, "agente-alerta", 2, "text-align", "center"], [3, "color", "excedido", "size", "tooltip"], [1, "alert-overlay", 3, "click"], [1, "alert-modal"], [1, "alert-close", 3, "click"], ["name", "x", 3, "size"], [1, "alert-header"], [1, "alert-icon-container"], ["name", "alert-triangle", 1, "alert-icon", 3, "size"], [1, "alert-body"], [1, "alert-agent-info"], [1, "agent-avatar"], ["name", "user", 3, "size"], [1, "agent-details"], [1, "agent-name"], [1, "agent-extension"], [1, "alert-status"], [1, "status-label"], [1, "status-badge"], [1, "alert-time"], [1, "alert-message"], ["name", "alert-circle", 3, "size"], [1, "alert-footer"], [1, "btn-dismiss", 3, "click"]], template: function CampaignMonitoringComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2);
    \u0275\u0275element(3, "lucide-angular", 3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div")(5, "h1", 4);
    \u0275\u0275text(6, "Monitoreo por Campa\xF1a");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p", 5);
    \u0275\u0275text(8, "M\xE9tricas del auto-dialer en tiempo real");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(9, "div", 6)(10, "button", 7);
    \u0275\u0275listener("click", function CampaignMonitoringComponent_Template_button_click_10_listener() {
      return ctx.goBack();
    });
    \u0275\u0275element(11, "lucide-angular", 8);
    \u0275\u0275elementStart(12, "span");
    \u0275\u0275text(13, "Volver a Campa\xF1as");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "button", 9);
    \u0275\u0275listener("click", function CampaignMonitoringComponent_Template_button_click_14_listener() {
      return ctx.toggleSound();
    });
    \u0275\u0275element(15, "lucide-angular", 10);
    \u0275\u0275elementStart(16, "span");
    \u0275\u0275text(17);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(18, "div", 11)(19, "label", 12);
    \u0275\u0275text(20, "Seleccionar Campa\xF1a:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "select", 13);
    \u0275\u0275twoWayListener("ngModelChange", function CampaignMonitoringComponent_Template_select_ngModelChange_21_listener($event) {
      \u0275\u0275twoWayBindingSet(ctx.selectedCampaignId, $event) || (ctx.selectedCampaignId = $event);
      return $event;
    });
    \u0275\u0275listener("change", function CampaignMonitoringComponent_Template_select_change_21_listener() {
      return ctx.onCampaignChange();
    });
    \u0275\u0275elementStart(22, "option", 14);
    \u0275\u0275text(23, "-- Seleccione una campa\xF1a --");
    \u0275\u0275elementEnd();
    \u0275\u0275template(24, CampaignMonitoringComponent_option_24_Template, 2, 3, "option", 15);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(25, CampaignMonitoringComponent_div_25_Template, 93, 23, "div", 16);
    \u0275\u0275elementStart(26, "div", 17)(27, "div", 18)(28, "div", 19)(29, "h3");
    \u0275\u0275element(30, "lucide-angular", 20);
    \u0275\u0275text(31, " Discado en Tiempo Real");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(32, "div", 21)(33, "table", 22)(34, "thead")(35, "tr")(36, "th");
    \u0275\u0275text(37, "Hora");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(38, "th");
    \u0275\u0275text(39, "Tel\xE9fono");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(40, "th");
    \u0275\u0275text(41, "Agente");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(42, "th");
    \u0275\u0275text(43, "Estado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(44, "th");
    \u0275\u0275text(45, "Duraci\xF3n");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(46, "tbody");
    \u0275\u0275template(47, CampaignMonitoringComponent_tr_47_Template, 13, 8, "tr", 23)(48, CampaignMonitoringComponent_tr_48_Template, 3, 0, "tr", 24);
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275elementStart(49, "div", 25)(50, "div", 26)(51, "div", 27)(52, "h3");
    \u0275\u0275element(53, "lucide-angular", 28);
    \u0275\u0275text(54, " Agentes en Tiempo Real");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(55, "button", 29);
    \u0275\u0275listener("click", function CampaignMonitoringComponent_Template_button_click_55_listener() {
      return ctx.navigateToExtensions();
    });
    \u0275\u0275element(56, "lucide-angular", 30);
    \u0275\u0275text(57, " Ver Extensiones ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(58, "div", 31)(59, "table", 32)(60, "thead")(61, "tr")(62, "th");
    \u0275\u0275text(63, "Agente");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(64, "th");
    \u0275\u0275text(65, "Estado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(66, "th");
    \u0275\u0275text(67, "Tel\xE9fono");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(68, "th");
    \u0275\u0275text(69, "Tiempo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(70, "th", 33);
    \u0275\u0275text(71, "Alerta");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(72, "tbody");
    \u0275\u0275template(73, CampaignMonitoringComponent_tr_73_Template, 16, 15, "tr", 34)(74, CampaignMonitoringComponent_tr_74_Template, 3, 0, "tr", 24);
    \u0275\u0275elementEnd()()()()()()();
    \u0275\u0275template(75, CampaignMonitoringComponent_div_75_Template, 36, 12, "div", 35);
  }
  if (rf & 2) {
    \u0275\u0275advance(3);
    \u0275\u0275property("size", 16);
    \u0275\u0275advance(8);
    \u0275\u0275property("size", 18);
    \u0275\u0275advance(3);
    \u0275\u0275classProp("active", ctx.soundEnabled);
    \u0275\u0275property("title", ctx.soundEnabled ? "Desactivar sonido de alertas" : "Activar sonido de alertas (requerido para escuchar alarmas)");
    \u0275\u0275advance();
    \u0275\u0275property("name", ctx.soundEnabled ? "volume-2" : "volume-x")("size", 18);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx.soundEnabled ? "Sonido ON" : "Sonido OFF");
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx.selectedCampaignId);
    \u0275\u0275advance();
    \u0275\u0275property("value", null);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngForOf", ctx.campaigns);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.autoDialerStats);
    \u0275\u0275advance(5);
    \u0275\u0275property("size", 20);
    \u0275\u0275advance(17);
    \u0275\u0275property("ngForOf", ctx.llamadasEnTiempoReal);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.llamadasEnTiempoReal.length === 0);
    \u0275\u0275advance(5);
    \u0275\u0275property("size", 20);
    \u0275\u0275advance(3);
    \u0275\u0275property("size", 16);
    \u0275\u0275advance(17);
    \u0275\u0275property("ngForOf", ctx.agentesMonitoreo);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.agentesMonitoreo.length === 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.alertaActiva);
  }
}, dependencies: [CommonModule, NgForOf, NgIf, FormsModule, NgSelectOption, \u0275NgSelectMultipleOption, SelectControlValueAccessor, NgControlStatus, NgModel, LucideAngularModule, LucideAngularComponent, StatusAlarmClockComponent, DatePipe], styles: ["/* src/app/features/admin/campaign-monitoring/campaign-monitoring.component.css */\n.monitoring-container {\n  min-height: 100vh;\n  background:\n    linear-gradient(\n      to bottom right,\n      #0f172a,\n      #1e293b,\n      #0f172a);\n  padding: 1.5rem !important;\n  max-width: 1600px;\n  margin: 0 auto;\n}\n.header {\n  display: flex;\n  align-items: center;\n  gap: 1rem;\n  margin-bottom: 1.5rem;\n  padding-bottom: 1rem;\n  border-bottom: 1px solid #334155;\n}\n.header h1 {\n  margin: 0;\n  font-size: 1.5rem;\n  color: #ffffff;\n  font-weight: 600;\n}\n.btn-back {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  background: rgba(255, 255, 255, 0.1);\n  border: 1px solid #334155;\n  color: white;\n  padding: 0.6rem 1rem;\n  border-radius: 8px;\n  cursor: pointer;\n  font-size: 0.9rem;\n  transition: all 0.3s;\n}\n.btn-back:hover {\n  background: rgba(255, 255, 255, 0.15);\n  transform: translateX(-3px);\n}\n.btn-sound {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  background: rgba(239, 68, 68, 0.2);\n  border: 1px solid #ef4444;\n  color: #fca5a5;\n  padding: 0.6rem 1rem;\n  border-radius: 8px;\n  cursor: pointer;\n  font-size: 0.9rem;\n  transition: all 0.3s;\n  margin-left: auto;\n}\n.btn-sound:hover {\n  background: rgba(239, 68, 68, 0.3);\n}\n.btn-sound.active {\n  background: rgba(34, 197, 94, 0.2);\n  border-color: #22c55e;\n  color: #86efac;\n}\n.btn-sound.active:hover {\n  background: rgba(34, 197, 94, 0.3);\n}\n.campaign-selector {\n  background: #1E293B;\n  border: 1px solid #334155;\n  border-radius: 8px;\n  padding: 1rem;\n  margin-bottom: 1.5rem;\n  display: flex;\n  align-items: center;\n  gap: 1rem;\n}\n.campaign-selector label {\n  color: #ffffff;\n  font-weight: 600;\n  font-size: 0.95rem;\n  white-space: nowrap;\n}\n.campaign-select {\n  flex: 1;\n  max-width: 500px;\n  background: #0A0E27;\n  border: 1px solid #334155;\n  border-radius: 6px;\n  padding: 0.7rem;\n  color: #ffffff;\n  font-size: 0.95rem;\n  transition: border 0.3s;\n  cursor: pointer;\n}\n.campaign-select:focus {\n  outline: none;\n  border-color: #10B981;\n}\n.campaign-select option {\n  background: #0A0E27;\n  color: #ffffff;\n}\n.metrics-panel {\n  background: #1E293B;\n  border: 1px solid #334155;\n  border-radius: 8px;\n  padding: 1rem;\n  margin-bottom: 1.5rem;\n}\n.metrics-panel h3 {\n  margin: 0 0 1rem 0;\n  font-size: 0.95rem;\n  color: #ffffff;\n  font-weight: 600;\n}\n.metrics-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));\n  gap: 0.8rem;\n}\n.metric-item {\n  background: #0A0E27;\n  border: 1px solid #334155;\n  border-radius: 6px;\n  padding: 0.7rem;\n  display: flex;\n  align-items: center;\n  gap: 0.7rem;\n  transition: transform 0.2s, box-shadow 0.2s;\n}\n.metric-item:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);\n}\n.metric-icon {\n  font-size: 1.5rem;\n  flex-shrink: 0;\n}\n.metric-info {\n  display: flex;\n  flex-direction: column;\n  min-width: 0;\n}\n.metric-value {\n  font-size: 1.3rem;\n  font-weight: 700;\n  color: #10B981;\n  line-height: 1.2;\n}\n.metric-label {\n  font-size: 0.7rem;\n  color: #94a3b8;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.two-column-layout {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 1.5rem;\n  height: calc(100vh - 400px);\n  min-height: 500px;\n}\n.left-column {\n  display: flex;\n  flex-direction: column;\n  background: #1E293B;\n  border: 1px solid #334155;\n  border-radius: 8px;\n  overflow: hidden;\n}\n.discado-panel {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  overflow: hidden;\n}\n.discado-panel h3 {\n  margin: 0;\n  padding: 1rem;\n  font-size: 0.95rem;\n  color: #ffffff;\n  font-weight: 600;\n  background: #0A0E27;\n  border-bottom: 1px solid #334155;\n}\n.discado-table-container {\n  flex: 1;\n  overflow-y: auto;\n  overflow-x: auto;\n}\n.discado-table-container::-webkit-scrollbar {\n  width: 8px;\n  height: 8px;\n}\n.discado-table-container::-webkit-scrollbar-track {\n  background: #0A0E27;\n}\n.discado-table-container::-webkit-scrollbar-thumb {\n  background: #334155;\n  border-radius: 4px;\n}\n.discado-table-container::-webkit-scrollbar-thumb:hover {\n  background: #475569;\n}\n.discado-table {\n  width: 100%;\n  border-collapse: collapse;\n  font-size: 0.8rem;\n}\n.discado-table thead {\n  position: sticky;\n  top: 0;\n  background: #0A0E27;\n  z-index: 10;\n}\n.discado-table th {\n  padding: 0.7rem 0.8rem;\n  text-align: left;\n  font-weight: 600;\n  color: #94a3b8;\n  font-size: 0.75rem;\n  text-transform: uppercase;\n  border-bottom: 1px solid #334155;\n}\n.discado-table tbody tr {\n  transition: background-color 0.2s;\n  animation: fadeIn 0.3s ease-in;\n}\n@keyframes fadeIn {\n  from {\n    opacity: 0;\n    transform: translateY(-10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n.llamada-row:hover {\n  background: rgba(59, 130, 246, 0.05);\n}\n.discado-table td {\n  padding: 0.7rem 0.8rem;\n  border-bottom: 1px solid #334155;\n  color: #e2e8f0;\n}\n.llamada-hora {\n  font-family: monospace;\n  font-size: 0.75rem;\n  color: #94a3b8;\n}\n.llamada-telefono {\n  font-family: monospace;\n  font-size: 0.8rem;\n  color: #10B981;\n  font-weight: 600;\n}\n.llamada-agente {\n  font-size: 0.75rem;\n  color: #e2e8f0;\n}\n.llamada-estado {\n  text-align: center;\n}\n.estado-badge-mini {\n  display: inline-block;\n  padding: 0.2rem 0.5rem;\n  border-radius: 50px;\n  background: #3B82F6;\n  color: white;\n  font-size: 0.7rem;\n  font-weight: 600;\n  white-space: nowrap;\n}\n.llamada-duracion {\n  font-family: monospace;\n  font-size: 0.75rem;\n  font-weight: 600;\n  color: #10B981;\n  text-align: center;\n}\n.right-column {\n  display: flex;\n  flex-direction: column;\n}\n.agentes-panel {\n  flex: 1;\n  background: #1E293B;\n  border: 1px solid #334155;\n  border-radius: 8px;\n  overflow: hidden;\n  display: flex;\n  flex-direction: column;\n}\n.agentes-header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 1rem;\n  background: #0A0E27;\n  border-bottom: 1px solid #334155;\n}\n.agentes-panel h3 {\n  margin: 0;\n  font-size: 0.95rem;\n  color: #ffffff;\n  font-weight: 600;\n}\n.btn-view-all {\n  padding: 6px 12px;\n  background: #3B82F6;\n  color: white;\n  border: none;\n  border-radius: 6px;\n  cursor: pointer;\n  font-size: 13px;\n  font-weight: 500;\n  transition: all 0.3s;\n}\n.btn-view-all:hover {\n  background: #2563EB;\n  transform: translateY(-2px);\n}\n.agentes-table-container {\n  flex: 1;\n  overflow-y: auto;\n  overflow-x: auto;\n}\n.agentes-table-container::-webkit-scrollbar {\n  width: 8px;\n  height: 8px;\n}\n.agentes-table-container::-webkit-scrollbar-track {\n  background: #0A0E27;\n}\n.agentes-table-container::-webkit-scrollbar-thumb {\n  background: #334155;\n  border-radius: 4px;\n}\n.agentes-table-container::-webkit-scrollbar-thumb:hover {\n  background: #475569;\n}\n.agentes-table {\n  width: 100%;\n  border-collapse: collapse;\n  font-size: 0.8rem;\n}\n.agentes-table thead {\n  position: sticky;\n  top: 0;\n  background: #0A0E27;\n  z-index: 10;\n}\n.agentes-table th {\n  padding: 0.7rem 0.8rem;\n  text-align: left;\n  font-weight: 600;\n  color: #94a3b8;\n  font-size: 0.75rem;\n  text-transform: uppercase;\n  border-bottom: 1px solid #334155;\n}\n.agentes-table tbody tr {\n  transition: background-color 0.2s;\n}\n.agente-row:hover {\n  background: rgba(16, 185, 129, 0.05);\n}\n.agentes-table td {\n  padding: 0.7rem 0.8rem;\n  border-bottom: 1px solid #334155;\n  color: #e2e8f0;\n}\n.agente-info {\n  display: flex;\n  flex-direction: column;\n  gap: 0.2rem;\n}\n.agente-extension {\n  font-size: 0.75rem;\n  color: #10B981;\n  font-weight: 600;\n  font-family: monospace;\n}\n.agente-nombre {\n  font-size: 0.7rem;\n  color: #94a3b8;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  max-width: 180px;\n}\n.agente-estado {\n  text-align: center;\n}\n.estado-badge {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.3rem;\n  padding: 0.3rem 0.6rem;\n  border-radius: 50px;\n  color: white;\n  font-size: 0.7rem;\n  font-weight: 600;\n  white-space: nowrap;\n}\n.agente-telefono {\n  font-family: monospace;\n  font-size: 0.75rem;\n  color: #e2e8f0;\n}\n.agente-tiempo {\n  font-family: monospace;\n  font-size: 0.75rem;\n  font-weight: 600;\n  color: #10B981;\n  text-align: center;\n}\n.empty-row td {\n  padding: 2rem 1rem;\n}\n@media (max-width: 1200px) {\n  .two-column-layout {\n    grid-template-columns: 1fr;\n    height: auto;\n  }\n  .left-column,\n  .right-column {\n    min-height: 400px;\n    max-height: 500px;\n  }\n  .metrics-grid {\n    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));\n  }\n}\n@media (max-width: 768px) {\n  .monitoring-container {\n    padding: 1rem;\n  }\n  .header {\n    flex-direction: column;\n    align-items: flex-start;\n    gap: 0.5rem;\n  }\n  .campaign-selector {\n    flex-direction: column;\n    align-items: flex-start;\n  }\n  .campaign-select {\n    max-width: 100%;\n  }\n  .two-column-layout {\n    gap: 1rem;\n  }\n  .metrics-grid {\n    grid-template-columns: repeat(2, 1fr);\n  }\n}\n.agente-row.alert-row {\n  background: rgba(239, 68, 68, 0.1) !important;\n  animation: alertRowPulse 2s ease-in-out infinite;\n}\n@keyframes alertRowPulse {\n  0%, 100% {\n    background: rgba(239, 68, 68, 0.1);\n  }\n  50% {\n    background: rgba(239, 68, 68, 0.2);\n  }\n}\n.alert-overlay {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background: rgba(0, 0, 0, 0.7);\n  -webkit-backdrop-filter: blur(4px);\n  backdrop-filter: blur(4px);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 9999;\n  animation: fadeIn 0.3s ease;\n}\n@keyframes fadeIn {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n.alert-modal {\n  background:\n    linear-gradient(\n      135deg,\n      #1E293B 0%,\n      #0F172A 100%);\n  border: 1px solid #EF4444;\n  border-radius: 16px;\n  padding: 0;\n  width: 90%;\n  max-width: 420px;\n  box-shadow: 0 20px 60px rgba(239, 68, 68, 0.3), 0 0 40px rgba(239, 68, 68, 0.1);\n  animation: modalSlideIn 0.3s ease, modalPulse 2s ease-in-out infinite;\n  position: relative;\n  overflow: hidden;\n}\n@keyframes modalSlideIn {\n  from {\n    transform: scale(0.9) translateY(-20px);\n    opacity: 0;\n  }\n  to {\n    transform: scale(1) translateY(0);\n    opacity: 1;\n  }\n}\n@keyframes modalPulse {\n  0%, 100% {\n    box-shadow: 0 20px 60px rgba(239, 68, 68, 0.3), 0 0 40px rgba(239, 68, 68, 0.1);\n  }\n  50% {\n    box-shadow: 0 20px 80px rgba(239, 68, 68, 0.5), 0 0 60px rgba(239, 68, 68, 0.2);\n  }\n}\n.alert-close {\n  position: absolute;\n  top: 12px;\n  right: 12px;\n  background: rgba(255, 255, 255, 0.1);\n  border: none;\n  color: #94A3B8;\n  width: 32px;\n  height: 32px;\n  border-radius: 50%;\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  transition: all 0.2s;\n  z-index: 1;\n}\n.alert-close:hover {\n  background: rgba(239, 68, 68, 0.2);\n  color: #EF4444;\n}\n.alert-header {\n  background:\n    linear-gradient(\n      135deg,\n      #EF4444 0%,\n      #DC2626 100%);\n  padding: 1.5rem;\n  text-align: center;\n}\n.alert-icon-container {\n  width: 64px;\n  height: 64px;\n  background: rgba(255, 255, 255, 0.2);\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  margin: 0 auto 0.75rem;\n  animation: iconShake 0.5s ease-in-out infinite;\n}\n@keyframes iconShake {\n  0%, 100% {\n    transform: rotate(0deg);\n  }\n  25% {\n    transform: rotate(-5deg);\n  }\n  75% {\n    transform: rotate(5deg);\n  }\n}\n.alert-icon {\n  color: white;\n}\n.alert-header h3 {\n  margin: 0;\n  color: white;\n  font-size: 1.25rem;\n  font-weight: 600;\n}\n.alert-body {\n  padding: 1.5rem;\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n}\n.alert-agent-info {\n  display: flex;\n  align-items: center;\n  gap: 1rem;\n  background: rgba(255, 255, 255, 0.05);\n  padding: 1rem;\n  border-radius: 12px;\n  border: 1px solid #334155;\n}\n.agent-avatar {\n  width: 48px;\n  height: 48px;\n  background:\n    linear-gradient(\n      135deg,\n      #3B82F6 0%,\n      #2563EB 100%);\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  color: white;\n}\n.agent-details {\n  display: flex;\n  flex-direction: column;\n  gap: 0.25rem;\n}\n.agent-name {\n  color: white;\n  font-weight: 600;\n  font-size: 1rem;\n}\n.agent-extension {\n  color: #94A3B8;\n  font-size: 0.85rem;\n}\n.alert-status {\n  display: flex;\n  align-items: center;\n  gap: 0.75rem;\n}\n.status-label {\n  color: #94A3B8;\n  font-size: 0.9rem;\n}\n.alert-status .status-badge {\n  padding: 0.35rem 0.75rem;\n  border-radius: 20px;\n  color: white;\n  font-size: 0.85rem;\n  font-weight: 500;\n}\n.alert-time,\n.alert-message {\n  display: flex;\n  align-items: center;\n  gap: 0.75rem;\n  color: #CBD5E1;\n  font-size: 0.95rem;\n}\n.alert-time lucide-angular,\n.alert-message lucide-angular {\n  color: #94A3B8;\n}\n.alert-message {\n  background: rgba(239, 68, 68, 0.1);\n  padding: 0.75rem 1rem;\n  border-radius: 8px;\n  border-left: 3px solid #EF4444;\n}\n.alert-message lucide-angular {\n  color: #EF4444;\n}\n.alert-footer {\n  padding: 1rem 1.5rem 1.5rem;\n  display: flex;\n  justify-content: center;\n}\n.btn-dismiss {\n  background:\n    linear-gradient(\n      135deg,\n      #3B82F6 0%,\n      #2563EB 100%);\n  border: none;\n  color: white;\n  padding: 0.75rem 2rem;\n  border-radius: 8px;\n  font-size: 1rem;\n  font-weight: 500;\n  cursor: pointer;\n  transition: all 0.2s;\n  min-width: 150px;\n}\n.btn-dismiss:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);\n}\n/*# sourceMappingURL=campaign-monitoring.component.css.map */\n"], encapsulation: 2 });
var CampaignMonitoringComponent = _CampaignMonitoringComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CampaignMonitoringComponent, [{
    type: Component,
    args: [{ selector: "app-campaign-monitoring", standalone: true, imports: [CommonModule, FormsModule, LucideAngularModule, StatusAlarmClockComponent], encapsulation: ViewEncapsulation.None, template: `<div class="monitoring-container">\r
  <!-- Header -->\r
  <div class="flex items-center gap-2 mb-2">\r
    <div class="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">\r
      <lucide-angular name="bar-chart-2" [size]="16" class="text-white"></lucide-angular>\r
    </div>\r
    <div>\r
      <h1 class="text-lg font-bold text-white">Monitoreo por Campa\xF1a</h1>\r
      <p class="text-xs text-gray-400">M\xE9tricas del auto-dialer en tiempo real</p>\r
    </div>\r
  </div>\r
\r
  <div class="header">\r
    <button class="btn-back" (click)="goBack()">\r
      <lucide-angular name="arrow-left" [size]="18"></lucide-angular>\r
      <span>Volver a Campa\xF1as</span>\r
    </button>\r
\r
    <!-- Bot\xF3n para activar/desactivar sonido de alertas -->\r
    <button\r
      class="btn-sound"\r
      [class.active]="soundEnabled"\r
      (click)="toggleSound()"\r
      [title]="soundEnabled ? 'Desactivar sonido de alertas' : 'Activar sonido de alertas (requerido para escuchar alarmas)'">\r
      <lucide-angular [name]="soundEnabled ? 'volume-2' : 'volume-x'" [size]="18"></lucide-angular>\r
      <span>{{ soundEnabled ? 'Sonido ON' : 'Sonido OFF' }}</span>\r
    </button>\r
  </div>\r
\r
  <!-- Campaign Selector -->\r
  <div class="campaign-selector">\r
    <label for="campaignSelect">Seleccionar Campa\xF1a:</label>\r
    <select\r
      id="campaignSelect"\r
      [(ngModel)]="selectedCampaignId"\r
      (change)="onCampaignChange()"\r
      class="campaign-select">\r
      <option [value]="null" disabled>-- Seleccione una campa\xF1a --</option>\r
      <option\r
        *ngFor="let campaign of campaigns"\r
        [value]="campaign.id">\r
        {{ campaign.name }} ({{ campaign.status }})\r
      </option>\r
    </select>\r
  </div>\r
\r
  <!-- Metrics Panel -->\r
  <div class="metrics-panel" *ngIf="autoDialerStats">\r
    <h3><lucide-angular name="bar-chart-2" [size]="20"></lucide-angular> M\xE9tricas del Auto-Dialer en Tiempo Real</h3>\r
    <div class="metrics-grid">\r
      <!-- Total llamadas -->\r
      <div class="metric-item">\r
        <span class="metric-icon"><lucide-angular name="bar-chart-2" [size]="24"></lucide-angular></span>\r
        <div class="metric-info">\r
          <span class="metric-value">{{ autoDialerStats.totalLlamadas }}</span>\r
          <span class="metric-label">Total llamadas</span>\r
        </div>\r
      </div>\r
\r
      <!-- Llamadas en cola -->\r
      <div class="metric-item">\r
        <span class="metric-icon"><lucide-angular name="clock" [size]="24"></lucide-angular></span>\r
        <div class="metric-info">\r
          <span class="metric-value">{{ autoDialerStats.llamadasEnCola }}</span>\r
          <span class="metric-label">Llamadas en cola</span>\r
        </div>\r
      </div>\r
\r
      <!-- Llamadas conectadas -->\r
      <div class="metric-item">\r
        <span class="metric-icon"><lucide-angular name="check-circle" [size]="24"></lucide-angular></span>\r
        <div class="metric-info">\r
          <span class="metric-value">{{ autoDialerStats.llamadasConectadas }}</span>\r
          <span class="metric-label">Llamadas conectadas</span>\r
        </div>\r
      </div>\r
\r
      <!-- Llamadas por realizar (contactos pendientes) -->\r
      <div class="metric-item">\r
        <span class="metric-icon"><lucide-angular name="clipboard-list" [size]="24"></lucide-angular></span>\r
        <div class="metric-info">\r
          <span class="metric-value">{{ autoDialerStats.contactosPendientes }}</span>\r
          <span class="metric-label">Llamadas por realizar</span>\r
        </div>\r
      </div>\r
\r
      <!-- Llamadas siendo marcadas -->\r
      <div class="metric-item">\r
        <span class="metric-icon"><lucide-angular name="phone-call" [size]="24"></lucide-angular></span>\r
        <div class="metric-info">\r
          <span class="metric-value">{{ autoDialerStats.llamadasMarcando }}</span>\r
          <span class="metric-label">Llamadas siendo marcadas</span>\r
        </div>\r
      </div>\r
\r
      <!-- Llamadas activas (en curso) -->\r
      <div class="metric-item">\r
        <span class="metric-icon"><lucide-angular name="activity" [size]="24"></lucide-angular></span>\r
        <div class="metric-info">\r
          <span class="metric-value">{{ autoDialerStats.llamadasActivas }}</span>\r
          <span class="metric-label">Llamadas siendo procesadas</span>\r
        </div>\r
      </div>\r
\r
      <!-- Llamadas fallidas -->\r
      <div class="metric-item">\r
        <span class="metric-icon"><lucide-angular name="x-circle" [size]="24"></lucide-angular></span>\r
        <div class="metric-info">\r
          <span class="metric-value">{{ autoDialerStats.contactosFallidos }}</span>\r
          <span class="metric-label">Llamadas fallidas</span>\r
        </div>\r
      </div>\r
\r
      <!-- Llamadas no contestadas -->\r
      <div class="metric-item">\r
        <span class="metric-icon"><lucide-angular name="phone-missed" [size]="24"></lucide-angular></span>\r
        <div class="metric-info">\r
          <span class="metric-value">{{ autoDialerStats.llamadasNoContestadas }}</span>\r
          <span class="metric-label">Llamadas no contestadas</span>\r
        </div>\r
      </div>\r
\r
      <!-- Llamadas abandonadas -->\r
      <div class="metric-item">\r
        <span class="metric-icon"><lucide-angular name="phone-off" [size]="24"></lucide-angular></span>\r
        <div class="metric-info">\r
          <span class="metric-value">{{ autoDialerStats.llamadasAbandonadas }}</span>\r
          <span class="metric-label">Llamadas abandonadas</span>\r
        </div>\r
      </div>\r
\r
      <!-- Duraci\xF3n promedio -->\r
      <div class="metric-item">\r
        <span class="metric-icon"><lucide-angular name="clock" [size]="24"></lucide-angular></span>\r
        <div class="metric-info">\r
          <span class="metric-value">{{ autoDialerStats.duracionPromedioFormato }}</span>\r
          <span class="metric-label">Duraci\xF3n promedio de llamada</span>\r
        </div>\r
      </div>\r
\r
      <!-- Duraci\xF3n m\xE1xima -->\r
      <div class="metric-item">\r
        <span class="metric-icon"><lucide-angular name="timer" [size]="24"></lucide-angular></span>\r
        <div class="metric-info">\r
          <span class="metric-value">{{ autoDialerStats.duracionMaximaFormato }}</span>\r
          <span class="metric-label">Duraci\xF3n m\xE1xima de llamada</span>\r
        </div>\r
      </div>\r
    </div>\r
  </div>\r
\r
  <!-- Two Column Layout: Discado en Tiempo Real + Agentes -->\r
  <div class="two-column-layout">\r
    <!-- LEFT COLUMN: Discado en Tiempo Real -->\r
    <div class="left-column">\r
      <div class="discado-panel">\r
        <h3><lucide-angular name="phone-call" [size]="20"></lucide-angular> Discado en Tiempo Real</h3>\r
        <div class="discado-table-container">\r
          <table class="discado-table">\r
            <thead>\r
              <tr>\r
                <th>Hora</th>\r
                <th>Tel\xE9fono</th>\r
                <th>Agente</th>\r
                <th>Estado</th>\r
                <th>Duraci\xF3n</th>\r
              </tr>\r
            </thead>\r
            <tbody>\r
              <tr *ngFor="let llamada of llamadasEnTiempoReal" class="llamada-row">\r
                <td class="llamada-hora">{{ llamada.fechaInicio | date: 'HH:mm:ss' }}</td>\r
                <td class="llamada-telefono">{{ llamada.anexoDestino }}</td>\r
                <td class="llamada-agente">{{ llamada.nombreAgente }}</td>\r
                <td class="llamada-estado">\r
                  <span class="estado-badge-mini">{{ llamada.estadoLlamada }}</span>\r
                </td>\r
                <td class="llamada-duracion">{{ formatTiempo(llamada.duracionSegundos) }}</td>\r
              </tr>\r
              <tr *ngIf="llamadasEnTiempoReal.length === 0" class="empty-row">\r
                <td colspan="5" style="text-align: center; color: #94a3b8;">\r
                  No hay llamadas en curso\r
                </td>\r
              </tr>\r
            </tbody>\r
          </table>\r
        </div>\r
      </div>\r
    </div>\r
\r
    <!-- RIGHT COLUMN: Agentes en Tiempo Real -->\r
    <div class="right-column">\r
      <div class="agentes-panel">\r
        <div class="agentes-header">\r
          <h3><lucide-angular name="users" [size]="20"></lucide-angular> Agentes en Tiempo Real</h3>\r
          <button class="btn-view-all" (click)="navigateToExtensions()">\r
            <lucide-angular name="phone" [size]="16"></lucide-angular> Ver Extensiones\r
          </button>\r
        </div>\r
        <div class="agentes-table-container">\r
          <table class="agentes-table">\r
            <thead>\r
              <tr>\r
                <th>Agente</th>\r
                <th>Estado</th>\r
                <th>Tel\xE9fono</th>\r
                <th>Tiempo</th>\r
                <th style="width: 50px; text-align: center;">Alerta</th>\r
              </tr>\r
            </thead>\r
            <tbody>\r
              <tr *ngFor="let agente of agentesMonitoreo" class="agente-row"\r
                  [class.alert-row]="agente.excedeTiempoMaximo">\r
                <td class="agente-info">\r
                  <div class="agente-extension">SIP/{{ agente.sipExtension }}</div>\r
                  <div class="agente-nombre">{{ agente.nombreCompleto }}</div>\r
                </td>\r
                <td class="agente-estado">\r
                  <span class="estado-badge" [style.background-color]="getEstadoColor(agente.estadoActual)">\r
                    <lucide-angular [name]="getEstadoIcon(agente.estadoActual)" [size]="14"></lucide-angular> {{ getEstadoTexto(agente.estadoActual) }}\r
                  </span>\r
                </td>\r
                <td class="agente-telefono">\r
                  {{ agente.telefonoDestino || '-' }}\r
                </td>\r
                <td class="agente-tiempo">\r
                  {{ formatTiempo(agente.segundosEnEstado) }}\r
                </td>\r
                <td class="agente-alerta" style="text-align: center;">\r
                  <app-status-alarm-clock\r
                    [color]="agente.colorIndicador"\r
                    [excedido]="agente.excedeTiempoMaximo"\r
                    [size]="20"\r
                    [tooltip]="agente.mensajeAlerta || ''">\r
                  </app-status-alarm-clock>\r
                </td>\r
              </tr>\r
              <tr *ngIf="agentesMonitoreo.length === 0" class="empty-row">\r
                <td colspan="5" style="text-align: center; color: #94a3b8;">\r
                  No hay agentes registrados\r
                </td>\r
              </tr>\r
            </tbody>\r
          </table>\r
        </div>\r
      </div>\r
    </div>\r
  </div>\r
</div>\r
\r
<!-- Modal de Alerta de Agente -->\r
<div class="alert-overlay" *ngIf="alertaActiva" (click)="onOverlayClick($event)">\r
  <div class="alert-modal">\r
    <button class="alert-close" (click)="dismissAlert()">\r
      <lucide-angular name="x" [size]="20"></lucide-angular>\r
    </button>\r
\r
    <div class="alert-header">\r
      <div class="alert-icon-container">\r
        <lucide-angular name="alert-triangle" [size]="32" class="alert-icon"></lucide-angular>\r
      </div>\r
      <h3>Alerta de Agente</h3>\r
    </div>\r
\r
    <div class="alert-body">\r
      <div class="alert-agent-info">\r
        <div class="agent-avatar">\r
          <lucide-angular name="user" [size]="24"></lucide-angular>\r
        </div>\r
        <div class="agent-details">\r
          <span class="agent-name">{{ alertaActiva.agente.nombreCompleto }}</span>\r
          <span class="agent-extension">SIP/{{ alertaActiva.agente.sipExtension }}</span>\r
        </div>\r
      </div>\r
\r
      <div class="alert-status">\r
        <span class="status-label">Estado:</span>\r
        <span class="status-badge" [style.background-color]="getEstadoColor(alertaActiva.agente.estadoActual)">\r
          {{ getEstadoTexto(alertaActiva.agente.estadoActual) }}\r
        </span>\r
      </div>\r
\r
      <div class="alert-time">\r
        <lucide-angular name="clock" [size]="18"></lucide-angular>\r
        <span>Tiempo en estado: <strong>{{ formatTiempo(alertaActiva.agente.segundosEnEstado) }}</strong></span>\r
      </div>\r
\r
      <div class="alert-message">\r
        <lucide-angular name="alert-circle" [size]="18"></lucide-angular>\r
        <span>{{ alertaActiva.agente.mensajeAlerta }}</span>\r
      </div>\r
    </div>\r
\r
    <div class="alert-footer">\r
      <button class="btn-dismiss" (click)="dismissAlert()">\r
        Entendido\r
      </button>\r
    </div>\r
  </div>\r
</div>\r
`, styles: ["/* src/app/features/admin/campaign-monitoring/campaign-monitoring.component.css */\n.monitoring-container {\n  min-height: 100vh;\n  background:\n    linear-gradient(\n      to bottom right,\n      #0f172a,\n      #1e293b,\n      #0f172a);\n  padding: 1.5rem !important;\n  max-width: 1600px;\n  margin: 0 auto;\n}\n.header {\n  display: flex;\n  align-items: center;\n  gap: 1rem;\n  margin-bottom: 1.5rem;\n  padding-bottom: 1rem;\n  border-bottom: 1px solid #334155;\n}\n.header h1 {\n  margin: 0;\n  font-size: 1.5rem;\n  color: #ffffff;\n  font-weight: 600;\n}\n.btn-back {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  background: rgba(255, 255, 255, 0.1);\n  border: 1px solid #334155;\n  color: white;\n  padding: 0.6rem 1rem;\n  border-radius: 8px;\n  cursor: pointer;\n  font-size: 0.9rem;\n  transition: all 0.3s;\n}\n.btn-back:hover {\n  background: rgba(255, 255, 255, 0.15);\n  transform: translateX(-3px);\n}\n.btn-sound {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  background: rgba(239, 68, 68, 0.2);\n  border: 1px solid #ef4444;\n  color: #fca5a5;\n  padding: 0.6rem 1rem;\n  border-radius: 8px;\n  cursor: pointer;\n  font-size: 0.9rem;\n  transition: all 0.3s;\n  margin-left: auto;\n}\n.btn-sound:hover {\n  background: rgba(239, 68, 68, 0.3);\n}\n.btn-sound.active {\n  background: rgba(34, 197, 94, 0.2);\n  border-color: #22c55e;\n  color: #86efac;\n}\n.btn-sound.active:hover {\n  background: rgba(34, 197, 94, 0.3);\n}\n.campaign-selector {\n  background: #1E293B;\n  border: 1px solid #334155;\n  border-radius: 8px;\n  padding: 1rem;\n  margin-bottom: 1.5rem;\n  display: flex;\n  align-items: center;\n  gap: 1rem;\n}\n.campaign-selector label {\n  color: #ffffff;\n  font-weight: 600;\n  font-size: 0.95rem;\n  white-space: nowrap;\n}\n.campaign-select {\n  flex: 1;\n  max-width: 500px;\n  background: #0A0E27;\n  border: 1px solid #334155;\n  border-radius: 6px;\n  padding: 0.7rem;\n  color: #ffffff;\n  font-size: 0.95rem;\n  transition: border 0.3s;\n  cursor: pointer;\n}\n.campaign-select:focus {\n  outline: none;\n  border-color: #10B981;\n}\n.campaign-select option {\n  background: #0A0E27;\n  color: #ffffff;\n}\n.metrics-panel {\n  background: #1E293B;\n  border: 1px solid #334155;\n  border-radius: 8px;\n  padding: 1rem;\n  margin-bottom: 1.5rem;\n}\n.metrics-panel h3 {\n  margin: 0 0 1rem 0;\n  font-size: 0.95rem;\n  color: #ffffff;\n  font-weight: 600;\n}\n.metrics-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));\n  gap: 0.8rem;\n}\n.metric-item {\n  background: #0A0E27;\n  border: 1px solid #334155;\n  border-radius: 6px;\n  padding: 0.7rem;\n  display: flex;\n  align-items: center;\n  gap: 0.7rem;\n  transition: transform 0.2s, box-shadow 0.2s;\n}\n.metric-item:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);\n}\n.metric-icon {\n  font-size: 1.5rem;\n  flex-shrink: 0;\n}\n.metric-info {\n  display: flex;\n  flex-direction: column;\n  min-width: 0;\n}\n.metric-value {\n  font-size: 1.3rem;\n  font-weight: 700;\n  color: #10B981;\n  line-height: 1.2;\n}\n.metric-label {\n  font-size: 0.7rem;\n  color: #94a3b8;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.two-column-layout {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 1.5rem;\n  height: calc(100vh - 400px);\n  min-height: 500px;\n}\n.left-column {\n  display: flex;\n  flex-direction: column;\n  background: #1E293B;\n  border: 1px solid #334155;\n  border-radius: 8px;\n  overflow: hidden;\n}\n.discado-panel {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  overflow: hidden;\n}\n.discado-panel h3 {\n  margin: 0;\n  padding: 1rem;\n  font-size: 0.95rem;\n  color: #ffffff;\n  font-weight: 600;\n  background: #0A0E27;\n  border-bottom: 1px solid #334155;\n}\n.discado-table-container {\n  flex: 1;\n  overflow-y: auto;\n  overflow-x: auto;\n}\n.discado-table-container::-webkit-scrollbar {\n  width: 8px;\n  height: 8px;\n}\n.discado-table-container::-webkit-scrollbar-track {\n  background: #0A0E27;\n}\n.discado-table-container::-webkit-scrollbar-thumb {\n  background: #334155;\n  border-radius: 4px;\n}\n.discado-table-container::-webkit-scrollbar-thumb:hover {\n  background: #475569;\n}\n.discado-table {\n  width: 100%;\n  border-collapse: collapse;\n  font-size: 0.8rem;\n}\n.discado-table thead {\n  position: sticky;\n  top: 0;\n  background: #0A0E27;\n  z-index: 10;\n}\n.discado-table th {\n  padding: 0.7rem 0.8rem;\n  text-align: left;\n  font-weight: 600;\n  color: #94a3b8;\n  font-size: 0.75rem;\n  text-transform: uppercase;\n  border-bottom: 1px solid #334155;\n}\n.discado-table tbody tr {\n  transition: background-color 0.2s;\n  animation: fadeIn 0.3s ease-in;\n}\n@keyframes fadeIn {\n  from {\n    opacity: 0;\n    transform: translateY(-10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n.llamada-row:hover {\n  background: rgba(59, 130, 246, 0.05);\n}\n.discado-table td {\n  padding: 0.7rem 0.8rem;\n  border-bottom: 1px solid #334155;\n  color: #e2e8f0;\n}\n.llamada-hora {\n  font-family: monospace;\n  font-size: 0.75rem;\n  color: #94a3b8;\n}\n.llamada-telefono {\n  font-family: monospace;\n  font-size: 0.8rem;\n  color: #10B981;\n  font-weight: 600;\n}\n.llamada-agente {\n  font-size: 0.75rem;\n  color: #e2e8f0;\n}\n.llamada-estado {\n  text-align: center;\n}\n.estado-badge-mini {\n  display: inline-block;\n  padding: 0.2rem 0.5rem;\n  border-radius: 50px;\n  background: #3B82F6;\n  color: white;\n  font-size: 0.7rem;\n  font-weight: 600;\n  white-space: nowrap;\n}\n.llamada-duracion {\n  font-family: monospace;\n  font-size: 0.75rem;\n  font-weight: 600;\n  color: #10B981;\n  text-align: center;\n}\n.right-column {\n  display: flex;\n  flex-direction: column;\n}\n.agentes-panel {\n  flex: 1;\n  background: #1E293B;\n  border: 1px solid #334155;\n  border-radius: 8px;\n  overflow: hidden;\n  display: flex;\n  flex-direction: column;\n}\n.agentes-header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 1rem;\n  background: #0A0E27;\n  border-bottom: 1px solid #334155;\n}\n.agentes-panel h3 {\n  margin: 0;\n  font-size: 0.95rem;\n  color: #ffffff;\n  font-weight: 600;\n}\n.btn-view-all {\n  padding: 6px 12px;\n  background: #3B82F6;\n  color: white;\n  border: none;\n  border-radius: 6px;\n  cursor: pointer;\n  font-size: 13px;\n  font-weight: 500;\n  transition: all 0.3s;\n}\n.btn-view-all:hover {\n  background: #2563EB;\n  transform: translateY(-2px);\n}\n.agentes-table-container {\n  flex: 1;\n  overflow-y: auto;\n  overflow-x: auto;\n}\n.agentes-table-container::-webkit-scrollbar {\n  width: 8px;\n  height: 8px;\n}\n.agentes-table-container::-webkit-scrollbar-track {\n  background: #0A0E27;\n}\n.agentes-table-container::-webkit-scrollbar-thumb {\n  background: #334155;\n  border-radius: 4px;\n}\n.agentes-table-container::-webkit-scrollbar-thumb:hover {\n  background: #475569;\n}\n.agentes-table {\n  width: 100%;\n  border-collapse: collapse;\n  font-size: 0.8rem;\n}\n.agentes-table thead {\n  position: sticky;\n  top: 0;\n  background: #0A0E27;\n  z-index: 10;\n}\n.agentes-table th {\n  padding: 0.7rem 0.8rem;\n  text-align: left;\n  font-weight: 600;\n  color: #94a3b8;\n  font-size: 0.75rem;\n  text-transform: uppercase;\n  border-bottom: 1px solid #334155;\n}\n.agentes-table tbody tr {\n  transition: background-color 0.2s;\n}\n.agente-row:hover {\n  background: rgba(16, 185, 129, 0.05);\n}\n.agentes-table td {\n  padding: 0.7rem 0.8rem;\n  border-bottom: 1px solid #334155;\n  color: #e2e8f0;\n}\n.agente-info {\n  display: flex;\n  flex-direction: column;\n  gap: 0.2rem;\n}\n.agente-extension {\n  font-size: 0.75rem;\n  color: #10B981;\n  font-weight: 600;\n  font-family: monospace;\n}\n.agente-nombre {\n  font-size: 0.7rem;\n  color: #94a3b8;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  max-width: 180px;\n}\n.agente-estado {\n  text-align: center;\n}\n.estado-badge {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.3rem;\n  padding: 0.3rem 0.6rem;\n  border-radius: 50px;\n  color: white;\n  font-size: 0.7rem;\n  font-weight: 600;\n  white-space: nowrap;\n}\n.agente-telefono {\n  font-family: monospace;\n  font-size: 0.75rem;\n  color: #e2e8f0;\n}\n.agente-tiempo {\n  font-family: monospace;\n  font-size: 0.75rem;\n  font-weight: 600;\n  color: #10B981;\n  text-align: center;\n}\n.empty-row td {\n  padding: 2rem 1rem;\n}\n@media (max-width: 1200px) {\n  .two-column-layout {\n    grid-template-columns: 1fr;\n    height: auto;\n  }\n  .left-column,\n  .right-column {\n    min-height: 400px;\n    max-height: 500px;\n  }\n  .metrics-grid {\n    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));\n  }\n}\n@media (max-width: 768px) {\n  .monitoring-container {\n    padding: 1rem;\n  }\n  .header {\n    flex-direction: column;\n    align-items: flex-start;\n    gap: 0.5rem;\n  }\n  .campaign-selector {\n    flex-direction: column;\n    align-items: flex-start;\n  }\n  .campaign-select {\n    max-width: 100%;\n  }\n  .two-column-layout {\n    gap: 1rem;\n  }\n  .metrics-grid {\n    grid-template-columns: repeat(2, 1fr);\n  }\n}\n.agente-row.alert-row {\n  background: rgba(239, 68, 68, 0.1) !important;\n  animation: alertRowPulse 2s ease-in-out infinite;\n}\n@keyframes alertRowPulse {\n  0%, 100% {\n    background: rgba(239, 68, 68, 0.1);\n  }\n  50% {\n    background: rgba(239, 68, 68, 0.2);\n  }\n}\n.alert-overlay {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background: rgba(0, 0, 0, 0.7);\n  -webkit-backdrop-filter: blur(4px);\n  backdrop-filter: blur(4px);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 9999;\n  animation: fadeIn 0.3s ease;\n}\n@keyframes fadeIn {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n.alert-modal {\n  background:\n    linear-gradient(\n      135deg,\n      #1E293B 0%,\n      #0F172A 100%);\n  border: 1px solid #EF4444;\n  border-radius: 16px;\n  padding: 0;\n  width: 90%;\n  max-width: 420px;\n  box-shadow: 0 20px 60px rgba(239, 68, 68, 0.3), 0 0 40px rgba(239, 68, 68, 0.1);\n  animation: modalSlideIn 0.3s ease, modalPulse 2s ease-in-out infinite;\n  position: relative;\n  overflow: hidden;\n}\n@keyframes modalSlideIn {\n  from {\n    transform: scale(0.9) translateY(-20px);\n    opacity: 0;\n  }\n  to {\n    transform: scale(1) translateY(0);\n    opacity: 1;\n  }\n}\n@keyframes modalPulse {\n  0%, 100% {\n    box-shadow: 0 20px 60px rgba(239, 68, 68, 0.3), 0 0 40px rgba(239, 68, 68, 0.1);\n  }\n  50% {\n    box-shadow: 0 20px 80px rgba(239, 68, 68, 0.5), 0 0 60px rgba(239, 68, 68, 0.2);\n  }\n}\n.alert-close {\n  position: absolute;\n  top: 12px;\n  right: 12px;\n  background: rgba(255, 255, 255, 0.1);\n  border: none;\n  color: #94A3B8;\n  width: 32px;\n  height: 32px;\n  border-radius: 50%;\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  transition: all 0.2s;\n  z-index: 1;\n}\n.alert-close:hover {\n  background: rgba(239, 68, 68, 0.2);\n  color: #EF4444;\n}\n.alert-header {\n  background:\n    linear-gradient(\n      135deg,\n      #EF4444 0%,\n      #DC2626 100%);\n  padding: 1.5rem;\n  text-align: center;\n}\n.alert-icon-container {\n  width: 64px;\n  height: 64px;\n  background: rgba(255, 255, 255, 0.2);\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  margin: 0 auto 0.75rem;\n  animation: iconShake 0.5s ease-in-out infinite;\n}\n@keyframes iconShake {\n  0%, 100% {\n    transform: rotate(0deg);\n  }\n  25% {\n    transform: rotate(-5deg);\n  }\n  75% {\n    transform: rotate(5deg);\n  }\n}\n.alert-icon {\n  color: white;\n}\n.alert-header h3 {\n  margin: 0;\n  color: white;\n  font-size: 1.25rem;\n  font-weight: 600;\n}\n.alert-body {\n  padding: 1.5rem;\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n}\n.alert-agent-info {\n  display: flex;\n  align-items: center;\n  gap: 1rem;\n  background: rgba(255, 255, 255, 0.05);\n  padding: 1rem;\n  border-radius: 12px;\n  border: 1px solid #334155;\n}\n.agent-avatar {\n  width: 48px;\n  height: 48px;\n  background:\n    linear-gradient(\n      135deg,\n      #3B82F6 0%,\n      #2563EB 100%);\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  color: white;\n}\n.agent-details {\n  display: flex;\n  flex-direction: column;\n  gap: 0.25rem;\n}\n.agent-name {\n  color: white;\n  font-weight: 600;\n  font-size: 1rem;\n}\n.agent-extension {\n  color: #94A3B8;\n  font-size: 0.85rem;\n}\n.alert-status {\n  display: flex;\n  align-items: center;\n  gap: 0.75rem;\n}\n.status-label {\n  color: #94A3B8;\n  font-size: 0.9rem;\n}\n.alert-status .status-badge {\n  padding: 0.35rem 0.75rem;\n  border-radius: 20px;\n  color: white;\n  font-size: 0.85rem;\n  font-weight: 500;\n}\n.alert-time,\n.alert-message {\n  display: flex;\n  align-items: center;\n  gap: 0.75rem;\n  color: #CBD5E1;\n  font-size: 0.95rem;\n}\n.alert-time lucide-angular,\n.alert-message lucide-angular {\n  color: #94A3B8;\n}\n.alert-message {\n  background: rgba(239, 68, 68, 0.1);\n  padding: 0.75rem 1rem;\n  border-radius: 8px;\n  border-left: 3px solid #EF4444;\n}\n.alert-message lucide-angular {\n  color: #EF4444;\n}\n.alert-footer {\n  padding: 1rem 1.5rem 1.5rem;\n  display: flex;\n  justify-content: center;\n}\n.btn-dismiss {\n  background:\n    linear-gradient(\n      135deg,\n      #3B82F6 0%,\n      #2563EB 100%);\n  border: none;\n  color: white;\n  padding: 0.75rem 2rem;\n  border-radius: 8px;\n  font-size: 1rem;\n  font-weight: 500;\n  cursor: pointer;\n  transition: all 0.2s;\n  min-width: 150px;\n}\n.btn-dismiss:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);\n}\n/*# sourceMappingURL=campaign-monitoring.component.css.map */\n"] }]
  }], () => [{ type: CampaignAdminService }, { type: AutoDialerService }, { type: Router }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(CampaignMonitoringComponent, { className: "CampaignMonitoringComponent", filePath: "src/app/features/admin/campaign-monitoring/campaign-monitoring.component.ts", lineNumber: 25 });
})();
export {
  CampaignMonitoringComponent
};
//# sourceMappingURL=chunk-CJ6WDZ3T.js.map
