import {
  AgreementsService
} from "./chunk-B2EH5ADJ.js";
import {
  ThemeService
} from "./chunk-D3RWIMJ4.js";
import {
  DefaultValueAccessor,
  FormBuilder,
  FormControlName,
  FormGroupDirective,
  MaxLengthValidator,
  NgControlStatus,
  NgControlStatusGroup,
  ReactiveFormsModule,
  Validators,
  ɵNgNoValidate
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
  effect,
  setClassMetadata,
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
  ɵɵproperty,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-CTRHJBBW.js";

// src/app/features/legacy/agreements/pages/no-debt-letter-page/no-debt-letter-page.component.ts
function NoDebtLetterPageComponent_div_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 17)(1, "span", 18);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 19);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "button", 20);
    \u0275\u0275listener("click", function NoDebtLetterPageComponent_div_2_Template_button_click_5_listener() {
      const toast_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.removeToast(toast_r2.id));
    });
    \u0275\u0275text(6, "\xD7");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const toast_r2 = ctx.$implicit;
    \u0275\u0275classProp("toast-error", toast_r2.type === "error")("toast-warning", toast_r2.type === "warning")("toast-success", toast_r2.type === "success");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(toast_r2.icon);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(toast_r2.message);
  }
}
function NoDebtLetterPageComponent_button_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 21);
    \u0275\u0275listener("click", function NoDebtLetterPageComponent_button_8_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.resetForm());
    });
    \u0275\u0275element(1, "lucide-angular", 22);
    \u0275\u0275text(2, " Limpiar ");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 18);
  }
}
function NoDebtLetterPageComponent_button_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 23);
    \u0275\u0275listener("click", function NoDebtLetterPageComponent_button_9_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.generarPDF());
    });
    \u0275\u0275element(1, "lucide-angular", 24);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("disabled", ctx_r2.isLoading || !ctx_r2.letterForm.valid);
    \u0275\u0275advance();
    \u0275\u0275property("size", 18);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r2.isLoading ? "Generando..." : "Generar PDF", " ");
  }
}
function NoDebtLetterPageComponent_div_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 25);
    \u0275\u0275element(1, "lucide-angular", 26);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 24);
  }
}
function NoDebtLetterPageComponent_div_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 27)(1, "div", 28)(2, "form", 29)(3, "div", 30)(4, "div", 31)(5, "div", 32);
    \u0275\u0275text(6, "LOGO NSOLUCIONES");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 33)(8, "div", 32);
    \u0275\u0275text(9, "LOGO NS");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(10, "div", 34);
    \u0275\u0275element(11, "input", 35);
    \u0275\u0275elementStart(12, "div", 36);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "h2", 37);
    \u0275\u0275text(15, "CARTA DE NO ADEUDO");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "p", 38);
    \u0275\u0275text(17, " Mediante la presente dejamos constancia que: ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "div", 39)(19, "div", 40);
    \u0275\u0275element(20, "input", 41);
    \u0275\u0275elementStart(21, "span", 42);
    \u0275\u0275text(22, "DNI:");
    \u0275\u0275elementEnd();
    \u0275\u0275element(23, "input", 43);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "div", 40)(25, "span", 44);
    \u0275\u0275text(26, "Titular de la cuenta Nro.");
    \u0275\u0275elementEnd();
    \u0275\u0275element(27, "input", 45);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(28, "div", 46)(29, "p");
    \u0275\u0275text(30, " Originada(s) en ");
    \u0275\u0275elementStart(31, "strong");
    \u0275\u0275text(32, "FINANCIERA OH!");
    \u0275\u0275elementEnd();
    \u0275\u0275text(33, " S.A, con RUC ");
    \u0275\u0275elementStart(34, "strong");
    \u0275\u0275text(35);
    \u0275\u0275elementEnd();
    \u0275\u0275text(36, ", cedido(s) a favor de ");
    \u0275\u0275elementStart(37, "strong");
    \u0275\u0275text(38, "NSOLUCIONES CONSULTING S.A.C.");
    \u0275\u0275elementEnd();
    \u0275\u0275text(39, " con RUC ");
    \u0275\u0275elementStart(40, "strong");
    \u0275\u0275text(41);
    \u0275\u0275elementEnd();
    \u0275\u0275text(42, ", mediante contrato de trasferencia de cartera crediticia en la modalidad de cesi\xF3n de derechos, quien a la fecha es el actual acreedor, no mantiene deuda o saldo deudor en nuestra empresa sobre el(los) cr\xE9dito(s) antes mencionado(s), registr\xE1ndose en situaci\xF3n de ");
    \u0275\u0275elementStart(43, "strong");
    \u0275\u0275text(44, "CANCELADO");
    \u0275\u0275elementEnd();
    \u0275\u0275text(45, ". ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(46, "div", 47)(47, "p");
    \u0275\u0275text(48, " Y la fecha de cancelaci\xF3n de esta(s) obligaci\xF3n(es) fue el d\xEDa ");
    \u0275\u0275element(49, "input", 48);
    \u0275\u0275elementStart(50, "span", 49);
    \u0275\u0275text(51);
    \u0275\u0275elementEnd();
    \u0275\u0275text(52, ". ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(53, "div", 50)(54, "p");
    \u0275\u0275text(55, "Atentamente,");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(56, "div", 51)(57, "div", 52)(58, "div", 53);
    \u0275\u0275text(59, "FIRMA");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(60, "div", 54)(61, "p", 55);
    \u0275\u0275text(62);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(63, "p", 56);
    \u0275\u0275text(64);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(65, "div", 57);
    \u0275\u0275element(66, "div", 58);
    \u0275\u0275elementStart(67, "div", 59)(68, "p");
    \u0275\u0275text(69);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(70, "p");
    \u0275\u0275text(71);
    \u0275\u0275elementEnd()()()()()();
  }
  if (rf & 2) {
    let tmp_2_0;
    let tmp_5_0;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275property("formGroup", ctx_r2.letterForm);
    \u0275\u0275advance(11);
    \u0275\u0275textInterpolate1(" ", ctx_r2.formatDisplayDate((tmp_2_0 = ctx_r2.letterForm.get("fechaActual")) == null ? null : tmp_2_0.value), " ");
    \u0275\u0275advance(22);
    \u0275\u0275textInterpolate(ctx_r2.rucFinanciera);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(ctx_r2.rucNsoluciones);
    \u0275\u0275advance(10);
    \u0275\u0275textInterpolate1(" ", ctx_r2.formatDisplayDate((tmp_5_0 = ctx_r2.letterForm.get("fechaCancelacion")) == null ? null : tmp_5_0.value), " ");
    \u0275\u0275advance(11);
    \u0275\u0275textInterpolate(ctx_r2.firmaNombre);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.firmaCargo);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r2.direccion);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.telefono);
  }
}
var _NoDebtLetterPageComponent = class _NoDebtLetterPageComponent {
  constructor(fb, agreementsService, themeService) {
    this.fb = fb;
    this.agreementsService = agreementsService;
    this.themeService = themeService;
    this.isDarkMode = false;
    this.isLoading = false;
    this.mostrarDocumento = false;
    this.toasts = [];
    this.toastIdCounter = 0;
    this.entidad = "nsoluciones";
    this.rucFinanciera = "20522291201";
    this.rucNsoluciones = "20611923202";
    this.direccion = "Calle Morelli 217, Int 205 San Borja \u2013 Lima \u2013 Per\xFA";
    this.telefono = "+51 915 326 798";
    this.firmaNombre = "Emily Dayana Saenz Martinez";
    this.firmaCargo = "Administraci\xF3n";
    this.searchForm = this.fb.group({
      dniBusqueda: ["", [Validators.required, Validators.pattern(/^\d{8}$/)]]
    });
    this.letterForm = this.fb.group({
      nombreCompleto: ["", Validators.required],
      dni: ["", [Validators.required, Validators.pattern(/^\d{8}$/)]],
      numeroCuenta: ["", Validators.required],
      fechaActual: [this.formatDate(/* @__PURE__ */ new Date()), Validators.required],
      fechaCancelacion: [this.formatDate(/* @__PURE__ */ new Date()), Validators.required]
    });
    effect(() => {
      this.isDarkMode = this.themeService.isDarkMode();
    });
  }
  formatDate(date) {
    return date.toISOString().split("T")[0];
  }
  formatDisplayDate(dateString) {
    if (!dateString)
      return "";
    const [year, month, day] = dateString.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    const formatted = date.toLocaleDateString("es-PE", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
    return formatted.replace("septiembre", "setiembre");
  }
  buscarPorDni() {
    if (this.searchForm.invalid) {
      this.searchForm.markAllAsTouched();
      return;
    }
    const dni = this.searchForm.get("dniBusqueda")?.value;
    this.limpiarCampos();
    this.searchForm.reset();
    this.isLoading = true;
    this.agreementsService.getAgreementData(dni).subscribe({
      next: (response) => {
        this.letterForm.patchValue({
          nombreCompleto: response.nombreDelTitular,
          dni,
          numeroCuenta: response.cuentaTarjeta,
          fechaActual: this.formatDate(/* @__PURE__ */ new Date()),
          fechaCancelacion: this.formatDate(/* @__PURE__ */ new Date())
        });
        this.mostrarDocumento = true;
        this.isLoading = false;
        this.showToast("success", "Datos cargados correctamente");
      },
      error: (error) => {
        this.isLoading = false;
        if (error.status === 404) {
          this.showToast("error", "Cliente no encontrado en la base de datos.");
        } else if (error.status === 422) {
          this.showToast("warning", "El cliente no tiene datos registrados.");
        } else {
          this.showToast("error", "Error al obtener datos del cliente.");
        }
      }
    });
  }
  generarPDF() {
    if (!this.letterForm.valid) {
      this.showToast("error", "Complete los campos requeridos.");
      return;
    }
    this.isLoading = true;
    const formValue = this.letterForm.value;
    const request = {
      entidad: this.entidad,
      nombreCompleto: formValue.nombreCompleto,
      dni: formValue.dni,
      numeroCuenta: formValue.numeroCuenta,
      fechaActual: this.formatDisplayDate(formValue.fechaActual),
      fechaCancelacion: this.formatDisplayDate(formValue.fechaCancelacion),
      rucFinanciera: this.rucFinanciera,
      rucNsoluciones: this.rucNsoluciones
    };
    this.agreementsService.downloadNoDebtLetter(request).subscribe({
      next: (blob) => {
        this.downloadFile(blob, `CARTA_NO_ADEUDO_${formValue.dni}.pdf`);
        this.isLoading = false;
        this.showToast("success", "Carta de No Adeudo descargada correctamente");
      },
      error: (error) => {
        console.error("Error completo:", error);
        this.isLoading = false;
        this.showToast("error", `Error al generar documento: ${error.message || "Error desconocido"}`);
      }
    });
  }
  downloadFile(blob, filename) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
  limpiarCampos() {
    this.mostrarDocumento = false;
    this.toasts = [];
    this.letterForm.patchValue({
      nombreCompleto: "",
      dni: "",
      numeroCuenta: "",
      fechaActual: this.formatDate(/* @__PURE__ */ new Date()),
      fechaCancelacion: this.formatDate(/* @__PURE__ */ new Date())
    });
  }
  resetForm() {
    if (confirm("Limpiar todos los campos?")) {
      this.limpiarCampos();
    }
  }
  showToast(type, message) {
    const icon = type === "error" ? "\u274C" : type === "warning" ? "\u26A0\uFE0F" : "\u2705";
    const id = this.toastIdCounter++;
    this.toasts.push({ id, type, message, icon });
    setTimeout(() => this.removeToast(id), 5e3);
  }
  removeToast(id) {
    this.toasts = this.toasts.filter((toast) => toast.id !== id);
  }
  onlyNumbers(event) {
    const input = event.target;
    input.value = input.value.replace(/[^0-9]/g, "");
  }
};
_NoDebtLetterPageComponent.\u0275fac = function NoDebtLetterPageComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _NoDebtLetterPageComponent)(\u0275\u0275directiveInject(FormBuilder), \u0275\u0275directiveInject(AgreementsService), \u0275\u0275directiveInject(ThemeService));
};
_NoDebtLetterPageComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _NoDebtLetterPageComponent, selectors: [["app-no-debt-letter-page"]], decls: 20, vars: 26, consts: [[1, "no-debt-letter-container", "min-h-screen", "p-6", "transition-colors", "duration-200"], [1, "toast-container"], ["class", "toast", 3, "toast-error", "toast-warning", "toast-success", 4, "ngFor", "ngForOf"], [1, "header-section", "rounded-lg", "shadow-md", "p-6", "mb-6"], [1, "flex", "items-center", "justify-between", "mb-4"], [1, "text-2xl", "font-bold"], [1, "flex", "gap-3"], ["type", "button", "class", "btn-secondary", 3, "click", 4, "ngIf"], ["type", "button", "class", "btn-primary", 3, "disabled", "click", 4, "ngIf"], [1, "flex", "items-center", "gap-3", 3, "formGroup"], [1, "flex-1", "max-w-xs"], [1, "block", "text-sm", "font-medium", "mb-1"], ["formControlName", "dniBusqueda", "type", "text", "placeholder", "Ingrese DNI", "maxlength", "8", 1, "input-field", 3, "input"], ["type", "button", 1, "btn-search", "mt-6", 3, "click", "disabled"], ["name", "search", 3, "size"], ["class", "mt-6", 4, "ngIf"], ["class", "document-wrapper", 4, "ngIf"], [1, "toast"], [1, "toast-icon"], [1, "toast-message"], [1, "toast-close", 3, "click"], ["type", "button", 1, "btn-secondary", 3, "click"], ["name", "x", 3, "size"], ["type", "button", 1, "btn-primary", 3, "click", "disabled"], ["name", "download", 3, "size"], [1, "mt-6"], ["name", "loader", 1, "animate-spin", "text-blue-600", 3, "size"], [1, "document-wrapper"], [1, "document-container", "bg-white", "shadow-2xl"], [3, "formGroup"], [1, "header-logos"], [1, "logo-left"], [1, "logo-placeholder"], [1, "logo-right"], [1, "fecha-container"], ["type", "date", "formControlName", "fechaActual", 1, "fecha-input"], [1, "fecha-display"], [1, "titulo-carta"], [1, "texto-introduccion"], [1, "datos-titular"], [1, "dato-row"], ["type", "text", "formControlName", "nombreCompleto", "readonly", "", 1, "nombre-input"], [1, "dni-label"], ["type", "text", "formControlName", "dni", "readonly", "", 1, "dni-input"], [1, "cuenta-label"], ["type", "text", "formControlName", "numeroCuenta", "readonly", "", 1, "cuenta-input"], [1, "parrafo-principal"], [1, "fecha-cancelacion"], ["type", "date", "formControlName", "fechaCancelacion", 1, "fecha-input", "inline-block"], [1, "fecha-display", "inline-block"], [1, "despedida"], [1, "firma-section"], [1, "firma-imagen"], [1, "logo-placeholder", "small"], [1, "firma-datos"], [1, "firma-nombre"], [1, "firma-cargo"], [1, "footer-section"], [1, "footer-line"], [1, "footer-datos"]], template: function NoDebtLetterPageComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 0)(1, "div", 1);
    \u0275\u0275template(2, NoDebtLetterPageComponent_div_2_Template, 7, 8, "div", 2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 3)(4, "div", 4)(5, "h1", 5);
    \u0275\u0275text(6, " Generador de Carta de No Adeudo ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "div", 6);
    \u0275\u0275template(8, NoDebtLetterPageComponent_button_8_Template, 3, 1, "button", 7)(9, NoDebtLetterPageComponent_button_9_Template, 3, 3, "button", 8);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "form", 9)(11, "div", 10)(12, "label", 11);
    \u0275\u0275text(13, " DNI del Cliente ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "input", 12);
    \u0275\u0275listener("input", function NoDebtLetterPageComponent_Template_input_input_14_listener($event) {
      return ctx.onlyNumbers($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "button", 13);
    \u0275\u0275listener("click", function NoDebtLetterPageComponent_Template_button_click_15_listener() {
      return ctx.buscarPorDni();
    });
    \u0275\u0275element(16, "lucide-angular", 14);
    \u0275\u0275text(17, " Buscar ");
    \u0275\u0275elementEnd();
    \u0275\u0275template(18, NoDebtLetterPageComponent_div_18_Template, 2, 1, "div", 15);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(19, NoDebtLetterPageComponent_div_19_Template, 72, 9, "div", 16);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_12_0;
    \u0275\u0275classProp("bg-gray-50", !ctx.isDarkMode)("bg-gray-900", ctx.isDarkMode);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngForOf", ctx.toasts);
    \u0275\u0275advance();
    \u0275\u0275classProp("bg-white", !ctx.isDarkMode)("bg-gray-800", ctx.isDarkMode);
    \u0275\u0275advance(2);
    \u0275\u0275classProp("text-gray-800", !ctx.isDarkMode)("text-gray-100", ctx.isDarkMode);
    \u0275\u0275advance(3);
    \u0275\u0275property("ngIf", ctx.mostrarDocumento);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.mostrarDocumento);
    \u0275\u0275advance();
    \u0275\u0275property("formGroup", ctx.searchForm);
    \u0275\u0275advance(2);
    \u0275\u0275classProp("text-gray-700", !ctx.isDarkMode)("text-gray-300", ctx.isDarkMode);
    \u0275\u0275advance(2);
    \u0275\u0275classProp("border-red-500", ((tmp_12_0 = ctx.searchForm.get("dniBusqueda")) == null ? null : tmp_12_0.invalid) && ((tmp_12_0 = ctx.searchForm.get("dniBusqueda")) == null ? null : tmp_12_0.touched));
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx.searchForm.invalid || ctx.isLoading);
    \u0275\u0275advance();
    \u0275\u0275property("size", 18);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", ctx.isLoading);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.mostrarDocumento);
  }
}, dependencies: [CommonModule, NgForOf, NgIf, ReactiveFormsModule, \u0275NgNoValidate, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, MaxLengthValidator, FormGroupDirective, FormControlName, LucideAngularModule, LucideAngularComponent], styles: ['\n\n.no-debt-letter-container[_ngcontent-%COMP%] {\n  max-width: 1400px;\n  margin: 0 auto;\n}\n.toast-container[_ngcontent-%COMP%] {\n  position: fixed;\n  top: 20px;\n  right: 20px;\n  z-index: 9999;\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n}\n.toast[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  padding: 12px 16px;\n  border-radius: 8px;\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);\n  min-width: 300px;\n  max-width: 500px;\n  animation: _ngcontent-%COMP%_slideIn 0.3s ease-out;\n  background: white;\n}\n.toast-error[_ngcontent-%COMP%] {\n  border-left: 4px solid #ef4444;\n}\n.toast-warning[_ngcontent-%COMP%] {\n  border-left: 4px solid #f59e0b;\n}\n.toast-success[_ngcontent-%COMP%] {\n  border-left: 4px solid #10b981;\n}\n.toast-icon[_ngcontent-%COMP%] {\n  font-size: 20px;\n  flex-shrink: 0;\n}\n.toast-message[_ngcontent-%COMP%] {\n  flex: 1;\n  font-size: 14px;\n  color: #374151;\n}\n.toast-close[_ngcontent-%COMP%] {\n  background: none;\n  border: none;\n  font-size: 24px;\n  color: #9ca3af;\n  cursor: pointer;\n  padding: 0;\n  width: 24px;\n  height: 24px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  border-radius: 4px;\n  transition: all 0.2s;\n}\n.toast-close[_ngcontent-%COMP%]:hover {\n  background: #f3f4f6;\n  color: #374151;\n}\n@keyframes _ngcontent-%COMP%_slideIn {\n  from {\n    transform: translateX(400px);\n    opacity: 0;\n  }\n  to {\n    transform: translateX(0);\n    opacity: 1;\n  }\n}\n.btn-primary[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 8px;\n  padding: 10px 20px;\n  background:\n    linear-gradient(\n      135deg,\n      #3b82f6 0%,\n      #8b5cf6 100%);\n  color: white;\n  border: none;\n  border-radius: 8px;\n  font-weight: 600;\n  cursor: pointer;\n  transition: all 0.3s;\n  box-shadow: 0 4px 6px rgba(59, 130, 246, 0.3);\n}\n.btn-primary[_ngcontent-%COMP%]:hover:not(:disabled) {\n  transform: translateY(-2px);\n  box-shadow: 0 6px 12px rgba(59, 130, 246, 0.4);\n}\n.btn-primary[_ngcontent-%COMP%]:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n.btn-secondary[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 8px;\n  padding: 10px 20px;\n  background: white;\n  color: #6b7280;\n  border: 2px solid #e5e7eb;\n  border-radius: 8px;\n  font-weight: 600;\n  cursor: pointer;\n  transition: all 0.3s;\n}\n.btn-secondary[_ngcontent-%COMP%]:hover {\n  background: #f9fafb;\n  border-color: #d1d5db;\n}\n.btn-search[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 8px;\n  padding: 10px 20px;\n  background: #3b82f6;\n  color: white;\n  border: none;\n  border-radius: 8px;\n  font-weight: 600;\n  cursor: pointer;\n  transition: all 0.3s;\n}\n.btn-search[_ngcontent-%COMP%]:hover:not(:disabled) {\n  background: #2563eb;\n}\n.btn-search[_ngcontent-%COMP%]:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n.input-field[_ngcontent-%COMP%] {\n  width: 100%;\n  padding: 10px 14px;\n  border: 2px solid #e5e7eb;\n  border-radius: 8px;\n  font-size: 14px;\n  transition: all 0.3s;\n  background: white;\n  color: #111827;\n}\n.input-field[_ngcontent-%COMP%]:focus {\n  outline: none;\n  border-color: #3b82f6;\n  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);\n}\n.input-field[_ngcontent-%COMP%]:disabled {\n  background: #f3f4f6;\n  cursor: not-allowed;\n}\n.dark[_nghost-%COMP%]   .input-field[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .input-field[_ngcontent-%COMP%] {\n  background: #374151;\n  border-color: #4b5563;\n  color: #f9fafb;\n}\n.document-wrapper[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: center;\n  padding: 20px 0;\n}\n.document-container[_ngcontent-%COMP%] {\n  width: 21cm;\n  min-height: 29.7cm;\n  padding: 2cm;\n  background: white;\n  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);\n  position: relative;\n}\n.header-logos[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: flex-start;\n  margin-bottom: 40px;\n}\n.logo-placeholder[_ngcontent-%COMP%] {\n  display: inline-block;\n  padding: 10px 20px;\n  background: #ecf0f1;\n  border: 2px dashed #bdc3c7;\n  color: #7f8c8d;\n  font-weight: bold;\n  font-size: 12px;\n}\n.logo-placeholder.small[_ngcontent-%COMP%] {\n  padding: 5px 10px;\n  font-size: 10px;\n}\n.fecha-container[_ngcontent-%COMP%] {\n  text-align: right;\n  margin-bottom: 40px;\n  position: relative;\n}\n.fecha-input[_ngcontent-%COMP%] {\n  position: absolute;\n  right: 0;\n  opacity: 0;\n  width: 0;\n  height: 0;\n  pointer-events: none;\n}\n.fecha-display[_ngcontent-%COMP%] {\n  font-size: 14px;\n  color: #000;\n}\n.titulo-carta[_ngcontent-%COMP%] {\n  text-align: center;\n  font-size: 18px;\n  font-weight: 700;\n  margin: 30px 0;\n  color: #000;\n}\n.texto-introduccion[_ngcontent-%COMP%] {\n  font-size: 14px;\n  margin-bottom: 20px;\n  color: #000;\n}\n.datos-titular[_ngcontent-%COMP%] {\n  margin: 20px 0;\n}\n.dato-row[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  font-size: 14px;\n  color: #000;\n}\n.nombre-input[_ngcontent-%COMP%] {\n  border: none;\n  background: transparent;\n  font-weight: 700;\n  font-size: 14px;\n  color: #000;\n  padding: 0;\n  min-width: 300px;\n  text-transform: uppercase;\n}\n.nombre-input[_ngcontent-%COMP%]:focus {\n  outline: none;\n}\n.dni-label[_ngcontent-%COMP%] {\n  font-weight: 400;\n  margin-left: auto;\n}\n.dni-input[_ngcontent-%COMP%] {\n  border: none;\n  background: transparent;\n  font-weight: 700;\n  font-size: 14px;\n  color: #000;\n  padding: 0;\n  width: 80px;\n  text-align: right;\n}\n.dni-input[_ngcontent-%COMP%]:focus {\n  outline: none;\n}\n.cuenta-label[_ngcontent-%COMP%] {\n  font-weight: 400;\n}\n.cuenta-input[_ngcontent-%COMP%] {\n  border: none;\n  background: transparent;\n  font-weight: 700;\n  font-size: 14px;\n  color: #000;\n  padding: 0;\n  width: 200px;\n}\n.cuenta-input[_ngcontent-%COMP%]:focus {\n  outline: none;\n}\n.parrafo-principal[_ngcontent-%COMP%] {\n  margin: 30px 0;\n  font-size: 14px;\n  line-height: 1.8;\n  text-align: justify;\n  color: #000;\n}\n.parrafo-principal[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-weight: 700;\n}\n.fecha-cancelacion[_ngcontent-%COMP%] {\n  margin: 30px 0;\n  font-size: 14px;\n  color: #000;\n}\n.despedida[_ngcontent-%COMP%] {\n  margin: 50px 0 20px 0;\n  font-size: 14px;\n  color: #000;\n  text-align: center;\n}\n.firma-section[_ngcontent-%COMP%] {\n  margin: 40px 0 60px 0;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n}\n.firma-imagen[_ngcontent-%COMP%] {\n  margin-bottom: 10px;\n}\n.firma-datos[_ngcontent-%COMP%] {\n  text-align: center;\n}\n.firma-nombre[_ngcontent-%COMP%] {\n  font-weight: 400;\n  font-size: 14px;\n  margin: 5px 0 0 0;\n  color: #000;\n}\n.firma-cargo[_ngcontent-%COMP%] {\n  font-size: 14px;\n  margin: 5px 0 0 0;\n  color: #000;\n}\n.footer-section[_ngcontent-%COMP%] {\n  position: absolute;\n  bottom: 2cm;\n  left: 2cm;\n  right: 2cm;\n}\n.footer-line[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 1px;\n  background: #000;\n  margin-bottom: 10px;\n}\n.footer-datos[_ngcontent-%COMP%] {\n  text-align: center;\n  font-size: 12px;\n  color: #666;\n  font-family:\n    "Arial Narrow",\n    Arial,\n    sans-serif;\n}\n.footer-datos[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 2px 0;\n}\n@media print {\n  .header-section[_ngcontent-%COMP%] {\n    display: none !important;\n  }\n  .document-wrapper[_ngcontent-%COMP%] {\n    padding: 0;\n  }\n  .document-container[_ngcontent-%COMP%] {\n    box-shadow: none;\n    margin: 0;\n  }\n  .toast-container[_ngcontent-%COMP%] {\n    display: none !important;\n  }\n}\n/*# sourceMappingURL=no-debt-letter-page.component.css.map */'] });
var NoDebtLetterPageComponent = _NoDebtLetterPageComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NoDebtLetterPageComponent, [{
    type: Component,
    args: [{ selector: "app-no-debt-letter-page", standalone: true, imports: [CommonModule, ReactiveFormsModule, LucideAngularModule], template: `<div class="no-debt-letter-container min-h-screen p-6 transition-colors duration-200"\r
     [class.bg-gray-50]="!isDarkMode"\r
     [class.bg-gray-900]="isDarkMode">\r
\r
  <!-- Toast Notifications -->\r
  <div class="toast-container">\r
    <div *ngFor="let toast of toasts"\r
         class="toast"\r
         [class.toast-error]="toast.type === 'error'"\r
         [class.toast-warning]="toast.type === 'warning'"\r
         [class.toast-success]="toast.type === 'success'">\r
      <span class="toast-icon">{{ toast.icon }}</span>\r
      <span class="toast-message">{{ toast.message }}</span>\r
      <button class="toast-close" (click)="removeToast(toast.id)">\xD7</button>\r
    </div>\r
  </div>\r
\r
  <!-- Header con b\xFAsqueda -->\r
  <div class="header-section rounded-lg shadow-md p-6 mb-6"\r
       [class.bg-white]="!isDarkMode"\r
       [class.bg-gray-800]="isDarkMode">\r
    <div class="flex items-center justify-between mb-4">\r
      <h1 class="text-2xl font-bold"\r
          [class.text-gray-800]="!isDarkMode"\r
          [class.text-gray-100]="isDarkMode">\r
        Generador de Carta de No Adeudo\r
      </h1>\r
\r
      <div class="flex gap-3">\r
        <button\r
          *ngIf="mostrarDocumento"\r
          type="button"\r
          class="btn-secondary"\r
          (click)="resetForm()">\r
          <lucide-angular name="x" [size]="18"></lucide-angular>\r
          Limpiar\r
        </button>\r
        <button\r
          *ngIf="mostrarDocumento"\r
          type="button"\r
          class="btn-primary"\r
          (click)="generarPDF()"\r
          [disabled]="isLoading || !letterForm.valid">\r
          <lucide-angular name="download" [size]="18"></lucide-angular>\r
          {{ isLoading ? 'Generando...' : 'Generar PDF' }}\r
        </button>\r
      </div>\r
    </div>\r
\r
    <!-- B\xFAsqueda -->\r
    <form [formGroup]="searchForm" class="flex items-center gap-3">\r
      <div class="flex-1 max-w-xs">\r
        <label class="block text-sm font-medium mb-1"\r
               [class.text-gray-700]="!isDarkMode"\r
               [class.text-gray-300]="isDarkMode">\r
          DNI del Cliente\r
        </label>\r
        <input\r
          formControlName="dniBusqueda"\r
          type="text"\r
          placeholder="Ingrese DNI"\r
          maxlength="8"\r
          (input)="onlyNumbers($event)"\r
          class="input-field"\r
          [class.border-red-500]="searchForm.get('dniBusqueda')?.invalid && searchForm.get('dniBusqueda')?.touched">\r
      </div>\r
\r
      <button\r
        type="button"\r
        class="btn-search mt-6"\r
        (click)="buscarPorDni()"\r
        [disabled]="searchForm.invalid || isLoading">\r
        <lucide-angular name="search" [size]="18"></lucide-angular>\r
        Buscar\r
      </button>\r
\r
      <div *ngIf="isLoading" class="mt-6">\r
        <lucide-angular name="loader" [size]="24" class="animate-spin text-blue-600"></lucide-angular>\r
      </div>\r
    </form>\r
  </div>\r
\r
  <!-- Documento Preview -->\r
  <div *ngIf="mostrarDocumento" class="document-wrapper">\r
    <div class="document-container bg-white shadow-2xl">\r
      <form [formGroup]="letterForm">\r
\r
        <!-- Header con logos -->\r
        <div class="header-logos">\r
          <div class="logo-left">\r
            <div class="logo-placeholder">LOGO NSOLUCIONES</div>\r
          </div>\r
          <div class="logo-right">\r
            <div class="logo-placeholder">LOGO NS</div>\r
          </div>\r
        </div>\r
\r
        <!-- Fecha -->\r
        <div class="fecha-container">\r
          <input\r
            type="date"\r
            formControlName="fechaActual"\r
            class="fecha-input">\r
          <div class="fecha-display">\r
            {{ formatDisplayDate(letterForm.get('fechaActual')?.value) }}\r
          </div>\r
        </div>\r
\r
        <!-- T\xEDtulo -->\r
        <h2 class="titulo-carta">CARTA DE NO ADEUDO</h2>\r
\r
        <!-- Introducci\xF3n -->\r
        <p class="texto-introduccion">\r
          Mediante la presente dejamos constancia que:\r
        </p>\r
\r
        <!-- Datos del titular -->\r
        <div class="datos-titular">\r
          <div class="dato-row">\r
            <input\r
              type="text"\r
              formControlName="nombreCompleto"\r
              class="nombre-input"\r
              readonly>\r
            <span class="dni-label">DNI:</span>\r
            <input\r
              type="text"\r
              formControlName="dni"\r
              class="dni-input"\r
              readonly>\r
          </div>\r
\r
          <div class="dato-row">\r
            <span class="cuenta-label">Titular de la cuenta Nro.</span>\r
            <input\r
              type="text"\r
              formControlName="numeroCuenta"\r
              class="cuenta-input"\r
              readonly>\r
          </div>\r
        </div>\r
\r
        <!-- P\xE1rrafo principal -->\r
        <div class="parrafo-principal">\r
          <p>\r
            Originada(s) en <strong>FINANCIERA OH!</strong> S.A, con RUC <strong>{{ rucFinanciera }}</strong>, cedido(s) a favor de\r
            <strong>NSOLUCIONES CONSULTING S.A.C.</strong> con RUC <strong>{{ rucNsoluciones }}</strong>, mediante contrato de\r
            trasferencia de cartera crediticia en la modalidad de cesi\xF3n de derechos, quien a la fecha es\r
            el actual acreedor, no mantiene deuda o saldo deudor en nuestra empresa sobre el(los)\r
            cr\xE9dito(s) antes mencionado(s), registr\xE1ndose en situaci\xF3n de <strong>CANCELADO</strong>.\r
          </p>\r
        </div>\r
\r
        <!-- Fecha de cancelaci\xF3n -->\r
        <div class="fecha-cancelacion">\r
          <p>\r
            Y la fecha de cancelaci\xF3n de esta(s) obligaci\xF3n(es) fue el d\xEDa\r
            <input\r
              type="date"\r
              formControlName="fechaCancelacion"\r
              class="fecha-input inline-block">\r
            <span class="fecha-display inline-block">\r
              {{ formatDisplayDate(letterForm.get('fechaCancelacion')?.value) }}\r
            </span>.\r
          </p>\r
        </div>\r
\r
        <!-- Despedida -->\r
        <div class="despedida">\r
          <p>Atentamente,</p>\r
        </div>\r
\r
        <!-- Firma -->\r
        <div class="firma-section">\r
          <div class="firma-imagen">\r
            <div class="logo-placeholder small">FIRMA</div>\r
          </div>\r
          <div class="firma-datos">\r
            <p class="firma-nombre">{{ firmaNombre }}</p>\r
            <p class="firma-cargo">{{ firmaCargo }}</p>\r
          </div>\r
        </div>\r
\r
        <!-- Footer -->\r
        <div class="footer-section">\r
          <div class="footer-line"></div>\r
          <div class="footer-datos">\r
            <p>{{ direccion }}</p>\r
            <p>{{ telefono }}</p>\r
          </div>\r
        </div>\r
\r
      </form>\r
    </div>\r
  </div>\r
\r
</div>\r
`, styles: ['/* src/app/features/legacy/agreements/pages/no-debt-letter-page/no-debt-letter-page.component.css */\n.no-debt-letter-container {\n  max-width: 1400px;\n  margin: 0 auto;\n}\n.toast-container {\n  position: fixed;\n  top: 20px;\n  right: 20px;\n  z-index: 9999;\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n}\n.toast {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  padding: 12px 16px;\n  border-radius: 8px;\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);\n  min-width: 300px;\n  max-width: 500px;\n  animation: slideIn 0.3s ease-out;\n  background: white;\n}\n.toast-error {\n  border-left: 4px solid #ef4444;\n}\n.toast-warning {\n  border-left: 4px solid #f59e0b;\n}\n.toast-success {\n  border-left: 4px solid #10b981;\n}\n.toast-icon {\n  font-size: 20px;\n  flex-shrink: 0;\n}\n.toast-message {\n  flex: 1;\n  font-size: 14px;\n  color: #374151;\n}\n.toast-close {\n  background: none;\n  border: none;\n  font-size: 24px;\n  color: #9ca3af;\n  cursor: pointer;\n  padding: 0;\n  width: 24px;\n  height: 24px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  border-radius: 4px;\n  transition: all 0.2s;\n}\n.toast-close:hover {\n  background: #f3f4f6;\n  color: #374151;\n}\n@keyframes slideIn {\n  from {\n    transform: translateX(400px);\n    opacity: 0;\n  }\n  to {\n    transform: translateX(0);\n    opacity: 1;\n  }\n}\n.btn-primary {\n  display: inline-flex;\n  align-items: center;\n  gap: 8px;\n  padding: 10px 20px;\n  background:\n    linear-gradient(\n      135deg,\n      #3b82f6 0%,\n      #8b5cf6 100%);\n  color: white;\n  border: none;\n  border-radius: 8px;\n  font-weight: 600;\n  cursor: pointer;\n  transition: all 0.3s;\n  box-shadow: 0 4px 6px rgba(59, 130, 246, 0.3);\n}\n.btn-primary:hover:not(:disabled) {\n  transform: translateY(-2px);\n  box-shadow: 0 6px 12px rgba(59, 130, 246, 0.4);\n}\n.btn-primary:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n.btn-secondary {\n  display: inline-flex;\n  align-items: center;\n  gap: 8px;\n  padding: 10px 20px;\n  background: white;\n  color: #6b7280;\n  border: 2px solid #e5e7eb;\n  border-radius: 8px;\n  font-weight: 600;\n  cursor: pointer;\n  transition: all 0.3s;\n}\n.btn-secondary:hover {\n  background: #f9fafb;\n  border-color: #d1d5db;\n}\n.btn-search {\n  display: inline-flex;\n  align-items: center;\n  gap: 8px;\n  padding: 10px 20px;\n  background: #3b82f6;\n  color: white;\n  border: none;\n  border-radius: 8px;\n  font-weight: 600;\n  cursor: pointer;\n  transition: all 0.3s;\n}\n.btn-search:hover:not(:disabled) {\n  background: #2563eb;\n}\n.btn-search:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n.input-field {\n  width: 100%;\n  padding: 10px 14px;\n  border: 2px solid #e5e7eb;\n  border-radius: 8px;\n  font-size: 14px;\n  transition: all 0.3s;\n  background: white;\n  color: #111827;\n}\n.input-field:focus {\n  outline: none;\n  border-color: #3b82f6;\n  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);\n}\n.input-field:disabled {\n  background: #f3f4f6;\n  cursor: not-allowed;\n}\n:host-context(.dark) .input-field {\n  background: #374151;\n  border-color: #4b5563;\n  color: #f9fafb;\n}\n.document-wrapper {\n  display: flex;\n  justify-content: center;\n  padding: 20px 0;\n}\n.document-container {\n  width: 21cm;\n  min-height: 29.7cm;\n  padding: 2cm;\n  background: white;\n  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);\n  position: relative;\n}\n.header-logos {\n  display: flex;\n  justify-content: space-between;\n  align-items: flex-start;\n  margin-bottom: 40px;\n}\n.logo-placeholder {\n  display: inline-block;\n  padding: 10px 20px;\n  background: #ecf0f1;\n  border: 2px dashed #bdc3c7;\n  color: #7f8c8d;\n  font-weight: bold;\n  font-size: 12px;\n}\n.logo-placeholder.small {\n  padding: 5px 10px;\n  font-size: 10px;\n}\n.fecha-container {\n  text-align: right;\n  margin-bottom: 40px;\n  position: relative;\n}\n.fecha-input {\n  position: absolute;\n  right: 0;\n  opacity: 0;\n  width: 0;\n  height: 0;\n  pointer-events: none;\n}\n.fecha-display {\n  font-size: 14px;\n  color: #000;\n}\n.titulo-carta {\n  text-align: center;\n  font-size: 18px;\n  font-weight: 700;\n  margin: 30px 0;\n  color: #000;\n}\n.texto-introduccion {\n  font-size: 14px;\n  margin-bottom: 20px;\n  color: #000;\n}\n.datos-titular {\n  margin: 20px 0;\n}\n.dato-row {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  font-size: 14px;\n  color: #000;\n}\n.nombre-input {\n  border: none;\n  background: transparent;\n  font-weight: 700;\n  font-size: 14px;\n  color: #000;\n  padding: 0;\n  min-width: 300px;\n  text-transform: uppercase;\n}\n.nombre-input:focus {\n  outline: none;\n}\n.dni-label {\n  font-weight: 400;\n  margin-left: auto;\n}\n.dni-input {\n  border: none;\n  background: transparent;\n  font-weight: 700;\n  font-size: 14px;\n  color: #000;\n  padding: 0;\n  width: 80px;\n  text-align: right;\n}\n.dni-input:focus {\n  outline: none;\n}\n.cuenta-label {\n  font-weight: 400;\n}\n.cuenta-input {\n  border: none;\n  background: transparent;\n  font-weight: 700;\n  font-size: 14px;\n  color: #000;\n  padding: 0;\n  width: 200px;\n}\n.cuenta-input:focus {\n  outline: none;\n}\n.parrafo-principal {\n  margin: 30px 0;\n  font-size: 14px;\n  line-height: 1.8;\n  text-align: justify;\n  color: #000;\n}\n.parrafo-principal strong {\n  font-weight: 700;\n}\n.fecha-cancelacion {\n  margin: 30px 0;\n  font-size: 14px;\n  color: #000;\n}\n.despedida {\n  margin: 50px 0 20px 0;\n  font-size: 14px;\n  color: #000;\n  text-align: center;\n}\n.firma-section {\n  margin: 40px 0 60px 0;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n}\n.firma-imagen {\n  margin-bottom: 10px;\n}\n.firma-datos {\n  text-align: center;\n}\n.firma-nombre {\n  font-weight: 400;\n  font-size: 14px;\n  margin: 5px 0 0 0;\n  color: #000;\n}\n.firma-cargo {\n  font-size: 14px;\n  margin: 5px 0 0 0;\n  color: #000;\n}\n.footer-section {\n  position: absolute;\n  bottom: 2cm;\n  left: 2cm;\n  right: 2cm;\n}\n.footer-line {\n  width: 100%;\n  height: 1px;\n  background: #000;\n  margin-bottom: 10px;\n}\n.footer-datos {\n  text-align: center;\n  font-size: 12px;\n  color: #666;\n  font-family:\n    "Arial Narrow",\n    Arial,\n    sans-serif;\n}\n.footer-datos p {\n  margin: 2px 0;\n}\n@media print {\n  .header-section {\n    display: none !important;\n  }\n  .document-wrapper {\n    padding: 0;\n  }\n  .document-container {\n    box-shadow: none;\n    margin: 0;\n  }\n  .toast-container {\n    display: none !important;\n  }\n}\n/*# sourceMappingURL=no-debt-letter-page.component.css.map */\n'] }]
  }], () => [{ type: FormBuilder }, { type: AgreementsService }, { type: ThemeService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(NoDebtLetterPageComponent, { className: "NoDebtLetterPageComponent", filePath: "src/app/features/legacy/agreements/pages/no-debt-letter-page/no-debt-letter-page.component.ts", lineNumber: 15 });
})();
export {
  NoDebtLetterPageComponent
};
//# sourceMappingURL=chunk-BEYJ2LZT.js.map
