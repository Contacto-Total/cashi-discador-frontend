import {
  DefaultValueAccessor,
  FormsModule,
  MaxLengthValidator,
  MinValidator,
  NgControlStatus,
  NgControlStatusGroup,
  NgForm,
  NgModel,
  NgSelectOption,
  NumberValueAccessor,
  RequiredValidator,
  SelectControlValueAccessor,
  ɵNgNoValidate,
  ɵNgSelectMultipleOption
} from "./chunk-GRJ7XAPD.js";
import {
  environment
} from "./chunk-QF774CZR.js";
import {
  CommonModule,
  Component,
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
  ɵɵclassProp,
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
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-CTRHJBBW.js";

// src/app/pagos-bancarios/services/bcp-pagos.service.ts
var _BcpPagosService = class _BcpPagosService {
  constructor(http) {
    this.http = http;
    this.baseUrl = `${environment.gatewayUrl}/pagos-bcp`;
  }
  /**
   * Carga y procesa un archivo CREP del BCP
   * @param file Archivo TXT a procesar
   * @returns Resultado con cabecera y detalles de pagos
   */
  cargarArchivo(file) {
    const formData = new FormData();
    formData.append("file", file);
    console.log("[BCP] Cargando archivo:", file.name);
    return this.http.post(`${this.baseUrl}/cargar-archivo`, formData);
  }
  /**
   * Carga y procesa un archivo Excel de Financiera OH
   * @param file Archivo Excel a procesar
   * @returns Resultado con detalles de pagos
   */
  cargarArchivoOh(file) {
    const formData = new FormData();
    formData.append("file", file);
    console.log("[OH] Cargando archivo Excel:", file.name);
    return this.http.post(`${this.baseUrl}/cargar-archivo-oh`, formData);
  }
  /**
   * Registra un pago de forma manual
   * @param pago Datos del pago manual
   * @returns Resultado del registro
   */
  registrarPagoManual(pago) {
    console.log("[BCP] Registrando pago manual:", pago);
    return this.http.post(`${this.baseUrl}/registrar-manual`, pago);
  }
  /**
   * Verifica el estado del servicio
   */
  verificarEstado() {
    return this.http.get(`${this.baseUrl}/status`);
  }
  // ============== PAGOS MANUALES ==============
  /**
   * Lista pagos manuales con filtros y paginación
   */
  listarPagosManuales(filtros = {}) {
    let params = new HttpParams();
    if (filtros.documento)
      params = params.set("documento", filtros.documento);
    if (filtros.banco)
      params = params.set("banco", filtros.banco);
    if (filtros.medioAtencion)
      params = params.set("medioAtencion", filtros.medioAtencion);
    if (filtros.fechaDesde)
      params = params.set("fechaDesde", filtros.fechaDesde);
    if (filtros.fechaHasta)
      params = params.set("fechaHasta", filtros.fechaHasta);
    if (filtros.page)
      params = params.set("page", filtros.page.toString());
    if (filtros.size)
      params = params.set("size", filtros.size.toString());
    console.log("[BCP] Listando pagos manuales con filtros:", filtros);
    return this.http.get(`${this.baseUrl}/manuales`, { params });
  }
  /**
   * Actualiza un pago manual
   */
  actualizarPagoManual(id, pago) {
    console.log("[BCP] Actualizando pago manual ID:", id, pago);
    return this.http.put(`${this.baseUrl}/manuales/${id}`, pago);
  }
  /**
   * Elimina un pago manual
   */
  eliminarPagoManual(id) {
    console.log("[BCP] Eliminando pago manual ID:", id);
    return this.http.delete(`${this.baseUrl}/manuales/${id}`);
  }
};
_BcpPagosService.\u0275fac = function BcpPagosService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _BcpPagosService)(\u0275\u0275inject(HttpClient));
};
_BcpPagosService.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _BcpPagosService, factory: _BcpPagosService.\u0275fac, providedIn: "root" });
var BcpPagosService = _BcpPagosService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BcpPagosService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{ type: HttpClient }], null);
})();

// src/app/pagos-bancarios/pages/pagos-bancarios.page.ts
var _forTrack0 = ($index, $item) => $item.numeroFila;
var _forTrack1 = ($index, $item) => $item.id;
function PagosBancariosPage_Conditional_21_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 23);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "p", 24);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_2_0;
    let tmp_3_0;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate((tmp_2_0 = ctx_r1.selectedFile()) == null ? null : tmp_2_0.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.formatFileSize(((tmp_3_0 = ctx_r1.selectedFile()) == null ? null : tmp_3_0.size) || 0));
  }
}
function PagosBancariosPage_Conditional_21_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 25)(1, "span", 26);
    \u0275\u0275text(2, "Click para seleccionar");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3, " o arrastra el archivo ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p", 27);
    \u0275\u0275text(5, "Solo archivos TXT");
    \u0275\u0275elementEnd();
  }
}
function PagosBancariosPage_Conditional_21_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(0, "svg", 28);
    \u0275\u0275element(1, "circle", 29)(2, "path", 30);
    \u0275\u0275elementEnd();
    \u0275\u0275text(3, " Procesando... ");
  }
}
function PagosBancariosPage_Conditional_21_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(0, "svg", 7);
    \u0275\u0275element(1, "path", 31);
    \u0275\u0275elementEnd();
    \u0275\u0275text(2, " Procesar Archivo ");
  }
}
function PagosBancariosPage_Conditional_21_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 22)(1, "p", 32);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.errorMessage());
  }
}
function PagosBancariosPage_Conditional_21_Conditional_16_Conditional_0_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 41);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_4_0;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("(", (tmp_4_0 = ctx_r1.resultado()) == null ? null : tmp_4_0.duplicadosOmitidos, " duplicados)");
  }
}
function PagosBancariosPage_Conditional_21_Conditional_16_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 33);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(1, "svg", 36);
    \u0275\u0275element(2, "path", 37);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(3, "div")(4, "p", 38);
    \u0275\u0275text(5, "Archivo guardado correctamente");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p", 39);
    \u0275\u0275text(7, " ID: ");
    \u0275\u0275elementStart(8, "span", 40);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275text(10);
    \u0275\u0275conditionalCreate(11, PagosBancariosPage_Conditional_21_Conditional_16_Conditional_0_Conditional_11_Template, 2, 1, "span", 41);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    let tmp_3_0;
    let tmp_4_0;
    let tmp_5_0;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(9);
    \u0275\u0275textInterpolate((tmp_3_0 = ctx_r1.resultado()) == null ? null : tmp_3_0.archivoId);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" - ", (tmp_4_0 = ctx_r1.resultado()) == null ? null : tmp_4_0.registrosProcesados, " registros ");
    \u0275\u0275advance();
    \u0275\u0275conditional(((tmp_5_0 = ctx_r1.resultado()) == null ? null : tmp_5_0.duplicadosOmitidos) && ctx_r1.resultado().duplicadosOmitidos > 0 ? 11 : -1);
  }
}
function PagosBancariosPage_Conditional_21_Conditional_16_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 34);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(1, "svg", 42);
    \u0275\u0275element(2, "path", 43);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(3, "div")(4, "p", 44);
    \u0275\u0275text(5, "Archivo ya procesado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p", 45);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    let tmp_3_0;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate1("", (tmp_3_0 = ctx_r1.resultado()) == null ? null : tmp_3_0.duplicadosOmitidos, " registros ya existen");
  }
}
function PagosBancariosPage_Conditional_21_Conditional_16_Conditional_2_For_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr", 55)(1, "td", 56);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td", 57);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td", 58);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "td", 57);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "td", 57);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "td", 57);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "td", 57);
    \u0275\u0275text(14);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const d_r3 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(d_r3.documento || d_r3.codigoDepositante);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(d_r3.fechaPago);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("S/ ", ctx_r1.formatMonto(d_r3.montoPagado));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(d_r3.numeroOperacion);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(d_r3.sucursal);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(d_r3.terminal);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(d_r3.agencia);
  }
}
function PagosBancariosPage_Conditional_21_Conditional_16_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 35)(1, "div", 46)(2, "h2", 47);
    \u0275\u0275text(3, "Detalle de Pagos");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 48);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 49)(7, "table", 50)(8, "thead", 51)(9, "tr")(10, "th", 52);
    \u0275\u0275text(11, "Documento");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th", 52);
    \u0275\u0275text(13, "Fecha");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "th", 53);
    \u0275\u0275text(15, "Monto");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "th", 52);
    \u0275\u0275text(17, "Nro. Op.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "th", 52);
    \u0275\u0275text(19, "Sucursal");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "th", 52);
    \u0275\u0275text(21, "Terminal");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "th", 52);
    \u0275\u0275text(23, "Agencia");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(24, "tbody", 54);
    \u0275\u0275repeaterCreate(25, PagosBancariosPage_Conditional_21_Conditional_16_Conditional_2_For_26_Template, 15, 7, "tr", 55, _forTrack0);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    let tmp_3_0;
    let tmp_4_0;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("", (tmp_3_0 = ctx_r1.resultado()) == null ? null : tmp_3_0.detalles == null ? null : tmp_3_0.detalles.length, " registros");
    \u0275\u0275advance(20);
    \u0275\u0275repeater((tmp_4_0 = ctx_r1.resultado()) == null ? null : tmp_4_0.detalles);
  }
}
function PagosBancariosPage_Conditional_21_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, PagosBancariosPage_Conditional_21_Conditional_16_Conditional_0_Template, 12, 3, "div", 33);
    \u0275\u0275conditionalCreate(1, PagosBancariosPage_Conditional_21_Conditional_16_Conditional_1_Template, 8, 1, "div", 34);
    \u0275\u0275conditionalCreate(2, PagosBancariosPage_Conditional_21_Conditional_16_Conditional_2_Template, 27, 1, "div", 35);
  }
  if (rf & 2) {
    let tmp_2_0;
    let tmp_3_0;
    let tmp_4_0;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275conditional(((tmp_2_0 = ctx_r1.resultado()) == null ? null : tmp_2_0.exitoso) && ((tmp_2_0 = ctx_r1.resultado()) == null ? null : tmp_2_0.archivoId) ? 0 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(!((tmp_3_0 = ctx_r1.resultado()) == null ? null : tmp_3_0.exitoso) && ((tmp_3_0 = ctx_r1.resultado()) == null ? null : tmp_3_0.duplicadosOmitidos) && ctx_r1.resultado().duplicadosOmitidos > 0 ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(((tmp_4_0 = ctx_r1.resultado()) == null ? null : tmp_4_0.detalles) && ctx_r1.resultado().detalles.length > 0 ? 2 : -1);
  }
}
function PagosBancariosPage_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 12)(1, "h2", 13);
    \u0275\u0275text(2, " Cargar Archivo BCP (formato CREP) ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 14)(4, "div", 15)(5, "label", 16)(6, "div", 17);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(7, "svg", 18);
    \u0275\u0275element(8, "path", 19);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(9, PagosBancariosPage_Conditional_21_Conditional_9_Template, 4, 2)(10, PagosBancariosPage_Conditional_21_Conditional_10_Template, 6, 0);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(11, "input", 20);
    \u0275\u0275listener("change", function PagosBancariosPage_Conditional_21_Template_input_change_11_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onFileSelected($event));
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(12, "button", 21);
    \u0275\u0275listener("click", function PagosBancariosPage_Conditional_21_Template_button_click_12_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.procesarArchivo());
    });
    \u0275\u0275conditionalCreate(13, PagosBancariosPage_Conditional_21_Conditional_13_Template, 4, 0)(14, PagosBancariosPage_Conditional_21_Conditional_14_Template, 3, 0);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(15, PagosBancariosPage_Conditional_21_Conditional_15_Template, 3, 1, "div", 22);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(16, PagosBancariosPage_Conditional_21_Conditional_16_Template, 3, 3);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(9);
    \u0275\u0275conditional(ctx_r1.selectedFile() ? 9 : 10);
    \u0275\u0275advance(3);
    \u0275\u0275property("disabled", !ctx_r1.selectedFile() || ctx_r1.isLoading());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.isLoading() ? 13 : 14);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.errorMessage() ? 15 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.resultado() ? 16 : -1);
  }
}
function PagosBancariosPage_Conditional_22_Conditional_13_Conditional_68_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 110);
    \u0275\u0275listener("click", function PagosBancariosPage_Conditional_22_Conditional_13_Conditional_68_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.cancelarEdicion());
    });
    \u0275\u0275text(1, " Cancelar ");
    \u0275\u0275elementEnd();
  }
}
function PagosBancariosPage_Conditional_22_Conditional_13_Conditional_70_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(0, "svg", 28);
    \u0275\u0275element(1, "circle", 29)(2, "path", 111);
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", ctx_r1.editingPago() ? "Actualizando..." : "Guardando...", " ");
  }
}
function PagosBancariosPage_Conditional_22_Conditional_13_Conditional_71_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(0, "svg", 7);
    \u0275\u0275element(1, "path", 112);
    \u0275\u0275elementEnd();
    \u0275\u0275text(2);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r1.editingPago() ? "Actualizar Pago" : "Registrar Pago", " ");
  }
}
function PagosBancariosPage_Conditional_22_Conditional_13_Conditional_72_Conditional_1_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 39);
    \u0275\u0275text(1, " ID: ");
    \u0275\u0275elementStart(2, "span", 40);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_5_0;
    let tmp_6_0;
    const ctx_r1 = \u0275\u0275nextContext(5);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate((tmp_5_0 = ctx_r1.resultadoManual()) == null ? null : tmp_5_0.pagoId);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2(" - Doc: ", (tmp_6_0 = ctx_r1.resultadoManual()) == null ? null : tmp_6_0.documento, " - S/ ", ctx_r1.formatMonto((tmp_6_0 = ctx_r1.resultadoManual()) == null ? null : tmp_6_0.monto), " ");
  }
}
function PagosBancariosPage_Conditional_22_Conditional_13_Conditional_72_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(0, "svg", 114);
    \u0275\u0275element(1, "path", 37);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(2, "div")(3, "p", 38);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(5, PagosBancariosPage_Conditional_22_Conditional_13_Conditional_72_Conditional_1_Conditional_5_Template, 5, 3, "p", 39);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_4_0;
    let tmp_5_0;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate((tmp_4_0 = ctx_r1.resultadoManual()) == null ? null : tmp_4_0.mensaje);
    \u0275\u0275advance();
    \u0275\u0275conditional(((tmp_5_0 = ctx_r1.resultadoManual()) == null ? null : tmp_5_0.pagoId) ? 5 : -1);
  }
}
function PagosBancariosPage_Conditional_22_Conditional_13_Conditional_72_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(0, "svg", 115);
    \u0275\u0275element(1, "path", 116);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(2, "p", 117);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_4_0;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate((tmp_4_0 = ctx_r1.resultadoManual()) == null ? null : tmp_4_0.mensaje);
  }
}
function PagosBancariosPage_Conditional_22_Conditional_13_Conditional_72_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 113);
    \u0275\u0275conditionalCreate(1, PagosBancariosPage_Conditional_22_Conditional_13_Conditional_72_Conditional_1_Template, 6, 2)(2, PagosBancariosPage_Conditional_22_Conditional_13_Conditional_72_Conditional_2_Template, 4, 1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_3_0;
    let tmp_4_0;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275classMap(((tmp_3_0 = ctx_r1.resultadoManual()) == null ? null : tmp_3_0.exitoso) ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800" : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800");
    \u0275\u0275advance();
    \u0275\u0275conditional(((tmp_4_0 = ctx_r1.resultadoManual()) == null ? null : tmp_4_0.exitoso) ? 1 : 2);
  }
}
function PagosBancariosPage_Conditional_22_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 66)(1, "form", 94);
    \u0275\u0275listener("ngSubmit", function PagosBancariosPage_Conditional_22_Conditional_13_Template_form_ngSubmit_1_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.editingPago() ? ctx_r1.actualizarPago() : ctx_r1.registrarPagoManual());
    });
    \u0275\u0275elementStart(2, "div", 95)(3, "div")(4, "label", 96);
    \u0275\u0275text(5, " Documento (DNI) ");
    \u0275\u0275elementStart(6, "span", 97);
    \u0275\u0275text(7, "*");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "input", 98);
    \u0275\u0275twoWayListener("ngModelChange", function PagosBancariosPage_Conditional_22_Conditional_13_Template_input_ngModelChange_8_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.pagoManual.documento, $event) || (ctx_r1.pagoManual.documento = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "div")(10, "label", 96);
    \u0275\u0275text(11, " Fecha de Pago ");
    \u0275\u0275elementStart(12, "span", 97);
    \u0275\u0275text(13, "*");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "input", 99);
    \u0275\u0275twoWayListener("ngModelChange", function PagosBancariosPage_Conditional_22_Conditional_13_Template_input_ngModelChange_14_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.pagoManual.fechaPago, $event) || (ctx_r1.pagoManual.fechaPago = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "div")(16, "label", 96);
    \u0275\u0275text(17, " Monto (S/) ");
    \u0275\u0275elementStart(18, "span", 97);
    \u0275\u0275text(19, "*");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(20, "input", 100);
    \u0275\u0275twoWayListener("ngModelChange", function PagosBancariosPage_Conditional_22_Conditional_13_Template_input_ngModelChange_20_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.pagoManual.monto, $event) || (ctx_r1.pagoManual.monto = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(21, "div")(22, "label", 96);
    \u0275\u0275text(23, " Nro. Operaci\xF3n ");
    \u0275\u0275elementStart(24, "span", 97);
    \u0275\u0275text(25, "*");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(26, "input", 101);
    \u0275\u0275twoWayListener("ngModelChange", function PagosBancariosPage_Conditional_22_Conditional_13_Template_input_ngModelChange_26_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.pagoManual.numeroOperacion, $event) || (ctx_r1.pagoManual.numeroOperacion = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(27, "div")(28, "label", 96);
    \u0275\u0275text(29, " Banco ");
    \u0275\u0275elementStart(30, "span", 97);
    \u0275\u0275text(31, "*");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(32, "select", 102);
    \u0275\u0275twoWayListener("ngModelChange", function PagosBancariosPage_Conditional_22_Conditional_13_Template_select_ngModelChange_32_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.pagoManual.banco, $event) || (ctx_r1.pagoManual.banco = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(33, "option", 74);
    \u0275\u0275text(34, "BCP - Banco de Cr\xE9dito");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(35, "option", 75);
    \u0275\u0275text(36, "Interbank");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(37, "option", 76);
    \u0275\u0275text(38, "BBVA Continental");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(39, "option", 77);
    \u0275\u0275text(40, "Scotiabank");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(41, "option", 78);
    \u0275\u0275text(42, "BanBif");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(43, "option", 79);
    \u0275\u0275text(44, "Banco de la Naci\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(45, "option", 80);
    \u0275\u0275text(46, "Otro");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(47, "div")(48, "label", 96);
    \u0275\u0275text(49, " Medio de Atenci\xF3n ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(50, "select", 103);
    \u0275\u0275twoWayListener("ngModelChange", function PagosBancariosPage_Conditional_22_Conditional_13_Template_select_ngModelChange_50_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.pagoManual.medioAtencion, $event) || (ctx_r1.pagoManual.medioAtencion = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(51, "option", 73);
    \u0275\u0275text(52, "Seleccionar...");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(53, "option", 81);
    \u0275\u0275text(54, "Ventanilla");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(55, "option", 82);
    \u0275\u0275text(56, "Agente BCP");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(57, "option", 83);
    \u0275\u0275text(58, "App M\xF3vil");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(59, "option", 84);
    \u0275\u0275text(60, "Banca por Internet");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(61, "option", 80);
    \u0275\u0275text(62, "Otro");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(63, "div", 104)(64, "label", 96);
    \u0275\u0275text(65, " Observaciones ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(66, "textarea", 105);
    \u0275\u0275twoWayListener("ngModelChange", function PagosBancariosPage_Conditional_22_Conditional_13_Template_textarea_ngModelChange_66_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.pagoManual.observaciones, $event) || (ctx_r1.pagoManual.observaciones = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(67, "div", 106);
    \u0275\u0275conditionalCreate(68, PagosBancariosPage_Conditional_22_Conditional_13_Conditional_68_Template, 2, 0, "button", 107);
    \u0275\u0275elementStart(69, "button", 108);
    \u0275\u0275conditionalCreate(70, PagosBancariosPage_Conditional_22_Conditional_13_Conditional_70_Template, 4, 1)(71, PagosBancariosPage_Conditional_22_Conditional_13_Conditional_71_Template, 3, 1);
    \u0275\u0275elementEnd()()();
    \u0275\u0275conditionalCreate(72, PagosBancariosPage_Conditional_22_Conditional_13_Conditional_72_Template, 3, 3, "div", 109);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(8);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.pagoManual.documento);
    \u0275\u0275advance(6);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.pagoManual.fechaPago);
    \u0275\u0275advance(6);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.pagoManual.monto);
    \u0275\u0275advance(6);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.pagoManual.numeroOperacion);
    \u0275\u0275advance(6);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.pagoManual.banco);
    \u0275\u0275advance(18);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.pagoManual.medioAtencion);
    \u0275\u0275advance(16);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.pagoManual.observaciones);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.editingPago() ? 68 : -1);
    \u0275\u0275advance();
    \u0275\u0275classMap(ctx_r1.editingPago() ? "bg-amber-600 hover:bg-amber-700" : "bg-green-600 hover:bg-green-700");
    \u0275\u0275property("disabled", ctx_r1.isLoadingManual() || !ctx_r1.pagoManual.documento || !ctx_r1.pagoManual.fechaPago || !ctx_r1.pagoManual.monto || !ctx_r1.pagoManual.numeroOperacion);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.isLoadingManual() ? 70 : 71);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.resultadoManual() ? 72 : -1);
  }
}
function PagosBancariosPage_Conditional_22_Conditional_78_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 92);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(1, "svg", 118);
    \u0275\u0275element(2, "circle", 29)(3, "path", 111);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(4, "p", 119);
    \u0275\u0275text(5, "Cargando...");
    \u0275\u0275elementEnd()();
  }
}
function PagosBancariosPage_Conditional_22_Conditional_79_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 93);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(1, "svg", 120);
    \u0275\u0275element(2, "path", 8);
    \u0275\u0275elementEnd();
    \u0275\u0275text(3, " No hay pagos manuales registrados ");
    \u0275\u0275elementEnd();
  }
}
function PagosBancariosPage_Conditional_22_Conditional_80_For_22_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 125);
    \u0275\u0275text(1, " Conciliado ");
    \u0275\u0275elementEnd();
  }
}
function PagosBancariosPage_Conditional_22_Conditional_80_For_22_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 126);
    \u0275\u0275text(1, " Procesado ");
    \u0275\u0275elementEnd();
  }
}
function PagosBancariosPage_Conditional_22_Conditional_80_For_22_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 127);
    \u0275\u0275text(1, " Pendiente ");
    \u0275\u0275elementEnd();
  }
}
function PagosBancariosPage_Conditional_22_Conditional_80_For_22_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr", 55)(1, "td", 56);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td", 123);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td", 58);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "td", 123);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "td", 123);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "td", 123);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "td", 124);
    \u0275\u0275conditionalCreate(14, PagosBancariosPage_Conditional_22_Conditional_80_For_22_Conditional_14_Template, 2, 0, "span", 125)(15, PagosBancariosPage_Conditional_22_Conditional_80_For_22_Conditional_15_Template, 2, 0, "span", 126)(16, PagosBancariosPage_Conditional_22_Conditional_80_For_22_Conditional_16_Template, 2, 0, "span", 127);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "td", 124)(18, "div", 128)(19, "button", 129);
    \u0275\u0275listener("click", function PagosBancariosPage_Conditional_22_Conditional_80_For_22_Template_button_click_19_listener() {
      const pago_r8 = \u0275\u0275restoreView(_r7).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.editarPago(pago_r8));
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(20, "svg", 88);
    \u0275\u0275element(21, "path", 9);
    \u0275\u0275elementEnd()();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(22, "button", 130);
    \u0275\u0275listener("click", function PagosBancariosPage_Conditional_22_Conditional_80_For_22_Template_button_click_22_listener() {
      const pago_r8 = \u0275\u0275restoreView(_r7).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.confirmarEliminar(pago_r8));
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(23, "svg", 88);
    \u0275\u0275element(24, "path", 131);
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const pago_r8 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(pago_r8.documento);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(pago_r8.fechaBanco);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("S/ ", ctx_r1.formatMonto(pago_r8.montoBanco));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(pago_r8.numeroOperacion);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(pago_r8.banco);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(pago_r8.medioAtencion || "-");
    \u0275\u0275advance(2);
    \u0275\u0275conditional(pago_r8.cuotaAplicadaId ? 14 : pago_r8.procesado ? 15 : 16);
    \u0275\u0275advance(8);
    \u0275\u0275property("disabled", pago_r8.cuotaAplicadaId !== null && pago_r8.cuotaAplicadaId !== void 0);
  }
}
function PagosBancariosPage_Conditional_22_Conditional_80_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 122)(1, "button", 132);
    \u0275\u0275listener("click", function PagosBancariosPage_Conditional_22_Conditional_80_Conditional_23_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.cambiarPagina(ctx_r1.currentPage() - 1));
    });
    \u0275\u0275text(2, " Anterior ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 133);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "button", 132);
    \u0275\u0275listener("click", function PagosBancariosPage_Conditional_22_Conditional_80_Conditional_23_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.cambiarPagina(ctx_r1.currentPage() + 1));
    });
    \u0275\u0275text(6, " Siguiente ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r1.currentPage() <= 1);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2(" P\xE1gina ", ctx_r1.currentPage(), " de ", ctx_r1.totalPages(), " ");
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r1.currentPage() >= ctx_r1.totalPages());
  }
}
function PagosBancariosPage_Conditional_22_Conditional_80_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 49)(1, "table", 50)(2, "thead", 51)(3, "tr")(4, "th", 52);
    \u0275\u0275text(5, "Documento");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th", 52);
    \u0275\u0275text(7, "Fecha");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th", 53);
    \u0275\u0275text(9, "Monto");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th", 52);
    \u0275\u0275text(11, "Nro. Op.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th", 52);
    \u0275\u0275text(13, "Banco");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "th", 52);
    \u0275\u0275text(15, "Medio");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "th", 121);
    \u0275\u0275text(17, "Estado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "th", 121);
    \u0275\u0275text(19, "Acciones");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(20, "tbody", 54);
    \u0275\u0275repeaterCreate(21, PagosBancariosPage_Conditional_22_Conditional_80_For_22_Template, 25, 8, "tr", 55, _forTrack1);
    \u0275\u0275elementEnd()()();
    \u0275\u0275conditionalCreate(23, PagosBancariosPage_Conditional_22_Conditional_80_Conditional_23_Template, 7, 4, "div", 122);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(21);
    \u0275\u0275repeater(ctx_r1.pagosManuales());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.totalPages() > 1 ? 23 : -1);
  }
}
function PagosBancariosPage_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 59)(1, "button", 60);
    \u0275\u0275listener("click", function PagosBancariosPage_Conditional_22_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.toggleFormulario());
    });
    \u0275\u0275elementStart(2, "div", 61)(3, "div", 62);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(4, "svg", 7);
    \u0275\u0275element(5, "path", 9);
    \u0275\u0275elementEnd()();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(6, "div", 63)(7, "h2", 47);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "p", 48);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()()();
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(11, "svg", 64);
    \u0275\u0275element(12, "path", 65);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(13, PagosBancariosPage_Conditional_22_Conditional_13_Template, 73, 13, "div", 66);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(14, "div", 35)(15, "div", 67)(16, "h2", 13);
    \u0275\u0275text(17, " Historial de Pagos Manuales ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "div", 68)(19, "div")(20, "label", 69);
    \u0275\u0275text(21, "Documento");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "input", 70);
    \u0275\u0275twoWayListener("ngModelChange", function PagosBancariosPage_Conditional_22_Template_input_ngModelChange_22_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.filtros.documento, $event) || (ctx_r1.filtros.documento = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(23, "div")(24, "label", 69);
    \u0275\u0275text(25, "Desde");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "input", 71);
    \u0275\u0275twoWayListener("ngModelChange", function PagosBancariosPage_Conditional_22_Template_input_ngModelChange_26_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.filtros.fechaDesde, $event) || (ctx_r1.filtros.fechaDesde = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(27, "div")(28, "label", 69);
    \u0275\u0275text(29, "Hasta");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(30, "input", 71);
    \u0275\u0275twoWayListener("ngModelChange", function PagosBancariosPage_Conditional_22_Template_input_ngModelChange_30_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.filtros.fechaHasta, $event) || (ctx_r1.filtros.fechaHasta = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(31, "div")(32, "label", 69);
    \u0275\u0275text(33, "Banco");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(34, "select", 72);
    \u0275\u0275twoWayListener("ngModelChange", function PagosBancariosPage_Conditional_22_Template_select_ngModelChange_34_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.filtros.banco, $event) || (ctx_r1.filtros.banco = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(35, "option", 73);
    \u0275\u0275text(36, "Todos");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(37, "option", 74);
    \u0275\u0275text(38, "BCP");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(39, "option", 75);
    \u0275\u0275text(40, "Interbank");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(41, "option", 76);
    \u0275\u0275text(42, "BBVA");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(43, "option", 77);
    \u0275\u0275text(44, "Scotiabank");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(45, "option", 78);
    \u0275\u0275text(46, "BanBif");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(47, "option", 79);
    \u0275\u0275text(48, "Banco de la Naci\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(49, "option", 80);
    \u0275\u0275text(50, "Otro");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(51, "div")(52, "label", 69);
    \u0275\u0275text(53, "Medio");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(54, "select", 72);
    \u0275\u0275twoWayListener("ngModelChange", function PagosBancariosPage_Conditional_22_Template_select_ngModelChange_54_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.filtros.medioAtencion, $event) || (ctx_r1.filtros.medioAtencion = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(55, "option", 73);
    \u0275\u0275text(56, "Todos");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(57, "option", 81);
    \u0275\u0275text(58, "Ventanilla");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(59, "option", 82);
    \u0275\u0275text(60, "Agente BCP");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(61, "option", 83);
    \u0275\u0275text(62, "App M\xF3vil");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(63, "option", 84);
    \u0275\u0275text(64, "Banca por Internet");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(65, "option", 85);
    \u0275\u0275text(66, "Manual");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(67, "option", 80);
    \u0275\u0275text(68, "Otro");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(69, "div", 86)(70, "button", 87);
    \u0275\u0275listener("click", function PagosBancariosPage_Conditional_22_Template_button_click_70_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.cargarPagosManuales());
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(71, "svg", 88);
    \u0275\u0275element(72, "path", 89);
    \u0275\u0275elementEnd();
    \u0275\u0275text(73, " Buscar ");
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(74, "button", 90);
    \u0275\u0275listener("click", function PagosBancariosPage_Conditional_22_Template_button_click_74_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.limpiarFiltros());
    });
    \u0275\u0275text(75, " Limpiar ");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(76, "div", 91);
    \u0275\u0275text(77);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(78, PagosBancariosPage_Conditional_22_Conditional_78_Template, 6, 0, "div", 92)(79, PagosBancariosPage_Conditional_22_Conditional_79_Template, 4, 0, "div", 93)(80, PagosBancariosPage_Conditional_22_Conditional_80_Template, 24, 1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275classMap(ctx_r1.editingPago() ? "bg-amber-100 dark:bg-amber-900/30" : "bg-blue-100 dark:bg-blue-900/30");
    \u0275\u0275advance();
    \u0275\u0275classMap(ctx_r1.editingPago() ? "text-amber-600" : "text-blue-600");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", ctx_r1.editingPago() ? "Editar Pago Manual" : "Registrar Pago Manual", " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r1.formExpanded() ? "Clic para minimizar" : "Clic para expandir", " ");
    \u0275\u0275advance();
    \u0275\u0275classProp("rotate-180", ctx_r1.formExpanded());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.formExpanded() ? 13 : -1);
    \u0275\u0275advance(9);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.filtros.documento);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.filtros.fechaDesde);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.filtros.fechaHasta);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.filtros.banco);
    \u0275\u0275advance(20);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.filtros.medioAtencion);
    \u0275\u0275advance(23);
    \u0275\u0275textInterpolate2(" Mostrando ", ctx_r1.pagosManuales().length, " de ", ctx_r1.totalRegistros(), " registros ");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.isLoadingList() ? 78 : ctx_r1.pagosManuales().length === 0 ? 79 : 80);
  }
}
function PagosBancariosPage_Conditional_23_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 140);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "p", 24);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_2_0;
    let tmp_3_0;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate((tmp_2_0 = ctx_r1.selectedFileOh()) == null ? null : tmp_2_0.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.formatFileSize(((tmp_3_0 = ctx_r1.selectedFileOh()) == null ? null : tmp_3_0.size) || 0));
  }
}
function PagosBancariosPage_Conditional_23_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 25)(1, "span", 26);
    \u0275\u0275text(2, "Click para seleccionar");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3, " o arrastra el archivo ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p", 27);
    \u0275\u0275text(5, "Archivos Excel (.xlsx, .xls)");
    \u0275\u0275elementEnd();
  }
}
function PagosBancariosPage_Conditional_23_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(0, "svg", 28);
    \u0275\u0275element(1, "circle", 29)(2, "path", 30);
    \u0275\u0275elementEnd();
    \u0275\u0275text(3, " Procesando... ");
  }
}
function PagosBancariosPage_Conditional_23_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(0, "svg", 7);
    \u0275\u0275element(1, "path", 31);
    \u0275\u0275elementEnd();
    \u0275\u0275text(2, " Procesar Archivo ");
  }
}
function PagosBancariosPage_Conditional_23_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 22)(1, "p", 32);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.errorMessageOh());
  }
}
function PagosBancariosPage_Conditional_23_Conditional_18_Conditional_0_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 41);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_4_0;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("(", (tmp_4_0 = ctx_r1.resultadoOh()) == null ? null : tmp_4_0.duplicadosOmitidos, " duplicados omitidos)");
  }
}
function PagosBancariosPage_Conditional_23_Conditional_18_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 33);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(1, "svg", 36);
    \u0275\u0275element(2, "path", 37);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(3, "div")(4, "p", 38);
    \u0275\u0275text(5, "Archivo procesado correctamente");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p", 39);
    \u0275\u0275text(7, " ID: ");
    \u0275\u0275elementStart(8, "span", 40);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275text(10);
    \u0275\u0275conditionalCreate(11, PagosBancariosPage_Conditional_23_Conditional_18_Conditional_0_Conditional_11_Template, 2, 1, "span", 41);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    let tmp_3_0;
    let tmp_4_0;
    let tmp_5_0;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(9);
    \u0275\u0275textInterpolate((tmp_3_0 = ctx_r1.resultadoOh()) == null ? null : tmp_3_0.archivoId);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" - ", (tmp_4_0 = ctx_r1.resultadoOh()) == null ? null : tmp_4_0.registrosProcesados, " registros ");
    \u0275\u0275advance();
    \u0275\u0275conditional(((tmp_5_0 = ctx_r1.resultadoOh()) == null ? null : tmp_5_0.duplicadosOmitidos) && ctx_r1.resultadoOh().duplicadosOmitidos > 0 ? 11 : -1);
  }
}
function PagosBancariosPage_Conditional_23_Conditional_18_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 34);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(1, "svg", 42);
    \u0275\u0275element(2, "path", 43);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(3, "div")(4, "p", 44);
    \u0275\u0275text(5, "Todos los registros ya existen");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p", 45);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    let tmp_3_0;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate1("", (tmp_3_0 = ctx_r1.resultadoOh()) == null ? null : tmp_3_0.duplicadosOmitidos, " registros duplicados");
  }
}
function PagosBancariosPage_Conditional_23_Conditional_18_Conditional_2_For_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr", 55)(1, "td", 56);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td", 123);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td", 123);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "td", 58);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "td", 123);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const d_r11 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(d_r11.documento);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(d_r11.codigoDepositante);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(d_r11.fechaPago);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("S/ ", ctx_r1.formatMonto(d_r11.montoPagado));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(d_r11.medioAtencion);
  }
}
function PagosBancariosPage_Conditional_23_Conditional_18_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 35)(1, "div", 46)(2, "h2", 47);
    \u0275\u0275text(3, "Detalle de Pagos OH");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 48);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 49)(7, "table", 50)(8, "thead", 141)(9, "tr")(10, "th", 52);
    \u0275\u0275text(11, "DNI");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th", 52);
    \u0275\u0275text(13, "Cuenta");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "th", 52);
    \u0275\u0275text(15, "Fecha");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "th", 53);
    \u0275\u0275text(17, "Monto");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "th", 52);
    \u0275\u0275text(19, "Canal");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(20, "tbody", 54);
    \u0275\u0275repeaterCreate(21, PagosBancariosPage_Conditional_23_Conditional_18_Conditional_2_For_22_Template, 11, 5, "tr", 55, _forTrack0);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    let tmp_3_0;
    let tmp_4_0;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("", (tmp_3_0 = ctx_r1.resultadoOh()) == null ? null : tmp_3_0.detalles == null ? null : tmp_3_0.detalles.length, " registros");
    \u0275\u0275advance(16);
    \u0275\u0275repeater((tmp_4_0 = ctx_r1.resultadoOh()) == null ? null : tmp_4_0.detalles);
  }
}
function PagosBancariosPage_Conditional_23_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, PagosBancariosPage_Conditional_23_Conditional_18_Conditional_0_Template, 12, 3, "div", 33);
    \u0275\u0275conditionalCreate(1, PagosBancariosPage_Conditional_23_Conditional_18_Conditional_1_Template, 8, 1, "div", 34);
    \u0275\u0275conditionalCreate(2, PagosBancariosPage_Conditional_23_Conditional_18_Conditional_2_Template, 23, 1, "div", 35);
  }
  if (rf & 2) {
    let tmp_2_0;
    let tmp_3_0;
    let tmp_4_0;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275conditional(((tmp_2_0 = ctx_r1.resultadoOh()) == null ? null : tmp_2_0.exitoso) && ((tmp_2_0 = ctx_r1.resultadoOh()) == null ? null : tmp_2_0.archivoId) ? 0 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(!((tmp_3_0 = ctx_r1.resultadoOh()) == null ? null : tmp_3_0.exitoso) && ((tmp_3_0 = ctx_r1.resultadoOh()) == null ? null : tmp_3_0.duplicadosOmitidos) && ctx_r1.resultadoOh().duplicadosOmitidos > 0 ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(((tmp_4_0 = ctx_r1.resultadoOh()) == null ? null : tmp_4_0.detalles) && ctx_r1.resultadoOh().detalles.length > 0 ? 2 : -1);
  }
}
function PagosBancariosPage_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 12)(1, "h2", 134)(2, "span", 135);
    \u0275\u0275text(3, " Financiera OH ");
    \u0275\u0275elementEnd();
    \u0275\u0275text(4, " Cargar Archivo Excel de Pagos ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 14)(6, "div", 15)(7, "label", 136)(8, "div", 17);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(9, "svg", 137);
    \u0275\u0275element(10, "path", 10);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(11, PagosBancariosPage_Conditional_23_Conditional_11_Template, 4, 2)(12, PagosBancariosPage_Conditional_23_Conditional_12_Template, 6, 0);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(13, "input", 138);
    \u0275\u0275listener("change", function PagosBancariosPage_Conditional_23_Template_input_change_13_listener($event) {
      \u0275\u0275restoreView(_r10);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onFileSelectedOh($event));
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(14, "button", 139);
    \u0275\u0275listener("click", function PagosBancariosPage_Conditional_23_Template_button_click_14_listener() {
      \u0275\u0275restoreView(_r10);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.procesarArchivoOh());
    });
    \u0275\u0275conditionalCreate(15, PagosBancariosPage_Conditional_23_Conditional_15_Template, 4, 0)(16, PagosBancariosPage_Conditional_23_Conditional_16_Template, 3, 0);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(17, PagosBancariosPage_Conditional_23_Conditional_17_Template, 3, 1, "div", 22);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(18, PagosBancariosPage_Conditional_23_Conditional_18_Template, 3, 3);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(11);
    \u0275\u0275conditional(ctx_r1.selectedFileOh() ? 11 : 12);
    \u0275\u0275advance(3);
    \u0275\u0275property("disabled", !ctx_r1.selectedFileOh() || ctx_r1.isLoadingOh());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.isLoadingOh() ? 15 : 16);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.errorMessageOh() ? 17 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.resultadoOh() ? 18 : -1);
  }
}
function PagosBancariosPage_Conditional_24_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(0, "svg", 150);
    \u0275\u0275element(1, "circle", 29)(2, "path", 111);
    \u0275\u0275elementEnd();
  }
}
function PagosBancariosPage_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 11)(1, "div", 142)(2, "div", 143)(3, "div", 144);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(4, "svg", 145);
    \u0275\u0275element(5, "path", 43);
    \u0275\u0275elementEnd()();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(6, "h3", 47);
    \u0275\u0275text(7, "Confirmar eliminaci\xF3n");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "p", 146);
    \u0275\u0275text(9, " \xBFEst\xE1s seguro de eliminar el pago de ");
    \u0275\u0275elementStart(10, "strong");
    \u0275\u0275text(11);
    \u0275\u0275elementEnd();
    \u0275\u0275text(12, " por ");
    \u0275\u0275elementStart(13, "strong");
    \u0275\u0275text(14);
    \u0275\u0275elementEnd();
    \u0275\u0275text(15, "? Esta acci\xF3n no se puede deshacer. ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "div", 147)(17, "button", 148);
    \u0275\u0275listener("click", function PagosBancariosPage_Conditional_24_Template_button_click_17_listener() {
      \u0275\u0275restoreView(_r12);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.cancelarEliminar());
    });
    \u0275\u0275text(18, " Cancelar ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "button", 149);
    \u0275\u0275listener("click", function PagosBancariosPage_Conditional_24_Template_button_click_19_listener() {
      \u0275\u0275restoreView(_r12);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.eliminarPago());
    });
    \u0275\u0275conditionalCreate(20, PagosBancariosPage_Conditional_24_Conditional_20_Template, 3, 0, ":svg:svg", 150);
    \u0275\u0275text(21, " Eliminar ");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    let tmp_1_0;
    let tmp_2_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(11);
    \u0275\u0275textInterpolate((tmp_1_0 = ctx_r1.pagoAEliminar()) == null ? null : tmp_1_0.documento);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("S/ ", ctx_r1.formatMonto((tmp_2_0 = ctx_r1.pagoAEliminar()) == null ? null : tmp_2_0.montoBanco));
    \u0275\u0275advance(5);
    \u0275\u0275property("disabled", ctx_r1.isDeleting());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.isDeleting() ? 20 : -1);
  }
}
var _PagosBancariosPage = class _PagosBancariosPage {
  constructor(bcpService) {
    this.bcpService = bcpService;
    this.activeTab = signal("masiva", ...ngDevMode ? [{ debugName: "activeTab" }] : []);
    this.selectedFile = signal(null, ...ngDevMode ? [{ debugName: "selectedFile" }] : []);
    this.isLoading = signal(false, ...ngDevMode ? [{ debugName: "isLoading" }] : []);
    this.errorMessage = signal(null, ...ngDevMode ? [{ debugName: "errorMessage" }] : []);
    this.resultado = signal(null, ...ngDevMode ? [{ debugName: "resultado" }] : []);
    this.selectedFileOh = signal(null, ...ngDevMode ? [{ debugName: "selectedFileOh" }] : []);
    this.isLoadingOh = signal(false, ...ngDevMode ? [{ debugName: "isLoadingOh" }] : []);
    this.errorMessageOh = signal(null, ...ngDevMode ? [{ debugName: "errorMessageOh" }] : []);
    this.resultadoOh = signal(null, ...ngDevMode ? [{ debugName: "resultadoOh" }] : []);
    this.pagoManual = {
      documento: "",
      fechaPago: "",
      monto: 0,
      numeroOperacion: "",
      medioAtencion: "",
      observaciones: "",
      banco: "BCP"
    };
    this.isLoadingManual = signal(false, ...ngDevMode ? [{ debugName: "isLoadingManual" }] : []);
    this.resultadoManual = signal(null, ...ngDevMode ? [{ debugName: "resultadoManual" }] : []);
    this.editingPago = signal(null, ...ngDevMode ? [{ debugName: "editingPago" }] : []);
    this.formExpanded = signal(false, ...ngDevMode ? [{ debugName: "formExpanded" }] : []);
    this.pagosManuales = signal([], ...ngDevMode ? [{ debugName: "pagosManuales" }] : []);
    this.isLoadingList = signal(false, ...ngDevMode ? [{ debugName: "isLoadingList" }] : []);
    this.totalRegistros = signal(0, ...ngDevMode ? [{ debugName: "totalRegistros" }] : []);
    this.currentPage = signal(1, ...ngDevMode ? [{ debugName: "currentPage" }] : []);
    this.totalPages = signal(1, ...ngDevMode ? [{ debugName: "totalPages" }] : []);
    this.pageSize = 25;
    this.filtros = {
      documento: "",
      banco: "",
      medioAtencion: "",
      fechaDesde: "",
      fechaHasta: ""
    };
    this.showDeleteModal = signal(false, ...ngDevMode ? [{ debugName: "showDeleteModal" }] : []);
    this.pagoAEliminar = signal(null, ...ngDevMode ? [{ debugName: "pagoAEliminar" }] : []);
    this.isDeleting = signal(false, ...ngDevMode ? [{ debugName: "isDeleting" }] : []);
  }
  ngOnInit() {
    if (this.activeTab() === "manual") {
      this.cargarPagosManuales();
    }
  }
  // === Carga Masiva ===
  onFileSelected(event) {
    const input = event.target;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (!file.name.toLowerCase().endsWith(".txt")) {
        this.errorMessage.set("Por favor seleccione un archivo TXT");
        this.selectedFile.set(null);
        return;
      }
      this.selectedFile.set(file);
      this.errorMessage.set(null);
      this.resultado.set(null);
    }
  }
  procesarArchivo() {
    const file = this.selectedFile();
    if (!file)
      return;
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.bcpService.cargarArchivo(file).subscribe({
      next: (resultado) => {
        this.resultado.set(resultado);
        if (!resultado.exitoso) {
          this.errorMessage.set(resultado.mensaje);
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set("Error: " + (error.error?.message || error.message));
        this.isLoading.set(false);
      }
    });
  }
  // === Carga OH ===
  onFileSelectedOh(event) {
    const input = event.target;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const ext = file.name.toLowerCase();
      if (!ext.endsWith(".xlsx") && !ext.endsWith(".xls")) {
        this.errorMessageOh.set("Por favor seleccione un archivo Excel (.xlsx o .xls)");
        this.selectedFileOh.set(null);
        return;
      }
      this.selectedFileOh.set(file);
      this.errorMessageOh.set(null);
      this.resultadoOh.set(null);
    }
  }
  procesarArchivoOh() {
    const file = this.selectedFileOh();
    if (!file)
      return;
    this.isLoadingOh.set(true);
    this.errorMessageOh.set(null);
    this.bcpService.cargarArchivoOh(file).subscribe({
      next: (resultado) => {
        this.resultadoOh.set(resultado);
        if (!resultado.exitoso) {
          this.errorMessageOh.set(resultado.mensaje);
        }
        this.isLoadingOh.set(false);
      },
      error: (error) => {
        this.errorMessageOh.set("Error: " + (error.error?.message || error.message));
        this.isLoadingOh.set(false);
      }
    });
  }
  // === Ingreso Manual ===
  toggleFormulario() {
    this.formExpanded.set(!this.formExpanded());
  }
  registrarPagoManual() {
    if (!this.pagoManual.documento || !this.pagoManual.fechaPago || !this.pagoManual.monto || !this.pagoManual.numeroOperacion) {
      return;
    }
    this.isLoadingManual.set(true);
    this.resultadoManual.set(null);
    const fechaParts = this.pagoManual.fechaPago.split("-");
    const fechaFormateada = `${fechaParts[2]}/${fechaParts[1]}/${fechaParts[0]}`;
    const request = __spreadProps(__spreadValues({}, this.pagoManual), {
      fechaPago: fechaFormateada
    });
    this.bcpService.registrarPagoManual(request).subscribe({
      next: (resultado) => {
        this.resultadoManual.set(resultado);
        if (resultado.exitoso) {
          this.limpiarFormulario();
          this.cargarPagosManuales();
          this.formExpanded.set(false);
        }
        this.isLoadingManual.set(false);
      },
      error: (error) => {
        this.resultadoManual.set({
          exitoso: false,
          mensaje: error.error?.mensaje || error.message || "Error al registrar pago"
        });
        this.isLoadingManual.set(false);
      }
    });
  }
  // === Listado de pagos manuales ===
  cargarPagosManuales() {
    this.isLoadingList.set(true);
    const filtros = __spreadProps(__spreadValues({}, this.filtros), {
      page: this.currentPage(),
      size: this.pageSize
    });
    if (!filtros.documento)
      delete filtros.documento;
    if (!filtros.banco)
      delete filtros.banco;
    if (!filtros.medioAtencion)
      delete filtros.medioAtencion;
    if (!filtros.fechaDesde)
      delete filtros.fechaDesde;
    if (!filtros.fechaHasta)
      delete filtros.fechaHasta;
    this.bcpService.listarPagosManuales(filtros).subscribe({
      next: (response) => {
        this.pagosManuales.set(response.data);
        this.totalRegistros.set(response.total);
        this.totalPages.set(response.totalPages);
        this.isLoadingList.set(false);
      },
      error: (error) => {
        console.error("Error cargando pagos manuales:", error);
        this.isLoadingList.set(false);
      }
    });
  }
  limpiarFiltros() {
    this.filtros = {
      documento: "",
      banco: "",
      medioAtencion: "",
      fechaDesde: "",
      fechaHasta: ""
    };
    this.currentPage.set(1);
    this.cargarPagosManuales();
  }
  cambiarPagina(page) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.cargarPagosManuales();
    }
  }
  // === Edición ===
  editarPago(pago) {
    this.editingPago.set(pago);
    this.formExpanded.set(true);
    let fechaFormateada = "";
    if (pago.fechaBanco) {
      const parts = pago.fechaBanco.split("/");
      if (parts.length === 3) {
        fechaFormateada = `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
    }
    this.pagoManual = {
      documento: pago.documento,
      fechaPago: fechaFormateada,
      monto: pago.montoBanco,
      numeroOperacion: pago.numeroOperacion,
      banco: pago.banco || "BCP",
      medioAtencion: pago.medioAtencion || "",
      observaciones: pago.referencia || ""
    };
    this.resultadoManual.set(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  actualizarPago() {
    const pago = this.editingPago();
    if (!pago)
      return;
    this.isLoadingManual.set(true);
    this.resultadoManual.set(null);
    const fechaParts = this.pagoManual.fechaPago.split("-");
    const fechaFormateada = `${fechaParts[2]}/${fechaParts[1]}/${fechaParts[0]}`;
    const request = __spreadProps(__spreadValues({}, this.pagoManual), {
      fechaPago: fechaFormateada
    });
    this.bcpService.actualizarPagoManual(pago.id, request).subscribe({
      next: (resultado) => {
        this.resultadoManual.set(resultado);
        if (resultado.exitoso) {
          this.cancelarEdicion();
          this.cargarPagosManuales();
        }
        this.isLoadingManual.set(false);
      },
      error: (error) => {
        this.resultadoManual.set({
          exitoso: false,
          mensaje: error.error?.mensaje || error.message || "Error al actualizar pago"
        });
        this.isLoadingManual.set(false);
      }
    });
  }
  cancelarEdicion() {
    this.editingPago.set(null);
    this.limpiarFormulario();
    this.formExpanded.set(false);
  }
  limpiarFormulario() {
    this.pagoManual = {
      documento: "",
      fechaPago: "",
      monto: 0,
      numeroOperacion: "",
      medioAtencion: "",
      observaciones: "",
      banco: "BCP"
    };
  }
  // === Eliminación ===
  confirmarEliminar(pago) {
    this.pagoAEliminar.set(pago);
    this.showDeleteModal.set(true);
  }
  cancelarEliminar() {
    this.pagoAEliminar.set(null);
    this.showDeleteModal.set(false);
  }
  eliminarPago() {
    const pago = this.pagoAEliminar();
    if (!pago)
      return;
    this.isDeleting.set(true);
    this.bcpService.eliminarPagoManual(pago.id).subscribe({
      next: (resultado) => {
        if (resultado.exitoso) {
          this.cargarPagosManuales();
          this.resultadoManual.set({ exitoso: true, mensaje: "Pago eliminado correctamente" });
        } else {
          this.resultadoManual.set(resultado);
        }
        this.isDeleting.set(false);
        this.cancelarEliminar();
      },
      error: (error) => {
        this.resultadoManual.set({
          exitoso: false,
          mensaje: error.error?.mensaje || error.message || "Error al eliminar pago"
        });
        this.isDeleting.set(false);
        this.cancelarEliminar();
      }
    });
  }
  // === Utilidades ===
  formatFileSize(bytes) {
    if (bytes === 0)
      return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }
  formatMonto(monto) {
    if (monto === void 0 || monto === null)
      return "0.00";
    return monto.toLocaleString("es-PE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
};
_PagosBancariosPage.\u0275fac = function PagosBancariosPage_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _PagosBancariosPage)(\u0275\u0275directiveInject(BcpPagosService));
};
_PagosBancariosPage.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PagosBancariosPage, selectors: [["app-pagos-bancarios"]], decls: 25, vars: 10, consts: [[1, "min-h-screen", "bg-slate-50", "dark:bg-slate-900", "p-6"], [1, "mb-6"], [1, "text-2xl", "font-bold", "text-slate-800", "dark:text-white"], [1, "text-slate-600", "dark:text-slate-400"], [1, "border-b", "border-slate-200", "dark:border-slate-700"], [1, "-mb-px", "flex", "space-x-8"], [1, "whitespace-nowrap", "py-4", "px-1", "border-b-2", "font-medium", "text-sm", "transition-colors", "flex", "items-center", "gap-2", 3, "click"], ["fill", "none", "stroke", "currentColor", "viewBox", "0 0 24 24", 1, "w-5", "h-5"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"], [1, "fixed", "inset-0", "bg-black/50", "flex", "items-center", "justify-center", "z-50"], [1, "bg-white", "dark:bg-slate-800", "rounded-xl", "shadow-sm", "border", "border-slate-200", "dark:border-slate-700", "p-6", "mb-6"], [1, "text-lg", "font-semibold", "text-slate-800", "dark:text-white", "mb-4"], [1, "flex", "flex-col", "sm:flex-row", "gap-4", "items-start", "sm:items-center"], [1, "flex-1"], ["for", "file-upload", 1, "flex", "flex-col", "items-center", "justify-center", "w-full", "h-32", "border-2", "border-dashed", "rounded-lg", "cursor-pointer", "border-slate-300", "dark:border-slate-600", "hover:border-blue-400", "dark:hover:border-blue-500", "bg-slate-50", "dark:bg-slate-700/50", "hover:bg-slate-100", "dark:hover:bg-slate-700", "transition-colors"], [1, "flex", "flex-col", "items-center", "justify-center", "pt-5", "pb-6"], ["fill", "none", "stroke", "currentColor", "viewBox", "0 0 24 24", 1, "w-8", "h-8", "mb-3", "text-slate-400"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"], ["id", "file-upload", "type", "file", "accept", ".txt", 1, "hidden", 3, "change"], [1, "px-6", "py-3", "bg-blue-600", "text-white", "rounded-lg", "font-medium", "hover:bg-blue-700", "disabled:bg-slate-400", "disabled:cursor-not-allowed", "transition-colors", "flex", "items-center", "gap-2", 3, "click", "disabled"], [1, "mt-4", "p-4", "bg-red-50", "dark:bg-red-900/20", "border", "border-red-200", "dark:border-red-800", "rounded-lg"], [1, "text-sm", "text-blue-600", "dark:text-blue-400", "font-medium"], [1, "text-xs", "text-slate-500"], [1, "mb-2", "text-sm", "text-slate-500", "dark:text-slate-400"], [1, "font-semibold"], [1, "text-xs", "text-slate-500", "dark:text-slate-400"], ["fill", "none", "viewBox", "0 0 24 24", 1, "animate-spin", "h-5", "w-5"], ["cx", "12", "cy", "12", "r", "10", "stroke", "currentColor", "stroke-width", "4", 1, "opacity-25"], ["fill", "currentColor", "d", "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z", 1, "opacity-75"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"], [1, "text-red-700", "dark:text-red-400"], [1, "mb-6", "p-4", "bg-green-50", "dark:bg-green-900/20", "border", "border-green-200", "dark:border-green-800", "rounded-lg", "flex", "items-center", "gap-3"], [1, "mb-6", "p-4", "bg-amber-50", "dark:bg-amber-900/20", "border", "border-amber-200", "dark:border-amber-800", "rounded-lg", "flex", "items-center", "gap-3"], [1, "bg-white", "dark:bg-slate-800", "rounded-xl", "shadow-sm", "border", "border-slate-200", "dark:border-slate-700", "overflow-hidden"], ["fill", "none", "stroke", "currentColor", "viewBox", "0 0 24 24", 1, "w-6", "h-6", "text-green-500", "flex-shrink-0"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"], [1, "font-medium", "text-green-800", "dark:text-green-300"], [1, "text-sm", "text-green-700", "dark:text-green-400"], [1, "font-mono", "font-bold"], [1, "text-amber-600", "dark:text-amber-400"], ["fill", "none", "stroke", "currentColor", "viewBox", "0 0 24 24", 1, "w-6", "h-6", "text-amber-500"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"], [1, "font-medium", "text-amber-800", "dark:text-amber-300"], [1, "text-sm", "text-amber-700", "dark:text-amber-400"], [1, "p-4", "border-b", "border-slate-200", "dark:border-slate-700", "flex", "items-center", "justify-between"], [1, "text-lg", "font-semibold", "text-slate-800", "dark:text-white"], [1, "text-sm", "text-slate-500"], [1, "overflow-x-auto"], [1, "min-w-full", "divide-y", "divide-slate-200", "dark:divide-slate-700"], [1, "bg-slate-50", "dark:bg-slate-700/50"], [1, "px-3", "py-3", "text-left", "text-xs", "font-medium", "text-slate-500", "uppercase"], [1, "px-3", "py-3", "text-right", "text-xs", "font-medium", "text-slate-500", "uppercase"], [1, "divide-y", "divide-slate-200", "dark:divide-slate-700"], [1, "hover:bg-slate-50", "dark:hover:bg-slate-700/50"], [1, "px-3", "py-2", "text-sm", "font-medium", "text-slate-800", "dark:text-white"], [1, "px-3", "py-2", "text-sm", "text-slate-600"], [1, "px-3", "py-2", "text-sm", "font-medium", "text-green-600", "text-right"], [1, "bg-white", "dark:bg-slate-800", "rounded-xl", "shadow-sm", "border", "border-slate-200", "dark:border-slate-700", "mb-6", "overflow-hidden"], ["type", "button", 1, "w-full", "px-6", "py-4", "flex", "items-center", "justify-between", "hover:bg-slate-50", "dark:hover:bg-slate-700/50", "transition-colors", 3, "click"], [1, "flex", "items-center", "gap-3"], [1, "p-2", "rounded-lg"], [1, "text-left"], ["fill", "none", "stroke", "currentColor", "viewBox", "0 0 24 24", 1, "w-5", "h-5", "text-slate-400", "transition-transform", "duration-200"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M19 9l-7 7-7-7"], [1, "px-6", "pb-6", "border-t", "border-slate-200", "dark:border-slate-700"], [1, "p-4", "border-b", "border-slate-200", "dark:border-slate-700"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "lg:grid-cols-5", "gap-4"], [1, "block", "text-xs", "font-medium", "text-slate-500", "mb-1"], ["type", "text", "placeholder", "Buscar DNI...", 1, "w-full", "px-3", "py-2", "text-sm", "border", "border-slate-300", "dark:border-slate-600", "rounded-lg", "bg-white", "dark:bg-slate-700", "text-slate-800", "dark:text-white", 3, "ngModelChange", "ngModel"], ["type", "date", 1, "w-full", "px-3", "py-2", "text-sm", "border", "border-slate-300", "dark:border-slate-600", "rounded-lg", "bg-white", "dark:bg-slate-700", "text-slate-800", "dark:text-white", 3, "ngModelChange", "ngModel"], [1, "w-full", "px-3", "py-2", "text-sm", "border", "border-slate-300", "dark:border-slate-600", "rounded-lg", "bg-white", "dark:bg-slate-700", "text-slate-800", "dark:text-white", 3, "ngModelChange", "ngModel"], ["value", ""], ["value", "BCP"], ["value", "INTERBANK"], ["value", "BBVA"], ["value", "SCOTIABANK"], ["value", "BANBIF"], ["value", "BANCO DE LA NACION"], ["value", "OTRO"], ["value", "VENTANILLA"], ["value", "AGENTE BCP"], ["value", "APP"], ["value", "BANCA POR INTERNET"], ["value", "MANUAL"], [1, "flex", "gap-2", "mt-4"], [1, "px-4", "py-2", "bg-blue-600", "text-white", "text-sm", "rounded-lg", "hover:bg-blue-700", "transition-colors", "flex", "items-center", "gap-2", 3, "click"], ["fill", "none", "stroke", "currentColor", "viewBox", "0 0 24 24", 1, "w-4", "h-4"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"], [1, "px-4", "py-2", "border", "border-slate-300", "dark:border-slate-600", "text-slate-600", "dark:text-slate-300", "text-sm", "rounded-lg", "hover:bg-slate-100", "dark:hover:bg-slate-700", "transition-colors", 3, "click"], [1, "px-4", "py-2", "bg-slate-50", "dark:bg-slate-700/30", "border-b", "border-slate-200", "dark:border-slate-700", "text-sm", "text-slate-600", "dark:text-slate-400"], [1, "p-8", "text-center"], [1, "p-8", "text-center", "text-slate-500"], [1, "space-y-4", "pt-4", 3, "ngSubmit"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "lg:grid-cols-3", "gap-4"], [1, "block", "text-sm", "font-medium", "text-slate-700", "dark:text-slate-300", "mb-1"], [1, "text-red-500"], ["type", "text", "name", "documento", "required", "", "maxlength", "8", "placeholder", "12345678", 1, "w-full", "px-3", "py-2", "border", "border-slate-300", "dark:border-slate-600", "rounded-lg", "bg-white", "dark:bg-slate-700", "text-slate-800", "dark:text-white", "focus:ring-2", "focus:ring-blue-500", "focus:border-transparent", 3, "ngModelChange", "ngModel"], ["type", "date", "name", "fechaPago", "required", "", 1, "w-full", "px-3", "py-2", "border", "border-slate-300", "dark:border-slate-600", "rounded-lg", "bg-white", "dark:bg-slate-700", "text-slate-800", "dark:text-white", "focus:ring-2", "focus:ring-blue-500", "focus:border-transparent", 3, "ngModelChange", "ngModel"], ["type", "number", "name", "monto", "required", "", "min", "0.01", "step", "0.01", "placeholder", "100.00", 1, "w-full", "px-3", "py-2", "border", "border-slate-300", "dark:border-slate-600", "rounded-lg", "bg-white", "dark:bg-slate-700", "text-slate-800", "dark:text-white", "focus:ring-2", "focus:ring-blue-500", "focus:border-transparent", 3, "ngModelChange", "ngModel"], ["type", "text", "name", "numeroOperacion", "required", "", "placeholder", "123456", 1, "w-full", "px-3", "py-2", "border", "border-slate-300", "dark:border-slate-600", "rounded-lg", "bg-white", "dark:bg-slate-700", "text-slate-800", "dark:text-white", "focus:ring-2", "focus:ring-blue-500", "focus:border-transparent", 3, "ngModelChange", "ngModel"], ["name", "banco", "required", "", 1, "w-full", "px-3", "py-2", "border", "border-slate-300", "dark:border-slate-600", "rounded-lg", "bg-white", "dark:bg-slate-700", "text-slate-800", "dark:text-white", "focus:ring-2", "focus:ring-blue-500", "focus:border-transparent", 3, "ngModelChange", "ngModel"], ["name", "medioAtencion", 1, "w-full", "px-3", "py-2", "border", "border-slate-300", "dark:border-slate-600", "rounded-lg", "bg-white", "dark:bg-slate-700", "text-slate-800", "dark:text-white", "focus:ring-2", "focus:ring-blue-500", "focus:border-transparent", 3, "ngModelChange", "ngModel"], [1, "md:col-span-2", "lg:col-span-3"], ["name", "observaciones", "rows", "2", "placeholder", "Notas adicionales...", 1, "w-full", "px-3", "py-2", "border", "border-slate-300", "dark:border-slate-600", "rounded-lg", "bg-white", "dark:bg-slate-700", "text-slate-800", "dark:text-white", "focus:ring-2", "focus:ring-blue-500", "focus:border-transparent", 3, "ngModelChange", "ngModel"], [1, "flex", "justify-end", "gap-3", "pt-4"], ["type", "button", 1, "px-4", "py-2", "border", "border-slate-300", "dark:border-slate-600", "text-slate-700", "dark:text-slate-300", "rounded-lg", "hover:bg-slate-100", "dark:hover:bg-slate-700", "transition-colors"], ["type", "submit", 1, "px-6", "py-2.5", "text-white", "rounded-lg", "font-medium", "disabled:bg-slate-400", "disabled:cursor-not-allowed", "transition-colors", "flex", "items-center", "gap-2", 3, "disabled"], [1, "mt-4", "p-4", "rounded-lg", "flex", "items-center", "gap-3", 3, "class"], ["type", "button", 1, "px-4", "py-2", "border", "border-slate-300", "dark:border-slate-600", "text-slate-700", "dark:text-slate-300", "rounded-lg", "hover:bg-slate-100", "dark:hover:bg-slate-700", "transition-colors", 3, "click"], ["fill", "currentColor", "d", "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z", 1, "opacity-75"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M5 13l4 4L19 7"], [1, "mt-4", "p-4", "rounded-lg", "flex", "items-center", "gap-3"], ["fill", "none", "stroke", "currentColor", "viewBox", "0 0 24 24", 1, "w-6", "h-6", "text-green-500"], ["fill", "none", "stroke", "currentColor", "viewBox", "0 0 24 24", 1, "w-6", "h-6", "text-red-500"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"], [1, "font-medium", "text-red-800", "dark:text-red-300"], ["fill", "none", "viewBox", "0 0 24 24", 1, "animate-spin", "h-8", "w-8", "mx-auto", "text-blue-500"], [1, "mt-2", "text-slate-500"], ["fill", "none", "stroke", "currentColor", "viewBox", "0 0 24 24", 1, "w-12", "h-12", "mx-auto", "mb-3", "text-slate-300"], [1, "px-3", "py-3", "text-center", "text-xs", "font-medium", "text-slate-500", "uppercase"], [1, "px-4", "py-3", "border-t", "border-slate-200", "dark:border-slate-700", "flex", "items-center", "justify-between"], [1, "px-3", "py-2", "text-sm", "text-slate-600", "dark:text-slate-300"], [1, "px-3", "py-2", "text-center"], [1, "px-2", "py-1", "text-xs", "font-medium", "bg-green-100", "text-green-700", "dark:bg-green-900/30", "dark:text-green-400", "rounded-full"], [1, "px-2", "py-1", "text-xs", "font-medium", "bg-amber-100", "text-amber-700", "dark:bg-amber-900/30", "dark:text-amber-400", "rounded-full"], [1, "px-2", "py-1", "text-xs", "font-medium", "bg-slate-100", "text-slate-600", "dark:bg-slate-700", "dark:text-slate-400", "rounded-full"], [1, "flex", "justify-center", "gap-1"], ["title", "Editar", 1, "p-1.5", "text-blue-600", "hover:bg-blue-50", "dark:hover:bg-blue-900/30", "rounded", "transition-colors", 3, "click"], ["title", "Eliminar", 1, "p-1.5", "text-red-600", "hover:bg-red-50", "dark:hover:bg-red-900/30", "rounded", "transition-colors", "disabled:opacity-50", "disabled:cursor-not-allowed", 3, "click", "disabled"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"], [1, "px-3", "py-1.5", "text-sm", "border", "border-slate-300", "dark:border-slate-600", "rounded", "hover:bg-slate-100", "dark:hover:bg-slate-700", "disabled:opacity-50", "disabled:cursor-not-allowed", "transition-colors", 3, "click", "disabled"], [1, "text-sm", "text-slate-600", "dark:text-slate-400"], [1, "text-lg", "font-semibold", "text-slate-800", "dark:text-white", "mb-4", "flex", "items-center", "gap-2"], [1, "px-2", "py-1", "bg-purple-100", "dark:bg-purple-900/30", "text-purple-700", "dark:text-purple-300", "text-xs", "font-medium", "rounded"], ["for", "file-upload-oh", 1, "flex", "flex-col", "items-center", "justify-center", "w-full", "h-32", "border-2", "border-dashed", "rounded-lg", "cursor-pointer", "border-purple-300", "dark:border-purple-600", "hover:border-purple-400", "dark:hover:border-purple-500", "bg-purple-50", "dark:bg-purple-900/20", "hover:bg-purple-100", "dark:hover:bg-purple-900/30", "transition-colors"], ["fill", "none", "stroke", "currentColor", "viewBox", "0 0 24 24", 1, "w-8", "h-8", "mb-3", "text-purple-400"], ["id", "file-upload-oh", "type", "file", "accept", ".xlsx,.xls", 1, "hidden", 3, "change"], [1, "px-6", "py-3", "bg-purple-600", "text-white", "rounded-lg", "font-medium", "hover:bg-purple-700", "disabled:bg-slate-400", "disabled:cursor-not-allowed", "transition-colors", "flex", "items-center", "gap-2", 3, "click", "disabled"], [1, "text-sm", "text-purple-600", "dark:text-purple-400", "font-medium"], [1, "bg-purple-50", "dark:bg-purple-900/20"], [1, "bg-white", "dark:bg-slate-800", "rounded-xl", "shadow-xl", "max-w-md", "w-full", "mx-4", "p-6"], [1, "flex", "items-center", "gap-3", "mb-4"], [1, "p-2", "bg-red-100", "dark:bg-red-900/30", "rounded-full"], ["fill", "none", "stroke", "currentColor", "viewBox", "0 0 24 24", 1, "w-6", "h-6", "text-red-600"], [1, "text-slate-600", "dark:text-slate-400", "mb-6"], [1, "flex", "justify-end", "gap-3"], [1, "px-4", "py-2", "border", "border-slate-300", "dark:border-slate-600", "text-slate-700", "dark:text-slate-300", "rounded-lg", "hover:bg-slate-100", "dark:hover:bg-slate-700", "transition-colors", 3, "click"], [1, "px-4", "py-2", "bg-red-600", "text-white", "rounded-lg", "hover:bg-red-700", "disabled:bg-red-400", "transition-colors", "flex", "items-center", "gap-2", 3, "click", "disabled"], ["fill", "none", "viewBox", "0 0 24 24", 1, "animate-spin", "h-4", "w-4"]], template: function PagosBancariosPage_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "h1", 2);
    \u0275\u0275text(3, " Pagos Bancarios ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p", 3);
    \u0275\u0275text(5, " Registra pagos bancarios de forma manual o masiva (BCP y Financiera OH) ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 1)(7, "div", 4)(8, "nav", 5)(9, "button", 6);
    \u0275\u0275listener("click", function PagosBancariosPage_Template_button_click_9_listener() {
      return ctx.activeTab.set("masiva");
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(10, "svg", 7);
    \u0275\u0275element(11, "path", 8);
    \u0275\u0275elementEnd();
    \u0275\u0275text(12, " Carga Masiva ");
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(13, "button", 6);
    \u0275\u0275listener("click", function PagosBancariosPage_Template_button_click_13_listener() {
      ctx.activeTab.set("manual");
      return ctx.cargarPagosManuales();
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(14, "svg", 7);
    \u0275\u0275element(15, "path", 9);
    \u0275\u0275elementEnd();
    \u0275\u0275text(16, " Ingreso Manual ");
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(17, "button", 6);
    \u0275\u0275listener("click", function PagosBancariosPage_Template_button_click_17_listener() {
      return ctx.activeTab.set("oh");
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(18, "svg", 7);
    \u0275\u0275element(19, "path", 10);
    \u0275\u0275elementEnd();
    \u0275\u0275text(20, " Carga OH ");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275conditionalCreate(21, PagosBancariosPage_Conditional_21_Template, 17, 5);
    \u0275\u0275conditionalCreate(22, PagosBancariosPage_Conditional_22_Template, 81, 17);
    \u0275\u0275conditionalCreate(23, PagosBancariosPage_Conditional_23_Template, 19, 5);
    \u0275\u0275conditionalCreate(24, PagosBancariosPage_Conditional_24_Template, 22, 4, "div", 11);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance(9);
    \u0275\u0275classMap(ctx.activeTab() === "masiva" ? "border-blue-500 text-blue-600 dark:text-blue-400" : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 hover:border-slate-300");
    \u0275\u0275advance(4);
    \u0275\u0275classMap(ctx.activeTab() === "manual" ? "border-blue-500 text-blue-600 dark:text-blue-400" : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 hover:border-slate-300");
    \u0275\u0275advance(4);
    \u0275\u0275classMap(ctx.activeTab() === "oh" ? "border-purple-500 text-purple-600 dark:text-purple-400" : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 hover:border-slate-300");
    \u0275\u0275advance(4);
    \u0275\u0275conditional(ctx.activeTab() === "masiva" ? 21 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx.activeTab() === "manual" ? 22 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx.activeTab() === "oh" ? 23 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx.showDeleteModal() ? 24 : -1);
  }
}, dependencies: [CommonModule, FormsModule, \u0275NgNoValidate, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, NumberValueAccessor, SelectControlValueAccessor, NgControlStatus, NgControlStatusGroup, RequiredValidator, MaxLengthValidator, MinValidator, NgModel, NgForm], encapsulation: 2 });
var PagosBancariosPage = _PagosBancariosPage;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PagosBancariosPage, [{
    type: Component,
    args: [{
      selector: "app-pagos-bancarios",
      standalone: true,
      imports: [CommonModule, FormsModule],
      template: `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-slate-800 dark:text-white">
          Pagos Bancarios
        </h1>
        <p class="text-slate-600 dark:text-slate-400">
          Registra pagos bancarios de forma manual o masiva (BCP y Financiera OH)
        </p>
      </div>

      <!-- Tabs -->
      <div class="mb-6">
        <div class="border-b border-slate-200 dark:border-slate-700">
          <nav class="-mb-px flex space-x-8">
            <button
              (click)="activeTab.set('masiva')"
              [class]="activeTab() === 'masiva'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 hover:border-slate-300'"
              class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              Carga Masiva
            </button>
            <button
              (click)="activeTab.set('manual'); cargarPagosManuales()"
              [class]="activeTab() === 'manual'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 hover:border-slate-300'"
              class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
              Ingreso Manual
            </button>
            <button
              (click)="activeTab.set('oh')"
              [class]="activeTab() === 'oh'
                ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 hover:border-slate-300'"
              class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              Carga OH
            </button>
          </nav>
        </div>
      </div>

      <!-- Tab: Carga Masiva -->
      @if (activeTab() === 'masiva') {
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-6">
          <h2 class="text-lg font-semibold text-slate-800 dark:text-white mb-4">
            Cargar Archivo BCP (formato CREP)
          </h2>

          <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div class="flex-1">
              <label
                for="file-upload"
                class="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer
                       border-slate-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500
                       bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <div class="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg class="w-8 h-8 mb-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                  </svg>
                  @if (selectedFile()) {
                    <p class="text-sm text-blue-600 dark:text-blue-400 font-medium">{{ selectedFile()?.name }}</p>
                    <p class="text-xs text-slate-500">{{ formatFileSize(selectedFile()?.size || 0) }}</p>
                  } @else {
                    <p class="mb-2 text-sm text-slate-500 dark:text-slate-400">
                      <span class="font-semibold">Click para seleccionar</span> o arrastra el archivo
                    </p>
                    <p class="text-xs text-slate-500 dark:text-slate-400">Solo archivos TXT</p>
                  }
                </div>
                <input id="file-upload" type="file" class="hidden" accept=".txt" (change)="onFileSelected($event)" />
              </label>
            </div>

            <button
              (click)="procesarArchivo()"
              [disabled]="!selectedFile() || isLoading()"
              class="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              @if (isLoading()) {
                <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Procesando...
              } @else {
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                </svg>
                Procesar Archivo
              }
            </button>
          </div>

          @if (errorMessage()) {
            <div class="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p class="text-red-700 dark:text-red-400">{{ errorMessage() }}</p>
            </div>
          }
        </div>

        <!-- Resultados de carga masiva -->
        @if (resultado()) {
          @if (resultado()?.exitoso && resultado()?.archivoId) {
            <div class="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-3">
              <svg class="w-6 h-6 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <div>
                <p class="font-medium text-green-800 dark:text-green-300">Archivo guardado correctamente</p>
                <p class="text-sm text-green-700 dark:text-green-400">
                  ID: <span class="font-mono font-bold">{{ resultado()?.archivoId }}</span> - {{ resultado()?.registrosProcesados }} registros
                  @if (resultado()?.duplicadosOmitidos && resultado()!.duplicadosOmitidos > 0) {
                    <span class="text-amber-600 dark:text-amber-400">({{ resultado()?.duplicadosOmitidos }} duplicados)</span>
                  }
                </p>
              </div>
            </div>
          }

          @if (!resultado()?.exitoso && resultado()?.duplicadosOmitidos && resultado()!.duplicadosOmitidos > 0) {
            <div class="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg flex items-center gap-3">
              <svg class="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
              <div>
                <p class="font-medium text-amber-800 dark:text-amber-300">Archivo ya procesado</p>
                <p class="text-sm text-amber-700 dark:text-amber-400">{{ resultado()?.duplicadosOmitidos }} registros ya existen</p>
              </div>
            </div>
          }

          <!-- Tabla de detalles -->
          @if (resultado()?.detalles && resultado()!.detalles.length > 0) {
            <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div class="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <h2 class="text-lg font-semibold text-slate-800 dark:text-white">Detalle de Pagos</h2>
                <span class="text-sm text-slate-500">{{ resultado()?.detalles?.length }} registros</span>
              </div>
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                  <thead class="bg-slate-50 dark:bg-slate-700/50">
                    <tr>
                      <th class="px-3 py-3 text-left text-xs font-medium text-slate-500 uppercase">Documento</th>
                      <th class="px-3 py-3 text-left text-xs font-medium text-slate-500 uppercase">Fecha</th>
                      <th class="px-3 py-3 text-right text-xs font-medium text-slate-500 uppercase">Monto</th>
                      <th class="px-3 py-3 text-left text-xs font-medium text-slate-500 uppercase">Nro. Op.</th>
                      <th class="px-3 py-3 text-left text-xs font-medium text-slate-500 uppercase">Sucursal</th>
                      <th class="px-3 py-3 text-left text-xs font-medium text-slate-500 uppercase">Terminal</th>
                      <th class="px-3 py-3 text-left text-xs font-medium text-slate-500 uppercase">Agencia</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
                    @for (d of resultado()?.detalles; track d.numeroFila) {
                      <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                        <td class="px-3 py-2 text-sm font-medium text-slate-800 dark:text-white">{{ d.documento || d.codigoDepositante }}</td>
                        <td class="px-3 py-2 text-sm text-slate-600">{{ d.fechaPago }}</td>
                        <td class="px-3 py-2 text-sm font-medium text-green-600 text-right">S/ {{ formatMonto(d.montoPagado) }}</td>
                        <td class="px-3 py-2 text-sm text-slate-600">{{ d.numeroOperacion }}</td>
                        <td class="px-3 py-2 text-sm text-slate-600">{{ d.sucursal }}</td>
                        <td class="px-3 py-2 text-sm text-slate-600">{{ d.terminal }}</td>
                        <td class="px-3 py-2 text-sm text-slate-600">{{ d.agencia }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
          }
        }
      }

      <!-- Tab: Ingreso Manual -->
      @if (activeTab() === 'manual') {
        <!-- Formulario de registro (colapsable) -->
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 mb-6 overflow-hidden">
          <!-- Header colapsable -->
          <button
            type="button"
            (click)="toggleFormulario()"
            class="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
          >
            <div class="flex items-center gap-3">
              <div class="p-2 rounded-lg" [class]="editingPago() ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-blue-100 dark:bg-blue-900/30'">
                <svg class="w-5 h-5" [class]="editingPago() ? 'text-amber-600' : 'text-blue-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
              </div>
              <div class="text-left">
                <h2 class="text-lg font-semibold text-slate-800 dark:text-white">
                  {{ editingPago() ? 'Editar Pago Manual' : 'Registrar Pago Manual' }}
                </h2>
                <p class="text-sm text-slate-500">
                  {{ formExpanded() ? 'Clic para minimizar' : 'Clic para expandir' }}
                </p>
              </div>
            </div>
            <svg
              class="w-5 h-5 text-slate-400 transition-transform duration-200"
              [class.rotate-180]="formExpanded()"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>

          <!-- Contenido del formulario -->
          @if (formExpanded()) {
            <div class="px-6 pb-6 border-t border-slate-200 dark:border-slate-700">
              <form (ngSubmit)="editingPago() ? actualizarPago() : registrarPagoManual()" class="space-y-4 pt-4">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <!-- Documento -->
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Documento (DNI) <span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  [(ngModel)]="pagoManual.documento"
                  name="documento"
                  required
                  maxlength="8"
                  placeholder="12345678"
                  class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <!-- Fecha de Pago -->
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Fecha de Pago <span class="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  [(ngModel)]="pagoManual.fechaPago"
                  name="fechaPago"
                  required
                  class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <!-- Monto -->
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Monto (S/) <span class="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  [(ngModel)]="pagoManual.monto"
                  name="monto"
                  required
                  min="0.01"
                  step="0.01"
                  placeholder="100.00"
                  class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <!-- N\xFAmero de Operaci\xF3n -->
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Nro. Operaci\xF3n <span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  [(ngModel)]="pagoManual.numeroOperacion"
                  name="numeroOperacion"
                  required
                  placeholder="123456"
                  class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <!-- Banco -->
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Banco <span class="text-red-500">*</span>
                </label>
                <select
                  [(ngModel)]="pagoManual.banco"
                  name="banco"
                  required
                  class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="BCP">BCP - Banco de Cr\xE9dito</option>
                  <option value="INTERBANK">Interbank</option>
                  <option value="BBVA">BBVA Continental</option>
                  <option value="SCOTIABANK">Scotiabank</option>
                  <option value="BANBIF">BanBif</option>
                  <option value="BANCO DE LA NACION">Banco de la Naci\xF3n</option>
                  <option value="OTRO">Otro</option>
                </select>
              </div>

              <!-- Medio de Atenci\xF3n -->
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Medio de Atenci\xF3n
                </label>
                <select
                  [(ngModel)]="pagoManual.medioAtencion"
                  name="medioAtencion"
                  class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Seleccionar...</option>
                  <option value="VENTANILLA">Ventanilla</option>
                  <option value="AGENTE BCP">Agente BCP</option>
                  <option value="APP">App M\xF3vil</option>
                  <option value="BANCA POR INTERNET">Banca por Internet</option>
                  <option value="OTRO">Otro</option>
                </select>
              </div>

              <!-- Observaciones -->
              <div class="md:col-span-2 lg:col-span-3">
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Observaciones
                </label>
                <textarea
                  [(ngModel)]="pagoManual.observaciones"
                  name="observaciones"
                  rows="2"
                  placeholder="Notas adicionales..."
                  class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                ></textarea>
              </div>
            </div>

            <!-- Botones -->
            <div class="flex justify-end gap-3 pt-4">
              @if (editingPago()) {
                <button
                  type="button"
                  (click)="cancelarEdicion()"
                  class="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancelar
                </button>
              }
              <button
                type="submit"
                [disabled]="isLoadingManual() || !pagoManual.documento || !pagoManual.fechaPago || !pagoManual.monto || !pagoManual.numeroOperacion"
                class="px-6 py-2.5 text-white rounded-lg font-medium disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                [class]="editingPago() ? 'bg-amber-600 hover:bg-amber-700' : 'bg-green-600 hover:bg-green-700'"
              >
                @if (isLoadingManual()) {
                  <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  {{ editingPago() ? 'Actualizando...' : 'Guardando...' }}
                } @else {
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  {{ editingPago() ? 'Actualizar Pago' : 'Registrar Pago' }}
                }
              </button>
            </div>
          </form>

          <!-- Resultado del registro manual -->
          @if (resultadoManual()) {
            <div class="mt-4 p-4 rounded-lg flex items-center gap-3"
                 [class]="resultadoManual()?.exitoso
                   ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                   : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'">
              @if (resultadoManual()?.exitoso) {
                <svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <div>
                  <p class="font-medium text-green-800 dark:text-green-300">{{ resultadoManual()?.mensaje }}</p>
                  @if (resultadoManual()?.pagoId) {
                    <p class="text-sm text-green-700 dark:text-green-400">
                      ID: <span class="font-mono font-bold">{{ resultadoManual()?.pagoId }}</span> -
                      Doc: {{ resultadoManual()?.documento }} -
                      S/ {{ formatMonto(resultadoManual()?.monto) }}
                    </p>
                  }
                </div>
              } @else {
                <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <p class="font-medium text-red-800 dark:text-red-300">{{ resultadoManual()?.mensaje }}</p>
              }
            </div>
          }
            </div>
          }
        </div>

        <!-- Historial de Pagos Manuales -->
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div class="p-4 border-b border-slate-200 dark:border-slate-700">
            <h2 class="text-lg font-semibold text-slate-800 dark:text-white mb-4">
              Historial de Pagos Manuales
            </h2>

            <!-- Filtros -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label class="block text-xs font-medium text-slate-500 mb-1">Documento</label>
                <input
                  type="text"
                  [(ngModel)]="filtros.documento"
                  placeholder="Buscar DNI..."
                  class="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                />
              </div>
              <div>
                <label class="block text-xs font-medium text-slate-500 mb-1">Desde</label>
                <input
                  type="date"
                  [(ngModel)]="filtros.fechaDesde"
                  class="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                />
              </div>
              <div>
                <label class="block text-xs font-medium text-slate-500 mb-1">Hasta</label>
                <input
                  type="date"
                  [(ngModel)]="filtros.fechaHasta"
                  class="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                />
              </div>
              <div>
                <label class="block text-xs font-medium text-slate-500 mb-1">Banco</label>
                <select
                  [(ngModel)]="filtros.banco"
                  class="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                >
                  <option value="">Todos</option>
                  <option value="BCP">BCP</option>
                  <option value="INTERBANK">Interbank</option>
                  <option value="BBVA">BBVA</option>
                  <option value="SCOTIABANK">Scotiabank</option>
                  <option value="BANBIF">BanBif</option>
                  <option value="BANCO DE LA NACION">Banco de la Naci\xF3n</option>
                  <option value="OTRO">Otro</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-medium text-slate-500 mb-1">Medio</label>
                <select
                  [(ngModel)]="filtros.medioAtencion"
                  class="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                >
                  <option value="">Todos</option>
                  <option value="VENTANILLA">Ventanilla</option>
                  <option value="AGENTE BCP">Agente BCP</option>
                  <option value="APP">App M\xF3vil</option>
                  <option value="BANCA POR INTERNET">Banca por Internet</option>
                  <option value="MANUAL">Manual</option>
                  <option value="OTRO">Otro</option>
                </select>
              </div>
            </div>

            <!-- Botones de filtro -->
            <div class="flex gap-2 mt-4">
              <button
                (click)="cargarPagosManuales()"
                class="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                Buscar
              </button>
              <button
                (click)="limpiarFiltros()"
                class="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-sm rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                Limpiar
              </button>
            </div>
          </div>

          <!-- Contador de registros -->
          <div class="px-4 py-2 bg-slate-50 dark:bg-slate-700/30 border-b border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400">
            Mostrando {{ pagosManuales().length }} de {{ totalRegistros() }} registros
          </div>

          <!-- Tabla -->
          @if (isLoadingList()) {
            <div class="p-8 text-center">
              <svg class="animate-spin h-8 w-8 mx-auto text-blue-500" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              <p class="mt-2 text-slate-500">Cargando...</p>
            </div>
          } @else if (pagosManuales().length === 0) {
            <div class="p-8 text-center text-slate-500">
              <svg class="w-12 h-12 mx-auto mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              No hay pagos manuales registrados
            </div>
          } @else {
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                <thead class="bg-slate-50 dark:bg-slate-700/50">
                  <tr>
                    <th class="px-3 py-3 text-left text-xs font-medium text-slate-500 uppercase">Documento</th>
                    <th class="px-3 py-3 text-left text-xs font-medium text-slate-500 uppercase">Fecha</th>
                    <th class="px-3 py-3 text-right text-xs font-medium text-slate-500 uppercase">Monto</th>
                    <th class="px-3 py-3 text-left text-xs font-medium text-slate-500 uppercase">Nro. Op.</th>
                    <th class="px-3 py-3 text-left text-xs font-medium text-slate-500 uppercase">Banco</th>
                    <th class="px-3 py-3 text-left text-xs font-medium text-slate-500 uppercase">Medio</th>
                    <th class="px-3 py-3 text-center text-xs font-medium text-slate-500 uppercase">Estado</th>
                    <th class="px-3 py-3 text-center text-xs font-medium text-slate-500 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
                  @for (pago of pagosManuales(); track pago.id) {
                    <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                      <td class="px-3 py-2 text-sm font-medium text-slate-800 dark:text-white">{{ pago.documento }}</td>
                      <td class="px-3 py-2 text-sm text-slate-600 dark:text-slate-300">{{ pago.fechaBanco }}</td>
                      <td class="px-3 py-2 text-sm font-medium text-green-600 text-right">S/ {{ formatMonto(pago.montoBanco) }}</td>
                      <td class="px-3 py-2 text-sm text-slate-600 dark:text-slate-300">{{ pago.numeroOperacion }}</td>
                      <td class="px-3 py-2 text-sm text-slate-600 dark:text-slate-300">{{ pago.banco }}</td>
                      <td class="px-3 py-2 text-sm text-slate-600 dark:text-slate-300">{{ pago.medioAtencion || '-' }}</td>
                      <td class="px-3 py-2 text-center">
                        @if (pago.cuotaAplicadaId) {
                          <span class="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full">
                            Conciliado
                          </span>
                        } @else if (pago.procesado) {
                          <span class="px-2 py-1 text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded-full">
                            Procesado
                          </span>
                        } @else {
                          <span class="px-2 py-1 text-xs font-medium bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400 rounded-full">
                            Pendiente
                          </span>
                        }
                      </td>
                      <td class="px-3 py-2 text-center">
                        <div class="flex justify-center gap-1">
                          <button
                            (click)="editarPago(pago)"
                            class="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors"
                            title="Editar"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                            </svg>
                          </button>
                          <button
                            (click)="confirmarEliminar(pago)"
                            [disabled]="pago.cuotaAplicadaId !== null && pago.cuotaAplicadaId !== undefined"
                            class="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Eliminar"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>

            <!-- Paginaci\xF3n -->
            @if (totalPages() > 1) {
              <div class="px-4 py-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <button
                  (click)="cambiarPagina(currentPage() - 1)"
                  [disabled]="currentPage() <= 1"
                  class="px-3 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Anterior
                </button>
                <span class="text-sm text-slate-600 dark:text-slate-400">
                  P\xE1gina {{ currentPage() }} de {{ totalPages() }}
                </span>
                <button
                  (click)="cambiarPagina(currentPage() + 1)"
                  [disabled]="currentPage() >= totalPages()"
                  class="px-3 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Siguiente
                </button>
              </div>
            }
          }
        </div>
      }

      <!-- Tab: Carga OH -->
      @if (activeTab() === 'oh') {
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-6">
          <h2 class="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <span class="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-medium rounded">
              Financiera OH
            </span>
            Cargar Archivo Excel de Pagos
          </h2>

          <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div class="flex-1">
              <label
                for="file-upload-oh"
                class="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer
                       border-purple-300 dark:border-purple-600 hover:border-purple-400 dark:hover:border-purple-500
                       bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
              >
                <div class="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg class="w-8 h-8 mb-3 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                  @if (selectedFileOh()) {
                    <p class="text-sm text-purple-600 dark:text-purple-400 font-medium">{{ selectedFileOh()?.name }}</p>
                    <p class="text-xs text-slate-500">{{ formatFileSize(selectedFileOh()?.size || 0) }}</p>
                  } @else {
                    <p class="mb-2 text-sm text-slate-500 dark:text-slate-400">
                      <span class="font-semibold">Click para seleccionar</span> o arrastra el archivo
                    </p>
                    <p class="text-xs text-slate-500 dark:text-slate-400">Archivos Excel (.xlsx, .xls)</p>
                  }
                </div>
                <input id="file-upload-oh" type="file" class="hidden" accept=".xlsx,.xls" (change)="onFileSelectedOh($event)" />
              </label>
            </div>

            <button
              (click)="procesarArchivoOh()"
              [disabled]="!selectedFileOh() || isLoadingOh()"
              class="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              @if (isLoadingOh()) {
                <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Procesando...
              } @else {
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                </svg>
                Procesar Archivo
              }
            </button>
          </div>

          @if (errorMessageOh()) {
            <div class="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p class="text-red-700 dark:text-red-400">{{ errorMessageOh() }}</p>
            </div>
          }
        </div>

        <!-- Resultados de carga OH -->
        @if (resultadoOh()) {
          @if (resultadoOh()?.exitoso && resultadoOh()?.archivoId) {
            <div class="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-3">
              <svg class="w-6 h-6 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <div>
                <p class="font-medium text-green-800 dark:text-green-300">Archivo procesado correctamente</p>
                <p class="text-sm text-green-700 dark:text-green-400">
                  ID: <span class="font-mono font-bold">{{ resultadoOh()?.archivoId }}</span> - {{ resultadoOh()?.registrosProcesados }} registros
                  @if (resultadoOh()?.duplicadosOmitidos && resultadoOh()!.duplicadosOmitidos > 0) {
                    <span class="text-amber-600 dark:text-amber-400">({{ resultadoOh()?.duplicadosOmitidos }} duplicados omitidos)</span>
                  }
                </p>
              </div>
            </div>
          }

          @if (!resultadoOh()?.exitoso && resultadoOh()?.duplicadosOmitidos && resultadoOh()!.duplicadosOmitidos > 0) {
            <div class="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg flex items-center gap-3">
              <svg class="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
              <div>
                <p class="font-medium text-amber-800 dark:text-amber-300">Todos los registros ya existen</p>
                <p class="text-sm text-amber-700 dark:text-amber-400">{{ resultadoOh()?.duplicadosOmitidos }} registros duplicados</p>
              </div>
            </div>
          }

          <!-- Tabla de detalles OH -->
          @if (resultadoOh()?.detalles && resultadoOh()!.detalles.length > 0) {
            <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div class="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <h2 class="text-lg font-semibold text-slate-800 dark:text-white">Detalle de Pagos OH</h2>
                <span class="text-sm text-slate-500">{{ resultadoOh()?.detalles?.length }} registros</span>
              </div>
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                  <thead class="bg-purple-50 dark:bg-purple-900/20">
                    <tr>
                      <th class="px-3 py-3 text-left text-xs font-medium text-slate-500 uppercase">DNI</th>
                      <th class="px-3 py-3 text-left text-xs font-medium text-slate-500 uppercase">Cuenta</th>
                      <th class="px-3 py-3 text-left text-xs font-medium text-slate-500 uppercase">Fecha</th>
                      <th class="px-3 py-3 text-right text-xs font-medium text-slate-500 uppercase">Monto</th>
                      <th class="px-3 py-3 text-left text-xs font-medium text-slate-500 uppercase">Canal</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
                    @for (d of resultadoOh()?.detalles; track d.numeroFila) {
                      <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                        <td class="px-3 py-2 text-sm font-medium text-slate-800 dark:text-white">{{ d.documento }}</td>
                        <td class="px-3 py-2 text-sm text-slate-600 dark:text-slate-300">{{ d.codigoDepositante }}</td>
                        <td class="px-3 py-2 text-sm text-slate-600 dark:text-slate-300">{{ d.fechaPago }}</td>
                        <td class="px-3 py-2 text-sm font-medium text-green-600 text-right">S/ {{ formatMonto(d.montoPagado) }}</td>
                        <td class="px-3 py-2 text-sm text-slate-600 dark:text-slate-300">{{ d.medioAtencion }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
          }
        }
      }

      <!-- Modal de confirmaci\xF3n de eliminaci\xF3n -->
      @if (showDeleteModal()) {
        <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div class="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <div class="flex items-center gap-3 mb-4">
              <div class="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
                <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-slate-800 dark:text-white">Confirmar eliminaci\xF3n</h3>
            </div>
            <p class="text-slate-600 dark:text-slate-400 mb-6">
              \xBFEst\xE1s seguro de eliminar el pago de <strong>{{ pagoAEliminar()?.documento }}</strong> por <strong>S/ {{ formatMonto(pagoAEliminar()?.montoBanco) }}</strong>?
              Esta acci\xF3n no se puede deshacer.
            </p>
            <div class="flex justify-end gap-3">
              <button
                (click)="cancelarEliminar()"
                class="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                (click)="eliminarPago()"
                [disabled]="isDeleting()"
                class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400 transition-colors flex items-center gap-2"
              >
                @if (isDeleting()) {
                  <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                }
                Eliminar
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `
    }]
  }], () => [{ type: BcpPagosService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PagosBancariosPage, { className: "PagosBancariosPage", filePath: "src/app/pagos-bancarios/pages/pagos-bancarios.page.ts", lineNumber: 802 });
})();
export {
  PagosBancariosPage
};
//# sourceMappingURL=chunk-2RTEUB7A.js.map
