import {
  TenantService
} from "./chunk-RDUKPQZZ.js";
import {
  PortfolioService
} from "./chunk-K6HKS25L.js";
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
  NgForOf,
  NgIf,
  forkJoin,
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
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-CTRHJBBW.js";

// src/app/features/admin/campaign-form/campaign-form.component.ts
function CampaignFormComponent_div_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 8);
    \u0275\u0275element(1, "lucide-angular", 9);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("size", 20);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.error, " ");
  }
}
function CampaignFormComponent_div_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 10);
    \u0275\u0275element(1, "div", 11);
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.isEditMode ? "Cargando campa\xF1a..." : "Guardando...");
  }
}
function CampaignFormComponent_div_11_option_38_Template(rf, ctx) {
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
function CampaignFormComponent_div_11_option_45_Template(rf, ctx) {
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
function CampaignFormComponent_div_11_option_52_Template(rf, ctx) {
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
function CampaignFormComponent_div_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 12)(1, "form", 13);
    \u0275\u0275listener("ngSubmit", function CampaignFormComponent_div_11_Template_form_ngSubmit_1_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.onSubmit());
    });
    \u0275\u0275elementStart(2, "div", 14)(3, "h2");
    \u0275\u0275element(4, "lucide-angular", 15);
    \u0275\u0275text(5, " Informaci\xF3n B\xE1sica ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 16)(7, "label", 17);
    \u0275\u0275text(8, "Nombre de la Campa\xF1a *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "input", 18);
    \u0275\u0275twoWayListener("ngModelChange", function CampaignFormComponent_div_11_Template_input_ngModelChange_9_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.campaign.name, $event) || (ctx_r0.campaign.name = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "div", 16)(11, "label", 19);
    \u0275\u0275text(12, "Descripci\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "textarea", 20);
    \u0275\u0275twoWayListener("ngModelChange", function CampaignFormComponent_div_11_Template_textarea_ngModelChange_13_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.campaign.description, $event) || (ctx_r0.campaign.description = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "div", 21)(15, "div", 16)(16, "label", 22);
    \u0275\u0275text(17, "Fecha de Inicio");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "input", 23);
    \u0275\u0275twoWayListener("ngModelChange", function CampaignFormComponent_div_11_Template_input_ngModelChange_18_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.startDateString, $event) || (ctx_r0.startDateString = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "small");
    \u0275\u0275text(20, "Fecha y hora de inicio de la campa\xF1a");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(21, "div", 16)(22, "label", 24);
    \u0275\u0275text(23, "Fecha de Fin");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "input", 25);
    \u0275\u0275twoWayListener("ngModelChange", function CampaignFormComponent_div_11_Template_input_ngModelChange_24_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.endDateString, $event) || (ctx_r0.endDateString = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "small");
    \u0275\u0275text(26, "Fecha y hora de finalizaci\xF3n de la campa\xF1a");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(27, "div", 14)(28, "h2");
    \u0275\u0275element(29, "lucide-angular", 26);
    \u0275\u0275text(30, " Asignaci\xF3n ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "div", 21)(32, "div", 16)(33, "label", 27);
    \u0275\u0275text(34, "Proveedor (Inquilino) *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(35, "select", 28);
    \u0275\u0275twoWayListener("ngModelChange", function CampaignFormComponent_div_11_Template_select_ngModelChange_35_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.selectedTenantId, $event) || (ctx_r0.selectedTenantId = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function CampaignFormComponent_div_11_Template_select_ngModelChange_35_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.onTenantChange());
    });
    \u0275\u0275elementStart(36, "option", 29);
    \u0275\u0275text(37, "Seleccione un proveedor...");
    \u0275\u0275elementEnd();
    \u0275\u0275template(38, CampaignFormComponent_div_11_option_38_Template, 2, 3, "option", 30);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(39, "div", 16)(40, "label", 31);
    \u0275\u0275text(41, "Cartera *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(42, "select", 32);
    \u0275\u0275twoWayListener("ngModelChange", function CampaignFormComponent_div_11_Template_select_ngModelChange_42_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.selectedPortfolioId, $event) || (ctx_r0.selectedPortfolioId = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function CampaignFormComponent_div_11_Template_select_ngModelChange_42_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.onPortfolioChange());
    });
    \u0275\u0275elementStart(43, "option", 29);
    \u0275\u0275text(44, "Seleccione una cartera...");
    \u0275\u0275elementEnd();
    \u0275\u0275template(45, CampaignFormComponent_div_11_option_45_Template, 2, 3, "option", 30);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(46, "div", 16)(47, "label", 33);
    \u0275\u0275text(48, "Subcartera *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(49, "select", 34);
    \u0275\u0275twoWayListener("ngModelChange", function CampaignFormComponent_div_11_Template_select_ngModelChange_49_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.selectedSubPortfolioId, $event) || (ctx_r0.selectedSubPortfolioId = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(50, "option", 29);
    \u0275\u0275text(51, "Seleccione una subcartera...");
    \u0275\u0275elementEnd();
    \u0275\u0275template(52, CampaignFormComponent_div_11_option_52_Template, 2, 3, "option", 30);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(53, "div", 14)(54, "h2");
    \u0275\u0275element(55, "lucide-angular", 35);
    \u0275\u0275text(56, " Configuraci\xF3n de Discado ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(57, "div", 21)(58, "div", 16)(59, "label", 36);
    \u0275\u0275text(60, "Modo de Discado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(61, "select", 37);
    \u0275\u0275twoWayListener("ngModelChange", function CampaignFormComponent_div_11_Template_select_ngModelChange_61_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.campaign.dialMode, $event) || (ctx_r0.campaign.dialMode = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(62, "option", 38);
    \u0275\u0275text(63, "Manual");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(64, "option", 39);
    \u0275\u0275text(65, "Progresivo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(66, "option", 40);
    \u0275\u0275text(67, "Predictivo");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(68, "div", 16)(69, "label", 41);
    \u0275\u0275text(70, "Intentos M\xE1ximos");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(71, "input", 42);
    \u0275\u0275twoWayListener("ngModelChange", function CampaignFormComponent_div_11_Template_input_ngModelChange_71_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.campaign.maxAttempts, $event) || (ctx_r0.campaign.maxAttempts = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(72, "small");
    \u0275\u0275text(73, "N\xFAmero m\xE1ximo de intentos por contacto (1-10)");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(74, "div", 21)(75, "div", 16)(76, "label", 43);
    \u0275\u0275text(77, "Intervalo de Reintento (minutos)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(78, "input", 44);
    \u0275\u0275twoWayListener("ngModelChange", function CampaignFormComponent_div_11_Template_input_ngModelChange_78_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.campaign.retryInterval, $event) || (ctx_r0.campaign.retryInterval = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(79, "small");
    \u0275\u0275text(80, "Tiempo de espera entre reintentos");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(81, "div", 16)(82, "label", 45);
    \u0275\u0275text(83, "Intensidad de Discado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(84, "input", 46);
    \u0275\u0275twoWayListener("ngModelChange", function CampaignFormComponent_div_11_Template_input_ngModelChange_84_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.campaign.intensidad, $event) || (ctx_r0.campaign.intensidad = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(85, "small");
    \u0275\u0275text(86, "Llamadas simult\xE1neas por agente (1-100). Ej: 50 con 10 agentes = 5 llamadas/agente");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(87, "div", 47)(88, "button", 48);
    \u0275\u0275listener("click", function CampaignFormComponent_div_11_Template_button_click_88_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.onCancel());
    });
    \u0275\u0275text(89, " Cancelar ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(90, "button", 49);
    \u0275\u0275text(91);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275property("size", 20);
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.campaign.name);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.campaign.description);
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.startDateString);
    \u0275\u0275advance(6);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.endDateString);
    \u0275\u0275advance(5);
    \u0275\u0275property("size", 20);
    \u0275\u0275advance(6);
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
    \u0275\u0275advance(3);
    \u0275\u0275property("size", 20);
    \u0275\u0275advance(6);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.campaign.dialMode);
    \u0275\u0275advance(10);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.campaign.maxAttempts);
    \u0275\u0275advance(7);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.campaign.retryInterval);
    \u0275\u0275advance(6);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.campaign.intensidad);
    \u0275\u0275advance(6);
    \u0275\u0275property("disabled", ctx_r0.loading);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.isEditMode ? "Actualizar Campa\xF1a" : "Crear Campa\xF1a", " ");
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
    if (this.selectedPortfolioId > 0) {
      this.portfolioService.getSubPortfoliosByPortfolio(this.selectedPortfolioId).subscribe({
        next: (subPortfolios) => {
          this.subPortfolios = subPortfolios.filter((sp) => sp.isActive);
        },
        error: (err) => console.error("Error loading sub-portfolios:", err)
      });
    }
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
          this.router.navigate(["/admin/campaigns"]);
        },
        error: (err) => {
          console.error("Error updating campaign:", err);
          this.error = "Error al actualizar la campa\xF1a";
          this.loading = false;
        }
      });
    } else {
      this.campaignService.createCampaign(this.campaign).subscribe({
        next: () => {
          this.router.navigate(["/admin/campaigns"]);
        },
        error: (err) => {
          console.error("Error creating campaign:", err);
          this.error = "Error al crear la campa\xF1a";
          this.loading = false;
        }
      });
    }
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
_CampaignFormComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _CampaignFormComponent, selectors: [["app-campaign-form"]], decls: 12, vars: 7, consts: [[1, "campaign-form-container"], [1, "form-header"], [1, "header-icon", 3, "name", "size"], [1, "btn-back", 3, "click"], ["name", "arrow-left", 3, "size"], ["class", "error-message", 4, "ngIf"], ["class", "loading-state", 4, "ngIf"], ["class", "form-content", 4, "ngIf"], [1, "error-message"], ["name", "x-circle", 3, "size"], [1, "loading-state"], [1, "spinner"], [1, "form-content"], [3, "ngSubmit"], [1, "form-section"], ["name", "file-text", 3, "size"], [1, "form-group"], ["for", "name"], ["type", "text", "id", "name", "name", "name", "placeholder", "Ej: Campa\xF1a Cobranza Enero 2025", "required", "", 1, "form-input", 3, "ngModelChange", "ngModel"], ["for", "description"], ["id", "description", "name", "description", "placeholder", "Descripci\xF3n de la campa\xF1a...", "rows", "3", 1, "form-textarea", 3, "ngModelChange", "ngModel"], [1, "form-row"], ["for", "startDate"], ["type", "datetime-local", "id", "startDate", "name", "startDate", 1, "form-input", 3, "ngModelChange", "ngModel"], ["for", "endDate"], ["type", "datetime-local", "id", "endDate", "name", "endDate", 1, "form-input", 3, "ngModelChange", "ngModel"], ["name", "building-2", 3, "size"], ["for", "tenant"], ["id", "tenant", "name", "tenant", "required", "", 1, "form-select", 3, "ngModelChange", "ngModel"], [3, "ngValue"], [3, "ngValue", 4, "ngFor", "ngForOf"], ["for", "portfolio"], ["id", "portfolio", "name", "portfolio", "required", "", 1, "form-select", 3, "ngModelChange", "ngModel", "disabled"], ["for", "subportfolio"], ["id", "subportfolio", "name", "subportfolio", "required", "", 1, "form-select", 3, "ngModelChange", "ngModel", "disabled"], ["name", "phone-call", 3, "size"], ["for", "dialMode"], ["id", "dialMode", "name", "dialMode", 1, "form-select", 3, "ngModelChange", "ngModel"], ["value", "MANUAL"], ["value", "PROGRESSIVE"], ["value", "PREDICTIVE"], ["for", "maxAttempts"], ["type", "number", "id", "maxAttempts", "name", "maxAttempts", "min", "1", "max", "10", 1, "form-input", 3, "ngModelChange", "ngModel"], ["for", "retryInterval"], ["type", "number", "id", "retryInterval", "name", "retryInterval", "min", "1", 1, "form-input", 3, "ngModelChange", "ngModel"], ["for", "intensidad"], ["type", "number", "id", "intensidad", "name", "intensidad", "min", "1", "max", "100", "placeholder", "50", 1, "form-input", 3, "ngModelChange", "ngModel"], [1, "form-actions"], ["type", "button", 1, "btn-cancel", 3, "click"], ["type", "submit", 1, "btn-submit", 3, "disabled"]], template: function CampaignFormComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "h1");
    \u0275\u0275element(3, "lucide-angular", 2);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "button", 3);
    \u0275\u0275listener("click", function CampaignFormComponent_Template_button_click_5_listener() {
      return ctx.onCancel();
    });
    \u0275\u0275element(6, "lucide-angular", 4);
    \u0275\u0275elementStart(7, "span");
    \u0275\u0275text(8, "Volver");
    \u0275\u0275elementEnd()()();
    \u0275\u0275template(9, CampaignFormComponent_div_9_Template, 3, 2, "div", 5)(10, CampaignFormComponent_div_10_Template, 4, 1, "div", 6)(11, CampaignFormComponent_div_11_Template, 92, 24, "div", 7);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance(3);
    \u0275\u0275property("name", ctx.isEditMode ? "pencil" : "plus-circle")("size", 24);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx.isEditMode ? "Editar Campa\xF1a" : "Nueva Campa\xF1a", " ");
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 18);
    \u0275\u0275advance(3);
    \u0275\u0275property("ngIf", ctx.error);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.loading);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx.loading);
  }
}, dependencies: [CommonModule, NgForOf, NgIf, FormsModule, \u0275NgNoValidate, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, NumberValueAccessor, SelectControlValueAccessor, NgControlStatus, NgControlStatusGroup, RequiredValidator, MinValidator, MaxValidator, NgModel, NgForm, LucideAngularModule, LucideAngularComponent], styles: ["\n\n.campaign-form-container[_ngcontent-%COMP%] {\n  max-width: 1000px;\n  margin: 0 auto;\n  padding: 2rem !important;\n  min-height: 100vh;\n  background:\n    linear-gradient(\n      to bottom right,\n      #0f172a,\n      #1e293b,\n      #0f172a);\n}\n.form-header[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 2rem;\n}\n.form-header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  font-size: 1.8rem;\n  color: var(--text-primary);\n  margin: 0;\n  display: flex;\n  align-items: center;\n  gap: 0.75rem;\n}\n.header-icon[_ngcontent-%COMP%] {\n  flex-shrink: 0;\n}\n.btn-back[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  padding: 0.5rem 1rem;\n  background: var(--bg-tertiary);\n  border: 1px solid var(--border-color);\n  border-radius: 6px;\n  cursor: pointer;\n  font-size: 0.9rem;\n  color: var(--text-secondary);\n  transition: all 0.2s;\n}\n.btn-back[_ngcontent-%COMP%]:hover {\n  background: var(--bg-secondary);\n}\n.error-message[_ngcontent-%COMP%] {\n  background: #fee2e2;\n  border: 1px solid #fca5a5;\n  color: #991b1b;\n  padding: 1rem;\n  border-radius: 6px;\n  margin-bottom: 1.5rem;\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n}\n.loading-state[_ngcontent-%COMP%] {\n  text-align: center;\n  padding: 3rem;\n}\n.spinner[_ngcontent-%COMP%] {\n  border: 3px solid #f3f4f6;\n  border-top: 3px solid #3b82f6;\n  border-radius: 50%;\n  width: 40px;\n  height: 40px;\n  animation: _ngcontent-%COMP%_spin 1s linear infinite;\n  margin: 0 auto 1rem;\n}\n@keyframes _ngcontent-%COMP%_spin {\n  0% {\n    transform: rotate(0deg);\n  }\n  100% {\n    transform: rotate(360deg);\n  }\n}\n.form-content[_ngcontent-%COMP%] {\n  background: var(--bg-card);\n  border-radius: 8px;\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);\n}\n.form-section[_ngcontent-%COMP%] {\n  padding: 1.5rem;\n  border-bottom: 1px solid var(--border-color);\n}\n.form-section[_ngcontent-%COMP%]:last-of-type {\n  border-bottom: none;\n}\n.form-section[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  font-size: 1.2rem;\n  color: var(--text-primary);\n  margin: 0 0 1.5rem 0;\n  font-weight: 600;\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n}\n.form-group[_ngcontent-%COMP%] {\n  margin-bottom: 1.5rem;\n}\n.form-group[_ngcontent-%COMP%]:last-child {\n  margin-bottom: 0;\n}\n.form-group[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  display: block;\n  font-weight: 500;\n  color: var(--text-secondary);\n  margin-bottom: 0.5rem;\n  font-size: 0.9rem;\n}\n.form-input[_ngcontent-%COMP%], \n.form-select[_ngcontent-%COMP%], \n.form-textarea[_ngcontent-%COMP%] {\n  width: 100%;\n  padding: 0.75rem;\n  border: 1px solid var(--input-border);\n  background: var(--input-bg);\n  color: var(--text-primary);\n  border-radius: 6px;\n  font-size: 0.95rem;\n  transition: border-color 0.2s;\n}\n.form-input[_ngcontent-%COMP%]:focus, \n.form-select[_ngcontent-%COMP%]:focus, \n.form-textarea[_ngcontent-%COMP%]:focus {\n  outline: none;\n  border-color: #3b82f6;\n  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);\n}\n.form-input[_ngcontent-%COMP%]:disabled, \n.form-select[_ngcontent-%COMP%]:disabled {\n  background: var(--bg-tertiary);\n  color: var(--text-tertiary);\n  cursor: not-allowed;\n  opacity: 0.6;\n}\n.form-textarea[_ngcontent-%COMP%] {\n  resize: vertical;\n  min-height: 80px;\n}\n.form-group[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  display: block;\n  margin-top: 0.5rem;\n  color: var(--text-tertiary);\n  font-size: 0.85rem;\n}\n.form-row[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 1.5rem;\n}\n@media (max-width: 768px) {\n  .form-row[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n.form-actions[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: flex-end;\n  gap: 1rem;\n  padding: 1.5rem;\n  background: var(--bg-secondary);\n  border-top: 1px solid var(--border-color);\n}\n.btn-cancel[_ngcontent-%COMP%], \n.btn-submit[_ngcontent-%COMP%] {\n  padding: 0.75rem 1.5rem;\n  border-radius: 6px;\n  font-weight: 500;\n  font-size: 0.95rem;\n  cursor: pointer;\n  transition: all 0.2s;\n  border: none;\n}\n.btn-cancel[_ngcontent-%COMP%] {\n  background: white;\n  color: #475569;\n  border: 1px solid #cbd5e1;\n}\n.btn-cancel[_ngcontent-%COMP%]:hover {\n  background: #f1f5f9;\n}\n.btn-submit[_ngcontent-%COMP%] {\n  background: #3b82f6;\n  color: white;\n}\n.btn-submit[_ngcontent-%COMP%]:hover {\n  background: #2563eb;\n}\n.btn-submit[_ngcontent-%COMP%]:disabled {\n  background: #93c5fd;\n  cursor: not-allowed;\n}\n/*# sourceMappingURL=campaign-form.component.css.map */"] });
var CampaignFormComponent = _CampaignFormComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CampaignFormComponent, [{
    type: Component,
    args: [{ selector: "app-campaign-form", standalone: true, imports: [CommonModule, FormsModule, LucideAngularModule], template: `<div class="campaign-form-container">\r
  <!-- Header -->\r
  <div class="form-header">\r
    <h1>\r
      <lucide-angular [name]="isEditMode ? 'pencil' : 'plus-circle'" [size]="24" class="header-icon"></lucide-angular>\r
      {{ isEditMode ? 'Editar Campa\xF1a' : 'Nueva Campa\xF1a' }}\r
    </h1>\r
    <button class="btn-back" (click)="onCancel()">\r
      <lucide-angular name="arrow-left" [size]="18"></lucide-angular>\r
      <span>Volver</span>\r
    </button>\r
  </div>\r
\r
  <!-- Error Message -->\r
  <div *ngIf="error" class="error-message">\r
    <lucide-angular name="x-circle" [size]="20"></lucide-angular>\r
    {{ error }}\r
  </div>\r
\r
  <!-- Loading State -->\r
  <div *ngIf="loading" class="loading-state">\r
    <div class="spinner"></div>\r
    <p>{{ isEditMode ? 'Cargando campa\xF1a...' : 'Guardando...' }}</p>\r
  </div>\r
\r
  <!-- Form -->\r
  <div *ngIf="!loading" class="form-content">\r
    <form (ngSubmit)="onSubmit()">\r
      <!-- Informaci\xF3n B\xE1sica -->\r
      <div class="form-section">\r
        <h2>\r
          <lucide-angular name="file-text" [size]="20"></lucide-angular>\r
          Informaci\xF3n B\xE1sica\r
        </h2>\r
\r
        <div class="form-group">\r
          <label for="name">Nombre de la Campa\xF1a *</label>\r
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
            placeholder="Descripci\xF3n de la campa\xF1a..."\r
            class="form-textarea"\r
            rows="3"></textarea>\r
        </div>\r
\r
        <div class="form-row">\r
          <div class="form-group">\r
            <label for="startDate">Fecha de Inicio</label>\r
            <input\r
              type="datetime-local"\r
              id="startDate"\r
              [(ngModel)]="startDateString"\r
              name="startDate"\r
              class="form-input">\r
            <small>Fecha y hora de inicio de la campa\xF1a</small>\r
          </div>\r
\r
          <div class="form-group">\r
            <label for="endDate">Fecha de Fin</label>\r
            <input\r
              type="datetime-local"\r
              id="endDate"\r
              [(ngModel)]="endDateString"\r
              name="endDate"\r
              class="form-input">\r
            <small>Fecha y hora de finalizaci\xF3n de la campa\xF1a</small>\r
          </div>\r
        </div>\r
      </div>\r
\r
      <!-- Asignaci\xF3n -->\r
      <div class="form-section">\r
        <h2>\r
          <lucide-angular name="building-2" [size]="20"></lucide-angular>\r
          Asignaci\xF3n\r
        </h2>\r
\r
        <div class="form-row">\r
          <div class="form-group">\r
            <label for="tenant">Proveedor (Inquilino) *</label>\r
            <select\r
              id="tenant"\r
              [(ngModel)]="selectedTenantId"\r
              name="tenant"\r
              (ngModelChange)="onTenantChange()"\r
              class="form-select"\r
              required>\r
              <option [ngValue]="0">Seleccione un proveedor...</option>\r
              <option *ngFor="let tenant of tenants" [ngValue]="tenant.id">\r
                {{ tenant.tenantCode }} - {{ tenant.tenantName }}\r
              </option>\r
            </select>\r
          </div>\r
\r
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
              <option [ngValue]="0">Seleccione una cartera...</option>\r
              <option *ngFor="let portfolio of portfolios" [ngValue]="portfolio.id">\r
                {{ portfolio.portfolioCode }} - {{ portfolio.portfolioName }}\r
              </option>\r
            </select>\r
          </div>\r
        </div>\r
\r
        <div class="form-group">\r
          <label for="subportfolio">Subcartera *</label>\r
          <select\r
            id="subportfolio"\r
            [(ngModel)]="selectedSubPortfolioId"\r
            name="subportfolio"\r
            [disabled]="selectedPortfolioId === 0"\r
            class="form-select"\r
            required>\r
            <option [ngValue]="0">Seleccione una subcartera...</option>\r
            <option *ngFor="let sp of subPortfolios" [ngValue]="sp.id">\r
              {{ sp.subPortfolioCode }} - {{ sp.subPortfolioName }}\r
            </option>\r
          </select>\r
        </div>\r
      </div>\r
\r
      <!-- Configuraci\xF3n de Discado -->\r
      <div class="form-section">\r
        <h2>\r
          <lucide-angular name="phone-call" [size]="20"></lucide-angular>\r
          Configuraci\xF3n de Discado\r
        </h2>\r
\r
        <div class="form-row">\r
          <div class="form-group">\r
            <label for="dialMode">Modo de Discado</label>\r
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
            <label for="maxAttempts">Intentos M\xE1ximos</label>\r
            <input\r
              type="number"\r
              id="maxAttempts"\r
              [(ngModel)]="campaign.maxAttempts"\r
              name="maxAttempts"\r
              class="form-input"\r
              min="1"\r
              max="10">\r
            <small>N\xFAmero m\xE1ximo de intentos por contacto (1-10)</small>\r
          </div>\r
        </div>\r
\r
        <div class="form-row">\r
          <div class="form-group">\r
            <label for="retryInterval">Intervalo de Reintento (minutos)</label>\r
            <input\r
              type="number"\r
              id="retryInterval"\r
              [(ngModel)]="campaign.retryInterval"\r
              name="retryInterval"\r
              class="form-input"\r
              min="1">\r
            <small>Tiempo de espera entre reintentos</small>\r
          </div>\r
\r
          <div class="form-group">\r
            <label for="intensidad">Intensidad de Discado</label>\r
            <input\r
              type="number"\r
              id="intensidad"\r
              [(ngModel)]="campaign.intensidad"\r
              name="intensidad"\r
              class="form-input"\r
              min="1"\r
              max="100"\r
              placeholder="50">\r
            <small>Llamadas simult\xE1neas por agente (1-100). Ej: 50 con 10 agentes = 5 llamadas/agente</small>\r
          </div>\r
        </div>\r
      </div>\r
\r
      <!-- Botones de Acci\xF3n -->\r
      <div class="form-actions">\r
        <button type="button" class="btn-cancel" (click)="onCancel()">\r
          Cancelar\r
        </button>\r
        <button type="submit" class="btn-submit" [disabled]="loading">\r
          {{ isEditMode ? 'Actualizar Campa\xF1a' : 'Crear Campa\xF1a' }}\r
        </button>\r
      </div>\r
    </form>\r
  </div>\r
</div>\r
`, styles: ["/* src/app/features/admin/campaign-form/campaign-form.component.css */\n.campaign-form-container {\n  max-width: 1000px;\n  margin: 0 auto;\n  padding: 2rem !important;\n  min-height: 100vh;\n  background:\n    linear-gradient(\n      to bottom right,\n      #0f172a,\n      #1e293b,\n      #0f172a);\n}\n.form-header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 2rem;\n}\n.form-header h1 {\n  font-size: 1.8rem;\n  color: var(--text-primary);\n  margin: 0;\n  display: flex;\n  align-items: center;\n  gap: 0.75rem;\n}\n.header-icon {\n  flex-shrink: 0;\n}\n.btn-back {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  padding: 0.5rem 1rem;\n  background: var(--bg-tertiary);\n  border: 1px solid var(--border-color);\n  border-radius: 6px;\n  cursor: pointer;\n  font-size: 0.9rem;\n  color: var(--text-secondary);\n  transition: all 0.2s;\n}\n.btn-back:hover {\n  background: var(--bg-secondary);\n}\n.error-message {\n  background: #fee2e2;\n  border: 1px solid #fca5a5;\n  color: #991b1b;\n  padding: 1rem;\n  border-radius: 6px;\n  margin-bottom: 1.5rem;\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n}\n.loading-state {\n  text-align: center;\n  padding: 3rem;\n}\n.spinner {\n  border: 3px solid #f3f4f6;\n  border-top: 3px solid #3b82f6;\n  border-radius: 50%;\n  width: 40px;\n  height: 40px;\n  animation: spin 1s linear infinite;\n  margin: 0 auto 1rem;\n}\n@keyframes spin {\n  0% {\n    transform: rotate(0deg);\n  }\n  100% {\n    transform: rotate(360deg);\n  }\n}\n.form-content {\n  background: var(--bg-card);\n  border-radius: 8px;\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);\n}\n.form-section {\n  padding: 1.5rem;\n  border-bottom: 1px solid var(--border-color);\n}\n.form-section:last-of-type {\n  border-bottom: none;\n}\n.form-section h2 {\n  font-size: 1.2rem;\n  color: var(--text-primary);\n  margin: 0 0 1.5rem 0;\n  font-weight: 600;\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n}\n.form-group {\n  margin-bottom: 1.5rem;\n}\n.form-group:last-child {\n  margin-bottom: 0;\n}\n.form-group label {\n  display: block;\n  font-weight: 500;\n  color: var(--text-secondary);\n  margin-bottom: 0.5rem;\n  font-size: 0.9rem;\n}\n.form-input,\n.form-select,\n.form-textarea {\n  width: 100%;\n  padding: 0.75rem;\n  border: 1px solid var(--input-border);\n  background: var(--input-bg);\n  color: var(--text-primary);\n  border-radius: 6px;\n  font-size: 0.95rem;\n  transition: border-color 0.2s;\n}\n.form-input:focus,\n.form-select:focus,\n.form-textarea:focus {\n  outline: none;\n  border-color: #3b82f6;\n  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);\n}\n.form-input:disabled,\n.form-select:disabled {\n  background: var(--bg-tertiary);\n  color: var(--text-tertiary);\n  cursor: not-allowed;\n  opacity: 0.6;\n}\n.form-textarea {\n  resize: vertical;\n  min-height: 80px;\n}\n.form-group small {\n  display: block;\n  margin-top: 0.5rem;\n  color: var(--text-tertiary);\n  font-size: 0.85rem;\n}\n.form-row {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 1.5rem;\n}\n@media (max-width: 768px) {\n  .form-row {\n    grid-template-columns: 1fr;\n  }\n}\n.form-actions {\n  display: flex;\n  justify-content: flex-end;\n  gap: 1rem;\n  padding: 1.5rem;\n  background: var(--bg-secondary);\n  border-top: 1px solid var(--border-color);\n}\n.btn-cancel,\n.btn-submit {\n  padding: 0.75rem 1.5rem;\n  border-radius: 6px;\n  font-weight: 500;\n  font-size: 0.95rem;\n  cursor: pointer;\n  transition: all 0.2s;\n  border: none;\n}\n.btn-cancel {\n  background: white;\n  color: #475569;\n  border: 1px solid #cbd5e1;\n}\n.btn-cancel:hover {\n  background: #f1f5f9;\n}\n.btn-submit {\n  background: #3b82f6;\n  color: white;\n}\n.btn-submit:hover {\n  background: #2563eb;\n}\n.btn-submit:disabled {\n  background: #93c5fd;\n  cursor: not-allowed;\n}\n/*# sourceMappingURL=campaign-form.component.css.map */\n"] }]
  }], () => [{ type: CampaignAdminService }, { type: TenantService }, { type: PortfolioService }, { type: Router }, { type: ActivatedRoute }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(CampaignFormComponent, { className: "CampaignFormComponent", filePath: "src/app/features/admin/campaign-form/campaign-form.component.ts", lineNumber: 20 });
})();
export {
  CampaignFormComponent
};
//# sourceMappingURL=chunk-7ASS6FFH.js.map
