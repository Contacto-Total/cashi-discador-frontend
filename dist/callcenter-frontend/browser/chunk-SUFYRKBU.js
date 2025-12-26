import {
  MAT_DIALOG_DATA,
  MatDialogRef
} from "./chunk-HBS4YI6H.js";
import {
  WebsocketService
} from "./chunk-NSDE3IOW.js";
import {
  MatCommonModule,
  _getAnimationsState
} from "./chunk-M2YI7FKS.js";
import {
  Router
} from "./chunk-OCZLH7K5.js";
import {
  LucideAngularComponent,
  LucideAngularModule
} from "./chunk-RFBUEVFE.js";
import {
  environment
} from "./chunk-QF774CZR.js";
import {
  ANIMATION_MODULE_TYPE,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  CommonModule,
  Component,
  DOCUMENT,
  DecimalPipe,
  ElementRef,
  EventEmitter,
  HttpClient,
  HttpHeaders,
  Inject,
  Injectable,
  InjectionToken,
  Input,
  NgIf,
  NgModule,
  NgZone,
  Output,
  Renderer2,
  RendererFactory2,
  RuntimeError,
  Subject,
  ViewEncapsulation,
  inject,
  numberAttribute,
  setClassMetadata,
  signal,
  tap,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassMap,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵdirectiveInject,
  ɵɵdomElement,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵelement,
  ɵɵelementContainerEnd,
  ɵɵelementContainerStart,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵinject,
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
  ɵɵtextInterpolate2
} from "./chunk-CTRHJBBW.js";

// src/app/core/services/autorizacion.service.ts
var _AutorizacionService = class _AutorizacionService {
  constructor(http, webSocketService) {
    this.http = http;
    this.webSocketService = webSocketService;
    this.baseUrl = `${environment.gatewayUrl}/autorizaciones`;
    this.supervisoresEnLinea = signal([], ...ngDevMode ? [{ debugName: "supervisoresEnLinea" }] : []);
    this.solicitudesPendientes = signal([], ...ngDevMode ? [{ debugName: "solicitudesPendientes" }] : []);
    this.solicitudActual = signal(null, ...ngDevMode ? [{ debugName: "solicitudActual" }] : []);
    this.cargando = signal(false, ...ngDevMode ? [{ debugName: "cargando" }] : []);
    this.nuevaSolicitudSubject = new Subject();
    this.respuestaSubject = new Subject();
    this.nuevaSolicitud$ = this.nuevaSolicitudSubject.asObservable();
    this.respuesta$ = this.respuestaSubject.asObservable();
    this.wsSubscribed = false;
    this.subscribeToWebSocket();
  }
  getHeaders() {
    const token = localStorage.getItem("callcenter_token");
    return new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": token ? `Bearer ${token}` : ""
    });
  }
  /**
   * Obtiene el ID del usuario actual desde localStorage
   */
  getCurrentUserId() {
    try {
      const userStr = localStorage.getItem("callcenter_user");
      if (userStr) {
        const user = JSON.parse(userStr);
        return user.id || null;
      }
    } catch (e) {
      console.error("[AUTORIZACION] Error obteniendo usuario actual:", e);
    }
    return null;
  }
  /**
   * Obtiene los supervisores/admins que están en línea
   */
  obtenerSupervisoresEnLinea() {
    console.log("[AUTORIZACION] Obteniendo supervisores en l\xEDnea...");
    this.cargando.set(true);
    return this.http.get(`${this.baseUrl}/supervisores-en-linea`, { headers: this.getHeaders() }).pipe(tap((supervisores) => {
      this.supervisoresEnLinea.set(supervisores);
      this.cargando.set(false);
      console.log("[AUTORIZACION] Supervisores encontrados:", supervisores.length);
    }));
  }
  /**
   * Crea una nueva solicitud de autorización
   */
  crearSolicitud(request) {
    console.log("[AUTORIZACION] Creando solicitud:", request);
    this.cargando.set(true);
    return this.http.post(this.baseUrl, request, { headers: this.getHeaders() }).pipe(tap((solicitud) => {
      this.solicitudActual.set(solicitud);
      this.cargando.set(false);
      console.log("[AUTORIZACION] Solicitud creada:", solicitud.uuid);
    }));
  }
  /**
   * Responde a una solicitud (aprobar o rechazar)
   */
  responderSolicitud(request) {
    console.log("[AUTORIZACION] Respondiendo solicitud:", request);
    return this.http.post(`${this.baseUrl}/responder`, request, { headers: this.getHeaders() }).pipe(tap((solicitud) => {
      console.log("[AUTORIZACION] Solicitud respondida:", solicitud.estado);
      this.solicitudesPendientes.update((list) => list.filter((s) => s.uuid !== solicitud.uuid));
    }));
  }
  /**
   * Obtiene solicitudes pendientes para un supervisor
   */
  obtenerSolicitudesPendientes(idSupervisor) {
    console.log("[AUTORIZACION] Obteniendo pendientes para supervisor:", idSupervisor);
    return this.http.get(`${this.baseUrl}/pendientes/${idSupervisor}`, { headers: this.getHeaders() }).pipe(tap((solicitudes) => {
      this.solicitudesPendientes.set(solicitudes);
      console.log("[AUTORIZACION] Solicitudes pendientes:", solicitudes.length);
    }));
  }
  /**
   * Obtiene una solicitud por UUID
   */
  obtenerPorUuid(uuid) {
    return this.http.get(`${this.baseUrl}/${uuid}`, { headers: this.getHeaders() });
  }
  /**
   * Cancela una solicitud pendiente
   */
  cancelarSolicitud(uuid, idAgente) {
    console.log("[AUTORIZACION] Cancelando solicitud:", uuid);
    return this.http.post(`${this.baseUrl}/${uuid}/cancelar`, { idAgente }, { headers: this.getHeaders() }).pipe(tap((solicitud) => {
      this.solicitudActual.set(null);
      console.log("[AUTORIZACION] Solicitud cancelada");
    }));
  }
  /**
   * Suscribe a eventos de WebSocket para autorizaciones
   */
  subscribeToWebSocket() {
    if (this.wsSubscribed)
      return;
    console.log("[AUTORIZACION] Iniciando suscripci\xF3n a WebSocket...");
    if (!this.webSocketService.isConnected()) {
      console.log("[AUTORIZACION] WebSocket no conectado, iniciando conexi\xF3n...");
      this.webSocketService.connect();
    }
    console.log("[AUTORIZACION] Suscribiendo a /user/queue/messages...");
    this.webSocketService.subscribe("/user/queue/messages").subscribe((message) => {
      console.log("[AUTORIZACION] \u{1F4EC} Mensaje recibido en /user/queue/messages:", message);
      this.handleWebSocketMessage(message);
    });
    console.log("[AUTORIZACION] Suscribiendo a /topic/autorizaciones/supervisores...");
    this.webSocketService.subscribe("/topic/autorizaciones/supervisores").subscribe((message) => {
      console.log("[AUTORIZACION] \u{1F4EC} Mensaje recibido en /topic/autorizaciones/supervisores:", message);
      this.handleWebSocketMessage(message);
    });
    this.wsSubscribed = true;
    console.log("[AUTORIZACION] \u2705 Subscrito a WebSocket para autorizaciones");
  }
  /**
   * Forzar re-suscripción al WebSocket (útil si la conexión se perdió)
   */
  ensureWebSocketSubscription() {
    console.log("[AUTORIZACION] Verificando suscripci\xF3n WebSocket...");
    if (!this.wsSubscribed) {
      this.subscribeToWebSocket();
    } else {
      console.log("[AUTORIZACION] Ya est\xE1 suscrito a WebSocket");
    }
  }
  /**
   * Maneja mensajes de WebSocket
   */
  handleWebSocketMessage(message) {
    console.log("[AUTORIZACION] \u{1F4E8} Mensaje WebSocket recibido (raw):", JSON.stringify(message, null, 2));
    if (!message)
      return;
    let evento;
    if (message.tipo && message.solicitud) {
      evento = message;
      console.log("[AUTORIZACION] \u2705 Mensaje en formato directo:", evento.tipo);
    } else if (message.payload && message.payload.tipo) {
      evento = message.payload;
      console.log("[AUTORIZACION] \u2705 Mensaje normalizado desde payload:", evento.tipo);
    } else if (message.type && message.payload && message.payload.solicitud) {
      evento = message.payload;
      console.log("[AUTORIZACION] \u2705 Mensaje normalizado desde type/payload:", evento.tipo);
    } else {
      console.log("[AUTORIZACION] \u26A0\uFE0F Formato de mensaje no reconocido:", message);
      return;
    }
    if (!evento.tipo || !evento.solicitud) {
      console.log("[AUTORIZACION] \u26A0\uFE0F Evento incompleto, ignorando:", evento);
      return;
    }
    const currentUserId = this.getCurrentUserId();
    console.log("[AUTORIZACION] Procesando evento:", evento.tipo, "| Usuario actual:", currentUserId);
    switch (evento.tipo) {
      case "NUEVA_SOLICITUD_AUTORIZACION":
        if (evento.solicitud.idSupervisor !== currentUserId) {
          console.log("[AUTORIZACION] Ignorando solicitud - no es para este supervisor. Destinatario:", evento.solicitud.idSupervisor, "Yo:", currentUserId);
          return;
        }
        console.log("[AUTORIZACION] Nueva solicitud recibida para M\xCD!");
        this.solicitudesPendientes.update((list) => [evento.solicitud, ...list]);
        this.nuevaSolicitudSubject.next(evento.solicitud);
        break;
      case "SOLICITUD_APROBADA":
        if (evento.solicitud.idAgenteSolicitante !== currentUserId) {
          console.log("[AUTORIZACION] \u23ED\uFE0F Ignorando APROBADA - no es mi solicitud. Agente:", evento.solicitud.idAgenteSolicitante, "Yo:", currentUserId);
          return;
        }
        console.log("[AUTORIZACION] \u2705 \xA1MI Solicitud fue APROBADA!");
        this.solicitudActual.set(evento.solicitud);
        this.respuestaSubject.next(evento.solicitud);
        break;
      case "SOLICITUD_RECHAZADA":
        if (evento.solicitud.idAgenteSolicitante !== currentUserId) {
          console.log("[AUTORIZACION] \u23ED\uFE0F Ignorando RECHAZADA - no es mi solicitud. Agente:", evento.solicitud.idAgenteSolicitante, "Yo:", currentUserId);
          return;
        }
        console.log("[AUTORIZACION] \u274C \xA1MI Solicitud fue RECHAZADA!");
        this.solicitudActual.set(evento.solicitud);
        this.respuestaSubject.next(evento.solicitud);
        break;
      case "SOLICITUD_CANCELADA":
        console.log("[AUTORIZACION] Solicitud cancelada por agente");
        this.solicitudesPendientes.update((list) => list.filter((s) => s.uuid !== evento.solicitud.uuid));
        break;
      case "SOLICITUD_EXPIRADA":
        console.log("[AUTORIZACION] Solicitud expirada!");
        this.solicitudActual.set(evento.solicitud);
        this.respuestaSubject.next(evento.solicitud);
        break;
    }
  }
  /**
   * Limpia el estado actual
   */
  limpiarEstado() {
    this.solicitudActual.set(null);
    this.supervisoresEnLinea.set([]);
  }
};
_AutorizacionService.\u0275fac = function AutorizacionService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _AutorizacionService)(\u0275\u0275inject(HttpClient), \u0275\u0275inject(WebsocketService));
};
_AutorizacionService.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AutorizacionService, factory: _AutorizacionService.\u0275fac, providedIn: "root" });
var AutorizacionService = _AutorizacionService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AutorizacionService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{ type: HttpClient }, { type: WebsocketService }], null);
})();

// src/app/core/services/recordatorios.service.ts
var _RecordatoriosService = class _RecordatoriosService {
  constructor(http) {
    this.http = http;
    this.baseUrl = `${environment.apiUrl}/v2/management-records/recordatorios`;
  }
  /**
   * Obtiene los recordatorios de promesas de pago para hoy del agente
   */
  getMisRecordatoriosHoy(idAgente) {
    return this.http.get(`${this.baseUrl}/hoy/${idAgente}`);
  }
  /**
   * Obtiene los recordatorios de los próximos N días
   */
  getMisRecordatoriosProximos(idAgente, dias = 3) {
    return this.http.get(`${this.baseUrl}/proximos/${idAgente}?dias=${dias}`);
  }
  /**
   * Registra un intento de recordatorio
   */
  registrarIntento(request) {
    return this.http.post(`${this.baseUrl}/registrar`, request);
  }
  /**
   * Obtiene las estadísticas de recordatorios del agente
   */
  getEstadisticas(idAgente, fecha) {
    let url = `${this.baseUrl}/estadisticas/${idAgente}`;
    if (fecha) {
      url += `?fecha=${fecha}`;
    }
    return this.http.get(url);
  }
  /**
   * Obtiene los posibles resultados para un recordatorio (para dropdown)
   */
  getResultadosPosibles() {
    return this.http.get(`${this.baseUrl}/resultados-posibles`);
  }
  // ==================== DIALER METHODS ====================
  /**
   * Inicia el discado automático de recordatorios
   */
  iniciarDialer(idAgente) {
    return this.http.post(`${this.baseUrl}/dialer/iniciar/${idAgente}`, {});
  }
  /**
   * Obtiene el siguiente recordatorio de la cola
   */
  obtenerSiguiente(idAgente) {
    return this.http.get(`${this.baseUrl}/dialer/siguiente/${idAgente}`);
  }
  /**
   * Marca el recordatorio actual como completado
   */
  completarActual(idAgente, resultado, uuidLlamada, observaciones) {
    let params = "";
    const queryParams = [];
    if (resultado)
      queryParams.push(`resultado=${resultado}`);
    if (uuidLlamada)
      queryParams.push(`uuidLlamada=${uuidLlamada}`);
    if (observaciones)
      queryParams.push(`observaciones=${encodeURIComponent(observaciones)}`);
    if (queryParams.length > 0) {
      params = "?" + queryParams.join("&");
    }
    return this.http.post(`${this.baseUrl}/dialer/completar/${idAgente}${params}`, {});
  }
  /**
   * Detiene el discado de recordatorios
   */
  detenerDialer(idAgente) {
    return this.http.delete(`${this.baseUrl}/dialer/detener/${idAgente}`);
  }
  /**
   * Obtiene el estado actual del dialer
   */
  obtenerEstadoDialer(idAgente) {
    return this.http.get(`${this.baseUrl}/dialer/estado/${idAgente}`);
  }
};
_RecordatoriosService.\u0275fac = function RecordatoriosService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _RecordatoriosService)(\u0275\u0275inject(HttpClient));
};
_RecordatoriosService.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _RecordatoriosService, factory: _RecordatoriosService.\u0275fac, providedIn: "root" });
var RecordatoriosService = _RecordatoriosService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RecordatoriosService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{ type: HttpClient }], null);
})();

// node_modules/@angular/animations/fesm2022/private_export.mjs
var AnimationMetadataType;
(function(AnimationMetadataType2) {
  AnimationMetadataType2[AnimationMetadataType2["State"] = 0] = "State";
  AnimationMetadataType2[AnimationMetadataType2["Transition"] = 1] = "Transition";
  AnimationMetadataType2[AnimationMetadataType2["Sequence"] = 2] = "Sequence";
  AnimationMetadataType2[AnimationMetadataType2["Group"] = 3] = "Group";
  AnimationMetadataType2[AnimationMetadataType2["Animate"] = 4] = "Animate";
  AnimationMetadataType2[AnimationMetadataType2["Keyframes"] = 5] = "Keyframes";
  AnimationMetadataType2[AnimationMetadataType2["Style"] = 6] = "Style";
  AnimationMetadataType2[AnimationMetadataType2["Trigger"] = 7] = "Trigger";
  AnimationMetadataType2[AnimationMetadataType2["Reference"] = 8] = "Reference";
  AnimationMetadataType2[AnimationMetadataType2["AnimateChild"] = 9] = "AnimateChild";
  AnimationMetadataType2[AnimationMetadataType2["AnimateRef"] = 10] = "AnimateRef";
  AnimationMetadataType2[AnimationMetadataType2["Query"] = 11] = "Query";
  AnimationMetadataType2[AnimationMetadataType2["Stagger"] = 12] = "Stagger";
})(AnimationMetadataType || (AnimationMetadataType = {}));
var AUTO_STYLE = "*";
function trigger(name, definitions) {
  return { type: AnimationMetadataType.Trigger, name, definitions, options: {} };
}
function animate(timings, styles = null) {
  return { type: AnimationMetadataType.Animate, styles, timings };
}
function sequence(steps, options = null) {
  return { type: AnimationMetadataType.Sequence, steps, options };
}
function style(tokens) {
  return { type: AnimationMetadataType.Style, styles: tokens, offset: null };
}
function state(name, styles, options) {
  return { type: AnimationMetadataType.State, name, styles, options };
}
function keyframes(steps) {
  return { type: AnimationMetadataType.Keyframes, steps };
}
function transition(stateChangeExpr, steps, options = null) {
  return { type: AnimationMetadataType.Transition, expr: stateChangeExpr, animation: steps, options };
}
var NoopAnimationPlayer = class {
  _onDoneFns = [];
  _onStartFns = [];
  _onDestroyFns = [];
  _originalOnDoneFns = [];
  _originalOnStartFns = [];
  _started = false;
  _destroyed = false;
  _finished = false;
  _position = 0;
  parentPlayer = null;
  totalTime;
  constructor(duration = 0, delay = 0) {
    this.totalTime = duration + delay;
  }
  _onFinish() {
    if (!this._finished) {
      this._finished = true;
      this._onDoneFns.forEach((fn) => fn());
      this._onDoneFns = [];
    }
  }
  onStart(fn) {
    this._originalOnStartFns.push(fn);
    this._onStartFns.push(fn);
  }
  onDone(fn) {
    this._originalOnDoneFns.push(fn);
    this._onDoneFns.push(fn);
  }
  onDestroy(fn) {
    this._onDestroyFns.push(fn);
  }
  hasStarted() {
    return this._started;
  }
  init() {
  }
  play() {
    if (!this.hasStarted()) {
      this._onStart();
      this.triggerMicrotask();
    }
    this._started = true;
  }
  /** @internal */
  triggerMicrotask() {
    queueMicrotask(() => this._onFinish());
  }
  _onStart() {
    this._onStartFns.forEach((fn) => fn());
    this._onStartFns = [];
  }
  pause() {
  }
  restart() {
  }
  finish() {
    this._onFinish();
  }
  destroy() {
    if (!this._destroyed) {
      this._destroyed = true;
      if (!this.hasStarted()) {
        this._onStart();
      }
      this.finish();
      this._onDestroyFns.forEach((fn) => fn());
      this._onDestroyFns = [];
    }
  }
  reset() {
    this._started = false;
    this._finished = false;
    this._onStartFns = this._originalOnStartFns;
    this._onDoneFns = this._originalOnDoneFns;
  }
  setPosition(position) {
    this._position = this.totalTime ? position * this.totalTime : 1;
  }
  getPosition() {
    return this.totalTime ? this._position / this.totalTime : 1;
  }
  /** @internal */
  triggerCallback(phaseName) {
    const methods = phaseName == "start" ? this._onStartFns : this._onDoneFns;
    methods.forEach((fn) => fn());
    methods.length = 0;
  }
};
var AnimationGroupPlayer = class {
  _onDoneFns = [];
  _onStartFns = [];
  _finished = false;
  _started = false;
  _destroyed = false;
  _onDestroyFns = [];
  parentPlayer = null;
  totalTime = 0;
  players;
  constructor(_players) {
    this.players = _players;
    let doneCount = 0;
    let destroyCount = 0;
    let startCount = 0;
    const total = this.players.length;
    if (total == 0) {
      queueMicrotask(() => this._onFinish());
    } else {
      this.players.forEach((player) => {
        player.onDone(() => {
          if (++doneCount == total) {
            this._onFinish();
          }
        });
        player.onDestroy(() => {
          if (++destroyCount == total) {
            this._onDestroy();
          }
        });
        player.onStart(() => {
          if (++startCount == total) {
            this._onStart();
          }
        });
      });
    }
    this.totalTime = this.players.reduce((time, player) => Math.max(time, player.totalTime), 0);
  }
  _onFinish() {
    if (!this._finished) {
      this._finished = true;
      this._onDoneFns.forEach((fn) => fn());
      this._onDoneFns = [];
    }
  }
  init() {
    this.players.forEach((player) => player.init());
  }
  onStart(fn) {
    this._onStartFns.push(fn);
  }
  _onStart() {
    if (!this.hasStarted()) {
      this._started = true;
      this._onStartFns.forEach((fn) => fn());
      this._onStartFns = [];
    }
  }
  onDone(fn) {
    this._onDoneFns.push(fn);
  }
  onDestroy(fn) {
    this._onDestroyFns.push(fn);
  }
  hasStarted() {
    return this._started;
  }
  play() {
    if (!this.parentPlayer) {
      this.init();
    }
    this._onStart();
    this.players.forEach((player) => player.play());
  }
  pause() {
    this.players.forEach((player) => player.pause());
  }
  restart() {
    this.players.forEach((player) => player.restart());
  }
  finish() {
    this._onFinish();
    this.players.forEach((player) => player.finish());
  }
  destroy() {
    this._onDestroy();
  }
  _onDestroy() {
    if (!this._destroyed) {
      this._destroyed = true;
      this._onFinish();
      this.players.forEach((player) => player.destroy());
      this._onDestroyFns.forEach((fn) => fn());
      this._onDestroyFns = [];
    }
  }
  reset() {
    this.players.forEach((player) => player.reset());
    this._destroyed = false;
    this._finished = false;
    this._started = false;
  }
  setPosition(p) {
    const timeAtPosition = p * this.totalTime;
    this.players.forEach((player) => {
      const position = player.totalTime ? Math.min(1, timeAtPosition / player.totalTime) : 1;
      player.setPosition(position);
    });
  }
  getPosition() {
    const longestPlayer = this.players.reduce((longestSoFar, player) => {
      const newPlayerIsLongest = longestSoFar === null || player.totalTime > longestSoFar.totalTime;
      return newPlayerIsLongest ? player : longestSoFar;
    }, null);
    return longestPlayer != null ? longestPlayer.getPosition() : 0;
  }
  beforeDestroy() {
    this.players.forEach((player) => {
      if (player.beforeDestroy) {
        player.beforeDestroy();
      }
    });
  }
  /** @internal */
  triggerCallback(phaseName) {
    const methods = phaseName == "start" ? this._onStartFns : this._onDoneFns;
    methods.forEach((fn) => fn());
    methods.length = 0;
  }
};
var \u0275PRE_STYLE = "!";

// node_modules/@angular/animations/fesm2022/animations.mjs
var AnimationBuilder = class _AnimationBuilder {
  static \u0275fac = function AnimationBuilder_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AnimationBuilder)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _AnimationBuilder,
    factory: () => (() => inject(BrowserAnimationBuilder))(),
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AnimationBuilder, [{
    type: Injectable,
    args: [{
      providedIn: "root",
      useFactory: () => inject(BrowserAnimationBuilder)
    }]
  }], null, null);
})();
var AnimationFactory = class {
};
var BrowserAnimationBuilder = class _BrowserAnimationBuilder extends AnimationBuilder {
  animationModuleType = inject(ANIMATION_MODULE_TYPE, {
    optional: true
  });
  _nextAnimationId = 0;
  _renderer;
  constructor(rootRenderer, doc) {
    super();
    const typeData = {
      id: "0",
      encapsulation: ViewEncapsulation.None,
      styles: [],
      data: {
        animation: []
      }
    };
    this._renderer = rootRenderer.createRenderer(doc.body, typeData);
    if (this.animationModuleType === null && !isAnimationRenderer(this._renderer)) {
      throw new RuntimeError(3600, (typeof ngDevMode === "undefined" || ngDevMode) && "Angular detected that the `AnimationBuilder` was injected, but animation support was not enabled. Please make sure that you enable animations in your application by calling `provideAnimations()` or `provideAnimationsAsync()` function.");
    }
  }
  build(animation2) {
    const id = this._nextAnimationId;
    this._nextAnimationId++;
    const entry = Array.isArray(animation2) ? sequence(animation2) : animation2;
    issueAnimationCommand(this._renderer, null, id, "register", [entry]);
    return new BrowserAnimationFactory(id, this._renderer);
  }
  static \u0275fac = function BrowserAnimationBuilder_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BrowserAnimationBuilder)(\u0275\u0275inject(RendererFactory2), \u0275\u0275inject(DOCUMENT));
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _BrowserAnimationBuilder,
    factory: _BrowserAnimationBuilder.\u0275fac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BrowserAnimationBuilder, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{
    type: RendererFactory2
  }, {
    type: Document,
    decorators: [{
      type: Inject,
      args: [DOCUMENT]
    }]
  }], null);
})();
var BrowserAnimationFactory = class extends AnimationFactory {
  _id;
  _renderer;
  constructor(_id, _renderer) {
    super();
    this._id = _id;
    this._renderer = _renderer;
  }
  create(element, options) {
    return new RendererAnimationPlayer(this._id, element, options || {}, this._renderer);
  }
};
var RendererAnimationPlayer = class {
  id;
  element;
  _renderer;
  parentPlayer = null;
  _started = false;
  constructor(id, element, options, _renderer) {
    this.id = id;
    this.element = element;
    this._renderer = _renderer;
    this._command("create", options);
  }
  _listen(eventName, callback) {
    return this._renderer.listen(this.element, `@@${this.id}:${eventName}`, callback);
  }
  _command(command, ...args) {
    issueAnimationCommand(this._renderer, this.element, this.id, command, args);
  }
  onDone(fn) {
    this._listen("done", fn);
  }
  onStart(fn) {
    this._listen("start", fn);
  }
  onDestroy(fn) {
    this._listen("destroy", fn);
  }
  init() {
    this._command("init");
  }
  hasStarted() {
    return this._started;
  }
  play() {
    this._command("play");
    this._started = true;
  }
  pause() {
    this._command("pause");
  }
  restart() {
    this._command("restart");
  }
  finish() {
    this._command("finish");
  }
  destroy() {
    this._command("destroy");
  }
  reset() {
    this._command("reset");
    this._started = false;
  }
  setPosition(p) {
    this._command("setPosition", p);
  }
  getPosition() {
    return unwrapAnimationRenderer(this._renderer)?.engine?.players[this.id]?.getPosition() ?? 0;
  }
  totalTime = 0;
};
function issueAnimationCommand(renderer, element, id, command, args) {
  renderer.setProperty(element, `@@${id}:${command}`, args);
}
function unwrapAnimationRenderer(renderer) {
  const type = renderer.\u0275type;
  if (type === 0) {
    return renderer;
  } else if (type === 1) {
    return renderer.animationRenderer;
  }
  return null;
}
function isAnimationRenderer(renderer) {
  const type = renderer.\u0275type;
  return type === 0 || type === 1;
}

// src/app/shared/components/recordatorios-modal/recordatorios-modal.component.ts
function RecordatoriosModalComponent_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275elementStart(1, "div", 2)(2, "div", 3);
    \u0275\u0275element(3, "lucide-angular", 4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div")(5, "h2", 5);
    \u0275\u0275text(6, "Recordatorios del d\xEDa");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p", 6);
    \u0275\u0275text(8, "Promesas de pago que vencen hoy");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(9, "div", 7)(10, "div", 8)(11, "div")(12, "p", 9);
    \u0275\u0275text(13, "Tienes");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "p", 10);
    \u0275\u0275text(15);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "p", 9);
    \u0275\u0275text(17, "cliente(s) por llamar");
    \u0275\u0275elementEnd()();
    \u0275\u0275element(18, "lucide-angular", 11);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(19, "p", 12);
    \u0275\u0275text(20, " Inicia el marcado autom\xE1tico para recordar a tus clientes sobre sus compromisos de pago. ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "div", 13)(22, "button", 14);
    \u0275\u0275listener("click", function RecordatoriosModalComponent_ng_container_1_Template_button_click_22_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.cerrar());
    });
    \u0275\u0275text(23, " M\xE1s tarde ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "button", 15);
    \u0275\u0275listener("click", function RecordatoriosModalComponent_ng_container_1_Template_button_click_24_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.iniciarDiscado());
    });
    \u0275\u0275element(25, "lucide-angular", 16);
    \u0275\u0275text(26);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275property("size", 24);
    \u0275\u0275advance(12);
    \u0275\u0275textInterpolate(ctx_r1.data.pendientes);
    \u0275\u0275advance(3);
    \u0275\u0275property("size", 48);
    \u0275\u0275advance(6);
    \u0275\u0275property("disabled", ctx_r1.isLoading);
    \u0275\u0275advance();
    \u0275\u0275property("size", 16);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.isLoading ? "Cargando..." : "Iniciar", " ");
  }
}
function RecordatoriosModalComponent_ng_container_2_div_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 23);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("text-red-500", ctx_r1.countdownNumber <= 2)("text-orange-500", ctx_r1.countdownNumber === 3)("text-yellow-500", ctx_r1.countdownNumber === 4)("text-green-500", ctx_r1.countdownNumber === 5);
    \u0275\u0275property("@countdownNumber", void 0);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.countdownNumber, " ");
  }
}
function RecordatoriosModalComponent_ng_container_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275elementStart(1, "div", 17)(2, "p", 18);
    \u0275\u0275text(3, "Iniciando en...");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 19);
    \u0275\u0275template(5, RecordatoriosModalComponent_ng_container_2_div_5_Template, 2, 10, "div", 20);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p", 21);
    \u0275\u0275text(7, " Preparando la llamada al cliente... ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "button", 22);
    \u0275\u0275listener("click", function RecordatoriosModalComponent_ng_container_2_Template_button_click_8_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.cancelarDiscado());
    });
    \u0275\u0275text(9, " Cancelar ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275property("ngIf", ctx_r1.countdownNumber > 0);
  }
}
function RecordatoriosModalComponent_ng_container_3_div_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 30)(1, "p", 6);
    \u0275\u0275text(2, "Cliente");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 31);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 32)(6, "div")(7, "p", 33);
    \u0275\u0275text(8, "Tel\xE9fono");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "p", 34);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "div")(12, "p", 33);
    \u0275\u0275text(13, "Monto");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "p", 35);
    \u0275\u0275text(15);
    \u0275\u0275pipe(16, "number");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(17, "div", 36)(18, "p", 33);
    \u0275\u0275text(19);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.recordatorioActual.nombreCliente);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(ctx_r1.recordatorioActual.telefono);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("S/ ", \u0275\u0275pipeBind2(16, 5, ctx_r1.recordatorioActual.monto, "1.2-2"));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate2("Cuota ", ctx_r1.recordatorioActual.numeroCuota, " de ", ctx_r1.recordatorioActual.totalCuotas);
  }
}
function RecordatoriosModalComponent_ng_container_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275elementStart(1, "div", 24)(2, "div", 25);
    \u0275\u0275element(3, "lucide-angular", 26);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "h2", 27);
    \u0275\u0275text(5, "Llamando...");
    \u0275\u0275elementEnd();
    \u0275\u0275template(6, RecordatoriosModalComponent_ng_container_3_div_6_Template, 20, 8, "div", 28);
    \u0275\u0275elementStart(7, "div", 29);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("@fadeSlide", void 0);
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 32);
    \u0275\u0275advance(3);
    \u0275\u0275property("ngIf", ctx_r1.recordatorioActual);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2(" Recordatorio ", (ctx_r1.estadoDialer == null ? null : ctx_r1.estadoDialer.recordatoriosCompletados) || 0, " de ", (ctx_r1.estadoDialer == null ? null : ctx_r1.estadoDialer.totalRecordatorios) || 0, " ");
  }
}
function RecordatoriosModalComponent_ng_container_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275elementStart(1, "div", 37)(2, "div", 38);
    \u0275\u0275element(3, "lucide-angular", 39);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "h2", 27);
    \u0275\u0275text(5, "\xA1Terminaste!");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p", 40);
    \u0275\u0275text(7, " Has completado todos tus recordatorios de pago por hoy. ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "div", 41)(9, "div", 42);
    \u0275\u0275element(10, "lucide-angular", 43);
    \u0275\u0275elementStart(11, "p", 44);
    \u0275\u0275text(12, " Ya puedes ponerte en l\xEDnea para gestionar ");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(13, "button", 45);
    \u0275\u0275listener("click", function RecordatoriosModalComponent_ng_container_4_Template_button_click_13_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.cerrar());
    });
    \u0275\u0275element(14, "lucide-angular", 46);
    \u0275\u0275text(15, " Ir al Dialer ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("@fadeSlide", void 0);
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 40);
    \u0275\u0275advance(7);
    \u0275\u0275property("size", 24);
    \u0275\u0275advance(4);
    \u0275\u0275property("size", 18);
  }
}
var _RecordatoriosModalComponent = class _RecordatoriosModalComponent {
  constructor(dialogRef, data, router, recordatoriosService) {
    this.dialogRef = dialogRef;
    this.data = data;
    this.router = router;
    this.recordatoriosService = recordatoriosService;
    this.modalState = "initial";
    this.countdownNumber = 5;
    this.isLoading = false;
    this.recordatorioActual = null;
    this.estadoDialer = null;
    this.countdownInterval = null;
  }
  ngOnInit() {
    if (this.data.modoFinalizado) {
      this.modalState = "finished";
    } else if (this.data.modoSiguiente && this.data.recordatorio) {
      this.recordatorioActual = this.data.recordatorio;
      this.iniciarCountdown();
    }
  }
  ngOnDestroy() {
    this.limpiarInterval();
  }
  cerrar() {
    this.limpiarInterval();
    this.dialogRef.close({ action: "close" });
  }
  iniciarDiscado() {
    this.isLoading = true;
    this.recordatoriosService.iniciarDialer(this.data.idAgente).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.estadoDialer = {
            recordatoriosCompletados: response.estado.recordatoriosCompletados,
            totalRecordatorios: response.estado.totalRecordatorios
          };
          this.iniciarCountdown();
        } else {
          console.error("Error iniciando dialer:", response.mensaje);
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error("Error iniciando dialer:", err);
      }
    });
  }
  iniciarCountdown() {
    this.modalState = "countdown";
    this.countdownNumber = 5;
    this.countdownInterval = setInterval(() => {
      this.countdownNumber--;
      if (this.countdownNumber <= 0) {
        this.limpiarInterval();
        this.obtenerSiguienteYLlamar();
      }
    }, 1e3);
  }
  obtenerSiguienteYLlamar() {
    if (this.data.modoSiguiente && this.recordatorioActual) {
      this.modalState = "calling";
      setTimeout(() => {
        this.dialogRef.close({
          action: "call",
          recordatorio: this.recordatorioActual,
          estado: this.estadoDialer
        });
      }, 1500);
      return;
    }
    this.recordatoriosService.obtenerSiguiente(this.data.idAgente).subscribe({
      next: (response) => {
        if (response.hayMas && response.recordatorio) {
          this.recordatorioActual = response.recordatorio;
          this.estadoDialer = response.estado ? {
            recordatoriosCompletados: response.estado.recordatoriosCompletados,
            totalRecordatorios: response.estado.totalRecordatorios
          } : null;
          this.modalState = "calling";
          setTimeout(() => {
            this.dialogRef.close({
              action: "call",
              recordatorio: this.recordatorioActual,
              estado: this.estadoDialer
            });
          }, 1500);
        } else {
          this.modalState = "finished";
        }
      },
      error: (err) => {
        console.error("Error obteniendo siguiente:", err);
        this.modalState = "finished";
      }
    });
  }
  cancelarDiscado() {
    this.limpiarInterval();
    this.recordatoriosService.detenerDialer(this.data.idAgente).subscribe({
      next: () => {
        this.dialogRef.close({ action: "cancelled" });
      },
      error: () => {
        this.dialogRef.close({ action: "cancelled" });
      }
    });
  }
  limpiarInterval() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
  }
};
_RecordatoriosModalComponent.\u0275fac = function RecordatoriosModalComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _RecordatoriosModalComponent)(\u0275\u0275directiveInject(MatDialogRef), \u0275\u0275directiveInject(MAT_DIALOG_DATA), \u0275\u0275directiveInject(Router), \u0275\u0275directiveInject(RecordatoriosService));
};
_RecordatoriosModalComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _RecordatoriosModalComponent, selectors: [["app-recordatorios-modal"]], decls: 5, vars: 4, consts: [[1, "p-6", "max-w-md", "min-w-[380px]"], [4, "ngIf"], [1, "flex", "items-center", "gap-3", "mb-4"], [1, "w-12", "h-12", "bg-gradient-to-br", "from-orange-500", "to-orange-600", "rounded-full", "flex", "items-center", "justify-center", "shadow-lg"], ["name", "bell-ring", 1, "text-white", 3, "size"], [1, "text-lg", "font-bold", "text-slate-800", "dark:text-white"], [1, "text-sm", "text-slate-500", "dark:text-gray-400"], [1, "bg-orange-50", "dark:bg-orange-500/10", "border", "border-orange-200", "dark:border-orange-500/20", "rounded-xl", "p-4", "mb-5"], [1, "flex", "items-center", "justify-between"], [1, "text-sm", "text-orange-700", "dark:text-orange-300"], [1, "text-3xl", "font-bold", "text-orange-600", "dark:text-orange-400"], ["name", "phone-call", 1, "text-orange-300", "dark:text-orange-600", 3, "size"], [1, "text-sm", "text-slate-600", "dark:text-gray-400", "mb-5"], [1, "flex", "gap-3"], [1, "flex-1", "px-4", "py-2.5", "bg-slate-200", "dark:bg-slate-700", "hover:bg-slate-300", "dark:hover:bg-slate-600", "text-slate-700", "dark:text-slate-300", "text-sm", "font-semibold", "rounded-lg", "transition-all", "duration-200", 3, "click"], [1, "flex-1", "px-4", "py-2.5", "bg-gradient-to-r", "from-green-500", "to-green-600", "hover:from-green-400", "hover:to-green-500", "text-white", "text-sm", "font-semibold", "rounded-lg", "transition-all", "duration-200", "flex", "items-center", "justify-center", "gap-2", "disabled:opacity-50", "disabled:cursor-not-allowed", 3, "click", "disabled"], ["name", "play", 3, "size"], [1, "text-center", "py-8"], [1, "text-lg", "text-slate-600", "dark:text-gray-400", "mb-6"], [1, "relative", "h-40", "flex", "items-center", "justify-center"], ["class", "countdown-number", 3, "text-red-500", "text-orange-500", "text-yellow-500", "text-green-500", 4, "ngIf"], [1, "text-sm", "text-slate-500", "dark:text-gray-500", "mt-4"], [1, "mt-6", "px-4", "py-2", "text-sm", "text-slate-500", "hover:text-slate-700", "dark:text-gray-400", "dark:hover:text-gray-300", "underline", 3, "click"], [1, "countdown-number"], [1, "text-center", "py-4"], [1, "w-16", "h-16", "bg-gradient-to-br", "from-green-500", "to-green-600", "rounded-full", "flex", "items-center", "justify-center", "mx-auto", "mb-4", "shadow-lg", "animate-pulse"], ["name", "phone-outgoing", 1, "text-white", 3, "size"], [1, "text-xl", "font-bold", "text-slate-800", "dark:text-white", "mb-2"], ["class", "bg-slate-100 dark:bg-slate-800 rounded-xl p-4 mt-4 text-left", 4, "ngIf"], [1, "mt-4", "text-sm", "text-slate-500", "dark:text-gray-400"], [1, "bg-slate-100", "dark:bg-slate-800", "rounded-xl", "p-4", "mt-4", "text-left"], [1, "text-lg", "font-semibold", "text-slate-800", "dark:text-white"], [1, "grid", "grid-cols-2", "gap-3", "mt-3"], [1, "text-xs", "text-slate-400", "dark:text-gray-500"], [1, "text-sm", "font-medium", "text-slate-700", "dark:text-gray-300"], [1, "text-sm", "font-medium", "text-green-600", "dark:text-green-400"], [1, "mt-3", "pt-3", "border-t", "border-slate-200", "dark:border-slate-700"], [1, "text-center", "py-6"], [1, "w-20", "h-20", "bg-gradient-to-br", "from-green-400", "to-green-600", "rounded-full", "flex", "items-center", "justify-center", "mx-auto", "mb-5", "shadow-xl"], ["name", "check", 1, "text-white", 3, "size"], [1, "text-slate-600", "dark:text-gray-400", "mb-6"], [1, "bg-green-50", "dark:bg-green-500/10", "border", "border-green-200", "dark:border-green-500/20", "rounded-xl", "p-4", "mb-5"], [1, "flex", "items-center", "justify-center", "gap-3"], ["name", "headset", 1, "text-green-600", "dark:text-green-400", 3, "size"], [1, "text-green-700", "dark:text-green-300", "font-medium"], [1, "w-full", "px-4", "py-3", "bg-gradient-to-r", "from-green-500", "to-green-600", "hover:from-green-400", "hover:to-green-500", "text-white", "font-semibold", "rounded-lg", "transition-all", "duration-200", "flex", "items-center", "justify-center", "gap-2", 3, "click"], ["name", "log-in", 3, "size"]], template: function RecordatoriosModalComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 0);
    \u0275\u0275template(1, RecordatoriosModalComponent_ng_container_1_Template, 27, 6, "ng-container", 1)(2, RecordatoriosModalComponent_ng_container_2_Template, 10, 1, "ng-container", 1)(3, RecordatoriosModalComponent_ng_container_3_Template, 9, 5, "ng-container", 1)(4, RecordatoriosModalComponent_ng_container_4_Template, 16, 4, "ng-container", 1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.modalState === "initial");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.modalState === "countdown");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.modalState === "calling");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.modalState === "finished");
  }
}, dependencies: [CommonModule, NgIf, LucideAngularModule, LucideAngularComponent, DecimalPipe], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n}\n.countdown-number[_ngcontent-%COMP%] {\n  font-size: 8rem;\n  font-weight: 800;\n  line-height: 1;\n  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);\n}\n@keyframes _ngcontent-%COMP%_pulseRing {\n  0% {\n    transform: scale(1);\n    opacity: 1;\n  }\n  100% {\n    transform: scale(1.5);\n    opacity: 0;\n  }\n}\n/*# sourceMappingURL=recordatorios-modal.component.css.map */"], data: { animation: [
  trigger("countdownNumber", [
    transition(":enter", [
      style({ opacity: 0, transform: "scale(0.3)" }),
      animate("400ms ease-out", style({ opacity: 1, transform: "scale(1)" }))
    ]),
    transition(":leave", [
      animate("300ms ease-in", style({ opacity: 0, transform: "scale(1.5)" }))
    ])
  ]),
  trigger("fadeSlide", [
    transition(":enter", [
      style({ opacity: 0, transform: "translateY(20px)" }),
      animate("300ms ease-out", style({ opacity: 1, transform: "translateY(0)" }))
    ])
  ]),
  trigger("pulse", [
    state("active", style({ transform: "scale(1)" })),
    transition("* => active", [
      animate("600ms ease-in-out", keyframes([
        style({ transform: "scale(1)", offset: 0 }),
        style({ transform: "scale(1.1)", offset: 0.5 }),
        style({ transform: "scale(1)", offset: 1 })
      ]))
    ])
  ])
] } });
var RecordatoriosModalComponent = _RecordatoriosModalComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RecordatoriosModalComponent, [{
    type: Component,
    args: [{ selector: "app-recordatorios-modal", standalone: true, imports: [CommonModule, LucideAngularModule], animations: [
      trigger("countdownNumber", [
        transition(":enter", [
          style({ opacity: 0, transform: "scale(0.3)" }),
          animate("400ms ease-out", style({ opacity: 1, transform: "scale(1)" }))
        ]),
        transition(":leave", [
          animate("300ms ease-in", style({ opacity: 0, transform: "scale(1.5)" }))
        ])
      ]),
      trigger("fadeSlide", [
        transition(":enter", [
          style({ opacity: 0, transform: "translateY(20px)" }),
          animate("300ms ease-out", style({ opacity: 1, transform: "translateY(0)" }))
        ])
      ]),
      trigger("pulse", [
        state("active", style({ transform: "scale(1)" })),
        transition("* => active", [
          animate("600ms ease-in-out", keyframes([
            style({ transform: "scale(1)", offset: 0 }),
            style({ transform: "scale(1.1)", offset: 0.5 }),
            style({ transform: "scale(1)", offset: 1 })
          ]))
        ])
      ])
    ], template: `
    <div class="p-6 max-w-md min-w-[380px]">

      <!-- ========== ESTADO INICIAL ========== -->
      <ng-container *ngIf="modalState === 'initial'">
        <!-- Header con icono -->
        <div class="flex items-center gap-3 mb-4">
          <div class="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
            <lucide-angular name="bell-ring" [size]="24" class="text-white"></lucide-angular>
          </div>
          <div>
            <h2 class="text-lg font-bold text-slate-800 dark:text-white">Recordatorios del d\xEDa</h2>
            <p class="text-sm text-slate-500 dark:text-gray-400">Promesas de pago que vencen hoy</p>
          </div>
        </div>

        <!-- Contenido -->
        <div class="bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 rounded-xl p-4 mb-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-orange-700 dark:text-orange-300">Tienes</p>
              <p class="text-3xl font-bold text-orange-600 dark:text-orange-400">{{ data.pendientes }}</p>
              <p class="text-sm text-orange-700 dark:text-orange-300">cliente(s) por llamar</p>
            </div>
            <lucide-angular name="phone-call" [size]="48" class="text-orange-300 dark:text-orange-600"></lucide-angular>
          </div>
        </div>

        <!-- Mensaje -->
        <p class="text-sm text-slate-600 dark:text-gray-400 mb-5">
          Inicia el marcado autom\xE1tico para recordar a tus clientes sobre sus compromisos de pago.
        </p>

        <!-- Botones -->
        <div class="flex gap-3">
          <button
            (click)="cerrar()"
            class="flex-1 px-4 py-2.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-lg transition-all duration-200">
            M\xE1s tarde
          </button>
          <button
            (click)="iniciarDiscado()"
            [disabled]="isLoading"
            class="flex-1 px-4 py-2.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white text-sm font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
            <lucide-angular name="play" [size]="16"></lucide-angular>
            {{ isLoading ? 'Cargando...' : 'Iniciar' }}
          </button>
        </div>
      </ng-container>

      <!-- ========== ESTADO CUENTA REGRESIVA ========== -->
      <ng-container *ngIf="modalState === 'countdown'">
        <div class="text-center py-8">
          <p class="text-lg text-slate-600 dark:text-gray-400 mb-6">Iniciando en...</p>

          <div class="relative h-40 flex items-center justify-center">
            <div *ngIf="countdownNumber > 0"
                 [@countdownNumber]
                 class="countdown-number"
                 [class.text-red-500]="countdownNumber <= 2"
                 [class.text-orange-500]="countdownNumber === 3"
                 [class.text-yellow-500]="countdownNumber === 4"
                 [class.text-green-500]="countdownNumber === 5">
              {{ countdownNumber }}
            </div>
          </div>

          <p class="text-sm text-slate-500 dark:text-gray-500 mt-4">
            Preparando la llamada al cliente...
          </p>

          <button
            (click)="cancelarDiscado()"
            class="mt-6 px-4 py-2 text-sm text-slate-500 hover:text-slate-700 dark:text-gray-400 dark:hover:text-gray-300 underline">
            Cancelar
          </button>
        </div>
      </ng-container>

      <!-- ========== ESTADO LLAMANDO ========== -->
      <ng-container *ngIf="modalState === 'calling'">
        <div class="text-center py-4" [@fadeSlide]>
          <div class="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse">
            <lucide-angular name="phone-outgoing" [size]="32" class="text-white"></lucide-angular>
          </div>

          <h2 class="text-xl font-bold text-slate-800 dark:text-white mb-2">Llamando...</h2>

          <div *ngIf="recordatorioActual" class="bg-slate-100 dark:bg-slate-800 rounded-xl p-4 mt-4 text-left">
            <p class="text-sm text-slate-500 dark:text-gray-400">Cliente</p>
            <p class="text-lg font-semibold text-slate-800 dark:text-white">{{ recordatorioActual.nombreCliente }}</p>

            <div class="grid grid-cols-2 gap-3 mt-3">
              <div>
                <p class="text-xs text-slate-400 dark:text-gray-500">Tel\xE9fono</p>
                <p class="text-sm font-medium text-slate-700 dark:text-gray-300">{{ recordatorioActual.telefono }}</p>
              </div>
              <div>
                <p class="text-xs text-slate-400 dark:text-gray-500">Monto</p>
                <p class="text-sm font-medium text-green-600 dark:text-green-400">S/ {{ recordatorioActual.monto | number:'1.2-2' }}</p>
              </div>
            </div>

            <div class="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
              <p class="text-xs text-slate-400 dark:text-gray-500">Cuota {{ recordatorioActual.numeroCuota }} de {{ recordatorioActual.totalCuotas }}</p>
            </div>
          </div>

          <div class="mt-4 text-sm text-slate-500 dark:text-gray-400">
            Recordatorio {{ estadoDialer?.recordatoriosCompletados || 0 }} de {{ estadoDialer?.totalRecordatorios || 0 }}
          </div>
        </div>
      </ng-container>

      <!-- ========== ESTADO FINALIZADO ========== -->
      <ng-container *ngIf="modalState === 'finished'">
        <div class="text-center py-6" [@fadeSlide]>
          <div class="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-xl">
            <lucide-angular name="check" [size]="40" class="text-white"></lucide-angular>
          </div>

          <h2 class="text-xl font-bold text-slate-800 dark:text-white mb-2">\xA1Terminaste!</h2>
          <p class="text-slate-600 dark:text-gray-400 mb-6">
            Has completado todos tus recordatorios de pago por hoy.
          </p>

          <div class="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-xl p-4 mb-5">
            <div class="flex items-center justify-center gap-3">
              <lucide-angular name="headset" [size]="24" class="text-green-600 dark:text-green-400"></lucide-angular>
              <p class="text-green-700 dark:text-green-300 font-medium">
                Ya puedes ponerte en l\xEDnea para gestionar
              </p>
            </div>
          </div>

          <button
            (click)="cerrar()"
            class="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2">
            <lucide-angular name="log-in" [size]="18"></lucide-angular>
            Ir al Dialer
          </button>
        </div>
      </ng-container>

    </div>
  `, styles: ["/* angular:styles/component:css;89f2c353fedaddc8ccdc857747ab12e9823f69fff668ef034d47ba40162d96a5;C:/Users/HP/Documents/Kubito-2.0-v1/cashi-discador-frontend/cashi-discador-frontend/src/app/shared/components/recordatorios-modal/recordatorios-modal.component.ts */\n:host {\n  display: block;\n}\n.countdown-number {\n  font-size: 8rem;\n  font-weight: 800;\n  line-height: 1;\n  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);\n}\n@keyframes pulseRing {\n  0% {\n    transform: scale(1);\n    opacity: 1;\n  }\n  100% {\n    transform: scale(1.5);\n    opacity: 0;\n  }\n}\n/*# sourceMappingURL=recordatorios-modal.component.css.map */\n"] }]
  }], () => [{ type: MatDialogRef }, { type: void 0, decorators: [{
    type: Inject,
    args: [MAT_DIALOG_DATA]
  }] }, { type: Router }, { type: RecordatoriosService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(RecordatoriosModalComponent, { className: "RecordatoriosModalComponent", filePath: "src/app/shared/components/recordatorios-modal/recordatorios-modal.component.ts", lineNumber: 222 });
})();

// node_modules/@angular/material/fesm2022/progress-bar.mjs
function MatProgressBar_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElement(0, "div", 2);
  }
}
var MAT_PROGRESS_BAR_DEFAULT_OPTIONS = new InjectionToken("MAT_PROGRESS_BAR_DEFAULT_OPTIONS");
var MAT_PROGRESS_BAR_LOCATION = new InjectionToken("mat-progress-bar-location", {
  providedIn: "root",
  factory: MAT_PROGRESS_BAR_LOCATION_FACTORY
});
function MAT_PROGRESS_BAR_LOCATION_FACTORY() {
  const _document = inject(DOCUMENT);
  const _location = _document ? _document.location : null;
  return {
    // Note that this needs to be a function, rather than a property, because Angular
    // will only resolve it once, but we want the current path on each call.
    getPathname: () => _location ? _location.pathname + _location.search : ""
  };
}
var MatProgressBar = class _MatProgressBar {
  _elementRef = inject(ElementRef);
  _ngZone = inject(NgZone);
  _changeDetectorRef = inject(ChangeDetectorRef);
  _renderer = inject(Renderer2);
  _cleanupTransitionEnd;
  constructor() {
    const animationsState = _getAnimationsState();
    const defaults = inject(MAT_PROGRESS_BAR_DEFAULT_OPTIONS, {
      optional: true
    });
    this._isNoopAnimation = animationsState === "di-disabled";
    if (animationsState === "reduced-motion") {
      this._elementRef.nativeElement.classList.add("mat-progress-bar-reduced-motion");
    }
    if (defaults) {
      if (defaults.color) {
        this.color = this._defaultColor = defaults.color;
      }
      this.mode = defaults.mode || this.mode;
    }
  }
  /** Flag that indicates whether NoopAnimations mode is set to true. */
  _isNoopAnimation;
  // TODO: should be typed as `ThemePalette` but internal apps pass in arbitrary strings.
  /**
   * Theme color of the progress bar. This API is supported in M2 themes only, it
   * has no effect in M3 themes. For color customization in M3, see https://material.angular.dev/components/progress-bar/styling.
   *
   * For information on applying color variants in M3, see
   * https://material.angular.dev/guide/material-2-theming#optional-add-backwards-compatibility-styles-for-color-variants
   */
  get color() {
    return this._color || this._defaultColor;
  }
  set color(value) {
    this._color = value;
  }
  _color;
  _defaultColor = "primary";
  /** Value of the progress bar. Defaults to zero. Mirrored to aria-valuenow. */
  get value() {
    return this._value;
  }
  set value(v) {
    this._value = clamp(v || 0);
    this._changeDetectorRef.markForCheck();
  }
  _value = 0;
  /** Buffer value of the progress bar. Defaults to zero. */
  get bufferValue() {
    return this._bufferValue || 0;
  }
  set bufferValue(v) {
    this._bufferValue = clamp(v || 0);
    this._changeDetectorRef.markForCheck();
  }
  _bufferValue = 0;
  /**
   * Event emitted when animation of the primary progress bar completes. This event will not
   * be emitted when animations are disabled, nor will it be emitted for modes with continuous
   * animations (indeterminate and query).
   */
  animationEnd = new EventEmitter();
  /**
   * Mode of the progress bar.
   *
   * Input must be one of these values: determinate, indeterminate, buffer, query, defaults to
   * 'determinate'.
   * Mirrored to mode attribute.
   */
  get mode() {
    return this._mode;
  }
  set mode(value) {
    this._mode = value;
    this._changeDetectorRef.markForCheck();
  }
  _mode = "determinate";
  ngAfterViewInit() {
    this._ngZone.runOutsideAngular(() => {
      this._cleanupTransitionEnd = this._renderer.listen(this._elementRef.nativeElement, "transitionend", this._transitionendHandler);
    });
  }
  ngOnDestroy() {
    this._cleanupTransitionEnd?.();
  }
  /** Gets the transform style that should be applied to the primary bar. */
  _getPrimaryBarTransform() {
    return `scaleX(${this._isIndeterminate() ? 1 : this.value / 100})`;
  }
  /** Gets the `flex-basis` value that should be applied to the buffer bar. */
  _getBufferBarFlexBasis() {
    return `${this.mode === "buffer" ? this.bufferValue : 100}%`;
  }
  /** Returns whether the progress bar is indeterminate. */
  _isIndeterminate() {
    return this.mode === "indeterminate" || this.mode === "query";
  }
  /** Event handler for `transitionend` events. */
  _transitionendHandler = (event) => {
    if (this.animationEnd.observers.length === 0 || !event.target || !event.target.classList.contains("mdc-linear-progress__primary-bar")) {
      return;
    }
    if (this.mode === "determinate" || this.mode === "buffer") {
      this._ngZone.run(() => this.animationEnd.next({
        value: this.value
      }));
    }
  };
  static \u0275fac = function MatProgressBar_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatProgressBar)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
    type: _MatProgressBar,
    selectors: [["mat-progress-bar"]],
    hostAttrs: ["role", "progressbar", "aria-valuemin", "0", "aria-valuemax", "100", "tabindex", "-1", 1, "mat-mdc-progress-bar", "mdc-linear-progress"],
    hostVars: 10,
    hostBindings: function MatProgressBar_HostBindings(rf, ctx) {
      if (rf & 2) {
        \u0275\u0275attribute("aria-valuenow", ctx._isIndeterminate() ? null : ctx.value)("mode", ctx.mode);
        \u0275\u0275classMap("mat-" + ctx.color);
        \u0275\u0275classProp("_mat-animation-noopable", ctx._isNoopAnimation)("mdc-linear-progress--animation-ready", !ctx._isNoopAnimation)("mdc-linear-progress--indeterminate", ctx._isIndeterminate());
      }
    },
    inputs: {
      color: "color",
      value: [2, "value", "value", numberAttribute],
      bufferValue: [2, "bufferValue", "bufferValue", numberAttribute],
      mode: "mode"
    },
    outputs: {
      animationEnd: "animationEnd"
    },
    exportAs: ["matProgressBar"],
    decls: 7,
    vars: 5,
    consts: [["aria-hidden", "true", 1, "mdc-linear-progress__buffer"], [1, "mdc-linear-progress__buffer-bar"], [1, "mdc-linear-progress__buffer-dots"], ["aria-hidden", "true", 1, "mdc-linear-progress__bar", "mdc-linear-progress__primary-bar"], [1, "mdc-linear-progress__bar-inner"], ["aria-hidden", "true", 1, "mdc-linear-progress__bar", "mdc-linear-progress__secondary-bar"]],
    template: function MatProgressBar_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275domElementStart(0, "div", 0);
        \u0275\u0275domElement(1, "div", 1);
        \u0275\u0275conditionalCreate(2, MatProgressBar_Conditional_2_Template, 1, 0, "div", 2);
        \u0275\u0275domElementEnd();
        \u0275\u0275domElementStart(3, "div", 3);
        \u0275\u0275domElement(4, "span", 4);
        \u0275\u0275domElementEnd();
        \u0275\u0275domElementStart(5, "div", 5);
        \u0275\u0275domElement(6, "span", 4);
        \u0275\u0275domElementEnd();
      }
      if (rf & 2) {
        \u0275\u0275advance();
        \u0275\u0275styleProp("flex-basis", ctx._getBufferBarFlexBasis());
        \u0275\u0275advance();
        \u0275\u0275conditional(ctx.mode === "buffer" ? 2 : -1);
        \u0275\u0275advance();
        \u0275\u0275styleProp("transform", ctx._getPrimaryBarTransform());
      }
    },
    styles: [".mat-mdc-progress-bar{--mat-progress-bar-animation-multiplier: 1;display:block;text-align:start}.mat-mdc-progress-bar[mode=query]{transform:scaleX(-1)}.mat-mdc-progress-bar._mat-animation-noopable .mdc-linear-progress__buffer-dots,.mat-mdc-progress-bar._mat-animation-noopable .mdc-linear-progress__primary-bar,.mat-mdc-progress-bar._mat-animation-noopable .mdc-linear-progress__secondary-bar,.mat-mdc-progress-bar._mat-animation-noopable .mdc-linear-progress__bar-inner.mdc-linear-progress__bar-inner{animation:none}.mat-mdc-progress-bar._mat-animation-noopable .mdc-linear-progress__primary-bar,.mat-mdc-progress-bar._mat-animation-noopable .mdc-linear-progress__buffer-bar{transition:transform 1ms}.mat-progress-bar-reduced-motion{--mat-progress-bar-animation-multiplier: 2}.mdc-linear-progress{position:relative;width:100%;transform:translateZ(0);outline:1px solid rgba(0,0,0,0);overflow-x:hidden;transition:opacity 250ms 0ms cubic-bezier(0.4, 0, 0.6, 1);height:max(var(--mat-progress-bar-track-height, 4px),var(--mat-progress-bar-active-indicator-height, 4px))}@media(forced-colors: active){.mdc-linear-progress{outline-color:CanvasText}}.mdc-linear-progress__bar{position:absolute;top:0;bottom:0;margin:auto 0;width:100%;animation:none;transform-origin:top left;transition:transform 250ms 0ms cubic-bezier(0.4, 0, 0.6, 1);height:var(--mat-progress-bar-active-indicator-height, 4px)}.mdc-linear-progress--indeterminate .mdc-linear-progress__bar{transition:none}[dir=rtl] .mdc-linear-progress__bar{right:0;transform-origin:center right}.mdc-linear-progress__bar-inner{display:inline-block;position:absolute;width:100%;animation:none;border-top-style:solid;border-color:var(--mat-progress-bar-active-indicator-color, var(--mat-sys-primary));border-top-width:var(--mat-progress-bar-active-indicator-height, 4px)}.mdc-linear-progress__buffer{display:flex;position:absolute;top:0;bottom:0;margin:auto 0;width:100%;overflow:hidden;height:var(--mat-progress-bar-track-height, 4px);border-radius:var(--mat-progress-bar-track-shape, var(--mat-sys-corner-none))}.mdc-linear-progress__buffer-dots{background-image:radial-gradient(circle, var(--mat-progress-bar-track-color, var(--mat-sys-surface-variant)) calc(var(--mat-progress-bar-track-height, 4px) / 2), transparent 0);background-repeat:repeat-x;background-size:calc(calc(var(--mat-progress-bar-track-height, 4px) / 2)*5);background-position:left;flex:auto;transform:rotate(180deg);animation:mdc-linear-progress-buffering calc(250ms*var(--mat-progress-bar-animation-multiplier)) infinite linear}@media(forced-colors: active){.mdc-linear-progress__buffer-dots{background-color:ButtonBorder}}[dir=rtl] .mdc-linear-progress__buffer-dots{animation:mdc-linear-progress-buffering-reverse calc(250ms*var(--mat-progress-bar-animation-multiplier)) infinite linear;transform:rotate(0)}.mdc-linear-progress__buffer-bar{flex:0 1 100%;transition:flex-basis 250ms 0ms cubic-bezier(0.4, 0, 0.6, 1);background-color:var(--mat-progress-bar-track-color, var(--mat-sys-surface-variant))}.mdc-linear-progress__primary-bar{transform:scaleX(0)}.mdc-linear-progress--indeterminate .mdc-linear-progress__primary-bar{left:-145.166611%}.mdc-linear-progress--indeterminate.mdc-linear-progress--animation-ready .mdc-linear-progress__primary-bar{animation:mdc-linear-progress-primary-indeterminate-translate calc(2s*var(--mat-progress-bar-animation-multiplier)) infinite linear}.mdc-linear-progress--indeterminate.mdc-linear-progress--animation-ready .mdc-linear-progress__primary-bar>.mdc-linear-progress__bar-inner{animation:mdc-linear-progress-primary-indeterminate-scale calc(2s*var(--mat-progress-bar-animation-multiplier)) infinite linear}[dir=rtl] .mdc-linear-progress.mdc-linear-progress--animation-ready .mdc-linear-progress__primary-bar{animation-name:mdc-linear-progress-primary-indeterminate-translate-reverse}[dir=rtl] .mdc-linear-progress.mdc-linear-progress--indeterminate .mdc-linear-progress__primary-bar{right:-145.166611%;left:auto}.mdc-linear-progress__secondary-bar{display:none}.mdc-linear-progress--indeterminate .mdc-linear-progress__secondary-bar{left:-54.888891%;display:block}.mdc-linear-progress--indeterminate.mdc-linear-progress--animation-ready .mdc-linear-progress__secondary-bar{animation:mdc-linear-progress-secondary-indeterminate-translate calc(2s*var(--mat-progress-bar-animation-multiplier)) infinite linear}.mdc-linear-progress--indeterminate.mdc-linear-progress--animation-ready .mdc-linear-progress__secondary-bar>.mdc-linear-progress__bar-inner{animation:mdc-linear-progress-secondary-indeterminate-scale calc(2s*var(--mat-progress-bar-animation-multiplier)) infinite linear}[dir=rtl] .mdc-linear-progress.mdc-linear-progress--animation-ready .mdc-linear-progress__secondary-bar{animation-name:mdc-linear-progress-secondary-indeterminate-translate-reverse}[dir=rtl] .mdc-linear-progress.mdc-linear-progress--indeterminate .mdc-linear-progress__secondary-bar{right:-54.888891%;left:auto}@keyframes mdc-linear-progress-buffering{from{transform:rotate(180deg) translateX(calc(var(--mat-progress-bar-track-height, 4px) * -2.5))}}@keyframes mdc-linear-progress-primary-indeterminate-translate{0%{transform:translateX(0)}20%{animation-timing-function:cubic-bezier(0.5, 0, 0.701732, 0.495819);transform:translateX(0)}59.15%{animation-timing-function:cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);transform:translateX(83.67142%)}100%{transform:translateX(200.611057%)}}@keyframes mdc-linear-progress-primary-indeterminate-scale{0%{transform:scaleX(0.08)}36.65%{animation-timing-function:cubic-bezier(0.334731, 0.12482, 0.785844, 1);transform:scaleX(0.08)}69.15%{animation-timing-function:cubic-bezier(0.06, 0.11, 0.6, 1);transform:scaleX(0.661479)}100%{transform:scaleX(0.08)}}@keyframes mdc-linear-progress-secondary-indeterminate-translate{0%{animation-timing-function:cubic-bezier(0.15, 0, 0.515058, 0.409685);transform:translateX(0)}25%{animation-timing-function:cubic-bezier(0.31033, 0.284058, 0.8, 0.733712);transform:translateX(37.651913%)}48.35%{animation-timing-function:cubic-bezier(0.4, 0.627035, 0.6, 0.902026);transform:translateX(84.386165%)}100%{transform:translateX(160.277782%)}}@keyframes mdc-linear-progress-secondary-indeterminate-scale{0%{animation-timing-function:cubic-bezier(0.205028, 0.057051, 0.57661, 0.453971);transform:scaleX(0.08)}19.15%{animation-timing-function:cubic-bezier(0.152313, 0.196432, 0.648374, 1.004315);transform:scaleX(0.457104)}44.15%{animation-timing-function:cubic-bezier(0.257759, -0.003163, 0.211762, 1.38179);transform:scaleX(0.72796)}100%{transform:scaleX(0.08)}}@keyframes mdc-linear-progress-primary-indeterminate-translate-reverse{0%{transform:translateX(0)}20%{animation-timing-function:cubic-bezier(0.5, 0, 0.701732, 0.495819);transform:translateX(0)}59.15%{animation-timing-function:cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);transform:translateX(-83.67142%)}100%{transform:translateX(-200.611057%)}}@keyframes mdc-linear-progress-secondary-indeterminate-translate-reverse{0%{animation-timing-function:cubic-bezier(0.15, 0, 0.515058, 0.409685);transform:translateX(0)}25%{animation-timing-function:cubic-bezier(0.31033, 0.284058, 0.8, 0.733712);transform:translateX(-37.651913%)}48.35%{animation-timing-function:cubic-bezier(0.4, 0.627035, 0.6, 0.902026);transform:translateX(-84.386165%)}100%{transform:translateX(-160.277782%)}}@keyframes mdc-linear-progress-buffering-reverse{from{transform:translateX(-10px)}}\n"],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatProgressBar, [{
    type: Component,
    args: [{
      selector: "mat-progress-bar",
      exportAs: "matProgressBar",
      host: {
        "role": "progressbar",
        "aria-valuemin": "0",
        "aria-valuemax": "100",
        // set tab index to -1 so screen readers will read the aria-label
        // Note: there is a known issue with JAWS that does not read progressbar aria labels on FireFox
        "tabindex": "-1",
        "[attr.aria-valuenow]": "_isIndeterminate() ? null : value",
        "[attr.mode]": "mode",
        "class": "mat-mdc-progress-bar mdc-linear-progress",
        "[class]": '"mat-" + color',
        "[class._mat-animation-noopable]": "_isNoopAnimation",
        "[class.mdc-linear-progress--animation-ready]": "!_isNoopAnimation",
        "[class.mdc-linear-progress--indeterminate]": "_isIndeterminate()"
      },
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      template: `<!--
  All children need to be hidden for screen readers in order to support ChromeVox.
  More context in the issue: https://github.com/angular/components/issues/22165.
-->
<div class="mdc-linear-progress__buffer" aria-hidden="true">
  <div
    class="mdc-linear-progress__buffer-bar"
    [style.flex-basis]="_getBufferBarFlexBasis()"></div>
  <!-- Remove the dots outside of buffer mode since they can cause CSP issues (see #28938) -->
  @if (mode === 'buffer') {
    <div class="mdc-linear-progress__buffer-dots"></div>
  }
</div>
<div
  class="mdc-linear-progress__bar mdc-linear-progress__primary-bar"
  aria-hidden="true"
  [style.transform]="_getPrimaryBarTransform()">
  <span class="mdc-linear-progress__bar-inner"></span>
</div>
<div class="mdc-linear-progress__bar mdc-linear-progress__secondary-bar" aria-hidden="true">
  <span class="mdc-linear-progress__bar-inner"></span>
</div>
`,
      styles: [".mat-mdc-progress-bar{--mat-progress-bar-animation-multiplier: 1;display:block;text-align:start}.mat-mdc-progress-bar[mode=query]{transform:scaleX(-1)}.mat-mdc-progress-bar._mat-animation-noopable .mdc-linear-progress__buffer-dots,.mat-mdc-progress-bar._mat-animation-noopable .mdc-linear-progress__primary-bar,.mat-mdc-progress-bar._mat-animation-noopable .mdc-linear-progress__secondary-bar,.mat-mdc-progress-bar._mat-animation-noopable .mdc-linear-progress__bar-inner.mdc-linear-progress__bar-inner{animation:none}.mat-mdc-progress-bar._mat-animation-noopable .mdc-linear-progress__primary-bar,.mat-mdc-progress-bar._mat-animation-noopable .mdc-linear-progress__buffer-bar{transition:transform 1ms}.mat-progress-bar-reduced-motion{--mat-progress-bar-animation-multiplier: 2}.mdc-linear-progress{position:relative;width:100%;transform:translateZ(0);outline:1px solid rgba(0,0,0,0);overflow-x:hidden;transition:opacity 250ms 0ms cubic-bezier(0.4, 0, 0.6, 1);height:max(var(--mat-progress-bar-track-height, 4px),var(--mat-progress-bar-active-indicator-height, 4px))}@media(forced-colors: active){.mdc-linear-progress{outline-color:CanvasText}}.mdc-linear-progress__bar{position:absolute;top:0;bottom:0;margin:auto 0;width:100%;animation:none;transform-origin:top left;transition:transform 250ms 0ms cubic-bezier(0.4, 0, 0.6, 1);height:var(--mat-progress-bar-active-indicator-height, 4px)}.mdc-linear-progress--indeterminate .mdc-linear-progress__bar{transition:none}[dir=rtl] .mdc-linear-progress__bar{right:0;transform-origin:center right}.mdc-linear-progress__bar-inner{display:inline-block;position:absolute;width:100%;animation:none;border-top-style:solid;border-color:var(--mat-progress-bar-active-indicator-color, var(--mat-sys-primary));border-top-width:var(--mat-progress-bar-active-indicator-height, 4px)}.mdc-linear-progress__buffer{display:flex;position:absolute;top:0;bottom:0;margin:auto 0;width:100%;overflow:hidden;height:var(--mat-progress-bar-track-height, 4px);border-radius:var(--mat-progress-bar-track-shape, var(--mat-sys-corner-none))}.mdc-linear-progress__buffer-dots{background-image:radial-gradient(circle, var(--mat-progress-bar-track-color, var(--mat-sys-surface-variant)) calc(var(--mat-progress-bar-track-height, 4px) / 2), transparent 0);background-repeat:repeat-x;background-size:calc(calc(var(--mat-progress-bar-track-height, 4px) / 2)*5);background-position:left;flex:auto;transform:rotate(180deg);animation:mdc-linear-progress-buffering calc(250ms*var(--mat-progress-bar-animation-multiplier)) infinite linear}@media(forced-colors: active){.mdc-linear-progress__buffer-dots{background-color:ButtonBorder}}[dir=rtl] .mdc-linear-progress__buffer-dots{animation:mdc-linear-progress-buffering-reverse calc(250ms*var(--mat-progress-bar-animation-multiplier)) infinite linear;transform:rotate(0)}.mdc-linear-progress__buffer-bar{flex:0 1 100%;transition:flex-basis 250ms 0ms cubic-bezier(0.4, 0, 0.6, 1);background-color:var(--mat-progress-bar-track-color, var(--mat-sys-surface-variant))}.mdc-linear-progress__primary-bar{transform:scaleX(0)}.mdc-linear-progress--indeterminate .mdc-linear-progress__primary-bar{left:-145.166611%}.mdc-linear-progress--indeterminate.mdc-linear-progress--animation-ready .mdc-linear-progress__primary-bar{animation:mdc-linear-progress-primary-indeterminate-translate calc(2s*var(--mat-progress-bar-animation-multiplier)) infinite linear}.mdc-linear-progress--indeterminate.mdc-linear-progress--animation-ready .mdc-linear-progress__primary-bar>.mdc-linear-progress__bar-inner{animation:mdc-linear-progress-primary-indeterminate-scale calc(2s*var(--mat-progress-bar-animation-multiplier)) infinite linear}[dir=rtl] .mdc-linear-progress.mdc-linear-progress--animation-ready .mdc-linear-progress__primary-bar{animation-name:mdc-linear-progress-primary-indeterminate-translate-reverse}[dir=rtl] .mdc-linear-progress.mdc-linear-progress--indeterminate .mdc-linear-progress__primary-bar{right:-145.166611%;left:auto}.mdc-linear-progress__secondary-bar{display:none}.mdc-linear-progress--indeterminate .mdc-linear-progress__secondary-bar{left:-54.888891%;display:block}.mdc-linear-progress--indeterminate.mdc-linear-progress--animation-ready .mdc-linear-progress__secondary-bar{animation:mdc-linear-progress-secondary-indeterminate-translate calc(2s*var(--mat-progress-bar-animation-multiplier)) infinite linear}.mdc-linear-progress--indeterminate.mdc-linear-progress--animation-ready .mdc-linear-progress__secondary-bar>.mdc-linear-progress__bar-inner{animation:mdc-linear-progress-secondary-indeterminate-scale calc(2s*var(--mat-progress-bar-animation-multiplier)) infinite linear}[dir=rtl] .mdc-linear-progress.mdc-linear-progress--animation-ready .mdc-linear-progress__secondary-bar{animation-name:mdc-linear-progress-secondary-indeterminate-translate-reverse}[dir=rtl] .mdc-linear-progress.mdc-linear-progress--indeterminate .mdc-linear-progress__secondary-bar{right:-54.888891%;left:auto}@keyframes mdc-linear-progress-buffering{from{transform:rotate(180deg) translateX(calc(var(--mat-progress-bar-track-height, 4px) * -2.5))}}@keyframes mdc-linear-progress-primary-indeterminate-translate{0%{transform:translateX(0)}20%{animation-timing-function:cubic-bezier(0.5, 0, 0.701732, 0.495819);transform:translateX(0)}59.15%{animation-timing-function:cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);transform:translateX(83.67142%)}100%{transform:translateX(200.611057%)}}@keyframes mdc-linear-progress-primary-indeterminate-scale{0%{transform:scaleX(0.08)}36.65%{animation-timing-function:cubic-bezier(0.334731, 0.12482, 0.785844, 1);transform:scaleX(0.08)}69.15%{animation-timing-function:cubic-bezier(0.06, 0.11, 0.6, 1);transform:scaleX(0.661479)}100%{transform:scaleX(0.08)}}@keyframes mdc-linear-progress-secondary-indeterminate-translate{0%{animation-timing-function:cubic-bezier(0.15, 0, 0.515058, 0.409685);transform:translateX(0)}25%{animation-timing-function:cubic-bezier(0.31033, 0.284058, 0.8, 0.733712);transform:translateX(37.651913%)}48.35%{animation-timing-function:cubic-bezier(0.4, 0.627035, 0.6, 0.902026);transform:translateX(84.386165%)}100%{transform:translateX(160.277782%)}}@keyframes mdc-linear-progress-secondary-indeterminate-scale{0%{animation-timing-function:cubic-bezier(0.205028, 0.057051, 0.57661, 0.453971);transform:scaleX(0.08)}19.15%{animation-timing-function:cubic-bezier(0.152313, 0.196432, 0.648374, 1.004315);transform:scaleX(0.457104)}44.15%{animation-timing-function:cubic-bezier(0.257759, -0.003163, 0.211762, 1.38179);transform:scaleX(0.72796)}100%{transform:scaleX(0.08)}}@keyframes mdc-linear-progress-primary-indeterminate-translate-reverse{0%{transform:translateX(0)}20%{animation-timing-function:cubic-bezier(0.5, 0, 0.701732, 0.495819);transform:translateX(0)}59.15%{animation-timing-function:cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);transform:translateX(-83.67142%)}100%{transform:translateX(-200.611057%)}}@keyframes mdc-linear-progress-secondary-indeterminate-translate-reverse{0%{animation-timing-function:cubic-bezier(0.15, 0, 0.515058, 0.409685);transform:translateX(0)}25%{animation-timing-function:cubic-bezier(0.31033, 0.284058, 0.8, 0.733712);transform:translateX(-37.651913%)}48.35%{animation-timing-function:cubic-bezier(0.4, 0.627035, 0.6, 0.902026);transform:translateX(-84.386165%)}100%{transform:translateX(-160.277782%)}}@keyframes mdc-linear-progress-buffering-reverse{from{transform:translateX(-10px)}}\n"]
    }]
  }], () => [], {
    color: [{
      type: Input
    }],
    value: [{
      type: Input,
      args: [{
        transform: numberAttribute
      }]
    }],
    bufferValue: [{
      type: Input,
      args: [{
        transform: numberAttribute
      }]
    }],
    animationEnd: [{
      type: Output
    }],
    mode: [{
      type: Input
    }]
  });
})();
function clamp(v, min = 0, max = 100) {
  return Math.max(min, Math.min(max, v));
}
var MatProgressBarModule = class _MatProgressBarModule {
  static \u0275fac = function MatProgressBarModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatProgressBarModule)();
  };
  static \u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
    type: _MatProgressBarModule,
    imports: [MatProgressBar],
    exports: [MatProgressBar, MatCommonModule]
  });
  static \u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({
    imports: [MatCommonModule]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatProgressBarModule, [{
    type: NgModule,
    args: [{
      imports: [MatProgressBar],
      exports: [MatProgressBar, MatCommonModule]
    }]
  }], null, null);
})();

export {
  AnimationMetadataType,
  AUTO_STYLE,
  sequence,
  style,
  NoopAnimationPlayer,
  AnimationGroupPlayer,
  ɵPRE_STYLE,
  AutorizacionService,
  RecordatoriosService,
  RecordatoriosModalComponent,
  MatProgressBar,
  MatProgressBarModule
};
/*! Bundled license information:

@angular/animations/fesm2022/private_export.mjs:
@angular/animations/fesm2022/animations.mjs:
  (**
   * @license Angular v20.3.3
   * (c) 2010-2025 Google LLC. https://angular.io/
   * License: MIT
   *)
*/
//# sourceMappingURL=chunk-SUFYRKBU.js.map
