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
  ɵɵpureFunction0,
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
  // ==================== INQUILINOS / CARTERAS / SUBCARTERAS ====================
  /**
   * Obtener inquilinos disponibles
   */
  obtenerInquilinos() {
    return this.http.get(`${this.baseUrl}/inquilinos`);
  }
  /**
   * Obtener carteras de un inquilino
   */
  obtenerCarteras(idInquilino) {
    const params = new HttpParams().set("idInquilino", idInquilino.toString());
    return this.http.get(`${this.baseUrl}/carteras`, { params });
  }
  /**
   * Obtener subcarteras de una cartera
   */
  obtenerSubcarteras(idCartera) {
    const params = new HttpParams().set("idCartera", idCartera.toString());
    return this.http.get(`${this.baseUrl}/subcarteras`, { params });
  }
  /**
   * Obtener jerarquía de una subcartera (inquilino y cartera padre)
   */
  obtenerJerarquiaSubcartera(idSubcartera) {
    return this.http.get(`${this.baseUrl}/subcarteras/${idSubcartera}/jerarquia`);
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
  /**
   * Obtener valores únicos de un campo para el dropdown de bonos
   */
  obtenerValoresCampo(campo) {
    const params = new HttpParams().set("campo", campo);
    return this.http.get(`${this.baseUrl}/bonos/valores-campo`, { params });
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
  // ==================== EXPORTAR ====================
  /**
   * Exportar reporte de comisiones en PDF
   */
  exportarPdf(anio, mes, idSubcartera) {
    let params = new HttpParams().set("anio", anio.toString()).set("mes", mes.toString());
    if (idSubcartera) {
      params = params.set("idSubcartera", idSubcartera.toString());
    }
    return this.http.get(`${this.baseUrl}/exportar-pdf`, {
      params,
      responseType: "blob"
    });
  }
  /**
   * Exportar reporte de comisiones en Excel
   */
  exportarExcel(anio, mes, idSubcartera) {
    let params = new HttpParams().set("anio", anio.toString()).set("mes", mes.toString());
    if (idSubcartera) {
      params = params.set("idSubcartera", idSubcartera.toString());
    }
    return this.http.get(`${this.baseUrl}/exportar-excel`, {
      params,
      responseType: "blob"
    });
  }
  // ==================== BASE DE AJUSTE ====================
  /**
   * Agregar promesas pagadas al envío del período
   */
  agregarEnvioBaseAjuste(anio, mes, idSubcartera) {
    let params = new HttpParams().set("anio", anio.toString()).set("mes", mes.toString());
    if (idSubcartera) {
      params = params.set("idSubcartera", idSubcartera.toString());
    }
    console.log("[COMISIONES] Agregando env\xEDo Base Ajuste:", { anio, mes, idSubcartera });
    return this.http.post(`${this.baseUrl}/base-ajuste/agregar-envio`, null, { params });
  }
  /**
   * Obtener estadísticas de Base de Ajuste
   */
  obtenerEstadisticasBaseAjuste(anio, mes, idSubcartera) {
    let params = new HttpParams().set("anio", anio.toString()).set("mes", mes.toString());
    if (idSubcartera) {
      params = params.set("idSubcartera", idSubcartera.toString());
    }
    return this.http.get(`${this.baseUrl}/base-ajuste/estadisticas`, { params });
  }
  /**
   * Exportar Base de Ajuste en Excel
   */
  exportarBaseAjusteExcel(anio, mes, idSubcartera) {
    let params = new HttpParams().set("anio", anio.toString()).set("mes", mes.toString());
    if (idSubcartera) {
      params = params.set("idSubcartera", idSubcartera.toString());
    }
    return this.http.get(`${this.baseUrl}/base-ajuste/exportar-excel`, {
      params,
      responseType: "blob"
    });
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
var _c0 = () => [];
var _forTrack0 = ($index, $item) => $item.value;
var _forTrack1 = ($index, $item) => $item.id;
var _forTrack2 = ($index, $item) => $item.idAgente;
var _forTrack3 = ($index, $item) => $item.bonoId;
function ComisionesPage_Conditional_25_For_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 17);
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
function ComisionesPage_Conditional_25_For_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 17);
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
function ComisionesPage_Conditional_25_Conditional_18_For_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 17);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const inq_r6 = ctx.$implicit;
    \u0275\u0275property("value", inq_r6.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(inq_r6.nombreInquilino);
  }
}
function ComisionesPage_Conditional_25_Conditional_18_For_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 17);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const car_r7 = ctx.$implicit;
    \u0275\u0275property("value", car_r7.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(car_r7.nombreCartera);
  }
}
function ComisionesPage_Conditional_25_Conditional_18_For_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 17);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const sub_r8 = ctx.$implicit;
    \u0275\u0275property("value", sub_r8.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(sub_r8.nombreSubcartera);
  }
}
function ComisionesPage_Conditional_25_Conditional_18_For_37_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 17);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const tipo_r9 = ctx.$implicit;
    \u0275\u0275property("value", tipo_r9.value);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(tipo_r9.label);
  }
}
function ComisionesPage_Conditional_25_Conditional_18_For_48_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 35)(1, "span", 40);
    \u0275\u0275text(2, "Desde");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "input", 41);
    \u0275\u0275twoWayListener("ngModelChange", function ComisionesPage_Conditional_25_Conditional_18_For_48_Template_input_ngModelChange_3_listener($event) {
      const escala_r11 = \u0275\u0275restoreView(_r10).$implicit;
      \u0275\u0275twoWayBindingSet(escala_r11.porcentajeDesde, $event) || (escala_r11.porcentajeDesde = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 40);
    \u0275\u0275text(5, "% hasta");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "input", 42);
    \u0275\u0275twoWayListener("ngModelChange", function ComisionesPage_Conditional_25_Conditional_18_For_48_Template_input_ngModelChange_6_listener($event) {
      const escala_r11 = \u0275\u0275restoreView(_r10).$implicit;
      \u0275\u0275twoWayBindingSet(escala_r11.porcentajeHasta, $event) || (escala_r11.porcentajeHasta = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "span", 40);
    \u0275\u0275text(8, "% =");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "span", 40);
    \u0275\u0275text(10, "S/");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "input", 43);
    \u0275\u0275twoWayListener("ngModelChange", function ComisionesPage_Conditional_25_Conditional_18_For_48_Template_input_ngModelChange_11_listener($event) {
      const escala_r11 = \u0275\u0275restoreView(_r10).$implicit;
      \u0275\u0275twoWayBindingSet(escala_r11.montoComision, $event) || (escala_r11.montoComision = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "button", 44);
    \u0275\u0275listener("click", function ComisionesPage_Conditional_25_Conditional_18_For_48_Template_button_click_12_listener() {
      const \u0275$index_163_r12 = \u0275\u0275restoreView(_r10).$index;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.eliminarEscalaMeta(\u0275$index_163_r12));
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(13, "svg", 33);
    \u0275\u0275element(14, "path", 45);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const escala_r11 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", escala_r11.porcentajeDesde);
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", escala_r11.porcentajeHasta);
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", escala_r11.montoComision);
  }
}
function ComisionesPage_Conditional_25_Conditional_18_Conditional_49_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 36);
    \u0275\u0275text(1, "No hay escalas configuradas. Agrega al menos una escala.");
    \u0275\u0275elementEnd();
  }
}
function ComisionesPage_Conditional_25_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 20)(1, "h3", 23);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 24)(4, "div")(5, "label", 15);
    \u0275\u0275text(6, "Inquilino");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "select", 25);
    \u0275\u0275twoWayListener("ngModelChange", function ComisionesPage_Conditional_25_Conditional_18_Template_select_ngModelChange_7_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.selectedInquilino, $event) || (ctx_r1.selectedInquilino = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("change", function ComisionesPage_Conditional_25_Conditional_18_Template_select_change_7_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onInquilinoChange());
    });
    \u0275\u0275elementStart(8, "option", 17);
    \u0275\u0275text(9, "Seleccionar...");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(10, ComisionesPage_Conditional_25_Conditional_18_For_11_Template, 2, 2, "option", 17, _forTrack1);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "div")(13, "label", 15);
    \u0275\u0275text(14, "Cartera");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "select", 26);
    \u0275\u0275twoWayListener("ngModelChange", function ComisionesPage_Conditional_25_Conditional_18_Template_select_ngModelChange_15_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.selectedCartera, $event) || (ctx_r1.selectedCartera = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("change", function ComisionesPage_Conditional_25_Conditional_18_Template_select_change_15_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onCarteraChange());
    });
    \u0275\u0275elementStart(16, "option", 17);
    \u0275\u0275text(17, "Seleccionar...");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(18, ComisionesPage_Conditional_25_Conditional_18_For_19_Template, 2, 2, "option", 17, _forTrack1);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(20, "div")(21, "label", 15);
    \u0275\u0275text(22, "Subcartera");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "select", 26);
    \u0275\u0275twoWayListener("ngModelChange", function ComisionesPage_Conditional_25_Conditional_18_Template_select_ngModelChange_23_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.metaEditando().idSubcartera, $event) || (ctx_r1.metaEditando().idSubcartera = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("change", function ComisionesPage_Conditional_25_Conditional_18_Template_select_change_23_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onSubcarteraChange());
    });
    \u0275\u0275elementStart(24, "option", 17);
    \u0275\u0275text(25, "Seleccionar...");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(26, ComisionesPage_Conditional_25_Conditional_18_For_27_Template, 2, 2, "option", 17, _forTrack1);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(28, "div")(29, "label", 15);
    \u0275\u0275text(30, "Meta Grupal (S/)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "input", 27);
    \u0275\u0275twoWayListener("ngModelChange", function ComisionesPage_Conditional_25_Conditional_18_Template_input_ngModelChange_31_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.metaEditando().metaGrupal, $event) || (ctx_r1.metaEditando().metaGrupal = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(32, "div")(33, "label", 15);
    \u0275\u0275text(34, "Tipo de Metrica");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(35, "select", 28);
    \u0275\u0275twoWayListener("ngModelChange", function ComisionesPage_Conditional_25_Conditional_18_Template_select_ngModelChange_35_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.metaEditando().tipoMetrica, $event) || (ctx_r1.metaEditando().tipoMetrica = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275repeaterCreate(36, ComisionesPage_Conditional_25_Conditional_18_For_37_Template, 2, 2, "option", 17, _forTrack0);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(38, "div", 29)(39, "div", 30)(40, "label", 31);
    \u0275\u0275text(41, " Escalas de Comisi\xF3n (por % de cumplimiento) ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(42, "button", 32);
    \u0275\u0275listener("click", function ComisionesPage_Conditional_25_Conditional_18_Template_button_click_42_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.agregarEscalaMeta());
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(43, "svg", 33);
    \u0275\u0275element(44, "path", 19);
    \u0275\u0275elementEnd();
    \u0275\u0275text(45, " Agregar escala ");
    \u0275\u0275elementEnd()();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(46, "div", 34);
    \u0275\u0275repeaterCreate(47, ComisionesPage_Conditional_25_Conditional_18_For_48_Template, 15, 3, "div", 35, \u0275\u0275repeaterTrackByIndex);
    \u0275\u0275conditionalCreate(49, ComisionesPage_Conditional_25_Conditional_18_Conditional_49_Template, 2, 0, "p", 36);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(50, "div", 37)(51, "button", 38);
    \u0275\u0275listener("click", function ComisionesPage_Conditional_25_Conditional_18_Template_button_click_51_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.guardarMeta());
    });
    \u0275\u0275text(52);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(53, "button", 39);
    \u0275\u0275listener("click", function ComisionesPage_Conditional_25_Conditional_18_Template_button_click_53_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.cancelarMeta());
    });
    \u0275\u0275text(54, " Cancelar ");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    let tmp_2_0;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ((tmp_2_0 = ctx_r1.metaEditando()) == null ? null : tmp_2_0.id) ? "Editar Meta" : "Nueva Meta", " ");
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.selectedInquilino);
    \u0275\u0275advance();
    \u0275\u0275property("value", 0);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r1.inquilinos());
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.selectedCartera);
    \u0275\u0275property("disabled", !ctx_r1.selectedInquilino);
    \u0275\u0275advance();
    \u0275\u0275property("value", 0);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r1.carteras());
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.metaEditando().idSubcartera);
    \u0275\u0275property("disabled", !ctx_r1.selectedCartera);
    \u0275\u0275advance();
    \u0275\u0275property("value", 0);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r1.subcarteras());
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.metaEditando().metaGrupal);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.metaEditando().tipoMetrica);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.tiposMetrica);
    \u0275\u0275advance(11);
    \u0275\u0275repeater(ctx_r1.metaEditando().escalas);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.metaEditando().escalas.length === 0 ? 49 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r1.isLoading());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.isLoading() ? "Guardando..." : "Guardar", " ");
  }
}
function ComisionesPage_Conditional_25_Conditional_19_For_18_For_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 58);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const escala_r14 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate3(" ", escala_r14.porcentajeDesde, "-", escala_r14.porcentajeHasta || "100+", "% = S/", escala_r14.montoComision, " ");
  }
}
function ComisionesPage_Conditional_25_Conditional_19_For_18_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 59);
    \u0275\u0275text(1, "Sin escalas");
    \u0275\u0275elementEnd();
  }
}
function ComisionesPage_Conditional_25_Conditional_19_For_18_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr", 52)(1, "td", 53);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td", 54);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td", 55)(6, "span");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "td", 56)(9, "div", 57);
    \u0275\u0275repeaterCreate(10, ComisionesPage_Conditional_25_Conditional_19_For_18_For_11_Template, 2, 3, "span", 58, _forTrack1);
    \u0275\u0275conditionalCreate(12, ComisionesPage_Conditional_25_Conditional_19_For_18_Conditional_12_Template, 2, 0, "span", 59);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "td", 60)(14, "span", 61);
    \u0275\u0275text(15);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "td", 60)(17, "button", 62);
    \u0275\u0275listener("click", function ComisionesPage_Conditional_25_Conditional_19_For_18_Template_button_click_17_listener() {
      const meta_r15 = \u0275\u0275restoreView(_r13).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.editarMeta(meta_r15));
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(18, "svg", 63);
    \u0275\u0275element(19, "path", 64);
    \u0275\u0275elementEnd()();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(20, "button", 65);
    \u0275\u0275listener("click", function ComisionesPage_Conditional_25_Conditional_19_For_18_Template_button_click_20_listener() {
      const meta_r15 = \u0275\u0275restoreView(_r13).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.eliminarMeta(meta_r15));
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(21, "svg", 63);
    \u0275\u0275element(22, "path", 66);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const meta_r15 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", meta_r15.nombreSubcartera || "Subcartera " + meta_r15.idSubcartera, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" S/ ", ctx_r1.formatMonto(meta_r15.metaGrupal), " ");
    \u0275\u0275advance(2);
    \u0275\u0275classMap(meta_r15.tipoMetrica === "CAPITAL_LIBERADO" ? "px-2 py-1 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 rounded-full text-xs font-medium" : "px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-full text-xs font-medium");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", meta_r15.tipoMetrica === "CAPITAL_LIBERADO" ? "Capital" : "Recaudo", " ");
    \u0275\u0275advance(3);
    \u0275\u0275repeater(meta_r15.escalas || \u0275\u0275pureFunction0(9, _c0));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(!meta_r15.escalas || meta_r15.escalas.length === 0 ? 12 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275classMap(meta_r15.activo ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-400");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", meta_r15.activo ? "Activo" : "Inactivo", " ");
  }
}
function ComisionesPage_Conditional_25_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 21)(1, "table", 46)(2, "thead", 47)(3, "tr")(4, "th", 48);
    \u0275\u0275text(5, "Subcartera");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th", 49);
    \u0275\u0275text(7, "Meta Grupal");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th", 50);
    \u0275\u0275text(9, "Tipo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th", 48);
    \u0275\u0275text(11, "Escalas de Comisi\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th", 50);
    \u0275\u0275text(13, "Estado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "th", 50);
    \u0275\u0275text(15, "Acciones");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(16, "tbody", 51);
    \u0275\u0275repeaterCreate(17, ComisionesPage_Conditional_25_Conditional_19_For_18_Template, 23, 10, "tr", 52, _forTrack1);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(17);
    \u0275\u0275repeater(ctx_r1.metas());
  }
}
function ComisionesPage_Conditional_25_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 22);
    \u0275\u0275text(1, " No hay metas configuradas para este per\xEDodo ");
    \u0275\u0275elementEnd();
  }
}
function ComisionesPage_Conditional_25_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 12)(1, "div", 14)(2, "div")(3, "label", 15);
    \u0275\u0275text(4, "A\xF1o");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "select", 16);
    \u0275\u0275twoWayListener("ngModelChange", function ComisionesPage_Conditional_25_Template_select_ngModelChange_5_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.filtroAnio, $event) || (ctx_r1.filtroAnio = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("change", function ComisionesPage_Conditional_25_Template_select_change_5_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.cargarMetas());
    });
    \u0275\u0275repeaterCreate(6, ComisionesPage_Conditional_25_For_7_Template, 2, 2, "option", 17, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "div")(9, "label", 15);
    \u0275\u0275text(10, "Mes");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "select", 16);
    \u0275\u0275twoWayListener("ngModelChange", function ComisionesPage_Conditional_25_Template_select_ngModelChange_11_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.filtroMes, $event) || (ctx_r1.filtroMes = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("change", function ComisionesPage_Conditional_25_Template_select_change_11_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.cargarMetas());
    });
    \u0275\u0275repeaterCreate(12, ComisionesPage_Conditional_25_For_13_Template, 2, 2, "option", 17, _forTrack0);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "button", 18);
    \u0275\u0275listener("click", function ComisionesPage_Conditional_25_Template_button_click_14_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.nuevaMeta());
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(15, "svg", 7);
    \u0275\u0275element(16, "path", 19);
    \u0275\u0275elementEnd();
    \u0275\u0275text(17, " Nueva Meta ");
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(18, ComisionesPage_Conditional_25_Conditional_18_Template, 55, 14, "div", 20);
    \u0275\u0275conditionalCreate(19, ComisionesPage_Conditional_25_Conditional_19_Template, 19, 0, "div", 21)(20, ComisionesPage_Conditional_25_Conditional_20_Template, 2, 0, "div", 22);
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
function ComisionesPage_Conditional_26_Conditional_8_For_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 17);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const inq_r18 = ctx.$implicit;
    \u0275\u0275property("value", inq_r18.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(inq_r18.nombreInquilino);
  }
}
function ComisionesPage_Conditional_26_Conditional_8_For_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 17);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const car_r19 = ctx.$implicit;
    \u0275\u0275property("value", car_r19.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(car_r19.nombreCartera);
  }
}
function ComisionesPage_Conditional_26_Conditional_8_For_35_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 17);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const sub_r20 = ctx.$implicit;
    \u0275\u0275property("value", sub_r20.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(sub_r20.nombreSubcartera);
  }
}
function ComisionesPage_Conditional_26_Conditional_8_For_43_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 17);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const campo_r21 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275property("value", campo_r21);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.comisionesService.getNombreCampo(campo_r21));
  }
}
function ComisionesPage_Conditional_26_Conditional_8_Conditional_48_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 75);
    \u0275\u0275text(1, "Cargando valores...");
    \u0275\u0275elementEnd();
  }
}
function ComisionesPage_Conditional_26_Conditional_8_Conditional_49_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 75);
    \u0275\u0275text(1, "Primero seleccione un campo");
    \u0275\u0275elementEnd();
  }
}
function ComisionesPage_Conditional_26_Conditional_8_Conditional_50_For_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 17);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const valor_r22 = ctx.$implicit;
    \u0275\u0275property("value", valor_r22);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(valor_r22);
  }
}
function ComisionesPage_Conditional_26_Conditional_8_Conditional_50_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 75);
    \u0275\u0275text(1, "Seleccionar valor...");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(2, ComisionesPage_Conditional_26_Conditional_8_Conditional_50_For_3_Template, 2, 2, "option", 17, \u0275\u0275repeaterTrackByIdentity);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r1.valoresCampo());
  }
}
function ComisionesPage_Conditional_26_Conditional_8_For_61_Template(rf, ctx) {
  if (rf & 1) {
    const _r23 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 78)(1, "input", 80);
    \u0275\u0275twoWayListener("ngModelChange", function ComisionesPage_Conditional_26_Conditional_8_For_61_Template_input_ngModelChange_1_listener($event) {
      const escala_r24 = \u0275\u0275restoreView(_r23).$implicit;
      \u0275\u0275twoWayBindingSet(escala_r24.cantidadMinima, $event) || (escala_r24.cantidadMinima = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "span", 81);
    \u0275\u0275text(3, "pagos =");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "input", 82);
    \u0275\u0275twoWayListener("ngModelChange", function ComisionesPage_Conditional_26_Conditional_8_For_61_Template_input_ngModelChange_4_listener($event) {
      const escala_r24 = \u0275\u0275restoreView(_r23).$implicit;
      \u0275\u0275twoWayBindingSet(escala_r24.monto, $event) || (escala_r24.monto = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 81);
    \u0275\u0275text(6, "S/");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "button", 83);
    \u0275\u0275listener("click", function ComisionesPage_Conditional_26_Conditional_8_For_61_Template_button_click_7_listener() {
      const \u0275$index_412_r25 = \u0275\u0275restoreView(_r23).$index;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.eliminarEscala(\u0275$index_412_r25));
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(8, "svg", 7);
    \u0275\u0275element(9, "path", 45);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const escala_r24 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("ngModel", escala_r24.cantidadMinima);
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", escala_r24.monto);
  }
}
function ComisionesPage_Conditional_26_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r17 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 70)(1, "h3", 23);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 72)(4, "div")(5, "label", 15);
    \u0275\u0275text(6, "Nombre del Bono");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "input", 73);
    \u0275\u0275twoWayListener("ngModelChange", function ComisionesPage_Conditional_26_Conditional_8_Template_input_ngModelChange_7_listener($event) {
      \u0275\u0275restoreView(_r17);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.bonoEditando().nombre, $event) || (ctx_r1.bonoEditando().nombre = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "div")(9, "label", 15);
    \u0275\u0275text(10, "Descripci\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "input", 74);
    \u0275\u0275twoWayListener("ngModelChange", function ComisionesPage_Conditional_26_Conditional_8_Template_input_ngModelChange_11_listener($event) {
      \u0275\u0275restoreView(_r17);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.bonoEditando().descripcion, $event) || (ctx_r1.bonoEditando().descripcion = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "div")(13, "label", 15);
    \u0275\u0275text(14, "Inquilino");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "select", 25);
    \u0275\u0275twoWayListener("ngModelChange", function ComisionesPage_Conditional_26_Conditional_8_Template_select_ngModelChange_15_listener($event) {
      \u0275\u0275restoreView(_r17);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.bonoSelectedInquilino, $event) || (ctx_r1.bonoSelectedInquilino = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("change", function ComisionesPage_Conditional_26_Conditional_8_Template_select_change_15_listener() {
      \u0275\u0275restoreView(_r17);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onBonoInquilinoChange());
    });
    \u0275\u0275elementStart(16, "option", 17);
    \u0275\u0275text(17, "Todos (aplica a todas)");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(18, ComisionesPage_Conditional_26_Conditional_8_For_19_Template, 2, 2, "option", 17, _forTrack1);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(20, "div")(21, "label", 15);
    \u0275\u0275text(22, "Cartera");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "select", 26);
    \u0275\u0275twoWayListener("ngModelChange", function ComisionesPage_Conditional_26_Conditional_8_Template_select_ngModelChange_23_listener($event) {
      \u0275\u0275restoreView(_r17);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.bonoSelectedCartera, $event) || (ctx_r1.bonoSelectedCartera = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("change", function ComisionesPage_Conditional_26_Conditional_8_Template_select_change_23_listener() {
      \u0275\u0275restoreView(_r17);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onBonoCarteraChange());
    });
    \u0275\u0275elementStart(24, "option", 17);
    \u0275\u0275text(25, "Seleccionar...");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(26, ComisionesPage_Conditional_26_Conditional_8_For_27_Template, 2, 2, "option", 17, _forTrack1);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(28, "div")(29, "label", 15);
    \u0275\u0275text(30, "Subcartera");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "select", 26);
    \u0275\u0275twoWayListener("ngModelChange", function ComisionesPage_Conditional_26_Conditional_8_Template_select_ngModelChange_31_listener($event) {
      \u0275\u0275restoreView(_r17);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.bonoEditando().idSubcartera, $event) || (ctx_r1.bonoEditando().idSubcartera = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("change", function ComisionesPage_Conditional_26_Conditional_8_Template_select_change_31_listener() {
      \u0275\u0275restoreView(_r17);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onBonoSubcarteraChange());
    });
    \u0275\u0275elementStart(32, "option", 17);
    \u0275\u0275text(33, "Todas (aplica a todas)");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(34, ComisionesPage_Conditional_26_Conditional_8_For_35_Template, 2, 2, "option", 17, _forTrack1);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(36, "div")(37, "label", 15);
    \u0275\u0275text(38, "Campo a Evaluar");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(39, "select", 25);
    \u0275\u0275twoWayListener("ngModelChange", function ComisionesPage_Conditional_26_Conditional_8_Template_select_ngModelChange_39_listener($event) {
      \u0275\u0275restoreView(_r17);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.bonoEditando().campoEvaluar, $event) || (ctx_r1.bonoEditando().campoEvaluar = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("change", function ComisionesPage_Conditional_26_Conditional_8_Template_select_change_39_listener() {
      \u0275\u0275restoreView(_r17);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onCampoEvaluarChange());
    });
    \u0275\u0275elementStart(40, "option", 75);
    \u0275\u0275text(41, "Seleccionar campo...");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(42, ComisionesPage_Conditional_26_Conditional_8_For_43_Template, 2, 2, "option", 17, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(44, "div")(45, "label", 15);
    \u0275\u0275text(46, "Valor a Buscar");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(47, "select", 76);
    \u0275\u0275twoWayListener("ngModelChange", function ComisionesPage_Conditional_26_Conditional_8_Template_select_ngModelChange_47_listener($event) {
      \u0275\u0275restoreView(_r17);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.bonoEditando().valorBuscar, $event) || (ctx_r1.bonoEditando().valorBuscar = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275conditionalCreate(48, ComisionesPage_Conditional_26_Conditional_8_Conditional_48_Template, 2, 0, "option", 75)(49, ComisionesPage_Conditional_26_Conditional_8_Conditional_49_Template, 2, 0, "option", 75)(50, ComisionesPage_Conditional_26_Conditional_8_Conditional_50_Template, 4, 0);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(51, "div", 29)(52, "div", 30)(53, "label", 31);
    \u0275\u0275text(54, "Escalas");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(55, "button", 77);
    \u0275\u0275listener("click", function ComisionesPage_Conditional_26_Conditional_8_Template_button_click_55_listener() {
      \u0275\u0275restoreView(_r17);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.agregarEscala());
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(56, "svg", 33);
    \u0275\u0275element(57, "path", 19);
    \u0275\u0275elementEnd();
    \u0275\u0275text(58, " Agregar escala ");
    \u0275\u0275elementEnd()();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(59, "div", 34);
    \u0275\u0275repeaterCreate(60, ComisionesPage_Conditional_26_Conditional_8_For_61_Template, 10, 2, "div", 78, \u0275\u0275repeaterTrackByIndex);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(62, "div", 37)(63, "button", 79);
    \u0275\u0275listener("click", function ComisionesPage_Conditional_26_Conditional_8_Template_button_click_63_listener() {
      \u0275\u0275restoreView(_r17);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.guardarBono());
    });
    \u0275\u0275text(64);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(65, "button", 39);
    \u0275\u0275listener("click", function ComisionesPage_Conditional_26_Conditional_8_Template_button_click_65_listener() {
      \u0275\u0275restoreView(_r17);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.cancelarBono());
    });
    \u0275\u0275text(66, " Cancelar ");
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
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.bonoSelectedInquilino);
    \u0275\u0275advance();
    \u0275\u0275property("value", 0);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r1.inquilinos());
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.bonoSelectedCartera);
    \u0275\u0275property("disabled", !ctx_r1.bonoSelectedInquilino);
    \u0275\u0275advance();
    \u0275\u0275property("value", 0);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r1.bonoCarteras());
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.bonoEditando().idSubcartera);
    \u0275\u0275property("disabled", !ctx_r1.bonoSelectedCartera);
    \u0275\u0275advance();
    \u0275\u0275property("value", 0);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r1.bonoSubcarteras());
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.bonoEditando().campoEvaluar);
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r1.camposDisponibles());
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.bonoEditando().valorBuscar);
    \u0275\u0275property("disabled", !ctx_r1.bonoEditando().campoEvaluar || ctx_r1.cargandoValores());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.cargandoValores() ? 48 : !ctx_r1.bonoEditando().campoEvaluar ? 49 : 50);
    \u0275\u0275advance(12);
    \u0275\u0275repeater(ctx_r1.bonoEditando().escalas);
    \u0275\u0275advance(3);
    \u0275\u0275property("disabled", ctx_r1.isLoading());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.isLoading() ? "Guardando..." : "Guardar", " ");
  }
}
function ComisionesPage_Conditional_26_Conditional_9_For_2_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 88);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const bono_r27 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", bono_r27.nombreSubcartera, " ");
  }
}
function ComisionesPage_Conditional_26_Conditional_9_For_2_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 89);
    \u0275\u0275text(1, " Todas las subcarteras ");
    \u0275\u0275elementEnd();
  }
}
function ComisionesPage_Conditional_26_Conditional_9_For_2_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 91);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const bono_r27 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(bono_r27.descripcion);
  }
}
function ComisionesPage_Conditional_26_Conditional_9_For_2_Conditional_20_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 95);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const escala_r28 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2(" ", escala_r28.cantidadMinima, "+ pagos = S/ ", escala_r28.monto, " ");
  }
}
function ComisionesPage_Conditional_26_Conditional_9_For_2_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 94);
    \u0275\u0275repeaterCreate(1, ComisionesPage_Conditional_26_Conditional_9_For_2_Conditional_20_For_2_Template, 2, 2, "span", 95, _forTrack1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const bono_r27 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275repeater(bono_r27.escalas);
  }
}
function ComisionesPage_Conditional_26_Conditional_9_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r26 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 84)(1, "div", 85)(2, "div")(3, "div", 86)(4, "h4", 87);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(6, ComisionesPage_Conditional_26_Conditional_9_For_2_Conditional_6_Template, 2, 1, "span", 88)(7, ComisionesPage_Conditional_26_Conditional_9_For_2_Conditional_7_Template, 2, 0, "span", 89);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "p", 90);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(10, ComisionesPage_Conditional_26_Conditional_9_For_2_Conditional_10_Template, 2, 1, "p", 91);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "div", 86)(12, "span", 61);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "button", 92);
    \u0275\u0275listener("click", function ComisionesPage_Conditional_26_Conditional_9_For_2_Template_button_click_14_listener() {
      const bono_r27 = \u0275\u0275restoreView(_r26).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.editarBono(bono_r27));
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(15, "svg", 7);
    \u0275\u0275element(16, "path", 64);
    \u0275\u0275elementEnd()();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(17, "button", 93);
    \u0275\u0275listener("click", function ComisionesPage_Conditional_26_Conditional_9_For_2_Template_button_click_17_listener() {
      const bono_r27 = \u0275\u0275restoreView(_r26).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.eliminarBono(bono_r27));
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(18, "svg", 7);
    \u0275\u0275element(19, "path", 66);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275conditionalCreate(20, ComisionesPage_Conditional_26_Conditional_9_For_2_Conditional_20_Template, 3, 0, "div", 94);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const bono_r27 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(bono_r27.nombre);
    \u0275\u0275advance();
    \u0275\u0275conditional(bono_r27.nombreSubcartera ? 6 : 7);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2(" ", ctx_r1.comisionesService.getNombreCampo(bono_r27.campoEvaluar), ' = "', bono_r27.valorBuscar, '" ');
    \u0275\u0275advance();
    \u0275\u0275conditional(bono_r27.descripcion ? 10 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275classMap(bono_r27.activo ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-400");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", bono_r27.activo ? "Activo" : "Inactivo", " ");
    \u0275\u0275advance(7);
    \u0275\u0275conditional(bono_r27.escalas && bono_r27.escalas.length > 0 ? 20 : -1);
  }
}
function ComisionesPage_Conditional_26_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 71);
    \u0275\u0275repeaterCreate(1, ComisionesPage_Conditional_26_Conditional_9_For_2_Template, 21, 9, "div", 84, _forTrack1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.bonos());
  }
}
function ComisionesPage_Conditional_26_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 22);
    \u0275\u0275text(1, " No hay bonos configurados ");
    \u0275\u0275elementEnd();
  }
}
function ComisionesPage_Conditional_26_Template(rf, ctx) {
  if (rf & 1) {
    const _r16 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 12)(1, "div", 67)(2, "h2", 68);
    \u0275\u0275text(3, "Configuraci\xF3n de Bonos");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "button", 69);
    \u0275\u0275listener("click", function ComisionesPage_Conditional_26_Template_button_click_4_listener() {
      \u0275\u0275restoreView(_r16);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.nuevoBono());
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(5, "svg", 7);
    \u0275\u0275element(6, "path", 19);
    \u0275\u0275elementEnd();
    \u0275\u0275text(7, " Nuevo Bono ");
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(8, ComisionesPage_Conditional_26_Conditional_8_Template, 67, 17, "div", 70);
    \u0275\u0275conditionalCreate(9, ComisionesPage_Conditional_26_Conditional_9_Template, 3, 0, "div", 71)(10, ComisionesPage_Conditional_26_Conditional_10_Template, 2, 0, "div", 22);
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
function ComisionesPage_Conditional_27_For_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 17);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const a_r30 = ctx.$implicit;
    \u0275\u0275property("value", a_r30);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(a_r30);
  }
}
function ComisionesPage_Conditional_27_For_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 17);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const m_r31 = ctx.$implicit;
    \u0275\u0275property("value", m_r31.value);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(m_r31.label);
  }
}
function ComisionesPage_Conditional_27_For_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 17);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const inq_r32 = ctx.$implicit;
    \u0275\u0275property("value", inq_r32.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(inq_r32.nombreInquilino);
  }
}
function ComisionesPage_Conditional_27_For_29_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 17);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const car_r33 = ctx.$implicit;
    \u0275\u0275property("value", car_r33.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(car_r33.nombreCartera);
  }
}
function ComisionesPage_Conditional_27_For_37_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 17);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const sub_r34 = ctx.$implicit;
    \u0275\u0275property("value", sub_r34.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(sub_r34.nombreSubcartera);
  }
}
function ComisionesPage_Conditional_27_Conditional_39_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(0, "svg", 101);
    \u0275\u0275element(1, "circle", 102)(2, "path", 103);
    \u0275\u0275elementEnd();
    \u0275\u0275text(3, " Calculando... ");
  }
}
function ComisionesPage_Conditional_27_Conditional_40_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(0, "svg", 7);
    \u0275\u0275element(1, "path", 104);
    \u0275\u0275elementEnd();
    \u0275\u0275text(2, " Calcular Comisiones ");
  }
}
function ComisionesPage_Conditional_27_Conditional_41_Conditional_30_For_22_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    const _r36 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 131);
    \u0275\u0275listener("click", function ComisionesPage_Conditional_27_Conditional_41_Conditional_30_For_22_Conditional_17_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r36);
      const agente_r37 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.toggleDetalleBonos(agente_r37));
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(1, "svg", 132);
    \u0275\u0275element(2, "path", 133);
    \u0275\u0275elementEnd()();
  }
}
function ComisionesPage_Conditional_27_Conditional_41_Conditional_30_For_22_Conditional_20_For_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 137);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const bono_r38 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate3(" ", bono_r38.nombreBono, ": ", bono_r38.cantidadPagos, " pagos = S/ ", bono_r38.montoGanado, " ");
  }
}
function ComisionesPage_Conditional_27_Conditional_41_Conditional_30_For_22_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr", 130)(1, "td", 134)(2, "div", 135)(3, "span", 136);
    \u0275\u0275text(4, "Bonos ganados:");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(5, ComisionesPage_Conditional_27_Conditional_41_Conditional_30_For_22_Conditional_20_For_6_Template, 2, 3, "span", 137, _forTrack3);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const agente_r37 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(5);
    \u0275\u0275repeater(agente_r37.bonosGanados);
  }
}
function ComisionesPage_Conditional_27_Conditional_41_Conditional_30_For_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr", 52)(1, "td", 122);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td", 123);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td", 54);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "td", 124);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "td", 125)(10, "span");
    \u0275\u0275text(11);
    \u0275\u0275pipe(12, "number");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "td", 126);
    \u0275\u0275text(14);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "td", 127);
    \u0275\u0275text(16);
    \u0275\u0275conditionalCreate(17, ComisionesPage_Conditional_27_Conditional_41_Conditional_30_For_22_Conditional_17_Template, 3, 0, "button", 128);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "td", 129);
    \u0275\u0275text(19);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(20, ComisionesPage_Conditional_27_Conditional_41_Conditional_30_For_22_Conditional_20_Template, 7, 0, "tr", 130);
  }
  if (rf & 2) {
    const agente_r37 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", agente_r37.nombreAgente || "Agente " + agente_r37.idAgente, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", agente_r37.nombreSubcartera, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" S/ ", ctx_r1.formatMonto(agente_r37.recaudoTotal), " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" S/ ", ctx_r1.formatMonto(agente_r37.metaIndividual), " ");
    \u0275\u0275advance(2);
    \u0275\u0275classMap(agente_r37.metaAlcanzada ? "text-green-600 font-semibold" : "text-amber-600");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind2(12, 12, agente_r37.porcentajeCumplimiento, "1.1-1"), "% ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" S/ ", ctx_r1.formatMonto(agente_r37.comisionBase), " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" S/ ", ctx_r1.formatMonto(agente_r37.totalBonos), " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(agente_r37.bonosGanados && agente_r37.bonosGanados.length > 0 ? 17 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" S/ ", ctx_r1.formatMonto(agente_r37.totalComision), " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.agenteExpandido() === agente_r37.idAgente && agente_r37.bonosGanados && agente_r37.bonosGanados.length > 0 ? 20 : -1);
  }
}
function ComisionesPage_Conditional_27_Conditional_41_Conditional_30_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 21)(1, "table", 46)(2, "thead", 47)(3, "tr")(4, "th", 48);
    \u0275\u0275text(5, "Agente");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th", 48);
    \u0275\u0275text(7, "Subcartera");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th", 49);
    \u0275\u0275text(9, "Recaudo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th", 49);
    \u0275\u0275text(11, "Meta");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th", 49);
    \u0275\u0275text(13, "% Cumpl.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "th", 49);
    \u0275\u0275text(15, "Comisi\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "th", 49);
    \u0275\u0275text(17, "Bonos");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "th", 49);
    \u0275\u0275text(19, "Total");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(20, "tbody", 51);
    \u0275\u0275repeaterCreate(21, ComisionesPage_Conditional_27_Conditional_41_Conditional_30_For_22_Template, 21, 15, null, null, _forTrack2);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(21);
    \u0275\u0275repeater(ctx_r1.reporte().agentes);
  }
}
function ComisionesPage_Conditional_27_Conditional_41_Conditional_31_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 22);
    \u0275\u0275text(1, " No hay datos para mostrar ");
    \u0275\u0275elementEnd();
  }
}
function ComisionesPage_Conditional_27_Conditional_41_Template(rf, ctx) {
  if (rf & 1) {
    const _r35 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 105)(1, "div", 106)(2, "p", 107);
    \u0275\u0275text(3, "Total Recaudo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p", 108);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 109)(7, "p", 110);
    \u0275\u0275text(8, "Total Comisiones");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "p", 111);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "div", 112)(12, "p", 113);
    \u0275\u0275text(13, "Total Bonos");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "p", 114);
    \u0275\u0275text(15);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "div", 115)(17, "p", 116);
    \u0275\u0275text(18, "Agentes");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "p", 117);
    \u0275\u0275text(20);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(21, "div", 118)(22, "button", 69);
    \u0275\u0275listener("click", function ComisionesPage_Conditional_27_Conditional_41_Template_button_click_22_listener() {
      \u0275\u0275restoreView(_r35);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.exportarExcel());
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(23, "svg", 7);
    \u0275\u0275element(24, "path", 119);
    \u0275\u0275elementEnd();
    \u0275\u0275text(25, " Exportar Excel ");
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(26, "button", 120);
    \u0275\u0275listener("click", function ComisionesPage_Conditional_27_Conditional_41_Template_button_click_26_listener() {
      \u0275\u0275restoreView(_r35);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.exportarPdf());
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(27, "svg", 7);
    \u0275\u0275element(28, "path", 121);
    \u0275\u0275elementEnd();
    \u0275\u0275text(29, " Exportar PDF ");
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(30, ComisionesPage_Conditional_27_Conditional_41_Conditional_30_Template, 23, 0, "div", 21)(31, ComisionesPage_Conditional_27_Conditional_41_Conditional_31_Template, 2, 0, "div", 22);
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
    \u0275\u0275advance(10);
    \u0275\u0275conditional(ctx_r1.reporte().agentes && ctx_r1.reporte().agentes.length > 0 ? 30 : 31);
  }
}
function ComisionesPage_Conditional_27_Conditional_42_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 100);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(1, "svg", 138);
    \u0275\u0275element(2, "path", 10);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(3, "p");
    \u0275\u0275text(4, 'Selecciona un per\xEDodo y haz clic en "Calcular Comisiones"');
    \u0275\u0275elementEnd()();
  }
}
function ComisionesPage_Conditional_27_Template(rf, ctx) {
  if (rf & 1) {
    const _r29 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 12)(1, "div", 14)(2, "div")(3, "label", 15);
    \u0275\u0275text(4, "A\xF1o");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "select", 96);
    \u0275\u0275twoWayListener("ngModelChange", function ComisionesPage_Conditional_27_Template_select_ngModelChange_5_listener($event) {
      \u0275\u0275restoreView(_r29);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.filtroAnio, $event) || (ctx_r1.filtroAnio = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275repeaterCreate(6, ComisionesPage_Conditional_27_For_7_Template, 2, 2, "option", 17, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "div")(9, "label", 15);
    \u0275\u0275text(10, "Mes");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "select", 96);
    \u0275\u0275twoWayListener("ngModelChange", function ComisionesPage_Conditional_27_Template_select_ngModelChange_11_listener($event) {
      \u0275\u0275restoreView(_r29);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.filtroMes, $event) || (ctx_r1.filtroMes = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275repeaterCreate(12, ComisionesPage_Conditional_27_For_13_Template, 2, 2, "option", 17, _forTrack0);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "div")(15, "label", 15);
    \u0275\u0275text(16, "Inquilino");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "select", 16);
    \u0275\u0275twoWayListener("ngModelChange", function ComisionesPage_Conditional_27_Template_select_ngModelChange_17_listener($event) {
      \u0275\u0275restoreView(_r29);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.reporteInquilino, $event) || (ctx_r1.reporteInquilino = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("change", function ComisionesPage_Conditional_27_Template_select_change_17_listener() {
      \u0275\u0275restoreView(_r29);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onReporteInquilinoChange());
    });
    \u0275\u0275elementStart(18, "option", 17);
    \u0275\u0275text(19, "Todos");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(20, ComisionesPage_Conditional_27_For_21_Template, 2, 2, "option", 17, _forTrack1);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(22, "div")(23, "label", 15);
    \u0275\u0275text(24, "Cartera");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "select", 97);
    \u0275\u0275twoWayListener("ngModelChange", function ComisionesPage_Conditional_27_Template_select_ngModelChange_25_listener($event) {
      \u0275\u0275restoreView(_r29);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.reporteCartera, $event) || (ctx_r1.reporteCartera = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("change", function ComisionesPage_Conditional_27_Template_select_change_25_listener() {
      \u0275\u0275restoreView(_r29);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onReporteCarteraChange());
    });
    \u0275\u0275elementStart(26, "option", 17);
    \u0275\u0275text(27, "Todas");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(28, ComisionesPage_Conditional_27_For_29_Template, 2, 2, "option", 17, _forTrack1);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(30, "div")(31, "label", 15);
    \u0275\u0275text(32, "Subcartera");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "select", 98);
    \u0275\u0275twoWayListener("ngModelChange", function ComisionesPage_Conditional_27_Template_select_ngModelChange_33_listener($event) {
      \u0275\u0275restoreView(_r29);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.reporteSubcartera, $event) || (ctx_r1.reporteSubcartera = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(34, "option", 17);
    \u0275\u0275text(35, "Todas");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(36, ComisionesPage_Conditional_27_For_37_Template, 2, 2, "option", 17, _forTrack1);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(38, "button", 99);
    \u0275\u0275listener("click", function ComisionesPage_Conditional_27_Template_button_click_38_listener() {
      \u0275\u0275restoreView(_r29);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.calcularComisiones());
    });
    \u0275\u0275conditionalCreate(39, ComisionesPage_Conditional_27_Conditional_39_Template, 4, 0)(40, ComisionesPage_Conditional_27_Conditional_40_Template, 3, 0);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(41, ComisionesPage_Conditional_27_Conditional_41_Template, 32, 5)(42, ComisionesPage_Conditional_27_Conditional_42_Template, 5, 0, "div", 100);
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
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.reporteInquilino);
    \u0275\u0275advance();
    \u0275\u0275property("value", 0);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r1.inquilinos());
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.reporteCartera);
    \u0275\u0275property("disabled", !ctx_r1.reporteInquilino);
    \u0275\u0275advance();
    \u0275\u0275property("value", 0);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r1.reporteCarteras());
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.reporteSubcartera);
    \u0275\u0275property("disabled", !ctx_r1.reporteCartera);
    \u0275\u0275advance();
    \u0275\u0275property("value", 0);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r1.reporteSubcarteras());
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r1.isLoading());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.isLoading() ? 39 : 40);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.reporte() ? 41 : 42);
  }
}
function ComisionesPage_Conditional_28_For_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 17);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const a_r40 = ctx.$implicit;
    \u0275\u0275property("value", a_r40);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(a_r40);
  }
}
function ComisionesPage_Conditional_28_For_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 17);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const m_r41 = ctx.$implicit;
    \u0275\u0275property("value", m_r41.value);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(m_r41.label);
  }
}
function ComisionesPage_Conditional_28_For_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 17);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const inq_r42 = ctx.$implicit;
    \u0275\u0275property("value", inq_r42.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(inq_r42.nombreInquilino);
  }
}
function ComisionesPage_Conditional_28_For_35_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 17);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const car_r43 = ctx.$implicit;
    \u0275\u0275property("value", car_r43.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(car_r43.nombreCartera);
  }
}
function ComisionesPage_Conditional_28_For_43_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 17);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const sub_r44 = ctx.$implicit;
    \u0275\u0275property("value", sub_r44.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(sub_r44.nombreSubcartera);
  }
}
function ComisionesPage_Conditional_28_Conditional_45_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(0, "svg", 101);
    \u0275\u0275element(1, "circle", 102)(2, "path", 103);
    \u0275\u0275elementEnd();
  }
}
function ComisionesPage_Conditional_28_Conditional_46_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(0, "svg", 7);
    \u0275\u0275element(1, "path", 19);
    \u0275\u0275elementEnd();
  }
}
function ComisionesPage_Conditional_28_Conditional_52_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 152)(1, "div", 153)(2, "div")(3, "span", 154);
    \u0275\u0275text(4, "Primer env\xEDo:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 155);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div")(8, "span", 154);
    \u0275\u0275text(9, "\xDAltimo env\xEDo:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "span", 155);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(ctx_r1.estadisticasBaseAjuste().primer_envio);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.estadisticasBaseAjuste().ultimo_envio);
  }
}
function ComisionesPage_Conditional_28_Conditional_52_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 105)(1, "div", 149)(2, "p", 150);
    \u0275\u0275text(3, "Total Registros");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p", 151);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 106)(7, "p", 107);
    \u0275\u0275text(8, "Total Env\xEDos");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "p", 108);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "div", 115)(12, "p", 116);
    \u0275\u0275text(13, "Asesores");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "p", 117);
    \u0275\u0275text(15);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "div", 109)(17, "p", 110);
    \u0275\u0275text(18, "Monto Total");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "p", 111);
    \u0275\u0275text(20);
    \u0275\u0275elementEnd()()();
    \u0275\u0275conditionalCreate(21, ComisionesPage_Conditional_28_Conditional_52_Conditional_21_Template, 12, 2, "div", 152);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.estadisticasBaseAjuste().total_registros);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.estadisticasBaseAjuste().total_envios);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.estadisticasBaseAjuste().total_asesores);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("S/ ", ctx_r1.formatMonto(ctx_r1.estadisticasBaseAjuste().monto_total));
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.estadisticasBaseAjuste().primer_envio ? 21 : -1);
  }
}
function ComisionesPage_Conditional_28_Conditional_53_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 100);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(1, "svg", 138);
    \u0275\u0275element(2, "path", 11);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(3, "p");
    \u0275\u0275text(4, "No hay env\xEDos registrados para este per\xEDodo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 156);
    \u0275\u0275text(6, 'Haz clic en "Agregar al Env\xEDo" para incluir las promesas pagadas del mes');
    \u0275\u0275elementEnd()();
  }
}
function ComisionesPage_Conditional_28_Template(rf, ctx) {
  if (rf & 1) {
    const _r39 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 12)(1, "div", 139)(2, "div")(3, "h2", 68);
    \u0275\u0275text(4, "Base de Ajuste");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 140);
    \u0275\u0275text(6, " Reporte de promesas pagadas con fecha de env\xEDo para control de ajustes ");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(7, "div", 14)(8, "div")(9, "label", 15);
    \u0275\u0275text(10, "A\xF1o");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "select", 16);
    \u0275\u0275twoWayListener("ngModelChange", function ComisionesPage_Conditional_28_Template_select_ngModelChange_11_listener($event) {
      \u0275\u0275restoreView(_r39);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.filtroAnio, $event) || (ctx_r1.filtroAnio = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("change", function ComisionesPage_Conditional_28_Template_select_change_11_listener() {
      \u0275\u0275restoreView(_r39);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.cargarEstadisticasBaseAjuste());
    });
    \u0275\u0275repeaterCreate(12, ComisionesPage_Conditional_28_For_13_Template, 2, 2, "option", 17, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "div")(15, "label", 15);
    \u0275\u0275text(16, "Mes");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "select", 16);
    \u0275\u0275twoWayListener("ngModelChange", function ComisionesPage_Conditional_28_Template_select_ngModelChange_17_listener($event) {
      \u0275\u0275restoreView(_r39);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.filtroMes, $event) || (ctx_r1.filtroMes = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("change", function ComisionesPage_Conditional_28_Template_select_change_17_listener() {
      \u0275\u0275restoreView(_r39);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.cargarEstadisticasBaseAjuste());
    });
    \u0275\u0275repeaterCreate(18, ComisionesPage_Conditional_28_For_19_Template, 2, 2, "option", 17, _forTrack0);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(20, "div")(21, "label", 15);
    \u0275\u0275text(22, "Inquilino");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "select", 16);
    \u0275\u0275twoWayListener("ngModelChange", function ComisionesPage_Conditional_28_Template_select_ngModelChange_23_listener($event) {
      \u0275\u0275restoreView(_r39);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.baseAjusteInquilino, $event) || (ctx_r1.baseAjusteInquilino = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("change", function ComisionesPage_Conditional_28_Template_select_change_23_listener() {
      \u0275\u0275restoreView(_r39);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onBaseAjusteInquilinoChange());
    });
    \u0275\u0275elementStart(24, "option", 17);
    \u0275\u0275text(25, "Todos");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(26, ComisionesPage_Conditional_28_For_27_Template, 2, 2, "option", 17, _forTrack1);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(28, "div")(29, "label", 15);
    \u0275\u0275text(30, "Cartera");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "select", 97);
    \u0275\u0275twoWayListener("ngModelChange", function ComisionesPage_Conditional_28_Template_select_ngModelChange_31_listener($event) {
      \u0275\u0275restoreView(_r39);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.baseAjusteCartera, $event) || (ctx_r1.baseAjusteCartera = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("change", function ComisionesPage_Conditional_28_Template_select_change_31_listener() {
      \u0275\u0275restoreView(_r39);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onBaseAjusteCarteraChange());
    });
    \u0275\u0275elementStart(32, "option", 17);
    \u0275\u0275text(33, "Todas");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(34, ComisionesPage_Conditional_28_For_35_Template, 2, 2, "option", 17, _forTrack1);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(36, "div")(37, "label", 15);
    \u0275\u0275text(38, "Subcartera");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(39, "select", 97);
    \u0275\u0275twoWayListener("ngModelChange", function ComisionesPage_Conditional_28_Template_select_ngModelChange_39_listener($event) {
      \u0275\u0275restoreView(_r39);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.baseAjusteSubcartera, $event) || (ctx_r1.baseAjusteSubcartera = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("change", function ComisionesPage_Conditional_28_Template_select_change_39_listener() {
      \u0275\u0275restoreView(_r39);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onBaseAjusteSubcarteraChange());
    });
    \u0275\u0275elementStart(40, "option", 17);
    \u0275\u0275text(41, "Todas");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(42, ComisionesPage_Conditional_28_For_43_Template, 2, 2, "option", 17, _forTrack1);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(44, "button", 141);
    \u0275\u0275listener("click", function ComisionesPage_Conditional_28_Template_button_click_44_listener() {
      \u0275\u0275restoreView(_r39);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.agregarEnvioBaseAjuste());
    });
    \u0275\u0275conditionalCreate(45, ComisionesPage_Conditional_28_Conditional_45_Template, 3, 0, ":svg:svg", 101)(46, ComisionesPage_Conditional_28_Conditional_46_Template, 2, 0, ":svg:svg", 7);
    \u0275\u0275text(47, " Agregar al Env\xEDo ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(48, "button", 142);
    \u0275\u0275listener("click", function ComisionesPage_Conditional_28_Template_button_click_48_listener() {
      \u0275\u0275restoreView(_r39);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.exportarBaseAjusteExcel());
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(49, "svg", 7);
    \u0275\u0275element(50, "path", 119);
    \u0275\u0275elementEnd();
    \u0275\u0275text(51, " Exportar Excel ");
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(52, ComisionesPage_Conditional_28_Conditional_52_Template, 22, 5)(53, ComisionesPage_Conditional_28_Conditional_53_Template, 7, 0, "div", 100);
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(54, "div", 143)(55, "div", 144);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(56, "svg", 145);
    \u0275\u0275element(57, "path", 133);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(58, "div", 146)(59, "p", 147);
    \u0275\u0275text(60, "\xBFC\xF3mo funciona?");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(61, "ul", 148)(62, "li");
    \u0275\u0275text(63, 'Al hacer clic en "Agregar al Env\xEDo", se buscan promesas con estado PAGADA del mes seleccionado');
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(64, "li");
    \u0275\u0275text(65, 'Los nuevos registros se marcan con la fecha de hoy como "Fecha de Env\xEDo"');
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(66, "li");
    \u0275\u0275text(67, "Los registros ya agregados mantienen su fecha de env\xEDo original");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(68, "li");
    \u0275\u0275text(69, "El Excel incluye: Asesor, Fecha Env\xEDo, DNI, Fecha Pago, Monto, Concepto, Capital, Deuda Total, Per\xEDodo, Tramo y Canal de Pago");
    \u0275\u0275elementEnd()()()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(11);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.filtroAnio);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.aniosDisponibles);
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.filtroMes);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.mesesDisponibles);
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.baseAjusteInquilino);
    \u0275\u0275advance();
    \u0275\u0275property("value", 0);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r1.inquilinos());
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.baseAjusteCartera);
    \u0275\u0275property("disabled", !ctx_r1.baseAjusteInquilino);
    \u0275\u0275advance();
    \u0275\u0275property("value", 0);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r1.baseAjusteCarteras());
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.baseAjusteSubcartera);
    \u0275\u0275property("disabled", !ctx_r1.baseAjusteCartera);
    \u0275\u0275advance();
    \u0275\u0275property("value", 0);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r1.baseAjusteSubcarteras());
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r1.isLoading());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.isLoading() ? 45 : 46);
    \u0275\u0275advance(3);
    \u0275\u0275property("disabled", ctx_r1.isLoading() || !ctx_r1.estadisticasBaseAjuste() || ctx_r1.estadisticasBaseAjuste().total_registros === 0);
    \u0275\u0275advance(4);
    \u0275\u0275conditional(ctx_r1.estadisticasBaseAjuste() ? 52 : 53);
  }
}
function ComisionesPage_Conditional_29_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 157)(1, "p");
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
    this.estadisticasBaseAjuste = signal(null, ...ngDevMode ? [{ debugName: "estadisticasBaseAjuste" }] : []);
    this.baseAjusteInquilino = 0;
    this.baseAjusteCartera = 0;
    this.baseAjusteSubcartera = 0;
    this.baseAjusteCarteras = signal([], ...ngDevMode ? [{ debugName: "baseAjusteCarteras" }] : []);
    this.baseAjusteSubcarteras = signal([], ...ngDevMode ? [{ debugName: "baseAjusteSubcarteras" }] : []);
    this.inquilinos = signal([], ...ngDevMode ? [{ debugName: "inquilinos" }] : []);
    this.carteras = signal([], ...ngDevMode ? [{ debugName: "carteras" }] : []);
    this.subcarteras = signal([], ...ngDevMode ? [{ debugName: "subcarteras" }] : []);
    this.selectedInquilino = 0;
    this.selectedCartera = 0;
    this.metas = signal([], ...ngDevMode ? [{ debugName: "metas" }] : []);
    this.mostrarFormMeta = signal(false, ...ngDevMode ? [{ debugName: "mostrarFormMeta" }] : []);
    this.metaEditando = signal(null, ...ngDevMode ? [{ debugName: "metaEditando" }] : []);
    this.bonos = signal([], ...ngDevMode ? [{ debugName: "bonos" }] : []);
    this.mostrarFormBono = signal(false, ...ngDevMode ? [{ debugName: "mostrarFormBono" }] : []);
    this.bonoEditando = signal(null, ...ngDevMode ? [{ debugName: "bonoEditando" }] : []);
    this.camposDisponibles = signal([], ...ngDevMode ? [{ debugName: "camposDisponibles" }] : []);
    this.valoresCampo = signal([], ...ngDevMode ? [{ debugName: "valoresCampo" }] : []);
    this.cargandoValores = signal(false, ...ngDevMode ? [{ debugName: "cargandoValores" }] : []);
    this.bonoSelectedInquilino = 0;
    this.bonoSelectedCartera = 0;
    this.bonoCarteras = signal([], ...ngDevMode ? [{ debugName: "bonoCarteras" }] : []);
    this.bonoSubcarteras = signal([], ...ngDevMode ? [{ debugName: "bonoSubcarteras" }] : []);
    this.reporte = signal(null, ...ngDevMode ? [{ debugName: "reporte" }] : []);
    this.agenteExpandido = signal(null, ...ngDevMode ? [{ debugName: "agenteExpandido" }] : []);
    this.reporteInquilino = 0;
    this.reporteCartera = 0;
    this.reporteSubcartera = 0;
    this.reporteCarteras = signal([], ...ngDevMode ? [{ debugName: "reporteCarteras" }] : []);
    this.reporteSubcarteras = signal([], ...ngDevMode ? [{ debugName: "reporteSubcarteras" }] : []);
    this.filtroAnio = (/* @__PURE__ */ new Date()).getFullYear();
    this.filtroMes = (/* @__PURE__ */ new Date()).getMonth() + 1;
    this.aniosDisponibles = [2024, 2025, 2026];
    this.tiposMetrica = [
      { value: "RECAUDO", label: "Recaudo (Pagos Validados)" },
      { value: "CAPITAL_LIBERADO", label: "Capital Liberado (PDP Pagadas)" }
    ];
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
    this.cargarInquilinos();
    this.cargarMetas();
    this.cargarCamposDisponibles();
  }
  // ==================== INQUILINOS / CARTERAS / SUBCARTERAS ====================
  cargarInquilinos() {
    this.comisionesService.obtenerInquilinos().subscribe({
      next: (data) => this.inquilinos.set(data),
      error: (err) => console.error("Error al cargar inquilinos:", err)
    });
  }
  onInquilinoChange() {
    this.carteras.set([]);
    this.subcarteras.set([]);
    this.selectedCartera = 0;
    if (this.metaEditando()) {
      this.metaEditando.set(__spreadProps(__spreadValues({}, this.metaEditando()), { idSubcartera: 0, nombreSubcartera: "" }));
    }
    if (this.selectedInquilino) {
      this.comisionesService.obtenerCarteras(this.selectedInquilino).subscribe({
        next: (data) => this.carteras.set(data),
        error: (err) => console.error("Error al cargar carteras:", err)
      });
    }
  }
  onCarteraChange() {
    this.subcarteras.set([]);
    if (this.metaEditando()) {
      this.metaEditando.set(__spreadProps(__spreadValues({}, this.metaEditando()), { idSubcartera: 0, nombreSubcartera: "" }));
    }
    if (this.selectedCartera) {
      this.comisionesService.obtenerSubcarteras(this.selectedCartera).subscribe({
        next: (data) => this.subcarteras.set(data),
        error: (err) => console.error("Error al cargar subcarteras:", err)
      });
    }
  }
  // ==================== REPORTE FILTROS ====================
  onReporteInquilinoChange() {
    this.reporteCarteras.set([]);
    this.reporteSubcarteras.set([]);
    this.reporteCartera = 0;
    this.reporteSubcartera = 0;
    if (this.reporteInquilino) {
      this.comisionesService.obtenerCarteras(this.reporteInquilino).subscribe({
        next: (data) => this.reporteCarteras.set(data),
        error: (err) => console.error("Error al cargar carteras:", err)
      });
    }
  }
  onReporteCarteraChange() {
    this.reporteSubcarteras.set([]);
    this.reporteSubcartera = 0;
    if (this.reporteCartera) {
      this.comisionesService.obtenerSubcarteras(this.reporteCartera).subscribe({
        next: (data) => this.reporteSubcarteras.set(data),
        error: (err) => console.error("Error al cargar subcarteras:", err)
      });
    }
  }
  // ==================== METAS ====================
  cargarMetas() {
    this.comisionesService.obtenerMetas(this.filtroAnio, this.filtroMes).subscribe({
      next: (data) => this.metas.set(data),
      error: (err) => this.mostrarMensaje("Error al cargar metas: " + err.message, true)
    });
  }
  nuevaMeta() {
    this.selectedInquilino = 0;
    this.selectedCartera = 0;
    this.carteras.set([]);
    this.subcarteras.set([]);
    this.metaEditando.set({
      idSubcartera: 0,
      nombreSubcartera: "",
      anio: this.filtroAnio,
      mes: this.filtroMes,
      metaGrupal: 0,
      tipoMetrica: "RECAUDO",
      escalas: [],
      activo: true
    });
    this.mostrarFormMeta.set(true);
  }
  editarMeta(meta) {
    this.metaEditando.set(__spreadProps(__spreadValues({}, meta), {
      escalas: meta.escalas ? [...meta.escalas] : []
    }));
    this.mostrarFormMeta.set(true);
    if (meta.idSubcartera) {
      this.comisionesService.obtenerJerarquiaSubcartera(meta.idSubcartera).subscribe({
        next: (jerarquia) => {
          this.selectedInquilino = jerarquia.idInquilino;
          this.selectedCartera = jerarquia.idCartera;
          this.comisionesService.obtenerCarteras(jerarquia.idInquilino).subscribe({
            next: (carteras) => {
              this.carteras.set(carteras);
              this.comisionesService.obtenerSubcarteras(jerarquia.idCartera).subscribe({
                next: (subcarteras) => this.subcarteras.set(subcarteras),
                error: (err) => console.error("Error al cargar subcarteras:", err)
              });
            },
            error: (err) => console.error("Error al cargar carteras:", err)
          });
        },
        error: (err) => console.error("Error al cargar jerarqu\xEDa:", err)
      });
    }
  }
  onSubcarteraChange() {
    if (!this.metaEditando())
      return;
    const subcartera = this.subcarteras().find((s) => s.id == this.metaEditando().idSubcartera);
    if (subcartera) {
      this.metaEditando.set(__spreadProps(__spreadValues({}, this.metaEditando()), {
        nombreSubcartera: subcartera.nombreSubcartera
      }));
    }
  }
  agregarEscalaMeta() {
    if (!this.metaEditando())
      return;
    const escalas = [...this.metaEditando().escalas, {
      porcentajeDesde: 0,
      porcentajeHasta: void 0,
      montoComision: 0
    }];
    this.metaEditando.set(__spreadProps(__spreadValues({}, this.metaEditando()), { escalas }));
  }
  eliminarEscalaMeta(index) {
    if (!this.metaEditando())
      return;
    const escalas = this.metaEditando().escalas.filter((_, i) => i !== index);
    this.metaEditando.set(__spreadProps(__spreadValues({}, this.metaEditando()), { escalas }));
  }
  guardarMeta() {
    if (!this.metaEditando())
      return;
    const meta = __spreadProps(__spreadValues({}, this.metaEditando()), {
      idSubcartera: Number(this.metaEditando().idSubcartera)
    });
    this.isLoading.set(true);
    this.comisionesService.guardarMeta(meta).subscribe({
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
    this.selectedInquilino = 0;
    this.selectedCartera = 0;
    this.carteras.set([]);
    this.subcarteras.set([]);
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
    this.bonoSelectedInquilino = 0;
    this.bonoSelectedCartera = 0;
    this.bonoCarteras.set([]);
    this.bonoSubcarteras.set([]);
    this.valoresCampo.set([]);
    this.bonoEditando.set({
      nombre: "",
      descripcion: "",
      campoEvaluar: "",
      valorBuscar: "",
      idSubcartera: void 0,
      nombreSubcartera: void 0,
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
    if (bono.campoEvaluar) {
      this.cargandoValores.set(true);
      this.comisionesService.obtenerValoresCampo(bono.campoEvaluar).subscribe({
        next: (valores) => {
          this.valoresCampo.set(valores);
          this.cargandoValores.set(false);
        },
        error: (err) => {
          console.error("Error al cargar valores del campo:", err);
          this.cargandoValores.set(false);
        }
      });
    } else {
      this.valoresCampo.set([]);
    }
    if (bono.idSubcartera) {
      this.comisionesService.obtenerJerarquiaSubcartera(bono.idSubcartera).subscribe({
        next: (jerarquia) => {
          this.bonoSelectedInquilino = jerarquia.idInquilino;
          this.bonoSelectedCartera = jerarquia.idCartera;
          this.comisionesService.obtenerCarteras(jerarquia.idInquilino).subscribe({
            next: (carteras) => {
              this.bonoCarteras.set(carteras);
              this.comisionesService.obtenerSubcarteras(jerarquia.idCartera).subscribe({
                next: (subcarteras) => this.bonoSubcarteras.set(subcarteras),
                error: (err) => console.error("Error al cargar subcarteras:", err)
              });
            },
            error: (err) => console.error("Error al cargar carteras:", err)
          });
        },
        error: (err) => console.error("Error al cargar jerarqu\xEDa:", err)
      });
    } else {
      this.bonoSelectedInquilino = 0;
      this.bonoSelectedCartera = 0;
      this.bonoCarteras.set([]);
      this.bonoSubcarteras.set([]);
    }
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
    const bono = __spreadProps(__spreadValues({}, this.bonoEditando()), {
      idSubcartera: this.bonoEditando().idSubcartera ? Number(this.bonoEditando().idSubcartera) : void 0,
      nombreSubcartera: this.bonoEditando().idSubcartera ? this.bonoEditando().nombreSubcartera : void 0
    });
    this.isLoading.set(true);
    this.comisionesService.guardarBono(bono).subscribe({
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
    this.bonoSelectedInquilino = 0;
    this.bonoSelectedCartera = 0;
    this.bonoCarteras.set([]);
    this.bonoSubcarteras.set([]);
    this.valoresCampo.set([]);
  }
  onBonoInquilinoChange() {
    this.bonoCarteras.set([]);
    this.bonoSubcarteras.set([]);
    this.bonoSelectedCartera = 0;
    if (this.bonoEditando()) {
      this.bonoEditando.set(__spreadProps(__spreadValues({}, this.bonoEditando()), { idSubcartera: void 0, nombreSubcartera: void 0 }));
    }
    if (this.bonoSelectedInquilino) {
      this.comisionesService.obtenerCarteras(this.bonoSelectedInquilino).subscribe({
        next: (data) => this.bonoCarteras.set(data),
        error: (err) => console.error("Error al cargar carteras:", err)
      });
    }
  }
  onBonoCarteraChange() {
    this.bonoSubcarteras.set([]);
    if (this.bonoEditando()) {
      this.bonoEditando.set(__spreadProps(__spreadValues({}, this.bonoEditando()), { idSubcartera: void 0, nombreSubcartera: void 0 }));
    }
    if (this.bonoSelectedCartera) {
      this.comisionesService.obtenerSubcarteras(this.bonoSelectedCartera).subscribe({
        next: (data) => this.bonoSubcarteras.set(data),
        error: (err) => console.error("Error al cargar subcarteras:", err)
      });
    }
  }
  onBonoSubcarteraChange() {
    if (!this.bonoEditando())
      return;
    const subcartera = this.bonoSubcarteras().find((s) => s.id == this.bonoEditando().idSubcartera);
    if (subcartera) {
      this.bonoEditando.set(__spreadProps(__spreadValues({}, this.bonoEditando()), {
        nombreSubcartera: subcartera.nombreSubcartera
      }));
    } else {
      this.bonoEditando.set(__spreadProps(__spreadValues({}, this.bonoEditando()), {
        idSubcartera: void 0,
        nombreSubcartera: void 0
      }));
    }
  }
  onCampoEvaluarChange() {
    if (!this.bonoEditando())
      return;
    const campo = this.bonoEditando().campoEvaluar;
    this.bonoEditando.set(__spreadProps(__spreadValues({}, this.bonoEditando()), { valorBuscar: "" }));
    this.valoresCampo.set([]);
    if (campo) {
      this.cargandoValores.set(true);
      this.comisionesService.obtenerValoresCampo(campo).subscribe({
        next: (valores) => {
          this.valoresCampo.set(valores);
          this.cargandoValores.set(false);
        },
        error: (err) => {
          console.error("Error al cargar valores del campo:", err);
          this.cargandoValores.set(false);
        }
      });
    }
  }
  // ==================== REPORTE ====================
  calcularComisiones() {
    this.isLoading.set(true);
    this.reporte.set(null);
    const idSubcartera = this.reporteSubcartera || void 0;
    this.comisionesService.calcularComisiones(this.filtroAnio, this.filtroMes, idSubcartera).subscribe({
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
  // ==================== EXPORTACIÓN ====================
  exportarExcel() {
    if (!this.reporte())
      return;
    this.isLoading.set(true);
    const idSubcartera = this.reporteSubcartera || void 0;
    this.comisionesService.exportarExcel(this.filtroAnio, this.filtroMes, idSubcartera).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `Comisiones_${this.filtroAnio}_${this.filtroMes}.xlsx`;
        link.click();
        window.URL.revokeObjectURL(url);
        this.mostrarMensaje("Excel exportado correctamente", false);
      },
      error: (err) => {
        console.error("Error al exportar Excel:", err);
        this.mostrarMensaje("Error al exportar Excel", true);
      },
      complete: () => this.isLoading.set(false)
    });
  }
  exportarPdf() {
    if (!this.reporte())
      return;
    this.isLoading.set(true);
    const idSubcartera = this.reporteSubcartera || void 0;
    this.comisionesService.exportarPdf(this.filtroAnio, this.filtroMes, idSubcartera).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `Comisiones_${this.filtroAnio}_${this.filtroMes}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
        this.mostrarMensaje("PDF exportado correctamente", false);
      },
      error: (err) => {
        console.error("Error al exportar PDF:", err);
        this.mostrarMensaje("Error al exportar PDF", true);
      },
      complete: () => this.isLoading.set(false)
    });
  }
  // ==================== BASE DE AJUSTE ====================
  onBaseAjusteInquilinoChange() {
    this.baseAjusteCarteras.set([]);
    this.baseAjusteSubcarteras.set([]);
    this.baseAjusteCartera = 0;
    this.baseAjusteSubcartera = 0;
    if (this.baseAjusteInquilino) {
      this.comisionesService.obtenerCarteras(this.baseAjusteInquilino).subscribe({
        next: (data) => this.baseAjusteCarteras.set(data),
        error: (err) => console.error("Error al cargar carteras:", err)
      });
    }
    this.cargarEstadisticasBaseAjuste();
  }
  onBaseAjusteCarteraChange() {
    this.baseAjusteSubcarteras.set([]);
    this.baseAjusteSubcartera = 0;
    if (this.baseAjusteCartera) {
      this.comisionesService.obtenerSubcarteras(this.baseAjusteCartera).subscribe({
        next: (data) => this.baseAjusteSubcarteras.set(data),
        error: (err) => console.error("Error al cargar subcarteras:", err)
      });
    }
    this.cargarEstadisticasBaseAjuste();
  }
  onBaseAjusteSubcarteraChange() {
    this.cargarEstadisticasBaseAjuste();
  }
  cargarEstadisticasBaseAjuste() {
    const idSubcartera = this.baseAjusteSubcartera || void 0;
    this.comisionesService.obtenerEstadisticasBaseAjuste(this.filtroAnio, this.filtroMes, idSubcartera).subscribe({
      next: (data) => {
        this.estadisticasBaseAjuste.set(data);
      },
      error: (err) => {
        console.error("Error al cargar estad\xEDsticas:", err);
        this.estadisticasBaseAjuste.set(null);
      }
    });
  }
  agregarEnvioBaseAjuste() {
    this.isLoading.set(true);
    const idSubcartera = this.baseAjusteSubcartera || void 0;
    this.comisionesService.agregarEnvioBaseAjuste(this.filtroAnio, this.filtroMes, idSubcartera).subscribe({
      next: (resultado) => {
        this.mostrarMensaje(resultado.mensaje, false);
        this.cargarEstadisticasBaseAjuste();
      },
      error: (err) => {
        console.error("Error al agregar env\xEDo:", err);
        this.mostrarMensaje("Error al agregar env\xEDo: " + (err.error?.error || err.message), true);
      },
      complete: () => this.isLoading.set(false)
    });
  }
  exportarBaseAjusteExcel() {
    this.isLoading.set(true);
    const idSubcartera = this.baseAjusteSubcartera || void 0;
    this.comisionesService.exportarBaseAjusteExcel(this.filtroAnio, this.filtroMes, idSubcartera).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `Base_Ajuste_${this.filtroAnio}_${String(this.filtroMes).padStart(2, "0")}.xlsx`;
        link.click();
        window.URL.revokeObjectURL(url);
        this.mostrarMensaje("Excel exportado correctamente", false);
      },
      error: (err) => {
        console.error("Error al exportar Excel:", err);
        this.mostrarMensaje("Error al exportar Excel", true);
      },
      complete: () => this.isLoading.set(false)
    });
  }
};
_ComisionesPage.\u0275fac = function ComisionesPage_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _ComisionesPage)(\u0275\u0275directiveInject(ComisionesService));
};
_ComisionesPage.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ComisionesPage, selectors: [["app-comisiones"]], decls: 30, vars: 13, consts: [[1, "min-h-screen", "bg-slate-50", "dark:bg-slate-900", "p-6"], [1, "mb-6"], [1, "text-2xl", "font-bold", "text-slate-800", "dark:text-white"], [1, "text-slate-600", "dark:text-slate-400"], [1, "border-b", "border-slate-200", "dark:border-slate-700"], [1, "-mb-px", "flex", "space-x-8"], [1, "whitespace-nowrap", "py-4", "px-1", "border-b-2", "font-medium", "text-sm", "transition-colors", "flex", "items-center", "gap-2", 3, "click"], ["fill", "none", "stroke", "currentColor", "viewBox", "0 0 24 24", 1, "w-5", "h-5"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"], [1, "bg-white", "dark:bg-slate-800", "rounded-xl", "shadow-sm", "border", "border-slate-200", "dark:border-slate-700", "p-6", "mb-6"], [1, "fixed", "bottom-4", "right-4", "p-4", "border", "rounded-lg", "shadow-lg", "max-w-md", 3, "class"], [1, "flex", "flex-wrap", "gap-4", "items-end", "mb-6"], [1, "block", "text-sm", "font-medium", "text-slate-700", "dark:text-slate-300", "mb-1"], [1, "px-3", "py-2", "border", "border-slate-300", "dark:border-slate-600", "rounded-lg", "bg-white", "dark:bg-slate-700", "text-slate-800", "dark:text-white", 3, "ngModelChange", "change", "ngModel"], [3, "value"], [1, "px-4", "py-2", "bg-blue-600", "text-white", "rounded-lg", "hover:bg-blue-700", "transition-colors", "flex", "items-center", "gap-2", 3, "click"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M12 4v16m8-8H4"], [1, "mb-6", "p-4", "border", "border-blue-200", "dark:border-blue-800", "bg-blue-50", "dark:bg-blue-900/20", "rounded-lg"], [1, "overflow-x-auto"], [1, "text-center", "py-8", "text-slate-500", "dark:text-slate-400"], [1, "text-lg", "font-semibold", "text-slate-800", "dark:text-white", "mb-4"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "lg:grid-cols-4", "gap-4", "mb-4"], [1, "w-full", "px-3", "py-2", "border", "border-slate-300", "dark:border-slate-600", "rounded-lg", "bg-white", "dark:bg-slate-700", "text-slate-800", "dark:text-white", 3, "ngModelChange", "change", "ngModel"], [1, "w-full", "px-3", "py-2", "border", "border-slate-300", "dark:border-slate-600", "rounded-lg", "bg-white", "dark:bg-slate-700", "text-slate-800", "dark:text-white", "disabled:opacity-50", 3, "ngModelChange", "change", "ngModel", "disabled"], ["type", "number", "placeholder", "0.00", 1, "w-full", "px-3", "py-2", "border", "border-slate-300", "dark:border-slate-600", "rounded-lg", "bg-white", "dark:bg-slate-700", "text-slate-800", "dark:text-white", 3, "ngModelChange", "ngModel"], [1, "w-full", "px-3", "py-2", "border", "border-slate-300", "dark:border-slate-600", "rounded-lg", "bg-white", "dark:bg-slate-700", "text-slate-800", "dark:text-white", 3, "ngModelChange", "ngModel"], [1, "mb-4"], [1, "flex", "justify-between", "items-center", "mb-2"], [1, "block", "text-sm", "font-medium", "text-slate-700", "dark:text-slate-300"], [1, "text-sm", "text-blue-600", "hover:text-blue-800", "dark:text-blue-400", "flex", "items-center", "gap-1", 3, "click"], ["fill", "none", "stroke", "currentColor", "viewBox", "0 0 24 24", 1, "w-4", "h-4"], [1, "space-y-2"], [1, "flex", "gap-2", "items-center", "flex-wrap"], [1, "text-sm", "text-slate-400", "italic"], [1, "flex", "gap-2"], [1, "px-4", "py-2", "bg-blue-600", "text-white", "rounded-lg", "hover:bg-blue-700", "disabled:bg-slate-400", "transition-colors", 3, "click", "disabled"], [1, "px-4", "py-2", "bg-slate-200", "dark:bg-slate-700", "text-slate-700", "dark:text-slate-300", "rounded-lg", "hover:bg-slate-300", "dark:hover:bg-slate-600", "transition-colors", 3, "click"], [1, "text-slate-500", "text-sm"], ["type", "number", "placeholder", "0", 1, "w-20", "px-2", "py-1.5", "border", "border-slate-300", "dark:border-slate-600", "rounded", "bg-white", "dark:bg-slate-700", "text-slate-800", "dark:text-white", "text-sm", 3, "ngModelChange", "ngModel"], ["type", "number", "placeholder", "100", 1, "w-20", "px-2", "py-1.5", "border", "border-slate-300", "dark:border-slate-600", "rounded", "bg-white", "dark:bg-slate-700", "text-slate-800", "dark:text-white", "text-sm", 3, "ngModelChange", "ngModel"], ["type", "number", "step", "0.01", "placeholder", "0.00", 1, "w-24", "px-2", "py-1.5", "border", "border-slate-300", "dark:border-slate-600", "rounded", "bg-white", "dark:bg-slate-700", "text-slate-800", "dark:text-white", "text-sm", 3, "ngModelChange", "ngModel"], [1, "text-red-500", "hover:text-red-700", "p-1", 3, "click"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M6 18L18 6M6 6l12 12"], [1, "min-w-full", "divide-y", "divide-slate-200", "dark:divide-slate-700"], [1, "bg-slate-50", "dark:bg-slate-700/50"], [1, "px-4", "py-3", "text-left", "text-xs", "font-medium", "text-slate-500", "uppercase"], [1, "px-4", "py-3", "text-right", "text-xs", "font-medium", "text-slate-500", "uppercase"], [1, "px-4", "py-3", "text-center", "text-xs", "font-medium", "text-slate-500", "uppercase"], [1, "divide-y", "divide-slate-200", "dark:divide-slate-700"], [1, "hover:bg-slate-50", "dark:hover:bg-slate-700/50"], [1, "px-4", "py-3", "text-sm", "text-slate-800", "dark:text-white", "font-medium"], [1, "px-4", "py-3", "text-sm", "text-right", "text-green-600", "font-semibold"], [1, "px-4", "py-3", "text-sm", "text-center"], [1, "px-4", "py-3", "text-sm"], [1, "flex", "flex-wrap", "gap-1"], [1, "px-2", "py-0.5", "bg-blue-100", "dark:bg-blue-900/30", "rounded", "text-xs", "text-blue-700", "dark:text-blue-300"], [1, "text-slate-400", "italic", "text-xs"], [1, "px-4", "py-3", "text-center"], [1, "px-2", "py-1", "rounded-full", "text-xs", "font-medium"], [1, "text-blue-600", "hover:text-blue-800", "dark:text-blue-400", "dark:hover:text-blue-300", "mr-2", 3, "click"], ["fill", "none", "stroke", "currentColor", "viewBox", "0 0 24 24", 1, "w-5", "h-5", "inline"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"], [1, "text-red-600", "hover:text-red-800", "dark:text-red-400", "dark:hover:text-red-300", 3, "click"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"], [1, "flex", "justify-between", "items-center", "mb-6"], [1, "text-lg", "font-semibold", "text-slate-800", "dark:text-white"], [1, "px-4", "py-2", "bg-green-600", "text-white", "rounded-lg", "hover:bg-green-700", "transition-colors", "flex", "items-center", "gap-2", 3, "click"], [1, "mb-6", "p-4", "border", "border-green-200", "dark:border-green-800", "bg-green-50", "dark:bg-green-900/20", "rounded-lg"], [1, "space-y-4"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "lg:grid-cols-3", "gap-4", "mb-4"], ["type", "text", "placeholder", "Ej: Bono LTD T5", 1, "w-full", "px-3", "py-2", "border", "border-slate-300", "dark:border-slate-600", "rounded-lg", "bg-white", "dark:bg-slate-700", "text-slate-800", "dark:text-white", 3, "ngModelChange", "ngModel"], ["type", "text", "placeholder", "Descripci\xF3n opcional", 1, "w-full", "px-3", "py-2", "border", "border-slate-300", "dark:border-slate-600", "rounded-lg", "bg-white", "dark:bg-slate-700", "text-slate-800", "dark:text-white", 3, "ngModelChange", "ngModel"], ["value", ""], [1, "w-full", "px-3", "py-2", "border", "border-slate-300", "dark:border-slate-600", "rounded-lg", "bg-white", "dark:bg-slate-700", "text-slate-800", "dark:text-white", "disabled:opacity-50", 3, "ngModelChange", "ngModel", "disabled"], [1, "text-sm", "text-green-600", "hover:text-green-800", "dark:text-green-400", "flex", "items-center", "gap-1", 3, "click"], [1, "flex", "gap-2", "items-center"], [1, "px-4", "py-2", "bg-green-600", "text-white", "rounded-lg", "hover:bg-green-700", "disabled:bg-slate-400", "transition-colors", 3, "click", "disabled"], ["type", "number", "placeholder", "Cantidad", 1, "w-32", "px-3", "py-2", "border", "border-slate-300", "dark:border-slate-600", "rounded-lg", "bg-white", "dark:bg-slate-700", "text-slate-800", "dark:text-white", 3, "ngModelChange", "ngModel"], [1, "text-slate-500"], ["type", "number", "step", "0.01", "placeholder", "Monto", 1, "w-32", "px-3", "py-2", "border", "border-slate-300", "dark:border-slate-600", "rounded-lg", "bg-white", "dark:bg-slate-700", "text-slate-800", "dark:text-white", 3, "ngModelChange", "ngModel"], [1, "text-red-500", "hover:text-red-700", 3, "click"], [1, "border", "border-slate-200", "dark:border-slate-700", "rounded-lg", "p-4"], [1, "flex", "justify-between", "items-start"], [1, "flex", "items-center", "gap-2"], [1, "font-semibold", "text-slate-800", "dark:text-white"], [1, "px-2", "py-0.5", "bg-purple-100", "text-purple-700", "dark:bg-purple-900/30", "dark:text-purple-300", "rounded", "text-xs"], [1, "px-2", "py-0.5", "bg-slate-100", "text-slate-600", "dark:bg-slate-700", "dark:text-slate-400", "rounded", "text-xs"], [1, "text-sm", "text-slate-600", "dark:text-slate-400"], [1, "text-sm", "text-slate-500", "dark:text-slate-500", "mt-1"], [1, "text-blue-600", "hover:text-blue-800", "dark:text-blue-400", 3, "click"], [1, "text-red-600", "hover:text-red-800", "dark:text-red-400", 3, "click"], [1, "mt-3", "flex", "flex-wrap", "gap-2"], [1, "px-2", "py-1", "bg-slate-100", "dark:bg-slate-700", "rounded", "text-sm", "text-slate-700", "dark:text-slate-300"], [1, "px-3", "py-2", "border", "border-slate-300", "dark:border-slate-600", "rounded-lg", "bg-white", "dark:bg-slate-700", "text-slate-800", "dark:text-white", 3, "ngModelChange", "ngModel"], [1, "px-3", "py-2", "border", "border-slate-300", "dark:border-slate-600", "rounded-lg", "bg-white", "dark:bg-slate-700", "text-slate-800", "dark:text-white", "disabled:opacity-50", 3, "ngModelChange", "change", "ngModel", "disabled"], [1, "px-3", "py-2", "border", "border-slate-300", "dark:border-slate-600", "rounded-lg", "bg-white", "dark:bg-slate-700", "text-slate-800", "dark:text-white", "disabled:opacity-50", 3, "ngModelChange", "ngModel", "disabled"], [1, "px-6", "py-2", "bg-purple-600", "text-white", "rounded-lg", "hover:bg-purple-700", "disabled:bg-slate-400", "transition-colors", "flex", "items-center", "gap-2", 3, "click", "disabled"], [1, "text-center", "py-12", "text-slate-500", "dark:text-slate-400"], ["fill", "none", "viewBox", "0 0 24 24", 1, "animate-spin", "h-5", "w-5"], ["cx", "12", "cy", "12", "r", "10", "stroke", "currentColor", "stroke-width", "4", 1, "opacity-25"], ["fill", "currentColor", "d", "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z", 1, "opacity-75"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"], [1, "grid", "grid-cols-1", "md:grid-cols-4", "gap-4", "mb-6"], [1, "bg-blue-50", "dark:bg-blue-900/20", "rounded-lg", "p-4"], [1, "text-sm", "text-blue-600", "dark:text-blue-400", "font-medium"], [1, "text-2xl", "font-bold", "text-blue-800", "dark:text-blue-300"], [1, "bg-green-50", "dark:bg-green-900/20", "rounded-lg", "p-4"], [1, "text-sm", "text-green-600", "dark:text-green-400", "font-medium"], [1, "text-2xl", "font-bold", "text-green-800", "dark:text-green-300"], [1, "bg-amber-50", "dark:bg-amber-900/20", "rounded-lg", "p-4"], [1, "text-sm", "text-amber-600", "dark:text-amber-400", "font-medium"], [1, "text-2xl", "font-bold", "text-amber-800", "dark:text-amber-300"], [1, "bg-purple-50", "dark:bg-purple-900/20", "rounded-lg", "p-4"], [1, "text-sm", "text-purple-600", "dark:text-purple-400", "font-medium"], [1, "text-2xl", "font-bold", "text-purple-800", "dark:text-purple-300"], [1, "flex", "gap-2", "mb-4"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"], [1, "px-4", "py-2", "bg-red-600", "text-white", "rounded-lg", "hover:bg-red-700", "transition-colors", "flex", "items-center", "gap-2", 3, "click"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"], [1, "px-4", "py-3", "text-sm", "font-medium", "text-slate-800", "dark:text-white"], [1, "px-4", "py-3", "text-sm", "text-slate-600", "dark:text-slate-400"], [1, "px-4", "py-3", "text-sm", "text-right", "text-slate-600", "dark:text-slate-400"], [1, "px-4", "py-3", "text-sm", "text-right"], [1, "px-4", "py-3", "text-sm", "text-right", "text-blue-600"], [1, "px-4", "py-3", "text-sm", "text-right", "text-amber-600"], [1, "ml-1", "text-slate-400", "hover:text-slate-600"], [1, "px-4", "py-3", "text-sm", "text-right", "font-bold", "text-purple-600"], [1, "bg-amber-50", "dark:bg-amber-900/10"], [1, "ml-1", "text-slate-400", "hover:text-slate-600", 3, "click"], ["fill", "none", "stroke", "currentColor", "viewBox", "0 0 24 24", 1, "w-4", "h-4", "inline"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"], ["colspan", "8", 1, "px-4", "py-2"], [1, "text-sm"], [1, "font-medium", "text-amber-700", "dark:text-amber-400"], [1, "ml-2", "px-2", "py-1", "bg-amber-100", "dark:bg-amber-900/30", "rounded", "text-amber-800", "dark:text-amber-300"], ["fill", "none", "stroke", "currentColor", "viewBox", "0 0 24 24", 1, "w-12", "h-12", "mx-auto", "mb-4", "text-slate-300", "dark:text-slate-600"], [1, "flex", "justify-between", "items-start", "mb-6"], [1, "text-sm", "text-slate-500", "dark:text-slate-400", "mt-1"], [1, "px-4", "py-2", "bg-orange-600", "text-white", "rounded-lg", "hover:bg-orange-700", "disabled:bg-slate-400", "transition-colors", "flex", "items-center", "gap-2", 3, "click", "disabled"], [1, "px-4", "py-2", "bg-green-600", "text-white", "rounded-lg", "hover:bg-green-700", "disabled:bg-slate-400", "transition-colors", "flex", "items-center", "gap-2", 3, "click", "disabled"], [1, "mt-6", "p-4", "bg-amber-50", "dark:bg-amber-900/20", "border", "border-amber-200", "dark:border-amber-800", "rounded-lg"], [1, "flex", "gap-3"], ["fill", "none", "stroke", "currentColor", "viewBox", "0 0 24 24", 1, "w-5", "h-5", "text-amber-600", "dark:text-amber-400", "flex-shrink-0", "mt-0.5"], [1, "text-sm", "text-amber-700", "dark:text-amber-300"], [1, "font-medium", "mb-1"], [1, "list-disc", "list-inside", "space-y-1", "text-amber-600", "dark:text-amber-400"], [1, "bg-orange-50", "dark:bg-orange-900/20", "rounded-lg", "p-4"], [1, "text-sm", "text-orange-600", "dark:text-orange-400", "font-medium"], [1, "text-2xl", "font-bold", "text-orange-800", "dark:text-orange-300"], [1, "bg-slate-50", "dark:bg-slate-700/30", "rounded-lg", "p-4", "mb-4"], [1, "flex", "flex-wrap", "gap-6"], [1, "text-sm", "text-slate-500", "dark:text-slate-400"], [1, "ml-2", "font-medium", "text-slate-700", "dark:text-slate-300"], [1, "text-sm", "mt-2"], [1, "fixed", "bottom-4", "right-4", "p-4", "border", "rounded-lg", "shadow-lg", "max-w-md"]], template: function ComisionesPage_Template(rf, ctx) {
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
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(21, "button", 6);
    \u0275\u0275listener("click", function ComisionesPage_Template_button_click_21_listener() {
      ctx.activeTab.set("baseAjuste");
      return ctx.cargarEstadisticasBaseAjuste();
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(22, "svg", 7);
    \u0275\u0275element(23, "path", 11);
    \u0275\u0275elementEnd();
    \u0275\u0275text(24, " Base de Ajuste ");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275conditionalCreate(25, ComisionesPage_Conditional_25_Template, 21, 4, "div", 12);
    \u0275\u0275conditionalCreate(26, ComisionesPage_Conditional_26_Template, 11, 2, "div", 12);
    \u0275\u0275conditionalCreate(27, ComisionesPage_Conditional_27_Template, 43, 13, "div", 12);
    \u0275\u0275conditionalCreate(28, ComisionesPage_Conditional_28_Template, 70, 14, "div", 12);
    \u0275\u0275conditionalCreate(29, ComisionesPage_Conditional_29_Template, 3, 5, "div", 13);
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
    \u0275\u0275classMap(ctx.activeTab() === "baseAjuste" ? "border-orange-500 text-orange-600 dark:text-orange-400" : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 hover:border-slate-300");
    \u0275\u0275advance(4);
    \u0275\u0275conditional(ctx.activeTab() === "metas" ? 25 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx.activeTab() === "bonos" ? 26 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx.activeTab() === "reporte" ? 27 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx.activeTab() === "baseAjuste" ? 28 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx.mensaje() ? 29 : -1);
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
            <button
              (click)="activeTab.set('baseAjuste'); cargarEstadisticasBaseAjuste()"
              [class]="activeTab() === 'baseAjuste'
                ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 hover:border-slate-300'"
              class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              Base de Ajuste
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
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Inquilino</label>
                  <select [(ngModel)]="selectedInquilino" (change)="onInquilinoChange()" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white">
                    <option [value]="0">Seleccionar...</option>
                    @for (inq of inquilinos(); track inq.id) {
                      <option [value]="inq.id">{{ inq.nombreInquilino }}</option>
                    }
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Cartera</label>
                  <select [(ngModel)]="selectedCartera" (change)="onCarteraChange()" [disabled]="!selectedInquilino" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white disabled:opacity-50">
                    <option [value]="0">Seleccionar...</option>
                    @for (car of carteras(); track car.id) {
                      <option [value]="car.id">{{ car.nombreCartera }}</option>
                    }
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Subcartera</label>
                  <select [(ngModel)]="metaEditando()!.idSubcartera" (change)="onSubcarteraChange()" [disabled]="!selectedCartera" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white disabled:opacity-50">
                    <option [value]="0">Seleccionar...</option>
                    @for (sub of subcarteras(); track sub.id) {
                      <option [value]="sub.id">{{ sub.nombreSubcartera }}</option>
                    }
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Meta Grupal (S/)</label>
                  <input type="number" [(ngModel)]="metaEditando()!.metaGrupal" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white" placeholder="0.00">
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tipo de Metrica</label>
                  <select [(ngModel)]="metaEditando()!.tipoMetrica" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white">
                    @for (tipo of tiposMetrica; track tipo.value) {
                      <option [value]="tipo.value">{{ tipo.label }}</option>
                    }
                  </select>
                </div>
              </div>

              <!-- Escalas de comisi\xF3n -->
              <div class="mb-4">
                <div class="flex justify-between items-center mb-2">
                  <label class="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Escalas de Comisi\xF3n (por % de cumplimiento)
                  </label>
                  <button (click)="agregarEscalaMeta()" class="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                    </svg>
                    Agregar escala
                  </button>
                </div>
                <div class="space-y-2">
                  @for (escala of metaEditando()!.escalas; track $index; let i = $index) {
                    <div class="flex gap-2 items-center flex-wrap">
                      <span class="text-slate-500 text-sm">Desde</span>
                      <input type="number" [(ngModel)]="escala.porcentajeDesde" class="w-20 px-2 py-1.5 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm" placeholder="0">
                      <span class="text-slate-500 text-sm">% hasta</span>
                      <input type="number" [(ngModel)]="escala.porcentajeHasta" class="w-20 px-2 py-1.5 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm" placeholder="100">
                      <span class="text-slate-500 text-sm">% =</span>
                      <span class="text-slate-500 text-sm">S/</span>
                      <input type="number" step="0.01" [(ngModel)]="escala.montoComision" class="w-24 px-2 py-1.5 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm" placeholder="0.00">
                      <button (click)="eliminarEscalaMeta(i)" class="text-red-500 hover:text-red-700 p-1">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                      </button>
                    </div>
                  }
                  @if (metaEditando()!.escalas.length === 0) {
                    <p class="text-sm text-slate-400 italic">No hay escalas configuradas. Agrega al menos una escala.</p>
                  }
                </div>
              </div>

              <div class="flex gap-2">
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
                    <th class="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">Tipo</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Escalas de Comisi\xF3n</th>
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
                      <td class="px-4 py-3 text-sm text-center">
                        <span [class]="meta.tipoMetrica === 'CAPITAL_LIBERADO'
                          ? 'px-2 py-1 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 rounded-full text-xs font-medium'
                          : 'px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-full text-xs font-medium'">
                          {{ meta.tipoMetrica === 'CAPITAL_LIBERADO' ? 'Capital' : 'Recaudo' }}
                        </span>
                      </td>
                      <td class="px-4 py-3 text-sm">
                        <div class="flex flex-wrap gap-1">
                          @for (escala of meta.escalas || []; track escala.id) {
                            <span class="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 rounded text-xs text-blue-700 dark:text-blue-300">
                              {{ escala.porcentajeDesde }}-{{ escala.porcentajeHasta || '100+' }}% = S/{{ escala.montoComision }}
                            </span>
                          }
                          @if (!meta.escalas || meta.escalas.length === 0) {
                            <span class="text-slate-400 italic text-xs">Sin escalas</span>
                          }
                        </div>
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
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <div>
                  <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nombre del Bono</label>
                  <input type="text" [(ngModel)]="bonoEditando()!.nombre" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white" placeholder="Ej: Bono LTD T5">
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Descripci\xF3n</label>
                  <input type="text" [(ngModel)]="bonoEditando()!.descripcion" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white" placeholder="Descripci\xF3n opcional">
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Inquilino</label>
                  <select [(ngModel)]="bonoSelectedInquilino" (change)="onBonoInquilinoChange()" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white">
                    <option [value]="0">Todos (aplica a todas)</option>
                    @for (inq of inquilinos(); track inq.id) {
                      <option [value]="inq.id">{{ inq.nombreInquilino }}</option>
                    }
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Cartera</label>
                  <select [(ngModel)]="bonoSelectedCartera" (change)="onBonoCarteraChange()" [disabled]="!bonoSelectedInquilino" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white disabled:opacity-50">
                    <option [value]="0">Seleccionar...</option>
                    @for (car of bonoCarteras(); track car.id) {
                      <option [value]="car.id">{{ car.nombreCartera }}</option>
                    }
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Subcartera</label>
                  <select [(ngModel)]="bonoEditando()!.idSubcartera" (change)="onBonoSubcarteraChange()" [disabled]="!bonoSelectedCartera" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white disabled:opacity-50">
                    <option [value]="0">Todas (aplica a todas)</option>
                    @for (sub of bonoSubcarteras(); track sub.id) {
                      <option [value]="sub.id">{{ sub.nombreSubcartera }}</option>
                    }
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Campo a Evaluar</label>
                  <select [(ngModel)]="bonoEditando()!.campoEvaluar" (change)="onCampoEvaluarChange()" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white">
                    <option value="">Seleccionar campo...</option>
                    @for (campo of camposDisponibles(); track campo) {
                      <option [value]="campo">{{ comisionesService.getNombreCampo(campo) }}</option>
                    }
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Valor a Buscar</label>
                  <select [(ngModel)]="bonoEditando()!.valorBuscar" [disabled]="!bonoEditando()!.campoEvaluar || cargandoValores()" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white disabled:opacity-50">
                    @if (cargandoValores()) {
                      <option value="">Cargando valores...</option>
                    } @else if (!bonoEditando()!.campoEvaluar) {
                      <option value="">Primero seleccione un campo</option>
                    } @else {
                      <option value="">Seleccionar valor...</option>
                      @for (valor of valoresCampo(); track valor) {
                        <option [value]="valor">{{ valor }}</option>
                      }
                    }
                  </select>
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
                      <div class="flex items-center gap-2">
                        <h4 class="font-semibold text-slate-800 dark:text-white">{{ bono.nombre }}</h4>
                        @if (bono.nombreSubcartera) {
                          <span class="px-2 py-0.5 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 rounded text-xs">
                            {{ bono.nombreSubcartera }}
                          </span>
                        } @else {
                          <span class="px-2 py-0.5 bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400 rounded text-xs">
                            Todas las subcarteras
                          </span>
                        }
                      </div>
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
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Inquilino</label>
              <select [(ngModel)]="reporteInquilino" (change)="onReporteInquilinoChange()" class="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white">
                <option [value]="0">Todos</option>
                @for (inq of inquilinos(); track inq.id) {
                  <option [value]="inq.id">{{ inq.nombreInquilino }}</option>
                }
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Cartera</label>
              <select [(ngModel)]="reporteCartera" (change)="onReporteCarteraChange()" [disabled]="!reporteInquilino" class="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white disabled:opacity-50">
                <option [value]="0">Todas</option>
                @for (car of reporteCarteras(); track car.id) {
                  <option [value]="car.id">{{ car.nombreCartera }}</option>
                }
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Subcartera</label>
              <select [(ngModel)]="reporteSubcartera" [disabled]="!reporteCartera" class="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white disabled:opacity-50">
                <option [value]="0">Todas</option>
                @for (sub of reporteSubcarteras(); track sub.id) {
                  <option [value]="sub.id">{{ sub.nombreSubcartera }}</option>
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

            <!-- Botones de exportaci\xF3n -->
            <div class="flex gap-2 mb-4">
              <button (click)="exportarExcel()" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                Exportar Excel
              </button>
              <button (click)="exportarPdf()" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                </svg>
                Exportar PDF
              </button>
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

      <!-- ==================== TAB: BASE DE AJUSTE ==================== -->
      @if (activeTab() === 'baseAjuste') {
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-6">
          <div class="flex justify-between items-start mb-6">
            <div>
              <h2 class="text-lg font-semibold text-slate-800 dark:text-white">Base de Ajuste</h2>
              <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Reporte de promesas pagadas con fecha de env\xEDo para control de ajustes
              </p>
            </div>
          </div>

          <!-- Filtros y acciones -->
          <div class="flex flex-wrap gap-4 items-end mb-6">
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">A\xF1o</label>
              <select [(ngModel)]="filtroAnio" (change)="cargarEstadisticasBaseAjuste()" class="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white">
                @for (a of aniosDisponibles; track a) {
                  <option [value]="a">{{ a }}</option>
                }
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Mes</label>
              <select [(ngModel)]="filtroMes" (change)="cargarEstadisticasBaseAjuste()" class="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white">
                @for (m of mesesDisponibles; track m.value) {
                  <option [value]="m.value">{{ m.label }}</option>
                }
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Inquilino</label>
              <select [(ngModel)]="baseAjusteInquilino" (change)="onBaseAjusteInquilinoChange()" class="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white">
                <option [value]="0">Todos</option>
                @for (inq of inquilinos(); track inq.id) {
                  <option [value]="inq.id">{{ inq.nombreInquilino }}</option>
                }
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Cartera</label>
              <select [(ngModel)]="baseAjusteCartera" (change)="onBaseAjusteCarteraChange()" [disabled]="!baseAjusteInquilino" class="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white disabled:opacity-50">
                <option [value]="0">Todas</option>
                @for (car of baseAjusteCarteras(); track car.id) {
                  <option [value]="car.id">{{ car.nombreCartera }}</option>
                }
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Subcartera</label>
              <select [(ngModel)]="baseAjusteSubcartera" (change)="onBaseAjusteSubcarteraChange()" [disabled]="!baseAjusteCartera" class="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white disabled:opacity-50">
                <option [value]="0">Todas</option>
                @for (sub of baseAjusteSubcarteras(); track sub.id) {
                  <option [value]="sub.id">{{ sub.nombreSubcartera }}</option>
                }
              </select>
            </div>
            <button
              (click)="agregarEnvioBaseAjuste()"
              [disabled]="isLoading()"
              class="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-slate-400 transition-colors flex items-center gap-2"
            >
              @if (isLoading()) {
                <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
              } @else {
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
              }
              Agregar al Env\xEDo
            </button>
            <button
              (click)="exportarBaseAjusteExcel()"
              [disabled]="isLoading() || !estadisticasBaseAjuste() || estadisticasBaseAjuste()!.total_registros === 0"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-slate-400 transition-colors flex items-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              Exportar Excel
            </button>
          </div>

          <!-- Estad\xEDsticas -->
          @if (estadisticasBaseAjuste()) {
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div class="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                <p class="text-sm text-orange-600 dark:text-orange-400 font-medium">Total Registros</p>
                <p class="text-2xl font-bold text-orange-800 dark:text-orange-300">{{ estadisticasBaseAjuste()!.total_registros }}</p>
              </div>
              <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <p class="text-sm text-blue-600 dark:text-blue-400 font-medium">Total Env\xEDos</p>
                <p class="text-2xl font-bold text-blue-800 dark:text-blue-300">{{ estadisticasBaseAjuste()!.total_envios }}</p>
              </div>
              <div class="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                <p class="text-sm text-purple-600 dark:text-purple-400 font-medium">Asesores</p>
                <p class="text-2xl font-bold text-purple-800 dark:text-purple-300">{{ estadisticasBaseAjuste()!.total_asesores }}</p>
              </div>
              <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <p class="text-sm text-green-600 dark:text-green-400 font-medium">Monto Total</p>
                <p class="text-2xl font-bold text-green-800 dark:text-green-300">S/ {{ formatMonto(estadisticasBaseAjuste()!.monto_total) }}</p>
              </div>
            </div>

            @if (estadisticasBaseAjuste()!.primer_envio) {
              <div class="bg-slate-50 dark:bg-slate-700/30 rounded-lg p-4 mb-4">
                <div class="flex flex-wrap gap-6">
                  <div>
                    <span class="text-sm text-slate-500 dark:text-slate-400">Primer env\xEDo:</span>
                    <span class="ml-2 font-medium text-slate-700 dark:text-slate-300">{{ estadisticasBaseAjuste()!.primer_envio }}</span>
                  </div>
                  <div>
                    <span class="text-sm text-slate-500 dark:text-slate-400">\xDAltimo env\xEDo:</span>
                    <span class="ml-2 font-medium text-slate-700 dark:text-slate-300">{{ estadisticasBaseAjuste()!.ultimo_envio }}</span>
                  </div>
                </div>
              </div>
            }
          } @else {
            <div class="text-center py-12 text-slate-500 dark:text-slate-400">
              <svg class="w-12 h-12 mx-auto mb-4 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              <p>No hay env\xEDos registrados para este per\xEDodo</p>
              <p class="text-sm mt-2">Haz clic en "Agregar al Env\xEDo" para incluir las promesas pagadas del mes</p>
            </div>
          }

          <!-- Informaci\xF3n -->
          <div class="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <div class="flex gap-3">
              <svg class="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <div class="text-sm text-amber-700 dark:text-amber-300">
                <p class="font-medium mb-1">\xBFC\xF3mo funciona?</p>
                <ul class="list-disc list-inside space-y-1 text-amber-600 dark:text-amber-400">
                  <li>Al hacer clic en "Agregar al Env\xEDo", se buscan promesas con estado PAGADA del mes seleccionado</li>
                  <li>Los nuevos registros se marcan con la fecha de hoy como "Fecha de Env\xEDo"</li>
                  <li>Los registros ya agregados mantienen su fecha de env\xEDo original</li>
                  <li>El Excel incluye: Asesor, Fecha Env\xEDo, DNI, Fecha Pago, Monto, Concepto, Capital, Deuda Total, Per\xEDodo, Tramo y Canal de Pago</li>
                </ul>
              </div>
            </div>
          </div>
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
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ComisionesPage, { className: "ComisionesPage", filePath: "src/app/comisiones/pages/comisiones.page.ts", lineNumber: 820 });
})();
export {
  ComisionesPage
};
//# sourceMappingURL=chunk-S2KMWUKA.js.map
