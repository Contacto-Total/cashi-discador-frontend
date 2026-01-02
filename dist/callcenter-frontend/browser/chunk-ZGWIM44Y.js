import {
  TenantService
} from "./chunk-RDUKPQZZ.js";
import {
  PortfolioService
} from "./chunk-K6HKS25L.js";
import {
  CampaignAdminService
} from "./chunk-MXUAS7RP.js";
import {
  ActivatedRoute,
  Router
} from "./chunk-OCZLH7K5.js";
import "./chunk-ZQICQP3Y.js";
import {
  DefaultValueAccessor,
  FormsModule,
  MaxValidator,
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
  LucideAngularComponent,
  LucideAngularModule
} from "./chunk-RFBUEVFE.js";
import "./chunk-QF774CZR.js";
import {
  CommonModule,
  Component,
  DecimalPipe,
  NgForOf,
  NgIf,
  forkJoin,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
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
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵproperty,
  ɵɵreference,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-CTRHJBBW.js";

// src/app/features/admin/campaign-form/campaign-form.component.ts
function CampaignFormComponent_div_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 9);
    \u0275\u0275element(1, "lucide-angular", 10);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("size", 16);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.error, " ");
  }
}
function CampaignFormComponent_div_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 11);
    \u0275\u0275element(1, "div", 12);
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.isEditMode ? "Cargando..." : "Guardando...");
  }
}
function CampaignFormComponent_form_11_option_32_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 29);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const tenant_r3 = ctx.$implicit;
    \u0275\u0275property("ngValue", tenant_r3.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2(" ", tenant_r3.tenantCode, " - ", tenant_r3.tenantName, " ");
  }
}
function CampaignFormComponent_form_11_option_40_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 29);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const portfolio_r4 = ctx.$implicit;
    \u0275\u0275property("ngValue", portfolio_r4.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2(" ", portfolio_r4.portfolioCode, " - ", portfolio_r4.portfolioName, " ");
  }
}
function CampaignFormComponent_form_11_option_47_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 29);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const sp_r5 = ctx.$implicit;
    \u0275\u0275property("ngValue", sp_r5.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2(" ", sp_r5.subPortfolioCode, " - ", sp_r5.subPortfolioName, " ");
  }
}
function CampaignFormComponent_form_11_ng_container_82_div_1_option_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 29);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const field_r7 = ctx.$implicit;
    \u0275\u0275property("ngValue", field_r7.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", field_r7.fieldName, " ");
  }
}
function CampaignFormComponent_form_11_ng_container_82_div_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 55)(1, "div", 56)(2, "div", 16)(3, "label", 57);
    \u0275\u0275text(4, "Campo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "select", 58);
    \u0275\u0275twoWayListener("ngModelChange", function CampaignFormComponent_form_11_ng_container_82_div_1_Template_select_ngModelChange_5_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r0 = \u0275\u0275nextContext(3);
      \u0275\u0275twoWayBindingSet(ctx_r0.selectedFieldId, $event) || (ctx_r0.selectedFieldId = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(6, "option", 29);
    \u0275\u0275text(7, "Seleccione...");
    \u0275\u0275elementEnd();
    \u0275\u0275template(8, CampaignFormComponent_form_11_ng_container_82_div_1_option_8_Template, 2, 2, "option", 30);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "div", 16)(10, "label", 59);
    \u0275\u0275text(11, "M\xEDn");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "input", 60);
    \u0275\u0275twoWayListener("ngModelChange", function CampaignFormComponent_form_11_ng_container_82_div_1_Template_input_ngModelChange_12_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r0 = \u0275\u0275nextContext(3);
      \u0275\u0275twoWayBindingSet(ctx_r0.newFilterMinValue, $event) || (ctx_r0.newFilterMinValue = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "div", 16)(14, "label", 61);
    \u0275\u0275text(15, "M\xE1x");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "input", 62);
    \u0275\u0275twoWayListener("ngModelChange", function CampaignFormComponent_form_11_ng_container_82_div_1_Template_input_ngModelChange_16_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r0 = \u0275\u0275nextContext(3);
      \u0275\u0275twoWayBindingSet(ctx_r0.newFilterMaxValue, $event) || (ctx_r0.newFilterMaxValue = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(17, "div", 63)(18, "button", 64);
    \u0275\u0275listener("click", function CampaignFormComponent_form_11_ng_container_82_div_1_Template_button_click_18_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.addFilter());
    });
    \u0275\u0275element(19, "lucide-angular", 65);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.selectedFieldId);
    \u0275\u0275advance();
    \u0275\u0275property("ngValue", 0);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngForOf", ctx_r0.filterableFields);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.newFilterMinValue);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.newFilterMaxValue);
    \u0275\u0275advance(3);
    \u0275\u0275property("size", 14);
  }
}
function CampaignFormComponent_form_11_ng_container_82_div_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 66);
    \u0275\u0275element(1, "lucide-angular", 67);
    \u0275\u0275text(2, " Sin campos num\xE9ricos configurados. ");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
  }
}
function CampaignFormComponent_form_11_ng_container_82_div_3_div_4_span_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "number");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const filter_r9 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(2, 1, filter_r9.minValue), " ");
  }
}
function CampaignFormComponent_form_11_ng_container_82_div_3_div_4_span_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, " - ");
    \u0275\u0275elementEnd();
  }
}
function CampaignFormComponent_form_11_ng_container_82_div_3_div_4_span_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "number");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const filter_r9 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(2, 1, filter_r9.maxValue), " ");
  }
}
function CampaignFormComponent_form_11_ng_container_82_div_3_div_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 71)(1, "span", 72);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 73);
    \u0275\u0275template(4, CampaignFormComponent_form_11_ng_container_82_div_3_div_4_span_4_Template, 3, 3, "span", 74)(5, CampaignFormComponent_form_11_ng_container_82_div_3_div_4_span_5_Template, 2, 0, "span", 74)(6, CampaignFormComponent_form_11_ng_container_82_div_3_div_4_span_6_Template, 3, 3, "span", 74);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "button", 75);
    \u0275\u0275listener("click", function CampaignFormComponent_form_11_ng_container_82_div_3_div_4_Template_button_click_7_listener() {
      const i_r10 = \u0275\u0275restoreView(_r8).index;
      const ctx_r0 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r0.removeFilter(i_r10));
    });
    \u0275\u0275element(8, "lucide-angular", 76);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const filter_r9 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(filter_r9.fieldName);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", filter_r9.minValue !== void 0 && filter_r9.minValue !== null);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", filter_r9.minValue !== void 0 && filter_r9.maxValue !== void 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", filter_r9.maxValue !== void 0 && filter_r9.maxValue !== null);
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 12);
  }
}
function CampaignFormComponent_form_11_ng_container_82_div_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 68)(1, "h3");
    \u0275\u0275text(2, "Filtros activos:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 69);
    \u0275\u0275template(4, CampaignFormComponent_form_11_ng_container_82_div_3_div_4_Template, 9, 5, "div", 70);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(4);
    \u0275\u0275property("ngForOf", ctx_r0.campaignFilters);
  }
}
function CampaignFormComponent_form_11_ng_container_82_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275template(1, CampaignFormComponent_form_11_ng_container_82_div_1_Template, 20, 6, "div", 52)(2, CampaignFormComponent_form_11_ng_container_82_div_2_Template, 3, 1, "div", 53)(3, CampaignFormComponent_form_11_ng_container_82_div_3_Template, 5, 1, "div", 54);
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.filterableFields.length > 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.filterableFields.length === 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.campaignFilters.length > 0);
  }
}
function CampaignFormComponent_form_11_ng_template_83_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 77);
    \u0275\u0275text(1, " Selecciona una subcartera para ver los campos disponibles para filtrar. ");
    \u0275\u0275elementEnd();
  }
}
function CampaignFormComponent_form_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "form", 13);
    \u0275\u0275listener("ngSubmit", function CampaignFormComponent_form_11_Template_form_ngSubmit_0_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.onSubmit());
    });
    \u0275\u0275elementStart(1, "div", 14)(2, "h2");
    \u0275\u0275element(3, "lucide-angular", 15);
    \u0275\u0275text(4, " Informaci\xF3n B\xE1sica ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 16)(6, "label", 17);
    \u0275\u0275text(7, "Nombre *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "input", 18);
    \u0275\u0275twoWayListener("ngModelChange", function CampaignFormComponent_form_11_Template_input_ngModelChange_8_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.campaign.name, $event) || (ctx_r0.campaign.name = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "div", 16)(10, "label", 19);
    \u0275\u0275text(11, "Descripci\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "textarea", 20);
    \u0275\u0275twoWayListener("ngModelChange", function CampaignFormComponent_form_11_Template_textarea_ngModelChange_12_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.campaign.description, $event) || (ctx_r0.campaign.description = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "div", 21)(14, "div", 16)(15, "label", 22);
    \u0275\u0275text(16, "Fecha Inicio");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "input", 23);
    \u0275\u0275twoWayListener("ngModelChange", function CampaignFormComponent_form_11_Template_input_ngModelChange_17_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.startDateString, $event) || (ctx_r0.startDateString = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(18, "div", 16)(19, "label", 24);
    \u0275\u0275text(20, "Fecha Fin");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "input", 25);
    \u0275\u0275twoWayListener("ngModelChange", function CampaignFormComponent_form_11_Template_input_ngModelChange_21_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.endDateString, $event) || (ctx_r0.endDateString = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(22, "div", 14)(23, "h2");
    \u0275\u0275element(24, "lucide-angular", 26);
    \u0275\u0275text(25, " Asignaci\xF3n ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "div", 16)(27, "label", 27);
    \u0275\u0275text(28, "Proveedor *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "select", 28);
    \u0275\u0275twoWayListener("ngModelChange", function CampaignFormComponent_form_11_Template_select_ngModelChange_29_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.selectedTenantId, $event) || (ctx_r0.selectedTenantId = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function CampaignFormComponent_form_11_Template_select_ngModelChange_29_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.onTenantChange());
    });
    \u0275\u0275elementStart(30, "option", 29);
    \u0275\u0275text(31, "Seleccione...");
    \u0275\u0275elementEnd();
    \u0275\u0275template(32, CampaignFormComponent_form_11_option_32_Template, 2, 3, "option", 30);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(33, "div", 21)(34, "div", 16)(35, "label", 31);
    \u0275\u0275text(36, "Cartera *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(37, "select", 32);
    \u0275\u0275twoWayListener("ngModelChange", function CampaignFormComponent_form_11_Template_select_ngModelChange_37_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.selectedPortfolioId, $event) || (ctx_r0.selectedPortfolioId = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function CampaignFormComponent_form_11_Template_select_ngModelChange_37_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.onPortfolioChange());
    });
    \u0275\u0275elementStart(38, "option", 29);
    \u0275\u0275text(39, "Seleccione...");
    \u0275\u0275elementEnd();
    \u0275\u0275template(40, CampaignFormComponent_form_11_option_40_Template, 2, 3, "option", 30);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(41, "div", 16)(42, "label", 33);
    \u0275\u0275text(43, "Subcartera *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(44, "select", 34);
    \u0275\u0275twoWayListener("ngModelChange", function CampaignFormComponent_form_11_Template_select_ngModelChange_44_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.selectedSubPortfolioId, $event) || (ctx_r0.selectedSubPortfolioId = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function CampaignFormComponent_form_11_Template_select_ngModelChange_44_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.onSubPortfolioChange());
    });
    \u0275\u0275elementStart(45, "option", 29);
    \u0275\u0275text(46, "Seleccione...");
    \u0275\u0275elementEnd();
    \u0275\u0275template(47, CampaignFormComponent_form_11_option_47_Template, 2, 3, "option", 30);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(48, "div", 14)(49, "h2");
    \u0275\u0275element(50, "lucide-angular", 35);
    \u0275\u0275text(51, " Configuraci\xF3n de Discado ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(52, "div", 21)(53, "div", 16)(54, "label", 36);
    \u0275\u0275text(55, "Modo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(56, "select", 37);
    \u0275\u0275twoWayListener("ngModelChange", function CampaignFormComponent_form_11_Template_select_ngModelChange_56_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.campaign.dialMode, $event) || (ctx_r0.campaign.dialMode = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(57, "option", 38);
    \u0275\u0275text(58, "Manual");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(59, "option", 39);
    \u0275\u0275text(60, "Progresivo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(61, "option", 40);
    \u0275\u0275text(62, "Predictivo");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(63, "div", 16)(64, "label", 41);
    \u0275\u0275text(65, "Intentos M\xE1x.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(66, "input", 42);
    \u0275\u0275twoWayListener("ngModelChange", function CampaignFormComponent_form_11_Template_input_ngModelChange_66_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.campaign.maxAttempts, $event) || (ctx_r0.campaign.maxAttempts = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(67, "div", 21)(68, "div", 16)(69, "label", 43);
    \u0275\u0275text(70, "Intervalo (min)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(71, "input", 44);
    \u0275\u0275twoWayListener("ngModelChange", function CampaignFormComponent_form_11_Template_input_ngModelChange_71_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.campaign.retryInterval, $event) || (ctx_r0.campaign.retryInterval = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(72, "div", 16)(73, "label", 45);
    \u0275\u0275text(74, "Intensidad");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(75, "input", 46);
    \u0275\u0275twoWayListener("ngModelChange", function CampaignFormComponent_form_11_Template_input_ngModelChange_75_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.campaign.intensidad, $event) || (ctx_r0.campaign.intensidad = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(76, "small");
    \u0275\u0275text(77, "Llamadas simult\xE1neas (1-100)");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(78, "div", 14)(79, "h2");
    \u0275\u0275element(80, "lucide-angular", 47);
    \u0275\u0275text(81, " Filtros de Segmentaci\xF3n ");
    \u0275\u0275elementEnd();
    \u0275\u0275template(82, CampaignFormComponent_form_11_ng_container_82_Template, 4, 3, "ng-container", 48)(83, CampaignFormComponent_form_11_ng_template_83_Template, 2, 0, "ng-template", null, 0, \u0275\u0275templateRefExtractor);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(85, "div", 49)(86, "button", 50);
    \u0275\u0275listener("click", function CampaignFormComponent_form_11_Template_button_click_86_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.onCancel());
    });
    \u0275\u0275text(87, " Cancelar ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(88, "button", 51);
    \u0275\u0275text(89);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const noSubcartera_r11 = \u0275\u0275reference(84);
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275property("size", 16);
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.campaign.name);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.campaign.description);
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.startDateString);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.endDateString);
    \u0275\u0275advance(3);
    \u0275\u0275property("size", 16);
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.selectedTenantId);
    \u0275\u0275advance();
    \u0275\u0275property("ngValue", 0);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngForOf", ctx_r0.tenants);
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.selectedPortfolioId);
    \u0275\u0275property("disabled", ctx_r0.selectedTenantId === 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngValue", 0);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngForOf", ctx_r0.portfolios);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.selectedSubPortfolioId);
    \u0275\u0275property("disabled", ctx_r0.selectedPortfolioId === 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngValue", 0);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngForOf", ctx_r0.subPortfolios);
    \u0275\u0275advance(3);
    \u0275\u0275property("size", 16);
    \u0275\u0275advance(6);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.campaign.dialMode);
    \u0275\u0275advance(10);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.campaign.maxAttempts);
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.campaign.retryInterval);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.campaign.intensidad);
    \u0275\u0275advance(5);
    \u0275\u0275property("size", 16);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", ctx_r0.selectedSubPortfolioId > 0)("ngIfElse", noSubcartera_r11);
    \u0275\u0275advance(6);
    \u0275\u0275property("disabled", ctx_r0.loading);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.isEditMode ? "Actualizar" : "Crear Campa\xF1a", " ");
  }
}
var _CampaignFormComponent = class _CampaignFormComponent {
  constructor(campaignService, tenantService, portfolioService, router, route) {
    this.campaignService = campaignService;
    this.tenantService = tenantService;
    this.portfolioService = portfolioService;
    this.router = router;
    this.route = route;
    this.campaign = {
      name: "",
      description: "",
      status: "DRAFT",
      dialMode: "PROGRESSIVE",
      maxAttempts: 3,
      retryInterval: 60,
      intensidad: 50,
      tenantId: void 0,
      portfolioId: void 0,
      subPortfolioId: void 0
    };
    this.isEditMode = false;
    this.loading = false;
    this.error = null;
    this.campaignId = null;
    this.tenants = [];
    this.portfolios = [];
    this.subPortfolios = [];
    this.selectedTenantId = 0;
    this.selectedPortfolioId = 0;
    this.selectedSubPortfolioId = 0;
    this.startDateString = "";
    this.endDateString = "";
    this.filterableFields = [];
    this.campaignFilters = [];
    this.selectedFieldId = 0;
    this.newFilterMinValue = null;
    this.newFilterMaxValue = null;
  }
  ngOnInit() {
    this.loadTenants();
    this.route.params.subscribe((params) => {
      if (params["id"]) {
        this.isEditMode = true;
        this.campaignId = +params["id"];
        this.loadCampaign(this.campaignId);
      }
    });
  }
  loadTenants() {
    this.tenantService.getAllTenants().subscribe({
      next: (tenants) => {
        this.tenants = tenants.filter((t) => t.isActive);
      },
      error: (err) => console.error("Error loading tenants:", err)
    });
  }
  onTenantChange() {
    this.selectedPortfolioId = 0;
    this.selectedSubPortfolioId = 0;
    this.portfolios = [];
    this.subPortfolios = [];
    if (this.selectedTenantId > 0) {
      this.portfolioService.getPortfoliosByTenant(this.selectedTenantId).subscribe({
        next: (portfolios) => {
          this.portfolios = portfolios.filter((p) => p.isActive);
        },
        error: (err) => console.error("Error loading portfolios:", err)
      });
    }
  }
  onPortfolioChange() {
    this.selectedSubPortfolioId = 0;
    this.subPortfolios = [];
    this.filterableFields = [];
    if (this.selectedPortfolioId > 0) {
      this.portfolioService.getSubPortfoliosByPortfolio(this.selectedPortfolioId).subscribe({
        next: (subPortfolios) => {
          this.subPortfolios = subPortfolios.filter((sp) => sp.isActive);
        },
        error: (err) => console.error("Error loading sub-portfolios:", err)
      });
    }
  }
  onSubPortfolioChange() {
    this.filterableFields = [];
    if (this.selectedSubPortfolioId > 0) {
      this.loadFilterableFields(this.selectedSubPortfolioId);
    }
  }
  loadFilterableFields(subcarteraId) {
    this.campaignService.getFilterableFieldsBySubcartera(subcarteraId).subscribe({
      next: (fields) => {
        this.filterableFields = fields;
        console.log("Campos filtrables cargados:", fields);
      },
      error: (err) => console.error("Error loading filterable fields:", err)
    });
  }
  loadCampaignFilters(campaignId) {
    this.campaignService.getCampaignFilters(campaignId).subscribe({
      next: (filters) => {
        this.campaignFilters = filters;
        console.log("Filtros de campa\xF1a cargados:", filters);
      },
      error: (err) => console.error("Error loading campaign filters:", err)
    });
  }
  addFilter() {
    if (this.selectedFieldId === 0) {
      this.error = "Seleccione un campo para filtrar";
      return;
    }
    if (this.newFilterMinValue === null && this.newFilterMaxValue === null) {
      this.error = "Ingrese al menos un valor (m\xEDnimo o m\xE1ximo)";
      return;
    }
    const selectedField = this.filterableFields.find((f) => f.id === this.selectedFieldId);
    if (!selectedField)
      return;
    const newFilter = {
      fieldDefinitionId: selectedField.id,
      fieldCode: selectedField.fieldCode,
      fieldName: selectedField.fieldName,
      minValue: this.newFilterMinValue ?? void 0,
      maxValue: this.newFilterMaxValue ?? void 0
    };
    this.campaignFilters.push(newFilter);
    this.selectedFieldId = 0;
    this.newFilterMinValue = null;
    this.newFilterMaxValue = null;
    this.error = null;
  }
  removeFilter(index) {
    this.campaignFilters.splice(index, 1);
  }
  getFieldNameByCode(fieldCode) {
    const field = this.filterableFields.find((f) => f.fieldCode === fieldCode);
    return field?.fieldName || fieldCode;
  }
  loadCampaign(id) {
    this.loading = true;
    this.campaignService.getCampaignById(id).subscribe({
      next: (campaign) => {
        console.log("\u2705 Campaign loaded:", campaign);
        this.campaign = campaign;
        if (campaign.startDate) {
          this.startDateString = this.toDateTimeLocal(campaign.startDate);
        }
        if (campaign.endDate) {
          this.endDateString = this.toDateTimeLocal(campaign.endDate);
        }
        if (campaign.tenantId && campaign.portfolioId && campaign.subPortfolioId) {
          console.log("\u{1F4CB} Loading cascading data for edit mode...", {
            tenantId: campaign.tenantId,
            portfolioId: campaign.portfolioId,
            subPortfolioId: campaign.subPortfolioId
          });
          forkJoin({
            portfolios: this.portfolioService.getPortfoliosByTenant(campaign.tenantId),
            subPortfolios: this.portfolioService.getSubPortfoliosByPortfolio(campaign.portfolioId)
          }).subscribe({
            next: (result) => {
              this.portfolios = result.portfolios.filter((p) => p.isActive);
              this.subPortfolios = result.subPortfolios.filter((sp) => sp.isActive);
              console.log("\u2705 Data loaded, now setting selected values:", {
                portfolios: this.portfolios.length,
                subPortfolios: this.subPortfolios.length,
                selectedTenant: campaign.tenantId,
                selectedPortfolio: campaign.portfolioId,
                selectedSubPortfolio: campaign.subPortfolioId
              });
              this.selectedTenantId = campaign.tenantId || 0;
              this.selectedPortfolioId = campaign.portfolioId || 0;
              this.selectedSubPortfolioId = campaign.subPortfolioId || 0;
              console.log("\u2705 Selected values assigned:", {
                selectedTenantId: this.selectedTenantId,
                selectedPortfolioId: this.selectedPortfolioId,
                selectedSubPortfolioId: this.selectedSubPortfolioId
              });
              if (campaign.subPortfolioId) {
                this.loadFilterableFields(campaign.subPortfolioId);
              }
              if (campaign.id) {
                this.loadCampaignFilters(campaign.id);
              }
              this.loading = false;
            },
            error: (err) => {
              console.error("\u274C Error loading portfolios/subportfolios:", err);
              this.error = "Error al cargar portfolios/subportfolios";
              this.loading = false;
            }
          });
        } else {
          console.warn("\u26A0\uFE0F Missing tenant/portfolio/subportfolio IDs");
          this.loading = false;
        }
      },
      error: (err) => {
        console.error("\u274C Error loading campaign:", err);
        this.error = "Error al cargar la campa\xF1a";
        this.loading = false;
      }
    });
  }
  onSubmit() {
    if (!this.campaign.name) {
      this.error = "El nombre de la campa\xF1a es requerido";
      return;
    }
    if (!this.selectedSubPortfolioId || this.selectedSubPortfolioId === 0) {
      this.error = "Debe seleccionar una subcartera";
      return;
    }
    this.campaign.tenantId = this.selectedTenantId;
    this.campaign.portfolioId = this.selectedPortfolioId;
    this.campaign.subPortfolioId = this.selectedSubPortfolioId;
    if (this.startDateString) {
      this.campaign.startDate = this.startDateString;
    }
    if (this.endDateString) {
      this.campaign.endDate = this.endDateString;
    }
    this.loading = true;
    this.error = null;
    if (this.isEditMode && this.campaignId) {
      this.campaignService.updateCampaign(this.campaignId, this.campaign).subscribe({
        next: () => {
          this.saveFiltersAndNavigate(this.campaignId);
        },
        error: (err) => {
          console.error("Error updating campaign:", err);
          this.error = "Error al actualizar la campa\xF1a";
          this.loading = false;
        }
      });
    } else {
      this.campaignService.createCampaign(this.campaign).subscribe({
        next: (response) => {
          const newCampaignId = response.id || response;
          if (newCampaignId && this.campaignFilters.length > 0) {
            this.saveFiltersAndNavigate(newCampaignId);
          } else {
            this.router.navigate(["/admin/campaigns"]);
          }
        },
        error: (err) => {
          console.error("Error creating campaign:", err);
          this.error = "Error al crear la campa\xF1a";
          this.loading = false;
        }
      });
    }
  }
  saveFiltersAndNavigate(campaignId) {
    if (this.campaignFilters.length === 0) {
      this.campaignService.deleteAllFilters(campaignId).subscribe({
        next: () => this.router.navigate(["/admin/campaigns"]),
        error: () => this.router.navigate(["/admin/campaigns"])
      });
      return;
    }
    this.campaignService.saveCampaignFilters(campaignId, this.campaignFilters).subscribe({
      next: () => {
        console.log("Filtros guardados correctamente");
        this.router.navigate(["/admin/campaigns"]);
      },
      error: (err) => {
        console.error("Error guardando filtros:", err);
        this.router.navigate(["/admin/campaigns"]);
      }
    });
  }
  onCancel() {
    this.router.navigate(["/admin/campaigns"]);
  }
  /**
   * Convierte una fecha ISO string a formato datetime-local (YYYY-MM-DDTHH:mm)
   */
  toDateTimeLocal(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
};
_CampaignFormComponent.\u0275fac = function CampaignFormComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _CampaignFormComponent)(\u0275\u0275directiveInject(CampaignAdminService), \u0275\u0275directiveInject(TenantService), \u0275\u0275directiveInject(PortfolioService), \u0275\u0275directiveInject(Router), \u0275\u0275directiveInject(ActivatedRoute));
};
_CampaignFormComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _CampaignFormComponent, selectors: [["app-campaign-form"]], decls: 12, vars: 7, consts: [["noSubcartera", ""], [1, "campaign-form-container"], [1, "form-header"], [1, "header-icon", 3, "name", "size"], [1, "btn-back", 3, "click"], ["name", "arrow-left", 3, "size"], ["class", "error-message", 4, "ngIf"], ["class", "loading-state", 4, "ngIf"], ["class", "form-content", 3, "ngSubmit", 4, "ngIf"], [1, "error-message"], ["name", "x-circle", 3, "size"], [1, "loading-state"], [1, "spinner"], [1, "form-content", 3, "ngSubmit"], [1, "form-section"], ["name", "file-text", 3, "size"], [1, "form-group"], ["for", "name"], ["type", "text", "id", "name", "name", "name", "placeholder", "Ej: Campa\xF1a Cobranza Enero 2025", "required", "", 1, "form-input", 3, "ngModelChange", "ngModel"], ["for", "description"], ["id", "description", "name", "description", "placeholder", "Descripci\xF3n breve...", "rows", "2", 1, "form-textarea", 3, "ngModelChange", "ngModel"], [1, "form-row"], ["for", "startDate"], ["type", "datetime-local", "id", "startDate", "name", "startDate", 1, "form-input", 3, "ngModelChange", "ngModel"], ["for", "endDate"], ["type", "datetime-local", "id", "endDate", "name", "endDate", 1, "form-input", 3, "ngModelChange", "ngModel"], ["name", "building-2", 3, "size"], ["for", "tenant"], ["id", "tenant", "name", "tenant", "required", "", 1, "form-select", 3, "ngModelChange", "ngModel"], [3, "ngValue"], [3, "ngValue", 4, "ngFor", "ngForOf"], ["for", "portfolio"], ["id", "portfolio", "name", "portfolio", "required", "", 1, "form-select", 3, "ngModelChange", "ngModel", "disabled"], ["for", "subportfolio"], ["id", "subportfolio", "name", "subportfolio", "required", "", 1, "form-select", 3, "ngModelChange", "ngModel", "disabled"], ["name", "phone-call", 3, "size"], ["for", "dialMode"], ["id", "dialMode", "name", "dialMode", 1, "form-select", 3, "ngModelChange", "ngModel"], ["value", "MANUAL"], ["value", "PROGRESSIVE"], ["value", "PREDICTIVE"], ["for", "maxAttempts"], ["type", "number", "id", "maxAttempts", "name", "maxAttempts", "min", "1", "max", "10", 1, "form-input", 3, "ngModelChange", "ngModel"], ["for", "retryInterval"], ["type", "number", "id", "retryInterval", "name", "retryInterval", "min", "1", 1, "form-input", 3, "ngModelChange", "ngModel"], ["for", "intensidad"], ["type", "number", "id", "intensidad", "name", "intensidad", "min", "1", "max", "100", "placeholder", "50", 1, "form-input", 3, "ngModelChange", "ngModel"], ["name", "filter", 3, "size"], [4, "ngIf", "ngIfElse"], [1, "form-actions"], ["type", "button", 1, "btn-cancel", 3, "click"], ["type", "submit", 1, "btn-submit", 3, "disabled"], ["class", "filter-add-section", 4, "ngIf"], ["class", "no-fields-message", 4, "ngIf"], ["class", "filters-list", 4, "ngIf"], [1, "filter-add-section"], [1, "form-row", "filter-row"], ["for", "filterField"], ["id", "filterField", "name", "filterField", 1, "form-select", 3, "ngModelChange", "ngModel"], ["for", "minValue"], ["type", "number", "id", "minValue", "name", "minValue", "placeholder", "400", 1, "form-input", 3, "ngModelChange", "ngModel"], ["for", "maxValue"], ["type", "number", "id", "maxValue", "name", "maxValue", "placeholder", "1000", 1, "form-input", 3, "ngModelChange", "ngModel"], [1, "form-group", "filter-btn-group"], ["type", "button", 1, "btn-add-filter", 3, "click"], ["name", "plus", 3, "size"], [1, "no-fields-message"], ["name", "info", 3, "size"], [1, "filters-list"], [1, "filter-chips"], ["class", "filter-chip", 4, "ngFor", "ngForOf"], [1, "filter-chip"], [1, "filter-field"], [1, "filter-range"], [4, "ngIf"], ["type", "button", 1, "btn-remove-filter", 3, "click"], ["name", "x", 3, "size"], [1, "section-description"]], template: function CampaignFormComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 1)(1, "div", 2)(2, "h1");
    \u0275\u0275element(3, "lucide-angular", 3);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "button", 4);
    \u0275\u0275listener("click", function CampaignFormComponent_Template_button_click_5_listener() {
      return ctx.onCancel();
    });
    \u0275\u0275element(6, "lucide-angular", 5);
    \u0275\u0275elementStart(7, "span");
    \u0275\u0275text(8, "Volver");
    \u0275\u0275elementEnd()()();
    \u0275\u0275template(9, CampaignFormComponent_div_9_Template, 3, 2, "div", 6)(10, CampaignFormComponent_div_10_Template, 4, 1, "div", 7)(11, CampaignFormComponent_form_11_Template, 90, 27, "form", 8);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance(3);
    \u0275\u0275property("name", ctx.isEditMode ? "pencil" : "plus-circle")("size", 18);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx.isEditMode ? "Editar Campa\xF1a" : "Nueva Campa\xF1a", " ");
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 14);
    \u0275\u0275advance(3);
    \u0275\u0275property("ngIf", ctx.error);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.loading);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx.loading);
  }
}, dependencies: [CommonModule, NgForOf, NgIf, FormsModule, \u0275NgNoValidate, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, NumberValueAccessor, SelectControlValueAccessor, NgControlStatus, NgControlStatusGroup, RequiredValidator, MinValidator, MaxValidator, NgModel, NgForm, LucideAngularModule, LucideAngularComponent, DecimalPipe], styles: ["\n\n.campaign-form-container[_ngcontent-%COMP%] {\n  max-width: 1400px;\n  margin: 0 auto;\n  padding: 1rem 1.5rem !important;\n  min-height: 100vh;\n  background:\n    linear-gradient(\n      to bottom right,\n      #0f172a,\n      #1e293b,\n      #0f172a);\n}\n.form-header[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 1rem;\n}\n.form-header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  font-size: 1.3rem;\n  color: var(--text-primary);\n  margin: 0;\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n}\n.header-icon[_ngcontent-%COMP%] {\n  flex-shrink: 0;\n}\n.btn-back[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.4rem;\n  padding: 0.4rem 0.8rem;\n  background: var(--bg-tertiary);\n  border: 1px solid var(--border-color);\n  border-radius: 4px;\n  cursor: pointer;\n  font-size: 0.8rem;\n  color: var(--text-secondary);\n  transition: all 0.2s;\n}\n.btn-back[_ngcontent-%COMP%]:hover {\n  background: var(--bg-secondary);\n}\n.error-message[_ngcontent-%COMP%] {\n  background: #fee2e2;\n  border: 1px solid #fca5a5;\n  color: #991b1b;\n  padding: 0.6rem 1rem;\n  border-radius: 4px;\n  margin-bottom: 1rem;\n  display: flex;\n  align-items: center;\n  gap: 0.4rem;\n  font-size: 0.8rem;\n}\n.loading-state[_ngcontent-%COMP%] {\n  text-align: center;\n  padding: 2rem;\n}\n.spinner[_ngcontent-%COMP%] {\n  border: 2px solid #f3f4f6;\n  border-top: 2px solid #3b82f6;\n  border-radius: 50%;\n  width: 30px;\n  height: 30px;\n  animation: _ngcontent-%COMP%_spin 1s linear infinite;\n  margin: 0 auto 0.5rem;\n}\n@keyframes _ngcontent-%COMP%_spin {\n  0% {\n    transform: rotate(0deg);\n  }\n  100% {\n    transform: rotate(360deg);\n  }\n}\n.form-content[_ngcontent-%COMP%] {\n  background: var(--bg-card);\n  border-radius: 6px;\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 0;\n}\n.form-section[_ngcontent-%COMP%] {\n  padding: 1rem;\n  border-bottom: 1px solid var(--border-color);\n  border-right: 1px solid var(--border-color);\n}\n.form-section[_ngcontent-%COMP%]:nth-child(even) {\n  border-right: none;\n}\n.form-section[_ngcontent-%COMP%]:last-of-type, \n.form-section[_ngcontent-%COMP%]:nth-last-child(2):nth-child(odd) {\n  border-bottom: none;\n}\n.form-section[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  font-size: 0.9rem;\n  color: var(--text-primary);\n  margin: 0 0 0.8rem 0;\n  font-weight: 600;\n  display: flex;\n  align-items: center;\n  gap: 0.4rem;\n  padding-bottom: 0.5rem;\n  border-bottom: 1px solid var(--border-color);\n}\n.form-section[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]   lucide-angular[_ngcontent-%COMP%] {\n  opacity: 0.7;\n}\n.form-group[_ngcontent-%COMP%] {\n  margin-bottom: 0.8rem;\n}\n.form-group[_ngcontent-%COMP%]:last-child {\n  margin-bottom: 0;\n}\n.form-group[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  display: block;\n  font-weight: 500;\n  color: var(--text-secondary);\n  margin-bottom: 0.3rem;\n  font-size: 0.75rem;\n  text-transform: uppercase;\n  letter-spacing: 0.3px;\n}\n.form-input[_ngcontent-%COMP%], \n.form-select[_ngcontent-%COMP%], \n.form-textarea[_ngcontent-%COMP%] {\n  width: 100%;\n  padding: 0.5rem 0.6rem;\n  border: 1px solid var(--input-border);\n  background: var(--input-bg);\n  color: var(--text-primary);\n  border-radius: 4px;\n  font-size: 0.85rem;\n  transition: border-color 0.2s;\n}\n.form-input[_ngcontent-%COMP%]:focus, \n.form-select[_ngcontent-%COMP%]:focus, \n.form-textarea[_ngcontent-%COMP%]:focus {\n  outline: none;\n  border-color: #3b82f6;\n  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);\n}\n.form-input[_ngcontent-%COMP%]:disabled, \n.form-select[_ngcontent-%COMP%]:disabled {\n  background: var(--bg-tertiary);\n  color: var(--text-tertiary);\n  cursor: not-allowed;\n  opacity: 0.6;\n}\n.form-textarea[_ngcontent-%COMP%] {\n  resize: vertical;\n  min-height: 50px;\n}\n.form-group[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  display: block;\n  margin-top: 0.25rem;\n  color: var(--text-tertiary);\n  font-size: 0.7rem;\n}\n.form-row[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 0.8rem;\n}\n.form-actions[_ngcontent-%COMP%] {\n  grid-column: 1 / -1;\n  display: flex;\n  justify-content: flex-end;\n  gap: 0.8rem;\n  padding: 1rem;\n  background: var(--bg-secondary);\n  border-top: 1px solid var(--border-color);\n}\n.btn-cancel[_ngcontent-%COMP%], \n.btn-submit[_ngcontent-%COMP%] {\n  padding: 0.5rem 1.2rem;\n  border-radius: 4px;\n  font-weight: 500;\n  font-size: 0.85rem;\n  cursor: pointer;\n  transition: all 0.2s;\n  border: none;\n}\n.btn-cancel[_ngcontent-%COMP%] {\n  background: white;\n  color: #475569;\n  border: 1px solid #cbd5e1;\n}\n.btn-cancel[_ngcontent-%COMP%]:hover {\n  background: #f1f5f9;\n}\n.btn-submit[_ngcontent-%COMP%] {\n  background: #3b82f6;\n  color: white;\n}\n.btn-submit[_ngcontent-%COMP%]:hover {\n  background: #2563eb;\n}\n.btn-submit[_ngcontent-%COMP%]:disabled {\n  background: #93c5fd;\n  cursor: not-allowed;\n}\n.section-description[_ngcontent-%COMP%] {\n  color: var(--text-tertiary);\n  font-size: 0.75rem;\n  margin-bottom: 0.8rem;\n  line-height: 1.4;\n}\n.filter-add-section[_ngcontent-%COMP%] {\n  background: var(--bg-tertiary);\n  padding: 0.8rem;\n  border-radius: 6px;\n  margin-bottom: 0.8rem;\n}\n.filter-row[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 2fr 1fr 1fr auto;\n  gap: 0.6rem;\n  align-items: end;\n}\n.filter-btn-group[_ngcontent-%COMP%] {\n  margin-bottom: 0;\n}\n.btn-add-filter[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.3rem;\n  padding: 0.5rem 0.8rem;\n  background: #10b981;\n  color: white;\n  border: none;\n  border-radius: 4px;\n  cursor: pointer;\n  font-weight: 500;\n  font-size: 0.8rem;\n  transition: all 0.2s;\n  white-space: nowrap;\n}\n.btn-add-filter[_ngcontent-%COMP%]:hover {\n  background: #059669;\n}\n.no-fields-message[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.4rem;\n  color: var(--text-tertiary);\n  font-size: 0.8rem;\n  padding: 0.6rem;\n  background: var(--bg-tertiary);\n  border-radius: 4px;\n}\n.filters-list[_ngcontent-%COMP%] {\n  margin-top: 0.8rem;\n}\n.filters-list[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n  color: var(--text-secondary);\n  margin-bottom: 0.5rem;\n  font-weight: 500;\n  text-transform: uppercase;\n}\n.filter-chips[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.5rem;\n}\n.filter-chip[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.4rem;\n  padding: 0.35rem 0.6rem;\n  background:\n    linear-gradient(\n      135deg,\n      #3b82f6,\n      #2563eb);\n  border-radius: 14px;\n  font-size: 0.75rem;\n  color: white;\n}\n.filter-field[_ngcontent-%COMP%] {\n  font-weight: 500;\n}\n.filter-range[_ngcontent-%COMP%] {\n  background: rgba(255, 255, 255, 0.2);\n  padding: 0.1rem 0.4rem;\n  border-radius: 8px;\n  font-size: 0.7rem;\n}\n.btn-remove-filter[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 16px;\n  height: 16px;\n  background: rgba(255, 255, 255, 0.3);\n  border: none;\n  border-radius: 50%;\n  cursor: pointer;\n  transition: all 0.2s;\n  color: white;\n}\n.btn-remove-filter[_ngcontent-%COMP%]:hover {\n  background: #ef4444;\n}\n@media (max-width: 1024px) {\n  .form-content[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .form-section[_ngcontent-%COMP%] {\n    border-right: none;\n  }\n  .form-section[_ngcontent-%COMP%]:last-of-type {\n    border-bottom: none;\n  }\n}\n@media (max-width: 768px) {\n  .campaign-form-container[_ngcontent-%COMP%] {\n    padding: 0.8rem !important;\n  }\n  .form-row[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .filter-row[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .filter-btn-group[_ngcontent-%COMP%] {\n    margin-top: 0.4rem;\n  }\n  .btn-add-filter[_ngcontent-%COMP%] {\n    width: 100%;\n    justify-content: center;\n  }\n}\n/*# sourceMappingURL=campaign-form.component.css.map */"] });
var CampaignFormComponent = _CampaignFormComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CampaignFormComponent, [{
    type: Component,
    args: [{ selector: "app-campaign-form", standalone: true, imports: [CommonModule, FormsModule, LucideAngularModule], template: `<div class="campaign-form-container">\r
  <!-- Header -->\r
  <div class="form-header">\r
    <h1>\r
      <lucide-angular [name]="isEditMode ? 'pencil' : 'plus-circle'" [size]="18" class="header-icon"></lucide-angular>\r
      {{ isEditMode ? 'Editar Campa\xF1a' : 'Nueva Campa\xF1a' }}\r
    </h1>\r
    <button class="btn-back" (click)="onCancel()">\r
      <lucide-angular name="arrow-left" [size]="14"></lucide-angular>\r
      <span>Volver</span>\r
    </button>\r
  </div>\r
\r
  <!-- Error Message -->\r
  <div *ngIf="error" class="error-message">\r
    <lucide-angular name="x-circle" [size]="16"></lucide-angular>\r
    {{ error }}\r
  </div>\r
\r
  <!-- Loading State -->\r
  <div *ngIf="loading" class="loading-state">\r
    <div class="spinner"></div>\r
    <p>{{ isEditMode ? 'Cargando...' : 'Guardando...' }}</p>\r
  </div>\r
\r
  <!-- Form -->\r
  <form *ngIf="!loading" (ngSubmit)="onSubmit()" class="form-content">\r
\r
    <!-- Columna Izquierda: Informaci\xF3n B\xE1sica -->\r
    <div class="form-section">\r
      <h2>\r
        <lucide-angular name="file-text" [size]="16"></lucide-angular>\r
        Informaci\xF3n B\xE1sica\r
      </h2>\r
\r
      <div class="form-group">\r
        <label for="name">Nombre *</label>\r
        <input\r
          type="text"\r
          id="name"\r
          [(ngModel)]="campaign.name"\r
          name="name"\r
          placeholder="Ej: Campa\xF1a Cobranza Enero 2025"\r
          class="form-input"\r
          required>\r
      </div>\r
\r
      <div class="form-group">\r
        <label for="description">Descripci\xF3n</label>\r
        <textarea\r
          id="description"\r
          [(ngModel)]="campaign.description"\r
          name="description"\r
          placeholder="Descripci\xF3n breve..."\r
          class="form-textarea"\r
          rows="2"></textarea>\r
      </div>\r
\r
      <div class="form-row">\r
        <div class="form-group">\r
          <label for="startDate">Fecha Inicio</label>\r
          <input\r
            type="datetime-local"\r
            id="startDate"\r
            [(ngModel)]="startDateString"\r
            name="startDate"\r
            class="form-input">\r
        </div>\r
\r
        <div class="form-group">\r
          <label for="endDate">Fecha Fin</label>\r
          <input\r
            type="datetime-local"\r
            id="endDate"\r
            [(ngModel)]="endDateString"\r
            name="endDate"\r
            class="form-input">\r
        </div>\r
      </div>\r
    </div>\r
\r
    <!-- Columna Derecha: Asignaci\xF3n -->\r
    <div class="form-section">\r
      <h2>\r
        <lucide-angular name="building-2" [size]="16"></lucide-angular>\r
        Asignaci\xF3n\r
      </h2>\r
\r
      <div class="form-group">\r
        <label for="tenant">Proveedor *</label>\r
        <select\r
          id="tenant"\r
          [(ngModel)]="selectedTenantId"\r
          name="tenant"\r
          (ngModelChange)="onTenantChange()"\r
          class="form-select"\r
          required>\r
          <option [ngValue]="0">Seleccione...</option>\r
          <option *ngFor="let tenant of tenants" [ngValue]="tenant.id">\r
            {{ tenant.tenantCode }} - {{ tenant.tenantName }}\r
          </option>\r
        </select>\r
      </div>\r
\r
      <div class="form-row">\r
        <div class="form-group">\r
          <label for="portfolio">Cartera *</label>\r
          <select\r
            id="portfolio"\r
            [(ngModel)]="selectedPortfolioId"\r
            name="portfolio"\r
            (ngModelChange)="onPortfolioChange()"\r
            [disabled]="selectedTenantId === 0"\r
            class="form-select"\r
            required>\r
            <option [ngValue]="0">Seleccione...</option>\r
            <option *ngFor="let portfolio of portfolios" [ngValue]="portfolio.id">\r
              {{ portfolio.portfolioCode }} - {{ portfolio.portfolioName }}\r
            </option>\r
          </select>\r
        </div>\r
\r
        <div class="form-group">\r
          <label for="subportfolio">Subcartera *</label>\r
          <select\r
            id="subportfolio"\r
            [(ngModel)]="selectedSubPortfolioId"\r
            name="subportfolio"\r
            (ngModelChange)="onSubPortfolioChange()"\r
            [disabled]="selectedPortfolioId === 0"\r
            class="form-select"\r
            required>\r
            <option [ngValue]="0">Seleccione...</option>\r
            <option *ngFor="let sp of subPortfolios" [ngValue]="sp.id">\r
              {{ sp.subPortfolioCode }} - {{ sp.subPortfolioName }}\r
            </option>\r
          </select>\r
        </div>\r
      </div>\r
    </div>\r
\r
    <!-- Columna Izquierda: Configuraci\xF3n de Discado -->\r
    <div class="form-section">\r
      <h2>\r
        <lucide-angular name="phone-call" [size]="16"></lucide-angular>\r
        Configuraci\xF3n de Discado\r
      </h2>\r
\r
      <div class="form-row">\r
        <div class="form-group">\r
          <label for="dialMode">Modo</label>\r
          <select\r
            id="dialMode"\r
            [(ngModel)]="campaign.dialMode"\r
            name="dialMode"\r
            class="form-select">\r
            <option value="MANUAL">Manual</option>\r
            <option value="PROGRESSIVE">Progresivo</option>\r
            <option value="PREDICTIVE">Predictivo</option>\r
          </select>\r
        </div>\r
\r
        <div class="form-group">\r
          <label for="maxAttempts">Intentos M\xE1x.</label>\r
          <input\r
            type="number"\r
            id="maxAttempts"\r
            [(ngModel)]="campaign.maxAttempts"\r
            name="maxAttempts"\r
            class="form-input"\r
            min="1"\r
            max="10">\r
        </div>\r
      </div>\r
\r
      <div class="form-row">\r
        <div class="form-group">\r
          <label for="retryInterval">Intervalo (min)</label>\r
          <input\r
            type="number"\r
            id="retryInterval"\r
            [(ngModel)]="campaign.retryInterval"\r
            name="retryInterval"\r
            class="form-input"\r
            min="1">\r
        </div>\r
\r
        <div class="form-group">\r
          <label for="intensidad">Intensidad</label>\r
          <input\r
            type="number"\r
            id="intensidad"\r
            [(ngModel)]="campaign.intensidad"\r
            name="intensidad"\r
            class="form-input"\r
            min="1"\r
            max="100"\r
            placeholder="50">\r
          <small>Llamadas simult\xE1neas (1-100)</small>\r
        </div>\r
      </div>\r
    </div>\r
\r
    <!-- Columna Derecha: Filtros de Segmentaci\xF3n -->\r
    <div class="form-section">\r
      <h2>\r
        <lucide-angular name="filter" [size]="16"></lucide-angular>\r
        Filtros de Segmentaci\xF3n\r
      </h2>\r
\r
      <ng-container *ngIf="selectedSubPortfolioId > 0; else noSubcartera">\r
        <!-- Agregar nuevo filtro -->\r
        <div class="filter-add-section" *ngIf="filterableFields.length > 0">\r
          <div class="form-row filter-row">\r
            <div class="form-group">\r
              <label for="filterField">Campo</label>\r
              <select\r
                id="filterField"\r
                [(ngModel)]="selectedFieldId"\r
                name="filterField"\r
                class="form-select">\r
                <option [ngValue]="0">Seleccione...</option>\r
                <option *ngFor="let field of filterableFields" [ngValue]="field.id">\r
                  {{ field.fieldName }}\r
                </option>\r
              </select>\r
            </div>\r
\r
            <div class="form-group">\r
              <label for="minValue">M\xEDn</label>\r
              <input\r
                type="number"\r
                id="minValue"\r
                [(ngModel)]="newFilterMinValue"\r
                name="minValue"\r
                class="form-input"\r
                placeholder="400">\r
            </div>\r
\r
            <div class="form-group">\r
              <label for="maxValue">M\xE1x</label>\r
              <input\r
                type="number"\r
                id="maxValue"\r
                [(ngModel)]="newFilterMaxValue"\r
                name="maxValue"\r
                class="form-input"\r
                placeholder="1000">\r
            </div>\r
\r
            <div class="form-group filter-btn-group">\r
              <button type="button" class="btn-add-filter" (click)="addFilter()">\r
                <lucide-angular name="plus" [size]="14"></lucide-angular>\r
              </button>\r
            </div>\r
          </div>\r
        </div>\r
\r
        <div *ngIf="filterableFields.length === 0" class="no-fields-message">\r
          <lucide-angular name="info" [size]="14"></lucide-angular>\r
          Sin campos num\xE9ricos configurados.\r
        </div>\r
\r
        <!-- Lista de filtros agregados -->\r
        <div class="filters-list" *ngIf="campaignFilters.length > 0">\r
          <h3>Filtros activos:</h3>\r
          <div class="filter-chips">\r
            <div class="filter-chip" *ngFor="let filter of campaignFilters; let i = index">\r
              <span class="filter-field">{{ filter.fieldName }}</span>\r
              <span class="filter-range">\r
                <span *ngIf="filter.minValue !== undefined && filter.minValue !== null">\r
                  {{ filter.minValue | number }}\r
                </span>\r
                <span *ngIf="filter.minValue !== undefined && filter.maxValue !== undefined"> - </span>\r
                <span *ngIf="filter.maxValue !== undefined && filter.maxValue !== null">\r
                  {{ filter.maxValue | number }}\r
                </span>\r
              </span>\r
              <button type="button" class="btn-remove-filter" (click)="removeFilter(i)">\r
                <lucide-angular name="x" [size]="12"></lucide-angular>\r
              </button>\r
            </div>\r
          </div>\r
        </div>\r
      </ng-container>\r
\r
      <ng-template #noSubcartera>\r
        <p class="section-description">\r
          Selecciona una subcartera para ver los campos disponibles para filtrar.\r
        </p>\r
      </ng-template>\r
    </div>\r
\r
    <!-- Botones de Acci\xF3n (ocupa todo el ancho) -->\r
    <div class="form-actions">\r
      <button type="button" class="btn-cancel" (click)="onCancel()">\r
        Cancelar\r
      </button>\r
      <button type="submit" class="btn-submit" [disabled]="loading">\r
        {{ isEditMode ? 'Actualizar' : 'Crear Campa\xF1a' }}\r
      </button>\r
    </div>\r
  </form>\r
</div>\r
`, styles: ["/* src/app/features/admin/campaign-form/campaign-form.component.css */\n.campaign-form-container {\n  max-width: 1400px;\n  margin: 0 auto;\n  padding: 1rem 1.5rem !important;\n  min-height: 100vh;\n  background:\n    linear-gradient(\n      to bottom right,\n      #0f172a,\n      #1e293b,\n      #0f172a);\n}\n.form-header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 1rem;\n}\n.form-header h1 {\n  font-size: 1.3rem;\n  color: var(--text-primary);\n  margin: 0;\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n}\n.header-icon {\n  flex-shrink: 0;\n}\n.btn-back {\n  display: flex;\n  align-items: center;\n  gap: 0.4rem;\n  padding: 0.4rem 0.8rem;\n  background: var(--bg-tertiary);\n  border: 1px solid var(--border-color);\n  border-radius: 4px;\n  cursor: pointer;\n  font-size: 0.8rem;\n  color: var(--text-secondary);\n  transition: all 0.2s;\n}\n.btn-back:hover {\n  background: var(--bg-secondary);\n}\n.error-message {\n  background: #fee2e2;\n  border: 1px solid #fca5a5;\n  color: #991b1b;\n  padding: 0.6rem 1rem;\n  border-radius: 4px;\n  margin-bottom: 1rem;\n  display: flex;\n  align-items: center;\n  gap: 0.4rem;\n  font-size: 0.8rem;\n}\n.loading-state {\n  text-align: center;\n  padding: 2rem;\n}\n.spinner {\n  border: 2px solid #f3f4f6;\n  border-top: 2px solid #3b82f6;\n  border-radius: 50%;\n  width: 30px;\n  height: 30px;\n  animation: spin 1s linear infinite;\n  margin: 0 auto 0.5rem;\n}\n@keyframes spin {\n  0% {\n    transform: rotate(0deg);\n  }\n  100% {\n    transform: rotate(360deg);\n  }\n}\n.form-content {\n  background: var(--bg-card);\n  border-radius: 6px;\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 0;\n}\n.form-section {\n  padding: 1rem;\n  border-bottom: 1px solid var(--border-color);\n  border-right: 1px solid var(--border-color);\n}\n.form-section:nth-child(even) {\n  border-right: none;\n}\n.form-section:last-of-type,\n.form-section:nth-last-child(2):nth-child(odd) {\n  border-bottom: none;\n}\n.form-section h2 {\n  font-size: 0.9rem;\n  color: var(--text-primary);\n  margin: 0 0 0.8rem 0;\n  font-weight: 600;\n  display: flex;\n  align-items: center;\n  gap: 0.4rem;\n  padding-bottom: 0.5rem;\n  border-bottom: 1px solid var(--border-color);\n}\n.form-section h2 lucide-angular {\n  opacity: 0.7;\n}\n.form-group {\n  margin-bottom: 0.8rem;\n}\n.form-group:last-child {\n  margin-bottom: 0;\n}\n.form-group label {\n  display: block;\n  font-weight: 500;\n  color: var(--text-secondary);\n  margin-bottom: 0.3rem;\n  font-size: 0.75rem;\n  text-transform: uppercase;\n  letter-spacing: 0.3px;\n}\n.form-input,\n.form-select,\n.form-textarea {\n  width: 100%;\n  padding: 0.5rem 0.6rem;\n  border: 1px solid var(--input-border);\n  background: var(--input-bg);\n  color: var(--text-primary);\n  border-radius: 4px;\n  font-size: 0.85rem;\n  transition: border-color 0.2s;\n}\n.form-input:focus,\n.form-select:focus,\n.form-textarea:focus {\n  outline: none;\n  border-color: #3b82f6;\n  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);\n}\n.form-input:disabled,\n.form-select:disabled {\n  background: var(--bg-tertiary);\n  color: var(--text-tertiary);\n  cursor: not-allowed;\n  opacity: 0.6;\n}\n.form-textarea {\n  resize: vertical;\n  min-height: 50px;\n}\n.form-group small {\n  display: block;\n  margin-top: 0.25rem;\n  color: var(--text-tertiary);\n  font-size: 0.7rem;\n}\n.form-row {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 0.8rem;\n}\n.form-actions {\n  grid-column: 1 / -1;\n  display: flex;\n  justify-content: flex-end;\n  gap: 0.8rem;\n  padding: 1rem;\n  background: var(--bg-secondary);\n  border-top: 1px solid var(--border-color);\n}\n.btn-cancel,\n.btn-submit {\n  padding: 0.5rem 1.2rem;\n  border-radius: 4px;\n  font-weight: 500;\n  font-size: 0.85rem;\n  cursor: pointer;\n  transition: all 0.2s;\n  border: none;\n}\n.btn-cancel {\n  background: white;\n  color: #475569;\n  border: 1px solid #cbd5e1;\n}\n.btn-cancel:hover {\n  background: #f1f5f9;\n}\n.btn-submit {\n  background: #3b82f6;\n  color: white;\n}\n.btn-submit:hover {\n  background: #2563eb;\n}\n.btn-submit:disabled {\n  background: #93c5fd;\n  cursor: not-allowed;\n}\n.section-description {\n  color: var(--text-tertiary);\n  font-size: 0.75rem;\n  margin-bottom: 0.8rem;\n  line-height: 1.4;\n}\n.filter-add-section {\n  background: var(--bg-tertiary);\n  padding: 0.8rem;\n  border-radius: 6px;\n  margin-bottom: 0.8rem;\n}\n.filter-row {\n  display: grid;\n  grid-template-columns: 2fr 1fr 1fr auto;\n  gap: 0.6rem;\n  align-items: end;\n}\n.filter-btn-group {\n  margin-bottom: 0;\n}\n.btn-add-filter {\n  display: flex;\n  align-items: center;\n  gap: 0.3rem;\n  padding: 0.5rem 0.8rem;\n  background: #10b981;\n  color: white;\n  border: none;\n  border-radius: 4px;\n  cursor: pointer;\n  font-weight: 500;\n  font-size: 0.8rem;\n  transition: all 0.2s;\n  white-space: nowrap;\n}\n.btn-add-filter:hover {\n  background: #059669;\n}\n.no-fields-message {\n  display: flex;\n  align-items: center;\n  gap: 0.4rem;\n  color: var(--text-tertiary);\n  font-size: 0.8rem;\n  padding: 0.6rem;\n  background: var(--bg-tertiary);\n  border-radius: 4px;\n}\n.filters-list {\n  margin-top: 0.8rem;\n}\n.filters-list h3 {\n  font-size: 0.75rem;\n  color: var(--text-secondary);\n  margin-bottom: 0.5rem;\n  font-weight: 500;\n  text-transform: uppercase;\n}\n.filter-chips {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.5rem;\n}\n.filter-chip {\n  display: flex;\n  align-items: center;\n  gap: 0.4rem;\n  padding: 0.35rem 0.6rem;\n  background:\n    linear-gradient(\n      135deg,\n      #3b82f6,\n      #2563eb);\n  border-radius: 14px;\n  font-size: 0.75rem;\n  color: white;\n}\n.filter-field {\n  font-weight: 500;\n}\n.filter-range {\n  background: rgba(255, 255, 255, 0.2);\n  padding: 0.1rem 0.4rem;\n  border-radius: 8px;\n  font-size: 0.7rem;\n}\n.btn-remove-filter {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 16px;\n  height: 16px;\n  background: rgba(255, 255, 255, 0.3);\n  border: none;\n  border-radius: 50%;\n  cursor: pointer;\n  transition: all 0.2s;\n  color: white;\n}\n.btn-remove-filter:hover {\n  background: #ef4444;\n}\n@media (max-width: 1024px) {\n  .form-content {\n    grid-template-columns: 1fr;\n  }\n  .form-section {\n    border-right: none;\n  }\n  .form-section:last-of-type {\n    border-bottom: none;\n  }\n}\n@media (max-width: 768px) {\n  .campaign-form-container {\n    padding: 0.8rem !important;\n  }\n  .form-row {\n    grid-template-columns: 1fr;\n  }\n  .filter-row {\n    grid-template-columns: 1fr;\n  }\n  .filter-btn-group {\n    margin-top: 0.4rem;\n  }\n  .btn-add-filter {\n    width: 100%;\n    justify-content: center;\n  }\n}\n/*# sourceMappingURL=campaign-form.component.css.map */\n"] }]
  }], () => [{ type: CampaignAdminService }, { type: TenantService }, { type: PortfolioService }, { type: Router }, { type: ActivatedRoute }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(CampaignFormComponent, { className: "CampaignFormComponent", filePath: "src/app/features/admin/campaign-form/campaign-form.component.ts", lineNumber: 20 });
})();
export {
  CampaignFormComponent
};
//# sourceMappingURL=chunk-ZGWIM44Y.js.map
