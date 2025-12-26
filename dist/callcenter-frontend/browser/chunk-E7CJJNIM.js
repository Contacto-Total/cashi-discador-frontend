import {
  ArcElement,
  BarController,
  BarElement,
  BaseChartDirective,
  CategoryScale,
  Chart,
  DoughnutController,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
  plugin_legend,
  plugin_tooltip
} from "./chunk-YWZCMPVI.js";
import {
  ThemeService
} from "./chunk-D3RWIMJ4.js";
import {
  LucideAngularComponent,
  LucideAngularModule
} from "./chunk-RFBUEVFE.js";
import {
  environment
} from "./chunk-QF774CZR.js";
import {
  ChangeDetectorRef,
  CommonModule,
  Component,
  DecimalPipe,
  HttpClient,
  Injectable,
  computed,
  effect,
  interval,
  setClassMetadata,
  signal,
  switchMap,
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
  ɵɵinject,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵpipeBind2,
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2
} from "./chunk-CTRHJBBW.js";

// src/app/pagos-bancarios/services/payments-dashboard.service.ts
var _PaymentsDashboardService = class _PaymentsDashboardService {
  constructor(http) {
    this.http = http;
    this.baseUrl = `${environment.gatewayUrl}/dashboard/payments`;
  }
  /**
   * Obtiene todas las métricas del dashboard de pagos
   */
  getDashboard() {
    console.log("[DASHBOARD] Obteniendo m\xE9tricas de pagos...");
    return this.http.get(this.baseUrl);
  }
};
_PaymentsDashboardService.\u0275fac = function PaymentsDashboardService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _PaymentsDashboardService)(\u0275\u0275inject(HttpClient));
};
_PaymentsDashboardService.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _PaymentsDashboardService, factory: _PaymentsDashboardService.\u0275fac, providedIn: "root" });
var PaymentsDashboardService = _PaymentsDashboardService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PaymentsDashboardService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{ type: HttpClient }], null);
})();

// src/app/pagos-bancarios/pages/payments-dashboard/payments-dashboard.component.ts
var _forTrack0 = ($index, $item) => $item.agenteId;
function PaymentsDashboardComponent_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 6);
    \u0275\u0275element(1, "div", 8);
    \u0275\u0275elementEnd();
  }
}
function PaymentsDashboardComponent_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 7);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.error(), " ");
  }
}
function PaymentsDashboardComponent_Conditional_10_Conditional_98_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "canvas", 41);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275property("type", "doughnut")("data", ctx_r0.conciliacionChartData)("options", ctx_r0.doughnutChartOptions());
  }
}
function PaymentsDashboardComponent_Conditional_10_Conditional_117_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "canvas", 41);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275property("type", "doughnut")("data", ctx_r0.promesasChartData)("options", ctx_r0.doughnutChartOptions());
  }
}
function PaymentsDashboardComponent_Conditional_10_Conditional_137_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "canvas", 41);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275property("type", "line")("data", ctx_r0.tendenciaChartData)("options", ctx_r0.lineChartOptions());
  }
}
function PaymentsDashboardComponent_Conditional_10_For_144_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 54)(1, "div", 57);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 58)(4, "p", 59);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p", 60);
    \u0275\u0275text(7);
    \u0275\u0275pipe(8, "number");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "div", 61)(10, "p", 62);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "p", 60);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const agente_r2 = ctx.$implicit;
    const \u0275$index_275_r3 = ctx.$index;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275classMap(\u0275$index_275_r3 === 0 ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400" : \u0275$index_275_r3 === 1 ? "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300" : \u0275$index_275_r3 === 2 ? "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400" : "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", \u0275$index_275_r3 + 1, " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(agente_r2.nombreAgente);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2(" ", agente_r2.promesasRegistradas, " promesas \xB7 ", \u0275\u0275pipeBind2(8, 8, agente_r2.tasaCumplimiento, "1.0-0"), "% cumplimiento ");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r0.formatCurrency(agente_r2.montoTotal));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", agente_r2.cantidadPagos, " pagos");
  }
}
function PaymentsDashboardComponent_Conditional_10_ForEmpty_145_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 55);
    \u0275\u0275element(1, "lucide-angular", 63);
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3, "No hay datos de agentes");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 32);
  }
}
function PaymentsDashboardComponent_Conditional_10_Conditional_151_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "canvas", 41);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275property("type", "bar")("data", ctx_r0.bancosChartData)("options", ctx_r0.barChartOptions());
  }
}
function PaymentsDashboardComponent_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 9)(1, "div", 10)(2, "div", 11)(3, "div")(4, "p", 12);
    \u0275\u0275text(5, "Pagos Banco");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p", 13);
    \u0275\u0275text(7);
    \u0275\u0275pipe(8, "number");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "p", 14);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "div", 15);
    \u0275\u0275element(12, "lucide-angular", 16);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(13, "div", 10)(14, "div", 11)(15, "div")(16, "p", 12);
    \u0275\u0275text(17, "Conciliados");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "p", 17);
    \u0275\u0275text(19);
    \u0275\u0275pipe(20, "number");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "p", 18);
    \u0275\u0275text(22);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(23, "div", 19);
    \u0275\u0275element(24, "lucide-angular", 20);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(25, "div", 10)(26, "div", 11)(27, "div")(28, "p", 12);
    \u0275\u0275text(29, "Pagos Voluntarios");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(30, "p", 21);
    \u0275\u0275text(31);
    \u0275\u0275pipe(32, "number");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "p", 22);
    \u0275\u0275text(34);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(35, "div", 23);
    \u0275\u0275element(36, "lucide-angular", 24);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(37, "div", 10)(38, "div", 11)(39, "div")(40, "p", 12);
    \u0275\u0275text(41, "Sin Verificar");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(42, "p", 25);
    \u0275\u0275text(43);
    \u0275\u0275pipe(44, "number");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(45, "p", 26);
    \u0275\u0275text(46);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(47, "div", 27);
    \u0275\u0275element(48, "lucide-angular", 28);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(49, "div", 9)(50, "div", 10)(51, "div", 11)(52, "div")(53, "p", 12);
    \u0275\u0275text(54, "Total Promesas");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(55, "p", 13);
    \u0275\u0275text(56);
    \u0275\u0275pipe(57, "number");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(58, "p", 29);
    \u0275\u0275text(59);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(60, "div", 30);
    \u0275\u0275element(61, "lucide-angular", 31);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(62, "div", 10)(63, "div", 11)(64, "div")(65, "p", 12);
    \u0275\u0275text(66, "Cumplidas");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(67, "p", 17);
    \u0275\u0275text(68);
    \u0275\u0275pipe(69, "number");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(70, "div", 19);
    \u0275\u0275element(71, "lucide-angular", 32);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(72, "div", 10)(73, "div", 11)(74, "div")(75, "p", 12);
    \u0275\u0275text(76, "Vencidas");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(77, "p", 25);
    \u0275\u0275text(78);
    \u0275\u0275pipe(79, "number");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(80, "div", 27);
    \u0275\u0275element(81, "lucide-angular", 33);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(82, "div", 10)(83, "div", 11)(84, "div")(85, "p", 12);
    \u0275\u0275text(86, "Tasa Cumplimiento");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(87, "p", 34);
    \u0275\u0275text(88);
    \u0275\u0275pipe(89, "number");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(90, "div", 35);
    \u0275\u0275element(91, "lucide-angular", 36);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(92, "div", 37)(93, "div", 10)(94, "h3", 38);
    \u0275\u0275element(95, "lucide-angular", 39);
    \u0275\u0275text(96, " Estado de Conciliaci\xF3n ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(97, "div", 40);
    \u0275\u0275conditionalCreate(98, PaymentsDashboardComponent_Conditional_10_Conditional_98_Template, 1, 3, "canvas", 41);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(99, "div", 42)(100, "div", 43);
    \u0275\u0275element(101, "div", 44);
    \u0275\u0275elementStart(102, "span", 45);
    \u0275\u0275text(103, "Conciliados");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(104, "div", 43);
    \u0275\u0275element(105, "div", 46);
    \u0275\u0275elementStart(106, "span", 45);
    \u0275\u0275text(107, "Voluntarios");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(108, "div", 43);
    \u0275\u0275element(109, "div", 47);
    \u0275\u0275elementStart(110, "span", 45);
    \u0275\u0275text(111, "Sin Verificar");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(112, "div", 10)(113, "h3", 38);
    \u0275\u0275element(114, "lucide-angular", 48);
    \u0275\u0275text(115, " Estado de Promesas ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(116, "div", 40);
    \u0275\u0275conditionalCreate(117, PaymentsDashboardComponent_Conditional_10_Conditional_117_Template, 1, 3, "canvas", 41);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(118, "div", 42)(119, "div", 43);
    \u0275\u0275element(120, "div", 44);
    \u0275\u0275elementStart(121, "span", 45);
    \u0275\u0275text(122, "Cumplidas");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(123, "div", 43);
    \u0275\u0275element(124, "div", 49);
    \u0275\u0275elementStart(125, "span", 45);
    \u0275\u0275text(126, "Pendientes");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(127, "div", 43);
    \u0275\u0275element(128, "div", 47);
    \u0275\u0275elementStart(129, "span", 45);
    \u0275\u0275text(130, "Vencidas");
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275elementStart(131, "div", 37)(132, "div", 10)(133, "h3", 38);
    \u0275\u0275element(134, "lucide-angular", 50);
    \u0275\u0275text(135, " Tendencia de Pagos (\xDAltimos 30 d\xEDas) ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(136, "div", 51);
    \u0275\u0275conditionalCreate(137, PaymentsDashboardComponent_Conditional_10_Conditional_137_Template, 1, 3, "canvas", 41);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(138, "div", 10)(139, "h3", 38);
    \u0275\u0275element(140, "lucide-angular", 52);
    \u0275\u0275text(141, " Top Agentes por Monto ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(142, "div", 53);
    \u0275\u0275repeaterCreate(143, PaymentsDashboardComponent_Conditional_10_For_144_Template, 14, 11, "div", 54, _forTrack0, false, PaymentsDashboardComponent_Conditional_10_ForEmpty_145_Template, 4, 1, "div", 55);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(146, "div", 10)(147, "h3", 38);
    \u0275\u0275element(148, "lucide-angular", 56);
    \u0275\u0275text(149, " Distribuci\xF3n por Banco ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(150, "div", 51);
    \u0275\u0275conditionalCreate(151, PaymentsDashboardComponent_Conditional_10_Conditional_151_Template, 1, 3, "canvas", 41);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_1_0;
    let tmp_2_0;
    let tmp_4_0;
    let tmp_5_0;
    let tmp_7_0;
    let tmp_8_0;
    let tmp_10_0;
    let tmp_11_0;
    let tmp_13_0;
    let tmp_14_0;
    let tmp_16_0;
    let tmp_18_0;
    let tmp_20_0;
    let tmp_21_0;
    let tmp_30_0;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(8, 33, (tmp_1_0 = ctx_r0.dashboard()) == null ? null : tmp_1_0.totalPagosBanco));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.formatCurrency((tmp_2_0 = ctx_r0.dashboard()) == null ? null : tmp_2_0.montoTotalBanco));
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 24);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(20, 35, (tmp_4_0 = ctx_r0.dashboard()) == null ? null : tmp_4_0.pagosConciliados));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.formatCurrency((tmp_5_0 = ctx_r0.dashboard()) == null ? null : tmp_5_0.montoConciliado));
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 24);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(32, 37, (tmp_7_0 = ctx_r0.dashboard()) == null ? null : tmp_7_0.pagosPorFuera));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.formatCurrency((tmp_8_0 = ctx_r0.dashboard()) == null ? null : tmp_8_0.montoPorFuera));
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 24);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(44, 39, (tmp_10_0 = ctx_r0.dashboard()) == null ? null : tmp_10_0.pagosNoVerificados));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.formatCurrency((tmp_11_0 = ctx_r0.dashboard()) == null ? null : tmp_11_0.montoNoVerificado));
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 24);
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(57, 41, (tmp_13_0 = ctx_r0.dashboard()) == null ? null : tmp_13_0.totalPromesas));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.formatCurrency((tmp_14_0 = ctx_r0.dashboard()) == null ? null : tmp_14_0.montoPrometido));
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 24);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(69, 43, (tmp_16_0 = ctx_r0.dashboard()) == null ? null : tmp_16_0.promesasCumplidas));
    \u0275\u0275advance(3);
    \u0275\u0275property("size", 24);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(79, 45, (tmp_18_0 = ctx_r0.dashboard()) == null ? null : tmp_18_0.promesasVencidas));
    \u0275\u0275advance(3);
    \u0275\u0275property("size", 24);
    \u0275\u0275advance(6);
    \u0275\u0275classMap(ctx_r0.getTasaClass(((tmp_20_0 = ctx_r0.dashboard()) == null ? null : tmp_20_0.tasaCumplimiento) || 0));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind2(89, 47, (tmp_21_0 = ctx_r0.dashboard()) == null ? null : tmp_21_0.tasaCumplimiento, "1.1-1"), "% ");
    \u0275\u0275advance(3);
    \u0275\u0275property("size", 24);
    \u0275\u0275advance(4);
    \u0275\u0275property("size", 20);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r0.showCharts() ? 98 : -1);
    \u0275\u0275advance(16);
    \u0275\u0275property("size", 20);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r0.showCharts() ? 117 : -1);
    \u0275\u0275advance(17);
    \u0275\u0275property("size", 20);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r0.showCharts() ? 137 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275property("size", 20);
    \u0275\u0275advance(3);
    \u0275\u0275repeater((tmp_30_0 = ctx_r0.dashboard()) == null ? null : tmp_30_0.topAgentes);
    \u0275\u0275advance(5);
    \u0275\u0275property("size", 20);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r0.showCharts() ? 151 : -1);
  }
}
Chart.register(DoughnutController, ArcElement, BarController, BarElement, LineController, LineElement, PointElement, CategoryScale, LinearScale, plugin_tooltip, plugin_legend);
var _PaymentsDashboardComponent = class _PaymentsDashboardComponent {
  constructor(dashboardService, themeService, cdr) {
    this.dashboardService = dashboardService;
    this.themeService = themeService;
    this.cdr = cdr;
    this.dashboard = signal(null, ...ngDevMode ? [{ debugName: "dashboard" }] : []);
    this.loading = signal(true, ...ngDevMode ? [{ debugName: "loading" }] : []);
    this.error = signal(null, ...ngDevMode ? [{ debugName: "error" }] : []);
    this.showCharts = signal(true, ...ngDevMode ? [{ debugName: "showCharts" }] : []);
    this.isDark = computed(() => this.themeService.isDarkMode(), ...ngDevMode ? [{ debugName: "isDark" }] : []);
    this.doughnutChartOptions = computed(() => {
      const isDark = this.themeService.isDarkMode();
      const textColor = isDark ? "#e2e8f0" : "#1f2937";
      const tooltipBg = isDark ? "#1e293b" : "#ffffff";
      const tooltipBorder = isDark ? "#334155" : "#d1d5db";
      return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: tooltipBg,
            titleColor: textColor,
            bodyColor: textColor,
            borderColor: tooltipBorder,
            borderWidth: 1,
            callbacks: {
              label: (context) => {
                const value = context.parsed || 0;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = total > 0 ? (value / total * 100).toFixed(1) : "0";
                return `${context.label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
      };
    }, ...ngDevMode ? [{ debugName: "doughnutChartOptions" }] : []);
    this.lineChartOptions = computed(() => {
      const isDark = this.themeService.isDarkMode();
      const textColor = isDark ? "#e2e8f0" : "#1f2937";
      const gridColor = isDark ? "rgba(148, 163, 184, 0.2)" : "rgba(107, 114, 128, 0.3)";
      const tooltipBg = isDark ? "#1e293b" : "#ffffff";
      const tooltipBorder = isDark ? "#334155" : "#d1d5db";
      return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: "top",
            labels: {
              color: textColor
            }
          },
          tooltip: {
            backgroundColor: tooltipBg,
            titleColor: textColor,
            bodyColor: textColor,
            borderColor: tooltipBorder,
            borderWidth: 1
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: gridColor
            },
            ticks: {
              color: textColor
            }
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: textColor
            }
          }
        }
      };
    }, ...ngDevMode ? [{ debugName: "lineChartOptions" }] : []);
    this.barChartOptions = computed(() => {
      const isDark = this.themeService.isDarkMode();
      const textColor = isDark ? "#e2e8f0" : "#1f2937";
      const gridColor = isDark ? "rgba(148, 163, 184, 0.2)" : "rgba(107, 114, 128, 0.3)";
      const tooltipBg = isDark ? "#1e293b" : "#ffffff";
      const tooltipBorder = isDark ? "#334155" : "#d1d5db";
      return {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: "y",
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: tooltipBg,
            titleColor: textColor,
            bodyColor: textColor,
            borderColor: tooltipBorder,
            borderWidth: 1
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            grid: {
              color: gridColor
            },
            ticks: {
              color: textColor
            }
          },
          y: {
            grid: {
              display: false
            },
            ticks: {
              color: textColor
            }
          }
        }
      };
    }, ...ngDevMode ? [{ debugName: "barChartOptions" }] : []);
    this.conciliacionChartData = { labels: [], datasets: [] };
    this.promesasChartData = { labels: [], datasets: [] };
    this.tendenciaChartData = { labels: [], datasets: [] };
    this.bancosChartData = { labels: [], datasets: [] };
    effect(() => {
      const isDark = this.themeService.isDarkMode();
      console.log("[DASHBOARD] Tema detectado:", isDark ? "dark" : "light");
      this.showCharts.set(false);
      this.cdr.detectChanges();
      setTimeout(() => {
        this.showCharts.set(true);
        this.cdr.detectChanges();
      }, 50);
    });
  }
  ngOnInit() {
    this.loadDashboard();
    this.startPolling();
  }
  ngOnDestroy() {
    this.pollingSubscription?.unsubscribe();
  }
  loadDashboard() {
    this.loading.set(true);
    this.error.set(null);
    this.dashboardService.getDashboard().subscribe({
      next: (data) => {
        this.dashboard.set(data);
        this.updateCharts(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error("[DASHBOARD] Error cargando dashboard:", err);
        this.error.set("Error al cargar el dashboard. Intente nuevamente.");
        this.loading.set(false);
      }
    });
  }
  startPolling() {
    this.pollingSubscription = interval(6e4).pipe(switchMap(() => this.dashboardService.getDashboard())).subscribe({
      next: (data) => {
        this.dashboard.set(data);
        this.updateCharts(data);
      },
      error: (err) => console.error("[DASHBOARD] Error en polling:", err)
    });
  }
  updateCharts(data) {
    this.conciliacionChartData = {
      labels: ["Conciliados", "Voluntarios", "Sin Verificar"],
      datasets: [{
        data: [data.pagosConciliados, data.pagosPorFuera, data.pagosNoVerificados],
        backgroundColor: ["#22c55e", "#f59e0b", "#ef4444"],
        borderWidth: 0
      }]
    };
    this.promesasChartData = {
      labels: ["Cumplidas", "Pendientes", "Vencidas"],
      datasets: [{
        data: [data.promesasCumplidas, data.promesasPendientes, data.promesasVencidas],
        backgroundColor: ["#22c55e", "#3b82f6", "#ef4444"],
        borderWidth: 0
      }]
    };
    const tendencia = [...data.tendenciaDiaria || []].reverse().slice(-15);
    this.tendenciaChartData = {
      labels: tendencia.map((t) => this.formatDate(t.fecha)),
      datasets: [
        {
          label: "Banco",
          data: tendencia.map((t) => t.cantidadBanco),
          borderColor: "#3b82f6",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          fill: true,
          tension: 0.4
        },
        {
          label: "Agente",
          data: tendencia.map((t) => t.cantidadAgente),
          borderColor: "#22c55e",
          backgroundColor: "rgba(34, 197, 94, 0.1)",
          fill: true,
          tension: 0.4
        }
      ]
    };
    const bancos = data.distribucionBancos || [];
    this.bancosChartData = {
      labels: bancos.map((b) => b.banco || "OTRO"),
      datasets: [{
        data: bancos.map((b) => b.monto),
        backgroundColor: ["#3b82f6", "#6366f1", "#8b5cf6", "#a855f7", "#d946ef"],
        borderWidth: 0
      }]
    };
  }
  formatCurrency(value) {
    if (value == null)
      return "S/ 0.00";
    return "S/ " + value.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  formatDate(dateStr) {
    if (!dateStr)
      return "";
    const parts = dateStr.split(/[\/\-]/);
    if (parts.length >= 2) {
      return `${parts[0]}/${parts[1]}`;
    }
    return dateStr;
  }
  getTasaClass(tasa) {
    if (tasa >= 70)
      return "text-green-600 dark:text-green-400";
    if (tasa >= 40)
      return "text-amber-600 dark:text-amber-400";
    return "text-red-600 dark:text-red-400";
  }
};
_PaymentsDashboardComponent.\u0275fac = function PaymentsDashboardComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _PaymentsDashboardComponent)(\u0275\u0275directiveInject(PaymentsDashboardService), \u0275\u0275directiveInject(ThemeService), \u0275\u0275directiveInject(ChangeDetectorRef));
};
_PaymentsDashboardComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PaymentsDashboardComponent, selectors: [["app-payments-dashboard"]], decls: 11, vars: 2, consts: [[1, "min-h-screen", "bg-gray-50", "dark:bg-slate-900", "p-6"], [1, "mb-6"], [1, "text-2xl", "font-bold", "text-gray-800", "dark:text-white", "flex", "items-center", "gap-3"], [1, "w-10", "h-10", "bg-gradient-to-br", "from-blue-500", "to-indigo-600", "rounded-xl", "flex", "items-center", "justify-center"], ["name", "bar-chart-3", 1, "text-white", 3, "size"], [1, "text-gray-500", "dark:text-gray-400", "mt-1"], [1, "flex", "items-center", "justify-center", "h-64"], [1, "bg-red-50", "dark:bg-red-900/20", "border", "border-red-200", "dark:border-red-800", "rounded-lg", "p-4", "text-red-700", "dark:text-red-300"], [1, "animate-spin", "rounded-full", "h-12", "w-12", "border-b-2", "border-blue-500"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "lg:grid-cols-4", "gap-4", "mb-6"], [1, "bg-white", "dark:bg-slate-800", "rounded-xl", "shadow-sm", "border", "border-gray-100", "dark:border-slate-700", "p-5"], [1, "flex", "items-center", "justify-between"], [1, "text-sm", "text-gray-500", "dark:text-gray-400"], [1, "text-2xl", "font-bold", "text-gray-800", "dark:text-white"], [1, "text-sm", "text-blue-600", "dark:text-blue-400", "font-medium"], [1, "w-12", "h-12", "bg-blue-100", "dark:bg-blue-900/30", "rounded-full", "flex", "items-center", "justify-center"], ["name", "building-2", 1, "text-blue-600", "dark:text-blue-400", 3, "size"], [1, "text-2xl", "font-bold", "text-green-600", "dark:text-green-400"], [1, "text-sm", "text-green-600", "dark:text-green-400", "font-medium"], [1, "w-12", "h-12", "bg-green-100", "dark:bg-green-900/30", "rounded-full", "flex", "items-center", "justify-center"], ["name", "check-circle", 1, "text-green-600", "dark:text-green-400", 3, "size"], [1, "text-2xl", "font-bold", "text-amber-600", "dark:text-amber-400"], [1, "text-sm", "text-amber-600", "dark:text-amber-400", "font-medium"], [1, "w-12", "h-12", "bg-amber-100", "dark:bg-amber-900/30", "rounded-full", "flex", "items-center", "justify-center"], ["name", "user-check", 1, "text-amber-600", "dark:text-amber-400", 3, "size"], [1, "text-2xl", "font-bold", "text-red-600", "dark:text-red-400"], [1, "text-sm", "text-red-600", "dark:text-red-400", "font-medium"], [1, "w-12", "h-12", "bg-red-100", "dark:bg-red-900/30", "rounded-full", "flex", "items-center", "justify-center"], ["name", "alert-triangle", 1, "text-red-600", "dark:text-red-400", 3, "size"], [1, "text-sm", "text-indigo-600", "dark:text-indigo-400", "font-medium"], [1, "w-12", "h-12", "bg-indigo-100", "dark:bg-indigo-900/30", "rounded-full", "flex", "items-center", "justify-center"], ["name", "handshake", 1, "text-indigo-600", "dark:text-indigo-400", 3, "size"], ["name", "badge-check", 1, "text-green-600", "dark:text-green-400", 3, "size"], ["name", "clock", 1, "text-red-600", "dark:text-red-400", 3, "size"], [1, "text-2xl", "font-bold"], [1, "w-12", "h-12", "bg-purple-100", "dark:bg-purple-900/30", "rounded-full", "flex", "items-center", "justify-center"], ["name", "trending-up", 1, "text-purple-600", "dark:text-purple-400", 3, "size"], [1, "grid", "grid-cols-1", "lg:grid-cols-2", "gap-6", "mb-6"], [1, "text-lg", "font-semibold", "text-gray-800", "dark:text-white", "mb-4", "flex", "items-center", "gap-2"], ["name", "pie-chart", 1, "text-blue-500", 3, "size"], [1, "h-64", "flex", "items-center", "justify-center"], ["baseChart", "", 3, "type", "data", "options"], [1, "mt-4", "flex", "flex-wrap", "justify-center", "gap-4"], [1, "flex", "items-center", "gap-2"], [1, "w-3", "h-3", "rounded-full", "bg-green-500"], [1, "text-sm", "text-gray-600", "dark:text-gray-400"], [1, "w-3", "h-3", "rounded-full", "bg-amber-500"], [1, "w-3", "h-3", "rounded-full", "bg-red-500"], ["name", "target", 1, "text-indigo-500", 3, "size"], [1, "w-3", "h-3", "rounded-full", "bg-blue-500"], ["name", "trending-up", 1, "text-green-500", 3, "size"], [1, "h-64"], ["name", "trophy", 1, "text-yellow-500", 3, "size"], [1, "space-y-3", "max-h-72", "overflow-y-auto"], [1, "flex", "items-center", "gap-3", "p-3", "rounded-lg", "bg-gray-50", "dark:bg-slate-700/50"], [1, "text-center", "py-8", "text-gray-500", "dark:text-gray-400"], ["name", "landmark", 1, "text-blue-500", 3, "size"], [1, "w-8", "h-8", "rounded-full", "flex", "items-center", "justify-center", "text-sm", "font-bold"], [1, "flex-1", "min-w-0"], [1, "text-sm", "font-medium", "text-gray-800", "dark:text-white", "truncate"], [1, "text-xs", "text-gray-500", "dark:text-gray-400"], [1, "text-right"], [1, "text-sm", "font-bold", "text-green-600", "dark:text-green-400"], ["name", "users", 1, "mx-auto", "mb-2", "opacity-50", 3, "size"]], template: function PaymentsDashboardComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "h1", 2)(3, "div", 3);
    \u0275\u0275element(4, "lucide-angular", 4);
    \u0275\u0275elementEnd();
    \u0275\u0275text(5, " Dashboard de Pagos y Conciliaci\xF3n ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p", 5);
    \u0275\u0275text(7, "M\xE9tricas consolidadas de pagos bancarios, agentes y promesas");
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(8, PaymentsDashboardComponent_Conditional_8_Template, 2, 0, "div", 6)(9, PaymentsDashboardComponent_Conditional_9_Template, 2, 1, "div", 7)(10, PaymentsDashboardComponent_Conditional_10_Template, 152, 50);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance(4);
    \u0275\u0275property("size", 24);
    \u0275\u0275advance(4);
    \u0275\u0275conditional(ctx.loading() ? 8 : ctx.error() ? 9 : 10);
  }
}, dependencies: [CommonModule, LucideAngularModule, LucideAngularComponent, BaseChartDirective, DecimalPipe], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n}\n/*# sourceMappingURL=payments-dashboard.component.css.map */"] });
var PaymentsDashboardComponent = _PaymentsDashboardComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PaymentsDashboardComponent, [{
    type: Component,
    args: [{ selector: "app-payments-dashboard", standalone: true, imports: [CommonModule, LucideAngularModule, BaseChartDirective], template: `
    <div class="min-h-screen bg-gray-50 dark:bg-slate-900 p-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
          <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <lucide-angular name="bar-chart-3" [size]="24" class="text-white"></lucide-angular>
          </div>
          Dashboard de Pagos y Conciliaci\xF3n
        </h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1">M\xE9tricas consolidadas de pagos bancarios, agentes y promesas</p>
      </div>

      @if (loading()) {
        <div class="flex items-center justify-center h-64">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      } @else if (error()) {
        <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-300">
          {{ error() }}
        </div>
      } @else {
        <!-- KPI Cards Row 1 - Resumen General -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <!-- Total Pagos Banco -->
          <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-5">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Pagos Banco</p>
                <p class="text-2xl font-bold text-gray-800 dark:text-white">{{ dashboard()?.totalPagosBanco | number }}</p>
                <p class="text-sm text-blue-600 dark:text-blue-400 font-medium">{{ formatCurrency(dashboard()?.montoTotalBanco) }}</p>
              </div>
              <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <lucide-angular name="building-2" [size]="24" class="text-blue-600 dark:text-blue-400"></lucide-angular>
              </div>
            </div>
          </div>

          <!-- Pagos Conciliados -->
          <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-5">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Conciliados</p>
                <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ dashboard()?.pagosConciliados | number }}</p>
                <p class="text-sm text-green-600 dark:text-green-400 font-medium">{{ formatCurrency(dashboard()?.montoConciliado) }}</p>
              </div>
              <div class="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <lucide-angular name="check-circle" [size]="24" class="text-green-600 dark:text-green-400"></lucide-angular>
              </div>
            </div>
          </div>

          <!-- Pagos Por Fuera (Voluntarios) -->
          <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-5">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Pagos Voluntarios</p>
                <p class="text-2xl font-bold text-amber-600 dark:text-amber-400">{{ dashboard()?.pagosPorFuera | number }}</p>
                <p class="text-sm text-amber-600 dark:text-amber-400 font-medium">{{ formatCurrency(dashboard()?.montoPorFuera) }}</p>
              </div>
              <div class="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                <lucide-angular name="user-check" [size]="24" class="text-amber-600 dark:text-amber-400"></lucide-angular>
              </div>
            </div>
          </div>

          <!-- Pagos No Verificados -->
          <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-5">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Sin Verificar</p>
                <p class="text-2xl font-bold text-red-600 dark:text-red-400">{{ dashboard()?.pagosNoVerificados | number }}</p>
                <p class="text-sm text-red-600 dark:text-red-400 font-medium">{{ formatCurrency(dashboard()?.montoNoVerificado) }}</p>
              </div>
              <div class="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <lucide-angular name="alert-triangle" [size]="24" class="text-red-600 dark:text-red-400"></lucide-angular>
              </div>
            </div>
          </div>
        </div>

        <!-- KPI Cards Row 2 - Promesas -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <!-- Total Promesas -->
          <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-5">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Total Promesas</p>
                <p class="text-2xl font-bold text-gray-800 dark:text-white">{{ dashboard()?.totalPromesas | number }}</p>
                <p class="text-sm text-indigo-600 dark:text-indigo-400 font-medium">{{ formatCurrency(dashboard()?.montoPrometido) }}</p>
              </div>
              <div class="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                <lucide-angular name="handshake" [size]="24" class="text-indigo-600 dark:text-indigo-400"></lucide-angular>
              </div>
            </div>
          </div>

          <!-- Promesas Cumplidas -->
          <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-5">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Cumplidas</p>
                <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ dashboard()?.promesasCumplidas | number }}</p>
              </div>
              <div class="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <lucide-angular name="badge-check" [size]="24" class="text-green-600 dark:text-green-400"></lucide-angular>
              </div>
            </div>
          </div>

          <!-- Promesas Vencidas -->
          <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-5">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Vencidas</p>
                <p class="text-2xl font-bold text-red-600 dark:text-red-400">{{ dashboard()?.promesasVencidas | number }}</p>
              </div>
              <div class="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <lucide-angular name="clock" [size]="24" class="text-red-600 dark:text-red-400"></lucide-angular>
              </div>
            </div>
          </div>

          <!-- Tasa de Cumplimiento -->
          <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-5">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Tasa Cumplimiento</p>
                <p class="text-2xl font-bold" [class]="getTasaClass(dashboard()?.tasaCumplimiento || 0)">
                  {{ dashboard()?.tasaCumplimiento | number:'1.1-1' }}%
                </p>
              </div>
              <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                <lucide-angular name="trending-up" [size]="24" class="text-purple-600 dark:text-purple-400"></lucide-angular>
              </div>
            </div>
          </div>
        </div>

        <!-- Charts Row -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <!-- Gr\xE1fico Dona - Estado de Conciliaci\xF3n -->
          <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-5">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <lucide-angular name="pie-chart" [size]="20" class="text-blue-500"></lucide-angular>
              Estado de Conciliaci\xF3n
            </h3>
            <div class="h-64 flex items-center justify-center">
              @if (showCharts()) {
                <canvas baseChart
                  [type]="'doughnut'"
                  [data]="conciliacionChartData"
                  [options]="doughnutChartOptions()">
                </canvas>
              }
            </div>
            <!-- Leyenda personalizada -->
            <div class="mt-4 flex flex-wrap justify-center gap-4">
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full bg-green-500"></div>
                <span class="text-sm text-gray-600 dark:text-gray-400">Conciliados</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full bg-amber-500"></div>
                <span class="text-sm text-gray-600 dark:text-gray-400">Voluntarios</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full bg-red-500"></div>
                <span class="text-sm text-gray-600 dark:text-gray-400">Sin Verificar</span>
              </div>
            </div>
          </div>

          <!-- Gr\xE1fico Dona - Estado de Promesas -->
          <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-5">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <lucide-angular name="target" [size]="20" class="text-indigo-500"></lucide-angular>
              Estado de Promesas
            </h3>
            <div class="h-64 flex items-center justify-center">
              @if (showCharts()) {
                <canvas baseChart
                  [type]="'doughnut'"
                  [data]="promesasChartData"
                  [options]="doughnutChartOptions()">
                </canvas>
              }
            </div>
            <!-- Leyenda personalizada -->
            <div class="mt-4 flex flex-wrap justify-center gap-4">
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full bg-green-500"></div>
                <span class="text-sm text-gray-600 dark:text-gray-400">Cumplidas</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full bg-blue-500"></div>
                <span class="text-sm text-gray-600 dark:text-gray-400">Pendientes</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full bg-red-500"></div>
                <span class="text-sm text-gray-600 dark:text-gray-400">Vencidas</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Tendencia y Top Agentes Row -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <!-- Gr\xE1fico L\xEDnea - Tendencia Diaria -->
          <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-5">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <lucide-angular name="trending-up" [size]="20" class="text-green-500"></lucide-angular>
              Tendencia de Pagos (\xDAltimos 30 d\xEDas)
            </h3>
            <div class="h-64">
              @if (showCharts()) {
                <canvas baseChart
                  [type]="'line'"
                  [data]="tendenciaChartData"
                  [options]="lineChartOptions()">
                </canvas>
              }
            </div>
          </div>

          <!-- Top Agentes -->
          <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-5">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <lucide-angular name="trophy" [size]="20" class="text-yellow-500"></lucide-angular>
              Top Agentes por Monto
            </h3>
            <div class="space-y-3 max-h-72 overflow-y-auto">
              @for (agente of dashboard()?.topAgentes; track agente.agenteId; let i = $index) {
                <div class="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-slate-700/50">
                  <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                       [class]="i === 0 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400' :
                                i === 1 ? 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300' :
                                i === 2 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400' :
                                'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400'">
                    {{ i + 1 }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-800 dark:text-white truncate">{{ agente.nombreAgente }}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      {{ agente.promesasRegistradas }} promesas \xB7 {{ agente.tasaCumplimiento | number:'1.0-0' }}% cumplimiento
                    </p>
                  </div>
                  <div class="text-right">
                    <p class="text-sm font-bold text-green-600 dark:text-green-400">{{ formatCurrency(agente.montoTotal) }}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">{{ agente.cantidadPagos }} pagos</p>
                  </div>
                </div>
              } @empty {
                <div class="text-center py-8 text-gray-500 dark:text-gray-400">
                  <lucide-angular name="users" [size]="32" class="mx-auto mb-2 opacity-50"></lucide-angular>
                  <p>No hay datos de agentes</p>
                </div>
              }
            </div>
          </div>
        </div>

        <!-- Distribuci\xF3n por Banco -->
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-5">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <lucide-angular name="landmark" [size]="20" class="text-blue-500"></lucide-angular>
            Distribuci\xF3n por Banco
          </h3>
          <div class="h-64">
            @if (showCharts()) {
              <canvas baseChart
                [type]="'bar'"
                [data]="bancosChartData"
                [options]="barChartOptions()">
              </canvas>
            }
          </div>
        </div>
      }
    </div>
  `, styles: ["/* angular:styles/component:css;219558ef63f119a92210704329b58a3cdceaa4fb296db559e672f74512827dc7;C:/Users/HP/Documents/Kubito-2.0-v1/cashi-discador-frontend/cashi-discador-frontend/src/app/pagos-bancarios/pages/payments-dashboard/payments-dashboard.component.ts */\n:host {\n  display: block;\n}\n/*# sourceMappingURL=payments-dashboard.component.css.map */\n"] }]
  }], () => [{ type: PaymentsDashboardService }, { type: ThemeService }, { type: ChangeDetectorRef }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PaymentsDashboardComponent, { className: "PaymentsDashboardComponent", filePath: "src/app/pagos-bancarios/pages/payments-dashboard/payments-dashboard.component.ts", lineNumber: 312 });
})();
export {
  PaymentsDashboardComponent
};
//# sourceMappingURL=chunk-E7CJJNIM.js.map
