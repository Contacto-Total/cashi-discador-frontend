import {
  MatProgressSpinner,
  MatProgressSpinnerModule
} from "./chunk-ITNLXDRW.js";
import {
  ApiSystemConfigService,
  DynamicFieldRendererComponent,
  TypificationV2Service
} from "./chunk-WKJZD4SZ.js";
import {
  ManagementService
} from "./chunk-33K4OXJG.js";
import {
  TypificationService
} from "./chunk-XGOWMJUN.js";
import {
  MatIcon,
  MatIconModule
} from "./chunk-NFPOATIL.js";
import {
  AutorizacionService,
  MatProgressBarModule,
  RecordatoriosModalComponent,
  RecordatoriosService
} from "./chunk-SUFYRKBU.js";
import {
  AgentStatusService
} from "./chunk-T6TTP2GO.js";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef
} from "./chunk-HBS4YI6H.js";
import {
  StatusAlarmClockComponent
} from "./chunk-IRGKDA7E.js";
import {
  AgentService
} from "./chunk-ESU7E6HN.js";
import {
  AgentState
} from "./chunk-GI66PYSZ.js";
import "./chunk-CRNFYKBD.js";
import "./chunk-2GCPRO7O.js";
import "./chunk-XG3JRR2G.js";
import {
  CallState,
  SipService
} from "./chunk-FHH72WSF.js";
import "./chunk-NSDE3IOW.js";
import {
  MatButton,
  MatButtonModule,
  MatIconButton
} from "./chunk-M2YI7FKS.js";
import "./chunk-Q5NKAKZL.js";
import {
  AuthService
} from "./chunk-55FOSRV6.js";
import {
  ActivatedRoute,
  Router
} from "./chunk-OCZLH7K5.js";
import "./chunk-ZQICQP3Y.js";
import {
  ThemeService
} from "./chunk-D3RWIMJ4.js";
import {
  DefaultValueAccessor,
  FormsModule,
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
import {
  environment
} from "./chunk-QF774CZR.js";
import {
  CommonModule,
  Component,
  DecimalPipe,
  EventEmitter,
  HttpClient,
  HttpHeaders,
  Inject,
  Injectable,
  Input,
  NgClass,
  Output,
  ViewChild,
  __spreadProps,
  __spreadValues,
  catchError,
  computed,
  effect,
  inject,
  of,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵNgOnChangesFeature,
  ɵɵadvance,
  ɵɵclassMap,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdirectiveInject,
  ɵɵdomElement,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵdomListener,
  ɵɵdomProperty,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵinject,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind2,
  ɵɵproperty,
  ɵɵqueryRefresh,
  ɵɵreference,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIndex,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵstyleProp,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty,
  ɵɵviewQuery
} from "./chunk-CTRHJBBW.js";

// src/app/collection-management/services/payment-schedule.service.ts
var _PaymentScheduleService = class _PaymentScheduleService {
  constructor(http) {
    this.http = http;
    this.baseUrl = `${environment.tipificacionUrl}/payment-schedules`;
  }
  /**
   * Crea un nuevo cronograma de pagos
   */
  createPaymentSchedule(request) {
    return this.http.post(`${environment.tipificacionUrl}/payments/schedules`, request);
  }
  /**
   * Obtiene el cronograma de pagos asociado a una gestión
   */
  getPaymentScheduleByManagementId(managementId) {
    return this.http.get(`${this.baseUrl}/management/${managementId}`);
  }
  /**
   * Actualiza el estado de una cuota (crea un nuevo registro en el historial)
   */
  updateInstallmentStatus(installmentId, request) {
    return this.http.post(`${this.baseUrl}/installments/${installmentId}/status`, request);
  }
  /**
   * Obtiene el historial completo de estados de una cuota
   */
  getInstallmentHistory(installmentId) {
    return this.http.get(`${this.baseUrl}/installments/${installmentId}/history`);
  }
  /**
   * Obtiene el último estado de cada cuota de una gestión
   */
  getLatestStatusByManagement(managementId) {
    return this.http.get(`${this.baseUrl}/management/${managementId}/latest-status`);
  }
  /**
   * Obtiene cronogramas activos de un cliente desde registros_gestion_v2
   */
  getActiveSchedulesByCustomer(customerId) {
    return this.http.get(`${environment.gatewayUrl}/v2/management-records/payment-schedule/client/${customerId}`);
  }
};
_PaymentScheduleService.\u0275fac = function PaymentScheduleService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _PaymentScheduleService)(\u0275\u0275inject(HttpClient));
};
_PaymentScheduleService.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _PaymentScheduleService, factory: _PaymentScheduleService.\u0275fac, providedIn: "root" });
var PaymentScheduleService = _PaymentScheduleService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PaymentScheduleService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{ type: HttpClient }], null);
})();

// src/app/collection-management/components/installment-status-dialog/installment-status-dialog.component.ts
function InstallmentStatusDialogComponent_Conditional_0_Conditional_42_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 17)(1, "div")(2, "label", 13);
    \u0275\u0275text(3, " Fecha de Pago * ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "input", 23);
    \u0275\u0275twoWayListener("ngModelChange", function InstallmentStatusDialogComponent_Conditional_0_Conditional_42_Template_input_ngModelChange_4_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.paymentDate, $event) || (ctx_r1.paymentDate = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "div")(6, "label", 13);
    \u0275\u0275text(7, " Monto Pagado * ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "div", 24)(9, "span", 25);
    \u0275\u0275text(10, "S/");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "input", 26);
    \u0275\u0275twoWayListener("ngModelChange", function InstallmentStatusDialogComponent_Conditional_0_Conditional_42_Template_input_ngModelChange_11_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.amountPaid, $event) || (ctx_r1.amountPaid = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.paymentDate);
    \u0275\u0275advance(7);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.amountPaid);
  }
}
function InstallmentStatusDialogComponent_Conditional_0_Conditional_47_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 19)(1, "span", 27);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.errorMessage());
  }
}
function InstallmentStatusDialogComponent_Conditional_0_Conditional_52_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "Guardando...");
    \u0275\u0275elementEnd();
  }
}
function InstallmentStatusDialogComponent_Conditional_0_Conditional_53_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "Guardar");
    \u0275\u0275elementEnd();
  }
}
function InstallmentStatusDialogComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "div")(5, "h2", 4);
    \u0275\u0275text(6, "Actualizar Estado de Cuota");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p", 5);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(9, "button", 6);
    \u0275\u0275listener("click", function InstallmentStatusDialogComponent_Conditional_0_Template_button_click_9_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.close());
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "div", 7)(11, "div", 8)(12, "div", 9)(13, "div")(14, "span", 10);
    \u0275\u0275text(15, "Monto:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "span", 11);
    \u0275\u0275text(17);
    \u0275\u0275pipe(18, "number");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(19, "div")(20, "span", 10);
    \u0275\u0275text(21, "Fecha Vencimiento:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "span", 11);
    \u0275\u0275text(23);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(24, "div")(25, "span", 10);
    \u0275\u0275text(26, "Estado Actual:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "span", 12);
    \u0275\u0275text(28);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(29, "div")(30, "label", 13);
    \u0275\u0275text(31, " Nuevo Estado ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(32, "div", 14)(33, "button", 15);
    \u0275\u0275listener("click", function InstallmentStatusDialogComponent_Conditional_0_Template_button_click_33_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.selectedStatus.set("COMPLETADO"));
    });
    \u0275\u0275elementStart(34, "span", 16);
    \u0275\u0275text(35, "Completado");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(36, "button", 15);
    \u0275\u0275listener("click", function InstallmentStatusDialogComponent_Conditional_0_Template_button_click_36_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.selectedStatus.set("VENCIDO"));
    });
    \u0275\u0275elementStart(37, "span", 16);
    \u0275\u0275text(38, "Vencido");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(39, "button", 15);
    \u0275\u0275listener("click", function InstallmentStatusDialogComponent_Conditional_0_Template_button_click_39_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.selectedStatus.set("CANCELADO"));
    });
    \u0275\u0275elementStart(40, "span", 16);
    \u0275\u0275text(41, "Cancelado");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275conditionalCreate(42, InstallmentStatusDialogComponent_Conditional_0_Conditional_42_Template, 12, 2, "div", 17);
    \u0275\u0275elementStart(43, "div")(44, "label", 13);
    \u0275\u0275text(45, " Observaciones ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(46, "textarea", 18);
    \u0275\u0275twoWayListener("ngModelChange", function InstallmentStatusDialogComponent_Conditional_0_Template_textarea_ngModelChange_46_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.observations, $event) || (ctx_r1.observations = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(47, InstallmentStatusDialogComponent_Conditional_0_Conditional_47_Template, 3, 1, "div", 19);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(48, "div", 20)(49, "button", 21);
    \u0275\u0275listener("click", function InstallmentStatusDialogComponent_Conditional_0_Template_button_click_49_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.close());
    });
    \u0275\u0275text(50, " Cancelar ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(51, "button", 22);
    \u0275\u0275listener("click", function InstallmentStatusDialogComponent_Conditional_0_Template_button_click_51_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.save());
    });
    \u0275\u0275conditionalCreate(52, InstallmentStatusDialogComponent_Conditional_0_Conditional_52_Template, 2, 0, "span")(53, InstallmentStatusDialogComponent_Conditional_0_Conditional_53_Template, 2, 0, "span");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    let tmp_1_0;
    let tmp_2_0;
    let tmp_3_0;
    let tmp_4_0;
    let tmp_5_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate1("Cuota #", (tmp_1_0 = ctx_r1.installment()) == null ? null : tmp_1_0.installmentNumber);
    \u0275\u0275advance(9);
    \u0275\u0275textInterpolate1(" S/ ", \u0275\u0275pipeBind2(18, 17, (tmp_2_0 = ctx_r1.installment()) == null ? null : tmp_2_0.amount, "1.2-2"), " ");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1(" ", ctx_r1.formatDate((tmp_3_0 = ctx_r1.installment()) == null ? null : tmp_3_0.dueDate), " ");
    \u0275\u0275advance(4);
    \u0275\u0275classMap(ctx_r1.getStatusBadgeClass(((tmp_4_0 = ctx_r1.installment()) == null ? null : tmp_4_0.status) || "PENDIENTE"));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ((tmp_5_0 = ctx_r1.installment()) == null ? null : tmp_5_0.statusDescription) || "Pendiente", " ");
    \u0275\u0275advance(5);
    \u0275\u0275classMap(ctx_r1.selectedStatus() === "COMPLETADO" ? "bg-green-100 dark:bg-green-900/30 border-green-500 dark:border-green-600 text-green-900 dark:text-green-300" : "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-green-400");
    \u0275\u0275advance(3);
    \u0275\u0275classMap(ctx_r1.selectedStatus() === "VENCIDO" ? "bg-red-100 dark:bg-red-900/30 border-red-500 dark:border-red-600 text-red-900 dark:text-red-300" : "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-red-400");
    \u0275\u0275advance(3);
    \u0275\u0275classMap(ctx_r1.selectedStatus() === "CANCELADO" ? "bg-gray-100 dark:bg-gray-700/30 border-gray-500 dark:border-gray-600 text-gray-900 dark:text-gray-300" : "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-gray-400");
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r1.selectedStatus() === "COMPLETADO" ? 42 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.observations);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.errorMessage() ? 47 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275property("disabled", !ctx_r1.canSave() || ctx_r1.isSaving());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.isSaving() ? 52 : 53);
  }
}
var _InstallmentStatusDialogComponent = class _InstallmentStatusDialogComponent {
  constructor(paymentScheduleService) {
    this.paymentScheduleService = paymentScheduleService;
    this.isOpen = signal(false, ...ngDevMode ? [{ debugName: "isOpen" }] : []);
    this.installment = signal(null, ...ngDevMode ? [{ debugName: "installment" }] : []);
    this.managementId = signal(0, ...ngDevMode ? [{ debugName: "managementId" }] : []);
    this.selectedStatus = signal(null, ...ngDevMode ? [{ debugName: "selectedStatus" }] : []);
    this.paymentDate = "";
    this.amountPaid = null;
    this.observations = "";
    this.isSaving = signal(false, ...ngDevMode ? [{ debugName: "isSaving" }] : []);
    this.errorMessage = signal(null, ...ngDevMode ? [{ debugName: "errorMessage" }] : []);
    this.canSave = computed(() => {
      if (!this.selectedStatus())
        return false;
      if (this.selectedStatus() === "COMPLETADO") {
        return !!this.paymentDate && this.amountPaid !== null && this.amountPaid > 0;
      }
      return true;
    }, ...ngDevMode ? [{ debugName: "canSave" }] : []);
    effect(() => {
      if (!this.isOpen()) {
        this.resetForm();
      }
    });
  }
  open(installment, managementId) {
    this.installment.set(installment);
    this.managementId.set(managementId);
    this.isOpen.set(true);
    this.amountPaid = installment.amount;
    const now = /* @__PURE__ */ new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    this.paymentDate = `${year}-${month}-${day}T${hours}:${minutes}`;
  }
  close() {
    this.isOpen.set(false);
  }
  resetForm() {
    this.selectedStatus.set(null);
    this.paymentDate = "";
    this.amountPaid = null;
    this.observations = "";
    this.errorMessage.set(null);
    this.installment.set(null);
    this.managementId.set(0);
  }
  save() {
    const installment = this.installment();
    if (!installment || !this.canSave())
      return;
    this.isSaving.set(true);
    this.errorMessage.set(null);
    const request = {
      status: this.selectedStatus(),
      observations: this.observations || void 0,
      registeredBy: "USUARIO"
      // TODO: Obtener del usuario actual
    };
    if (this.selectedStatus() === "COMPLETADO") {
      request.paymentDate = this.paymentDate;
      request.amountPaid = this.amountPaid;
    }
    this.paymentScheduleService.updateInstallmentStatus(installment.id, request).subscribe({
      next: () => {
        console.log("\u2705 Estado de cuota actualizado exitosamente");
        this.isSaving.set(false);
        this.close();
        if (this.onSave) {
          this.onSave(true);
        }
      },
      error: (error) => {
        console.error("\u274C Error actualizando estado de cuota:", error);
        this.errorMessage.set("Error al actualizar el estado. Intente nuevamente.");
        this.isSaving.set(false);
        if (this.onSave) {
          this.onSave(false);
        }
      }
    });
  }
  formatDate(dateStr) {
    if (!dateStr)
      return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-PE", { day: "2-digit", month: "2-digit", year: "numeric" });
  }
  getStatusBadgeClass(status) {
    switch (status.toUpperCase()) {
      case "COMPLETED":
      case "COMPLETADO":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-300 dark:border-green-700";
      case "PENDING":
      case "PENDIENTE":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border border-yellow-300 dark:border-yellow-700";
      case "OVERDUE":
      case "VENCIDO":
        return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-700";
      case "CANCELLED":
      case "CANCELADO":
        return "bg-gray-100 dark:bg-gray-700/30 text-gray-800 dark:text-gray-300 border border-gray-300 dark:border-gray-600";
      default:
        return "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-300";
    }
  }
};
_InstallmentStatusDialogComponent.\u0275fac = function InstallmentStatusDialogComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _InstallmentStatusDialogComponent)(\u0275\u0275directiveInject(PaymentScheduleService));
};
_InstallmentStatusDialogComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _InstallmentStatusDialogComponent, selectors: [["app-installment-status-dialog"]], decls: 1, vars: 1, consts: [[1, "fixed", "inset-0", "z-50", "flex", "items-center", "justify-center", "p-4", "bg-black/50", "backdrop-blur-sm", "animate-fadeIn"], [1, "bg-white", "dark:bg-slate-900", "rounded-xl", "shadow-2xl", "max-w-2xl", "w-full", "max-h-[90vh]", "overflow-hidden", "flex", "flex-col", "animate-slideInUp", "border", "border-slate-200", "dark:border-slate-700"], [1, "bg-gradient-to-r", "from-purple-600", "to-purple-700", "dark:from-purple-700", "dark:to-purple-800", "text-white", "px-6", "py-4", "flex", "items-center", "justify-between"], [1, "flex", "items-center", "gap-3"], [1, "text-lg", "font-bold"], [1, "text-sm", "opacity-90"], ["type", "button", 1, "p-2", "hover:bg-white/20", "rounded-lg", "transition-colors", 3, "click"], [1, "flex-1", "overflow-y-auto", "p-6", "space-y-6"], [1, "bg-purple-50", "dark:bg-purple-950/30", "border", "border-purple-200", "dark:border-purple-800", "rounded-lg", "p-4"], [1, "grid", "grid-cols-2", "gap-4", "text-sm"], [1, "text-slate-600", "dark:text-slate-400"], [1, "font-bold", "text-purple-900", "dark:text-purple-200", "ml-2"], [1, "ml-2", "px-2", "py-0.5", "rounded", "text-xs", "font-bold"], [1, "block", "text-sm", "font-semibold", "text-slate-700", "dark:text-slate-300", "mb-2"], [1, "grid", "grid-cols-3", "gap-3"], ["type", "button", 1, "border-2", "rounded-lg", "p-4", "flex", "flex-col", "items-center", "gap-2", "transition-all", 3, "click"], [1, "text-sm", "font-bold"], [1, "space-y-4", "p-4", "bg-green-50", "dark:bg-green-950/20", "border", "border-green-200", "dark:border-green-800", "rounded-lg"], ["rows", "3", "placeholder", "Ingrese notas o comentarios adicionales...", 1, "w-full", "px-3", "py-2", "text-sm", "border", "border-slate-300", "dark:border-slate-600", "rounded-lg", "bg-white", "dark:bg-slate-800", "text-slate-900", "dark:text-slate-100", "focus:ring-2", "focus:ring-purple-500", "dark:focus:ring-purple-600", "focus:border-transparent", "placeholder:text-slate-400", "dark:placeholder:text-slate-500", 3, "ngModelChange", "ngModel"], [1, "bg-red-50", "dark:bg-red-950/30", "border", "border-red-200", "dark:border-red-800", "text-red-900", "dark:text-red-300", "px-4", "py-3", "rounded-lg", "flex", "items-start", "gap-2"], [1, "px-6", "py-4", "bg-slate-50", "dark:bg-slate-800/50", "border-t", "border-slate-200", "dark:border-slate-700", "flex", "justify-end", "gap-3"], ["type", "button", 1, "px-4", "py-2", "text-sm", "font-semibold", "text-slate-700", "dark:text-slate-300", "hover:bg-slate-200", "dark:hover:bg-slate-700", "rounded-lg", "transition-colors", 3, "click"], ["type", "button", 1, "px-4", "py-2", "text-sm", "font-semibold", "text-white", "bg-gradient-to-r", "from-purple-600", "to-purple-700", "hover:from-purple-700", "hover:to-purple-800", "rounded-lg", "transition-all", "disabled:opacity-50", "disabled:cursor-not-allowed", "disabled:hover:from-purple-600", "flex", "items-center", "gap-2", 3, "click", "disabled"], ["type", "datetime-local", "required", "", 1, "w-full", "px-3", "py-2", "text-sm", "border", "border-slate-300", "dark:border-slate-600", "rounded-lg", "bg-white", "dark:bg-slate-800", "text-slate-900", "dark:text-slate-100", "focus:ring-2", "focus:ring-green-500", "dark:focus:ring-green-600", "focus:border-transparent", 3, "ngModelChange", "ngModel"], [1, "relative"], [1, "absolute", "left-3", "top-2", "text-slate-500", "dark:text-slate-400"], ["type", "number", "step", "0.01", "required", "", 1, "w-full", "pl-10", "pr-3", "py-2", "text-sm", "border", "border-slate-300", "dark:border-slate-600", "rounded-lg", "bg-white", "dark:bg-slate-800", "text-slate-900", "dark:text-slate-100", "focus:ring-2", "focus:ring-green-500", "dark:focus:ring-green-600", "focus:border-transparent", 3, "ngModelChange", "ngModel"], [1, "text-sm"]], template: function InstallmentStatusDialogComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, InstallmentStatusDialogComponent_Conditional_0_Template, 54, 20, "div", 0);
  }
  if (rf & 2) {
    \u0275\u0275conditional(ctx.isOpen() ? 0 : -1);
  }
}, dependencies: [CommonModule, FormsModule, DefaultValueAccessor, NumberValueAccessor, NgControlStatus, RequiredValidator, NgModel, DecimalPipe], styles: ["\n\n@keyframes _ngcontent-%COMP%_fadeIn {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n@keyframes _ngcontent-%COMP%_slideInUp {\n  from {\n    opacity: 0;\n    transform: translateY(20px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n.animate-fadeIn[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_fadeIn 0.2s ease-out;\n}\n.animate-slideInUp[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_slideInUp 0.3s ease-out;\n}\n/*# sourceMappingURL=installment-status-dialog.component.css.map */"] });
var InstallmentStatusDialogComponent = _InstallmentStatusDialogComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(InstallmentStatusDialogComponent, [{
    type: Component,
    args: [{ selector: "app-installment-status-dialog", standalone: true, imports: [CommonModule, FormsModule], template: `
    @if (isOpen()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
        <div class="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-slideInUp border border-slate-200 dark:border-slate-700">

          <!-- Header -->
          <div class="bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-700 dark:to-purple-800 text-white px-6 py-4 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div>
                <h2 class="text-lg font-bold">Actualizar Estado de Cuota</h2>
                <p class="text-sm opacity-90">Cuota #{{ installment()?.installmentNumber }}</p>
              </div>
            </div>
            <button
              (click)="close()"
              class="p-2 hover:bg-white/20 rounded-lg transition-colors"
              type="button">
            </button>
          </div>

          <!-- Content -->
          <div class="flex-1 overflow-y-auto p-6 space-y-6">

            <!-- Informaci\xF3n de la cuota -->
            <div class="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span class="text-slate-600 dark:text-slate-400">Monto:</span>
                  <span class="font-bold text-purple-900 dark:text-purple-200 ml-2">
                    S/ {{ installment()?.amount | number:'1.2-2' }}
                  </span>
                </div>
                <div>
                  <span class="text-slate-600 dark:text-slate-400">Fecha Vencimiento:</span>
                  <span class="font-bold text-purple-900 dark:text-purple-200 ml-2">
                    {{ formatDate(installment()?.dueDate) }}
                  </span>
                </div>
                <div>
                  <span class="text-slate-600 dark:text-slate-400">Estado Actual:</span>
                  <span class="ml-2 px-2 py-0.5 rounded text-xs font-bold"
                        [class]="getStatusBadgeClass(installment()?.status || 'PENDIENTE')">
                    {{ installment()?.statusDescription || 'Pendiente' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Selector de nuevo estado -->
            <div>
              <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Nuevo Estado
              </label>
              <div class="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  (click)="selectedStatus.set('COMPLETADO')"
                  [class]="selectedStatus() === 'COMPLETADO'
                    ? 'bg-green-100 dark:bg-green-900/30 border-green-500 dark:border-green-600 text-green-900 dark:text-green-300'
                    : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-green-400'"
                  class="border-2 rounded-lg p-4 flex flex-col items-center gap-2 transition-all">
                  <span class="text-sm font-bold">Completado</span>
                </button>

                <button
                  type="button"
                  (click)="selectedStatus.set('VENCIDO')"
                  [class]="selectedStatus() === 'VENCIDO'
                    ? 'bg-red-100 dark:bg-red-900/30 border-red-500 dark:border-red-600 text-red-900 dark:text-red-300'
                    : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-red-400'"
                  class="border-2 rounded-lg p-4 flex flex-col items-center gap-2 transition-all">
                  <span class="text-sm font-bold">Vencido</span>
                </button>

                <button
                  type="button"
                  (click)="selectedStatus.set('CANCELADO')"
                  [class]="selectedStatus() === 'CANCELADO'
                    ? 'bg-gray-100 dark:bg-gray-700/30 border-gray-500 dark:border-gray-600 text-gray-900 dark:text-gray-300'
                    : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-gray-400'"
                  class="border-2 rounded-lg p-4 flex flex-col items-center gap-2 transition-all">
                  <span class="text-sm font-bold">Cancelado</span>
                </button>
              </div>
            </div>

            <!-- Campos adicionales para COMPLETADO -->
            @if (selectedStatus() === 'COMPLETADO') {
              <div class="space-y-4 p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div>
                  <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Fecha de Pago *
                  </label>
                  <input
                    type="datetime-local"
                    [(ngModel)]="paymentDate"
                    class="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg
                           bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100
                           focus:ring-2 focus:ring-green-500 dark:focus:ring-green-600 focus:border-transparent"
                    required>
                </div>

                <div>
                  <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Monto Pagado *
                  </label>
                  <div class="relative">
                    <span class="absolute left-3 top-2 text-slate-500 dark:text-slate-400">S/</span>
                    <input
                      type="number"
                      step="0.01"
                      [(ngModel)]="amountPaid"
                      class="w-full pl-10 pr-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg
                             bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100
                             focus:ring-2 focus:ring-green-500 dark:focus:ring-green-600 focus:border-transparent"
                      required>
                  </div>
                </div>
              </div>
            }

            <!-- Observaciones -->
            <div>
              <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Observaciones
              </label>
              <textarea
                [(ngModel)]="observations"
                rows="3"
                placeholder="Ingrese notas o comentarios adicionales..."
                class="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg
                       bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100
                       focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-600 focus:border-transparent
                       placeholder:text-slate-400 dark:placeholder:text-slate-500"></textarea>
            </div>

            <!-- Error message -->
            @if (errorMessage()) {
              <div class="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-900 dark:text-red-300 px-4 py-3 rounded-lg flex items-start gap-2">
                <span class="text-sm">{{ errorMessage() }}</span>
              </div>
            }
          </div>

          <!-- Footer -->
          <div class="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
            <button
              type="button"
              (click)="close()"
              class="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300
                     hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors">
              Cancelar
            </button>
            <button
              type="button"
              (click)="save()"
              [disabled]="!canSave() || isSaving()"
              class="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-purple-700
                     hover:from-purple-700 hover:to-purple-800 rounded-lg transition-all
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-purple-600
                     flex items-center gap-2">
              @if (isSaving()) {
                <span>Guardando...</span>
              } @else {
                <span>Guardar</span>
              }
            </button>
          </div>

        </div>
      </div>
    }
  `, styles: ["/* angular:styles/component:css;ca079406dcad0951db2ac58b4bd92434a83bc7952de012009eb0d8d6278c5250;C:/Users/HP/Documents/Kubito-2.0-v1/cashi-discador-frontend/cashi-discador-frontend/src/app/collection-management/components/installment-status-dialog/installment-status-dialog.component.ts */\n@keyframes fadeIn {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n@keyframes slideInUp {\n  from {\n    opacity: 0;\n    transform: translateY(20px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n.animate-fadeIn {\n  animation: fadeIn 0.2s ease-out;\n}\n.animate-slideInUp {\n  animation: slideInUp 0.3s ease-out;\n}\n/*# sourceMappingURL=installment-status-dialog.component.css.map */\n"] }]
  }], () => [{ type: PaymentScheduleService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(InstallmentStatusDialogComponent, { className: "InstallmentStatusDialogComponent", filePath: "src/app/collection-management/components/installment-status-dialog/installment-status-dialog.component.ts", lineNumber: 209 });
})();

// src/app/collection-management/components/payment-schedule-view/payment-schedule-view.component.ts
var _c0 = ["statusDialog"];
var _forTrack0 = ($index, $item) => $item.id;
function PaymentScheduleViewComponent_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 9)(1, "div", 10)(2, "span");
    \u0275\u0275text(3, "Cargando estados...");
    \u0275\u0275elementEnd()()();
  }
}
function PaymentScheduleViewComponent_Conditional_16_For_18_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 31);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const installment_r2 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r2.formatDateTime(installment_r2.latestStatus.actualPaymentDate), " ");
  }
}
function PaymentScheduleViewComponent_Conditional_16_For_18_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 36);
    \u0275\u0275text(1, "-");
    \u0275\u0275elementEnd();
  }
}
function PaymentScheduleViewComponent_Conditional_16_For_18_Conditional_24_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 43)(1, "span");
    \u0275\u0275text(2, "Cargando historial...");
    \u0275\u0275elementEnd()();
  }
}
function PaymentScheduleViewComponent_Conditional_16_For_18_Conditional_24_Conditional_7_For_2_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 48);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "number");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const historyItem_r4 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" S/ ", \u0275\u0275pipeBind2(2, 1, historyItem_r4.amountPaid, "1.2-2"), " ");
  }
}
function PaymentScheduleViewComponent_Conditional_16_For_18_Conditional_24_Conditional_7_For_2_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 49);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const historyItem_r4 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", historyItem_r4.observations, " ");
  }
}
function PaymentScheduleViewComponent_Conditional_16_For_18_Conditional_24_Conditional_7_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 44)(1, "div", 45);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 46)(4, "span", 47);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(6, PaymentScheduleViewComponent_Conditional_16_For_18_Conditional_24_Conditional_7_For_2_Conditional_6_Template, 3, 4, "span", 48);
    \u0275\u0275conditionalCreate(7, PaymentScheduleViewComponent_Conditional_16_For_18_Conditional_24_Conditional_7_For_2_Conditional_7_Template, 2, 1, "div", 49);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "div", 50);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const historyItem_r4 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(5);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r2.formatDateTime(historyItem_r4.changeDate), " ");
    \u0275\u0275advance(2);
    \u0275\u0275classMap(ctx_r2.getStatusBadgeClass(historyItem_r4.status));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", historyItem_r4.statusDescription, " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(historyItem_r4.amountPaid ? 6 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(historyItem_r4.observations ? 7 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", historyItem_r4.registeredBy, " ");
  }
}
function PaymentScheduleViewComponent_Conditional_16_For_18_Conditional_24_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 41);
    \u0275\u0275repeaterCreate(1, PaymentScheduleViewComponent_Conditional_16_For_18_Conditional_24_Conditional_7_For_2_Template, 10, 7, "div", 44, _forTrack0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r2.installmentHistory());
  }
}
function PaymentScheduleViewComponent_Conditional_16_For_18_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 40)(2, "div", 41)(3, "div", 42)(4, "span");
    \u0275\u0275text(5, "Historial de Estados");
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(6, PaymentScheduleViewComponent_Conditional_16_For_18_Conditional_24_Conditional_6_Template, 3, 0, "div", 43)(7, PaymentScheduleViewComponent_Conditional_16_For_18_Conditional_24_Conditional_7_Template, 3, 0, "div", 41);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(6);
    \u0275\u0275conditional(ctx_r2.isLoadingHistory() ? 6 : ctx_r2.installmentHistory() && ctx_r2.installmentHistory().length > 0 ? 7 : -1);
  }
}
function PaymentScheduleViewComponent_Conditional_16_For_18_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr", 26)(1, "td", 27)(2, "div", 28)(3, "div", 29)(4, "span", 30);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(6, "td", 27)(7, "div", 31);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "td", 32)(10, "div", 33);
    \u0275\u0275text(11);
    \u0275\u0275pipe(12, "number");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "td", 27)(14, "div", 34)(15, "span", 35);
    \u0275\u0275text(16);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(17, "td", 27);
    \u0275\u0275conditionalCreate(18, PaymentScheduleViewComponent_Conditional_16_For_18_Conditional_18_Template, 2, 1, "div", 31)(19, PaymentScheduleViewComponent_Conditional_16_For_18_Conditional_19_Template, 2, 0, "div", 36);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "td", 27)(21, "div", 37)(22, "button", 38);
    \u0275\u0275listener("click", function PaymentScheduleViewComponent_Conditional_16_For_18_Template_button_click_22_listener() {
      const installment_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.openStatusDialog(installment_r2));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "button", 39);
    \u0275\u0275listener("click", function PaymentScheduleViewComponent_Conditional_16_For_18_Template_button_click_23_listener() {
      const installment_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.toggleHistory(installment_r2.id));
    });
    \u0275\u0275elementEnd()()()();
    \u0275\u0275conditionalCreate(24, PaymentScheduleViewComponent_Conditional_16_For_18_Conditional_24_Template, 8, 1, "tr");
  }
  if (rf & 2) {
    const installment_r2 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1(" ", installment_r2.installmentNumber, " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", ctx_r2.formatDate(installment_r2.dueDate), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" S/ ", \u0275\u0275pipeBind2(12, 10, installment_r2.amount, "1.2-2"), " ");
    \u0275\u0275advance(4);
    \u0275\u0275classMap(ctx_r2.getStatusBadgeClass((installment_r2.latestStatus == null ? null : installment_r2.latestStatus.status) || "PENDIENTE"));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", (installment_r2.latestStatus == null ? null : installment_r2.latestStatus.statusDescription) || "Pendiente", " ");
    \u0275\u0275advance(2);
    \u0275\u0275conditional((installment_r2.latestStatus == null ? null : installment_r2.latestStatus.actualPaymentDate) ? 18 : 19);
    \u0275\u0275advance(5);
    \u0275\u0275classMap(ctx_r2.expandedHistory() === installment_r2.id ? "bg-slate-200 dark:bg-slate-700" : "hover:bg-slate-100 dark:hover:bg-slate-800");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.expandedHistory() === installment_r2.id && ctx_r2.installmentHistory() ? 24 : -1);
  }
}
function PaymentScheduleViewComponent_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 11)(1, "table", 12)(2, "thead", 13)(3, "tr")(4, "th", 14);
    \u0275\u0275text(5, "#");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th", 14);
    \u0275\u0275text(7, "Fecha Vencimiento");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th", 15);
    \u0275\u0275text(9, "Monto");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th", 16);
    \u0275\u0275text(11, "Estado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th", 14);
    \u0275\u0275text(13, "Fecha Pago");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "th", 16);
    \u0275\u0275text(15, "Acciones");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(16, "tbody", 17);
    \u0275\u0275repeaterCreate(17, PaymentScheduleViewComponent_Conditional_16_For_18_Template, 25, 13, null, null, _forTrack0);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(19, "div", 18)(20, "div", 19)(21, "div", 20)(22, "div", 21);
    \u0275\u0275text(23, "Completadas");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "div", 22);
    \u0275\u0275text(25);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(26, "div", 20)(27, "div", 21);
    \u0275\u0275text(28, "Pendientes");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "div", 23);
    \u0275\u0275text(30);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(31, "div", 20)(32, "div", 21);
    \u0275\u0275text(33, "Vencidas");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(34, "div", 24);
    \u0275\u0275text(35);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(36, "div", 20)(37, "div", 21);
    \u0275\u0275text(38, "Canceladas");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(39, "div", 25);
    \u0275\u0275text(40);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(17);
    \u0275\u0275repeater(ctx_r2.installmentsWithStatus());
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate1(" ", ctx_r2.summaryStats().completed, " ");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1(" ", ctx_r2.summaryStats().pending, " ");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1(" ", ctx_r2.summaryStats().overdue, " ");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1(" ", ctx_r2.summaryStats().cancelled, " ");
  }
}
var _PaymentScheduleViewComponent = class _PaymentScheduleViewComponent {
  constructor(paymentScheduleService) {
    this.paymentScheduleService = paymentScheduleService;
    this.managementId = 0;
    this.schedule = signal(null, ...ngDevMode ? [{ debugName: "schedule" }] : []);
    this.latestStatuses = signal([], ...ngDevMode ? [{ debugName: "latestStatuses" }] : []);
    this.isLoading = signal(false, ...ngDevMode ? [{ debugName: "isLoading" }] : []);
    this.expandedHistory = signal(null, ...ngDevMode ? [{ debugName: "expandedHistory" }] : []);
    this.installmentHistory = signal(null, ...ngDevMode ? [{ debugName: "installmentHistory" }] : []);
    this.isLoadingHistory = signal(false, ...ngDevMode ? [{ debugName: "isLoadingHistory" }] : []);
    this.installmentsWithStatus = computed(() => {
      const sched = this.schedule();
      const statuses = this.latestStatuses();
      if (!sched)
        return [];
      return sched.installments.map((installment) => {
        const latestStatus = statuses.find((s) => s.installmentId === installment.id);
        return __spreadProps(__spreadValues({}, installment), {
          latestStatus
        });
      });
    }, ...ngDevMode ? [{ debugName: "installmentsWithStatus" }] : []);
    this.summaryStats = computed(() => {
      const installments = this.installmentsWithStatus();
      return {
        completed: installments.filter((i) => ["COMPLETED", "COMPLETADO"].includes(i.latestStatus?.status || "")).length,
        pending: installments.filter((i) => ["PENDING", "PENDIENTE"].includes(i.latestStatus?.status || "")).length,
        overdue: installments.filter((i) => ["OVERDUE", "VENCIDO"].includes(i.latestStatus?.status || "")).length,
        cancelled: installments.filter((i) => ["CANCELLED", "CANCELADO"].includes(i.latestStatus?.status || "")).length
      };
    }, ...ngDevMode ? [{ debugName: "summaryStats" }] : []);
  }
  ngOnChanges(changes) {
    if (changes["managementId"] && this.managementId) {
      this.loadSchedule();
    }
  }
  loadSchedule() {
    this.isLoading.set(true);
    this.paymentScheduleService.getPaymentScheduleByManagementId(this.managementId).subscribe({
      next: (schedule) => {
        console.log("\u{1F4CA} Cronograma cargado:", schedule);
        this.schedule.set(schedule);
        this.loadLatestStatuses();
      },
      error: (error) => {
        console.error("\u274C Error cargando cronograma:", error);
        this.isLoading.set(false);
      }
    });
  }
  loadLatestStatuses() {
    this.paymentScheduleService.getLatestStatusByManagement(this.managementId).subscribe({
      next: (statuses) => {
        console.log("\u{1F4CB} Estados m\xE1s recientes cargados:", statuses);
        this.latestStatuses.set(statuses);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error("\u274C Error cargando estados:", error);
        this.isLoading.set(false);
      }
    });
  }
  openStatusDialog(installment) {
    this.statusDialog.open(installment, this.managementId);
    this.statusDialog.onSave = (success) => {
      if (success) {
        this.loadLatestStatuses();
        if (this.expandedHistory() === installment.id) {
          this.loadInstallmentHistory(installment.id);
        }
      }
    };
  }
  toggleHistory(installmentId) {
    if (this.expandedHistory() === installmentId) {
      this.expandedHistory.set(null);
      this.installmentHistory.set(null);
    } else {
      this.expandedHistory.set(installmentId);
      this.loadInstallmentHistory(installmentId);
    }
  }
  loadInstallmentHistory(installmentId) {
    this.isLoadingHistory.set(true);
    this.paymentScheduleService.getInstallmentHistory(installmentId).subscribe({
      next: (history) => {
        console.log("\u{1F4DC} Historial de cuota cargado:", history);
        this.installmentHistory.set(history);
        this.isLoadingHistory.set(false);
      },
      error: (error) => {
        console.error("\u274C Error cargando historial:", error);
        this.isLoadingHistory.set(false);
      }
    });
  }
  formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-PE", { day: "2-digit", month: "2-digit", year: "numeric" });
  }
  formatDateTime(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleString("es-PE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }
  getStatusBadgeClass(status) {
    switch (status.toUpperCase()) {
      case "COMPLETED":
      case "COMPLETADO":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-300 dark:border-green-700";
      case "PENDING":
      case "PENDIENTE":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border border-yellow-300 dark:border-yellow-700";
      case "OVERDUE":
      case "VENCIDO":
        return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-700";
      case "CANCELLED":
      case "CANCELADO":
        return "bg-gray-100 dark:bg-gray-700/30 text-gray-800 dark:text-gray-300 border border-gray-300 dark:border-gray-600";
      default:
        return "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-300";
    }
  }
};
_PaymentScheduleViewComponent.\u0275fac = function PaymentScheduleViewComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _PaymentScheduleViewComponent)(\u0275\u0275directiveInject(PaymentScheduleService));
};
_PaymentScheduleViewComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PaymentScheduleViewComponent, selectors: [["app-payment-schedule-view"]], viewQuery: function PaymentScheduleViewComponent_Query(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275viewQuery(_c0, 5);
  }
  if (rf & 2) {
    let _t;
    \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.statusDialog = _t.first);
  }
}, inputs: { managementId: "managementId" }, features: [\u0275\u0275NgOnChangesFeature], decls: 19, vars: 7, consts: [["statusDialog", ""], [1, "bg-white", "dark:bg-slate-900", "rounded-xl", "shadow-lg", "border", "border-slate-200", "dark:border-slate-700", "overflow-hidden"], [1, "bg-gradient-to-r", "from-purple-600", "to-purple-700", "dark:from-purple-700", "dark:to-purple-800", "text-white", "px-6", "py-4"], [1, "flex", "items-center", "justify-between"], [1, "flex", "items-center", "gap-3"], [1, "text-lg", "font-bold"], [1, "text-sm", "opacity-90"], [1, "text-right"], [1, "text-2xl", "font-bold"], [1, "p-8", "flex", "items-center", "justify-center"], [1, "flex", "items-center", "gap-3", "text-slate-600", "dark:text-slate-400"], [1, "overflow-x-auto"], [1, "w-full"], [1, "bg-slate-50", "dark:bg-slate-800/50", "border-b", "border-slate-200", "dark:border-slate-700"], [1, "px-4", "py-3", "text-left", "text-xs", "font-bold", "text-slate-700", "dark:text-slate-300", "uppercase", "tracking-wider"], [1, "px-4", "py-3", "text-right", "text-xs", "font-bold", "text-slate-700", "dark:text-slate-300", "uppercase", "tracking-wider"], [1, "px-4", "py-3", "text-center", "text-xs", "font-bold", "text-slate-700", "dark:text-slate-300", "uppercase", "tracking-wider"], [1, "divide-y", "divide-slate-200", "dark:divide-slate-700"], [1, "px-6", "py-4", "bg-slate-50", "dark:bg-slate-800/50", "border-t", "border-slate-200", "dark:border-slate-700"], [1, "grid", "grid-cols-4", "gap-4", "text-sm"], [1, "text-center"], [1, "text-slate-600", "dark:text-slate-400", "mb-1"], [1, "text-2xl", "font-bold", "text-green-600", "dark:text-green-400"], [1, "text-2xl", "font-bold", "text-yellow-600", "dark:text-yellow-400"], [1, "text-2xl", "font-bold", "text-red-600", "dark:text-red-400"], [1, "text-2xl", "font-bold", "text-gray-600", "dark:text-gray-400"], [1, "hover:bg-slate-50", "dark:hover:bg-slate-800/50", "transition-colors"], [1, "px-4", "py-3"], [1, "flex", "items-center", "gap-2"], [1, "w-8", "h-8", "rounded-full", "bg-purple-100", "dark:bg-purple-900/30", "flex", "items-center", "justify-center"], [1, "text-xs", "font-bold", "text-purple-700", "dark:text-purple-300"], [1, "text-sm", "text-slate-900", "dark:text-slate-100"], [1, "px-4", "py-3", "text-right"], [1, "text-sm", "font-bold", "text-slate-900", "dark:text-slate-100"], [1, "flex", "justify-center"], [1, "px-2", "py-1", "rounded", "text-xs", "font-bold"], [1, "text-sm", "text-slate-400", "dark:text-slate-500"], [1, "flex", "items-center", "justify-center", "gap-2"], ["type", "button", "title", "Actualizar estado", 1, "p-1.5", "hover:bg-purple-100", "dark:hover:bg-purple-900/30", "rounded", "transition-colors", 3, "click"], ["type", "button", "title", "Ver historial", 1, "p-1.5", "rounded", "transition-colors", 3, "click"], ["colspan", "6", 1, "px-4", "py-3", "bg-slate-50", "dark:bg-slate-800/50"], [1, "space-y-2"], [1, "flex", "items-center", "gap-2", "text-sm", "font-bold", "text-slate-700", "dark:text-slate-300", "mb-2"], [1, "flex", "items-center", "gap-2", "text-sm", "text-slate-600", "dark:text-slate-400", "py-2"], [1, "flex", "items-start", "gap-3", "text-xs", "p-2", "bg-white", "dark:bg-slate-900", "rounded", "border", "border-slate-200", "dark:border-slate-700"], [1, "flex-shrink-0", "w-24", "text-slate-600", "dark:text-slate-400"], [1, "flex-1"], [1, "px-2", "py-0.5", "rounded", "font-bold"], [1, "ml-2", "text-slate-700", "dark:text-slate-300"], [1, "mt-1", "text-slate-600", "dark:text-slate-400"], [1, "flex-shrink-0", "text-slate-500", "dark:text-slate-500"]], template: function PaymentScheduleViewComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 1)(1, "div", 2)(2, "div", 3)(3, "div", 4)(4, "div")(5, "h3", 5);
    \u0275\u0275text(6, "Cronograma de Pagos");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p", 6);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(9, "div", 7)(10, "div", 6);
    \u0275\u0275text(11, "Monto Total");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "div", 8);
    \u0275\u0275text(13);
    \u0275\u0275pipe(14, "number");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275conditionalCreate(15, PaymentScheduleViewComponent_Conditional_15_Template, 4, 0, "div", 9);
    \u0275\u0275conditionalCreate(16, PaymentScheduleViewComponent_Conditional_16_Template, 41, 4);
    \u0275\u0275elementEnd();
    \u0275\u0275element(17, "app-installment-status-dialog", null, 0);
  }
  if (rf & 2) {
    let tmp_2_0;
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate1("", ctx.installmentsWithStatus().length, " cuotas programadas");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("S/ ", \u0275\u0275pipeBind2(14, 4, (tmp_2_0 = ctx.schedule()) == null ? null : tmp_2_0.totalAmount, "1.2-2"));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx.isLoading() ? 15 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx.isLoading() && ctx.installmentsWithStatus().length > 0 ? 16 : -1);
  }
}, dependencies: [CommonModule, InstallmentStatusDialogComponent, DecimalPipe], encapsulation: 2 });
var PaymentScheduleViewComponent = _PaymentScheduleViewComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PaymentScheduleViewComponent, [{
    type: Component,
    args: [{ selector: "app-payment-schedule-view", standalone: true, imports: [CommonModule, InstallmentStatusDialogComponent], template: `
    <div class="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">

      <!-- Header -->
      <div class="bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-700 dark:to-purple-800 text-white px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div>
              <h3 class="text-lg font-bold">Cronograma de Pagos</h3>
              <p class="text-sm opacity-90">{{ installmentsWithStatus().length }} cuotas programadas</p>
            </div>
          </div>
          <div class="text-right">
            <div class="text-sm opacity-90">Monto Total</div>
            <div class="text-2xl font-bold">S/ {{ schedule()?.totalAmount | number:'1.2-2' }}</div>
          </div>
        </div>
      </div>

      <!-- Loading state -->
      @if (isLoading()) {
        <div class="p-8 flex items-center justify-center">
          <div class="flex items-center gap-3 text-slate-600 dark:text-slate-400">
            <span>Cargando estados...</span>
          </div>
        </div>
      }

      <!-- Installments Table -->
      @if (!isLoading() && installmentsWithStatus().length > 0) {
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">#</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Fecha Vencimiento</th>
                <th class="px-4 py-3 text-right text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Monto</th>
                <th class="px-4 py-3 text-center text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Estado</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Fecha Pago</th>
                <th class="px-4 py-3 text-center text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
              @for (installment of installmentsWithStatus(); track installment.id) {
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <!-- N\xFAmero de cuota -->
                  <td class="px-4 py-3">
                    <div class="flex items-center gap-2">
                      <div class="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                        <span class="text-xs font-bold text-purple-700 dark:text-purple-300">
                          {{ installment.installmentNumber }}
                        </span>
                      </div>
                    </div>
                  </td>

                  <!-- Fecha Vencimiento -->
                  <td class="px-4 py-3">
                    <div class="text-sm text-slate-900 dark:text-slate-100">
                      {{ formatDate(installment.dueDate) }}
                    </div>
                  </td>

                  <!-- Monto -->
                  <td class="px-4 py-3 text-right">
                    <div class="text-sm font-bold text-slate-900 dark:text-slate-100">
                      S/ {{ installment.amount | number:'1.2-2' }}
                    </div>
                  </td>

                  <!-- Estado -->
                  <td class="px-4 py-3">
                    <div class="flex justify-center">
                      <span class="px-2 py-1 rounded text-xs font-bold"
                            [class]="getStatusBadgeClass(installment.latestStatus?.status || 'PENDIENTE')">
                        {{ installment.latestStatus?.statusDescription || 'Pendiente' }}
                      </span>
                    </div>
                  </td>

                  <!-- Fecha Pago Real -->
                  <td class="px-4 py-3">
                    @if (installment.latestStatus?.actualPaymentDate) {
                      <div class="text-sm text-slate-900 dark:text-slate-100">
                        {{ formatDateTime(installment.latestStatus!.actualPaymentDate!) }}
                      </div>
                    } @else {
                      <div class="text-sm text-slate-400 dark:text-slate-500">-</div>
                    }
                  </td>

                  <!-- Acciones -->
                  <td class="px-4 py-3">
                    <div class="flex items-center justify-center gap-2">
                      <!-- Bot\xF3n editar estado -->
                      <button
                        type="button"
                        (click)="openStatusDialog(installment)"
                        class="p-1.5 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded transition-colors"
                        title="Actualizar estado">
                      </button>

                      <!-- Bot\xF3n ver historial -->
                      <button
                        type="button"
                        (click)="toggleHistory(installment.id)"
                        [class]="expandedHistory() === installment.id
                          ? 'bg-slate-200 dark:bg-slate-700'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800'"
                        class="p-1.5 rounded transition-colors"
                        title="Ver historial">
                      </button>
                    </div>
                  </td>
                </tr>

                <!-- Historial expandible -->
                @if (expandedHistory() === installment.id && installmentHistory()) {
                  <tr>
                    <td colspan="6" class="px-4 py-3 bg-slate-50 dark:bg-slate-800/50">
                      <div class="space-y-2">
                        <div class="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                          <span>Historial de Estados</span>
                        </div>

                        @if (isLoadingHistory()) {
                          <div class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 py-2">
                            <span>Cargando historial...</span>
                          </div>
                        } @else if (installmentHistory() && installmentHistory()!.length > 0) {
                          <div class="space-y-2">
                            @for (historyItem of installmentHistory(); track historyItem.id) {
                              <div class="flex items-start gap-3 text-xs p-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700">
                                <div class="flex-shrink-0 w-24 text-slate-600 dark:text-slate-400">
                                  {{ formatDateTime(historyItem.changeDate) }}
                                </div>
                                <div class="flex-1">
                                  <span class="px-2 py-0.5 rounded font-bold"
                                        [class]="getStatusBadgeClass(historyItem.status)">
                                    {{ historyItem.statusDescription }}
                                  </span>
                                  @if (historyItem.amountPaid) {
                                    <span class="ml-2 text-slate-700 dark:text-slate-300">
                                      S/ {{ historyItem.amountPaid | number:'1.2-2' }}
                                    </span>
                                  }
                                  @if (historyItem.observations) {
                                    <div class="mt-1 text-slate-600 dark:text-slate-400">
                                      {{ historyItem.observations }}
                                    </div>
                                  }
                                </div>
                                <div class="flex-shrink-0 text-slate-500 dark:text-slate-500">
                                  {{ historyItem.registeredBy }}
                                </div>
                              </div>
                            }
                          </div>
                        }
                      </div>
                    </td>
                  </tr>
                }
              }
            </tbody>
          </table>
        </div>

        <!-- Summary -->
        <div class="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700">
          <div class="grid grid-cols-4 gap-4 text-sm">
            <div class="text-center">
              <div class="text-slate-600 dark:text-slate-400 mb-1">Completadas</div>
              <div class="text-2xl font-bold text-green-600 dark:text-green-400">
                {{ summaryStats().completed }}
              </div>
            </div>
            <div class="text-center">
              <div class="text-slate-600 dark:text-slate-400 mb-1">Pendientes</div>
              <div class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {{ summaryStats().pending }}
              </div>
            </div>
            <div class="text-center">
              <div class="text-slate-600 dark:text-slate-400 mb-1">Vencidas</div>
              <div class="text-2xl font-bold text-red-600 dark:text-red-400">
                {{ summaryStats().overdue }}
              </div>
            </div>
            <div class="text-center">
              <div class="text-slate-600 dark:text-slate-400 mb-1">Canceladas</div>
              <div class="text-2xl font-bold text-gray-600 dark:text-gray-400">
                {{ summaryStats().cancelled }}
              </div>
            </div>
          </div>
        </div>
      }

    </div>

    <!-- Dialog -->
    <app-installment-status-dialog #statusDialog />
  ` }]
  }], () => [{ type: PaymentScheduleService }], { managementId: [{
    type: Input
  }], statusDialog: [{
    type: ViewChild,
    args: ["statusDialog"]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PaymentScheduleViewComponent, { className: "PaymentScheduleViewComponent", filePath: "src/app/collection-management/components/payment-schedule-view/payment-schedule-view.component.ts", lineNumber: 220 });
})();

// src/app/shared/components/select-supervisor-modal/select-supervisor-modal.component.ts
var _forTrack02 = ($index, $item) => $item.idUsuario;
function SelectSupervisorModalComponent_Conditional_0_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "div", 6);
    \u0275\u0275domElement(1, "div", 11);
    \u0275\u0275domElementStart(2, "p");
    \u0275\u0275text(3, "Buscando supervisores en l\xEDnea...");
    \u0275\u0275domElementEnd()();
  }
}
function SelectSupervisorModalComponent_Conditional_0_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275domElementStart(0, "div", 7)(1, "span", 12);
    \u0275\u0275text(2, "\u26A0\uFE0F");
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(3, "p", 13);
    \u0275\u0275text(4, "No hay supervisores en l\xEDnea");
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(5, "p", 14);
    \u0275\u0275text(6, "Intenta de nuevo m\xE1s tarde o contacta a un administrador");
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(7, "button", 15);
    \u0275\u0275domListener("click", function SelectSupervisorModalComponent_Conditional_0_Conditional_9_Template_button_click_7_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.cargarSupervisores());
    });
    \u0275\u0275text(8, " \u{1F504} Reintentar ");
    \u0275\u0275domElementEnd()();
  }
}
function SelectSupervisorModalComponent_Conditional_0_Conditional_10_For_4_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "span", 28);
    \u0275\u0275text(1);
    \u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const supervisor_r5 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", supervisor_r5.solicitudesPendientes, " pendiente(s) ");
  }
}
function SelectSupervisorModalComponent_Conditional_0_Conditional_10_For_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275domElementStart(0, "div", 19);
    \u0275\u0275domListener("click", function SelectSupervisorModalComponent_Conditional_0_Conditional_10_For_4_Template_div_click_0_listener() {
      const supervisor_r5 = \u0275\u0275restoreView(_r4).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.selectSupervisor(supervisor_r5));
    });
    \u0275\u0275domElementStart(1, "div", 20)(2, "input", 21);
    \u0275\u0275domListener("change", function SelectSupervisorModalComponent_Conditional_0_Conditional_10_For_4_Template_input_change_2_listener() {
      const supervisor_r5 = \u0275\u0275restoreView(_r4).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.selectSupervisor(supervisor_r5));
    });
    \u0275\u0275domElementEnd()();
    \u0275\u0275domElementStart(3, "div", 22)(4, "div", 23)(5, "span", 24);
    \u0275\u0275text(6, "\u{1F464}");
    \u0275\u0275domElementEnd();
    \u0275\u0275text(7);
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(8, "div", 25)(9, "span", 26);
    \u0275\u0275text(10);
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(11, "span", 27);
    \u0275\u0275text(12);
    \u0275\u0275domElementEnd();
    \u0275\u0275conditionalCreate(13, SelectSupervisorModalComponent_Conditional_0_Conditional_10_For_4_Conditional_13_Template, 2, 1, "span", 28);
    \u0275\u0275domElementEnd()()();
  }
  if (rf & 2) {
    const supervisor_r5 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275classProp("selected", (ctx_r1.supervisorSeleccionado == null ? null : ctx_r1.supervisorSeleccionado.idUsuario) === supervisor_r5.idUsuario);
    \u0275\u0275advance(2);
    \u0275\u0275domProperty("name", "supervisor")("value", supervisor_r5.idUsuario)("checked", (ctx_r1.supervisorSeleccionado == null ? null : ctx_r1.supervisorSeleccionado.idUsuario) === supervisor_r5.idUsuario);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1(" ", supervisor_r5.nombreCompleto, " ");
    \u0275\u0275advance(2);
    \u0275\u0275classProp("admin", supervisor_r5.rol === "ADMIN");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", supervisor_r5.rol, " ");
    \u0275\u0275advance();
    \u0275\u0275classMap(ctx_r1.getEstadoClass(supervisor_r5.estado));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", supervisor_r5.estado, " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(supervisor_r5.solicitudesPendientes && supervisor_r5.solicitudesPendientes > 0 ? 13 : -1);
  }
}
function SelectSupervisorModalComponent_Conditional_0_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "p", 16);
    \u0275\u0275text(1, "Selecciona a qui\xE9n enviar la solicitud de autorizaci\xF3n:");
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(2, "div", 17);
    \u0275\u0275repeaterCreate(3, SelectSupervisorModalComponent_Conditional_0_Conditional_10_For_4_Template, 14, 13, "div", 18, _forTrack02);
    \u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r1.supervisores());
  }
}
function SelectSupervisorModalComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275domElementStart(0, "div", 1);
    \u0275\u0275domListener("click", function SelectSupervisorModalComponent_Conditional_0_Template_div_click_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onOverlayClick($event));
    });
    \u0275\u0275domElementStart(1, "div", 2)(2, "div", 3)(3, "h2");
    \u0275\u0275text(4, "\u{1F510} Seleccionar Supervisor para Autorizaci\xF3n");
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(5, "button", 4);
    \u0275\u0275domListener("click", function SelectSupervisorModalComponent_Conditional_0_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onCancel());
    });
    \u0275\u0275text(6, "\xD7");
    \u0275\u0275domElementEnd()();
    \u0275\u0275domElementStart(7, "div", 5);
    \u0275\u0275conditionalCreate(8, SelectSupervisorModalComponent_Conditional_0_Conditional_8_Template, 4, 0, "div", 6)(9, SelectSupervisorModalComponent_Conditional_0_Conditional_9_Template, 9, 0, "div", 7)(10, SelectSupervisorModalComponent_Conditional_0_Conditional_10_Template, 5, 0);
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(11, "div", 8)(12, "button", 9);
    \u0275\u0275domListener("click", function SelectSupervisorModalComponent_Conditional_0_Template_button_click_12_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onCancel());
    });
    \u0275\u0275text(13, " Cancelar ");
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(14, "button", 10);
    \u0275\u0275domListener("click", function SelectSupervisorModalComponent_Conditional_0_Template_button_click_14_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onConfirm());
    });
    \u0275\u0275text(15, " \u{1F4E4} Enviar Solicitud ");
    \u0275\u0275domElementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(8);
    \u0275\u0275conditional(ctx_r1.cargando() ? 8 : ctx_r1.supervisores().length === 0 ? 9 : 10);
    \u0275\u0275advance(6);
    \u0275\u0275domProperty("disabled", !ctx_r1.supervisorSeleccionado || ctx_r1.cargando());
  }
}
var _SelectSupervisorModalComponent = class _SelectSupervisorModalComponent {
  constructor(autorizacionService) {
    this.autorizacionService = autorizacionService;
    this.visible = false;
    this.visibleChange = new EventEmitter();
    this.supervisorSelected = new EventEmitter();
    this.cancelled = new EventEmitter();
    this.supervisores = signal([], ...ngDevMode ? [{ debugName: "supervisores" }] : []);
    this.cargando = signal(false, ...ngDevMode ? [{ debugName: "cargando" }] : []);
    this.supervisorSeleccionado = null;
  }
  ngOnInit() {
  }
  ngOnChanges(changes) {
    if (changes["visible"] && changes["visible"].currentValue === true) {
      this.cargarSupervisores();
    }
  }
  cargarSupervisores() {
    this.cargando.set(true);
    this.autorizacionService.obtenerSupervisoresEnLinea().subscribe({
      next: (supervisores) => {
        this.supervisores.set(supervisores);
        this.cargando.set(false);
      },
      error: (error) => {
        console.error("[SELECT-SUPERVISOR] Error al cargar supervisores:", error);
        this.cargando.set(false);
      }
    });
  }
  selectSupervisor(supervisor) {
    this.supervisorSeleccionado = supervisor;
  }
  getEstadoClass(estado) {
    switch (estado) {
      case "DISPONIBLE":
      case "CONECTADO":
        return "disponible";
      case "EN_LLAMADA":
        return "en-llamada";
      case "DESCONECTADO":
        return "desconectado";
      default:
        return "";
    }
  }
  onOverlayClick(event) {
    if (event.target.classList.contains("modal-overlay")) {
      this.onCancel();
    }
  }
  onConfirm() {
    if (this.supervisorSeleccionado) {
      this.supervisorSelected.emit(this.supervisorSeleccionado);
      this.closeModal();
    }
  }
  onCancel() {
    this.cancelled.emit();
    this.closeModal();
  }
  closeModal() {
    this.visible = false;
    this.visibleChange.emit(false);
    this.supervisorSeleccionado = null;
  }
};
_SelectSupervisorModalComponent.\u0275fac = function SelectSupervisorModalComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _SelectSupervisorModalComponent)(\u0275\u0275directiveInject(AutorizacionService));
};
_SelectSupervisorModalComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SelectSupervisorModalComponent, selectors: [["app-select-supervisor-modal"]], inputs: { visible: "visible" }, outputs: { visibleChange: "visibleChange", supervisorSelected: "supervisorSelected", cancelled: "cancelled" }, features: [\u0275\u0275NgOnChangesFeature], decls: 1, vars: 1, consts: [[1, "modal-overlay"], [1, "modal-overlay", 3, "click"], [1, "modal-container"], [1, "modal-header"], [1, "close-btn", 3, "click"], [1, "modal-content"], [1, "loading-container"], [1, "no-supervisors"], [1, "modal-footer"], [1, "btn", "btn-cancel", 3, "click"], [1, "btn", "btn-primary", 3, "click", "disabled"], [1, "spinner"], [1, "warning-icon"], [1, "title"], [1, "subtitle"], [1, "retry-btn", 3, "click"], [1, "instruction"], [1, "supervisors-list"], [1, "supervisor-card", 3, "selected"], [1, "supervisor-card", 3, "click"], [1, "radio-container"], ["type", "radio", 3, "change", "name", "value", "checked"], [1, "supervisor-info"], [1, "name"], [1, "user-icon"], [1, "details"], [1, "rol-badge"], [1, "estado-badge"], [1, "pendientes-badge"]], template: function SelectSupervisorModalComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, SelectSupervisorModalComponent_Conditional_0_Template, 16, 2, "div", 0);
  }
  if (rf & 2) {
    \u0275\u0275conditional(ctx.visible ? 0 : -1);
  }
}, dependencies: [CommonModule, FormsModule], styles: ["\n\n.modal-overlay[_ngcontent-%COMP%] {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background: rgba(0, 0, 0, 0.5);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 10000;\n  animation: _ngcontent-%COMP%_fadeIn 0.2s ease-out;\n}\n@keyframes _ngcontent-%COMP%_fadeIn {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n.modal-container[_ngcontent-%COMP%] {\n  background: white;\n  border-radius: 12px;\n  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);\n  width: 90%;\n  max-width: 550px;\n  max-height: 90vh;\n  display: flex;\n  flex-direction: column;\n  animation: _ngcontent-%COMP%_slideUp 0.3s ease-out;\n}\n@keyframes _ngcontent-%COMP%_slideUp {\n  from {\n    opacity: 0;\n    transform: translateY(20px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n.modal-header[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 1rem 1.5rem;\n  border-bottom: 1px solid #e5e7eb;\n  background:\n    linear-gradient(\n      135deg,\n      #3b82f6,\n      #1d4ed8);\n  border-radius: 12px 12px 0 0;\n  color: white;\n}\n.modal-header[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 1.1rem;\n  font-weight: 600;\n}\n.close-btn[_ngcontent-%COMP%] {\n  background: none;\n  border: none;\n  color: white;\n  font-size: 1.5rem;\n  cursor: pointer;\n  padding: 0;\n  line-height: 1;\n  opacity: 0.8;\n  transition: opacity 0.2s;\n}\n.close-btn[_ngcontent-%COMP%]:hover {\n  opacity: 1;\n}\n.modal-content[_ngcontent-%COMP%] {\n  padding: 1.5rem;\n  overflow-y: auto;\n  flex: 1;\n  min-height: 200px;\n}\n.loading-container[_ngcontent-%COMP%], \n.no-supervisors[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  min-height: 200px;\n  text-align: center;\n}\n.spinner[_ngcontent-%COMP%] {\n  width: 40px;\n  height: 40px;\n  border: 3px solid #e5e7eb;\n  border-top-color: #3b82f6;\n  border-radius: 50%;\n  animation: _ngcontent-%COMP%_spin 1s linear infinite;\n  margin-bottom: 1rem;\n}\n@keyframes _ngcontent-%COMP%_spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n.warning-icon[_ngcontent-%COMP%] {\n  font-size: 3rem;\n  margin-bottom: 1rem;\n}\n.no-supervisors[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%] {\n  font-size: 1.1rem;\n  font-weight: 600;\n  color: #374151;\n  margin: 0 0 0.5rem 0;\n}\n.no-supervisors[_ngcontent-%COMP%]   .subtitle[_ngcontent-%COMP%] {\n  color: #6b7280;\n  margin: 0 0 1rem 0;\n}\n.retry-btn[_ngcontent-%COMP%] {\n  padding: 0.5rem 1rem;\n  border: 1px solid #3b82f6;\n  background: white;\n  color: #3b82f6;\n  border-radius: 6px;\n  cursor: pointer;\n  transition: all 0.2s;\n}\n.retry-btn[_ngcontent-%COMP%]:hover {\n  background: #eff6ff;\n}\n.instruction[_ngcontent-%COMP%] {\n  color: #6b7280;\n  margin: 0 0 1rem 0;\n  font-size: 0.875rem;\n}\n.supervisors-list[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 0.75rem;\n}\n.supervisor-card[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 1rem;\n  padding: 1rem;\n  border: 2px solid #e5e7eb;\n  border-radius: 10px;\n  cursor: pointer;\n  transition: all 0.2s;\n}\n.supervisor-card[_ngcontent-%COMP%]:hover {\n  border-color: #93c5fd;\n  background: #f0f9ff;\n}\n.supervisor-card.selected[_ngcontent-%COMP%] {\n  border-color: #3b82f6;\n  background: #eff6ff;\n}\n.radio-container[_ngcontent-%COMP%] {\n  flex-shrink: 0;\n}\n.radio-container[_ngcontent-%COMP%]   input[type=radio][_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  accent-color: #3b82f6;\n  cursor: pointer;\n}\n.supervisor-info[_ngcontent-%COMP%] {\n  flex: 1;\n}\n.name[_ngcontent-%COMP%] {\n  font-weight: 600;\n  color: #1f2937;\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  margin-bottom: 0.5rem;\n}\n.user-icon[_ngcontent-%COMP%] {\n  font-size: 1rem;\n}\n.details[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.5rem;\n}\n.rol-badge[_ngcontent-%COMP%] {\n  padding: 0.2rem 0.5rem;\n  border-radius: 4px;\n  font-size: 0.7rem;\n  font-weight: 600;\n  text-transform: uppercase;\n  background: #dbeafe;\n  color: #1d4ed8;\n}\n.rol-badge.admin[_ngcontent-%COMP%] {\n  background: #fee2e2;\n  color: #dc2626;\n}\n.estado-badge[_ngcontent-%COMP%] {\n  padding: 0.2rem 0.5rem;\n  border-radius: 4px;\n  font-size: 0.7rem;\n  font-weight: 600;\n}\n.estado-badge.disponible[_ngcontent-%COMP%] {\n  background: #dcfce7;\n  color: #166534;\n}\n.estado-badge.en-llamada[_ngcontent-%COMP%] {\n  background: #fef3c7;\n  color: #92400e;\n}\n.estado-badge.desconectado[_ngcontent-%COMP%] {\n  background: #fee2e2;\n  color: #dc2626;\n}\n.pendientes-badge[_ngcontent-%COMP%] {\n  padding: 0.2rem 0.5rem;\n  border-radius: 4px;\n  font-size: 0.7rem;\n  font-weight: 600;\n  background: #fef3c7;\n  color: #92400e;\n}\n.modal-footer[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: flex-end;\n  gap: 0.75rem;\n  padding: 1rem 1.5rem;\n  border-top: 1px solid #e5e7eb;\n  background: #f9fafb;\n  border-radius: 0 0 12px 12px;\n}\n.btn[_ngcontent-%COMP%] {\n  padding: 0.625rem 1.25rem;\n  border-radius: 8px;\n  font-weight: 500;\n  cursor: pointer;\n  transition: all 0.2s;\n}\n.btn-cancel[_ngcontent-%COMP%] {\n  background: white;\n  border: 1px solid #d1d5db;\n  color: #374151;\n}\n.btn-cancel[_ngcontent-%COMP%]:hover {\n  background: #f3f4f6;\n}\n.btn-primary[_ngcontent-%COMP%] {\n  background: #3b82f6;\n  border: none;\n  color: white;\n}\n.btn-primary[_ngcontent-%COMP%]:hover:not(:disabled) {\n  background: #2563eb;\n}\n.btn-primary[_ngcontent-%COMP%]:disabled {\n  background: #93c5fd;\n  cursor: not-allowed;\n}\n/*# sourceMappingURL=select-supervisor-modal.component.css.map */"] });
var SelectSupervisorModalComponent = _SelectSupervisorModalComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SelectSupervisorModalComponent, [{
    type: Component,
    args: [{ selector: "app-select-supervisor-modal", standalone: true, imports: [CommonModule, FormsModule], template: `
    @if (visible) {
      <div class="modal-overlay" (click)="onOverlayClick($event)">
        <div class="modal-container">
          <!-- Header -->
          <div class="modal-header">
            <h2>\u{1F510} Seleccionar Supervisor para Autorizaci\xF3n</h2>
            <button class="close-btn" (click)="onCancel()">&times;</button>
          </div>

          <!-- Content -->
          <div class="modal-content">
            @if (cargando()) {
              <div class="loading-container">
                <div class="spinner"></div>
                <p>Buscando supervisores en l\xEDnea...</p>
              </div>
            } @else if (supervisores().length === 0) {
              <div class="no-supervisors">
                <span class="warning-icon">\u26A0\uFE0F</span>
                <p class="title">No hay supervisores en l\xEDnea</p>
                <p class="subtitle">Intenta de nuevo m\xE1s tarde o contacta a un administrador</p>
                <button class="retry-btn" (click)="cargarSupervisores()">
                  \u{1F504} Reintentar
                </button>
              </div>
            } @else {
              <p class="instruction">Selecciona a qui\xE9n enviar la solicitud de autorizaci\xF3n:</p>

              <div class="supervisors-list">
                @for (supervisor of supervisores(); track supervisor.idUsuario) {
                  <div
                    class="supervisor-card"
                    [class.selected]="supervisorSeleccionado?.idUsuario === supervisor.idUsuario"
                    (click)="selectSupervisor(supervisor)">
                    <div class="radio-container">
                      <input
                        type="radio"
                        [name]="'supervisor'"
                        [value]="supervisor.idUsuario"
                        [checked]="supervisorSeleccionado?.idUsuario === supervisor.idUsuario"
                        (change)="selectSupervisor(supervisor)">
                    </div>
                    <div class="supervisor-info">
                      <div class="name">
                        <span class="user-icon">\u{1F464}</span>
                        {{ supervisor.nombreCompleto }}
                      </div>
                      <div class="details">
                        <span class="rol-badge" [class.admin]="supervisor.rol === 'ADMIN'">
                          {{ supervisor.rol }}
                        </span>
                        <span class="estado-badge" [class]="getEstadoClass(supervisor.estado)">
                          {{ supervisor.estado }}
                        </span>
                        @if (supervisor.solicitudesPendientes && supervisor.solicitudesPendientes > 0) {
                          <span class="pendientes-badge">
                            {{ supervisor.solicitudesPendientes }} pendiente(s)
                          </span>
                        }
                      </div>
                    </div>
                  </div>
                }
              </div>
            }
          </div>

          <!-- Footer -->
          <div class="modal-footer">
            <button class="btn btn-cancel" (click)="onCancel()">
              Cancelar
            </button>
            <button
              class="btn btn-primary"
              [disabled]="!supervisorSeleccionado || cargando()"
              (click)="onConfirm()">
              \u{1F4E4} Enviar Solicitud
            </button>
          </div>
        </div>
      </div>
    }
  `, styles: ["/* angular:styles/component:css;43bb8bb7130b61ec50e6cb5611226beb34059d3ce517f6e14c493dbc6b23fba3;C:/Users/HP/Documents/Kubito-2.0-v1/cashi-discador-frontend/cashi-discador-frontend/src/app/shared/components/select-supervisor-modal/select-supervisor-modal.component.ts */\n.modal-overlay {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background: rgba(0, 0, 0, 0.5);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 10000;\n  animation: fadeIn 0.2s ease-out;\n}\n@keyframes fadeIn {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n.modal-container {\n  background: white;\n  border-radius: 12px;\n  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);\n  width: 90%;\n  max-width: 550px;\n  max-height: 90vh;\n  display: flex;\n  flex-direction: column;\n  animation: slideUp 0.3s ease-out;\n}\n@keyframes slideUp {\n  from {\n    opacity: 0;\n    transform: translateY(20px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n.modal-header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 1rem 1.5rem;\n  border-bottom: 1px solid #e5e7eb;\n  background:\n    linear-gradient(\n      135deg,\n      #3b82f6,\n      #1d4ed8);\n  border-radius: 12px 12px 0 0;\n  color: white;\n}\n.modal-header h2 {\n  margin: 0;\n  font-size: 1.1rem;\n  font-weight: 600;\n}\n.close-btn {\n  background: none;\n  border: none;\n  color: white;\n  font-size: 1.5rem;\n  cursor: pointer;\n  padding: 0;\n  line-height: 1;\n  opacity: 0.8;\n  transition: opacity 0.2s;\n}\n.close-btn:hover {\n  opacity: 1;\n}\n.modal-content {\n  padding: 1.5rem;\n  overflow-y: auto;\n  flex: 1;\n  min-height: 200px;\n}\n.loading-container,\n.no-supervisors {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  min-height: 200px;\n  text-align: center;\n}\n.spinner {\n  width: 40px;\n  height: 40px;\n  border: 3px solid #e5e7eb;\n  border-top-color: #3b82f6;\n  border-radius: 50%;\n  animation: spin 1s linear infinite;\n  margin-bottom: 1rem;\n}\n@keyframes spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n.warning-icon {\n  font-size: 3rem;\n  margin-bottom: 1rem;\n}\n.no-supervisors .title {\n  font-size: 1.1rem;\n  font-weight: 600;\n  color: #374151;\n  margin: 0 0 0.5rem 0;\n}\n.no-supervisors .subtitle {\n  color: #6b7280;\n  margin: 0 0 1rem 0;\n}\n.retry-btn {\n  padding: 0.5rem 1rem;\n  border: 1px solid #3b82f6;\n  background: white;\n  color: #3b82f6;\n  border-radius: 6px;\n  cursor: pointer;\n  transition: all 0.2s;\n}\n.retry-btn:hover {\n  background: #eff6ff;\n}\n.instruction {\n  color: #6b7280;\n  margin: 0 0 1rem 0;\n  font-size: 0.875rem;\n}\n.supervisors-list {\n  display: flex;\n  flex-direction: column;\n  gap: 0.75rem;\n}\n.supervisor-card {\n  display: flex;\n  align-items: center;\n  gap: 1rem;\n  padding: 1rem;\n  border: 2px solid #e5e7eb;\n  border-radius: 10px;\n  cursor: pointer;\n  transition: all 0.2s;\n}\n.supervisor-card:hover {\n  border-color: #93c5fd;\n  background: #f0f9ff;\n}\n.supervisor-card.selected {\n  border-color: #3b82f6;\n  background: #eff6ff;\n}\n.radio-container {\n  flex-shrink: 0;\n}\n.radio-container input[type=radio] {\n  width: 18px;\n  height: 18px;\n  accent-color: #3b82f6;\n  cursor: pointer;\n}\n.supervisor-info {\n  flex: 1;\n}\n.name {\n  font-weight: 600;\n  color: #1f2937;\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  margin-bottom: 0.5rem;\n}\n.user-icon {\n  font-size: 1rem;\n}\n.details {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.5rem;\n}\n.rol-badge {\n  padding: 0.2rem 0.5rem;\n  border-radius: 4px;\n  font-size: 0.7rem;\n  font-weight: 600;\n  text-transform: uppercase;\n  background: #dbeafe;\n  color: #1d4ed8;\n}\n.rol-badge.admin {\n  background: #fee2e2;\n  color: #dc2626;\n}\n.estado-badge {\n  padding: 0.2rem 0.5rem;\n  border-radius: 4px;\n  font-size: 0.7rem;\n  font-weight: 600;\n}\n.estado-badge.disponible {\n  background: #dcfce7;\n  color: #166534;\n}\n.estado-badge.en-llamada {\n  background: #fef3c7;\n  color: #92400e;\n}\n.estado-badge.desconectado {\n  background: #fee2e2;\n  color: #dc2626;\n}\n.pendientes-badge {\n  padding: 0.2rem 0.5rem;\n  border-radius: 4px;\n  font-size: 0.7rem;\n  font-weight: 600;\n  background: #fef3c7;\n  color: #92400e;\n}\n.modal-footer {\n  display: flex;\n  justify-content: flex-end;\n  gap: 0.75rem;\n  padding: 1rem 1.5rem;\n  border-top: 1px solid #e5e7eb;\n  background: #f9fafb;\n  border-radius: 0 0 12px 12px;\n}\n.btn {\n  padding: 0.625rem 1.25rem;\n  border-radius: 8px;\n  font-weight: 500;\n  cursor: pointer;\n  transition: all 0.2s;\n}\n.btn-cancel {\n  background: white;\n  border: 1px solid #d1d5db;\n  color: #374151;\n}\n.btn-cancel:hover {\n  background: #f3f4f6;\n}\n.btn-primary {\n  background: #3b82f6;\n  border: none;\n  color: white;\n}\n.btn-primary:hover:not(:disabled) {\n  background: #2563eb;\n}\n.btn-primary:disabled {\n  background: #93c5fd;\n  cursor: not-allowed;\n}\n/*# sourceMappingURL=select-supervisor-modal.component.css.map */\n"] }]
  }], () => [{ type: AutorizacionService }], { visible: [{
    type: Input
  }], visibleChange: [{
    type: Output
  }], supervisorSelected: [{
    type: Output
  }], cancelled: [{
    type: Output
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SelectSupervisorModalComponent, { className: "SelectSupervisorModalComponent", filePath: "src/app/shared/components/select-supervisor-modal/select-supervisor-modal.component.ts", lineNumber: 389 });
})();

// src/app/collection-management/services/comprobante.service.ts
var _ComprobanteService = class _ComprobanteService {
  constructor() {
    this.http = inject(HttpClient);
    this.baseUrl = `${environment.apiUrl}/v2/comprobantes`;
  }
  /**
   * Sube un comprobante de pago y lo valida con OCR
   * @param file Archivo de imagen del comprobante
   * @param request Datos de la solicitud
   */
  uploadComprobante(file, request) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("idCuota", request.idCuota.toString());
    formData.append("idAgente", request.idAgente.toString());
    if (request.montoEsperado !== void 0) {
      formData.append("montoEsperado", request.montoEsperado.toString());
    }
    if (request.documentoEsperado) {
      formData.append("documentoEsperado", request.documentoEsperado);
    }
    if (request.nombreEsperado) {
      formData.append("nombreEsperado", request.nombreEsperado);
    }
    if (request.idGestion !== void 0) {
      formData.append("idGestion", request.idGestion.toString());
    }
    if (request.descripcion) {
      formData.append("descripcion", request.descripcion);
    }
    if (request.validarConOcr !== void 0) {
      formData.append("validarConOcr", request.validarConOcr.toString());
    }
    return this.http.post(`${this.baseUrl}/upload`, formData);
  }
  /**
   * Obtiene los comprobantes asociados a una cuota
   * @param cuotaId ID de la cuota
   */
  getComprobantesByCuota(cuotaId) {
    return this.http.get(`${this.baseUrl}/cuota/${cuotaId}`);
  }
  /**
   * Asocia un comprobante existente a una gestión
   * @param uuid UUID del comprobante
   * @param idGestion ID de la gestión
   */
  asociarAGestion(uuid, idGestion) {
    return this.http.post(`${this.baseUrl}/${uuid}/asociar-gestion/${idGestion}`, {});
  }
};
_ComprobanteService.\u0275fac = function ComprobanteService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _ComprobanteService)();
};
_ComprobanteService.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ComprobanteService, factory: _ComprobanteService.\u0275fac, providedIn: "root" });
var ComprobanteService = _ComprobanteService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ComprobanteService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/collection-management/components/comprobante-upload-dialog/comprobante-upload-dialog.component.ts
function ComprobanteUploadDialogComponent_Conditional_29_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 23);
    \u0275\u0275listener("click", function ComprobanteUploadDialogComponent_Conditional_29_Template_div_click_0_listener() {
      \u0275\u0275restoreView(_r1);
      const fileInput_r2 = \u0275\u0275reference(13);
      return \u0275\u0275resetView(fileInput_r2.click());
    })("dragover", function ComprobanteUploadDialogComponent_Conditional_29_Template_div_dragover_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.onDragOver($event));
    })("drop", function ComprobanteUploadDialogComponent_Conditional_29_Template_div_drop_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.onDrop($event));
    });
    \u0275\u0275elementStart(1, "div", 24)(2, "mat-icon", 25);
    \u0275\u0275text(3, "cloud_upload");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "p", 26);
    \u0275\u0275text(5, "Arrastra una imagen aqu\xED");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p", 27);
    \u0275\u0275text(7, " o ");
    \u0275\u0275elementStart(8, "span", 28);
    \u0275\u0275text(9, "haz clic para seleccionar");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "p", 29);
    \u0275\u0275text(11, "JPG, PNG, WebP - M\xE1ximo 5MB");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "input", 30, 0);
    \u0275\u0275listener("change", function ComprobanteUploadDialogComponent_Conditional_29_Template_input_change_12_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.onFileSelected($event));
    });
    \u0275\u0275elementEnd();
  }
}
function ComprobanteUploadDialogComponent_Conditional_30_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 15);
    \u0275\u0275element(1, "img", 31);
    \u0275\u0275elementStart(2, "button", 32);
    \u0275\u0275listener("click", function ComprobanteUploadDialogComponent_Conditional_30_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.removeFile());
    });
    \u0275\u0275elementStart(3, "mat-icon", 33);
    \u0275\u0275text(4, "close");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "div", 34)(6, "p", 35)(7, "mat-icon", 36);
    \u0275\u0275text(8, "insert_drive_file");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "span", 37);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "span", 38);
    \u0275\u0275text(12, "-");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "span", 39);
    \u0275\u0275text(14);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    let tmp_2_0;
    let tmp_3_0;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("src", ctx_r2.previewUrl(), \u0275\u0275sanitizeUrl);
    \u0275\u0275advance(9);
    \u0275\u0275textInterpolate((tmp_2_0 = ctx_r2.selectedFile()) == null ? null : tmp_2_0.name);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r2.formatFileSize(((tmp_3_0 = ctx_r2.selectedFile()) == null ? null : tmp_3_0.size) || 0));
  }
}
function ComprobanteUploadDialogComponent_Conditional_31_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 16)(1, "div", 40);
    \u0275\u0275element(2, "div", 41)(3, "mat-spinner", 42);
    \u0275\u0275elementStart(4, "div", 43)(5, "mat-icon", 44);
    \u0275\u0275text(6, "document_scanner");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(7, "p", 45);
    \u0275\u0275text(8, "Analizando con IA...");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "div", 46);
    \u0275\u0275element(10, "span", 47)(11, "span", 48)(12, "span", 49);
    \u0275\u0275elementEnd()();
  }
}
function ComprobanteUploadDialogComponent_Conditional_32_Conditional_11_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon", 79);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_3_0;
    let tmp_4_0;
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275classMap(((tmp_3_0 = ctx_r2.uploadResponse()) == null ? null : tmp_3_0.validacionMonto == null ? null : tmp_3_0.validacionMonto.coincide) ? "text-green-500" : "text-amber-500");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ((tmp_4_0 = ctx_r2.uploadResponse()) == null ? null : tmp_4_0.validacionMonto == null ? null : tmp_4_0.validacionMonto.coincide) ? "check_circle" : "warning", " ");
  }
}
function ComprobanteUploadDialogComponent_Conditional_32_Conditional_11_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 80)(1, "mat-icon", 81);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_3_0;
    let tmp_4_0;
    let tmp_5_0;
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275classMap(((tmp_3_0 = ctx_r2.uploadResponse()) == null ? null : tmp_3_0.validacionMonto == null ? null : tmp_3_0.validacionMonto.coincide) ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(((tmp_4_0 = ctx_r2.uploadResponse()) == null ? null : tmp_4_0.validacionMonto == null ? null : tmp_4_0.validacionMonto.coincide) ? "check" : "priority_high");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ((tmp_5_0 = ctx_r2.uploadResponse()) == null ? null : tmp_5_0.validacionMonto == null ? null : tmp_5_0.validacionMonto.coincide) ? "OK" : "No coincide", " ");
  }
}
function ComprobanteUploadDialogComponent_Conditional_32_Conditional_11_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon", 79);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_3_0;
    let tmp_4_0;
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275classMap(((tmp_3_0 = ctx_r2.uploadResponse()) == null ? null : tmp_3_0.validacionDocumento == null ? null : tmp_3_0.validacionDocumento.coincide) ? "text-green-500" : "text-amber-500");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ((tmp_4_0 = ctx_r2.uploadResponse()) == null ? null : tmp_4_0.validacionDocumento == null ? null : tmp_4_0.validacionDocumento.coincide) ? "check_circle" : "warning", " ");
  }
}
function ComprobanteUploadDialogComponent_Conditional_32_Conditional_11_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 80)(1, "mat-icon", 81);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_3_0;
    let tmp_4_0;
    let tmp_5_0;
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275classMap(((tmp_3_0 = ctx_r2.uploadResponse()) == null ? null : tmp_3_0.validacionDocumento == null ? null : tmp_3_0.validacionDocumento.coincide) ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(((tmp_4_0 = ctx_r2.uploadResponse()) == null ? null : tmp_4_0.validacionDocumento == null ? null : tmp_4_0.validacionDocumento.coincide) ? "check" : "priority_high");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ((tmp_5_0 = ctx_r2.uploadResponse()) == null ? null : tmp_5_0.validacionDocumento == null ? null : tmp_5_0.validacionDocumento.coincide) ? "OK" : "No coincide", " ");
  }
}
function ComprobanteUploadDialogComponent_Conditional_32_Conditional_11_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon", 79);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_3_0;
    let tmp_4_0;
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275classMap(((tmp_3_0 = ctx_r2.uploadResponse()) == null ? null : tmp_3_0.validacionNombre == null ? null : tmp_3_0.validacionNombre.coincide) ? "text-green-500" : "text-amber-500");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ((tmp_4_0 = ctx_r2.uploadResponse()) == null ? null : tmp_4_0.validacionNombre == null ? null : tmp_4_0.validacionNombre.coincide) ? "check_circle" : "warning", " ");
  }
}
function ComprobanteUploadDialogComponent_Conditional_32_Conditional_11_Conditional_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 80)(1, "mat-icon", 81);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_3_0;
    let tmp_4_0;
    let tmp_5_0;
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275classMap(((tmp_3_0 = ctx_r2.uploadResponse()) == null ? null : tmp_3_0.validacionNombre == null ? null : tmp_3_0.validacionNombre.coincide) ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(((tmp_4_0 = ctx_r2.uploadResponse()) == null ? null : tmp_4_0.validacionNombre == null ? null : tmp_4_0.validacionNombre.coincide) ? "check" : "priority_high");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ((tmp_5_0 = ctx_r2.uploadResponse()) == null ? null : tmp_5_0.validacionNombre == null ? null : tmp_5_0.validacionNombre.coincide) ? "OK" : "No coincide", " ");
  }
}
function ComprobanteUploadDialogComponent_Conditional_32_Conditional_11_Conditional_26_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 83)(1, "mat-icon", 84);
    \u0275\u0275text(2, "account_balance");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 85);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_4_0;
    const ctx_r2 = \u0275\u0275nextContext(4);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate((tmp_4_0 = ctx_r2.uploadResponse()) == null ? null : tmp_4_0.ocrResult == null ? null : tmp_4_0.ocrResult.banco);
  }
}
function ComprobanteUploadDialogComponent_Conditional_32_Conditional_11_Conditional_26_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 83)(1, "mat-icon", 84);
    \u0275\u0275text(2, "tag");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 85);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_4_0;
    const ctx_r2 = \u0275\u0275nextContext(4);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate((tmp_4_0 = ctx_r2.uploadResponse()) == null ? null : tmp_4_0.ocrResult == null ? null : tmp_4_0.ocrResult.numeroOperacion);
  }
}
function ComprobanteUploadDialogComponent_Conditional_32_Conditional_11_Conditional_26_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 83)(1, "mat-icon", 84);
    \u0275\u0275text(2, "event");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 85);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_4_0;
    const ctx_r2 = \u0275\u0275nextContext(4);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate((tmp_4_0 = ctx_r2.uploadResponse()) == null ? null : tmp_4_0.ocrResult == null ? null : tmp_4_0.ocrResult.fecha);
  }
}
function ComprobanteUploadDialogComponent_Conditional_32_Conditional_11_Conditional_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 78)(1, "div", 82);
    \u0275\u0275conditionalCreate(2, ComprobanteUploadDialogComponent_Conditional_32_Conditional_11_Conditional_26_Conditional_2_Template, 5, 1, "div", 83);
    \u0275\u0275conditionalCreate(3, ComprobanteUploadDialogComponent_Conditional_32_Conditional_11_Conditional_26_Conditional_3_Template, 5, 1, "div", 83);
    \u0275\u0275conditionalCreate(4, ComprobanteUploadDialogComponent_Conditional_32_Conditional_11_Conditional_26_Conditional_4_Template, 5, 1, "div", 83);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_3_0;
    let tmp_4_0;
    let tmp_5_0;
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(((tmp_3_0 = ctx_r2.uploadResponse()) == null ? null : tmp_3_0.ocrResult == null ? null : tmp_3_0.ocrResult.banco) ? 2 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(((tmp_4_0 = ctx_r2.uploadResponse()) == null ? null : tmp_4_0.ocrResult == null ? null : tmp_4_0.ocrResult.numeroOperacion) ? 3 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(((tmp_5_0 = ctx_r2.uploadResponse()) == null ? null : tmp_5_0.ocrResult == null ? null : tmp_5_0.ocrResult.fecha) ? 4 : -1);
  }
}
function ComprobanteUploadDialogComponent_Conditional_32_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 70)(1, "div", 71)(2, "div", 72)(3, "span", 73);
    \u0275\u0275text(4, "Monto");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(5, ComprobanteUploadDialogComponent_Conditional_32_Conditional_11_Conditional_5_Template, 2, 3, "mat-icon", 74);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p", 75);
    \u0275\u0275text(7);
    \u0275\u0275pipe(8, "number");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(9, ComprobanteUploadDialogComponent_Conditional_32_Conditional_11_Conditional_9_Template, 4, 4, "p", 76);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "div", 71)(11, "div", 72)(12, "span", 73);
    \u0275\u0275text(13, "Documento");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(14, ComprobanteUploadDialogComponent_Conditional_32_Conditional_11_Conditional_14_Template, 2, 3, "mat-icon", 74);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "p", 77);
    \u0275\u0275text(16);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(17, ComprobanteUploadDialogComponent_Conditional_32_Conditional_11_Conditional_17_Template, 4, 4, "p", 76);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "div", 71)(19, "div", 72)(20, "span", 73);
    \u0275\u0275text(21, "Nombre");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(22, ComprobanteUploadDialogComponent_Conditional_32_Conditional_11_Conditional_22_Template, 2, 3, "mat-icon", 74);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "p", 77);
    \u0275\u0275text(24);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(25, ComprobanteUploadDialogComponent_Conditional_32_Conditional_11_Conditional_25_Template, 4, 4, "p", 76);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(26, ComprobanteUploadDialogComponent_Conditional_32_Conditional_11_Conditional_26_Template, 5, 3, "div", 78);
  }
  if (rf & 2) {
    let tmp_2_0;
    let tmp_3_0;
    let tmp_4_0;
    let tmp_5_0;
    let tmp_6_0;
    let tmp_7_0;
    let tmp_8_0;
    let tmp_9_0;
    let tmp_10_0;
    let tmp_11_0;
    let tmp_12_0;
    let tmp_13_0;
    let tmp_14_0;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275classMap(ctx_r2.getValidationCardClass((tmp_2_0 = ctx_r2.uploadResponse()) == null ? null : tmp_2_0.validacionMonto));
    \u0275\u0275advance(4);
    \u0275\u0275conditional(((tmp_3_0 = ctx_r2.uploadResponse()) == null ? null : tmp_3_0.validacionMonto) ? 5 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("S/ ", \u0275\u0275pipeBind2(8, 16, (tmp_4_0 = ctx_r2.uploadResponse()) == null ? null : tmp_4_0.ocrResult == null ? null : tmp_4_0.ocrResult.monto, "1.2-2"));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(((tmp_5_0 = ctx_r2.uploadResponse()) == null ? null : tmp_5_0.validacionMonto) ? 9 : -1);
    \u0275\u0275advance();
    \u0275\u0275classMap(ctx_r2.getValidationCardClass((tmp_6_0 = ctx_r2.uploadResponse()) == null ? null : tmp_6_0.validacionDocumento));
    \u0275\u0275advance(4);
    \u0275\u0275conditional(((tmp_7_0 = ctx_r2.uploadResponse()) == null ? null : tmp_7_0.validacionDocumento) ? 14 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(((tmp_8_0 = ctx_r2.uploadResponse()) == null ? null : tmp_8_0.ocrResult == null ? null : tmp_8_0.ocrResult.documento) || "-");
    \u0275\u0275advance();
    \u0275\u0275conditional(((tmp_9_0 = ctx_r2.uploadResponse()) == null ? null : tmp_9_0.validacionDocumento) ? 17 : -1);
    \u0275\u0275advance();
    \u0275\u0275classMap(ctx_r2.getValidationCardClass((tmp_10_0 = ctx_r2.uploadResponse()) == null ? null : tmp_10_0.validacionNombre));
    \u0275\u0275advance(4);
    \u0275\u0275conditional(((tmp_11_0 = ctx_r2.uploadResponse()) == null ? null : tmp_11_0.validacionNombre) ? 22 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(((tmp_12_0 = ctx_r2.uploadResponse()) == null ? null : tmp_12_0.ocrResult == null ? null : tmp_12_0.ocrResult.nombre) || "-");
    \u0275\u0275advance();
    \u0275\u0275conditional(((tmp_13_0 = ctx_r2.uploadResponse()) == null ? null : tmp_13_0.validacionNombre) ? 25 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(((tmp_14_0 = ctx_r2.uploadResponse()) == null ? null : tmp_14_0.ocrResult == null ? null : tmp_14_0.ocrResult.banco) || ((tmp_14_0 = ctx_r2.uploadResponse()) == null ? null : tmp_14_0.ocrResult == null ? null : tmp_14_0.ocrResult.numeroOperacion) || ((tmp_14_0 = ctx_r2.uploadResponse()) == null ? null : tmp_14_0.ocrResult == null ? null : tmp_14_0.ocrResult.fecha) ? 26 : -1);
  }
}
function ComprobanteUploadDialogComponent_Conditional_32_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 57)(1, "mat-icon", 86);
    \u0275\u0275text(2, "info");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 87);
    \u0275\u0275text(4, "Comprobante guardado sin validaci\xF3n OCR");
    \u0275\u0275elementEnd()();
  }
}
function ComprobanteUploadDialogComponent_Conditional_32_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 58)(1, "mat-icon", 88);
    \u0275\u0275text(2, "warning");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div")(4, "p", 89);
    \u0275\u0275text(5, "Hay diferencias en la validaci\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p", 90);
    \u0275\u0275text(7, "Verifica visualmente el comprobante.");
    \u0275\u0275elementEnd()()();
  }
}
function ComprobanteUploadDialogComponent_Conditional_32_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 17)(1, "div", 50)(2, "div", 51)(3, "div", 52)(4, "mat-icon", 53);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 54)(7, "p", 55);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "p", 56);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()()();
    \u0275\u0275conditionalCreate(11, ComprobanteUploadDialogComponent_Conditional_32_Conditional_11_Template, 27, 19)(12, ComprobanteUploadDialogComponent_Conditional_32_Conditional_12_Template, 5, 0, "div", 57);
    \u0275\u0275conditionalCreate(13, ComprobanteUploadDialogComponent_Conditional_32_Conditional_13_Template, 8, 0, "div", 58);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "div", 59)(15, "div", 60)(16, "div", 61)(17, "span", 62);
    \u0275\u0275text(18, "Comprobante");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "div", 63)(20, "button", 64);
    \u0275\u0275listener("click", function ComprobanteUploadDialogComponent_Conditional_32_Template_button_click_20_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.zoomOut());
    });
    \u0275\u0275elementStart(21, "mat-icon", 65);
    \u0275\u0275text(22, "remove");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(23, "span", 66);
    \u0275\u0275text(24);
    \u0275\u0275pipe(25, "number");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "button", 64);
    \u0275\u0275listener("click", function ComprobanteUploadDialogComponent_Conditional_32_Template_button_click_26_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.zoomIn());
    });
    \u0275\u0275elementStart(27, "mat-icon", 65);
    \u0275\u0275text(28, "add");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(29, "button", 67);
    \u0275\u0275listener("click", function ComprobanteUploadDialogComponent_Conditional_32_Template_button_click_29_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.resetZoom());
    });
    \u0275\u0275elementStart(30, "mat-icon", 65);
    \u0275\u0275text(31, "fit_screen");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(32, "div", 68);
    \u0275\u0275listener("wheel", function ComprobanteUploadDialogComponent_Conditional_32_Template_div_wheel_32_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.onWheel($event));
    });
    \u0275\u0275element(33, "img", 69);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    let tmp_5_0;
    let tmp_6_0;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275classMap(ctx_r2.getResultBgClass());
    \u0275\u0275advance();
    \u0275\u0275classMap(ctx_r2.getResultIconBgClass());
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.getResultIcon());
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r2.getResultTitle());
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate((tmp_5_0 = ctx_r2.uploadResponse()) == null ? null : tmp_5_0.mensaje);
    \u0275\u0275advance();
    \u0275\u0275conditional(((tmp_6_0 = ctx_r2.uploadResponse()) == null ? null : tmp_6_0.ocrResult == null ? null : tmp_6_0.ocrResult.success) ? 11 : ((tmp_6_0 = ctx_r2.uploadResponse()) == null ? null : tmp_6_0.ocrResult) && !((tmp_6_0 = ctx_r2.uploadResponse()) == null ? null : tmp_6_0.ocrResult == null ? null : tmp_6_0.ocrResult.success) ? 12 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r2.showWarning() ? 13 : -1);
    \u0275\u0275advance(7);
    \u0275\u0275property("disabled", ctx_r2.zoomLevel() <= 0.5);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(25, 17, ctx_r2.zoomLevel() * 100, "1.0-0"), "%");
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r2.zoomLevel() >= 3);
    \u0275\u0275advance(7);
    \u0275\u0275styleProp("transform", "scale(" + ctx_r2.zoomLevel() + ")")("transform-origin", "top left");
    \u0275\u0275property("src", ctx_r2.previewUrl(), \u0275\u0275sanitizeUrl);
  }
}
function ComprobanteUploadDialogComponent_Conditional_33_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 18)(1, "mat-icon", 91);
    \u0275\u0275text(2, "error");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 92);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r2.errorMessage());
  }
}
function ComprobanteUploadDialogComponent_Conditional_37_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "mat-spinner", 94);
  }
}
function ComprobanteUploadDialogComponent_Conditional_37_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon", 95);
    \u0275\u0275text(1, "upload");
    \u0275\u0275elementEnd();
  }
}
function ComprobanteUploadDialogComponent_Conditional_37_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 93);
    \u0275\u0275listener("click", function ComprobanteUploadDialogComponent_Conditional_37_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.upload());
    });
    \u0275\u0275conditionalCreate(1, ComprobanteUploadDialogComponent_Conditional_37_Conditional_1_Template, 1, 0, "mat-spinner", 94)(2, ComprobanteUploadDialogComponent_Conditional_37_Conditional_2_Template, 2, 0, "mat-icon", 95);
    \u0275\u0275text(3, " Subir y Validar ");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("disabled", !ctx_r2.selectedFile() || ctx_r2.isUploading());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.isUploading() ? 1 : 2);
  }
}
function ComprobanteUploadDialogComponent_Conditional_38_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 96);
    \u0275\u0275listener("click", function ComprobanteUploadDialogComponent_Conditional_38_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.confirm());
    });
    \u0275\u0275elementStart(1, "mat-icon", 95);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275classMap(ctx_r2.showWarning() ? "!bg-amber-500 hover:!bg-amber-600" : "!bg-green-600 hover:!bg-green-700");
    \u0275\u0275property("color", ctx_r2.showWarning() ? "warn" : "primary");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.showWarning() ? "check" : "done_all");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r2.showWarning() ? "Continuar" : "Confirmar", " ");
  }
}
var _ComprobanteUploadDialogComponent = class _ComprobanteUploadDialogComponent {
  constructor(dialogRef, data, comprobanteService) {
    this.dialogRef = dialogRef;
    this.data = data;
    this.comprobanteService = comprobanteService;
    this.selectedFile = signal(null, ...ngDevMode ? [{ debugName: "selectedFile" }] : []);
    this.previewUrl = signal("", ...ngDevMode ? [{ debugName: "previewUrl" }] : []);
    this.isUploading = signal(false, ...ngDevMode ? [{ debugName: "isUploading" }] : []);
    this.uploadResponse = signal(null, ...ngDevMode ? [{ debugName: "uploadResponse" }] : []);
    this.errorMessage = signal("", ...ngDevMode ? [{ debugName: "errorMessage" }] : []);
    this.zoomLevel = signal(1, ...ngDevMode ? [{ debugName: "zoomLevel" }] : []);
    this.showWarning = computed(() => {
      const response = this.uploadResponse();
      if (!response)
        return false;
      return response.validacionMonto && !response.validacionMonto.coincide || response.validacionDocumento && !response.validacionDocumento.coincide || response.validacionNombre && !response.validacionNombre.coincide;
    }, ...ngDevMode ? [{ debugName: "showWarning" }] : []);
  }
  onDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
  }
  onDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }
  onFileSelected(event) {
    const input = event.target;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }
  handleFile(file) {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      this.errorMessage.set("Tipo de archivo no permitido. Solo JPG, PNG o WebP.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      this.errorMessage.set("El archivo es muy grande. M\xE1ximo 5MB.");
      return;
    }
    this.errorMessage.set("");
    this.selectedFile.set(file);
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl.set(reader.result);
    };
    reader.readAsDataURL(file);
  }
  removeFile() {
    this.selectedFile.set(null);
    this.previewUrl.set("");
    this.uploadResponse.set(null);
    this.errorMessage.set("");
  }
  upload() {
    const file = this.selectedFile();
    if (!file)
      return;
    this.isUploading.set(true);
    this.errorMessage.set("");
    this.comprobanteService.uploadComprobante(file, {
      idCuota: this.data.idCuota,
      montoEsperado: this.data.montoEsperado,
      documentoEsperado: this.data.documentoEsperado,
      nombreEsperado: this.data.nombreCliente,
      idAgente: this.data.idAgente
    }).subscribe({
      next: (response) => {
        this.isUploading.set(false);
        this.uploadResponse.set(response);
        if (!response.success) {
          this.errorMessage.set(response.error || "Error al procesar el comprobante");
        }
      },
      error: (err) => {
        this.isUploading.set(false);
        this.errorMessage.set(err.error?.error || "Error de conexi\xF3n");
      }
    });
  }
  confirm() {
    const response = this.uploadResponse();
    const result = {
      uploaded: true,
      response: response || void 0,
      validacionesOk: !this.showWarning()
    };
    this.dialogRef.close(result);
  }
  cancel() {
    this.dialogRef.close({ uploaded: false, validacionesOk: false });
  }
  formatFileSize(bytes) {
    if (bytes < 1024)
      return bytes + " B";
    if (bytes < 1024 * 1024)
      return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  }
  getResultBgClass() {
    const response = this.uploadResponse();
    if (!response?.success)
      return "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300";
    if (this.showWarning())
      return "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300";
    return "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300";
  }
  getResultIconBgClass() {
    const response = this.uploadResponse();
    if (!response?.success)
      return "bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400";
    if (this.showWarning())
      return "bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400";
    return "bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400";
  }
  getResultIcon() {
    const response = this.uploadResponse();
    if (!response?.success)
      return "error";
    if (this.showWarning())
      return "warning";
    return "check_circle";
  }
  getResultTitle() {
    const response = this.uploadResponse();
    if (!response?.success)
      return "Error al procesar";
    if (this.showWarning())
      return "Comprobante con advertencias";
    return "Comprobante validado";
  }
  getValidationClass(validation) {
    if (!validation)
      return "border-slate-200 dark:border-slate-700";
    return validation.coincide ? "border-green-300 bg-green-50 dark:bg-green-950/20" : "border-amber-300 bg-amber-50 dark:bg-amber-950/20";
  }
  getValidationCardClass(validation) {
    if (!validation)
      return "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50";
    return validation.coincide ? "border-green-400 dark:border-green-600 bg-green-50 dark:bg-green-950/30" : "border-amber-400 dark:border-amber-600 bg-amber-50 dark:bg-amber-950/30";
  }
  // Zoom methods
  zoomIn() {
    if (this.zoomLevel() < 3) {
      this.zoomLevel.update((z) => Math.min(3, z + 0.25));
    }
  }
  zoomOut() {
    if (this.zoomLevel() > 0.5) {
      this.zoomLevel.update((z) => Math.max(0.5, z - 0.25));
    }
  }
  resetZoom() {
    this.zoomLevel.set(1);
  }
  onWheel(event) {
    event.preventDefault();
    if (event.deltaY < 0) {
      this.zoomIn();
    } else {
      this.zoomOut();
    }
  }
};
_ComprobanteUploadDialogComponent.\u0275fac = function ComprobanteUploadDialogComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _ComprobanteUploadDialogComponent)(\u0275\u0275directiveInject(MatDialogRef), \u0275\u0275directiveInject(MAT_DIALOG_DATA), \u0275\u0275directiveInject(ComprobanteService));
};
_ComprobanteUploadDialogComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ComprobanteUploadDialogComponent, selectors: [["app-comprobante-upload-dialog"]], decls: 39, vars: 12, consts: [["fileInput", ""], [1, "dialog-header", "bg-gradient-to-r", "from-indigo-600", "to-blue-600", "dark:from-indigo-700", "dark:to-blue-700", "text-white", "px-5", "py-3", "-mx-6", "-mt-6", "mb-4", "rounded-t-2xl"], [1, "flex", "items-center", "gap-3"], [1, "p-2", "bg-white/20", "rounded-lg"], [1, "!text-2xl"], [1, "text-lg", "font-bold", "m-0"], [1, "text-xs", "text-white/80", "m-0"], [1, "!overflow-x-hidden", "!overflow-y-auto", "!w-full"], [1, "mb-4", "p-3", "bg-white", "dark:bg-slate-800", "rounded-xl", "border", "border-slate-200", "dark:border-slate-700", "shadow-sm"], [1, "grid", "grid-cols-3", "gap-3"], [1, "min-w-0"], [1, "text-[10px]", "text-slate-500", "dark:text-slate-400", "uppercase", "tracking-wide", "font-semibold", "mb-0.5"], [1, "font-semibold", "text-sm", "text-slate-800", "dark:text-slate-100", "truncate"], [1, "font-semibold", "text-sm", "text-slate-800", "dark:text-slate-100"], [1, "font-bold", "text-lg", "text-indigo-600", "dark:text-indigo-400"], [1, "relative", "rounded-xl", "overflow-hidden", "border", "border-slate-200", "dark:border-slate-700", "bg-white", "dark:bg-slate-800/50", "shadow-sm"], [1, "py-8", "text-center", "bg-slate-50", "dark:bg-slate-800/30", "rounded-xl"], [1, "flex", "gap-4"], [1, "p-3", "bg-red-50", "dark:bg-red-950/30", "rounded-xl", "border", "border-red-200", "dark:border-red-800", "flex", "items-center", "gap-3"], ["align", "end", 1, "!px-5", "!py-3", "border-t", "border-slate-200", "dark:border-slate-700", "gap-2", "bg-slate-50", "dark:bg-slate-800/50", "-mx-6", "-mb-6", "rounded-b-2xl"], ["mat-button", "", 1, "!text-slate-600", "dark:!text-slate-300", "!rounded-lg", "!px-4", "hover:!bg-slate-200", "dark:hover:!bg-slate-700", 3, "click"], ["mat-raised-button", "", "color", "primary", 1, "!px-5", "!rounded-lg", "!bg-indigo-600", "hover:!bg-indigo-700", "!shadow-md", 3, "disabled"], ["mat-raised-button", "", 1, "!px-5", "!rounded-lg", "!shadow-md", 3, "color", "class"], [1, "border-2", "border-dashed", "border-slate-300", "dark:border-slate-600", "rounded-xl", "p-6", "text-center", "cursor-pointer", "hover:border-indigo-500", "hover:bg-indigo-50", "dark:hover:bg-indigo-950/20", "transition-all", "duration-300", "group", "bg-white", "dark:bg-slate-800/30", 3, "click", "dragover", "drop"], [1, "w-14", "h-14", "mx-auto", "mb-3", "bg-slate-100", "dark:bg-slate-700", "rounded-xl", "flex", "items-center", "justify-center", "group-hover:bg-indigo-100", "dark:group-hover:bg-indigo-900/30", "transition-colors"], [1, "!text-4xl", "text-slate-400", "dark:text-slate-500", "group-hover:text-indigo-500", "transition-colors"], [1, "text-slate-700", "dark:text-slate-200", "font-semibold", "mb-1"], [1, "text-slate-500", "dark:text-slate-400", "text-sm"], [1, "text-indigo-600", "dark:text-indigo-400", "font-semibold", "hover:underline"], [1, "text-xs", "text-slate-400", "dark:text-slate-500", "mt-2"], ["type", "file", "accept", "image/jpeg,image/png,image/webp", 1, "hidden", 3, "change"], ["alt", "Preview", 1, "w-full", "max-h-48", "object-contain", "p-2", 3, "src"], ["mat-icon-button", "", 1, "!absolute", "top-2", "right-2", "!bg-red-500", "!text-white", "hover:!bg-red-600", "shadow-lg", "!rounded-lg", "!w-8", "!h-8", 3, "click"], [1, "!text-lg"], [1, "px-3", "py-2", "bg-slate-100", "dark:bg-slate-800", "border-t", "border-slate-200", "dark:border-slate-700"], [1, "text-xs", "text-slate-700", "dark:text-slate-300", "flex", "items-center", "gap-1.5"], [1, "!text-sm", "text-slate-500", "dark:text-slate-400"], [1, "truncate"], [1, "text-slate-400", "dark:text-slate-500", "flex-shrink-0"], [1, "text-slate-500", "dark:text-slate-400", "flex-shrink-0"], [1, "relative", "inline-block"], [1, "w-16", "h-16", "border-4", "border-indigo-200", "dark:border-indigo-900/50", "rounded-full", "animate-pulse"], ["diameter", "56", "strokeWidth", "3", 1, "!absolute", "top-1", "left-1"], [1, "absolute", "inset-0", "flex", "items-center", "justify-center"], [1, "text-indigo-500", "dark:text-indigo-400", "animate-pulse", "!text-xl"], [1, "text-slate-800", "dark:text-slate-100", "font-semibold", "mt-4"], [1, "flex", "justify-center", "gap-1", "mt-3"], [1, "w-2", "h-2", "bg-indigo-500", "rounded-full", "animate-bounce", 2, "animation-delay", "0ms"], [1, "w-2", "h-2", "bg-indigo-500", "rounded-full", "animate-bounce", 2, "animation-delay", "150ms"], [1, "w-2", "h-2", "bg-indigo-500", "rounded-full", "animate-bounce", 2, "animation-delay", "300ms"], [1, "flex-1", "min-w-0", "space-y-3"], [1, "p-3", "rounded-xl", "flex", "items-center", "gap-3"], [1, "p-2", "rounded-lg", "flex-shrink-0"], [1, "!text-xl"], [1, "flex-1", "min-w-0"], [1, "font-bold", "text-sm"], [1, "text-xs", "opacity-80", "truncate"], [1, "p-3", "bg-amber-50", "dark:bg-amber-950/30", "rounded-xl", "border", "border-amber-200", "dark:border-amber-800", "flex", "items-center", "gap-3"], [1, "p-3", "bg-amber-50", "dark:bg-amber-950/30", "border-2", "border-amber-300", "dark:border-amber-700", "rounded-xl", "flex", "items-center", "gap-3"], [1, "w-96", "flex-shrink-0"], [1, "sticky", "top-0", "rounded-xl", "border", "border-slate-200", "dark:border-slate-700", "bg-slate-50", "dark:bg-slate-800/50", "overflow-hidden"], [1, "p-2", "border-b", "border-slate-200", "dark:border-slate-700", "flex", "items-center", "justify-between"], [1, "text-xs", "font-semibold", "text-slate-500", "dark:text-slate-400", "uppercase"], [1, "flex", "items-center", "gap-1"], ["mat-icon-button", "", 1, "!w-7", "!h-7", 3, "click", "disabled"], [1, "!text-base", "text-slate-500", "dark:text-slate-400"], [1, "text-xs", "text-slate-500", "dark:text-slate-400", "w-10", "text-center"], ["mat-icon-button", "", 1, "!w-7", "!h-7", 3, "click"], [1, "overflow-auto", "max-h-80", "bg-white", "dark:bg-slate-900", 2, "cursor", "grab", 3, "wheel"], ["alt", "Comprobante", 1, "transition-transform", "duration-150", 3, "src"], [1, "grid", "grid-cols-3", "gap-2"], [1, "p-3", "rounded-xl", "border-2", "transition-all"], [1, "flex", "items-center", "justify-between", "mb-1"], [1, "text-[10px]", "font-semibold", "uppercase", "tracking-wide", "text-slate-500", "dark:text-slate-400"], [1, "!text-base", 3, "class"], [1, "text-lg", "font-bold", "text-slate-800", "dark:text-slate-100"], [1, "text-[10px]", "mt-1", "font-medium", "flex", "items-center", "gap-0.5", 3, "class"], [1, "text-sm", "font-bold", "text-slate-800", "dark:text-slate-100", "truncate"], [1, "p-3", "bg-slate-50", "dark:bg-slate-800/50", "rounded-xl", "border", "border-slate-200", "dark:border-slate-700"], [1, "!text-base"], [1, "text-[10px]", "mt-1", "font-medium", "flex", "items-center", "gap-0.5"], [1, "!text-xs"], [1, "flex", "items-center", "gap-4", "text-sm"], [1, "flex", "items-center", "gap-1.5"], [1, "!text-base", "text-slate-400"], [1, "font-semibold", "text-slate-800", "dark:text-slate-100"], [1, "text-amber-500"], [1, "text-sm", "text-amber-800", "dark:text-amber-200"], [1, "text-amber-600", "dark:text-amber-400"], [1, "text-amber-800", "dark:text-amber-200", "font-semibold", "text-sm"], [1, "text-amber-700", "dark:text-amber-300", "text-xs"], [1, "text-red-500"], [1, "text-sm", "text-red-700", "dark:text-red-300"], ["mat-raised-button", "", "color", "primary", 1, "!px-5", "!rounded-lg", "!bg-indigo-600", "hover:!bg-indigo-700", "!shadow-md", 3, "click", "disabled"], ["diameter", "16", 1, "mr-2"], [1, "mr-1", "!text-lg"], ["mat-raised-button", "", 1, "!px-5", "!rounded-lg", "!shadow-md", 3, "click", "color"]], template: function ComprobanteUploadDialogComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 1)(1, "div", 2)(2, "div", 3)(3, "mat-icon", 4);
    \u0275\u0275text(4, "receipt_long");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "div")(6, "h2", 5);
    \u0275\u0275text(7, "Subir Comprobante de Pago");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "p", 6);
    \u0275\u0275text(9, "Validaci\xF3n autom\xE1tica con IA");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(10, "mat-dialog-content", 7)(11, "div", 8)(12, "div", 9)(13, "div", 10)(14, "p", 11);
    \u0275\u0275text(15, "Cliente");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "p", 12);
    \u0275\u0275text(17);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(18, "div")(19, "p", 11);
    \u0275\u0275text(20, "Documento");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "p", 13);
    \u0275\u0275text(22);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(23, "div")(24, "p", 11);
    \u0275\u0275text(25, "Monto esperado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "p", 14);
    \u0275\u0275text(27);
    \u0275\u0275pipe(28, "number");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275conditionalCreate(29, ComprobanteUploadDialogComponent_Conditional_29_Template, 14, 0);
    \u0275\u0275conditionalCreate(30, ComprobanteUploadDialogComponent_Conditional_30_Template, 15, 3, "div", 15);
    \u0275\u0275conditionalCreate(31, ComprobanteUploadDialogComponent_Conditional_31_Template, 13, 0, "div", 16);
    \u0275\u0275conditionalCreate(32, ComprobanteUploadDialogComponent_Conditional_32_Template, 34, 20, "div", 17);
    \u0275\u0275conditionalCreate(33, ComprobanteUploadDialogComponent_Conditional_33_Template, 5, 1, "div", 18);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(34, "mat-dialog-actions", 19)(35, "button", 20);
    \u0275\u0275listener("click", function ComprobanteUploadDialogComponent_Template_button_click_35_listener() {
      return ctx.cancel();
    });
    \u0275\u0275text(36, " Cancelar ");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(37, ComprobanteUploadDialogComponent_Conditional_37_Template, 4, 2, "button", 21)(38, ComprobanteUploadDialogComponent_Conditional_38_Template, 4, 5, "button", 22);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance(17);
    \u0275\u0275textInterpolate(ctx.data.nombreCliente);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx.data.documentoEsperado);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("S/ ", \u0275\u0275pipeBind2(28, 9, ctx.data.montoEsperado, "1.2-2"));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(!ctx.selectedFile() ? 29 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx.selectedFile() && !ctx.isUploading() && !ctx.uploadResponse() ? 30 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx.isUploading() ? 31 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx.uploadResponse() ? 32 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx.errorMessage() ? 33 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275conditional(!ctx.uploadResponse() ? 37 : 38);
  }
}, dependencies: [
  CommonModule,
  MatDialogModule,
  MatDialogActions,
  MatDialogContent,
  MatButtonModule,
  MatButton,
  MatIconButton,
  MatIconModule,
  MatIcon,
  MatProgressSpinnerModule,
  MatProgressSpinner,
  MatProgressBarModule,
  DecimalPipe
], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n}\n/*# sourceMappingURL=comprobante-upload-dialog.component.css.map */"] });
var ComprobanteUploadDialogComponent = _ComprobanteUploadDialogComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ComprobanteUploadDialogComponent, [{
    type: Component,
    args: [{ selector: "app-comprobante-upload-dialog", standalone: true, imports: [
      CommonModule,
      MatDialogModule,
      MatButtonModule,
      MatIconModule,
      MatProgressSpinnerModule,
      MatProgressBarModule
    ], template: `
    <!-- Header compacto -->
    <div class="dialog-header bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-700 dark:to-blue-700 text-white px-5 py-3 -mx-6 -mt-6 mb-4 rounded-t-2xl">
      <div class="flex items-center gap-3">
        <div class="p-2 bg-white/20 rounded-lg">
          <mat-icon class="!text-2xl">receipt_long</mat-icon>
        </div>
        <div>
          <h2 class="text-lg font-bold m-0">Subir Comprobante de Pago</h2>
          <p class="text-xs text-white/80 m-0">Validaci\xF3n autom\xE1tica con IA</p>
        </div>
      </div>
    </div>

    <mat-dialog-content class="!overflow-x-hidden !overflow-y-auto !w-full">
      <!-- Info de la cuota compacta -->
      <div class="mb-4 p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div class="grid grid-cols-3 gap-3">
          <div class="min-w-0">
            <p class="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wide font-semibold mb-0.5">Cliente</p>
            <p class="font-semibold text-sm text-slate-800 dark:text-slate-100 truncate">{{ data.nombreCliente }}</p>
          </div>
          <div>
            <p class="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wide font-semibold mb-0.5">Documento</p>
            <p class="font-semibold text-sm text-slate-800 dark:text-slate-100">{{ data.documentoEsperado }}</p>
          </div>
          <div>
            <p class="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wide font-semibold mb-0.5">Monto esperado</p>
            <p class="font-bold text-lg text-indigo-600 dark:text-indigo-400">S/ {{ data.montoEsperado | number:'1.2-2' }}</p>
          </div>
        </div>
      </div>

      <!-- \xC1rea de drag & drop compacta -->
      @if (!selectedFile()) {
        <div
          class="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-6 text-center cursor-pointer
                 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/20
                 transition-all duration-300 group bg-white dark:bg-slate-800/30"
          (click)="fileInput.click()"
          (dragover)="onDragOver($event)"
          (drop)="onDrop($event)"
        >
          <div class="w-14 h-14 mx-auto mb-3 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30 transition-colors">
            <mat-icon class="!text-4xl text-slate-400 dark:text-slate-500 group-hover:text-indigo-500 transition-colors">cloud_upload</mat-icon>
          </div>
          <p class="text-slate-700 dark:text-slate-200 font-semibold mb-1">Arrastra una imagen aqu\xED</p>
          <p class="text-slate-500 dark:text-slate-400 text-sm">
            o <span class="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">haz clic para seleccionar</span>
          </p>
          <p class="text-xs text-slate-400 dark:text-slate-500 mt-2">JPG, PNG, WebP - M\xE1ximo 5MB</p>
        </div>
        <input #fileInput type="file" accept="image/jpeg,image/png,image/webp" class="hidden" (change)="onFileSelected($event)" />
      }

      <!-- Preview de imagen antes de subir -->
      @if (selectedFile() && !isUploading() && !uploadResponse()) {
        <div class="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-sm">
          <img [src]="previewUrl()" alt="Preview" class="w-full max-h-48 object-contain p-2" />
          <button mat-icon-button class="!absolute top-2 right-2 !bg-red-500 !text-white hover:!bg-red-600 shadow-lg !rounded-lg !w-8 !h-8" (click)="removeFile()">
            <mat-icon class="!text-lg">close</mat-icon>
          </button>
          <div class="px-3 py-2 bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
            <p class="text-xs text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <mat-icon class="!text-sm text-slate-500 dark:text-slate-400">insert_drive_file</mat-icon>
              <span class="truncate">{{ selectedFile()?.name }}</span>
              <span class="text-slate-400 dark:text-slate-500 flex-shrink-0">-</span>
              <span class="text-slate-500 dark:text-slate-400 flex-shrink-0">{{ formatFileSize(selectedFile()?.size || 0) }}</span>
            </p>
          </div>
        </div>
      }

      <!-- Spinner compacto -->
      @if (isUploading()) {
        <div class="py-8 text-center bg-slate-50 dark:bg-slate-800/30 rounded-xl">
          <div class="relative inline-block">
            <div class="w-16 h-16 border-4 border-indigo-200 dark:border-indigo-900/50 rounded-full animate-pulse"></div>
            <mat-spinner diameter="56" class="!absolute top-1 left-1" strokeWidth="3"></mat-spinner>
            <div class="absolute inset-0 flex items-center justify-center">
              <mat-icon class="text-indigo-500 dark:text-indigo-400 animate-pulse !text-xl">document_scanner</mat-icon>
            </div>
          </div>
          <p class="text-slate-800 dark:text-slate-100 font-semibold mt-4">Analizando con IA...</p>
          <div class="flex justify-center gap-1 mt-3">
            <span class="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style="animation-delay: 0ms"></span>
            <span class="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style="animation-delay: 150ms"></span>
            <span class="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style="animation-delay: 300ms"></span>
          </div>
        </div>
      }

      <!-- Resultado del OCR con imagen a la derecha -->
      @if (uploadResponse()) {
        <div class="flex gap-4">
          <!-- Columna izquierda: Resultados -->
          <div class="flex-1 min-w-0 space-y-3">
            <!-- Mensaje general compacto -->
            <div class="p-3 rounded-xl flex items-center gap-3" [class]="getResultBgClass()">
              <div class="p-2 rounded-lg flex-shrink-0" [class]="getResultIconBgClass()">
                <mat-icon class="!text-xl">{{ getResultIcon() }}</mat-icon>
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-bold text-sm">{{ getResultTitle() }}</p>
                <p class="text-xs opacity-80 truncate">{{ uploadResponse()?.mensaje }}</p>
              </div>
            </div>

            <!-- Grid de validaciones 3 columnas -->
            @if (uploadResponse()?.ocrResult?.success) {
              <div class="grid grid-cols-3 gap-2">
              <!-- Monto -->
              <div class="p-3 rounded-xl border-2 transition-all" [class]="getValidationCardClass(uploadResponse()?.validacionMonto)">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Monto</span>
                  @if (uploadResponse()?.validacionMonto) {
                    <mat-icon class="!text-base" [class]="uploadResponse()?.validacionMonto?.coincide ? 'text-green-500' : 'text-amber-500'">
                      {{ uploadResponse()?.validacionMonto?.coincide ? 'check_circle' : 'warning' }}
                    </mat-icon>
                  }
                </div>
                <p class="text-lg font-bold text-slate-800 dark:text-slate-100">S/ {{ uploadResponse()?.ocrResult?.monto | number:'1.2-2' }}</p>
                @if (uploadResponse()?.validacionMonto) {
                  <p class="text-[10px] mt-1 font-medium flex items-center gap-0.5" [class]="uploadResponse()?.validacionMonto?.coincide ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'">
                    <mat-icon class="!text-xs">{{ uploadResponse()?.validacionMonto?.coincide ? 'check' : 'priority_high' }}</mat-icon>
                    {{ uploadResponse()?.validacionMonto?.coincide ? 'OK' : 'No coincide' }}
                  </p>
                }
              </div>

              <!-- Documento -->
              <div class="p-3 rounded-xl border-2 transition-all" [class]="getValidationCardClass(uploadResponse()?.validacionDocumento)">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Documento</span>
                  @if (uploadResponse()?.validacionDocumento) {
                    <mat-icon class="!text-base" [class]="uploadResponse()?.validacionDocumento?.coincide ? 'text-green-500' : 'text-amber-500'">
                      {{ uploadResponse()?.validacionDocumento?.coincide ? 'check_circle' : 'warning' }}
                    </mat-icon>
                  }
                </div>
                <p class="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{{ uploadResponse()?.ocrResult?.documento || '-' }}</p>
                @if (uploadResponse()?.validacionDocumento) {
                  <p class="text-[10px] mt-1 font-medium flex items-center gap-0.5" [class]="uploadResponse()?.validacionDocumento?.coincide ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'">
                    <mat-icon class="!text-xs">{{ uploadResponse()?.validacionDocumento?.coincide ? 'check' : 'priority_high' }}</mat-icon>
                    {{ uploadResponse()?.validacionDocumento?.coincide ? 'OK' : 'No coincide' }}
                  </p>
                }
              </div>

              <!-- Nombre -->
              <div class="p-3 rounded-xl border-2 transition-all" [class]="getValidationCardClass(uploadResponse()?.validacionNombre)">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Nombre</span>
                  @if (uploadResponse()?.validacionNombre) {
                    <mat-icon class="!text-base" [class]="uploadResponse()?.validacionNombre?.coincide ? 'text-green-500' : 'text-amber-500'">
                      {{ uploadResponse()?.validacionNombre?.coincide ? 'check_circle' : 'warning' }}
                    </mat-icon>
                  }
                </div>
                <p class="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{{ uploadResponse()?.ocrResult?.nombre || '-' }}</p>
                @if (uploadResponse()?.validacionNombre) {
                  <p class="text-[10px] mt-1 font-medium flex items-center gap-0.5" [class]="uploadResponse()?.validacionNombre?.coincide ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'">
                    <mat-icon class="!text-xs">{{ uploadResponse()?.validacionNombre?.coincide ? 'check' : 'priority_high' }}</mat-icon>
                    {{ uploadResponse()?.validacionNombre?.coincide ? 'OK' : 'No coincide' }}
                  </p>
                }
              </div>
            </div>

            <!-- Info adicional compacta -->
            @if (uploadResponse()?.ocrResult?.banco || uploadResponse()?.ocrResult?.numeroOperacion || uploadResponse()?.ocrResult?.fecha) {
              <div class="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                <div class="flex items-center gap-4 text-sm">
                  @if (uploadResponse()?.ocrResult?.banco) {
                    <div class="flex items-center gap-1.5">
                      <mat-icon class="!text-base text-slate-400">account_balance</mat-icon>
                      <span class="font-semibold text-slate-800 dark:text-slate-100">{{ uploadResponse()?.ocrResult?.banco }}</span>
                    </div>
                  }
                  @if (uploadResponse()?.ocrResult?.numeroOperacion) {
                    <div class="flex items-center gap-1.5">
                      <mat-icon class="!text-base text-slate-400">tag</mat-icon>
                      <span class="font-semibold text-slate-800 dark:text-slate-100">{{ uploadResponse()?.ocrResult?.numeroOperacion }}</span>
                    </div>
                  }
                  @if (uploadResponse()?.ocrResult?.fecha) {
                    <div class="flex items-center gap-1.5">
                      <mat-icon class="!text-base text-slate-400">event</mat-icon>
                      <span class="font-semibold text-slate-800 dark:text-slate-100">{{ uploadResponse()?.ocrResult?.fecha }}</span>
                    </div>
                  }
                </div>
              </div>
            }
          } @else if (uploadResponse()?.ocrResult && !uploadResponse()?.ocrResult?.success) {
            <div class="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800 flex items-center gap-3">
              <mat-icon class="text-amber-500">info</mat-icon>
              <p class="text-sm text-amber-800 dark:text-amber-200">Comprobante guardado sin validaci\xF3n OCR</p>
            </div>
          }

            <!-- Advertencia compacta -->
            @if (showWarning()) {
              <div class="p-3 bg-amber-50 dark:bg-amber-950/30 border-2 border-amber-300 dark:border-amber-700 rounded-xl flex items-center gap-3">
                <mat-icon class="text-amber-600 dark:text-amber-400">warning</mat-icon>
                <div>
                  <p class="text-amber-800 dark:text-amber-200 font-semibold text-sm">Hay diferencias en la validaci\xF3n</p>
                  <p class="text-amber-700 dark:text-amber-300 text-xs">Verifica visualmente el comprobante.</p>
                </div>
              </div>
            }
          </div>

          <!-- Columna derecha: Imagen con zoom -->
          <div class="w-96 flex-shrink-0">
            <div class="sticky top-0 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 overflow-hidden">
              <div class="p-2 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <span class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Comprobante</span>
                <div class="flex items-center gap-1">
                  <button mat-icon-button class="!w-7 !h-7" (click)="zoomOut()" [disabled]="zoomLevel() <= 0.5">
                    <mat-icon class="!text-base text-slate-500 dark:text-slate-400">remove</mat-icon>
                  </button>
                  <span class="text-xs text-slate-500 dark:text-slate-400 w-10 text-center">{{ (zoomLevel() * 100) | number:'1.0-0' }}%</span>
                  <button mat-icon-button class="!w-7 !h-7" (click)="zoomIn()" [disabled]="zoomLevel() >= 3">
                    <mat-icon class="!text-base text-slate-500 dark:text-slate-400">add</mat-icon>
                  </button>
                  <button mat-icon-button class="!w-7 !h-7" (click)="resetZoom()">
                    <mat-icon class="!text-base text-slate-500 dark:text-slate-400">fit_screen</mat-icon>
                  </button>
                </div>
              </div>
              <div class="overflow-auto max-h-80 bg-white dark:bg-slate-900"
                   (wheel)="onWheel($event)"
                   style="cursor: grab;">
                <img [src]="previewUrl()"
                     alt="Comprobante"
                     class="transition-transform duration-150"
                     [style.transform]="'scale(' + zoomLevel() + ')'"
                     [style.transform-origin]="'top left'" />
              </div>
            </div>
          </div>
        </div>
      }

      <!-- Error compacto -->
      @if (errorMessage()) {
        <div class="p-3 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-200 dark:border-red-800 flex items-center gap-3">
          <mat-icon class="text-red-500">error</mat-icon>
          <p class="text-sm text-red-700 dark:text-red-300">{{ errorMessage() }}</p>
        </div>
      }
    </mat-dialog-content>

    <mat-dialog-actions align="end" class="!px-5 !py-3 border-t border-slate-200 dark:border-slate-700 gap-2 bg-slate-50 dark:bg-slate-800/50 -mx-6 -mb-6 rounded-b-2xl">
      <button mat-button class="!text-slate-600 dark:!text-slate-300 !rounded-lg !px-4 hover:!bg-slate-200 dark:hover:!bg-slate-700" (click)="cancel()">
        Cancelar
      </button>

      @if (!uploadResponse()) {
        <button mat-raised-button color="primary" [disabled]="!selectedFile() || isUploading()" (click)="upload()"
          class="!px-5 !rounded-lg !bg-indigo-600 hover:!bg-indigo-700 !shadow-md">
          @if (isUploading()) {
            <mat-spinner diameter="16" class="mr-2"></mat-spinner>
          } @else {
            <mat-icon class="mr-1 !text-lg">upload</mat-icon>
          }
          Subir y Validar
        </button>
      } @else {
        <button mat-raised-button [color]="showWarning() ? 'warn' : 'primary'" (click)="confirm()"
          class="!px-5 !rounded-lg !shadow-md" [class]="showWarning() ? '!bg-amber-500 hover:!bg-amber-600' : '!bg-green-600 hover:!bg-green-700'">
          <mat-icon class="mr-1 !text-lg">{{ showWarning() ? 'check' : 'done_all' }}</mat-icon>
          {{ showWarning() ? 'Continuar' : 'Confirmar' }}
        </button>
      }
    </mat-dialog-actions>
  `, styles: ["/* angular:styles/component:css;219558ef63f119a92210704329b58a3cdceaa4fb296db559e672f74512827dc7;C:/Users/HP/Documents/Kubito-2.0-v1/cashi-discador-frontend/cashi-discador-frontend/src/app/collection-management/components/comprobante-upload-dialog/comprobante-upload-dialog.component.ts */\n:host {\n  display: block;\n}\n/*# sourceMappingURL=comprobante-upload-dialog.component.css.map */\n"] }]
  }], () => [{ type: MatDialogRef }, { type: void 0, decorators: [{
    type: Inject,
    args: [MAT_DIALOG_DATA]
  }] }, { type: ComprobanteService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ComprobanteUploadDialogComponent, { className: "ComprobanteUploadDialogComponent", filePath: "src/app/collection-management/components/comprobante-upload-dialog/comprobante-upload-dialog.component.ts", lineNumber: 320 });
})();

// src/app/collection-management/components/voucher-payment-dialog/voucher-payment-dialog.component.ts
var _forTrack03 = ($index, $item) => $item.numeroCuota;
function VoucherPaymentDialogComponent_For_46_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 40);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "number");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 39);
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "number");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const cuota_r1 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("S/", \u0275\u0275pipeBind2(2, 2, cuota_r1.monto, "1.2-2"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("S/", \u0275\u0275pipeBind2(5, 5, ctx_r1.getSaldoPendiente(cuota_r1), "1.2-2"));
  }
}
function VoucherPaymentDialogComponent_For_46_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 39);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "number");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const cuota_r1 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("S/", \u0275\u0275pipeBind2(2, 1, cuota_r1.monto, "1.2-2"));
  }
}
function VoucherPaymentDialogComponent_For_46_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 37)(1, "span", 38);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(3, VoucherPaymentDialogComponent_For_46_Conditional_3_Template, 6, 8)(4, VoucherPaymentDialogComponent_For_46_Conditional_4_Template, 3, 4, "span", 39);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_10_0;
    const cuota_r1 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275classProp("active", cuota_r1.numeroCuota === ((tmp_10_0 = ctx_r1.cuotaMasProxima()) == null ? null : tmp_10_0.numeroCuota));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("C", cuota_r1.numeroCuota);
    \u0275\u0275advance();
    \u0275\u0275conditional(cuota_r1.montoPagadoReal && cuota_r1.montoPagadoReal > 0 ? 3 : 4);
  }
}
function VoucherPaymentDialogComponent_Conditional_52_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "strong");
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "number");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 41);
    \u0275\u0275text(4, "Parcial");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_1_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("C", (tmp_1_0 = ctx_r1.cuotaMasProxima()) == null ? null : tmp_1_0.numeroCuota, " - S/", \u0275\u0275pipeBind2(2, 2, ctx_r1.getSaldoPendiente(ctx_r1.cuotaMasProxima()), "1.2-2"));
  }
}
function VoucherPaymentDialogComponent_Conditional_53_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "strong");
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "number");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_1_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("C", (tmp_1_0 = ctx_r1.cuotaMasProxima()) == null ? null : tmp_1_0.numeroCuota, " - S/", \u0275\u0275pipeBind2(2, 2, (tmp_1_0 = ctx_r1.cuotaMasProxima()) == null ? null : tmp_1_0.monto, "1.2-2"));
  }
}
function VoucherPaymentDialogComponent_Conditional_56_Conditional_9_Conditional_29_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 58)(1, "mat-icon");
    \u0275\u0275text(2, "account_balance");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_4_0;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate((tmp_4_0 = ctx_r1.uploadResponse()) == null ? null : tmp_4_0.ocrResult == null ? null : tmp_4_0.ocrResult.banco);
  }
}
function VoucherPaymentDialogComponent_Conditional_56_Conditional_9_Conditional_29_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 58)(1, "mat-icon");
    \u0275\u0275text(2, "tag");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_4_0;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("Op. ", (tmp_4_0 = ctx_r1.uploadResponse()) == null ? null : tmp_4_0.ocrResult == null ? null : tmp_4_0.ocrResult.numeroOperacion);
  }
}
function VoucherPaymentDialogComponent_Conditional_56_Conditional_9_Conditional_29_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 58)(1, "mat-icon");
    \u0275\u0275text(2, "event");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_4_0;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate((tmp_4_0 = ctx_r1.uploadResponse()) == null ? null : tmp_4_0.ocrResult == null ? null : tmp_4_0.ocrResult.fecha);
  }
}
function VoucherPaymentDialogComponent_Conditional_56_Conditional_9_Conditional_29_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 54);
    \u0275\u0275conditionalCreate(1, VoucherPaymentDialogComponent_Conditional_56_Conditional_9_Conditional_29_Conditional_1_Template, 5, 1, "div", 58);
    \u0275\u0275conditionalCreate(2, VoucherPaymentDialogComponent_Conditional_56_Conditional_9_Conditional_29_Conditional_2_Template, 5, 1, "div", 58);
    \u0275\u0275conditionalCreate(3, VoucherPaymentDialogComponent_Conditional_56_Conditional_9_Conditional_29_Conditional_3_Template, 5, 1, "div", 58);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_3_0;
    let tmp_4_0;
    let tmp_5_0;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275conditional(((tmp_3_0 = ctx_r1.uploadResponse()) == null ? null : tmp_3_0.ocrResult == null ? null : tmp_3_0.ocrResult.banco) ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(((tmp_4_0 = ctx_r1.uploadResponse()) == null ? null : tmp_4_0.ocrResult == null ? null : tmp_4_0.ocrResult.numeroOperacion) ? 2 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(((tmp_5_0 = ctx_r1.uploadResponse()) == null ? null : tmp_5_0.ocrResult == null ? null : tmp_5_0.ocrResult.fecha) ? 3 : -1);
  }
}
function VoucherPaymentDialogComponent_Conditional_56_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 47)(1, "div", 48)(2, "div", 49)(3, "mat-icon");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "div", 50)(6, "span", 51);
    \u0275\u0275text(7, "Monto");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "span", 52);
    \u0275\u0275text(9);
    \u0275\u0275pipe(10, "number");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(11, "div", 48)(12, "div", 49)(13, "mat-icon");
    \u0275\u0275text(14);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "div", 50)(16, "span", 51);
    \u0275\u0275text(17, "Documento");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "span", 52);
    \u0275\u0275text(19);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(20, "div", 48)(21, "div", 49)(22, "mat-icon");
    \u0275\u0275text(23);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(24, "div", 50)(25, "span", 51);
    \u0275\u0275text(26, "Nombre");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "span", 53);
    \u0275\u0275text(28);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275conditionalCreate(29, VoucherPaymentDialogComponent_Conditional_56_Conditional_9_Conditional_29_Template, 4, 3, "div", 54);
    \u0275\u0275elementStart(30, "div", 55)(31, "mat-icon");
    \u0275\u0275text(32);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "span");
    \u0275\u0275text(34, "Se registrar\xE1:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(35, "strong");
    \u0275\u0275text(36);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(37, "span", 56);
    \u0275\u0275text(38);
    \u0275\u0275pipe(39, "number");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(40, "div", 57)(41, "mat-icon");
    \u0275\u0275text(42, "auto_awesome");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(43, "span");
    \u0275\u0275text(44, "Al confirmar se seleccionar\xE1 autom\xE1ticamente: ");
    \u0275\u0275elementStart(45, "strong");
    \u0275\u0275text(46, "Contacto Directo \u2192 Cancelaci\xF3n");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    let tmp_2_0;
    let tmp_3_0;
    let tmp_4_0;
    let tmp_5_0;
    let tmp_6_0;
    let tmp_7_0;
    let tmp_8_0;
    let tmp_9_0;
    let tmp_10_0;
    let tmp_11_0;
    let tmp_14_0;
    let tmp_15_0;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275classMap(ctx_r1.getValidationClass((tmp_2_0 = ctx_r1.uploadResponse()) == null ? null : tmp_2_0.validacionMonto));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(((tmp_3_0 = ctx_r1.uploadResponse()) == null ? null : tmp_3_0.validacionMonto == null ? null : tmp_3_0.validacionMonto.coincide) ? "check_circle" : "warning");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("S/", \u0275\u0275pipeBind2(10, 18, (tmp_4_0 = ctx_r1.uploadResponse()) == null ? null : tmp_4_0.ocrResult == null ? null : tmp_4_0.ocrResult.monto, "1.2-2"));
    \u0275\u0275advance(2);
    \u0275\u0275classMap(ctx_r1.getValidationClass((tmp_5_0 = ctx_r1.uploadResponse()) == null ? null : tmp_5_0.validacionDocumento));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(((tmp_6_0 = ctx_r1.uploadResponse()) == null ? null : tmp_6_0.validacionDocumento == null ? null : tmp_6_0.validacionDocumento.coincide) ? "check_circle" : "warning");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(((tmp_7_0 = ctx_r1.uploadResponse()) == null ? null : tmp_7_0.ocrResult == null ? null : tmp_7_0.ocrResult.documento) || "-");
    \u0275\u0275advance();
    \u0275\u0275classMap(ctx_r1.getValidationClass((tmp_8_0 = ctx_r1.uploadResponse()) == null ? null : tmp_8_0.validacionNombre));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(((tmp_9_0 = ctx_r1.uploadResponse()) == null ? null : tmp_9_0.validacionNombre == null ? null : tmp_9_0.validacionNombre.coincide) ? "check_circle" : "warning");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(((tmp_10_0 = ctx_r1.uploadResponse()) == null ? null : tmp_10_0.ocrResult == null ? null : tmp_10_0.ocrResult.nombre) || "-");
    \u0275\u0275advance();
    \u0275\u0275conditional(((tmp_11_0 = ctx_r1.uploadResponse()) == null ? null : tmp_11_0.ocrResult == null ? null : tmp_11_0.ocrResult.banco) || ((tmp_11_0 = ctx_r1.uploadResponse()) == null ? null : tmp_11_0.ocrResult == null ? null : tmp_11_0.ocrResult.numeroOperacion) ? 29 : -1);
    \u0275\u0275advance();
    \u0275\u0275classMap(ctx_r1.cuotaCoincidente() ? "success" : "warning");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.cuotaCoincidente() ? "check_circle" : "info");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("Cuota ", (tmp_14_0 = ctx_r1.cuotaCoincidente() || ctx_r1.cuotaMasProxima()) == null ? null : tmp_14_0.numeroCuota);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("(S/", \u0275\u0275pipeBind2(39, 21, (tmp_15_0 = ctx_r1.cuotaCoincidente() || ctx_r1.cuotaMasProxima()) == null ? null : tmp_15_0.monto, "1.2-2"), ")");
  }
}
function VoucherPaymentDialogComponent_Conditional_56_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 42)(1, "div", 43)(2, "mat-icon");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "div", 44)(5, "span", 45);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "span", 46);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()()();
    \u0275\u0275conditionalCreate(9, VoucherPaymentDialogComponent_Conditional_56_Conditional_9_Template, 47, 24);
  }
  if (rf & 2) {
    let tmp_5_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275classMap(ctx_r1.getResultClass());
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.getResultIcon());
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.getResultTitle());
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.getResultSubtitle());
    \u0275\u0275advance();
    \u0275\u0275conditional(((tmp_5_0 = ctx_r1.uploadResponse()) == null ? null : tmp_5_0.ocrResult == null ? null : tmp_5_0.ocrResult.success) ? 9 : -1);
  }
}
function VoucherPaymentDialogComponent_Conditional_57_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 25)(1, "mat-icon");
    \u0275\u0275text(2, "error_outline");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.errorMessage());
  }
}
function VoucherPaymentDialogComponent_Conditional_65_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 30)(1, "button", 59);
    \u0275\u0275listener("click", function VoucherPaymentDialogComponent_Conditional_65_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.zoomOut());
    });
    \u0275\u0275elementStart(2, "mat-icon");
    \u0275\u0275text(3, "remove");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "span", 60);
    \u0275\u0275text(5);
    \u0275\u0275pipe(6, "number");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "button", 59);
    \u0275\u0275listener("click", function VoucherPaymentDialogComponent_Conditional_65_Template_button_click_7_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.zoomIn());
    });
    \u0275\u0275elementStart(8, "mat-icon");
    \u0275\u0275text(9, "add");
    \u0275\u0275elementEnd()();
    \u0275\u0275element(10, "div", 61);
    \u0275\u0275elementStart(11, "button", 62);
    \u0275\u0275listener("click", function VoucherPaymentDialogComponent_Conditional_65_Template_button_click_11_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.removeFile());
    });
    \u0275\u0275elementStart(12, "mat-icon");
    \u0275\u0275text(13, "delete_outline");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r1.zoomLevel() <= 0.5);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(6, 3, ctx_r1.zoomLevel() * 100, "1.0-0"), "%");
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r1.zoomLevel() >= 3);
  }
}
function VoucherPaymentDialogComponent_Conditional_67_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 63);
    \u0275\u0275listener("click", function VoucherPaymentDialogComponent_Conditional_67_Template_div_click_0_listener() {
      \u0275\u0275restoreView(_r4);
      const fileInput_r5 = \u0275\u0275reference(19);
      return \u0275\u0275resetView(fileInput_r5.click());
    })("dragover", function VoucherPaymentDialogComponent_Conditional_67_Template_div_dragover_0_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onDragOver($event));
    })("drop", function VoucherPaymentDialogComponent_Conditional_67_Template_div_drop_0_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onDrop($event));
    });
    \u0275\u0275elementStart(1, "div", 64)(2, "div", 65)(3, "mat-icon");
    \u0275\u0275text(4, "cloud_upload");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "p", 66);
    \u0275\u0275text(6, "Arrastra tu voucher aqu\xED");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p", 67);
    \u0275\u0275text(8, "o haz clic para seleccionar");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "div", 68)(10, "span", 69);
    \u0275\u0275text(11, "JPG");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "span", 69);
    \u0275\u0275text(13, "PNG");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "span", 69);
    \u0275\u0275text(15, "WebP");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "span", 70);
    \u0275\u0275text(17, "Max 5MB");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(18, "input", 71, 0);
    \u0275\u0275listener("change", function VoucherPaymentDialogComponent_Conditional_67_Template_input_change_18_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onFileSelected($event));
    });
    \u0275\u0275elementEnd();
  }
}
function VoucherPaymentDialogComponent_Conditional_68_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 74)(1, "div", 75);
    \u0275\u0275element(2, "mat-spinner", 76);
    \u0275\u0275elementStart(3, "p");
    \u0275\u0275text(4, "Analizando voucher...");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span");
    \u0275\u0275text(6, "Procesando con IA");
    \u0275\u0275elementEnd()()();
  }
}
function VoucherPaymentDialogComponent_Conditional_68_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 72);
    \u0275\u0275listener("wheel", function VoucherPaymentDialogComponent_Conditional_68_Template_div_wheel_0_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onWheel($event));
    });
    \u0275\u0275element(1, "img", 73);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(2, VoucherPaymentDialogComponent_Conditional_68_Conditional_2_Template, 7, 0, "div", 74);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275styleProp("transform", "scale(" + ctx_r1.zoomLevel() + ")");
    \u0275\u0275property("src", ctx_r1.previewUrl(), \u0275\u0275sanitizeUrl);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.isUploading() ? 2 : -1);
  }
}
function VoucherPaymentDialogComponent_Conditional_75_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 77);
    \u0275\u0275listener("click", function VoucherPaymentDialogComponent_Conditional_75_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.upload());
    });
    \u0275\u0275elementStart(1, "mat-icon");
    \u0275\u0275text(2, "psychology");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3, " Analizar con IA ");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("disabled", !ctx_r1.selectedFile() || ctx_r1.isUploading());
  }
}
function VoucherPaymentDialogComponent_Conditional_76_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 78);
    \u0275\u0275listener("click", function VoucherPaymentDialogComponent_Conditional_76_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.confirm());
    });
    \u0275\u0275elementStart(1, "mat-icon");
    \u0275\u0275text(2, "done_all");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3, " Confirmar Pago ");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275classMap(ctx_r1.showWarning() ? "warning" : "success");
  }
}
var _VoucherPaymentDialogComponent = class _VoucherPaymentDialogComponent {
  constructor(dialogRef, data, comprobanteService) {
    this.dialogRef = dialogRef;
    this.data = data;
    this.comprobanteService = comprobanteService;
    this.selectedFile = signal(null, ...ngDevMode ? [{ debugName: "selectedFile" }] : []);
    this.previewUrl = signal("", ...ngDevMode ? [{ debugName: "previewUrl" }] : []);
    this.isUploading = signal(false, ...ngDevMode ? [{ debugName: "isUploading" }] : []);
    this.uploadResponse = signal(null, ...ngDevMode ? [{ debugName: "uploadResponse" }] : []);
    this.errorMessage = signal("", ...ngDevMode ? [{ debugName: "errorMessage" }] : []);
    this.zoomLevel = signal(1, ...ngDevMode ? [{ debugName: "zoomLevel" }] : []);
    this.isDarkMode = signal(false, ...ngDevMode ? [{ debugName: "isDarkMode" }] : []);
    this.cuotasPendientes = computed(() => {
      return this.data.cuotas.filter((c) => c.status !== "PAGADA" && c.status !== "PAGADO" && c.status !== "CUMPLIDO" && c.status !== "CANCELADA").sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    }, ...ngDevMode ? [{ debugName: "cuotasPendientes" }] : []);
    this.cuotaMasProxima = computed(() => {
      const pendientes = this.cuotasPendientes();
      return pendientes.length > 0 ? pendientes[0] : null;
    }, ...ngDevMode ? [{ debugName: "cuotaMasProxima" }] : []);
    this.cuotaCoincidente = computed(() => {
      const response = this.uploadResponse();
      if (!response?.ocrResult?.monto)
        return null;
      const montoVoucher = response.ocrResult.monto;
      const pendientes = this.cuotasPendientes();
      return pendientes.find((c) => Math.abs(c.monto - montoVoucher) < 0.01) || null;
    }, ...ngDevMode ? [{ debugName: "cuotaCoincidente" }] : []);
    this.showWarning = computed(() => {
      const response = this.uploadResponse();
      if (!response)
        return false;
      const validacionFalla = response.validacionMonto && !response.validacionMonto.coincide || response.validacionDocumento && !response.validacionDocumento.coincide || response.validacionNombre && !response.validacionNombre.coincide;
      const ocrResult = response.ocrResult;
      const sinDatosOcr = !ocrResult?.monto && !ocrResult?.documento && !ocrResult?.nombre;
      return validacionFalla || sinDatosOcr;
    }, ...ngDevMode ? [{ debugName: "showWarning" }] : []);
    this.noDataDetected = computed(() => {
      const response = this.uploadResponse();
      if (!response?.ocrResult)
        return true;
      const ocr = response.ocrResult;
      return !ocr.monto && !ocr.documento && !ocr.nombre;
    }, ...ngDevMode ? [{ debugName: "noDataDetected" }] : []);
  }
  ngOnInit() {
    this.isDarkMode.set(document.documentElement.classList.contains("dark"));
    this.darkModeObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          this.isDarkMode.set(document.documentElement.classList.contains("dark"));
        }
      });
    });
    this.darkModeObserver.observe(document.documentElement, { attributes: true });
  }
  ngOnDestroy() {
    this.darkModeObserver?.disconnect();
  }
  onDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
  }
  onDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0)
      this.handleFile(files[0]);
  }
  onFileSelected(event) {
    const input = event.target;
    if (input.files && input.files.length > 0)
      this.handleFile(input.files[0]);
  }
  handleFile(file) {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      this.errorMessage.set("Solo JPG, PNG o WebP.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      this.errorMessage.set("M\xE1ximo 5MB.");
      return;
    }
    this.errorMessage.set("");
    this.selectedFile.set(file);
    this.uploadResponse.set(null);
    const reader = new FileReader();
    reader.onload = () => this.previewUrl.set(reader.result);
    reader.readAsDataURL(file);
  }
  removeFile() {
    this.selectedFile.set(null);
    this.previewUrl.set("");
    this.uploadResponse.set(null);
    this.errorMessage.set("");
    this.zoomLevel.set(1);
  }
  upload() {
    const file = this.selectedFile();
    const cuota = this.cuotaMasProxima();
    if (!file || !cuota)
      return;
    this.isUploading.set(true);
    this.errorMessage.set("");
    this.comprobanteService.uploadComprobante(file, {
      idCuota: cuota.id,
      montoEsperado: this.getSaldoPendiente(cuota),
      documentoEsperado: this.data.documentoCliente,
      nombreEsperado: this.data.nombreCliente,
      idAgente: this.data.idAgente
    }).subscribe({
      next: (response) => {
        this.isUploading.set(false);
        this.uploadResponse.set(response);
        if (!response.success)
          this.errorMessage.set(response.error || "Error al procesar");
      },
      error: (err) => {
        this.isUploading.set(false);
        this.errorMessage.set(err.error?.error || "Error de conexi\xF3n");
      }
    });
  }
  confirm() {
    const response = this.uploadResponse();
    const cuotaSeleccionada = this.cuotaCoincidente() || this.cuotaMasProxima();
    if (!cuotaSeleccionada)
      return;
    const ocrData = response?.ocrResult;
    let observaciones = "Pago validado por OCR";
    if (ocrData?.banco)
      observaciones += ` - ${ocrData.banco}`;
    if (ocrData?.numeroOperacion)
      observaciones += ` - Op. #${ocrData.numeroOperacion}`;
    if (ocrData?.fecha)
      observaciones += ` - Fecha: ${ocrData.fecha}`;
    if (ocrData?.monto)
      observaciones += ` - Monto: S/ ${ocrData.monto.toFixed(2)}`;
    this.dialogRef.close({
      confirmed: true,
      autoSelect: {
        categoriaId: "CD",
        detalleId: "CA",
        cuotaSeleccionada,
        observaciones
      },
      ocrResponse: response || void 0
    });
  }
  cancel() {
    this.dialogRef.close({ confirmed: false });
  }
  formatDate(dateValue) {
    if (!dateValue)
      return "-";
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
      const [y, m, d] = dateValue.split("-").map(Number);
      return new Date(y, m - 1, d).toLocaleDateString("es-PE", { day: "2-digit", month: "2-digit", year: "numeric" });
    }
    return dateValue;
  }
  getResultClass() {
    const r = this.uploadResponse();
    if (!r?.success)
      return "error";
    if (this.showWarning())
      return "warning";
    return "success";
  }
  getResultIcon() {
    const r = this.uploadResponse();
    if (!r?.success)
      return "error";
    if (this.showWarning())
      return "warning";
    return "check_circle";
  }
  getResultTitle() {
    const r = this.uploadResponse();
    if (!r?.success)
      return "Error al procesar";
    if (this.noDataDetected())
      return "No se detectaron datos";
    if (this.showWarning())
      return "Voucher con advertencias";
    return "Voucher validado correctamente";
  }
  getResultSubtitle() {
    const r = this.uploadResponse();
    if (!r?.success)
      return "No se pudo analizar el voucher";
    if (this.noDataDetected())
      return "La imagen no parece ser un comprobante de pago v\xE1lido";
    if (this.showWarning())
      return "Algunos datos no coinciden exactamente";
    return "Todos los datos coinciden con el cliente";
  }
  getValidationClass(v) {
    if (!v)
      return "neutral";
    return v.coincide ? "success" : "warning";
  }
  /**
   * Calcula el saldo pendiente de una cuota
   * saldoPendiente = monto - montoPagadoReal
   */
  getSaldoPendiente(cuota) {
    const pagado = cuota.montoPagadoReal || 0;
    return Math.max(0, cuota.monto - pagado);
  }
  zoomIn() {
    if (this.zoomLevel() < 3)
      this.zoomLevel.update((z) => z + 0.25);
  }
  zoomOut() {
    if (this.zoomLevel() > 0.5)
      this.zoomLevel.update((z) => z - 0.25);
  }
  onWheel(event) {
    event.preventDefault();
    event.deltaY < 0 ? this.zoomIn() : this.zoomOut();
  }
};
_VoucherPaymentDialogComponent.\u0275fac = function VoucherPaymentDialogComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _VoucherPaymentDialogComponent)(\u0275\u0275directiveInject(MatDialogRef), \u0275\u0275directiveInject(MAT_DIALOG_DATA), \u0275\u0275directiveInject(ComprobanteService));
};
_VoucherPaymentDialogComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _VoucherPaymentDialogComponent, selectors: [["app-voucher-payment-dialog"]], decls: 77, vars: 11, consts: [["fileInput", ""], [1, "voucher-dialog"], [1, "dialog-header"], [1, "header-content"], [1, "header-icon"], [1, "header-text"], [1, "header-subtitle"], [1, "inline-icon"], ["mat-icon-button", "", 1, "close-btn", 3, "click"], [1, "dialog-body"], [1, "two-column-layout"], [1, "left-column"], [1, "info-card", "client-card"], [1, "card-header"], [1, "card-body"], [1, "info-row"], [1, "info-item"], [1, "info-label"], [1, "info-value"], [1, "info-value", "highlight"], [1, "info-card", "installments-card"], [1, "installments-grid"], [1, "installment-chip", 3, "active"], [1, "next-installment"], [1, "date-badge"], [1, "error-message"], [1, "right-column"], [1, "image-viewer"], [1, "viewer-header"], [1, "viewer-title"], [1, "zoom-controls"], [1, "viewer-body"], [1, "dialog-actions"], ["mat-button", "", 1, "btn-cancel", 3, "click"], [1, "action-buttons"], ["mat-flat-button", "", 1, "btn-analyze", 3, "disabled"], ["mat-flat-button", "", 1, "btn-confirm", 3, "class"], [1, "installment-chip"], [1, "chip-number"], [1, "chip-amount"], [1, "chip-amount-original"], [1, "partial-badge"], [1, "result-banner"], [1, "result-icon"], [1, "result-text"], [1, "result-title"], [1, "result-subtitle"], [1, "validations-grid"], [1, "validation-card"], [1, "validation-icon"], [1, "validation-content"], [1, "validation-label"], [1, "validation-value"], [1, "validation-value", "truncate"], [1, "bank-details"], [1, "selected-installment"], [1, "amount"], [1, "auto-select-info"], [1, "detail-item"], ["mat-icon-button", "", 1, "zoom-btn", 3, "click", "disabled"], [1, "zoom-level"], [1, "zoom-divider"], ["mat-icon-button", "", 1, "delete-btn", 3, "click"], [1, "upload-area", 3, "click", "dragover", "drop"], [1, "upload-content"], [1, "upload-icon"], [1, "upload-title"], [1, "upload-subtitle"], [1, "upload-formats"], [1, "format-badge"], [1, "size-info"], ["type", "file", "accept", "image/jpeg,image/png,image/webp", 1, "hidden", 3, "change"], [1, "image-container", 3, "wheel"], ["alt", "Voucher", 3, "src"], [1, "loading-overlay"], [1, "loading-content"], ["diameter", "48"], ["mat-flat-button", "", 1, "btn-analyze", 3, "click", "disabled"], ["mat-flat-button", "", 1, "btn-confirm", 3, "click"]], template: function VoucherPaymentDialogComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 1)(1, "div", 2)(2, "div", 3)(3, "div", 4)(4, "mat-icon");
    \u0275\u0275text(5, "receipt_long");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 5)(7, "h2");
    \u0275\u0275text(8, "Registrar Pago");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "span", 6)(10, "mat-icon", 7);
    \u0275\u0275text(11, "smart_toy");
    \u0275\u0275elementEnd();
    \u0275\u0275text(12, " Validaci\xF3n autom\xE1tica con IA ");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(13, "button", 8);
    \u0275\u0275listener("click", function VoucherPaymentDialogComponent_Template_button_click_13_listener() {
      return ctx.cancel();
    });
    \u0275\u0275elementStart(14, "mat-icon");
    \u0275\u0275text(15, "close");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(16, "mat-dialog-content", 9)(17, "div", 10)(18, "div", 11)(19, "div", 12)(20, "div", 13)(21, "mat-icon");
    \u0275\u0275text(22, "person");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "span");
    \u0275\u0275text(24, "Informaci\xF3n del Cliente");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(25, "div", 14)(26, "div", 15)(27, "div", 16)(28, "span", 17);
    \u0275\u0275text(29, "Cliente");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(30, "span", 18);
    \u0275\u0275text(31);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(32, "div", 16)(33, "span", 17);
    \u0275\u0275text(34, "Documento");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(35, "span", 19);
    \u0275\u0275text(36);
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275elementStart(37, "div", 20)(38, "div", 13)(39, "mat-icon");
    \u0275\u0275text(40, "payments");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(41, "span");
    \u0275\u0275text(42, "Cuotas Pendientes");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(43, "div", 14)(44, "div", 21);
    \u0275\u0275repeaterCreate(45, VoucherPaymentDialogComponent_For_46_Template, 5, 4, "div", 22, _forTrack03);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(47, "div", 23)(48, "mat-icon");
    \u0275\u0275text(49, "arrow_forward");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(50, "span");
    \u0275\u0275text(51, "Pr\xF3xima cuota:");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(52, VoucherPaymentDialogComponent_Conditional_52_Template, 5, 5)(53, VoucherPaymentDialogComponent_Conditional_53_Template, 3, 5, "strong");
    \u0275\u0275elementStart(54, "span", 24);
    \u0275\u0275text(55);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275conditionalCreate(56, VoucherPaymentDialogComponent_Conditional_56_Template, 10, 6);
    \u0275\u0275conditionalCreate(57, VoucherPaymentDialogComponent_Conditional_57_Template, 5, 1, "div", 25);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(58, "div", 26)(59, "div", 27)(60, "div", 28)(61, "span", 29)(62, "mat-icon");
    \u0275\u0275text(63, "image");
    \u0275\u0275elementEnd();
    \u0275\u0275text(64, " Voucher de Pago ");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(65, VoucherPaymentDialogComponent_Conditional_65_Template, 14, 6, "div", 30);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(66, "div", 31);
    \u0275\u0275conditionalCreate(67, VoucherPaymentDialogComponent_Conditional_67_Template, 20, 0)(68, VoucherPaymentDialogComponent_Conditional_68_Template, 3, 4);
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275elementStart(69, "mat-dialog-actions", 32)(70, "button", 33);
    \u0275\u0275listener("click", function VoucherPaymentDialogComponent_Template_button_click_70_listener() {
      return ctx.cancel();
    });
    \u0275\u0275elementStart(71, "mat-icon");
    \u0275\u0275text(72, "close");
    \u0275\u0275elementEnd();
    \u0275\u0275text(73, " Cancelar ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(74, "div", 34);
    \u0275\u0275conditionalCreate(75, VoucherPaymentDialogComponent_Conditional_75_Template, 4, 1, "button", 35)(76, VoucherPaymentDialogComponent_Conditional_76_Template, 4, 2, "button", 36);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    let tmp_4_0;
    let tmp_5_0;
    \u0275\u0275classProp("dark-mode", ctx.isDarkMode());
    \u0275\u0275advance(31);
    \u0275\u0275textInterpolate(ctx.data.nombreCliente);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx.data.documentoCliente);
    \u0275\u0275advance(9);
    \u0275\u0275repeater(ctx.cuotasPendientes());
    \u0275\u0275advance(7);
    \u0275\u0275conditional(((tmp_4_0 = ctx.cuotaMasProxima()) == null ? null : tmp_4_0.montoPagadoReal) && ctx.cuotaMasProxima().montoPagadoReal > 0 ? 52 : 53);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx.formatDate((tmp_5_0 = ctx.cuotaMasProxima()) == null ? null : tmp_5_0.dueDate));
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx.uploadResponse() ? 56 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx.errorMessage() ? 57 : -1);
    \u0275\u0275advance(8);
    \u0275\u0275conditional(ctx.previewUrl() ? 65 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(!ctx.previewUrl() ? 67 : 68);
    \u0275\u0275advance(8);
    \u0275\u0275conditional(!ctx.uploadResponse() ? 75 : 76);
  }
}, dependencies: [
  CommonModule,
  MatDialogModule,
  MatDialogActions,
  MatDialogContent,
  MatButtonModule,
  MatButton,
  MatIconButton,
  MatIconModule,
  MatIcon,
  MatProgressSpinnerModule,
  MatProgressSpinner,
  DecimalPipe
], styles: ['\n\n[_nghost-%COMP%] {\n  display: block;\n}\n.voucher-dialog[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  max-height: 85vh;\n  min-width: 900px;\n  background: #ffffff;\n  overflow: hidden;\n}\n.voucher-dialog.dark-mode[_ngcontent-%COMP%] {\n  background: #0f172a;\n}\n.dialog-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 18px 24px;\n  background:\n    linear-gradient(\n      135deg,\n      #059669 0%,\n      #10b981 100%);\n  color: white;\n}\n.header-content[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 16px;\n}\n.header-icon[_ngcontent-%COMP%] {\n  width: 48px;\n  height: 48px;\n  background: rgba(255, 255, 255, 0.2);\n  border-radius: 12px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.header-icon[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 26px;\n  width: 26px;\n  height: 26px;\n}\n.header-text[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 20px;\n  font-weight: 600;\n}\n.header-subtitle[_ngcontent-%COMP%] {\n  font-size: 13px;\n  opacity: 0.9;\n  display: flex;\n  align-items: center;\n  gap: 6px;\n}\n.inline-icon[_ngcontent-%COMP%] {\n  font-size: 14px !important;\n  width: 14px !important;\n  height: 14px !important;\n}\n.close-btn[_ngcontent-%COMP%] {\n  color: white !important;\n  opacity: 0.8;\n  transition: opacity 0.2s;\n}\n.close-btn[_ngcontent-%COMP%]:hover {\n  opacity: 1;\n}\n.dialog-body[_ngcontent-%COMP%] {\n  flex: 1;\n  padding: 24px !important;\n  overflow-y: auto !important;\n  overflow-x: hidden !important;\n  background: #f8fafc;\n  max-height: calc(85vh - 160px);\n}\n.dark-mode[_ngcontent-%COMP%]   .dialog-body[_ngcontent-%COMP%] {\n  background: #0f172a;\n}\n.two-column-layout[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 1fr 380px;\n  gap: 24px;\n}\n.left-column[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 16px;\n  min-width: 0;\n}\n.info-card[_ngcontent-%COMP%] {\n  background: white;\n  border-radius: 14px;\n  border: 1px solid #e2e8f0;\n  overflow: hidden;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);\n}\n.dark-mode[_ngcontent-%COMP%]   .info-card[_ngcontent-%COMP%] {\n  background: #1e293b;\n  border-color: #334155;\n}\n.card-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 12px 16px;\n  background: #f1f5f9;\n  border-bottom: 1px solid #e2e8f0;\n  font-size: 13px;\n  font-weight: 600;\n  color: #475569;\n}\n.dark-mode[_ngcontent-%COMP%]   .card-header[_ngcontent-%COMP%] {\n  background: #334155;\n  border-color: #475569;\n  color: #cbd5e1;\n}\n.card-header[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 18px;\n  width: 18px;\n  height: 18px;\n  color: #64748b;\n}\n.dark-mode[_ngcontent-%COMP%]   .card-header[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  color: #94a3b8;\n}\n.card-body[_ngcontent-%COMP%] {\n  padding: 16px;\n}\n.info-row[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 1.5fr 1fr;\n  gap: 20px;\n}\n.info-item[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n}\n.info-label[_ngcontent-%COMP%] {\n  font-size: 11px;\n  color: #64748b;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n  font-weight: 500;\n}\n.dark-mode[_ngcontent-%COMP%]   .info-label[_ngcontent-%COMP%] {\n  color: #94a3b8;\n}\n.info-value[_ngcontent-%COMP%] {\n  font-size: 14px;\n  font-weight: 600;\n  color: #1e293b;\n  word-break: break-word;\n}\n.dark-mode[_ngcontent-%COMP%]   .info-value[_ngcontent-%COMP%] {\n  color: #f1f5f9;\n}\n.info-value.highlight[_ngcontent-%COMP%] {\n  color: #059669;\n  font-family:\n    "SF Mono",\n    Monaco,\n    monospace;\n  font-size: 15px;\n}\n.installments-grid[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 10px;\n  margin-bottom: 14px;\n}\n.installment-chip[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  padding: 8px 14px;\n  background: #f1f5f9;\n  border-radius: 10px;\n  border: 1.5px solid #e2e8f0;\n  transition: all 0.2s;\n}\n.dark-mode[_ngcontent-%COMP%]   .installment-chip[_ngcontent-%COMP%] {\n  background: #334155;\n  border-color: #475569;\n}\n.installment-chip.active[_ngcontent-%COMP%] {\n  background: #dcfce7;\n  border-color: #22c55e;\n}\n.dark-mode[_ngcontent-%COMP%]   .installment-chip.active[_ngcontent-%COMP%] {\n  background: rgba(34, 197, 94, 0.2);\n  border-color: #22c55e;\n}\n.chip-number[_ngcontent-%COMP%] {\n  font-size: 12px;\n  font-weight: 700;\n  color: #64748b;\n}\n.installment-chip.active[_ngcontent-%COMP%]   .chip-number[_ngcontent-%COMP%] {\n  color: #16a34a;\n}\n.dark-mode[_ngcontent-%COMP%]   .installment-chip.active[_ngcontent-%COMP%]   .chip-number[_ngcontent-%COMP%] {\n  color: #4ade80;\n}\n.chip-amount[_ngcontent-%COMP%] {\n  font-size: 13px;\n  font-weight: 600;\n  color: #1e293b;\n}\n.dark-mode[_ngcontent-%COMP%]   .chip-amount[_ngcontent-%COMP%] {\n  color: #e2e8f0;\n}\n.installment-chip.active[_ngcontent-%COMP%]   .chip-amount[_ngcontent-%COMP%] {\n  color: #15803d;\n}\n.dark-mode[_ngcontent-%COMP%]   .installment-chip.active[_ngcontent-%COMP%]   .chip-amount[_ngcontent-%COMP%] {\n  color: #86efac;\n}\n.chip-amount-original[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: #64748b;\n  margin-right: 4px;\n  opacity: 0.8;\n}\n.dark-mode[_ngcontent-%COMP%]   .chip-amount-original[_ngcontent-%COMP%] {\n  color: #94a3b8;\n}\n.installment-chip.active[_ngcontent-%COMP%]   .chip-amount-original[_ngcontent-%COMP%] {\n  color: #22c55e;\n  opacity: 0.7;\n}\n.partial-badge[_ngcontent-%COMP%] {\n  font-size: 10px;\n  font-weight: 600;\n  padding: 2px 6px;\n  background: #f59e0b;\n  color: white;\n  border-radius: 4px;\n  margin-left: 4px;\n}\n.next-installment[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  flex-wrap: wrap;\n  padding: 12px 14px;\n  background: #f0fdf4;\n  border-radius: 10px;\n  font-size: 13px;\n  color: #166534;\n}\n.dark-mode[_ngcontent-%COMP%]   .next-installment[_ngcontent-%COMP%] {\n  background: rgba(34, 197, 94, 0.15);\n  color: #86efac;\n}\n.next-installment[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 18px;\n  width: 18px;\n  height: 18px;\n  color: #22c55e;\n}\n.next-installment[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-weight: 700;\n}\n.date-badge[_ngcontent-%COMP%] {\n  margin-left: auto;\n  padding: 5px 10px;\n  background: white;\n  border-radius: 8px;\n  font-size: 12px;\n  font-weight: 600;\n  color: #059669;\n  border: 1px solid #bbf7d0;\n}\n.dark-mode[_ngcontent-%COMP%]   .date-badge[_ngcontent-%COMP%] {\n  background: #1e293b;\n  border-color: #22c55e;\n  color: #4ade80;\n}\n.result-banner[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 14px;\n  padding: 14px 16px;\n  border-radius: 12px;\n  border: 1.5px solid;\n}\n.result-banner.success[_ngcontent-%COMP%] {\n  background: #dcfce7;\n  border-color: #86efac;\n}\n.dark-mode[_ngcontent-%COMP%]   .result-banner.success[_ngcontent-%COMP%] {\n  background: rgba(34, 197, 94, 0.15);\n  border-color: #22c55e;\n}\n.result-banner.warning[_ngcontent-%COMP%] {\n  background: #fef3c7;\n  border-color: #fcd34d;\n}\n.dark-mode[_ngcontent-%COMP%]   .result-banner.warning[_ngcontent-%COMP%] {\n  background: rgba(245, 158, 11, 0.15);\n  border-color: #f59e0b;\n}\n.result-banner.error[_ngcontent-%COMP%] {\n  background: #fee2e2;\n  border-color: #fca5a5;\n}\n.dark-mode[_ngcontent-%COMP%]   .result-banner.error[_ngcontent-%COMP%] {\n  background: rgba(239, 68, 68, 0.15);\n  border-color: #ef4444;\n}\n.result-icon[_ngcontent-%COMP%] {\n  width: 40px;\n  height: 40px;\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-shrink: 0;\n}\n.result-banner.success[_ngcontent-%COMP%]   .result-icon[_ngcontent-%COMP%] {\n  background: #22c55e;\n  color: white;\n}\n.result-banner.warning[_ngcontent-%COMP%]   .result-icon[_ngcontent-%COMP%] {\n  background: #f59e0b;\n  color: white;\n}\n.result-banner.error[_ngcontent-%COMP%]   .result-icon[_ngcontent-%COMP%] {\n  background: #ef4444;\n  color: white;\n}\n.result-text[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 3px;\n}\n.result-title[_ngcontent-%COMP%] {\n  font-size: 14px;\n  font-weight: 700;\n  color: #1e293b;\n}\n.dark-mode[_ngcontent-%COMP%]   .result-title[_ngcontent-%COMP%] {\n  color: #f1f5f9;\n}\n.result-subtitle[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: #64748b;\n}\n.dark-mode[_ngcontent-%COMP%]   .result-subtitle[_ngcontent-%COMP%] {\n  color: #94a3b8;\n}\n.validations-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 12px;\n}\n.validation-card[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  padding: 12px 14px;\n  border-radius: 12px;\n  border: 1.5px solid;\n  background: white;\n}\n.dark-mode[_ngcontent-%COMP%]   .validation-card[_ngcontent-%COMP%] {\n  background: #1e293b;\n}\n.validation-card.success[_ngcontent-%COMP%] {\n  border-color: #86efac;\n  background: #f0fdf4;\n}\n.dark-mode[_ngcontent-%COMP%]   .validation-card.success[_ngcontent-%COMP%] {\n  border-color: #22c55e;\n  background: rgba(34, 197, 94, 0.1);\n}\n.validation-card.warning[_ngcontent-%COMP%] {\n  border-color: #fcd34d;\n  background: #fffbeb;\n}\n.dark-mode[_ngcontent-%COMP%]   .validation-card.warning[_ngcontent-%COMP%] {\n  border-color: #f59e0b;\n  background: rgba(245, 158, 11, 0.1);\n}\n.validation-card.neutral[_ngcontent-%COMP%] {\n  border-color: #e2e8f0;\n}\n.dark-mode[_ngcontent-%COMP%]   .validation-card.neutral[_ngcontent-%COMP%] {\n  border-color: #475569;\n}\n.validation-icon[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 22px;\n  width: 22px;\n  height: 22px;\n}\n.validation-card.success[_ngcontent-%COMP%]   .validation-icon[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  color: #22c55e;\n}\n.validation-card.warning[_ngcontent-%COMP%]   .validation-icon[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  color: #f59e0b;\n}\n.validation-content[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 3px;\n  min-width: 0;\n  flex: 1;\n}\n.validation-label[_ngcontent-%COMP%] {\n  font-size: 11px;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n  color: #94a3b8;\n  font-weight: 500;\n}\n.validation-value[_ngcontent-%COMP%] {\n  font-size: 13px;\n  font-weight: 600;\n  color: #1e293b;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.dark-mode[_ngcontent-%COMP%]   .validation-value[_ngcontent-%COMP%] {\n  color: #f1f5f9;\n}\n.truncate[_ngcontent-%COMP%] {\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.bank-details[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 16px;\n  padding: 12px 16px;\n  background: #f8fafc;\n  border-radius: 10px;\n  border: 1px solid #e2e8f0;\n}\n.dark-mode[_ngcontent-%COMP%]   .bank-details[_ngcontent-%COMP%] {\n  background: #1e293b;\n  border-color: #334155;\n}\n.detail-item[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  font-size: 13px;\n  color: #475569;\n}\n.dark-mode[_ngcontent-%COMP%]   .detail-item[_ngcontent-%COMP%] {\n  color: #94a3b8;\n}\n.detail-item[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 16px;\n  width: 16px;\n  height: 16px;\n  color: #94a3b8;\n}\n.selected-installment[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 14px 16px;\n  border-radius: 12px;\n  font-size: 14px;\n  border: 2px solid;\n}\n.selected-installment.success[_ngcontent-%COMP%] {\n  background: #dcfce7;\n  border-color: #22c55e;\n  color: #166534;\n}\n.dark-mode[_ngcontent-%COMP%]   .selected-installment.success[_ngcontent-%COMP%] {\n  background: rgba(34, 197, 94, 0.15);\n  color: #86efac;\n}\n.selected-installment.warning[_ngcontent-%COMP%] {\n  background: #fef3c7;\n  border-color: #f59e0b;\n  color: #92400e;\n}\n.dark-mode[_ngcontent-%COMP%]   .selected-installment.warning[_ngcontent-%COMP%] {\n  background: rgba(245, 158, 11, 0.15);\n  color: #fcd34d;\n}\n.selected-installment[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 20px;\n  width: 20px;\n  height: 20px;\n}\n.selected-installment[_ngcontent-%COMP%]   .amount[_ngcontent-%COMP%] {\n  opacity: 0.8;\n}\n.auto-select-info[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 12px 16px;\n  background: #eff6ff;\n  border-radius: 10px;\n  border: 1px solid #bfdbfe;\n  font-size: 12px;\n  color: #1d4ed8;\n}\n.dark-mode[_ngcontent-%COMP%]   .auto-select-info[_ngcontent-%COMP%] {\n  background: rgba(59, 130, 246, 0.1);\n  border-color: #3b82f6;\n  color: #93c5fd;\n}\n.auto-select-info[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 18px;\n  width: 18px;\n  height: 18px;\n  color: #3b82f6;\n}\n.error-message[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  padding: 14px 16px;\n  background: #fef2f2;\n  border-radius: 10px;\n  border: 1px solid #fecaca;\n  font-size: 13px;\n  color: #dc2626;\n}\n.dark-mode[_ngcontent-%COMP%]   .error-message[_ngcontent-%COMP%] {\n  background: rgba(239, 68, 68, 0.1);\n  border-color: #ef4444;\n  color: #fca5a5;\n}\n.right-column[_ngcontent-%COMP%] {\n  display: flex;\n}\n.image-viewer[_ngcontent-%COMP%] {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  background: white;\n  border-radius: 14px;\n  border: 1px solid #e2e8f0;\n  overflow: hidden;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);\n}\n.dark-mode[_ngcontent-%COMP%]   .image-viewer[_ngcontent-%COMP%] {\n  background: #1e293b;\n  border-color: #334155;\n}\n.viewer-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 12px 16px;\n  background: #f8fafc;\n  border-bottom: 1px solid #e2e8f0;\n}\n.dark-mode[_ngcontent-%COMP%]   .viewer-header[_ngcontent-%COMP%] {\n  background: #0f172a;\n  border-color: #334155;\n}\n.viewer-title[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  font-size: 13px;\n  font-weight: 600;\n  color: #475569;\n}\n.dark-mode[_ngcontent-%COMP%]   .viewer-title[_ngcontent-%COMP%] {\n  color: #94a3b8;\n}\n.viewer-title[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 18px;\n  width: 18px;\n  height: 18px;\n}\n.zoom-controls[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n}\n.zoom-btn[_ngcontent-%COMP%] {\n  width: 30px !important;\n  height: 30px !important;\n  background: white !important;\n  border: 1px solid #e2e8f0 !important;\n  border-radius: 8px !important;\n}\n.dark-mode[_ngcontent-%COMP%]   .zoom-btn[_ngcontent-%COMP%] {\n  background: #334155 !important;\n  border-color: #475569 !important;\n}\n.zoom-btn[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 18px !important;\n  width: 18px !important;\n  height: 18px !important;\n  color: #64748b;\n}\n.dark-mode[_ngcontent-%COMP%]   .zoom-btn[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  color: #94a3b8;\n}\n.zoom-level[_ngcontent-%COMP%] {\n  font-size: 12px;\n  font-weight: 600;\n  color: #64748b;\n  min-width: 40px;\n  text-align: center;\n}\n.dark-mode[_ngcontent-%COMP%]   .zoom-level[_ngcontent-%COMP%] {\n  color: #94a3b8;\n}\n.zoom-divider[_ngcontent-%COMP%] {\n  width: 1px;\n  height: 24px;\n  background: #e2e8f0;\n  margin: 0 6px;\n}\n.dark-mode[_ngcontent-%COMP%]   .zoom-divider[_ngcontent-%COMP%] {\n  background: #475569;\n}\n.delete-btn[_ngcontent-%COMP%] {\n  width: 30px !important;\n  height: 30px !important;\n  background: #fef2f2 !important;\n  border: 1px solid #fecaca !important;\n  border-radius: 8px !important;\n}\n.dark-mode[_ngcontent-%COMP%]   .delete-btn[_ngcontent-%COMP%] {\n  background: rgba(239, 68, 68, 0.15) !important;\n  border-color: #ef4444 !important;\n}\n.delete-btn[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 18px !important;\n  width: 18px !important;\n  height: 18px !important;\n  color: #ef4444;\n}\n.viewer-body[_ngcontent-%COMP%] {\n  flex: 1;\n  min-height: 380px;\n  position: relative;\n  background: #f1f5f9;\n}\n.dark-mode[_ngcontent-%COMP%]   .viewer-body[_ngcontent-%COMP%] {\n  background: #0f172a;\n}\n.upload-area[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 16px;\n  border: 2px dashed #cbd5e1;\n  border-radius: 14px;\n  cursor: pointer;\n  transition: all 0.2s;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background: white;\n}\n.dark-mode[_ngcontent-%COMP%]   .upload-area[_ngcontent-%COMP%] {\n  border-color: #475569;\n  background: #1e293b;\n}\n.upload-area[_ngcontent-%COMP%]:hover {\n  border-color: #22c55e;\n  background: #f0fdf4;\n}\n.dark-mode[_ngcontent-%COMP%]   .upload-area[_ngcontent-%COMP%]:hover {\n  border-color: #22c55e;\n  background: rgba(34, 197, 94, 0.1);\n}\n.upload-content[_ngcontent-%COMP%] {\n  text-align: center;\n  padding: 24px;\n}\n.upload-icon[_ngcontent-%COMP%] {\n  width: 72px;\n  height: 72px;\n  margin: 0 auto 20px;\n  background:\n    linear-gradient(\n      135deg,\n      #dcfce7 0%,\n      #bbf7d0 100%);\n  border-radius: 18px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.dark-mode[_ngcontent-%COMP%]   .upload-icon[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      rgba(34, 197, 94, 0.2) 0%,\n      rgba(34, 197, 94, 0.3) 100%);\n}\n.upload-icon[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 36px;\n  width: 36px;\n  height: 36px;\n  color: #22c55e;\n}\n.upload-title[_ngcontent-%COMP%] {\n  font-size: 16px;\n  font-weight: 600;\n  color: #1e293b;\n  margin: 0 0 6px;\n}\n.dark-mode[_ngcontent-%COMP%]   .upload-title[_ngcontent-%COMP%] {\n  color: #f1f5f9;\n}\n.upload-subtitle[_ngcontent-%COMP%] {\n  font-size: 13px;\n  color: #64748b;\n  margin: 0 0 20px;\n}\n.dark-mode[_ngcontent-%COMP%]   .upload-subtitle[_ngcontent-%COMP%] {\n  color: #94a3b8;\n}\n.upload-formats[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n}\n.format-badge[_ngcontent-%COMP%] {\n  padding: 5px 10px;\n  background: #f1f5f9;\n  border-radius: 6px;\n  font-size: 11px;\n  font-weight: 600;\n  color: #64748b;\n}\n.dark-mode[_ngcontent-%COMP%]   .format-badge[_ngcontent-%COMP%] {\n  background: #334155;\n  color: #94a3b8;\n}\n.size-info[_ngcontent-%COMP%] {\n  font-size: 11px;\n  color: #94a3b8;\n}\n.image-container[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  overflow: auto;\n  cursor: grab;\n  display: flex;\n}\n.image-container[_ngcontent-%COMP%]:active {\n  cursor: grabbing;\n}\n.image-container[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  max-width: none;\n  transition: transform 0.15s ease;\n  transform-origin: top left;\n}\n.loading-overlay[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  background: rgba(0, 0, 0, 0.75);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  -webkit-backdrop-filter: blur(6px);\n  backdrop-filter: blur(6px);\n}\n.loading-content[_ngcontent-%COMP%] {\n  text-align: center;\n  color: white;\n}\n.loading-content[_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%] {\n  margin: 0 auto 16px;\n}\n.loading-content[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  font-size: 16px;\n  font-weight: 600;\n  margin: 0 0 6px;\n}\n.loading-content[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 13px;\n  opacity: 0.8;\n}\n.dialog-actions[_ngcontent-%COMP%] {\n  display: flex !important;\n  align-items: center;\n  justify-content: space-between;\n  padding: 18px 24px !important;\n  background: #f8fafc;\n  border-top: 1px solid #e2e8f0;\n}\n.dark-mode[_ngcontent-%COMP%]   .dialog-actions[_ngcontent-%COMP%] {\n  background: #1e293b;\n  border-color: #334155;\n}\n.btn-cancel[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  padding: 10px 20px !important;\n  border-radius: 10px !important;\n  font-size: 14px !important;\n  font-weight: 500 !important;\n  color: #64748b !important;\n  border: 1px solid #e2e8f0 !important;\n  background: white !important;\n  transition: all 0.2s;\n}\n.dark-mode[_ngcontent-%COMP%]   .btn-cancel[_ngcontent-%COMP%] {\n  color: #94a3b8 !important;\n  border-color: #475569 !important;\n  background: #0f172a !important;\n}\n.btn-cancel[_ngcontent-%COMP%]:hover {\n  background: #f1f5f9 !important;\n  border-color: #cbd5e1 !important;\n}\n.dark-mode[_ngcontent-%COMP%]   .btn-cancel[_ngcontent-%COMP%]:hover {\n  background: #334155 !important;\n}\n.btn-cancel[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 18px;\n  width: 18px;\n  height: 18px;\n}\n.action-buttons[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 12px;\n}\n.btn-analyze[_ngcontent-%COMP%], \n.btn-confirm[_ngcontent-%COMP%] {\n  display: flex !important;\n  align-items: center;\n  gap: 10px;\n  padding: 12px 24px !important;\n  border-radius: 12px !important;\n  font-size: 14px !important;\n  font-weight: 600 !important;\n  transition: all 0.2s;\n}\n.btn-analyze[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #059669 0%,\n      #10b981 100%) !important;\n  color: white !important;\n  box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);\n}\n.btn-analyze[_ngcontent-%COMP%]:hover:not(:disabled) {\n  box-shadow: 0 6px 16px rgba(5, 150, 105, 0.4);\n  transform: translateY(-2px);\n}\n.btn-analyze[_ngcontent-%COMP%]:disabled {\n  background: #cbd5e1 !important;\n  box-shadow: none;\n}\n.dark-mode[_ngcontent-%COMP%]   .btn-analyze[_ngcontent-%COMP%]:disabled {\n  background: #475569 !important;\n}\n.btn-confirm.success[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #059669 0%,\n      #10b981 100%) !important;\n  color: white !important;\n  box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);\n}\n.btn-confirm.warning[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #d97706 0%,\n      #f59e0b 100%) !important;\n  color: white !important;\n  box-shadow: 0 4px 12px rgba(217, 119, 6, 0.3);\n}\n.btn-confirm[_ngcontent-%COMP%]:hover {\n  transform: translateY(-2px);\n}\n.btn-analyze[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%], \n.btn-confirm[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 20px;\n  width: 20px;\n  height: 20px;\n}\n.hidden[_ngcontent-%COMP%] {\n  display: none;\n}\n/*# sourceMappingURL=voucher-payment-dialog.component.css.map */'] });
var VoucherPaymentDialogComponent = _VoucherPaymentDialogComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VoucherPaymentDialogComponent, [{
    type: Component,
    args: [{ selector: "app-voucher-payment-dialog", standalone: true, imports: [
      CommonModule,
      MatDialogModule,
      MatButtonModule,
      MatIconModule,
      MatProgressSpinnerModule
    ], template: `
    <div class="voucher-dialog" [class.dark-mode]="isDarkMode()">
      <!-- Header elegante -->
      <div class="dialog-header">
        <div class="header-content">
          <div class="header-icon">
            <mat-icon>receipt_long</mat-icon>
          </div>
          <div class="header-text">
            <h2>Registrar Pago</h2>
            <span class="header-subtitle">
              <mat-icon class="inline-icon">smart_toy</mat-icon>
              Validaci\xF3n autom\xE1tica con IA
            </span>
          </div>
        </div>
        <button mat-icon-button class="close-btn" (click)="cancel()">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <mat-dialog-content class="dialog-body">
        <div class="two-column-layout">
          <!-- Columna izquierda: Informaci\xF3n y validaciones -->
          <div class="left-column">
            <!-- Card de informaci\xF3n del cliente -->
            <div class="info-card client-card">
              <div class="card-header">
                <mat-icon>person</mat-icon>
                <span>Informaci\xF3n del Cliente</span>
              </div>
              <div class="card-body">
                <div class="info-row">
                  <div class="info-item">
                    <span class="info-label">Cliente</span>
                    <span class="info-value">{{ data.nombreCliente }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Documento</span>
                    <span class="info-value highlight">{{ data.documentoCliente }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Card de cuotas pendientes -->
            <div class="info-card installments-card">
              <div class="card-header">
                <mat-icon>payments</mat-icon>
                <span>Cuotas Pendientes</span>
              </div>
              <div class="card-body">
                <div class="installments-grid">
                  @for (cuota of cuotasPendientes(); track cuota.numeroCuota) {
                    <div class="installment-chip" [class.active]="cuota.numeroCuota === cuotaMasProxima()?.numeroCuota">
                      <span class="chip-number">C{{ cuota.numeroCuota }}</span>
                      @if (cuota.montoPagadoReal && cuota.montoPagadoReal > 0) {
                        <span class="chip-amount-original">S/{{ cuota.monto | number:'1.2-2' }}</span>
                        <span class="chip-amount">S/{{ getSaldoPendiente(cuota) | number:'1.2-2' }}</span>
                      } @else {
                        <span class="chip-amount">S/{{ cuota.monto | number:'1.2-2' }}</span>
                      }
                    </div>
                  }
                </div>
                <div class="next-installment">
                  <mat-icon>arrow_forward</mat-icon>
                  <span>Pr\xF3xima cuota:</span>
                  @if (cuotaMasProxima()?.montoPagadoReal && cuotaMasProxima()!.montoPagadoReal! > 0) {
                    <strong>C{{ cuotaMasProxima()?.numeroCuota }} - S/{{ getSaldoPendiente(cuotaMasProxima()!) | number:'1.2-2' }}</strong>
                    <span class="partial-badge">Parcial</span>
                  } @else {
                    <strong>C{{ cuotaMasProxima()?.numeroCuota }} - S/{{ cuotaMasProxima()?.monto | number:'1.2-2' }}</strong>
                  }
                  <span class="date-badge">{{ formatDate(cuotaMasProxima()?.dueDate) }}</span>
                </div>
              </div>
            </div>

            <!-- Resultados de validaci\xF3n OCR -->
            @if (uploadResponse()) {
              <!-- Estado general -->
              <div class="result-banner" [class]="getResultClass()">
                <div class="result-icon">
                  <mat-icon>{{ getResultIcon() }}</mat-icon>
                </div>
                <div class="result-text">
                  <span class="result-title">{{ getResultTitle() }}</span>
                  <span class="result-subtitle">{{ getResultSubtitle() }}</span>
                </div>
              </div>

              @if (uploadResponse()?.ocrResult?.success) {
                <!-- Grid de validaciones -->
                <div class="validations-grid">
                  <!-- Monto -->
                  <div class="validation-card" [class]="getValidationClass(uploadResponse()?.validacionMonto)">
                    <div class="validation-icon">
                      <mat-icon>{{ uploadResponse()?.validacionMonto?.coincide ? 'check_circle' : 'warning' }}</mat-icon>
                    </div>
                    <div class="validation-content">
                      <span class="validation-label">Monto</span>
                      <span class="validation-value">S/{{ uploadResponse()?.ocrResult?.monto | number:'1.2-2' }}</span>
                    </div>
                  </div>

                  <!-- Documento -->
                  <div class="validation-card" [class]="getValidationClass(uploadResponse()?.validacionDocumento)">
                    <div class="validation-icon">
                      <mat-icon>{{ uploadResponse()?.validacionDocumento?.coincide ? 'check_circle' : 'warning' }}</mat-icon>
                    </div>
                    <div class="validation-content">
                      <span class="validation-label">Documento</span>
                      <span class="validation-value">{{ uploadResponse()?.ocrResult?.documento || '-' }}</span>
                    </div>
                  </div>

                  <!-- Nombre -->
                  <div class="validation-card" [class]="getValidationClass(uploadResponse()?.validacionNombre)">
                    <div class="validation-icon">
                      <mat-icon>{{ uploadResponse()?.validacionNombre?.coincide ? 'check_circle' : 'warning' }}</mat-icon>
                    </div>
                    <div class="validation-content">
                      <span class="validation-label">Nombre</span>
                      <span class="validation-value truncate">{{ uploadResponse()?.ocrResult?.nombre || '-' }}</span>
                    </div>
                  </div>
                </div>

                <!-- Detalles del banco -->
                @if (uploadResponse()?.ocrResult?.banco || uploadResponse()?.ocrResult?.numeroOperacion) {
                  <div class="bank-details">
                    @if (uploadResponse()?.ocrResult?.banco) {
                      <div class="detail-item">
                        <mat-icon>account_balance</mat-icon>
                        <span>{{ uploadResponse()?.ocrResult?.banco }}</span>
                      </div>
                    }
                    @if (uploadResponse()?.ocrResult?.numeroOperacion) {
                      <div class="detail-item">
                        <mat-icon>tag</mat-icon>
                        <span>Op. {{ uploadResponse()?.ocrResult?.numeroOperacion }}</span>
                      </div>
                    }
                    @if (uploadResponse()?.ocrResult?.fecha) {
                      <div class="detail-item">
                        <mat-icon>event</mat-icon>
                        <span>{{ uploadResponse()?.ocrResult?.fecha }}</span>
                      </div>
                    }
                  </div>
                }

                <!-- Cuota a registrar -->
                <div class="selected-installment" [class]="cuotaCoincidente() ? 'success' : 'warning'">
                  <mat-icon>{{ cuotaCoincidente() ? 'check_circle' : 'info' }}</mat-icon>
                  <span>Se registrar\xE1:</span>
                  <strong>Cuota {{ (cuotaCoincidente() || cuotaMasProxima())?.numeroCuota }}</strong>
                  <span class="amount">(S/{{ (cuotaCoincidente() || cuotaMasProxima())?.monto | number:'1.2-2' }})</span>
                </div>

                <!-- Auto-selecci\xF3n info -->
                <div class="auto-select-info">
                  <mat-icon>auto_awesome</mat-icon>
                  <span>Al confirmar se seleccionar\xE1 autom\xE1ticamente: <strong>Contacto Directo \u2192 Cancelaci\xF3n</strong></span>
                </div>
              }
            }

            <!-- Error message -->
            @if (errorMessage()) {
              <div class="error-message">
                <mat-icon>error_outline</mat-icon>
                <span>{{ errorMessage() }}</span>
              </div>
            }
          </div>

          <!-- Columna derecha: Visor de imagen -->
          <div class="right-column">
            <div class="image-viewer">
              <div class="viewer-header">
                <span class="viewer-title">
                  <mat-icon>image</mat-icon>
                  Voucher de Pago
                </span>
                @if (previewUrl()) {
                  <div class="zoom-controls">
                    <button mat-icon-button (click)="zoomOut()" [disabled]="zoomLevel() <= 0.5" class="zoom-btn">
                      <mat-icon>remove</mat-icon>
                    </button>
                    <span class="zoom-level">{{ (zoomLevel() * 100) | number:'1.0-0' }}%</span>
                    <button mat-icon-button (click)="zoomIn()" [disabled]="zoomLevel() >= 3" class="zoom-btn">
                      <mat-icon>add</mat-icon>
                    </button>
                    <div class="zoom-divider"></div>
                    <button mat-icon-button (click)="removeFile()" class="delete-btn">
                      <mat-icon>delete_outline</mat-icon>
                    </button>
                  </div>
                }
              </div>

              <div class="viewer-body">
                @if (!previewUrl()) {
                  <!-- \xC1rea de drag & drop -->
                  <div class="upload-area" (click)="fileInput.click()" (dragover)="onDragOver($event)" (drop)="onDrop($event)">
                    <div class="upload-content">
                      <div class="upload-icon">
                        <mat-icon>cloud_upload</mat-icon>
                      </div>
                      <p class="upload-title">Arrastra tu voucher aqu\xED</p>
                      <p class="upload-subtitle">o haz clic para seleccionar</p>
                      <div class="upload-formats">
                        <span class="format-badge">JPG</span>
                        <span class="format-badge">PNG</span>
                        <span class="format-badge">WebP</span>
                        <span class="size-info">Max 5MB</span>
                      </div>
                    </div>
                  </div>
                  <input #fileInput type="file" accept="image/jpeg,image/png,image/webp" class="hidden" (change)="onFileSelected($event)" />
                } @else {
                  <!-- Preview con zoom -->
                  <div class="image-container" (wheel)="onWheel($event)">
                    <img [src]="previewUrl()" alt="Voucher" [style.transform]="'scale(' + zoomLevel() + ')'" />
                  </div>

                  <!-- Spinner overlay -->
                  @if (isUploading()) {
                    <div class="loading-overlay">
                      <div class="loading-content">
                        <mat-spinner diameter="48"></mat-spinner>
                        <p>Analizando voucher...</p>
                        <span>Procesando con IA</span>
                      </div>
                    </div>
                  }
                }
              </div>
            </div>
          </div>
        </div>
      </mat-dialog-content>

      <mat-dialog-actions class="dialog-actions">
        <button mat-button class="btn-cancel" (click)="cancel()">
          <mat-icon>close</mat-icon>
          Cancelar
        </button>

        <div class="action-buttons">
          @if (!uploadResponse()) {
            <button mat-flat-button class="btn-analyze" [disabled]="!selectedFile() || isUploading()" (click)="upload()">
              <mat-icon>psychology</mat-icon>
              Analizar con IA
            </button>
          } @else {
            <button mat-flat-button class="btn-confirm" [class]="showWarning() ? 'warning' : 'success'" (click)="confirm()">
              <mat-icon>done_all</mat-icon>
              Confirmar Pago
            </button>
          }
        </div>
      </mat-dialog-actions>
    </div>
  `, styles: ['/* angular:styles/component:css;d38a1e6304d60dbbfbba584316ca47d244f4cf9c975eb285f058e21e7a2cffba;C:/Users/HP/Documents/Kubito-2.0-v1/cashi-discador-frontend/cashi-discador-frontend/src/app/collection-management/components/voucher-payment-dialog/voucher-payment-dialog.component.ts */\n:host {\n  display: block;\n}\n.voucher-dialog {\n  display: flex;\n  flex-direction: column;\n  max-height: 85vh;\n  min-width: 900px;\n  background: #ffffff;\n  overflow: hidden;\n}\n.voucher-dialog.dark-mode {\n  background: #0f172a;\n}\n.dialog-header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 18px 24px;\n  background:\n    linear-gradient(\n      135deg,\n      #059669 0%,\n      #10b981 100%);\n  color: white;\n}\n.header-content {\n  display: flex;\n  align-items: center;\n  gap: 16px;\n}\n.header-icon {\n  width: 48px;\n  height: 48px;\n  background: rgba(255, 255, 255, 0.2);\n  border-radius: 12px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.header-icon mat-icon {\n  font-size: 26px;\n  width: 26px;\n  height: 26px;\n}\n.header-text h2 {\n  margin: 0;\n  font-size: 20px;\n  font-weight: 600;\n}\n.header-subtitle {\n  font-size: 13px;\n  opacity: 0.9;\n  display: flex;\n  align-items: center;\n  gap: 6px;\n}\n.inline-icon {\n  font-size: 14px !important;\n  width: 14px !important;\n  height: 14px !important;\n}\n.close-btn {\n  color: white !important;\n  opacity: 0.8;\n  transition: opacity 0.2s;\n}\n.close-btn:hover {\n  opacity: 1;\n}\n.dialog-body {\n  flex: 1;\n  padding: 24px !important;\n  overflow-y: auto !important;\n  overflow-x: hidden !important;\n  background: #f8fafc;\n  max-height: calc(85vh - 160px);\n}\n.dark-mode .dialog-body {\n  background: #0f172a;\n}\n.two-column-layout {\n  display: grid;\n  grid-template-columns: 1fr 380px;\n  gap: 24px;\n}\n.left-column {\n  display: flex;\n  flex-direction: column;\n  gap: 16px;\n  min-width: 0;\n}\n.info-card {\n  background: white;\n  border-radius: 14px;\n  border: 1px solid #e2e8f0;\n  overflow: hidden;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);\n}\n.dark-mode .info-card {\n  background: #1e293b;\n  border-color: #334155;\n}\n.card-header {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 12px 16px;\n  background: #f1f5f9;\n  border-bottom: 1px solid #e2e8f0;\n  font-size: 13px;\n  font-weight: 600;\n  color: #475569;\n}\n.dark-mode .card-header {\n  background: #334155;\n  border-color: #475569;\n  color: #cbd5e1;\n}\n.card-header mat-icon {\n  font-size: 18px;\n  width: 18px;\n  height: 18px;\n  color: #64748b;\n}\n.dark-mode .card-header mat-icon {\n  color: #94a3b8;\n}\n.card-body {\n  padding: 16px;\n}\n.info-row {\n  display: grid;\n  grid-template-columns: 1.5fr 1fr;\n  gap: 20px;\n}\n.info-item {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n}\n.info-label {\n  font-size: 11px;\n  color: #64748b;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n  font-weight: 500;\n}\n.dark-mode .info-label {\n  color: #94a3b8;\n}\n.info-value {\n  font-size: 14px;\n  font-weight: 600;\n  color: #1e293b;\n  word-break: break-word;\n}\n.dark-mode .info-value {\n  color: #f1f5f9;\n}\n.info-value.highlight {\n  color: #059669;\n  font-family:\n    "SF Mono",\n    Monaco,\n    monospace;\n  font-size: 15px;\n}\n.installments-grid {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 10px;\n  margin-bottom: 14px;\n}\n.installment-chip {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  padding: 8px 14px;\n  background: #f1f5f9;\n  border-radius: 10px;\n  border: 1.5px solid #e2e8f0;\n  transition: all 0.2s;\n}\n.dark-mode .installment-chip {\n  background: #334155;\n  border-color: #475569;\n}\n.installment-chip.active {\n  background: #dcfce7;\n  border-color: #22c55e;\n}\n.dark-mode .installment-chip.active {\n  background: rgba(34, 197, 94, 0.2);\n  border-color: #22c55e;\n}\n.chip-number {\n  font-size: 12px;\n  font-weight: 700;\n  color: #64748b;\n}\n.installment-chip.active .chip-number {\n  color: #16a34a;\n}\n.dark-mode .installment-chip.active .chip-number {\n  color: #4ade80;\n}\n.chip-amount {\n  font-size: 13px;\n  font-weight: 600;\n  color: #1e293b;\n}\n.dark-mode .chip-amount {\n  color: #e2e8f0;\n}\n.installment-chip.active .chip-amount {\n  color: #15803d;\n}\n.dark-mode .installment-chip.active .chip-amount {\n  color: #86efac;\n}\n.chip-amount-original {\n  font-size: 12px;\n  color: #64748b;\n  margin-right: 4px;\n  opacity: 0.8;\n}\n.dark-mode .chip-amount-original {\n  color: #94a3b8;\n}\n.installment-chip.active .chip-amount-original {\n  color: #22c55e;\n  opacity: 0.7;\n}\n.partial-badge {\n  font-size: 10px;\n  font-weight: 600;\n  padding: 2px 6px;\n  background: #f59e0b;\n  color: white;\n  border-radius: 4px;\n  margin-left: 4px;\n}\n.next-installment {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  flex-wrap: wrap;\n  padding: 12px 14px;\n  background: #f0fdf4;\n  border-radius: 10px;\n  font-size: 13px;\n  color: #166534;\n}\n.dark-mode .next-installment {\n  background: rgba(34, 197, 94, 0.15);\n  color: #86efac;\n}\n.next-installment mat-icon {\n  font-size: 18px;\n  width: 18px;\n  height: 18px;\n  color: #22c55e;\n}\n.next-installment strong {\n  font-weight: 700;\n}\n.date-badge {\n  margin-left: auto;\n  padding: 5px 10px;\n  background: white;\n  border-radius: 8px;\n  font-size: 12px;\n  font-weight: 600;\n  color: #059669;\n  border: 1px solid #bbf7d0;\n}\n.dark-mode .date-badge {\n  background: #1e293b;\n  border-color: #22c55e;\n  color: #4ade80;\n}\n.result-banner {\n  display: flex;\n  align-items: center;\n  gap: 14px;\n  padding: 14px 16px;\n  border-radius: 12px;\n  border: 1.5px solid;\n}\n.result-banner.success {\n  background: #dcfce7;\n  border-color: #86efac;\n}\n.dark-mode .result-banner.success {\n  background: rgba(34, 197, 94, 0.15);\n  border-color: #22c55e;\n}\n.result-banner.warning {\n  background: #fef3c7;\n  border-color: #fcd34d;\n}\n.dark-mode .result-banner.warning {\n  background: rgba(245, 158, 11, 0.15);\n  border-color: #f59e0b;\n}\n.result-banner.error {\n  background: #fee2e2;\n  border-color: #fca5a5;\n}\n.dark-mode .result-banner.error {\n  background: rgba(239, 68, 68, 0.15);\n  border-color: #ef4444;\n}\n.result-icon {\n  width: 40px;\n  height: 40px;\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-shrink: 0;\n}\n.result-banner.success .result-icon {\n  background: #22c55e;\n  color: white;\n}\n.result-banner.warning .result-icon {\n  background: #f59e0b;\n  color: white;\n}\n.result-banner.error .result-icon {\n  background: #ef4444;\n  color: white;\n}\n.result-text {\n  display: flex;\n  flex-direction: column;\n  gap: 3px;\n}\n.result-title {\n  font-size: 14px;\n  font-weight: 700;\n  color: #1e293b;\n}\n.dark-mode .result-title {\n  color: #f1f5f9;\n}\n.result-subtitle {\n  font-size: 12px;\n  color: #64748b;\n}\n.dark-mode .result-subtitle {\n  color: #94a3b8;\n}\n.validations-grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 12px;\n}\n.validation-card {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  padding: 12px 14px;\n  border-radius: 12px;\n  border: 1.5px solid;\n  background: white;\n}\n.dark-mode .validation-card {\n  background: #1e293b;\n}\n.validation-card.success {\n  border-color: #86efac;\n  background: #f0fdf4;\n}\n.dark-mode .validation-card.success {\n  border-color: #22c55e;\n  background: rgba(34, 197, 94, 0.1);\n}\n.validation-card.warning {\n  border-color: #fcd34d;\n  background: #fffbeb;\n}\n.dark-mode .validation-card.warning {\n  border-color: #f59e0b;\n  background: rgba(245, 158, 11, 0.1);\n}\n.validation-card.neutral {\n  border-color: #e2e8f0;\n}\n.dark-mode .validation-card.neutral {\n  border-color: #475569;\n}\n.validation-icon mat-icon {\n  font-size: 22px;\n  width: 22px;\n  height: 22px;\n}\n.validation-card.success .validation-icon mat-icon {\n  color: #22c55e;\n}\n.validation-card.warning .validation-icon mat-icon {\n  color: #f59e0b;\n}\n.validation-content {\n  display: flex;\n  flex-direction: column;\n  gap: 3px;\n  min-width: 0;\n  flex: 1;\n}\n.validation-label {\n  font-size: 11px;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n  color: #94a3b8;\n  font-weight: 500;\n}\n.validation-value {\n  font-size: 13px;\n  font-weight: 600;\n  color: #1e293b;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.dark-mode .validation-value {\n  color: #f1f5f9;\n}\n.truncate {\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.bank-details {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 16px;\n  padding: 12px 16px;\n  background: #f8fafc;\n  border-radius: 10px;\n  border: 1px solid #e2e8f0;\n}\n.dark-mode .bank-details {\n  background: #1e293b;\n  border-color: #334155;\n}\n.detail-item {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  font-size: 13px;\n  color: #475569;\n}\n.dark-mode .detail-item {\n  color: #94a3b8;\n}\n.detail-item mat-icon {\n  font-size: 16px;\n  width: 16px;\n  height: 16px;\n  color: #94a3b8;\n}\n.selected-installment {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 14px 16px;\n  border-radius: 12px;\n  font-size: 14px;\n  border: 2px solid;\n}\n.selected-installment.success {\n  background: #dcfce7;\n  border-color: #22c55e;\n  color: #166534;\n}\n.dark-mode .selected-installment.success {\n  background: rgba(34, 197, 94, 0.15);\n  color: #86efac;\n}\n.selected-installment.warning {\n  background: #fef3c7;\n  border-color: #f59e0b;\n  color: #92400e;\n}\n.dark-mode .selected-installment.warning {\n  background: rgba(245, 158, 11, 0.15);\n  color: #fcd34d;\n}\n.selected-installment mat-icon {\n  font-size: 20px;\n  width: 20px;\n  height: 20px;\n}\n.selected-installment .amount {\n  opacity: 0.8;\n}\n.auto-select-info {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 12px 16px;\n  background: #eff6ff;\n  border-radius: 10px;\n  border: 1px solid #bfdbfe;\n  font-size: 12px;\n  color: #1d4ed8;\n}\n.dark-mode .auto-select-info {\n  background: rgba(59, 130, 246, 0.1);\n  border-color: #3b82f6;\n  color: #93c5fd;\n}\n.auto-select-info mat-icon {\n  font-size: 18px;\n  width: 18px;\n  height: 18px;\n  color: #3b82f6;\n}\n.error-message {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  padding: 14px 16px;\n  background: #fef2f2;\n  border-radius: 10px;\n  border: 1px solid #fecaca;\n  font-size: 13px;\n  color: #dc2626;\n}\n.dark-mode .error-message {\n  background: rgba(239, 68, 68, 0.1);\n  border-color: #ef4444;\n  color: #fca5a5;\n}\n.right-column {\n  display: flex;\n}\n.image-viewer {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  background: white;\n  border-radius: 14px;\n  border: 1px solid #e2e8f0;\n  overflow: hidden;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);\n}\n.dark-mode .image-viewer {\n  background: #1e293b;\n  border-color: #334155;\n}\n.viewer-header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 12px 16px;\n  background: #f8fafc;\n  border-bottom: 1px solid #e2e8f0;\n}\n.dark-mode .viewer-header {\n  background: #0f172a;\n  border-color: #334155;\n}\n.viewer-title {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  font-size: 13px;\n  font-weight: 600;\n  color: #475569;\n}\n.dark-mode .viewer-title {\n  color: #94a3b8;\n}\n.viewer-title mat-icon {\n  font-size: 18px;\n  width: 18px;\n  height: 18px;\n}\n.zoom-controls {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n}\n.zoom-btn {\n  width: 30px !important;\n  height: 30px !important;\n  background: white !important;\n  border: 1px solid #e2e8f0 !important;\n  border-radius: 8px !important;\n}\n.dark-mode .zoom-btn {\n  background: #334155 !important;\n  border-color: #475569 !important;\n}\n.zoom-btn mat-icon {\n  font-size: 18px !important;\n  width: 18px !important;\n  height: 18px !important;\n  color: #64748b;\n}\n.dark-mode .zoom-btn mat-icon {\n  color: #94a3b8;\n}\n.zoom-level {\n  font-size: 12px;\n  font-weight: 600;\n  color: #64748b;\n  min-width: 40px;\n  text-align: center;\n}\n.dark-mode .zoom-level {\n  color: #94a3b8;\n}\n.zoom-divider {\n  width: 1px;\n  height: 24px;\n  background: #e2e8f0;\n  margin: 0 6px;\n}\n.dark-mode .zoom-divider {\n  background: #475569;\n}\n.delete-btn {\n  width: 30px !important;\n  height: 30px !important;\n  background: #fef2f2 !important;\n  border: 1px solid #fecaca !important;\n  border-radius: 8px !important;\n}\n.dark-mode .delete-btn {\n  background: rgba(239, 68, 68, 0.15) !important;\n  border-color: #ef4444 !important;\n}\n.delete-btn mat-icon {\n  font-size: 18px !important;\n  width: 18px !important;\n  height: 18px !important;\n  color: #ef4444;\n}\n.viewer-body {\n  flex: 1;\n  min-height: 380px;\n  position: relative;\n  background: #f1f5f9;\n}\n.dark-mode .viewer-body {\n  background: #0f172a;\n}\n.upload-area {\n  position: absolute;\n  inset: 16px;\n  border: 2px dashed #cbd5e1;\n  border-radius: 14px;\n  cursor: pointer;\n  transition: all 0.2s;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background: white;\n}\n.dark-mode .upload-area {\n  border-color: #475569;\n  background: #1e293b;\n}\n.upload-area:hover {\n  border-color: #22c55e;\n  background: #f0fdf4;\n}\n.dark-mode .upload-area:hover {\n  border-color: #22c55e;\n  background: rgba(34, 197, 94, 0.1);\n}\n.upload-content {\n  text-align: center;\n  padding: 24px;\n}\n.upload-icon {\n  width: 72px;\n  height: 72px;\n  margin: 0 auto 20px;\n  background:\n    linear-gradient(\n      135deg,\n      #dcfce7 0%,\n      #bbf7d0 100%);\n  border-radius: 18px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.dark-mode .upload-icon {\n  background:\n    linear-gradient(\n      135deg,\n      rgba(34, 197, 94, 0.2) 0%,\n      rgba(34, 197, 94, 0.3) 100%);\n}\n.upload-icon mat-icon {\n  font-size: 36px;\n  width: 36px;\n  height: 36px;\n  color: #22c55e;\n}\n.upload-title {\n  font-size: 16px;\n  font-weight: 600;\n  color: #1e293b;\n  margin: 0 0 6px;\n}\n.dark-mode .upload-title {\n  color: #f1f5f9;\n}\n.upload-subtitle {\n  font-size: 13px;\n  color: #64748b;\n  margin: 0 0 20px;\n}\n.dark-mode .upload-subtitle {\n  color: #94a3b8;\n}\n.upload-formats {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n}\n.format-badge {\n  padding: 5px 10px;\n  background: #f1f5f9;\n  border-radius: 6px;\n  font-size: 11px;\n  font-weight: 600;\n  color: #64748b;\n}\n.dark-mode .format-badge {\n  background: #334155;\n  color: #94a3b8;\n}\n.size-info {\n  font-size: 11px;\n  color: #94a3b8;\n}\n.image-container {\n  position: absolute;\n  inset: 0;\n  overflow: auto;\n  cursor: grab;\n  display: flex;\n}\n.image-container:active {\n  cursor: grabbing;\n}\n.image-container img {\n  max-width: none;\n  transition: transform 0.15s ease;\n  transform-origin: top left;\n}\n.loading-overlay {\n  position: absolute;\n  inset: 0;\n  background: rgba(0, 0, 0, 0.75);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  -webkit-backdrop-filter: blur(6px);\n  backdrop-filter: blur(6px);\n}\n.loading-content {\n  text-align: center;\n  color: white;\n}\n.loading-content mat-spinner {\n  margin: 0 auto 16px;\n}\n.loading-content p {\n  font-size: 16px;\n  font-weight: 600;\n  margin: 0 0 6px;\n}\n.loading-content span {\n  font-size: 13px;\n  opacity: 0.8;\n}\n.dialog-actions {\n  display: flex !important;\n  align-items: center;\n  justify-content: space-between;\n  padding: 18px 24px !important;\n  background: #f8fafc;\n  border-top: 1px solid #e2e8f0;\n}\n.dark-mode .dialog-actions {\n  background: #1e293b;\n  border-color: #334155;\n}\n.btn-cancel {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  padding: 10px 20px !important;\n  border-radius: 10px !important;\n  font-size: 14px !important;\n  font-weight: 500 !important;\n  color: #64748b !important;\n  border: 1px solid #e2e8f0 !important;\n  background: white !important;\n  transition: all 0.2s;\n}\n.dark-mode .btn-cancel {\n  color: #94a3b8 !important;\n  border-color: #475569 !important;\n  background: #0f172a !important;\n}\n.btn-cancel:hover {\n  background: #f1f5f9 !important;\n  border-color: #cbd5e1 !important;\n}\n.dark-mode .btn-cancel:hover {\n  background: #334155 !important;\n}\n.btn-cancel mat-icon {\n  font-size: 18px;\n  width: 18px;\n  height: 18px;\n}\n.action-buttons {\n  display: flex;\n  gap: 12px;\n}\n.btn-analyze,\n.btn-confirm {\n  display: flex !important;\n  align-items: center;\n  gap: 10px;\n  padding: 12px 24px !important;\n  border-radius: 12px !important;\n  font-size: 14px !important;\n  font-weight: 600 !important;\n  transition: all 0.2s;\n}\n.btn-analyze {\n  background:\n    linear-gradient(\n      135deg,\n      #059669 0%,\n      #10b981 100%) !important;\n  color: white !important;\n  box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);\n}\n.btn-analyze:hover:not(:disabled) {\n  box-shadow: 0 6px 16px rgba(5, 150, 105, 0.4);\n  transform: translateY(-2px);\n}\n.btn-analyze:disabled {\n  background: #cbd5e1 !important;\n  box-shadow: none;\n}\n.dark-mode .btn-analyze:disabled {\n  background: #475569 !important;\n}\n.btn-confirm.success {\n  background:\n    linear-gradient(\n      135deg,\n      #059669 0%,\n      #10b981 100%) !important;\n  color: white !important;\n  box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);\n}\n.btn-confirm.warning {\n  background:\n    linear-gradient(\n      135deg,\n      #d97706 0%,\n      #f59e0b 100%) !important;\n  color: white !important;\n  box-shadow: 0 4px 12px rgba(217, 119, 6, 0.3);\n}\n.btn-confirm:hover {\n  transform: translateY(-2px);\n}\n.btn-analyze mat-icon,\n.btn-confirm mat-icon {\n  font-size: 20px;\n  width: 20px;\n  height: 20px;\n}\n.hidden {\n  display: none;\n}\n/*# sourceMappingURL=voucher-payment-dialog.component.css.map */\n'] }]
  }], () => [{ type: MatDialogRef }, { type: void 0, decorators: [{
    type: Inject,
    args: [MAT_DIALOG_DATA]
  }] }, { type: ComprobanteService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(VoucherPaymentDialogComponent, { className: "VoucherPaymentDialogComponent", filePath: "src/app/collection-management/components/voucher-payment-dialog/voucher-payment-dialog.component.ts", lineNumber: 741 });
})();

// src/app/features/dialer/call-notes/confirm-carta-dialog/confirm-carta-dialog.component.ts
var _ConfirmCartaDialogComponent = class _ConfirmCartaDialogComponent {
  constructor(dialogRef, data) {
    this.dialogRef = dialogRef;
    this.data = data;
  }
  onNoClick() {
    this.dialogRef.close("cancel");
  }
  onGenerateClick() {
    this.dialogRef.close("generate");
  }
};
_ConfirmCartaDialogComponent.\u0275fac = function ConfirmCartaDialogComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _ConfirmCartaDialogComponent)(\u0275\u0275directiveInject(MatDialogRef), \u0275\u0275directiveInject(MAT_DIALOG_DATA));
};
_ConfirmCartaDialogComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ConfirmCartaDialogComponent, selectors: [["app-confirm-carta-dialog"]], decls: 27, vars: 0, consts: [[1, "dialog-container"], [1, "dialog-header"], [1, "success-badge"], [1, "subtitle"], [1, "card-preview"], [1, "card-icon"], [1, "card-info"], [1, "card-title"], [1, "card-desc"], [1, "question"], ["mat-stroked-button", "", 1, "btn-secondary", 3, "click"], ["mat-flat-button", "", "color", "primary", 1, "btn-primary", 3, "click"]], template: function ConfirmCartaDialogComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "mat-icon");
    \u0275\u0275text(4, "check");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "h2");
    \u0275\u0275text(6, "Promesa Registrada");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p", 3);
    \u0275\u0275text(8, "La promesa de pago se ha guardado correctamente");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "mat-dialog-content")(10, "div", 4)(11, "mat-icon", 5);
    \u0275\u0275text(12, "description");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "div", 6)(14, "span", 7);
    \u0275\u0275text(15, "Carta de Acuerdo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "span", 8);
    \u0275\u0275text(17, "Documento PDF con los t\xE9rminos del acuerdo");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(18, "p", 9);
    \u0275\u0275text(19, "\xBFDesea generar la Carta de Acuerdo ahora?");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(20, "mat-dialog-actions")(21, "button", 10);
    \u0275\u0275listener("click", function ConfirmCartaDialogComponent_Template_button_click_21_listener() {
      return ctx.onNoClick();
    });
    \u0275\u0275text(22, " M\xE1s tarde ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "button", 11);
    \u0275\u0275listener("click", function ConfirmCartaDialogComponent_Template_button_click_23_listener() {
      return ctx.onGenerateClick();
    });
    \u0275\u0275elementStart(24, "mat-icon");
    \u0275\u0275text(25, "download");
    \u0275\u0275elementEnd();
    \u0275\u0275text(26, " Generar y Descargar ");
    \u0275\u0275elementEnd()()();
  }
}, dependencies: [
  CommonModule,
  MatDialogModule,
  MatDialogActions,
  MatDialogContent,
  MatButtonModule,
  MatButton,
  MatIconModule,
  MatIcon
], styles: ['\n\n.dialog-container[_ngcontent-%COMP%] {\n  padding: 8px;\n}\n.dialog-header[_ngcontent-%COMP%] {\n  text-align: center;\n  margin-bottom: 24px;\n}\n.success-badge[_ngcontent-%COMP%] {\n  width: 56px;\n  height: 56px;\n  border-radius: 50%;\n  background:\n    linear-gradient(\n      135deg,\n      #4caf50,\n      #66bb6a);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  margin: 0 auto 16px;\n  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);\n}\n.success-badge[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  color: white;\n  font-size: 32px;\n  width: 32px;\n  height: 32px;\n}\nh2[_ngcontent-%COMP%] {\n  margin: 0 0 8px 0;\n  font-size: 1.25rem;\n  font-weight: 600;\n  color: var(--mat-dialog-headline-color, inherit);\n}\n.subtitle[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 0.875rem;\n  opacity: 0.7;\n}\nmat-dialog-content[_ngcontent-%COMP%] {\n  padding: 0 8px;\n}\n.card-preview[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 16px;\n  padding: 16px;\n  border-radius: 12px;\n  background: var(--mat-sidenav-content-background-color, rgba(0,0,0,0.04));\n  margin-bottom: 20px;\n}\n.dark-theme[_nghost-%COMP%]   .card-preview[_ngcontent-%COMP%], .dark-theme   [_nghost-%COMP%]   .card-preview[_ngcontent-%COMP%], \n[class*="dark"][_nghost-%COMP%]   .card-preview[_ngcontent-%COMP%], [class*="dark"]   [_nghost-%COMP%]   .card-preview[_ngcontent-%COMP%] {\n  background: rgba(255, 255, 255, 0.05);\n}\n.card-icon[_ngcontent-%COMP%] {\n  font-size: 40px;\n  width: 40px;\n  height: 40px;\n  color: #1976d2;\n}\n.dark-theme[_nghost-%COMP%]   .card-icon[_ngcontent-%COMP%], .dark-theme   [_nghost-%COMP%]   .card-icon[_ngcontent-%COMP%], \n[class*="dark"][_nghost-%COMP%]   .card-icon[_ngcontent-%COMP%], [class*="dark"]   [_nghost-%COMP%]   .card-icon[_ngcontent-%COMP%] {\n  color: #64b5f6;\n}\n.card-info[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n}\n.card-title[_ngcontent-%COMP%] {\n  font-weight: 600;\n  font-size: 0.95rem;\n}\n.card-desc[_ngcontent-%COMP%] {\n  font-size: 0.8rem;\n  opacity: 0.6;\n}\n.question[_ngcontent-%COMP%] {\n  text-align: center;\n  font-weight: 500;\n  margin: 0;\n  font-size: 0.9rem;\n}\nmat-dialog-actions[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 12px;\n  padding: 16px 8px 8px;\n  justify-content: flex-end;\n}\n.btn-secondary[_ngcontent-%COMP%] {\n  flex: 1;\n}\n.btn-primary[_ngcontent-%COMP%] {\n  flex: 1;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n}\n.btn-primary[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 20px;\n  width: 20px;\n  height: 20px;\n}\n/*# sourceMappingURL=confirm-carta-dialog.component.css.map */'] });
var ConfirmCartaDialogComponent = _ConfirmCartaDialogComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ConfirmCartaDialogComponent, [{
    type: Component,
    args: [{ selector: "app-confirm-carta-dialog", standalone: true, imports: [
      CommonModule,
      MatDialogModule,
      MatButtonModule,
      MatIconModule
    ], template: `
    <div class="dialog-container">
      <div class="dialog-header">
        <div class="success-badge">
          <mat-icon>check</mat-icon>
        </div>
        <h2>Promesa Registrada</h2>
        <p class="subtitle">La promesa de pago se ha guardado correctamente</p>
      </div>

      <mat-dialog-content>
        <div class="card-preview">
          <mat-icon class="card-icon">description</mat-icon>
          <div class="card-info">
            <span class="card-title">Carta de Acuerdo</span>
            <span class="card-desc">Documento PDF con los t\xE9rminos del acuerdo</span>
          </div>
        </div>
        <p class="question">\xBFDesea generar la Carta de Acuerdo ahora?</p>
      </mat-dialog-content>

      <mat-dialog-actions>
        <button mat-stroked-button (click)="onNoClick()" class="btn-secondary">
          M\xE1s tarde
        </button>
        <button mat-flat-button color="primary" (click)="onGenerateClick()" class="btn-primary">
          <mat-icon>download</mat-icon>
          Generar y Descargar
        </button>
      </mat-dialog-actions>
    </div>
  `, styles: ['/* angular:styles/component:css;58d81cc6a78f8f5d166caada229e78604af364f27a687b54a9476687cba53962;C:/Users/HP/Documents/Kubito-2.0-v1/cashi-discador-frontend/cashi-discador-frontend/src/app/features/dialer/call-notes/confirm-carta-dialog/confirm-carta-dialog.component.ts */\n.dialog-container {\n  padding: 8px;\n}\n.dialog-header {\n  text-align: center;\n  margin-bottom: 24px;\n}\n.success-badge {\n  width: 56px;\n  height: 56px;\n  border-radius: 50%;\n  background:\n    linear-gradient(\n      135deg,\n      #4caf50,\n      #66bb6a);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  margin: 0 auto 16px;\n  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);\n}\n.success-badge mat-icon {\n  color: white;\n  font-size: 32px;\n  width: 32px;\n  height: 32px;\n}\nh2 {\n  margin: 0 0 8px 0;\n  font-size: 1.25rem;\n  font-weight: 600;\n  color: var(--mat-dialog-headline-color, inherit);\n}\n.subtitle {\n  margin: 0;\n  font-size: 0.875rem;\n  opacity: 0.7;\n}\nmat-dialog-content {\n  padding: 0 8px;\n}\n.card-preview {\n  display: flex;\n  align-items: center;\n  gap: 16px;\n  padding: 16px;\n  border-radius: 12px;\n  background: var(--mat-sidenav-content-background-color, rgba(0,0,0,0.04));\n  margin-bottom: 20px;\n}\n:host-context(.dark-theme) .card-preview,\n:host-context([class*="dark"]) .card-preview {\n  background: rgba(255, 255, 255, 0.05);\n}\n.card-icon {\n  font-size: 40px;\n  width: 40px;\n  height: 40px;\n  color: #1976d2;\n}\n:host-context(.dark-theme) .card-icon,\n:host-context([class*="dark"]) .card-icon {\n  color: #64b5f6;\n}\n.card-info {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n}\n.card-title {\n  font-weight: 600;\n  font-size: 0.95rem;\n}\n.card-desc {\n  font-size: 0.8rem;\n  opacity: 0.6;\n}\n.question {\n  text-align: center;\n  font-weight: 500;\n  margin: 0;\n  font-size: 0.9rem;\n}\nmat-dialog-actions {\n  display: flex;\n  gap: 12px;\n  padding: 16px 8px 8px;\n  justify-content: flex-end;\n}\n.btn-secondary {\n  flex: 1;\n}\n.btn-primary {\n  flex: 1;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n}\n.btn-primary mat-icon {\n  font-size: 20px;\n  width: 20px;\n  height: 20px;\n}\n/*# sourceMappingURL=confirm-carta-dialog.component.css.map */\n'] }]
  }], () => [{ type: MatDialogRef }, { type: void 0, decorators: [{
    type: Inject,
    args: [MAT_DIALOG_DATA]
  }] }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ConfirmCartaDialogComponent, { className: "ConfirmCartaDialogComponent", filePath: "src/app/features/dialer/call-notes/confirm-carta-dialog/confirm-carta-dialog.component.ts", lineNumber: 174 });
})();

// src/app/collection-management/services/system-config.service.ts
var _SystemConfigService = class _SystemConfigService {
  constructor(apiService) {
    this.apiService = apiService;
    this.systemConfig = {
      campana: {
        id: "CAMP-001",
        nombre: "Cartera Vencida Q3 2025",
        tipo: "Cobranza Temprana"
      },
      tipificaciones: {
        contacto: [
          { id: "CPC", codigo: "CPC", label: "Contacto con Cliente" },
          { id: "CTT", codigo: "CTT", label: "Contacto con Tercero" },
          { id: "NCL", codigo: "NCL", label: "No Contesta" },
          { id: "BZN", codigo: "BZN", label: "Buz\xF3n de Voz" },
          { id: "OCP", codigo: "OCP", label: "Ocupado" },
          { id: "FTN", codigo: "FTN", label: "Fuera de Tono" },
          { id: "NEQ", codigo: "NEQ", label: "N\xFAmero Equivocado" },
          { id: "TEL", codigo: "TEL", label: "Tel\xE9fono Inv\xE1lido" },
          { id: "CLG", codigo: "CLG", label: "Cliente Colg\xF3" },
          { id: "RCH", codigo: "RCH", label: "Rechaz\xF3 Llamada" }
        ],
        gestion: [
          { id: "ACP", codigo: "ACP", label: "Acepta Compromiso de Pago", requiere_pago: true, requiere_fecha: true },
          { id: "PGR", codigo: "PGR", label: "Pago Realizado - Completo", requiere_pago: true },
          { id: "PGP", codigo: "PGP", label: "Pago Parcial Realizado", requiere_pago: true },
          { id: "PGT", codigo: "PGT", label: "Pago Total de Deuda", requiere_pago: true },
          { id: "PPR", codigo: "PPR", label: "Pago Programado", requiere_pago: true, requiere_fecha: true },
          { id: "SRP", codigo: "SRP", label: "Solicita Refinanciamiento", requiere_seguimiento: true },
          { id: "SQA", codigo: "SQA", label: "Solicita Quita o Descuento", requiere_seguimiento: true },
          { id: "SCN", codigo: "SCN", label: "Solicita Congelamiento", requiere_seguimiento: true },
          { id: "SPL", codigo: "SPL", label: "Solicita Ampliaci\xF3n de Plazo", requiere_seguimiento: true },
          { id: "DPD", codigo: "DPD", label: "Disputa de Deuda", requiere_seguimiento: true },
          { id: "NRD", codigo: "NRD", label: "No Reconoce Deuda", requiere_seguimiento: true },
          { id: "DIF", codigo: "DIF", label: "Dificultad Financiera Temporal", requiere_seguimiento: true },
          { id: "DSE", codigo: "DSE", label: "Desempleo", requiere_seguimiento: true },
          { id: "ENF", codigo: "ENF", label: "Enfermedad/Incapacidad", requiere_seguimiento: true },
          { id: "FLC", codigo: "FLC", label: "Fallecimiento del Titular", requiere_seguimiento: true },
          { id: "RCL", codigo: "RCL", label: "Reclamo Registrado", requiere_seguimiento: true },
          { id: "FRD", codigo: "FRD", label: "Reporte de Fraude", requiere_seguimiento: true },
          { id: "NCB", codigo: "NCB", label: "Sin Capacidad de Pago", requiere_seguimiento: true },
          { id: "VJE", codigo: "VJE", label: "Viaje/Fuera del Pa\xEDs", requiere_fecha: true },
          { id: "SLL", codigo: "SLL", label: "Solicita Llamar Despu\xE9s", requiere_fecha: true },
          { id: "NIN", codigo: "NIN", label: "No est\xE1 Interesado" },
          { id: "AGR", codigo: "AGR", label: "Cliente Agresivo/Hostil" },
          { id: "NBL", codigo: "NBL", label: "No Desea Ser Contactado" },
          { id: "LGL", codigo: "LGL", label: "Amenaza Legal" },
          // TIPIFICACIONES PARA CONVENIOS Y CRONOGRAMAS
          { id: "CNV", codigo: "CNV", label: "Acepta Convenio de Pago", requiere_cronograma: true, requiere_fecha: true },
          { id: "CRO", codigo: "CRO", label: "Solicita Cronograma de Pagos", requiere_cronograma: true, requiere_cuotas: true },
          { id: "CPP", codigo: "CPP", label: "Convenio con Pago Parcial Inicial", requiere_cronograma: true, requiere_monto_inicial: true },
          { id: "CTT", codigo: "CTT", label: "Convenio a Plazo Total", requiere_cronograma: true, requiere_periodicidad: true },
          { id: "CCG", codigo: "CCG", label: "Convenio con Congelamiento", requiere_cronograma: true, requiere_fecha: true },
          { id: "CRF", codigo: "CRF", label: "Convenio con Refinanciamiento", requiere_cronograma: true, requiere_seguimiento: true },
          { id: "CQT", codigo: "CQT", label: "Convenio con Quita/Descuento", requiere_cronograma: true, requiere_pago: true },
          { id: "CAP", codigo: "CAP", label: "Convenio Aprobado por Supervisor", requiere_cronograma: true, requiere_autorizacion: true },
          { id: "CRC", codigo: "CRC", label: "Cliente Rechaza Convenio Propuesto", requiere_seguimiento: true },
          { id: "CEV", codigo: "CEV", label: "Convenio en Evaluaci\xF3n", requiere_seguimiento: true, requiere_fecha: true }
        ],
        motivo_no_pago: [
          { id: "FRE", label: "Falta de Recursos Econ\xF3micos" },
          { id: "DSP", label: "Desempleo Reciente" },
          { id: "RDS", label: "Reducci\xF3n de Salario" },
          { id: "EMR", label: "Emergencia M\xE9dica" },
          { id: "GSF", label: "Gastos Familiares Imprevistos" },
          { id: "OGS", label: "Otros Gastos Prioritarios" },
          { id: "NGC", label: "Negocio/Comercio en Crisis" },
          { id: "DCP", label: "Desconoce el Cargo/Producto" },
          { id: "IFC", label: "Inconformidad con Servicio" },
          { id: "FCC", label: "Fraude o Cargo no Reconocido" },
          { id: "OLV", label: "Olvido de Fecha de Pago" },
          { id: "PRG", label: "Problemas con M\xE9todo de Pago" },
          { id: "BNK", label: "Problemas Bancarios" },
          { id: "OTR", label: "Otro Motivo" }
        ]
      },
      metodos_pago: [
        { id: "TDC", codigo: "TDC", label: "Tarjeta de Cr\xE9dito", icono: "\u{1F4B3}", requiere_ultimos4: true },
        { id: "TDD", codigo: "TDD", label: "Tarjeta de D\xE9bito", icono: "\u{1F4B3}", requiere_ultimos4: true },
        { id: "TRF", codigo: "TRF", label: "Transferencia Bancaria", icono: "\u{1F3E6}", requiere_banco: true },
        { id: "DEP", codigo: "DEP", label: "Dep\xF3sito en Cuenta", icono: "\u{1F3E6}", requiere_banco: true },
        { id: "EFE", codigo: "EFE", label: "Efectivo en Agencia", icono: "\u{1F4B5}", requiere_agencia: true },
        { id: "CAU", codigo: "CAU", label: "Cargo Autom\xE1tico", icono: "\u{1F504}", requiere_autorizacion: true },
        { id: "YPE", codigo: "YPE", label: "Yape", icono: "\u{1F4F1}", requiere_telefono: true },
        { id: "PLN", codigo: "PLN", label: "Plin", icono: "\u{1F4F1}", requiere_telefono: true },
        { id: "TNK", codigo: "TNK", label: "Tunki", icono: "\u{1F4F1}", requiere_telefono: true },
        { id: "PGW", codigo: "PGW", label: "Pasarela Web/Link de Pago", icono: "\u{1F310}", requiere_email: true }
      ],
      bancos: [
        "BCP - Banco de Cr\xE9dito del Per\xFA",
        "BBVA",
        "Interbank",
        "Scotiabank",
        "BanBif",
        "Banco Pichincha",
        "Banco Falabella",
        "Banco Ripley",
        "Banco Azteca",
        "Otros"
      ],
      cronograma_config: {
        periodicidades: [
          { id: "SEM", label: "Semanal", dias: 7 },
          { id: "QUI", label: "Quincenal", dias: 15 },
          { id: "MEN", label: "Mensual", dias: 30 },
          { id: "BIM", label: "Bimestral", dias: 60 },
          { id: "TRI", label: "Trimestral", dias: 90 }
        ],
        tipos_cronograma: [
          { id: "FIJ", label: "Cuotas Fijas", descripcion: "Mismo monto cada cuota" },
          { id: "DEC", label: "Decreciente", descripcion: "Cuotas van disminuyendo" },
          { id: "ESC", label: "Escalonado", descripcion: "Cuotas aumentan gradualmente" },
          { id: "PER", label: "Personalizado", descripcion: "Montos espec\xEDficos por cuota" }
        ],
        campos_requeridos: {
          requiere_cronograma: ["numero_cuotas", "periodicidad", "fecha_primera_cuota"],
          requiere_cuotas: ["numero_cuotas", "monto_cuota"],
          requiere_monto_inicial: ["monto_inicial", "fecha_pago_inicial"],
          requiere_periodicidad: ["periodicidad", "dia_pago"],
          requiere_autorizacion: ["supervisor_id", "codigo_autorizacion"]
        },
        validaciones: {
          numero_cuotas_max: 48,
          numero_cuotas_min: 2,
          monto_minimo_cuota: 50,
          porcentaje_quita_max: 30,
          dias_gracia_max: 90
        }
      }
    };
  }
  getSystemConfig() {
    return this.systemConfig;
  }
  getCampaign() {
    const activeCampaign = this.apiService.getActiveCampaign();
    return activeCampaign || this.systemConfig.campana;
  }
  getContactClassifications() {
    const tenantData = this.apiService.tenantClassifications();
    if (tenantData.length > 0) {
      const contactClassifications = tenantData.filter((c) => c.typification.tipoClasificacion === "CONTACT_RESULT" && c.isEnabled).map((c) => ({
        id: c.typification.id,
        // Usar ID numérico para comparaciones
        codigo: c.typification.codigo,
        label: c.customName || c.typification.nombre
      }));
      if (contactClassifications.length > 0) {
        return contactClassifications;
      }
    }
    const apiData = this.apiService.getContactClassificationsForUI();
    return apiData.length > 0 ? apiData : this.systemConfig.tipificaciones.contacto;
  }
  getManagementClassifications() {
    const tenantData = this.apiService.tenantClassifications();
    if (tenantData.length > 0) {
      const managementClassifications = tenantData.filter((c) => c.isEnabled).map((c) => {
        const metadata = c.typification.metadataSchema ? JSON.parse(c.typification.metadataSchema) : {};
        return {
          id: String(c.typification.id),
          // Convertir a string para el tipo ManagementClassification
          codigo: c.typification.codigo,
          label: c.customName || c.typification.nombre,
          requiere_pago: metadata.requiresPayment || false,
          requiere_cronograma: metadata.requiresSchedule || false,
          requiere_seguimiento: metadata.requiresFollowUp || false,
          parentId: c.typification.parentTypificationId,
          hierarchyLevel: c.typification.nivelJerarquia,
          // Campos del tipo de clasificación
          suggestsFullAmount: c.typification.suggestsFullAmount,
          allowsInstallmentSelection: c.typification.allowsInstallmentSelection,
          requiresManualAmount: c.typification.requiresManualAmount
        };
      });
      if (managementClassifications.length > 0) {
        return managementClassifications;
      }
    }
    const apiData = this.apiService.getManagementClassificationsForUI();
    return apiData.length > 0 ? apiData : this.systemConfig.tipificaciones.gestion;
  }
  getPaymentNoReasons() {
    return this.systemConfig.tipificaciones.motivo_no_pago;
  }
  getPaymentMethods() {
    return this.systemConfig.metodos_pago;
  }
  getBanks() {
    return this.systemConfig.bancos;
  }
  getScheduleConfig() {
    return this.systemConfig.cronograma_config;
  }
  getManagementClassificationById(id) {
    const managementClassifications = this.getManagementClassifications();
    const found = managementClassifications.find((g) => g.id == id);
    return found;
  }
};
_SystemConfigService.\u0275fac = function SystemConfigService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _SystemConfigService)(\u0275\u0275inject(ApiSystemConfigService));
};
_SystemConfigService.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _SystemConfigService, factory: _SystemConfigService.\u0275fac, providedIn: "root" });
var SystemConfigService = _SystemConfigService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SystemConfigService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{ type: ApiSystemConfigService }], null);
})();

// src/app/maintenance/services/customer-output-config.service.ts
var _CustomerOutputConfigService = class _CustomerOutputConfigService {
  constructor() {
    this.http = inject(HttpClient);
    this.apiUrl = `${environment.tipificacionUrl}/customer-outputs`;
  }
  /**
   * Guarda o actualiza configuración de outputs
   *
   * BACKEND:
   * POST /api/v1/customer-outputs/config
   * Controller: CustomerOutputConfigController.saveConfiguration()
   *
   * LÓGICA:
   * - Si existe config para tenant+portfolio → actualiza
   * - Si no existe → crea nueva
   */
  saveConfiguration(request) {
    return this.http.post(`${this.apiUrl}/config`, request);
  }
  /**
   * Obtiene configuración de outputs para tenant y portfolio
   *
   * BACKEND:
   * GET /api/v1/customer-outputs/config?tenantId=X&portfolioId=Y
   * Controller: CustomerOutputConfigController.getConfiguration()
   *
   * LÓGICA DE BÚSQUEDA:
   * 1. Si portfolioId != null → busca configuración específica del portfolio
   * 2. Si no encuentra específica → busca configuración general del tenant
   * 3. Si no encuentra ninguna → 404 (usar valores por defecto en frontend)
   */
  getConfiguration(tenantId, portfolioId) {
    const params = { tenantId };
    if (portfolioId !== void 0 && portfolioId !== null) {
      params.portfolioId = portfolioId;
    }
    return this.http.get(`${this.apiUrl}/config`, { params });
  }
};
_CustomerOutputConfigService.\u0275fac = function CustomerOutputConfigService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _CustomerOutputConfigService)();
};
_CustomerOutputConfigService.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _CustomerOutputConfigService, factory: _CustomerOutputConfigService.\u0275fac, providedIn: "root" });
var CustomerOutputConfigService = _CustomerOutputConfigService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CustomerOutputConfigService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/customers/services/customer.service.ts
var _CustomerService = class _CustomerService {
  constructor(http) {
    this.http = http;
    this.apiUrl = `${environment.apiUrl}/customers`;
  }
  getAllCustomers() {
    return this.http.get(this.apiUrl);
  }
  getCustomerById(id) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
  getCustomerByDocument(documentNumber) {
    return this.http.get(`${this.apiUrl}/document/${documentNumber}`);
  }
  searchCustomers(searchTerm) {
    return this.http.get(`${this.apiUrl}/search`, {
      params: { q: searchTerm }
    });
  }
  filterCustomers(filters) {
    return this.http.get(`${this.apiUrl}/filter`, {
      params: __spreadValues({}, filters)
    });
  }
  createCustomer(customer) {
    return this.http.post(this.apiUrl, customer);
  }
  updateCustomer(id, customer) {
    return this.http.put(`${this.apiUrl}/${id}`, customer);
  }
  deleteCustomer(id) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  getCustomerDetail(document2, subPortfolioId) {
    return this.http.get(`${this.apiUrl}/detail/${document2}`, {
      params: { subPortfolioId: subPortfolioId.toString() }
    });
  }
  searchCustomerByCriteria(tenantId, searchBy, value) {
    return this.http.get(`${this.apiUrl}/search-by`, {
      params: {
        tenantId: tenantId.toString(),
        searchBy,
        value
      }
    });
  }
  searchCustomersByCriteria(tenantId, searchBy, value) {
    return this.http.get(`${this.apiUrl}/search-by-multi`, {
      params: {
        tenantId: tenantId.toString(),
        searchBy,
        value
      }
    });
  }
  searchCustomersAcrossAllTenants(searchBy, value) {
    return this.http.get(`${this.apiUrl}/search-all-tenants`, {
      params: {
        searchBy,
        value
      }
    });
  }
  getRecentCustomers() {
    return this.http.get(`${this.apiUrl}/recent`);
  }
  registerCustomerAccess(customerId) {
    return this.http.post(`${this.apiUrl}/${customerId}/access`, {});
  }
  /**
   * Busca un cliente por documento exacto en la tabla dinámica
   * Retorna TODOS los campos de la tabla ini_* incluyendo montos financieros
   */
  findClientByDocumento(tenantId, portfolioId, subPortfolioId, documento) {
    return this.http.get(`${environment.apiUrl}/client-search/find`, {
      params: {
        tenantId: tenantId.toString(),
        portfolioId: portfolioId.toString(),
        subPortfolioId: subPortfolioId.toString(),
        documento
      }
    });
  }
};
_CustomerService.\u0275fac = function CustomerService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _CustomerService)(\u0275\u0275inject(HttpClient));
};
_CustomerService.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _CustomerService, factory: _CustomerService.\u0275fac, providedIn: "root" });
var CustomerService = _CustomerService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CustomerService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{ type: HttpClient }], null);
})();

// src/app/core/services/carta-acuerdo.service.ts
var _CartaAcuerdoService = class _CartaAcuerdoService {
  constructor(http) {
    this.http = http;
    this.apiUrl = `${environment.apiUrl}/cartas`;
  }
  /**
   * Verifica si un cliente tiene una promesa de pago pendiente
   */
  verificarPromesaPendiente(idCliente) {
    return this.http.get(`${this.apiUrl}/verificar-promesa/${idCliente}`);
  }
  /**
   * Genera la carta de acuerdo automáticamente desde una gestión
   * Retorna el PDF como Blob
   */
  generarCarta(idGestion, idAgente) {
    return this.http.post(`${this.apiUrl}/generar/${idGestion}?idAgente=${idAgente}`, null, {
      responseType: "blob",
      headers: new HttpHeaders({
        "Accept": "application/pdf"
      })
    });
  }
  /**
   * Obtiene el historial de cartas generadas para un cliente
   */
  obtenerHistorial(idCliente) {
    return this.http.get(`${this.apiUrl}/historial/${idCliente}`);
  }
  /**
   * Descarga el PDF generado
   */
  descargarPdf(blob, nombreArchivo) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = nombreArchivo;
    link.click();
    window.URL.revokeObjectURL(url);
  }
};
_CartaAcuerdoService.\u0275fac = function CartaAcuerdoService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _CartaAcuerdoService)(\u0275\u0275inject(HttpClient));
};
_CartaAcuerdoService.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _CartaAcuerdoService, factory: _CartaAcuerdoService.\u0275fac, providedIn: "root" });
var CartaAcuerdoService = _CartaAcuerdoService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CartaAcuerdoService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{ type: HttpClient }], null);
})();

// src/app/collection-management/pages/collection-management.page.ts
var _c02 = ["dynamicFieldRendererComponent"];
var _forTrack04 = ($index, $item) => $item.id;
var _forTrack1 = ($index, $item) => $item.numeroCuota;
var _forTrack2 = ($index, $item) => $item.field;
function CollectionManagementPage_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 2)(1, "div", 61)(2, "div")(3, "div", 62);
    \u0275\u0275text(4, "\xA1Gesti\xF3n Guardada!");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 63);
    \u0275\u0275text(6, "Los datos se registraron correctamente");
    \u0275\u0275elementEnd()()()();
  }
}
function CollectionManagementPage_For_24_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 65);
  }
}
function CollectionManagementPage_For_24_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 64);
    \u0275\u0275listener("click", function CollectionManagementPage_For_24_Template_button_click_0_listener() {
      const tab_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.activeTab.set(tab_r2.id));
    });
    \u0275\u0275text(1);
    \u0275\u0275conditionalCreate(2, CollectionManagementPage_For_24_Conditional_2_Template, 1, 0, "div", 65);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const tab_r2 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275classMap("flex-1 px-2 py-1.5 text-[11px] font-semibold transition-all relative " + (ctx_r2.activeTab() === tab_r2.id ? "text-blue-700 dark:text-blue-200 bg-blue-50 dark:bg-blue-950/50" : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", tab_r2.label, " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.activeTab() === tab_r2.id ? 2 : -1);
  }
}
function CollectionManagementPage_Conditional_27_For_2_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 76)(1, "div", 77);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 78);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const field_r4 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(field_r4.label);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r2.formatFieldValue(ctx_r2.getFieldValue(field_r4.field), field_r4.format), " ");
  }
}
function CollectionManagementPage_Conditional_27_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, CollectionManagementPage_Conditional_27_For_2_Conditional_0_Template, 5, 2, "div", 76);
  }
  if (rf & 2) {
    const field_r4 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275conditional(!ctx_r2.isContactField(field_r4.field) ? 0 : -1);
  }
}
function CollectionManagementPage_Conditional_27_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 66);
    \u0275\u0275text(1, " Sin campos configurados ");
    \u0275\u0275elementEnd();
  }
}
function CollectionManagementPage_Conditional_27_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 73);
    \u0275\u0275element(1, "lucide-angular", 79);
    \u0275\u0275elementStart(2, "div", 70)(3, "div", 80);
    \u0275\u0275text(4, "Alternativo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 81);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r2.customerData().contacto.telefono_alternativo);
  }
}
function CollectionManagementPage_Conditional_27_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 73);
    \u0275\u0275element(1, "lucide-angular", 82);
    \u0275\u0275elementStart(2, "div", 70)(3, "div", 80);
    \u0275\u0275text(4, "Trabajo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 81);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r2.customerData().contacto.telefono_trabajo);
  }
}
function CollectionManagementPage_Conditional_27_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 74);
    \u0275\u0275element(1, "lucide-angular", 83);
    \u0275\u0275elementStart(2, "div", 70)(3, "div", 84);
    \u0275\u0275text(4, "Email");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 85);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r2.customerData().contacto.email);
  }
}
function CollectionManagementPage_Conditional_27_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 75);
    \u0275\u0275element(1, "lucide-angular", 86);
    \u0275\u0275elementStart(2, "div", 70)(3, "div", 87);
    \u0275\u0275text(4, "Direcci\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 88);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r2.customerData().contacto.direccion);
  }
}
function CollectionManagementPage_Conditional_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 20);
    \u0275\u0275repeaterCreate(1, CollectionManagementPage_Conditional_27_For_2_Template, 1, 1, null, null, _forTrack04);
    \u0275\u0275conditionalCreate(3, CollectionManagementPage_Conditional_27_Conditional_3_Template, 2, 0, "div", 66);
    \u0275\u0275elementStart(4, "div", 67)(5, "div", 68);
    \u0275\u0275element(6, "lucide-angular", 69);
    \u0275\u0275elementStart(7, "div", 70)(8, "div", 71);
    \u0275\u0275text(9, "Principal");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "div", 72);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd()()();
    \u0275\u0275conditionalCreate(12, CollectionManagementPage_Conditional_27_Conditional_12_Template, 7, 2, "div", 73);
    \u0275\u0275conditionalCreate(13, CollectionManagementPage_Conditional_27_Conditional_13_Template, 7, 2, "div", 73);
    \u0275\u0275conditionalCreate(14, CollectionManagementPage_Conditional_27_Conditional_14_Template, 7, 2, "div", 74);
    \u0275\u0275conditionalCreate(15, CollectionManagementPage_Conditional_27_Conditional_15_Template, 7, 2, "div", 75);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r2.customerOutputFields());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r2.customerOutputFields().length === 0 ? 3 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275property("size", 14);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r2.customerData().contacto.telefono_principal);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.customerData().contacto.telefono_alternativo ? 12 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.customerData().contacto.telefono_trabajo ? 13 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.customerData().contacto.email ? 14 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.customerData().contacto.direccion ? 15 : -1);
  }
}
function CollectionManagementPage_Conditional_28_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 89)(1, "p", 90);
    \u0275\u0275text(2, "Sin gestiones previas");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "button", 91);
    \u0275\u0275listener("click", function CollectionManagementPage_Conditional_28_Conditional_1_Template_button_click_3_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.loadManagementHistory());
    });
    \u0275\u0275text(4, "Recargar");
    \u0275\u0275elementEnd()();
  }
}
function CollectionManagementPage_Conditional_28_Conditional_2_For_1_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 99);
    \u0275\u0275listener("click", function CollectionManagementPage_Conditional_28_Conditional_2_For_1_Conditional_10_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r6);
      const gestion_r7 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.openScheduleDetail(gestion_r7.id));
    });
    \u0275\u0275text(1, " Ver cronograma \u2192 ");
    \u0275\u0275elementEnd();
  }
}
function CollectionManagementPage_Conditional_28_Conditional_2_For_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 92)(1, "div", 93)(2, "span", 94);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 95);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 96);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "div", 97);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(10, CollectionManagementPage_Conditional_28_Conditional_2_For_1_Conditional_10_Template, 2, 0, "button", 98);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const gestion_r7 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(gestion_r7.fecha);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(gestion_r7.nombreAgente);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(gestion_r7.tipificacionCompleta);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(gestion_r7.observacion);
    \u0275\u0275advance();
    \u0275\u0275conditional(gestion_r7.schedule ? 10 : -1);
  }
}
function CollectionManagementPage_Conditional_28_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275repeaterCreate(0, CollectionManagementPage_Conditional_28_Conditional_2_For_1_Template, 11, 5, "div", 92, \u0275\u0275repeaterTrackByIndex);
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275repeater(ctx_r2.historialGestiones());
  }
}
function CollectionManagementPage_Conditional_28_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 21);
    \u0275\u0275conditionalCreate(1, CollectionManagementPage_Conditional_28_Conditional_1_Template, 5, 0, "div", 89)(2, CollectionManagementPage_Conditional_28_Conditional_2_Template, 2, 0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.historialGestiones().length === 0 ? 1 : 2);
  }
}
function CollectionManagementPage_Conditional_41_For_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 105);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const tip_r9 = ctx.$implicit;
    \u0275\u0275property("value", tip_r9.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("[", tip_r9.codigo, "] ", tip_r9.label);
  }
}
function CollectionManagementPage_Conditional_41_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 106);
    \u0275\u0275text(1, " Requerido ");
    \u0275\u0275elementEnd();
  }
}
function CollectionManagementPage_Conditional_41_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 28)(1, "label", 100);
    \u0275\u0275element(2, "div", 101);
    \u0275\u0275text(3, " Resultado de Contacto * ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 102)(5, "select", 103);
    \u0275\u0275twoWayListener("ngModelChange", function CollectionManagementPage_Conditional_41_Template_select_ngModelChange_5_listener($event) {
      \u0275\u0275restoreView(_r8);
      const ctx_r2 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r2.managementForm.resultadoContacto, $event) || (ctx_r2.managementForm.resultadoContacto = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function CollectionManagementPage_Conditional_41_Template_select_ngModelChange_5_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.onContactResultChange());
    });
    \u0275\u0275elementStart(6, "option", 104);
    \u0275\u0275text(7, "-- Seleccionar resultado --");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(8, CollectionManagementPage_Conditional_41_For_9_Template, 2, 3, "option", 105, _forTrack04);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(10, CollectionManagementPage_Conditional_41_Conditional_10_Template, 2, 0, "div", 106);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275classMap("w-full p-2 pr-8 border rounded-lg font-semibold text-gray-700 dark:text-white appearance-none cursor-pointer transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 hover:border-blue-400 dark:hover:border-blue-600 text-xs " + (ctx_r2.errors().resultadoContacto ? "border-red-500 bg-red-50 dark:bg-red-950/30 dark:border-red-600" : "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900") + " " + (ctx_r2.managementForm.resultadoContacto ? "bg-blue-50 dark:bg-blue-950/30 border-blue-400 dark:border-blue-600" : ""));
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.managementForm.resultadoContacto);
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r2.contactClassifications());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r2.errors().resultadoContacto ? 10 : -1);
  }
}
function CollectionManagementPage_Conditional_42_For_2_For_24_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 128);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "span", 111);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const cuota_r12 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("S/ ", cuota_r12.monto == null ? null : cuota_r12.monto.toFixed(2));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("S/ ", ctx_r2.getSaldoPendienteCuota(cuota_r12).toFixed(2));
  }
}
function CollectionManagementPage_Conditional_42_For_2_For_24_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 111);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const cuota_r12 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("S/ ", (cuota_r12.monto == null ? null : cuota_r12.monto.toFixed(2)) || "0.00");
  }
}
function CollectionManagementPage_Conditional_42_For_2_For_24_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 123);
    \u0275\u0275element(1, "lucide-angular", 129);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 10);
  }
}
function CollectionManagementPage_Conditional_42_For_2_For_24_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 124);
    \u0275\u0275text(1, "Parcial");
    \u0275\u0275elementEnd();
  }
}
function CollectionManagementPage_Conditional_42_For_2_For_24_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 125);
    \u0275\u0275element(1, "lucide-angular", 130);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 10);
  }
}
function CollectionManagementPage_Conditional_42_For_2_For_24_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 126);
    \u0275\u0275element(1, "lucide-angular", 131);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 10);
  }
}
function CollectionManagementPage_Conditional_42_For_2_For_24_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 127);
    \u0275\u0275element(1, "lucide-angular", 132);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 10);
  }
}
function CollectionManagementPage_Conditional_42_For_2_For_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 118)(1, "span", 62);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 120);
    \u0275\u0275text(4, "|");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(5, CollectionManagementPage_Conditional_42_For_2_For_24_Conditional_5_Template, 4, 2)(6, CollectionManagementPage_Conditional_42_For_2_For_24_Conditional_6_Template, 2, 1, "span", 111);
    \u0275\u0275elementStart(7, "span", 120);
    \u0275\u0275text(8, "|");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "span", 121);
    \u0275\u0275element(10, "lucide-angular", 122);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(12, CollectionManagementPage_Conditional_42_For_2_For_24_Conditional_12_Template, 2, 1, "span", 123)(13, CollectionManagementPage_Conditional_42_For_2_For_24_Conditional_13_Template, 2, 0, "span", 124)(14, CollectionManagementPage_Conditional_42_For_2_For_24_Conditional_14_Template, 2, 1, "span", 125)(15, CollectionManagementPage_Conditional_42_For_2_For_24_Conditional_15_Template, 2, 1, "span", 126)(16, CollectionManagementPage_Conditional_42_For_2_For_24_Conditional_16_Template, 2, 1, "span", 127);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const cuota_r12 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("C", cuota_r12.numeroCuota);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r2.tienePagoParcial(cuota_r12) ? 5 : 6);
    \u0275\u0275advance(5);
    \u0275\u0275property("size", 11);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r2.formatDate(cuota_r12.dueDate), " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(cuota_r12.status === "PAGADA" || cuota_r12.status === "PAGADO" || cuota_r12.status === "CUMPLIDO" ? 12 : cuota_r12.status === "PARCIAL" ? 13 : cuota_r12.status === "VENCIDA" || cuota_r12.status === "VENCIDO" ? 14 : cuota_r12.status === "CANCELADA" || cuota_r12.status === "CANCELADO" ? 15 : 16);
  }
}
function CollectionManagementPage_Conditional_42_For_2_Conditional_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 119)(1, "span", 133);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275text(3, " pendiente(s) \xB7 Pr\xF3x: ");
    \u0275\u0275elementStart(4, "span", 133);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const schedule_r11 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(schedule_r11.cuotasPendientes);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r2.formatDate(schedule_r11.nextDueDate));
  }
}
function CollectionManagementPage_Conditional_42_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 107)(1, "div", 108)(2, "div", 6)(3, "div", 109);
    \u0275\u0275element(4, "lucide-angular", 110);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div")(6, "div", 111);
    \u0275\u0275text(7, "PROMESA DE PAGO ACTIVA");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "div", 112);
    \u0275\u0275text(9, "No puede registrar otra promesa");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(10, "div", 6)(11, "button", 113);
    \u0275\u0275listener("click", function CollectionManagementPage_Conditional_42_For_2_Template_button_click_11_listener() {
      const schedule_r11 = \u0275\u0275restoreView(_r10).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.openVoucherPaymentDialog(schedule_r11));
    });
    \u0275\u0275element(12, "lucide-angular", 114);
    \u0275\u0275text(13, " Voucher ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "div", 11)(15, "div", 9);
    \u0275\u0275text(16);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "div", 112);
    \u0275\u0275text(18, "Total");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(19, "div", 115)(20, "div", 116);
    \u0275\u0275text(21, "DETALLE DE CUOTAS:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "div", 117);
    \u0275\u0275repeaterCreate(23, CollectionManagementPage_Conditional_42_For_2_For_24_Template, 17, 5, "div", 118, _forTrack1);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(25, CollectionManagementPage_Conditional_42_For_2_Conditional_25_Template, 6, 2, "div", 119);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const schedule_r11 = ctx.$implicit;
    \u0275\u0275advance(4);
    \u0275\u0275property("size", 14);
    \u0275\u0275advance(8);
    \u0275\u0275property("size", 12);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("S/ ", (schedule_r11.totalAmount == null ? null : schedule_r11.totalAmount.toFixed(2)) || "0.00");
    \u0275\u0275advance(7);
    \u0275\u0275repeater(schedule_r11.installments);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(schedule_r11.cuotasPendientes > 0 && schedule_r11.nextDueDate ? 25 : -1);
  }
}
function CollectionManagementPage_Conditional_42_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 29);
    \u0275\u0275repeaterCreate(1, CollectionManagementPage_Conditional_42_For_2_Template, 26, 4, "div", 107, _forTrack04);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r2.activePaymentSchedules());
  }
}
function CollectionManagementPage_Conditional_43_For_5_Conditional_0_For_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 105);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const option_r15 = ctx.$implicit;
    \u0275\u0275property("value", option_r15.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("[", option_r15.codigo, "] ", option_r15.label);
  }
}
function CollectionManagementPage_Conditional_43_For_5_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 137)(1, "label", 138);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "select", 103);
    \u0275\u0275listener("ngModelChange", function CollectionManagementPage_Conditional_43_For_5_Conditional_0_Template_select_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r13);
      const $index_r14 = \u0275\u0275nextContext().$index;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.onClassificationLevelChange($index_r14, $event));
    });
    \u0275\u0275elementStart(4, "option", 104);
    \u0275\u0275text(5, "Seleccionar...");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(6, CollectionManagementPage_Conditional_43_For_5_Conditional_0_For_7_Template, 2, 3, "option", 105, _forTrack04);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r15 = \u0275\u0275nextContext();
    const level_r17 = ctx_r15.$implicit;
    const $index_r14 = ctx_r15.$index;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2(" ", ctx_r2.getDynamicLevelLabel($index_r14), "", $index_r14 === 0 ? " *" : "", " ");
    \u0275\u0275advance();
    \u0275\u0275classMap("w-full p-1.5 border rounded text-[11px] font-medium transition-all focus:outline-none focus:ring-1 focus:ring-blue-400 " + (ctx_r2.errors().tipoGestion && $index_r14 === 0 ? "border-red-400 bg-red-50 dark:bg-red-950/30" : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-white") + " " + (ctx_r2.selectedClassifications()[$index_r14] ? "border-green-400 bg-green-50 dark:bg-green-950/30" : ""));
    \u0275\u0275property("ngModel", ctx_r2.selectedClassifications()[$index_r14]);
    \u0275\u0275advance(3);
    \u0275\u0275repeater(level_r17);
  }
}
function CollectionManagementPage_Conditional_43_For_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, CollectionManagementPage_Conditional_43_For_5_Conditional_0_Template, 8, 5, "div", 137);
  }
  if (rf & 2) {
    const $index_r14 = ctx.$index;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275conditional(ctx_r2.shouldShowLevel($index_r14) ? 0 : -1);
  }
}
function CollectionManagementPage_Conditional_43_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 136);
    \u0275\u0275text(1, "Seleccione una clasificaci\xF3n");
    \u0275\u0275elementEnd();
  }
}
function CollectionManagementPage_Conditional_43_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 30)(1, "div", 134);
    \u0275\u0275text(2, "Clasificaci\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 135);
    \u0275\u0275repeaterCreate(4, CollectionManagementPage_Conditional_43_For_5_Template, 1, 1, null, null, \u0275\u0275repeaterTrackByIndex);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(6, CollectionManagementPage_Conditional_43_Conditional_6_Template, 2, 0, "div", 136);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275repeater(ctx_r2.hierarchyLevels());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r2.errors().tipoGestion ? 6 : -1);
  }
}
function CollectionManagementPage_Conditional_44_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 31)(1, "div", 139)(2, "span", 140);
    \u0275\u0275text(3, "Cargando campos adicionales...");
    \u0275\u0275elementEnd()()();
  }
}
function CollectionManagementPage_Conditional_45_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 32)(1, "div", 141)(2, "span", 140);
    \u0275\u0275text(3, "Esta clasificaci\xF3n no tiene campos adicionales configurados");
    \u0275\u0275elementEnd()()();
  }
}
function CollectionManagementPage_Conditional_46_Template(rf, ctx) {
  if (rf & 1) {
    const _r18 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-dynamic-field-renderer", 142, 0);
    \u0275\u0275listener("dataChange", function CollectionManagementPage_Conditional_46_Template_app_dynamic_field_renderer_dataChange_0_listener($event) {
      \u0275\u0275restoreView(_r18);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.onDynamicFieldsChange($event));
    })("customAmountDetected", function CollectionManagementPage_Conditional_46_Template_app_dynamic_field_renderer_customAmountDetected_0_listener($event) {
      \u0275\u0275restoreView(_r18);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.onCustomAmountDetected($event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("schema", ctx_r2.dynamicFieldsSchema())("externalUpdates", ctx_r2.externalFieldUpdates())("selectedClassification", ctx_r2.selectedClassification())("customerAmounts", ctx_r2.customerPaymentAmounts());
  }
}
function CollectionManagementPage_Conditional_47_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 34)(1, "div", 143)(2, "span", 144);
    \u0275\u0275text(3, "Cargando cronogramas pendientes...");
    \u0275\u0275elementEnd()()();
  }
}
function CollectionManagementPage_Conditional_48_For_10_For_14_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 156)(1, "div", 6)(2, "span", 157);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 158);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "span", 159);
    \u0275\u0275text(7);
    \u0275\u0275pipe(8, "number");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const installment_r19 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("Cuota #", installment_r19.installmentNumber);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("Vence: ", ctx_r2.formatDate(installment_r19.dueDate));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("S/ ", \u0275\u0275pipeBind2(8, 3, installment_r19.amount, "1.2-2"));
  }
}
function CollectionManagementPage_Conditional_48_For_10_For_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, CollectionManagementPage_Conditional_48_For_10_For_14_Conditional_0_Template, 9, 6, "div", 156);
  }
  if (rf & 2) {
    const \u0275$index_426_r20 = ctx.$index;
    \u0275\u0275conditional(\u0275$index_426_r20 < 3 ? 0 : -1);
  }
}
function CollectionManagementPage_Conditional_48_For_10_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 151);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const schedule_r21 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" + ", ctx_r2.getPendingInstallments(schedule_r21).length - 3, " cuotas m\xE1s ");
  }
}
function CollectionManagementPage_Conditional_48_For_10_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    const _r22 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 160);
    \u0275\u0275listener("click", function CollectionManagementPage_Conditional_48_For_10_Conditional_17_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r22);
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.applyNextInstallmentPayment());
    });
    \u0275\u0275text(1, " Usar Pr\xF3xima Cuota ");
    \u0275\u0275elementEnd();
  }
}
function CollectionManagementPage_Conditional_48_For_10_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    const _r23 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 161);
    \u0275\u0275listener("click", function CollectionManagementPage_Conditional_48_For_10_Conditional_18_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r23);
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.applyFullSchedulePayment());
    });
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "number");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const schedule_r21 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" Pagar Todo (S/ ", \u0275\u0275pipeBind2(2, 1, ctx_r2.calculatePendingAmount(schedule_r21), "1.2-2"), ") ");
  }
}
function CollectionManagementPage_Conditional_48_For_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 148)(1, "div", 5)(2, "div", 6)(3, "div", 146);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 149);
    \u0275\u0275text(6, " ACTIVO ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 146);
    \u0275\u0275text(8);
    \u0275\u0275pipe(9, "number");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "div", 21)(11, "div", 150);
    \u0275\u0275text(12, "Cuotas Pendientes");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(13, CollectionManagementPage_Conditional_48_For_10_For_14_Template, 1, 1, null, null, _forTrack04);
    \u0275\u0275conditionalCreate(15, CollectionManagementPage_Conditional_48_For_10_Conditional_15_Template, 2, 1, "div", 151);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "div", 152);
    \u0275\u0275conditionalCreate(17, CollectionManagementPage_Conditional_48_For_10_Conditional_17_Template, 2, 0, "button", 153);
    \u0275\u0275conditionalCreate(18, CollectionManagementPage_Conditional_48_For_10_Conditional_18_Template, 3, 4, "button", 154);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "div", 155)(20, "span");
    \u0275\u0275text(21, "El pago se aplicar\xE1 autom\xE1ticamente a las cuotas pendientes en orden de vencimiento");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    let tmp_15_0;
    let tmp_16_0;
    const schedule_r21 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", schedule_r21.scheduleType || "CRONOGRAMA", " ");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" S/ ", \u0275\u0275pipeBind2(9, 5, schedule_r21.totalAmount, "1.2-2"), " ");
    \u0275\u0275advance(5);
    \u0275\u0275repeater(ctx_r2.getPendingInstallments(schedule_r21));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r2.getPendingInstallments(schedule_r21).length > 3 ? 15 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(((tmp_15_0 = ctx_r2.selectedClassification()) == null ? null : tmp_15_0.allowsInstallmentSelection) === true ? 17 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(((tmp_16_0 = ctx_r2.selectedClassification()) == null ? null : tmp_16_0.suggestsFullAmount) === true ? 18 : -1);
  }
}
function CollectionManagementPage_Conditional_48_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 35)(1, "div", 5)(2, "div", 6);
    \u0275\u0275element(3, "div", 145);
    \u0275\u0275elementStart(4, "div")(5, "h4", 146);
    \u0275\u0275text(6, "Cronograma Activo Detectado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p", 147);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275repeaterCreate(9, CollectionManagementPage_Conditional_48_For_10_Template, 22, 8, "div", 148, _forTrack04);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate1("Cliente tiene ", ctx_r2.activeSchedules().length, " cronograma(s) pendiente(s)");
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r2.activeSchedules());
  }
}
function CollectionManagementPage_Conditional_49_Conditional_9_For_2_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 176);
    \u0275\u0275text(1, "Parcial");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_13_0;
    const cuota_r25 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275classMap(((tmp_13_0 = ctx_r2.selectedInstallmentForCancellation()) == null ? null : tmp_13_0.numeroCuota) === cuota_r25.numeroCuota ? "bg-green-400 text-white" : "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300");
  }
}
function CollectionManagementPage_Conditional_49_Conditional_9_For_2_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 177);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "span", 175);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const cuota_r25 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("S/ ", cuota_r25.monto == null ? null : cuota_r25.monto.toFixed(2));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("S/ ", ctx_r2.getSaldoPendienteCuota(cuota_r25).toFixed(2));
  }
}
function CollectionManagementPage_Conditional_49_Conditional_9_For_2_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 175);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const cuota_r25 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("S/ ", (cuota_r25.monto == null ? null : cuota_r25.monto.toFixed(2)) || "0.00");
  }
}
function CollectionManagementPage_Conditional_49_Conditional_9_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r24 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "label", 170)(1, "div", 171)(2, "input", 172);
    \u0275\u0275listener("change", function CollectionManagementPage_Conditional_49_Conditional_9_For_2_Template_input_change_2_listener() {
      const cuota_r25 = \u0275\u0275restoreView(_r24).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.onSelectCuotaForCancellation(cuota_r25));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div")(4, "span", 111);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span", 173);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(8, CollectionManagementPage_Conditional_49_Conditional_9_For_2_Conditional_8_Template, 2, 2, "span", 174);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "div", 11);
    \u0275\u0275conditionalCreate(10, CollectionManagementPage_Conditional_49_Conditional_9_For_2_Conditional_10_Template, 4, 2)(11, CollectionManagementPage_Conditional_49_Conditional_9_For_2_Conditional_11_Template, 2, 1, "span", 175);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_12_0;
    let tmp_14_0;
    let tmp_16_0;
    const cuota_r25 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275classMap(((tmp_12_0 = ctx_r2.selectedInstallmentForCancellation()) == null ? null : tmp_12_0.numeroCuota) === cuota_r25.numeroCuota ? "bg-green-500 text-white shadow-md" : "bg-white dark:bg-gray-800 hover:bg-green-100 dark:hover:bg-green-900/30 border border-green-200 dark:border-green-700");
    \u0275\u0275advance(2);
    \u0275\u0275property("value", cuota_r25)("checked", ((tmp_14_0 = ctx_r2.selectedInstallmentForCancellation()) == null ? null : tmp_14_0.numeroCuota) === cuota_r25.numeroCuota);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("Cuota ", cuota_r25.numeroCuota);
    \u0275\u0275advance();
    \u0275\u0275classMap(((tmp_16_0 = ctx_r2.selectedInstallmentForCancellation()) == null ? null : tmp_16_0.numeroCuota) === cuota_r25.numeroCuota ? "text-green-100" : "text-gray-500 dark:text-gray-400");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" Vence: ", ctx_r2.formatDate(cuota_r25.dueDate), " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.tienePagoParcial(cuota_r25) ? 8 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r2.tienePagoParcial(cuota_r25) ? 10 : 11);
  }
}
function CollectionManagementPage_Conditional_49_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 49);
    \u0275\u0275repeaterCreate(1, CollectionManagementPage_Conditional_49_Conditional_9_For_2_Template, 12, 10, "label", 169, _forTrack1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r2.pendingInstallmentsForCancellation());
  }
}
function CollectionManagementPage_Conditional_49_Conditional_10_For_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 180)(1, "div", 171)(2, "span", 182);
    \u0275\u0275text(3, "\u2717");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div")(5, "span", 183);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "span", 184);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(9, "span", 185);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const cuota_r26 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1("Cuota ", cuota_r26.numeroCuota);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" Venci\xF3: ", ctx_r2.formatDate(cuota_r26.dueDate), " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("S/ ", (cuota_r26.monto == null ? null : cuota_r26.monto.toFixed(2)) || "0.00");
  }
}
function CollectionManagementPage_Conditional_49_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 165)(1, "div", 178)(2, "span", 52);
    \u0275\u0275text(3, "\u26D4");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 179);
    \u0275\u0275text(5, "CUOTAS VENCIDAS (No se pueden cancelar)");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 21);
    \u0275\u0275repeaterCreate(7, CollectionManagementPage_Conditional_49_Conditional_10_For_8_Template, 11, 3, "div", 180, _forTrack1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "div", 181);
    \u0275\u0275text(10, " La fecha de pago ya pas\xF3. Estas cuotas ser\xE1n marcadas como promesa rota. ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(7);
    \u0275\u0275repeater(ctx_r2.overdueInstallments());
  }
}
function CollectionManagementPage_Conditional_49_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 166)(1, "span");
    \u0275\u0275text(2, "\u{1F6AB}");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4, "No hay cuotas disponibles para cancelar. Todas las cuotas est\xE1n vencidas.");
    \u0275\u0275elementEnd()();
  }
}
function CollectionManagementPage_Conditional_49_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 167)(1, "span");
    \u0275\u0275text(2, "\u26A0\uFE0F");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4, "Debe seleccionar una cuota para registrar la cancelaci\xF3n");
    \u0275\u0275elementEnd()();
  }
}
function CollectionManagementPage_Conditional_49_Conditional_13_Conditional_22_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 196)(1, "span");
    \u0275\u0275text(2, "\u26A0\uFE0F");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span")(4, "strong");
    \u0275\u0275text(5, "Pago parcial:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_4_0;
    const ctx_r2 = \u0275\u0275nextContext(4);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1(" La cuota quedar\xE1 con saldo pendiente de S/ ", (((tmp_4_0 = ctx_r2.selectedInstallmentForCancellation()) == null ? null : tmp_4_0.monto) - ctx_r2.montoPagoEditable()).toFixed(2));
  }
}
function CollectionManagementPage_Conditional_49_Conditional_13_Conditional_22_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 196)(1, "span");
    \u0275\u0275text(2, "\u2139\uFE0F");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span")(4, "strong");
    \u0275\u0275text(5, "Pago mayor:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_4_0;
    const ctx_r2 = \u0275\u0275nextContext(4);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1(" El excedente de S/ ", (ctx_r2.montoPagoEditable() - ((tmp_4_0 = ctx_r2.selectedInstallmentForCancellation()) == null ? null : tmp_4_0.monto)).toFixed(2), " se aplicar\xE1 a las siguientes cuotas");
  }
}
function CollectionManagementPage_Conditional_49_Conditional_13_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 195);
    \u0275\u0275conditionalCreate(1, CollectionManagementPage_Conditional_49_Conditional_13_Conditional_22_Conditional_1_Template, 7, 1, "span", 196)(2, CollectionManagementPage_Conditional_49_Conditional_13_Conditional_22_Conditional_2_Template, 7, 1, "span", 196);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_3_0;
    let tmp_4_0;
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275classMap(ctx_r2.montoPagoEditable() < ((tmp_3_0 = ctx_r2.selectedInstallmentForCancellation()) == null ? null : tmp_3_0.monto) ? "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-700" : "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.montoPagoEditable() < ((tmp_4_0 = ctx_r2.selectedInstallmentForCancellation()) == null ? null : tmp_4_0.monto) ? 1 : 2);
  }
}
function CollectionManagementPage_Conditional_49_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r27 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 168)(1, "div", 178)(2, "span", 52);
    \u0275\u0275text(3, "\u270F\uFE0F");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 186);
    \u0275\u0275text(5, "Datos del Pago (editables)");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 187)(7, "div")(8, "label", 188);
    \u0275\u0275text(9, "Monto Pagado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "div", 102)(11, "span", 189);
    \u0275\u0275text(12, "S/");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "input", 190);
    \u0275\u0275listener("input", function CollectionManagementPage_Conditional_49_Conditional_13_Template_input_input_13_listener($event) {
      \u0275\u0275restoreView(_r27);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.onMontoPagoChange($event));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "p", 191);
    \u0275\u0275text(15);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "div")(17, "label", 188);
    \u0275\u0275text(18, "Fecha del Pago");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "input", 192);
    \u0275\u0275listener("input", function CollectionManagementPage_Conditional_49_Conditional_13_Template_input_input_19_listener($event) {
      \u0275\u0275restoreView(_r27);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.onFechaPagoChange($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "p", 193);
    \u0275\u0275text(21, " Por defecto: hoy ");
    \u0275\u0275elementEnd()()();
    \u0275\u0275conditionalCreate(22, CollectionManagementPage_Conditional_49_Conditional_13_Conditional_22_Template, 3, 3, "div", 194);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_3_0;
    let tmp_5_0;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(13);
    \u0275\u0275property("value", ctx_r2.montoPagoEditable());
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" Pendiente: S/ ", ctx_r2.tienePagoParcial(ctx_r2.selectedInstallmentForCancellation()) ? ctx_r2.getSaldoPendienteCuota(ctx_r2.selectedInstallmentForCancellation()).toFixed(2) : (tmp_3_0 = ctx_r2.selectedInstallmentForCancellation()) == null ? null : tmp_3_0.monto == null ? null : tmp_3_0.monto.toFixed(2), " ");
    \u0275\u0275advance(4);
    \u0275\u0275property("value", ctx_r2.fechaPagoEditable());
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r2.montoPagoEditable() !== ((tmp_5_0 = ctx_r2.selectedInstallmentForCancellation()) == null ? null : tmp_5_0.monto) ? 22 : -1);
  }
}
function CollectionManagementPage_Conditional_49_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 36)(1, "div", 6)(2, "span", 162);
    \u0275\u0275text(3, "\u{1F4B0}");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div")(5, "h4", 163);
    \u0275\u0275text(6, "Seleccionar Cuota a Cancelar");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p", 164);
    \u0275\u0275text(8, "Elija qu\xE9 cuota de la promesa de pago est\xE1 cancelando");
    \u0275\u0275elementEnd()()();
    \u0275\u0275conditionalCreate(9, CollectionManagementPage_Conditional_49_Conditional_9_Template, 3, 0, "div", 49);
    \u0275\u0275conditionalCreate(10, CollectionManagementPage_Conditional_49_Conditional_10_Template, 11, 0, "div", 165);
    \u0275\u0275conditionalCreate(11, CollectionManagementPage_Conditional_49_Conditional_11_Template, 5, 0, "div", 166)(12, CollectionManagementPage_Conditional_49_Conditional_12_Template, 5, 0, "div", 167);
    \u0275\u0275conditionalCreate(13, CollectionManagementPage_Conditional_49_Conditional_13_Template, 23, 4, "div", 168);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(9);
    \u0275\u0275conditional(ctx_r2.pendingInstallmentsForCancellation().length > 0 ? 9 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.overdueInstallments().length > 0 ? 10 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.pendingInstallmentsForCancellation().length === 0 && ctx_r2.overdueInstallments().length > 0 ? 11 : !ctx_r2.selectedInstallmentForCancellation() && ctx_r2.pendingInstallmentsForCancellation().length > 0 ? 12 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r2.selectedInstallmentForCancellation() ? 13 : -1);
  }
}
function CollectionManagementPage_Conditional_50_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " \u2705 Comprobante Subido ");
  }
}
function CollectionManagementPage_Conditional_50_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " \u{1F4E4} Subir Comprobante ");
  }
}
function CollectionManagementPage_Conditional_50_Conditional_13_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p")(1, "strong");
    \u0275\u0275text(2, "Monto detectado:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "number");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_3_0;
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" S/ ", \u0275\u0275pipeBind2(4, 1, (tmp_3_0 = ctx_r2.uploadedComprobante()) == null ? null : tmp_3_0.ocrResult == null ? null : tmp_3_0.ocrResult.monto, "1.2-2"));
  }
}
function CollectionManagementPage_Conditional_50_Conditional_13_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p")(1, "strong");
    \u0275\u0275text(2, "Banco:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_3_0;
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", (tmp_3_0 = ctx_r2.uploadedComprobante()) == null ? null : tmp_3_0.ocrResult == null ? null : tmp_3_0.ocrResult.banco);
  }
}
function CollectionManagementPage_Conditional_50_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r29 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 198)(1, "p", 199);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(3, CollectionManagementPage_Conditional_50_Conditional_13_Conditional_3_Template, 5, 4, "p");
    \u0275\u0275conditionalCreate(4, CollectionManagementPage_Conditional_50_Conditional_13_Conditional_4_Template, 4, 1, "p");
    \u0275\u0275elementStart(5, "button", 200);
    \u0275\u0275listener("click", function CollectionManagementPage_Conditional_50_Conditional_13_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r29);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.uploadedComprobante.set(null));
    });
    \u0275\u0275text(6, " Quitar comprobante ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_2_0;
    let tmp_3_0;
    let tmp_4_0;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate((tmp_2_0 = ctx_r2.uploadedComprobante()) == null ? null : tmp_2_0.mensaje);
    \u0275\u0275advance();
    \u0275\u0275conditional(((tmp_3_0 = ctx_r2.uploadedComprobante()) == null ? null : tmp_3_0.ocrResult == null ? null : tmp_3_0.ocrResult.monto) ? 3 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(((tmp_4_0 = ctx_r2.uploadedComprobante()) == null ? null : tmp_4_0.ocrResult == null ? null : tmp_4_0.ocrResult.banco) ? 4 : -1);
  }
}
function CollectionManagementPage_Conditional_50_Template(rf, ctx) {
  if (rf & 1) {
    const _r28 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 37)(1, "div", 5)(2, "div", 6)(3, "span", 162);
    \u0275\u0275text(4, "\u{1F4CE}");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div")(6, "h4", 146);
    \u0275\u0275text(7, "Comprobante de Pago");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "p", 147);
    \u0275\u0275text(9, "Opcional: Sube una imagen del voucher para validaci\xF3n OCR");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(10, "button", 197);
    \u0275\u0275listener("click", function CollectionManagementPage_Conditional_50_Template_button_click_10_listener() {
      \u0275\u0275restoreView(_r28);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.openComprobanteUploadDialog());
    });
    \u0275\u0275conditionalCreate(11, CollectionManagementPage_Conditional_50_Conditional_11_Template, 1, 0)(12, CollectionManagementPage_Conditional_50_Conditional_12_Template, 1, 0);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(13, CollectionManagementPage_Conditional_50_Conditional_13_Template, 7, 3, "div", 198);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(10);
    \u0275\u0275classMap(ctx_r2.uploadedComprobante() ? "bg-green-500 hover:bg-green-600 text-white" : "bg-purple-600 hover:bg-purple-700 text-white");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.uploadedComprobante() ? 11 : 12);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r2.uploadedComprobante() ? 13 : -1);
  }
}
function CollectionManagementPage_Conditional_52_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 202);
    \u0275\u0275text(1, "\u23F3 Esperando Autorizaci\xF3n...");
    \u0275\u0275elementEnd();
  }
}
function CollectionManagementPage_Conditional_52_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " \u{1F510} Solicitar Autorizaci\xF3n ");
  }
}
function CollectionManagementPage_Conditional_52_Template(rf, ctx) {
  if (rf & 1) {
    const _r30 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 201);
    \u0275\u0275listener("click", function CollectionManagementPage_Conditional_52_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r30);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.openSupervisorSelectionModal());
    });
    \u0275\u0275conditionalCreate(1, CollectionManagementPage_Conditional_52_Conditional_1_Template, 2, 0, "span", 202)(2, CollectionManagementPage_Conditional_52_Conditional_2_Template, 1, 0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("disabled", ctx_r2.saving() || !ctx_r2.isFormValid() || ctx_r2.waitingForAuthorization());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.waitingForAuthorization() ? 1 : 2);
  }
}
function CollectionManagementPage_Conditional_53_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " Guardando... ");
  }
}
function CollectionManagementPage_Conditional_53_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " Guardar Gesti\xF3n ");
  }
}
function CollectionManagementPage_Conditional_53_Template(rf, ctx) {
  if (rf & 1) {
    const _r31 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 203);
    \u0275\u0275listener("click", function CollectionManagementPage_Conditional_53_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r31);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.saveManagement());
    });
    \u0275\u0275conditionalCreate(1, CollectionManagementPage_Conditional_53_Conditional_1_Template, 1, 0)(2, CollectionManagementPage_Conditional_53_Conditional_2_Template, 1, 0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("disabled", ctx_r2.saving() || !ctx_r2.isFormValid() || ctx_r2.isCancellationTypification() && (ctx_r2.pendingInstallmentsForCancellation().length > 0 || ctx_r2.overdueInstallments().length > 0) && !ctx_r2.selectedInstallmentForCancellation() || ctx_r2.isCancellationTypification() && ctx_r2.pendingInstallmentsForCancellation().length === 0 && ctx_r2.overdueInstallments().length > 0)("title", "Guardando: " + ctx_r2.saving() + " | V\xE1lido: " + ctx_r2.isFormValid());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.saving() ? 1 : 2);
  }
}
function CollectionManagementPage_Conditional_66_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 205)(1, "span", 206);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 207);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const field_r32 = ctx.$implicit;
    const \u0275$index_720_r33 = ctx.$index;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275classMap(ctx_r2.getAmountRowClass(\u0275$index_720_r33));
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", ctx_r2.themeService.isDarkMode() ? "text-red-300" : "text-red-800");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(field_r32.label);
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", ctx_r2.themeService.isDarkMode() ? "text-red-300" : "text-red-800");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r2.formatCurrency(field_r32.value), " ");
  }
}
function CollectionManagementPage_Conditional_66_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 49);
    \u0275\u0275repeaterCreate(1, CollectionManagementPage_Conditional_66_For_2_Template, 5, 6, "div", 204, _forTrack2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r2.clientAmountFields());
  }
}
function CollectionManagementPage_Conditional_81_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 57);
    \u0275\u0275text(1, " Sin gestiones registradas para este cliente ");
    \u0275\u0275elementEnd();
  }
}
function CollectionManagementPage_Conditional_82_For_23_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 222);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "number");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const gestion_r34 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("S/ ", \u0275\u0275pipeBind2(2, 1, gestion_r34.montoPromesa, "1.2-2"));
  }
}
function CollectionManagementPage_Conditional_82_For_23_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 223);
    \u0275\u0275text(1, "-");
    \u0275\u0275elementEnd();
  }
}
function CollectionManagementPage_Conditional_82_For_23_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const gestion_r34 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275classMap("px-1.5 py-0.5 rounded text-[9px] font-semibold " + (gestion_r34.estadoPago === "PAGADA" ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300" : gestion_r34.estadoPago === "PENDIENTE" ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300" : gestion_r34.estadoPago === "VENCIDA" ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300" : gestion_r34.estadoPago === "PARCIAL" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300" : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", gestion_r34.estadoPagoDisplay, " ");
  }
}
function CollectionManagementPage_Conditional_82_For_23_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 223);
    \u0275\u0275text(1, "-");
    \u0275\u0275elementEnd();
  }
}
function CollectionManagementPage_Conditional_82_For_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr", 213)(1, "td", 214);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td", 215);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td", 216)(6, "span", 217);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "td", 218);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "td", 219);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "td", 220)(13, "span");
    \u0275\u0275text(14);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "td", 220)(16, "span");
    \u0275\u0275text(17);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(18, "td", 221);
    \u0275\u0275conditionalCreate(19, CollectionManagementPage_Conditional_82_For_23_Conditional_19_Template, 3, 4, "span", 222)(20, CollectionManagementPage_Conditional_82_For_23_Conditional_20_Template, 2, 0, "span", 223);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "td", 224);
    \u0275\u0275conditionalCreate(22, CollectionManagementPage_Conditional_82_For_23_Conditional_22_Template, 2, 3, "span", 18)(23, CollectionManagementPage_Conditional_82_For_23_Conditional_23_Template, 2, 0, "span", 223);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const gestion_r34 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(gestion_r34.fecha);
    \u0275\u0275advance();
    \u0275\u0275property("title", gestion_r34.nombreAgente);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(gestion_r34.nombreAgente);
    \u0275\u0275advance(2);
    \u0275\u0275property("title", gestion_r34.tipificacionCompleta);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", gestion_r34.tipificacionCompleta, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(gestion_r34.telefono || "-");
    \u0275\u0275advance();
    \u0275\u0275property("title", gestion_r34.observacion);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", gestion_r34.observacion || "-", " ");
    \u0275\u0275advance(2);
    \u0275\u0275classMap("px-1.5 py-0.5 rounded text-[9px] font-semibold " + ((gestion_r34.canal == null ? null : gestion_r34.canal.includes("SALIENTE")) ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300" : (gestion_r34.canal == null ? null : gestion_r34.canal.includes("ENTRANTE")) ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300" : gestion_r34.canal === "WHATSAPP" ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300" : gestion_r34.canal === "SMS" ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300" : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", gestion_r34.canalDisplay, " ");
    \u0275\u0275advance(2);
    \u0275\u0275classMap("px-1.5 py-0.5 rounded text-[9px] font-semibold " + (gestion_r34.metodo === "GESTION_MANUAL" ? "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300" : gestion_r34.metodo === "GESTION_PROGRESIVO" ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300" : gestion_r34.metodo === "GESTION_PREDICTIVO" ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300" : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", gestion_r34.metodoDisplay, " ");
    \u0275\u0275advance(2);
    \u0275\u0275conditional(gestion_r34.montoPromesa && gestion_r34.montoPromesa > 0 ? 19 : 20);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(gestion_r34.estadoPago ? 22 : 23);
  }
}
function CollectionManagementPage_Conditional_82_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "table", 58)(1, "thead", 208)(2, "tr", 209)(3, "th", 210);
    \u0275\u0275text(4, "Fecha");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "th", 210);
    \u0275\u0275text(6, "Agente");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "th", 210);
    \u0275\u0275text(8, "Tipificaci\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "th", 210);
    \u0275\u0275text(10, "Tel\xE9fono");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "th", 210);
    \u0275\u0275text(12, "Observaci\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "th", 210);
    \u0275\u0275text(14, "Canal");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "th", 210);
    \u0275\u0275text(16, "M\xE9todo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "th", 211);
    \u0275\u0275text(18, "Monto Promesa");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "th", 212);
    \u0275\u0275text(20, "Estado Pago");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(21, "tbody");
    \u0275\u0275repeaterCreate(22, CollectionManagementPage_Conditional_82_For_23_Template, 24, 16, "tr", 213, _forTrack04);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(22);
    \u0275\u0275repeater(ctx_r2.historialGestiones());
  }
}
function CollectionManagementPage_Conditional_83_Template(rf, ctx) {
  if (rf & 1) {
    const _r35 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 59)(1, "div", 225)(2, "div", 226)(3, "div", 171)(4, "div")(5, "h2", 227);
    \u0275\u0275text(6, "Cronograma de Pagos");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p", 63);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(9, "button", 228);
    \u0275\u0275listener("click", function CollectionManagementPage_Conditional_83_Template_button_click_9_listener() {
      \u0275\u0275restoreView(_r35);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.closeScheduleDetail());
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "div", 229);
    \u0275\u0275element(11, "app-payment-schedule-view", 230);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "div", 231)(13, "button", 232);
    \u0275\u0275listener("click", function CollectionManagementPage_Conditional_83_Template_button_click_13_listener() {
      \u0275\u0275restoreView(_r35);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.closeScheduleDetail());
    });
    \u0275\u0275text(14, " Cerrar ");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate1("Gesti\xF3n ", ctx_r2.scheduleManagementId());
    \u0275\u0275advance(3);
    \u0275\u0275property("managementId", ctx_r2.scheduleManagementId());
  }
}
var _CollectionManagementPage = class _CollectionManagementPage {
  constructor(systemConfigService, managementService, paymentScheduleService, themeService, classificationService, typificationV2Service, apiSystemConfigService, customerOutputConfigService, customerService, router, route, http, sipService, agentService, agentStatusService, authService, autorizacionService, recordatoriosService, dialog, comprobanteService, cartaAcuerdoService) {
    this.systemConfigService = systemConfigService;
    this.managementService = managementService;
    this.paymentScheduleService = paymentScheduleService;
    this.themeService = themeService;
    this.classificationService = classificationService;
    this.typificationV2Service = typificationV2Service;
    this.apiSystemConfigService = apiSystemConfigService;
    this.customerOutputConfigService = customerOutputConfigService;
    this.customerService = customerService;
    this.router = router;
    this.route = route;
    this.http = http;
    this.sipService = sipService;
    this.agentService = agentService;
    this.agentStatusService = agentStatusService;
    this.authService = authService;
    this.autorizacionService = autorizacionService;
    this.recordatoriosService = recordatoriosService;
    this.dialog = dialog;
    this.comprobanteService = comprobanteService;
    this.cartaAcuerdoService = cartaAcuerdoService;
    this.callActive = signal(false, ...ngDevMode ? [{ debugName: "callActive" }] : []);
    this.callDuration = signal(0, ...ngDevMode ? [{ debugName: "callDuration" }] : []);
    this.saving = signal(false, ...ngDevMode ? [{ debugName: "saving" }] : []);
    this.showScheduleDetail = signal(false, ...ngDevMode ? [{ debugName: "showScheduleDetail" }] : []);
    this.scheduleManagementId = signal(null, ...ngDevMode ? [{ debugName: "scheduleManagementId" }] : []);
    this.showOutputSelector = false;
    this.errors = signal({}, ...ngDevMode ? [{ debugName: "errors" }] : []);
    this.showSuccess = signal(false, ...ngDevMode ? [{ debugName: "showSuccess" }] : []);
    this.animateEntry = signal(true, ...ngDevMode ? [{ debugName: "animateEntry" }] : []);
    this.activeTab = signal("cliente", ...ngDevMode ? [{ debugName: "activeTab" }] : []);
    this.isTipifying = signal(false, ...ngDevMode ? [{ debugName: "isTipifying" }] : []);
    this.colorIndicador = signal("verde", ...ngDevMode ? [{ debugName: "colorIndicador" }] : []);
    this.excedeTiempoMaximo = signal(false, ...ngDevMode ? [{ debugName: "excedeTiempoMaximo" }] : []);
    this.requiresAuthorization = signal(false, ...ngDevMode ? [{ debugName: "requiresAuthorization" }] : []);
    this.waitingForAuthorization = signal(false, ...ngDevMode ? [{ debugName: "waitingForAuthorization" }] : []);
    this.showSupervisorModal = false;
    this.currentAuthorizationData = null;
    this.historialGestiones = signal([], ...ngDevMode ? [{ debugName: "historialGestiones" }] : []);
    this.tenants = [];
    this.portfolios = [];
    this.testDocument = "";
    this.testPhone = "";
    this.customerOutputFields = signal([], ...ngDevMode ? [{ debugName: "customerOutputFields" }] : []);
    this.campaign = computed(() => this.systemConfigService.getCampaign(), ...ngDevMode ? [{ debugName: "campaign" }] : []);
    this.contactClassifications = computed(() => this.systemConfigService.getContactClassifications(), ...ngDevMode ? [{ debugName: "contactClassifications" }] : []);
    this.managementClassifications = computed(() => this.apiSystemConfigService.getManagementClassificationsForUI(), ...ngDevMode ? [{ debugName: "managementClassifications" }] : []);
    this.managementClassificationsHierarchical = computed(() => {
      const all = this.managementClassifications();
      const byId = /* @__PURE__ */ new Map();
      const children = /* @__PURE__ */ new Map();
      all.forEach((item) => {
        const itemId = String(item.id);
        byId.set(itemId, item);
        children.set(itemId, []);
      });
      all.forEach((item) => {
        if (item.parentId) {
          const parentIdStr = String(item.parentId);
          const childList = children.get(parentIdStr);
          if (childList) {
            childList.push(item);
          }
        }
      });
      const flatten = (items, level = 0) => {
        const flattened = [];
        items.forEach((item) => {
          flattened.push(__spreadProps(__spreadValues({}, item), {
            indentLevel: level,
            displayLabel: "  ".repeat(level) + (level > 0 ? "\u2514\u2500 " : "") + `[${item.codigo}] ${item.label}`
          }));
          const itemIdStr = String(item.id);
          const itemChildren = children.get(itemIdStr) || [];
          if (itemChildren.length > 0) {
            flattened.push(...flatten(itemChildren, level + 1));
          }
        });
        return flattened;
      };
      const roots = all.filter((item) => !item.parentId);
      return flatten(roots, 0);
    }, ...ngDevMode ? [{ debugName: "managementClassificationsHierarchical" }] : []);
    this.paymentMethods = computed(() => this.systemConfigService.getPaymentMethods(), ...ngDevMode ? [{ debugName: "paymentMethods" }] : []);
    this.scheduleTypes = computed(() => this.systemConfigService.getScheduleConfig().tipos_cronograma, ...ngDevMode ? [{ debugName: "scheduleTypes" }] : []);
    this.periodicities = computed(() => this.systemConfigService.getScheduleConfig().periodicidades, ...ngDevMode ? [{ debugName: "periodicities" }] : []);
    this.customerPaymentAmounts = computed(() => {
      const rawData = this.rawClientData();
      const enabledOptions = this.enabledPaymentOptions();
      const hasConfig = this.hasPaymentOptionsConfig();
      const cabeceras = this.montoCabeceras();
      if (!rawData || Object.keys(rawData).length === 0) {
        console.log("[PAYMENT] No raw client data available");
        return [];
      }
      const codigoToNombre = /* @__PURE__ */ new Map();
      for (const c of cabeceras) {
        codigoToNombre.set(c.codigo.toLowerCase(), c.nombre);
      }
      const amounts = [];
      if (hasConfig) {
        for (const option of enabledOptions) {
          if (option.codigoOpcion === "personalizado") {
            amounts.push({
              label: "Otro monto",
              value: -1,
              // Special marker for custom amount
              field: "personalizado",
              generaCartaAcuerdo: option.generaCartaAcuerdo || false
            });
            continue;
          }
          const fieldName = option.campoTablaDinamica;
          if (!fieldName)
            continue;
          const rawKey = Object.keys(rawData).find((k) => k.toLowerCase() === fieldName.toLowerCase());
          if (!rawKey)
            continue;
          const value = rawData[rawKey];
          const numValue = typeof value === "number" ? value : parseFloat(String(value));
          if (!isNaN(numValue) && numValue >= 0) {
            const visualName = codigoToNombre.get(fieldName.toLowerCase()) || option.labelOpcion || this.formatFieldLabel(fieldName);
            amounts.push({
              label: visualName,
              value: numValue,
              field: fieldName,
              restriccionFecha: option.restriccionFecha || "SIN_RESTRICCION",
              generaCartaAcuerdo: option.generaCartaAcuerdo || false
            });
          }
        }
        console.log("[PAYMENT] Amounts from CONFIG (enabled only):", amounts.length);
      } else {
        if (cabeceras.length > 0) {
          for (const cabecera of cabeceras) {
            const lowerCodigo = cabecera.codigo.toLowerCase();
            const value = rawData[lowerCodigo] ?? rawData[cabecera.codigo];
            if (value !== void 0 && value !== null) {
              const numValue = typeof value === "number" ? value : parseFloat(value);
              if (!isNaN(numValue) && numValue >= 0) {
                amounts.push({
                  label: cabecera.nombre,
                  value: numValue,
                  field: lowerCodigo,
                  generaCartaAcuerdo: false
                });
              }
            }
          }
          console.log("[PAYMENT] Amounts FALLBACK (from cabeceras):", amounts.length);
        } else {
          console.log("[PAYMENT] No config and no cabeceras - showing empty");
        }
      }
      amounts.sort((a, b) => {
        if (a.field === "personalizado")
          return 1;
        if (b.field === "personalizado")
          return -1;
        return b.value - a.value;
      });
      return amounts;
    }, ...ngDevMode ? [{ debugName: "customerPaymentAmounts" }] : []);
    this.tabs = [
      { id: "cliente", label: "Cliente", icon: "user" },
      { id: "historial", label: "Historial", icon: "history" }
    ];
    this.managementForm = {
      resultadoContacto: "",
      tipoGestion: "",
      clasificacionNivel1: "",
      clasificacionNivel2: "",
      clasificacionNivel3: "",
      motivoNoPago: "",
      metodoPago: "",
      montoPago: "",
      fechaCompromiso: "",
      horaCompromiso: "",
      ultimos4Tarjeta: "",
      bancoSeleccionado: "",
      observaciones: "",
      notasPrivadas: ""
    };
    this.selectedClassifications = signal([], ...ngDevMode ? [{ debugName: "selectedClassifications" }] : []);
    this.dynamicFields = signal([], ...ngDevMode ? [{ debugName: "dynamicFields" }] : []);
    this.dynamicFieldValues = signal({}, ...ngDevMode ? [{ debugName: "dynamicFieldValues" }] : []);
    this.isLoadingDynamicFields = signal(false, ...ngDevMode ? [{ debugName: "isLoadingDynamicFields" }] : []);
    this.isLeafClassification = signal(false, ...ngDevMode ? [{ debugName: "isLeafClassification" }] : []);
    this.dynamicFieldsSchema = signal(null, ...ngDevMode ? [{ debugName: "dynamicFieldsSchema" }] : []);
    this.externalFieldUpdates = signal({}, ...ngDevMode ? [{ debugName: "externalFieldUpdates" }] : []);
    this.activeSchedules = signal([], ...ngDevMode ? [{ debugName: "activeSchedules" }] : []);
    this.isLoadingSchedules = signal(false, ...ngDevMode ? [{ debugName: "isLoadingSchedules" }] : []);
    this.showScheduleHelper = signal(false, ...ngDevMode ? [{ debugName: "showScheduleHelper" }] : []);
    this.selectedClassification = computed(() => {
      const selectedIds = this.selectedClassifications();
      if (selectedIds.length === 0)
        return null;
      const lastSelectedId = selectedIds[selectedIds.length - 1];
      if (!lastSelectedId)
        return null;
      const allTypifications = this.managementClassifications();
      const found = allTypifications.find((c) => String(c.id) === String(lastSelectedId));
      if (found) {
        console.log("[DEBUG] Selected typification:", found);
        console.log("[DEBUG] suggestsFullAmount:", found.suggestsFullAmount);
        console.log("[DEBUG] allowsInstallmentSelection:", found.allowsInstallmentSelection);
        console.log("[DEBUG] requiresManualAmount:", found.requiresManualAmount);
      }
      return found || null;
    }, ...ngDevMode ? [{ debugName: "selectedClassification" }] : []);
    this.isFormValid = computed(() => {
      if (this.usesHierarchicalClassifications()) {
        const selected = this.selectedClassifications();
        if (selected.length === 0 || !selected[selected.length - 1]) {
          console.log("[isFormValid] \u274C No hay clasificaci\xF3n seleccionada");
          return false;
        }
        const lastSelectedId = selected[selected.length - 1];
        const all = this.managementClassifications();
        const hasChildren = all.some((c) => c.parentId && Number(c.parentId) === Number(lastSelectedId));
        if (hasChildren) {
          console.log("[isFormValid] \u274C A\xFAn hay niveles por seleccionar, lastSelectedId:", lastSelectedId);
          return false;
        }
        console.log("[isFormValid] \u2705 Clasificaci\xF3n completa:", selected);
      } else {
        if (!this.managementForm.resultadoContacto) {
          return false;
        }
      }
      const schema = this.dynamicFieldsSchema();
      const dynamicValues = this.dynamicFieldValues();
      console.log("[isFormValid] Schema:", schema);
      console.log("[isFormValid] Dynamic Values:", dynamicValues);
      if (schema && schema.fields && schema.fields.length > 0) {
        for (const field of schema.fields) {
          if (field.required) {
            const value = dynamicValues[field.id];
            console.log(`[isFormValid] Campo '${field.id}' (required=${field.required}): valor='${value}'`);
            if (value === void 0 || value === null || value === "") {
              console.log(`[isFormValid] \u274C Campo requerido '${field.id}' est\xE1 vac\xEDo`);
              return false;
            }
            if (field.type === "table") {
              if (!Array.isArray(value) || value.length === 0) {
                console.log(`[isFormValid] \u274C Tabla '${field.id}' sin filas`);
                return false;
              }
            }
          }
        }
      }
      console.log("[isFormValid] \u2705 Formulario v\xE1lido!");
      return true;
    }, ...ngDevMode ? [{ debugName: "isFormValid" }] : []);
    this.hierarchyLevels = computed(() => {
      const all = this.managementClassifications();
      const selected = this.selectedClassifications();
      const levels = [];
      console.log("[hierarchyLevels] Total classifications:", all.length);
      console.log("[hierarchyLevels] Selected:", selected);
      const roots = all.filter((c) => c.hierarchyLevel === 1 || !c.parentId);
      console.log("[hierarchyLevels] Nivel 1 (roots):", roots.length, roots.map((r) => `${r.codigo} (ID:${r.id})`));
      if (roots.length > 0) {
        levels.push(roots);
      }
      for (let i = 0; i < selected.length; i++) {
        const parentId = selected[i];
        console.log(`[hierarchyLevels] Buscando hijos del nivel ${i + 1}, parentId:`, parentId);
        if (parentId) {
          const children = all.filter((c) => c.parentId && Number(c.parentId) === Number(parentId));
          console.log(`[hierarchyLevels] Encontrados ${children.length} hijos:`, children.map((c) => `${c.codigo} (ID:${c.id}, parent:${c.parentId})`));
          if (children.length > 0) {
            levels.push(children);
          } else {
            console.log(`[hierarchyLevels] No se encontraron hijos, deteniendo b\xFAsqueda`);
            break;
          }
        }
      }
      console.log("[hierarchyLevels] Total niveles construidos:", levels.length);
      return levels;
    }, ...ngDevMode ? [{ debugName: "hierarchyLevels" }] : []);
    this.scheduleForm = {
      numeroCuotas: "",
      montoCuota: "",
      periodicidad: "",
      fechaPrimeraCuota: "",
      tipoCronograma: "",
      montoInicial: "",
      montoNegociado: "",
      // Para tipo Financiera
      cuotas: []
    };
    this.customerData = signal({
      id_cliente: "CLI-2025-0087453",
      nombre_completo: "GARC\xCDA RODRIGUEZ, CARMEN ROSA",
      tipo_documento: "DNI",
      numero_documento: "45621378",
      fecha_nacimiento: "15/03/1985",
      edad: 40,
      contacto: {
        telefono_principal: "+51 987 654 321",
        telefono_alternativo: "+51 945 123 456",
        telefono_trabajo: "+51 01 4567890",
        email: "carmen.garcia@email.com",
        direccion: "Av. Los \xC1lamos 458, Dpto 302, San Borja, Lima"
      },
      cuenta: {
        numero_cuenta: "****5678",
        tipo_producto: "Pr\xE9stamo Personal",
        fecha_desembolso: "15/01/2024",
        monto_original: 15e3,
        plazo_meses: 24,
        tasa_interes: 18.5
      },
      deuda: {
        saldo_capital: 8750.5,
        intereses_vencidos: 456.78,
        mora_acumulada: 234.5,
        gastos_cobranza: 120,
        saldo_total: 9561.78,
        dias_mora: 45,
        fecha_ultimo_pago: "15/10/2024",
        monto_ultimo_pago: 458.33
      }
    }, ...ngDevMode ? [{ debugName: "customerData" }] : []);
    this.activePaymentSchedules = signal([], ...ngDevMode ? [{ debugName: "activePaymentSchedules" }] : []);
    this.selectedInstallmentForCancellation = signal(null, ...ngDevMode ? [{ debugName: "selectedInstallmentForCancellation" }] : []);
    this.montoPagoEditable = signal(0, ...ngDevMode ? [{ debugName: "montoPagoEditable" }] : []);
    this.fechaPagoEditable = signal("", ...ngDevMode ? [{ debugName: "fechaPagoEditable" }] : []);
    this.uploadedComprobante = signal(null, ...ngDevMode ? [{ debugName: "uploadedComprobante" }] : []);
    this.isCancellationTypification = computed(() => {
      const selected = this.selectedClassification();
      if (!selected)
        return false;
      return selected.codigo === "CA" || selected.label?.toUpperCase().includes("CANCELACION") || selected.label?.toUpperCase().includes("CANCELACI\xD3N");
    }, ...ngDevMode ? [{ debugName: "isCancellationTypification" }] : []);
    this.pendingInstallmentsForCancellation = computed(() => {
      const schedules = this.activePaymentSchedules();
      const allPending = [];
      const today = /* @__PURE__ */ new Date();
      today.setHours(0, 0, 0, 0);
      for (const schedule of schedules) {
        if (schedule.installments) {
          for (const cuota of schedule.installments) {
            const estado = cuota.status?.toUpperCase();
            if (estado !== "PAGADA" && estado !== "PAGADO" && estado !== "CUMPLIDO" && estado !== "CANCELADA" && estado !== "CANCELADO" && estado !== "VENCIDA" && estado !== "VENCIDO") {
              const fechaPago = cuota.dueDate || cuota.fechaPago;
              if (fechaPago) {
                const fechaPagoDate = this.parseDateLocal(fechaPago);
                if (fechaPagoDate >= today) {
                  allPending.push(__spreadProps(__spreadValues({}, cuota), {
                    scheduleId: schedule.id,
                    grupoPromesaUuid: schedule.grupoPromesaUuid
                  }));
                }
              }
            }
          }
        }
      }
      return allPending;
    }, ...ngDevMode ? [{ debugName: "pendingInstallmentsForCancellation" }] : []);
    this.overdueInstallments = computed(() => {
      const schedules = this.activePaymentSchedules();
      const overdue = [];
      const today = /* @__PURE__ */ new Date();
      today.setHours(0, 0, 0, 0);
      for (const schedule of schedules) {
        if (schedule.installments) {
          for (const cuota of schedule.installments) {
            const estado = cuota.status?.toUpperCase();
            if (estado === "VENCIDA" || estado === "VENCIDO") {
              overdue.push(__spreadProps(__spreadValues({}, cuota), {
                scheduleId: schedule.id,
                grupoPromesaUuid: schedule.grupoPromesaUuid
              }));
            } else if (estado === "PENDIENTE") {
              const fechaPago = cuota.dueDate || cuota.fechaPago;
              if (fechaPago) {
                const fechaPagoDate = this.parseDateLocal(fechaPago);
                if (fechaPagoDate < today) {
                  overdue.push(__spreadProps(__spreadValues({}, cuota), {
                    scheduleId: schedule.id,
                    grupoPromesaUuid: schedule.grupoPromesaUuid
                  }));
                }
              }
            }
          }
        }
      }
      return overdue;
    }, ...ngDevMode ? [{ debugName: "overdueInstallments" }] : []);
    this.rawClientData = signal({}, ...ngDevMode ? [{ debugName: "rawClientData" }] : []);
    this.clientAmountFields = computed(() => {
      const rawData = this.rawClientData();
      const allCabeceras = this.montoCabeceras();
      const amountFields = [];
      if (allCabeceras.length > 0) {
        const cabeceras = allCabeceras.filter((c) => c.esVisibleMonto === 1 || c.esVisibleMonto === void 0 || c.esVisibleMonto === null).sort((a, b) => (a.ordenMonto || 0) - (b.ordenMonto || 0));
        for (const cabecera of cabeceras) {
          const lowerCodigo = cabecera.codigo.toLowerCase();
          const value = rawData[lowerCodigo] ?? rawData[cabecera.codigo];
          if (value !== void 0 && value !== null) {
            const numValue = typeof value === "number" ? value : parseFloat(value);
            if (!isNaN(numValue)) {
              amountFields.push({
                label: cabecera.nombre,
                // Usar nombre visual de la cabecera
                value: numValue,
                field: lowerCodigo
              });
            }
          }
        }
      } else {
        const excludeFields = [
          "id",
          "id_campana",
          "id_cartera",
          "id_subcartera",
          "prioridad",
          "estado",
          "documento",
          "num_cuenta",
          "num_cuenta_pmcp",
          "numero_cuenta",
          "periodo",
          "edad",
          "dias_mora",
          "dias_mora_asig",
          "telefono_celular",
          "telefono_domicilio",
          "telefono_laboral",
          "telf_referencia_1",
          "telf_referencia_2"
        ];
        for (const [key, value] of Object.entries(rawData)) {
          const lowerKey = key.toLowerCase();
          if (lowerKey.startsWith("fec_") || lowerKey.startsWith("fecha_"))
            continue;
          if (lowerKey.startsWith("telefono_") || lowerKey.startsWith("telf_"))
            continue;
          if (excludeFields.includes(lowerKey))
            continue;
          const numValue = typeof value === "number" ? value : parseFloat(value);
          if (!isNaN(numValue) && numValue >= 0) {
            amountFields.push({
              label: this.formatFieldLabel(key),
              value: numValue,
              field: key
            });
          }
        }
      }
      return amountFields.sort((a, b) => b.value - a.value);
    }, ...ngDevMode ? [{ debugName: "clientAmountFields" }] : []);
    this.clientDiasMora = computed(() => {
      const rawData = this.rawClientData();
      const diasMora = rawData["dias_mora"] || rawData["dias_mora_asig"] || 0;
      return typeof diasMora === "number" ? diasMora : parseInt(diasMora) || 0;
    }, ...ngDevMode ? [{ debugName: "clientDiasMora" }] : []);
    this.montoCabeceras = signal([], ...ngDevMode ? [{ debugName: "montoCabeceras" }] : []);
    this.enabledPaymentOptions = signal([], ...ngDevMode ? [{ debugName: "enabledPaymentOptions" }] : []);
    this.paymentScheduleFieldId = signal(null, ...ngDevMode ? [{ debugName: "paymentScheduleFieldId" }] : []);
    this.hasPaymentOptionsConfig = signal(false, ...ngDevMode ? [{ debugName: "hasPaymentOptionsConfig" }] : []);
    this.callState = CallState.IDLE;
    this.isMuted = signal(false, ...ngDevMode ? [{ debugName: "isMuted" }] : []);
    this.incomingPhoneNumber = null;
    this.outgoingPhoneNumber = null;
  }
  ngOnInit() {
    this.loadTenants();
    this.loadManagementHistory();
    const initialCallState = this.sipService.getCallState();
    console.log("\u{1F4DE} [CollectionManagement] Estado inicial de llamada:", initialCallState);
    if (initialCallState === CallState.ACTIVE && !this.callActive()) {
      console.log("\u23F1\uFE0F Llamada ya est\xE1 activa, iniciando timer autom\xE1ticamente...");
      this.callActive.set(true);
      this.startCall();
    }
    this.callStateSubscription = this.sipService.onCallStatus.subscribe((state) => {
      console.log("\u{1F4DE} [CollectionManagement] Estado de llamada:", state);
      this.callState = state;
      if (state === CallState.ACTIVE && !this.callActive()) {
        this.callActive.set(true);
        this.startCall();
        const currentUser2 = this.authService.getCurrentUser();
        if (currentUser2?.id) {
          this.agentService.changeAgentStatus(currentUser2.id, { estado: AgentState.EN_LLAMADA }).subscribe({
            next: () => console.log("\u2705 Estado cambiado a EN_LLAMADA"),
            error: (err) => console.error("\u274C Error cambiando estado:", err)
          });
        }
      }
      if ((state === CallState.ENDED || state === CallState.IDLE) && this.callActive()) {
        this.callActive.set(false);
        this.isTipifying.set(true);
        this.sipService.blockIncomingCallsMode(true);
        console.log("\u{1F6AB} Bloqueando llamadas entrantes - agente en tipificaci\xF3n");
        const finalDuration = this.callDuration();
        if (this.callTimer) {
          clearInterval(this.callTimer);
          this.callTimer = void 0;
        }
        console.log(`\u{1F4DD} Llamada terminada (${finalDuration}s), cambiando a TIPIFICANDO`);
        const currentUser2 = this.authService.getCurrentUser();
        if (currentUser2?.id) {
          this.agentService.changeAgentStatus(currentUser2.id, { estado: AgentState.TIPIFICANDO }).subscribe({
            next: () => console.log("\u2705 Estado cambiado a TIPIFICANDO - agente debe completar formulario"),
            error: (err) => console.error("\u274C Error cambiando estado:", err)
          });
        }
      }
    });
    this.incomingCallSubscription = this.sipService.onIncomingCall.subscribe((callInfo) => {
      console.log("\u{1F4F2} [CollectionManagement] Llamada entrante de:", callInfo.from);
      this.incomingPhoneNumber = callInfo.from;
      if (callInfo.from) {
        this.autoLoadCustomerByPhone(callInfo.from);
      }
    });
    this.outgoingCallSubscription = this.sipService.onOutgoingCall.subscribe((callInfo) => {
      console.log("\u{1F4E4} [CollectionManagement] Llamada saliente a:", callInfo.to);
      this.outgoingPhoneNumber = callInfo.to;
      if (callInfo.to) {
        this.autoLoadCustomerByPhone(callInfo.to);
      }
    });
    const pendingOutgoingNumber = this.sipService.getCurrentOutgoingNumber();
    if (pendingOutgoingNumber && !this.customerData()?.id) {
      console.log("\u{1F4E4} [CollectionManagement] Llamada saliente pendiente detectada:", pendingOutgoingNumber);
      this.outgoingPhoneNumber = pendingOutgoingNumber;
      this.autoLoadCustomerByPhone(pendingOutgoingNumber);
      this.sipService.clearCurrentOutgoingNumber();
    }
    this.route.queryParams.subscribe((params) => {
      if (params["source"] === "manual" && params["documento"]) {
        console.log("\u{1F4CB} [MANUAL] Cargando cliente desde gesti\xF3n manual:", params);
        this.loadCustomerByDocumentoFromManual(params["documento"], Number(params["tenantId"]), Number(params["portfolioId"]), Number(params["subPortfolioId"]));
      }
    });
    this.autorizacionService.respuesta$.subscribe((solicitud) => {
      if (solicitud && this.waitingForAuthorization()) {
        this.handleAuthorizationResponse(solicitud);
      }
    });
    const currentUser = this.authService.getCurrentUser();
    if (currentUser?.id) {
      this.agentStatusSubscription = this.agentStatusService.startStatusPolling(currentUser.id).subscribe({
        next: (response) => {
          if (response.colorIndicador) {
            this.colorIndicador.set(response.colorIndicador);
          }
          this.excedeTiempoMaximo.set(response.excedeTiempoMaximo || false);
        },
        error: (err) => console.error("\u274C Error polling estado del agente:", err)
      });
    }
  }
  /**
   * Busca y carga automáticamente un cliente por su número de teléfono
   * Se llama cuando llega una llamada entrante
   * Busca en todos los tenants/carteras/subcarteras
   */
  autoLoadCustomerByPhone(phoneNumber) {
    console.log("\u{1F50D} [AUTO-LOAD] Buscando cliente por tel\xE9fono:", phoneNumber);
    this.customerService.searchCustomersAcrossAllTenants("telefono", phoneNumber).subscribe({
      next: (customers) => {
        if (customers && customers.length > 0) {
          console.log("\u2705 [AUTO-LOAD] Cliente encontrado:", customers[0]);
          this.loadCustomerFromResource(customers[0]);
        } else {
          console.warn("\u26A0\uFE0F [AUTO-LOAD] No se encontr\xF3 cliente con tel\xE9fono:", phoneNumber);
        }
      },
      error: (error) => {
        console.error("\u274C [AUTO-LOAD] Error buscando cliente:", error);
      }
    });
  }
  /**
   * Carga un cliente por documento desde la gestión manual
   * Busca en la tabla dinámica ini_ de la subcartera especificada
   */
  loadCustomerByDocumentoFromManual(documento, tenantId, portfolioId, subPortfolioId) {
    console.log("\u{1F50D} [MANUAL] Buscando cliente por documento:", documento);
    this.selectedTenantId = tenantId;
    this.selectedPortfolioId = portfolioId;
    this.selectedSubPortfolioId = subPortfolioId;
    this.reloadTypifications();
    this.loadCustomerOutputConfig();
    this.http.get(`${environment.apiUrl}/client-search/find`, {
      params: {
        tenantId: tenantId.toString(),
        portfolioId: portfolioId.toString(),
        subPortfolioId: subPortfolioId.toString(),
        documento
      }
    }).pipe(catchError((error) => {
      console.error("\u274C [MANUAL] Error buscando cliente:", error);
      return of(null);
    })).subscribe({
      next: (clientData) => {
        if (clientData) {
          console.log("\u2705 [MANUAL] Cliente encontrado:", clientData);
          this.loadCustomerFromDynamicTable(clientData);
        } else {
          console.warn("\u26A0\uFE0F [MANUAL] Cliente no encontrado");
        }
      }
    });
  }
  /**
   * Carga los datos de un cliente desde la tabla dinámica ini_
   * @param client Datos del cliente desde la tabla dinámica
   * IMPORTANTE: Siempre usa client.id (ini_*.id) para consistencia entre flujos
   */
  loadCustomerFromDynamicTable(client) {
    this.rawClientData.set(client);
    console.log("[CUSTOMER] Raw client data from ini_* table:", client);
    this.loadMontoCabeceras();
    const customerId = client.id || 0;
    console.log("[CUSTOMER] Using ini_*.id as customerId:", customerId);
    this.customerData.set({
      id: customerId,
      id_cliente: client.documento,
      nombre_completo: client.nombre || client.nombres + " " + (client.apellidos || ""),
      tipo_documento: "DNI",
      numero_documento: client.documento,
      fecha_nacimiento: "",
      edad: 0,
      contacto: {
        telefono_principal: client.telefono_celular || client.telefono_principal || client.telefono || client.telefono_1 || "",
        telefono_alternativo: client.telefono_domicilio || client.telefono_secundario || client.telefono_2 || "",
        telefono_trabajo: client.telefono_laboral || client.telefono_trabajo || client.telefono_3 || "",
        email: client.email || "",
        direccion: client.direccion || ""
      },
      cuenta: {
        numero_cuenta: client.cuenta || "",
        tipo_producto: client.producto || "PR\xC9STAMO",
        fecha_desembolso: "",
        monto_original: client.monto_original || 0,
        plazo_meses: 0,
        tasa_interes: 0
      },
      deuda: {
        saldo_capital: client.deuda_capital || 0,
        intereses_vencidos: 0,
        mora_acumulada: client.deuda_mora || 0,
        gastos_cobranza: 0,
        saldo_total: (client.deuda_capital || 0) + (client.deuda_mora || 0),
        dias_mora: client.dias_mora || 0,
        fecha_ultimo_pago: "",
        monto_ultimo_pago: 0
      }
    });
    this.loadManagementHistory();
    if (customerId) {
      this.loadActivePaymentSchedules(customerId);
    }
    console.log("\u2705 Cliente cargado exitosamente, customerId:", customerId);
  }
  /**
   * Carga las cabeceras de montos desde configuracion_cabeceras para mostrar nombres visuales
   */
  loadMontoCabeceras() {
    if (!this.selectedSubPortfolioId) {
      console.warn("[CABECERAS] No hay subcartera seleccionada");
      return;
    }
    console.log("[CABECERAS] Cargando cabeceras de montos para subcartera:", this.selectedSubPortfolioId);
    this.managementService.getMontoCabeceras(this.selectedSubPortfolioId).pipe(catchError((error) => {
      console.error("[CABECERAS] Error cargando cabeceras:", error);
      return of([]);
    })).subscribe((cabeceras) => {
      console.log("[CABECERAS] Cabeceras cargadas:", cabeceras);
      this.montoCabeceras.set(cabeceras.map((c) => ({
        codigo: c.codigo,
        nombre: c.nombre,
        tipoDato: c.tipoDato,
        tipoSql: c.tipoSql,
        esVisibleMonto: c.esVisibleMonto,
        ordenMonto: c.ordenMonto
      })));
    });
  }
  loadTenants() {
    const currentUser = this.authService.getCurrentUser();
    console.log("[V2] Usuario actual:", currentUser);
    if (currentUser?.tenantId && currentUser?.portfolioId && currentUser?.subPortfolioId) {
      this.selectedTenantId = currentUser.tenantId;
      this.selectedPortfolioId = currentUser.portfolioId;
      this.selectedSubPortfolioId = currentUser.subPortfolioId;
      console.log(`[V2] Usando asignaci\xF3n del usuario: tenant=${this.selectedTenantId}, portfolio=${this.selectedPortfolioId}, subPortfolio=${this.selectedSubPortfolioId}`);
      this.reloadTypifications();
      this.loadCustomerOutputConfig();
      this.loadFirstCustomer();
    } else {
      console.error("[V2] Usuario no tiene asignaci\xF3n completa de tenant/portfolio/subportfolio");
      console.error("[V2] Valores recibidos:", {
        tenantId: currentUser?.tenantId,
        portfolioId: currentUser?.portfolioId,
        subPortfolioId: currentUser?.subPortfolioId
      });
    }
  }
  onTenantChange() {
    this.selectedPortfolioId = void 0;
    this.portfolios = [];
    if (this.selectedTenantId) {
      this.loadPortfolios();
      this.reloadTypifications();
      this.loadCustomerOutputConfig();
      this.loadFirstCustomer();
    }
  }
  loadPortfolios() {
    if (!this.selectedTenantId)
      return;
    this.classificationService.getPortfoliosByTenant(this.selectedTenantId).subscribe({
      next: (data) => {
        this.portfolios = data;
      },
      error: (error) => {
        console.error("Error loading portfolios:", error);
      }
    });
  }
  onPortfolioChange() {
    this.reloadTypifications();
    this.loadCustomerOutputConfig();
  }
  reloadTypifications() {
    if (!this.selectedTenantId)
      return;
    this.apiSystemConfigService.setTenantAndPortfolio(this.selectedTenantId, this.selectedPortfolioId, this.selectedSubPortfolioId);
  }
  /**
   * Carga la configuración de outputs del cliente desde el backend
   *
   * LÓGICA:
   * 1. Llama a GET /api/v1/customer-outputs/config?tenantId=X&portfolioId=Y
   * 2. Backend SIEMPRE retorna 200 OK (nunca 404)
   * 3. Si id === null → No hay configuración guardada → Usar campos por defecto
   * 4. Si id !== null → Hay configuración guardada → Usar esos campos (incluso si fieldsConfig="[]")
   *
   * DIFERENCIA IMPORTANTE:
   * - id=null, fieldsConfig="[]": No existe config en BD → Mostrar campos DEFAULT
   * - id=123, fieldsConfig="[]": Existe config vacía → Admin configuró NO mostrar nada
   */
  loadCustomerOutputConfig() {
    if (!this.selectedTenantId)
      return;
    console.log("[TEMPORAL] loadCustomerOutputConfig - endpoint no existe, usando campos por defecto");
    this.setDefaultOutputFields();
    return;
  }
  /**
   * Carga el cliente de la llamada activa del agente
   * MODIFICADO: Ahora consulta la llamada activa y carga ese contacto dinámicamente
   */
  loadFirstCustomer() {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || !currentUser.sipExtension) {
      console.error("\u274C No se pudo obtener la extensi\xF3n SIP del agente logueado");
      this.loadClienteDetalle(475);
      return;
    }
    console.log(`\u{1F4CB} Buscando llamada activa del agente con extensi\xF3n SIP ${currentUser.sipExtension}...`);
    this.http.get(`${environment.gatewayUrl}/autodialer/active-call/extension/${currentUser.sipExtension}`).pipe(catchError((error) => {
      console.warn("\u26A0\uFE0F No hay llamada activa o error consultando:", error);
      console.log("\u{1F4CB} Usando contacto de prueba 475");
      return of({ contactId: 475 });
    })).subscribe({
      next: (activeCall) => {
        const contactId = activeCall?.contactId;
        if (!contactId) {
          console.warn("\u26A0\uFE0F No se obtuvo contactId de la llamada activa");
          return;
        }
        console.log(`\u2705 Llamada activa encontrada, contactId: ${contactId}`);
        this.loadClienteDetalle(contactId);
      }
    });
  }
  /**
   * Carga los datos del cliente desde el backend
   * MODIFICADO: Ahora usa el mismo servicio que la búsqueda manual para obtener datos completos
   */
  loadClienteDetalle(contactId) {
    console.log(`\u{1F4CB} Cargando datos del cliente para contacto ${contactId}...`);
    this.http.get(`${environment.gatewayUrl}/contacts/${contactId}/cliente-detalle`).pipe(catchError((error) => {
      console.error("\u274C Error cargando datos del cliente:", error);
      return of(null);
    })).subscribe({
      next: (clienteDetalle) => {
        if (clienteDetalle && clienteDetalle.documento) {
          console.log("\u2705 Cliente b\xE1sico cargado, documento:", clienteDetalle.documento);
          const currentUser = this.authService.getCurrentUser();
          const tenantId = currentUser?.tenantId;
          const portfolioId = currentUser?.portfolioId;
          const subPortfolioId = currentUser?.subPortfolioId;
          if (!tenantId || !portfolioId || !subPortfolioId) {
            console.error("\u274C No se pudo obtener asignaci\xF3n completa del usuario:", { tenantId, portfolioId, subPortfolioId });
            this.loadClienteDetalleFallback(clienteDetalle);
            return;
          }
          console.log(`\u{1F50D} Buscando datos completos del cliente con documento ${clienteDetalle.documento} en tenant ${tenantId}, portfolio ${portfolioId}, subportfolio ${subPortfolioId}...`);
          this.customerService.findClientByDocumento(tenantId, portfolioId, subPortfolioId, clienteDetalle.documento).subscribe({
            next: (clienteCompleto) => {
              if (clienteCompleto) {
                console.log("\u2705 Datos completos del cliente obtenidos:", clienteCompleto);
                this.loadCustomerFromDynamicTable(clienteCompleto);
              } else {
                console.warn("\u26A0\uFE0F No se encontr\xF3 cliente con documento:", clienteDetalle.documento);
                this.loadClienteDetalleFallback(clienteDetalle);
              }
            },
            error: (error) => {
              console.error("\u274C Error buscando datos completos del cliente:", error);
              this.loadClienteDetalleFallback(clienteDetalle);
            }
          });
        } else {
          console.log("\u26A0\uFE0F No se pudieron cargar los datos del cliente");
        }
      }
    });
  }
  /**
   * Fallback: carga datos limitados del cliente cuando no se puede obtener datos completos
   * ADVERTENCIA: En este modo NO tenemos el ini_*.id, las gestiones pueden no guardarse correctamente
   * @param clienteDetalle Datos básicos del cliente
   */
  loadClienteDetalleFallback(clienteDetalle) {
    console.warn("\u26A0\uFE0F FALLBACK: No se pudo obtener datos de tabla din\xE1mica");
    console.warn("\u26A0\uFE0F Las gestiones guardadas pueden no tener el ID correcto del cliente");
    this.rawClientData.set(clienteDetalle);
    console.log("[FALLBACK] Raw client data from detalle:", clienteDetalle);
    this.loadMontoCabeceras();
    const customerId = clienteDetalle.idCliente || 0;
    console.warn("[FALLBACK] Using clienteDetalle.idCliente as customerId:", customerId, "(NOT ini_*.id)");
    this.customerData.set({
      id: customerId,
      id_cliente: `CLI-${clienteDetalle.idCliente}`,
      nombre_completo: clienteDetalle.nombreCompleto || "",
      tipo_documento: clienteDetalle.tipoDocumento || "DNI",
      numero_documento: clienteDetalle.documento || "",
      fecha_nacimiento: clienteDetalle.fechaNacimiento || "",
      edad: clienteDetalle.edad || 0,
      contacto: {
        telefono_principal: clienteDetalle.telefonoPrincipal || "",
        telefono_alternativo: clienteDetalle.telefonoSecundario || "",
        telefono_trabajo: clienteDetalle.telefonoTrabajo || "",
        email: clienteDetalle.email || "",
        direccion: clienteDetalle.direccion || ""
      },
      cuenta: {
        numero_cuenta: clienteDetalle.cuenta || "",
        tipo_producto: clienteDetalle.producto || "",
        fecha_desembolso: "",
        monto_original: 0,
        plazo_meses: 0,
        tasa_interes: 0
      },
      deuda: {
        saldo_capital: clienteDetalle.deudaCapital || 0,
        intereses_vencidos: 0,
        mora_acumulada: 0,
        gastos_cobranza: 0,
        saldo_total: clienteDetalle.deudaTotal || 0,
        dias_mora: clienteDetalle.diasMora || 0,
        fecha_ultimo_pago: "",
        monto_ultimo_pago: 0
      }
    });
    console.warn("\u26A0\uFE0F Datos del cliente cargados en modo FALLBACK, customerId:", customerId);
    this.loadActivePaymentSchedules(customerId);
  }
  /**
   * Carga los cronogramas de promesas de pago activos para un cliente
   */
  loadActivePaymentSchedules(customerId) {
    console.log(`\u{1F4C5} Cargando cronogramas activos para cliente ${customerId}...`);
    this.paymentScheduleService.getActiveSchedulesByCustomer(customerId).pipe(catchError((error) => {
      console.warn("\u26A0\uFE0F Error cargando cronogramas activos:", error);
      return of([]);
    })).subscribe({
      next: (records) => {
        console.log("\u2705 Registros de promesas cargados:", records);
        if (!records || records.length === 0) {
          this.activePaymentSchedules.set([]);
          return;
        }
        const schedules = records.map((header) => {
          const cuotasPromesa = header.cuotasPromesa || [];
          cuotasPromesa.sort((a, b) => (a.numeroCuota || 1) - (b.numeroCuota || 1));
          const totalAmount = cuotasPromesa.reduce((sum, c) => sum + (c.montoPromesa || c.monto || 0), 0);
          const pendingCuotas = cuotasPromesa.filter((c) => c.estado !== "PAGADA" && c.estado !== "PAGADO" && c.estado !== "CUMPLIDO" && c.estado !== "CANCELADA" && c.estado !== "VENCIDA");
          const nextCuota = pendingCuotas[0] || cuotasPromesa[0];
          return {
            id: header.grupoPromesaUuid || header.id,
            grupoPromesaUuid: header.grupoPromesaUuid,
            totalAmount: totalAmount || header.montoPromesa,
            numberOfInstallments: header.totalCuotas || cuotasPromesa.length,
            fechaGestion: header.fechaGestion,
            installments: cuotasPromesa.map((c) => ({
              id: c.id,
              numeroCuota: c.numeroCuota,
              monto: c.montoPromesa || c.monto,
              montoPromesa: c.montoPromesa || c.monto,
              // La fecha de pago viene de CuotaPromesa.fechaPromesa
              dueDate: c.fechaPromesa || c.fechaPago || null,
              fechaPromesa: c.fechaPromesa || c.fechaPago,
              status: c.estado || "PENDIENTE",
              montoPagadoReal: c.montoPagadoReal || 0
            })),
            nextDueDate: nextCuota?.fechaPromesa || nextCuota?.fechaPago,
            cuotasPendientes: pendingCuotas.length
          };
        });
        const activeSchedules = schedules.filter((s) => s.cuotasPendientes > 0);
        console.log("\u{1F4C5} Cronogramas transformados:", schedules);
        console.log("\u{1F4C5} Cronogramas activos (con cuotas pendientes):", activeSchedules);
        this.activePaymentSchedules.set(activeSchedules);
        if (activeSchedules.length > 0) {
          console.log(`\u{1F4C5} \xA1Cliente tiene ${activeSchedules.length} promesa(s) de pago activa(s)!`);
        }
      }
    });
  }
  /**
   * Establece campos por defecto cuando no hay configuración guardada
   */
  setDefaultOutputFields() {
    this.customerOutputFields.set([
      { id: "numero_documento", label: "DNI/Documento", field: "numero_documento", category: "personal", format: "text", highlight: true, size: "medium" },
      { id: "nombre_completo", label: "Nombre Completo", field: "nombre_completo", category: "personal", format: "text", highlight: false, size: "full" },
      { id: "telefono_principal", label: "Celular", field: "contacto.telefono_principal", category: "contact", format: "text", highlight: false, size: "medium" },
      { id: "email", label: "Email", field: "contacto.email", category: "contact", format: "text", highlight: false, size: "medium" },
      { id: "direccion", label: "Direcci\xF3n", field: "contacto.direccion", category: "contact", format: "text", highlight: false, size: "full" }
    ]);
  }
  loadManagementHistory() {
    const documento = this.customerData()?.numero_documento;
    if (!documento) {
      console.log("[HISTORIAL] No hay documento del cliente, omitiendo carga de historial");
      return;
    }
    console.log("[HISTORIAL] Cargando historial para documento:", documento);
    this.managementService.getManagementsByDocumento(documento).subscribe({
      next: (managements) => {
        console.log("[HISTORIAL] Gestiones recibidas del backend:", managements);
        console.log("[HISTORIAL] Total de gestiones:", managements.length);
        const historial = managements.map((m) => {
          const fecha = m.managementDate ? this.formatDateOnly(m.managementDate) : "-";
          const tipificacionParts = [m.level1Name, m.level2Name, m.level3Name, m.level4Name].filter(Boolean);
          const tipificacionCompleta = tipificacionParts.join(" > ") || "-";
          const canalDisplay = this.formatCanalDisplay(m.canalContacto);
          const metodoDisplay = this.formatMetodoDisplay(m.metodoContacto);
          const estadoPagoDisplay = this.formatEstadoPagoDisplay(m.estadoPago);
          const historyItem = {
            id: m.id,
            fecha,
            nombreAgente: m.nombreAgente || `Agente ${m.advisorId}`,
            tipificacionCompleta,
            telefono: m.telefonoContacto || "",
            observacion: m.observations || "",
            canal: m.canalContacto || "",
            canalDisplay,
            metodo: m.metodoContacto || "",
            metodoDisplay,
            montoPromesa: m.montoPromesa || void 0,
            estadoPago: m.estadoPago || void 0,
            estadoPagoDisplay,
            hasSchedule: m.typificationRequiresSchedule || false,
            schedule: null
          };
          if (historyItem.hasSchedule) {
            this.paymentScheduleService.getPaymentScheduleByManagementId(m.id).subscribe({
              next: (schedule) => {
                if (schedule) {
                  historyItem.schedule = schedule;
                }
              },
              error: () => {
              }
            });
          }
          return historyItem;
        });
        this.historialGestiones.set(historial);
        console.log("[HISTORIAL] Historial establecido en signal:", this.historialGestiones());
      },
      error: (error) => {
        console.error("[HISTORIAL] Error al cargar historial de gestiones:", error);
        console.error("[HISTORIAL] Detalles del error:", {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          url: error.url
        });
      }
    });
  }
  formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }
  calculateCallDuration(callDetail) {
    if (!callDetail.durationSeconds) {
      return "00:00:00";
    }
    return this.formatTime(callDetail.durationSeconds);
  }
  /**
   * Calcula la duración de la llamada en segundos desde callStartTime hasta ahora
   */
  calculateCallDurationSeconds() {
    if (!this.callStartTime)
      return 0;
    const startTime = new Date(this.callStartTime).getTime();
    const now = (/* @__PURE__ */ new Date()).getTime();
    return Math.floor((now - startTime) / 1e3);
  }
  ngOnDestroy() {
    if (this.callTimer) {
      clearInterval(this.callTimer);
    }
    if (this.isTipifying()) {
      this.isTipifying.set(false);
      this.sipService.blockIncomingCallsMode(false);
      console.log("\u{1F513} [ngOnDestroy] Desbloqueando llamadas entrantes al salir del componente");
    }
    if (this.callStateSubscription) {
      this.callStateSubscription.unsubscribe();
    }
    if (this.incomingCallSubscription) {
      this.incomingCallSubscription.unsubscribe();
    }
    if (this.outgoingCallSubscription) {
      this.outgoingCallSubscription.unsubscribe();
    }
    if (this.agentStatusSubscription) {
      this.agentStatusSubscription.unsubscribe();
    }
  }
  cancelarTipificacion() {
    console.log("\u274C Cancelando tipificaci\xF3n...");
    this.isTipifying.set(false);
    this.sipService.blockIncomingCallsMode(false);
    console.log("\u{1F513} Desbloqueando llamadas entrantes - tipificaci\xF3n cancelada");
    const currentUser = this.authService.getCurrentUser();
    const agentId = currentUser?.id || 1;
    this.agentService.changeAgentStatus(agentId, { estado: AgentState.DISPONIBLE }).subscribe({
      next: () => {
        console.log("\u2705 Estado cambiado a DISPONIBLE, navegando al agent-dashboard...");
        this.router.navigate(["/agent-dashboard"]);
      },
      error: (error) => {
        console.error("\u274C Error al cambiar estado:", error);
        this.router.navigate(["/agent-dashboard"]);
      }
    });
  }
  openScheduleDetail(managementId) {
    this.scheduleManagementId.set(managementId);
    this.showScheduleDetail.set(true);
  }
  closeScheduleDetail() {
    this.showScheduleDetail.set(false);
    this.scheduleManagementId.set(null);
  }
  // ===== MÉTODOS DE AUTORIZACIÓN PARA MONTOS PERSONALIZADOS =====
  /**
   * Detecta cuando el usuario selecciona un monto personalizado en el cronograma de pagos
   */
  onCustomAmountDetected(isCustom) {
    console.log("\u{1F510} [Authorization] Custom amount detected:", isCustom);
    this.requiresAuthorization.set(isCustom);
    if (!isCustom) {
      this.waitingForAuthorization.set(false);
      this.currentAuthorizationData = null;
    }
  }
  /**
   * Abre el modal de selección de supervisor para solicitar autorización
   */
  openSupervisorSelectionModal() {
    console.log("\u{1F4CB} [Authorization] Opening supervisor selection modal");
    const dynamicValues = this.dynamicFieldValues();
    const schema = this.dynamicFieldsSchema();
    let paymentScheduleData = null;
    if (schema && schema.fields) {
      const paymentScheduleField = schema.fields.find((f) => f.type === "payment_schedule");
      if (paymentScheduleField && dynamicValues[paymentScheduleField.id]) {
        paymentScheduleData = dynamicValues[paymentScheduleField.id];
      }
    }
    if (!paymentScheduleData) {
      alert("\u26A0\uFE0F No hay datos de cronograma de pago para autorizar");
      return;
    }
    const currentUser = this.authService.getCurrentUser();
    const selectedClassifs = this.selectedClassifications();
    const allTypifications = this.managementClassifications();
    const lastSelectedId = selectedClassifs[selectedClassifs.length - 1];
    const selectedTypification = allTypifications.find((c) => c.id.toString() === lastSelectedId);
    const nombreAgente = currentUser ? `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim() || currentUser.username : "Agente";
    this.currentAuthorizationData = {
      idTenant: this.selectedTenantId,
      idCartera: this.selectedPortfolioId,
      idSubcartera: this.selectedSubPortfolioId,
      idAgenteSolicitante: currentUser?.id || 0,
      nombreAgente,
      idSupervisor: 0,
      // Se completará cuando seleccione supervisor
      idCliente: this.customerData().id || 0,
      nombreCliente: this.customerData().nombre_completo || "",
      documentoCliente: this.customerData().numero_documento || "",
      idTipificacion: selectedTypification?.id ? Number(selectedTypification.id) : 0,
      nombreTipificacion: selectedTypification?.label || "",
      montoTotal: paymentScheduleData.montoTotal,
      numeroCuotas: paymentScheduleData.numeroCuotas,
      campoMontoOrigen: paymentScheduleData.campoMontoOrigen,
      montoBase: paymentScheduleData.montoBase,
      // Monto original del campo (antes de excepción)
      cuotas: paymentScheduleData.cuotas.map((c) => ({
        numeroCuota: c.numeroCuota,
        monto: c.monto,
        fechaPago: c.fechaPago
      })),
      observacionesAgente: this.managementForm.observaciones || "Solicitud de monto personalizado"
    };
    this.showSupervisorModal = true;
  }
  /**
   * Callback cuando el agente selecciona un supervisor
   */
  onSupervisorSelected(supervisor) {
    console.log("\u{1F464} [Authorization] Supervisor selected:", supervisor);
    this.showSupervisorModal = false;
    if (!this.currentAuthorizationData) {
      console.error("\u274C No authorization data prepared");
      return;
    }
    const solicitudCompleta = __spreadProps(__spreadValues({}, this.currentAuthorizationData), {
      idSupervisor: supervisor.idUsuario
    });
    this.autorizacionService.crearSolicitud(solicitudCompleta).subscribe({
      next: (solicitud) => {
        console.log("\u2705 [Authorization] Request created:", solicitud);
        this.waitingForAuthorization.set(true);
        alert(`\u{1F4E4} Solicitud enviada a ${supervisor.nombreCompleto}

Esperando autorizaci\xF3n...`);
      },
      error: (error) => {
        console.error("\u274C [Authorization] Error creating request:", error);
        alert("\u274C Error al enviar la solicitud de autorizaci\xF3n");
      }
    });
  }
  /**
   * Callback cuando el agente cancela la selección de supervisor
   */
  onSupervisorSelectionCancelled() {
    console.log("\u274C [Authorization] Supervisor selection cancelled");
    this.showSupervisorModal = false;
  }
  /**
   * Maneja la respuesta de autorización (aprobada o rechazada)
   */
  handleAuthorizationResponse(solicitud) {
    console.log("\u{1F4EC} [Authorization] Response received:", solicitud);
    this.waitingForAuthorization.set(false);
    if (solicitud.estado === "APROBADA") {
      alert("\u2705 \xA1Autorizaci\xF3n APROBADA!\n\nGuardando gesti\xF3n autom\xE1ticamente...");
      this.requiresAuthorization.set(false);
      this.saveManagement();
    } else if (solicitud.estado === "RECHAZADA") {
      const motivo = solicitud.comentariosSupervisor || "Sin motivo especificado";
      alert(`\u274C Autorizaci\xF3n RECHAZADA

Motivo: ${motivo}

Puede modificar los datos y volver a solicitar autorizaci\xF3n.`);
    } else if (solicitud.estado === "EXPIRADA") {
      alert("\u23F0 La solicitud de autorizaci\xF3n ha expirado.\n\nPuede volver a solicitarla seleccionando otro supervisor.");
    }
  }
  toggleCall() {
    if (this.callActive()) {
      this.endCall();
    } else {
      this.startCall();
    }
  }
  startCall() {
    this.callActive.set(true);
    this.callDuration.set(0);
    this.callStartTime = (/* @__PURE__ */ new Date()).toISOString();
    this.callTimer = window.setInterval(() => {
      this.callDuration.update((duration) => duration + 1);
    }, 1e3);
  }
  endCall(navigate = false) {
    console.log("\u{1F4F5} Finalizando llamada...");
    this.sipService.hangup();
    this.callActive.set(false);
    if (this.callTimer) {
      clearInterval(this.callTimer);
      this.callTimer = void 0;
    }
    if (navigate) {
      this.router.navigate(["/agent-dashboard"]);
    }
  }
  formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor(seconds % 3600 / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  /**
   * Formatea una fecha ISO (YYYY-MM-DD) a formato legible (DD/MM/YYYY)
   */
  formatDateOnly(dateStr) {
    if (!dateStr)
      return "-";
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  }
  /**
   * Formatea el canal de contacto para mostrar
   */
  formatCanalDisplay(canal) {
    if (!canal)
      return "-";
    const canalMap = {
      "LLAMADA_SALIENTE": "Llamada Saliente",
      "LLAMADA_ENTRANTE": "Llamada Entrante",
      "SMS": "SMS",
      "WHATSAPP": "WhatsApp",
      "EMAIL": "Email"
    };
    return canalMap[canal] || this.formatSnakeCase(canal);
  }
  /**
   * Formatea el método de contacto para mostrar
   */
  formatMetodoDisplay(metodo) {
    if (!metodo)
      return "-";
    const metodoMap = {
      "GESTION_MANUAL": "Manual",
      "GESTION_PROGRESIVO": "Progresivo",
      "GESTION_PREDICTIVO": "Predictivo",
      "GESTION_AUTOMATICA": "Autom\xE1tica"
    };
    return metodoMap[metodo] || this.formatSnakeCase(metodo);
  }
  /**
   * Formatea el estado de pago para mostrar
   */
  formatEstadoPagoDisplay(estado) {
    if (!estado)
      return "-";
    const estadoMap = {
      "PENDIENTE": "Pendiente",
      "PAGADA": "Pagada",
      "VENCIDA": "Vencida",
      "PARCIAL": "Parcial",
      "CANCELADA": "Cancelada"
    };
    return estadoMap[estado] || this.formatSnakeCase(estado);
  }
  /**
   * Convierte SNAKE_CASE a Title Case
   * Ejemplo: "LLAMADA_SALIENTE" -> "Llamada Saliente"
   */
  formatSnakeCase(value) {
    if (!value)
      return "-";
    return value.toLowerCase().split("_").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  }
  onContactResultChange() {
    this.managementForm.tipoGestion = "";
    this.managementForm.motivoNoPago = "";
  }
  onManagementTypeChange() {
  }
  showManagementType() {
    return this.managementForm.resultadoContacto === "CPC" || this.managementForm.resultadoContacto === "CTT";
  }
  usesHierarchicalClassifications() {
    const levels = this.hierarchyLevels();
    return levels.length > 0 && levels[0].length > 0;
  }
  getTypificationsForLevel(levelIndex) {
    const levels = this.hierarchyLevels();
    return levels[levelIndex] || [];
  }
  onClassificationLevelChange(levelIndex, value) {
    const newSelections = [...this.selectedClassifications()];
    newSelections[levelIndex] = value;
    this.selectedClassifications.set(newSelections.slice(0, levelIndex + 1));
    if (levelIndex === 0) {
      this.managementForm.clasificacionNivel1 = value;
      this.managementForm.clasificacionNivel2 = "";
      this.managementForm.clasificacionNivel3 = "";
    } else if (levelIndex === 1) {
      this.managementForm.clasificacionNivel2 = value;
      this.managementForm.clasificacionNivel3 = "";
    } else if (levelIndex === 2) {
      this.managementForm.clasificacionNivel3 = value;
    }
    if (value) {
      this.managementForm.tipoGestion = value;
      const numValue = Number(value);
      if (!isNaN(numValue) && numValue > 0) {
        this.loadDynamicFields(numValue);
      } else {
        this.dynamicFields.set([]);
        this.dynamicFieldValues.set({});
        this.isLeafClassification.set(false);
      }
    } else {
      const lastValid = this.selectedClassifications().filter((v) => v).pop();
      this.managementForm.tipoGestion = lastValid || "";
      this.dynamicFields.set([]);
      this.dynamicFieldValues.set({});
      this.isLeafClassification.set(false);
    }
  }
  loadDynamicFields(typificationId) {
    this.isLoadingDynamicFields.set(true);
    this.apiSystemConfigService.getClassificationFields(typificationId).subscribe({
      next: (response) => {
        this.isLeafClassification.set(response.isLeaf);
        this.dynamicFields.set(response.fields || []);
        const fieldConfigs = (response.fields || []).map((field, index) => {
          return __spreadValues({
            id: field.fieldCode,
            label: field.fieldName,
            type: field.fieldType.toLowerCase(),
            // Asegurar lowercase por compatibilidad
            required: field.isRequired || false,
            placeholder: field.description || "",
            helpText: field.description,
            displayOrder: field.displayOrder || 0,
            // Para campos select, mapear options
            options: field.options ? field.options.map((opt) => {
              if (typeof opt === "string") {
                return { value: opt, label: opt };
              }
              return { value: opt.value || opt, label: opt.label || opt };
            }) : void 0,
            min: field.validationRules?.min,
            max: field.validationRules?.max,
            minLength: field.validationRules?.minLength,
            maxLength: field.validationRules?.maxLength,
            // Para campos tipo tabla, incluir columnas
            columns: field.fieldType.toLowerCase() === "table" && field.columns ? field.columns.map((col) => ({
              id: col.id || col.fieldCode,
              label: col.label || col.fieldName,
              type: (col.type || col.fieldType).toLowerCase(),
              // Asegurar lowercase
              required: col.required || col.isRequired || false,
              // Para columnas tipo select, mapear options
              options: col.options ? col.options.map((opt) => {
                if (typeof opt === "string") {
                  return { value: opt, label: opt };
                }
                return { value: opt.value || opt, label: opt.label || opt };
              }) : void 0
            })) : void 0,
            allowAddRow: field.fieldType.toLowerCase() === "table",
            allowDeleteRow: field.fieldType.toLowerCase() === "table",
            minRows: field.minRows || 0,
            maxRows: field.maxRows
          }, field.linkedToField && { linkedToField: field.linkedToField });
        });
        const schema = {
          fields: fieldConfigs
        };
        this.dynamicFieldsSchema.set(schema);
        this.isLoadingDynamicFields.set(false);
        const paymentScheduleField = (response.fields || []).find((f) => f.fieldType.toLowerCase() === "payment_schedule");
        if (paymentScheduleField && paymentScheduleField.id) {
          this.paymentScheduleFieldId.set(paymentScheduleField.id);
          this.loadEnabledPaymentOptions(paymentScheduleField.id);
        } else {
          this.paymentScheduleFieldId.set(null);
          this.enabledPaymentOptions.set([]);
          this.hasPaymentOptionsConfig.set(false);
        }
        this.checkAndLoadPaymentSchedules();
      },
      error: (error) => {
        console.error("Error cargando campos din\xE1micos:", error);
        this.isLoadingDynamicFields.set(false);
        this.isLeafClassification.set(false);
        this.dynamicFields.set([]);
        this.dynamicFieldsSchema.set(null);
      }
    });
  }
  /**
   * Loads enabled payment options for a payment_schedule field
   * Uses getOpcionesCampo to get ALL options (to know if config exists)
   * then filters to only show enabled ones
   */
  loadEnabledPaymentOptions(fieldId) {
    console.log("[PAYMENT] Loading options for field ID:", fieldId);
    this.typificationV2Service.getOpcionesCampo(fieldId).subscribe({
      next: (allOpciones) => {
        const hasConfig = allOpciones && allOpciones.length > 0;
        this.hasPaymentOptionsConfig.set(hasConfig);
        const enabledOpciones = hasConfig ? allOpciones.filter((o) => o.estaHabilitada) : [];
        console.log("[PAYMENT] Options config exists:", hasConfig, "| Total:", allOpciones?.length || 0, "| Enabled:", enabledOpciones.length);
        this.enabledPaymentOptions.set(enabledOpciones);
      },
      error: (error) => {
        console.warn("[PAYMENT] Error loading options, showing all amounts:", error);
        this.hasPaymentOptionsConfig.set(false);
        this.enabledPaymentOptions.set([]);
      }
    });
  }
  /**
   * Checks if the current selected typification requires payment
   * and loads active schedules if needed
   */
  checkAndLoadPaymentSchedules() {
    const selected = this.selectedClassifications();
    if (selected.length === 0) {
      this.showScheduleHelper.set(false);
      return;
    }
    const lastSelectedId = selected[selected.length - 1];
    const allTypifications = this.managementClassifications();
    const currentClass = allTypifications.find((c) => c.id.toString() === lastSelectedId);
    if (currentClass && currentClass.requiere_pago) {
      console.log("[SCHEDULE] Payment typification detected:", currentClass.codigo);
      console.log("[DEBUG-SCHEDULE] Full typification object:", currentClass);
      console.log("[DEBUG-SCHEDULE] suggestsFullAmount:", currentClass.suggestsFullAmount);
      console.log("[DEBUG-SCHEDULE] allowsInstallmentSelection:", currentClass.allowsInstallmentSelection);
      console.log("[DEBUG-SCHEDULE] requiresManualAmount:", currentClass.requiresManualAmount);
      this.loadActiveSchedules();
    } else {
      this.showScheduleHelper.set(false);
      this.activeSchedules.set([]);
    }
  }
  /**
   * Loads active payment schedules for the current customer
   */
  loadActiveSchedules() {
    const documento = this.customerData()?.numero_documento;
    if (!documento) {
      console.log("[SCHEDULE] No hay documento del cliente, omitiendo carga de cronogramas");
      return;
    }
    console.log("[SCHEDULE] Loading active schedules for documento:", documento);
    this.isLoadingSchedules.set(true);
    this.managementService.getActiveSchedulesByDocumento(documento).subscribe({
      next: (schedules) => {
        console.log("[SCHEDULE] Active schedules loaded:", schedules);
        this.activeSchedules.set(schedules);
        this.showScheduleHelper.set(schedules.length > 0);
        this.isLoadingSchedules.set(false);
        if (schedules.length > 0) {
          this.suggestPaymentAmount(schedules[0]);
        }
      },
      error: (error) => {
        console.error("[SCHEDULE] Error loading schedules:", error);
        this.isLoadingSchedules.set(false);
        this.showScheduleHelper.set(false);
      }
    });
  }
  /**
   * Suggests payment amount based on next pending installment
   */
  suggestPaymentAmount(schedule) {
    if (!schedule.installments || schedule.installments.length === 0)
      return;
    const pendingInstallment = schedule.installments.filter((inst) => inst.status.status === "PENDING").sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];
    if (pendingInstallment) {
      console.log("[SCHEDULE] Suggested payment amount:", pendingInstallment.amount);
      if (!this.managementForm.montoPago) {
        this.managementForm.montoPago = pendingInstallment.amount.toFixed(2);
      }
      const currentValues = __spreadValues({}, this.dynamicFieldValues());
      if (!currentValues["monto_pagado"]) {
        currentValues["monto_pagado"] = pendingInstallment.amount;
        this.dynamicFieldValues.set(currentValues);
      }
    }
  }
  /**
   * Applies full payment from schedule
   */
  // Force recompile
  applyFullSchedulePayment() {
    const schedules = this.activeSchedules();
    if (schedules.length === 0)
      return;
    const schedule = schedules[0];
    const pendingAmount = this.calculatePendingAmount(schedule);
    console.log("[BUTTON] Pagar Todo clicked. Amount:", pendingAmount);
    const schema = this.dynamicFieldsSchema();
    const montoField = schema?.fields.find((f) => f.type === "currency" || f.id.toLowerCase().includes("monto"));
    if (montoField) {
      console.log("[BUTTON] Found monto field:", montoField.id);
      const updates = {};
      updates[montoField.id] = pendingAmount;
      const hasSaldoField = schema?.fields.some((f) => f.id === "saldo_pendiente");
      if (hasSaldoField) {
        updates.saldo_pendiente = 0;
        console.log("[BUTTON] Saldo pendiente ser\xE1 0 (pago total)");
        const currentValues = __spreadValues({}, this.dynamicFieldValues());
        currentValues[montoField.id] = pendingAmount;
        currentValues.saldo_pendiente = 0;
        this.dynamicFieldValues.set(currentValues);
      }
      this.externalFieldUpdates.set(updates);
      console.log("[BUTTON] Updated externalFieldUpdates:", updates);
      setTimeout(() => this.externalFieldUpdates.set({}), 100);
    } else {
      console.warn("[BUTTON] No se encontr\xF3 campo de monto en el schema");
    }
  }
  /**
   * Applies next installment payment
   */
  applyNextInstallmentPayment() {
    console.log("[BUTTON-PP] Usar Pr\xF3xima Cuota clicked!");
    const schedules = this.activeSchedules();
    console.log("[BUTTON-PP] Active schedules:", schedules);
    if (schedules.length === 0) {
      console.warn("[BUTTON-PP] No schedules found");
      return;
    }
    const schedule = schedules[0];
    console.log("[BUTTON-PP] Using schedule:", schedule);
    console.log("[BUTTON-PP] Schedule installments:", schedule.installments);
    const pendingInstallments = schedule.installments.filter((inst) => {
      console.log("[BUTTON-PP] Checking installment:", inst, "Status:", inst.status?.status);
      return inst.status.status === "PENDING";
    });
    console.log("[BUTTON-PP] Pending installments:", pendingInstallments);
    const pendingInstallment = pendingInstallments.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];
    console.log("[BUTTON-PP] Next pending installment:", pendingInstallment);
    if (pendingInstallment) {
      console.log("[BUTTON-PP] Usar Pr\xF3xima Cuota - Amount:", pendingInstallment.amount);
      const schema = this.dynamicFieldsSchema();
      const montoField = schema?.fields.find((f) => f.type === "currency" || f.id.toLowerCase().includes("monto"));
      if (montoField) {
        console.log("[BUTTON-PP] Found monto field:", montoField.id);
        const updates = {};
        updates[montoField.id] = pendingInstallment.amount;
        const hasSaldoField = schema?.fields.some((f) => f.id === "saldo_pendiente");
        if (hasSaldoField) {
          const totalPendiente = this.calculatePendingAmount(schedule);
          const saldoPendiente = Math.max(0, totalPendiente - pendingInstallment.amount);
          updates.saldo_pendiente = saldoPendiente;
          console.log("[BUTTON-PP] Saldo pendiente calculado:", saldoPendiente, "= Total", totalPendiente, "- Monto", pendingInstallment.amount);
          const currentValues = __spreadValues({}, this.dynamicFieldValues());
          currentValues[montoField.id] = pendingInstallment.amount;
          currentValues.saldo_pendiente = saldoPendiente;
          this.dynamicFieldValues.set(currentValues);
        }
        this.externalFieldUpdates.set(updates);
        console.log("[BUTTON-PP] Updated externalFieldUpdates:", updates);
        setTimeout(() => this.externalFieldUpdates.set({}), 100);
      } else {
        console.warn("[BUTTON-PP] No se encontr\xF3 campo de monto en el schema");
      }
    } else {
      console.warn("[BUTTON-PP] No pending installment found");
    }
  }
  /**
   * Calculates total pending amount from schedule
   */
  calculatePendingAmount(schedule) {
    console.log("[CALC] Schedule:", schedule);
    console.log("[CALC] Installments:", schedule.installments);
    const pendingInstallments = schedule.installments.filter((inst) => {
      console.log("[CALC] Installment status:", inst.status, "Status value:", inst.status?.status);
      return inst.status.status === "PENDING";
    });
    console.log("[CALC] Pending installments:", pendingInstallments);
    const total = pendingInstallments.reduce((sum, inst) => sum + inst.amount, 0);
    console.log("[CALC] Total pending amount:", total);
    return total;
  }
  /**
   * Gets pending installments from schedule
   */
  getPendingInstallments(schedule) {
    if (!schedule.installments)
      return [];
    return schedule.installments.filter((inst) => inst.status.status === "PENDING").sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }
  /**
   * Maneja cambios en los campos dinámicos del componente
   * Calcula saldo_pendiente en tiempo real para mostrar a la asesora
   * También se calcula en backend al guardar para histórico
   */
  onDynamicFieldsChange(data) {
    this.dynamicFieldValues.set(data);
    if (data.monto_pagado !== void 0 && data.monto_pagado !== null) {
      this.calculateAndUpdatePendingBalance(data.monto_pagado);
    }
  }
  /**
   * Calcula y actualiza el saldo pendiente en tiempo real
   * para que la asesora pueda informar al cliente
   * Fórmula: Saldo Pendiente = (Suma de cuotas pendientes) - (Monto Pagado)
   */
  calculateAndUpdatePendingBalance(montoPagado) {
    const schedules = this.activeSchedules();
    if (schedules.length === 0) {
      console.log("[SALDO] No hay cronogramas activos");
      return;
    }
    const schedule = schedules[0];
    const totalPendiente = this.calculatePendingAmount(schedule);
    const saldoPendiente = Math.max(0, totalPendiente - (montoPagado || 0));
    console.log("[SALDO] Total pendiente:", totalPendiente);
    console.log("[SALDO] Monto pagado:", montoPagado);
    console.log("[SALDO] Saldo pendiente calculado:", saldoPendiente);
    const schema = this.dynamicFieldsSchema();
    const hasSaldoField = schema?.fields.some((f) => f.id === "saldo_pendiente");
    if (hasSaldoField) {
      console.log("[SALDO] Actualizando campo saldo_pendiente con:", saldoPendiente);
      const updates = { saldo_pendiente: saldoPendiente };
      this.externalFieldUpdates.set(updates);
      const currentValues = __spreadValues({}, this.dynamicFieldValues());
      currentValues.saldo_pendiente = saldoPendiente;
      this.dynamicFieldValues.set(currentValues);
      setTimeout(() => this.externalFieldUpdates.set({}), 100);
    }
  }
  getDynamicLevelLabel(levelIndex) {
    if (levelIndex === 0) {
      const level1 = this.hierarchyLevels()[0] || [];
      if (level1.length === 0)
        return "Nivel 1";
      const codes = level1.map((c) => c.codigo);
      if (codes.includes("RP") || codes.includes("CSA")) {
        return "Tipo de Resultado";
      }
      return "Categor\xEDa Principal";
    }
    const parentIndex = levelIndex - 1;
    const parentId = this.selectedClassifications()[parentIndex];
    if (!parentId)
      return `Nivel ${levelIndex + 1}`;
    const parent = this.managementClassifications().find((c) => c.id == parentId);
    if (!parent)
      return `Nivel ${levelIndex + 1}`;
    if (levelIndex === 1) {
      const labelMap = {
        "RP": "Intenci\xF3n de Pago",
        "CSA": "Motivo de No Atenci\xF3n",
        "SC": "Raz\xF3n de No Contacto",
        "GA": "Tipo de Gesti\xF3n"
      };
      return labelMap[parent.codigo] || `Detalle de ${parent.label}`;
    }
    return `Detalle de ${parent.label}`;
  }
  shouldShowLevel(levelIndex) {
    if (levelIndex === 0) {
      return this.usesHierarchicalClassifications();
    }
    const previousLevel = levelIndex - 1;
    const previousValue = this.selectedClassifications()[previousLevel];
    if (!previousValue)
      return false;
    const options = this.getTypificationsForLevel(levelIndex);
    return options.length > 0;
  }
  /**
   * Formatea el nombre de un campo de la tabla ini_* para mostrarlo de forma legible
   * Convierte snake_case a Title Case y aplica traducciones comunes
   */
  formatFieldLabel(fieldName) {
    const translations = {
      "deuda_total": "Deuda Total",
      "saldo_total": "Saldo Total",
      "saldo_capital": "Saldo Capital",
      "capital": "Capital",
      "deuda_capital": "Deuda Capital",
      "intereses": "Intereses",
      "intereses_vencidos": "Intereses Vencidos",
      "mora": "Mora",
      "mora_acumulada": "Mora Acumulada",
      "deuda_mora": "Deuda Mora",
      "gastos": "Gastos",
      "gastos_cobranza": "Gastos Cobranza",
      "monto_original": "Monto Original",
      "monto_desembolso": "Monto Desembolso",
      "saldo_vencido": "Saldo Vencido",
      "cuota_vencida": "Cuota Vencida",
      "cuotas_vencidas": "Cuotas Vencidas",
      "monto_cuota": "Monto Cuota",
      "dias_mora": "D\xEDas Mora",
      "monto_minimo": "Monto M\xEDnimo",
      "monto_total": "Monto Total",
      "deuda": "Deuda",
      "saldo": "Saldo"
    };
    const lowerField = fieldName.toLowerCase();
    if (translations[lowerField]) {
      return translations[lowerField];
    }
    return fieldName.split("_").map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");
  }
  /**
   * Formatea un valor numérico como moneda (Soles)
   */
  formatCurrency(value) {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN"
    }).format(value);
  }
  /**
   * Parsea una fecha string (YYYY-MM-DD) a Date en timezone local.
   * Evita el bug de timezone donde new Date("YYYY-MM-DD") interpreta como UTC.
   */
  parseDateLocal(dateString) {
    if (!dateString)
      return /* @__PURE__ */ new Date();
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  }
  /**
   * Obtiene la etiqueta del monto principal (primer campo de montos o "Deuda Total")
   */
  getPrimaryAmountLabel() {
    const fields = this.clientAmountFields();
    if (fields.length > 0) {
      const totalField = fields.find((f) => f.label.toLowerCase().includes("total") || f.field.toLowerCase().includes("total"));
      return totalField?.label || fields[0].label;
    }
    return "Deuda Total";
  }
  /**
   * Obtiene el valor del monto principal
   */
  getPrimaryAmountValue() {
    const fields = this.clientAmountFields();
    if (fields.length > 0) {
      const totalField = fields.find((f) => f.label.toLowerCase().includes("total") || f.field.toLowerCase().includes("total"));
      return totalField?.value || fields[0].value;
    }
    return this.customerData().deuda?.saldo_total || 0;
  }
  /**
   * Obtiene las clases CSS para cada fila de montos según su índice
   * Alterna entre 2 colores para mejor visualización
   */
  getAmountRowClass(index) {
    const colors = [
      "bg-red-50 !text-black dark:bg-red-950/30 dark:!text-red-300",
      "bg-white !text-black dark:bg-gray-800 dark:!text-red-400"
    ];
    return colors[index % colors.length];
  }
  showPaymentSection() {
    const selectedManagement = this.managementClassifications().find((c) => c.id === this.managementForm.tipoGestion);
    return selectedManagement?.requiere_pago || false;
  }
  showScheduleSection() {
    const selectedManagement = this.managementClassifications().find((c) => c.id === this.managementForm.tipoGestion);
    return selectedManagement?.requiere_cronograma || false;
  }
  onInstallmentCountChange() {
    const numInstallments = parseInt(this.scheduleForm.numeroCuotas);
    if (isNaN(numInstallments) || numInstallments < 1) {
      this.scheduleForm.cuotas = [];
      return;
    }
    const currentLength = this.scheduleForm.cuotas.length;
    if (numInstallments > currentLength) {
      for (let i = currentLength + 1; i <= numInstallments; i++) {
        this.scheduleForm.cuotas.push({
          numero: i,
          monto: "",
          fechaVencimiento: ""
        });
      }
    } else if (numInstallments < currentLength) {
      this.scheduleForm.cuotas = this.scheduleForm.cuotas.slice(0, numInstallments);
      this.scheduleForm.cuotas.forEach((cuota, idx) => {
        cuota.numero = idx + 1;
      });
    }
  }
  generateSchedule() {
    const numCuotas = parseInt(this.scheduleForm.numeroCuotas);
    if (isNaN(numCuotas) || numCuotas < 1) {
      alert("Por favor ingrese un n\xFAmero v\xE1lido de cuotas");
      return;
    }
    this.scheduleForm.cuotas = [];
    for (let i = 1; i <= numCuotas; i++) {
      this.scheduleForm.cuotas.push({
        numero: i,
        monto: "",
        fechaVencimiento: ""
      });
    }
  }
  addInstallmentRow() {
    const nextNumber = this.scheduleForm.cuotas.length + 1;
    this.scheduleForm.cuotas.push({
      numero: nextNumber,
      monto: "",
      fechaVencimiento: ""
    });
    this.scheduleForm.numeroCuotas = nextNumber.toString();
  }
  removeInstallmentRow(index) {
    if (this.scheduleForm.cuotas.length > 1) {
      this.scheduleForm.cuotas.splice(index, 1);
      this.scheduleForm.cuotas.forEach((cuota, idx) => {
        cuota.numero = idx + 1;
      });
      this.scheduleForm.numeroCuotas = this.scheduleForm.cuotas.length.toString();
    }
  }
  getTodayDate() {
    const today = /* @__PURE__ */ new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  loadMontoNegociadoFromOutput(fieldId) {
    const field = this.customerOutputFields().find((f) => f.id === fieldId);
    if (!field)
      return;
    const fieldPath = field.field.split(".");
    let value = this.customerData();
    for (const key of fieldPath) {
      if (value && typeof value === "object") {
        value = value[key];
      } else {
        value = null;
        break;
      }
    }
    if (value) {
      this.scheduleForm.montoNegociado = value.toString();
    }
  }
  toggleScheduleDetail() {
    this.showScheduleDetail.update((show) => !show);
  }
  saveManagement() {
    if (!this.validateForm()) {
      return;
    }
    this.saving.set(true);
    let contactClassification;
    let managementClassification;
    if (this.usesHierarchicalClassifications()) {
      const selected = this.selectedClassifications();
      const allTypifications2 = this.managementClassifications();
      const lastSelectedId = selected[selected.length - 1];
      managementClassification = allTypifications2.find((c) => c.id.toString() === lastSelectedId);
      if (managementClassification?.parentId) {
        const parentId = managementClassification.parentId;
        contactClassification = allTypifications2.find((c) => c.id.toString() === parentId.toString());
      } else {
        contactClassification = managementClassification;
      }
    } else {
      contactClassification = this.contactClassifications().find((c) => c.id === this.managementForm.resultadoContacto);
      managementClassification = this.managementClassifications().find((g) => g.id === this.managementForm.tipoGestion);
    }
    const selectedClassifs = this.selectedClassifications();
    const typificationLevel1Id = Number(selectedClassifs[0]);
    const typificationLevel2Id = selectedClassifs[1] ? Number(selectedClassifs[1]) : null;
    const typificationLevel3Id = selectedClassifs[2] ? Number(selectedClassifs[2]) : null;
    const allTypifications = this.managementClassifications();
    const level1 = allTypifications.find((c) => c.id.toString() === selectedClassifs[0]);
    const level2 = selectedClassifs[1] ? allTypifications.find((c) => c.id.toString() === selectedClassifs[1]) : null;
    const level3 = selectedClassifs[2] ? allTypifications.find((c) => c.id.toString() === selectedClassifs[2]) : null;
    const dynamicValues = this.dynamicFieldValues();
    const schema = this.dynamicFieldsSchema();
    let paymentScheduleData = null;
    console.log("[SAVE] === DEBUG PAYMENT SCHEDULE ===");
    console.log("[SAVE] dynamicValues:", dynamicValues);
    console.log("[SAVE] schema:", schema);
    console.log("[SAVE] schema.fields:", schema?.fields);
    if (schema && schema.fields) {
      const paymentScheduleField = schema.fields.find((f) => f.type === "payment_schedule");
      console.log("[SAVE] paymentScheduleField found:", paymentScheduleField);
      if (paymentScheduleField) {
        console.log("[SAVE] Looking for field id:", paymentScheduleField.id);
        console.log("[SAVE] Value in dynamicValues:", dynamicValues[paymentScheduleField.id]);
      }
      if (paymentScheduleField && dynamicValues[paymentScheduleField.id]) {
        paymentScheduleData = dynamicValues[paymentScheduleField.id];
        console.log("[SAVE] Payment schedule detected:", paymentScheduleData);
      }
    }
    console.log("[SAVE] Final paymentScheduleData:", paymentScheduleData);
    if (paymentScheduleData && paymentScheduleData.cuotas && paymentScheduleData.cuotas.length > 0) {
      const activeSchedules = this.activePaymentSchedules();
      const hasPendingInstallments = activeSchedules.some((schedule) => schedule.cuotasPendientes > 0);
      if (hasPendingInstallments) {
        this.saving.set(false);
        alert("\u26A0\uFE0F No puede registrar una nueva Promesa de Pago.\n\nEl cliente ya tiene una promesa de pago activa con cuotas pendientes.\n\nDebe esperar a que se completen o cancelen las cuotas pendientes antes de registrar una nueva promesa.");
        return;
      }
    }
    if (paymentScheduleData && paymentScheduleData.cuotas && paymentScheduleData.cuotas.length > 0) {
      const finalTypificationId = typificationLevel3Id || typificationLevel2Id || typificationLevel1Id;
      const isActiveCallSchedule = this.callActive() || !!this.callStartTime;
      const currentUserSchedule = this.authService.getCurrentUser();
      const scheduleRequest = {
        idCliente: this.customerData().id || 0,
        nombreCliente: this.customerData().nombre_completo,
        documentoCliente: this.customerData().numero_documento,
        idAgente: currentUserSchedule?.id || 1,
        idTenant: this.selectedTenantId,
        idCartera: this.selectedPortfolioId || 1,
        idSubcartera: this.selectedSubPortfolioId,
        idTipificacion: finalTypificationId,
        observaciones: this.managementForm.observaciones,
        metodoContacto: isActiveCallSchedule ? "GESTION_PROGRESIVO" : "GESTION_MANUAL",
        canalContacto: isActiveCallSchedule ? "LLAMADA_SALIENTE" : void 0,
        campoMontoOrigen: paymentScheduleData.campoMontoOrigen,
        // Campo de origen del monto (ej: sld_mora)
        montoBase: paymentScheduleData.montoBase,
        // Monto original del campo (antes de excepción). null = monto libre
        schedule: {
          montoTotal: paymentScheduleData.montoTotal,
          numeroCuotas: paymentScheduleData.numeroCuotas,
          cuotas: paymentScheduleData.cuotas.map((cuota) => ({
            numeroCuota: cuota.numeroCuota,
            monto: cuota.monto,
            fechaPago: cuota.fechaPago
          }))
        }
      };
      console.log("[SAVE] Creating payment schedule with request:", scheduleRequest);
      this.managementService.createPaymentSchedule(scheduleRequest).subscribe({
        next: (records) => {
          console.log("[SAVE] Payment schedule created successfully:", records);
          const idGestion = Array.isArray(records) && records.length > 0 ? records[0].id : records?.id;
          const debeGenerarCarta = paymentScheduleData.generaCartaAcuerdo === true;
          if (idGestion && debeGenerarCarta) {
            console.log("[CARTA] Monto seleccionado requiere carta de acuerdo, mostrando modal...");
            this.mostrarModalGenerarCarta(idGestion, contactClassification?.label || "", managementClassification?.label || "-");
          } else {
            if (idGestion && !debeGenerarCarta) {
              console.log("[CARTA] Monto seleccionado NO requiere carta de acuerdo, omitiendo modal.");
            }
            this.onSaveSuccess(contactClassification?.label || "", managementClassification?.label || "-");
          }
        },
        error: (error) => {
          console.error("Error al guardar cronograma de pago:", error);
          this.saving.set(false);
          alert("\u26A0\uFE0F Error al guardar el cronograma de pago. Por favor intente nuevamente.");
        }
      });
    } else {
      const isActiveCall = this.callActive() || !!this.callStartTime;
      const currentUser = this.authService.getCurrentUser();
      const request = {
        customerId: String(this.customerData().id),
        customerName: this.customerData().nombre_completo || "",
        customerDocument: this.customerData().numero_documento || "",
        advisorId: "ADV-001",
        // Multi-tenant fields
        tenantId: this.selectedTenantId,
        portfolioId: this.selectedPortfolioId || 1,
        subPortfolioId: 1,
        // Phone from customer data
        phone: this.customerData().contacto?.telefono_principal || "",
        // Hierarchy levels with IDs and names
        level1Id: typificationLevel1Id,
        level1Name: level1?.label || "",
        level2Id: typificationLevel2Id,
        level2Name: level2?.label || null,
        level3Id: typificationLevel3Id,
        level3Name: level3?.label || null,
        observations: this.managementForm.observaciones,
        // Campos de contexto de gestión
        metodoContacto: isActiveCall ? "GESTION_PROGRESIVO" : "GESTION_MANUAL",
        canalContacto: isActiveCall ? "LLAMADA_SALIENTE" : void 0,
        idCampana: null,
        // Se puede obtener del contexto si hay campaña activa
        idLlamada: null,
        // Se puede obtener si hay ID de llamada en el sistema
        duracionSegundos: isActiveCall && this.callStartTime ? this.calculateCallDurationSeconds() : null,
        // Información del agente y dispositivo
        nombreAgente: currentUser?.username || currentUser?.firstName || "Sistema",
        userAgent: navigator.userAgent
      };
      this.managementService.createManagement(request).subscribe({
        next: (response) => {
          if (this.callStartTime && this.callActive()) {
            this.registerCallToBackend(response.id);
          }
          const selectedCuota = this.selectedInstallmentForCancellation();
          if (this.isCancellationTypification() && selectedCuota && selectedCuota.id) {
            const montoPago = this.montoPagoEditable() || selectedCuota.monto;
            const fechaPago = this.fechaPagoEditable() || (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
            console.log("\u{1F4B0} Registrando pago:", {
              cuota: selectedCuota.numeroCuota,
              montoOriginal: selectedCuota.monto,
              montoPagado: montoPago,
              fecha: fechaPago
            });
            const schedule = this.activePaymentSchedules().find((s) => s.installments?.some((c) => c.id === selectedCuota.id));
            const grupoPromesaUuid = schedule?.grupoPromesaUuid || schedule?.id;
            if (!grupoPromesaUuid) {
              console.error("No se encontr\xF3 el grupoPromesaUuid");
              this.selectedInstallmentForCancellation.set(null);
              this.onSaveSuccess(contactClassification?.label || "", managementClassification?.label || "-");
              return;
            }
            const currentUser2 = this.authService.getCurrentUser();
            this.http.post(`${environment.apiUrl}/pagos/registrar`, {
              grupoPromesaUuid,
              monto: montoPago,
              fechaPago,
              banco: null,
              numeroOperacion: null,
              agenteId: currentUser2?.id || 1,
              metodoRegistro: "MANUAL",
              observaciones: this.managementForm.observaciones || "Pago registrado desde gesti\xF3n",
              comprobanteUrl: null
            }).subscribe({
              next: (result) => {
                console.log("\u2705 Pago registrado exitosamente:", result);
                this.selectedInstallmentForCancellation.set(null);
                this.montoPagoEditable.set(0);
                this.fechaPagoEditable.set("");
                const customerId = this.customerData().id;
                if (customerId) {
                  this.loadActivePaymentSchedules(customerId);
                }
                this.onSaveSuccess(contactClassification?.label || "", managementClassification?.label || "-");
              },
              error: (err) => {
                console.error("\u26A0\uFE0F Error registrando pago:", err);
                if (err.error?.error || err.error?.mensaje) {
                  alert(`\u26A0\uFE0F ${err.error.error || err.error.mensaje || "Error al registrar el pago."}`);
                }
                this.selectedInstallmentForCancellation.set(null);
                this.onSaveSuccess(contactClassification?.label || "", managementClassification?.label || "-");
              }
            });
          } else {
            this.onSaveSuccess(contactClassification?.label || "", managementClassification?.label || "-");
          }
        },
        error: (error) => {
          console.error("Error al guardar gesti\xF3n:", error);
          this.saving.set(false);
          alert("\u26A0\uFE0F Error al guardar la gesti\xF3n. Por favor intente nuevamente.");
        }
      });
    }
  }
  registerCallToBackend(managementId) {
    if (!this.callStartTime)
      return;
    const startCallRequest = {
      phoneNumber: this.customerData().contacto.telefono_principal,
      startTime: this.callStartTime
    };
    this.managementService.startCall(managementId, startCallRequest).subscribe({
      next: (response) => {
        if (!this.callActive()) {
          const endCallRequest = {
            endTime: (/* @__PURE__ */ new Date()).toISOString()
          };
          this.managementService.endCall(managementId, endCallRequest).subscribe({
            next: () => {
            },
            error: (err) => console.error("Error al finalizar llamada:", err)
          });
        }
      },
      error: (error) => {
        console.error("Error al registrar llamada:", error);
      }
    });
  }
  registerPaymentToBackend(managementId) {
    if (!this.managementForm.montoPago || !this.managementForm.metodoPago)
      return;
    const paymentRequest = {
      amount: parseFloat(this.managementForm.montoPago),
      scheduledDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      paymentMethodType: this.managementForm.metodoPago,
      paymentMethodDetails: this.managementForm.ultimos4Tarjeta || void 0,
      voucherNumber: void 0,
      bankName: this.managementForm.bancoSeleccionado || void 0
    };
    this.managementService.registerPayment(managementId, paymentRequest).subscribe({
      next: (response) => {
      },
      error: (error) => {
        console.error("Error al registrar pago:", error);
      }
    });
  }
  createScheduleToBackend(managementId) {
    if (this.scheduleForm.cuotas.length === 0)
      return;
    const hasInvalidInstallments = this.scheduleForm.cuotas.some((cuota) => !cuota.monto || !cuota.fechaVencimiento);
    if (hasInvalidInstallments) {
      alert("\u26A0\uFE0F Por favor complete todos los montos y fechas de las cuotas");
      return;
    }
    const scheduleRequest = {
      customerId: String(this.customerData().id),
      managementId,
      scheduleType: this.scheduleForm.tipoCronograma,
      negotiatedAmount: this.scheduleForm.montoNegociado ? parseFloat(this.scheduleForm.montoNegociado) : null,
      installments: this.scheduleForm.cuotas.map((cuota) => ({
        installmentNumber: cuota.numero,
        amount: parseFloat(cuota.monto),
        dueDate: cuota.fechaVencimiento
      }))
    };
    this.paymentScheduleService.createPaymentSchedule(scheduleRequest).subscribe({
      next: (response) => {
      },
      error: (error) => {
        console.error("Error al crear cronograma:", error);
        alert("\u26A0\uFE0F Error al crear el cronograma de pagos");
      }
    });
  }
  onSaveSuccess(resultadoCodigo, gestionCodigo) {
    this.saving.set(false);
    this.showSuccess.set(true);
    this.endCall(false);
    this.loadManagementHistory();
    this.managementForm = {
      resultadoContacto: "",
      tipoGestion: "",
      clasificacionNivel1: "",
      clasificacionNivel2: "",
      clasificacionNivel3: "",
      motivoNoPago: "",
      metodoPago: "",
      montoPago: "",
      fechaCompromiso: "",
      horaCompromiso: "",
      ultimos4Tarjeta: "",
      bancoSeleccionado: "",
      observaciones: "",
      notasPrivadas: ""
    };
    this.callDuration.set(0);
    this.callStartTime = void 0;
    this.activeTab.set("historial");
    this.isTipifying.set(false);
    this.sipService.blockIncomingCallsMode(false);
    console.log("\u2705 Desbloqueando llamadas entrantes - tipificaci\xF3n completada");
    const recordatorioEnCurso = sessionStorage.getItem("recordatorioEnCurso");
    if (recordatorioEnCurso) {
      console.log("\u{1F514} Modo recordatorio dialer activo, procesando siguiente...");
      this.procesarSiguienteRecordatorio(JSON.parse(recordatorioEnCurso));
      return;
    }
    console.log("\u2705 Gesti\xF3n guardada, cambiando estado a DISPONIBLE...");
    const currentUser = this.authService.getCurrentUser();
    const agentId = currentUser?.id || 1;
    this.agentService.changeAgentStatus(agentId, { estado: AgentState.DISPONIBLE }).subscribe({
      next: () => {
        console.log("\u2705 Estado cambiado a DISPONIBLE");
        setTimeout(() => {
          this.showSuccess.set(false);
          console.log("\u{1F504} Navegando a /agent-dashboard...");
          this.router.navigate(["/agent-dashboard"]);
        }, 2e3);
      },
      error: (err) => {
        console.error("\u274C Error cambiando estado:", err);
        setTimeout(() => {
          this.showSuccess.set(false);
          this.router.navigate(["/agent-dashboard"]);
        }, 2e3);
      }
    });
  }
  /**
   * Procesa el siguiente recordatorio después de completar la tipificación
   */
  procesarSiguienteRecordatorio(recordatorioActual) {
    const currentUser = this.authService.getCurrentUser();
    const agentId = currentUser?.id || recordatorioActual.idAgente;
    this.recordatoriosService.completarActual(agentId, "CONTESTADO").subscribe({
      next: (response) => {
        console.log("\u{1F514} Recordatorio completado:", response);
        if (response.terminado) {
          console.log("\u{1F514} Todos los recordatorios completados");
          sessionStorage.removeItem("recordatorioEnCurso");
          setTimeout(() => {
            this.showSuccess.set(false);
            this.mostrarModalRecordatoriosFinalizado(agentId);
          }, 1e3);
        } else {
          this.recordatoriosService.obtenerSiguiente(agentId).subscribe({
            next: (siguienteResp) => {
              if (siguienteResp.hayMas && siguienteResp.recordatorio) {
                console.log("\u{1F514} Siguiente recordatorio:", siguienteResp.recordatorio);
                sessionStorage.setItem("recordatorioEnCurso", JSON.stringify({
                  idCuota: siguienteResp.recordatorio.idCuota,
                  idAgente: agentId,
                  idCliente: siguienteResp.recordatorio.idCliente,
                  nombreCliente: siguienteResp.recordatorio.nombreCliente,
                  telefono: siguienteResp.recordatorio.telefono,
                  monto: siguienteResp.recordatorio.monto,
                  numeroCuota: siguienteResp.recordatorio.numeroCuota,
                  totalCuotas: siguienteResp.recordatorio.totalCuotas
                }));
                this.showSuccess.set(false);
                this.mostrarCountdownYLlamar(siguienteResp.recordatorio);
              } else {
                sessionStorage.removeItem("recordatorioEnCurso");
                this.showSuccess.set(false);
                this.mostrarModalRecordatoriosFinalizado(agentId);
              }
            },
            error: (err) => {
              console.error("Error obteniendo siguiente recordatorio:", err);
              sessionStorage.removeItem("recordatorioEnCurso");
              this.showSuccess.set(false);
              this.router.navigate(["/agent-dashboard"]);
            }
          });
        }
      },
      error: (err) => {
        console.error("Error completando recordatorio:", err);
        sessionStorage.removeItem("recordatorioEnCurso");
        this.showSuccess.set(false);
        this.router.navigate(["/agent-dashboard"]);
      }
    });
  }
  /**
   * Muestra countdown animado y luego inicia la llamada
   */
  mostrarCountdownYLlamar(recordatorio) {
    const dialogRef = this.dialog.open(RecordatoriosModalComponent, {
      width: "450px",
      disableClose: true,
      data: {
        cantidad: 0,
        pendientes: 1,
        idAgente: this.authService.getCurrentUser()?.id || 0,
        // Indicar que es un "siguiente" no un inicio
        modoSiguiente: true,
        recordatorio
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result?.action === "call" && result.recordatorio) {
        this.sipService.call(result.recordatorio.telefono);
      } else if (result?.action === "cancelled") {
        sessionStorage.removeItem("recordatorioEnCurso");
        this.router.navigate(["/agent-dashboard"]);
      }
    });
  }
  /**
   * Muestra el modal de recordatorios finalizados
   */
  mostrarModalRecordatoriosFinalizado(agentId) {
    const dialogRef = this.dialog.open(RecordatoriosModalComponent, {
      width: "450px",
      disableClose: true,
      data: {
        cantidad: 0,
        pendientes: 0,
        idAgente: agentId,
        modoFinalizado: true
      }
    });
    dialogRef.afterClosed().subscribe(() => {
      this.agentService.changeAgentStatus(agentId, { estado: AgentState.DISPONIBLE }).subscribe({
        next: () => this.router.navigate(["/agent-dashboard"]),
        error: () => this.router.navigate(["/agent-dashboard"])
      });
    });
  }
  validateForm() {
    const newErrors = {};
    if (this.usesHierarchicalClassifications()) {
      const selected = this.selectedClassifications();
      if (selected.length === 0 || !selected[selected.length - 1]) {
        newErrors["typification"] = "Debe seleccionar una clasificaci\xF3n";
      } else {
        const lastSelectedId = selected[selected.length - 1];
        const all = this.managementClassifications();
        const hasChildren = all.some((c) => c.parentId && Number(c.parentId) === Number(lastSelectedId));
        if (hasChildren) {
          newErrors["typification"] = "Debe completar todos los niveles de clasificaci\xF3n";
        }
      }
    } else {
      if (!this.managementForm.resultadoContacto) {
        newErrors["resultadoContacto"] = "Requerido";
      }
      if (this.showManagementType() && !this.managementForm.tipoGestion) {
        newErrors["tipoGestion"] = "Requerido";
      }
    }
    const schema = this.dynamicFieldsSchema();
    if (schema && schema.fields && schema.fields.length > 0) {
      const dynamicValues = this.dynamicFieldValues();
      for (const field of schema.fields) {
        if (field.required) {
          const value = dynamicValues[field.id];
          if (value === void 0 || value === null || value === "") {
            newErrors[`dynamic_${field.id}`] = `${field.label} es requerido`;
          }
          if (field.type === "table" && (!Array.isArray(value) || value.length === 0)) {
            newErrors[`dynamic_${field.id}`] = `${field.label} debe tener al menos una fila`;
          }
        }
      }
    }
    this.errors.set(newErrors);
    if (Object.keys(newErrors).length > 0) {
      alert("Por favor complete todos los campos requeridos");
      return false;
    }
    return true;
  }
  calculateRemaining() {
    if (!this.managementForm.montoPago)
      return "0.00";
    const monto = parseFloat(this.managementForm.montoPago);
    const restante = this.customerData().deuda.saldo_total - monto;
    return restante.toFixed(2);
  }
  toggleDarkMode() {
    this.themeService.toggleTheme();
  }
  /**
   * Obtiene el valor de un campo del cliente usando notación de punto
   * Ejemplo: 'contactInfo.mobilePhone' → customerData.contactInfo.mobilePhone
   */
  getFieldValue(field) {
    const customer = this.customerData();
    if (!customer)
      return null;
    return field.split(".").reduce((obj, key) => obj?.[key], customer);
  }
  /**
   * Formatea un valor según su tipo
   */
  formatFieldValue(value, format) {
    if (value === null || value === void 0 || value === "") {
      return "-";
    }
    switch (format) {
      case "currency":
        return "S/ " + Number(value).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      case "number":
        return String(value);
      case "date":
        if (typeof value === "string") {
          const date = new Date(value);
          return date.toLocaleDateString("es-PE");
        }
        return String(value);
      default:
        return String(value);
    }
  }
  /**
   * Verifica si un campo es de contacto (para excluirlo de la lista principal)
   * ya que estos campos se muestran en la sección de Contacto
   */
  isContactField(fieldName) {
    const contactFields = [
      "celular",
      "telefono",
      "telefono_principal",
      "telefono_alternativo",
      "telefono_trabajo",
      "email",
      "correo",
      "direccion",
      "address"
    ];
    const lowerField = fieldName.toLowerCase();
    return contactFields.some((cf) => lowerField.includes(cf));
  }
  /**
   * Formatea una fecha para mostrar en la UI
   * Usa parseDateLocal para fechas string YYYY-MM-DD para evitar bug de timezone
   */
  formatDate(dateValue) {
    if (!dateValue)
      return "-";
    try {
      let date;
      if (typeof dateValue === "string") {
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
          date = this.parseDateLocal(dateValue);
        } else {
          date = new Date(dateValue);
        }
      } else {
        date = dateValue;
      }
      return date.toLocaleDateString("es-PE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      });
    } catch {
      return String(dateValue);
    }
  }
  /**
   * Calcula el saldo pendiente de una cuota
   * saldoPendiente = monto - montoPagadoReal
   */
  getSaldoPendienteCuota(cuota) {
    const pagado = cuota?.montoPagadoReal || 0;
    return Math.max(0, (cuota?.monto || 0) - pagado);
  }
  /**
   * Verifica si una cuota tiene pago parcial
   */
  tienePagoParcial(cuota) {
    return (cuota?.montoPagadoReal || 0) > 0;
  }
  /**
   * Muestra el detalle de un cronograma de pago
   */
  showPaymentScheduleDetail(schedule) {
    console.log("\u{1F4C5} Detalle de promesa de pago:", schedule);
    let message = `PROMESA DE PAGO

`;
    message += `Monto Total: S/ ${schedule.totalAmount?.toFixed(2) || "0.00"}
`;
    message += `N\xFAmero de Cuotas: ${schedule.numberOfInstallments}

`;
    message += `DETALLE DE CUOTAS:
`;
    if (schedule.installments && schedule.installments.length > 0) {
      for (const cuota of schedule.installments) {
        const fechaStr = cuota.dueDate ? this.formatDate(cuota.dueDate) : "-";
        let estadoStr = "\u23F3 Pendiente";
        if (cuota.status === "PAGADA" || cuota.status === "PAGADO" || cuota.status === "CUMPLIDO") {
          estadoStr = "\u2705 PAGADA";
        } else if (cuota.status === "VENCIDA" || cuota.status === "VENCIDO") {
          estadoStr = "\u26A0\uFE0F VENCIDA";
        } else if (cuota.status === "CANCELADA" || cuota.status === "CANCELADO") {
          estadoStr = "\u2717 CANCELADA";
        }
        message += `  Cuota ${cuota.numeroCuota}: S/ ${cuota.monto?.toFixed(2) || "0.00"} - ${fechaStr} - ${estadoStr}
`;
      }
    }
    alert(message);
  }
  getContactClassificationLabel(id) {
    const typification = this.contactClassifications().find((c) => c.id === id);
    if (!typification)
      return id;
    const label = typification.label || typification.codigo;
    return `[${typification.codigo}] ${label}`;
  }
  getManagementClassificationLabel(id) {
    const typification = this.managementClassifications().find((g) => g.id === id);
    if (!typification)
      return id;
    const label = typification.label || typification.codigo;
    return `[${typification.codigo}] ${label}`;
  }
  getTableRows(fieldCode) {
    const data = this.dynamicFieldValues()[fieldCode];
    if (Array.isArray(data)) {
      return data;
    }
    return [];
  }
  addTableRow(fieldCode, columns) {
    if (!Array.isArray(columns)) {
      console.error("addTableRow: columns no es un array v\xE1lido", columns);
      return;
    }
    const currentValues = __spreadValues({}, this.dynamicFieldValues());
    if (!Array.isArray(currentValues[fieldCode])) {
      currentValues[fieldCode] = [];
    }
    const newRow = this.createEmptyTableRow(columns);
    currentValues[fieldCode].push(newRow);
    this.dynamicFieldValues.set(currentValues);
  }
  removeTableRow(fieldCode, rowIndex) {
    const currentValues = __spreadValues({}, this.dynamicFieldValues());
    if (Array.isArray(currentValues[fieldCode])) {
      currentValues[fieldCode].splice(rowIndex, 1);
      this.dynamicFieldValues.set(currentValues);
    }
  }
  createEmptyTableRow(columns) {
    const row = {};
    columns.forEach((column) => {
      if (column.type === "auto-number") {
        row[column.id] = null;
      } else if (column.type === "number" || column.type === "currency") {
        row[column.id] = column.defaultValue || 0;
      } else if (column.type === "date") {
        row[column.id] = column.defaultValue || "";
      } else {
        row[column.id] = column.defaultValue || "";
      }
    });
    return row;
  }
  /**
   * Busca un cliente por documento de testing
   */
  searchByTestDocument() {
    if (!this.testDocument.trim() || !this.selectedTenantId) {
      console.warn("[TEST] Documento vac\xEDo o tenant no seleccionado");
      return;
    }
    console.log("[TEST] Buscando cliente por documento:", this.testDocument);
    this.customerService.searchCustomersByCriteria(this.selectedTenantId, "documento", this.testDocument).subscribe({
      next: (customers) => {
        if (customers && customers.length > 0) {
          console.log("[TEST] Cliente encontrado:", customers[0]);
          this.loadCustomerFromResource(customers[0]);
        } else {
          console.warn("[TEST] No se encontr\xF3 cliente con documento:", this.testDocument);
          alert("No se encontr\xF3 cliente con el documento: " + this.testDocument);
        }
      },
      error: (error) => {
        console.error("[TEST] Error buscando cliente:", error);
        alert("Error buscando cliente");
      }
    });
  }
  /**
   * Busca un cliente por teléfono de testing
   */
  searchByTestPhone() {
    if (!this.testPhone.trim() || !this.selectedTenantId) {
      console.warn("[TEST] Tel\xE9fono vac\xEDo o tenant no seleccionado");
      return;
    }
    console.log("[TEST] Buscando cliente por tel\xE9fono:", this.testPhone);
    this.customerService.searchCustomersByCriteria(this.selectedTenantId, "telefono", this.testPhone).subscribe({
      next: (customers) => {
        if (customers && customers.length > 0) {
          console.log("[TEST] Cliente encontrado:", customers[0]);
          this.loadCustomerFromResource(customers[0]);
        } else {
          console.warn("[TEST] No se encontr\xF3 cliente con tel\xE9fono:", this.testPhone);
          alert("No se encontr\xF3 cliente con el tel\xE9fono: " + this.testPhone);
        }
      },
      error: (error) => {
        console.error("[TEST] Error buscando cliente:", error);
        alert("Error buscando cliente");
      }
    });
  }
  /**
   * Carga un cliente desde un CustomerResource
   * Similar a loadFirstCustomer pero reutilizable
   */
  loadCustomerFromResource(customer) {
    console.log("[TEST] Cargando cliente:", customer);
    this.rawClientData.set(customer);
    console.log("[PAYMENT] Raw client data from resource:", customer);
    this.loadMontoCabeceras();
    this.customerData.set({
      id: customer.id,
      id_cliente: customer.documentNumber || customer.identificationCode,
      nombre_completo: customer.fullName || "",
      tipo_documento: customer.documentType || "DNI",
      numero_documento: customer.documentNumber || "",
      fecha_nacimiento: customer.birthDate || "",
      edad: customer.age || null,
      contacto: {
        telefono_principal: customer.contactMethods?.find((cm) => cm.subtype === "telefono_principal")?.value || "",
        telefono_alternativo: customer.contactMethods?.find((cm) => cm.subtype === "telefono_secundario")?.value || "",
        telefono_trabajo: customer.contactMethods?.find((cm) => cm.subtype === "telefono_trabajo")?.value || "",
        email: customer.contactMethods?.find((cm) => cm.contactType === "email")?.value || "",
        direccion: customer.address || ""
      },
      cuenta: {
        numero_cuenta: customer.accountNumber || "",
        tipo_producto: "PR\xC9STAMO",
        fecha_desembolso: "2024-01-15",
        monto_original: customer.principalAmount || 0,
        plazo_meses: 12,
        tasa_interes: 2.5
      },
      deuda: {
        saldo_capital: customer.principalAmount || 0,
        intereses_vencidos: 0,
        mora_acumulada: customer.overdueAmount || 0,
        gastos_cobranza: 0,
        saldo_total: (customer.principalAmount || 0) + (customer.overdueAmount || 0),
        dias_mora: customer.overdueDays || 0,
        fecha_ultimo_pago: "",
        monto_ultimo_pago: 0
      }
    });
    this.loadManagementHistory();
    if (customer.id) {
      this.loadActivePaymentSchedules(customer.id);
    }
    console.log("[TEST] Cliente cargado exitosamente");
  }
  // ============================================
  // MÉTODOS DE CONTROL DE LLAMADA (SIP)
  // ============================================
  /**
   * Colgar llamada activa
   */
  hangupCall() {
    console.log("\u{1F4F5} Colgando llamada...");
    this.sipService.hangup();
  }
  /**
   * Alternar mutear/desmutear
   */
  toggleMute() {
    if (this.isMuted()) {
      console.log("\u{1F50A} Desmuteando...");
      this.sipService.unmute();
      this.isMuted.set(false);
    } else {
      console.log("\u{1F507} Muteando...");
      this.sipService.mute();
      this.isMuted.set(true);
    }
  }
  /**
   * Verificar si está en llamada activa
   */
  isInActiveCall() {
    return this.callState === CallState.ACTIVE;
  }
  /**
   * Obtener texto del estado de llamada
   */
  getCallStateText() {
    switch (this.callState) {
      case CallState.IDLE:
        return "LISTO";
      case CallState.CONNECTING:
        return "CONECTANDO...";
      case CallState.RINGING:
        return "TIMBRANDO...";
      case CallState.ACTIVE:
        return "EN LLAMADA";
      case CallState.ENDED:
        return "FINALIZADA";
      default:
        return "DESCONOCIDO";
    }
  }
  /**
   * Abre el modal para subir comprobante de pago
   */
  openComprobanteUploadDialog() {
    const cuota = this.selectedInstallmentForCancellation();
    const customer = this.customerData();
    const currentUser = this.authService.getCurrentUser();
    if (!cuota || !customer) {
      console.warn("[COMPROBANTE] No hay cuota o cliente seleccionado");
      return;
    }
    const dialogData = {
      idCuota: cuota.id,
      montoEsperado: cuota.monto || 0,
      documentoEsperado: customer.numero_documento || "",
      nombreCliente: customer.nombre_completo || "",
      idAgente: currentUser?.id || 1
    };
    const dialogRef = this.dialog.open(ComprobanteUploadDialogComponent, {
      width: "1100px",
      maxWidth: "95vw",
      data: dialogData,
      disableClose: false,
      backdropClass: "comprobante-modal-backdrop",
      panelClass: "comprobante-modal-panel"
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result?.uploaded && result.response) {
        console.log("[COMPROBANTE] Comprobante subido:", result.response);
        this.uploadedComprobante.set(result.response);
        const ocrResult = result.response.ocrResult;
        if (ocrResult) {
          if (ocrResult.monto && ocrResult.monto > 0) {
            console.log("[COMPROBANTE] Actualizando monto con OCR:", ocrResult.monto);
            this.montoPagoEditable.set(ocrResult.monto);
          }
          if (ocrResult.fecha) {
            console.log("[COMPROBANTE] Actualizando fecha con OCR:", ocrResult.fecha);
            const fechaOcr = this.parseFechaOcr(ocrResult.fecha);
            if (fechaOcr) {
              this.fechaPagoEditable.set(fechaOcr);
            }
          }
        }
        if (!result.validacionesOk) {
          console.warn("[COMPROBANTE] El comprobante tiene diferencias con los datos esperados");
        }
      }
    });
  }
  /**
   * Abre el modal para registrar pago con voucher (flujo nuevo)
   * Auto-selecciona: Contacto Directo + Cancelación + Cuota más próxima
   */
  openVoucherPaymentDialog(schedule) {
    const customer = this.customerData();
    const currentUser = this.authService.getCurrentUser();
    if (!customer) {
      console.warn("[VOUCHER] No hay cliente seleccionado");
      return;
    }
    if (!schedule.installments || schedule.installments.length === 0) {
      console.warn("[VOUCHER] No hay cuotas en el cronograma");
      return;
    }
    const cuotas = schedule.installments.map((c) => ({
      id: c.id,
      numeroCuota: c.numeroCuota,
      monto: c.monto,
      dueDate: c.dueDate,
      status: c.status,
      montoPagadoReal: c.montoPagadoReal || 0
    }));
    const dialogData = {
      nombreCliente: customer.nombre_completo || "",
      documentoCliente: customer.numero_documento || "",
      idCliente: customer.id || 0,
      idAgente: currentUser?.id || 1,
      cuotas,
      grupoPromesaUuid: schedule.grupoPromesaUuid || schedule.id
    };
    const dialogRef = this.dialog.open(VoucherPaymentDialogComponent, {
      width: "1100px",
      maxWidth: "95vw",
      data: dialogData,
      disableClose: false,
      backdropClass: "voucher-modal-backdrop",
      panelClass: "voucher-modal-panel"
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result?.confirmed && result.autoSelect) {
        console.log("[VOUCHER] Pago confirmado, auto-seleccionando:", result.autoSelect);
        this.autoSelectClassification(result.autoSelect.categoriaId, result.autoSelect.detalleId);
        this.selectedInstallmentForCancellation.set(result.autoSelect.cuotaSeleccionada);
        this.managementForm.observaciones = result.autoSelect.observaciones;
        if (result.ocrResponse) {
          this.uploadedComprobante.set(result.ocrResponse);
          const ocrResult = result.ocrResponse.ocrResult;
          if (ocrResult) {
            if (ocrResult.monto && ocrResult.monto > 0) {
              console.log("[VOUCHER] Actualizando monto con OCR:", ocrResult.monto);
              this.montoPagoEditable.set(ocrResult.monto);
            } else {
              this.montoPagoEditable.set(result.autoSelect.cuotaSeleccionada.monto || 0);
            }
            if (ocrResult.fecha) {
              console.log("[VOUCHER] Actualizando fecha con OCR:", ocrResult.fecha);
              const fechaParsed = this.parseFechaOcr(ocrResult.fecha);
              if (fechaParsed) {
                this.fechaPagoEditable.set(fechaParsed);
              } else {
                this.fechaPagoEditable.set((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
              }
            } else {
              this.fechaPagoEditable.set((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
            }
          }
        }
        console.log("[VOUCHER] Formulario auto-completado. Listo para guardar.");
      }
    });
  }
  /**
   * Auto-selecciona la clasificación jerárquica por códigos o labels
   */
  autoSelectClassification(categoriaCode, detalleCode) {
    const allClassifications = this.managementClassifications();
    if (!allClassifications || allClassifications.length === 0) {
      console.warn("[VOUCHER] No hay clasificaciones disponibles");
      return;
    }
    const roots = allClassifications.filter((c) => c.hierarchyLevel === 1 || !c.parentId);
    console.log("[VOUCHER] Total clasificaciones:", allClassifications.length);
    console.log("[VOUCHER] Roots disponibles:", roots.map((r) => `${r.codigo}: ${r.label}`));
    console.log("[VOUCHER] Buscando categor\xEDa:", categoriaCode, "y detalle:", detalleCode);
    const categoria = roots.find((opt) => opt.codigo === categoriaCode || opt.codigo?.toUpperCase() === categoriaCode || opt.label?.toUpperCase().includes("CONTACTO DIRECTO") || opt.label?.toUpperCase().includes("CONTACTO_DIRECTO"));
    if (categoria) {
      this.onClassificationLevelChange(0, categoria.id);
      console.log("[VOUCHER] Categor\xEDa seleccionada:", categoria.label, "(id:", categoria.id, ")");
      setTimeout(() => {
        const children = allClassifications.filter((c) => c.parentId && Number(c.parentId) === Number(categoria.id));
        console.log("[VOUCHER] Hijos disponibles:", children.map((c) => `${c.codigo}: ${c.label}`));
        if (children.length > 0) {
          const detalle = children.find((opt) => opt.codigo === detalleCode || opt.codigo?.toUpperCase() === detalleCode || opt.label?.toUpperCase().includes("CANCELACION") || opt.label?.toUpperCase().includes("CANCELACI\xD3N"));
          if (detalle) {
            this.onClassificationLevelChange(1, detalle.id);
            console.log("[VOUCHER] Detalle seleccionado:", detalle.label, "(id:", detalle.id, ")");
          } else {
            console.warn('[VOUCHER] No se encontr\xF3 detalle "CANCELACION". Opciones:', children.map((c) => c.label));
          }
        } else {
          console.warn("[VOUCHER] No se encontraron hijos para categor\xEDa:", categoria.id);
        }
      }, 150);
    } else {
      console.warn('[VOUCHER] No se encontr\xF3 categor\xEDa "CONTACTO DIRECTO". Opciones:', roots.map((r) => r.label));
    }
  }
  /**
   * Selecciona una cuota para cancelación e inicializa los campos editables
   */
  onSelectCuotaForCancellation(cuota) {
    this.selectedInstallmentForCancellation.set(cuota);
    this.montoPagoEditable.set(cuota.monto || 0);
    this.fechaPagoEditable.set((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
  }
  /**
   * Maneja cambios en el monto del pago editable
   */
  onMontoPagoChange(event) {
    const input = event.target;
    const value = parseFloat(input.value) || 0;
    this.montoPagoEditable.set(value);
  }
  /**
   * Maneja cambios en la fecha del pago editable
   */
  onFechaPagoChange(event) {
    const input = event.target;
    this.fechaPagoEditable.set(input.value);
  }
  /**
   * Parsea la fecha del OCR a formato YYYY-MM-DD
   * Soporta formatos comunes: DD/MM/YYYY, DD-MM-YYYY, YYYY-MM-DD, DD/MM/YY
   */
  parseFechaOcr(fechaStr) {
    if (!fechaStr)
      return null;
    fechaStr = fechaStr.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(fechaStr)) {
      return fechaStr;
    }
    let match = fechaStr.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
    if (match) {
      const day = match[1].padStart(2, "0");
      const month = match[2].padStart(2, "0");
      const year = match[3];
      return `${year}-${month}-${day}`;
    }
    match = fechaStr.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2})$/);
    if (match) {
      const day = match[1].padStart(2, "0");
      const month = match[2].padStart(2, "0");
      const year = parseInt(match[3]) > 50 ? `19${match[3]}` : `20${match[3]}`;
      return `${year}-${month}-${day}`;
    }
    console.warn("[COMPROBANTE] No se pudo parsear la fecha OCR:", fechaStr);
    return null;
  }
  // ==================== CARTA DE ACUERDO ====================
  /**
   * Muestra el modal de confirmación para generar Carta de Acuerdo después de guardar promesa
   */
  mostrarModalGenerarCarta(idGestion, contactLabel, managementLabel) {
    const dialogRef = this.dialog.open(ConfirmCartaDialogComponent, {
      width: "400px",
      disableClose: true,
      data: { idGestion }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === "generate") {
        this.generarCartaYFinalizar(idGestion, contactLabel, managementLabel);
      } else {
        this.onSaveSuccess(contactLabel, managementLabel);
      }
    });
  }
  /**
   * Genera la carta de acuerdo y luego finaliza la gestión
   */
  generarCartaYFinalizar(idGestion, contactLabel, managementLabel) {
    const user = this.authService.getCurrentUser();
    if (!user) {
      alert("\u26A0\uFE0F No se puede generar la carta: usuario no encontrado");
      this.onSaveSuccess(contactLabel, managementLabel);
      return;
    }
    console.log("\u{1F4C4} Generando Carta de Acuerdo para gesti\xF3n:", idGestion);
    this.cartaAcuerdoService.generarCarta(idGestion, user.id).subscribe({
      next: (blob) => {
        this.cartaAcuerdoService.descargarPdf(blob, `carta_acuerdo_${idGestion}.pdf`);
        console.log("\u2705 Carta de Acuerdo generada exitosamente");
        alert("\u2705 Carta de Acuerdo generada exitosamente");
        this.onSaveSuccess(contactLabel, managementLabel);
      },
      error: (error) => {
        console.error("\u274C Error generando carta:", error);
        alert("\u26A0\uFE0F Error al generar la Carta de Acuerdo. La gesti\xF3n se guard\xF3 correctamente.");
        this.onSaveSuccess(contactLabel, managementLabel);
      }
    });
  }
};
_CollectionManagementPage.\u0275fac = function CollectionManagementPage_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _CollectionManagementPage)(\u0275\u0275directiveInject(SystemConfigService), \u0275\u0275directiveInject(ManagementService), \u0275\u0275directiveInject(PaymentScheduleService), \u0275\u0275directiveInject(ThemeService), \u0275\u0275directiveInject(TypificationService), \u0275\u0275directiveInject(TypificationV2Service), \u0275\u0275directiveInject(ApiSystemConfigService), \u0275\u0275directiveInject(CustomerOutputConfigService), \u0275\u0275directiveInject(CustomerService), \u0275\u0275directiveInject(Router), \u0275\u0275directiveInject(ActivatedRoute), \u0275\u0275directiveInject(HttpClient), \u0275\u0275directiveInject(SipService), \u0275\u0275directiveInject(AgentService), \u0275\u0275directiveInject(AgentStatusService), \u0275\u0275directiveInject(AuthService), \u0275\u0275directiveInject(AutorizacionService), \u0275\u0275directiveInject(RecordatoriosService), \u0275\u0275directiveInject(MatDialog), \u0275\u0275directiveInject(ComprobanteService), \u0275\u0275directiveInject(CartaAcuerdoService));
};
_CollectionManagementPage.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _CollectionManagementPage, selectors: [["app-collection-management"]], viewQuery: function CollectionManagementPage_Query(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275viewQuery(_c02, 5);
  }
  if (rf & 2) {
    let _t;
    \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.dynamicFieldRenderer = _t.first);
  }
}, decls: 85, vars: 44, consts: [["dynamicFieldRendererComponent", ""], [1, "collection-management-container", "h-[100dvh]", "flex", "flex-col", "overflow-hidden"], [1, "fixed", "top-4", "right-4", "z-50", "animate-[slideInRight_0.5s_ease-out]"], [1, "bg-gradient-to-r", "from-blue-600", "via-blue-700", "to-blue-600", "dark:from-slate-950", "dark:via-blue-950", "dark:to-slate-950", "text-white", "shadow-md", "relative", "overflow-hidden"], [1, "relative", "px-4", "py-2"], [1, "flex", "items-center", "justify-between"], [1, "flex", "items-center", "gap-2"], [1, "w-8", "h-8", "bg-blue-500/30", "dark:bg-blue-600/30", "rounded-lg", "flex", "items-center", "justify-center"], ["name", "clipboard-list", 1, "text-white", 3, "size"], [1, "text-base", "font-bold"], [1, "flex", "items-center", "gap-4"], [1, "text-right"], [1, "text-blue-200", "dark:text-blue-300", "text-[10px]"], [3, "color", "excedido", "size"], [1, "flex-1", "flex", "flex-col", "overflow-hidden"], [1, "flex-1", "flex", "overflow-hidden", "min-h-0"], [1, "w-72", "bg-white", "dark:bg-slate-900", "border-r", "border-slate-200", "dark:border-slate-800", "shadow-lg", "overflow-hidden", "flex", "flex-col", "transition-colors", "duration-300"], [1, "flex", "border-b", "border-slate-200", "dark:border-slate-800", "bg-slate-50", "dark:bg-slate-950"], [3, "class"], [1, "flex-1", "overflow-y-auto", "p-2"], [1, "space-y-2"], [1, "space-y-1"], [1, "flex-1", "overflow-y-auto", "bg-gradient-to-br", "from-gray-50", "via-slate-50", "to-blue-50", "dark:from-slate-900", "dark:via-gray-900", "dark:to-slate-900", "transition-colors", "duration-300"], [1, "p-3", "space-y-2"], [1, "font-bold", "text-gray-800", "dark:text-white", "flex", "items-center", "gap-2", "text-xs"], [1, "flex", "gap-2"], [3, "click", "disabled"], [1, "px-4", "py-1.5", "bg-gradient-to-r", "from-red-600", "to-red-700", "hover:from-red-700", "hover:to-red-800", "disabled:from-gray-400", "disabled:to-gray-500", "text-white", "dark:text-white", "disabled:text-gray-200", "rounded-lg", "font-bold", "flex", "items-center", "gap-2", "transition-all", "duration-300", "text-xs", "shadow-md", "hover:shadow-lg", 3, "click", "disabled"], [1, "bg-white", "dark:bg-gray-800", "rounded-lg", "shadow-md", "border", "border-gray-200", "dark:border-gray-700", "p-2", "hover:border-blue-300", "dark:hover:border-blue-600", "transition-colors", "duration-300"], [1, "animate-[slideInDown_0.3s_ease-out]"], [1, "bg-white", "dark:bg-gray-800", "rounded-lg", "shadow-md", "border", "border-gray-200", "dark:border-gray-700", "p-3"], [1, "bg-indigo-50", "dark:bg-indigo-950/20", "border", "border-indigo-200", "dark:border-indigo-900/50", "rounded-lg", "shadow-md", "p-3"], [1, "bg-gray-50", "dark:bg-gray-900/20", "border", "border-gray-200", "dark:border-gray-700", "rounded-lg", "shadow-md", "p-3"], [3, "schema", "externalUpdates", "selectedClassification", "customerAmounts"], [1, "bg-purple-50", "dark:bg-purple-950/20", "border", "border-purple-200", "dark:border-purple-900/50", "rounded-lg", "shadow-md", "p-3", "animate-pulse"], [1, "bg-gradient-to-r", "from-purple-50", "to-indigo-50", "dark:from-purple-950/30", "dark:to-indigo-950/30", "border-2", "border-purple-300", "dark:border-purple-700", "rounded-lg", "shadow-lg", "p-3", "space-y-2"], [1, "bg-gradient-to-br", "from-green-50", "to-emerald-50", "dark:from-green-950/30", "dark:to-emerald-950/30", "border", "border-green-200", "dark:border-green-800", "rounded-lg", "p-3", "space-y-2"], [1, "bg-gradient-to-br", "from-purple-50", "to-indigo-50", "dark:from-purple-950/30", "dark:to-indigo-950/30", "border", "border-purple-200", "dark:border-purple-800", "rounded-lg", "p-3"], [1, "flex", "gap-2", "pt-2"], [1, "flex-1", "bg-gradient-to-r", "from-amber-500", "to-orange-600", "hover:from-amber-600", "hover:to-orange-700", "disabled:from-gray-400", "disabled:to-gray-500", "text-white", "dark:text-white", "disabled:text-gray-200", "py-2", "px-4", "rounded-lg", "font-bold", "text-xs", "flex", "items-center", "justify-center", "gap-2", "transition-all", "duration-300", "shadow-lg", "hover:shadow-xl", "disabled:cursor-not-allowed", 3, "disabled"], [1, "flex-1", "bg-gradient-to-r", "from-blue-600", "to-blue-700", "hover:from-blue-700", "hover:to-blue-800", "disabled:from-gray-400", "disabled:to-gray-500", "text-white", "dark:text-white", "disabled:text-gray-200", "py-2", "px-4", "rounded-lg", "font-bold", "text-xs", "flex", "items-center", "justify-center", "gap-2", "transition-all", "duration-300", "shadow-lg", "hover:shadow-xl", "disabled:cursor-not-allowed", 3, "disabled", "title"], [1, "px-6", "bg-gradient-to-r", "from-gray-400", "to-gray-500", "hover:from-gray-500", "hover:to-gray-600", "text-white", "dark:text-white", "py-2", "rounded-lg", "font-bold", "text-xs", "flex", "items-center", "justify-center", "gap-2", "transition-all", "duration-300", "shadow-md", "hover:shadow-lg", 3, "click"], [1, "w-72", "bg-white", "dark:bg-slate-900", "border-l", "border-slate-200", "dark:border-slate-800", "shadow-lg", "overflow-hidden", "flex", "flex-col", "transition-colors", "duration-300"], [1, "p-2", "bg-red-100", "dark:bg-red-950/20"], [1, "text-center"], [1, "text-[9px]", "uppercase", "font-bold", 3, "ngClass"], [1, "text-xl", "font-black", 3, "ngClass"], [1, "text-[11px]", "font-semibold", 3, "ngClass"], [1, "p-2", "flex-1", "overflow-y-auto"], [1, "space-y-1.5"], [1, "h-44", "bg-white", "dark:bg-slate-900", "border-t", "border-slate-200", "dark:border-slate-700", "flex", "flex-col", "transition-colors", "duration-300"], [1, "px-3", "py-1.5", "bg-slate-50", "dark:bg-slate-800/50", "border-b", "border-slate-200", "dark:border-slate-700", "flex", "items-center", "justify-between"], [1, "text-sm"], [1, "text-xs", "font-bold", "text-slate-700", "dark:text-slate-200"], [1, "text-[10px]", "text-slate-500", "dark:text-slate-400"], [1, "text-[10px]", "text-blue-600", "dark:text-blue-400", "hover:underline", "flex", "items-center", "gap-1", 3, "click"], [1, "flex-1", "overflow-auto"], [1, "flex", "items-center", "justify-center", "h-full", "text-slate-400", "dark:text-slate-500", "text-xs"], [1, "w-full", "text-[10px]"], [1, "fixed", "inset-0", "z-50", "flex", "items-center", "justify-center", "p-4", "bg-black/50", "backdrop-blur-sm", "animate-fadeIn"], [3, "visibleChange", "supervisorSelected", "cancelled", "visible"], [1, "bg-gradient-to-r", "from-green-500", "to-emerald-600", "text-white", "px-6", "py-4", "rounded-lg", "shadow-2xl", "flex", "items-center", "gap-3"], [1, "font-bold"], [1, "text-sm", "opacity-90"], [3, "click"], [1, "absolute", "bottom-0", "left-0", "right-0", "h-0.5", "bg-blue-500"], [1, "text-center", "py-2", "text-slate-400", "text-[10px]"], [1, "space-y-1.5", "mt-1"], [1, "flex", "items-center", "gap-2", "p-1.5", "bg-green-50", "dark:bg-green-950/30", "rounded", "border", "border-green-200", "dark:border-green-800"], ["name", "smartphone", 1, "text-green-600", "dark:text-green-400", 3, "size"], [1, "flex-1", "min-w-0"], [1, "text-[9px]", "text-green-600", "dark:text-green-400"], [1, "text-[11px]", "font-bold", "text-green-700", "dark:text-green-300", "truncate"], [1, "flex", "items-center", "gap-2", "p-1.5", "bg-slate-50", "dark:bg-slate-800", "rounded", "border", "border-slate-200", "dark:border-slate-700"], [1, "flex", "items-center", "gap-2", "p-1.5", "bg-blue-50", "dark:bg-blue-950/30", "rounded", "border", "border-blue-200", "dark:border-blue-800"], [1, "flex", "items-center", "gap-2", "p-1.5", "bg-orange-50", "dark:bg-orange-950/30", "rounded", "border", "border-orange-200", "dark:border-orange-800"], [1, "pb-1.5", "border-b", "border-slate-100", "dark:border-slate-800"], [1, "text-[10px]", "text-slate-500", "dark:text-slate-400", "uppercase", "font-medium"], [1, "text-[12px]", "font-semibold", "text-slate-800", "dark:text-white", "break-words"], ["name", "phone", 1, "text-slate-500", "dark:text-slate-400", 3, "size"], [1, "text-[9px]", "text-slate-500", "dark:text-slate-400"], [1, "text-[11px]", "font-semibold", "text-slate-700", "dark:text-slate-300", "truncate"], ["name", "building-2", 1, "text-slate-500", "dark:text-slate-400", 3, "size"], ["name", "mail", 1, "text-blue-500", "dark:text-blue-400", 3, "size"], [1, "text-[9px]", "text-blue-500", "dark:text-blue-400"], [1, "text-[11px]", "font-semibold", "text-blue-700", "dark:text-blue-300", "truncate"], ["name", "map-pin", 1, "text-orange-500", "dark:text-orange-400", "flex-shrink-0", 3, "size"], [1, "text-[9px]", "text-orange-500", "dark:text-orange-400"], [1, "text-[11px]", "font-semibold", "text-orange-700", "dark:text-orange-300", "line-clamp-2"], [1, "text-center", "py-4"], [1, "text-[10px]", "text-gray-400"], [1, "mt-2", "px-2", "py-1", "bg-blue-500", "text-white", "text-[9px]", "rounded", 3, "click"], [1, "bg-gray-50", "dark:bg-gray-800", "border", "border-gray-200", "dark:border-gray-700", "rounded", "p-1.5"], [1, "flex", "justify-between", "items-center", "text-[9px]"], [1, "font-bold", "text-gray-600", "dark:text-gray-300"], [1, "text-gray-400"], [1, "text-[10px]", "font-semibold", "text-blue-600", "dark:text-blue-300", "mt-0.5"], [1, "text-[9px]", "text-gray-500", "dark:text-gray-400", "truncate"], [1, "text-[8px]", "text-purple-600", "dark:text-purple-400", "mt-0.5", "hover:underline"], [1, "text-[8px]", "text-purple-600", "dark:text-purple-400", "mt-0.5", "hover:underline", 3, "click"], [1, "block", "font-bold", "text-gray-800", "dark:text-white", "mb-1", "text-[11px]", "flex", "items-center", "gap-1"], [1, "w-1.5", "h-1.5", "bg-red-500", "rounded-full"], [1, "relative"], [3, "ngModelChange", "ngModel"], ["value", ""], [3, "value"], [1, "text-red-600", "text-[10px]", "mt-1", "flex", "items-center", "gap-1"], [1, "bg-gradient-to-r", "from-amber-500", "via-yellow-500", "to-orange-500", "dark:from-amber-600", "dark:via-yellow-600", "dark:to-orange-600", "text-white", "rounded-md", "shadow-md", "mb-1.5", "overflow-hidden", "border", "border-amber-400", "dark:border-amber-500"], [1, "px-3", "py-2", "bg-black/10", "flex", "items-center", "justify-between"], [1, "w-6", "h-6", "bg-white/20", "rounded", "flex", "items-center", "justify-center"], ["name", "alert-triangle", 1, "text-white", 3, "size"], [1, "font-bold", "text-xs"], [1, "text-[10px]", "opacity-80"], ["title", "Validar voucher con IA", 1, "px-2.5", "py-1", "bg-white/20", "hover:bg-white/30", "rounded", "text-[11px]", "font-semibold", "transition-all", "flex", "items-center", "gap-1", "border", "border-white/30", 3, "click"], ["name", "scan-line", 3, "size"], [1, "px-3", "py-2", "bg-black/5"], [1, "text-[10px]", "font-semibold", "mb-1.5", "opacity-90"], [1, "flex", "flex-wrap", "gap-1.5"], [1, "flex", "items-center", "gap-1.5", "text-[11px]", "bg-white/20", "rounded", "px-2", "py-1"], [1, "mt-1.5", "text-[10px]", "opacity-80"], [1, "opacity-70"], [1, "font-medium", "flex", "items-center", "gap-0.5"], ["name", "calendar", 3, "size"], [1, "bg-green-600", "text-[10px]", "px-1", "py-0.5", "rounded", "font-semibold", "flex", "items-center"], [1, "bg-amber-500", "text-[10px]", "px-1", "py-0.5", "rounded", "font-semibold"], [1, "bg-red-600", "text-[10px]", "px-1", "py-0.5", "rounded", "font-semibold", "flex", "items-center"], [1, "bg-gray-600", "text-[10px]", "px-1", "py-0.5", "rounded", "font-semibold", "flex", "items-center"], [1, "bg-blue-600", "text-[10px]", "px-1", "py-0.5", "rounded", "font-semibold", "flex", "items-center"], [1, "text-[10px]", "opacity-70"], ["name", "check", 3, "size"], ["name", "alert-triangle", 3, "size"], ["name", "x", 3, "size"], ["name", "clock", 3, "size"], [1, "font-semibold"], [1, "text-[10px]", "font-bold", "text-gray-600", "dark:text-gray-300", "uppercase", "mb-2"], [1, "flex", "flex-wrap", "gap-2"], [1, "text-red-500", "text-[9px]", "mt-1"], [1, "flex-1", "min-w-[140px]"], [1, "block", "text-[9px]", "text-gray-500", "dark:text-gray-400", "mb-0.5"], [1, "flex", "items-center", "justify-center", "gap-2", "text-indigo-600", "dark:text-indigo-400"], [1, "text-xs"], [1, "flex", "items-center", "justify-center", "gap-2", "text-gray-500", "dark:text-gray-400"], [3, "dataChange", "customAmountDetected", "schema", "externalUpdates", "selectedClassification", "customerAmounts"], [1, "flex", "items-center", "justify-center", "gap-2", "text-purple-600", "dark:text-purple-400"], [1, "text-xs", "font-semibold"], [1, "p-1.5", "bg-purple-500", "dark:bg-purple-600", "rounded"], [1, "text-xs", "font-bold", "text-purple-900", "dark:text-purple-100"], [1, "text-[9px]", "text-purple-600", "dark:text-purple-300"], [1, "bg-white", "dark:bg-gray-800", "rounded-lg", "border", "border-purple-200", "dark:border-purple-700", "p-2", "space-y-2"], [1, "text-[9px]", "px-1.5", "py-0.5", "bg-green-100", "dark:bg-green-900/30", "text-green-700", "dark:text-green-300", "rounded", "font-semibold"], [1, "text-[9px]", "font-bold", "text-gray-600", "dark:text-gray-300", "uppercase"], [1, "text-[9px]", "text-center", "text-gray-500", "dark:text-gray-400", "italic"], [1, "flex", "gap-2", "pt-1"], ["type", "button", 1, "flex-1", "px-3", "py-1.5", "bg-purple-600", "hover:bg-purple-700", "dark:bg-purple-700", "dark:hover:bg-purple-600", "text-white", "text-[10px]", "font-bold", "rounded", "transition-colors", "flex", "items-center", "justify-center", "gap-1"], ["type", "button", 1, "flex-1", "px-3", "py-1.5", "bg-indigo-600", "hover:bg-indigo-700", "dark:bg-indigo-700", "dark:hover:bg-indigo-600", "text-white", "text-[10px]", "font-bold", "rounded", "transition-colors", "flex", "items-center", "justify-center", "gap-1"], [1, "text-[9px]", "text-purple-600", "dark:text-purple-400", "bg-purple-100", "dark:bg-purple-900/20", "p-1.5", "rounded", "flex", "items-start", "gap-1"], [1, "flex", "items-center", "justify-between", "text-[10px]", "bg-gray-50", "dark:bg-gray-900", "p-1.5", "rounded"], [1, "font-semibold", "text-gray-700", "dark:text-gray-300"], [1, "text-gray-500", "dark:text-gray-400"], [1, "font-bold", "text-purple-700", "dark:text-purple-300"], ["type", "button", 1, "flex-1", "px-3", "py-1.5", "bg-purple-600", "hover:bg-purple-700", "dark:bg-purple-700", "dark:hover:bg-purple-600", "text-white", "text-[10px]", "font-bold", "rounded", "transition-colors", "flex", "items-center", "justify-center", "gap-1", 3, "click"], ["type", "button", 1, "flex-1", "px-3", "py-1.5", "bg-indigo-600", "hover:bg-indigo-700", "dark:bg-indigo-700", "dark:hover:bg-indigo-600", "text-white", "text-[10px]", "font-bold", "rounded", "transition-colors", "flex", "items-center", "justify-center", "gap-1", 3, "click"], [1, "text-lg"], [1, "text-xs", "font-bold", "text-green-900", "dark:text-green-100"], [1, "text-[9px]", "text-green-600", "dark:text-green-300"], [1, "mt-3", "pt-3", "border-t", "border-red-200", "dark:border-red-800"], [1, "text-[10px]", "text-red-600", "dark:text-red-400", "bg-red-50", "dark:bg-red-900/20", "p-2", "rounded", "flex", "items-center", "gap-1"], [1, "text-[10px]", "text-amber-600", "dark:text-amber-400", "bg-amber-50", "dark:bg-amber-900/20", "p-2", "rounded", "flex", "items-center", "gap-1"], [1, "mt-3", "pt-3", "border-t", "border-green-200", "dark:border-green-700"], [1, "flex", "items-center", "justify-between", "p-2", "rounded-lg", "cursor-pointer", "transition-all", 3, "class"], [1, "flex", "items-center", "justify-between", "p-2", "rounded-lg", "cursor-pointer", "transition-all"], [1, "flex", "items-center", "gap-3"], ["type", "radio", "name", "cuotaCancelacion", 1, "w-4", "h-4", "text-green-600", 3, "change", "value", "checked"], [1, "text-[10px]", "ml-2"], [1, "text-[9px]", "ml-1", "px-1", "py-0.5", "rounded", 3, "class"], [1, "font-bold", "text-sm"], [1, "text-[9px]", "ml-1", "px-1", "py-0.5", "rounded"], [1, "text-xs", "opacity-70", "mr-1"], [1, "flex", "items-center", "gap-2", "mb-2"], [1, "text-[10px]", "font-bold", "text-red-700", "dark:text-red-400"], [1, "flex", "items-center", "justify-between", "p-2", "rounded-lg", "bg-red-100", "dark:bg-red-900/30", "border", "border-red-300", "dark:border-red-700", "opacity-75"], [1, "text-[9px]", "text-red-600", "dark:text-red-400", "mt-2"], [1, "text-red-500", "dark:text-red-400", "text-xs"], [1, "font-bold", "text-xs", "text-red-800", "dark:text-red-300"], [1, "text-[10px]", "ml-2", "text-red-600", "dark:text-red-400"], [1, "font-bold", "text-sm", "text-red-700", "dark:text-red-400"], [1, "text-[10px]", "font-bold", "text-green-800", "dark:text-green-300"], [1, "grid", "grid-cols-2", "gap-3"], [1, "block", "text-[10px]", "font-semibold", "text-green-700", "dark:text-green-300", "mb-1"], [1, "absolute", "left-2", "top-1/2", "-translate-y-1/2", "text-xs", "text-gray-500", "dark:text-gray-400"], ["type", "number", "step", "0.01", "min", "0", 1, "w-full", "pl-7", "pr-2", "py-1.5", "text-sm", "font-semibold", "rounded-lg", "border", "border-green-300", "dark:border-green-600", "bg-white", "dark:bg-gray-800", "text-gray-900", "dark:text-white", "focus:ring-2", "focus:ring-green-500", "focus:border-green-500", 3, "input", "value"], [1, "text-[10px]", "text-green-700", "dark:text-green-300", "mt-0.5", "font-medium"], ["type", "date", 1, "w-full", "px-2", "py-1.5", "text-sm", "rounded-lg", "border", "border-green-300", "dark:border-green-600", "bg-white", "dark:bg-gray-800", "text-gray-900", "dark:text-white", "focus:ring-2", "focus:ring-green-500", "focus:border-green-500", 3, "input", "value"], [1, "text-[9px]", "text-green-600", "dark:text-green-400", "mt-0.5"], [1, "mt-2", "p-2", "rounded-lg", "text-[10px]", 3, "class"], [1, "mt-2", "p-2", "rounded-lg", "text-[10px]"], [1, "flex", "items-center", "gap-1"], ["type", "button", 1, "px-3", "py-1.5", "text-xs", "font-medium", "rounded-lg", "transition-all", 3, "click"], [1, "mt-2", "p-2", "bg-white", "dark:bg-gray-800", "rounded", "text-[10px]", "space-y-1"], [1, "text-gray-600", "dark:text-gray-400"], ["type", "button", 1, "text-red-500", "hover:text-red-700", "text-[9px]", "underline", 3, "click"], [1, "flex-1", "bg-gradient-to-r", "from-amber-500", "to-orange-600", "hover:from-amber-600", "hover:to-orange-700", "disabled:from-gray-400", "disabled:to-gray-500", "text-white", "dark:text-white", "disabled:text-gray-200", "py-2", "px-4", "rounded-lg", "font-bold", "text-xs", "flex", "items-center", "justify-center", "gap-2", "transition-all", "duration-300", "shadow-lg", "hover:shadow-xl", "disabled:cursor-not-allowed", 3, "click", "disabled"], [1, "animate-pulse"], [1, "flex-1", "bg-gradient-to-r", "from-blue-600", "to-blue-700", "hover:from-blue-700", "hover:to-blue-800", "disabled:from-gray-400", "disabled:to-gray-500", "text-white", "dark:text-white", "disabled:text-gray-200", "py-2", "px-4", "rounded-lg", "font-bold", "text-xs", "flex", "items-center", "justify-center", "gap-2", "transition-all", "duration-300", "shadow-lg", "hover:shadow-xl", "disabled:cursor-not-allowed", 3, "click", "disabled", "title"], [1, "flex", "justify-between", "items-center", "py-1", "px-2", "rounded", "text-xs", 3, "class"], [1, "flex", "justify-between", "items-center", "py-1", "px-2", "rounded", "text-xs"], [1, "truncate", "mr-2", "font-medium", 3, "ngClass"], [1, "font-bold", "whitespace-nowrap", "text-sm", 3, "ngClass"], [1, "bg-slate-100", "dark:bg-slate-800", "sticky", "top-0"], [1, "text-left", "text-slate-600", "dark:text-slate-300"], [1, "px-2", "py-1", "font-semibold"], [1, "px-2", "py-1", "font-semibold", "text-right"], [1, "px-2", "py-1", "font-semibold", "text-center"], [1, "border-b", "border-slate-100", "dark:border-slate-700/50", "hover:bg-blue-50", "dark:hover:bg-blue-900/20", "transition-colors"], [1, "px-2", "py-1.5", "text-slate-600", "dark:text-slate-300", "whitespace-nowrap"], [1, "px-2", "py-1.5", "text-slate-700", "dark:text-slate-200", "font-medium", "whitespace-nowrap", 3, "title"], [1, "px-2", "py-1.5", "max-w-[180px]"], [1, "text-blue-600", "dark:text-blue-400", "font-medium", "truncate", "block", 3, "title"], [1, "px-2", "py-1.5", "text-slate-600", "dark:text-slate-300", "font-mono", "whitespace-nowrap"], [1, "px-2", "py-1.5", "text-slate-500", "dark:text-slate-400", "max-w-[120px]", "truncate", 3, "title"], [1, "px-2", "py-1.5"], [1, "px-2", "py-1.5", "text-right", "font-mono", "whitespace-nowrap"], [1, "text-green-600", "dark:text-green-400", "font-semibold"], [1, "text-slate-400", "dark:text-slate-600"], [1, "px-2", "py-1.5", "text-center"], [1, "bg-white", "dark:bg-slate-900", "rounded-xl", "shadow-2xl", "max-w-6xl", "w-full", "max-h-[90vh]", "overflow-hidden", "flex", "flex-col", "animate-slideInUp"], [1, "bg-gradient-to-r", "from-purple-600", "to-purple-700", "dark:from-purple-700", "dark:to-purple-800", "text-white", "px-6", "py-4", "flex", "items-center", "justify-between"], [1, "text-lg", "font-bold"], ["type", "button", 1, "p-2", "hover:bg-white/20", "rounded-lg", "transition-colors", 3, "click"], [1, "flex-1", "overflow-y-auto", "p-6"], [3, "managementId"], [1, "px-6", "py-4", "bg-slate-50", "dark:bg-slate-800/50", "border-t", "border-slate-200", "dark:border-slate-700", "flex", "justify-end"], ["type", "button", 1, "px-4", "py-2", "text-sm", "font-semibold", "text-slate-700", "dark:text-slate-300", "hover:bg-slate-200", "dark:hover:bg-slate-700", "rounded-lg", "transition-colors", 3, "click"]], template: function CollectionManagementPage_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 1);
    \u0275\u0275conditionalCreate(1, CollectionManagementPage_Conditional_1_Template, 7, 0, "div", 2);
    \u0275\u0275elementStart(2, "div", 3)(3, "div", 4)(4, "div", 5)(5, "div", 6)(6, "div", 7);
    \u0275\u0275element(7, "lucide-angular", 8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "h1", 9);
    \u0275\u0275text(9, "Gesti\xF3n de Cobranza");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "div", 10)(11, "div", 11)(12, "div", 12);
    \u0275\u0275text(13, "Estado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "div");
    \u0275\u0275text(15);
    \u0275\u0275elementEnd()();
    \u0275\u0275element(16, "app-status-alarm-clock", 13);
    \u0275\u0275elementStart(17, "div");
    \u0275\u0275text(18);
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275elementStart(19, "div", 14)(20, "div", 15)(21, "div", 16)(22, "div", 17);
    \u0275\u0275repeaterCreate(23, CollectionManagementPage_For_24_Template, 3, 4, "button", 18, _forTrack04);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "div", 19)(26, "div");
    \u0275\u0275conditionalCreate(27, CollectionManagementPage_Conditional_27_Template, 16, 7, "div", 20);
    \u0275\u0275conditionalCreate(28, CollectionManagementPage_Conditional_28_Template, 3, 1, "div", 21);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(29, "div", 22)(30, "div", 23)(31, "div")(32, "div", 5)(33, "h3", 24);
    \u0275\u0275element(34, "div");
    \u0275\u0275text(35, " Control de Llamada ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(36, "div", 25)(37, "button", 26);
    \u0275\u0275listener("click", function CollectionManagementPage_Template_button_click_37_listener() {
      return ctx.toggleMute();
    });
    \u0275\u0275text(38);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(39, "button", 27);
    \u0275\u0275listener("click", function CollectionManagementPage_Template_button_click_39_listener() {
      return ctx.endCall();
    });
    \u0275\u0275text(40, " Finalizar ");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275conditionalCreate(41, CollectionManagementPage_Conditional_41_Template, 11, 4, "div", 28);
    \u0275\u0275conditionalCreate(42, CollectionManagementPage_Conditional_42_Template, 3, 0, "div", 29);
    \u0275\u0275conditionalCreate(43, CollectionManagementPage_Conditional_43_Template, 7, 1, "div", 30);
    \u0275\u0275conditionalCreate(44, CollectionManagementPage_Conditional_44_Template, 4, 0, "div", 31);
    \u0275\u0275conditionalCreate(45, CollectionManagementPage_Conditional_45_Template, 4, 0, "div", 32);
    \u0275\u0275conditionalCreate(46, CollectionManagementPage_Conditional_46_Template, 2, 4, "app-dynamic-field-renderer", 33);
    \u0275\u0275conditionalCreate(47, CollectionManagementPage_Conditional_47_Template, 4, 0, "div", 34);
    \u0275\u0275conditionalCreate(48, CollectionManagementPage_Conditional_48_Template, 11, 1, "div", 35);
    \u0275\u0275conditionalCreate(49, CollectionManagementPage_Conditional_49_Template, 14, 4, "div", 36);
    \u0275\u0275conditionalCreate(50, CollectionManagementPage_Conditional_50_Template, 14, 4, "div", 37);
    \u0275\u0275elementStart(51, "div", 38);
    \u0275\u0275conditionalCreate(52, CollectionManagementPage_Conditional_52_Template, 3, 2, "button", 39)(53, CollectionManagementPage_Conditional_53_Template, 3, 3, "button", 40);
    \u0275\u0275elementStart(54, "button", 41);
    \u0275\u0275listener("click", function CollectionManagementPage_Template_button_click_54_listener() {
      return ctx.cancelarTipificacion();
    });
    \u0275\u0275text(55, " Cancelar ");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(56, "div", 42)(57, "div", 43)(58, "div", 44)(59, "div", 45);
    \u0275\u0275text(60);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(61, "div", 46);
    \u0275\u0275text(62);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(63, "div", 47);
    \u0275\u0275text(64);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(65, "div", 48);
    \u0275\u0275conditionalCreate(66, CollectionManagementPage_Conditional_66_Template, 3, 0, "div", 49);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(67, "div", 50)(68, "div", 51)(69, "div", 6)(70, "span", 52);
    \u0275\u0275text(71, "\u{1F4CB}");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(72, "h3", 53);
    \u0275\u0275text(73, "Historial de Gestiones");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(74, "span", 54);
    \u0275\u0275text(75);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(76, "button", 55);
    \u0275\u0275listener("click", function CollectionManagementPage_Template_button_click_76_listener() {
      return ctx.loadManagementHistory();
    });
    \u0275\u0275elementStart(77, "span");
    \u0275\u0275text(78, "\u21BB");
    \u0275\u0275elementEnd();
    \u0275\u0275text(79, " Actualizar ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(80, "div", 56);
    \u0275\u0275conditionalCreate(81, CollectionManagementPage_Conditional_81_Template, 2, 0, "div", 57)(82, CollectionManagementPage_Conditional_82_Template, 24, 0, "table", 58);
    \u0275\u0275elementEnd()()();
    \u0275\u0275conditionalCreate(83, CollectionManagementPage_Conditional_83_Template, 15, 2, "div", 59);
    \u0275\u0275elementStart(84, "app-select-supervisor-modal", 60);
    \u0275\u0275twoWayListener("visibleChange", function CollectionManagementPage_Template_app_select_supervisor_modal_visibleChange_84_listener($event) {
      \u0275\u0275twoWayBindingSet(ctx.showSupervisorModal, $event) || (ctx.showSupervisorModal = $event);
      return $event;
    });
    \u0275\u0275listener("supervisorSelected", function CollectionManagementPage_Template_app_select_supervisor_modal_supervisorSelected_84_listener($event) {
      return ctx.onSupervisorSelected($event);
    })("cancelled", function CollectionManagementPage_Template_app_select_supervisor_modal_cancelled_84_listener() {
      return ctx.onSupervisorSelectionCancelled();
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx.showSuccess() ? 1 : -1);
    \u0275\u0275advance(6);
    \u0275\u0275property("size", 18);
    \u0275\u0275advance(7);
    \u0275\u0275classMap("font-semibold text-sm transition-all duration-300 " + (ctx.callActive() ? "text-green-400 animate-pulse" : ctx.isTipifying() ? "text-yellow-400" : "text-white/80"));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx.callActive() ? "\u25CF EN LLAMADA" : ctx.isTipifying() ? "\u270E TIPIFICANDO" : "\u25CB DISPONIBLE", " ");
    \u0275\u0275advance();
    \u0275\u0275property("color", ctx.colorIndicador())("excedido", ctx.excedeTiempoMaximo())("size", 22);
    \u0275\u0275advance();
    \u0275\u0275classMap("px-4 py-1.5 rounded-lg font-mono text-lg font-bold transition-all duration-300 " + (ctx.callActive() ? "bg-gradient-to-r from-red-600 to-red-700 animate-pulse shadow-lg shadow-red-500/30" : "bg-blue-800/50 dark:bg-gray-900/80"));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx.formatTime(ctx.callDuration()), " ");
    \u0275\u0275advance(5);
    \u0275\u0275repeater(ctx.tabs);
    \u0275\u0275advance(4);
    \u0275\u0275conditional(ctx.activeTab() === "cliente" ? 27 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx.activeTab() === "historial" ? 28 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275classMap("bg-white dark:bg-gray-800 rounded-lg shadow-md border p-2 transition-colors duration-300 " + (ctx.callActive() ? "border-green-400 dark:border-green-500" : "border-gray-200 dark:border-gray-700"));
    \u0275\u0275advance(3);
    \u0275\u0275classMap("p-1 rounded transition-all duration-300 " + (ctx.callActive() ? "bg-green-100 dark:bg-green-900/30 animate-pulse" : "bg-blue-100 dark:bg-blue-900/30"));
    \u0275\u0275advance(3);
    \u0275\u0275classMap("px-4 py-1.5 rounded-lg font-bold flex items-center gap-2 transition-all duration-300 text-xs shadow-md hover:shadow-lg " + (ctx.callActive() ? ctx.isMuted() ? "bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white" : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white" : "bg-gray-400 text-gray-200 cursor-not-allowed"));
    \u0275\u0275property("disabled", !ctx.callActive());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx.isMuted() ? "\u{1F507} Activar" : "\u{1F50A} Silenciar", " ");
    \u0275\u0275advance();
    \u0275\u0275property("disabled", !ctx.callActive());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(!ctx.usesHierarchicalClassifications() ? 41 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx.activePaymentSchedules() && ctx.activePaymentSchedules().length > 0 ? 42 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx.usesHierarchicalClassifications() ? 43 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx.isLoadingDynamicFields() ? 44 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx.isLoadingDynamicFields() && ctx.isLeafClassification() && ctx.dynamicFields().length === 0 ? 45 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx.isLoadingDynamicFields() && ctx.isLeafClassification() && ctx.dynamicFieldsSchema() ? 46 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx.isLoadingSchedules() ? 47 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx.isLoadingSchedules() && ctx.showScheduleHelper() && ctx.activeSchedules().length > 0 ? 48 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx.isCancellationTypification() && (ctx.pendingInstallmentsForCancellation().length > 0 || ctx.overdueInstallments().length > 0) ? 49 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx.isCancellationTypification() && ctx.selectedInstallmentForCancellation() ? 50 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx.requiresAuthorization() ? 52 : 53);
    \u0275\u0275advance(7);
    \u0275\u0275property("ngClass", ctx.themeService.isDarkMode() ? "text-red-400" : "text-red-800");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx.getPrimaryAmountLabel());
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", ctx.themeService.isDarkMode() ? "text-red-400" : "text-red-800");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx.formatCurrency(ctx.getPrimaryAmountValue()));
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", ctx.themeService.isDarkMode() ? "text-orange-400" : "text-orange-700");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("", ctx.clientDiasMora(), " d\xEDas mora");
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx.clientAmountFields().length > 0 ? 66 : -1);
    \u0275\u0275advance(9);
    \u0275\u0275textInterpolate1("(", ctx.historialGestiones().length, " registros)");
    \u0275\u0275advance(6);
    \u0275\u0275conditional(ctx.historialGestiones().length === 0 ? 81 : 82);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx.showScheduleDetail() && ctx.scheduleManagementId() ? 83 : -1);
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("visible", ctx.showSupervisorModal);
  }
}, dependencies: [
  CommonModule,
  NgClass,
  FormsModule,
  NgSelectOption,
  \u0275NgSelectMultipleOption,
  SelectControlValueAccessor,
  NgControlStatus,
  NgModel,
  LucideAngularModule,
  LucideAngularComponent,
  DynamicFieldRendererComponent,
  PaymentScheduleViewComponent,
  SelectSupervisorModalComponent,
  StatusAlarmClockComponent,
  DecimalPipe
], styles: ["\n\n@keyframes _ngcontent-%COMP%_slideInRight {\n  from {\n    transform: translateX(100%);\n    opacity: 0;\n  }\n  to {\n    transform: translateX(0);\n    opacity: 1;\n  }\n}\n@keyframes _ngcontent-%COMP%_fadeIn {\n  from {\n    opacity: 0;\n    transform: translateY(10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n@keyframes _ngcontent-%COMP%_slideInUp {\n  from {\n    opacity: 0;\n    transform: translateY(20px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n/*# sourceMappingURL=collection-management.page.css.map */"] });
var CollectionManagementPage = _CollectionManagementPage;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CollectionManagementPage, [{
    type: Component,
    args: [{ selector: "app-collection-management", standalone: true, imports: [
      CommonModule,
      FormsModule,
      LucideAngularModule,
      DynamicFieldRendererComponent,
      PaymentScheduleViewComponent,
      SelectSupervisorModalComponent,
      StatusAlarmClockComponent
    ], template: `
    <div class="collection-management-container h-[100dvh] flex flex-col overflow-hidden">
      <!-- Notificaci\xF3n de \xE9xito -->
      @if (showSuccess()) {
        <div class="fixed top-4 right-4 z-50 animate-[slideInRight_0.5s_ease-out]">
          <div class="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3">
            <div>
              <div class="font-bold">\xA1Gesti\xF3n Guardada!</div>
              <div class="text-sm opacity-90">Los datos se registraron correctamente</div>
            </div>
          </div>
        </div>
      }


      <!-- Header Principal - ULTRA COMPACTO -->
      <div class="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-600 dark:from-slate-950 dark:via-blue-950 dark:to-slate-950 text-white shadow-md relative overflow-hidden">
        <div class="relative px-4 py-2">
          <div class="flex items-center justify-between">
            <!-- Lado Izquierdo: T\xEDtulo -->
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 bg-blue-500/30 dark:bg-blue-600/30 rounded-lg flex items-center justify-center">
                <lucide-angular name="clipboard-list" [size]="18" class="text-white"></lucide-angular>
              </div>
              <h1 class="text-base font-bold">Gesti\xF3n de Cobranza</h1>
            </div>

            <!-- Lado Derecho: Estado, Indicador de Tiempo y Cron\xF3metro -->
            <div class="flex items-center gap-4">
              <div class="text-right">
                <div class="text-blue-200 dark:text-blue-300 text-[10px]">Estado</div>
                <div [class]="'font-semibold text-sm transition-all duration-300 ' + (callActive() ? 'text-green-400 animate-pulse' : isTipifying() ? 'text-yellow-400' : 'text-white/80')">
                  {{ callActive() ? '\u25CF EN LLAMADA' : isTipifying() ? '\u270E TIPIFICANDO' : '\u25CB DISPONIBLE' }}
                </div>
              </div>
              <!-- Indicador de umbral de tiempo (reloj de alarma) -->
              <app-status-alarm-clock
                [color]="colorIndicador()"
                [excedido]="excedeTiempoMaximo()"
                [size]="22">
              </app-status-alarm-clock>
              <div [class]="'px-4 py-1.5 rounded-lg font-mono text-lg font-bold transition-all duration-300 ' + (callActive() ? 'bg-gradient-to-r from-red-600 to-red-700 animate-pulse shadow-lg shadow-red-500/30' : 'bg-blue-800/50 dark:bg-gray-900/80')">
                {{ formatTime(callDuration()) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Contenido Principal - LAYOUT 3 COLUMNAS + HISTORIAL -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Upper section with 3 columns -->
        <div class="flex-1 flex overflow-hidden min-h-0">
          <!-- PANEL IZQUIERDO - Info Cliente -->
        <div class="w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden flex flex-col transition-colors duration-300">
          <!-- Tabs -->
          <div class="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
            @for (tab of tabs; track tab.id) {
              <button
                (click)="activeTab.set(tab.id)"
                [class]="'flex-1 px-2 py-1.5 text-[11px] font-semibold transition-all relative ' +
                  (activeTab() === tab.id ? 'text-blue-700 dark:text-blue-200 bg-blue-50 dark:bg-blue-950/50' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800')"
              >
                {{ tab.label }}
                @if (activeTab() === tab.id) {
                  <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>
                }
              </button>
            }
          </div>

          <!-- Contenido de tabs -->
          <div class="flex-1 overflow-y-auto p-2">
            <div>
              @if (activeTab() === 'cliente') {
                <div class="space-y-2">
                  <!-- Lista vertical de campos (excluyendo contacto que va abajo) -->
                  @for (field of customerOutputFields(); track field.id) {
                    @if (!isContactField(field.field)) {
                      <div class="pb-1.5 border-b border-slate-100 dark:border-slate-800">
                        <div class="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-medium">{{ field.label }}</div>
                        <div class="text-[12px] font-semibold text-slate-800 dark:text-white break-words">
                          {{ formatFieldValue(getFieldValue(field.field), field.format) }}
                        </div>
                      </div>
                    }
                  }
                  @if (customerOutputFields().length === 0) {
                    <div class="text-center py-2 text-slate-400 text-[10px]">
                      Sin campos configurados
                    </div>
                  }

                  <!-- Informaci\xF3n de Contacto -->
                  <div class="space-y-1.5 mt-1">
                    <!-- Tel\xE9fono Principal -->
                    <div class="flex items-center gap-2 p-1.5 bg-green-50 dark:bg-green-950/30 rounded border border-green-200 dark:border-green-800">
                      <lucide-angular name="smartphone" [size]="14" class="text-green-600 dark:text-green-400"></lucide-angular>
                      <div class="flex-1 min-w-0">
                        <div class="text-[9px] text-green-600 dark:text-green-400">Principal</div>
                        <div class="text-[11px] font-bold text-green-700 dark:text-green-300 truncate">{{ customerData().contacto.telefono_principal }}</div>
                      </div>
                    </div>
                    <!-- Tel\xE9fono Alternativo -->
                    @if (customerData().contacto.telefono_alternativo) {
                      <div class="flex items-center gap-2 p-1.5 bg-slate-50 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                        <lucide-angular name="phone" [size]="14" class="text-slate-500 dark:text-slate-400"></lucide-angular>
                        <div class="flex-1 min-w-0">
                          <div class="text-[9px] text-slate-500 dark:text-slate-400">Alternativo</div>
                          <div class="text-[11px] font-semibold text-slate-700 dark:text-slate-300 truncate">{{ customerData().contacto.telefono_alternativo }}</div>
                        </div>
                      </div>
                    }
                    <!-- Tel\xE9fono Trabajo -->
                    @if (customerData().contacto.telefono_trabajo) {
                      <div class="flex items-center gap-2 p-1.5 bg-slate-50 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                        <lucide-angular name="building-2" [size]="14" class="text-slate-500 dark:text-slate-400"></lucide-angular>
                        <div class="flex-1 min-w-0">
                          <div class="text-[9px] text-slate-500 dark:text-slate-400">Trabajo</div>
                          <div class="text-[11px] font-semibold text-slate-700 dark:text-slate-300 truncate">{{ customerData().contacto.telefono_trabajo }}</div>
                        </div>
                      </div>
                    }
                    <!-- Email -->
                    @if (customerData().contacto.email) {
                      <div class="flex items-center gap-2 p-1.5 bg-blue-50 dark:bg-blue-950/30 rounded border border-blue-200 dark:border-blue-800">
                        <lucide-angular name="mail" [size]="14" class="text-blue-500 dark:text-blue-400"></lucide-angular>
                        <div class="flex-1 min-w-0">
                          <div class="text-[9px] text-blue-500 dark:text-blue-400">Email</div>
                          <div class="text-[11px] font-semibold text-blue-700 dark:text-blue-300 truncate">{{ customerData().contacto.email }}</div>
                        </div>
                      </div>
                    }
                    <!-- Direcci\xF3n -->
                    @if (customerData().contacto.direccion) {
                      <div class="flex items-center gap-2 p-1.5 bg-orange-50 dark:bg-orange-950/30 rounded border border-orange-200 dark:border-orange-800">
                        <lucide-angular name="map-pin" [size]="14" class="text-orange-500 dark:text-orange-400 flex-shrink-0"></lucide-angular>
                        <div class="flex-1 min-w-0">
                          <div class="text-[9px] text-orange-500 dark:text-orange-400">Direcci\xF3n</div>
                          <div class="text-[11px] font-semibold text-orange-700 dark:text-orange-300 line-clamp-2">{{ customerData().contacto.direccion }}</div>
                        </div>
                      </div>
                    }
                  </div>
                </div>
              }

              @if (activeTab() === 'historial') {
                <div class="space-y-1">
                  @if (historialGestiones().length === 0) {
                    <div class="text-center py-4">
                      <p class="text-[10px] text-gray-400">Sin gestiones previas</p>
                      <button (click)="loadManagementHistory()" class="mt-2 px-2 py-1 bg-blue-500 text-white text-[9px] rounded">Recargar</button>
                    </div>
                  } @else {
                    @for (gestion of historialGestiones(); track $index) {
                      <div class="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-1.5">
                        <div class="flex justify-between items-center text-[9px]">
                          <span class="font-bold text-gray-600 dark:text-gray-300">{{ gestion.fecha }}</span>
                          <span class="text-gray-400">{{ gestion.nombreAgente }}</span>
                        </div>
                        <div class="text-[10px] font-semibold text-blue-600 dark:text-blue-300 mt-0.5">{{ gestion.tipificacionCompleta }}</div>
                        <div class="text-[9px] text-gray-500 dark:text-gray-400 truncate">{{ gestion.observacion }}</div>
                        @if (gestion.schedule) {
                          <button (click)="openScheduleDetail(gestion.id)" class="text-[8px] text-purple-600 dark:text-purple-400 mt-0.5 hover:underline">
                            Ver cronograma \u2192
                          </button>
                        }
                      </div>
                    }
                  }
                </div>
              }
            </div>
          </div>
        </div>

        <!-- Panel Central - ULTRA COMPACTO -->
        <div class="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 via-slate-50 to-blue-50 dark:from-slate-900 dark:via-gray-900 dark:to-slate-900 transition-colors duration-300">
          <div class="p-3 space-y-2">
            <!-- Control de Llamada - COMPACTO -->
            <div [class]="'bg-white dark:bg-gray-800 rounded-lg shadow-md border p-2 transition-colors duration-300 ' + (callActive() ? 'border-green-400 dark:border-green-500' : 'border-gray-200 dark:border-gray-700')">
              <div class="flex items-center justify-between">
                <h3 class="font-bold text-gray-800 dark:text-white flex items-center gap-2 text-xs">
                  <div [class]="'p-1 rounded transition-all duration-300 ' + (callActive() ? 'bg-green-100 dark:bg-green-900/30 animate-pulse' : 'bg-blue-100 dark:bg-blue-900/30')">
                  </div>
                  Control de Llamada
                </h3>
                <div class="flex gap-2">
                  <button
                    (click)="toggleMute()"
                    [disabled]="!callActive()"
                    [class]="'px-4 py-1.5 rounded-lg font-bold flex items-center gap-2 transition-all duration-300 text-xs shadow-md hover:shadow-lg ' +
                      (callActive()
                        ? (isMuted()
                          ? 'bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white'
                          : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white')
                        : 'bg-gray-400 text-gray-200 cursor-not-allowed')"
                  >
                    {{ isMuted() ? '\u{1F507} Activar' : '\u{1F50A} Silenciar' }}
                  </button>
                  <button
                    (click)="endCall()"
                    [disabled]="!callActive()"
                    class="px-4 py-1.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-400 disabled:to-gray-500 text-white dark:text-white disabled:text-gray-200 rounded-lg font-bold flex items-center gap-2 transition-all duration-300 text-xs shadow-md hover:shadow-lg"
                  >
                    Finalizar
                  </button>
                </div>
              </div>
            </div>

            @if (!usesHierarchicalClassifications()) {
            <!-- Resultado de Contacto - COMPACTO -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-2 hover:border-blue-300 dark:hover:border-blue-600 transition-colors duration-300">
              <label class="block font-bold text-gray-800 dark:text-white mb-1 text-[11px] flex items-center gap-1">
                <div class="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                Resultado de Contacto *
              </label>
              <div class="relative">
                <select
                  [(ngModel)]="managementForm.resultadoContacto"
                  (ngModelChange)="onContactResultChange()"
                  [class]="'w-full p-2 pr-8 border rounded-lg font-semibold text-gray-700 dark:text-white appearance-none cursor-pointer transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 hover:border-blue-400 dark:hover:border-blue-600 text-xs ' +
                    (errors().resultadoContacto ? 'border-red-500 bg-red-50 dark:bg-red-950/30 dark:border-red-600' : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900') + ' ' +
                    (managementForm.resultadoContacto ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-400 dark:border-blue-600' : '')"
                >
                  <option value="">-- Seleccionar resultado --</option>
                  @for (tip of contactClassifications(); track tip.id) {
                    <option [value]="tip.id">[{{ tip.codigo }}] {{ tip.label }}</option>
                  }
                </select>
              </div>
              @if (errors().resultadoContacto) {
                <div class="text-red-600 text-[10px] mt-1 flex items-center gap-1">
                  Requerido
                </div>
              }
            </div>
            }

            <!-- Alerta de Promesa de Pago Activa - Compacto -->
            @if (activePaymentSchedules() && activePaymentSchedules().length > 0) {
              <div class="animate-[slideInDown_0.3s_ease-out]">
                @for (schedule of activePaymentSchedules(); track schedule.id) {
                  <div class="bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 dark:from-amber-600 dark:via-yellow-600 dark:to-orange-600 text-white rounded-md shadow-md mb-1.5 overflow-hidden border border-amber-400 dark:border-amber-500">
                    <!-- Header -->
                    <div class="px-3 py-2 bg-black/10 flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <div class="w-6 h-6 bg-white/20 rounded flex items-center justify-center">
                          <lucide-angular name="alert-triangle" [size]="14" class="text-white"></lucide-angular>
                        </div>
                        <div>
                          <div class="font-bold text-xs">PROMESA DE PAGO ACTIVA</div>
                          <div class="text-[10px] opacity-80">No puede registrar otra promesa</div>
                        </div>
                      </div>
                      <div class="flex items-center gap-2">
                        <button
                          (click)="openVoucherPaymentDialog(schedule)"
                          class="px-2.5 py-1 bg-white/20 hover:bg-white/30 rounded text-[11px] font-semibold transition-all flex items-center gap-1 border border-white/30"
                          title="Validar voucher con IA">
                          <lucide-angular name="scan-line" [size]="12"></lucide-angular>
                          Voucher
                        </button>
                        <div class="text-right">
                          <div class="text-base font-bold">S/ {{ schedule.totalAmount?.toFixed(2) || '0.00' }}</div>
                          <div class="text-[10px] opacity-80">Total</div>
                        </div>
                      </div>
                    </div>
                    <!-- Detalle de cuotas -->
                    <div class="px-3 py-2 bg-black/5">
                      <div class="text-[10px] font-semibold mb-1.5 opacity-90">DETALLE DE CUOTAS:</div>
                      <div class="flex flex-wrap gap-1.5">
                        @for (cuota of schedule.installments; track cuota.numeroCuota) {
                          <div class="flex items-center gap-1.5 text-[11px] bg-white/20 rounded px-2 py-1">
                            <span class="font-bold">C{{ cuota.numeroCuota }}</span>
                            <span class="opacity-70">|</span>
                            @if (tienePagoParcial(cuota)) {
                              <span class="text-[10px] opacity-70">S/ {{ cuota.monto?.toFixed(2) }}</span>
                              <span class="font-bold text-xs">S/ {{ getSaldoPendienteCuota(cuota).toFixed(2) }}</span>
                            } @else {
                              <span class="font-bold text-xs">S/ {{ cuota.monto?.toFixed(2) || '0.00' }}</span>
                            }
                            <span class="opacity-70">|</span>
                            <span class="font-medium flex items-center gap-0.5">
                              <lucide-angular name="calendar" [size]="11"></lucide-angular>
                              {{ formatDate(cuota.dueDate) }}
                            </span>
                            @if (cuota.status === 'PAGADA' || cuota.status === 'PAGADO' || cuota.status === 'CUMPLIDO') {
                              <span class="bg-green-600 text-[10px] px-1 py-0.5 rounded font-semibold flex items-center"><lucide-angular name="check" [size]="10"></lucide-angular></span>
                            } @else if (cuota.status === 'PARCIAL') {
                              <span class="bg-amber-500 text-[10px] px-1 py-0.5 rounded font-semibold">Parcial</span>
                            } @else if (cuota.status === 'VENCIDA' || cuota.status === 'VENCIDO') {
                              <span class="bg-red-600 text-[10px] px-1 py-0.5 rounded font-semibold flex items-center"><lucide-angular name="alert-triangle" [size]="10"></lucide-angular></span>
                            } @else if (cuota.status === 'CANCELADA' || cuota.status === 'CANCELADO') {
                              <span class="bg-gray-600 text-[10px] px-1 py-0.5 rounded font-semibold flex items-center"><lucide-angular name="x" [size]="10"></lucide-angular></span>
                            } @else {
                              <span class="bg-blue-600 text-[10px] px-1 py-0.5 rounded font-semibold flex items-center"><lucide-angular name="clock" [size]="10"></lucide-angular></span>
                            }
                          </div>
                        }
                      </div>
                      @if (schedule.cuotasPendientes > 0 && schedule.nextDueDate) {
                        <div class="mt-1.5 text-[10px] opacity-80">
                          <span class="font-semibold">{{ schedule.cuotasPendientes }}</span> pendiente(s) \xB7 Pr\xF3x: <span class="font-semibold">{{ formatDate(schedule.nextDueDate) }}</span>
                        </div>
                      }
                    </div>
                  </div>
                }
              </div>
            }

            <!-- Tipo de Gesti\xF3n - DROPDOWNS EN L\xCDNEA -->
            @if (usesHierarchicalClassifications()) {
              <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-3">
                <div class="text-[10px] font-bold text-gray-600 dark:text-gray-300 uppercase mb-2">Clasificaci\xF3n</div>
                <div class="flex flex-wrap gap-2">
                  @for (level of hierarchyLevels(); track $index) {
                    @if (shouldShowLevel($index)) {
                      <div class="flex-1 min-w-[140px]">
                        <label class="block text-[9px] text-gray-500 dark:text-gray-400 mb-0.5">
                          {{ getDynamicLevelLabel($index) }}{{ $index === 0 ? ' *' : '' }}
                        </label>
                        <select
                          [ngModel]="selectedClassifications()[$index]"
                          (ngModelChange)="onClassificationLevelChange($index, $event)"
                          [class]="'w-full p-1.5 border rounded text-[11px] font-medium transition-all focus:outline-none focus:ring-1 focus:ring-blue-400 ' +
                            (errors().tipoGestion && $index === 0 ? 'border-red-400 bg-red-50 dark:bg-red-950/30' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-white') + ' ' +
                            (selectedClassifications()[$index] ? 'border-green-400 bg-green-50 dark:bg-green-950/30' : '')"
                        >
                          <option value="">Seleccionar...</option>
                          @for (option of level; track option.id) {
                            <option [value]="option.id">[{{ option.codigo }}] {{ option.label }}</option>
                          }
                        </select>
                      </div>
                    }
                  }
                </div>
                @if (errors().tipoGestion) {
                  <div class="text-red-500 text-[9px] mt-1">Seleccione una clasificaci\xF3n</div>
                }
              </div>
            }

            <!-- Secci\xF3n de Campos Din\xE1micos - NUEVA -->
            @if (isLoadingDynamicFields()) {
              <div class="bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/50 rounded-lg shadow-md p-3">
                <div class="flex items-center justify-center gap-2 text-indigo-600 dark:text-indigo-400">
                  <span class="text-xs">Cargando campos adicionales...</span>
                </div>
              </div>
            }
            
            @if (!isLoadingDynamicFields() && isLeafClassification() && dynamicFields().length === 0) {
              <div class="bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md p-3">
                <div class="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400">
                  <span class="text-xs">Esta clasificaci\xF3n no tiene campos adicionales configurados</span>
                </div>
              </div>
            }

            <!-- Componente de Campos Din\xE1micos -->
            @if (!isLoadingDynamicFields() && isLeafClassification() && dynamicFieldsSchema()) {
              <app-dynamic-field-renderer
                #dynamicFieldRendererComponent
                [schema]="dynamicFieldsSchema()"
                [externalUpdates]="externalFieldUpdates()"
                [selectedClassification]="selectedClassification()"
                [customerAmounts]="customerPaymentAmounts()"
                (dataChange)="onDynamicFieldsChange($event)"
                (customAmountDetected)="onCustomAmountDetected($event)"
              />
            }

            <!-- Schedule Helper - Payment Schedule Information -->
            @if (isLoadingSchedules()) {
              <div class="bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/50 rounded-lg shadow-md p-3 animate-pulse">
                <div class="flex items-center justify-center gap-2 text-purple-600 dark:text-purple-400">
                  <span class="text-xs font-semibold">Cargando cronogramas pendientes...</span>
                </div>
              </div>
            }

            @if (!isLoadingSchedules() && showScheduleHelper() && activeSchedules().length > 0) {
              <div class="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 border-2 border-purple-300 dark:border-purple-700 rounded-lg shadow-lg p-3 space-y-2">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <div class="p-1.5 bg-purple-500 dark:bg-purple-600 rounded">
                    </div>
                    <div>
                      <h4 class="text-xs font-bold text-purple-900 dark:text-purple-100">Cronograma Activo Detectado</h4>
                      <p class="text-[9px] text-purple-600 dark:text-purple-300">Cliente tiene {{ activeSchedules().length }} cronograma(s) pendiente(s)</p>
                    </div>
                  </div>
                </div>

                @for (schedule of activeSchedules(); track schedule.id) {
                  <div class="bg-white dark:bg-gray-800 rounded-lg border border-purple-200 dark:border-purple-700 p-2 space-y-2">
                    <!-- Schedule Summary -->
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <div class="text-xs font-bold text-purple-900 dark:text-purple-100">
                          {{ schedule.scheduleType || 'CRONOGRAMA' }}
                        </div>
                        <div class="text-[9px] px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded font-semibold">
                          ACTIVO
                        </div>
                      </div>
                      <div class="text-xs font-bold text-purple-900 dark:text-purple-100">
                        S/ {{ schedule.totalAmount | number:'1.2-2' }}
                      </div>
                    </div>

                    <!-- Pending Installments -->
                    <div class="space-y-1">
                      <div class="text-[9px] font-bold text-gray-600 dark:text-gray-300 uppercase">Cuotas Pendientes</div>
                      @for (installment of getPendingInstallments(schedule); track installment.id; let idx = $index) {
                        @if (idx < 3) {
                          <div class="flex items-center justify-between text-[10px] bg-gray-50 dark:bg-gray-900 p-1.5 rounded">
                            <div class="flex items-center gap-2">
                              <span class="font-semibold text-gray-700 dark:text-gray-300">Cuota #{{ installment.installmentNumber }}</span>
                              <span class="text-gray-500 dark:text-gray-400">Vence: {{ formatDate(installment.dueDate) }}</span>
                            </div>
                            <span class="font-bold text-purple-700 dark:text-purple-300">S/ {{ installment.amount | number:'1.2-2' }}</span>
                          </div>
                        }
                      }
                      @if (getPendingInstallments(schedule).length > 3) {
                        <div class="text-[9px] text-center text-gray-500 dark:text-gray-400 italic">
                          + {{ getPendingInstallments(schedule).length - 3 }} cuotas m\xE1s
                        </div>
                      }
                    </div>

                    <!-- Quick Actions -->
                    <div class="flex gap-2 pt-1">
                      <!-- Bot\xF3n Usar Pr\xF3xima Cuota - Mostrar si allowsInstallmentSelection es true -->
                      @if (selectedClassification()?.allowsInstallmentSelection === true) {
                        <button
                          type="button"
                          (click)="applyNextInstallmentPayment()"
                          class="flex-1 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 text-white text-[10px] font-bold rounded transition-colors flex items-center justify-center gap-1">
                          Usar Pr\xF3xima Cuota
                        </button>
                      }

                      <!-- Bot\xF3n Pagar Todo - Mostrar si suggestsFullAmount es true -->
                      @if (selectedClassification()?.suggestsFullAmount === true) {
                        <button
                          type="button"
                          (click)="applyFullSchedulePayment()"
                          class="flex-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 text-white text-[10px] font-bold rounded transition-colors flex items-center justify-center gap-1">
                          Pagar Todo (S/ {{ calculatePendingAmount(schedule) | number:'1.2-2' }})
                        </button>
                      }
                    </div>

                    <!-- Info Note -->
                    <div class="text-[9px] text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/20 p-1.5 rounded flex items-start gap-1">
                      <span>El pago se aplicar\xE1 autom\xE1ticamente a las cuotas pendientes en orden de vencimiento</span>
                    </div>
                  </div>
                }
              </div>
            }

            <!-- Selector de Cuota para Cancelaci\xF3n -->
            @if (isCancellationTypification() && (pendingInstallmentsForCancellation().length > 0 || overdueInstallments().length > 0)) {
              <div class="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-800 rounded-lg p-3 space-y-2">
                <div class="flex items-center gap-2">
                  <span class="text-lg">\u{1F4B0}</span>
                  <div>
                    <h4 class="text-xs font-bold text-green-900 dark:text-green-100">Seleccionar Cuota a Cancelar</h4>
                    <p class="text-[9px] text-green-600 dark:text-green-300">Elija qu\xE9 cuota de la promesa de pago est\xE1 cancelando</p>
                  </div>
                </div>

                <!-- Cuotas disponibles para cancelar -->
                @if (pendingInstallmentsForCancellation().length > 0) {
                  <div class="space-y-1.5">
                    @for (cuota of pendingInstallmentsForCancellation(); track cuota.numeroCuota) {
                      <label
                        class="flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all"
                        [class]="selectedInstallmentForCancellation()?.numeroCuota === cuota.numeroCuota
                          ? 'bg-green-500 text-white shadow-md'
                          : 'bg-white dark:bg-gray-800 hover:bg-green-100 dark:hover:bg-green-900/30 border border-green-200 dark:border-green-700'"
                      >
                        <div class="flex items-center gap-3">
                          <input
                            type="radio"
                            name="cuotaCancelacion"
                            [value]="cuota"
                            [checked]="selectedInstallmentForCancellation()?.numeroCuota === cuota.numeroCuota"
                            (change)="onSelectCuotaForCancellation(cuota)"
                            class="w-4 h-4 text-green-600"
                          />
                          <div>
                            <span class="font-bold text-xs">Cuota {{ cuota.numeroCuota }}</span>
                            <span class="text-[10px] ml-2" [class]="selectedInstallmentForCancellation()?.numeroCuota === cuota.numeroCuota ? 'text-green-100' : 'text-gray-500 dark:text-gray-400'">
                              Vence: {{ formatDate(cuota.dueDate) }}
                            </span>
                            @if (tienePagoParcial(cuota)) {
                              <span class="text-[9px] ml-1 px-1 py-0.5 rounded" [class]="selectedInstallmentForCancellation()?.numeroCuota === cuota.numeroCuota ? 'bg-green-400 text-white' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300'">Parcial</span>
                            }
                          </div>
                        </div>
                        <div class="text-right">
                          @if (tienePagoParcial(cuota)) {
                            <span class="text-xs opacity-70 mr-1">S/ {{ cuota.monto?.toFixed(2) }}</span>
                            <span class="font-bold text-sm">S/ {{ getSaldoPendienteCuota(cuota).toFixed(2) }}</span>
                          } @else {
                            <span class="font-bold text-sm">S/ {{ cuota.monto?.toFixed(2) || '0.00' }}</span>
                          }
                        </div>
                      </label>
                    }
                  </div>
                }

                <!-- Cuotas VENCIDAS (no se pueden cancelar) -->
                @if (overdueInstallments().length > 0) {
                  <div class="mt-3 pt-3 border-t border-red-200 dark:border-red-800">
                    <div class="flex items-center gap-2 mb-2">
                      <span class="text-sm">\u26D4</span>
                      <span class="text-[10px] font-bold text-red-700 dark:text-red-400">CUOTAS VENCIDAS (No se pueden cancelar)</span>
                    </div>
                    <div class="space-y-1">
                      @for (cuota of overdueInstallments(); track cuota.numeroCuota) {
                        <div class="flex items-center justify-between p-2 rounded-lg bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 opacity-75">
                          <div class="flex items-center gap-3">
                            <span class="text-red-500 dark:text-red-400 text-xs">\u2717</span>
                            <div>
                              <span class="font-bold text-xs text-red-800 dark:text-red-300">Cuota {{ cuota.numeroCuota }}</span>
                              <span class="text-[10px] ml-2 text-red-600 dark:text-red-400">
                                Venci\xF3: {{ formatDate(cuota.dueDate) }}
                              </span>
                            </div>
                          </div>
                          <span class="font-bold text-sm text-red-700 dark:text-red-400">S/ {{ cuota.monto?.toFixed(2) || '0.00' }}</span>
                        </div>
                      }
                    </div>
                    <div class="text-[9px] text-red-600 dark:text-red-400 mt-2">
                      La fecha de pago ya pas\xF3. Estas cuotas ser\xE1n marcadas como promesa rota.
                    </div>
                  </div>
                }

                <!-- Mensaje cuando no hay cuotas disponibles para cancelar -->
                @if (pendingInstallmentsForCancellation().length === 0 && overdueInstallments().length > 0) {
                  <div class="text-[10px] text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded flex items-center gap-1">
                    <span>\u{1F6AB}</span>
                    <span>No hay cuotas disponibles para cancelar. Todas las cuotas est\xE1n vencidas.</span>
                  </div>
                } @else if (!selectedInstallmentForCancellation() && pendingInstallmentsForCancellation().length > 0) {
                  <div class="text-[10px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-2 rounded flex items-center gap-1">
                    <span>\u26A0\uFE0F</span>
                    <span>Debe seleccionar una cuota para registrar la cancelaci\xF3n</span>
                  </div>
                }

                <!-- Campos editables de monto y fecha cuando hay cuota seleccionada -->
                @if (selectedInstallmentForCancellation()) {
                  <div class="mt-3 pt-3 border-t border-green-200 dark:border-green-700">
                    <div class="flex items-center gap-2 mb-2">
                      <span class="text-sm">\u270F\uFE0F</span>
                      <span class="text-[10px] font-bold text-green-800 dark:text-green-300">Datos del Pago (editables)</span>
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                      <!-- Monto pagado -->
                      <div>
                        <label class="block text-[10px] font-semibold text-green-700 dark:text-green-300 mb-1">Monto Pagado</label>
                        <div class="relative">
                          <span class="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-500 dark:text-gray-400">S/</span>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            [value]="montoPagoEditable()"
                            (input)="onMontoPagoChange($event)"
                            class="w-full pl-7 pr-2 py-1.5 text-sm font-semibold rounded-lg border border-green-300 dark:border-green-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          />
                        </div>
                        <p class="text-[10px] text-green-700 dark:text-green-300 mt-0.5 font-medium">
                          Pendiente: S/ {{ tienePagoParcial(selectedInstallmentForCancellation()) ? getSaldoPendienteCuota(selectedInstallmentForCancellation()).toFixed(2) : selectedInstallmentForCancellation()?.monto?.toFixed(2) }}
                        </p>
                      </div>
                      <!-- Fecha del pago -->
                      <div>
                        <label class="block text-[10px] font-semibold text-green-700 dark:text-green-300 mb-1">Fecha del Pago</label>
                        <input
                          type="date"
                          [value]="fechaPagoEditable()"
                          (input)="onFechaPagoChange($event)"
                          class="w-full px-2 py-1.5 text-sm rounded-lg border border-green-300 dark:border-green-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                        <p class="text-[9px] text-green-600 dark:text-green-400 mt-0.5">
                          Por defecto: hoy
                        </p>
                      </div>
                    </div>
                    <!-- Info de distribuci\xF3n si el monto es diferente -->
                    @if (montoPagoEditable() !== selectedInstallmentForCancellation()?.monto) {
                      <div class="mt-2 p-2 rounded-lg text-[10px]"
                           [class]="montoPagoEditable() < selectedInstallmentForCancellation()?.monto
                             ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-700'
                             : 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700'">
                        @if (montoPagoEditable() < selectedInstallmentForCancellation()?.monto) {
                          <span class="flex items-center gap-1">
                            <span>\u26A0\uFE0F</span>
                            <span><strong>Pago parcial:</strong> La cuota quedar\xE1 con saldo pendiente de S/ {{ (selectedInstallmentForCancellation()?.monto - montoPagoEditable()).toFixed(2) }}</span>
                          </span>
                        } @else {
                          <span class="flex items-center gap-1">
                            <span>\u2139\uFE0F</span>
                            <span><strong>Pago mayor:</strong> El excedente de S/ {{ (montoPagoEditable() - selectedInstallmentForCancellation()?.monto).toFixed(2) }} se aplicar\xE1 a las siguientes cuotas</span>
                          </span>
                        }
                      </div>
                    }
                  </div>
                }
              </div>
            }

            <!-- Bot\xF3n para subir comprobante (opcional) -->
            @if (isCancellationTypification() && selectedInstallmentForCancellation()) {
              <div class="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 border border-purple-200 dark:border-purple-800 rounded-lg p-3">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="text-lg">\u{1F4CE}</span>
                    <div>
                      <h4 class="text-xs font-bold text-purple-900 dark:text-purple-100">Comprobante de Pago</h4>
                      <p class="text-[9px] text-purple-600 dark:text-purple-300">Opcional: Sube una imagen del voucher para validaci\xF3n OCR</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    (click)="openComprobanteUploadDialog()"
                    class="px-3 py-1.5 text-xs font-medium rounded-lg transition-all"
                    [class]="uploadedComprobante()
                      ? 'bg-green-500 hover:bg-green-600 text-white'
                      : 'bg-purple-600 hover:bg-purple-700 text-white'"
                  >
                    @if (uploadedComprobante()) {
                      \u2705 Comprobante Subido
                    } @else {
                      \u{1F4E4} Subir Comprobante
                    }
                  </button>
                </div>
                @if (uploadedComprobante()) {
                  <div class="mt-2 p-2 bg-white dark:bg-gray-800 rounded text-[10px] space-y-1">
                    <p class="text-gray-600 dark:text-gray-400">{{ uploadedComprobante()?.mensaje }}</p>
                    @if (uploadedComprobante()?.ocrResult?.monto) {
                      <p><strong>Monto detectado:</strong> S/ {{ uploadedComprobante()?.ocrResult?.monto | number:'1.2-2' }}</p>
                    }
                    @if (uploadedComprobante()?.ocrResult?.banco) {
                      <p><strong>Banco:</strong> {{ uploadedComprobante()?.ocrResult?.banco }}</p>
                    }
                    <button
                      type="button"
                      (click)="uploadedComprobante.set(null)"
                      class="text-red-500 hover:text-red-700 text-[9px] underline"
                    >
                      Quitar comprobante
                    </button>
                  </div>
                }
              </div>
            }

            <!-- Botones de Acci\xF3n - COMPACTOS -->
            <div class="flex gap-2 pt-2">
              @if (requiresAuthorization()) {
                <!-- Bot\xF3n de Solicitar Autorizaci\xF3n (cuando es monto personalizado) -->
                <button
                  (click)="openSupervisorSelectionModal()"
                  [disabled]="saving() || !isFormValid() || waitingForAuthorization()"
                  class="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500 text-white dark:text-white disabled:text-gray-200 py-2 px-4 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                >
                  @if (waitingForAuthorization()) {
                    <span class="animate-pulse">\u23F3 Esperando Autorizaci\xF3n...</span>
                  } @else {
                    \u{1F510} Solicitar Autorizaci\xF3n
                  }
                </button>
              } @else {
                <!-- Bot\xF3n Normal de Guardar -->
                <button
                  (click)="saveManagement()"
                  [disabled]="saving() || !isFormValid() || (isCancellationTypification() && (pendingInstallmentsForCancellation().length > 0 || overdueInstallments().length > 0) && !selectedInstallmentForCancellation()) || (isCancellationTypification() && pendingInstallmentsForCancellation().length === 0 && overdueInstallments().length > 0)"
                  [title]="'Guardando: ' + saving() + ' | V\xE1lido: ' + isFormValid()"
                  class="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white dark:text-white disabled:text-gray-200 py-2 px-4 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                >
                  @if (saving()) {
                    Guardando...
                  } @else {
                    Guardar Gesti\xF3n
                  }
                </button>
              }
              <button
                (click)="cancelarTipificacion()"
                class="px-6 bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white dark:text-white py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>

        <!-- PANEL DERECHO - Resumen Deuda y Montos -->
        <div class="w-72 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden flex flex-col transition-colors duration-300">
          <!-- Resumen R\xE1pido Deuda -->
          <div class="p-2 bg-red-100 dark:bg-red-950/20">
            <div class="text-center">
              <div class="text-[9px] uppercase font-bold" [ngClass]="themeService.isDarkMode() ? 'text-red-400' : 'text-red-800'">{{ getPrimaryAmountLabel() }}</div>
              <div class="text-xl font-black" [ngClass]="themeService.isDarkMode() ? 'text-red-400' : 'text-red-800'">{{ formatCurrency(getPrimaryAmountValue()) }}</div>
              <div class="text-[11px] font-semibold" [ngClass]="themeService.isDarkMode() ? 'text-orange-400' : 'text-orange-700'">{{ clientDiasMora() }} d\xEDas mora</div>
            </div>
          </div>

          <!-- Montos de la Cuenta -->
          <div class="p-2 flex-1 overflow-y-auto">
            @if (clientAmountFields().length > 0) {
              <div class="space-y-1.5">
                @for (field of clientAmountFields(); track field.field; let i = $index) {
                  <div class="flex justify-between items-center py-1 px-2 rounded text-xs"
                       [class]="getAmountRowClass(i)">
                    <span class="truncate mr-2 font-medium" [ngClass]="themeService.isDarkMode() ? 'text-red-300' : 'text-red-800'">{{ field.label }}</span>
                    <span class="font-bold whitespace-nowrap text-sm" [ngClass]="themeService.isDarkMode() ? 'text-red-300' : 'text-red-800'">
                      {{ formatCurrency(field.value) }}
                    </span>
                  </div>
                }
              </div>
            }
          </div>
        </div>
        </div>

        <!-- SECCION DE HISTORIAL DE GESTIONES - Compacto -->
        <div class="h-44 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 flex flex-col transition-colors duration-300">
          <div class="px-3 py-1.5 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-sm">\u{1F4CB}</span>
              <h3 class="text-xs font-bold text-slate-700 dark:text-slate-200">Historial de Gestiones</h3>
              <span class="text-[10px] text-slate-500 dark:text-slate-400">({{ historialGestiones().length }} registros)</span>
            </div>
            <button (click)="loadManagementHistory()" class="text-[10px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
              <span>\u21BB</span> Actualizar
            </button>
          </div>
          <div class="flex-1 overflow-auto">
            @if (historialGestiones().length === 0) {
              <div class="flex items-center justify-center h-full text-slate-400 dark:text-slate-500 text-xs">
                Sin gestiones registradas para este cliente
              </div>
            } @else {
              <table class="w-full text-[10px]">
                <thead class="bg-slate-100 dark:bg-slate-800 sticky top-0">
                  <tr class="text-left text-slate-600 dark:text-slate-300">
                    <th class="px-2 py-1 font-semibold">Fecha</th>
                    <th class="px-2 py-1 font-semibold">Agente</th>
                    <th class="px-2 py-1 font-semibold">Tipificaci\xF3n</th>
                    <th class="px-2 py-1 font-semibold">Tel\xE9fono</th>
                    <th class="px-2 py-1 font-semibold">Observaci\xF3n</th>
                    <th class="px-2 py-1 font-semibold">Canal</th>
                    <th class="px-2 py-1 font-semibold">M\xE9todo</th>
                    <th class="px-2 py-1 font-semibold text-right">Monto Promesa</th>
                    <th class="px-2 py-1 font-semibold text-center">Estado Pago</th>
                  </tr>
                </thead>
                <tbody>
                  @for (gestion of historialGestiones(); track gestion.id) {
                    <tr class="border-b border-slate-100 dark:border-slate-700/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                      <td class="px-2 py-1.5 text-slate-600 dark:text-slate-300 whitespace-nowrap">{{ gestion.fecha }}</td>
                      <td class="px-2 py-1.5 text-slate-700 dark:text-slate-200 font-medium whitespace-nowrap" [title]="gestion.nombreAgente">{{ gestion.nombreAgente }}</td>
                      <td class="px-2 py-1.5 max-w-[180px]">
                        <span class="text-blue-600 dark:text-blue-400 font-medium truncate block" [title]="gestion.tipificacionCompleta">
                          {{ gestion.tipificacionCompleta }}
                        </span>
                      </td>
                      <td class="px-2 py-1.5 text-slate-600 dark:text-slate-300 font-mono whitespace-nowrap">{{ gestion.telefono || '-' }}</td>
                      <td class="px-2 py-1.5 text-slate-500 dark:text-slate-400 max-w-[120px] truncate" [title]="gestion.observacion">
                        {{ gestion.observacion || '-' }}
                      </td>
                      <td class="px-2 py-1.5">
                        <span [class]="'px-1.5 py-0.5 rounded text-[9px] font-semibold ' +
                          (gestion.canal?.includes('SALIENTE') ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                           gestion.canal?.includes('ENTRANTE') ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' :
                           gestion.canal === 'WHATSAPP' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' :
                           gestion.canal === 'SMS' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' :
                           'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300')">
                          {{ gestion.canalDisplay }}
                        </span>
                      </td>
                      <td class="px-2 py-1.5">
                        <span [class]="'px-1.5 py-0.5 rounded text-[9px] font-semibold ' +
                          (gestion.metodo === 'GESTION_MANUAL' ? 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300' :
                           gestion.metodo === 'GESTION_PROGRESIVO' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' :
                           gestion.metodo === 'GESTION_PREDICTIVO' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' :
                           'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300')">
                          {{ gestion.metodoDisplay }}
                        </span>
                      </td>
                      <td class="px-2 py-1.5 text-right font-mono whitespace-nowrap">
                        @if (gestion.montoPromesa && gestion.montoPromesa > 0) {
                          <span class="text-green-600 dark:text-green-400 font-semibold">S/ {{ gestion.montoPromesa | number:'1.2-2' }}</span>
                        } @else {
                          <span class="text-slate-400 dark:text-slate-600">-</span>
                        }
                      </td>
                      <td class="px-2 py-1.5 text-center">
                        @if (gestion.estadoPago) {
                          <span [class]="'px-1.5 py-0.5 rounded text-[9px] font-semibold ' +
                            (gestion.estadoPago === 'PAGADA' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                             gestion.estadoPago === 'PENDIENTE' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' :
                             gestion.estadoPago === 'VENCIDA' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' :
                             gestion.estadoPago === 'PARCIAL' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' :
                             'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300')">
                            {{ gestion.estadoPagoDisplay }}
                          </span>
                        } @else {
                          <span class="text-slate-400 dark:text-slate-600">-</span>
                        }
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            }
          </div>
        </div>
      </div>

      <!-- Modal de Cronograma Detallado -->
      @if (showScheduleDetail() && scheduleManagementId()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div class="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-slideInUp">
            <!-- Header del modal -->
            <div class="bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-700 dark:to-purple-800 text-white px-6 py-4 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div>
                  <h2 class="text-lg font-bold">Cronograma de Pagos</h2>
                  <p class="text-sm opacity-90">Gesti\xF3n {{ scheduleManagementId() }}</p>
                </div>
              </div>
              <button
                type="button"
                (click)="closeScheduleDetail()"
                class="p-2 hover:bg-white/20 rounded-lg transition-colors">
              </button>
            </div>

            <!-- Contenido del modal -->
            <div class="flex-1 overflow-y-auto p-6">
              <app-payment-schedule-view [managementId]="scheduleManagementId()!" />
            </div>

            <!-- Footer del modal -->
            <div class="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 flex justify-end">
              <button
                type="button"
                (click)="closeScheduleDetail()"
                class="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300
                       hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      }

      <!-- Modal de Selecci\xF3n de Supervisor para Autorizaci\xF3n -->
      <app-select-supervisor-modal
        [(visible)]="showSupervisorModal"
        (supervisorSelected)="onSupervisorSelected($event)"
        (cancelled)="onSupervisorSelectionCancelled()">
      </app-select-supervisor-modal>
    </div>
  `, styles: ["/* angular:styles/component:css;b88ad6e158ea62eb93c19e48755c4e7d4c3441d72f0fac74fd4bc3281285039a;C:/Users/HP/Documents/Kubito-2.0-v1/cashi-discador-frontend/cashi-discador-frontend/src/app/collection-management/pages/collection-management.page.ts */\n@keyframes slideInRight {\n  from {\n    transform: translateX(100%);\n    opacity: 0;\n  }\n  to {\n    transform: translateX(0);\n    opacity: 1;\n  }\n}\n@keyframes fadeIn {\n  from {\n    opacity: 0;\n    transform: translateY(10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n@keyframes slideInUp {\n  from {\n    opacity: 0;\n    transform: translateY(20px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n/*# sourceMappingURL=collection-management.page.css.map */\n"] }]
  }], () => [{ type: SystemConfigService }, { type: ManagementService }, { type: PaymentScheduleService }, { type: ThemeService }, { type: TypificationService }, { type: TypificationV2Service }, { type: ApiSystemConfigService }, { type: CustomerOutputConfigService }, { type: CustomerService }, { type: Router }, { type: ActivatedRoute }, { type: HttpClient }, { type: SipService }, { type: AgentService }, { type: AgentStatusService }, { type: AuthService }, { type: AutorizacionService }, { type: RecordatoriosService }, { type: MatDialog }, { type: ComprobanteService }, { type: CartaAcuerdoService }], { dynamicFieldRenderer: [{
    type: ViewChild,
    args: ["dynamicFieldRendererComponent"]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(CollectionManagementPage, { className: "CollectionManagementPage", filePath: "src/app/collection-management/pages/collection-management.page.ts", lineNumber: 981 });
})();
export {
  CollectionManagementPage
};
//# sourceMappingURL=chunk-FW5AFBSO.js.map
