import {
  ArcElement,
  BaseChartDirective,
  Chart,
  DoughnutController,
  plugin_legend,
  plugin_tooltip
} from "./chunk-YWZCMPVI.js";
import {
  CampaignAdminService
} from "./chunk-Q2KKDN5X.js";
import {
  ActivatedRoute,
  Router
} from "./chunk-OCZLH7K5.js";
import "./chunk-ZQICQP3Y.js";
import {
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgModel,
  NgSelectOption,
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
  DecimalPipe,
  NgClass,
  NgForOf,
  NgIf,
  ViewEncapsulation,
  interval,
  setClassMetadata,
  switchMap,
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
  ɵɵpipeBind1,
  ɵɵpipeBind2,
  ɵɵproperty,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate3,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-CTRHJBBW.js";

// src/app/features/admin/campaign-detail/campaign-detail.component.ts
function CampaignDetailComponent_div_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 13);
    \u0275\u0275element(1, "lucide-angular", 14);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("size", 18);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.error);
  }
}
function CampaignDetailComponent_div_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 15);
    \u0275\u0275element(1, "div", 16);
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3, "Cargando...");
    \u0275\u0275elementEnd()();
  }
}
function CampaignDetailComponent_div_16_lucide_angular_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "lucide-angular", 30);
  }
  if (rf & 2) {
    \u0275\u0275property("size", 18);
  }
}
function CampaignDetailComponent_div_16_lucide_angular_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "lucide-angular", 60);
  }
  if (rf & 2) {
    \u0275\u0275property("size", 18);
  }
}
function CampaignDetailComponent_div_16_p_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 61);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.statistics.descripcion, " ");
  }
}
function CampaignDetailComponent_div_16_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 17)(1, "div", 18)(2, "div", 19)(3, "h2");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 20);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "button", 21);
    \u0275\u0275listener("click", function CampaignDetailComponent_div_16_Template_button_click_7_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.toggleChart());
    });
    \u0275\u0275template(8, CampaignDetailComponent_div_16_lucide_angular_8_Template, 1, 1, "lucide-angular", 22)(9, CampaignDetailComponent_div_16_lucide_angular_9_Template, 1, 1, "lucide-angular", 23);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(11, CampaignDetailComponent_div_16_p_11_Template, 2, 1, "p", 24);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "div", 25)(13, "div", 26)(14, "div", 27)(15, "div", 28)(16, "span", 29);
    \u0275\u0275element(17, "lucide-angular", 30);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "div", 31)(19, "span", 32);
    \u0275\u0275text(20, "Estado Actual");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "span", 33);
    \u0275\u0275text(22);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(23, "div", 28)(24, "span", 29);
    \u0275\u0275element(25, "lucide-angular", 34);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "div", 31)(27, "span", 32);
    \u0275\u0275text(28, "Fecha Inicio");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "span", 33);
    \u0275\u0275text(30);
    \u0275\u0275pipe(31, "date");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(32, "div", 28)(33, "span", 29);
    \u0275\u0275element(34, "lucide-angular", 35);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(35, "div", 31)(36, "span", 32);
    \u0275\u0275text(37, "Fecha Final");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(38, "span", 33);
    \u0275\u0275text(39);
    \u0275\u0275pipe(40, "date");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(41, "div", 28)(42, "span", 29);
    \u0275\u0275element(43, "lucide-angular", 36);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(44, "div", 31)(45, "span", 32);
    \u0275\u0275text(46, "Total de Registros");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(47, "span", 33);
    \u0275\u0275text(48);
    \u0275\u0275pipe(49, "number");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(50, "div", 28)(51, "span", 29);
    \u0275\u0275element(52, "lucide-angular", 37);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(53, "div", 31)(54, "span", 32);
    \u0275\u0275text(55, "Falta Reintentar");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(56, "span", 33);
    \u0275\u0275text(57);
    \u0275\u0275pipe(58, "number");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(59, "div", 28)(60, "span", 29);
    \u0275\u0275element(61, "lucide-angular", 38);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(62, "div", 31)(63, "span", 32);
    \u0275\u0275text(64, "Reintentos Completados");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(65, "span", 33);
    \u0275\u0275text(66);
    \u0275\u0275pipe(67, "number");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(68, "div", 28)(69, "span", 29);
    \u0275\u0275element(70, "lucide-angular", 39);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(71, "div", 31)(72, "span", 32);
    \u0275\u0275text(73, "Falta Llamar");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(74, "span", 33);
    \u0275\u0275text(75);
    \u0275\u0275pipe(76, "number");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(77, "div", 28)(78, "span", 29);
    \u0275\u0275element(79, "lucide-angular", 40);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(80, "div", 31)(81, "span", 32);
    \u0275\u0275text(82, "Duraci\xF3n Promedio Llamada");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(83, "span", 33);
    \u0275\u0275text(84);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(85, "div", 28)(86, "span", 29);
    \u0275\u0275element(87, "lucide-angular", 41);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(88, "div", 31)(89, "span", 32);
    \u0275\u0275text(90, "Duraci\xF3n M\xE1xima Llamada");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(91, "span", 33);
    \u0275\u0275text(92);
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275elementStart(93, "div", 42)(94, "div", 43)(95, "div", 44)(96, "h3");
    \u0275\u0275text(97, "Distribuci\xF3n de Llamadas");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(98, "div", 45);
    \u0275\u0275element(99, "canvas", 46);
    \u0275\u0275elementStart(100, "div", 47)(101, "div", 48);
    \u0275\u0275text(102);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(103, "div", 49);
    \u0275\u0275text(104, "Total");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(105, "div", 50)(106, "h3");
    \u0275\u0275text(107, "Estado Llamadas");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(108, "table", 51)(109, "thead")(110, "tr")(111, "th");
    \u0275\u0275text(112, "Estado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(113, "th");
    \u0275\u0275text(114, "Cantidad");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(115, "th");
    \u0275\u0275text(116, "Porcentaje");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(117, "tbody")(118, "tr", 52)(119, "td");
    \u0275\u0275element(120, "span", 53);
    \u0275\u0275text(121, " Contestadas");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(122, "td");
    \u0275\u0275text(123);
    \u0275\u0275pipe(124, "number");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(125, "td");
    \u0275\u0275text(126);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(127, "tr", 52)(128, "td");
    \u0275\u0275element(129, "span", 54);
    \u0275\u0275text(130, " Cortas");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(131, "td");
    \u0275\u0275text(132);
    \u0275\u0275pipe(133, "number");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(134, "td");
    \u0275\u0275text(135);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(136, "tr", 52)(137, "td");
    \u0275\u0275element(138, "span", 55);
    \u0275\u0275text(139, " Abandonadas");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(140, "td");
    \u0275\u0275text(141);
    \u0275\u0275pipe(142, "number");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(143, "td");
    \u0275\u0275text(144);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(145, "tr", 52)(146, "td");
    \u0275\u0275element(147, "span", 56);
    \u0275\u0275text(148, " No Responden");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(149, "td");
    \u0275\u0275text(150);
    \u0275\u0275pipe(151, "number");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(152, "td");
    \u0275\u0275text(153);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(154, "tr", 52)(155, "td");
    \u0275\u0275element(156, "span", 57);
    \u0275\u0275text(157, " Buz\xF3n de Voz");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(158, "td");
    \u0275\u0275text(159);
    \u0275\u0275pipe(160, "number");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(161, "td");
    \u0275\u0275text(162);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(163, "tr", 52)(164, "td");
    \u0275\u0275element(165, "span", 58);
    \u0275\u0275text(166, " Fallidas");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(167, "td");
    \u0275\u0275text(168);
    \u0275\u0275pipe(169, "number");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(170, "td");
    \u0275\u0275text(171);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(172, "tr", 52)(173, "td");
    \u0275\u0275element(174, "span", 59);
    \u0275\u0275text(175, " Pausadas");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(176, "td");
    \u0275\u0275text(177);
    \u0275\u0275pipe(178, "number");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(179, "td");
    \u0275\u0275text(180);
    \u0275\u0275elementEnd()()()()()()()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r0.statistics.nombre);
    \u0275\u0275advance();
    \u0275\u0275styleProp("background-color", ctx_r0.getEstadoCampanaColor(ctx_r0.statistics.estadoActual));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.getEstadoCampanaTexto(ctx_r0.statistics.estadoActual), " ");
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", ctx_r0.showChart);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r0.showChart);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.showChart ? "Ver M\xE9tricas" : "Ver Gr\xE1fico", " ");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.statistics.descripcion);
    \u0275\u0275advance();
    \u0275\u0275classProp("flipped", ctx_r0.showChart);
    \u0275\u0275advance(5);
    \u0275\u0275property("size", 24);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r0.getEstadoCampanaTexto(ctx_r0.statistics.estadoActual));
    \u0275\u0275advance(3);
    \u0275\u0275property("size", 24);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1(" ", ctx_r0.statistics.fechaInicio ? \u0275\u0275pipeBind2(31, 53, ctx_r0.statistics.fechaInicio, "dd-MM-yyyy") : "-", " ");
    \u0275\u0275advance(4);
    \u0275\u0275property("size", 24);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1(" ", ctx_r0.statistics.fechaFinal ? \u0275\u0275pipeBind2(40, 56, ctx_r0.statistics.fechaFinal, "dd-MM-yyyy") : "-", " ");
    \u0275\u0275advance(4);
    \u0275\u0275property("size", 24);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(49, 59, ctx_r0.statistics.totalRegistros));
    \u0275\u0275advance(4);
    \u0275\u0275property("size", 24);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(58, 61, ctx_r0.statistics.faltaReintentar));
    \u0275\u0275advance(4);
    \u0275\u0275property("size", 24);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(67, 63, ctx_r0.statistics.reintentosCompletados));
    \u0275\u0275advance(4);
    \u0275\u0275property("size", 24);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(76, 65, ctx_r0.statistics.faltaLlamar));
    \u0275\u0275advance(4);
    \u0275\u0275property("size", 24);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r0.statistics.duracionPromedioLlamada);
    \u0275\u0275advance(3);
    \u0275\u0275property("size", 24);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r0.statistics.duracionMaximaLlamada);
    \u0275\u0275advance(7);
    \u0275\u0275property("data", ctx_r0.doughnutChartData)("type", ctx_r0.doughnutChartType)("options", ctx_r0.doughnutChartOptions);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.statistics.totalLlamadas);
    \u0275\u0275advance(16);
    \u0275\u0275property("ngClass", ctx_r0.getRowClass(ctx_r0.getPercentage(ctx_r0.statistics.llamadasContestadas, ctx_r0.statistics.totalLlamadas)));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(124, 67, ctx_r0.statistics.llamadasContestadas));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.getPercentage(ctx_r0.statistics.llamadasContestadas, ctx_r0.statistics.totalLlamadas));
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", ctx_r0.getRowClass(ctx_r0.getPercentage(ctx_r0.statistics.llamadasCortas, ctx_r0.statistics.totalLlamadas)));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(133, 69, ctx_r0.statistics.llamadasCortas));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.getPercentage(ctx_r0.statistics.llamadasCortas, ctx_r0.statistics.totalLlamadas));
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", ctx_r0.getRowClass(ctx_r0.getPercentage(ctx_r0.statistics.llamadasAbandonadas, ctx_r0.statistics.totalLlamadas)));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(142, 71, ctx_r0.statistics.llamadasAbandonadas));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.getPercentage(ctx_r0.statistics.llamadasAbandonadas, ctx_r0.statistics.totalLlamadas));
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", ctx_r0.getRowClass(ctx_r0.getPercentage(ctx_r0.statistics.llamadasNoContestadas, ctx_r0.statistics.totalLlamadas)));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(151, 73, ctx_r0.statistics.llamadasNoContestadas));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.getPercentage(ctx_r0.statistics.llamadasNoContestadas, ctx_r0.statistics.totalLlamadas));
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", ctx_r0.getRowClass(ctx_r0.getPercentage(ctx_r0.statistics.llamadasBuzonVoz, ctx_r0.statistics.totalLlamadas)));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(160, 75, ctx_r0.statistics.llamadasBuzonVoz));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.getPercentage(ctx_r0.statistics.llamadasBuzonVoz, ctx_r0.statistics.totalLlamadas));
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", ctx_r0.getRowClass(ctx_r0.getPercentage(ctx_r0.statistics.llamadasFallidas, ctx_r0.statistics.totalLlamadas)));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(169, 77, ctx_r0.statistics.llamadasFallidas));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.getPercentage(ctx_r0.statistics.llamadasFallidas, ctx_r0.statistics.totalLlamadas));
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", ctx_r0.getRowClass(ctx_r0.getPercentage(ctx_r0.statistics.llamadasPausadas, ctx_r0.statistics.totalLlamadas)));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(178, 79, ctx_r0.statistics.llamadasPausadas));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.getPercentage(ctx_r0.statistics.llamadasPausadas, ctx_r0.statistics.totalLlamadas));
  }
}
function CampaignDetailComponent_div_17_option_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 77);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const option_r4 = ctx.$implicit;
    \u0275\u0275property("value", option_r4);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(option_r4);
  }
}
function CampaignDetailComponent_div_17_tr_38_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td");
    \u0275\u0275text(2);
    \u0275\u0275pipe(3, "date");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "td");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "td");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "td")(9, "span", 78);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "td");
    \u0275\u0275text(12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "td");
    \u0275\u0275text(14);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "td", 79);
    \u0275\u0275text(16);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const call_r5 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(3, 8, call_r5.fecha, "dd/MM/yyyy HH:mm"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(call_r5.telefono);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(call_r5.dato);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngClass", ctx_r0.getEstadoClass(call_r5.estado));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.getEstadoTexto(call_r5.estado), " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(call_r5.causa || "-");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(call_r5.duracion);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(call_r5.intentos);
  }
}
function CampaignDetailComponent_div_17_tr_39_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 80);
    \u0275\u0275element(2, "lucide-angular", 81);
    \u0275\u0275text(3, " No hay llamadas registradas para esta campa\xF1a ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 20);
  }
}
function CampaignDetailComponent_div_17_div_40_button_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 88);
    \u0275\u0275listener("click", function CampaignDetailComponent_div_17_div_40_button_7_Template_button_click_0_listener() {
      const page_r8 = \u0275\u0275restoreView(_r7).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.onPageChange(page_r8));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const page_r8 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275classProp("active", page_r8 === ctx_r0.currentPage);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", page_r8 + 1, " ");
  }
}
function CampaignDetailComponent_div_17_div_40_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 82)(1, "div", 83);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 84)(4, "button", 85);
    \u0275\u0275listener("click", function CampaignDetailComponent_div_17_div_40_Template_button_click_4_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.onPageChange(ctx_r0.currentPage - 1));
    });
    \u0275\u0275element(5, "lucide-angular", 8);
    \u0275\u0275text(6, " Anterior ");
    \u0275\u0275elementEnd();
    \u0275\u0275template(7, CampaignDetailComponent_div_17_div_40_button_7_Template, 2, 3, "button", 86);
    \u0275\u0275elementStart(8, "button", 85);
    \u0275\u0275listener("click", function CampaignDetailComponent_div_17_div_40_Template_button_click_8_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.onPageChange(ctx_r0.currentPage + 1));
    });
    \u0275\u0275text(9, " Siguiente ");
    \u0275\u0275element(10, "lucide-angular", 87);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate3(" Mostrando ", ctx_r0.currentPage * ctx_r0.pageSize + 1, " a ", ctx_r0.Math.min((ctx_r0.currentPage + 1) * ctx_r0.pageSize, ctx_r0.totalElements), " de ", ctx_r0.totalElements, " registros ");
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r0.currentPage === 0);
    \u0275\u0275advance();
    \u0275\u0275property("size", 16);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngForOf", ctx_r0.getPageNumbers());
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r0.currentPage === ctx_r0.totalPages - 1);
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 16);
  }
}
function CampaignDetailComponent_div_17_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 62)(1, "div", 63)(2, "h3");
    \u0275\u0275element(3, "lucide-angular", 39);
    \u0275\u0275text(4, " Registro de Llamadas");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 64)(6, "div", 65)(7, "label");
    \u0275\u0275text(8, "Mostrar");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "select", 66);
    \u0275\u0275listener("change", function CampaignDetailComponent_div_17_Template_select_change_9_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.onPageSizeChange($event));
    });
    \u0275\u0275template(10, CampaignDetailComponent_div_17_option_10_Template, 2, 2, "option", 67);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "label");
    \u0275\u0275text(12, "registros");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "div", 68)(14, "label");
    \u0275\u0275text(15, "B\xFAsqueda:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "input", 69);
    \u0275\u0275twoWayListener("ngModelChange", function CampaignDetailComponent_div_17_Template_input_ngModelChange_16_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.searchTerm, $event) || (ctx_r0.searchTerm = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("keyup.enter", function CampaignDetailComponent_div_17_Template_input_keyup_enter_16_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.onSearch());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "button", 70);
    \u0275\u0275listener("click", function CampaignDetailComponent_div_17_Template_button_click_17_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.onSearch());
    });
    \u0275\u0275element(18, "lucide-angular", 71);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(19, "div", 72)(20, "table", 73)(21, "thead")(22, "tr")(23, "th");
    \u0275\u0275text(24, "Fecha");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "th");
    \u0275\u0275text(26, "Tel\xE9fono");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "th");
    \u0275\u0275text(28, "Dato");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "th");
    \u0275\u0275text(30, "Estado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "th");
    \u0275\u0275text(32, "Causa");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "th");
    \u0275\u0275text(34, "Duraci\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(35, "th");
    \u0275\u0275text(36, "Int.");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(37, "tbody");
    \u0275\u0275template(38, CampaignDetailComponent_div_17_tr_38_Template, 17, 11, "tr", 74)(39, CampaignDetailComponent_div_17_tr_39_Template, 4, 1, "tr", 75);
    \u0275\u0275elementEnd()()();
    \u0275\u0275template(40, CampaignDetailComponent_div_17_div_40_Template, 11, 8, "div", 76);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275property("size", 20);
    \u0275\u0275advance(6);
    \u0275\u0275property("value", ctx_r0.pageSize);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r0.pageSizeOptions);
    \u0275\u0275advance(6);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.searchTerm);
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 16);
    \u0275\u0275advance(20);
    \u0275\u0275property("ngForOf", ctx_r0.calls);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.calls.length === 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.totalPages > 0);
  }
}
Chart.register(DoughnutController, ArcElement, plugin_tooltip, plugin_legend);
var _CampaignDetailComponent = class _CampaignDetailComponent {
  constructor(route, router, campaignService) {
    this.route = route;
    this.router = router;
    this.campaignService = campaignService;
    this.campaignId = null;
    this.statistics = null;
    this.calls = [];
    this.loading = false;
    this.error = null;
    this.currentPage = 0;
    this.pageSize = 10;
    this.totalElements = 0;
    this.totalPages = 0;
    this.pageSizeOptions = [10, 25, 50, 100];
    this.searchTerm = "";
    this.Math = Math;
    this.showChart = false;
    this.doughnutChartType = "doughnut";
    this.doughnutChartData = {
      labels: [],
      datasets: []
    };
    this.doughnutChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const label = context.label || "";
              const value = context.parsed || 0;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = total > 0 ? (value / total * 100).toFixed(1) : "0";
              return `${label}: ${value} (${percentage}%)`;
            }
          }
        }
      }
    };
  }
  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.campaignId = +params["id"];
      if (this.campaignId) {
        this.loadCampaignData();
        this.startPolling();
      }
    });
  }
  ngOnDestroy() {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }
  /**
   * Carga los datos de la campaña (estadísticas y llamadas)
   */
  loadCampaignData() {
    if (!this.campaignId)
      return;
    this.loading = true;
    this.error = null;
    this.campaignService.getCampaignStatistics(this.campaignId).subscribe({
      next: (stats) => {
        this.statistics = stats;
        this.updateChartData(stats);
      },
      error: (err) => {
        console.error("Error loading campaign statistics:", err);
        this.error = "Error al cargar las estad\xEDsticas de la campa\xF1a";
      }
    });
    this.loadCalls();
  }
  /**
   * Carga las llamadas con paginación y búsqueda
   */
  loadCalls() {
    if (!this.campaignId)
      return;
    this.campaignService.getCampaignCalls(this.campaignId, this.currentPage, this.pageSize, this.searchTerm).subscribe({
      next: (response) => {
        this.calls = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.currentPage = response.currentPage;
        this.loading = false;
      },
      error: (err) => {
        console.error("Error loading campaign calls:", err);
        this.error = "Error al cargar las llamadas";
        this.loading = false;
      }
    });
  }
  /**
   * Inicia polling para actualizar estadísticas cada 10 segundos
   */
  startPolling() {
    this.pollingSubscription = interval(1e4).pipe(switchMap(() => {
      if (!this.campaignId)
        return [];
      return this.campaignService.getCampaignStatistics(this.campaignId);
    })).subscribe({
      next: (stats) => {
        this.statistics = stats;
      },
      error: (err) => {
        console.error("Error polling statistics:", err);
      }
    });
  }
  /**
   * Maneja el cambio de página
   */
  onPageChange(page) {
    this.currentPage = page;
    this.loadCalls();
  }
  /**
   * Maneja el cambio de tamaño de página
   */
  onPageSizeChange(event) {
    const target = event.target;
    this.pageSize = +target.value;
    this.currentPage = 0;
    this.loadCalls();
  }
  /**
   * Maneja la búsqueda
   */
  onSearch() {
    this.currentPage = 0;
    this.loadCalls();
  }
  /**
   * Vuelve a la lista de campañas
   */
  goBack() {
    this.router.navigate(["/admin/campaigns"]);
  }
  /**
   * Genera el array de números de página para la paginación
   */
  getPageNumbers() {
    const pages = [];
    for (let i = 0; i < this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }
  /**
   * Formatea el estado del contacto a texto legible
   */
  getEstadoTexto(estado) {
    const estados = {
      "INICIADA": "Iniciada",
      "MARCANDO": "Marcando",
      "CONECTADA": "Conectada",
      "EN_CURSO": "En Curso",
      "NO_CONTESTADA": "No Contestada",
      "ABANDONADA": "Abandonada",
      "FINALIZADA": "Finalizada",
      "FALLIDA": "Fallida"
    };
    return estados[estado] || estado;
  }
  /**
   * Obtiene la clase CSS según el estado
   */
  getEstadoClass(estado) {
    const classes = {
      "CONECTADA": "estado-exitoso",
      "FINALIZADA": "estado-exitoso",
      "EN_CURSO": "estado-en-proceso",
      "MARCANDO": "estado-en-proceso",
      "NO_CONTESTADA": "estado-warning",
      "ABANDONADA": "estado-error",
      "FALLIDA": "estado-error"
    };
    return classes[estado] || "estado-default";
  }
  /**
   * Formatea el estado de la campaña
   */
  getEstadoCampanaTexto(estado) {
    const estados = {
      "DRAFT": "Borrador",
      "ACTIVE": "Activa",
      "PAUSED": "Pausada",
      "COMPLETED": "Terminada"
    };
    return estados[estado] || estado;
  }
  /**
   * Obtiene el color según el estado de la campaña
   */
  getEstadoCampanaColor(estado) {
    const colores = {
      "DRAFT": "#6B7280",
      "ACTIVE": "#10B981",
      "PAUSED": "#F59E0B",
      "COMPLETED": "#3B82F6"
    };
    return colores[estado] || "#6B7280";
  }
  /**
   * Toggle para mostrar/ocultar el gráfico
   */
  toggleChart() {
    this.showChart = !this.showChart;
  }
  /**
   * Actualiza los datos del gráfico de dona
   */
  updateChartData(stats) {
    const total = stats.totalLlamadas;
    this.doughnutChartData = {
      labels: ["Contestadas", "Cortas", "Abandonadas", "No Responden", "Buz\xF3n de Voz", "Fallidas", "Pausadas"],
      datasets: [{
        data: [
          stats.llamadasContestadas || 0,
          stats.llamadasCortas || 0,
          stats.llamadasAbandonadas || 0,
          stats.llamadasNoContestadas || 0,
          stats.llamadasBuzonVoz || 0,
          stats.llamadasFallidas || 0,
          stats.llamadasPausadas || 0
        ],
        backgroundColor: [
          "#10B981",
          // Verde - Contestadas
          "#F59E0B",
          // Amarillo - Cortas
          "#EF4444",
          // Rojo - Abandonadas
          "#F97316",
          // Naranja - No Responden
          "#3B82F6",
          // Azul - Buzón de Voz
          "#6B7280",
          // Gris oscuro - Fallidas
          "#94A3B8"
          // Gris claro - Pausadas
        ],
        borderWidth: 2,
        borderColor: "#1e293b"
      }]
    };
  }
  /**
   * Obtiene el porcentaje de un estado
   */
  getPercentage(value, total) {
    if (total === 0)
      return "0%";
    return (value / total * 100).toFixed(0) + "%";
  }
  /**
   * Obtiene la clase CSS para la fila de la tabla según el porcentaje
   */
  getRowClass(percentage) {
    const percent = parseFloat(percentage);
    if (percent >= 50)
      return "high-percentage";
    if (percent >= 20)
      return "medium-percentage";
    return "low-percentage";
  }
};
_CampaignDetailComponent.\u0275fac = function CampaignDetailComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _CampaignDetailComponent)(\u0275\u0275directiveInject(ActivatedRoute), \u0275\u0275directiveInject(Router), \u0275\u0275directiveInject(CampaignAdminService));
};
_CampaignDetailComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _CampaignDetailComponent, selectors: [["app-campaign-detail"]], decls: 18, vars: 6, consts: [[1, "campaign-detail-container"], [1, "flex", "items-center", "gap-2", "mb-2"], [1, "w-8", "h-8", "bg-gradient-to-br", "from-purple-600", "to-purple-700", "rounded-lg", "flex", "items-center", "justify-center"], ["name", "clipboard-list", 1, "text-white", 3, "size"], [1, "text-lg", "font-bold", "text-white"], [1, "text-xs", "text-gray-400"], [1, "header"], [1, "btn-back", 3, "click"], ["name", "arrow-left", 3, "size"], ["class", "error-message", 4, "ngIf"], ["class", "loading-state", 4, "ngIf"], ["class", "statistics-section", 4, "ngIf"], ["class", "calls-section", 4, "ngIf"], [1, "error-message"], ["name", "x-circle", 3, "size"], [1, "loading-state"], [1, "spinner"], [1, "statistics-section"], [1, "campaign-header-card"], [1, "campaign-title-section"], [1, "status-badge"], ["title", "Ver gr\xE1fico de distribuci\xF3n", 1, "btn-toggle-chart", 3, "click"], ["name", "bar-chart-2", 3, "size", 4, "ngIf"], ["name", "trending-up", 3, "size", 4, "ngIf"], ["class", "campaign-description", 4, "ngIf"], [1, "flip-container"], [1, "flip-card-front"], [1, "metrics-grid"], [1, "metric-card"], [1, "metric-icon"], ["name", "bar-chart-2", 3, "size"], [1, "metric-content"], [1, "metric-label"], [1, "metric-value"], ["name", "calendar", 3, "size"], ["name", "flag", 3, "size"], ["name", "file-text", 3, "size"], ["name", "refresh-cw", 3, "size"], ["name", "check-circle", 3, "size"], ["name", "phone-call", 3, "size"], ["name", "clock", 3, "size"], ["name", "timer", 3, "size"], [1, "flip-card-back"], [1, "chart-stats-container"], [1, "chart-section"], [1, "chart-wrapper"], ["baseChart", "", 3, "data", "type", "options"], [1, "chart-center-text"], [1, "center-value"], [1, "center-label"], [1, "stats-table-section"], [1, "stats-table"], [3, "ngClass"], [1, "color-dot", 2, "background-color", "#10B981"], [1, "color-dot", 2, "background-color", "#F59E0B"], [1, "color-dot", 2, "background-color", "#EF4444"], [1, "color-dot", 2, "background-color", "#F97316"], [1, "color-dot", 2, "background-color", "#3B82F6"], [1, "color-dot", 2, "background-color", "#6B7280"], [1, "color-dot", 2, "background-color", "#94A3B8"], ["name", "trending-up", 3, "size"], [1, "campaign-description"], [1, "calls-section"], [1, "table-header"], [1, "table-controls"], [1, "page-size-control"], [3, "change", "value"], [3, "value", 4, "ngFor", "ngForOf"], [1, "search-control"], ["type", "text", "placeholder", "Buscar...", 1, "search-input", 3, "ngModelChange", "keyup.enter", "ngModel"], [1, "btn-search", 3, "click"], ["name", "search", 3, "size"], [1, "table-container"], [1, "calls-table"], [4, "ngFor", "ngForOf"], [4, "ngIf"], ["class", "pagination", 4, "ngIf"], [3, "value"], [1, "estado-badge", 3, "ngClass"], [1, "text-center"], ["colspan", "7", 1, "empty-row"], ["name", "inbox", 3, "size"], [1, "pagination"], [1, "pagination-info"], [1, "pagination-controls"], [1, "btn-page", 3, "click", "disabled"], ["class", "btn-page-number", 3, "active", "click", 4, "ngFor", "ngForOf"], ["name", "arrow-right", 3, "size"], [1, "btn-page-number", 3, "click"]], template: function CampaignDetailComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2);
    \u0275\u0275element(3, "lucide-angular", 3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div")(5, "h1", 4);
    \u0275\u0275text(6, "Detalle de Campa\xF1a");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p", 5);
    \u0275\u0275text(8, "Informaci\xF3n detallada y m\xE9tricas de la campa\xF1a");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(9, "div", 6)(10, "button", 7);
    \u0275\u0275listener("click", function CampaignDetailComponent_Template_button_click_10_listener() {
      return ctx.goBack();
    });
    \u0275\u0275element(11, "lucide-angular", 8);
    \u0275\u0275elementStart(12, "span");
    \u0275\u0275text(13, "Volver a Campa\xF1as");
    \u0275\u0275elementEnd()()();
    \u0275\u0275template(14, CampaignDetailComponent_div_14_Template, 3, 2, "div", 9)(15, CampaignDetailComponent_div_15_Template, 4, 0, "div", 10)(16, CampaignDetailComponent_div_16_Template, 181, 81, "div", 11)(17, CampaignDetailComponent_div_17_Template, 41, 8, "div", 12);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance(3);
    \u0275\u0275property("size", 16);
    \u0275\u0275advance(8);
    \u0275\u0275property("size", 18);
    \u0275\u0275advance(3);
    \u0275\u0275property("ngIf", ctx.error);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.loading && !ctx.statistics);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.statistics);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.statistics);
  }
}, dependencies: [CommonModule, NgClass, NgForOf, NgIf, FormsModule, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, NgControlStatus, NgModel, BaseChartDirective, LucideAngularModule, LucideAngularComponent, DecimalPipe, DatePipe], styles: ["/* src/app/features/admin/campaign-detail/campaign-detail.component.css */\n.campaign-detail-container {\n  padding: 20px !important;\n  max-width: 1400px;\n  margin: 0 auto;\n  background:\n    linear-gradient(\n      to bottom right,\n      #0f172a,\n      #1e293b,\n      #0f172a);\n  min-height: 100vh;\n  color: #e2e8f0;\n}\n.header {\n  display: flex;\n  align-items: center;\n  gap: 20px;\n  margin-bottom: 30px;\n}\n.header h1 {\n  margin: 0;\n  color: #f1f5f9;\n  font-size: 28px;\n  font-weight: 600;\n}\n.btn-back {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  padding: 10px 16px;\n  background: #1e293b;\n  color: #e2e8f0;\n  border: 1px solid #334155;\n  border-radius: 8px;\n  cursor: pointer;\n  font-size: 14px;\n  transition: all 0.3s;\n}\n.btn-back:hover {\n  background: #334155;\n  border-color: #475569;\n}\n.campaign-header-card {\n  background: #1e293b;\n  border: 1px solid #334155;\n  border-radius: 12px;\n  padding: 20px;\n  margin-bottom: 20px;\n}\n.campaign-title-section {\n  display: flex;\n  align-items: center;\n  gap: 15px;\n  margin-bottom: 10px;\n}\n.campaign-title-section h2 {\n  margin: 0;\n  color: #f1f5f9;\n  font-size: 24px;\n  font-weight: 600;\n}\n.btn-toggle-chart {\n  padding: 8px 16px;\n  background: #3B82F6;\n  color: white;\n  border: none;\n  border-radius: 8px;\n  cursor: pointer;\n  font-size: 13px;\n  font-weight: 500;\n  transition: all 0.3s;\n  margin-left: auto;\n}\n.btn-toggle-chart:hover {\n  background: #2563EB;\n  transform: translateY(-2px);\n}\n.status-badge {\n  padding: 6px 12px;\n  border-radius: 6px;\n  color: white;\n  font-size: 13px;\n  font-weight: 500;\n}\n.campaign-description {\n  margin: 0;\n  color: #94a3b8;\n  font-size: 14px;\n}\n.metric-card {\n  background: #1e293b;\n  border: 1px solid #334155;\n  border-radius: 12px;\n  padding: 16px;\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  transition: all 0.3s;\n}\n.metric-card:hover {\n  border-color: #475569;\n  transform: translateY(-2px);\n}\n.metric-icon {\n  font-size: 28px;\n}\n.metric-content {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n}\n.metric-label {\n  color: #94a3b8;\n  font-size: 12px;\n  font-weight: 500;\n}\n.metric-value {\n  color: #f1f5f9;\n  font-size: 20px;\n  font-weight: 600;\n}\n.calls-section {\n  background: #1e293b;\n  border: 1px solid #334155;\n  border-radius: 12px;\n  padding: 20px;\n}\n.table-header {\n  margin-bottom: 20px;\n}\n.table-header h3 {\n  margin: 0 0 15px 0;\n  color: #f1f5f9;\n  font-size: 20px;\n  font-weight: 600;\n}\n.table-controls {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 20px;\n  flex-wrap: wrap;\n}\n.page-size-control {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  color: #94a3b8;\n  font-size: 14px;\n}\n.page-size-control select {\n  padding: 6px 10px;\n  background: #0f172a;\n  color: #e2e8f0;\n  border: 1px solid #334155;\n  border-radius: 6px;\n  cursor: pointer;\n}\n.search-control {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n}\n.search-control label {\n  color: #94a3b8;\n  font-size: 14px;\n}\n.search-input {\n  padding: 8px 12px;\n  background: #0f172a;\n  color: #e2e8f0;\n  border: 1px solid #334155;\n  border-radius: 6px;\n  font-size: 14px;\n  width: 200px;\n}\n.search-input:focus {\n  outline: none;\n  border-color: #3B82F6;\n}\n.btn-search {\n  padding: 8px 12px;\n  background: #3B82F6;\n  color: white;\n  border: none;\n  border-radius: 6px;\n  cursor: pointer;\n  transition: all 0.3s;\n}\n.btn-search:hover {\n  background: #2563EB;\n}\n.table-container {\n  overflow-x: auto;\n  margin-bottom: 20px;\n}\n.calls-table {\n  width: 100%;\n  border-collapse: collapse;\n}\n.calls-table thead {\n  background: #0f172a;\n}\n.calls-table th {\n  padding: 12px;\n  text-align: left;\n  color: #94a3b8;\n  font-size: 13px;\n  font-weight: 600;\n  border-bottom: 2px solid #334155;\n}\n.calls-table tbody tr {\n  border-bottom: 1px solid #334155;\n  transition: all 0.3s;\n}\n.calls-table tbody tr:hover {\n  background: #0f172a;\n}\n.calls-table td {\n  padding: 12px;\n  color: #e2e8f0;\n  font-size: 14px;\n}\n.text-center {\n  text-align: center;\n}\n.empty-row {\n  text-align: center;\n  color: #94a3b8;\n  padding: 40px !important;\n  font-size: 16px;\n}\n.estado-badge {\n  padding: 4px 10px;\n  border-radius: 6px;\n  font-size: 12px;\n  font-weight: 500;\n  display: inline-block;\n}\n.estado-exitoso {\n  background: rgba(16, 185, 129, 0.2);\n  color: #10B981;\n  border: 1px solid #10B981;\n}\n.estado-en-proceso {\n  background: rgba(59, 130, 246, 0.2);\n  color: #3B82F6;\n  border: 1px solid #3B82F6;\n}\n.estado-warning {\n  background: rgba(245, 158, 11, 0.2);\n  color: #F59E0B;\n  border: 1px solid #F59E0B;\n}\n.estado-error {\n  background: rgba(239, 68, 68, 0.2);\n  color: #EF4444;\n  border: 1px solid #EF4444;\n}\n.estado-default {\n  background: rgba(107, 114, 128, 0.2);\n  color: #6B7280;\n  border: 1px solid #6B7280;\n}\n.pagination {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding-top: 20px;\n  border-top: 1px solid #334155;\n}\n.pagination-info {\n  color: #94a3b8;\n  font-size: 14px;\n}\n.pagination-controls {\n  display: flex;\n  gap: 8px;\n  align-items: center;\n}\n.btn-page,\n.btn-page-number {\n  padding: 8px 12px;\n  background: #0f172a;\n  color: #e2e8f0;\n  border: 1px solid #334155;\n  border-radius: 6px;\n  cursor: pointer;\n  font-size: 14px;\n  transition: all 0.3s;\n}\n.btn-page:hover:not(:disabled),\n.btn-page-number:hover {\n  background: #334155;\n  border-color: #475569;\n}\n.btn-page:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n.btn-page-number.active {\n  background: #3B82F6;\n  border-color: #3B82F6;\n  color: white;\n}\n.error-message {\n  background: rgba(239, 68, 68, 0.1);\n  border: 1px solid #EF4444;\n  color: #EF4444;\n  padding: 12px 16px;\n  border-radius: 8px;\n  margin-bottom: 20px;\n  font-size: 14px;\n}\n.loading-state {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  padding: 60px;\n  color: #94a3b8;\n}\n.spinner {\n  border: 4px solid #334155;\n  border-top: 4px solid #3B82F6;\n  border-radius: 50%;\n  width: 40px;\n  height: 40px;\n  animation: spin 1s linear infinite;\n  margin-bottom: 16px;\n}\n@keyframes spin {\n  0% {\n    transform: rotate(0deg);\n  }\n  100% {\n    transform: rotate(360deg);\n  }\n}\n.flip-container {\n  margin-bottom: 30px;\n  position: relative;\n  height: 380px;\n}\n.flip-card-front,\n.flip-card-back {\n  width: 100%;\n  height: 100%;\n  position: absolute;\n  top: 0;\n  left: 0;\n  transition: opacity 0.6s ease-in-out, transform 0.6s ease-in-out;\n}\n.flip-card-front {\n  opacity: 1;\n  transform: scale(1);\n  z-index: 2;\n}\n.flip-card-back {\n  opacity: 0;\n  transform: scale(0.9);\n  z-index: 1;\n}\n.flip-container.flipped .flip-card-front {\n  opacity: 0;\n  transform: scale(0.9);\n  z-index: 1;\n}\n.flip-container.flipped .flip-card-back {\n  opacity: 1;\n  transform: scale(1);\n  z-index: 2;\n}\n.metrics-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n  gap: 16px;\n  height: 100%;\n  align-content: start;\n}\n.chart-stats-container {\n  display: grid;\n  grid-template-columns: 40% 60%;\n  gap: 20px;\n  background: #1e293b;\n  border: 1px solid #334155;\n  border-radius: 12px;\n  padding: 20px;\n  height: 100%;\n}\n.chart-section,\n.stats-table-section {\n  display: flex;\n  flex-direction: column;\n}\n.chart-section h3,\n.stats-table-section h3 {\n  margin: 0 0 15px 0;\n  color: #f1f5f9;\n  font-size: 16px;\n  font-weight: 600;\n  text-align: center;\n}\n.chart-wrapper {\n  position: relative;\n  height: 280px;\n  width: 280px;\n  margin: 0 auto;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.chart-center-text {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  text-align: center;\n  pointer-events: none;\n}\n.center-value {\n  font-size: 36px;\n  font-weight: 700;\n  color: #f1f5f9;\n  line-height: 1;\n}\n.center-label {\n  font-size: 12px;\n  color: #94a3b8;\n  margin-top: 4px;\n}\n.stats-table {\n  width: 100%;\n  border-collapse: collapse;\n  background: #0f172a;\n  border-radius: 8px;\n  overflow: hidden;\n  font-size: 13px;\n}\n.stats-table thead {\n  background: #1e293b;\n}\n.stats-table th {\n  padding: 10px 12px;\n  text-align: left;\n  color: #94a3b8;\n  font-size: 12px;\n  font-weight: 600;\n  border-bottom: 2px solid #334155;\n}\n.stats-table td {\n  padding: 10px 12px;\n  color: #e2e8f0;\n  font-size: 13px;\n  border-bottom: 1px solid #334155;\n}\n.stats-table tbody tr:hover {\n  background: #1e293b;\n}\n.color-dot {\n  display: inline-block;\n  width: 10px;\n  height: 10px;\n  border-radius: 50%;\n  margin-right: 6px;\n  vertical-align: middle;\n}\n.high-percentage td {\n  font-weight: 600;\n}\n.medium-percentage td {\n  font-weight: 500;\n}\n.low-percentage td {\n  opacity: 0.8;\n}\n@media (max-width: 768px) {\n  .campaign-detail-container {\n    padding: 15px;\n  }\n  .header {\n    flex-direction: column;\n    align-items: flex-start;\n  }\n  .metrics-grid {\n    grid-template-columns: 1fr;\n  }\n  .table-controls {\n    flex-direction: column;\n    align-items: flex-start;\n  }\n  .pagination {\n    flex-direction: column;\n    gap: 15px;\n  }\n  .search-input {\n    width: 100%;\n  }\n  .chart-stats-container {\n    grid-template-columns: 1fr;\n  }\n  .chart-stats-container {\n    grid-template-columns: 1fr;\n    gap: 20px;\n  }\n  .chart-wrapper {\n    height: 250px;\n    width: 250px;\n  }\n}\n/*# sourceMappingURL=campaign-detail.component.css.map */\n"], encapsulation: 2 });
var CampaignDetailComponent = _CampaignDetailComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CampaignDetailComponent, [{
    type: Component,
    args: [{ selector: "app-campaign-detail", standalone: true, imports: [CommonModule, FormsModule, BaseChartDirective, LucideAngularModule], encapsulation: ViewEncapsulation.None, template: `<div class="campaign-detail-container">\r
  <!-- Header with back button -->\r
  <div class="flex items-center gap-2 mb-2">\r
    <div class="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">\r
      <lucide-angular name="clipboard-list" [size]="16" class="text-white"></lucide-angular>\r
    </div>\r
    <div>\r
      <h1 class="text-lg font-bold text-white">Detalle de Campa\xF1a</h1>\r
      <p class="text-xs text-gray-400">Informaci\xF3n detallada y m\xE9tricas de la campa\xF1a</p>\r
    </div>\r
  </div>\r
\r
  <div class="header">\r
    <button class="btn-back" (click)="goBack()">\r
      <lucide-angular name="arrow-left" [size]="18"></lucide-angular>\r
      <span>Volver a Campa\xF1as</span>\r
    </button>\r
  </div>\r
\r
  <!-- Error Message -->\r
  <div *ngIf="error" class="error-message"><lucide-angular name="x-circle" [size]="18"></lucide-angular> {{ error }}</div>\r
\r
  <!-- Loading State -->\r
  <div *ngIf="loading && !statistics" class="loading-state">\r
    <div class="spinner"></div>\r
    <p>Cargando...</p>\r
  </div>\r
\r
  <!-- Campaign Statistics -->\r
  <div *ngIf="statistics" class="statistics-section">\r
    <!-- Campaign Header -->\r
    <div class="campaign-header-card">\r
      <div class="campaign-title-section">\r
        <h2>{{ statistics.nombre }}</h2>\r
        <span\r
          class="status-badge"\r
          [style.background-color]="getEstadoCampanaColor(statistics.estadoActual)">\r
          {{ getEstadoCampanaTexto(statistics.estadoActual) }}\r
        </span>\r
        <!-- Toggle Button -->\r
        <button class="btn-toggle-chart" (click)="toggleChart()" title="Ver gr\xE1fico de distribuci\xF3n">\r
          <lucide-angular *ngIf="showChart" name="bar-chart-2" [size]="18"></lucide-angular>\r
          <lucide-angular *ngIf="!showChart" name="trending-up" [size]="18"></lucide-angular>\r
          {{ showChart ? 'Ver M\xE9tricas' : 'Ver Gr\xE1fico' }}\r
        </button>\r
      </div>\r
      <p *ngIf="statistics.descripcion" class="campaign-description">\r
        {{ statistics.descripcion }}\r
      </p>\r
    </div>\r
\r
    <!-- Flip Container -->\r
    <div class="flip-container" [class.flipped]="showChart">\r
      <!-- Front: Metrics Grid -->\r
      <div class="flip-card-front">\r
        <div class="metrics-grid">\r
      <!-- Estado Actual -->\r
      <div class="metric-card">\r
        <span class="metric-icon"><lucide-angular name="bar-chart-2" [size]="24"></lucide-angular></span>\r
        <div class="metric-content">\r
          <span class="metric-label">Estado Actual</span>\r
          <span class="metric-value">{{ getEstadoCampanaTexto(statistics.estadoActual) }}</span>\r
        </div>\r
      </div>\r
\r
      <!-- Fecha Inicio -->\r
      <div class="metric-card">\r
        <span class="metric-icon"><lucide-angular name="calendar" [size]="24"></lucide-angular></span>\r
        <div class="metric-content">\r
          <span class="metric-label">Fecha Inicio</span>\r
          <span class="metric-value">\r
            {{ statistics.fechaInicio ? (statistics.fechaInicio | date: 'dd-MM-yyyy') : '-' }}\r
          </span>\r
        </div>\r
      </div>\r
\r
      <!-- Fecha Final -->\r
      <div class="metric-card">\r
        <span class="metric-icon"><lucide-angular name="flag" [size]="24"></lucide-angular></span>\r
        <div class="metric-content">\r
          <span class="metric-label">Fecha Final</span>\r
          <span class="metric-value">\r
            {{ statistics.fechaFinal ? (statistics.fechaFinal | date: 'dd-MM-yyyy') : '-' }}\r
          </span>\r
        </div>\r
      </div>\r
\r
      <!-- Total de Registros -->\r
      <div class="metric-card">\r
        <span class="metric-icon"><lucide-angular name="file-text" [size]="24"></lucide-angular></span>\r
        <div class="metric-content">\r
          <span class="metric-label">Total de Registros</span>\r
          <span class="metric-value">{{ statistics.totalRegistros | number }}</span>\r
        </div>\r
      </div>\r
\r
      <!-- Falta Reintentar -->\r
      <div class="metric-card">\r
        <span class="metric-icon"><lucide-angular name="refresh-cw" [size]="24"></lucide-angular></span>\r
        <div class="metric-content">\r
          <span class="metric-label">Falta Reintentar</span>\r
          <span class="metric-value">{{ statistics.faltaReintentar | number }}</span>\r
        </div>\r
      </div>\r
\r
      <!-- Reintentos Completados -->\r
      <div class="metric-card">\r
        <span class="metric-icon"><lucide-angular name="check-circle" [size]="24"></lucide-angular></span>\r
        <div class="metric-content">\r
          <span class="metric-label">Reintentos Completados</span>\r
          <span class="metric-value">{{ statistics.reintentosCompletados | number }}</span>\r
        </div>\r
      </div>\r
\r
      <!-- Falta Llamar -->\r
      <div class="metric-card">\r
        <span class="metric-icon"><lucide-angular name="phone-call" [size]="24"></lucide-angular></span>\r
        <div class="metric-content">\r
          <span class="metric-label">Falta Llamar</span>\r
          <span class="metric-value">{{ statistics.faltaLlamar | number }}</span>\r
        </div>\r
      </div>\r
\r
      <!-- Duraci\xF3n Promedio Llamada -->\r
      <div class="metric-card">\r
        <span class="metric-icon"><lucide-angular name="clock" [size]="24"></lucide-angular></span>\r
        <div class="metric-content">\r
          <span class="metric-label">Duraci\xF3n Promedio Llamada</span>\r
          <span class="metric-value">{{ statistics.duracionPromedioLlamada }}</span>\r
        </div>\r
      </div>\r
\r
      <!-- Duraci\xF3n M\xE1xima Llamada -->\r
      <div class="metric-card">\r
        <span class="metric-icon"><lucide-angular name="timer" [size]="24"></lucide-angular></span>\r
        <div class="metric-content">\r
          <span class="metric-label">Duraci\xF3n M\xE1xima Llamada</span>\r
          <span class="metric-value">{{ statistics.duracionMaximaLlamada }}</span>\r
        </div>\r
      </div>\r
        </div>\r
      </div>\r
\r
      <!-- Back: Chart and Stats Table -->\r
      <div class="flip-card-back">\r
        <div class="chart-stats-container">\r
          <!-- Donut Chart -->\r
          <div class="chart-section">\r
            <h3>Distribuci\xF3n de Llamadas</h3>\r
            <div class="chart-wrapper">\r
              <canvas baseChart\r
                [data]="doughnutChartData"\r
                [type]="doughnutChartType"\r
                [options]="doughnutChartOptions">\r
              </canvas>\r
              <div class="chart-center-text">\r
                <div class="center-value">{{ statistics.totalLlamadas }}</div>\r
                <div class="center-label">Total</div>\r
              </div>\r
            </div>\r
          </div>\r
\r
          <!-- Stats Table -->\r
          <div class="stats-table-section">\r
            <h3>Estado Llamadas</h3>\r
            <table class="stats-table">\r
              <thead>\r
                <tr>\r
                  <th>Estado</th>\r
                  <th>Cantidad</th>\r
                  <th>Porcentaje</th>\r
                </tr>\r
              </thead>\r
              <tbody>\r
                <tr [ngClass]="getRowClass(getPercentage(statistics.llamadasContestadas, statistics.totalLlamadas))">\r
                  <td><span class="color-dot" style="background-color: #10B981"></span> Contestadas</td>\r
                  <td>{{ statistics.llamadasContestadas | number }}</td>\r
                  <td>{{ getPercentage(statistics.llamadasContestadas, statistics.totalLlamadas) }}</td>\r
                </tr>\r
                <tr [ngClass]="getRowClass(getPercentage(statistics.llamadasCortas, statistics.totalLlamadas))">\r
                  <td><span class="color-dot" style="background-color: #F59E0B"></span> Cortas</td>\r
                  <td>{{ statistics.llamadasCortas | number }}</td>\r
                  <td>{{ getPercentage(statistics.llamadasCortas, statistics.totalLlamadas) }}</td>\r
                </tr>\r
                <tr [ngClass]="getRowClass(getPercentage(statistics.llamadasAbandonadas, statistics.totalLlamadas))">\r
                  <td><span class="color-dot" style="background-color: #EF4444"></span> Abandonadas</td>\r
                  <td>{{ statistics.llamadasAbandonadas | number }}</td>\r
                  <td>{{ getPercentage(statistics.llamadasAbandonadas, statistics.totalLlamadas) }}</td>\r
                </tr>\r
                <tr [ngClass]="getRowClass(getPercentage(statistics.llamadasNoContestadas, statistics.totalLlamadas))">\r
                  <td><span class="color-dot" style="background-color: #F97316"></span> No Responden</td>\r
                  <td>{{ statistics.llamadasNoContestadas | number }}</td>\r
                  <td>{{ getPercentage(statistics.llamadasNoContestadas, statistics.totalLlamadas) }}</td>\r
                </tr>\r
                <tr [ngClass]="getRowClass(getPercentage(statistics.llamadasBuzonVoz, statistics.totalLlamadas))">\r
                  <td><span class="color-dot" style="background-color: #3B82F6"></span> Buz\xF3n de Voz</td>\r
                  <td>{{ statistics.llamadasBuzonVoz | number }}</td>\r
                  <td>{{ getPercentage(statistics.llamadasBuzonVoz, statistics.totalLlamadas) }}</td>\r
                </tr>\r
                <tr [ngClass]="getRowClass(getPercentage(statistics.llamadasFallidas, statistics.totalLlamadas))">\r
                  <td><span class="color-dot" style="background-color: #6B7280"></span> Fallidas</td>\r
                  <td>{{ statistics.llamadasFallidas | number }}</td>\r
                  <td>{{ getPercentage(statistics.llamadasFallidas, statistics.totalLlamadas) }}</td>\r
                </tr>\r
                <tr [ngClass]="getRowClass(getPercentage(statistics.llamadasPausadas, statistics.totalLlamadas))">\r
                  <td><span class="color-dot" style="background-color: #94A3B8"></span> Pausadas</td>\r
                  <td>{{ statistics.llamadasPausadas | number }}</td>\r
                  <td>{{ getPercentage(statistics.llamadasPausadas, statistics.totalLlamadas) }}</td>\r
                </tr>\r
              </tbody>\r
            </table>\r
          </div>\r
        </div>\r
      </div>\r
    </div>\r
  </div>\r
\r
  <!-- Calls History Table -->\r
  <div *ngIf="statistics" class="calls-section">\r
    <div class="table-header">\r
      <h3><lucide-angular name="phone-call" [size]="20"></lucide-angular> Registro de Llamadas</h3>\r
\r
      <div class="table-controls">\r
        <!-- Page Size Selector -->\r
        <div class="page-size-control">\r
          <label>Mostrar</label>\r
          <select (change)="onPageSizeChange($event)" [value]="pageSize">\r
            <option *ngFor="let option of pageSizeOptions" [value]="option">{{ option }}</option>\r
          </select>\r
          <label>registros</label>\r
        </div>\r
\r
        <!-- Search Box -->\r
        <div class="search-control">\r
          <label>B\xFAsqueda:</label>\r
          <input\r
            type="text"\r
            [(ngModel)]="searchTerm"\r
            (keyup.enter)="onSearch()"\r
            placeholder="Buscar..."\r
            class="search-input">\r
          <button (click)="onSearch()" class="btn-search"><lucide-angular name="search" [size]="16"></lucide-angular></button>\r
        </div>\r
      </div>\r
    </div>\r
\r
    <!-- Table -->\r
    <div class="table-container">\r
      <table class="calls-table">\r
        <thead>\r
          <tr>\r
            <th>Fecha</th>\r
            <th>Tel\xE9fono</th>\r
            <th>Dato</th>\r
            <th>Estado</th>\r
            <th>Causa</th>\r
            <th>Duraci\xF3n</th>\r
            <th>Int.</th>\r
          </tr>\r
        </thead>\r
        <tbody>\r
          <tr *ngFor="let call of calls">\r
            <td>{{ call.fecha | date: 'dd/MM/yyyy HH:mm' }}</td>\r
            <td>{{ call.telefono }}</td>\r
            <td>{{ call.dato }}</td>\r
            <td>\r
              <span class="estado-badge" [ngClass]="getEstadoClass(call.estado)">\r
                {{ getEstadoTexto(call.estado) }}\r
              </span>\r
            </td>\r
            <td>{{ call.causa || '-' }}</td>\r
            <td>{{ call.duracion }}</td>\r
            <td class="text-center">{{ call.intentos }}</td>\r
          </tr>\r
          <tr *ngIf="calls.length === 0">\r
            <td colspan="7" class="empty-row">\r
              <lucide-angular name="inbox" [size]="20"></lucide-angular> No hay llamadas registradas para esta campa\xF1a\r
            </td>\r
          </tr>\r
        </tbody>\r
      </table>\r
    </div>\r
\r
    <!-- Pagination -->\r
    <div class="pagination" *ngIf="totalPages > 0">\r
      <div class="pagination-info">\r
        Mostrando {{ (currentPage * pageSize) + 1 }} a\r
        {{ Math.min((currentPage + 1) * pageSize, totalElements) }} de\r
        {{ totalElements }} registros\r
      </div>\r
\r
      <div class="pagination-controls">\r
        <button\r
          class="btn-page"\r
          [disabled]="currentPage === 0"\r
          (click)="onPageChange(currentPage - 1)">\r
          <lucide-angular name="arrow-left" [size]="16"></lucide-angular> Anterior\r
        </button>\r
\r
        <button\r
          *ngFor="let page of getPageNumbers()"\r
          class="btn-page-number"\r
          [class.active]="page === currentPage"\r
          (click)="onPageChange(page)">\r
          {{ page + 1 }}\r
        </button>\r
\r
        <button\r
          class="btn-page"\r
          [disabled]="currentPage === totalPages - 1"\r
          (click)="onPageChange(currentPage + 1)">\r
          Siguiente <lucide-angular name="arrow-right" [size]="16"></lucide-angular>\r
        </button>\r
      </div>\r
    </div>\r
  </div>\r
</div>\r
`, styles: ["/* src/app/features/admin/campaign-detail/campaign-detail.component.css */\n.campaign-detail-container {\n  padding: 20px !important;\n  max-width: 1400px;\n  margin: 0 auto;\n  background:\n    linear-gradient(\n      to bottom right,\n      #0f172a,\n      #1e293b,\n      #0f172a);\n  min-height: 100vh;\n  color: #e2e8f0;\n}\n.header {\n  display: flex;\n  align-items: center;\n  gap: 20px;\n  margin-bottom: 30px;\n}\n.header h1 {\n  margin: 0;\n  color: #f1f5f9;\n  font-size: 28px;\n  font-weight: 600;\n}\n.btn-back {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  padding: 10px 16px;\n  background: #1e293b;\n  color: #e2e8f0;\n  border: 1px solid #334155;\n  border-radius: 8px;\n  cursor: pointer;\n  font-size: 14px;\n  transition: all 0.3s;\n}\n.btn-back:hover {\n  background: #334155;\n  border-color: #475569;\n}\n.campaign-header-card {\n  background: #1e293b;\n  border: 1px solid #334155;\n  border-radius: 12px;\n  padding: 20px;\n  margin-bottom: 20px;\n}\n.campaign-title-section {\n  display: flex;\n  align-items: center;\n  gap: 15px;\n  margin-bottom: 10px;\n}\n.campaign-title-section h2 {\n  margin: 0;\n  color: #f1f5f9;\n  font-size: 24px;\n  font-weight: 600;\n}\n.btn-toggle-chart {\n  padding: 8px 16px;\n  background: #3B82F6;\n  color: white;\n  border: none;\n  border-radius: 8px;\n  cursor: pointer;\n  font-size: 13px;\n  font-weight: 500;\n  transition: all 0.3s;\n  margin-left: auto;\n}\n.btn-toggle-chart:hover {\n  background: #2563EB;\n  transform: translateY(-2px);\n}\n.status-badge {\n  padding: 6px 12px;\n  border-radius: 6px;\n  color: white;\n  font-size: 13px;\n  font-weight: 500;\n}\n.campaign-description {\n  margin: 0;\n  color: #94a3b8;\n  font-size: 14px;\n}\n.metric-card {\n  background: #1e293b;\n  border: 1px solid #334155;\n  border-radius: 12px;\n  padding: 16px;\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  transition: all 0.3s;\n}\n.metric-card:hover {\n  border-color: #475569;\n  transform: translateY(-2px);\n}\n.metric-icon {\n  font-size: 28px;\n}\n.metric-content {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n}\n.metric-label {\n  color: #94a3b8;\n  font-size: 12px;\n  font-weight: 500;\n}\n.metric-value {\n  color: #f1f5f9;\n  font-size: 20px;\n  font-weight: 600;\n}\n.calls-section {\n  background: #1e293b;\n  border: 1px solid #334155;\n  border-radius: 12px;\n  padding: 20px;\n}\n.table-header {\n  margin-bottom: 20px;\n}\n.table-header h3 {\n  margin: 0 0 15px 0;\n  color: #f1f5f9;\n  font-size: 20px;\n  font-weight: 600;\n}\n.table-controls {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 20px;\n  flex-wrap: wrap;\n}\n.page-size-control {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  color: #94a3b8;\n  font-size: 14px;\n}\n.page-size-control select {\n  padding: 6px 10px;\n  background: #0f172a;\n  color: #e2e8f0;\n  border: 1px solid #334155;\n  border-radius: 6px;\n  cursor: pointer;\n}\n.search-control {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n}\n.search-control label {\n  color: #94a3b8;\n  font-size: 14px;\n}\n.search-input {\n  padding: 8px 12px;\n  background: #0f172a;\n  color: #e2e8f0;\n  border: 1px solid #334155;\n  border-radius: 6px;\n  font-size: 14px;\n  width: 200px;\n}\n.search-input:focus {\n  outline: none;\n  border-color: #3B82F6;\n}\n.btn-search {\n  padding: 8px 12px;\n  background: #3B82F6;\n  color: white;\n  border: none;\n  border-radius: 6px;\n  cursor: pointer;\n  transition: all 0.3s;\n}\n.btn-search:hover {\n  background: #2563EB;\n}\n.table-container {\n  overflow-x: auto;\n  margin-bottom: 20px;\n}\n.calls-table {\n  width: 100%;\n  border-collapse: collapse;\n}\n.calls-table thead {\n  background: #0f172a;\n}\n.calls-table th {\n  padding: 12px;\n  text-align: left;\n  color: #94a3b8;\n  font-size: 13px;\n  font-weight: 600;\n  border-bottom: 2px solid #334155;\n}\n.calls-table tbody tr {\n  border-bottom: 1px solid #334155;\n  transition: all 0.3s;\n}\n.calls-table tbody tr:hover {\n  background: #0f172a;\n}\n.calls-table td {\n  padding: 12px;\n  color: #e2e8f0;\n  font-size: 14px;\n}\n.text-center {\n  text-align: center;\n}\n.empty-row {\n  text-align: center;\n  color: #94a3b8;\n  padding: 40px !important;\n  font-size: 16px;\n}\n.estado-badge {\n  padding: 4px 10px;\n  border-radius: 6px;\n  font-size: 12px;\n  font-weight: 500;\n  display: inline-block;\n}\n.estado-exitoso {\n  background: rgba(16, 185, 129, 0.2);\n  color: #10B981;\n  border: 1px solid #10B981;\n}\n.estado-en-proceso {\n  background: rgba(59, 130, 246, 0.2);\n  color: #3B82F6;\n  border: 1px solid #3B82F6;\n}\n.estado-warning {\n  background: rgba(245, 158, 11, 0.2);\n  color: #F59E0B;\n  border: 1px solid #F59E0B;\n}\n.estado-error {\n  background: rgba(239, 68, 68, 0.2);\n  color: #EF4444;\n  border: 1px solid #EF4444;\n}\n.estado-default {\n  background: rgba(107, 114, 128, 0.2);\n  color: #6B7280;\n  border: 1px solid #6B7280;\n}\n.pagination {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding-top: 20px;\n  border-top: 1px solid #334155;\n}\n.pagination-info {\n  color: #94a3b8;\n  font-size: 14px;\n}\n.pagination-controls {\n  display: flex;\n  gap: 8px;\n  align-items: center;\n}\n.btn-page,\n.btn-page-number {\n  padding: 8px 12px;\n  background: #0f172a;\n  color: #e2e8f0;\n  border: 1px solid #334155;\n  border-radius: 6px;\n  cursor: pointer;\n  font-size: 14px;\n  transition: all 0.3s;\n}\n.btn-page:hover:not(:disabled),\n.btn-page-number:hover {\n  background: #334155;\n  border-color: #475569;\n}\n.btn-page:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n.btn-page-number.active {\n  background: #3B82F6;\n  border-color: #3B82F6;\n  color: white;\n}\n.error-message {\n  background: rgba(239, 68, 68, 0.1);\n  border: 1px solid #EF4444;\n  color: #EF4444;\n  padding: 12px 16px;\n  border-radius: 8px;\n  margin-bottom: 20px;\n  font-size: 14px;\n}\n.loading-state {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  padding: 60px;\n  color: #94a3b8;\n}\n.spinner {\n  border: 4px solid #334155;\n  border-top: 4px solid #3B82F6;\n  border-radius: 50%;\n  width: 40px;\n  height: 40px;\n  animation: spin 1s linear infinite;\n  margin-bottom: 16px;\n}\n@keyframes spin {\n  0% {\n    transform: rotate(0deg);\n  }\n  100% {\n    transform: rotate(360deg);\n  }\n}\n.flip-container {\n  margin-bottom: 30px;\n  position: relative;\n  height: 380px;\n}\n.flip-card-front,\n.flip-card-back {\n  width: 100%;\n  height: 100%;\n  position: absolute;\n  top: 0;\n  left: 0;\n  transition: opacity 0.6s ease-in-out, transform 0.6s ease-in-out;\n}\n.flip-card-front {\n  opacity: 1;\n  transform: scale(1);\n  z-index: 2;\n}\n.flip-card-back {\n  opacity: 0;\n  transform: scale(0.9);\n  z-index: 1;\n}\n.flip-container.flipped .flip-card-front {\n  opacity: 0;\n  transform: scale(0.9);\n  z-index: 1;\n}\n.flip-container.flipped .flip-card-back {\n  opacity: 1;\n  transform: scale(1);\n  z-index: 2;\n}\n.metrics-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n  gap: 16px;\n  height: 100%;\n  align-content: start;\n}\n.chart-stats-container {\n  display: grid;\n  grid-template-columns: 40% 60%;\n  gap: 20px;\n  background: #1e293b;\n  border: 1px solid #334155;\n  border-radius: 12px;\n  padding: 20px;\n  height: 100%;\n}\n.chart-section,\n.stats-table-section {\n  display: flex;\n  flex-direction: column;\n}\n.chart-section h3,\n.stats-table-section h3 {\n  margin: 0 0 15px 0;\n  color: #f1f5f9;\n  font-size: 16px;\n  font-weight: 600;\n  text-align: center;\n}\n.chart-wrapper {\n  position: relative;\n  height: 280px;\n  width: 280px;\n  margin: 0 auto;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.chart-center-text {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  text-align: center;\n  pointer-events: none;\n}\n.center-value {\n  font-size: 36px;\n  font-weight: 700;\n  color: #f1f5f9;\n  line-height: 1;\n}\n.center-label {\n  font-size: 12px;\n  color: #94a3b8;\n  margin-top: 4px;\n}\n.stats-table {\n  width: 100%;\n  border-collapse: collapse;\n  background: #0f172a;\n  border-radius: 8px;\n  overflow: hidden;\n  font-size: 13px;\n}\n.stats-table thead {\n  background: #1e293b;\n}\n.stats-table th {\n  padding: 10px 12px;\n  text-align: left;\n  color: #94a3b8;\n  font-size: 12px;\n  font-weight: 600;\n  border-bottom: 2px solid #334155;\n}\n.stats-table td {\n  padding: 10px 12px;\n  color: #e2e8f0;\n  font-size: 13px;\n  border-bottom: 1px solid #334155;\n}\n.stats-table tbody tr:hover {\n  background: #1e293b;\n}\n.color-dot {\n  display: inline-block;\n  width: 10px;\n  height: 10px;\n  border-radius: 50%;\n  margin-right: 6px;\n  vertical-align: middle;\n}\n.high-percentage td {\n  font-weight: 600;\n}\n.medium-percentage td {\n  font-weight: 500;\n}\n.low-percentage td {\n  opacity: 0.8;\n}\n@media (max-width: 768px) {\n  .campaign-detail-container {\n    padding: 15px;\n  }\n  .header {\n    flex-direction: column;\n    align-items: flex-start;\n  }\n  .metrics-grid {\n    grid-template-columns: 1fr;\n  }\n  .table-controls {\n    flex-direction: column;\n    align-items: flex-start;\n  }\n  .pagination {\n    flex-direction: column;\n    gap: 15px;\n  }\n  .search-input {\n    width: 100%;\n  }\n  .chart-stats-container {\n    grid-template-columns: 1fr;\n  }\n  .chart-stats-container {\n    grid-template-columns: 1fr;\n    gap: 20px;\n  }\n  .chart-wrapper {\n    height: 250px;\n    width: 250px;\n  }\n}\n/*# sourceMappingURL=campaign-detail.component.css.map */\n"] }]
  }], () => [{ type: ActivatedRoute }, { type: Router }, { type: CampaignAdminService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(CampaignDetailComponent, { className: "CampaignDetailComponent", filePath: "src/app/features/admin/campaign-detail/campaign-detail.component.ts", lineNumber: 23 });
})();
export {
  CampaignDetailComponent
};
//# sourceMappingURL=chunk-4T2XXYVG.js.map
