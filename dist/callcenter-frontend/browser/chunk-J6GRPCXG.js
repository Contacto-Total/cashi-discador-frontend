import {
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgModel,
  NgSelectOption,
  NumberValueAccessor,
  SelectControlValueAccessor,
  ɵNgSelectMultipleOption
} from "./chunk-GRJ7XAPD.js";
import {
  environment
} from "./chunk-QF774CZR.js";
import {
  CommonModule,
  Component,
  DecimalPipe,
  HttpClient,
  HttpParams,
  Injectable,
  __spreadProps,
  __spreadValues,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassMap,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵinject,
  ɵɵlistener,
  ɵɵnamespaceHTML,
  ɵɵnamespaceSVG,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind2,
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵrepeaterTrackByIndex,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtextInterpolate3,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-CTRHJBBW.js";

// src/app/comisiones/services/comisiones.service.ts
var _ComisionesService = class _ComisionesService {
  constructor(http) {
    this.http = http;
    this.baseUrl = `${environment.gatewayUrl}/comisiones`;
  }
  // ==================== METAS ====================
  /**
   * Obtener metas de un período
   */
  obtenerMetas(anio, mes) {
    const params = new HttpParams().set("anio", anio.toString()).set("mes", mes.toString());
    return this.http.get(`${this.baseUrl}/metas`, { params });
  }
  /**
   * Obtener una meta por ID
   */
  obtenerMeta(id) {
    return this.http.get(`${this.baseUrl}/metas/${id}`);
  }
  /**
   * Crear o actualizar una meta
   */
  guardarMeta(meta) {
    console.log("[COMISIONES] Guardando meta:", meta);
    return this.http.post(`${this.baseUrl}/metas`, meta);
  }
  /**
   * Eliminar una meta
   */
  eliminarMeta(id) {
    console.log("[COMISIONES] Eliminando meta ID:", id);
    return this.http.delete(`${this.baseUrl}/metas/${id}`);
  }
  // ==================== BONOS ====================
  /**
   * Obtener todos los bonos
   */
  obtenerBonos() {
    return this.http.get(`${this.baseUrl}/bonos`);
  }
  /**
   * Obtener bonos activos
   */
  obtenerBonosActivos() {
    return this.http.get(`${this.baseUrl}/bonos/activos`);
  }
  /**
   * Obtener un bono por ID
   */
  obtenerBono(id) {
    return this.http.get(`${this.baseUrl}/bonos/${id}`);
  }
  /**
   * Crear o actualizar un bono
   */
  guardarBono(bono) {
    console.log("[COMISIONES] Guardando bono:", bono);
    return this.http.post(`${this.baseUrl}/bonos`, bono);
  }
  /**
   * Eliminar un bono
   */
  eliminarBono(id) {
    console.log("[COMISIONES] Eliminando bono ID:", id);
    return this.http.delete(`${this.baseUrl}/bonos/${id}`);
  }
  /**
   * Obtener campos disponibles para bonos
   */
  obtenerCamposDisponibles() {
    return this.http.get(`${this.baseUrl}/bonos/campos-disponibles`);
  }
  // ==================== CÁLCULO ====================
  /**
   * Calcular comisiones para un período
   */
  calcularComisiones(anio, mes, idSubcartera) {
    let params = new HttpParams().set("anio", anio.toString()).set("mes", mes.toString());
    if (idSubcartera) {
      params = params.set("idSubcartera", idSubcartera.toString());
    }
    console.log("[COMISIONES] Calculando comisiones:", { anio, mes, idSubcartera });
    return this.http.get(`${this.baseUrl}/calcular`, { params });
  }
  // ==================== UTILIDADES ====================
  /**
   * Obtener resumen de configuración
   */
  obtenerResumenConfig(anio, mes) {
    const params = new HttpParams().set("anio", anio.toString()).set("mes", mes.toString());
    return this.http.get(`${this.baseUrl}/resumen-config`, { params });
  }
  /**
   * Obtener nombre legible de un campo
   */
  getNombreCampo(campo) {
    const nombres = {
      "campo_monto_origen": "Campo Monto Origen",
      "ruta_nivel_1": "Tipificaci\xF3n Nivel 1",
      "ruta_nivel_2": "Tipificaci\xF3n Nivel 2",
      "ruta_nivel_3": "Tipificaci\xF3n Nivel 3",
      "ruta_nivel_4": "Tipificaci\xF3n Nivel 4",
      "nombre_subcartera": "Subcartera",
      "nombre_cartera": "Cartera",
      "estado_gestion": "Estado Gesti\xF3n",
      "metodo_contacto": "M\xE9todo Contacto",
      "canal_contacto": "Canal Contacto"
    };
    return nombres[campo] || campo;
  }
  /**
   * Obtener nombre del mes
   */
  getNombreMes(mes) {
    const meses = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre"
    ];
    return meses[mes - 1] || "";
  }
};
_ComisionesService.\u0275fac = function ComisionesService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _ComisionesService)(\u0275\u0275inject(HttpClient));
};
_ComisionesService.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ComisionesService, factory: _ComisionesService.\u0275fac, providedIn: "root" });
var ComisionesService = _ComisionesService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ComisionesService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{ type: HttpClient }], null);
})();

// src/app/comisiones/pages/comisiones.page.ts
var _forTrack0 = ($index, $item) => $item.value;
var _forTrack1 = ($index, $item) => $item.id;
var _forTrack2 = ($index, $item) => $item.idAgente;
var _forTrack3 = ($index, $item) => $item.bonoId;
function ComisionesPage_Conditional_21_For_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 16);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const a_r3 = ctx.$implicit;
    \u0275\u0275property("value", a_r3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(a_r3);
  }
}
function ComisionesPage_Conditional_21_For_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 16);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const m_r4 = ctx.$implicit;
    \u0275\u0275property("value", m_r4.value);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(m_r4.label);
  }
}
function ComisionesPage_Conditional_21_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 19)(1, "h3", 22);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 23)(4, "div")(5, "label", 14);
    \u0275\u0275text(6, "Subcartera ID");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "input", 24);
    \u0275\u0275twoWayListener("ngModelChange", function ComisionesPage_Conditional_21_Conditional_18_Template_input_ngModelChange_7_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.metaEditando().idSubcartera, $event) || (ctx_r1.metaEditando().idSubcartera = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "div")(9, "label", 14);
    \u0275\u0275text(10, "Nombre Subcartera");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "input", 25);
    \u0275\u0275twoWayListener("ngModelChange", function ComisionesPage_Conditional_21_Conditional_18_Template_input_ngModelChange_11_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.metaEditando().nombreSubcartera, $event) || (ctx_r1.metaEditando().nombreSubcartera = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "div")(13, "label", 14);
    \u0275\u0275text(14, "Meta Grupal (S/)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "input", 26);
    \u0275\u0275twoWayListener("ngModelChange", function ComisionesPage_Conditional_21_Conditional_18_Template_input_ngModelChange_15_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.metaEditando().metaGrupal, $event) || (ctx_r1.metaEditando().metaGrupal = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "div")(17, "label", 14);
    \u0275\u0275text(18, "% Comisi\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "input", 27);
    \u0275\u0275twoWayListener("ngModelChange", function ComisionesPage_Conditional_21_Conditional_18_Template_input_ngModelChange_19_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.metaEditando().porcentajeComision, $event) || (ctx_r1.metaEditando().porcentajeComision = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(20, "div", 28)(21, "button", 29);
    \u0275\u0275listener("click", function ComisionesPage_Conditional_21_Conditional_18_Template_button_click_21_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.guardarMeta());
    });
    \u0275\u0275text(22);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "button", 30);
    \u0275\u0275listener("click", function ComisionesPage_Conditional_21_Conditional_18_Template_button_click_23_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.cancelarMeta());
    });
    \u0275\u0275text(24, " Cancelar ");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    let tmp_2_0;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ((tmp_2_0 = ctx_r1.metaEditando()) == null ? null : tmp_2_0.id) ? "Editar Meta" : "Nueva Meta", " ");
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.metaEditando().idSubcartera);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.metaEditando().nombreSubcartera);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.metaEditando().metaGrupal);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.metaEditando().porcentajeComision);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r1.isLoading());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.isLoading() ? "Guardando..." : "Guardar", " ");
  }
}
function ComisionesPage_Conditional_21_Conditional_19_For_16_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr", 37)(1, "td", 38);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td", 39);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td", 40);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "td", 41)(8, "span", 42);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "td", 41)(11, "button", 43);
    \u0275\u0275listener("click", function ComisionesPage_Conditional_21_Conditional_19_For_16_Template_button_click_11_listener() {
      const meta_r7 = \u0275\u0275restoreView(_r6).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.editarMeta(meta_r7));
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(12, "svg", 44);
    \u0275\u0275element(13, "path", 45);
    \u0275\u0275elementEnd()();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(14, "button", 46);
    \u0275\u0275listener("click", function ComisionesPage_Conditional_21_Conditional_19_For_16_Template_button_click_14_listener() {
      const meta_r7 = \u0275\u0275restoreView(_r6).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.eliminarMeta(meta_r7));
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(15, "svg", 44);
    \u0275\u0275element(16, "path", 47);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const meta_r7 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", meta_r7.nombreSubcartera || "Subcartera " + meta_r7.idSubcartera, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" S/ ", ctx_r1.formatMonto(meta_r7.metaGrupal), " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", meta_r7.porcentajeComision || 0, "% ");
    \u0275\u0275advance(2);
    \u0275\u0275classMap(meta_r7.activo ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-400");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", meta_r7.activo ? "Activo" : "Inactivo", " ");
  }
}
function ComisionesPage_Conditional_21_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 20)(1, "table", 31)(2, "thead", 32)(3, "tr")(4, "th", 33);
    \u0275\u0275text(5, "Subcartera");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th", 34);
    \u0275\u0275text(7, "Meta Grupal");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th", 34);
    \u0275\u0275text(9, "% Comisi\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th", 35);
    \u0275\u0275text(11, "Estado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th", 35);
    \u0275\u0275text(13, "Acciones");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(14, "tbody", 36);
    \u0275\u0275repeaterCreate(15, ComisionesPage_Conditional_21_Conditional_19_For_16_Template, 17, 6, "tr", 37, _forTrack1);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(15);
    \u0275\u0275repeater(ctx_r1.metas());
  }
}
function ComisionesPage_Conditional_21_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 21);
    \u0275\u0275text(1, " No hay metas configuradas para este per\xEDodo ");
    \u0275\u0275elementEnd();
  }
}
function ComisionesPage_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 11)(1, "div", 13)(2, "div")(3, "label", 14);
    \u0275\u0275text(4, "A\xF1o");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "select", 15);
    \u0275\u0275twoWayListener("ngModelChange", function ComisionesPage_Conditional_21_Template_select_ngModelChange_5_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.filtroAnio, $event) || (ctx_r1.filtroAnio = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("change", function ComisionesPage_Conditional_21_Template_select_change_5_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.cargarMetas());
    });
    \u0275\u0275repeaterCreate(6, ComisionesPage_Conditional_21_For_7_Template, 2, 2, "option", 16, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "div")(9, "label", 14);
    \u0275\u0275text(10, "Mes");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "select", 15);
    \u0275\u0275twoWayListener("ngModelChange", function ComisionesPage_Conditional_21_Template_select_ngModelChange_11_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.filtroMes, $event) || (ctx_r1.filtroMes = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("change", function ComisionesPage_Conditional_21_Template_select_change_11_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.cargarMetas());
    });
    \u0275\u0275repeaterCreate(12, ComisionesPage_Conditional_21_For_13_Template, 2, 2, "option", 16, _forTrack0);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "button", 17);
    \u0275\u0275listener("click", function ComisionesPage_Conditional_21_Template_button_click_14_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.nuevaMeta());
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(15, "svg", 7);
    \u0275\u0275element(16, "path", 18);
    \u0275\u0275elementEnd();
    \u0275\u0275text(17, " Nueva Meta ");
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(18, ComisionesPage_Conditional_21_Conditional_18_Template, 25, 7, "div", 19);
    \u0275\u0275conditionalCreate(19, ComisionesPage_Conditional_21_Conditional_19_Template, 17, 0, "div", 20)(20, ComisionesPage_Conditional_21_Conditional_20_Template, 2, 0, "div", 21);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.filtroAnio);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.aniosDisponibles);
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.filtroMes);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.mesesDisponibles);
    \u0275\u0275advance(6);
    \u0275\u0275conditional(ctx_r1.mostrarFormMeta() ? 18 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.metas().length > 0 ? 19 : 20);
  }
}
function ComisionesPage_Conditional_22_Conditional_8_For_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 16);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const campo_r10 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275property("value", campo_r10);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.comisionesService.getNombreCampo(campo_r10));
  }
}
function ComisionesPage_Conditional_22_Conditional_8_For_34_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 65)(1, "input", 68);
    \u0275\u0275twoWayListener("ngModelChange", function ComisionesPage_Conditional_22_Conditional_8_For_34_Template_input_ngModelChange_1_listener($event) {
      const escala_r12 = \u0275\u0275restoreView(_r11).$implicit;
      \u0275\u0275twoWayBindingSet(escala_r12.cantidadMinima, $event) || (escala_r12.cantidadMinima = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "span", 69);
    \u0275\u0275text(3, "pagos =");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "input", 70);
    \u0275\u0275twoWayListener("ngModelChange", function ComisionesPage_Conditional_22_Conditional_8_For_34_Template_input_ngModelChange_4_listener($event) {
      const escala_r12 = \u0275\u0275restoreView(_r11).$implicit;
      \u0275\u0275twoWayBindingSet(escala_r12.monto, $event) || (escala_r12.monto = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 69);
    \u0275\u0275text(6, "S/");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "button", 71);
    \u0275\u0275listener("click", function ComisionesPage_Conditional_22_Conditional_8_For_34_Template_button_click_7_listener() {
      const \u0275$index_251_r13 = \u0275\u0275restoreView(_r11).$index;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.eliminarEscala(\u0275$index_251_r13));
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(8, "svg", 7);
    \u0275\u0275element(9, "path", 72);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const escala_r12 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("ngModel", escala_r12.cantidadMinima);
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", escala_r12.monto);
  }
}
function ComisionesPage_Conditional_22_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 51)(1, "h3", 22);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 53)(4, "div")(5, "label", 14);
    \u0275\u0275text(6, "Nombre del Bono");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "input", 54);
    \u0275\u0275twoWayListener("ngModelChange", function ComisionesPage_Conditional_22_Conditional_8_Template_input_ngModelChange_7_listener($event) {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.bonoEditando().nombre, $event) || (ctx_r1.bonoEditando().nombre = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "div")(9, "label", 14);
    \u0275\u0275text(10, "Descripci\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "input", 55);
    \u0275\u0275twoWayListener("ngModelChange", function ComisionesPage_Conditional_22_Conditional_8_Template_input_ngModelChange_11_listener($event) {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.bonoEditando().descripcion, $event) || (ctx_r1.bonoEditando().descripcion = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "div")(13, "label", 14);
    \u0275\u0275text(14, "Campo a Evaluar");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "select", 56);
    \u0275\u0275twoWayListener("ngModelChange", function ComisionesPage_Conditional_22_Conditional_8_Template_select_ngModelChange_15_listener($event) {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.bonoEditando().campoEvaluar, $event) || (ctx_r1.bonoEditando().campoEvaluar = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(16, "option", 57);
    \u0275\u0275text(17, "Seleccionar campo...");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(18, ComisionesPage_Conditional_22_Conditional_8_For_19_Template, 2, 2, "option", 16, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(20, "div")(21, "label", 14);
    \u0275\u0275text(22, "Valor a Buscar");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "input", 58);
    \u0275\u0275twoWayListener("ngModelChange", function ComisionesPage_Conditional_22_Conditional_8_Template_input_ngModelChange_23_listener($event) {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.bonoEditando().valorBuscar, $event) || (ctx_r1.bonoEditando().valorBuscar = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(24, "div", 59)(25, "div", 60)(26, "label", 61);
    \u0275\u0275text(27, "Escalas");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "button", 62);
    \u0275\u0275listener("click", function ComisionesPage_Conditional_22_Conditional_8_Template_button_click_28_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.agregarEscala());
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(29, "svg", 63);
    \u0275\u0275element(30, "path", 18);
    \u0275\u0275elementEnd();
    \u0275\u0275text(31, " Agregar escala ");
    \u0275\u0275elementEnd()();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(32, "div", 64);
    \u0275\u0275repeaterCreate(33, ComisionesPage_Conditional_22_Conditional_8_For_34_Template, 10, 2, "div", 65, \u0275\u0275repeaterTrackByIndex);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(35, "div", 66)(36, "button", 67);
    \u0275\u0275listener("click", function ComisionesPage_Conditional_22_Conditional_8_Template_button_click_36_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.guardarBono());
    });
    \u0275\u0275text(37);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(38, "button", 30);
    \u0275\u0275listener("click", function ComisionesPage_Conditional_22_Conditional_8_Template_button_click_38_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.cancelarBono());
    });
    \u0275\u0275text(39, " Cancelar ");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    let tmp_2_0;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ((tmp_2_0 = ctx_r1.bonoEditando()) == null ? null : tmp_2_0.id) ? "Editar Bono" : "Nuevo Bono", " ");
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.bonoEditando().nombre);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.bonoEditando().descripcion);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.bonoEditando().campoEvaluar);
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r1.camposDisponibles());
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.bonoEditando().valorBuscar);
    \u0275\u0275advance(10);
    \u0275\u0275repeater(ctx_r1.bonoEditando().escalas);
    \u0275\u0275advance(3);
    \u0275\u0275property("disabled", ctx_r1.isLoading());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.isLoading() ? "Guardando..." : "Guardar", " ");
  }
}
function ComisionesPage_Conditional_22_Conditional_9_For_2_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 77);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const bono_r15 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(bono_r15.descripcion);
  }
}
function ComisionesPage_Conditional_22_Conditional_9_For_2_Conditional_17_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 82);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const escala_r16 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2(" ", escala_r16.cantidadMinima, "+ pagos = S/ ", escala_r16.monto, " ");
  }
}
function ComisionesPage_Conditional_22_Conditional_9_For_2_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 81);
    \u0275\u0275repeaterCreate(1, ComisionesPage_Conditional_22_Conditional_9_For_2_Conditional_17_For_2_Template, 2, 2, "span", 82, _forTrack1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const bono_r15 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275repeater(bono_r15.escalas);
  }
}
function ComisionesPage_Conditional_22_Conditional_9_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 73)(1, "div", 74)(2, "div")(3, "h4", 75);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 76);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(7, ComisionesPage_Conditional_22_Conditional_9_For_2_Conditional_7_Template, 2, 1, "p", 77);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "div", 78)(9, "span", 42);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "button", 79);
    \u0275\u0275listener("click", function ComisionesPage_Conditional_22_Conditional_9_For_2_Template_button_click_11_listener() {
      const bono_r15 = \u0275\u0275restoreView(_r14).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.editarBono(bono_r15));
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(12, "svg", 7);
    \u0275\u0275element(13, "path", 45);
    \u0275\u0275elementEnd()();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(14, "button", 80);
    \u0275\u0275listener("click", function ComisionesPage_Conditional_22_Conditional_9_For_2_Template_button_click_14_listener() {
      const bono_r15 = \u0275\u0275restoreView(_r14).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.eliminarBono(bono_r15));
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(15, "svg", 7);
    \u0275\u0275element(16, "path", 47);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275conditionalCreate(17, ComisionesPage_Conditional_22_Conditional_9_For_2_Conditional_17_Template, 3, 0, "div", 81);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const bono_r15 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(bono_r15.nombre);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2(" ", ctx_r1.comisionesService.getNombreCampo(bono_r15.campoEvaluar), ' = "', bono_r15.valorBuscar, '" ');
    \u0275\u0275advance();
    \u0275\u0275conditional(bono_r15.descripcion ? 7 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275classMap(bono_r15.activo ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-400");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", bono_r15.activo ? "Activo" : "Inactivo", " ");
    \u0275\u0275advance(7);
    \u0275\u0275conditional(bono_r15.escalas && bono_r15.escalas.length > 0 ? 17 : -1);
  }
}
function ComisionesPage_Conditional_22_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 52);
    \u0275\u0275repeaterCreate(1, ComisionesPage_Conditional_22_Conditional_9_For_2_Template, 18, 8, "div", 73, _forTrack1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.bonos());
  }
}
function ComisionesPage_Conditional_22_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 21);
    \u0275\u0275text(1, " No hay bonos configurados ");
    \u0275\u0275elementEnd();
  }
}
function ComisionesPage_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 11)(1, "div", 48)(2, "h2", 49);
    \u0275\u0275text(3, "Configuraci\xF3n de Bonos");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "button", 50);
    \u0275\u0275listener("click", function ComisionesPage_Conditional_22_Template_button_click_4_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.nuevoBono());
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(5, "svg", 7);
    \u0275\u0275element(6, "path", 18);
    \u0275\u0275elementEnd();
    \u0275\u0275text(7, " Nuevo Bono ");
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(8, ComisionesPage_Conditional_22_Conditional_8_Template, 40, 7, "div", 51);
    \u0275\u0275conditionalCreate(9, ComisionesPage_Conditional_22_Conditional_9_Template, 3, 0, "div", 52)(10, ComisionesPage_Conditional_22_Conditional_10_Template, 2, 0, "div", 21);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(8);
    \u0275\u0275conditional(ctx_r1.mostrarFormBono() ? 8 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.bonos().length > 0 ? 9 : 10);
  }
}
function ComisionesPage_Conditional_23_For_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 16);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const a_r18 = ctx.$implicit;
    \u0275\u0275property("value", a_r18);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(a_r18);
  }
}
function ComisionesPage_Conditional_23_For_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 16);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const m_r19 = ctx.$implicit;
    \u0275\u0275property("value", m_r19.value);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(m_r19.label);
  }
}
function ComisionesPage_Conditional_23_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(0, "svg", 86);
    \u0275\u0275element(1, "circle", 87)(2, "path", 88);
    \u0275\u0275elementEnd();
    \u0275\u0275text(3, " Calculando... ");
  }
}
function ComisionesPage_Conditional_23_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(0, "svg", 7);
    \u0275\u0275element(1, "path", 89);
    \u0275\u0275elementEnd();
    \u0275\u0275text(2, " Calcular Comisiones ");
  }
}
function ComisionesPage_Conditional_23_Conditional_17_Conditional_21_For_22_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    const _r20 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 111);
    \u0275\u0275listener("click", function ComisionesPage_Conditional_23_Conditional_17_Conditional_21_For_22_Conditional_17_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r20);
      const agente_r21 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.toggleDetalleBonos(agente_r21));
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(1, "svg", 112);
    \u0275\u0275element(2, "path", 113);
    \u0275\u0275elementEnd()();
  }
}
function ComisionesPage_Conditional_23_Conditional_17_Conditional_21_For_22_Conditional_20_For_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 117);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const bono_r22 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate3(" ", bono_r22.nombreBono, ": ", bono_r22.cantidadPagos, " pagos = S/ ", bono_r22.montoGanado, " ");
  }
}
function ComisionesPage_Conditional_23_Conditional_17_Conditional_21_For_22_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr", 110)(1, "td", 114)(2, "div", 115)(3, "span", 116);
    \u0275\u0275text(4, "Bonos ganados:");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(5, ComisionesPage_Conditional_23_Conditional_17_Conditional_21_For_22_Conditional_20_For_6_Template, 2, 3, "span", 117, _forTrack3);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const agente_r21 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(5);
    \u0275\u0275repeater(agente_r21.bonosGanados);
  }
}
function ComisionesPage_Conditional_23_Conditional_17_Conditional_21_For_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr", 37)(1, "td", 103);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td", 104);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td", 39);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "td", 40);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "td", 105)(10, "span");
    \u0275\u0275text(11);
    \u0275\u0275pipe(12, "number");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "td", 106);
    \u0275\u0275text(14);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "td", 107);
    \u0275\u0275text(16);
    \u0275\u0275conditionalCreate(17, ComisionesPage_Conditional_23_Conditional_17_Conditional_21_For_22_Conditional_17_Template, 3, 0, "button", 108);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "td", 109);
    \u0275\u0275text(19);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(20, ComisionesPage_Conditional_23_Conditional_17_Conditional_21_For_22_Conditional_20_Template, 7, 0, "tr", 110);
  }
  if (rf & 2) {
    const agente_r21 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", agente_r21.nombreAgente || "Agente " + agente_r21.idAgente, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", agente_r21.nombreSubcartera, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" S/ ", ctx_r1.formatMonto(agente_r21.recaudoTotal), " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" S/ ", ctx_r1.formatMonto(agente_r21.metaIndividual), " ");
    \u0275\u0275advance(2);
    \u0275\u0275classMap(agente_r21.metaAlcanzada ? "text-green-600 font-semibold" : "text-amber-600");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind2(12, 12, agente_r21.porcentajeCumplimiento, "1.1-1"), "% ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" S/ ", ctx_r1.formatMonto(agente_r21.comisionBase), " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" S/ ", ctx_r1.formatMonto(agente_r21.totalBonos), " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(agente_r21.bonosGanados && agente_r21.bonosGanados.length > 0 ? 17 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" S/ ", ctx_r1.formatMonto(agente_r21.totalComision), " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.agenteExpandido() === agente_r21.idAgente && agente_r21.bonosGanados && agente_r21.bonosGanados.length > 0 ? 20 : -1);
  }
}
function ComisionesPage_Conditional_23_Conditional_17_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 20)(1, "table", 31)(2, "thead", 32)(3, "tr")(4, "th", 33);
    \u0275\u0275text(5, "Agente");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th", 33);
    \u0275\u0275text(7, "Subcartera");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th", 34);
    \u0275\u0275text(9, "Recaudo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th", 34);
    \u0275\u0275text(11, "Meta");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th", 34);
    \u0275\u0275text(13, "% Cumpl.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "th", 34);
    \u0275\u0275text(15, "Comisi\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "th", 34);
    \u0275\u0275text(17, "Bonos");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "th", 34);
    \u0275\u0275text(19, "Total");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(20, "tbody", 36);
    \u0275\u0275repeaterCreate(21, ComisionesPage_Conditional_23_Conditional_17_Conditional_21_For_22_Template, 21, 15, null, null, _forTrack2);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(21);
    \u0275\u0275repeater(ctx_r1.reporte().agentes);
  }
}
function ComisionesPage_Conditional_23_Conditional_17_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 21);
    \u0275\u0275text(1, " No hay datos para mostrar ");
    \u0275\u0275elementEnd();
  }
}
function ComisionesPage_Conditional_23_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 90)(1, "div", 91)(2, "p", 92);
    \u0275\u0275text(3, "Total Recaudo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p", 93);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 94)(7, "p", 95);
    \u0275\u0275text(8, "Total Comisiones");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "p", 96);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "div", 97)(12, "p", 98);
    \u0275\u0275text(13, "Total Bonos");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "p", 99);
    \u0275\u0275text(15);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "div", 100)(17, "p", 101);
    \u0275\u0275text(18, "Agentes");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "p", 102);
    \u0275\u0275text(20);
    \u0275\u0275elementEnd()()();
    \u0275\u0275conditionalCreate(21, ComisionesPage_Conditional_23_Conditional_17_Conditional_21_Template, 23, 0, "div", 20)(22, ComisionesPage_Conditional_23_Conditional_17_Conditional_22_Template, 2, 0, "div", 21);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("S/ ", ctx_r1.formatMonto(ctx_r1.reporte().totalRecaudo));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("S/ ", ctx_r1.formatMonto(ctx_r1.reporte().totalComisiones));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("S/ ", ctx_r1.formatMonto(ctx_r1.reporte().totalBonos));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.reporte().totalAgentes);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.reporte().agentes && ctx_r1.reporte().agentes.length > 0 ? 21 : 22);
  }
}
function ComisionesPage_Conditional_23_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 85);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(1, "svg", 118);
    \u0275\u0275element(2, "path", 10);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(3, "p");
    \u0275\u0275text(4, 'Selecciona un per\xEDodo y haz clic en "Calcular Comisiones"');
    \u0275\u0275elementEnd()();
  }
}
function ComisionesPage_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    const _r17 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 11)(1, "div", 13)(2, "div")(3, "label", 14);
    \u0275\u0275text(4, "A\xF1o");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "select", 83);
    \u0275\u0275twoWayListener("ngModelChange", function ComisionesPage_Conditional_23_Template_select_ngModelChange_5_listener($event) {
      \u0275\u0275restoreView(_r17);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.filtroAnio, $event) || (ctx_r1.filtroAnio = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275repeaterCreate(6, ComisionesPage_Conditional_23_For_7_Template, 2, 2, "option", 16, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "div")(9, "label", 14);
    \u0275\u0275text(10, "Mes");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "select", 83);
    \u0275\u0275twoWayListener("ngModelChange", function ComisionesPage_Conditional_23_Template_select_ngModelChange_11_listener($event) {
      \u0275\u0275restoreView(_r17);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.filtroMes, $event) || (ctx_r1.filtroMes = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275repeaterCreate(12, ComisionesPage_Conditional_23_For_13_Template, 2, 2, "option", 16, _forTrack0);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "button", 84);
    \u0275\u0275listener("click", function ComisionesPage_Conditional_23_Template_button_click_14_listener() {
      \u0275\u0275restoreView(_r17);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.calcularComisiones());
    });
    \u0275\u0275conditionalCreate(15, ComisionesPage_Conditional_23_Conditional_15_Template, 4, 0)(16, ComisionesPage_Conditional_23_Conditional_16_Template, 3, 0);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(17, ComisionesPage_Conditional_23_Conditional_17_Template, 23, 5)(18, ComisionesPage_Conditional_23_Conditional_18_Template, 5, 0, "div", 85);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.filtroAnio);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.aniosDisponibles);
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.filtroMes);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.mesesDisponibles);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r1.isLoading());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.isLoading() ? 15 : 16);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.reporte() ? 17 : 18);
  }
}
function ComisionesPage_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 119)(1, "p");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275classMap(ctx_r1.mensajeError() ? "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800" : "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800");
    \u0275\u0275advance();
    \u0275\u0275classMap(ctx_r1.mensajeError() ? "text-red-700 dark:text-red-400" : "text-green-700 dark:text-green-400");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.mensaje(), " ");
  }
}
var _ComisionesPage = class _ComisionesPage {
  constructor(comisionesService) {
    this.comisionesService = comisionesService;
    this.activeTab = signal("metas", ...ngDevMode ? [{ debugName: "activeTab" }] : []);
    this.isLoading = signal(false, ...ngDevMode ? [{ debugName: "isLoading" }] : []);
    this.mensaje = signal("", ...ngDevMode ? [{ debugName: "mensaje" }] : []);
    this.mensajeError = signal(false, ...ngDevMode ? [{ debugName: "mensajeError" }] : []);
    this.metas = signal([], ...ngDevMode ? [{ debugName: "metas" }] : []);
    this.mostrarFormMeta = signal(false, ...ngDevMode ? [{ debugName: "mostrarFormMeta" }] : []);
    this.metaEditando = signal(null, ...ngDevMode ? [{ debugName: "metaEditando" }] : []);
    this.bonos = signal([], ...ngDevMode ? [{ debugName: "bonos" }] : []);
    this.mostrarFormBono = signal(false, ...ngDevMode ? [{ debugName: "mostrarFormBono" }] : []);
    this.bonoEditando = signal(null, ...ngDevMode ? [{ debugName: "bonoEditando" }] : []);
    this.camposDisponibles = signal([], ...ngDevMode ? [{ debugName: "camposDisponibles" }] : []);
    this.reporte = signal(null, ...ngDevMode ? [{ debugName: "reporte" }] : []);
    this.agenteExpandido = signal(null, ...ngDevMode ? [{ debugName: "agenteExpandido" }] : []);
    this.filtroAnio = (/* @__PURE__ */ new Date()).getFullYear();
    this.filtroMes = (/* @__PURE__ */ new Date()).getMonth() + 1;
    this.aniosDisponibles = [2024, 2025, 2026];
    this.mesesDisponibles = [
      { value: 1, label: "Enero" },
      { value: 2, label: "Febrero" },
      { value: 3, label: "Marzo" },
      { value: 4, label: "Abril" },
      { value: 5, label: "Mayo" },
      { value: 6, label: "Junio" },
      { value: 7, label: "Julio" },
      { value: 8, label: "Agosto" },
      { value: 9, label: "Septiembre" },
      { value: 10, label: "Octubre" },
      { value: 11, label: "Noviembre" },
      { value: 12, label: "Diciembre" }
    ];
  }
  ngOnInit() {
    this.cargarMetas();
    this.cargarCamposDisponibles();
  }
  // ==================== METAS ====================
  cargarMetas() {
    this.comisionesService.obtenerMetas(this.filtroAnio, this.filtroMes).subscribe({
      next: (data) => this.metas.set(data),
      error: (err) => this.mostrarMensaje("Error al cargar metas: " + err.message, true)
    });
  }
  nuevaMeta() {
    this.metaEditando.set({
      idSubcartera: 0,
      nombreSubcartera: "",
      anio: this.filtroAnio,
      mes: this.filtroMes,
      metaGrupal: 0,
      porcentajeComision: 2.5,
      activo: true
    });
    this.mostrarFormMeta.set(true);
  }
  editarMeta(meta) {
    this.metaEditando.set(__spreadValues({}, meta));
    this.mostrarFormMeta.set(true);
  }
  guardarMeta() {
    if (!this.metaEditando())
      return;
    this.isLoading.set(true);
    this.comisionesService.guardarMeta(this.metaEditando()).subscribe({
      next: () => {
        this.mostrarMensaje("Meta guardada correctamente", false);
        this.cargarMetas();
        this.cancelarMeta();
      },
      error: (err) => this.mostrarMensaje("Error: " + err.error?.message || err.message, true),
      complete: () => this.isLoading.set(false)
    });
  }
  eliminarMeta(meta) {
    if (!confirm("\xBFEliminar esta meta?"))
      return;
    this.comisionesService.eliminarMeta(meta.id).subscribe({
      next: () => {
        this.mostrarMensaje("Meta eliminada", false);
        this.cargarMetas();
      },
      error: (err) => this.mostrarMensaje("Error: " + err.message, true)
    });
  }
  cancelarMeta() {
    this.metaEditando.set(null);
    this.mostrarFormMeta.set(false);
  }
  // ==================== BONOS ====================
  cargarBonos() {
    this.comisionesService.obtenerBonos().subscribe({
      next: (data) => this.bonos.set(data),
      error: (err) => this.mostrarMensaje("Error al cargar bonos: " + err.message, true)
    });
  }
  cargarCamposDisponibles() {
    this.comisionesService.obtenerCamposDisponibles().subscribe({
      next: (data) => this.camposDisponibles.set(data),
      error: () => {
      }
    });
  }
  nuevoBono() {
    this.bonoEditando.set({
      nombre: "",
      descripcion: "",
      campoEvaluar: "",
      valorBuscar: "",
      activo: true,
      escalas: []
    });
    this.mostrarFormBono.set(true);
  }
  editarBono(bono) {
    this.bonoEditando.set(__spreadProps(__spreadValues({}, bono), {
      escalas: bono.escalas ? [...bono.escalas] : []
    }));
    this.mostrarFormBono.set(true);
  }
  agregarEscala() {
    if (!this.bonoEditando())
      return;
    const escalas = [...this.bonoEditando().escalas, { cantidadMinima: 0, monto: 0 }];
    this.bonoEditando.set(__spreadProps(__spreadValues({}, this.bonoEditando()), { escalas }));
  }
  eliminarEscala(index) {
    if (!this.bonoEditando())
      return;
    const escalas = this.bonoEditando().escalas.filter((_, i) => i !== index);
    this.bonoEditando.set(__spreadProps(__spreadValues({}, this.bonoEditando()), { escalas }));
  }
  guardarBono() {
    if (!this.bonoEditando())
      return;
    this.isLoading.set(true);
    this.comisionesService.guardarBono(this.bonoEditando()).subscribe({
      next: () => {
        this.mostrarMensaje("Bono guardado correctamente", false);
        this.cargarBonos();
        this.cancelarBono();
      },
      error: (err) => this.mostrarMensaje("Error: " + err.error?.message || err.message, true),
      complete: () => this.isLoading.set(false)
    });
  }
  eliminarBono(bono) {
    if (!confirm("\xBFEliminar este bono?"))
      return;
    this.comisionesService.eliminarBono(bono.id).subscribe({
      next: () => {
        this.mostrarMensaje("Bono eliminado", false);
        this.cargarBonos();
      },
      error: (err) => this.mostrarMensaje("Error: " + err.message, true)
    });
  }
  cancelarBono() {
    this.bonoEditando.set(null);
    this.mostrarFormBono.set(false);
  }
  // ==================== REPORTE ====================
  calcularComisiones() {
    this.isLoading.set(true);
    this.reporte.set(null);
    this.comisionesService.calcularComisiones(this.filtroAnio, this.filtroMes).subscribe({
      next: (data) => {
        this.reporte.set(data);
        if (data.agentes.length === 0) {
          this.mostrarMensaje("No hay datos para el per\xEDodo seleccionado", false);
        }
      },
      error: (err) => this.mostrarMensaje("Error al calcular: " + err.message, true),
      complete: () => this.isLoading.set(false)
    });
  }
  toggleDetalleBonos(agente) {
    if (this.agenteExpandido() === agente.idAgente) {
      this.agenteExpandido.set(null);
    } else {
      this.agenteExpandido.set(agente.idAgente);
    }
  }
  // ==================== UTILIDADES ====================
  formatMonto(monto) {
    if (monto === void 0 || monto === null)
      return "0.00";
    return monto.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  mostrarMensaje(msg, error) {
    this.mensaje.set(msg);
    this.mensajeError.set(error);
    setTimeout(() => this.mensaje.set(""), 4e3);
  }
};
_ComisionesPage.\u0275fac = function ComisionesPage_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _ComisionesPage)(\u0275\u0275directiveInject(ComisionesService));
};
_ComisionesPage.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ComisionesPage, selectors: [["app-comisiones"]], decls: 25, vars: 10, consts: [[1, "min-h-screen", "bg-slate-50", "dark:bg-slate-900", "p-6"], [1, "mb-6"], [1, "text-2xl", "font-bold", "text-slate-800", "dark:text-white"], [1, "text-slate-600", "dark:text-slate-400"], [1, "border-b", "border-slate-200", "dark:border-slate-700"], [1, "-mb-px", "flex", "space-x-8"], [1, "whitespace-nowrap", "py-4", "px-1", "border-b-2", "font-medium", "text-sm", "transition-colors", "flex", "items-center", "gap-2", 3, "click"], ["fill", "none", "stroke", "currentColor", "viewBox", "0 0 24 24", 1, "w-5", "h-5"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"], [1, "bg-white", "dark:bg-slate-800", "rounded-xl", "shadow-sm", "border", "border-slate-200", "dark:border-slate-700", "p-6", "mb-6"], [1, "fixed", "bottom-4", "right-4", "p-4", "border", "rounded-lg", "shadow-lg", "max-w-md", 3, "class"], [1, "flex", "flex-wrap", "gap-4", "items-end", "mb-6"], [1, "block", "text-sm", "font-medium", "text-slate-700", "dark:text-slate-300", "mb-1"], [1, "px-3", "py-2", "border", "border-slate-300", "dark:border-slate-600", "rounded-lg", "bg-white", "dark:bg-slate-700", "text-slate-800", "dark:text-white", 3, "ngModelChange", "change", "ngModel"], [3, "value"], [1, "px-4", "py-2", "bg-blue-600", "text-white", "rounded-lg", "hover:bg-blue-700", "transition-colors", "flex", "items-center", "gap-2", 3, "click"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M12 4v16m8-8H4"], [1, "mb-6", "p-4", "border", "border-blue-200", "dark:border-blue-800", "bg-blue-50", "dark:bg-blue-900/20", "rounded-lg"], [1, "overflow-x-auto"], [1, "text-center", "py-8", "text-slate-500", "dark:text-slate-400"], [1, "text-lg", "font-semibold", "text-slate-800", "dark:text-white", "mb-4"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "lg:grid-cols-4", "gap-4"], ["type", "number", "placeholder", "ID Subcartera", 1, "w-full", "px-3", "py-2", "border", "border-slate-300", "dark:border-slate-600", "rounded-lg", "bg-white", "dark:bg-slate-700", "text-slate-800", "dark:text-white", 3, "ngModelChange", "ngModel"], ["type", "text", "placeholder", "Nombre", 1, "w-full", "px-3", "py-2", "border", "border-slate-300", "dark:border-slate-600", "rounded-lg", "bg-white", "dark:bg-slate-700", "text-slate-800", "dark:text-white", 3, "ngModelChange", "ngModel"], ["type", "number", "placeholder", "0.00", 1, "w-full", "px-3", "py-2", "border", "border-slate-300", "dark:border-slate-600", "rounded-lg", "bg-white", "dark:bg-slate-700", "text-slate-800", "dark:text-white", 3, "ngModelChange", "ngModel"], ["type", "number", "step", "0.01", "placeholder", "2.5", 1, "w-full", "px-3", "py-2", "border", "border-slate-300", "dark:border-slate-600", "rounded-lg", "bg-white", "dark:bg-slate-700", "text-slate-800", "dark:text-white", 3, "ngModelChange", "ngModel"], [1, "mt-4", "flex", "gap-2"], [1, "px-4", "py-2", "bg-blue-600", "text-white", "rounded-lg", "hover:bg-blue-700", "disabled:bg-slate-400", "transition-colors", 3, "click", "disabled"], [1, "px-4", "py-2", "bg-slate-200", "dark:bg-slate-700", "text-slate-700", "dark:text-slate-300", "rounded-lg", "hover:bg-slate-300", "dark:hover:bg-slate-600", "transition-colors", 3, "click"], [1, "min-w-full", "divide-y", "divide-slate-200", "dark:divide-slate-700"], [1, "bg-slate-50", "dark:bg-slate-700/50"], [1, "px-4", "py-3", "text-left", "text-xs", "font-medium", "text-slate-500", "uppercase"], [1, "px-4", "py-3", "text-right", "text-xs", "font-medium", "text-slate-500", "uppercase"], [1, "px-4", "py-3", "text-center", "text-xs", "font-medium", "text-slate-500", "uppercase"], [1, "divide-y", "divide-slate-200", "dark:divide-slate-700"], [1, "hover:bg-slate-50", "dark:hover:bg-slate-700/50"], [1, "px-4", "py-3", "text-sm", "text-slate-800", "dark:text-white", "font-medium"], [1, "px-4", "py-3", "text-sm", "text-right", "text-green-600", "font-semibold"], [1, "px-4", "py-3", "text-sm", "text-right", "text-slate-600", "dark:text-slate-400"], [1, "px-4", "py-3", "text-center"], [1, "px-2", "py-1", "rounded-full", "text-xs", "font-medium"], [1, "text-blue-600", "hover:text-blue-800", "dark:text-blue-400", "dark:hover:text-blue-300", "mr-2", 3, "click"], ["fill", "none", "stroke", "currentColor", "viewBox", "0 0 24 24", 1, "w-5", "h-5", "inline"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"], [1, "text-red-600", "hover:text-red-800", "dark:text-red-400", "dark:hover:text-red-300", 3, "click"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"], [1, "flex", "justify-between", "items-center", "mb-6"], [1, "text-lg", "font-semibold", "text-slate-800", "dark:text-white"], [1, "px-4", "py-2", "bg-green-600", "text-white", "rounded-lg", "hover:bg-green-700", "transition-colors", "flex", "items-center", "gap-2", 3, "click"], [1, "mb-6", "p-4", "border", "border-green-200", "dark:border-green-800", "bg-green-50", "dark:bg-green-900/20", "rounded-lg"], [1, "space-y-4"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "gap-4", "mb-4"], ["type", "text", "placeholder", "Ej: Bono LTD T5", 1, "w-full", "px-3", "py-2", "border", "border-slate-300", "dark:border-slate-600", "rounded-lg", "bg-white", "dark:bg-slate-700", "text-slate-800", "dark:text-white", 3, "ngModelChange", "ngModel"], ["type", "text", "placeholder", "Descripci\xF3n opcional", 1, "w-full", "px-3", "py-2", "border", "border-slate-300", "dark:border-slate-600", "rounded-lg", "bg-white", "dark:bg-slate-700", "text-slate-800", "dark:text-white", 3, "ngModelChange", "ngModel"], [1, "w-full", "px-3", "py-2", "border", "border-slate-300", "dark:border-slate-600", "rounded-lg", "bg-white", "dark:bg-slate-700", "text-slate-800", "dark:text-white", 3, "ngModelChange", "ngModel"], ["value", ""], ["type", "text", "placeholder", "Ej: ltd_t5", 1, "w-full", "px-3", "py-2", "border", "border-slate-300", "dark:border-slate-600", "rounded-lg", "bg-white", "dark:bg-slate-700", "text-slate-800", "dark:text-white", 3, "ngModelChange", "ngModel"], [1, "mb-4"], [1, "flex", "justify-between", "items-center", "mb-2"], [1, "block", "text-sm", "font-medium", "text-slate-700", "dark:text-slate-300"], [1, "text-sm", "text-green-600", "hover:text-green-800", "dark:text-green-400", "flex", "items-center", "gap-1", 3, "click"], ["fill", "none", "stroke", "currentColor", "viewBox", "0 0 24 24", 1, "w-4", "h-4"], [1, "space-y-2"], [1, "flex", "gap-2", "items-center"], [1, "flex", "gap-2"], [1, "px-4", "py-2", "bg-green-600", "text-white", "rounded-lg", "hover:bg-green-700", "disabled:bg-slate-400", "transition-colors", 3, "click", "disabled"], ["type", "number", "placeholder", "Cantidad", 1, "w-32", "px-3", "py-2", "border", "border-slate-300", "dark:border-slate-600", "rounded-lg", "bg-white", "dark:bg-slate-700", "text-slate-800", "dark:text-white", 3, "ngModelChange", "ngModel"], [1, "text-slate-500"], ["type", "number", "step", "0.01", "placeholder", "Monto", 1, "w-32", "px-3", "py-2", "border", "border-slate-300", "dark:border-slate-600", "rounded-lg", "bg-white", "dark:bg-slate-700", "text-slate-800", "dark:text-white", 3, "ngModelChange", "ngModel"], [1, "text-red-500", "hover:text-red-700", 3, "click"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M6 18L18 6M6 6l12 12"], [1, "border", "border-slate-200", "dark:border-slate-700", "rounded-lg", "p-4"], [1, "flex", "justify-between", "items-start"], [1, "font-semibold", "text-slate-800", "dark:text-white"], [1, "text-sm", "text-slate-600", "dark:text-slate-400"], [1, "text-sm", "text-slate-500", "dark:text-slate-500", "mt-1"], [1, "flex", "items-center", "gap-2"], [1, "text-blue-600", "hover:text-blue-800", "dark:text-blue-400", 3, "click"], [1, "text-red-600", "hover:text-red-800", "dark:text-red-400", 3, "click"], [1, "mt-3", "flex", "flex-wrap", "gap-2"], [1, "px-2", "py-1", "bg-slate-100", "dark:bg-slate-700", "rounded", "text-sm", "text-slate-700", "dark:text-slate-300"], [1, "px-3", "py-2", "border", "border-slate-300", "dark:border-slate-600", "rounded-lg", "bg-white", "dark:bg-slate-700", "text-slate-800", "dark:text-white", 3, "ngModelChange", "ngModel"], [1, "px-6", "py-2", "bg-purple-600", "text-white", "rounded-lg", "hover:bg-purple-700", "disabled:bg-slate-400", "transition-colors", "flex", "items-center", "gap-2", 3, "click", "disabled"], [1, "text-center", "py-12", "text-slate-500", "dark:text-slate-400"], ["fill", "none", "viewBox", "0 0 24 24", 1, "animate-spin", "h-5", "w-5"], ["cx", "12", "cy", "12", "r", "10", "stroke", "currentColor", "stroke-width", "4", 1, "opacity-25"], ["fill", "currentColor", "d", "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z", 1, "opacity-75"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"], [1, "grid", "grid-cols-1", "md:grid-cols-4", "gap-4", "mb-6"], [1, "bg-blue-50", "dark:bg-blue-900/20", "rounded-lg", "p-4"], [1, "text-sm", "text-blue-600", "dark:text-blue-400", "font-medium"], [1, "text-2xl", "font-bold", "text-blue-800", "dark:text-blue-300"], [1, "bg-green-50", "dark:bg-green-900/20", "rounded-lg", "p-4"], [1, "text-sm", "text-green-600", "dark:text-green-400", "font-medium"], [1, "text-2xl", "font-bold", "text-green-800", "dark:text-green-300"], [1, "bg-amber-50", "dark:bg-amber-900/20", "rounded-lg", "p-4"], [1, "text-sm", "text-amber-600", "dark:text-amber-400", "font-medium"], [1, "text-2xl", "font-bold", "text-amber-800", "dark:text-amber-300"], [1, "bg-purple-50", "dark:bg-purple-900/20", "rounded-lg", "p-4"], [1, "text-sm", "text-purple-600", "dark:text-purple-400", "font-medium"], [1, "text-2xl", "font-bold", "text-purple-800", "dark:text-purple-300"], [1, "px-4", "py-3", "text-sm", "font-medium", "text-slate-800", "dark:text-white"], [1, "px-4", "py-3", "text-sm", "text-slate-600", "dark:text-slate-400"], [1, "px-4", "py-3", "text-sm", "text-right"], [1, "px-4", "py-3", "text-sm", "text-right", "text-blue-600"], [1, "px-4", "py-3", "text-sm", "text-right", "text-amber-600"], [1, "ml-1", "text-slate-400", "hover:text-slate-600"], [1, "px-4", "py-3", "text-sm", "text-right", "font-bold", "text-purple-600"], [1, "bg-amber-50", "dark:bg-amber-900/10"], [1, "ml-1", "text-slate-400", "hover:text-slate-600", 3, "click"], ["fill", "none", "stroke", "currentColor", "viewBox", "0 0 24 24", 1, "w-4", "h-4", "inline"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"], ["colspan", "8", 1, "px-4", "py-2"], [1, "text-sm"], [1, "font-medium", "text-amber-700", "dark:text-amber-400"], [1, "ml-2", "px-2", "py-1", "bg-amber-100", "dark:bg-amber-900/30", "rounded", "text-amber-800", "dark:text-amber-300"], ["fill", "none", "stroke", "currentColor", "viewBox", "0 0 24 24", 1, "w-12", "h-12", "mx-auto", "mb-4", "text-slate-300", "dark:text-slate-600"], [1, "fixed", "bottom-4", "right-4", "p-4", "border", "rounded-lg", "shadow-lg", "max-w-md"]], template: function ComisionesPage_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "h1", 2);
    \u0275\u0275text(3, " Comisiones ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p", 3);
    \u0275\u0275text(5, " Configuraci\xF3n de metas, bonos y c\xE1lculo de comisiones por agente ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 1)(7, "div", 4)(8, "nav", 5)(9, "button", 6);
    \u0275\u0275listener("click", function ComisionesPage_Template_button_click_9_listener() {
      return ctx.activeTab.set("metas");
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(10, "svg", 7);
    \u0275\u0275element(11, "path", 8);
    \u0275\u0275elementEnd();
    \u0275\u0275text(12, " Metas ");
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(13, "button", 6);
    \u0275\u0275listener("click", function ComisionesPage_Template_button_click_13_listener() {
      ctx.activeTab.set("bonos");
      return ctx.cargarBonos();
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(14, "svg", 7);
    \u0275\u0275element(15, "path", 9);
    \u0275\u0275elementEnd();
    \u0275\u0275text(16, " Bonos ");
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(17, "button", 6);
    \u0275\u0275listener("click", function ComisionesPage_Template_button_click_17_listener() {
      return ctx.activeTab.set("reporte");
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(18, "svg", 7);
    \u0275\u0275element(19, "path", 10);
    \u0275\u0275elementEnd();
    \u0275\u0275text(20, " Reporte ");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275conditionalCreate(21, ComisionesPage_Conditional_21_Template, 21, 4, "div", 11);
    \u0275\u0275conditionalCreate(22, ComisionesPage_Conditional_22_Template, 11, 2, "div", 11);
    \u0275\u0275conditionalCreate(23, ComisionesPage_Conditional_23_Template, 19, 5, "div", 11);
    \u0275\u0275conditionalCreate(24, ComisionesPage_Conditional_24_Template, 3, 5, "div", 12);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance(9);
    \u0275\u0275classMap(ctx.activeTab() === "metas" ? "border-blue-500 text-blue-600 dark:text-blue-400" : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 hover:border-slate-300");
    \u0275\u0275advance(4);
    \u0275\u0275classMap(ctx.activeTab() === "bonos" ? "border-green-500 text-green-600 dark:text-green-400" : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 hover:border-slate-300");
    \u0275\u0275advance(4);
    \u0275\u0275classMap(ctx.activeTab() === "reporte" ? "border-purple-500 text-purple-600 dark:text-purple-400" : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 hover:border-slate-300");
    \u0275\u0275advance(4);
    \u0275\u0275conditional(ctx.activeTab() === "metas" ? 21 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx.activeTab() === "bonos" ? 22 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx.activeTab() === "reporte" ? 23 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx.mensaje() ? 24 : -1);
  }
}, dependencies: [CommonModule, FormsModule, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, NumberValueAccessor, SelectControlValueAccessor, NgControlStatus, NgModel, DecimalPipe], encapsulation: 2 });
var ComisionesPage = _ComisionesPage;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ComisionesPage, [{
    type: Component,
    args: [{
      selector: "app-comisiones",
      standalone: true,
      imports: [CommonModule, FormsModule],
      template: `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-slate-800 dark:text-white">
          Comisiones
        </h1>
        <p class="text-slate-600 dark:text-slate-400">
          Configuraci\xF3n de metas, bonos y c\xE1lculo de comisiones por agente
        </p>
      </div>

      <!-- Tabs -->
      <div class="mb-6">
        <div class="border-b border-slate-200 dark:border-slate-700">
          <nav class="-mb-px flex space-x-8">
            <button
              (click)="activeTab.set('metas')"
              [class]="activeTab() === 'metas'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 hover:border-slate-300'"
              class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
              Metas
            </button>
            <button
              (click)="activeTab.set('bonos'); cargarBonos()"
              [class]="activeTab() === 'bonos'
                ? 'border-green-500 text-green-600 dark:text-green-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 hover:border-slate-300'"
              class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Bonos
            </button>
            <button
              (click)="activeTab.set('reporte')"
              [class]="activeTab() === 'reporte'
                ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 hover:border-slate-300'"
              class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              Reporte
            </button>
          </nav>
        </div>
      </div>

      <!-- ==================== TAB: METAS ==================== -->
      @if (activeTab() === 'metas') {
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-6">
          <!-- Selector de per\xEDodo -->
          <div class="flex flex-wrap gap-4 items-end mb-6">
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">A\xF1o</label>
              <select [(ngModel)]="filtroAnio" (change)="cargarMetas()" class="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white">
                @for (a of aniosDisponibles; track a) {
                  <option [value]="a">{{ a }}</option>
                }
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Mes</label>
              <select [(ngModel)]="filtroMes" (change)="cargarMetas()" class="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white">
                @for (m of mesesDisponibles; track m.value) {
                  <option [value]="m.value">{{ m.label }}</option>
                }
              </select>
            </div>
            <button (click)="nuevaMeta()" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              Nueva Meta
            </button>
          </div>

          <!-- Formulario de meta -->
          @if (mostrarFormMeta()) {
            <div class="mb-6 p-4 border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h3 class="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                {{ metaEditando()?.id ? 'Editar Meta' : 'Nueva Meta' }}
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Subcartera ID</label>
                  <input type="number" [(ngModel)]="metaEditando()!.idSubcartera" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white" placeholder="ID Subcartera">
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nombre Subcartera</label>
                  <input type="text" [(ngModel)]="metaEditando()!.nombreSubcartera" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white" placeholder="Nombre">
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Meta Grupal (S/)</label>
                  <input type="number" [(ngModel)]="metaEditando()!.metaGrupal" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white" placeholder="0.00">
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">% Comisi\xF3n</label>
                  <input type="number" step="0.01" [(ngModel)]="metaEditando()!.porcentajeComision" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white" placeholder="2.5">
                </div>
              </div>
              <div class="mt-4 flex gap-2">
                <button (click)="guardarMeta()" [disabled]="isLoading()" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-400 transition-colors">
                  {{ isLoading() ? 'Guardando...' : 'Guardar' }}
                </button>
                <button (click)="cancelarMeta()" class="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                  Cancelar
                </button>
              </div>
            </div>
          }

          <!-- Lista de metas -->
          @if (metas().length > 0) {
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                <thead class="bg-slate-50 dark:bg-slate-700/50">
                  <tr>
                    <th class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Subcartera</th>
                    <th class="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Meta Grupal</th>
                    <th class="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">% Comisi\xF3n</th>
                    <th class="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">Estado</th>
                    <th class="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
                  @for (meta of metas(); track meta.id) {
                    <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                      <td class="px-4 py-3 text-sm text-slate-800 dark:text-white font-medium">
                        {{ meta.nombreSubcartera || 'Subcartera ' + meta.idSubcartera }}
                      </td>
                      <td class="px-4 py-3 text-sm text-right text-green-600 font-semibold">
                        S/ {{ formatMonto(meta.metaGrupal) }}
                      </td>
                      <td class="px-4 py-3 text-sm text-right text-slate-600 dark:text-slate-400">
                        {{ meta.porcentajeComision || 0 }}%
                      </td>
                      <td class="px-4 py-3 text-center">
                        <span [class]="meta.activo ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-400'" class="px-2 py-1 rounded-full text-xs font-medium">
                          {{ meta.activo ? 'Activo' : 'Inactivo' }}
                        </span>
                      </td>
                      <td class="px-4 py-3 text-center">
                        <button (click)="editarMeta(meta)" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mr-2">
                          <svg class="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                          </svg>
                        </button>
                        <button (click)="eliminarMeta(meta)" class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                          <svg class="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          } @else {
            <div class="text-center py-8 text-slate-500 dark:text-slate-400">
              No hay metas configuradas para este per\xEDodo
            </div>
          }
        </div>
      }

      <!-- ==================== TAB: BONOS ==================== -->
      @if (activeTab() === 'bonos') {
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-lg font-semibold text-slate-800 dark:text-white">Configuraci\xF3n de Bonos</h2>
            <button (click)="nuevoBono()" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              Nuevo Bono
            </button>
          </div>

          <!-- Formulario de bono -->
          @if (mostrarFormBono()) {
            <div class="mb-6 p-4 border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h3 class="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                {{ bonoEditando()?.id ? 'Editar Bono' : 'Nuevo Bono' }}
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nombre del Bono</label>
                  <input type="text" [(ngModel)]="bonoEditando()!.nombre" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white" placeholder="Ej: Bono LTD T5">
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Descripci\xF3n</label>
                  <input type="text" [(ngModel)]="bonoEditando()!.descripcion" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white" placeholder="Descripci\xF3n opcional">
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Campo a Evaluar</label>
                  <select [(ngModel)]="bonoEditando()!.campoEvaluar" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white">
                    <option value="">Seleccionar campo...</option>
                    @for (campo of camposDisponibles(); track campo) {
                      <option [value]="campo">{{ comisionesService.getNombreCampo(campo) }}</option>
                    }
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Valor a Buscar</label>
                  <input type="text" [(ngModel)]="bonoEditando()!.valorBuscar" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white" placeholder="Ej: ltd_t5">
                </div>
              </div>

              <!-- Escalas -->
              <div class="mb-4">
                <div class="flex justify-between items-center mb-2">
                  <label class="block text-sm font-medium text-slate-700 dark:text-slate-300">Escalas</label>
                  <button (click)="agregarEscala()" class="text-sm text-green-600 hover:text-green-800 dark:text-green-400 flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                    </svg>
                    Agregar escala
                  </button>
                </div>
                <div class="space-y-2">
                  @for (escala of bonoEditando()!.escalas; track $index; let i = $index) {
                    <div class="flex gap-2 items-center">
                      <input type="number" [(ngModel)]="escala.cantidadMinima" class="w-32 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white" placeholder="Cantidad">
                      <span class="text-slate-500">pagos =</span>
                      <input type="number" step="0.01" [(ngModel)]="escala.monto" class="w-32 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white" placeholder="Monto">
                      <span class="text-slate-500">S/</span>
                      <button (click)="eliminarEscala(i)" class="text-red-500 hover:text-red-700">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                      </button>
                    </div>
                  }
                </div>
              </div>

              <div class="flex gap-2">
                <button (click)="guardarBono()" [disabled]="isLoading()" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-slate-400 transition-colors">
                  {{ isLoading() ? 'Guardando...' : 'Guardar' }}
                </button>
                <button (click)="cancelarBono()" class="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                  Cancelar
                </button>
              </div>
            </div>
          }

          <!-- Lista de bonos -->
          @if (bonos().length > 0) {
            <div class="space-y-4">
              @for (bono of bonos(); track bono.id) {
                <div class="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                  <div class="flex justify-between items-start">
                    <div>
                      <h4 class="font-semibold text-slate-800 dark:text-white">{{ bono.nombre }}</h4>
                      <p class="text-sm text-slate-600 dark:text-slate-400">
                        {{ comisionesService.getNombreCampo(bono.campoEvaluar) }} = "{{ bono.valorBuscar }}"
                      </p>
                      @if (bono.descripcion) {
                        <p class="text-sm text-slate-500 dark:text-slate-500 mt-1">{{ bono.descripcion }}</p>
                      }
                    </div>
                    <div class="flex items-center gap-2">
                      <span [class]="bono.activo ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-400'" class="px-2 py-1 rounded-full text-xs font-medium">
                        {{ bono.activo ? 'Activo' : 'Inactivo' }}
                      </span>
                      <button (click)="editarBono(bono)" class="text-blue-600 hover:text-blue-800 dark:text-blue-400">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                      </button>
                      <button (click)="eliminarBono(bono)" class="text-red-600 hover:text-red-800 dark:text-red-400">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <!-- Escalas del bono -->
                  @if (bono.escalas && bono.escalas.length > 0) {
                    <div class="mt-3 flex flex-wrap gap-2">
                      @for (escala of bono.escalas; track escala.id) {
                        <span class="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-sm text-slate-700 dark:text-slate-300">
                          {{ escala.cantidadMinima }}+ pagos = S/ {{ escala.monto }}
                        </span>
                      }
                    </div>
                  }
                </div>
              }
            </div>
          } @else {
            <div class="text-center py-8 text-slate-500 dark:text-slate-400">
              No hay bonos configurados
            </div>
          }
        </div>
      }

      <!-- ==================== TAB: REPORTE ==================== -->
      @if (activeTab() === 'reporte') {
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-6">
          <!-- Filtros -->
          <div class="flex flex-wrap gap-4 items-end mb-6">
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">A\xF1o</label>
              <select [(ngModel)]="filtroAnio" class="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white">
                @for (a of aniosDisponibles; track a) {
                  <option [value]="a">{{ a }}</option>
                }
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Mes</label>
              <select [(ngModel)]="filtroMes" class="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white">
                @for (m of mesesDisponibles; track m.value) {
                  <option [value]="m.value">{{ m.label }}</option>
                }
              </select>
            </div>
            <button (click)="calcularComisiones()" [disabled]="isLoading()" class="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-slate-400 transition-colors flex items-center gap-2">
              @if (isLoading()) {
                <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Calculando...
              } @else {
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                </svg>
                Calcular Comisiones
              }
            </button>
          </div>

          <!-- Resumen -->
          @if (reporte()) {
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <p class="text-sm text-blue-600 dark:text-blue-400 font-medium">Total Recaudo</p>
                <p class="text-2xl font-bold text-blue-800 dark:text-blue-300">S/ {{ formatMonto(reporte()!.totalRecaudo) }}</p>
              </div>
              <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <p class="text-sm text-green-600 dark:text-green-400 font-medium">Total Comisiones</p>
                <p class="text-2xl font-bold text-green-800 dark:text-green-300">S/ {{ formatMonto(reporte()!.totalComisiones) }}</p>
              </div>
              <div class="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4">
                <p class="text-sm text-amber-600 dark:text-amber-400 font-medium">Total Bonos</p>
                <p class="text-2xl font-bold text-amber-800 dark:text-amber-300">S/ {{ formatMonto(reporte()!.totalBonos) }}</p>
              </div>
              <div class="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                <p class="text-sm text-purple-600 dark:text-purple-400 font-medium">Agentes</p>
                <p class="text-2xl font-bold text-purple-800 dark:text-purple-300">{{ reporte()!.totalAgentes }}</p>
              </div>
            </div>

            <!-- Tabla de agentes -->
            @if (reporte()!.agentes && reporte()!.agentes.length > 0) {
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                  <thead class="bg-slate-50 dark:bg-slate-700/50">
                    <tr>
                      <th class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Agente</th>
                      <th class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Subcartera</th>
                      <th class="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Recaudo</th>
                      <th class="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Meta</th>
                      <th class="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">% Cumpl.</th>
                      <th class="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Comisi\xF3n</th>
                      <th class="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Bonos</th>
                      <th class="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Total</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
                    @for (agente of reporte()!.agentes; track agente.idAgente) {
                      <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                        <td class="px-4 py-3 text-sm font-medium text-slate-800 dark:text-white">
                          {{ agente.nombreAgente || 'Agente ' + agente.idAgente }}
                        </td>
                        <td class="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                          {{ agente.nombreSubcartera }}
                        </td>
                        <td class="px-4 py-3 text-sm text-right text-green-600 font-semibold">
                          S/ {{ formatMonto(agente.recaudoTotal) }}
                        </td>
                        <td class="px-4 py-3 text-sm text-right text-slate-600 dark:text-slate-400">
                          S/ {{ formatMonto(agente.metaIndividual) }}
                        </td>
                        <td class="px-4 py-3 text-sm text-right">
                          <span [class]="agente.metaAlcanzada ? 'text-green-600 font-semibold' : 'text-amber-600'">
                            {{ agente.porcentajeCumplimiento | number:'1.1-1' }}%
                          </span>
                        </td>
                        <td class="px-4 py-3 text-sm text-right text-blue-600">
                          S/ {{ formatMonto(agente.comisionBase) }}
                        </td>
                        <td class="px-4 py-3 text-sm text-right text-amber-600">
                          S/ {{ formatMonto(agente.totalBonos) }}
                          @if (agente.bonosGanados && agente.bonosGanados.length > 0) {
                            <button (click)="toggleDetalleBonos(agente)" class="ml-1 text-slate-400 hover:text-slate-600">
                              <svg class="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                              </svg>
                            </button>
                          }
                        </td>
                        <td class="px-4 py-3 text-sm text-right font-bold text-purple-600">
                          S/ {{ formatMonto(agente.totalComision) }}
                        </td>
                      </tr>
                      <!-- Detalle de bonos expandible -->
                      @if (agenteExpandido() === agente.idAgente && agente.bonosGanados && agente.bonosGanados.length > 0) {
                        <tr class="bg-amber-50 dark:bg-amber-900/10">
                          <td colspan="8" class="px-4 py-2">
                            <div class="text-sm">
                              <span class="font-medium text-amber-700 dark:text-amber-400">Bonos ganados:</span>
                              @for (bono of agente.bonosGanados; track bono.bonoId) {
                                <span class="ml-2 px-2 py-1 bg-amber-100 dark:bg-amber-900/30 rounded text-amber-800 dark:text-amber-300">
                                  {{ bono.nombreBono }}: {{ bono.cantidadPagos }} pagos = S/ {{ bono.montoGanado }}
                                </span>
                              }
                            </div>
                          </td>
                        </tr>
                      }
                    }
                  </tbody>
                </table>
              </div>
            } @else {
              <div class="text-center py-8 text-slate-500 dark:text-slate-400">
                No hay datos para mostrar
              </div>
            }
          } @else {
            <div class="text-center py-12 text-slate-500 dark:text-slate-400">
              <svg class="w-12 h-12 mx-auto mb-4 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              <p>Selecciona un per\xEDodo y haz clic en "Calcular Comisiones"</p>
            </div>
          }
        </div>
      }

      <!-- Mensajes -->
      @if (mensaje()) {
        <div [class]="mensajeError() ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800' : 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'"
             class="fixed bottom-4 right-4 p-4 border rounded-lg shadow-lg max-w-md">
          <p [class]="mensajeError() ? 'text-red-700 dark:text-red-400' : 'text-green-700 dark:text-green-400'">
            {{ mensaje() }}
          </p>
        </div>
      }
    </div>
  `
    }]
  }], () => [{ type: ComisionesService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ComisionesPage, { className: "ComisionesPage", filePath: "src/app/comisiones/pages/comisiones.page.ts", lineNumber: 484 });
})();
export {
  ComisionesPage
};
//# sourceMappingURL=chunk-J6GRPCXG.js.map
