import {
  AutoDialerService
} from "./chunk-32PRT2X7.js";
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
  Router,
  RouterLink,
  RouterModule
} from "./chunk-OCZLH7K5.js";
import "./chunk-ZQICQP3Y.js";
import {
  DefaultValueAccessor,
  FormsModule,
  MaxValidator,
  MinValidator,
  NgControlStatus,
  NgModel,
  NgSelectOption,
  NumberValueAccessor,
  RequiredValidator,
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
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassMap,
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
  ɵɵpureFunction1,
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

// src/app/features/admin/campaign-management/campaign-management.component.ts
var _c0 = (a0) => ["/admin/campaigns", a0, "edit"];
function CampaignManagementComponent_div_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 18);
    \u0275\u0275element(1, "lucide-angular", 19);
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
function CampaignManagementComponent_div_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 20);
    \u0275\u0275element(1, "lucide-angular", 21);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("size", 18);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.successMessage);
  }
}
function CampaignManagementComponent_div_21_div_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 25)(1, "p");
    \u0275\u0275element(2, "lucide-angular", 26);
    \u0275\u0275text(3, " No hay campa\xF1as creadas todav\xEDa");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "button", 27);
    \u0275\u0275listener("click", function CampaignManagementComponent_div_21_div_1_Template_button_click_4_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.openCreateModal());
    });
    \u0275\u0275text(5, "Crear Primera Campa\xF1a");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 20);
  }
}
function CampaignManagementComponent_div_21_div_2_button_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 49);
    \u0275\u0275listener("click", function CampaignManagementComponent_div_21_div_2_button_12_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r5);
      const campaign_r4 = \u0275\u0275nextContext().$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.activarCampaign(campaign_r4));
    });
    \u0275\u0275element(1, "lucide-angular", 50);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 16);
  }
}
function CampaignManagementComponent_div_21_div_2_button_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 51);
    \u0275\u0275listener("click", function CampaignManagementComponent_div_21_div_2_button_13_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r6);
      const campaign_r4 = \u0275\u0275nextContext().$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.pausarCampaign(campaign_r4));
    });
    \u0275\u0275element(1, "lucide-angular", 52);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 16);
  }
}
function CampaignManagementComponent_div_21_div_2_button_16_lucide_angular_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "lucide-angular", 56);
  }
  if (rf & 2) {
    \u0275\u0275property("size", 16);
  }
}
function CampaignManagementComponent_div_21_div_2_button_16_lucide_angular_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "lucide-angular", 57);
  }
  if (rf & 2) {
    \u0275\u0275property("size", 16);
  }
}
function CampaignManagementComponent_div_21_div_2_button_16_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 53);
    \u0275\u0275listener("click", function CampaignManagementComponent_div_21_div_2_button_16_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r7);
      const campaign_r4 = \u0275\u0275nextContext().$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.toggleDialing(campaign_r4));
    });
    \u0275\u0275template(1, CampaignManagementComponent_div_21_div_2_button_16_lucide_angular_1_Template, 1, 1, "lucide-angular", 54)(2, CampaignManagementComponent_div_21_div_2_button_16_lucide_angular_2_Template, 1, 1, "lucide-angular", 55);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const campaign_r4 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275classMap(campaign_r4.estaDiscando ? "btn-action-small btn-pause" : "btn-action-small btn-activate");
    \u0275\u0275property("title", campaign_r4.estaDiscando ? "Detener Discado" : "Iniciar Discado");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", campaign_r4.estaDiscando);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !campaign_r4.estaDiscando);
  }
}
function CampaignManagementComponent_div_21_div_2_button_17_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 58);
    \u0275\u0275listener("click", function CampaignManagementComponent_div_21_div_2_button_17_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r8);
      const campaign_r4 = \u0275\u0275nextContext().$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.deleteCampaign(campaign_r4));
    });
    \u0275\u0275element(1, "lucide-angular", 59);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 16);
  }
}
function CampaignManagementComponent_div_21_div_2_p_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 60);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const campaign_r4 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", campaign_r4.description, " ");
  }
}
function CampaignManagementComponent_div_21_div_2_div_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 61)(1, "div", 62)(2, "span", 63);
    \u0275\u0275text(3, "Total:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 64);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 62)(7, "span", 63);
    \u0275\u0275text(8, "Pendientes:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "span", 64);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "div", 62)(12, "span", 63);
    \u0275\u0275text(13, "Contactados:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "span", 64);
    \u0275\u0275text(15);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const campaign_r4 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(campaign_r4.totalContacts || 0);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(campaign_r4.pendingContacts || 0);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(campaign_r4.contactedContacts || 0);
  }
}
function CampaignManagementComponent_div_21_div_2_span_28_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 65);
    \u0275\u0275element(1, "lucide-angular", 66);
    \u0275\u0275text(2, " Discando ");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
  }
}
function CampaignManagementComponent_div_21_div_2_span_29_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "date");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const campaign_r4 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(2, 1, campaign_r4.createdAt, "short"));
  }
}
function CampaignManagementComponent_div_21_div_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 28)(1, "div", 29)(2, "div", 30);
    \u0275\u0275listener("click", function CampaignManagementComponent_div_21_div_2_Template_div_click_2_listener() {
      const campaign_r4 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.viewCampaignDetail(campaign_r4));
    });
    \u0275\u0275elementStart(3, "h3");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 31);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 32)(8, "button", 33);
    \u0275\u0275listener("click", function CampaignManagementComponent_div_21_div_2_Template_button_click_8_listener() {
      const campaign_r4 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.viewCampaignDetail(campaign_r4));
    });
    \u0275\u0275element(9, "lucide-angular", 34);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "button", 35);
    \u0275\u0275element(11, "lucide-angular", 36);
    \u0275\u0275elementEnd();
    \u0275\u0275template(12, CampaignManagementComponent_div_21_div_2_button_12_Template, 2, 1, "button", 37)(13, CampaignManagementComponent_div_21_div_2_button_13_Template, 2, 1, "button", 38);
    \u0275\u0275elementStart(14, "button", 39);
    \u0275\u0275listener("click", function CampaignManagementComponent_div_21_div_2_Template_button_click_14_listener() {
      const campaign_r4 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.openImportModal(campaign_r4));
    });
    \u0275\u0275element(15, "lucide-angular", 40);
    \u0275\u0275elementEnd();
    \u0275\u0275template(16, CampaignManagementComponent_div_21_div_2_button_16_Template, 3, 5, "button", 41)(17, CampaignManagementComponent_div_21_div_2_button_17_Template, 2, 1, "button", 42);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(18, "div", 43);
    \u0275\u0275template(19, CampaignManagementComponent_div_21_div_2_p_19_Template, 2, 1, "p", 44)(20, CampaignManagementComponent_div_21_div_2_div_20_Template, 16, 3, "div", 45);
    \u0275\u0275elementStart(21, "div", 46)(22, "span");
    \u0275\u0275text(23);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "span");
    \u0275\u0275text(25);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "span");
    \u0275\u0275text(27);
    \u0275\u0275elementEnd();
    \u0275\u0275template(28, CampaignManagementComponent_div_21_div_2_span_28_Template, 3, 1, "span", 47)(29, CampaignManagementComponent_div_21_div_2_span_29_Template, 3, 4, "span", 48);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const campaign_r4 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(campaign_r4.name);
    \u0275\u0275advance();
    \u0275\u0275styleProp("background-color", ctx_r0.getStatusColor(campaign_r4.status));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.getStatusText(campaign_r4.status), " ");
    \u0275\u0275advance(3);
    \u0275\u0275property("size", 16);
    \u0275\u0275advance();
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(19, _c0, campaign_r4.id));
    \u0275\u0275advance();
    \u0275\u0275property("size", 16);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.canActivate(campaign_r4));
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.canPause(campaign_r4));
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 16);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", campaign_r4.status === "ACTIVE");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", campaign_r4.status === "DRAFT" || campaign_r4.status === "COMPLETED");
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", campaign_r4.description);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", campaign_r4.totalContacts !== void 0);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(campaign_r4.dialMode);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("Max: ", campaign_r4.maxAttempts);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("Intensidad: ", campaign_r4.intensidad || 50);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", campaign_r4.estaDiscando);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", campaign_r4.createdAt);
  }
}
function CampaignManagementComponent_div_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 22);
    \u0275\u0275template(1, CampaignManagementComponent_div_21_div_1_Template, 6, 1, "div", 23)(2, CampaignManagementComponent_div_21_div_2_Template, 30, 21, "div", 24);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.campaigns.length === 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r0.campaigns);
  }
}
function CampaignManagementComponent_div_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 67);
    \u0275\u0275element(1, "div", 68);
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3, "Cargando...");
    \u0275\u0275elementEnd()();
  }
}
function CampaignManagementComponent_div_23_option_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 80);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const tenant_r10 = ctx.$implicit;
    \u0275\u0275property("ngValue", tenant_r10.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2(" ", tenant_r10.tenantCode, " - ", tenant_r10.tenantName, " ");
  }
}
function CampaignManagementComponent_div_23_option_31_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 80);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const portfolio_r11 = ctx.$implicit;
    \u0275\u0275property("ngValue", portfolio_r11.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2(" ", portfolio_r11.portfolioCode, " - ", portfolio_r11.portfolioName, " ");
  }
}
function CampaignManagementComponent_div_23_option_38_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 80);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const sp_r12 = ctx.$implicit;
    \u0275\u0275property("ngValue", sp_r12.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2(" ", sp_r12.subPortfolioCode, " - ", sp_r12.subPortfolioName, " ");
  }
}
function CampaignManagementComponent_div_23_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 69);
    \u0275\u0275listener("click", function CampaignManagementComponent_div_23_Template_div_click_0_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.closeCreateModal());
    });
    \u0275\u0275elementStart(1, "div", 70);
    \u0275\u0275listener("click", function CampaignManagementComponent_div_23_Template_div_click_1_listener($event) {
      \u0275\u0275restoreView(_r9);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275elementStart(2, "div", 71)(3, "h2");
    \u0275\u0275element(4, "lucide-angular", 9);
    \u0275\u0275text(5, " Nueva Campa\xF1a");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "button", 72);
    \u0275\u0275listener("click", function CampaignManagementComponent_div_23_Template_button_click_6_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.closeCreateModal());
    });
    \u0275\u0275element(7, "lucide-angular", 73);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "div", 74)(9, "div", 75)(10, "label");
    \u0275\u0275text(11, "Nombre de la Campa\xF1a *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "input", 76);
    \u0275\u0275twoWayListener("ngModelChange", function CampaignManagementComponent_div_23_Template_input_ngModelChange_12_listener($event) {
      \u0275\u0275restoreView(_r9);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.newCampaign.name, $event) || (ctx_r0.newCampaign.name = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "div", 75)(14, "label");
    \u0275\u0275text(15, "Descripci\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "textarea", 77);
    \u0275\u0275twoWayListener("ngModelChange", function CampaignManagementComponent_div_23_Template_textarea_ngModelChange_16_listener($event) {
      \u0275\u0275restoreView(_r9);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.newCampaign.description, $event) || (ctx_r0.newCampaign.description = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(17, "div", 78)(18, "div", 75)(19, "label");
    \u0275\u0275text(20, "Proveedor (Inquilino) *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "select", 79);
    \u0275\u0275twoWayListener("ngModelChange", function CampaignManagementComponent_div_23_Template_select_ngModelChange_21_listener($event) {
      \u0275\u0275restoreView(_r9);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.selectedTenantId, $event) || (ctx_r0.selectedTenantId = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function CampaignManagementComponent_div_23_Template_select_ngModelChange_21_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.onTenantChange());
    });
    \u0275\u0275elementStart(22, "option", 80);
    \u0275\u0275text(23, "Seleccione un proveedor...");
    \u0275\u0275elementEnd();
    \u0275\u0275template(24, CampaignManagementComponent_div_23_option_24_Template, 2, 3, "option", 81);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(25, "div", 75)(26, "label");
    \u0275\u0275text(27, "Cartera *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "select", 82);
    \u0275\u0275twoWayListener("ngModelChange", function CampaignManagementComponent_div_23_Template_select_ngModelChange_28_listener($event) {
      \u0275\u0275restoreView(_r9);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.selectedPortfolioId, $event) || (ctx_r0.selectedPortfolioId = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function CampaignManagementComponent_div_23_Template_select_ngModelChange_28_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.onPortfolioChange());
    });
    \u0275\u0275elementStart(29, "option", 80);
    \u0275\u0275text(30, "Seleccione una cartera...");
    \u0275\u0275elementEnd();
    \u0275\u0275template(31, CampaignManagementComponent_div_23_option_31_Template, 2, 3, "option", 81);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(32, "div", 75)(33, "label");
    \u0275\u0275text(34, "Subcartera *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(35, "select", 82);
    \u0275\u0275twoWayListener("ngModelChange", function CampaignManagementComponent_div_23_Template_select_ngModelChange_35_listener($event) {
      \u0275\u0275restoreView(_r9);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.selectedSubPortfolioId, $event) || (ctx_r0.selectedSubPortfolioId = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(36, "option", 80);
    \u0275\u0275text(37, "Seleccione una subcartera...");
    \u0275\u0275elementEnd();
    \u0275\u0275template(38, CampaignManagementComponent_div_23_option_38_Template, 2, 3, "option", 81);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(39, "div", 78)(40, "div", 75)(41, "label");
    \u0275\u0275text(42, "Modo de Discado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(43, "select", 83);
    \u0275\u0275twoWayListener("ngModelChange", function CampaignManagementComponent_div_23_Template_select_ngModelChange_43_listener($event) {
      \u0275\u0275restoreView(_r9);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.newCampaign.dialMode, $event) || (ctx_r0.newCampaign.dialMode = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(44, "option", 84);
    \u0275\u0275text(45, "Manual");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(46, "option", 85);
    \u0275\u0275text(47, "Progresivo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(48, "option", 86);
    \u0275\u0275text(49, "Predictivo");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(50, "div", 75)(51, "label");
    \u0275\u0275text(52, "Intentos M\xE1ximos");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(53, "input", 87);
    \u0275\u0275twoWayListener("ngModelChange", function CampaignManagementComponent_div_23_Template_input_ngModelChange_53_listener($event) {
      \u0275\u0275restoreView(_r9);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.newCampaign.maxAttempts, $event) || (ctx_r0.newCampaign.maxAttempts = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(54, "div", 75)(55, "label");
    \u0275\u0275text(56, "Intensidad de Discado (1-100)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(57, "input", 88);
    \u0275\u0275twoWayListener("ngModelChange", function CampaignManagementComponent_div_23_Template_input_ngModelChange_57_listener($event) {
      \u0275\u0275restoreView(_r9);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.newCampaign.intensidad, $event) || (ctx_r0.newCampaign.intensidad = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(58, "small", 89);
    \u0275\u0275text(59, "N\xFAmero de llamadas simult\xE1neas por agente. Ejemplo: 50 con 10 agentes = 5 llamadas por agente.");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(60, "div", 90)(61, "button", 91);
    \u0275\u0275listener("click", function CampaignManagementComponent_div_23_Template_button_click_61_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.closeCreateModal());
    });
    \u0275\u0275text(62, "Cancelar");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(63, "button", 92);
    \u0275\u0275listener("click", function CampaignManagementComponent_div_23_Template_button_click_63_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.createCampaign());
    });
    \u0275\u0275text(64, "Crear Campa\xF1a");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275property("size", 20);
    \u0275\u0275advance(3);
    \u0275\u0275property("size", 18);
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.newCampaign.name);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.newCampaign.description);
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.selectedTenantId);
    \u0275\u0275advance();
    \u0275\u0275property("ngValue", 0);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngForOf", ctx_r0.tenants);
    \u0275\u0275advance(4);
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
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.newCampaign.dialMode);
    \u0275\u0275advance(10);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.newCampaign.maxAttempts);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.newCampaign.intensidad);
  }
}
function CampaignManagementComponent_div_24_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 69);
    \u0275\u0275listener("click", function CampaignManagementComponent_div_24_Template_div_click_0_listener() {
      \u0275\u0275restoreView(_r13);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.closeImportModal());
    });
    \u0275\u0275elementStart(1, "div", 70);
    \u0275\u0275listener("click", function CampaignManagementComponent_div_24_Template_div_click_1_listener($event) {
      \u0275\u0275restoreView(_r13);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275elementStart(2, "div", 71)(3, "h2");
    \u0275\u0275element(4, "lucide-angular", 40);
    \u0275\u0275text(5, " Importar Contactos");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "button", 72);
    \u0275\u0275listener("click", function CampaignManagementComponent_div_24_Template_button_click_6_listener() {
      \u0275\u0275restoreView(_r13);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.closeImportModal());
    });
    \u0275\u0275element(7, "lucide-angular", 73);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "div", 74)(9, "p")(10, "strong");
    \u0275\u0275text(11, "Campa\xF1a:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "div", 93)(14, "p");
    \u0275\u0275element(15, "lucide-angular", 94);
    \u0275\u0275text(16, " Los contactos se importar\xE1n desde: ");
    \u0275\u0275elementStart(17, "strong");
    \u0275\u0275text(18);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(19, "p");
    \u0275\u0275element(20, "lucide-angular", 95);
    \u0275\u0275text(21, " Clientes disponibles: ");
    \u0275\u0275elementStart(22, "strong");
    \u0275\u0275text(23);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(24, "p");
    \u0275\u0275element(25, "lucide-angular", 96);
    \u0275\u0275text(26, " Inquilino: ");
    \u0275\u0275elementStart(27, "strong");
    \u0275\u0275text(28);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(29, "p");
    \u0275\u0275element(30, "lucide-angular", 97);
    \u0275\u0275text(31, " Cartera: ");
    \u0275\u0275elementStart(32, "strong");
    \u0275\u0275text(33);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(34, "p");
    \u0275\u0275element(35, "lucide-angular", 98);
    \u0275\u0275text(36, " Subcartera: ");
    \u0275\u0275elementStart(37, "strong");
    \u0275\u0275text(38);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(39, "div", 99);
    \u0275\u0275element(40, "lucide-angular", 100);
    \u0275\u0275text(41, " Se importar\xE1n ");
    \u0275\u0275elementStart(42, "strong");
    \u0275\u0275text(43, "TODOS");
    \u0275\u0275elementEnd();
    \u0275\u0275text(44, " los clientes de esta cartera/subcartera autom\xE1ticamente. ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(45, "div", 90)(46, "button", 91);
    \u0275\u0275listener("click", function CampaignManagementComponent_div_24_Template_button_click_46_listener() {
      \u0275\u0275restoreView(_r13);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.closeImportModal());
    });
    \u0275\u0275text(47, "Cancelar");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(48, "button", 92);
    \u0275\u0275listener("click", function CampaignManagementComponent_div_24_Template_button_click_48_listener() {
      \u0275\u0275restoreView(_r13);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.importarContactos());
    });
    \u0275\u0275text(49, "Importar");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275property("size", 20);
    \u0275\u0275advance(3);
    \u0275\u0275property("size", 18);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1(" ", ctx_r0.selectedCampaign == null ? null : ctx_r0.selectedCampaign.name);
    \u0275\u0275advance(3);
    \u0275\u0275property("size", 16);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate((ctx_r0.importStats == null ? null : ctx_r0.importStats.fuenteDatos) || "cashi_db.clientes");
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 16);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate((ctx_r0.importStats == null ? null : ctx_r0.importStats.totalClientes) || 0);
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 16);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.importStats == null ? null : ctx_r0.importStats.inquilino);
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 16);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.importStats == null ? null : ctx_r0.importStats.cartera);
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 16);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.importStats == null ? null : ctx_r0.importStats.subcartera);
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 16);
  }
}
var _CampaignManagementComponent = class _CampaignManagementComponent {
  constructor(campaignService, autoDialerService, tenantService, portfolioService, router) {
    this.campaignService = campaignService;
    this.autoDialerService = autoDialerService;
    this.tenantService = tenantService;
    this.portfolioService = portfolioService;
    this.router = router;
    this.campaigns = [];
    this.loading = false;
    this.error = null;
    this.successMessage = null;
    this.showCreateModal = false;
    this.showImportModal = false;
    this.selectedCampaign = null;
    this.importStats = null;
    this.newCampaign = {
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
    this.tenants = [];
    this.portfolios = [];
    this.subPortfolios = [];
    this.selectedTenantId = 0;
    this.selectedPortfolioId = 0;
    this.selectedSubPortfolioId = 0;
    this.isAutoDialerActive = false;
    this.autoDialerLoading = false;
  }
  ngOnInit() {
    this.loadCampaigns();
    this.loadAutoDialerState();
    this.loadTenants();
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
    if (this.selectedPortfolioId > 0) {
      this.portfolioService.getSubPortfoliosByPortfolio(this.selectedPortfolioId).subscribe({
        next: (subPortfolios) => {
          this.subPortfolios = subPortfolios.filter((sp) => sp.isActive);
        },
        error: (err) => console.error("Error loading sub-portfolios:", err)
      });
    }
  }
  ngOnDestroy() {
    if (this.autoDialerSubscription) {
      this.autoDialerSubscription.unsubscribe();
    }
  }
  /**
   * Carga todas las campañas
   */
  loadCampaigns() {
    this.loading = true;
    this.error = null;
    this.campaignService.getAllCampaigns().subscribe({
      next: (campaigns) => {
        this.campaigns = campaigns;
        this.loading = false;
      },
      error: (err) => {
        console.error("Error loading campaigns:", err);
        this.error = "Error al cargar las campa\xF1as";
        this.loading = false;
      }
    });
  }
  /**
   * Carga estadísticas de importación para una campaña específica
   */
  loadImportStats(campaignId) {
    this.campaignService.getImportStats(campaignId).subscribe({
      next: (stats) => {
        this.importStats = stats;
      },
      error: (err) => {
        console.error("Error loading import stats:", err);
      }
    });
  }
  /**
   * Abre el modal para crear campaña
   */
  openCreateModal() {
    this.newCampaign = {
      name: "",
      description: "",
      status: "DRAFT",
      dialMode: "PROGRESSIVE",
      maxAttempts: 3,
      retryInterval: 60,
      intensidad: 50
    };
    this.showCreateModal = true;
  }
  /**
   * Cierra el modal de crear
   */
  closeCreateModal() {
    this.showCreateModal = false;
  }
  /**
   * Crea una nueva campaña
   */
  createCampaign() {
    if (!this.newCampaign.name) {
      this.error = "El nombre de la campa\xF1a es requerido";
      return;
    }
    if (!this.selectedSubPortfolioId || this.selectedSubPortfolioId === 0) {
      this.error = "Debe seleccionar una subcartera";
      return;
    }
    this.newCampaign.tenantId = this.selectedTenantId;
    this.newCampaign.portfolioId = this.selectedPortfolioId;
    this.newCampaign.subPortfolioId = this.selectedSubPortfolioId;
    this.loading = true;
    this.error = null;
    this.campaignService.createCampaign(this.newCampaign).subscribe({
      next: (response) => {
        this.successMessage = "Campa\xF1a creada exitosamente";
        this.showCreateModal = false;
        this.loadCampaigns();
        this.loading = false;
        setTimeout(() => {
          this.successMessage = null;
        }, 3e3);
      },
      error: (err) => {
        console.error("Error creating campaign:", err);
        this.error = "Error al crear la campa\xF1a";
        this.loading = false;
      }
    });
  }
  /**
   * Activa una campaña
   */
  activarCampaign(campaign) {
    if (!campaign.id)
      return;
    this.loading = true;
    this.error = null;
    this.campaignService.activarCampaign(campaign.id).subscribe({
      next: () => {
        this.successMessage = `Campa\xF1a "${campaign.name}" activada`;
        this.loadCampaigns();
        this.loading = false;
        setTimeout(() => {
          this.successMessage = null;
        }, 3e3);
      },
      error: (err) => {
        console.error("Error activating campaign:", err);
        this.error = err.error?.error || "Error al activar la campa\xF1a";
        this.loading = false;
      }
    });
  }
  /**
   * Pausa una campaña
   */
  pausarCampaign(campaign) {
    if (!campaign.id)
      return;
    this.loading = true;
    this.error = null;
    this.campaignService.pausarCampaign(campaign.id).subscribe({
      next: () => {
        this.successMessage = `Campa\xF1a "${campaign.name}" pausada`;
        this.loadCampaigns();
        this.loading = false;
        setTimeout(() => {
          this.successMessage = null;
        }, 3e3);
      },
      error: (err) => {
        console.error("Error pausing campaign:", err);
        this.error = "Error al pausar la campa\xF1a";
        this.loading = false;
      }
    });
  }
  /**
   * Abre modal de importación
   */
  openImportModal(campaign) {
    this.selectedCampaign = campaign;
    this.showImportModal = true;
    if (campaign.id) {
      this.loadImportStats(campaign.id);
    }
  }
  /**
   * Cierra modal de importación
   */
  closeImportModal() {
    this.showImportModal = false;
    this.selectedCampaign = null;
  }
  /**
   * Importa contactos a la campaña (ya sin límite, importa todos)
   */
  importarContactos() {
    if (!this.selectedCampaign?.id)
      return;
    this.loading = true;
    this.error = null;
    this.campaignService.importarContactos(this.selectedCampaign.id).subscribe({
      next: (response) => {
        this.successMessage = `${response.contactosImportados} contactos importados`;
        this.showImportModal = false;
        this.loadCampaigns();
        this.loading = false;
        setTimeout(() => {
          this.successMessage = null;
        }, 3e3);
      },
      error: (err) => {
        console.error("Error importing contacts:", err);
        this.error = "Error al importar contactos";
        this.loading = false;
      }
    });
  }
  /**
   * Elimina una campaña
   */
  deleteCampaign(campaign) {
    if (!campaign.id)
      return;
    if (!confirm(`\xBFEst\xE1s seguro de eliminar la campa\xF1a "${campaign.name}"?`)) {
      return;
    }
    this.loading = true;
    this.error = null;
    this.campaignService.deleteCampaign(campaign.id).subscribe({
      next: () => {
        this.successMessage = `Campa\xF1a "${campaign.name}" eliminada`;
        this.loadCampaigns();
        this.loading = false;
        setTimeout(() => {
          this.successMessage = null;
        }, 3e3);
      },
      error: (err) => {
        console.error("Error deleting campaign:", err);
        this.error = err.error?.error || "Error al eliminar la campa\xF1a";
        this.loading = false;
      }
    });
  }
  /**
   * Obtiene el color del estado
   */
  getStatusColor(status) {
    return this.campaignService.getStatusColor(status);
  }
  /**
   * Obtiene el texto del estado
   */
  getStatusText(status) {
    return this.campaignService.getStatusText(status);
  }
  /**
   * Verifica si puede activar la campaña
   */
  canActivate(campaign) {
    return campaign.status === "DRAFT" || campaign.status === "PAUSED";
  }
  /**
   * Verifica si puede pausar la campaña
   */
  canPause(campaign) {
    return campaign.status === "ACTIVE";
  }
  // ========================================
  // PER-CAMPAIGN DIALING METHODS
  // ========================================
  /**
   * Alterna el estado de discado de una campaña
   */
  toggleDialing(campaign) {
    if (campaign.estaDiscando) {
      this.stopDialing(campaign);
    } else {
      this.startDialing(campaign);
    }
  }
  /**
   * Inicia el discado automático para una campaña específica
   */
  startDialing(campaign) {
    if (!campaign.id)
      return;
    this.loading = true;
    this.error = null;
    this.campaignService.startDialing(campaign.id).subscribe({
      next: () => {
        this.successMessage = `Discado iniciado para "${campaign.name}"`;
        this.loadCampaigns();
        this.loading = false;
        setTimeout(() => {
          this.successMessage = null;
        }, 3e3);
      },
      error: (err) => {
        console.error("Error starting dialing:", err);
        this.error = err.error?.message || "Error al iniciar el discado";
        this.loading = false;
      }
    });
  }
  /**
   * Detiene el discado automático para una campaña específica
   */
  stopDialing(campaign) {
    if (!campaign.id)
      return;
    this.loading = true;
    this.error = null;
    this.campaignService.stopDialing(campaign.id).subscribe({
      next: () => {
        this.successMessage = `Discado detenido para "${campaign.name}"`;
        this.loadCampaigns();
        this.loading = false;
        setTimeout(() => {
          this.successMessage = null;
        }, 3e3);
      },
      error: (err) => {
        console.error("Error stopping dialing:", err);
        this.error = "Error al detener el discado";
        this.loading = false;
      }
    });
  }
  /**
   * Verifica si puede iniciar el discado
   */
  canStartDialing(campaign) {
    return campaign.status === "ACTIVE" && !campaign.estaDiscando;
  }
  /**
   * Verifica si puede detener el discado
   */
  canStopDialing(campaign) {
    return campaign.estaDiscando === true;
  }
  // ========================================
  // AUTO-DIALER METHODS (DEPRECATED)
  // ========================================
  /**
   * Carga el estado actual del auto-dialer
   */
  loadAutoDialerState() {
    this.autoDialerService.getEstado().subscribe({
      next: (response) => {
        this.isAutoDialerActive = response.activo;
      },
      error: (err) => {
        console.error("Error loading auto-dialer state:", err);
      }
    });
  }
  /**
   * Toggle auto-dialer (activar/desactivar)
   */
  toggleAutoDialer() {
    this.autoDialerLoading = true;
    this.autoDialerService.toggle("admin").subscribe({
      next: (response) => {
        this.autoDialerLoading = false;
        this.isAutoDialerActive = response.activo;
        console.log("Auto-Dialer toggled:", response.mensaje);
      },
      error: (err) => {
        console.error("Error toggling auto-dialer:", err);
        this.autoDialerLoading = false;
      }
    });
  }
  /**
   * Obtiene el texto del botón del auto-dialer
   */
  getAutoDialerButtonText() {
    if (this.autoDialerLoading)
      return "Procesando...";
    return this.isAutoDialerActive ? "PAUSAR DISCADO" : "INICIAR DISCADO";
  }
  /**
   * Obtiene el ícono del botón del auto-dialer
   */
  getAutoDialerButtonIcon() {
    return this.isAutoDialerActive ? "pause" : "play";
  }
  /**
   * Obtiene el color del botón del auto-dialer
   */
  getAutoDialerButtonClass() {
    return this.isAutoDialerActive ? "btn-pause" : "btn-activate";
  }
  /**
   * Navega al detalle de una campaña
   */
  viewCampaignDetail(campaign) {
    if (campaign.id) {
      this.router.navigate(["/admin/campaigns", campaign.id]);
    }
  }
  /**
   * Navega a la pantalla de monitoreo por campaña
   */
  navigateToMonitoring() {
    this.router.navigate(["/admin/campaign-monitoring"]);
  }
};
_CampaignManagementComponent.\u0275fac = function CampaignManagementComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _CampaignManagementComponent)(\u0275\u0275directiveInject(CampaignAdminService), \u0275\u0275directiveInject(AutoDialerService), \u0275\u0275directiveInject(TenantService), \u0275\u0275directiveInject(PortfolioService), \u0275\u0275directiveInject(Router));
};
_CampaignManagementComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _CampaignManagementComponent, selectors: [["app-campaign-management"]], decls: 25, vars: 9, consts: [[1, "campaign-container"], [1, "flex", "items-center", "gap-2", "mb-2"], [1, "w-8", "h-8", "bg-gradient-to-br", "from-purple-600", "to-purple-700", "rounded-lg", "flex", "items-center", "justify-center"], ["name", "clipboard-list", 1, "text-white", 3, "size"], [1, "text-lg", "font-bold", "text-white"], [1, "text-xs", "text-gray-400"], [1, "header"], [1, "header-actions"], ["routerLink", "/admin/campaigns/new", 1, "btn-create"], ["name", "plus-circle", 3, "size"], ["class", "error-message", 4, "ngIf"], ["class", "success-message", 4, "ngIf"], [1, "campaigns-section"], [1, "section-title"], ["name", "clipboard-list", 3, "size"], ["class", "campaigns-scrollable", 4, "ngIf"], ["class", "loading-state", 4, "ngIf"], ["class", "modal-overlay", 3, "click", 4, "ngIf"], [1, "error-message"], ["name", "x-circle", 3, "size"], [1, "success-message"], ["name", "check-circle", 3, "size"], [1, "campaigns-scrollable"], ["class", "empty-state", 4, "ngIf"], ["class", "campaign-card-compact", 4, "ngFor", "ngForOf"], [1, "empty-state"], ["name", "inbox", 3, "size"], [1, "btn-create", 3, "click"], [1, "campaign-card-compact"], [1, "campaign-header-compact"], [1, "campaign-title-compact", 2, "cursor", "pointer", 3, "click"], [1, "status-badge"], [1, "campaign-actions"], ["title", "Ver detalle", 1, "btn-action-small", "btn-view", 3, "click"], ["name", "eye", 3, "size"], ["title", "Editar campa\xF1a", 1, "btn-action-small", "btn-edit", 3, "routerLink"], ["name", "pencil", 3, "size"], ["class", "btn-action-small btn-activate", "title", "Activar campa\xF1a", 3, "click", 4, "ngIf"], ["class", "btn-action-small btn-pause", "title", "Pausar campa\xF1a", 3, "click", 4, "ngIf"], ["title", "Importar contactos", 1, "btn-action-small", "btn-import", 3, "click"], ["name", "download", 3, "size"], [3, "class", "title", "click", 4, "ngIf"], ["class", "btn-action-small btn-delete", "title", "Eliminar campa\xF1a", 3, "click", 4, "ngIf"], [1, "campaign-body-compact"], ["class", "campaign-description-compact", 4, "ngIf"], ["class", "campaign-stats-compact", 4, "ngIf"], [1, "campaign-meta-compact"], ["style", "color: green; font-weight: bold;", 4, "ngIf"], [4, "ngIf"], ["title", "Activar campa\xF1a", 1, "btn-action-small", "btn-activate", 3, "click"], ["name", "play", 3, "size"], ["title", "Pausar campa\xF1a", 1, "btn-action-small", "btn-pause", 3, "click"], ["name", "pause", 3, "size"], [3, "click", "title"], ["name", "square", 3, "size", 4, "ngIf"], ["name", "phone-call", 3, "size", 4, "ngIf"], ["name", "square", 3, "size"], ["name", "phone-call", 3, "size"], ["title", "Eliminar campa\xF1a", 1, "btn-action-small", "btn-delete", 3, "click"], ["name", "trash-2", 3, "size"], [1, "campaign-description-compact"], [1, "campaign-stats-compact"], [1, "stat-compact"], [1, "stat-label-compact"], [1, "stat-value-compact"], [2, "color", "green", "font-weight", "bold"], ["name", "activity", 2, "vertical-align", "middle", 3, "size"], [1, "loading-state"], [1, "spinner"], [1, "modal-overlay", 3, "click"], [1, "modal-content", 3, "click"], [1, "modal-header"], [1, "btn-close", 3, "click"], ["name", "x", 3, "size"], [1, "modal-body"], [1, "form-group"], ["type", "text", "placeholder", "Ej: Campa\xF1a Cobranza Enero 2025", "required", "", 1, "form-input", 3, "ngModelChange", "ngModel"], ["placeholder", "Descripci\xF3n de la campa\xF1a...", "rows", "3", 1, "form-textarea", 3, "ngModelChange", "ngModel"], [1, "form-row"], ["required", "", 1, "form-select", 3, "ngModelChange", "ngModel"], [3, "ngValue"], [3, "ngValue", 4, "ngFor", "ngForOf"], ["required", "", 1, "form-select", 3, "ngModelChange", "ngModel", "disabled"], [1, "form-select", 3, "ngModelChange", "ngModel"], ["value", "MANUAL"], ["value", "PROGRESSIVE"], ["value", "PREDICTIVE"], ["type", "number", "min", "1", "max", "10", 1, "form-input", 3, "ngModelChange", "ngModel"], ["type", "number", "min", "1", "max", "100", "placeholder", "50", 1, "form-input", 3, "ngModelChange", "ngModel"], [2, "color", "#666"], [1, "modal-footer"], [1, "btn-cancel", 3, "click"], [1, "btn-submit", 3, "click"], [1, "info-box"], ["name", "info", 3, "size"], ["name", "bar-chart-2", 3, "size"], ["name", "building-2", 3, "size"], ["name", "folder", 3, "size"], ["name", "folder-open", 3, "size"], [1, "alert", "alert-info"], ["name", "alert-triangle", 3, "size"]], template: function CampaignManagementComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2);
    \u0275\u0275element(3, "lucide-angular", 3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div")(5, "h1", 4);
    \u0275\u0275text(6, "Gesti\xF3n de Campa\xF1as");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p", 5);
    \u0275\u0275text(8, "Administraci\xF3n y configuraci\xF3n de campa\xF1as de marcaci\xF3n");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(9, "div", 6)(10, "div", 7)(11, "button", 8);
    \u0275\u0275element(12, "lucide-angular", 9);
    \u0275\u0275elementStart(13, "span");
    \u0275\u0275text(14, "Nueva Campa\xF1a");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275template(15, CampaignManagementComponent_div_15_Template, 3, 2, "div", 10)(16, CampaignManagementComponent_div_16_Template, 3, 2, "div", 11);
    \u0275\u0275elementStart(17, "div", 12)(18, "h2", 13);
    \u0275\u0275element(19, "lucide-angular", 14);
    \u0275\u0275text(20, " Campa\xF1as");
    \u0275\u0275elementEnd();
    \u0275\u0275template(21, CampaignManagementComponent_div_21_Template, 3, 2, "div", 15)(22, CampaignManagementComponent_div_22_Template, 4, 0, "div", 16);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(23, CampaignManagementComponent_div_23_Template, 65, 18, "div", 17)(24, CampaignManagementComponent_div_24_Template, 50, 14, "div", 17);
  }
  if (rf & 2) {
    \u0275\u0275advance(3);
    \u0275\u0275property("size", 16);
    \u0275\u0275advance(9);
    \u0275\u0275property("size", 18);
    \u0275\u0275advance(3);
    \u0275\u0275property("ngIf", ctx.error);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.successMessage);
    \u0275\u0275advance(3);
    \u0275\u0275property("size", 20);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", !ctx.loading);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.loading);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.showCreateModal);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.showImportModal);
  }
}, dependencies: [CommonModule, NgForOf, NgIf, FormsModule, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, NumberValueAccessor, SelectControlValueAccessor, NgControlStatus, RequiredValidator, MinValidator, MaxValidator, NgModel, RouterModule, RouterLink, LucideAngularModule, LucideAngularComponent, DatePipe], styles: ["/* src/app/features/admin/campaign-management/campaign-management.component.css */\n.campaign-container {\n  min-height: 100vh;\n  background:\n    linear-gradient(\n      to bottom right,\n      #0f172a,\n      #1e293b,\n      #0f172a);\n  padding: 1.5rem !important;\n  max-width: 1400px;\n  margin: 0 auto;\n}\n.header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 1.5rem;\n  padding-bottom: 1rem;\n  border-bottom: 1px solid #334155;\n}\n.header h1 {\n  margin: 0;\n  font-size: 1.5rem;\n  color: #ffffff;\n  font-weight: 600;\n}\n.header-actions {\n  display: flex;\n  align-items: center;\n  gap: 1rem;\n}\n.btn-create {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  background: #10B981;\n  color: white;\n  border: none;\n  padding: 0.7rem 1.5rem;\n  border-radius: 8px;\n  cursor: pointer;\n  font-size: 0.9rem;\n  font-weight: 600;\n  transition: all 0.3s;\n}\n.btn-create:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);\n  background: #059669;\n}\n.btn-monitoring {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  background: #3B82F6;\n  color: white;\n  border: none;\n  padding: 0.7rem 1.5rem;\n  border-radius: 8px;\n  cursor: pointer;\n  font-size: 0.9rem;\n  font-weight: 600;\n  transition: all 0.3s;\n}\n.btn-monitoring:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);\n  background: #2563EB;\n}\n.error-message,\n.success-message {\n  padding: 1rem;\n  border-radius: 8px;\n  margin-bottom: 1rem;\n  font-weight: 500;\n}\n.error-message {\n  background: rgba(239, 68, 68, 0.15);\n  color: #fca5a5;\n  border: 1px solid rgba(239, 68, 68, 0.3);\n}\n.success-message {\n  background: rgba(16, 185, 129, 0.15);\n  color: #6ee7b7;\n  border: 1px solid rgba(16, 185, 129, 0.3);\n}\n.metrics-panel {\n  background: #1E293B;\n  border: 1px solid #334155;\n  border-radius: 8px;\n  padding: 1rem;\n  margin-bottom: 1.5rem;\n}\n.metrics-panel h3 {\n  margin: 0 0 1rem 0;\n  font-size: 0.95rem;\n  color: #ffffff;\n  font-weight: 600;\n}\n.metrics-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));\n  gap: 0.8rem;\n}\n.metric-item {\n  background: #0A0E27;\n  border: 1px solid #334155;\n  border-radius: 6px;\n  padding: 0.7rem;\n  display: flex;\n  align-items: center;\n  gap: 0.7rem;\n  transition: transform 0.2s, box-shadow 0.2s;\n}\n.metric-item:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);\n}\n.metric-icon {\n  font-size: 1.5rem;\n  flex-shrink: 0;\n}\n.metric-info {\n  display: flex;\n  flex-direction: column;\n  min-width: 0;\n}\n.metric-value {\n  font-size: 1.3rem;\n  font-weight: 700;\n  color: #10B981;\n  line-height: 1.2;\n}\n.metric-label {\n  font-size: 0.7rem;\n  color: #94a3b8;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.campaigns-section {\n  display: flex;\n  flex-direction: column;\n  background: #1E293B;\n  border: 1px solid #334155;\n  border-radius: 8px;\n  overflow: hidden;\n  height: calc(100vh - 200px);\n  min-height: 600px;\n}\n.section-title {\n  margin: 0;\n  padding: 1rem;\n  font-size: 1.2rem;\n  color: #ffffff;\n  background: #0A0E27;\n  border-bottom: 1px solid #334155;\n}\n.campaigns-scrollable {\n  flex: 1;\n  overflow-y: auto;\n  padding: 1rem;\n  display: flex;\n  flex-direction: column;\n  gap: 0.8rem;\n}\n.campaigns-scrollable::-webkit-scrollbar {\n  width: 8px;\n}\n.campaigns-scrollable::-webkit-scrollbar-track {\n  background: #0A0E27;\n}\n.campaigns-scrollable::-webkit-scrollbar-thumb {\n  background: #334155;\n  border-radius: 4px;\n}\n.campaigns-scrollable::-webkit-scrollbar-thumb:hover {\n  background: #475569;\n}\n.empty-row td {\n  padding: 2rem 1rem;\n}\n.campaign-card-compact {\n  background: #0A0E27;\n  border: 1px solid #334155;\n  border-radius: 6px;\n  overflow: hidden;\n  transition: transform 0.2s, box-shadow 0.2s;\n}\n.campaign-card-compact:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);\n}\n.campaign-header-compact {\n  padding: 0.8rem;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  border-bottom: 1px solid #334155;\n}\n.campaign-title-compact {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  flex: 1;\n}\n.campaign-title-compact h3 {\n  margin: 0;\n  font-size: 0.9rem;\n  color: #ffffff;\n  font-weight: 600;\n}\n.status-badge {\n  padding: 0.2rem 0.6rem;\n  border-radius: 50px;\n  color: white;\n  font-size: 0.65rem;\n  font-weight: 600;\n  text-transform: uppercase;\n  white-space: nowrap;\n}\n.campaign-actions {\n  display: flex;\n  gap: 0.4rem;\n}\n.btn-action-small {\n  background: rgba(255, 255, 255, 0.1);\n  border: none;\n  padding: 0.4rem;\n  border-radius: 4px;\n  cursor: pointer;\n  font-size: 0.85rem;\n  transition: all 0.2s;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  min-width: 28px;\n  height: 28px;\n}\n.btn-action-small:hover {\n  transform: scale(1.1);\n}\n.btn-action {\n  background: rgba(255, 255, 255, 0.1);\n  border: none;\n  padding: 0.5rem;\n  border-radius: 6px;\n  cursor: pointer;\n  font-size: 1rem;\n  transition: all 0.3s;\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n}\n.btn-action:hover {\n  transform: scale(1.1);\n}\n.btn-action:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n.btn-activate {\n  background: #10B981;\n  color: white;\n  padding: 0.7rem 1.5rem;\n  font-weight: 600;\n}\n.btn-activate:hover {\n  background: #059669;\n  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);\n}\n.btn-pause {\n  background: #F59E0B;\n  color: white;\n  padding: 0.7rem 1.5rem;\n  font-weight: 600;\n}\n.btn-pause:hover {\n  background: #D97706;\n  box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4);\n}\n.btn-import:hover {\n  background: rgba(59, 130, 246, 0.2);\n}\n.btn-delete:hover {\n  background: rgba(239, 68, 68, 0.2);\n}\n.campaign-body-compact {\n  padding: 0.7rem 0.8rem;\n}\n.campaign-description-compact {\n  color: #94a3b8;\n  font-size: 0.75rem;\n  margin: 0 0 0.6rem 0;\n  line-height: 1.3;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  display: -webkit-box;\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n}\n.campaign-stats-compact {\n  display: flex;\n  gap: 0.8rem;\n  margin-bottom: 0.6rem;\n  padding: 0.5rem;\n  background: #1E293B;\n  border-radius: 4px;\n}\n.stat-compact {\n  display: flex;\n  flex-direction: column;\n  gap: 0.1rem;\n}\n.stat-label-compact {\n  font-size: 0.65rem;\n  color: #64748b;\n}\n.stat-value-compact {\n  font-size: 0.9rem;\n  font-weight: 600;\n  color: #10B981;\n}\n.campaign-meta-compact {\n  display: flex;\n  gap: 0.7rem;\n  font-size: 0.7rem;\n  color: #64748b;\n  flex-wrap: wrap;\n}\n.empty-state {\n  grid-column: 1 / -1;\n  text-align: center;\n  padding: 4rem 2rem;\n  color: #94a3b8;\n}\n.loading-state {\n  text-align: center;\n  padding: 4rem 2rem;\n  color: #94a3b8;\n}\n.spinner {\n  width: 50px;\n  height: 50px;\n  border: 4px solid #334155;\n  border-top-color: #10B981;\n  border-radius: 50%;\n  animation: spin 1s linear infinite;\n  margin: 0 auto 1rem;\n}\n@keyframes spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n.modal-overlay {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background: rgba(0, 0, 0, 0.8);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 1000;\n}\n.modal-content {\n  background: #1E293B;\n  border-radius: 12px;\n  width: 90%;\n  max-width: 600px;\n  max-height: 90vh;\n  overflow-y: auto;\n  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);\n}\n.modal-header {\n  padding: 1.5rem;\n  border-bottom: 1px solid #334155;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n.modal-header h2 {\n  margin: 0;\n  font-size: 1.3rem;\n  color: #ffffff;\n}\n.btn-close {\n  background: none;\n  border: none;\n  font-size: 1.5rem;\n  cursor: pointer;\n  color: #94a3b8;\n  transition: color 0.3s;\n}\n.btn-close:hover {\n  color: #ef4444;\n}\n.modal-body {\n  padding: 1.5rem;\n}\n.modal-footer {\n  padding: 1.5rem;\n  border-top: 1px solid #334155;\n  display: flex;\n  justify-content: flex-end;\n  gap: 1rem;\n}\n.form-group {\n  margin-bottom: 1rem;\n}\n.form-group label {\n  display: block;\n  margin-bottom: 0.5rem;\n  color: #ffffff;\n  font-weight: 500;\n  font-size: 0.9rem;\n}\n.form-group small {\n  display: block;\n  margin-top: 0.3rem;\n  color: #64748b;\n  font-size: 0.8rem;\n}\n.form-input,\n.form-textarea,\n.form-select {\n  width: 100%;\n  background: #0A0E27;\n  border: 1px solid #334155;\n  border-radius: 6px;\n  padding: 0.7rem;\n  color: #ffffff;\n  font-size: 0.9rem;\n  transition: border 0.3s;\n}\n.form-input:focus,\n.form-textarea:focus,\n.form-select:focus {\n  outline: none;\n  border-color: #10B981;\n}\n.form-row {\n  display: grid;\n  grid-template-columns: repeat(2, 1fr);\n  gap: 1rem;\n}\n.btn-cancel,\n.btn-submit {\n  padding: 0.7rem 1.5rem;\n  border: none;\n  border-radius: 6px;\n  cursor: pointer;\n  font-weight: 600;\n  transition: all 0.3s;\n}\n.btn-cancel {\n  background: #6B7280;\n  color: white;\n}\n.btn-cancel:hover {\n  background: #4B5563;\n}\n.btn-submit {\n  background: #10B981;\n  color: white;\n}\n.btn-submit:hover {\n  background: #059669;\n}\n.info-box {\n  background: rgba(59, 130, 246, 0.1);\n  border-left: 4px solid #3B82F6;\n  padding: 1rem;\n  border-radius: 4px;\n  margin-top: 1rem;\n}\n.info-box p {\n  margin: 0.3rem 0;\n  color: #94a3b8;\n  font-size: 0.85rem;\n}\n:root.light .campaign-container,\nbody.light-theme .campaign-container {\n  background:\n    linear-gradient(\n      to bottom right,\n      #f0f9ff,\n      #dbeafe,\n      #e0f2fe);\n}\n:root.light .header,\nbody.light-theme .header {\n  border-bottom-color: #cbd5e1;\n}\n:root.light .header h1,\nbody.light-theme .header h1 {\n  color: #0f172a;\n}\n:root.light .error-message,\nbody.light-theme .error-message {\n  background: #fef2f2;\n  color: #dc2626;\n  border-color: #fecaca;\n}\n:root.light .success-message,\nbody.light-theme .success-message {\n  background: #f0fdf4;\n  color: #16a34a;\n  border-color: #bbf7d0;\n}\n:root.light .metrics-panel,\nbody.light-theme .metrics-panel {\n  background: #ffffff;\n  border-color: #e2e8f0;\n}\n:root.light .metrics-panel h3,\nbody.light-theme .metrics-panel h3 {\n  color: #0f172a;\n}\n:root.light .metric-item,\nbody.light-theme .metric-item {\n  background: #f8fafc;\n  border-color: #cbd5e1;\n}\n:root.light .metric-item:hover,\nbody.light-theme .metric-item:hover {\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);\n}\n:root.light .metric-value,\nbody.light-theme .metric-value {\n  color: #16a34a;\n}\n:root.light .metric-label,\nbody.light-theme .metric-label {\n  color: #64748b;\n}\n:root.light .campaigns-section,\nbody.light-theme .campaigns-section {\n  background: #ffffff;\n  border-color: #e2e8f0;\n}\n:root.light .section-title,\nbody.light-theme .section-title {\n  color: #0f172a;\n  background: #f8fafc;\n  border-bottom-color: #cbd5e1;\n}\n:root.light .campaigns-scrollable::-webkit-scrollbar-track,\nbody.light-theme .campaigns-scrollable::-webkit-scrollbar-track {\n  background: #f8fafc;\n}\n:root.light .campaigns-scrollable::-webkit-scrollbar-thumb,\nbody.light-theme .campaigns-scrollable::-webkit-scrollbar-thumb {\n  background: #cbd5e1;\n}\n:root.light .campaigns-scrollable::-webkit-scrollbar-thumb:hover,\nbody.light-theme .campaigns-scrollable::-webkit-scrollbar-thumb:hover {\n  background: #94a3b8;\n}\n:root.light .campaign-card-compact,\nbody.light-theme .campaign-card-compact {\n  background: #ffffff;\n  border-color: #cbd5e1;\n}\n:root.light .campaign-card-compact:hover,\nbody.light-theme .campaign-card-compact:hover {\n  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);\n}\n:root.light .campaign-header-compact,\nbody.light-theme .campaign-header-compact {\n  border-bottom-color: #e2e8f0;\n}\n:root.light .campaign-title-compact h3,\nbody.light-theme .campaign-title-compact h3 {\n  color: #0f172a;\n}\n:root.light .btn-action-small,\nbody.light-theme .btn-action-small {\n  background: rgba(0, 0, 0, 0.05);\n}\n:root.light .btn-action-small:hover,\nbody.light-theme .btn-action-small:hover {\n  background: rgba(0, 0, 0, 0.1);\n}\n:root.light .campaign-description-compact,\nbody.light-theme .campaign-description-compact {\n  color: #475569;\n}\n:root.light .campaign-stats-compact,\nbody.light-theme .campaign-stats-compact {\n  background: #f8fafc;\n}\n:root.light .stat-label-compact,\nbody.light-theme .stat-label-compact {\n  color: #64748b;\n}\n:root.light .stat-value-compact,\nbody.light-theme .stat-value-compact {\n  color: #16a34a;\n}\n:root.light .campaign-meta-compact,\nbody.light-theme .campaign-meta-compact {\n  color: #64748b;\n}\n:root.light .empty-state,\n:root.light .loading-state,\nbody.light-theme .empty-state,\nbody.light-theme .loading-state {\n  color: #64748b;\n}\n:root.light .spinner,\nbody.light-theme .spinner {\n  border-color: #cbd5e1;\n  border-top-color: #16a34a;\n}\n:root.light .modal-overlay,\nbody.light-theme .modal-overlay {\n  background: rgba(0, 0, 0, 0.5);\n}\n:root.light .modal-content,\nbody.light-theme .modal-content {\n  background: #ffffff;\n}\n:root.light .modal-header,\nbody.light-theme .modal-header {\n  border-bottom-color: #e2e8f0;\n}\n:root.light .modal-header h2,\nbody.light-theme .modal-header h2 {\n  color: #0f172a;\n}\n:root.light .btn-close,\nbody.light-theme .btn-close {\n  color: #64748b;\n}\n:root.light .btn-close:hover,\nbody.light-theme .btn-close:hover {\n  color: #dc2626;\n}\n:root.light .modal-footer,\nbody.light-theme .modal-footer {\n  border-top-color: #e2e8f0;\n}\n:root.light .form-group label,\nbody.light-theme .form-group label {\n  color: #0f172a;\n}\n:root.light .form-group small,\nbody.light-theme .form-group small {\n  color: #64748b;\n}\n:root.light .form-input,\n:root.light .form-textarea,\n:root.light .form-select,\nbody.light-theme .form-input,\nbody.light-theme .form-textarea,\nbody.light-theme .form-select {\n  background: #ffffff;\n  border-color: #cbd5e1;\n  color: #0f172a;\n}\n:root.light .form-input:focus,\n:root.light .form-textarea:focus,\n:root.light .form-select:focus,\nbody.light-theme .form-input:focus,\nbody.light-theme .form-textarea:focus,\nbody.light-theme .form-select:focus {\n  border-color: #16a34a;\n}\n:root.light .info-box,\nbody.light-theme .info-box {\n  background: rgba(59, 130, 246, 0.05);\n  border-left-color: #3B82F6;\n}\n:root.light .info-box p,\nbody.light-theme .info-box p {\n  color: #475569;\n}\n@media (max-width: 1200px) {\n  .campaigns-section {\n    min-height: 400px;\n    max-height: 500px;\n  }\n  .metrics-grid {\n    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));\n  }\n}\n@media (max-width: 768px) {\n  .campaign-container {\n    padding: 1rem;\n  }\n  .header {\n    flex-direction: column;\n    align-items: flex-start;\n    gap: 1rem;\n  }\n  .header-actions {\n    width: 100%;\n    flex-direction: column;\n  }\n  .header-actions button {\n    width: 100%;\n  }\n  .form-row {\n    grid-template-columns: 1fr;\n  }\n  .metrics-grid {\n    grid-template-columns: repeat(2, 1fr);\n  }\n}\n@media (max-width: 480px) {\n  .campaign-container {\n    padding: 0.75rem;\n  }\n  .header h1 {\n    font-size: 1.25rem;\n  }\n  .btn-create,\n  .btn-monitoring {\n    font-size: 0.85rem;\n    padding: 0.6rem 1.2rem;\n  }\n  .metrics-grid {\n    grid-template-columns: 1fr;\n  }\n  .modal-content {\n    width: 95%;\n  }\n}\n.btn-create:focus-visible,\n.btn-monitoring:focus-visible,\n.btn-action:focus-visible,\n.btn-submit:focus-visible,\n.btn-cancel:focus-visible {\n  outline: 3px solid #10B981;\n  outline-offset: 2px;\n}\n@media (prefers-contrast: high) {\n  .campaign-card-compact,\n  .metric-item,\n  .metrics-panel,\n  .campaigns-section {\n    border-width: 2px;\n  }\n}\n@media (prefers-reduced-motion: reduce) {\n  .campaign-card-compact,\n  .metric-item,\n  .btn-create,\n  .btn-monitoring,\n  .btn-action,\n  .spinner {\n    transition: none;\n    animation: none;\n  }\n  .btn-create:hover,\n  .btn-monitoring:hover,\n  .btn-action:hover {\n    transform: none;\n  }\n}\n/*# sourceMappingURL=campaign-management.component.css.map */\n"], encapsulation: 2 });
var CampaignManagementComponent = _CampaignManagementComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CampaignManagementComponent, [{
    type: Component,
    args: [{ selector: "app-campaign-management", standalone: true, imports: [CommonModule, FormsModule, RouterModule, LucideAngularModule], encapsulation: ViewEncapsulation.None, template: `<div class="campaign-container">\r
  <!-- Header -->\r
  <div class="flex items-center gap-2 mb-2">\r
    <div class="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">\r
      <lucide-angular name="clipboard-list" [size]="16" class="text-white"></lucide-angular>\r
    </div>\r
    <div>\r
      <h1 class="text-lg font-bold text-white">Gesti\xF3n de Campa\xF1as</h1>\r
      <p class="text-xs text-gray-400">Administraci\xF3n y configuraci\xF3n de campa\xF1as de marcaci\xF3n</p>\r
    </div>\r
  </div>\r
\r
  <div class="header">\r
    <div class="header-actions">\r
      <!-- New Campaign Button -->\r
      <button class="btn-create" routerLink="/admin/campaigns/new">\r
        <lucide-angular name="plus-circle" [size]="18"></lucide-angular>\r
        <span>Nueva Campa\xF1a</span>\r
      </button>\r
    </div>\r
  </div>\r
\r
  <!-- Error / Success Messages -->\r
  <div *ngIf="error" class="error-message"><lucide-angular name="x-circle" [size]="18"></lucide-angular> {{ error }}</div>\r
  <div *ngIf="successMessage" class="success-message"><lucide-angular name="check-circle" [size]="18"></lucide-angular> {{ successMessage }}</div>\r
\r
  <!-- Campaigns List Section -->\r
  <div class="campaigns-section">\r
    <h2 class="section-title"><lucide-angular name="clipboard-list" [size]="20"></lucide-angular> Campa\xF1as</h2>\r
\r
    <!-- Campaigns List -->\r
    <div class="campaigns-scrollable" *ngIf="!loading">\r
      <div *ngIf="campaigns.length === 0" class="empty-state">\r
        <p><lucide-angular name="inbox" [size]="20"></lucide-angular> No hay campa\xF1as creadas todav\xEDa</p>\r
        <button class="btn-create" (click)="openCreateModal()">Crear Primera Campa\xF1a</button>\r
      </div>\r
\r
      <div *ngFor="let campaign of campaigns" class="campaign-card-compact">\r
        <div class="campaign-header-compact">\r
          <div class="campaign-title-compact" (click)="viewCampaignDetail(campaign)" style="cursor: pointer;">\r
            <h3>{{ campaign.name }}</h3>\r
            <span class="status-badge" [style.background-color]="getStatusColor(campaign.status)">\r
              {{ getStatusText(campaign.status) }}\r
            </span>\r
          </div>\r
          <div class="campaign-actions">\r
            <button\r
              class="btn-action-small btn-view"\r
              (click)="viewCampaignDetail(campaign)"\r
              title="Ver detalle">\r
              <lucide-angular name="eye" [size]="16"></lucide-angular>\r
            </button>\r
            <button\r
              class="btn-action-small btn-edit"\r
              [routerLink]="['/admin/campaigns', campaign.id, 'edit']"\r
              title="Editar campa\xF1a">\r
              <lucide-angular name="pencil" [size]="16"></lucide-angular>\r
            </button>\r
            <button\r
              *ngIf="canActivate(campaign)"\r
              class="btn-action-small btn-activate"\r
              (click)="activarCampaign(campaign)"\r
              title="Activar campa\xF1a">\r
              <lucide-angular name="play" [size]="16"></lucide-angular>\r
            </button>\r
            <button\r
              *ngIf="canPause(campaign)"\r
              class="btn-action-small btn-pause"\r
              (click)="pausarCampaign(campaign)"\r
              title="Pausar campa\xF1a">\r
              <lucide-angular name="pause" [size]="16"></lucide-angular>\r
            </button>\r
            <button\r
              class="btn-action-small btn-import"\r
              (click)="openImportModal(campaign)"\r
              title="Importar contactos">\r
              <lucide-angular name="download" [size]="16"></lucide-angular>\r
            </button>\r
            <button\r
              *ngIf="campaign.status === 'ACTIVE'"\r
              [class]="campaign.estaDiscando ? 'btn-action-small btn-pause' : 'btn-action-small btn-activate'"\r
              (click)="toggleDialing(campaign)"\r
              [title]="campaign.estaDiscando ? 'Detener Discado' : 'Iniciar Discado'">\r
              <lucide-angular *ngIf="campaign.estaDiscando" name="square" [size]="16"></lucide-angular>\r
              <lucide-angular *ngIf="!campaign.estaDiscando" name="phone-call" [size]="16"></lucide-angular>\r
            </button>\r
            <button\r
              *ngIf="campaign.status === 'DRAFT' || campaign.status === 'COMPLETED'"\r
              class="btn-action-small btn-delete"\r
              (click)="deleteCampaign(campaign)"\r
              title="Eliminar campa\xF1a">\r
              <lucide-angular name="trash-2" [size]="16"></lucide-angular>\r
            </button>\r
          </div>\r
        </div>\r
\r
        <div class="campaign-body-compact">\r
          <p *ngIf="campaign.description" class="campaign-description-compact">\r
            {{ campaign.description }}\r
          </p>\r
\r
          <div class="campaign-stats-compact" *ngIf="campaign.totalContacts !== undefined">\r
            <div class="stat-compact">\r
              <span class="stat-label-compact">Total:</span>\r
              <span class="stat-value-compact">{{ campaign.totalContacts || 0 }}</span>\r
            </div>\r
            <div class="stat-compact">\r
              <span class="stat-label-compact">Pendientes:</span>\r
              <span class="stat-value-compact">{{ campaign.pendingContacts || 0 }}</span>\r
            </div>\r
            <div class="stat-compact">\r
              <span class="stat-label-compact">Contactados:</span>\r
              <span class="stat-value-compact">{{ campaign.contactedContacts || 0 }}</span>\r
            </div>\r
          </div>\r
\r
          <div class="campaign-meta-compact">\r
            <span>{{ campaign.dialMode }}</span>\r
            <span>Max: {{ campaign.maxAttempts }}</span>\r
            <span>Intensidad: {{ campaign.intensidad || 50 }}</span>\r
            <span *ngIf="campaign.estaDiscando" style="color: green; font-weight: bold;">\r
              <lucide-angular name="activity" [size]="14" style="vertical-align: middle;"></lucide-angular> Discando\r
            </span>\r
            <span *ngIf="campaign.createdAt">{{ campaign.createdAt | date: 'short' }}</span>\r
          </div>\r
        </div>\r
      </div>\r
    </div>\r
\r
    <!-- Loading State -->\r
    <div *ngIf="loading" class="loading-state">\r
      <div class="spinner"></div>\r
      <p>Cargando...</p>\r
    </div>\r
  </div>\r
</div>\r
\r
<!-- Create Campaign Modal -->\r
<div *ngIf="showCreateModal" class="modal-overlay" (click)="closeCreateModal()">\r
  <div class="modal-content" (click)="$event.stopPropagation()">\r
    <div class="modal-header">\r
      <h2><lucide-angular name="plus-circle" [size]="20"></lucide-angular> Nueva Campa\xF1a</h2>\r
      <button class="btn-close" (click)="closeCreateModal()"><lucide-angular name="x" [size]="18"></lucide-angular></button>\r
    </div>\r
\r
    <div class="modal-body">\r
      <div class="form-group">\r
        <label>Nombre de la Campa\xF1a *</label>\r
        <input\r
          type="text"\r
          [(ngModel)]="newCampaign.name"\r
          placeholder="Ej: Campa\xF1a Cobranza Enero 2025"\r
          class="form-input"\r
          required>\r
      </div>\r
\r
      <div class="form-group">\r
        <label>Descripci\xF3n</label>\r
        <textarea\r
          [(ngModel)]="newCampaign.description"\r
          placeholder="Descripci\xF3n de la campa\xF1a..."\r
          class="form-textarea"\r
          rows="3"></textarea>\r
      </div>\r
\r
      <!-- Selectores en cascada: Inquilino \u2192 Cartera \u2192 Subcartera -->\r
      <div class="form-row">\r
        <div class="form-group">\r
          <label>Proveedor (Inquilino) *</label>\r
          <select [(ngModel)]="selectedTenantId" (ngModelChange)="onTenantChange()" class="form-select" required>\r
            <option [ngValue]="0">Seleccione un proveedor...</option>\r
            <option *ngFor="let tenant of tenants" [ngValue]="tenant.id">\r
              {{ tenant.tenantCode }} - {{ tenant.tenantName }}\r
            </option>\r
          </select>\r
        </div>\r
\r
        <div class="form-group">\r
          <label>Cartera *</label>\r
          <select [(ngModel)]="selectedPortfolioId" (ngModelChange)="onPortfolioChange()"\r
                  [disabled]="selectedTenantId === 0" class="form-select" required>\r
            <option [ngValue]="0">Seleccione una cartera...</option>\r
            <option *ngFor="let portfolio of portfolios" [ngValue]="portfolio.id">\r
              {{ portfolio.portfolioCode }} - {{ portfolio.portfolioName }}\r
            </option>\r
          </select>\r
        </div>\r
      </div>\r
\r
      <div class="form-group">\r
        <label>Subcartera *</label>\r
        <select [(ngModel)]="selectedSubPortfolioId"\r
                [disabled]="selectedPortfolioId === 0" class="form-select" required>\r
          <option [ngValue]="0">Seleccione una subcartera...</option>\r
          <option *ngFor="let sp of subPortfolios" [ngValue]="sp.id">\r
            {{ sp.subPortfolioCode }} - {{ sp.subPortfolioName }}\r
          </option>\r
        </select>\r
      </div>\r
\r
      <div class="form-row">\r
        <div class="form-group">\r
          <label>Modo de Discado</label>\r
          <select [(ngModel)]="newCampaign.dialMode" class="form-select">\r
            <option value="MANUAL">Manual</option>\r
            <option value="PROGRESSIVE">Progresivo</option>\r
            <option value="PREDICTIVE">Predictivo</option>\r
          </select>\r
        </div>\r
\r
        <div class="form-group">\r
          <label>Intentos M\xE1ximos</label>\r
          <input\r
            type="number"\r
            [(ngModel)]="newCampaign.maxAttempts"\r
            class="form-input"\r
            min="1"\r
            max="10">\r
        </div>\r
      </div>\r
\r
      <div class="form-group">\r
        <label>Intensidad de Discado (1-100)</label>\r
        <input\r
          type="number"\r
          [(ngModel)]="newCampaign.intensidad"\r
          class="form-input"\r
          min="1"\r
          max="100"\r
          placeholder="50">\r
        <small style="color: #666;">N\xFAmero de llamadas simult\xE1neas por agente. Ejemplo: 50 con 10 agentes = 5 llamadas por agente.</small>\r
      </div>\r
    </div>\r
\r
    <div class="modal-footer">\r
      <button class="btn-cancel" (click)="closeCreateModal()">Cancelar</button>\r
      <button class="btn-submit" (click)="createCampaign()">Crear Campa\xF1a</button>\r
    </div>\r
  </div>\r
</div>\r
\r
<!-- Import Contacts Modal -->\r
<div *ngIf="showImportModal" class="modal-overlay" (click)="closeImportModal()">\r
  <div class="modal-content" (click)="$event.stopPropagation()">\r
    <div class="modal-header">\r
      <h2><lucide-angular name="download" [size]="20"></lucide-angular> Importar Contactos</h2>\r
      <button class="btn-close" (click)="closeImportModal()"><lucide-angular name="x" [size]="18"></lucide-angular></button>\r
    </div>\r
\r
    <div class="modal-body">\r
      <p><strong>Campa\xF1a:</strong> {{ selectedCampaign?.name }}</p>\r
\r
      <div class="info-box">\r
        <p><lucide-angular name="info" [size]="16"></lucide-angular> Los contactos se importar\xE1n desde: <strong>{{ importStats?.fuenteDatos || 'cashi_db.clientes' }}</strong></p>\r
        <p><lucide-angular name="bar-chart-2" [size]="16"></lucide-angular> Clientes disponibles: <strong>{{ importStats?.totalClientes || 0 }}</strong></p>\r
        <p><lucide-angular name="building-2" [size]="16"></lucide-angular> Inquilino: <strong>{{ importStats?.inquilino }}</strong></p>\r
        <p><lucide-angular name="folder" [size]="16"></lucide-angular> Cartera: <strong>{{ importStats?.cartera }}</strong></p>\r
        <p><lucide-angular name="folder-open" [size]="16"></lucide-angular> Subcartera: <strong>{{ importStats?.subcartera }}</strong></p>\r
      </div>\r
\r
      <div class="alert alert-info">\r
        <lucide-angular name="alert-triangle" [size]="16"></lucide-angular> Se importar\xE1n <strong>TODOS</strong> los clientes de esta cartera/subcartera autom\xE1ticamente.\r
      </div>\r
    </div>\r
\r
    <div class="modal-footer">\r
      <button class="btn-cancel" (click)="closeImportModal()">Cancelar</button>\r
      <button class="btn-submit" (click)="importarContactos()">Importar</button>\r
    </div>\r
  </div>\r
</div>\r
`, styles: ["/* src/app/features/admin/campaign-management/campaign-management.component.css */\n.campaign-container {\n  min-height: 100vh;\n  background:\n    linear-gradient(\n      to bottom right,\n      #0f172a,\n      #1e293b,\n      #0f172a);\n  padding: 1.5rem !important;\n  max-width: 1400px;\n  margin: 0 auto;\n}\n.header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 1.5rem;\n  padding-bottom: 1rem;\n  border-bottom: 1px solid #334155;\n}\n.header h1 {\n  margin: 0;\n  font-size: 1.5rem;\n  color: #ffffff;\n  font-weight: 600;\n}\n.header-actions {\n  display: flex;\n  align-items: center;\n  gap: 1rem;\n}\n.btn-create {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  background: #10B981;\n  color: white;\n  border: none;\n  padding: 0.7rem 1.5rem;\n  border-radius: 8px;\n  cursor: pointer;\n  font-size: 0.9rem;\n  font-weight: 600;\n  transition: all 0.3s;\n}\n.btn-create:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);\n  background: #059669;\n}\n.btn-monitoring {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  background: #3B82F6;\n  color: white;\n  border: none;\n  padding: 0.7rem 1.5rem;\n  border-radius: 8px;\n  cursor: pointer;\n  font-size: 0.9rem;\n  font-weight: 600;\n  transition: all 0.3s;\n}\n.btn-monitoring:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);\n  background: #2563EB;\n}\n.error-message,\n.success-message {\n  padding: 1rem;\n  border-radius: 8px;\n  margin-bottom: 1rem;\n  font-weight: 500;\n}\n.error-message {\n  background: rgba(239, 68, 68, 0.15);\n  color: #fca5a5;\n  border: 1px solid rgba(239, 68, 68, 0.3);\n}\n.success-message {\n  background: rgba(16, 185, 129, 0.15);\n  color: #6ee7b7;\n  border: 1px solid rgba(16, 185, 129, 0.3);\n}\n.metrics-panel {\n  background: #1E293B;\n  border: 1px solid #334155;\n  border-radius: 8px;\n  padding: 1rem;\n  margin-bottom: 1.5rem;\n}\n.metrics-panel h3 {\n  margin: 0 0 1rem 0;\n  font-size: 0.95rem;\n  color: #ffffff;\n  font-weight: 600;\n}\n.metrics-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));\n  gap: 0.8rem;\n}\n.metric-item {\n  background: #0A0E27;\n  border: 1px solid #334155;\n  border-radius: 6px;\n  padding: 0.7rem;\n  display: flex;\n  align-items: center;\n  gap: 0.7rem;\n  transition: transform 0.2s, box-shadow 0.2s;\n}\n.metric-item:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);\n}\n.metric-icon {\n  font-size: 1.5rem;\n  flex-shrink: 0;\n}\n.metric-info {\n  display: flex;\n  flex-direction: column;\n  min-width: 0;\n}\n.metric-value {\n  font-size: 1.3rem;\n  font-weight: 700;\n  color: #10B981;\n  line-height: 1.2;\n}\n.metric-label {\n  font-size: 0.7rem;\n  color: #94a3b8;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.campaigns-section {\n  display: flex;\n  flex-direction: column;\n  background: #1E293B;\n  border: 1px solid #334155;\n  border-radius: 8px;\n  overflow: hidden;\n  height: calc(100vh - 200px);\n  min-height: 600px;\n}\n.section-title {\n  margin: 0;\n  padding: 1rem;\n  font-size: 1.2rem;\n  color: #ffffff;\n  background: #0A0E27;\n  border-bottom: 1px solid #334155;\n}\n.campaigns-scrollable {\n  flex: 1;\n  overflow-y: auto;\n  padding: 1rem;\n  display: flex;\n  flex-direction: column;\n  gap: 0.8rem;\n}\n.campaigns-scrollable::-webkit-scrollbar {\n  width: 8px;\n}\n.campaigns-scrollable::-webkit-scrollbar-track {\n  background: #0A0E27;\n}\n.campaigns-scrollable::-webkit-scrollbar-thumb {\n  background: #334155;\n  border-radius: 4px;\n}\n.campaigns-scrollable::-webkit-scrollbar-thumb:hover {\n  background: #475569;\n}\n.empty-row td {\n  padding: 2rem 1rem;\n}\n.campaign-card-compact {\n  background: #0A0E27;\n  border: 1px solid #334155;\n  border-radius: 6px;\n  overflow: hidden;\n  transition: transform 0.2s, box-shadow 0.2s;\n}\n.campaign-card-compact:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);\n}\n.campaign-header-compact {\n  padding: 0.8rem;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  border-bottom: 1px solid #334155;\n}\n.campaign-title-compact {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  flex: 1;\n}\n.campaign-title-compact h3 {\n  margin: 0;\n  font-size: 0.9rem;\n  color: #ffffff;\n  font-weight: 600;\n}\n.status-badge {\n  padding: 0.2rem 0.6rem;\n  border-radius: 50px;\n  color: white;\n  font-size: 0.65rem;\n  font-weight: 600;\n  text-transform: uppercase;\n  white-space: nowrap;\n}\n.campaign-actions {\n  display: flex;\n  gap: 0.4rem;\n}\n.btn-action-small {\n  background: rgba(255, 255, 255, 0.1);\n  border: none;\n  padding: 0.4rem;\n  border-radius: 4px;\n  cursor: pointer;\n  font-size: 0.85rem;\n  transition: all 0.2s;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  min-width: 28px;\n  height: 28px;\n}\n.btn-action-small:hover {\n  transform: scale(1.1);\n}\n.btn-action {\n  background: rgba(255, 255, 255, 0.1);\n  border: none;\n  padding: 0.5rem;\n  border-radius: 6px;\n  cursor: pointer;\n  font-size: 1rem;\n  transition: all 0.3s;\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n}\n.btn-action:hover {\n  transform: scale(1.1);\n}\n.btn-action:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n.btn-activate {\n  background: #10B981;\n  color: white;\n  padding: 0.7rem 1.5rem;\n  font-weight: 600;\n}\n.btn-activate:hover {\n  background: #059669;\n  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);\n}\n.btn-pause {\n  background: #F59E0B;\n  color: white;\n  padding: 0.7rem 1.5rem;\n  font-weight: 600;\n}\n.btn-pause:hover {\n  background: #D97706;\n  box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4);\n}\n.btn-import:hover {\n  background: rgba(59, 130, 246, 0.2);\n}\n.btn-delete:hover {\n  background: rgba(239, 68, 68, 0.2);\n}\n.campaign-body-compact {\n  padding: 0.7rem 0.8rem;\n}\n.campaign-description-compact {\n  color: #94a3b8;\n  font-size: 0.75rem;\n  margin: 0 0 0.6rem 0;\n  line-height: 1.3;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  display: -webkit-box;\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n}\n.campaign-stats-compact {\n  display: flex;\n  gap: 0.8rem;\n  margin-bottom: 0.6rem;\n  padding: 0.5rem;\n  background: #1E293B;\n  border-radius: 4px;\n}\n.stat-compact {\n  display: flex;\n  flex-direction: column;\n  gap: 0.1rem;\n}\n.stat-label-compact {\n  font-size: 0.65rem;\n  color: #64748b;\n}\n.stat-value-compact {\n  font-size: 0.9rem;\n  font-weight: 600;\n  color: #10B981;\n}\n.campaign-meta-compact {\n  display: flex;\n  gap: 0.7rem;\n  font-size: 0.7rem;\n  color: #64748b;\n  flex-wrap: wrap;\n}\n.empty-state {\n  grid-column: 1 / -1;\n  text-align: center;\n  padding: 4rem 2rem;\n  color: #94a3b8;\n}\n.loading-state {\n  text-align: center;\n  padding: 4rem 2rem;\n  color: #94a3b8;\n}\n.spinner {\n  width: 50px;\n  height: 50px;\n  border: 4px solid #334155;\n  border-top-color: #10B981;\n  border-radius: 50%;\n  animation: spin 1s linear infinite;\n  margin: 0 auto 1rem;\n}\n@keyframes spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n.modal-overlay {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background: rgba(0, 0, 0, 0.8);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 1000;\n}\n.modal-content {\n  background: #1E293B;\n  border-radius: 12px;\n  width: 90%;\n  max-width: 600px;\n  max-height: 90vh;\n  overflow-y: auto;\n  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);\n}\n.modal-header {\n  padding: 1.5rem;\n  border-bottom: 1px solid #334155;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n.modal-header h2 {\n  margin: 0;\n  font-size: 1.3rem;\n  color: #ffffff;\n}\n.btn-close {\n  background: none;\n  border: none;\n  font-size: 1.5rem;\n  cursor: pointer;\n  color: #94a3b8;\n  transition: color 0.3s;\n}\n.btn-close:hover {\n  color: #ef4444;\n}\n.modal-body {\n  padding: 1.5rem;\n}\n.modal-footer {\n  padding: 1.5rem;\n  border-top: 1px solid #334155;\n  display: flex;\n  justify-content: flex-end;\n  gap: 1rem;\n}\n.form-group {\n  margin-bottom: 1rem;\n}\n.form-group label {\n  display: block;\n  margin-bottom: 0.5rem;\n  color: #ffffff;\n  font-weight: 500;\n  font-size: 0.9rem;\n}\n.form-group small {\n  display: block;\n  margin-top: 0.3rem;\n  color: #64748b;\n  font-size: 0.8rem;\n}\n.form-input,\n.form-textarea,\n.form-select {\n  width: 100%;\n  background: #0A0E27;\n  border: 1px solid #334155;\n  border-radius: 6px;\n  padding: 0.7rem;\n  color: #ffffff;\n  font-size: 0.9rem;\n  transition: border 0.3s;\n}\n.form-input:focus,\n.form-textarea:focus,\n.form-select:focus {\n  outline: none;\n  border-color: #10B981;\n}\n.form-row {\n  display: grid;\n  grid-template-columns: repeat(2, 1fr);\n  gap: 1rem;\n}\n.btn-cancel,\n.btn-submit {\n  padding: 0.7rem 1.5rem;\n  border: none;\n  border-radius: 6px;\n  cursor: pointer;\n  font-weight: 600;\n  transition: all 0.3s;\n}\n.btn-cancel {\n  background: #6B7280;\n  color: white;\n}\n.btn-cancel:hover {\n  background: #4B5563;\n}\n.btn-submit {\n  background: #10B981;\n  color: white;\n}\n.btn-submit:hover {\n  background: #059669;\n}\n.info-box {\n  background: rgba(59, 130, 246, 0.1);\n  border-left: 4px solid #3B82F6;\n  padding: 1rem;\n  border-radius: 4px;\n  margin-top: 1rem;\n}\n.info-box p {\n  margin: 0.3rem 0;\n  color: #94a3b8;\n  font-size: 0.85rem;\n}\n:root.light .campaign-container,\nbody.light-theme .campaign-container {\n  background:\n    linear-gradient(\n      to bottom right,\n      #f0f9ff,\n      #dbeafe,\n      #e0f2fe);\n}\n:root.light .header,\nbody.light-theme .header {\n  border-bottom-color: #cbd5e1;\n}\n:root.light .header h1,\nbody.light-theme .header h1 {\n  color: #0f172a;\n}\n:root.light .error-message,\nbody.light-theme .error-message {\n  background: #fef2f2;\n  color: #dc2626;\n  border-color: #fecaca;\n}\n:root.light .success-message,\nbody.light-theme .success-message {\n  background: #f0fdf4;\n  color: #16a34a;\n  border-color: #bbf7d0;\n}\n:root.light .metrics-panel,\nbody.light-theme .metrics-panel {\n  background: #ffffff;\n  border-color: #e2e8f0;\n}\n:root.light .metrics-panel h3,\nbody.light-theme .metrics-panel h3 {\n  color: #0f172a;\n}\n:root.light .metric-item,\nbody.light-theme .metric-item {\n  background: #f8fafc;\n  border-color: #cbd5e1;\n}\n:root.light .metric-item:hover,\nbody.light-theme .metric-item:hover {\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);\n}\n:root.light .metric-value,\nbody.light-theme .metric-value {\n  color: #16a34a;\n}\n:root.light .metric-label,\nbody.light-theme .metric-label {\n  color: #64748b;\n}\n:root.light .campaigns-section,\nbody.light-theme .campaigns-section {\n  background: #ffffff;\n  border-color: #e2e8f0;\n}\n:root.light .section-title,\nbody.light-theme .section-title {\n  color: #0f172a;\n  background: #f8fafc;\n  border-bottom-color: #cbd5e1;\n}\n:root.light .campaigns-scrollable::-webkit-scrollbar-track,\nbody.light-theme .campaigns-scrollable::-webkit-scrollbar-track {\n  background: #f8fafc;\n}\n:root.light .campaigns-scrollable::-webkit-scrollbar-thumb,\nbody.light-theme .campaigns-scrollable::-webkit-scrollbar-thumb {\n  background: #cbd5e1;\n}\n:root.light .campaigns-scrollable::-webkit-scrollbar-thumb:hover,\nbody.light-theme .campaigns-scrollable::-webkit-scrollbar-thumb:hover {\n  background: #94a3b8;\n}\n:root.light .campaign-card-compact,\nbody.light-theme .campaign-card-compact {\n  background: #ffffff;\n  border-color: #cbd5e1;\n}\n:root.light .campaign-card-compact:hover,\nbody.light-theme .campaign-card-compact:hover {\n  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);\n}\n:root.light .campaign-header-compact,\nbody.light-theme .campaign-header-compact {\n  border-bottom-color: #e2e8f0;\n}\n:root.light .campaign-title-compact h3,\nbody.light-theme .campaign-title-compact h3 {\n  color: #0f172a;\n}\n:root.light .btn-action-small,\nbody.light-theme .btn-action-small {\n  background: rgba(0, 0, 0, 0.05);\n}\n:root.light .btn-action-small:hover,\nbody.light-theme .btn-action-small:hover {\n  background: rgba(0, 0, 0, 0.1);\n}\n:root.light .campaign-description-compact,\nbody.light-theme .campaign-description-compact {\n  color: #475569;\n}\n:root.light .campaign-stats-compact,\nbody.light-theme .campaign-stats-compact {\n  background: #f8fafc;\n}\n:root.light .stat-label-compact,\nbody.light-theme .stat-label-compact {\n  color: #64748b;\n}\n:root.light .stat-value-compact,\nbody.light-theme .stat-value-compact {\n  color: #16a34a;\n}\n:root.light .campaign-meta-compact,\nbody.light-theme .campaign-meta-compact {\n  color: #64748b;\n}\n:root.light .empty-state,\n:root.light .loading-state,\nbody.light-theme .empty-state,\nbody.light-theme .loading-state {\n  color: #64748b;\n}\n:root.light .spinner,\nbody.light-theme .spinner {\n  border-color: #cbd5e1;\n  border-top-color: #16a34a;\n}\n:root.light .modal-overlay,\nbody.light-theme .modal-overlay {\n  background: rgba(0, 0, 0, 0.5);\n}\n:root.light .modal-content,\nbody.light-theme .modal-content {\n  background: #ffffff;\n}\n:root.light .modal-header,\nbody.light-theme .modal-header {\n  border-bottom-color: #e2e8f0;\n}\n:root.light .modal-header h2,\nbody.light-theme .modal-header h2 {\n  color: #0f172a;\n}\n:root.light .btn-close,\nbody.light-theme .btn-close {\n  color: #64748b;\n}\n:root.light .btn-close:hover,\nbody.light-theme .btn-close:hover {\n  color: #dc2626;\n}\n:root.light .modal-footer,\nbody.light-theme .modal-footer {\n  border-top-color: #e2e8f0;\n}\n:root.light .form-group label,\nbody.light-theme .form-group label {\n  color: #0f172a;\n}\n:root.light .form-group small,\nbody.light-theme .form-group small {\n  color: #64748b;\n}\n:root.light .form-input,\n:root.light .form-textarea,\n:root.light .form-select,\nbody.light-theme .form-input,\nbody.light-theme .form-textarea,\nbody.light-theme .form-select {\n  background: #ffffff;\n  border-color: #cbd5e1;\n  color: #0f172a;\n}\n:root.light .form-input:focus,\n:root.light .form-textarea:focus,\n:root.light .form-select:focus,\nbody.light-theme .form-input:focus,\nbody.light-theme .form-textarea:focus,\nbody.light-theme .form-select:focus {\n  border-color: #16a34a;\n}\n:root.light .info-box,\nbody.light-theme .info-box {\n  background: rgba(59, 130, 246, 0.05);\n  border-left-color: #3B82F6;\n}\n:root.light .info-box p,\nbody.light-theme .info-box p {\n  color: #475569;\n}\n@media (max-width: 1200px) {\n  .campaigns-section {\n    min-height: 400px;\n    max-height: 500px;\n  }\n  .metrics-grid {\n    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));\n  }\n}\n@media (max-width: 768px) {\n  .campaign-container {\n    padding: 1rem;\n  }\n  .header {\n    flex-direction: column;\n    align-items: flex-start;\n    gap: 1rem;\n  }\n  .header-actions {\n    width: 100%;\n    flex-direction: column;\n  }\n  .header-actions button {\n    width: 100%;\n  }\n  .form-row {\n    grid-template-columns: 1fr;\n  }\n  .metrics-grid {\n    grid-template-columns: repeat(2, 1fr);\n  }\n}\n@media (max-width: 480px) {\n  .campaign-container {\n    padding: 0.75rem;\n  }\n  .header h1 {\n    font-size: 1.25rem;\n  }\n  .btn-create,\n  .btn-monitoring {\n    font-size: 0.85rem;\n    padding: 0.6rem 1.2rem;\n  }\n  .metrics-grid {\n    grid-template-columns: 1fr;\n  }\n  .modal-content {\n    width: 95%;\n  }\n}\n.btn-create:focus-visible,\n.btn-monitoring:focus-visible,\n.btn-action:focus-visible,\n.btn-submit:focus-visible,\n.btn-cancel:focus-visible {\n  outline: 3px solid #10B981;\n  outline-offset: 2px;\n}\n@media (prefers-contrast: high) {\n  .campaign-card-compact,\n  .metric-item,\n  .metrics-panel,\n  .campaigns-section {\n    border-width: 2px;\n  }\n}\n@media (prefers-reduced-motion: reduce) {\n  .campaign-card-compact,\n  .metric-item,\n  .btn-create,\n  .btn-monitoring,\n  .btn-action,\n  .spinner {\n    transition: none;\n    animation: none;\n  }\n  .btn-create:hover,\n  .btn-monitoring:hover,\n  .btn-action:hover {\n    transform: none;\n  }\n}\n/*# sourceMappingURL=campaign-management.component.css.map */\n"] }]
  }], () => [{ type: CampaignAdminService }, { type: AutoDialerService }, { type: TenantService }, { type: PortfolioService }, { type: Router }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(CampaignManagementComponent, { className: "CampaignManagementComponent", filePath: "src/app/features/admin/campaign-management/campaign-management.component.ts", lineNumber: 22 });
})();
export {
  CampaignManagementComponent
};
//# sourceMappingURL=chunk-YOECGJOA.js.map
